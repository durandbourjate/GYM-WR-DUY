# Bundle G.d.1 — Phasen-Übergang-Latenzen Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vier Sync-Punkte zwischen LP und SuS (Lobby-Erkennung, Frage-Render nach Freischalten, Auswertung-Tab, SuS-Warteraum) durch zwei Polling-Tunings + zwei Backend-Pre-Warm-Trigger spürbar verkürzen.

**Architecture:** Backend bündelt einen einzigen Apps-Script-Deploy (neuer Helper `preWarmFragenBeimFreischalten_` inline in `schalteFreiEndpoint`, neuer Endpoint `lernplattformPreWarmKorrektur` mit kurzlebigem CacheService-Layer in `ladeKorrektur`/Invalidierung in `speichereKorrekturZeile` + `setKorrekturStatus` — letzteres deckt Bulk-Auto-Korrektur via `batchKorrektur` indirekt ab). Frontend folgt nach Deploy: zwei 1-Zeilen-Polling-Änderungen + neuer `preWarmKorrektur`-Wrapper in `preWarmApi.ts` mit drei Trigger-Stellen in `DurchfuehrenDashboard.tsx` (Tab-Wechsel via zentraler `wechsleTab`-Funktion, Phase-Wechsel-useEffect, Direct-Mount-Edge-Case). Spec-Pfad: `docs/superpowers/specs/2026-04-27-bundle-g-d-1-phasen-uebergang-latenzen-design.md`.

**Tech Stack:** Apps Script V8 + CacheService (Backend), React 19 + TypeScript + Vitest (Frontend), Vite-PWA (Build).

---

## File Structure

**Backend (`ExamLab/apps-script-code.js`)**
- Modify: `apps-script-code.js:6557-6634` — `ladeKorrektur` Cache-Hit-Pfad + Helper `ladeKorrekturBerechne_` extrahieren
- Modify: `apps-script-code.js:6553-6555` — `setKorrekturStatus` invalidiert Cache (deckt `batchKorrektur` indirekt ab — siehe Task 3 Architektur-Notiz)
- Modify: `apps-script-code.js:6716-6900` — `speichereKorrekturZeile` Cache-Invalidierung
- Modify: `apps-script-code.js:6906-6934` — `schalteFreiEndpoint` ruft Pre-Warm
- Add: `apps-script-code.js` neue Funktionen `preWarmFragenBeimFreischalten_`, `lernplattformPreWarmKorrektur` + Test-Shims `testPreWarmFragenBeimFreischalten_/testPreWarmKorrektur_` mit Public-Wrappern (S133-Lehre) + Top-Level `assert_` falls noch nicht definiert
- Modify: `apps-script-code.js:1395-1400` — Dispatcher-Case `'lernplattformPreWarmKorrektur'`

> **Nicht abgedeckt (bewusst):** `korrekturFreigebenEndpoint` (Z. 7092) schreibt nur die Configs-Spalten `korrekturFreigegeben` / `korrekturPdfFreigegeben` — diese Felder sind NICHT Teil des Korrektur-Cache-Bodys (`ladeKorrekturBerechne_` liefert nur schueler-Map + batchStatus). Daher keine Invalidierung nötig.

**Frontend (`ExamLab/src`)**
- Modify: `src/services/preWarmApi.ts` — neuer Wrapper `preWarmKorrektur(pruefungId, email, signal?)`
- Modify: `src/components/lp/durchfuehrung/DurchfuehrenDashboard.tsx:231` — Polling-Konstante Lobby
- Modify: `src/components/lp/durchfuehrung/DurchfuehrenDashboard.tsx:264-266` — Direct-Mount-Pre-Warm
- Modify: `src/components/lp/durchfuehrung/DurchfuehrenDashboard.tsx:299-306` — Phase-Wechsel-Pre-Warm
- Modify: `src/components/lp/durchfuehrung/DurchfuehrenDashboard.tsx:318-324` — `wechsleTab` triggert Pre-Warm
- Modify: `src/components/Startbildschirm.tsx:86` — Polling-Konstante Warteraum
- Test: `src/services/__tests__/preWarmApi.test.ts` — neue Cases für `preWarmKorrektur`
- Test: `src/components/lp/durchfuehrung/__tests__/DurchfuehrenDashboard.test.tsx` (neu falls nicht vorhanden) — Polling-Lobby + Tab-Trigger
- Test: `src/components/__tests__/Startbildschirm.test.tsx` (neu falls nicht vorhanden) — Polling-Warteraum

**Branch:** `feature/bundle-g-d-1-phasen-uebergang`

---

## Phase 1 — Backend (alles in einem Apps-Script-Deploy)

### Task 1: Helper `preWarmFragenBeimFreischalten_` + GAS-Test-Shim

**Files:**
- Modify: `ExamLab/apps-script-code.js` — Helper hinter `preWarmKorrekturNachAbgabe_` (Z. ~9050) + Test-Shim hinter Z. ~13510

- [ ] **Step 1.1: Branch erstellen + Backup committen**

```bash
cd ExamLab
git checkout main && git pull
git checkout -b feature/bundle-g-d-1-phasen-uebergang
```

- [ ] **Step 1.2: Helper schreiben — `preWarmFragenBeimFreischalten_(pruefungId)`**

Einfügen in `apps-script-code.js` direkt nach `preWarmKorrekturNachAbgabe_` (gefunden bei Z. 8999, endet ca. Z. 9051):

```js
/**
 * Bundle G.d.1 Hebel B — Inline-Pre-Warm der Frage-Daten beim LP-Klick "Freischalten".
 *
 * Wird aus schalteFreiEndpoint nach setValue('freigeschaltet') aufgerufen (try/catch).
 * Liest fragenIds aus Configs-Sheet anhand pruefungId und befüllt CacheService
 * via bulkLadeFragenAusSheet_. CacheService-Soft-Lock (30s) dedupliziert mit
 * G.a-Trigger A (lernplattformPreWarmFragen) — Lock-Key konkurriert NICHT
 * (anderer Prefix), also doppelter Pre-Warm möglich aber unschädlich.
 *
 * Latenz-Impact auf schalteFrei-Response: ~50-200ms cold, ~10ms warm.
 *
 * @param {string} pruefungId
 */
function preWarmFragenBeimFreischalten_(pruefungId) {
  var startMs = Date.now();
  try {
    // CacheService-Soft-Lock (30s) gegen Doppel-Read bei Schnell-Klicks
    var cache = CacheService.getScriptCache();
    var lockKey = 'prewarm_freischalten_' + pruefungId;
    if (cache.get(lockKey)) {
      Logger.log('[PreWarmFreischalten] dedup pruefungId=%s', pruefungId);
      return;
    }
    cache.put(lockKey, '1', 30);

    // fragenIds aus Configs-Sheet (analog preWarmKorrekturNachAbgabe_ Z.~9000)
    var configSheet = SpreadsheetApp.openById(CONFIGS_ID).getSheetByName('Configs');
    var configRow = getSheetData(configSheet).find(function(r) { return r.id === pruefungId; });
    if (!configRow) {
      console.log('[PreWarmFreischalten] Config nicht gefunden: ' + pruefungId);
      return;
    }

    var abschnitte;
    try { abschnitte = JSON.parse(configRow.abschnitte || '[]'); }
    catch (e) {
      console.log('[PreWarmFreischalten] abschnitte-Parse-Fehler: ' + e.message);
      return;
    }

    var fragenIds = [];
    for (var i = 0; i < abschnitte.length; i++) {
      var ids = abschnitte[i].fragenIds || abschnitte[i].fragen || [];
      for (var j = 0; j < ids.length; j++) {
        var fid = typeof ids[j] === 'string' ? ids[j] : (ids[j] && ids[j].id);
        if (fid) fragenIds.push(fid);
      }
    }
    if (fragenIds.length === 0) {
      console.log('[PreWarmFreischalten] keine fragenIds in pruefung=' + pruefungId);
      return;
    }

    var gruppeId = configRow.klasse || '';
    var fachbereich = (configRow.fachbereiche || '').split(',')[0] || '';
    // Guard analog lernplattformPreWarmFragen Z. 8942: ohne beide Hinweise würde
    // gruppiereFragenIdsNachTab_ undefiniert reagieren (G.a-Pattern).
    if (!gruppeId && !fachbereich) {
      console.log('[PreWarmFreischalten] keine gruppeId/fachbereich, skip pruefungId=' + pruefungId);
      return;
    }
    var byTab = gruppiereFragenIdsNachTab_(fragenIds, gruppeId, fachbereich);
    for (var sheetId in byTab) {
      for (var tab in byTab[sheetId]) {
        bulkLadeFragenAusSheet_(sheetId, tab, byTab[sheetId][tab]);
      }
    }

    var latenzMs = Date.now() - startMs;
    Logger.log('[PreWarmFreischalten] pruefungId=%s n=%s ms=%s',
               pruefungId, fragenIds.length, latenzMs);
  } catch (e) {
    console.log('[PreWarmFreischalten-Fehler] ' + e.message);
  }
}
```

