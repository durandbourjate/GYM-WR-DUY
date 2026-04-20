# Bundle Ü — Üben-Pre-Load Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Selbstständiges Üben erhält instant Client-seitige Korrektur: Lösungs-Felder werden beim Session-Start **in einem separaten autorisierten Call** geladen und in die Session-internen Frage-Kopien gemerged. Server-Korrektur `lernplattformPruefeAntwort` bleibt als Pro-Frage-Fallback bei Pre-Load-Fehlern.

**Architecture:** Neuer Apps-Script-Endpoint `lernplattformLadeLoesungen` liefert eine flache Map `{ [frageId]: LoesungsSlice }` (Aufgabengruppen-Teilaufgaben sind eigene Map-Keys). Frontend ruft den Endpoint nach erfolgreichem `ladeFragen`, merged die Lösungen in `session.fragen`, und trackt pro Frage in einer `Map<string, boolean>` ob Lösung vorhanden ist. `beantworteById` nutzt weiterhin clientseitige `pruefeAntwort()` wenn Lösung da ist, sonst `pruefeAntwortJetzt()` Fallback. Lösungs-Map landet **nicht** in localStorage (nur In-Memory).

**Tech Stack:** React 19 + TypeScript + Zustand (persist middleware), Vitest, Google Apps Script (ES5-style), vorhandener `uebenApiClient` + `apiClient`-Infrastruktur.

**Spec:** `ExamLab/docs/superpowers/specs/2026-04-20-musterloesungen-bereinigung-design.md` (Abschnitt Bundle Ü)

**Branch:** `feature/bundle-ue-ueben-preload` (aktiv, noch keine Commits)

**Design-Entscheidungen (vom User am 2026-04-20 bestätigt):**
- Aufgabengruppe-Serialisierung: **flache Map** (alle Teilaufgaben-IDs als eigene Map-Keys)
- Partial-Pre-Load-Fallback: **pro-Frage** via `Map<frageId, boolean>`

---

## File Structure

**Create:**
- `ExamLab/src/types/ueben/loesung.ts` — Typ-Definitionen `LoesungsSlice` + `LoesungsMap`
- `ExamLab/src/services/uebenLoesungsApi.ts` — Service-Adapter für `lernplattformLadeLoesungen`
- `ExamLab/src/tests/uebenLoesungsApi.test.ts` — Service-Unit-Tests
- `ExamLab/src/tests/uebungsStoreLoesungsPreload.test.ts` — Store-Integration-Tests (Merge + Fallback)

**Modify:**
- `ExamLab/apps-script-code.js` — neuer Endpoint-Dispatch + Handler-Funktion + Helper-Funktion
- `ExamLab/src/store/ueben/uebungsStore.ts` — `loesungenPreloaded`-Map State, Merge-Logik in `starteSession`, Branch-Logik in `beantworteById`
- `ExamLab/HANDOFF.md` — Session 127 Bundle Ü

**No changes:**
- UI-Komponenten (`UebungsScreen.tsx` etc.) — funktionieren automatisch, weil die gemergte Frage `frage.musterlosung` bereits enthält, und der Store-Zustand `letzteMusterloesung` weiterhin via `pruefeAntwortJetzt` befüllt wird (Fallback-Pfad).

---

## Test-Strategie

Analog zu Bundle P:
1. **Vitest Unit + Integration** — Service-Call, Store-Merge-Logik, Branch-Logik, Partial-Fallback-Pfad.
2. **Apps-Script nicht direkt testbar** — strenge Bereinigung wurde in Bundle P bereits verifiziert (2412 Fragen); `extrahiereLoesungsSlice_` ist die Umkehrfunktion, und wird via Staging-E2E-Assertion `extrahieren ∪ bereinigen = Original-Frage (modulo Mischung)` verifiziert.
3. **Staging-E2E** — echte Logins, Üben-Session starten, Network-Tab-Audit: genau 1 Pre-Load-Call, alle Auto-Korrektur-Typen geben instant Feedback, Pre-Load-Absturz-Simulation → Fallback funktioniert.

---

## Task 1: Frontend-Types `LoesungsSlice` + `LoesungsMap`

**Files:**
- Create: `ExamLab/src/types/ueben/loesung.ts`

- [ ] **Step 1: Typ-Datei anlegen**

Neue Datei `ExamLab/src/types/ueben/loesung.ts`:

```typescript
/**
 * Lösungs-Slice einer Frage — nur Lösungs-relevante Felder.
 * Wird vom Apps-Script-Endpoint `lernplattformLadeLoesungen` geliefert und
 * vor der clientseitigen Korrektur in die Frage-Kopie gemerged.
 *
 * Aufgabengruppen werden flach serialisiert: jede Teilaufgabe ist ein
 * eigener Key in der LoesungsMap (keine Verschachtelung).
 *
 * Reihenfolgen-kritische Felder (Sortierung, Zuordnung) enthalten die
 * Original-Reihenfolge vor Fisher-Yates-Mischung — der Ladepfad liefert
 * gemischte Versionen, der Lösungspfad die Wahrheit.
 */
export interface LoesungsSlice {
  // Gemeinsame Lösungs-Metadaten (alle Fragetypen)
  musterlosung?: string
  bewertungsraster?: unknown

  // MC
  optionen?: Array<{ id: string; korrekt?: boolean; erklaerung?: string }>

  // R/F
  aussagen?: Array<{ id: string; korrekt?: boolean; erklaerung?: string }>

  // Lückentext
  luecken?: Array<{ id: string; korrekteAntworten?: string[]; korrekt?: string }>

  // Berechnung
  ergebnisse?: Array<{ id: string; korrekt?: number; toleranz?: number }>

  // Sortierung / Zuordnung — Reihenfolgen-kritisch
  elemente?: unknown[]  // Sortierung: Original-Reihenfolge
  paare?: Array<{ links: string; rechts: string }>  // Zuordnung: Original-Paarung

  // Formel
  korrekteFormel?: string
  korrekt?: string | number | boolean  // formel.korrekt (Legacy)

  // Buchungssatz
  buchungen?: unknown[]
  korrektBuchung?: unknown
  sollEintraege?: unknown[]
  habenEintraege?: unknown[]

  // FiBu-Konten (T-Konto, Kontenbestimmung)
  konten?: Array<{
    id: string
    korrekt?: boolean | string
    eintraege?: unknown[]
    saldo?: number
    anfangsbestand?: number  // nur wenn !anfangsbestandVorgegeben
  }>

  // Bilanzstruktur
  bilanzEintraege?: Array<{ id: string; korrekt?: boolean }>
  loesung?: unknown

  // Kontenbestimmung
  aufgaben?: Array<{ id: string; erwarteteAntworten?: string[] }>

  // Bildbeschriftung / DragDrop
  labels?: Array<{ id: string; zoneId?: string; zone?: string; korrekt?: boolean }>
  beschriftungen?: Array<{ id: string; korrekt?: boolean }>
  zielzonen?: Array<{ id: string; korrektesLabel?: string }>

  // Hotspot
  bereiche?: Array<{ id: string; korrekt?: boolean }>
  hotspots?: Array<{ id: string; korrekt?: boolean }>
}

/**
 * Flache Map von frageId zu LoesungsSlice. Teilaufgaben von
 * Aufgabengruppen sind eigene Keys (nicht verschachtelt).
 */
export type LoesungsMap = Record<string, LoesungsSlice>
```

- [ ] **Step 2: TypeScript-Build prüfen**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
npx tsc -b
```

Erwartet: exit 0.

- [ ] **Step 3: Commit**

```bash
cd "10 Github/GYM-WR-DUY"
git add ExamLab/src/types/ueben/loesung.ts
git commit -m "$(cat <<'EOF'
ExamLab: LoesungsSlice + LoesungsMap Types (Bundle Ü)

