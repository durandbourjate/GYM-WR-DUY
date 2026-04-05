import type { Frage } from '../types/fragen.ts'

const jetzt = '2026-04-05T00:00:00.000Z'
const autor = 'yannick.durand@gymhofwil.ch'

// ═══════════════════════════════════════════════════════════════
// Einführungsübung — ExamLab Üben kennenlernen
// Tags: einrichtung, uebung
// Fächerunabhängig, kein Fachwissen nötig
// ═══════════════════════════════════════════════════════════════

export const einrichtungsUebungFragen: Frage[] = [
  // ═══════════════════════════════════════════════════════
  // TEIL A: Orientierung in der Übung
  // ═══════════════════════════════════════════════════════

  // A1 — MC Single: Orientierung auf der Übungsoberfläche
  {
    id: 'ueb-mc-orientierung',
    typ: 'mc',
    version: 1,
    erstelltAm: jetzt,
    geaendertAm: jetzt,
    fachbereich: 'VWL',
    fach: 'Wirtschaft & Recht',
    thema: 'Einrichtung',
    unterthema: 'Orientierung',
    bloom: 'K1',
    semester: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
    gefaesse: ['SF', 'EF', 'EWR', 'GF'],
    tags: ['einrichtung', 'uebung'],
    punkte: 1,
    zeitbedarf: 1,
    musterlosung: 'Die Übung hat 8 Fragen — sichtbar in der Navigationsleiste unten.',
    bewertungsraster: [{ beschreibung: 'Korrekte Antwort gewählt', punkte: 1 }],
    verwendungen: [],
    quelle: 'manuell',
    autor,
    fragetext: 'Schauen Sie sich die Übungsoberfläche an. **Wie viele Fragen** hat diese Einführungsübung insgesamt? Tipp: Schauen Sie auf die Navigationsleiste am unteren Bildschirmrand.',
    optionen: [
      { id: 'a', text: '5 Fragen', korrekt: false },
      { id: 'b', text: '8 Fragen', korrekt: true },
      { id: 'c', text: '12 Fragen', korrekt: false },
      { id: 'd', text: '20 Fragen', korrekt: false },
    ],
    mehrfachauswahl: false,
    zufallsreihenfolge: false,
  },

  // A2 — MC Multiple: UI-Elemente erkennen
  {
    id: 'ueb-mc-uielemente',
    typ: 'mc',
    version: 1,
    erstelltAm: jetzt,
    geaendertAm: jetzt,
    fachbereich: 'BWL',
    fach: 'Wirtschaft & Recht',
    thema: 'Einrichtung',
    unterthema: 'UI-Elemente',
    bloom: 'K1',
    semester: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
    gefaesse: ['SF', 'EF', 'EWR', 'GF'],
    tags: ['einrichtung', 'uebung'],
    punkte: 2,
    zeitbedarf: 2,
    musterlosung: 'Sichtbar: Stoppuhr/Timer, Fortschrittsbalken, Navigationsleiste unten. Nicht sichtbar: Druckknopf (gibt es nicht).',
    bewertungsraster: [
      { beschreibung: 'Alle 3 korrekten Elemente gewählt', punkte: 2 },
      { beschreibung: '2 korrekte Elemente gewählt', punkte: 1 },
    ],
    verwendungen: [],
    quelle: 'manuell',
    autor,
    fragetext: 'Welche der folgenden Elemente sehen Sie **auf Ihrem Bildschirm**? Schauen Sie sich um! (Mehrere Antworten möglich)',
    optionen: [
      { id: 'a', text: 'Eine Stoppuhr oder einen Timer (oben)', korrekt: true },
      { id: 'b', text: 'Einen Fortschrittsbalken', korrekt: true },
      { id: 'c', text: 'Eine Navigationsleiste mit Fragennummern (unten)', korrekt: true },
      { id: 'd', text: 'Einen Druckknopf zum Ausdrucken der Übung', korrekt: false },
    ],
    mehrfachauswahl: true,
    zufallsreihenfolge: false,
  },

  // A3 — Richtig/Falsch: Tool-Aussagen
  {
    id: 'ueb-rf-toolfunktionen',
    typ: 'richtigfalsch',
    version: 1,
    erstelltAm: jetzt,
    geaendertAm: jetzt,
    fachbereich: 'Recht',
    fach: 'Wirtschaft & Recht',
    thema: 'Einrichtung',
    unterthema: 'Tool-Funktionen',
    bloom: 'K2',
    semester: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
    gefaesse: ['SF', 'EF', 'EWR', 'GF'],
    tags: ['einrichtung', 'uebung'],
    punkte: 4,
    zeitbedarf: 3,
    musterlosung: '1: Richtig (Rücknavigation ist aktiviert). 2: Richtig (AutoSave alle 30s). 3: Falsch (man kann frei navigieren). 4: Richtig (Dark Mode ist verfügbar).',
    bewertungsraster: [
      { beschreibung: 'Alle 4 korrekt', punkte: 4 },
      { beschreibung: '3 korrekt', punkte: 3 },
      { beschreibung: '2 korrekt', punkte: 2 },
      { beschreibung: '1 korrekt', punkte: 1 },
    ],
    verwendungen: [],
    quelle: 'manuell',
    autor,
    fragetext: 'Beurteilen Sie die folgenden Aussagen über ExamLab als **richtig** oder **falsch**.',
    aussagen: [
      { id: '1', text: 'Man kann zwischen Fragen vor- und zurücknavigieren.', korrekt: true, erklaerung: 'Rücknavigation ist bei dieser Übung aktiviert.' },
      { id: '2', text: 'Die Antworten werden automatisch gespeichert (AutoSave).', korrekt: true, erklaerung: 'AutoSave speichert alle 30 Sekunden.' },
      { id: '3', text: 'Man muss die Fragen zwingend in der vorgegebenen Reihenfolge lösen.', korrekt: false, erklaerung: 'Man kann über die Navigationsleiste zu jeder Frage springen.' },
      { id: '4', text: 'Es gibt einen Dark Mode (dunkles Farbschema).', korrekt: true, erklaerung: 'Dark Mode kann über das Theme-Toggle-Symbol umgeschaltet werden.' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // TEIL B: Texteingabe testen
  // ═══════════════════════════════════════════════════════

  // B1 — Freitext kurz: Formatierung testen
  {
    id: 'ueb-ft-formatierung',
    typ: 'freitext',
    version: 1,
    erstelltAm: jetzt,
    geaendertAm: jetzt,
    fachbereich: 'VWL',
    fach: 'Wirtschaft & Recht',
    thema: 'Einrichtung',
    unterthema: 'Textformatierung',
    bloom: 'K1',
    semester: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
    gefaesse: ['SF', 'EF', 'EWR', 'GF'],
    tags: ['einrichtung', 'uebung'],
    punkte: 2,
    zeitbedarf: 2,
    musterlosung: 'Ein Satz mit einem fetten und einem kursiven Wort, z.B.: «Ich teste gerade ExamLab und finde es spannend.»',
    bewertungsraster: [
      { beschreibung: 'Ein Wort ist fett formatiert', punkte: 1 },
      { beschreibung: 'Ein Wort ist kursiv formatiert', punkte: 1 },
    ],
    verwendungen: [],
    quelle: 'manuell',
    autor,
    fragetext: 'Schreiben Sie einen kurzen Satz (frei wählbarer Inhalt). Formatieren Sie dabei **ein Wort fett** und *ein Wort kursiv*.\n\n💡 **Tipp:** Nutzen Sie die Formatierungsleiste über dem Textfeld oder die Tastenkürzel Ctrl+B (fett) und Ctrl+I (kursiv).',
    laenge: 'kurz',
    hilfstextPlaceholder: 'Schreiben Sie hier Ihren Satz...',
  },

  // B2 — Lückentext: Gymnasium Hofwil
  {
    id: 'ueb-lt-hofwil',
    typ: 'lueckentext',
    version: 1,
    erstelltAm: jetzt,
    geaendertAm: jetzt,
    fachbereich: 'Recht',
    fach: 'Wirtschaft & Recht',
    thema: 'Einrichtung',
    unterthema: 'Lückentext',
    bloom: 'K1',
    semester: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
    gefaesse: ['SF', 'EF', 'EWR', 'GF'],
    tags: ['einrichtung', 'uebung'],
    punkte: 3,
    zeitbedarf: 2,
    musterlosung: 'Hofwil, Münchenbuchsee, Bern',
    bewertungsraster: [
      { beschreibung: 'Alle 3 Lücken korrekt', punkte: 3 },
      { beschreibung: '2 Lücken korrekt', punkte: 2 },
      { beschreibung: '1 Lücke korrekt', punkte: 1 },
    ],
    verwendungen: [],
    quelle: 'manuell',
    autor,
    fragetext: 'Ergänzen Sie die Lücken. Tippen Sie die fehlenden Wörter in die Eingabefelder.',
    textMitLuecken: 'Das Gymnasium {{1}} liegt in der Gemeinde {{2}} im Kanton {{3}}.',
    luecken: [
      { id: '1', korrekteAntworten: ['Hofwil'], caseSensitive: false },
      { id: '2', korrekteAntworten: ['Münchenbuchsee', 'Muenchenbuchsee'], caseSensitive: false },
      { id: '3', korrekteAntworten: ['Bern'], caseSensitive: false },
    ],
  },

  // B3 — Zuordnung: Emojis
  {
    id: 'ueb-zu-emojis',
    typ: 'zuordnung',
    version: 1,
    erstelltAm: jetzt,
    geaendertAm: jetzt,
    fachbereich: 'VWL',
    fach: 'Wirtschaft & Recht',
    thema: 'Einrichtung',
    unterthema: 'Zuordnung',
    bloom: 'K1',
    semester: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
    gefaesse: ['SF', 'EF', 'EWR', 'GF'],
    tags: ['einrichtung', 'uebung'],
    punkte: 4,
    zeitbedarf: 2,
    musterlosung: '🎓 → Bildung, 🏔️ → Berge, 🧀 → Käse, 🕐 → Uhren',
    bewertungsraster: [
      { beschreibung: 'Alle 4 korrekt', punkte: 4 },
      { beschreibung: '3 korrekt', punkte: 3 },
      { beschreibung: '2 korrekt', punkte: 2 },
      { beschreibung: '1 korrekt', punkte: 1 },
    ],
    verwendungen: [],
    quelle: 'manuell',
    autor,
    fragetext: 'Ordnen Sie die Emojis den passenden Begriffen zu. Verwenden Sie dafür die **Dropdown-Menüs** auf der rechten Seite.',
    paare: [
      { links: '🎓 Emoji 1', rechts: 'Bildung' },
      { links: '🏔️ Emoji 2', rechts: 'Berge' },
      { links: '🧀 Emoji 3', rechts: 'Käse' },
      { links: '🕐 Emoji 4', rechts: 'Uhren' },
    ],
    zufallsreihenfolge: true,
  },

  // ═══════════════════════════════════════════════════════
  // TEIL C: Mastery-System & Features
  // ═══════════════════════════════════════════════════════

  // C1 — MC Multiple: Mastery-System verstehen (NEU)
  {
    id: 'ueb-mc-mastery',
    typ: 'mc',
    version: 1,
    erstelltAm: jetzt,
    geaendertAm: jetzt,
    fachbereich: 'BWL',
    fach: 'Wirtschaft & Recht',
    thema: 'Einrichtung',
    unterthema: 'Mastery-System',
    bloom: 'K2',
    semester: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
    gefaesse: ['SF', 'EF', 'EWR', 'GF'],
    tags: ['einrichtung', 'uebung'],
    punkte: 4,
    zeitbedarf: 3,
    musterlosung: 'Korrekt: 4 Stufen (neu → üben → gefestigt → gemeistert), Sessions-basiert, Dauerbaustellen werden eingestreut. Falsch: Tage-basiert.',
    bewertungsraster: [
      { beschreibung: 'Alle 3 korrekten Aussagen gewählt', punkte: 4 },
      { beschreibung: '2 korrekte Aussagen gewählt', punkte: 2 },
      { beschreibung: '1 korrekte Aussage gewählt', punkte: 1 },
    ],
    verwendungen: [],
    quelle: 'manuell',
    autor,
    fragetext: 'ExamLab Üben verwendet ein **Mastery-System**, um Ihren Lernfortschritt zu verfolgen. Lesen Sie die folgenden Aussagen und kreuzen Sie alle **korrekten** an.\n\n**Info:** Das System hat 4 Stufen: **neu** → **üben** → **gefestigt** → **gemeistert**. Der Fortschritt basiert auf Sessions (Übungssitzungen), nicht auf vergangenen Tagen. Fragen, die Ihnen dauerhaft Mühe bereiten (sogenannte «Dauerbaustellen»), werden regelmässig eingestreut, damit Sie sie nicht vergessen.',
    optionen: [
      { id: 'a', text: 'Es gibt 4 Mastery-Stufen: neu, üben, gefestigt, gemeistert.', korrekt: true },
      { id: 'b', text: 'Der Fortschritt wird automatisch durch Warten (Tage) erreicht.', korrekt: false },
      { id: 'c', text: 'Der Fortschritt basiert auf Sessions — je mehr Sie üben, desto schneller steigen Sie auf.', korrekt: true },
      { id: 'd', text: 'Dauerbaustellen (persistente Schwächen) werden regelmässig eingestreut, damit man sie nicht vergisst.', korrekt: true },
    ],
    mehrfachauswahl: true,
    zufallsreihenfolge: false,
  },

  // C2 — MC Multiple: Features ausprobieren
  {
    id: 'ueb-mc-features',
    typ: 'mc',
    version: 1,
    erstelltAm: jetzt,
    geaendertAm: jetzt,
    fachbereich: 'VWL',
    fach: 'Wirtschaft & Recht',
    thema: 'Einrichtung',
    unterthema: 'Features',
    bloom: 'K2',
    semester: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
    gefaesse: ['SF', 'EF', 'EWR', 'GF'],
    tags: ['einrichtung', 'uebung'],
    punkte: 2,
    zeitbedarf: 3,
    musterlosung: 'Alle 4 Funktionen sollten funktionieren: Dark Mode, Frage markieren, Tastaturkürzel, Navigation.',
    bewertungsraster: [
      { beschreibung: 'Alle 4 Features angekreuzt', punkte: 2 },
      { beschreibung: '2–3 Features angekreuzt', punkte: 1 },
    ],
    verwendungen: [],
    quelle: 'manuell',
    autor,
    fragetext: '**Feature-Check!** Probieren Sie die folgenden Funktionen aus und kreuzen Sie an, welche **funktioniert** haben:\n\n- **Dark Mode**: Klicken Sie auf das Mond/Sonnen-Symbol oben\n- **Frage markieren**: Klicken Sie auf den «?»-Button (Unsicher) bei einer Frage\n- **Tastaturkürzel**: Drücken Sie Cmd+Enter (Mac) oder Ctrl+Enter (Windows), um zur nächsten Frage zu springen\n- **Navigation**: Klicken Sie auf eine Fragennummer in der Navigationsleiste unten\n\nKreuzen Sie **alle** an, die funktioniert haben:',
    optionen: [
      { id: 'a', text: 'Dark Mode umschalten hat funktioniert', korrekt: true },
      { id: 'b', text: 'Frage markieren hat funktioniert', korrekt: true },
      { id: 'c', text: 'Tastaturkürzel (Ctrl+Enter) hat funktioniert', korrekt: true },
      { id: 'd', text: 'Direkte Navigation über Fragennummern hat funktioniert', korrekt: true },
    ],
    mehrfachauswahl: true,
    zufallsreihenfolge: false,
  },
]
