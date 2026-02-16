# Anleitung: Modulare Übungspools erstellen und verwalten

## Zweck
Dieses Dokument beschreibt das **modulare Übungspool-System** für den Unterricht in Wirtschaft und Recht am Gymnasium Hofwil. Das System trennt das universelle Template (Layout, Logik, Design) von den themenspezifischen Daten (Fragen, Themen, Metadaten). Dadurch wird Layout einmal gepflegt und wirkt auf alle Pools, neue Fragen werden nur als Datendatei ergänzt.

Die Übungspools erlauben den SuS, selbstständig und individuell zu üben — mit sofortigem Feedback, wählbaren Filtern und einer Auswertung am Ende.

## Wann diese Anleitung anwenden
- Ein neuer Übungspool zu einem Themenbereich soll erstellt werden.
- Einem bestehenden Pool sollen Fragen hinzugefügt oder angepasst werden.
- Das Template (Layout, Funktionalität) soll für alle Pools angepasst werden.
- Die Übersichtsseite (index.html) soll aktualisiert werden.

---

## Architektur

### Dateistruktur auf GitHub

```
GYM-WR-DUY/
└── Uebungen/
    └── Uebungspools/
        ├── index.html          ← Übersichtsseite (listet alle Pools)
        ├── pool.html           ← Universelles Template (CSS + JS-Logik)
        └── config/
            ├── vwl_bip.js              ← Daten: BIP (60 Fragen)
            ├── vwl_beduerfnisse.js     ← Daten: Bedürfnisse (50 Fragen)
            ├── vwl_menschenbild.js     ← Daten: Menschenbild (49 Fragen)
            └── ...                     ← Weitere Pools
```

### Komponenten

| Datei | Funktion | Änderungshäufigkeit |
|---|---|---|
| `pool.html` | Template mit HTML, CSS und JavaScript-Logik. Lädt Daten per URL-Parameter. | Selten (nur bei Layout-/Funktionsänderungen) |
| `config/*.js` | Reine Datendateien: `POOL_META`, `TOPICS`, `QUESTIONS`. Kein HTML, kein CSS, keine Logik. | Häufig (neue Fragen, neue Pools) |
| `index.html` | Übersichtsseite mit `POOLS`-Array als Registry. | Bei jedem neuen Pool |

### URL-Schema

Die SuS rufen immer `pool.html` mit dem URL-Parameter `?pool=NAME` auf:

```
https://durandbourjate.github.io/GYM-WR-DUY/Uebungen/Uebungspools/pool.html?pool=vwl_bip
```

Der Parameter `pool` bestimmt, welche Config-Datei geladen wird (`config/vwl_bip.js`).

**Aktuelle Pool-URLs:**
- `pool.html?pool=vwl_beduerfnisse` → Bedürfnisse, Knappheit & Produktionsfaktoren (SF GYM1)
- `pool.html?pool=vwl_menschenbild` → Ökonomisches Menschenbild (SF GYM1)
- `pool.html?pool=vwl_bip` → Bruttoinlandprodukt (EWR GYM2)
- Übersicht: `index.html`

### Farbsystem

Die Fachbereichsfarbe wird automatisch über `POOL_META.color` gesetzt:

| Fachbereich | Schlüssel | Primary | Primary Light | LV-Farbe |
|---|---|---|---|---|
| VWL | `vwl` | `#f89907` | `#ffb74d` | Orange (8) |
| BWL | `bwl` | `#01a9f4` | `#4fc3f7` | Blau (1) |
| Recht | `recht` | `#73ab2c` | `#8bc34a` | Grün (5) |

---

## Config-Datei: Struktur und Format

Jede Config-Datei (`config/*.js`) enthält genau drei Variablen. **Wichtig: Alle Variablen müssen mit `window.` deklariert werden**, damit sie als globale Variablen verfügbar sind.

### POOL_META

```javascript
window.POOL_META = {
  id: "vwl_bip",                                    // Dateiname ohne .js
  fach: "VWL",                                       // VWL, BWL oder Recht
  title: "Übungspool: Bruttoinlandprodukt (BIP)",    // Angezeigter Titel
  meta: "EWR GYM2 · Gymnasium Hofwil · Individuell üben",  // Untertitel
  color: "vwl"                                       // Farbschema: vwl, bwl, recht
};
```

