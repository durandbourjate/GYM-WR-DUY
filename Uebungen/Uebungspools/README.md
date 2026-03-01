# Übungspools

Interaktive Fragesammlungen für den W&R-Unterricht. Jeder Pool ist eine JavaScript-Datei mit strukturierten Fragen, die in einer gemeinsamen Webapp (`pool.html`) laufen.

**Live:** https://durandbourjate.github.io/GYM-WR-DUY/Uebungen/Uebungspools/

## Architektur

```
pool.html              ← Gemeinsame Webapp (Fragelogik, UI, Fortschritt)
config/
  vwl_bip.js           ← Ein Pool = eine JS-Datei mit Fragen
  vwl_geld.js
  recht_or_at.js
  bwl_fibu.js
  ...
index.html             ← Übersichtsseite aller Pools
```

## Pools (27 Stück)

| Fachbereich | Pools |
|-------------|-------|
| **VWL** (11) | Bedürfnisse, Menschenbild, Markteffizienz, BIP, Konjunktur, Wachstum, Geld, Arbeitslosigkeit, Sozialpolitik, Steuern, Staatsverschuldung |
| **Recht** (10) | Einführung, Einleitungsartikel, Grundrechte, Personenrecht, Sachenrecht, OR AT, Arbeitsrecht, Mietrecht, Strafrecht, Prozessrecht |
| **BWL** (5) | Einführung, Unternehmensmodell, Strategie/Führung, Marketing, Fibu |
| **Informatik** (1) | Kryptographie |

## Fragetypen

- Multiple Choice (single/multi)
- Lückentext
- Zuordnung (Drag & Drop)
- Reihenfolge
- Wahr/Falsch
- Kurzantwort (mit Regex-Matching)

## LearningView-Integration

- **Als Weblink:** `pool.html?config=vwl_bip` — öffnet direkt den Pool
- **Als iFrame:** Aufgabentyp «Interaktiv extern» — sendet Score via `postMessage` (xAPI)
- **Deep-Link:** `pool.html?config=vwl_bip&topic=Nominales+vs+reales+BIP` — springt zu einem Thema

## Neuen Pool erstellen

Eine neue `.js`-Datei in `config/` anlegen, die das `poolConfig`-Objekt exportiert. Struktur siehe bestehende Pools oder den Claude-Skill «uebungspool».
