# MediaQuelle-Unification Implementation Plan (v2 — Reviewer-Feedback eingearbeitet)

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vereinheitliche alle Medien-Referenzen (Bilder, PDFs, Anhänge) in ExamLab auf einen einzigen Discriminated-Union-Type `MediaQuelle`, der die Varianten `drive`, `pool`, `app`, `extern` und `inline` sauber unterscheidet. Ersetzt die heutigen 3–5 parallelen Felder pro Medium und schliesst die in Session 123/124 entdeckte Bugklasse (mimeType-undefined-Crash, Pool-PDF-Datenverlust) strukturell aus.

**Architecture:** Zentraler Typ `MediaQuelle` in `packages/shared/src/types/mediaQuelle.ts`. Alle Fragetypen speichern Medien als `MediaQuelle`. Ein Migrator-Layer überführt Alt-Felder beim Laden. Rendering läuft durch **eine** `<MediaAnzeige>`-Komponente, Editor-Upload durch **eine** `<MediaUpload>`-Komponente — beide mit exhaustivem `switch` auf `quelle.typ`. PDF-Binary-Zugriff (für pdf.js Annotation-Canvas) über `mediaQuelleZuArrayBuffer`.

**Tech Stack:** React 19 + TypeScript + Vite + Vitest + Zustand. Monorepo — `packages/shared` (Typen, Editor, UI) und `ExamLab/` (App), Repo-Root = `10 Github/GYM-WR-DUY/`. `@shared`-Alias zeigt auf `../packages/shared/src`. Backend = Google Apps Script (V8, `ExamLab/apps-script-code.js`).

---

## Wichtige Fakten (vor Start lesen!)

- **Repo-Root:** `10 Github/GYM-WR-DUY/` — alle Pfade in diesem Plan sind relativ dazu (ausser wo explizit als `cd ExamLab`-relative markiert).
- **`@shared`-Alias:** Aus `ExamLab/`-Context importiert Code via `@shared/...` (z.B. `@shared/types/mediaQuelle`). Löst auf `../packages/shared/src/...`.
- **Test-Discovery:** `ExamLab/vitest.config.ts` hat `include: ['src/**/*.test.{ts,tsx}']`. **Tests für shared-Code liegen im ExamLab-Baum** unter `ExamLab/src/__tests__/media/` und importieren via `@shared`. Keine vitest-Config in `packages/shared/`.
- **Test-Runtime:** jsdom + `@testing-library/react` v16 + `@testing-library/jest-dom` v6 installiert (`ExamLab/package.json`). Setup-File: `ExamLab/src/test-setup.ts`.
- **Apps-Script-Runtime:** V8, ES2019-artig. `let`/`const`/Arrow-Functions OK. **Keine** ES-Modules, **keine** optional chaining `?.` in älteren Editor-Versionen — nutze `&&`-Guards zur Sicherheit. Nur ein globaler Scope.
- **Commit-Convention (Projekt-üblich):** Descriptive, deutsch, kein conventional-commits-Prefix. Beispiele: `"ExamLab: MediaQuelle-Type + Migrator hinzugefügt"`, `"Fix Bildfrage-Editor: defensives mimeType-Handling"`. Co-Author-Footer wie gewohnt.
- **Staging-Deploy:** Push auf `preview`-Branch triggert GitHub-Actions → `https://durandbourjate.github.io/GYM-WR-DUY/staging/`. **Niemals `preview` von `main` rebasen** — immer auf aktuellen `preview`-Kopf rebasen (memory-regel `feedback_preview_forcepush.md`).
- **Browser-Test-Regel:** Immer mit echten Google-Logins (`wr.test@gymhofwil.ch` / `wr.test@stud.gymhofwil.ch`) auf Staging-URL, nie Demo-Modus (`.claude/rules/regression-prevention.md` + memory `feedback_echte_logins.md`).

---

## Scope Check

Ein zusammenhängender Refactor. 7 Phasen sequentiell abhängig. Phasen 1–2 sind testbar & mergebar ohne sichtbare User-Änderung. Phase 3 aufwärts ändert Frontend-Verhalten — Staging-Test pro Phase zwingend.

---

## Änderungen vs. Plan v1 (aus Review)

- **Erweiterung des Types:** 5 Varianten statt 4 — `app` neu hinzugefügt für ExamLab-lokale Assets (`ExamLab/public/demo-bilder/...` etc.) — sonst wären Einführungsprüfungs-Demos falsch klassifiziert.
- **Pfade korrigiert:** `packages/shared` ist Repo-Root-Sibling von `ExamLab`, nicht darunter.
- **Test-Location:** Tests unter `ExamLab/src/__tests__/media/` (vitest-Include greift).
- **URL-Resolver delegiert** an bestehende Helper `ExamLab/src/utils/assetUrl.ts::toAssetUrl` (für `app`) und `ExamLab/src/utils/ueben/assetUrl.ts` (für `pool` lokal). Vermeidet Dupliation.
- **PDF.js-Kompatibilität:** Neuer Helper `mediaQuelleZuArrayBuffer` (Task 4) — liefert Bytes für pdf.js-Annotation-Canvas, damit PDF-Fragetyp beim Umstellen nicht kaputtgeht.
- **Task 0:** Grep-Inventarisierung aller Alt-Feld-Call-Sites als erster Schritt.
- **TDD-Pinning:** Refactor-Tasks (8–11) beginnen mit Snapshot- oder Behavior-Tests vor dem Umbau.
- **Task 7 echter Diff** für `fragenFactory.ts` (Zeilen 212, 235, 245, 262).
- **Task 12 Sicherheits-Layer:** Dry-Run-Mode + Backup-Sheet vor Migration + one-sheet-first-Checkliste.
- **Phase 6 (Cleanup):** Cooling-Off-Period 2 Wochen nach Phase 5 explizit — Dual-Write bleibt, bis Staging-Daten als konsistent verifiziert sind.

---

## Phase 0 — Inventarisierung

### Task 0: Canonical Call-Site-Liste erstellen

**Files:**
- Create: `ExamLab/docs/superpowers/plans/2026-04-19-mediaquelle-callsites.txt`

Zweck: Eine einzige Quelle, welche Dateien Alt-Felder nutzen. Wird in Phase 6 Schritt für Schritt abgehakt.

- [ ] **Step 0.1: Grep ausführen, Output committen**

```bash
cd "10 Github/GYM-WR-DUY"
(
  echo "# Call-Sites für Alt-Felder (Stand $(date +%Y-%m-%d))"
  echo ""
  echo "## bildUrl + bildDriveFileId"
  grep -rn "bildUrl\|bildDriveFileId" ExamLab/src packages/shared/src --include='*.ts' --include='*.tsx' 2>/dev/null
  echo ""
  echo "## pdfBase64 + pdfDriveFileId + pdfUrl + pdfDateiname"
  grep -rn "pdfBase64\|pdfDriveFileId\|pdfUrl\|pdfDateiname" ExamLab/src packages/shared/src --include='*.ts' --include='*.tsx' 2>/dev/null
  echo ""
  echo "## FrageAnhang-Felder"
  grep -rn "\.mimeType\|\.driveFileId\|anhaenge\[" ExamLab/src packages/shared/src --include='*.ts' --include='*.tsx' 2>/dev/null
  echo ""
  echo "## Apps-Script"
  grep -n "bildUrl\|pdfBase64\|pdfUrl\|mimeType\|anhaenge" ExamLab/apps-script-code.js 2>/dev/null
) > ExamLab/docs/superpowers/plans/2026-04-19-mediaquelle-callsites.txt
wc -l ExamLab/docs/superpowers/plans/2026-04-19-mediaquelle-callsites.txt
```

Erwartet: ≥ 100 Einträge.

- [ ] **Step 0.2: Commit**

```bash
git add ExamLab/docs/superpowers/plans/2026-04-19-mediaquelle-callsites.txt
git commit -m "Plan: MediaQuelle-Refactor Call-Site-Inventur"
```

---

## Phase 1 — Foundation: Typ + Migrator + URL-Helper

### Task 1: `MediaQuelle`-Type definieren

**Files:**
- Create: `packages/shared/src/types/mediaQuelle.ts`
- Create: `ExamLab/src/__tests__/media/mediaQuelle.test.ts`

- [ ] **Step 1.1: Test für Type-Guards schreiben**

```ts
// ExamLab/src/__tests__/media/mediaQuelle.test.ts
import { describe, it, expect } from 'vitest'
import { istDriveQuelle, istPoolQuelle, istAppQuelle, istExternQuelle, istInlineQuelle, type MediaQuelle } from '@shared/types/mediaQuelle'

describe('MediaQuelle Type-Guards', () => {
  it('istDriveQuelle erkennt Drive-Quelle', () => {
    const q: MediaQuelle = { typ: 'drive', driveFileId: 'abc', mimeType: 'image/png' }
    expect(istDriveQuelle(q)).toBe(true)
    expect(istPoolQuelle(q)).toBe(false)
  })

  it('istPoolQuelle erkennt Pool-Quelle (Uebungspools)', () => {
    const q: MediaQuelle = { typ: 'pool', poolPfad: 'img/foo.svg', mimeType: 'image/svg+xml' }
    expect(istPoolQuelle(q)).toBe(true)
  })

  it('istAppQuelle erkennt App-lokales Asset (ExamLab/public/)', () => {
    const q: MediaQuelle = { typ: 'app', appPfad: 'demo-bilder/europa.svg', mimeType: 'image/svg+xml' }
    expect(istAppQuelle(q)).toBe(true)
    expect(istPoolQuelle(q)).toBe(false)
  })

  it('istExternQuelle erkennt externe URL', () => {
    const q: MediaQuelle = { typ: 'extern', url: 'https://example.com/x.png', mimeType: 'image/png' }
    expect(istExternQuelle(q)).toBe(true)
  })

  it('istInlineQuelle erkennt Base64', () => {
    const q: MediaQuelle = { typ: 'inline', base64: 'iVBOR', mimeType: 'image/png' }
    expect(istInlineQuelle(q)).toBe(true)
  })
})
```

- [ ] **Step 1.2: Test laufen lassen → Fail**

```bash
cd ExamLab && npx vitest run src/__tests__/media/mediaQuelle.test.ts
```
Expected: FAIL — `Cannot find module '@shared/types/mediaQuelle'`

- [ ] **Step 1.3: Type implementieren**

```ts
// packages/shared/src/types/mediaQuelle.ts
/**
 * Kanonische Media-Referenz für Bilder, PDFs und Anhänge.
 *
 * Discriminated Union: Der Compiler erzwingt bei `switch(quelle.typ)` die
 * vollständige Abdeckung aller Varianten. Neue Medien-Quellen erweitern
 * den Union-Type — Render-Code crasht zur Compile-Zeit, bevor ein Bug
 * produktiv wird.
 *
 * Ersetzt die früheren parallelen Felder (Phase 6 entfernt):
 *   Bild:   bildUrl + bildDriveFileId
 *   PDF:    pdfBase64 + pdfDriveFileId + pdfUrl + pdfDateiname
 *   Anhang: {base64, driveFileId, url, mimeType, dateiname} vermischt
 *
 * Varianten:
 *   drive  — Google Drive File-ID (Backend-uploaded)
 *   pool   — Uebungen/Uebungspools/-Pfad (GitHub Pages, Cross-Site)
 *   app    — ExamLab/public/-Pfad (lokales App-Asset, via BASE_URL)
 *   extern — Beliebige absolute http(s)-URL
 *   inline — Base64-encoded (Demo, klein; limit ~5MB wegen Sheet-Cell)
 */
export type MediaQuelle =
  | { typ: 'drive'; driveFileId: string; mimeType: string; dateiname?: string }
  | { typ: 'pool'; poolPfad: string; mimeType: string; dateiname?: string }
  | { typ: 'app'; appPfad: string; mimeType: string; dateiname?: string }
  | { typ: 'extern'; url: string; mimeType: string; dateiname?: string }
  | { typ: 'inline'; base64: string; mimeType: string; dateiname?: string }

/** Type-Guards */
export function istDriveQuelle(q: MediaQuelle): q is Extract<MediaQuelle, { typ: 'drive' }> {
  return q.typ === 'drive'
}
export function istPoolQuelle(q: MediaQuelle): q is Extract<MediaQuelle, { typ: 'pool' }> {
  return q.typ === 'pool'
}
export function istAppQuelle(q: MediaQuelle): q is Extract<MediaQuelle, { typ: 'app' }> {
  return q.typ === 'app'
}
export function istExternQuelle(q: MediaQuelle): q is Extract<MediaQuelle, { typ: 'extern' }> {
  return q.typ === 'extern'
}
export function istInlineQuelle(q: MediaQuelle): q is Extract<MediaQuelle, { typ: 'inline' }> {
  return q.typ === 'inline'
}
```

