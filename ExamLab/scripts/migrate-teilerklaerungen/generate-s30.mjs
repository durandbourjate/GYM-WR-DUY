#!/usr/bin/env node
/**
 * Session 30: 50 Fragen, alles BWL/mc.
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
    id: '3716de63-2a8d-4df9-ac5d-181a31001ab4',
    fachbereich: 'BWL',
    musterlosung: `Für ein Chemieunternehmen sind umweltorientierte Faktoren (strenge Auflagen für Abgase und Abwasser) sowie material- und rohstofforientierte Faktoren (Rohstoffzugang, Transportkosten) besonders wichtig. Daneben spielen auch verkehrs- und infrastrukturorientierte Faktoren eine Rolle.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Steuern sind ein Faktor unter vielen — «ausschliesslich» ist in der chemischen Industrie zu eng.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die Grundstücksfrage allein genügt nicht — Umwelt- und Rohstoffzugang sind zentraler.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Absatz und Image sind bei B2B-Chemie nachrangig; Umwelt und Rohstoffe überwiegen.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Chemie lebt von Rohstoffzugang und bewegt sich in einem stark regulierten Umweltrahmen.` },
    ],
  },
  {
    id: '3864a297-e2c8-421c-940f-0fdae521ef92',
    fachbereich: 'BWL',
    musterlosung: `Viele Anbieter mit standardisierten Produkten erzeugen hohen Preisdruck und intensive Rivalität. Niedrige Eintrittsbarrieren verstärken den Wettbewerb zusätzlich, weil neue Konkurrenten jederzeit in den Markt drängen können. Die bestehende Rivalität ist damit die dominierende Wettbewerbskraft.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Ersatzprodukte sind eine separate Kraft; die Frage thematisiert gerade neue Anbieter.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Viele Anbieter plus Standardprodukte ist das klassische Merkmal intensiver Rivalität.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Kundenmacht hängt von Konzentration der Abnehmer ab — hier nicht dargestellt.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Lieferantenmacht ist eine andere Kraft und im Text nicht beschrieben.` },
    ],
  },
  {
    id: '398ae1b5-cab5-44a3-8a17-8285dd30a1f5',
    fachbereich: 'BWL',
    musterlosung: `Das Portfolio ist kurzfristig ertragsstark, aber strategisch unausgewogen. Es fehlen Question Marks, die später zu Stars und Cash Cows reifen können. Wenn die aktuellen Stars und Cash Cows verblassen, hat das Unternehmen keinen Produkt-Nachschub und gerät langfristig in Schwierigkeiten.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Poor Dogs sind ertragsschwach — wenige sind gut, nicht ein Mangel.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Profitable Cash Cows sind erwünscht; das Problem ist fehlender Nachschub.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Stars sind wünschenswert; das Problem liegt woanders.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Ohne Question Marks fehlen künftige Stars — das Portfolio hat keine Zukunft.` },
    ],
  },
  {
    id: '39c9622e-4977-41b9-8a3b-4046c1a94073',
    fachbereich: 'BWL',
    musterlosung: `Das Privatkonto ist ein Unterkonto des Eigenkapitalkontos. Es erfasst laufend die Privatbezüge (Entnahmen) und Privateinlagen des Eigentümers während des Geschäftsjahres. Am Jahresende wird der Saldo auf das Eigenkapitalkonto übertragen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Geschäftsspesen sind Aufwand und werden in einem Aufwandkonto erfasst.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Das persönliche Bankkonto des Eigentümers ist kein Geschäftskonto.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Ein Sparkonto wäre ein Aktivkonto — das Privatkonto gehört zum Eigenkapital.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Unterkonto Eigenkapital für Privatbezüge und -einlagen — Lehrbuchdefinition.` },
    ],
  },
  {
    id: '3a849da7-e566-4a50-81dc-650156abcff4',
    fachbereich: 'BWL',
    musterlosung: `Aufwand bezeichnet den Werteverzehr der eingesetzten Produktionsfaktoren, etwa Löhne, Material oder Miete. Er verringert das Eigenkapital und wird in der Erfolgsrechnung als Soll-Buchung erfasst. Sein Gegenstück ist der Ertrag.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Werteverzehr der eingesetzten Inputs ist die Definition von Aufwand.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Wertvermehrung durch Produktion ist Ertrag, nicht Aufwand.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Verkaufseinnahmen sind Erträge, etwa im Konto Warenertrag.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Flüssige Mittel sind Aktivbestände (Kasse, Bank), kein Aufwand.` },
    ],
  },
  {
    id: '3aa3180c-0b92-43dc-8567-617151af1747',
    fachbereich: 'BWL',
    musterlosung: `Der 1. Sektor (Primärsektor) umfasst Land- und Forstwirtschaft, Gartenbau und Fischerei. Er liefert die Rohstoffe und landwirtschaftlichen Produkte. In der Schweiz ist er anteilsmässig klein, aber volkswirtschaftlich und ökologisch wichtig.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Der 2. Sektor umfasst Industrie und verarbeitendes Gewerbe.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Land-, Forstwirtschaft und Fischerei bilden per Definition den Primärsektor.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Einen 4. Sektor gibt es in manchen Quellen, aber Landwirtschaft gehört nicht dazu.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Der 3. Sektor bezeichnet Dienstleistungen.` },
    ],
  },
  {
    id: '3cdf666a-bbad-431c-9cc6-fea1e1dda50e',
    fachbereich: 'BWL',
    musterlosung: `Für die Alti Moschti als Kulturgenossenschaft steht die Kundschaft im Zentrum. Sie erwartet hochstehende Konzerte und Veranstaltungen in einer angenehmen Atmosphäre. Ohne zufriedene Kundschaft verliert die Genossenschaft ihre Existenzgrundlage.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Eine Kulturgenossenschaft ist nicht gewinnorientiert — Steuern sind zweitrangig.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Eine Genossenschaft verfolgt keine Renditemaximierung; Mitglieder suchen kulturelle Teilhabe.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Kultur lebt vom Publikum — die Kundschaft ist die zentrale Anspruchsgruppe.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Konkurrenz ist keine klassische Anspruchsgruppe des Unternehmens.` },
    ],
  },
  {
    id: '3d9ba03f-c96d-4780-850e-b428b83c0888',
    fachbereich: 'BWL',
    musterlosung: `Zum Umlaufvermögen gehören Vermögensteile, die innerhalb eines Jahres in Geld umgewandelt werden: Kasse, Bank, Debitoren, Warenvorrat und Wertschriften. Immobilien sind dagegen langfristig gebunden und zählen zum Anlagevermögen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Kasse ist das flüssigste Mittel und klassisches Umlaufvermögen.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Immobilien sind langfristig gebunden und gehören zum Anlagevermögen.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Debitoren (Forderungen) werden binnen Jahresfrist einkassiert.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Warenvorrat ist zum Verkauf bestimmt und kurzfristig umgesetzt.` },
    ],
  },
  {
    id: '40236881-7e25-43e2-8e7d-4389e1a8a68c',
    fachbereich: 'BWL',
    musterlosung: `Das Bankkonto zeigt das Guthaben des Unternehmens bei der Bank. Guthaben sind Vermögen und gehören daher zu den Aktivkonten. Zunahmen werden im Soll, Abnahmen im Haben gebucht.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Bankguthaben = Vermögen = Aktivkonto.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Ein Ertragskonto erfasst Einnahmen; die Bank zeigt einen Bestand.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Aufwand ist Werteverzehr — ein Bankguthaben ist kein Aufwand.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Passivkonten zeigen Schulden — Bankguthaben ist das Gegenteil.` },
    ],
  },
  {
    id: '4060d766-130c-4b49-bf91-d59178ba845b',
    fachbereich: 'BWL',
    musterlosung: `Bodenknappheit, Rohstoffvorkommen und Klimaerwärmung sind natürliche Gegebenheiten. Sie gehören zur ökologischen Umweltsphäre, die alle Einflüsse aus der natürlichen Umgebung umfasst. Sie wirken immer stärker auf Unternehmensentscheide.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Natürliche Gegebenheiten gehören per Definition zur ökologischen Sphäre.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die soziale Sphäre betrifft Werthaltungen und gesellschaftliche Gruppen.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Die technologische Sphäre umfasst Innovationen und technischen Fortschritt.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Die ökonomische Sphäre betrifft Konjunktur, Arbeitsmarkt und Kaufkraft.` },
    ],
  },
  {
    id: '40996432-b080-4a3d-8c95-1451fdd09f0f',
    fachbereich: 'BWL',
    musterlosung: `Ein Standortfaktor ist ein Kriterium, das bei der Wahl des Unternehmensstandorts eine Rolle spielt. Je nach Unternehmensart können unterschiedliche Faktoren (Verkehr, Absatzmarkt, Steuern, Umwelt) ausschlaggebend sein. Standortfaktoren werden in der Nutzwertanalyse gewichtet verglichen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Standortfaktoren sind Entscheidungskriterien bei der Standortwahl.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die Rechtsform wird separat gewählt und ist unabhängig vom Standort.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Der Gewinn ist ein Ergebnis, nicht ein Kriterium der Standortwahl.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Die Mitarbeiterzahl ist Grössenmerkmal, kein Standortfaktor.` },
    ],
  },
  {
    id: '41797d94-3efc-44b9-932f-434d8f3ffd65',
    fachbereich: 'BWL',
    musterlosung: `Die langfristig bedeutendste Folge war das 1998 einstimmig beschlossene Plattform-Versenkungsverbot der 15 Nordsee-Anrainerstaaten. Der Brent-Spar-Fall gilt als einer der ersten grossen Erfolge von Konsumenten gegen einen Grosskonzern, ausgelöst durch den Greenpeace-Protest.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Shell besteht nach wie vor — der Konzern ging nicht bankrott.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Bestehende Plattformen wurden nicht sofort abgebaut; es ging um das Versenken.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Das 1998 beschlossene Versenkungsverbot ist die dauerhafte rechtliche Folge.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Greenpeace wurde durch den Fall gestärkt, nicht verboten.` },
    ],
  },
  {
    id: '41988018-cf4a-44eb-b62b-c54f20d04edf',
    fachbereich: 'BWL',
    musterlosung: `Die Bank (Aktivkonto) nimmt zu — Soll. Der Bankkredit (Passivkonto, Fremdkapital) nimmt zu — Haben. Es liegt eine Bilanzverlängerung vor, Vermögen und Schulden steigen um denselben Betrag.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Soll und Haben vertauscht — der Bankkredit gehört ins Haben.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Eigenkapital wird durch eine Kreditaufnahme nicht verändert.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Aktiv-Zunahme im Soll, Passiv-Zunahme im Haben — Standardform der Bilanzverlängerung.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Richtung vertauscht — die Bank-Zunahme muss im Soll stehen.` },
    ],
  },
  {
    id: '44340cdb-ef9a-4163-b974-7a14600bc130',
    fachbereich: 'BWL',
    musterlosung: `Das Unternehmen mit dem höchsten Marktanteil wird als Marktführer (oder Marktleader) bezeichnet. Es hat die stärkste Position im Markt und kann Preise, Standards und Trends oft mitprägen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Definitionsgemäss der grösste Marktanteil entspricht dem Marktführer.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Cash Cow ist ein BCG-Begriff — nicht identisch mit Marktführer.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Ein Monopolist ist der einzige Anbieter; Marktführer kann auch Konkurrenz haben.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Marktpionier ist der Erste am Markt, nicht zwingend der Grösste.` },
    ],
  },
  {
    id: '44d9731d-3ac7-42cc-97f0-c337cf141a32',
    fachbereich: 'BWL',
    musterlosung: `Das BCG-Portfolio besteht aus vier Quadranten: Question Marks, Stars, Cash Cows und Poor Dogs. Sie werden nach Marktwachstum und relativem Marktanteil unterschieden. «Rising Stars» gibt es im BCG-Modell nicht.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Stars haben hohes Wachstum und hohen Marktanteil.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Cash Cows haben tiefes Wachstum und hohen Marktanteil.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. «Rising Stars» ist kein BCG-Quadrant — Verwechslung mit Stars.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Poor Dogs haben tiefes Wachstum und tiefen Marktanteil.` },
    ],
  },
  {
    id: '45846b95-2159-4df8-bad2-ff5667053d55',
    fachbereich: 'BWL',
    musterlosung: `Es besteht ein typischer Zusammenhang zwischen BCG und Produktlebenszyklus. Neue Produkte starten als Question Marks (Einführungsphase), werden bei Erfolg zu Stars (Wachstumsphase), dann zu Cash Cows (Reife/Sättigung) und schliesslich zu Poor Dogs (Rückgang).`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Cash Cows sind in der Reife-/Sättigungsphase, nicht in der Einführung.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Stars sind in der Wachstumsphase, nicht im Rückgang.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Es gibt einen klaren Zusammenhang — die Modelle ergänzen sich.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Typischer Entwicklungsweg eines erfolgreichen Produkts im BCG.` },
    ],
  },
  {
    id: '45b1d964-c73f-437b-99d9-3fbd9fc70ee6',
    fachbereich: 'BWL',
    musterlosung: `Der CO₂-Ausstoss des Unternehmens belastet die ökologische Sphäre. Die Gesellschaft reagiert politisch, der Staat erlässt strengere Gesetze (rechtliche Sphäre). Diese Gesetze wirken auf das Unternehmen zurück — eine klassische Wechselwirkungskette über mehrere Sphären.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Die Kette beginnt nicht bei der rechtlichen Sphäre — Auslöser ist das Unternehmen.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die soziale Sphäre steht nicht direkt am Anfang; sie ist hier Mittler zur Politik.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Verursacher Unternehmen — ökologische Folge — rechtliche Reaktion — Rückwirkung.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Weder die ökonomische noch die technologische Sphäre steht im Zentrum dieses Falls.` },
    ],
  },
  {
    id: '4762d5a7-60a9-446c-b97e-c82e8065c603',
    fachbereich: 'BWL',
    musterlosung: `Die Bank (Aktivkonto) nimmt zu — Soll. Das Darlehen (langfristiges Fremdkapital, Passivkonto) nimmt zu — Haben. Es liegt eine Bilanzverlängerung vor, Buchungssatz: Bank an Darlehen 100'000.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Aktiv-Zunahme im Soll, Passiv-Zunahme im Haben.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Eigenkapital ist bei einer Kreditaufnahme nicht betroffen.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Eigenkapital wird durch Kredit nicht verändert; Richtung zudem vertauscht.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Soll und Haben vertauscht — die Bank muss im Soll stehen.` },
    ],
  },
  {
    id: '47e9a567-71c4-4f6b-be85-710c776968e1',
    fachbereich: 'BWL',
    musterlosung: `In der Rückgangsphase wenden sich Kunden neuen Produkten zu. Der Umsatz bricht ein und der Gewinn tendiert gegen null oder es entstehen Verluste. Das Unternehmen zieht sich zurück oder ersetzt die Leistung durch neue Produkte.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Auch bei Konkurrenzrückzug schrumpft der Gesamtmarkt weiter.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Der Umsatz fällt — steigende Umsätze sind Merkmal anderer Phasen.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Werbung lohnt sich in der Rückgangsphase kaum — die Nachfrage ist strukturell weg.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Umsatzrückgang und schwindender Gewinn sind Kennzeichen der Rückgangsphase.` },
    ],
  },
  {
    id: '487c084c-4ca2-4a6f-9b68-fa83b81abe3c',
    fachbereich: 'BWL',
    musterlosung: `Cash Cows zeichnen sich durch einen hohen Marktanteil bei niedrigem Marktwachstum aus. Sie werfen stabile Erträge ab und finanzieren andere Einheiten. In der Regel waren sie früher Stars.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Question Marks haben tiefen Marktanteil und hohes Wachstum.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Poor Dogs haben tiefen Marktanteil und tiefes Wachstum.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Hoher Marktanteil und geringes Wachstum ist genau Cash Cow.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Stars haben hohen Marktanteil bei hohem Wachstum.` },
    ],
  },
  {
    id: '491f5f34-d177-4924-aef9-db29c217a9de',
    fachbereich: 'BWL',
    musterlosung: `Zuerst werden die historischen Daten beschrieben (Beschreibungsmodell), dann werden Muster und Ursachen identifiziert (Erklärungsmodell, z.B. saisonale Schwankungen). Daraus wird schliesslich eine Prognose für Entscheidungen abgeleitet (Entscheidungsmodell). Die drei Modellarten bauen logisch aufeinander auf.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Ein Beschreibungsmodell allein liefert keine Prognose für die Entscheidung.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Vollständige Abfolge der drei Modellarten von der Datenbeschreibung zur Prognose.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Ohne Entscheidungsmodell fehlt der finale Schritt zur Prognose.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Ohne Beschreibung und Erklärung fehlt die Datenbasis für ein Entscheidungsmodell.` },
    ],
  },
  {
    id: '49586383-1d5b-46e3-9935-a0a6aa303c83',
    fachbereich: 'BWL',
    musterlosung: `Bei einer Warenrückgabe wird der Warenverkauf (Ertragskonto) im Soll belastet — also reduziert. Die Debitoren (Aktivkonto, Forderung) nehmen im Haben ab. Buchungssatz: Warenverkauf an Debitoren 2'000 — Umkehrung der ursprünglichen Verkaufsbuchung.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Ertrag zurücknehmen (Soll) und Forderung reduzieren (Haben).` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Das wäre die ursprüngliche Verkaufsbuchung, nicht die Rücknahme.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Die Rückgabe erfolgt gegenüber Debitoren (Rechnung), nicht aus der Kasse.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Wareneinkauf betrifft Lieferanten, nicht eine Kundenretoure.` },
    ],
  },
  {
    id: '4a13d90b-3d4c-4658-802f-94e2394ac948',
    fachbereich: 'BWL',
    musterlosung: `Das Marketingkonzept umfasst vier Schritte: Markt- und Leistungsanalyse, Marktforschung, Produkt- und Marktziele sowie Marketing-Mix. Personalplanung gehört zum Personalmanagement und ist nicht Teil des Marketingkonzepts.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Marktforschung ist der zweite Schritt des Marketingkonzepts.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Personalplanung ist Teil des Personalmanagements, nicht des Marketingkonzepts.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Der Marketing-Mix (4P) ist der vierte Schritt.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Markt- und Leistungsanalyse ist der erste Schritt.` },
    ],
  },
  {
    id: '4a1e7eb3-4536-4b7e-ac1d-8e971fc7bc9b',
    fachbereich: 'BWL',
    musterlosung: `Bei der Konkurrenzanalyse interessieren: charakteristische Merkmale und Marketinginstrumente der Konkurrenten, ihre Stärken und Schwächen im Vergleich zum eigenen Unternehmen sowie mögliche neue Konkurrenten. Privates der Geschäftsführung ist irrelevant.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Merkmale und Marketinginstrumente sind Kernbestandteil der Konkurrenzanalyse.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Der Stärken-Schwächen-Vergleich ist strategisch zentral.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Privates gehört nicht zur Wettbewerbsanalyse und berührt Persönlichkeitsrechte.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Potenzielle neue Konkurrenten sind für die Früherkennung wichtig.` },
    ],
  },
  {
    id: '4b54694a-952c-4145-8b92-fe314e435014',
    fachbereich: 'BWL',
    musterlosung: `Der Lohnaufwand gehört in das alte Jahr, wurde aber noch nicht bezahlt. Der Aufwand muss abgegrenzt werden: Lohnaufwand im Soll gegen Transitorische Passiven im Haben. Die TP zeigen die noch offene Verpflichtung gegenüber den Mitarbeitenden.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Transitorische Aktiven wären bei vorausbezahltem Aufwand — hier ist der Aufwand aber noch offen.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die Zahlung per Bank ist noch nicht erfolgt; zum Jahresende wird abgegrenzt, nicht gezahlt.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Noch nicht bezahlter Aufwand alter Periode wird gegen TP abgegrenzt.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Richtung vertauscht — der Aufwand muss im Soll stehen.` },
    ],
  },
  {
    id: '4f45e555-c51a-4463-9ac4-a9039143aecb',
    fachbereich: 'BWL',
    musterlosung: `Eine Produktionsverlagerung ins Ausland betrifft direkt die Mitarbeitenden (drohender Arbeitsplatzverlust), den Staat (Rückgang von Steuereinnahmen und Arbeitsplätzen) und lokale Lieferanten (Verlust von Aufträgen). Andere Gruppen sind indirekt betroffen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Die Konkurrenz ist nicht primär betroffen; sie reagiert erst auf Marktveränderungen.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Aktionäre profitieren oft kurzfristig — sie sind nicht die Hauptbetroffenen.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Das Produkt bleibt am Markt — Kunden sind nicht primär betroffen.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Mitarbeitende, Staat und Lieferanten spüren die Auswirkungen am direktesten.` },
    ],
  },
  {
    id: '51da0f76-db96-4cc0-804c-c267bcdc7fe1',
    fachbereich: 'BWL',
    musterlosung: `Eine Rückstellung für einen hängigen Rechtsstreit erfasst eine ungewisse Verbindlichkeit. Der Aufwand wird im Soll gebucht (Prozessaufwand), die Rückstellung als Passivkonto im Haben. So belastet die Rückstellung das alte Jahr korrekt.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Aufwand im Soll, Rückstellung (Passivum) im Haben.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Bei der Bildung wird nichts ausbezahlt — es ist eine reine Bewertung.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Die Bank ist nicht betroffen, weil keine Zahlung erfolgt.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Richtung vertauscht — Rückstellungen im Soll wären deren Auflösung.` },
    ],
  },
  {
    id: '52319f3d-93ea-4669-90d0-39333322da66',
    fachbereich: 'BWL',
    musterlosung: `Das Grundproblem der Wirtschaft ist: Menschliche Bedürfnisse sind praktisch unbegrenzt, die Ressourcen zu deren Befriedigung (Geld, Rohstoffe, Zeit) aber begrenzt. Dieses Spannungsfeld ist die Ursache der Knappheit und begründet das Wirtschaften.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Knappheit ist fundamentaler und entsteht nicht erst durch staatliche Regulierung.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Kerndefinition der ökonomischen Knappheit.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Knappheit ist universell und betrifft auch reiche Länder (Zeit, Boden, Umwelt).` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Das Verhältnis ist umgekehrt — Bedürfnisse unbegrenzt, Mittel begrenzt.` },
    ],
  },
  {
    id: '5402a6e3-39ea-4903-b80b-760791bcfe18',
    fachbereich: 'BWL',
    musterlosung: `Die Nutzwertanalyse ist ein Entscheidungsinstrument. Gemeinsame Kriterien werden definiert und gewichtet (total 100%), dann wird jeder Standort je Kriterium bewertet (z.B. 1-6). Der Standort mit der höchsten gewichteten Punktzahl erhält den Zuschlag.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Kundennachfrage ist höchstens ein Kriterium, nicht das Verfahren selbst.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Gewichtete Kriterienbewertung ist das Kernmerkmal der NWA.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Mietkosten sind nur eines von vielen möglichen Kriterien.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Gewinn wird nicht berechnet — die NWA vergibt Punkte für Standortqualität.` },
    ],
  },
  {
    id: '5609ad94-6ec3-4001-a581-186c95e237c5',
    fachbereich: 'BWL',
    musterlosung: `Die Unternehmensanalyse durchleuchtet die internen Rahmenbedingungen. Ziel ist, Stärken und Schwächen zu erkennen und jene Fähigkeiten zu bestimmen, die das Unternehmen von anderen abheben — sogenannte strategische Erfolgspotenziale.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Ein Businessplan ist ein Dokument für Kapitalgeber, nicht der Zweck der Analyse.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Interne Stärken und Schwächen sind genau das Kernziel.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Konkurrenz analysieren gehört zur externen Umweltanalyse.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Rekrutierung ist operative Personalarbeit, nicht Strategieanalyse.` },
    ],
  },
  {
    id: '57da95ad-b42f-42c3-aeb5-34d224080772',
    fachbereich: 'BWL',
    musterlosung: `Absatz-, verkehrs- und infrastrukturorientierte Faktoren sind anerkannte Standortfaktoren. Weitere sind material-/rohstoff-, arbeits-, grundstück-, umwelt- und abgabeorientierte Faktoren. Persönliche Vorlieben wie eine Lieblingsfarbe sind keine objektiven Kriterien.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Die Nähe zur Kundschaft ist ein klassischer Standortfaktor.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Verkehrsanbindung ist ein zentraler Standortfaktor, vor allem für Logistik.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Persönliche Vorlieben sind subjektiv und keine anerkannten Standortfaktoren.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Infrastruktur (Strom, Wasser, IT) ist ein anerkannter Standortfaktor.` },
    ],
  },
  {
    id: '5921df82-2217-46fe-b10d-36228577487f',
    fachbereich: 'BWL',
    musterlosung: `In der sozialen Umweltsphäre werden Einflüsse aus dem Zusammenleben und den Werthaltungen der Menschen betrachtet: z.B. Sonntagsverkauf, Gleichstellung, Kindertagesstätten oder Offenheit gegenüber anderen Ländern. Sie beeinflusst Konsumverhalten und Akzeptanz unternehmerischer Entscheide.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Werthaltungen und gesellschaftliche Einstellungen gehören zur sozialen Sphäre.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die ökonomische Sphäre umfasst Konjunktur, Arbeitsmarkt und Kaufkraft.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Die rechtliche Sphäre betrifft Gesetze und Normen, nicht Werthaltungen.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Die ökologische Sphäre betrifft natürliche Gegebenheiten wie Klima und Rohstoffe.` },
    ],
  },
  {
    id: '59e92aa8-0221-4c08-87c6-89ae3dccc177',
    fachbereich: 'BWL',
    musterlosung: `Der Produktlebenszyklus gliedert sich in fünf Phasen: Einführung, Wachstum, Reife, Sättigung und Rückgang. Sie beschreiben den typischen Verlauf von Umsatz und Gewinn über die Zeit.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Allgemeine Begriffe — nicht die fachlich definierten Phasen.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Das sind eher Produktentwicklungsschritte, kein Marktlebenszyklus.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Allgemeiner Wertschöpfungsprozess, kein Produktlebenszyklus.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Standarddefinition der fünf Phasen des Produktlebenszyklus.` },
    ],
  },
  {
    id: '5a677c2b-e3c5-453e-bde9-3b9f9790ca6d',
    fachbereich: 'BWL',
    musterlosung: `Eine Bilanzverlängerung ohne Erfolgskonto entsteht, wenn ein Aktivkonto und ein Passivkonto gleichzeitig zunehmen. Beispiel: Kauf von Mobilien auf Rechnung — Mobilien (Aktiv, Soll) und Kreditoren (Passiv, Haben) nehmen zu. Es ist kein Erfolgskonto berührt.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Aktiv-Zunahme und Passiv-Zunahme ohne Erfolgswirkung.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Mietaufwand ist ein Erfolgskonto — damit wäre ein Erfolgskonto betroffen.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Lohnaufwand ist ein Erfolgskonto — und die Bank nimmt ab, nicht zu.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Warenverkauf ist ein Erfolgskonto (Ertrag) — somit ist ein Erfolgskonto betroffen.` },
    ],
  },
  {
    id: '5d9ab599-fdc6-445c-9126-498734aecc32',
    fachbereich: 'BWL',
    musterlosung: `Der Warenvorrat hat abgenommen: 35'000 − 28'000 = 7'000. Der Wareneinkauf (Aufwandkonto) erhöht sich im Soll, der Warenvorrat (Aktivkonto) nimmt im Haben ab. Buchungssatz: Wareneinkauf an Warenvorrat 7'000.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Bestandesabnahme wird dem Wareneinkauf als Aufwand zugeschlagen.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. «Erfolgsrechnung» ist kein Buchungskonto, sondern eine Sammelbezeichnung.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Warenverkauf ist Ertragskonto; hier entsteht aber ein Aufwand.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Richtung vertauscht — die Aktiv-Abnahme muss im Haben stehen.` },
    ],
  },
  {
    id: '5da64f0b-aed9-4be1-9c0b-a26549a68fbd',
    fachbereich: 'BWL',
    musterlosung: `Unternehmen lassen sich nach mehreren Kriterien unterscheiden: Sektor/Branche, Eigentumsverhältnisse, Gewinnorientierung, Grösse, Reichweite und Rechtsform. Alle genannten Kriterien sind in der BWL anerkannt.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Sektor (primär, sekundär, tertiär) und Branche sind zentrale Einteilungen.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Privat/öffentlich/gemischt und gewinnorientiert/NPO sind wichtige Unterscheidungen.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Von Mikro bis Grossunternehmen und von lokal bis international.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Die Rechtsform (EU, AG, GmbH, Genossenschaft) ist formales Unterscheidungskriterium.` },
    ],
  },
  {
    id: '61098989-5607-404a-a5a9-d47dc743d537',
    fachbereich: 'BWL',
    musterlosung: `Aufwandkonten erfassen den Werteverzehr im Produktionsprozess: Lohnaufwand, Mietaufwand und Abschreibungen sind typische Aufwandkonten. Warenverkauf ist dagegen ein Ertragskonto — er erfasst die Wertvermehrung durch den Verkauf.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Löhne sind Werteverzehr = Aufwand.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Warenverkauf bringt Ertrag, ist also ein Ertragskonto.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Miete ist Werteverzehr = Aufwand.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Abschreibungen erfassen den Werteverzehr des Anlagevermögens.` },
    ],
  },
  {
    id: '6383576e-ff2a-4507-a099-55d4534a3fac',
    fachbereich: 'BWL',
    musterlosung: `Die NWA hat drei typische Schwächen: die Bewertung ist subjektiv, die Vergleichbarkeit der Standorte ist nicht immer gegeben, und bei mehreren Entscheidungsträgern ist die Einigung auf Gewichtungen schwierig. Trotzdem liefert sie keine grundsätzlich falschen Ergebnisse.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Subjektive Bewertung ist eine anerkannte Schwäche der NWA.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Unterschiedliche Standortsituationen erschweren die Vergleichbarkeit.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Mehrere Entscheidungsträger müssen sich auf Gewichtungen einigen — oft schwierig.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Die NWA hilft zu objektivieren — sie liefert keine grundsätzlich falschen Ergebnisse.` },
    ],
  },
  {
    id: '64852648-2994-42f7-84c9-d02754456de5',
    fachbereich: 'BWL',
    musterlosung: `Für ein Start-up, das den Markt noch nicht kennt, ist die Markt- und Leistungsanalyse besonders kritisch. Ohne Marktkenntnis besteht die Gefahr, am Markt vorbei zu produzieren und knappe Ressourcen falsch einzusetzen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Ziele ohne Marktkenntnis zu formulieren wäre ein Blindflug.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Ein Marketing-Mix ohne Marktkenntnis greift ins Leere.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Bei knappem Budget und fehlender Marktkenntnis ist die Analyse kritischer als die anderen Schritte.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Ohne Marktkenntnis ist kein sinnvoller Markteintritt möglich.` },
    ],
  },
  {
    id: '650b3740-d279-48da-9304-f22b78b4fc67',
    fachbereich: 'BWL',
    musterlosung: `Der relative Marktanteil zeigt die Position im Vergleich zum stärksten Konkurrenten. Er ist besonders aussagekräftig, wenn viele Anbieter kleine absolute Anteile haben, wenn die Wettbewerbsposition interessiert oder wenn der absolute Marktanteil wenig aussagt. Bei einem Monopol ist er nicht sinnvoll berechenbar.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Viele kleine Anbieter machen den absoluten Marktanteil wenig aussagekräftig.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Der relative Marktanteil zeigt die Position gegenüber dem stärksten Konkurrenten.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Bei Monopol gibt es keinen Wettbewerber — die Formel ist nicht anwendbar.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Dann ergänzt der relative Marktanteil den absoluten sinnvoll.` },
    ],
  },
  {
    id: '655c77dd-de25-43bc-b789-1b05362aab8f',
    fachbereich: 'BWL',
    musterlosung: `Die Strategiekontrolle erfolgt auf drei Ebenen: Kontrolle der zugrunde liegenden Annahmen, Kontrolle der Umsetzung und Kontrolle der Wirksamkeit (Soll-Ist-Vergleich). So wird sichergestellt, dass die Strategie valide bleibt und ihre Ziele erreicht. Mitarbeiterleistung gehört ins operative Controlling.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Annahmen werden geprüft, ob sie noch gelten.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Umsetzungsschwierigkeiten und Widerstände werden erfasst.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Der Soll-Ist-Vergleich prüft die Zielerreichung.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Mitarbeiterleistung ist operatives Controlling, nicht Strategiekontrolle.` },
    ],
  },
  {
    id: '655fcdf9-7634-478b-a811-aa6cf5a2bab6',
    fachbereich: 'BWL',
    musterlosung: `Marktsegmentierung bedeutet, den Gesamtmarkt in Teilmärkte (Marktsegmente) aufzuteilen. Die Segmente bestehen aus Konsumenten, die sich anhand ausgewählter Kriterien (Alter, Einkommen, Lifestyle) ähnlich verhalten.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Gewinnaufteilung ist interne Rechnungslegung, nicht Marktsegmentierung.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Geografische Expansion ist eine Wachstumsstrategie, kein Segmentierungsbegriff.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Definitionsgemässe Teilmarktbildung nach ausgewählten Kriterien.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Marktanteilsberechnung ist eine separate Kennzahl.` },
    ],
  },
  {
    id: '65f38c3b-402e-4aba-ab1c-6e12c31c0731',
    fachbereich: 'BWL',
    musterlosung: `Die Verhandlungsmacht der Kunden beschreibt, ob Kunden Preisdruck ausüben können und wie leicht sie zur Konkurrenz wechseln. Je höher diese Macht, desto schwieriger ist es für das Unternehmen, hohe Preise durchzusetzen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Einkaufsmacht und Wechselbereitschaft sind die Kernmerkmale im 5-Kräfte-Modell.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Zahlungsfähigkeit ist ein anderes Konzept (Marktpotenzial).` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Die Kundenzahl allein sagt wenig über Verhandlungsmacht aus.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Zufriedenheit betrifft eine andere Dimension — Kundenzufriedenheitsforschung.` },
    ],
  },
  {
    id: '66bcfe8a-24f0-4cbd-8f03-fb2c3e50870d',
    fachbereich: 'BWL',
    musterlosung: `Beim Wareneinkauf auf Rechnung nimmt der Wareneinkauf (Aufwandkonto) im Soll zu, und die Kreditoren (Passivkonto) nehmen im Haben zu. Aufwand und Fremdkapital steigen gleichzeitig.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Wareneinkauf ist Aufwand, kein Aktivkonto.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Aufwand im Soll, Kreditoren (Passiv) im Haben.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Kein Aktivkonto betroffen; Kreditoren sind ein Passivkonto.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Kein Ertrag — es entsteht Aufwand für bezogene Ware.` },
    ],
  },
  {
    id: '66cd9d50-64e3-410a-842e-0f9834b39c9a',
    fachbereich: 'BWL',
    musterlosung: `Der Verkaufspreis (15'000) übersteigt den Buchwert (12'000) um 3'000. Zuerst Ausbuchung zum Buchwert (Bank an Fahrzeuge 12'000), dann wird der Gewinn als ausserordentlicher Ertrag erfasst (Bank an a.o. Ertrag 3'000).`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Dann würde der Gewinn nicht erfasst — das Fahrzeug hätte scheinbar 15'000 gekostet.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Abschreibung erfasst laufende Wertminderung, nicht einen Verkaufsgewinn.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Ausbuchung zum Buchwert plus a.o. Ertrag für den Überschuss.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Richtung vertauscht — die Bank empfängt das Geld, also Soll.` },
    ],
  },
  {
    id: '67d54631-046b-4175-a8c5-faa291dd97d0',
    fachbereich: 'BWL',
    musterlosung: `Transitorische Passiven entstehen, wenn ein Aufwand des alten Jahres noch nicht bezahlt ist, oder wenn ein Ertrag im alten Jahr erhalten wurde, aber das neue Jahr betrifft. Sie gehören zum Fremdkapital und zeigen offene Verpflichtungen oder vorauskassierte Leistungen.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Nicht jede kurzfristige Schuld ist TP — etwa Kreditoren sind eigene Kategorie.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Vorausbezahlte Aufwände sind Transitorische Aktiven (TA).` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Genau die zwei Entstehungsfälle von TP.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Abschreibungen sind Werteverzehr am Anlagevermögen, keine TP.` },
    ],
  },
  {
    id: '6992ccb2-eaa1-4fc4-8172-0205225d67ac',
    fachbereich: 'BWL',
    musterlosung: `Die Fähigkeitsanalyse untersucht interne Bereiche: Marketing, Produktion, F&E, Finanzen, Personal, Führung, Innovationsfähigkeit, Know-how und Synergien. Politische Rahmenbedingungen gehören zur externen Umweltanalyse, nicht zur Fähigkeitsanalyse.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Richtig. Marketing, Produktion und F&E sind Kernbereiche operativer Fähigkeiten.` },
      { feld: 'optionen', id: 'opt-1', text: `Richtig. Finanzen, Personal und Führung gehören zur internen Ressourcenbasis.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Politik ist extern und wird in der Umweltanalyse behandelt.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Innovation, Know-how und Synergien sind interne Erfolgspotenziale.` },
    ],
  },
  {
    id: '6be9af37-88cf-4e63-9727-129258848a1c',
    fachbereich: 'BWL',
    musterlosung: `Die Bank (Aktivkonto) nimmt zu — Soll. Die Kasse (Aktivkonto) nimmt ab — Haben. Es ist ein Aktivtausch: Die Bilanzsumme bleibt unverändert, nur die Verteilung innerhalb des Vermögens ändert sich.`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Eigenkapital ist bei einer internen Geldumlagerung nicht betroffen.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Richtung vertauscht — die Bank empfängt, muss also im Soll stehen.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Aktiv-Zunahme Bank Soll, Aktiv-Abnahme Kasse Haben.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Kreditoren werden bei einem Kasse-Bank-Transfer nicht berührt.` },
    ],
  },
  {
    id: '6c299eb0-84c2-492c-9e7a-2927af89427b',
    fachbereich: 'BWL',
    musterlosung: `Die Migros ist eine der grössten Abnehmerinnen im Schweizer Detailhandel. Ihre Grösse gibt ihr eine starke Verhandlungsposition gegenüber den Lieferanten — sie kann Preise und Konditionen mitbestimmen. Dies führt teilweise zu Protesten (z.B. bei Landwirten).`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. «Bester Preis» ist keine ökonomische Erklärung der Verhandlungsmacht.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Die Migros hat sehr viele Lieferanten aus unterschiedlichen Branchen.` },
      { feld: 'optionen', id: 'opt-2', text: `Falsch. Es gibt keine Gesetze, die Verhandlungsmacht fixieren.` },
      { feld: 'optionen', id: 'opt-3', text: `Richtig. Die Grösse der Migros gibt ihr Nachfragemacht gegenüber Lieferanten.` },
    ],
  },
  {
    id: '6d03faab-776d-4c6d-ab3d-88bd8d0dd582',
    fachbereich: 'BWL',
    musterlosung: `Ein Unternehmen kann gegenüber seiner Umwelt drei grundsätzliche Verhaltensweisen einnehmen: Beharren (am Bestehenden festhalten), Reaktion (auf Veränderungen reagieren) und Aktion (proaktiv Veränderungen vorantreiben).`,
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: `Falsch. Das sind Wachstumsstrategien, keine grundsätzlichen Verhaltensweisen.` },
      { feld: 'optionen', id: 'opt-1', text: `Falsch. Das sind quantitative Unternehmensentwicklungen, nicht Verhaltensweisen.` },
      { feld: 'optionen', id: 'opt-2', text: `Richtig. Beharren, Reaktion und Aktion sind die drei klassischen Verhaltensweisen.` },
      { feld: 'optionen', id: 'opt-3', text: `Falsch. Das sind Führungsfunktionen, keine Umwelt-Verhaltensweisen.` },
    ],
  },
]

async function main() {
  const state = JSON.parse(await fs.readFile(STATE, 'utf8'))
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

  console.log(`Session 30: ${done} verarbeitet, total ${state.verarbeitet}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
