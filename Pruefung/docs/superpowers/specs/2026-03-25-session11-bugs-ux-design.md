# Session 11 — Bugfixes, UX-Verbesserungen, Performance

**Datum:** 2026-03-25
**Status:** Approved
**Scope:** 11 Bugs, 6 UX-Verbesserungen, 1 Performance-Ticket

---

## Übersicht

Basierend auf Tests mit der Einrichtungsprüfung v1.0 (Kurs in-28c, 21 SuS) wurden folgende Probleme und Verbesserungswünsche identifiziert. Die Arbeit ist in 3 Blöcke gegliedert: Bugfixes (A), UX-Verbesserungen (B), Performance (C).

---

## Block A: Bugfixes

### B6/B16: Aufgabengruppe Zählung + Navigation (KRITISCH)

**Problem:** Aufgabengruppen mit Teilfragen (z.B. 15a, 15b) werden in der Navigation falsch gezählt. Header zeigt "16/18", aber Frage 16 zeigt Inhalt von 15a. Fragen 17 und 18 fehlen komplett in der Fragenbutton-Leiste. MC-Fragen in Aufgabengruppen werden nicht als "gelöst" markiert.

**Ursache:** Zwei mögliche Quellen für die Index-Verschiebung:
1. **API-Response:** `ladePruefung` könnte `teilaufgabenIds` sowohl als Kinder der Aufgabengruppe ALS AUCH als Top-Level-Einträge in `config.abschnitte[].fragenIds` zurückgeben → doppelte Zählung
2. **Store:** `pruefungStore.fragen[]` könnte sowohl Parent- als auch Child-Einträge enthalten, wobei `FragenNavigation` über `fragenIds` iteriert und die Aufgabengruppe als 1 Button zählt, aber der Index in `fragen[]` verschoben ist

**Audit-Schritte vor Fix:**
- API-Response von `ladePruefung` loggen: Sind `teilaufgabenIds` in `fragenIds` enthalten?
- `pruefungStore.fragen[]` nach Laden prüfen: Wie viele Einträge, sind Teilfragen doppelt?
- `antwortStatus.ts` prüfen: `istVollstaendigBeantwortet()` für Aufgabengruppen — funktioniert die rekursive Prüfung?

**Betroffene Dateien:**
- `apps-script-code.js` — `ladePruefung` Fragen-Auflösung (prüfen ob teilaufgabenIds doppelt geliefert werden)
- `src/store/pruefungStore.ts` — Fragen-Index, `fragen[]` Array-Aufbau
- `src/components/fragetypen/AufgabengruppeFrage.tsx` — Teilfragen-Rendering
- Navigation-Komponente (Fragenbuttons in Sidebar)
- Abgabe-Dialog (Zählung beantworteter Fragen)

**Fix-Strategie:**
- Aufgabengruppe = 1 Frage im Index mit N Teilfragen
- `fragenIds` in `abschnitte` darf NUR Parent-IDs enthalten, NICHT Teilaufgaben
- Navigation zählt Aufgabengruppen als 1 Eintrag
- "Beantwortet"-Status: Aufgabengruppe gilt als beantwortet wenn alle Teilfragen beantwortet
- Header-Counter ("X/Y") muss konsistent mit Navigationsbuttons sein

### B7: Abgabe-Count Mismatch

**Problem:** Navigation zeigt andere Anzahl beantworteter Fragen als der Abgabe-Dialog.

**Ursache:** Zwei separate Probleme:
1. Gleiche Wurzel wie B6/B16 — Aufgabengruppen-Zählung verschoben
2. **Unabhängiger Bug:** `AbgabeDialog` verwendet einfache Truthiness-Prüfung (`!!antworten[f.id]`) statt der strikteren `istVollstaendigBeantwortet()`. Bei Teilantworten (R/F, Lückentext, Berechnung, Zuordnung) zählt der Dialog eine Frage als "beantwortet" sobald irgendein Wert existiert, während die Navigation die vollständige Beantwortung prüft.

**Fix:** Beide Quellen beheben:
1. B6/B16-Fix löst Aufgabengruppen-Problem
2. `AbgabeDialog` muss `istVollstaendigBeantwortet()` verwenden statt `!!antworten[f.id]`

### B8: Button-Feedback SuS-Seite

**Problem:** Buttons "Freischalten" und "Material-Toggle" zeigen kein visuelles Feedback beim Klicken.

**Betroffene Dateien:**
- `src/components/lp/LobbyPhase.tsx` — "Freischalten"-Button (prüfen ob `freischaltenLaedt` bereits als disabled-State genutzt wird)
- Material-Toggle-Komponente

