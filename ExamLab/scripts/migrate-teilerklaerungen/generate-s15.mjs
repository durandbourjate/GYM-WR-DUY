#!/usr/bin/env node
/**
 * Session 15: 50 VWL-Fragen (alle mc).
 * Erste Hälfte des 100er-Batches nach Fachbereich → Typ → ID.
 * Batchgrösse ab S15 auf 50 reduziert (Session-Stabilität).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  { id: '8b1e9c69-3e37-4b6c-9fc7-364553dce9e4', fachbereich: 'VWL', musterlosung: 'Liegt der Marktpreis unter dem Gleichgewichtspreis, fragen Konsumenten mehr nach, als Anbieter bereitstellen. Es entsteht ein Nachfrageüberschuss (Knappheit). Konsumenten konkurrieren um das knappe Gut und bieten höhere Preise, die Anbieter ausweiten die Produktion. Der Preis steigt, bis das Gleichgewicht erreicht ist.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Nachgefragte Menge übersteigt das Angebot — klassischer Nachfrageüberschuss bei tiefem Preis.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Preis bewegt sich auf der bestehenden Kurve; diese selbst verschiebt sich nicht wegen eines Preises.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Angebotsüberschuss entsteht, wenn der Preis über dem Gleichgewicht liegt, nicht darunter.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Produktionskosten hängen von Technik und Inputpreisen ab, nicht vom aktuellen Marktpreis.' },
  ] },
  { id: '8b4a4050-73c3-4f83-b9b4-78e797f19fd0', fachbereich: 'VWL', musterlosung: 'Bei Sozialversicherungen entsteht der klassische Fehlanreiz, wenn die Rente nahe am bisherigen Lohn liegt: Der finanzielle Anreiz zur Arbeitsaufnahme sinkt. Aus Sicht des Homo oeconomicus ist dieses Verhalten rational, gesellschaftlich aber unerwünscht. Reformen der IV setzen deshalb auf gestufte Anreize und den Grundsatz «Eingliederung vor Rente».', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das Problem ist umgekehrt — eine zu hohe, nicht zu tiefe Rente dämpft den Arbeitsanreiz.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: IV-Bezug macht Arbeit nicht billiger; Arbeitgeber entscheiden nach Qualifikation und Produktivität.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Rente nahe am Lohn senkt den Arbeitsanreiz — individuell rational, gesellschaftlich problematisch.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Auch gut kontrollierte Systeme haben strukturelle Fehlanreize durch die Höhe der Leistung.' },
  ] },
  { id: '8b844207-f8b6-45ad-9e81-ed8976e66d12', fachbereich: 'VWL', musterlosung: 'Nur das reale BIP ist preisbereinigt und misst die Mengenentwicklung — es eignet sich besser für Wachstumsvergleiche. Im Basisjahr ist der Preisindex per Definition 100, daher sind nominales und reales BIP dort identisch. Bei Deflation (Preise sinken) liegt das reale über dem nominalen BIP, bei Inflation umgekehrt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Reales BIP ist preisbereinigt und bildet echtes Mengenwachstum ab.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Bei Deflation ist das reale BIP höher als das nominale, nicht umgekehrt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Im Basisjahr ist der Preisindex 100 — nominal und real stimmen überein.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bei Deflation (Preisindex unter 100) kann das reale BIP grösser als das nominale sein.' },
  ] },
  { id: '8bd5fb93-46b8-4f61-aa09-add1cdc89dc6', fachbereich: 'VWL', musterlosung: 'Die angebotsorientierte Konzeption will die Standortattraktivität und Investitionsanreize verbessern. Dazu gehören Senkung der Unternehmenssteuern, Deregulierung und Bürokratieabbau sowie ein flexibler Arbeitsmarkt. Höhere Staatsausgaben in der Rezession sind dagegen ein keynesianisches Instrument; Angebotsökonomen lehnen aktive Nachfragesteuerung ab.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Tiefere Unternehmenssteuern stärken Investitionsanreize und Standortattraktivität.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Weniger Regulierung und Bürokratie senkt Kosten und fördert unternehmerische Aktivität.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Nachfragesteuerung durch mehr Staatsausgaben ist keynesianisch, nicht angebotsorientiert.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Flexiblere Löhne und Kündigungsregeln gelten als angebotsfördernd.' },
  ] },
  { id: '8bfad895-f9a0-4900-ad52-7c832bd73150', fachbereich: 'VWL', musterlosung: 'Der Steuerausschöpfungsindex der Eidgenössischen Finanzverwaltung setzt die effektiven Steuereinnahmen eines Kantons ins Verhältnis zu seinem steuerlich ausschöpfbaren Potenzial. Er zeigt, wie stark ein Kanton seine Wirtschaftskraft fiskalisch belastet. Zug, Schwyz und Nidwalden schöpfen wenig aus (tiefe Steuern), Genf und Bern dagegen stark.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein einzelner Maximalsteuersatz ignoriert die Bemessungsgrundlage und sagt nichts über Ausschöpfung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Effektive Einnahmen geteilt durch steuerlich ausschöpfbares Potenzial.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Anzahl Steuerarten misst Komplexität, nicht Belastungsintensität.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das wäre die kantonale Fiskalquote — eine andere Kennzahl ohne Potenzialbezug.' },
  ] },
  { id: '8ca0e601-f1cb-42aa-896f-9b0ce6d28178', fachbereich: 'VWL', musterlosung: 'Bei öffentlichen Gütern fehlt die Ausschliessbarkeit: Niemand kann vom Konsum ausgeschlossen werden. Rationale Individuen haben deshalb keinen Anreiz zu zahlen und nutzen das Gut trotzdem (Trittbrettfahrer). Da alle so handeln, wird das Gut privat nicht oder zu wenig bereitgestellt. Lösung: staatliche Finanzierung über Steuern.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Ohne Ausschluss fehlt der Zahlungsanreiz — Unterbereitstellung ist die Folge.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Staat produziert öffentliche Güter meist selbst oder finanziert sie, er verbietet sie nicht.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Qualität ist kein strukturelles Merkmal öffentlicher Güter.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das Problem liegt im Angebot, nicht in überhöhter Nachfrage.' },
  ] },
  { id: '8d150627-3df5-44fa-a964-17fee2684770', fachbereich: 'VWL', musterlosung: 'Der Wohlfahrtsverlust entsteht, weil eine Steuer die Preise verzerrt und Transaktionen verhindert, die ohne Steuer für beide Seiten vorteilhaft wären. Diese entgangenen Tauschgewinne gehen weder an den Staat noch an Konsumenten oder Produzenten — sie sind ein Nettoverlust für die Gesellschaft. Je elastischer die Reaktion, desto grösser der Verlust.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Steuersatz und Inflation stehen in keinem systematischen Zusammenhang.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Erhebungskosten sind ein anderer, administrativer Kostenposten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Entgangene Tauschgewinne durch nicht mehr stattfindende Transaktionen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Einnahmen fliessen dem Staat zu und sind kein Verlust für die Gesamtwohlfahrt.' },
  ] },
  { id: '8d9c7514-68b1-4d91-b2e9-753aac459952', fachbereich: 'VWL', musterlosung: 'Ein Höchstpreis unter dem Gleichgewicht reduziert die angebotene Menge unter Q*. Transaktionen, bei denen die Zahlungsbereitschaft über den Grenzkosten liegt, finden nicht mehr statt. Dieses Dreieck entgangener Handelsgewinne bildet den Wohlfahrtsverlust. Obwohl einzelne Konsumenten vom tiefen Preis profitieren, sinkt die Gesamtwohlfahrt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Einzelne profitieren, aber die Gesamtwohlfahrt sinkt durch entgangene Transaktionen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Geringere Menge bedeutet weniger realisierte Handelsgewinne.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Wohlfahrtsverlust ist unabhängig von staatlichen Gewinnen oder Verlusten.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Höchstpreis ist per Definition tief, nicht hoch.' },
  ] },
  { id: '8da6b197-0b4d-4ae4-8e35-f3c836cd3b3c', fachbereich: 'VWL', musterlosung: 'Steigt die Inflationsprognose, erhöht die SNB den Leitzins. Über den Kreditkanal zieht der SARON nach, Banken verlangen höhere Kreditzinsen, Haushalte und Unternehmen nehmen weniger Kredite auf. Die gesamtwirtschaftliche Nachfrage schwächt sich ab, der Preisdruck lässt nach. Der Mechanismus wirkt mit mehreren Monaten Verzögerung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Billigere Kredite würden die Nachfrage und damit die Inflation weiter anheizen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Mindestreserven sind in der Schweiz nicht das zentrale Instrument gegen Inflation.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Devisenkäufe zielen auf den Wechselkurs, nicht primär auf Inflationsdämpfung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Leitzinserhöhung dämpft über Kreditzinsen die Nachfrage und damit die Teuerung.' },
  ] },
  { id: '8e3663df-8211-41e3-877a-6c93e760586c', fachbereich: 'VWL', musterlosung: 'Wohlstand meint den materiellen Lebensstandard und wird oft mit dem BIP pro Kopf gemessen. Wohlfahrt ist umfassender: Sie berücksichtigt zusätzlich Gesundheit, Bildung, Freizeit, Umweltqualität und soziale Sicherheit. Das BIP erfasst damit Wohlstand gut, Wohlfahrt aber nur unvollständig. Deshalb ergänzen Indizes wie HDI oder Better-Life-Index die Messung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wohlstand ist materiell (BIP pro Kopf), Wohlfahrt bezieht weitere Lebensbereiche ein.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Zuordnung ist vertauscht — Wohlfahrt umfasst die Umwelt, Wohlstand nicht.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Wohlfahrt ist breiter als nur staatliche Sozialleistungen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Konzepte unterscheiden sich bewusst; sie sind keine Synonyme.' },
  ] },
  { id: '8f211106-7ee6-40a6-b7ec-e4713e8e7cc1', fachbereich: 'VWL', musterlosung: 'Die AHV läuft im Umlageverfahren: Die aktiv Erwerbstätigen finanzieren die laufenden Renten. Die Beiträge werden paritätisch von Arbeitgeber und Arbeitnehmer getragen, und es existiert eine Maximalrente trotz höherer Einzahlungen (Solidaritätsprinzip). Die Finanzierung umfasst neben Lohnbeiträgen auch Bundesbeiträge und einen Mehrwertsteueranteil.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Die aktuellen Beitragszahler finanzieren die laufenden Renten (Umlage).' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: AG und AN tragen je 4,35 Prozent — paritätisch finanziert.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Maximalrente begrenzt die Auszahlung unabhängig von höheren Einzahlungen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bund und Mehrwertsteuer-Anteil steuern ebenfalls zur AHV-Finanzierung bei.' },
  ] },
  { id: '8f6ff5f5-360c-4e85-83e5-506efa3453ee', fachbereich: 'VWL', musterlosung: 'Zur Durchsetzung des Mindestkurses von 1.20 CHF pro Euro kaufte die SNB zwischen 2011 und 2015 Devisen im Wert von über 200 Milliarden Franken. Sie bezahlte Euro und andere Fremdwährungen mit neu geschaffenen Franken. Das Angebot an Franken stieg, die Nachfrage nach Euro wurde gestützt. Der Kurs blieb stabil bei 1.20.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein Verbot von Devisentransaktionen war kein Instrument der SNB.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Offene Devisenkäufe mit neu geschaffenen Franken setzten den Mindestkurs durch.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Höhere Leitzinsen hätten den Franken zusätzlich gestärkt — falsche Richtung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Mindestreserven wirken auf die Geldschöpfung, nicht direkt auf den Wechselkurs.' },
  ] },
  { id: '903cfeb4-ff7d-4e43-bf50-6e81fe0afcb1', fachbereich: 'VWL', musterlosung: 'Bei adverser Selektion ist die Durchschnittsprämie für «gute» Risiken zu hoch und für «schlechte» attraktiv. Vorsichtige Versicherte verzichten, während riskante abschliessen. Der Anteil schlechter Risiken im Bestand steigt, die Prämien steigen weiter, und der Markt kann zusammenbrechen. Information und Risiko-Differenzierung wirken dagegen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Gute Risiken scheiden aus, da die Durchschnittsprämie für sie unattraktiv ist.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Staat regelt nicht die Risikozulassung einzelner Versicherter.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das beschreibt Moral Hazard, nicht adverse Selektion.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Versicherungen wollen eigentlich gute Risiken — die Auslese entsteht umgekehrt.' },
  ] },
  { id: '9102a275-48b4-4d90-b7be-c12197f38548', fachbereich: 'VWL', musterlosung: 'Güter werden anhand zweier Eigenschaften klassifiziert. Rivalität bedeutet, dass der Konsum durch eine Person die Verfügbarkeit für andere verringert. Ausschliessbarkeit bedeutet, dass Nicht-Zahlende vom Konsum ausgeschlossen werden können. Aus den Kombinationen ergeben sich private Güter, Clubgüter, Allmendegüter und öffentliche Güter.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Knappheit und Nutzen sind allgemeine Kategorien, keine Klassifikationsmerkmale.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Rivalität im Konsum und Ausschliessbarkeit definieren die vier Gütertypen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Angebot und Nachfrage bestimmen Preise, nicht Gütereigenschaften.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Preis und Qualität sind Marktmerkmale, nicht Klassifikationskriterien.' },
  ] },
  { id: '91a518cc-1455-4cf7-a7e4-ac72e3bf7824', fachbereich: 'VWL', musterlosung: 'Das magische Sechseck umfasst sechs wirtschaftspolitische Ziele: Vollbeschäftigung, Preisstabilität, Wirtschaftswachstum, aussenwirtschaftliches Gleichgewicht, sozialer Ausgleich und Umweltqualität. Ursprünglich war es ein Dreieck, das schrittweise erweitert wurde. «Magisch» heisst es, weil die Ziele teilweise in Konflikt stehen und nie alle gleichzeitig voll erreicht werden können.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ideologische Schlagworte, keine formalen Zielgrössen der Wirtschaftspolitik.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das sind Kennzahlen und Instrumente, keine Zielkategorien.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Die sechs etablierten wirtschaftspolitischen Ziele in der Schweizer Lehrbuchtradition.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Werte der Französischen Revolution sind keine wirtschaftspolitischen Ziele.' },
  ] },
  { id: '92651940-d757-40cf-9411-ce7c5ca7aab7', fachbereich: 'VWL', musterlosung: 'Die Volkswirtschaftslehre wird als «Lehre von Entscheidungen bei Knappheit» bezeichnet. Die verfügbaren Mittel — Arbeit, Boden, Kapital, Zeit — reichen nicht aus, um alle (unbegrenzten) Bedürfnisse zu befriedigen. Jede Verwendung schliesst eine andere aus und erzwingt eine Wahl, was die ökonomische Grundfrage allgegenwärtig macht.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Knappheit ist das konstituierende Problem der Volkswirtschaftslehre.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Aussenhandel ist ein Teilbereich; das zentrale Problem liegt umfassender.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das ist eine politikwissenschaftliche Frage, keine ökonomische.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Unternehmensführung ist Gegenstand der Betriebswirtschaftslehre.' },
  ] },
  { id: '930a8efd-4258-49d7-843b-e6cf513cf994', fachbereich: 'VWL', musterlosung: 'Eine Einkommenselastizität von 2.5 bedeutet: Steigt das Einkommen um 1 Prozent, wächst die Nachfrage um 2.5 Prozent. Werte über 1 kennzeichnen Luxusgüter, Werte zwischen 0 und 1 normale Güter, Werte unter 0 inferiore Güter. Die Nachfrage nach Luxushandtaschen steigt also überproportional mit dem Einkommen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Angabe misst Einkommens-, nicht Preiselastizität.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Bei inferiorem Gut wäre die Elastizität negativ, nicht +2.5.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Positiver Wert über 1 signalisiert überproportionale Reaktion und damit ein Luxusgut.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Einkommenselastizität misst Mengen, keine Preise.' },
  ] },
  { id: '930f7536-2a96-43ab-ab5f-bebe9660a7e2', fachbereich: 'VWL', musterlosung: 'Eine Steuer wirkt für die Anbieter wie zusätzliche Kosten pro Einheit. Die Angebotskurve verschiebt sich um den Steuerbetrag nach oben beziehungsweise nach links. Im neuen Gleichgewicht steigt der Konsumentenpreis, der Nettoerlös der Produzenten sinkt, und die gehandelte Menge geht zurück. Die Lastverteilung hängt von den Elastizitäten ab.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Mengensteuern schreiben keine Produktionsmenge vor, sondern verteuern jede Einheit.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Höhere Kosten bedeuten, dass Anbieter pro Menge einen höheren Preis verlangen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Eine Steuer senkt den Nettoerlös der Produzenten, sie erhöht ihn nicht.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Nachfragekurve bleibt unverändert; betroffen ist das Angebot.' },
  ] },
  { id: '937d3fbb-a1b2-47de-83d6-c6f0b3a5d8da', fachbereich: 'VWL', musterlosung: 'Direkte Steuern — zum Beispiel Einkommens- und Vermögenssteuern — können progressiv gestaltet werden. Der Steuersatz steigt mit der Bemessungsgrundlage, wodurch wirtschaftlich leistungsfähigere Personen relativ mehr beitragen. Indirekte Steuern wie die Mehrwertsteuer belasten dagegen alle Konsumenten gleich und wirken regressiv auf tiefe Einkommen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Auch direkte Steuern können Verzerrungen (z.B. auf Arbeitsangebot) verursachen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Direkte Steuern sind auf Lohnausweis und Steuererklärung sichtbar.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Progression erlaubt eine Besteuerung nach wirtschaftlicher Leistungsfähigkeit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Mehrwertsteuer ist administrativ einfacher — direkte Steuern sind aufwändiger.' },
  ] },
  { id: '938f7398-0822-443b-8017-49585e981f47', fachbereich: 'VWL', musterlosung: 'Die Konsumentenrente ist das Dreieck zwischen Nachfragekurve und Gleichgewichtspreis, die Produzentenrente das Dreieck zwischen Gleichgewichtspreis und Angebotskurve. Im Marktgleichgewicht ist die Summe KR + PR maximal. Staatliche Eingriffe wie Höchstpreise oder Steuern verkleinern diese Summe und führen zu einem Wohlfahrtsverlust.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Gesamtwohlfahrt ist genau die Fläche KR + PR im Preis-Mengen-Diagramm.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Produzentenrente gehört ebenfalls zur Gesamtwohlfahrt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: KR und PR addieren sich, sie heben sich nicht auf.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Gesamtwohlfahrt ist die Summe aus Konsumenten- und Produzentenrente.' },
  ] },
  { id: '9593153d-74ec-4fa3-8619-8208c41b2d67', fachbereich: 'VWL', musterlosung: 'Meritorische Güter sind Güter, deren Nutzen von den Individuen unterschätzt wird — zum Beispiel Bildung, Gesundheitsvorsorge oder Altersvorsorge. Der Staat fördert ihren Konsum durch Obligatorien (Schulpflicht, Versicherungspflicht) oder Subventionen. Demeritorische Güter sind das Gegenteil: Tabak oder Alkohol werden übermässig konsumiert und deshalb beschränkt oder besteuert.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Demeritorische Güter werden überschätzt und deshalb zu viel konsumiert.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Öffentliche Güter sind nicht ausschliessbar — ein anderes Konzept.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Nutzen wird unterschätzt, der Staat fördert deshalb Konsum oder Ausbildung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Clubgüter betreffen Ausschliessbarkeit (z.B. Streamingdienste), nicht Fehleinschätzung.' },
  ] },
  { id: '95cbc587-f855-4a31-9a83-37ca081ea3cf', fachbereich: 'VWL', musterlosung: 'Wassermelonen verletzen mehrere zentrale Geldeigenschaften: Sie verderben rasch (nicht haltbar), sind schwer zu transportieren und lassen sich kaum präzise teilen. Geld muss dagegen haltbar, leicht, teilbar und einheitlich sein. Münzen und Banknoten erfüllen diese Anforderungen deutlich besser und wurden historisch deshalb zu Geld.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Verderblich, schwer und schlecht teilbar — drei Geldeigenschaften verletzt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Wassermelonen sind knapp genug; das Problem liegt bei den physischen Eigenschaften.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Wassermelonen sind nicht besonders wertvoll — das Gegenteil kann ebenso Geldfunktion hindern.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Akzeptanz liesse sich aufbauen, die physischen Nachteile aber nicht beheben.' },
  ] },
  { id: '96038416-d73b-4d7e-9c31-d9714be4e245', fachbereich: 'VWL', musterlosung: 'Wenn der Staat am Kapitalmarkt grosse Mengen an Staatsanleihen anbietet, steigt die Geldnachfrage. Um Investoren zu gewinnen, müssen höhere Zinsen geboten werden. In offenen Finanzmärkten kann diese Entwicklung auch Zinssätze anderer Länder anheben und private Investitionen verdrängen — das sogenannte Crowding-out.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Staaten sind grosse Marktteilnehmer; ihre Emissionen wirken auf den Zinssatz.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Höhere Geldnachfrage durch Emissionen drückt die Zinsen nach oben.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Sichere Anlage senkt nur die Risikoprämie, nicht das Marktzinsniveau insgesamt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Geldmenge ist Sache der Zentralbank, nicht der Staatsanleihen-Emissionen.' },
  ] },
  { id: '96ac87b7-5ef9-4e82-8e7b-e6f9e5c922a1', fachbereich: 'VWL', musterlosung: 'Das Zitat stammt aus Adam Smiths Hauptwerk «Der Wohlstand der Nationen» von 1776. Smith beschreibt das Eigeninteresse als Triebkraft wirtschaftlichen Handelns: Der Bäcker arbeitet nicht aus Nächstenliebe, sondern weil er Geld verdienen will. Über den Markt profitieren beide Seiten — ein zentraler Baustein des liberalen Wirtschaftsdenkens.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Adam Smith formulierte den Gedanken 1776 im «Wohlstand der Nationen».' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Marx kritisierte das Eigeninteresse im «Kapital» — andere Stossrichtung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Keynes schrieb 1936 über Nachfragesteuerung, nicht über den Bäcker.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Friedman argumentierte später monetaristisch; das Zitat ist viel älter.' },
  ] },
  { id: '98c9ed9e-06d9-42de-8688-0204ca35d286', fachbereich: 'VWL', musterlosung: 'Automatische Stabilisatoren sind staatliche Einnahmen und Ausgaben, die ohne aktive Entscheide konjunkturdämpfend wirken. In der Rezession sinken Steuereinnahmen und steigen Sozialausgaben wie die Arbeitslosenentschädigung — die Nachfrage wird gestützt. Im Aufschwung kehrt sich der Effekt um. Sie wirken schneller als diskretionäre Konjunkturprogramme.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Geldpolitik ist Sache der SNB — Stabilisatoren sind fiskalisch.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Wirken konjunkturglättend ohne politische Einzelentscheide.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Internationale Abkommen sind kein automatischer Mechanismus im Inland.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Konjunkturprogramme sind gerade diskretionär, nicht automatisch.' },
  ] },
  { id: '99f45009-8044-43a1-81e2-e03bd313572b', fachbereich: 'VWL', musterlosung: 'Gemäss Eisenhut beeinflussen fünf wirtschaftspolitische Bereiche das Wachstumspotenzial wesentlich: Wettbewerbspolitik (Effizienz), Aussenwirtschaftspolitik (offene Märkte), Bildungspolitik (Humankapital), Innovationspolitik (Forschung und Technologietransfer) und Finanzpolitik (solide Staatsfinanzen). Diese Bereiche setzen auf der tief liegenden Ebene an und wirken langfristig.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Zolltarife und Preispolitik sind Einzelinstrumente, nicht die fünf Grundbereiche.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Diese Aufteilung kombiniert andere Politikfelder und entspricht nicht Eisenhut.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Die fünf Eisenhut-Bereiche für Wachstumsrahmenbedingungen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Branchen- und Sektorpolitik sind keine Wachstumskategorien im Lehrbuch.' },
  ] },
  { id: '9ad4acc6-ac7e-4355-b6f0-743cd216eb82', fachbereich: 'VWL', musterlosung: 'Anreize wirken in beide Richtungen: Belohnungen motivieren, Strafen schrecken ab. Der Homo oeconomicus reagiert laufend auf veränderte Rahmenbedingungen und passt sein Verhalten an. Anreize haben aber häufig unerwünschte Nebeneffekte — der Kobra-Effekt ist das bekannteste Beispiel. Menschen reagieren kreativ und oft anders, als der Gesetzgeber beabsichtigt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Anreize umfassen Belohnungen und Strafen als komplementäre Hebel.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Menschen reagieren oft kreativ und nicht wie geplant (Kobra-Effekt).' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Unerwünschte Nebenwirkungen sind regelmässig dokumentiert.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Bei veränderten Anreizen überprüft der Homo oeconomicus seinen Entscheid.' },
  ] },
  { id: '9ad89a6b-4bfa-420b-8658-639694fd6a6d', fachbereich: 'VWL', musterlosung: 'In der Schweiz beträgt der Mehrwertsteuer-Normalsatz 8.1 Prozent (Stand 2024). Der reduzierte Satz von 2.6 Prozent gilt für Lebensmittel, Bücher und Medikamente; der Sondersatz von 3.8 Prozent für Beherbergungsleistungen (Hotels). Die MwSt ist eine indirekte Steuer — sie belastet Transaktionen, nicht persönliche Merkmale wie Einkommen oder Vermögen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: 8.1 Prozent ist der Normalsatz seit 2024.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Lebensmittel, Bücher und Medikamente gelten zum reduzierten Satz von 2.6 Prozent.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Mehrwertsteuer ist eine indirekte Steuer auf Transaktionen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Für Hotels und Beherbergung gilt der Sondersatz von 3.8 Prozent.' },
  ] },
  { id: '9b6af135-ad44-4c3a-a9e5-f77b5573aae0', fachbereich: 'VWL', musterlosung: 'Die Laffer-Kurve argumentiert, dass zu hohe Steuersätze die Bemessungsgrundlage schrumpfen lassen. Mobile Steuerzahler wandern ins Ausland ab (Steuerflucht), legale Kanäle werden umgangen (Schwarzarbeit), und der Anreiz zu mehr Einkommen sinkt. Inflation ist dagegen kein Laffer-Mechanismus; sie ist ein monetäres Phänomen der Preisentwicklung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Steuerflucht schrumpft die Basis — klassischer Laffer-Kanal.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Schwarzarbeit umgeht hohe legale Abgaben und reduziert die Einnahmen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Sinkender Arbeitsanreiz senkt die zu besteuernde Wertschöpfung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Inflation ist ein monetäres Phänomen, nicht Teil der Laffer-Argumentation.' },
  ] },
  { id: '9bc4b3a0-bf03-4805-bb89-45b3efdd3589', fachbereich: 'VWL', musterlosung: 'Geld erfüllt drei klassische Funktionen. Es ist Tauschmittel beziehungsweise Zahlungsmittel, weil es den Güterkauf erleichtert. Es ist Recheneinheit, weil Preise damit gemessen und verglichen werden. Und es ist Wertaufbewahrungsmittel, weil es Kaufkraft über die Zeit speichert. Inflation kann die dritte Funktion allerdings schwächen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: «Spekulationsmittel» ist keine klassische Geldfunktion, sondern eine Verwendung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Schulden- und Produktionsmittel sind andere Begriffe, keine Geldfunktionen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Die drei kanonischen Geldfunktionen in der Lehrbuchtradition.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Spar- und Investitionsmittel sind Anwendungen, keine Funktionstypen.' },
  ] },
  { id: '9cf47bfb-c6d7-43c5-bde4-eafef2736646', fachbereich: 'VWL', musterlosung: 'Opportunitätskosten messen den Nutzen der besten Alternative, auf die man verzichtet. Ein Konzertticket zu 80 Franken hat als Opportunitätskosten nicht die 80 Franken selbst, sondern den entgangenen Nutzen der nächstbesten Verwendung — zum Beispiel ein Essen oder ein Buch. Das Konzept ist zentral für jede wirtschaftliche Entscheidung unter Knappheit.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Reale Produktionskosten sind ein anderer Begriff — Opportunitätskosten meinen entgangenen Nutzen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Entgangener Nutzen der besten nicht gewählten Alternative.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Regulierungskosten sind administrative Kosten, keine Opportunitätskosten.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Handelsspanne bezeichnet einen Preisunterschied, nicht Verzichtsnutzen.' },
  ] },
  { id: '9d395c1d-d6e4-4fc9-900b-54cf9f72aea5', fachbereich: 'VWL', musterlosung: 'Konsumgüter werden in Verbrauchsgüter und Gebrauchsgüter unterteilt. Verbrauchsgüter werden bei der Nutzung aufgebraucht — Lebensmittel, Getränke oder Benzin. Gebrauchsgüter hingegen können mehrmals oder über längere Zeit genutzt werden — Velos, Smartphones oder Kleider. Der Unterschied liegt in der Häufigkeit der Nutzung, nicht im Preis.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Preis ist kein Unterscheidungsmerkmal; beide Kategorien umfassen günstige und teure Güter.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Auch Kosmetika oder Benzin sind Verbrauchsgüter, nicht nur Lebensmittel.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gebrauchsgüter sind Konsumgüter — Investitionsgüter nutzen Unternehmen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Verbrauch bei einmaliger Nutzung, Gebrauch über längere Zeit — das ist die Definition.' },
  ] },
  { id: '9dc741ac-0992-4725-9c3f-b917d7d1fc57', fachbereich: 'VWL', musterlosung: 'Das Umlageverfahren der AHV hängt vom Verhältnis Beitragszahlende zu Rentnern ab. Steigende Lebenserwartung verlängert die Rentenbezugsdauer, die sinkende Geburtenrate reduziert die künftige Beitragsbasis, und der Ruhestand der Babyboomer verschiebt eine grosse Kohorte in den Rentnerblock. Die zunehmende Frauen-Erwerbstätigkeit wirkt dagegen entlastend, kompensiert die Belastungen aber nur teilweise.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Längere Lebenserwartung = längere Rentenbezugsdauer.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Weniger Geburten = schmalere Beitragsbasis künftig.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Die Babyboomer wechseln von Beitragszahlern zu Rentenbeziehenden.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Mehr weibliche Erwerbstätigkeit erhöht die Beiträge und wirkt entlastend.' },
  ] },
  { id: '9ea5edaa-8468-4f56-a6e5-369a8c2b411f', fachbereich: 'VWL', musterlosung: 'Angebotsökonomen kritisieren staatliche Konjunkturprogramme mit vier Hauptargumenten: Sie kommen meist zu spät (time lags), sind einseitig auf bestimmte Branchen ausgerichtet, lassen sich schwer richtig dosieren und führen zu hoher Staatsverschuldung. Einmal beschlossene Massnahmen lassen sich politisch kaum rückgängig machen. Angebotsökonomen bevorzugen deshalb strukturelle Reformen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Kritik ist allgemein und nicht auf kleine Volkswirtschaften beschränkt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das Gegenteil wird kritisiert — Programme sind oft teuer, nicht billig.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Timing, Einseitigkeit, Dosierung und Verschuldung — die vier klassischen Einwände.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Programme werden vor allem in Rezessionen diskutiert, nicht in der Hochkonjunktur.' },
  ] },
  { id: 'a0144e53-134e-43b3-a05f-1d5b29170b93', fachbereich: 'VWL', musterlosung: 'Das Bonus-Malus-System der Autoversicherung wirkt doppelt. Gegen Moral Hazard belohnt es schadenfreies Fahren mit tieferen Prämien — Unfälle werden teurer. Gegen adverse Selektion nähert sich die Prämie über die Zeit dem individuellen Risiko an. Das Obligatorium der Haftpflichtversicherung bleibt aber unabhängig bestehen; es wird nicht durch das Bonus-Malus ersetzt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Belohnung für schadenfreies Fahren setzt Anreiz für Vorsicht.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Die Prämie nähert sich dem tatsächlichen Risiko an — weniger Selbstselektion.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Höhere Kosten bei Unfall schaffen finanziellen Anreiz zur Unfallvermeidung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das Obligatorium besteht gesetzlich unabhängig vom Bonus-Malus weiter.' },
  ] },
  { id: 'a0a94681-8d13-4709-bf76-42c1b2cdb02f', fachbereich: 'VWL', musterlosung: 'Progressive Einkommenssteuern belasten hohe Einkommen stärker und finanzieren Umverteilung. Öffentliche Bildungsinvestitionen schaffen Chancengleichheit und heben das Humankapital der ärmeren Bevölkerung. Beide Massnahmen reduzieren die Einkommensungleichheit. Senkung von Sozialleistungen oder Abschaffung der Erbschaftssteuer würden die Ungleichheit dagegen eher vergrössern.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Höhere Sätze auf hohe Einkommen finanzieren Umverteilung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Tiefere Sozialleistungen verschlechtern die Position unterer Einkommen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Öffentliche Bildung erhöht das Humankapital und die Chancengleichheit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Erbschaftssteuer dämpft Vermögens-Vererbung — ihre Abschaffung erhöht die Ungleichheit.' },
  ] },
  { id: 'a0c75344-27d2-4f93-926c-01d9a9582708', fachbereich: 'VWL', musterlosung: 'Die Einkommenssteuer in der Schweiz hängt von drei Faktoren ab: dem Wohnort (jeder Kanton und jede Gemeinde hat eigene Steuersätze), dem Zivilstand (Ehepaare werden oft tiefer besteuert) und der Einkommenshöhe (Progression: höheres Einkommen = höherer Steuersatz). Diese Kombination erklärt, warum identische Löhne unterschiedlich stark belastet werden.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wohnort, Zivilstand und Einkommenshöhe sind die drei Bestimmungsfaktoren.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Auch die Gemeinde wirkt über ihren Steuerfuss; Kanton allein reicht nicht.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Zivilstand und Wohnort wirken zusätzlich zum Einkommen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Arbeitgeber und Beruf beeinflussen den Lohn, aber nicht direkt die Steuersätze.' },
  ] },
  { id: 'a0f781c3-713e-4ee0-81f5-c1aae21d179a', fachbereich: 'VWL', musterlosung: 'Bei negativen externen Effekten liegen die gesellschaftlichen Grenzkosten über den privaten. Der Markt orientiert sich an den privaten Kosten und produziert die Menge Q_M. Das soziale Optimum Q* liegt tiefer, beim Schnittpunkt von Nachfrage und gesellschaftlichen Grenzkosten. Die Differenz ist Überproduktion — sie verursacht einen Wohlfahrtsverlust.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Marktpreis reflektiert nur private Kosten, externe Kosten bleiben unberücksichtigt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Die Marktmenge Q_M liegt über dem sozialen Optimum Q*.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Bei negativen Externalitäten wird zu viel, nicht zu wenig produziert.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die GK-Kurve definiert gerade das soziale Optimum — sie ist zentral.' },
  ] },
  { id: 'a12085d0-4840-4ff3-b4a6-b4b540d91b0a', fachbereich: 'VWL', musterlosung: 'Die AHV wird aus vier Quellen finanziert: Lohnbeiträgen (je 4.35 Prozent von AG und AN, total 8.7 Prozent), Beiträgen des Bundes (rund 20 Prozent der Ausgaben), einem Mehrwertsteuer-Anteil (sogenanntes Demografieprozent) sowie Erträgen aus dem AHV-Ausgleichsfonds. Die Vielfalt der Quellen macht die AHV finanziell robuster.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Paritätische Lohnbeiträge sind die Hauptquelle der AHV.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Der Bund trägt über allgemeine Steuern rund ein Fünftel der AHV-Ausgaben.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Ein Anteil an der Mehrwertsteuer fliesst zur Demografiesicherung in die AHV.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Die Erträge aus dem Ausgleichsfonds ergänzen die laufende Finanzierung.' },
  ] },
  { id: 'a1adcdba-f315-48f7-87f3-2a53eea35b71', fachbereich: 'VWL', musterlosung: 'Die Arbeitsnachfrage der Unternehmen ist abgeleitet: Sie hängt von der Nachfrage nach Gütern und Dienstleistungen ab. Für die meisten Menschen ist die Teilnahme am Arbeitsmarkt existenziell, weil Lohn die Haupteinkommensquelle bildet. Das Arbeitsangebot ist dagegen heterogen — Qualifikationen und Branchen variieren stark — und der Markt ist durch GAV, Kündigungsschutz und Sozialversicherungen reguliert.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Arbeit wird nachgefragt, weil Unternehmen Güter verkaufen wollen — abgeleitete Nachfrage.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Arbeitskräfte sind stark heterogen — Qualifikationen, Branchen, Erfahrung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Für die meisten Haushalte ist Erwerbseinkommen die Haupteinnahmequelle.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: GAV, Kündigungsschutz und Sozialversicherungen regulieren den Arbeitsmarkt erheblich.' },
  ] },
  { id: 'a1fa89d5-224d-4125-a6ff-41d162b58a0f', fachbereich: 'VWL', musterlosung: 'Marxisten sind gegenüber Sozialpolitik ambivalent. Einerseits gilt sie als Errungenschaft der Arbeiterbewegung und lindert akute Not. Andererseits kann sie die kapitalistische Ordnung stabilisieren und die revolutionäre Dynamik abschwächen — Sozialpolitik wirkt dann systemerhaltend. Ob sie Fortschritt oder Stillstand ist, hängt aus marxistischer Sicht vom Kontext ab.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Marxisten sehen auch die stabilisierende Wirkung kritisch, nicht nur Positives.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Arbeiter-Sieg einerseits, Systemerhalt andererseits — zwei gegensätzliche Lesarten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Diese Haltung wäre libertär, nicht marxistisch.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Kategorische Ablehnung trifft die ambivalente marxistische Position nicht.' },
  ] },
  { id: 'a31a125a-ff68-4ad2-a7a9-5de469b636ec', fachbereich: 'VWL', musterlosung: 'Die Devisenkäufe der SNB liessen die Notenbankgeldmenge M0 massiv steigen. Die breiteren Aggregate M1 bis M3 wuchsen jedoch deutlich weniger, der Geldschöpfungsmultiplikator sank. Trotz der Geldmengenausweitung blieb die Inflation aus, weil die Umlaufgeschwindigkeit des Geldes parallel sank. Die Quantitätsgleichung M × V = P × Y erklärt diesen Zusammenhang.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Devisenkäufe blähten die Notenbankgeldmenge stark auf.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: M1 bis M3 wuchsen deutlich langsamer als M0.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Das Verhältnis M3/M0 — der Multiplikator — schrumpfte stark.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Sinkende Umlaufgeschwindigkeit kompensierte die Geldmengenausweitung (M × V = P × Y).' },
  ] },
  { id: 'a377ce37-e3ab-450d-ba12-14f8353b4921', fachbereich: 'VWL', musterlosung: 'Die Wettbewerbskommission (WEKO) ist die schweizerische Kartellbehörde. Sie überwacht den Wettbewerb, prüft Unternehmenszusammenschlüsse, verfolgt Kartellabsprachen und bekämpft den Missbrauch marktbeherrschender Stellungen. Ziel ist, den funktionierenden Wettbewerb zu sichern. Sie entscheidet eigenständig und kann sanktionsfähige Verfügungen erlassen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Subventionen vergibt der Bund oder Kantone, nicht die WEKO.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Zölle sind Sache des Bundesrats und des Bundesamts für Zoll und Grenzsicherheit.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Preisfestsetzung ist kein Instrument der WEKO — sie schützt den Wettbewerb.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Wettbewerbsüberwachung, Kartellverfolgung und Missbrauchsaufsicht sind der Kern ihrer Aufgaben.' },
  ] },
  { id: 'a3829c28-d7b3-4ac9-b3a4-360a2a99d9e3', fachbereich: 'VWL', musterlosung: 'Die Verhaltensökonomie zeigt, dass Menschen häufig nicht strikt rational handeln. Sie entscheiden impulsiv, emotional, kurzsichtig oder folgen sozialen Normen. Die Finanzkrise 2008 verstärkte diese Kritik — kaum ein Ökonom hatte sie vorhergesagt. Das Modell des Homo oeconomicus bleibt nützlich als Benchmark, bildet aber reales Verhalten nur vereinfacht ab.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Reale Menschen weichen systematisch vom vollständig rationalen Modell ab.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das Alter des Modells ist kein inhaltliches Gegenargument.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Homo oeconomicus kennt auch immaterielle Nutzen (Freizeit, Prestige).' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Nutzenmaximierung ist gerade der Kern des Modells, nicht ihre Ablehnung.' },
  ] },
  { id: 'a3d496c6-cd16-4fa3-8029-17e134bcd8af', fachbereich: 'VWL', musterlosung: 'Opportunitätskosten entsprechen dem Nutzen der besten nicht gewählten Alternative — nicht der Summe aller Alternativen. Im Beispiel liefert «Freunde treffen» 9/10, das ist die höchste verzichtete Option. Der Kinobesuch bringt 8/10. Da 8 kleiner als 9 ist, lohnt sich das Kino ökonomisch nicht; die Opportunitätskosten übersteigen den Nutzen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Opportunitätskosten sind die beste, nicht die schlechteste verzichtete Alternative.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Freunde treffen mit 9/10 ist die beste nicht gewählte Alternative.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das ist der Nutzen der gewählten Option, nicht der Verzichtsnutzen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Nicht die Summe, sondern die beste verzichtete Alternative zählt.' },
  ] },
  { id: 'a3db8a65-0ad6-43c9-9e3e-6a298fbc1b51', fachbereich: 'VWL', musterlosung: 'Die Armutsfalle beschreibt eine Situation, in der sich Erwerbsarbeit finanziell kaum lohnt. Steigt der Lohn, fallen Sozialhilfe, Prämienverbilligung und andere Transferleistungen weg. Das verfügbare Einkommen wächst nur wenig oder gar nicht. Der Anreiz zur Erwerbstätigkeit sinkt — ein zentrales Problem von Sozialsystemen mit scharfen Schwelleneffekten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wegfallende Transfers machen mehr Erwerbseinkommen netto kaum attraktiver.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Konsumschulden sind ein verwandtes, aber anderes Armutsproblem.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das bezieht sich auf Entwicklungsökonomie, nicht auf die sozialpolitische Armutsfalle.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Intergenerationale Vererbung von Armut ist ein eigenes, breiteres Phänomen.' },
  ] },
  { id: 'a3ddd42f-5a60-4cf2-b610-c9db22a3f657', fachbereich: 'VWL', musterlosung: 'Gestaltbare Rahmenbedingungen für Wirtschaftswachstum sind jene, die durch Politik beeinflusst werden können: politische Stabilität, Rechtssicherheit, Bildungs- und Innovationspolitik, Infrastruktur und Arbeitsmarktpolitik. Nicht gestaltbar sind geografische Lage, Klima, Rohstoffvorkommen oder Grösse des Binnenmarkts. Erfolgreiche Länder investieren gezielt in die gestaltbare Seite.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Bevölkerung und Landfläche sind nicht durch Wirtschaftspolitik gestaltbar.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Geografie, Klima und Rohstoffe sind natürlich gegeben, nicht gestaltbar.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Nähe und Anbindung sind geografisch-historische Gegebenheiten.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Stabilität, Rechtssicherheit, Bildung und Infrastruktur sind politisch gestaltbar.' },
  ] },
  { id: 'a502bd7c-8aec-4ee3-8a53-29cc00b821e4', fachbereich: 'VWL', musterlosung: 'Angebotsökonomen würden die Stabilisierungsmassnahmen 2008/09 kritisch beurteilen. Sie wirken mit Verzögerung, begünstigen einzelne Branchen und erhöhen die Staatsverschuldung, die sich politisch kaum zurückfahren lässt. Statt Infrastrukturprogrammen würden Angebotsökonomen strukturelle Reformen und Steuersenkungen empfehlen, um Investitionen und Leistungsanreize dauerhaft zu stärken.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Angebotsökonomen zweifeln gerade an der Effektivität kurzfristiger Nachfragestützung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Angebotsökonomen haben dezidierte Ansichten zur Fiskalpolitik.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Steuererhöhungen widersprechen der angebotsorientierten Grundhaltung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Verzerrung, Timing und Verschuldungsrisiko sind die typischen Einwände.' },
  ] },
  { id: 'a6b3d5b6-db8a-49d2-b94e-188631c80d39', fachbereich: 'VWL', musterlosung: 'John Maynard Keynes argumentierte, dass der Staat in Krisenzeiten die fehlende private Nachfrage kompensieren muss. Höhere Staatsausgaben und tiefere Steuern stützen die Gesamtnachfrage und bekämpfen die Arbeitslosigkeit. Im Aufschwung soll der Staat umgekehrt sparen, um Inflation zu vermeiden. Diese antizyklische, nachfrageorientierte Fiskalpolitik ist der Kern des Keynesianismus.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Sparen in der Rezession würde die Abwärtsspirale verschärfen — das lehnt Keynes ab.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Aktive Nachfragestützung in der Rezession ist das keynesianische Kernprogramm.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Deregulierung ist eher angebotsorientiert, nicht keynesianisch.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Geldmengen-Einschränkung in der Rezession widerspricht der keynesianischen Logik.' },
  ] },
  { id: 'a77df401-72d0-4cbe-8b1c-0c5b7a33e2dd', fachbereich: 'VWL', musterlosung: 'Schulden verschieben die Finanzierungslast in die Zukunft: Heute entstandene Ausgaben müssen später über höhere Steuern oder Ausgabensenkungen zurückbezahlt werden. Verschuldung ist deshalb nur ein vorübergehendes Instrument. Dauerhaft müssen Staatseinnahmen und Staatsausgaben zusammenpassen — sonst drohen steigende Zinsen, Vertrauensverlust und im Extremfall Zahlungsunfähigkeit.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Inflation tilgt Schulden teilweise, aber nicht automatisch und nicht ohne Kosten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Monetäre Staatsfinanzierung ist verboten, aber nicht der Kernpunkt der Frage.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Rückzahlung erfordert später höhere Steuern oder tiefere Ausgaben.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Auch ausländische Investoren kaufen Schweizer Obligationen — das ist nicht die Beschränkung.' },
  ] },
]

async function main() {
  // Validation
  for (const u of updates) {
    if (!u.id || !u.fachbereich || !u.musterlosung || !Array.isArray(u.teilerklaerungen)) {
      throw new Error(`Invalid update: ${u.id}`)
    }
    for (const t of u.teilerklaerungen) {
      if (!t.feld || !t.id || !t.text) throw new Error(`Invalid Teilerklärung in ${u.id}`)
    }
  }

  const lines = updates.map(u => JSON.stringify(u)).join('\n') + '\n'
  await fs.appendFile(OUT, lines)

  const state = JSON.parse(await fs.readFile(STATE, 'utf8'))
  const now = new Date().toISOString()
  for (const u of updates) {
    state.fragen[u.id] = { status: 'done', zeitpunkt: now, teile: u.teilerklaerungen.length }
  }
  state.verarbeitet += updates.length
  state.letzteSession = now
  await fs.writeFile(STATE, JSON.stringify(state, null, 2))

  const withTeile = updates.filter(u => u.teilerklaerungen.length > 0).length
  console.log(`Session 15: ${updates.length} Fragen appended (${withTeile} mit Teilerklärungen, ${updates.length - withTeile} ohne).`)
  console.log(`Total verarbeitet: ${state.verarbeitet} / ${state.totalFragen}`)
}

main().catch(err => { console.error(err); process.exit(1) })
