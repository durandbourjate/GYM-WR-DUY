# Open-End-Modus & LP-kontrolliertes Beenden — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Open-End-Prüfungsmodus (Stoppuhr statt Countdown) und LP-kontrolliertes Beenden (sofort oder mit Restzeit, global oder individuell).

**Architecture:** Neues `zeitModus`-Feld in PruefungsConfig steuert Timer-Verhalten. `beendetUm`-Feld (global im Configs-Sheet, individuell im Antworten-Sheet) wird vom LP gesetzt und via Heartbeat-Response an SuS-Client propagiert. Bestehender Heartbeat (10s) wird erweitert um `beendetUm` zurückzuliefern.

**Tech Stack:** React 19 + TypeScript + Zustand + Tailwind CSS v4 + Google Apps Script Backend

**Spec:** `Pruefung/docs/superpowers/specs/2026-03-21-open-end-lp-beenden-design.md`

---

## File Structure

| Datei | Aktion | Verantwortung |
|-------|--------|---------------|
| `src/types/pruefung.ts` | Modify | `zeitModus` Feld hinzufügen |
| `src/types/monitoring.ts` | Modify | `HeartbeatResponse` Interface, `beendet-lp` Status |
| `src/utils/zeit.ts` | Modify | `berechneVerstricheneZeit()` hinzufügen |
| `src/store/pruefungStore.ts` | Modify | `beendetUm`, `restzeitMinuten` State + Action + Persist |
| `src/services/apiService.ts` | Modify | `heartbeat()` erweitern (JSON-Response), `beendePruefung()` hinzufügen |
| `src/hooks/usePruefungsMonitoring.ts` | Modify | Heartbeat-Response auswerten, `setBeendetUm` aufrufen |
| `src/components/Timer.tsx` | Modify | Open-End Stoppuhr + dynamischer Countdown-Wechsel bei Beenden |
| `src/components/Layout.tsx` | Modify | Beenden-Banner ("LP hat beendet") |
| `src/components/Startbildschirm.tsx` | Modify | Open-End Info-Text |
| `src/components/AbgabeDialog.tsx` | Modify | "Beendet durch LP" Text |
| `src/components/lp/MonitoringDashboard.tsx` | Modify | Beenden-Button + BeendenDialog einbinden |
| `src/components/lp/BeendenDialog.tsx` | Create | Dialog für Sofort/Restzeit-Auswahl |
| `src/components/lp/SchuelerZeile.tsx` | Modify | Einzeln-Beenden-Button |
| `src/components/lp/PruefungsComposer.tsx` | Modify | Zeitmodus-Toggle im ConfigTab-Bereich |
| `apps-script-code.js` | Modify | `beendePruefung` Endpoint, Heartbeat erweitern, `ladeConfig` mapping |

---

### Task 1: Types + Utils (Grundlagen)

**Files:**
- Modify: `src/types/pruefung.ts:1-67`
- Modify: `src/types/monitoring.ts:1-65`
- Modify: `src/utils/zeit.ts:1-47`

- [ ] **Step 1: `zeitModus` zu PruefungsConfig hinzufügen**

In `src/types/pruefung.ts`, nach Zeile 15 (`dauerMinuten: number;`) einfügen:

```typescript
zeitModus: 'countdown' | 'open-end';
```

- [ ] **Step 2: `HeartbeatResponse` und Status-Erweiterung in monitoring.ts**

In `src/types/monitoring.ts`, am Ende der Datei (nach Zeile 65) hinzufügen:

```typescript
/** Antwort des Heartbeat-Endpoints (erweitert um Beenden-Signal) */
export interface HeartbeatResponse {
  success: boolean
  beendetUm?: string        // ISO-Timestamp — LP hat Prüfung beendet
  restzeitMinuten?: number   // Original-Restzeit (für Nachteilsausgleich)
}
```

Auf Zeile 10 den Status-Typ erweitern:

```typescript
// ALT:
status: 'aktiv' | 'inaktiv' | 'abgegeben' | 'nicht-gestartet'
// NEU:
status: 'aktiv' | 'inaktiv' | 'abgegeben' | 'nicht-gestartet' | 'beendet-lp'
```

- [ ] **Step 3: `berechneVerstricheneZeit` in zeit.ts**

In `src/utils/zeit.ts`, nach Zeile 47 (nach `berechneRestzeit`) hinzufügen:

```typescript
/** Berechnet verstrichene Sekunden seit Startzeit */
export function berechneVerstricheneZeit(startzeit: string): number {
  const start = new Date(startzeit).getTime()
  return Math.max(0, Math.floor((Date.now() - start) / 1000))
}

/** Formatiert Sekunden als H:MM:SS (wenn >= 1h) oder MM:SS */
export function formatVerstricheneZeit(sekunden: number): string {
  const h = Math.floor(sekunden / 3600)
  const m = Math.floor((sekunden % 3600) / 60)
  const s = sekunden % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
```

- [ ] **Step 4: Build prüfen**

Run: `cd "/Users/durandbourjate/Documents/-Gym Hofwil/00 Automatisierung Unterricht/10 Github/GYM-WR-DUY/Pruefung" && npx tsc --noEmit 2>&1 | head -30`

