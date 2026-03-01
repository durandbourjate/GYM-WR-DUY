# Unterrichtsplaner – Handoff v3.1

## Status: ✅ Deployed (v3.1)
- **Commit:** 1d8853c
- **Datum:** 2026-03-01
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Was wurde in v3.1 geändert

### Redesign A: Block-Kategorie / Untertyp (zweistufig)
- **Neues Datenmodell:** `blockCategory` (LESSON|ASSESSMENT|EVENT|HOLIDAY) + `blockSubtype` (string)
- **CategorySubtypeSelector:** Visuelle Pill-Auswahl für Kategorie, Untertypen erscheinen darunter
- **Vordefinierte Untertypen:**
  - Lektion → Einführung, Theorie, Übung, SOL, Diskussion
  - Beurteilung → Prüfung schriftlich, Prüfung mündlich, Präsentation, Projektabgabe
  - Event → Exkursion, Tag der offenen Tür, Ausfall, Auftrag
  - Ferien → (keine Untertypen)
- **Custom Labels:** "+" Button pro Kategorie, persistiert in localStorage
- **Migration:** Altes `blockType` wird automatisch gemappt via `getEffectiveCategorySubtype()`
- **Exports:** CATEGORIES, getSubtypesForCategory, getEffectiveCategorySubtype, getCategoryLabel, getSubtypeLabel

### Redesign B: Dauer der Einheit
- Neues `duration` Feld in LessonDetail
- Presets: 1L, 2L, 3L + freie Eingabe ("45min", "90min" etc.)
- Duration-Tag in der Detail-Header-Ansicht

### Redesign C: Beschreibungen ausschreiben
- DetailPanel zeigt volle Labels (Einführung, nicht Einf.)
- `labelShort` verfügbar für Kachel-Anzeige in WeekRows

## v3.0 Bug-Fixes (aus gleichem Deployment)
- Shift+Klick: lastSelectedKey wird bei normalem Klick gesetzt
- Cmd+Klick: Erste Cmd-Selection schliesst aktuelle Einzelauswahl ein
- Leere Zelle: Einfachklick = Deselect, Doppelklick = Menü
- EmptyCellMenu schliesst bei Escape
- Block-Kategorie "Lektion" als Standard bei neuen Kacheln

## Architektur
- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Store:** `plannerStore.ts` (~830 Zeilen)
- **Hauptkomponenten:** WeekRows (~610 Z.), SequencePanel (~494 Z.), DetailPanel (~664 Z.), Toolbar (~456 Z.)
- **Daten:** courses.ts, weeks.ts, curriculumGoals.ts
- **Custom Subtypes:** localStorage key `unterrichtsplaner-custom-subtypes`

## Nächste geplante Schritte (Redesigns aus User-Feedback)

### D. Sequenzansicht komplett überarbeiten
- Klick auf Block in Sequenzansicht → markiert im Planer
- Klick auf KW → wählt diese Kachel im Planer
- Details ein/ausklappen via Klick auf Block-Titel (kein separater Details-Button)
- Blöcke in Sequenzansicht mit Farbhintergrund
- Bei Klick auf Klasse direkt Blöcke auflisten (keine Vorauswahl Di/Do)
- Di-Di / Di-Do / Do-Do Anzeige in Übersichtskachel
- Externe Links im Block-Detail der Sequenzansicht
