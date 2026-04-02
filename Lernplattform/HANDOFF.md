# Lernplattform — HANDOFF

## Aktueller Stand

**Branch:** `main`
**Phase:** 5 von 7 (Auftraege + Empfehlungen)
**Status:** Implementation abgeschlossen, 69 Tests gruen, Build gruen

### Verifikation (03.04.2026)

| Check | Status |
|-------|--------|
| `npx tsc -b` | OK |
| `npx vitest run` | 69 Tests gruen (9 Testdateien) |
| `npm run build` | OK (dist/ erstellt, 257 KB JS) |
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

## Phase 5 (03.04.2026) — Auftraege + Empfehlungen

| Task | Beschreibung |
|------|-------------|
| 1 | Auftrag-Typen (Auftrag, Empfehlung) |
| 2 | Empfehlungs-Utils: 3 Strategien (Auftrag, Luecke, Festigung) + 5 Tests |
| 3 | AuftragStore (localStorage, CRUD) |
| 4 | Dashboard: Empfehlungs-Karten oben (farbcodiert nach Typ) |
| 5 | AdminAuftraege: Erstellen (Fach/Thema/Frist/Ziel), Abschliessen, Loeschen |
| 6 | AdminDashboard: Tab-Leiste (Uebersicht / Auftraege) |

### Empfehlungs-Logik (max 3)

1. **Aktive Auftraege** (immer zuoberst, blau)
2. **Groesste Luecke** (Thema mit tiefstem Mastery-Score, gelb)
3. **Festigung** (Thema mit gefestigten Fragen, kurz vor gemeistert, gruen)

### Auftrag-System

- Admin erstellt Auftraege mit: Titel, Fach, Thema, Frist, Ziel-Mitglieder
- Auftraege erscheinen als Empfehlung im Lernenden-Dashboard
- Admin kann Auftraege abschliessen oder loeschen
- localStorage-persistiert (Backend kommt spaeter)

### Architektur (nach Phase 5)

```
Lernplattform/src/
├── types/           # auth, gruppen, fragen, uebung, fortschritt, auftrag
├── services/        # interfaces, apiClient, authService
├── adapters/        # appsScriptAdapter, mockDaten, mockMitgliederDaten
├── store/           # authStore, gruppenStore, uebungsStore, fortschrittStore, auftragStore
├── utils/           # korrektur, blockBuilder, shuffle, mastery, empfehlungen
├── components/
│   ├── fragetypen/  # 8 Komponenten + Registry
│   ├── admin/       # AdminDashboard, Uebersicht, KindDetail, ThemaDetail, Auftraege
│   ├── LoginScreen, GruppenAuswahl, Dashboard (mit Empfehlungen)
│   └── UebungsScreen, Zusammenfassung
├── App.tsx
└── __tests__/       # 9 Testdateien, 69 Tests
```

---

## Was fehlt (naechste Phasen)

### Phase 6: Gamification + Kinder-UX
- Sterne (0-3 pro Thema basierend auf Mastery-%)
- Streaks (Sessions in Folge)
- Session-Zusammenfassung aufwerten
- Touch-Optimierung, groessere Schrift
- Froehliches Feedback (variierend)

### Phase 7: Gym-Pool-Migration
- Bestehende 27 Pools in Sheets migrieren

### Apps Script Backend (noch nicht implementiert)
- Alle `lernplattform*` Endpoints
- Gruppen-Registry + Sheets
- Fortschritt + Analytik + Auftraege server-seitig
