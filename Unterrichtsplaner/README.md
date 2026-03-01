# Unterrichtsplaner

Webbasierter Semesterplaner für den W&R-Unterricht. Zeigt alle Kurse (SF, EWR, IN) als Grid mit Kalenderwochen und ermöglicht Drag & Drop, Sequenz-Verwaltung, Lehrplanbezüge und Druckansicht.

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

## Features (v2.9)

- Wochenraster mit allen Kursen (Stundenplan SJ 25/26)
- Sequenzen: Themenblöcke über mehrere Wochen, mit Fachbereich-Farben
- Shift+Klick Bereichs-Selektion (Di+Do-aware für SF)
- Gruppen-Drag & Drop (Multi-Column)
- Detail-Panel: Themen, Notizen, Material-Links, Lehrplanziele
- Suche, Statistiken, HK-Rotation, TaF-Phasen
- Druckansicht, Auto-Save (localStorage), JSON-Export/Import

## Daten

- `src/data/courses.ts` — Stundenplan (Kurse, Tage, Zeiten)
- `src/data/weeks.ts` — Schulwochen mit Ferien/Sonderwochen
- `src/data/curriculumGoals.ts` — Lehrplanziele LP17

## Weiterentwicklung

Siehe [HANDOFF.md](./HANDOFF.md) für den aktuellen Entwicklungsstand und nächste Schritte.
