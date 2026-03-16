# Prüfungsplattform WR — Technische Spezifikation v2.0

> **Projekt:** Digitale Prüfungsplattform für Wirtschaft & Recht  
> **Variante:** C — Hybrid (React-Frontend + Google Sheets Backend)  
> **Stand:** 16. März 2026  
> **Zieltermin Pilottest:** SoSe 2026

---

## 1. Systemübersicht

### 1.1 Architektur

| Komponente | Technologie | Hosting |
|---|---|---|
| Prüfungs-App (SuS-seitig) | React + TypeScript + Zustand | GitHub Pages (öffentlich, nur Code) |
| Prüfungs-Composer (LP-seitig) | React + TypeScript | GitHub Pages (gleiche App, LP-Modus via Auth) |
| Lockdown-Browser | Safe Exam Browser (SEB) | Lokal auf BYOD-Laptops |
| Datenspeicherung (Antworten) | Google Sheets via Apps Script | Google Workspace (gymhofwil.ch) |
| Fragenbank | Google Sheets (geschützt) | Google Workspace (gymhofwil.ch) |
| Prüfungs-Configs | Google Sheets (geschützt) | Google Workspace (gymhofwil.ch) |
| Klassenlisten | Google Sheets (geschützt) | Google Workspace (gymhofwil.ch) |
| Authentifizierung | Google OAuth 2.0 (Schul-E-Mail) | Google Identity Services |
| KI-Korrektur (summativ) | Claude API (Batch) | Lokales Script oder Apps Script |
| KI-Korrektur (formativ) | Claude API via Apps Script | Google Apps Script |

### 1.2 Trennung Code vs. Daten (Datenschutz)

**Grundprinzip:** Der App-Code ist öffentlich auf GitHub (Open Source, wie bei den Übungspools). Alle Daten (Fragen, Prüfungen, Antworten, Schülerlisten) liegen geschützt in Google Workspace und sind niemals im Repo.

```
GitHub (öffentlich)              Google Workspace (geschützt)
─────────────────────            ──────────────────────────────
├── src/                         ├── [Sheet] Fragenbank
│   ├── components/              │   ├── Tab: VWL
│   ├── fragetypen/              │   ├── Tab: BWL
│   ├── auth/                    │   ├── Tab: Recht
│   └── ...                      │   └── Tab: Informatik
├── public/                      ├── [Sheet] Prüfungs-Configs
└── README.md                    ├── [Sheet] Klassenlisten
                                 │   ├── Tab: 28abcd WR (SF)
    Keine Fragen!                │   ├── Tab: 27abcd WR (SF)
    Keine Configs!               │   ├── Tab: 29c WR (EWR)
    Keine Schülerdaten!          │   └── ...
                                 ├── [Sheet] Antworten_28abcd_S4_2026
                                 ├── [Sheet] Korrektur_28abcd_S4_2026
                                 └── [Ordner] Feedback-PDFs/
```

**Zugriff via Google Apps Script:** Die React-App kommuniziert mit einem deployed Apps Script (Web-App), das als Gatekeeper fungiert. Das Script prüft bei jedem Request die Google-Identität und liefert nur Daten, auf die der Nutzer Zugriff hat (SuS: nur eigene Prüfung; LP: alles).

### 1.3 Datenfluss

```
SuS-Laptop → SEB (Kiosk) → Prüfungs-App (React, GitHub Pages)
    ↓ Google OAuth → Identität verifiziert (@stud.gymhofwil.ch)
    ↓ App lädt Prüfungsfragen via Apps Script (nur für diese SuS freigegeben)
    ↓ Antworten: Auto-Save (LocalStorage + IndexedDB + Google Sheets)
    ↓ POST → Google Apps Script → Google Sheet (geschützt)
    
Summativ: Sheet → Claude API (Batch) → Korrekturvorschlag → LP Review → PDF
Formativ: Abgabe → Apps Script → Claude API → Sofort-Feedback → PDF
```

### 1.4 Modi der App

| Modus | Zugang | SEB erforderlich | Timer | KI-Feedback |
|---|---|---|---|---|
| **Prüfung summativ** | `@stud.gymhofwil.ch` + SEB | Ja | Ja (Countdown) | Nein (nach LP-Review) |
| **Prüfung formativ** | `@stud.gymhofwil.ch` + SEB | Optional | Optional | Ja (sofort) |
| **Übungsmodus** | `@stud.gymhofwil.ch` (kein SEB) | Nein | Nein | Ja (sofort) |
| **Composer (LP)** | `@gymhofwil.ch` | Nein | — | — |

Der **Übungsmodus** ergänzt die bestehenden Übungspools mit mächtigeren Fragetypen (Freitext mit KI-Feedback, Visualisierungen). SuS können über LearningView auf den Übungsmodus zugreifen. Ergebnisse fliessen in die Schwierigkeitsstatistik der Fragenbank.

---

## 2. Datenmodell Fragenbank

### 2.1 Speicherung in Google Sheets

Die Fragenbank lebt in einem geschützten Google Sheet mit einem Tab pro Fachbereich. Jede Zeile ist eine Frage. Spalten entsprechen den Feldern des Schemas. Komplexe Felder (Optionen, Bewertungsraster) werden als JSON-Strings in einer Zelle gespeichert.