- [ ] **Step 1.3: Test-Shim mit Public-Wrapper**

Direkt nach dem existierenden `testPreWarmKorrekturNachAbgabe_` (gefunden bei Z. ~13477) einfügen:

```js
/**
 * Test-Shim für preWarmFragenBeimFreischalten_ (Bundle G.d.1 Hebel B).
 * Public-Wrapper testPreWarmFragenBeimFreischalten ohne trailing-Underscore
 * (S133-Lehre: GAS-Editor-Dropdown blendet '_'-Funktionen aus).
 */
function testPreWarmFragenBeimFreischalten_() {
  var configSheet = SpreadsheetApp.openById(CONFIGS_ID).getSheetByName('Configs');
  var rows = getSheetData(configSheet).filter(function(r) { return r.abschnitte; });
  if (rows.length === 0) {
    throw new Error('Keine Test-Pruefung mit abschnitte gefunden');
  }
  var testConfig = rows[0];
  Logger.log('Test-Config: id=%s titel=%s', testConfig.id, testConfig.titel);

  // Cache cleanup vor Test
  var cache = CacheService.getScriptCache();
  cache.remove('prewarm_freischalten_' + testConfig.id);

  // Case (a) Cold-Call
  var t1 = Date.now();
  preWarmFragenBeimFreischalten_(testConfig.id);
  var ms1 = Date.now() - t1;
  Logger.log('Case (a) Cold: ms=%s', ms1);
  assert_(ms1 < 5000, 'Cold-Call > 5s — verdaechtig');
  assert_(cache.get('prewarm_freischalten_' + testConfig.id) === '1',
          'Lock-Key nach Cold-Call nicht gesetzt');

  // Case (b) Deduped
  var t2 = Date.now();
  preWarmFragenBeimFreischalten_(testConfig.id);
  var ms2 = Date.now() - t2;
  Logger.log('Case (b) Deduped: ms=%s', ms2);
  assert_(ms2 < 500, 'Deduped-Call zu langsam — Lock greift nicht');

  // Case (c) Unbekannte pruefungId — kein Crash
  preWarmFragenBeimFreischalten_('inexistente-id-xyz');
  Logger.log('Case (c) Unbekannte ID: kein Crash');

  Logger.log('=== testPreWarmFragenBeimFreischalten_ alle Cases gruen ===');
}
function testPreWarmFragenBeimFreischalten() { testPreWarmFragenBeimFreischalten_(); }

// Top-Level assert_ — alle bestehenden assert_-Definitionen sind function-scoped
// (innerhalb anderer Test-Shims) und damit von hier aus nicht erreichbar.
// Nur einmal definieren, falls bei Codebase-Update ein Top-Level-assert_ ergänzt wird,
// kann diese Definition entfallen.
function assert_(cond, msg) { if (!cond) throw new Error(msg); }
```

> **Hinweis:** Vor Implementierung `grep -nE "^function assert_" ExamLab/apps-script-code.js` ausführen. Wenn die Liste nur lokale `var assert_` oder function-scoped `function assert_` zeigt: Top-Level-Definition wie oben mit aufnehmen. Wenn bereits ein Top-Level-`assert_` existiert: Definition weglassen.

- [ ] **Step 1.4: Commit**

```bash
git add ExamLab/apps-script-code.js
git commit -m "G.d.1 Backend: Helper preWarmFragenBeimFreischalten_ + Test-Shim"
```

---

### Task 2: `schalteFreiEndpoint` ruft Pre-Warm auf

**Files:**
- Modify: `ExamLab/apps-script-code.js:6906-6934`

- [ ] **Step 2.1: Aufruf nach setValue einfügen**

In `schalteFreiEndpoint` (Z. 6906) nach dem `setValue('true')`-Block (Z. 6926-6929) und VOR dem `return jsonResponse({ success: true })` (Z. 6931):

```js
    if (col >= 0) {
      configSheet.getRange(rowIndex + 2, col + 1).setValue('true');
    }

    // Bundle G.d.1 Hebel B — Inline-Pre-Warm der Frage-Daten
    try {
      preWarmFragenBeimFreischalten_(pruefungId);
    } catch (e) {
      console.log('[SchalteFrei-PreWarm-Fehler] ' + e.message);
    }

    return jsonResponse({ success: true });
```

- [ ] **Step 2.2: GAS-Editor-Manueller-Test (lokal nicht testbar)**

Notiz für User: nach Deploy `testPreWarmFragenBeimFreischalten` im GAS-Editor laufen lassen. Erwartete Ausgabe: alle 3 Cases grün, Logger zeigt Cold-Call ms.

- [ ] **Step 2.3: Commit**

```bash
git add ExamLab/apps-script-code.js
git commit -m "G.d.1 Backend: schalteFreiEndpoint ruft preWarmFragenBeimFreischalten_"
```

---

### Task 3: `ladeKorrektur` Cache-Layer + Invalidierung

**Files:**
- Modify: `ExamLab/apps-script-code.js:6557-6634` — `ladeKorrektur` mit Cache-Hit-Check + Helper-Aufruf
- Add: `apps-script-code.js` — `ladeKorrekturBerechne_(pruefungId)` direkt VOR `ladeKorrektur`
- Modify: `ExamLab/apps-script-code.js:6553-6555` — `setKorrekturStatus` invalidiert (deckt `batchKorrektur` indirekt ab)
- Modify: `ExamLab/apps-script-code.js:6716-6900` — `speichereKorrekturZeile` invalidiert

