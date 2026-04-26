# Bundle G.b — Editor-Nachbar + Anhang-PDF-Prefetch — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sequenzielle Klick-Latenz an zwei Stellen eliminieren: (a) LP-Editor prev/next via Frontend-Memory-Cache, (b) PDF-Anhänge der nächsten Frage via Browser-Prefetch.

**Architecture:** Zwei kleine Frontend-Hooks ohne neuen Backend-Endpoint. `useEditorNeighborPrefetch` ruft `fragenbankStore.ladeDetail` für ±1 Nachbarn beim Editor-Open. `usePrefetchAssets` injiziert `<link rel="prefetch">` Tags mit Refcount-Dedup. PDF-URL-Extraktion aus `frage.anhaenge[]` als reiner Helper.

**Tech Stack:** React 19, TypeScript, Vitest, Zustand, Tailwind. Wiederverwendet Pattern aus G.a (`PRE_WARM_ENABLED` Kill-Switch, fail-silent, AbortController).

**Spec:** [`docs/superpowers/specs/2026-04-26-bundle-g-b-editor-material-prefetch-design.md`](../specs/2026-04-26-bundle-g-b-editor-material-prefetch-design.md)

---

## File Structure

| Datei | Art | Verantwortung |
|---|---|---|
| `src/hooks/usePrefetchAssets.ts` | NEU | Hook: `<link rel="prefetch">` Tags mit Refcount-Dedup |
| `src/utils/anhaengePrefetch.ts` | NEU | Reine Helper: `pdfPrefetchUrls(anhaenge)` extrahiert max. 1 PDF-URL pro Anhang-Liste |
| `src/hooks/useEditorNeighborPrefetch.ts` | NEU | Hook: ±1 Nachbar-Frage in `fragenbankStore.detailCache` laden, 300 ms debounced |
| `src/tests/usePrefetchAssets.test.tsx` | NEU | Tag-Inject + Cleanup, Refcount-Dedup, leere Arrays |
| `src/tests/anhaengePrefetch.test.ts` | NEU | PDF-URL-Extraktion: PDF/Bild/Audio-Mix, max. 1 URL, leere Liste |
| `src/tests/useEditorNeighborPrefetch.test.tsx` | NEU | Cache-Hit-Skip, Debounce, Abort, fail-silent, Kill-Switch |
| `src/tests/fragenBrowserEditorPrefetch.test.tsx` | NEU | Integration: FragenBrowser ruft Hook beim Editor-Open mit korrekten IDs |
| `src/components/lp/fragenbank/FragenBrowser.tsx` | EDIT | Hook-Aufruf nach `editFrage`-Setzung |
| `src/components/ueben/UebungsScreen.tsx` | EDIT | `usePrefetchAssets` mit nächster-Frage-PDF-URL |
| `src/components/Layout.tsx` | EDIT | `usePrefetchAssets` mit nächster-Frage-PDF-URL (SuS-Prüfen) |
| `src/components/lp/korrektur/KorrekturFragenAnsicht.tsx` | EDIT | `usePrefetchAssets` mit nächster-Frage-PDF-URL (LP-Korrektur) |

---

## Task 0: Branch & Setup

- [ ] **Step 1: Feature-Branch erstellen**

Run:
```bash
cd "/Users/durandbourjate/Documents/-Gym Hofwil/00 Automatisierung Unterricht/10 Github/GYM-WR-DUY"
git checkout main && git pull
git checkout -b feature/bundle-g-b-prefetch
```

Expected: clean working tree on new branch.

- [ ] **Step 2: Baseline-Verify**

Run:
```bash
cd ExamLab && npx tsc -b && npx vitest run --reporter=verbose 2>&1 | tail -5 && npm run build
```

Expected: tsc clean, alle Tests grün, build erfolgreich. Festhalten welche Test-Anzahl als Baseline (z.B. 704/704).

---

## Task 1: `usePrefetchAssets` Hook

Reiner DOM-Hook, kein Backend, kein Store.

**Files:**
- Create: `ExamLab/src/hooks/usePrefetchAssets.ts`
- Test: `ExamLab/src/tests/usePrefetchAssets.test.tsx`

- [ ] **Step 1: Test-Datei anlegen, alle Cases failing**