- [ ] **Step 1.4: Test Pass**

```bash
cd ExamLab && npx vitest run src/__tests__/media/mediaQuelle.test.ts
```
Expected: 5/5 PASS

- [ ] **Step 1.5: Commit**

```bash
git add packages/shared/src/types/mediaQuelle.ts ExamLab/src/__tests__/media/mediaQuelle.test.ts
git commit -m "ExamLab: MediaQuelle Discriminated Union + Type-Guards"
```

---

### Task 2: Migrator — Alt-Felder → MediaQuelle

**Files:**
- Create: `packages/shared/src/utils/mediaQuelleMigrator.ts`
- Create: `ExamLab/src/__tests__/media/mediaQuelleMigrator.test.ts`

Zweck: Reine Pure-Functions, die Alt-Daten in `MediaQuelle` überführen. Wird beim Laden aus Backend + Demo-Daten aufgerufen.

- [ ] **Step 2.1: Tests für 3 Funktionen + Edge Cases**

```ts
// ExamLab/src/__tests__/media/mediaQuelleMigrator.test.ts
import { describe, it, expect } from 'vitest'
import { bildQuelleAus, pdfQuelleAus, anhangQuelleAus } from '@shared/utils/mediaQuelleMigrator'

describe('bildQuelleAus', () => {
  it('erkennt Drive-ID aus bildDriveFileId', () => {
    const q = bildQuelleAus({ bildUrl: '', bildDriveFileId: 'abc123' })
    expect(q).toEqual({ typ: 'drive', driveFileId: 'abc123', mimeType: 'image/png' })
  })

  it('erkennt Drive-ID aus lh3.googleusercontent-URL', () => {
    const q = bildQuelleAus({ bildUrl: 'https://lh3.googleusercontent.com/d/xyz' })
    expect(q?.typ).toBe('drive')
    if (q?.typ === 'drive') expect(q.driveFileId).toBe('xyz')
  })

  it('erkennt Drive-ID aus drive.google.com-URL', () => {
    const q = bildQuelleAus({ bildUrl: 'https://drive.google.com/file/d/ABC/view' })
    expect(q?.typ).toBe('drive')
    if (q?.typ === 'drive') expect(q.driveFileId).toBe('ABC')
  })

  it('erkennt Pool-Pfad (img/...)', () => {
    const q = bildQuelleAus({ bildUrl: 'img/konjunktur.svg' })
    expect(q).toEqual({ typ: 'pool', poolPfad: 'img/konjunktur.svg', mimeType: 'image/svg+xml' })
  })

  it('erkennt Pool-Pfad (pool-bilder/...)', () => {
    const q = bildQuelleAus({ bildUrl: 'pool-bilder/foo.png' })
    expect(q).toEqual({ typ: 'pool', poolPfad: 'pool-bilder/foo.png', mimeType: 'image/png' })
  })

  it('erkennt App-lokales Asset (./demo-bilder/... und ./materialien/...)', () => {
    const q1 = bildQuelleAus({ bildUrl: './demo-bilder/europa.svg' })
    expect(q1).toEqual({ typ: 'app', appPfad: 'demo-bilder/europa.svg', mimeType: 'image/svg+xml' })
    const q2 = bildQuelleAus({ bildUrl: '/materialien/x.png' })
    expect(q2).toEqual({ typ: 'app', appPfad: 'materialien/x.png', mimeType: 'image/png' })
  })

  it('erkennt Inline base64 (data:image/...)', () => {
    const q = bildQuelleAus({ bildUrl: 'data:image/png;base64,iVBOR' })
    expect(q).toEqual({ typ: 'inline', base64: 'iVBOR', mimeType: 'image/png' })
  })

  it('erkennt externe URL', () => {
    const q = bildQuelleAus({ bildUrl: 'https://example.com/bild.jpg' })
    expect(q).toEqual({ typ: 'extern', url: 'https://example.com/bild.jpg', mimeType: 'image/jpeg' })
  })

  it('null bei fehlender Quelle', () => {
    expect(bildQuelleAus({ bildUrl: '', bildDriveFileId: '' })).toBeNull()
    expect(bildQuelleAus({} as any)).toBeNull()
  })
})

describe('pdfQuelleAus', () => {
  it('erkennt pdfBase64', () => {
    const q = pdfQuelleAus({ pdfBase64: 'JVBERi0x', pdfDateiname: 'doc.pdf' })
    expect(q).toEqual({ typ: 'inline', base64: 'JVBERi0x', mimeType: 'application/pdf', dateiname: 'doc.pdf' })
  })

  it('erkennt pdfDriveFileId', () => {
    const q = pdfQuelleAus({ pdfDriveFileId: 'abc', pdfDateiname: 'x.pdf' })
    expect(q).toEqual({ typ: 'drive', driveFileId: 'abc', mimeType: 'application/pdf', dateiname: 'x.pdf' })
  })

  it('erkennt pdfUrl App-lokal (./materialien/...)', () => {
    const q = pdfQuelleAus({ pdfUrl: './materialien/doc.pdf', pdfDateiname: 'doc.pdf' })
    expect(q).toEqual({ typ: 'app', appPfad: 'materialien/doc.pdf', mimeType: 'application/pdf', dateiname: 'doc.pdf' })
  })

  it('erkennt pdfUrl Pool (./uebungen-pools/... oder materialien/ im Pool-Context)', () => {
    // Heuristik: wenn Url mit "pool-" oder "uebungen-pools" beginnt → pool, sonst app
    const q = pdfQuelleAus({ pdfUrl: 'pool-bilder/doc.pdf' })
    expect(q?.typ).toBe('pool')
  })

  it('erkennt externe pdfUrl', () => {
    const q = pdfQuelleAus({ pdfUrl: 'https://example.com/doc.pdf' })
    expect(q).toEqual({ typ: 'extern', url: 'https://example.com/doc.pdf', mimeType: 'application/pdf' })
  })

  it('null wenn keine Quelle', () => {
    expect(pdfQuelleAus({})).toBeNull()
  })
})

describe('anhangQuelleAus', () => {
  it('nimmt mimeType + dateiname 1:1', () => {
    const q = anhangQuelleAus({ id: 'x', driveFileId: 'abc', dateiname: 'x.png', mimeType: 'image/png' })
    expect(q).toEqual({ typ: 'drive', driveFileId: 'abc', mimeType: 'image/png', dateiname: 'x.png' })
  })

  it('infert mimeType aus dateiname wenn nicht gesetzt', () => {
    const q = anhangQuelleAus({ id: 'x', driveFileId: 'abc', dateiname: 'foo.pdf' })
    expect(q?.mimeType).toBe('application/pdf')
  })

  it('fällt auf application/octet-stream bei völlig fehlenden Infos', () => {
    const q = anhangQuelleAus({ id: 'x', driveFileId: 'abc' })
    expect(q?.mimeType).toBe('application/octet-stream')
  })

  it('null wenn weder driveFileId noch base64 noch url', () => {
    expect(anhangQuelleAus({ id: 'x' })).toBeNull()
  })
})
```

- [ ] **Step 2.2: Test Fail**

```bash
cd ExamLab && npx vitest run src/__tests__/media/mediaQuelleMigrator.test.ts
```

- [ ] **Step 2.3: Implementierung**

```ts
// packages/shared/src/utils/mediaQuelleMigrator.ts
import type { MediaQuelle } from '../types/mediaQuelle'

function extrahiereDriveId(url: string): string | null {
  const lh3 = url.match(/lh3\.googleusercontent\.com\/d\/([^/?#]+)/)
  if (lh3) return lh3[1]
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/)
  if (drive) return drive[1]
  const driveOpen = url.match(/drive\.google\.com\/open\?id=([^&]+)/)
  if (driveOpen) return driveOpen[1]
  return null
}

function mimeTypeFuerEndung(pfad: string | undefined): string {
  if (!pfad) return 'application/octet-stream'
  const lower = pfad.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  if (lower.endsWith('.pdf')) return 'application/pdf'
  if (lower.endsWith('.mp3')) return 'audio/mpeg'
  if (lower.endsWith('.m4a')) return 'audio/mp4'
  if (lower.endsWith('.wav')) return 'audio/wav'
  if (lower.endsWith('.webm')) return 'video/webm'
  if (lower.endsWith('.mp4')) return 'video/mp4'
  return 'application/octet-stream'
}

/**
 * Klassifiziert einen relativen Pfad als Pool oder App.
 * - Pool-typische Präfixe (img/, pool-bilder/) → pool (Uebungen/Uebungspools)
 * - Alles andere → app (ExamLab/public/, aufgelöst via BASE_URL)
 */
function klassifiziereRelativenPfad(cleaned: string): 'pool' | 'app' {
  if (cleaned.startsWith('img/') || cleaned.startsWith('pool-bilder/')) return 'pool'
  return 'app'
}

interface AltBildFrage {
  bildUrl?: string
  bildDriveFileId?: string
}

export function bildQuelleAus(frage: AltBildFrage): MediaQuelle | null {
  // 1. Explizite Drive-ID
  if (frage.bildDriveFileId) {
    return { typ: 'drive', driveFileId: frage.bildDriveFileId, mimeType: 'image/png' }
  }
  const url = frage.bildUrl
  if (!url || typeof url !== 'string' || !url.length) return null

  // 2. data:-URL
  if (url.startsWith('data:')) {
    const match = url.match(/^data:([^;]+);base64,(.+)$/)
    if (match) return { typ: 'inline', base64: match[2], mimeType: match[1] }
    return null
  }

  // 3. Drive-URL-Muster
  const driveId = extrahiereDriveId(url)
  if (driveId) return { typ: 'drive', driveFileId: driveId, mimeType: mimeTypeFuerEndung(url) || 'image/png' }

  // 4. Absolute externe URL (http/https aber nicht Drive)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return { typ: 'extern', url, mimeType: mimeTypeFuerEndung(url) }
  }

  // 5. Relativer Pfad — normalisieren + klassifizieren
  const cleaned = url.replace(/^\.?\//, '')
  const typ = klassifiziereRelativenPfad(cleaned)
  if (typ === 'pool') {
    return { typ: 'pool', poolPfad: cleaned, mimeType: mimeTypeFuerEndung(cleaned) }
  }
  return { typ: 'app', appPfad: cleaned, mimeType: mimeTypeFuerEndung(cleaned) }
}

interface AltPDFFrage {
  pdfBase64?: string
  pdfDriveFileId?: string
  pdfUrl?: string
  pdfDateiname?: string
}

export function pdfQuelleAus(frage: AltPDFFrage): MediaQuelle | null {
  const dateiname = frage.pdfDateiname

  if (frage.pdfBase64) {
    return { typ: 'inline', base64: frage.pdfBase64, mimeType: 'application/pdf', dateiname }
  }
  if (frage.pdfDriveFileId) {
    return { typ: 'drive', driveFileId: frage.pdfDriveFileId, mimeType: 'application/pdf', dateiname }
  }
  const url = frage.pdfUrl
  if (!url) return null

  if (url.startsWith('http://') || url.startsWith('https://')) {
    const driveId = extrahiereDriveId(url)
    if (driveId) return { typ: 'drive', driveFileId: driveId, mimeType: 'application/pdf', dateiname }
    return { typ: 'extern', url, mimeType: 'application/pdf', dateiname }
  }

  const cleaned = url.replace(/^\.?\//, '')
  const typ = klassifiziereRelativenPfad(cleaned)
  if (typ === 'pool') {
    return { typ: 'pool', poolPfad: cleaned, mimeType: 'application/pdf', dateiname }
  }
  return { typ: 'app', appPfad: cleaned, mimeType: 'application/pdf', dateiname }
}

interface AltFrageAnhang {
  id: string
  driveFileId?: string
  base64?: string
  url?: string
  mimeType?: string
  dateiname?: string
}

export function anhangQuelleAus(anhang: AltFrageAnhang): MediaQuelle | null {
  const dateiname = anhang.dateiname
  const mimeType = anhang.mimeType || mimeTypeFuerEndung(dateiname)

  if (anhang.driveFileId) {
    return { typ: 'drive', driveFileId: anhang.driveFileId, mimeType, dateiname }
  }
  if (anhang.base64) {
    return { typ: 'inline', base64: anhang.base64, mimeType, dateiname }
  }
  if (anhang.url) {
    if (anhang.url.startsWith('http://') || anhang.url.startsWith('https://')) {
      const driveId = extrahiereDriveId(anhang.url)
      if (driveId) return { typ: 'drive', driveFileId: driveId, mimeType, dateiname }
      return { typ: 'extern', url: anhang.url, mimeType, dateiname }
    }
    const cleaned = anhang.url.replace(/^\.?\//, '')
    const typ = klassifiziereRelativenPfad(cleaned)
    if (typ === 'pool') return { typ: 'pool', poolPfad: cleaned, mimeType, dateiname }
    return { typ: 'app', appPfad: cleaned, mimeType, dateiname }
  }
  return null
}
```