**Architektur-Entscheidung:** Kurzlebiger Cache (60s TTL) unter Key `'korrektur_data_' + pruefungId`. Cache-Wert ist die JSON-Struktur die `ladeKorrektur` als Body sendet (alles ausser `letzteAktualisierung`). Pre-Warm-Endpoint und reguläre Reads nutzen denselben Cache-Key — d.h. nach Pre-Warm liefert `ladeKorrektur` Cache-Hit, nach LP-Edit ist Cache invalidiert und nächster Read ist cold (frisch).

**Write-Pfade-Abdeckung** (alle Funktionen, die das `Korrektur_<pruefungId>`-Sheet schreiben):
- `speichereKorrekturZeile` (Z. 6716) — einzelne LP-Bewertung; Step 3.4 invalidiert direkt.
- `batchKorrektur` (Z. 6424) — Bulk-Auto-Korrektur, ruft `setKorrekturStatus` mehrfach (Z. 6493 + 6512). Step 3.5 invalidiert in `setKorrekturStatus` → deckt indirekt ab.
- `setKorrekturStatus` (Z. 6553) — auch eigenständig genutzt; eigene Invalidierung in Step 3.5.
- `stelleKorrekturSheetHeaderBereit_` (Z. 11196) — schreibt nur Header, kein Daten-Impact, kein Invalidierungsbedarf.
- `korrekturFreigebenEndpoint` (Z. 7092) — schreibt NUR Configs-Spalten (`korrekturFreigegeben` / `korrekturPdfFreigegeben`), die NICHT im Korrektur-Cache-Body stehen → keine Invalidierung nötig.

**Cache-Grösse-Risiko:** CacheService-Limit ist 100 KB pro Key (Bytes, nicht UTF-16-Code-Units). Bei 30 SuS × 30 Fragen × ~500 B = ~450 KB → über Limit. Daher konservativer Byte-Threshold: `if (Utilities.newBlob(serialized).getBytes().length > 80000) skip put;` (echter Byte-Count, 20% Sicherheitsmarge gegen 100KB-Limit). In typischen Klassen (≤25 SuS, ≤25 Fragen) bleibt der Eintrag deutlich unter 80 KB.

- [ ] **Step 3.1: Failing-Test (vitest mocked Apps-Script-Backend) skippen**

Backend-Tests laufen nur als GAS-Test-Shims, nicht in vitest. Daher kein Frontend-Test-First für Backend-Cache. Stattdessen: Test-Shim erweitern in Task 4 (`testPreWarmKorrektur_` deckt Cache-Hit ab).

- [ ] **Step 3.2: Helper `ladeKorrekturBerechne_(pruefungId)` extrahieren**

In `apps-script-code.js` direkt VOR `ladeKorrektur` (Z. 6557) einfügen:

```js
/**
 * Bundle G.d.1 — Berechnet die Korrektur-Body-Struktur (ohne jsonResponse-Wrapping
 * und ohne letzteAktualisierung). Auth-Check ist Caller-Responsibility.
 *
 * Wird von ladeKorrektur und lernplattformPreWarmKorrektur genutzt.
 *
 * @returns {Object|null} Body oder null wenn Sheet nicht gefunden.
 */
function ladeKorrekturBerechne_(pruefungId) {
  var sheet = ANTWORTEN_MASTER_ID
    ? SpreadsheetApp.openById(ANTWORTEN_MASTER_ID).getSheetByName('Korrektur_' + pruefungId)
    : null;

  var configSheet = SpreadsheetApp.openById(CONFIGS_ID).getSheetByName('Configs');
  var configRow = getSheetData(configSheet).find(function(r) { return r.id === pruefungId; });

  if (!sheet) {
    return {
      pruefungId: pruefungId,
      pruefungTitel: configRow ? configRow.titel : pruefungId,
      datum: configRow ? configRow.datum : '',
      klasse: configRow ? configRow.klasse : '',
      schueler: [],
      batchStatus: 'idle',
    };
  }

  var data = getSheetData(sheet);
  var statusJson = safeJsonParse(sheet.getRange('Z1').getValue(), { status: 'idle' });
  var schuelerMap = {};
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    if (!row.email) continue;
    if (!schuelerMap[row.email]) {
      schuelerMap[row.email] = {
        email: row.email, name: row.name || row.email,
        bewertungen: {}, gesamtPunkte: 0, maxPunkte: 0, korrekturStatus: 'offen',
      };
    }
    var b = {
      frageId: row.frageId, fragenTyp: row.fragenTyp || '',
      maxPunkte: Number(row.maxPunkte) || 0,
      kiPunkte: row.kiPunkte !== '' ? Number(row.kiPunkte) : null,
      lpPunkte: row.lpPunkte !== '' ? Number(row.lpPunkte) : null,
      kiBegruendung: row.kiBegruendung || null,
      kiFeedback: row.kiFeedback || null,
      lpKommentar: row.lpKommentar || null,
      quelle: row.quelle || 'auto',
      geprueft: row.geprueft === 'true',
    };
    schuelerMap[row.email].bewertungen[row.frageId] = b;
    var eff = b.lpPunkte !== null ? b.lpPunkte : (b.kiPunkte !== null ? b.kiPunkte : 0);
    schuelerMap[row.email].gesamtPunkte += eff;
    schuelerMap[row.email].maxPunkte += b.maxPunkte;
  }

  var schuelerKeys = Object.keys(schuelerMap);
  for (var k = 0; k < schuelerKeys.length; k++) {
    var s = schuelerMap[schuelerKeys[k]];
    var bewertungen = Object.values(s.bewertungen);
    if (bewertungen.every(function(b) { return b.geprueft; })) {
      s.korrekturStatus = 'review-fertig';
    } else if (bewertungen.some(function(b) { return b.quelle === 'ki' || b.quelle === 'auto'; })) {
      s.korrekturStatus = 'ki-bewertet';
    }
  }

  return {
    pruefungId: pruefungId,
    pruefungTitel: configRow ? configRow.titel : pruefungId,
    datum: configRow ? configRow.datum : '',
    klasse: configRow ? configRow.klasse : '',
    schueler: Object.values(schuelerMap),
    batchStatus: statusJson.status || 'idle',
    batchFortschritt: statusJson.erledigt !== undefined
      ? { erledigt: statusJson.erledigt, gesamt: statusJson.gesamt } : undefined,
  };
}
```

- [ ] **Step 3.3: `ladeKorrektur` umbauen — Cache-Hit + Helper-Aufruf**

Bestehende Funktion (Z. 6557-6634) ersetzen durch:

```js
function ladeKorrektur(pruefungId, email) {
  try {
    if (!istZugelasseneLP(email)) {
      return jsonResponse({ error: 'Nur für Lehrpersonen' });
    }

    // Bundle G.d.1 — Cache-Hit-Pfad
    var cache = CacheService.getScriptCache();
    var cacheKey = 'korrektur_data_' + pruefungId;
    var cached = cache.get(cacheKey);
    if (cached) {
      try {
        var body = JSON.parse(cached);
        body.letzteAktualisierung = new Date().toISOString();
        return jsonResponse(body);
      } catch (e) {
        console.log('[ladeKorrektur] Cache-Parse-Fehler: ' + e.message);
        // Fall-through zu Sheet-Read
      }
    }

    var body = ladeKorrekturBerechne_(pruefungId);
    body.letzteAktualisierung = new Date().toISOString();

    // Cache befüllen (best-effort, nicht blockierend)
    try {
      var serialized = JSON.stringify(body);
      // Echter Byte-Count gegen CacheService-100KB-Limit, 80KB als Sicherheits-Threshold
      var bytes = Utilities.newBlob(serialized).getBytes().length;
      if (bytes <= 80000) {
        cache.put(cacheKey, serialized, 60);
      } else {
        Logger.log('[ladeKorrektur] body=%s Bytes > 80000, kein Cache-Put', bytes);
      }
    } catch (e) {
      console.log('[ladeKorrektur] Cache-Put-Fehler: ' + e.message);
    }

    return jsonResponse(body);
  } catch (error) {
    return jsonResponse({ error: error.message });
  }
}
```

