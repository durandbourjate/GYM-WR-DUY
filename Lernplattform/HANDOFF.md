# Lernplattform — HANDOFF

## Aktueller Stand

**Branch:** `main` (alles gemergt)
**Phase:** Shared Editor komplett (Phasen 1–4 + 5a + 5b) + Admin-Fragenbank
**Status:** TSC OK, 113 LP-Tests + 193 Pruefung-Tests grün, Build OK, CI grün (nach fix)
**Apps Script:** Neuer Endpoint `lernplattformSpeichereFrage` — deployed am 04.04.2026

### Letzte Commits (main)

| Commit | Beschreibung |
|--------|-------------|
| f67d3eb | fix(ci): install shared dependencies for React type resolution |
| 23e1806 | fix: Tailwind v4 @source für shared-Komponenten |
| a5c0976 | fix: SharedFragenEditor Scroll in Tailwind v4 (inline styles) |
| 398c64b | feat(LP): Phase 5b — Admin-Fragenbank mit SharedFragenEditor (6 Tasks) |

---

## Shared Editor — 4-Phasen-Plan

**Ziel:** Ein FragenEditor in `packages/shared/`, den Prüfungstool UND Lernplattform importieren. Kein doppelter Code.

**Plan-Datei:** `.claude/plans/wild-booping-corbato.md`

### Phase 1: Shared Infrastructure ✅ (04.04.2026)

15 neue Dateien in `packages/shared/src/editor/` (1029 Zeilen):

| Datei | Inhalt |
|-------|--------|
| `types.ts` | `EditorConfig`, `EditorServices`, `EditorFeatures`, `EditorBenutzer` |
| `EditorContext.tsx` | React Context + Provider + `useEditorConfig()` / `useEditorServices()` |
| `editorUtils.ts` | `FrageTyp`, `generiereFrageId()`, `parseLuecken()` |
| `fragenValidierung.ts` | `validiereFrage()` für alle 20 Typen |
| `fragenFactory.ts` | `erstelleFrageObjekt()`, `FrageBasis`, `TypSpezifischeDaten` |
| `zeitbedarf.ts` | `berechneZeitbedarf()` Richtwert-Tabelle |
| `fachUtils.ts` | `typLabel()`, `bloomLabel()`, `FIBU_TYPEN`, `fachbereichFarbe()` etc. |
| `kontenrahmen.ts` | KMU-Kontenrahmen Utility (mit `setKontenrahmenData()` DI) |
| `musterloesungGenerierung.ts` | 4 FiBu-Musterlösungsgeneratoren |
| `useKIAssistent.ts` | Abstrahierter KI-Hook (nutzt EditorContext) |
| `hooks/useFocusTrap.ts` | Focus-Trap Hook |
| `hooks/usePanelResize.ts` | Panel-Resize Hook |

**Kontenrahmen-Hinweis:** `kontenrahmen.ts` nutzt Dependency Injection (`setKontenrahmenData()`) statt direktem JSON-Import, damit die Host-App die Daten liefert. Die JSON-Datei liegt weiterhin in `Pruefung/src/data/kontenrahmen-kmu.json`.

### Phase 5b: Admin-Fragenbank ✅ (04.04.2026)

10 geänderte Dateien (1225 neue Zeilen):

| Datei | Inhalt |
|-------|--------|
| `adapters/frageAdapter.ts` | `toSharedFrage()` / `fromSharedFrage()` für alle 20 Typen |
| `__tests__/frageAdapter.test.ts` | 20 Tests (Mapping, Roundtrip) |
| `components/admin/LernplattformEditorProvider.tsx` | EditorProvider-Wrapper (alle Features off) |
| `components/admin/AdminFragenbank.tsx` | Fragen-Liste, Fach-Filter, Editor-Modal via SharedFragenEditor |
| `components/admin/AdminDashboard.tsx` | Fragenbank-Tab hinzugefügt (4 Tabs) |
| `store/navigationStore.ts` | `adminFragenbank` ScreenTyp |
| `services/interfaces.ts` | `speichereFrage` + `invalidateCache` im FragenService |
| `adapters/appsScriptAdapter.ts` | `speichereFrage` Methode + `getEmail()` Helper |
| `apps-script/lernplattform-backend.js` | `lernplattformSpeichereFrage` Endpoint (Upsert) |
| `vite.config.ts` | `dedupe: ['react', 'react-dom']` für Shared-JSX |

**Wichtig:** Apps Script muss neu bereitgestellt werden (neuer Endpoint `lernplattformSpeichereFrage`).

### Phase 2: Typ-Editoren nach Shared ✅

20 Typ-Editoren + UI-Komponenten in `packages/shared/src/editor/typen/` (alle 20 Typen).

