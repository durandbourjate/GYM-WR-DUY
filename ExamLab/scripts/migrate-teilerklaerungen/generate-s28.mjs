#!/usr/bin/env node
/**
 * Session 28: 50 Fragen, alles BWL.
 * 45 lueckentext (Teilerklärungen pro luecken, ID=luecken[].id)
 *  5 mc (Teilerklärungen pro optionen, ID=optionen[].id)
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  // ===== BWL/lueckentext (45) =====
  {
    id: '2e21711b-0cc5-4d0f-9b24-091f363c9c53',
    fachbereich: 'BWL',
    musterlosung: `Am 1. Juli wurden 6'000 CHF Miete für 12 Monate kassiert. Die Hälfte (6 Monate = 3'000) gehört ins neue Jahr und muss per 31.12. abgegrenzt werden. Der Immobilienertrag wird im Soll reduziert, die Transitorische Passive (TP) nimmt im Haben zu. Buchungssatz: Immobilienertrag an TP 3'000.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Immobilienertrag». Der zu viel verbuchte Mietertrag wird im Soll reduziert.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «TP» (Transitorische Passive). Passivkonto — Zunahme im Haben für den abgegrenzten Betrag.` },
    ],
  },
  {
    id: '34fd580c-afc6-4e8f-a4a9-2b064bea1444',
    fachbereich: 'BWL',
    musterlosung: `Aufwandkonten werden über die Erfolgsrechnung abgeschlossen. Der Saldo des Aufwandkontos steht auf der Habenseite und wird auf die Sollseite der ER übertragen. Buchungssatz: ER an Aufwandkonto. So fliesst der Aufwand in die Erfolgsermittlung ein und reduziert den Gewinn.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «ER» (Erfolgsrechnung). Sammelkonto für Aufwand und Ertrag — steht beim Abschluss im Soll.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Aufwandkonto». Wird im Haben ausgeglichen, damit der Saldo null ist.` },
    ],
  },
  {
    id: '3c1b57dd-64fd-401d-b7da-8edc29ddd18e',
    fachbereich: 'BWL',
    musterlosung: `Unternehmen können ihre Umwelt nicht steuern, sie müssen die Entwicklungstrends jedoch laufend beobachten. Nur so können sie rechtzeitig auf Chancen und Gefahren reagieren oder proaktiv handeln. Die Beobachtung der Umweltsphären ist Teil der strategischen Analyse.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «beobachtet» oder «untersucht». Laufendes Monitoring der Umweltsphären ist Pflicht jeder Unternehmensführung.` },
    ],
  },
  {
    id: '3cc7a1d1-1e62-4c0a-a808-aee9154067a3',
    fachbereich: 'BWL',
    musterlosung: `Ertragskonten werden am Jahresende über die Erfolgsrechnung abgeschlossen. Der Saldo steht auf der Sollseite des Ertragskontos und wird auf die Habenseite der ER übertragen. Buchungssatz: Ertragskonto an ER. So erhöht der Ertrag den Gewinn in der Erfolgsrechnung.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Ertragskonto». Wird im Soll ausgeglichen, damit der Saldo null ist.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «ER» (Erfolgsrechnung). Nimmt den Ertrag auf der Habenseite auf.` },
    ],
  },
  {
    id: '3e1156c2-0a1f-47e3-b856-4d88344ceb51',
    fachbereich: 'BWL',
    musterlosung: `Passivkonten werden am Jahresende über die Schlussbilanz abgeschlossen. Der Saldo steht auf der Sollseite des Passivkontos und wird auf die Habenseite der Schlussbilanz übertragen. Buchungssatz: Passivkonto an SB. Damit erscheint der Endbestand als Finanzierung in der Bilanz.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Passivkonto». Wird im Soll ausgeglichen, damit der Saldo null wird.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «SB» (Schlussbilanz). Nimmt den Passivsaldo auf der Habenseite auf.` },
    ],
  },
  {
    id: '3fb76ea6-321e-4fde-9db2-0cd17c174b63',
    fachbereich: 'BWL',
    musterlosung: `Fahrzeuge sind ein aktives Konto, weil sie zum Vermögen (Anlagevermögen) gehören. Aktivkonten haben Zunahmen im Soll, also auf der linken Seite. Beim Kauf eines Lieferwagens wird deshalb das Fahrzeugkonto im Soll belastet.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «links». Aktivkonten verbuchen Zunahmen auf der linken Seite (Soll).` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «aktives Konto». Fahrzeuge sind Anlagevermögen und damit Teil der Aktiven.` },
    ],
  },
  {
    id: '43ceaa63-6b71-49f1-9aab-dd0ea13f09ad',
    fachbereich: 'BWL',
    musterlosung: `Das Unternehmen teilt den Gesamtmarkt nach Kriterien (Geografie, Demografie, Psychografie, Verhalten) in Marktsegmente auf. Aus diesen Segmenten wählt es dann gezielt seine Zielgruppen aus. An den Zielgruppen richtet sich die Marketingstrategie aus.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Zielgruppen». Jene Marktsegmente, die das Unternehmen aktiv bearbeiten will.` },
    ],
  },
  {
    id: '4edc240c-973b-4005-92e3-59dd63b36894',
    fachbereich: 'BWL',
    musterlosung: `Kreditoren sind Verbindlichkeiten gegenüber Lieferanten und damit ein passives Konto. Passivkonten verbuchen Zunahmen im Haben, also auf der rechten Seite. Eine neue Lieferantenrechnung erhöht die Kreditoren — gebucht wird die Zunahme deshalb rechts.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «rechts». Passivkonten verbuchen Zunahmen auf der Habenseite.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «passives Konto». Kreditoren sind Fremdkapital und stehen auf der rechten Bilanzseite.` },
    ],
  },
  {
    id: '4f4e422d-9ec6-471c-b9cb-baed86fde1de',
    fachbereich: 'BWL',
    musterlosung: `Der Kunde bezahlt sofort, deshalb nimmt das Bankkonto (Aktivkonto) im Soll zu. Der Dienstleistungsertrag (Honorarertrag) als Ertragskonto nimmt im Haben zu. Buchungssatz: Bankkonto an Honorarertrag 9'500. Der Ertrag fliesst in die Erfolgsrechnung ein.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Bankkonto». Aktivkonto — Zahlungseingang wird im Soll gebucht.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Honorarertrag» oder «Ertrag». Ertragskonto — Zunahme steht im Haben.` },
    ],
  },
  {
    id: '517ea584-14bf-4ed4-a923-665ac56b17a4',
    fachbereich: 'BWL',
    musterlosung: `Die Bilanz ist zweiseitig aufgebaut. Links stehen die Aktiven (Vermögenswerte: Kasse, Bank, Debitoren, Maschinen), rechts die Passiven (Finanzierung: Fremdkapital wie Kreditoren, Eigenkapital). Die Bilanzsumme beider Seiten ist immer gleich gross.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Aktiva» oder «Aktivseite». Linke Seite der Bilanz — zeigt die Mittelverwendung.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Passiva» oder «Passivseite». Rechte Seite — zeigt die Mittelherkunft.` },
    ],
  },
  {
    id: '51c8eb40-4188-4bef-8a37-9092bf10fa68',
    fachbereich: 'BWL',
    musterlosung: `Der Break-even-Punkt (Gewinnschwelle) ist der Punkt, an dem der Umsatz die gesamten Kosten exakt deckt. Bis dahin macht das Unternehmen Verlust, ab dieser Schwelle beginnt es Gewinn zu erzielen. Der Break-even ist ein zentraler Kontrollpunkt in der Produktlebenszyklus- und Kostenanalyse.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Break-even» / «Gewinnschwelle». Punkt, an dem Umsatz die Gesamtkosten deckt.` },
    ],
  },
  {
    id: '55d638d6-0a42-4e01-80f7-f2c7572329a6',
    fachbereich: 'BWL',
    musterlosung: `Aufwandkonten verhalten sich wie Aktivkonten: Zunahmen werden auf der linken Seite (Soll) gebucht. Am Jahresende steht der Saldo auf der rechten Seite (Haben) und wird gegen die Erfolgsrechnung ausgeglichen. Damit fliesst der Aufwand in die Erfolgsermittlung.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «linken». Aufwandkonten verbuchen Zunahmen analog zu Aktivkonten im Soll.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «rechten». Saldo und Jahresabschluss werden im Haben ausgewiesen.` },
    ],
  },
  {
    id: '56170374-49f4-49ea-b44d-7a0c395b7d23',
    fachbereich: 'BWL',
    musterlosung: `SMART ist eine Systematik zur präzisen Zielformulierung. Die fünf Buchstaben stehen für Specific (spezifisch), Measurable (messbar), Achievable (erreichbar), Relevant (sachbezogen) und Time-bound (terminiert). Nur wer seine Ziele SMART formuliert, kann deren Erreichung später überprüfen.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Spezifisch». Specific — das Ziel ist konkret und eindeutig formuliert.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Erreichbar». Achievable — das Ziel ist mit den vorhandenen Mitteln machbar.` },
      { feld: 'luecken', id: 'luecke-2', text: `Lücke 2 = «Terminiert». Time-bound — das Ziel hat einen klaren Endtermin.` },
    ],
  },
  {
    id: '5aa14614-5e2c-4775-a665-1821d3839a6a',
    fachbereich: 'BWL',
    musterlosung: `SWOT steht für Strengths (Stärken), Weaknesses (Schwächen), Opportunities (Chancen) und Threats (Gefahren). Stärken und Schwächen betreffen die interne Sicht auf das Unternehmen, Chancen und Gefahren die externe Umwelt. Die SWOT-Analyse verbindet beide Perspektiven und ist Grundlage für die Strategieentwicklung.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Stärken». Strengths — interne Fähigkeiten, die das Unternehmen vom Wettbewerb abheben.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Schwächen». Weaknesses — interne Defizite, die das Unternehmen benachteiligen.` },
      { feld: 'luecken', id: 'luecke-2', text: `Lücke 2 = «Chancen». Opportunities — externe Entwicklungen, die genutzt werden können.` },
      { feld: 'luecken', id: 'luecke-3', text: `Lücke 3 = «Gefahren» oder «Risiken». Threats — externe Bedrohungen, denen das Unternehmen ausgesetzt ist.` },
    ],
  },
  {
    id: '5b8e11b4-afd9-4e98-bf8c-e1c55d0a63c6',
    fachbereich: 'BWL',
    musterlosung: `Produktivität misst das Verhältnis zwischen produzierter Menge (Output, Ausbringungsmenge) und eingesetzten Produktionsfaktoren (Input, Einsatzmenge). Formel: Produktivität = Ausbringungsmenge / Einsatzmenge. Die Grössen werden in Mengeneinheiten gemessen — nicht in Franken. Damit unterscheidet sich die Produktivität von der Wirtschaftlichkeit.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Ausbringungsmenge» oder «Ertrag». Output — produzierte Mengeneinheiten im Zähler.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Einsatzmenge» oder «Aufwand». Input — eingesetzte Produktionsfaktoren im Nenner.` },
    ],
  },
  {
    id: '60ce972d-2deb-46f7-9af7-3e9be32736f2',
    fachbereich: 'BWL',
    musterlosung: `Das Marketingkonzept bündelt alle Massnahmen zur Absatzgestaltung. Es wird in Abstimmung mit der Unternehmensstrategie entwickelt und definiert Zielgruppen, Produktpolitik, Preispolitik, Distribution und Kommunikation. Ziel ist, Produkte und Dienstleistungen bekannt zu machen und den Absatz optimal zu gestalten.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Marketing-Konzept». Umfassende Absatzplanung mit Zielgruppen und Marketing-Mix.` },
    ],
  },
  {
    id: '68b42c3b-23d8-42d5-93a3-259a7d8bce3b',
    fachbereich: 'BWL',
    musterlosung: `Aufwandkonten verhalten sich wie Aktivkonten: Zunahmen stehen im Soll (links). Ertragskonten verhalten sich wie Passivkonten: Zunahmen stehen im Haben (rechts). Diese Regel hilft, die Buchungslogik der Erfolgskonten abzuleiten, ohne sie einzeln auswendig lernen zu müssen.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «linken». Aufwandkonten nehmen im Soll zu — wie Aktivkonten.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «rechten». Ertragskonten nehmen im Haben zu — wie Passivkonten.` },
    ],
  },
  {
    id: '6b029e32-0e65-49c4-8907-fc92b484840b',
    fachbereich: 'BWL',
    musterlosung: `Aktivkonten folgen der Bilanzlogik: der Anfangsbestand und Zunahmen stehen links (Sollseite), Abnahmen und der Saldo zum Jahresende stehen rechts (Habenseite). Beim Abschluss wird der Saldo auf die Habenseite der Schlussbilanz übertragen.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «linken» / «Sollseite». Zunahmen von Aktivkonten werden im Soll gebucht.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «rechten» / «Habenseite». Abnahmen und Saldo stehen im Haben.` },
    ],
  },
  {
    id: '86b1b406-2166-492e-a0b7-1b0badeded4f',
    fachbereich: 'BWL',
    musterlosung: `Der Lieferwagen erhöht das Aktivkonto Fahrzeuge — Zunahme im Soll. Die Kasse als Aktivkonto nimmt ab — Buchung im Haben. Buchungssatz: Fahrzeug an Kassa 45'000. Dieser Aktivtausch verändert die Bilanzsumme nicht, nur die Zusammensetzung der Aktiven.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Fahrzeug» oder «Fahrzeugkonto». Aktivkonto — Zunahme durch den Kauf steht im Soll.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Kassa». Aktivkonto — Barausgabe reduziert den Bestand und steht im Haben.` },
    ],
  },
  {
    id: '892fcd59-095c-47a5-bf96-23dec6a9f9a6',
    fachbereich: 'BWL',
    musterlosung: `Im KMU-Kontenrahmen gliedern sich die Konten in 9 Klassen. Klasse 1 umfasst das Vermögen (Aktiven), Klasse 2 die Schulden und das Eigenkapital (Passiven). Die Klassen 3–8 sind Erfolgskonten (Aufwand und Ertrag), Klasse 9 enthält die Abschlusskonten.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Vermögen». Klasse 1 = Aktiven, das gesamte Unternehmensvermögen.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Schulden und Eigenkapital». Klasse 2 = Passiven, die Finanzierungsseite.` },
    ],
  },
  {
    id: '8f1c06e0-36bd-4a9d-a16d-8cdb8f000399',
    fachbereich: 'BWL',
    musterlosung: `Unternehmen mit 0–9 Vollzeitstellen gelten als Mikrounternehmen. Zusammen mit Kleinunternehmen (10–49) und Mittelunternehmen (50–249) bilden sie die Gruppe der KMU. KMU machen rund 99,7% aller Unternehmen in der Schweiz aus und beschäftigen etwa zwei Drittel aller Arbeitnehmenden.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Mikro-Unternehmen». Kleinste Grössenklasse mit 0–9 Vollzeitstellen.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Klein- und Mittelunternehmen». Sammelbegriff KMU für Mikro, Klein und Mittel.` },
    ],
  },
  {
    id: '92e90e31-8070-422c-b6c5-a127a0ee1147',
    fachbereich: 'BWL',
    musterlosung: `Das Wirtschaften bedeutet, mit knappen Ressourcen (Inputs) einen möglichst grossen Nutzen (Output) zu erzielen. Die zentrale Aufgabe ist die effiziente Umwandlung von Inputs in Outputs — also die Vermeidung von Verschwendung. Das Ökonomische Prinzip formuliert dies als Maximum- oder Minimumprinzip.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Das Wirtschaften». Effiziente Transformation von Inputs in Outputs gemäss dem Ökonomischen Prinzip.` },
    ],
  },
  {
    id: '94390ea5-d244-4282-bebb-b102e5af5f36',
    fachbereich: 'BWL',
    musterlosung: `Proaktion bedeutet, dass ein Unternehmen vorausschauend handelt, Trends frühzeitig erkennt und aktiv neue Wege einschlägt, bevor es dazu gezwungen wird. Das Gegenteil ist Reaktion — das passive Antworten auf Umweltveränderungen. Proaktives Verhalten sichert langfristig Wettbewerbsvorteile.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Proaktion» oder «aktiven Gestaltung». Vorausschauendes, initiatives Verhalten gegenüber Umweltveränderungen.` },
    ],
  },
  {
    id: '97ff4778-e57b-4ac0-a253-e80686ad97c7',
    fachbereich: 'BWL',
    musterlosung: `Die fünf Umweltsphären bilden das Umfeld jedes Unternehmens: ökonomisch (Markt, Konjunktur), technologisch (Innovationen), ökologisch (Umwelt, Klima), sozial (Werte, Gesellschaft) und rechtlich (Gesetze). Sie beeinflussen das Unternehmen indirekt und müssen laufend beobachtet werden.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Technologische». Umfasst Innovationen, neue Verfahren und Digitalisierung.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Rechtliche». Umfasst Gesetze, Verordnungen und rechtliche Rahmenbedingungen.` },
    ],
  },
  {
    id: '9fd21cd5-fe36-4b1c-88db-bc4b2c56e403',
    fachbereich: 'BWL',
    musterlosung: `Das Marktpotenzial beschreibt die theoretisch höchstmögliche Absatzmenge einer Leistung in einem Markt. Es ist eine Abschätzung der maximalen Aufnahmefähigkeit — nicht die tatsächlich realisierte Menge. Vom Marktpotenzial unterscheidet sich das Marktvolumen (tatsächlicher Absatz aller Anbieter).`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Marktpotenzial». Theoretisch maximal mögliche Absatzmenge im Markt.` },
    ],
  },
  {
    id: 'a04bf84f-1aec-4469-9186-3f27a0c03c26',
    fachbereich: 'BWL',
    musterlosung: `Der Erfolg berechnet sich als Erträge minus Aufwände. Ist das Ergebnis positiv, liegt ein Jahresgewinn vor. Ist es negativ, entsteht ein Jahresverlust. Der Saldo der Erfolgsrechnung wird als Gewinn oder Verlust in das Eigenkapital übertragen.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Jahresgewinn». Erträge übersteigen Aufwände — das Eigenkapital wächst.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Jahresverlust». Aufwände übersteigen Erträge — das Eigenkapital sinkt.` },
    ],
  },
  {
    id: 'a50ca8b1-d07c-42f0-bb7f-f40faa631ede',
    fachbereich: 'BWL',
    musterlosung: `Die Schweizer Wirtschaft wird in drei Sektoren gegliedert. Der 1. Sektor umfasst Land- und Forstwirtschaft, der 2. Sektor Industrie und Gewerbe (Produktion), der 3. Sektor die Dienstleistungsbranche (z.B. Banken, Gesundheit, Tourismus). In der Schweiz dominiert heute der 3. Sektor.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «die Industrie». Produktionssektor — industrielle Fertigung gehört zum 2. Sektor.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «das Gewerbe». Handwerk und Kleinproduktion — ebenfalls 2. Sektor.` },
      { feld: 'luecken', id: 'luecke-2', text: `Lücke 2 = «Dienstleistungsbranche». 3. Sektor — umfasst Banken, Handel, Tourismus, Gesundheit.` },
    ],
  },
  {
    id: 'a9a837c3-f098-4f76-bbfe-13b498a55d1c',
    fachbereich: 'BWL',
    musterlosung: `Briefmarken zählen zum Büromaterial und werden als Verwaltungsaufwand verbucht. Der Aufwand nimmt zu und steht im Soll. Die Kasse als Aktivkonto nimmt ab und steht im Haben. Buchungssatz: Büromaterialaufwand an Kassa 150. Der Erfolg der Periode wird um 150 CHF vermindert.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Büromaterialaufwand» oder «Übriger Aufwand». Aufwandkonto — Zunahme im Soll.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Kassa». Aktivkonto — Barausgabe wird im Haben gebucht.` },
    ],
  },
  {
    id: 'ae0fdc6e-a8d7-435b-a29e-ff08156a3f82',
    fachbereich: 'BWL',
    musterlosung: `Das Unternehmensleitbild enthält die Grundwerte, Prinzipien und das Selbstverständnis eines Unternehmens. Es formuliert in konzentrierter Form, wofür das Unternehmen steht, und dient intern wie extern als Orientierung. Führungskräfte, Mitarbeitende und Anspruchsgruppen können sich daran ausrichten.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Unternehmensleitbild». Schriftliche Zusammenfassung von Werten, Zielen und Selbstverständnis.` },
    ],
  },
  {
    id: 'b23457ae-1edc-4e68-bf1a-e17795b32ae4',
    fachbereich: 'BWL',
    musterlosung: `Passivkonten spiegeln die rechte Bilanzseite: Anfangsbestand und Zunahmen werden rechts (Habenseite) gebucht, Abnahmen und der Saldo zum Jahresende stehen links (Sollseite). Beim Abschluss wird der Saldo auf die Habenseite der Schlussbilanz übertragen.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «rechten» / «Habenseite». Passivkonten verbuchen Zunahmen rechts.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «linken» / «Sollseite». Abnahmen und Saldo stehen links.` },
    ],
  },
  {
    id: 'b70bfa2a-fc4a-46f6-b730-a8761a450bad',
    fachbereich: 'BWL',
    musterlosung: `Eigenkapitalgeber (Aktionäre, Eigentümer) haben drei Hauptinteressen: eine Wertsteigerung der Anteile (Shareholder-Value), eine möglichst hohe Rendite auf das eingesetzte Kapital sowie Sicherheit vor Kapitalverlust. Diese Ansprüche müssen vom Management gegenüber anderen Anspruchsgruppen abgewogen werden.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Werterhöhung» / «Wertzunahme». Shareholder-Value — Zunahme des Anteilswertes.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Rendite» / «Dividende». Jährliche Ausschüttung oder Verzinsung des Kapitals.` },
    ],
  },
  {
    id: 'bb294fca-dcc6-4aee-8c3e-68af99368c7e',
    fachbereich: 'BWL',
    musterlosung: `Die Transitorische Aktive (TA) wurde per 31.12. für die vorausbezahlte Versicherung gebildet. Im neuen Jahr erfolgt die Auflösung: der Versicherungsaufwand nimmt im Soll zu, die TA als Aktivkonto nimmt im Haben ab. Buchungssatz: Aufwand an TA 9'000. So wird der Aufwand periodengerecht dem neuen Jahr zugeordnet.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Aufwand». Versicherungsaufwand — wird im neuen Jahr als Aufwand erfasst, Zunahme im Soll.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «TA» (Transitorische Aktive). Aktivkonto — wird aufgelöst, Abnahme steht im Haben.` },
    ],
  },
  {
    id: 'bc403717-e91d-4ef4-b79c-ab2abadda011',
    fachbereich: 'BWL',
    musterlosung: `Die Evaluation ist der letzte Schritt im Prozess der strategischen Planung. Nach Analyse, Strategieentwicklung und Umsetzung wird überprüft, ob die gesteckten Ziele erreicht wurden und welche Lehren für die nächste Planungsrunde zu ziehen sind. Damit schliesst sich der Kreis.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «letzten Schritt» / «Schluss». 4. und abschliessender Schritt des strategischen Planungsprozesses.` },
    ],
  },
  {
    id: 'c68f95ba-f8cf-4eb4-9390-334b9d74a198',
    fachbereich: 'BWL',
    musterlosung: `Das BCG-Portfolio (Boston Consulting Group) beurteilt Produkte oder Geschäftseinheiten anhand zweier Grössen: dem Marktwachstum (y-Achse) und dem relativen Marktanteil gegenüber dem stärksten Konkurrenten (x-Achse). Daraus ergeben sich vier Felder: Question Marks, Stars, Cash Cows und Poor Dogs.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Marktwachstum». Y-Achse — Wachstumsrate des Gesamtmarktes.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Marktanteil». X-Achse — relativer Marktanteil gegenüber dem stärksten Konkurrenten.` },
    ],
  },
  {
    id: 'd54c868f-796f-4f78-91cd-6cd2f18a8591',
    fachbereich: 'BWL',
    musterlosung: `Die strategische Planung umfasst vier aufeinanderfolgende Schritte: 1. Analyse der Ausgangslage (intern und extern), 2. Entwicklung der Unternehmensstrategie, 3. Umsetzung der Strategie im operativen Geschäft, 4. Evaluation der Zielerreichung. Der Prozess ist zirkulär — die Evaluation fliesst in die nächste Analyse ein.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «4». Vier Schritte: Analyse → Strategieentwicklung → Umsetzung → Evaluation.` },
    ],
  },
  {
    id: 'da05a438-415c-4697-9629-f779e4f05832',
    fachbereich: 'BWL',
    musterlosung: `Bedürfnisse sind der Motor der Wirtschaft. Sie bilden den Ausgangspunkt aller wirtschaftlichen Aktivitäten: Wo ein ungelöstes Problem besteht, entstehen Lösungsangebote. Sobald Menschen bereit sind, für eine Lösung zu bezahlen, entsteht eine Nachfrage — und damit ein Markt.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «wirtschaftlichen Aktivitäten». Bedürfnisse lösen Produktion und Handel aus.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Nachfrage». Zahlungsbereitschaft für Lösungen — Grundlage jedes Marktes.` },
    ],
  },
  {
    id: 'e2498406-d33a-4c08-9ac8-b99cde9cbe54',
    fachbereich: 'BWL',
    musterlosung: `Nach der Verbuchung der Bestandesänderung zeigt der Saldo des Kontos Wareneinkauf den Einstandspreis der verkauften Waren — auch Wareneinsatz oder Warenaufwand genannt. Dieser fliesst in die erste Stufe der dreistufigen Erfolgsrechnung ein und bildet zusammen mit dem Warenertrag den Bruttogewinn.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Einstandspreis». Anschaffungspreis der tatsächlich verkauften Waren nach Bestandesänderung.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Wareneinsatz». Synonym für Warenaufwand — Wert der verkauften Waren.` },
    ],
  },
  {
    id: 'e3453fb7-e1cb-4964-a019-eefa385bcc5c',
    fachbereich: 'BWL',
    musterlosung: `Bei der direkten Abschreibung wird der Wertverlust direkt auf dem Anlagekonto erfasst. Der Abschreibungsaufwand (Aufwandkonto) nimmt im Soll zu, das Maschinenkonto (Aktivkonto) nimmt im Haben ab. Buchungssatz: Abschreibungsaufwand an Maschinenkonto 10'000. Der Buchwert der Maschine sinkt direkt um 10'000 CHF.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Abschreibungsaufwand». Aufwandkonto — Zunahme im Soll.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Maschinenkonto». Aktivkonto — direkte Abnahme durch Abschreibung im Haben.` },
    ],
  },
  {
    id: 'e5ff24b1-ac11-499e-b578-e5bbc4efad6b',
    fachbereich: 'BWL',
    musterlosung: `Die Rechnung für Werbematerial begründet eine Verbindlichkeit gegenüber dem Lieferanten. Der Marketingaufwand (Aufwandkonto) nimmt im Soll zu, die Verbindlichkeiten (Passivkonto) nehmen im Haben zu. Buchungssatz: Marketingaufwand an Verbindlichkeiten 3'200. Die Zahlung erfolgt erst später — diese Buchung erfasst nur den Aufwand und die Schuld.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Marketingaufwand» / «Übriger Aufwand». Aufwandkonto — Zunahme im Soll.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Verbindlichkeiten». Passivkonto — neue Schuld gegenüber Lieferant, Zunahme im Haben.` },
    ],
  },
  {
    id: 'e6e2de37-3f7b-4f35-bed9-56b70ca73479',
    fachbereich: 'BWL',
    musterlosung: `Aufwandkonten nehmen im Soll zu und im Haben ab (z.B. bei einer Gutschrift). Die Haben-Seite ist dieselbe Seite, auf der Passivkonten und Ertragskonten Zunahmen verbuchen. Die Logik ist symmetrisch: Aufwand vermindert sich dort, wo Ertrag entsteht.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «rechts». Aufwandkonten verbuchen Abnahmen im Haben (rechts).` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Passivkonten» / «Ertragskonto». Beide verbuchen Zunahmen im Haben — symmetrisch zur Aufwandsabnahme.` },
    ],
  },
  {
    id: 'e8316e9c-dde2-4a08-b0db-883be8677df5',
    fachbereich: 'BWL',
    musterlosung: `Darlehen ist ein Passivkonto mit Anfangsbestand 100'000 im Haben. Die Rückzahlung 20'000 wird als Abnahme im Soll gebucht — Saldo 80'000. Bank ist ein Aktivkonto mit Anfangsbestand 75'000 im Soll. Die Überweisung verringert den Bestand — Saldo 55'000.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «80'000». Darlehen-Saldo = 100'000 AB (Haben) − 20'000 Rückzahlung (Soll).` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «55'000». Bank-Saldo = 75'000 AB (Soll) − 20'000 Abnahme (Haben).` },
    ],
  },
  {
    id: 'f164e9f2-f276-4cd9-89e2-71018bc0d97e',
    fachbereich: 'BWL',
    musterlosung: `Die Umweltanalyse untersucht die äusseren Rahmenbedingungen eines Unternehmens. Dazu gehören Markt, Konkurrenz, Trends, gesetzliche und technologische Entwicklungen. Sie ergänzt die Unternehmensanalyse, die sich mit den internen Stärken und Schwächen befasst.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «äusseren». Externe Rahmenbedingungen — im Gegensatz zur internen Unternehmensanalyse.` },
    ],
  },
  {
    id: 'f18466c7-bb1a-4fec-a0b8-4af6da81e1d2',
    fachbereich: 'BWL',
    musterlosung: `Die Privateinlage erhöht sowohl das Vermögen als auch die Finanzierung. Die Kasse (Aktivkonto) nimmt im Soll zu, das Eigenkapital (Passivkonto) nimmt im Haben zu. Buchungssatz: Kassa an EK 20'000. Die Bilanz verlängert sich um 20'000 CHF — es handelt sich um eine Bilanzverlängerung.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Kassa». Aktivkonto — Bareinlage erhöht den Kassabestand, Zunahme im Soll.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «EK» (Eigenkapital). Passivkonto — Einlage erhöht das Eigenkapital, Zunahme im Haben.` },
    ],
  },
  {
    id: 'f2c59d2f-f526-48f5-98c1-bfcc0a5d921e',
    fachbereich: 'BWL',
    musterlosung: `Ein Erklärungsmodell stellt Ursache-Wirkungs-Zusammenhänge dar. Es formuliert Hypothesen über betriebliche Gesetzmässigkeiten — zum Beispiel die Annahme, dass mit zunehmender Produktionsmenge die Stückkosten sinken. Erklärungsmodelle helfen, Prozessabläufe zu verstehen und Entscheidungen zu fundieren.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Erklärungsmodell». Stellt Ursache-Wirkungs-Beziehungen zu Prozessabläufen dar.` },
    ],
  },
  {
    id: 'f2cda98a-bc53-48d9-a881-f38c04f69866',
    fachbereich: 'BWL',
    musterlosung: `Bei der indirekten Abschreibung bleibt der Anschaffungswert des Fahrzeugs sichtbar. Der Abschreibungsaufwand nimmt im Soll zu, das Minus-Aktivkonto Wertberichtigung Fahrzeuge (WB Fahrzeuge) nimmt im Haben zu. Buchungssatz: Abschreibungsaufwand an WB Fahrzeuge 8'000. Der Buchwert ergibt sich aus Anschaffungswert minus WB.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Abschreibungsaufwand». Aufwandkonto — Zunahme im Soll.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «WB Fahrzeuge». Minus-Aktivkonto — sammelt Wertverlust, Zunahme im Haben.` },
    ],
  },
  // ===== BWL/mc (5) =====
  {
    id: '0003db86-1c3b-487d-9576-325402d0017f',
    fachbereich: 'BWL',
    musterlosung: `Der Prozess der strategischen Planung beginnt mit der Analyse (intern und extern), gefolgt von der Strategieentwicklung, der Umsetzung im operativen Geschäft und schliesslich der Evaluation. Nur in dieser Reihenfolge ist die Planung schlüssig — jede andere Sequenz verkennt den logischen Ablauf von Erkenntnis zu Handeln zu Kontrolle.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Vor der Strategieentwicklung muss zuerst die Analyse stehen — ohne Ausgangsdaten keine sinnvolle Strategie.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die Evaluation ist der letzte Schritt, nicht der erste — sie überprüft Zielerreichung nach der Umsetzung.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Klassische Sequenz: Analyse → Strategieentwicklung → Umsetzung → Evaluation — von der Erkenntnis zur Kontrolle.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Die Umsetzung folgt auf die Strategieentwicklung, nicht am Anfang — man setzt keine Strategie um, bevor sie existiert.` },
    ],
  },
  {
    id: '01189a84-1add-4f67-b38d-d8b2fe53c3cf',
    fachbereich: 'BWL',
    musterlosung: `Zur Marktsegmentierung dienen vier klassische Kriterien: Geografie (Land, Region), Demografie (Alter, Geschlecht, Einkommen), Psychografie (Lebensstil, Einstellungen) und Kundenverhalten. Die Eigenkapitalquote beschreibt die Finanzierungsstruktur des eigenen Unternehmens — sie ist ein internes Finanzkennzahl, kein Segmentierungskriterium.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Geografische Segmentierung unterteilt den Markt nach räumlichen Kriterien wie Land oder Region.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Demografische Kriterien beschreiben messbare Merkmale der Zielperson wie Alter oder Einkommen.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Verwechslung interner Finanzkennzahl mit Marktkriterium — die Eigenkapitalquote betrifft das eigene Unternehmen, nicht den Markt.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Psychografische Kriterien erfassen Werte, Einstellungen und Lebensstile der Zielgruppe.` },
    ],
  },
  {
    id: '0159d589-a8cb-4373-acc1-e11d751c2413',
    fachbereich: 'BWL',
    musterlosung: `Modelle vereinfachen komplexe Realität (A korrekt) und helfen, Entscheidungsfaktoren zu ordnen und zu gewichten (C korrekt). Das St. Galler Unternehmensmodell ist ein Erklärungs- und Beschreibungsmodell, kein Entscheidungsmodell (B falsch). Kein Modell kann die gesamte Wirklichkeit exakt abbilden — das ist die definitorische Schwäche (D falsch).`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Die Vereinfachung komplexer Realität ist Kern jeder Modellbildung.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Das St. Galler Unternehmensmodell ist ein Erklärungs- und Beschreibungsmodell, kein Entscheidungsmodell.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Modelle strukturieren Entscheidungsfaktoren und ermöglichen eine systematische Analyse.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Kein Modell kann die gesamte Wirklichkeit exakt abbilden — Modelle sind immer vereinfachend.` },
    ],
  },
  {
    id: '0183dede-4e2f-4ce6-8ca1-d15056965728',
    fachbereich: 'BWL',
    musterlosung: `Ein Porsche geht weit über das Grundbedürfnis nach Mobilität hinaus. Der Kauf eines Luxusautos befriedigt primär das Bedürfnis nach Anerkennung und Prestige (Maslow-Stufe «Achtung»), oft ergänzt durch Selbstverwirklichung. Die Motivation ist weder reiner Transport noch Sicherheit, sondern ein Statussymbol.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Für Freunde-Besuche genügt jedes Auto — ein Porsche erfüllt diesen sozialen Zweck nicht spezifisch.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Sicherheit bietet jedes moderne Auto — der Porsche als Luxusmodell zielt nicht primär auf Sicherheit.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Luxusautos befriedigen primär Anerkennung und Prestige, sekundär Selbstverwirklichung — klassisches Statussymbol.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Für blosse Fortbewegung wäre ein Kleinwagen ausreichend — das rechtfertigt den Preis eines Porsches nicht.` },
    ],
  },
  {
    id: '032e30a3-7caf-4613-a840-458cfef90ffc',
    fachbereich: 'BWL',
    musterlosung: `Erfolgskonten (Aufwand und Ertrag) starten jedes Jahr bei null und werden am Jahresende über die Erfolgsrechnung abgeschlossen — sie werden nicht vorgetragen. Bilanzkonten (Aktiven und Passiven) hingegen tragen ihren Endbestand als Anfangsbestand ins neue Jahr. Aufwandkonten schliessen gegen die ER, nicht gegen die Bilanz.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Erfolgskonten haben keinen Anfangsbestand — sie starten jedes Jahr bei null und sammeln periodenspezifisch.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Bilanzkonten tragen ihren Endbestand als Anfangsbestand ins Folgejahr — das ist die Eröffnungsbuchung.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Aufwandkonten werden über die Erfolgsrechnung abgeschlossen, nicht über die Bilanz — Verwechslung der Kontenarten.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Ertragskonten schliessen gegen die Erfolgsrechnung, deren Saldo ins Eigenkapital übergeht.` },
    ],
  },
]

async function main() {
  const stateRaw = await fs.readFile(STATE, 'utf8')
  const state = JSON.parse(stateRaw)
  state.fragen = state.fragen || {}

  const outLines = []
  let done = 0
  const now = new Date().toISOString()

  for (const u of updates) {
    const existing = state.fragen[u.id]
    if (existing && existing.status === 'done') {
      console.warn(`skip already done: ${u.id}`)
      continue
    }
    outLines.push(JSON.stringify(u))
    state.fragen[u.id] = {
      status: 'done',
      zeitpunkt: now,
      teile: u.teilerklaerungen.length,
    }
    done++
  }

  state.verarbeitet = (state.verarbeitet || 0) + done
  state.letzteSession = now

  await fs.appendFile(OUT, outLines.join('\n') + (outLines.length ? '\n' : ''), 'utf8')
  await fs.writeFile(STATE, JSON.stringify(state, null, 2), 'utf8')

  console.log(`Session 28: ${done} verarbeitet, total ${state.verarbeitet}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
