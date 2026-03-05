# Unterrichtsplaner – Handoff v3.84

## Status: 🔄 v3.84 — 0/8 Tasks erledigt

---

## Originalauftrag v3.84

| # | Typ | Beschreibung |
|---|-----|-------------|
| G1 | Bug | Einzel-Tag-Ferien (Auffahrt Do, Pfingstmontag Mo) markieren ganze Woche statt nur konfigurierten Tag |
| G2 | Bug | Ferienwochen-Label falsch: aufgeteilte Woche (2 Spalten) wird als 2 Wochen gezählt statt 1 |
| G3 | Bug | Fokus-Filter (z.B. SF): leere Spalten zeigen fälschlicherweise Sonderwochen |
| G4 | UI | ESC schliesst Statistik-Modal nicht |
| G5 | UI | Menüleiste bei verkleinertem Fenster: Icons sollen rechtsbündig sichtbar bleiben |
| G6 | UI | Doppelklick auf Zeilennummer → Ferien-Dialog vorausgefüllt mit dieser KW öffnen |
| G7 | Feature | «Neuer Planer»-Dialog (+Tab) soll vollständiger Setup-Wizard sein wie Erststart |
| G8 | Feature | PW-Badge automatisch bei UE in Prüfungswochen für durchgehende Fächer (SF/EF) in TaF-Kursen |

---

## Task G1: Bug — Einzel-Tag-Ferien markieren ganze Woche

**Problem:** Ferien wie Auffahrt (konfiguriert: KW 20, nur Do) oder Pfingstmontag (KW 22, nur Mo) markieren im Planer die ganze Woche als Ferienblock, obwohl nur ein einzelner Tag konfiguriert ist. Im Tooltip erscheint «Auffahrt (2W)» statt «Auffahrt (1 Tag)» o.ä.

**Ursache (Hypothese):** Die Rendering-Logik unterscheidet nicht zwischen vollständigen Ferienwochen und Einzel-Tag-Einträgen. Wahrscheinlich wird bei `holiday.startKw === holiday.endKw` die ganze Woche als Ferienzeile gerendert, unabhängig davon ob `days`-Filter definiert ist.

**Erwartetes Verhalten:**
- Einzel-Tag-Ferien (wo `days`-Array definiert und < 5 Tage) sollen im Planer **nicht** als vollständige Ferienzeile erscheinen
- Stattdessen: pro betroffener Kurs-Spalte einen einzelnen Ferien-Badge/Marker auf dem entsprechenden Tag zeigen (analog zur bestehenden Tages-Auswahl im Formular)
- Das Ferien-Panel auf der rechten Seite zeigt bereits die `days`-Auswahl korrekt (Mo/Di/Mi/Do/Fr Checkboxen) — diese Logik muss ins Rendering übernommen werden
- Anzahl-Label soll korrekt sein: «1T» für Einzel-Tage, «(2W)» nur für echte Mehrwochen-Ferien

**Suche:** `applySettingsToWeekData`, `renderHolidayRows`, `isHolidayWeek` oder ähnliche Funktionen die bestimmen ob eine Woche als Ferienblock gerendert wird.

---

## Task G2: Bug — Ferienwochen-Label falsch bei aufgeteilten Wochen

**Problem:** Im Jahresplan ist manchmal eine Schulwoche auf zwei Spalten aufgeteilt: z.B. Mi–Fr der KW 39 in einer Spalte, Mo–Di der KW 39 in der nächsten. Diese «halben Wochen» werden bei der Berechnung der Feriendauer als jeweils 1 Woche gezählt, was zu Werten wie «Herbstferien (4W)» oder «Weihnachtsferien (3W)» führt — falsch.

**Korrekte Werte (gemäss Jahresplan SJ 25/26):**
- Herbstferien: KW 39–42 → 4 volle KW, aber wenn die erste oder letzte Woche aufgeteilt ist, korrekt als Bruchteile zählen
- Weihnachtsferien: KW 52–02 → umfasst KW 52 + KW 01 + KW 02

