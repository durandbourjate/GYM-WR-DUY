# Bundle G.d.2 — Stammdaten-IDB-Cache (Design-Spec)

> **Status:** Design — wartet auf Spec-Review + User-Freigabe
> **Datum:** 2026-04-27
> **Session:** S151
> **Vorgänger:** G.d.1 (Phasen-Übergang-Latenzen, in dieser Session designed)
> **Pattern-Vorlage:** Bundle G.c (Login-Pre-Fetch + Logout-Cleanup, S149 auf `main`)

## Zielsetzung

Stammdaten (Klassenlisten + Gruppen), die heute beim Mount der zugehörigen Komponente synchron geladen werden, beim Login fire-and-forget in IndexedDB cachen. Folge-Aufrufe (Vorbereitungs-Tab, Header, Üben-Übersicht) lesen aus dem warmen Cache und rendern instant statt 2-3s Wartezeit.

**Erwartbarer Win:**
- LP klickt "Durchführen" → Vorbereitungs-Tab → "SuS hinzufügen"-Dropdown ist sofort sichtbar (statt nach 2-3s)
- LP+SuS Üben-Tab Kurs-Auswahl: instant statt 2-3s
- Header-Switcher Multi-Teacher (falls auf Gruppen basiert): instant

## Bundle-G-Roadmap-Kontext

Brainstorming hat G.d in zwei Sub-Bundles zerlegt (siehe G.d.1-Spec):

| Sub-Bundle | Inhalt | Architektur-Familie |
|---|---|---|
| **G.d.1** | Polling-Tuning + Backend-Pre-Warm (4 Hebel) | G.a-Familie |
| **G.d.2** | IDB-Cache für Klassenlisten + Gruppen (diese Spec) | **G.c-Familie** |

G.d.2 ist eine direkte Replikation des G.c-Pattern (Fragenbank-Cache):
- IDB pro Datentyp mit Stores (data + meta)
- Login-Pre-Fetch fire-and-forget in `authStore.anmelden`
- Logout-Cleanup mit `tx.oncomplete`-await in `authStore.abmelden` (S149-Lehre)
- TTL-basierte Cache-Validierung
- Frontend-only, kein neuer Backend-Endpoint

Was G.d.2 NICHT enthält → "Was wir explizit NICHT in G.d.2 machen" am Ende.

## Architektur

### Neu — `src/services/klassenlistenCache.ts`

Direkte Kopie des `fragenbankCache.ts`-Patterns mit angepassten Konstanten:

```ts
const IDB_NAME = 'examlab-klassenlisten-cache'
const IDB_VERSION = 1
const STORE_DATA = 'data'
const STORE_META = 'meta'
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000  // 24h (Q1a-Entscheidung)

export async function getCachedKlassenlisten(): Promise<KlassenlistenEintrag[] | null>
export async function setCachedKlassenlisten(data: KlassenlistenEintrag[]): Promise<void>
export async function clearKlassenlistenCache(): Promise<void>  // tx.oncomplete-await
```

`isCacheValid(meta)` analog G.c. Silent-Fail bei IDB-Fehlern (`try/catch → return null`).

### Neu — `src/services/gruppenCache.ts`

Identisches Schema, separate IDB-Datei:

```ts
const IDB_NAME = 'examlab-gruppen-cache'
const STORE_GRUPPEN = 'gruppen'
const STORE_MITGLIEDER = 'mitglieder'  // Map<gruppeId, Mitglied[]>
const STORE_META = 'meta'

export async function getCachedGruppen(): Promise<Gruppe[] | null>
export async function setCachedGruppen(data: Gruppe[]): Promise<void>
export async function getCachedMitglieder(gruppeId: string): Promise<Mitglied[] | null>
export async function setCachedMitglieder(gruppeId: string, data: Mitglied[]): Promise<void>
export async function clearGruppenCache(): Promise<void>  // tx.oncomplete-await
```

Mitglieder werden **pro Gruppe** im Mitglieder-Store gehalten (Key = gruppeId), weil `gruppenStore.ladeGruppen` schon heute Mitglieder der aktiven Gruppe nachlädt. Alle gecached → sofortiger Wechsel zwischen Gruppen.