### TOPICS

```javascript
window.TOPICS = {
  definition: {label:"Definition & Grundbegriffe", short:"Definition"},
  messprobleme: {label:"Was das BIP (nicht) misst", short:"Messprobleme"},
  dreiseiten: {label:"Drei Seiten des BIP", short:"3 Seiten"},
  nomreal: {label:"Nominales & Reales BIP", short:"Nom./Real"},
  kreislauf: {label:"Wirtschaftskreislauf", short:"Kreislauf"},
  verteilung: {label:"Verteilung & Ungleichheit", short:"Verteilung"},
  wachstum: {label:"Wachstum & Nachhaltigkeit", short:"Wachstum"}
};
```

- `label`: Vollständiger Name (Auswertung, Tooltips)
- `short`: Kurzform (Filter-Chips, Badges)
- Die Schlüssel (z.B. `definition`) werden in den Fragen als `topic` referenziert.

### QUESTIONS

Array von Frage-Objekten. Jede Frage hat folgende Pflichtfelder:

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | String | Eindeutige ID im Pool (z.B. `"d01"`) |
| `topic` | String | Schlüssel aus TOPICS (z.B. `"definition"`) |
| `type` | String | Fragetyp: `mc`, `tf`, `fill`, `calc`, `sort`, `open` |
| `diff` | Number | Schwierigkeit: `1` (einfach), `2` (mittel), `3` (schwer) |
| `tax` | String | Taxonomiestufe: `"K1"` bis `"K6"` |
| `q` | String | Fragetext |
| `explain` | String | Erklärung (nach Beantwortung angezeigt) |

---

## Fragetypen im Detail

### Multiple Choice (`mc`)

```javascript
{id:"d01", topic:"definition", type:"mc", diff:1, tax:"K1",
 q:"Was misst das Bruttoinlandprodukt (BIP)?",
 options:[
   {v:"A", t:"Den Marktwert aller Endprodukte eines Jahres."},
   {v:"B", t:"Den Wert aller Importe und Exporte."},
   {v:"C", t:"Den Wert aller Exporte eines Landes."},
   {v:"D", t:"Das Gesamtvermögen aller Einwohner."}
 ],
 correct:"A",
 explain:"Das BIP entspricht dem Marktwert aller Endprodukte."
}
```

### Richtig/Falsch (`tf`)

```javascript
{id:"d02", topic:"definition", type:"tf", diff:1, tax:"K1",
 q:"Vorleistungen werden beim BIP abgezogen, um Doppelzählungen zu vermeiden.",
 correct:true,
 explain:"Korrekt. Ohne Abzug würde der Wert auf jeder Produktionsstufe erneut gezählt."
}
```

### Lückentext (`fill`)

```javascript
{id:"s01", topic:"dreiseiten", type:"fill", diff:1, tax:"K1",
 q:"Die VWL beschäftigt sich mit dem Problem der {0}. Sie entsteht, weil die {1} unbegrenzt sind, die {2} aber begrenzt.",
 blanks:[
   {answer:"Knappheit", alts:[]},
   {answer:"Bedürfnisse", alts:["Wünsche"]},
   {answer:"Mittel", alts:["Güter","Ressourcen"]}
 ],
 explain:"Unbegrenzte Bedürfnisse treffen auf begrenzte Mittel."
}
```

- `{0}`, `{1}`, etc. = Platzhalter im Fragetext
- `answer` = korrekte Antwort
- `alts` = akzeptierte Alternativen (Gross-/Kleinschreibung wird ignoriert)

### Berechnung (`calc`)

```javascript
{id:"n03", topic:"nomreal", type:"calc", diff:2, tax:"K3",
 q:"Das nominale BIP beträgt CHF 700 Mrd., der BIP-Deflator liegt bei 105. Berechnen Sie:",
 rows:[
   {label:"Reales BIP (in Mrd. CHF)", answer:666.67, tolerance:0.5, unit:"Mrd. CHF"},
   {label:"Inflationsrate", answer:5.0, tolerance:0.1, unit:"%"}
 ],
 explain:"Reales BIP = Nominales BIP / Deflator × 100 = 700/105×100 = 666.67"
}
```

