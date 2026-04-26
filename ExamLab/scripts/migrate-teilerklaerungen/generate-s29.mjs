#!/usr/bin/env node
/**
 * Session 29: 50 Fragen, alles BWL/mc.
 * Teilerklärungen pro optionen, ID=optionen[].id.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  {
    id: '045ba165-3eb3-414b-9717-81a46fc3d5e2',
    fachbereich: 'BWL',
    musterlosung: `Die abgekürzte Eröffnungsbuchung fasst alle Einzel-Eröffnungen zusammen: Aktiven an Passiven. Alle Aktivkonten werden im Soll eröffnet, alle Passivkonten im Haben. Die abgekürzte Abschlussbuchung lautet umgekehrt Passiven an Aktiven.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Aktiven werden im Soll eröffnet, Passiven im Haben — entspricht der Normallage beider Kontenarten.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. «Passiven an Aktiven» ist die abgekürzte Abschluss-, nicht Eröffnungsbuchung.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Die Eröffnungsbilanz ist kein Buchungsgegenstand, sondern die Ausgangsliste für die Eröffnungsbuchungen.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Schlussbilanz und Eröffnungsbilanz sind keine Buchungskonten — sie sind Darstellungen der Bestände.` },
    ],
  },
  {
    id: '04645772-fd2a-4739-94bc-7b8d10dc4947',
    fachbereich: 'BWL',
    musterlosung: `Ein Code of Conduct (Verhaltenskodex) legt verbindliche Handlungsrichtlinien für alle Führungsstufen und Mitarbeitenden fest. Er wird im Rahmen der Führung und in Mitarbeitergesprächen verankert und überprüft. Er dient dazu, Werte des Leitbilds im Alltag durchzusetzen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Die Produkt-Markt-Matrix (Ansoff) dient der Wachstumsstrategie, nicht als Verhaltenskodex.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die Fähigkeitsanalyse bewertet Stärken und Schwächen eines Unternehmens, regelt aber kein Verhalten.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Die SWOT-Analyse ist ein strategisches Analyseinstrument, kein verbindlicher Verhaltensrahmen.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Ein Code of Conduct formuliert verbindliche Verhaltensregeln für alle Ebenen.` },
    ],
  },
  {
    id: '0474822f-9460-4501-bd0a-ba8b534359d8',
    fachbereich: 'BWL',
    musterlosung: `Hohe Lieferbereitschaft verlangt grosse Lagerbestände; grosse Lagerbestände verursachen aber hohe Lagerhaltungskosten. Die beiden Ziele stehen im Widerspruch — das ist eine Zielkonkurrenz. Zur Lösung wird ein Kompromiss gesucht, etwa ein optimaler Bestand.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Zielharmonie liegt vor, wenn das eine Ziel das andere fördert — hier behindern sie sich.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Zielidentität würde bedeuten, es sei ein und dasselbe Ziel — das trifft nicht zu.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Zielneutralität läge vor, wenn sich die Ziele nicht beeinflussen — hier gibt es aber einen Zielkonflikt.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Beide Ziele schliessen sich teilweise aus — klassisches Beispiel einer Zielkonkurrenz.` },
    ],
  },
  {
    id: '05eb3e62-c32c-48fa-aff0-8315368ea825',
    fachbereich: 'BWL',
    musterlosung: `Bei der direkten Abschreibung wird der Buchwert unmittelbar auf dem Aktivkonto reduziert (Abschreibungen an Aktivkonto). Bei der indirekten Abschreibung bleibt der Anschaffungswert unverändert; die Wertminderungen werden auf einem separaten Minus-Aktivkonto (Wertberichtigung) gesammelt. Die Bilanz zeigt dann Anschaffungswert und Wertberichtigung separat.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Die Abschreibungsmethode richtet sich nicht nach der Anlagenart, sondern nach der Darstellung in der Bilanz.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Der Zeitpunkt (jährlich/monatlich) hat nichts mit direkt/indirekt zu tun — beide werden periodisch verbucht.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Es gibt einen klaren Unterschied in der Kontierung — direkt auf Aktivkonto vs. separates Wertberichtigungskonto.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Direkt reduziert das Aktivkonto unmittelbar, indirekt nutzt ein separates Wertberichtigungskonto.` },
    ],
  },
  {
    id: '06ced06d-7bd0-405c-90b7-15d7fff88c6b',
    fachbereich: 'BWL',
    musterlosung: `Ein Privatbezug belastet das Privatkonto im Soll (verhält sich wie ein Aktivkonto, Gegenkonto zum Eigenkapital). Die Kasse nimmt als Aktivkonto ab und steht im Haben. Buchungssatz: Privat an Kasse 4'000. Am Jahresende wird das Privatkonto gegen das Eigenkapital abgeschlossen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Soll und Haben sind vertauscht — die Kasse nimmt ab (Haben), das Privatkonto nimmt zu (Soll).` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Privat (Soll, nimmt zu) an Kasse (Haben, nimmt ab) — korrekter Buchungssatz für einen Privatbezug.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Ein Privatbezug ist kein Lohnaufwand — er geht auf das Privatkonto, nicht auf ein Aufwandkonto.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Eigenkapital wird im Alltag nicht direkt belastet; dafür existiert das Privatkonto als Durchlaufkonto.` },
    ],
  },
  {
    id: '06fc2e33-16dc-4710-8688-52b2c22ec882',
    fachbereich: 'BWL',
    musterlosung: `Der Sozialversicherungsaufwand ist ein Aufwandkonto. Aufwandkonten nehmen im Soll zu, weil sie den Gewinn mindern. Die Bank ist ein Aktivkonto und nimmt bei der Überweisung ab, steht also im Haben. Buchungssatz: Sozialversicherungsaufwand an Bank 5'600.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Soll und Haben sind vertauscht — der Aufwand nimmt zu (Soll), die Bank nimmt ab (Haben).` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Sozialversicherungsaufwand (Soll) an Bank (Haben) — klassische erfolgswirksame Ausgabebuchung.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Die Zahlung erfolgt per Bank, nicht per Rechnung — Kreditoren wären nur bei offener Rechnung betroffen.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Lohnaufwand ist der Bruttolohn der Mitarbeitenden; Sozialversicherungsbeiträge des Arbeitgebers sind separater Aufwand.` },
    ],
  },
  {
    id: '0848f8b4-2a88-4bdd-87d9-3215713fa5f9',
    fachbereich: 'BWL',
    musterlosung: `In der Bilanz werden die Aktiven nach dem Liquiditätsprinzip geordnet: Zuerst die am schnellsten in Geld umwandelbaren Positionen wie Kasse und Bank, dann die weniger liquiden wie Debitoren, Warenvorrat und schliesslich Anlagevermögen. Die Passiven werden nach Fälligkeit geordnet (kurz- vor langfristig).`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Das Fälligkeitsprinzip gilt für die Passivseite, nicht für die Aktiven.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Aktiven werden nach abnehmender Liquidität geordnet — flüssigste Mittel zuoberst.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Der Anschaffungswert ist kein Ordnungskriterium der Bilanz.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Eine alphabetische Ordnung existiert in der Bilanz nicht — Reihenfolge folgt der Liquidität.` },
    ],
  },
  {
    id: '086c92f3-a00d-48ca-8166-bcb86570c1fa',
    fachbereich: 'BWL',
    musterlosung: `Die Einteilung nach Familien mit Kindern, Abenteuerreisenden und Senioren beruht primär auf Alter und Familienstand, also auf demografischen Merkmalen. Andere Kriterien wären geografisch (Wohnort), psychografisch (Werte, Lebensstil) oder verhaltensbezogen (Nutzungsverhalten).`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Psychografische Segmentierung bezieht sich auf Werte und Lebensstil, nicht auf Alter oder Familienstand.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Kundenverhalten bezieht sich auf Kaufmuster und Nutzung, nicht auf demografische Merkmale.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Alter und Familienstand sind klassische demografische Segmentierungskriterien.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Geografische Segmentierung würde nach Wohnort oder Region unterteilen, nicht nach Lebensphase.` },
    ],
  },
  {
    id: '08ce9495-5aad-44d3-a83d-0343ec67f3ab',
    fachbereich: 'BWL',
    musterlosung: `Mietaufwand ist ein Aufwandkonto. Aufwandkonten verhalten sich wie Aktivkonten: Zunahme im Soll (links), Abnahme im Haben. Beim Bezahlen der Miete nimmt der Aufwand zu, also steht CHF 4'500 links. Die Bank als Aktivkonto nimmt im Haben ab.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Mietaufwand ist ein Aufwand-, kein Passivkonto — die Begründung ist falsch.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Der Geldabfluss betrifft die Bank (Haben), nicht das Aufwandkonto.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Aufwandkonten nehmen im Soll zu — Mietaufwand steht deshalb links.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Mietaufwand ist kein Aktivkonto, auch wenn die Zunahmeseite (Soll) gleich ist.` },
    ],
  },
  {
    id: '096d0f55-e0ed-4c4f-9aa5-89d93688fb95',
    fachbereich: 'BWL',
    musterlosung: `Die Bank ist ein Aktivkonto. Aktivkonten nehmen im Soll zu — die Zinsgutschrift belastet also die Bank im Soll. Der Finanzertrag ist ein Ertragskonto und nimmt im Haben zu. Die Buchung ist erfolgswirksam; der Gewinn steigt.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Bank (Soll, nimmt zu) an Finanzertrag (Haben, nimmt zu) — korrekte erfolgswirksame Zinsbuchung.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Soll und Haben sind vertauscht — die Bank nimmt zu (Soll), nicht ab.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Finanzaufwand wäre bei gezahlten Zinsen korrekt; bei einer Gutschrift liegt jedoch Ertrag vor.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Eine Gutschrift erzeugt Ertrag, nicht Aufwand — der Begriff ist falsch gewählt.` },
    ],
  },
  {
    id: '09f04bab-f906-4526-8585-020652f7e4b0',
    fachbereich: 'BWL',
    musterlosung: `Mietaufwand ist ein Aufwandkonto. Aufwandkonten nehmen im Soll zu — genau wie Aktivkonten. Der Grund: Aufwand mindert den Gewinn, der im Eigenkapital verbucht wird; die Zunahmeseite entspricht der Sollseite des Aktivprinzips.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Nicht alle Konten nehmen im Soll zu — Passiv- und Ertragskonten nehmen im Haben zu.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Mietaufwand ist kein Passivkonto — es ist ein Aufwandkonto.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Ausgaben werden im Soll des Aufwandkontos verbucht, nicht im Haben.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Aufwandkonten nehmen im Soll zu — das ist die Grundregel der doppelten Buchhaltung.` },
    ],
  },
  {
    id: '09f9aba0-04cb-4d87-8d72-3cd6e97a0222',
    fachbereich: 'BWL',
    musterlosung: `Die Kasse als Aktivkonto nimmt durch den Barbetrag zu und steht im Soll. Die Debitoren (Aktivkonto) nehmen durch den Zahlungseingang ab und stehen im Haben. Es liegt ein Aktivtausch vor — die Bilanzsumme bleibt unverändert. Buchungssatz: Kasse an Debitoren 7'000.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Warenverkauf wäre ein Ertragskonto — die Zahlung betrifft aber eine bestehende Forderung.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die Zahlung erfolgt bar in die Kasse, nicht per Bank.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Soll und Haben sind vertauscht — die Kasse nimmt zu, die Debitoren nehmen ab.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Kasse (Soll) an Debitoren (Haben) — klassischer Aktivtausch bei Barzahlung.` },
    ],
  },
  {
    id: '0b4b3fd2-f3eb-4ce5-a2b7-e7940fa6d0b7',
    fachbereich: 'BWL',
    musterlosung: `Die Vision beschreibt das gewünschte Zukunftsbild des Unternehmens — wohin es sich langfristig entwickeln will. Sie ist ein zentrales Element des Leitbilds und dient als Orientierung für alle strategischen Entscheidungen. Die Vision ist inspirativ, aber noch nicht operativ konkretisiert.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Die Organisationsstruktur zeigt die innere Gliederung, nicht die Zukunftsrichtung.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Eine Produkt-/Leistungsliste beschreibt das aktuelle Angebot, kein Zukunftsbild.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Die Vision ist genau dieses gewünschte Zukunftsbild des Unternehmens.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Der Jahresabschluss dokumentiert Vergangenes, keine Zukunftsvorstellung.` },
    ],
  },
  {
    id: '0b6f1ab1-c1d9-44ca-b177-23433a986de5',
    fachbereich: 'BWL',
    musterlosung: `Erst die Markt- und Leistungsanalyse liefert die Grundlage für realistische Zielsetzungen. Ohne Kenntnis der Marktgrösse, der Konkurrenzsituation und der eigenen Leistungsposition wären Produkt- und Marktziele blind gesetzt. Die Analyse deckt Chancen und Gefahren auf und verhindert unrealistische Vorgaben.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Es gibt keine gesetzliche Pflicht zur Markt- und Leistungsanalyse.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Die Analyse liefert die Informationsbasis für realistische und fundierte Ziele.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Produkt- und Marktziele wirken auch gegen aussen; sie sind nicht nur interne Vorgaben.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Kosten sind nicht das Hauptargument — entscheidend ist der Informationsgewinn.` },
    ],
  },
  {
    id: '0bce38bb-ae72-4358-b24a-a064cf676c5c',
    fachbereich: 'BWL',
    musterlosung: `Warenverkauf erfasst die Erlöse aus dem Verkauf von Waren. Erlöse sind ein Wertezuwachs für das Unternehmen und gehören damit zu den Ertragskonten. Ertragskonten nehmen im Haben zu und werden über die Erfolgsrechnung abgeschlossen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Ein Aufwandkonto würde Kosten erfassen, nicht Verkaufserlöse.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Aktivkonten erfassen Vermögenspositionen, nicht laufende Erlöse.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Passivkonten erfassen Verbindlichkeiten und Eigenkapital, keine Erlöse.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Warenverkauf ist ein Ertragskonto — Erlöse sind Wertezuwachs.` },
    ],
  },
  {
    id: '0c9c15d6-b47c-4455-aa0c-f2b084cd14e0',
    fachbereich: 'BWL',
    musterlosung: `Der Energieaufwand ist ein Aufwandkonto und nimmt im Soll zu. Die Bank ist ein Aktivkonto und nimmt durch die Zahlung ab, steht also im Haben. Die Buchung ist erfolgswirksam — der Gewinn sinkt. Buchungssatz: Energieaufwand an Bank 800.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Energieaufwand (Soll) an Bank (Haben) — korrekte erfolgswirksame Ausgabebuchung.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die Zahlung erfolgt direkt per Bank; Kreditoren wären nur bei offener Rechnung betroffen.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Soll und Haben sind vertauscht — der Aufwand nimmt zu, die Bank nimmt ab.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Die Buchung zwischen zwei Passiv-/Aktivkonten erfasst den Aufwand nicht.` },
    ],
  },
  {
    id: '0f4d0545-93c3-471e-ba11-1447cddf7259',
    fachbereich: 'BWL',
    musterlosung: `Die drei ökologischen Zielbereiche sind Ressourcenschutz, Emissionsbegrenzung und Risikobegrenzung. Sie betreffen den schonenden Umgang mit knappen Ressourcen, die Vermeidung von Emissionen und die Kontrolle potenzieller Umweltgefahren. Ein Gewinnziel gehört hingegen zur ökonomischen Sphäre.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Ressourcenschutz — knappe Ressourcen erhalten und schonen — ist ein ökologischer Zielbereich.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Emissionsbegrenzung (vermeiden, vermindern, verwerten, entsorgen) gehört zu den ökologischen Zielen.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Risikobegrenzung zielt darauf, potenzielle Umweltgefahren zu vermindern oder zu verhindern.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Ein Gewinnziel ist ökonomisch, nicht ökologisch — es misst Wirtschaftlichkeit, nicht Umweltwirkung.` },
    ],
  },
  {
    id: '103b36dd-5cac-4f2d-99c1-435bd9281db5',
    fachbereich: 'BWL',
    musterlosung: `Anlagevermögen wie Fahrzeuge, Maschinen oder Gebäude verliert durch Alterung, Abnutzung und technische Überholung kontinuierlich an Wert. Abschreibungen erfassen diesen Wertverlust buchmässig. So zeigt die Bilanz den tatsächlichen Wert des Anlagevermögens und die Erfolgsrechnung den periodengerechten Aufwand.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Abschreibungen reduzieren die Bilanzsumme — sie halten sie nicht künstlich hoch.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Art. 960a OR verpflichtet ausdrücklich zur Abschreibung von abnutzbarem Anlagevermögen.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Wertverlust durch Alterung und Nutzung ist der ökonomische Kern der Abschreibung.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Abschreibungen mindern den Gewinn — sie erhöhen ihn nicht.` },
    ],
  },
  {
    id: '1096bb28-084b-448c-a50c-939792d1a48f',
    fachbereich: 'BWL',
    musterlosung: `Der Klimawandel mit schneearmen Wintern ist ein Phänomen der ökologischen Umweltsphäre — das natürliche Umfeld verändert sich. Der Ferienort muss in Beschneiungsanlagen investieren oder alternative Angebote entwickeln. Indirekt berührt dies auch die ökonomische Sphäre, primär wirkt aber die ökologische.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Die rechtliche Sphäre umfasst Gesetze und Normen — nicht den Klimawandel selbst.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Der Klimawandel gehört zur ökologischen Sphäre und wirkt primär auf das Unternehmen.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Die soziale Sphäre betrifft Werte, Lebensstile und Demografie — nicht das Klima.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Die ökonomische Sphäre beschreibt Konjunktur, Wechselkurse und Zinsen — nicht Witterung.` },
    ],
  },
  {
    id: '12db9514-b800-4844-9d79-bee15f5b06db',
    fachbereich: 'BWL',
    musterlosung: `Aktivkonten erfassen Vermögenswerte des Unternehmens. Kasse, Debitoren und Fahrzeuge gehören zum Vermögen — Kasse und Debitoren zum Umlaufvermögen, Fahrzeuge zum Anlagevermögen. Die Hypothek hingegen ist eine langfristige Verbindlichkeit und damit ein Passivkonto.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Die Kasse ist ein Aktivkonto (flüssige Mittel, Umlaufvermögen).` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die Hypothek ist eine langfristige Schuld und damit ein Passivkonto.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Debitoren sind offene Forderungen — Umlaufvermögen und damit Aktivkonto.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Fahrzeuge gehören zum Anlagevermögen und sind damit Aktivkonto.` },
    ],
  },
  {
    id: '13214287-3313-4629-8f1b-bc242fa89b0e',
    fachbereich: 'BWL',
    musterlosung: `Die acht typischen Anspruchsgruppen sind Kunden, Mitarbeitende, Lieferanten, Konkurrenz, Staat, Eigenkapitalgeber, Fremdkapitalgeber und Öffentlichkeit/Institutionen (inkl. Medien und Verbände). NGOs, UNO und Weltbank sind spezifische Organisationen, aber keine eigene Anspruchsgruppe im St. Galler Modell.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Kunden, Mitarbeitende und Lieferanten sind drei klassische Anspruchsgruppen.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Konkurrenz, Staat sowie Eigen- und Fremdkapitalgeber zählen zu den acht Gruppen.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. NGOs, UNO und Weltbank sind keine eigene Anspruchsgruppe — sie zählen zur Öffentlichkeit/Institutionen.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Öffentlichkeit und Institutionen (Medien, Verbände, Parteien) bilden die achte Gruppe.` },
    ],
  },
  {
    id: '132eb7a9-e164-4ef3-bbeb-eecbf14287e2',
    fachbereich: 'BWL',
    musterlosung: `Wenn das Erreichen eines Ziels ein anderes automatisch mitfördert, liegt Zielharmonie vor. Weniger Ausschuss bedeutet weniger Materialverlust und tiefere Produktionskosten — die beiden Ziele ziehen am gleichen Strang. Zielharmonie ist das Gegenstück zur Zielkonkurrenz und wirtschaftlich ideal.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Zielindifferenz bedeutet, die Ziele beeinflussen einander nicht — hier fördern sie sich aber gegenseitig.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Das eine Ziel fördert automatisch das andere — klassisches Beispiel einer Zielharmonie.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Zielkonkurrenz läge vor, wenn sich die Ziele behinderten — hier unterstützen sie einander.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Zielneutralität bedeutet, dass keine Wirkung in die eine oder andere Richtung besteht.` },
    ],
  },
  {
    id: '14695431-75a5-4634-ae8c-d67851f33968',
    fachbereich: 'BWL',
    musterlosung: `Der Fall Brent Spar zeigte das Zusammenspiel mehrerer Anspruchsgruppen: Kunden drohten mit Shell-Boykott, Öffentlichkeit und Medien erzeugten massiven Druck, die britische Regierung und Nordsee-Anrainerstaaten waren regulatorisch beteiligt, und die gesamte Ölbranche stand vor einer Präzedenzentscheidung für weitere Plattform-Entsorgungen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Der Kundenboykott an Shell-Tankstellen setzte das Unternehmen wirtschaftlich unter Druck.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Öffentlichkeit und Medien (insbesondere Greenpeace) erzeugten enormen öffentlichen Druck.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Britische Regierung und Anrainerstaaten waren als Gesetzgeber und Genehmigungsbehörden beteiligt.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Die Entscheidung hatte Vorbildwirkung für rund 418 weitere zu entsorgende Ölplattformen.` },
    ],
  },
  {
    id: '15404fa8-17d6-44cb-96ba-078ef2f9c142',
    fachbereich: 'BWL',
    musterlosung: `Für die Analyse der Marktgrösse werden drei Kennzahlen verwendet: das Marktpotenzial (maximale Aufnahmefähigkeit), das Marktvolumen (tatsächlich abgesetzte Menge) und der Sättigungsgrad (Verhältnis Volumen zu Potenzial). Aus diesen ergibt sich, wie weit ein Markt bereits ausgeschöpft ist.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Angebot, Nachfrage und Gleichgewichtspreis sind mikroökonomische Konzepte, keine Marktgrössen-Kennzahlen.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Marktpotenzial, Marktvolumen und Sättigungsgrad beschreiben die Marktgrösse.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Marktanteil, Rendite und Produktivität sind Unternehmenskennzahlen, keine Marktgrössen-Masse.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Umsatz, Gewinn und Cashflow sind Erfolgskennzahlen des Unternehmens, nicht des Marktes.` },
    ],
  },
  {
    id: '182f818c-f4c3-4795-a12c-1d6840c21a48',
    fachbereich: 'BWL',
    musterlosung: `Die fünf Wettbewerbskräfte nach Porter sind: bestehende Rivalität, Verhandlungsmacht der Kunden, Verhandlungsmacht der Lieferanten, Gefahr potenzieller neuer Konkurrenten und Gefahr durch Ersatzprodukte. Die technologische Umweltsphäre stammt aus dem Unternehmensmodell und gehört nicht zu Porters Modell.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Die bestehende Rivalität zwischen aktuellen Marktteilnehmern ist eine der fünf Porter-Kräfte.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Die Verhandlungsmacht der Kunden ist eine der fünf Porter-Kräfte.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Die technologische Umweltsphäre gehört zum Unternehmensmodell, nicht zu Porters fünf Kräften.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Die Gefahr durch Ersatzprodukte (Substitute) ist eine der fünf Porter-Kräfte.` },
    ],
  },
  {
    id: '18f7d968-3252-47e1-8bf5-699ee886ae13',
    fachbereich: 'BWL',
    musterlosung: `Die Debitoren (Aktivkonto) nehmen durch die Rechnungsstellung zu und stehen im Soll. Der Honorarertrag (Ertragskonto) nimmt ebenfalls zu und steht im Haben. Die Buchung ist erfolgswirksam — der Gewinn steigt. Buchungssatz: Debitoren an Honorarertrag 6'000.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Bank wäre nur korrekt, wenn die Zahlung bereits eingegangen wäre — hier wird nur fakturiert.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Bank ist falsch — es handelt sich um eine Rechnungsstellung, nicht um einen Zahlungseingang.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Debitoren (Soll) an Honorarertrag (Haben) — korrekte erfolgswirksame Fakturabuchung.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Soll und Haben sind vertauscht — die Debitoren nehmen zu (Soll), nicht der Ertrag.` },
    ],
  },
  {
    id: '1b7dd2c4-a46e-4cc0-9b40-11ff2f0cd386',
    fachbereich: 'BWL',
    musterlosung: `Ein Umsatzziel ist eine finanzwirtschaftliche Grösse — es betrifft Zahlungsströme und Ertrag. Es gehört in den finanzwirtschaftlichen Bereich des Unternehmenskonzepts, zusammen mit Gewinn-, Kapital- und Wirtschaftlichkeitszielen. Leistungswirtschaftliche Ziele betreffen Produktion und Qualität, soziale Ziele Mitarbeitende und Gesellschaft.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Umsatzziele sind finanzwirtschaftlich — sie messen ökonomischen Erfolg.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Der leistungswirtschaftliche Bereich betrifft Produktion, Qualität und Kapazitäten.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Soziale Ziele betreffen Mitarbeitende, Gesellschaft und Umwelt — nicht Umsatz.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Umsatzziele gehören selbstverständlich in das Unternehmenskonzept — als finanzwirtschaftliche Grösse.` },
    ],
  },
  {
    id: '1b8313f6-4f46-46bc-b395-bdd3f0e8ae2e',
    fachbereich: 'BWL',
    musterlosung: `Das Marktpotenzial beschreibt die maximale Aufnahmefähigkeit eines Marktes. Da diese Grenze nie exakt gemessen werden kann, basiert sie auf Annahmen zu Bevölkerung, Konsumgewohnheiten und technologischen Entwicklungen. Diese Annahmen ändern sich durch Trends oder neue Bedürfnisse — deshalb bleibt das Marktpotenzial eine Schätzung.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Das Marktpotenzial stützt sich auf veränderbare Annahmen zur maximalen Aufnahmefähigkeit.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Das Marktvolumen ist per Definition kleiner oder gleich dem Marktpotenzial, nicht grösser.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Umsatzzahlen einzelner Unternehmen beeinflussen die Schätzung — zentraler ist aber die Datenunsicherheit.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Marktpotenzial wird für jeden Markt berechnet, nicht nur für neue.` },
    ],
  },
  {
    id: '1cad85c9-0718-490f-8672-71a55352bc90',
    fachbereich: 'BWL',
    musterlosung: `Menschen sind auf vielfältige Weise mit der Wirtschaft verknüpft: als Arbeitnehmende (Einkommen), als Konsumierende (Bedürfnisbefriedigung), als Produzierende (Güter und Dienstleistungen erstellen) und als Sparende (Kapital anlegen). Diese Rollen können parallel und über den Lebensverlauf wechselnd wahrgenommen werden.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Arbeitnehmende erzielen Einkommen und sind Teil des Arbeitsmarktes.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Konsumierende befriedigen ihre Bedürfnisse durch Kauf von Gütern und Dienstleistungen.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Produzierende erstellen Güter und Dienstleistungen — Angestellte, Selbstständige oder Unternehmer.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Sparende stellen Kapital zur Verfügung und erwirtschaften dafür Zinsen oder Rendite.` },
    ],
  },
  {
    id: '1cf54562-3077-4742-89bd-9275e623b0fe',
    fachbereich: 'BWL',
    musterlosung: `Die Buchung lautet Lohnaufwand (Soll) an Bank (Haben). Die Bank nimmt ab, aber es sinkt kein Passivkonto gleichzeitig — stattdessen wirkt die Buchung erfolgswirksam über den Aufwand auf das Eigenkapital. Deshalb liegt keiner der vier klassischen Bilanzeffekte (Aktiv-, Passivtausch, Bilanzverlängerung, Bilanzverkürzung) vor.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Beim Aktivtausch wären zwei Aktivkonten betroffen — hier ist ein Aufwandkonto beteiligt.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Für eine Bilanzverkürzung müsste ein Passivkonto direkt abnehmen — hier nur die Aktivseite.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Erfolgswirksame Buchungen fallen nicht unter die vier klassischen Bilanzeffekte.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Bilanzverlängerung hiesse, Aktiven und Passiven steigen gleichzeitig — das passiert hier nicht.` },
    ],
  },
  {
    id: '1eced7c9-66db-4b18-8257-0fe30fa23f7b',
    fachbereich: 'BWL',
    musterlosung: `Das Delkredere ist ein Minus-Aktivkonto (Wertberichtigung zu den Debitoren). Es erfasst die geschätzten, wahrscheinlichen Verluste aus offenen Forderungen. Nettowert der Forderungen = Debitoren minus Delkredere. So zeigt die Bilanz den vorsichtig bewerteten, realistischen Forderungsbestand.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Rücksendungen werden über Warenkonten (Warenertrag/Skonto) verbucht, nicht über Delkredere.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Delkredere ist keine Schuld — es korrigiert den Debitorenbestand auf der Aktivseite.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Das Delkredere ist ein Minus-Aktivkonto für mutmassliche Debitorenverluste.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Zinsen werden über Finanzerträge erfasst, nicht über Delkredere.` },
    ],
  },
  {
    id: '1f346ee2-c187-4d41-9932-d70055c41558',
    fachbereich: 'BWL',
    musterlosung: `In der Einführungsphase entscheidet sich, ob sich die Leistung am Markt etablieren kann. Umsatz und Gewinn sind zunächst tief, die Markenbekanntheit muss erst aufgebaut werden. Scheitert das Produkt, wird es rasch aus dem Sortiment genommen — daher ist das Risiko in dieser Phase am grössten.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Der Markteintritt entscheidet über die Zukunft — Scheitern bedeutet rasches Produkt-Aus.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Konkurrenz intensiviert sich typisch in der Wachstums- und Reifephase, nicht in der Einführung.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Kapazitätsengpässe sind ein operatives Problem, nicht das Hauptrisiko der Einführungsphase.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. In der Einführung sind Gewinne tief oder negativ — nicht am höchsten.` },
    ],
  },
  {
    id: '1f7a33fd-8e78-4ad5-a331-11d39b8fe485',
    fachbereich: 'BWL',
    musterlosung: `Im Unternehmensmodell gibt es drei Arten von Wechselwirkungen: zwischen Sphären untereinander, von Sphären auf das Unternehmen und vom Unternehmen zurück auf die Sphären. Alle Richtungen sind möglich und gegenseitig. Das Unternehmen ist also nicht nur Empfänger, sondern auch Gestalter seiner Umwelt.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Die Wirkung verläuft in beide Richtungen — auch die Sphären wirken auf das Unternehmen.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Sphären wirken aufeinander, auf das Unternehmen und erhalten Rückwirkung vom Unternehmen.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Anspruchsgruppen sind nur ein Teil der Wechselwirkungen — die Sphären kommen dazu.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Die Wirkung ist bidirektional — auch das Unternehmen wirkt zurück auf die Umwelt.` },
    ],
  },
  {
    id: '203a78ca-e7f3-4ce0-b8d2-452cc1af1c34',
    fachbereich: 'BWL',
    musterlosung: `Ohne objektive Daten besteht die Gefahr, die eigenen Stärken zu überschätzen oder Schwächen zu übersehen. Statistiken, Marktforschungsstudien und Benchmark-Vergleiche liefern realistische Anhaltspunkte. So werden strategische Entscheidungen auf solider Grundlage getroffen und nicht durch Wunschdenken verzerrt.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Die Analyse ist ein internes Führungsinstrument, kein Finanzierungsdokument.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Eine interne Fähigkeitsanalyse wird nicht veröffentlicht — die Konkurrenz hat keinen Einblick.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Es gibt keine gesetzliche Vorschrift zur Fähigkeitsanalyse — sie ist ein freiwilliges Instrument.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Subjektive Einschätzungen verzerren das Bild und führen zu Fehlentscheidungen.` },
    ],
  },
  {
    id: '207bb796-1e13-40d3-aad5-a6ad76d447d3',
    fachbereich: 'BWL',
    musterlosung: `Die Forderung (Debitoren, Aktivkonto) nimmt durch die Rechnungsstellung zu und steht im Soll. Der Honorarertrag (Ertragskonto) nimmt ebenfalls zu und steht im Haben. Die Buchung ist erfolgswirksam — der Gewinn steigt. Buchungssatz: Debitoren an Honorarertrag 8'000.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Die Zahlung ist noch nicht eingegangen — es wird nur fakturiert, nicht über Bank gebucht.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Kreditoren wäre falsch — der Kunde ist Schuldner, das Unternehmen Gläubiger (Debitor).` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Debitoren (Soll) an Honorarertrag (Haben) — korrekte Fakturabuchung.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Soll und Haben sind vertauscht — die Debitoren nehmen zu, nicht der Ertrag.` },
    ],
  },
  {
    id: '2084cd5b-f279-48ed-84ff-7aa652697de9',
    fachbereich: 'BWL',
    musterlosung: `Der Mietaufwand wird im Soll mit 3'000 belastet. Die Gutschrift von 500 steht im Haben des Mietaufwandkontos. Saldo: 3'000 minus 500 = 2'500. Dieser Netto-Aufwand wird in der Erfolgsrechnung ausgewiesen und mindert den Gewinn entsprechend.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. 3'000 wäre nur der Bruttobetrag — die Gutschrift von 500 muss abgezogen werden.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. 3'000 minus 500 Gutschrift ergibt 2'500 Netto-Aufwand.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. 3'500 wäre die Addition beider Beträge — eine Gutschrift reduziert aber den Aufwand.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. 500 wäre nur die Gutschrift — nicht der Netto-Aufwand.` },
    ],
  },
  {
    id: '2096d05d-ae63-4f6d-960b-12bb681b6770',
    fachbereich: 'BWL',
    musterlosung: `Ein Aktivtausch liegt vor, wenn zwei Aktivkonten betroffen sind — eines nimmt zu, das andere ab — und die Bilanzsumme unverändert bleibt. Die Bareinzahlung auf die Bank (Bank zu, Kasse ab) und die Debitorenzahlung per Bank (Bank zu, Debitoren ab) erfüllen diese Bedingung. Mobilienkauf auf Rechnung und Darlehensaufnahme sind hingegen Bilanzverlängerungen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Kasse (ab) und Bank (zu) sind beide Aktiven — klassischer Aktivtausch.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Mobilienkauf auf Rechnung ist eine Bilanzverlängerung (Mobilien zu, Kreditoren zu).` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Debitoren (ab) und Bank (zu) sind beide Aktiven — Aktivtausch ohne Bilanzwirkung.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Darlehensaufnahme ist eine Bilanzverlängerung (Bank zu, Darlehen zu).` },
    ],
  },
  {
    id: '2156f8e0-561c-40c4-b447-07adc8f167d1',
    fachbereich: 'BWL',
    musterlosung: `Das Bankkonto (Aktivkonto) nimmt durch die Überweisung zu und steht im Soll. Die Forderung gegenüber dem Kunden (Debitoren, Aktivkonto) nimmt ab und steht im Haben. Es liegt ein Aktivtausch vor — die Bilanzsumme bleibt unverändert. Buchungssatz: Bank an Debitoren 5'000.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Soll und Haben sind vertauscht — die Bank nimmt zu, die Debitoren nehmen ab.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Bank (Soll) an Debitoren (Haben) — korrekter Aktivtausch bei Zahlungseingang.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Die Zahlung erfolgt per Bank, nicht bar — Kasse ist nicht betroffen.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Kreditoren sind Lieferantenschulden; hier zahlt ein Kunde (Debitor).` },
    ],
  },
  {
    id: '2310ff0c-6f1f-4723-b3ab-fa23468bc8dc',
    fachbereich: 'BWL',
    musterlosung: `Erfolgswirksam sind Geschäftsfälle, die Aufwand oder Ertrag verändern. Wareneinkauf belastet den Aufwand, Zinsgutschrift erhöht den Ertrag — beide wirken auf den Gewinn. Reine Bestandsveränderungen (Bareinzahlung, Mobilienkauf per Bank) sind Aktivtausch und somit erfolgsunwirksam.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Wareneinkauf auf Rechnung erhöht den Aufwand — erfolgswirksam, Gewinn sinkt.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Bareinzahlung auf die Bank ist Aktivtausch — erfolgsunwirksam.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Die Zinsgutschrift erhöht den Finanzertrag — erfolgswirksam, Gewinn steigt.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Mobilienkauf per Bank ist Aktivtausch (Bank ab, Mobilien zu) — erfolgsunwirksam.` },
    ],
  },
  {
    id: '26ed6f0c-82e8-478a-83c1-28dece30eaa4',
    fachbereich: 'BWL',
    musterlosung: `Gemäss Art. 957 Abs. 1 OR sind Einzelunternehmen und Personengesellschaften ab einem Jahresumsatz von CHF 500'000 zur ordnungsgemässen Buchführung mit Bilanz und Erfolgsrechnung verpflichtet. Unterhalb dieser Grenze genügt eine vereinfachte Einnahmen-/Ausgaben-Rechnung. Juristische Personen sind unabhängig vom Umsatz voll buchführungspflichtig.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. CHF 100'000 ist die Mehrwertsteuergrenze, nicht die Buchführungsschwelle.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. CHF 500'000 Jahresumsatz ist die gesetzliche Grenze für volle Buchführungspflicht.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. CHF 250'000 hat im OR keine Bedeutung für die Buchführungspflicht.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. CHF 1'000'000 ist die Revisionsgrenze (opting-in), nicht die Buchführungsschwelle.` },
    ],
  },
  {
    id: '273c2d19-7746-4554-a1b0-a95b167fc7c1',
    fachbereich: 'BWL',
    musterlosung: `Seit 1850 hat ein tiefgreifender Strukturwandel stattgefunden: Der 1. Sektor (Landwirtschaft) schrumpfte von über 50 Prozent auf rund 2,6 Prozent. Der 3. Sektor (Dienstleistungen) wuchs auf etwa 76,7 Prozent. Der 2. Sektor (Industrie) stieg zwischenzeitlich stark, liegt heute bei rund 20,7 Prozent.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Alle drei Sektoren haben sich verändert — der Wandel war umfassend.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die Richtung ist vertauscht — der 1. Sektor schrumpft, der 3. Sektor wächst.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Landwirtschaft stark zurück, Dienstleistungen stark ausgebaut — Dienstleistungsgesellschaft.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Die Verteilung hat sich massiv verschoben — keinesfalls konstant.` },
    ],
  },
  {
    id: '288bb0d7-fe2f-42d6-acf5-427b4858df1e',
    fachbereich: 'BWL',
    musterlosung: `Zur technologischen Umweltsphäre gehören neue Produktionsverfahren, Digitalisierung, Internet, Robotik sowie neue Vertriebs- und Werbeplattformen. Die demografische Entwicklung (Altersstruktur, Bevölkerungswachstum) gehört hingegen zur sozialen Umweltsphäre. Technologie wirkt über Innovation und Effizienz auf das Unternehmen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Neue Produktionsverfahren und Roboter sind typische technologische Entwicklungen.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Digitalisierung und Internet verändern Geschäftsmodelle — zentrale technologische Trends.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Demografische Entwicklungen gehören zur sozialen, nicht zur technologischen Sphäre.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Neue Werbe- und Verkaufsplattformen (Online-Shops) sind Folge technologischer Entwicklung.` },
    ],
  },
  {
    id: '2d3842d6-7c3d-4c89-90ef-39ef8537694f',
    fachbereich: 'BWL',
    musterlosung: `Zum Umlaufvermögen zählen alle Aktiven, die innerhalb eines Jahres in Geld umgewandelt werden können: Kasse, Bank, Debitoren und Warenvorrat. Fahrzeuge, Immobilien, Mobilien und Maschinen sind hingegen langfristig im Betrieb gebunden und gehören zum Anlagevermögen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Kasse und Bank sind flüssige Mittel — klar Umlaufvermögen.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Debitoren und Warenvorrat werden in der Regel innerhalb eines Jahres realisiert.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Fahrzeuge und Immobilien sind langfristig gebunden — Anlagevermögen.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Mobilien und Maschinen dienen dauerhaft dem Betrieb — Anlagevermögen.` },
    ],
  },
  {
    id: '2da4b0a6-b37c-4092-a59c-9bfff9037138',
    fachbereich: 'BWL',
    musterlosung: `Höhere Löhne bedeuten höhere Personalkosten — das steht der Kostensenkung entgegen. Die Ziele der Mitarbeitenden (höherer Lohn) und des Unternehmens (tiefere Kosten) behindern sich gegenseitig. Das ist ein klassischer Zielkonflikt, der nur durch Kompromisse (z. B. Bonusmodell) entschärft werden kann.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Höhere Löhne und Kostensenkung behindern sich gegenseitig — klarer Zielkonflikt.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Zielidentität würde bedeuten, die Ziele seien dasselbe — hier sind sie gegenläufig.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Zielneutralität hiesse ohne Wechselwirkung — hier gibt es aber eine klare Konfrontation.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Zielharmonie läge vor, wenn das eine Ziel das andere förderte — hier ist es umgekehrt.` },
    ],
  },
  {
    id: '2f6e11d3-7264-4012-939d-97f11929f51b',
    fachbereich: 'BWL',
    musterlosung: `Das Marketingkonzept umfasst vier Schritte in dieser Reihenfolge: 1. Markt- und Leistungsanalyse, 2. Marktforschung, 3. Produkt- und Marktziele, 4. Marketing-Mix. Die Analyse liefert Informationen, die Marktforschung vertieft sie, daraus werden Ziele abgeleitet, die dann mit dem Marketing-Mix (4P) umgesetzt werden.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Ziele können nicht vor der Analyse gesetzt werden — die Reihenfolge ist falsch.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Marketing-Mix ist die letzte Stufe, nicht eine Zwischenstufe.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Analyse → Forschung → Ziele → Marketing-Mix ist die korrekte Reihenfolge.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Marketing-Mix kommt am Ende, nicht am Anfang — sonst fehlen Ziele und Daten.` },
    ],
  },
  {
    id: '307ff4bb-751b-4a1d-b9e3-7d014a9df1dd',
    fachbereich: 'BWL',
    musterlosung: `Der tatsächliche Forderungsausfall wird als Aufwand erfasst: Debitorenverluste (Aufwandkonto, Soll) an Debitoren (Aktivkonto, Haben) 3'000. Die Forderung wird damit definitiv ausgebucht, der Verlust belastet die Erfolgsrechnung. Der Verlustschein bleibt als Anspruch 20 Jahre erhalten, ist aber meist wertlos.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Die Bank ist nicht beteiligt — es fliesst kein Geld, sondern eine Forderung wird ausgebucht.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Debitorenverluste (Soll) an Debitoren (Haben) — korrekte Verbuchung des tatsächlichen Verlusts.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Das Delkredere ist für mutmassliche, nicht tatsächliche Verluste — es wird separat aufgelöst.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Soll und Haben sind vertauscht — der Verlust belastet den Aufwand, die Debitoren nehmen ab.` },
    ],
  },
  {
    id: '31bf63b9-4cf0-48c8-bb24-d5ab7ea979fd',
    fachbereich: 'BWL',
    musterlosung: `Ein Lieferanten-Rabatt reduziert sowohl die Schuld (Kreditoren) als auch den Aufwand (Wareneinkauf). Kreditoren (Passivkonto) nehmen im Soll ab, Wareneinkauf (Aufwandkonto) nimmt im Haben ab. Buchungssatz: Kreditoren an Wareneinkauf 1'500. Die Erfolgsrechnung zeigt weniger Wareneinkaufsaufwand.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Ein Konto «Rabatt» existiert im Kontenrahmen KMU in der Regel nicht als eigenes Konto.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Das ist die Buchung des Wareneinkaufs selber — nicht die Rabattbuchung.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Der Rabatt wurde nicht bar vergütet — er reduziert die bestehende Lieferantenschuld.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Kreditoren (Soll, Schuld sinkt) an Wareneinkauf (Haben, Aufwand sinkt) — korrekte Rabattbuchung.` },
    ],
  },
  {
    id: '33804c31-8997-41d8-b08b-5da2ce0a5f70',
    fachbereich: 'BWL',
    musterlosung: `Stärken (Strengths) und Schwächen (Weaknesses) beziehen sich auf das Unternehmen selbst — sie stammen aus der Unternehmensanalyse. Chancen (Opportunities) und Gefahren (Threats) stammen aus dem Marktumfeld und bilden die Umweltanalyse. Die SWOT kombiniert beide Perspektiven.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Chancen sind extern — sie gehören zur Umweltanalyse, nicht zur internen Analyse.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Stärken und Schwächen sind interne Faktoren — sie stammen aus der Unternehmensanalyse.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Chancen und Gefahren sind extern — sie stammen aus der Umweltanalyse.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Gefahren sind extern — nur Schwächen gehören zum internen Bereich.` },
    ],
  },
  {
    id: '33cac331-62d0-481e-b99f-ce95a485b62f',
    fachbereich: 'BWL',
    musterlosung: `Die Kreditoren (Passivkonto) nehmen durch die Zahlung ab und stehen im Soll. Die Bank (Aktivkonto) nimmt ebenfalls ab und steht im Haben. Es liegt eine Bilanzverkürzung vor — Aktiven und Passiven sinken gleichzeitig. Buchungssatz: Kreditoren an Bank 3'000.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. «Aufwand» ist kein spezifisches Konto — der Aufwand wurde bereits bei der Rechnung verbucht.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die Zahlung erfolgt per Bank, nicht bar — Kasse ist nicht betroffen.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Soll und Haben sind vertauscht — die Kreditoren nehmen ab (Soll), nicht die Bank zu.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Kreditoren (Soll, Schuld sinkt) an Bank (Haben, Aktivum sinkt) — korrekte Bilanzverkürzung.` },
    ],
  },
  {
    id: '33fe92f0-da32-4e5d-9e21-fd0859f9b0e5',
    fachbereich: 'BWL',
    musterlosung: `Die Rückstellung von 20'000 wird aufgelöst. 15'000 werden tatsächlich bezahlt: Rückstellungen an Bank 15'000. Die Differenz von 5'000 ist nicht mehr nötig und wird als ausserordentlicher Ertrag erfasst: Rückstellungen an ausserordentlicher Ertrag 5'000. So wird die Überdotierung aus Vorsicht korrekt bereinigt.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Der Aufwand wurde bereits bei der Bildung der Rückstellung verbucht — nicht erneut bei der Auflösung.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. 15'000 Zahlung plus 5'000 a.o. Ertrag — korrekte zweiteilige Auflösung der Rückstellung.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Soll und Haben sind vertauscht — die Rückstellung nimmt ab (Soll), nicht die Bank zu.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Nur 15'000 werden bezahlt — die restlichen 5'000 fliessen nicht zur Bank, sondern in den a.o. Ertrag.` },
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

  console.log(`Session 29: ${done} verarbeitet, total ${state.verarbeitet}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
