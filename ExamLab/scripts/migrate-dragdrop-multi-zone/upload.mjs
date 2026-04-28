#!/usr/bin/env node
/**
 * Bundle J Phase 9 — upload
 *
 * Liest migriert.json (Output von migrate.mjs) und ruft batchUpdateFragenMigration
 * pro Fachbereich auf. Nutzt den generischen `felder`-Patch (Phase 9.0):
 *   { id, felder: { zielzonen, labels, pruefungstauglich: false } }
 *
 * pruefungstauglich wird im Endpoint zusaetzlich automatisch auf false gesetzt
 * (Default), aber wir senden es explizit fuer Klarheit.
 *
 * Bei Apps-Script-Timeout (5min) oder HTTP-Fehler: split Call in Haelften + retry
 * (analog C9-Pattern).
 *
 * Usage:
 *   export APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 *   export MIGRATION_EMAIL=admin@gymhofwil.ch
 *   node upload.mjs [--dry-run] [--fachbereich=BWL] [--ids=f1,f2,f3]
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL
const MIGRATION_EMAIL = process.env.MIGRATION_EMAIL

if (!APPS_SCRIPT_URL) {
  console.error('FEHLER: APPS_SCRIPT_URL env nicht gesetzt')
  process.exit(1)
}
if (!MIGRATION_EMAIL) {
  console.error('FEHLER: MIGRATION_EMAIL env nicht gesetzt (Admin-LP-E-Mail)')
  process.exit(1)
}

const DRY_RUN = process.argv.includes('--dry-run')
const FACHBEREICH_FILTER = (() => {
  const arg = process.argv.find((a) => a.startsWith('--fachbereich='))
  return arg ? arg.split('=')[1] : null
})()
const IDS_FILTER = (() => {
  const arg = process.argv.find((a) => a.startsWith('--ids='))
  if (!arg) return null
  return new Set(arg.split('=')[1].split(',').map((s) => s.trim()).filter(Boolean))
})()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const INPUT = path.join(__dirname, 'migriert.json')
const LOG = path.join(__dirname, 'upload.log')

async function appendLog(line) {
  await fs.appendFile(LOG, `[${new Date().toISOString()}] ${line}\n`)
}

async function appsScriptCall(fachbereich, updates) {
  const r = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'batchUpdateFragenMigration',
      email: MIGRATION_EMAIL,
      fachbereich,
      updates,
    }),
    redirect: 'follow',
  })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

async function uploadFachbereich(fachbereich, items) {
  const updates = items.map((it) => ({
    id: it.id,
    felder: {
      zielzonen: it.zielzonen,
      labels: it.labels,
      pruefungstauglich: false,
    },
  }))
  console.log(`[upload] ${fachbereich}: ${updates.length} Updates...`)
  await appendLog(`${fachbereich}: starte mit ${updates.length} Updates`)
  if (DRY_RUN) {
    console.log(`[upload] DRY-RUN: skip Apps-Script-Call`)
    return { success: true, aktualisiert: updates.length, nichtGefunden: [] }
  }
  try {
    const res = await appsScriptCall(fachbereich, updates)
    await appendLog(`${fachbereich}: response ${JSON.stringify(res)}`)
    if (res.error) throw new Error(`Apps-Script: ${res.error}`)
    return res
  } catch (e) {
    if (
      updates.length > 50 &&
      (e.message.includes('timeout') ||
        e.message.includes('exceeded') ||
        e.message.includes('HTTP 5') ||
        e.message.includes('HTTP 4'))
    ) {
      console.warn(`[upload] ${fachbereich} Fehler (${e.message}) — split in Haelften`)
      await appendLog(`${fachbereich}: split nach Fehler ${e.message}`)
      const mid = Math.floor(items.length / 2)
      const r1 = await uploadFachbereich(fachbereich, items.slice(0, mid))
      const r2 = await uploadFachbereich(fachbereich, items.slice(mid))
      return {
        success: r1.success && r2.success,
        aktualisiert: (r1.aktualisiert || 0) + (r2.aktualisiert || 0),
        nichtGefunden: [...(r1.nichtGefunden || []), ...(r2.nichtGefunden || [])],
      }
    }
    throw e
  }
}

async function main() {
  const text = await fs.readFile(INPUT, 'utf8')
  const alle = JSON.parse(text)
  if (!Array.isArray(alle)) throw new Error(`Input ${INPUT} ist kein Array`)
  console.log(`[upload] ${alle.length} Updates in ${INPUT}`)

  // Gruppiere nach fachbereich (Endpoint braucht fachbereich-Param)
  const proFach = {}
  for (const item of alle) {
    if (FACHBEREICH_FILTER && item.fachbereich !== FACHBEREICH_FILTER) continue
    if (IDS_FILTER && !IDS_FILTER.has(item.id)) continue
    if (!proFach[item.fachbereich]) proFach[item.fachbereich] = []
    proFach[item.fachbereich].push(item)
  }

  const results = {}
  for (const fachbereich of Object.keys(proFach).sort()) {
    results[fachbereich] = await uploadFachbereich(fachbereich, proFach[fachbereich])
  }

  console.log('\n[upload] === ZUSAMMENFASSUNG ===')
  let totalOk = 0
  let totalNotFound = 0
  for (const [fb, r] of Object.entries(results)) {
    const ok = r.aktualisiert || 0
    const nf = r.nichtGefunden?.length || 0
    totalOk += ok
    totalNotFound += nf
    console.log(`  ${fb}: aktualisiert=${ok}, nichtGefunden=${nf}`)
    if (nf > 0) {
      console.log(`    IDs: ${r.nichtGefunden.slice(0, 10).join(', ')}${nf > 10 ? ` (+${nf - 10} weitere)` : ''}`)
    }
  }
  console.log(`  TOTAL: ${totalOk} aktualisiert, ${totalNotFound} nicht gefunden`)
  await appendLog(`FERTIG: total ${totalOk} OK, ${totalNotFound} not-found`)
  if (totalNotFound > 0 && !FACHBEREICH_FILTER && !IDS_FILTER) {
    process.exit(2)  // Soft-Fehler — nichtGefunden bei Full-Run ist auffaellig
  }
}

main().catch((e) => {
  console.error('[upload] Abbruch:', e.message)
  process.exit(1)
})
