# HANDOFF.md — Prüfungsplattform

> Digitale Prüfungsplattform für Wirtschaft & Recht am Gymnasium Hofwil.
> Stack: React 19 + TypeScript + Vite + Zustand + Tailwind CSS v4 + Tiptap
> Spec: `Pruefung/Pruefungsplattform_Spec_v2.md`

## Aktueller Stand

**Phase 2f: Navigation, Orientierung & Abgabe-Zusammenfassung** (17.03.2026)

### Was funktioniert
- Startbildschirm mit Prüfungsinfo + Sitzungswiederherstellung
- **4 Fragetypen:** MC (Einzel-/Mehrfachauswahl), Freitext (Tiptap), Lückentext, **Zuordnung (NEU)**
- Fragennavigation mit Kacheln (✓ beantwortet, ? unsicher, — offen)
- Timer mit Countdown + Warnungen (15 Min. orange, 5 Min. rot)
- Auto-Save: LocalStorage (sofort) + IndexedDB (15s) + Remote via Apps Script (30s, konfigurierbar)
- Light/Dark Mode: System-Erkennung + manueller Toggle
- Abgabe-Dialog mit Bestätigung + Statusübersicht
- 7 Demo-Fragen (3 MC, 3 Freitext, 1 Lückentext)
- GitHub Actions Deploy
- **NEU: Login-Screen** (Google OAuth + Schülercode-Fallback + Demo-Modus)
- **NEU: Auth-Store** (Session via sessionStorage, Rollen-Erkennung aus E-Mail-Domain)
- **NEU: API-Service** (Interface für Google Apps Script Backend)
- **NEU: URL-basierte Prüfungs-ID** (`?id=PRUEFUNGS_ID` → lädt Config vom Backend)
- **NEU: User-Info** in Sidebar und Abgabe-Bestätigung
- **NEU: Monitoring-Hook** (`usePruefungsMonitoring`) — zentraler Hook für Auto-Save, Remote-Save, Heartbeat, Focus-Detection, Online/Offline
- **NEU: SEB-Erkennung** (User-Agent-Check + Warnbanner wenn nicht im SEB)
- **NEU: Focus-Detection** (visibilitychange → Unterbrechungen >2s werden protokolliert)
- **NEU: Heartbeat-Monitoring** (konfigurierbares Intervall, Ausfälle werden protokolliert)
- **NEU: Online/Offline-Events** (Browser-Events → automatischer Status-Wechsel)
- **NEU: LP-Monitoring-Dashboard** (Live-Übersicht aller SuS: Status, Fortschritt, Heartbeats, Unterbrechungen)
- **NEU: Rollen-Routing** (LP → Dashboard, SuS → Prüfung, automatisch via E-Mail-Domain)
- **NEU: GitHub Actions** Env-Variablen für Pruefung-Build (Secrets)
- **NEU: ZuordnungFrage** (Dropdown-basierte Zuordnung, gemischte Reihenfolge, Fortschrittsanzeige)
- **NEU: Verbesserte Abgabe** (PruefungsAbgabe-Objekt mit Meta-Daten: SEB, Browser, Heartbeats, Unterbrechungen)
- **NEU: Abgabe-Dialog** mit Sende-Status (bereit → senden → erfolg/fehler), Retry bei Fehler, localStorage-Fallback
- **NEU: Retry-Queue** (IndexedDB-basiert, fehlgeschlagene Remote-Saves werden bei Reconnect nachgesendet)
- **NEU: 8 Demo-Fragen** (3 MC, 3 Freitext, 1 Lückentext, 1 Zuordnung) in 4 Abschnitten
- **NEU: Zeitablauf-Auto-Abgabe** (Timer sendet Daten an Backend + localStorage-Backup + Banner)
- **NEU: beforeunload-Warnung** (verhindert versehentliches Tab-Schliessen während Prüfung)
- **NEU: Tastaturnavigation** (← → / Ctrl+← → für Fragen, Escape für Dialog)
- **NEU: Verbesserter Startbildschirm** (Punkte pro Abschnitt, User-Info, SEB-Blockade, Keyboard-Hinweis)
- **NEU: Abschnitt-Header im Fragenfluss** (prominenter Titel bei erster Frage, kompakter Kontext danach)
- **NEU: Fortschrittsbalken im Header** (1px-Balken zeigt Gesamtfortschritt)
- **NEU: Verbesserte FragenÜbersicht** (Fortschrittsbalken pro Abschnitt, Punkte, Detail-Info je Fragetyp)
- **NEU: Abgabe-Zusammenfassung** (Read-only Ansicht aller Fragen + Antworten, Druck-optimiert, "Meine Antworten ansehen"-Button)
- **NEU: Druckansicht** (@media print Styles für sauberen PDF-Export der Zusammenfassung)