**Vorteile gegenüber JSON-Dateien im Repo:**
- Kein Datenschutzrisiko (keine Fragen im öffentlichen Repo)
- Einfach manuell editierbar (für schnelle Korrekturen)
- Gleiche Infrastruktur wie Antworten-Speicherung
- Zugriff via Apps Script bereits implementiert

### 2.2 Frage-Schema (TypeScript Interface)

```typescript
// === FRAGE (Basis) ===
interface FrageBase {
  id: string;                          // z.B. "vwl-042", "recht-117"
  version: number;                     // Versionierung bei Überarbeitung
  erstelltAm: string;                  // ISO-Datum
  geaendertAm: string;                 // ISO-Datum
  
  // Inhaltliche Zuordnung
  fachbereich: "VWL" | "BWL" | "Recht" | "Informatik";
  thema: string;                       // z.B. "Marktgleichgewicht", "OR AT Vertragsabschluss"
  unterthema?: string;                 // z.B. "Mindestpreis", "Willensmängel"
  lehrplanziel?: string;               // Referenz zum Lehrplan 17
  semester: string[];                  // z.B. ["S3", "S4"] — wann die Frage passend ist
  gefaesse: ("SF" | "EF" | "EWR")[];  // In welchen Gefässen einsetzbar
  
  // Taxonomie
  bloom: "K1" | "K2" | "K3" | "K4" | "K5" | "K6";
  tags: string[];                      // Freie Tags: ["Diagramm", "Fallbeispiel", "Berechnung"]
  
  // Bewertung
  punkte: number;                      // Maximalpunktzahl
  musterlosung: string;                // Markdown-formatiert
  bewertungsraster: Bewertungskriterium[];
  
  // Metadaten aus Verwendung
  schwierigkeit?: number;              // 0.0–1.0, berechnet aus Durchschnittsergebnis
  streuung?: number;                   // Standardabweichung der Ergebnisse
  verwendungen: Verwendung[];          // Wann und wo eingesetzt
  
  // Herkunft
  quelle?: "pool" | "papier" | "manuell" | "ki-generiert";
  quellReferenz?: string;              // z.B. "Eisenhut 2021, Kap. 4.3" oder Pool-ID
}

interface Bewertungskriterium {
  beschreibung: string;                // z.B. "Diagramm korrekt gezeichnet"
  punkte: number;                      // Teilpunkte für dieses Kriterium
  stichworte?: string[];               // Erwartete Schlüsselbegriffe
}

interface Verwendung {
  datum: string;                       // ISO-Datum
  pruefungId: string;                  // Referenz zur Prüfung
  klasse: string;                      // z.B. "28abcd WR"
  typ: "summativ" | "formativ";
  durchschnitt?: number;               // Erreichte Punkte (Durchschnitt)
  n?: number;                          // Anzahl SuS
}

// === FRAGETYPEN ===

interface MCFrage extends FrageBase {
  typ: "mc";
  fragetext: string;                   // Markdown
  optionen: MCOption[];
  mehrfachauswahl: boolean;            // true = Checkbox, false = Radio
  zufallsreihenfolge: boolean;         // Optionen mischen
}

interface MCOption {
  id: string;                          // z.B. "a", "b", "c", "d"
  text: string;
  korrekt: boolean;
  feedback?: string;                   // Optionales Feedback pro Option (formativ)
}

interface FreitextFrage extends FrageBase {
  typ: "freitext";
  fragetext: string;                   // Markdown
  laenge: "kurz" | "mittel" | "lang"; // kurz=1-3 Sätze, mittel=Absatz, lang=halbe Seite+
  maxZeichen?: number;                 // Optional: Zeichenlimit
  hilfstextPlaceholder?: string;       // Placeholder im Textfeld
}

interface ZuordnungFrage extends FrageBase {
  typ: "zuordnung";
  fragetext: string;
  paare: { links: string; rechts: string }[];
  zufallsreihenfolge: boolean;
}

interface LueckentextFrage extends FrageBase {
  typ: "lueckentext";
  textMitLuecken: string;             // Lücken markiert als {{1}}, {{2}}, ...
  luecken: {
    id: string;
    korrekteAntworten: string[];       // Mehrere akzeptierte Varianten
    caseSensitive: boolean;
  }[];
}

interface VisualisierungFrage extends FrageBase {
  typ: "visualisierung";
  untertyp: "zeichnen" | "diagramm-manipulieren" | "schema-erstellen";
  fragetext: string;
  ausgangsdiagramm?: DiagrammConfig;   // Für "diagramm-manipulieren"
  canvasConfig?: CanvasConfig;         // Für "zeichnen"
}

interface DiagrammConfig {
  typ: "angebot-nachfrage" | "konjunkturzyklus" | "bilanz" | "custom";
  achsen?: { x: string; y: string };
  elemente?: DiagrammElement[];
}

interface CanvasConfig {
  breite: number;
  hoehe: number;
  koordinatensystem: boolean;
  achsenBeschriftung?: { x: string; y: string };
  werkzeuge: ("stift" | "linie" | "pfeil" | "text" | "rechteck")[];
}

type Frage = MCFrage | FreitextFrage | ZuordnungFrage | LueckentextFrage | VisualisierungFrage;
```

