#!/usr/bin/env node
// Session 31 — 50 BWL/mc Fragen
// Appendet an fragen-updates.jsonl und updated state.json

import fs from 'node:fs';

const UPDATES = [
  // 1. 6eb1e17b — Was beschreibt ein Unternehmenskonzept?
  {
    id: '6eb1e17b-d03a-4cfa-a73c-338b3792dd6c',
    fachbereich: 'BWL',
    musterlosung: 'Das Unternehmenskonzept operationalisiert die Strategie. Es legt konkrete Ziele fest und beschreibt die Mittel und Methoden, mit denen die Strategie umgesetzt werden soll. Damit ist es das zentrale Planungsinstrument zwischen Vision und operativem Handeln.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Vision und Leitbild sind übergeordnete Grundlagen, das Konzept konkretisiert die Umsetzung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Buchhaltung dokumentiert Geschäftsfälle und ist kein strategisches Planungsinstrument.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Das Unternehmenskonzept definiert Ziele, Mittel und Methoden zur Strategieumsetzung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die SWOT-Analyse ist ein Analyseinstrument und keine Umsetzungsplanung.' },
    ],
  },
  // 2. 70c84274 — Rentabilität
  {
    id: '70c84274-4c9e-48da-9c1b-2f99a7336617',
    fachbereich: 'BWL',
    musterlosung: 'Die Rentabilität setzt den Gewinn ins Verhältnis zum eingesetzten Kapital (Gewinn / Kapital × 100). Sie misst, wie ertragreich das Kapital eingesetzt wurde, und ist eine Kernkennzahl der Erfolgsbeurteilung.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Liquidität misst die Zahlungsfähigkeit, nicht das Gewinn-Kapital-Verhältnis.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Wirtschaftlichkeit setzt Ertrag zu Aufwand ins Verhältnis, nicht Gewinn zu Kapital.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Produktivität misst Output je Input (z.B. Stück pro Stunde), ohne Geldgrösse.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Rentabilität = Gewinn / Kapital × 100 misst die Kapitalverzinsung.' },
    ],
  },
  // 3. 71f3b0d2 — Wirtschaftsgüter
  {
    id: '71f3b0d2-75df-46c6-b852-c01f73051023',
    fachbereich: 'BWL',
    musterlosung: 'Wirtschaftsgüter sind knapp und müssen bewirtschaftet werden. Sie werden von der Wirtschaft bereitgestellt und dienen der Bedürfnisbefriedigung. Freie Güter wie Luft sind demgegenüber unbegrenzt verfügbar und nicht Gegenstand der BWL.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wirtschaftsgüter sind knappe, bewirtschaftete Güter zur Bedürfnisbefriedigung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Freie Güter sind unbegrenzt verfügbar und nicht Gegenstand der BWL.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Naturgüter ist kein wirtschaftswissenschaftlicher Fachbegriff in dieser Systematik.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Luxusgüter sind eine Teilmenge der Wirtschaftsgüter, nicht der Oberbegriff.' },
    ],
  },
  // 4. 725813fd — Kreditoren Kontentyp
  {
    id: '725813fd-dc61-46b1-9f16-cacc796c1b30',
    fachbereich: 'BWL',
    musterlosung: 'Kreditoren sind offene Verbindlichkeiten gegenüber Lieferanten. Schulden stehen auf der rechten Bilanzseite und gelten als Passivkonto. Zunahmen werden im Haben, Abnahmen im Soll gebucht.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Aktivkonten zeigen Vermögen, Kreditoren sind aber Schulden gegenüber Lieferanten.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ertragskonten erfassen Wertzuwachs durch Leistungen, nicht Schulden.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Kreditoren sind Verbindlichkeiten und damit Passivkonto.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Aufwandskonten erfassen Werteverzehr, nicht offene Schulden.' },
    ],
  },
  // 5. 73083176 — Häufigste Rechtsform Schweiz
  {
    id: '73083176-fb7a-4c09-8ef6-11eeac4e0e5b',
    fachbereich: 'BWL',
    musterlosung: 'Die Einzelunternehmung ist in der Schweiz die häufigste Rechtsform, knapp vor GmbH und AG (Stand 2022). Sie eignet sich besonders für Kleinbetriebe, weil sie ohne Mindestkapital und mit wenig Formalitäten gegründet werden kann.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die AG liegt knapp hinter der Einzelunternehmung, da ein Mindestkapital von 100\'000 Franken nötig ist.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Kollektivgesellschaften sind deutlich seltener als Einzelunternehmen, GmbH und AG.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die GmbH ist zwar verbreitet, liegt aber hinter der Einzelunternehmung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Die Einzelunternehmung ist mit Abstand die häufigste Rechtsform.' },
    ],
  },
  // 6. 73e541cb — Verlust ins Eigenkapital
  {
    id: '73e541cb-9817-4304-b925-c9410ff9ea72',
    fachbereich: 'BWL',
    musterlosung: 'Bei einem Jahresverlust nimmt das Eigenkapital ab. Die Erfolgsrechnung wird im Haben abgeschlossen, das Eigenkapital im Soll belastet. Buchungssatz: Eigenkapital an Erfolgsrechnung 10\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Bank ist nicht betroffen, es geht um den Abschluss der Erfolgsrechnung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: «Verlust» ist kein eigenes Konto — der Verlust entsteht in der Erfolgsrechnung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Eigenkapital (Soll, Abnahme) an Erfolgsrechnung (Haben, Abschluss).' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Vertauschte Richtung — so würde Eigenkapital zunehmen, das wäre ein Gewinn.' },
    ],
  },
  // 7. 745fdbfb — Fähigkeitsanalyse
  {
    id: '745fdbfb-656b-461b-9c11-ae9f92cf499c',
    fachbereich: 'BWL',
    musterlosung: 'Die Fähigkeitsanalyse ist Teil der Unternehmensanalyse und vergleicht Stärken und Schwächen gegenüber dem Hauptkonkurrenten. Moderne Anlagen sind eine Stärke in der Produktion, schlechter bewerteter Service eine Schwäche in Marketing bzw. Kundenservice.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Stärke Produktion (moderne Anlagen), Schwäche Service (schlechter bewertet).' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ersatzprodukte wären eine externe Gefahr (Umweltanalyse), keine interne Fähigkeit.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Personal und Finanzen sind nicht Gegenstand des Beispiels.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Chancen und Gefahren gehören zur Umweltanalyse, nicht zur Fähigkeitsanalyse.' },
    ],
  },
  // 8. 748d05e2 — Zielharmonie
  {
    id: '748d05e2-6c98-4abf-a0a3-34cfa6795767',
    fachbereich: 'BWL',
    musterlosung: 'Bessere Arbeitsbedingungen führen zu zufriedeneren und produktiveren Mitarbeitenden, was wiederum die Gewinne erhöht. Beide Anspruchsgruppen profitieren — das ist Zielharmonie: Die Ziele beider Seiten werden gemeinsam erfüllt.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die kurzfristigen Kosten werden durch langfristige Mehrgewinne mehr als kompensiert.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Beziehung ist klar bestimmbar, beide Ziele werden erfüllt.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Zielharmonie — beide Anspruchsgruppen profitieren langfristig.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Bereiche sind eng verknüpft, nicht neutral.' },
    ],
  },
  // 9. 7529b560 — (+) auf Soll-Seite
  {
    id: '7529b560-1f74-4de9-b7bc-49e12ce54f41',
    fachbereich: 'BWL',
    musterlosung: 'Aktivkonten und Aufwandskonten haben ihre Zunahme auf der Soll-Seite (links). Passivkonten und Ertragskonten nehmen hingegen auf der Haben-Seite (rechts) zu. Die Soll-Seite links und die Haben-Seite rechts sind bei allen T-Konten gleich angeordnet.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Nur Aktiv- und Aufwandskonten nehmen im Soll zu, Passiv- und Ertragskonten im Haben.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Auch Aufwandskonten nehmen im Soll zu, nicht nur Aktivkonten.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Aktivkonten und Aufwandskonten nehmen im Soll zu.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Passiv- und Ertragskonten nehmen im Haben zu, nicht im Soll.' },
    ],
  },
  // 10. 76c62340 — Flüssigkeitsprinzip
  {
    id: '76c62340-d43c-4d6d-b9f2-e23f3582b0a4',
    fachbereich: 'BWL',
    musterlosung: 'Die Aktivseite der Bilanz ist nach dem Flüssigkeitsprinzip geordnet: Oben steht das Umlaufvermögen (flüssig, unter einem Jahr), unten das Anlagevermögen (länger gebunden). Auf der Passivseite gilt analog das Fälligkeitsprinzip.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein Alphabetprinzip existiert in der Bilanzgliederung nicht.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das Fälligkeitsprinzip gilt auf der Passivseite, nicht auf der Aktivseite.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Nicht die Betragshöhe, sondern die Liquidierbarkeit bestimmt die Reihenfolge.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Flüssigkeitsprinzip — vom liquidesten zum am wenigsten liquiden Vermögenswert.' },
    ],
  },
  // 11. 76d40523 — Brent Spar ökonomisch
  {
    id: '76d40523-5ae6-470c-8c6e-3aa00e65781a',
    fachbereich: 'BWL',
    musterlosung: 'Ökonomin Reeding argumentierte mit Kosten und finanziellen Kennzahlen (24 gegen 94 Millionen Franken). Ihr Bericht fokussiert damit auf die ökonomische Umweltsphäre, die sich mit Kosten, Gewinnen, Märkten und Wettbewerb befasst.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Technologische Aspekte wie Machbarkeit werden im Bericht nicht hervorgehoben.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Der Kostenvergleich ist eine typisch ökonomische Argumentation.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Soziale Aspekte wie Image oder Mitarbeitende stehen nicht im Fokus.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Ökologische Aspekte wie Umweltschäden werden hier nicht primär diskutiert.' },
    ],
  },
  // 12. 772d953e — Internationale Tätigkeit
  {
    id: '772d953e-5c07-4476-81e5-f65079ad94bf',
    fachbereich: 'BWL',
    musterlosung: 'Ein Unternehmen mit Produktionsstätten in mehreren Ländern und weltweitem Vertrieb ist international tätig. Beispiele aus der Schweiz sind Nestlé oder die Mammut Sports Group AG.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Nationale Tätigkeit bleibt auf ein Land beschränkt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Regionale Tätigkeit deckt nur einen Teil eines Landes ab.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Produktion und Vertrieb in mehreren Ländern definieren internationale Tätigkeit.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Lokale Tätigkeit beschränkt sich auf eine Gemeinde oder Stadt.' },
    ],
  },
  // 13. 7926ec07 — Kernziel Unternehmen
  {
    id: '7926ec07-93a3-4c53-9823-ec20432a5cde',
    fachbereich: 'BWL',
    musterlosung: 'Langfristig muss jedes Unternehmen eine nachhaltige und marktgerechte Rentabilität erwirtschaften. Nur wenn der Ertrag nachhaltig den Aufwand übersteigt, kann ein Unternehmen bestehen und in die Zukunft investieren.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Nachhaltige, marktgerechte Rentabilität ist das zentrale Überlebensziel.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Eine jährliche Umsatzverdopplung ist unrealistisch und kein Grundziel.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Zu viel Personal kann die Rentabilität gefährden, Mitarbeiterzahl ist kein Kernziel.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Produktionsmenge ohne Absatz bringt keine Rentabilität.' },
    ],
  },
  // 14. 79e85ce1 — Anspruchsgruppen Def
  {
    id: '79e85ce1-347f-4e7e-8a08-b98ee0a46f50',
    fachbereich: 'BWL',
    musterlosung: 'Anspruchsgruppen (Stakeholder) sind organisierte oder nicht organisierte Gruppen, die Ansprüche an ein Unternehmen stellen. Dazu zählen Kundschaft, Mitarbeitende, Lieferanten, Staat, Kapitalgeber, Konkurrenz und Öffentlichkeit.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Definition gemäss Stakeholder-Konzept — alle Gruppen mit Ansprüchen an das Unternehmen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Geschäftsleitung ist nur eine interne Gruppe, nicht die Gesamtheit der Stakeholder.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Aktionäre sind nur eine von vielen Anspruchsgruppen (Shareholder-Sicht).' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Staatliche Behörden sind nur eine von vielen Anspruchsgruppen.' },
    ],
  },
  // 15. 7a6e8c12 — SWOT Strategie
  {
    id: '7a6e8c12-c4cb-423f-9989-01ffd670acbb',
    fachbereich: 'BWL',
    musterlosung: 'Die SWOT-Analyse liefert die Grundlage für die Strategieentwicklung. Ziel der Strategie ist es, Stärken und Chancen zu maximieren sowie Schwächen und Gefahren zu minimieren — damit das Unternehmen langfristig erfolgreich im Markt positioniert wird.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Stärken sollen ausgebaut, nicht abgebaut werden.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Stärken/Chancen maximieren und Schwächen/Gefahren minimieren ist das Grundmuster.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Schwächen müssen abgebaut werden, sonst gefährden sie die Strategie.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das Ignorieren von Gefahren ist strategisch riskant und nicht sinnvoll.' },
    ],
  },
  // 16. 7c415048 — Eigenkapital nimmt zu
  {
    id: '7c415048-58a1-46f6-8c88-7c20f2488efe',
    fachbereich: 'BWL',
    musterlosung: 'Eigenkapital ist ein Passivkonto. Zunahmen auf Passivkonten werden im Haben (rechts) gebucht. Der Grund liegt in der Stellung des Eigenkapitals als Finanzierungsquelle auf der rechten Bilanzseite.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Eigenkapital ist kein Ertragskonto, auch wenn Zunahme im Haben stimmt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Passivkonten nehmen im Haben zu, nicht im Soll.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Eigenkapital ist Passivkonto — Zunahme im Haben.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Nur Aktiv- und Aufwandskonten nehmen im Soll zu, nicht alle.' },
    ],
  },
  // 17. 7c884e0a — Brent Spar Unternehmensmodell
  {
    id: '7c884e0a-9e37-4fa5-80d5-dc1d30541c48',
    fachbereich: 'BWL',
    musterlosung: 'Der Fall Brent Spar illustriert das Unternehmensmodell vollständig: Verschiedene Anspruchsgruppen (Kundschaft, Staat, Öffentlichkeit, Mitarbeitende, Aktionäre), die Umweltsphären (ökonomisch, ökologisch, sozial, technologisch, rechtlich) sowie die Wechselwirkungen und Zielkonflikte zwischen ihnen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Unternehmensmodell mit Stakeholdern und Umweltsphären ist im Fall eindrücklich sichtbar.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die doppelte Buchhaltung ist ein Rechnungswesen-Konzept, nicht das passende Modell.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Preisbildung auf Märkten ist ein VWL-Modell ohne Bezug zum Stakeholder-Konflikt.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Konjunkturzyklen beschreiben die Gesamtwirtschaft, nicht das Unternehmensumfeld.' },
    ],
  },
  // 18. 7cf89d55 — Gewinn ins Eigenkapital
  {
    id: '7cf89d55-5737-4358-a56e-cafb4f7aa91d',
    fachbereich: 'BWL',
    musterlosung: 'Beim Jahresabschluss wird die Erfolgsrechnung im Soll belastet (Abschluss), das Eigenkapital im Haben erhöht. Buchungssatz: Erfolgsrechnung an Eigenkapital 35\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Erfolgsrechnung (Soll-Abschluss) an Eigenkapital (Haben-Zunahme).' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: «Gewinn» ist kein Konto, der Gewinn steht in der Erfolgsrechnung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gleicher Grund — «Gewinn» ist kein Konto.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Vertauschte Richtung — das wäre die Buchung eines Verlusts.' },
    ],
  },
  // 19. 7d9bc9ad — Vorsichtsprinzip
  {
    id: '7d9bc9ad-d7ea-4a75-ad22-9c0ac57b2ea1',
    fachbereich: 'BWL',
    musterlosung: 'Das Vorsichtsprinzip (Imparitätsprinzip) verlangt, Verluste frühzeitig zu erfassen und Gewinne erst bei Realisierung auszuweisen. Aktiven werden im Zweifelsfall eher tief, Passiven eher hoch bewertet — so werden keine Scheingewinne ausgewiesen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Periodenabgrenzung regelt die zeitliche Zuordnung von Aufwand und Ertrag.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Das Vorsichtsprinzip schreibt vorsichtige Bewertung bei Unsicherheit vor.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Stetigkeit betrifft die gleichbleibende Bewertungsmethode über Jahre hinweg.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Klarheit fordert übersichtliche Darstellung, nicht vorsichtige Bewertung.' },
    ],
  },
  // 20. 7ecce9e9 — AG Vorteile (mehrfach)
  {
    id: '7ecce9e9-1e67-452d-a046-4e90af35a53c',
    fachbereich: 'BWL',
    musterlosung: 'Die AG bietet drei zentrale Vorteile: die Haftung ist auf das Gesellschaftsvermögen beschränkt, Aktien können einfach übertragen werden, und die Aktionäre bleiben anonym. Demgegenüber fallen bei Gründung Kosten an und das Mindestkapital beträgt 100\'000 Franken.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Nur das Gesellschaftsvermögen haftet, nicht das Privatvermögen der Aktionäre.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Aktien lassen sich unkompliziert kaufen oder verkaufen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Im Aktienregister sind die Aktionäre gegenüber Dritten nicht öffentlich sichtbar.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bei der Gründung fallen Beurkundungs- und Eintragungskosten an.' },
    ],
  },
  // 21. 7f01d982 — Anspruchsgruppen (mehrfach)
  {
    id: '7f01d982-c005-45a8-9add-6a14af4b1497',
    fachbereich: 'BWL',
    musterlosung: 'Kundschaft, Mitarbeitende und Eigenkapitalgeber sind klassische Anspruchsgruppen. Umweltsphären sind hingegen keine Anspruchsgruppen, sondern bilden das externe Umfeld (ökonomisch, ökologisch, sozial, rechtlich, technologisch), in dem Unternehmen und Anspruchsgruppen agieren.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Kundschaft erwartet gute Produkte und Dienstleistungen — klassische Anspruchsgruppe.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Mitarbeitende erwarten Lohn, gute Arbeitsbedingungen und Sicherheit.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Eigenkapitalgeber erwarten Rendite auf ihr eingesetztes Kapital.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Umweltsphären bilden den Rahmen, sind aber keine anspruchsstellenden Gruppen.' },
    ],
  },
  // 22. 82c8cbc0 — Rezession (mehrfach)
  {
    id: '82c8cbc0-d596-4f87-a757-6cbe669ae4bf',
    fachbereich: 'BWL',
    musterlosung: 'In einer Rezession sinken Umsatz und Nachfrage, weil Haushalte und Unternehmen weniger ausgeben. Das zwingt Unternehmen, ihre Strategie an die schwächere Konjunktur anzupassen. Technologische Entwicklung wird in Rezessionen meist eher gebremst, weil F&E-Budgets gekürzt werden.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Sinkende Kaufkraft führt zu Umsatzeinbrüchen bei vielen Gütern.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Haushalte und Unternehmen fragen in Abschwüngen weniger nach.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: F&E-Investitionen werden in Rezessionen meist gekürzt, nicht beschleunigt.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Unternehmen müssen Kosten senken oder sich neu positionieren.' },
    ],
  },
  // 23. 8581a2ce — BCG Stars
  {
    id: '8581a2ce-6557-4eda-b7cc-405a5ce421db',
    fachbereich: 'BWL',
    musterlosung: 'Stars haben einen hohen Marktanteil in wachsenden Märkten. Um diese Position zu verteidigen und auszubauen, sind hohe Investitionen in Werbung und Marktbearbeitung nötig. Sie erwirtschaften zwar Umsatz, binden aber auch viel Kapital.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Stars generieren hohen Umsatz, das ist genau ihr Merkmal.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Stars operieren in wachsenden, nicht in schrumpfenden Märkten.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Hohe Investitionen für Marktanteilserhalt erklären die Kostenintensität.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Stars werden am externen Markt verkauft, nicht intern verwendet.' },
    ],
  },
  // 24. 860f1a68 — Staats-Ansprüche (mehrfach)
  {
    id: '860f1a68-b574-49e6-bb28-7139067d6d02',
    fachbereich: 'BWL',
    musterlosung: 'Der Staat erwartet Steuereinnahmen, die Schaffung und Erhaltung von Arbeitsplätzen sowie das Einhalten der gesetzlichen Vorschriften. Dividenden hingegen sind ein Anspruch der Eigenkapitalgeber (Aktionäre), nicht des Staates.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Gewinn-, Lohn- und Mehrwertsteuern sind zentrale Staatseinnahmen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Arbeitsplätze sichern Beschäftigung und reduzieren Sozialkosten.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Der Staat erwartet Rechtstreue — z.B. Arbeits-, Umwelt- und Steuerrecht.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Dividenden fliessen an Aktionäre, nicht an den Staat.' },
    ],
  },
  // 25. 871a8459 — Differenzierung Porter
  {
    id: '871a8459-c1f0-496f-a120-3a59341c85d7',
    fachbereich: 'BWL',
    musterlosung: 'Die Differenzierungsstrategie nach Porter zielt darauf, sich durch Qualität, Service, Design oder Image (USP/UAP) von der Konkurrenz abzuheben. So entkommt das Unternehmen dem reinen Preiswettbewerb und kann höhere Preise durchsetzen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Preise senken ist die Kostenführerschaftsstrategie, nicht Differenzierung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Neue Märkte erschliessen ist eine Wachstumsstrategie (Ansoff), nicht Porter.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Differenzierung hebt sich durch einzigartige Leistungsmerkmale ab.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Nischenkonzentration ist die Fokussierungsstrategie bei Porter.' },
    ],
  },
  // 26. 88423e62 — Zielbeziehungen Diagramm
  {
    id: '88423e62-85d2-4551-a283-3c6ac9c1196d',
    fachbereich: 'BWL',
    musterlosung: 'Typ A zeigt Zielharmonie (beide Ziele steigen gemeinsam), Typ B Zielneutralität (Ziele beeinflussen sich nicht) und Typ C Zielkonkurrenz/Zielkonflikt (ein Ziel steigt, das andere sinkt). Die Zuordnung A-Harmonie, B-Neutralität, C-Konkurrenz ist daher korrekt.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: A zeigt gemeinsam steigende Ziele — das ist Zielharmonie, nicht Zielneutralität.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: C zeigt gegenläufige Ziele (Zielkonkurrenz), nicht Zielneutralität.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: A sind gemeinsam steigende Ziele (Harmonie), nicht Zielkonkurrenz.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: A=Zielharmonie, B=Zielneutralität, C=Zielkonkurrenz.' },
    ],
  },
  // 27. 894cd078 — Optimumprinzip Flughafen
  {
    id: '894cd078-754c-4a20-9ff9-48af35866818',
    fachbereich: 'BWL',
    musterlosung: 'Weder Input («vertretbare» Kosten) noch Output («mehr» Passagiere) sind exakt vorgegeben. Es wird eine optimale Relation zwischen Kosten und Nutzen gesucht. Das entspricht dem Optimumprinzip.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein ökonomisches Prinzip liegt klar vor, nämlich das Optimumprinzip.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Minimumprinzip fordert einen festen Output, hier nicht erfüllt.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Maximumprinzip fordert einen festen Input, hier ebenfalls nicht erfüllt.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Ohne feste Vorgabe für Input und Output liegt das Optimumprinzip vor.' },
    ],
  },
  // 28. 8be1f13e — Lohnaufwand Kontentyp
  {
    id: '8be1f13e-57ca-48b3-9e39-45d6639b32be',
    fachbereich: 'BWL',
    musterlosung: 'Lohnaufwand erfasst den Werteverzehr durch Löhne an Mitarbeitende. Werteverzehr sind Aufwände — das Konto ist also ein Aufwandskonto. Zunahmen werden im Soll gebucht.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ertragskonten erfassen Wertzuwachs, nicht Werteverzehr.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Löhne sind Werteverzehr → Aufwandskonto.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Passivkonten zeigen Schulden und Eigenkapital, nicht Aufwand.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Aktivkonten zeigen Vermögenswerte, nicht Werteverzehr.' },
    ],
  },
  // 29. 8c6f961d — Mietzahlung Buchungssatz
  {
    id: '8c6f961d-eb0f-48c3-8f85-450297c37756',
    fachbereich: 'BWL',
    musterlosung: 'Der Mietaufwand (Aufwandskonto) nimmt zu und wird im Soll gebucht. Die Bank (Aktivkonto) nimmt ab und steht im Haben. Buchungssatz: Mietaufwand an Bank 4\'500.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Mietaufwand (Soll, Zunahme) an Bank (Haben, Abnahme).' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Miete wird per Bank bezahlt, nicht auf Kredit.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Vertauschte Richtung — das hiesse Bank nimmt zu, Mietaufwand ab.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Raumaufwand und Eigenkapital passen nicht zur Mietzahlung per Bank.' },
    ],
  },
  // 30. 8cb82f45 — Marktpotenzial (mehrfach)
  {
    id: '8cb82f45-934d-460a-a020-0e0a07d07dde',
    fachbereich: 'BWL',
    musterlosung: 'Das Marktpotenzial ist die theoretisch höchstmögliche Absatzmenge oder der maximal mögliche Umsatz eines Marktes. Es beruht auf einer Schätzung der Aufnahmefähigkeit. Der tatsächlich realisierte Gesamtumsatz aller Anbieter heisst Marktvolumen — nicht Marktpotenzial.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Marktpotenzial = theoretische Obergrenze des Absatzes in einem Markt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Es wird in Franken (Umsatz) oder Stück (Absatz) ausgedrückt.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der tatsächlich erzielte Umsatz ist das Marktvolumen, nicht das Potenzial.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Die Aufnahmefähigkeit wird nie exakt gemessen, sondern geschätzt.' },
    ],
  },
  // 31. 8d440f9a — Journal vs Hauptbuch
  {
    id: '8d440f9a-b980-45b0-af66-b4475e1399b0',
    fachbereich: 'BWL',
    musterlosung: 'Das Journal (Grundbuch) erfasst Geschäftsfälle chronologisch nach Datum. Das Hauptbuch ordnet dieselben Buchungen nach Konten. Der Buchungsablauf lautet: Belege → Journal → Hauptbuch.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Journal = chronologisch, Hauptbuch = nach Konten geordnet.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Beide enthalten alle Konten, die Unterscheidung liegt in der Ordnung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Journal und Hauptbuch sind klar verschiedene Bücher mit unterschiedlichen Funktionen.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Zuordnung ist genau umgekehrt.' },
    ],
  },
  // 32. 8d567845 — Digitale Transformation
  {
    id: '8d567845-684b-4f62-8222-bcdd30a85afd',
    fachbereich: 'BWL',
    musterlosung: 'Digitale Transformation geht deutlich über einzelne IT-Massnahmen hinaus. Sie bedeutet die grundlegende Veränderung von Organisation und Geschäftsmodell durch Digitalisierung — etwa neue Produkte, neue Geschäftsfelder oder neue Formen der Marktbearbeitung.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Neue Hardware ist eine einzelne IT-Massnahme, keine Transformation.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ein Buchhaltungsprogramm ist eine Werkzeugänderung, keine strategische Transformation.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Eine Website ist ein digitales Instrument, kein grundlegender Wandel.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Veränderung von Organisation und Geschäftsmodell trifft den Kern der digitalen Transformation.' },
    ],
  },
  // 33. 8db28cd2 — Arbeitskosten Standort
  {
    id: '8db28cd2-bf62-4dd4-b3b8-9dae4f6bc709',
    fachbereich: 'BWL',
    musterlosung: 'Bei arbeitsintensiver Produktion mit niedrigen Know-how-Anforderungen fallen Arbeitskosten stark ins Gewicht. Da die Schweiz hohe Lohn- und Lohnnebenkosten hat, werden solche Produktionsstätten häufig in günstigere Länder verlagert.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Schweiz hat Arbeitskräfte, sie sind aber vergleichsweise teuer.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Hohe Arbeitskosten pushen die Verlagerung in günstigere Standorte.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Staat legt die Löhne in der Regel nicht direkt fest (Ausnahme: GAV, Mindestlöhne).' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bei arbeitsintensiver Produktion ist Automatisierung schwierig oder unwirtschaftlich.' },
    ],
  },
  // 34. 8e466f04 — Bilanzverlängerung
  {
    id: '8e466f04-1746-424b-8615-dffbdacce95f',
    fachbereich: 'BWL',
    musterlosung: 'Nehmen Aktiven und Passiven gleichzeitig zu, steigt die Bilanzsumme. Dieser Vorgang heisst Bilanzverlängerung. Beispiel: Kauf von Mobilien auf Rechnung (Mobilien Zunahme, Kreditoren Zunahme).',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Bilanzverkürzung wäre eine gleichzeitige Abnahme auf beiden Seiten.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Passivtausch ist eine Umstrukturierung innerhalb der Passivseite, nicht eine Summenzunahme.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Aktiven und Passiven steigen → Bilanzsumme wird länger.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Aktivtausch ist eine Umstrukturierung innerhalb der Aktivseite.' },
    ],
  },
  // 35. 8fe9fce8 — Bilanz
  {
    id: '8fe9fce8-6589-4b9d-8bed-0373ad57e3bd',
    fachbereich: 'BWL',
    musterlosung: 'Die Bilanz stellt die Vermögenswerte (Aktiven) und die Finanzierung (Passiven = Fremd- und Eigenkapital) eines Unternehmens zu einem bestimmten Stichtag gegenüber. Sie ist eine Stichtagsbetrachtung, keine Periodenbetrachtung.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Zahlungsströme zeigt die Geldflussrechnung, nicht die Bilanz.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Umsatzentwicklung zeigt die Erfolgsrechnung über eine Periode.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Vermögen und Finanzierung an einem Stichtag — Kerndefinition der Bilanz.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Gewinn oder Verlust zeigt die Erfolgsrechnung, nicht die Bilanz.' },
    ],
  },
  // 36. 904d1ad0 — Privatkonto Sollsaldo
  {
    id: '904d1ad0-9451-42a3-8f7f-b42a118a8b9a',
    fachbereich: 'BWL',
    musterlosung: 'Ein Sollsaldo auf dem Privatkonto bedeutet, dass die Privatbezüge grösser sind als die Gutschriften (z.B. Eigenlohn). Beim Abschluss wird das Eigenkapital reduziert: Eigenkapital an Privat 8\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein Verlust zeigt sich in der Erfolgsrechnung, nicht im Privatkonto.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Bezüge übersteigen Gutschriften → Eigenkapital sinkt um 8\'000.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das wäre ein Habensaldo; hier besteht aber ein Sollsaldo.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Bezüge wurden bereits vom Unternehmen ausgezahlt, es besteht keine Schuld des Eigentümers.' },
    ],
  },
  // 37. 90673d09 — Brent Spar Aldo Müller
  {
    id: '90673d09-917a-4850-89e7-4a76461585ac',
    fachbereich: 'BWL',
    musterlosung: 'Aldo Müller argumentierte aus sozialer Perspektive: Ein drohender Boykott und ein Imageverlust wären auf lange Sicht teurer als der teurere Landabbau. Zudem könnte sich Shell so als umweltbewusstes Unternehmen positionieren und langfristig Marktanteile sichern.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Mitarbeitenden waren im Argument nicht zentral.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Technische Risiken waren nicht das Hauptargument für den Landabbau.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Imagegewinn und langfristige Marktposition überwiegen die Mehrkosten.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die britische Regierung hatte die Versenkung grundsätzlich bewilligt.' },
    ],
  },
  // 38. 92048e91 — Strategische Führung Aufgabe
  {
    id: '92048e91-35e5-44d9-81ae-a9110cc77f28',
    fachbereich: 'BWL',
    musterlosung: 'Die strategische Unternehmensführung ist für die langfristige Gesamtkoordination verantwortlich. Sie denkt in Jahren bis Jahrzehnten und sichert den Erfolg auf lange Sicht, während operative Führung die tägliche Umsetzung übernimmt.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Arbeitsabläufe organisieren ist eine operative, nicht strategische Aufgabe.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Langfristiges Denken zur Sicherung des Unternehmenserfolgs ist ihr Kern.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Lohnfestsetzung ist operatives Personalmanagement.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Buchhaltung ist eine operative Querschnittsaufgabe.' },
    ],
  },
  // 39. 924b3b2d — Schuldenumwandlung
  {
    id: '924b3b2d-5246-47f7-8b09-a540719dc736',
    fachbereich: 'BWL',
    musterlosung: 'Die kurzfristige Schuld (Kreditoren) nimmt ab und wird im Soll gebucht, die langfristige Schuld (Darlehen) nimmt zu und steht im Haben. Es entsteht ein Passivtausch, die Bilanzsumme bleibt gleich. Buchungssatz: Kreditoren an Darlehen 5\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Es fliesst kein Geld über die Bank, nur die Schuldart wird getauscht.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Vertauschte Richtung — das hiesse Darlehen nimmt ab und Kreditoren nehmen zu.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Bank ist nicht beteiligt, es gibt keine Zahlung.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Kreditoren (Soll, Abnahme) an Darlehen (Haben, Zunahme).' },
    ],
  },
  // 40. 93fd4ccb — Warenverkauf T-Konto
  {
    id: '93fd4ccb-dcf8-4198-a7a2-94d00dd720f7',
    fachbereich: 'BWL',
    musterlosung: 'Warenverkauf ist ein Ertragskonto. Ertragskonten nehmen im Haben (rechts) zu. Debitoren als Aktivkonto nehmen dagegen im Soll (links) zu. Buchungssatz: Debitoren an Warenverkauf 8\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Warenverkauf ist Ertragskonto — Zunahme steht nicht im Soll.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Ertragskonten wie Warenverkauf nehmen im Haben zu.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Geldeingang ist nicht der Grund — der Kunde zahlt erst später.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Warenverkauf ist kein Aktivkonto, sondern ein Ertragskonto.' },
    ],
  },
  // 41. 940a88c7 — Diversifikation (mehrfach)
  {
    id: '940a88c7-8074-4d31-b45a-80f3e89aac8a',
    fachbereich: 'BWL',
    musterlosung: 'Bei der Diversifikation werden drei Formen unterschieden: horizontal (neue Produkte im bisherigen Bereich), vertikal (Übernahme vor- oder nachgelagerter Stufen) und lateral (völlig neues Geschäftsfeld). Eine «diagonale Diversifikation» ist kein etablierter Fachbegriff.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Horizontal erweitert das Sortiment im bisherigen Marktsegment.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Vertikal bedeutet Integration vor- oder nachgelagerter Wertschöpfungsstufen.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Lateral bezeichnet den Eintritt in ein artfremdes Geschäftsfeld.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: «Diagonale Diversifikation» ist kein etablierter Fachbegriff.' },
    ],
  },
  // 42. 94c01b65 — Minimumprinzip Tischplatten
  {
    id: '94c01b65-6937-4476-a562-78d19e6d1aad',
    fachbereich: 'BWL',
    musterlosung: 'Der Output (sechs Tischplatten) ist fest vorgegeben, der Input (Holzlatten) soll minimiert werden. Damit handelt es sich um das Minimumprinzip, auch Sparsamkeitsprinzip genannt.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Maximumprinzip würde bei festem Input maximalen Output suchen.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ergiebigkeitsprinzip ist ein anderer Name für das Maximumprinzip.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Optimumprinzip wäre eine freie Abwägung ohne feste Grösse.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Fester Output + Minimierung des Inputs = Minimumprinzip.' },
    ],
  },
  // 43. 94eb2eeb — Absatzorientierter Standort
  {
    id: '94eb2eeb-1a9a-46e4-bde5-58afb9e539dd',
    fachbereich: 'BWL',
    musterlosung: 'Für Betriebe mit Endkundenkontakt (Detailhandel, Restaurants, Hotels, Banken) ist die Nähe zur Kundschaft entscheidend. Bei diesen Unternehmen stehen absatzorientierte Standortfaktoren wie Passantenfrequenz und Kaufkraft im Umfeld im Vordergrund.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Bergbau richtet sich nach Rohstoffvorkommen, nicht nach Kundennähe.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Grossmaschinen werden ortsunabhängig verkauft und geliefert.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Home-Office-Softwareentwicklung ist nicht standortgebunden.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Detailhandel und Gastronomie brauchen Nähe zur Kundschaft.' },
    ],
  },
  // 44. 960a861f — Wareneinkauf
  {
    id: '960a861f-37b5-41fb-a42e-42d91dc2a03f',
    fachbereich: 'BWL',
    musterlosung: 'Das Konto Wareneinkauf ist ein Aufwandskonto. Es zeigt den Einstandswert der eingekauften Waren: Einkaufspreis abzüglich Rabatte und Skonti und zuzüglich Bezugsspesen.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wareneinkauf erfasst den Einstandswert eingekaufter Waren.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Warengewinn ergibt sich aus Warenverkauf minus Wareneinkauf.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Verkaufserlöse stehen im Konto Warenverkauf (Ertragskonto).' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Lagerbestände werden im Konto Warenbestand ausgewiesen.' },
    ],
  },
  // 45. 971d2c5b — Bankschuld in Darlehen
  {
    id: '971d2c5b-5dce-4e21-aa75-6a17c3431098',
    fachbereich: 'BWL',
    musterlosung: 'Der kurzfristige Bankkredit (Passivkonto) nimmt ab und steht im Soll, das langfristige Darlehen (Passivkonto) nimmt zu und steht im Haben. Es handelt sich um einen Passivtausch. Buchungssatz: Bankkredit an Darlehen 30\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Bankkredit (Soll, Abnahme) an Darlehen (Haben, Zunahme).' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das Bankkonto (Guthaben) ist nicht involviert, nur der Kredit wird umgewandelt.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Bank als Guthaben wird nicht angesprochen, der Bankkredit schon.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Vertauschte Richtung — das hiesse Darlehen nimmt ab und Bankkredit nimmt zu.' },
    ],
  },
  // 46. 972b31c1 — Brent Spar Lehren (mehrfach)
  {
    id: '972b31c1-ce5c-4a56-87f8-305b4d161749',
    fachbereich: 'BWL',
    musterlosung: 'Der Fall zeigt: Unternehmen müssen alle Stakeholder berücksichtigen, die öffentliche Meinung kann massiven Druck erzeugen und Zielkonflikte zwischen ökologischen, ökonomischen und sozialen Anliegen sind sorgfältig abzuwägen. Die billigste Lösung ist nicht automatisch die beste — Shell hätte bei der Versenkung zwar Kosten gespart, aber Image und Marktanteile verloren.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Nur ökonomisch zu denken reicht nicht, alle Anspruchsgruppen sind relevant.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Shell hätte bei der billigeren Versenkung langfristig viel mehr verloren.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Greenpeace und Medien haben öffentlichen Druck bis zum Boykott erzeugt.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Ökologie, Ökonomie und Soziales müssen gegeneinander abgewogen werden.' },
    ],
  },
  // 47. 976c2116 — Steuerrechnung Kreditoren
  {
    id: '976c2116-68a9-41fd-887d-cf1119f7c91e',
    fachbereich: 'BWL',
    musterlosung: 'Der Steueraufwand (Aufwandskonto) nimmt zu und wird im Soll gebucht. Die Kreditoren (Passivkonto) nehmen zu (offene Rechnung) und stehen im Haben. Buchungssatz: Steueraufwand an Kreditoren 12\'000.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Zahlung erfolgt erst später, die Bank ist bei Rechnungseingang nicht beteiligt.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Vertauschte Richtung — das wäre die Stornobuchung einer Gutschrift.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Steueraufwand (Soll, Zunahme) an Kreditoren (Haben, Zunahme).' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Bank ist nicht beteiligt, Ertrag statt Aufwand wäre zudem falsche Kategorie.' },
    ],
  },
  // 48. 97b37447 — Aufwandskonten (mehrfach)
  {
    id: '97b37447-573c-46d5-a25d-73d2f5d306bd',
    fachbereich: 'BWL',
    musterlosung: 'Lohnaufwand, Mietaufwand und Wareneinkauf erfassen Werteverzehr und sind daher Aufwandskonten. Finanzertrag erfasst einen Wertzuwachs (z.B. Zinseinnahmen) und gehört zu den Ertragskonten.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Löhne an Mitarbeitende sind klassischer Werteverzehr.' },
      { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Miete ist Werteverzehr für die Raumnutzung.' },
      { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Der Einstandswert eingekaufter Waren ist Werteverzehr.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Finanzertrag ist Wertzuwachs aus Kapitalanlagen — Ertragskonto.' },
    ],
  },
  // 49. 97bc1349 — Buchladen Verhalten
  {
    id: '97bc1349-9be3-4b8f-b074-668225cdf2d2',
    fachbereich: 'BWL',
    musterlosung: 'Der Buchladen reagiert auf den Druck durch Online-Händler (Reaktion), geht aber gleichzeitig kreativ neue Wege mit Lesungen und Café (Aktion). In der Praxis sind Reaktion und Aktion oft nicht trennscharf — hier liegt eine Mischform vor.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Reaktion auf Marktdruck kombiniert mit aktiver Geschäftsmodell-Erweiterung.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Reine Reaktion greift zu kurz — die Erweiterung um Erlebnisangebote ist aktiv.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Reine Aktion greift zu kurz — der Auslöser war externer Druck.' },
      { feld: 'optionen', id: 'opt-3', text: 'Falsch: Beharren wäre ein blosses Weitermachen ohne Anpassung, was hier gerade nicht der Fall ist.' },
    ],
  },
  // 50. 983198ae — Leistungswirtschaftlicher Bereich
  {
    id: '983198ae-458b-45c6-9018-08ced8bb3cef',
    fachbereich: 'BWL',
    musterlosung: 'Der leistungswirtschaftliche Bereich eines Unternehmenskonzepts umfasst Ziele zu Produkten, Märkten und Image. Gewinn und Kapital gehören zum finanzwirtschaftlichen Bereich, Mitarbeitende und Umwelt zum sozialen Bereich.',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-0', text: 'Falsch: Mitarbeiter- und Umweltziele gehören zum sozialen Bereich.' },
      { feld: 'optionen', id: 'opt-1', text: 'Falsch: Steuer- und Dividendenpolitik gehören zum finanzwirtschaftlichen Bereich.' },
      { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gewinn- und Kapitalziele gehören zum finanzwirtschaftlichen Bereich.' },
      { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Markt-, Produkt- und Imageziele sind der Kern des leistungswirtschaftlichen Bereichs.' },
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
state.letzteSession = 31;
state.letzterLauf = now;

fs.writeFileSync('state.json', JSON.stringify(state, null, 2));

console.log(`Session 31 done. Appended ${appended} updates. Total verarbeitet: ${state.verarbeitet}`);
