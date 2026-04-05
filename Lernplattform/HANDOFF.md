# Uebungstool — HANDOFF

## Aktueller Stand

**Branch:** `fix/lernplattform-ux-bugs`
**Phase:** Bug-Fixes + UX-Verbesserungen (05.04.2026)
**Status:** TSC OK, 101 LP-Tests + 193 Pruefungs-Tests gruen, Build OK
**Apps Script:** Aenderungen pending (User muss deployen)

### Architektur
- **Ein Format:** Kanonisch aus `@shared/types/fragen` (discriminated union)
- **Eine Fragenbank:** `FRAGENBANK_ID` = Pruefungstool-Sheet (Gym-Gruppen), eigenes Sheet (Familie)
- **Ein Editor:** SharedFragenEditor mit allen Features (KI, Anhaenge, Sharing, Lernziele)
- **Kein Adapter:** Keine Konvertierung zwischen LP und Pruefungstool-Format
- **CSS:** Identisch mit Pruefungstool (input-field, slate-Farben, Kontrast)
- **Kontenrahmen:** KMU-Kontenrahmen (CH) geladen in beiden EditorProviders

---

## In dieser Session erledigt (05.04.2026 — Nachmittag)

### Bug-Fixes
| # | Fix | Details |
|---|-----|---------|
| 1 | FRAGENBANK_TABS dynamisch | Nicht mehr hardcoded auf 4 Tabs — liest alle Tabs aus dem Sheet (exkl. System-Tabs) |
| 2 | Fachbereich-Mapping | "Allgemein" und "Wirtschaft & Recht" werden auf "Andere" gemappt (lila Badge) |
| 3 | Bilder-Fix | resolveAssetUrl() erkennt Pool-Bild-Pfade (img/, pool-bilder/) und loest auf GitHub-Pages-URL auf |
| 4 | PDF CSP-Fix | frame-src um blob:, Google Drive domains erweitert |
| 5 | SuS leerer Screen | Geloest durch Fix #1 (fehlende Tabs wurden nicht geladen) |

### UX-Verbesserungen
| # | Feature | Details |
|---|---------|---------|
| 1 | Loeschen im Editor | "Frage loeschen"-Button unten im SharedFragenEditor (rot, mit Bestaetigungsdialog) |
| 2 | Hierarchische Filter | Fach → Thema → Unterthema (3 Ebenen), Unterthema-Dropdown nur wenn Thema gewaehlt |
| 3 | Berechnung Feldgroessen | Bezeichnung groesser (flex-5), Ergebnis + Toleranz kompakter (w-24, w-20) |
| 4 | Klickbare Fach-Karten | Admin-Uebersicht: Fach-Karten navigieren zur Fragenbank mit Fach-Filter vorausgewaehlt |

---

## Geaenderte Dateien

| Datei | Aenderung |
|-------|----------|
| `apps-script/lernplattform-backend.js` | getFragenbankTabs_(), FACHBEREICH_MAPPING, parseFrageKanonisch_ Mapping |
| `index.html` | CSP frame-src erweitert |
| `src/utils/assetUrl.ts` | Pool-Bild-Pfade erkennen + auf Uebungen-URL aufloesen |
| `src/components/admin/AdminFragenbank.tsx` | Hierarchische Filter, initialFach, onLoeschen, Andere-Farbe |
| `src/components/admin/AdminUebersicht.tsx` | Klickbare Fach-Karten (onFachKlick) |
| `src/components/admin/AdminDashboard.tsx` | Fach-Filter Routing (initialFach in Ansicht) |
| `packages/shared/src/editor/SharedFragenEditor.tsx` | onLoeschen Prop + Button |
| `packages/shared/src/editor/typen/BerechnungEditor.tsx` | Feldgroessen angepasst |

---

## Offene Punkte

| # | Thema | Details | Aufwand |
|---|-------|---------|--------|
| 1 | **Apps Script deployen** | User muss lernplattform-backend.js in Apps Script Editor kopieren + neue Bereitstellung erstellen | User |
| 2 | **E2E-Browser-Test** | Nach Deploy: Bilder, PDFs, Filter, Loeschen, SuS-Ansicht testen | Mittel |
| 3 | **Lernziele-Tab erstellen** | Wird automatisch beim ersten speichereLernziel erstellt, oder manuell im Sheet | Manuell |

---

## Verifikation

```bash
cd Lernplattform && npx tsc -b && npx vitest run && npm run build
cd Pruefung && npx tsc -b && npx vitest run && npm run build
```
