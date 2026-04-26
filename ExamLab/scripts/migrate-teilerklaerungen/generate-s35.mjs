#!/usr/bin/env node
// Session 35 — 50 BWL/richtigfalsch
// R/F aussagen haben keine IDs -> teilerklaerungen bleibt leer

import fs from 'node:fs';

const UPDATES = [
  // 1. 190496ac — Strategie nur obere Führungsebene (falsch)
  {
    id: '190496ac-1eb3-40e1-ac27-99030a46a3b5',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Vision, Ziele und Strategie müssen allen Mitarbeitenden stufengerecht kommuniziert werden. Nur wenn alle Ebenen die gleiche Richtung kennen, ziehen sie am gleichen Strang und können die Strategie im Alltag umsetzen. Eine Strategie, die nur die Führungsetage kennt, bleibt wirkungslos.',
    teilerklaerungen: [],
  },
  // 2. 19ef458c — Strategische Planung linear (falsch)
  {
    id: '19ef458c-abba-48bc-975d-705e26817c80',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Strategische Planung ist ein zyklischer Prozess, kein einmaliger Durchlauf. Die Resultate der Evaluation und Kontrolle fliessen laufend in eine neue Planungsrunde ein. So reagiert das Unternehmen auf Marktveränderungen und korrigiert seine Ausrichtung fortlaufend.',
    teilerklaerungen: [],
  },
  // 3. 1a70a638 — Transitorische Buchungen (richtig)
  {
    id: '1a70a638-64d0-49e3-9d0b-bf1bf4e1f519',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Transitorische Buchungen werden am Bilanzstichtag (Jahresende) erfasst, um Aufwand und Ertrag periodengerecht zuzuordnen. Nach der Bilanzeröffnung im neuen Jahr werden sie durch Storno- beziehungsweise Gegenbuchungen wieder aufgelöst. So bleibt die Buchhaltung auf jede Rechnungsperiode bezogen korrekt.',
    teilerklaerungen: [],
  },
  // 4. 1e3bf41f — Konkurrenzkampf = attraktiv (falsch)
  {
    id: '1e3bf41f-a01e-4fcb-91ef-d8f097031b9b',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Je stärker der Konkurrenzkampf, desto grösser der Preisdruck und desto weniger attraktiv der Markt. Intensiver Wettbewerb drückt die Margen und erschwert Gewinne. Attraktiv sind Märkte mit geringem Rivalitätsgrad, also wenig starker Konkurrenz.',
    teilerklaerungen: [],
  },
  // 5. 2138164c — Dienstleistungen immateriell (richtig)
  {
    id: '2138164c-5905-4916-8fd6-9e6be2c93ba9',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Immaterielle Güter umfassen Dienstleistungen aller Art, Patente, Rechte und Lizenzen. Sie sind physisch nicht greifbar, im Gegensatz zu materiellen Sachgütern. Eine Haarschnitt oder eine Beratung sind typische Dienstleistungen.',
    teilerklaerungen: [],
  },
  // 6. 2a5cfa5f — Debitoren = Schulden (falsch)
  {
    id: '2a5cfa5f-6eb5-49a6-beeb-44830c6f8b10',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Debitoren (Forderungen aus Lieferungen und Leistungen) sind Guthaben des Unternehmens bei Kunden und stehen auf der Aktivseite. Schulden gegenüber Lieferanten heissen Kreditoren und stehen auf der Passivseite. Die Begriffe werden häufig verwechselt.',
    teilerklaerungen: [],
  },
  // 7. 2f025cf6 — Shareholder-Value gefährdet (richtig)
  {
    id: '2f025cf6-4105-4525-80d3-61bb18c044ee',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Wenn ein Unternehmen konsequent kurzfristige Gewinnmaximierung für die Aktionäre verfolgt, werden langfristige Investitionen (Forschung, Mitarbeitende, Nachhaltigkeit) vernachlässigt. Das gefährdet die Überlebensfähigkeit und das nachhaltige Wachstum. Ein einseitiger Shareholder-Value-Ansatz kann daher langfristige Ziele untergraben.',
    teilerklaerungen: [],
  },
  // 8. 2f5a0865 — Umweltsphären aktiv steuern (falsch)
  {
    id: '2f5a0865-9d76-4bab-bd6d-f746e9382a89',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Umweltsphären können vom Unternehmen weder gesteuert noch kontrolliert werden. Zwar bestehen Wechselwirkungen, aber Wirtschaft, Recht, Gesellschaft, Technologie und Ökologie entwickeln sich nach eigenen Gesetzmässigkeiten. Das Unternehmen kann sich nur anpassen oder beeinflussen, nicht kontrollieren.',
    teilerklaerungen: [],
  },
  // 9. 37635b5d — KI-Kundenbetreuung = Aktion (richtig)
  {
    id: '37635b5d-3a06-4991-9cfd-70a5ae19225d',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Wer als erster eine Innovation einführt, handelt proaktiv und gestaltet die Zukunft mit. Das Unternehmen reagiert nicht auf einen bestehenden Druck, sondern setzt selbst neue Impulse. Das entspricht der Verhaltensweise der Aktion, im Gegensatz zur reaktiven Anpassung.',
    teilerklaerungen: [],
  },
  // 10. 3a2c01e8 — Ertrag wie Passiv (richtig)
  {
    id: '3a2c01e8-0584-4d3e-8e17-5e5645c795ae',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Sowohl Passiv- als auch Ertragskonten nehmen im Haben (rechts) zu und im Soll (links) ab. Merksatz: Passiv- und Ertragskonten sind «Haben-Konten». Aktiv- und Aufwandkonten verhalten sich spiegelbildlich dazu.',
    teilerklaerungen: [],
  },
  // 11. 3aa285c8 — Evaluation erst am Ende (falsch)
  {
    id: '3aa285c8-07a3-4d7a-9e78-c588df50ce6c',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Umsetzung, Evaluation und Kontrolle laufen zeitlich parallel. So können korrigierende Rückkopplungen frühzeitig vorgenommen werden, statt erst am Schluss Fehlentwicklungen festzustellen. Die Evaluation ist ein laufender Prozess, kein einmaliger Schlusstermin.',
    teilerklaerungen: [],
  },
  // 12. 3ba9bad2 — Jahresgewinn aufs Privatkonto (falsch)
  {
    id: '3ba9bad2-a52e-4910-99bd-ea21bb48d7a7',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Der Jahresgewinn wird aus der Erfolgsrechnung direkt auf das Eigenkapitalkonto verbucht (Erfolgsrechnung an Eigenkapital). Das Privatkonto erfasst nur laufende Privatbezüge und Privateinlagen des Eigentümers und wird separat über das Eigenkapital abgeschlossen.',
    teilerklaerungen: [],
  },
  // 13. 3e658479 — tiefer Sättigungsgrad attraktiv (richtig)
  {
    id: '3e658479-b612-4d89-ad2f-4aadbe9229b4',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Ein tiefer Sättigungsgrad (Marktvolumen zu Marktpotenzial) bedeutet, dass der Markt noch nicht ausgeschöpft ist und sich in der Wachstumsphase befindet. Solche Märkte sind attraktiv, weil Umsatzsteigerungen ohne Verdrängung der Konkurrenz möglich sind.',
    teilerklaerungen: [],
  },
  // 14. 422e48b9 — Institutionen Anspruchsgruppen (richtig)
  {
    id: '422e48b9-62ca-4cdd-a879-3d4823a5b681',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Institutionen wie Gewerkschaften, Umweltverbände, Parteien und Medien bilden eine eigene Anspruchsgruppe. Sie erwarten Einhaltung ökologischer und sozialer Standards, teilweise auch finanzielle Unterstützung über Sponsoring. Sie beeinflussen die öffentliche Wahrnehmung des Unternehmens.',
    teilerklaerungen: [],
  },
  // 15. 428b0b1f — Marketing Bindeglied (richtig)
  {
    id: '428b0b1f-8994-4080-ae94-40f4a3497b4b',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Marketing bildet das Bindeglied zwischen Unternehmen und Markt. Es umfasst alle Aktivitäten, um Kundenbedürfnisse zu erkennen, die betriebliche Leistung darauf auszurichten und erfolgreich abzusetzen. Marketing dient also der Verbindung von Angebot und Nachfrage.',
    teilerklaerungen: [],
  },
  // 16. 438b90a4 — Frauenanteil Baugewerbe (richtig)
  {
    id: '438b90a4-0c0a-4a08-af5e-6ebbe0ab858b',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Der sehr tiefe Frauenanteil in Baugewerbe (11,7%) und Maschinenbau (17,3%) sowie der hohe Anteil in Pflege und Erziehung (über 60%) weisen auf geschlechterspezifische Berufswahlmuster hin. Diese werden durch gesellschaftliche Normen und Rollenbilder geprägt.',
    teilerklaerungen: [],
  },
  // 17. 4965961d — Konkurrenz keine Anspruchsgruppe (falsch)
  {
    id: '4965961d-776f-4c32-a589-aeea951f0ad7',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Die Konkurrenz ist trotz der Rivalität eine eigene Anspruchsgruppe. Sie erwartet faires Verhalten im Wettbewerb (kein Preisdumping, keine Industriespionage) und Mitarbeit in Branchenverbänden oder bei gemeinsamen Standards. «Feindlich gesinnt» zu sein macht eine Gruppe nicht zu einer Nicht-Anspruchsgruppe.',
    teilerklaerungen: [],
  },
  // 18. 4cf76ff9 — BCG alle Quadranten (falsch)
  {
    id: '4cf76ff9-dfe6-4905-87d3-d7481f8b4c27',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Ein ausgewogenes Portfolio muss nicht in allen vier Quadranten Leistungen haben — idealerweise gibt es möglichst wenige Poor Dogs. Wichtig ist, dass genügend Cash Cows die Question Marks und Stars finanzieren und dass Nachfolgeprodukte in der Pipeline sind.',
    teilerklaerungen: [],
  },
  // 19. 4e022366 — Wareneinkauf Aktivkonto (falsch)
  {
    id: '4e022366-44a5-4aaf-bad3-75c8c2d52ef6',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Wareneinkauf ist ein Aufwandkonto, weil es den Werteverzehr der eingekauften Handelsware erfasst. Das Aktivkonto heisst Warenvorrat und zeigt den Lagerbestand. Beim Einkauf werden Waren als Aufwand gebucht, nicht als Vermögenszugang.',
    teilerklaerungen: [],
  },
  // 20. 4e5cfebc — idealer Standort Kompromisse (richtig)
  {
    id: '4e5cfebc-26b4-4ba9-aab3-e65c9333f635',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Kein Standort erfüllt alle Kriterien gleichzeitig optimal — zentrale Lage, tiefe Mieten, gute Verkehrsanbindung und Arbeitsmarkt widersprechen sich oft. Unternehmen gewichten die Standortfaktoren nach ihrer Bedeutung und entscheiden sich für den besten Kompromiss, meist über eine Nutzwertanalyse.',
    teilerklaerungen: [],
  },
  // 21. 4e745bf2 — Produktlebenszyklus exakt (falsch)
  {
    id: '4e745bf2-40f2-477b-b8b7-1678caeaea38',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Der Produktlebenszyklus ist ein vereinfachtes Modell, das typische Muster beschreibt, keine exakten Zeitpunkte vorhersagt. Die Phasendauer variiert je nach Produkt stark (technologischer Wandel, Konsumverhalten, Konkurrenz). Um die Phase eines Produkts zu bestimmen, braucht es Marktforschung.',
    teilerklaerungen: [],
  },
  // 22. 4f036946 — Reaktion (richtig)
  {
    id: '4f036946-1008-4387-bc0a-aeba67c713f9',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Reaktion bedeutet, dass das Unternehmen auf Veränderungen der Umwelt antwortet und sich anpasst, statt sie selbst auszulösen. Im Gegensatz zur Aktion, bei der das Unternehmen proaktiv neue Entwicklungen vorantreibt. Reaktive Unternehmen warten, aktive gestalten.',
    teilerklaerungen: [],
  },
  // 23. 52654fa4 — Erklärungsmodell Stückkosten (richtig)
  {
    id: '52654fa4-1934-4cfc-8084-e75fccfc17bc',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Erklärungsmodelle stellen Hypothesen über Gesetzmässigkeiten auf. Die Annahme sinkender Stückkosten bei steigender Produktionsmenge beschreibt Skaleneffekte und ist ein klassisches Erklärungsmodell. Solche Modelle werden in der Realität empirisch überprüft.',
    teilerklaerungen: [],
  },
  // 24. 54952f78 — Kontenrahmen verbindlich (falsch)
  {
    id: '54952f78-597f-46ab-bd4a-bc7f23221814',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Der Kontenrahmen (z.B. KMU-Kontenrahmen) ist eine Empfehlung und Orientierungshilfe. Jedes Unternehmen wählt daraus die für seine Bedürfnisse nötigen Konten aus und erstellt damit seinen individuellen Kontenplan. Der Kontenrahmen ist also flexibel anpassbar.',
    teilerklaerungen: [],
  },
  // 25. 5c1ac2ec — Sekundärmarktforschung Konkurrenz (richtig)
  {
    id: '5c1ac2ec-1539-4a86-ad97-f8b373e51e04',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Zur Beantwortung von Fragen über die Konkurrenz genügt in der Regel die Sekundärmarktforschung: Beobachtung des Konkurrenzverhaltens und Auswertung öffentlich verfügbarer Unternehmensinformationen (Geschäftsberichte, Websites, Medienmitteilungen). Aufwändige Primärforschung ist dafür meist nicht nötig.',
    teilerklaerungen: [],
  },
  // 26. 5dd187fe — rel. Marktanteil 1.0 (richtig)
  {
    id: '5dd187fe-5e3e-4dec-87d0-a6b03e7c03bf',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Ein relativer Marktanteil von genau 1,0 bedeutet, dass der eigene Marktanteil gleich gross ist wie derjenige des grössten Konkurrenten. Werte über 1,0 zeigen Marktführerschaft, Werte unter 1,0 bedeuten, dass jemand anders grösser ist.',
    teilerklaerungen: [],
  },
  // 27. 5fd00d4c — rel. Marktanteil Definition (richtig)
  {
    id: '5fd00d4c-1d2d-45bc-8e4c-9911a61d12d4',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Der relative Marktanteil ergibt sich aus dem eigenen Marktanteil dividiert durch den Marktanteil des stärksten Konkurrenten. Die Kennzahl zeigt die eigene Position im Vergleich zur stärksten Konkurrenz und wird im BCG-Portfolio verwendet.',
    teilerklaerungen: [],
  },
  // 28. 6cd1d1bb — Cash Cows stabile Gewinne (richtig)
  {
    id: '6cd1d1bb-78cf-4225-be6a-d18a304a6296',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Cash Cows erzielen in einem reifen Markt einen hohen Marktanteil und beachtlichen Umsatz. Da das Marktwachstum gering ist, sind kaum noch Investitionen nötig. Die Kombination aus hohen Umsätzen und niedrigen Ausgaben bringt stabile, hohe Gewinne, die andere Geschäftsfelder finanzieren.',
    teilerklaerungen: [],
  },
  // 29. 6fcb4705 — Bilanzgleichung (richtig)
  {
    id: '6fcb4705-184f-4e43-b0c4-44e993db950e',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Die Bilanzgleichung lautet: Aktiven gleich Passiven. Jeder Vermögenswert (Aktivseite) muss entweder durch Fremd- oder Eigenkapital (Passivseite) finanziert sein. Die beiden Bilanzsummen sind deshalb immer identisch.',
    teilerklaerungen: [],
  },
  // 30. 73576539 — Zielneutralität (richtig)
  {
    id: '73576539-d0e4-4375-a0b6-b11ca0066b34',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Zielneutralität liegt vor, wenn die Erfüllung des einen Ziels die Erfüllung des anderen weder fördert noch behindert. Die Ziele existieren unabhängig voneinander. Gegenteil wären Zielharmonie (fördernd) oder Zielkonflikt (behindernd).',
    teilerklaerungen: [],
  },
  // 31. 7ee4a172 — Aufwand wie Aktiv (richtig)
  {
    id: '7ee4a172-45a8-4d8a-a7c9-9fc86bc95f10',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Sowohl Aktiv- als auch Aufwandkonten nehmen im Soll (links) zu und im Haben (rechts) ab. Merksatz: Aktiv- und Aufwandkonten sind «Soll-Konten». Passiv- und Ertragskonten verhalten sich spiegelbildlich.',
    teilerklaerungen: [],
  },
  // 32. 8789f0c8 — CSR keine Wirtschaft (falsch)
  {
    id: '8789f0c8-ff8b-4215-85e0-f072810f0eaf',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. CSR kann sich auch wirtschaftlich auszahlen: Verantwortungsvolles Handeln steigert das Ansehen bei Konsumenten, Investoren und Medien. Negative Berichte über Fehlverhalten verbreiten sich über soziale Medien schnell und schaden dem Unternehmen. CSR ist somit auch ökonomisch sinnvoll, nicht nur altruistisch.',
    teilerklaerungen: [],
  },
  // 33. 8ab533d1 — Marketingkonzept unabhängig (falsch)
  {
    id: '8ab533d1-ffaf-4337-b174-bb1eeb5cc402',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Das Marketingkonzept wird in Abstimmung mit der Unternehmensstrategie entwickelt, nicht unabhängig davon. Das Marketing setzt die strategische Ausrichtung operativ um — Marktsegmente, Positionierung und Marketing-Mix ergeben sich aus der übergeordneten Strategie.',
    teilerklaerungen: [],
  },
  // 34. 9137927b — Nischenstrategie (richtig)
  {
    id: '9137927b-a334-431d-891f-f5f73d5ea652',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Eine Nischenstrategie ermöglicht auch kleineren Unternehmen attraktive Gewinne. In der Nische stellen Kunden spezifische Ansprüche, die grosse Anbieter nicht bedienen. Spezialisierte Kompetenz schirmt die Nische vor Konzernen ab, die mit Massenprodukten nicht konkurrieren können.',
    teilerklaerungen: [],
  },
  // 35. 9417d201 — Grenzen Modelldenken Lehrplan (richtig)
  {
    id: '9417d201-83ee-451d-b121-734f833c1ef6',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Der kantonale Lehrplan Wirtschaft und Recht fordert explizit, dass Schülerinnen und Schüler Modelle anwenden und zur Lösung konkreter Probleme beiziehen, aber auch die Grenzen des Modelldenkens erkennen. Modelle sind Vereinfachungen der Realität und müssen kritisch reflektiert werden.',
    teilerklaerungen: [],
  },
  // 36. 9601e816 — Nutzwertanalyse 100% (richtig)
  {
    id: '9601e816-ff71-4b10-af3c-2ec3de683201',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Bei der Nutzwertanalyse müssen die Gewichtungen der Kriterien in der Summe genau 100% (oder 100 Punkte) ergeben. So wird sichergestellt, dass die Kriterien im richtigen Verhältnis zueinander stehen und das Endergebnis vergleichbar ist.',
    teilerklaerungen: [],
  },
  // 37. 9b6d8ae7 — Marktleistungen (richtig)
  {
    id: '9b6d8ae7-0597-4d3c-801b-84d36d99079c',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Konsum- und Investitionsgüter werden unter dem Begriff «Produkte» zusammengefasst und von den Dienstleistungen unterschieden. Produkte und Dienstleistungen bilden zusammen die Marktleistungen eines Unternehmens — also alles, was es am Markt anbietet.',
    teilerklaerungen: [],
  },
  // 38. 9bed5bbf — ohne Strategie langfristig (falsch)
  {
    id: '9bed5bbf-d9a7-4351-9676-5841b250711b',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Kurzfristiger Erfolg ohne Strategie ist möglich, aber langfristig riskant. Erst eine ausformulierte Strategie legt die Entwicklungsrichtung schriftlich fest, macht sie nachvollziehbar und systematisch überprüfbar. Viele Unternehmen scheitern daran, keine oder keine realistische Strategie zu haben.',
    teilerklaerungen: [],
  },
  // 39. 9c61ca82 — Maslow exakt (falsch)
  {
    id: '9c61ca82-d35c-41cf-8fae-622345762879',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Die Maslow\'sche Bedürfnispyramide ist ein vereinfachtes Modell und bildet die Realität nicht exakt ab. Menschen verfolgen oft höhere Bedürfnisse, obwohl niedrigere nicht vollständig befriedigt sind — Künstler arbeiten trotz finanzieller Not kreativ. Die starre Hierarchie ist eine bekannte Kritik am Modell.',
    teilerklaerungen: [],
  },
  // 40. a6c53265 — CSR Definition (richtig)
  {
    id: 'a6c53265-358e-4a7b-85ef-701ccf2d41cb',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Corporate Social Responsibility umfasst die freiwillige Übernahme gesellschaftlicher und ökologischer Verantwortung durch Unternehmen — über die gesetzlichen Pflichten hinaus. Dazu gehören faire Arbeitsbedingungen, Umweltschutzmassnahmen und soziales Engagement.',
    teilerklaerungen: [],
  },
  // 41. aa33d02e — alle Bedürfnisse (falsch)
  {
    id: 'aa33d02e-8c57-43e8-b558-879e51dd029d',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Dem Menschen gelingt es nie, alle Bedürfnisse vollständig zu befriedigen. Das Budget ist begrenzt, Ressourcen und Güter sind knapp. Auch mit viel Geld bleiben Bedürfnisse unerfüllt (Zeit, Gesundheit, Liebe). Diese Knappheit ist der Ausgangspunkt der Wirtschaft.',
    teilerklaerungen: [],
  },
  // 42. afeae250 — Juristische Personen buchführungspflichtig (richtig)
  {
    id: 'afeae250-e63c-4f55-a0ef-aeeae18c8c66',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Gemäss OR sind alle juristischen Personen (AG, GmbH, Genossenschaft etc.) unabhängig von ihrem Umsatz buchführungspflichtig. Für Einzelfirmen und Personengesellschaften gilt hingegen eine Umsatzschwelle von 500\'000 Franken pro Jahr.',
    teilerklaerungen: [],
  },
  // 43. b9b5ade1 — Rauchverbot rechtliche Umweltsphäre (richtig)
  {
    id: 'b9b5ade1-5c33-41f4-b0c2-ceb2814533c9',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Gesetze und Verordnungen wie das Rauchverbot gehören zur rechtlichen Umweltsphäre. Das Beispiel zeigt, wie eine neue gesetzliche Regelung direkte Auswirkungen auf Unternehmen haben kann — Gastronomiebetriebe mussten Räume umbauen oder mit veränderten Kundenströmen umgehen.',
    teilerklaerungen: [],
  },
  // 44. bd33b798 — Umweltsphären eindeutig (falsch)
  {
    id: 'bd33b798-6b17-4e37-9c98-adf6e2f3b5cf',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Die Umweltsphären sind in der Praxis nicht immer eindeutig abzugrenzen. So kann die Einhaltung von Umweltverordnungen sowohl zur ökologischen als auch zur rechtlichen Umweltsphäre gezählt werden. Die Sphären überlappen sich häufig und beeinflussen sich gegenseitig.',
    teilerklaerungen: [],
  },
  // 45. bdbf4ccf — Einführungsphase kaum Gewinn (richtig)
  {
    id: 'bdbf4ccf-55d3-414c-8635-c29c8345a8fd',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. In der Einführungsphase sind die Kosten hoch (Anfangsinvestitionen, Werbung, Bekanntmachung), während der Umsatz erst langsam wächst. Deshalb wird noch kaum Gewinn realisiert. Erst in der Wachstums- und Reifephase werden die Investitionen ertragswirksam.',
    teilerklaerungen: [],
  },
  // 46. cb7d783a — Erfolgspotenzial Wettbewerbsvorteil (richtig)
  {
    id: 'cb7d783a-d498-4132-b4bb-dfc1afe4d5ff',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Ein Erfolgspotenzial allein genügt nicht — es muss durch nachgelagerte Funktionen wie Produktion, Marketing und Vertrieb in einen tatsächlichen Wettbewerbsvorteil am Markt umgesetzt werden. Erst wenn Kunden den Vorteil wahrnehmen und honorieren, wird aus Potenzial realer Erfolg.',
    teilerklaerungen: [],
  },
  // 47. d255f0da — strategische UF übergeordnet (richtig)
  {
    id: 'd255f0da-b102-42c4-8788-e17c0b342dfd',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Die strategische Unternehmensführung bestimmt die längerfristigen Ziele und koordiniert die verschiedenen Funktionsbereiche wie Marketing, Produktion und Finanzen auf diese Ziele hin. Sie ist den betrieblichen Funktionen übergeordnet und gibt ihnen den Rahmen vor.',
    teilerklaerungen: [],
  },
  // 48. d54a1bbd — Fähigkeitsanalyse (richtig)
  {
    id: 'd54a1bbd-dd4e-4951-bbef-6ce0ec3ca4c9',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Die Fähigkeitsanalyse zeigt, in welchen Bereichen das Unternehmen gegenüber einem Hauptkonkurrenten Stärken oder Schwächen hat. Die Einschätzungen sollten möglichst mit objektiven Daten gestützt werden, statt auf reinen Annahmen zu beruhen.',
    teilerklaerungen: [],
  },
  // 49. df49f8b7 — Reifephase Mitkonkurrenten (richtig)
  {
    id: 'df49f8b7-8c95-4adc-9821-df6aa32d9965',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. In der Reifephase ist der Markt weitgehend gesättigt. Marktanteilsgewinne sind beinahe nur noch auf Kosten der Konkurrenz möglich. Marketingaktivitäten richten sich daher gegen die Mitkonkurrenten, zum Beispiel durch Betonung des Markenprestiges oder aggressive Preispolitik.',
    teilerklaerungen: [],
  },
  // 50. df5fe446 — Unternehmensmodell Wechselwirkungen (richtig)
  {
    id: 'df5fe446-7129-4e3e-8437-fbc7fc30f57c',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Im vollständigen Unternehmensmodell werden Unternehmen, Anspruchsgruppen und Umweltsphären zusammengeführt. Zwischen allen Elementen bestehen vielfältige Beziehungen und Wechselwirkungen, die das Unternehmen laufend analysieren und berücksichtigen muss. Dieses integrierte Denken ist die Grundlage ganzheitlicher Unternehmensführung.',
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
  if (state.fragen[u.id]?.status === 'done') {
    throw new Error(`Already done: ${u.id}`);
  }
  fs.appendFileSync('fragen-updates.jsonl', JSON.stringify(u) + '\n');
  state.fragen[u.id] = { status: 'done', zeitpunkt: now, teile: u.teilerklaerungen.length };
  appended++;
}

state.verarbeitet = (state.verarbeitet || 0) + appended;
state.letzteSession = 35;
state.letzterLauf = now;

fs.writeFileSync('state.json', JSON.stringify(state, null, 2));

console.log(`Session 35 done. Appended ${appended} updates. Total verarbeitet: ${state.verarbeitet}`);
