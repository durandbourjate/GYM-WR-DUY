# Design — Security-Hardening selbstständiges Üben

**Datum:** 2026-04-19
**Kontext:** S120 Follow-up nach S119. Security-Hinweis aus HANDOFF.md Z71: `lernplattformLadeFragen()` gibt `korrekteAntworten` 1:1 an SuS zurück.
**Status:** Design — in Review

---

## Ausgangslage

ExamLab hat drei SuS-Modi:

| Modus | Datenfluss | Bereinigung | Korrektur |
|-------|-----------|-------------|-----------|
| Prüfung | `ladePruefung()` | ✅ `bereinigeFrageFuerSuS_` | LP korrigiert später (ggf. KI) |
| Angeleitete Übung | `ladePruefung()` (Modus=`uebung`) | ✅ `bereinigeFrageFuerSuS_` | LP korrigiert später |
| Selbstständige Übung | `lernplattformLadeFragen()` | ❌ **kein Filter** | Client-side sofort nach Klick |

**Bug:** In Modus 3 werden komplette Fragen inkl. `korrekt`/`korrekteAntworten`/`musterlosung` an SuS geliefert — im Network-Tab sichtbar.

Zusätzlich leaken **implizite Felder** die Lösung über Reihenfolgen:
- `sortierung.elemente[]` ist die korrekte Reihenfolge
- `zuordnung.paare[]` enthält Links+Rechts als Paarung
- `mc.optionen[]` und `richtigfalsch.aussagen[]` können konstante Muster offenbaren (Position → Lösung)
- `bildbeschriftung.labels[]` und `dragdrop_bild.labels[]` ebenso

## Schutzziel

- **Vor** „Antwort prüfen"-Klick: Lösung nicht im Network-Tab ableitbar (weder explizit noch über Reihenfolge).
- **Nach** Klick: Korrektur-Resultat + Musterlösung werden ausgeliefert — der Lerneffekt bleibt erhalten.
- **Brute-Force explizit nicht im Scope.** R/F mit 2 Möglichkeiten lässt sich nicht durch Server-Korrektur schützen; SuS schadet sich selbst.
- **LP-Aufrufer** bekommen weiterhin unbereinigte Daten (Admin/Fragenbank-Edit).

Matura-Relevanz wird durch **Prüfungen** abgedeckt (bereits wasserdicht, unverändert). Selbstständiges Üben hat schwächere Ansprüche, aber „aus Prinzip" keine offenen Lösungen.

## Architektur

### Backend (apps-script-code.js)

**B1 — `lernplattformLadeFragen()` bereinigen**

```js
const email = (body.email || '').toLowerCase()
const istLP = istZugelasseneLP(email)
if (!istLP) {
  alleFragen = alleFragen.map(bereinigeFrageFuerSuSUeben_)
}
```

`bereinigeFrageFuerSuSUeben_` = erweiterte Variante von `bereinigeFrageFuerSuS_`, die zusätzlich die implizit-leakenden Reihenfolgen mischt (siehe B2).

**B2 — `bereinigeFrageFuerSuSUeben_` (neu)**

Baut auf `bereinigeFrageFuerSuS_` auf und ergänzt Mischung pro Typ. Mischung via Fisher-Yates (`shuffle_(arr)` Helper).

| Typ | Zusatz zu `bereinigeFrageFuerSuS_` |
|-----|-----------------------------------|
| `mc` | `optionen[]` mischen |
| `richtigfalsch` | `aussagen[]` mischen |
| `sortierung` | `elemente[]` mischen (Original = Lösung) |
| `zuordnung` | `paare[{links,rechts}]` → `linksItems[], rechtsItems[]` (rechts gemischt) |
| `bildbeschriftung` | `labels[]` mischen |
| `dragdrop_bild` | `labels[]` mischen |
| `hotspot` | `hotspots[]` mischen, `korrekt`-Flag pro Hotspot entfernen |
| `lueckentext` | Dropdown-Optionen pro Lücke mischen (falls vorhanden) |

Pro Aufruf neue Mischung — das macht DevTools-Scraping über mehrere Requests nutzlos.

**B3 — Neuer Endpoint `lernplattformPruefeAntwort`**