### Neu — `src/store/klassenlistenStore.ts`

```ts
interface KlassenlistenState {
  daten: KlassenlistenEintrag[] | null
  ladeStatus: 'idle' | 'laden' | 'fertig' | 'fehler'

  lade: (email: string, opts?: { force?: boolean }) => Promise<void>
  reset: () => Promise<void>  // async, awaitet clearKlassenlistenCache
}
```

Verhalten von `lade(email, opts)`:
1. Wenn `opts.force !== true`: Cache-Hit-Versuch via `getCachedKlassenlisten()`
2. Cache-Hit (TTL-valide): `set({ daten: cached, ladeStatus: 'fertig' })`, return
3. Cache-Miss / force: API-Call `apiService.ladeKlassenlisten(email)`
4. Erfolg: `setCachedKlassenlisten(daten)` + `set({ daten, ladeStatus: 'fertig' })`
5. Fehler: `set({ ladeStatus: 'fehler' })` — kein Cache-Update

Verhalten von `reset()`:
1. `set({ daten: null, ladeStatus: 'idle' })`
2. `await clearKlassenlistenCache()` (S149-Lehre: vor Hard-Nav `tx.oncomplete` warten)

### Erweiterung — `src/store/ueben/gruppenStore.ts`

`useUebenGruppenStore` existiert bereits. Bestehende Felder unverändert. Erweitern um:
- IDB-Cache-Hit-Versuch in `ladeGruppen` (vor API-Call)
- IDB-Cache-Write nach erfolgreichem API-Call
- Mitglieder-Cache-Hit-Versuch in `waehleGruppe`
- Mitglieder-Cache-Write nach erfolgreichem API-Call
- Neue Action `reset()` async, analog `klassenlistenStore.reset`

```ts
// Skizze ladeGruppen:
ladeGruppen: async (email: string, opts?: { force?: boolean }) => {
  set({ ladeStatus: 'laden' })
  try {
    let gruppen = !opts?.force ? await getCachedGruppen() : null
    if (!gruppen) {
      gruppen = await uebenGruppenAdapter.ladeGruppen(email)
      await setCachedGruppen(gruppen)
    }
    // ... Auto-Select, aktiveGruppe-Logic bleibt unverändert
    set({ gruppen, aktiveGruppe, ladeStatus: 'fertig' })

    if (aktiveGruppe) {
      let mitglieder = !opts?.force ? await getCachedMitglieder(aktiveGruppe.id) : null
      if (!mitglieder) {
        mitglieder = await uebenGruppenAdapter.ladeMitglieder(aktiveGruppe.id)
        await setCachedMitglieder(aktiveGruppe.id, mitglieder)
      }
      set({ mitglieder })
    }
  } catch (err) {
    set({ ladeStatus: 'fehler' })
  }
}
```

`waehleGruppe(gruppeId)`-Logic analog für Mitglieder-Cache.

`reset()`:
```ts
reset: async () => {
  set({ gruppen: [], aktiveGruppe: null, mitglieder: [], ladeStatus: 'idle' })
  await clearGruppenCache()
}
```

### Auth-Integration — `src/store/authStore.ts`

**`anmelden` erweitern (Z. 142-144 ist bereits G.c-Pattern für Fragenbank):**

```ts
// LP-Login (anmelden via GoogleCredential, Z. 115)
// G.c (existing):
void useFragenbankStore.getState().lade(credential.email).catch(...)

// G.d.2 NEU für LP:
void useKlassenlistenStore.getState().lade(credential.email).catch((e) => {
  console.warn('[G.d.2] Klassenlisten-Pre-Fetch fail:', e)
})
void useUebenGruppenStore.getState().ladeGruppen(credential.email).catch((e) => {
  console.warn('[G.d.2] Gruppen-Pre-Fetch fail:', e)
})

// SuS-Login (anmeldenMitCode, Z. 150) — Q3a-Entscheidung: nur Gruppen
// G.d.2 NEU für SuS:
void useUebenGruppenStore.getState().ladeGruppen(email).catch((e) => {
  console.warn('[G.d.2] Gruppen-Pre-Fetch fail (SuS):', e)
})
```

