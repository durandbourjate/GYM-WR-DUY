# F1–F15: LP-Live-Test-Feedback — Design Spec

> Systematische Behebung aller 15 Feedback-Punkte aus dem ersten LP-Live-Test (25.03.2026).
> Reihenfolge: Korrektur → Resilienz → Quick-Wins → Investigation/Features.

---

## Aufwandsschätzung

| Cluster | Punkte | Geschätzte Grösse |
|---------|--------|-------------------|
| 1 — Korrektur | F3+F4, F5, F6 | **Gross** (neues Korrektur-Layout + Auto-Korrektur-Engine) |
| 2 — Resilienz | F1, F2 | **Mittel** (Error-Handling + Autosave-Hook) |
| 3 — Quick-Wins | F7, F8, F10, F11, F12, F14 | **Klein** (6 isolierte Änderungen, je <30 Min.) |
| 4 — Investigation | F9, F13, F15 | **Mittel** (Backend-Änderung + Debugging + neue UI) |

---

## Apps Script: Gebündelte Bereitstellung

Alle Backend-Änderungen aus allen 4 Clustern werden **gesammelt** und am Ende in einer einzigen manuellen Apps-Script-Bereitstellung deployed. Das vermeidet mehrfaches Copy-Paste + Bereitstellungs-Zyklen.

| Endpoint | Änderung | Cluster |
|----------|----------|---------|
| `starteKorrektur` | `ensureColumns()` für `kiPunkte`, `kiBegruendung`, `kiFeedback` | 1 (F5) |
| `ladeFragen` | `musterlosung` + `musterloesungBild` Felder in Response aufnehmen | 1 (F3) |
| `ladeKorrektur` | Material-Daten (`driveFileId`, `materialien`) pro Frage mitliefern | 1 (F6) |
| `heartbeat` | `aktuelleFrage` + `beantworteteFragen` ins Monitoring-Sheet schreiben (Spalte `fortschritt`) | 4 (F9) |
| `ladeMonitoring` | `fortschritt`-Spalte in Response aufnehmen | 4 (F9) |
| Neuer Endpoint: `ladeKorrekturStatus` | Zähler (korrigiert/offen/gesamt) pro Prüfung zurückgeben | 4 (F15) |

---

## Cluster 1 — Korrektur brauchbar machen (F3, F4, F5, F6)

### Kernprinzip

Die Korrektur-Ansicht zeigt jede Frage **so wie die SuS sie gesehen haben**, ergänzt um ein Korrektur-Overlay. Deterministische Fragetypen werden **sofort automatisch korrigiert und bepunktet**.

### F3 + F4: Frage + Musterlösung in Korrektur-Ansicht

**Problem:** LP sieht nur "Lücke 1: sadf" ohne Kontext. Fragetext ist auf 1 Zeile truncated. Keine Musterlösung sichtbar.

**Datenquelle Musterlösung:** Das Feld `musterlosung` (string) existiert auf dem `Frage`-Typ (`src/types/fragen.ts:36`). Für Zeichnungen: `musterloesungBild` (optional Base64, `src/types/fragen.ts:138`). Diese Felder sind bereits im Frontend-Typ definiert und werden im FragenEditor bearbeitet (`MusterloesungSection.tsx`). **Problem:** `ladeFragen` im Backend liefert diese Felder aktuell nicht in der Korrektur-Response → Backend muss erweitert werden (siehe Apps-Script-Tabelle oben).

**Lösung — Neues Layout pro Frage in `KorrekturFrageZeile.tsx`:**

1. **Frage-Ansicht** — Gleicher Renderer wie SuS-Modus verwenden (voller Fragetext, Optionen, Material-Referenzen, PDF-Embed). Bestehende Frage-Komponenten aus `src/components/fragetypen/` im Read-Only-Modus wiederverwenden, nicht neu implementieren.
2. **SuS-Antwort** — Eingebettet in die Frage-Ansicht mit farblicher Richtig/Falsch-Markierung (bei auto-korrigierbaren Typen).
3. **Musterlösung** — Unter der SuS-Antwort:
   - Text-basiert: `frage.musterlosung` rendern (Freitext, MC, R/F, Zuordnung, Lückentext, Berechnung)
   - Bild-basiert: `frage.musterloesungBild` als `<img>` (Zeichnung/Visualisierung)
   - PDF: Musterlösung-Annotationen als Overlay auf dem PDF (falls vorhanden)
   - FiBu: Strukturierte Lösung aus den Frage-Daten (korrekte Buchungen, T-Konto-Einträge etc.)
