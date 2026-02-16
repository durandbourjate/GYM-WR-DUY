# Projektdokumentation: Übungspools Wirtschaft und Recht

## Über dieses Dokument

Diese Dokumentation richtet sich an Personen, die das Übungspool-Projekt am Gymnasium Hofwil weiterführen möchten. Sie erklärt die Grundideen, die technische Architektur und die konkreten Arbeitsabläufe — auch für jemanden, der das Projekt nicht von Anfang an begleitet hat.

Das Dokument ist so geschrieben, dass es auch als Projektanweisung in einem Claude-Projekt verwendet werden kann. Die technische Detailreferenz zu Config-Formaten, Fragetypen und Qualitätskontrolle findet sich in der separaten **Anleitung_Uebungspools.md**.

---

## 1. Was sind die Übungspools?

Interaktive, browserbasierte Übungen für den Unterricht in Wirtschaft und Recht (W&R). Die Schülerinnen und Schüler (SuS) können selbständig üben — mit wählbaren Themen und Schwierigkeitsstufen, sofortigem Feedback und einer Auswertung am Ende.

Die Übungspools sind in drei Fachbereiche gegliedert:

| Fachbereich | Farbe | Farbcode |
|---|---|---|
| **VWL** (Volkswirtschaftslehre) | 🟠 Orange | `#f89907` |
| **BWL** (Betriebswirtschaftslehre) | 🔵 Blau | `#01a9f4` |
| **Recht** | 🟢 Grün | `#73ab2c` |

Diese Farben sind an das bestehende Farbschema der Lernplattform LearningView angelehnt.

---

## 2. Grundprinzip: Trennung von Layout und Inhalt

Das zentrale Designprinzip des gesamten Systems ist die **strikte Trennung** zwischen dem universellen Template und den themenspezifischen Inhalten:

```
┌─────────────────────────────────────────────────┐
│  pool.html (Template)                           │
│  ─ HTML-Struktur, CSS-Design, JavaScript-Logik  │
│  ─ Wird EINMAL gepflegt                         │
│  ─ Änderungen wirken auf ALLE Pools             │
└────────────────────┬────────────────────────────┘
                     │ lädt per URL-Parameter
                     ▼
┌─────────────────────────────────────────────────┐
│  config/vwl_bip.js (Inhaltsdatei)               │
│  ─ Metadaten, Themen, Fragen                    │
│  ─ Reine Daten, kein HTML/CSS/Logik             │
│  ─ Pro Themenbereich EINE Datei                 │
└─────────────────────────────────────────────────┘
```

**Was bedeutet das in der Praxis?**

- **Neue Fragen erstellen** → Nur die Config-Datei im `config/`-Ordner bearbeiten. Das Template (`pool.html`) wird nicht angefasst.
- **Design oder Funktionalität ändern** (z.B. neuer Fragetyp, anderes Layout) → Nur `pool.html` bearbeiten. Alle bestehenden Pools profitieren automatisch.
- **Neuen Pool erstellen** → Neue Config-Datei in `config/` anlegen + Eintrag in `index.html` ergänzen.

---

## 3. Dateistruktur auf GitHub

```
durandbourjate/GYM-WR-DUY/
└── Uebungen/
    └── Uebungspools/
        ├── index.html              ← Übersichtsseite (listet alle Pools)
        ├── pool.html               ← Universelles Template
        ├── config/                 ← Inhaltsdateien (eine pro Pool)
        │   ├── vwl_bip.js
        │   ├── vwl_beduerfnisse.js
        │   ├── vwl_menschenbild.js
        │   ├── vwl_arbeitslosigkeit.js
        │   ├── vwl_konjunktur.js
        │   ├── vwl_geld.js
        │   ├── vwl_aussenwirtschaft.js
        │   ├── vwl_sozialpolitik.js
        │   └── ...                 ← Weitere Pools (BWL, Recht)
        └── img/                    ← Bilder für Fragen (optional)
            ├── vwl/
            │   ├── bip/
            │   ├── konjunktur/
            │   └── ...
            ├── bwl/
            │   └── ...
            └── recht/
                └── ...
```

### Namenskonventionen

