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

## Features (v3.38)

### 3 Zoom-Stufen
- **Zoom 1 (Übersicht):** Mehrjahresübersicht mit Ist/Soll-Vergleich pro Fachbereich und Semester
- **Zoom 2 (Jahresansicht):** Ganzes Schuljahr als Blockübersicht mit farbcodierten Sequenzen, zusammengefassten Ferien-Blöcken (rowSpan), Events/Sonderwochen als graue Blöcke
- **Zoom 3 (Wochenansicht):** Detailliertes Wochenraster mit allen Kursen, Drag & Drop, Inline-Editing

### Sequenzen & Unterrichtseinheiten
- Themenblöcke über mehrere Wochen mit Fachbereich-Farben (VWL=orange, BWL=blau, Recht=grün)
- Sequenz-Bar mit Fachbereich-Farbcode
- Oberthema, Unterthema, Beschreibung, Lehrplanziel (LP17)
- Lektionsliste pro Sequenz (Ferien automatisch ausgefiltert)
- SOL-Tracking mit Summen-Badge

### Selektion & Bearbeitung
- Shift+Klick Bereichs-Selektion (Di+Do-aware für SF-Kurse)
- Mehrtages-Popup bei verlinkten Kursen (mit Click-Outside/Esc)
- Gruppen-Drag & Drop (Multi-Column)
- Delete/Backspace zum Löschen, Undo-Stack

### Panels & Verwaltung
- Detail-Panel: Themen, Notizen, Material-Links (LV integriert)
- Sequenz-Panel: Alle Sequenzen nach Fachbereich gruppiert, Pin-Card für aktive Sequenz
- Materialsammlung: Archivierung von UE und Reihen
- Noten-Vorgaben-Tracking pro Semester

### Weitere Features
- Suche (Zoom 2 + 3), Statistiken, HK-Rotation, TaF-Phasen
- Notizen-Spalte (aufklappbar pro Kurs, resizable)
- HoverPreview mit smarter Positionierung
- Hell/Dunkel-Toggle für vergangene Wochen (alle Zoom-Stufen)
- Druckansicht, Auto-Save (localStorage), JSON-Export/Import

## Daten

- `src/data/courses.ts` — Stundenplan SJ 25/26 (Kurse, Tage, Zeiten)
- `src/data/weeks.ts` — Schulwochen mit Ferien/Sonderwochen/Feiertagen
- `src/data/curriculumGoals.ts` — Lehrplanziele LP17

## Weiterentwicklung

Siehe [HANDOFF.md](./HANDOFF.md) für den aktuellen Entwicklungsstand und nächste Schritte.
