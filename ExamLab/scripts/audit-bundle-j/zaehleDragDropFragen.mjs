#!/usr/bin/env node
// Audit Bundle J — zählt dragdrop_bild-Fragen für Migrations-Scope
import { request } from 'undici'

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL
const AUDIT_TOKEN = process.env.AUDIT_TOKEN
if (!APPS_SCRIPT_URL || !AUDIT_TOKEN) {
  console.error('Setze APPS_SCRIPT_URL und AUDIT_TOKEN in der Umgebung.')
  process.exit(1)
}

const { body } = await request(APPS_SCRIPT_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: JSON.stringify({ action: 'dumpFragen', token: AUDIT_TOKEN }),
})
const data = await body.json()
if (!data.success) {
  console.error('API-Fehler:', data.error)
  process.exit(1)
}

const dnd = data.data.filter(f => f.typ === 'dragdrop_bild')
let multiZoneBug = 0
const multiZoneIds = []
for (const f of dnd) {
  const labelCounts = new Map()
  for (const z of (f.zielzonen ?? [])) {
    const k = (z.korrektesLabel ?? '').trim().toLowerCase()
    if (!k) continue
    labelCounts.set(k, (labelCounts.get(k) ?? 0) + 1)
  }
  if ([...labelCounts.values()].some(n => n > 1)) {
    multiZoneBug++
    multiZoneIds.push(f.id)
  }
}
const distraktoren = dnd.filter(f => (f.labels?.length ?? 0) > (f.zielzonen?.length ?? 0))

console.log(`DragDrop-Bild-Fragen total: ${dnd.length}`)
console.log(`  Multi-Zone-Bug heute (≥2 Zonen identisches korrektesLabel): ${multiZoneBug}`)
console.log(`  Mit Distraktoren (labels.length > zielzonen.length): ${distraktoren.length}`)
console.log()
console.log(`Multi-Zone-Bug-Fragen-IDs (LP-Re-Edit nach Migration nötig):`)
for (const id of multiZoneIds) console.log(`  ${id}`)
console.log()
console.log(`Hinweis: Aktive Üben-Sessions + Antworten in laufenden Prüfungen`)
console.log(`manuell prüfen via Apps-Script Editor (Sheets "Übungssessions" / "Antworten").`)