Flach serialisierte Map von frageId zu Lösungs-Slice. Deckt alle
20 Fragetypen inkl. Aufgabengruppen ab (Teilaufgaben als eigene
Map-Keys). Feldliste spiegelt bereinigeFrageFuerSuS_ aus
apps-script-code.js — LoesungsSlice ist die Umkehrfunktion der
Bereinigung.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Frontend-Service `uebenLoesungsApi`

**Files:**
- Create: `ExamLab/src/services/uebenLoesungsApi.ts`
- Create: `ExamLab/src/tests/uebenLoesungsApi.test.ts`

**Reference:** bestehender Service `ExamLab/src/services/uebenKorrekturApi.ts` (gleiche Struktur, `uebenApiClient.post<T>`).

- [ ] **Step 1: Test schreiben (TDD)**

`ExamLab/src/tests/uebenLoesungsApi.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ladeLoesungenApi } from '../services/uebenLoesungsApi'

vi.mock('../services/ueben/apiClient', () => ({
  uebenApiClient: {
    post: vi.fn(),
  },
}))

import { uebenApiClient } from '../services/ueben/apiClient'

describe('uebenLoesungsApi.ladeLoesungenApi', () => {
  beforeEach(() => {
    vi.mocked(uebenApiClient.post).mockReset()
  })

  const basisParams = {
    gruppeId: 'g1',
    fragenIds: ['f1', 'f2'],
    email: 'sus@stud.test',
    token: 'tok-abc',
    fachbereich: 'VWL',
  }

  it('ruft lernplattformLadeLoesungen mit korrektem Payload', async () => {
    vi.mocked(uebenApiClient.post).mockResolvedValue({
      success: true,
      loesungen: { f1: { musterlosung: 'X' }, f2: { optionen: [{ id: 'o1', korrekt: true }] } },
    })

    const result = await ladeLoesungenApi(basisParams)

    expect(uebenApiClient.post).toHaveBeenCalledWith(
      'lernplattformLadeLoesungen',
      {
        gruppeId: 'g1',
        fragenIds: ['f1', 'f2'],
        email: 'sus@stud.test',
        fachbereich: 'VWL',
      },
      'tok-abc',
    )
    expect(result).toEqual({
      f1: { musterlosung: 'X' },
      f2: { optionen: [{ id: 'o1', korrekt: true }] },
    })
  })

  it('wirft bei success:false', async () => {
    vi.mocked(uebenApiClient.post).mockResolvedValue({ success: false, error: 'Rate limit' })
    await expect(ladeLoesungenApi(basisParams)).rejects.toThrow('Rate limit')
  })

  it('wirft bei Netzwerk-Fehler', async () => {
    vi.mocked(uebenApiClient.post).mockRejectedValue(new Error('timeout'))
    await expect(ladeLoesungenApi(basisParams)).rejects.toThrow('timeout')
  })

  it('lässt fachbereich weg wenn nicht gesetzt', async () => {
    vi.mocked(uebenApiClient.post).mockResolvedValue({ success: true, loesungen: {} })

    await ladeLoesungenApi({ ...basisParams, fachbereich: undefined })

    expect(uebenApiClient.post).toHaveBeenCalledWith(
      'lernplattformLadeLoesungen',
      { gruppeId: 'g1', fragenIds: ['f1', 'f2'], email: 'sus@stud.test' },
      'tok-abc',
    )
  })
})
```

- [ ] **Step 2: Test laufen lassen — soll durchfallen**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
npx vitest run src/tests/uebenLoesungsApi.test.ts
```

Erwartet: FAIL mit "Cannot find module '../services/uebenLoesungsApi'".

- [ ] **Step 3: Service implementieren**

`ExamLab/src/services/uebenLoesungsApi.ts`:

```typescript
import { uebenApiClient } from './ueben/apiClient'
import type { LoesungsMap } from '../types/ueben/loesung'

export interface LadeLoesungenParams {
  gruppeId: string
  fragenIds: string[]
  email: string
  token: string
  /** Optional: spart Server ~75% Sheet-Reads (1 Tab statt 4 durchsuchen) */
  fachbereich?: string
}

interface LadeLoesungenResponse {
  success: boolean
  loesungen?: LoesungsMap
  error?: string
}

/**
 * Ruft den Apps-Script-Endpoint `lernplattformLadeLoesungen` auf.
 * Liefert eine flache Map {frageId → LoesungsSlice} zurück oder wirft
 * bei success:false / Netzwerk-Fehler.
 *
 * Wird beim Session-Start im selbstständigen Üben-Modus aufgerufen,
 * damit clientseitige Korrektur instant Feedback geben kann, ohne
 * pro-Frage Server-Roundtrip.
 */
export async function ladeLoesungenApi(params: LadeLoesungenParams): Promise<LoesungsMap> {
  const { gruppeId, fragenIds, email, token, fachbereich } = params
  const payload: Record<string, unknown> = { gruppeId, fragenIds, email }
  if (fachbereich) payload.fachbereich = fachbereich

  const response = await uebenApiClient.post<LadeLoesungenResponse>(
    'lernplattformLadeLoesungen',
    payload,
    token,
  )
  if (!response?.success) {
    throw new Error(response?.error || 'Lösungs-Preload fehlgeschlagen')
  }
  return response.loesungen || {}
}
```

- [ ] **Step 4: Test laufen lassen — alle grün**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
npx vitest run src/tests/uebenLoesungsApi.test.ts
```

Erwartet: 4/4 PASS.

- [ ] **Step 5: Commit**

```bash
cd "10 Github/GYM-WR-DUY"
git add ExamLab/src/services/uebenLoesungsApi.ts ExamLab/src/tests/uebenLoesungsApi.test.ts
git commit -m "$(cat <<'EOF'
ExamLab: Service uebenLoesungsApi + Tests (Bundle Ü)

Adapter für lernplattformLadeLoesungen Apps-Script-Endpoint.
4 Tests decken Standard-Payload, success:false, Netzwerk-Fehler
und optionalen fachbereich-Hint ab.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Backend — `extrahiereLoesungsSlice_` Helper

**Files:**
- Modify: `ExamLab/apps-script-code.js`

Neue Helper-Funktion direkt VOR `bereinigeFrageFuerSuS_` (analog zu `mischeFrageOptionen_`-Platzierung in Bundle P). Extrahiert die Lösungs-Felder einer Original-Frage in ein `LoesungsSlice`-Objekt.

**Wichtig:** Die Funktion ist die **Umkehrfunktion** von `bereinigeFrageFuerSuS_`. Dieselbe Feldliste, aber statt `delete` werden die Felder in eine neue Response-Struktur kopiert. Input ist die Original-Frage, Output enthält NUR Lösungs-Felder.

- [ ] **Step 1: Helper einfügen**

Öffne `ExamLab/apps-script-code.js`. Suche `function mischeFrageOptionen_(frage) {` (nach Bundle P bei Zeile ~1639–1694). **Direkt NACH `mischeFrageOptionen_`** (nach der schliessenden `}` + Leerzeile) einfügen:

```javascript
/**
 * Extrahiert Lösungs-Felder einer Original-Frage als flache Map-Entry.
 * Umkehrfunktion von bereinigeFrageFuerSuS_ — dieselbe Feldliste.
 *
 * Gibt ein Objekt mit nur den Lösungs-Feldern zurück; Frage-Metadaten
 * (fragetext, bild, etc.) sind NICHT enthalten (die kommen bereits
 * beim Laden in der bereinigten Frage).
 *
 * Sortierung/Zuordnung: elemente[] / paare[] sind Reihenfolgen-kritisch
 * und werden unverändert aus der Original-Frage übernommen (Client
 * hat nur die gemischte Version).
 */
