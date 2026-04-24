# Setup — Probleme-Dashboard Feedback-Apps-Script

Dieses Dokument enthält den Code, der in das **separate** Feedback-Apps-Script eingefügt werden muss. Der Script liegt **nicht im Repo**.

**Script-URL:** `https://script.google.com/macros/s/AKfycbwSxIOqGhAbnNM2-Y4ulgBY3usVEC6cKT4S5sEk4sf2CMognF5qxopj3FJtnTpm3nq7TQ/exec`
**Sheet:** „ExamLab Problemmeldungen", Tab „ExamLab-Problemmeldungen"

## User-Tasks in Reihenfolge

1. GAS-Editor des separaten Feedback-Apps-Scripts öffnen.
2. Function `migriereProblemmeldungenSchema` unten einfügen → speichern → **Run** (einmalig).
3. Log prüfen: Erwartet `✓ Schema-Migration abgeschlossen`.
4. Bestehenden `doGet` durch die neue Version unten ersetzen → speichern.
5. `Deploy → Manage deployments → Edit → New version → Deploy`. URL bleibt gleich.
6. Test: im ExamLab-Frontend eine Test-Meldung absenden, Sheet-Zeile inspizieren (UUID in `id`, leer in `erledigt`).
7. User meldet „Feedback-Apps-Script migriert + deployed".

## 1. `migriereProblemmeldungenSchema()` — Auto-Migration

Fügt fehlende Spalten `id` + `erledigt` ein und füllt leere UUIDs nach. **Idempotent** — kann gefahrlos mehrfach laufen.

```js
/**
 * Einmalig (oder wiederholt als Sanity-Check) laufen lassen.
 * GAS-Editor → Function-Dropdown → migriereProblemmeldungenSchema → Run.
 *
 * 1. Fügt Spalte 'id' nach 'zeitstempel' ein (falls fehlt).
 * 2. Fügt Spalte 'erledigt' nach 'id' ein (falls fehlt).
 * 3. Füllt alle leeren id-Zellen mit frischer UUID.
 */
function migriereProblemmeldungenSchema() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('ExamLab-Problemmeldungen');
  if (!sheet) throw new Error('Tab "ExamLab-Problemmeldungen" nicht gefunden');
  var lastCol = sheet.getLastColumn();
  var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

  var zsCol = headers.indexOf('zeitstempel');
  if (zsCol < 0) throw new Error('Spalte "zeitstempel" fehlt — Sheet hat unerwartetes Schema');

  // 1) id-Spalte
  if (headers.indexOf('id') < 0) {
    sheet.insertColumnAfter(zsCol + 1);
    sheet.getRange(1, zsCol + 2).setValue('id');
    Logger.log('✓ Spalte "id" eingefügt');
  }

  // Header neu lesen (Spalten-Verschiebung)
  lastCol = sheet.getLastColumn();
  headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  // 2) erledigt-Spalte nach id
  var idCol = headers.indexOf('id');
  if (headers.indexOf('erledigt') < 0) {
    sheet.insertColumnAfter(idCol + 1);
    sheet.getRange(1, idCol + 2).setValue('erledigt');
    Logger.log('✓ Spalte "erledigt" eingefügt');
  }

  // 3) UUID-Backfill
  lastCol = sheet.getLastColumn();
  headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  idCol = headers.indexOf('id');
  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    var range = sheet.getRange(2, idCol + 1, lastRow - 1, 1);
    var values = range.getValues();
    var count = 0;
    for (var i = 0; i < values.length; i++) {
      if (!values[i][0]) {
        values[i][0] = Utilities.getUuid();
        count++;
      }
    }
    if (count > 0) range.setValues(values);
    Logger.log('✓ Backfill: ' + count + ' UUIDs nachgetragen (' + (values.length - count) + ' bereits gesetzt)');
  }

  Logger.log('✓ Schema-Migration abgeschlossen');
}
```

## 2. `doGet(e)` — gepatchter Write-Handler

Nach der Migration: bestehenden `doGet` durch diese Version ersetzen.

```js
function doGet(e) {
  var sheet = SpreadsheetApp.getActive().getSheetByName('ExamLab-Problemmeldungen');
  // Schema nach Migration:
  // zeitstempel | id | erledigt | rolle | ort | typ | category | comment
  //   | pruefungId | frageId | frageText | zusatzinfo | frageTyp | modus
  //   | bildschirm | appVersion | gruppeId
  sheet.appendRow([
    new Date(),
    Utilities.getUuid(),   // NEU: eindeutige ID
    '',                    // NEU: erledigt leer
    e.parameter.rolle || '',
    e.parameter.ort || '',
    e.parameter.typ || '',
    e.parameter.category || '',
    e.parameter.comment || '',
    e.parameter.pruefungId || '',
    e.parameter.frageId || '',
    e.parameter.frageText || '',
    e.parameter.zusatzinfo || '',
    e.parameter.frageTyp || '',
    e.parameter.modus || '',
    e.parameter.bildschirm || '',
    e.parameter.appVersion || '',
    e.parameter.gruppeId || '',
  ]);
  return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
}
```

## Rollback

Falls nach Deploy Probleme auftreten:

1. GAS-Editor → `Deploy → Manage deployments → Edit`.
2. Alte Version aus Dropdown wählen → `Deploy`.
3. Alte URL ist wieder aktiv (Schema im Sheet bleibt, neue Spalten stören nicht — alter `doGet` ignoriert sie).