**Ursache (Hypothese):** Die Dauer-Berechnung zählt einfach `endKw - startKw + 1`, ohne zu berücksichtigen, dass eine aufgeteilte Woche (Woche die in 2 Spalten erscheint) als eine Woche zählt, nicht zwei. Im Schulkontext gilt: wenn KW X auf Spalte A endet und Spalte B beginnt, ist das trotzdem 1 KW, nicht 2.

**Lösung:** Beim Berechnen der angezeigten Wochen-Anzahl soll geprüft werden ob `startKw` und `endKw` unter Berücksichtigung der Spalten-Aufteilung korrekt interpretiert werden. Falls die Spalten-Aufteilung («geteilte Woche») im Datenmodell erkennbar ist (z.B. Spalten die dieselbe KW teilen), soll diese Woche nur einmal gezählt werden.

**Hinweis:** Schaue in `plannerStore.ts` oder `settingsStore.ts` nach wie `weekData` und Spalten generiert werden — insbesondere ob es Spalten gibt wo `kw` identisch ist (= geteilte Woche).

---

## Task G3: Bug — Fokus-Filter zeigt Sonderwochen in leeren Spalten

**Problem:** Wenn ein Fachbereich-Filter aktiv ist (z.B. nur SF anzeigen, Screenshot zeigt Fokus «SF»), erscheinen in den **leeren** Spalten (Kurse die nicht SF sind und daher ausgeblendet sein sollten) trotzdem Sonderwochen-Einträge.

**Erwartetes Verhalten:** Wenn eine Spalte durch den Fokus-Filter ausgeblendet/leer ist, sollen auch Sonderwochen in dieser Spalte nicht angezeigt werden. Sonderwochen sollen nur in Spalten erscheinen die dem aktiven Filter entsprechen.

**Suche:** Rendering-Logik für Sonderwochen in `WeekRows.tsx` — prüfen ob Sonderwochen-Rendering den aktiven Fokus-Filter (`courseTypeFilter` o.ä.) respektiert. Wahrscheinlich werden Sonderwochen unabhängig vom Spalten-Filter gerendert.

---

## Task G4: UI — ESC schliesst Statistik-Modal nicht

**Problem:** Das Statistik-Fenster (öffnet via Icon oben rechts) kann nicht mit der ESC-Taste geschlossen werden. Es gibt nur das ✕-Icon.

**Lösung:** `useEffect` + `keydown`-EventListener hinzufügen der bei ESC `onClose()` aufruft. Gilt analog für alle Modals/Overlays falls noch nicht implementiert (Statistik, Einstellungen-Panel, etc.).

**Suche:** `StatisticsModal.tsx` oder ähnliche Komponente — dort `useEffect(() => { const handler = (e) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [onClose]);` ergänzen.

---

## Task G5: UI — Menüleiste rechtsbündig bei verkleinertem Fenster

**Problem:** Bei verkleinertem Browserfenster «bricht» die Menüleiste um oder die Icons auf der rechten Seite (Statistik, Einstellungen etc.) werden abgeschnitten/unsichtbar.

**Erwartetes Verhalten:** Die Menüleiste soll immer rechtsbündig ausgerichtet sein. Bei schmalem Fenster sollen die Icons rechts priorisiert bleiben und sichtbar sein. Wenn nötig, kann der linke Teil (Filter-Buttons, Suche) durch `overflow: hidden` oder `flex-shrink` beschnitten werden.

**Lösung:** In der Toolbar-Komponente:
- Container: `display: flex; justify-content: flex-end; align-items: center;`
- Linker Teil (Filter + Suche): `flex: 1 1 auto; min-width: 0; overflow: hidden;`
- Rechter Teil (Icons): `flex: 0 0 auto;` (schrumpft nie)
- Alternativ: `position: sticky; right: 0` für den Icon-Block

**Suche:** Toolbar/Header-Komponente in `WeekRows.tsx` oder separater `Toolbar.tsx`.

---

## Task G6: UI — Doppelklick auf Zeilennummer öffnet Ferien-Dialog

**Problem:** Es gibt keine Möglichkeit, direkt aus dem Planer heraus eine Ferienperiode für eine bestimmte KW hinzuzufügen. Der Umweg über das rechte Panel ist umständlich.