function extrahiereLoesungsSlice_(frage) {
  var slice = {};

  // Gemeinsame Felder
  if (frage.musterlosung !== undefined && frage.musterlosung !== '') slice.musterlosung = frage.musterlosung;
  if (frage.bewertungsraster !== undefined) slice.bewertungsraster = frage.bewertungsraster;

  // MC
  if (Array.isArray(frage.optionen)) {
    slice.optionen = frage.optionen.map(function(o) {
      var e = { id: o.id };
      if (o.korrekt !== undefined) e.korrekt = o.korrekt;
      if (o.erklaerung !== undefined) e.erklaerung = o.erklaerung;
      return e;
    });
  }

  // R/F
  if (Array.isArray(frage.aussagen)) {
    slice.aussagen = frage.aussagen.map(function(a) {
      var e = { id: a.id };
      if (a.korrekt !== undefined) e.korrekt = a.korrekt;
      if (a.erklaerung !== undefined) e.erklaerung = a.erklaerung;
      return e;
    });
  }

  // Lückentext
  if (Array.isArray(frage.luecken)) {
    slice.luecken = frage.luecken.map(function(l) {
      var e = { id: l.id };
      if (l.korrekteAntworten !== undefined) e.korrekteAntworten = l.korrekteAntworten;
      if (l.korrekt !== undefined) e.korrekt = l.korrekt;
      return e;
    });
  }

  // Berechnung
  if (Array.isArray(frage.ergebnisse)) {
    slice.ergebnisse = frage.ergebnisse.map(function(er) {
      var e = { id: er.id };
      if (er.korrekt !== undefined) e.korrekt = er.korrekt;
      if (er.toleranz !== undefined) e.toleranz = er.toleranz;
      return e;
    });
  }

  // Sortierung: elemente[] = Original-Reihenfolge (Client hat gemischt)
  if (frage.typ === 'sortierung' && Array.isArray(frage.elemente)) {
    slice.elemente = frage.elemente.slice();
  }

  // Zuordnung: paare[] = Original-Paarung (Client hat rechts gemischt)
  if (frage.typ === 'zuordnung' && Array.isArray(frage.paare)) {
    slice.paare = frage.paare.map(function(p) {
      return { links: p.links, rechts: p.rechts };
    });
  }

  // Formel
  if (frage.korrekteFormel !== undefined) slice.korrekteFormel = frage.korrekteFormel;
  if (frage.typ === 'formel' && frage.korrekt !== undefined) slice.korrekt = frage.korrekt;

  // Buchungssatz
  if (frage.buchungen !== undefined) slice.buchungen = frage.buchungen;
  if (frage.korrektBuchung !== undefined) slice.korrektBuchung = frage.korrektBuchung;
  if (frage.sollEintraege !== undefined) slice.sollEintraege = frage.sollEintraege;
  if (frage.habenEintraege !== undefined) slice.habenEintraege = frage.habenEintraege;

  // FiBu-Konten
  if (Array.isArray(frage.konten)) {
    slice.konten = frage.konten.map(function(k) {
      var e = { id: k.id };
      if (k.korrekt !== undefined) e.korrekt = k.korrekt;
      if (k.eintraege !== undefined) e.eintraege = k.eintraege;
      if (k.saldo !== undefined) e.saldo = k.saldo;
      // anfangsbestand nur wenn NICHT vorgegeben (= ist Lösung)
      if (!k.anfangsbestandVorgegeben && k.anfangsbestand !== undefined) {
        e.anfangsbestand = k.anfangsbestand;
      }
      return e;
    });
  }

  // Bilanzstruktur / Bilanz-ER
  if (Array.isArray(frage.bilanzEintraege)) {
    slice.bilanzEintraege = frage.bilanzEintraege.map(function(b) {
      var e = { id: b.id };
      if (b.korrekt !== undefined) e.korrekt = b.korrekt;
      return e;
    });
  }
  if (frage.loesung !== undefined) slice.loesung = frage.loesung;

  // Kontenbestimmung
  if (Array.isArray(frage.aufgaben)) {
    slice.aufgaben = frage.aufgaben.map(function(a) {
      var e = { id: a.id };
      if (a.erwarteteAntworten !== undefined) e.erwarteteAntworten = a.erwarteteAntworten;
      return e;
    });
  }

  // Bildbeschriftung / DragDrop labels
  if ((frage.typ === 'bildbeschriftung' || frage.typ === 'dragdrop_bild') && Array.isArray(frage.labels)) {
    slice.labels = frage.labels.map(function(l) {
      // String-labels (DragDrop-Bild Pool-Konvention): unverändert durchreichen als primitive
      if (typeof l !== 'object' || l === null) return l;
      var e = { id: l.id };
      if (l.zoneId !== undefined) e.zoneId = l.zoneId;
      if (l.zone !== undefined) e.zone = l.zone;
      if (l.korrekt !== undefined) e.korrekt = l.korrekt;
      return e;
    });
  }
  if (Array.isArray(frage.beschriftungen)) {
    slice.beschriftungen = frage.beschriftungen.map(function(b) {
      var e = { id: b.id };
      if (b.korrekt !== undefined) e.korrekt = b.korrekt;
      return e;
    });
  }
  if (Array.isArray(frage.zielzonen)) {
    slice.zielzonen = frage.zielzonen.map(function(z) {
      var e = { id: z.id };
      if (z.korrektesLabel !== undefined) e.korrektesLabel = z.korrektesLabel;
      return e;
    });
  }

  // Hotspot
  if (frage.typ === 'hotspot' && Array.isArray(frage.bereiche)) {
    slice.bereiche = frage.bereiche.map(function(b) {
      var e = { id: b.id };
      if (b.korrekt !== undefined) e.korrekt = b.korrekt;
      return e;
    });
  }
  if (frage.typ === 'hotspot' && Array.isArray(frage.hotspots)) {
    slice.hotspots = frage.hotspots.map(function(h) {
      var e = { id: h.id };
      if (h.korrekt !== undefined) e.korrekt = h.korrekt;
      return e;
    });
  }

  return slice;
}

```

Achte auf die Leerzeile nach der Funktion.

- [ ] **Step 2: Sanity-Check Datei parsebar**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
node --check apps-script-code.js
```

Erwartet: kein Output.

Commit kommt erst in Task 4 zusammen mit dem Endpoint.

---

## Task 4: Backend — Endpoint `lernplattformLadeLoesungen`

**Files:**
- Modify: `ExamLab/apps-script-code.js`

Neuer Endpoint direkt nach `lernplattformPruefeAntwort` (aktuell bei Zeile ~7809 + Bundle-P-Änderungen). Auth-Logic und Rate-Limit-Muster spiegeln `lernplattformPruefeAntwort`.

- [ ] **Step 1: Endpoint-Dispatch einfügen**

Suche im Code den Dispatch-Block mit `case 'lernplattformPruefeAntwort':` (bei Zeile ~984–985). Direkt NACH diesem Case einfügen:

```javascript
    case 'lernplattformLadeLoesungen':
      return lernplattformLadeLoesungen(body);
```

- [ ] **Step 2: Handler-Funktion einfügen**

Suche `function lernplattformPruefeAntwort(body) {`. Direkt nach der schliessenden `}` dieser Funktion einfügen:

```javascript

/**
 * Liefert eine flache Map {frageId → LoesungsSlice} für die gegebenen
 * Fragen-IDs. Nur Lösungs-Felder (siehe extrahiereLoesungsSlice_).
 *
 * Wird vom Frontend beim Session-Start im selbstständigen Üben-Modus
 * aufgerufen, damit clientseitige Korrektur instant Feedback geben kann.
 *
 * Auth: Token-Pflicht, Mitgliedschaft-Check (wie lernplattformPruefeAntwort).
 * Rate-Limit: 5 Calls/Minute pro SuS (1 Call pro Session-Start reicht).
 */
function lernplattformLadeLoesungen(body) {
  var gruppeId = body.gruppeId;
  var fragenIds = body.fragenIds;
  var claimEmail = (body.email || '').toString().toLowerCase();
  var token = body.token || body.sessionToken;

  if (!gruppeId || !Array.isArray(fragenIds) || fragenIds.length === 0 || !claimEmail || !token) {
    return jsonResponse({ success: false, error: 'Fehlende oder ungültige Parameter' });
  }

  // SICHERHEIT: Token zwingend — Email wird nur verwendet wenn Token gültig.
  if (!lernplattformValidiereToken_(token, claimEmail)) {
    return jsonResponse({ success: false, error: 'Nicht authentifiziert' });
  }
  var email = claimEmail;

  // Rate-Limit: 5 Calls/Minute pro SuS (1 pro Session-Start reicht;
  // Missbrauchs-Schutz + Limit für Bots).
  var rl = lernplattformRateLimitCheck_('lade-loesungen', email, 5, 60);
  if (rl.blocked) return jsonResponse({ success: false, error: rl.error });

  // Gruppe existiert + Mitgliedschaft prüfen
  var mitgliedCheck = istGruppenMitglied_(body, gruppeId);
  if (!mitgliedCheck) {
    return jsonResponse({ success: false, error: 'Kein Zugriff auf diese Gruppe' });
  }
  var gruppe = mitgliedCheck.gruppe;

  // Audit-Log — wer hat wann wieviele Lösungen abgefragt
  try {
    Logger.log('[lernplattformLadeLoesungen] gruppe=%s email=%s n=%s',
      gruppeId, email, String(fragenIds.length));
  } catch (e) { /* Logger kann in bestimmten Runtimes fehlen */ }

  var loesungen = {};
  for (var i = 0; i < fragenIds.length; i++) {
    var frageId = fragenIds[i];
    var frage = ladeFrageUnbereinigtById_(frageId, gruppe, body.fachbereich);
    if (!frage) continue; // Frage nicht gefunden → aus Map weglassen; Client erkennt Lücke und fällt zurück

    // Für Aufgabengruppen: auch Teilaufgaben als eigene Map-Keys aufnehmen
    loesungen[frageId] = extrahiereLoesungsSlice_(frage);
    if (frage.typ === 'aufgabengruppe' && Array.isArray(frage.teilaufgaben)) {
      for (var t = 0; t < frage.teilaufgaben.length; t++) {
        var ta = frage.teilaufgaben[t];
        if (ta && ta.id) {
          loesungen[ta.id] = extrahiereLoesungsSlice_(ta);
        }
      }
    }
  }

  return jsonResponse({ success: true, loesungen: loesungen });
}
```

- [ ] **Step 3: Sanity-Check**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
node --check apps-script-code.js
```

Erwartet: kein Output.

- [ ] **Step 4: Grep-Verifikation**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
grep -n "lernplattformLadeLoesungen" apps-script-code.js
```

Erwartet: 3 Treffer (case-dispatch, Funktions-Definition, Kommentar-Header).

```bash
grep -n "extrahiereLoesungsSlice_" apps-script-code.js
```

Erwartet: 3 Treffer (Funktions-Definition, 2 Aufrufe im Handler für Frage + Teilaufgaben).

- [ ] **Step 5: Commit (Backend gesamt — Task 3 + Task 4)**

```bash
cd "10 Github/GYM-WR-DUY"
git add ExamLab/apps-script-code.js
git commit -m "$(cat <<'EOF'
ExamLab: Backend-Endpoint lernplattformLadeLoesungen (Bundle Ü)

extrahiereLoesungsSlice_ Helper — Umkehrfunktion von
bereinigeFrageFuerSuS_. Dieselbe Feldliste, aber statt delete werden
die Lösungs-Felder in eine flache Struktur kopiert.

lernplattformLadeLoesungen Endpoint:
- Token-Auth + Mitgliedschaft-Check wie lernplattformPruefeAntwort
- Rate-Limit: 5 Calls/Minute pro SuS
- Returns flache Map {frageId → LoesungsSlice}
- Aufgabengruppen: Teilaufgaben als eigene Map-Keys (flach serialisiert)
- Audit-Log via Logger.log pro Abruf
- Nicht gefundene Fragen werden weggelassen; Client fällt pro Frage zurück

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Store-Integration — Pre-Load beim Session-Start

**Files:**
- Modify: `ExamLab/src/store/ueben/uebungsStore.ts`

Erweiterung des `uebungsStore.ts`:
- Neues State-Feld `loesungenPreloaded: Record<string, boolean>` (pro-Frage-Map).
- `starteSession` ruft nach `erstelleBlock` den Lösungs-Preload, merged die Lösungen in `session.fragen`, setzt `loesungenPreloaded` pro frageId.
- `beantworteById` liest `loesungenPreloaded[frageId]` — wenn true, läuft clientseitige Korrektur wie bisher; wenn false, delegiert an `pruefeAntwortJetzt(frageId)`.
- Reset bei `beendeSession`, `naechsteFrage` etc.: `loesungenPreloaded` NICHT zurücksetzen (Map gilt für ganze Session).

- [ ] **Step 1: State-Feld + Interface erweitern**

Öffne `ExamLab/src/store/ueben/uebungsStore.ts`.

Im `UebungsState`-Interface (nach `letzteMusterloesung: string | null`):

```typescript
  /** Pro-Frage-Map: hat die Lösung (via Pre-Load) oder nicht (Fallback auf Server) */
  loesungenPreloaded: Record<string, boolean>
