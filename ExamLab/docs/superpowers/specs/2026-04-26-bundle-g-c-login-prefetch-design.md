# Bundle G.c — LP-Login-Pre-Fetch + Logout-Cleanup

**Datum:** 2026-04-26
**Status:** Spec, brainstorming abgeschlossen
**Vorgänger:** [Bundle G.b — Editor-Nachbar + Anhang-PDF-Prefetch](2026-04-26-bundle-g-b-editor-material-prefetch-design.md)

## Ziel

Zwei kleine, gezielte Änderungen am LP-Auth-Lifecycle in `useAuthStore`:

1. **Login-Pre-Fetch:** Nach erfolgreichem LP-Login fire-and-forget `fragenbankStore.lade(email)` triggern. Erste FragenBrowser-Öffnung wird instant statt 5–15 s.
2. **Logout-Cleanup:** Beim Abmelden `fragenbankStore.reset()` + `clearFragenbankCache()` aufrufen. Schließt Sicherheits-Lücke (LP-Lösungen blieben im IDB nach Logout im Browser des nächsten Users — typisch in der Schule auf geteilten Geräten).

## Scope und Abgrenzung

**Inkludiert:**

- LP-Auth-Lifecycle in [`src/store/authStore.ts`](../../src/store/authStore.ts) — `anmelden()`-Erfolg + `abmelden()`
- 4 Vitest-Cases als Verhaltens-Tests rund um diese beiden Trigger
- Eine Memory-Notiz und ein HANDOFF-Eintrag

**Explizit ausgeklammert:**

- **SuS-Side**: Pre-Fetch für `useUebenAuthStore`. SuS profitiert wenig nach G.a (Trigger A/B/C) und G.b — der Server-Cache ist meist warm und der Übungsstart bei den meisten Pfaden gut. Ein eigener Sub-Bundle (G.x) lohnt sich nur, wenn nach G.c noch ein konkreter SuS-Schmerzpunkt sichtbar wird.
- **Backend-Änderungen**: Kein neuer Endpoint, kein neuer Apps-Script-Code.
- **IDB-Verschlüsselung**: Der `examlab-fragenbank-cache` bleibt unverschlüsselt. Verschlüsselung wäre ein eigenes Sub-Bundle und nicht-trivial (Web Crypto + Key-Verwaltung). Cleanup nach Logout schließt das praktisch wichtigste Risiko ohne Verschlüsselung.
- **TTL-Anpassung**: 10 min bleibt. Das Risiko innerhalb derselben aktiven LP-Session ist akzeptabel.
- **`useFragenbankStore.lade`-Logik**: Wird unverändert wiederverwendet. G.c ruft sie nur an einem neuen Eintrittspunkt auf.

## Architektur

### Trigger 1 — Login-Pre-Fetch

**Eintrittspunkt:** [`src/store/authStore.ts`](../../src/store/authStore.ts), Funktion `anmelden(...)`. Der genaue Punkt liegt direkt nach dem `set({ user, ... })`-Aufruf, bevor die Funktion zurückkehrt.

**Code-Skizze (verbatim aus dem Plan):**

```ts
// Bundle G.c — Pre-Fetch der Fragenbank-Stammdaten startet im Hintergrund
import { useFragenbankStore } from './fragenbankStore'

void useFragenbankStore.getState().lade(email).catch((e) => {
  console.warn('[G.c] Fragenbank-Pre-Fetch fehlgeschlagen (silent):', e)
})
```

**Verhalten:**

- `lade(email)` ist bereits idempotent (Status-Guard `'summary_laden' | 'detail_laden' → return`). Wenn `FragenBrowser` parallel mountet und ebenfalls `lade()` ruft, gibt es nur einen Backend-Call.
- `lade()` nutzt zuerst den IDB-Cache (`getCachedSummaries`, `getCachedDetails`) mit 10 min TTL. Wiederkehrende User sehen den Cache sofort; Server-Revalidierung läuft im Hintergrund.
- `void` und `.catch(...)` machen den Aufruf fire-and-forget. Login-UX ist nicht blockiert. Fehler werden geloggt und ignoriert.
- Demo-Modus: Der Pre-Fetch wird übersprungen wenn `apiService.istKonfiguriert() === false` (das prüft `lade()` selber bereits via Service-Layer).

**Erwarteter Effekt:** Wenn LP unmittelbar nach Login auf "Fragensammlung" klickt, ist der Store-State bereits auf `'fertig'` (oder mindestens `'summary_fertig'`). Erste Render des FragenBrowsers erfolgt aus Memory, kein Spinner > 200 ms.

### Trigger 2 — Logout-Cleanup

**Eintrittspunkt:** [`src/store/authStore.ts`](../../src/store/authStore.ts), Funktion `abmelden(...)`.

**Code-Skizze:**

```ts
// Bundle G.c — Frontend-Cache & IDB-Cache leeren bevor User wechselt
useFragenbankStore.getState().reset()
await clearFragenbankCache()
```

