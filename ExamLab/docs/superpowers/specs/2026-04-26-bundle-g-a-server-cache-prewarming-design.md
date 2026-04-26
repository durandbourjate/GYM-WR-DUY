# Bundle G.a — Server-Cache-Pre-Warming (Design-Spec)

> **Status:** Design — wartet auf Spec-Review + User-Freigabe
> **Datum:** 2026-04-26
> **Session:** S147
> **Vorgänger:** Bundle E (Übungsstart-Latenz, S146 auf `main`)

## Zielsetzung

Apps-Script-`CacheService` proaktiv vorwärmen, sobald ein klares User-Intent-Signal vorliegt — statt erst beim eigentlichen Klick auf "Übung starten" oder "Korrektur öffnen". Damit fällt für die meisten User-Aktionen der Bundle-E-Bulk-Read weg und es bleibt nur der Cache-Hit-Pfad (~300-500 ms intern statt ~1'000 ms).

**Erwartbarer Win:** Spürbare Übungsstart-Latenz von aktuell **~3-4 s** (nach Bundle E) auf **~2-2.5 s** (~30-40 % zusätzlicher Win). Plattform-Floor von ~1.5 s (HTTPS + V8-Init + Auth) bleibt unausweichlich — echtes Sub-Sekunden-UX würde Frontend-Memory-Pre-Fetch erfordern (separates Bundle G.c).

## Bundle-G-Roadmap-Kontext

Bundle G war ursprünglich als 9-Anwendungsfälle-Bundle geplant (Tier 1 #1-6 + Tier 2 #7-9). Während des Brainstorms wurde das Bundle in drei kohärente Sub-Bundles entlang technischer Boundaries zerlegt:

| Sub-Bundle | Inhalt | Backend? | Status |
|---|---|---|---|
| **G.a** | Server-Cache-Pre-Warming (4 Trigger) | ja | **diese Spec** |
| **G.b** | Client-side Prefetch (Editor/Korrektur Prev-Next, Material-iframe) | nein | später, eigene Spec |
| **G.c** | Frontend-Memory-Pre-Fetch der Frage-Stammdaten | nein, nur Frontend | später, eigene Spec mit Sicherheits-Audit |

Login-Pre-Warm aus der ursprünglichen Roadmap wurde gestrichen — kein konkretes Intent-Signal beim Login, Quota-Verschwendung wenn User heute gar nicht übt. Statt Login-Pre-Warm gibt es **Workflow-Trigger** entlang des LP- und SuS-Klickpfads.

## Vier Pre-Warm-Trigger

| ID | Auslöser | Wer ruft | Backend-Pfad |
|---|---|---|---|
| **A** | LP klickt "Lobby anlegen" / "Übung erstellen" | Frontend (LP) | neuer Endpoint `lernplattformPreWarmLobby` |
| **B** | SuS klickt Fach-Tab in Üben-Übersicht | Frontend (SuS) | neuer Endpoint `lernplattformPreWarmThema` |
| **C** | SuS hovert >300 ms auf Themen-Card | Frontend (SuS) | derselbe Endpoint `lernplattformPreWarmThema` |
| **D** | SuS klickt "Abgeben" | Backend (in `lernplattformAbgeben`) | inline fire-and-forget, kein neuer Endpoint |

Trigger A ist absichtlich **frühestmöglich** (beim Anlegen der Lobby, nicht erst beim Live-Schalten) — der LP arbeitet danach 2-10 min im Lobby (SuS einladen, Zusatzzeiten, Einstellungen), während im Hintergrund der Cache warm wird. Längstes Pre-Warm-Fenster.

Trigger B ist **wichtigster SuS-Hebel** (User-Aussage: „grösster Leidensdruck beim selbstständigen Üben"). Nutzt `lastUsedThema[fachbereich]` aus dem Zustand-Store/localStorage.

Trigger C deckt den Fall, in dem `lastUsedThema` nicht zum gewählten Thema passt (User wechselt das Thema). 300-ms-Hover-Threshold mit `useDebouncedHover`.

Trigger D verschmilzt mit `lernplattformAbgeben` — kein separater Endpoint, kein extra Frontend-Code. Inline-Aufruf vor `return jsonResponse(...)`. Async via Apps-Script-Trigger-API wurde geprüft und verworfen (~5 % Failure-Rate, 30 s+ Latenz, nicht produktionsreif).

## Architektur — Ansatz B (Spezifische Endpoints)

### Backend (apps-script-code.js)

**Zwei neue Endpoints + eine Erweiterung:**

```
+ lernplattformPreWarmLobby(body)     ← neu, Trigger A
+ lernplattformPreWarmThema(body)     ← neu, Trigger B + C teilen sich
~ lernplattformAbgeben(body)          ← Erweiterung um inline preWarmKorrekturFuerLobby_, Trigger D
+ preWarmKorrekturFuerLobby_(...)     ← neuer interner Helper für Trigger D
```

Beide Endpoints nutzen die Bundle-E-Helfer `gruppiereFragenIdsNachTab_` + `bulkLadeFragenAusSheet_` als Kern. Cache-TTL bleibt 1 h (Bundle-E-Erbe).

**Endpoint 1 — `lernplattformPreWarmLobby`:**

```
Body:     { email, sessionToken, lobbyId, fachbereich? }
Response: { success: true, fragenAnzahl: N, latenzMs: X }
          oder { error: 'Nicht autorisiert' | 'Nicht eigene Lobby' | <fehler> }

Verhalten:
1. validiereLPSession_(email, sessionToken) — nur LPs
2. IDOR-Check: holeLobby_(lobbyId).lpEmail === email
3. holeLobby_(lobbyId) → fragenIds[], gruppe, fachbereich
4. gruppiereFragenIdsNachTab_(fragenIds, gruppe, fachbereich)
5. bulkLadeFragenAusSheet_(...) für jeden Tab (befüllt CacheService)
6. Logger.log('[PreWarmLobby] email=%s lobbyId=%s n=%d ms=%d')
```

**Endpoint 2 — `lernplattformPreWarmThema`:**

```
Body:     { email, sessionToken, themaId, fachbereich }
Response: { success: true, fragenAnzahl: N }
          oder { success: true, deduped: true }
          oder { error: ... }

Verhalten:
1. validiereSession_(email, sessionToken) — LP oder SuS
2. LockService.tryLock({email, themaId}, 30 s)
   → Lock besteht: return { success: true, deduped: true }
3. Sheet-Read: alle Fragen mit themaId === target aus fachbereich-Tab
   via bulkLadeFragenAusSheet_(sheetId, tab, idSet=alle)
4. Logger.log('[PreWarmThema] email=%s themaId=%s n=%d ms=%d')
```

**Begründung Authorization mode='thema':** Pre-Warm-Endpoint exponiert keine Lösungen — er warmt nur den Server-Cache. Daher keine Privacy-Implikation für SuS-Aufruf. Quota-Schutz via LockService genügt.

**Erweiterung `lernplattformAbgeben`:**

Nach erfolgreichem Speichern + vor `return jsonResponse(...)`:

```js
try {
  preWarmKorrekturFuerLobby_(lobbyId, susEmail);
} catch (e) {
  console.log('[Abgabe-PreWarm-Fehler] ' + e.message);
}
```

`preWarmKorrekturFuerLobby_` ist **kein neuer Endpoint**, sondern interne Helper-Funktion. Sie ruft `bulkLadeFragenAusSheet_` für die Korrektur-Daten dieser SuS-Abgabe.

Latenz-Impact auf Abgabe-Response: 50-200 ms (Sheet-Read + Cache-Write). Akzeptabel, weil Abgabe nicht latency-kritisch ist.

### Frontend (ExamLab/src)

**Neu:**

```
+ services/preWarmApi.ts
+ hooks/usePreWarm.ts
+ hooks/useDebouncedHover.ts (für Trigger C)
```

**`services/preWarmApi.ts`:**

```ts
export const PRE_WARM_ENABLED = true; // Kill-Switch via Frontend-Deploy

export async function preWarmLobby(
  lobbyId: string,
  fachbereich?: string,
  signal?: AbortSignal
): Promise<void>;

export async function preWarmThema(
  themaId: string,
  fachbereich: string,
  signal?: AbortSignal
): Promise<void>;
```

Beide Wrapper:
- Nutzen den existierenden `postJson`-Helper aus `apiClient.ts` (S130-Lehre `postJson<T>` ist Lüge — beide Funktionen extrahieren `.success` selbst)
- Catch-all-Error-Handler intern (kein Throw nach aussen, fail-silent)
- Returnen `Promise<void>` — kein Datenpfad zurück
- Respektieren `PRE_WARM_ENABLED`-Flag (early-return wenn `false`)
- Respektieren `signal.aborted` (early-return wenn `true`)

**`hooks/usePreWarm.ts`:**

```ts
export function usePreWarm(
  apiCall: (signal: AbortSignal) => Promise<void>,
  deps: React.DependencyList
): void;
```

Verhalten:
- Bei Mount oder Dep-Change: AbortController erzeugen, `apiCall(signal)` triggern
- Bei Unmount oder erneutem Dep-Change: AbortSignal feuert
- Network-Timeout 5 s (eigener `setTimeout` der Signal feuert)
- Kein State-Update auf unmounted Component

**`hooks/useDebouncedHover.ts`:**

```ts
export function useDebouncedHover(
  delayMs: number,
  callback: () => void
): { onMouseEnter: () => void; onMouseLeave: () => void };
```

Verhalten:
- `onMouseEnter` startet `setTimeout(callback, delayMs)`
- `onMouseLeave` ruft `clearTimeout`
- Auf Touch-Devices (iPad): `onMouseEnter` feuert beim Tap — kein Pre-Warm-Spam, weil Tap eh sofort den Klick auslöst und der Lock greift

**Drei Call-Sites** (genaue Komponentenpfade verifiziere ich beim Plan-Schreiben):

```
~ Lobby-Anlegen-Komponente (vermutlich src/components/lp/durchfuehrung/LobbyPhase.tsx
  oder ähnlich)
    Nach erfolgreichem lobbyAnlegen-Mutation:
    preWarmLobby(neueLobby.id, fachbereich)

~ Üben-Übersicht (vermutlich src/components/sus/Ueben...)
    onClick auf Fach-Tab:
    if (lastUsedThema) preWarmThema(lastUsedThema, fachbereich)
    via usePreWarm-Hook mit Dep [aktivesFach, lastUsedThema]

~ Themen-Card (vermutlich src/components/sus/...ThemaCard.tsx)
    via useDebouncedHover(300, () => preWarmThema(thema.id, fachbereich))
```

## Datenfluss pro Use-Case

### Use-Case A: Lobby-Anlegen → SuS-Lösungen warm

```
LP klickt "Lobby anlegen"
  ↓
Frontend: lobbyAnlegen-Mutation läuft → Lobby gespeichert
  ↓
Frontend: preWarmLobby(neueLobby.id, fachbereich)  [fire-and-forget]
  ↓
LP arbeitet im Lobby (SuS einladen, Einstellungen) — 2-10 min
  ↓
Backend (parallel zur LP-Arbeit):
  validiereLPSession_ + IDOR-Check
  → holeLobby_(lobbyId) → fragenIds, gruppe
  → gruppiereFragenIdsNachTab_(fragenIds, gruppe, fachbereich)
  → bulkLadeFragenAusSheet_(...) für jeden Tab → CacheService.putAll()
  Latenz: ~1-2 s GAS-intern
  ↓
LP klickt "Live schalten"
  ↓
SuS klicken Code/Link
  ↓
SuS-Browser ruft lernplattformLadeLoesungen
  → CacheService.getAll() liefert Fragen aus warmem Cache
  → Latenz: ~300-500 ms intern (Cache-Hit-Pfad)
  → Spürbar für SuS: ~2-2.5 s (mit Plattform-Overhead)
```

### Use-Case B: SuS klickt Fach-Tab in Üben-Übersicht

```
SuS klickt z.B. "BWL"-Tab
  ↓
Frontend liest lastUsedThema[fachbereich] aus localStorage / Zustand-Store
  ↓
Wenn vorhanden: preWarmThema(lastUsedThema, 'BWL')  [fire-and-forget]
  ↓
SuS navigiert: Thema → Schwierigkeit → Anzahl → "Üben starten"
(5-15 s User-Klicks)
  ↓
Backend (parallel):
  LockService.tryLock({email, themaId}, 30 s) — Spam-Schutz
  → Cache schon warm? Bundle E hat das nicht direkt geprüft, aber tryLock
    deckt den häufigsten Fall (Re-Hover gleicher User) ab
  → bulkLadeFragenAusSheet_('BWL', alle Fragen mit themaId)
  → CacheService.putAll()
  Latenz: ~1-2 s GAS-intern
  ↓
SuS klickt "Üben starten"
  ↓
Block-Picker rollt 10 Fragen aus dem Thema
  ↓
SuS-Browser ruft lernplattformLadeLoesungen
  → Cache-Hit für ALLE 10 Fragen
  → Spürbar: ~2 s
```

### Use-Case C: SuS hovert auf Themen-Card

```
SuS hovert auf "Konjunkturzyklen"-Card
  ↓
useDebouncedHover startet 300-ms-Timer
  ↓
[Mouse leaves <300ms]   [Mouse stays >300ms]
clearTimeout, kein Call  → preWarmThema(thema.id, 'VWL')
                          ↓
                          LockService dedupliziert wenn User
                          dieses Thema kürzlich (30 s) angeklickt hat
                          ↓
                          Identischer Backend-Pfad wie Use-Case B
```

**Hover-Spam-Szenario abgedeckt:** User fährt mit Maus über 8 Themen-Cards in 5 s. Jedes Hover >300 ms triggert `preWarmThema`. Lock dedupliziert pro `{email, themaId}` — Re-Hover dasselbe Thema sofort `deduped:true`. Über verschiedene Themen sind 8 Pre-Warms in 5 s GAS-Quota-mässig kein Problem (Quota = 100k pro Tag).

### Use-Case D: SuS klickt "Abgeben"

```
SuS klickt "Abgeben"
  ↓
Frontend ruft lernplattformAbgeben(antworten)
  ↓
Backend:
  schreibeAntworten + setzeStatus('beendet')
  ↓
  preWarmKorrekturFuerLobby_(lobbyId, susEmail)  [intern, try/catch]
    → bulkLadeFragenAusSheet_(... für die Korrektur-Daten dieser SuS-Abgabe)
    → CacheService.putAll()
  ↓
  return jsonResponse({success: true})
  Latenz: ~50-200 ms zusätzlich gegenüber heutigem Abgabe-Endpoint
  ↓
LP öffnet Korrektur-Dashboard für diese Lobby
  → Cache-Hit auf Korrektur-Daten dieser SuS
  → Spürbar für LP: ~2 s statt ~3-4 s
```

## Fehlerbehandlung

### Grundprinzip

Pre-Warm ist eine **Performance-Optimierung**. Wenn sie fehlschlägt, muss der reguläre Pfad (`lernplattformLadeLoesungen` mit Bundle-E-Bulk-Read) unverändert weiter funktionieren. Es darf keinen Fall geben, in dem ein Pre-Warm-Fehler Login, Übungs-Start oder Abgabe blockiert.

### Frontend-Fehlerpfade

| Fehler | Verhalten |
|---|---|
| Network-Timeout (>5 s) | AbortController feuert, Promise resolves mit `void` |
| Backend liefert `{error}` | Catch-all in `preWarmApi.ts` loggt via `console.warn`, Promise resolves mit `void` |
| User wechselt Tab/unmounted | AbortController feuert, kein State-Update auf unmounted Component |
| Hook-Dep ändert sich | AbortController feuert, neuer Pre-Warm-Call gestartet |
| `lastUsedThema` ist null/undefined (B) | Hook ruft API-Funktion gar nicht erst auf |

**Kein Toast, kein Banner, kein Spinner für Pre-Warm.** User soll nichts merken, ausser dass es schneller ist.

### Backend-Fehlerpfade

| Fehler | Verhalten |
|---|---|
| Auth fehlt/ungültig | `{error: 'Nicht autorisiert'}`, Frontend ignoriert |
| IDOR-Verletzung (Lobby gehört nicht dem LP) | `{error: 'Nicht eigene Lobby'}`, Logger-Warnung |
| LockService-Lock besteht (B/C) | `{success: true, deduped: true}` — kein Fehler |
| Sheet-Read schlägt fehl | try/catch, Logger.log + `{error}`, Frontend ignoriert |
| CacheService.putAll quota voll | try/catch im Helper, Logger.log, kein Fehler nach aussen |
| `preWarmKorrekturFuerLobby_` (D) wirft | try/catch in `lernplattformAbgeben`, Logger.log, **Abgabe-Response bleibt success:true** |

### Race-Condition

**Szenario:** LP klickt "Lobby anlegen" → Pre-Warm startet → 3 s später klickt SuS bereits "Übung starten" (z.B. eilig). Pre-Warm-Backend ist noch in `bulkLadeFragenAusSheet_`.

**Verhalten:** `lernplattformLadeLoesungen` läuft regulär — entweder ist der Cache schon teilweise warm (partial Cache-Hit, schneller als cold) oder noch nicht (cold-Pfad mit Bundle-E-Bulk-Read als Fallback). Beide Pfade liefern korrekte Daten. **Kein Locking auf Lade-Pfad.**

### Kill-Switch

Bei chronischem Production-Failure: Frontend-Konstante `PRE_WARM_ENABLED = false` setzen, deployen, Pre-Warm ist aus. Kein Backend-Rollback nötig. Bundle-E-Pfad funktioniert weiter.

## Edge-Cases

| Edge-Case | Verhalten |
|---|---|
| Lobby ohne Fragen / leere Lobby | `gruppiereFragenIdsNachTab_([])` → leeres Objekt → 0× Schleife → `{success:true, fragenAnzahl:0}` |
| SuS-Login während Pre-Warm läuft | GAS-CacheService ist atomar pro `getAll/putAll`. Worst Case: Cache-Miss, Bundle-E-Fallback. Korrekt. |
| LP wechselt Browser-Tab während Pre-Warm | AbortController stoppt Lauschen, Backend läuft zu Ende. Beabsichtigt — Backend-Arbeit nicht verschwendet. |
| SuS hat keinen `lastUsedThema` (B) | Hook prüft `if (!lastUsedThema) return` — kein API-Call. Erste Üben-Session profitiert nicht von B, aber Hover (C) feuert. |
| Doppel-Trigger B + C kombiniert | LockService dedupliziert pro `{email, themaId}`. Quota-OK. |
| Cache-Invalidierung beim Frage-Edit | Cached Version max. 1 h alt (Bundle-E-TTL). Bundle G.a verschärft das nicht. Cache-Invalidation auf Edit ist eigenes Sub-Bundle wenn Praxis es zeigt. |

## Test-Strategie

### Backend-Tests (Apps Script)

Drei neue GAS-Test-Shims am Dateiende, mit Public-Wrappern ohne Underscore (S133-Lehre):

1. **`testPreWarmLobby_` + `testPreWarmLobby`**
   - Cases: (a) erfolgreicher Pre-Warm einer 10-Fragen-Lobby, (b) Auth-Fail, (c) IDOR-Versuch (anderer LP)
   - Assertions: Response-Shape, CacheService-Eintrag tatsächlich vorhanden, Latenz <3 s intern

2. **`testPreWarmThema_` + `testPreWarmThema`**
   - Cases: (a) Cold-Call, (b) zweiter Call innerhalb 30 s → `deduped:true`, (c) zweiter Call nach 31 s → erneuter Sheet-Read
   - Assertions: LockService-Verhalten, Cache-Befüllung

3. **`testPreWarmEffekt_` + `testPreWarmEffekt`** — **das Akzeptanz-Kriterium**
   - N=10 cold-Pfad (kein Pre-Warm) vs. N=10 warm-Pfad (nach Pre-Warm) für `lernplattformLadeLoesungen`
   - Output: Latenz-Vergleich in `Logger.log`
   - **Ziel: pre-warmed-Pfad ≤ 700 ms intern**

### Frontend-Tests (vitest)

Drei Test-Dateien:

1. **`preWarmApi.test.ts`** — Mock `postJson`, Cases: erfolgreicher Call / Backend-Error / Timeout / Promise resolves immer void
2. **`usePreWarm.test.ts`** — Mock-API mit AbortSignal, Cases: Mount-Fire / Unmount-Abort / Re-Call bei Dep-Change / kein Call bei null-Dep
3. **`useDebouncedHover.test.ts`** — vitest-fake-timers, Cases: <300ms cancelt / >300ms feuert / Mouse-Leave während Timer cancelt

### Browser-E2E (auf preview-Branch)

Echte Logins (LP `yannick.durand@gymhofwil.ch` + SuS `wr.test@stud.gymhofwil.ch`). Test-Plan analog regression-prevention.md Phase 3:

| # | Pfad | Erwartung |
|---|---|---|
| 1 | LP legt neue BWL-Lobby an mit 10 Fragen | Network-Tab: `lernplattformPreWarmLobby` direkt nach `lobbyAnlegen` |
| 2 | LP wartet 30 s, schaltet live | Stackdriver: Pre-Warm fertig vor Live-Schaltung |
| 3 | SuS startet Übung dieser Lobby | Stoppuhr "Klick → Frage 1 sichtbar" ≤ 2.5 s |
| 4 | SuS klickt BWL-Tab in Üben-Übersicht | Network-Tab: `lernplattformPreWarmThema`-Call |
| 5 | SuS hovert auf 5 Themen-Cards | 1 Call pro Card (>300 ms), 0 Calls bei <300 ms |
| 6 | SuS klickt zweimal kurz hintereinander dasselbe Thema | Zweiter Call: `deduped:true` |
| 7 | SuS gibt Übung ab | Stackdriver: `[PreWarmKorrektur]`-Log nach `lernplattformAbgeben` |
| 8 | LP öffnet Korrektur-Dashboard | Korrektur-Lade-Latenz misst, Vergleich ohne Pre-Warm-Abgabe |

## Akzeptanz-Kriterien

| Kriterium | Wert |
|---|---|
| `testPreWarmEffekt` warm-Pfad intern | ≤ 700 ms (nicht hard, ≤ 800 ms akzeptabel) |
| Browser-Stoppuhr SuS-Übungsstart spürbar | ≤ 2.5 s |
| Bundle-E-Latenzen unverändert (Regressions-Floor) | Cold ≤ 1'200 ms intern, Warm ≤ 250 ms intern |
| Alle GAS-Test-Shims grün | 9 Cases (3 pro Shim) |
| Alle vitest-Tests grün | bestehende 684 + ~25 neue |
| `tsc -b` clean | ja |
| Browser-E2E grün | 8/8 Punkte |

## Reihenfolge der Implementierung (Plan-Phase)

1. **Backend zuerst:** `lernplattformPreWarmLobby` + `lernplattformPreWarmThema` + GAS-Test-Shims
2. **Apps-Script-Deploy** durch User
3. **Frontend-Hook + API-Wrapper** mit vitest-Tests
4. **Use-Case D-Erweiterung** in `lernplattformAbgeben` (sequenziell, da Apps-Script-Deploy gebündelt — bedeutet ggf. zweiter Deploy nach Backend-Phase 1)
5. **3 Frontend-Call-Sites** integrieren
6. **Browser-E2E** auf preview mit echten Logins
7. **Mess-Verifikation** via `testPreWarmEffekt` + Latenz-Stoppuhr
8. **Merge auf main** nach LP-Freigabe

Geschätzte Subagent-Sessions: ~10-15 Commits in 1-2 Implementations-Sessions (analog Bundle E mit 11 Commits).

## Was wir explizit NICHT in G.a machen

- **Frontend-Memory-Pre-Fetch** der Frage-Stammdaten → G.c (separate Spec mit Sicherheits-Audit)
- **Login-Pre-Warm** → gestrichen, kein klares Intent-Signal
- **Editor / Korrektur Prev-Next-Prefetch** → G.b (separate Spec)
- **Material-`<link rel="prefetch">`** → ebenfalls G.b
- **Cache-Invalidierung bei Frage-Edit** → eigenes Sub-Bundle, falls Praxis es zeigt
- **Login-Pre-Warm** für LP-Korrektur-Stapel → entfällt durch Use-Case D (Pre-Warm beim SuS-Abgabe)

## Annahmen die im Plan zu verifizieren sind

- **Frontend-Komponenten-Pfade** für die 3 Call-Sites (Lobby-Anlegen, Üben-Fach-Tab, Themen-Card) — verifiziere ich per Code-Read im Plan
- **`lastUsedThema`-Persistenz:** ob das schon im Zustand-Store / localStorage liegt oder neu eingebaut werden muss
- **`holeLobby_`-Helper:** ob existiert oder neu zu schreiben (vermutlich existiert, wird in Lobby-Endpoints schon genutzt)
- **`validiereSession_`-vs.-`validiereLPSession_`:** beide Helper sollten existieren, Pfad zu verifizieren
