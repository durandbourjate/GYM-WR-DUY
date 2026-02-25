# Python-Grundlagen: Vom Spielbuch zum Programm

*Theorie und Erklärungen für die Lernsequenz «Programmieren in Python» — GYM1, Gymnasium Hofwil*

---

## Überblick

Ihr kennt das Spielbuch «Raus hier!» bereits: Ihr habt es gespielt, eine Karte gezeichnet und ein Flussdiagramm erstellt. Nun lernt ihr, wie man ein solches Spielbuch als Computerprogramm umsetzt — mit der Programmiersprache **Python**.

Python eignet sich dafür besonders gut, weil die Sprache leicht lesbar ist und sich fast wie Pseudocode liest. Schritt für Schritt lernt ihr die wichtigsten Bausteine kennen: Ausgabe, Variablen, Eingabe, Verzweigungen und Schleifen.

**Lernziele der Sequenz:**
- Ich kann einfache Python-Programme mit Ein- und Ausgabe schreiben.
- Ich kann Variablen, Datentypen und Operatoren korrekt einsetzen.
- Ich kann Kontrollstrukturen (Verzweigungen, Schleifen) verwenden, um den Programmablauf zu steuern.
- Ich kann den Zusammenhang zwischen Flussdiagramm und Programmcode erklären.

---

## 1. Kommentare

Kommentare sind Notizen im Programmcode, die Python **ignoriert**. Sie dienen dazu, den Code für Menschen verständlicher zu machen.

Ein Kommentar beginnt mit dem Zeichen `#`. Alles, was auf derselben Zeile nach dem `#` steht, wird von Python nicht ausgeführt.

```python
# Dies ist ein Kommentar — Python überspringt diese Zeile
print("Hallo")  # Auch hier: alles nach # ist Kommentar
```

**Wozu Kommentare?**
- Erklären, was ein Codeabschnitt tut
- Notizen für sich selbst oder andere hinterlassen
- Vorübergehend Code «ausschalten» (auskommentieren)

**Tipp:** Kommentiert euren Code grosszügig. In einer Woche wisst ihr sonst nicht mehr, warum ihr etwas so geschrieben habt.

---

## 2. Ausgabe mit print()

Der Befehl `print()` gibt Text oder Werte auf dem Bildschirm aus. Er ist das wichtigste Werkzeug, um dem Benutzer Informationen zu zeigen.

### Text ausgeben

Text (sogenannte **Strings**) steht in Anführungszeichen — einfache `'...'` oder doppelte `"..."` funktionieren beide:

```python
print("Hallo Welt!")
print('Es ist stockdunkel und riecht nach Keller.')
```

### Mehrere Werte ausgeben

Mit Kommas könnt ihr mehrere Werte in einem `print()` kombinieren. Python fügt automatisch ein Leerzeichen dazwischen ein:

```python
print("Raum", 12, "ist verschlossen.")
# Ausgabe: Raum 12 ist verschlossen.
```

### Leere Zeile

Ein `print()` ohne Inhalt gibt eine leere Zeile aus:

```python
print("Zeile 1")
print()
print("Zeile 3")
```

### Sonderzeichen

Um spezielle Zeichen in einem String darzustellen, nutzt ihr einen Backslash `\`:

| Zeichen | Bedeutung |
|---------|-----------|
| `\n` | Neue Zeile |
| `\t` | Tabulator |
| `\\` | Ein Backslash |
| `\"` | Ein Anführungszeichen |

```python
print("Zeile 1\nZeile 2")
# Ausgabe:
# Zeile 1
# Zeile 2
```

---

## 3. Variablen

Eine **Variable** ist ein Name, der auf einen Wert zeigt — wie ein beschriftetes Kästchen, in dem man etwas ablegen kann.

### Variablen erstellen

Man erstellt eine Variable, indem man ihr mit dem Gleichheitszeichen `=` einen Wert zuweist:

```python
raum_nummer = 1
spieler_name = "Alice"
hat_taschenmesser = False
wasserstand = 0.75
```

### Regeln für Variablennamen