- `tolerance` = akzeptierte Abweichung (±)
- `rows` = mehrere Teilaufgaben möglich

### Zuordnung (`sort`)

```javascript
{id:"m07", topic:"messprobleme", type:"sort", diff:2, tax:"K2",
 q:"Ordnen Sie zu, ob die folgenden Aktivitäten im BIP erfasst werden.",
 categories:["Im BIP erfasst", "Nicht im BIP erfasst"],
 items:[
   {t:"Arztbesuch", cat:0},
   {t:"Hausarbeit", cat:1},
   {t:"Nachhilfe (schwarz)", cat:1},
   {t:"Autokauf beim Händler", cat:0}
 ],
 explain:"Nur über den Markt gehandelte Leistungen werden im BIP erfasst."
}
```

- `cat` = Index der Zielkategorie (0-basiert)
- Funktioniert per Select-then-Place (Tap auf Begriff, dann Tap auf Kategorie)

### Offene Frage (`open`)

```javascript
{id:"d05", topic:"definition", type:"open", diff:2, tax:"K2",
 q:"Erklären Sie in eigenen Worten, warum Vorleistungen abgezogen werden.",
 sample:"Vorleistungen werden abgezogen, um Doppelzählungen zu vermeiden. Das BIP soll nur die tatsächliche Wertschöpfung jeder Stufe erfassen.",
 explain:"Beispiel: Mehl (CHF 2) → Brot (CHF 5) → Wertschöpfung = CHF 3."
}
```

- `sample` = Lösungsvorschlag (vor der Selbsteinschätzung angezeigt)
- `explain` = zusätzliche Vertiefung
- SuS schätzen sich selbst ein: "Gewusst" / "Nicht gewusst"

---

## Schwierigkeitsgrade

| Stufe | Wert | Symbol | Beschreibung |
|---|---|---|---|
| Einfach | `1` | ⭐ | Grundwissen, Definitionen, direkte Fakten (K1–K2) |
| Mittel | `2` | ⭐⭐ | Zusammenhänge verstehen, einfache Anwendung (K2–K3) |
| Schwer | `3` | ⭐⭐⭐ | Transfer, Analyse, Beurteilung neuer Situationen (K3–K5) |

Verteilung: ca. 40% einfach, 40% mittel, 20% schwer.

## Taxonomiestufen

| Stufe | Bezeichnung | Typische Fragetypen |
|---|---|---|
| K1 | Wissen | MC, TF, Fill |
| K2 | Verstehen | MC, TF, Fill, Sort, Open |
| K3 | Anwenden | MC, Calc, Sort |
| K4 | Analysieren | MC, Open |
| K5 | Beurteilen | Open |
| K6 | Gestalten | Open |

## ID-Konvention

- Erstes Zeichen: Kürzel des Unterthemas (z.B. `d` für Definition, `m` für Messprobleme)
- Zwei Ziffern: Laufnummer (z.B. `d01`, `d02`, `m01`)
- IDs müssen innerhalb eines Pools eindeutig sein.
- Kommentare im QUESTIONS-Array helfen bei der Orientierung:

```javascript
window.QUESTIONS = [
// ── DEFINITION (d01–d10) ──
{id:"d01", ...},
{id:"d02", ...},
// ── MESSPROBLEME (m01–m08) ──
{id:"m01", ...},
```

---

## Vorgehen: Neuen Pool erstellen

### 1. Klärung

Folgende Angaben sind nötig:
- **Klasse und Stufe**: z.B. EWR GYM2, SF GYM1
- **Gefäss**: SF, EWR oder EF
- **Fachbereich**: Recht, BWL oder VWL
- **Themenbereich**: z.B. "BIP", "Vertragsrecht"
- **Stoffgrundlage**: LearningView-Export als .docx oder Beschreibung der Inhalte

### 2. Unterthemen identifizieren

- Aus dem LearningView-Export die Unterthemen identifizieren (typisch 4–8 pro Pool).
- Jedes Unterthema erhält einen kurzen Schlüssel (z.B. `definition`, `messprobleme`).
- K1–K2-Fragen beziehen sich direkt auf das Unterrichtsmaterial.
- K3–K6-Fragen dürfen auf neuen Beispielen und Situationen basieren.

