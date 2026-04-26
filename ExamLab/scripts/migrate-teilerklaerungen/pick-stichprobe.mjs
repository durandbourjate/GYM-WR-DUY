#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const INPUT = path.join(__dirname, 'fragen-input.jsonl')
const OUTPUT = path.join(__dirname, 'stichprobe-ids.json')

function seededRandom(seed) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

const text = await fs.readFile(INPUT, 'utf8')
const fragen = text.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l))

const gruppen = {}
for (const f of fragen) {
  if (!f.fachbereich || f.fachbereich === 'Informatik') continue
  if (!gruppen[f.fachbereich]) gruppen[f.fachbereich] = {}
  if (!gruppen[f.fachbereich][f.typ]) gruppen[f.fachbereich][f.typ] = []
  gruppen[f.fachbereich][f.typ].push(f)
}

// Angepasst: Recht hat keine zuordnung — Substitution durch lueckentext.
// zuordnung wandert zu VWL (78 verfuegbar).
const verteilung = {
  Recht: { mc: 3, richtigfalsch: 3, lueckentext: 4 },
  VWL: {
    mc: 2,
    richtigfalsch: 2,
    berechnung: 2,
    hotspot: 1,
    bildbeschriftung: 1,
    dragdrop_bild: 1,
    zuordnung: 1,
  },
  BWL: {
    mc: 2,
    buchungssatz: 2,
    kontenbestimmung: 2,
    tkonto: 1,
    bilanzstruktur: 2,
    dragdrop_bild: 1,
  },
}

const rand = seededRandom(42)
const ids = []
const fehltWarnings = []
const zusammensetzung = {}

for (const [fb, typenMap] of Object.entries(verteilung)) {
  zusammensetzung[fb] = {}
  for (const [typ, count] of Object.entries(typenMap)) {
    const pool = gruppen[fb]?.[typ] || []
    if (pool.length === 0) {
      fehltWarnings.push(`${fb} ${typ}: 0 Fragen in DB`)
      zusammensetzung[fb][typ] = 0
      continue
    }
    const shuffled = [...pool].sort(() => rand() - 0.5)
    const picked = shuffled.slice(0, Math.min(count, pool.length))
    for (const f of picked) ids.push(f.id)
    zusammensetzung[fb][typ] = picked.length
    if (picked.length < count) {
      fehltWarnings.push(`${fb} ${typ}: nur ${picked.length} von ${count} gewuenschten verfuegbar`)
    }
  }
}

await fs.writeFile(
  OUTPUT,
  JSON.stringify({ seed: 42, total: ids.length, zusammensetzung, ids, fehltWarnings }, null, 2),
)
console.log(`${ids.length} Stichproben-IDs nach ${OUTPUT} geschrieben`)
console.log('Zusammensetzung:', JSON.stringify(zusammensetzung, null, 2))
if (fehltWarnings.length) console.log('Warnings:', fehltWarnings)
