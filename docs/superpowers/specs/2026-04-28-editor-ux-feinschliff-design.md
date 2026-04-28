# ExamLab Editor-UX Feinschliff — Design Spec

> Bundle H: Editor-Vereinheitlichung (Violett-System), Fragetyp-spezifische Cleanups, SuS-Tastaturnavigation, Schülercode-UI-Ausblendung
> Datum: 2026-04-28
> Status: In Review
> Vorgänger: S155 Bundle G.f.2 (Skeleton-Pattern, Merge `623536b`)

---

## Zusammenfassung

Editor-übergreifender Konsistenz-Pass + 4 typ-spezifische Vereinfachungen + SuS-UX-Verbesserungen. Ein **Violett-Pflichtfeld-System** ersetzt heute uneinheitliche Indigo/Emerald-Markierungen und kennzeichnet semantisch „da musst du noch etwas eingeben" — sowohl im Editor (LP) als auch im Übungs-/Prüfungs-Modus (SuS, vor Antwort prüfen). **Sortierung** wird MC-artig vereinfacht, **Bildbeschriftung** verliert die manuellen Koordinaten-Inputs, **Drag&Drop-Bild + Hotspot** verlieren die Form-/Punkte-Count-Indikatoren, **Drag&Drop-Bild** erlaubt zusätzlich Mehrfach-Zone-Akzeptanz desselben Labels mit Pool-Dedupe. **Audio**-Fragetyp wird aus dem Editor-Dropdown ausgeblendet (Backend-Code bleibt für Re-Aktivierung nach Backend-Migration). **SuS-Üben** bekommt Enter/Cmd+Enter-Hotkeys. **Schülercode-Login** wird UI-seitig deaktiviert (Code bleibt im Frontend + Apps-Script).

---

## Scope

**In Scope:**

1. Violett-Pflichtfeld-System (Editor-Hervorhebung, 3 Stufen)
2. Audio-Fragetyp aus Typ-Dropdown ausblenden
3. SuS-Tastaturnavigation (Enter/Cmd+Enter)
4. Drag&Drop-Bild + Hotspot: Form-Indicator + Punkte-Count entfernen
5. Bildbeschriftung: Manuelle Koordinaten-Inputs entfernen
6. Sortierung-Editor: MC-artige UI + Bulk-Paste
7. Drag&Drop-Bild: Pool-Dedupe + Multi-Zone-Akzeptanz
8. SuS-Modus: Zone-Outline-Markierung leerer Zonen / Lücken / Marker
9. Schülercode-Login UI ausblenden

**Out of Scope:**

- Performance-Audit (LP-Üben-Start 20s, SuS-Login 25s) → eigener „Bundle I — Performance" nach Latenz-Mapping
- Audio-Fragetyp Re-Aktivierung (wartet auf Backend-Migration vom Apps-Script)
- Schülercode-Login Code-Removal (frühestens 4–6 Wochen nach Bundle H, wenn keine SuS-Anfragen kommen)
- Drag&Drop-Bild Datenmodell-Migration auf `korrekteLabels: string[]` (1:1 bleibt; Mehrfach-Akzeptanz wird über Pool-Dedupe + String-Match gelöst)
- Globale Editor-Refactors (Datei-Splits, etc.) ausserhalb der oben genannten Punkte

---

## Entscheidungs-Tabelle

| # | Entscheidung | Gewählt | Verworfene Alternativen |
|---|---|---|---|
| A1 | Audio im Editor | Aus Typ-Dropdown filtern, Code/Renderer bleiben | Komplette Entfernung (verfrüht), Feature-Flag (überdesignt für Single-Bool) |
| A2 | Tastatur SuS-Üben | Enter ausserhalb Textarea + Cmd/Ctrl+Enter überall | Nur Enter (kollidiert mit Freitext), nur Cmd+Enter (zu unbekannt) |
| A3 | Zone-Listen-Indikatoren | Form-Icon + Punkte-Count weg | Nur Zahl weg (Icon allein verwirrend), nur Icon weg (Inkonsistent) |
| A4 | Bildbeschriftung Koord-Inputs | x/y-Number-Inputs weg, Maus-only | Behalten (Doppel-Eingabe), Konvertierung in Bewegungs-Pfeile (overengineered) |
| A5 | Pflichtfeld-Hervorhebung | Violett, 3 Stufen, gekoppelt an `pruefungstauglich` | Nur Pflicht/Optional (zu binär), Rot statt Violett (Kollision mit Fehler-Rot) |
| B1 | Schülercode-Login | UI verstecken, Backend bleibt | Code löschen (verfrüht), Server-Side abschalten (kein Rollback-Pfad) |
| B2 | Sortierung-Editor | MC-Pattern + Bulk-Paste-Knopf | Nur Textarea (Status-quo), nur Vorschau-Liste (kein Bulk-Pfad) |
| B3 | Drag&Drop Multi-Zone | Pool-Dedupe + a) Pool-Token bleiben mehrfach nutzbar | Datenmodell auf `korrekteLabels: string[]` migrieren (zu invasiv für aktuelle Nutzung), b) verbrauchbare Tokens mit Vermehrung (UI-komplex) |
| C1 | SuS-Status-Anzeige | Zone-Outline-Pattern (leere Zonen/Lücken violett) | Pool-Hervorhebung (Distraktor-verräterisch), zusätzlich Pool-Häkchen (UI-Lärm) |