- [ ] **Step 2.4: Tests Pass**

- [ ] **Step 2.5: Commit**

```bash
git add packages/shared/src/utils/mediaQuelleMigrator.ts ExamLab/src/__tests__/media/mediaQuelleMigrator.test.ts
git commit -m "ExamLab: MediaQuelle-Migrator für Alt-Felder (Bild/PDF/Anhang)"
```

---

### Task 3: URL-Resolver — MediaQuelle → browser-ladbare URL

**Files:**
- Create: `packages/shared/src/utils/mediaQuelleUrl.ts`
- Create: `ExamLab/src/__tests__/media/mediaQuelleUrl.test.ts`

**Wichtig (B2 aus Review):** Für `app` delegiert der Resolver an `ExamLab/src/utils/assetUrl.ts::toAssetUrl` via Parameter-Injection. So bleibt `BASE_URL`-Auflösung lokal-dev-tauglich.

- [ ] **Step 3.1: Test**

```ts
// ExamLab/src/__tests__/media/mediaQuelleUrl.test.ts
import { describe, it, expect } from 'vitest'
import { mediaQuelleZuImgSrc, mediaQuelleZuIframeSrc } from '@shared/utils/mediaQuelleUrl'

// Fake resolver für App-lokale Assets (simuliert toAssetUrl)
const fakeAppResolver = (p: string) => `/ExamLab/${p}`

describe('mediaQuelleZuImgSrc', () => {
  it('Drive: baut lh3.googleusercontent-URL', () => {
    const url = mediaQuelleZuImgSrc({ typ: 'drive', driveFileId: 'abc', mimeType: 'image/png' }, fakeAppResolver)
    expect(url).toBe('https://lh3.googleusercontent.com/d/abc')
  })

  it('Pool: baut Uebungspools-URL (hardcoded, Cross-Site)', () => {
    const url = mediaQuelleZuImgSrc({ typ: 'pool', poolPfad: 'img/foo.svg', mimeType: 'image/svg+xml' }, fakeAppResolver)
    expect(url).toBe('https://durandbourjate.github.io/GYM-WR-DUY/Uebungen/Uebungspools/img/foo.svg')
  })

  it('App: delegiert an resolver', () => {
    const url = mediaQuelleZuImgSrc({ typ: 'app', appPfad: 'demo-bilder/x.svg', mimeType: 'image/svg+xml' }, fakeAppResolver)
    expect(url).toBe('/ExamLab/demo-bilder/x.svg')
  })

  it('Extern: unverändert', () => {
    const url = mediaQuelleZuImgSrc({ typ: 'extern', url: 'https://ex.com/x.jpg', mimeType: 'image/jpeg' }, fakeAppResolver)
    expect(url).toBe('https://ex.com/x.jpg')
  })

  it('Inline: baut data:-URL', () => {
    const url = mediaQuelleZuImgSrc({ typ: 'inline', base64: 'iVBOR', mimeType: 'image/png' }, fakeAppResolver)
    expect(url).toBe('data:image/png;base64,iVBOR')
  })
})

describe('mediaQuelleZuIframeSrc', () => {
  it('Drive-PDF: /preview-URL', () => {
    expect(mediaQuelleZuIframeSrc({ typ: 'drive', driveFileId: 'abc', mimeType: 'application/pdf' }, fakeAppResolver))
      .toBe('https://drive.google.com/file/d/abc/preview')
  })

  it('Inline-PDF: data:...', () => {
    expect(mediaQuelleZuIframeSrc({ typ: 'inline', base64: 'JVBERi', mimeType: 'application/pdf' }, fakeAppResolver))
      .toBe('data:application/pdf;base64,JVBERi')
  })

  it('App: delegiert', () => {
    expect(mediaQuelleZuIframeSrc({ typ: 'app', appPfad: 'materialien/x.pdf', mimeType: 'application/pdf' }, fakeAppResolver))
      .toBe('/ExamLab/materialien/x.pdf')
  })
})
```

- [ ] **Step 3.2: Implementierung**

```ts
// packages/shared/src/utils/mediaQuelleUrl.ts
import type { MediaQuelle } from '../types/mediaQuelle'

export const POOL_BASE_URL = 'https://durandbourjate.github.io/GYM-WR-DUY/Uebungen/Uebungspools/'

/**
 * App-Resolver wird injiziert — die konkrete BASE_URL-Auflösung lebt in
 * `ExamLab/src/utils/assetUrl.ts::toAssetUrl` und soll nicht dupliziert werden.
 * Konsumenten in ExamLab importieren `toAssetUrl` und reichen es als 2. Arg durch.
 */
export type AppAssetResolver = (appPfad: string) => string

export function mediaQuelleZuImgSrc(quelle: MediaQuelle, appResolver: AppAssetResolver): string {
  switch (quelle.typ) {
    case 'drive':
      return `https://lh3.googleusercontent.com/d/${quelle.driveFileId}`
    case 'pool':
      return POOL_BASE_URL + quelle.poolPfad
    case 'app':
      return appResolver(quelle.appPfad)
    case 'extern':
      return quelle.url
    case 'inline':
      return `data:${quelle.mimeType};base64,${quelle.base64}`
  }
}

export function mediaQuelleZuIframeSrc(quelle: MediaQuelle, appResolver: AppAssetResolver): string {
  switch (quelle.typ) {
    case 'drive':
      return `https://drive.google.com/file/d/${quelle.driveFileId}/preview`
    case 'pool':
      return POOL_BASE_URL + quelle.poolPfad
    case 'app':
      return appResolver(quelle.appPfad)
    case 'extern':
      return quelle.url
    case 'inline':
      return `data:${quelle.mimeType};base64,${quelle.base64}`
  }
}
```

- [ ] **Step 3.3: Tests Pass**

- [ ] **Step 3.4: Commit**

```bash
git add packages/shared/src/utils/mediaQuelleUrl.ts ExamLab/src/__tests__/media/mediaQuelleUrl.test.ts
git commit -m "ExamLab: URL-Resolver mediaQuelleZuImgSrc/IframeSrc (mit DI-Resolver für app)"
```

---

### Task 4: PDF-Binary-Helper (pdf.js-Kompatibilität)

**Files:**
- Create: `packages/shared/src/utils/mediaQuelleBytes.ts`
- Create: `ExamLab/src/__tests__/media/mediaQuelleBytes.test.ts`

**Warum (B3 aus Review):** pdf.js-Annotation-Canvas (SuS-Render für PDF-Fragen) braucht `Uint8Array`/`ArrayBuffer`, nicht iframe-URL. Ohne diesen Helper crasht PDF-Frage-Rendering nach Migration für `drive`/`pool`/`app`/`extern`-Varianten.

- [ ] **Step 4.1: Test (mit fetch-Mock)**

```ts
// ExamLab/src/__tests__/media/mediaQuelleBytes.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mediaQuelleZuArrayBuffer } from '@shared/utils/mediaQuelleBytes'

const fakeAppResolver = (p: string) => `/ExamLab/${p}`

describe('mediaQuelleZuArrayBuffer', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    } as Response))
  })

  it('Inline: decodiert base64 direkt ohne fetch', async () => {
    // "PDF" in base64 = "UERG"
    const ab = await mediaQuelleZuArrayBuffer(
      { typ: 'inline', base64: 'UERG', mimeType: 'application/pdf' },
      fakeAppResolver,
    )
    expect(ab.byteLength).toBe(3)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('Drive: fetcht lh3-URL', async () => {
    await mediaQuelleZuArrayBuffer(
      { typ: 'drive', driveFileId: 'abc', mimeType: 'application/pdf' },
      fakeAppResolver,
    )
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('lh3.googleusercontent.com/d/abc'))
  })

  it('App: fetcht via resolver', async () => {
    await mediaQuelleZuArrayBuffer(
      { typ: 'app', appPfad: 'materialien/x.pdf', mimeType: 'application/pdf' },
      fakeAppResolver,
    )
    expect(global.fetch).toHaveBeenCalledWith('/ExamLab/materialien/x.pdf')
  })

  it('throws bei HTTP-Fehler', async () => {
    (global.fetch as any).mockResolvedValueOnce({ ok: false, status: 404, statusText: 'NF' })
    await expect(
      mediaQuelleZuArrayBuffer({ typ: 'extern', url: 'https://x/y.pdf', mimeType: 'application/pdf' }, fakeAppResolver)
    ).rejects.toThrow(/404/)
  })
})
```

- [ ] **Step 4.2: Implementierung**

```ts
// packages/shared/src/utils/mediaQuelleBytes.ts
import type { MediaQuelle } from '../types/mediaQuelle'
import { mediaQuelleZuImgSrc, type AppAssetResolver } from './mediaQuelleUrl'

/**
 * Liefert den Binär-Inhalt der MediaQuelle als ArrayBuffer — für pdf.js,
 * Audio-Decoding, oder andere Konsumenten, die Bytes brauchen.
 *
 * Fallback-Strategie:
 * - inline → base64-decode lokal (kein Netzwerk)
 * - drive/pool/app/extern → fetch() der aufgelösten URL
 *
 * Fehler werden als Exception geworfen (400/404/Netzwerk). Caller sollte
 * Fallback-UI zeigen.
 */