Create `ExamLab/src/tests/usePrefetchAssets.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { usePrefetchAssets } from '../hooks/usePrefetchAssets'

function HookHost({ urls }: { urls: readonly string[] }) {
  usePrefetchAssets(urls)
  return null
}

function prefetchTags(): HTMLLinkElement[] {
  return Array.from(document.head.querySelectorAll('link[rel="prefetch"]'))
}

describe('usePrefetchAssets', () => {
  afterEach(() => {
    cleanup()
    document.head.querySelectorAll('link[rel="prefetch"]').forEach((el) => el.remove())
  })

  it('fügt für jede URL ein link[rel=prefetch] in document.head', () => {
    render(<HookHost urls={['https://example.com/a.pdf', 'https://example.com/b.pdf']} />)
    const tags = prefetchTags()
    expect(tags.map((t) => t.href)).toEqual([
      'https://example.com/a.pdf',
      'https://example.com/b.pdf',
    ])
    // Kein as-Attribut (Spec: PDFs sind keine documents)
    expect(tags[0].hasAttribute('as')).toBe(false)
  })

  it('Cleanup beim Unmount entfernt die Tags', () => {
    const { unmount } = render(<HookHost urls={['https://example.com/a.pdf']} />)
    expect(prefetchTags()).toHaveLength(1)
    unmount()
    expect(prefetchTags()).toHaveLength(0)
  })

  it('URL-Wechsel entfernt alte Tags und fügt neue ein', () => {
    const { rerender } = render(<HookHost urls={['https://example.com/a.pdf']} />)
    expect(prefetchTags().map((t) => t.href)).toEqual(['https://example.com/a.pdf'])
    rerender(<HookHost urls={['https://example.com/b.pdf']} />)
    expect(prefetchTags().map((t) => t.href)).toEqual(['https://example.com/b.pdf'])
  })

  it('zwei Komponenten mit derselben URL: Tag bleibt nach dem ersten Unmount', () => {
    const { unmount: u1 } = render(<HookHost urls={['https://example.com/a.pdf']} />)
    const { unmount: u2 } = render(<HookHost urls={['https://example.com/a.pdf']} />)
    expect(prefetchTags()).toHaveLength(1) // Refcount-Dedup
    u1()
    expect(prefetchTags()).toHaveLength(1) // u2 hält den Refcount
    u2()
    expect(prefetchTags()).toHaveLength(0)
  })

  it('leeres Array fügt nichts ein und crashed nicht', () => {
    render(<HookHost urls={[]} />)
    expect(prefetchTags()).toHaveLength(0)
  })

  it('falsy URLs (leerer String) werden gefiltert', () => {
    render(<HookHost urls={['', 'https://example.com/a.pdf']} />)
    const tags = prefetchTags()
    expect(tags.map((t) => t.href)).toEqual(['https://example.com/a.pdf'])
  })
})
```

- [ ] **Step 2: Tests laufen lassen, sehen dass sie failen**

Run:
```bash
cd ExamLab && npx vitest run src/tests/usePrefetchAssets.test.tsx 2>&1 | tail -10
```

Expected: alle 6 Tests failen weil Modul nicht existiert.

- [ ] **Step 3: Hook implementieren**

Create `ExamLab/src/hooks/usePrefetchAssets.ts`:

```ts
import { useEffect } from 'react'

const REF_KEY = 'examlabPrefetchRefcount'

function findTag(url: string): HTMLLinkElement | null {
  return document.head.querySelector<HTMLLinkElement>(
    `link[rel="prefetch"][href="${CSS.escape(url)}"]`,
  )
}

function addRef(url: string): void {
  const existing = findTag(url)
  if (existing) {
    const current = Number(existing.dataset[REF_KEY] ?? '1')
    existing.dataset[REF_KEY] = String(current + 1)
    return
  }
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  link.dataset[REF_KEY] = '1'
  document.head.appendChild(link)
}

function releaseRef(url: string): void {
  const tag = findTag(url)
  if (!tag) return
  const current = Number(tag.dataset[REF_KEY] ?? '1')
  if (current <= 1) {
    tag.remove()
  } else {
    tag.dataset[REF_KEY] = String(current - 1)
  }
}

/**
 * Bundle G.b — Browser-Prefetch via `<link rel="prefetch">`.
 *
 * Fügt für jede URL ein `<link rel="prefetch">` in `document.head` ein.
 * Refcount-basiert: zwei Komponenten mit derselben URL teilen sich ein Tag.
 * Beim Unmount oder URL-Wechsel werden die Refs sauber freigegeben.
 *
 * Falsy URLs (leerer String) werden gefiltert.
 */
export function usePrefetchAssets(urls: readonly string[]): void {
  useEffect(() => {
    const filtered = urls.filter((u): u is string => typeof u === 'string' && u.length > 0)
    for (const url of filtered) addRef(url)
    return () => {
      for (const url of filtered) releaseRef(url)
    }
  }, [urls])
}
```

- [ ] **Step 4: Tests grün**

Run:
```bash
cd ExamLab && npx vitest run src/tests/usePrefetchAssets.test.tsx 2>&1 | tail -10
```

Expected: 6/6 Tests grün.

- [ ] **Step 5: Commit**

```bash
git add ExamLab/src/hooks/usePrefetchAssets.ts ExamLab/src/tests/usePrefetchAssets.test.tsx
git commit -m "ExamLab G.b: usePrefetchAssets-Hook (link rel=prefetch + Refcount-Dedup)"
```

---

## Task 2: `anhaengePrefetch` Helper

Pure function, einfach zu testen, isoliert.

**Files:**
- Create: `ExamLab/src/utils/anhaengePrefetch.ts`
- Test: `ExamLab/src/tests/anhaengePrefetch.test.ts`

- [ ] **Step 1: Test-Datei**

