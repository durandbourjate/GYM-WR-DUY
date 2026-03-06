# Design System

## Farbcode (verbindlich für alle Projekte)

| Fachbereich | Tailwind | Hex | CSS Custom Property |
|-------------|----------|-----|---------------------|
| VWL | orange-500 | #f97316 | --c-vwl |
| BWL | blue-500 | #3b82f6 | --c-bwl |
| Recht | green-500 | #22c55e | --c-recht |
| Informatik | gray-500 | #6b7280 | --c-in |

Farb-Varianten (bg, fg, border) immer über `generateColorVariants()` erzeugen, nie manuell.
Neue Fachbereich-Farben: Nutzer definiert sie im SubjectsEditor, nicht hardcoden.

## Tailwind-Patterns

- Layout: `flex`, `grid`, `gap-*` (kein float, kein margin-hack)
- Spacing: Tailwind-Skala verwenden (`p-2`, `gap-3`), keine px-Werte in className
- Responsive: `sm:`, `md:`, `lg:` Prefixe wo nötig, Mobile-First
- Dark Mode: `dark:` Prefix, Farben über CSS Custom Properties die auf Theme reagieren

## Light/Dark Mode

Beide Projekte unterstützen Light/Dark:
- Unterrichtsplaner: `useTheme` Hook, `dark:` Tailwind-Klassen
- Übungspools: `.theme-toggle` Button, `localStorage`-basiert, CSS Custom Properties

Neue UI-Elemente MÜSSEN beide Modi unterstützen. Nie nur für einen Modus stylen.

## Konsistenz zwischen Projekten

- Gleiche Fachbereich-Farben in Unterrichtsplaner und Übungspools
- Gleiches Farbschema wie in LearningView (Wiedererkennungswert für Schüler)
- pool.html nutzt `COLOR_SCHEMES` mit `--c-primary` basierend auf `POOL_META.fach`

## Icons & UI-Elemente

- Unterrichtsplaner: Lucide React Icons (konsistent verwenden, nicht mischen)
- Übungspools: Emoji oder Unicode-Symbole (kein Icon-Framework geladen)
- Buttons: Immer mit `title`-Attribut/Tooltip für Barrierefreiheit
- Interaktive Elemente: Mindestgrösse 44×44px (Touch-Target)
