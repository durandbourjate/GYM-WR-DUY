# Lückentext-Antworten-Migration — Design Spec

**Status:** Draft (Spec erstellt 24.04.2026 Ende S142) · **Review:** ausstehend

## Problem

Bei der Pool-Import-Generierung via KI (historische Sessions) wurden
Lückentextfragen mit folgenden Mängeln erzeugt:

1. **Platzhalter-Syntax `{N}` statt kanonisches `{{N}}`** — vom LP-Editor
   bisher nicht als Lücke erkannt, vom SuS-Renderer schon (Mount-Migration in
   S142 Phase 1 behebt das Editor-seitig).
2. **Leere `korrekteAntworten: []`** — SuS-Antworten werden immer als falsch
   bewertet, unabhängig vom Input.
3. **Keine `dropdownOptionen`** — Antwort-Eingabe ist Freitext, Autokorrektur
   ist empfindlich auf Synonyme / Tippfehler / Schreibvarianten.

Scope wird nach Phase-2-Scan klar (Apps-Script-Funktion
`zaehleLeereLueckentextAntworten()` zählt betroffene Fragen pro Fachbereich).

Konkretes Beispiel (S142): Frage `5b8e11b4-afd9-4e98-bf8c-e1c55d0a63c6`
("Produktivität = {0} (Menge) / {1} (Menge)") hatte 2 Lücken mit IDs
`luecke-0`/`luecke-1` und leeren `korrekteAntworten`.

## Ziel

Alle betroffenen Lückentextfragen mittels KI befüllen:

- **korrekteAntworten[]**: Hauptantwort + 2–3 Synonyme / Schreibvarianten
  (Schweizer vs. deutsche Varianten, Kurz/Langform). Analog zum
  `generiereLuecken`-KI-Prompt der in S138 ergänzt wurde.
- **dropdownOptionen[]** (*optional, abhängig von User-Entscheidung*):
  Korrekte Antwort + 2–3 **realistische Distraktoren**. Distraktoren dürfen
  nicht durch Ausschluss die richtige Antwort verraten — also Begriffe aus
  demselben semantischen Feld (z.B. bei "Produktivität = Output / Input":
  Distraktoren wie "Wert", "Kosten", "Einkommen" statt "Banane", "Auto").

## Scope-Entscheidung (nach Phase-2-Scan durch User)

**Variante A (Minimal):** Nur Fragen mit mindestens einer leeren
`korrekteAntworten` migrieren.
- Vorteil: kleiner Batch, Rückwärtskompatibilität
- Nachteil: bestehende Lückentextfragen ohne Synonyme / Dropdown bleiben
  empfindlich auf Tippfehler

**Variante B (Umfassend):** Alle Lückentextfragen erweitern — korrekteAntworten
um 2–3 Varianten ergänzen, Dropdown-Optionen generieren.
- Vorteil: einheitliche UX, weniger Falsch-Bewertung bei Tippfehlern
- Nachteil: Lerneffekt des freien Eintippens geht verloren (Dropdown =
  leichter), grosser Batch

**Entscheidung:** User trifft sie nach Phase-2-Scan. Falls z.B. 80 % der
Lückentextfragen betroffen sind, lohnt sich sowieso Variante B. Falls nur
5 Fragen betroffen sind, reicht Variante A und Dropdown-Ergänzung erfolgt
manuell oder in eigener Session.

## Architektur (orientiert an C9 Phase 4)

Keine Anthropic-SDK-Dependency. Node-Skript ruft Claude Code via User-
Subscription (wie C9 migrate-teilerklaerungen).

**Komponenten:**
1. **Dump-Skript** (`scripts/migrate-lueckentext-antworten/dump.mjs`):
   lädt betroffene Lückentextfragen (inkl. `id`, `fachbereich`, `fragetext`,
   `textMitLuecken`, `luecken[]` mit IDs) aus Sheet via Apps-Script-Endpoint
   oder direkt-Export via User-Script.
2. **Prompt-Generator** (`generate-sN.mjs` oder `prompts.mjs`): pro Frage
   strukturierter Prompt mit:
   - Fragetext + Kontext (Fach, Thema, Bloom-Stufe)
   - textMitLuecken + Lücken-IDs
   - JSON-Schema für Response
3. **Claude-Invocation**: entweder (a) Claude Code via User manuell pro
   Batch oder (b) automatisiert via `claude` CLI (wenn verfügbar).
