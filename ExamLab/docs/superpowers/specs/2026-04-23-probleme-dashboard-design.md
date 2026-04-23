# Spec — Probleme-Dashboard in Einstellungen

**Datum:** 2026-04-23
**Bundle:** F1
**Autor:** DUY + Claude
**Status:** Draft (pending Review)

## Ziel

Admin und Lehrpersonen (LPs) sollen die via `FeedbackModal` eingereichten Problemmeldungen und Wünsche niederschwellig einsehen und als erledigt markieren können — direkt in ExamLab unter **Einstellungen → Problemmeldungen**. Jede Meldung bietet einen Deep-Link zur betroffenen Frage / Prüfung / Übungsgruppe, damit Fehler sofort behoben werden können.

## Ausgangslage

Heute landen alle Meldungen aus dem FeedbackModal via `no-cors` GET in einem separaten Apps-Script-Deploy (`AKfycbwSxIOq…`), das in das Google Sheet *„ExamLab Problemmeldungen"* schreibt. Die Meldungen werden aktuell **nie ausgelesen** in der App — DUY schaut manuell ins Sheet. Das ist unpraktikabel und verhindert kollegiale Zusammenarbeit.

Wichtige Eigenschaften der heutigen Write-Lösung, die erhalten bleiben müssen:

- **Anonyme Schreibe:** Keine User-Email landet im Sheet, nur `rolle`, `gruppeId`, `frageId`, etc. SuS müssen nicht authentifiziert sein, um ein Problem zu melden.
- **Fire-and-forget:** `no-cors` + lokaler Erfolgs-Overlay im Modal. Kein Retry, kein Roundtrip-Risiko.
- **Bestehender Endpoint** soll unverändert bleiben — kein Risiko für den Schreibpfad.

## Scope

### In Scope

- Neuer Tab **„Problemmeldungen"** im `EinstellungenPanel.tsx` (immer sichtbar, Badge-Count offener Meldungen).
- Liste alle Meldungen (Probleme + Wünsche) mit Status-/Typ-Filter, clientseitigem „Nur meine Fragen"-Toggle, Deep-Link-Button.
- „Erledigt"-Checkbox pro Zeile (Toggle im Sheet).
- Sichtbarkeits-Regeln: Admin sieht alles; LPs sehen nur Meldungen mit Fragen-/Prüfungs-/Übungskontext.
- Zwei neue Endpoints in der **Haupt-Apps-Script**: `listeProblemmeldungen`, `markiereProblemmeldungErledigt`.
- Eine kleine Anpassung im **separaten Feedback-Apps-Script**: UUID-Generierung beim Write (neue Spalte `id`) + neue Spalte `erledigt` (leer).

### Out of Scope

