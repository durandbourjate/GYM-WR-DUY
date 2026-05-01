# Visualisierungs-Frage `untertyp`-Feld entfernen

**Datum:** 2026-05-01
**Branch:** `refactor/visualisierung-untertyp-drift`
**Vorgänger:** Bundle L.c Spawn-Task #3 — letzte offene Field-Drift in `buildFragePreview` (siehe `HANDOFF.md` "Post-Bundle-L Spawn-Task-Cleanups", Punkt 2 "NICHT in diesem Bundle").

## Problem

`VisualisierungFrage.untertyp` (`packages/shared/src/types/fragen-core.ts:171-174`) ist als Pflicht-Feld mit Type-Union `'zeichnen' | 'diagramm-manipulieren' | 'schema-erstellen'` deklariert. Tatsächlich gilt:

1. **Nur `'zeichnen'` ist real implementiert.** Die anderen 2 Untertypen wurden nie als Editor-/Renderer-Logik gebaut. Sie kommen ausschliesslich vor in:
   - Type-Definition (`fragen-core.ts:173`)
   - Ein einzelner Test-Mock (`pflichtfeldValidation.test.ts:326`, `untertyp: 'diagramm-manipulieren'`)
2. **`speichereJetzt` schreibt das Feld nie** (`SharedFragenEditor.tsx:820-821`):
   ```ts
   case 'visualisierung':
     typDaten = { typ: 'visualisierung', fragetext, canvasConfig, musterloesungBild }; break
   ```
   → Neu gespeicherte Visualisierungs-Fragen haben kein `untertyp`-Feld in Storage. Type-Vertrag wird verletzt.
3. **`buildFragePreview` schummelt einen Sentinel** (`buildFragePreview.ts:134-138`):
   ```ts
   case 'visualisierung':
     return { ...basis, untertyp: 'frei', canvasConfig: s.canvasConfig } as unknown as Frage
   ```
   `'frei'` ist NICHT in der Type-Union. Reines Workaround, damit der Validator-non-empty-Check passt.
4. **Validator-Pflicht ist toter Code in Produktion** (`pflichtfeldValidation.ts:451-466`):
   ```ts
   const untertypOk = strNonEmpty(frage.untertyp)
   if (!untertypOk) pflichtLeer.push('Untertyp')
   ```
   Feuert nur auf der Preview-Form, die das `'frei'`-Sentinel reinschreibt. Saved Fragen werden nie nachvalidiert.
5. **Renderer hat dead-code Gate** (`FrageRenderer.tsx:28-38`):
   ```tsx
   if (frage.typ === 'visualisierung') {
     const vizFrage = frage as VisualisierungFrage
     if (vizFrage.untertyp !== 'zeichnen') {
       return <div>Visualisierungs-Untertyp «{vizFrage.untertyp}» wird in einer späteren Phase implementiert.</div>
     }
   }
   ```
   Da `speichereJetzt` `untertyp` nie setzt, ist `vizFrage.untertyp` für neue Fragen `undefined`. `undefined !== 'zeichnen'` ist `true` → würde fälschlich Platzhalter zeigen. Greift in Produktion nicht, weil Visualisierung als Sub-Modus historisch gefüllt war (Legacy-Daten haben `untertyp: 'zeichnen'`) ODER der Default-Zweig in `fragenFactory.ts:209` (`untertyp: typDaten.untertyp || 'zeichnen'`) das Feld setzt, wenn die Factory benutzt wird.

User-Bestätigung (Brainstorming, 2026-05-01): Freihand-Zeichnen ist die einzige relevante Visualisierungs-Variante. Andere geplante Modi sind durch DragDrop-Bild, Bildbeschriftung, Hotspot ohnehin abgedeckt. Vaporware-Status bestätigt.

## Lösung

`untertyp` aus dem `VisualisierungFrage`-Datenmodell **vollständig entfernen**. Visualisierungs-Frage hat nur noch `fragetext`, `canvasConfig`, `musterloesungBild` als Inhalts-Felder (über `FrageBase` hinaus).

## Scope

