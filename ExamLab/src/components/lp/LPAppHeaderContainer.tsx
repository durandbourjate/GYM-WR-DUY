// ExamLab/src/components/lp/LPAppHeaderContainer.tsx
//
// Thin container: liest aus bestehenden Stores/Hooks und reicht Props an AppHeader weiter.
// Enthält keine eigene Logik — nur Datenmapping.
//
// Wird in Task 2.2 hinter einem Feature-Flag in die LP-Seiten eingehängt;
// bis dahin wird LPHeader.tsx weiterhin verwendet.

import type React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { useTabKaskadeConfigLP } from '../shared/header/useTabKaskadeConfig.lp'
import { useGlobalSucheLP } from '../../hooks/useGlobalSucheLP'
import { AppHeader } from '../shared/header/AppHeader'

interface Props {
  onHilfe: () => void
  onFeedback: () => void
  onEinstellungen: () => void
  // Detail-Modus pass-through
  onZurueck?: () => void
  breadcrumbs?: { label: string; aktion?: () => void }[]
  aktionsButtons?: React.ReactNode
  statusText?: string
  untertitel?: string
}

export function LPAppHeaderContainer({ onHilfe, onFeedback, onEinstellungen, onZurueck, breadcrumbs, aktionsButtons, statusText, untertitel }: Props) {
  const abmelden = useAuthStore((s) => s.abmelden)
  // AuthUser hat .name (Anzeigename), .vorname, .nachname, .email — .name ist immer befüllt.
  const benutzerName = useAuthStore((s) => s.user?.name ?? 'Lehrperson')

  // Theme: useThemeStore (Zustand-Store mit Persistenz) — identisches Pattern wie ThemeToggle.tsx.
  const toggleMode = useThemeStore((s) => s.toggleMode)
  const mode = useThemeStore((s) => s.mode)
  const istAktuellDunkel =
    mode === 'dark' ||
    (mode === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  const theme: 'light' | 'dark' = istAktuellDunkel ? 'dark' : 'light'

  const navigate = useNavigate()
  const [suchen, setSuchen] = useState('')

  // Kaskaden-Konfiguration aus Route — leere Arrays sind okay für diese Phase.
  // Echte Prüfungs-/Kurs-Daten werden in einem späteren Schritt angebunden.
  const kaskadeConfig = useTabKaskadeConfigLP({
    kurse: [],
    pruefungen: [],
    aktivePruefungen: [],
  })

  // Globale Suche — Prüfungen und Kurse noch nicht angebunden (stubs im Hook).
  const sucheErgebnis = useGlobalSucheLP(
    suchen,
    {
      l1: kaskadeConfig.aktivL1 ?? null,
      l2: kaskadeConfig.aktivL2 ?? null,
      l3: null,
    },
    (path) => navigate(path),
  )

  return (
    <AppHeader
      rolle="lp"
      benutzerName={benutzerName}
      theme={theme}
      onThemeToggle={toggleMode}
      onHilfe={onHilfe}
      onFeedback={onFeedback}
      onAbmelden={abmelden}
      onEinstellungen={onEinstellungen}
      kaskadeConfig={kaskadeConfig}
      suchen={suchen}
      onSuchen={setSuchen}
      sucheErgebnis={sucheErgebnis}
      onZurueck={onZurueck}
      breadcrumbs={breadcrumbs}
      aktionsButtons={aktionsButtons}
      statusText={statusText}
      untertitel={untertitel}
    />
  )
}
