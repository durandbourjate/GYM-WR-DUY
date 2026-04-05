// Dual-Build: VITE_APP_MODE bestimmt ob Prüfungs- oder Übungsmodus gebaut wird
// Default: 'pruefung' (bestehendes Verhalten)
export type AppMode = 'pruefung' | 'lernen'
export const APP_MODE: AppMode = (import.meta.env.VITE_APP_MODE as AppMode) || 'pruefung'
export const istPruefung = APP_MODE === 'pruefung'
export const istLernen = APP_MODE === 'lernen'