- [ ] **Step 3.4: `speichereKorrekturZeile` invalidiert Cache**

In `speichereKorrekturZeile` (Z. 6716) am Anfang nach Auth-Check ODER kurz vor dem `return jsonResponse({ success: true })` (typisch Z. ~6890):

Suchen: `return jsonResponse({ success: true })` (oder ähnlicher Erfolgs-Return) ganz am Ende der Funktion.

Direkt davor einfügen:

```js
    // Bundle G.d.1 — Cache-Invalidierung
    try {
      CacheService.getScriptCache().remove('korrektur_data_' + pruefungId);
    } catch (e) { /* fail-silent */ }
```

- [ ] **Step 3.5: `setKorrekturStatus` invalidiert Cache (deckt `batchKorrektur` indirekt ab)**

`setKorrekturStatus` (Z. 6553) wird sowohl von `batchKorrektur` (alle 10 Fragen + final, Z. 6493 + Z. 6512) als auch potentiell von anderen Status-Updates aufgerufen. Da der Helper das `Korrektur_<pruefungId>`-Sheet als Argument bekommt, kann die `pruefungId` aus dem Sheet-Namen extrahiert werden. Damit deckt EINE Invalidierung in `setKorrekturStatus` automatisch ALLE Bulk-Auto-Korrektur-Pfade (`batchKorrektur` Z. 6499 `clear()` + Z. 6509 `setValues`) ab.

Bestehende Funktion (Z. 6553-6555):

```js
function setKorrekturStatus(sheet, status, erledigt, gesamt) {
  sheet.getRange('Z1').setValue(JSON.stringify({ status, erledigt, gesamt, timestamp: new Date().toISOString() }));
}
```

Ersetzen durch:

```js
function setKorrekturStatus(sheet, status, erledigt, gesamt) {
  sheet.getRange('Z1').setValue(JSON.stringify({ status, erledigt, gesamt, timestamp: new Date().toISOString() }));
  // Bundle G.d.1 — Cache-Invalidierung. pruefungId aus Sheet-Name 'Korrektur_<id>' extrahieren.
  try {
    var name = sheet.getName();
    if (name && name.indexOf('Korrektur_') === 0) {
      CacheService.getScriptCache().remove('korrektur_data_' + name.substring(10));
    }
  } catch (e) { /* fail-silent */ }
}
```

> **Effekt:** Während `batchKorrektur` läuft, wird der Cache alle 10 Fragen geleert + am Ende beim 'fertig'-Status. Nächstes `ladeKorrektur` ist cold (frische Sheet-Daten), nächstes Pre-Warm-Trigger befüllt neu. Stale-Body-Risiko damit eliminiert.

- [ ] **Step 3.6: Commit**

```bash
git add ExamLab/apps-script-code.js
git commit -m "G.d.1 Backend: ladeKorrektur Cache-Layer + Invalidierung in speichereKorrekturZeile/setKorrekturStatus"
```

---

### Task 4: Endpoint `lernplattformPreWarmKorrektur` + Dispatcher + Test-Shim

**Files:**
- Modify: `apps-script-code.js:1395-1400` — Dispatcher-Case
- Add: `apps-script-code.js` — Endpoint nach `lernplattformPreWarmFragen` (Z. ~8985)
- Add: `apps-script-code.js` — Test-Shim

- [ ] **Step 4.1: Dispatcher-Case einfügen**

In Z. ~1397-1399 nach dem `'lernplattformPreWarmFragen'`-Case:

```js
    case 'lernplattformPreWarmFragen':
      return lernplattformPreWarmFragen(body);
    case 'lernplattformPreWarmKorrektur':
      return lernplattformPreWarmKorrektur(body);
```

- [ ] **Step 4.2: Endpoint-Funktion einfügen**

Nach `lernplattformPreWarmFragen` (Z. ~8984) und VOR `preWarmKorrekturNachAbgabe_` (Z. ~8999):

```js
/**
 * Bundle G.d.1 Hebel C — Pre-Warm der Korrektur-Daten.
 *
 * LP-only. Cached die ladeKorrekturBerechne_-Response für 60s unter
 * Key 'korrektur_data_' + pruefungId. ladeKorrektur prüft denselben Key.
 *
 * CacheService-Soft-Lock (30s TTL) auf 'prewarm_korrektur_' + pruefungId
 * dedupliziert Re-Klicks (LP klickt Tab Auswertung 2× kurz hintereinander).
 *
 * Body: { email, sessionToken?, pruefungId }
 * Response: { success: true, latenzMs: X }
 *         | { success: true, deduped: true }
 *         | { error: 'Nicht autorisiert' | 'Pruefung nicht gefunden' | <fehler> }
 */
function lernplattformPreWarmKorrektur(body) {
  var startMs = Date.now();
  try {
    var email = (body.email || '').toLowerCase().trim();
    var pruefungId = body.pruefungId;

    if (!pruefungId) return jsonResponse({ error: 'Pruefung nicht gefunden' });
    if (!email || !istZugelasseneLP(email)) {
      return jsonResponse({ error: 'Nicht autorisiert' });
    }

    // Soft-Lock (30s) gegen Re-Klick-Doppel-Read
    var cache = CacheService.getScriptCache();
    var lockKey = 'prewarm_korrektur_' + pruefungId;
    if (cache.get(lockKey)) {
      return jsonResponse({ success: true, deduped: true });
    }
    cache.put(lockKey, '1', 30);

    var data = ladeKorrekturBerechne_(pruefungId);
    if (!data) {
      return jsonResponse({ error: 'Pruefung nicht gefunden' });
    }
    data.letzteAktualisierung = new Date().toISOString();

    // Cache-Eintrag setzen — ladeKorrektur findet ihn
    try {
      var serialized = JSON.stringify(data);
      var bytes = Utilities.newBlob(serialized).getBytes().length;
      if (bytes <= 80000) {
        cache.put('korrektur_data_' + pruefungId, serialized, 60);
      } else {
        Logger.log('[PreWarmKorrektur] body=%s Bytes > 80000, kein Cache-Put', bytes);
      }
    } catch (e) {
      console.log('[PreWarmKorrektur] Cache-Put-Fehler: ' + e.message);
    }

    var latenzMs = Date.now() - startMs;
    Logger.log('[PreWarmKorrektur] pruefungId=%s ms=%s', pruefungId, latenzMs);
    return jsonResponse({ success: true, latenzMs: latenzMs });
  } catch (e) {
    console.log('[PreWarmKorrektur-Fehler] ' + e.message);
    return jsonResponse({ error: e.message });
  }
}
```

- [ ] **Step 4.3: Test-Shim einfügen**

