# Visualisierungs-untertyp Removal Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vaporware-Field `untertyp` aus `VisualisierungFrage` und `InlineTeilaufgabe` vollständig entfernen, inklusive zugehöriger Renderer-Gate, Validator-Pflichtcheck, Demo-Daten, Factory- und Konverter-Writes, sowie Tests die das alte Verhalten asserten.

**Architecture:** Reine Refactor-Reduktion. Keine neuen Komponenten, keine Datenmigration. Reihenfolge der Tasks ist bewusst so gewählt, dass jeder Commit individuell tsc-clean ist:
1. Erst alle Konsumenten (Validator, Renderer, Preview) entkoppeln
2. Dann alle Writer (Factory, Demo-Daten, Pool-Konverter, Mock)
3. Zum Schluss das Type-Field selbst — Cascade-tsc dann no-op

**Tech Stack:** TypeScript 5.x, React 19, Vite 5.x, Vitest 4.x, Tailwind CSS v4 (UI), Zustand (State), CodeMirror/Tiptap (Editor) — keine neuen Dependencies.

**Branch:** `refactor/visualisierung-untertyp-drift` (existiert bereits, hat Spec-Commits `75e57d2` + `addc592`).

**Spec:** `docs/superpowers/specs/2026-05-01-visualisierung-untertyp-removal-design.md`

---

## Phase 0 — Pre-Refactor User-Task: Apps-Script-Daten-Audit

**Wer:** User (LP). Manuell im Google Sheet bzw. Apps-Script-Editor.

**Warum:** Ausschluss der Edge-Case-Risiko-Klasse aus der Spec, Section "Risiken" Punkt 1: Gibt es in Storage tatsächlich Visualisierungs-Fragen mit `untertyp: 'diagramm-manipulieren'` oder `untertyp: 'schema-erstellen'`? Erwartet 0. Falls Treffer: Refactor-Stop, separate Klärung.

### Task 0.1: Apps-Script-Audit-Query

**Files:** Keine. User-Aktion im Apps-Script-Editor.

- [ ] **Step 1: Audit-Funktion ins Apps-Script kopieren**

   Im Apps-Script-Editor (für `apps-script-code.js`-Projekt), in einem temporären Scratch-File oder direkt am Ende von `apps-script-code.js`:

   ```javascript
   function auditVisualisierungUntertyp() {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Fragen');
     if (!sheet) { Logger.log('Fragen-Sheet nicht gefunden'); return; }
     const data = sheet.getDataRange().getValues();
     const headers = data.shift();
     // Spalten-Index für typDaten finden (kann typDaten oder daten heissen — User prüft Header)
     const colIdx = headers.findIndex(h => String(h).toLowerCase().includes('typdaten') || String(h).toLowerCase() === 'daten');
     if (colIdx < 0) { Logger.log('typDaten-Spalte nicht gefunden. Header: ' + headers.join(', ')); return; }
     let hits = [];
     data.forEach((row, i) => {
       const td = String(row[colIdx]);
       if (td.indexOf('diagramm-manipulieren') !== -1 || td.indexOf('schema-erstellen') !== -1) {
         hits.push({ rowNum: i + 2, snippet: td.substring(0, 200) });
       }
     });
     Logger.log('=== Audit Visualisierungs-untertyp ===');
     Logger.log('Total Treffer (diagramm-manipulieren oder schema-erstellen): ' + hits.length);
     hits.forEach(h => Logger.log('  Row ' + h.rowNum + ': ' + h.snippet));
   }
   ```

- [ ] **Step 2: Funktion ausführen und Resultat im Logger prüfen**

   - Im Apps-Script-Editor: Funktion `auditVisualisierungUntertyp` auswählen, "Ausführen" klicken
   - Logger öffnen (Ausführungsprotokoll)
   - Erwartung: `Total Treffer: 0`

