# ============================================================
# MUSTERLÖSUNG – Übung 6: Dynamische Texte mit Strings/f-Strings
# ============================================================
# f-Strings (formatierte Strings) erlauben es, Variablen direkt
# in einen Text einzufügen. Dazu setzt man ein f vor den String
# und schreibt Variablen in geschweifte Klammern {}.
# ============================================================


# ============================================================
# Teilaufgabe 1: Raumnamen dynamisch einsetzen
# ============================================================

# Ein Dictionary (dict) ist wie ein Nachschlagewerk:
# Zu jedem Schlüssel (key) gehört ein Wert (value).
# Hier: Raumnummer → Raumname
raum_namen = {
    1: "Startraum",
    31: "West-Ost-Korridor",
    32: "Süd-Nord-Korridor",
    101: "Büro Ost",
    102: "Lüftungsschacht-Raum",
    103: "Verbindungsraum",
    104: "Sackgasse",
    201: "Büro West",
    202: "Tresorraum"
}

# Mit raum_namen[nummer] holen wir den Namen zum Schlüssel
aktueller_raum = 32
print(f"Du befindest dich im {raum_namen[aktueller_raum]}.")
# Ausgabe: Du befindest dich im Süd-Nord-Korridor.

# Raum wechseln — der Text passt sich automatisch an!
aktueller_raum = 202
print(f"Du befindest dich im {raum_namen[aktueller_raum]}.")
# Ausgabe: Du befindest dich im Tresorraum.

aktueller_raum = 1
print(f"Du befindest dich im {raum_namen[aktueller_raum]}.")
# Ausgabe: Du befindest dich im Startraum.

print()


# ============================================================
# Teilaufgabe 2: Inventar-Anzeige
# ============================================================

print("=== Inventar-Anzeige ===")
print()

hat_papier = True
hat_taschenmesser = False
hat_sprengschnur = False

print("=== Inventar ===")

# Wir zählen die Gegenstände mit einer Zähler-Variable
gegenstaende = 0

# Für jeden Gegenstand: Wenn vorhanden → anzeigen und zählen
if hat_papier:
    print("- Blatt Papier und Bleistift")
    gegenstaende = gegenstaende + 1  # Zähler um 1 erhöhen

if hat_taschenmesser:
    print("- Taschenmesser mit Schraubenzieher")
    gegenstaende = gegenstaende + 1

if hat_sprengschnur:
    print("- Sprengschnur mit Stoppuhr")
    gegenstaende = gegenstaende + 1

# f-String für die Zusammenfassung
print(f"Total: {gegenstaende} Gegenstand/Gegenstände")
# Ausgabe: Total: 1 Gegenstand/Gegenstände

# Jetzt mit mehr Gegenständen testen:
print()
hat_taschenmesser = True
hat_sprengschnur = True

print("=== Inventar (nach Fund) ===")
gegenstaende = 0
if hat_papier:
    print("- Blatt Papier und Bleistift")
    gegenstaende = gegenstaende + 1
if hat_taschenmesser:
    print("- Taschenmesser mit Schraubenzieher")
    gegenstaende = gegenstaende + 1
if hat_sprengschnur:
    print("- Sprengschnur mit Stoppuhr")
    gegenstaende = gegenstaende + 1
print(f"Total: {gegenstaende} Gegenstand/Gegenstände")
# Ausgabe: Total: 3 Gegenstand/Gegenstände

print()


# ============================================================
# Teilaufgabe 3: Statuszeile
# ============================================================

print("=== Statuszeile ===")
print()

aktueller_raum = 102
hat_papier = True
hat_taschenmesser = True
hat_sprengschnur = False

# Raumname aus dem Dictionary holen
raum_name = raum_namen[aktueller_raum]

# Inventar als Emoji-Symbole zusammenbauen
# Wir starten mit einem leeren String und hängen Emojis an
inventar = ""
if hat_papier:
    inventar = inventar + "📄"       # String-Verkettung mit +
if hat_taschenmesser:
    inventar = inventar + "🔪"
if hat_sprengschnur:
    inventar = inventar + "💣"

# Wenn nichts im Inventar → "(leer)" anzeigen
if inventar == "":
    inventar = "(leer)"

# Alles in einer kompakten Statuszeile ausgeben
print(f"[Raum: {raum_name} | Inventar: {inventar}]")
# Ausgabe: [Raum: Lüftungsschacht-Raum | Inventar: 📄🔪]

# Noch ein Test mit anderem Zustand:
aktueller_raum = 1
hat_papier = False
hat_taschenmesser = False
hat_sprengschnur = False

raum_name = raum_namen[aktueller_raum]
inventar = ""
if hat_papier:
    inventar = inventar + "📄"
if hat_taschenmesser:
    inventar = inventar + "🔪"
if hat_sprengschnur:
    inventar = inventar + "💣"
if inventar == "":
    inventar = "(leer)"

print(f"[Raum: {raum_name} | Inventar: {inventar}]")
# Ausgabe: [Raum: Startraum | Inventar: (leer)]

print()


# ============================================================
# Teilaufgabe 4: Eingabe normalisieren
# ============================================================

print("=== Eingabe normalisieren ===")
print()

# .lower() → Grossbuchstaben werden zu Kleinbuchstaben
# .strip() → Leerzeichen am Anfang und Ende werden entfernt
# Diese Methoden können verkettet werden (Chaining).

eingabe = input("Wohin gehst du? ")

# Normalisierung: egal ob "Osten", "OSTEN", "  osten  " → "osten"
eingabe = eingabe.lower().strip()

if eingabe == "osten":
    print("Du gehst nach Osten.")
elif eingabe == "westen":
    print("Du gehst nach Westen.")
else:
    # f-String in der Fehlermeldung: zeigt dem Spieler, was er
    # eingegeben hat, damit er seinen Fehler erkennen kann
    print(f"'{eingabe}' ist keine gültige Richtung.")

# Teste mit: "Osten", "  osten  ", "OSTEN", "OsTeN"
# → Alle werden zu "osten" und funktionieren korrekt.
# Teste mit: "norden", "xyz"
# → Werden als ungültig erkannt.


# ============================================================
# ZUSAMMENFASSUNG FÜR SCHÜLER:
# ============================================================
# Was du gelernt hast:
# - f-Strings: f"Text {variable} mehr Text"
# - Variablen und Berechnungen in {} einfügen
# - Dictionaries für Nachschlage-Tabellen (z.B. Raumnummern → Namen)
# - String-Verkettung mit + ("A" + "B" = "AB")
# - .lower() und .strip() für robuste Eingabeverarbeitung
#
# Drei Bausteine erstellt:
# 1. Dynamische Raumtexte mit raum_namen-Dictionary
# 2. Inventar-Anzeige mit Emojis
# 3. Normalisierte Eingabeverarbeitung
# ============================================================