4. **Korrektur-Leiste** — Punkte (auto/KI/LP), Kommentar-Feld, Audio-Kommentar, "Geprüft"-Checkbox

**Betroffene Dateien:**
- `src/components/lp/KorrekturFrageZeile.tsx` (195 Z.) — Hauptumbau
- `src/components/lp/KorrekturSchuelerZeile.tsx` (453 Z.) — Layout-Anpassung
- Bestehende Frage-Renderer aus `src/components/fragetypen/` im Read-Only-Modus einbinden

### Auto-Korrektur bei deterministischen Fragetypen

**Automatisch korrigierbar (sofort beim Laden):**

| Fragetyp | Vergleichslogik |
|----------|----------------|
| MC | Ausgewählte Optionen vs. korrekte Optionen |
| Richtig/Falsch | Bewertungen vs. korrekte Antworten |
| Lückentext | Eingegebener Text vs. Lösungswörter (case-insensitive, trimmed) |
| Zuordnung | Zugeordnete Paare vs. korrekte Paare |
| Berechnung | Eingegebene Zahlen vs. korrekte Ergebnisse (mit Toleranz) |
| Buchungssatz | Via `fibuAutoKorrektur.ts` (existiert bereits) |
| T-Konto | Via `fibuAutoKorrektur.ts` |
| Kontenbestimmung | Via `fibuAutoKorrektur.ts` |
| Bilanzstruktur | Via `fibuAutoKorrektur.ts` |

**Manuell/KI-korrigierbar:**

| Fragetyp | Grund |
|----------|-------|
| Freitext | Offene Antwort, kein deterministischer Vergleich |
| Zeichnung/Visualisierung | Bildbasiert |
| PDF-Annotation | Annotations auf PDF |

**Implementierung:**
- Neue Datei `src/utils/autoKorrektur.ts` — Sammelfunktion `autoKorrigiere(frage, antwort): { punkte: number, details: AutoKorrekturDetail[] }`
- FiBu-Logik aus `fibuAutoKorrektur.ts` integrieren (bereits vorhanden)
- Auto-Korrektur wird beim Laden der Korrektur-Daten ausgeführt, Ergebnis in State gespeichert
- LP kann jeden auto-korrigierten Wert überschreiben (Override-Mechanismus bleibt)
- **Error-Handling:** `autoKorrigiere()` wrapped in try/catch. Bei Fehler (malformed data, fehlende Felder): Frage wird als "Auto-Korrektur fehlgeschlagen" markiert und fällt zurück auf manuelle Korrektur. Kein Crash der gesamten Korrektur-Ansicht.

### F5: KI-Punkte leer — Investigation

**Problem:** `kiPunkte`-Feld existiert im UI (amber Box), aber Batch-KI füllt es nicht korrekt.

**Status:** Root Cause unbekannt — wird als Investigation behandelt.

**Investigation-Schritte:**
1. `starteKorrektur` in `apps-script-code.js` prüfen: Wird `kiPunkte` in die Korrektur-Zeile geschrieben?
2. Sheet-Spalten prüfen: Existieren `kiPunkte`, `kiBegruendung`, `kiFeedback` als Spalten?
3. `ensureColumns()` beim Schreiben der KI-Ergebnisse aufrufen (wahrscheinlichste Lösung)
4. Feldname-Mismatch prüfen (camelCase vs. snake_case)

**Deliverable:** Fix im Backend (Apps Script) + Verifikation dass KI-Punkte korrekt erscheinen. Frontend ist bereits implementiert.

### F6: "Kein PDF vorhanden" bei Witzsammlung in Korrektur

**Problem:** PDF wird via `pdfBase64` erwartet, aber im Korrektur-Kontext werden Material-Daten nicht mitgeladen.

**Lösung:**
- Backend: `ladeKorrektur` / `ladeFragen` muss Material-Daten pro Frage mitliefern (`driveFileId`, `materialien`)
- Frontend: `PDFKorrektur.tsx` bekommt Fallback auf `apiService.ladeDriveFile(driveFileId)` wenn `pdfBase64` fehlt
- Gleicher Lade-Mechanismus wie im SuS-Modus (`MaterialPanel.tsx`)

---

## Cluster 2 — Verbindungs-Resilienz (F1, F2)

### F1: LP Verbindungsverlust crasht Monitoring

**Problem:** `ladeDaten()` im 5s-Intervall zeigt bei Timeout/Fehler nichts an. LP sieht "Daten konnten nicht geladen werden" und muss Seite neu laden.