| Element | Konvention | Beispiel |
|---|---|---|
| Config-Datei | `{fachbereich}_{thema}.js` | `vwl_bip.js`, `recht_vertragsrecht.js` |
| Bilddatei | `{thema}_{inhalt}_{nr}.png` | `konjunktur_zyklus_01.png` |
| Bildordner | `img/{fachbereich}/{thema}/` | `img/vwl/konjunktur/` |
| Fragen-ID | `{buchstabe}{zweistellig}` | `d01`, `m07`, `k12` |

**Regeln für Dateinamen:** Kleinbuchstaben, Unterstriche statt Leerzeichen, keine Umlaute (`ae`/`oe`/`ue` statt `ä`/`ö`/`ü`), keine Sonderzeichen. Das vermeidet Probleme mit URLs auf GitHub Pages.

---

## 4. URL-System

Alle Übungspools werden über GitHub Pages gehostet. Die Basis-URL ist:

```
https://durandbourjate.github.io/GYM-WR-DUY/Uebungen/Uebungspools/
```

### 4.1 Übersichtsseite

```
.../Uebungspools/index.html
```

Zeigt alle verfügbaren Pools, gegliedert nach Fachbereich (VWL, BWL, Recht) in aufklappbaren Sektionen. Jeder Eintrag verlinkt auf den entsprechenden Pool.

### 4.2 Einzelner Übungspool

```
.../Uebungspools/pool.html?pool=vwl_bip
```

Der URL-Parameter `?pool=NAME` bestimmt, welche Config-Datei geladen wird. `pool=vwl_bip` lädt die Datei `config/vwl_bip.js`.

### 4.3 Deep-Links auf Unterthemen

Deep-Links ermöglichen es, SuS direkt auf ein bestimmtes Unterthema zu leiten — ohne dass sie selbst im Startbildschirm navigieren müssen. Das ist besonders nützlich für die Verknüpfung aus LearningView.

```
.../pool.html?pool=vwl_bip&topic=definition
```

**Verfügbare Parameter:**

| Parameter | Werte | Beschreibung |
|---|---|---|
| `pool` | Config-Name | Pflicht. Bestimmt den Übungspool. |
| `topic` | Topic-Schlüssel | Wählt ein Unterthema vor. Mehrere mit Komma: `topic=definition,kreislauf` |
| `diff` | `1`, `2`, `3` | Filtert nach Schwierigkeit. Mehrere mit Komma: `diff=1,2` |
| `type` | `mc`, `tf`, `fill`, `calc`, `sort`, `open` | Filtert nach Fragetyp. |
| `start` | `1` | Startet das Quiz automatisch (ohne Startbildschirm). |
| `keys` | `1` | Zeigt die Deep-Link-Übersicht (alle Topic-Schlüssel mit kopierbaren Links). |

**Beispiele:**

```
# Nur das Thema "Definition" im BIP-Pool, direkt starten:
pool.html?pool=vwl_bip&topic=definition&start=1

# Thema "Kreislauf", nur einfache MC-Fragen:
pool.html?pool=vwl_bip&topic=kreislauf&diff=1&type=mc

# Deep-Link-Übersicht anzeigen (für Lehrpersonen):
pool.html?pool=vwl_bip&keys=1
```

### 4.4 Topic-Schlüssel herausfinden

Die Topic-Schlüssel für die Deep-Links sind in der jeweiligen Config-Datei definiert (im `TOPICS`-Objekt). Um alle Schlüssel eines Pools zu sehen, gibt es zwei Wege:

1. **Im Browser:** `pool.html?pool=NAME&keys=1` öffnen → zeigt alle Schlüssel mit kopierbaren Links.
2. **In der Config-Datei:** `config/NAME.js` öffnen → die Schlüssel im `window.TOPICS`-Objekt ablesen.

---

## 5. Bilder in Fragen einbinden

Fragen können optional ein Bild enthalten — z.B. eine Grafik, Tabelle, einen Zeitungsausschnitt oder ein Diagramm. Das Bild wird zwischen dem Fragetext und den Antwortoptionen angezeigt.

### 5.1 Bild in der Config-Datei referenzieren

Das optionale Feld `img` wird dem Frage-Objekt hinzugefügt:

```javascript
{id:"k01", topic:"konjunktur", type:"mc", diff:2, tax:"K3",
 q:"Analysieren Sie die folgende Grafik. In welcher Konjunkturphase befindet sich die Wirtschaft im markierten Zeitpunkt?",
 img: {
   src: "img/vwl/konjunktur/konjunkturzyklus_01.png",
   alt: "Konjunkturverlauf Schweiz 2015–2023"
 },
 options:[
   {v:"A", t:"Aufschwung"},
   {v:"B", t:"Hochkonjunktur"},
   {v:"C", t:"Abschwung"},
   {v:"D", t:"Rezession"}
 ],
 correct:"C",
 explain:"Der markierte Zeitpunkt zeigt einen Rückgang nach dem Höchststand — typisch für den Abschwung."
}
```