- Dürfen Buchstaben, Zahlen und Unterstriche enthalten
- Dürfen **nicht** mit einer Zahl beginnen
- Dürfen **keine Leerzeichen** enthalten (stattdessen Unterstriche verwenden)
- Gross-/Kleinschreibung wird unterschieden (`Name` und `name` sind verschiedene Variablen)
- Reservierte Wörter (z.B. `print`, `if`, `while`) dürfen nicht als Variablennamen verwendet werden

**Konvention:** In Python verwendet man `snake_case` — also Kleinbuchstaben mit Unterstrichen: `raum_nummer`, `hat_schluessel`, `spieler_name`.

### Variablen überschreiben

Eine Variable kann jederzeit einen neuen Wert erhalten:

```python
raum_nummer = 1
print(raum_nummer)   # Ausgabe: 1

raum_nummer = 31
print(raum_nummer)   # Ausgabe: 31
```

### Variablen in print() verwenden

Variablen werden **ohne** Anführungszeichen geschrieben, damit Python ihren Wert einsetzt:

```python
name = "Alice"
print("Hallo", name)   # Ausgabe: Hallo Alice
print("name")          # Ausgabe: name (der Text, nicht der Wert!)
```

---

## 4. Datentypen

Jeder Wert in Python hat einen **Datentyp**. Die vier wichtigsten sind:

| Datentyp | Abkürzung | Beispiel | Beschreibung |
|----------|-----------|----------|-------------|
| Ganzzahl | `int` | `42` | Ganze Zahlen ohne Komma |
| Kommazahl | `float` | `3.14` | Zahlen mit Dezimalpunkt |
| Text | `str` | `"Hallo"` | Zeichenketten (Strings) |
| Wahrheitswert | `bool` | `True` | Wahr (`True`) oder Falsch (`False`) |

### Datentyp herausfinden

Mit `type()` könnt ihr den Datentyp eines Wertes anzeigen:

```python
print(type(42))          # <class 'int'>
print(type(3.14))        # <class 'float'>
print(type("Hallo"))     # <class 'str'>
print(type(True))        # <class 'bool'>
```

### Typumwandlung (Konvertierung)

Manchmal muss man einen Datentyp in einen anderen umwandeln:

```python
# String → Ganzzahl
alter_text = "16"
alter_zahl = int(alter_text)    # 16 als int

# String → Kommazahl
preis_text = "9.90"
preis = float(preis_text)       # 9.9 als float

# Zahl → String
punkte = 100
text = str(punkte)              # "100" als str
```

**Wichtig:** `input()` gibt immer einen String zurück. Wenn ihr mit der Eingabe rechnen wollt, müsst ihr sie zuerst umwandeln:

```python
alter = input("Wie alt bist du? ")     # z.B. "16" (String!)
alter = int(alter)                      # 16 (Ganzzahl)
# Oder in einer Zeile:
alter = int(input("Wie alt bist du? "))
```

---

## 5. Benutzereingaben mit input()

Der Befehl `input()` wartet darauf, dass der Benutzer etwas eintippen und mit Enter bestätigen. Der eingegebene Text wird als **String** zurückgegeben.

### Grundform

```python
name = input("Wie heisst du? ")
print("Hallo", name)
```

Ablauf:
1. Python zeigt den Text `Wie heisst du? ` an
2. Der Benutzer tippt z.B. `Alice` und drückt Enter
3. Der Wert `"Alice"` wird in der Variable `name` gespeichert
4. `print()` gibt `Hallo Alice` aus

### Eingabe als Zahl verwenden

Da `input()` immer einen String liefert, muss man für Berechnungen umwandeln:

```python
code = int(input("Gib den Code ein: "))
if code == 423:
    print("Tresor geöffnet!")
```

### Spielbuch-Beispiel

So könnte eine einfache Raumauswahl aussehen:

```python
print("Du stehst vor zwei Türen.")
print("1: Osten")
print("2: Westen")
wahl = input("Wohin gehst du? (1/2): ")

if wahl == "1":
    print("Du gehst nach Osten...")
elif wahl == "2":
    print("Du gehst nach Westen...")
else:
    print("Ungültige Eingabe!")
```

---

## 6. Strings und f-Strings

**Strings** sind Zeichenketten — also Text. Sie werden mit Anführungszeichen markiert.

### Strings zusammensetzen (Verkettung)

Mit dem Operator `+` kann man Strings verbinden:

