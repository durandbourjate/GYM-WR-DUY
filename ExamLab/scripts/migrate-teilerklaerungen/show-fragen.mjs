#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const INPUT = path.join(__dirname, 'fragen-input.jsonl')
const IDS = path.join(__dirname, 'stichprobe-ids.json')

const [text, idsData] = await Promise.all([
  fs.readFile(INPUT, 'utf8'),
  fs.readFile(IDS, 'utf8').then(JSON.parse),
])

const idSet = new Set(idsData.ids)
const fragen = text
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l))
  .filter((f) => idSet.has(f.id))

// Reihenfolge nach Fachbereich → Typ → ID fuer deterministische Bearbeitung
const fachOrd = { Recht: 0, VWL: 1, BWL: 2 }
fragen.sort((a, b) => {
  if (fachOrd[a.fachbereich] !== fachOrd[b.fachbereich])
    return fachOrd[a.fachbereich] - fachOrd[b.fachbereich]
  if (a.typ !== b.typ) return a.typ.localeCompare(b.typ)
  return a.id.localeCompare(b.id)
})

// Kompakt-Output: nur relevante Felder
function subfelder(f) {
  const out = {}
  if (f.optionen) out.optionen = f.optionen.map((o) => ({ id: o.id, text: o.text, korrekt: !!o.korrekt }))
  if (f.aussagen) out.aussagen = f.aussagen.map((a) => ({ id: a.id, text: a.text, korrekt: !!a.korrekt }))
  if (f.luecken) out.luecken = f.luecken.map((l) => ({ id: l.id, korrekt: l.korrekteAntworten || l.korrekt || l.alternativen }))
  if (f.bereiche) out.bereiche = f.bereiche.map((b) => ({ id: b.id, label: b.label, korrekt: !!b.korrekt }))
  if (f.zielzonen) out.zielzonen = f.zielzonen.map((z) => ({ id: z.id, korrektesLabel: z.korrektesLabel }))
  if (f.beschriftungen) out.beschriftungen = f.beschriftungen.map((b) => ({ id: b.id, korrekt: b.korrekt }))
  if (f.aufgaben) out.aufgaben = f.aufgaben.map((a) => ({ id: a.id, text: a.text, korrekt: a.korrekt }))
  if (f.buchungen) out.buchungen = f.buchungen.map((b) => ({ id: b.id, sollKonto: b.sollKonto, habenKonto: b.habenKonto, betrag: b.betrag, beleg: b.beleg }))
  if (f.kontenMitSaldi) out.kontenMitSaldi = f.kontenMitSaldi.map((k) => ({ kontonummer: k.kontonummer, name: k.name, saldo: k.saldo, kategorie: k.kategorie }))
  if (f.paare) out.paare = f.paare.map((p) => ({ links: p.links, rechts: p.rechts }))
  if (f.konten) out.konten = f.konten
  if (f.loesung) out.loesung = f.loesung
  if (f.muster) out.muster = f.muster
  if (f.korrekt && !f.optionen) out.korrekt = f.korrekt
  if (f.toleranz !== undefined) out.toleranz = f.toleranz
  if (f.formel) out.formel = f.formel
  if (f.einheit) out.einheit = f.einheit
  if (f.einheiten) out.einheiten = f.einheiten
  if (f.items && f.typ === 'sortierung') out.items = f.items
  if (f.bildUrl) out.bildUrl = f.bildUrl
  if (f.bild) out.bild = f.bild
  return out
}

for (const f of fragen) {
  const entry = {
    id: f.id,
    fachbereich: f.fachbereich,
    thema: f.thema,
    unterthema: f.unterthema,
    typ: f.typ,
    bloom: f.bloom,
    fragetext: f.fragetext,
    alteMusterlosung: f.musterlosung,
    ...subfelder(f),
  }
  console.log('===FRAGE===')
  console.log(JSON.stringify(entry, null, 2))
}