**`abmelden` erweitern (Z. 199-215 ist bereits G.c-Pattern):**

```ts
abmelden: async () => {
  // G.c existing + G.d.2 NEU:
  await Promise.all([
    useFragenbankStore.getState().reset(),
    useKlassenlistenStore.getState().reset(),
    useUebenGruppenStore.getState().reset(),
  ])
  clearSession()
  await resetPruefungState()
  set({ user: null, istDemoModus: false, ladeStatus: 'idle', fehler: null })
  if (typeof window !== 'undefined') {
    window.location.href = import.meta.env.BASE_URL + 'login'
  }
}
```

`Promise.all` statt sequentiell, weil unabhängige IDB-Datenbanken — kann parallel laufen.

### Component-Integration — `VorbereitungPhase.tsx`

```ts
// Bisher (Z. 47-69):
const ladeKlassenlisten = useCallback(async () => {
  ...
  const daten = await apiService.ladeKlassenlisten(user.email)
  ...
}, [...])

useEffect(() => { ladeKlassenlisten() }, [ladeKlassenlisten])

// G.d.2 NEU:
const klassenlistenStore = useKlassenlistenStore()
useEffect(() => {
  if (user) klassenlistenStore.lade(user.email)
}, [user])

// Refresh-Button (Z. 296-297):
onClick={(e) => {
  e.stopPropagation()
  klassenlistenStore.lade(user.email, { force: true })  // Cache bypass
}}

// Render-Logic ersetzt rohDaten durch klassenlistenStore.daten
```

Component erhält die Daten reaktiv via Zustand-Selector (statt lokalem `useState`). Refresh-Button setzt `force: true` → Cache-Bypass.

### Component-Integration — Üben-Tab + Header

`useUebenGruppenStore.ladeGruppen` wird bereits an mehreren Stellen aufgerufen (im Plan exakt zu lokalisieren). Da der Store jetzt intern Cache-First ist, **keine Component-Änderung nötig** — bestehende Caller profitieren transparent.

## Datenfluss pro Use-Case

### Use-Case A — LP-Login → Vorbereitungs-Tab instant

```
LP klickt Google-Login → authStore.anmelden
  ↓
Backend authentifiziert + LPs werden geladen (existing path, unchanged)
  ↓
G.c: void useFragenbankStore.lade(email)  [parallel, fire-and-forget]
G.d.2: void useKlassenlistenStore.lade(email)  [parallel, fire-and-forget]
G.d.2: void useUebenGruppenStore.ladeGruppen(email)  [parallel, fire-and-forget]
  ↓
LP klickt "Durchführen" auf Prüfung — DurchfuehrenDashboard mountet
  ↓
LP klickt Tab "Vorbereitung" — VorbereitungPhase mountet
  ↓
useEffect → klassenlistenStore.lade(email)
  → Cache-Hit aus IDB (TTL-valide, Pre-Fetch hat es geschrieben)
  → set daten ohne API-Call (~5ms)
  ↓
Render: Klassenlisten-Dropdown sofort gefüllt
```

### Use-Case B — Cache-Miss (ablauf, force, oder erste Session)

```
VorbereitungPhase mountet
  ↓
klassenlistenStore.lade(email)
  → getCachedKlassenlisten() → null (TTL abgelaufen oder erste Session)
  → API-Call apiService.ladeKlassenlisten(email)
  → Latenz wie heute (~2-3s)
  → setCachedKlassenlisten(daten)
  → set daten
  ↓
Render: Klassenlisten-Dropdown gefüllt nach 2-3s (= heutiges Verhalten)
```

### Use-Case C — Refresh-Klick

```
LP klickt Refresh-Button (z.B. weil neuer SuS in Klasse, Sheet manuell editiert)
  ↓
klassenlistenStore.lade(email, { force: true })
  → Cache-Hit-Versuch übersprungen
  → API-Call → frische Daten
  → setCachedKlassenlisten überschreibt alten Cache
  → set daten
```

### Use-Case D — Logout