**Gewünschtes Verhalten:** Doppelklick auf die Zeilennummer (KW-Nummer ganz links in der Planer-Ansicht) öffnet das Ferien-Formular im rechten Panel, mit der entsprechenden KW bereits als `startKw` und `endKw` vorausgefüllt.

**Implementierung:**
1. `onDoubleClick`-Handler auf das KW-Nummern-Element in `WeekRows.tsx`
2. Handler setzt Panel-Zustand auf «Ferien hinzufügen» und füllt `startKw`/`endKw` mit der angeklickten KW vor
3. Das rechte Panel öffnet sich (falls geschlossen) und scrollt zum Ferien-Formular
4. Tooltip on Hover: «Doppelklick: Ferien hinzufügen»

---

## Task G7: Feature — «Neuer Planer»-Dialog: vollständiger Setup-Wizard

**Problem:** Der `+`-Tab-Dialog (Screenshot zeigt: Name-Eingabe + Schuljahr-Dropdown + Vorlage-Dropdown + OK) bietet nicht dieselben Optionen wie der Erststart-Wizard. Insbesondere fehlt die Möglichkeit, Rubriken einzeln zu importieren (Ferien, Sonderwochen, Kurse etc.) bevor der Planer erstellt wird. Ferien werden fix aus dem Schuljahr-Preset übernommen.

**Gewünschtes Verhalten:** Der `+`-Tab-Dialog soll denselben vollständigen Setup-Wizard zeigen wie beim Erststart (WelcomeScreen), d.h.:
- Name-Eingabe
- Schuljahr-Auswahl (SJ 2025/26, 2026/27, 2027/28, Manuell)
- Vorlage-Auswahl (Ohne Vorlage, WR Gym Hofwil, etc.)
- Aufklappbare Sektion «Einzelne Rubriken importieren» mit den 6 Import-Buttons (Schulferien, Sonderwochen, Stundenplan/Kurse, Fachbereiche, Lehrplanziele, Beurteilungsregeln) — **identisch zu WelcomeScreen**
- OK-Button erstellt den Planer mit allen importierten Konfigurationen

**Implementierung:** Den `+`-Tab-Dialog auf denselben Komponenten-Zustand wie `WelcomeScreen` umstellen, oder `WelcomeScreen`-Logik in eine gemeinsame `PlannerSetupForm`-Komponente extrahieren die in beiden Kontexten genutzt wird.

**Suche:** `PlannerTabs.tsx` — dort den `+`-Tab-Handler finden und den dortigen Dialog durch den vollständigen WelcomeScreen-Wizard ersetzen.

---

## Task G8: Feature — PW-Badge automatisch bei UE in Prüfungswochen

**Kontext:** Im Schuljahr gibt es Prüfungswochen (TaF = «Thematische abschlussprüfungen und Fachprüfungen»). Für TaF-Klassen (Kursnamen enthalten `f` oder `s` als letztes Zeichen, z.B. `29c`, `27a28f`, `28bc29fs`) gelten diese Wochen besonders:

- **Phasenfächer** (F, E, D, M, P, B, C, G, GG, EWR, IN, BG — alle im Phasenplan): Prüfungswoche wird als Sonderwoche markiert → kein normaler Unterricht
- **Durchgehende Fächer** (SF = Schwerpunktfach, EF = Ergänzungsfach — **nicht** im Phasenplan): haben auch während Prüfungswochen normalen Unterricht → UE können eingetragen werden
- **Regelklassen** (Kursnamen ohne f/s, z.B. `27a`, `28c`): Prüfungswochen nicht relevant

**Gewünschtes Verhalten:**
Wenn eine UE in eine Prüfungswoche-KW eingetragen wird UND der Kurs ein durchgehendes Fach (SF oder EF) hat UND TaF-Schüler im Kurs sind (Kursname enthält `f` oder `s`), soll automatisch der Badge `PW` zur UE hinzugefügt werden.

**Erkennung TaF-Kurs:**
- Kursname enthält `f` oder `s` als Buchstabe (nicht als Teil von «fs»-Kombination prüfen — `f` oder `s` irgendwo im Namen): `29c` → nein, `27a28f` → ja (`f`), `28bc29fs` → ja (`f`/`s`), `29fs` → ja
- Einfacher: Kursname matcht `/[fs]/i` nach dem Zahlenblock

