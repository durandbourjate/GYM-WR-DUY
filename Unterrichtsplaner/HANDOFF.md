# Unterrichtsplaner – Handoff v3.85

## Status: ✅ v3.85 — 6/6 Tasks erledigt

---

## Originalauftrag v3.85 — Nachbesserungen aus v3.84

| # | Typ | Beschreibung |
|---|-----|-------------|
| H1 | Bug-fix | G2: Feriendauer-Label falsch — KW 39–41 = 3W, KW 52–01 = 2W (Jahreswechsel) |
| H2 | Bug-fix | G3: Sonderwochen erscheinen noch immer in leeren/gefilterten Spalten |
| H3 | Bug-fix | G5: Toolbar-Icons abgeschnitten bei schmalem Fenster; Einstellungen-Panel nicht scrollbar |
| H4 | UI-fix | G7: «Ohne Vorlage»-Dropdown im «Neuer Planer»-Dialog entfernen |
| H5 | Bug-fix | G8: PW-Badge auch bei gemischten Klassen (z.B. 27a28f) — nur reine TaF-Klassen sollen Badge erhalten |
| H6 | Bug-neu | Einstellungen-Panel: manchmal nicht nach oben scrollbar → Icons und ESC nicht erreichbar |

---

## Task H1: Bug-fix — Feriendauer-Label Berechnung

**Problem:** Das Label zeigt falsche Wochen-Anzahl:
- Herbstferien KW 39–41 → zeigt «4W» statt «3W»
- Weihnachtsferien KW 52–01 → zeigt «3W» statt «2W»

**Korrekte Berechnung:**
- Normalfall: `endKw - startKw + 1` (z.B. 41 - 39 + 1 = 3 ✅)
- Jahreswechsel (endKw < startKw): `(52 - startKw) + endKw + 1` (z.B. 52 - 52 + 1 + 1 = 2 ✅)

**Ursache (Hypothese):** Entweder zählt die Formel falsch (off-by-one), oder die Spalten-Aufteilung (eine KW auf zwei Spalten aufgeteilt) führt dazu dass dieselbe KW doppelt gezählt wird.

**Suche:** Funktion die das `(NW)`-Label berechnet — wahrscheinlich in `WeekRows.tsx`, `plannerStore.ts` oder einem Holiday-Utils-File. Suchbegriff: `startKw`, `endKw`, `W)`, `Wochen`.

**Fix:** Sicherstellen dass:
1. Die Berechnung `endKw - startKw + 1` korrekt ist (kein off-by-one)
2. Jahreswechsel korrekt behandelt wird: wenn `endKw < startKw` → `(52 - startKw + 1) + endKw`
3. Wenn dieselbe KW auf zwei Spalten aufgeteilt ist (geteilte Woche), wird sie nur einmal gezählt

---

## Task H2: Bug-fix — Sonderwochen in gefilterten/leeren Spalten

**Problem:** Wenn ein Fachtyp-Filter aktiv ist (z.B. nur SF), erscheinen Sonderwochen trotzdem in Spalten die durch den Filter ausgeblendet sein sollten (Screenshot zeigt: bei SF-Fokus hat 30s IN eine leere Spalte mit sichtbaren Sonderwochen).

**Erwartetes Verhalten:** Sonderwochen sollen nur in Spalten erscheinen die dem aktiven Filter entsprechen. Ist eine Spalte durch den Filter «leer» (kein Kurs sichtbar), sollen auch Sonderwochen nicht angezeigt werden.

**Ursache (Hypothese aus v3.84):** Das Sonderwochen-Rendering in `WeekRows.tsx` prüft zwar `courseFilter` der Sonderwoche, aber nicht den globalen Fachtyp-Filter (`activeFilter`/`courseTypeFilter`). Die beiden Filter-Ebenen werden nicht kombiniert.

**Fix:** In der Rendering-Logik für Sonderwochen zusätzlich prüfen:
- Ist ein globaler Fokus-Filter aktiv (z.B. SF)?
- Entspricht die aktuelle Spalte diesem Filter (Kurs-Typ === aktiver Filter)?
- Falls nicht → Sonderwoche für diese Spalte nicht rendern

