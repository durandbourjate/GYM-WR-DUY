// src/services/gruppenCache.ts
import type { Gruppe, Mitglied } from '../types/ueben/gruppen'

const IDB_NAME = 'examlab-gruppen-cache'
const IDB_VERSION = 1
const STORE_GRUPPEN = 'gruppen'
const STORE_MITGLIEDER = 'mitglieder'  // Map<gruppeId, Mitglied[]> via key=gruppeId
const STORE_META = 'meta'

// Cache-Gültigkeit: 24 h (Stammdaten ändern sich selten; LP hat Refresh-Button für Sofort-Invalidierung)
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000

interface CacheMeta {
  key: string
  timestamp: string
  count: number
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, IDB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_GRUPPEN)) db.createObjectStore(STORE_GRUPPEN)
      if (!db.objectStoreNames.contains(STORE_MITGLIEDER)) db.createObjectStore(STORE_MITGLIEDER)
      if (!db.objectStoreNames.contains(STORE_META)) db.createObjectStore(STORE_META)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/** Cached Gruppen lesen. null bei leerem oder abgelaufenem Cache. */
export async function getCachedGruppen(): Promise<Gruppe[] | null> {
  try {
    const db = await openDB()
    const tx = db.transaction([STORE_GRUPPEN, STORE_META], 'readonly')
    const meta = await idbGet<CacheMeta>(tx.objectStore(STORE_META), 'gruppen')
    if (!meta || !isCacheValid(meta)) return null
    const data = await idbGet<Gruppe[]>(tx.objectStore(STORE_GRUPPEN), 'data')
    return data || null
  } catch {
    return null
  }
}

/** Gruppen in Cache schreiben. Fehler werden silent ignoriert. */
export async function setCachedGruppen(gruppen: Gruppe[]): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction([STORE_GRUPPEN, STORE_META], 'readwrite')
    tx.objectStore(STORE_GRUPPEN).put(gruppen, 'data')
    tx.objectStore(STORE_META).put({
      key: 'gruppen',
      timestamp: new Date().toISOString(),
      count: gruppen.length,
    } satisfies CacheMeta, 'gruppen')
  } catch {
    // Silent — App funktioniert ohne Cache
  }
}

/** Cached Mitglieder für eine Gruppe lesen. null bei leerem oder abgelaufenem Cache. */
export async function getCachedMitglieder(gruppeId: string): Promise<Mitglied[] | null> {
  try {
    const db = await openDB()
    const tx = db.transaction([STORE_MITGLIEDER, STORE_META], 'readonly')
    const metaKey = `mitglieder:${gruppeId}`
    const meta = await idbGet<CacheMeta>(tx.objectStore(STORE_META), metaKey)
    if (!meta || !isCacheValid(meta)) return null
    const data = await idbGet<Mitglied[]>(tx.objectStore(STORE_MITGLIEDER), gruppeId)
    return data || null
  } catch {
    return null
  }
}

/** Mitglieder einer Gruppe in Cache schreiben. Fehler werden silent ignoriert. */
export async function setCachedMitglieder(gruppeId: string, mitglieder: Mitglied[]): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction([STORE_MITGLIEDER, STORE_META], 'readwrite')
    tx.objectStore(STORE_MITGLIEDER).put(mitglieder, gruppeId)
    tx.objectStore(STORE_META).put({
      key: `mitglieder:${gruppeId}`,
      timestamp: new Date().toISOString(),
      count: mitglieder.length,
    } satisfies CacheMeta, `mitglieder:${gruppeId}`)
  } catch {
    // Silent — App funktioniert ohne Cache
  }
}

/** Komplette Gruppen-IDB leeren (Logout). tx.oncomplete-await wegen Hard-Nav (S149). */
export async function clearGruppenCache(): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction([STORE_GRUPPEN, STORE_MITGLIEDER, STORE_META], 'readwrite')
    tx.objectStore(STORE_GRUPPEN).clear()
    tx.objectStore(STORE_MITGLIEDER).clear()
    tx.objectStore(STORE_META).clear()
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error ?? new Error('IDB transaction aborted'))
    })
  } catch {
    // Silent
  }
}

// --- Helpers ---

function isCacheValid(meta: CacheMeta): boolean {
  const age = Date.now() - new Date(meta.timestamp).getTime()
  return age < CACHE_MAX_AGE_MS
}

function idbGet<T>(store: IDBObjectStore, key: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const req = store.get(key)
    req.onsuccess = () => resolve(req.result as T | undefined)
    req.onerror = () => reject(req.error)
  })
}