```
Input:  { action: 'lernplattformPruefeAntwort', gruppeId, frageId, antwort, email, token }
Auth:   sessionToken-Check, Rate-Limit 30/min pro SuS, Gruppen-Mitgliedschaft prüfen
Flow:
  1. Frage unbereinigt aus Fragenbank laden (FRAGENBANK_ID, kanonisch)
  2. pruefeAntwortServer_(frage, antwort) → boolean
  3. Bei Selbstbewertungstyp: return { selbstbewertung: true, musterlosung }
  4. Sonst: return { korrekt, musterlosung, korrektDetails? }
Response: { success: true, korrekt, musterlosung?, selbstbewertung?, korrektDetails? }
```

**B4 — Korrektur-Portierung**

Neue Helper `pruefeAntwortServer_(frage, antwort)` im Apps-Script. Portiert `korrektur.ts::pruefeAntwort` für alle 20 Fragetypen. Logik spiegelt Client-Code, Tests prüfen Paritäts-Invariante.

### Frontend (ExamLab/src)

**F1 — Service** `src/services/uebenKorrekturApi.ts`

```ts
export async function pruefeAntwort(
  gruppeId: string, frageId: string, antwort: Antwort
): Promise<PruefResultat>
```

Nutzt `uebenApiClient` analog `appsScriptAdapter`. Timeout 60s (Apps-Script Cold-Start).

**F2 — Store-Refactor** `uebungsStore.ts::pruefeAntwortJetzt`

- Wird async
- Setzt `speichertPruefung: true` während Request läuft
- Bei Erfolg: übernimmt `korrekt`/`musterlosung` in `feedbackSichtbar` + `letzteAntwortKorrekt` + `letzteMusterloesung`
- Bei Fehler: setzt `pruefFehler`, UI zeigt Retry-Banner + Fehlermeldung

**F3 — `useFrageAdapter.onPruefen`**

Ruft `store.pruefeAntwortJetzt` async. Propagiert `speichertPruefung`, `pruefFehler`.

**F4 — UI**

- `QuizNavigation`: „Antwort prüfen"-Button mit Spinner während Request, disabled
- `UebungsScreen` + `SelbstbewertungsDialog`: `pruefFehler`-Banner mit Retry-Button
- Selbstbewertungstypen: Musterlösung kommt zusammen mit `selbstbewertung: true` Flag

**F5 — `korrektur.ts::pruefeAntwort` bleibt**

Weiterhin genutzt für:
- Demo-Modus (`einrichtungsFragen`) — kein Backend
- Angeleitete Übungen (Modus=`uebung` via `ladePruefung`) — dort korrigiert LP manuell

Kein Delete, keine Breaking-Change.

## Datenfluss (neu)

```
SuS öffnet Thema
  → lernplattformLadeFragen { email, gruppeId }
  → [SuS-Path] bereinigeFrageFuerSuSUeben_ auf alle Fragen → mit Mischung
  → Client-Cache

SuS beantwortet + klickt "Antwort prüfen"
  → speichertPruefung = true
  → uebenKorrekturApi.pruefeAntwort { email, gruppeId, frageId, antwort }
  → lernplattformPruefeAntwort lädt Frage frisch, korrigiert server-side
  → { korrekt: true, musterlosung: "..." }
  → UI zeigt Feedback + Musterlösung

SuS Selbstbewertung (Freitext)
  → uebenKorrekturApi.pruefeAntwort { antwort }
  → { selbstbewertung: true, musterlosung: "..." }
  → SelbstbewertungsDialog zeigt Musterlösung + 3 Bewertungsbuttons
```

## Error-Handling

- **Apps-Script Cold-Start 30-60s:** 60s Timeout, bei Abort Retry-Banner
- **Rate-Limit-Trigger:** Fehlermeldung „Zu viele Anfragen — warte 1 Minute"
- **Gruppen-Mitgliedschaft fehlt:** 403, Fehlermeldung „Kein Zugriff auf diese Übung"
- **Netzwerk offline:** Fehler-Banner mit Retry, `onPruefen` bleibt klickbar
- **Backend liefert malformed Response:** Defensive Parse (wie bei `normalisiereLueckentext` aus S118), Fehler-Banner

## Tests