### 3. Aufgabenpool erstellen

#### Umfang
- Mindestens 30 Aufgaben pro Pool, besser 40–60.
- Jedes Unterthema mindestens 4–6 Aufgaben.
- Alle 6 Fragetypen verwenden, Schwerpunkt auf MC und TF.
- Offene Fragen gezielt für höhere Taxonomiestufen (K2–K5).

#### Erklärungen
**Jede Aufgabe muss eine Erklärung haben** (`explain`), die nach dem Beantworten angezeigt wird:
- Bei korrekter Antwort: Lösungsweg bestätigen und vertiefen.
- Bei falscher Antwort: Fehler erklären und korrekte Antwort begründen.
- Fachlich präzis und verständlich formuliert.
- Bei Recht: Gesetzesartikel referenzieren.

### 4. Config-Datei erstellen

Neue Datei im Ordner `config/` erstellen, z.B. `config/bwl_unternehmensformen.js`:

```javascript
// Übungspool: Unternehmensformen
// Fachbereich: BWL
// Anzahl Fragen: 45

window.POOL_META = {
  id: "bwl_unternehmensformen",
  fach: "BWL",
  title: "Übungspool: Unternehmensformen",
  meta: "SF GYM1 · Gymnasium Hofwil · Individuell üben",
  color: "bwl"
};

window.TOPICS = {
  einzelunternehmen: {label:"Einzelunternehmen", short:"Einzelunt."},
  kollektiv: {label:"Kollektivgesellschaft", short:"KolG"},
  ag: {label:"Aktiengesellschaft", short:"AG"},
  gmbh: {label:"GmbH", short:"GmbH"},
  vergleich: {label:"Rechtsformvergleich", short:"Vergleich"}
};

window.QUESTIONS = [
// ── EINZELUNTERNEHMEN (e01–e09) ──
{id:"e01", topic:"einzelunternehmen", type:"mc", diff:1, tax:"K1",
 q:"...",
 options:[...],
 correct:"A",
 explain:"..."},
// ...
];
```

### 5. index.html aktualisieren

Neuen Eintrag im `POOLS`-Array in `index.html` hinzufügen:

```javascript
{
  id: "bwl_unternehmensformen",
  fach: "BWL",
  title: "Unternehmensformen",
  meta: "SF GYM1",
  questions: 45,
  topics: 5
},
```

### 6. Auf GitHub hochladen

1. Config-Datei in `Uebungen/Uebungspools/config/` hochladen
2. Aktualisierte `index.html` hochladen
3. Warten bis GitHub Actions "pages build and deployment" grünen Haken zeigt (30–60 Sek.)
4. URL testen: `pool.html?pool=bwl_unternehmensformen`

### 7. In LearningView verlinken

URL als Weblink bei einer Aufgabe einfügen (öffnet sich in neuem Tab).

---

## Vorgehen: Bestehenden Pool erweitern

### Fragen hinzufügen

1. Config-Datei öffnen (z.B. `config/vwl_bip.js`)
2. Neue Fragen-Objekte ans Ende des `QUESTIONS`-Arrays einfügen
3. Kommentar-Header im Array aktualisieren (z.B. Anzahl Fragen)
4. Auf GitHub hochladen — fertig. `pool.html` muss nicht angepasst werden.

### Fragen anpassen

1. Config-Datei öffnen
2. Betreffendes Frage-Objekt finden (Suche nach ID)
3. Änderungen vornehmen
4. Auf GitHub hochladen

---

## Vorgehen: Template anpassen

Änderungen an `pool.html` wirken auf **alle Pools gleichzeitig**:

- Layout/CSS ändern → `pool.html` bearbeiten
- Neue Fragetypen → JavaScript-Logik in `pool.html` erweitern
- Neue Filter → `pool.html` anpassen

Keine Config-Dateien müssen angefasst werden.

---

## UI-Struktur