Nach `testPreWarmFragenBeimFreischalten` (aus Task 1.3):

```js
/**
 * Test-Shim für lernplattformPreWarmKorrektur (Bundle G.d.1 Hebel C).
 */
function testPreWarmKorrektur_() {
  var configSheet = SpreadsheetApp.openById(CONFIGS_ID).getSheetByName('Configs');
  var rows = getSheetData(configSheet);
  if (rows.length === 0) throw new Error('Keine Pruefung in Configs');
  var testConfig = rows[0];
  var testLP = 'wr.test@gymhofwil.ch'; // muss in istZugelasseneLP sein
  Logger.log('Test-Pruefung: id=%s', testConfig.id);

  var cache = CacheService.getScriptCache();
  cache.remove('prewarm_korrektur_' + testConfig.id);
  cache.remove('korrektur_data_' + testConfig.id);

  // Case (a) Cold-Call
  var t1 = Date.now();
  var r1 = JSON.parse(lernplattformPreWarmKorrektur({
    email: testLP, pruefungId: testConfig.id
  }).getContent());
  Logger.log('Case (a) Cold: success=%s ms=%s', r1.success, Date.now() - t1);
  assert_(r1.success === true, 'Cold-Call kein success');
  assert_(typeof r1.latenzMs === 'number', 'Cold-Call latenzMs fehlt');
  assert_(cache.get('korrektur_data_' + testConfig.id), 'Cache nach Cold-Call leer');

  // Case (b) Deduped
  var r2 = JSON.parse(lernplattformPreWarmKorrektur({
    email: testLP, pruefungId: testConfig.id
  }).getContent());
  Logger.log('Case (b) Deduped: success=%s deduped=%s', r2.success, r2.deduped);
  assert_(r2.deduped === true, 'Zweiter Call nicht deduped');

  // Case (c) Auth-Fail
  var r3 = JSON.parse(lernplattformPreWarmKorrektur({
    email: 'fremder@example.com', pruefungId: testConfig.id
  }).getContent());
  Logger.log('Case (c) Auth-Fail: error=%s', r3.error);
  assert_(r3.error === 'Nicht autorisiert', 'Fremder LP nicht abgelehnt');

  // Case (d) Pruefung nicht gefunden
  var r4 = JSON.parse(lernplattformPreWarmKorrektur({
    email: testLP, pruefungId: 'inexistente-id-xyz'
  }).getContent());
  // ladeKorrekturBerechne_ liefert immer Body (auch wenn Sheet nicht gefunden) — kein Crash erwartet
  Logger.log('Case (d) Unbekannte ID: success=%s deduped=%s error=%s',
             r4.success, r4.deduped, r4.error);

  Logger.log('=== testPreWarmKorrektur_ alle Cases gruen ===');
}
function testPreWarmKorrektur() { testPreWarmKorrektur_(); }
```

- [ ] **Step 4.4: Commit**

```bash
git add ExamLab/apps-script-code.js
git commit -m "G.d.1 Backend: Endpoint lernplattformPreWarmKorrektur + Test-Shim"
```

---

### Task 5: Apps-Script-Deploy durch User

**Files:** keine (User-Aktion)

- [ ] **Step 5.1: User-Briefing**

User-Tasks vor Deploy:
1. `git push` damit der Branch sichtbar ist
2. Im Apps-Script-Editor: Code aus `apps-script-code.js` HEAD synchronisieren
3. **GAS-Editor-Tests:** `testPreWarmFragenBeimFreischalten` ausführen, dann `testPreWarmKorrektur` — beide Logger-Outputs „alle Cases gruen"
4. Bereitstellen → Bereitstellung verwalten → Neue Bereitstellung
5. URL bleibt gleich, Frontend-`.env` unverändert

- [ ] **Step 5.2: Verifikation User-Bestätigung**

Nach User-OK: Frontend-Tasks (Task 6+) freigeben.

---

## Phase 2 — Frontend Polling-Tunings

### Task 6: Hebel A — Polling Lobby auf 5s

**Files:**
- Modify: `ExamLab/src/components/lp/durchfuehrung/DurchfuehrenDashboard.tsx:231`
- Test: `ExamLab/src/components/lp/durchfuehrung/__tests__/DurchfuehrenDashboard.test.tsx`

- [ ] **Step 6.1: Failing-Test schreiben**

Datei `src/components/lp/durchfuehrung/__tests__/DurchfuehrenDashboard.test.tsx` prüfen, falls nicht vorhanden, neu anlegen:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
// Test-Helper-Imports nach Code-Konvention im Repo (typisch render von @testing-library/react)
// Falls noch keine Test-Datei für diese Komponente existiert: minimaler Smoke-Test reicht.
//
// Strategie: kein Full-Render-Test (zu schwer wegen vielen Children), stattdessen
// Logik-Extrakt: prüfen, dass die Polling-Logik beide Phasen 'aktiv' UND 'lobby' deckt.

describe('DurchfuehrenDashboard — Polling-Logik', () => {
  it('Hebel A: Lobby-Phase soll 5s-Polling ausloesen (nicht 15s)', () => {
    // Quelle der Wahrheit ist die Komponente selbst — Smoke-Read
    const code = require('fs').readFileSync(
      require.resolve('../DurchfuehrenDashboard.tsx'),
      'utf8'
    ) as string
    // Erwartung: 'lobby' steht im Polling-Bedingung-Branch
    const match = code.match(/intervallMs\s*=\s*\(?phase\s*===\s*'aktiv'(.|\n)*?\)?\s*\?\s*5000\s*:\s*15000/)
    expect(match, 'Polling-Konstante fuer Lobby fehlt').toBeTruthy()
    expect(match![0]).toContain("phase === 'lobby'")
  })
})
```

> **Hinweis:** Dieser Test ist ein „Existenz-Check via Source-Read" — pragmatisch wegen der Komponenten-Komplexität. Wenn der Repo-Test-Stil React-Testing-Library Render-Tests bevorzugt: passt euch an. Wichtig ist, dass der Test FAILT vor der Änderung.

- [ ] **Step 6.2: Test laufen lassen — Erwartung FAIL**

```bash
cd ExamLab
npx vitest run src/components/lp/durchfuehrung/__tests__/DurchfuehrenDashboard.test.tsx
```

Erwartet: FAIL mit „Polling-Konstante fuer Lobby fehlt".

- [ ] **Step 6.3: Code-Änderung**

In `DurchfuehrenDashboard.tsx:231`:

```ts
// Vorher:
const intervallMs = phase === 'aktiv' ? 5000 : 15000
// Nachher:
const intervallMs = (phase === 'aktiv' || phase === 'lobby') ? 5000 : 15000
```

- [ ] **Step 6.4: Test laufen lassen — Erwartung PASS**

```bash
npx vitest run src/components/lp/durchfuehrung/__tests__/DurchfuehrenDashboard.test.tsx
```

- [ ] **Step 6.5: Full-Test-Suite + tsc**

```bash
npx vitest run
npx tsc -b
```

- [ ] **Step 6.6: Commit**

```bash
git add ExamLab/src/components/lp/durchfuehrung/DurchfuehrenDashboard.tsx \
        ExamLab/src/components/lp/durchfuehrung/__tests__/DurchfuehrenDashboard.test.tsx
