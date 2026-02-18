# Projektdokumentation: Ãœbungspools Wirtschaft und Recht

## Ãœber dieses Dokument

Diese Dokumentation richtet sich an Personen, die das Ãœbungspool-Projekt am Gymnasium Hofwil weiterfÃ¼hren mÃ¶chten. Sie erklÃ¤rt die Grundideen, die technische Architektur und die konkreten ArbeitsablÃ¤ufe â€” auch fÃ¼r jemanden, der das Projekt nicht von Anfang an begleitet hat.

Das Dokument ist so geschrieben, dass es auch als Projektanweisung in einem Claude-Projekt verwendet werden kann. Die technische Detailreferenz zu Config-Formaten, Fragetypen und QualitÃ¤tskontrolle findet sich in der separaten **Anleitung_Uebungspools.md**.

---

## 1. Was sind die Ãœbungspools?

Interaktive, browserbasierte Ãœbungen fÃ¼r den Unterricht in Wirtschaft und Recht (W&R). Die SchÃ¼lerinnen und SchÃ¼ler (SuS) kÃ¶nnen selbstÃ¤ndig Ã¼ben â€” mit wÃ¤hlbaren Themen und Schwierigkeitsstufen, sofortigem Feedback und einer Auswertung am Ende.

Die Ãœbungspools sind in drei Fachbereiche gegliedert:

| Fachbereich | Farbe | Farbcode |
|---|---|---|
| **VWL** (Volkswirtschaftslehre) | ðŸŸ  Orange | `#f89907` |
| **BWL** (Betriebswirtschaftslehre) | ðŸ”µ Blau | `#01a9f4` |
| **Recht** | ðŸŸ¢ GrÃ¼n | `#73ab2c` |

Diese Farben sind an das bestehende Farbschema der Lernplattform LearningView angelehnt.

---

## 2. Grundprinzip: Trennung von Layout und Inhalt

Das zentrale Designprinzip des gesamten Systems ist die **strikte Trennung** zwischen dem universellen Template und den themenspezifischen Inhalten:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  pool.html (Template)                           â”‚
â”‚  â”€ HTML-Struktur, CSS-Design, JavaScript-Logik  â”‚
â”‚  â”€ Wird EINMAL gepflegt                         â”‚
â”‚  â”€ Ã„nderungen wirken auf ALLE Pools             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â”‚ lÃ¤dt per URL-Parameter
                     â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  config/vwl_bip.js (Inhaltsdatei)               â”‚
â”‚  â”€ Metadaten, Themen, Fragen                    â”‚
â”‚  â”€ Reine Daten, kein HTML/CSS/Logik             â”‚
â”‚  â”€ Pro Themenbereich EINE Datei                 â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

**Was bedeutet das in der Praxis?**

- **Neue Fragen erstellen** â†’ Nur die Config-Datei im `config/`-Ordner bearbeiten. Das Template (`pool.html`) wird nicht angefasst.
- **Design oder FunktionalitÃ¤t Ã¤ndern** (z.B. neuer Fragetyp, anderes Layout) â†’ Nur `pool.html` bearbeiten. Alle bestehenden Pools profitieren automatisch.
- **Neuen Pool erstellen** â†’ Neue Config-Datei in `config/` anlegen + Eintrag in `index.html` ergÃ¤nzen.

---

## 3. Dateistruktur auf GitHub

```
durandbourjate/GYM-WR-DUY/
â””â”€â”€ Uebungen/
    â””â”€â”€ Uebungspools/
        â”œâ”€â”€ index.html              â† Ãœbersichtsseite (listet alle Pools)
        â”œâ”€â”€ pool.html               â† Universelles Template
        â”œâ”€â”€ config/                 â† Inhaltsdateien (eine pro Pool)
        â”‚   â”œâ”€â”€ vwl_beduerfnisse.js
        â”‚   â”œâ”€â”€ vwl_menschenbild.js
        â”‚   â”œâ”€â”€ vwl_bip.js
        â”‚   â”œâ”€â”€ vwl_wachstum.js
        â”‚   â”œâ”€â”€ vwl_steuern.js
        â”‚   â”œâ”€â”€ vwl_arbeitslosigkeit.js
        â”‚   â”œâ”€â”€ vwl_staatsverschuldung.js
        â”‚   â”œâ”€â”€ vwl_sozialpolitik.js
        â”‚   â””â”€â”€ ...                 â† Weitere Pools (BWL, Recht)
        â””â”€â”€ img/                    â† Bilder fÃ¼r Fragen (optional)
            â”œâ”€â”€ vwl/
            â”‚   â”œâ”€â”€ bip/
            â”‚   â””â”€â”€ ...
            â”œâ”€â”€ bwl/
            â”‚   â””â”€â”€ ...
            â””â”€â”€ recht/
                â””â”€â”€ ...
```