11 Dateien (Frontend/Shared), geschätzt 20-30 Zeilen entfernt insgesamt. Apps-Script-Backend bleibt unangetastet (siehe „Out of Scope").

### 1. Type-Definition
**`packages/shared/src/types/fragen-core.ts`**:
- Z. 173 — `untertyp`-Property aus `VisualisierungFrage`-Interface entfernen
- Z. 456 — `untertyp?: string` aus `InlineTeilaufgabe`-Interface entfernen (war Visualisierung-Sub-Aufgaben in Aufgabengruppen, wird von `inlineTeilaufgabeAlsFrage` in `ExamLab/src/utils/fragenResolver.ts:59` ohnehin nicht propagiert — toter Field-Slot, der konsistent mitfällt)

### 2. Validator
**`packages/shared/src/editor/pflichtfeldValidation.ts:449-472`** — `validiereVisualisierung`:
- Z. 451 `untertypOk`-Check entfernen
- Z. 458 `pflichtLeer.push('Untertyp')` entfernen
- Z. 466 `untertyp:`-Eintrag aus `felderStatus`-Object entfernen
Verbleibende Pflichtfelder: `fragetext`, `konfig` (canvasConfig OR ausgangsdiagramm).

### 3. Validator-Test
**`packages/shared/src/editor/pflichtfeldValidation.test.ts`** — `describe('— visualisierung')`-Block hat **drei** untertyp-Stellen, je unterschiedliche Behandlung:
- Z. 318 (`'OK mit fragetext + untertyp + canvasConfig'`): `untertyp: 'zeichnen'`-Property aus Mock entfernen, Test bleibt (prüft nur dass Pflicht-Check passiert wenn fragetext+canvasConfig gesetzt sind)
- Z. 326 (`'pflicht-leer ohne fragetext'` o.ä.): `untertyp: 'diagramm-manipulieren'`-Property aus Mock entfernen, Test bleibt (prüft fragetext-Pflicht)
- Z. 331-336 (`it('pflicht-leer ohne untertyp', ...)`): **kompletten Test entfernen**, ist nach Refactor obsolet (untertyp ist kein Pflichtfeld mehr).

Kein Ersatz-Test für „pflicht-leer ohne fragetext/konfig" nötig — beide existierten schon vor diesem Refactor.

### 4. Factory
**`packages/shared/src/editor/fragenFactory.ts:71, 209`**:
- Z. 71 `untertyp?: VisualisierungFrage['untertyp']`-Property aus dem `typDaten`-Input-Type entfernen
- Z. 209 `untertyp: typDaten.untertyp || 'zeichnen',`-Zeile aus dem visualisierung-Branch entfernen

### 5. Preview-Builder
**`packages/shared/src/editor/buildFragePreview.ts:134-138`** — visualisierung-Case ohne `untertyp`:
```ts
case 'visualisierung':
  return { ...basis, canvasConfig: s.canvasConfig } as unknown as Frage
```

### 6. Preview-Test
**`packages/shared/src/editor/buildFragePreview.test.ts:204-214`** — Test-Erwartung umstellen:
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
`{ untertyp: string }`-Cast-Erweiterung weg, `expect(f.untertyp).toBe('frei')` weg.

### 7. Mock
**`packages/shared/src/test-helpers/frageCoreMocks.ts:46`** — `untertyp: 'zeichnen'` aus visualisierung-Mock entfernen:
```ts
visualisierung: { fragetext: 'Test-Frage' } as Omit<VisualisierungFrage, keyof FrageBase | 'typ'>,
```

### 8. Renderer-Gate
**`ExamLab/src/components/FrageRenderer.tsx:27-49`** — Sonderfall-Gate für Visualisierung komplett entfernen. Render-Logik wird zu:
```tsx
const fragInhalt = (() => {
  const Komponente = FRAGETYP_KOMPONENTEN[frage.typ]
  if (!Komponente) {
    return (
      <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 text-center">
        Fragetyp «{(frage as { typ: string }).typ}» wird in einer späteren Phase implementiert.
      </div>
    )
  }
  return <Komponente frage={frage} modus={modus} antwort={antwort ?? null} />
})()
```
`VisualisierungFrage`-Import wird obsolet; entfernen. Der `(frage as { typ: string }).typ`-Cast ist bewusster TypeScript-Bridging-Pattern für den `FRAGETYP_KOMPONENTEN`-Index-Lookup-Fallback und existiert in identischer Form bereits — beim Edit 1:1 übernehmen.

### 9. Demo-Daten
Zwei Production-Daten-Files erzeugen `VisualisierungFrage`-Objekte als Object-Literal mit explizitem `untertyp: 'zeichnen'` (nicht über die Factory). tsc würde nach Type-Refactor crashen — Field-Zeile entfernen:
- **`ExamLab/src/data/einrichtungsFragen.ts:328`** — `untertyp: 'zeichnen',` Zeile entfernen
- **`ExamLab/src/data/einrichtungsUebungFragen.ts:607`** — `untertyp: 'zeichnen',` Zeile entfernen

### 10. Pool-Konverter
**`ExamLab/src/utils/poolConverter.ts:585`** — Konverter schreibt `untertyp: 'zeichnen'` in eine `VisualisierungFrage`-Form. Field-Zeile entfernen.

### 11. (`InlineTeilaufgabe.untertyp` siehe Abschnitt 1, derselbe File)

## Datenmigration

**Keine.** Storage-Daten bleiben intakt:
- Old fragen mit `untertyp: 'zeichnen'` behalten das Feld in Storage. TypeScript ignoriert es nach dem Refactor (kein Read-Pfad mehr). Render-Verhalten unverändert (würde sowieso Komponente rendern).
- Old fragen mit `untertyp: 'diagramm-manipulieren'` oder `'schema-erstellen'`: erwartet 0. Vor Merge muss der Implementer eine **Apps-Script-Daten-Audit-Query** im Backend laufen lassen (z.B. `runQuery_('SELECT * WHERE typDaten LIKE \"%diagramm-manipulieren%\" OR typDaten LIKE \"%schema-erstellen%\"')` oder Sheet-Spalten-Filter). Falls Treffer existieren: separate Folge-Migration ODER inhaltliche Klärung mit User vor Refactor-Merge. Falls 0 Treffer: Refactor sicher.

## Test-Plan

### Unit-Tests
- `tsc -b` (clean)
- `npx vitest run` (alle existierenden grün; modifiziert: pflichtfeldValidation.test, buildFragePreview.test)
- `npm run build` (clean)
- `npm run lint:as-any` (0 undokumentiert; das `as unknown as Frage` in buildFragePreview bleibt erlaubt durch das Audit-Skript-Pattern)

### Browser-E2E (Staging mit echten Logins)

**Test-Plan:**
| # | Pfad | Erwartet |
|---|---|---|
| 1 | LP-Editor: Neue Visualisierungs-Frage anlegen, Fragetext + Canvas-Config setzen, Speichern | Speichert ohne Pflichtfeld-Fehler "Untertyp". Pflichtfeld-Indikatoren zeigen nur fragetext+konfig. |
| 2 | LP-Editor: Bestehende Visualisierungs-Frage öffnen | Lädt korrekt, Editor zeigt Canvas-Vorschau. |
| 3 | SuS-Üben: Visualisierungs-Frage rendern | Canvas erscheint, Stift-/Farbe-Werkzeuge funktionieren. KEIN "wird in einer späteren Phase"-Platzhalter. |

### Security-Check
Refactor ändert KEINE Datenflüsse zum Backend, KEINE Privacy-Invarianten. `bereinigeFrageFuerSuS_` bleibt unverändert (untertyp war nie ein Sperrfeld).

## Risiken

1. **Renderer-Verhaltensänderung für Edge-Case-Fragen:** Falls in Storage tatsächlich Visualisierungs-Fragen mit `untertyp: 'diagramm-manipulieren'` oder `'schema-erstellen'` existieren, würden sie nicht mehr den "wird in einer späteren Phase"-Platzhalter zeigen, sondern als Freihand-Zeichnen rendern. Mitigation: Vor Merge per Apps-Script-Query (oder lokal via fragenbank-cache IDB) prüfen, ob solche Fragen existieren. Erwartung: 0.
2. **Type-Breaking-Change:** Konsumierender Code, der `frage.untertyp` liest (Production), wird durch tsc gefangen. Audit hat 6 Stellen identifiziert (alle in diesem Refactor adressiert).

## Out of Scope

- **Apps-Script Backend-Writer (4 Stellen).** `apps-script-code.js:2996, 4071, 9624` und `apps-script-lernen/lernplattform-backend.js:915` schreiben weiterhin `untertyp: typDaten.untertyp || row.untertyp || 'zeichnen'` ins Sheet. Nach Frontend-Refactor sind das harmlose Legacy-Writer (Frontend liefert kein `untertyp` mehr → Default `'zeichnen'` wandert in Storage als Phantom-Field). Storage-Schema bleibt rückwärts-kompatibel, Frontend ignoriert das Feld. Optional in einer späteren Apps-Script-Cleanup-Welle entfernen.
- **macOS-Duplikate** (`fragen-core 2.ts`, `pflichtfeldValidation 2.ts`, `buildFragePreview.test 2.ts` etc.) — werden in diesem Branch **explizit nicht angefasst**, auch wenn sie ebenfalls `untertyp` enthalten. Separater Cleanup-PR (siehe Workflow-Memory: „Duplikat-Dateien regelmässig aufräumen").
- **Cleanup der Validator-Compat-Casts für Storage-Legacy** in `pflichtfeldValidation.ts` (PDF + Code) — separat, sobald Storage-Daten-Audit abgeschlossen.
- **`ausgangsdiagramm`-Field auf `VisualisierungFrage`** (`fragen-core.ts:175`) und der `DiagrammConfig`-Type sind ohne `untertyp` semantisch tot — kein Renderer existiert. Auch der `frage.ausgangsdiagramm`-Fallback in `validiereVisualisierung` (Z. 454) wird obsolet, sobald `ausgangsdiagramm` weg ist. Nicht in diesem Bundle, aber als künftiger Cleanup notiert. Ist heute harmless dead-code.
- `as any`-Audit oder andere Refactor-Bundles.

## Verifikations-Workflow

1. tsc -b + vitest + build + lint:as-any (alle 4 grün)
2. Force-push branch nach `origin/preview` (nach Lehre `feedback_preview_forcepush.md` zuerst `git log preview ^refactor/visualisierung-untertyp-drift --oneline` prüfen)
3. Browser-E2E auf staging mit echten Logins (3 Tests siehe oben)
4. User-Freigabe ("Merge OK")
5. `git merge --no-ff` auf main, push, branch-cleanup local+remote
6. HANDOFF.md aktualisieren

## Lehre (für `code-quality.md` nach Merge)

**Vaporware-Type-Union-Werte werden zu Architektur-Drift.** `'diagramm-manipulieren' | 'schema-erstellen'` waren als Future-Plan in der Type-Union, ohne dazugehörige Implementierung. Folgen über Monate:
- Validator wird auf Pflicht-Check getrimmt → Schreiber muss Sentinel liefern → Compat-Cast nötig
- Renderer wächst Gate-Code für unimplementierte Pfade
- Storage-Vertrag wird nicht eingehalten (`speichereJetzt` ignoriert die Pflicht)
- Cleanup zieht 6 Stellen über 4 Files

**Regel:** Type-Union-Werte für noch-nicht-implementierte Modi NICHT in der Type-Definition vorab platzieren. Stattdessen:
- Solange nur 1 Modus existiert: gar kein Discriminator-Feld
- Wenn ≥2 Modi geplant aber noch nicht alle gebaut: Type-Union mit nur den **realisierten** Werten; ergänze später im selben PR wie die Implementation

Antimuster: Type-Union-Werte als TODO-Liste im Schema statt als Backlog-Ticket. Schemas sind keine Roadmap.