git commit -m "G.d.1 Frontend Hebel A: LP-Polling Lobby 15s -> 5s"
```

---

### Task 7: Hebel D — Polling Warteraum auf 3s

**Files:**
- Modify: `ExamLab/src/components/Startbildschirm.tsx:86`
- Test: `ExamLab/src/components/__tests__/Startbildschirm.test.tsx`

- [ ] **Step 7.1: Failing-Test schreiben**

Analog Task 6 — Source-Read-Pattern:

```tsx
import { describe, it, expect } from 'vitest'

describe('Startbildschirm — Warteraum-Polling', () => {
  it('Hebel D: Warteraum-Polling auf 3000ms', () => {
    const code = require('fs').readFileSync(
      require.resolve('../Startbildschirm.tsx'),
      'utf8'
    ) as string
    // Erwartung: kein 5000ms-setInterval mehr im Heartbeat-Polling
    expect(code).toMatch(/}\s*,\s*3000\s*\)/) // }, 3000)
    // Stale-5000ms-Polling soll weg sein
    expect(code).not.toMatch(/}\s*,\s*5000\s*\)\s*\n\s*return\s*\(\s*\)\s*=>\s*clearInterval/)
  })
})
```

- [ ] **Step 7.2: Test FAIL**

```bash
npx vitest run src/components/__tests__/Startbildschirm.test.tsx
```

- [ ] **Step 7.3: Code-Änderung**

In `Startbildschirm.tsx:86`:

```ts
// Vorher: }, 5000)
// Nachher: }, 3000)
```

- [ ] **Step 7.4: Test PASS + tsc**

```bash
npx vitest run src/components/__tests__/Startbildschirm.test.tsx
npx vitest run
npx tsc -b
```

- [ ] **Step 7.5: Commit**

```bash
git add ExamLab/src/components/Startbildschirm.tsx \
        ExamLab/src/components/__tests__/Startbildschirm.test.tsx
git commit -m "G.d.1 Frontend Hebel D: SuS-Warteraum-Polling 5s -> 3s"
```

---

## Phase 3 — Frontend Hebel C (Pre-Warm-Trigger)

### Task 8: `preWarmKorrektur`-Wrapper in preWarmApi.ts

**Files:**
- Modify: `ExamLab/src/services/preWarmApi.ts`
- Test: `ExamLab/src/services/__tests__/preWarmApi.test.ts`

- [ ] **Step 8.1: Failing-Test schreiben (TDD)**

In `src/services/__tests__/preWarmApi.test.ts` (oder anlegen falls nicht existent — analog G.a-Pattern):

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock von uebenApiClient
vi.mock('../ueben/apiClient', () => ({
  uebenApiClient: {
    istKonfiguriert: vi.fn(() => true),
    post: vi.fn(),
  },
}))
vi.mock('../../store/ueben/authStore', () => ({
  useUebenAuthStore: {
    getState: () => ({
      user: { email: 'lp@gymhofwil.ch', sessionToken: 'token123' },
    }),
  },
}))

import { preWarmKorrektur } from '../preWarmApi'
import { uebenApiClient } from '../ueben/apiClient'

describe('preWarmKorrektur', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('ruft Backend-Endpoint mit pruefungId und email auf', async () => {
    ;(uebenApiClient.post as any).mockResolvedValueOnce({ success: true, latenzMs: 800 })
    await preWarmKorrektur('p123', 'lp@gymhofwil.ch')
    expect(uebenApiClient.post).toHaveBeenCalledWith(
      'lernplattformPreWarmKorrektur',
      expect.objectContaining({ pruefungId: 'p123', email: 'lp@gymhofwil.ch' }),
      'token123',
    )
  })

  it('resolvt mit void bei Backend-Error', async () => {
    ;(uebenApiClient.post as any).mockResolvedValueOnce({ error: 'Nicht autorisiert' })
    await expect(preWarmKorrektur('p123', 'lp@gymhofwil.ch')).resolves.toBeUndefined()
  })

  it('resolvt mit void bei deduped-Response', async () => {
    ;(uebenApiClient.post as any).mockResolvedValueOnce({ success: true, deduped: true })
    await expect(preWarmKorrektur('p123', 'lp@gymhofwil.ch')).resolves.toBeUndefined()
  })

  it('skippt API-Call bei signal.aborted', async () => {
    const ctrl = new AbortController()
    ctrl.abort()
    await preWarmKorrektur('p123', 'lp@gymhofwil.ch', ctrl.signal)
    expect(uebenApiClient.post).not.toHaveBeenCalled()
  })

  it('skippt API-Call bei leerer pruefungId', async () => {
    await preWarmKorrektur('', 'lp@gymhofwil.ch')
    expect(uebenApiClient.post).not.toHaveBeenCalled()
  })

  it('skippt API-Call bei leerer email', async () => {
    await preWarmKorrektur('p123', '')
    expect(uebenApiClient.post).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 8.2: Test FAIL** (`preWarmKorrektur` existiert noch nicht)

```bash
npx vitest run src/services/__tests__/preWarmApi.test.ts
```

- [ ] **Step 8.3: Wrapper implementieren**

In `src/services/preWarmApi.ts` ans Ende anhängen:

```ts
/**
 * Bundle G.d.1 Hebel C — Pre-Warm der Korrektur-Daten.
 *
 * Fire-and-forget: returnt Promise<void>, wirft NIE — Fehler werden silent geswallowed.
 * Wenn `signal.aborted` bei Eintritt: kein API-Call.
 * Wenn `pruefungId` leer: kein API-Call.
 * Wenn `email` leer: kein API-Call.
 * Wenn `PRE_WARM_ENABLED` false: kein API-Call.
 *
 * Backend-Endpoint: `lernplattformPreWarmKorrektur`.
 */
export async function preWarmKorrektur(
  pruefungId: string,
  email: string,
  signal?: AbortSignal,
): Promise<void> {
  if (!PRE_WARM_ENABLED) return
  if (signal?.aborted) return
  if (!pruefungId) return
  if (!email) return

  try {
    const user = useUebenAuthStore.getState().user
    const sessionToken = user?.sessionToken ?? ''
    const response = await uebenApiClient.post<PreWarmResponse>(
      'lernplattformPreWarmKorrektur',
      { email, pruefungId },
      sessionToken,
    )
    if (response?.error) {
      console.warn('[preWarmKorrektur] Backend-Error:', response.error)
    }
  } catch (e) {
    console.warn('[preWarmKorrektur] Fehler (silent):', e)
  }
}
```

- [ ] **Step 8.4: Test PASS + tsc**

```bash
npx vitest run src/services/__tests__/preWarmApi.test.ts
npx tsc -b
```

- [ ] **Step 8.5: Commit**

```bash
git add ExamLab/src/services/preWarmApi.ts \
        ExamLab/src/services/__tests__/preWarmApi.test.ts