export async function mediaQuelleZuArrayBuffer(
  quelle: MediaQuelle,
  appResolver: AppAssetResolver,
): Promise<ArrayBuffer> {
  if (quelle.typ === 'inline') {
    const binaryString = atob(quelle.base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i)
    return bytes.buffer
  }
  const url = mediaQuelleZuImgSrc(quelle, appResolver)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`MediaQuelle fetch failed: ${res.status} ${res.statusText} (${url})`)
  return res.arrayBuffer()
}
```

- [ ] **Step 4.3: Tests Pass, Commit**

```bash
git add packages/shared/src/utils/mediaQuelleBytes.ts ExamLab/src/__tests__/media/mediaQuelleBytes.test.ts
git commit -m "ExamLab: mediaQuelleZuArrayBuffer für pdf.js + Audio-Bytes"
```

---

## Phase 2 — UI-Komponenten (parallel, noch nicht verdrahtet)

### Task 5: `<MediaAnzeige>`-Komponente

**Files:**
- Create: `packages/shared/src/components/MediaAnzeige.tsx`
- Create: `ExamLab/src/__tests__/media/MediaAnzeige.test.tsx`

- [ ] **Step 5.0: jsdom + RTL Setup prüfen**

```bash
grep -E "environment.*jsdom|test-setup" ExamLab/vitest.config.ts
# Erwartet: environment: 'jsdom' + setupFiles: ['./src/test-setup.ts']
cat ExamLab/src/test-setup.ts | head -5
# Erwartet: import '@testing-library/jest-dom'
```

Wenn Setup fehlt: Zusätzlicher Step, `ExamLab/src/test-setup.ts` um `import '@testing-library/jest-dom'` ergänzen (falls nicht bereits vorhanden).

- [ ] **Step 5.1: Tests mit RTL**

```tsx
// ExamLab/src/__tests__/media/MediaAnzeige.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MediaAnzeige from '@shared/components/MediaAnzeige'

const fakeResolver = (p: string) => `/ExamLab/${p}`

describe('MediaAnzeige', () => {
  it('rendert <img> für image/*', () => {
    render(<MediaAnzeige quelle={{ typ: 'drive', driveFileId: 'abc', mimeType: 'image/png' }} appResolver={fakeResolver} alt="x" />)
    const img = screen.getByAltText('x') as HTMLImageElement
    expect(img.tagName).toBe('IMG')
    expect(img.src).toContain('lh3.googleusercontent.com/d/abc')
  })

  it('rendert <iframe> für application/pdf', () => {
    const { container } = render(<MediaAnzeige quelle={{ typ: 'drive', driveFileId: 'abc', mimeType: 'application/pdf' }} appResolver={fakeResolver} />)
    const iframe = container.querySelector('iframe')
    expect(iframe?.src).toContain('drive.google.com/file/d/abc/preview')
  })

  it('rendert <audio> für audio/*', () => {
    const { container } = render(<MediaAnzeige quelle={{ typ: 'extern', url: 'https://x/a.mp3', mimeType: 'audio/mpeg' }} appResolver={fakeResolver} />)
    expect(container.querySelector('audio')).toBeTruthy()
  })

  it('Fallback-Badge für unbekannte MIME', () => {
    const { container } = render(<MediaAnzeige quelle={{ typ: 'drive', driveFileId: 'abc', mimeType: 'application/zip' }} appResolver={fakeResolver} />)
    expect(container.textContent).toContain('Datei')
  })
})
```

- [ ] **Step 5.2: Implementierung**

```tsx
// packages/shared/src/components/MediaAnzeige.tsx
import type { MediaQuelle } from '../types/mediaQuelle'
import { mediaQuelleZuImgSrc, mediaQuelleZuIframeSrc, type AppAssetResolver } from '../utils/mediaQuelleUrl'
import { istBild, istAudio, istVideo, istPDF } from '../editor/utils/mediaUtils'

interface Props {
  quelle: MediaQuelle
  appResolver: AppAssetResolver
  alt?: string
  className?: string
  hoehe?: number
}

export default function MediaAnzeige({ quelle, appResolver, alt, className, hoehe = 400 }: Props) {
  if (istBild(quelle.mimeType)) {
    return <img src={mediaQuelleZuImgSrc(quelle, appResolver)} alt={alt ?? quelle.dateiname ?? ''} className={className} />
  }
  if (istPDF(quelle.mimeType)) {
    return (
      <iframe
        src={mediaQuelleZuIframeSrc(quelle, appResolver)}
        title={alt ?? quelle.dateiname ?? 'PDF'}
        className={className}
        style={{ width: '100%', height: hoehe, border: 0 }}
      />
    )
  }
  if (istAudio(quelle.mimeType)) {
    return <audio src={mediaQuelleZuImgSrc(quelle, appResolver)} controls className={className} />
  }
  if (istVideo(quelle.mimeType)) {
    return <video src={mediaQuelleZuImgSrc(quelle, appResolver)} controls className={className} style={{ maxHeight: hoehe }} />
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-700">
      📎 Datei: {quelle.dateiname ?? quelle.mimeType}
    </span>
  )
}
```

- [ ] **Step 5.3: Tests Pass, Commit**

```bash
git add packages/shared/src/components/MediaAnzeige.tsx ExamLab/src/__tests__/media/MediaAnzeige.test.tsx
git commit -m "ExamLab: MediaAnzeige-Komponente (universeller Render-Switch)"
```

---

### Task 6: `<MediaUpload>`-Komponente

**Files:**
- Create: `packages/shared/src/components/MediaUpload.tsx`
- Create: `ExamLab/src/__tests__/media/MediaUpload.test.tsx`

Feature-Highlights:
- Datei-Drop + -Klick → `EditorServices.uploadAnhang` (Drive) oder inline-base64 (Demo-Mode)
- URL-Eingabe → erkennt Drive-URLs automatisch, sonst `extern`
- Bestehende Quelle → Info-Box + Entfernen-Button
- MIME-Whitelist-Prop

- [ ] **Step 6.1: Tests**

```tsx
// ExamLab/src/__tests__/media/MediaUpload.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MediaUpload from '@shared/components/MediaUpload'
import { EditorContext } from '@shared/editor/EditorContext'
import type { EditorServices } from '@shared/editor/EditorContext'

const services: EditorServices = {
  istUploadVerfuegbar: () => false,
  uploadAnhang: vi.fn(),
  openKiBildGenerator: vi.fn(),
} as any

function wrap(el: React.ReactNode) {
  return <EditorContext.Provider value={services}>{el}</EditorContext.Provider>
}

describe('MediaUpload', () => {
  it('zeigt Dropzone wenn keine Quelle', () => {
    render(wrap(<MediaUpload quelle={null} setQuelle={() => {}} akzeptiereMimeTypes={['image/*']} label="Bild" />))
    expect(screen.getByText(/hierher ziehen/i)).toBeTruthy()
  })

  it('zeigt Dateiname + Entfernen-Button bei bestehender Quelle', () => {
    const q = { typ: 'drive' as const, driveFileId: 'abc', mimeType: 'image/png', dateiname: 'bild.png' }
    render(wrap(<MediaUpload quelle={q} setQuelle={() => {}} akzeptiereMimeTypes={['image/*']} label="Bild" />))
    expect(screen.getByText(/bild\.png/)).toBeTruthy()
    expect(screen.getByRole('button', { name: /entfernen/i })).toBeTruthy()
  })

  it('Drive-URL-Eingabe → drive-Quelle', () => {
    const setQuelle = vi.fn()
    render(wrap(<MediaUpload quelle={null} setQuelle={setQuelle} akzeptiereMimeTypes={['image/*']} label="Bild" />))
    const input = screen.getByPlaceholderText(/URL einfügen/i)
    // Blur triggert change (Production-Code nutzt onBlur — Test nutzt auch onBlur)
    fireEvent.change(input, { target: { value: 'https://lh3.googleusercontent.com/d/xyz' } })
    fireEvent.blur(input)
    expect(setQuelle).toHaveBeenCalledWith(expect.objectContaining({ typ: 'drive', driveFileId: 'xyz' }))
  })

  it('https-URL ohne Drive → extern-Quelle', () => {
    const setQuelle = vi.fn()
    render(wrap(<MediaUpload quelle={null} setQuelle={setQuelle} akzeptiereMimeTypes={['image/*']} label="Bild" />))
    const input = screen.getByPlaceholderText(/URL einfügen/i)
    fireEvent.change(input, { target: { value: 'https://ex.com/foo.png' } })
    fireEvent.blur(input)
    expect(setQuelle).toHaveBeenCalledWith({ typ: 'extern', url: 'https://ex.com/foo.png', mimeType: 'image/png' })
  })

  it('Entfernen-Button → setQuelle(null)', () => {
    const setQuelle = vi.fn()
    const q = { typ: 'drive' as const, driveFileId: 'abc', mimeType: 'image/png', dateiname: 'x.png' }
    render(wrap(<MediaUpload quelle={q} setQuelle={setQuelle} akzeptiereMimeTypes={['image/*']} label="Bild" />))
    fireEvent.click(screen.getByRole('button', { name: /entfernen/i }))
    expect(setQuelle).toHaveBeenCalledWith(null)
  })
})
```

- [ ] **Step 6.2: Implementierung**

Code analog zu v1 Task 5 (siehe `packages/shared/src/editor/components/BildUpload.tsx` als Vorlage, aber strukturiert um `MediaQuelle`). **Unterschied v2:** URL-Eingabe nutzt `extrahiereDriveId` aus `mediaQuelleMigrator` für automatische Drive-Erkennung.

```tsx
// packages/shared/src/components/MediaUpload.tsx
import { useRef, useState } from 'react'
import { useEditorServices } from '../editor/EditorContext'
import type { MediaQuelle } from '../types/mediaQuelle'

interface Props {
  quelle: MediaQuelle | null
  setQuelle: (q: MediaQuelle | null) => void
  akzeptiereMimeTypes: string[]
  label: string
  maxGroesse?: number
}

function mimeVonUrl(url: string): string {
  const lower = url.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  if (lower.endsWith('.pdf')) return 'application/pdf'
  return 'application/octet-stream'
}