**Verhalten:**

- `reset()` muss als neue Action im fragenbankStore existieren (es gibt heute kein dediziertes `reset`-Feld). Die Action setzt Status auf `'idle'`, leert `summaries`, `summaryMap`, `fragen`, `fragenMap`, `detailCache`, `_cacheInvalid`.
- `clearFragenbankCache()` aus `src/services/fragenbankCache.ts` leert die 3 IDB-ObjectStores `summaries`, `details`, `meta`.
- Reihenfolge: Memory zuerst (synchron), dann IDB (async, awaited). Logout-UI verzögert sich dadurch um ~50–100 ms — akzeptabel, da user-initiated und Logout-Aktionen kurzes Warten typisch sind.
- Bestehende Logout-Side-Effects (`resetPruefungState()`, `clearSession()`, etc.) bleiben unverändert und laufen vor dem neuen Cleanup.

**Erwarteter Effekt:** Nach Logout sind In-Memory-State und IDB-Cache leer. Wenn der nächste User auf demselben Gerät sich einloggt, sieht er keine Frage-Stammdaten des Vorgängers.

### Neue Action `reset` im fragenbankStore

Der Store hat heute keine dedizierte Reset-Action. G.c ergänzt:

```ts
reset: () => set({
  summaries: [],
  summaryMap: new Map(),
  fragen: [],
  fragenMap: new Map(),
  detailCache: {},
  status: 'idle',
  _cacheInvalid: false,
})
```

Plus eine entsprechende Eintragung im Store-Interface. Keine Änderung an existierenden Methoden.

## Sicherheits-Audit

### Bestehende Invarianten — nicht angetastet

- **SuS bekommt nie Lösungen:** Backend bereinigt via `bereinigeFrageFuerSuS_` in [`apps-script-code.js`](../../apps-script-code.js) Z. ~2251–2330. Greift auf Endpoint `lernplattformLadeFragen` (SuS-Pfad). G.c berührt diesen Pfad nicht.
- **LP-Auth-Check:** `ladeFragenbank` und `ladeFrageDetail` prüfen `istZugelasseneLP(email)`. Pre-Fetch nutzt denselben Aufruf — keine neue Auth-Surface.
- **Token-Bindung:** Pre-Fetch sendet die im LP-`useAuthStore` hinterlegten Credentials mit (existing `apiClient`-Pattern). Nicht-LP-User können den Pre-Fetch nicht missbrauchen.

### Was G.c FIXT

- **IDB-Persistenz-Lücke:** Heute bleibt `examlab-fragenbank-cache` mit LP-Lösungen im Browser nach `abmelden()`. Wenn nächster User (LP oder SuS) auf demselben Gerät sich einloggt, sieht der Code den Cache als gültig (TTL 10 min) und kann dessen Daten in den Memory-Store laden — auch für SuS-Sessions ein Risiko, weil die LP-Daten in IDB Lösungs-Felder enthalten. G.c.2 schließt diese Lücke durch synchronen Cleanup im `abmelden()`-Pfad.
- **In-Memory-State-Lücke:** Wenn LP→Logout→neuer Login auf gleichem Tab passiert (selten, aber möglich), wäre der vorherige Memory-State noch in `useFragenbankStore.getState()`. `reset()` macht das deterministisch leer.

### Was G.c NICHT ändert

- **IDB-Verschlüsselung:** außerhalb Scope. Empfehlung für späteres Sub-Bundle: Web Crypto API mit per-User-abgeleitetem Key.
- **TTL-Verschärfung:** außerhalb Scope.
- **SuS-IDB-Cache:** SuS hat keinen IDB-Cache der Fragenbank (Üben-Adapter ist Memory-only). Cleanup nicht nötig.

## Komponenten-Aufstellung

| Datei | Art | Beschreibung |
|---|---|---|
| `src/store/authStore.ts` | EDIT (~6 Z) | Login-Pre-Fetch in `anmelden()`, Logout-Cleanup in `abmelden()` |
| `src/store/fragenbankStore.ts` | EDIT (~10 Z) | Neue `reset`-Action in Interface + Implementierung |
| `src/tests/authStoreLoginPrefetch.test.ts` | NEU | 4 Cases (Login triggert lade, Login wartet nicht auf Pre-Fetch, fail-silent, Logout triggert reset+clear in Reihenfolge) |

Keine neuen Hooks, keine Komponenten-Edits, kein Backend-Code.

## Datenfluss

### Login

