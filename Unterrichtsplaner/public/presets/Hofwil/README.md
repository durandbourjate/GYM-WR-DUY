# Presets – Importdateien für den Unterrichtsplaner

Vorgefertigte JSON-Dateien zum Import in die Einstellungen des Unterrichtsplaners.
Lehrpersonen am Gymnasium Hofwil können diese Dateien herunterladen und über die
jeweilige Import-Funktion (📥) in den Einstellungen laden.

## Dateien

| Datei | Rubrik | Beschreibung |
|-------|--------|--------------|
| `ferien_hofwil_2526.json` | Ferien | Schulferien Kt. Bern SJ 2025/26 |
| `ferien_hofwil_2627.json` | Ferien | Schulferien Kt. Bern SJ 2026/27 |
| `sonderwochen_hofwil_2526.json` | Sonderwochen | IW, Prüfungswochen, Events SJ 25/26 |
| `beurteilungsregeln_hofwil.json` | Beurteilungsregeln | Notenanzahl-Vorgaben Gym Hofwil |
| `fachbereiche_wr.json` | Fachbereiche | VWL/BWL/Recht (SF W&R Farbschema) |
| `lehrplanziele_sf_wr_lp17.json` | Lehrplanziele | LP17 SF W&R (Recht, BWL, VWL) |
| `stoffverteilung_sf_wr_duy.json` | Stoffverteilung | Gewichtung nach Semester (DUY) |

## Anleitung

1. Datei herunterladen (Rechtsklick → Speichern unter)
2. Im Unterrichtsplaner: Einstellungen öffnen (⚙)
3. Bei der gewünschten Rubrik auf 📥 Import klicken
4. Heruntergeladene JSON-Datei auswählen
5. Import bestätigen

Die Dateien **ergänzen** bestehende Einträge (Ferien, Sonderwochen, Regeln)
oder **ersetzen** sie (Fachbereiche via Sammlung-Laden).

## Formate

Alle Dateien sind valides JSON und folgen den TypeScript-Interfaces in
`src/store/settingsStore.ts`. Die `id`-Felder werden beim Import automatisch generiert.
