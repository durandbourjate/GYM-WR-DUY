#!/usr/bin/env node
/**
 * Session 11b: 50 VWL-Fragen (zweite Hälfte des Session-11-Batches)
 * Verteilung: 50 lueckentext — alle mit Teilerklärungen pro luecke.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  { id: '1b3c85ff-bb7f-41b3-9427-dbdf47e2d73e', fachbereich: 'VWL', musterlosung: 'Das Bruttoinlandprodukt misst die Wertschöpfung einer Volkswirtschaft. Um den tatsächlichen Produktionsbeitrag abzubilden, werden nur Endgüter berücksichtigt — Vorleistungen (z.B. Mehl für den Bäcker) fliessen indirekt über die Endprodukte ein. Würde man Zwischenstufen separat zählen, entstünden Doppelzählungen und das BIP würde verzerrt.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Wertschöpfung ist der eigentliche Produktionsbeitrag einer Volkswirtschaft — Output abzüglich Vorleistungen.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Endgüter werden nicht weiterverarbeitet, sondern direkt konsumiert oder investiert — nur sie zählen ins BIP.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Doppelzählungen entstünden, würden Vorleistungen und Endprodukte gleichzeitig gezählt — das BIP wäre überhöht.' },
  ] },
  { id: '1cfa1be8-5452-458e-9833-604c8ea8182d', fachbereich: 'VWL', musterlosung: 'Die Quantitätsgleichung lautet MV = PY. Dabei ist M die Geldmenge, V die Umlaufgeschwindigkeit (wie oft jede Geldeinheit pro Jahr den Besitzer wechselt), P das Preisniveau und Y das reale BIP. Die Gleichung zeigt: Wächst M bei konstantem V und Y, steigen die Preise — zentraler Baustein der monetaristischen Konjunkturtheorie.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'M ist die Geldmenge im Umlauf — je nach Definition M0, M1, M2 oder M3.' },
    { feld: 'luecken', id: 'luecke-1', text: 'V ist die Umlaufgeschwindigkeit: wie oft eine Geldeinheit pro Jahr verwendet wird.' },
    { feld: 'luecken', id: 'luecke-2', text: 'P ist das Preisniveau — gemittelt über alle Güter und Dienstleistungen der Volkswirtschaft.' },
    { feld: 'luecken', id: 'luecke-3', text: 'Y ist das reale BIP — die Mengenkomponente der Wirtschaftsleistung.' },
  ] },
  { id: '1d015fdf-a464-4858-993a-496ab8a62e9c', fachbereich: 'VWL', musterlosung: 'Die Schweizerische Nationalbank setzt ihre Geldpolitik um, indem sie den Leitzins festlegt. Dieser Leitzins signalisiert die angestrebte Höhe der kurzfristigen Geldmarktzinssätze. Der wichtigste dieser Zinssätze ist der Swiss Average Rate Overnight (SARON) — der Zinssatz für besicherte Übernachtkredite zwischen Banken. Die SNB steuert den SARON durch Offenmarktoperationen.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Der Leitzins ist das zentrale Instrument der SNB — er signalisiert die Geldpolitik.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Der Swiss Average Rate Overnight (SARON) ist der wichtigste Geldmarktzinssatz — er löste 2021 den Libor ab.' },
  ] },
  { id: '1eb6e1e2-3551-45a7-ba9e-6fda3906adb7', fachbereich: 'VWL', musterlosung: 'Die VWL beschäftigt sich mit dem Problem der Knappheit. Sie entsteht, weil die Wünsche und Bedürfnisse der Menschen unbegrenzt sind, während die Güter und Ressourcen zu ihrer Befriedigung begrenzt bleiben. Deshalb müssen wir wirtschaften — also entscheiden, wie knappe Mittel optimal eingesetzt werden.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Knappheit ist das zentrale ökonomische Problem — die Ausgangslage jeder volkswirtschaftlichen Analyse.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Die Wünsche oder Bedürfnisse der Menschen sind praktisch unbegrenzt — neue entstehen laufend.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Die Güter (Ressourcen) zur Bedürfnisbefriedigung sind begrenzt — deshalb muss entschieden werden.' },
  ] },
  { id: '1efd251b-fb53-4a02-982d-29b35a7783ce', fachbereich: 'VWL', musterlosung: 'Die Schweizerische Nationalbank definiert die Geldmenge M3 als Summe der Geldmenge M2 und der Termingelder. M2 umfasst Bargeld, Sichteinlagen und Spareinlagen, Termingelder haben eine feste Laufzeit. M3 ist das breiteste von der SNB berechnete Geldaggregat und dient als Indikator für das gesamte Potenzial an Kaufkraft in der Wirtschaft.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'M2 enthält Bargeld, Sichteinlagen und Spareinlagen — das breite Fundament der Geldmenge.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Termingelder haben feste Laufzeiten und ergänzen M2 zu M3 — das breiteste Geldaggregat der SNB.' },
  ] },
  { id: '21eb029d-25b5-4094-a953-29a5bffa7301', fachbereich: 'VWL', musterlosung: 'Je grösser die Preiselastizität, desto stärker reagiert die nachgefragte oder angebotene Menge auf eine Steuer — und desto höher fällt der Wohlfahrtsverlust aus. Bei unelastischen Güten (Benzin, Tabak) bleibt die Menge nahezu stabil, der Wohlfahrtsverlust ist gering. Effiziente Steuern setzen deshalb an unelastischen Märkten an (Ramsey-Regel).', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Grösser (höher): Je elastischer Angebot oder Nachfrage, desto stärker die Mengenreaktion auf Preisänderungen.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Höher (stärker): Der Wohlfahrtsverlust wächst mit der Elastizität — entgangene Tauschgewinne.' },
  ] },
  { id: '2d6e338f-efdb-4016-ad67-ee3aa6faed76', fachbereich: 'VWL', musterlosung: 'Der Tax Independence Day (TAX-I) bezeichnet den Tag, an dem ein Steuerzahler das Geld zum Bezahlen seiner Steuerlast verdient hat — erst ab dann arbeitet er «für sich selbst». In der Schweiz lag dieser Tag zuletzt etwa Mitte Mai. Rechnet man die erweiterte Fiskalquote (inkl. Sozialabgaben), verschiebt sich der TAX-I sogar auf Ende Mai.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Die Steuerlast (Steuerbelastung) ist die gesamte Abgabenlast inkl. Steuern, Gebühren und Sozialbeiträgen.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Mai — gemessen an der erweiterten Fiskalquote arbeitet der Durchschnittssteuerzahler bis dahin für den Staat.' },
  ] },
  { id: '2e7b8bbb-5ab9-4087-9066-d5009eeb0f89', fachbereich: 'VWL', musterlosung: 'Die natürliche (gleichgewichtige) Arbeitslosigkeit setzt sich aus der friktionellen und der strukturellen Arbeitslosigkeit zusammen. Sie ist das Niveau, das auch in konjunkturneutralen Phasen bestehen bleibt — selbst im Boom verschwindet es nicht. Friktionelle Arbeitslosigkeit entsteht durch Such- und Wechselprozesse, strukturelle durch Qualifikationslücken und Wirtschaftswandel.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Natürliche Arbeitslosigkeit (gleichgewichtige): Das Niveau, das in Normalzeiten unvermeidbar ist.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Friktionelle Arbeitslosigkeit entsteht beim Stellenwechsel — kurz und normal in dynamischen Arbeitsmärkten.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Strukturelle Arbeitslosigkeit entsteht durch fehlende Qualifikationen oder Branchenwandel — langfristiger.' },
  ] },
  { id: '30e62c71-bed7-4974-9127-343832471c01', fachbereich: 'VWL', musterlosung: 'Staatsversagen entsteht durch politisch motivierte Entscheidungen, Bürokratie, Verzerrung der Allokationseffizienz und Korruption oder Fehlplanung. Anders als bei Marktversagen fehlen beim Staat die disziplinierenden Effekte von Wettbewerb und Preisen. Diese Mechanismen führen zu ineffizienter Mittelverwendung und können den ursprünglichen Zweck einer Massnahme untergraben.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Bürokratie (Bürokratiekosten): Regulierungen und Verwaltung verursachen direkte und indirekte Kosten.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Korruption und Fehlplanung: Ineffizienz, Missbrauch, mangelnde Anreize zu guter Mittelverwendung.' },
  ] },
  { id: '33067012-1371-4c91-8531-545fa474d067', fachbereich: 'VWL', musterlosung: 'Damit etwas als Geld funktioniert, muss es mehrere Eigenschaften erfüllen: dauerhaft (nicht verderblich, langlebig), begrenzt verfügbar (sonst Inflation), transportfähig (leicht und handlich). Dazu kommen Teilbarkeit (verschiedene Stückelungen), Einheitlichkeit (jede Einheit gleich) und Wertstabilität. Edelmetalle erfüllten diese Kriterien historisch, heute leisten das moderne Währungen.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Dauerhaft: Geld darf nicht verderben — Metall hält, Brot nicht.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Begrenzt: Geld muss knapp sein, sonst verliert es den Wert — Beispiel Hyperinflation.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Transportfähig (leicht): Geld muss handlich und tragbar sein — deshalb keine Kühe als Zahlungsmittel.' },
  ] },
  { id: '34239211-dfbc-4225-bf00-a967c12a02d3', fachbereich: 'VWL', musterlosung: 'Arbeitslosigkeit kann direkt auf dem Arbeitsmarkt oder indirekt auf dem Gütermarkt bekämpft werden. Weil der Arbeitsmarkt ein abgeleiteter Markt ist, beeinflusst eine stärkere Güternachfrage auch die Nachfrage nach Arbeitskräften. Deshalb wirken Standortmassnahmen, Innovation und Wettbewerbsfähigkeit ebenso beschäftigungsfördernd wie direkte Lohn- oder Vermittlungspolitik.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Direkt am Arbeitsmarkt: Löhne, Vermittlung, aktive Arbeitsmarktpolitik wirken unmittelbar auf das Stellenangebot.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Indirekt am Gütermarkt: Höhere Güternachfrage erzeugt mehr Arbeitsnachfrage — über den abgeleiteten Mechanismus.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Abgeleitet: Die Arbeitsnachfrage hängt von der Güternachfrage ab — Unternehmen stellen nach Absatzlage ein.' },
  ] },
  { id: '348113c0-7aee-4564-a4e6-6dcfdbf70f49', fachbereich: 'VWL', musterlosung: 'Die Arbeitsproduktivität misst den Output pro Zeiteinheit — also was eine Arbeitsstunde an Wert erzeugt. Sie kann durch Investitionen in Realkapital (Maschinen, Anlagen) und Bildung (Humankapital) gesteigert werden. Zusammen mit dem technologischen Fortschritt bestimmt die Produktivität langfristig den Wohlstand einer Volkswirtschaft.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Arbeitsproduktivität: Output pro Zeiteinheit — zentrale Wohlstandskennzahl.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Realkapital (Kapital): Maschinen, Anlagen, Gebäude steigern die Produktivität pro Arbeiterin.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Bildung (Ausbildung): Humankapital erhöht die Fähigkeit, Werte zu schaffen — zentraler Produktivitätsfaktor.' },
  ] },
  { id: '3843aedb-00c6-47df-a91d-097e3d3bbb14', fachbereich: 'VWL', musterlosung: 'Adverse Selektion entsteht vor Vertragsabschluss (ex ante): Die Versicherung kann gute und schlechte Risiken nicht unterscheiden, überwiegend Risikogruppen schliessen ab. Moral Hazard entsteht nach Vertragsabschluss (ex post): Versicherte ändern ihr Verhalten, weil das Risiko abgesichert ist. Beide Probleme haben unterschiedliche Ursachen und verlangen unterschiedliche Gegenmassnahmen.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Adverse Selektion (Negativauslese): Schlechte Risiken schliessen überproportional ab — ein Ex-ante-Problem.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Moral Hazard (moralisches Risiko): Verhaltensänderung nach Vertragsabschluss — ein Ex-post-Problem.' },
  ] },
  { id: '3e7848a8-8171-44c3-bd62-4408f0b2a740', fachbereich: 'VWL', musterlosung: 'Das Insider-Outsider-Modell erklärt, warum strenger Arbeitnehmerschutz zu mehr Arbeitslosigkeit führen kann: Die Insider (Beschäftigten) profitieren vom Schutz, während die Outsider (Arbeitslosen) schlechtere Chancen auf eine Anstellung haben. Unternehmen scheuen Neueinstellungen, weil Kündigungen später teuer werden. Ein klassisches Beispiel für Staatsversagen durch unbeabsichtigte Nebenwirkungen.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Insider sind die Beschäftigten mit sicheren Verträgen — sie gewinnen durch Kündigungsschutz.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Outsider sind Arbeitslose und Bewerberinnen — sie zahlen den Preis durch schwereren Markteintritt.' },
  ] },
  { id: '410aa243-88be-4229-b02d-c7df2bdcf0ab', fachbereich: 'VWL', musterlosung: 'Den Vorgang, externe Kosten in den Marktpreis einzubeziehen, nennt man Internalisieren. Ein klassisches Instrument dafür ist die Lenkungssteuer (Pigou-Steuer nach Arthur Pigou): Sie entspricht genau den externen Kosten und korrigiert den Marktpreis auf das gesellschaftlich optimale Niveau. Beispiele: CO₂-Abgabe, Tabaksteuer, Verkehrsabgaben.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Internalisieren: Externe Kosten werden sichtbar gemacht, indem sie in den Preis einfliessen.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Lenkungssteuer (Pigou-Steuer): Belastet die externen Kosten — klassisches Instrument zur Internalisierung.' },
  ] },
  { id: '428a1941-6666-4518-8644-bd288014197e', fachbereich: 'VWL', musterlosung: 'Eine Preiselastizität der Nachfrage grösser als 1 heisst preiselastisch — die Menge reagiert prozentual stärker als der Preis (typisch für Luxusgüter). Eine Elastizität kleiner als 1 heisst preisunelastisch — die Menge reagiert schwächer (typisch für Grundbedürfnisse und Güter ohne Substitute, z.B. Benzin). Elastizitäten bestimmen Preisstrategien und Steuerinzidenz.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Preiselastisch (> 1): Die Menge reagiert prozentual stärker als der Preis — Luxusgüter, Substitute.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Preisunelastisch (< 1): Die Menge reagiert schwächer als der Preis — Grundbedürfnisse ohne Alternativen.' },
  ] },
  { id: '44a01353-ed70-4e9d-b63b-535e9b2bd242', fachbereich: 'VWL', musterlosung: 'Der Homo oeconomicus handelt ökonomisch rational — er wählt unter den verschiedenen Möglichkeiten diejenige, die seinen persönlichen Nutzen maximiert. Dabei wägt er Kosten und Nutzen sorgfältig ab. Das Modell stützt sich auf Adam Smiths Idee, dass Eigeninteresse via Marktmechanismus zu gesellschaftlichem Wohlstand führt.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Ökonomisch rational (vernünftig): Entscheidungen folgen einer klaren Präferenzordnung und Zielmaximierung.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Persönlicher Nutzen: Zielgrösse des Homo oeconomicus — nicht auf materielle Güter beschränkt.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Kosten werden gegen den Nutzen abgewogen — Opportunitätskosten inklusive.' },
  ] },
  { id: '4baa096a-3cbc-4be4-a080-d4fcc70ef014', fachbereich: 'VWL', musterlosung: 'Das «Gesetz der grossen Zahlen» besagt: Je grösser die Zahl der Versicherten, desto genauer kann die Versicherung die tatsächliche Zahl der Schadensfälle vorhersagen. Dieses mathematische Prinzip ist die Grundlage für die Kalkulation jeder Versicherung — erst ausreichend viele Teilnehmende machen das Risiko planbar.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Das Gesetz der grossen Zahlen: Je mehr Versicherte, desto näher liegt die Schadenshäufigkeit am Erwartungswert.' },
  ] },
  { id: '4bf9beaf-e63a-4469-a3f7-2505a1a82d62', fachbereich: 'VWL', musterlosung: 'Der Kobraeffekt beschreibt das Phänomen, dass eine gut gemeinte Massnahme genau das Gegenteil des gewünschten Ergebnisses bewirkt. Er zeigt, dass Anreizsysteme fast immer von ungewissen Nebenfolgen begleitet werden. Der Name stammt vom indischen Beispiel: Eine Prämie für tote Kobras führte dazu, dass Menschen Kobras züchteten. Weitere Beispiele: Alkoholprohibition, Abfallgebühren mit wilden Deponien.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Kobraeffekt: Paradox einer gut gemeinten Massnahme, die das Gegenteil bewirkt.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Anreizsysteme (regulatorische Eingriffe) haben fast immer unbeabsichtigte Nebenwirkungen.' },
  ] },
  { id: '4c11160b-a2ee-4a52-8453-cc5d28f5d88f', fachbereich: 'VWL', musterlosung: 'Die historische Entwicklung des Geldes verlief in drei Stufen: Zunächst Münzgeld mit innerem Stoffwert (Gold, Silber), dann Banknoten mit staatlicher Garantie, schliesslich Giralgeld als elektronisches Kontoguthaben. Jede Stufe reduziert den Materialaufwand und erhöht die Abstraktion — heute ist das meiste Geld rein digital.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Münzgeld: Gegenstände mit Eigenwert, z.B. Gold- oder Silbermünzen — früheste Geldform.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Banknoten haben kaum Stoffwert, sind aber staatlich garantiertes Zahlungsmittel.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Giralgeld ist elektronisches Buchgeld — existiert nur als Bankbuchung.' },
  ] },
  { id: '4c768290-0435-4463-a873-08ee12a128fc', fachbereich: 'VWL', musterlosung: 'Die Schweizer Krankenversicherung kennt Kopfprämien (auch Einheitsprämien): Alle Erwachsenen zahlen pro Kasse und Region denselben Betrag, unabhängig vom Einkommen. Zur Entlastung einkommensschwacher Haushalte gibt es Prämienverbilligungen. Kopfprämien sind im internationalen Vergleich ungewöhnlich — die meisten Länder finanzieren die Krankenversicherung einkommensabhängig.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Kopfprämien (Einheitsprämien): Gleicher Betrag unabhängig vom Einkommen — unüblich im internationalen Vergleich.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Prämienverbilligungen (individuelle IPV) entlasten einkommensschwache Haushalte — sozialer Ausgleich.' },
  ] },
  { id: '502b98cf-d642-441a-bd39-a7bbe6923058', fachbereich: 'VWL', musterlosung: 'Der nominale Preis drückt ein Gut in Geldeinheiten aus (z.B. CHF 5 für ein Brot). Der reale Preis bezeichnet das Tauschverhältnis zu anderen Gütern: Wie viele Einheiten eines anderen Gutes muss man aufgeben? Für Konsumenten sind reale Preise entscheidend — sie erfassen die Kaufkraft.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Nominaler Preis: Ausdruck in Geldeinheiten, z.B. CHF 5.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Realer Preis: Tauschverhältnis zu anderen Gütern — misst die tatsächliche Kaufkraft.' },
  ] },
  { id: '52305076-f98e-45f1-8585-edbf2bf0e6b9', fachbereich: 'VWL', musterlosung: 'Für zeitliche Vergleiche verwendet man das reale BIP, das die Teuerung (Inflation) herausrechnet. Für internationale Vergleiche rechnet man in Kaufkraftparitäten (PPP) um — sie berücksichtigen unterschiedliche Preisniveaus. Nur so werden BIP-Zahlen zwischen Ländern und über Jahre aussagekräftig.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Reales BIP ist inflationsbereinigt — erlaubt Vergleiche über mehrere Jahre.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Teuerung (Preissteigerung): Der Preisindex hebt das nominale BIP an, ohne reale Mehrproduktion.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Kaufkraftparitäten (PPP, KKP) berücksichtigen Preisniveauunterschiede zwischen Ländern.' },
  ] },
  { id: '5370495a-87de-4451-bc7a-2ad88427c086', fachbereich: 'VWL', musterlosung: 'Das Modell des «Market for Lemons» wurde 1970 von George Akerlof entwickelt — er erhielt 2001 dafür den Nobelpreis. Es zeigt, wie asymmetrische Information zu Negativauslese (adverse Selektion) führen kann: Käufer können gute und schlechte Autos nicht unterscheiden, zahlen nur einen mittleren Preis, die guten Anbieter ziehen sich zurück, der Markt bricht zusammen.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Akerlof: George Akerlof, Nobelpreisträger 2001, entwickelte das Lemons-Modell.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Negativauslese (adverse Selektion): Schlechte Qualität verdrängt gute, wenn Käufer nicht unterscheiden können.' },
  ] },
  { id: '5654bd97-4d12-4423-bbca-3fb192dd0eb2', fachbereich: 'VWL', musterlosung: 'In der Schweiz entfallen die Gesamtschulden (ohne Finanzsektor) zu 47% auf Haushalte — vor allem Hypotheken. 35% liegen bei Unternehmen (Firmenkredite, Anleihen), 18% beim Staat. Der Staatsanteil ist im internationalen Vergleich tief — das Schweizer Schuldenproblem liegt eher bei der hohen privaten Hypothekarverschuldung.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Haushalte halten mit 47% den grössten Schuldenanteil — hauptsächlich Wohneigentum-Hypotheken.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Unternehmen: 35% der Gesamtschulden — Firmenkredite, Anleihen, Leasing.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Staat: 18% — international tief, was die Schweizer Finanzdisziplin widerspiegelt.' },
  ] },
  { id: '5c3d52a3-b707-4ff1-a7a3-4e6bf02be050', fachbereich: 'VWL', musterlosung: 'Der Fachbegriff für den Aufkauf von Staatsanleihen durch die eigene Zentralbank lautet Monetisierung der Staatsschuld. Prinzipiell ist dies nicht unüblich (Offenmarktgeschäfte), wird aber schädlich, wenn eine zu lockere Geldpolitik mit inflationären Folgen betrieben wird. Historische Beispiele zeigen: Hyperinflationen (Weimar, Simbabwe) gehen oft mit massiver Monetisierung einher.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Monetisierung: Zentralbank finanziert Staatsschulden durch Geldschöpfung — risikoreich bei Übertreibung.' },
  ] },
  { id: '644c0abe-a3d8-4942-8a4c-8f412ec37bf6', fachbereich: 'VWL', musterlosung: 'In der Schweiz darf nur die SNB (Nationalbank) Banknoten herausgeben. Man spricht vom Banknotenmonopol des Staates. Dieses Monopol ist zentral, weil es die einheitliche Geldschöpfung und die Preisstabilität gewährleistet. Die Münzen werden ergänzend von Swissmint, dem Münzhersteller des Bundes, produziert.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'SNB (Nationalbank): Alleinige Herausgeberin der Schweizer Banknoten seit 1907.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Banknotenmonopol: Ausschliessliches Recht zur Notenausgabe — staatliche Geldhoheit.' },
  ] },
  { id: '67720f47-f6bc-4dd8-9f5c-4e7e1ece75b5', fachbereich: 'VWL', musterlosung: 'Die Steuerquote (Abgabenquote) gibt den Anteil der Steuern, Abgaben und Gebühren am BIP an — sie misst die Einnahmenseite des Staates. Die Ausgabenquote gibt den Anteil der Staatsausgaben am BIP an — sie misst die Aktivität des Staates. Beide Kennzahlen zeigen den Umfang der Staatstätigkeit und sind zentral für internationale Vergleiche.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Steuerquote (Abgabenquote): Einnahmen (Steuern plus Gebühren) in Prozent des BIP.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Ausgabenquote: Ausgaben des Staates in Prozent des BIP — misst Grösse der Staatstätigkeit.' },
  ] },
  { id: '69dca414-a423-40aa-bea6-f49f10cf5235', fachbereich: 'VWL', musterlosung: 'Die Soziallastquote misst die Sozialversicherungseinnahmen in Prozent des BIP — sie zeigt, wie stark die Volkswirtschaft durch Sozialabgaben belastet wird. Die Sozialleistungsquote misst die Sozialversicherungsleistungen in Prozent des BIP — sie zeigt, welcher Anteil der Wirtschaftsleistung an Leistungsempfänger fliesst. Beide sind seit 1960 stark gestiegen.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Soziallastquote: Einnahmen der Sozialversicherungen in Prozent des BIP.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Sozialleistungsquote: Ausgaben der Sozialversicherungen in Prozent des BIP.' },
  ] },
  { id: '6f05426b-fe10-45b3-880d-d47147cb7e16', fachbereich: 'VWL', musterlosung: 'Alle drei Geldfunktionen helfen, Transaktionskosten zu senken. Darunter versteht man alle Kosten, die bei der Abwicklung eines Tauschgeschäftes entstehen — z.B. Suche nach Tauschpartnern und Informationskosten (Recherche, Vertrag, Kontrolle). Ohne Geld wäre Arbeitsteilung kaum möglich, weil Tauschpartner mit passenden Gegenwünschen selten zusammentreffen.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Transaktionskosten: Alle Kosten der Anbahnung und Abwicklung eines Tausches — sichtbar oder versteckt.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Tauschgeschäftes (Tausches): Der Kern jeder Marktaktivität — Austausch von Leistung gegen Gegenleistung.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Informationskosten (Vertragskosten): Recherche, Verhandlung, Kontrolle — durch Geld drastisch reduziert.' },
  ] },
  { id: '7140d73c-89d0-4399-8445-44af05611441', fachbereich: 'VWL', musterlosung: 'Güter, die einander ersetzen können, heissen Substitute — Beispiel Butter und Margarine. Güter, die zusammen konsumiert werden, heissen Komplemente — Beispiel Drucker und Druckerpatronen. Bei Substituten steigt die Nachfrage nach dem einen, wenn der Preis des anderen steigt. Bei Komplementen sinkt sie.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Substitute (Substitutgüter): Ersetzbar, z.B. Butter ↔ Margarine — höhere Nachfrage bei Preisanstieg des anderen.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Komplemente (Komplementärprodukte): Gemeinsam genutzt, z.B. Drucker + Patronen — sinkende Nachfrage bei Preisanstieg des anderen.' },
  ] },
  { id: '730d064f-eea4-4ec4-b0af-88faa6c23cd9', fachbereich: 'VWL', musterlosung: 'Gemäss den Kollektivisten (Sozialisten, Marxisten) beutet der Kapitalist die Arbeiterschaft aus, indem er den sogenannten Mehrwert abschöpft — die Differenz zwischen dem Wert der erbrachten Arbeit und dem bezahlten Lohn. Marx sah darin die zentrale Ungerechtigkeit des Kapitalismus und forderte Vergesellschaftung der Produktionsmittel.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Kollektivisten (Sozialisten, Marxisten): Betonen Eigentum an den Produktionsmitteln als Quelle der Ungerechtigkeit.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Mehrwert: Differenz zwischen Arbeitswert und Lohn — aus marxistischer Sicht die Quelle des kapitalistischen Profits.' },
  ] },
  { id: '734b8394-e547-401a-add1-01a57b1b88d4', fachbereich: 'VWL', musterlosung: 'Am 6. September 2011 führte die SNB einen Mindestkurs von 1.20 Franken pro Euro ein, um die starke Frankenaufwertung zu stoppen. Der Frankenanstieg drohte in eine Rezession und Deflation zu führen. Am 15. Januar 2015 wurde der Mindestkurs überraschend wieder aufgehoben, weil seine Verteidigung zu hohe Interventionen erforderte.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Der 6. September 2011 markiert die Einführung des Mindestkurses — Reaktion auf den Safe-Haven-Rush in den Franken.' },
    { feld: 'luecken', id: 'luecke-1', text: '1.20 Franken pro Euro — die Untergrenze, die die SNB mit Devisenkäufen verteidigte.' },
  ] },
  { id: '77abc0c0-0e76-41ce-ada1-5b6488d13582', fachbereich: 'VWL', musterlosung: 'Bei indirekten Steuern fallen Ablieferer und Belasteter auseinander: Das Unternehmen ist der Steuerschuldner, der die Steuer formal an den Staat abführt, aber der Konsument trägt die wirtschaftliche Last durch höhere Preise. Bei der MWST ist das Unternehmen Ablieferer, der Konsument Belasteter — die Steuer wird «überwälzt». Die Elastizitäten bestimmen, wer welchen Anteil trägt.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Ablieferer: Formal zur Abgabe verpflichtet — bei MwSt das Unternehmen.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Belasteter (Steuersubjekt): Wirtschaftlich Getragener — bei MwSt der Endkonsument.' },
  ] },
  { id: '7b4583b9-234f-4fa2-9e0e-5aa4657c5bd3', fachbereich: 'VWL', musterlosung: 'Die explizite Staatsverschuldung umfasst die aktuell bestehenden vertraglichen Verpflichtungen (Staatsanleihen, Kredite). Die implizite Staatsverschuldung berücksichtigt zusätzlich zukünftige, nicht gedeckte Verpflichtungen wie Rentenansprüche. Die implizite Verschuldung ist oft ein Vielfaches der expliziten — allein die AHV hat einen geschätzten Fehlbetrag bis 2030 von 5 bis 11 Mrd. CHF.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Explizit: Vertraglich fixierte Schulden, meist in Form von Staatsanleihen oder Bankkrediten.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Implizit: Zukünftige Verpflichtungen ohne vertragliche Basis — z.B. AHV-Zusagen oder Pensionsansprüche.' },
  ] },
  { id: '7b9bfa9c-25ce-4dd5-92dd-7df2caf193f7', fachbereich: 'VWL', musterlosung: 'Die VWL hat vier Aufgaben: Sie beschreibt wirtschaftliche Vorgänge (Fakten sammeln), erklärt sie (Ursachen analysieren), sagt Entwicklungen voraus (Prognosen) und steuert die Wirtschaft zielgerichtet (Politikempfehlungen). Dabei sollen nicht nur kurzfristige, sondern auch langfristige Auswirkungen berücksichtigt werden.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Beschreiben: Wirtschaftliche Vorgänge systematisch erfassen — der erste Schritt der Analyse.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Erklären: Ursachen und Zusammenhänge ergründen — theoretische Basis der Volkswirtschaftslehre.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Vorhersagen (voraussagen): Entwicklungen prognostizieren — Input für Planung und Politik.' },
    { feld: 'luecken', id: 'luecke-3', text: 'Steuern: Zielgerichtet eingreifen — Handlungsempfehlungen für Wirtschaftspolitik.' },
  ] },
  { id: '80711701-6274-4ac4-a864-2c954262cbb6', fachbereich: 'VWL', musterlosung: 'Die Schweizer MwSt kennt drei Sätze: Der Normalsatz (Normalsteuersatz) beträgt 8.1% und gilt für die meisten Güter. Der reduzierte Satz von 2.6% gilt für Grundbedürfnisse wie Lebensmittel, Bücher und Medikamente. Der Spezialsatz von 3.8% gilt für Beherbergungsleistungen (Hotels). Die Differenzierung dient verteilungs- und wirtschaftspolitischen Zielen.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Normalsatz (Normalsteuersatz) 8.1%: Standardsatz für die meisten Güter und Dienstleistungen.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Reduzierter Satz (ermässigter Satz) 2.6%: Für Grundbedürfnisse wie Lebensmittel, Bücher, Medikamente.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Spezialsatz (Beherbergungssatz) 3.8%: Nur für Hotelübernachtungen — Sektorspezifisch.' },
  ] },
  { id: '8211e16b-b009-46d0-be98-8cff578d0be6', fachbereich: 'VWL', musterlosung: 'Das ökonomische Prinzip hat zwei Ausprägungen: Das Maximum-Prinzip (Ergiebigkeitsprinzip) — gegebener Aufwand führt zum maximalen Ergebnis. Und das Minimum-Prinzip (Sparsamkeitsprinzip) — gegebenes Ergebnis mit minimalem Aufwand. Zusammen bilden sie das Wirtschaftlichkeitsprinzip (Optimum-Prinzip), das Input und Output optimal aufeinander abstimmt.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Maximum-Prinzip (Ergiebigkeitsprinzip): Aus gegebenen Mitteln das Maximum herausholen.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Minimum-Prinzip (Sparsamkeitsprinzip): Ein gegebenes Ziel mit minimalem Mitteleinsatz erreichen.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Wirtschaftlichkeitsprinzip (Optimum-Prinzip): Beide Prinzipien vereint — optimale Input-Output-Relation.' },
  ] },
  { id: '83153237-4412-4bdd-bee5-04feafb41f96', fachbereich: 'VWL', musterlosung: 'Der Staat kann seine Finanzierungslücke durch den Verkauf von Wertpapieren (Staatsanleihen) am Kapitalmarkt decken oder durch Kredite (Geldschöpfung) bei der Nationalbank. Beide Finanzierungswege haben unterschiedliche Wirkungen: Kapitalmarktfinanzierung kann Zinsen treiben (Crowding-out), Zentralbankfinanzierung (Monetisierung) erhöht die Geldmenge und birgt Inflationsrisiken.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Wertpapiere (Staatsanleihen): Fremdfinanzierung am Kapitalmarkt — verzinsliche Schuldtitel.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Kredite (Geldschöpfung) bei der Zentralbank: Direkte Finanzierung mit Inflationsrisiko.' },
  ] },
  { id: '84ca7603-78d8-4fab-8565-893b61bb72de', fachbereich: 'VWL', musterlosung: 'Unter dem Produktionsfaktor Arbeit versteht man jede produktive Tätigkeit des Menschen. Boden (natürliche Ressourcen) umfasst Anbauflächen und Rohstoffe. Kapital bezeichnet Maschinen, Anlagen und Gebäude (Realkapital). Der vierte, moderne Faktor ist Wissen — Humankapital, Technologie und Innovation.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Arbeit: Menschliche Tätigkeit — physisch, geistig, schöpferisch.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Boden (natürliche Ressourcen): Grund und Boden, Rohstoffe, Energie.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Kapital: Produzierte Produktionsmittel — Maschinen, Gebäude, Werkzeuge.' },
  ] },
  { id: '87ce187f-133b-4ba9-917a-a111ba3218aa', fachbereich: 'VWL', musterlosung: 'Frühindikatoren (vorlaufende Indikatoren) verändern sich vor dem BIP und ermöglichen Prognosen — z.B. Auftragseingänge, Geschäftsklima, PMI. Spätindikatoren (nachlaufende Indikatoren) reagieren erst mit Verzögerung — z.B. Arbeitslosenquote, Steuereinnahmen. Zentralbanken und Prognostiker nutzen Frühindikatoren für aktuelle Beurteilungen der Konjunktur.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Vorlaufende Indikatoren (Frühindikatoren) signalisieren die BIP-Entwicklung im Voraus — Grundlage von Prognosen.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Nachlaufende Indikatoren (Spätindikatoren) reagieren erst verzögert — sie bestätigen Trends im Nachhinein.' },
  ] },
  { id: '88b1e4eb-8e80-413b-ba0b-4df68baf7c2a', fachbereich: 'VWL', musterlosung: 'Die AHV-Reform «AHV 21» wurde 2022 vom Stimmvolk angenommen und trat 2024 in Kraft. Eine zentrale Massnahme war die Erhöhung des Referenzalters der Frauen von 64 auf 65 Jahre und damit die Angleichung an das Männer-Referenzalter. Zusätzlich wurde ein MWST-Prozent für die AHV erhöht und ein flexibler Rentenbezug eingeführt.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: '64 Jahre war das frühere Referenzalter der Frauen — bis zum Inkrafttreten der Reform 2024.' },
    { feld: 'luecken', id: 'luecke-1', text: '65 Jahre ist seit der AHV 21 das neue Frauen-Referenzalter — gleich wie bei Männern.' },
  ] },
  { id: '8941877d-75f2-4e73-91c3-2fe53daa745e', fachbereich: 'VWL', musterlosung: 'Herrscht eine hohe Teuerung (Inflation), erhält man für gleich viel Geld mit der Zeit weniger Waren. Die Verwendung von Geld wird dann unattraktiv. Die Nationalbank muss deshalb dafür sorgen, dass nicht zu viel Geld im Wirtschaftskreislauf ist — zu viel Geld bedeutet steigende Preise, zu wenig droht Deflation.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Teuerung: Anstieg des allgemeinen Preisniveaus — Kaufkraft sinkt.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Wirtschaftskreislauf: Das Geldmengensystem der Volkswirtschaft — SNB steuert die Geldmenge.' },
  ] },
  { id: '8a1d1e20-7411-4993-b1c6-00d67b72daa9', fachbereich: 'VWL', musterlosung: 'Die Veränderung des strukturellen Defizits widerspiegelt den Impuls der aktiven Finanzpolitik — den sogenannten Fiskalimpuls. Im Gegensatz zum gesamten Defizit, das auch konjunkturbedingte Schwankungen enthält, misst er den bewussten politischen Eingriff. Ein positiver Fiskalimpuls (expansive Politik) stützt die Konjunktur, ein negativer (restriktive Politik) dämpft sie.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Strukturelles Defizit: Bereinigt um konjunkturelle Schwankungen — misst dauerhafte Ungleichgewichte.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Fiskalimpuls: Bewusster finanzpolitischer Eingriff — expansiv oder restriktiv.' },
  ] },
  { id: '8ad2cbaa-05e2-471b-aef9-50081f3da812', fachbereich: 'VWL', musterlosung: 'Das Problem, dass Personen ein öffentliches Gut nutzen, ohne dafür zu bezahlen, heisst Free-Rider-Problem (Trittbrettfahrerproblem). Es entsteht, weil niemand von der Nutzung ausgeschlossen werden kann — jeder hat einen Anreiz, andere zahlen zu lassen. Deshalb sind öffentliche Güter privatwirtschaftlich unterversorgt und bedürfen staatlicher Bereitstellung.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Free-Rider-Problem: Nutzen öffentliches Gut ohne Beitrag — Kernproblem öffentlicher Güter.' },
  ] },
  { id: '8dcd1b6a-07bb-499f-9ac8-7d90cbe6c8f1', fachbereich: 'VWL', musterlosung: 'In einer Welt mit vollständigem Wettbewerb, vollkommenen Märkten und keinem Marktversagen bräuchte es keine Staatseingriffe. Da diese Idealbedingungen nie vollständig erfüllt sind (Marktmacht, Externalitäten, Informationsasymmetrien), können Interventionen sinnvoll sein. Das Coase-Theorem zeigt jedoch, dass bei niedrigen Transaktionskosten Märkte selbst externe Effekte regeln können.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Vollständigem (perfektem) Wettbewerb: Keine Marktmacht, viele Anbieter und Nachfrager.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Vollkommenen (perfekten) Märkten: Für jedes Gut existiert ein Markt — keine fehlenden Märkte.' },
  ] },
  { id: '8f432a7b-909f-4931-b18e-f82c3c49c5dc', fachbereich: 'VWL', musterlosung: 'Die Schweizer Schuldenbremse ist in der Bundesverfassung verankert und seit 2003 in Kraft. Sie besagt, dass über einen gesamten Konjunkturzyklus hinweg Staatseinnahmen und -ausgaben ausgeglichen sein müssen. In Rezessionen sind Defizite erlaubt, in Boomphasen müssen Überschüsse erwirtschaftet werden. Das Ausgleichskonto überwacht die Einhaltung.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Schuldenbremse: Verfassungsgebundene Regel zur Haushaltsdisziplin — seit 2003 in Kraft.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Konjunkturzyklus hinweg: Über Boom- und Rezessionsphasen muss der Haushalt ausgeglichen sein.' },
  ] },
  { id: '8fcc79ea-2e54-4210-a737-b827b0948fe9', fachbereich: 'VWL', musterlosung: 'Reserven sind Guthaben, welche die Geschäftsbanken bei der Nationalbank halten müssen. Das Nationalbankgesetz schreibt vor, dass die Banken ihre kurzfristigen Verbindlichkeiten zu 2.5% mit Reserven bei der SNB hinterlegen. Diese Mindestreserven sichern die Nachfrage nach Notenbankgeld und sind ein klassisches geldpolitisches Instrument.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Reserven: Pflichtguthaben der Banken bei der SNB — absichern die Geldordnung.' },
    { feld: 'luecken', id: 'luecke-1', text: '2.5% der Verbindlichkeiten müssen als Mindestreserve gehalten werden.' },
  ] },
  { id: '94ef7c24-e05f-4143-924c-7c23d022312f', fachbereich: 'VWL', musterlosung: 'Der wichtigste Vertreter des Monetarismus ist der Ökonom Milton Friedman (1912–2006). Er lehrte an der University of Chicago und prägte die sogenannte «Chicago School». Er erhielt 1976 den Nobelpreis für Wirtschaftswissenschaften und beeinflusste die Wirtschaftspolitik in den 1980er-Jahren massgeblich — insbesondere unter Thatcher und Reagan.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Friedman: Milton Friedman, Nobelpreisträger 1976, Begründer des modernen Monetarismus.' },
    { feld: 'luecken', id: 'luecke-1', text: 'University of Chicago: Die Chicago School der Ökonomie — prägende Wirtschaftsfakultät Friedmans.' },
  ] },
  { id: '9563d0a4-7949-46f0-9be8-c6da4fbdf90f', fachbereich: 'VWL', musterlosung: 'Die Trennung von Wirtschaftswachstum und Ressourcenverbrauch heisst Decoupling. Wenn der Ressourcenverbrauch absolut sinkt, während das BIP steigt, spricht man von absoluter Entkopplung. Relatives Decoupling bedeutet nur langsameres Wachstum des Verbrauchs. Nur absolutes Decoupling ist langfristig nachhaltig — und es ist empirisch bisher selten nachgewiesen.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Decoupling: Entkopplung von Wachstum und Ressourcenverbrauch — Schlüsselbegriff der Nachhaltigkeitsdebatte.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Absolute Entkopplung: Verbrauch sinkt bei steigendem BIP — notwendige Bedingung für nachhaltiges Wachstum.' },
  ] },
]

// === Runner ===
async function main() {
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
  console.log(`Session 11b: ${updates.length} Fragen appended (${withTeile} mit Teilerklärungen, ${updates.length - withTeile} ohne).`)
  console.log(`Total verarbeitet: ${state.verarbeitet} / ${state.totalFragen}`)
}

main().catch(err => { console.error(err); process.exit(1) })