Create `ExamLab/src/tests/anhaengePrefetch.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import type { FrageAnhang } from '../types/fragen'
import { pdfPrefetchUrls } from '../utils/anhaengePrefetch'

const mkAnhang = (over: Partial<FrageAnhang>): FrageAnhang => ({
  id: over.id ?? 'a',
  driveFileId: over.driveFileId ?? 'drive-id',
  dateiname: over.dateiname ?? 'datei',
  mimeType: over.mimeType ?? 'application/pdf',
  ...(over as object),
})

describe('pdfPrefetchUrls', () => {
  it('liefert die drivePreviewUrl für den ersten PDF-Anhang', () => {
    const urls = pdfPrefetchUrls([
      mkAnhang({ driveFileId: 'pdf-1', mimeType: 'application/pdf' }),
    ])
    expect(urls).toEqual(['https://drive.google.com/file/d/pdf-1/preview'])
  })

  it('ignoriert Bilder, Audio und Video', () => {
    const urls = pdfPrefetchUrls([
      mkAnhang({ driveFileId: 'img', mimeType: 'image/png' }),
      mkAnhang({ driveFileId: 'aud', mimeType: 'audio/mpeg' }),
      mkAnhang({ driveFileId: 'vid', mimeType: 'video/mp4' }),
    ])
    expect(urls).toEqual([])
  })

  it('liefert nur den ersten PDF wenn mehrere PDFs vorhanden', () => {
    const urls = pdfPrefetchUrls([
      mkAnhang({ driveFileId: 'pdf-1', mimeType: 'application/pdf' }),
      mkAnhang({ driveFileId: 'pdf-2', mimeType: 'application/pdf' }),
    ])
    expect(urls).toEqual(['https://drive.google.com/file/d/pdf-1/preview'])
  })

  it('PDF nach Bild: ignoriert Bild, prefetcht PDF', () => {
    const urls = pdfPrefetchUrls([
      mkAnhang({ driveFileId: 'img', mimeType: 'image/png' }),
      mkAnhang({ driveFileId: 'pdf', mimeType: 'application/pdf' }),
    ])
    expect(urls).toEqual(['https://drive.google.com/file/d/pdf/preview'])
  })

  it('leeres Array: leere URL-Liste', () => {
    expect(pdfPrefetchUrls([])).toEqual([])
  })

  it('undefined: leere URL-Liste', () => {
    expect(pdfPrefetchUrls(undefined)).toEqual([])
  })

  it('PDF ohne driveFileId: kein Prefetch', () => {
    const urls = pdfPrefetchUrls([
      { id: 'a', driveFileId: '', dateiname: 'x', mimeType: 'application/pdf' } as FrageAnhang,
    ])
    expect(urls).toEqual([])
  })
})
```

- [ ] **Step 2: Tests failen sehen**

Run:
```bash
cd ExamLab && npx vitest run src/tests/anhaengePrefetch.test.ts 2>&1 | tail -10
```

Expected: 7 Tests failen (Modul fehlt).

- [ ] **Step 3: Helper implementieren**

Create `ExamLab/src/utils/anhaengePrefetch.ts`:

```ts
import type { FrageAnhang } from '../types/fragen'
import { drivePreviewUrl, istPDF } from './mediaUtils'

/**
 * Bundle G.b — Extrahiert PDF-Prefetch-URLs aus einer Anhang-Liste.
 *
 * Liefert maximal **eine** URL: die drivePreviewUrl des ersten PDF-Anhangs.
 * Andere Mime-Types (Bild/Audio/Video) werden ignoriert (siehe Spec G.b).
 * Anhänge ohne driveFileId werden ignoriert.
 */
export function pdfPrefetchUrls(anhaenge: readonly FrageAnhang[] | undefined): string[] {
  if (!anhaenge || anhaenge.length === 0) return []
  const ersterPdf = anhaenge.find((a) => istPDF(a.mimeType) && Boolean(a.driveFileId))
  if (!ersterPdf) return []
  return [drivePreviewUrl(ersterPdf.driveFileId)]
}
```

- [ ] **Step 4: Tests grün**

Run:
```bash
cd ExamLab && npx vitest run src/tests/anhaengePrefetch.test.ts 2>&1 | tail -10
```

Expected: 7/7 grün. Wenn `drivePreviewUrl` ein anderes URL-Schema liefert als im Test erwartet, **anpassen den Test** (Test prüft das tatsächliche Schema von `mediaUtils.ts`). Erst kurz `cat ExamLab/src/utils/mediaUtils.ts | grep drivePreviewUrl` um die echte Form zu sehen, dann Erwartungen synchronisieren.

- [ ] **Step 5: Commit**

```bash
git add ExamLab/src/utils/anhaengePrefetch.ts ExamLab/src/tests/anhaengePrefetch.test.ts
git commit -m "ExamLab G.b: pdfPrefetchUrls-Helper (erstes PDF aus Anhang-Liste)"
```

---

## Task 3: `useEditorNeighborPrefetch` Hook

**Files:**
- Create: `ExamLab/src/hooks/useEditorNeighborPrefetch.ts`
- Test: `ExamLab/src/tests/useEditorNeighborPrefetch.test.tsx`

- [ ] **Step 1: Test-Datei**