```

Und im initialen State-Objekt (im `create<UebungsState>((set, get) => ({...})`-Block, nach `letzteMusterloesung: null,`):

```typescript
  loesungenPreloaded: {},
```

- [ ] **Step 2: Merge-Helper-Import hinzufügen**

Oben in der Datei, bei den Imports (nach Zeile mit `import { pruefeAntwort } from '../../utils/ueben/korrektur'`), einfügen:

```typescript
import { ladeLoesungenApi } from '../../services/uebenLoesungsApi'
import type { LoesungsMap, LoesungsSlice } from '../../types/ueben/loesung'
```

- [ ] **Step 3: Merge-Helper oben in der Datei definieren**

NACH den Imports und VOR `const HISTORIE_KEY = ...`:

```typescript
/**
 * Merged einen LoesungsSlice in eine Frage-Kopie. Mutiert NICHT die
 * Original-Frage; liefert ein neues Objekt mit den kombinierten Feldern.
 *
 * Listen-Felder (optionen[], luecken[], etc.): Merge per id — der
 * gemischte Client-Array wird um die Lösungs-Attribute ergänzt.
 * Original-Reihenfolge-Felder (elemente[], paare[]) werden direkt
 * aus dem Slice übernommen (überschreibt gemischte Client-Version,
 * weil Lösung die Wahrheit ist).
 */
function mergeLoesungInFrage(frage: Frage, slice: LoesungsSlice | undefined): Frage {
  if (!slice) return frage
  const merged: Record<string, unknown> = { ...frage }

  // Einfache Top-Level-Felder
  if (slice.musterlosung !== undefined) merged.musterlosung = slice.musterlosung
  if (slice.bewertungsraster !== undefined) merged.bewertungsraster = slice.bewertungsraster
  if (slice.korrekteFormel !== undefined) merged.korrekteFormel = slice.korrekteFormel
  if (slice.korrekt !== undefined) merged.korrekt = slice.korrekt
  if (slice.buchungen !== undefined) merged.buchungen = slice.buchungen
  if (slice.korrektBuchung !== undefined) merged.korrektBuchung = slice.korrektBuchung
  if (slice.sollEintraege !== undefined) merged.sollEintraege = slice.sollEintraege
  if (slice.habenEintraege !== undefined) merged.habenEintraege = slice.habenEintraege
  if (slice.loesung !== undefined) merged.loesung = slice.loesung

  // Reihenfolgen-kritisch: Lösung liefert Original-Reihenfolge, überschreiben
  if (slice.elemente !== undefined) merged.elemente = slice.elemente
  if (slice.paare !== undefined) merged.paare = slice.paare

  // Listen-Felder per id mergen
  type IdItem = { id?: string }
  const mergeById = (base: unknown, patches: IdItem[] | undefined): unknown => {
    if (!Array.isArray(base) || !patches) return base
    const patchMap = new Map<string, IdItem>()
    for (const p of patches) if (p && p.id) patchMap.set(p.id, p)
    return base.map((item: unknown) => {
      if (typeof item !== 'object' || item === null) return item
      const withId = item as IdItem
      const patch = withId.id ? patchMap.get(withId.id) : undefined
      return patch ? { ...withId, ...patch } : item
    })
  }

  if (slice.optionen) merged.optionen = mergeById(merged.optionen, slice.optionen)
  if (slice.aussagen) merged.aussagen = mergeById(merged.aussagen, slice.aussagen)
  if (slice.luecken) merged.luecken = mergeById(merged.luecken, slice.luecken)
  if (slice.ergebnisse) merged.ergebnisse = mergeById(merged.ergebnisse, slice.ergebnisse)
  if (slice.konten) merged.konten = mergeById(merged.konten, slice.konten)
  if (slice.bilanzEintraege) merged.bilanzEintraege = mergeById(merged.bilanzEintraege, slice.bilanzEintraege)
  if (slice.aufgaben) merged.aufgaben = mergeById(merged.aufgaben, slice.aufgaben)
  if (slice.labels) merged.labels = mergeById(merged.labels, slice.labels)
  if (slice.beschriftungen) merged.beschriftungen = mergeById(merged.beschriftungen, slice.beschriftungen)
  if (slice.zielzonen) merged.zielzonen = mergeById(merged.zielzonen, slice.zielzonen)
  if (slice.bereiche) merged.bereiche = mergeById(merged.bereiche, slice.bereiche)
  if (slice.hotspots) merged.hotspots = mergeById(merged.hotspots, slice.hotspots)

  return merged as Frage
}

/**
 * Merged die Lösungs-Map in die Frage-Liste. Aufgabengruppen erhalten
 * sowohl ihren eigenen Slice als auch die Slices ihrer Teilaufgaben
 * (flache Map-Lookup).
 */
function mergeLoesungen(fragen: Frage[], loesungen: LoesungsMap): { fragen: Frage[]; preloaded: Record<string, boolean> } {
  const preloaded: Record<string, boolean> = {}
  const merged = fragen.map((f) => {
    const frageSlice = loesungen[f.id]
    preloaded[f.id] = frageSlice !== undefined
    let out = mergeLoesungInFrage(f, frageSlice)
    // Aufgabengruppe: Teilaufgaben in out ebenfalls mergen
    const outWithTa = out as Frage & { teilaufgaben?: Frage[] }
    if (Array.isArray(outWithTa.teilaufgaben)) {
      outWithTa.teilaufgaben = outWithTa.teilaufgaben.map((ta: Frage) => {
        const taSlice = loesungen[ta.id]
        preloaded[ta.id] = taSlice !== undefined
        return mergeLoesungInFrage(ta, taSlice)
      })
      out = outWithTa
    }
    return out
  })
  return { fragen: merged, preloaded }
}
```

- [ ] **Step 4: `starteSession` erweitern — Pre-Load nach Block-Erstellung**

In der `starteSession`-Methode, nach dem Block-Erstellungs-Block und vor `if (block.length === 0) { ... }` (etwa bei Zeile 128), einfügen:

```typescript
      // Lösungs-Preload via separatem Endpoint (Bundle Ü).
      // Bei Erfolg: Lösungen in Frage-Objekte mergen, clientseitige Korrektur möglich.
      // Bei Fehler oder Lücken: pro-Frage-Fallback auf pruefeAntwortJetzt().
      let loesungen: LoesungsMap = {}
      try {
        const { useUebenAuthStore } = await import('./authStore')
        const user = useUebenAuthStore.getState().user
        if (user?.sessionToken) {
          const fragenIds = block.map((f) => f.id)
          // Teilaufgaben-IDs auch sammeln (Aufgabengruppen)
          for (const f of block) {
            const ta = (f as Frage & { teilaufgaben?: Frage[] }).teilaufgaben
            if (Array.isArray(ta)) for (const t of ta) fragenIds.push(t.id)
          }
          loesungen = await ladeLoesungenApi({
            gruppeId,
            fragenIds,
            email: user.email,
            token: user.sessionToken,
            fachbereich: fach,
          })
        }
      } catch (e) {
        // Pre-Load-Fehler ist nicht fatal — Session startet trotzdem,
        // Fallback läuft dann pro-Frage über pruefeAntwortJetzt.
        console.warn('[uebungsStore] Lösungs-Preload fehlgeschlagen:', e)
      }

      const { fragen: blockMitLoesung, preloaded } = mergeLoesungen(block, loesungen)
```

- [ ] **Step 5: `starteSession` — Session mit gemergten Fragen erstellen**

Ersetze den bestehenden Session-Erstell-Block:

```typescript
      const session: UebungsSession = {
        id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        gruppeId, email, fach, thema,
        modus,
        quellen,
        fragen: block,
        antworten: {},
        ergebnisse: {},
        aktuelleFrageIndex: 0,
        gestartet: new Date().toISOString(),
        unsicher: new Set(),
        uebersprungen: new Set(),
        score: 0,
        freiwillig,
      }

      set({ session, ladeStatus: 'fertig', feedbackSichtbar: false, letzteAntwortKorrekt: null })
```

Durch:

```typescript
      const session: UebungsSession = {
        id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        gruppeId, email, fach, thema,
        modus,
        quellen,
        fragen: blockMitLoesung,
        antworten: {},
        ergebnisse: {},
        aktuelleFrageIndex: 0,
        gestartet: new Date().toISOString(),
        unsicher: new Set(),
        uebersprungen: new Set(),
        score: 0,
        freiwillig,
      }

      set({
        session,
        ladeStatus: 'fertig',
        feedbackSichtbar: false,
        letzteAntwortKorrekt: null,
        loesungenPreloaded: preloaded,
      })
```

- [ ] **Step 6: Branch-Logik in `beantworteById`**

Finde `beantworteById: (frageId, antwort) => { ... }` und ersetze die bestehende Implementation:

```typescript
  beantworteById: (frageId, antwort) => {
    const session = get().session
    if (!session) return

    const frage = session.fragen.find(f => f.id === frageId)
    if (!frage) return

    const normalized = normalizeAntwort(antwort)

    // Pro-Frage-Entscheidung: Pre-Load vorhanden → clientseitig korrigieren.
    // Sonst Fallback auf Server via pruefeAntwortJetzt (setzt speichertPruefung).
    const preloaded = get().loesungenPreloaded[frageId] === true
    if (!preloaded) {
      // Antwort zwischenspeichern + Server-Korrektur anstossen
      set({
        session: {
          ...session,
          zwischenstande: { ...(session.zwischenstande ?? {}), [frageId]: normalized },
        },
      })
      void get().pruefeAntwortJetzt(frageId)
      return
    }

    const korrekt = pruefeAntwort(frage, normalized)

    // Bei freiwilligem Üben (gesperrtes Thema): Fortschritt NICHT speichern
    if (!session.freiwillig) {
      useUebenFortschrittStore.getState().antwortVerarbeiten(frageId, session.email, korrekt, session.id)
    }

    set({
      session: {
        ...session,
        antworten: { ...session.antworten, [frageId]: normalized },
        ergebnisse: { ...session.ergebnisse, [frageId]: korrekt },
        score: session.score + (korrekt ? 1 : 0),
      },
      feedbackSichtbar: true,
      letzteAntwortKorrekt: korrekt,
    })
  },
```

- [ ] **Step 7: TypeScript-Build**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
npx tsc -b
```

Erwartet: exit 0. Wenn Fehler zu `teilaufgaben`-Typ-Cast: die Helper oben nutzen `as Frage & {teilaufgaben?: Frage[]}` — das ist bewusst, weil `Frage` Union-Type ist und nicht jeder Typ `teilaufgaben` hat.

- [ ] **Step 8: Vitest — bestehende Tests müssen weiter grün sein**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
npx vitest run
```

Erwartet: alle bisher grünen Tests (429+) grün. Neue Tests kommen in Task 6.

Commit kommt erst in Task 6 zusammen mit den Integration-Tests.

---

## Task 6: Store-Integration-Tests (Merge + Fallback)

**Files:**
- Create: `ExamLab/src/tests/uebungsStoreLoesungsPreload.test.ts`

- [ ] **Step 1: Test-Datei anlegen**

`ExamLab/src/tests/uebungsStoreLoesungsPreload.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUebenUebungsStore } from '../store/ueben/uebungsStore'
import type { Frage } from '../types/ueben/fragen'

