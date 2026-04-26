# Bundle G.b — Editor-Nachbar-Prefetch + Material-PDF-Prefetch

**Datum:** 2026-04-26
**Status:** Spec, brainstorming abgeschlossen
**Vorgänger:** [Bundle G.a — Server-Cache-Pre-Warming](2026-04-26-bundle-g-a-server-cache-prewarming-design.md)

## Ziel

Sequenzielle Klick-Latenz an zwei konkreten Stellen eliminieren, ohne Backend-Änderung:

1. LP klickt im FragenBrowser durch Fragen (prev/next im Editor) — heute 1.5–2 s pro Klick (Backend-Roundtrip an `ladeFrageDetail`)
2. SuS/LP scrollt zur nächsten Frage mit Material-PDF — heute mehrere Sekunden iframe-Load beim ersten Öffnen

Nach G.b: Beide Übergänge fühlen sich instant an, weil Daten/Bytes vor dem Klick bereits im Frontend-Memory bzw. Browser-Cache liegen.

## Scope und Abgrenzung

**Inkludiert (zwei Trigger):**

- **Trigger 1 — Editor-Nachbar-Prefetch:** Beim Öffnen einer Frage im FragenBrowser-Editor parallel ±1 Nachbar-IDs via `ladeFrageDetail` ins `fragenbankStore.detailCache` laden. Frontend-Memory-Cache, kein neuer Backend-Endpoint.
- **Trigger 2 — Material-PDF-Prefetch:** Beim Rendern einer Frage mit `material[]` browserseitig die Material-URLs der nächsten 1–2 Fragen via `<link rel="prefetch">` im `<head>` vorladen. Greift in Üben (SuS), Prüfen (SuS) und Korrektur-Fragen-Ansicht (LP).

**Explizit ausgeklammert:**

- Korrektur-Stapel-prev/next: Code-Lesung von `useKorrekturDaten` zeigt, dass alle Korrektur-Daten initial in einem `Promise.all([ladeKorrektur, ladeAbgaben, ladePruefung])` vorgeladen werden. Wechsel zwischen SuS/Fragen ist reines State-Switching ohne API-Call. Kein Latenz-Win zu holen, daher kein Trigger.
- Login-Pre-Fetch der gesamten Fragenbank: Eigenes Sub-Bundle G.c mit Sicherheits-Audit (Lösungs-Felder).
- Editor-Prefetch im SuS-Üben: Üben hat bereits einen Adapter-Cache (`Map<gruppeId, Frage[]>`), der von G.a serverseitig gewärmt wird. Doppelte Frontend-Logik wäre redundant.
- Neuer Backend-Endpoint: G.a's `lernplattformPreWarmFragen` deckt Server-Cache ab; G.b braucht nur den existierenden `ladeFrageDetail` (Trigger 1) bzw. Browser-Native-Prefetch (Trigger 2).

## Architektur

### Trigger 1 — `useEditorNeighborPrefetch`

**Eintrittspunkt:** `FragenBrowser.tsx:80–113` (`handleEditFrage` setzt `editFrage` und ruft `useFragenbankStore.getState().ladeDetail` für die aktive Frage auf).

**Neuer Hook:** `src/hooks/useEditorNeighborPrefetch.ts`

```ts
useEditorNeighborPrefetch({
  currentFrageId: string | null,
  nachbarn: { previousId: string | null; nextId: string | null } | null,
  email: string,
  fachbereich: string | null,
})
```

Verhalten:

- Nimmt `previousId` und `nextId` aus der bereits berechneten `nachbarn`-Struktur (`FragenBrowser.tsx:169–180`).
- Ruft `useFragenbankStore.getState().ladeDetail(email, nachbarId, fachbereich)` für beide Nachbarn fire-and-forget auf. Der Store-Helper hat bereits Cache-Hit-Logik (`detailCache` + `fragenMap`), startet also nur einen Backend-Call wenn noch nicht im Memory.
- AbortController auf jedem Aufruf, fail-silent (analog `usePreWarm` aus G.a).
- 300 ms Debounce auf `currentFrageId`-Wechsel: Wenn LP rasch durch Fragen klickt (Pfeiltaste gedrückt), startet erst nach Stillstand ein Prefetch.
- Kill-Switch: gleiche Konstante `PRE_WARM_ENABLED` wie G.a (zentral togglebar).