git commit -m "G.d.1 Frontend Hebel C: preWarmKorrektur-Wrapper + Tests"
```

---

### Task 9: Pre-Warm-Trigger in DurchfuehrenDashboard

**Files:**
- Modify: `ExamLab/src/components/lp/durchfuehrung/DurchfuehrenDashboard.tsx:264-266` — Direct-Mount
- Modify: `ExamLab/src/components/lp/durchfuehrung/DurchfuehrenDashboard.tsx:299-306` — Phase-Wechsel
- Modify: `ExamLab/src/components/lp/durchfuehrung/DurchfuehrenDashboard.tsx:318-324` — wechsleTab
- Test: `ExamLab/src/components/lp/durchfuehrung/__tests__/DurchfuehrenDashboard.test.tsx` — erweitern

- [ ] **Step 9.1: Failing-Tests erweitern**

In der Test-Datei aus Task 6 ergänzen (3 neue Cases — Source-Read-Pattern):

```ts
describe('DurchfuehrenDashboard — Pre-Warm-Trigger Hebel C', () => {
  const code = require('fs').readFileSync(
    require.resolve('../DurchfuehrenDashboard.tsx'),
    'utf8'
  ) as string

  it('importiert preWarmKorrektur', () => {
    expect(code).toMatch(/import\s*\{[^}]*preWarmKorrektur[^}]*\}\s*from\s*['"][^'"]*preWarmApi['"]/)
  })

  it('Trigger 1 — Tab-Wechsel via wechsleTab', () => {
    // Marker-Kommentar wird in Step 9.6 gesetzt: '// G.d.1 Trigger Tab-Wechsel'
    expect(code).toMatch(/G\.d\.1 Trigger Tab-Wechsel/)
    // In derselben oder direkt darauffolgender Zeile muss preWarmKorrektur stehen
    const idx = code.indexOf('G.d.1 Trigger Tab-Wechsel')
    expect(code.substring(idx, idx + 500)).toMatch(/preWarmKorrektur/)
  })

  it('Trigger 2 — Phase-Wechsel zu beendet im Phase-useEffect', () => {
    // Marker-Kommentar in Step 9.5: '// G.d.1 Trigger Phase-beendet'
    expect(code).toMatch(/G\.d\.1 Trigger Phase-beendet/)
    const idx = code.indexOf('G.d.1 Trigger Phase-beendet')
    const block = code.substring(idx, idx + 500)
    expect(block).toMatch(/preWarmKorrektur/)
    expect(block).toMatch(/beendet/)
  })

  it('Trigger 3 — Direct-Mount-Edge-Case bei beendet-URL', () => {
    // Marker-Kommentar in Step 9.4: '// G.d.1 Trigger Direct-Mount'
    expect(code).toMatch(/G\.d\.1 Trigger Direct-Mount/)
    const idx = code.indexOf('G.d.1 Trigger Direct-Mount')
    expect(code.substring(idx, idx + 500)).toMatch(/preWarmKorrektur/)
  })
})
```

- [ ] **Step 9.2: Tests FAIL**

```bash
npx vitest run src/components/lp/durchfuehrung/__tests__/DurchfuehrenDashboard.test.tsx
```

- [ ] **Step 9.3: Import in `DurchfuehrenDashboard.tsx` ergänzen**

Bei den anderen `services/`-Imports (typisch oben in der Datei):

```ts
import { preWarmKorrektur } from '../../../services/preWarmApi'
```

> **Pfad verifizieren** — `Find` nach existing imports von `preWarmApi` in der Datei: falls schon ein anderer Import von `preWarmApi.ts` da ist, einfach erweitern. Sonst neu hinzufügen.

- [ ] **Step 9.4: Direct-Mount-Trigger** (Z. 264-266)

```ts
// Vorher:
        if (pruefungResult.config.beendetUm && pruefungResult.config.freigeschaltet && !urlTab) {
          setActiveTab('auswertung')
        }
// Nachher:
        if (pruefungResult.config.beendetUm && pruefungResult.config.freigeschaltet && !urlTab) {
          setActiveTab('auswertung')
          // G.d.1 Trigger Direct-Mount
          if (user?.email && pruefungId) {
            void preWarmKorrektur(pruefungId, user.email)
          }
        }
```

- [ ] **Step 9.5: Phase-Wechsel-Trigger** (Z. 299-306)

```ts
// Vorher:
  useEffect(() => {
    const neuerTab = phaseZuTab(phase)
    if (tabIndex(neuerTab) > tabIndex(phaseZuTab(letztePhaseRef.current))) {
      setActiveTab(neuerTab)
    }
    letztePhaseRef.current = phase
  }, [phase])
// Nachher:
  useEffect(() => {
    const neuerTab = phaseZuTab(phase)
    if (tabIndex(neuerTab) > tabIndex(phaseZuTab(letztePhaseRef.current))) {
      setActiveTab(neuerTab)
      // G.d.1 Trigger Phase-beendet — Pre-Warm Korrektur bei Auto-Wechsel
      if (phase === 'beendet' && user?.email && pruefungId) {
        void preWarmKorrektur(pruefungId, user.email)
      }
    }
    letztePhaseRef.current = phase
  }, [phase, user, pruefungId])
```

> **useEffect-Deps-Erweiterung** (`user`, `pruefungId`) — verifizieren dass kein Lint-Warning bleibt. Wenn React-ESLint `react-hooks/exhaustive-deps` aktiv ist, sollte das jetzt nicht mehr warnen.

- [ ] **Step 9.6: Tab-Klick-Trigger in `wechsleTab`** (Z. 318-324)

```ts
// Vorher:
  function wechsleTab(tab: DurchfuehrenTab) {
    if (!istTabVerfuegbar(tab, phase)) return
    setActiveTab(tab)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    window.history.replaceState({}, '', url.toString())
  }
// Nachher:
  function wechsleTab(tab: DurchfuehrenTab) {
    if (!istTabVerfuegbar(tab, phase)) return
    setActiveTab(tab)
    // G.d.1 Trigger Tab-Wechsel — Pre-Warm Korrektur wenn auswertung
    if (tab === 'auswertung' && user?.email && pruefungId) {
      void preWarmKorrektur(pruefungId, user.email)
    }
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    window.history.replaceState({}, '', url.toString())
  }
```

- [ ] **Step 9.7: Tests PASS + tsc + Build**

```bash
npx vitest run src/components/lp/durchfuehrung/__tests__/DurchfuehrenDashboard.test.tsx
npx vitest run
npx tsc -b
npm run build
```

Erwartet: alle Tests grün (731 baseline + ~10 neue), tsc clean, Build erfolgreich.

- [ ] **Step 9.8: Commit**

```bash
git add ExamLab/src/components/lp/durchfuehrung/DurchfuehrenDashboard.tsx \
        ExamLab/src/components/lp/durchfuehrung/__tests__/DurchfuehrenDashboard.test.tsx
git commit -m "G.d.1 Frontend Hebel C: preWarmKorrektur-Trigger in 3 Stellen (wechsleTab, Phase-Wechsel, Direct-Mount)"
```

---

## Phase 4 — Browser-E2E + Merge

### Task 10: Browser-E2E auf preview mit echten Logins

**Files:** keine (manueller Test). Folgt @.claude/rules/regression-prevention.md Phase 3.

- [ ] **Step 10.1: Push auf preview**

```bash
git push -u origin feature/bundle-g-d-1-phasen-uebergang
git checkout preview
git reset --hard feature/bundle-g-d-1-phasen-uebergang
git push -f origin preview
git checkout feature/bundle-g-d-1-phasen-uebergang
```

> **WARNUNG (Memory: feedback_preview_forcepush.md):** Vorher `git log preview ^feature/bundle-g-d-1-phasen-uebergang` prüfen — keine fremden Commits auf preview verlieren!

- [ ] **Step 10.2: GitHub Actions abwarten**

Build-Workflow muss grün durchlaufen. Bei Hänger: leerer Commit zum Re-Trigger (siehe deployment-workflow.md S118).

- [ ] **Step 10.3: Test-Plan schreiben (Phase 3.0)**

Im Chat dokumentieren — Testliste aus dem Spec übernehmen (8 Punkte):

```
## Test-Plan: G.d.1 Phasen-Übergang-Latenzen