| Feld | Pflicht | Beschreibung |
|---|---|---|
| `img.src` | Ja | Pfad zur Bilddatei, relativ zu `pool.html` |
| `img.alt` | Ja | Beschreibender Text (wird als Bildunterschrift angezeigt) |

### 5.2 Bilddatei ablegen

Das Bild wird auf GitHub im Ordner `img/` abgelegt, gegliedert nach Fachbereich und Thema:

```
Uebungspools/img/vwl/konjunktur/konjunkturzyklus_01.png
```

Der Pfad in `img.src` ist relativ zu `pool.html`, also: `img/vwl/konjunktur/konjunkturzyklus_01.png`.

### 5.3 Funktionsweise im Quiz

- Das Bild wird **unterhalb des Fragetexts** und **oberhalb der Antwortoptionen** angezeigt.
- Die Bildunterschrift (`alt`) erscheint in Kursivschrift unter dem Bild.
- **Zoom-Funktion:** Klick/Tap auf das Bild öffnet eine Vollansicht (dunkler Hintergrund). Erneuter Klick schliesst sie.
- In der **Review-Ansicht** am Ende des Quiz werden Bilder verkleinert angezeigt.
- Im **PDF-Export** (Drucken) werden Bilder mit begrenzter Höhe dargestellt.
- Fragen **ohne** `img`-Feld funktionieren wie bisher — das Feld ist vollständig optional.

### 5.4 Tipps für Bilder

- **Format:** PNG oder JPG. PNG für Grafiken/Diagramme mit Text, JPG für Fotos.
- **Grösse:** Breite 600–1200 px ist ideal. Zu grosse Dateien verlangsamen das Laden.
- **Kontrast:** Bilder sollten sowohl im Light als auch im Dark Mode lesbar sein. Transparente Hintergründe bei PNG können im Dark Mode problematisch sein — im Zweifel weissen Hintergrund verwenden.
- **Dateinamen:** Kleinbuchstaben, Unterstriche, keine Umlaute (z.B. `lorenzkurve_ch_2020.png`).

---

## 6. Arbeiten mit Claude: Typische Aufgaben

Dieses Projekt ist darauf ausgelegt, dass die inhaltliche Arbeit (Fragen erstellen, Pools aufbauen) mit Unterstützung von Claude stattfindet. Hier die wichtigsten Szenarien:

### 6.1 Neuen Übungspool erstellen

**Was wird gebraucht:** Angaben zu Klasse/Stufe, Fachbereich, Themenbereich und idealerweise ein LearningView-Export (Word-Dokument) als Stoffgrundlage.

**Ablauf:**

1. LearningView-Export oder Themenbeschreibung an Claude geben.
2. Claude identifiziert die Unterthemen und schlägt eine Struktur vor.
3. Struktur bestätigen oder anpassen.
4. Claude erstellt die Config-Datei (`config/NAME.js`) mit allen Fragen.
5. Claude aktualisiert den Eintrag in `index.html`.
6. Beide Dateien auf GitHub hochladen.
7. Im Browser testen: `pool.html?pool=NAME`
8. Korrekturen iterativ mit Claude durchführen.
9. In LearningView verlinken.

**Prompt-Beispiel:**
> Erstelle einen neuen Übungspool zum Thema "Vertragsrecht" für SF GYM2, Fachbereich Recht. Hier ist der LearningView-Export: [Datei hochladen]. Erstelle die Config-Datei und den aktualisierten index.html-Eintrag.

### 6.2 Bestehenden Pool erweitern

**Ablauf:**

1. Bestehende Config-Datei von GitHub herunterladen und an Claude geben.
2. Gewünschte Ergänzungen beschreiben (z.B. "10 weitere Fragen zum Unterthema Kreislauf, Schwerpunkt K3–K4").
3. Claude ergänzt die Fragen im `QUESTIONS`-Array.
4. Aktualisierte Config-Datei auf GitHub hochladen.