vi.mock('../adapters/ueben/appsScriptAdapter', () => ({
  uebenFragenAdapter: {
    ladeFragen: vi.fn(),
  },
}))
vi.mock('../services/uebenLoesungsApi', () => ({
  ladeLoesungenApi: vi.fn(),
}))
vi.mock('../store/ueben/authStore', () => ({
  useUebenAuthStore: {
    getState: () => ({ user: { email: 'sus@stud.test', sessionToken: 'tok' } }),
  },
}))

import { uebenFragenAdapter } from '../adapters/ueben/appsScriptAdapter'
import { ladeLoesungenApi } from '../services/uebenLoesungsApi'

const mcFrage: Frage = {
  id: 'f1',
  typ: 'mc',
  version: 1,
  erstelltAm: '',
  geaendertAm: '',
  fachbereich: 'VWL',
  fach: 'VWL',
  thema: 'Test',
  unterthema: '',
  bloom: 'K1',
  semester: ['S1'],
  gefaesse: ['SF'],
  tags: [],
  punkte: 1,
  zeitbedarf: 1,
  verwendungen: [],
  quelle: 'manuell',
  autor: { email: 'x', name: 'x' },
  fragetext: 'Welche Antwort ist richtig?',
  optionen: [
    { id: 'a', text: 'A' },
    { id: 'b', text: 'B' },
  ],
  mehrfachauswahl: false,
} as Frage

describe('uebungsStore Lösungs-Preload', () => {
  beforeEach(() => {
    vi.mocked(uebenFragenAdapter.ladeFragen).mockReset()
    vi.mocked(ladeLoesungenApi).mockReset()
    useUebenUebungsStore.setState({
      session: null,
      ladeStatus: 'idle',
      feedbackSichtbar: false,
      letzteAntwortKorrekt: null,
      speichertPruefung: false,
      pruefFehler: null,
      letzteMusterloesung: null,
      loesungenPreloaded: {},
      historie: [],
    })
  })

  it('merged Lösungs-Slice in Frage und markiert als preloaded', async () => {
    vi.mocked(uebenFragenAdapter.ladeFragen).mockResolvedValue([mcFrage])
    vi.mocked(ladeLoesungenApi).mockResolvedValue({
      f1: { optionen: [{ id: 'a', korrekt: true }], musterlosung: 'A ist korrekt.' },
    })

    await useUebenUebungsStore.getState().starteSession('g1', 'sus@stud.test', 'VWL', 'Test')

    const state = useUebenUebungsStore.getState()
    expect(state.ladeStatus).toBe('fertig')
    const session = state.session!
    const frage = session.fragen.find(f => f.id === 'f1') as Frage & { optionen: Array<{id:string; korrekt?:boolean}>; musterlosung?: string }
    expect(frage.optionen.find(o => o.id === 'a')?.korrekt).toBe(true)
    expect(frage.musterlosung).toBe('A ist korrekt.')
    expect(state.loesungenPreloaded.f1).toBe(true)
  })

  it('bei Preload-Fehler startet Session, markiert Fragen NICHT als preloaded', async () => {
    vi.mocked(uebenFragenAdapter.ladeFragen).mockResolvedValue([mcFrage])
    vi.mocked(ladeLoesungenApi).mockRejectedValue(new Error('Rate limit'))

    await useUebenUebungsStore.getState().starteSession('g1', 'sus@stud.test', 'VWL', 'Test')

    const state = useUebenUebungsStore.getState()
    expect(state.ladeStatus).toBe('fertig')
    expect(state.session?.fragen.length).toBe(1)
    expect(state.loesungenPreloaded.f1).toBe(undefined) // kein Eintrag = falsy → Fallback
  })

  it('bei Partial-Response: nur gelieferte Fragen sind preloaded', async () => {
    const mcFrage2: Frage = { ...mcFrage, id: 'f2' } as Frage
    vi.mocked(uebenFragenAdapter.ladeFragen).mockResolvedValue([mcFrage, mcFrage2])
    vi.mocked(ladeLoesungenApi).mockResolvedValue({
      f1: { optionen: [{ id: 'a', korrekt: true }] },
      // f2 fehlt
    })

    await useUebenUebungsStore.getState().starteSession('g1', 'sus@stud.test', 'VWL', 'Test')

    const state = useUebenUebungsStore.getState()
    expect(state.loesungenPreloaded.f1).toBe(true)
    expect(state.loesungenPreloaded.f2).toBe(false)
  })
})
```

- [ ] **Step 2: Test laufen lassen — neue Tests grün, alte Tests grün**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
npx vitest run src/tests/uebungsStoreLoesungsPreload.test.ts
```

Erwartet: 3/3 PASS.

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
npx vitest run
```

Erwartet: alle Tests grün.

- [ ] **Step 3: Build**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
npx tsc -b && npm run build
```

Erwartet: beide exit 0.

- [ ] **Step 4: Commit (Frontend-Integration gesamt)**

