# Unterrichtsplaner – Handoff v3.2

## Status: ✅ Deployed (v3.2)
- **Commit:** 4672e83
- **Datum:** 2026-03-01
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Architektur
- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Store:** `plannerStore.ts` (~850 Zeilen)
- **Hauptkomponenten:** WeekRows (~620 Z.), SequencePanel (~494 Z.), DetailPanel (~670 Z.), Toolbar (~456 Z.)
- **Custom Subtypes:** localStorage key `unterrichtsplaner-custom-subtypes`

## Offene Aufgaben (priorisiert)

### Mittlere Features
1. **Tagesbasierte Spaltenordnung (Mo→Fr)** — Spalten nach Wochentag sortieren. Mehrfachauswahl bei Di+Do intelligent über nicht-nebeneinanderliegende Spalten.
2. **SOL-Anbindung an Kurs** — SOL-Modus in Detailansicht: eigene Details (Thema, Material, Beschreibung, Dauer). SOL-Tag auf Kachel anzeigen.
3. **Mehrtägige Mehrfachauswahl (Di+Do)** — Shift+Klick wählt auch Partner-Spalte an, auch wenn nicht nebeneinander.

### Grössere Redesigns
4. **Einstellungsmenü** — Leerer Start ohne Import möglich:
   - Stundenplan → Kurse hinzufügen/bearbeiten
   - Sonderwochen definieren (inkl. welche Kurse betroffen)
   - Ferien definieren
   - Default-Lektionsdauer
   - Fächer die unterrichtet werden
5. **Sequenzansicht komplett überarbeiten** — Block→Planer-Navigation, Farbhintergrund, Titel-Klick=Details, Di-Do-Anzeige, externe Links
