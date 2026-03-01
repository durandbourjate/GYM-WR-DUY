# Unterrichtsplaner – Handoff v2.9

## Status: ✅ Deployed (v2.9)
- **Commit:** f608659
- **Datum:** 2026-03-01
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Was wurde in v2.9 geändert

### 1. Taxonomiestufen K1–K6 komplett entfernt
- `TaxonomyLevel` Type aus `types/index.ts` entfernt
- Felder `taxonomyLevel` aus `SequenceBlock` und `LessonDetail` entfernt
- `suggestTaxonomyLevel()` und `BLOCK_TYPE_TAXONOMY_MAP` aus `autoSuggest.ts` entfernt
- Taxonomy-Tags aus `HoverPreview` (WeekRows) entfernt
- Taxonomy-Felder aus `DetailPanel` Form + Tags entfernt

### 2. Shift+Klick Bereichs-Selektion (Di+Do-aware)
- `selectRange()` im Store komplett neu implementiert
- Erkennt linked courses (gleiche Klasse+Typ, verschiedene Tage)
- Di → Do oder Do → Di: Beide Tage automatisch eingeschlossen
- Di → Di oder Do → Do: Rückfrage "Auch [anderer Tag] einschliessen?"
- Fallback: Same-column range selection

### 3. Gruppen-Drag&Drop repariert (Multi-Column)
- Drop-Handler in WeekRows.tsx überarbeitet
- Gruppiert Selektion nach Column, berechnet Wochen-Offset
- Verschiebt alle Columns um denselben Offset
- DragOver akzeptiert auch Cross-Column-Drops bei Gruppen-Drag

### 4. Block-Typ Beurteilungen gruppiert
- BLOCK_TYPES aufgeteilt in BLOCK_TYPES_REGULAR + BLOCK_TYPES_ASSESSMENT
- Neues `AssessmentDropdown` Component: "📝 Beurteilung…" Button mit Dropdown
- Enthält: Prüfung, Mündliche Prüfung, Langprüfung, Projektabgabe, Präsentation

### 5. Sequenz-Panel komplett überarbeitet
- Filter-Buttons: "Alle" + je ein Button pro Klasse (29c, 27a28f, 28bc29fs)
- Gruppierung: Klasse → Kurstyp (SF Di+Do, EWR, IN) → Fachbereich → Sequenzen
- Fachbereich-Farben aus SUBJECT_AREA_COLORS
- Alte Kurs-basierte Filterung durch Klassen-basierte ersetzt
- Helfer: `getUniqueClasses()`, `getCourseTypesForClass()`

### 6. Klick auf Titel → Details öffnen
- Titel-div in WeekRows hat eigenen onClick: öffnet DetailPanel
- Kleines ⓘ-Icon nach jedem Titel
- `cursor-pointer` auf Titel-Element

### 7. Escape-Handler erweitert
- Priorität: multiSelection → sidePanelOpen → selection
- Esc löscht zuerst Mehrfachauswahl, dann Panel, dann Einzelauswahl

### 8. Klick ins Leere → Deselektieren
- Empty-Cell-Click ruft `clearMultiSelect()` + `setSelection(null)` vor dem Menü

### 9. Bug-Fix: Variable-Order in WeekRows
- `cellDetail` und `parentBlock` werden jetzt VOR `effectiveSubjectArea` definiert
- Behebt "used before declaration" Fehler

## Architektur (unverändert)
- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Store:** `plannerStore.ts` (~820 Zeilen)
- **Hauptkomponenten:** WeekRows (~585 Z.), SequencePanel (~494 Z.), DetailPanel (~398 Z.), Toolbar (~456 Z.)
- **Daten:** courses.ts (Stundenplan), weeks.ts (Schulwochen), curriculumGoals.ts

## Nächste mögliche Schritte
- User-Testing aller v2.9 Features
- Mehrfachauswahl → neue Sequenz erstellen (Button in MultiSelectToolbar vorhanden, Funktion testen)
- Material-Links-Feld testen (bereits in DetailPanel implementiert)
- Performance-Optimierung (Bundle >500kB Warning)
