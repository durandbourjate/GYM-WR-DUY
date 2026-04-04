# Übungstool — HANDOFF

## Aktueller Stand

**Branch:** `main`
**Phase:** Bugfix-Runde 2 (05.04.2026)
**Status:** TSC OK, 92 LP-Tests + 193 Prüfungs-Tests grün, Build OK
**Apps Script:** GEÄNDERT — neue Bereitstellung nötig (Frage löschen + KI/Upload/Lernziele)

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

## In dieser Session erledigt (04–05.04.2026)

| # | Bug/Feature | Fix |
|---|-------------|-----|
| 1 | SuS "Keine Gruppen" ohne Ausweg | Abmelde-Button hinzugefügt |
| 2 | MC-Optionen zeigen UUID | Index-basierte Buchstaben (a,b,c) statt opt.id (shared) |
| 3 | LP Dashboard leer nach Gruppenauswahl | Admin-Rolle → automatisch zu Admin-Screen |
| 4 | Freitextfelder zu schmal | `width: 100%` für textarea bei field-sizing |
| 5 | Umlaute "Pruefen"/"Faecher" | 26 Dateien bereinigt |
| 6 | Fach-Button schwarz bei Auswahl | Fachfarbe intensiviert (ring-2 + bg-500) |
| 7 | 0 Lernende in Übersicht | `rolle !== 'admin'` statt `=== 'lernend'` (Backend-Default = 'mitglied') |
| 8 | Lückentext UUID-Codes | Sequenzielle Nummern {{1}},{{2}} statt UUID (shared) |
| 9 | Übungspools: 0 Themen auf Index | Regex für unquoted Topic-Keys |
| 10 | Übungspools: 🏁 Lernziele-Buttons fehlen | checkLzButtons() nach render().then() |
| 11 | Frage löschen fehlt | Backend-Endpoint + Frontend-Button (🗑) |
| 12 | BerechnungEditor Layout | Bezeichnung flex-3, Ergebnis flex-2, Toleranz flex-1 |
| 13 | speichereFrage → FRAGENBANK_ID | Gym-Gruppen → Fach-Tab, Familie → eigenes Sheet |
| 14 | KI/Upload/Lernziele Endpoints | 3 neue Endpoints im Apps Script Backend |
| 15 | FiBu-Dropdowns leer | KMU-Kontenrahmen (CH) in kontenrahmenDaten.ts, geladen in beiden Providern |

---

## Offene Bugs (nächste Session)

### A) Editor-Funktionalität (SharedFragenEditor)

| # | Bug | Details | Aufwand |
|---|-----|---------|---------|
| 1 | **Bild-Preview** | Hotspot/Bildbeschriftung/DragDrop: Pool-importierte Fragen haben relative Bild-Pfade (`img/...`) die im Editor nicht auflösen. Neue Fragen via Drive-Upload OK. Fix: Relative Pfade beim Laden zu absoluten GitHub-Pages-URLs auflösen. | Mittel |
| 2 | **PDF-Editor** | "nicht verfügbar" weil PDFEditorComponent nicht übergeben. Lösung: PDFEditor nach `packages/shared` verschieben. | Mittel |
| 3 | **Anhänge-Rubrik** | anhangEditorSlot nicht übergeben. Lösung: AnhangEditor nach `packages/shared` verschieben. AudioRecorder prüfen. | Mittel |
| 4 | **"Allgemein"/"W&R"** | Fachbereich-Werte aus Einführungsprüfung. Auf "Andere" oder korrekte Fachbereiche mappen. | Klein |

### B) Pool-Import (Prüfungstool)

| # | Bug | Details | Aufwand |
|---|-----|---------|---------|
| 5 | **Neue Fragetypen nicht importiert** | poolConverter.ts kennt nur 7 Typen (mc/multi/tf/fill/calc/sort/open). 6 neue Typen fehlen: sortierung, formel, hotspot, bildbeschriftung, dragdrop_bild, code. Müssen in pool.ts + poolConverter.ts ergänzt werden. | Gross |

### C) Übungstool UI

| # | Bug | Details | Aufwand |
|---|-----|---------|---------|
| 6 | **Filter hierarchisch** | Fachbereich→Thema→Unterthema statt flache Listen. User hat Suchfeld + Fach-Buttons + Thema/Typ-Dropdowns bereits ergänzt. | Klein |
| 7 | **Kopfzeile: Home, Hilfe, Lernziele** | Wie in Übungspools | Klein |
| 8 | **Übersicht-Tab inhaltlich** | Fortschritts-Daten pro Mitglied aggregieren (Backend) | Mittel |

---

## Verifikation

```bash
cd Lernplattform && npx tsc -b && npx vitest run && npm run build
cd Pruefung && npx tsc -b && npx vitest run && npm run build
```

---

## Nächste Session — Empfohlene Reihenfolge

1. **Apps Script deployen** — User muss Code kopieren + neue Bereitstellung (Frage löschen + KI)
2. **ANTHROPIC_API_KEY setzen** — Script Properties (optional, für KI-Assistent)
3. **AnhangEditor + PDFEditor** nach shared verschieben (Bug A2+A3)
4. **Bild-Preview** fixen: Relative Pool-Pfade auflösen (Bug A1)
5. **Pool-Import** erweitern: 6 neue Fragetypen (Bug B5)
6. **E2E-Test** im Browser
