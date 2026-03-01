# Feature-Abgleich: Kommentare vs. Implementierungsstand (v3.29)

Stand: 2026-03-01

## V1 — Grundkonzept

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | Matrix: Spalten=Kurse, Zeilen=DIN-Wochen | ✅ Implementiert (v3.0) |
| 2 | Modulare Felder pro Lektion, gruppierbar (Doppellektionen) | ✅ Sequenzen + Blöcke |
| 3 | Sichtbar wann Unterricht stattfindet, Ausfälle, Ferien, Events | ✅ Farbcode + Typen |
| 4 | Farbcode (Ferien, Ausfälle, Unterricht nach Fach) | ✅ VWL/BWL/Recht/IN Farben |
| 5 | Übersicht: Fachbereich, Überthema, Unterthema | ✅ Kachel-Labels |
| 6 | Details zur Lektion | ✅ DetailPanel |
| 7 | Verschieben mit "Push" (Ferien/fixe Ausfälle bleiben) | ✅ Push-Funktion |
| 8 | Lektionen-Bausteine gruppierbar (Sequenzen) | ✅ Sequenzen |
| 9 | LearningView-Links | ✅ Materiallinks in DetailPanel |
| 10 | Lokale Materialien, Links, Kalendereinträge verlinken | ✅ Materiallinks (lokal/URL) |
| 11 | Bausteine speicherbar für Wiederverwendung über Jahre | ✅ Sammlung-Tab (v3.19) |
| 12 | Verschiedene Ansichten (Jahr, Kurs, Sequenz) | ✅ Zoom 1/2/3 |
| 13 | Mindestanzahl Noten / Vorgaben-Tracking | 🔴 Nicht implementiert |
| 14 | Interaktion mit Schuladmin-Prozessen | 🟡 Google Calendar geplant |

## V2 — UX-Verfeinerungen

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | Überblick über alle 4 Jahre SF | ✅ Zoom 1 Multi-Year |
| 2 | Hilfe-Info bei Mouse-Over auf Buttons | ✅ Tooltips vorhanden |
| 3 | Doppelklick öffnet Lektion-Info | ✅ Doppelklick → DetailPanel |
| 4 | Klick neben Info-Feld schliesst es | ✅ Esc + Klick leere Zelle |
| 5 | Titel = Oberthema & Unterthema | ✅ topic/description in Kachel |
| 6 | Lehrplanbezug automatisch | 🔴 Nicht implementiert (manuell) |
| 7 | Taxonomiestufe automatisch | ❌ Bewusst entfernt (V4: "brauchen wir nicht") |
| 8 | Importierte Lektionen → Blocktyp "Lektion" als Standard | ✅ Default-Typ |
| 9 | Sequenz direkt aus Übersicht öffnen | ✅ Sequenz-Bar Klick/Doppelklick |
| 10 | Sequenz-Fach-Tag automatisch setzen | ✅ Fachbereich-Vererbung |
| 11 | Markiertes in Übersichtsplan hervorheben | ✅ Sequenz-Highlighting |
| 12 | Sequenz-Titel klickbar | ✅ Klick=Highlight, Doppelklick=Edit |
| 13 | Shift+Klick Mehrfachauswahl | ✅ (v3.11) |
| 14 | Command+Klick Mehrfachauswahl | ✅ |
| 15 | Interaktion möglichst im Übersichtsplan | ✅ Inline-Aktionen |
| 16 | Leere Zellen anklickbar und füllbar | ✅ EmptyCellMenu |
| 17 | Gruppe Drag & Drop | ✅ Multi-Select D&D |
| 18 | Klick auf Kachel → Detailansicht | ✅ Doppelklick → Detail |
| 19 | Block-Detail-Menü in Sequenz | ✅ Felder/Lektionen/Reihe Tabs |
| 20 | Ferien/Sonderwochen nicht verschiebbar | ✅ Fixierte Typen |
| 21 | Filter-Buttons in Kopfzeile | ✅ Kurs-Filter (SF/EWR/IN/Alle) |
| 22 | Button "Neue Sequenz" mit Markierung | ✅ EmptyCellMenu + Shift-Select |
| 23 | Ferien/Sonderwochen volle Grösse | ✅ |
| 24 | Sequenz-Button öffnet Block-Menü | ✅ Sequenz-Bar → SequencePanel |
| 25 | Klick/Doppelklick leere Zelle → Menü | ✅ Doppelklick → EmptyCellMenu |
| 26 | Sequenz-Markierung rutscht bei Verschiebung mit | ✅ An Kacheln gebunden |
| 27 | Detail-Menü rechts (Tabs im selben Fenster) | ✅ SidePanel rechts |
| 28 | Alle Spalten gleich breit | ✅ |
| 29 | Buttons (+, Pfeil, i) bei 1x Klick | ✅ → später vereinfacht |
| 30 | Detail-Modal bei Mouse-Over (2s) | ✅ HoverPreview (800ms, v3.17) |
| 31 | Einzelkurs-Ansicht bei Doppelklick Klassenname | ✅ Kurs-Filter |
| 32 | In Sequenz-Menü: Kacheln im Plan bearbeitbar | ✅ Highlighting + Klick→Detail |