| # | Pfad | Erwartung |
|---|---|---|
| 1 | LP+SuS in Tab-Gruppe, beide auf preview eingeloggt; LP zu Pruefung „Durchfuehren" | LP Lobby-Tab |
| 2 | SuS oeffnet Pruefung-Lobby-URL | LP sieht SuS gruen <= 7s (Stoppuhr) |
| 3 | LP klickt „Freischalten" | Network-Tab: schalteFrei <= 500ms |
| 4 | SuS klickt „Pruefung starten" | Erste Frage rendert <= 2s |
| 5a | LP klickt Tab Auswertung manuell (Trigger 1 wechsleTab) | Network: lernplattformPreWarmKorrektur Call sichtbar |
| 5b | SuS gibt letzte Antwort ab → LP-Phase auto-wechselt zu beendet (Trigger 2) | Network: lernplattformPreWarmKorrektur Call beim Auto-Wechsel |
| 5c | LP öffnet beendete-Pruefung-URL direkt im neuen Tab (Trigger 3 Direct-Mount) | Network: lernplattformPreWarmKorrektur Call beim Mount |
| 5d | LP-Korrektur-Daten sichtbar | <= 1.5s nach Tab-Wechsel |
| 6 | LP klickt Auswertung-Tab 2× kurz hintereinander | Network: zweiter Call deduped:true |
| 7 | G.a Trigger A unveraendert (LP „Speichern") | Network: lernplattformPreWarmFragen Call wie vorher |
| 8 | SuS-Logout-Cleanup (G.c) bleibt funktional | DevTools → IDB nach Logout leer |
```

Plus Security-Check (Phase 4):
- [ ] SuS-Response enthält keine Korrektur-Daten (Pre-Warm cached LP-only)
- [ ] Cache-Key `korrektur_data_*` enthält keine SuS-zugängliche Endpoint-Pfade

- [ ] **Step 10.4: Test-Gruppe öffnen + User informieren**

```
„Tab-Gruppe ist erstellt. Bitte einloggen:
 Tab 1: wr.test@gymhofwil.ch (LP)
 Tab 2: wr.test@stud.gymhofwil.ch (SuS)
 → kannst loslegen' wenn bereit."
```

- [ ] **Step 10.5: Tests durchführen + Latenzen messen**

Pro Test-Punkt: Ergebnis dokumentieren, Network-Tab-Screenshots wo relevant. Speziell Punkt 2/4/5 mit Stoppuhr.

- [ ] **Step 10.6: Bei Befund — Bug-Fix-Loop**

Falls Bug: Fix auf `feature/bundle-g-d-1-phasen-uebergang`, push → preview → re-test. Nicht mit broken-State auf main mergen.

- [ ] **Step 10.7: User-Freigabe einholen**

Erst nach explizitem „Merge OK" → Task 11.

---

### Task 11: HANDOFF.md + Memory-Update + Merge auf main

**Files:**
- Modify: `ExamLab/HANDOFF.md`
- Modify: `~/.claude/projects/.../memory/MEMORY.md` + neues `project_s152_bundle_g_d_1.md`
- Branch: `feature/bundle-g-d-1-phasen-uebergang` → `main`

- [ ] **Step 11.1: HANDOFF.md aktualisieren**

Neuer Eintrag „Stand S152 — Bundle G.d.1 auf main" mit:
- Hebel A/B/C/D Latenz-Ergebnisse aus E2E
- Apps-Script-Deploy-Datum
- Branch + Merge-Commit (folgt in 11.4)
- Tests-Stand (vitest neu vs. alt)

- [ ] **Step 11.2: Memory-File anlegen**

Neuer File `project_s152_bundle_g_d_1.md` mit:
- Latenz-Wins
- Cache-Architektur-Entscheidung (60s TTL + Invalidierung)
- Lehren falls welche aufgetaucht sind
- HOW TO APPLY: bei Bundle G.d.2 Plan dieselbe „Backend bündeln + Apps-Script-Deploy"-Reihenfolge

`MEMORY.md`-Index-Eintrag (1 Zeile).

- [ ] **Step 11.3: Merge-Gate-Checkliste**

(Aus regression-prevention.md Phase 5)
- [ ] Browser-E2E grün dokumentiert
- [ ] Security-Verifikation grün
- [ ] LP-Freigabe „Merge OK"
- [ ] HANDOFF.md aktualisiert

- [ ] **Step 11.4: Merge ausführen**

```bash
cd ExamLab
git checkout main
git pull
git merge --no-ff feature/bundle-g-d-1-phasen-uebergang -m "Merge Bundle G.d.1 — Phasen-Übergang-Latenzen"
git push
```

- [ ] **Step 11.5: Branch aufräumen**

```bash
git branch -d feature/bundle-g-d-1-phasen-uebergang
git push origin --delete feature/bundle-g-d-1-phasen-uebergang
```

- [ ] **Step 11.6: Memory-Files committen + push**

(Memory liegt im User-Home, nicht im Repo — gesondert tracken oder direkt schreiben.)

- [ ] **Step 11.7: Schedule-Offer**

Anschluss-Bundle: G.d.2 (IDB-Cache Klassenlisten/Gruppen) — Spec auf main, ready for Plan-Phase. Nicht automatisch schedulen, User entscheidet wann.

---

## Test-Stand-Erwartung

| Stelle | Vorher | Nachher |
|---|---|---|
| vitest grün | 731 (S150) | ~741 (+10) |
| GAS-Test-Shims | 1 (`testPreWarmKorrekturNachAbgabe`) | 3 (+2) |
| `tsc -b` | clean | clean |
| `npm run build` | erfolgreich | erfolgreich |

## Akzeptanz-Kriterien (aus Spec übernommen)

| Kriterium | Wert |
|---|---|
| Sync 1 (LP sieht SuS-grün in Lobby) | ≤7s (vorher bis 20s) |
| Sync 2 (SuS-erste-Frage nach Freischalt-Klick) | ≤2s (vorher ~5s) |
| Sync 4 (Auswertung-Tab Korrektur) | ≤1.5s (vorher 2-4s) |
| `schalteFrei`-Response-Latenz | ≤+200ms gegenüber heute |
| Bundle G.a Latenzen unverändert | Cold ≤1'200ms intern, Warm ≤250ms intern |
| Bundle G.c Logout-Cleanup unverändert | IDB nach Logout leer |
| Browser-E2E | 8/8 Punkte grün |

## Was NICHT in G.d.1 (zur Klarheit)

- IDB-Cache Klassenlisten/Gruppen → G.d.2
- LP-Login-Pre-Fetch anderer Daten → G.d.2
- Sync 3 (LP sieht SuS-Abgabe) → schon ≤5s, kein Hebel
- Push-Mechanismen (SSE/WebSocket) → Apps-Script unterstützt nichts davon
- Rate-adaptive Polling → unnötige Komplexität