### Startbildschirm
- **Home-Button** (🏠) im Header → Link zur Übersichtsseite (`index.html`)
- **Modus-Wahl**: Fokus oder Mix
  - **Fokus**: Unterthema und Schwierigkeit müssen gewählt werden. Aufgaben nach Schwierigkeit sortiert.
  - **Mix**: Alles vorausgewählt. Aufgaben zufällig gemischt.
- **Filter-Chips**: Unterthema, Schwierigkeit und Fragetyp. Live-Anzeige der Aufgabenanzahl.
- **Start-Button**: Erst aktiv, wenn mindestens 1 Aufgabe den Filtern entspricht.

### Quiz-Ablauf
- Immer nur eine Aufgabe sichtbar.
- Sofortiges Feedback mit Erklärung (grün/rot).
- "Nächste Aufgabe" erscheint erst nach Beantwortung.
- "Übung beenden" jederzeit sichtbar.
- Fortschrittsbalken und Punktestand oben.

### Auswertung
- Gesamtpunktzahl und Prozent.
- Aufschlüsselung nach Unterthema (grün ≥70%, gelb ≥40%, rot <40%).
- Liste der falsch beantworteten Fragen mit Erklärungen.
- PDF-Export via `window.print()`.
- "Neue Übung starten"-Button.

---

## Qualitätskontrolle

Vor der Fertigstellung prüfen:
- [ ] Mindestens 30 Aufgaben im Pool
- [ ] Alle Unterthemen abgedeckt (min. 4 Aufgaben pro Unterthema)
- [ ] Schwierigkeitsgrade verteilt (1, 2 und 3)
- [ ] Mindestens 3 verschiedene Fragetypen verwendet
- [ ] Taxonomiestufen variiert (mindestens K1–K4)
- [ ] Jede Aufgabe hat eine verständliche Erklärung
- [ ] Fachlich korrekt und lehrplankonform
- [ ] Bei Recht: Gesetzesartikel referenziert
- [ ] Schweizerische Terminologie verwendet
- [ ] Alle IDs eindeutig
- [ ] Variablen mit `window.` deklariert (nicht `const`)
- [ ] POOL_META.color korrekt gesetzt (vwl/bwl/recht)
- [ ] Topic-Schlüssel in QUESTIONS stimmen mit TOPICS überein
- [ ] index.html POOLS-Array aktualisiert
- [ ] Im Browser getestet (Desktop + Mobile)
- [ ] Zuordnungsaufgaben funktionieren auf Touchscreens

---

## Workflow: Vom LearningView-Export zum Übungspool

1. **Lehrer lädt LearningView-Export hoch** (Word-Dokument mit Bausteinen)
2. **Claude analysiert die Bausteine** und identifiziert Unterthemen
3. **Claude schlägt die Unterthemen-Struktur vor** (mit Labels und Kürzeln)
4. **Lehrer bestätigt** oder passt an
5. **Claude erstellt die Config-Datei** (`config/NAME.js` mit POOL_META, TOPICS, QUESTIONS)
6. **Lehrer testet** via `pool.html?pool=NAME` im Browser
7. **Iterative Anpassung**: Fragen korrigieren, ergänzen, Schwierigkeit anpassen
8. **Claude aktualisiert index.html** (neuer Eintrag im POOLS-Array)
9. **Lehrer lädt Config-Datei und index.html auf GitHub** hoch und verlinkt in LearningView

---

## Hosting und Integration

### GitHub Pages
- Repository: `durandbourjate/GYM-WR-DUY`
- Basis-URL: `https://durandbourjate.github.io/GYM-WR-DUY/Uebungen/Uebungspools/`
- Deployment: Automatisch via GitHub Actions nach jedem Commit (30–60 Sek.)
- Status prüfen: Repository → Tab "Actions" → grüner Haken = live

### LearningView
- URL als Weblink-Anhang bei einer Aufgabe einfügen
- Öffnet sich in neuem Tab (kein iFrame nötig)

### Technische Anforderungen
- Einzige externe Abhängigkeit: Google Fonts (Fallback auf system-ui)
- Keine Frameworks, keine npm-Pakete, kein Build-Prozess
- `pool.html` lädt Config per `fetch()` und fügt den Code als Inline-Script ein
- Dark Mode wird automatisch unterstützt (CSS media query)
