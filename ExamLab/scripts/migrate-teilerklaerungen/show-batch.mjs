#!/usr/bin/env node
/**
 * Zeigt die nächsten BATCH_SIZE Fragen (nicht in state.fragen.done) strukturiert.
 * Sortierung: Fachbereich → Typ → ID für Determinismus.
 * Nur nicht-Informatik.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '100', 10)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const INPUT = path.join(__dirname, 'fragen-input.jsonl')
const STATE = path.join(__dirname, 'state.json')

const [text, state] = await Promise.all([
  fs.readFile(INPUT, 'utf8'),
  fs.readFile(STATE, 'utf8').then(JSON.parse),
])

const fragen = text.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l))

const pending = fragen.filter(
  (f) =>
    f.fachbereich !== 'Informatik' &&
    !(state.fragen[f.id]?.status === 'done' || state.fragen[f.id]?.status === 'skip'),
)

const fachOrd = { Recht: 0, VWL: 1, BWL: 2 }
pending.sort((a, b) => {
  if (fachOrd[a.fachbereich] !== fachOrd[b.fachbereich])
    return (fachOrd[a.fachbereich] ?? 99) - (fachOrd[b.fachbereich] ?? 99)
  if (a.typ !== b.typ) return a.typ.localeCompare(b.typ)
  return String(a.id).localeCompare(String(b.id))
})

const batch = pending.slice(0, BATCH_SIZE)

function sub(f) {
  const o = {}
  if (f.optionen) o.optionen = f.optionen.map((x) => ({ id: x.id, text: x.text, korrekt: !!x.korrekt }))
  if (f.aussagen) o.aussagen = f.aussagen.map((x) => ({ id: x.id, text: x.text, korrekt: !!x.korrekt }))
  if (f.luecken)
    o.luecken = f.luecken.map((x) => ({
      id: x.id,
      korrekt: x.korrekteAntworten || x.korrekt || x.alternativen,
    }))
  if (f.bereiche)
    o.bereiche = f.bereiche.map((x) => ({ id: x.id, label: x.label, korrekt: !!x.korrekt }))
  if (f.zielzonen)
    o.zielzonen = f.zielzonen.map((x) => ({ id: x.id, korrektesLabel: x.korrektesLabel }))
  if (f.beschriftungen)
    o.beschriftungen = f.beschriftungen.map((x) => ({ id: x.id, korrekt: x.korrekt }))
  if (f.aufgaben) o.aufgaben = f.aufgaben.map((x) => ({ id: x.id, text: x.text }))
  if (f.buchungen)
    o.buchungen = f.buchungen.map((x) => ({
      id: x.id,
      sollKonto: x.sollKonto,
      habenKonto: x.habenKonto,
      betrag: x.betrag,
    }))
  if (f.kontenMitSaldi)
    o.kontenMitSaldi = f.kontenMitSaldi.map((x) => ({
      kontonummer: x.kontonummer,
      name: x.name,
      saldo: x.saldo,
    }))
  if (f.paare) o.paare = f.paare.map((p) => ({ links: p.links, rechts: p.rechts }))
  if (f.konten) o.konten = f.konten
  if (f.loesung) o.loesung = f.loesung
  if (f.items && f.typ === 'sortierung') o.items = f.items
  if (f.korrekt && !f.optionen && !f.luecken) o.korrekt = f.korrekt
  if (f.toleranz !== undefined) o.toleranz = f.toleranz
  if (f.einheit) o.einheit = f.einheit
  if (f.formel) o.formel = f.formel
  return o
}

console.log(`# Batch ${batch.length}/${pending.length} pending (total: ${fragen.length})`)
console.log(`# Verteilung:`)
const cnt = {}
for (const f of batch) {
  const k = `${f.fachbereich}/${f.typ}`
  cnt[k] = (cnt[k] || 0) + 1
}
for (const k of Object.keys(cnt).sort()) console.log(`#   ${k}: ${cnt[k]}`)
console.log('')

for (const f of batch) {
  const entry = {
    id: f.id,
    fachbereich: f.fachbereich,
    thema: f.thema,
    unterthema: f.unterthema,
    typ: f.typ,
    bloom: f.bloom,
    fragetext: f.fragetext,
    alteMusterlosung: f.musterlosung,
    ...sub(f),
  }
  console.log('===FRAGE===')
  console.log(JSON.stringify(entry, null, 2))
}