---

## 1. Violett-Pflichtfeld-System

### Semantik

> **Violett = „Aufmerksamkeit, hier muss noch etwas hin."**

Das gilt einheitlich:

- **Im Editor (LP):** Pflichtfelder + stark empfohlene Felder, solange sie leer sind
- **Im Üben/Prüfen (SuS, vor Antwort prüfen):** leere Eingabezonen / -lücken / -marker
- **Nach Antwort prüfen (SuS):** Violett verschwindet, Korrektur-Farben (grün/rot/orange) übernehmen

Bestehende uneinheitliche Akzentfarben in den Editoren (Indigo + Emerald in `LueckentextEditor`, Grün/Rot-Badges in MC/RF) werden auf Violett vereinheitlicht, **wo es um „Aufmerksamkeit-Lenkung auf Pflichteingabe" geht**. Die R/F-Buttons selbst bleiben Grün (Richtig) / Rot (Falsch) — das ist semantisch eine andere Achse („Wahrheitswert der Aussage", nicht „hier eingeben").

### Stufen

| Stufe | Verhalten | Speicherung möglich? | Wirkung auf `pruefungstauglich` |
|---|---|---|---|
| **Pflicht** | Violett-Outline auf leerem Feld + Speichern blockiert mit Toast | Nein | Frage gilt automatisch als nicht prüfungstauglich |
| **Empfohlen** | Violett-Outline auf leerem Feld | Ja | Bei mind. einer leeren Empfohlen-Stelle: `pruefungstauglich = false` (auto, nicht überschreibbar bis gefüllt) |
| **Optional** | Keine Hervorhebung | Ja | Kein Einfluss |

### Pflichtfeld-Liste pro Fragetyp

| Fragetyp | Pflicht | Empfohlen | Optional |
|---|---|---|---|
| MC | Frage-Text, ≥2 Optionen mit Text, ≥1 Option als korrekt markiert | Erklärung pro Option, Punkte | Kategorien, Tags |
| Richtig/Falsch | Frage-Text, ≥1 Aussage mit Text, jede Aussage R/F-flagged | Erklärung pro Aussage | wie MC |
| Lückentext | Frage-Text, Text-mit-Lücken, pro Lücke ≥1 korrekte Antwort (Freitext) bzw. ≥2 Dropdown-Optionen + ≥1 als korrekt markiert | — | caseSensitive, Synonyme |
| Sortierung | Frage-Text, ≥2 Elemente | Punkte-Modus (Teilpunkte) | — |
| Zuordnung | Frage-Text, ≥2 Paare beidseitig befüllt | — | — |
| Bildbeschriftung | Frage-Text, Bild-URL, ≥1 Marker mit Position + ≥1 akzeptierter Antwort | Mehrere Marker (sinnvoll bei Aufgabe ≥2) | caseSensitive |
| Drag&Drop-Bild | Frage-Text, Bild-URL, ≥1 Zone mit `korrektesLabel`, alle `korrektesLabel` müssen im Pool vorkommen | Distraktoren im Pool (≥1 für sinnvolle Aufgabe) | — |
| Hotspot | Frage-Text, Bild-URL, ≥1 Bereich | Punktzahl pro Bereich, Erklärung | — |
| Freitext | Frage-Text | Musterlösung, Bewertungsraster | — |
| Berechnung | Frage-Text, Korrekte Antwort | Toleranz, Einheit, Erklärung | — |
| FiBu (Buchungssatz / T-Konto / BilanzER / Kontenbestimmung) | Frage-Text, Lösungs-Daten vollständig | Erklärung | — |