**Prompt-Beispiel:**
> Hier ist die aktuelle Config-Datei vwl_bip.js. Ergänze 8 Fragen zum Unterthema "messprobleme", davon mindestens 2 Berechnungsaufgaben (calc) und 2 offene Fragen. Schwierigkeit 2–3.

### 6.3 Template erweitern

Änderungen am Template (`pool.html`) wirken auf alle Pools gleichzeitig. Für Template-Änderungen muss die aktuelle `pool.html` an Claude übergeben werden.

**Prompt-Beispiel:**
> Hier ist die aktuelle pool.html. Füge einen neuen Fragetyp "Reihenfolge" (order) hinzu, bei dem SuS Begriffe in die richtige Reihenfolge bringen müssen.

### 6.4 Bilder erstellen lassen

Claude kann Bilder nicht direkt erstellen, aber:
- Diagramme als SVG oder HTML generieren, die dann als Screenshot gespeichert werden können.
- Beschreibungen liefern, die als Vorlage für eigene Grafiken dienen.
- Bestehende Bilder referenzieren und die `img`-Felder in den Config-Dateien ergänzen.

---

## 7. Deployment: Von der Datei zum Live-Pool

### 7.1 GitHub Pages

Das Repository `durandbourjate/GYM-WR-DUY` ist mit GitHub Pages verbunden. Jede Datei, die auf den `main`-Branch hochgeladen wird, ist nach 30–60 Sekunden unter der GitHub Pages URL verfügbar.

**Vorgehen beim Hochladen:**

1. Auf GitHub zum Repository navigieren.
2. In den richtigen Ordner wechseln (z.B. `Uebungen/Uebungspools/config/`).
3. "Add file" → "Upload files" wählen.
4. Datei(en) hochladen und committen.
5. Unter "Actions" warten, bis der Build einen grünen Haken zeigt.
6. URL im Browser testen.

### 7.2 Dateien, die bei verschiedenen Aktionen betroffen sind

| Aktion | Betroffene Dateien |
|---|---|
| Neue Fragen zu bestehendem Pool | `config/NAME.js` |
| Neuer Pool erstellen | `config/NAME.js` + `index.html` |
| Design/Layout ändern | `pool.html` |
| Bild hinzufügen | `img/{fach}/{thema}/BILD.png` + `config/NAME.js` |
| Übersichtsseite anpassen | `index.html` |

### 7.3 Integration mit LearningView

In LearningView wird der Übungspool als Weblink-Anhang bei einer Aufgabe eingefügt. Der Link öffnet sich in einem neuen Tab. Für gezielte Verknüpfungen können Deep-Links mit dem `topic`-Parameter verwendet werden (→ Abschnitt 4.3).

---

## 8. Technische Details

### 8.1 Wie pool.html funktioniert

1. SuS öffnen eine URL wie `pool.html?pool=vwl_bip`.
2. `pool.html` liest den URL-Parameter `pool` aus.
3. Per `fetch()` wird die Datei `config/vwl_bip.js` geladen.
4. Der Inhalt wird als `<script>` in die Seite eingefügt → die globalen Variablen `POOL_META`, `TOPICS` und `QUESTIONS` stehen zur Verfügung.
5. Basierend auf `POOL_META.color` wird das Farbschema gesetzt.
6. Die Chips (Filter) werden aus `TOPICS`, den vorhandenen Schwierigkeitsgraden und Fragetypen generiert.
7. Beim Quiz werden die Fragen gefiltert, sortiert oder gemischt, und einzeln angezeigt.

### 8.2 Abhängigkeiten

- **Google Fonts** (DM Sans, DM Mono) — mit system-ui als Fallback.
- **Keine Frameworks**, keine npm-Pakete, kein Build-Prozess.
- Funktioniert auf jedem modernen Browser (Desktop und Mobile).
- Dark Mode wird automatisch unterstützt (CSS `prefers-color-scheme`).

### 8.3 Wichtige Regeln für Config-Dateien

- **Variablen immer mit `window.` deklarieren** (`window.POOL_META = ...`), nicht mit `const` oder `let`. Grund: Die Datei wird per `fetch()` geladen und als Script-Element eingefügt. Ohne `window.` sind die Variablen nicht global verfügbar.
- **Topic-Schlüssel** in `QUESTIONS` müssen exakt mit den Schlüsseln in `TOPICS` übereinstimmen.
- **IDs** müssen innerhalb eines Pools eindeutig sein.
- **Keine HTML-Tags** in Fragetexten verwenden (ausser `<br>` für Zeilenumbrüche, falls nötig).