- [ ] **Step 3: Resultat dem Implementer melden**

   - Falls 0 Treffer: Refactor sicher, Phase 1 starten
   - Falls > 0 Treffer: STOPP — Treffer dokumentieren (welche Frage-IDs, welcher untertyp), inhaltliche Klärung mit User vor Refactor-Fortsetzung

- [ ] **Step 4: Audit-Funktion wieder entfernen**

   Hilfsfunktion war nur für diesen einen Zweck gedacht — aus dem Apps-Script-Code wieder entfernen damit kein toter Code zurückbleibt.

---

## Phase 1 — Frontend-Konsumenten entkoppeln

Drei unabhängige Teil-Refactors. Reihenfolge zwischen ihnen ist beliebig, wichtig ist nur dass alle 3 vor Phase 2 durch sind.

### Task 1.1: Validator-Pflichtcheck entfernen

**Files:**
- Modify: `packages/shared/src/editor/pflichtfeldValidation.ts:449-472`
- Modify: `packages/shared/src/editor/pflichtfeldValidation.test.ts:314-338`

- [ ] **Step 1: pflichtfeldValidation.ts lesen, validiereVisualisierung-Funktion identifizieren**

   ```bash
   sed -n '449,472p' packages/shared/src/editor/pflichtfeldValidation.ts
   ```

- [ ] **Step 2: validiereVisualisierung anpassen**

   In `packages/shared/src/editor/pflichtfeldValidation.ts`:
   - Z. 451 die Zeile `const untertypOk = strNonEmpty(frage.untertyp)` entfernen
   - Z. 458 die Zeile `if (!untertypOk) pflichtLeer.push('Untertyp')` entfernen
   - Z. 466 den `untertyp:`-Eintrag aus dem `felderStatus`-Object entfernen (also den Schlüssel `untertyp` und den Wert `untertypOk ? 'ok' : 'pflicht-leer'` raus)

   Verbleibende Pflichtfelder im Validator: `fragetext`, `konfig` (canvasConfig OR ausgangsdiagramm).

- [ ] **Step 3: Validator-Test entkernen**

   In `packages/shared/src/editor/pflichtfeldValidation.test.ts`:
   - Z. 318: `untertyp: 'zeichnen',`-Property aus dem Mock entfernen — Test bleibt, prüft jetzt fragetext+canvasConfig
   - Z. 326: `untertyp: 'diagramm-manipulieren',`-Property aus dem Mock entfernen — Test bleibt, prüft fragetext+ausgangsdiagramm
   - Z. 331-336 (`it('pflicht-leer ohne untertyp', ...)`): kompletten `it(...)`-Block entfernen — obsolet

- [ ] **Step 4: tsc + vitest für die geänderten Files prüfen**

   ```bash
   cd ExamLab && npx tsc -b && npx vitest run packages/shared/src/editor/pflichtfeldValidation.test.ts
   ```

   Erwartet: tsc clean, alle Tests im pflichtfeldValidation-File grün, kein "pflicht-leer ohne untertyp"-Test mehr im Output.

- [ ] **Step 5: Commit**

   ```bash
   git add packages/shared/src/editor/pflichtfeldValidation.ts packages/shared/src/editor/pflichtfeldValidation.test.ts
   git commit -m "Visualisierung untertyp: validiereVisualisierung Pflichtcheck entfernen"
   ```

### Task 1.2: Renderer-Gate entfernen

**Files:**
- Modify: `ExamLab/src/components/FrageRenderer.tsx:1-50`

- [ ] **Step 1: FrageRenderer.tsx lesen, Sonderfall-Block identifizieren**

   Der zu entfernende Block ist Z. 28-38 (im Body von `fragInhalt`-IIFE, vor dem `const Komponente = …`).

