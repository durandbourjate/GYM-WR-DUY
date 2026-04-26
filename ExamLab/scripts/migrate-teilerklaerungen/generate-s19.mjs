#!/usr/bin/env node
/**
 * Session 19: 50 VWL-Fragen (21 mc + 4 pdf + 25 richtigfalsch).
 * Erste Hälfte des 100er-Batches nach Fachbereich → Typ → ID.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  // ========== VWL / mc (21) ==========
  { id: 'f6e5e45e-ddb7-4d37-bce0-cab3ee95d69e', fachbereich: 'VWL', musterlosung: 'Der Wechselkurskanal ist ein Transmissionskanal der Geldpolitik. Eine Zinserhöhung macht Frankenanlagen attraktiver, der Franken wertet auf. Importe werden billiger (direkter Effekt auf Preise), Exporte verlieren an Nachfrage (indirekter Effekt). Beides dämpft die Inflation. Der Kanal ist für kleine offene Volkswirtschaften wie die Schweiz besonders wirksam.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Zins → Wechselkurs → Import-/Exportpreise → Preisniveau beschreibt den Kanal exakt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Banken tauschen keine Franken mechanisch bei Zinsschritten — es sind Kapitalflüsse von Anlegern.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die SNB legt keinen festen Wechselkurs fest, sie interveniert nur bei starken Abweichungen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Wechselkurse sind ein zentraler Kanal der Geldpolitik, nicht ohne Einfluss.' },
  ] },
  { id: 'f74ea6f5-0d45-433d-8524-270356db4da9', fachbereich: 'VWL', musterlosung: 'Der Crowding-Out-Effekt beschreibt die Verdrängung privater Investitionen durch staatliche Kreditaufnahme. Wenn der Staat sich am Kapitalmarkt verschuldet, steigen die Zinsen. Höhere Zinsen machen private Investitionen teurer und unattraktiver, sodass die staatliche Nachfrage die private teilweise ersetzt. Monetaristen nutzen dieses Argument gegen expansive Fiskalpolitik.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Nationale Investoren-Gruppen stehen nicht im Zentrum, es geht um Staat gegen Private.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Staatliche Kreditaufnahme treibt Zinsen hoch und verdrängt private Investitionen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Umgekehrte Richtung — Crowding-Out meint Verdrängung durch den Staat, nicht durch Unternehmen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Grössenverhältnisse zwischen Unternehmen sind kein Thema dieses Effekts.' },
  ] },
  { id: 'f77264dc-9b1b-49a0-80c6-4f6cd3e7c31a', fachbereich: 'VWL', musterlosung: 'Der Verwendungsansatz berechnet das BIP als Summe der Endverwendungen: Konsum (C), Investitionen (I), Staatsausgaben (G) und Nettoexporte (NX). Autokäufe der Haushalte zählen zum Konsum, der Bau einer Fabrikhalle zu den Investitionen. Wertschöpfung gehört zum Produktionsansatz, Löhne zum Einkommensansatz — alle drei Ansätze liefern dasselbe BIP.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Privater Autokauf zählt als Konsum und gehört in den Verwendungsansatz.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Wertschöpfung gehört zum Produktionsansatz, nicht zum Verwendungsansatz.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Bau einer Fabrikhalle ist Investition (I) im Verwendungsansatz.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Lohnzahlungen gehören zum Einkommensansatz, nicht zum Verwendungsansatz.' },
  ] },
  { id: 'f79b3b40-3adc-4b10-a80e-719ff80a291b', fachbereich: 'VWL', musterlosung: 'Das Stabilisierungsprogramm 2008/09 des Bundesrats (Stufen 1 und 2, total rund 1.6 Mrd. Franken) war keynesianisch geprägt. Öffentliche Investitionen wurden vorgezogen (Strasse, Schiene, Hochwasserschutz), Kreditsperren gelockert und steuerliche Entlastungen gewährt. Ziel war die Stützung der Gesamtnachfrage in der Rezession — typisches antizyklisches Vorgehen nach Keynes.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Geldmengenausweitung ist Aufgabe der SNB, nicht eines Bundesrats-Programms.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Abwarten widerspricht dem aktiven Eingreifen des Bundesrats.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Angebotspolitik mit Deregulierung war nicht der Kern der Massnahmen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Vorgezogene Staatsausgaben zur Nachfragestützung ist keynesianisches Standard-Instrument.' },
  ] },
  { id: 'f7e89c24-8c0a-48af-b7cb-1e097d7f7413', fachbereich: 'VWL', musterlosung: 'Ein Gefangenendilemma hat drei Kernmerkmale: Kooperation wäre kollektiv optimal, jeder Einzelne hat einen dominanten Anreiz zur Nicht-Kooperation, und individuell rationales Verhalten führt zu einem kollektiv schlechteren Ergebnis. Entscheidend ist, dass bindende Absprachen nicht möglich oder nicht durchsetzbar sind — sonst wäre das Dilemma lösbar.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Gegenseitige Kooperation ist das pareto-optimale Ergebnis.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Nicht-Kooperation ist dominante Strategie — unabhängig vom Verhalten des anderen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gerade fehlende Absprachemöglichkeit erzeugt das Dilemma.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Individuelle Rationalität führt im Nash-Gleichgewicht zu kollektivem Schlechterstellen.' },
  ] },
  { id: 'f7ee89dd-cc96-4736-aeec-a5ec573f7a57', fachbereich: 'VWL', musterlosung: 'Die Mehrwertsteuer wird auf den Konsum von Gütern und Dienstleistungen erhoben. In einer Rezession reduzieren Haushalte und Unternehmen ihre Ausgaben, wodurch die Steuerbemessungsgrundlage schrumpft und die Einnahmen automatisch sinken. Dieser Effekt macht die MwSt zu einem konjunktursensiblen Einnahmeposten — ähnlich wie Verrechnungssteuer und Stempelabgaben.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Rückläufiger Konsum reduziert die Steuerbemessungsgrundlage und damit die MwSt-Einnahmen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Exporte sind von der Schweizer MwSt befreit, Inlandkonsum ist die Grundlage.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Steuerpflicht besteht unabhängig von der Konjunkturlage.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Normalsatz wird nicht automatisch angepasst — Änderungen brauchen eine Volksabstimmung.' },
  ] },
  { id: 'f8dd3e2d-9967-406e-b287-959e9bc3ac57', fachbereich: 'VWL', musterlosung: 'In einer Rezession empfiehlt die keynesianische Konzeption expansive Fiskalpolitik: höhere Staatsausgaben, Steuersenkungen und bewusste Akzeptanz von Budgetdefiziten zur Stützung der Gesamtnachfrage. Das Kürzen von Sozialleistungen wäre prozyklisch und würde den Abschwung vertiefen. Die Logik folgt dem antizyklischen Prinzip — die Nachfragelücke soll durch den Staat geschlossen werden.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Vorgezogene Infrastrukturausgaben stützen die Gesamtnachfrage in der Rezession.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Steuersenkungen erhöhen das verfügbare Einkommen und den Konsum.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kürzen von Sozialleistungen ist prozyklisch und verschärft den Abschwung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Keynes akzeptiert bewusst Defizite, um die Nachfrage zu stützen — Schuldenabbau erfolgt im Aufschwung.' },
  ] },
  { id: 'f9dd5c6b-43b8-459a-815b-5851c3271690', fachbereich: 'VWL', musterlosung: 'Zölle sind eine Steuer auf Importgüter. Sie verteuern die betroffenen Importe, wodurch die Importmenge sinkt und der Inlandpreis steigt. Inländische Produzenten profitieren (höhere Preise und Absatz), Konsumenten zahlen mehr. Nach der Wohlfahrtsanalyse entsteht insgesamt ein Wohlfahrtsverlust: Die Verluste der Konsumenten übersteigen Gewinne der Produzenten und Staatseinnahmen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Preissteigerung, Produzentenschutz und Wohlfahrtsverlust sind die Standardwirkungen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Zölle verteuern Importe für Konsumenten, sie senken keine Preise.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Zölle wirken direkt auf Markt-Gleichgewicht, nicht nur auf Staatskassen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Nettowohlfahrt sinkt — die Verluste überwiegen die Gewinne.' },
  ] },
  { id: 'fa6c9d40-1398-4b83-b45d-184e50372fcf', fachbereich: 'VWL', musterlosung: 'Nach 2008 und 2020 kauften EZB und FED massiv Staatsanleihen, um langfristige Zinsen zu senken (Quantitative Easing). Die Finanzierungskosten hochverschuldeter Staaten blieben dadurch tragbar, und billiges Geld sollte Kredite und Investitionen ankurbeln. Der erhoffte Schuldenabbau der Staaten blieb allerdings weitgehend aus — stattdessen stiegen die Schulden weiter.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Inflationssteigerung war kein direktes Ziel, sondern höchstens in Kauf genommene Folge.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Zinssenkung und Wirtschaftsstützung waren die expliziten Motive der Anleihenkäufe.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Staatsschulden werden durch Aufkauf nicht getilgt, sondern nur in andere Bilanzen verschoben.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: QE ist expansiv und erhöht die Geldmenge, nicht reduziert sie.' },
  ] },
  { id: 'fa9f5c5e-7ae7-4f91-8daa-000dd3b6e2eb', fachbereich: 'VWL', musterlosung: 'Opportunitätskosten sind der entgangene Nutzen der besten nicht gewählten Alternative. Jede Entscheidung bedeutet Verzicht: Wer einen Abend lernt, verzichtet auf Freizeit; wer Geld in A anlegt, verzichtet auf den Ertrag aus B. Eisenhut fasst es zusammen: «Nichts ist gratis.» Die Idee ist zentral für rationale Entscheidungen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Entgangener Nutzen der besten Alternative ist die Standarddefinition.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Einkaufskosten sind direkte Ausgaben, keine Opportunitätskosten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kosten für eine zweite Meinung sind konkrete Geldausgaben, nicht entgangener Nutzen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Gebühren sind reale Ausgaben, Opportunitätskosten sind hingegen entgangene Nutzen.' },
  ] },
  { id: 'fb505345-cea5-4feb-b138-66922eccd2ac', fachbereich: 'VWL', musterlosung: 'Asymmetrische Information bedeutet, dass eine Marktseite besser informiert ist als die andere. Der Verkäufer eines Gebrauchtwagens kennt die Qualität besser als der Käufer, der Bewerber die eigene Leistungsbereitschaft besser als der Arbeitgeber. Diese Ungleichgewichte können zu Marktversagen führen (Adverse Selection, Moral Hazard) und werden durch Signalling oder Screening reduziert.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Unterschiedlicher Informationsstand zwischen Marktteilnehmern ist die Definition.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Staat gegen Markt ist nicht der Kern — es geht um private Marktteilnehmer.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gleiche Information wäre das Gegenteil (symmetrische Information).' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das beschreibt die Effizienzmarkthypothese, nicht asymmetrische Information.' },
  ] },
  { id: 'fb5178a8-129a-4fb2-8060-f30fa84fb874', fachbereich: 'VWL', musterlosung: 'Warengeld ist Geld, das selbst als Ware einen Eigenwert besitzt — zum Beispiel Goldmünzen, Silber, Muscheln, Salz oder Tierfelle. Es diente historisch als Tauschmittel und konnte bei Vertrauensverlust in das Geldsystem immer noch als Ware weiterverwendet werden. Moderne Papier- und Buchgeldsysteme haben diesen Eigenwert verloren.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Buchgeld ist ein Kontoeintrag ohne materiellen Eigenwert.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Warengeld hat einen Eigenwert als Ware zusätzlich zur Geldfunktion.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kryptogeld hat keinen materiellen Eigenwert, sondern basiert auf digitalen Einträgen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Papiergeld hat nur symbolischen Wert, das Papier selbst ist fast wertlos.' },
  ] },
  { id: 'fb967a7d-71e1-497f-9b8b-bf77852f05a5', fachbereich: 'VWL', musterlosung: 'Für jeden Spieler ist Verraten die dominante Strategie: Schweigt der andere, ist Verraten besser (frei statt 1 Jahr); verrät der andere, ist Verraten ebenfalls besser (10 Jahre statt lebenslänglich). Beide verraten deshalb rational und erhalten je 10 Jahre — obwohl gemeinsames Schweigen nur je 1 Jahr bedeutet hätte. Das ist der Kern des Dilemmas.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Schweigen ist riskant — bei einseitigem Verrat droht lebenslänglich.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Abwechseln ist keine Strategie in diesem Einmal-Spiel ohne Kommunikation.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Verraten ist unabhängig vom Verhalten des anderen immer besser — dominante Strategie.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Es gibt eine dominante Strategie (Verraten), auch wenn das Ergebnis kollektiv schlecht ist.' },
  ] },
  { id: 'fbdbcd12-1862-42fb-af23-c08408b4f1ac', fachbereich: 'VWL', musterlosung: 'Die Steuerinzidenz hängt von den Preiselastizitäten ab, nicht vom gesetzlichen Steuerschuldner. Die Marktseite, die weniger ausweichen kann (unelastischer reagiert), trägt den grösseren Teil der Last. Bei unelastischer Nachfrage wie beim Benzin können Produzenten die Steuer weitgehend auf Konsumenten überwälzen. Bei elastischer Nachfrage bleibt die Last hauptsächlich bei den Produzenten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Wer gesetzlich abführt, trägt ökonomisch nicht zwingend die Last — entscheidend sind Elastizitäten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Staat bestimmt nur den Steuersatz, nicht die Inzidenz am Markt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Konsumenten tragen nur dann mehr, wenn ihre Nachfrage unelastisch ist.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Die unelastischere Marktseite trägt den grösseren Teil der Steuerlast.' },
  ] },
  { id: 'fc0eed3a-0628-4c50-a6ae-24e9d80f162f', fachbereich: 'VWL', musterlosung: 'Im BOB-Spiel hat X einen Eigenwert von 1 Siegpunkt pro Stück — zusätzlich zur Tauschmittelfunktion. Damit entspricht X dem Warengeld, das neben der Geldfunktion auch einen konkreten Gebrauchswert aufweist (historisch Gold, Silber, Salz). Wäre X nur ein wertloses Tauschobjekt, wäre es Papiergeld; als reiner Kontostand wäre es Buchgeld.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: X erfüllt Tauschmittelfunktion und hat zusätzlich Eigenwert — klassisches Warengeld.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Buchgeld wäre eine reine Zahl ohne materiellen Eigenwert.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Papiergeld hat keinen Eigenwert — X hingegen gibt immer einen Siegpunkt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Digitalität allein macht kein Kryptogeld — entscheidend wäre die Technologie.' },
  ] },
  { id: 'fc6b80cf-6f19-4d99-85e2-1782d13da18f', fachbereich: 'VWL', musterlosung: 'Bei indirekten Steuern wie der Mehrwertsteuer fallen Steuerschuldner und Steuerträger auseinander. Das Unternehmen ist Steuerschuldner — es muss die MwSt gegenüber dem Staat abrechnen und abführen. Der Konsument ist Steuerträger — er zahlt die Steuer wirtschaftlich über den Endpreis. Diese Trennung ist typisch für indirekte Steuern.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Staat ist Empfänger, nicht Schuldner der Steuer.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Konsumenten sind nur Träger, das Unternehmen ist Schuldner.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Unternehmen führt die Steuer ab, Konsument trägt sie wirtschaftlich.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Richtung vertauscht — Konsumenten sind nie Steuerschuldner bei der MwSt.' },
  ] },
  { id: 'fc97e032-da79-498b-a221-92e0673b9f70', fachbereich: 'VWL', musterlosung: 'Seit 2024 beträgt der Normalsatz der Schweizer Mehrwertsteuer 8.1 % (zuvor 7.7 %). Daneben gibt es den reduzierten Satz von 2.6 % für Güter des täglichen Bedarfs wie Lebensmittel, Bücher und Zeitungen sowie den Sondersatz von 3.8 % für Beherbergungsleistungen. Die Erhöhung 2024 diente primär der Finanzierung der AHV.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: 19 % ist der deutsche Satz, nicht der schweizerische.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: 8.1 % ist der aktuelle Schweizer Normalsatz seit 2024.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: 7.7 % war der Satz bis Ende 2023, nicht der aktuelle.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: 10 % ist kein in der Schweiz verwendeter MwSt-Satz.' },
  ] },
  { id: 'fec2b744-45b5-4df2-b033-813073794b4e', fachbereich: 'VWL', musterlosung: 'Die klassische Konzeption vertraut auf flexible Preise und Löhne und lehnt staatliche Eingriffe grösstenteils ab. Die Hauptkritik (Keynes): In der Realität sind Löhne nach unten starr (Tarifverträge, Mindestlöhne, Nominallohnrigidität). Der Selbstheilungsprozess dauert lange und geht mit hoher Arbeitslosigkeit einher — die Grosse Depression der 1930er-Jahre zeigte diese Grenzen deutlich.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Klassik betont Preisstabilität, Inflation wird nicht überbetont.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Umgekehrte Ausrichtung — Klassiker fordern weniger statt mehr Regulierung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Lohn- und Preisstarrheiten verzögern den Selbstheilungsprozess erheblich.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Kritik geht umgekehrt — Anpassungen dauern zu lange, nicht zu kurz.' },
  ] },
  { id: 'ff34f6cd-8b6c-40e7-b5cc-2bb636589c2b', fachbereich: 'VWL', musterlosung: 'Ein Wohlfahrtsverlust (Deadweight Loss) ist der Teil der Gesamtrente, der durch Marktverzerrungen wie Steuern, Zölle oder Preisregulierungen verloren geht. Er kommt weder Konsumenten noch Produzenten noch dem Staat zugute — er ist schlicht verschwendete Wohlfahrt, weil gewünschte Transaktionen nicht mehr zustande kommen. Jede Abweichung vom Gleichgewicht erzeugt einen solchen Verlust.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Konjunkturelle BIP-Verluste sind makroökonomisch, Deadweight Loss ist mikroökonomisch.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Verlorene Gesamtrente durch Marktverzerrung, ohne Empfänger — Kerndefinition.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Umverteilung ist kein Verlust, nur eine Verschiebung zwischen Gruppen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Steuereinnahmen sind kein Wohlfahrtsverlust, sie fliessen dem Staat zu.' },
  ] },
  { id: 'ueb-mc-features', fachbereich: 'VWL', musterlosung: 'In ExamLab Üben stehen vier Bedienfunktionen zur Verfügung: Dark Mode (Mond-Symbol), Markierung einer Frage als unsicher («?»-Button), Tastaturkürzel (Cmd/Ctrl+Enter) für die nächste Frage und direkte Navigation über Fragennummern in der Sidebar. Die Aufgabe dient dem Funktions-Check — alle vier sollten nach erfolgreichem Ausprobieren markiert werden.', teilerklaerungen: [
    { feld: 'optionen', id: 'a', text: 'Korrekt: Das Mond-Symbol unten links schaltet zwischen Light und Dark Mode.' },
    { feld: 'optionen', id: 'b', text: 'Korrekt: Der «?»-Button markiert eine Frage als unsicher für spätere Überprüfung.' },
    { feld: 'optionen', id: 'c', text: 'Korrekt: Cmd/Ctrl+Enter springt zur nächsten Frage — schneller als mit der Maus.' },
    { feld: 'optionen', id: 'd', text: 'Korrekt: Klick auf eine Fragennummer in der Sidebar navigiert direkt dorthin.' },
  ] },
  { id: 'ueb-mc-orientierung', fachbereich: 'VWL', musterlosung: 'Die Einführungsübung in ExamLab umfasst 23 Fragen quer durch alle Fragetypen. Die Gesamtzahl ist sichtbar in der Sidebar links und im Header in der Form «X/23». Die Orientierung im Übungs-Interface ist der erste Schritt vor dem eigentlichen Lösen — sie zeigt, wie weit man ist und welche Fragen noch offen sind.', teilerklaerungen: [
    { feld: 'optionen', id: 'a', text: 'Falsch: 16 Fragen ist zu wenig — die Übung enthält mehr Typen als dadurch abgedeckt würden.' },
    { feld: 'optionen', id: 'b', text: 'Falsch: 20 ist zu tief — der Header und die Sidebar zeigen einen höheren Wert.' },
    { feld: 'optionen', id: 'c', text: 'Korrekt: 23 Fragen entspricht dem Wert in Header («X/23») und Sidebar.' },
    { feld: 'optionen', id: 'd', text: 'Falsch: 30 ist zu hoch — die Übung ist kürzer gestaltet.' },
  ] },

  // ========== VWL / pdf (4) — keine Sub-Struktur ==========
  { id: 'ca5abcfe-9aa9-4991-8d5d-3c12331c6b27', fachbereich: 'VWL', musterlosung: 'Die im Lagebericht beschriebenen Indikatoren deuten auf eine Aufschwungphase hin: positives BIP-Wachstum, rückläufige Arbeitslosigkeit, steigende Exporte und positive Stimmungsindikatoren (KOF-Barometer, Einkaufsmanagerindex). Die Inflation liegt mit 1.4 % moderat — gegen einen Boom spricht das Fehlen von Überhitzungssignalen. Die SNB hält den Leitzins stabil, typisch für eine sich festigende Erholung ohne akute Inflationsgefahr.', teilerklaerungen: [] },
  { id: 'ec25ffa9-5d8a-4832-a58b-0c79a241009c', fachbereich: 'VWL', musterlosung: 'Die im Lagebericht beschriebenen Indikatoren deuten auf eine Aufschwungphase hin: positives BIP-Wachstum, rückläufige Arbeitslosigkeit, steigende Exporte und positive Stimmungsindikatoren (KOF-Barometer, Einkaufsmanagerindex). Die Inflation liegt mit 1.4 % moderat — gegen einen Boom spricht das Fehlen von Überhitzungssignalen. Die SNB hält den Leitzins stabil, typisch für eine sich festigende Erholung ohne akute Inflationsgefahr.', teilerklaerungen: [] },
  { id: 'einr-pdf-witz', fachbereich: 'VWL', musterlosung: 'Die Aufgabe dient dem Kennenlernen der PDF-Annotation. Erwartet werden: Durchblättern des Dokuments über mehrere Seiten, gelbe Textmarkierung eines ausgewählten Witzes und ein Kommentar mit einer persönlichen Begründung. Bewertet werden Vollständigkeit der Markierung, Nachvollziehbarkeit des Kommentars und korrekte Bedienung der Werkzeuge — nicht der Witzinhalt selbst.', teilerklaerungen: [] },
  { id: 'ueb-pdf-witz', fachbereich: 'VWL', musterlosung: 'Die Übung prüft die Handhabung von Textmarker und Kommentar-Werkzeug in der PDF-Annotation. Erwartet wird das Markieren eines gewählten Witz-Titels in Gelb sowie das Einfügen eines kurzen Kommentars mit persönlicher Bewertung. Das Ziel ist die technische Beherrschung der Werkzeugleiste; die konkrete Auswahl des Witzes bleibt individuell.', teilerklaerungen: [] },

  // ========== VWL / richtigfalsch (25) — keine Sub-Struktur (aussagen ohne IDs) ==========
  { id: '0045d72a-730d-4413-8c8b-9528fd12cf5b', fachbereich: 'VWL', musterlosung: 'Falsch. Je mehr Substitutionsmöglichkeiten für ein Gut bestehen, desto elastischer ist die Nachfrage — nicht unelastischer. Konsumenten können bei Preiserhöhungen auf Alternativen ausweichen und reagieren deshalb stark. Wenige oder keine Substitute (Insulin, Trinkwasser, kurzfristig Benzin) machen die Nachfrage unelastisch, weil das Ausweichen schwierig ist.', teilerklaerungen: [] },
  { id: '0231b8b9-ed5f-4cb4-ba57-4e5c79024cca', fachbereich: 'VWL', musterlosung: 'Richtig. Die Stagnation ist die Phase zwischen Hochkonjunktur und Abschwung. Die Wirtschaftsleistung hat ihren Höhepunkt erreicht, die Wachstumsraten nehmen ab, aber das Niveau ist noch hoch. Sie markiert den Wendepunkt, nach dem sich Auftragslage, Investitionen und Stimmung abkühlen — die Vorstufe der Rezession.', teilerklaerungen: [] },
  { id: '024d0433-c6e4-4a97-a72a-094d174e1f1b', fachbereich: 'VWL', musterlosung: 'Richtig. Die technische Definition der Rezession ist ein Rückgang des realen BIP in zwei aufeinanderfolgenden Quartalen gegenüber dem jeweiligen Vorquartal. Diese Konvention wird von Statistikämtern und Zentralbanken breit verwendet. Eine zusätzliche Einordnung (z.B. NBER-Methode in den USA) berücksichtigt auch Beschäftigung, Einkommen und Industrieproduktion.', teilerklaerungen: [] },
  { id: '0261b531-8701-4d69-b3d5-5deab87b6850', fachbereich: 'VWL', musterlosung: 'Falsch. Die Güterklassifikation hängt von der Verwendung ab, nicht vom Gegenstand selbst. Ein Lastwagen im gewerblichen Transport ist Investitionsgut, ein privat als Hobby genutzter Oldtimer ist Konsumgut (Gebrauchsgut). Entscheidend ist der Einsatzzweck — dieselbe Ware kann je nach Kontext unterschiedlich eingeordnet werden.', teilerklaerungen: [] },
  { id: '03a2a152-e4ae-47cc-a6d5-4b2164e6f560', fachbereich: 'VWL', musterlosung: 'Richtig. Kaufkraft und Preisniveau verhalten sich invers zueinander. Steigt das Preisniveau (Inflation), bekommt man für einen Franken weniger Güter und Dienstleistungen — die Kaufkraft sinkt. Diese Beziehung ist zentral für die Geldpolitik der SNB, deren Mandat der Erhaltung der Kaufkraft über die Preisniveaustabilität dient.', teilerklaerungen: [] },
  { id: '05acc77d-21a3-450f-aa82-f053e03ce668', fachbereich: 'VWL', musterlosung: 'Richtig. Der Kern der Allmende-Tragödie: Der individuelle Nutzer erhält den vollen Ertrag seiner Nutzung (Fisch, Holz, Weide), trägt aber nur einen Bruchteil der kollektiven Kosten (Bestandsrückgang, Erosion). Diese Asymmetrie zwischen individuellem Anreiz und kollektivem Optimum führt systematisch zur Übernutzung gemeinsamer Ressourcen.', teilerklaerungen: [] },
  { id: '0620ad25-fdd4-423c-9f13-982bbad4c76b', fachbereich: 'VWL', musterlosung: 'Richtig. Cayman Islands, Bermuda, Jersey und Guernsey erheben keine oder sehr tiefe Unternehmenssteuern, wahrten lange Zeit strenges Bankgeheimnis und stellen geringe Anforderungen an die wirtschaftliche Substanz dort ansässiger Firmen. Sie gelten international als klassische Steuerparadiese — auch wenn OECD-Initiativen (BEPS) den Spielraum zuletzt eingeschränkt haben.', teilerklaerungen: [] },
  { id: '07758196-e678-4954-a97d-3ce273e709d1', fachbereich: 'VWL', musterlosung: 'Richtig. Im Konzept der Laissez-faire-Marktwirtschaft beschränkt sich der Staat auf Kernaufgaben: Rechtsordnung (Eigentumsschutz, Verträge), Ausbildung, Verkehrsinfrastruktur und Landesverteidigung. Dieses Minimalstaatsmodell wurde in der Schweiz nie vollständig umgesetzt — es dient aber als Referenz für die Abgrenzung zur sozialen Marktwirtschaft mit aktiver Verteilungsrolle.', teilerklaerungen: [] },
  { id: '086a3b60-f550-41dd-b1af-a430b58f79c2', fachbereich: 'VWL', musterlosung: 'Richtig. Wer «keine Zeit» sagt, meint ökonomisch gesehen «die Opportunitätskosten sind mir zu hoch». Alle Menschen haben gleich viele Stunden am Tag — der Unterschied liegt in der relativen Wertschätzung alternativer Nutzungen. Eisenhut formuliert: Die ehrliche ökonomische Antwort lautet, dass andere Aktivitäten gerade einen höheren Nutzen bieten.', teilerklaerungen: [] },
  { id: '08df2677-1a2a-4fa6-a68e-179e352f79f8', fachbereich: 'VWL', musterlosung: 'Falsch. Der Homo oeconomicus beschreibt nicht das Verhalten eines einzelnen Menschen, sondern ein abstrahiertes Durchschnittsverhalten. Er ist ein Modell, das komplexe Entscheidungen vereinfachen soll, um Prognosen zu ermöglichen. Abweichungen einzelner Personen sind zu erwarten und werden in der Verhaltensökonomie (Kahneman, Thaler) systematisch untersucht.', teilerklaerungen: [] },
  { id: '0ad28e16-1d07-44c0-96c9-b7c5c7aee6d1', fachbereich: 'VWL', musterlosung: 'Richtig. Akerlof zeigte in «The Market for Lemons» (1970): Wenn Käufer die Qualität nicht prüfen können, bieten sie nur einen Durchschnittspreis. Für Verkäufer guter Autos ist dieser Preis zu tief, sie verlassen den Markt — es bleiben nur «Lemons» (schlechte Autos). Der Markt für gute Autos schrumpft oder verschwindet ganz. Akerlof erhielt dafür 2001 den Nobelpreis.', teilerklaerungen: [] },
  { id: '0b5fa7f8-d838-4643-b2cd-6234ce32de1e', fachbereich: 'VWL', musterlosung: 'Falsch. Die gesetzliche Inzidenz (wer die Steuer abführt) ist ökonomisch irrelevant. Entscheidend ist die ökonomische Inzidenz, bestimmt durch die Elastizitäten. Bei unelastischer Benzinnachfrage können Produzenten die Steuer weitgehend auf Konsumenten überwälzen — diese weichen kaum aus. Die Konsumenten tragen deshalb den grösseren Teil der Last, unabhängig vom gesetzlichen Abführer.', teilerklaerungen: [] },
  { id: '0b727833-1b2a-46df-ac14-8d884e7723d0', fachbereich: 'VWL', musterlosung: 'Falsch. Der Geldschöpfungsmultiplikator ist zeitlich variabel. Er hängt vom Zinsniveau, der Bargeldnachfrage und der Kreditbereitschaft der Banken ab. In Krisenzeiten sinkt er typischerweise — Banken halten höhere Überschussreserven und vergeben weniger Kredite. Nach 2008 war der Multiplikator in vielen Ländern deutlich tiefer als davor, trotz massiver Geldbasis-Ausweitung.', teilerklaerungen: [] },
  { id: '0ca5da68-3580-4780-ba4b-6985e594725b', fachbereich: 'VWL', musterlosung: 'Falsch. Wenn sich alle absoluten Preise proportional verdoppeln, bleiben die relativen Preise unverändert. Beispiel: Ein Hemd kostet statt 40 nun 80 Franken, ein Buch statt 20 nun 40 — ein Hemd entspricht weiterhin zwei Büchern. Relative Preise ändern sich nur, wenn sich einzelne Preise stärker verändern als andere.', teilerklaerungen: [] },
  { id: '0e099b7d-1c66-4cc5-bf49-35a1d3ac9181', fachbereich: 'VWL', musterlosung: 'Richtig. Inflationserwartungen wirken über den Fisher-Effekt: Kreditgeber verlangen bei erwarteter Geldentwertung höhere Nominalzinsen, Arbeitnehmende fordern entsprechend höhere Löhne. Diese Anpassungen wälzen sich in Preisen weiter, sodass die erwartete Inflation tatsächlich eintritt. Die SNB verankert deshalb Inflationserwartungen aktiv über Kommunikation und Glaubwürdigkeit.', teilerklaerungen: [] },
  { id: '0f574ffe-dee0-4f36-87dc-044c52548493', fachbereich: 'VWL', musterlosung: 'Falsch. Die Elefantengrafik von Milanović zeigt: Die allerärmsten Menschen (linker Rand) haben kaum vom globalen Wachstum profitiert — ihr Einkommenszuwachs ist nahe null. Starke Gewinne verzeichnete die globale Mittelschicht (v.a. China, Indien), während die Mittelschicht in Industrieländern stagnierte und das oberste Prozent stark zulegte.', teilerklaerungen: [] },
  { id: '10e22231-2913-4f49-9ce5-22840c403d20', fachbereich: 'VWL', musterlosung: 'Richtig. Eine Rechtsverschiebung der Angebotskurve — etwa durch Technologiefortschritt — bedeutet, dass bei jedem Preis mehr angeboten wird. Bei unveränderter Nachfrage entsteht ein Angebotsüberschuss, der den Gleichgewichtspreis senkt. Die neue Gleichgewichtsmenge liegt höher: tieferer Preis, grössere Menge. Dieses Muster erklärt z.B. den Preisverfall bei Elektronikgütern.', teilerklaerungen: [] },
  { id: '1110c890-7448-41c1-905f-52c2faab680e', fachbereich: 'VWL', musterlosung: 'Falsch. Bei der Unfallversicherung unterscheidet man zwei Bereiche: Die Berufsunfallversicherung (BUV) trägt der Arbeitgeber vollständig. Die Nichtberufsunfallversicherung (NBUV) für Unfälle in der Freizeit wird vom Arbeitnehmer bezahlt — sofern dieser mindestens 8 Stunden pro Woche beim gleichen Arbeitgeber beschäftigt ist.', teilerklaerungen: [] },
  { id: '117693af-7acf-4fdb-828d-2018ae87cc78', fachbereich: 'VWL', musterlosung: 'Richtig. Die Verrechnungssteuer von 35 % wird an der Quelle auf Kapitalerträgen wie Zinsen oder Dividenden erhoben. Sie fungiert als Sicherungssteuer: Wer die Erträge korrekt deklariert, erhält sie vollständig zurück. Wer sie verschweigt, verliert den Betrag — das schafft einen starken Anreiz zur ehrlichen Deklaration.', teilerklaerungen: [] },
  { id: '12b94f82-b786-4a70-87e5-7a1bc32ec7a3', fachbereich: 'VWL', musterlosung: 'Falsch. Der Rückgang des primären Sektors bezieht sich auf den Beschäftigtenanteil, nicht auf die absolute Produktion. Dank technischem Fortschritt (Mechanisierung, Düngung, Züchtung) produziert die Schweizer Landwirtschaft heute mit deutlich weniger Arbeitskräften mehr als vor 200 Jahren. Die Arbeitsproduktivität im Agrarsektor ist massiv gestiegen.', teilerklaerungen: [] },
  { id: '12ee59c9-dc9b-4940-a37a-a4e17e97417d', fachbereich: 'VWL', musterlosung: 'Richtig. Kleine Jurisdiktionen wie Cayman Islands oder Jersey haben geringe Staatsausgaben. Wenige multinationale Firmen mit moderaten Abgaben reichen aus, um den Staatshaushalt zu decken. Für grosse Länder mit umfangreichen öffentlichen Leistungen (Bildung, Gesundheit, Infrastruktur) wäre dieses Modell nicht tragfähig — dieselbe Logik greift auch beim innerkantonalen Wettbewerb (z.B. Obwalden vs. Luzern).', teilerklaerungen: [] },
  { id: '130307ef-1b09-465c-bfcf-b548d05207ea', fachbereich: 'VWL', musterlosung: 'Richtig. Das Gefangenendilemma ist eine strategische Situation: Das Ergebnis eines Spielers hängt sowohl von seiner eigenen als auch von der Entscheidung des anderen ab. Diese gegenseitige Abhängigkeit unterscheidet das Dilemma von Entscheidungen in Isolation und macht es zum Kern vieler realer Probleme — von Klimaverhandlungen bis zu Preiskartellen.', teilerklaerungen: [] },
  { id: '1379782a-7e09-4e57-abde-6d57f8edf78e', fachbereich: 'VWL', musterlosung: 'Richtig. Neben Arbeit, natürlichen Ressourcen (Boden) und Realkapital wird Wissen als vierter Produktionsfaktor betrachtet. Er umfasst Humankapital (Wissen, Können, Fähigkeiten der Menschen) sowie technischen Fortschritt und institutionelles Wissen. Für die wirtschaftliche Entwicklung moderner Volkswirtschaften gilt Wissen heute als der wichtigste Treiber.', teilerklaerungen: [] },
  { id: '1380dd95-f04f-475d-a05b-17fa8fa50380', fachbereich: 'VWL', musterlosung: 'Richtig. Monetaristen lehnen aktive Fiskalpolitik ab. Sie argumentieren mit Zeitverzögerungen (time lags), schwerer Dosierbarkeit, ansteigenden Staatsschulden und dem Crowding-Out-Effekt. Ihre Alternative ist eine regelgebundene, stetige Geldpolitik nach Friedman — die Geldmenge soll im Gleichschritt mit dem langfristigen Potenzialwachstum ausgeweitet werden.', teilerklaerungen: [] },
  { id: '16c3d906-43f6-4d87-bed0-1e8287bb0d9e', fachbereich: 'VWL', musterlosung: 'Richtig. Im klassischen Modell passt der Lohn sich so an, dass Arbeitsangebot und -nachfrage übereinstimmen. Jeder, der zum Marktlohn arbeiten möchte, findet eine Stelle. Wer bei diesem Lohn nicht arbeitet, tut dies «freiwillig». Unfreiwillige Arbeitslosigkeit entsteht erst durch Lohnstarrheiten — etwa durch Mindestlöhne, Tarifverträge oder Insider-Outsider-Effekte.', teilerklaerungen: [] },
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
  console.log(`Session 19 done.`)
  console.log(`  Verarbeitet diese Session: ${done + skip} (done=${done}, skip=${skip})`)
  console.log(`  Total: ${total}/${totalAll} (${pct}%)`)
  if (skipped.length > 0) console.log(`  Skip-Fragen: ${skipped.join(', ')}`)
  console.log(`  Verteilung: 21 VWL/mc + 4 VWL/pdf + 25 VWL/richtigfalsch`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
