#!/usr/bin/env node
// Session 32 — 50 BWL/mc Fragen
// Appendet an fragen-updates.jsonl und updated state.json

import fs from 'node:fs';

const UPDATES = [
  // 1. 98812b03 — CSR-Instrumente (Multi-Correct)
  {
    id: '98812b03-7483-4830-9430-9244c0476b58',
    fachbereich: 'BWL',
    musterlosung: 'CSR-Instrumente dienen dazu, die gesellschaftliche Verantwortung eines Unternehmens sichtbar und überprüfbar zu machen. Dazu gehören Gütesiegel wie Fairtrade, das Sponsoring sozialer oder kultureller Projekte sowie der Nachhaltigkeitsbericht. Eine aggressive Preisstrategie zielt dagegen auf Marktverdrängung und hat mit CSR nichts zu tun.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Gütesiegel wie Fairtrade belegen nachhaltige Beschaffung und stärken die Glaubwürdigkeit.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Sponsoring sozialer oder kultureller Projekte ist ein typisches CSR-Instrument.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Der Nachhaltigkeitsbericht schafft Transparenz über ökologische und soziale Wirkungen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Eine aggressive Preisstrategie ist eine Wettbewerbsstrategie und widerspricht teils sogar CSR-Zielen.' },
    ],
  },
  // 2. 98f4a146 — Vorteil hoher Marktanteil
  {
    id: '98f4a146-28ec-42f1-b162-d4f9a787d9e2',
    fachbereich: 'BWL',
    musterlosung: 'Ein hoher Marktanteil verschafft dem Unternehmen die Position der Marktführerschaft. Es kann damit Preise, Standards und Rahmenbedingungen aktiv mitgestalten, statt nur zu reagieren. Produktionskosten oder Markteintrittsbarrieren sind damit aber nicht automatisch ausser Kraft gesetzt.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Kosten sinken nie auf null; auch Marktführer haben Fix- und variable Kosten.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Auch Marktführer müssen kommunizieren, um ihre Position zu halten.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Markteintritt ist trotz hoher Anteile möglich, eine Garantie gibt es nicht.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Marktführer können Preise und Produktstandards aktiv gestalten.' },
    ],
  },
  // 3. 99f72c2d — Victorinox Diversifikation
  {
    id: '99f72c2d-550f-4518-a5c8-9d9e66584399',
    fachbereich: 'BWL',
    musterlosung: 'Victorinox erweitert sein Sortiment um Uhren, Reisegepäck und Parfüms. Diese Produkte sind sachlich verwandt, weil sie dieselbe Marken- und Lifestyle-Linie bedienen. Es handelt sich daher um horizontale Diversifikation, bei der Synergien mit Marke, Vertrieb und Image genutzt werden.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Horizontale Diversifikation erweitert das Angebot um sachlich verwandte Produkte auf derselben Wertschöpfungsstufe.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Vertikale Diversifikation bedeutet Vor- oder Rückwärtsintegration in der Wertschöpfungskette.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Laterale Diversifikation wären völlig fremde Geschäftsfelder ohne sachlichen Bezug.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Marktdurchdringung verkauft mehr des bestehenden Produkts auf dem bestehenden Markt.' },
    ],
  },
  // 4. 9a1d879d — Hauptaufgaben FiBu
  {
    id: '9a1d879d-bdbc-4ed3-ab31-76b0fe9301bc',
    fachbereich: 'BWL',
    musterlosung: 'Die Finanzbuchhaltung erfüllt fünf Hauptaufgaben: Ausweis von Gewinn und Verlust, Beweismittel bei Streitigkeiten, Kalkulationsgrundlage, Grundlage für Steuern und Information der Anspruchsgruppen. Personalaufgaben wie Rekrutierung gehören zur HR-Abteilung, nicht zur Buchhaltung.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Der Ausweis von Gewinn und Verlust ist Kernaufgabe der Erfolgsrechnung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Die Buchhaltung dient als Beweismittel bei Streitigkeiten vor Gericht.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Personalrekrutierung ist eine HR-Aufgabe, nicht Teil der Finanzbuchhaltung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Daten aus der FiBu dienen als Kalkulationsgrundlage für Preise und Angebote.' },
    ],
  },
  // 5. 9a2318b8 — Problem ein Modell
  {
    id: '9a2318b8-be18-434a-a618-6cd8378dba86',
    fachbereich: 'BWL',
    musterlosung: 'Jedes Modell ist eine bewusste Vereinfachung der Realität und blendet Aspekte aus, die für den Modellzweck nicht zentral sind. Wer sich allein auf ein Modell verlässt, übersieht Faktoren ausserhalb dieses Ausschnitts. Sinnvoll ist daher der Einsatz mehrerer Modelle und Perspektiven.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Modelle sind Vereinfachungen und blenden bewusst Teilaspekte aus.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Modelle bilden auch aktuelle Zusammenhänge und Zukunftsszenarien ab.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Modelle sind grössenunabhängig und auch für KMU nützlich.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Modelle sind trotz Vereinfachung nützlich, wenn ihr Geltungsbereich beachtet wird.' },
    ],
  },
  // 6. 9a29c3a6 — Greenwashing Ölkonzern
  {
    id: '9a29c3a6-3a7d-407a-b2fd-f5aed86fbe3b',
    fachbereich: 'BWL',
    musterlosung: 'Wenn die Kernstrategie eines Unternehmens seinen deklarierten Nachhaltigkeitszielen widerspricht, spricht man von Greenwashing. Ein aufwendiger Bericht allein verändert weder das Geschäftsmodell noch die ökologischen Wirkungen. CSR wird hier vor allem zur Imagepflege genutzt, was die Glaubwürdigkeit untergräbt.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Engagement ohne Substanz kann der CSR-Glaubwürdigkeit sogar schaden.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Widerspruch zwischen Bericht und Kerngeschäft ist ein klassisches Greenwashing-Muster.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Transparenz allein ersetzt keine konsistente Strategie.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Freiwilligkeit schützt nicht vor der Kritik, CSR nur zur Imagepflege zu nutzen.' },
    ],
  },
  // 7. 9abc6c25 — Ertragskonten (Multi)
  {
    id: '9abc6c25-1e34-4897-a5e2-371df33e6624',
    fachbereich: 'BWL',
    musterlosung: 'Ertragskonten erfassen den Wertzufluss aus Leistungen an Kundschaft sowie aus Finanzanlagen. Warenverkauf, Honorarertrag und Finanzertrag sind typische Ertragskonten. Der Wareneinkauf dagegen ist ein Aufwandkonto, weil er einen Werteverzehr für die Beschaffung abbildet.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Warenverkauf ist das klassische Ertragskonto für verkaufte Handelsware.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Finanzertrag erfasst Zinsen und Dividenden aus Anlagen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Wareneinkauf ist Werteverzehr und zählt zum Warenaufwand.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Honorarertrag erfasst Leistungserträge aus Dienstleistungen.' },
    ],
  },
  // 8. 9bab9c97 — SWOT Schwächen Softdrink
  {
    id: '9bab9c97-fc7d-432c-b80b-2510f3f9fd24',
    fachbereich: 'BWL',
    musterlosung: 'Schwächen sind interne, negative Merkmale des Unternehmens. Hohe Produktionskosten mit daraus resultierendem hohem Preis sowie schwaches Marketing sind klassische Schwächen. Guter Zugang zu Verkaufsstellen und Produktqualität zählen dagegen zu den internen Stärken.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Guter Zugang zu Verkaufsstellen ist eine Stärke, kein negatives Merkmal.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Hohe Produktionskosten schwächen die Wettbewerbsposition über den Preis.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gute Produktqualität ist eine interne Stärke.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Schwaches Marketing reduziert die Wirkung aller anderen Stärken am Markt.' },
    ],
  },
  // 9. 9c4dab47 — Fremdkapitalgeber
  {
    id: '9c4dab47-ce47-463c-88c8-8e444d61f7e3',
    fachbereich: 'BWL',
    musterlosung: 'Fremdkapitalgeber wie Banken stellen dem Unternehmen Kapital auf Zeit zur Verfügung. Sie erwarten dafür einen möglichst hohen Zins, die pünktliche Rückzahlung gemäss Vertrag sowie ausreichende Sicherheiten, um ihr Ausfallrisiko zu begrenzen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Zinsen, Rückzahlung und Sicherheiten sind die typischen Ansprüche von Fremdkapitalgebern.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Tiefe Preise sind ein Anspruch der Kundschaft, nicht der Banken.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Steuern und Arbeitsplätze sind Ansprüche des Staates.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Lohn und Arbeitsplatzsicherheit sind Ansprüche der Mitarbeitenden.' },
    ],
  },
  // 10. 9ca238a4 — Wirtschaftlichkeit 0.85
  {
    id: '9ca238a4-ba72-49ab-a0ff-d71e9bfb4463',
    fachbereich: 'BWL',
    musterlosung: 'Die Wirtschaftlichkeit berechnet sich als Ertrag geteilt durch Aufwand. Ein Wert unter 1 bedeutet, dass der Aufwand grösser ist als der Ertrag — das Unternehmen erwirtschaftet also einen Verlust. Bei 0.85 fehlen pro Franken Aufwand 15 Rappen Ertrag.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Ein Wert unter 1 zeigt einen Verlust: Aufwand übersteigt den Ertrag.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Produktivität misst Output je Input und ist nicht Ertrag geteilt durch Aufwand.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Rentabilität bezieht sich auf das Verhältnis Gewinn zu Kapital, nicht Ertrag zu Aufwand.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Gewinn läge bei einem Wert über 1 vor.' },
    ],
  },
  // 11. 9cde4ee8 — Privatkonto Habensaldo
  {
    id: '9cde4ee8-a91d-4b8b-bf16-a303acbecd26',
    fachbereich: 'BWL',
    musterlosung: 'Das Privatkonto zeigt einen Habensaldo von 20\'000 Franken, weil der Eigenlohn (72\'000) die Privatbezüge (52\'000) übersteigt. Dieser Überschuss erhöht das Eigenkapital. Abschlussbuchung: Privat an Eigenkapital 20\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Erfolgsrechnung ist hier nicht beteiligt; Privat ist ein EK-Unterkonto.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Der Überschuss aus dem Privatkonto erhöht das Eigenkapital.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Diese Buchung würde das Eigenkapital reduzieren, der Saldo ist aber ein Überschuss.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das Privatkonto wird nicht über die Erfolgsrechnung abgeschlossen.' },
    ],
  },
  // 12. 9ec8e5cb — Maslow Basis
  {
    id: '9ec8e5cb-2ac8-4d48-ae2a-21f2256515f0',
    fachbereich: 'BWL',
    musterlosung: 'Die Bedürfnispyramide nach Maslow beginnt mit den physiologischen Bedürfnissen wie Nahrung, Schlaf und Wärme. Erst wenn diese Grundbedürfnisse befriedigt sind, rücken höhere Stufen wie Sicherheit, Soziales und Selbstverwirklichung ins Blickfeld.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Physiologische Bedürfnisse wie Nahrung und Schlaf bilden die Basis der Pyramide.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Soziale Bedürfnisse liegen auf der mittleren Stufe über Sicherheit.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Sicherheitsbedürfnisse liegen auf der zweiten Stufe, nicht der Basis.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Selbstverwirklichung bildet die Spitze, nicht die Basis der Pyramide.' },
    ],
  },
  // 13. 9f394e3a — Bargeldbezug Bank
  {
    id: '9f394e3a-19df-40f6-bd2d-0718e46c2e77',
    fachbereich: 'BWL',
    musterlosung: 'Beim Bargeldbezug nimmt die Kasse als Aktivkonto zu und wird im Soll gebucht. Gleichzeitig nimmt die Bank als weiteres Aktivkonto ab und steht im Haben. Es handelt sich um einen Aktivtausch. Buchungssatz: Kasse an Bank 2\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: So würde Bargeld aufs Bankkonto einbezahlt, die Richtung ist vertauscht.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Es entsteht kein Aufwand, es ist ein reiner Aktivtausch.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Kasse (Soll, Zunahme) an Bank (Haben, Abnahme).' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das Eigenkapital ist hier nicht betroffen.' },
    ],
  },
  // 14. 9facc1ea — Bankzinsen bezahlen
  {
    id: '9facc1ea-108e-40bf-99cd-2365a0298556',
    fachbereich: 'BWL',
    musterlosung: 'Gezahlte Bankzinsen sind Finanzaufwand. Der Aufwand nimmt zu und wird im Soll gebucht, die Bank als Aktivkonto nimmt ab und steht im Haben. Buchungssatz: Finanzaufwand an Bank 1\'200.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Finanzertrag entsteht beim Erhalt von Zinsen, nicht bei der Zahlung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Finanzaufwand (Soll) an Bank (Haben), Aufwand zu, Bank ab.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Buchungsrichtung ist vertauscht, Aufwände stehen im Soll.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bezahlung erfolgt per Bank, nicht auf Rechnung an Kreditoren.' },
    ],
  },
  // 15. 9ffabfa4 — Unternehmen nicht isoliert
  {
    id: '9ffabfa4-f736-4e11-aab5-d66b4b899804',
    fachbereich: 'BWL',
    musterlosung: 'Das Unternehmensmodell zeigt das Unternehmen als offenes System, das in ständiger Wechselbeziehung mit seinem Umfeld steht. Anspruchsgruppen und Umweltsphären beeinflussen die Ziele und Entscheidungen fortlaufend. Isolation ist daher weder möglich noch sinnvoll.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ob ein Unternehmen Selbstzweck ist, betrifft das Ziel, nicht die Wechselbeziehungen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Das Unternehmen steht in dauernder Wechselbeziehung mit Umfeld und Anspruchsgruppen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Staatszwang beschreibt nicht die Grundstruktur offener Systeme.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Gewinn ist ein Ziel, nicht der Grund für die Wechselwirkungen.' },
    ],
  },
  // 16. a0258bcc — Aktivkonto AB
  {
    id: 'a0258bcc-dbf9-453f-b9d2-0e0b3df3dcd0',
    fachbereich: 'BWL',
    musterlosung: 'Der Anfangsbestand eines Aktivkontos steht im Soll, also links. Damit steht er auf derselben Seite wie die Zunahmen. Bei Passivkonten ist es spiegelbildlich: Anfangsbestand und Zunahmen stehen im Haben.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Im Haben steht der AB bei Passivkonten, nicht bei Aktivkonten.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: T-Konten haben nur zwei Seiten, keine Mitte.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Der AB steht bei Aktivkonten im Soll, wie die Zunahmen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Jedes Bestandeskonto hat einen Anfangsbestand am Jahresbeginn.' },
    ],
  },
  // 17. a0d63cf2 — Versicherung abgrenzen
  {
    id: 'a0d63cf2-eee4-41ce-9ce6-5672b9a09005',
    fachbereich: 'BWL',
    musterlosung: 'Die Versicherungsprämie von 12\'000 Franken deckt Oktober bis September, also 3 Monate ins alte und 9 Monate ins neue Jahr. Nur 3\'000 Franken gehören ins alte Jahr als Aufwand. Die restlichen 9\'000 Franken werden als Transitorische Aktive ausgegrenzt: TA an Versicherungsaufwand 9\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: 3\'000 sind der Aufwand des alten Jahres, nicht der abzugrenzende Betrag.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: 9\'000 entfallen aufs neue Jahr und werden als TA aktiviert.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Transitorische Passiven sind für noch nicht bezahlte Aufwände oder vorauserhaltene Erträge.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Buchungsrichtung ist vertauscht; die TA nehmen zu, stehen also im Soll.' },
    ],
  },
  // 18. a12bab83 — Löhne per Bank
  {
    id: 'a12bab83-31f5-49c8-b2b6-5299b204bde9',
    fachbereich: 'BWL',
    musterlosung: 'Der Lohnaufwand ist ein Aufwandkonto; er nimmt zu und steht im Soll. Die Bank als Aktivkonto nimmt ab und steht im Haben. Buchungssatz: Lohnaufwand an Bank 12\'000. Der Geschäftsfall ist erfolgswirksam und vermindert den Gewinn.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Gezahlt wird per Bank, nicht über Kreditoren, und es geht um Lohn, nicht Personal allgemein.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Zahlung erfolgt gemäss Text per Bank, nicht per Kasse.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Lohnaufwand (Soll) an Bank (Haben).' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Richtung ist vertauscht; Aufwände stehen im Soll.' },
    ],
  },
  // 19. a27cb182 — Warum Abgrenzungen
  {
    id: 'a27cb182-3c39-45a9-bf53-c7e24a7fa2ad',
    fachbereich: 'BWL',
    musterlosung: 'Rechnungsabgrenzungen sichern den Grundsatz der Periodengerechtigkeit. Aufwände und Erträge werden in jenem Geschäftsjahr erfasst, in dem sie wirtschaftlich anfallen, unabhängig vom Zahlungszeitpunkt. Nur so zeigt die Erfolgsrechnung den korrekten Erfolg des Jahres.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Abgrenzungen verändern das Eigenkapital nicht planmässig, sondern korrigieren Aufwand und Ertrag.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Bilanzsumme soll korrekt, nicht hoch ausgewiesen werden.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Steueroptimierung ist nicht das primäre Ziel der Periodenabgrenzung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Abgrenzungen ordnen Aufwände und Erträge der wirtschaftlich richtigen Periode zu.' },
    ],
  },
  // 20. a285eed4 — Shareholder/Stakeholder Diagramm
  {
    id: 'a285eed4-0b75-4e4e-a7d9-a173f40c4b7d',
    fachbereich: 'BWL',
    musterlosung: 'Der Shareholder-Value-Ansatz fokussiert auf eine Gruppe, die Eigentümer, und strebt kurzfristige Gewinnmaximierung an. Der Stakeholder-Value-Ansatz berücksichtigt alle Anspruchsgruppen und zielt auf langfristige, ausgewogene Wertsteigerung. Im Diagramm steht A für den Shareholder- und B für den Stakeholder-Ansatz.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Zuordnung ist vertauscht; A zeigt den engen Fokus auf Eigentümer.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Unternehmens- und Umweltmodell bezeichnen andere Konzepte.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: A = Shareholder-Value (eine Gruppe, kurzfristig), B = Stakeholder-Value (alle Gruppen, langfristig).' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Kostenführerschaft und Differenzierung sind Wettbewerbsstrategien, keine Werteansätze.' },
    ],
  },
  // 21. a4737b06 — Brent Spar Entsorgung
  {
    id: 'a4737b06-5ae5-4ea6-af80-659fa7fa20f9',
    fachbereich: 'BWL',
    musterlosung: 'Bei der Brent Spar standen zwei Entsorgungsvarianten zur Diskussion: Versenken in einem atlantischen Tiefseegraben (rund 2\'375 Meter) oder vollständiger Abbau an Land. Der Konflikt zwischen ökonomischer und ökologischer Sphäre eskalierte durch Greenpeace-Kampagnen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Stehen lassen war aus Sicherheitsgründen keine Option.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Sprengung oder Transport nach Afrika standen nicht zur Diskussion.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Verkauf oder Umnutzung waren nicht Teil der Entscheidung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Diskutiert wurden Versenken in tiefer See versus vollständiger Abbau an Land.' },
    ],
  },
  // 22. a473a863 — Konkurrenzanalyse
  {
    id: 'a473a863-e450-4469-ad95-41cbf8579233',
    fachbereich: 'BWL',
    musterlosung: 'Die Konkurrenzanalyse liefert Hinweise auf Veränderungen im Kundenverhalten und bei Wettbewerbsbedingungen. Wenn die Konkurrenz erfolgreich online wirbt, muss das Unternehmen die eigene Kommunikationsstrategie prüfen und gegebenenfalls anpassen — ohne blindes Kopieren, aber auch ohne Ignorieren der Marktentwicklung.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Konkurrenzanalyse ist Grundlage strategischer Marketingentscheide.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Mehr Printwerbung ohne Begründung ist kein strategisch fundierter Schluss.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Blindes 1:1-Kopieren vernachlässigt die eigene Positionierung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Die Kommunikationsstrategie wird überprüft und bei Bedarf angepasst.' },
    ],
  },
  // 23. a4774240 — Fabrik Wechselwirkung
  {
    id: 'a4774240-6ac6-470b-9096-9a274e78a56f',
    fachbereich: 'BWL',
    musterlosung: 'Der Bau einer Fabrik mit 200 neuen Stellen ist eine aktive Wirkung des Unternehmens auf seine Umweltsphären. Er schafft Arbeitsplätze (soziale Dimension) und stärkt die regionale Wirtschaft (ökonomische Dimension). Die Richtung der Wechselwirkung verläuft vom Unternehmen zur Umwelt.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Hier geht die Wirkung vom Unternehmen aus, nicht umgekehrt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Unternehmen wirkt ökonomisch und sozial auf die Umweltsphären.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Initiative kommt nicht vom Staat als Anspruchsgruppe.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Es ist keine reine Wirkung zwischen Sphären, sondern zwischen Unternehmen und Umwelt.' },
    ],
  },
  // 24. a6283f2c — Inventar Aussagen
  {
    id: 'a6283f2c-4496-4f36-a906-06c2be1e060e',
    fachbereich: 'BWL',
    musterlosung: 'Das Inventar listet sämtliche Vermögensteile und Schulden detailliert nach Art, Menge und Wert auf. Es wird mindestens einmal jährlich am Bilanzstichtag erstellt und dient als Grundlage für die Bilanz. Die Bilanz fasst die Inventarinformationen in verdichteter Form zusammen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Das Inventar ist art-, mengen- und wertmässig detailliert.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Inventarerstellung mindestens einmal jährlich am Bilanzstichtag.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Bilanz ist eine verdichtete Zusammenfassung, nicht identisch mit dem Inventar.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Das Inventar bildet die Grundlage der Bilanzerstellung.' },
    ],
  },
  // 25. a6733cf0 — Transitorische Aktiven
  {
    id: 'a6733cf0-38df-439a-8c56-939dd7fdf8ac',
    fachbereich: 'BWL',
    musterlosung: 'Transitorische Aktiven entstehen, wenn ein Aufwand im alten Jahr bezahlt wird, aber wirtschaftlich das neue Jahr betrifft, oder wenn ein Ertrag bereits verdient, aber noch nicht eingegangen ist. Sie werden als Forderung in die Bilanz aufgenommen und im neuen Jahr aufgelöst.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Vorauserhaltene Erträge und unbezahlte Aufwände sind Transitorische Passiven.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Vorausbezahlte Aufwände oder noch ausstehende Erträge des alten Jahres.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Rückstellungen betreffen unsichere zukünftige Verpflichtungen, nicht Abgrenzungen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Anlagen sind langfristige Vermögenswerte, keine Abgrenzungsposten.' },
    ],
  },
  // 26. a754cce0 — Cupcake Evaluation
  {
    id: 'a754cce0-2eb7-46f4-b2be-90cf3ea09b64',
    fachbereich: 'BWL',
    musterlosung: 'Die strategische Evaluation prüft auf drei Ebenen: Annahmen, Umsetzung und Wirksamkeit. Wenn sich die Marktannahme als falsch herausstellt (hoher Bedarf an veganen Varianten), betrifft dies die Kontrolle der zugrunde liegenden Annahmen. Die Strategie muss entsprechend überarbeitet werden.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Die Markteinschätzung war falsch, das betrifft die Annahmen der Strategie.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Diskrepanz zeigt, dass etwas nicht planmässig läuft.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Produktion ist nicht das Problem, sondern die Markteinschätzung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Umsatz ist Folge der Strategie, nicht ihre Ursache.' },
    ],
  },
  // 27. a8114987 — Passivseite Reihenfolge
  {
    id: 'a8114987-528f-457d-bb07-a9aa1da4db78',
    fachbereich: 'BWL',
    musterlosung: 'Die Passivseite wird nach dem Fälligkeitsprinzip geordnet: zuerst das kurzfristige Fremdkapital (unter 1 Jahr), dann das langfristige Fremdkapital (über 1 Jahr), zuunterst das zeitlich unbegrenzte Eigenkapital. Die Aktivseite folgt dem komplementären Liquiditätsprinzip.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Alphabetische Sortierung gibt es in der Bilanzgliederung nicht.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Fälligkeitsprinzip — kurzfristig vor langfristig, EK zuunterst.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Betragshöhe bestimmt die Reihenfolge nicht.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das Liquiditätsprinzip gilt für die Aktivseite, nicht für die Passivseite.' },
    ],
  },
  // 28. a9de7078 — Was ist ein Modell
  {
    id: 'a9de7078-9a68-4db2-9017-fb79151b2925',
    fachbereich: 'BWL',
    musterlosung: 'Ein Modell in der BWL ist eine vereinfachte Darstellung der Wirklichkeit. Es zeigt bewusst nur einen Ausschnitt, um komplexe Zusammenhänge verständlich zu machen. Diese Abstraktion ist eine Stärke, zugleich aber auch eine Grenze, weil Teilaspekte ausgeblendet bleiben.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Eine Anweisung der GL ist eine Direktive, kein Erklärungsmodell.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Eine exakte Kopie wäre keine Vereinfachung und hätte keinen Modellnutzen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Ein Modell ist keine Gesetzmässigkeit mit absolutem Geltungsanspruch.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Ein Modell ist eine vereinfachte Abbildung der Realität.' },
    ],
  },
  // 29. aa0ec775 — Stakeholder-Value
  {
    id: 'aa0ec775-bd1d-4f36-82fb-26faae7bd623',
    fachbereich: 'BWL',
    musterlosung: 'Der Stakeholder-Value-Ansatz geht davon aus, dass ein Unternehmen mehreren Anspruchsgruppen gerecht werden muss. Langfristig ausgewogene Rücksichtnahme steigert auch den Unternehmenswert für die Eigentümer. Eine hohe Mitarbeitermotivation führt zu besseren Ergebnissen und stützt diesen Effekt.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Das Unternehmen muss mehreren Anspruchsgruppen gerecht werden.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Langfristige Ausgewogenheit kann den Shareholder-Value sogar steigern.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kundeninteressen allein wären ein einseitiger Fokus, nicht Stakeholder-Value.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Hohe Motivation der Mitarbeitenden führt zu besseren Leistungsergebnissen.' },
    ],
  },
  // 30. aa4b651a — Grossunternehmen Schweiz
  {
    id: 'aa4b651a-3fb8-4b48-aa22-e7d8fcba955c',
    fachbereich: 'BWL',
    musterlosung: 'In der Schweiz werden Unternehmen nach Vollzeitstellen klassifiziert: Mikrounternehmen 0–9, Kleinunternehmen 10–49, Mittelunternehmen 50–249 und Grossunternehmen ab 250 Vollzeitstellen. Die Definition folgt dem Bundesamt für Statistik.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ab 50 beginnt das Mittelunternehmen, nicht das Grossunternehmen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: 500 ist keine offizielle Grenze der BFS-Definition.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Ab 250 Vollzeitstellen gilt ein Unternehmen als Grossunternehmen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: 100 ist keine Schwelle in der BFS-Systematik.' },
    ],
  },
  // 31. ab31995d — Swiffer/Rivella Phase
  {
    id: 'ab31995d-fb15-45ad-bcf7-325a420ba00c',
    fachbereich: 'BWL',
    musterlosung: 'In der Sättigungsphase flacht das Marktwachstum ab und die Verkäufe stagnieren. Unternehmen lancieren daher Varianten und Zusatzprodukte, um den Ausstieg aus dem Markt hinauszuzögern. Die Beispiele Swiffer Wet und Rivella mit neuen Geschmacksrichtungen illustrieren diese typische Strategie.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: In der Einführungsphase wird das Grundprodukt am Markt getestet, nicht Varianten.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Varianten in der Sättigungsphase verzögern den Rückgang.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: In der Wachstumsphase reicht die Nachfrage nach dem Grundprodukt meist noch aus.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: In der Rückgangsphase ist der Aufwand für neue Varianten meist zu hoch.' },
    ],
  },
  // 32. ab36320e — Bilanzverkürzung
  {
    id: 'ab36320e-ce7b-42a6-9615-9ac439abd003',
    fachbereich: 'BWL',
    musterlosung: 'Eine Bilanzverkürzung liegt vor, wenn ein Aktiv- und ein Passivkonto gleichzeitig abnehmen. Die Rückzahlung eines Darlehens per Bank und die Tilgung von Kreditoren per Bank sind klassische Fälle. Der Kauf auf Rechnung ist dagegen eine Bilanzverlängerung, der Barbezug ein Aktivtausch.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Bank (Aktiv) ab und Darlehen (Passiv) ab ergeben Bilanzverkürzung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Bank (Aktiv) ab und Kreditoren (Passiv) ab ergeben Bilanzverkürzung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Mobilien zu und Kreditoren zu ist eine Bilanzverlängerung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Kasse zu und Bank ab ist ein Aktivtausch, ohne Änderung der Bilanzsumme.' },
    ],
  },
  // 33. acf36d4f — Porter 5-Kräfte
  {
    id: 'acf36d4f-512f-4360-a07a-a815f08656dd',
    fachbereich: 'BWL',
    musterlosung: 'Michael Porter entwickelte das Fünf-Kräfte-Modell zur Analyse der Wettbewerbsintensität einer Branche. Die fünf Kräfte sind: bestehende Konkurrenz, potenzielle Konkurrenten, Ersatzprodukte, Verhandlungsmacht der Lieferanten und der Abnehmer.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Adam Smith prägte den Begriff der «unsichtbaren Hand» in der VWL.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Peter Drucker prägte Managementlehren, nicht das 5-Kräfte-Modell.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Michael Porter entwickelte die Five Forces der Branchenanalyse.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Igor Ansoff entwickelte die Produkt-Markt-Matrix, nicht das 5-Kräfte-Modell.' },
    ],
  },
  // 34. ad19698f — Passiven Reihenfolge
  {
    id: 'ad19698f-09be-4d86-aebc-4eca7877e102',
    fachbereich: 'BWL',
    musterlosung: 'Die Passivseite der Bilanz folgt dem Fälligkeitsprinzip: zuerst die kurzfristigen Schulden wie Kreditoren, dann die langfristigen wie Hypotheken, zuletzt das zeitlich unbegrenzte Eigenkapital. Diese Ordnung erleichtert die Beurteilung der Finanzierungsstruktur.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Alphabetisch wird in der Bilanzgliederung nicht geordnet.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Betragshöhe ist für die Reihenfolge nicht massgebend.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das Liquiditätsprinzip gilt auf der Aktivseite.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Fälligkeitsprinzip — kurzfristige Schulden zuerst, dann langfristige.' },
    ],
  },
  // 35. ae2ac547 — Invest vs Konsum
  {
    id: 'ae2ac547-2cec-4072-872e-731f322ae02a',
    fachbereich: 'BWL',
    musterlosung: 'Konsumgüter dienen direkt der privaten Bedürfnisbefriedigung. Investitionsgüter wie Maschinen oder Fahrzeuge werden dagegen für die Erstellung von Konsumgütern eingesetzt. Sie tragen somit indirekt zur Bedürfnisbefriedigung bei und sind nach der Verwendung, nicht nach dem Preis, abgegrenzt.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Auch Konsumgüter können mehrfach genutzt werden (z.B. Kleider).' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Investitionsgüter werden von Unternehmen aller Art gekauft, nicht nur vom Staat.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Investitionsgüter dienen der Herstellung von Konsumgütern, also indirekter Bedürfnisbefriedigung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Preis ist kein Abgrenzungskriterium zwischen Invest- und Konsumgut.' },
    ],
  },
  // 36. ae74c13b — Privathaftpflicht Maslow
  {
    id: 'ae74c13b-d48a-469c-bb31-c787b90ecb14',
    fachbereich: 'BWL',
    musterlosung: 'Eine Haftpflichtversicherung schützt vor finanziellen Risiken bei Schadenfällen. Damit befriedigt sie ein Sicherheitsbedürfnis, das auf der zweiten Stufe der Maslow-Pyramide steht. Sicherheitsbedürfnisse umfassen Schutz vor Gefahren, ein festes Einkommen, Absicherung und Unterkunft.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Soziale Bedürfnisse betreffen Zugehörigkeit und Beziehungen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Physiologische Bedürfnisse sind Grundbedürfnisse wie Nahrung oder Schlaf.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Eine Haftpflichtversicherung deckt ein Sicherheitsbedürfnis ab.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Selbstverwirklichung betrifft persönliche Entfaltung, nicht Risikoabsicherung.' },
    ],
  },
  // 37. ae8bcad1 — CSR Anspruchsgruppen
  {
    id: 'ae8bcad1-800e-41a2-87f1-0e4926035653',
    fachbereich: 'BWL',
    musterlosung: 'Im CSR-Kontext verfolgen unterschiedliche Anspruchsgruppen eigene Interessen. Gesellschaft und NGOs fordern faire Arbeitsbedingungen, Investoren Transparenz, Konsumenten nachhaltige Produkte, Medien decken Missstände auf, der Staat reguliert und vermittelt, und das Unternehmen selbst will seine Strategie umsetzen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Konsumenten und Staat sind nur zwei von mehreren Anspruchsgruppen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: CSR betrifft weit mehr als nur Aktionäre und Unternehmensleitung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Mitarbeitende und Lieferanten allein decken das Interessenspektrum nicht ab.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Gesellschaft/NGOs, Investoren, Konsumenten, Medien, Staat und das Unternehmen haben unterschiedliche CSR-Interessen.' },
    ],
  },
  // 38. aeb9a788 — Einzelunternehmer 400k
  {
    id: 'aeb9a788-7ac1-4649-8531-68fda65492b0',
    fachbereich: 'BWL',
    musterlosung: 'Art. 957 Abs. 2 OR erlaubt Einzelunternehmen und Personengesellschaften mit einem Jahresumsatz unter 500\'000 Franken eine vereinfachte Buchführung. Diese umfasst eine Einnahmen-Ausgaben-Rechnung sowie eine Aufstellung der Vermögenslage (Inventar). Mit 400\'000 Franken Umsatz ist das Unternehmen gesetzeskonform.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Eine generelle Befreiung besteht nicht; es gibt aber die vereinfachte Buchführung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Unter 500\'000 Franken Umsatz genügt die vereinfachte Buchführung nach Art. 957 Abs. 2 OR.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Mitarbeiterzahl ist kein Kriterium, massgebend ist der Umsatz.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Doppelte Buchhaltung ist erst ab 500\'000 Franken Umsatz Pflicht.' },
    ],
  },
  // 39. aece7514 — Bruttoprinzip
  {
    id: 'aece7514-e5e6-437b-8789-6e3faed246a0',
    fachbereich: 'BWL',
    musterlosung: 'Das Bruttoprinzip (Verrechnungsverbot) verlangt, dass Aktiven und Passiven sowie Aufwände und Erträge separat und in voller Höhe ausgewiesen werden. Eine Verrechnung würde die Bilanz und die Erfolgsrechnung verkürzen und die Aussagekraft mindern. Das Prinzip ist Teil der ordnungsgemässen Buchführung.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Fremdwährungen sind zulässig, sofern in Stichtagskurse umgerechnet wird.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Rückstellungen sind unter bestimmten Bedingungen erlaubt oder sogar geboten.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Das Verrechnungsverbot untersagt die Saldierung von Aufwand und Ertrag oder Aktiven und Passiven.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Abkürzungen sind zulässig, sofern sie konsistent und verständlich sind.' },
    ],
  },
  // 40. aeded8b7 — TP vs Rückstellung
  {
    id: 'aeded8b7-dd10-464f-ab6a-912eea2ed53c',
    fachbereich: 'BWL',
    musterlosung: 'Transitorische Passiven betreffen bekannte Verpflichtungen mit klarem Betrag und klarer Fälligkeit, etwa den offenen Dezemberlohn. Rückstellungen werden dagegen gebildet, wenn der Betrag oder der Zeitpunkt der Zahlung unsicher ist, zum Beispiel bei Garantieansprüchen oder hängigen Rechtsstreitigkeiten.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Beide können Aufwände betreffen, die Unterscheidung liegt in der Sicherheit.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Bei TP sind Betrag und Fälligkeit bekannt, bei Rückstellungen unsicher.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Unterschied liegt in der Unsicherheit, nicht im Wesen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Rückstellungen können auch kurzfristig sein (z.B. Garantiefälle).' },
    ],
  },
  // 41. af8a0261 — Maschine Untertyp
  {
    id: 'af8a0261-19e1-42ba-865b-2f271d5f8ec3',
    fachbereich: 'BWL',
    musterlosung: 'Investitionsgüter werden in Potenzialfaktoren und Repetierfaktoren unterteilt. Potenzialfaktoren wie Maschinen und Gebäude werden über viele Jahre genutzt und im Produktionsprozess nicht verbraucht. Repetierfaktoren wie Rohstoffe und Betriebsmittel gehen dagegen im Prozess auf.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Repetierfaktoren werden im Produktionsprozess verbraucht, Maschinen nicht.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Maschinen sind Potenzialfaktoren mit langfristiger Nutzung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Maschinen sind keine Verbrauchsgüter; Ersatz nach Abnutzung ist kein Verbrauch im Prozess.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Konsumgüter dienen der direkten Bedürfnisbefriedigung, Maschinen nicht.' },
    ],
  },
  // 42. b0f8c1d4 — Mieteinnahme
  {
    id: 'b0f8c1d4-aa5e-4828-8ff9-94fa6e9f1c86',
    fachbereich: 'BWL',
    musterlosung: 'Die Bank als Aktivkonto nimmt zu und steht im Soll. Der Mietertrag als Ertragskonto nimmt zu und steht im Haben. Buchungssatz: Bank an Mietertrag 2\'400. Der Vorgang ist erfolgswirksam und erhöht den Gewinn.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein Aufwand entsteht nicht beim Empfang von Miete.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Richtung ist vertauscht; Erträge stehen im Haben.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Bank (Soll) an Mietertrag (Haben).' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Beim Empfang von Mieteinnahmen entsteht kein Mietaufwand.' },
    ],
  },
  // 43. b111cb2d — Privatkonto Vorgänge
  {
    id: 'b111cb2d-62a4-4f1a-a503-5e0ad6819d25',
    fachbereich: 'BWL',
    musterlosung: 'Das Privatkonto erfasst alle Vorgänge, die den Eigentümer persönlich betreffen und das Eigenkapital indirekt verändern. Dazu gehören private Zahlungen über das Geschäft, der monatliche Eigenlohn sowie Warenentnahmen für den Privatgebrauch. Die Büromiete ist dagegen ein regulärer Geschäftsaufwand.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Private Rechnungen über das Geschäftskonto sind Privatbezüge.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Büromiete ist Raumaufwand und kein Privatvorgang.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Der Eigenlohn wird als Privatvorgang erfasst.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Warenentnahmen für privat werden über das Privatkonto gebucht.' },
    ],
  },
  // 44. b1a4a971 — Lineare Abschreibung
  {
    id: 'b1a4a971-9b36-4f0e-945b-19454c86c909',
    fachbereich: 'BWL',
    musterlosung: 'Bei der linearen Abschreibung wird der Abschreibungsbetrag vom Anschaffungswert berechnet und ist jedes Jahr gleich hoch. Der Buchwert sinkt deshalb gleichmässig bis zum Restwert. Die Berechnung vom aktuellen Buchwert ist ein Merkmal der degressiven Abschreibung.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Der jährliche Abschreibungsbetrag bleibt konstant.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Die Berechnung erfolgt vom Anschaffungswert.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Der Buchwert sinkt jedes Jahr um denselben Betrag.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Berechnung vom aktuellen Buchwert ist die degressive Methode.' },
    ],
  },
  // 45. b1c76af0 — Hypothek Abnahme
  {
    id: 'b1c76af0-e9c2-4fab-997a-b47a8852e982',
    fachbereich: 'BWL',
    musterlosung: 'Die Hypothek ist ein Passivkonto. Bei Passivkonten werden Abnahmen im Soll gebucht, Zunahmen im Haben. Eine Teilrückzahlung reduziert die Schuld, wird also im Soll erfasst. Der Gegenbuchung (Bank) steht als Aktivkonto mit Abnahme im Haben gegenüber.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ob Ab- oder Zunahme im Soll steht, hängt vom Kontentyp ab.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Im Haben stehen Zunahmen bei Passivkonten, nicht Abnahmen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Rückzahlungen werden je nach Kontentyp anders gebucht.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Hypothek ist ein Passivkonto — Abnahmen stehen im Soll.' },
    ],
  },
  // 46. b1ef4f20 — EK vs FK
  {
    id: 'b1ef4f20-ad42-474e-bfc5-78c311fe428a',
    fachbereich: 'BWL',
    musterlosung: 'Eigen- und Fremdkapitalgeber verfolgen ähnliche Ziele: eine angemessene Rendite sowie die Sicherheit ihres Kapitals. Wenn das Unternehmen nachhaltig erfolgreich ist, profitieren beide Gruppen. Es besteht daher weitgehende Zielharmonie, auch wenn die konkreten Instrumente unterschiedlich sind.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Beide Gruppen stehen in direkter Beziehung zum Unternehmenserfolg.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Ziele beider Gruppen sind aufeinander bezogen, nicht neutral.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Zielkonflikte sind eher die Ausnahme als die Regel.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Zielharmonie — beide wollen Rendite und Sicherheit ihres Kapitals.' },
    ],
  },
  // 47. b1f1c115 — Sättigungsgrad hoch
  {
    id: 'b1f1c115-17d7-4dd0-b1b1-84fcaa7072f1',
    fachbereich: 'BWL',
    musterlosung: 'Ein hoher Sättigungsgrad zeigt an, dass der Markt weitgehend gedeckt ist und kaum noch organisch wachsen kann. Zusätzliche Umsätze sind dann nur über Marktanteilsgewinne erzielbar — ein Verdrängungskampf unter den Anbietern entsteht. Markteintritte werden dadurch schwieriger.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wachstum ist nur noch über Marktanteilsgewinne der Konkurrenz möglich.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Markteintritt wird schwieriger, nicht leichter.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Hoher Sättigungsgrad führt eher zu Preisdruck als zu Preissteigerungen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Wachstumschancen sind in gesättigten Märkten gerade begrenzt.' },
    ],
  },
  // 48. b462f3e3 — Warenverkauf auf Rechnung
  {
    id: 'b462f3e3-e4e4-46d9-9fc3-d2495823be02',
    fachbereich: 'BWL',
    musterlosung: 'Beim Verkauf auf Rechnung entsteht eine Forderung gegenüber dem Kunden. Das Aktivkonto Debitoren nimmt zu und steht im Soll, das Ertragskonto Warenverkauf nimmt zu und steht im Haben. Buchungssatz: Debitoren an Warenverkauf 25\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Debitoren (Soll, Zunahme) an Warenverkauf (Haben, Zunahme).' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Richtung ist vertauscht; Erträge stehen im Haben.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Bezahlt wird auf Rechnung, nicht per Bank.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Kreditoren sind Lieferantenschulden, hier handelt es sich um Kundenforderungen.' },
    ],
  },
  // 49. b4e5e105 — Hauptaufgabe Marketing
  {
    id: 'b4e5e105-2016-40e4-8b75-88a748e5385f',
    fachbereich: 'BWL',
    musterlosung: 'Marketing erkennt und befriedigt Kundenbedürfnisse. Es verbindet die Denkhaltung, das Unternehmen konsequent vom Markt her zu führen, mit konkreten Instrumenten wie Marktforschung, Produktgestaltung und Kommunikation. Andere Funktionen wie Einkauf oder HR sind von dieser Kernaufgabe abgegrenzt.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Einkauf ist Aufgabe der Beschaffung, nicht des Marketings.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Marketing erkennt und befriedigt Kundenbedürfnisse.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Rekrutierung und Schulung sind HR-Aufgaben.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Buchhaltung ist Aufgabe des Rechnungswesens.' },
    ],
  },
  // 50. b6cc8695 — Red Bull UAP
  {
    id: 'b6cc8695-8411-45a4-b473-5ad7a390ac89',
    fachbereich: 'BWL',
    musterlosung: 'Red Bull differenziert sich nicht primär über Produkteigenschaften, sondern über Image und Kommunikation. Die enge Verknüpfung mit Extremsport-Events schafft ein einzigartiges, emotionales Markenbild. Das entspricht einer UAP (Unique Advertising Proposition) — Differenzierung über Kommunikation statt über technische Produktmerkmale.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: UAP steht für Differenzierung über Kommunikation und Image.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Aggressive Preisstrategie zielt auf tiefen Preis, nicht auf emotionales Image.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: USP differenziert über einzigartige Produkteigenschaften, nicht über Kommunikation.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Nischenstrategie fokussiert auf ein Marktsegment, Red Bull bedient aber den Massenmarkt.' },
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
state.letzteSession = 32;
state.letzterLauf = now;

fs.writeFileSync('state.json', JSON.stringify(state, null, 2));

console.log(`Session 32 done. Appended ${appended} updates. Total verarbeitet: ${state.verarbeitet}`);
