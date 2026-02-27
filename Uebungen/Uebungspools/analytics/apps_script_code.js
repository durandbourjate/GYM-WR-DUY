/**
 * Google Apps Script — Übungspool: Problemmeldungen + Analytics
 *
 * Dieses Script verarbeitet ZWEI Arten von Requests über denselben Endpoint:
 * 1. Problemmeldungen (bestehend) → Blatt «Problemmeldungen»
 * 2. Analytics-Events (neu)       → Blätter «Events» und «Sessions»
 *
 * SETUP FÜR ANALYTICS:
 * 1. Im bestehenden Apps Script diesen Code einfügen (ersetzt den alten)
 * 2. setupAnalyticsSheets() einmal manuell ausführen
 *    → Erstellt die Blätter «Events» und «Sessions» im selben Sheet
 * 3. Neue Version deployen (Deploy → Bereitstellungen verwalten → Neue Version)
 *    → Die URL bleibt gleich!
 */

// ── KONFIGURATION ──
const SHEET_EVENTS = 'Events';
const SHEET_SESSIONS = 'Sessions';
const SHEET_REPORTS = 'Problemmeldungen';  // Bestehendes Blatt (im Sheet umbenennen!)

/**
 * Einmalig ausführen: Erstellt die Analytics-Blätter im bestehenden Sheet.
 * Das bestehende Blatt «Problemmeldungen» wird nicht verändert.
 */
function setupAnalyticsSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Events-Blatt
  let evSheet = ss.getSheetByName(SHEET_EVENTS);
  if (!evSheet) {
    evSheet = ss.insertSheet(SHEET_EVENTS);
  }
  evSheet.getRange(1, 1, 1, 12).setValues([[
    'timestamp', 'event', 'session_id', 'pool',
    'frage_id', 'topic', 'type', 'diff', 'correct',
    'skipped', 'antwort', 'zeit_ms'
  ]]);
  evSheet.setFrozenRows(1);
  evSheet.getRange(1, 1, 1, 12).setFontWeight('bold');

  // Sessions-Blatt
  let sessSheet = ss.getSheetByName(SHEET_SESSIONS);
  if (!sessSheet) {
    sessSheet = ss.insertSheet(SHEET_SESSIONS);
  }
  sessSheet.getRange(1, 1, 1, 8).setValues([[
    'timestamp', 'session_id', 'pool',
    'score', 'max_score', 'prozent', 'dauer_s',
    'anzahl_fragen'
  ]]);
  sessSheet.setFrozenRows(1);
  sessSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
}

/**
 * Web App Endpoint — verarbeitet GET-Requests von pool.html
 *
 * Dispatch-Logik:
 * - param «evt» vorhanden → Analytics (answer/skip/session_end)
 * - param «pool» + «qid» + «cat» vorhanden → Problemmeldung (bestehend)
 * HINWEIS: «evt» statt «event» weil Google «event» als reservierten Parameter blockiert!
 */
function doGet(e) {
  try {
    const params = e.parameter;
    const now = new Date();
    const ts = Utilities.formatDate(now, 'Europe/Zurich', 'yyyy-MM-dd HH:mm:ss');
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // ── ANALYTICS-EVENTS ──
    if (params.evt) {
      const evt = params.evt;

      if (evt === 'answer' || evt === 'skip') {
        const sheet = ss.getSheetByName(SHEET_EVENTS);
        if (sheet) {
          sheet.appendRow([
            ts,
            evt,
            params.sid || '',
            params.pool || '',
            params.qid || '',
            params.topic || '',
            params.qtype || '',
            params.diff || '',
            params.correct || '',
            evt === 'skip' ? 'true' : 'false',
            params.answer || '',
            params.zeit || ''
          ]);
        }
      }
      else if (evt === 'session_end') {
        const sheet = ss.getSheetByName(SHEET_SESSIONS);
        if (sheet) {
          const pct = params.max > 0 ? Math.round((params.score / params.max) * 100) : 0;
          sheet.appendRow([
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
      }
    }
    // ── PROBLEMMELDUNGEN (bestehend) ──
    // pool.html sendet: pool, qid, topic, text, category, comment
    else if (params.pool && params.qid && (params.cat || params.category)) {
      const sheet = ss.getSheetByName(SHEET_REPORTS);
      if (sheet) {
        sheet.appendRow([
          ts,
          params.pool || '',
          params.qid || '',
          params.topic || '',
          params.qtext || params.text || '',
          params.cat || params.category || '',
          params.desc || params.comment || ''
        ]);
      }
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
