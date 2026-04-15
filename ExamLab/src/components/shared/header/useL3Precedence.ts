import { useEffect } from 'react'

interface Input {
  urlWert: string | null
  storageKey: string
  aufRedirect: (to: string, opts?: { replace?: boolean }) => void
  basePath: string
}

export function useL3Precedence({ urlWert, storageKey, aufRedirect, basePath }: Input): string | null {
  useEffect(() => {
    if (urlWert) {
      try {
        localStorage.setItem(storageKey, urlWert)
      } catch {
        /* ignore quota */
      }
      return
    }
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) aufRedirect(`${basePath}/kurs/${stored}`, { replace: true })
    } catch {
      /* ignore */
    }
  }, [urlWert, storageKey, aufRedirect, basePath])

  return urlWert
}