Erwartung: Kompilier-Fehler weil bestehende Stellen `zeitModus` noch nicht setzen — das ist OK, wird in späteren Tasks behoben.

- [ ] **Step 5: Commit**

```bash
git add src/types/pruefung.ts src/types/monitoring.ts src/utils/zeit.ts
git commit -m "Open-End: Types + Utils — zeitModus, HeartbeatResponse, berechneVerstricheneZeit"
```

---

### Task 2: Store + API-Service (Daten-Layer)

**Files:**
- Modify: `src/store/pruefungStore.ts:1-179`
- Modify: `src/services/apiService.ts:63-83`

- [ ] **Step 1: Store erweitern — neue Felder + Action**

In `src/store/pruefungStore.ts`:

**Interface erweitern** (nach Zeile 33, nach `unterbrechungen`):

```typescript
  // LP-Beenden
  beendetUm: string | null
  restzeitMinuten: number | null
```

**Actions erweitern** (nach Zeile 50, nach `addUnterbrechung`):

```typescript
  setBeendetUm: (beendetUm: string, restzeitMinuten?: number) => void
```

**Initial State erweitern** (nach Zeile 69, nach `unterbrechungen`):

```typescript
  beendetUm: null,
  restzeitMinuten: null,
```

**Action implementieren** (nach `addUnterbrechung` Implementation, Zeile 147):

```typescript
      setBeendetUm: (beendetUm, restzeitMinuten) =>
        set({ beendetUm, restzeitMinuten: restzeitMinuten ?? null }),
```

**pruefungStarten erweitern** (in set-Objekt ab Zeile 114, nach `unterbrechungen: []`):

```typescript
          beendetUm: null,
          restzeitMinuten: null,
```

**Persist partialize erweitern** (nach Zeile 175, nach `unterbrechungen`):

```typescript
        beendetUm: state.beendetUm,
        restzeitMinuten: state.restzeitMinuten,
```

**Persist version bumpen**: Version von `2` auf `3`, Migration erweitern:

```typescript
      version: 3,
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>
        if (version < 2) {
          delete state.config
          delete state.fragen
        }
        if (version < 3) {
          state.beendetUm = null
          state.restzeitMinuten = null
        }
        return persisted as PruefungState
      },
```

- [ ] **Step 2: apiService.heartbeat() erweitern — JSON-Response parsen**

In `src/services/apiService.ts`, `heartbeat` Funktion (Zeile 63-83) ersetzen:

```typescript
  /** Heartbeat senden (Monitoring durch LP) — gibt Beenden-Signal zurück */
  async heartbeat(pruefungId: string, email: string): Promise<import('../types/monitoring.ts').HeartbeatResponse> {
    if (!APPS_SCRIPT_URL) return { success: false }

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'heartbeat',
          pruefungId,
          email,
          timestamp: new Date().toISOString(),
        }),
      })
      if (!response.ok) return { success: false }

      try {
        const data = await response.json()
        return {
          success: data.success === true,
          beendetUm: data.beendetUm || undefined,
          restzeitMinuten: data.restzeitMinuten != null ? Number(data.restzeitMinuten) : undefined,
        }
      } catch {
        // Fallback: alte Backend-Version ohne JSON
        return { success: response.ok }
      }
    } catch {
      return { success: false }
    }
  },
```

- [ ] **Step 3: apiService.beendePruefung() hinzufügen**

In `src/services/apiService.ts`, nach `schaltePruefungFrei` (nach Zeile 575) einfügen:

```typescript
  /** Prüfung beenden (LP) — sofort oder mit Restzeit, global oder einzeln */
  async beendePruefung(payload: {
    pruefungId: string
    email: string
    modus: 'sofort' | 'restzeit'
    restzeitMinuten?: number
    einzelneSuS?: string[]
  }): Promise<{ success: boolean; beendetUm?: string; error?: string }> {
    if (!APPS_SCRIPT_URL) return { success: false, error: 'nicht_konfiguriert' }

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'beendePruefung', ...payload }),
      })
      if (!response.ok) return { success: false, error: 'netzwerk_fehler' }

      const text = await response.text()
      try {
        return JSON.parse(text)
      } catch {
        return { success: false, error: 'json_parse_fehler' }
      }
    } catch {
      return { success: false, error: 'netzwerk_fehler' }
    }
  },
```

- [ ] **Step 4: Commit**

```bash
git add src/store/pruefungStore.ts src/services/apiService.ts
git commit -m "Open-End: Store + API — beendetUm State, heartbeat JSON, beendePruefung Endpoint"
```

---

### Task 3: Heartbeat-Auswertung (usePruefungsMonitoring)

**Files:**
- Modify: `src/hooks/usePruefungsMonitoring.ts:91-111`

- [ ] **Step 1: Heartbeat-Response auswerten**

In `src/hooks/usePruefungsMonitoring.ts`:

**Import erweitern** (Zeile 1): Bereits `useRef` importiert, ok.

**Neue Store-Selektoren hinzufügen** (nach Zeile 26, nach `addUnterbrechung`):

```typescript
  const setBeendetUm = usePruefungStore((s) => s.setBeendetUm)
```

**Heartbeat useEffect ersetzen** (Zeile 91-111):