### Namenskonventionen

| Element | Konvention | Beispiel |
|---|---|---|
| Config-Datei | `{fachbereich}_{thema}.js` | `vwl_bip.js`, `recht_vertragsrecht.js` |
| Bilddatei | `{thema}_{inhalt}_{nr}.png` | `konjunktur_zyklus_01.png` |
| Bildordner | `img/{fachbereich}/{thema}/` | `img/vwl/konjunktur/` |
| Fragen-ID | `{buchstabe}{zweistellig}` | `d01`, `m07`, `k12` |

**Regeln fÃ¼r Dateinamen:** Kleinbuchstaben, Unterstriche statt Leerzeichen, keine Umlaute (`ae`/`oe`/`ue` statt `Ã¤`/`Ã¶`/`Ã¼`), keine Sonderzeichen. Das vermeidet Probleme mit URLs auf GitHub Pages.

---

## 4. URL-System

Alle Ãœbungspools werden Ã¼ber GitHub Pages gehostet. Die Basis-URL ist:

```
https://durandbourjate.github.io/GYM-WR-DUY/Uebungen/Uebungspools/
```

### 4.1 Ãœbersichtsseite

```
.../Uebungspools/index.html
```

Zeigt alle verfÃ¼gbaren Pools, gegliedert nach Fachbereich (VWL, BWL, Recht) in aufklappbaren Sektionen. Jeder Eintrag verlinkt auf den entsprechenden Pool.

### 4.2 Einzelner Ãœbungspool

```
.../Uebungspools/pool.html?pool=vwl_bip
```

Der URL-Parameter `?pool=NAME` bestimmt, welche Config-Datei geladen wird. `pool=vwl_bip` lÃ¤dt die Datei `config/vwl_bip.js`.

### 4.3 Deep-Links auf Unterthemen

Deep-Links ermÃ¶glichen es, SuS direkt auf ein bestimmtes Unterthema zu leiten â€” ohne dass sie selbst im Startbildschirm navigieren mÃ¼ssen. Das ist besonders nÃ¼tzlich fÃ¼r die VerknÃ¼pfung aus LearningView.

```
.../pool.html?pool=vwl_bip&topic=definition
```

**VerfÃ¼gbare Parameter:**

| Parameter | Werte | Beschreibung |
|---|---|---|
| `pool` | Config-Name | Pflicht. Bestimmt den Ãœbungspool. |
| `topic` | Topic-SchlÃ¼ssel | WÃ¤hlt ein Unterthema vor. Mehrere mit Komma: `topic=definition,kreislauf` |
| `diff` | `1`, `2`, `3` | Filtert nach Schwierigkeit. Mehrere mit Komma: `diff=1,2` |
| `type` | `mc`, `multi`, `tf`, `fill`, `calc`, `sort`, `open` | Filtert nach Fragetyp. |
| `start` | `1` | Startet das Quiz automatisch (ohne Startbildschirm). |
| `keys` | `1` | Zeigt die Deep-Link-Ãœbersicht (alle Topic-SchlÃ¼ssel mit kopierbaren Links). |

**Beispiele:**

```
# Nur das Thema "Definition" im BIP-Pool, direkt starten:
pool.html?pool=vwl_bip&topic=definition&start=1

# Thema "Kreislauf", nur einfache Einzelauswahl-Fragen:
pool.html?pool=vwl_bip&topic=kreislauf&diff=1&type=mc

# Deep-Link-Ãœbersicht anzeigen (fÃ¼r Lehrpersonen):
pool.html?pool=vwl_bip&keys=1
```