**Erkennung durchgehendes Fach:**
- Fachtyp der Kurs-Spalte ist `SF` oder `EF` (Badge-Farbe grün/lila)
- Phasenfächer haben andere Typen (VWL, BWL, RECHT, IN, EWR, KS etc.)

**Erkennung Prüfungswoche:**
- Prüfungswochen sind als Sonderwochen mit Label «Prüfungswoche» (oder ähnlich) in `specialWeeks` eingetragen
- Alternativ: eigene Liste der Prüfungswochen-KWs aus den Sonderwochendaten extrahieren

**Implementierung:**
1. Beim Eintragen einer UE (in `plannerStore.ts` `addLesson` oder `updateLesson`): prüfen ob KW eine Prüfungswoche ist, Kurs TaF-Kurs ist, und Fachtyp SF oder EF
2. Falls ja: `badges` Array der UE um `'PW'` ergänzen (falls nicht bereits vorhanden)
3. Badge `PW` soll in den UE-Kacheln neben den bestehenden Badges (SF-Badge etc.) erscheinen
4. Badge-Farbe: dunkelorange oder ähnlich (abweichend von bestehenden Badges)
5. Badge wird **nicht** automatisch entfernt wenn KW-Typ sich ändert — manuelles Entfernen via bestehendem Badge-Mechanismus bleibt möglich

**Phasenplan-Referenz** (für Dokumentation — nicht im Code hardcoden):
Fächer im Phasenplan: F, E, D, M, P, B, C, G, GG, EWR, IN, BG
Durchgehend (nicht im Phasenplan): SF, EF
Die Erkennung erfolgt über den Kurs-Typ (SF/EF Badge), nicht über den Phasenplan-PDF.

---

## Ergebnis v3.84

| # | Typ | Beschreibung | Status |
|---|-----|-------------|--------|
| G1 | Bug | Einzel-Tag-Ferien markieren ganze Woche | ✅ |
| G2 | Bug | Ferienwochen-Label falsch bei aufgeteilten Wochen | ✅ |
| G3 | Bug | Fokus-Filter zeigt Sonderwochen in leeren Spalten | ✅ |
| G4 | UI | ESC schliesst Statistik-Modal nicht | ✅ |
| G5 | UI | Menüleiste rechtsbündig bei verkleinertem Fenster | ✅ |
| G6 | UI | Doppelklick auf Zeilennummer → Ferien-Dialog mit KW vorausgefüllt | ✅ |
| G7 | Feature | «Neuer Planer»-Dialog: vollständiger Setup-Wizard | ✅ |
| G8 | Feature | PW-Badge automatisch bei UE in Prüfungswochen (SF/EF + TaF-Kurs) | ✅ |

---

## Commit-Anweisung

```bash
npm run build 2>&1 | tail -20
rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' \
  /path/to/working/dir/ \
  /Users/durandbourjate/Documents/-Gym\ Hofwil/00\ Automatisierung\ Unterricht/10\ Github/GYM-WR-DUY/Unterrichtsplaner/
git add -A
git commit -m "feat: v3.84 — Ferien-Tagesfilter (G1), Feriendauer-Label (G2), Fokus-Sonderwochen (G3), ESC-Modal (G4), Toolbar-Layout (G5), Doppelklick-KW (G6), Setup-Wizard (G7), PW-Badge (G8)"
git push
```

Nach Abschluss: HANDOFF.md Status auf ✅ setzen und Änderungsdetails dokumentieren.

---

## Ergebnis v3.83

| # | Typ | Beschreibung | Status |
|---|-----|-------------|--------|
| F1 | Bug | Recht fehlt im Semesterbalken (Jahresübersicht) — Case-Mismatch `Recht` → `RECHT` | ✅ |
| F2 | Feature | Sonderwochen: Filterwirkung nach GYM-Stufe und TaF im Planer | ✅ |
| F3 | UX | Sequenzbalken-Klick wählt Sequenz im Detailmenü vor | ✅ |
| F4 | Feature | Separate Importoptionen auf Startseite | ✅ |
| F5 | Data | Sonderwochen-Daten gemäss IW-Plan SJ 25/26 | ✅ |