### 2.3 Prüfungs-Config Schema

```typescript
interface PruefungsConfig {
  id: string;                          // z.B. "28abcd-wr-sem-s4-2026"
  titel: string;                       // z.B. "Semesterprüfung S4 — VWL/Recht"
  
  // Zuordnung
  klasse: string;                      // z.B. "28abcd WR"
  gefaess: "SF" | "EF" | "EWR";
  semester: string;
  fachbereiche: string[];
  datum: string;                       // ISO-Datum
  
  // Prüfungsparameter
  typ: "summativ" | "formativ";
  modus: "pruefung" | "uebung";       // Übungsmodus: kein SEB, kein Timer
  dauerMinuten: number;
  gesamtpunkte: number;
  
  // Authentifizierung
  erlaubteKlasse: string;             // Klassenbezeichnung → Abgleich mit Klassenliste
  erlaubteEmails?: string[];          // Optional: explizite Liste (Nachprüfung etc.)
  
  // SEB-Konfiguration
  sebErforderlich: boolean;
  sebCustomUserAgent?: string;
  
  // Fragen
  abschnitte: PruefungsAbschnitt[];
  
  // Navigation & Darstellung
  zufallsreihenfolgeFragen: boolean;
  ruecknavigation: boolean;            // Standard: true (frei navigierbar)
  zeitanzeigeTyp: "countdown" | "verstricheneZeit" | "keine";
  
  // Auto-Save
  autoSaveIntervallSekunden: number;   // Standard: 30
  heartbeatIntervallSekunden: number;  // Standard: 10
  
  // KI-Korrektur
  korrektur: {
    aktiviert: boolean;
    modus: "sofort" | "batch";
    systemPrompt?: string;
  };
  
  // Feedback
  feedback: {
    zeitpunkt: "sofort" | "nach-review" | "manuell";
    format: "in-app-und-pdf" | "pdf" | "in-app";
    detailgrad: "nur-punkte" | "punkte-und-kommentar" | "vollstaendig";
  };
  
  // Vorlage
  vorlageVon?: string;                // ID einer früheren Prüfung als Basis
}

interface PruefungsAbschnitt {
  titel: string;                       // z.B. "Teil A: VWL"
  beschreibung?: string;
  fragenIds: string[];
  punkteOverrides?: Record<string, number>;
}
```

### 2.4 Antwort-Schema

```typescript
interface PruefungsAbgabe {
  pruefungId: string;
  email: string;                       // Verifiziert via Google OAuth (@stud.gymhofwil.ch)
  name: string;                        // Aus Google-Profil
  schuelerId?: string;                 // 4-stelliger Code (Fallback)
  
  startzeit: string;                   // ISO-Timestamp
  abgabezeit: string;
  
  antworten: Record<string, Antwort>;  // Key = Frage-ID
  
  meta: {
    sebVersion?: string;
    browserInfo: string;
    autoSaveCount: number;
    netzwerkFehler: number;
    heartbeats: number;                // Anzahl erfolgreicher Heartbeats
    unterbrechungen: Unterbrechung[];  // SEB-Integritätsprüfungen
  };
}

interface Unterbrechung {
  zeitpunkt: string;                   // ISO-Timestamp
  dauer_sekunden: number;
  typ: "heartbeat-ausfall" | "focus-verloren" | "seb-warnung";
}

type Antwort = 
  | { typ: "mc"; gewaehlteOptionen: string[] }
  | { typ: "freitext"; text: string; formatierung?: string }  // Formatierung als einfaches Markdown
  | { typ: "zuordnung"; zuordnungen: Record<string, string> }
  | { typ: "lueckentext"; eintraege: Record<string, string> }
  | { typ: "visualisierung"; daten: string; bildLink?: string };  // Canvas als Base64 → Google Drive Link
```

### 2.5 Bilder und Visualisierungen speichern

Canvas-Zeichnungen und Diagramm-Manipulationen werden als **Base64-PNG** vom Client erzeugt. Da Google Sheets keine eingebetteten Bilder in Zellen unterstützt:

1. Die App konvertiert den Canvas-Zustand in einen Base64-PNG-String
2. Der Apps Script-Endpoint nimmt den String entgegen
3. Das Script speichert das Bild als Datei in Google Drive (in einem geschützten Ordner)
4. Der Google-Drive-Link wird in der Sheet-Zelle gespeichert
5. Für KI-Korrektur und PDF-Feedback wird das Bild über den Link geladen

Zusätzlich wird der **JSON-Zustand** des Canvas (Positionen der gezeichneten Elemente) im Sheet gespeichert, damit die Zeichnung bei Bedarf rekonstruiert werden kann.

---

## 3. Authentifizierung und Sicherheit

### 3.1 Google OAuth 2.0 Flow