- [ ] **Step 2: Sonderfall-Block entfernen**

   In `ExamLab/src/components/FrageRenderer.tsx`, im `fragInhalt`-IIFE:
   - Den ganzen `if (frage.typ === 'visualisierung') { ... }`-Block (Z. 28-38) entfernen, inklusive der Comment-Zeile darüber (`// Sonderfall: visualisierung/zeichnen — nur Untertyp 'zeichnen' ist implementiert`)
   - `VisualisierungFrage`-Import oben (Z. 3) entfernen — wird nicht mehr referenziert

   Resultierende `fragInhalt`-IIFE besteht dann nur noch aus dem `const Komponente = FRAGETYP_KOMPONENTEN[frage.typ]`-Lookup mit Fallback auf den Platzhalter.

- [ ] **Step 3: tsc verifizieren**

   ```bash
   cd ExamLab && npx tsc -b
   ```

   Erwartet: tsc clean. Kein neuer Vitest-Run nötig (Renderer hat keine direkten Tests, wird über Komponenten-Tests indirekt abgedeckt — die laufen erst in Task 7).

- [ ] **Step 4: Commit**

   ```bash
   git add ExamLab/src/components/FrageRenderer.tsx
   git commit -m "Visualisierung untertyp: FrageRenderer Sonderfall-Gate entfernen"
   ```

### Task 1.3: buildFragePreview Sentinel entfernen

**Files:**
- Modify: `packages/shared/src/editor/buildFragePreview.ts:133-138`
- Modify: `packages/shared/src/editor/buildFragePreview.test.ts:204-214`

- [ ] **Step 1: buildFragePreview.ts visualisierung-Case anpassen**

   In `packages/shared/src/editor/buildFragePreview.ts`, Z. 133-138, den `case 'visualisierung'` ersetzen durch:

   ```ts
   case 'visualisierung':
     return {
       ...basis,
       canvasConfig: s.canvasConfig,
     } as unknown as Frage
   ```

   (Nur die `untertyp: 'frei',`-Zeile fällt weg.)

- [ ] **Step 2: buildFragePreview.test.ts Test anpassen**

   In `packages/shared/src/editor/buildFragePreview.test.ts`, Z. 204-214, den Test `'visualisierung: legt untertyp=frei + canvasConfig ab'` ersetzen durch:

   ```ts
   it('visualisierung: legt canvasConfig ab', () => {
     const cfg = { breite: 800, hoehe: 600, werkzeuge: ['stift'] }
     const f = buildFragePreview({
       typ: 'visualisierung',
       fragetext: 'Zeichne',
       canvasConfig: cfg,
     }) as unknown as VisualisierungFrage
     expect(f.typ).toBe('visualisierung')
     expect(f.canvasConfig).toBe(cfg)
   })
   ```

   (Test-Beschreibung umbenannt, `{ untertyp: string }`-Cast-Erweiterung weg, `expect(f.untertyp).toBe('frei')`-Zeile weg.)

- [ ] **Step 3: tsc + vitest für geänderte Files prüfen**

   ```bash
   cd ExamLab && npx tsc -b && npx vitest run packages/shared/src/editor/buildFragePreview.test.ts
   ```

   Erwartet: tsc clean, Test `'visualisierung: legt canvasConfig ab'` grün.

- [ ] **Step 4: Commit**

   ```bash
   git add packages/shared/src/editor/buildFragePreview.ts packages/shared/src/editor/buildFragePreview.test.ts
   git commit -m "Visualisierung untertyp: buildFragePreview Sentinel entfernen"
   ```

---

## Phase 2 — Writer säubern

Mit den Konsumenten aus Phase 1 weg, schreiben jetzt nur noch ein paar Stellen in das Feld. Alle in dieser Phase.

### Task 2.1: Factory + Mock

**Files:**
- Modify: `packages/shared/src/editor/fragenFactory.ts:71, 205-213`
- Modify: `packages/shared/src/test-helpers/frageCoreMocks.ts:46`

- [ ] **Step 1: fragenFactory.ts Input-Type anpassen**

   Z. 71 — die Property `untertyp?: VisualisierungFrage['untertyp']` aus dem visualisierung-Branch des `typDaten`-Input-Type-Union entfernen. Die Zeile soll nachher lauten:

   ```ts
   | { typ: 'visualisierung'; fragetext?: string; canvasConfig?: CanvasConfig; musterloesungBild?: string }
   ```

