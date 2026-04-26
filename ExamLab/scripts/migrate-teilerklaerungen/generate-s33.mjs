#!/usr/bin/env node
// Session 33 — 50 BWL/mc Fragen
// Appendet an fragen-updates.jsonl und updated state.json

import fs from 'node:fs';

const UPDATES = [
  // 1. b6d256c6 — BCG Question Marks (Multi)
  {
    id: 'b6d256c6-f0fb-4ab1-b7dc-34309d58caeb',
    fachbereich: 'BWL',
    musterlosung: 'Question Marks haben einen kleinen Marktanteil in einem stark wachsenden Markt. Ihre Zukunft ist unsicher — sie können zu Stars werden oder als Poor Dogs enden. Die Normstrategie ist intensive Marktbearbeitung mit hohen Investitionen, um Marktanteile zu gewinnen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Question Marks sind definiert durch kleinen Marktanteil bei hoher Marktwachstumsrate.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Question Marks können Stars werden oder als Poor Dogs enden — ihre Zukunft ist offen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gerade Question Marks erfordern hohe Investitionen in Marktbearbeitung, um Anteile zu gewinnen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Normstrategie ist intensive Marktbearbeitung mit Werbung und Vertriebsausbau.' },
    ],
  },
  // 2. b704221c — Espace Mittelland
  {
    id: 'b704221c-d41d-47ff-ba0a-3cc145a4eabe',
    fachbereich: 'BWL',
    musterlosung: 'Der Espace Mittelland hat mit rund 121\'000 Unternehmen die meisten Unternehmen der Schweiz, knapp vor der Genferseeregion und Zürich. Grund sind die Fläche und Bevölkerung der Region, die Kantone wie Bern, Solothurn, Freiburg, Neuenburg und Jura umfasst.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Zürich hat mit rund 106\'000 Unternehmen weniger als der Espace Mittelland.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Der Espace Mittelland führt mit rund 121\'000 Unternehmen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Nordwestschweiz liegt deutlich hinter den führenden Regionen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Genferseeregion ist mit rund 115\'000 Unternehmen knapp hinter dem Espace Mittelland.' },
    ],
  },
  // 3. b7518be0 — Unternehmenskonzept drei Bereiche
  {
    id: 'b7518be0-0305-46d0-9ce4-c65cfe27f988',
    fachbereich: 'BWL',
    musterlosung: 'Das Unternehmenskonzept wird in drei Bereiche gegliedert: leistungswirtschaftlich (Produkte, Märkte, Produktion), finanzwirtschaftlich (Gewinn, Kapital, Liquidität) und sozial/ökologisch (Mitarbeitende, Gesellschaft, Umwelt). Ein rein politischer Bereich ist nicht Teil des klassischen Unternehmenskonzepts.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Der leistungswirtschaftliche Bereich umfasst Produkte, Märkte und Produktion.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Der finanzwirtschaftliche Bereich regelt Gewinn, Kapitalstruktur und Liquidität.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Der soziale und ökologische Bereich betrifft Mitarbeitende, Gesellschaft und Umwelt.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Politische Ziele sind kein eigener Bereich im Unternehmenskonzept.' },
    ],
  },
  // 4. b79da624 — Abschlussbuchungssatz Aktivkonto
  {
    id: 'b79da624-aea4-4b7f-8eac-67794496865d',
    fachbereich: 'BWL',
    musterlosung: 'Aktivkonten werden über die Schlussbilanz abgeschlossen. Der Schlusssaldo des Aktivkontos steht im Haben und wird in die Schlussbilanz übertragen. Der korrekte Buchungssatz lautet: Schlussbilanz an Kasse.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Aktivkonten werden nicht über die Erfolgsrechnung abgeschlossen, sondern über die Schlussbilanz.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Schlussbilanz an Kasse — Saldo im Haben des Aktivkontos in die Schlussbilanz.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Umgekehrter Buchungssatz — Kasse steht beim Abschluss im Haben, nicht im Soll.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Eröffnungsbilanz betrifft den Jahresstart, nicht den Jahresabschluss.' },
    ],
  },
  // 5. b7b57c7f — Bio-Getränk Segmentierung
  {
    id: 'b7b57c7f-7a76-42f5-b662-78d7e25881c8',
    fachbereich: 'BWL',
    musterlosung: 'Je präziser die Zielgruppe definiert ist, desto gezielter können Produkt, Kommunikation und Vertriebskanäle auf deren Bedürfnisse abgestimmt werden. Die Zielgruppe wird dadurch kleiner, nicht grösser — das ist die bewusste strategische Entscheidung hinter Segmentierung.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Präzise Segmentierung erlaubt gezielt zugeschnittene Marketingmassnahmen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Mehr Kriterien engen die Zielgruppe ein, sie wird kleiner, nicht grösser.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Eine kleine Zielgruppe ist gewollt, nicht ein Argument gegen Segmentierung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Zielsetzung ist treffsichere Ansprache, nicht primär Kostenersparnis.' },
    ],
  },
  // 6. b7edf9a6 — Bilanz Stichtag
  {
    id: 'b7edf9a6-8465-4415-94a3-916042e53a90',
    fachbereich: 'BWL',
    musterlosung: 'Die Bilanz ist eine Momentaufnahme des Vermögens und der Finanzierung an einem bestimmten Stichtag (Bestandesgrösse). Die Erfolgsrechnung zeigt dagegen die Aufwände und Erträge einer Periode (Stromgrösse). Beide Darstellungen ergänzen sich im Jahresabschluss.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Bilanz zeigt sowohl Vermögen (Aktiven) als auch Schulden und Eigenkapital (Passiven).' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Bilanz wird in der Regel jährlich erstellt und zeigt keinen Umsatz.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die periodenbezogene Sicht liefert die Erfolgsrechnung, nicht die Bilanz.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Die Bilanz ist eine Momentaufnahme am Stichtag und damit eine Bestandesgrösse.' },
    ],
  },
  // 7. bccc9a75 — FIBU Hauptaufgabe NICHT
  {
    id: 'bccc9a75-5238-4c51-9270-ad66fc9a8fca',
    fachbereich: 'BWL',
    musterlosung: 'Die Finanzbuchhaltung hat fünf Hauptaufgaben: Ausweis von Gewinn und Verlust, Übersicht über Forderungen und Schulden, Beweismittel, Kalkulationsgrundlage sowie Grundlage für die Steuerberechnung. Marketingkampagnen gehören zum Marketing, nicht zur Buchhaltung.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Marketingplanung ist Aufgabe des Marketings, nicht der Finanzbuchhaltung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Steuerberechnung stützt sich direkt auf Zahlen der Finanzbuchhaltung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Ausweis von Gewinn und Verlust ist Kernaufgabe der Finanzbuchhaltung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Debitoren- und Kreditorenübersichten sind zentrale Ergebnisse der Finanzbuchhaltung.' },
    ],
  },
  // 8. bce49c17 — Strategische Unternehmensführung Multi
  {
    id: 'bce49c17-0175-4578-a6cc-6827de23961b',
    fachbereich: 'BWL',
    musterlosung: 'Die strategische Planung ist ein langfristiger, sich wiederholender Prozess mit dem Ziel, Entwicklungen früh zu erkennen und das Unternehmen darauf auszurichten. Werte, Vision und Leitbild bilden den Orientierungspunkt. Das Tagesgeschäft ist Sache der operativen Führung, nicht der Strategie.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Strategische Planung ist langfristig und wird periodisch wiederholt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Wegen der unsicheren Zukunft müssen Entwicklungen systematisch eingeschätzt werden.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das Tagesgeschäft ist Teil der operativen Führung, nicht der Strategie.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Werte, Vision und Leitbild bilden den Orientierungskern der Strategie.' },
    ],
  },
  // 9. bd8af049 — Beharren
  {
    id: 'bd8af049-4d3d-4ba2-b251-5242d16182a8',
    fachbereich: 'BWL',
    musterlosung: 'Beharren bedeutet, bewusst am Bestehenden festzuhalten. Das kann kurzfristig Stabilität bieten, birgt langfristig aber das Risiko, wichtige Entwicklungen zu verpassen und den Anschluss zu verlieren. Es ist daher nur in stabilen Umfeldern eine sinnvolle, aber nie pauschal die beste Strategie.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Beharren heisst, an bestehenden Strategien und Prozessen festzuhalten.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Kurzfristig kann Beharren Stabilität und Planungssicherheit bieten.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Langfristiges Beharren ist riskant und nicht pauschal die beste Strategie.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Bei Wandel im Umfeld droht durch Beharren der Anschlussverlust.' },
    ],
  },
  // 10. bda06366 — Produkt-Markt-Matrix Ansoff
  {
    id: 'bda06366-5342-4b35-8896-c4d4bb02af05',
    fachbereich: 'BWL',
    musterlosung: 'Die Produkt-Markt-Matrix wurde von Harry Ansoff entwickelt. Sie stellt bestehende und neue Produkte bestehenden und neuen Märkten gegenüber und leitet daraus vier Wachstumsstrategien ab: Marktdurchdringung, Marktentwicklung, Produktentwicklung und Diversifikation.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Harry Ansoff hat die Produkt-Markt-Matrix entwickelt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Michael Porter steht für das 5-Kräfte-Modell und Wettbewerbsstrategien.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Peter Drucker ist ein Klassiker des Managements, aber nicht Autor dieser Matrix.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Philip Kotler prägt vor allem das Marketingdenken.' },
    ],
  },
  // 11. be2db62d — Eigenkapitalkonto
  {
    id: 'be2db62d-d06d-4f30-be7f-8fe524d044f6',
    fachbereich: 'BWL',
    musterlosung: 'Das Eigenkapital ist die rechnerische Schuld des Unternehmens gegenüber dem Geschäftseigentümer. Es zeigt, wie viel Kapital der Eigentümer dem Unternehmen zur Verfügung gestellt hat, einschliesslich nicht ausgeschütteter Gewinne.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Jahresgewinn wird in der Erfolgsrechnung ausgewiesen, nicht im Eigenkapitalkonto selbst.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Kurzfristige Schulden sind Fremdkapital (z.B. Kreditoren), nicht Eigenkapital.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Kassenbestand ist ein Aktivkonto und gehört nicht zum Eigenkapital.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Das Eigenkapital ist die rechnerische Schuld gegenüber dem Eigentümer.' },
    ],
  },
  // 12. bf09917b — Fähigkeitsanalyse Softwareunt
  {
    id: 'bf09917b-8873-4f25-be8f-35c77e390e36',
    fachbereich: 'BWL',
    musterlosung: 'Die Fähigkeitsanalyse zeigt eine klare Stärke (Know-how in F&E) und eine klare Schwäche (Marketing). Ein Erfolgspotenzial wird nur dann zum Wettbewerbsvorteil, wenn alle Funktionen der Wertschöpfungskette mitziehen. Die Schwäche im Marketing verhindert hier, dass das starke Produkt am Markt erfolgreich wird.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das Know-how ist eine deutliche Stärke, die in der Analyse klar erkennbar ist.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ohne Marketing werden auch gute Produkte am Markt nicht wahrgenommen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Das Know-how bleibt ungenutztes Potenzial, weil das Marketing die Verwertung bremst.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Entlassungen würden die Stärke vernichten; gefordert ist ein Ausbau des Marketings.' },
    ],
  },
  // 13. bf53c5b8 — GmbH Impfstoff
  {
    id: 'bf53c5b8-3164-457c-968e-b4913a9f93ca',
    fachbereich: 'BWL',
    musterlosung: 'Die GmbH erfüllt alle Anforderungen: beschränkte Haftung, geringes Mindestkapital von CHF 20\'000 und aktive Mitarbeit der Gesellschafterinnen. Die Einzelunternehmung scheidet bei drei Personen aus, die Kollektivgesellschaft haftet unbeschränkt und die AG verlangt CHF 100\'000 Mindestkapital.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die AG erfordert CHF 100\'000 Mindestkapital — zu viel für die Gründerinnen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Kollektivgesellschaft hat unbeschränkte, solidarische Haftung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Die GmbH bietet beschränkte Haftung, CHF 20\'000 Mindestkapital und aktive Mitarbeit.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Eine Einzelunternehmung ist nur für eine einzelne Person möglich, nicht für drei.' },
    ],
  },
  // 14. bfea9020 — Produktivität, Wirtschaftlichkeit, Rentabilität Multi
  {
    id: 'bfea9020-c824-4897-976a-67da2ce16349',
    fachbereich: 'BWL',
    musterlosung: 'Wirtschaftlichkeit (Ertrag/Aufwand) schafft die Basis für Rentabilität (Gewinn/Kapital). Produktivität ist ein Mengenverhältnis — erst durch Multiplikation mit Preisen wird daraus Wirtschaftlichkeit. Die drei Kennzahlen messen unterschiedliche Aspekte und sind nicht direkt vergleichbar.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wirtschaftlichkeit ist eine wichtige Voraussetzung für eine gute Rentabilität.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Ohne Preisinformationen kann Produktivität keine Aussage über Wirtschaftlichkeit machen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Rentabilität und Wirtschaftlichkeit haben unterschiedliche Bezugsgrössen und sind nicht direkt vergleichbar.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die drei Kennzahlen messen jeweils andere Aspekte der Unternehmensleistung.' },
    ],
  },
  // 15. c0938ef0 — Passivkonto Zunahme
  {
    id: 'c0938ef0-0327-4762-a1f9-34a1b00c5f6a',
    fachbereich: 'BWL',
    musterlosung: 'Bei Passivkonten stehen Zunahmen im Haben (rechts) und Abnahmen im Soll (links). Der Anfangsbestand steht ebenfalls im Haben. Passivkonten verhalten sich damit spiegelbildlich zu Aktivkonten.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Im Soll stehen Abnahmen, nicht Zunahmen des Passivkontos.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Jedes Konto hat Soll- und Habenseite — so auch das Passivkonto.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Pro Geschäftsfall wird nur eine Seite des Passivkontos bebucht.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Passivkonten nehmen im Haben (rechts) zu.' },
    ],
  },
  // 16. c1437120 — SWOT Schwäche+Chance
  {
    id: 'c1437120-25c2-4fc1-a537-ad9b15f7dd99',
    fachbereich: 'BWL',
    musterlosung: 'Bei der Kombination «Schwächen treffen auf Chancen» liegt die strategische Aufgabe darin, die Schwäche abzubauen oder in eine Stärke umzuwandeln, damit die Chance genutzt werden kann. Konkret: Produktionskosten senken, um vom Trend «Einkauf unterwegs» zu profitieren.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Marktrückzug verschenkt die erkannte Chance, statt sie zu nutzen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Schwäche und Chance heben sich nicht gegenseitig auf — Handeln ist erforderlich.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Schwäche abbauen oder in Stärke umwandeln, damit die Chance genutzt werden kann.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Chancen gezielt zu ignorieren, widerspricht dem Sinn der SWOT-Analyse.' },
    ],
  },
  // 17. c16dc20a — ökonomisches Prinzip Multi
  {
    id: 'c16dc20a-311a-40be-8098-9fd6c6e2c298',
    fachbereich: 'BWL',
    musterlosung: 'Das ökonomische Prinzip hat drei Varianten: Maximumprinzip (gegebener Input → maximaler Output), Minimumprinzip (vorgegebener Output → minimaler Input) und Optimumprinzip (Input und Output optimal abstimmen). Ein «Gewinnprinzip» ist keine klassische Variante des ökonomischen Prinzips.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Maximumprinzip — mit gegebenem Input den grösstmöglichen Output erzielen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Minimumprinzip — vorgegebenen Output mit minimalem Input erreichen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Optimumprinzip — Input und Output bestmöglich aufeinander abstimmen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Ein «Gewinnprinzip» gehört nicht zu den klassischen Varianten des ökonomischen Prinzips.' },
    ],
  },
  // 18. c2152b30 — Sättigungsgrad 92%
  {
    id: 'c2152b30-05bd-43b0-9536-bcc030d53c80',
    fachbereich: 'BWL',
    musterlosung: 'Bei einem Sättigungsgrad von 92 % ist der Markt nahezu ausgeschöpft. Neukunden zu gewinnen ist schwierig, Wachstum ist fast nur noch durch Verdrängung bestehender Anbieter möglich. Ein Markteintritt erfordert deshalb eine klare Differenzierung gegenüber der Konkurrenz.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: In einem gesättigten Markt führen Kapazitätsausbauten tendenziell zu Leerkosten.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Eintritt ist riskant, weil Wachstum nur über Verdrängung etablierter Anbieter möglich ist.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Hoher Sättigungsgrad bedeutet ausgeschöpftes Potenzial, nicht automatisch grossen eigenen Kundenstamm.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: In gesättigten Märkten ist der Preisdruck besonders hoch, freie Preissetzung nicht möglich.' },
    ],
  },
  // 19. c22a6336 — Kosmetik Segmentierung
  {
    id: 'c22a6336-ef18-4178-9c3a-efdbf94e3478',
    fachbereich: 'BWL',
    musterlosung: 'Die Zielgruppe wird über mehrere Kriterien beschrieben: Demografie (Alter, Beruf), Psychografie (Wert auf gepflegtes Äusseres) und Kundenverhalten (Einkauf in Parfümerieketten). In der Praxis werden Marktsegmente meist aus einer Kombination von Kriterien gebildet.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Nur Demografie würde Psychografie und Verhalten aussen vor lassen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Nur Kundenverhalten greift zu kurz — auch Alter und Werte werden genannt.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Geografie ist hier nicht explizit Kriterium.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Demografie, Psychografie und Kundenverhalten werden kombiniert verwendet.' },
    ],
  },
  // 20. c320c297 — Sättigungsphase Multi
  {
    id: 'c320c297-ed6a-4ad8-ab56-a569a1276ca0',
    fachbereich: 'BWL',
    musterlosung: 'In der Sättigungsphase ist der Markt ausgeschöpft, der Preiskampf intensiv, Umsatz und Gewinn gehen zurück. Oft werden Produktvarianten lanciert, um den Ausstieg hinauszuzögern. Investitionen in die Neukundengewinnung werden dagegen eher reduziert, weil das Potenzial dort kaum mehr wächst.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Markt ist gesättigt, der Preiskampf erreicht seinen Höhepunkt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Umsatzkurve flacht ab und der Gewinn geht zurück.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Produktvarianten sollen die Leistung verlängern und den Ausstieg verzögern.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Neukundengewinnung wird wegen fehlendem Potenzial eher zurückgefahren.' },
    ],
  },
  // 21. c4484b8b — BCG Entwickler
  {
    id: 'c4484b8b-fb86-4bfb-b59c-e5c3c22b4f08',
    fachbereich: 'BWL',
    musterlosung: 'Die BCG-Portfolio-Methode wurde von der Boston Consulting Group entwickelt, einer weltweit tätigen Managementberatung. Das Modell ordnet Geschäftsfelder in einer 2×2-Matrix aus Marktwachstum und relativem Marktanteil ein.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Boston Consulting Group ist die Entwicklerin des BCG-Portfolios.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Harvard Business School liefert viel BWL-Lehre, aber nicht das BCG-Portfolio.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die SNB ist die Schweizer Zentralbank und keine Unternehmensberatung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: McKinsey ist ebenfalls Beratung, hat aber das 7-S-Modell und die McKinsey-Matrix geprägt.' },
    ],
  },
  // 22. c9ffb669 — Holzlatten Maximumprinzip
  {
    id: 'c9ffb669-214a-4abb-88bc-6c1e1a88780c',
    fachbereich: 'BWL',
    musterlosung: 'Der Input (125 Holzlatten) ist fix vorgegeben, der Output (Anzahl Tischplatten) soll maximiert werden. Das entspricht dem Maximumprinzip, auch Ergiebigkeitsprinzip genannt.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Maximumprinzip — fixer Input, maximaler Output.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Minimumprinzip wäre fixer Output bei minimalem Input.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Optimumprinzip würde Input und Output gemeinsam variieren.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Sparsamkeitsprinzip ist ein Synonym für das Minimumprinzip, trifft hier nicht.' },
    ],
  },
  // 23. ca52d92c — Verbrauchsgut
  {
    id: 'ca52d92c-3c63-4692-b495-aa90cd47bdcc',
    fachbereich: 'BWL',
    musterlosung: 'Verbrauchsgüter werden durch den Gebrauch aufgezehrt, sie lassen sich nur einmal konsumieren. Lebensmittel sind ein typisches Beispiel. Fernseher, Bücher oder Kletterseile können dagegen wiederholt genutzt werden — das sind Gebrauchsgüter.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Lebensmittel werden mit dem Konsum verbraucht und sind Verbrauchsgüter.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ein Kletterseil wird mehrfach genutzt und ist ein Gebrauchsgut.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Ein Fernseher wird über Jahre genutzt — Gebrauchsgut.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Ein Buch lässt sich mehrfach lesen und gilt deshalb als Gebrauchsgut.' },
    ],
  },
  // 24. cb69a7c2 — Buchungssatz Struktur
  {
    id: 'cb69a7c2-dc1c-4470-bbee-0d5e1fdc3ada',
    fachbereich: 'BWL',
    musterlosung: 'Ein Buchungssatz folgt immer der Struktur «Soll an Haben»: Zuerst wird das Konto genannt, das im Soll gebucht wird, danach das Konto im Haben. Beispiel: Kasse an Eigenkapital 5\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: «Aufwand an Ertrag» trifft nicht auf alle Buchungssätze zu — viele Sätze berühren nur Bilanzkonten.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Reihenfolge ist umgekehrt — Soll steht immer zuerst.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Einzelne Buchungen können beide Seiten aus Aktiven, Passiven oder Erfolgskonten mischen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Die Grundstruktur ist immer «Soll an Haben».' },
    ],
  },
  // 25. cb9e2ced — Eigenkapital Bilanz
  {
    id: 'cb9e2ced-dc87-4e73-b9e9-442fd3495b09',
    fachbereich: 'BWL',
    musterlosung: 'Das Eigenkapital ist die Differenz zwischen Aktiven (Vermögen) und Fremdkapital (Schulden). Es zeigt, was dem Eigentümer rechnerisch zusteht, und ist damit die rechnerische Schuld des Unternehmens gegenüber dem Geschäftseigentümer.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Jahresgewinn fliesst ins Eigenkapital, ist aber nicht mit ihm identisch.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Eigenkapital ist eine rechnerische Grösse, nicht nur eingelegtes Bargeld.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Summe aller Schulden ist das Fremdkapital, nicht das Eigenkapital.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Eigenkapital = Aktiven − Fremdkapital, also rechnerische Schuld gegenüber dem Eigentümer.' },
    ],
  },
  // 26. cc6abfbb — Wareneinkauf 15000 auf Rechnung
  {
    id: 'cc6abfbb-725a-4a8c-aba8-ee42853d03e7',
    fachbereich: 'BWL',
    musterlosung: 'Der Wareneinkauf (Aufwandkonto) nimmt zu und steht im Soll. Die Verbindlichkeit gegenüber dem Lieferanten (Kreditoren, Passivkonto) nimmt zu und steht im Haben. Der korrekte Buchungssatz lautet: Wareneinkauf an Kreditoren 15\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wareneinkauf (Aufwand) an Kreditoren (Passiv) — Aufwand steigt, Schuld steigt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Zahlung erfolgt nicht per Bank, sondern auf Rechnung — also über Kreditoren.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Umgekehrte Reihenfolge — der Aufwand steht immer im Soll, nicht im Haben.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Beim Ruhenden Inventar-System bucht man auf Wareneinkauf, nicht auf Warenvorrat.' },
    ],
  },
  // 27. cc88ed82 — Eigenlohn 6000
  {
    id: 'cc88ed82-9072-4bb0-9024-23fae060c37a',
    fachbereich: 'BWL',
    musterlosung: 'Der Eigenlohn ist Aufwand des Unternehmens und steigt im Soll. Das Privatkonto (Passiv) wird im Haben gutgeschrieben, weil der Eigentümer etwas zugute hat. Der Buchungssatz lautet: Lohnaufwand an Privat 6\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ohne Zahlung ist die Bank nicht betroffen; Eigenkapital wird nicht direkt bebucht.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Eigenkapital-Privat-Buchung trifft die Situation Eigenlohn nicht korrekt ab.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Bei einer Auszahlung wäre diese Richtung denkbar, aber nicht bei einer reinen Gutschrift.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Lohnaufwand (Soll) an Privat (Haben) — Aufwand steigt, Privatkonto wird gutgeschrieben.' },
    ],
  },
  // 28. cd7e8b32 — Konjunktur ökonomisch
  {
    id: 'cd7e8b32-5b89-4a0b-b197-f0463868f326',
    fachbereich: 'BWL',
    musterlosung: 'Konjunktur, Inflationsrate und Wechselkurse sind gesamtwirtschaftliche Rahmenbedingungen, die das Unternehmen über Preise, Nachfrage und Finanzierungsbedingungen direkt betreffen. Sie gehören zur ökonomischen Umweltsphäre.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Ökonomische Umweltsphäre — Konjunktur, Inflation und Wechselkurse.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die rechtliche Sphäre umfasst Gesetze und Regulierungen, nicht Wirtschaftsindikatoren.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die soziale Sphäre betrifft Werte und demografische Entwicklung, nicht Wechselkurse.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die technologische Sphäre beschreibt Innovationen und Produktionstechniken.' },
    ],
  },
  // 29. cde5008b — höchster Medianlohn
  {
    id: 'cde5008b-82db-4957-a39b-fce1d280833e',
    fachbereich: 'BWL',
    musterlosung: 'Gemäss der Schweizerischen Lohnstrukturerhebung (BFS) hat das Finanz- und Versicherungsgewerbe mit einem Medianlohn von rund CHF 9\'630 pro Monat den höchsten Bruttolohn. Es folgen IT und Kommunikation sowie Erziehung und Unterricht.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das Gesundheits- und Sozialwesen liegt unter dem Durchschnitt der Spitzenbranchen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Finanz- und Versicherungsgewerbe führt mit rund CHF 9\'630 Medianlohn.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: IT und Kommunikation liegt mit rund CHF 8\'724 knapp dahinter.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Erziehung und Unterricht folgt mit rund CHF 8\'494 an dritter Stelle.' },
    ],
  },
  // 30. cec4efaa — Transitorische Aktive Multi
  {
    id: 'cec4efaa-5b7e-449c-b8db-ed1b3897b4fd',
    fachbereich: 'BWL',
    musterlosung: 'Eine transitorische Aktive (TA) entsteht bei vorausbezahltem Aufwand oder noch nicht erhaltenem Ertrag. Vorauszahlungen für Versicherungen oder noch ausstehende Zinsgutschriften sind typische Beispiele. Noch nicht bezahlte Löhne und voraus erhaltene Mieten sind dagegen transitorische Passive.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Vorausbezahlte Versicherung — ein halbes Jahr ist periodenfremd → TA.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Noch nicht bezahlter Lohn ist ein aufgelaufener Aufwand → TP.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Noch nicht erhaltene Zinsgutschrift ist ein aufgelaufener Ertrag → TA.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Vorausbezahlte Miete des Folgejahres ist ein vorauserhaltener Ertrag → TP.' },
    ],
  },
  // 31. cf3b7e20 — GoB Multi
  {
    id: 'cf3b7e20-2742-47b8-8739-34b43165743f',
    fachbereich: 'BWL',
    musterlosung: 'Zu den Grundsätzen ordnungsmässiger Buchführung gehören Vollständigkeit, Vorsichtsprinzip und Stetigkeit. Ein «Gewinnmaximierungsprinzip» ist ein betriebswirtschaftliches Ziel, kein Buchführungsgrundsatz.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Vollständigkeit und wahrheitsgetreue Erfassung sind zentrale GoB.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Gewinnmaximierung ist kein Buchführungsgrundsatz, sondern ein strategisches Ziel.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Das Vorsichtsprinzip verlangt vorsichtige Bewertungen, insbesondere bei Unsicherheit.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Stetigkeit fordert, einmal gewählte Methoden über Jahre beizubehalten.' },
    ],
  },
  // 32. d00a4b00 — Mitarbeitende Erwartungen
  {
    id: 'd00a4b00-d4d8-4e5d-b8a3-35be924e9195',
    fachbereich: 'BWL',
    musterlosung: 'Mitarbeitende erwarten vor allem fairen Lohn, gute Arbeitsbedingungen, Weiterbildungsmöglichkeiten, Mitwirkung und Arbeitsplatzsicherheit. Dividenden betreffen Aktionäre, Sponsoring die Gesellschaft und hohe Preise die Lieferanten.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Wertsteigerung und Dividende sind typische Erwartungen der Eigenkapitalgeber.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Sponsoring erwarten gesellschaftliche Akteure wie Vereine, nicht Mitarbeitende.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Langfristige Abnahmebeziehungen und hohe Preise wünschen Lieferanten.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Fairer Lohn, gute Arbeitsbedingungen und Weiterbildung sind Kernerwartungen der Mitarbeitenden.' },
    ],
  },
  // 33. d0c1b090 — SMART Multi
  {
    id: 'd0c1b090-15cd-461c-b258-883446222edb',
    fachbereich: 'BWL',
    musterlosung: 'SMART-Ziele sind spezifisch, messbar, erreichbar, relevant und terminiert. Die beiden Umsatz- beziehungsweise Kundenzufriedenheitsziele erfüllen diese Anforderungen. Die Aussagen «besser werden» und «irgendwann mehr Gewinn» sind weder spezifisch noch terminiert.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Spezifisch (Umsatz), messbar (+10%) und terminiert (Ende 2026).' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: «Besser werden» ist weder spezifisch noch messbar oder terminiert.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Messbar (7.5 → 8.5), terminiert (Q2 2026) und spezifisch (Kundenzufriedenheit).' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: «Irgendwann mehr Gewinn» hat weder Kennzahl noch Frist.' },
    ],
  },
  // 34. d13cc4cc — Preise senken Zielkonflikte Multi
  {
    id: 'd13cc4cc-5c22-43d5-89ec-d3b7ba50de6a',
    fachbereich: 'BWL',
    musterlosung: 'Preissenkungen drücken die Marge und damit den ausschüttbaren Gewinn, was Konflikte mit Eigenkapitalgebern schafft. Tiefere Preise können auch den Einkauf unter Druck setzen, wenn Lieferanten weiter hohe Preise fordern. Mit der Konkurrenz entsteht eher Verdrängung, Harmonie ist nicht zu erwarten.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Tiefere Preise verringern Margen und damit Dividendenerwartungen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Hohe Einkaufspreise werden bei tieferen Verkaufspreisen zum Problem.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Steuerfolgen sind indirekt und kein unmittelbarer Zielkonflikt aus der Preispolitik.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Preissenkungen erhöhen Wettbewerbsdruck, Harmonie mit der Konkurrenz ist unwahrscheinlich.' },
    ],
  },
  // 35. d158e695 — Stetigkeit verletzt
  {
    id: 'd158e695-bade-4957-9a38-1302b57a2716',
    fachbereich: 'BWL',
    musterlosung: 'Der Grundsatz der Stetigkeit verlangt, einmal gewählte Bewertungs- und Darstellungsmethoden über mehrere Jahre beizubehalten. Ein jährlicher Methodenwechsel zur Gewinnoptimierung verstösst gegen diesen Grundsatz.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Stetigkeit (Kontinuität) verbietet beliebige Methodenwechsel zwischen den Jahren.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das Belegprinzip betrifft die Dokumentation einzelner Geschäftsfälle.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Wesentlichkeit regelt, welche Posten detailliert ausgewiesen werden müssen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Klarheit fordert verständliche Darstellung, nicht Methoden-Kontinuität.' },
    ],
  },
  // 36. d21ccd32 — Wirtschaftlichkeit aus Produktivität
  {
    id: 'd21ccd32-01f7-4395-ad9b-50b59cd0c2ff',
    fachbereich: 'BWL',
    musterlosung: 'Die Produktivität ist ein reines Mengenverhältnis. Multipliziert man Outputmenge mit Verkaufspreis und Inputmenge mit Einkaufspreis, ergibt sich das Verhältnis Ertrag / Aufwand — die Wirtschaftlichkeit. So werden verschiedene Produktivitäten monetär vergleichbar.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Gewinn / Gesamtkapital definiert die Rentabilität, nicht die Wirtschaftlichkeit.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Steuersatz ist keine Grösse in der Wirtschaftlichkeitsformel.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Umsatz pro Mitarbeitenden ist eine Arbeitsproduktivitäts-Kennzahl.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: (Outputmenge × Verkaufspreis) / (Inputmenge × Einkaufspreis) = Ertrag/Aufwand.' },
    ],
  },
  // 37. d2a55367 — Erfolgs- vs Bilanzkonten
  {
    id: 'd2a55367-cdb7-49e8-8ed9-1034b191dd8b',
    fachbereich: 'BWL',
    musterlosung: 'Bilanzkonten sind Bestandeskonten mit Anfangsbestand aus dem Vorjahr. Erfolgskonten (Aufwand/Ertrag) sind Stromgrössen und beginnen jedes Geschäftsjahr bei null. Sie werden am Jahresende über die Erfolgsrechnung abgeschlossen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Erfolgskonten starten jedes Jahr bei null — keine Übertragung des Vorjahresbestandes.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das ist die Eigenschaft der Bilanzkonten, nicht der Erfolgskonten.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Erfolgskonten sind fester Bestandteil der doppelten Buchhaltung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Erfolgskonten werden am Jahresende über die Erfolgsrechnung abgeschlossen.' },
    ],
  },
  // 38. d2fe12d3 — Fahrzeug 30000 T-Konto
  {
    id: 'd2fe12d3-5abf-4757-bbd6-6b4205ef7913',
    fachbereich: 'BWL',
    musterlosung: 'Beide Konten sind Aktivkonten. Fahrzeuge nimmt zu und wird im Soll bebucht. Die Bank nimmt ab und wird im Haben bebucht. Es handelt sich um einen Aktivtausch — die Bilanzsumme bleibt gleich.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Fahrzeuge Soll (Zunahme), Bank Haben (Abnahme) — klassischer Aktivtausch.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Seiten sind vertauscht — Fahrzeuge wird nicht abgebaut.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Zunahme eines Aktivkontos steht im Soll, nicht im Haben.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Weder Fahrzeuge noch Bank werden korrekt beschrieben.' },
    ],
  },
  // 39. d39928d4 — Entscheidungsmodell
  {
    id: 'd39928d4-c399-49f2-ad59-62c1be491922',
    fachbereich: 'BWL',
    musterlosung: 'Entscheidungsmodelle werden aufgestellt, um optimale Handlungsmöglichkeiten zu bestimmen. Sie enthalten Aussagen, die in die Zukunft gerichtet sind, und helfen bei der Auswahl zwischen Alternativen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Beschreibungsmodelle bilden nur bestehende Realität ab, ohne Handlungsempfehlung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Entscheidungsmodelle zeigen optimale Handlungsmöglichkeiten für die Zukunft.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Erklärungsmodelle zeigen Ursache-Wirkung, geben aber keine Handlungsempfehlung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Prognosemodelle sagen Entwicklungen voraus, nennen aber keine optimalen Handlungen.' },
    ],
  },
  // 40. d3d28fa3 — Poor Dogs
  {
    id: 'd3d28fa3-5a1b-4289-b4d6-0a1324b844a0',
    fachbereich: 'BWL',
    musterlosung: 'Poor Dogs haben einen kleinen Marktanteil in einem langsam wachsenden oder stagnierenden Markt. Die Normstrategie ist der Ausstieg: Abbau der Leistungen und Umlenken der freien Ressourcen in besser positionierte Produkte.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: «Halten und ausbauen» passt zu Cash Cows oder Stars, nicht zu Poor Dogs.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Ausstieg und Mittelumschichtung zu besser positionierten Produkten.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Selbst «keine Investitionen» reicht nicht — Ressourcen sollen aktiv umgeleitet werden.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Intensive Marktbearbeitung ist Normstrategie für Question Marks.' },
    ],
  },
  // 41. d43d2768 — Digitalisierung Schule
  {
    id: 'd43d2768-b266-4f25-96f6-658d3015177f',
    fachbereich: 'BWL',
    musterlosung: 'Der reine Umstieg auf die Online-Notenverwaltung wäre eine digitale Vernetzung bestehender Prozesse. Durch den zusätzlichen Verkauf von Prüfungen an Externe via Webshop entsteht jedoch ein neues Geschäftsfeld. Das entspricht der Stufe «digitale Transformation».',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Digitalisierung betrifft alle Branchen, auch Schulen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Hier entsteht ein neues Geschäftsmodell, nicht nur ein digitales Hilfsmittel.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Vernetzung wird durch den Webshop um ein neues Geschäftsmodell ergänzt.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Digitale Transformation — neues Geschäftsfeld durch Prüfungsverkauf an Externe.' },
    ],
  },
  // 42. d71c47a5 — Honorarertrag
  {
    id: 'd71c47a5-7513-49f8-a417-bb1ab430ec6f',
    fachbereich: 'BWL',
    musterlosung: 'Honorarertrag ist ein Ertragskonto. Ertragskonten verhalten sich wie Passivkonten: Zunahmen stehen im Haben, Abnahmen im Soll. Damit wird die Zunahme im Haben gebucht.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Nicht alle Zunahmen stehen im Soll — nur Aktiv- und Aufwandkonten nehmen dort zu.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Honorarertrag ist kein Aktiv-, sondern ein Ertragskonto.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Einnahmen im Sinne von Ertragskonten nehmen im Haben zu.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Ertragskonten nehmen im Haben (rechts) zu.' },
    ],
  },
  // 43. d740d981 — erfolgsunwirksam
  {
    id: 'd740d981-189a-4453-b6ed-e419c7e320b3',
    fachbereich: 'BWL',
    musterlosung: 'Ein Geschäftsfall ist erfolgsunwirksam, wenn er ausschliesslich Bilanzkonten berührt. Bei der Banküberweisung eines Kunden nehmen Bank zu und Debitoren ab — beides sind Aktivkonten. Kein Erfolgskonto wird bebucht, der Gewinn bleibt unverändert.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Bank an Debitoren — Aktivtausch ohne Einfluss auf Aufwand oder Ertrag.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Zinsgutschrift ist Finanzertrag und damit erfolgswirksam.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Lohnzahlungen berühren das Erfolgskonto Lohnaufwand.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Mietzahlungen berühren das Erfolgskonto Mietaufwand.' },
    ],
  },
  // 44. d80a9ff1 — Maschinen Niederstwert
  {
    id: 'd80a9ff1-f8d2-43f3-b246-d072918748bb',
    fachbereich: 'BWL',
    musterlosung: 'Gemäss dem Niederstwertprinzip wird der tiefere von Anschaffungs- und Marktwert bilanziert. Da der Marktwert von CHF 65\'000 unter dem Anschaffungswert von CHF 80\'000 liegt, erscheinen die Maschinen mit CHF 65\'000 in der Bilanz.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein Teuerungszuschlag ist in der Schweizer Bilanzierung nicht vorgesehen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ein Durchschnittswert entspricht nicht dem Niederstwertprinzip.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Anschaffungswert darf nur angesetzt werden, wenn er nicht über dem Marktwert liegt.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: CHF 65\'000 — der tiefere Wert wird bilanziert (Niederstwertprinzip).' },
    ],
  },
  // 45. d95657c9 — Bedürfnis
  {
    id: 'd95657c9-dc59-472e-861f-2adb74065568',
    fachbereich: 'BWL',
    musterlosung: 'Ein Bedürfnis ist der Wunsch, einen empfundenen Mangel zu beseitigen oder zu mildern. Bedürfnisse sind der Ausgangspunkt wirtschaftlicher Aktivitäten — aus ihnen entsteht Nachfrage, wenn Kaufkraft und Kaufabsicht hinzukommen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Eine Dienstleistung ist ein Gut zur Bedürfnisbefriedigung, nicht das Bedürfnis selbst.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ein Gut ist Mittel der Bedürfnisbefriedigung, nicht das Bedürfnis selbst.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Verfügbares Geld ist Kaufkraft, aber kein Bedürfnis.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Ein Bedürfnis ist der Wunsch, einen empfundenen Mangel zu beseitigen oder zu mildern.' },
    ],
  },
  // 46. d9ce1c63 — neutraler Erfolg
  {
    id: 'd9ce1c63-c821-41f4-b64b-2613e5a46950',
    fachbereich: 'BWL',
    musterlosung: 'Der neutrale Erfolg umfasst Aufwände und Erträge, die nicht zum eigentlichen Geschäftszweck gehören — also betriebsfremde, ausserordentliche oder periodenfremde Vorgänge. Beispiele sind Gewinne aus Liegenschaftsverkäufen oder der Steueraufwand.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Erfolg aus dem Kerngeschäft ist der Betriebserfolg, nicht der neutrale Erfolg.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Erträge und Aufwände, die betriebsfremd, ausserordentlich oder periodenfremd sind.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Steueraufwand ist ein Beispiel, aber nicht die Definition.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Ein Erfolg ohne Gewinn oder Verlust wäre ein Nullergebnis — keine Kategorie der ER.' },
    ],
  },
  // 47. d9fd6261 — CSR Multi
  {
    id: 'd9fd6261-a333-43d1-a1f8-da8a444c3a21',
    fachbereich: 'BWL',
    musterlosung: 'Corporate Social Responsibility umfasst faire Arbeitsbedingungen, Einhaltung der Menschenrechte, Umweltschutz, fairen Wettbewerb, Transparenz und Berücksichtigung von Konsumenteninteressen. Reine Profitmaximierung ohne Rücksicht auf diese Aspekte widerspricht dem CSR-Gedanken.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Faire Arbeitsbedingungen und Menschenrechte sind Kernelemente von CSR.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Kurssteigerung um jeden Preis widerspricht der CSR-Idee.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Umweltschutz und fairer Wettbewerb gehören zu CSR.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Transparenz und Konsumenteninteressen sind CSR-Bestandteile.' },
    ],
  },
  // 48. dbe47d90 — Brent Spar
  {
    id: 'dbe47d90-e571-44f5-a3a7-9767e2316389',
    fachbereich: 'BWL',
    musterlosung: 'Die Brent Spar war ein schwimmender Speichertank (Öl-Lagerplattform) von Shell in der Nordsee, der 1975/76 installiert wurde. 1995 führte die geplante Versenkung zu weltweiten Protesten und wurde zum Lehrstück für Anspruchsgruppen-Management.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Brent Spar war keine fahrende Einheit, sondern eine feste Lagerplattform.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Greenpeace protestierte gegen die Versenkung, betrieb die Plattform aber nicht.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Schwimmender Speichertank (Ölplattform) von Shell in der Nordsee.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Brent Spar war keine Raffinerie, sondern eine Offshore-Lagerplattform.' },
    ],
  },
  // 49. dceb36b5 — Beharren riskant
  {
    id: 'dceb36b5-5a6d-45e7-bc26-d7a78286a18f',
    fachbereich: 'BWL',
    musterlosung: 'In einem sich schnell wandelnden technologischen Umfeld ist Beharren am riskantesten. Das Unternehmen verpasst wichtige Entwicklungen und verliert den Anschluss — Kodak und die Digitalfotografie sind ein klassisches Beispiel. Aktion und Reaktion erhalten Handlungsfähigkeit, Beharren nicht.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Aktion kostet Ressourcen, sichert aber in dynamischen Umfeldern die Zukunft.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Reaktion kommt oft spät, ist aber weniger riskant als reines Stillstehen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Risiken unterscheiden sich in dynamischen Umfeldern klar.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Beharren birgt in dynamischen Umfeldern das höchste Risiko, den Anschluss zu verlieren.' },
    ],
  },
  // 50. e1236dd4 — SMART M
  {
    id: 'e1236dd4-06a4-4e7c-af3f-e981f15f612b',
    fachbereich: 'BWL',
    musterlosung: 'Das «M» in SMART steht für «measurable» — messbar. Ziele müssen so formuliert sein, dass ihre Erreichung mit Kennzahlen, Mengen oder Zeitangaben überprüfbar ist.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Das «M» steht für messbar (measurable).' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: «Mehrheitsfähig» ist kein Bestandteil der SMART-Systematik.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Motivation ist wichtig, aber nicht das «M» in SMART.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Minimalität ist kein SMART-Kriterium.' },
    ],
  },
];