```
1. SuS öffnet Prüfungs-URL im SEB
2. App prüft: Läuft im SEB? (User-Agent-Check + SEB JS API)
3. App zeigt "Mit Schul-E-Mail anmelden"
4. Google OAuth Popup → SuS meldet sich mit @stud.gymhofwil.ch an
5. App erhält: E-Mail, Name, Profilbild
6. App prüft via Apps Script: E-Mail in Klassenliste für diese Prüfung?
7. ✓ → Prüfung startet
   ✗ → Fehlermeldung "Kein Zugang zu dieser Prüfung"
```

### 3.2 Domain-Trennung

| Rolle | E-Mail-Domain | Zugang |
|---|---|---|
| SuS | `@stud.gymhofwil.ch` | Prüfung ablegen, Übungsmodus |
| Lehrperson | `@gymhofwil.ch` | Prüfungs-Composer, Korrektur, Monitoring |

Die App erkennt anhand der Domain automatisch die Rolle und zeigt die entsprechende Oberfläche.

### 3.3 Fallback: Schülercode

Falls Google OAuth im SEB Probleme macht (z.B. Pop-up-Blocker):
- 4-stelliger Schülercode als Eingabefeld
- Abgleich mit hinterlegter Liste in der Klassenliste
- Weniger sicher, aber funktional als Notlösung

### 3.4 SEB-Integration und Monitoring

**SEB-Konfiguration (.seb Datei):**
```json
{
  "startURL": "https://durandbourjate.github.io/GYM-WR-DUY/Pruefung/?id=PRUEFUNGS_ID",
  "browserUserAgentSuffix": "HOFWIL-EXAM-2026",
  "allowQuit": false,
  "quitURLConfirm": true,
  "quitURL": "https://durandbourjate.github.io/GYM-WR-DUY/Pruefung/done",
  "enableURLFilter": true,
  "URLFilterRules": [
    { "action": "allow", "expression": "durandbourjate.github.io/*" },
    { "action": "allow", "expression": "accounts.google.com/*" },
    { "action": "allow", "expression": "*.googleapis.com/*" },
    { "action": "allow", "expression": "script.google.com/*" },
    { "action": "block", "expression": "*" }
  ]
}
```

**Zweite Sicherheitsstufe (App-seitiges Monitoring):**

Zusätzlich zum SEB-Kiosk-Modus überwacht die App selbst die Prüfungsintegrität:

| Mechanismus | Funktion |
|---|---|
| **Heartbeat** | Alle 10 Sekunden sendet die App ein Signal ans Google Sheet. Aussetzer werden mit Timestamp protokolliert. |
| **Focus-Detection** | `document.visibilityState`-API erkennt, wenn das Browserfenster den Fokus verliert (im SEB normalerweise nicht möglich, aber als Zusatzsicherung). |
| **SEB JS API** | Die App fragt den Browser Exam Key (BEK) ab, um sicherzustellen, dass die SEB-Konfiguration nicht manipuliert wurde. |
| **Verbindungslog** | Alle Auto-Saves und Heartbeats werden mit Timestamps gespeichert → LP kann nach der Prüfung den Verlauf jeder SuS-Sitzung nachvollziehen. |

**LP-Monitoring-Ansicht:** Im Composer-Modus während einer laufenden Prüfung sieht die LP:
- Wer ist eingeloggt und aktiv (grüner Punkt = Heartbeat OK)
- Wer hat bereits abgegeben
- Wer hat Verbindungsprobleme (oranges Warnsymbol)
- Unterbrechungs-Protokoll pro SuS nach der Prüfung

### 3.5 SEB-Installation (Vorbereitung)

SEB ist noch nicht flächendeckend installiert. Vor der ersten digitalen Prüfung mit einer Klasse:

1. **SEB-Einrichtungssession** einplanen (15 Min. Unterrichtszeit)
2. SuS installieren SEB (kostenlos, Windows + macOS)
3. Test mit einer kurzen .seb-Konfiguration (Testseite)
4. Typische Probleme klären (Antivirus-Warnung, Admin-Rechte)
5. Idealerweise 1 Woche vor der Prüfung durchführen

---

## 4. Prüfungs-Interface (SuS-Ansicht)

### 4.1 Navigation

Die SuS können **frei zwischen allen Fragen navigieren** (Standardeinstellung, konfigurierbar).

**Navigationsleiste (oben oder Seitenleiste):**
- Nummerierte Fragenübersicht als kompakte Kacheln
- Farbcode: grau = nicht beantwortet, grün = beantwortet, orange = markiert als «unsicher»
- Klick auf Kachel → direkt zur Frage
- «Übersicht»-Button → zeigt alle Fragen auf einer Seite mit Status und Wortanzahl pro Freitext

**Navigation innerhalb der Prüfung:**
- «Zurück» / «Weiter» Buttons pro Frage
- Direkte Navigation via Kacheln (kein linearer Zwang)
- Abschnitte visuell getrennt (z.B. «Teil A: VWL», «Teil B: Recht»)

### 4.2 Freitext-Eingabefeld (Schwerpunkt)

Da offene Fragen den Schwerpunkt bilden, erhält das Eingabefeld besondere Aufmerksamkeit:

- **Grosses Textarea:** Mindestens 60% der Bildschirmhöhe, resizable (SuS kann vergrössern)
- **Einfache Formatierung:** Toolbar mit fett, kursiv, unterstrichen, Aufzählung (nummeriert + Punkte). Umsetzung via einfaches Markdown oder einen leichtgewichtigen Rich-Text-Editor (z.B. Tiptap)
- **Zeichenzähler:** Live-Anzeige der geschriebenen Zeichen / Wörter
- **Auto-Save-Indikator:** Visuelles Signal (z.B. kleines grünes Häkchen + «Gespeichert um 10:34»), das bei jedem erfolgreichen Save kurz aufleuchtet
- **Keine Ablenkung:** Minimales UI drumherum, Fragetext oben fixiert (scrollt nicht mit)

### 4.3 Timer und Statusbar

- **Countdown** oder **verstrichene Zeit** (konfigurierbar)
- Warnung bei 15 Min. und 5 Min. Restzeit (visuell, kein Pop-up)
- Verbindungsstatus-Indikator: 🟢 Online / 🟡 Offline (puffert lokal)
- Abgabe-Button prominent, aber mit Bestätigungsdialog («Möchten Sie definitiv abgeben?»)

---

## 5. Auto-Save und Resilienz

### 5.1 Dreifache Speicherung

| Ebene | Speicherort | Intervall | Zweck |
|---|---|---|---|
| 1. Sofort | LocalStorage | Bei jedem Tastendruck (debounced, 2s) | Schutz bei Browser-Absturz |
| 2. Lokal | IndexedDB | Alle 15 Sekunden | Backup bei LocalStorage-Problemen |
| 3. Remote | Google Sheets (via Apps Script) | Alle 30 Sekunden + bei Abgabe | Persistente Speicherung |

### 5.2 Fehlerszenarien

| Szenario | Verhalten |
|---|---|
| **WLAN-Ausfall** | App arbeitet offline weiter. Antworten in LocalStorage + IndexedDB. Verbindungsstatus wechselt auf 🟡. Sobald Netz zurück: alle gepufferten Antworten nachsenden. |
| **Geräte-Absturz / SEB-Crash** | Beim Neustart SEB + Öffnen der Prüfungs-URL: App erkennt vorhandenen LocalStorage, stellt letzten Stand her. SuS sieht Meldung «Sitzung wiederhergestellt, Stand 10:34 Uhr». |
| **Apps-Script-Fehler** | App versucht 3× Retry mit exponentiellem Backoff. Falls alle fehlschlagen: Antworten bleiben lokal, Warnung an SuS. Nach Prüfungsende können lokal gepufferte Daten manuell übermittelt werden. |
| **Zwei Tabs offen** | Timestamp-basierte Konflikterkennung. Neuester Stand gewinnt. Warnung an SuS: «Prüfung ist in einem anderen Tab geöffnet.» |

### 5.3 Datenintegrität

- Jeder Save enthält einen **Versionszähler** und **Timestamp**
- Server-seitig: Apps Script akzeptiert nur Saves mit höherem Versionszähler
- SHA-256 Hash über die Antworten als Integritätsprüfung
- Nach Abgabe: Antworten werden auf «readonly» gesetzt, keine weiteren Änderungen möglich

---

## 6. Klassenlisten und Schülerverwaltung

### 6.1 Datenquelle

Es werden **keine** separaten Schülerlisten gepflegt. Stattdessen gibt es ein Google Sheet «Klassenlisten» mit einem Tab pro Klasse/Gefäss:

| E-Mail | Name | Vorname | Schülercode | Klasse |
|---|---|---|---|---|
| anna.muster@stud.gymhofwil.ch | Muster | Anna | 1234 | 28a |
| beat.beispiel@stud.gymhofwil.ch | Beispiel | Beat | 5678 | 28b |

**Befüllung:** Einmalig pro Schuljahr, basierend auf einem Export aus Evento oder einer bestehenden Klassenliste. Kann auch manuell gepflegt werden. Bei Klassenwechseln wird die Liste aktualisiert.

### 6.2 Nutzung im Prüfungs-Composer

Beim Erstellen einer Prüfung wählt die LP die Klasse (z.B. «28abcd WR»). Der Composer lädt automatisch die zugehörigen E-Mail-Adressen aus dem Klassenlisten-Sheet. Die LP kann einzelne SuS ausschliessen (z.B. dispensierte) oder hinzufügen (z.B. Nachprüfung für einzelne SuS).

---

## 7. KI-Korrektur Workflows

### 7.1 Token-Kalkulation

**Pro Freitext-Frage und SuS:**

| Komponente | Tokens |
|---|---|
| System-Prompt (Bewertungsraster, Anweisungen) | ~500 |
| Fragetext + Musterlösung | ~300 |
| SuS-Antwort | ~400 |
| **Input total** | **~1'200** |
| Output (Punkte + Begründung + Feedback) | ~300 |
| **Total pro Frage/SuS** | **~1'500** |

**Hochrechnung Semesterprüfung (SF, 20 SuS, 6 Freitext-Fragen):**

| Kennzahl | Wert |
|---|---|
| API-Calls | 120 (6 × 20) |
| Tokens total | ~180'000 |
| Kosten Sonnet 4.6 (Standard) | ~CHF 0.80 |
| Kosten Sonnet 4.6 (Batch API, 50% Rabatt) | ~CHF 0.40 |