Konkret: Die Bedingung `shouldShowSpecialWeek(col, specialWeek)` muss auch `col.courseType !== activeFilter` (wenn Filter gesetzt) berücksichtigen.

---

## Task H3: Bug-fix — Toolbar Layout bei schmalem Fenster + Panel-Scroll

**Problem A — Toolbar:**
Bei schmalem Browserfenster werden die Icons rechts (Statistik, Einstellungen) abgeschnitten. Screenshot zeigt: Statistik-Icon und Einstellungs-Zahnrad sind kaum/nicht sichtbar.

**Lösung A:**
- Toolbar als `display: flex` mit zwei Bereichen:
  - **Links** (schrumpfbar): `[+] [Alle] [SF] [EWR] [IN] [KS] [TaF] [Suche]` → `flex: 1 1 auto; min-width: 0; overflow: hidden`
  - **Rechts** (fix): `[Statistik] [Einstellungen]` → `flex: 0 0 auto` (schrumpft nie)
- Filter-Buttons und Suche werden bei Platzmangel zusammengestaucht (overflow hidden), aber die Icons rechts bleiben immer sichtbar
- Kopfzeile soll **sticky** sein (`position: sticky; top: 0; z-index: ...`) damit sie beim vertikalen Scrollen des Planers sichtbar bleibt

**Problem B — Einstellungen-Panel nicht scrollbar:**
Das rechte Einstellungen-Panel kann manchmal nicht nach oben gescrollt werden. Icons und der Bereich oben sind dann nicht erreichbar ohne ESC zu drücken.

**Lösung B:**
- Panel-Container: `overflow-y: auto; max-height: 100vh` (oder `height: 100%` je nach Struktur)
- Sicherstellen dass kein übergeordnetes Element `overflow: hidden` setzt das das Scrollen blockiert
- Panel soll immer von oben bis unten scrollbar sein, unabhängig von Viewport-Höhe
- Kein Bereich soll ausserhalb des scrollbaren Bereichs «feststecken»

---

## Task H4: UI-fix — «Ohne Vorlage»-Dropdown entfernen

**Problem:** Im «Neuer Planer erstellen»-Dialog (Screenshot) gibt es eine obere Zeile mit drei Elementen: Name-Eingabe | Schuljahr-Dropdown | **Ohne Vorlage-Dropdown**. Das mittlere Dropdown «Ohne Vorlage» soll entfernt werden.

**Fix:** In `PlannerTabs.tsx` (oder wo der «+»-Tab-Dialog definiert ist): das «Ohne Vorlage»-Dropdown-Element aus dem JSX entfernen. Das Schuljahr-Dropdown und die Name-Eingabe bleiben.

**Resultat:** Dialog zeigt nur noch: `[Name-Eingabe] [Schuljahr-Dropdown]` in der oberen Zeile.

---

## Task H5: Bug-fix — PW-Badge nur bei reinen TaF-Klassen

**Problem:** PW-Badge erscheint auch bei gemischten Klassen wie `27a28f` (hat sowohl Regelklassen-Buchstaben `a` als auch TaF-Buchstaben `f`). Soll aber nur bei reinen TaF-Klassen erscheinen.

**Klassifikation Kursname:**
- **Reine TaF-Klasse:** Buchstaben im Kursnamen sind **ausschliesslich** `f` und/oder `s` (neben Ziffern)
  - Beispiele: `30s`, `29fs`, `28s`, `27f` → ✅ PW-Badge
- **Gemischte Klasse:** Enthält sowohl TaF-Buchstaben (f/s) als auch Regelklassen-Buchstaben (a/b/c/d/e)
  - Beispiele: `27a28f`, `28bc29fs`, `29cf` → ❌ kein PW-Badge
- **Reine Regelklasse:** Buchstaben sind ausschliesslich a/b/c/d/e
  - Beispiele: `29c`, `27a`, `28bc` → ❌ kein PW-Badge

**Erkennungslogik:**
```typescript
function isPureTaF(courseName: string): boolean {
  // Extrahiere nur die Buchstaben (keine Ziffern)
  const letters = courseName.replace(/[^a-zA-Z]/g, '').toLowerCase();
  // Reine TaF: alle Buchstaben sind f oder s
  return letters.length > 0 && /^[fs]+$/.test(letters);
}
```

