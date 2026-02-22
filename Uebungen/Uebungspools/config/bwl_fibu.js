// ============================================================
// BWL Finanzbuchhaltung (FIBU) – Einführung in die doppelte Buchhaltung
// Kapitel 1–5, 7, 8, 12, 13 (HEP Einführung in die Finanzbuchhaltung)
// Pool für SF GYM1–GYM2, Zyklus 1
// ============================================================

window.POOL_META = {
  title: "Finanzbuchhaltung (FIBU)",
  fach: "BWL",
  color: "#01a9f4",
  level: "SF GYM1–GYM2",
  lernziele: [
    "Ich kann die Aufgaben und Grundsätze der Finanzbuchhaltung erklären. (K2)",
    "Ich kann eine korrekt gegliederte Bilanz erstellen und die Bilanzgleichung anwenden. (K3)",
    "Ich kann Geschäftsfälle in Buchungssätze übersetzen und auf T-Konten verbuchen. (K3)",
    "Ich kann die Erfolgsrechnung (ein- und zweistufig) erstellen und den Jahreserfolg ermitteln. (K3)",
    "Ich kann die Konten des Eigentümers (Eigenkapital, Privat) korrekt führen. (K3)",
    "Ich kann Warenkonten inkl. Bestandesänderung führen und die dreistufige Erfolgsrechnung erstellen. (K3)",
    "Ich kann Wertberichtigungen (Abschreibungen, Delkredere) und Rechnungsabgrenzungen verbuchen. (K3)"
  ]
};

window.TOPICS = {
  "grundlagen":        {label: "Grundlagen der Buchhaltung", short: "Grundlagen", lernziele: [
    "Ich kann die Aufgaben der Finanzbuchhaltung aufzählen und erklären. (K1)",
    "Ich kann die gesetzliche Buchführungspflicht gemäss OR 957 erklären. (K2)",
    "Ich kann die wichtigsten Grundsätze ordnungsmässiger Buchführung (GoB) nennen und erläutern. (K2)",
    "Ich kann den Aufbau des KMU-Kontenrahmens (Kontenklassen 1–9) beschreiben. (K2)",
    "Ich kann Journal, Hauptbuch und Kontierung unterscheiden und ihre Funktion erklären. (K2)"
  ]},
  "bilanz":            {label: "Bilanz, Inventar & Bewertung", short: "Bilanz", lernziele: [
    "Ich kann Aktiven und Passiven korrekt gliedern (Umlauf-/Anlagevermögen, kurz-/langfristiges FK, EK). (K2)",
    "Ich kann eine Bilanz aus gegebenen Konten korrekt erstellen. (K3)",
    "Ich kann das Inventar als Grundlage der Bilanz erklären. (K2)",
    "Ich kann das Niederstwertprinzip bei der Bewertung von Aktiven anwenden. (K3)"
  ]},
  "buchungssatz":      {label: "Buchungssätze & Bilanzkonten", short: "Buchungssätze", lernziele: [
    "Ich kann Geschäftsfälle in korrekte Buchungssätze (Soll an Haben) übersetzen. (K3)",
    "Ich kann die Buchungsregeln für Aktiv- und Passivkonten anwenden. (K3)",
    "Ich kann T-Konten mit Anfangsbestand, Zugängen, Abgängen und Saldo korrekt führen. (K3)",
    "Ich kann Eröffnungs- und Abschlussbuchungen erstellen. (K3)"
  ]},
  "erfolgsrechnung":   {label: "Erfolgsrechnung & Erfolgskonten", short: "Erfolgsrechnung", lernziele: [
    "Ich kann Aufwand und Ertrag definieren und Beispiele nennen. (K1)",
    "Ich kann erfolgswirksame von erfolgsunwirksamen Geschäftsfällen unterscheiden. (K2)",
    "Ich kann die Buchungsregeln für Aufwand- und Ertragskonten anwenden. (K3)",
    "Ich kann die ein- und zweistufige Erfolgsrechnung erstellen und interpretieren. (K3)",
    "Ich kann den Jahreserfolg (Gewinn/Verlust) ins Eigenkapital verbuchen. (K3)"
  ]},
  "eigentuemer":       {label: "Konten des Eigentümers", short: "Eigentümer", lernziele: [
    "Ich kann die Funktion des Eigenkapitalkontos und des Privatkontos erklären. (K2)",
    "Ich kann typische Geschäftsfälle auf dem Privatkonto verbuchen. (K3)",
    "Ich kann das Zusammenspiel von Privatkonto, Eigenkapitalkonto und Erfolgsrechnung erklären. (K2)"
  ]},
  "warenkonten":       {label: "Warenkonten & dreistufige Erfolgsrechnung", short: "Warenkonten", lernziele: [
    "Ich kann Wareneinkauf und Warenverkauf korrekt verbuchen (inkl. Rabatte, Skonti, Bezugsspesen). (K3)",
    "Ich kann das Konto Warenvorrat führen und die Bestandesänderung verbuchen. (K3)",
    "Ich kann die dreistufige Erfolgsrechnung (Bruttogewinn, Betriebsgewinn, Jahresgewinn) erstellen. (K3)",
    "Ich kann die Warenkalkulation (Einstandspreis bis Bruttoverkaufspreis) durchführen. (K3)"
  ]},
  "wertberichtigungen": {label: "Wertberichtigungen & Abschreibungen", short: "Wertberichtigungen", lernziele: [
    "Ich kann lineare und degressive Abschreibungen berechnen und verbuchen. (K3)",
    "Ich kann direkte und indirekte Abschreibungen unterscheiden und anwenden. (K3)",
    "Ich kann die Veräusserung von Anlagevermögen verbuchen. (K3)",
    "Ich kann das Delkredere (Wertberichtigung auf Debitoren) berechnen und verbuchen. (K3)"
  ]},
  "abgrenzungen":      {label: "Rechnungsabgrenzungen & Rückstellungen", short: "Abgrenzungen", lernziele: [
    "Ich kann die Notwendigkeit von Rechnungsabgrenzungen erklären. (K2)",
    "Ich kann transitorische Aktiven und Passiven verbuchen und im Folgejahr auflösen. (K3)",
    "Ich kann Rückstellungen von transitorischen Passiven unterscheiden. (K2)",
    "Ich kann Rückstellungen bilden, auflösen und korrekt verbuchen. (K3)"
  ]}
};