**Fix:** Prüfen ob Loading-States bereits existieren (`freischaltenLaedt` Prop in `DurchfuehrenDashboard`). Falls ja: nur visuelles Feedback vervollständigen. Falls nein: Loading-Spinner oder disabled-State während API-Call, Erfolgs-Feedback danach.

### B9: Material-Icon fehlt

**Problem:** Frage referenziert ein Material-Icon, aber die Prüfungsansicht zeigt es nicht an.

**Fix:** Material-Icon-Rendering in der Fragen-Komponente prüfen. Vermutlich fehlt die Weitergabe des Material-Flags aus der Fragen-Config an die Render-Komponente.

### B10: Zeichnen Text-Tool verschwindet

**Problem:** Beim Zeichnen-Fragetyp erscheint das Textfeld nach Klick auf Text-Tool nur ~0.5 Sekunden und verschwindet dann.

**Betroffene Dateien:**
- `src/components/fragetypen/ZeichnenCanvas.tsx` — Text-Overlay State
- `usePointerEvents.ts` — Canvas Pointer-Handler kollidiert vermutlich mit Text-Input

**Ursache:** `usePointerEvents` registriert `pointerdown` auf dem Canvas. Wenn der Text-Input-Overlay (Sibling-Div über dem Canvas) aktiv ist, feuert der Browser möglicherweise `pointerdown` auf dem darunterliegenden Canvas (v.a. Touch-Devices), was den Text-Mode beendet.

**Fix:**
- `usePointerEvents`: Am Anfang von `handleStart` prüfen `if (textOverlay.sichtbar) return` → Canvas-Events während Text-Eingabe ignorieren
- Text-Input darf erst geschlossen werden bei: Enter, Klick ausserhalb, Escape
- `e.stopPropagation()` auf dem Text-Input sicherstellen

### B11: PDF Text-Annotationen nicht editierbar

**Problem:** Einmal platzierte Text-Annotationen im PDF-Fragetyp können nicht mehr bearbeitet werden.

**Betroffene Dateien:** `src/components/fragetypen/PDFFrage.tsx`, `usePDFAnnotations.ts`

**Fix:** Doppelklick auf bestehende Text-Annotation → Edit-Mode (Cursor im Text, Bearbeitung möglich). Annotation-Auswahl-State in `usePDFAnnotations` erweitern.

### B12: Zeichnen Toolbar vertikal buggy

**Problem:** Die vertikale Toolbar beim Zeichnen-Fragetyp (Bild) hat Layout-Probleme — überlappt oder verschiebt sich (sichtbar im Screenshot).

**Betroffene Datei:** `src/components/fragetypen/ZeichnenToolbar.tsx`

**Ursache:** `flex-1` Spacer in `flex-col` Mode kann Container überlaufen wenn Parent keine feste Höhe hat.

**Fix:** `overflow-y: auto` + `max-height` auf Toolbar-Container (einfacher als absolute Positionierung, kein Parent-Refactor nötig). Toolbar muss neben dem Canvas stehen ohne Überlappung.

### B13: PDF Spiegelung

**Problem:** PDF wurde plötzlich doppelt gespiegelt (oben-unten + links-rechts) und rausgezoomt. Rückgängig war möglich, aber es gibt keinen solchen Button.

**Betroffene Dateien:** `src/components/fragetypen/PDFSeite.tsx`, `PDFViewer.tsx`, ggf. `usePointerEvents.ts` (Touch-Gesture-Handling)

**Ursache (Hypothese):** Touch-Gesture (Pinch-Zoom oder Rotation) hat CSS `transform` mit negativen Scale-Werten gesetzt.

**Fix:**
- Transform-State absichern: Keine negativen Scale-Werte erlauben (clamp auf min 0.1)
- Touch-Events für Rotation unterbinden (nur Pinch-Zoom erlauben)
- Reset-Button oder Doppeltipp zum Zurücksetzen des Transforms

### B14: SuS grün vor Lobby

**Problem:** Schüler sieht grünen "Verbunden"-Text in seinem Wartebildschirm, obwohl LP noch in Vorbereitung ist. Das grüne `text-green-600` für den Heartbeat-Verbindungsstatus sieht visuell wie ein "Bereit/Lobby-offen"-Signal aus.

**Betroffene Datei:** `src/components/sus/Startbildschirm.tsx`

**Fix:** Einfache Farbänderung — "Verbunden — warte auf Freischaltung" Text von `text-green-600` zu `text-blue-600 dark:text-blue-400` ändern. Grün nur verwenden wenn Lobby tatsächlich offen ist. Keine Phase-State-Logik nötig.

### B15: Material nicht volle Höhe

**Problem:** Material-Anzeige nutzt nicht die volle verfügbare Höhe. Unverändert seit letztem Ticket.

**Betroffene Datei:** `src/components/MaterialPanel.tsx` (oder äquivalent)