**Fix:** In der PW-Badge-Logik (G8 aus v3.84) die Bedingung von «enthält f oder s» auf `isPureTaF(courseName)` ändern.

---

## Task H6: Bug-neu — Einstellungen-Panel Scroll-Bug

*(Bereits in H3 Teil B abgedeckt — falls H3 Panel-Fix nicht reicht, hier separat behandeln)*

**Problem:** Beim Öffnen des Einstellungen-Panels (rechte Seite) ist es manchmal nicht möglich, nach oben zu scrollen. Der obere Bereich (Kopfzeile mit Icons, «Schule & Grundeinstellungen» etc.) ist ausserhalb des sichtbaren/scrollbaren Bereichs.

**Ursache (Hypothese):** Das Panel startet mit einem Scroll-Offset der nicht bei 0 beginnt, oder ein übergeordnetes `overflow: hidden` blockiert das Scrollen. Möglicherweise wird das Panel zu einem Zeitpunkt geöffnet wo der Planer selbst gescrollt ist, und das Panel erbt diese Scroll-Position.

**Fix:**
- Panel beim Öffnen immer auf `scrollTop = 0` setzen
- `overflow-y: scroll` (nicht `auto`) auf dem Panel-Container setzen
- Sicherstellen dass `max-height` korrekt gesetzt ist (100vh minus Header-Höhe)
- Kein `position: fixed` Element soll den scrollbaren Bereich überlagern ohne eigenes Scrolling

---

## Ergebnis v3.85

| # | Typ | Beschreibung | Status |
|---|-----|-------------|--------|
| H1 | Bug-fix | Feriendauer-Label: KW 39–41 = 3W, KW 52–01 = 2W | ✅ Berechnung via min/max KW-Nummern statt Set-Size; Jahreswechsel korrekt |
| H2 | Bug-fix | Sonderwochen in gefilterten Spalten | ✅ validEventCols-Map prüft courseFilter/gymLevel; suppressed Events als leer behandelt |
| H3 | Bug-fix | Toolbar Layout + Panel-Scroll | ✅ Toolbar: overflow-hidden + flex-1 Mittelbereich; rechte Icons nie abgeschnitten |
| H4 | UI-fix | «Ohne Vorlage»-Dropdown entfernen | ✅ Dropdown + templateId State + Copy-Logik entfernt |
| H5 | Bug-fix | PW-Badge nur reine TaF-Klassen | ✅ /^[fs]+$/ statt /[fs]/ — gemischte Klassen (27a28f) kein Badge |
| H6 | Bug-neu | Einstellungen-Panel Scroll-Bug | ✅ scrollTop=0 bei Open/Tab-Wechsel; min-h-0 + overflow-y-auto; overflow-hidden vom Container entfernt |

---

## Commit-Anweisung

```bash
npm run build 2>&1 | tail -20
git add -A
git commit -m "fix: v3.85 — Ferienlabel (H1), Sonderwochen-Filter (H2), Toolbar+Panel-Scroll (H3), Vorlage-Dropdown (H4), PW-Badge TaF (H5), Panel-Scroll (H6)"
git push
```

Nach Abschluss: HANDOFF.md Status auf ✅ setzen und Änderungsdetails dokumentieren.

---

## Vorherige Version: v3.84

| # | Typ | Beschreibung | Status |
|---|-----|-------------|--------|
| G1 | Bug | Einzel-Tag-Ferien markieren ganze Woche | ✅ |
| G2 | Bug | Ferienwochen-Label falsch bei aufgeteilten Wochen | ⚠️ → H1 |
| G3 | Bug | Fokus-Filter zeigt Sonderwochen in leeren Spalten | ⚠️ → H2 |
| G4 | UI | ESC schliesst Statistik-Modal nicht | ✅ |
| G5 | UI | Menüleiste rechtsbündig bei verkleinertem Fenster | ⚠️ → H3 |
| G6 | UI | Doppelklick auf Zeilennummer → Ferien-Dialog mit KW vorausgefüllt | ✅ |
| G7 | Feature | «Neuer Planer»-Dialog: vollständiger Setup-Wizard | ⚠️ → H4 |
| G8 | Feature | PW-Badge automatisch bei UE in Prüfungswochen (SF/EF + TaF-Kurs) | ⚠️ → H5 |
