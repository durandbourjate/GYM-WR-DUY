#!/usr/bin/env node
/**
 * C9 Phase 4 — Migrations-Skript fuer Teilerklaerungen.
 *
 * Laedt alle Fragen via Apps-Script Admin-Endpoint `holeAlleFragenFuerMigration`,
 * generiert pro Frage eine Musterloesung + Teilerklaerungen via Anthropic-SDK
 * (prompts identisch zum Editor-Pfad, siehe prompts.mjs), und schreibt das
 * Ergebnis via `speichereFrage`-Endpoint zurueck.
 *
 * Idempotent (ueberspringt Fragen mit bereits vorhandenen erklaerung-Feldern),
 * Resume-faehig (state.json), mit Dry-Run-Modus.
 *
 * Usage:
 *   export ANTHROPIC_API_KEY=sk-ant-...
 *   export APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 *   export MIGRATION_EMAIL=admin@gymhofwil.ch      # LP-E-Mail (muss Admin-Rechte haben)
 *   npm install
 *   node migrate.mjs --dry-run --limit=20          # 20 Fragen trocken
 *   node migrate.mjs --limit=50                    # 50 Fragen live
 *   node migrate.mjs                               # alle Fragen (~2400, ~160 min)
 *
 * Nach Abbruch einfach erneut starten — die State-Datei stellt sicher, dass
 * keine Frage doppelt verarbeitet wird.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Anthropic from '@anthropic-ai/sdk'
import {
  SYSTEM_PROMPT,
  buildUserPrompt,
  computeMaxTokens,
  normalisiereResponse,
} from './prompts.mjs'

// === Env ===
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL
const API_KEY = process.env.ANTHROPIC_API_KEY
const MIGRATION_EMAIL = process.env.MIGRATION_EMAIL

if (!API_KEY) {
  console.error('FEHLER: ANTHROPIC_API_KEY env var nicht gesetzt.')
  process.exit(1)
}
if (!APPS_SCRIPT_URL) {
  console.error('FEHLER: APPS_SCRIPT_URL env var nicht gesetzt (Apps-Script Web-App-URL).')
  process.exit(1)
}
if (!MIGRATION_EMAIL) {
  console.error('FEHLER: MIGRATION_EMAIL env var nicht gesetzt (LP-E-Mail mit Admin-Rechten).')
  process.exit(1)
}

// === CLI-Args ===
const rawArgs = process.argv.slice(2)
const DRY_RUN = rawArgs.includes('--dry-run')
const LIMIT = (() => {
  const arg = rawArgs.find((a) => a.startsWith('--limit='))
  return arg ? parseInt(arg.split('=')[1], 10) || 0 : 0
})()
const MODEL = process.env.MIGRATION_MODEL || 'claude-sonnet-4-6'
const RATE_LIMIT_MS = parseInt(process.env.MIGRATION_RATE_LIMIT_MS || '800', 10)

// === Pfade ===
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STATE_PATH = path.join(__dirname, 'state.json')
const LOG_PATH = path.join(__dirname, 'log.jsonl')

// === Anthropic ===
const client = new Anthropic({ apiKey: API_KEY })

// === State + Log ===
async function loadState() {
  try {
    const raw = await fs.readFile(STATE_PATH, 'utf8')
    return JSON.parse(raw)
  } catch {
    return { gestartet: new Date().toISOString(), fragen: {} }
  }
}
async function saveState(state) {
  await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2))
}
async function logLine(obj) {
  await fs.appendFile(LOG_PATH, JSON.stringify({ zeit: new Date().toISOString(), ...obj }) + '\n')
}

// === Apps-Script-Calls ===
async function appsScriptPost(action, extra) {
  const body = { action, email: MIGRATION_EMAIL, ...extra }
  const r = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body),
    redirect: 'follow',
  })
  if (!r.ok) throw new Error(`Apps-Script ${action} HTTP ${r.status}`)
  const json = await r.json()
  if (json.error) throw new Error(`Apps-Script ${action}: ${json.error}`)
  return json
}

async function ladeAlleFragen() {
  const json = await appsScriptPost('holeAlleFragenFuerMigration')
  const fragen = json.data || json.fragen || []
  if (!Array.isArray(fragen)) {
    throw new Error('Apps-Script holeAlleFragenFuerMigration: data ist kein Array')
  }
  return fragen
}

async function speichereFrage(frage) {
  const json = await appsScriptPost('speichereFrage', { frage })
  if (!json.success) throw new Error(`speichereFrage: ${json.error || 'unbekannt'}`)
  return json
}

// === Claude-Call ===
async function bereicherFrage(frage) {
  const maxTokens = computeMaxTokens(frage)
  const userPrompt = buildUserPrompt(frage)
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userPrompt }],
  })
  const text = msg.content.map((c) => (c.type === 'text' ? c.text : '')).join('').trim()
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch (e) {
    throw new Error(`JSON-Parse fehlgeschlagen: ${e.message}. Response-Start: ${text.slice(0, 120)}`)
  }
  return normalisiereResponse(parsed, frage)
}

// === Idempotenz-Check ===
const FELDER_MIT_ERKLAERUNG = [
  'optionen', 'aussagen', 'paare', 'luecken', 'bereiche',
  'zielzonen', 'beschriftungen', 'aufgaben', 'buchungen',
  'kontenMitSaldi', 'konten',
]
function hatBereitsErklaerungen(frage) {
  for (const feld of FELDER_MIT_ERKLAERUNG) {
    const arr = frage[feld]
    if (!Array.isArray(arr)) continue
    if (arr.some((el) => el && typeof el.erklaerung === 'string' && el.erklaerung.trim().length >= 10)) {
      return true
    }
  }
  return false
}

// === Writeback: teilerklaerungen in frage.<feld>[i].erklaerung einsortieren ===
function mergeTeilerklaerungen(frage, musterloesung, teilerklaerungen) {
  // Musterloesung nur setzen wenn Original leer (Plan-Regel)
  if (!frage.musterlosung || frage.musterlosung.trim().length < 10) {
    frage.musterlosung = musterloesung
  }
  // Teilerklaerungen pro feld/id in die Sub-Arrays schreiben
  for (const t of teilerklaerungen) {
    const arr = frage[t.feld]
    if (!Array.isArray(arr)) continue
    const idKey = t.feld === 'kontenMitSaldi' ? 'kontonummer' : 'id'
    const el = arr.find((x) => x && x[idKey] === t.id)
    if (el) el.erklaerung = t.text
  }
  return frage
}

// === Main ===
async function main() {
  const state = await loadState()
  console.log(`[Migration] Starte. DRY_RUN=${DRY_RUN}, LIMIT=${LIMIT || 'alle'}, MODEL=${MODEL}`)
  console.log(`[Migration] Bestehende State-Datei: ${Object.keys(state.fragen).length} Eintraege`)

  const fragen = await ladeAlleFragen()
  console.log(`[Migration] ${fragen.length} Fragen aus Backend geladen`)

  const counts = { done: 0, skipped: 0, failed: 0, 'giving-up': 0, resumed: 0 }
  let processed = 0

  for (const frage of fragen) {
    if (LIMIT > 0 && processed >= LIMIT) break

    const entry = state.fragen[frage.id]
    if (entry?.status === 'done' || entry?.status === 'giving-up' || entry?.status === 'skipped') {
      counts.resumed++
      continue
    }

    if (hatBereitsErklaerungen(frage)) {
      state.fragen[frage.id] = {
        status: 'skipped',
        grund: 'hat bereits erklaerungen',
        zeitpunkt: new Date().toISOString(),
      }
      counts.skipped++
      await saveState(state)
      await logLine({ id: frage.id, status: 'skipped', grund: 'has-erklaerungen' })
      processed++
      continue
    }

    try {
      const { musterloesung, teilerklaerungen } = await bereicherFrage(frage)
      if (teilerklaerungen.length === 0 && (!musterloesung || musterloesung.length < 10)) {
        // Nichts zu schreiben — z.B. Freitext ohne Sub-Struktur und leere Claude-Response.
        state.fragen[frage.id] = {
          status: 'skipped',
          grund: 'kein inhalt aus KI',
          zeitpunkt: new Date().toISOString(),
        }
        counts.skipped++
      } else {
        const modifiziert = mergeTeilerklaerungen(frage, musterloesung, teilerklaerungen)
        if (!DRY_RUN) {
          await speichereFrage(modifiziert)
        }
        state.fragen[frage.id] = {
          status: 'done',
          teile: teilerklaerungen.length,
          musterloesung: musterloesung.slice(0, 120),
          dry: DRY_RUN,
          zeitpunkt: new Date().toISOString(),
        }
        counts.done++
      }
      await saveState(state)
      await logLine({
        id: frage.id,
        typ: frage.typ,
        status: state.fragen[frage.id].status,
        dry: DRY_RUN,
        teile: teilerklaerungen.length,
        musterloesung_preview: musterloesung.slice(0, 80),
      })
    } catch (e) {
      const prev = state.fragen[frage.id]?.retries || 0
      const retries = prev + 1
      const status = retries >= 3 ? 'giving-up' : 'failed'
      state.fragen[frage.id] = {
        status,
        fehler: e.message,
        retries,
        zeitpunkt: new Date().toISOString(),
      }
      counts[status]++
      await saveState(state)
      await logLine({ id: frage.id, status, fehler: e.message, retries })
      console.warn(`[${status}] ${frage.id}: ${e.message}`)
    }

    processed++
    if (processed % 10 === 0) {
      console.log(`[Migration] ${processed}/${LIMIT || fragen.length} — counts: ${JSON.stringify(counts)}`)
    }
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS))
  }

  console.log(`[Migration] Fertig. Verarbeitet: ${processed}. Counts: ${JSON.stringify(counts)}`)
  console.log(`[Migration] State: ${STATE_PATH}`)
  console.log(`[Migration] Log: ${LOG_PATH}`)
}

main().catch((e) => {
  console.error('[Migration] Abbruch:', e.message)
  process.exit(1)
})
