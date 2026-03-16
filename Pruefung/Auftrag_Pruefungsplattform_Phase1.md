# Auftrag: Prüfungsplattform Phase 1 — Grundgerüst

## Kontext

Wir bauen eine digitale Prüfungsplattform für das Fach Wirtschaft & Recht am Gymnasium Hofwil. Die App wird im selben Repo wie der Unterrichtsplaner und die Übungspools leben: `GYM-WR-DUY/Pruefung/`.

**Technische Spezifikation:** Lies zuerst `Pruefungsplattform_Spec_v2.md` im Repo-Root (wird zusammen mit diesem Auftrag bereitgestellt). Das Spec enthält das vollständige Datenmodell, die Architektur und alle Anforderungen.

**Referenz-Projekte im selben Repo:**
- `Unterrichtsplaner/` — React + TypeScript + Vite + Zustand + Tailwind (gleicher Tech-Stack)
- `Uebungen/Uebungspools/pool.html` — Das visuelle Design (Farben, Cards, Chips, Badges) soll als Inspiration dienen

## Ziel Phase 1

Ein funktionsfähiger Prototyp der Prüfungs-App, der lokal und auf GitHub Pages läuft. **Noch ohne Google-Auth, ohne SEB, ohne KI-Korrektur** — das kommt in späteren Phasen. Phase 1 fokussiert auf:

1. Projekt-Setup (React + Vite + TypeScript + Zustand + Tailwind)
2. Prüfungs-UI mit Navigation und Fragetypen (MC + Freitext)
3. Auto-Save (LocalStorage + IndexedDB)
4. Demo-Modus mit eingebetteten Testfragen (kein Backend nötig)

## Schritt-für-Schritt

### 1. Projekt-Setup

```bash
cd ~/Documents/-Gym\ Hofwil/00\ Automatisierung\ Unterricht/10\ Github/GYM-WR-DUY
mkdir Pruefung
cd Pruefung
npm create vite@latest . -- --template react-ts
```

**package.json** — Dependencies analog zum Unterrichtsplaner:
- `react`, `react-dom`, `zustand`, `tailwindcss`, `@tailwindcss/vite`
- Zusätzlich: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-bullet-list`, `@tiptap/extension-ordered-list` (Rich-Text-Editor für Freitext-Fragen)
- `vite-plugin-pwa` (für spätere Offline-Fähigkeit, jetzt schon konfigurieren)

**vite.config.ts** — Analog zum Unterrichtsplaner:
- `base: '/GYM-WR-DUY/Pruefung/'`
- React + Tailwind + PWA Plugins
- PWA vorerst mit `registerType: 'prompt'`

**GitHub Actions:** Die bestehende GitHub Actions Workflow-Datei im Repo muss erweitert werden, damit auch `Pruefung/` gebaut und deployed wird. Prüfe, wie das aktuell für `Unterrichtsplaner/` gelöst ist, und repliziere es für `Pruefung/`.

### 2. Datenmodell (TypeScript Types)

Erstelle `src/types/` mit den Interfaces aus dem Spec (Abschnitt 2.2–2.4). Die wichtigsten:

**`src/types/fragen.ts`** — `FrageBase`, `MCFrage`, `FreitextFrage`, `ZuordnungFrage`, `LueckentextFrage`, `VisualisierungFrage`, `Frage` (Union-Typ)

**`src/types/pruefung.ts`** — `PruefungsConfig`, `PruefungsAbschnitt`

**`src/types/antworten.ts`** — `PruefungsAbgabe`, `Antwort`, `Unterbrechung`

### 3. Zustand-Store (Zustand)

**`src/store/pruefungStore.ts`**

Zentraler Store mit folgenden Slices:

```typescript
interface PruefungState {
  // Prüfungsdaten
  config: PruefungsConfig | null;
  fragen: Frage[];
  
  // Navigation
  aktuelleFrageIndex: number;
  
  // Antworten
  antworten: Record<string, Antwort>;  // Key = Frage-ID
  markierungen: Record<string, boolean>;  // "unsicher"-Markierung pro Frage
  