## V3 — Farben, Wochentage, Sequenzen

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | Farbcode: VWL/BWL/Recht wie LearningView, IN grau | ✅ (v3.14 Legende, v3.27 Zoom2) |
| 2 | SF am Di/Do, nicht Mi | ✅ Settings-Import korrigiert |
| 3 | SF Di-Do-Di-Do in Sequenzen abbilden | ✅ Mehrtägige Kurse |
| 4 | Sequenznamen unklar (c19, c31) | ✅ Bereinigt (v3.12 FlatBlockCard) |

## V4 — Shift-Select, Blocktypen, Sequenzen

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | Taxonomiestufen nicht nötig | ✅ Entfernt |
| 2 | Shift+Klick Von-Bis-Auswahl | ✅ (v3.11 Cross-Semester) |
| 3 | Mehrfachauswahl Drag & Drop | ✅ (v3.6+) |
| 4 | Blocktyp gruppieren (Beurteilungstypen aufklappbar) | ✅ Kategorie + Typ Hierarchie |
| 5 | Sequenznamen unklar / Übersicht vereinfachen | ✅ FlatBlockCard (v3.12) |
| 6 | Externe Verlinkung in Sequenz-Block-Details | ✅ Materiallinks |
| 7 | Klick auf Block-Titel öffnet Details | ✅ Aufklappbar (v3.12) |
| 8 | Korrekte Wochentage (SF Di/Do, IN Mi) | ✅ |
| 9 | Mehrere Kacheln zu Sequenz zusammenfügen | ✅ "Zu Sequenz hinzufügen" (v3.15) |
| 10 | Esc/Klick deselektiert alles | ✅ (v3.11) |

## V5 — Bugfixes, Blocktyp-Hierarchie

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | Shift+Klick funktioniert | ✅ (v3.11) |
| 2 | Command+Klick stabil | ✅ |
| 3 | Mehrfachauswahl D&D | ✅ |
| 4 | Esc deselektiert alles (inkl. EmptyCellMenu) | ✅ |
| 5 | Doppelklick leere Zelle → Menü (nicht Einfachklick) | ✅ (v3.15) |
| 6 | Einfachklick leere Zelle → Abwählen | ✅ |
| 7 | Blocktyp "Lektion" als Standard | ✅ |
| 8 | Blocktyp + Untertyp (Kategorie/Typ) | ✅ (v3.5+) |
| 9 | Eigene Labels für Blocktyp | ✅ Custom labels möglich |
| 10 | Dauer: 1L/2L + frei definierbar (min) | ✅ Dauer in Minuten |
| 11 | Beschreibungen ausgeschrieben im Detail | ✅ |
| 12 | Klick auf Block in Sequenz → im Plan markiert | ✅ Highlighting |
| 13 | Block-Details aufklappbar in Sequenz | ✅ |
| 14 | Blöcke-Kacheln in Sequenz farbig | ✅ Fachbereich-Farbe |
| 15 | Direkt Blöcke auflisten (keine Vorauswahl Di/Do) | ✅ FlatBlockCard |
| 16 | Bei Block anzeigen ob Di, Do, Di+Do | ✅ Kursbezeichnung sichtbar |
| 17 | Externe Links in Block-Details | ✅ Materiallinks |

## V6 — Shift-Select Verfeinerung, SOL, Settings

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | Shift+Klick und D&D funktionieren | ✅ |
| 2 | Sonderwochen/Ferien bei Shift-Klick überspringen | ✅ |
| 3 | Shift-Klick nur Kurs-Lektionen | ✅ |
| 4 | Ansicht Mo-Di-Mi-Do-Fr | ✅ Spalten nach Wochentag |
| 5 | Mehrtägige Kurse: intelligent beide Spalten anwählen | ✅ |
| 6 | Informatik grau | ✅ |
| 7 | SOL mit Kurs verknüpfen, Tag bei Kachel | ✅ SOL pro Lektion + Σ-Badge (v3.29) |
| 8 | Einstellungsmenü (Kurse, Sonderwochen, Ferien, Dauer) | ✅ SettingsPanel (v3.9) |
| 9 | Dauer: xxmin statt L (45min=1L etc.) + Halbtag/Ganztag | ✅ parseDurationToMinutes (v3.29) |
| 10 | Kategorie → Typ (Umbenennung) | ✅ |