**Jahresrechnung (alle Gefässe, ~12 summative Prüfungen):**

| Kennzahl | Wert |
|---|---|
| Tokens total | ~2.2 Mio. |
| Kosten mit Batch API | **~CHF 5–10 / Jahr** |
| + gelegentliche formative Tests | + ~CHF 2–5 / Jahr |

MC-Fragen werden automatisch korrigiert (0 Tokens). Die KI-Korrektur läuft über die **Claude API** (separates API-Guthaben auf platform.claude.com), nicht über das persönliche Claude-Abo.

### 7.2 Summativ (Batch nach Prüfung)

```
1. LP öffnet Korrektur-Ansicht im Composer
2. Klick «KI-Korrektur starten» → Apps Script iteriert über alle Abgaben:
   Pro Freitext-Frage:
     → System-Prompt mit Bewertungsraster + Musterlösung
     → User-Prompt mit SuS-Antwort
     → Claude API → { punkte, begruendung, feedback }
3. MC/Zuordnung/Lückentext: automatisch korrigiert (kein API-Call)
4. Ergebnisse im Korrektur-Sheet: Spalten für KI-Punkte, Begründung, Feedback
5. LP reviewt und passt an (Punkte ändern, Kommentare ergänzen)
6. Klick «Feedback generieren» → PDF pro SuS
7. Versand per E-Mail an @stud.gymhofwil.ch
```

**Claude API System-Prompt (Vorlage):**
```
Du bist Korrektor für eine Gymnasialprüfung im Fach Wirtschaft und Recht 
(Kanton Bern, Lehrplan 17). Bewerte die folgende Antwort anhand des 
Bewertungsrasters. Sei fair aber streng. Verwende Schweizer Hochdeutsch.

Frage: {fragetext}
Maximalpunktzahl: {punkte}
Musterlösung: {musterlosung}
Bewertungsraster:
{bewertungsraster}

Antworte im JSON-Format:
{
  "punkte": <number>,
  "begruendung": "<kurze Begründung für die LP>",
  "feedback": "<konstruktives Feedback für die/den SuS>"
}
```

### 7.3 Formativ (Sofort-Feedback)

Wird eher selten eingesetzt (API-Kosten laufen über persönliches Guthaben). Aber die Möglichkeit besteht:

```
1. SuS klickt "Abgeben"
2. App sendet Antworten an Apps Script
3. MC/Zuordnung/Lückentext: sofort automatisch ausgewertet
4. Freitext-Fragen: Apps Script → Claude API → Feedback
5. SuS sieht in der App:
   - MC: ✓/✗ + Erklärung pro Option
   - Freitext: KI-Kommentar + Hinweise zum Nachlesen
   - Kein Punktwert, nur formatives Feedback
6. PDF-Download verfügbar (auch für formatives Feedback)
```

---

## 8. Feedback-System

### 8.1 Summatives Feedback (PDF nach LP-Review)

**Inhalt des PDFs:**
- Kopfzeile: Prüfungstitel, Datum, Klasse, Name der/des SuS
- Pro Aufgabe:
  - Fragetext (gekürzt)
  - SuS-Antwort (bei Freitext: vollständiger Text; bei Zeichnungen: eingebettetes Bild)
  - Erreichte / maximale Punkte
  - Kommentar (von LP angepasster KI-Vorschlag)
- Gesamtpunktzahl und Note
- Allgemeine Hinweise (optional)

**Verteilung:** E-Mail an `@stud.gymhofwil.ch`; optional Upload in LearningView.

### 8.2 Formatives Feedback (PDF + In-App)

Auch beim formativen Kurztest wird ein **PDF generiert**, das die SuS herunterladen können:
- Fragen + eigene Antworten + KI-Feedback + Hinweise zum Nachlesen
- Keine Punkte/Note — nur Lernfeedback
- Sofort verfügbar nach Abgabe (Download-Button in der App)

### 8.3 LearningView-Integration (xAPI-Score)

Im **Übungsmodus** sendet die App einen Fortschritts-Score (0–100%) an LearningView via `window.parent.postMessage()` — genau wie bei den bestehenden Übungspools. Die SuS sehen in LearningView ihre Prozentzahl als Fortschrittsanzeige. Bei summativen Prüfungen wird kein xAPI-Score gesendet.

---

## 9. Prüfungs-Composer (LP-Tool)

### 9.1 Funktionen

| Funktion | Beschreibung |
|---|---|
| **Fragenbank durchsuchen** | Filter nach Fachbereich, Thema, Semester, Bloom, Typ, Tags |
| **Prüfung zusammenstellen** | Drag & Drop von Fragen in Abschnitte, Reihenfolge anpassen |
| **Klasse wählen** | Aus Klassenliste, einzelne SuS ein-/ausschliessen |
| **Vorlage laden** | Frühere Prüfung als Basis, Fragen austauschen/ergänzen |
| **Vorschau** | Prüfung so sehen, wie die SuS sie sehen werden |
| **Punkte anpassen** | Überschreibung der Standard-Punktzahl pro Frage |
| **Neue Frage erfassen** | Formular für manuelle Eingabe |
| **KI-Fragenvorschlag** | Thema + Bloom → Claude generiert Vorschlag → LP reviewt |
| **Papierprüfungen importieren** | Upload PDF/Docx → KI extrahiert Fragen → LP reviewt |
| **Prüfung exportieren** | → Digital (aktiviert für SuS) + Docx (Papier-Backup) |
| **Statistiken** | Schwierigkeit, Verwendungshäufigkeit, Bloom-Verteilung pro Prüfung |
| **Monitoring** | Während laufender Prüfung: Wer ist online, wer hat abgegeben |
| **Korrektur** | KI-Korrektur starten, Ergebnisse reviewen, PDF generieren |