4. **Response-Normalizer** (`normalizer.mjs`): validiert JSON, filtert
   halluzinierte Lücken-IDs, dedupliziert korrekteAntworten.
5. **Review-Generator** (`review-generator.mjs`): baut Markdown-Dokument
   für User-Review (Stichprobe vor Full-Run).
6. **Upload-Skript** (`upload.mjs`): schreibt via neuem Apps-Script-
   Endpoint `batchUpdateLueckentextFragen` (oder erweitertem
   `batchUpdateFragenMigration`) zurück.
7. **Apps-Script-Endpoint**: neuer Partial-Update-Endpoint oder
   Erweiterung des bestehenden. Admin-only, token-geschützt, überschreibt
   NUR `luecken[].korrekteAntworten` und optional `luecken[].dropdownOptionen`.
   Alles andere unangetastet. Setzt `pruefungstauglich=false` bis User
   freigibt (wie C9 Phase 4).

## Prompt-Entwurf (pro Frage)

```
Du bist Experte für Wirtschaft & Recht auf Gymnasial-Niveau (Schweiz).
Ergänze bei dieser Lückentextfrage die akzeptablen Antworten pro Lücke:

Frage (Thema: {thema}, {bloom}):
{fragetext}

Text mit Lücken:
{textMitLuecken}

Lücken-IDs: {luecken-ids-list}

Liefere als JSON:
{
  "luecken": [
    {
      "id": "...",
      "korrekteAntworten": ["Hauptantwort", "Synonym", "alt. Schreibweise"],
      "dropdownOptionen": ["Korrekte", "Distraktor1", "Distraktor2", "Distraktor3"]
    }
  ]
}

Regeln:
- korrekteAntworten: 2-3 Varianten (Schweizer/deutsche Schreibweise,
  Kurz-/Langform, Synonyme). Umlaute beide Varianten (ae/ä).
- dropdownOptionen: 1 richtige + 2-3 realistische Distraktoren aus dem
  selben Thema. KEINE absurden / thematisch fremden Distraktoren, die
  per Ausschluss die korrekte Antwort erraten lassen. Keine Hinweise
  wie "nichts davon".
- Der User wählt aus Dropdown-Optionen, darum müssen alle plausibel sein.
```

## Workflow

1. **Phase 2 Scan durch User** (S142 abgeschlossen): Zahlen pro Fachbereich
2. **User-Entscheidung**: Variante A oder B
3. **Stichprobe** (10–15 Fragen): 3–5 pro Fachbereich, gemischt
4. **Review**: User liest Markdown, gibt Freigabe pro Frage oder Batch
5. **Full-Run**: nach Freigabe alle betroffenen Fragen
6. **Post-Migration**: alle migrierten Fragen bekommen
   `pruefungstauglich=false`, User prüft im LP-Editor und gibt frei

## Risiken + Mitigation

- **KI-Halluzination**: Distraktoren könnten faktisch korrekt sein →
  Response-Normalizer prüft, dass korrekteAntwort nicht in Distraktoren-
  Liste doppelt vorkommt. Review-Schritt fängt den Rest.
- **Lehrbuch-Kontext fehlt**: Claude weiss nicht welche Schreibweise das
  Lehrbuch verwendet → Review deckt das auf, User kann im Editor
  nachjustieren.
- **Zeitlicher Umfang**: analog C9 Phase 4 ca. 100 Fragen/Batch, mehrere
  Sessions falls >500 betroffen. Pro Session 1–2h.

## Offene Design-Fragen (für Plan-Runde)

1. Endpoint wiederverwenden (`batchUpdateFragenMigration`) oder neu
   (`batchUpdateLueckentextFragen`)? Ersteres ist kürzer, zweiteres
   sauberer (andere Validierung).
2. Dump-Quelle: Apps-Script-Endpoint oder direktes Sheet-Export via GAS-
   Script in eigene Tabelle? Letzteres spart Traffic.
3. `caseSensitive` ebenfalls setzen? Default false passt für die meisten
   Fragen, für Fachbegriffe evtl. true.
4. Wiederverwendbar für Zuordnung-Fragen mit ähnlichem Problem? Out-of-
   Scope für jetzt.

## Voraussetzungen für neue Session

- Phase 2 Scan-Zahlen liegen vor
- User-Entscheidung Variante A/B
- Apps-Script-Deploy-Fenster
- Google-Sheets-Backup der Fragenbank (wie bei C9 Phase 4)
