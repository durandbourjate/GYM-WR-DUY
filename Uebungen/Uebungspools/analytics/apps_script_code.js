/**
 * Google Apps Script — Übungspool Analytics (anonym)
 *
 * DEPLOYMENT:
 * 1. Neues Google Apps Script erstellen (script.google.com)
 * 2. Diesen Code einfügen
 * 3. setupSheet() einmal manuell ausführen (erstellt das Sheet)
 * 4. Deploy → Web App → "Jeder, auch anonym" → URL kopieren
 * 5. URL in pool.html TRACKING_CONFIG.endpoint eintragen
 */

// ── KONFIGURATION ──
const SHEET_NAME_EVENTS = 'Events';
const SHEET_NAME_SESSIONS = 'Sessions';

/**
 * Einmalig ausführen: Erstellt das Google Sheet mit den richtigen Spalten.
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Events-Blatt
  let evSheet = ss.getSheetByName(SHEET_NAME_EVENTS);
  if (!evSheet) {
    evSheet = ss.insertSheet(SHEET_NAME_EVENTS);
  }
  evSheet.getRange(1, 1, 1, 12).setValues([[
    'timestamp', 'event', 'session_id', 'pool',
    'frage_id', 'topic', 'type', 'diff', 'correct',
    'skipped', 'antwort', 'zeit_ms'
  ]]);
  evSheet.setFrozenRows(1);
  evSheet.getRange(1, 1, 1, 12).setFontWeight('bold');

  // Sessions-Blatt
  let sessSheet = ss.getSheetByName(SHEET_NAME_SESSIONS);
  if (!sessSheet) {
    sessSheet = ss.insertSheet(SHEET_NAME_SESSIONS);
  }
  sessSheet.getRange(1, 1, 1, 8).setValues([[
    'timestamp', 'session_id', 'pool',
    'score', 'max_score', 'prozent', 'dauer_s',
    'anzahl_fragen'
  ]]);
  sessSheet.setFrozenRows(1);
  sessSheet.getRange(1, 1, 1, 8).setFontWeight('bold');

  // Sheet1 entfernen falls leer
  const sheet1 = ss.getSheetByName('Sheet1') || ss.getSheetByName('Tabelle1');
  if (sheet1 && sheet1.getLastRow() <= 1) {
    try { ss.deleteSheet(sheet1); } catch(e) {}
  }
}

/**
 * Web App Endpoint — empfängt GET-Requests von pool.html
 */
function doGet(e) {
  try {
    const params = e.parameter;
    const event = params.event || 'unknown';
    const now = new Date();
    const ts = Utilities.formatDate(now, 'Europe/Zurich', 'yyyy-MM-dd HH:mm:ss');

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (event === 'answer' || event === 'skip') {
      const evSheet = ss.getSheetByName(SHEET_NAME_EVENTS);
      evSheet.appendRow([
        ts,
        event,
        params.sid || '',
        params.pool || '',
        params.qid || '',
        params.topic || '',
        params.qtype || '',
        params.diff || '',
        params.correct || '',
        event === 'skip' ? 'true' : 'false',
        params.answer || '',
        params.zeit || ''
      ]);
    }
    else if (event === 'session_end') {
      const sessSheet = ss.getSheetByName(SHEET_NAME_SESSIONS);
      const pct = params.max > 0 ? Math.round((params.score / params.max) * 100) : 0;
      sessSheet.appendRow([
        ts,
        params.sid || '',
        params.pool || '',
        params.score || 0,
        params.max || 0,
        pct,
        params.dauer || '',
        params.count || ''
      ]);
    }

    return ContentService
      .createTextOutput('OK')
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    return ContentService
      .createTextOutput('ERR: ' + err.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