### Phase 3: Haupteditor + Lernplattform-Integration ✅

SharedFragenEditor mit Slot-Props, frageAdapter, AdminFragenbank.

### Phase 4: Prüfungstool umstellen ✅

PruefungFragenEditor als Wrapper um SharedFragenEditor. Imports umgestellt.

---

## Verifikation

```bash
# Shared
cd packages/shared && npx tsc --noEmit  # (über Lernplattform: npx tsc --noEmit --project ../packages/shared/tsconfig.json)

# Lernplattform
cd Lernplattform && npx tsc -b && npx vitest run && npm run build

# Pruefung (erst ab Phase 4 verändert)
cd Pruefung && npx tsc -b && npx vitest run && npm run build
```

---

## Architektur-Überblick

### Dependency Injection Pattern
```
Host-App (Pruefung/Lernplattform)
  └─ EditorProvider (config + services)
       └─ FragenEditor (shared)
            ├─ useEditorConfig() → Gefässe, Semester, Benutzer, Features
            ├─ useEditorServices() → Upload, KI
            └─ Typ-Editoren (shared, Phase 2)
```

### Was wo lebt
- `packages/shared/src/editor/` — Geteilter Editor-Code (Interfaces, Utils, Hooks, ab Phase 2: Komponenten)
- `packages/shared/src/types/` — Kanonische Frage-Types (bereits vorhanden)
- `Pruefung/` — Host-App mit eigenen Adaptern (ab Phase 4)
- `Lernplattform/` — Host-App mit eigenen Adaptern (Phase 5b: frageAdapter, EditorProvider, AdminFragenbank)

---

## Offene Punkte (Priorität)

### A) Fragen laden — LP braucht Testdaten

Die LP Fragenbank zeigt "0 Fragen" weil die Gruppen-Sheets leer sind. Fragen aus Übungspools (2360 konvertiert) und Prüfungstool müssen in die Gruppen-Fragenbank-Sheets geladen werden.

**Optionen:**
1. Konvertierungs-Script (`scripts/convertPools.mjs`) Ergebnis in Fragenbank-Sheets importieren
2. Neuer Apps-Script-Endpoint `lernplattformImportiereFragen` (Bulk-Import)
3. Manuell: Fragen im Editor erstellen (langsam, nur zum Testen)

**Hinweis:** Anzahl Fragen in Pools ≠ Prüfungstool (Pools: flaches Format, Prüfungstool: kanonisches Format mit mehr Metadaten). Pool-Sync importiert nur Teilmenge.

### B) Editor-Unterschiede LP vs. Prüfungstool

| Feature | Prüfungstool | Lernplattform | Grund |
|---------|-------------|---------------|-------|
| KI-Buttons | ✅ | ❌ | `kiAssistent: false` — gewollt (kein API-Key in LP) |
| Anhänge | ✅ | ❌ | `anhangUpload: false` — gewollt (kein Drive-Upload in LP) |
| Sichtbarkeit/Sharing | ✅ | ❌ | `sharing: false` — gewollt (LP hat keine LP-Fachschaften) |
| Lernziel-Button | ✅ | ❌ | Feature off — gewollt |
| **Fachbereich-Dropdown** | ✅ Dropdown | ❌ Nur Text | **BUG: `verfuegbareGefaesse` leer** |
| **Semester-Chips** | ✅ S1–S8 | ❌ fehlen | **BUG: `verfuegbareSemester` leer** |
| **Gefäss-Chips** | ✅ SF/EF/EWR/GF | ❌ fehlen | **BUG: `verfuegbareGefaesse` leer** |
| Punkte Default | 1 | 5 | Unterschied in BewertungsrasterEditor-Default |

**Fix nötig:** `LernplattformEditorProvider` braucht sinnvolle Defaults für Gefässe und Semester.

### C) UI-Verbesserungen

- [ ] **Admin-Tab "Auftraege"** — Tippfehler, sollte "Aufträge" heissen
- [ ] **Login-Screen:** Light/Dark-Mode Toggle fehlt
- [ ] **Login-Screen:** Hilfe-Button / Info-Text ("Worum geht es?")
- [ ] **Dashboard:** "Noch keine Übungsfragen vorhanden" — braucht Fragen (siehe Punkt A)
- [ ] **Fächer-Anzeige** im Dashboard verbessern

### D) Nächste Schritte

1. **EditorProvider-Defaults fixen** — Gefässe, Semester, Fachbereich-Dropdown
2. **Fragen importieren** — Pool-Fragen in Gruppen-Sheets laden
3. **UI-Kleinigkeiten** — Aufträge-Typo, Login-Hilfe, Toggle
4. **E2E-Test** — Frage erstellen → speichern → in Liste sehen → bearbeiten
