# Unterrichtsplaner – Handoff v3.0

## Status: ✅ Deployed (v3.0)
- **Commit:** 47009dc
- **Datum:** 2026-03-01
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Was wurde in v3.0 geändert

### 1. Shift+Klick Bereichs-Selektion (Bug-Fix)
- `setSelection()` setzt jetzt automatisch `lastSelectedKey` → Shift+Click hat immer einen Ankerpunkt
- Vorher: normaler Klick setzte `lastSelectedKey` nicht, Shift+Click funktionierte nicht

### 2. Cmd+Klick Mehrfachauswahl (Bug-Fix)
- Erster Cmd+Klick schliesst die aktuelle Einzelselektion automatisch in die multiSelection ein
- Titel-div `onClick` stoppt Propagation NICHT mehr bei Modifier-Keys (Cmd/Shift/Ctrl)
- Vorher: Cmd+Klick auf Titel öffnete Details statt zur multiSelection hinzuzufügen

### 3. Leere Zelle: Einfachklick = Deselect, Doppelklick = Menü
- Einfachklick auf leere Zelle: löscht multiSelection + selection + schliesst EmptyCellMenu
- Doppelklick auf leere Zelle: öffnet "Neue Kachel / Neue Sequenz"-Menü
- Vorher: Einfachklick öffnete sofort das Menü

### 4. Escape-Handler erweitert
- EmptyCellMenu schliesst bei Escape (eigener keydown-Listener)
- App.tsx Escape-Priorität: insertDialog → multiSelection → sidePanel → selection
- Vorher: EmptyCellMenu hatte keinen Escape-Handler, insertDialog wurde nicht geschlossen

### 5. Block-Typ "Lektion" als Standard
- Neue Kacheln via EmptyCellMenu erhalten automatisch `blockType: 'LESSON'`
- DetailPanel zeigt LESSON als Default-Markierung wenn kein blockType gesetzt ist
- Vorher: kein blockType gesetzt, keine Standard-Markierung

## Architektur (unverändert)
- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Store:** `plannerStore.ts` (~830 Zeilen)
- **Hauptkomponenten:** WeekRows (~600 Z.), SequencePanel (~494 Z.), DetailPanel (~409 Z.), Toolbar (~456 Z.)
- **Daten:** courses.ts (Stundenplan), weeks.ts (Schulwochen), curriculumGoals.ts

## Nächste geplante Schritte (Redesigns aus User-Feedback)
Die folgenden Redesigns wurden als User-Feedback gesammelt und sollen in der nächsten Session umgesetzt werden:

### A. Block-Typ / Block-Untertyp (zweistufig)
- **Typ:** Lektion, Beurteilung, Event, Ferien
- **Untertyp je Typ:**
  - Lektion → Einführung, Übung, Theorie, SOL, Diskussion
  - Beurteilung → Prüfung schriftlich, Prüfung mündlich, Präsentation, Projektabgabe
  - Event → Exkursion, Tag der offenen Tür, Ausfall, Auftrag
- Eigene Labels hinzufügbar (persistiert in localStorage)
- Aktuelles flaches `BlockType` muss in zweistufiges System migriert werden

### B. Dauer der Einheit
- Feld mit Vorwahl 1L, 2L + freie Zeiteingabe
- Ermöglicht Mehrlektionen-Prüfungen, halbe Lektionen etc.
- Neues Feld `duration` in LessonDetail (oder SequenceBlock)

### C. Beschreibungen ausschreiben
- In Detailansicht lange Labels (Einführung BWL, nicht Einf. BWL)
- In Kacheln weiterhin kurz

### D. Sequenzansicht komplett überarbeiten
- Klick auf Block in Sequenzansicht → markiert im Planer
- Klick auf KW → wählt diese Kachel im Planer
- Details ein/ausklappen via Klick auf Block-Titel (kein separater Details-Button)
- Blöcke in Sequenzansicht mit Farbhintergrund
- Bei Klick auf Klasse direkt Blöcke auflisten (keine Vorauswahl Di/Do oder Di+Do)
- Di-Di / Di-Do / Do-Do Anzeige in Übersichtskachel
- Externe Links (LearningView, Übungspools) im Block-Detail der Sequenzansicht
