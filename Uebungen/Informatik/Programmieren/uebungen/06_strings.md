# Übung 6: Dynamische Texte mit Strings und f-Strings

**Thema:** String-Verkettung, f-Strings, String-Methoden
**Baustein:** Dynamische Spieltexte, die sich an den Spielzustand anpassen

## Einführung

Im Spielbuch sind die Texte fix gedruckt. In deinem Programm können sie sich ändern — zum Beispiel zeigt der Text an, in welchem Raum du bist oder was du im Inventar hast. Dafür verwendest du **f-Strings**.

## Aufgabe

### Teilaufgabe 1: Raumnamen dynamisch einsetzen

Erstelle ein Dictionary (eine Art Nachschlagetabelle) für die Raumnamen und verwende f-Strings, um dynamische Texte zu erzeugen:

```python
raum_namen = {
    1: "Startraum",
    31: "West-Ost-Korridor",
    32: "Süd-Nord-Korridor",
    101: "Büro Ost",
    102: "Lüftungsschacht-Raum",
    104: "Sackgasse",
    201: "Büro West",
    202: "Tresorraum"
}

aktueller_raum = 32
print(f"Du befindest dich im {raum_namen[aktueller_raum]}.")
```

Ändere `aktueller_raum` und teste, wie sich der Text anpasst.

### Teilaufgabe 2: Inventar-Anzeige

Baue eine Funktion, die das aktuelle Inventar anzeigt:

```python
hat_papier = True
hat_taschenmesser = False
hat_sprengschnur = False

print("=== Inventar ===")

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
```

### Teilaufgabe 3: Statuszeile

Erstelle eine kompakte Statuszeile, die den Spieler jederzeit informiert:

```python
aktueller_raum = 102
hat_taschenmesser = True
hat_sprengschnur = False

raum_name = raum_namen[aktueller_raum]

# Inventar als Symbole
inventar = ""
if hat_papier:
    inventar = inventar + "📄"
if hat_taschenmesser:
    inventar = inventar + "🔪"
if hat_sprengschnur:
    inventar = inventar + "💣"

print(f"[Raum: {raum_name} | Inventar: {inventar}]")
# Ausgabe: [Raum: Lüftungsschacht-Raum | Inventar: 📄🔪]
```

### Teilaufgabe 4: Eingabe normalisieren

Spieler tippen manchmal «Osten», manchmal «osten» oder «OSTEN». Verwende `.lower()` und `.strip()`, um die Eingabe zu normalisieren:

```python
eingabe = input("Wohin gehst du? ")
eingabe = eingabe.lower().strip()

if eingabe == "osten":
    print("Du gehst nach Osten.")
elif eingabe == "westen":
    print("Du gehst nach Westen.")
else:
    print(f"'{eingabe}' ist keine gültige Richtung.")
```

Teste mit verschiedenen Schreibweisen: `Osten`, `  osten  `, `OSTEN`.

## Ergebnis

Du hast drei wichtige Bausteine erstellt: dynamische Raumtexte mit f-Strings, eine Inventar-Anzeige und eine robuste Eingabeverarbeitung. Diese machen dein Spiel lebendiger und benutzerfreundlicher.