```
LP klickt Abmelden → authStore.abmelden
  ↓
await Promise.all([fragenbankStore.reset, klassenlistenStore.reset,
                   gruppenStore.reset])
  → jeder reset(): set + await clearXxxCache (tx.oncomplete-await,
    S149-Lehre)
  ↓
window.location.href = '/login'
  ↓
Privacy-Garantie: alle 3 IDB-Stores nachweislich leer auf geteilten Schul-Geräten
```

## Fehlerbehandlung

### Frontend-Fehlerpfade

| Fehler | Verhalten |
|---|---|
| `getCachedX` IDB-Lesefehler | try/catch → return null → API-Call wie heute |
| `setCachedX` IDB-Schreibfehler | try/catch → silent → kein Cache, aber Daten in State |
| Login-Pre-Fetch API-Fehler | catch im fire-and-forget → console.warn → kein User-Feedback |
| Mount-Time API-Fehler bei Cache-Miss | ladeStatus 'fehler' → bestehende Error-UI in VorbereitungPhase |
| Logout-Cleanup IDB-Fehler | catch in clearXxxCache (silent) → window.location.href läuft |
| `reset()` während Pre-Fetch noch läuft | Race: reset setzt State leer, Pre-Fetch schreibt später Cache. Logout-cleanup ist async + die Funktion garantiert tx.oncomplete — Pre-Fetch-Schreibe finden alten oder neuen DB-State, beides okay. |

**Privacy-Garantie:** Wie G.c hängt die Logout-Garantie davon ab, dass `reset()` vor `window.location.href` awaited wird. `Promise.all` der drei Resets erfüllt das.

### Cache-Stale-Risiko

| Szenario | Risiko | Mitigation |
|---|---|---|
| LP fügt SuS manuell zur Klassenliste (Sheet-Edit) | Bis 24h Stale-Daten | Refresh-Button → force-Reload |
| LP wird neuer Lernplattform zugewiesen | Bis 24h ohne Sichtbarkeit | Refresh-Button (Header-Switcher müsste Refresh-Aktion bekommen — Plan-Phase prüfen) |
| Gruppe-Mitglieder ändern sich | Bis 24h | Plan-Phase: prüfen ob `waehleGruppe` einen Refresh-Pfad braucht |

Q2a-Entscheidung: keine automatische Invalidation. KISS, bestehende Refresh-Mechanismen reichen.

## Edge-Cases

| Edge-Case | Verhalten |
|---|---|
| Demo-Modus (`saveDemoFlag(true)` Z. 186) | Kein Login-Pre-Fetch (Demo-Flag bereits Pfad-Check); Cache wird beim Mount on-demand befüllt |
| LP wechselt Schule (re-login mit anderer E-Mail) | Logout-Cleanup leert Cache; neuer Login befüllt mit neuen Daten |
| Browser ohne IndexedDB-Support | `openDB()` wirft → silent-fail in cache-Funktionen → API-Pfad wie heute |
| Tab-Wechsel während Pre-Fetch läuft | Pre-Fetch läuft Backend-seitig zu Ende; Cache wird befüllt; bei Re-Mount Cache-Hit |
| Re-Login während alte Logout-Cleanup noch läuft | Login-Pre-Fetch hat eigenes Promise — entweder findet er alten oder neuen Cache-Stand. Beide korrekt für nächste Session. |
| 3 Stores parallel beim Logout | `Promise.all` wartet auf alle. Längster bestimmt Logout-Latenz (typisch ~50ms). |

## Test-Strategie

### Unit-Tests (vitest)

**`klassenlistenCache.test.ts` (neu, ~6 Cases):**
- Cache-Schreibe + Lese (round-trip)
- TTL-abgelaufen → null
- Clear leert alle Stores
- Silent-Fail bei IDB-Mock-Fehler
- Meta-Timestamp wird gesetzt
- TTL-Konstante 24h

**`gruppenCache.test.ts` (neu, ~8 Cases):**
- Gruppen round-trip
- Mitglieder round-trip pro gruppeId
- Mitglieder-Map: 2 verschiedene gruppeIds bleiben getrennt
- TTL-Validation
- Clear leert beide Stores
- Silent-Fail