- [ ] **Step 2: fragenFactory.ts Body anpassen**

   Z. 205-213, im `case 'visualisierung'`-Branch — die Zeile `untertyp: typDaten.untertyp || 'zeichnen',` (Z. 209) entfernen. Resultat:

   ```ts
   case 'visualisierung':
     return {
       ...basis,
       typ: 'visualisierung',
       fragetext: typDaten.fragetext?.trim() || '',
       canvasConfig: typDaten.canvasConfig,
       musterloesungBild: typDaten.musterloesungBild,
     } as VisualisierungFrage
   ```

- [ ] **Step 3: frageCoreMocks.ts Mock anpassen**

   In `packages/shared/src/test-helpers/frageCoreMocks.ts:46` die Visualisierungs-Mock-Definition ersetzen durch:

   ```ts
   visualisierung: { fragetext: 'Test-Frage' } as Omit<VisualisierungFrage, keyof FrageBase | 'typ'>,
   ```

   (Property `untertyp: 'zeichnen'` weg.)

- [ ] **Step 4: tsc verifizieren**

   ```bash
   cd ExamLab && npx tsc -b
   ```

   Erwartet: tsc clean. Achtung: VisualisierungFrage hat in dieser Phase noch das `untertyp`-Field. tsc sollte trotzdem grün sein, weil der Mock den `Omit`-Cast verwendet und das Field optional ist im `Omit`-Result (oder TypeScript es nicht als zwingend-fehlend flaggt — Frage-Type-Vertrag ist Pflicht-Field, aber das `as`-Cast bypasst). Falls tsc hier doch flaggt, im Mock vorübergehend `untertyp: 'zeichnen' as never` oder `untertyp: undefined as unknown as 'zeichnen'` einsetzen — wird in Task 3.1 sowieso obsolet.

- [ ] **Step 5: Commit**

   ```bash
   git add packages/shared/src/editor/fragenFactory.ts packages/shared/src/test-helpers/frageCoreMocks.ts
   git commit -m "Visualisierung untertyp: Factory-Input + Mock bereinigen"
   ```

### Task 2.2: Demo-Daten + Pool-Konverter

**Files:**
- Modify: `ExamLab/src/data/einrichtungsFragen.ts:328`
- Modify: `ExamLab/src/data/einrichtungsUebungFragen.ts:607`
- Modify: `ExamLab/src/utils/poolConverter.ts:585`

- [ ] **Step 1: Demo-Daten und Pool-Konverter bereinigen**

   In allen 3 Files die jeweilige Zeile `untertyp: 'zeichnen',` entfernen:

   - `ExamLab/src/data/einrichtungsFragen.ts:328` — komplette Zeile inkl. Komma weg
   - `ExamLab/src/data/einrichtungsUebungFragen.ts:607` — komplette Zeile inkl. Komma weg
   - `ExamLab/src/utils/poolConverter.ts:585` — komplette Zeile inkl. Komma weg

- [ ] **Step 2: tsc verifizieren**

   ```bash
   cd ExamLab && npx tsc -b
   ```

   Erwartet: tsc clean. Wenn nicht: VisualisierungFrage hat in dieser Phase noch `untertyp` als Pflicht-Field, und `einrichtungsFragen.ts`/`einrichtungsUebungFragen.ts` sind explizit als `VisualisierungFrage` typisiert. tsc würde dann „untertyp fehlt"-Errors werfen. In dem Fall: diese Tasks 2.1+2.2 bündeln mit Task 3.1 in einem einzigen Commit, denn Type-Refactor und Writer-Cleanup hängen voneinander ab.

   **Implementer-Hinweis:** Wenn Step 2 hier rote Errors wirft, einfach weitermachen zu Task 3.1 — der Type-Cleanup räumt sie auf. Dann am Ende von Task 3.1 EINEN gemeinsamen Commit für Tasks 2.1+2.2+3.1 machen statt drei einzelne. Anpassung der Commit-Sequenz, sonst sauberer Plan.