**Lösung:**
- Error-Counter in `DurchfuehrenDashboard.tsx`: nach 3 aufeinanderfolgenden Fehlern → gelber Banner "Verbindung unterbrochen — wird automatisch erneut versucht..."
- Bei Erfolg nach Fehlern: Banner verschwindet, kurzer grüner "Wieder verbunden"-Toast
- Fehler werden **nicht** als Crash behandelt — bestehende Daten bleiben sichtbar
- Kein Exponential Backoff nötig (5s-Intervall ist schon konservativ)
- AbortController-Overlap-Schutz ist bereits implementiert

**Betroffene Dateien:**
- `src/components/lp/DurchfuehrenDashboard.tsx` — Error-State + Banner-UI

### F2: Korrektur-Autosave fehlt

**Problem:** Korrektur nutzt lokalen React-State. Alles weg bei Refresh oder Verbindungsverlust.

**Lösung:**
- **Debounced Auto-Save:** 3s nach letzter Änderung → `speichereKorrekturZeile()` API-Call
- **IndexedDB-Backup:** Gleicher Pattern wie SuS-Autosave (`autoSave.ts`). Key: `korrektur-{pruefungId}`
- **Recovery:** Beim Laden prüfen ob IndexedDB neuere Daten hat als Backend → Info-Banner "Nicht gespeicherte Korrekturen gefunden — wiederherstellen?"
- **VerbindungsStatus-Indikator** auch im Korrektur-Tab anzeigen
- **Einschränkung:** Single-Tab. Gleichzeitiges Korrigieren in zwei Browser-Tabs der gleichen Prüfung wird nicht unterstützt (IndexedDB-Writes würden kollidieren). Kein Schutzmechanismus nötig — LP arbeitet in einem Tab.

**Betroffene Dateien:**
- `src/components/lp/KorrekturDashboard.tsx` — Autosave-Hook einbauen
- Neuer Hook: `src/hooks/useKorrekturAutoSave.ts`
- `src/services/autoSave.ts` erweitern oder separater IndexedDB-Store

---

## Cluster 3 — Quick-Wins (F7, F8, F10, F11, F12, F14)

### F7: Lobby-Feedback für SuS

**Problem:** Kein Unterschied zwischen "URL eingegeben" und "LP hat mich erkannt".

**Lösung:**
- Nach erstem erfolgreichem Heartbeat: Status-Text ändern zu "Verbunden — warte auf Freischaltung durch Lehrperson"
- Grüner Punkt neben dem Status-Text
- Boolean `heartbeatErfolgreich` im Startbildschirm-State

**Datei:** `src/components/Startbildschirm.tsx`

### F8: 10s Verzögerung bis Freischaltung erkannt

**Problem:** Warteraum pollt alle 3s — aber gefühlt dauert es 10s.

**Lösung:** Polling auf **2s** verkürzen im Warteraum. Der Warteraum ist kurzlebig (SuS warten max. ein paar Minuten), daher ist die erhöhte Last vertretbar. Config-Reload und Heartbeat laufen bereits im gleichen `Promise.allSettled()`-Call, also kein separater Zyklus. Falls 2s immer noch zu langsam wirkt: auf 1s gehen (nur für Warteraum-Phase).

**Datei:** `src/components/Startbildschirm.tsx` — Interval-Konstante ändern

### F10: Falsches Icon — Leuchtstift zeigt Kreide

**Problem:** `highlighter: '🖍'` (Wachskreide-Emoji) statt Textmarker-Symbol.

**Lösung:** Inline-SVG verwenden das Textanstreichen darstellt (horizontaler farbiger Balken hinter Text). `lucide-react` ist **nicht** als Dependency im Pruefung-Projekt vorhanden — kein neues Paket hinzufügen nur für ein Icon. Stattdessen: kleines SVG-Element (ca. 5 Zeilen) oder Unicode-Zeichen das besser passt.

**Datei:** `src/components/fragetypen/pdf/PDFToolbar.tsx` (Zeile 48)

### F11: Material-PDF nur 4cm hoch im Split-Modus

**Problem:** iframe bekommt `flex-1` aber Container hat keine feste Höhe.

**Lösung:**
- iframe bekommt `min-h-[200px] md:min-h-[300px]` (responsive Mindesthöhe: 200px mobil, 300px ab md-Breakpoint)
- Container prüfen: braucht explizite `h-[calc(100vh-...)]` oder `h-full` mit korrekter Parent-Chain
- Testen auf Desktop + Tablet-Portrait

**Datei:** `src/components/MaterialPanel.tsx` (Zeilen 254-264)

### F12: "In neuem Tab öffnen" ausblenden

**Problem:** Link-Material zeigt immer "In neuem Tab öffnen ↗" — SEB blockiert neue Tabs.

