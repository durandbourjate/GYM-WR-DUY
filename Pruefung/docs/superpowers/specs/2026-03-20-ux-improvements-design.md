# UX-Verbesserungen Prüfungsplattform — Design Spec

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement the plan generated from this spec.

**Ziel:** UI/UX-Konsistenz und Bedienbarkeit der LP-Ansichten verbessern — einheitlicher Header, bessere Fragenbank-Interaktion, Layout-Fixes, neue Funktionen (Duplizieren, Audio-Aufnahme, Materialien-Erweiterung).

**Scope:** Nur LP-seitige UI-Änderungen. Prüfungsdurchführung (Timer, Zeitzuschlag, Open-End) ist ein separates Projekt.

---

## 1. Einheitlicher Header

### Problem
Jede LP-Ansicht hat einen anderen Header mit unterschiedlicher Button-Reihenfolge und -Auswahl:
- **Startseite:** + Neue Prüfung (prominent), Fragenbank, Hilfe, ThemeToggle, Abmelden
- **Composer:** ← Zurück, Speichern (prominent), ThemeToggle — kein Hilfe, keine Fragenbank, kein Abmelden
- **Monitoring:** ← Zurück, Live, ↻, User+Abmelden, ThemeToggle — kein Hilfe, keine Fragenbank
- **Korrektur:** ← Zurück, Abmelden, ThemeToggle — kein Hilfe, keine Fragenbank

### Design
Einheitliches Header-Schema für alle LP-Ansichten:

**Links:** `[← Zurück]` (ausser Startseite) + Titel + ggf. Status ("Gespeichert ✓")

**Rechts:** `[Ansichtsspezifische Buttons]` · Separator · `Fragenbank` · `Hilfe` · `Abmelden` · `ThemeToggle`

Alle Buttons im **gleichen neutralen Stil** (grauer Text, hellgrauer Hintergrund bei Hover). Kein Button ist visuell prominent — auch nicht "Neue Prüfung" oder "Speichern". "Gespeichert ✓" wird als Status-Text neben dem Titel angezeigt, nicht als Button.

**Ansichtsspezifische Buttons:**
| Ansicht | Spezifische Buttons |
|---------|-------------------|
| Startseite | + Neue Prüfung |
| Composer | Speichern |
| Monitoring | Live-Toggle, ↻ Refresh |
| Korrektur | Freigeben (bestehender Toggle aus Phase 5, wird aus dem Body in den Header verschoben — togglet `korrektur.freigegeben`) |

Der Separator (vertikaler 1px-Strich) trennt ansichtsspezifische von globalen Buttons.

### Implementierung
- Neue Komponente `LPHeader` extrahieren mit Props: `titel`, `untertitel?`, `zurueck?`, `statusText?`, `ansichtsButtons?: ReactNode`
- Globale Buttons (Fragenbank, Hilfe, Abmelden, ThemeToggle) sind fix eingebaut
- Fragenbank/Hilfe-Toggle-State wird per Callback (`onFragenbank`, `onHilfe`) nach oben gegeben
- In allen 4 Ansichten den bisherigen Header durch `<LPHeader>` ersetzen

---

## 2. Fragenbank — Buttons & Breite

### Problem
- ThemeToggle doppelt (bereits im Header)
- Button-Reihenfolge unintuitiv (Export links, Neue Frage rechts)
- Panel zu schmal (672px) für den Inhalt

### Design
- **ThemeToggle entfernen** aus FragenBrowser
- **Button-Reihenfolge:** `+ Neue Frage` · `Import` · `Export` · `×`
- **Standardbreite:** ~1008px (672 × 1.5), min 600px, max 90vw
- **Hilfe-Panel:** Gleiche Breitenerhöhung (768px → ~1152px), ThemeToggle entfernen

---

## 3. Fragenbank — Klickverhalten

### Problem
- Klick auf Frage schliesst Fragenbank ohne Aktion
- "Bearbeiten"-Button ist der einzige Weg zum Editor
- Kein visuelles Feedback welche Fragen bereits in der Prüfung sind

### Design