// Validation
const seenIds = new Set();
for (const u of UPDATES) {
  if (!u.id || !u.fachbereich || !u.musterlosung || !Array.isArray(u.teilerklaerungen)) {
    throw new Error(`Invalid update: ${JSON.stringify(u)}`);
  }
  if (seenIds.has(u.id)) throw new Error(`Duplicate id: ${u.id}`);
  seenIds.add(u.id);
  for (const t of u.teilerklaerungen) {
    if (!t.feld || !t.id || !t.text) {
      throw new Error(`Invalid teilerklaerung in ${u.id}: ${JSON.stringify(t)}`);
    }
  }
}

// Append + state
const state = JSON.parse(fs.readFileSync('state.json', 'utf8'));
const now = new Date().toISOString();

let appended = 0;
for (const u of UPDATES) {
  fs.appendFileSync('fragen-updates.jsonl', JSON.stringify(u) + '\n');
  state.fragen[u.id] = { status: 'done', zeitpunkt: now, teile: u.teilerklaerungen.length };
  appended++;
}

state.verarbeitet = (state.verarbeitet || 0) + appended;
state.letzteSession = 33;
state.letzterLauf = now;

fs.writeFileSync('state.json', JSON.stringify(state, null, 2));

console.log(`Session 33 done. Appended ${appended} updates. Total verarbeitet: ${state.verarbeitet}`);
