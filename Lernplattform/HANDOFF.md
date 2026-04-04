# Lernplattform — HANDOFF

## Aktueller Stand

**Branch:** `main`
**Phase:** Shared Fragenbank Migration komplett (04.04.2026)
**Status:** TSC OK, 92 LP-Tests + 193 Pruefung-Tests grün, Build OK
**Apps Script:** Neuer Code — User muss Apps Script NEU BEREITSTELLEN

### Architektur (nach Migration)
- **Ein Format:** Kanonisch aus `@shared/types/fragen` (discriminated union)
- **Eine Fragenbank:** `FRAGENBANK_ID` = Prüfungstool-Sheet (Gym-Gruppen), eigenes Sheet (Familie)
- **Ein Editor:** SharedFragenEditor mit allen Features (KI, Anhänge, Sharing, Lernziele)
- **Kein Adapter:** Keine Konvertierung zwischen LP und Prüfungstool-Format

### Letzte Commits (main)

| Commit | Beschreibung |
|--------|-------------|
| 9d87de3 | feat(LP): Backend liest aus gemeinsamer Fragenbank (FRAGENBANK_ID) |
| d0d08d6 | refactor(LP): Shared Fragenbank-Format — 42 Dateien, -700 Zeilen |
| 990a0b1 | docs: HANDOFF aktualisiert — offene Punkte |
| 23e1806 | fix: Tailwind v4 @source für shared-Komponenten |

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
- `packages/shared/src/editor/` — SharedFragenEditor + alle 20 Typ-Editoren
- `packages/shared/src/types/fragen.ts` — Kanonische Frage-Types (ein Format für beide Tools)
- `Pruefung/` — PruefungFragenEditor (Wrapper) + eigenes Backend
- `Lernplattform/` — LernplattformEditorProvider + AdminFragenbank + Übungsflow

---

## Offene Punkte

### A) Apps Script bereitstellen — PFLICHT
Backend-Code wurde aktualisiert. User muss in Apps Script Editor neue Bereitstellung erstellen.
Dann laden Gym-Gruppen automatisch alle Fragen aus der Prüfungstool-Fragenbank.

### B) Backend-Endpoints noch nicht implementiert (niedrige Priorität)
- `lernplattformKIAssistent` — KI-Funktionen für LP (Fragen generieren etc.)
- `lernplattformUploadAnhang` — Datei-Upload an Drive
- `lernplattformLadeLernziele` — Lernziele laden
Diese Endpoints sind im EditorProvider vorbereitet aber noch nicht im Backend. Editor funktioniert ohne sie (Buttons zeigen "nicht verfügbar").

### C) UI-Verbesserungen (niedrige Priorität)

- [ ] Admin-Tab "Auftraege" → "Aufträge" (Typo)
- [ ] Login-Screen: Light/Dark-Mode Toggle
- [ ] Login-Screen: Hilfe-Button / Info-Text
- [ ] Fächer-Anzeige im Dashboard verbessern

### D) Nächste Schritte

1. **Apps Script bereitstellen** → Fragen erscheinen automatisch
2. **Browser-Test**: Dashboard → Übung starten (mit echten Fragen)
3. **Browser-Test**: Admin → Fragenbank → Frage erstellen/bearbeiten
4. Backend-Endpoints für KI/Upload/Lernziele (wenn benötigt)
