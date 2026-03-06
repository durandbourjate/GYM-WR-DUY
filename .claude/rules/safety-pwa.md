# Safety — PWA & Client-Side Apps

## localStorage (24 Stellen im Unterrichtsplaner)

- Jeder `JSON.parse(localStorage.getItem(...))` MUSS in try/catch stehen
- Fallback-Wert definieren wenn Parse fehlschlägt (korrupte Daten, Quote-Limit)
- Vor dem Schreiben: Grösse prüfen wenn Daten >500KB sein könnten (5MB Browser-Limit)
- Nie sensible Daten in localStorage (OAuth-Tokens ausgenommen, diese laufen ab)

## Datenverlust verhindern

- Destruktive Aktionen (Planer löschen, Sequenz löschen, Bulk-Delete) brauchen Bestätigungsdialog
- Undo-Stack für reversible Aktionen beibehalten
- Export-Funktion muss immer funktionieren (auch bei korruptem State → graceful degradation)
- Beim Laden von JSON-Importen: Schema validieren bevor State überschrieben wird

## XSS-Prävention

- Unterrichtsplaner (React): Kein `dangerouslySetInnerHTML` (aktuell: 0 Stellen — so lassen)
- pool.html (Übungspools): `innerHTML` wird verwendet (15 Stellen) — bei neuen Stellen: Inhalte escapen, keine User-Eingaben direkt in innerHTML
- Kein `eval()` (aktuell: 0 — so lassen)

## postMessage (Übungspools → LearningView)

- Origin-Check bei eingehenden Messages (`event.origin` prüfen)
- Nur erwartete Message-Formate akzeptieren, alles andere ignorieren

## Service Worker (PWA)

- Nach Deploy: Wenn Nutzer alte Version sehen, liegt es am SW-Cache
- Lösung: SW-Version in sw.js hochzählen oder `skipWaiting()` verwenden
- Bei grundlegenden Änderungen an der App-Shell: Cache-Busting sicherstellen

## Externe Abhängigkeiten

- OAuth-Tokens (Google Calendar): Nur im Memory halten oder mit Ablaufdatum in localStorage
- Keine API-Keys im Client-Code committen (aktuell keine — so lassen)
- CDN-Abhängigkeiten (pool.html): Subresource Integrity (SRI) bei neuen Einbindungen prüfen