```typescript
  // === 3. Heartbeat (alle 10s, konfigurierbar) + Beenden-Signal ===
  useEffect(() => {
    if (!config || abgegeben || !backendVerfuegbar || !user) return

    const intervallMs = (config.heartbeatIntervallSekunden || 10) * 1000

    const interval = setInterval(async () => {
      const response = await apiService.heartbeat(config.id, user.email)
      if (response.success) {
        incrementHeartbeats()
        // Beenden-Signal vom Backend?
        if (response.beendetUm && !abgegeben) {
          setBeendetUm(response.beendetUm, response.restzeitMinuten)
        }
      } else {
        addUnterbrechung({
          zeitpunkt: new Date().toISOString(),
          dauer_sekunden: 0,
          typ: 'heartbeat-ausfall',
        })
      }
    }, intervallMs)

    return () => clearInterval(interval)
  }, [config, abgegeben, backendVerfuegbar, user, incrementHeartbeats, addUnterbrechung, setBeendetUm])
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/usePruefungsMonitoring.ts
git commit -m "Open-End: Heartbeat-Auswertung — beendetUm aus Response auslesen"
```

---

### Task 4: Timer-Komponente (Open-End + Beenden-Countdown)

**Files:**
- Modify: `src/components/Timer.tsx:1-133`

- [ ] **Step 1: Timer komplett überarbeiten**

`src/components/Timer.tsx` ersetzen mit:

```typescript
import { useState, useEffect, useRef } from 'react'
import { usePruefungStore } from '../store/pruefungStore.ts'
import { useAuthStore } from '../store/authStore.ts'
import { apiService } from '../services/apiService.ts'
import { sebVersion, browserInfo } from '../services/sebService.ts'
import { berechneRestzeit, formatZeit, berechneVerstricheneZeit, formatVerstricheneZeit } from '../utils/zeit.ts'

interface Props {
  onZeitAbgelaufen?: () => void
}

export default function Timer({ onZeitAbgelaufen }: Props) {
  const config = usePruefungStore((s) => s.config)
  const startzeit = usePruefungStore((s) => s.startzeit)
  const abgegeben = usePruefungStore((s) => s.abgegeben)
  const antworten = usePruefungStore((s) => s.antworten)
  const autoSaveCount = usePruefungStore((s) => s.autoSaveCount)
  const heartbeats = usePruefungStore((s) => s.heartbeats)
  const netzwerkFehler = usePruefungStore((s) => s.netzwerkFehler)
  const unterbrechungen = usePruefungStore((s) => s.unterbrechungen)
  const pruefungAbgeben = usePruefungStore((s) => s.pruefungAbgeben)
  const beendetUm = usePruefungStore((s) => s.beendetUm)
  const restzeitMinuten = usePruefungStore((s) => s.restzeitMinuten)

  const user = useAuthStore((s) => s.user)
  const istDemoModus = useAuthStore((s) => s.istDemoModus)

  const [anzeigeSekunden, setAnzeigeSekunden] = useState<number | null>(null)
  const abgegebenRef = useRef(false)

  // Refs für stale-closure Schutz im Interval
  const antwortenRef = useRef(antworten)
  antwortenRef.current = antworten
  const autoSaveCountRef = useRef(autoSaveCount)
  autoSaveCountRef.current = autoSaveCount
  const heartbeatsRef = useRef(heartbeats)
  heartbeatsRef.current = heartbeats
  const netzwerkFehlerRef = useRef(netzwerkFehler)
  netzwerkFehlerRef.current = netzwerkFehler
  const unterbrechungenRef = useRef(unterbrechungen)
  unterbrechungenRef.current = unterbrechungen

  const zeitModus = config?.zeitModus ?? 'countdown'
  const zusatzMinuten = Number((user?.email && config?.zeitverlaengerungen?.[user.email]) ?? 0)

  // Effektives Beenden-Datum (mit Nachteilsausgleich bei Restzeit)
  const effektivBeendetUm = (() => {
    if (!beendetUm) return null
    const ts = new Date(beendetUm).getTime()
    // Nachteilsausgleich nur bei Restzeit-Modus (restzeitMinuten vorhanden)
    if (restzeitMinuten != null && zusatzMinuten > 0) {
      return new Date(ts + zusatzMinuten * 60000).toISOString()
    }
    return beendetUm
  })()

  // Auto-Abgabe Logik (shared zwischen Countdown und Beenden)
  function autoAbgabe(): void {
    if (abgegebenRef.current) return
    abgegebenRef.current = true
    pruefungAbgeben()
    onZeitAbgelaufen?.()

    try {
      const abgabeObjekt = {
        pruefungId: config!.id,
        email: user?.email ?? '',
        name: user?.name ?? 'Unbekannt',
        startzeit,
        abgabezeit: new Date().toISOString(),
        antworten: antwortenRef.current,
        meta: {
          sebVersion: sebVersion(),
          browserInfo: browserInfo(),
          autoSaveCount: autoSaveCountRef.current,
          netzwerkFehler: netzwerkFehlerRef.current,
          heartbeats: heartbeatsRef.current,
          unterbrechungen: unterbrechungenRef.current,
          autoAbgabe: true,
        },
      }
      localStorage.setItem(`pruefung-abgabe-${config!.id}`, JSON.stringify(abgabeObjekt))
    } catch {
      // ignorieren
    }

    if (apiService.istKonfiguriert() && !istDemoModus && user?.email) {
      apiService.speichereAntworten({
        pruefungId: config!.id,
        email: user.email,
        antworten: antwortenRef.current,
        version: -1,
        istAbgabe: true,
      })
    }
  }

  useEffect(() => {
    if (!config || !startzeit || abgegeben) return

    const effektiveDauer = (config.dauerMinuten ?? 0) + zusatzMinuten
    const istOpenEnd = zeitModus === 'open-end'

    const update = () => {
      // Fall 1: LP hat Beenden mit Restzeit ausgelöst → Countdown bis effektivBeendetUm
      if (effektivBeendetUm) {
        const beendetTs = new Date(effektivBeendetUm).getTime()
        const restSek = Math.max(0, Math.floor((beendetTs - Date.now()) / 1000))
        setAnzeigeSekunden(restSek)
        if (restSek <= 0) {
          autoAbgabe()
        }
        return
      }

      // Fall 2: Open-End ohne Beenden → Stoppuhr aufwärts
      if (istOpenEnd) {
        setAnzeigeSekunden(berechneVerstricheneZeit(startzeit))
        return
      }

      // Fall 3: Countdown (Standard)
      const rest = berechneRestzeit(startzeit, effektiveDauer)
      setAnzeigeSekunden(rest)
      if (rest <= 0) {
        autoAbgabe()
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [config, startzeit, abgegeben, zeitModus, zusatzMinuten, effektivBeendetUm])

  if (!config || anzeigeSekunden === null) return null

  // Modus bestimmen für Anzeige
  const istOpenEndOhneBeenden = zeitModus === 'open-end' && !effektivBeendetUm
  const istCountdownModus = !istOpenEndOhneBeenden // Countdown oder Beenden-Countdown

  const anzeige = istOpenEndOhneBeenden
    ? formatVerstricheneZeit(anzeigeSekunden)
    : formatZeit(Math.max(0, anzeigeSekunden))

  const warnungStufe = istOpenEndOhneBeenden
    ? 'normal'
    : anzeigeSekunden <= 0
      ? 'abgelaufen'
      : anzeigeSekunden <= 300
        ? 'kritisch'
        : anzeigeSekunden <= 900
          ? 'warnung'
          : 'normal'

  return (
    <div
      className={`font-mono text-lg font-semibold tabular-nums ${
        warnungStufe === 'abgelaufen'
          ? 'text-red-700 dark:text-red-300'
          : warnungStufe === 'kritisch'
            ? 'text-red-600 dark:text-red-400 animate-pulse'
            : warnungStufe === 'warnung'
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-slate-700 dark:text-slate-200'
      }`}
      title={istOpenEndOhneBeenden ? 'Verstrichene Zeit' : (anzeigeSekunden > 0 ? 'Verbleibende Zeit' : 'Zeit abgelaufen')}
    >
      {istOpenEndOhneBeenden && '+'}{anzeige}
      {zusatzMinuten > 0 && (
        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1" title="Nachteilsausgleich">
          (+{zusatzMinuten} Min.)
        </span>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Build prüfen**

Run: `cd "/Users/durandbourjate/Documents/-Gym Hofwil/00 Automatisierung Unterricht/10 Github/GYM-WR-DUY/Pruefung" && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/components/Timer.tsx
git commit -m "Open-End: Timer — Stoppuhr aufwärts, dynamischer Beenden-Countdown"
```

---

### Task 5: Layout + Startbildschirm + AbgabeDialog (SuS-Facing)

**Files:**
- Modify: `src/components/Layout.tsx:210-214` (Timer-Bereich), `355-380` (Zeitablauf-Banner)
- Modify: `src/components/Startbildschirm.tsx:100`, `156`
- Modify: `src/components/AbgabeDialog.tsx`

- [ ] **Step 1: Layout — Beenden-Banner hinzufügen**

In `src/components/Layout.tsx`, nach dem bestehenden `zeitAbgelaufen`-Banner einen neuen State für LP-Beenden hinzufügen. Suche nach `const [zeitAbgelaufen, setZeitAbgelaufen] = useState(false)` und füge darunter hinzu:

```typescript
  const beendetUm = usePruefungStore((s) => s.beendetUm)
  const restzeitMinuten = usePruefungStore((s) => s.restzeitMinuten)
```

In der Render-Ausgabe, vor dem Zeitablauf-Banner, ein Beenden-Banner einfügen (sichtbar wenn `beendetUm` gesetzt ist und noch nicht abgegeben):

```typescript
        {/* LP hat Prüfung beendet — Banner */}
        {beendetUm && !abgegeben && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white text-center py-2 text-sm font-medium">
            LP hat die Prüfung beendet{restzeitMinuten != null ? ' — Restzeit läuft' : ''}
          </div>
        )}
```

Im Zeitablauf-Banner den Text anpassen — wenn `beendetUm` gesetzt, zeige "Prüfung wurde von der Lehrperson beendet" statt "Zeit abgelaufen":

```typescript
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        {beendetUm ? 'Prüfung beendet' : 'Zeit abgelaufen'}
      </h2>
      <p className="text-slate-500 dark:text-slate-400">
        {beendetUm
          ? 'Die Lehrperson hat die Prüfung beendet. Ihre Antworten wurden automatisch gespeichert.'
          : 'Ihre Antworten wurden automatisch gespeichert.'}
      </p>