- [ ] **Step 3: Commit (falls Step 2 grün)**

   ```bash
   git add ExamLab/src/data/einrichtungsFragen.ts ExamLab/src/data/einrichtungsUebungFragen.ts ExamLab/src/utils/poolConverter.ts
   git commit -m "Visualisierung untertyp: Demo-Daten + Pool-Konverter bereinigen"
   ```

---

## Phase 3 — Type-Field entfernen

### Task 3.1: VisualisierungFrage + InlineTeilaufgabe Interface bereinigen

**Files:**
- Modify: `packages/shared/src/types/fragen-core.ts:171-178`
- Modify: `packages/shared/src/types/fragen-core.ts:454-462`

- [ ] **Step 1: VisualisierungFrage-Interface bereinigen**

   In `packages/shared/src/types/fragen-core.ts:171-178`, die Zeile 173 entfernen:

   ```ts
   untertyp: 'zeichnen' | 'diagramm-manipulieren' | 'schema-erstellen';
   ```

   Resultierendes Interface:

   ```ts
   export interface VisualisierungFrage extends FrageBase {
     typ: 'visualisierung';
     fragetext: string;
     ausgangsdiagramm?: DiagrammConfig;
     canvasConfig?: CanvasConfig;
     musterloesungBild?: string;
   }
   ```

- [ ] **Step 2: InlineTeilaufgabe.untertyp entfernen**

   In `packages/shared/src/types/fragen-core.ts:454-462`, die Zeile 456 entfernen:

   ```ts
     untertyp?: string
   ```

   Auch die `// Visualisierung/Zeichnen`-Comment-Zeile direkt darüber (Z. 455) entfernen, weil sie nach diesem Cleanup nur noch auf die zwei verbliebenen Felder `canvasConfig` und `musterloesungBild` zeigt — Comment sollte beide referenzieren oder weg. Empfehlung: weg, redundant da Field-Namen selbsterklärend sind.

- [ ] **Step 3: tsc -b verifizieren**

   ```bash
   cd ExamLab && npx tsc -b
   ```

   Erwartet: tsc clean (kein Konsument liest mehr `frage.untertyp` für Visualisierung dank Phase 1+2).

   **Falls tsc Errors wirft, die NICHT zu den in der Spec gelisteten 11 Files gehören:** Stopp — neue Konsumenten gefunden, die im Audit (Spec rev2) nicht erfasst waren. Dem User melden, Spec aktualisieren, ob im Plan zu adressieren oder als separate Story.

- [ ] **Step 4: Commit**

   ```bash
   git add packages/shared/src/types/fragen-core.ts
   git commit -m "Visualisierung untertyp: Type-Field aus VisualisierungFrage + InlineTeilaufgabe entfernen"
   ```

---

## Phase 4 — Voll-Verifikation

### Task 4.1: Alle Gates lokal grün

**Files:** Keine. Reine Verifikation.

- [ ] **Step 1: TypeScript-Build**

   ```bash
   cd ExamLab && npx tsc -b
   ```

   Erwartet: kein Output (clean).

- [ ] **Step 2: Vitest-Suite (komplett)**

   ```bash
   cd ExamLab && npx vitest run
   ```

   Erwartet: Alle Tests grün, ein Test weniger als vorher (`'pflicht-leer ohne untertyp'` ist jetzt entfernt). Erwartet: 1126 passes (oder 1125 falls .todo unverändert).

- [ ] **Step 3: Vite-Build**

   ```bash
   cd ExamLab && npm run build
   ```

   Erwartet: `✓ built in X.XXs` ohne Errors. Warnings für Chunk-Size sind OK (existieren schon).

- [ ] **Step 4: as-any-Audit (CI-Gate)**

   ```bash
   cd ExamLab && npm run lint:as-any
   ```

   Erwartet: `Total: 0`, `Defensive (OK): 0`, `Undokumentiert (FAIL): 0`. (Gleicher Stand wie auf main vor Refactor.)