```bash
cd "10 Github/GYM-WR-DUY"
git add ExamLab/src/store/ueben/uebungsStore.ts ExamLab/src/tests/uebungsStoreLoesungsPreload.test.ts
git commit -m "$(cat <<'EOF'
ExamLab: uebungsStore Lösungs-Preload + Fallback (Bundle Ü)

starteSession ruft nach ladeFragen den Lösungs-Preload über
uebenLoesungsApi, merged Lösungs-Slices in session.fragen und
markiert pro Frage in loesungenPreloaded (Map<frageId, boolean>).

beantworteById verzweigt pro Frage:
- preloaded=true: clientseitige pruefeAntwort (instant)
- preloaded=false: Fallback auf pruefeAntwortJetzt (Server-Roundtrip)

mergeLoesungen-Helper: Top-Level-Felder direkt, Listen-Felder per id
gemerged, Reihenfolgen-kritische Felder (elemente, paare) aus Slice
überschreiben den Client-Mischwert. Aufgabengruppen: Teilaufgaben
aus flacher Map per id gemerged.

Lösungs-Daten landen NICHT in localStorage (Zustand-persist ignoriert
loesungenPreloaded und session.fragen).

3 Integration-Tests: Merge, Preload-Fehler-Fallback, Partial-Response.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Build + Vollständige Test-Suite

- [ ] **Step 1: tsc**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
npx tsc -b
```

Erwartet: exit 0.

- [ ] **Step 2: vitest**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
npx vitest run
```

Erwartet: alle Tests grün (429 vor Bundle Ü + 7 neue = 436).

- [ ] **Step 3: build**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab"
npm run build
```

Erwartet: exit 0.

- [ ] **Step 4: keine weiteren Commits in diesem Task** — nur Verifikation.

---

## Task 8: Apps-Script-Deploy + Staging-E2E (User-Aktion)

**Files:**
- Manual: Apps-Script-Editor

Backend-Änderungen brauchen manuellen User-Deploy (wie bei Bundle P). **Keine aktive Prüfung während Deploy.**

- [ ] **Step 1: User-Vorbereitung**

User-Aktion:
1. Apps-Script-Editor öffnen.
2. "Bereitstellungen verwalten" — aktuelle Version notieren (Rollback-Punkt).

- [ ] **Step 2: Deploy**

User-Aktion:
1. `ExamLab/apps-script-code.js` komplett in Apps-Script-Editor kopieren.
2. "Bereitstellung verwalten → Bearbeiten → Version: Neu → Bereitstellen".
3. Claude bestätigen: "Apps-Script deployed".

- [ ] **Step 3: Post-Deploy Smoke-Check**

Claude-Aktion: Direkt-Call an Apps-Script im echten SuS-Tab:

```javascript
// Im Browser-Tab-JavaScript-Tool:
(async function(){
  const auth = JSON.parse(localStorage.getItem('ueben-auth'));
  const url = 'https://script.google.com/macros/s/AKfycbzv88MEo_6VulH4Z10U7IvhNkdISGU5AQRQiCNL72v_N4EDXMvr4PJ5phfPExmJyZN_IA/exec';
  const res = await fetch(url, {
    method: 'POST',
    redirect: 'follow',
    body: JSON.stringify({
      action: 'lernplattformLadeLoesungen',
      gruppeId: 'test',
      fragenIds: ['einr-mc-uielemente', 'einr-rf-toolfunktionen'],
      email: auth.email,
      token: auth.sessionToken,
      fachbereich: 'BWL'
    })
  });
  const txt = await res.text();
  return JSON.stringify({status: res.status, head: txt.substring(0, 500)});
})()
```

Erwartet: `{"success":true,"loesungen":{"einr-mc-uielemente":{...korrekt-Felder...}}}`. Wenn `{"success":false,"error":"Aktion nicht gefunden"}` → Deploy-Queue hängt, leerer Commit + User-Deploy wiederholen.

- [ ] **Step 4: Staging-E2E — SuS Übung starten**

Claude-Aktion im SuS-Echt-Tab:
1. Navigate zu `/sus/ueben`.
2. Eine Übung starten (z.B. VWL-Thema).
3. Network-Tab prüfen via `read_network_requests`:
   - Genau **1** Pre-Load-Call zu Apps-Script mit Action `lernplattformLadeLoesungen` am Session-Start.
   - Response enthält `loesungen`-Map mit Feldern.

- [ ] **Step 5: Staging-E2E — Instant-Korrektur bei Auto-Korrektur-Typen**

Claude-Aktion: Mehrere Fragetypen beantworten + "Antwort prüfen" klicken:
- MC-Frage → instant Feedback (kein Server-Spinner)
- R/F-Frage → instant
- Lückentext → instant
- Berechnung → instant
- Für jeden Typ: `read_network_requests` → KEIN `lernplattformPruefeAntwort`-Call (weil Client-seitig korrigiert wurde).

- [ ] **Step 6: Staging-E2E — Fallback-Test**

Claude-Aktion:
1. Im Browser-Tab via `preview_eval` einen Frage-ID aus `loesungenPreloaded` künstlich auf `false` setzen (simuliert Partial-Fallback).
2. Diese Frage beantworten + "Antwort prüfen".
3. `read_network_requests` → `lernplattformPruefeAntwort`-Call muss erscheinen (Fallback).

JavaScript-Patch:
```javascript
// Im Store-Modul (Zustand ist global exponiert über window)
// Alternative: via localStorage den Session-Store lesen, um die erste Frage-ID zu finden.
// Dann:
useUebenUebungsStore.setState(s => ({
  loesungenPreloaded: { ...s.loesungenPreloaded, [frageIdVonErsterFrage]: false }
}))
```

(Weil `useUebenUebungsStore` nicht auf `window` exposed ist, führe dieses Snippet direkt aus der DevTools-Konsole via copy-paste aus — ODER, wenn das zu aufwändig ist, nutze ein explizites `?preload=off`-URL-Flag als Simulations-Shortcut für diesen Test. **Für den Plan: minimale Variante** — Test manuell nur auf Console-Konsole mit Snippet.)

- [ ] **Step 7: Regression-Test — Prüfungs-Flow unverändert**

Claude-Aktion im LP-Tab:
1. Bundle-P-Verifikation wiederholen (kurz): existierende Prüfung laden → Response enthält keine Lösungsfelder (aus Bundle P).
2. Neue Lösungs-Endpoint-Existenz beeinflusst nicht den Prüfungs-Pfad.

User bestätigt: "E2E grün".

---

## Task 9: HANDOFF + Merge-Gate

- [ ] **Step 1: HANDOFF.md ergänzen**

Öffne `ExamLab/HANDOFF.md`. Ersetze den Abschnitt "Session 126 — Bundle P: Prüfung-Hardening (2026-04-20)" durch eine Kombination der bestehenden P-Info + neuer Ü-Sektion. Alternativ: direkt nach "Session 126"-Abschnitt neuen "Session 127" einfügen.

Füge nach dem Session-126-Block ein (vor "### Offene Punkte (priorisiert)"):

```markdown
### Session 127 — Bundle Ü: Üben-Pre-Load (2026-04-20)

Branch `feature/bundle-ue-ueben-preload` → `main`. Spec `docs/superpowers/specs/2026-04-20-musterloesungen-bereinigung-design.md` (Abschnitt Bundle Ü), Plan `docs/superpowers/plans/2026-04-20-bundle-ue-ueben-preload.md`.

**Ziel:** Selbstständiges Üben korrigiert instant clientseitig, Lösungen werden beim Session-Start in einem separaten autorisierten Call geladen. Spart ~1.5-2s Apps-Script-Roundtrip pro „Antwort prüfen"-Klick.

**Umgesetzt:**
- Backend: `lernplattformLadeLoesungen`-Endpoint + `extrahiereLoesungsSlice_`-Helper (Umkehrfunktion von `bereinigeFrageFuerSuS_`). Rate-Limit 5/Minute, Token-Auth, Audit-Log. Aufgabengruppen-Teilaufgaben als eigene Keys in flacher Map.
- Frontend-Types: `LoesungsSlice` + `LoesungsMap` in `src/types/ueben/loesung.ts`.
- Frontend-Service: `uebenLoesungsApi.ts` (4 Unit-Tests).
- Store: `uebungsStore` erweitert um `loesungenPreloaded: Record<string, boolean>`; `starteSession` merged Lösungen in Session-Fragen; `beantworteById` verzweigt pro Frage clientseitig vs. Server-Fallback (3 Integration-Tests).
- Lösungen landen nicht in localStorage (nur In-Memory).

**Staging-E2E verifiziert:**
- Pre-Load-Call am Session-Start (genau 1).
- Auto-Korrektur-Typen (MC/RF/Lückentext/Berechnung) geben instant Feedback ohne Server-Call.
- Partial-Fallback: künstlich gesetzter `preloaded=false` triggert `pruefeAntwortJetzt`-Aufruf.
- Bundle-P-Regression unverändert (kein Leak via Lade-Pfad).
```