```

- [ ] **Step 2: Startbildschirm — Open-End Info-Text**

In `src/components/Startbildschirm.tsx`:

Zeile 100 (Warteraum Dauer-Info):
```typescript
// ALT:
<InfoCard label="Dauer" wert={`${config.dauerMinuten} Min.`} />
// NEU:
<InfoCard label="Dauer" wert={config.zeitModus === 'open-end' ? 'Open-End' : `${config.dauerMinuten} Min.`} />
```

Zeile 156 (Haupt-Startbildschirm Dauer-Info):
```typescript
// ALT:
<InfoCard label="Dauer" wert={`${config.dauerMinuten} Minuten`} />
// NEU:
<InfoCard label="Dauer" wert={config.zeitModus === 'open-end' ? 'Kein Zeitlimit' : `${config.dauerMinuten} Minuten`} />
```

- [ ] **Step 3: Build prüfen**

Run: `cd "/Users/durandbourjate/Documents/-Gym Hofwil/00 Automatisierung Unterricht/10 Github/GYM-WR-DUY/Pruefung" && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 4: Commit**

```bash
git add src/components/Layout.tsx src/components/Startbildschirm.tsx src/components/AbgabeDialog.tsx
git commit -m "Open-End: SuS-UI — Beenden-Banner, Open-End Info-Text, LP-beendet Meldung"
```

---

### Task 6: BeendenDialog (neue Komponente)

**Files:**
- Create: `src/components/lp/BeendenDialog.tsx`

- [ ] **Step 1: BeendenDialog erstellen**

```typescript
import { useState } from 'react'
import { apiService } from '../../services/apiService.ts'

interface Props {
  pruefungId: string
  lpEmail: string
  /** Wenn gesetzt: nur für diesen SuS (Name für Anzeige) */
  einzelnerSuS?: { email: string; name: string }
  /** Anzahl SuS mit Nachteilsausgleich (für Hinweis) */
  anzahlMitNachteilsausgleich?: number
  /** Anzahl aktiver SuS (für Bestätigungstext) */
  anzahlAktiv?: number
  onBeendet: () => void
  onAbbrechen: () => void
}

export default function BeendenDialog({
  pruefungId,
  lpEmail,
  einzelnerSuS,
  anzahlMitNachteilsausgleich = 0,
  anzahlAktiv = 0,
  onBeendet,
  onAbbrechen,
}: Props) {
  const [modus, setModus] = useState<'sofort' | 'restzeit'>('sofort')
  const [restzeitMinuten, setRestzeitMinuten] = useState(5)
  const [spibestaetigung, setBestaetigung] = useState(false)
  const [spilade, setLade] = useState(false)

  async function handleBeenden(): Promise<void> {
    setLade(true)
    const result = await apiService.beendePruefung({
      pruefungId,
      email: lpEmail,
      modus,
      restzeitMinuten: modus === 'restzeit' ? restzeitMinuten : undefined,
      einzelneSuS: einzelnerSuS ? [einzelnerSuS.email] : undefined,
    })
    setLade(false)

    if (result.success) {
      onBeendet()
    }
  }

  const zielText = einzelnerSuS
    ? `Prüfung für ${einzelnerSuS.name} beenden?`
    : `Prüfung für alle ${anzahlAktiv} aktiven SuS beenden?`

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
          Prüfung beenden
        </h3>

        {!spibestaetigung ? (
          <>
            {/* Modus-Auswahl */}
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${modus === 'sofort' ? 'border-slate-800 dark:border-slate-200 bg-slate-50 dark:bg-slate-700/50' : 'border-slate-200 dark:border-slate-600'}">
                <input
                  type="radio"
                  name="modus"
                  checked={modus === 'sofort'}
                  onChange={() => setModus('sofort')}
                  className="accent-slate-800 dark:accent-slate-200"
                />
                <div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100">Sofort beenden</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Alle Antworten werden sofort abgegeben</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${modus === 'restzeit' ? 'border-slate-800 dark:border-slate-200 bg-slate-50 dark:bg-slate-700/50' : 'border-slate-200 dark:border-slate-600'}">
                <input
                  type="radio"
                  name="modus"
                  checked={modus === 'restzeit'}
                  onChange={() => setModus('restzeit')}
                  className="accent-slate-800 dark:accent-slate-200"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100">Restzeit geben</div>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={restzeitMinuten}
                      onChange={(e) => setRestzeitMinuten(Math.max(1, Number(e.target.value)))}
                      disabled={modus !== 'restzeit'}
                      className="w-16 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 disabled:opacity-50"
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Minuten</span>
                  </div>
                </div>
              </label>
            </div>

            {/* Hinweis Nachteilsausgleich */}
            {modus === 'restzeit' && anzahlMitNachteilsausgleich > 0 && !einzelnerSuS && (
              <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                {anzahlMitNachteilsausgleich} SuS mit Nachteilsausgleich erhalten zusätzliche Zeit.
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={onAbbrechen}
                className="px-4 py-2 text-sm border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={() => setBestaetigung(true)}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                Weiter
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Bestätigung */}
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
              {zielText}
              {modus === 'restzeit' && ` Sie erhalten noch ${restzeitMinuten} Minuten.`}
              {modus === 'sofort' && ' Alle Antworten werden sofort abgegeben.'}
            </p>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setBestaetigung(false)}
                className="px-4 py-2 text-sm border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Zurück
              </button>
              <button
                onClick={handleBeenden}
                disabled={spilade}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {spilade ? 'Wird beendet...' : 'Definitiv beenden'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

**Wichtig:** Die Template-Literal-Klassen in den label-Elementen müssen als echte Template-Literals mit Backticks geschrieben werden (nicht `${}` innerhalb von normalen Strings). Das wird beim Implementieren korrekt umgesetzt.

- [ ] **Step 2: Commit**

```bash
git add src/components/lp/BeendenDialog.tsx
git commit -m "Open-End: BeendenDialog — Sofort/Restzeit-Auswahl mit Bestätigung"
```

---

### Task 7: MonitoringDashboard + SchuelerZeile (LP-UI)

**Files:**
- Modify: `src/components/lp/MonitoringDashboard.tsx`
- Modify: `src/components/lp/SchuelerZeile.tsx`

- [ ] **Step 1: MonitoringDashboard — Beenden-Button + Dialog**

In `src/components/lp/MonitoringDashboard.tsx`:

**Imports hinzufügen** (nach den bestehenden Imports):
```typescript
import BeendenDialog from './BeendenDialog.tsx'
```

**State hinzufügen** (nach `const [ansicht, setAnsicht]`, ca. Zeile 32):
```typescript
  const [zeigBeendenDialog, setZeigBeendenDialog] = useState(false)
