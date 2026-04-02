# Lernplattform — HANDOFF

## Aktueller Stand

**Branch:** `main`
**Phase:** 3 von 7 (Fortschritt + Mastery)
**Status:** Implementation abgeschlossen, 64 Tests gruen, Build gruen

### Verifikation (03.04.2026)

| Check | Status |
|-------|--------|
| `npx tsc -b` | OK |
| `npx vitest run` | 64 Tests gruen (8 Testdateien) |
| `npm run build` | OK (dist/ erstellt, 234 KB JS) |
| Pruefungstool Regression | 193 Tests gruen, tsc OK |

---

## Phase 1 (02.04.2026) — Grundgeruest + Auth + Gruppen

Scaffolding, Auth (Google OAuth + Code), Gruppen-System, Login/Dashboard UI.
17 Tests (apiClient 6, authStore 6, gruppenStore 5).

## Phase 2 (03.04.2026) — Fragenbank + Uebungs-Engine

8 Fragetypen (MC, Multi, TF, Fill, Calc, Sort, Sortierung, Zuordnung), Block-Builder,
UebungsScreen + Zusammenfassung, Mock-Daten, Dashboard mit Themen-Browser.
22 neue Tests (korrektur 12, blockBuilder 5, uebungsStore 5).

## Phase 3 (03.04.2026) — Fortschritt + Mastery

| Task | Beschreibung |
|------|-------------|
| 1 | Fortschritt-Typen (FragenFortschritt, MasteryStufe, ThemenFortschritt, Dauerbaustelle) |
| 2 | Mastery-Utils: berechneMastery, aktualisiereFortschritt, istDauerbaustelle (14 Tests) |
| 3 | Fortschritt-Store (localStorage-persistiert, 9 Tests) |
| 4 | Block-Builder Mastery-Priorisierung (ueben > neu > gefestigt > gemeistert, 7 Tests) |
| 5 | UebungsStore Integration (nach Antwort → Fortschritt automatisch updaten) |
| 6 | Dashboard Mastery-Badges + Fortschrittsbalken pro Thema |

### Mastery-System

| Stufe | Bedingung | Farbe |
|-------|-----------|-------|
| neu | Noch nie beantwortet | Grau |
| ueben | < 3x richtig in Folge | Gelb |
| gefestigt | 3x richtig in Folge | Blau |
| gemeistert | 5x richtig in Folge, 2+ Sessions | Gruen |

Fortschritt wird in localStorage persistiert (`lernplattform-fortschritt`).
Block-Builder priorisiert: ueben-Fragen zuerst, gemeisterte zuletzt.
Dashboard zeigt Mastery-Verteilung pro Thema als farbigen Balken.

### Architektur (nach Phase 3)

```
Lernplattform/src/
├── types/           # auth, gruppen, fragen, uebung, fortschritt
├── services/        # interfaces, apiClient, authService
├── adapters/        # appsScriptAdapter + mockDaten
├── store/           # authStore, gruppenStore, uebungsStore, fortschrittStore
├── utils/           # korrektur, blockBuilder, shuffle, mastery
├── components/
│   ├── fragetypen/  # 8 Komponenten + Registry
│   ├── LoginScreen, GruppenAuswahl, Dashboard (mit Mastery-Badges)
│   ├── UebungsScreen, Zusammenfassung
│   └── AdminLayout (Platzhalter)
├── App.tsx
└── __tests__/       # 8 Testdateien, 64 Tests
```

---

## Was fehlt (naechste Phasen)

### Phase 4: Eltern-/LP-Dashboard
- 3-Ebenen Drill-Down (Uebersicht → Kind → Thema)
- Typische Fehler, Trends, Session-Historie
- Dauerbaustellen-Anzeige

### Phase 5: Auftraege + Empfehlungen

### Phase 6: Gamification + Kinder-UX

### Phase 7: Gym-Pool-Migration

### Apps Script Backend (noch nicht implementiert)
- Alle `lernplattform*` Endpoints
- Gruppen-Registry + Sheets
- Fortschritt server-seitig persistieren