Create `ExamLab/src/tests/useEditorNeighborPrefetch.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { useEditorNeighborPrefetch } from '../hooks/useEditorNeighborPrefetch'

const ladeDetailMock = vi.fn(async () => null)

vi.mock('../store/fragenbankStore', () => ({
  useFragenbankStore: {
    getState: () => ({ ladeDetail: ladeDetailMock }),
  },
}))

vi.mock('../services/preWarmApi', () => ({
  PRE_WARM_ENABLED: true,
}))

interface Props {
  currentFrageId: string | null
  previous: { id: string; fachbereich: string } | null
  next: { id: string; fachbereich: string } | null
  email: string
}
function HookHost(p: Props) {
  useEditorNeighborPrefetch(p)
  return null
}

describe('useEditorNeighborPrefetch', () => {
  beforeEach(() => {
    ladeDetailMock.mockClear()
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('ruft ladeDetail für previous und next nach 300 ms Debounce', async () => {
    render(
      <HookHost
        currentFrageId="f10"
        previous={{ id: 'f9', fachbereich: 'BWL' }}
        next={{ id: 'f11', fachbereich: 'BWL' }}
        email="lp@x.ch"
      />,
    )
    expect(ladeDetailMock).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(300)
    expect(ladeDetailMock).toHaveBeenCalledTimes(2)
    expect(ladeDetailMock).toHaveBeenCalledWith('lp@x.ch', 'f9', 'BWL')
    expect(ladeDetailMock).toHaveBeenCalledWith('lp@x.ch', 'f11', 'BWL')
  })

  it('previous=null: nur next wird geladen', async () => {
    render(
      <HookHost
        currentFrageId="f1"
        previous={null}
        next={{ id: 'f2', fachbereich: 'VWL' }}
        email="lp@x.ch"
      />,
    )
    await vi.advanceTimersByTimeAsync(300)
    expect(ladeDetailMock).toHaveBeenCalledTimes(1)
    expect(ladeDetailMock).toHaveBeenCalledWith('lp@x.ch', 'f2', 'VWL')
  })

  it('next=null: nur previous wird geladen', async () => {
    render(
      <HookHost
        currentFrageId="f99"
        previous={{ id: 'f98', fachbereich: 'Recht' }}
        next={null}
        email="lp@x.ch"
      />,
    )
    await vi.advanceTimersByTimeAsync(300)
    expect(ladeDetailMock).toHaveBeenCalledTimes(1)
  })

  it('schneller Wechsel vor Debounce-Ablauf: nur letzter Stand triggert', async () => {
    const { rerender } = render(
      <HookHost
        currentFrageId="f1"
        previous={null}
        next={{ id: 'f2', fachbereich: 'BWL' }}
        email="lp@x.ch"
      />,
    )
    await vi.advanceTimersByTimeAsync(100)
    rerender(
      <HookHost
        currentFrageId="f5"
        previous={{ id: 'f4', fachbereich: 'BWL' }}
        next={{ id: 'f6', fachbereich: 'BWL' }}
        email="lp@x.ch"
      />,
    )
    await vi.advanceTimersByTimeAsync(100)
    expect(ladeDetailMock).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(300)
    // Nach Debounce: nur f4 + f6 geladen, NICHT f2
    const calls = ladeDetailMock.mock.calls.map((c) => c[1])
    expect(calls).toContain('f4')
    expect(calls).toContain('f6')
    expect(calls).not.toContain('f2')
  })

  it('currentFrageId=null: kein Prefetch', async () => {
    render(
      <HookHost
        currentFrageId={null}
        previous={{ id: 'f1', fachbereich: 'BWL' }}
        next={{ id: 'f2', fachbereich: 'BWL' }}
        email="lp@x.ch"
      />,
    )
    await vi.advanceTimersByTimeAsync(500)
    expect(ladeDetailMock).not.toHaveBeenCalled()
  })

  it('email leer: kein Prefetch (verhindert anonyme Backend-Calls)', async () => {
    render(
      <HookHost
        currentFrageId="f1"
        previous={null}
        next={{ id: 'f2', fachbereich: 'BWL' }}
        email=""
      />,
    )
    await vi.advanceTimersByTimeAsync(500)
    expect(ladeDetailMock).not.toHaveBeenCalled()
  })

  it('Unmount vor Debounce-Ablauf: kein Aufruf, kein Crash', async () => {
    const { unmount } = render(
      <HookHost
        currentFrageId="f1"
        previous={null}
        next={{ id: 'f2', fachbereich: 'BWL' }}
        email="lp@x.ch"
      />,
    )
    unmount()
    await vi.advanceTimersByTimeAsync(500)
    expect(ladeDetailMock).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Tests failen sehen**

Run:
```bash
cd ExamLab && npx vitest run src/tests/useEditorNeighborPrefetch.test.tsx 2>&1 | tail -10
```

Expected: alle Cases failen (Modul fehlt).

- [ ] **Step 3: Hook implementieren**

Create `ExamLab/src/hooks/useEditorNeighborPrefetch.ts`:

```ts
import { useEffect, useRef } from 'react'
import { useFragenbankStore } from '../store/fragenbankStore'
import { PRE_WARM_ENABLED } from '../services/preWarmApi'

const DEBOUNCE_MS = 300

interface NeighborInfo {
  id: string
  fachbereich: string
}

interface Options {
  currentFrageId: string | null
  previous: NeighborInfo | null
  next: NeighborInfo | null
  email: string
}

/**
 * Bundle G.b — Lädt nach 300 ms Debounce die ±1 Nachbar-Fragen ins
 * fragenbankStore.detailCache. Fire-and-forget, fail-silent.
 *
 * Skipping-Bedingungen: PRE_WARM_ENABLED=false, currentFrageId=null, email leer.
 */