### 9.2 Wiederverwendung von Prüfungen

Beim wiederholten Durchführen einer Prüfung zu einem Thema muss nicht von Grund auf neu erstellt werden:

1. LP öffnet eine **frühere Prüfung als Vorlage**
2. Fragen, Abschnitte, Punkteverteilung werden übernommen
3. LP kann einzelne Fragen **austauschen** (z.B. durch ähnliche Fragen zum selben Thema)
4. Neue Klasse zuweisen, Datum anpassen
5. Speichern als neue Prüfung (Original bleibt unverändert)

### 9.3 KI-gestützter Fragenimport (bestehende Prüfungen)

```
1. LP lädt PDF/Docx einer alten Papierprüfung hoch
2. Claude API extrahiert Fragen, Punkte, Musterlösung
3. LP reviewt jede extrahierte Frage:
   - Fachbereich, Thema, Bloom zuweisen
   - Fragetyp bestimmen
   - Musterlösung ergänzen/korrigieren
4. Fragen werden in die Fragenbank geschrieben
```

### 9.4 KI-gestützte Fragengenerierung

```
1. LP wählt: Fachbereich + Thema + Bloom-Stufe + Fragetyp
2. Optional: Lehrbuch-Referenz oder Lehrplanziel angeben
3. Claude API generiert 3–5 Vorschläge inkl. Musterlösung
4. LP wählt, bearbeitet, ergänzt
5. Übernahme in Fragenbank
```

---

## 10. Papier-Backup

Bei jeder summativen Prüfung wird ein **Docx-Export** generiert:

- Alle Fragen mit Platz für handschriftliche Antworten
- Separates Lösungsblatt mit Musterlösungen und Bewertungsraster
- LP druckt vor der Prüfung aus und hat es griffbereit

**Einsatzszenarien:**
- Technischer Totalausfall (WLAN, Server)
- Nachprüfungen für einzelne SuS
- SuS die aus berechtigten Gründen nicht digital prüfen können (Nachteilsausgleich etc.)
- Archivierung für die Schulleitung / Fachschaft

---

## 11. Datenschutz

### 11.1 Bewertung

Die Speicherung auf Google Sheets im Schul-Workspace (`gymhofwil.ch`) ist vertretbar:
- Zugriff nur für authentifizierte Schulkonten (`@stud.gymhofwil.ch`, `@gymhofwil.ch`)
- Vergleichbar mit bestehender Praxis: Schul-E-Mails, Google Drive, geteilte Dokumente
- Sensiblere Daten (offizielle Noten) bleiben in Evento
- Die Prüfungsplattform speichert Antworten und Korrekturvorschläge — die definitive Note wird nur in Evento eingetragen

### 11.2 Abgrenzung

| System | Datentyp | Sensibilität |
|---|---|---|
| **Prüfungsplattform (Google Sheets)** | Prüfungsantworten, KI-Korrekturvorschläge, Feedback | Mittel |
| **Evento** | Offizielle Noten, Zeugnisse, Promotion | Hoch |
| **Intranet** | Personaldaten, Disziplinarisches, Sonderfälle | Hoch |
| **LearningView** | Lernfortschritt, Übungsergebnisse | Tief |

Eine Integration in Evento oder das Intranet ist nicht realistisch und nicht geplant. Die LP überträgt die finalen Noten manuell nach Evento, wie bisher.

---

## 12. Umsetzungsplan

### Phase 1 — Fundament (Wochen 1–3)

**Ziel:** Minimaler Prototyp mit Login, MC + Freitext, Google Sheets

- [ ] Google Sheets Struktur anlegen (Fragenbank, Klassenliste, Antworten-Template)
- [ ] Google Apps Script: Authentifizierung, Fragen laden, Antworten speichern
- [ ] React-App Grundgerüst: Google OAuth Login, Rollenunterscheidung (SuS/LP)
- [ ] Fragennavigation mit Kacheln + Statusanzeige
- [ ] Freitext-Komponente: Rich-Text-Editor (Tiptap o.ä.), grosses Eingabefeld, Zeichenzähler
- [ ] MC-Komponente (aus Pools übernommen)
- [ ] Auto-Save (LocalStorage + IndexedDB + Remote)
- [ ] Verbindungsstatus-Indikator
- [ ] Erste Fragen erfassen (10–15 aus bestehenden Pools + Papierprüfungen)
- [ ] Testlauf ohne SEB

### Phase 2 — SEB + Sicherheit (Woche 4)