```

**Beenden-Button in `ansichtsButtons`** (nach dem ↻ Refresh-Button, ca. Zeile 258):
```typescript
            {zusammenfassung.aktiv + zusammenfassung.inaktiv > 0 && (
              <button
                onClick={() => setZeigBeendenDialog(true)}
                title="Prüfung für alle beenden"
                className="px-2.5 py-1.5 text-xs border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              >
                Beenden
              </button>
            )}
```

**BeendenDialog rendern** (vor dem schliessenden `</div>` des Haupt-Containers):
```typescript
        {zeigBeendenDialog && pruefungId && user && (
          <BeendenDialog
            pruefungId={pruefungId}
            lpEmail={user.email}
            anzahlAktiv={zusammenfassung.aktiv + zusammenfassung.inaktiv}
            anzahlMitNachteilsausgleich={
              daten.zeitverlaengerungen
                ? Object.keys(daten.zeitverlaengerungen).length
                : 0
            }
            onBeendet={() => { setZeigBeendenDialog(false); ladeDaten() }}
            onAbbrechen={() => setZeigBeendenDialog(false)}
          />
        )}
```

**Filter erweitern** (Zeile 16): `'beendet-lp'` zu Filter-Typ hinzufügen:
```typescript
type Filter = 'alle' | 'aktiv' | 'inaktiv' | 'abgegeben' | 'nicht-gestartet' | 'beendet-lp'
```

**Sortierung erweitern** (in `sortiere` Funktion, Zeile 156):
```typescript
const reihenfolge: Record<string, number> = { 'inaktiv': 0, 'aktiv': 1, 'beendet-lp': 2, 'nicht-gestartet': 3, 'abgegeben': 4 }
```

- [ ] **Step 2: SchuelerZeile — Einzeln-Beenden-Button**

In `src/components/lp/SchuelerZeile.tsx`:

**Import hinzufügen**:
```typescript
import BeendenDialog from './BeendenDialog.tsx'
```

**State in Komponente** (nach Zeile 21):
```typescript
  const [zeigBeendenDialog, setZeigBeendenDialog] = useState(false)
```

**Beenden-Button in Hauptzeile** (nach dem Nachteilsausgleich-Badge, ca. Zeile 47, innerhalb des Name-div):
```typescript
          {pruefungId && lpEmail && (schueler.status === 'aktiv' || schueler.status === 'inaktiv') && (
            <button
              onClick={(e) => { e.stopPropagation(); setZeigBeendenDialog(true) }}
              className="text-xs px-1.5 py-0.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              title="Prüfung für diesen SuS beenden"
            >
              Beenden
            </button>
          )}
```

**BeendenDialog rendern** (vor dem letzten `</div>` der Komponente):
```typescript
      {zeigBeendenDialog && pruefungId && lpEmail && (
        <BeendenDialog
          pruefungId={pruefungId}
          lpEmail={lpEmail}
          einzelnerSuS={{ email: schueler.email, name: schueler.name }}
          onBeendet={() => { setZeigBeendenDialog(false); onNachrichtGesendet?.() }}
          onAbbrechen={() => setZeigBeendenDialog(false)}
        />
      )}
```

- [ ] **Step 3: Build prüfen**

Run: `cd "/Users/durandbourjate/Documents/-Gym Hofwil/00 Automatisierung Unterricht/10 Github/GYM-WR-DUY/Pruefung" && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 4: Commit**

```bash
git add src/components/lp/MonitoringDashboard.tsx src/components/lp/SchuelerZeile.tsx
git commit -m "Open-End: LP-UI — Beenden-Button in Monitoring + SchuelerZeile"
```