export function useEditorNeighborPrefetch({
  currentFrageId,
  previous,
  next,
  email,
}: Options): void {
  const aktuellRef = useRef({ previous, next, email })
  aktuellRef.current = { previous, next, email }

  useEffect(() => {
    if (!PRE_WARM_ENABLED) return
    if (!currentFrageId) return
    if (!email) return

    const timer = setTimeout(() => {
      const { previous: p, next: n, email: e } = aktuellRef.current
      const ladeDetail = useFragenbankStore.getState().ladeDetail
      if (p) void ladeDetail(e, p.id, p.fachbereich)
      if (n) void ladeDetail(e, n.id, n.fachbereich)
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [currentFrageId, email])
}
```

- [ ] **Step 4: Tests grün**

Run:
```bash
cd ExamLab && npx vitest run src/tests/useEditorNeighborPrefetch.test.tsx 2>&1 | tail -10
```

Expected: 7/7 grün.

- [ ] **Step 5: Commit**

```bash
git add ExamLab/src/hooks/useEditorNeighborPrefetch.ts ExamLab/src/tests/useEditorNeighborPrefetch.test.tsx
git commit -m "ExamLab G.b: useEditorNeighborPrefetch-Hook (300ms debounced)"
```

---

## Task 4: FragenBrowser-Integration

**Files:**
- Modify: `ExamLab/src/components/lp/fragenbank/FragenBrowser.tsx` (Bereich Z.~78–180)
- Test: `ExamLab/src/tests/fragenBrowserEditorPrefetch.test.tsx`

- [ ] **Step 1: Integration-Test schreiben**

Create `ExamLab/src/tests/fragenBrowserEditorPrefetch.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, waitFor } from '@testing-library/react'

// Mock fragenbankStore — nur die Methoden die FragenBrowser benutzt
const ladeDetailMock = vi.fn(async (_email, frageId, _fb) => ({
  id: frageId,
  fachbereich: 'BWL',
  typ: 'mc',
  fragetext: '',
  punkte: 1,
}))
const getDetailMock = vi.fn(() => null)
const ladeMock = vi.fn()

vi.mock('../store/fragenbankStore', () => ({
  useFragenbankStore: Object.assign(
    () => ({
      summaries: [
        { id: 'f1', fachbereich: 'BWL', typ: 'mc', titel: 'A' },
        { id: 'f2', fachbereich: 'BWL', typ: 'mc', titel: 'B' },
        { id: 'f3', fachbereich: 'BWL', typ: 'mc', titel: 'C' },
      ],
      summaryMap: new Map(),
      fragen: [],
      detailCache: {},
      status: 'summary_fertig' as const,
      lade: ladeMock,
      ladeDetail: ladeDetailMock,
      getDetail: getDetailMock,
    }),
    { getState: () => ({ ladeDetail: ladeDetailMock, getDetail: getDetailMock, lade: ladeMock }) },
  ),
}))

// PRE_WARM_ENABLED=true beibehalten
// Weitere Mocks (apiService, useAuthStore) je nach FragenBrowser-Imports

// PSEUDO — der echte Test mountet FragenBrowser, klickt "Bearbeiten" auf f2,
// wartet auf den Hook-Effekt und prüft, dass ladeDetail mit f1 und f3 aufgerufen wurde.

describe.todo('FragenBrowser EditorNeighbor-Prefetch — integration', () => {
  it('öffnen von f2 triggert Prefetch von f1 und f3 nach Debounce', async () => {
    // TODO: FragenBrowser benötigt umfangreiche Mocks (authStore, useFragenFilter,
    // apiService, etc.). Wenn das Setup zu komplex wird, diesen Test als
    // Smoke-Integration in Browser-E2E (Task 8) verlagern.
  })
})
```

**Hinweis für den Implementer:** Wenn das vollständige FragenBrowser-Mocking für ein Vitest-Setup zu zeit-intensiv ist (FragenBrowser hat ~10 Imports von Stores/Services), darf der Implementer diesen Integration-Test als `describe.todo` belassen und stattdessen die Integration im Browser-E2E (Task 8 unten) verifizieren. Das Decision-Kriterium: Wenn nach 30 Min Aufwand der Mock-Setup nicht steht, → `.todo` lassen, im Plan-Commit Begründung dokumentieren.

- [ ] **Step 2: FragenBrowser editieren — Hook-Aufruf einsetzen**

In `ExamLab/src/components/lp/fragenbank/FragenBrowser.tsx`:

a) Import hinzufügen (oben bei den Hook-Imports):

```ts
import { useEditorNeighborPrefetch } from '../../../hooks/useEditorNeighborPrefetch'
```

b) Direkt nach `nachbarCallbacks`-useMemo (nach Zeile ~180), neuen Block:

```ts
// Bundle G.b — ±1 Nachbar-Fragen ins detailCache prefetchen
const nachbarFuerPrefetch = useMemo(() => {
  if (!editFrage) return { previous: null, next: null }
  const idx = filter.sortierteFragen.findIndex((f) => f.id === editFrage.id)
  if (idx < 0) return { previous: null, next: null }
  const prev = idx > 0 ? filter.sortierteFragen[idx - 1] : null
  const nxt = idx < filter.sortierteFragen.length - 1 ? filter.sortierteFragen[idx + 1] : null
  return {
    previous: prev ? { id: prev.id, fachbereich: prev.fachbereich } : null,
    next: nxt ? { id: nxt.id, fachbereich: nxt.fachbereich } : null,
  }
}, [editFrage, filter.sortierteFragen])

useEditorNeighborPrefetch({
  currentFrageId: editFrage?.id ?? null,
  previous: nachbarFuerPrefetch.previous,
  next: nachbarFuerPrefetch.next,
  email: user?.email ?? '',
})
```

**Wichtig:** Der Hook MUSS unbedingt aufgerufen werden (nicht nur conditional), wegen React-Hooks-Rules — das ist gegeben weil der Aufruf top-level in der Funktionskomponente steht und der Hook intern null-Checks macht.

- [ ] **Step 3: Tests, tsc, build laufen lassen**

Run:
```bash
cd ExamLab && npx tsc -b && npx vitest run 2>&1 | tail -5 && npm run build 2>&1 | tail -3
```

Expected: tsc clean, vitest grün (gegenüber Baseline + alle neuen Tests aus Task 1+2+3 = +20 Tests minimum), build OK.

- [ ] **Step 4: Commit**

```bash
git add ExamLab/src/components/lp/fragenbank/FragenBrowser.tsx ExamLab/src/tests/fragenBrowserEditorPrefetch.test.tsx
git commit -m "ExamLab G.b: FragenBrowser ruft useEditorNeighborPrefetch beim Editor-Open"
```

---

## Task 5: SuS-Üben-Integration (`UebungsScreen`)

**Files:**
- Modify: `ExamLab/src/components/ueben/UebungsScreen.tsx`

- [ ] **Step 1: Inspektion — wo lebt der "aktuelle Frage"-State?**

Run:
```bash
cd ExamLab && grep -n "aktuelleFrage\|aktuelleFrageIndex\|session\.fragen" src/components/ueben/UebungsScreen.tsx | head -10
```

Erwartung: Bestätigt was wir aus dem Brainstorming wissen — `session.fragen[]` und `session.aktuelleFrageIndex` sind die Quelle. Aktuelle Frage bekommt man via `session.fragen[session.aktuelleFrageIndex]`. Nächste = `session.fragen[aktuelleFrageIndex + 1]`.

- [ ] **Step 2: Imports + Hook-Aufruf einbauen**

In `ExamLab/src/components/ueben/UebungsScreen.tsx`:

a) Imports oben:

```ts
import { useMemo } from 'react'  // wenn noch nicht da
import { usePrefetchAssets } from '../../hooks/usePrefetchAssets'
import { pdfPrefetchUrls } from '../../utils/anhaengePrefetch'
```

b) Innerhalb der Funktionskomponente, **direkt nachdem `frage` (aktuelle Frage) und `session` verfügbar sind** (wahrscheinlich nach Zeile ~30 wo `const frage = aktuelleFrage()` steht), ergänzen:

```ts
// Bundle G.b — PDF-Anhang der NÄCHSTEN Frage browser-prefetchen
const naechsteFragePdfUrls = useMemo(() => {
  const idx = session?.aktuelleFrageIndex ?? -1
  const naechste = session?.fragen?.[idx + 1]
  return pdfPrefetchUrls(naechste?.anhaenge)
}, [session?.aktuelleFrageIndex, session?.fragen])

usePrefetchAssets(naechsteFragePdfUrls)
```

**Wenn `session` aus dem Store nicht direkt verfügbar ist:** Die exakte Variable im UebungsScreen kann anders heissen (z.B. `state`). Der Implementer liest die Datei zu Beginn und passt die Property-Pfade an. Hauptsache: nächste-Frage ist `fragen[aktuelleFrageIndex + 1]`.

- [ ] **Step 3: Build + tsc**

Run:
```bash
cd ExamLab && npx tsc -b && npx vitest run 2>&1 | tail -3
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add ExamLab/src/components/ueben/UebungsScreen.tsx
git commit -m "ExamLab G.b: UebungsScreen prefetcht PDF-Anhang der naechsten Frage"
```

---

## Task 6: SuS-Prüfen-Integration (`Layout.tsx`)

**Files:**
- Modify: `ExamLab/src/components/Layout.tsx` (Pro-Frage-Bereich Z.~470)

- [ ] **Step 1: Inspektion — Quelle für aktuelle + nächste Frage**

Run:
```bash
cd ExamLab && grep -n "aktuelleFrage\|aktiveFrage\|fragen\[\|frageIndex" src/components/Layout.tsx | head -15
```

Erwartung: Layout nutzt entweder `pruefungsStore` direkt oder bekommt `aktuelleFrage` als prop / Hook-Result. Implementer identifiziert die genaue Quelle. Falls Index nicht direkt verfügbar: `pruefungsStore.fragen.findIndex(f => f.id === aktuelleFrage.id)`.

- [ ] **Step 2: Hook einbauen**

a) Imports:

```ts
import { usePrefetchAssets } from '../hooks/usePrefetchAssets'
import { pdfPrefetchUrls } from '../utils/anhaengePrefetch'
```

b) Im Funktionskörper, **im Pfad der die Pro-Frage-Ansicht rendert**, zwischen den State-Reads und dem JSX-Return einen Block:

```ts
// Bundle G.b — PDF-Anhang der NÄCHSTEN Frage prefetchen
const naechsteFragePdfUrls = useMemo(() => {
  if (!aktuelleFrage || !alleFragen) return []
  const idx = alleFragen.findIndex((f) => f.id === aktuelleFrage.id)
  if (idx < 0) return []
  const nxt = alleFragen[idx + 1]
  return pdfPrefetchUrls(nxt?.anhaenge)
}, [aktuelleFrage, alleFragen])

usePrefetchAssets(naechsteFragePdfUrls)
```

**Variablen-Namen anpassen** je nachdem wie sie in Layout.tsx wirklich heissen (`config.fragen`, `pruefungsStore.fragen`, etc.).

- [ ] **Step 3: Build + Test**

Run:
```bash
cd ExamLab && npx tsc -b && npx vitest run 2>&1 | tail -3 && npm run build 2>&1 | tail -3
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add ExamLab/src/components/Layout.tsx
git commit -m "ExamLab G.b: Layout (SuS-Pruefen) prefetcht PDF-Anhang der naechsten Frage"
```

---

## Task 7: LP-Korrektur-Integration (`KorrekturFragenAnsicht`)

**Files:**
- Modify: `ExamLab/src/components/lp/korrektur/KorrekturFragenAnsicht.tsx`

- [ ] **Step 1: Inspektion**

Run:
```bash
cd ExamLab && grep -n "aktuelleFrageIndex\|fragenIndex\|frageIdx\|fragen\[" src/components/lp/korrektur/KorrekturFragenAnsicht.tsx | head -10
```

Im KorrekturDashboard gibt es zwei Modi (`korrekturModus: 'schueler' | 'frage'`):
- `'schueler'` — pro SuS sequentiell durch alle Fragen → Index der **Frage** ist relevant
- `'frage'` — pro Frage sequentiell durch alle SuS → Frage-Index ändert sich seltener, aber wenn ja: nächste-Frage relevant

In beiden Modi gibt es eine "aktuelle Frage". Der Hook prefetcht den PDF-Anhang der nächsten Frage **in der Liste der Korrektur-Fragen**.

- [ ] **Step 2: Hook einbauen**

a) Imports:

```ts
import { useMemo } from 'react'  // falls noch nicht da
import { usePrefetchAssets } from '../../../hooks/usePrefetchAssets'
import { pdfPrefetchUrls } from '../../../utils/anhaengePrefetch'
```

b) Im Funktionskörper:

```ts
// Bundle G.b — PDF-Anhang der naechsten Frage prefetchen
const naechsteFragePdfUrls = useMemo(() => {
  if (!fragen || fragen.length === 0) return []
  const aktuelleId = /* Quelle aus den Props/State der Komponente */
  const idx = fragen.findIndex((f) => f.id === aktuelleId)
  if (idx < 0 || idx >= fragen.length - 1) return []
  return pdfPrefetchUrls(fragen[idx + 1]?.anhaenge)
}, [fragen, /* aktuelleId-Source */])

usePrefetchAssets(naechsteFragePdfUrls)
```

**Implementer-Aufgabe:** `aktuelleId` durch die echte Quelle ersetzen (Prop, State, Store). Wenn die Komponente `frageIndex`/`aktuelleFrage` als Prop bekommt — nutzen.

- [ ] **Step 3: Build + Test**

Run:
```bash
cd ExamLab && npx tsc -b && npx vitest run 2>&1 | tail -3
```

- [ ] **Step 4: Commit**

```bash
git add ExamLab/src/components/lp/korrektur/KorrekturFragenAnsicht.tsx
git commit -m "ExamLab G.b: KorrekturFragenAnsicht prefetcht PDF-Anhang der naechsten Frage"
```

---

## Task 8: End-to-End-Verifikation auf staging

**Voraussetzung:** Alle vorherigen Tasks gemerged in den Branch, alle automatisierten Checks (tsc, vitest, build) grün.

- [ ] **Step 1: Test-Plan schreiben**

Schreibe in den Chat (NICHT als Datei, einfach kurzer Block):

```
## Test-Plan G.b — Browser-E2E

### Trigger 1 — Editor-Nachbar-Prefetch (LP-Login wr.test@gymhofwil.ch)
1. FragenBrowser öffnen
2. DevTools Network-Tab öffnen, Filter "ladeFrageDetail"
3. Frage in der Mitte einer sortierten Fachbereich-Liste editieren
4. Erwartung: 3 GET-Calls mit `action=ladeFrageDetail` innerhalb der ersten 1.5 s nach Editor-Open — einer für die aktive Frage (sofort), zwei für die Nachbarn (nach ~300 ms Debounce)
5. "Next"-Pfeil im Editor klicken
6. Erwartung: Editor switcht **sofort** auf neue Frage, KEIN neuer ladeFrageDetail-Call sichtbar (Frontend-Cache hit)

### Trigger 2 — PDF-Anhang-Prefetch (SuS-Login wr.test@stud.gymhofwil.ch)
1. Übung öffnen, die in Frage N+1 einen PDF-Anhang enthält
2. DevTools Network-Tab, Filter "drive"
3. Auf Frage N navigieren
4. Erwartung: GET an `https://drive.google.com/file/d/<id>/preview` mit Initiator "link" innerhalb 1 s
5. "Weiter" → Frage N+1
6. Erwartung: PDF-iframe-Request hat Status 200 mit Vermerk "(disk cache)" oder "(memory cache)" oder Time < 50 ms

### Regression-Check (kritische Pfade aus regression-prevention.md)
- LP Monitoring (Pfad 4): Prüfungs-Lobby öffnen, SuS-Liste laden — keine Crashes
- SuS lädt Prüfung (Pfad 1): wr.test@stud Login, vorhandene Prüfung öffnen, Frage rendert
- Korrektur (Pfad 5): vorhandene Korrektur öffnen, durch SuS scrollen — keine Console-Errors

### Security-Check
- Ladenden Nachbar-Detail-Calls liefern für LP **inkl.** Lösungsfelder (korrekt, musterloesung) — Trigger 1 ist LP-only
- Trigger 2 lädt nur PDF-URLs die das iframe ohnehin lädt — keine neue Surface
- Console: keine Errors, kein "Cannot read properties of undefined"
```

- [ ] **Step 2: Branch nach staging deployen**

Per CONVENTION nach `deployment-workflow.md`: Push auf den Feature-Branch + Force-push auf `origin/preview` (oder per CI auf staging URL).

```bash
git push -u origin feature/bundle-g-b-prefetch
git push origin feature/bundle-g-b-prefetch:preview --force-with-lease
```

**Vor dem Force-Push:** `git log preview..feature/bundle-g-b-prefetch --oneline` — dürfte clean sein, weil G.a auf main gemergt ist und preview davor stand. Wenn auf preview unerwartete Commits hängen → Stop, User fragen (Memory: feedback_preview_forcepush.md).

- [ ] **Step 3: Tab-Gruppe für E2E-Test öffnen**

User (DUY) öffnet zwei Browser-Tabs auf der staging-URL:
- Tab A: LP-Login `wr.test@gymhofwil.ch`
- Tab B: SuS-Login `wr.test@stud.gymhofwil.ch`

Claude wartet bis User "kannst loslegen" sagt.

- [ ] **Step 4: Test-Plan abarbeiten**

Erst Trigger 1 (LP-Tab), dann Trigger 2 (SuS-Tab), dann Regression-Check. Network-Tab-Screenshots in der Antwort dokumentieren.

**Wichtig zur Cache-Hit-Verifikation Trigger 2:** Wenn der zweite Request beim Frage-Wechsel nicht aus dem Cache kommt (Time > 200 ms, kein "from disk cache"), dann ist die Prefetch-URL nicht identisch zur iframe-`src`-URL. In dem Fall:
1. URL des Prefetch-Tags und URL des iframe-`src` direkt vergleichen (rechte-Maustaste → "URL kopieren")
2. Wenn unterschiedlich: `pdfPrefetchUrls`-Helper anpassen, dass er die exakte iframe-URL liefert
3. Re-deployen, re-testen

- [ ] **Step 5: Ergebnisse dokumentieren**

In den Chat einen kurzen Befund schreiben:
- Trigger 1: ✓ / ✗ (mit konkreten Latenzen)
- Trigger 2: ✓ / ✗ (mit Cache-Hit-Status)
- Regression-Check: ✓ / ✗
- Security-Check: ✓ / ✗

---

## Task 9: Merge nach `main`

**Voraussetzungen alle erfüllt (Hard-Stop nach regression-prevention.md):**

- [ ] Browser-Test durchgeführt (Task 8) — mit Befund "alle Trigger funktionieren"
- [ ] Security-Check durchgeführt (Task 8 letzter Substep)
- [ ] User (LP) hat **explizit "Merge OK"** geschrieben
- [ ] HANDOFF.md aktualisiert (siehe Step unten)

- [ ] **Step 1: HANDOFF.md aktualisieren**

In `ExamLab/HANDOFF.md` die "Aktueller Stand"-Sektion fortschreiben:
- S148 (DATUM) — Bundle G.b auf `main`
- 2 neue Hooks + 1 Helper, 4 Komponenten-Edits, 4 neue Test-Dateien
- Mess-Werte aus Browser-E2E
- Next: Bundle G.c (Login-Pre-Fetch + Sicherheits-Audit)

```bash
git add ExamLab/HANDOFF.md
git commit -m "ExamLab G.b: HANDOFF.md fuer S148"
```

- [ ] **Step 2: Merge**

```bash
git checkout main
git pull
git merge --no-ff feature/bundle-g-b-prefetch -m "ExamLab G.b: Editor-Nachbar + Anhang-PDF-Prefetch"
git push
```

- [ ] **Step 3: Branch aufräumen**

```bash
git branch -d feature/bundle-g-b-prefetch
git push origin --delete feature/bundle-g-b-prefetch
```

- [ ] **Step 4: Memory-Update**

In MEMORY.md (`/Users/durandbourjate/.claude/projects/-Users-durandbourjate-Documents--Gym-Hofwil-00-Automatisierung-Unterricht/memory/`):
- Bestehende `project_s147_bundle_ga.md` lassen
- Neue `project_s148_bundle_gb.md` mit den Eckdaten anlegen
- Eintrag in `MEMORY.md` (Index, eine Zeile <200 chars)

---

## Erfolgskriterien

- Vitest grün (Baseline + ~22 neue Tests aus Task 1+2+3)
- `tsc -b` clean
- `npm run build` erfolgreich
- E2E auf staging: Trigger 1 messbar (Editor-Nav instant), Trigger 2 messbar (PDF aus Disk-Cache)
- Keine Regression in den 5 kritischen Pfaden aus regression-prevention.md
- Branch sauber gemergt, HANDOFF + Memory aktualisiert

## Anti-Patterns vermeiden

- **Frontend-Memory-Cache `detailCache` nicht "leaken":** Wenn LP zwischen Sessions wechselt, bleibt `detailCache` befüllt. Das ist OK weil zustand persistierend ist und der Cache LP-only Daten enthält. Nicht versuchen, manuell zu invalidieren.
- **Prefetch nicht vom Hauptpfad blockieren:** `usePrefetchAssets`-Tag-Insertion läuft im `useEffect`, also nach dem Render. Niemals synchron im Body machen.
- **Prefetch nicht für Seiten-internen Cache (memory cache) annehmen:** Browser hält Memory-Cache nur kurz. Erfolg messen wir über "from disk cache" oder Time < 50 ms.
- **Keine breite Refactoring-Runde:** wenn der Implementer in einer der edit'ed Dateien grössere Cleanup-Möglichkeiten sieht (toter Code, ungenutzte Imports), separat in eigenem Folge-Task auflisten und NICHT inline mit G.b mergen.
