# Lernplattform — HANDOFF

## Aktueller Stand

**Branch:** `main`
**Phase:** 6 von 7 (Gamification + Kinder-UX)
**Status:** Implementation abgeschlossen, 82 Tests gruen, Build gruen

### Verifikation (03.04.2026)

| Check | Status |
|-------|--------|
| `npx tsc -b` | OK |
| `npx vitest run` | 82 Tests gruen (10 Testdateien) |
| `npm run build` | OK (dist/ erstellt, 256 KB JS) |
| Pruefungstool Regression | 193 Tests gruen, tsc OK |

---

## Phasen-Uebersicht

| Phase | Datum | Beschreibung | Tests |
|-------|-------|-------------|-------|
| 1 | 02.04 | Scaffolding + Auth + Gruppen | 17 |
| 2 | 03.04 | 8 Fragetypen + Uebungs-Engine | 39 |
| 3 | 03.04 | Mastery-System + Fortschritt | 64 |
| 4 | 03.04 | Admin-Dashboard (3-Ebenen) | 64 |
| 5 | 03.04 | Auftraege + Empfehlungen | 69 |
| 6 | 03.04 | Gamification + Kinder-UX | 82 |

## Phase 6 (03.04.2026) — Gamification + Kinder-UX

| Task | Beschreibung |
|------|-------------|
| 1 | Gamification-Utils: berechneSterne, berechneStreak, sterneText (13 Tests) |
| 2 | FeedbackBox-Komponente: variierende Lob-/Trost-Texte |
| 3 | Alle 8 Fragetypen nutzen FeedbackBox statt hardkodierter Texte |
| 4 | Zusammenfassung: Sterne (0-3), Motivationstext |
| 5 | Dashboard: Sterne pro Thema neben Mastery-Badges |

### Gamification-Features

| Feature | Details |
|---------|---------|
| **Sterne** | 0-3 pro Thema: 0 (<20%), 1 (20-49%), 2 (50-74%), 3 (>=75%) |
| **Streaks** | Sessions in Folge, Timeout nach 14 Tagen Pause |
| **Feedback** | 10 Lob-Varianten ("Super!", "Genau!", "Stark!"), 5 Trost-Varianten |
| **Zusammenfassung** | Sterne-Anzeige, Motivationstext nach Ergebnis-Quote |

### Kinder-UX

- Min. 48px Touch-Targets (alle Buttons)
- Text-Basis 16px (Tailwind default), Fragentext 18px (text-lg)
- FeedbackBox mit variierendem Text (nicht immer "Richtig!"/"Falsch!")
- Sterne visuell prominent in Dashboard + Zusammenfassung

### Architektur (nach Phase 6)

```
Lernplattform/src/
├── types/           # auth, gruppen, fragen, uebung, fortschritt, auftrag
├── services/        # interfaces, apiClient, authService
├── adapters/        # appsScriptAdapter, mockDaten, mockMitgliederDaten
├── store/           # authStore, gruppenStore, uebungsStore, fortschrittStore, auftragStore
├── utils/           # korrektur, blockBuilder, shuffle, mastery, empfehlungen, gamification
├── components/
│   ├── fragetypen/  # 8 Komponenten + Registry + FeedbackBox
│   ├── admin/       # AdminDashboard, Uebersicht, KindDetail, ThemaDetail, Auftraege
│   ├── LoginScreen, GruppenAuswahl, Dashboard (Empfehlungen + Sterne)
│   └── UebungsScreen, Zusammenfassung (Sterne + Motivation)
├── App.tsx
└── __tests__/       # 10 Testdateien, 82 Tests
```

---

## Was fehlt

### Phase 7: Gym-Pool-Migration
- Bestehende 27 Pools in Sheets migrieren
- Pool-Fragen in Lernplattform-Format konvertieren

### Apps Script Backend
- Alle `lernplattform*` Endpoints
- Gruppen-Registry + Sheets Setup
- Fortschritt + Analytik + Auftraege server-seitig persistieren
- Aktuell: localStorage-only (funktioniert fuer Demo/Test)

### Spaetere Verbesserungen
- Streak-Anzeige im Dashboard (UI vorhanden, Daten fehlen ohne Backend)
- Offline-Queue (Spec vorhanden, Implementation in spaeterer Phase)
- Diktat-Typ (Browser-TTS)
- Wortschatz/Konjugation-Typen fuer Sprachen