### Auth-Flow
1. Kein User → LoginScreen (Google-Button / Schülercode / Demo)
2. Google Login → JWT dekodiert → E-Mail-Domain bestimmt Rolle (SuS/LP)
3. Session in sessionStorage (überlebt Reload, nicht Tab-Schliessung)
4. Wenn `VITE_APPS_SCRIPT_URL` gesetzt + `?id=...` in URL → Prüfung vom Backend laden
5. Sonst → Demo-Prüfung (wie bisher)

### UI-Design-Entscheide (vom User bestätigt)
- **Neutrales Farbschema:** Weiss/Grau/Schwarz als Basis, kein Blau für Buttons
- **Fachbereich-Farben:** Nur dezent in Badges (VWL orange, BWL blau, Recht grün)
- **Navigation-Icons:** ✓ grün (beantwortet), ? amber (unsicher), neutral (offen)
- **Alle Buttons in Kopfzeile:** ← Zurück | 3/7 | Weiter → | Unsicher | Abgeben | ☀/🌙
- **Freitext:** Auto-Focus, Überschrift-Button (H2), --> → Autokorrektur
- **Hoher Kontrast:** Besonders wichtig bei Prüfungen (Lesbarkeit)
- **Sortierung:** Nur durch Lehrperson (Abschnitte in PruefungsConfig), SuS nicht

### Offene User-Wünsche (für spätere Iterationen)
- Textfeld-Höhe: User möchte testen ob auto-grow oder begrenzter Bereich mit Scrollen besser ist
- Tablet-/Smartphone-Optimierung: grundsätzlich responsive, aber noch nicht spezifisch getestet

## Verzeichnisstruktur

```
Pruefung/
├── src/
│   ├── App.tsx                          — Auth-Gate + Rollen-Routing (LP→Dashboard, SuS→Prüfung)
│   ├── index.css                        — Tailwind + Tiptap-Styles + Dark-Mode-Kontrast
│   ├── main.tsx
│   ├── types/
│   │   ├── fragen.ts                    — FrageBase, MCFrage, FreitextFrage, LueckentextFrage, etc.
│   │   ├── pruefung.ts                  — PruefungsConfig, PruefungsAbschnitt
│   │   ├── antworten.ts                 — PruefungsAbgabe, Antwort-Union-Typ
│   │   ├── auth.ts                      — AuthUser, Rolle
│   │   └── monitoring.ts                — SchuelerStatus, MonitoringDaten (NEU)
│   ├── store/
│   │   ├── pruefungStore.ts             — Zustand-Store (Antworten, Navigation, Phase)
│   │   ├── authStore.ts                 — Auth-State: User, Demo, Login/Logout (NEU)
│   │   └── themeStore.ts                — Light/Dark/System Mode mit Persist
│   ├── data/
│   │   ├── demoFragen.ts                — 8 Demo-Fragen (inkl. Zuordnung)
│   │   ├── demoPruefung.ts              — Demo-PruefungsConfig (45 Min, 4 Abschnitte)
│   │   └── demoMonitoring.ts            — Demo-Monitoring-Daten für LP-Dashboard (NEU)
│   ├── hooks/
│   │   ├── usePruefungsMonitoring.ts    — Zentraler Monitoring-Hook (NEU)
│   │   └── usePruefungsUX.ts           — beforeunload, Tastaturnavigation (NEU)
│   ├── services/
│   │   ├── autoSave.ts                  — IndexedDB Backup
│   │   ├── remoteSave.ts                — Mock für Remote-Save (Phase 1)
│   │   ├── sebService.ts               — SEB User-Agent Erkennung (NEU)
│   │   ├── retryQueue.ts              — IndexedDB Retry-Queue für fehlgeschlagene Saves (NEU)
│   │   ├── authService.ts              — Google Identity Services Wrapper
│   │   └── apiService.ts               — Apps Script API Client
│   ├── components/
│   │   ├── lp/
│   │   │   ├── MonitoringDashboard.tsx  — LP-Dashboard: Live-Übersicht aller SuS (NEU)
│   │   │   └── SchuelerZeile.tsx        — Einzelne SuS-Zeile mit Detail-Panel (NEU)
│   │   ├── LoginScreen.tsx              — Google OAuth + Schülercode + Demo
│   │   ├── Layout.tsx                   — Header + Sidebar (mit User-Info) + Main
│   │   ├── Startbildschirm.tsx          — Prüfungsinfo + Start-Button
│   │   ├── FragenNavigation.tsx         — Kacheln mit Icons + Legende + fachbereichFarbe()
│   │   ├── FragenUebersicht.tsx         — Alle Fragen mit Status + Fortschritt pro Abschnitt
│   │   ├── AbgabeZusammenfassung.tsx   — Read-only Antworten-Review, druckbar (NEU)
│   │   ├── Timer.tsx                    — Countdown mit Warnstufen
│   │   ├── VerbindungsStatus.tsx        — Online/Offline-Indikator
│   │   ├── AutoSaveIndikator.tsx        — "Gespeichert ✓" Fade-Animation
│   │   ├── AbgabeDialog.tsx             — Abgabe mit Sende-Status, Retry, Meta-Daten
│   │   ├── ThemeToggle.tsx              — ☀/🌙 Button
│   │   └── fragetypen/
│   │       ├── MCFrage.tsx              — MC mit neutraler Selektion
│   │       ├── FreitextFrage.tsx        — Tiptap + Heading + ArrowReplace + Auto-Focus
│   │       ├── LueckentextFrage.tsx     — Inline-Inputs
│   │       └── ZuordnungFrage.tsx      — Dropdown-Zuordnung mit Fortschritt (NEU)
│   └── utils/
│       ├── abschnitte.ts               — findeAbschnitt(), berechneAbschnittFortschritt() (NEU)
│       ├── markdown.ts                  — Einfacher Markdown→HTML Renderer
│       └── zeit.ts                      — Timer-Hilfsfunktionen
├── .env.example                         — Template für Environment-Variablen (NEU)
├── Google_Workspace_Setup.md            — Anleitung: OAuth + Sheets + Apps Script (NEU)
├── Pruefungsplattform_Spec_v2.md        — Gesamtspezifikation
├── Auftrag_Pruefungsplattform_Phase1.md — Phase-1-Auftrag (erledigt)
└── HANDOFF.md                           — Dieses Dokument
```