Aktualisiere den "Aktueller Stand" oben im HANDOFF:
```markdown
### Aktueller Stand (Ende S127)
- **Alles auf `main`**. Letzter Commit: Bundle Ü Merge. Apps-Script deployed. Keine offenen Feature-Branches.
- **Tests:** 436/436 vitest grün, tsc -b grün.
```

Entferne aus "Offene Punkte" den Eintrag für Bundle Ü (ist jetzt live).

- [ ] **Step 2: HANDOFF committen**

```bash
cd "10 Github/GYM-WR-DUY"
git add ExamLab/HANDOFF.md
git commit -m "$(cat <<'EOF'
ExamLab: HANDOFF für S127 Bundle Ü aktualisiert

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 3: Merge-Gate-Check**

Claude meldet:

```
Bundle Ü ready for merge. Checklist:
- [x] tsc -b grün
- [x] vitest grün (436/436)
- [x] npm run build grün
- [x] Apps-Script deployed
- [x] Staging-E2E Pre-Load-Call + instant Korrektur grün
- [x] Staging-E2E Fallback-Pfad grün
- [x] Bundle-P-Regression grün
- [x] HANDOFF.md aktualisiert

Bereit für Merge auf main?
```

User antwortet "ja" → Step 4. Sonst Fix + Step 3 wiederholen.

- [ ] **Step 4: Merge + Push**

```bash
cd "10 Github/GYM-WR-DUY"
git checkout main
git merge --no-ff feature/bundle-ue-ueben-preload -m "$(cat <<'EOF'
Bundle Ü: Üben-Pre-Load

Selbstständiges Üben korrigiert instant clientseitig.
Neuer Apps-Script-Endpoint lernplattformLadeLoesungen liefert
Lösungs-Slices am Session-Start; Store merged sie in Session-Fragen.
beantworteById verzweigt pro Frage: clientseitig wenn preloaded,
sonst Fallback auf pruefeAntwortJetzt.

Spart ~1.5-2s pro Antwort-Prüfen-Klick.

Spec: docs/superpowers/specs/2026-04-20-musterloesungen-bereinigung-design.md
Plan: docs/superpowers/plans/2026-04-20-bundle-ue-ueben-preload.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git push
git branch -d feature/bundle-ue-ueben-preload
```

- [ ] **Step 5: Claude meldet Abschluss**

```
Bundle Ü auf main. Letzter Commit: <sha>. Beide Bundles der
Musterlösungen-Bereinigung sind damit live (P + Ü).
```

---

## Rollback-Plan

Bei Regression in Task 8:
1. **Apps-Script-Rollback:** Alte Deployment-Version reaktivieren. Frontend auf altem `main` (vor Ü-Merge) funktioniert mit altem Apps-Script — die neue Lösungs-Endpoint-Abfrage schlägt dann fehl, fällt auf Server-Korrektur zurück. Tolerabel.
2. **Git-Rollback** (nach Merge): `git revert <merge-commit>`.
3. **Feature-Branch behalten** — kein `branch -d` vor erfolgreicher Verifikation.

---

## Risiken & Annahmen

**Annahme 1:** Der Merge-Helper `mergeLoesungInFrage` behandelt alle relevanten Listen-Felder korrekt per id. Risiko: Frage-Typen wo Listen-Items keine `id` haben (z.B. reiner `string[]`-labels in DragDrop-Bild). Mitigation: `mergeById` prüft `typeof item !== 'object'` → primitive Items werden unverändert durchgereicht, was die korrekte Semantik ist (Lösung für strings liegt bereits in der Zuordnung `labels[].zoneId`, die wir bei Object-Items mergen).

**Annahme 2:** `loesungenPreloaded: Record<string, boolean>` als Plain-Object (nicht `Map`) ist serialisierbar für Zustand; wir blockieren die Persistierung durch `partialize` (S125 Pattern) oder durch die bewusste Abwesenheit in der persist-Konfiguration. Aktuell hat `uebungsStore` keine `persist`-Middleware (nur `historie` wird manuell in localStorage gespeichert), also ist das Feld automatisch nicht persistent.

**Annahme 3:** Apps-Script-Latenz für `lernplattformLadeLoesungen` ist vergleichbar mit `lernplattformLadeFragen` (~1.5-2s). Das ist akzeptabel, weil es NUR am Session-Start läuft (nicht pro Klick) und der Preload-Spinner während „Session wird geladen" parallel zum bereits existierenden Fragen-Ladevorgang läuft. Wenn es deutlich langsamer wird → Task 8 Schritt 4 fängt das.

**Risiko (niedrig):** `mergeById` mutiert keine Listen, sondern erstellt neue Arrays. Bei grossen Sessions (200 Fragen × 4 Optionen) sind das Tausende Object-Spreads — bleibt unter 10ms auf modernen Maschinen. Nicht optimieren ohne Messung.

**Risiko (mittel):** Bei einem Test auf echten Daten kann `extrahiereLoesungsSlice_` für einen bisher nicht bedachten Fragetyp Lücken haben (z.B. wenn eine Frage im Sheet ein nicht standardisiertes Feld nutzt). Mitigation: Task 8 Step 5 testet alle Auto-Korrektur-Typen. Nicht-Auto-Typen (freitext, audio, pdf, code, visualisierung) brauchen nur `musterlosung` + `bewertungsraster` — sind einfacher.

**Risiko (niedrig):** Race-Condition beim Session-Start — wenn User sehr schnell nach „Übung starten" schon eine Antwort klickt, könnte `loesungenPreloaded` noch leer sein. Aber: `starteSession` ist `async` und setzt `ladeStatus: 'laden'`; die UI zeigt bis `ladeStatus: 'fertig'` keine Fragen. Der Preload läuft IN der `starteSession` vor `set({session, ...})`. Keine Race möglich.

---

## Definition of Done

- [ ] `LoesungsSlice` + `LoesungsMap` Types existieren.
- [ ] `uebenLoesungsApi.ladeLoesungenApi` funktioniert + 4 Unit-Tests grün.
- [ ] `apps-script-code.js` enthält `extrahiereLoesungsSlice_` + `lernplattformLadeLoesungen`-Endpoint.
- [ ] `uebungsStore` hat `loesungenPreloaded`-State + Merge-Logik + Branch-Logik.
- [ ] 3 Store-Integration-Tests grün.
- [ ] `tsc -b`, `vitest run`, `npm run build` grün.
- [ ] Apps-Script deployed.
- [ ] Staging-E2E: Pre-Load-Call + instant Korrektur bestätigt, Fallback-Pfad bestätigt, Bundle-P-Regression clean.
- [ ] HANDOFF.md S127 dokumentiert, alter Bundle-Ü-Offene-Punkt entfernt.
- [ ] Merge auf main + Push + Branch gelöscht.
