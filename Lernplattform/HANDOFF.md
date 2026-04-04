# Übungstool — HANDOFF

## Aktueller Stand

**Branch:** `fix/uebungstool-editor-bugs` (bereit für Merge)
**Phase:** Bugfix-Runde 3 (05.04.2026)
**Status:** TSC OK, 92 LP-Tests + 193 Prüfungs-Tests grün, Build OK
**Apps Script:** Deployed (Frage löschen + KI/Upload/Lernziele + ANTHROPIC_API_KEY)

### Architektur
- **Ein Format:** Kanonisch aus `@shared/types/fragen` (discriminated union)
- **Eine Fragenbank:** `FRAGENBANK_ID` = Prüfungstool-Sheet (Gym-Gruppen), eigenes Sheet (Familie)
- **Ein Editor:** SharedFragenEditor mit allen Features (KI, Anhänge, Sharing, Lernziele)
- **Kein Adapter:** Keine Konvertierung zwischen LP und Prüfungstool-Format
- **CSS:** Identisch mit Prüfungstool (input-field, slate-Farben, Kontrast)
- **Kontenrahmen:** KMU-Kontenrahmen (CH) geladen in beiden EditorProviders

### Umbenennung (04.04.2026)
- Prüfungsplattform → **Prüfungstool** (UI, PWA, README, CLAUDE.md)
- Lernplattform → **Übungstool** (UI, PWA, README, CLAUDE.md)
- Root index.html: Links zu beiden Tools ergänzt

---

## In dieser Session erledigt (05.04.2026)

| # | Bug/Feature | Fix |
|---|-------------|-----|
| 1 | **AnhangEditor "nicht übergeben"** | Nach `packages/shared/src/editor/components/AnhangEditor.tsx` verschoben. SharedFragenEditor nutzt Default wenn kein Slot. AudioRecorder als optionaler Prop. |
| 2 | **PDFEditor "nicht verfügbar"** | Nach `packages/shared/src/editor/components/PDFEditor.tsx` verschoben. usePDFRenderer als optionaler Prop. Default-Editor ohne Seitenzählung. |
| 3 | **mediaUtils** | Nach `packages/shared/src/editor/utils/mediaUtils.ts` verschoben. Pruefung re-exportiert. |
| 4 | **Bild-Preview relativ** | `resolvePoolBildUrl()` in shared. Angewandt in BildUpload + HotspotEditor + BildbeschriftungEditor + DragDropBildEditor. |
| 5 | **Fachbereich "W&R"** | `mapFachbereich()` erkennt jetzt W&R/WR → BWL. Informatik exakter Match. Fallback → Allgemein statt VWL. |
| 6 | **Pool-Import: 6 neue Typen** | sortierung, formel, hotspot, bildbeschriftung, dragdrop_bild, code im poolConverter.ts. PoolFrage-Interface erweitert. berechnePunkte/schaetzeZeitbedarf/erzeugeSnapshot ergänzt. |

---

## Offene Bugs (nächste Session)

### C) Übungstool UI

| # | Bug | Details | Aufwand |
|---|-----|---------|---------|
| 1 | **Filter hierarchisch** | Fachbereich→Thema→Unterthema statt flache Listen. User hat Suchfeld + Fach-Buttons + Thema/Typ-Dropdowns bereits ergänzt. | Klein |
| 2 | **Kopfzeile: Home, Hilfe, Lernziele** | Wie in Übungspools | Klein |
| 3 | **Übersicht-Tab inhaltlich** | Fortschritts-Daten pro Mitglied aggregieren (Backend) | Mittel |

---

## Verifikation

```bash
cd Lernplattform && npx tsc -b && npx vitest run && npm run build
cd Pruefung && npx tsc -b && npx vitest run && npm run build
```

---

## Nächste Session — Empfohlene Reihenfolge

1. **Merge zu main** — Branch `fix/uebungstool-editor-bugs` nach LP-Freigabe
2. **E2E-Test** im Browser (Editor öffnen, Bild-Frage bearbeiten, PDF-Editor testen)
3. **UI-Bugs** (Filter hierarchisch, Kopfzeile, Übersicht-Tab)