window.QUESTIONS = [

  // ============================================================
  // TOPIC: grundlagen – Grundlagen der Buchhaltung
  // ============================================================

  {
    id: "g01", topic: "grundlagen", type: "mc", diff: 1, tax: "K1",
    q: "Welche der folgenden Aufgaben gehört NICHT zu den Hauptaufgaben der Finanzbuchhaltung?",
    options: [
      {v: "A", t: "Ausweis von Gewinn und Verlust"},
      {v: "B", t: "Übersicht über Forderungen und Schulden"},
      {v: "C", t: "Planung von Marketingkampagnen"},
      {v: "D", t: "Grundlage zur Berechnung der Steuern"}
    ],
    correct: "C",
    explain: "Die Hauptaufgaben der Finanzbuchhaltung sind: Ausweis von Gewinn und Verlust, Übersicht über Forderungen und Schulden, Beweismittel bei Streitigkeiten, Kalkulationsgrundlage für die Preisgestaltung sowie Grundlage zur Steuerberechnung. Marketing gehört nicht dazu."
  },
  {
    id: "g02", topic: "grundlagen", type: "multi", diff: 1, tax: "K1",
    q: "Welche der folgenden Aufgaben gehören zu den Hauptaufgaben der Finanzbuchhaltung? (Mehrere Antworten möglich.)",
    options: [
      {v: "A", t: "Ausweis von Gewinn und Verlust"},
      {v: "B", t: "Beweismittel bei Streitigkeiten"},
      {v: "C", t: "Personalrekrutierung"},
      {v: "D", t: "Kalkulationsgrundlage für die Preisgestaltung"}
    ],
    correct: ["A", "B", "D"],
    explain: "Ausweis von Gewinn/Verlust, Beweismittel bei Streitigkeiten und Kalkulationsgrundlage gehören zu den fünf Hauptaufgaben. Personalrekrutierung ist keine Aufgabe der Buchhaltung."
  },
  {
    id: "g03", topic: "grundlagen", type: "mc", diff: 1, tax: "K2",
    q: "Ab welchem Jahresumsatz besteht in der Schweiz eine umfassende Buchführungspflicht für Einzelunternehmen und Personengesellschaften?",
    options: [
      {v: "A", t: "CHF 100'000"},
      {v: "B", t: "CHF 250'000"},
      {v: "C", t: "CHF 500'000"},
      {v: "D", t: "CHF 1'000'000"}
    ],
    correct: "C",
    explain: "Gemäss Art. 957 Abs. 1 OR sind Einzelunternehmen und Personengesellschaften ab einem Jahresumsatz von CHF 500'000 zur ordnungsgemässen Buchführung verpflichtet. Juristische Personen sind unabhängig vom Umsatz buchführungspflichtig."
  },
  {
    id: "g04", topic: "grundlagen", type: "tf", diff: 1, tax: "K2",
    q: "Juristische Personen (z.B. eine AG oder GmbH) sind unabhängig vom Umsatz immer buchführungspflichtig.",
    correct: true,
    explain: "Richtig. Gemäss Art. 957 Abs. 1 OR sind alle juristischen Personen buchführungspflichtig – unabhängig von ihrem Jahresumsatz."
  },
  {
    id: "g05", topic: "grundlagen", type: "fill", diff: 1, tax: "K1",
    q: "Der Grundsatz «Keine Buchung ohne {0}» besagt, dass jede Buchung durch ein Dokument (z.B. Rechnung, Kontoauszug) nachgewiesen werden muss.",
    blanks: [
      {answer: "Beleg", alts: ["Beleg", "Dokument"]}
    ],
    explain: "Der Belegprinzip ist ein zentraler Grundsatz der Buchhaltung: Jeder Geschäftsfall muss durch einen Beleg (Rechnung, Quittung, Kontoauszug) nachgewiesen werden können."
  },
  {
    id: "g06", topic: "grundlagen", type: "mc", diff: 2, tax: "K2",
    q: "Welcher Grundsatz der Buchführung besagt, dass Aktiven im Zweifelsfall eher zu tief und Passiven eher zu hoch bewertet werden sollen?",
    options: [
      {v: "A", t: "Grundsatz der Klarheit"},
      {v: "B", t: "Grundsatz der Stetigkeit"},
      {v: "C", t: "Vorsichtsprinzip"},
      {v: "D", t: "Grundsatz der Periodenabgrenzung"}
    ],
    correct: "C",
    explain: "Das Vorsichtsprinzip (Imparitätsprinzip) verlangt eine vorsichtige Bewertung: Verluste werden erfasst, sobald sie wahrscheinlich sind, Gewinne erst, wenn sie realisiert sind. Aktiven werden im Zweifelsfall tiefer, Passiven höher bewertet."
  },
  {
    id: "g07", topic: "grundlagen", type: "mc", diff: 2, tax: "K2",
    q: "Was verbietet das Bruttoprinzip (Verrechnungsverbot)?",
    options: [
      {v: "A", t: "Die Verwendung von Fremdwährungen in der Buchhaltung"},
      {v: "B", t: "Die Verrechnung von Aufwand- und Ertragspositionen miteinander"},
      {v: "C", t: "Die Bildung von Rückstellungen"},
      {v: "D", t: "Die Verwendung von Abkürzungen im Journal"}
    ],
    correct: "B",
    explain: "Das Bruttoprinzip (Verrechnungsverbot) besagt, dass Aktiven und Passiven sowie Aufwände und Erträge nicht miteinander verrechnet werden dürfen, sondern separat ausgewiesen werden müssen."
  },
  {
    id: "g08", topic: "grundlagen", type: "fill", diff: 2, tax: "K2",
    q: "Die 9 Kontenklassen des KMU-Kontenrahmens gliedern sich wie folgt: Klasse 1 = {0}, Klasse 2 = {1}, Klassen 3–8 = Erfolgskonten, Klasse 9 = Abschlusskonten.",
    blanks: [
      {answer: "Aktiven", alts: ["Vermögen"]},
      {answer: "Passiven", alts: ["Schulden und Eigenkapital"]}
    ],
    explain: "Im KMU-Kontenrahmen sind Klasse 1 die Aktiven (Vermögenswerte) und Klasse 2 die Passiven (Fremd- und Eigenkapital). Die Klassen 3–8 umfassen die Erfolgskonten (Erträge und Aufwände)."
  },
  {
    id: "g09", topic: "grundlagen", type: "mc", diff: 2, tax: "K2",
    q: "Was ist der Unterschied zwischen dem Journal und dem Hauptbuch?",
    options: [
      {v: "A", t: "Das Journal ordnet nach Konten, das Hauptbuch nach Datum"},
      {v: "B", t: "Das Journal ordnet chronologisch, das Hauptbuch nach Konten"},
      {v: "C", t: "Das Journal enthält nur Bilanzkonten, das Hauptbuch auch Erfolgskonten"},
      {v: "D", t: "Es gibt keinen Unterschied – beides sind Synonyme"}
    ],
    correct: "B",
    explain: "Das Journal (Grundbuch) erfasst alle Geschäftsfälle in chronologischer Reihenfolge. Das Hauptbuch ordnet dieselben Buchungen nach Konten (alle Buchungen eines Kontos zusammen). Der Ablauf ist: Belege → Journal → Hauptbuch."
  },
  {
    id: "g10", topic: "grundlagen", type: "mc", diff: 3, tax: "K4",
    q: "Ein Einzelunternehmer mit CHF 400'000 Jahresumsatz führt lediglich ein Kassenbuch und eine Aufstellung der Vermögenslage. Ist dies gesetzeskonform?",
    options: [
      {v: "A", t: "Nein, jeder Unternehmer muss eine vollständige doppelte Buchhaltung führen"},
      {v: "B", t: "Ja, da er unter CHF 500'000 liegt, genügt eine vereinfachte Buchführung (Einnahmen-/Ausgabenrechnung und Vermögensaufstellung)"},
      {v: "C", t: "Nein, Einzelunternehmen sind grundsätzlich von der Buchführungspflicht befreit"},
      {v: "D", t: "Ja, aber nur wenn das Unternehmen weniger als 5 Mitarbeitende hat"}
    ],
    correct: "B",
    explain: "Gemäss Art. 957 Abs. 2 OR genügt für Einzelunternehmen mit weniger als CHF 500'000 Jahresumsatz eine vereinfachte Buchführung: eine Einnahmen-/Ausgabenrechnung sowie eine Vermögensaufstellung (Inventar)."
  },
  {
    id: "g11", topic: "grundlagen", type: "multi", diff: 2, tax: "K2",
    q: "Welche der folgenden Grundsätze gehören zu den Grundsätzen ordnungsmässiger Buchführung (GoB)? (Mehrere Antworten möglich.)",
    options: [
      {v: "A", t: "Vollständigkeit und wahrheitsgetreue Erfassung"},
      {v: "B", t: "Gewinnmaximierungsprinzip"},
      {v: "C", t: "Vorsichtsprinzip"},
      {v: "D", t: "Stetigkeit (Kontinuität)"}
    ],
    correct: ["A", "C", "D"],
    explain: "Vollständigkeit, Vorsichtsprinzip und Stetigkeit gehören zu den GoB. Ein Gewinnmaximierungsprinzip gibt es in der Buchführung nicht – dieses ist ein betriebswirtschaftliches Ziel."
  },
  {
    id: "g12", topic: "grundlagen", type: "mc", diff: 3, tax: "K4",
    q: "Ein Unternehmen wechselt jedes Jahr die Bewertungsmethode für seine Vorräte, um den Gewinn möglichst günstig darzustellen. Welcher Grundsatz wird dadurch verletzt?",
    options: [
      {v: "A", t: "Belegprinzip"},
      {v: "B", t: "Grundsatz der Klarheit"},
      {v: "C", t: "Grundsatz der Stetigkeit (Kontinuität)"},
      {v: "D", t: "Grundsatz der Wesentlichkeit"}
    ],
    correct: "C",
    explain: "Der Grundsatz der Stetigkeit verlangt, dass einmal gewählte Bewertungs- und Darstellungsmethoden über mehrere Jahre beibehalten werden. Ein jährlicher Methodenwechsel zur Gewinnoptimierung verstösst klar gegen dieses Prinzip."
  },
  {
    id: "g13", topic: "grundlagen", type: "tf", diff: 2, tax: "K2",
    q: "Der Kontenrahmen ist für jedes Unternehmen verbindlich und darf nicht angepasst werden.",
    correct: false,
    explain: "Falsch. Der Kontenrahmen (z.B. KMU-Kontenrahmen) ist eine Empfehlung bzw. ein Muster. Jedes Unternehmen wählt daraus die für seine Zwecke nötigen Konten aus und erstellt seinen individuellen Kontenplan."
  },

  // ============================================================
  // TOPIC: bilanz – Bilanz, Inventar & Bewertung
  // ============================================================

  {
    id: "b01", topic: "bilanz", type: "mc", diff: 1, tax: "K1",
    q: "Was zeigt die Bilanz?",
    options: [
      {v: "A", t: "Den Gewinn oder Verlust einer Periode"},
      {v: "B", t: "Die Vermögenswerte und die Finanzierung eines Unternehmens an einem bestimmten Stichtag"},
      {v: "C", t: "Die Umsatzentwicklung über ein Jahr"},
      {v: "D", t: "Die Zahlungsströme eines Unternehmens"}
    ],
    correct: "B",
    explain: "Die Bilanz ist eine Gegenüberstellung von Aktiven (Vermögen) und Passiven (Finanzierung durch Fremd- und Eigenkapital) an einem bestimmten Stichtag (Bilanzstichtag)."
  },
  {
    id: "b02", topic: "bilanz", type: "fill", diff: 1, tax: "K1",
    q: "Die linke Seite der Bilanz heisst {0} und zeigt das Vermögen. Die rechte Seite heisst {1} und zeigt die Finanzierung.",
    blanks: [
      {answer: "Aktiven", alts: ["Aktiva", "Aktivseite"]},
      {answer: "Passiven", alts: ["Passiva", "Passivseite"]}
    ],
    explain: "Die Bilanz ist zweiseitig aufgebaut: Links stehen die Aktiven (Vermögenswerte), rechts die Passiven (Fremdkapital und Eigenkapital als Finanzierungsquellen)."
  },
  {
    id: "b03", topic: "bilanz", type: "mc", diff: 1, tax: "K2",
    img: {src: "img/bwl/fibu/fibu_bilanzstruktur_01.svg", alt: "Diagramm: Aufbau der Bilanz mit Aktiven und Passiven"},
    q: "Nach welchem Prinzip werden die Aktiven in der Bilanz geordnet?",
    options: [
      {v: "A", t: "Alphabetisch nach Kontoname"},
      {v: "B", t: "Nach dem Fälligkeitsprinzip (kurzfristig vor langfristig)"},
      {v: "C", t: "Nach dem Liquiditätsprinzip (flüssig vor weniger flüssig)"},
      {v: "D", t: "Nach Anschaffungswert (teuerste zuerst)"}
    ],
    correct: "C",
    explain: "Die Aktiven werden nach dem Liquiditätsprinzip (Flüssigkeitsprinzip) geordnet: Zuerst die am schnellsten in Geld umwandelbaren Positionen (Kasse, Bank), dann die weniger liquiden (Immobilien)."
  },
  {
    id: "b04", topic: "bilanz", type: "multi", diff: 1, tax: "K2",
    q: "Welche der folgenden Positionen gehören zum Umlaufvermögen? (Mehrere Antworten möglich.)",
    options: [
      {v: "A", t: "Kasse"},
      {v: "B", t: "Immobilien"},
      {v: "C", t: "Debitoren"},
      {v: "D", t: "Warenvorrat"}
    ],
    correct: ["A", "C", "D"],
    explain: "Zum Umlaufvermögen gehören Vermögensteile, die innerhalb eines Jahres in Geld umgewandelt werden: Kasse, Bank, Debitoren (Forderungen), Warenvorrat, Wertschriften. Immobilien gehören zum Anlagevermögen."
  },
  {
    id: "b05", topic: "bilanz", type: "mc", diff: 2, tax: "K2",
    q: "Was ist das Eigenkapital in der Bilanz?",
    options: [
      {v: "A", t: "Die Summe aller Schulden des Unternehmens"},
      {v: "B", t: "Die Differenz zwischen Aktiven und Fremdkapital – also die rechnerische Schuld gegenüber dem Eigentümer"},
      {v: "C", t: "Das Bargeld, das der Eigentümer ins Unternehmen eingelegt hat"},
      {v: "D", t: "Der Jahresgewinn des Unternehmens"}
    ],
    correct: "B",
    explain: "Das Eigenkapital ist die Differenz zwischen den Aktiven (Vermögen) und dem Fremdkapital (Schulden an Dritte). Es stellt die rechnerische Schuld des Unternehmens gegenüber dem Geschäftseigentümer dar."
  },
  {
    id: "b06", topic: "bilanz", type: "calc", diff: 2, tax: "K3",
    q: "Ein Unternehmen hat folgende Bilanzpositionen: Kasse CHF 5'000, Bank CHF 25'000, Debitoren CHF 15'000, Warenvorrat CHF 30'000, Mobilien CHF 10'000, Fahrzeuge CHF 40'000, Kreditoren CHF 20'000, Hypothek CHF 60'000. Berechne das Eigenkapital und die Bilanzsumme.",
    rows: [
      {label: "Bilanzsumme (Total Aktiven)", answer: 125000, tolerance: 0, unit: "CHF"},
      {label: "Eigenkapital", answer: 45000, tolerance: 0, unit: "CHF"}
    ],
    explain: "Aktiven: 5'000 + 25'000 + 15'000 + 30'000 + 10'000 + 40'000 = 125'000 CHF. Fremdkapital: 20'000 + 60'000 = 80'000 CHF. Eigenkapital = Aktiven – Fremdkapital = 125'000 – 80'000 = 45'000 CHF. Die Bilanzsumme ist das Total der Aktiven (= Total der Passiven) = 125'000 CHF."
  },
  {
    id: "b07", topic: "bilanz", type: "tf", diff: 1, tax: "K2",
    q: "Debitoren sind Schulden des Unternehmens gegenüber Lieferanten.",
    correct: false,
    explain: "Falsch. Debitoren (Forderungen aus Lieferungen und Leistungen) sind Guthaben des Unternehmens bei Kunden. Schulden gegenüber Lieferanten heissen Kreditoren."
  },
  {
    id: "b08", topic: "bilanz", type: "mc", diff: 2, tax: "K2",
    q: "Nach welchem Prinzip werden die Passiven in der Bilanz geordnet?",
    options: [
      {v: "A", t: "Liquiditätsprinzip"},
      {v: "B", t: "Fälligkeitsprinzip (kurzfristige vor langfristigen Schulden)"},
      {v: "C", t: "Alphabetisch"},
      {v: "D", t: "Nach Höhe des Betrags (grösster zuerst)"}
    ],
    correct: "B",
    explain: "Die Passiven werden nach dem Fälligkeitsprinzip geordnet: Zuerst die kurzfristigen Schulden (z.B. Kreditoren), dann die langfristigen (z.B. Hypotheken), zuletzt das Eigenkapital."
  },
  {
    id: "b09", topic: "bilanz", type: "mc", diff: 2, tax: "K3",
    q: "Ein Unternehmen hat Maschinen für CHF 80'000 gekauft. Der aktuelle Marktwert beträgt CHF 65'000. Zu welchem Wert erscheinen die Maschinen in der Bilanz?",
    options: [
      {v: "A", t: "CHF 80'000 (Anschaffungswert)"},
      {v: "B", t: "CHF 65'000 (Marktwert, da tiefer)"},
      {v: "C", t: "CHF 72'500 (Durchschnitt)"},
      {v: "D", t: "CHF 80'000 plus Teuerungszuschlag"}
    ],
    correct: "B",
    explain: "Gemäss dem Niederstwertprinzip wird der tiefere der beiden Werte (Anschaffungswert oder Marktwert) angesetzt. Da der Marktwert von CHF 65'000 tiefer ist als der Anschaffungswert von CHF 80'000, werden die Maschinen mit CHF 65'000 bilanziert."
  },
  {
    id: "b10", topic: "bilanz", type: "tf", diff: 2, tax: "K2",
    q: "Die Bilanzsumme der Aktivseite muss immer gleich gross sein wie die Bilanzsumme der Passivseite.",
    correct: true,
    explain: "Richtig. Das ist die Bilanzgleichung: Aktiven = Passiven. Jeder Vermögenswert muss durch Fremd- oder Eigenkapital finanziert sein, daher müssen beide Seiten identisch sein."
  },
  {
    id: "b11", topic: "bilanz", type: "mc", diff: 3, tax: "K4",
    q: "Welche Aussage zur Bilanz ist korrekt?",
    options: [
      {v: "A", t: "Die Bilanz zeigt die Situation über eine ganze Periode (Stromgrösse)"},
      {v: "B", t: "Die Bilanz zeigt die Situation an einem bestimmten Stichtag (Bestandesgrösse)"},
      {v: "C", t: "Die Bilanz zeigt nur die Schulden eines Unternehmens"},
      {v: "D", t: "Die Bilanz wird monatlich erstellt und zeigt den Umsatz"}
    ],
    correct: "B",
    explain: "Die Bilanz ist eine Momentaufnahme (Bestandesgrösse) an einem bestimmten Stichtag. Die Erfolgsrechnung hingegen zeigt die Entwicklung über eine Periode (Stromgrössen: Aufwände und Erträge)."
  },
  {
    id: "b12", topic: "bilanz", type: "multi", diff: 3, tax: "K4",
    q: "Welche der folgenden Aussagen zum Inventar sind korrekt? (Mehrere Antworten möglich.)",
    options: [
      {v: "A", t: "Das Inventar ist eine detaillierte, art-, mengen- und wertmässige Aufstellung aller Vermögensteile und Schulden"},
      {v: "B", t: "Das Inventar wird mindestens einmal jährlich am Bilanzstichtag erstellt"},
      {v: "C", t: "Das Inventar und die Bilanz zeigen exakt die gleichen Informationen"},
      {v: "D", t: "Das Inventar bildet die Grundlage für die Bilanzerstellung"}
    ],
    correct: ["A", "B", "D"],
    explain: "Das Inventar ist detaillierter als die Bilanz (mit Mengen, Einzelwerten), wird mindestens jährlich erstellt und dient als Grundlage für die Bilanz. Die Bilanz fasst die Inventarinformationen zusammen."
  },

  // ============================================================
  // TOPIC: buchungssatz – Buchungssätze & Bilanzkonten
  // ============================================================

  {
    id: "s01", topic: "buchungssatz", type: "mc", diff: 1, tax: "K1",
    q: "Wie lautet die Grundstruktur eines Buchungssatzes?",
    options: [
      {v: "A", t: "Haben an Soll"},
      {v: "B", t: "Soll an Haben"},
      {v: "C", t: "Aufwand an Ertrag"},
      {v: "D", t: "Aktiven an Passiven"}
    ],
    correct: "B",
    explain: "Ein Buchungssatz gibt an, welches Konto im Soll (links) und welches im Haben (rechts) belastet wird. Die Struktur ist immer: Soll an Haben (z.B. Kasse an Eigenkapital)."
  },
  {
    id: "s02", topic: "buchungssatz", type: "fill", diff: 1, tax: "K2",
    img: {src: "img/bwl/fibu/fibu_buchungsregeln_01.svg", alt: "Übersicht der vier Kontentypen mit Soll- und Habenseite"},
    q: "Bei einem Aktivkonto stehen Zunahmen auf der {0}-Seite und Abnahmen auf der {1}-Seite.",
    blanks: [
      {answer: "Soll", alts: ["linken", "Sollseite"]},
      {answer: "Haben", alts: ["rechten", "Habenseite"]}
    ],
    explain: "Aktivkonten folgen der Bilanzlogik: Der Anfangsbestand und Zunahmen stehen links (Soll), Abnahmen und der Saldo stehen rechts (Haben)."
  },
  {
    id: "s03", topic: "buchungssatz", type: "fill", diff: 1, tax: "K2",
    q: "Bei einem Passivkonto stehen Zunahmen auf der {0}-Seite und Abnahmen auf der {1}-Seite.",
    blanks: [
      {answer: "Haben", alts: ["rechten", "Habenseite"]},
      {answer: "Soll", alts: ["linken", "Sollseite"]}
    ],
    explain: "Passivkonten spiegeln die rechte Bilanzseite: Der Anfangsbestand und Zunahmen stehen rechts (Haben), Abnahmen und der Saldo stehen links (Soll)."
  },
  {
    id: "s04", topic: "buchungssatz", type: "mc", diff: 1, tax: "K3",
    q: "Ein Kunde bezahlt eine offene Rechnung von CHF 5'000 per Banküberweisung. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Debitoren an Bank"},
      {v: "B", t: "Bank an Debitoren"},
      {v: "C", t: "Kasse an Debitoren"},
      {v: "D", t: "Bank an Kreditoren"}
    ],
    correct: "B",
    explain: "Der Kunde zahlt: Das Bankkonto nimmt zu (Aktivkonto → Soll) und die Forderung gegenüber dem Kunden (Debitoren) nimmt ab (Aktivkonto → Haben). Buchungssatz: Bank an Debitoren CHF 5'000."
  },
  {
    id: "s05", topic: "buchungssatz", type: "mc", diff: 2, tax: "K3",
    q: "Das Unternehmen nimmt ein langfristiges Darlehen bei der Bank auf. CHF 100'000 werden dem Bankkonto gutgeschrieben. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Bank an Darlehen 100'000"},
      {v: "B", t: "Darlehen an Bank 100'000"},
      {v: "C", t: "Eigenkapital an Bank 100'000"},
      {v: "D", t: "Bank an Eigenkapital 100'000"}
    ],
    correct: "A",
    explain: "Die Bank (Aktivkonto) nimmt zu → Soll. Das Darlehen (Passivkonto/langfristiges Fremdkapital) nimmt ebenfalls zu → Haben. Buchungssatz: Bank an Darlehen 100'000."
  },
  {
    id: "s06", topic: "buchungssatz", type: "mc", diff: 2, tax: "K3",
    q: "Das Unternehmen kauft neue Büromöbel für CHF 8'000. Die Rechnung wird noch nicht bezahlt. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Mobilien an Kasse 8'000"},
      {v: "B", t: "Kreditoren an Mobilien 8'000"},
      {v: "C", t: "Mobilien an Kreditoren 8'000"},
      {v: "D", t: "Mobilien an Bank 8'000"}
    ],
    correct: "C",
    explain: "Die Mobilien (Aktivkonto) nehmen zu → Soll. Die Kreditoren (Passivkonto, Verbindlichkeit gegenüber Lieferant) nehmen zu → Haben. Buchungssatz: Mobilien an Kreditoren 8'000."
  },
  {
    id: "s07", topic: "buchungssatz", type: "mc", diff: 2, tax: "K3",
    q: "Das Unternehmen bezahlt eine Lieferantenrechnung von CHF 3'000 per Bank. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Bank an Kreditoren 3'000"},
      {v: "B", t: "Kreditoren an Kasse 3'000"},
      {v: "C", t: "Kreditoren an Bank 3'000"},
      {v: "D", t: "Aufwand an Bank 3'000"}
    ],
    correct: "C",
    explain: "Die Kreditoren (Passivkonto) nehmen ab → Soll. Die Bank (Aktivkonto) nimmt ab → Haben. Buchungssatz: Kreditoren an Bank 3'000."
  },
  {
    id: "s08", topic: "buchungssatz", type: "fill", diff: 2, tax: "K3",
    q: "Ein Unternehmen kauft einen Lieferwagen für CHF 45'000 und bezahlt bar. Buchungssatz: {0} an {1} 45'000.",
    blanks: [
      {answer: "Fahrzeuge", alts: ["Fahrzeug", "Fahrzeugkonto"]},
      {answer: "Kasse", alts: ["Kassa"]}
    ],
    explain: "Der Lieferwagen (Aktivkonto Fahrzeuge) nimmt zu → Soll. Die Kasse (Aktivkonto) nimmt ab → Haben. Es handelt sich um einen Aktivtausch: Die Bilanzsumme verändert sich nicht."
  },
  {
    id: "s09", topic: "buchungssatz", type: "mc", diff: 2, tax: "K3",
    q: "Das Unternehmen zahlt CHF 50'000 der Hypothekarschuld per Bank zurück. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Bank an Hypothek 50'000"},
      {v: "B", t: "Hypothek an Bank 50'000"},
      {v: "C", t: "Hypothek an Eigenkapital 50'000"},
      {v: "D", t: "Eigenkapital an Bank 50'000"}
    ],
    correct: "B",
    explain: "Die Hypothek (Passivkonto) nimmt ab → Soll. Die Bank (Aktivkonto) nimmt ab → Haben. Buchungssatz: Hypothek an Bank 50'000. Aktiven und Passiven nehmen gleichermassen ab (Bilanzverkürzung)."
  },
  {
    id: "s10", topic: "buchungssatz", type: "multi", diff: 2, tax: "K2",
    q: "Welche der folgenden Geschäftsfälle bewirken einen Aktivtausch (die Bilanzsumme bleibt gleich)? (Mehrere Antworten möglich.)",
    options: [
      {v: "A", t: "Bareinzahlung auf das Bankkonto"},
      {v: "B", t: "Kauf von Mobilien auf Rechnung"},
      {v: "C", t: "Kunde bezahlt offene Rechnung per Bank"},
      {v: "D", t: "Aufnahme eines Darlehens, Gutschrift auf Bankkonto"}
    ],
    correct: ["A", "C"],
    explain: "Aktivtausch: Nur Aktivkonten betroffen, ein Konto nimmt zu, das andere ab. A) Kasse nimmt ab, Bank nimmt zu. C) Debitoren nehmen ab, Bank nimmt zu. B) ist eine Bilanzverlängerung (Aktiven + Passiven steigen), D) ebenfalls."
  },
  {
    id: "s11", topic: "buchungssatz", type: "mc", diff: 1, tax: "K3",
    q: "Wie lautet der Abschlussbuchungssatz für ein Aktivkonto (z.B. Kasse)?",
    options: [
      {v: "A", t: "Kasse an Schlussbilanz"},
      {v: "B", t: "Schlussbilanz an Kasse"},
      {v: "C", t: "Kasse an Eröffnungsbilanz"},
      {v: "D", t: "Erfolgsrechnung an Kasse"}
    ],
    correct: "B",
    explain: "Aktivkonten werden abgeschlossen mit: Schlussbilanz an Aktivkonto. Der Saldo des Aktivkontos wird auf die Habenseite geschrieben und in die Schlussbilanz übertragen."
  },
  {
    id: "s12", topic: "buchungssatz", type: "mc", diff: 1, tax: "K3",
    q: "Wie lautet der Eröffnungsbuchungssatz für ein Aktivkonto (z.B. Bank)?",
    options: [
      {v: "A", t: "Bank an Eröffnungsbilanz"},
      {v: "B", t: "Eröffnungsbilanz an Bank"},
      {v: "C", t: "Bank an Schlussbilanz"},
      {v: "D", t: "Erfolgsrechnung an Bank"}
    ],
    correct: "A",
    explain: "Aktivkonten werden eröffnet mit: Aktivkonto an Eröffnungsbilanz. Der Anfangsbestand wird auf die Sollseite des Aktivkontos gebucht."
  },
  {
    id: "s13", topic: "buchungssatz", type: "fill", diff: 2, tax: "K3",
    q: "Die Abschlussbuchung für ein Passivkonto (z.B. Kreditoren) lautet: {0} an {1}.",
    blanks: [
      {answer: "Kreditoren", alts: ["Passivkonto"]},
      {answer: "Schlussbilanz", alts: ["SB", "Schlussbilanz"]}
    ],
    explain: "Passivkonten werden abgeschlossen mit: Passivkonto an Schlussbilanz. Der Saldo wird auf die Sollseite geschrieben und in die Schlussbilanz (Habenseite) übertragen."
  },
  {
    id: "s14", topic: "buchungssatz", type: "calc", diff: 2, tax: "K3",
    q: "Das Konto Bank hat folgende Bewegungen: Anfangsbestand CHF 30'000, Zugänge (Soll) CHF 85'000, Abgänge (Haben) CHF 72'000. Berechne den Saldo (Endbestand).",
    rows: [
      {label: "Saldo Konto Bank", answer: 43000, tolerance: 0, unit: "CHF"}
    ],
    explain: "Bank ist ein Aktivkonto. Saldo = Soll-Total – Haben-Total = (30'000 + 85'000) – 72'000 = 115'000 – 72'000 = 43'000 CHF."
  },
  {
    id: "s15", topic: "buchungssatz", type: "mc", diff: 3, tax: "K3",
    q: "Der Lieferant gewährt ein Darlehen von CHF 5'000, das mit der offenen Lieferantenrechnung verrechnet wird (Schuldenumwandlung). Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Kreditoren an Darlehen 5'000"},
      {v: "B", t: "Darlehen an Kreditoren 5'000"},
      {v: "C", t: "Bank an Darlehen 5'000"},
      {v: "D", t: "Kreditoren an Bank 5'000"}
    ],
    correct: "A",
    explain: "Die kurzfristige Schuld (Kreditoren) nimmt ab → Soll. Dafür entsteht eine langfristige Schuld (Darlehen) → Haben. Es handelt sich um einen Passivtausch: Kreditoren an Darlehen 5'000. Die Bilanzsumme bleibt gleich."
  },
  {
    id: "s16", topic: "buchungssatz", type: "mc", diff: 3, tax: "K4",
    q: "Ein Geschäftsfall bewirkt gleichzeitig eine Zunahme der Aktiven und eine Zunahme der Passiven. Welcher Bilanzeffekt liegt vor?",
    options: [
      {v: "A", t: "Aktivtausch"},
      {v: "B", t: "Passivtausch"},
      {v: "C", t: "Bilanzverlängerung"},
      {v: "D", t: "Bilanzverkürzung"}
    ],
    correct: "C",
    explain: "Wenn sowohl Aktiven als auch Passiven zunehmen, spricht man von einer Bilanzverlängerung: Die Bilanzsumme steigt. Beispiel: Kauf von Mobilien auf Rechnung (Mobilien ↑, Kreditoren ↑)."
  },
  {
    id: "s17", topic: "buchungssatz", type: "fill", diff: 2, tax: "K3",
    q: "Der Eigentümer legt CHF 20'000 aus seinem Privatvermögen bar in die Unternehmung ein. Buchungssatz: {0} an {1} 20'000.",
    blanks: [
      {answer: "Kasse", alts: ["Kassa"]},
      {answer: "Eigenkapital", alts: ["EK"]}
    ],
    explain: "Die Kasse (Aktivkonto) nimmt zu → Soll. Das Eigenkapital (Passivkonto) nimmt zu → Haben. Es handelt sich um eine Bilanzverlängerung."
  },
  {
    id: "s18", topic: "buchungssatz", type: "mc", diff: 3, tax: "K3",
    q: "Die abgekürzte Eröffnungsbuchung für alle Konten lautet:",
    options: [
      {v: "A", t: "Passiven an Aktiven"},
      {v: "B", t: "Aktiven an Passiven"},
      {v: "C", t: "Schlussbilanz an Eröffnungsbilanz"},
      {v: "D", t: "Eröffnungsbilanz an Schlussbilanz"}
    ],
    correct: "B",
    explain: "Die abgekürzte Eröffnungsbuchung fasst alle Eröffnungsbuchungen zusammen: Aktiven an Passiven. Alle Aktivkonten werden im Soll eröffnet, alle Passivkonten im Haben. Die abgekürzte Abschlussbuchung lautet umgekehrt: Passiven an Aktiven."
  },
  {
    id: "s19", topic: "buchungssatz", type: "calc", diff: 3, tax: "K3",
    q: "Das Konto Kreditoren zeigt: Anfangsbestand CHF 18'000 (Haben), Zahlungen an Lieferanten CHF 45'000 (Soll), neue Rechnungen CHF 52'000 (Haben). Berechne den Saldo.",
    rows: [
      {label: "Saldo Konto Kreditoren", answer: 25000, tolerance: 0, unit: "CHF"}
    ],
    explain: "Kreditoren ist ein Passivkonto. Soll: 45'000. Haben: 18'000 + 52'000 = 70'000. Saldo (Haben-Überschuss): 70'000 – 45'000 = 25'000 CHF."
  },

  // ============================================================
  // TOPIC: erfolgsrechnung – Erfolgsrechnung & Erfolgskonten
  // ============================================================

  {
    id: "e01", topic: "erfolgsrechnung", type: "mc", diff: 1, tax: "K1",
    q: "Was ist Aufwand?",
    options: [
      {v: "A", t: "Die Wertvermehrung durch den Produktionsprozess"},
      {v: "B", t: "Der Werteverzehr (Kosten der Inputs) im Produktionsprozess"},
      {v: "C", t: "Die Einnahmen aus Verkäufen"},
      {v: "D", t: "Der Bestand an flüssigen Mitteln"}
    ],
    correct: "B",
    explain: "Aufwand (Aufwände) bezeichnet den Werteverzehr im Produktionsprozess, also die Kosten der eingesetzten Produktionsfaktoren (z.B. Löhne, Material, Miete)."
  },
  {
    id: "e02", topic: "erfolgsrechnung", type: "fill", diff: 1, tax: "K1",
    q: "Wenn die Erträge grösser sind als die Aufwände, erzielt das Unternehmen einen {0}. Wenn die Aufwände grösser sind, entsteht ein {1}.",
    blanks: [
      {answer: "Gewinn", alts: ["Jahresgewinn", "Unternehmensgewinn"]},
      {answer: "Verlust", alts: ["Jahresverlust"]}
    ],
    explain: "Erfolg = Erträge – Aufwände. Ist das Ergebnis positiv, liegt ein Gewinn vor; ist es negativ, ein Verlust."
  },
  {
    id: "e03", topic: "erfolgsrechnung", type: "mc", diff: 1, tax: "K2",
    q: "In welcher Hinsicht unterscheiden sich Erfolgskonten von Bilanzkonten?",
    options: [
      {v: "A", t: "Erfolgskonten haben immer einen Anfangsbestand aus dem Vorjahr"},
      {v: "B", t: "Erfolgskonten haben keinen Anfangsbestand – sie beginnen jedes Jahr bei null"},
      {v: "C", t: "Erfolgskonten werden nie abgeschlossen"},
      {v: "D", t: "Erfolgskonten gehören nicht zum System der doppelten Buchhaltung"}
    ],
    correct: "B",
    explain: "Bilanzkonten sind Bestandeskonten mit Anfangsbestand (Übertrag aus Vorjahr). Erfolgskonten (Aufwand/Ertrag) sind Stromgrössen und starten jedes Geschäftsjahr bei null."
  },
  {
    id: "e04", topic: "erfolgsrechnung", type: "fill", diff: 1, tax: "K2",
    q: "Aufwandkonten nehmen auf der {0}-Seite zu und werden am Jahresende auf der {1}-Seite saldiert.",
    blanks: [
      {answer: "Soll", alts: ["linken"]},
      {answer: "Haben", alts: ["rechten"]}
    ],
    explain: "Aufwandkonten verhalten sich wie Aktivkonten: Zunahmen im Soll (links), Saldo und Abnahmen im Haben (rechts)."
  },
  {
    id: "e05", topic: "erfolgsrechnung", type: "mc", diff: 2, tax: "K3",
    q: "Das Unternehmen zahlt Löhne von CHF 12'000 per Bank. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Bank an Lohnaufwand 12'000"},
      {v: "B", t: "Lohnaufwand an Bank 12'000"},
      {v: "C", t: "Lohnaufwand an Kasse 12'000"},
      {v: "D", t: "Personalaufwand an Kreditoren 12'000"}
    ],
    correct: "B",
    explain: "Der Lohnaufwand (Aufwandkonto) nimmt zu → Soll. Die Bank (Aktivkonto) nimmt ab → Haben. Buchungssatz: Lohnaufwand an Bank 12'000. Dieser Geschäftsfall ist erfolgswirksam (der Gewinn sinkt)."
  },
  {
    id: "e06", topic: "erfolgsrechnung", type: "mc", diff: 2, tax: "K3",
    q: "Das Unternehmen stellt einem Kunden eine Rechnung über CHF 8'000 für erbrachte Dienstleistungen. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Honorarertrag an Debitoren 8'000"},
      {v: "B", t: "Debitoren an Honorarertrag 8'000"},
      {v: "C", t: "Bank an Honorarertrag 8'000"},
      {v: "D", t: "Debitoren an Kreditoren 8'000"}
    ],
    correct: "B",
    explain: "Die Forderung (Debitoren, Aktivkonto) nimmt zu → Soll. Der Ertrag (Honorarertrag, Ertragskonto) nimmt zu → Haben. Buchungssatz: Debitoren an Honorarertrag 8'000. Dieser Geschäftsfall ist erfolgswirksam (der Gewinn steigt)."
  },
  {
    id: "e07", topic: "erfolgsrechnung", type: "mc", diff: 2, tax: "K2",
    q: "Welcher der folgenden Geschäftsfälle ist erfolgsunwirksam (beeinflusst den Jahresgewinn NICHT)?",
    options: [
      {v: "A", t: "Zahlung von Miete per Bank"},
      {v: "B", t: "Kunde bezahlt offene Rechnung per Bank"},
      {v: "C", t: "Zinsgutschrift auf dem Bankkonto"},
      {v: "D", t: "Lohnzahlung per Bank"}
    ],
    correct: "B",
    explain: "Wenn ein Kunde per Bank bezahlt, werden nur Bilanzkonten berührt (Bank nimmt zu, Debitoren nehmen ab). Kein Erfolgskonto ist betroffen, daher ist der Vorgang erfolgsunwirksam. Die anderen Vorgänge betreffen je ein Erfolgskonto."
  },
  {
    id: "e08", topic: "erfolgsrechnung", type: "multi", diff: 2, tax: "K2",
    q: "Welche der folgenden Buchungssätze sind erfolgswirksam? (Mehrere Antworten möglich.)",
    options: [
      {v: "A", t: "Lohnaufwand an Bank"},
      {v: "B", t: "Bank an Debitoren"},
      {v: "C", t: "Debitoren an Warenverkauf"},
      {v: "D", t: "Mobilien an Kreditoren"}
    ],
    correct: ["A", "C"],
    explain: "A) Lohnaufwand (Aufwandkonto) → erfolgswirksam (Gewinn sinkt). C) Warenverkauf (Ertragskonto) → erfolgswirksam (Gewinn steigt). B) und D) betreffen nur Bilanzkonten → erfolgsunwirksam."
  },
  {
    id: "e09", topic: "erfolgsrechnung", type: "fill", diff: 2, tax: "K3",
    q: "Die Abschlussbuchung für ein Aufwandkonto (z.B. Lohnaufwand) lautet: {0} an {1}.",
    blanks: [
      {answer: "Erfolgsrechnung", alts: ["ER"]},
      {answer: "Lohnaufwand", alts: ["Aufwandkonto"]}
    ],
    explain: "Aufwandkonten werden abgeschlossen mit: Erfolgsrechnung an Aufwandkonto. Der Saldo des Aufwandkontos wird in die Erfolgsrechnung (Sollseite) übertragen."
  },
  {
    id: "e10", topic: "erfolgsrechnung", type: "fill", diff: 2, tax: "K3",
    q: "Die Abschlussbuchung für ein Ertragskonto (z.B. Warenverkauf) lautet: {0} an {1}.",
    blanks: [
      {answer: "Warenverkauf", alts: ["Ertragskonto"]},
      {answer: "Erfolgsrechnung", alts: ["ER"]}
    ],
    explain: "Ertragskonten werden abgeschlossen mit: Ertragskonto an Erfolgsrechnung. Der Saldo wird auf die Habenseite der Erfolgsrechnung übertragen."
  },
  {
    id: "e11", topic: "erfolgsrechnung", type: "mc", diff: 2, tax: "K3",
    q: "Das Unternehmen schliesst das Jahr mit einem Gewinn von CHF 35'000 ab. Wie wird der Gewinn ins Eigenkapital verbucht?",
    options: [
      {v: "A", t: "Eigenkapital an Erfolgsrechnung 35'000"},
      {v: "B", t: "Erfolgsrechnung an Eigenkapital 35'000"},
      {v: "C", t: "Gewinn an Eigenkapital 35'000"},
      {v: "D", t: "Eigenkapital an Gewinn 35'000"}
    ],
    correct: "B",
    explain: "Der Jahresgewinn wird verbucht mit: Erfolgsrechnung an Eigenkapital. Die Erfolgsrechnung wird im Soll belastet (=abgeschlossen), das Eigenkapital nimmt im Haben zu."
  },
  {
    id: "e12", topic: "erfolgsrechnung", type: "calc", diff: 2, tax: "K3",
    q: "Ein Unternehmen hat folgende Erfolgskonten: Warenverkauf CHF 350'000, Lohnaufwand CHF 120'000, Mietaufwand CHF 36'000, Abschreibungen CHF 15'000, Finanzaufwand CHF 8'000, Finanzertrag CHF 4'000. Berechne den Jahresgewinn.",
    rows: [
      {label: "Total Erträge", answer: 354000, tolerance: 0, unit: "CHF"},
      {label: "Total Aufwände", answer: 179000, tolerance: 0, unit: "CHF"},
      {label: "Jahresgewinn", answer: 175000, tolerance: 0, unit: "CHF"}
    ],
    explain: "Erträge: 350'000 + 4'000 = 354'000. Aufwände: 120'000 + 36'000 + 15'000 + 8'000 = 179'000. Jahresgewinn = 354'000 – 179'000 = 175'000 CHF."
  },
  {
    id: "e13", topic: "erfolgsrechnung", type: "mc", diff: 3, tax: "K2",
    q: "Was versteht man unter «neutralem Erfolg» in der zweistufigen Erfolgsrechnung?",
    options: [
      {v: "A", t: "Der Erfolg, der weder Gewinn noch Verlust darstellt"},
      {v: "B", t: "Erträge und Aufwände, die betriebsfremd, ausserordentlich oder periodenfremd sind"},
      {v: "C", t: "Der Erfolg aus dem Kerngeschäft"},
      {v: "D", t: "Der Steueraufwand des Unternehmens"}
    ],
    correct: "B",
    explain: "Neutraler Erfolg umfasst Aufwände und Erträge, die nicht zum eigentlichen Geschäftszweck gehören (betriebsfremd), einmalig/ausserordentlich oder periodenfremd sind. Beispiele: Gewinn aus Liegenschaftsverkauf, Steueraufwand."
  },
  {
    id: "e14", topic: "erfolgsrechnung", type: "calc", diff: 3, tax: "K3",
    q: "Zweistufige Erfolgsrechnung: Warenverkauf CHF 395'000, Warenaufwand CHF 175'000, Lohnaufwand CHF 80'000, Sozialversicherungsaufwand CHF 15'000, Verwaltungsaufwand CHF 25'000, Abschreibungen CHF 15'000, Finanzaufwand CHF 10'000, Steueraufwand CHF 13'000, Gewinn aus Liegenschaftsverkauf CHF 20'000. Berechne Betriebsgewinn und Jahresgewinn.",
    rows: [
      {label: "Betriebsgewinn (1. Stufe)", answer: 75000, tolerance: 0, unit: "CHF"},
      {label: "Jahresgewinn (2. Stufe)", answer: 82000, tolerance: 0, unit: "CHF"}
    ],
    explain: "1. Stufe: Betriebserträge 395'000 – Betriebsaufwände (175'000 + 80'000 + 15'000 + 25'000 + 15'000 + 10'000) = 395'000 – 320'000 = 75'000 (Betriebsgewinn). 2. Stufe: Neutraler Erfolg = 20'000 – 13'000 = 7'000. Jahresgewinn = 75'000 + 7'000 = 82'000 CHF."
  },
  {
    id: "e15", topic: "erfolgsrechnung", type: "tf", diff: 1, tax: "K2",
    q: "Ertragskonten nehmen auf der Habenseite (rechts) zu und auf der Sollseite (links) ab.",
    correct: true,
    explain: "Richtig. Ertragskonten verhalten sich spiegelbildlich zu Aufwandkonten: Zunahmen stehen im Haben (rechts), Abnahmen und der Saldo im Soll (links)."
  },
  {
    id: "e16", topic: "erfolgsrechnung", type: "mc", diff: 2, tax: "K3",
    q: "Die Miete von CHF 3'000 wird per Bank bezahlt. Gleichzeitig wird eine Gutschrift für überzahlte Miete von CHF 500 auf das Mietaufwandkonto gebucht. Welcher Netto-Aufwand wird in der Erfolgsrechnung ausgewiesen?",
    options: [
      {v: "A", t: "CHF 3'500"},
      {v: "B", t: "CHF 3'000"},
      {v: "C", t: "CHF 2'500"},
      {v: "D", t: "CHF 500"}
    ],
    correct: "C",
    explain: "Mietaufwand (Soll): CHF 3'000, Gutschrift (Haben): CHF 500. Saldo des Aufwandkontos: 3'000 – 500 = 2'500 CHF. Dieser Netto-Aufwand erscheint in der Erfolgsrechnung."
  },
  {
    id: "e17", topic: "erfolgsrechnung", type: "mc", diff: 3, tax: "K3",
    q: "Ein Jahresverlust von CHF 10'000 wird ins Eigenkapital verbucht. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Erfolgsrechnung an Eigenkapital 10'000"},
      {v: "B", t: "Eigenkapital an Erfolgsrechnung 10'000"},
      {v: "C", t: "Verlust an Eigenkapital 10'000"},
      {v: "D", t: "Eigenkapital an Bank 10'000"}
    ],
    correct: "B",
    explain: "Bei einem Verlust nimmt das Eigenkapital ab. Buchungssatz: Eigenkapital an Erfolgsrechnung 10'000. Das Eigenkapital wird im Soll belastet (nimmt ab), die Erfolgsrechnung im Haben gutgeschrieben (abgeschlossen)."
  },

  // ============================================================
  // TOPIC: eigentuemer – Konten des Eigentümers
  // ============================================================

  {
    id: "p01", topic: "eigentuemer", type: "mc", diff: 1, tax: "K2",
    q: "Was zeigt das Eigenkapitalkonto?",
    options: [
      {v: "A", t: "Die kurzfristigen Schulden des Unternehmens"},
      {v: "B", t: "Die Schuld des Unternehmens gegenüber dem Geschäftseigentümer"},
      {v: "C", t: "Den Kassenbestand des Unternehmens"},
      {v: "D", t: "Den Jahresgewinn des Unternehmens"}
    ],
    correct: "B",
    explain: "Das Eigenkapital ist die rechnerische Schuld des Unternehmens gegenüber dem Geschäftseigentümer. Es zeigt, wie viel Kapital der Eigentümer dem Unternehmen zur Verfügung gestellt hat (inklusive einbehaltener Gewinne)."
  },
  {
    id: "p02", topic: "eigentuemer", type: "mc", diff: 1, tax: "K2",
    q: "Was ist das Privatkonto?",
    options: [
      {v: "A", t: "Ein Sparkonto des Unternehmens"},
      {v: "B", t: "Ein Unterkonto des Eigenkapitalkontos für private Bezüge und Einlagen des Eigentümers"},
      {v: "C", t: "Das Bankkonto des Eigentümers"},
      {v: "D", t: "Ein Aufwandkonto für Geschäftsspesen"}
    ],
    correct: "B",
    explain: "Das Privatkonto ist ein Unterkonto des Eigenkapitalkontos. Es erfasst laufende Privatbezüge (Entnahmen) und Privateinlagen des Eigentümers während des Geschäftsjahres."
  },
  {
    id: "p03", topic: "eigentuemer", type: "mc", diff: 2, tax: "K3",
    q: "Der Eigentümer bezieht CHF 4'000 bar aus der Geschäftskasse für private Zwecke. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Kasse an Privat 4'000"},
      {v: "B", t: "Privat an Kasse 4'000"},
      {v: "C", t: "Eigenkapital an Kasse 4'000"},
      {v: "D", t: "Lohnaufwand an Kasse 4'000"}
    ],
    correct: "B",
    explain: "Der Privatbezug belastet das Privatkonto im Soll (wie ein Aktivkonto). Die Kasse nimmt ab → Haben. Buchungssatz: Privat an Kasse 4'000."
  },
  {
    id: "p04", topic: "eigentuemer", type: "mc", diff: 2, tax: "K3",
    q: "Dem Eigentümer wird ein monatlicher Eigenlohn von CHF 6'000 gutgeschrieben. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Privat an Bank 6'000"},
      {v: "B", t: "Lohnaufwand an Privat 6'000"},
      {v: "C", t: "Bank an Eigenkapital 6'000"},
      {v: "D", t: "Eigenkapital an Privat 6'000"}
    ],
    correct: "B",
    explain: "Der Eigenlohn ist ein Aufwand des Unternehmens. Buchungssatz: Lohnaufwand an Privat 6'000. Der Aufwand steigt (Soll), das Privatkonto wird im Haben gutgeschrieben (der Eigentümer hat etwas zugute)."
  },
  {
    id: "p05", topic: "eigentuemer", type: "mc", diff: 2, tax: "K3",
    q: "Am Jahresende zeigt das Privatkonto: Sollseite CHF 52'000 (Privatbezüge), Habenseite CHF 72'000 (Eigenlohn). Der Habensaldo beträgt CHF 20'000. Wie wird das Privatkonto abgeschlossen?",
    options: [
      {v: "A", t: "Privat an Eigenkapital 20'000 (Überschuss wird dem EK gutgeschrieben)"},
      {v: "B", t: "Eigenkapital an Privat 20'000 (Überschuss wird vom EK abgezogen)"},
      {v: "C", t: "Privat an Erfolgsrechnung 20'000"},
      {v: "D", t: "Erfolgsrechnung an Privat 20'000"}
    ],
    correct: "A",
    explain: "Der Habensaldo von CHF 20'000 bedeutet, dass der Eigentümer weniger bezogen hat als sein Eigenlohn. Der Überschuss kommt dem Eigenkapital zugute: Privat an Eigenkapital 20'000."
  },
  {
    id: "p06", topic: "eigentuemer", type: "tf", diff: 2, tax: "K2",
    q: "Der Jahresgewinn wird direkt auf das Privatkonto verbucht.",
    correct: false,
    explain: "Falsch. Der Jahresgewinn wird auf das Eigenkapitalkonto verbucht (Erfolgsrechnung an Eigenkapital), nicht auf das Privatkonto. Das Privatkonto erfasst nur laufende Privatbezüge und -einlagen."
  },
  {
    id: "p07", topic: "eigentuemer", type: "fill", diff: 2, tax: "K3",
    q: "Das Geschäft bezahlt die private Krankenkassenprämie des Eigentümers von CHF 400 per Bank. Buchungssatz: {0} an {1} 400.",
    blanks: [
      {answer: "Privat", alts: ["Privatkonto"]},
      {answer: "Bank", alts: ["Bankkonto"]}
    ],
    explain: "Private Ausgaben, die über das Geschäft laufen, werden über das Privatkonto gebucht: Privat an Bank 400. Das Privatkonto wird im Soll belastet (Privatbezug), die Bank nimmt im Haben ab."
  },
  {
    id: "p08", topic: "eigentuemer", type: "calc", diff: 3, tax: "K3",
    q: "Eigenkapital am 1.1.: CHF 120'000. Während des Jahres: Privatbezüge CHF 60'000, Eigenlohn CHF 72'000, Jahresgewinn CHF 45'000. Berechne das Eigenkapital am 31.12.",
    rows: [
      {label: "Saldo Privatkonto (Haben-Überschuss)", answer: 12000, tolerance: 0, unit: "CHF"},
      {label: "Eigenkapital am 31.12.", answer: 177000, tolerance: 0, unit: "CHF"}
    ],
    explain: "Privatkonto: Haben (Eigenlohn) 72'000 – Soll (Bezüge) 60'000 = Habensaldo 12'000 (kommt zum EK). EK am 31.12. = 120'000 + 12'000 (Privatsaldo) + 45'000 (Gewinn) = 177'000 CHF."
  },
  {
    id: "p09", topic: "eigentuemer", type: "multi", diff: 2, tax: "K2",
    q: "Welche der folgenden Vorgänge werden über das Privatkonto gebucht? (Mehrere Antworten möglich.)",
    options: [
      {v: "A", t: "Der Eigentümer bezahlt seine private Telefonrechnung über das Geschäftskonto"},
      {v: "B", t: "Das Unternehmen zahlt die Büromiete"},
      {v: "C", t: "Dem Eigentümer wird ein monatlicher Eigenlohn gutgeschrieben"},
      {v: "D", t: "Der Eigentümer entnimmt Waren für den Privatgebrauch"}
    ],
    correct: ["A", "C", "D"],
    explain: "Über das Privatkonto laufen: private Zahlungen über das Geschäft (A), Eigenlohn (C) und Warenentnahmen für privat (D). Die Büromiete (B) ist ein Geschäftsaufwand und wird über Raumaufwand gebucht."
  },
  {
    id: "p10", topic: "eigentuemer", type: "mc", diff: 3, tax: "K4",
    q: "Am Jahresende zeigt das Privatkonto einen Sollsaldo von CHF 8'000. Was bedeutet das?",
    options: [
      {v: "A", t: "Der Eigentümer hat mehr bezogen als ihm gutgeschrieben wurde – das Eigenkapital wird um 8'000 reduziert"},
      {v: "B", t: "Der Eigentümer hat weniger bezogen als sein Eigenlohn – das Eigenkapital wird um 8'000 erhöht"},
      {v: "C", t: "Das Unternehmen hat 8'000 Verlust gemacht"},
      {v: "D", t: "Der Eigentümer schuldet dem Unternehmen 8'000"}
    ],
    correct: "A",
    explain: "Ein Sollsaldo auf dem Privatkonto bedeutet: Die Privatbezüge übersteigen die Gutschriften (Eigenlohn). Abschlussbuchung: Eigenkapital an Privat 8'000 – das Eigenkapital wird reduziert."
  },

  // ============================================================
  // TOPIC: warenkonten – Warenkonten & dreistufige Erfolgsrechnung
  // ============================================================

  {
    id: "w01", topic: "warenkonten", type: "mc", diff: 1, tax: "K1",
    q: "Was zeigt das Konto Wareneinkauf?",
    options: [
      {v: "A", t: "Den Verkaufserlös aus Warenverkäufen"},
      {v: "B", t: "Den Einstandswert der eingekauften Waren"},
      {v: "C", t: "Den Gewinn aus dem Warenhandel"},
      {v: "D", t: "Den Bestand an Waren im Lager"}
    ],
    correct: "B",
    explain: "Das Konto Wareneinkauf ist ein Aufwandkonto und zeigt den Einstandswert der eingekauften Waren (Einkaufspreis nach Abzug von Rabatten/Skonti und Zurechnung von Bezugsspesen)."
  },
  {
    id: "w02", topic: "warenkonten", type: "mc", diff: 1, tax: "K3",
    q: "Das Unternehmen kauft Waren für CHF 15'000 auf Rechnung. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Wareneinkauf an Kreditoren 15'000"},
      {v: "B", t: "Kreditoren an Wareneinkauf 15'000"},
      {v: "C", t: "Warenvorrat an Kreditoren 15'000"},
      {v: "D", t: "Wareneinkauf an Bank 15'000"}
    ],
    correct: "A",
    explain: "Der Wareneinkauf (Aufwandkonto) nimmt zu → Soll. Die Verbindlichkeit gegenüber dem Lieferanten (Kreditoren, Passivkonto) nimmt zu → Haben. Buchungssatz: Wareneinkauf an Kreditoren 15'000."
  },
  {
    id: "w03", topic: "warenkonten", type: "mc", diff: 2, tax: "K3",
    q: "Der Lieferant gewährt einen Rabatt von CHF 1'500 auf die Warenlieferung. Wie wird der Rabatt verbucht?",
    options: [
      {v: "A", t: "Wareneinkauf an Kreditoren 1'500"},
      {v: "B", t: "Kreditoren an Wareneinkauf 1'500"},
      {v: "C", t: "Rabatt an Wareneinkauf 1'500"},
      {v: "D", t: "Kasse an Wareneinkauf 1'500"}
    ],
    correct: "B",
    explain: "Der Rabatt reduziert sowohl die Schuld (Kreditoren) als auch den Aufwand (Wareneinkauf). Kreditoren nimmt ab → Soll, Wareneinkauf nimmt ab → Haben. Buchungssatz: Kreditoren an Wareneinkauf 1'500."
  },
  {
    id: "w04", topic: "warenkonten", type: "mc", diff: 2, tax: "K3",
    q: "Bezugsspesen (Fracht) von CHF 600 für eine Warenlieferung werden bar bezahlt. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Kasse an Wareneinkauf 600"},
      {v: "B", t: "Bezugsspesen an Kasse 600"},
      {v: "C", t: "Wareneinkauf an Kasse 600"},
      {v: "D", t: "Wareneinkauf an Kreditoren 600"}
    ],
    correct: "C",
    explain: "Bezugsspesen erhöhen den Einstandswert der Waren und werden direkt auf dem Konto Wareneinkauf verbucht: Wareneinkauf an Kasse 600."
  },
  {
    id: "w05", topic: "warenkonten", type: "mc", diff: 1, tax: "K3",
    q: "Das Unternehmen verkauft Waren für CHF 25'000 auf Rechnung. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Warenverkauf an Debitoren 25'000"},
      {v: "B", t: "Debitoren an Warenverkauf 25'000"},
      {v: "C", t: "Bank an Warenverkauf 25'000"},
      {v: "D", t: "Warenverkauf an Kreditoren 25'000"}
    ],
    correct: "B",
    explain: "Die Forderung (Debitoren, Aktivkonto) nimmt zu → Soll. Der Warenverkauf (Ertragskonto) nimmt zu → Haben. Buchungssatz: Debitoren an Warenverkauf 25'000."
  },
  {
    id: "w06", topic: "warenkonten", type: "mc", diff: 2, tax: "K3",
    q: "Am Jahresende ergibt die Inventur einen Warenvorrat von CHF 42'000. Der Anfangsbestand betrug CHF 35'000. Wie wird die Bestandeszunahme verbucht?",
    options: [
      {v: "A", t: "Wareneinkauf an Warenvorrat 7'000"},
      {v: "B", t: "Warenvorrat an Wareneinkauf 7'000"},
      {v: "C", t: "Warenvorrat an Warenverkauf 7'000"},
      {v: "D", t: "Warenvorrat an Erfolgsrechnung 7'000"}
    ],
    correct: "B",
    explain: "Bestandeszunahme: Endbestand (42'000) – Anfangsbestand (35'000) = 7'000 Zunahme. Warenvorrat (Aktivkonto) nimmt zu → Soll. Wareneinkauf (Aufwandkonto) nimmt ab → Haben. Buchungssatz: Warenvorrat an Wareneinkauf 7'000."
  },
  {
    id: "w07", topic: "warenkonten", type: "mc", diff: 2, tax: "K3",
    q: "Am Jahresende ergibt die Inventur einen Warenvorrat von CHF 28'000. Der Anfangsbestand betrug CHF 35'000. Wie wird die Bestandesabnahme verbucht?",
    options: [
      {v: "A", t: "Warenvorrat an Wareneinkauf 7'000"},
      {v: "B", t: "Wareneinkauf an Warenvorrat 7'000"},
      {v: "C", t: "Warenverkauf an Warenvorrat 7'000"},
      {v: "D", t: "Warenvorrat an Erfolgsrechnung 7'000"}
    ],
    correct: "B",
    explain: "Bestandesabnahme: Endbestand (28'000) – Anfangsbestand (35'000) = –7'000 (Abnahme). Wareneinkauf nimmt zu → Soll. Warenvorrat nimmt ab → Haben. Buchungssatz: Wareneinkauf an Warenvorrat 7'000."
  },
  {
    id: "w08", topic: "warenkonten", type: "fill", diff: 2, tax: "K3",
    q: "Der Eigentümer entnimmt Waren im Einstandswert von CHF 200 für den Privatgebrauch. Buchungssatz: {0} an {1} 200.",
    blanks: [
      {answer: "Privat", alts: ["Eigenverbrauch", "Privatbezug"]},
      {answer: "Wareneinkauf", alts: ["WE"]}
    ],
    explain: "Die Warenentnahme für private Zwecke wird zum Einstandspreis verbucht: Privat an Wareneinkauf 200. Der Wareneinkauf wird im Haben reduziert, das Privatkonto im Soll belastet."
  },
  {
    id: "w09", topic: "warenkonten", type: "calc", diff: 2, tax: "K3",
    q: "Dreistufige Erfolgsrechnung: Warenverkauf (Nettoumsatz) CHF 500'000, Wareneinkauf CHF 300'000, Bestandesabnahme Warenvorrat CHF 10'000. Berechne den Warenaufwand und den Bruttogewinn.",
    rows: [
      {label: "Warenaufwand (Einstandswert der verkauften Waren)", answer: 310000, tolerance: 0, unit: "CHF"},
      {label: "Bruttogewinn", answer: 190000, tolerance: 0, unit: "CHF"}
    ],
    explain: "Warenaufwand = Wareneinkauf + Bestandesabnahme = 300'000 + 10'000 = 310'000 CHF. Bruttogewinn = Warenverkauf – Warenaufwand = 500'000 – 310'000 = 190'000 CHF."
  },
  {
    id: "w10", topic: "warenkonten", type: "calc", diff: 3, tax: "K3",
    q: "Warenkalkulation: Katalogpreis CHF 10'000, Rabatt 20%, Skonto 2%, Bezugsspesen CHF 350. Berechne den Einstandspreis.",
    rows: [
      {label: "Nettozieleinkaufspreis (nach Rabatt)", answer: 8000, tolerance: 0, unit: "CHF"},
      {label: "Nettobareinkaufspreis (nach Skonto)", answer: 7840, tolerance: 0, unit: "CHF"},
      {label: "Einstandspreis", answer: 8190, tolerance: 0, unit: "CHF"}
    ],
    explain: "NZEP = 10'000 – 20% = 8'000. NBEP = 8'000 – 2% = 7'840. Einstandspreis = 7'840 + 350 = 8'190 CHF."
  },
  {
    id: "w11", topic: "warenkonten", type: "multi", diff: 2, tax: "K2",
    q: "Welche der folgenden Positionen reduzieren den Wareneinkauf (Haben-Buchung auf Wareneinkauf)? (Mehrere Antworten möglich.)",
    options: [
      {v: "A", t: "Lieferantenrabatt"},
      {v: "B", t: "Bezugsspesen"},
      {v: "C", t: "Lieferantenskonto"},
      {v: "D", t: "Rücksendung an Lieferant"}
    ],
    correct: ["A", "C", "D"],
    explain: "Rabatte, Skonti und Rücksendungen reduzieren den Wareneinkauf (Haben-Buchung). Bezugsspesen hingegen erhöhen den Wareneinkauf (Soll-Buchung), da sie den Einstandswert vergrössern."
  },
  {
    id: "w12", topic: "warenkonten", type: "mc", diff: 2, tax: "K3",
    q: "Ein Kunde sendet fehlerhafte Waren im Wert von CHF 2'000 zurück. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Warenverkauf an Debitoren 2'000"},
      {v: "B", t: "Debitoren an Warenverkauf 2'000"},
      {v: "C", t: "Warenverkauf an Kasse 2'000"},
      {v: "D", t: "Wareneinkauf an Debitoren 2'000"}
    ],
    correct: "A",
    explain: "Der Warenverkauf (Ertragskonto) wird im Soll belastet (reduziert). Die Debitoren (Forderung) nehmen im Haben ab. Buchungssatz: Warenverkauf an Debitoren 2'000."
  },
  {
    id: "w13", topic: "warenkonten", type: "calc", diff: 3, tax: "K3",
    img: {src: "img/bwl/fibu/fibu_dreistufige_er_01.svg", alt: "Schema der dreistufigen Erfolgsrechnung mit drei Berechnungsstufen"},
    q: "Dreistufige ER: Warenverkauf CHF 800'000, Warenaufwand CHF 480'000, Lohnaufwand CHF 150'000, Mietaufwand CHF 48'000, Abschreibungen CHF 20'000, Finanzaufwand CHF 12'000, Steueraufwand CHF 18'000, ausserordentlicher Ertrag CHF 5'000. Berechne alle drei Stufen.",
    rows: [
      {label: "Bruttogewinn (1. Stufe)", answer: 320000, tolerance: 0, unit: "CHF"},
      {label: "Betriebsgewinn (2. Stufe)", answer: 90000, tolerance: 0, unit: "CHF"},
      {label: "Jahresgewinn (3. Stufe)", answer: 77000, tolerance: 0, unit: "CHF"}
    ],
    explain: "1. Stufe: 800'000 – 480'000 = 320'000 (Bruttogewinn). 2. Stufe: 320'000 – 150'000 – 48'000 – 20'000 – 12'000 = 90'000 (Betriebsgewinn). 3. Stufe: 90'000 + 5'000 – 18'000 = 77'000 (Jahresgewinn)."
  },
  {
    id: "w14", topic: "warenkonten", type: "tf", diff: 1, tax: "K2",
    q: "Das Konto Warenvorrat ist ein Aktivkonto (Bestandeskonto) und zeigt den Lagerwert der Waren am Bilanzstichtag.",
    correct: true,
    explain: "Richtig. Das Konto Warenvorrat gehört zum Umlaufvermögen (Aktivkonto). Der Endbestand wird durch eine Inventur ermittelt und zum Einstandspreis bewertet."
  },
  {
    id: "w15", topic: "warenkonten", type: "fill", diff: 3, tax: "K3",
    q: "Der Saldo des Kontos Wareneinkauf nach der Verbuchung der Bestandesänderung zeigt den {0} der verkauften Waren, auch genannt {1}.",
    blanks: [
      {answer: "Einstandswert", alts: ["Einstandspreis"]},
      {answer: "Warenaufwand", alts: ["Wareneinsatz"]}
    ],
    explain: "Nach Verbuchung der Bestandesänderung zeigt der Saldo des Kontos Wareneinkauf den Einstandswert der verkauften Waren, auch Warenaufwand (oder Wareneinsatz) genannt. Dieser geht in die 1. Stufe der dreistufigen Erfolgsrechnung ein."
  },
  {
    id: "w16", topic: "warenkonten", type: "calc", diff: 2, tax: "K3",
    q: "Ein Unternehmen erzielt einen Warenverkauf von CHF 600'000 und einen Warenaufwand von CHF 390'000. Berechne den Bruttogewinnzuschlag und die Bruttogewinnquote (auf ganze Prozent gerundet).",
    rows: [
      {label: "Bruttogewinn", answer: 210000, tolerance: 0, unit: "CHF"},
      {label: "Bruttogewinnzuschlag (gerundet)", answer: 54, tolerance: 1, unit: "%"},
      {label: "Bruttogewinnquote (gerundet)", answer: 35, tolerance: 1, unit: "%"}
    ],
    explain: "Bruttogewinn = 600'000 – 390'000 = 210'000. Bruttogewinnzuschlag = (210'000 × 100) / 390'000 ≈ 53.8% ≈ 54%. Bruttogewinnquote = (210'000 × 100) / 600'000 = 35%."
  },

  // ============================================================
  // TOPIC: wertberichtigungen – Wertberichtigungen & Abschreibungen
  // ============================================================

  {
    id: "v01", topic: "wertberichtigungen", type: "mc", diff: 1, tax: "K1",
    q: "Warum müssen Anlagevermögenswerte abgeschrieben werden?",
    options: [
      {v: "A", t: "Um den Gewinn künstlich zu erhöhen"},
      {v: "B", t: "Weil sie durch Alterung und Nutzung an Wert verlieren"},
      {v: "C", t: "Weil das Gesetz keine Bilanzierung von Anlagevermögen erlaubt"},
      {v: "D", t: "Um die Bilanzsumme möglichst hoch zu halten"}
    ],
    correct: "B",
    explain: "Anlagevermögen (Fahrzeuge, Maschinen, Gebäude) verliert durch Alterung, Abnutzung und technische Überholung an Wert. Abschreibungen erfassen diesen Wertverlust buchmässig."
  },
  {
    id: "v02", topic: "wertberichtigungen", type: "mc", diff: 1, tax: "K2",
    q: "Was ist der Unterschied zwischen direkter und indirekter Abschreibung?",
    options: [
      {v: "A", t: "Direkt: Abschreibung wird direkt vom Aktivkonto abgezogen. Indirekt: Abschreibung wird auf einem separaten Wertberichtigungskonto erfasst."},
      {v: "B", t: "Direkt: Abschreibung erfolgt jährlich. Indirekt: Abschreibung erfolgt monatlich."},
      {v: "C", t: "Direkt: Abschreibung nur für Maschinen. Indirekt: Abschreibung nur für Immobilien."},
      {v: "D", t: "Es gibt keinen Unterschied."}
    ],
    correct: "A",
    explain: "Bei der direkten Abschreibung wird der Buchwert direkt auf dem Aktivkonto reduziert (Abschreibungen an Aktivkonto). Bei der indirekten Abschreibung bleibt der Anschaffungswert auf dem Aktivkonto stehen, und die kummulierten Abschreibungen werden auf einem separaten Wertberichtigungskonto gesammelt."
  },
  {
    id: "v03", topic: "wertberichtigungen", type: "fill", diff: 1, tax: "K3",
    q: "Die direkte Abschreibung auf Maschinen von CHF 10'000 wird wie folgt verbucht: {0} an {1} 10'000.",
    blanks: [
      {answer: "Abschreibungen", alts: ["Abschreibungsaufwand"]},
      {answer: "Maschinen", alts: ["Maschinenkonto"]}
    ],
    explain: "Direkte Abschreibung: Abschreibungen (Aufwandkonto, Soll) an Maschinen (Aktivkonto, Haben). Der Buchwert der Maschinen sinkt direkt."
  },
  {
    id: "v04", topic: "wertberichtigungen", type: "fill", diff: 2, tax: "K3",
    q: "Die indirekte Abschreibung auf Fahrzeuge von CHF 8'000 wird wie folgt verbucht: {0} an {1} 8'000.",
    blanks: [
      {answer: "Abschreibungen", alts: ["Abschreibungsaufwand"]},
      {answer: "Wertberichtigung Fahrzeuge", alts: ["WB Fahrzeuge"]}
    ],
    explain: "Indirekte Abschreibung: Abschreibungen (Aufwandkonto, Soll) an Wertberichtigung Fahrzeuge (Minus-Aktivkonto, Haben). Der Anschaffungswert bleibt auf dem Fahrzeugkonto sichtbar."
  },
  {
    id: "v05", topic: "wertberichtigungen", type: "calc", diff: 2, tax: "K3",
    q: "Eine Maschine wurde für CHF 50'000 angeschafft. Die Nutzungsdauer beträgt 10 Jahre. Berechne die jährliche lineare Abschreibung und den Buchwert nach 3 Jahren.",
    rows: [
      {label: "Jährliche lineare Abschreibung", answer: 5000, tolerance: 0, unit: "CHF"},
      {label: "Buchwert nach 3 Jahren", answer: 35000, tolerance: 0, unit: "CHF"}
    ],
    explain: "Lineare Abschreibung = 50'000 / 10 = 5'000 CHF pro Jahr. Buchwert nach 3 Jahren = 50'000 – (3 × 5'000) = 35'000 CHF."
  },
  {
    id: "v06", topic: "wertberichtigungen", type: "calc", diff: 3, tax: "K3",
    q: "Ein Fahrzeug wurde für CHF 60'000 angeschafft und wird degressiv mit 25% vom Buchwert abgeschrieben. Berechne die Abschreibung und den Buchwert für die ersten 3 Jahre.",
    rows: [
      {label: "Abschreibung Jahr 1", answer: 15000, tolerance: 0, unit: "CHF"},
      {label: "Buchwert nach Jahr 1", answer: 45000, tolerance: 0, unit: "CHF"},
      {label: "Abschreibung Jahr 2", answer: 11250, tolerance: 0, unit: "CHF"},
      {label: "Buchwert nach Jahr 2", answer: 33750, tolerance: 0, unit: "CHF"},
      {label: "Abschreibung Jahr 3", answer: 8438, tolerance: 2, unit: "CHF"}
    ],
    explain: "Degressive Abschreibung: Immer 25% vom aktuellen Buchwert. Jahr 1: 60'000 × 25% = 15'000 → BW 45'000. Jahr 2: 45'000 × 25% = 11'250 → BW 33'750. Jahr 3: 33'750 × 25% = 8'437.50 ≈ 8'438 → BW 25'312."
  },
  {
    id: "v07", topic: "wertberichtigungen", type: "mc", diff: 2, tax: "K3",
    q: "Ein Fahrzeug mit einem Buchwert von CHF 12'000 wird für CHF 15'000 verkauft. Wie wird der Verkaufsgewinn verbucht?",
    options: [
      {v: "A", t: "Bank an Fahrzeuge 12'000 und Bank an a.o. Ertrag 3'000"},
      {v: "B", t: "Bank an Fahrzeuge 15'000"},
      {v: "C", t: "Fahrzeuge an Bank 15'000"},
      {v: "D", t: "Abschreibungen an Fahrzeuge 3'000"}
    ],
    correct: "A",
    explain: "Der Verkaufspreis (CHF 15'000) übersteigt den Buchwert (CHF 12'000) um CHF 3'000. Bank erhält 15'000 (Soll), Fahrzeuge wird um 12'000 ausgebucht (Haben), der Gewinn von 3'000 wird als a.o. Ertrag erfasst (Haben)."
  },
  {
    id: "v08", topic: "wertberichtigungen", type: "mc", diff: 1, tax: "K2",
    q: "Was ist das Delkredere?",
    options: [
      {v: "A", t: "Ein Aufwandkonto für Warenrücksendungen"},
      {v: "B", t: "Ein Minus-Aktivkonto (Wertberichtigung) für mutmassliche Debitorenverluste"},
      {v: "C", t: "Ein Ertragskonto für Zinseinkünfte"},
      {v: "D", t: "Ein Passivkonto für langfristige Schulden"}
    ],
    correct: "B",
    explain: "Das Delkredere ist ein Minus-Aktivkonto (Korrekturkonto zu den Debitoren). Es erfasst die geschätzten, wahrscheinlichen Verluste aus offenen Forderungen. Debitoren minus Delkredere = Nettowert der Forderungen."
  },
  {
    id: "v09", topic: "wertberichtigungen", type: "fill", diff: 2, tax: "K3",
    q: "Das Delkredere soll auf 5% des Debitorenbestands (CHF 80'000) angepasst werden. Der bisherige Delkredere-Bestand beträgt CHF 2'000. Erhöhung um CHF 2'000. Buchungssatz: {0} an {1} 2'000.",
    blanks: [
      {answer: "Debitorenverluste", alts: ["Debitorenverlust"]},
      {answer: "Delkredere", alts: ["DK"]}
    ],
    explain: "Soll-Delkredere: 5% von 80'000 = 4'000. Bestehend: 2'000. Erhöhung: 2'000. Buchungssatz: Debitorenverluste (Aufwandkonto) an Delkredere (Minus-Aktivkonto) 2'000."
  },
  {
    id: "v10", topic: "wertberichtigungen", type: "calc", diff: 3, tax: "K3",
    q: "Der Debitorenbestand beträgt CHF 120'000. Das Delkredere soll 5% betragen. Der bisherige Delkredere-Stand beträgt CHF 8'000. Berechne den Soll-Bestand und die nötige Anpassung.",
    rows: [
      {label: "Soll-Bestand Delkredere (5%)", answer: 6000, tolerance: 0, unit: "CHF"},
      {label: "Anpassungsbetrag (– = Auflösung)", answer: -2000, tolerance: 0, unit: "CHF"}
    ],
    explain: "Soll-Bestand: 5% von 120'000 = 6'000. Ist-Bestand: 8'000. Differenz: 6'000 – 8'000 = –2'000 (Auflösung). Buchungssatz: Delkredere an Debitorenverluste 2'000. Das Delkredere wird reduziert, der Aufwand gutgeschrieben."
  },
  {
    id: "v11", topic: "wertberichtigungen", type: "mc", diff: 2, tax: "K3",
    q: "Ein Debitor kann seine Schuld von CHF 3'000 definitiv nicht bezahlen (Verlustschein). Wie wird der tatsächliche Verlust verbucht?",
    options: [
      {v: "A", t: "Debitorenverluste an Debitoren 3'000"},
      {v: "B", t: "Debitoren an Debitorenverluste 3'000"},
      {v: "C", t: "Delkredere an Debitoren 3'000"},
      {v: "D", t: "Bank an Debitorenverluste 3'000"}
    ],
    correct: "A",
    explain: "Der tatsächliche Verlust wird verbucht mit: Debitorenverluste (Aufwandkonto) an Debitoren (Aktivkonto) 3'000. Die Forderung wird ausgebucht, der Verlust als Aufwand erfasst."
  },
  {
    id: "v12", topic: "wertberichtigungen", type: "multi", diff: 2, tax: "K2",
    q: "Welche Aussagen zur linearen Abschreibung sind korrekt? (Mehrere Antworten möglich.)",
    options: [
      {v: "A", t: "Der jährliche Abschreibungsbetrag ist immer gleich hoch"},
      {v: "B", t: "Die Abschreibung wird vom Anschaffungswert berechnet"},
      {v: "C", t: "Der Buchwert sinkt jedes Jahr um denselben Betrag"},
      {v: "D", t: "Die Abschreibung wird vom aktuellen Buchwert berechnet"}
    ],
    correct: ["A", "B", "C"],
    explain: "Bei der linearen Abschreibung ist der jährliche Betrag konstant (A), wird vom Anschaffungswert berechnet (B), und der Buchwert sinkt gleichmässig (C). D trifft auf die degressive Abschreibung zu."
  },
  {
    id: "v13", topic: "wertberichtigungen", type: "tf", diff: 3, tax: "K4",
    q: "Bei der indirekten Abschreibung kann der ursprüngliche Anschaffungswert eines Aktivums jederzeit in der Bilanz abgelesen werden.",
    correct: true,
    explain: "Richtig. Das ist der Hauptvorteil der indirekten Abschreibung: Der Anschaffungswert bleibt auf dem Aktivkonto stehen, und die kumulierten Abschreibungen stehen auf dem separaten Wertberichtigungskonto. Buchwert = Aktivkonto – Wertberichtigung."
  },

  // ============================================================
  // TOPIC: abgrenzungen – Rechnungsabgrenzungen & Rückstellungen
  // ============================================================

  {
    id: "a01", topic: "abgrenzungen", type: "mc", diff: 1, tax: "K2",
    q: "Warum sind Rechnungsabgrenzungen am Jahresende nötig?",
    options: [
      {v: "A", t: "Um die Bilanzsumme möglichst hoch auszuweisen"},
      {v: "B", t: "Um Aufwände und Erträge der richtigen Geschäftsperiode zuzuordnen (Periodengerechtigkeit)"},
      {v: "C", t: "Um Steuern zu sparen"},
      {v: "D", t: "Um das Eigenkapital zu erhöhen"}
    ],
    correct: "B",
    explain: "Rechnungsabgrenzungen stellen sicher, dass Aufwände und Erträge in der Periode erfasst werden, in der sie wirtschaftlich angefallen sind (Grundsatz der Periodengerechtigkeit)."
  },
  {
    id: "a02", topic: "abgrenzungen", type: "mc", diff: 1, tax: "K2",
    img: {src: "img/bwl/fibu/fibu_abgrenzungen_01.svg", alt: "Übersicht: Transitorische Aktiven, Transitorische Passiven und Rückstellungen"},
    q: "Was sind Transitorische Aktiven (TA)?",
    options: [
      {v: "A", t: "Vorausbezahlte Aufwände oder noch nicht erhaltene Erträge, die ins neue Jahr gehören"},
      {v: "B", t: "Vorauserhaltene Erträge oder noch nicht bezahlte Aufwände"},
      {v: "C", t: "Langfristige Vermögenswerte"},
      {v: "D", t: "Rückstellungen für zukünftige Ausgaben"}
    ],
    correct: "A",
    explain: "Transitorische Aktiven entstehen, wenn ein Aufwand im alten Jahr bezahlt wurde, aber (teilweise) das neue Jahr betrifft (vorausbezahlter Aufwand), oder wenn ein Ertrag im alten Jahr entstanden ist, aber noch nicht eingegangen ist (noch nicht erhaltener Ertrag)."
  },
  {
    id: "a03", topic: "abgrenzungen", type: "mc", diff: 1, tax: "K2",
    q: "Was sind Transitorische Passiven (TP)?",
    options: [
      {v: "A", t: "Vorausbezahlte Aufwände"},
      {v: "B", t: "Noch nicht bezahlte Aufwände des alten Jahres oder vorauserhaltene Erträge"},
      {v: "C", t: "Kurzfristige Schulden"},
      {v: "D", t: "Abschreibungen auf Anlagevermögen"}
    ],
    correct: "B",
    explain: "Transitorische Passiven entstehen, wenn ein Aufwand des alten Jahres noch nicht bezahlt wurde (noch nicht bezahlter Aufwand), oder wenn ein Ertrag im alten Jahr erhalten wurde, aber das neue Jahr betrifft (vorauserhaltener Ertrag)."
  },
  {
    id: "a04", topic: "abgrenzungen", type: "mc", diff: 2, tax: "K3",
    q: "Am 1. Oktober bezahlt das Unternehmen die Versicherungsprämie von CHF 12'000 für ein ganzes Jahr (Okt.–Sept.) per Bank. Am 31.12. muss abgegrenzt werden. Wie lautet die Abgrenzungsbuchung?",
    options: [
      {v: "A", t: "Transitorische Aktiven an Versicherungsaufwand 9'000"},
      {v: "B", t: "Versicherungsaufwand an Transitorische Aktiven 9'000"},
      {v: "C", t: "Transitorische Passiven an Versicherungsaufwand 9'000"},
      {v: "D", t: "Transitorische Aktiven an Versicherungsaufwand 3'000"}
    ],
    correct: "A",
    explain: "Von den CHF 12'000 betreffen nur 3 Monate (Okt.–Dez.) das alte Jahr = CHF 3'000. Die restlichen 9 Monate (Jan.–Sept.) = CHF 9'000 gehören ins neue Jahr. Abgrenzung: TA an Versicherungsaufwand 9'000. Der Aufwand im alten Jahr wird auf 3'000 korrigiert."
  },
  {
    id: "a05", topic: "abgrenzungen", type: "mc", diff: 2, tax: "K3",
    q: "Am 31.12. ist der Dezemberlohn von CHF 15'000 noch nicht bezahlt. Wie lautet die Abgrenzungsbuchung?",
    options: [
      {v: "A", t: "Transitorische Aktiven an Lohnaufwand 15'000"},
      {v: "B", t: "Lohnaufwand an Transitorische Passiven 15'000"},
      {v: "C", t: "Lohnaufwand an Bank 15'000"},
      {v: "D", t: "Transitorische Passiven an Lohnaufwand 15'000"}
    ],
    correct: "B",
    explain: "Der Lohnaufwand gehört ins alte Jahr (Dezember), ist aber noch nicht bezahlt. Der Aufwand muss erfasst werden: Lohnaufwand an TP 15'000. Die TP zeigt die noch offene Verpflichtung."
  },
  {
    id: "a06", topic: "abgrenzungen", type: "fill", diff: 2, tax: "K3",
    q: "Am 1. Juli hat das Unternehmen CHF 6'000 Miete für 12 Monate im Voraus erhalten. Am 31.12. muss für die verbleibenden 6 Monate abgegrenzt werden. Buchungssatz: {0} an {1} 3'000.",
    blanks: [
      {answer: "Mietertrag", alts: ["Immobilienertrag"]},
      {answer: "Transitorische Passiven", alts: ["TP"]}
    ],
    explain: "Vom erhaltenen Mietertrag von CHF 6'000 betreffen 6 Monate (Juli–Dez.) das alte Jahr = CHF 3'000. Die anderen 6 Monate (Jan.–Juni) = CHF 3'000 gehören ins neue Jahr. Abgrenzung: Mietertrag an TP 3'000."
  },
  {
    id: "a07", topic: "abgrenzungen", type: "mc", diff: 2, tax: "K2",
    q: "Was ist der Hauptunterschied zwischen Transitorischen Passiven und Rückstellungen?",
    options: [
      {v: "A", t: "TP sind kurzfristig, Rückstellungen immer langfristig"},
      {v: "B", t: "Bei TP sind Betrag und Fälligkeit bekannt, bei Rückstellungen sind Betrag oder Fälligkeit unsicher"},
      {v: "C", t: "TP betreffen nur Aufwände, Rückstellungen nur Erträge"},
      {v: "D", t: "Es gibt keinen Unterschied"}
    ],
    correct: "B",
    explain: "Bei Transitorischen Passiven sind Betrag und Fälligkeit bekannt (z.B. offener Dezemberlohn). Bei Rückstellungen ist der Betrag und/oder die Fälligkeit der Zahlung unsicher (z.B. hängiger Rechtsstreit, Garantieansprüche)."
  },
  {
    id: "a08", topic: "abgrenzungen", type: "mc", diff: 2, tax: "K3",
    q: "Das Unternehmen bildet eine Rückstellung von CHF 20'000 für einen hängigen Rechtsstreit. Wie lautet der Buchungssatz?",
    options: [
      {v: "A", t: "Prozessaufwand an Rückstellungen 20'000"},
      {v: "B", t: "Rückstellungen an Bank 20'000"},
      {v: "C", t: "Rückstellungen an Prozessaufwand 20'000"},
      {v: "D", t: "Bank an Rückstellungen 20'000"}
    ],
    correct: "A",
    explain: "Die Bildung einer Rückstellung: Aufwandkonto (Soll) an Rückstellungen (Passivkonto, Haben). Es entsteht ein Aufwand im alten Jahr und eine Verbindlichkeit mit unsicherem Betrag/Zeitpunkt."
  },
  {
    id: "a09", topic: "abgrenzungen", type: "mc", diff: 3, tax: "K3",
    q: "Der Rechtsstreit wird im Folgejahr beigelegt. Das Unternehmen zahlt CHF 15'000 (weniger als die Rückstellung von CHF 20'000). Wie wird die Auflösung der Rückstellung verbucht?",
    options: [
      {v: "A", t: "Rückstellungen an Bank 15'000 und Rückstellungen an a.o. Ertrag 5'000"},
      {v: "B", t: "Prozessaufwand an Bank 15'000"},
      {v: "C", t: "Rückstellungen an Bank 20'000"},
      {v: "D", t: "Bank an Rückstellungen 15'000"}
    ],
    correct: "A",
    explain: "Die Rückstellung von CHF 20'000 wird aufgelöst: CHF 15'000 werden bezahlt (Rückstellungen an Bank 15'000). Die Differenz von CHF 5'000 (nicht benötigter Teil) wird als ausserordentlicher Ertrag erfasst: Rückstellungen an a.o. Ertrag 5'000."
  },
  {
    id: "a10", topic: "abgrenzungen", type: "calc", diff: 3, tax: "K3",
    q: "Am 1. September nimmt das Unternehmen ein Darlehen von CHF 100'000 zu 3% Jahreszins auf. Die Zinsen werden halbjährlich am 28.2. und 31.8. bezahlt. Am 31.12. muss abgegrenzt werden. Berechne den aufgelaufenen Zins für 4 Monate (Sept.–Dez.).",
    rows: [
      {label: "Aufgelaufener Zins (4 Monate)", answer: 1000, tolerance: 0, unit: "CHF"},
    ],
    explain: "Jahreszins: 100'000 × 3% = 3'000 CHF. Monatszins: 3'000 / 12 = 250 CHF. Für 4 Monate (Sept.–Dez.): 4 × 250 = 1'000 CHF. Abgrenzungsbuchung: Finanzaufwand an TP 1'000."
  },
  {
    id: "a11", topic: "abgrenzungen", type: "multi", diff: 2, tax: "K2",
    q: "Welche der folgenden Situationen erfordern eine Transitorische Aktive (TA)? (Mehrere Antworten möglich.)",
    options: [
      {v: "A", t: "Versicherungsprämie für Januar–Dezember im Voraus bezahlt (Bilanzstichtag 30.6.)"},
      {v: "B", t: "Dezemberlohn noch nicht bezahlt am 31.12."},
      {v: "C", t: "Zinsgutschrift der Bank für das 4. Quartal noch nicht erhalten am 31.12."},
      {v: "D", t: "Miete für Januar des Folgejahres bereits im Dezember erhalten"}
    ],
    correct: ["A", "C"],
    explain: "TA = vorausbezahlter Aufwand oder noch nicht erhaltener Ertrag. A) Vorausbezahlte Versicherung. C) Noch nicht erhaltener Zinsertrag. B) erfordert eine TP (noch nicht bezahlter Aufwand). D) erfordert ebenfalls eine TP (vorauserhaltener Ertrag)."
  },
  {
    id: "a12", topic: "abgrenzungen", type: "tf", diff: 1, tax: "K2",
    q: "Transitorische Buchungen werden nur am Jahresende vorgenommen und im Folgejahr wieder aufgelöst.",
    correct: true,
    explain: "Richtig. Transitorische Buchungen werden am Bilanzstichtag (Jahresende) erfasst und nach der Bilanzeröffnung im neuen Jahr durch Gegenbuchungen (Stornobuchungen) wieder aufgelöst."
  },
  {
    id: "a13", topic: "abgrenzungen", type: "fill", diff: 3, tax: "K3",
    q: "Die Auflösung einer Transitorischen Aktive von CHF 9'000 (vorausbezahlte Versicherung) im neuen Jahr lautet: {0} an {1} 9'000.",
    blanks: [
      {answer: "Versicherungsaufwand", alts: ["Aufwand"]},
      {answer: "Transitorische Aktiven", alts: ["TA"]}
    ],
    explain: "Die Gegenbuchung im neuen Jahr: Versicherungsaufwand an TA 9'000. Der Aufwand wird im neuen Jahr erfasst, die TA wird aufgelöst."
  }

];