---

### Task 8: Composer ConfigTab (Zeitmodus-Toggle)

**Files:**
- Modify: `src/components/lp/PruefungsComposer.tsx`

- [ ] **Step 1: Zeitmodus-Toggle im ConfigTab-Bereich**

Im ConfigTab-Bereich von `PruefungsComposer.tsx`, suche den Abschnitt wo `dauerMinuten` und `zeitanzeigeTyp` gesetzt werden. Füge darüber einen Zeitmodus-Toggle ein:

```typescript
{/* Zeitmodus */}
<div className="mb-4">
  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Zeitmodus</label>
  <div className="flex gap-1">
    {(['countdown', 'open-end'] as const).map((m) => (
      <button
        key={m}
        onClick={() => {
          setConfig((prev) => ({
            ...prev,
            zeitModus: m,
            ...(m === 'open-end' ? { zeitanzeigeTyp: 'verstricheneZeit' as const } : {}),
          }))
        }}
        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer
          ${config.zeitModus === m
            ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
      >
        {m === 'countdown' ? 'Countdown' : 'Open-End'}
      </button>
    ))}
  </div>
  {config.zeitModus === 'open-end' && (
    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
      Kein Zeitlimit. Beenden Sie die Prüfung manuell im Monitoring.
    </p>
  )}
</div>
```

**dauerMinuten + zeitanzeigeTyp nur bei Countdown anzeigen:**

Wrappe die bestehenden `dauerMinuten` und `zeitanzeigeTyp` Felder mit:
```typescript
{config.zeitModus !== 'open-end' && (
  <>
    {/* bestehende dauerMinuten + zeitanzeigeTyp Felder */}
  </>
)}
```

**Default `zeitModus` setzen:** In der initialen Config-Erstellung (wo neue Prüfung erstellt wird), `zeitModus: 'countdown'` hinzufügen.

- [ ] **Step 2: Build prüfen**

Run: `cd "/Users/durandbourjate/Documents/-Gym Hofwil/00 Automatisierung Unterricht/10 Github/GYM-WR-DUY/Pruefung" && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/components/lp/PruefungsComposer.tsx
git commit -m "Open-End: Composer — Zeitmodus-Toggle (Countdown/Open-End)"
```

---

### Task 9: Backend (Apps Script)

**Files:**
- Modify: `apps-script-code.js`

- [ ] **Step 1: `beendePruefung` Endpoint hinzufügen**

Im `doPost` Switch-Case, neuen Case hinzufügen:

```javascript
case 'beendePruefung':
  return beendePruefungEndpoint(body)
```

Neue Funktion:

```javascript
function beendePruefungEndpoint(body) {
  const { pruefungId, email, modus, restzeitMinuten, einzelneSuS } = body

  // Auth: nur LP
  if (!email || !email.endsWith('@gymhofwil.ch')) {
    return jsonResponse({ success: false, error: 'nicht_autorisiert' })
  }

  const beendetUm = modus === 'restzeit'
    ? new Date(Date.now() + (restzeitMinuten || 5) * 60000).toISOString()
    : new Date().toISOString()

  if (einzelneSuS && einzelneSuS.length > 0) {
    // Individuelles Beenden: in Antworten-Sheet pro SuS
    const sheetName = 'Antworten_' + pruefungId
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName(sheetName)
    if (!sheet) return jsonResponse({ success: false, error: 'pruefung_nicht_gefunden' })

    // Spalten-Migration: beendetUm + restzeitMinuten hinzufügen falls fehlend
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    let beendetUmCol = headers.indexOf('beendetUm') + 1
    let restzeitCol = headers.indexOf('restzeitMinuten') + 1
    if (beendetUmCol === 0) {
      beendetUmCol = headers.length + 1
      sheet.getRange(1, beendetUmCol).setValue('beendetUm')
    }
    if (restzeitCol === 0) {
      restzeitCol = (beendetUmCol === headers.length + 1 ? headers.length + 2 : headers.length + 1)
      sheet.getRange(1, restzeitCol).setValue('restzeitMinuten')
    }

    const emailCol = headers.indexOf('email') + 1
    const data = sheet.getDataRange().getValues()
    for (let i = 1; i < data.length; i++) {
      if (einzelneSuS.includes(data[i][emailCol - 1])) {
        sheet.getRange(i + 1, beendetUmCol).setValue(beendetUm)
        if (modus === 'restzeit') {
          sheet.getRange(i + 1, restzeitCol).setValue(restzeitMinuten)
        }
      }
    }
  } else {
    // Globales Beenden: in Configs-Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const configSheet = ss.getSheetByName('Configs')
    if (!configSheet) return jsonResponse({ success: false, error: 'configs_nicht_gefunden' })

    const headers = configSheet.getRange(1, 1, 1, configSheet.getLastColumn()).getValues()[0]
    const idCol = headers.indexOf('id') + 1

    // Spalten-Migration
    let beendetUmCol = headers.indexOf('beendetUm') + 1
    let restzeitCol = headers.indexOf('restzeitMinuten') + 1
    if (beendetUmCol === 0) {
      beendetUmCol = headers.length + 1
      configSheet.getRange(1, beendetUmCol).setValue('beendetUm')
    }
    if (restzeitCol === 0) {
      restzeitCol = (beendetUmCol === headers.length + 1 ? headers.length + 2 : headers.length + 1)
      configSheet.getRange(1, restzeitCol).setValue('restzeitMinuten')
    }

    const data = configSheet.getDataRange().getValues()
    for (let i = 1; i < data.length; i++) {
      if (data[i][idCol - 1] === pruefungId) {
        configSheet.getRange(i + 1, beendetUmCol).setValue(beendetUm)
        if (modus === 'restzeit') {
          configSheet.getRange(i + 1, restzeitCol).setValue(restzeitMinuten)
        }
        break
      }
    }
  }

  return jsonResponse({ success: true, beendetUm })
}
```

