#!/usr/bin/env node
// Session 36 — FINAL BATCH — 32 BWL (12 rf + 12 sort + 6 tkonto + 2 vis)
// Alle 32 Fragen ohne Teilerklärungen:
//   - rf-aussagen haben keine IDs in DB
//   - sort/tkonto/visualisierung haben keine Sub-Struktur

import fs from 'node:fs';

const UPDATES = [
  // === 12 BWL/richtigfalsch ===

  // 1. e0c747af — SWOT kombiniert intern+extern (korrekt=true)
  {
    id: 'e0c747af-6678-43fc-9e48-76fd0a470fa9',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Die SWOT-Analyse verbindet die interne Sicht (Stärken und Schwächen aus der Unternehmensanalyse) mit der externen Sicht (Chancen und Gefahren aus der Umweltanalyse). Diese Zusammenführung ist das Kernelement der SWOT und liefert die Grundlage, um Strategien abzuleiten, die die eigenen Stärken gezielt auf Marktchancen ausrichten.',
    teilerklaerungen: [],
  },

  // 2. e284f4dd — Marktvolumen = verkaufte Menge (korrekt=true)
  {
    id: 'e284f4dd-7bad-44df-8fae-30975d9db8df',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Das Marktvolumen misst die tatsächlich abgesetzte Menge oder den tatsächlichen Umsatz einer Leistung pro Jahr, aufsummiert über alle Anbieter. Es unterscheidet sich vom Marktpotenzial (theoretische Obergrenze) und vom eigenen Umsatz. Das Verhältnis des eigenen Umsatzes zum Marktvolumen ergibt den Marktanteil.',
    teilerklaerungen: [],
  },

  // 3. e8a7b743 — Produktivität (Menge) vs Wirtschaftlichkeit (Geld) (korrekt=true)
  {
    id: 'e8a7b743-7850-441d-996c-504275c1e803',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Die Produktivität setzt Output in Mengeneinheiten ins Verhältnis zum Input, etwa Stühle pro Arbeitsstunde. Die Wirtschaftlichkeit betrachtet dasselbe Verhältnis in Geldeinheiten (Ertrag in CHF zu Aufwand in CHF). Beide Kennzahlen messen die Effizienz, aber auf unterschiedlicher Bewertungsebene.',
    teilerklaerungen: [],
  },

  // 4. ed45c35d — Ertragskonten Haben zu, Soll ab (korrekt=true)
  {
    id: 'ed45c35d-8b10-43d9-bb46-8cfaab830afb',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Ertragskonten werden bei Zugängen im Haben (rechts) und bei Abnahmen oder beim Saldo im Soll (links) gebucht. Sie verhalten sich damit spiegelbildlich zu den Aufwandkonten. Der Saldo wird am Jahresende ins Ergebniskonto übertragen und trägt zum Reingewinn oder Reinverlust bei.',
    teilerklaerungen: [],
  },

  // 5. f6e0666c — Abgaswerte/Tabakwerbung = rechtliche Umweltsphäre (korrekt=true)
  {
    id: 'f6e0666c-3658-4c1f-abf6-c72eff420ac4',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Abgaswerte, Werbeverbote für Tabak und Ladenöffnungszeiten sind gesetzlich geregelt und gehören deshalb zur rechtlichen Umweltsphäre. Diese setzt verbindliche Rahmenbedingungen für unternehmerisches Handeln. Sie unterscheidet sich von der ökologischen Umweltsphäre, die Naturprozesse und Ressourcen, nicht Gesetze betrachtet.',
    teilerklaerungen: [],
  },

  // 6. f70d8136 — Etabliertes Unt. kann auf Marktanalyse verzichten (korrekt=FALSE)
  {
    id: 'f70d8136-9a15-4caa-820a-b88db733f926',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist falsch. Märkte verändern sich laufend durch neue Konkurrenten, veränderte Kundenbedürfnisse und technologischen Wandel. Auch langjährig erfolgreiche Unternehmen müssen die Markt- und Leistungsanalyse regelmässig wiederholen. Wer den Kontakt zur Marktrealität verliert, riskiert Fehlentscheide und Marktanteilsverluste.',
    teilerklaerungen: [],
  },

  // 7. f774e3a5 — Brent Spar 5'500 vs 130 Tonnen (korrekt=true)
  {
    id: 'f774e3a5-5a3b-4150-a6d8-d078001a9197',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Greenpeace hatte die verbliebene Ölmenge an Bord der Brent Spar massiv überschätzt (5\'500 statt tatsächlich 130 Tonnen). Der Fall zeigt, dass auch anerkannte Anspruchsgruppen fehlerhafte Daten verbreiten können. Unternehmen und Öffentlichkeit müssen deshalb auch NGO-Informationen kritisch prüfen.',
    teilerklaerungen: [],
  },

  // 8. f895e5b9 — Hohe Eintrittsbarrieren schützen (korrekt=true)
  {
    id: 'f895e5b9-f012-4ae3-ab7f-dc4b29e6d14a',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Hohe Eintrittsbarrieren wie Kapitalbedarf, Patente, starke Marken oder knappe Vertriebsstandorte erschweren den Markteintritt neuer Konkurrenten. Je schwieriger der Eintritt, desto geringer die Bedrohung für etablierte Anbieter. Die Gefahr neuer Marktteilnehmer ist eine der fünf Wettbewerbskräfte nach Porter.',
    teilerklaerungen: [],
  },

  // 9. f8a23ccc — Swisscom gemischtwirtschaftlich (korrekt=true)
  {
    id: 'f8a23ccc-7604-4091-bbc6-68b5dc1c6b05',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Die Swisscom ist gemischtwirtschaftlich organisiert: Der Bund hält die Aktienmehrheit, der Rest ist an der SIX Swiss Exchange frei gehandelt. Staat und Private tragen Eigentum und Risiko gemeinsam. Weitere typische Beispiele sind die Post sowie Kantonalbanken mit Staatsgarantie und privaten Aktionären.',
    teilerklaerungen: [],
  },

  // 10. fca278b4 — Strategische Ziele >3 Jahre (korrekt=true)
  {
    id: 'fca278b4-4a9b-44c8-ae05-0edfb074ba62',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Strategische Ziele haben einen Zeithorizont von mehr als drei Jahren, beispielsweise die Erschliessung neuer Märkte oder der Aufbau neuer Geschäftsfelder. Taktische Ziele bewegen sich im Bereich von einem bis drei Jahren, operative Ziele unter einem Jahr. Die drei Zeithorizonte bauen inhaltlich aufeinander auf.',
    teilerklaerungen: [],
  },

  // 11. fd06f26e — >75% im 3. Sektor (korrekt=true)
  {
    id: 'fd06f26e-bc46-43f0-98b5-32be6e46db84',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Rund 77 Prozent der Erwerbstätigen in der Schweiz arbeiten im dritten Sektor (Dienstleistungen, gemäss BFS). Der zweite Sektor (Industrie und Gewerbe) beschäftigt etwa 20 Prozent, der erste Sektor (Landwirtschaft) rund 3 Prozent. Die Schweiz ist damit eine typische Dienstleistungsgesellschaft.',
    teilerklaerungen: [],
  },

  // 12. fd8ff9f8 — Kollektivgesellschaft primär Gesellschaftsvermögen, subsidiär persönlich (korrekt=true)
  {
    id: 'fd8ff9f8-2813-44a1-98cd-dcc7d431cc46',
    fachbereich: 'BWL',
    musterlosung: 'Die Aussage ist richtig. Bei der Kollektivgesellschaft haftet primär das Gesellschaftsvermögen. Reicht dieses nicht aus, haften die Gesellschafter subsidiär (ergänzend), unbeschränkt und solidarisch mit ihrem Privatvermögen. Jeder Gesellschafter kann für die gesamte Restschuld belangt werden — ein wesentlicher Nachteil dieser Rechtsform.',
    teilerklaerungen: [],
  },

  // === 12 BWL/sortierung ===

  // 13. 0405eebe — Umweltsphären direktester → indirekster Einfluss
  {
    id: '0405eebe-dcf9-413e-bc9e-524e14a8aba3',
    fachbereich: 'BWL',
    musterlosung: 'Die ökonomische Umweltsphäre wirkt am direktesten: Preise, Zinsen und Nachfrage prägen tägliche Entscheide. Die technologische Umwelt verändert Prozesse und Geschäftsmodelle. Die rechtliche Umwelt setzt Grenzen, wirkt aber meist mittelbar. Die soziale Umwelt zeigt sich längerfristig; die ökologische wirkt vorwiegend indirekt über Regulierung und veränderte Kundenpräferenzen.',
    teilerklaerungen: [],
  },

  // 14. 229e995e — Anspruchsgruppen intern → extern
  {
    id: '229e995e-998f-4376-81a5-a4c208499806',
    fachbereich: 'BWL',
    musterlosung: 'Mitarbeitende sind die engste interne Anspruchsgruppe mit täglicher Interaktion. Eigentümer folgen als Kapitalgeber, oft weniger operativ eingebunden. Kunden und Lieferanten stehen in direkten Vertragsbeziehungen. Staat und Behörden setzen den regulatorischen Rahmen. Öffentlichkeit und NGOs bilden die äusserste Schicht, gewinnen aber über Medien und Social Media zunehmend an Einfluss.',
    teilerklaerungen: [],
  },

  // 15. 2498a63d — SWOT-Strategien günstigste → ungünstigste
  {
    id: '2498a63d-fd50-4de9-bf40-182225806a71',
    fachbereich: 'BWL',
    musterlosung: 'Die SO-Strategie (Stärken nutzen, Chancen ergreifen) ist die günstigste Ausgangslage und erlaubt offensives Wachstum. Die WO-Strategie nutzt Chancen, muss aber zuerst eigene Schwächen beheben. Die ST-Strategie setzt eigene Stärken defensiv gegen Gefahren ein. Die WT-Strategie ist die ungünstigste Lage: Schwächen treffen auf Gefahren — oft geht es um Rückzug oder Überleben.',
    teilerklaerungen: [],
  },

  // 16. 2f403545 — BCG typischer Lebenszyklus
  {
    id: '2f403545-6944-464f-bd28-49ff5944dcd8',
    fachbereich: 'BWL',
    musterlosung: 'Ein neues Produkt startet als Question Mark (hohes Marktwachstum, geringer Marktanteil, ungewisser Erfolg). Bei Erfolg wird es zum Star (Marktführer im Wachstumsmarkt). Mit nachlassendem Marktwachstum wird es zur Cash Cow (stabile Erträge). Am Ende kann es zum Poor Dog werden, wenn der Marktanteil sinkt und das Produkt abgelöst wird.',
    teilerklaerungen: [],
  },

  // 17. 346d8c33 — Porter 5 Kräfte für KMU grösste → kleinste Bedrohung
  {
    id: '346d8c33-075b-4f7c-a11b-e2dbb89a3484',
    fachbereich: 'BWL',
    musterlosung: 'Für ein etabliertes Schweizer KMU ist die direkte Rivalität in der Branche meist am bedrohlichsten (enger Markt, Preiskampf). Die Kundenverhandlungsmacht folgt, besonders bei wenigen Grosskunden. Neue Konkurrenten sind branchenabhängig eine reale Gefahr. Lieferantenmacht und Substitutionsbedrohung sind meist geringer, können aber in einzelnen Branchen dominieren.',
    teilerklaerungen: [],
  },

  // 18. 3f864652 — Marketingkonzept Schritte
  {
    id: '3f864652-e96d-47a2-afc9-2a83c9b243f9',
    fachbereich: 'BWL',
    musterlosung: 'Ein Marketingkonzept beginnt mit der Marktanalyse (Wo stehen wir?). Danach folgen Marketingziele (Wo wollen wir hin?) und Marketingstrategie (Welchen Weg gehen wir?). Der Marketing-Mix mit den vier P (Produkt, Preis, Platz, Promotion) bildet die konkreten Massnahmen. Umsetzung und Kontrolle schliessen den Prozess und liefern Rückkopplung für die nächste Planungsrunde.',
    teilerklaerungen: [],
  },

  // 19. 4ec89f90 — Verhaltensweisen passiv → aktiv
  {
    id: '4ec89f90-92c0-4099-8c41-6eeafd7aa45e',
    fachbereich: 'BWL',
    musterlosung: 'Reaktive Unternehmen warten ab und handeln erst nach einem Ereignis — die passivste Form. Aktive Unternehmen beobachten laufend und passen sich bei Bedarf an. Proaktive Unternehmen handeln vorausschauend, bevor Gesetze oder Trends sie dazu zwingen. Interaktive Unternehmen gestalten ihre Umwelt mit — durch Innovation, Branchenstandards oder politische Einflussnahme.',
    teilerklaerungen: [],
  },

  // 20. a2d2aa27 — Rechtsformen umfassende → beschränkte Haftung
  {
    id: 'a2d2aa27-cbe2-4e01-b623-bccdc258595f',
    fachbereich: 'BWL',
    musterlosung: 'Einzelunternehmung und Kollektivgesellschaft haften unbeschränkt mit dem Privatvermögen. Die Kommanditgesellschaft ist eine Mischform: Komplementäre unbeschränkt, Kommanditäre beschränkt. GmbH und AG sind Kapitalgesellschaften mit beschränkter Haftung — das Risiko ist auf das eingebrachte Kapital begrenzt. Die beschränkte Haftung ist ein zentraler Grund für die Beliebtheit der AG bei grösseren Unternehmen.',
    teilerklaerungen: [],
  },

  // 21. b92c6e6f — Strategischer Planungsprozess
  {
    id: 'b92c6e6f-14f0-44f3-b6b3-d829a416ba4e',
    fachbereich: 'BWL',
    musterlosung: 'Am Anfang stehen die normativen Grundlagen (Vision, Leitbild). Danach folgen die interne Analyse (Stärken/Schwächen) und die externe Analyse (Chancen/Gefahren). Die SWOT-Matrix synthetisiert die Ergebnisse. Darauf baut die Strategieformulierung mit Zielen und Massnahmen auf. Umsetzung sowie Evaluation und Kontrolle schliessen den Zyklus und liefern Inputs für die nächste Runde.',
    teilerklaerungen: [],
  },

  // 22. cd6c7d58 — Nutzwertanalyse Standortwahl
  {
    id: 'cd6c7d58-7fc5-4fb6-b6d2-f5a5caa292f5',
    fachbereich: 'BWL',
    musterlosung: 'Die Nutzwertanalyse beginnt mit der Definition der Bewertungskriterien. Diese werden anschliessend gewichtet (z.B. in Prozent). Danach werden die Alternativen je Kriterium bewertet. Die gewichteten Teilnutzen werden pro Alternative aufsummiert. Die Standortalternative mit dem höchsten Gesamtnutzwert ist rechnerisch die beste — das Ergebnis sollte abschliessend kritisch reflektiert werden.',
    teilerklaerungen: [],
  },

  // 23. cf41a3e0 — Zielsetzungsprozess
  {
    id: 'cf41a3e0-0781-43df-9b72-a802d1c39217',
    fachbereich: 'BWL',
    musterlosung: 'Der Zielsetzungsprozess verläuft vom Allgemeinen zum Konkreten. Die Vision gibt die langfristige Richtung vor. Formalziele betreffen das finanzielle Ergebnis (Gewinn, Rentabilität). Sachziele legen Leistungen und Produkte fest. Zielkonflikte (z.B. Gewinn versus Nachhaltigkeit) werden identifiziert und priorisiert. Darauf aufbauend werden operative Massnahmen geplant und umgesetzt.',
    teilerklaerungen: [],
  },

  // 24. dec3a454 — Produktlebenszyklus
  {
    id: 'dec3a454-946b-4581-904a-df3ec88cf6e9',
    fachbereich: 'BWL',
    musterlosung: 'Der Produktlebenszyklus beginnt mit der Einführung (hohe Kosten für Werbung und Vertrieb, geringer Umsatz). Im Wachstum steigt der Umsatz stark und erste Gewinne entstehen. In der Reife wird das Umsatzmaximum erreicht. In der Sättigung stagniert der Markt. In der Degeneration sinkt die Nachfrage und das Produkt wird typischerweise durch ein Nachfolgeprodukt ersetzt.',
    teilerklaerungen: [],
  },

  // === 6 BWL/tkonto ===

  // 25. 28ac08b9 — T-Konto 4200 Warenaufwand (Einkauf bar + Kredit - Rücksendung)
  {
    id: '28ac08b9-a4c1-42df-9d45-452bb2c8ccf1',
    fachbereich: 'BWL',
    musterlosung: 'Das Konto 4200 Warenaufwand ist ein Aufwandkonto mit Zugängen im Soll. Der Bareinkauf von CHF 1\'200 und der Kreditoreneinkauf von CHF 3\'500 ergeben Soll-Zugänge von CHF 4\'700. Die Rücksendung über CHF 400 mindert den Aufwand (Haben). Der Saldo von CHF 4\'300 steht im Soll und wird am Jahresende ins Erfolgskonto übertragen.',
    teilerklaerungen: [],
  },

  // 26. 76c54200 — T-Konto 1020 Bank/Post (AB + Kundenzahlung - Miete - Lohn)
  {
    id: '76c54200-f01e-406e-a982-fcc95f1cba6f',
    fachbereich: 'BWL',
    musterlosung: 'Das Konto 1020 Post/Bank ist ein Aktivkonto mit Zugängen im Soll. Der Anfangsbestand von CHF 5\'000 und die Kundenzahlung über CHF 1\'500 ergeben Soll-Buchungen von CHF 6\'500. Miete CHF 800 und Lohn CHF 3\'200 reduzieren den Bestand (Haben). Der Saldo beträgt CHF 2\'500 im Soll — der neue Kontostand.',
    teilerklaerungen: [],
  },

  // 27. 96a9ea63 — T-Konto 2000 Kreditoren (AB Haben + Wareneinkauf - Zahlung - Rücks.)
  {
    id: '96a9ea63-6369-42b5-a326-c8fbaa00169d',
    fachbereich: 'BWL',
    musterlosung: 'Das Konto 2000 Kreditoren ist ein Passivkonto mit Zugängen im Haben. Anfangsbestand CHF 6\'000 und Wareneinkauf CHF 4\'000 ergeben Haben-Buchungen von CHF 10\'000. Die Zahlung CHF 2\'500 und die Rücksendung CHF 300 reduzieren den Saldo (Soll). Der Saldo beträgt CHF 7\'200 im Haben — offene Verbindlichkeiten gegenüber Lieferanten.',
    teilerklaerungen: [],
  },

  // 28. bc115d51 — T-Konto 1000 Kasse (AB + Barverkauf + Kundenzahlung - Lieferantenzahlung)
  {
    id: 'bc115d51-ba53-4c4b-8e21-ee6d1c1e8f16',
    fachbereich: 'BWL',
    musterlosung: 'Das Konto 1000 Kasse ist ein Aktivkonto mit Zugängen im Soll. Anfangsbestand CHF 2\'000, Barverkauf CHF 600 und Kundenzahlung CHF 300 ergeben Soll-Buchungen von CHF 2\'900. Die Zahlung an den Lieferanten über CHF 400 mindert den Bestand (Haben). Der Saldo beträgt CHF 2\'500 im Soll — der neue Kassenbestand.',
    teilerklaerungen: [],
  },

  // 29. einr-tk-kasse — T-Konto 1000 Kasse (AB 100 - Einkauf 30)
  {
    id: 'einr-tk-kasse',
    fachbereich: 'BWL',
    musterlosung: 'Das Konto 1000 Kasse ist ein Aktivkonto. Der Anfangsbestand von CHF 100 steht im Soll. Der Einkauf von Eis über CHF 30 reduziert den Kassenbestand (Haben). Der Saldo beträgt CHF 70 im Soll und entspricht dem neuen Kassenbestand.',
    teilerklaerungen: [],
  },

  // 30. ueb-tk-bank — T-Konto 1020 Bank (AB 1000 - Miete 800)
  {
    id: 'ueb-tk-bank',
    fachbereich: 'BWL',
    musterlosung: 'Das Konto 1020 Bank ist ein Aktivkonto. Der Anfangsbestand von CHF 1\'000 steht im Soll. Die Mietzahlung über CHF 800 reduziert das Bankguthaben (Haben). Der Saldo beträgt CHF 200 im Soll und entspricht dem neuen Bankguthaben.',
    teilerklaerungen: [],
  },

  // === 2 BWL/visualisierung ===

  // 31. 247bfa2d — Marketing-Mix 4P
  {
    id: '247bfa2d-3de3-43ab-8ebd-2158f38fc5ed',
    fachbereich: 'BWL',
    musterlosung: 'Der Marketing-Mix (McCarthy, 1960) bündelt vier Instrumente zu einem abgestimmten Konzept. Product umfasst Sortiment, Qualität, Design und Markenbildung. Price regelt Preisgestaltung, Rabatte und Zahlungskonditionen. Place steuert Vertriebskanäle, Logistik und Standortwahl. Promotion betrifft Werbung, Verkaufsförderung und Public Relations. Die vier P müssen konsistent auf die Zielgruppe ausgerichtet sein.',
    teilerklaerungen: [],
  },

  // 32. 35de891f — St. Galler Modell
  {
    id: '35de891f-1b4b-45ed-adab-ed8bd1bb0d13',
    fachbereich: 'BWL',
    musterlosung: 'Das St. Galler Management-Modell zeigt das Unternehmen im Zentrum, eingebettet in Umweltsphären (Gesellschaft, Natur, Technologie, Wirtschaft). An der Schnittstelle zum Unternehmen stehen die Anspruchsgruppen: Eigentümer, Mitarbeitende, Kunden, Lieferanten, Staat, Öffentlichkeit und NGOs. Das Modell verdeutlicht die Wechselwirkungen zwischen Unternehmen, Umwelt und Stakeholdern.',
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
state.letzteSession = 36;
state.letzterLauf = now;

fs.writeFileSync('state.json', JSON.stringify(state, null, 2));

console.log(`Session 36 done (FINAL BATCH). Appended ${appended} updates. Total verarbeitet: ${state.verarbeitet}/2412`);