**`klassenlistenStore.test.ts` (neu, ~5 Cases):**
- `lade` Cache-Hit → keine API-Call
- `lade` Cache-Miss → API-Call + Cache-Write
- `lade({force:true})` → API-Call ohne Cache-Hit-Versuch
- `reset` setzt State leer + ruft clearCache (assertion auf await)
- API-Fehler → ladeStatus='fehler', kein State-Reset

**`gruppenStore.test.ts` (Erweiterung, ~5 neue Cases):**
- `ladeGruppen` Cache-Hit + Mitglieder-Cache-Hit (kombiniert)
- `ladeGruppen` Cache-Miss → API + Cache-Write
- `waehleGruppe` Cache-Hit für Mitglieder
- `reset` async + clearCache awaited
- Bestehende Tests bleiben grün (Auto-Select, localStorage-Letzte-Gruppe)

**`authStore.test.ts` (Erweiterung, ~3 neue Cases):**
- `anmelden` (LP) feuert 3 Pre-Fetch (Fragenbank + Klassenlisten + Gruppen)
- `anmelden` (LP) Pre-Fetch-Fehler → silent (kein Throw)
- `anmeldenMitCode` (SuS) feuert nur Gruppen-Pre-Fetch (nicht Klassenlisten)
- `abmelden` awaitet Promise.all der 3 reset()-Aufrufe + danach window.location.href

**Erwarteter neuer Test-Stand:** 731 baseline + ~22 neue = ~753 vitest grün.

### Browser-E2E (preview, echte Logins)

| # | Pfad | Erwartung |
|---|---|---|
| 1 | LP-Login frisch (ohne Cache) → Klick Prüfung "Durchführen" → Tab Vorbereitung | Klassenliste lädt 2-3s (Cache-Miss erste Session) |
| 2 | Hard-Reload + Re-Login (Cache da) → "Durchführen" → Vorbereitung | Klassenliste rendert ≤300ms (Cache-Hit) |
| 3 | Vorbereitung → Refresh-Button-Klick | API-Call sichtbar in Network-Tab, Daten aktualisiert |
| 4 | SuS-Login frisch → Üben-Tab → Kurs-Auswahl | Gruppen lädt 2-3s erste Session |
| 5 | SuS Re-Login (Cache da) → Üben-Tab → Kurs-Auswahl | Gruppen rendert ≤300ms |
| 6 | LP-Logout | DevTools → Application → IndexedDB: alle 3 Datenbanken (`examlab-fragenbank-cache`, `examlab-klassenlisten-cache`, `examlab-gruppen-cache`) leer |
| 7 | Bundle G.c Logout-Cleanup unverändert | `examlab-fragenbank-cache` wie vorher leer |
| 8 | Bundle G.d.1 Polling unverändert (sofern G.d.1 schon gemerged) | LP-Polling-Frequenz in Lobby unverändert 5s |

## Akzeptanz-Kriterien

| Kriterium | Wert |
|---|---|
| LP-Vorbereitungs-Tab Klassenliste sichtbar (Re-Login mit Cache) | ≤300ms (von 2-3s) |
| SuS Üben-Tab Kurs-Auswahl sichtbar (Re-Login mit Cache) | ≤300ms (von 2-3s) |
| Erst-Login (kein Cache) | unverändert ~2-3s (Cache-Miss-Fallback) |
| Logout: alle 3 IDB-Datenbanken leer | nachweisbar in DevTools |
| Bundle G.c Logout-Cleanup unverändert | Fragenbank-IDB nach Logout leer |
| Bundle G.d.1 (falls schon gemerged) unverändert | LP-Polling Lobby 5s |
| Alle vitest grün | 731 baseline + ~22 neu |
| `tsc -b` clean | ja |
| `npm run build` erfolgreich | ja |
| Browser-E2E grün | 8/8 Punkte |

## Reihenfolge der Implementierung (Plan-Phase)