- [ ] **Step 5: User-Status-Update**

   Dem User melden: Phase 4 grün, bereit für Staging-Deploy.

---

## Phase 5 — Staging-Deploy + Browser-E2E

### Task 5.1: Force-Push auf preview

**Files:** Keine, Git-Operation.

- [ ] **Step 1: Preview-WIP-Check (Lehre `feedback_preview_forcepush.md`)**

   ```bash
   git fetch origin preview
   git log origin/preview ^refactor/visualisierung-untertyp-drift --oneline
   ```

   Erwartet: leer (preview hat keine Commits, die nicht im Refactor-Branch sind).

   Falls Output: STOPP — preview hat WIP, mit User klären (kann gemerged oder verworfen werden, abhängig von Inhalt).

- [ ] **Step 2: Branch nach preview pushen**

   Da preview immer hard-overwritten wird:

   ```bash
   git push --force-with-lease origin refactor/visualisierung-untertyp-drift:preview
   ```

   `--force-with-lease` schützt vor Race-Bedingung (Push wird abgebrochen falls preview seit dem Fetch in Step 1 verändert wurde).

- [ ] **Step 3: GitHub-Actions-Deploy abwarten**

   Polling per `curl` auf `last-modified`-Header der staging index.html, bis sie sich gegenüber Pre-Push-Stand ändert:

   ```bash
   PRE=$(curl -sI "https://durandbourjate.github.io/GYM-WR-DUY/staging/index.html?cb=$(date +%s)" | grep -i '^last-modified:' | tr -d '\r')
   echo "Pre-Deploy: $PRE"
   until [ "$(curl -sI "https://durandbourjate.github.io/GYM-WR-DUY/staging/index.html?cb=$(date +%s)" | grep -i '^last-modified:' | tr -d '\r')" != "$PRE" ]; do sleep 15; done
   echo "Deploy fertig: $(curl -sI "https://durandbourjate.github.io/GYM-WR-DUY/staging/index.html?cb=$(date +%s)" | grep -i '^last-modified:')"
   ```

   Background-Job mit `run_in_background: true` und Timeout 300000ms (5 min, üblicher GitHub-Actions-Run).

### Task 5.2: Browser-E2E mit echten Logins

**Files:** Keine. Browser-Test mit Chrome-MCP.

**Voraussetzung:** Tab-Gruppe mit 2 Tabs:
- Tab 1: LP `wr.test@gymhofwil.ch` auf `/staging/`
- Tab 2: SuS `wr.test@stud.gymhofwil.ch` auf `/staging/sus`

User loggt manuell ein, danach „kannst loslegen" o.ä.