**Aufrufstelle:** Direkt nach der State-Setzung von `editFrage` in `FragenBrowser.tsx`. Hook wird unbedingt aufgerufen, intern werden null-Checks (kein currentFrageId, keine Nachbarn) sauber behandelt.

**Erwarteter Effekt:** Wenn LP "next" im Editor klickt, schlägt `fragenbankStore.ladeDetail(nextId)` (`fragenbankStore.ts:100–117`) sofort den Cache an (`if (cached) return cached`) — kein Roundtrip, Editor rendert direkt.

### Trigger 2 — `usePrefetchAssets`

**Neuer Hook:** `src/hooks/usePrefetchAssets.ts`

```ts
usePrefetchAssets(urls: readonly string[])
```

Verhalten:

- Per `useEffect` auf `urls`-Änderung: für jede URL ein `<link rel="prefetch" href={url}>` (ohne `as`-Attribut, siehe Begründung unten) in `document.head` einfügen. Cleanup-Funktion entfernt alle eingefügten Tags beim Unmount oder URL-Wechsel.
- Deduplizierung: bevor ein Tag eingefügt wird, prüft der Hook ob bereits ein Prefetch-Tag mit derselben URL im DOM hängt (Zähler in `dataset.examlabPrefetch` für Refcount-basierte Cleanup-Sicherheit, falls zwei Komponenten denselben Asset prefetchen).
- Akzeptiert leere Arrays / falsy URLs ohne Fehler.

**Aufrufstellen:**

- **SuS-Üben:** `src/components/ueben/UebungsScreen.tsx` (oder die Frage-Wrapper-Komponente, die in der Übungs-Schleife den aktiven Index hält). Berechnet die Material-URLs der nächsten 1–2 Fragen aus dem aktuellen Übungs-State.
- **SuS-Prüfen:** Analog im Prüfungs-Frage-Wrapper. Konkrete Datei wird im Plan identifiziert (Code-Lesung).
- **LP-Korrektur:** `src/components/lp/korrektur/KorrekturFragenAnsicht.tsx` — wenn LP Frage X eines SuS anschaut, prefetch Material von Frage X+1.

**URL-Quelle:** `frage.material[]` enthält Anhänge mit `url`-Feld. Der Hook prefetcht **exakt die URL, die `MaterialPanel` später als iframe-`src` setzt** — das ist `convertToEmbedUrl(toAssetUrl(material.url))`. Begründung: Browser-Cache ist origin/path-spezifisch. Wenn wir `/view` prefetchen und das iframe später `/preview` lädt, sind das verschiedene URLs und der Cache greift nicht. Die Plan-Phase muss diesen Cache-Hit empirisch via DevTools verifizieren ("from disk cache" beim iframe-Open der prefetchten Frage).

**Pro Frage nur erstes Material:** Wenn eine Frage mehrere Anhänge hat, prefetcht der Hook nur den ersten (`material[0].url`). Das limitiert Worst-Case-Bandbreite, deckt den Hauptfall (PDF als zentrales Material) ab, und ist der einzige Anhang den ein SuS typischerweise als nächstes öffnet.

**`<link rel="prefetch">`-Attribut:** Ohne `as`-Attribut (Browser-Default), nicht `as="document"`. PDFs sind keine HTML-Dokumente; `as="document"` führt bei manchen Browsern zu Cache-Miss beim iframe-Reload. Plan-Phase verifiziert empirisch.

**Frage-Editor (LP):** Bewusst keine Prefetch-Aufrufe im Edit-Modus. LP wechselt im Editor selten zwischen Fragen mit grossen Material-PDFs; YAGNI.

### Sicherheit und Privacy

Beide Trigger berühren keine neuen Code-Pfade aus Sicherheits-Sicht:

- Trigger 1 ruft denselben `ladeFrageDetail`-Endpoint, den der existierende `editFrage`-Klick auch ruft. Selbe Auth (`istZugelasseneLP`), selbe Sichtbarkeits-Checks (`istSichtbarMitLP`). Nachbar-IDs kommen aus der bereits vom Backend gelieferten und im Frontend kuratierten `nachbarn`-Liste — keine ID-Erfindung möglich.
- Trigger 2 initiiert browserseitige GETs auf URLs, die der Browser ohnehin beim iframe-Open holen würde. CSP-Regeln greifen unverändert. Kein neuer Datenfluss zum Server.
- Lösungs-Felder werden für SuS weiterhin durch `bereinigeFrageFuerSuS_` (Backend) entfernt — G.b ändert den Bereinigungs-Pfad nicht.

