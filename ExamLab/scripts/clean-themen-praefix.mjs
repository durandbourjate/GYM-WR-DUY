#!/usr/bin/env node
/**
 * Einmalige Migration: Entfernt "Übungspool: " / "Uebungspool: " Präfix
 * aus thema und unterthema aller Fragen im Backend.
 *
 * Hintergrund: Fragen, die früher aus den Uebungspools importiert wurden,
 * tragen in thema/unterthema das Präfix "Übungspool: <Titel>". Seit Bundle 12
 * (Cluster K, K-1 Namens-Refactor, 15.04.2026) wird in ExamLab direkt
 * hinzugefügt — das Präfix ist veraltet und soll aus Altdaten entfernt werden.
 *
 * Usage:
 *   node scripts/clean-themen-praefix.mjs          # Dry-Run (nur Preview)
 *   node scripts/clean-themen-praefix.mjs --apply  # Änderungen schreiben
 */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxOi9ONg678NeyjoY6azruVhv6yc7HI9GVSmKep6rp84GtR-WiG8BV_9w75pmLeD-x0IA/exec'
const EMAIL = 'yannick.durand@gymhofwil.ch'

const APPLY = process.argv.includes('--apply')
const PRAEFIX_REGEX = /^(Ü|Ue)bungspool:\s*/i

function strippePraefix(s) {
  if (typeof s !== 'string') return s
  return s.replace(PRAEFIX_REGEX, '')
}

async function apiGet(action, params = {}) {
  const url = new URL(APPS_SCRIPT_URL)
  url.searchParams.set('action', action)
  url.searchParams.set('email', EMAIL)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const text = await res.text()
  try { return JSON.parse(text) } catch { throw new Error('Not JSON: ' + text.slice(0, 200)) }
}

async function apiPost(action, payload = {}) {
  const body = JSON.stringify({ action, email: EMAIL, ...payload })
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body,
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const text = await res.text()
  try { return JSON.parse(text) } catch { throw new Error('Not JSON: ' + text.slice(0, 200)) }
}

async function main() {
  console.log('=== Übungspool-Präfix Cleanup ===')
  console.log(`Backend: ${APPS_SCRIPT_URL.slice(0, 60)}...`)
  console.log(`Email: ${EMAIL}`)
  console.log(`Modus: ${APPLY ? 'APPLY (schreibt Änderungen)' : 'DRY-RUN (nur Preview)'}\n`)

  // 1. Fragen laden
  console.log('1. Fragenbank laden...')
  const result = await apiGet('ladeFragenbank')
  let fragen = []
  if (Array.isArray(result)) fragen = result
  else if (result.fragen) fragen = result.fragen
  else if (result.data?.fragen) fragen = result.data.fragen
  else if (result.success === false) {
    console.error('Backend-Fehler:', result.error || result)
    return
  } else {
    const keys = Object.keys(result).filter(k => k !== 'success' && k !== 'error')
    if (keys.length > 0 && typeof result[keys[0]] === 'object') {
      fragen = keys.map(k => result[k])
    }
  }
  console.log(`   ${fragen.length} Fragen geladen\n`)

  // 2. Betroffene Fragen identifizieren
  const zuAktualisieren = []
  for (const f of fragen) {
    const neuThema = strippePraefix(f.thema)
    const neuUnterthema = strippePraefix(f.unterthema)
    if (neuThema !== f.thema || neuUnterthema !== f.unterthema) {
      zuAktualisieren.push({
        frage: f,
        altesThema: f.thema,
        neuesThema: neuThema,
        altesUnterthema: f.unterthema,
        neuesUnterthema: neuUnterthema,
      })
    }
  }

  console.log('2. Analyse:')
  console.log(`   ${zuAktualisieren.length} Fragen mit Präfix gefunden`)
  console.log(`   ${fragen.length - zuAktualisieren.length} Fragen bereits sauber\n`)

  if (zuAktualisieren.length === 0) {
    console.log('✅ Nichts zu bereinigen — alles bereits korrekt!')
    return
  }

  // 3. Preview (erste 20 + aggregiert nach thema)
  const themenStats = {}
  for (const m of zuAktualisieren) {
    const key = m.neuesThema || '(leer)'
    themenStats[key] = (themenStats[key] || 0) + 1
  }
  console.log('3. Betroffene Themen (nach Bereinigung):')
  for (const [thema, count] of Object.entries(themenStats).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`   ${thema}: ${count} Fragen`)
  }
  console.log()

  console.log('   Beispiele (max. 10):')
  for (const m of zuAktualisieren.slice(0, 10)) {
    console.log(`   ${m.frage.id}:`)
    if (m.altesThema !== m.neuesThema) console.log(`     thema: "${m.altesThema}" → "${m.neuesThema}"`)
    if (m.altesUnterthema !== m.neuesUnterthema) console.log(`     unterthema: "${m.altesUnterthema}" → "${m.neuesUnterthema}"`)
  }
  console.log()

  if (!APPLY) {
    console.log('⏸  DRY-RUN — keine Änderungen geschrieben.')
    console.log('   Zum Anwenden erneut mit --apply aufrufen:')
    console.log('   node scripts/clean-themen-praefix.mjs --apply')
    return
  }

  // 4. Migration (5er-Batches, parallel)
  console.log(`4. Schreibe Änderungen (${zuAktualisieren.length} Fragen in ${Math.ceil(zuAktualisieren.length / 5)} Batches)...\n`)

  let ok = 0
  let fehler = 0

  for (let i = 0; i < zuAktualisieren.length; i += 5) {
    const batch = zuAktualisieren.slice(i, i + 5)
    const promises = batch.map(async ({ frage, neuesThema, neuesUnterthema }) => {
      const aktualisiert = { ...frage, thema: neuesThema, unterthema: neuesUnterthema }
      try {
        const res = await apiPost('speichereFrage', { frage: aktualisiert })
        if (res.success) return true
        console.error(`   ✗ ${frage.id}: ${res.error || 'unbekannter Fehler'}`)
        return false
      } catch (e) {
        console.error(`   ✗ ${frage.id}: ${e.message}`)
        return false
      }
    })
    const results = await Promise.all(promises)
    ok += results.filter(Boolean).length
    fehler += results.filter(r => !r).length
    const progress = Math.min(i + 5, zuAktualisieren.length)
    process.stdout.write(`   Fortschritt: ${progress}/${zuAktualisieren.length} (${ok} ✓, ${fehler} ✗)\r`)
  }

  console.log(`\n\n=== Ergebnis ===`)
  console.log(`✓ ${ok} Fragen bereinigt`)
  if (fehler > 0) console.log(`✗ ${fehler} Fehler`)
  console.log(`\nCleanup abgeschlossen.`)
}

main().catch(e => { console.error('Fatal:', e); process.exit(1) })