### Visual Spec (Tailwind)

- **Violett-Outline auf leerem Pflicht-/Empfohlen-Feld:**
  `border-violet-400 dark:border-violet-500 ring-1 ring-violet-300 dark:ring-violet-600/40`
- **Auf gefülltem Feld:** Standard-Border (`border-slate-200 dark:border-slate-700`)
- **Pflicht-Section-Header (z.B. „Optionen *"):**
  Asterisk in `text-violet-600 dark:text-violet-400`
- **Speichern-blockiert-Toast:** „Bitte alle Pflichtfelder ausfüllen — sie sind violett markiert."
- **`pruefungstauglich=false`-Badge im Editor-Header (nur LP):**
  Kleiner Hinweis „Nicht prüfungstauglich — siehe violett markierte Felder" (klickbar zum ersten leeren Empfohlen-Feld)

### Implementierungsort

Eine geteilte Validation-Helper-Funktion pro Fragetyp im neuen Modul `packages/shared/src/editor/pflichtfeldValidation.ts`:

```ts
export type FeldStatus = 'pflicht-leer' | 'empfohlen-leer' | 'ok'
export interface ValidationResult {
  pflichtErfuellt: boolean
  empfohlenErfuellt: boolean
  felderStatus: Record<string, FeldStatus>
}
export function validierePflichtfelder(frage: Frage): ValidationResult
```

Editoren konsumieren das Result, mappen `felderStatus[feldKey]` auf die Outline-Klassen. `validierePflichtfelder` läuft auch in `bereinigeFrageBeimSpeichern` und setzt `pruefungstauglich=false` wenn `empfohlenErfuellt=false`. Wenn `pflichtErfuellt=false`: Speichern wird blockiert (Helper liefert Klartext-Liste der Pflicht-leer-Felder, UI zeigt sie im Toast).

---

## 2. Audio-Fragetyp aus Typ-Dropdown ausblenden

**Was:** Im Fragetyp-Auswahl-Komponent (`packages/shared/src/editor/sections/FrageTypAuswahl.tsx` bzw. der Dispatcher in `SharedFragenEditor`) wird `'audio'` aus der Liste der wählbaren Typen entfernt.

**Was bleibt:**

- `AudioFrage`-Komponente und Renderer (`SuS`-Side zeigt schon Info-Box)
- Apps-Script Backend-Felder
- Bestehende Audio-Fragen in der Fragensammlung (falls vorhanden) — werden weiter geladen, aber LP kann beim Bearbeiten nicht zu Audio zurück-wechseln

**Bestandsprüfung:**

- Vor Merge: Im Fragensammlung-Sheet zählen wie viele Fragen `typ='audio'` haben. Memory deutet auf 0 — falls bestätigt, ist nichts weiter zu tun. Falls >0: User entscheidet, ob diese auf einen anderen Typ konvertiert oder belassen werden.

**Code-Änderung Umfang:** ~5 Zeilen (eine `.filter()` im Type-Array).

---

## 3. SuS-Tastaturnavigation

**Aktueller Stand:** [UebungsScreen.tsx](ExamLab/src/components/ueben/UebungsScreen.tsx) Zeile 83–93 hat bereits ←/→-Handler.

**Erweiterung:**

| Taste(n) | Wann | Aktion |
|---|---|---|
| `Enter` (Fokus NICHT in Textarea/Multi-Line-Input) | Frage offen, nicht geprüft | Antwort prüfen |
| `Enter` (Fokus NICHT in Textarea) | Frage geprüft, Feedback sichtbar | Nächste Frage |
| `Cmd/Ctrl + Enter` (überall, auch in Textarea) | Frage offen, nicht geprüft | Antwort prüfen |
| `Cmd/Ctrl + Enter` (überall) | Frage geprüft | Nächste Frage |
| `←` / `→` | wie heute | Navigation |
| `Escape` | optional, falls Modal offen | Modal schliessen (no-op falls keins) |

**Textarea-Erkennung:**

```ts
const istTextarea = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false
  if (el.tagName === 'TEXTAREA') return true
  if (el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'text') {
    // Multi-line via shift+enter erlaubt? Nein, single-line Input — Enter ist OK
    return false
  }
  if (el.isContentEditable) return true  // Tiptap-Editor (Lückentext-Antworten?)
  return false
}
```

**Edge-Cases:**

- Lückentext-Antwort-Inputs sind `<input type="text">`, nicht Textarea → Enter darf prüfen. Aber: User könnte gerade tippen. Lösung: `Enter` prüft NUR wenn alle Eingabefelder gefüllt sind (sonst: Toast „Noch x Lücken offen" + kein Submit).
- Sortierungs-Liste (Drag-Reorder) — keine Eingabe nötig, Enter prüft sofort.
- Drag&Drop-Bild + Hotspot — Mausinteraktion, Enter prüft.
- Freitext + Berechnung — Textarea/Input, Cmd+Enter zum Prüfen.
- Audio — bleibt Mausklick (deaktiviert für SuS sowieso).

**Zusätzlicher visueller Hinweis:** Tooltip am „Antwort prüfen"-Button: „Enter (oder Cmd+Enter im Textfeld)".

---

## 4. Drag&Drop-Bild + Hotspot: Form-Indicator + Punkte-Count entfernen

**Aktueller Stand:**

- `DragDropBildEditor` Zone-Liste: `□ 4 ✕` → Form-Icon (`□` Rechteck, `⬡` Polygon) + Eckpunkte-Count + Löschen
- `HotspotEditor` Bereichs-Liste: identisches Muster

**Änderung:** Form-Icon + Punkte-Count weg. Verbleibend: Zone-Nummer (Index+1) + `korrektesLabel`-Input bzw. `label`-Input + Löschen-X.

**Begründung:** Auf dem Bild sieht man bereits Form (Rechteck vs Polygon-Outline) und Punkte (Eck-Marker). Die Zahlen-Indicator waren Debug-Reste aus der Zeichen-Phase und für die LP nicht relevant.

**Umfang:** ~10–15 Zeilen pro Editor (Zeilen mit `form === 'rechteck' ? '□' : '⬡'` + `{zone.punkte.length}` raus).

---

## 5. Bildbeschriftung: Manuelle Koordinaten-Inputs entfernen

**Aktueller Stand:** Pro Marker zwei `<input type="number">`-Felder für x und y (0–100, %).

**Änderung:** Number-Inputs raus. Koordinaten werden ausschliesslich per Maus gesetzt (Klick aufs Bild = neuer Marker, Drag = verschieben).

**Akzeptierte-Antworten-Feld:** Bleibt, aber der „kommagetrennt"-Hinweis wird vom „pro-Option"-Placeholder zu einer **Section-Header-Beschriftung** verschoben: über der Marker-Liste steht „Marker (Antworten kommagetrennt eingeben)". Pro Input: nur der Inhalt, kein Hinweis-Text mehr.

**Pflichtfeld-Hervorhebung (Punkt 1):** Neuer leerer Marker → Antwort-Input violett umrandet, bis ≥1 Antwort eingetragen.

---

## 6. Sortierung-Editor: MC-artige UI + Bulk-Paste

**Aktueller Stand:** Textarea (1 Zeile = 1 Element) + Vorschau-Liste mit ↑/↓-Buttons.

**Neue UI:**

- Liste von Eingabe-Reihen (wie MC-Optionen):
  - `[Drag-Handle ⋮⋮] [Input-Feld] [✕ Löschen]`
- Knopf unter der Liste: `+ Element hinzufügen`
- Knopf neben „+ Element": `📋 Bulk einfügen` → öffnet kleines Modal mit Textarea („Ein Element pro Zeile") + „Übernehmen". Zeilenumbrüche werden gesplittet, leere Zeilen weggeworfen, neue Elemente hinten angefügt (oder ersetzen die Liste — User-Wahl per Radio im Modal).
- Reihenfolge **ist die Lösung** (der erste Eintrag ist der erste in der korrekten Reihenfolge).
- Drag-Handle zum Umsortieren (mit `@dnd-kit/core`, bereits im Repo via [bilder-in-pools.md](10 Github/GYM-WR-DUY/.claude/rules/bilder-in-pools.md):27 Konvention).

**Vorschau:** Entfällt — die Liste IST die Vorschau.

**Datenmodell:** Unverändert (`elemente: string[]` + `teilpunkte: boolean`).

**Empfohlen-Markierung (Punkt 1):** Liste mit <2 Elementen → Section-Header violett.

**Migration:** Keine — Bestand bleibt funktionsidentisch, nur die Eingabe-UI ändert sich.

---

## 7. Drag&Drop-Bild: Pool-Dedupe + Multi-Zone-Akzeptanz

**Datenmodell:** Bleibt 1:1 (`zone.korrektesLabel: string`). Mehrfach-Akzeptanz entsteht über mehrere Zonen mit demselben `korrektesLabel`-String und Pool-Dedupe in der SuS-Anzeige.

**LP-Editor-Verhalten (unverändert):**

- Pro Zone weiter ein einzelnes `korrektesLabel`-Input
- Pool-Liste wie heute (alle Labels inkl. Distraktoren, kommagetrennt)
- **Neu:** Wenn der LP zwei Zonen mit identischem `korrektesLabel` setzt (z.B. beide „Aktiva"), zeigt der Editor einen dezenten Info-Hinweis: „Dieses Label gilt für 2 Zonen. SuS sehen es einmal im Pool und können es zu beiden ziehen."

**SuS-Anzeige im Pool:**

- Pool-Tokens werden auf eindeutige Strings dedupliziert: `Array.from(new Set(labels))` (case-sensitive Vergleich, leading/trailing-Whitespace getrimmt).
- Pool-Token bleibt auch nach Zuweisung an eine Zone klickbar/draggbar (Variante a, mehrfach nutzbar).

**Drop-Verhalten (SuS):**

- Drop von Token „Aktiva" auf Zone1: setze `antworten[zone1.id] = 'Aktiva'`
- Drop derselben Token-Instanz auf Zone2: setze `antworten[zone2.id] = 'Aktiva'`
- Re-Drop einer Zone (User korrigiert): überschreibt
- „Zurück in den Pool"-Drop: löscht `antworten[zone.id]` (Zone wieder leer → wird violett gemäss Punkt 8)

**Korrektheits-Check (unverändert):**

- Pro Zone: `antworten[zone.id] === zone.korrektesLabel` ?
- Bei `zone.id`-Lookup-Mismatch: nicht korrekt

**Pool-Tokens, die nicht im `korrektesLabel`-Set vorkommen:** Distraktoren — bleiben im Pool, werden nie „verbraucht", optisch nicht von Antwort-Tokens unterscheidbar.

---

## 8. SuS-Modus: Zone-Outline-Pattern für leere Antwort-Stellen

Konsistente Anwendung des Violett-Patterns (Punkt 1) auf den **SuS-Antwort-Modus**, **vor** Antwort prüfen:

| Fragetyp | Was wird violett wenn leer | Was passiert nach Befüllung |
|---|---|---|
| MC | Section um Optionen, wenn keine ausgewählt | Violett verschwindet sobald ≥1 Option markiert |
| RF | jede unbeantwortete Aussage | pro Aussage, sobald R/F gewählt |
| Lückentext | jede leere Lücke (Outline + leichter BG) | sobald getippt |
| Sortierung | nichts (Liste ist immer initial sortiert, kein „leer"-Zustand) | n/a |
| Zuordnung | jedes leere Drop-Ziel | sobald zugeordnet |
| Bildbeschriftung | jedes leere Antwort-Input pro Marker | sobald getippt |
| Drag&Drop-Bild | jede leere Zone-Outline | sobald Label gedroppt |
| Hotspot | nichts (User klickt aufs Bild — keine „leere Eingabe") | n/a |
| Freitext, Berechnung | leeres Input/Textarea | sobald getippt |
| FiBu | leere Eingabe-Zellen | sobald getippt |

**Nach „Antwort prüfen":** Violett verschwindet, Standard-Korrektur-Farben (grün korrekt, rot falsch, orange teilweise) übernehmen.

**Konsistenz mit Editor:** Dieselben Tailwind-Klassen wie unter Punkt 1 (Visual Spec).

**Nicht implementiert:** Pool-Token-Häkchen für „schon mal benutzt" (User-Entscheidung Variante a, kein Pool-Indicator).

---

## 9. Schülercode-Login: UI ausblenden

**Aktueller Stand:**

- Frontend: `src/store/authStore.ts::anmeldenMitCode` (Action) + entsprechender UI-Pfad im SuS-Login-Screen (Code-Input + „Anmelden mit Code"-Button)
- Backend: kein dedizierter Apps-Script-Endpoint — nur Email-Lookup

**Änderung:**

- Im SuS-Login-Screen wird der Code-Input + Code-Button **entfernt** (Component-Conditional oder Block-Removal — entscheidet sich beim Code-Read in der Plan-Phase)
- Frontend-Action `anmeldenMitCode` bleibt im authStore (toter, aber klar markiert mit Kommentar `// S156: UI ausgeblendet, Code für mögliche Re-Aktivierung. Löschen frühestens nach 4-6 Wochen ohne SuS-Anfragen.`)
- Backend: keine Änderung

**Begründung:** SuS haben Schul-Google-Accounts + BYOD. Individualisierung im Üben braucht eindeutige Identität. Code-Login war Anonymitäts-Pfad, nicht mehr nötig.

**Rollback-Pfad:** UI-Block in einer Conditional `if (FEATURE_SCHUELERCODE_LOGIN_UI)` (Compile-Time-Const in `src/featureFlags.ts` o.ä.) — dann reicht ein 1-Zeilen-Toggle für Re-Aktivierung. Alternativ direkter UI-Block-Removal mit Markdown-Notiz im PR.

**Empfehlung:** Direkter Block-Removal + Kommentar im authStore. Feature-Flag-Mechanik einzuführen für ein einziges Feature ist überdesignt; die Aktion ist im Git-History-Revert reversibel.

---

## Datenmodell-Impacts

Keine. Alle Änderungen sind UI-only oder backwards-kompatibel. Insbesondere:

- Sortierung: `elemente: string[]` unverändert
- Drag&Drop-Bild: `zone.korrektesLabel: string` unverändert (Multi-Zone-Akzeptanz über String-Match)
- Bildbeschriftung: `label.position: {x,y}` unverändert (nur Eingabe-Path geändert)
- `pruefungstauglich`: existiert bereits, neue Validation-Helper schreibt automatisch
- Audio: keine Migration

---

## Test-Strategie

### Vitest (Unit + Component)

Pro Editor (8 Editoren): Render-Test mit leerem State + getipptem State, Snapshot der Pflicht-/Empfohlen-Markierung. Validation-Helper-Test pro Fragetyp (Pflicht-Erkennung, Empfohlen-Erkennung, `pruefungstauglich`-Setzen).

Sortierung: Bulk-Paste-Modal-Flow (Eingabe → Übernehmen → Liste-Update + Replace-Modus).

Drag&Drop-Bild: Pool-Dedupe-Logik (3 Zonen mit zwei doppelten Labels → Pool zeigt 2 Buttons), Multi-Zone-Drop-Verhalten, Korrektheits-Check.

SuS-UebungsScreen: Tastatur-Handler (Enter ohne Textarea-Fokus, Enter mit Textarea-Fokus, Cmd+Enter überall, ←/→ unverändert).

Pflichtfeld-Validation: Tabelle aus Punkt 1 → 1 Test-Case pro Zelle (Pflicht erfüllt vs leer × Empfohlen erfüllt vs leer × `pruefungstauglich`-Resultat).

**Erwartung:** ~40–60 neue Tests, Gesamt-Suite weiterhin grün (heute 827).

### E2E-Browser-Test (Chrome-in-Chrome, echte Logins)

Pflicht-Test-Pfade (gemäss [regression-prevention.md](10 Github/GYM-WR-DUY/.claude/rules/regression-prevention.md)):

1. **LP-Editor (alle 8 betroffenen Fragetypen):**
   - Frage anlegen, Pflicht-Felder violett bestätigen
   - Felder füllen, Violett verschwindet
   - Empfohlen-Felder leer lassen, Speichern → `pruefungstauglich=false`-Badge sichtbar
   - Audio-Typ darf nicht im Dropdown erscheinen
   - Drag&Drop-Bild: 2 Zonen mit identischem Label → Info-Hinweis, Pool zeigt 1 Button
   - Sortierung: Bulk-Paste-Knopf öffnet Modal, 5 Zeilen einfügen, übernehmen, Liste füllt sich
2. **SuS-Üben:**
   - Lückentext-Frage starten, leere Lücken violett, ←/→ funktioniert, Cmd+Enter prüft
   - Drag&Drop-Bild: Label wird mehrfach genutzt (2 Zonen), Pool-Token bleibt sichtbar nach erstem Drop
   - Bildbeschriftung: Marker per Klick erstellt, getippte Antwort entfernt Violett
   - Multiple-Choice mit Textarea-Erklärung-Frage offen halten, Enter im Textarea fügt Newline (kein Prüfen), Cmd+Enter prüft
   - Schülercode-Login-Button darf nicht erscheinen, Google-Login funktioniert
3. **Regressions (kritische Pfade aus regression-prevention.md):**
   - SuS lädt Prüfung
   - SuS Heartbeat + Auto-Save
   - SuS Abgabe
   - LP Monitoring
   - LP Korrektur

**Test-Plan-Pflicht:** Vor Browser-Test schriftlicher Test-Plan im Chat (siehe Phase 3.0 in regression-prevention.md).

### Apps-Script-Tests

Nicht nötig — keine Backend-Änderungen.

---

## Risiken

1. **Bestandsfragen mit unvollständigen Empfohlen-Feldern:** Werden nach Bundle H bei nächstem Edit als nicht prüfungstauglich markiert. Falls heute auf solchen Fragen aktive Prüfungen laufen, müsste der LP nachträglich Pflichtfelder ausfüllen. **Mitigation:** Vor Merge ein Audit-Skript (oder manuelle Stichprobe) das die Anzahl betroffener Fragen zählt, dem User vor Merge melden.
2. **Tastatur-Konflikt mit Tiptap/Code-Editor in Freitext:** Tiptap fängt Enter standardmässig für Newlines. Wenn das ContentEditable-Detection (`el.isContentEditable`) sauber implementiert ist, sollte Enter dort niemals prüfen → kein Konflikt. **Verifikation im E2E-Test.**
3. **Schülercode-Login UI-Removal:** Sollte ein SuS sich bisher nur per Code angemeldet haben (kein Google-Account hinterlegt), wäre er ausgesperrt. **Mitigation:** User hat bestätigt, dass alle SuS Google-Accounts haben. Falls Edge-Case auftaucht: Rollback per Git-Revert.
4. **Pool-Dedupe ändert SuS-Wahrnehmung:** Heute zeigt der Pool jedes Label genau einmal — Bestand ist deshalb unbeeinflusst. Aber: wenn ein bestehender Pool **versehentlich** doppelte Labels enthält (LP hat „Aktiva, Aktiva" eingetippt), würden sie heute als 2 Buttons erscheinen, neu als 1. **Migrations-Hinweis:** Vor Merge ein Audit-Skript zählt Drag&Drop-Bild-Fragen mit doppelten Pool-Strings und markiert sie für LP-Review.
5. **Validation-Helper als zentrale Stelle:** Wenn die Definition welche Felder „Pflicht" vs „Empfohlen" sind, sich später ändert, muss die Helper-Tabelle nachgezogen werden. **Mitigation:** Tabelle in Punkt 1 + Test-Cases pro Fragetyp halten die Definition stabil.

---

## Rollout

**Branch:** `feature/editor-ux-feinschliff-bundle-h`

**Apps-Script-Deploy:** Nicht nötig.

**Migrations-Skripte:** Keine, aber zwei Audit-Skripte vor Merge:

- `scripts/audit-bundle-h/zaehleAudioFragen.mjs` (erwartet 0)
- `scripts/audit-bundle-h/zaehleDuplizierteDragDropLabels.mjs` (erwartet 0; falls >0: User entscheidet)

**Merge-Gate:**

- Vitest grün
- `npx tsc -b` grün
- Build grün
- E2E-Test mit echten Logins (LP+SuS) durchgeführt + dokumentiert
- Security-Verifikation (Phase 4 regression-prevention.md)
- LP-Freigabe explizit
- HANDOFF.md aktualisiert

**Schätzung:** 6–8h Implementation in einer Session, plus 1–2h E2E-Test. Subagent-driven-development geeignet wenn Plan klar in unabhängige Tasks zerlegt ist (Validation-Helper, Sortierung, Drag&Drop-Bild, Bildbeschriftung, Tastatur, Schülercode = 6 parallele Tasks).

**Folge-Sessions:**

- **Bundle I — Performance-Audit** (eigener Spec): SuS-Login-Latenz, LP-Üben-Start-Latenz mit Network-Trace + Hebel-Hypothesen
- **Schülercode-Code-Removal** (frühestens 4–6 Wochen nach Bundle H, wenn keine Re-Aktivierungs-Anfragen)

---

## Open Questions

Keine — alle Designentscheidungen wurden im Brainstorming bestätigt. Beim Übergang zur Plan-Phase werden ggf. Klein-Details (z.B. exakte Tailwind-Klassen für Light/Dark, genaue Position des `pruefungstauglich`-Badges) offen — diese gehören in den Plan, nicht den Spec.