  // Status
  startzeit: string | null;
  abgegeben: boolean;
  verbindungsstatus: 'online' | 'offline' | 'syncing';
  letzterSave: string | null;  // ISO-Timestamp
  autoSaveCount: number;
  
  // Actions
  setAntwort: (frageId: string, antwort: Antwort) => void;
  toggleMarkierung: (frageId: string) => void;
  navigiere: (index: number) => void;
  naechsteFrage: () => void;
  vorherigeFrage: () => void;
  pruefungStarten: (config: PruefungsConfig, fragen: Frage[]) => void;
  pruefungAbgeben: () => void;
}
```

Der Store soll bei jeder Änderung automatisch in LocalStorage persistieren (Zustand `persist` Middleware). IndexedDB als Backup (alle 15 Sekunden).

### 4. Demo-Daten

**`src/data/demoFragen.ts`** — 6–8 Testfragen für den Prototyp:
- 3 MC-Fragen (VWL: Marktgleichgewicht, BWL: Rechtsformen, Recht: OR AT)
- 3 Freitext-Fragen (verschiedene Längen: kurz, mittel, lang)
- 1 True/False
- 1 Lückentext

Die Fragen sollen fachlich korrekt sein (Lehrplan 17, Gymnasium-Niveau). Verwende Schweizer Hochdeutsch, CHF, Schweizer Institutionen.

**`src/data/demoPruefung.ts`** — Eine PruefungsConfig, die auf die Demo-Fragen referenziert. Titel: "Demo-Prüfung WR", 45 Minuten, 2 Abschnitte (Teil A: MC, Teil B: Freitext).

### 5. Komponenten

Orientiere dich am visuellen Design der Übungspools (`pool.html`): gleiche Farblogik (VWL = orange, BWL = blau, Recht = grün), Cards mit abgerundeten Ecken, Badges für Schwierigkeit und Bloom-Stufe. Aber als React-Komponenten mit Tailwind.

#### Layout

**`src/components/Layout.tsx`**
- Header: Prüfungstitel, Timer (Countdown), Verbindungsstatus-Indikator, Auto-Save-Status
- Seitenleiste oder obere Leiste: Fragennavigation (nummerierte Kacheln)
- Hauptbereich: Aktuelle Frage
- Footer: Zurück/Weiter-Buttons, Abgabe-Button

**`src/components/FragenNavigation.tsx`**
- Kompakte nummerierte Kacheln (1, 2, 3, ...)
- Farbcode: grau = nicht beantwortet, grün = beantwortet, orange = markiert als "unsicher"
- Klick → navigiert zur Frage
- Zeigt Abschnittstrennungen (z.B. "Teil A: MC" | "Teil B: Freitext")

**`src/components/FragenUebersicht.tsx`**
- Vollbild-Übersicht aller Fragen mit Status
- Pro Frage: Nummer, Kurztitel, Status (beantwortet/nicht/unsicher), bei Freitext: Wortanzahl
- Button "Prüfung abgeben" prominent am Ende

#### Timer

**`src/components/Timer.tsx`**
- Countdown von `dauerMinuten` (aus PruefungsConfig)
- Warnung bei 15 Min. Restzeit (Text wird orange)
- Warnung bei 5 Min. Restzeit (Text wird rot)
- Bei 0 Min.: automatische Abgabe (mit Warnung)

#### Fragetypen

**`src/components/fragetypen/MCFrage.tsx`**
- Fragetext oben (Markdown-fähig)
- Optionen als klickbare Cards (analog pool.html)
- Radio-Buttons für Einzelauswahl, Checkboxen für Mehrfachauswahl
- Badges: Fachbereich, Schwierigkeit, Bloom-Stufe
- Optional: Bild unter dem Fragetext
- Nach Auswahl: Option wird visuell markiert (blau), aber keine Korrektur (das ist eine Prüfung, nicht ein Übungspool!)

**`src/components/fragetypen/FreitextFrage.tsx`** ← SCHWERPUNKT
- Fragetext oben (fixiert, scrollt nicht mit)
- Grosses Eingabefeld: mindestens 60% der verfügbaren Höhe
- Rich-Text-Editor (Tiptap): Toolbar mit fett, kursiv, unterstrichen, nummerierte Liste, Aufzählung
- Live-Wortanzahl und Zeichenzähler unten rechts
- Auto-Save-Indikator: "Gespeichert ✓" mit Timestamp, blinkt kurz grün bei erfolgreichem Save
- Placeholder-Text (aus der Frage-Config)
- Falls `maxZeichen` gesetzt: visuelles Limit (Zähler wird rot bei Überschreitung)

**`src/components/fragetypen/LueckentextFrage.tsx`**
- Text mit Lücken (dargestellt als Inline-Inputs)
- Validierung: Lücken dürfen nicht leer sein (visueller Hinweis)

#### Status-Indikatoren

**`src/components/VerbindungsStatus.tsx`**
- 🟢 Online (grüner Punkt)
- 🟡 Offline — Antworten werden lokal gespeichert (oranger Punkt)
- Kleiner Text: "Letzte Speicherung: 10:34"

**`src/components/AutoSaveIndikator.tsx`**
- Zeigt kurz "Gespeichert ✓" an nach jedem erfolgreichen Save
- Animierter Übergang (fade in → 2s sichtbar → fade out)

### 6. Auto-Save System

**`src/services/autoSave.ts`**

Drei Ebenen:
1. **LocalStorage**: Bei jeder Zustandsänderung (via Zustand persist Middleware), debounced 2 Sekunden
2. **IndexedDB**: Alle 15 Sekunden — Backup falls LocalStorage gelöscht wird
3. **Remote (Google Sheets)**: Platzhalter für Phase 2 — erstelle ein Interface `RemoteSaveService` mit einer `save(abgabe: PruefungsAbgabe): Promise<boolean>` Methode. Implementierung ist vorerst ein Mock, der `true` zurückgibt und in der Konsole loggt.

**Wiederherstellung beim Laden:**
- App prüft beim Start: Gibt es einen gespeicherten Zustand in LocalStorage oder IndexedDB?
- Falls ja: Zustand wiederherstellen, Meldung anzeigen ("Sitzung wiederhergestellt, Stand 10:34")
- Falls nein: Normal starten

### 7. Startbildschirm

**`src/components/Startbildschirm.tsx`**

Bevor die Prüfung beginnt:
- Prüfungstitel, Datum, Dauer
- Anzahl Fragen, Gesamtpunkte
- Abschnittsübersicht (Teil A: X Fragen, Teil B: Y Fragen)
- Hinweise (z.B. "Alle Fragen können in beliebiger Reihenfolge beantwortet werden")
- Button "Prüfung starten" → startet Timer und Navigation
- Für den Demo-Modus: kein Login nötig, direkt starten

### 8. Abgabe-Flow

**`src/components/AbgabeDialog.tsx`**

Wenn SuS auf "Abgeben" klickt:
1. Bestätigungsdialog: "Möchten Sie die Prüfung definitiv abgeben?"
2. Übersicht: X von Y Fragen beantwortet, Z als "unsicher" markiert
3. Falls unbeantwortete Fragen: Warnung "Sie haben X Fragen nicht beantwortet"
4. Button "Ja, definitiv abgeben" → Zustand auf `abgegeben = true`
5. Abgabe-Bestätigung: "Prüfung erfolgreich abgegeben um 10:45. Sie können das Fenster schliessen."

### 9. App-Einstiegspunkt

**`src/App.tsx`**

Einfaches Routing (kein React Router nötig, URL-Parameter reichen):
- Kein `?id=` Parameter → Startbildschirm mit Demo-Prüfung
- `?id=demo` → Demo-Prüfung laden
- Später (Phase 2+): `?id=PRUEFUNGS_ID` → Prüfung von Google Sheets laden

Flow: Startbildschirm → Prüfung (Navigation + Fragen) → Abgabe → Bestätigung

### 10. Styling

Verwende Tailwind CSS. Das Farbschema orientiert sich an den Übungspools:

```
VWL: Orange (#f89907 primary, #ffb74d light)
BWL: Blau (#2563eb primary, #60a5fa light)
Recht: Grün (#16a34a primary, #4ade80 light)
Allgemein: Slate-Grautöne wie bei den Pools
```

Die Cards, Badges, Buttons sollen visuell ähnlich wie in `pool.html` aussehen, aber als Tailwind-Klassen.

**Dark Mode:** Via `prefers-color-scheme` unterstützen (Tailwind `dark:` Prefix). Nicht zwingend perfekt in Phase 1, aber die Grundstruktur anlegen.

## Nicht in Phase 1

Folgendes wird in späteren Phasen implementiert und soll in Phase 1 **nicht** gebaut werden:

- ❌ Google OAuth / Authentifizierung (Phase 2)
- ❌ SEB-Erkennung und Monitoring (Phase 2)
- ❌ Google Sheets Backend / Apps Script (Phase 2)
- ❌ KI-Korrektur (Phase 3)
- ❌ PDF-Generierung (Phase 3)
- ❌ Visualisierungs-Fragen / Canvas (Phase 4)
- ❌ Zuordnungs-Fragen mit Drag&Drop (Phase 4)
- ❌ Prüfungs-Composer / LP-Ansicht (Phase 5)

Für diese Features sollen aber schon die **Interfaces und Platzhalter** existieren, damit der spätere Einbau nicht alles umstrukturiert.

## Verzeichnisstruktur (Ziel)

```
Pruefung/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── src/
│   ├── App.tsx
│   ├── App.css                      (minimal, Tailwind macht den Rest)
│   ├── main.tsx
│   ├── index.css                    (Tailwind Imports)
│   ├── types/
│   │   ├── fragen.ts
│   │   ├── pruefung.ts
│   │   └── antworten.ts
│   ├── store/
│   │   └── pruefungStore.ts
│   ├── data/
│   │   ├── demoFragen.ts
│   │   └── demoPruefung.ts
│   ├── services/
│   │   ├── autoSave.ts
│   │   └── remoteSave.ts            (Mock für Phase 2)
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Startbildschirm.tsx
│   │   ├── FragenNavigation.tsx
│   │   ├── FragenUebersicht.tsx
│   │   ├── Timer.tsx
│   │   ├── VerbindungsStatus.tsx
│   │   ├── AutoSaveIndikator.tsx
│   │   ├── AbgabeDialog.tsx
│   │   └── fragetypen/
│   │       ├── MCFrage.tsx
│   │       ├── FreitextFrage.tsx
│   │       └── LueckentextFrage.tsx
│   └── utils/
│       ├── markdown.ts               (einfacher Markdown→HTML Renderer)
│       └── zeit.ts                    (Timer-Hilfsfunktionen)
├── public/
│   └── icon.svg
└── README.md
```

## Qualitätschecks

Vor dem Commit:
1. `npx tsc --noEmit` — keine TypeScript-Fehler
2. `npm run build` — Build erfolgreich
3. Lokaler Test mit `npm run dev` — App lädt, Demo-Prüfung funktioniert
4. Freitext-Editor: Text eingeben, formatieren, Wortanzahl stimmt
5. Navigation: Zwischen Fragen wechseln, Kacheln zeigen korrekten Status
6. Auto-Save: LocalStorage wird beschrieben (DevTools → Application → LocalStorage prüfen)
7. Timer: Countdown läuft, Warnungen erscheinen
8. Abgabe: Dialog erscheint, Bestätigung funktioniert
9. Wiederherstellung: Seite neu laden → Zustand wird aus LocalStorage wiederhergestellt

## Commit

```bash
git add -A
git commit -m "Prüfungsplattform Phase 1: React+Vite Setup, MC+Freitext, Auto-Save, Demo-Modus"
git push origin main
```
