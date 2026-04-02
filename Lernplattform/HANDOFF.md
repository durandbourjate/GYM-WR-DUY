# Lernplattform — HANDOFF

## Aktueller Stand

**Branch:** `main`
**Phase:** 2 von 7 (Fragenbank + Uebungs-Engine)
**Status:** Implementation abgeschlossen, 39 Tests gruen, Build gruen

### Verifikation (03.04.2026)

| Check | Status |
|-------|--------|
| `npx tsc -b` | OK |
| `npx vitest run` | 39 Tests gruen (6 Testdateien) |
| `npm run build` | OK (dist/ erstellt, 230 KB JS) |
| Pruefungstool Regression | 193 Tests gruen, tsc OK |
| GitHub Actions deploy.yml | Erweitert um Lernplattform-Build |

---

## Phase 1 (02.04.2026) — Grundgeruest + Auth + Gruppen

| Task | Beschreibung |
|------|-------------|
| 1 | Projekt-Scaffolding (React 19 + Vite + Tailwind) |
| 2 | Auth- und Gruppen-Typen |
| 3 | Service-Interfaces + API-Client (6 Tests) |
| 4 | Auth-Service + Auth-Store (6 Tests) |
| 5 | Gruppen-Store + Apps-Script-Adapter (5 Tests) |
| 6 | UI-Komponenten (Login, Gruppen, Dashboard, Admin) |
| 7 | GitHub Actions Deploy erweitert |

## Phase 2 (03.04.2026) — Fragenbank + Uebungs-Engine

| Task | Beschreibung |
|------|-------------|
| 1 | Fragen- + Uebungs-Typen (FrageTyp, AntwortTyp, Session, Ergebnis) |
| 2 | Korrektur-Utils + Shuffle (12 Tests) |
| 3 | Block-Builder (5 Tests) |
| 4 | FragenService Interface + Mock-Daten-Adapter (13 Fragen, 5 Themen) |
| 5 | UebungsStore (5 Tests) |
| 6 | 8 Fragetypen-Komponenten (MC, Multi, TF, Fill, Calc, Sort, Sortierung, Zuordnung) |
| 7 | UebungsScreen + Zusammenfassung |
| 8 | Dashboard mit Themen-Browser + App Routing |

### Architektur (nach Phase 2)

```
Lernplattform/src/
├── types/           # auth, gruppen, fragen, uebung
├── services/        # interfaces, apiClient, authService
├── adapters/        # appsScriptAdapter, mockDaten
├── store/           # authStore, gruppenStore, uebungsStore
├── utils/           # korrektur, blockBuilder, shuffle
├── components/
│   ├── fragetypen/  # 8 Komponenten + Registry
│   ├── LoginScreen, GruppenAuswahl, Dashboard
│   ├── UebungsScreen, Zusammenfassung
│   └── AdminLayout (Platzhalter)
├── App.tsx          # Auth-Guard + Session-Routing
└── __tests__/       # 6 Testdateien, 39 Tests
```

### Uebungs-Flow

1. Dashboard zeigt Themen nach Fach gruppiert (aus Mock-Daten)
2. Klick auf Thema → UebungsStore laedt Fragen, erstellt 10er-Block
3. UebungsScreen zeigt Frage + Fragetyp-Komponente
4. Antwort → Korrektur → Feedback (gruen/rot + Erklaerung)
5. Weiter → naechste Frage oder Ergebnis
6. Zusammenfassung zeigt Score + Detail-Liste
7. "Nochmal ueben" oder "Zurueck zum Dashboard"

### Mock-Daten (kein Backend noetig zum Testen)

13 Fragen in 5 Themen: Mathe (Addition, Multiplikation), Deutsch (Wortarten, Satzglieder), VWL (Markt und Preis).
Alle 8 Fragetypen vertreten: mc, multi, tf, fill, calc, sort, sortierung, zuordnung.

---

## Was fehlt (naechste Phasen)

### Phase 3: Fortschritt + Mastery
- FragenFortschritt-Tracking (versuche, richtigInFolge, mastery)
- Mastery-Stufen: neu → ueben → gefestigt → gemeistert
- Dauerbaustellen-Erkennung (>10 Versuche, <50%)
- Block-Priorisierung nach Mastery-Status
- Apps Script Backend fuer Analytik

### Phase 4: Eltern-/LP-Dashboard
- 3-Ebenen Drill-Down (Uebersicht → Kind → Thema)
- Typische Fehler, Trends, Session-Historie

### Phase 5: Auftraege + Empfehlungen

### Phase 6: Gamification + Kinder-UX

### Phase 7: Gym-Pool-Migration

### Apps Script Backend (noch nicht implementiert)
- Alle `lernplattform*` Endpoints
- Gruppen-Registry Sheet
- Fragenbank aus Google Sheets lesen (statt Mock)
- Antworten + Fortschritt persistieren