### 4.4 Topic-SchlÃ¼ssel herausfinden

Die Topic-SchlÃ¼ssel fÃ¼r die Deep-Links sind in der jeweiligen Config-Datei definiert (im `TOPICS`-Objekt). Um alle SchlÃ¼ssel eines Pools zu sehen, gibt es zwei Wege:

1. **Im Browser:** `pool.html?pool=NAME&keys=1` Ã¶ffnen â†’ zeigt alle SchlÃ¼ssel mit kopierbaren Links.
2. **In der Config-Datei:** `config/NAME.js` Ã¶ffnen â†’ die SchlÃ¼ssel im `window.TOPICS`-Objekt ablesen.

---

## 5. Bilder in Fragen einbinden

Fragen kÃ¶nnen optional ein Bild enthalten â€” z.B. eine Grafik, Tabelle, einen Zeitungsausschnitt oder ein Diagramm. Das Bild wird zwischen dem Fragetext und den Antwortoptionen angezeigt.

### 5.1 Bild in der Config-Datei referenzieren

Das optionale Feld `img` wird dem Frage-Objekt hinzugefÃ¼gt:

```javascript
{id:"k01", topic:"konjunktur", type:"mc", diff:2, tax:"K3",
 q:"Analysieren Sie die folgende Grafik. In welcher Konjunkturphase befindet sich die Wirtschaft im markierten Zeitpunkt?",
 img: {
   src: "img/vwl/konjunktur/konjunkturzyklus_01.png",
   alt: "Konjunkturverlauf Schweiz 2015â€“2023"
 },
 options:[
   {v:"A", t:"Aufschwung"},
   {v:"B", t:"Hochkonjunktur"},
   {v:"C", t:"Abschwung"},
   {v:"D", t:"Rezession"}
 ],
 correct:"C",
 explain:"Der markierte Zeitpunkt zeigt einen RÃ¼ckgang nach dem HÃ¶chststand â€” typisch fÃ¼r den Abschwung."
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
- **Zoom-Funktion:** Klick/Tap auf das Bild Ã¶ffnet eine Vollansicht (dunkler Hintergrund). Erneuter Klick schliesst sie.
- In der **Review-Ansicht** am Ende des Quiz werden Bilder verkleinert angezeigt.
- Im **PDF-Export** (Drucken) werden Bilder mit begrenzter HÃ¶he dargestellt.
- Fragen **ohne** `img`-Feld funktionieren wie bisher â€” das Feld ist vollstÃ¤ndig optional.

### 5.4 Tipps fÃ¼r Bilder

- **Format:** PNG oder JPG. PNG fÃ¼r Grafiken/Diagramme mit Text, JPG fÃ¼r Fotos.
- **GrÃ¶sse:** Breite 600â€“1200 px ist ideal. Zu grosse Dateien verlangsamen das Laden.
- **Kontrast:** Bilder sollten sowohl im Light als auch im Dark Mode lesbar sein. Transparente HintergrÃ¼nde bei PNG kÃ¶nnen im Dark Mode problematisch sein â€” im Zweifel weissen Hintergrund verwenden.
- **Dateinamen:** Kleinbuchstaben, Unterstriche, keine Umlaute (z.B. `lorenzkurve_ch_2020.png`).

---

## 6. Arbeiten mit Claude: Typische Aufgaben

Dieses Projekt ist darauf ausgelegt, dass die inhaltliche Arbeit (Fragen erstellen, Pools aufbauen) mit UnterstÃ¼tzung von Claude stattfindet. Hier die wichtigsten Szenarien:

### 6.1 Neuen Ãœbungspool erstellen

**Was wird gebraucht:** Angaben zu Klasse/Stufe, Fachbereich, Themenbereich und idealerweise ein LearningView-Export (Word-Dokument) als Stoffgrundlage.

**Ablauf:**

1. LearningView-Export oder Themenbeschreibung an Claude geben.
2. Claude identifiziert die Unterthemen und schlÃ¤gt eine Struktur vor.
3. Struktur bestÃ¤tigen oder anpassen.
4. Claude erstellt die Config-Datei (`config/NAME.js`) mit allen Fragen.
5. Claude aktualisiert den Eintrag in `index.html`.
6. Beide Dateien auf GitHub hochladen.
7. Im Browser testen: `pool.html?pool=NAME`
8. Korrekturen iterativ mit Claude durchfÃ¼hren.
9. In LearningView verlinken.

**Prompt-Beispiel:**
> Erstelle einen neuen Ãœbungspool zum Thema "Vertragsrecht" fÃ¼r SF GYM2, Fachbereich Recht. Hier ist der LearningView-Export: [Datei hochladen]. Erstelle die Config-Datei und den aktualisierten index.html-Eintrag.

### 6.2 Bestehenden Pool erweitern

**Ablauf:**

1. Bestehende Config-Datei von GitHub herunterladen und an Claude geben.
2. GewÃ¼nschte ErgÃ¤nzungen beschreiben (z.B. "10 weitere Fragen zum Unterthema Kreislauf, Schwerpunkt K3â€“K4").
3. Claude ergÃ¤nzt die Fragen im `QUESTIONS`-Array.
4. Aktualisierte Config-Datei auf GitHub hochladen.

**Prompt-Beispiel:**
> Hier ist die aktuelle Config-Datei vwl_bip.js. ErgÃ¤nze 8 Fragen zum Unterthema "messprobleme", davon mindestens 2 Berechnungsaufgaben (calc) und 2 offene Fragen. Schwierigkeit 2â€“3.

### 6.3 Template erweitern

Ã„nderungen am Template (`pool.html`) wirken auf alle Pools gleichzeitig. FÃ¼r Template-Ã„nderungen muss die aktuelle `pool.html` an Claude Ã¼bergeben werden.

**Prompt-Beispiel:**
> Hier ist die aktuelle pool.html. FÃ¼ge einen neuen Fragetyp "Reihenfolge" (order) hinzu, bei dem SuS Begriffe in die richtige Reihenfolge bringen mÃ¼ssen.

### 6.4 Bilder erstellen lassen

Claude kann Bilder nicht direkt erstellen, aber:
- Diagramme als SVG oder HTML generieren, die dann als Screenshot gespeichert werden kÃ¶nnen.
- Beschreibungen liefern, die als Vorlage fÃ¼r eigene Grafiken dienen.
- Bestehende Bilder referenzieren und die `img`-Felder in den Config-Dateien ergÃ¤nzen.

---

## 7. Deployment: Von der Datei zum Live-Pool

### 7.1 GitHub Pages

Das Repository `durandbourjate/GYM-WR-DUY` ist mit GitHub Pages verbunden. Jede Datei, die auf den `main`-Branch hochgeladen wird, ist nach 30â€“60 Sekunden unter der GitHub Pages URL verfÃ¼gbar.

**Vorgehen beim Hochladen:**

1. Auf GitHub zum Repository navigieren.
2. In den richtigen Ordner wechseln (z.B. `Uebungen/Uebungspools/config/`).
3. "Add file" â†’ "Upload files" wÃ¤hlen.
4. Datei(en) hochladen und committen.
5. Unter "Actions" warten, bis der Build einen grÃ¼nen Haken zeigt.
6. URL im Browser testen.

### 7.2 Dateien, die bei verschiedenen Aktionen betroffen sind

| Aktion | Betroffene Dateien |
|---|---|
| Neue Fragen zu bestehendem Pool | `config/NAME.js` |
| Neuer Pool erstellen | `config/NAME.js` + `index.html` |
| Design/Layout Ã¤ndern | `pool.html` |
| Bild hinzufÃ¼gen | `img/{fach}/{thema}/BILD.png` + `config/NAME.js` |
| Ãœbersichtsseite anpassen | `index.html` |

### 7.3 Integration mit LearningView

Es gibt zwei EinbindungsmÃ¶glichkeiten:

**Als Weblink (Standard):** URL als Weblink-Anhang bei einer Aufgabe einfÃ¼gen. Der Link Ã¶ffnet sich in einem neuen Tab. FÃ¼r gezielte VerknÃ¼pfungen kÃ¶nnen Deep-Links mit dem `topic`-Parameter verwendet werden (â†’ Abschnitt 4.3).

**Als Iframe (Aufgabentyp Â«Interaktiv externÂ»):** Der Pool wird direkt in LearningView eingebettet. In diesem Modus sendet `pool.html` den Fortschritt automatisch via `window.parent.postMessage()` an LearningView â€” nach jeder beantworteten Frage und beim Quiz-Ende. Das Protokoll ist ein xAPI-Score-Objekt (`result.score.scaled` als Wert von 0 bis 1). Im Standalone-Betrieb (normaler Browseraufruf) wird kein `postMessage` gesendet; die PrÃ¼fung `window.parent===window` sorgt dafÃ¼r, dass es keine Seiteneffekte gibt.

Details zur postMessage-Implementierung: Siehe `learningview_integration.md`.

---

## 8. Technische Details

### 8.1 Wie pool.html funktioniert

1. SuS Ã¶ffnen eine URL wie `pool.html?pool=vwl_bip`.
2. `pool.html` liest den URL-Parameter `pool` aus.
3. Per `fetch()` wird die Datei `config/vwl_bip.js` geladen.
4. Der Inhalt wird als `<script>` in die Seite eingefÃ¼gt â†’ die globalen Variablen `POOL_META`, `TOPICS` und `QUESTIONS` stehen zur VerfÃ¼gung.
5. Basierend auf `POOL_META.color` wird das Farbschema gesetzt.
6. Die Chips (Filter) werden aus `TOPICS`, den vorhandenen Schwierigkeitsgraden und Fragetypen generiert.
7. Beim Quiz werden die Fragen gefiltert, sortiert oder gemischt, und einzeln angezeigt.

### 8.2 AbhÃ¤ngigkeiten

- **Google Fonts** (DM Sans, DM Mono) â€” mit system-ui als Fallback.
- **Keine Frameworks**, keine npm-Pakete, kein Build-Prozess.
- Funktioniert auf jedem modernen Browser (Desktop und Mobile).
- Dark Mode wird automatisch unterstÃ¼tzt (CSS `prefers-color-scheme`).

### 8.3 Wichtige Regeln fÃ¼r Config-Dateien

- **Variablen immer mit `window.` deklarieren** (`window.POOL_META = ...`), nicht mit `const` oder `let`. Grund: Die Datei wird per `fetch()` geladen und als Script-Element eingefÃ¼gt. Ohne `window.` sind die Variablen nicht global verfÃ¼gbar.
- **Topic-SchlÃ¼ssel** in `QUESTIONS` mÃ¼ssen exakt mit den SchlÃ¼sseln in `TOPICS` Ã¼bereinstimmen.
- **IDs** mÃ¼ssen innerhalb eines Pools eindeutig sein.
- **Keine HTML-Tags** in Fragetexten verwenden (ausser `<br>` fÃ¼r ZeilenumbrÃ¼che, falls nÃ¶tig).

---

## 9. HÃ¤ufige Fragen (FAQ)

### Ich mÃ¶chte nur eine einzelne Frage korrigieren. Was muss ich tun?

Die betreffende Config-Datei von GitHub herunterladen (z.B. `config/vwl_bip.js`), die Frage suchen (am einfachsten per ID, z.B. `d01`), die Ã„nderung vornehmen und die Datei wieder hochladen. `pool.html` muss nicht angefasst werden.

### Wie finde ich heraus, welche Pools es gibt?

Entweder die Ãœbersichtsseite Ã¶ffnen (`index.html`) oder auf GitHub in den Ordner `config/` schauen. Jede `.js`-Datei entspricht einem Pool.

### Kann ich einen Pool lÃ¶schen?

Ja. Die Config-Datei aus `config/` lÃ¶schen und den entsprechenden Eintrag im `POOLS`-Array in `index.html` entfernen. Bestehende Links auf den Pool werden dann eine Fehlermeldung zeigen.

### Was passiert, wenn ich pool.html Ã¤ndere?

Die Ã„nderung wirkt auf **alle** Pools gleichzeitig, da alle Pools dasselbe Template verwenden. Vor Ã„nderungen an `pool.html` sollte immer eine Kopie der aktuellen Version gesichert werden.

### Kann ich Bilder aus dem Internet verlinken statt sie auf GitHub abzulegen?

Technisch ja â€” im `img.src` einfach eine vollstÃ¤ndige URL angeben. Aber: Externe Bilder kÃ¶nnen verschwinden oder sich Ã¤ndern, und es gibt mÃ¶gliche CORS-Probleme. Es wird empfohlen, Bilder immer lokal im `img/`-Ordner abzulegen.

### Wie teste ich einen Pool lokal, bevor ich ihn auf GitHub lade?

Die Dateien lassen sich nicht direkt im Dateisystem Ã¶ffnen (wegen `fetch()`). Zwei MÃ¶glichkeiten:
1. **Direkt auf GitHub hochladen** und dort testen (einfachster Weg).
2. **Lokalen Webserver starten** (z.B. `python3 -m http.server` im Ordner) und im Browser `localhost:8000/pool.html?pool=NAME` Ã¶ffnen.

### UnterstÃ¼tzt das System auch Videos oder PDFs in Fragen?

Aktuell nur Bilder (PNG, JPG). FÃ¼r Videos oder PDFs wÃ¤re eine Erweiterung von `pool.html` nÃ¶tig â€” das Prinzip wÃ¤re gleich wie bei Bildern: ein optionales Feld im Frage-Objekt und eine Rendering-Funktion im Template.

### Wie kann ich die Reihenfolge der Pools auf der Ãœbersichtsseite Ã¤ndern?

Die Reihenfolge wird durch die Position im `POOLS`-Array in `index.html` bestimmt. EintrÃ¤ge umordnen und hochladen.

---

## 10. WeiterfÃ¼hrende Dokumente

| Dokument | Inhalt |
|---|---|
| **Anleitung_Uebungspools.md** | Technische Detailreferenz: Config-Format, alle Fragetypen mit Codebeispielen, Schwierigkeitsgrade, Taxonomiestufen, ID-Konventionen, QualitÃ¤tscheckliste. |
| **Anleitung_Pruefungen.md** | Vorgehen bei der Erstellung von PrÃ¼fungen (Word-Dokumente), Bewertungsraster, Dokumentformat. |
| **learningview_integration.md** | Technische Dokumentation der postMessage-Score-Ãœbermittlung (xAPI) fÃ¼r die Iframe-Einbettung in LearningView. |
| **Uebungspools_Deep_Links.md** | VollstÃ¤ndige Deep-Link-Ãœbersicht aller VWL-Pools mit Topic-SchlÃ¼sseln, Fragenzahlen und URL-Parametern. |
| **Projektanweisung (System Prompt)** | Kontext zu Schule, Klassen, Lehrplan, Fachbereichen und allgemeinen Arbeitsweisen. Wird als Projektanweisung im Claude-Projekt verwendet. |

---

## 11. Checkliste: Projekt Ã¼bernehmen

Wenn du dieses Projekt Ã¼bernimmst, solltest du folgende Dinge klÃ¤ren:

- [ ] Zugang zum GitHub-Repository `durandbourjate/GYM-WR-DUY` (Schreibrechte)
- [ ] Zugang zur Ãœbersichtsseite im Browser testen
- [ ] Mindestens einen bestehenden Pool Ã¶ffnen und durchspielen
- [ ] Einen Deep-Link mit `&keys=1` aufrufen und verstehen
- [ ] Die Config-Datei eines bestehenden Pools Ã¶ffnen und die Struktur nachvollziehen
- [ ] Eine kleine Ã„nderung vornehmen (z.B. Tippfehler in einer Frage korrigieren) und auf GitHub hochladen
- [ ] PrÃ¼fen, ob die Ã„nderung nach dem Deployment live ist
- [ ] Die **Anleitung_Uebungspools.md** lesen (technische Referenz)
- [ ] Das Claude-Projekt mit den hinterlegten Projektdokumenten kennenlernen