## V7 — Scrolling, Sequenz-UX

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | Scrollen in Menü, nicht im Plan | ✅ Panel scrollt unabhängig |
| 2 | Klick+Drag leere Zellen → Auswahl für Sequenz | ✅ |
| 3 | Klick auf Block-Titel → Details anzeigen | ✅ Aufklappbar |
| 4 | Klick auf Sequenz-Titel → im Plan auswählen | ✅ Highlighting |
| 5 | Klick auf KW-Nummer → Kachel im Plan wählen | ✅ |
| 6 | Materiallinks in Block-Detailansicht | ✅ |
| 7 | Erweiterte Ansicht: Lektionen auflisten mit Grobinfo | ✅ Lektionen-Tab |
| 8 | Tab "Detail" → "Unterrichtseinheit" | ✅ |

## V8 — Terminologie, Zoom 2

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | "Block" → "Sequenz", direktes Auflisten | ✅ FlatBlockCard |
| 2 | Sequenz-Tab: Filter nach Klasse, Fachbereich | ✅ |
| 3 | Innerhalb Sequenz → Details → Einzellektion | ✅ Lektionen-Tab → Klick → Detail |
| 4 | Zoom 2: Kurse vertikal wie Wochenansicht | ✅ ZoomYearView (v3.28) |
| 5 | Sticky Titelzeilen bei Scrollen | ✅ Sticky Header |

## V9 — Kontrast, Batch-Edit, Terminologie-Finalisierung

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | Ansicht zu dunkel, schlecht lesbar | ✅ Kontrast verbessert (v3.24) |
| 2 | Vergangene Wochen aufhellen | ✅ Opacity 0.4→0.6 |
| 3 | Menü heller, mehr Kontrast | ✅ (v3.24) |
| 4 | Bug: Sequenz-Abwahl bei Esc/leere Zelle | ✅ (v3.11) |
| 5 | Falsche Fachbereich-Tags | ✅ suggestSubjectArea + Mismatch-Warnung (v3.13/v3.16) |
| 6 | Shift-Klick über Semesterwechsel | ✅ (v3.11) |
| 7 | Auto-Speichern | ✅ Zustand persistiert automatisch |
| 8 | Batch-Editing Mehrfachauswahl (Fachbereich, Kategorie, Dauer, SOL) | ✅ BatchEditTab (v3.13) |
| 9 | Tab "Sequenzen": Direkt Blöcke auflisten | ✅ FlatBlockCard |
| 10 | Klick auf Sequenz-Titel → Highlight im Plan | ✅ |
| 11 | Aufklappbare Felder/Lektionen/Reihe | ✅ |
| 12 | Fachbereich-Klick: Modal bleibt offen | ✅ Collapse-Fix (v3.14) |
| 13 | Unterrichtsreihe (Reihe-Konzept) | ✅ editierbarer Titel, Zähler (v3.16) |
| 14 | Menü-Panel grösser (4-5 Spalten sichtbar) | ✅ Resize 320–700px (v3.11) |
| 15 | Zoom 2: Alle KW als Zeilen | ✅ ZoomYearView (v3.28) |
| 16 | Zoom 1: "Stoffverteilung" unklar / Ist-Zustand | ✅ Labels Deutsch, ActualDataCard (v3.22) |
| 17 | Neue Sequenz aus Shift-Klick/EmptyCellMenu | ✅ |
| 18 | Kontextmenü nahe bei Zelle | ✅ Bei Cursor-Position (v3.15) |

## V10 — Sammlung, Notiz-Ansicht, Reihe

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | UE zu Sequenz hinzufügen (neue/bestehende) | ✅ (v3.15) |
| 2 | Materialsammlung für Wiederverwendung | ✅ Sammlung-Tab (v3.19) |
| 3 | Tab "Sammlung" | ✅ (v3.19) |
| 4 | Feiertage tracken und blockieren | ✅ (v3.17 + v3.22) |
| 5 | Niederschwelliger Zugang zu Notizen/Details | ✅ Notizen-Spalte (v3.25) + HoverPreview (v3.23) |
| 6 | Aufklappbare Detailspalte pro Kurs | ✅ Notizen-Spalte (v3.25) |
| 7 | Felder/Lektionen/Reihe Tab-Styling | ✅ (v3.14) |
| 8 | Fachbereich-Klick: Modal bleibt offen | ✅ (v3.14) |
| 9 | Unterrichtsreihe: Mehrere Sequenzen zusammenfassen | ✅ Reihe-Konzept (v3.16) |
| 10 | Dauer-Warnung 1L↔2L bei Verschieben | 🟡 Nicht implementiert (erst bei cross-column relevant) |
| 11 | Sequenz-Bar dicker, besser klickbar | ✅ 5px, hover-Effekt (v3.14) |
| 12 | Legende: BWL/VWL/Recht separat, Event grau, Ferien weiss | ✅ (v3.14) |