```python
vorname = "Alice"
nachname = "Müller"
name = vorname + " " + nachname
print(name)   # Ausgabe: Alice Müller
```

**Achtung:** Man kann einen String nicht direkt mit einer Zahl verbinden. Das gibt einen Fehler:

```python
alter = 16
# print("Ich bin " + alter + " Jahre alt.")  # Fehler!
print("Ich bin " + str(alter) + " Jahre alt.")  # So geht's
```

### f-Strings (formatierte Strings)

Einfacher und lesbarer geht es mit **f-Strings**. Man setzt ein `f` vor den String und schreibt Variablen in geschweifte Klammern `{}`:

```python
name = "Alice"
raum = 31
print(f"Hallo {name}, du bist in Raum {raum}.")
# Ausgabe: Hallo Alice, du bist in Raum 31.
```

In den geschweiften Klammern können auch Berechnungen stehen:

```python
preis = 10
menge = 3
print(f"Total: {preis * menge} CHF")
# Ausgabe: Total: 30 CHF
```

### Nützliche String-Methoden

| Methode | Beschreibung | Beispiel |
|---------|-------------|---------|
| `.upper()` | Alles in Grossbuchstaben | `"hallo".upper()` → `"HALLO"` |
| `.lower()` | Alles in Kleinbuchstaben | `"HALLO".lower()` → `"hallo"` |
| `.strip()` | Leerzeichen am Anfang/Ende entfernen | `" hi ".strip()` → `"hi"` |
| `.replace(a, b)` | Teiltext ersetzen | `"Hallo".replace("a","o")` → `"Hollo"` |
| `len(s)` | Länge des Strings | `len("Hallo")` → `5` |

### String-Indexierung

Einzelne Zeichen können über ihren **Index** angesprochen werden. Die Zählung beginnt bei 0:

```python
wort = "Python"
print(wort[0])    # P
print(wort[1])    # y
print(wort[-1])   # n (letztes Zeichen)
```

---

## 7. Operatoren

### Arithmetische Operatoren

| Operator | Beschreibung | Beispiel | Ergebnis |
|----------|-------------|---------|----------|
| `+` | Addition | `5 + 3` | `8` |
| `-` | Subtraktion | `10 - 4` | `6` |
| `*` | Multiplikation | `3 * 7` | `21` |
| `/` | Division (Kommazahl) | `10 / 3` | `3.333...` |
| `//` | Ganzzahl-Division | `10 // 3` | `3` |
| `%` | Modulo (Rest) | `10 % 3` | `1` |
| `**` | Potenz | `2 ** 3` | `8` |

### Reihenfolge (Operatorhierarchie)

Wie in der Mathematik gilt: Potenz vor Punkt vor Strich. Klammern haben höchste Priorität.

```python
x = (2 + 3) * 10 - 3
# 1. Klammer: 2 + 3 = 5
# 2. Multiplikation: 5 * 10 = 50
# 3. Subtraktion: 50 - 3 = 47
```

### Vergleichsoperatoren

Vergleiche liefern einen Wahrheitswert (`True` oder `False`):

| Operator | Bedeutung | Beispiel | Ergebnis |
|----------|----------|---------|----------|
| `==` | gleich | `5 == 5` | `True` |
| `!=` | ungleich | `5 != 3` | `True` |
| `<` | kleiner als | `3 < 5` | `True` |
| `>` | grösser als | `3 > 5` | `False` |
| `<=` | kleiner oder gleich | `5 <= 5` | `True` |
| `>=` | grösser oder gleich | `3 >= 5` | `False` |

**Wichtig:** `=` ist eine **Zuweisung** (Wert speichern), `==` ist ein **Vergleich** (Werte prüfen).

### Logische Operatoren

Mit logischen Operatoren können mehrere Bedingungen kombiniert werden:

| Operator | Bedeutung | Beispiel |
|----------|----------|---------|
| `and` | Beide müssen wahr sein | `alter >= 18 and hat_ausweis == True` |
| `or` | Mindestens eine muss wahr sein | `tuer_offen or hat_schluessel` |
| `not` | Kehrt den Wert um | `not tuer_verschlossen` |

```python
alter = 16
hat_erlaubnis = True

if alter >= 18 or hat_erlaubnis:
    print("Zutritt erlaubt")
```

---

## 8. Verzweigungen (if / elif / else)