---

## 9. Häufige Fragen (FAQ)

### Ich möchte nur eine einzelne Frage korrigieren. Was muss ich tun?

Die betreffende Config-Datei von GitHub herunterladen (z.B. `config/vwl_bip.js`), die Frage suchen (am einfachsten per ID, z.B. `d01`), die Änderung vornehmen und die Datei wieder hochladen. `pool.html` muss nicht angefasst werden.

### Wie finde ich heraus, welche Pools es gibt?

Entweder die Übersichtsseite öffnen (`index.html`) oder auf GitHub in den Ordner `config/` schauen. Jede `.js`-Datei entspricht einem Pool.

### Kann ich einen Pool löschen?

Ja. Die Config-Datei aus `config/` löschen und den entsprechenden Eintrag im `POOLS`-Array in `index.html` entfernen. Bestehende Links auf den Pool werden dann eine Fehlermeldung zeigen.

### Was passiert, wenn ich pool.html ändere?

Die Änderung wirkt auf **alle** Pools gleichzeitig, da alle Pools dasselbe Template verwenden. Vor Änderungen an `pool.html` sollte immer eine Kopie der aktuellen Version gesichert werden.

### Kann ich Bilder aus dem Internet verlinken statt sie auf GitHub abzulegen?

Technisch ja — im `img.src` einfach eine vollständige URL angeben. Aber: Externe Bilder können verschwinden oder sich ändern, und es gibt mögliche CORS-Probleme. Es wird empfohlen, Bilder immer lokal im `img/`-Ordner abzulegen.

### Wie teste ich einen Pool lokal, bevor ich ihn auf GitHub lade?

Die Dateien lassen sich nicht direkt im Dateisystem öffnen (wegen `fetch()`). Zwei Möglichkeiten:
1. **Direkt auf GitHub hochladen** und dort testen (einfachster Weg).
2. **Lokalen Webserver starten** (z.B. `python3 -m http.server` im Ordner) und im Browser `localhost:8000/pool.html?pool=NAME` öffnen.

### Unterstützt das System auch Videos oder PDFs in Fragen?

Aktuell nur Bilder (PNG, JPG). Für Videos oder PDFs wäre eine Erweiterung von `pool.html` nötig — das Prinzip wäre gleich wie bei Bildern: ein optionales Feld im Frage-Objekt und eine Rendering-Funktion im Template.

### Wie kann ich die Reihenfolge der Pools auf der Übersichtsseite ändern?

Die Reihenfolge wird durch die Position im `POOLS`-Array in `index.html` bestimmt. Einträge umordnen und hochladen.

---

## 10. Weiterführende Dokumente

| Dokument | Inhalt |
|---|---|
| **Anleitung_Uebungspools.md** | Technische Detailreferenz: Config-Format, alle Fragetypen mit Codebeispielen, Schwierigkeitsgrade, Taxonomiestufen, ID-Konventionen, Qualitätscheckliste. |
| **Anleitung_Pruefungen.md** | Vorgehen bei der Erstellung von Prüfungen (Word-Dokumente), Bewertungsraster, Dokumentformat. |
| **Projektanweisung (System Prompt)** | Kontext zu Schule, Klassen, Lehrplan, Fachbereichen und allgemeinen Arbeitsweisen. Wird als Projektanweisung im Claude-Projekt verwendet. |

---

## 11. Checkliste: Projekt übernehmen

Wenn du dieses Projekt übernimmst, solltest du folgende Dinge klären:

- [ ] Zugang zum GitHub-Repository `durandbourjate/GYM-WR-DUY` (Schreibrechte)
- [ ] Zugang zur Übersichtsseite im Browser testen
- [ ] Mindestens einen bestehenden Pool öffnen und durchspielen
- [ ] Einen Deep-Link mit `&keys=1` aufrufen und verstehen
- [ ] Die Config-Datei eines bestehenden Pools öffnen und die Struktur nachvollziehen
- [ ] Eine kleine Änderung vornehmen (z.B. Tippfehler in einer Frage korrigieren) und auf GitHub hochladen
- [ ] Prüfen, ob die Änderung nach dem Deployment live ist
- [ ] Die **Anleitung_Uebungspools.md** lesen (technische Referenz)
- [ ] Das Claude-Projekt mit den hinterlegten Projektdokumenten kennenlernen