**Fix:** CSS-Fix für Material-Container: `height: 100%` oder `flex-grow: 1` im übergeordneten Layout. Vermutlich ein fester `max-height` oder fehlendes `overflow-y: auto`.

---

## Block B: UX-Verbesserungen

### U1: Kurs-Auswahl Redesign

**Aktuelle UX:** Kurs anklicken → alle SuS ausgewählt. SuS-Checkboxen nur sichtbar bei angewähltem Kurs. "Alle/Keine" bezieht sich auf alle Kurse. State-Modell: `ausgewaehlteKurse: Set<string>` + `abgewaehlte: Set<string>`.

**Neue UX:**
- **SuS-Checkboxen immer sichtbar** in jedem Kurs (auch wenn Kurs nicht angewählt)
- **Kurs-Checkbox 3 States:**
  - Leer = kein SuS ausgewählt
  - Indeterminate (halb) = einige SuS ausgewählt
  - Voll = alle SuS ausgewählt
- **Klick auf Kurs-Checkbox:** Leer → alle an. Indeterminate/Voll → alle aus.
- **Klick auf einzelne SuS:** Wählt SuS aus/ab, Kurs-Checkbox passt sich an
- **"Alle/Keine" oben:** Bezieht sich auf alle Kurse (alle SuS aller Kurse an/aus)

**Betroffene Dateien:**
- `src/components/lp/KursAuswahl.tsx` — Kompletter Rewrite der Checkbox-Logik
- `src/components/lp/VorbereitungPhase.tsx` — State-Management muss von `ausgewaehlteKurse + abgewaehlte` zu `ausgewaehlteSuS: Set<string>` (Email-basiert) umgebaut werden. API-Breaking Change für die Props-Schnittstelle.

**Implementierung:**
- State-Modell: `ausgewaehlteSuS: Set<string>` (Email-basiert), abgeleiteter Kurs-Status
- Indeterminate-Checkbox: Aktuell custom `<span>` → muss zu echtem `<input type="checkbox">` mit `useRef` + `ref.indeterminate = true` umgebaut werden
- Dies ist ein **Full-Component-Rewrite**, nicht ein kleiner Tweak

### U2: Ergebnisse + Korrektur zusammenlegen

**Aktuelle UX:** 2 separate Tabs "Ergebnisse" und "Korrektur".

**Neue UX:** 1 Tab "Auswertung" mit Accordion:
- **Eingeklappter Bereich oben:** Ergebnis-Übersicht (Statistiken, Abgabezeiten, Export-Buttons)
  - Default: Ausgeklappt wenn keine Korrektur begonnen, eingeklappt wenn Korrektur läuft
- **Darunter:** Korrektur-Dashboard (immer sichtbar)

**Betroffene Dateien:**
- `src/components/lp/DurchfuehrenDashboard.tsx` — Tab-Struktur anpassen (5 → 4 Tabs)
- `src/components/lp/BeendetPhase.tsx` — Wird zu Accordion-Section
- `src/components/lp/KorrekturDashboard.tsx` — Wird Hauptinhalt des neuen Tabs

**Neuer Tab-Key:** `'auswertung'` ersetzt `'ergebnisse'` und `'korrektur'`. Betrifft: `DurchfuehrenTab` Type, `TAB_CONFIG`, `TAB_REIHENFOLGE`, `phaseZuTab()`, `istTabVerfuegbar()`.

**URL-Kompatibilität:** Fallback für bestehende `?tab=ergebnisse` oder `?tab=korrektur` → automatisch auf `auswertung` umleiten.

### U3: Zeitzuschlag inline im Live-Monitoring

**Aktuelle UX:** Separates ZeitzuschlagEditor-Panel (mit `kompakt` Prop) unterhalb der Schülerliste.

**Neue UX:**
- Pro Schüler-Zeile in `AktivPhase.tsx`: Zeitzuschlag-Anzeige
- **Kein Zuschlag:** Kleiner "+5" Button (subtil, grau)
- **Mit Zuschlag:** Anzeige z.B. "+15 Min" mit Edit-Icon
- **Bei Überzeit:** Countdown des Zeitzuschlags: "⏱ +3:42" (wird runtergezählt)
- **Quick-Action:** "+5 Min" Button für schnellen Zuschlag (addiert 5 Min zum bestehenden)
- Klick auf Zeitzuschlag öffnet Mini-Inline-Editor (wie in Vorbereitung)

**Betroffene Dateien:**
- `src/components/lp/AktivPhase.tsx` — Inline-Zeitzuschlag pro Zeile
- `src/components/lp/ZeitzuschlagEditor.tsx` — Refactor zu Inline-Variante