```
LP klickt "Anmelden" mit Google
  → authStore.anmelden(googleResponse)
    → ladeUndCacheLPs() (existing)
    → set({ user, istAngemeldet: true, ... }) (existing)
    → resetPruefungState() (existing)
    → saveSession() (existing)
    → void useFragenbankStore.getState().lade(email)  ← NEU
    → return  (Pre-Fetch läuft im Hintergrund)
  
  Hintergrund:
    fragenbankStore.lade(email)
      → IDB-Cache prüfen → ggf. State setzen
      → Server-Summaries laden
      → Server-Details laden (im Hintergrund)
      → State auf 'fertig' setzen
      → IDB-Cache aktualisieren

LP klickt 2 Sekunden später "Fragensammlung"
  → FragenBrowser mountet
  → useFragenbankStore.getState() — bereits status='fertig'
  → Render aus detailCache → instant
```

### Logout

```
LP klickt "Abmelden"
  → authStore.abmelden()
    → resetPruefungState() (existing)
    → useFragenbankStore.getState().reset()  ← NEU
    → await clearFragenbankCache()           ← NEU (~50–100 ms)
    → clearSession() (existing)
    → set({ user: null, istAngemeldet: false }) (existing)

Nächster User loggt sich ein
  → authStore.anmelden(...)
    → fragenbankStore Memory leer
    → IDB leer
    → lade() startet Server-Roundtrip (kein stale-cache-leak)
```

## Fehlerbehandlung

| Fall | Verhalten |
|---|---|
| Backend für Pre-Fetch nicht erreichbar | `lade()` setzt status='fehler' (existing). UI zeigt beim nächsten FragenBrowser-Mount nichts, fällt auf normalen Lade-Pfad zurück. Kein Login-Block. |
| Pre-Fetch läuft noch wenn LP auf "Fragensammlung" klickt | `lade()` ist idempotent. Status-Guard verhindert doppelten Backend-Call. UI zeigt Spinner bis erster Datensatz da, dann instant. |
| `clearFragenbankCache()` wirft (z.B. IDB-Quota) | `await`-Block fängt nicht; Logout schlägt mit Fehler fehl. Mitigations: try/catch im `abmelden()`, Fehler ignorieren und Logout fortsetzen. Spec wählt diesen Pfad — Logout DARF NICHT durch Cache-Cleanup blockiert werden. |
| LP loggt aus während Pre-Fetch läuft | `reset()` setzt Store auf initial; der laufende `lade()`-Aufruf schreibt sein Ergebnis trotzdem, könnte Memory wieder befüllen. Mitigation: `lade()` prüft am Ende `if (!isAuthenticated) return` (kleine Erweiterung). Plan-Detail. |

## Tests

**Vitest-Plan (1 neue Datei, 4 Cases):**

`src/tests/authStoreLoginPrefetch.test.ts`:

1. `anmelden()` erfolgreich → `useFragenbankStore.lade` wurde mit `user.email` aufgerufen
2. `anmelden()` returnt vor Pre-Fetch-Resolution (Verhaltens-Test mit hängender lade-Promise)
3. Pre-Fetch wirft → `anmelden()` wirft NICHT (fail-silent verifiziert via spy auf `console.warn`)
4. `abmelden()` → `reset()` wurde aufgerufen UND `clearFragenbankCache()` wurde aufgerufen, in dieser Reihenfolge

**E2E-Browser-Test auf staging:**

- LP-Login `wr.test@gymhofwil.ch` → unmittelbar (innerhalb 1 s) auf "Fragensammlung" klicken → soll instant rendern, kein Spinner > 200 ms
- LP-Logout → DevTools → Application → IndexedDB → `examlab-fragenbank-cache` → alle 3 Stores (`summaries`, `details`, `meta`) sind leer
- LP-Logout → SuS-Login auf gleichem Tab → kein Memory-Leak von LP-Lösungen prüfbar via `useFragenbankStore.getState().detailCache` (sollte `{}` sein)

## Erfolgskriterien

- 4 neue vitest grün
- Bestehende vitest-Suite bleibt grün (725 Cases plus die 4 neuen → 729)
- `tsc -b` clean
- `npm run build` erfolgreich
- E2E auf staging: FragenBrowser nach Login instant, IDB nach Logout leer

## Risiken und Open Questions

- **`lade()`-Implementierung kennt heute kein `force=true`-Bedürfnis nach Logout-Cleanup:** Wenn ein Pre-Fetch direkt nach reset() startet (Theorie: User loggt aus und Schalter-LP loggt sofort wieder ein), prüft `lade()` nur den `_cacheInvalid`-Flag. Plan-Phase: ggf. `_cacheInvalid: true` in `reset()` setzen, damit der nächste `lade()`-Aufruf den Server fragt.
- **Edge-Case Race**: Logout während laufendem Pre-Fetch — siehe Fehlerbehandlung. Plan-Phase entscheidet ob es einen lokalen Cancel braucht oder ob `reset()` plus eigener Status-Check im finally-Block reicht.
- **Browser-Memory-Foot­print**: Bulk-Pre-Fetch lädt heute ~2400 Fragen (~5–10 MB serialisiert). LP hat das beim FragenBrowser-Mount schon — G.c verschiebt nur den Zeitpunkt. Kein neues Risiko.
