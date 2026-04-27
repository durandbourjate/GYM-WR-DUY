# Bundle G.f — LP-Startseite Skeleton-Pattern (Design-Spec)

> **Status:** Design — wartet auf Spec-Review + User-Freigabe
> **Datum:** 2026-04-27
> **Session:** S151
> **Vorgänger:** G.d.1 + G.d.2 + G.e (in dieser Session designed)

## Zielsetzung

Globalen `LPSkeleton` ergänzen durch **per-Section-Skeleton** für die LP-Startseite. Header + Tabs sind sofort sichtbar (~100ms), Sections (Cards / Übungen / Tracker) zeigen Skeleton bis ihre jeweiligen Daten da sind. Behebt drei UX-Schmerzen:

1. **Tracker-Tab** zeigt während Lade **"Keine Tracker-Daten verfügbar"** ([LPStartseite.tsx:632](../../../src/components/lp/LPStartseite.tsx#L632)) — wirkt wie "leer" statt "lädt"
2. **Übungs-Tab** zeigt **"Übungen werden geladen…"**-Text ([Z. 489](../../../src/components/lp/LPStartseite.tsx#L489)) statt visueller Skeleton
3. **Initial-LPSkeleton** ist generisch (immer 6 Karten) — nicht layout-akkurat

**Erwartbarer Win:** Wahrgenommener Lade-Beginn 5-8s → ~100ms. Header + Tabs nutzbar während Backend lädt. Lade-Phasen werden als progressiv gefüllt erlebt statt als "alles weg / alles da".

## Bundle-G-Roadmap-Kontext

| Sub-Bundle | Inhalt | Architektur-Familie |
|---|---|---|
| G.d.1 | Polling + Backend-Pre-Warm | G.a-Familie |
| G.d.2 | Stammdaten-IDB-Cache | G.c-Familie |
| G.e | Fragensammlung Virtualisierung | UI-Performance |
| **G.f** | LP-Startseite Skeleton-Pattern | **UI-Wahrnehmung** |

G.f ist eigenständig und kann parallel zu G.d.x/G.e gemerged werden. Pattern-Vorlage für mögliches Future-Bundle G.f.2 (App-weit Skeleton).

## Architektur

### Lade-Status granularer modellieren

Bestehend: ein boolean `ladeStatus: 'laden' | 'fertig'` deckt Configs ab. TrackerDaten hat impliziten Status via `trackerDaten === null`.

Neu — **3 unabhängige Lade-States:**

```ts
const [configsLadeStatus, setConfigsLadeStatus] = useState<'laden' | 'fertig'>('laden')
const [trackerLadeStatus, setTrackerLadeStatus] = useState<'laden' | 'fertig'>('laden')
// stammdatenLadeStatus existiert bereits in useStammdatenStore — wird nicht angefasst
```

`configsLadeStatus` ersetzt das bestehende `ladeStatus` 1:1 (Renaming für Klarheit). `trackerLadeStatus` wird auf `'fertig'` gesetzt, sobald `apiService.ladeTrackerDaten` resolved (egal ob Daten oder Fehler):

```ts
apiService.ladeTrackerDaten(user.email).then(trackerResult => {
  if (trackerResult) setTrackerDaten(trackerResult)
  setTrackerLadeStatus('fertig')
}).catch(err => {
  console.warn('[LP] Tracker-Laden fehlgeschlagen:', err)
  setTrackerLadeStatus('fertig')
})
```

### Header + Tabs sofort sichtbar

Der globale `if (ladeStatus !== 'fertig') return <LPSkeleton />` ([Z. 446](../../../src/components/lp/LPStartseite.tsx#L446)) **entfällt**.

Stattdessen rendert das normale Layout immer. Einzelne Sektionen entscheiden anhand ihres jeweiligen Lade-States, ob Skeleton oder Inhalt gezeigt wird. Header (Suche, Filter, Sortierung, Tab-Navigation) ist sofort interaktiv — User kann sortieren, filtern, Tabs wechseln, ohne auf Daten zu warten.

### Drei neue Skeleton-Komponenten

Pfad: `src/components/lp/skeletons/`

```
+ LPCardsSkeleton.tsx       (~35 Z., Grid mit N Karten-Placeholdern, Layout-akkurat)
+ LPTrackerSkeleton.tsx     (~30 Z., 2 horizontale Panel-Streifen für FehlendeSuS + NotenStand)
+ LPUebungenSkeleton.tsx    (~25 Z., Liste mit N Übungs-Zeilen-Placeholdern)
```

Alle drei nutzen das bestehende Pattern aus [`LPSkeleton.tsx`](../../../src/components/lp/LPSkeleton.tsx) (Tailwind `bg-slate-200/700 rounded animate-pulse`). Layout-akkurat:

- **`LPCardsSkeleton`** matched die echte Karten-Form (Padding, Tags-Bereich, Kard-Höhe ≈ 120px)
- **`LPTrackerSkeleton`** matched FehlendeSuSPanel + NotenStandPanel (zwei einklappbare Sektionen mit Header + Inhalt)
- **`LPUebungenSkeleton`** matched die Übungs-Listen-Zeile (kompakt, andere Form als Cards)

### Q2b — Cards-/Übungs-Anzahl aus localStorage

Beim erfolgreichen Configs-Laden persistieren wir die zwei Counts:

```ts
// Nach erfolgreichem ladeAlleConfigs:
try {
  localStorage.setItem('examlab-lp-letzte-summative-anzahl', String(summativeConfigs.length))
  localStorage.setItem('examlab-lp-letzte-formative-anzahl', String(formativeConfigs.length))
} catch { /* sessionStorage nicht verfügbar */ }
```

Beim Mount lesen die Skeletons die Werte als Default-Anzahl:

```ts
function leseGespeicherteAnzahl(key: string, fallback: number): number {
  try {
    const v = localStorage.getItem(key)
    const n = v ? parseInt(v, 10) : NaN
    if (Number.isFinite(n) && n >= 0 && n <= 50) return n  // Sanity-Check
    return fallback
  } catch {
    return fallback
  }
}
```

`LPCardsSkeleton` rendert `min(max(gespeicherteAnzahl, 3), 12)` Cards (Range 3-12 für vernünftige Skeleton-Optik). `LPUebungenSkeleton` analog. Erste Session ohne localStorage: Fallback auf 6 / 4.

### Q3a — `LPSkeleton.tsx` behalten

Der bestehende globale `LPSkeleton` bleibt unverändert. Er wird in der `Suspense`-fallback-Position für lazy-loaded LP-Komponenten (Z. 34: "Lazy-loaded Komponenten") verwendet. Im Plan zu prüfen, wo genau er aktuell als Suspense-Fallback eingehängt ist.

Falls `LPSkeleton` aktuell nirgends mehr als Suspense-Fallback dient: löschen. Wenn er noch dient: behalten.

### Q4a — Eigene `LPUebungenSkeleton`

Eigenes Layout für Übungen-Tab — formative Configs werden in `LPStartseite.tsx` als kompaktere Liste gerendert (im Code zu lokalisieren), nicht als Karten-Grid. Eigener Skeleton matched dieses Layout.

### Render-Pattern in `LPStartseite.tsx`

```tsx
// Statt:
//   if (configsLadeStatus !== 'fertig') return <LPSkeleton />
// Layout immer rendern, in Sections:

{/* Übungs-Karten (Z. ~488-503) */}
{listenTab === 'uebungen' && (
  configsLadeStatus === 'laden' ? (
    <LPUebungenSkeleton />
  ) : formativeConfigs.length === 0 ? (
    <p className="text-slate-400 dark:text-slate-500 text-center py-12">
      Keine Übungen vorhanden.
    </p>
  ) : (
    <UebungenGrid />
  )
)}

{/* Prüfungs-Karten */}
{listenTab === 'pruefungen' && (
  configsLadeStatus === 'laden' ? (
    <LPCardsSkeleton />
  ) : summativeConfigs.length === 0 ? (
    <EmptyStatePruefungen />
  ) : (
    <PruefungenGrid />
  )
)}

{/* Tracker (Z. ~628-636) */}
{listenTab === 'tracker' && (
  trackerLadeStatus === 'laden' ? (
    <LPTrackerSkeleton />
  ) : trackerDaten ? (
    <TrackerSection trackerDaten={trackerDaten} />
  ) : (
    <p>Keine Tracker-Daten verfügbar.</p>
  )
)}
```

Das alte "Keine Tracker-Daten verfügbar"-Label bleibt — wird aber nur noch angezeigt wenn **wirklich** keine Daten da sind (`trackerLadeStatus === 'fertig' && !trackerDaten`).

## Datenfluss pro Use-Case

### Use-Case A — LP-Login (frisch)

```
LP klickt Google-Login → authStore.anmelden
  ↓
Header + Tabs gerendert sofort (~100ms)
  ↓
LP sieht Cards-Skeleton (basierend auf gespeicherter Anzahl, oder 6)
  ↓
configsLadeStatus = 'laden' → LPCardsSkeleton sichtbar
  ↓
~3-5s später: ladeAlleConfigs resolved
  ↓
configsLadeStatus = 'fertig', echte Cards rendern
  ↓
localStorage.setItem('examlab-lp-letzte-summative-anzahl', ...)
```

### Use-Case B — Tab-Wechsel zu Tracker während Lade

```
LP klickt Tracker-Tab (kurz nach Login)
  ↓
listenTab = 'tracker', trackerLadeStatus = 'laden'
  ↓
LPTrackerSkeleton sichtbar (statt "Keine Daten")
  ↓
~6-8s später: ladeTrackerDaten resolved
  ↓
trackerLadeStatus = 'fertig', echter TrackerSection rendert
```

### Use-Case C — Re-Login (mit gespeicherter Anzahl)

```
LP-Login zum 2.+ Mal in der Browser-Geschichte
  ↓
LPCardsSkeleton liest localStorage 'examlab-lp-letzte-summative-anzahl' = 12
  ↓
12 Karten-Placeholder erscheinen — match dem User-typischen Anzahl
  ↓
3-5s später: echte 12 Cards (oder andere Zahl, falls Configs sich änderten)
  ↓
Sanftere visuelle Übergangs-Erfahrung als generisch 6
```

### Use-Case D — Tracker-Lade-Fehler

```
ladeTrackerDaten wirft (Backend-down, Quota etc.)
  ↓
catch-Block: setTrackerLadeStatus('fertig')
  ↓
trackerLadeStatus = 'fertig' && !trackerDaten
  ↓
"Keine Tracker-Daten verfügbar."-Label sichtbar (= heutiges Verhalten bei Fehler)
```

## Fehlerbehandlung

| Fehler | Verhalten |
|---|---|
| `apiService.ladeAlleConfigs` schlägt fehl | bestehender catch setzt `backendFehler=true`, **plus neu** `configsLadeStatus = 'fertig'` damit Skeleton verschwindet und Fehler-UI sichtbar wird |
| `apiService.ladeTrackerDaten` schlägt fehl | catch setzt `trackerLadeStatus = 'fertig'`, "Keine Daten"-Label sichtbar |
| localStorage nicht verfügbar (Privacy-Modus) | try/catch in `leseGespeicherteAnzahl` → Fallback 6 / 4 |
| localStorage liefert garbled value | parseInt + Sanity-Check (0-50) → Fallback 6 / 4 |
| Demo-Modus | `setLadeStatus('fertig')` direkt nach `setConfigs(demoConfigs())` — Demo-Trackerdaten direkt → `trackerLadeStatus = 'fertig'` |
| User wechselt Tab während Lade | Lade-Status pro Section unabhängig → Tab-Wechsel beeinflusst Lade-Status nicht |

## Edge-Cases

| Edge-Case | Verhalten |
|---|---|
| Erst-Login (kein localStorage) | LPCardsSkeleton zeigt 6 Cards, LPUebungenSkeleton zeigt 4 Zeilen |
| LP hat 0 Prüfungen, gespeicherte Anzahl ist `0` | `Math.max(0, 3)` → 3 Cards Skeleton (für visuelle Konsistenz statt 0) |
| LP hat 100+ Prüfungen | Skeleton ist auf 12 begrenzt (Sanity-Cap) |
| User wechselt Tab schnell zwischen Pruefungen / Uebungen / Tracker | Jeder Tab-Wechsel rendert sofort den passenden Skeleton oder Inhalt — kein Flicker, weil Lade-Status unabhängig |
| Demo-Modus mit `setLadeStatus('fertig')` synchron | Skeleton blitzt nicht auf, Inhalt direkt |
| Auf preview redeployed während User offen ist | SW-Cache-Bust + Reload → frisch Skeleton, dann Inhalt |
| Tab nicht aktiv (z.B. user wartet auf Configs-Tab im "tracker"-Tab) | Tracker-Skeleton sichtbar bis Daten da; Configs werden parallel geladen, beide Tabs werden befüllt |

## Test-Strategie

### Unit (vitest)

**`LPCardsSkeleton.test.tsx` (~3 Cases):**
- Render mit gespeicherter Anzahl 8 → 8 Card-Placeholder im DOM
- Render ohne localStorage-Wert → 6 Card-Placeholder (Fallback)
- localStorage-Wert ausserhalb Range (-1, 100) → 3 oder 12 (clamped)

**`LPTrackerSkeleton.test.tsx` (~2 Cases):**
- Render zeigt 2 Panel-Strukturen (Match FehlendeSuS + NotenStand)
- animate-pulse Klasse vorhanden

**`LPUebungenSkeleton.test.tsx` (~2 Cases):**
- Render mit gespeicherter Anzahl 5 → 5 Zeilen
- Default 4 Zeilen ohne localStorage

**`LPStartseite.test.tsx` (oder Erweiterung, ~5 Cases):**
- Wenn `configsLadeStatus === 'laden'` und `listenTab === 'pruefungen'` → `LPCardsSkeleton` gerendert
- Wenn `configsLadeStatus === 'laden'` und `listenTab === 'uebungen'` → `LPUebungenSkeleton` gerendert
- Wenn `trackerLadeStatus === 'laden'` und `listenTab === 'tracker'` → `LPTrackerSkeleton` gerendert
- Wenn beide `'fertig'` und Daten da → echte Komponenten
- Tracker-Fehler-Pfad → `trackerLadeStatus = 'fertig'`, "Keine Daten"-Label sichtbar

**Erwarteter neuer Test-Stand:** 731 baseline + ~12 neue = ~743 vitest grün.

### Browser-E2E (preview, echter LP-Login)

| # | Pfad | Erwartung |
|---|---|---|
| 1 | LP-Login → LPStartseite | Header + Tabs sofort sichtbar (≤100ms), Cards-Skeleton sichtbar |
| 2 | Während Configs laden → Tab-Wechsel zu "Tracker" | LPTrackerSkeleton sichtbar (statt "Keine Daten") |
| 3 | Konfigs sind geladen → Wechsel zu "Übungen" | LPUebungenSkeleton sichtbar bis formative Configs da |
| 4 | Refresh-Button → erneutes Laden | Skeleton kurz sichtbar bis Daten neu da |
| 5 | Light-Mode + Dark-Mode visuell vergleichen | Skeleton in beiden Themen lesbar (Tailwind `bg-slate-200 dark:bg-slate-700`) |
| 6 | Re-Login mit grösserer Konfig-Anzahl in localStorage | Cards-Skeleton zeigt mehr Cards (akkurater) |

## Akzeptanz-Kriterien

| Kriterium | Wert |
|---|---|
| Header + Tabs sichtbar nach Login | ≤100ms |
| Cards-Skeleton sichtbar während Configs laden | ja |
| Tracker-Skeleton sichtbar während TrackerDaten laden | ja, sowohl bei Background-Load als auch bei Tab-Klick |
| "Keine Tracker-Daten"-Label nur wenn wirklich leer | ja (`trackerLadeStatus === 'fertig' && !trackerDaten`) |
| Übungen-Tab Skeleton statt Text-Label | ja |
| Skeleton-Anzahl aus localStorage gelesen (Range 3-12) | ja |
| Light/Dark Mode beide funktional | ja |
| `LPSkeleton.tsx` bleibt unverändert (oder gelöscht falls ungenutzt) | ja |
| Alle vitest grün | 731 baseline + ~12 neue |
| `tsc -b` clean | ja |
| `npm run build` erfolgreich | ja |
| Browser-E2E grün | 6/6 Punkte |

## Reihenfolge der Implementierung (Plan-Phase)

1. **Drei Skeleton-Komponenten** (`LPCardsSkeleton`, `LPTrackerSkeleton`, `LPUebungenSkeleton`) als isolierte Files mit Unit-Tests
2. **localStorage-Helper** `leseGespeicherteAnzahl` als Util in `src/utils/`
3. **`LPStartseite.tsx`** Refactor:
   - `ladeStatus` umbenannt zu `configsLadeStatus` (~9 Aufruf-Stellen, alle mit `setLadeStatus` mitumbenennen)
   - `trackerLadeStatus`-State hinzugefügt + bei Tracker-Lade-Resolve gesetzt (sowohl im success- als auch im catch-Pfad)
   - **`handleZurueck` (Z. 421-434)**: bei Re-Load auch `setTrackerLadeStatus('laden')` setzen, sonst zeigt Tracker-Tab keinen Skeleton während Re-Load
   - localStorage-Persist nach erfolgreichem Configs-Lade (Bindestrich-Convention `examlab-lp-letzte-summative-anzahl` analog `examlab-ueben-letzter-kurs`)
   - Globaler `<LPSkeleton />` Early-Return entfernt (Z. 446)
   - Pro-Section Skeleton-Render-Pattern eingeführt
   - "Übungen werden geladen…"-Text-Label entfernt (Z. 489)
4. **`tsc -b`** + **`npm run build`** + **`npm test`** komplett grün
5. **Browser-E2E** auf preview mit echtem LP-Login + Beobachtung der Lade-Phasen
6. **Visual Smoke-Test** Light + Dark Mode für alle 3 Skeletons
7. **Plan-Phase Recheck:** wird `LPSkeleton.tsx` noch als Suspense-Fallback verwendet? Falls nein → Ergänzungs-Commit zum Löschen
8. **Merge auf main** nach LP-Freigabe

Geschätzte Subagent-Sessions: ~6-8 Commits in 1 Implementations-Session.

## Was wir explizit NICHT in G.f machen

- **App-weite Skeleton-Pattern** für KorrekturDashboard / DurchfuehrenDashboard / FragenBrowser → mögliches Future-Bundle G.f.2
- **Refactor LPStartseite.tsx** (1007 Z.) — getrennte Aufgabe, würde Scope sprengen
- **Animations-Framework** (Framer-Motion, Shimmer-Library) — Tailwind `animate-pulse` reicht
- **Skeleton mit echten Daten-Vorab-Werten** (z.B. Anzahl der Cards aus IDB-Cache) — würde G.d.2-Cache-Integration brauchen, separate Optimierung
- **Suspense-basierter Skeleton** — heutiges State-basiertes Pattern bleibt, einfacher
- **Globaler `<LPSkeleton />` Erweiterung** für Rolle-Wechsel oder Logout-Flash — Out-of-Scope

## Verifizierte Annahmen (Code-Read 2026-04-27)

- **`LPStartseite.tsx`** ist 1007 Z. ([LPStartseite.tsx](../../../src/components/lp/LPStartseite.tsx))
- **`LPSkeleton.tsx`** existiert ([LPSkeleton.tsx](../../../src/components/lp/LPSkeleton.tsx)) als globaler Skeleton mit 6 generischen Karten
- **Globaler Early-Return** in [Z. 446](../../../src/components/lp/LPStartseite.tsx#L446): `if (ladeStatus !== 'fertig' && ansicht !== 'composer') return <LPSkeleton />`
- **Tracker-Lade** ([Z. 365-367](../../../src/components/lp/LPStartseite.tsx#L365)) ist fire-and-forget ohne Status-Update
- **"Keine Tracker-Daten verfügbar"-Label** ([Z. 632-634](../../../src/components/lp/LPStartseite.tsx#L632)) wird IMMER angezeigt wenn `!trackerDaten` — auch während Lade
- **"Übungen werden geladen…"-Text** ([Z. 489](../../../src/components/lp/LPStartseite.tsx#L489)) statt Skeleton
- **`TrackerSection`** ([TrackerSection.tsx](../../../src/components/lp/TrackerSection.tsx)) rendert FehlendeSuSPanel + NotenStandPanel — Skeleton-Layout muss diese Form matchen
- **Tailwind `animate-pulse`** + `bg-slate-200/700` Pattern bereits etabliert in `LPSkeleton.tsx`
- **`apiService.ladeAlleConfigs`-Call** in [Z. 330](../../../src/components/lp/LPStartseite.tsx#L330) — Persistenz-Stelle für `lastSummativeCount`/`lastFormativeCount`

## Im Plan zu lokalisieren

- **Übungs-Liste-Layout** in LPStartseite: konkrete JSX-Stelle für Übungen-Tab (formative Configs) — `LPUebungenSkeleton` matched dieses Layout
- **Suspense-Fallback-Stellen** für `LPSkeleton`: aktuell als Fallback für lazy-loaded Komponenten in [Z. 34](../../../src/components/lp/LPStartseite.tsx#L34) erwähnt — exakte `<Suspense fallback={...} />` finden
- **EmptyStatePruefungen / EmptyStateUebungen**: existieren als separate Komponenten oder inline in LPStartseite? — Plan-Phase prüft
- **Demo-Modus-Pfad**: `setTrackerLadeStatus('fertig')` muss auch im Demo-Pfad gesetzt werden, sonst hängt Tracker-Skeleton ewig
- **`backendFehler === true`-Pfad**: bei Configs-Fehler darf `LPCardsSkeleton` nicht ewig sichtbar bleiben — Skeleton verschwindet bei `configsLadeStatus = 'fertig'` zusammen mit Fehler-UI