**Neues Interaktionsmodell:**
- **Klick auf Frage** (auf den Text/die Karte): Öffnet den FragenEditor (innerhalb der Fragenbank als Overlay, wie bisher)
- **+/– Button links** an jeder Frage:
  - `+` (neutral, rund): Frage zur Ziel-Prüfung hinzufügen
  - `–` (rot, rund): Frage aus Ziel-Prüfung entfernen
- **"Bearbeiten"-Button entfällt** — Klick auf die Frage selbst reicht
- **Fragenbank bleibt offen** nach Hinzufügen/Entfernen

**Ziel-Anzeige & Abschnitt-Auswahl:**
- Grüne Leiste oben im Panel: "Ziel: [Prüfungstitel] · [Abschnitt]" mit "ändern"-Link
- Wenn Prüfung im Composer offen: automatisch als Ziel gesetzt (Prüfung + aktueller `zielAbschnittIndex`)
- **Abschnitt-Auswahl:** Wenn die Ziel-Prüfung mehrere Abschnitte hat, zeigt die Ziel-Leiste ein Dropdown zur Auswahl des Abschnitts. Bei nur einem Abschnitt wird dieser automatisch verwendet.
- **"ändern"-Link:** Öffnet ein kleines Dropdown mit allen Prüfungen (lädt Configs via `apiService.ladeConfigs()`). Klick auf eine Prüfung setzt sie als Ziel. Wenn die Prüfung mehrere Abschnitte hat, folgt die Abschnitt-Auswahl.
- Wenn keine Prüfung aktiv und + geklickt: Hintergrund wechselt zur Prüfungsliste (LPStartseite), Fragenbank bleibt offen als Overlay. LP klickt Prüfung → wird als Ziel gesetzt → zurück in Fragenbank.

**Hinzufügen/Entfernen — Datenfluss:**
- Wenn Fragenbank **im Composer** geöffnet: Nutzt bestehenden `handleFragenHinzufuegen(frageIds)` / `handleFrageEntfernen(frageId)` — modifiziert `abschnitte[zielAbschnittIndex].fragenIds` direkt im Composer-State. Autosave übernimmt die Persistierung.
- Wenn Fragenbank **standalone** geöffnet (von Startseite): Lädt die Ziel-PruefungsConfig, modifiziert `fragenIds`, speichert via `apiService.speichereConfig()`.
- Frage ist "in dieser Prüfung" wenn ihre ID in **irgendeinem** Abschnitt der Ziel-Prüfung vorkommt → zeigt `–` Button.

**Visuelle Markierung enthaltener Fragen:**
- Grüner Rand (2px solid) + hellgrüner Hintergrund
- Text "✓ In dieser Prüfung" unter dem Fragetext

---

## 4. Panel-Flow (ESC + Direktwechsel)

### Problem
- ESC schliesst keine Panels
- Um von Fragenbank zu Hilfe zu wechseln, muss man erst Fragenbank schliessen

### Design
- **Globaler ESC-Handler:** Schliesst das oberste offene Panel (Priorität: FragenEditor > Fragenbank/Hilfe)
- **Direktwechsel:** Klick auf "Hilfe" während Fragenbank offen → Fragenbank schliesst, Hilfe öffnet (und umgekehrt)
- **Implementierung:** `zeigFragenbank` und `zeigHilfe` schliessen sich gegenseitig aus. Beim Setzen des einen wird das andere auf `false` gesetzt.
- ESC-Handler als `useEffect` in `LPHeader`: lauscht auf `keydown` Event, prüft welche Panels offen sind, schliesst das oberste. Cleanup bei Unmount.

---

## 5. BerechnungEditor — Layout-Fix

### Problem
- "Hilfsmittel"-Feld nimmt mit `flex-1` die gesamte Restbreite ein (zu breit)
- "Bezeichnung"-Spalte in der Ergebnis-Tabelle ist `flex-1` (zu breit), während Zahlenfelder nur `w-20` haben