### Performance-Bewusstsein

- Trigger 1 erzeugt im Worst-Case 2 zusätzliche Backend-Roundtrips pro Editor-Open. Bei 24 Frage-Wechseln in einer Editor-Session: maximal +48 Calls. Server-Cache via G.a fängt das ab — `ladeFrageDetail` ist bereits gecacht (`alle_fragen`-Cache), zusätzliche Last vernachlässigbar.
- Trigger 2 löst Browser-Prefetches mit niedriger Priorität aus, die vom Browser zurückgehalten werden, wenn der Hauptpfad gerade lädt. Keine Konkurrenz zum aktiv angezeigten Material.
- Beide Hooks sind fail-silent: wenn Backend hängt oder Browser Prefetch verweigert, läuft die App normal weiter.

## Komponenten-Aufstellung

| Datei | Art | Beschreibung |
|---|---|---|
| `src/hooks/useEditorNeighborPrefetch.ts` | NEU | Hook, ruft `fragenbankStore.ladeDetail` für ±1 Nachbar mit 300 ms Debounce |
| `src/hooks/usePrefetchAssets.ts` | NEU | Hook, injiziert/entfernt `<link rel="prefetch">` Tags mit Refcount-Dedup |
| `src/components/lp/fragenbank/FragenBrowser.tsx` | EDIT | Aufruf `useEditorNeighborPrefetch` direkt nach `editFrage`-Setzung |
| `src/components/ueben/UebungsScreen.tsx` (oder Wrapper) | EDIT | Aufruf `usePrefetchAssets` mit Material-URLs der nächsten 1–2 Fragen |
| `src/components/sus/.../FrageWrapper.tsx` (Prüfen) | EDIT | Analog für Prüfungs-Modus, konkrete Datei im Plan |
| `src/components/lp/korrektur/KorrekturFragenAnsicht.tsx` | EDIT | Aufruf `usePrefetchAssets` mit Material-URL der nächsten Frage des aktuellen SuS |
| `src/tests/useEditorNeighborPrefetch.test.tsx` | NEU | Unit-Tests: Cache-Hit-Skip, Debounce, Abort, fail-silent |
| `src/tests/usePrefetchAssets.test.tsx` | NEU | Unit-Tests: Tag-Inject + Cleanup, Refcount-Dedup, leere Arrays |
| `src/tests/fragenBrowserEditorPrefetch.test.tsx` | NEU | Integration: FragenBrowser ruft Hook beim Editor-Open mit korrekten IDs |

## Datenfluss

### Trigger 1

```
LP klickt "Bearbeiten" auf Frage X
  → FragenBrowser.handleEditFrage(X)
    → fragenbankStore.ladeDetail(X)  [sichtbar, Editor wartet]
    → useEditorNeighborPrefetch wird aktiviert
      → debounce 300 ms
      → fragenbankStore.ladeDetail(X-1)  [unsichtbar, Backend-Roundtrip]
      → fragenbankStore.ladeDetail(X+1)  [unsichtbar, Backend-Roundtrip]
      → Resultate landen in detailCache

LP klickt "Next" → Frage X+1
  → fragenbankStore.ladeDetail(X+1)
    → cached === true → instant return aus detailCache
    → Editor rendert sofort
```

### Trigger 2

```
SuS sieht Frage 5 mit Material-PDF
  → UebungsScreen rendert
  → usePrefetchAssets([material-url-frage-6, material-url-frage-7])
    → <link rel="prefetch" href="..."> in document.head
    → Browser lädt PDF im Hintergrund (low priority)

SuS klickt "Weiter" → Frage 6
  → MaterialPanel rendert iframe mit src=...
  → Browser holt PDF aus eigenem Cache → instant
```

## Fehlerbehandlung

