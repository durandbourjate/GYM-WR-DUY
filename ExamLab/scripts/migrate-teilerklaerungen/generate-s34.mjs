#!/usr/bin/env node
// Session 34 — 43 BWL/mc + 7 BWL/richtigfalsch
// R/F aussagen haben keine IDs -> teilerklaerungen bleibt leer

import fs from 'node:fs';

const UPDATES = [
  // 1. e1d64a3a — Bestandeszunahme Waren 7'000 (mc)
  {
    id: 'e1d64a3a-ee5a-495f-ae4f-e4e2579465be',
    fachbereich: 'BWL',
    musterlosung: 'Die Bestandeszunahme beträgt 42\'000 minus 35\'000 gleich 7\'000 Franken. Der Warenvorrat (Aktivkonto) nimmt zu und steht im Soll, der Wareneinkauf (Aufwandkonto) wird im Haben korrigiert. Der Buchungssatz lautet: Warenvorrat an Wareneinkauf 7\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Ausgleich erfolgt mit dem Wareneinkauf, nicht direkt mit der Erfolgsrechnung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Umgekehrter Buchungssatz — das würde eine Bestandesabnahme buchen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Warenverkauf ist Ertragskonto, die Bestandeskorrektur läuft über den Wareneinkauf.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Aktivzunahme im Soll, Aufwandskorrektur im Haben.' },
    ],
  },
  // 2. e22275ae — Aldi Denner Lidl Preisstrategie (mc)
  {
    id: 'e22275ae-4a43-4c1b-8fb3-782712a1d1cb',
    fachbereich: 'BWL',
    musterlosung: 'Eine aggressive Preisstrategie (Kostenführerschaft) setzt voraus, dass das Unternehmen seine Kosten dauerhaft tief halten kann. Sonst würde es unter den Herstellkosten verkaufen. Discounter erreichen dies durch Standardisierung, hohe Stückzahlen und schlanke Prozesse.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Nur wer die Kosten strukturell tief hält, kann dauerhaft tiefe Preise setzen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Kostenführer setzen auf Standardisierung, nicht auf innovative Produkte.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Ein Premiumimage widerspricht der Preisstrategie — das wäre Differenzierung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Discounter brauchen viele Filialen für hohe Stückzahlen.' },
    ],
  },
  // 3. e2496f10 — SWOT Stärken-Chancen (mc)
  {
    id: 'e2496f10-8d75-4e0b-9a53-24979dc43f29',
    fachbereich: 'BWL',
    musterlosung: 'Die Kombination «Stärken treffen auf Chancen» ist der Idealfall der SWOT-Matrix. Das Unternehmen nutzt seine vorhandenen Stärken, um sich bietende Chancen optimal auszuschöpfen. Diese SO-Strategie führt zu gezieltem Wachstum.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Stärken werden eingesetzt, um Chancen maximal zu nutzen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Schwächen und Gefahren abbauen ist die WT-Strategie.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gefahren durch Stärken abwehren ist die ST-Strategie.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Schwächen zu Stärken umwandeln ist die WO-Strategie.' },
    ],
  },
  // 4. e266be4b — Gewinnzunahme Kontenkombination (mc)
  {
    id: 'e266be4b-82d5-45b9-96d2-85f3590decb6',
    fachbereich: 'BWL',
    musterlosung: 'Der Gewinn steigt, wenn Erträge höher sind als Aufwände. Eine Zunahme eines Ertragskontos (Haben) erhöht den Gewinn direkt. Typisches Beispiel: Debitoren an Warenverkauf — Aktivzunahme bei gleichzeitiger Ertragszunahme.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Aktivzunahme plus Ertragszunahme ist ein Umsatzgeschäft, der Gewinn steigt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das beschreibt einen Aktivtausch/Passivabbau ohne Erfolgswirkung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Aktivmehrung plus Passivmehrung ist erfolgsunwirksam (Bilanzverlängerung).' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Aufwandszunahme reduziert den Gewinn, statt ihn zu erhöhen.' },
    ],
  },
  // 5. e28e473c — NPO Kennzeichen (mc)
  {
    id: 'e28e473c-e376-43ba-8695-4b726bfdd184',
    fachbereich: 'BWL',
    musterlosung: 'Bei Non-Profit-Organisationen steht nicht die Gewinnerzielung im Vordergrund, sondern gemeinnützige, soziale, kulturelle oder wissenschaftliche Ziele. Beispiele sind die Rega oder die Krebsliga Schweiz. NPOs dürfen Umsatz und Überschüsse erzielen, nutzen diese aber für den Vereinszweck.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: NPOs können Umsatz erzielen, er fliesst aber in den Zweck statt zu Eigentümern.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Die Bedürfnisbefriedigung steht vor der Gewinnerzielung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: NPOs gibt es auch als private Vereine und Stiftungen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: NPOs dürfen Personal anstellen, z.B. die Rega hat angestellte Piloten.' },
    ],
  },
  // 6. e2cff0c9 — Roche relativer Marktanteil 0.93 (mc)
  {
    id: 'e2cff0c9-8169-4013-acd2-5d874b01736d',
    fachbereich: 'BWL',
    musterlosung: 'Ein relativer Marktanteil von 0.93 bedeutet, dass Roche 93 Prozent des Anteils des Marktführers erreicht. Die beiden Spitzenanbieter liegen damit sehr nahe beieinander. Der Pharma-Markt ist stark umkämpft, ohne dass ein einzelner Anbieter klar dominiert.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Werte nahe 1.0 zeigen einen Gleichstand statt klare Dominanz.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der relative Marktanteil sagt nichts über den absoluten Anteil aus.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Ein Monopol hätte einen extrem hohen relativen Marktanteil weit über 1.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bei grossem Vorsprung des Marktführers wäre der Wert deutlich unter 1.' },
    ],
  },
  // 7. e38b1651 — Produktlebenszyklus Mix (mc)
  {
    id: 'e38b1651-2d76-4771-bc48-7da670c1b0db',
    fachbereich: 'BWL',
    musterlosung: 'Ein Unternehmen muss Produkte in verschiedenen Phasen des Lebenszyklus halten, damit die Geldflüsse ausgeglichen bleiben. Cash Cows in Reife und Sättigung finanzieren neue Produkte in Einführung und Wachstum. So steht nie das ganze Sortiment gleichzeitig vor dem Ende.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Steuerbehörde macht keine Vorgaben zur Produktstreuung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Sortimentsbreite ist kein Argument für Lebenszyklus-Verteilung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Produktlebenszyklus ist ein Modell, keine formale Vorschrift.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Die Geldflüsse müssen sich gegenseitig tragen, damit kein Finanzierungsloch entsteht.' },
    ],
  },
  // 8. e49b2602 — Erfolgswirksame Buchungssätze (mc, Multi)
  {
    id: 'e49b2602-dea0-4413-9fb6-5674e86eab29',
    fachbereich: 'BWL',
    musterlosung: 'Erfolgswirksam ist ein Buchungssatz, der ein Erfolgskonto (Aufwand oder Ertrag) berührt. Lohnaufwand an Bank senkt den Gewinn, Debitoren an Warenverkauf erhöht ihn. Bank an Debitoren und Mobilien an Kreditoren sind reine Bilanzbuchungen ohne Gewinnauswirkung.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Lohnaufwand ist Aufwandkonto — der Gewinn sinkt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Reiner Aktivtausch (Bank/Debitoren), Gewinn bleibt unverändert.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Warenverkauf ist Ertragskonto — der Gewinn steigt.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Aktiv- und Passivzunahme ohne Erfolgskonto — erfolgsunwirksam.' },
    ],
  },
  // 9. e4ef257f — Hypothek 50'000 per Bank (mc)
  {
    id: 'e4ef257f-5ffc-4a39-aab6-4294bcfac600',
    fachbereich: 'BWL',
    musterlosung: 'Die Hypothek ist ein Passivkonto, ihre Abnahme steht im Soll. Die Bank ist ein Aktivkonto, ihre Abnahme steht im Haben. Der Buchungssatz lautet Hypothek an Bank 50\'000 — Aktiven und Passiven nehmen gleichermassen ab (Bilanzverkürzung).',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das Eigenkapital wird nicht verändert, nur Fremdkapital und Bank.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Umgekehrter Buchungssatz — das wäre eine Hypothekenaufnahme.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Hypothek und Eigenkapital sind zwar beide passiv, aber nicht direkt verknüpft.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Passivabnahme im Soll, Aktivabnahme im Haben.' },
    ],
  },
  // 10. e57a8260 — Zunahmen Soll (mc, Multi)
  {
    id: 'e57a8260-3c74-4b29-a257-91d65349fe40',
    fachbereich: 'BWL',
    musterlosung: 'Aktivkonten und Aufwandkonten nehmen im Soll (links) zu. Passivkonten und Ertragskonten nehmen im Haben (rechts) zu. Der Merksatz lautet: Aktiv und Aufwand gleich Soll-Zunahme, Passiv und Ertrag gleich Haben-Zunahme.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Aktivkonten nehmen im Soll zu.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Passivkonten nehmen im Haben zu, nicht im Soll.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Aufwandkonten verhalten sich wie Aktivkonten — Zunahme im Soll.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Ertragskonten nehmen im Haben zu, nicht im Soll.' },
    ],
  },
  // 11. e5880f77 — Bilanzkonten zwei Kontentypen (mc)
  {
    id: 'e5880f77-27bf-4f03-afb6-c40187ca2cb2',
    fachbereich: 'BWL',
    musterlosung: 'Bilanzkonten sind Aktivkonten und Passivkonten. Sie haben einen Anfangsbestand und werden von Jahr zu Jahr übertragen. Aufwand- und Ertragskonten sind Erfolgskonten und beginnen jedes Jahr bei null.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ertragskonten gehören zu den Erfolgskonten, nicht zur Bilanz.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Aufwandkonten sind Erfolgskonten, nicht Bilanzkonten.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Aufwand und Ertrag bilden zusammen die Erfolgsrechnung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Aktiv- und Passivkonten sind die beiden Bilanzkonten.' },
    ],
  },
  // 12. e716f4cd — Eröffnung Aktivkonto (mc)
  {
    id: 'e716f4cd-f93a-4b4d-aa96-eb318176a546',
    fachbereich: 'BWL',
    musterlosung: 'Aktivkonten werden mit dem Satz Aktivkonto an Eröffnungsbilanz eröffnet. Der Anfangsbestand wird auf der Sollseite des Aktivkontos erfasst. Die Eröffnungsbilanz nimmt als technisches Hilfskonto die Gegenbuchung im Haben auf.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Bank an Eröffnungsbilanz buchtet den AB ins Soll des Aktivkontos.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Schlussbilanz betrifft den Jahresabschluss, nicht die Eröffnung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Umgekehrter Buchungssatz — der AB stünde dann im Haben und wäre falsch.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Erfolgsrechnung spielt bei Bilanzkonten keine Rolle.' },
    ],
  },
  // 13. e887ac4f — Darlehen 20'000 per Bank (mc)
  {
    id: 'e887ac4f-1c52-49fc-b041-ca36fc0681bd',
    fachbereich: 'BWL',
    musterlosung: 'Das Darlehen ist ein Passivkonto, seine Abnahme steht im Soll. Die Bank ist ein Aktivkonto, ihre Abnahme steht im Haben. Der Buchungssatz lautet Darlehen an Bank 20\'000 — beide Bilanzseiten nehmen gleichzeitig ab (Bilanzverkürzung).',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Aussage beschreibt Zunahmen, nicht die tatsächliche Rückzahlung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Zunahmen widersprechen einer Rückzahlung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Passivabnahme im Soll, Aktivabnahme im Haben.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Seiten sind vertauscht, passt nicht zur Rückzahlung.' },
    ],
  },
  // 14. ea235388 — Wareneinkauf reduzieren (mc, Multi)
  {
    id: 'ea235388-4958-4917-bae2-c9f657eada78',
    fachbereich: 'BWL',
    musterlosung: 'Rabatte, Skonti und Rücksendungen reduzieren den Wareneinkauf und werden im Haben des Kontos Wareneinkauf gebucht. Bezugsspesen erhöhen dagegen den Einstandswert und stehen im Soll. Der Saldo des Wareneinkaufs entspricht dem effektiven Einstandswert der Waren.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Lieferantenrabatte reduzieren den Einstandspreis — Haben-Buchung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Bezugsspesen erhöhen den Einstandswert, stehen im Soll.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Skonti sind Preisnachlässe und reduzieren den Wareneinkauf.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Zurückgesandte Waren reduzieren den Einstandswert.' },
    ],
  },
  // 15. ead6e6d5 — Lebenszyklus Höhepunkt Reife (mc)
  {
    id: 'ead6e6d5-b901-440d-adeb-3f33677b0868',
    fachbereich: 'BWL',
    musterlosung: 'In der Reifephase erreichen Absatzmenge und Gewinnkurve ihren Höhepunkt. Der Markt zeigt ein hohes Volumen, viele Wettbewerber und stabile Strukturen. Danach folgen Sättigung und Rückgang.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: In der Wachstumsphase steigt der Umsatz noch, der Höhepunkt kommt später.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Einführungsphase ist geprägt von tiefem Umsatz und oft Verlusten.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: In der Sättigungsphase stagnieren die Umsätze bereits.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Die Reifephase markiert das Maximum von Umsatz und Gewinn.' },
    ],
  },
  // 16. ed43bf03 — Aktivkonto Zunahme Seite (mc)
  {
    id: 'ed43bf03-0477-494c-8db1-dfab888633df',
    fachbereich: 'BWL',
    musterlosung: 'Bei Aktivkonten stehen Zunahmen im Soll (links) und Abnahmen im Haben (rechts). Der Anfangsbestand steht ebenfalls im Soll. Diese Regel gilt für alle Vermögenskonten.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Aktivkonten haben eine festgelegte Soll-Seite für Zunahmen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Seite hängt vom Kontentyp ab, nicht vom Geschäftsfall.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das Haben ist die Seite der Abnahmen bei Aktivkonten.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Zunahmen bei Aktivkonten stehen im Soll (links).' },
    ],
  },
  // 17. ed6c1a97 — Sättigungsgrad (mc)
  {
    id: 'ed6c1a97-f09d-4dbe-b4bd-737a9682a862',
    fachbereich: 'BWL',
    musterlosung: 'Der Sättigungsgrad zeigt das Verhältnis von Marktvolumen (tatsächlich abgesetzter Menge) zu Marktpotenzial (maximal absetzbarer Menge). Die Formel lautet Marktvolumen geteilt durch Marktpotenzial mal 100 Prozent. Ein tiefer Sättigungsgrad steht für einen wachsenden Markt.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Marktvolumen im Verhältnis zum Marktpotenzial.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Umsatz zu Kosten ist eine Rentabilitätskennzahl, nicht Marktsättigung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Gewinn eines Anbieters ist keine Marktgrössenkennzahl.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Anzahl Anbieter betrifft die Marktstruktur, nicht den Sättigungsgrad.' },
    ],
  },
  // 18. einr-mc-uielemente — ExamLab UI-Elemente Prüfung (mc, Multi)
  {
    id: 'einr-mc-uielemente',
    fachbereich: 'BWL',
    musterlosung: 'Die Prüfungsoberfläche zeigt oben links den Timer, oben in der Mitte die Seitenzahl und links die Sidebar mit den Fragennummern. Einen Druckknopf gibt es nicht, da Prüfungen in ExamLab nicht ausgedruckt werden können.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'a', text: 'Korrekt: Der Timer läuft oben links und zeigt die verbleibende Zeit.' },
      { feld: 'optionen', id: 'b', text: 'Korrekt: Oben in der Mitte erscheint die aktuelle Fragennummer.' },
      { feld: 'optionen', id: 'c', text: 'Korrekt: Links zeigt die Sidebar alle Fragennummern zur Navigation.' },
      { feld: 'optionen', id: 'd', text: 'Falsch: ExamLab bietet keinen Ausdruck der Prüfung.' },
    ],
  },
  // 19. f025887d — Cash Cows + Question Mark (mc)
  {
    id: 'f025887d-9744-4e26-bccf-1d4c7f89d8ee',
    fachbereich: 'BWL',
    musterlosung: 'Cash Cows generieren hohe Gewinne bei tiefen Investitionen. Diese Mittel sollten in das Question Mark investiert werden, damit es durch intensive Marktbearbeitung zum Star wird. So sichert das Unternehmen seine zukünftigen Ertragsquellen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Cash Cows brauchen nur Erhaltungsinvestitionen, keine weiteren Mittel.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Überschüsse der Cash Cows finanzieren das Wachstum des Question Mark.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Ein vorzeitiger Ausstieg vernichtet Zukunftspotenzial.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Ohne Cash Cows fehlt die Finanzierungsbasis für neue Produkte.' },
    ],
  },
  // 20. f02cd804 — Vier Kontentypen (mc)
  {
    id: 'f02cd804-f0b9-4c2a-898e-bbd2aac4cecb',
    fachbereich: 'BWL',
    musterlosung: 'Die vier Kontentypen sind Aktivkonten (Vermögen), Passivkonten (Kapital), Aufwandkonten (Werteverzehr) und Ertragskonten (Wertezuwachs). Aktiv- und Passivkonten bilden die Bilanz, Aufwand- und Ertragskonten die Erfolgsrechnung.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Die vier Kontentypen des Buchhaltungssystems.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Keine standardisierte Unterteilung der Buchhaltung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Soll und Haben sind Buchungsseiten, keine Kontentypen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Eröffnungs- und Schlusskonto sind technische Hilfskonten, keine Kontentypen.' },
    ],
  },
  // 21. f04c1ae8 — Mammut 2. Sektor (mc)
  {
    id: 'f04c1ae8-0eba-433c-95ac-9085844118aa',
    fachbereich: 'BWL',
    musterlosung: 'Die Mammut Sports Group AG produziert Outdoor-Bekleidung und Sportgeräte und gehört damit zum 2. Sektor (Verarbeitung und Fabrikation). Obwohl auch Verkauf stattfindet, ist die Herstellung das Kerngeschäft. Die sektorale Zuordnung richtet sich nach der Haupttätigkeit.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der 3. Sektor umfasst Dienstleistungen, nicht die Herstellung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Die Herstellung von Produkten ordnet Mammut dem 2. Sektor zu.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der 1. Sektor ist Rohstoffgewinnung (Landwirtschaft, Bergbau).' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Unternehmen werden nach Haupttätigkeit einem Sektor zugeordnet.' },
    ],
  },
  // 22. f0c1fbb7 — Netflix Ersatzprodukt (mc)
  {
    id: 'f0c1fbb7-92da-40c0-87ad-d8a90186479b',
    fachbereich: 'BWL',
    musterlosung: 'Netflix als Online-Streaming-Dienst ersetzte den klassischen Videoverleih durch eine technologisch neue Lösung. Das entspricht der Kraft «Gefahr durch Ersatzprodukte» im 5-Kräfte-Modell nach Porter. Substitute befriedigen dasselbe Bedürfnis auf neue Weise und bedrohen etablierte Anbieter.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Rivalität bezieht sich auf bestehende Videotheken untereinander.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Kundenmacht ist eine andere Kraft (Nachfragemacht), nicht Substitution.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Lieferanten wären Filmrechteinhaber, nicht das Substitut der Branche.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Streaming ist ein klassisches Substitut des physischen Verleihs.' },
    ],
  },
  // 23. f1bb4aab — Umweltanalyse wichtig (mc)
  {
    id: 'f1bb4aab-0813-4a40-8b06-f06735f9af8c',
    fachbereich: 'BWL',
    musterlosung: 'Umweltvoraussetzungen sind für Unternehmen derselben Branche in einer Region oft ähnlich. Wer sein Unternehmen besser auf die Umwelt abstimmt, erzielt einen Wettbewerbsvorteil. Deshalb ist die Umweltanalyse eine zentrale Aufgabe der strategischen Führung.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Mitmachen wegen der Konkurrenz ist kein strategisches Argument.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ansprüche sind wichtig, begründen aber nicht die Bedeutung der Umweltanalyse.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gesetzliche Pflichten sind punktuell, nicht die Hauptmotivation.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Ein optimales Miteinander mit der Umwelt ist ein Wettbewerbsvorteil.' },
    ],
  },
  // 24. f27a302e — Unternehmensziele Kategorien (mc, Multi)
  {
    id: 'f27a302e-0df6-483c-a322-c2d5bcbc9883',
    fachbereich: 'BWL',
    musterlosung: 'Unternehmensziele werden in drei Kategorien eingeteilt: leistungswirtschaftlich (Marktanteil, Produkte), finanzwirtschaftlich (Gewinn, Rendite, Liquidität) und sozial/ökologisch (Mitarbeitende, Umwelt). Politische Ziele gehören nicht zum klassischen Dreiklang.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Leistungswirtschaftliche Ziele umfassen Produkte und Marktanteile.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Finanzwirtschaftliche Ziele regeln Gewinn und Liquidität.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Soziale und ökologische Ziele gehören zum Nachhaltigkeitskonzept.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Politische Ziele sind kein Bestandteil der klassischen Dreigliederung.' },
    ],
  },
  // 25. f359abf7 — Büromöbel auf Rechnung (mc)
  {
    id: 'f359abf7-0e61-4933-9cbf-e5e903e5c9e5',
    fachbereich: 'BWL',
    musterlosung: 'Die Mobilien (Aktivkonto) nehmen zu und werden im Soll gebucht. Da die Rechnung noch offen ist, entsteht eine Schuld gegenüber dem Lieferanten — Kreditoren (Passivkonto) nimmt im Haben zu. Der Buchungssatz lautet Mobilien an Kreditoren 8\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Bank wurde nicht belastet, da die Rechnung noch offen ist.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Aktivzunahme Mobilien im Soll, Passivzunahme Kreditoren im Haben.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Ohne Barzahlung bleibt die Kasse unverändert.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Umgekehrter Buchungssatz — die Mobilien nehmen zu, nicht ab.' },
    ],
  },
  // 26. f3c5688a — Zielharmonie (mc)
  {
    id: 'f3c5688a-c471-4b35-82a0-f86bfea0a83b',
    fachbereich: 'BWL',
    musterlosung: 'Bei Zielharmonie fördert das Erreichen eines Ziels gleichzeitig die Erfüllung eines anderen Ziels (komplementäre Beziehung). Beide Seiten profitieren gemeinsam — zum Beispiel motivierte Mitarbeitende und höhere Produktivität.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das beschreibt eine Zielkonkurrenz, nicht Harmonie.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Unabhängige Ziele stehen in Zielneutralität zueinander.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gegenseitige Minderung ist ein Zielkonflikt.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Zielharmonie bedeutet gemeinsame Zielerreichung.' },
    ],
  },
  // 27. f3c83196 — Fünf Umweltsphären (mc)
  {
    id: 'f3c83196-4923-4da4-a26d-762ed063ec4a',
    fachbereich: 'BWL',
    musterlosung: 'Im St. Galler Unternehmensmodell wird die Unternehmensumwelt in fünf Umweltsphären unterteilt: ökonomisch, technologisch, ökologisch, sozial und rechtlich. Jede Sphäre beeinflusst das Unternehmen auf eigene Weise.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Sechs ist eine Sphäre zuviel.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Vier lässt eine der fünf Sphären weg.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Genau fünf Umweltsphären werden unterschieden.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Drei reicht nicht für das St. Galler Modell.' },
    ],
  },
  // 28. f5b40dae — Wertberichtigung Fahrzeuge (mc)
  {
    id: 'f5b40dae-f663-4ea1-aaf3-0aae42c39b61',
    fachbereich: 'BWL',
    musterlosung: 'Wertberichtigungskonten sind Minus-Aktivkonten (Korrekturkonten zur Aktivseite). Sie stehen in der Bilanz auf der Aktivseite, verhalten sich aber wie Passivkonten: Zunahmen im Haben, Abnahmen im Soll. So bleibt der Anschaffungswert unverändert ersichtlich.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein normales Aktivkonto nähme im Soll zu — hier ist es umgekehrt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ein Aufwandkonto zeigt den laufenden Werteverzehr, nicht den kumulierten.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Wertberichtigung steht auf der Aktivseite, nicht der Passivseite.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Minus-Aktivkonto korrigiert den Wert auf der Aktivseite.' },
    ],
  },
  // 29. f6b07ce3 — Zielneutralität Lastwagen (mc)
  {
    id: 'f6b07ce3-24b3-4a19-9e83-1f4f91ac6649',
    fachbereich: 'BWL',
    musterlosung: 'Die beiden Ziele (Flottenerneuerung aus Umweltgründen, Produktqualität) stehen ohne Wechselwirkung nebeneinander. Das ist Zielneutralität — die Erreichung des einen Ziels hat keinen Einfluss auf das andere. Die Ziele berühren sich schlicht nicht.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Konkurrenz erfordert gegenseitige Behinderung, die hier nicht vorliegt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Komplementarität bräuchte eine positive Wechselwirkung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Die Ziele haben keinen Einfluss aufeinander.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Harmonie setzt ebenfalls positive Wechselwirkung voraus.' },
    ],
  },
  // 30. f982ef53 — Unternehmenskonzept Mittel + Verfahren (mc)
  {
    id: 'f982ef53-9630-485c-a35e-7e123856460c',
    fachbereich: 'BWL',
    musterlosung: 'Ein Strategiedokument ohne Angabe von Mitteln und Verfahren bleibt abstrakt. Erst wenn Ressourcen und Methoden definiert sind, wissen die Mitarbeitenden, was konkret zu tun ist. Mittel und Verfahren machen die Strategie operationalisierbar und umsetzbar.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Einschüchterung der Konkurrenz ist kein strategisches Ziel.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Gesetzliche Vorgaben regeln keine Strategieinhalte.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Bank prüft Finanzkennzahlen, nicht das operative Wie.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Nur mit Mitteln und Verfahren ist die Umsetzung möglich.' },
    ],
  },
  // 31. fa0690d5 — Passivkonten (mc, Multi)
  {
    id: 'fa0690d5-c8c2-4d87-911c-0f4e1780d06a',
    fachbereich: 'BWL',
    musterlosung: 'Passivkonten zeigen das Kapital: Fremdkapital (Kreditoren, Darlehen, Hypotheken) und Eigenkapital. Sie stehen auf der Passivseite der Bilanz. Der Warenvorrat gehört zum Umlaufvermögen und ist damit ein Aktivkonto.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Kreditoren sind kurzfristiges Fremdkapital gegenüber Lieferanten.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Eigenkapital steht auf der Passivseite der Bilanz.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Warenvorrat gehört zum Vermögen — Aktivkonto.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Darlehen ist langfristiges Fremdkapital und damit Passivkonto.' },
    ],
  },
  // 32. fb12c93d — CO2-Gesetz Umweltsphären (mc)
  {
    id: 'fb12c93d-7e96-4d6f-84f3-b075f124a28a',
    fachbereich: 'BWL',
    musterlosung: 'Ein CO2-Gesetz ist ein rechtlicher Rahmen (rechtliche Sphäre), reagiert auf ein ökologisches Problem (ökologische Sphäre) und hat finanzielle Auswirkungen (ökonomische Sphäre). Umweltsphären sind oft nicht eindeutig abzugrenzen und überlappen sich häufig.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Rechtlich, ökologisch und ökonomisch sind alle drei betroffen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das Gesetz reagiert auf ein ökologisches Problem, ökologisch zählt mit.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die technologische und soziale Sphäre sind nicht primär betroffen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die ökonomische Sphäre fehlt in dieser Auswahl.' },
    ],
  },
  // 33. fc6496a4 — Ansoff Diversifikation (mc)
  {
    id: 'fc6496a4-fd47-4814-bf12-379296e838b9',
    fachbereich: 'BWL',
    musterlosung: 'Nach Ansoff ist ein neues Produkt in einem neuen Markt eine Diversifikation. Diese Strategie ist die riskanteste, weil weder Produkt- noch Markterfahrung vorhanden ist. Sie kann horizontal, vertikal oder lateral erfolgen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Marktdurchdringung meint bestehendes Produkt im bestehenden Markt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Marktentwicklung ist bestehendes Produkt in neuem Markt.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Produktentwicklung bringt neue Produkte in den bestehenden Markt.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Diversifikation kombiniert neues Produkt und neuen Markt.' },
    ],
  },
  // 34. fcbf1cc9 — Schweizer Unternehmensstruktur (mc, Multi)
  {
    id: 'fcbf1cc9-1fba-4c6b-8947-c8596e6cde79',
    fachbereich: 'BWL',
    musterlosung: 'Rund 99.7 Prozent der marktwirtschaftlichen Unternehmen in der Schweiz sind KMU (bis 249 Vollzeitstellen). Grossunternehmen beschäftigen mit etwa 1.5 Millionen Personen knapp ein Drittel aller Erwerbstätigen. Die Schweiz zählt rund 617\'700 Arbeitsstätten (Quelle: BFS).',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Über 99 Prozent der Schweizer Firmen sind KMU.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Grossunternehmen beschäftigen knapp einen Drittel der Erwerbstätigen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Rund 617\'700 Arbeitsstätten ist eine übliche BFS-Kennzahl.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Grossunternehmen sind die kleine Minderheit, nicht die Mehrheit.' },
    ],
  },
  // 35. fcfbe1aa — Detailhändler Reaktion (mc)
  {
    id: 'fcfbe1aa-c27e-4003-bab5-7c4c60dffbc0',
    fachbereich: 'BWL',
    musterlosung: 'Das Unternehmen reagiert erst auf äusseren Druck — fallende Umsätze und Konkurrenzangebote. Es handelt weder proaktiv (Aktion) noch bleibt es untätig (Beharren). Die späte Antwort auf sichtbare Signale ist die Verhaltensweise der Reaktion.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Reaktion beschreibt späte Antwort auf sichtbaren Druck.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Aktion wäre eigeninitiativ vor dem Druck, nicht danach.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Innovation setzt voraus, dass das Unternehmen Vorreiter ist.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Beharren würde bedeuten, dass nicht reagiert wird.' },
    ],
  },
  // 36. fd86783e — Bezugsspesen Fracht 600 (mc)
  {
    id: 'fd86783e-f8ee-4256-82b7-6db12a0ce25b',
    fachbereich: 'BWL',
    musterlosung: 'Bezugsspesen erhöhen den Einstandswert der Waren und werden direkt im Konto Wareneinkauf gebucht. Die Kasse wird belastet. Der Buchungssatz lautet Wareneinkauf an Kasse 600.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein separates Konto Bezugsspesen wird nicht geführt, sie fliessen in den Wareneinkauf.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Wareneinkauf (Aufwand) steigt im Soll, Kasse nimmt im Haben ab.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Bezahlt wurde bar, nicht auf Kredit — Kreditoren sind nicht betroffen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Umgekehrter Buchungssatz — die Kasse würde zunehmen statt abnehmen.' },
    ],
  },
  // 37. fe014c84 — Aufwand zu + Aktiv ab (mc)
  {
    id: 'fe014c84-26fa-4f21-bc5e-c36813630e45',
    fachbereich: 'BWL',
    musterlosung: 'Wenn ein Aufwandkonto zunimmt, ist der Geschäftsfall erfolgswirksam und der Gewinn sinkt. Eine typische Konstellation ist die Bezahlung einer Rechnung (Aufwand steigt, Bank nimmt ab). Die Erfolgsrechnung schliesst mit einem tieferen Gewinn ab.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein Aufwandkonto macht den Geschäftsfall erfolgswirksam.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Aufwand reduziert den Gewinn, er steigt nicht.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Aufwandszunahme senkt den Gewinn der Periode.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Bilanzsumme sinkt, wenn ein Aktivkonto abnimmt.' },
    ],
  },
  // 38. ff0ab573 — Debitoren Abnahme (mc)
  {
    id: 'ff0ab573-522d-4be1-a78d-a44efbb810b8',
    fachbereich: 'BWL',
    musterlosung: 'Debitoren sind ein Aktivkonto. Bei Aktivkonten stehen Abnahmen im Haben (rechts). Wenn ein Kunde seine Rechnung bezahlt, lautet der Buchungssatz Bank an Debitoren — die Bank nimmt im Soll zu, die Debitoren im Haben ab.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Debitoren sind Aktivkonto, Abnahme im Haben.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Abnahmen stehen je nach Kontentyp verschieden, nicht generell im Soll.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Seite bestimmt sich über den Kontentyp, nicht den Begriff «Gutschrift».' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Debitoren sind ein Aktivkonto, kein Passivkonto.' },
    ],
  },
  // 39. ff6395c1 — Coca-Cola vs. iPhone (mc)
  {
    id: 'ff6395c1-d751-406c-96e1-c0312bd6f404',
    fachbereich: 'BWL',
    musterlosung: 'Die Dauer der einzelnen Phasen des Produktlebenszyklus variiert stark je nach Produkt. Konsumgüter des täglichen Bedarfs wie Coca-Cola können jahrzehntelang in der Sättigung bleiben. Technologieprodukte veralten dagegen oft innerhalb weniger Jahre.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Produktlebenszyklus gilt für alle Produkte, nicht nur technische.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Coca-Cola hat die Sättigungsphase nicht übersprungen, sondern hält sie lange.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das iPhone ist längst über die Einführungsphase hinaus.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Die Sättigungsdauer hängt stark von der Produktkategorie ab.' },
    ],
  },
  // 40. ff96a888 — Versicherungsprämie 6'000 (mc)
  {
    id: 'ff96a888-c87f-40a1-a6e6-771386d89e39',
    fachbereich: 'BWL',
    musterlosung: 'Der Versicherungsaufwand ist ein Aufwandkonto und nimmt zu (Soll). Die Bank ist ein Aktivkonto und nimmt ab (Haben). Der Buchungssatz lautet Versicherungsaufwand an Bank 6\'000 — der Gewinn sinkt entsprechend.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Kreditoren sind nicht beteiligt, die Zahlung erfolgt direkt per Bank.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Umgekehrter Buchungssatz — die Bank nimmt ab, nicht zu.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kreditoren werden nicht berührt, die Prämie wurde bezahlt.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Aufwandszunahme im Soll, Bankabnahme im Haben.' },
    ],
  },
  // 41. ffc79fa1 — Passivkonten Zuordnung (mc)
  {
    id: 'ffc79fa1-0256-494d-874b-f9e965854f14',
    fachbereich: 'BWL',
    musterlosung: 'Passivkonten umfassen Fremdkapital (Kreditoren, Darlehen, Hypothek) und Eigenkapital. Debitoren sind dagegen ein Aktivkonto (Kundenforderung). Wareneinkauf ist ein Aufwandkonto, Kasse und Fahrzeuge sind Aktivkonten.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Wareneinkauf ist Aufwandkonto, nicht Passivkonto.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Debitoren sind ein Aktivkonto (Kundenforderung).' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kasse, Debitoren und Fahrzeuge sind alle Aktivkonten.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Hypothek, Kreditoren, Eigenkapital und Darlehen sind Passivkonten.' },
    ],
  },
  // 42. ueb-mc-mastery — Mastery-System (mc, Multi)
  {
    id: 'ueb-mc-mastery',
    fachbereich: 'BWL',
    musterlosung: 'ExamLab Üben hat vier Mastery-Stufen: neu, üben, gefestigt und gemeistert. Der Fortschritt basiert auf Sessions (Übungssitzungen), nicht auf vergangenen Tagen. Dauerbaustellen — persistente Schwächen — werden regelmässig eingestreut, damit sie nicht vergessen werden.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'a', text: 'Korrekt: Vier Stufen — neu, üben, gefestigt, gemeistert.' },
      { feld: 'optionen', id: 'b', text: 'Falsch: Fortschritt entsteht durch Üben, nicht durch blossen Zeitablauf.' },
      { feld: 'optionen', id: 'c', text: 'Korrekt: Mehr Sessions führen zu schnellerem Aufstieg.' },
      { feld: 'optionen', id: 'd', text: 'Korrekt: Dauerbaustellen werden gezielt eingestreut, um Vergessen zu verhindern.' },
    ],
  },
  // 43. ueb-mc-uielemente — ExamLab Üben UI (mc, Multi)
  {
    id: 'ueb-mc-uielemente',
    fachbereich: 'BWL',
    musterlosung: 'Die Üben-Oberfläche zeigt oben links den Timer, oben in der Mitte die Seitenzahl und links die Sidebar mit den Fragennummern. Ein Druckknopf existiert nicht — Übungen werden rein digital durchgeführt.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'a', text: 'Korrekt: Der Timer erscheint oben links auf dem Bildschirm.' },
      { feld: 'optionen', id: 'b', text: 'Korrekt: Die Seitenzahl steht oben in der Mitte.' },
      { feld: 'optionen', id: 'c', text: 'Korrekt: Die Sidebar mit den Fragennummern befindet sich links.' },
      { feld: 'optionen', id: 'd', text: 'Falsch: ExamLab bietet keinen Ausdruck der Übung.' },
    ],
  },
  // 44. 01ef755e — SWOT Datengrundlage (rf, richtig)
  {
    id: '01ef755e-6852-46c0-91e6-1e3edd902fac',
    fachbereich: 'BWL',
    musterlosung: 'Die SWOT-Analyse fasst die Ergebnisse der internen Fähigkeitsanalyse und der externen Umweltanalyse zusammen. Ohne fundierte Datengrundlage bleibt sie oberflächlich und kann zu Fehlentscheidungen führen. Die Aussage ist richtig.',
    teilerklaerungen: [],
  },
  // 45. 0928cbc7 — Darlehen Passivkonto (rf, richtig)
  {
    id: '0928cbc7-f399-4647-a4ab-890394c3f411',
    fachbereich: 'BWL',
    musterlosung: 'Ein vom Unternehmen aufgenommenes Bankdarlehen ist eine Schuld gegenüber der Bank und steht deshalb auf der Passivseite der Bilanz. Das Konto Darlehen ist damit ein Passivkonto. Die Aussage ist richtig.',
    teilerklaerungen: [],
  },
  // 46. 0af95a75 — Indirekte Abschreibung (rf, richtig)
  {
    id: '0af95a75-a6d6-4a81-a8d5-4d40caa65a85',
    fachbereich: 'BWL',
    musterlosung: 'Bei der indirekten Abschreibung bleibt der ursprüngliche Anschaffungswert auf dem Aktivkonto stehen. Die kumulierten Abschreibungen werden auf einem separaten Wertberichtigungskonto erfasst. So lässt sich der Anschaffungswert jederzeit ablesen — Buchwert gleich Aktivkonto minus Wertberichtigung.',
    teilerklaerungen: [],
  },
  // 47. 108ed178 — Brent Spar an Land (rf, richtig)
  {
    id: '108ed178-a4be-4593-9a4d-8556eb2457b2',
    fachbereich: 'BWL',
    musterlosung: 'Am 20. Juni 1995 entschied Shell unter dem öffentlichen Druck, die Brent Spar an Land zu entsorgen. Ein Grossteil der gereinigten Aussenhülle wurde als Fundament eines Hafens weiterverwendet, der Rest verschrottet. Die Aussage ist richtig.',
    teilerklaerungen: [],
  },
  // 48. 121a9e6d — Buchhaltung Beschreibungsmodell (rf, richtig)
  {
    id: '121a9e6d-7ec9-4f14-bdd6-18e9ba6555fc',
    fachbereich: 'BWL',
    musterlosung: 'Die Buchhaltung erfasst sämtliche Geschäftsfälle im Zeitablauf in strukturierter Form. Sie beschreibt die wirtschaftlichen Vorgänge, ohne Ursachen zu erklären oder Handlungsempfehlungen zu geben. Damit ist sie ein typisches Beschreibungsmodell.',
    teilerklaerungen: [],
  },
  // 49. 17c0bbbc — Erfolgskonten ohne AB (rf, richtig)
  {
    id: '17c0bbbc-6882-4d5f-93b1-233863d002b5',
    fachbereich: 'BWL',
    musterlosung: 'Erfolgskonten (Aufwand und Ertrag) werden am Jahresende über die Erfolgsrechnung abgeschlossen. Sie starten im neuen Jahr bei null. Nur Bilanzkonten (Aktiv und Passiv) tragen einen Anfangsbestand ins neue Jahr.',
    teilerklaerungen: [],
  },
  // 50. 187d8a42 — Warenvorrat Aktivkonto (rf, richtig)
  {
    id: '187d8a42-244f-46b2-946e-8809c20ccbc1',
    fachbereich: 'BWL',
    musterlosung: 'Das Konto Warenvorrat gehört zum Umlaufvermögen und damit zu den Aktivkonten. Der Endbestand am Bilanzstichtag wird durch Inventur ermittelt und zum Einstandspreis bewertet. Die Aussage ist richtig.',
    teilerklaerungen: [],
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
state.letzteSession = 34;
state.letzterLauf = now;

fs.writeFileSync('state.json', JSON.stringify(state, null, 2));

console.log(`Session 34 done. Appended ${appended} updates. Total verarbeitet: ${state.verarbeitet}`);