## V11 — Direkter Notiz-Zugang, Navigation

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | Info-Kachel: Thema+Notizen (Mouse-Over / Detailspalte) | ✅ HoverPreview + Notizen-Spalte |
| 2 | Bug: Doppelklick leere Zelle → Buttons machen nichts | ✅ Gefixt (v3.15) |
| 3 | Klick Sequenz-Balken → Highlight + Bearbeitungsmenü | ✅ Klick=Highlight, Doppelklick=Edit (v3.15) |
| 4 | Tag-Klick → zur Sequenz springen | ✅ (v3.15) |
| 5 | Lektionen-Ansicht: Klick → Detail, schnell zurück | ✅ Tab-Wechsel |

## V12 — Zoom 2, Navigation

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | Zoom 2: Alle KW zeigen | ✅ ZoomYearView (v3.28) |
| 2 | Sequenz-Tag Klick → direkt hinscrollen | ✅ |
| 3 | Klick+Drag leere Felder → Menü + Highlight | ✅ |
| 4 | Klick+Drag auch bei gefüllten Zellen (Shift-Klick) | ✅ Shift-Select |
| 5 | Klick Sequenz aus Zoom 2 → Bearbeitung | ✅ Klick→SequencePanel (v3.28) |
| 6 | i-Symbol bei Kacheln entfernen | ✅ (v3.24) |
| 7 | Einstellungen-Button aktiv | ✅ SettingsPanel (v3.9) |
| 8 | Export/Import in Einstellungen | ✅ (v3.9) |
| 9 | Grauer Text auf dunkel schlecht lesbar | ✅ Kontrast (v3.24) |

## V13 — HoverPreview, Zoom 2, SOL, Kalender

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | Mouse-Over immer sichtbar (auch unten am Bildschirm) | ✅ Positionierung oben/unten (v3.26) |
| 2 | Zoom 2: Felder in Fachbereichsfarbe, Text grösser | ✅ Dark-Mode-Palette, 10px (v3.27) |
| 3 | Zoom 2: Jahr statt Semester, breite/schmale Balken | ✅ ZoomYearView (v3.28) |
| 4 | SOL-Total bei Sequenzen | ✅ Σ-Badge (v3.29) |
| 5 | Google-Kalender im Tool | 🟡 Konzept dokumentiert, nicht implementiert |
| 6 | Details-Toggle-Button grösser | ✅ 📝-Icon, 9px (v3.26) |
| 7 | Notizenbreite anpassbar, breiter Default | ✅ Resizable 80–400px, Default 200px (v3.27) |
| 8 | Notizentext mit Umbrüchen | ✅ whitespace-pre-line (v3.26) |

## V14 — Letzte UX-Wünsche

| # | Feature-Kommentar | Status |
|---|-------------------|--------|
| 1 | Klick leere Zelle → anwählen | ✅ |
| 2 | Klick+Drag leere Zellen → anwählen + optisch hervorheben | ✅ |
| 3 | Nichts angewählt → Detail-Fenster schliesst | 🟡 Teilweise (Panel bleibt oft offen) |
| 4 | Auto-Speichern, "Nicht speichern" statt "Speichern" | ✅ Auto-Persist via Zustand |
| 5 | Zoom 2: Nicht Semester aufteilen, durchgehend nach Kursen | ✅ ZoomYearView (v3.28) |

---

## Zusammenfassung

**Total Feature-Kommentare:** ~130 Punkte über V1–V14
**✅ Implementiert:** ~120
**🟡 Offen / teilweise:**
1. Google Calendar Integration (V13.5, V1.14) — Konzept dokumentiert
2. Dauer-Warnung 1L↔2L bei Verschieben (V10.10) — erst bei cross-column relevant
3. Detail-Fenster schliesst bei Abwahl (V14.3) — teilweise
4. Mindestanzahl Noten / Vorgaben-Tracking (V1.13) — nicht implementiert
5. Lehrplanbezug automatisch (V2.6) — nicht implementiert, manuell

**❌ Bewusst entschieden:**
- Taxonomiestufe automatisch (V2.7) — vom User abgelehnt in V4
