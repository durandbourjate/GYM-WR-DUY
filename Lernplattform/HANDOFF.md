# Lernplattform — HANDOFF

## Aktueller Stand

**Branch:** `main`
**Phase:** 4 von 7 (Eltern-/LP-Dashboard)
**Status:** Implementation abgeschlossen, 64 Tests gruen, Build gruen

### Verifikation (03.04.2026)

| Check | Status |
|-------|--------|
| `npx tsc -b` | OK |
| `npx vitest run` | 64 Tests gruen (8 Testdateien) |
| `npm run build` | OK (dist/ erstellt, 247 KB JS) |
| Pruefungstool Regression | 193 Tests gruen, tsc OK |

---

## Phase 1 (02.04.2026) — Grundgeruest + Auth + Gruppen
Scaffolding, Auth (Google OAuth + Code), Gruppen-System. 17 Tests.

## Phase 2 (03.04.2026) — Fragenbank + Uebungs-Engine
8 Fragetypen, Block-Builder, UebungsScreen, Zusammenfassung, Mock-Daten. +22 Tests = 39.

## Phase 3 (03.04.2026) — Fortschritt + Mastery
Mastery-System (neu→ueben→gefestigt→gemeistert), Fortschritt-Store (localStorage),
priorisierter Block-Builder, Dashboard Fortschrittsbalken. +25 Tests = 64.

## Phase 4 (03.04.2026) — Eltern-/LP-Dashboard

| Task | Beschreibung |
|------|-------------|
| 1 | Mock-Mitglieder-Daten (3 Kinder, Fortschritte, Sessions) |
| 2 | AdminDashboard mit 3-Ebenen Navigation |
| 3 | AdminUebersicht: Alle Kinder mit Fach-Fortschrittsbalken |
| 4 | AdminKindDetail: Sessions, Dauerbaustellen, Themen-Drill-Down |
| 5 | AdminThemaDetail: Einzelne Fragen mit Mastery + Versuche |
| 6 | App.tsx: Admin-Routing (Admin-Modus Toggle, Ueben-Button) |

### Admin-Dashboard 3 Ebenen

**Ebene 1 — Uebersicht (alle Kinder):**
- Pro Kind: Fach-Fortschrittsbalken (gruen/blau/gelb)
- Sessions-Anzahl, gemeisterte Fragen
- Klick → Ebene 2

**Ebene 2 — Kind-Detail:**
- 7-Tage-Statistik (Sessions, Fragen, Quote)
- Dauerbaustellen-Warnung (>=10 Versuche, <50%)
- Themen nach Fach mit Mastery-Verteilung
- Session-Historie
- Klick → Ebene 3

**Ebene 3 — Thema-Detail:**
- Gesamt-Statistik (Versuche, richtig, Quote)
- Einzelne Fragen mit Mastery-Label + Detail (Versuche, richtigInFolge, Sessions)

### Admin-Routing

- Admin erkennt sich ueber `aktiveGruppe.adminEmail === user.email`
- Admin startet im Admin-Dashboard
- "Ueben"-Button wechselt zum normalen Dashboard
- "Admin-Dashboard"-FAB wechselt zurueck
- Lernende sehen nur das normale Dashboard

### Architektur (nach Phase 4)

```
Lernplattform/src/
├── types/           # auth, gruppen, fragen, uebung, fortschritt
├── services/        # interfaces, apiClient, authService
├── adapters/        # appsScriptAdapter, mockDaten, mockMitgliederDaten
├── store/           # authStore, gruppenStore, uebungsStore, fortschrittStore
├── utils/           # korrektur, blockBuilder, shuffle, mastery
├── components/
│   ├── fragetypen/  # 8 Komponenten + Registry
│   ├── admin/       # AdminDashboard, AdminUebersicht, AdminKindDetail, AdminThemaDetail
│   ├── LoginScreen, GruppenAuswahl, Dashboard
│   ├── UebungsScreen, Zusammenfassung
│   └── AdminLayout (deprecated, ersetzt durch admin/)
├── App.tsx
└── __tests__/       # 8 Testdateien, 64 Tests
```

---

## Was fehlt (naechste Phasen)

### Phase 5: Auftraege + Empfehlungen
- Admin erstellt Auftraege (Fach/Thema/Frist)
- System empfiehlt: groesste Luecke, Festigung, aktiver Auftrag
- Empfehlungs-Karten im Dashboard

### Phase 6: Gamification + Kinder-UX
- Sterne (0-3 pro Thema), Streaks, Session-Zusammenfassung
- Touch-Optimierung, groessere Schrift, froehliches Feedback

### Phase 7: Gym-Pool-Migration
- Bestehende 27 Pools in Sheets migrieren

### Apps Script Backend (noch nicht implementiert)
- Alle `lernplattform*` Endpoints
- Gruppen-Registry + Sheets
- Fortschritt + Analytik server-seitig