## Environment-Variablen

| Variable | Beschreibung | Wo setzen |
|----------|-------------|-----------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client-ID | `.env.local` (lokal) / GitHub Secrets (prod) |
| `VITE_APPS_SCRIPT_URL` | Apps Script Web-App URL | `.env.local` (lokal) / GitHub Secrets (prod) |

Ohne diese Variablen funktioniert die App im **Demo-Modus** (Schülercode + Demo-Prüfung).

## Nächste Schritte (Phase 3)

Der User muss zuerst die **Google_Workspace_Setup.md** abarbeiten:
1. Google Cloud Projekt + OAuth Client-ID erstellen
2. Google Sheets anlegen (Fragenbank, Klassenlisten, Configs)
3. Apps Script deployen (inkl. Monitoring-Endpoint)
4. `.env.local` mit Client-ID + Apps Script URL befüllen
5. GitHub Actions Secrets setzen (`VITE_GOOGLE_CLIENT_ID`, `VITE_APPS_SCRIPT_URL`)

Danach:
1. End-to-End-Test mit echtem Backend (Remote-Save + Heartbeat + Monitoring)
2. SEB-Konfigurationsdatei (.seb) für Gymnasium Hofwil erstellen
3. Tablet-/Smartphone-Tests
4. Prüfungs-Composer (LP erstellt Prüfungen via UI)
5. KI-Korrektur (Claude API für Freitext-Bewertung)

## Commits

| Commit | Beschreibung |
|--------|-------------|
| `de498e7` | Phase 1: Projekt-Setup, MC+Freitext+Lückentext, Auto-Save, Demo-Modus (35 Dateien) |
| `70624b5` | UI-Überarbeitung: Kontrast, neutrales Farbschema, Header-Buttons, Freitext-Features (14 Dateien) |
| *pending* | Phase 2a: Google OAuth Login, Auth-Store, API-Service, LoginScreen, URL-Param (10 Dateien) |
| *pending* | Phase 2b: Monitoring-Hook, SEB-Erkennung, Focus-Detection, Heartbeat, Remote-Save (4 Dateien) |
| *pending* | Phase 2c: LP-Monitoring-Dashboard, GitHub Actions Env-Vars, Rollen-Routing (8 Dateien) |
| `c95d83d` | Phase 2d: ZuordnungFrage, verbesserte Abgabe mit Meta-Daten, Retry-Queue (6 Dateien) |
| `44ec263` | Phase 2e: Zeitablauf-Remote-Abgabe, beforeunload, Tastaturnavigation, Startbildschirm (5 Dateien) |
| *pending* | Phase 2f: Abschnitt-Header, Fortschrittsbalken, FragenÜbersicht, Abgabe-Zusammenfassung (6 Dateien) |
