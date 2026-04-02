# Lernplattform — HANDOFF

## Aktueller Stand

**Branch:** `feature/lernplattform-phase1`
**Phase:** 1 von 7 (Grundgeruest + Auth + Gruppen)
**Status:** Implementation abgeschlossen, Tests gruen, Build gruen

### Verifikation (02.04.2026)

| Check | Status |
|-------|--------|
| `npx tsc -b` | OK |
| `npx vitest run` | 17 Tests gruen (3 Testdateien) |
| `npm run build` | OK (dist/ erstellt) |
| Pruefungstool Regression | 193 Tests gruen, tsc OK |
| GitHub Actions deploy.yml | Erweitert um Lernplattform-Build |

### Was wurde gemacht (Phase 1)

| Task | Beschreibung | Dateien |
|------|-------------|---------|
| 1 | Projekt-Scaffolding | package.json, tsconfig, vite.config, index.html |
| 2 | TypeScript-Typen | types/auth.ts, types/gruppen.ts |
| 3 | Service-Interfaces + API-Client | services/interfaces.ts, services/apiClient.ts + 6 Tests |
| 4 | Auth-Service + Auth-Store | services/authService.ts, store/authStore.ts + 6 Tests |
| 5 | Gruppen-Store + Adapter | adapters/appsScriptAdapter.ts, store/gruppenStore.ts + 5 Tests |
| 6 | UI-Komponenten | LoginScreen, GruppenAuswahl, Dashboard, AdminLayout, App.tsx |
| 7 | GitHub Actions Deploy | deploy.yml erweitert |

### Architektur (Phase 1)

```
Lernplattform/
├── src/
│   ├── types/           # AuthUser, Gruppe, Mitglied
│   ├── services/        # Interfaces + apiClient + authService
│   ├── adapters/        # appsScriptAdapter (implementiert GruppenService)
│   ├── store/           # authStore + gruppenStore (Zustand)
│   ├── components/      # LoginScreen, GruppenAuswahl, Dashboard, AdminLayout
│   ├── __tests__/       # 3 Testdateien, 17 Tests
│   └── App.tsx          # Auth-Guard + Routing-Logik
```

### Auth-Flow

1. Login-Screen: Google OAuth oder Code-Login
2. Backend: Session-Token generieren
3. Gruppen laden fuer E-Mail
4. 1 Gruppe → automatisch aktiv | >1 → GruppenAuswahl
5. Dashboard (Platzhalter fuer Phase 2)

---

## Was fehlt (naechste Phasen)

### Phase 2: Fragenbank + Uebungs-Engine
- Fragen aus Gruppen-Sheet laden
- Block-Zusammenstellung (7 Thema + 2 Luecken + 1 Check)
- Fragetypen-Rendering (MC, Fill, Calc, Sort, etc.)
- Antwort-Feedback (richtig/falsch + Erklaerung)

### Apps Script Backend (noch nicht implementiert)
- `lernplattformLogin` / `lernplattformValidiereToken`
- `lernplattformLadeGruppen` / `lernplattformErstelleGruppe`
- `lernplattformLadeMitglieder` / `lernplattformEinladen`
- `lernplattformGeneriereCode` / `lernplattformCodeLogin`
- Gruppen-Registry Sheet anlegen

### Google Sheets Setup
- Gruppen-Registry Sheet erstellen (zentral)
- Pro Gruppe: Fragenbank-Sheet + Analytik-Sheet
- Tabs gemaess Spec (Fortschritt, Sessions, Auftraege, Antworten)

---

## Commits (Phase 1)

1. Projekt-Scaffolding (React 19 + Vite + Tailwind)
2. Auth- und Gruppen-Typen
3. Service-Interfaces + API-Client mit Tests
4. Auth-Service + Auth-Store mit Tests
5. Gruppen-Store + Apps-Script-Adapter mit Tests
6. UI-Komponenten (Login, Gruppen, Dashboard-Shell)
7. GitHub Actions Deploy-Workflow erweitert