Verzweigungen erlauben es, den Programmablauf abhängig von Bedingungen zu steuern — genau wie die Entscheidungen im Spielbuch.

### Einfache Verzweigung (if)

```python
code = 423
if code == 423:
    print("Tresor geöffnet!")
```

**Wichtig:** Nach der Bedingung steht ein **Doppelpunkt** `:`, und der eingerückte Block (4 Leerzeichen) wird nur ausgeführt, wenn die Bedingung wahr ist.

### Verzweigung mit Alternative (if-else)

```python
code = int(input("Gib den Code ein: "))
if code == 423:
    print("Tresor geöffnet!")
else:
    print("Falscher Code. Versuch es nochmal.")
```

### Mehrere Bedingungen (if-elif-else)

```python
wahl = input("Wohin? (osten/westen): ")

if wahl == "osten":
    print("Du gehst nach Osten → Raum 101")
elif wahl == "westen":
    print("Du gehst nach Westen → Raum 201")
else:
    print("Ungültige Richtung!")
```

`elif` steht für «else if» — es wird nur geprüft, wenn die vorherige Bedingung falsch war. Man kann beliebig viele `elif`-Blöcke verwenden.

### Verschachtelte Verzweigungen

Verzweigungen können ineinander geschachtelt werden:

```python
hat_schluessel = True
tuer = "nord"

if tuer == "nord":
    if hat_schluessel:
        print("Du öffnest die Nordtür.")
    else:
        print("Die Tür ist verschlossen.")
elif tuer == "sued":
    print("Du gehst nach Süden.")
```

### Zusammenhang mit dem Flussdiagramm

Jede Raute (Entscheidung) im Flussdiagramm entspricht einem `if` im Code. Die Pfeile nach «Ja» und «Nein» entsprechen dem `if`-Block und dem `else`-Block:

```
Flussdiagramm:                    Python-Code:

  ◇ Code == 423?                  if code == 423:
  │
  Ja → Tresor öffnet sich             print("Tresor öffnet sich!")
  │
  Nein → Falscher Code            else:
                                      print("Falscher Code!")
```

### Einrückung (Indentation)

Python verwendet **Einrückung** (4 Leerzeichen), um zusammengehörende Codeblöcke zu markieren. Das ist anders als in vielen anderen Sprachen, die geschweifte Klammern verwenden.

```python
if bedingung:
    # Dieser Block gehört zum if
    print("Bedingung ist wahr")
    print("Noch eine Zeile im Block")

print("Diese Zeile wird IMMER ausgeführt")
```

**Häufiger Fehler:** Falsche oder fehlende Einrückung führt zu einem `IndentationError`.

---

## 9. Schleifen

Schleifen wiederholen einen Codeblock — entweder eine bestimmte Anzahl Mal oder solange eine Bedingung erfüllt ist. Im Spielbuch entspricht das dem wiederholten Durchlaufen von Räumen.

### while-Schleife

Die `while`-Schleife wiederholt den Block, **solange** die Bedingung wahr ist:

```python
versuch = 0
code = ""

while code != "201":
    code = input("Gib den Koffer-Code ein: ")
    versuch = versuch + 1

print(f"Geschafft nach {versuch} Versuchen!")
```

**Flussdiagramm-Entsprechung:** Eine Schleife im Flussdiagramm ist ein Pfeil, der zurück zu einer Entscheidungsraute führt.

### Endlosschleifen vermeiden

Wenn die Bedingung nie falsch wird, läuft die Schleife endlos:

```python
# ACHTUNG: Endlosschleife!
i = 1
while i <= 5:
    print(i)
    # i wird nie erhöht → Bedingung bleibt immer wahr
```

**Lösung:** Sicherstellen, dass sich die Bedingungsvariable im Schleifenkörper verändert:

```python
i = 1
while i <= 5:
    print(i)
    i = i + 1    # i wird bei jedem Durchlauf erhöht
```

### Spielbuch-Schleife

Das Grundgerüst eines textbasierten Spiels verwendet eine `while`-Schleife:

```python
raum = 1
spiel_laeuft = True

while spiel_laeuft:
    if raum == 1:
        print("Du bist im Startraum.")
        wahl = input("Osten (o) oder Westen (w)? ")
        if wahl == "o":
            raum = 101
        elif wahl == "w":
            raum = 201
    elif raum == 101:
        print("Du bist im Büro.")
        # ... weitere Logik
    # ... weitere Räume
```