- [ ] SEB-Konfigurationsdatei erstellen
- [ ] User-Agent-Check + SEB JS API Integration
- [ ] Heartbeat-Monitoring implementieren
- [ ] Focus-Detection als zweite Sicherheitsstufe
- [ ] Google OAuth im SEB testen (accounts.google.com freigeben)
- [ ] Fallback: Schülercode-Login
- [ ] Testlauf mit SEB auf Windows + macOS

### Phase 3 — KI-Korrektur + Feedback (Wochen 5–6)

- [ ] Summativ-Workflow: KI-Korrektur via Apps Script → Korrektur-Sheet
- [ ] LP-Review-Ansicht im Composer
- [ ] PDF-Generierung (summativ + formativ)
- [ ] Formativ-Workflow: Sofort-Feedback via Claude API
- [ ] System-Prompt-Templates für verschiedene Fragetypen
- [ ] Test mit echten Antworten (anonym)

### Phase 4 — Visualisierungen + weitere Fragetypen (Wochen 7–8)

- [ ] Canvas-Zeichentool (einfaches SVG/Canvas)
- [ ] Interaktive Diagramm-Fragen (Angebot/Nachfrage)
- [ ] Bild-Speicherung via Google Drive
- [ ] Zuordnungs- und Lückentext-Komponenten
- [ ] Übungsmodus (ohne SEB, ohne Timer, mit xAPI/LearningView)

### Phase 5 — Composer + Fragenbank (Wochen 9–10)

- [ ] Composer UI: Filter, Drag & Drop, Vorschau, Klassen wählen
- [ ] Vorlagen-System (Prüfung als Basis laden)
- [ ] KI-Fragenimport aus Papierprüfungen
- [ ] KI-Fragengenerierung
- [ ] Docx-Export (Papier-Backup)
- [ ] Monitoring-Ansicht für laufende Prüfungen
- [ ] Schwierigkeits-Tracking nach Prüfungsdurchführung

### Phase 6 — Pilottest (Woche 11)

- [ ] SEB-Installation mit Pilotklasse (15 Min. Session)
- [ ] Formativer Kurztest mit einer SF-Klasse
- [ ] Feedback einholen (SuS + LP-Reflexion)
- [ ] Bugfixes und Anpassungen
- [ ] Dokumentation für zukünftige Prüfungen

---

## 13. Technische Entscheide

| Entscheid | Begründung |
|---|---|
| **GitHub Pages für Code, Google Workspace für Daten** | Code öffentlich (Open Source), Daten geschützt. Kein Datenschutzrisiko für Fragen oder Schülerdaten. |
| **Google Sheets statt Supabase/Firebase** | Kein zusätzliches Konto nötig, Schul-Google-Workspace bereits vorhanden, Daten bleiben im Schul-Ökosystem. |
| **Google Sheets für Fragenbank** (statt JSON im Repo) | Datenschutz: Fragen sind geschützt. Einfach manuell editierbar. Gleiche Infrastruktur. |
| **Google OAuth statt eigenem Login** | Kryptographisch sichere Identifikation via Schul-Konto, kein Passwort-Management. |
| **Claude API (separates Guthaben)** statt Claude-Abo | Pay-per-use, ~CHF 10/Jahr für alle Prüfungen, unabhängig vom persönlichen Abo. Batch API halbiert Kosten. |
| **React + TypeScript + Zustand** | Konsistenz mit Unterrichtsplaner, bewährter Stack. |
| **Tiptap für Rich-Text-Editor** | Leichtgewichtig, Markdown-kompatibel, gut für einfache Formatierungen. |
| **Dreifache Auto-Save-Strategie** | LocalStorage (sofort) + IndexedDB (lokal) + Google Sheets (remote) — maximale Resilienz. |
| **Papier-Backup immer verfügbar** | Docx-Export bei jeder summativen Prüfung, für Notfälle und Nachprüfungen. |

---

## 14. Offene Fragen (aktualisiert)

- [x] E-Mail-Domain der SuS: `@stud.gymhofwil.ch` (LP: `@gymhofwil.ch`)
- [x] Datenschutz: Google Sheets im Schul-Workspace ist vertretbar (vergleichbar mit bestehender Praxis)
- [x] SEB-Installation: Muss pro Klasse im Voraus organisiert werden (15 Min. Einrichtungssession)
- [x] Claude API Kosten: ~CHF 10/Jahr für alle Prüfungen, kein Engpass
- [x] LearningView: xAPI-Score im Übungsmodus = Prozentzahl wie bei Übungspools
- [x] Papier-Backup: Ja, bei jeder summativen Prüfung (Docx-Export)
- [x] Formatives PDF: Ja, auch bei formativen Tests wird ein PDF für SuS generiert
- [x] Bilder: Base64 → Google Drive, Link im Sheet
- [x] Schülerlisten: Einmalig pro Schuljahr als Sheet, basierend auf Evento-Export
- [ ] Google OAuth im SEB: Muss getestet werden (accounts.google.com als erlaubte Domain)
- [ ] SEB auf macOS: Apple-spezifische Einschränkungen (WebView-Kompatibilität) testen
- [ ] Maximale Sheet-Grösse: Bei vielen Prüfungen pro Jahr → ein Sheet pro Prüfung (nicht alle in einem)
- [ ] Welche Klasse für den Pilottest?
