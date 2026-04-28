# Bundle J Migrations-Session — Protokoll

Schritt-für-Schritt-Bedienung. Jeder Schritt einzeln ausführen und Output prüfen,
bevor der nächste startet.

## Pre-Run-Checklist

- [ ] Apps-Script-Bereitstellung enthält **Bundle J Phase 9.0** (`batchUpdateFragenMigration`
      mit `felder`-Patch). Verifikation: GAS-Editor → `testBundleJMigrationFelder` ausführen → erwartet `OK`.
- [ ] Apps-Script-Bereitstellung enthält **Phase 4 Privacy-Fix** (`korrekteLabels` in `LOESUNGS_FELDER_`).
      Verifikation: `testDragDropMultiZonePrivacy` → `OK`.
- [ ] Frontend-Deploy enthält Phase 1-8 (Branch `feature/bundle-j-dragdrop-multi-zone`).
- [ ] **Sheet-Backup** gemacht: Datei → Kopie erstellen → benannt `Backup-vor-Bundle-J-YYYY-MM-DD`.
- [ ] Aktive Üben-Sessions geprüft (Apps-Script-Editor → Sheet `Übungssessions`).
- [ ] Aktive Prüfungen? Wenn ja: Migration verschieben.
- [ ] Env-Variablen gesetzt: `APPS_SCRIPT_URL`, `MIGRATION_EMAIL` (Admin-LP).

## Schritt 1: Dump

```bash
cd ExamLab/scripts/migrate-dragdrop-multi-zone
node dump.mjs
```

Output prüfen:
- `Total dragdrop_bild: <n>` entspricht der Audit-Erwartung (S159: 28 Fragen).
- Pro Fachbereich plausibel (BWL/Recht/VWL).
- `Multi-Zone-Bug-Verdacht: <m>` notieren — diese Fragen brauchen LP-Re-Edit.

## Schritt 2: Migrate

```bash
node migrate.mjs
```

Output prüfen:
- `migriert: <k>` ≤ Total dragdrop_bild (alle bereits-neuen + nicht-DnD übersprungen).
- Stichprobe: `head -100 migriert.json` lesen — `korrekteLabels: [<wert>]`,
  `labels[i].id` deterministisch (kurz, base32).

## Schritt 3: Stichprobe-Upload (5-10 Fragen)

Erste 5 IDs aus migriert.json picken:

```bash
jq -r '.[0:5] | .[].id' migriert.json
```

Diese IDs als Filter ans upload.mjs:

```bash
node upload.mjs --ids=<id1>,<id2>,<id3>,<id4>,<id5>
```

Erwartet: `aktualisiert=5, nichtGefunden=0`.

## Schritt 4: Verifikation Stichprobe (im Browser, echte Logins)

Pro Stichprobe-Frage:
- LP-Editor öffnen → Frage hat Chip-Input pro Zone (`korrekteLabels`-Editor).
- LP-Editor → Pool zeigt Tokens mit Stack-Counter.
- LP-Editor → `pruefungstauglich` ist auf falsch (rotes Banner / Toggle).
- SuS-Üben (Test-User wr.test@stud) → Frage rendert mit Stack-Counter, tap-to-place
  funktioniert, Korrektur akzeptiert beide Synonyme bei Multi-Label.

Bei Fehler: Fix → migrate.mjs neu → upload.mjs --ids=... neu (idempotent).

## Schritt 5: Full-Run

Wenn Stichprobe OK:

```bash
node upload.mjs
```

Output: `TOTAL: <n> aktualisiert, 0 nicht gefunden`.
Bei nichtGefunden > 0: Exit-Code 2 — IDs prüfen (umbenannt? Frage gelöscht?).

## Schritt 6: Re-Dump-Verifikation

```bash
mv fragen.json fragen-vor.json
mv migriert.json migriert-vor.json
node dump.mjs
```

Vergleich (alle Fragen sollten jetzt `korrekteLabels` haben + `labels` als Array
von `{id,text}`):

```bash
node migrate.mjs   # erwartet: migriert: 0
```

`migriert: 0` heisst Migration komplett. Wenn > 0: hängengebliebene Fragen
(Apps-Script-Timeout, Sheet-Lock) — `node upload.mjs` nochmal laufen lassen.

## Schritt 7: User-Tasks-Liste an LP

Multi-Zone-Bug-Fragen (siehe Schritt 1) brauchen LP-Re-Edit:
Pool-Tokens für Multi-Zone-Token-Anzahl ergänzen (sonst stimmt der Stack-Counter nicht).

IDs in `bundle-j-multi-zone-bug-ids.txt` schreiben + LP per Mail/HANDOFF zustellen.
