# Übungstool — HANDOFF

## Aktueller Stand

**Branch:** `main`
**Phase:** UI-Verbesserungen (05.04.2026)
**Status:** TSC OK, 92 LP-Tests + 193 Prüfungs-Tests grün, Build OK
**Apps Script:** Deployed (Frage löschen + KI/Upload/Lernziele + ANTHROPIC_API_KEY)

### Architektur
- **Ein Format:** Kanonisch aus `@shared/types/fragen` (discriminated union)
- **Eine Fragenbank:** `FRAGENBANK_ID` = Prüfungstool-Sheet (Gym-Gruppen), eigenes Sheet (Familie)
- **Ein Editor:** SharedFragenEditor mit allen Features (KI, Anhänge, Sharing, Lernziele)
- **Kein Adapter:** Keine Konvertierung zwischen LP und Prüfungstool-Format
- **CSS:** Identisch mit Prüfungstool (input-field, slate-Farben, Kontrast)
- **Kontenrahmen:** KMU-Kontenrahmen (CH) geladen in beiden EditorProviders

---

## In dieser Session erledigt (05.04.2026)

### Bugfix-Runde 3 (Editor-Bugs)
| # | Bug/Feature | Fix |
|---|-------------|-----|
| 1 | AnhangEditor fehlt | Nach shared verschoben, Default im SharedFragenEditor |
| 2 | PDFEditor fehlt | Nach shared verschoben, Default im TypEditorDispatcher |
| 3 | mediaUtils | Nach shared verschoben, Pruefung re-exportiert |
| 4 | Bild-Preview relativ | `resolvePoolBildUrl()` in 4 Editoren |
| 5 | Fachbereich "W&R" | `mapFachbereich()` korrigiert, Fallback Allgemein |
| 6 | Pool-Import 6 Typen | sortierung, formel, hotspot, bildbeschriftung, dragdrop_bild, code |

### UI-Verbesserungen
| # | Bug/Feature | Fix |
|---|-------------|-----|
| 7 | Filter hierarchisch | Thema-Dropdown abhängig von Fach-Filter, Reset bei Fach-Wechsel |
| 8 | Kopfzeile Lernziele | 🏁-Button im Header (Dashboard), ausklappbares Panel mit Mastery-Erklärung |
| 9 | Übersicht-Tab | Fragen-Statistiken nach Fach (Anzahl, Themen, Typen) in AdminUebersicht |

---

## Offene Punkte

| # | Thema | Details | Aufwand |
|---|-------|---------|---------|
| 1 | **E2E-Test im Browser** | Editor öffnen, Bild-Frage bearbeiten, PDF-Editor, Filter testen | Mittel |
| 2 | **Fortschritt pro Mitglied (Backend)** | Backend-Endpoint um Mastery-Daten aller SuS abzurufen — aktuell nur client-seitig | Gross |
| 3 | **Lernziele aus Backend** | Lernziele im Lernziele-Panel dynamisch laden statt statischer Text | Mittel |

---

## Verifikation

```bash
cd Lernplattform && npx tsc -b && npx vitest run && npm run build
cd Pruefung && npx tsc -b && npx vitest run && npm run build
```