1. **Cache-Layer** zuerst: `klassenlistenCache.ts` + `gruppenCache.ts` mit Unit-Tests (TDD-friendly, isoliert testbar)
2. **`klassenlistenStore.ts`** neu mit Unit-Tests
3. **`gruppenStore.ts`** Erweiterung mit Unit-Tests (bestehende Tests dürfen nicht brechen)
4. **`authStore.ts`** Anmelden + Abmelden Erweiterungen mit Unit-Tests
5. **`VorbereitungPhase.tsx`** Component-Integration (klassenlistenStore statt lokalem useState)
6. **`tsc -b`** + **`npm run build`** + **`npm test`** komplett grün
7. **Browser-E2E** auf preview mit echten LP- und SuS-Logins (Cache-Miss + Cache-Hit + Logout-Privacy)
8. **Merge auf main** nach LP-Freigabe

Geschätzte Subagent-Sessions: ~6-10 Commits in 1 Implementations-Session.

## Was wir explizit NICHT in G.d.2 machen

- **Backend-Endpoints** — kein neuer Endpoint, alles Frontend
- **Cache-Invalidation auf Schreib-Operationen** (Q2a — KISS)
- **Lehrpersonen-Cache** (`ladeLehrpersonen` ist bereits per Session gecached, kein zusätzlicher IDB-Layer nötig)
- **Synergy-`ladeKurse`-Cache** (Spezial-Use-Case, kein User-Pain-Point)
- **Polling-Tuning** → ist G.d.1
- **Backend-Pre-Warm** → ist G.d.1
- **Mitglieder-Cache-Eviction** (alle Mitglieder-Listen werden gehalten — Worst-Case nur ~5 Gruppen × ~30 SuS pro LP, vernachlässigbar)
- **IDB-Verschlüsselung** (eigenes Sub-Bundle mit separatem Threat-Model)

## Verifizierte Annahmen (Code-Read 2026-04-27)

- **`fragenbankCache.ts`-Pattern existiert** ([src/services/fragenbankCache.ts](../../../src/services/fragenbankCache.ts)) und kann als Vorbild dienen
- **`gruppenStore.ladeGruppen`** existiert ([src/store/ueben/gruppenStore.ts](../../../src/store/ueben/gruppenStore.ts)), lädt Gruppen + Mitglieder (Mitglieder nur für aktive Gruppe)
- **Klassenlisten haben keinen Store**, direct API-Call in [VorbereitungPhase.tsx:53](../../../src/components/lp/vorbereitung/VorbereitungPhase.tsx#L53) und Refresh-Button bei [Z. 296](../../../src/components/lp/vorbereitung/VorbereitungPhase.tsx#L296)
- **G.c-Login-Pre-Fetch existiert** ([authStore.ts:142-144](../../../src/store/authStore.ts#L142)) — kann analog für G.d.2 erweitert werden
- **G.c-Logout-Cleanup existiert** ([authStore.ts:205](../../../src/store/authStore.ts#L205)) mit `await` und `tx.oncomplete`-Garantie (S149-Lehre)
- **`anmeldenMitCode` für SuS** existiert ([authStore.ts:150](../../../src/store/authStore.ts#L150)) — Pre-Fetch-Trigger-Stelle für SuS-Gruppen
- **`KlassenlistenEintrag`, `Gruppe`, `Mitglied`-Types** existieren in `types/`-Verzeichnis (im Plan exakte Pfade prüfen)

## Im Plan zu lokalisieren

- **Alle `useUebenGruppenStore.ladeGruppen`-Caller:** vermutlich in Header-Switcher und SuS-Üben-Tab. Sicherstellen, dass keine Caller `force: true` hartcodieren wollen.
- **Header-Multi-Teacher-Refresh-Pfad:** falls LP einen Refresh-Mechanismus für Lernplattform-Wechsel hat, dort `force: true` einbauen.
- **`waehleGruppe`-Refresh-Mechanismus:** prüfen ob existing UI einen "Mitglieder neu laden"-Button hat.
- **`Mitglied`-Type:** existierende Type-Definition für Mitglieder-Cache-Schema verifizieren.
- **Demo-Modus-Pfad:** sicherstellen dass Login-Pre-Fetch nicht für Demo-User feuert (`istDemoModus`-Check).
