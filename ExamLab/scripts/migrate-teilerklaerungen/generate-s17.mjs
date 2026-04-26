#!/usr/bin/env node
/**
 * Session 17: 50 VWL-Fragen (alle mc).
 * Erste Hälfte des 100er-Batches nach Fachbereich → Typ → ID.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  { id: 'c219a105-1eab-425b-8d49-f4f3adc2d76a', fachbereich: 'VWL', musterlosung: 'Das langfristige Wachstum der Staatsausgaben wird durch mehrere ökonomische Theorien erklärt. Wagners Gesetz postuliert ein überproportionales Wachstum mit steigendem Wohlstand. Die Public-Choice-Theorie (Neue Politische Ökonomie) zeigt, dass Verwaltungen ihr Budget maximieren. Zudem steigt die Nachfrage nach öffentlichen Gütern wie Bildung oder Gesundheit mit zunehmendem Einkommen. Sinkende Exportquoten haben dagegen keinen theoretischen Zusammenhang mit dem Ausgabenwachstum.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wagners Gesetz — Staatsausgaben steigen überproportional zum BIP bei wachsendem Wohlstand.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Public-Choice-Ansatz erklärt Ausgabenwachstum durch Budgetmaximierungsverhalten der Verwaltung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Exportquoten und Staatsausgabenwachstum haben keinen theoretisch etablierten Zusammenhang.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Mit steigendem Wohlstand wächst die Nachfrage nach Bildung, Gesundheit und Kultur.' },
  ] },
  { id: 'c43ba233-3e89-405b-9645-e87217d657c3', fachbereich: 'VWL', musterlosung: 'Bei negativen externen Effekten liegen die Grenzkosten (GK) über den privaten Kosten (PK). Eine Pigou-Steuer in Höhe der externen Kosten pro Einheit internalisiert diesen Unterschied: Sie hebt die private Angebotskurve auf das GK-Niveau. Das neue Marktgleichgewicht fällt dann mit dem sozialen Optimum Q* zusammen, der Wohlfahrtsverlust verschwindet. Ökonomisch sauberste Lösung bei klar messbaren Externalitäten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Eine höhere Nachfrage würde die Überproduktion gegenüber Q* noch verstärken.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Subventionen senken die Kosten und führen zu noch mehr Produktion, nicht zu weniger.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Höchstpreise setzen an den Symptomen an, internalisieren externe Kosten aber nicht.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Eine Pigou-Steuer in Höhe der externen Kosten verschiebt PK auf GK und erreicht Q*.' },
  ] },
  { id: 'c45e86a5-5076-4916-bd58-32e6dc7cbc25', fachbereich: 'VWL', musterlosung: 'Indirekte Steuern wie die Mehrwertsteuer belasten alle Konsumenten mit demselben Satz. Haushalte mit tiefem Einkommen geben anteilsmässig mehr für den Konsum aus und sparen weniger — ihre effektive Steuerlast am Einkommen ist deshalb höher als bei reicheren Haushalten. Diesen Effekt nennt man degressiv (regressiv): Der relative Belastungsanteil sinkt mit steigendem Einkommen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die MwSt gilt für fast alle Güter, nicht nur Luxus — Luxus würde eher progressiv wirken.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Unternehmen überwälzen die MwSt auf die Endkonsumenten, die Last tragen Haushalte.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Bei tiefem Einkommen fliesst ein grösserer Anteil in den besteuerten Konsum.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der MwSt-Satz ist konstant — die Degression entsteht durch die Konsumquote, nicht den Satz.' },
  ] },
  { id: 'c4af7ea0-f031-4b09-b91f-f2d1287c12d4', fachbereich: 'VWL', musterlosung: 'Die Mengensteuer reduziert die gehandelte Menge von Q* auf Q_t. Für die Einheiten dazwischen wäre die Zahlungsbereitschaft höher als die Grenzkosten — der Handel wäre für beide Seiten vorteilhaft gewesen. Die Steuer verhindert diesen Austausch. Der Wohlfahrtsverlust (Deadweight Loss) geht weder an Konsumenten noch Produzenten noch den Staat — er entsteht einfach durch verhinderten Handel.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Entgangener Nutzen aus verhinderten Handelsgeschäften zwischen Q_t und Q*.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Steuereinnahmen des Staates sind separat — sie entsprechen dem Rechteck aus Steuersatz und Q_t.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der entgangene Produzentengewinn ist Teil des WV, aber nicht die ganze Fläche.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Konsumentenrente sinkt, ist aber nicht vollständig verloren.' },
  ] },
  { id: 'c507dfeb-9b43-4722-a226-efe77bb9012f', fachbereich: 'VWL', musterlosung: 'Zwischen 2008 und 2018 wuchsen die Bundesausgaben für Bildung mit rund +67 % am stärksten. Der Bereich soziale Wohlfahrt legte um etwa +27 % zu, getrieben von demografischer Alterung und Gesundheitskosten. Verkehrsausgaben stiegen moderat, die Landesverteidigung nahm real leicht ab. Einzig die Ausgaben für Finanzen und Steuern sanken (rund −5 %), nicht zuletzt wegen tiefer Zinsen auf der Bundesschuld.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Mit rund +67 % wuchs der Bildungsbereich prozentual am stärksten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Soziale Wohlfahrt wuchs zwar stark (+27 %), aber weniger als Bildung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Verkehr wuchs moderat — stabilere Infrastrukturausgaben ohne demografischen Druck.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Landesverteidigung verzeichnete kein starkes Wachstum, real sogar tendenziell Rückgang.' },
  ] },
  { id: 'c575b949-4f23-4b13-97a6-556006c61e6e', fachbereich: 'VWL', musterlosung: 'Der Nationale Finanzausgleich (NFA) ist ein Ausgleichsmechanismus zwischen den Kantonen. Ressourcenstarke Geberkantone wie Zug, Zürich, Basel-Stadt oder Schwyz leisten Beiträge an ressourcenschwache Nehmerkantone wie Uri, Jura oder das Wallis. Ziel ist, allen Kantonen eine minimale finanzielle Ausstattung zu sichern und die föderale Aufgabenerfüllung zu ermöglichen. Der Bund beteiligt sich am Ausgleich.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der NFA verteilt Mittel um, er senkt die Steuern nicht generell.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der NFA vereinheitlicht die Kantonssteuern nicht — die Steuerhoheit bleibt bei den Kantonen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Ressourcenstarke zahlen an ressourcenschwache Kantone zur Sicherung der Minimalausstattung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die SNB vergibt keine Kredite an Kantone — das wäre eine Monetisierung.' },
  ] },
  { id: 'c68abe75-4de6-403f-ab2e-d67ee20e5e74', fachbereich: 'VWL', musterlosung: 'Ein bindender Höchstpreis senkt die Gesamtwohlfahrt um die Fläche C (Wohlfahrtsverlust). Die Fläche B wird lediglich von Produzenten zu Konsumenten umverteilt — ein reiner Transfer. Fläche C dagegen geht verloren, weil Einheiten zwischen Q_A (neu angebotene Menge) und Q* nicht mehr gehandelt werden, obwohl der Handel für beide Seiten vorteilhaft wäre. Klassischer Deadweight-Loss durch staatlichen Markteingriff.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: B ist nur umverteilt, kein Verlust — nur C geht verloren.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: C ist der Wohlfahrtsverlust — verhinderter Handel zwischen Q_A und Q*.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Konsumenten profitieren teilweise, aber C geht insgesamt verloren.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: B wird umverteilt, aber C verringert die Gesamtwohlfahrt.' },
  ] },
  { id: 'c6a43629-4acf-41a9-af8c-978d0d2de9fd', fachbereich: 'VWL', musterlosung: 'Die VWL hat vier Hauptaufgaben: Beschreiben, Erklären, Prognostizieren und Beeinflussen. Sie erfasst wirtschaftliche Tatbestände empirisch (z.B. Arbeitslosenquote), analysiert kausale Zusammenhänge (z.B. Inflationsursachen) und formuliert Handlungsempfehlungen für die Wirtschaftspolitik. Gesetze zu erlassen ist dagegen Aufgabe des Parlaments — die VWL liefert die Analyse, nicht die Legiferierung. Prognosen sind hier als vierte Aufgabe nicht aufgeführt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Erheben von Indikatoren wie der Arbeitslosenquote zählt zur Beschreibung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Gesetze erlassen ist Parlamentsaufgabe — die VWL berät und empfiehlt nur.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Kausale Zusammenhänge (z.B. Preisentwicklung) zu erklären ist VWL-Kern.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Handlungsempfehlungen für die Wirtschaftspolitik sind die vierte Aufgabe.' },
  ] },
  { id: 'c6e05ec6-b792-4796-9658-4be7e751b109', fachbereich: 'VWL', musterlosung: 'Ergänzungsleistungen (EL) sind ein Rechtsanspruch für Bezügerinnen und Bezüger von AHV- oder IV-Renten, deren Einkommen die minimalen Lebenskosten nicht deckt. Sie ergänzen die Sozialversicherungen gezielt. Die Sozialhilfe ist dagegen das letzte soziale Netz: Sie richtet sich an alle Bedürftigen, die weder über Versicherungsleistungen noch eigene Mittel ihren Lebensunterhalt bestreiten können. Zuständig sind Gemeinden und Kantone.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: EL als Rechtsanspruch bei AHV/IV-Bezug, Sozialhilfe als universelles letztes Netz.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: EL und Sozialhilfe haben unterschiedliche Zielgruppen und Rechtsgrundlagen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Höhe allein macht den Unterschied nicht aus — es geht um Anspruchsgrundlage und Zielgruppe.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Sozialhilfe wird von Gemeinden/Kantonen getragen, EL von Kantonen (mit Bundesbeitrag).' },
  ] },
  { id: 'c771beb6-87e5-4a80-900a-d44911b496f5', fachbereich: 'VWL', musterlosung: 'Kritiker staatlicher Beschäftigungsprogramme weisen auf zwei zentrale Probleme hin. Erstens wirken sie oft prozyklisch, weil die politische Umsetzung Zeit braucht und Impulse häufig zu spät oder zu stark kommen. Zweitens konservieren sie bestehende Strukturen, statt den notwendigen Strukturwandel zu ermöglichen. Arbeitsplätze werden künstlich erhalten, obwohl die Ressourcen produktiver in neuen Branchen eingesetzt wären. Der keynesianische Ansatz verlangt daher gutes Timing und klare Exit-Strategien.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Beschäftigungsprogramme kosten den Staat viel Geld — sie sind nicht gratis.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Timing-Probleme führen zu prozyklischer Wirkung, Strukturen werden konserviert.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Sie erhöhen kurzfristig die Staatsausgaben und damit häufig die Schulden.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Vollbeschäftigung ist keine automatische Folge — ein Teil der Arbeitslosigkeit bleibt strukturell.' },
  ] },
  { id: 'c8c04da7-d826-4f4f-95b1-069fb0fe925d', fachbereich: 'VWL', musterlosung: 'Der Alterslastquotient zeigt, wie viele Erwerbstätige (20–64-Jährige) auf eine Person über 64 kommen. 1948 lag das Verhältnis bei 9.5:1 — 9.5 Erwerbstätige finanzierten einen Rentner. Heute sind es noch 2.9:1, bis 2050 wird eine weitere Abnahme auf 2:1 erwartet. Diese demografische Entwicklung ist die zentrale Herausforderung für das Umlageverfahren der AHV (1. Säule).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Quotient war nie stabil — er ist kontinuierlich gefallen seit 1948.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Alterung der Gesellschaft verändert das Verhältnis deutlich.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Richtung ist umgekehrt — der Quotient ist gesunken, nicht gestiegen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Rückgang von 9.5:1 (1948) auf heute 2.9:1, Prognose 2:1 bis 2050.' },
  ] },
  { id: 'c9156e09-190c-40d4-bba2-d8f8d10827cd', fachbereich: 'VWL', musterlosung: 'Sicherheitsbedürfnisse bilden die zweite Stufe in Maslows Pyramide. Sie umfassen Schutz vor Unsicherheit, finanzielle Sicherheit, gesicherte Arbeit und Wohnen. Eine Hausratversicherung oder ein fester Arbeitsvertrag mit Kündigungsschutz zählen dazu. Mitgliedschaften in Vereinen oder gemeinsame Konzertbesuche gehören zur dritten Stufe — den sozialen Bedürfnissen nach Zugehörigkeit und Gemeinschaft.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Hausratversicherung schützt vor finanziellen Risiken — klassisches Sicherheitsbedürfnis.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Sportvereinsmitgliedschaft befriedigt soziale Bedürfnisse (Zugehörigkeit).' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Ein fester Arbeitsvertrag bietet wirtschaftliche Sicherheit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Ein Konzertbesuch mit Freunden deckt soziale Bedürfnisse ab.' },
  ] },
  { id: 'c96842ed-8237-4e98-9a27-ee6ff56bb114', fachbereich: 'VWL', musterlosung: 'Hohe Ungleichheit (Gini über ca. 0.4) kann das Wirtschaftswachstum dämpfen. Soziale Unruhen und politische Instabilität nehmen zu, das Vertrauen in Institutionen sinkt und Investitionen werden gebremst. Zudem entstehen Forderungen nach starker Umverteilung, die wiederum Verzerrungen verursachen können. Menschen in extremer Benachteiligung investieren zudem weniger in Bildung — das senkt langfristig die Produktivität einer Gesellschaft.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Instabilität und Vertrauensverlust hemmen Investitionen und Wachstum.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Reiche investieren nicht zwingend mehr, wenn das Umfeld instabil wird.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Empirisch ist ein Zusammenhang mit sozialem Frieden belegt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Soziale Unruhen verringern Konsum und Investitionen, sie steigern sie nicht.' },
  ] },
  { id: 'caed86d6-cdf0-4f73-8b60-fa7c89fe036e', fachbereich: 'VWL', musterlosung: 'Rahmenbedingungen für Wirtschaftswachstum lassen sich in gestaltbare und nicht gestaltbare Faktoren unterteilen. Gestaltbar sind Bildungs- und Forschungspolitik, rechtsstaatliche Institutionen wie Eigentumsschutz sowie eine offene Aussenwirtschaftspolitik. Diese Faktoren können durch politische Entscheide beeinflusst werden. Nicht gestaltbar sind dagegen naturgegebene Faktoren wie die geografische Lage oder natürliche Ressourcen eines Landes.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Bildungs- und Forschungspolitik sind politisch gestaltbare Wachstumstreiber.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die geografische Lage ist naturgegeben, nicht politisch gestaltbar.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Rechtssicherheit und Eigentumsschutz lassen sich durch Gesetze und Institutionen formen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Handelspolitik ist ein klassisches gestaltbares Feld (Zölle, Abkommen, Freihandel).' },
  ] },
  { id: 'cb81c022-3f3d-4057-a172-a9aaea4344d5', fachbereich: 'VWL', musterlosung: 'Das Beispiel «Butter und Kanonen» illustriert Opportunitätskosten auf gesamtwirtschaftlicher Ebene. Knappe Ressourcen wie Arbeit, Kapital und Rohstoffe können entweder für militärische Güter (Kanonen) oder zivile Güter (Butter) eingesetzt werden — nicht für beides gleichzeitig. Jede Entscheidung für das eine bedeutet den Verzicht auf das andere. Dieser Trade-off ist grundlegend für wirtschaftspolitische Entscheide in allen Bereichen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Armee benötigt Ressourcen — genau darin liegt der Zielkonflikt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Wirtschaft umfasst viele Bereiche; Waffen sind hier nur ein Beispiel.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Zielkonflikt betrifft allgemeine Ressourcen, nicht spezifische Rohstoffe.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Knappe Ressourcen zwingen zur Wahl zwischen militärischen und zivilen Gütern.' },
  ] },
  { id: 'cb92f8a8-b315-46ca-93f9-7c4ae29b5bfd', fachbereich: 'VWL', musterlosung: 'Bei negativen externen Effekten wie Umweltverschmutzung liegen die gesellschaftlichen Kosten (private plus externe) über den privaten Kosten. Unternehmen berücksichtigen in ihren Entscheidungen aber nur ihre privaten Kosten. Die Folge: Produktion und Konsum sind zu hoch, der Preis zu tief — aus gesellschaftlicher Sicht. Der Staat kann über Pigou-Steuern oder Zertifikatssysteme die Differenz internalisieren und so das soziale Optimum annähern.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das Problem liegt im Auseinanderfallen privater und sozialer Kosten, nicht in geringer Nachfrage.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Subventionen würden die Produktion weiter erhöhen, nicht das Problem lösen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Elastizität der Angebotskurve ist nicht das zentrale Problem.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Private Kosten unter sozialen Kosten führen zu zu tiefem Preis und zu hoher Menge.' },
  ] },
  { id: 'cbf2ad84-10c1-44cd-a9a5-0c82225caa22', fachbereich: 'VWL', musterlosung: 'Antizyklische Fiskalpolitik bedeutet «gegen den Konjunkturzyklus». In der Rezession erhöht der Staat die Ausgaben und senkt die Steuern — er akzeptiert Defizite, um die Nachfrage zu stützen. In der Hochkonjunktur dreht er den Hebel um: Ausgaben kürzen, Überschüsse erzielen. Ziel ist die Glättung der Konjunkturschwankungen. Die Schweizer Schuldenbremse versucht, dieses Prinzip regelgebunden umzusetzen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Konstante Ausgaben wären neutral — antizyklisch bedeutet aktive Reaktion.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Antizyklisch meint Fiskalpolitik, nicht nur Geldpolitik.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das wäre prozyklisch — genau das Gegenteil der antizyklischen Politik.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Mehr Ausgaben in der Rezession, Sparen in der Hochkonjunktur — glättet die Zyklen.' },
  ] },
  { id: 'cc1b36b9-5e62-4c29-8cee-37629f1f025d', fachbereich: 'VWL', musterlosung: 'Die Internalisierung externer Kosten bedeutet, dass die Verursacher von Umweltschäden die Kosten selbst tragen — und nicht die Allgemeinheit. Beispiele sind CO₂-Abgaben, Lenkungssteuern auf Treibstoff oder Zertifikatssysteme. Werden die Kosten im Marktpreis sichtbar, entsteht ein Anreiz zur Reduktion: Produzenten und Konsumenten suchen Alternativen. Das Verursacherprinzip ist ein zentrales umweltökonomisches Instrument.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Internalisierung ändert Preise, nicht das BIP-Rechenverfahren.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Eine Produktionsverlagerung ist kein Ziel der Internalisierung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das wäre eine Sozialisierung der Kosten — das Gegenteil der Internalisierung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Verursacher tragen die Kosten — das Verursacherprinzip schafft Reduktionsanreize.' },
  ] },
  { id: 'ccc474f1-2cb3-441f-8789-d93791025304', fachbereich: 'VWL', musterlosung: 'Das Drei-Ebenen-Modell erklärt Wachstum von unten nach oben. Auf der tiefen Ebene stehen Institutionen wie Rechtsstaatlichkeit und Eigentumsschutz. Gute Institutionen fördern Investitionen in Sach- und Humankapital (Zwischenebene), was wiederum die Produktivität und Beschäftigung (unmittelbare Ebene) steigert. Resultat: höheres BIP pro Kopf. Umgekehrt bremst ein schwacher Rechtsstaat Auslandsinvestitionen und hält das BIP pro Kopf tief.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Schwache Institutionen → weniger Investitionen → tiefere Produktivität → tiefes BIP.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Grundthese des Modells ist gerade, dass Institutionen bis zur obersten Ebene wirken.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Ressourcenreichtum allein führt nicht automatisch zu hoher Produktivität (Ressourcenfluch).' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Kausalität läuft von Institutionen zum BIP, nicht umgekehrt.' },
  ] },
  { id: 'cd16fe96-6eaa-4770-b3c5-73255baac53e', fachbereich: 'VWL', musterlosung: 'Der Ausgabenposten «Finanzen und Steuern» des Bundes umfasst hauptsächlich zwei Bereiche: erstens die Schuldzinsen auf der Bundesschuld und zweitens die Kantonsanteile an den Bundessteuern. Die Kantone erhalten beispielsweise einen Anteil an der direkten Bundessteuer. Verwaltungskosten wie Personalausgaben der Steuerverwaltung fliessen in andere Ausgabenposten — nicht in «Finanzen und Steuern».', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Schuldzinsen und Kantonsanteile dominieren diesen Ausgabenposten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Steuerhinterziehungsbekämpfung ist ein kleiner Verwaltungsposten, nicht prägend.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gehälter der Verwaltung fliessen in den Personalaufwand, nicht in diesen Posten.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Ausgaben der Steuerverwaltung sind im Posten «allgemeine Verwaltung» enthalten.' },
  ] },
  { id: 'cd56fc77-b709-4976-bc07-7ed4effe4c31', fachbereich: 'VWL', musterlosung: 'Die Geldnachfrage steigt aus mehreren Gründen: Wächst das reale BIP, werden mehr Transaktionen abgewickelt — der Transaktionsbedarf steigt. Unsicherheit an den Finanzmärkten erhöht das Sicherheitsmotiv (Bargeld als «sicherer Hafen»). Höhere Mindestreserveanforderungen zwingen Banken, mehr Notenbankgeld zu halten. Steigende Sparzinsen wirken umgekehrt: Sie erhöhen die Opportunitätskosten der Geldhaltung und senken die Nachfrage nach Bargeld.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Mehr Transaktionen durch BIP-Wachstum erhöhen den Geldbedarf.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Höhere Sparzinsen senken die Geldnachfrage (Opportunitätskosten steigen).' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: In unsicheren Zeiten steigt das Sicherheitsmotiv für Bargeldhaltung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Mindestreserveauflagen zwingen Banken, mehr Notenbankgeld zu halten.' },
  ] },
  { id: 'cd7eec9f-188e-4273-98d7-ab11c9414c93', fachbereich: 'VWL', musterlosung: 'Die primäre Einkommensverteilung der Schweiz ist im internationalen Vergleich relativ gleichmässig. Verantwortlich sind mehrere strukturelle Faktoren: geringe Produktivitätsunterschiede zwischen den Branchen, das duale Berufsbildungssystem mit breiter Qualifikation auf Sekundarstufe II und ein starker Dienstleistungssektor mit guten Löhnen. Einen flächendeckenden gesetzlichen Mindestlohn auf Bundesebene kennt die Schweiz dagegen nicht — nur einzelne Kantone wie GE, NE oder BS.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Geringe Produktivitätsspreizung zwischen Branchen dämpft Lohnunterschiede.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Das duale System sichert breite Qualifikation und damit solide Einstiegslöhne.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kein nationaler Mindestlohn — nur einzelne Kantone haben einen eingeführt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Der Dienstleistungssektor bietet in der Schweiz überdurchschnittlich gute Löhne.' },
  ] },
  { id: 'cd9e6b31-fdd3-474a-b605-7b007227baa0', fachbereich: 'VWL', musterlosung: 'Die drei Wirtschaftssektoren teilen Berufe nach ihrer Grundfunktion ein. Der primäre Sektor umfasst die Urproduktion (Landwirtschaft, Forstwirtschaft, Bergbau). Der sekundäre Sektor verarbeitet Rohstoffe (Industrie, Handwerk, Baugewerbe). Der tertiäre Sektor deckt alle Dienstleistungen ab — von Banken über Gesundheit bis IT. Softwareentwicklung und Physiotherapie zählen dazu. Winzer gehören zum primären, Maschinenbauingenieure in der Fabrik zum sekundären Sektor.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: IT-Dienstleistungen (auch bei einer Bank) sind klassischer Tertiärsektor.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Winzer gehören zum primären Sektor (Landwirtschaft/Urproduktion).' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Physiotherapie ist eine Gesundheitsdienstleistung (Tertiärsektor).' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Industrielle Produktion in Fabriken zählt zum sekundären Sektor.' },
  ] },
  { id: 'ce323c61-4518-451c-a08d-0eeab06c2181', fachbereich: 'VWL', musterlosung: 'Sockelarbeitslosigkeit ist der strukturelle Anteil der Arbeitslosigkeit, der auch im Aufschwung nicht verschwindet. Ein zentraler Treiber ist rascher Strukturwandel: Wenn Digitalisierung oder Globalisierung Arbeitsplätze für Unqualifizierte vernichten, finden Betroffene keine passenden neuen Stellen mehr. Die Qualifikationslücke erhöht den Sockel. Umgekehrt senken ein flexibler Arbeitsmarkt und wirksame Umschulungen die strukturelle Komponente.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Lockerer Kündigungsschutz erhöht eher die Fluktuation, nicht den Sockel.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Strukturwandel, der Unqualifizierte dauerhaft ohne Arbeit lässt, treibt den Sockel hoch.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Konjunkturschwankungen verursachen konjunkturelle, nicht strukturelle Arbeitslosigkeit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Eine Senkung der ALV-Leistungen reduziert eher die friktionelle Arbeitslosigkeit.' },
  ] },
  { id: 'cea23437-b8af-4cc6-847d-d5c8fc97ec85', fachbereich: 'VWL', musterlosung: 'Ein Staat hat drei grundsätzliche Optionen zum Schuldenabbau. Erstens Haushaltsdisziplin: Ausgaben kürzen oder Steuern erhöhen. Zweitens Inflation: Da Schulden nominal sind, sinkt bei höherer Inflation der reale Wert — Gläubiger werden enteignet. Drittens Wirtschaftswachstum: Wenn das BIP schneller wächst als die Schulden, sinkt die Schuldenquote automatisch. Alle drei Optionen haben politische und ökonomische Kosten — in der Praxis wird meist kombiniert.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: IWF und EU sind externe Hilfen, keine endogenen Abbauinstrumente.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Schulden ignorieren führt in den Staatsbankrott, ist kein seriöser Ausweg.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Haushaltsdisziplin, Inflation und Wachstum sind die drei Kernoptionen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Goldverkäufe liefern einmalige Erträge, lösen aber strukturelle Schuldenprobleme nicht.' },
  ] },
  { id: 'cee7fdde-f35e-4a9b-91a6-268b0881b2ea', fachbereich: 'VWL', musterlosung: 'Bei faktischer Zahlungsunfähigkeit verhandelt ein Staat mit seinen Gläubigern über Umstrukturierung oder Schuldenerlass (Haircut). Historische Beispiele sind Argentinien 2001 oder Griechenland 2012. Die Landeswährung verliert oft drastisch an Wert und muss häufig stabilisiert oder reformiert werden. Der IWF begleitet typischerweise den Neustart mit strengen Auflagen (Ausgabenkürzungen, Strukturreformen). Ein Staatsbankrott bleibt ein tiefer politischer und wirtschaftlicher Einschnitt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Enteignung privater Ersparnisse ist eine Extremvariante, nicht der Regelfall.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Verhandlungen, Schuldenschnitt und oft Währungsreform kennzeichnen Staatsbankrott.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Staaten werden nicht in Nachbarländer eingegliedert — sie bleiben souverän.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die UNO übernimmt keine Schulden, sie hat dafür kein Mandat.' },
  ] },
  { id: 'd0139955-8813-4d1f-9ad7-a49e16a15ba1', fachbereich: 'VWL', musterlosung: 'Die Schweiz hat mit der AHV 21 mehrere Reformen umgesetzt: Das Frauen-Referenzalter wurde auf 65 angehoben, ein Zuschlag zur Mehrwertsteuer zur Zusatzfinanzierung eingeführt und der flexible Rentenbezug zwischen 63 und 70 erweitert. Ein bedingungsloses Grundeinkommen lehnten die Stimmberechtigten 2016 mit klarer Mehrheit ab. Weitere Reformen (BVG-Reform, AHV 26) werden aktuell diskutiert.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: AHV 21 hat das Frauen-Referenzalter auf 65 angehoben (in Kraft 2024).' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: AHV 21 enthält einen MWST-Zuschlag zur Zusatzfinanzierung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das bedingungslose Grundeinkommen wurde 2016 deutlich abgelehnt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Flexibler Rentenbezug zwischen 63 und 70 ist Teil der AHV 21.' },
  ] },
  { id: 'd13a6d64-0ee6-4e70-9dde-b379149eaeeb', fachbereich: 'VWL', musterlosung: 'Ein progressiver Steuertarif zeichnet sich durch einen steigenden Durchschnittssteuersatz bei steigendem Einkommen aus. Im Diagramm entspricht das einer ansteigenden Kurve (Tarif A). Tarif B mit konstantem Steuersatz ist ein proportionaler Tarif (Flat Tax). Tarif C mit sinkendem Satz wäre degressiv (regressiv) — je höher das Einkommen, desto tiefer der Satz. Die Schweizer Einkommenssteuer ist progressiv ausgestaltet.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Eine waagrechte Linie zeigt einen proportionalen Satz (Flat Tax).' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Eine fallende Kurve ist degressiv — der Satz sinkt mit steigendem Einkommen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Eine steigende Kurve zeigt progressive Besteuerung — höhere Sätze bei höherem Einkommen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Nur Tarif A zeigt Progression — B ist proportional, C degressiv.' },
  ] },
  { id: 'd229d266-d0db-4480-aa42-4fda3cef2a9e', fachbereich: 'VWL', musterlosung: 'Wirtschaftliches Wachstum bezeichnet die langfristige Entwicklung des realen BIP pro Kopf. Drei Elemente sind zentral: langfristig (über Jahre und Jahrzehnte, nicht einzelne Quartale), real (preisbereinigt, um Inflation herausgerechnet), pro Kopf (um das Bevölkerungswachstum zu neutralisieren). Kurzfristige Schwankungen werden als Konjunktur behandelt — nicht als Wachstum. Der langfristige Trend zeigt, ob der Wohlstand pro Person tatsächlich steigt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Bevölkerungswachstum ist ein anderes Konzept (Demografie).' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Wachstum wird real und langfristig gemessen, nicht nominal-kurzfristig.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Langfristige Entwicklung des realen BIP pro Kopf.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Anstieg der Konsumentenpreise ist Inflation, nicht Wachstum.' },
  ] },
  { id: 'd2378594-cea1-4a6d-9996-8356b5ac5688', fachbereich: 'VWL', musterlosung: 'Butter und Margarine sind Substitutionsgüter — sie erfüllen denselben Zweck und können sich gegenseitig ersetzen. Wird Butter teurer, weichen Konsumenten auf das günstigere Margarine-Produkt aus. Die Nachfragekurve für Margarine verschiebt sich nach rechts: Zu jedem Preis wird nun mehr nachgefragt. Bei komplementären Gütern (die zusammen verwendet werden, z.B. Drucker und Tinte) wäre der Effekt umgekehrt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Butter und Margarine sind Substitute, keine Komplemente.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Güter sind nicht unabhängig — sie ersetzen sich gegenseitig.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Als Substitut steigt die Margarine-Nachfrage, wenn Butter teurer wird.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Komplemente würden bei Butter-Preisanstieg weniger nachgefragt werden.' },
  ] },
  { id: 'd2a73db4-799b-4a0b-b2da-8cba400e0602', fachbereich: 'VWL', musterlosung: 'Ein Monopolist setzt Preis und Menge nicht wie im Wettbewerbsmarkt fest. Er beschränkt die angebotene Menge bewusst, um den Preis zu erhöhen und seinen Gewinn zu maximieren. Ergebnis: Die Menge liegt unter der effizienten Gleichgewichtsmenge, der Preis darüber. Aus dieser Verknappung entsteht ein Wohlfahrtsverlust (Deadweight Loss) — Einheiten, die für beide Seiten vorteilhaft wären, werden nicht gehandelt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Monopolist hält die Menge gerade knapp, nicht hoch.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Monopolisten maximieren Gewinn, nicht Wohlfahrt — daraus entsteht der Deadweight Loss.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Preis und Menge unterscheiden sich systematisch zwischen Monopol und Wettbewerb.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Mengenverknappung und höhere Preise — klassisches Monopolverhalten.' },
  ] },
  { id: 'd2cc9297-62dd-4a16-9fe4-3b4641cba1fa', fachbereich: 'VWL', musterlosung: 'In der klassischen Konzeption sind flexible Preise, Löhne und Zinsen der zentrale Mechanismus. Bei Überangebot sinken Preise, bei Übernachfrage steigen sie. Flexible Löhne räumen den Arbeitsmarkt, flexible Zinsen gleichen Sparen und Investieren aus. So findet die Wirtschaft nach Störungen selbständig zurück zum Vollbeschäftigungs-Gleichgewicht. Staatliche Nachfragestimulierung ist in diesem Modell unnötig — der Markt regelt sich selbst.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Flexible Preise sind Anpassungsmechanismus, nicht zwangsläufig Inflationsursache.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Flexibilität ist gerade der Kern der klassischen Theorie.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Flexible Preise, Löhne und Zinsen führen den Markt ins Gleichgewicht.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die klassische Lehre lehnt staatliche Preisfestsetzung ab.' },
  ] },
  { id: 'd2f57a08-a69e-4106-998b-48479a86d93e', fachbereich: 'VWL', musterlosung: 'Steigende Wertschätzung ist eine Präferenzänderung — ein nicht-preislicher Faktor. Die gesamte Nachfragekurve verschiebt sich nach rechts. Im neuen Gleichgewicht sind Preis und Menge höher als zuvor. Wichtig: Änderungen der Präferenzen verschieben die Kurve, Änderungen des Preises bewirken dagegen nur eine Bewegung entlang der Kurve. Das Unterscheiden beider Fälle gehört zum Einmaleins der Angebots-Nachfrage-Analyse.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Angebotsseite ändert sich nicht durch Nachfrager-Präferenzen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Steigende Wertschätzung verschiebt die Nachfragekurve nach rechts, nicht links.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Bewegung entlang der Kurve kommt vom Preis, nicht von Präferenzen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Präferenzänderung verschiebt die Nachfrage nach rechts — Preis und Menge steigen.' },
  ] },
  { id: 'd32f0e7f-0330-4c32-928c-ceceaa7a5794', fachbereich: 'VWL', musterlosung: 'Die Mehrwertsteuer (MwSt) ist die wichtigste Einnahmequelle des Bundes, gefolgt von der direkten Bundessteuer. Beide zusammen machen rund zwei Drittel der Bundeseinnahmen aus. Die MwSt ist eine indirekte Verbrauchssteuer — sie besteuert den Konsum unabhängig vom Einkommen. Weitere Einnahmequellen wie Mineralöl-, Verrechnungs- oder Tabaksteuern sind deutlich kleiner. Das Einkommen als Steuerobjekt gehört primär den Kantonen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Die MwSt ist die grösste Einnahmequelle des Bundes.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Mineralölsteuer ist deutlich kleiner als die MwSt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Einkommenssteuer ist primär eine Kantonssteuer — nur die direkte Bundessteuer fliesst an den Bund.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Verrechnungssteuer fliesst nach Deklaration zurück und liefert netto wenig.' },
  ] },
  { id: 'd40b257e-9f20-42ff-88aa-77f223ddf107', fachbereich: 'VWL', musterlosung: 'Die vollkommene Konkurrenz ist ein theoretisches Referenzmodell mit vier Kernbedingungen. Erstens: viele kleine Anbieter und Nachfrager — niemand kann den Preis beeinflussen (Preisnehmer). Zweitens: homogene Güter, die sich nicht unterscheiden. Drittens: freier Marktzutritt und -austritt ohne Barrieren. Viertens: vollständige Markttransparenz — alle kennen Preise und Qualitäten. In der Realität sind diese Bedingungen selten vollständig erfüllt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Die vier Kernbedingungen — viele Akteure, homogene Güter, freier Zutritt, Transparenz.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ein einziger Anbieter wäre ein Monopol, nicht vollkommene Konkurrenz.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Staatliche Preissetzung ist das Gegenteil von Marktpreisbildung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Differenzierte Güter und Werbung kennzeichnen monopolistische Konkurrenz.' },
  ] },
  { id: 'd410c105-80f4-4838-8a00-82ddc14f3ad5', fachbereich: 'VWL', musterlosung: 'Marktversagen allein rechtfertigt noch keinen Staatseingriff. Es muss geprüft werden, ob der Staat es tatsächlich besser macht — sonst droht Staatsversagen (Regulierungskosten, falsche Anreize, Lobbying). Ein Eingriff ist nur sinnvoll, wenn er das Marktergebnis nachweislich verbessert. Auch staatliche Lösungen können Wohlfahrtsverluste erzeugen. Die Lehre: Marktversagen ist notwendige, aber nicht hinreichende Bedingung für einen Eingriff.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Marktversagen ist notwendig, aber nicht hinreichend für einen Eingriff.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Nur wenn der Staat das Ergebnis verbessert, lohnt sich ein Eingriff.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Staat ist nicht automatisch die bessere Lösung — Staatsversagen ist real.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Staatseingriffe können eigene Verzerrungen und Wohlfahrtsverluste erzeugen.' },
  ] },
  { id: 'd46bb9ab-c65e-4e82-9459-ae881b4737fe', fachbereich: 'VWL', musterlosung: 'Die Spieltheorie analysiert strategische Entscheidungssituationen — also Situationen, in denen das eigene Ergebnis auch vom Verhalten anderer abhängt. Jeder Akteur muss antizipieren, wie die Gegenseite reagiert. Das bekannteste Beispiel ist das Gefangenendilemma: Individuelles Kalkül führt zu einem kollektiv schlechteren Ergebnis. Die Spieltheorie wird in Ökonomie, Politik und Biologie eingesetzt und geht auf von Neumann und Morgenstern zurück.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Spieltheorie ist ökonomische Analyse, keine Brettspielstrategie.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Psychologie von Spielsüchtigen gehört in ein anderes Feld.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Analyse strategischer Situationen mit wechselseitiger Abhängigkeit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Computerspiele sind kein Thema der ökonomischen Spieltheorie.' },
  ] },
  { id: 'd4db974d-cf32-4405-bcde-696bca294852', fachbereich: 'VWL', musterlosung: 'Nach dem BIP-Einbruch von −2.6 % im Coronajahr 2020 folgte 2021 eine kräftige Erholung von 3.6 %. Für 2022 prognostizierte die Expertengruppe 2.8 % — also eine Fortsetzung der Erholung mit nachlassender Dynamik. Die Vorprognose lag noch bei 3.0 %, was die leichte Abschwächung bestätigt. Es handelt sich weder um eine Rezession noch um ein aussergewöhnlich hohes Wachstum, sondern um typische Erholungsphase mit abnehmendem Schwung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: 2.8 % positives Wachstum ist weit entfernt von einer Depression.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Eine Rezession setzt negatives BIP-Wachstum voraus.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: 2.8 % sind solide, aber kein historisch einmaliger Wert.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Erholungsphase nach Coronaschock, mit abnehmendem Wachstumsschwung.' },
  ] },
  { id: 'd52323b6-9514-4e8a-b304-7b1782575423', fachbereich: 'VWL', musterlosung: 'Das Differenzprinzip von John Rawls (auch Maxmin-Regel) besagt: Soziale und ökonomische Ungleichheiten sind nur gerechtfertigt, wenn sie dem am schlechtesten gestellten Mitglied der Gesellschaft zugutekommen. Ziel ist nicht absolute Gleichheit, sondern die Maximierung der Position der Schwächsten. Rawls leitet dies aus dem «Schleier des Nichtwissens» ab: Eine gerechte Grundordnung wählt, wer seine eigene Stellung nicht kennt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Rawls fordert keinen Minimalstaat — sondern soziale Institutionen nach Gerechtigkeitsprinzipien.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Produktionsmittel-Verstaatlichung ist eine andere (marxistische) Position.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Ungleichheit ist nur dann gerechtfertigt, wenn sie den Schwächsten hilft.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Rawls fordert keine völlige Gleichverteilung — Ungleichheit darf bestehen, wenn sie allen nützt.' },
  ] },
  { id: 'd5715f83-a186-4642-92f8-163ee7d727da', fachbereich: 'VWL', musterlosung: 'Beyond Growth setzt am stärksten auf staatliche Eingriffe. Der Ansatz fordert aktive Industriepolitik, schärfere Finanzregulierung und prädistributive Massnahmen — also Chancengleichheit vor der Umverteilung. Green Growth dagegen vertraut stärker auf Preissignale (CO₂-Abgaben, Emissionshandel) und private Innovation. Degrowth will das Wachstum gesellschaftlich aktiv begrenzen, setzt aber auch auf Wandel von unten, nicht nur staatliche Steuerung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Green Growth setzt stärker auf Marktmechanismen als auf direkte Industriepolitik.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Beyond Growth fordert aktive Industrie-, Arbeitsmarkt- und Finanzpolitik.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Degrowth setzt auch auf gesellschaftlichen Wandel von unten, nicht nur staatliche Lenkung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die drei Ansätze unterscheiden sich gerade in der Rolle des Staates.' },
  ] },
  { id: 'd64bb808-d3f4-4c51-ad61-dd221dc426c9', fachbereich: 'VWL', musterlosung: 'Der Human Development Index (HDI) des UNDP ergänzt das BIP um zwei Dimensionen: Gesundheit (gemessen an der Lebenserwartung bei Geburt) und Bildung (erwartete und durchschnittliche Schuljahre). Zusammen mit dem Bruttonationaleinkommen pro Kopf (in Kaufkraftparität) ergibt das drei Säulen. Der HDI ist weit verbreitet, weil er einfache, international vergleichbare Daten nutzt. Er zeigt: Wohlstand ist mehr als Einkommen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Lebenserwartung und Schuljahre sind die beiden zusätzlichen HDI-Dimensionen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Umwelt und Emissionen werden im HDI nicht erfasst — dafür gibt es andere Indizes.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Militär und Sicherheit sind keine HDI-Dimensionen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Exportquote und Handelsbilanz gehören zum Aussenhandel, nicht zum HDI.' },
  ] },
  { id: 'd6d6d1e2-4344-43b2-a9cf-76e46b76be50', fachbereich: 'VWL', musterlosung: 'Im magischen Sechseck stehen tiefe Arbeitslosigkeit und hohe Mieten in Zielkonkurrenz. Vollbeschäftigung und wirtschaftliche Dynamik ziehen Arbeitskräfte an (Zuwanderung), was die Nachfrage nach Wohnraum erhöht und die Mieten steigen lässt. Das Ziel «sozialer Ausgleich» (bezahlbares Wohnen) wird erschwert. Solche Zielkonflikte sind typisch: Die Kombination mehrerer wirtschaftspolitischer Ziele ist «magisch», weil nicht alle gleichzeitig optimal erreichbar sind.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Hohe Mieten und tiefe Arbeitslosigkeit sind gerade kein harmonisches Verhältnis.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Beschäftigung und Wohnkosten sind beides Kernthemen der Wirtschaftspolitik.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Zwischen Arbeitsmarkt und Wohnungsmarkt gibt es klare Wechselwirkungen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Zielkonkurrenz zwischen Beschäftigung/Zuwanderung und bezahlbarem Wohnen.' },
  ] },
  { id: 'd6fd07f2-9004-420c-9b77-fdd64d918673', fachbereich: 'VWL', musterlosung: 'Adverse Selektion (George Akerlof, «Market for Lemons») beschreibt eine Negativauslese bei asymmetrischer Information. Können Käufer die Qualität nicht beurteilen, bieten sie nur Durchschnittspreise. Verkäufer guter Ware ziehen sich zurück, weil ihre Qualität nicht vergütet wird. Zurück bleiben vorwiegend minderwertige Produkte. Klassisches Beispiel ist der Gebrauchtwagenmarkt, im Extremfall kann der Markt völlig zusammenbrechen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Mitarbeiterauswahl ist kein ökonomisches Marktversagen durch Informationsasymmetrie.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Adverse Selektion ist ein Markt- und Vertragsphänomen, keine staatliche Regulierung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Bewusste Verknappung ist Monopolverhalten, nicht Adverse Selektion.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Negativauslese durch asymmetrische Information über die Qualität.' },
  ] },
  { id: 'd72ad130-12cc-468f-ba23-d0fe55ca5f4c', fachbereich: 'VWL', musterlosung: 'Der Coronaschock 2020 traf die Länder sehr unterschiedlich. Das Vereinigte Königreich erlitt mit rund −9.4 % den stärksten Einbruch der hier verglichenen Volkswirtschaften — wegen strenger Lockdowns und der starken Rolle des Dienstleistungssektors. Die Schweiz kam mit etwa −2.5 % vergleichsweise mild davon, dank ihrer Wirtschaftsstruktur und der gezielten Kurzarbeit. Unterschiede erklären sich durch Lockdown-Strenge, Sektorenzusammensetzung und Stützungsprogramme.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Japan war auch betroffen, der Einbruch fiel aber geringer aus als anderswo.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die USA erholten sich teilweise schneller, nicht langsamer als Europa.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Schweiz hatte im Ländervergleich einen vergleichsweise milden Einbruch.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: UK stärkster Einbruch, Schweiz vergleichsweise mild — durch Struktur und Lockdown-Strenge.' },
  ] },
  { id: 'd7b62302-f6ba-419a-bf19-9e51f0ed68a3', fachbereich: 'VWL', musterlosung: 'Negative externe Effekte entstehen, wenn wirtschaftliche Aktivität Dritten Kosten aufbürdet, ohne dass diese entschädigt werden. Baulärm bei einer Renovation, Gewässerverschmutzung durch eine Fabrik oder Fluglärm mit tieferen Immobilienpreisen sind typische Beispiele. Positive externe Effekte sind umgekehrt: Eine Universität bildet Fachkräfte aus, die der ganzen Region nützen. Positive Externalitäten führen tendenziell zu Unterproduktion, negative zu Überproduktion.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Baulärm bürdet Anwohnern unentschädigte Kosten auf — negative Externalität.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Bildung erzeugt Nutzen für Dritte (Unternehmen, Region) — positiver Effekt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Abwasser in einen See schädigt Fischer — klassische negative Externalität.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Fluglärm und Immobilienwertverlust sind ein Lehrbuchbeispiel für negative Effekte.' },
  ] },
  { id: 'd7fcad9c-72ce-4967-af59-030af2f45522', fachbereich: 'VWL', musterlosung: 'Sozialhilfe ohne Gegenleistung kann ein Moral-Hazard-Problem erzeugen. Je grosszügiger die Leistung, desto geringer der Anreiz, eigene Erwerbsarbeit aufzunehmen — besonders bei tiefen möglichen Löhnen, wo die Differenz klein ist. Dies kann einen Teufelskreis in Gang setzen: Weniger Erwerbstätige, tiefere Wirtschaftsleistung, schwierigere Finanzierung der Sozialwerke. Deshalb koppelt die Schweiz die Sozialhilfe häufig an Aktivierungs- und Integrationsmassnahmen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Moral Hazard — der Anreiz zur Erwerbstätigkeit sinkt durch bedingungsloses Einkommen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Sozialhilfe verursacht Ausgaben — langfristige Einsparung ist nicht die Folge.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Inflation entsteht durch Geldmengenexpansion, nicht durch Sozialhilfe.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Moral Hazard senkt eher die gesamtwirtschaftliche Produktivität.' },
  ] },
  { id: 'd88e61f7-ed4b-4b1c-8b73-ecec48fe0d2d', fachbereich: 'VWL', musterlosung: 'Die Schweizer Soziallastquote (Sozialausgaben in % des BIP) stieg von rund 10 % (1960) auf über 27 % (2017). Bei den Sozialversicherungseinnahmen dominiert die Berufliche Vorsorge (2. Säule) mit etwa 39 %. Die Sozialausgaben machen rund ein Drittel der Bundesausgaben aus. Die Grundversicherung der Krankenkasse wird zwar primär über Kopfprämien finanziert, zusätzlich aber auch durch Prämienverbilligungen aus Steuergeldern.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Kontinuierlicher Anstieg von ~10 % (1960) auf über 27 % (2017).' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Die 2. Säule hat mit ~39 % den grössten Einnahmenanteil.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Prämienverbilligungen aus Steuergeldern ergänzen die Kopfprämien.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Sozialausgaben machen rund ein Drittel der Bundesausgaben aus.' },
  ] },
  { id: 'd8e0c580-2981-472b-9580-35a1e3b46033', fachbereich: 'VWL', musterlosung: 'Der Homo oeconomicus ist ein Modellakteur: Er reagiert auf Anreize und veränderte Rahmenbedingungen, stellt Entscheidungen bei neuen Informationen zur Disposition und wägt Kosten und Nutzen rational ab, um seinen persönlichen Nutzen zu maximieren. Vollständige Information gehört nicht zum Standardbild — bereits Herbert Simon zeigte 1957, dass rationales Verhalten immer unter beschränkter Informationslage stattfindet (Bounded Rationality).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Anreize und Rahmenbedingungen beeinflussen sein Verhalten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Vollständige Information ist Karikatur — Bounded Rationality ist realistischer.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Bei veränderten Bedingungen passt er seine Entscheidung an (keine Pfadabhängigkeit).' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Nutzenmaximierung durch Kosten-Nutzen-Kalkül ist das Kernmerkmal.' },
  ] },
  { id: 'db273b89-c128-4f6a-883d-c8e1059747db', fachbereich: 'VWL', musterlosung: 'Versicherungen decken vor allem existenzbedrohende Risiken mit tiefer Eintrittswahrscheinlichkeit ab. Ein Hausbrand tritt selten ein, verursacht aber Schäden, die kaum jemand aus Ersparnissen tragen könnte. Bei kleinen, häufigen Schäden wie Glasbruch ist die Versicherung teurer als sinnvoll: Die Prämie enthält zusätzlich Verwaltungskosten und Gewinnmarge. Eigenes Sparen ist dort oft günstiger. Das Prinzip lautet: Risiken versichern, die die eigene Sparfähigkeit übersteigen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Staat verbietet Glasbruchversicherungen nicht — sie sind nur selten sinnvoll.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Existenzbedrohende Risiken übersteigen die individuelle Sparfähigkeit — Versicherung ist dort unverzichtbar.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Prämie pro Franken Schadenssumme ist bei häufigen Kleinschäden oft höher.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Versicherungen können beide Kategorien abdecken — ökonomisch sinnvoll sind aber Existenzrisiken.' },
  ] },
  { id: 'dd2c2c6e-3cc2-4207-b6c0-e17b2a84ace5', fachbereich: 'VWL', musterlosung: 'Die herkömmliche Sichtweise sieht Geld als Ware, die zum allgemeinen Tauschmittel wurde. Die alternative Sichtweise — etwa von David Graeber — sieht Geld primär als System zur Dokumentation von Schuldverhältnissen. Wer eine Ware erhält, ohne sofort eine Gegenleistung zu erbringen, schuldet etwas. Geld dient als Erinnerung an diese Schuld. Historisch fehlen Belege für reine Tauschhandel-Gesellschaften, während Schuldverzeichnisse schon sehr früh nachweisbar sind.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Arbeitsanreize sind eine Folge, nicht die Funktion von Geld selbst.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Statussymbol ist eine kulturelle Zuschreibung, nicht die funktionale Kernfunktion.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Geld als Dokumentation von Schuldverhältnissen (Graeber-These).' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Staatliche Kontrolle ist eine mögliche Nutzung, nicht die Ursprungsfunktion.' },
  ] },
]

async function main() {
  const stateRaw = await fs.readFile(STATE, 'utf8')
  const state = JSON.parse(stateRaw)

  const outLines = []
  let done = 0
  let skip = 0
  const skipped = []
  const now = new Date().toISOString()

  for (const u of updates) {
    const existing = state.fragen[u.id]
    if (existing && existing.status === 'done') {
      continue
    }
    outLines.push(JSON.stringify(u))
    state.fragen[u.id] = { status: 'done', zeitpunkt: now, teile: u.teilerklaerungen.length }
    done++
  }

  state.verarbeitet = Object.values(state.fragen).filter(x => x.status === 'done').length
  state.letzteSession = now

  if (outLines.length > 0) {
    await fs.appendFile(OUT, outLines.join('\n') + '\n', 'utf8')
  }
  await fs.writeFile(STATE, JSON.stringify(state, null, 2), 'utf8')

  const total = state.verarbeitet
  const totalAll = state.totalFragen
  const pct = ((total / totalAll) * 100).toFixed(1)
  console.log(`Session 17 done.`)
  console.log(`  Verarbeitet diese Session: ${done + skip} (done=${done}, skip=${skip})`)
  console.log(`  Total: ${total}/${totalAll} (${pct}%)`)
  if (skipped.length > 0) console.log(`  Skip-Fragen: ${skipped.join(', ')}`)
  console.log(`  Verteilung: 50 VWL/mc`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