### for-Schleife

Die `for`-Schleife durchläuft eine **Sequenz** (z.B. eine Liste oder einen Bereich):

```python
# Über einen Bereich (range) iterieren
for i in range(5):
    print(i)
# Ausgabe: 0, 1, 2, 3, 4

# Über eine Liste iterieren
raeume = [1, 31, 32, 101, 201]
for raum in raeume:
    print(f"Raum {raum}")
```

### range() im Detail

`range()` erzeugt eine Zahlenfolge:

| Aufruf | Erzeugt | Beschreibung |
|--------|---------|-------------|
| `range(5)` | 0, 1, 2, 3, 4 | Von 0 bis 4 |
| `range(1, 6)` | 1, 2, 3, 4, 5 | Von 1 bis 5 |
| `range(0, 10, 2)` | 0, 2, 4, 6, 8 | Von 0 bis 8, Schritt 2 |

### break und continue

- `break` bricht die Schleife sofort ab
- `continue` überspringt den Rest des aktuellen Durchlaufs

```python
# break: Schleife beenden, wenn Ausgang gefunden
raeume = [1, 31, 32, 101, 201, 301, 302]
for raum in raeume:
    print(f"Prüfe Raum {raum}...")
    if raum == 302:
        print("Ausgang gefunden!")
        break

# continue: Verschlossene Räume überspringen
for raum in raeume:
    if raum in [1, 101, 201]:  # verschlossene Türen
        continue
    print(f"Raum {raum} ist zugänglich.")
```

---

## 10. Listen (Kurzüberblick)

Listen speichern mehrere Werte in einer geordneten Sammlung:

```python
# Liste erstellen
inventar = ["Taschenlampe", "Kompass", "Trinkflasche"]

# Element hinzufügen
inventar.append("Taschenmesser")

# Auf Element zugreifen (Index beginnt bei 0)
print(inventar[0])    # Taschenlampe
print(inventar[-1])   # Taschenmesser (letztes Element)

# Länge der Liste
print(len(inventar))  # 4

# Prüfen, ob Element vorhanden
if "Kompass" in inventar:
    print("Du hast einen Kompass!")

# Mit for-Schleife durchgehen
for gegenstand in inventar:
    print(f"- {gegenstand}")
```

Listen sind besonders nützlich, um z.B. das Inventar des Spielers oder eine Liste von besuchten Räumen zu verwalten.

---

## Zusammenfassung: Python-Bausteine im Spielbuch

| Spielbuch-Element | Python-Baustein |
|-------------------|-----------------|
| Text anzeigen | `print()` |
| Spieler fragt | `input()` |
| Werte speichern (Raum, Inventar) | Variablen |
| Entscheidung (Osten/Westen) | `if` / `elif` / `else` |
| Spiel läuft weiter | `while`-Schleife |
| Alle Räume durchgehen | `for`-Schleife / Listen |
| Code-Eingabe prüfen | Vergleichsoperatoren (`==`) |
| Mehrere Bedingungen | `and`, `or`, `not` |

---

## Tipps für das Programmieren

1. **Schritt für Schritt:** Schreibt nicht das ganze Programm auf einmal. Beginnt mit einem kleinen Teil, testet ihn, und erweitert dann.

2. **Fehlermeldungen lesen:** Python zeigt euch genau, wo ein Fehler aufgetreten ist. Lest die letzte Zeile der Fehlermeldung — sie beschreibt das Problem.

3. **Häufige Fehler:**
   - Vergessener Doppelpunkt nach `if`, `elif`, `else`, `while`, `for`
   - Falsche Einrückung (immer 4 Leerzeichen!)
   - `=` statt `==` beim Vergleichen
   - Fehlende Anführungszeichen bei Strings
   - `input()` gibt immer einen String zurück — bei Zahlen `int()` verwenden

4. **Testen, testen, testen:** Führt euer Programm nach jeder kleinen Änderung aus. So findet ihr Fehler sofort.

5. **Kommentare schreiben:** Erklärt in Kommentaren, was jeder Abschnitt tut. Das hilft euch und euren Mitschüler*innen.