function extrahiereDriveId(url: string): string | null {
  const lh3 = url.match(/lh3\.googleusercontent\.com\/d\/([^/?#]+)/)
  if (lh3) return lh3[1]
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/)
  if (drive) return drive[1]
  return null
}

export default function MediaUpload({ quelle, setQuelle, akzeptiereMimeTypes, label, maxGroesse = 5 * 1024 * 1024 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fehler, setFehler] = useState<string | null>(null)
  const [ladetHoch, setLadetHoch] = useState(false)
  const services = useEditorServices()

  async function handleDatei(datei: File) {
    setFehler(null)
    if (datei.size > maxGroesse) {
      setFehler(`Datei zu gross (max. ${Math.round(maxGroesse / 1024 / 1024)} MB).`)
      return
    }
    const mimeType = datei.type || 'application/octet-stream'

    if (services.istUploadVerfuegbar() && services.uploadAnhang) {
      setLadetHoch(true)
      try {
        const result = await services.uploadAnhang(label.toLowerCase() + '-upload', datei)
        if (result && 'error' in result) {
          setFehler(`Upload fehlgeschlagen: ${result.error}`)
        } else if (result?.driveFileId) {
          setQuelle({ typ: 'drive', driveFileId: result.driveFileId, mimeType, dateiname: datei.name })
        }
      } catch (err) {
        setFehler('Upload fehlgeschlagen (Netzwerk).')
      } finally {
        setLadetHoch(false)
      }
      return
    }

    // Fallback: inline base64
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1] ?? result
      setQuelle({ typ: 'inline', base64, mimeType, dateiname: datei.name })
    }
    reader.readAsDataURL(datei)
  }

  function handleUrlEingabe(url: string) {
    if (!url.trim()) { setQuelle(null); return }
    const driveId = extrahiereDriveId(url)
    if (driveId) {
      setQuelle({ typ: 'drive', driveFileId: driveId, mimeType: mimeVonUrl(url) })
      return
    }
    setQuelle({ typ: 'extern', url, mimeType: mimeVonUrl(url) })
  }

  if (quelle) {
    return (
      <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
            {quelle.dateiname ?? `(${quelle.typ})`}
          </p>
          <p className="text-xs text-slate-500">{quelle.typ} · {quelle.mimeType}</p>
        </div>
        <button type="button" onClick={() => setQuelle(null)} className="text-xs text-red-600 dark:text-red-400 hover:underline">
          Entfernen
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div
        onDrop={(e) => { e.preventDefault(); const d = e.dataTransfer.files[0]; if (d) handleDatei(d) }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-violet-500 bg-violet-50 dark:bg-[#2d2040] rounded-lg p-4 text-center cursor-pointer"
      >
        <input
          ref={inputRef}
          type="file"
          accept={akzeptiereMimeTypes.join(',')}
          className="hidden"
          onChange={(e) => { const d = e.target.files?.[0]; if (d) handleDatei(d); e.target.value = '' }}
        />
        {ladetHoch ? 'Wird hochgeladen…' : `${label} hierher ziehen oder klicken`}
      </div>
      <input
        type="text"
        placeholder="oder URL einfügen (https://…)"
        onBlur={(e) => handleUrlEingabe(e.target.value)}
        className="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
      />
      {fehler && <p className="text-xs text-red-600">{fehler}</p>}
    </div>
  )
}
```

- [ ] **Step 6.3: Tests Pass, Commit**

```bash
git add packages/shared/src/components/MediaUpload.tsx ExamLab/src/__tests__/media/MediaUpload.test.tsx
git commit -m "ExamLab: MediaUpload-Komponente (Datei, URL, Drive-Detection)"
```

---

## Phase 3 — Frage-Types erweitern

### Task 7: `MediaQuelle`-Felder zu Fragen-Types hinzufügen

**Files:**
- Modify: `packages/shared/src/types/fragen.ts`

Alte Felder werden `@deprecated`-markiert bleiben. Neue Felder sind **optional** bis Phase 6 (wenn Alt-Felder entfernt + MediaQuelle Pflicht wird).

- [ ] **Step 7.1: HotspotFrage, BildbeschriftungFrage, DragDropBildFrage**

```ts
// packages/shared/src/types/fragen.ts — am Anfang:
import type { MediaQuelle } from './mediaQuelle'

// HotspotFrage (ca. Z.550):
export interface HotspotFrage extends FrageBase {
  typ: 'hotspot'
  fragetext: string
  /** @deprecated Phase 6: entfernt. Nutze `bild` (MediaQuelle). */
  bildUrl?: string
  /** @deprecated Phase 6: entfernt. */
  bildDriveFileId?: string
  /** Neue kanonische Media-Referenz */
  bild?: MediaQuelle
  bereiche: HotspotBereich[]
  mehrfachauswahl?: boolean
}

// BildbeschriftungFrage + DragDropBildFrage analog
```

- [ ] **Step 7.2: PDFFrage**

```ts
// PDFFrage (ca. Z.519):
export interface PDFFrage extends FrageBase {
  typ: 'pdf'
  fragetext: string
  /** @deprecated */
  pdfBase64?: string
  /** @deprecated */
  pdfDriveFileId?: string
  /** @deprecated */
  pdfUrl?: string
  /** @deprecated */
  pdfDateiname?: string
  /** Neue kanonische PDF-Referenz */
  pdf?: MediaQuelle
  seitenAnzahl: number
  kategorien?: PDFKategorie[]
  erlaubteWerkzeuge: PDFAnnotationsWerkzeug[]
  musterloesungAnnotationen?: PDFAnnotation[]
}
```

- [ ] **Step 7.3: FrageAnhang**

```ts
// FrageAnhang (ca. Z.405):
export interface FrageAnhang {
  id: string
  /** @deprecated Phase 6: entfernt. Nutze `quelle`. */
  driveFileId?: string
  /** @deprecated */
  base64?: string
  /** @deprecated */
  mimeType?: string
  /** @deprecated */
  dateiname?: string
  /** @deprecated */
  url?: string
  /** @deprecated */
  groesseBytes?: number
  /** Neue kanonische Anhang-Referenz */
  quelle?: MediaQuelle
}
```

- [ ] **Step 7.4: TSC + Vitest**

```bash
cd ExamLab && npx tsc -b && npx vitest run
```
Expected: 0 Errors (alle alten Felder optional), Tests grün.

- [ ] **Step 7.5: Commit**

```bash
git add packages/shared/src/types/fragen.ts
git commit -m "ExamLab: MediaQuelle-Felder parallel zu Alt-Feldern auf Frage-Types"
```

---

## Phase 4 — Verdrahtung Frontend

### Task 8: SharedFragenEditor — State-Init + Save mit MediaQuelle

**Files:**
- Modify: `packages/shared/src/editor/SharedFragenEditor.tsx`
- Modify: `packages/shared/src/editor/fragenFactory.ts`

**Pinning-Test zuerst (M1 aus Review):** Snapshot-Test, der verifiziert dass Editor für eine Hotspot-Test-Frage heute ein bestimmtes JSX rendert. Wird durch den Refactor **nicht** invalidiert (d.h. UI bleibt identisch für den Nutzer).

- [ ] **Step 8.1: Pinning-Test — "Hotspot-Editor öffnet mit erwarteten Feldern"**

```tsx
// ExamLab/src/__tests__/media/SharedFragenEditor.hotspot.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SharedFragenEditor from '@shared/editor/SharedFragenEditor'
import { EditorContext } from '@shared/editor/EditorContext'

const services = { istUploadVerfuegbar: () => false, uploadAnhang: async () => null, openKiBildGenerator: () => {} } as any

describe('SharedFragenEditor Hotspot — Pinning', () => {
  it('zeigt Fragetext-Feld + Bild-Upload für Hotspot-Frage', () => {
    const frage: any = {
      id: 'h1', typ: 'hotspot', fragetext: 'Klick aufs Ziel',
      bildUrl: 'https://lh3.googleusercontent.com/d/abc',
      bereiche: [], mehrfachauswahl: false,
      punkte: 1, version: 1, fachbereich: 'VWL', fach: 'WR', thema: 'Test',
      semester: ['S1'], gefaesse: ['SF'], bloom: 'K2', tags: [], musterlosung: '',
      bewertungsraster: [], verwendungen: [], erstelltAm: '', geaendertAm: '',
    }
    render(
      <EditorContext.Provider value={services}>
        <SharedFragenEditor frage={frage} onSpeichern={() => {}} onAbbrechen={() => {}} />
      </EditorContext.Provider>
    )
    // Basis-Aussagen, die unabhängig vom bildUrl/bildDriveFileId-vs-bild-Refactor gültig bleiben:
    expect(screen.getByDisplayValue('Klick aufs Ziel')).toBeTruthy()
    expect(screen.getByText(/Bild/i)).toBeTruthy()
  })
})
```

- [ ] **Step 8.2: State-Init umstellen**

Ersetze Zeilen 375–413 in `SharedFragenEditor.tsx` durch:

```ts
// Imports am Anfang ergänzen:
import { bildQuelleAus, pdfQuelleAus } from '../utils/mediaQuelleMigrator'
import type { MediaQuelle } from '../types/mediaQuelle'

// State-Init für Bild (Hotspot/Bildbeschriftung/DragDropBild):
const BILD_FRAGETYPEN = ['hotspot', 'bildbeschriftung', 'dragdrop_bild'] as const
const [bildQuelle, setBildQuelle] = useState<MediaQuelle | null>(() => {
  if (!frage || !(BILD_FRAGETYPEN as readonly string[]).includes(frage.typ)) return null
  const bild = (frage as any).bild as MediaQuelle | undefined
  if (bild) return bild
  return bildQuelleAus(frage as any)
})

// State-Init für PDF:
const [pdfQuelle, setPdfQuelle] = useState<MediaQuelle | null>(() => {
  if (!frage || frage.typ !== 'pdf') return null
  const pdf = (frage as any).pdf as MediaQuelle | undefined
  if (pdf) return pdf
  return pdfQuelleAus(frage as any)
})

// PDF-spezifisch (bleiben nebenbei stehen, bis Phase 6):
const [pdfSeitenAnzahl, setPdfSeitenAnzahl] = useState(...)
const [pdfKategorien, setPdfKategorien] = useState(...)
const [pdfErlaubteWerkzeuge, setPdfErlaubteWerkzeuge] = useState(...)
const [pdfMusterloesungAnnotationen, setPdfMusterloesungAnnotationen] = useState(...)

// Die bisherigen einzelnen States (bildUrl, pdfBase64, pdfDriveFileId, pdfDateiname) werden entfernt.
// TypeEditorDispatcher-Props werden auf bildQuelle/setBildQuelle + pdfQuelle/setPdfQuelle umgestellt.
```

- [ ] **Step 8.3: fragenFactory.ts — exakter Diff für 4 Fragetypen**

In `packages/shared/src/editor/fragenFactory.ts`:

**Zeile 235 (hotspot), vorher:**
```ts
case 'hotspot':
  return {
    ...basis,
    typ: 'hotspot',
    fragetext: typDaten.fragetext.trim(),
    bildUrl: typDaten.bildUrl.trim(),
    bereiche: typDaten.bereiche,
    mehrfachauswahl: typDaten.mehrfachauswahl,
  } as HotspotFrage
```

**Nachher (parallel schreiben):**
```ts
case 'hotspot': {
  const bildUrlLegacy = typDaten.bild ? ableitenLegacyBildUrl(typDaten.bild) : typDaten.bildUrl?.trim() ?? ''
  const driveFileIdLegacy = typDaten.bild?.typ === 'drive' ? typDaten.bild.driveFileId : undefined
  return {
    ...basis,
    typ: 'hotspot',
    fragetext: typDaten.fragetext.trim(),
    bild: typDaten.bild,           // neu
    bildUrl: bildUrlLegacy,         // deprecated, für Backwards-Compat
    bildDriveFileId: driveFileIdLegacy,
    bereiche: typDaten.bereiche,
    mehrfachauswahl: typDaten.mehrfachauswahl,
  } as HotspotFrage
}
```

Analog für **Zeile 245 (bildbeschriftung)** und **Zeile 262 (dragdrop_bild)**.

**Zeile 212 (pdf), vorher:**
```ts
case 'pdf':
  return {
    ...basis,
    typ: 'pdf',
    fragetext: typDaten.fragetext.trim(),
    pdfDriveFileId: typDaten.pdfDriveFileId,
    pdfBase64: typDaten.pdfBase64,
    pdfDateiname: typDaten.pdfDateiname,
    seitenAnzahl: typDaten.seitenAnzahl,
    kategorien: typDaten.kategorien,
    erlaubteWerkzeuge: typDaten.erlaubteWerkzeuge,
    musterloesungAnnotationen: typDaten.musterloesungAnnotationen,
  } as PDFFrage
```

**Nachher:**
```ts
case 'pdf': {
  const pdf = typDaten.pdf as MediaQuelle | undefined
  return {
    ...basis,
    typ: 'pdf',
    fragetext: typDaten.fragetext.trim(),
    pdf,
    pdfDriveFileId: pdf?.typ === 'drive' ? pdf.driveFileId : typDaten.pdfDriveFileId,
    pdfBase64: pdf?.typ === 'inline' ? pdf.base64 : typDaten.pdfBase64,
    pdfUrl: pdf?.typ === 'app' ? `./${pdf.appPfad}` : pdf?.typ === 'pool' ? pdf.poolPfad : pdf?.typ === 'extern' ? pdf.url : typDaten.pdfUrl,
    pdfDateiname: pdf?.dateiname ?? typDaten.pdfDateiname,
    seitenAnzahl: typDaten.seitenAnzahl,
    kategorien: typDaten.kategorien,
    erlaubteWerkzeuge: typDaten.erlaubteWerkzeuge,
    musterloesungAnnotationen: typDaten.musterloesungAnnotationen,
  } as PDFFrage
}
```

**Hilfsfunktion oben in der Datei einfügen:**
```ts
import type { MediaQuelle } from '../types/mediaQuelle'

function ableitenLegacyBildUrl(q: MediaQuelle | undefined): string {
  if (!q) return ''
  switch (q.typ) {
    case 'drive': return `https://lh3.googleusercontent.com/d/${q.driveFileId}`
    case 'pool': return q.poolPfad
    case 'app': return `./${q.appPfad}`
    case 'extern': return q.url
    case 'inline': return `data:${q.mimeType};base64,${q.base64}`
  }
}
```

- [ ] **Step 8.4: TypEditorDispatcher-Props anpassen**

In `packages/shared/src/editor/sections/TypEditorDispatcher.tsx`:
- Zeile 167: `bildUrl: string` → `bildQuelle: MediaQuelle | null`
- setBildUrl → setBildQuelle analog
- Gleiche Änderung für PDF-Props (pdfBase64/pdfDriveFileId/pdfDateiname → pdfQuelle/setPdfQuelle)

In den Render-Branches für Hotspot/Bildbeschriftung/DragDropBild (Z.745, 756, 772) werden die neuen Props weitergereicht.

- [ ] **Step 8.5: TSC + Vitest + Pinning-Test bleibt grün**

```bash
cd ExamLab && npx tsc -b && npx vitest run
```

- [ ] **Step 8.6: Commit**

```bash
git add packages/shared/src/editor/SharedFragenEditor.tsx packages/shared/src/editor/fragenFactory.ts packages/shared/src/editor/sections/TypEditorDispatcher.tsx ExamLab/src/__tests__/media/SharedFragenEditor.hotspot.test.tsx
git commit -m "ExamLab: SharedFragenEditor liest/schreibt MediaQuelle (parallel zu Alt)"
```

---

### Task 9: Editor-Typen nutzen MediaUpload + MediaAnzeige

**Files:**
- Modify: `packages/shared/src/editor/typen/HotspotEditor.tsx`
- Modify: `packages/shared/src/editor/typen/BildbeschriftungEditor.tsx`
- Modify: `packages/shared/src/editor/typen/DragDropBildEditor.tsx`
- Modify: `packages/shared/src/editor/components/BildMitGenerator.tsx`
- Modify: `packages/shared/src/editor/components/PDFEditor.tsx`
- Modify: `packages/shared/src/editor/components/AnhangEditor.tsx`
- Delete: `packages/shared/src/editor/components/BildUpload.tsx`
- Delete: `packages/shared/src/editor/utils/poolBildUrl.ts`

**Pinning-Test:** Jeder Editor-Typ erhält einen Smoke-Test, der sicherstellt dass er mit einer Beispiel-Frage mit alter `bildUrl` UND neuer `bild`-Quelle jeweils rendert ohne Crash.

- [ ] **Step 9.1: HotspotEditor umstellen**

```tsx
// packages/shared/src/editor/typen/HotspotEditor.tsx
import type { MediaQuelle } from '../../types/mediaQuelle'
import MediaUpload from '../../components/MediaUpload'
import MediaAnzeige from '../../components/MediaAnzeige'
import { useAppResolver } from '../EditorContext'  // neuer Hook in EditorContext, Task 9.0

interface Props {
  bildQuelle: MediaQuelle | null
  setBildQuelle: (q: MediaQuelle | null) => void
  bereiche: HotspotBereich[]
  setBereiche: Dispatch<SetStateAction<HotspotBereich[]>>
  mehrfachauswahl: boolean
  setMehrfachauswahl: (v: boolean) => void
}

export default function HotspotEditor({ bildQuelle, setBildQuelle, bereiche, setBereiche, mehrfachauswahl, setMehrfachauswahl }: Props) {
  const appResolver = useAppResolver()
  return (
    <div className="space-y-4">
      <MediaUpload quelle={bildQuelle} setQuelle={setBildQuelle} akzeptiereMimeTypes={['image/*']} label="Bild" />
      {bildQuelle && (
        <div className="relative inline-block">
          <MediaAnzeige quelle={bildQuelle} appResolver={appResolver} alt="Hotspot" className="max-w-full rounded" />
          {/* Hotspot-Bereiche overlay bleibt unverändert */}
        </div>
      )}
      {/* Rest: Bereiche-Editor */}
    </div>
  )
}
```

- [ ] **Step 9.0: `useAppResolver`-Hook in `EditorContext`**

In `packages/shared/src/editor/EditorContext.tsx`:
```tsx
import type { AppAssetResolver } from '../utils/mediaQuelleUrl'

export interface EditorServices {
  // ... bestehende Felder
  appResolver: AppAssetResolver  // neu
}

export function useAppResolver(): AppAssetResolver {
  const services = useEditorServices()
  return services.appResolver
}
```

In allen `<EditorContext.Provider>`-Call-Sites (ExamLab-Host): `appResolver` auf `toAssetUrl` aus `ExamLab/src/utils/assetUrl.ts` setzen.

- [ ] **Step 9.2: BildbeschriftungEditor + DragDropBildEditor analog**

- [ ] **Step 9.3: PDFEditor**

```tsx
// packages/shared/src/editor/components/PDFEditor.tsx
// Props umstellen: pdfBase64/pdfDriveFileId/pdfDateiname → pdfQuelle/setPdfQuelle
// MediaUpload statt inline Drop-Zone
// MediaAnzeige für Preview (wenn pdfRenderer nicht verfügbar)

// useEffect für pdfRenderer nutzt mediaQuelleZuArrayBuffer:
useEffect(() => {
  if (pdfQuelle && pdfRenderer) {
    mediaQuelleZuArrayBuffer(pdfQuelle, appResolver)
      .then(buf => pdfRenderer.ladePDF({ arrayBuffer: buf }))
      .catch(err => console.error('[PDFEditor] PDF-Load fehlgeschlagen:', err))
  }
}, [])
```

**Wichtig:** `usePDFRenderer` muss `ladePDF` um `{arrayBuffer: ArrayBuffer}`-Variante erweitert bekommen (zusätzlich zu `{base64: string}` oder ersetzt, wenn nur noch neue Variante nötig).

- [ ] **Step 9.4: AnhangEditor**

Thumbnail-Render nutzt `MediaAnzeige`:
```tsx
{anhaenge.map((a) => {
  const quelle: MediaQuelle | null = a.quelle ?? anhangQuelleAus(a)
  if (!quelle) return <AnhangOhneQuelleBadge key={a.id} />
  return (
    <div key={a.id} className="...">
      <div className="w-10 h-10 shrink-0">
        <MediaAnzeige quelle={quelle} appResolver={appResolver} alt={quelle.dateiname ?? ''} />
      </div>
      {/* Dateiname, Grösse, Entfernen-Button */}
    </div>
  )
})}
```

Dadurch wird `istBild(a.mimeType)` nicht mehr direkt aufgerufen → der mediaUtils-Hotfix aus Commit `c7fe4c9` wird in Phase 6 überflüssig.

- [ ] **Step 9.5: Delete BildUpload.tsx + poolBildUrl.ts**

```bash
git rm packages/shared/src/editor/components/BildUpload.tsx
git rm packages/shared/src/editor/utils/poolBildUrl.ts
```

Dazu: Alle Imports dieser Dateien fixen (tsc -b zeigt Liste).

- [ ] **Step 9.6: TSC + Vitest + Build**

```bash
cd ExamLab && npx tsc -b && npx vitest run && npm run build
```

- [ ] **Step 9.7: Commit**

```bash
git add -A
git commit -m "ExamLab: Editor-Typen + AnhangEditor + PDFEditor nutzen MediaUpload/MediaAnzeige"
```

---

### Task 10: SuS-Fragetypen + MaterialPanel nutzen MediaAnzeige

**Files:**
- Modify: `ExamLab/src/components/fragetypen/HotspotFrage.tsx`
- Modify: `ExamLab/src/components/fragetypen/BildbeschriftungFrage.tsx`
- Modify: `ExamLab/src/components/fragetypen/DragDropBildFrage.tsx`
- Modify: `ExamLab/src/components/fragetypen/PDFFrage.tsx`
- Modify: `ExamLab/src/components/MaterialPanel.tsx`

**Pinning-Test:** Je ein Smoke-Test pro Komponente, dass Rendering mit Alt-Daten + mit neuer `bild`/`pdf`-Quelle funktioniert.

- [ ] **Step 10.1: Pinning-Tests**

```tsx
// ExamLab/src/__tests__/media/HotspotFrage.rendering.test.tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import HotspotFrage from '../../components/fragetypen/HotspotFrage'
// ... setup zu useFrageAdapter etc.

describe('HotspotFrage — rendering', () => {
  it('rendert Bild bei alter bildUrl', () => {
    const frage: any = { /* ... bildUrl: 'https://lh3...', bereiche: [] */ }
    const { container } = render(<HotspotFrage frage={frage} />)
    expect(container.querySelector('img')).toBeTruthy()
  })
  it('rendert Bild bei neuer bild-Quelle', () => {
    const frage: any = { /* ... bild: {typ:'drive', driveFileId:'x', mimeType:'image/png'} */ }
    const { container } = render(<HotspotFrage frage={frage} />)
    expect(container.querySelector('img')).toBeTruthy()
  })
})
```

Analog für BildbeschriftungFrage, DragDropBildFrage, PDFFrage.

- [ ] **Step 10.2: HotspotFrage umstellen**

```tsx
// ExamLab/src/components/fragetypen/HotspotFrage.tsx
import { bildQuelleAus } from '@shared/utils/mediaQuelleMigrator'
import MediaAnzeige from '@shared/components/MediaAnzeige'
import { toAssetUrl } from '../../utils/assetUrl'

// Im Render:
const bildQuelle = frage.bild ?? bildQuelleAus(frage)
if (!bildQuelle) return <span>Kein Bild</span>
return (
  <div>
    <MediaAnzeige quelle={bildQuelle} appResolver={toAssetUrl} alt="Hotspot" className="max-w-full rounded" />
    {/* Klick-Overlay bleibt */}
  </div>
)
```

- [ ] **Step 10.3: BildbeschriftungFrage, DragDropBildFrage analog**

- [ ] **Step 10.4: PDFFrage** — Anpassung des PDF-Viewer-Setups auf `mediaQuelleZuArrayBuffer`:

```tsx
// PDFFrage.tsx
const pdfQuelle = frage.pdf ?? pdfQuelleAus(frage)
// statt pdfBase64-direkt:
useEffect(() => {
  if (pdfQuelle) {
    mediaQuelleZuArrayBuffer(pdfQuelle, toAssetUrl)
      .then(buf => renderer.ladePDF({ arrayBuffer: buf }))
      .catch(err => setFehler(err.message))
  }
}, [frage.id])
```

- [ ] **Step 10.5: MaterialPanel** — für Materialien mit `url`-Feld einen Migrator einschieben (analog `anhangQuelleAus`).

- [ ] **Step 10.6: TSC + Vitest + lokaler Browser-Test**

```bash
cd ExamLab && npx tsc -b && npx vitest run && npm run preview
# Browser: http://localhost:4173 — Einführungsübung öffnen, Fragen 4-7 durchklicken
```

- [ ] **Step 10.7: Commit**

```bash
git commit -m "ExamLab: SuS-Fragetypen + MaterialPanel nutzen MediaAnzeige"
```

---

### Task 11: Korrektur-Ansicht + DruckAnsicht + Demo-Daten

**Files:**
- Modify: `ExamLab/src/components/lp/korrektur/KorrekturFrageVollansicht.tsx`
- Modify: `ExamLab/src/components/lp/vorbereitung/composer/DruckAnsicht.tsx`
- Modify: `ExamLab/src/data/einrichtungsFragen.ts`
- Modify: `ExamLab/src/data/einrichtungsUebungFragen.ts`

- [ ] **Step 11.1: Pinning-Test für KorrekturFrageVollansicht**

Smoke-Test, der eine Prüfung mit 4 Fragetypen durchläuft und sicherstellt dass alle Bilder + PDF-Preview rendern.

- [ ] **Step 11.2: KorrekturFrageVollansicht migrieren** — alle 4 Branches (Hotspot/Bildbeschriftung/DragDropBild/PDF) auf `MediaAnzeige`

- [ ] **Step 11.3: DruckAnsicht — `<img src={frage.bildUrl}>` → `<MediaAnzeige>` (PDF in Druck: Hinweis-Box statt iframe)**

- [ ] **Step 11.4: Demo-Daten-Update**

`einrichtungsFragen.ts` + `einrichtungsUebungFragen.ts`: Bildfragen + PDF-Fragen bekommen `bild` bzw. `pdf`-Feld. Alte Felder (`bildUrl`, `pdfUrl`) können vorerst bleiben (Phase 6 entfernt sie).

Beispiel:
```ts
// Bildbeschriftung-Frage (Einführung):
{
  id: 'einr-bb-europa',
  typ: 'bildbeschriftung',
  // ...
  bild: { typ: 'app', appPfad: 'demo-bilder/europa-karte.svg', mimeType: 'image/svg+xml' },
  bildUrl: './demo-bilder/europa-karte.svg',  // deprecated, Phase 6 entfernt
  beschriftungen: [...],
}
```

- [ ] **Step 11.5: TSC + Vitest + Staging-Push**

Nach Merge auf `preview`: Browser-Test wie in `.claude/rules/regression-prevention.md` Phase 3 beschrieben.

- [ ] **Step 11.6: Commit**

```bash
git commit -m "ExamLab: Korrektur + DruckAnsicht + Demo-Daten auf MediaQuelle"
```

---

## Phase 5 — Backend-Migration (Apps-Script)

### Task 12: Apps-Script Load/Save + Backup-Sheet + Dry-Run-Migrator

**Files:**
- Modify: `ExamLab/apps-script-code.js`

**Sicherheits-Protokoll (M3 aus Review):**
1. **Vor Code-Änderung:** User macht Backup-Kopie aller Fragen-Sheets im Google-Drive-Editor (Duplicate-Funktion).
2. **Code schreibt beim Load auch auf Alt-Felder** → Rollback möglich, solange Phase 6 nicht durchgeführt ist.
3. **Dry-Run-Modus im Migrator** → liefert Diff-Summary, schreibt nichts.
4. **One-Sheet-First** → Migration erst auf ein einziges Kurs-Sheet testen, dann auf alle.

- [ ] **Step 12.1: User erstellt Backup-Kopien**

**Manuelle Schritte für User:**
1. Google-Drive öffnen, Fragen-Sheets-Ordner
2. Jedes relevante Sheet → Rechtsklick → "Kopie erstellen" mit Suffix `-backup-2026-04-19`
3. Bestätigung dass Backups existieren

- [ ] **Step 12.2: Apps-Script — JS-Portierung von bildQuelleAus/pdfQuelleAus/anhangQuelleAus**

In `ExamLab/apps-script-code.js` am Ende (neue Section):

```js
// ============================================================
// === MediaQuelle Migrator (Apps-Script V8, 19.04.2026) ===
// ============================================================

var MQ_POOL_PATTERNS = ['img/', 'pool-bilder/']

function mq_mimeType_(pfad) {
  if (!pfad) return 'application/octet-stream'
  var lower = String(pfad).toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  if (lower.endsWith('.pdf')) return 'application/pdf'
  if (lower.endsWith('.mp3')) return 'audio/mpeg'
  if (lower.endsWith('.m4a')) return 'audio/mp4'
  return 'application/octet-stream'
}

function mq_extrahiereDriveId_(url) {
  if (!url) return null
  var lh3 = String(url).match(/lh3\.googleusercontent\.com\/d\/([^\/?#]+)/)
  if (lh3) return lh3[1]
  var drive = String(url).match(/drive\.google\.com\/file\/d\/([^\/?#]+)/)
  if (drive) return drive[1]
  return null
}

function mq_klassifiziere_(cleaned) {
  for (var i = 0; i < MQ_POOL_PATTERNS.length; i++) {
    if (cleaned.indexOf(MQ_POOL_PATTERNS[i]) === 0) return 'pool'
  }
  return 'app'
}

function mq_bildQuelleAus_(frage) {
  if (!frage) return null
  if (frage.bildDriveFileId) {
    return { typ: 'drive', driveFileId: frage.bildDriveFileId, mimeType: 'image/png' }
  }
  var url = frage.bildUrl
  if (!url || typeof url !== 'string') return null
  if (url.indexOf('data:') === 0) {
    var m = url.match(/^data:([^;]+);base64,(.+)$/)
    if (m) return { typ: 'inline', base64: m[2], mimeType: m[1] }
    return null
  }
  var driveId = mq_extrahiereDriveId_(url)
  if (driveId) return { typ: 'drive', driveFileId: driveId, mimeType: mq_mimeType_(url) || 'image/png' }
  if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
    return { typ: 'extern', url: url, mimeType: mq_mimeType_(url) }
  }
  var cleaned = url.replace(/^\.?\//, '')
  var typ = mq_klassifiziere_(cleaned)
  if (typ === 'pool') return { typ: 'pool', poolPfad: cleaned, mimeType: mq_mimeType_(cleaned) }
  return { typ: 'app', appPfad: cleaned, mimeType: mq_mimeType_(cleaned) }
}

function mq_pdfQuelleAus_(frage) {
  if (!frage) return null
  var dateiname = frage.pdfDateiname
  if (frage.pdfBase64) return { typ: 'inline', base64: frage.pdfBase64, mimeType: 'application/pdf', dateiname: dateiname }
  if (frage.pdfDriveFileId) return { typ: 'drive', driveFileId: frage.pdfDriveFileId, mimeType: 'application/pdf', dateiname: dateiname }
  var url = frage.pdfUrl
  if (!url) return null
  if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
    var driveId = mq_extrahiereDriveId_(url)
    if (driveId) return { typ: 'drive', driveFileId: driveId, mimeType: 'application/pdf', dateiname: dateiname }
    return { typ: 'extern', url: url, mimeType: 'application/pdf', dateiname: dateiname }
  }
  var cleaned = url.replace(/^\.?\//, '')
  var typ = mq_klassifiziere_(cleaned)
  if (typ === 'pool') return { typ: 'pool', poolPfad: cleaned, mimeType: 'application/pdf', dateiname: dateiname }
  return { typ: 'app', appPfad: cleaned, mimeType: 'application/pdf', dateiname: dateiname }
}

function mq_anhangQuelleAus_(a) {
  if (!a) return null
  var dateiname = a.dateiname
  var mimeType = a.mimeType || mq_mimeType_(dateiname)
  if (a.driveFileId) return { typ: 'drive', driveFileId: a.driveFileId, mimeType: mimeType, dateiname: dateiname }
  if (a.base64) return { typ: 'inline', base64: a.base64, mimeType: mimeType, dateiname: dateiname }
  if (a.url) {
    if (a.url.indexOf('http') === 0) {
      var driveId = mq_extrahiereDriveId_(a.url)
      if (driveId) return { typ: 'drive', driveFileId: driveId, mimeType: mimeType, dateiname: dateiname }
      return { typ: 'extern', url: a.url, mimeType: mimeType, dateiname: dateiname }
    }
    var cleaned = a.url.replace(/^\.?\//, '')
    var typ = mq_klassifiziere_(cleaned)
    if (typ === 'pool') return { typ: 'pool', poolPfad: cleaned, mimeType: mimeType, dateiname: dateiname }
    return { typ: 'app', appPfad: cleaned, mimeType: mimeType, dateiname: dateiname }
  }
  return null
}
```

- [ ] **Step 12.3: Load-Pfad erweitern**

In der Frage-Deserialisierungs-Funktion (existierende Lage: `row → Frage`, ca. Z.2078 für Fragenbank-Load, Z.7787 für Lernplattform-Load):

```js
// Nach safeJsonParse der Row:
var BILD_TYPEN = ['hotspot', 'bildbeschriftung', 'dragdrop_bild']
if (BILD_TYPEN.indexOf(frage.typ) >= 0 && !frage.bild) {
  var bild = mq_bildQuelleAus_(frage)
  if (bild) frage.bild = bild
}
if (frage.typ === 'pdf' && !frage.pdf) {
  var pdf = mq_pdfQuelleAus_(frage)
  if (pdf) frage.pdf = pdf
}
if (frage.anhaenge && Array.isArray(frage.anhaenge)) {
  frage.anhaenge = frage.anhaenge.map(function(a) {
    if (a && a.quelle) return a
    var q = mq_anhangQuelleAus_(a)
    if (q) {
      var kopie = Object.assign({}, a)
      kopie.quelle = q
      return kopie
    }
    return a
  })
}
```

- [ ] **Step 12.4: Save-Pfad akzeptiert beides**

Wo `JSON.stringify(frage.anhaenge || [])` (Z.2947, 3147, 4281): keine Änderung nötig, da neue Felder einfach im Objekt bleiben. Wichtig: Keine alten Felder überschreiben, falls Frontend nur neue schickt — Backend ergänzt sie aus `frage.bild`/`frage.pdf` falls fehlend:

```js
function mq_sichereAltFelderAb_(frage) {
  if (frage.bild) {
    if (frage.bild.typ === 'drive') frage.bildDriveFileId = frage.bildDriveFileId || frage.bild.driveFileId
    // bildUrl nur ableiten wenn komplett leer, sonst nicht überschreiben
  }
  // analog für pdf
  return frage
}
```

- [ ] **Step 12.5: One-Shot-Migrator mit Dry-Run**

```js
/**
 * Admin-Endpoint: migriert alle Fragen eines Sheets auf MediaQuelle.
 * @param {string} email — Admin-E-Mail (validiert)
 * @param {string} sheetId — Optional: nur ein einzelnes Sheet; wenn leer: alle
 * @param {boolean} dryRun — Wenn true: nur Summary, kein Schreiben
 * @returns {{success:boolean, summary:Array, updated:number, errors:Array}}
 */
function migrierFragenZuMediaQuelle_(email, sheetId, dryRun) {
  if (!istAdmin_(email)) return { success: false, error: 'Nur Admin' }
  var summary = []
  var updated = 0
  var errors = []
  var sheets = sheetId ? [openSheetById_(sheetId)] : holeAlleFragenSheets_()
  sheets.forEach(function(sheet) {
    try {
      var range = sheet.getDataRange()
      var values = range.getValues()
      var headers = values[0]
      var bildIdx = headers.indexOf('bild')
      var pdfIdx = headers.indexOf('pdf')
      // Falls Spalten fehlen: im dry-run hinzufügen, im echten Lauf addColumn
      // ...
      for (var r = 1; r < values.length; r++) {
        var row = {}
        headers.forEach(function(h, i) { row[h] = values[r][i] })
        var bild = mq_bildQuelleAus_(row)
        var pdf = mq_pdfQuelleAus_(row)
        if (bild && bildIdx >= 0) {
          if (!dryRun) sheet.getRange(r + 1, bildIdx + 1).setValue(JSON.stringify(bild))
          summary.push({ sheet: sheet.getName(), row: r + 1, feld: 'bild', typ: bild.typ })
          updated++
        }
        if (pdf && pdfIdx >= 0) {
          if (!dryRun) sheet.getRange(r + 1, pdfIdx + 1).setValue(JSON.stringify(pdf))
          summary.push({ sheet: sheet.getName(), row: r + 1, feld: 'pdf', typ: pdf.typ })
          updated++
        }
      }
    } catch (e) {
      errors.push({ sheet: sheet.getName(), error: e.toString() })
    }
  })
  return { success: true, dryRun: !!dryRun, updated: updated, summary: summary.slice(0, 50), totalSummary: summary.length, errors: errors }
}

// doPost-Routing:
// aktion === 'admin:migrierMediaQuelle'
//   → jsonResponse(migrierFragenZuMediaQuelle_(body.email, body.sheetId, body.dryRun))
```

- [ ] **Step 12.6: Apps-Script deploy**

User-Schritt:
1. Apps-Script Editor öffnen
2. Alten `apps-script-code.js` durch neuen ersetzen
3. Neue Bereitstellung erstellen
4. `.env.local` VITE_APPS_SCRIPT_URL aktualisieren (falls neue Deployment-URL)

- [ ] **Step 12.7: Dry-Run auf einem Sheet**

User triggert via Admin-Panel oder Apps-Script-Editor:
```js
migrierFragenZuMediaQuelle_('admin@...', 'ein-einziges-sheet-id', true)
```

Erwartet: `summary`-Liste mit den Änderungen. User reviewt die ersten 20 Einträge — erkennen alle Migrator-Resultate Sinn machen?

- [ ] **Step 12.8: Echte Migration auf einem Sheet**

```js
migrierFragenZuMediaQuelle_('admin@...', 'ein-einziges-sheet-id', false)
```

Frontend-Verifikation: Lade eine Frage aus diesem Sheet im LP-Editor → öffnet ohne Crash, zeigt korrektes Bild/PDF. SuS-Render: Lädt die gleiche Frage im Übungs-Flow. Keine Regression.

- [ ] **Step 12.9: Rollout auf alle Sheets**

```js
migrierFragenZuMediaQuelle_('admin@...', null, false)
```

- [ ] **Step 12.10: Commit**

```bash
git add ExamLab/apps-script-code.js
git commit -m "ExamLab: Apps-Script MediaQuelle Migrator + Load/Save (dry-run fähig)"
```

---

## Phase 6 — Cleanup (frühestens +2 Wochen nach Phase 5)

**Cooling-Off-Periode:** Nach erfolgreichem Rollout in Phase 5 **2 Wochen warten**, in denen Dual-Write (alte + neue Felder) aktiv ist. Erst wenn keine Bugs in der Media-Auflösung auftreten und alle neuen Schreibvorgänge konsistente `bild`/`pdf`/`quelle`-Felder haben, wird Phase 6 gestartet.

**Risiko (M7 aus Review):** Wenn Phase 6 stoppt Alt-Felder zu schreiben und ein Bug in MediaQuelle-Serialisierung unentdeckt bleibt, werden neue Daten unwiderruflich korrumpiert. Die Cooling-Off + Pinning-Tests reduzieren das Risiko.

### Task 13: Alte Felder entfernen + Pflichtfelder einführen

**Files:**
- Modify: `packages/shared/src/types/fragen.ts` — Alt-Felder entfernen
- Modify: `packages/shared/src/editor/fragenFactory.ts` — Alt-Felder-Schreiben entfernen
- Modify: Alle Konsumenten, die noch `?? bildQuelleAus(...)` als Fallback nutzen
- Modify: `ExamLab/apps-script-code.js` — Save schreibt nur noch neue Felder
- Modify: `packages/shared/src/editor/utils/mediaUtils.ts` — mimeType-Signatur zurück auf `string` (mediaUtils-Hotfix aus Commit `c7fe4c9` rückgängig)

- [ ] **Step 13.1: fragen.ts — Alt-Felder entfernen**

```ts
// Vorher:
bildUrl?: string  /** @deprecated */
bildDriveFileId?: string  /** @deprecated */
bild?: MediaQuelle

// Nachher:
bild: MediaQuelle  // Pflicht
```

Analog für alle betroffenen Types.

- [ ] **Step 13.2: TSC zeigt alle verbleibenden Konsumenten**

```bash
cd ExamLab && npx tsc -b 2>&1 | tee /tmp/tsc-errors.txt
wc -l /tmp/tsc-errors.txt
```

Jeder Error → eine Fundstelle die zu migrieren ist.

- [ ] **Step 13.3: Alle Konsumenten migrieren**

Verwende die Call-Site-Liste aus Task 0 als Checklist.

- [ ] **Step 13.4: Migrator-Fallbacks entfernen**

In SuS-Fragetypen + KorrekturFrageVollansicht: `frage.bild ?? bildQuelleAus(frage)` wird einfach `frage.bild`. Der Migrator bleibt (für Apps-Script-Backward-Compat), wird aber im Frontend-Render-Pfad nicht mehr aufgerufen.

- [ ] **Step 13.5: mediaUtils.ts zurück auf strenge Signatur**

```ts
// Vorher (Hotfix c7fe4c9):
export function istBild(mimeType: string | undefined | null): boolean {
  return !!mimeType && mimeType.startsWith('image/')
}
// Nachher (strikter Typ):
export function istBild(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}
```

- [ ] **Step 13.6: Apps-Script Save — keine Alt-Felder mehr**

In `apps-script-code.js` den `mq_sichereAltFelderAb_`-Aufruf entfernen. Neue Schreibvorgänge persistieren ausschliesslich `bild`/`pdf`/`quelle`-JSON.

**Optional:** One-Shot-Cleanup-Migrator, der Alt-Spalten in allen Sheets leert. Nur nach expliziter User-Freigabe!

- [ ] **Step 13.7: TSC + Vitest + Build + Staging-E2E**

```bash
cd ExamLab && npx tsc -b && npx vitest run && npm run build
```

Alle Bildfragen + PDF + Anhänge in LP-Editor + SuS-Render + Korrektur manuell prüfen.

- [ ] **Step 13.8: Commit**

```bash
git commit -m "ExamLab: Alt-Felder entfernt — MediaQuelle ist Single-Source-of-Truth"
```

---

## Branching-Strategie (explizit)

- **Ein Feature-Branch pro Phase:** `feature/mediaquelle-phase-1`, `-phase-2`, etc.
- Jede Phase wird zuerst auf `preview` gepusht → Staging-URL testen → nur bei Grün auf `main` gemergt.
- **Preview-Force-Push-Regel** (memory: `feedback_preview_forcepush.md`):
  ```bash
  git fetch origin preview
  git log origin/preview ^HEAD --oneline   # MUSS leer sein, sonst WIP!
  # Wenn nicht leer: Feature-Branch auf origin/preview rebasen, NICHT auf main.
  git push --force-with-lease origin HEAD:preview
  ```
- **Phase 5 (Apps-Script) darf NICHT während laufender Prüfungen deployed werden** (Regel `deployment-workflow.md`).

---

## Verifikations-Matrix

| Bereich | Phase 1-2 | Phase 3 | Phase 4 | Phase 5 | Phase 6 |
|---|---|---|---|---|---|
| TS + vitest grün | ✓ | ✓ | ✓ | ✓ (Frontend) | ✓ (streng) |
| LP-Editor: neue Bildfrage erstellen | — | — | ✓ | ✓ | ✓ |
| LP-Editor: Pool-importierte Bildfrage öffnen | — | — | ✓ | ✓ | ✓ |
| LP-Editor: PDF-Frage mit `pdfUrl` öffnen | — | — | ✓ | ✓ | ✓ |
| LP-Editor: Anhang ohne `mimeType` | — | — | ✓ | ✓ | ✓ (strikt) |
| SuS-Render: Bildfragen ohne Crash | — | — | ✓ | ✓ | ✓ |
| SuS-Render: PDF-Frage mit Pool-PDF | — | — | ✓ | ✓ | ✓ |
| PDF-Annotation-Canvas (pdf.js) | — | — | ✓ | ✓ | ✓ |
| LP-Korrektur: alle Medien sichtbar | — | — | ✓ | ✓ | ✓ |
| Apps-Script Dry-Run | — | — | — | ✓ | — |
| Apps-Script One-Sheet-Migration | — | — | — | ✓ | — |
| Apps-Script Full-Migration | — | — | — | ✓ | — |
| Cooling-Off 2 Wochen abgewartet | — | — | — | — | ✓ |

---

## Risiken & Mitigationen

| Risiko | Impact | Mitigation |
|---|---|---|
| Apps-Script-Migrator überschreibt Daten falsch | Hoch | Dry-Run + Backup-Sheet vor Migration + One-Sheet-First + Dual-Write in Phase 5. Rollback = Backup-Sheet zurückspielen. |
| Neue Save-Logik in Phase 6 hat Bug, korrumpiert Daten | Hoch | Cooling-Off 2 Wochen mit Dual-Write; Pinning-Tests in Tasks 8–11 sichern Format. |
| Drive-URLs werden fälschlich als App/Pool klassifiziert | Mittel | Migrator prüft Drive-Muster zuerst, vor relative-Pfad-Heuristik. Test deckt ab. |
| Alte/neue Felder inkonsistent | Mittel | Editor-Read nutzt `?? Migrator(frage)`-Fallback bis Phase 6. Erstmalige Speicherung stellt Konsistenz her. |
| Datengrössen-Explosion (Alt + Neu parallel) | Niedrig | `bild`/`pdf`-Felder < 200 Bytes JSON. Phase 6 entfernt Alt-Spalten. |
| Browser-Cache nach Deploy | Mittel | `lazyMitRetry` + SW-Unregister + Hard-Reload empfehlen (Pattern `.claude/rules/deployment-workflow.md` §Post-Deploy-Cache). |
| pdf.js-Umstellung auf arrayBuffer bricht Annotation-Canvas | Mittel | Pinning-Test für PDFFrage (Task 10.1) + explizite arrayBuffer-Variante in Task 4 vor Tasks 9–10. |
| Fragetyp mit Media, den ich hier übersehen habe | Mittel | Task 0 Grep-Inventur + Phase 6 TSC-Errors zeigen Lücken. |

---

## Ausführungs-Hinweise

- **Pro Phase ein eigener Feature-Branch**. Keine Phase direkt auf `main`.
- **Jeder Commit** muss TSC + Vitest grün lassen.
- **HANDOFF.md** nach jeder Phase aktualisieren (kurzer Bullet-Point).
- **Wenn eine Phase >2× geschätzte Zeit braucht:** Rücksprache mit User. Möglicherweise fehlen Sub-Tasks.
- **Regel [echte_logins]:** Browser-Tests IMMER mit echten Google-Logins auf Staging-URL.
- **Keine Apps-Script-Deployments während laufender Prüfungen** (Regel `deployment-workflow.md`).

---

## Call-Site-Inventar (siehe `2026-04-19-mediaquelle-callsites.txt`)

Die Liste wird in Task 0 generiert und ist **die** kanonische Quelle, welche Dateien migriert werden müssen. In Phase 6 wird jede Zeile abgehakt, wenn der jeweilige Konsument auf `MediaQuelle` umgestellt ist.