### Design
- **Hilfsmittel-Feld:** `w-64` statt `flex-1`
- **Ergebnis-Tabelle:**
  - "Bezeichnung": `w-48` (feste Breite, reicht für Labels wie "Gewinn", "Umsatz")
  - "Ergebnis" und "±Toleranz": `flex-1` (mehr Platz für Zahleneingaben)
  - "Einheit": `w-16` (bleibt)

---

## 6. Bewertungsraster — Styling & KI

### Problem
- "Löschen"-Dropdown für Vorlagen ist visuell grösser/auffälliger als "Speichern"
- Keine KI-Unterstützung für Bewertungsraster-Generierung

### Design
- **"Löschen"-Dropdown:** Gleicher kompakter Stil wie "Speichern" (gleiche Padding/Font-Size)
- **KI-Buttons:** "Generieren" und "Prüfen & Verbessern" im Bewertungsraster-Header, gleicher Stil wie bei den Fragetyp-Editoren

**KI-Aktion `bewertungsrasterGenerieren`:**
- **Request-Payload:** `{ fragetext, frageTyp, punkte, musterlosung, bloom }`
- **Response:** `{ bewertungsraster: Bewertungskriterium[] }` — Array mit `{ beschreibung, punkte, stichworte? }`
- Ersetzt das bestehende Bewertungsraster komplett

**KI-Aktion `bewertungsrasterVerbessern`:**
- **Request-Payload:** `{ fragetext, frageTyp, punkte, musterlosung, bloom, bewertungsraster: Bewertungskriterium[] }`
- **Response:** `{ bewertungsraster: Bewertungskriterium[], aenderungen: string }` — verbessertes Raster + kurze Beschreibung der Änderungen
- Zeigt `aenderungen` als Toast/Hinweis an, ersetzt das Raster

**Apps Script:** Zwei neue Cases im `doPost`-Switch. Nutzt bestehenden Claude-API-Call mit System-Prompt für Bewertungsraster-Erstellung.

### Hinweis: FragenEditor.tsx Refactoring
FragenEditor.tsx hat aktuell ~1348 Zeilen. Die Bewertungsraster-Logik (Zeilen ~1215–1343) sollte als Teil dieser Aufgabe in eine eigene Komponente `BewertungsrasterEditor.tsx` extrahiert werden, bevor die KI-Buttons hinzugefügt werden.

---

## 7. Prüfung duplizieren

### Problem
- Keine Möglichkeit, eine bestehende Prüfung als Vorlage für eine neue zu verwenden

### Design
- **Neuer Button "Duplizieren"** in der Prüfungskarte auf der Startseite (neben Bearbeiten/Monitoring/Korrektur)
- **Verhalten:**
  1. Erstellt Kopie der PruefungsConfig mit neuer ID (via `generiereId()`)
  2. Setzt Titel auf "Kopie von [Originaltitel]"
  3. Leert `klasse` und `erlaubteKlasse`; setzt `datum` auf heute
  4. Behält: Abschnitte mit Fragen-IDs, alle Einstellungen
  5. Speichert sofort via `apiService.speichereConfig()`
  6. Öffnet direkt den Composer mit der Kopie

---

## 8. Audio-Aufnahme im AnhangEditor

### Problem
- Audio kann nur per Datei-Upload hochgeladen werden, nicht direkt aufgenommen

### Design
- **Neuer Button "🎤 Aufnehmen"** im AnhangEditor neben "Datei hochladen" und "URL einbetten"
- Nutzt bestehende `AudioRecorder`-Komponente (bereits für Korrektur-Dashboard gebaut)
- **Flow:** Klick → AudioRecorder erscheint inline → Aufnahme → Vorschau → "Speichern" konvertiert AudioRecorder-Blob zu einem File-Objekt (`new File([blob], 'aufnahme-${Date.now()}.webm', { type: blob.type })`) und übergibt es an den bestehenden `onAnhangHinzu`-Upload-Flow
- Upload-Fortschritt und Fehler werden wie bei normalen Datei-Uploads angezeigt (bestehende UI in AnhangEditor)
- Das aufgenommene Audio wird als regulärer `FrageAnhang` behandelt (gleich wie Datei-Upload)

