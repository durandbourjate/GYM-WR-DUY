# Unterrichtsplaner – Handoff v3.1

## Status: ✅ Deployed (v3.1)
- **Commit:** c82c0d2
- **Datum:** 2026-03-01
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Architektur
- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Store:** `plannerStore.ts` (~830 Zeilen)
- **Hauptkomponenten:** WeekRows (~610 Z.), SequencePanel (~494 Z.), DetailPanel (~664 Z.), Toolbar (~456 Z.)
- **Daten:** courses.ts, weeks.ts, curriculumGoals.ts
- **Custom Subtypes:** localStorage key `unterrichtsplaner-custom-subtypes`

## Offene Aufgaben (priorisiert nach Umsetzbarkeit)

### Schnelle Fixes (aktuell umsetzbar)
1. **Shift+Klick: Sonderwochen/Ferien überspringen** — Bei Shift-Selektion keine Ferien/Events (type 5, 6) anwählen. Bei Drag&Drop diese nicht verschieben.
2. **Shift+Klick: Nur gefüllte Zellen des Kurses** — Shift wählt nur Lektionen. Cmd+Klick erlaubt auch leere Zellen.
3. **Informatik-Farbe grau** — IN in SUBJECT_AREA_COLORS auf grau ändern (aktuell cyan).
4. **Bezeichnung "Untertyp" → "Typ"** — Im CategorySubtypeSelector Label von "Untertyp" auf "Typ" ändern.
5. **Dauer vereinfachen** — Statt 1L/2L/3L: "45 min", "90 min", "135 min", "Halbtag", "Ganztag" + freie Minuten-Eingabe.

### Mittlere Features
6. **Tagesbasierte Spaltenordnung (Mo→Fr)** — Spalten nach Tag sortieren statt nach Course-ID. Mehrfachauswahl bei Di+Do intelligent über nicht-nebeneinanderliegende Spalten.
7. **SOL-Anbindung an Kurs** — In Detailansicht: SOL-Modus aktivierbar mit eigenen Details (Thema, Material, Beschreibung, Dauer). SOL-Tag auf Kachel anzeigen.
8. **Mehrtägige Mehrfachauswahl (Di+Do)** — Shift+Klick erkennt verknüpfte Kurse und wählt auch in der Partner-Spalte an, auch wenn diese nicht nebeneinanderliegt.

### Grössere Redesigns
9. **Einstellungsmenü (Settings)** — Grundlegende Konfiguration:
   - Stundenplan → Kurse hinzufügen/bearbeiten
   - Sonderwochen definieren (inkl. welche Kurse betroffen, Standard alle)
   - Ferien definieren
   - Default-Lektionsdauer
   - Fächer die unterrichtet werden
   → Ermöglicht leeren Start ohne Import

10. **Sequenzansicht komplett überarbeiten**
    - Klick auf Block → markiert im Planer
    - Klick auf KW → wählt Kachel
    - Details ein/ausklappen via Titel-Klick (kein Details-Button)
    - Blöcke mit Farbhintergrund
    - Bei Klick auf Klasse direkt Blöcke auflisten
    - Di-Di / Di-Do / Do-Do Anzeige
    - Externe Links im Block-Detail