**Backend (manuell, dokumentiert in Spec):**
- SuS-Response von `lernplattformLadeFragen` enthält keine der 11 sensitiven Felder (`korrekt`, `korrekteAntworten`, `musterlosung`, `bewertungsraster`, `erklaerung`, `toleranz` + je pro Fragetyp)
- Mischung-Reihenfolge unterscheidet sich zwischen 2 Aufrufen (gleiche Frage, 2 Requests)
- `lernplattformPruefeAntwort` liefert `{korrekt: true}` für 6 Typen bei korrekten Antworten + `{korrekt: false}` bei falschen

**Frontend (Vitest, in `src/tests/`):**
- `uebungsStore.pruefeAntwortJetzt` setzt Loading-State, ruft API, übernimmt Resultat (Mock)
- `uebungsStore.pruefeAntwortJetzt` bei Fehler: setzt `pruefFehler`, kein Resultat
- `uebungsStore.pruefeAntwortJetzt` bei Selbstbewertung: setzt `musterloesung`, `korrekt=null`
- `uebenKorrekturApi.pruefeAntwort` Timeout-Verhalten
- Existing `korrektur.ts`-Tests bleiben grün (kein Delete)

**Browser E2E (Staging, echte Logins, Kontrollstufe Locker):**
- SuS öffnet Thema → Network-Tab-Check: keine `korrekt`-Felder in `lernplattformLadeFragen`-Response
- SuS klickt Prüfen → Network-Tab: `lernplattformPruefeAntwort` liefert `korrekt` + `musterlosung`
- Reload → neue Mischung sichtbar (z.B. MC-Optionen in anderer Reihenfolge)
- Netzwerk offline simulieren → Retry-Banner erscheint
- Selbstbewertung-Flow (Freitext): Dialog + 3 Buttons funktionieren
- LP öffnet Fragensammlung → alle Fragetypen editierbar, Lösungsdaten sichtbar (Fallback nicht ausgelöst)

## Out of Scope

- **Brute-Force-Schutz** — R/F trivial, MC nur leicht schwerer. Bei selbstständigem Üben kein Schutzziel.
- **Prüfungsmodus** — bereits wasserdicht über `ladePruefung` + `bereinigeFrageFuerSuS_`.
- **Angeleitete Übung** — läuft über `ladePruefung`, bereits wasserdicht.
- **Demo-Modus** — `einrichtungsFragen` lokal, kein Backend — bleibt lokale Korrektur.
- **Pool-Daten-Korrekturen** — z.B. `korrekteAntworten` in Lückentext-Daten unvollständig (S118-Normalizer-Workaround). Separates Thema Daten-Audit.

## Migration / Backwards Compat

- **Keine Client-Daten-Migration nötig** — API-Shape-Änderung ist additiv (`lernplattformPruefeAntwort` ist neu, `lernplattformLadeFragen` liefert weniger Felder für SuS).
- **Apps-Script-Deploy erforderlich** (User muss nach Merge manuell neue Bereitstellung erstellen — Deployment-Workflow-Rule).
- **Alte Clients vor diesem Fix:** bekommen bereinigte Fragen → deren Client-side `pruefeAntwort` liefert immer `korrekt: false` (weil Lösungsfelder fehlen). Akzeptabel — User updated Browser, neue Version aktiv.
- **Frontend-Feature-Flag:** nicht nötig, da Frontend + Backend zusammen deployen.

## Sicherheits-Invariante

Nach Implementation muss für jeden SuS-Aufruf gelten:

```
forall (frage in response.data):
  frage.korrekt === undefined  AND
  frage.musterlosung === undefined  AND
  frage.bewertungsraster === undefined  AND
  (frage.optionen || []).forEach(o => o.korrekt === undefined)  AND
  (frage.aussagen || []).forEach(a => a.korrekt === undefined)  AND
  (frage.luecken || []).forEach(l => l.korrekteAntworten === undefined)  AND
  (frage.ergebnisse || []).forEach(e => e.korrekt === undefined && e.toleranz === undefined)  AND
  ...
```

Ein Vitest-Snapshot-Test prüft diese Invariante gegen eine Mock-Response.

## Deployment-Reihenfolge

1. Backend + Frontend Merge auf `preview` (Staging)
2. User deployed Apps-Script Bereitstellung
3. E2E-Test auf Staging mit echten Logins
4. LP-Freigabe
5. Merge `preview` → `main` → Production