---

## 9. Materialien um Audio/Video erweitern

### Problem
- Materialien-Upload unterstützt nur PDF, Text und Links
- Kein Audio/Video als Prüfungsmaterial möglich

### Design

**Erweiterung der Materialien-Typen:**

| Typ | Beschreibung | Neu? |
|-----|-------------|------|
| `dateiUpload` | PDF, Audio, Video-Dateien | Erweitert (bisher nur PDF) |
| `text` | Freitext | Bestehend |
| `link` | Externe URL | Bestehend |
| `videoEmbed` | YouTube/Vimeo/nanoo.tv Embed | **Neu** |

**ConfigTab-Änderungen:**
- Datei-Upload akzeptiert zusätzlich `audio/*` und `video/*` MIME-Types
- Neuer Materialien-Typ "Video-Embed" mit URL-Eingabe und `parseVideoUrl()`-Validierung
- Gleiche URL-Parsing-Logik wie im AnhangEditor (YouTube, Vimeo, nanoo.tv)

**MaterialPanel-Änderungen:**
- Audio-Dateien: Rendert `<AudioPlayer>` (bestehende Komponente)
- Video-Embeds: Rendert iframe mit Embed-URL
- Video-Uploads: Rendert `<video>` mit Drive-Stream-URL
- Typ-Erkennung: `mimeType` Feld bestimmt ob Audio oder Video (bei `dateiUpload`)

**PruefungsConfig-Typ (`src/types/pruefung.ts`):**
- `PruefungsMaterial.typ`: Union um `'videoEmbed'` erweitern
- Neue optionale Felder auf `PruefungsMaterial`:
  - `mimeType?: string` — MIME-Type der hochgeladenen Datei (für Audio/Video-Unterscheidung bei `dateiUpload`)
  - `embedUrl?: string` — Embed-URL für `videoEmbed`-Typ (YouTube/Vimeo/nanoo.tv)
- Audio/Video-Uploads nutzen `typ: 'dateiUpload'` mit gesetztem `mimeType` (z.B. `'audio/mpeg'`, `'video/mp4'`)

---

## Nicht in Scope

- Drag & Drop von Fragen in Prüfungen (spätere Iteration)
- Prüfungsdurchführung: Timer, Zeitzuschlag, Open-End, SuS-Bestätigung (separates Projekt)
- Buchhaltungs-Fragetyp (separates Feature)

---

## Betroffene Dateien

| Datei | Änderung |
|-------|----------|
| **Neu:** `src/components/lp/LPHeader.tsx` | Gemeinsamer Header mit ESC-Handler |
| **Neu:** `src/components/lp/frageneditor/BewertungsrasterEditor.tsx` | Extrahiert aus FragenEditor.tsx |
| `src/components/lp/LPStartseite.tsx` | LPHeader, Duplizieren-Button, Panel-State |
| `src/components/lp/PruefungsComposer.tsx` | LPHeader, Panel-State |
| `src/components/lp/MonitoringDashboard.tsx` | LPHeader |
| `src/components/lp/KorrekturDashboard.tsx` | LPHeader |
| `src/components/lp/FragenBrowser.tsx` | Breite, Buttons, Klickverhalten, Ziel-Leiste, +/– Buttons |
| `src/components/lp/HilfeSeite.tsx` | Breite, ThemeToggle entfernen |
| `src/components/lp/frageneditor/BerechnungEditor.tsx` | Layout-Fix Feldgrössen |
| `src/components/lp/frageneditor/FragenEditor.tsx` | Bewertungsraster extrahieren, KI-Buttons |
| `src/components/lp/frageneditor/AnhangEditor.tsx` | AudioRecorder einbauen |
| `src/components/lp/composer/ConfigTab.tsx` | Materialien Audio/Video/Embed |
| `src/components/MaterialPanel.tsx` | Audio/Video-Rendering |
| `src/types/pruefung.ts` | Materialien-Typ erweitern |
| `apps-script-code.js` | KI-Aktionen: `bewertungsrasterGenerieren`, `bewertungsrasterVerbessern` |