| Fall | Verhalten |
|---|---|
| Backend liefert 401/403 für Nachbar-Frage | `fragenbankStore.ladeDetail` returnt `null`, Hook ignoriert. Keine UI-Folge. |
| Browser unterstützt `<link rel="prefetch">` nicht | Tag wird gesetzt, Browser ignoriert. Keine UI-Folge. |
| `material[]` ist leer / `url` ist leer | Hook bekommt leeres URL-Array, fügt nichts ein. |
| LP klickt schnell durch 5 Fragen | Debounce hält Prefetch zurück, nur die letzte stabile Frage löst Prefetch. |
| Komponente unmountet während Prefetch läuft | AbortController bricht ab, kein Memory-Leak. |
| Zwei Komponenten fordern selbe URL | Refcount-Dedup, Tag bleibt bis beide unmounted. |

## Tests

**Vitest-Plan (3 neue Dateien):**

1. `useEditorNeighborPrefetch.test.tsx`:
   - Ruft `ladeDetail` für previousId und nextId nach Debounce-Ablauf
   - Schneller Wechsel currentFrageId → nur letzter Aufruf wird ausgeführt
   - Wenn `nachbarn.previousId === null` → nur ein Aufruf
   - `PRE_WARM_ENABLED=false` → keine Aufrufe
   - Unmount während laufendem Debounce → kein Crash

2. `usePrefetchAssets.test.tsx`:
   - Erstes Render mit URL-Array → entsprechende `<link>`-Tags in `document.head`
   - URL-Wechsel → alte Tags entfernt, neue eingefügt
   - Zweite Komponente fordert selbe URL → Refcount steigt, Tag bleibt
   - Erster Unmount → Refcount sinkt, Tag bleibt
   - Zweiter Unmount → Tag entfernt
   - Leeres Array → keine Tags, kein Crash

3. `fragenBrowserEditorPrefetch.test.tsx`:
   - Mount FragenBrowser mit gemockter Fragenliste, `handleEditFrage(X)` aufrufen
   - Nach Debounce: `fragenbankStore.ladeDetail` wurde mit X-1 und X+1 aufgerufen (Aufruf X kommt aus dem bestehenden `handleEditFrage`-Pfad und wird hier nicht erneut geprüft)

**E2E-Browser-Test (auf staging):**

- LP-Login `wr.test@gymhofwil.ch`, FragenBrowser öffnen, beliebige Frage editieren, Network-Tab beobachten: drei `ladeFrageDetail`-Calls (für X, X-1, X+1) innerhalb der ersten Sekunde nach Editor-Open. Anschliessend "Next" klicken, Editor rendert sofort, kein neuer Backend-Call sichtbar.
- SuS-Login `wr.test@stud.gymhofwil.ch`, Übung mit Material-Frage starten. DevTools → Network → Filter "PDF": die nächste Frage-Material-URL erscheint als Prefetch-Request (Initiator: link). Bei Klick auf "Weiter" lädt das PDF aus dem Disk-Cache (Status 200, "from disk cache" oder Time < 50 ms).

## Risiken und Open Questions

- **SuS-Prüfen Frage-Wrapper:** Die exakte Datei für den SuS-Prüfungs-Frage-Renderer steht in der Spec offen, weil der Brainstorming-Subagent diesen Pfad nicht referenziert hat. Im Plan wird das als erste Code-Lesung adressiert. Falls der Renderer mehrere Modi hat (Single-Frage vs. alle-auf-einer-Seite): Prefetch nur im Single-Frage-Modus (wo es sequentielle Übergänge gibt).
- **Cache-Hit-Identität (kritisch):** Browser-Cache ist URL-exakt. Plan-Phase muss empirisch in DevTools Network-Tab prüfen, dass der Prefetch-Request und der nachfolgende iframe-`src`-Request identische URLs verwenden und die zweite Anforderung "from disk cache" liefert. Wenn nicht, ist der ganze Trigger 2 ein No-Op und muss nachgebessert werden (z.B. `as`-Attribut variieren oder Embed-Konvertierung anpassen).
- **CSP:** `<link rel="prefetch">` initiiert GETs an dieselben URLs, die die iframes ohnehin laden würden. Bestehende CSP mit `*.googleusercontent.com docs.google.com` ist hinreichend; keine Änderung nötig.

## Erfolgskriterien

- Vitest grün (Frontend, alle bestehenden + neue Tests)
- `tsc -b` clean
- `npm run build` erfolgreich
- E2E auf staging: Editor-Nav (FragenBrowser) instant, Material-Open instant für die nächste Frage einer Übung
- Keine Regression: SuS-Üben startet weiterhin in <4 s, FragenBrowser öffnet erste Frage normal, Korrektur-Workflow unverändert
