#!/usr/bin/env node
/**
 * Bundle J Phase 9 — migrate
 *
 * Liest fragen.json (Output von dump.mjs), filtert auf dragdrop_bild-Fragen die
 * Migration brauchen, und schreibt das Upload-Patch-Format nach migriert.json.
 *
 * Migrations-Regeln:
 * - zielzonen[i].korrektesLabel: string  → zielzonen[i].korrekteLabels: string[]
 *   (`korrektesLabel` bleibt im Output bestehen — Backwards-Compat fuer alte
 *   Frontends, Cleanup-Bundle entfernt es spaeter aus dem Type)
 * - labels: string[]  → labels: DragDropBildLabel[] mit {id, text}
 *   IDs deterministisch via stabilId(frageId, text, index)
 *
 * Idempotent: bereits migrierte Fragen werden uebersprungen (nicht im Output).
 *
 * Output-Format (Array, ein Eintrag pro Frage die Migration braucht):
 *   { id, fachbereich, zielzonen, labels }
 *
 * Plan-Bug-Fix S159: util/ → utils/ (Pfad-Korrektur).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stabilId } from '../../../packages/shared/src/utils/stabilId.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const INPUT = path.resolve(__dirname, process.argv[2] ?? 'fragen.json')
const OUTPUT = path.join(__dirname, 'migriert.json')

function zonenSindAlt(zielzonen) {
  if (!Array.isArray(zielzonen) || zielzonen.length === 0) return false
  return zielzonen.some(
    (z) => !Array.isArray(z.korrekteLabels) || z.korrekteLabels.length === 0,
  )
}

function labelsSindAlt(labels) {
  if (!Array.isArray(labels) || labels.length === 0) return false
  return labels.some((l) => typeof l === 'string')
}

function migriereZielzonen(zielzonen) {
  return (zielzonen ?? []).map((z) => {
    const out = { ...z }
    if (Array.isArray(out.korrekteLabels) && out.korrekteLabels.length > 0) {
      return out
    }
    if (typeof z.korrektesLabel === 'string' && z.korrektesLabel.trim().length > 0) {
      out.korrekteLabels = [z.korrektesLabel]
    } else {
      out.korrekteLabels = []
    }
    return out
  })
}

function migriereLabels(frageId, labels) {
  if (!Array.isArray(labels)) return []
  return labels.map((l, i) => {
    if (typeof l === 'string') {
      return { id: stabilId(frageId, l, i), text: l }
    }
    if (l && typeof l === 'object' && typeof l.text === 'string') {
      return { id: l.id ?? stabilId(frageId, l.text, i), text: l.text }
    }
    return { id: stabilId(frageId, '', i), text: '' }
  })
}

async function main() {
  const text = await fs.readFile(INPUT, 'utf8')
  const fragen = JSON.parse(text)
  if (!Array.isArray(fragen)) throw new Error(`Input ${INPUT} ist kein Array`)

  const migrationen = []
  let bereitsNeu = 0
  let nichtDnd = 0
  const proFach = {}

  for (const f of fragen) {
    if (f.typ !== 'dragdrop_bild') {
      nichtDnd++
      continue
    }
    const needs = zonenSindAlt(f.zielzonen) || labelsSindAlt(f.labels)
    if (!needs) {
      bereitsNeu++
      continue
    }
    if (!f.fachbereich) {
      console.warn(`[migrate] WARNUNG: Frage ${f.id} hat kein fachbereich-Feld — uebersprungen`)
      continue
    }
    const zielzonen = migriereZielzonen(f.zielzonen)
    const labels = migriereLabels(f.id, f.labels)
    migrationen.push({
      id: f.id,
      fachbereich: f.fachbereich,
      zielzonen,
      labels,
    })
    proFach[f.fachbereich] = (proFach[f.fachbereich] || 0) + 1
  }

  await fs.writeFile(OUTPUT, JSON.stringify(migrationen, null, 2) + '\n')

  console.error(`[migrate] Input: ${fragen.length} Fragen`)
  console.error(`[migrate]   nicht-DnD: ${nichtDnd} (uebersprungen)`)
  console.error(`[migrate]   bereits-neu: ${bereitsNeu} (uebersprungen, idempotent)`)
  console.error(`[migrate]   migriert: ${migrationen.length}`)
  console.error(`[migrate] Pro Fachbereich:`, proFach)
  console.error(`[migrate] Output: ${OUTPUT}`)
}

main().catch((e) => {
  console.error('[migrate] Abbruch:', e.message)
  process.exit(1)
})