- [ ] **Step 2: Heartbeat-Endpoint erweitern — beendetUm zurückliefern**

Im bestehenden Heartbeat-Handler, nach dem Schreiben des Heartbeats und vor `return jsonResponse`, die Beenden-Felder prüfen:

```javascript
// Beenden-Signal prüfen (individuell → global)
let beendetUm = null
let restzeitMinutenWert = null

// 1. Individuell (aus Antworten-Sheet)
const antwortenHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
const beendetUmColIdx = antwortenHeaders.indexOf('beendetUm')
if (beendetUmColIdx >= 0 && row > 0) {
  const val = sheet.getRange(row, beendetUmColIdx + 1).getValue()
  if (val) {
    beendetUm = val
    const rzmColIdx = antwortenHeaders.indexOf('restzeitMinuten')
    if (rzmColIdx >= 0) {
      restzeitMinutenWert = sheet.getRange(row, rzmColIdx + 1).getValue() || null
    }
  }
}

// 2. Global (aus Configs-Sheet) falls kein individuelles
if (!beendetUm) {
  const configSheet = ss.getSheetByName('Configs')
  if (configSheet) {
    const configHeaders = configSheet.getRange(1, 1, 1, configSheet.getLastColumn()).getValues()[0]
    const configBeendetCol = configHeaders.indexOf('beendetUm')
    if (configBeendetCol >= 0) {
      const configData = configSheet.getDataRange().getValues()
      const configIdCol = configHeaders.indexOf('id')
      for (let i = 1; i < configData.length; i++) {
        if (configData[i][configIdCol] === pruefungId) {
          if (configData[i][configBeendetCol]) {
            beendetUm = configData[i][configBeendetCol]
            const configRzmCol = configHeaders.indexOf('restzeitMinuten')
            if (configRzmCol >= 0) {
              restzeitMinutenWert = configData[i][configRzmCol] || null
            }
          }
          break
        }
      }
    }
  }
}

return jsonResponse({
  success: true,
  ...(beendetUm ? { beendetUm, restzeitMinuten: restzeitMinutenWert } : {})
})
```

- [ ] **Step 3: `ladeConfig` Mapping erweitern**

In der Funktion die Config-Objekte baut (z.B. `ladeAlleConfigs` oder `ladePruefung`), `zeitModus` Feld hinzufügen:

```javascript
zeitModus: configRow.zeitModus || 'countdown',
```

- [ ] **Step 4: Commit**

```bash
git add apps-script-code.js
git commit -m "Open-End: Backend — beendePruefung Endpoint, Heartbeat-Erweiterung, zeitModus Mapping"
```

---

### Task 10: Integration + Default-Werte + Build

**Files:**
- Diverse: Default-Werte sicherstellen, Build prüfen

- [ ] **Step 1: Default `zeitModus: 'countdown'` überall setzen**

Suche alle Stellen wo `PruefungsConfig` Objekte erstellt werden:
- `demoConfig` in `src/data/demoPruefung.ts`
- Neue Prüfung in `PruefungsComposer.tsx` / `LPStartseite.tsx`
- Duplikat-Funktion

Überall `zeitModus: 'countdown'` hinzufügen.

- [ ] **Step 2: `beendetUm` bei `zuruecksetzen()` berücksichtigen**

In `pruefungStore.ts`, `initialState` enthält bereits `beendetUm: null, restzeitMinuten: null` (aus Task 2).

Prüfe ob `zuruecksetzen()` korrekt funktioniert (setzt auf `initialState`).

- [ ] **Step 3: Vite Dev-Server starten und manuell testen**

Run: `cd "/Users/durandbourjate/Documents/-Gym Hofwil/00 Automatisierung Unterricht/10 Github/GYM-WR-DUY/Pruefung" && npm run build 2>&1 | tail -10`

Erwartung: Build erfolgreich ohne Fehler.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Open-End: Defaults + Build-Fix — zeitModus überall gesetzt"
```

---

### Task 11: HANDOFF.md aktualisieren

**Files:**
- Modify: `HANDOFF.md`

- [ ] **Step 1: Neue Session-Sektion in HANDOFF.md**

Am Anfang unter "Aktueller Stand" die neue Phase eintragen und die offenen Punkte aktualisieren (Prüfungs-Durchführung erweitern: ✅).

- [ ] **Step 2: Commit + Push**

```bash
git add HANDOFF.md
git commit -m "Open-End: HANDOFF aktualisiert"
git push
```

**Wichtig:** Nach Push muss `apps-script-code.js` in Apps Script Editor kopiert + neue Bereitstellung erstellt werden.
