# Lernplattform — HANDOFF

## Aktueller Stand

**Branch:** `feature/shared-editor-phase1` (gepusht, NICHT gemergt)
**Phase:** Shared Editor Phase 1 abgeschlossen (04.04.2026)
**Status:** Shared TSC OK, Lernplattform 93 Tests grün, Pruefung TSC OK (unverändert)
**Apps Script:** Deployed, Registry-Sheet mit 8 Gruppen (Familie + 6 Gym + Test)

### Letzte Commits (feature/shared-editor-phase1)

| Commit | Beschreibung |
|--------|-------------|
| 2ef40e0 | Shared Editor Phase 1: Infrastructure (Interfaces, Context, Utilities, Hooks) |

### Auf main (bereits gemergt)

| Commit | Beschreibung |
|--------|-------------|
| 0ffc338 | HANDOFF.md aktualisiert |
| 41e26b1 | Duplikat-Dateien entfernt |
| 827ac74 | 5 UI-Bugfixes (Dark Mode, Navigation, Umlaute, Ladezeit) |

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

### Phase 2: Typ-Editoren nach Shared (NÄCHSTE SESSION)

**Ziel:** Alle 20 Typ-Editoren + UI-Komponenten nach `packages/shared/src/editor/` verschieben. Nutzen EditorContext statt Pruefung-Stores. Pruefung bleibt unverändert.

**Was zu tun ist:**

1. **Basis-UI kopieren:** `EditorBausteine.tsx`, `FormattierungsToolbar.tsx`, `BildUpload.tsx` (pure UI, keine Anpassung)
2. **KI-UI kopieren:** `KIBausteine.tsx`, `KIAssistentPanel.tsx`, `KIFiBuButtons.tsx`, `KITypButtons.tsx` (Import-Pfade anpassen)
3. **Supporting anpassen:** `FrageTypAuswahl.tsx`, `AnhangEditor.tsx`, `BewertungsrasterEditor.tsx` (EditorContext statt authStore/apiService)
4. **20 Typ-Editoren kopieren:** MCEditor bis FormelEditor → `packages/shared/src/editor/typeditors/`
5. **Sections kopieren:** `TypEditorDispatcher.tsx` (783 Z.), `MetadataSection.tsx`, `FragetextSection.tsx`, `MusterloesungSection.tsx`

**Anpassungsmuster:** `useAuthStore` → `useEditorConfig()`, `apiService` → `useEditorServices()`, `useSchulConfig` → `useEditorConfig()`

**Quell-Dateien:** `Pruefung/src/components/lp/frageneditor/` (~37 Dateien, ~8600 Zeilen)

### Phase 3: Haupteditor + Lernplattform-Integration

- FragenEditor-Shell nach shared (912 Z., Render-Slots für host-spezifische Features)
- `frageKonverter.ts` (kanonisch ↔ flach)
- 4 neue Apps Script Endpoints (CRUD + Upload)
- Lernplattform-Adapter + UI (FragenbankListe, FragenEditorScreen, Admin-Tab)

### Phase 4: Prüfungstool umstellen

- Pruefung-Adapter + Wrapper
- Imports auf shared umstellen
- ~35 Dateien aus Pruefung löschen
- Vollständiger Regressionstest

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
- `Lernplattform/` — Host-App mit eigenen Adaptern (ab Phase 3)