**Lösung:** Link nur anzeigen wenn `user.rolle === 'lp'`. SuS sehen den Link nie (auch ohne SEB). Rolle ist via `useAuthStore()` → `user.rolle` verfügbar (aus `src/store/authStore.ts`).

**Datei:** `src/components/MaterialPanel.tsx` (Zeile 292)

### F14: Beenden — 1 Klick wenn alle abgegeben

**Problem:** Auch bei 0 aktiven SuS muss LP durch 2-Stufen-Dialog.

**Lösung:**
- Wenn `aktiveSuS === 0`: Direkt einen einzelnen "Prüfung beenden"-Button anzeigen
- Kein "Weiter → Definitiv beenden", sondern 1 Klick mit kurzem Bestätigungstext inline ("Alle SuS haben abgegeben.")
- Bemerkungen-Feld optional darunter (kein Pflichtfeld)

**Datei:** `src/components/lp/BeendenDialog.tsx` (Zeilen 83-92)

---

## Cluster 4 — Investigation + Features (F9, F13, F15)

### F9: 30s bis LP Fortschritt sieht

**Problem:** SuS Remote-Autosave-Intervall ist 30s (`autoSaveIntervallSekunden: 30`). LP-Monitoring pollt zwar alle 5s, aber es gibt nichts Neues zu zeigen bis der SuS gespeichert hat.

**Lösung:** SuS-Heartbeat (10s) sendet bereits `aktuelleFrage` als Parameter. Backend muss diesen Wert im Monitoring persistieren:

1. **Apps Script `heartbeat`-Endpoint:** `aktuelleFrage` + Anzahl beantworteter Fragen in die Monitoring-Daten schreiben. Konkret: Spalte `fortschritt` im Monitoring-Sheet (oder bestehende Spalte `aktuelleFrage` falls vorhanden — prüfen beim Implementieren).
2. **Apps Script `ladeMonitoring`:** `fortschritt`-Daten in Response aufnehmen.
3. **Frontend `DurchfuehrenDashboard.tsx`:** Fortschritt aus Monitoring-Response anzeigen (z.B. "Frage 3/15" statt nur Prozent).

So sieht die LP den Fortschritt alle 10s (Heartbeat-Intervall) statt alle 30s (Autosave).

### F13: MC-Frage 15 nicht als beantwortet markiert — Investigation

**Problem:** MC-Frage mit Material (Aufgabengruppe `einr-ag-material-mc`), SuS hat gearbeitet aber Status blieb "offen".

**Root Cause unbekannt.** Deliverable: Investigation-Report mit Fix.

**Investigation-Plan:**
1. Einrichtungsprüfung starten, Frage 15 navigieren
2. MC-Option auswählen, Browser DevTools → State inspizieren
3. Prüfen: Wird `antworten['einr-ag-material-mc']` korrekt im Store gesetzt?
4. `antwortStatus.ts` → `istVollstaendigBeantwortet`: Wird für diese Frage-ID aufgerufen?
5. Hypothesen:
   - **Aufgabengruppe:** Frage ist Teil einer Gruppe → Antwort-Key stimmt nicht mit der ID überein die `antwortStatus` prüft
   - **Material-Split:** Material-Panel blockiert den Frage-Renderer-Mount
   - **Race Condition:** Teilaufgaben werden nachgeladen, State-Update kommt zu spät
6. Fix implementieren + verifizieren

**Dateien:** `src/utils/antwortStatus.ts`, `src/store/pruefungStore.ts`, `src/components/fragetypen/`

### F15: Korrektur-Status in Prüfungsübersicht

**Problem:** TrackerSection zeigt nur fehlende SuS, kein Korrektur-Fortschritt.

**Lösung:**
- PrüfungsListe/TrackerSection erweitern:
  - **"X von Y korrigiert"** pro Prüfung (Anzahl `geprüft === true` vs. Gesamt)
  - **Status-Badge:** offen → in Korrektur → korrigiert
- Daten: Neuer leichtgewichtiger Endpoint `ladeKorrekturStatus(pruefungId)` der nur Zähler zurückgibt (nicht alle Korrektur-Daten). Performanter als `ladeKorrektur()`.

**Betroffene Dateien:**
- `src/components/lp/TrackerSection.tsx`
- Neuer Endpoint in `apps-script-code.js`

---

## Nicht im Scope

- Zeitzuschlag (Nachteilsausgleich) in Durchführung → separates Feature
- SEB-Lösung → separat, aktuell deaktiviert
- Skalierung/Multi-User → erst nach Feature-Completeness
- Nachprüfung erstellen (Config klonen) → eigenes Feature, nicht Teil von F15
