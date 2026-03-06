# Unterrichtsplaner

Webbasierter Semesterplaner für den W&R-Unterricht am Gymnasium Hofwil. Zeigt alle Kurse (SF, EWR, IN) als Grid mit Kalenderwochen und ermöglicht Drag & Drop, Sequenz-Verwaltung, Lehrplanbezüge und Materialverwaltung.

**Live:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Stack

- React 19 + TypeScript + Vite
- Zustand (State Management)
- PWA (Offline-fähig)
- Tailwind-Utility-Klassen (inline)

## Entwicklung

```bash
cd Unterrichtsplaner
npm install
npm run dev      # Entwicklungsserver (localhost:5173)
npm run build    # Produktions-Build → dist/
```

## Features (v3.97)

### 2 Zoom-Stufen
- **Jahresübersicht:** Ganzes Schuljahr als Blockübersicht mit farbcodierten Sequenzen, Ferien-Balken pro Woche (colspan), stufenspezifische Sonderwochen, Ist/Soll-Vergleich pro Fachbereich und Semester
- **Wochendetail:** Detailliertes Wochenraster mit allen Kursen, Drag & Drop, Inline-Editing

### Sequenzen, Blöcke & Reihen
- Themenblöcke über mehrere Wochen mit Fachbereich-Farben (VWL=orange, BWL=blau, Recht=grün)
- Sequenz → Blöcke → Reihen: Hierarchische Unterrichtsstruktur
- Oberthema, Unterthema, Beschreibung, Lehrplanziel (LP17)
- Lektionsliste pro Sequenz (Ferien automatisch ausgefiltert)
- SOL-Tracking mit Summen-Badge

### Selektion & Bearbeitung
- Shift+Klick Bereichs-Selektion (Di+Do-aware für SF-Kurse)
- Mehrtages-Popup bei verlinkten Kursen
- Batch-Bearbeitung (mehrere Zellen gleichzeitig)
- Gruppen-Drag & Drop (Multi-Column)
- Delete/Backspace zum Löschen, Undo-Stack

### Panels & Verwaltung
- Detail-Panel: Themen, Notizen, Material-Links (LV integriert)
- Sequenz-Panel: Alle Sequenzen nach Fachbereich gruppiert, Pin-Card für aktive Sequenz, grosser Bearbeitungsbereich (75vh)
- Materialsammlung: Archivierung von UE und Reihen
- Noten-Vorgaben-Tracking pro Semester (MiSDV Art. 4)
- Notizen-Spalte (aufklappbar pro Kurs, resizable)

### Multi-Planer & Presets
- Multi-Planer mit Tabs (mehrere Planungen parallel)
- Settings pro Instanz (Auto-Save)
- JSON-basierte Schuljahr-Presets: Ferien, Sonderwochen, Stundenplan, Lehrplanziele, Fachbereiche, Beurteilungsregeln
- Preset-Dateien in `public/presets/Hofwil/`

### Zoom & Darstellung
- 5-stufige Zoom-Funktion (10–16px): Alle Texte, Icons, Badges und Zeilenhöhen skalieren proportional (~15% Schritte)
- Optimierte Schriftgrössen: Überschriften 13px, Labels/Inputs 12px, Buttons 11px
- Hell/Dunkel-Toggle für vergangene Wochen (alle Zoom-Stufen)
- Light/Dark-Mode mit CSS-Variables
- HoverPreview mit smarter Positionierung

### Weitere Features
- Suche, Statistiken, HK-Rotation, TaF-Phasen
- Google Calendar Integration (OAuth, bidirektionaler Sync)
- Druckansicht, Auto-Save (localStorage), JSON-Export/Import

## Daten

- `src/data/courses.ts` — Stundenplan SJ 25/26 (Kurse, Tage, Zeiten)
- `src/data/weeks.ts` — Schulwochen mit Ferien/Sonderwochen/Feiertagen
- `src/data/curriculumGoals.ts` — Lehrplanziele LP17
- `public/presets/Hofwil/` — Schulspezifische Preset-Dateien (JSON)

## Weiterentwicklung

Siehe [HANDOFF.md](./HANDOFF.md) für den aktuellen Entwicklungsstand und nächste Schritte.