**Layout-Hinweis:** Tabelle hat bereits 7-8 Spalten. Zeitzuschlag als kompakte Spalte (nur "+5" Button + Wert) oder alternativ per Hover/Klick auf Schüler-Zeile einblenden, um Tabellenbreite nicht zu sprengen. `onConfigUpdate` triggert `speichereConfig()` — jeder "+5"-Klick löst einen API-Call aus. Akzeptabel bei Einzelaktionen.

### U4: Farbpalette erweitern

**Aktuelle UX:** Begrenzte Farbauswahl (Schwarz, Rosa, Blau, Grün).

**Neue UX — einfacher Ansatz (kein tool-kontextuelles Switching):**
- Farbpalette erweitern um: Schwarz (Default), Rot, Blau, Grün (kräftig) + Gelb, Rosa, Hellblau, Hellgrün (Pastell)
- Alle Farben immer verfügbar (kein dynamisches Umschalten je nach Tool)
- Schwarz als Default für Text-Tool

**Betroffene Dateien:**
- `src/components/fragetypen/ZeichnenToolbar.tsx` — `verfuegbareFarben` Prop erweitern
- `src/components/fragetypen/ZeichnenFrage.tsx` — Neue Farbliste als Prop übergeben
- `src/components/fragetypen/PDFToolbar.tsx` — Gleiche Farbpalette

### U5: Monitoring-Infos in Lobby

**Aktuelle UX:** Lobby zeigt nur Warteraum-UI, keine Live-Daten.

**Neue UX:** Lobby zeigt:
- Wer ist verbunden (grüner Punkt)
- Gerätetyp (Laptop/Tablet)
- Kontrollstufe
- Kein Fortschritt oder Antworten (Prüfung läuft ja noch nicht)

**Betroffene Datei:** `src/components/lp/LobbyPhase.tsx` — Monitoring-Hook anbinden, reduzierte Tabelle rendern. `SchuelerStatus` Typ hat bereits `geraet`, `kontrollStufe`, `sebVersion`, `status` Felder.

### U6: Demo-Prüfung aktualisieren

**Problem:** Die Einrichtungsprüfung v1.0 bildet nicht alle aktuellen Fragetypen ab.

**Update:** Alle Fragetypen einbauen:
- Freitext, MC, Richtig/Falsch, Lückentext, Zuordnung, Berechnung
- PDF-Frage, Zeichnen/Visualisierung
- Aufgabengruppe mit Teilfragen
- FiBu-Typen (Buchungssatz, T-Konto, Bilanz/ER, Kontenbestimmung)
- Material-Referenz, Material-Icon

**Betroffene Dateien:**
- `src/data/demoFragen.ts` — Neue Demo-Fragen für alle Typen
- `src/components/lp/DurchfuehrenDashboard.tsx` — Inline-Demo-Config (Zeilen ~217-248) aktualisieren

---

## Block C: Performance

### P1: Ladezeit reduzieren

**Problem:** Prüfung laden dauert >1 Minute.

**Analyse nötig:** Profiling um Bottleneck zu identifizieren:
- Apps Script `ladePruefung`: Wie lange dauert Fragen-Auflösung?
- Netzwerk: Wie gross ist die Response?
- Frontend: Wie lange dauert Rendering?

**Mögliche Massnahmen:**
1. **Apps Script:** Batch-Read statt Einzel-Lookups für Fragen, Caching
2. **Daten-Reduktion:** Nur nötige Felder pro Frage laden (nicht gesamte Fragenbank)
3. **Frontend:** Progressive Loading mit Ladebalken, Lazy-Load für schwere Fragetypen
4. **Caching:** IndexedDB-Cache für Fragen (NICHT für Abgaben — diese müssen immer frisch geladen werden, da `abgabenGeladen.current` Guard bereits 1x-Load garantiert)

**Priorität:** Hoch für breiten Einsatz, aber als letzter Block nach Bugfixes und UX.

---

## Priorisierung

1. **B6/B16 + B7** (Aufgabengruppe/Zählung) — Kritisch, betrifft Kernfunktionalität
2. **B10 + B11 + B12** (Zeichnen/PDF Tools) — Hoch, betrifft Fragetypen die nicht nutzbar sind
3. **B13 + B15** (PDF Spiegelung, Material-Höhe) — Mittel
4. **B8 + B9 + B14** (Feedback, Icon, Status) — Mittel, UX-Polish
5. **U1** (Kurs-Auswahl) — Hoch, betrifft Vorbereitung jeder Prüfung
6. **U2** (Tabs zusammenlegen) — Mittel
7. **U3** (Zeitzuschlag inline) — Mittel
8. **U4 + U5 + U6** (Farben, Lobby, Demo) — Niedrig-Mittel
9. **P1** (Performance) — Hoch langfristig, letzter Block