- Automatische Archivierung / Löschung (YAGNI, Google Sheets hält 10M+ Zellen).
- Notiz-Feld beim Erledigt-Markieren („wie gelöst").
- Dreistufiger Workflow (Offen/In Arbeit/Erledigt).
- Push-Notifications oder E-Mail-Benachrichtigungen an LP.
- Reply-Funktion an SuS (heute Schreiber anonym, keine Email).
- Export/Bulk-Operations.

## Design-Entscheidungen

### Sichtbarkeits-Regeln

- **Admin** (LP-Sheet-Eintrag mit `rolle='admin'` oder Inhaber-Email): sieht alle Meldungen — inklusive solche ohne Fragenkontext (UX-Feedback, Feature-Wünsche an die Plattform).
- **LP** (alle anderen zugelassenen LPs): sieht **nur Meldungen mit Fragenkontext** — d.h. wenigstens eines von `frageId`, `pruefungId`, `gruppeId` ist gesetzt. Allgemeine App-Feedbacks erreichen nur den Admin.
- **SuS**: kein Zugriff. Der Tab ist in der SuS-Ansicht ohnehin nicht erreichbar, zusätzlich Backend-Rollen-Check.

**Client-Filter „Nur meine Fragen"** (Checkbox, Default AUS):
Filtert Meldungen nach `inhaberEmail === user.email`. `inhaberEmail` wird vom Backend beim `listeProblemmeldungen` aufgelöst (Sheet-Lookup über `frageId`).

### Status-Workflow

- Eine einzige Boolean-Spalte `erledigt` (`''` / `'ja'`).
- **Status-Filter** oben: `Offen` (Default) / `Erledigt` / `Alle`.
- Erledigte Meldungen bleiben im Sheet (Historie / Audit). Keine Auto-Archivierung.
- Tab-Badge zählt nur **offene** Meldungen im Sichtbarkeitsbereich des Users.

### Typ-Handling

- Beide Typen (`problem` und `wunsch`) in einer Liste.
- **Typ-Filter** oben: `Alle` (Default) / `Probleme` / `Wünsche`.
- Typ-Badge pro Zeile (🔴 Problem / 💡 Wunsch).

### Deep-Link (Priorität)

Universal-Link pro Zeile. Klick öffnet ein Ziel, in dieser Priorität:

1. **`frageId` vorhanden** → Fragensammlung-Editor auf die Frage. Falls LP keinen Lesezugriff hat (Inhaber-Check im Backend), Link disabled mit Tooltip.
2. **`pruefungId`** oder **`gruppeId`** → Prüfungs-/Übungsgruppen-Settings. Falls nicht Inhaber, disabled.
3. **`ort`** (Bildschirm-Kontext, z.B. `dashboard`, `sus-startseite`) → als reiner Text angezeigt, kein klickbarer Link.

### Sortierung

- Neueste zuerst (`zeitstempel DESC`).

### Backend-Architektur (Hybrid)

Begründung: Schreiben muss anonym bleiben (SuS-Pseudo-Anonymität), Lesen/Toggle braucht Auth.

- **Schreiben** (unverändert): separater Feedback-Apps-Script, `no-cors` GET, neue Spalten `id` (UUID beim Write) + `erledigt` (leer).
- **Lesen** (`listeProblemmeldungen`): neu in Haupt-Apps-Script, Auth über Session-Token, greift per `SpreadsheetApp.openById(PROBLEMMELDUNGEN_SHEET_ID)` auf das Sheet zu.
- **Toggle** (`markiereProblemmeldungErledigt`): neu in Haupt-Apps-Script, Auth + IDOR-Check.

### Minimal-Invasiv: Schreibpfad bleibt

Das separate Feedback-Apps-Script bekommt genau eine Zeile mehr: UUID beim Write generieren und in neue Spalte `id` schreiben. Keine anderen Änderungen. Risiko minimal.

## Architektur

### Frontend-Komponenten (Neu)

```
src/components/settings/problemmeldungen/
├── ProblemmeldungenTab.tsx           // Container, State-Management
├── ProblemmeldungenListe.tsx         // Listen-Rendering
├── ProblemmeldungZeile.tsx           // Eine Zeile (Badge, Kontext, Link, Checkbox)
├── ProblemmeldungenFilter.tsx        // Status/Typ/Scope-Filter
└── problemmeldungenApi.ts            // Client-Wrapper um postJson
```

**Integration in `EinstellungenPanel.tsx`:**

```tsx
const tabs: { key: EinstellungenTab; label: string; sichtbar: boolean }[] = [
  { key: 'profil', label: 'Mein Profil', sichtbar: true },
  { key: 'lernziele', label: 'Lernziele', sichtbar: true },
  { key: 'favoriten', label: 'Favoriten', sichtbar: true },
  { key: 'uebungen', label: 'Übungen', sichtbar: true },
  { key: 'problemmeldungen', label: `Problemmeldungen (${offeneCount})`, sichtbar: true },
  { key: 'admin', label: 'Admin', sichtbar: admin },
  { key: 'kiKalibrierung', label: 'KI-Kalibrierung', sichtbar: true },
]
```

Badge-Count (`offeneCount`) kommt aus einem leichten `useProblemmeldungenBadge`-Hook, der nur die Anzahl offener Meldungen im Sichtbarkeitsbereich des Users abruft. Aufruf beim ersten Mount des Panels, dann nach jedem Erledigt-Toggle reaktiv.

**Type Union erweitern:**
```ts
// store/lpUIStore.ts
export type EinstellungenTab =
  | 'profil' | 'lernziele' | 'favoriten' | 'uebungen'
  | 'problemmeldungen' | 'admin' | 'kiKalibrierung'
```

**Deep-Link-Navigation:**
- Frage-Link: Navigiert via `useNavigate` (oder existierendem Router) auf `/lp/fragensammlung?frageId=<id>&oeffne=edit`. Der Router-Handler öffnet die Frage direkt im `FragenEditor`. Falls die Route nicht existiert, `window.location.href` als Fallback.
- Prüfungs-/Gruppen-Link: analog, jeweils auf bestehende Admin-Settings-Ansicht mit Pre-Selection.

### Backend-Endpoints (Haupt-Apps-Script)

```js
// apps-script-code.js

const PROBLEMMELDUNGEN_SHEET_ID = '…'  // hardcoded, als Script-Property

function listeProblemmeldungen(body) {
  var email = body.email
  if (!istZugelasseneLP(email)) return jsonResponse({error: 'Nicht autorisiert'})
  var lpInfo = findeLPInfo_(email)
  var istAdmin = lpInfo && lpInfo.rolle === 'admin'

  var sheet = SpreadsheetApp.openById(PROBLEMMELDUNGEN_SHEET_ID).getSheetByName('ExamLab-Problemmeldungen')
  var lastCol = sheet.getLastColumn()
  var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : []
  var lastRow = sheet.getLastRow()
  var rows = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, lastCol).getValues() : []

  var col = function(name) { return headers.indexOf(name) }
  var meldungen = rows.map(function(r) {
    var frageId = String(r[col('frageId')] || '')
    var inhaberEmail = frageId ? resolveFrageInhaber_(frageId) : ''
    return {
      id: String(r[col('id')] || ''),
      zeitstempel: toIsoStr_(r[col('zeitstempel')]),
      typ: String(r[col('typ')] || ''),
      category: String(r[col('category')] || ''),
      comment: String(r[col('comment')] || ''),
      rolle: String(r[col('rolle')] || ''),
      frageId: frageId,
      frageText: String(r[col('frageText')] || ''),
      frageTyp: String(r[col('frageTyp')] || ''),
      modus: String(r[col('modus')] || ''),
      pruefungId: String(r[col('pruefungId')] || ''),
      gruppeId: String(r[col('gruppeId')] || ''),
      ort: String(r[col('ort')] || ''),
      appVersion: String(r[col('appVersion')] || ''),
      inhaberEmail: inhaberEmail,
      erledigt: String(r[col('erledigt')] || '').toLowerCase() === 'ja',
    }
  })

  // LP-Sichtbarkeit: nur Meldungen mit Fragenkontext
  if (!istAdmin) {
    meldungen = meldungen.filter(function(m) {
      return m.frageId || m.pruefungId || m.gruppeId
    })
  }

  return jsonResponse({ success: true, data: meldungen })
}

function markiereProblemmeldungErledigt(body) {
  var email = body.email
  var id = String(body.id || '')
  var erledigt = !!body.erledigt
  if (!istZugelasseneLP(email)) return jsonResponse({error: 'Nicht autorisiert'})
  if (!id) return jsonResponse({error: 'id fehlt'})

  var lpInfo = findeLPInfo_(email)
  var istAdmin = lpInfo && lpInfo.rolle === 'admin'

  var sheet = SpreadsheetApp.openById(PROBLEMMELDUNGEN_SHEET_ID).getSheetByName('ExamLab-Problemmeldungen')
  var lastCol = sheet.getLastColumn()
  var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : []
  var idCol = headers.indexOf('id')
  var erledigtCol = headers.indexOf('erledigt')
  var frageIdCol = headers.indexOf('frageId')
  var lastRow = sheet.getLastRow()
  if (idCol < 0 || erledigtCol < 0) return jsonResponse({error: 'Sheet-Header kaputt'})

  var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues()
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][idCol]) !== id) continue

    // IDOR-Check: nicht-Admin darf nur eigene Fragen togglen
    if (!istAdmin) {
      var frageId = String(data[i][frageIdCol] || '')
      var inhaberEmail = frageId ? resolveFrageInhaber_(frageId) : ''
      if (inhaberEmail.toLowerCase() !== email.toLowerCase()) {
        return jsonResponse({error: 'Nicht eigene Meldung'})
      }
    }

    sheet.getRange(i + 2, erledigtCol + 1).setValue(erledigt ? 'ja' : '')
    return jsonResponse({ success: true })
  }
  return jsonResponse({error: 'Meldung nicht gefunden'})
}
```

**Hilfsfunktion `resolveFrageInhaber_(frageId)`:** Cache pro Request (Objekt-Lookup), liest einmal Fragen-Sheet und gibt Inhaber-Email zurück. Bei Cache-Miss: leer → im UI Link disabled.

### Feedback-Apps-Script (separat) — Minimal-Patch

Nur im Write-Handler:

```js
function doGet(e) {
  // … bestehender Code …
  var row = [
    new Date(),                    // zeitstempel
    Utilities.getUuid(),           // NEU: id (UUID v4)
    '',                            // NEU: erledigt (leer = offen)
    e.parameter.rolle || '',
    // … rest bleibt identisch …
  ]
  sheet.appendRow(row)
}
```

Bestehende Zeilen im Sheet haben keine UUID — Backfill-Skript (einmalig): fülle leere `id`-Zellen mit `Utilities.getUuid()`. Läuft als manueller GAS-Function-Aufruf vom Admin.

## Datenschema

Sheet *„ExamLab Problemmeldungen"*, Tab *„ExamLab-Problemmeldungen"*:

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| zeitstempel | Date | Einreichzeit |
| **id** (neu) | String (UUID) | Eindeutige ID pro Meldung, für Toggle |
| **erledigt** (neu) | String | `''` oder `'ja'` |
| rolle | String | `'lp'` oder `'sus'` |
| ort | String | Bildschirm-Kontext |
| typ | String | `'problem'` oder `'wunsch'` |
| category | String | z.B. `'Fachlicher Fehler'` |
| comment | String | Optional, bis 500 Zeichen |
| pruefungId | String | Optional |
| frageId | String | Optional |
| frageText | String | Optional, bis 200 Zeichen |
| zusatzinfo | String | Optional |
| frageTyp | String | Optional |
| modus | String | `'pruefen'` / `'ueben'` / `'fragensammlung'` |
| bildschirm | String | Optional |
| appVersion | String | Build-Timestamp |
| gruppeId | String | Optional |

## Security / Privacy

- **Schreibpfad bleibt anonym**: keine Email wird geschickt.
- **Lesen**: Rollen-Check über `istZugelasseneLP(email)` + Session-Token-Validierung wie bei anderen Endpoints.
- **IDOR-Schutz beim Toggle**: nicht-Admin muss Inhaber der Frage sein (via `resolveFrageInhaber_`).
- **LP-Filter**: Backend filtert Meldungen ohne Fragenkontext **nur für nicht-Admins** aus (App-Feedbacks sind Admin-only).
- **Kein XSS-Risiko**: React escape'd `comment` und `frageText` beim Rendern.

## Rollout

1. **Feature-Branch** `feature/problemmeldungen-dashboard`.
2. Backend-Patch (Haupt-Apps-Script): 2 neue Endpoints + `PROBLEMMELDUNGEN_SHEET_ID` als Script-Property.
3. Backend-Patch (Feedback-Apps-Script): UUID-Generierung beim Write, Backfill-Script für bestehende Zeilen.
4. Frontend: 5 neue Komponenten + Tab-Integration.
5. Tests (vitest): Filter-Logik, Deep-Link-Priorität, Badge-Count-Berechnung.
6. Staging-Deploy + E2E mit echten Logins (Admin + LP).
7. User-Freigabe → Merge `main`.

## Offene Fragen

Keine — alle relevanten Entscheidungen sind im Brainstorming beantwortet:

- Wer sieht was: Admin alles; LP nur mit Fragenkontext.
- Status: 2-stufig (Offen/Erledigt).
- Typ: beide Typen in einer Liste mit Filter-Badge.
- Deep-Link: Universal-Link mit Priorität `frageId > pruefungId/gruppeId > ort`.
- Archivierung: keine, Filter reicht.
- Backend: Hybrid (Schreiben unverändert, Lesen/Toggle in Haupt-Apps-Script).