- [ ] **Test E2E-1: LP-Editor neue Visualisierungs-Frage anlegen**

   1. Tab 1 (LP) → Fragensammlung → "+ Neue Frage"
   2. Fragetext eingeben (z.B. „Test Visualisierung")
   3. Thema setzen (Pflichtfeld)
   4. Fragetyp: „Zeichnen" (Bilder & Medien-Sektion)
   5. Im Editor: Canvas-Config setzen (z.B. ein Werkzeug aktivieren)
   6. „Speichern" klicken
   
   **Erwartet:** Speichert ohne Fehler-Banner mit „Untertyp"-Mention. Frage erscheint in Liste.
   
   **Failure-Mode:** Falls Banner mit „Untertyp" erscheint → Validator nicht sauber bereinigt, Refactor-Stop.

- [ ] **Test E2E-2: LP-Editor bestehende Visualisierungs-Frage öffnen**

   1. Tab 1 (LP) → Fragensammlung → Filter „Typ = Zeichnen"
   2. Eine bestehende Frage öffnen
   
   **Erwartet:** Editor lädt, Canvas-Config wird angezeigt.
   
   **Failure-Mode:** Crash oder leerer Editor → Reader-Pfad für untertyp irgendwo nicht entkoppelt.

- [ ] **Test E2E-3: SuS-Üben Visualisierungs-Frage rendern**

   1. Tab 2 (SuS) → Üben-Tab → Thema mit Visualisierungs-Frage öffnen (oder Mix-Übung)
   2. Bis zur Visualisierungs-Frage navigieren (oder Filter „Typ" falls vorhanden)
   
   **Erwartet:** Canvas erscheint, Werkzeuge funktionieren. **KEIN „wird in einer späteren Phase implementiert"-Platzhalter.**
   
   **Failure-Mode:** Platzhalter erscheint → Renderer-Gate nicht sauber entfernt.

- [ ] **Test E2E-4: Konsole + Network sauber**

   ```js
   // Per Chrome-MCP javascript_tool:
   // Read console for errors
   ```

   Erwartet: Keine roten Errors die mit dem Refactor zusammenhängen. Bekannte Apps-Script-Latenz-Warnings + GitHub-Pages-CDN-Hinweise OK.

- [ ] **Step 5: User-Freigabe einholen**

   Test-Resultate dem User zusammenfassen. Auf „Merge OK" oder „Freigabe" warten.

---

## Phase 6 — Merge auf main

### Task 6.1: Merge + Push + Cleanup

**Files:** Keine, Git-Operation.

- [ ] **Step 1: Auf main wechseln und up-to-date**

   ```bash
   cd "<repo-root>" && git checkout main && git pull --ff-only origin main
   ```

- [ ] **Step 2: Branch mergen (no-ff für History)**

   ```bash
   git merge --no-ff refactor/visualisierung-untertyp-drift -m "Merge refactor/visualisierung-untertyp-drift

   Visualisierungs-Frage untertyp-Field vollständig entfernt — Vaporware-
   Cleanup nach User-Bestätigung im Brainstorming.

   Spec: docs/superpowers/specs/2026-05-01-visualisierung-untertyp-removal-design.md
   E2E auf staging mit echten Logins bestanden (LP-Editor + SuS-Üben).

   Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
   ```

- [ ] **Step 3: Push main**

   ```bash
   git push origin main
   ```

- [ ] **Step 4: Branch local + remote löschen**

   ```bash
   git branch -d refactor/visualisierung-untertyp-drift
   git push origin --delete refactor/visualisierung-untertyp-drift
   ```

### Task 6.2: HANDOFF.md aktualisieren

**Files:**
- Modify: `ExamLab/HANDOFF.md` (Top-Section)

- [ ] **Step 1: HANDOFF lesen**

   Die ersten ~50 Zeilen lesen, um die neueste Section-Struktur zu verstehen. Aktuell: "Post-Bundle-L Spawn-Task-Cleanups ✅ MERGED (01.05.2026)" als Top-Section.

- [ ] **Step 2: HANDOFF aktualisieren**

   Entweder:
   (a) Eine NEUE Section über der aktuellen Top-Section einfügen mit Datum, Branch, Merge-Commit, Test-Plan-Resultaten und Lehre-Verweis
   (b) Die existierende "Post-Bundle-L Spawn-Task-Cleanups"-Section um einen 3. Bullet-Point für die Visualisierungs-Drift erweitern (wäre konsistenter, weil sie thematisch zur Drift-Cleanup-Welle gehört)

   Empfehlung: (b). Im Bullet 2 ("`refactor/build-frage-preview-field-drift`") wird derzeit der Punkt "NICHT in diesem Bundle: Visualisierungs-Drift" erwähnt — den durch eine neue Bullet-Point-Sub-Section "Nachgereicht durch `refactor/visualisierung-untertyp-drift` am 2026-05-01 — siehe Punkt 3" ersetzen, neuen Bullet-Point 3 einfügen.

- [ ] **Step 3: Commit + Push**

   ```bash
   git add ExamLab/HANDOFF.md
   git commit -m "HANDOFF: Visualisierungs-untertyp-Removal dokumentiert"
   git push origin main
   ```

### Task 6.3: Memory-File anlegen

**Files:**
- Create: `/Users/durandbourjate/.claude/projects/-Users-durandbourjate-Documents--Gym-Hofwil-00-Automatisierung-Unterricht/memory/project_visualisierung_untertyp_removal.md`
- Modify: `/Users/durandbourjate/.claude/projects/-Users-durandbourjate-Documents--Gym-Hofwil-00-Automatisierung-Unterricht/memory/MEMORY.md` (Index)

- [ ] **Step 1: Memory-File schreiben**

   Inhalt analog zu `project_post_bundle_l_cleanups.md`: Datum, Branch, Merge-Commit, Scope (11 Files), Verifikation, Lehre für `code-quality.md` (Vaporware-Type-Union-Anti-Pattern).

- [ ] **Step 2: Index in MEMORY.md ergänzen**

   In der ExamLab-Sektion oben einen neuen Bullet einfügen:

   ```markdown
   - **[Visualisierungs-untertyp-Removal auf main](project_visualisierung_untertyp_removal.md)** — 01.05.2026. Letzter Spawn-Task aus Bundle L.c (Visualisierungs-Drift-Cleanup) abgearbeitet. ...
   ```

   Den existierenden "Post-Bundle-L Spawn-Task-Cleanups"-Bullet entsprechend ergänzen oder verknüpfen.

---

## Phase 7 — Code-Quality.md Lehre eintragen (optional, kann auch separat)

### Task 7.1: code-quality.md ergänzen

**Files:**
- Modify: `.claude/rules/code-quality.md` (Repo, nicht Memory)

- [ ] **Step 1: Lehre an passender Stelle einfügen**

   Aus Spec-Lehre-Section übernehmen:

   ```markdown
   ## Vaporware-Type-Union-Werte vermeiden (Visualisierung untertyp, 01.05.2026)

   **Problem:** Type-Union-Werte für noch-nicht-implementierte Modi vorab in der Type-Definition platzieren führt zu Architektur-Drift:
   - Validator wird auf Pflicht-Check getrimmt → Schreiber muss Sentinel liefern → Compat-Cast nötig
   - Renderer wächst Gate-Code für unimplementierte Pfade
   - Storage-Vertrag wird nicht eingehalten (`speichereJetzt` ignoriert die Pflicht)
   - Cleanup zieht 11 Stellen über mehrere Files

   **Konkret aufgetreten:** `VisualisierungFrage.untertyp = 'zeichnen' | 'diagramm-manipulieren' | 'schema-erstellen'` — nur 'zeichnen' real implementiert, andere 2 nie gebaut.

   **Regel:** Type-Union-Werte für noch-nicht-implementierte Modi NICHT in der Type-Definition vorab platzieren. Stattdessen:
   - Solange nur 1 Modus existiert: gar kein Discriminator-Feld
   - Wenn ≥2 Modi geplant aber noch nicht alle gebaut: Type-Union mit nur den **realisierten** Werten; ergänze später im selben PR wie die Implementation

   Antimuster: Type-Union-Werte als TODO-Liste im Schema statt als Backlog-Ticket. Schemas sind keine Roadmap.
   ```

- [ ] **Step 2: Commit + Push**

   ```bash
   git add .claude/rules/code-quality.md
   git commit -m "code-quality.md: Vaporware-Type-Union-Lehre aus Visualisierungs-untertyp-Refactor"
   git push origin main
   ```

---

## Out-of-Scope-Reminder

Diese Punkte aus der Spec werden in diesem Plan **nicht** adressiert:

- **Apps-Script Backend-Writer** (4 Stellen) — Phantom-Field bleibt, harmlos
- **macOS-Duplikate** (`fragen-core 2.ts` etc.) — separater Cleanup-PR
- **`ausgangsdiagramm`-Field + `DiagrammConfig`-Type** — Folge-Cleanup
- **PDF/Code Validator-Compat-Casts** — separater PR

Falls der Implementer Spawn-Task-Chips dafür anlegen will: am Ende von Phase 6 ist der natürliche Zeitpunkt.
