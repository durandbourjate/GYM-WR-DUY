#!/usr/bin/env node
/**
 * Session 14: 100 VWL-Fragen (alle mc).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  { id: '570d0429-4180-4787-85b0-b102c6698dda', fachbereich: 'VWL', musterlosung: 'Absolute Armut bezeichnet die Unterschreitung des physischen Existenzminimums — Nahrung, Kleidung, Obdach sind nicht gesichert. Relative Armut misst Armut im Verhältnis zum Wohlstand der Gesellschaft, typischerweise an Schwellen wie 60 Prozent des Medianeinkommens. In der Schweiz ist vor allem relative Armut relevant.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Begriffe bezeichnen unterschiedliche Konzepte — existenzieller vs. gesellschaftsrelativer Mangel.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Existenzminimum (absolut) gegen gesellschaftliche Referenz wie Medianeinkommen (relativ).' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Beide Formen kommen in allen Ländern vor — der Fokus hängt vom Wohlstandsniveau ab.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Masseinheit (Prozent, Franken) ist nicht das Unterscheidungsmerkmal.' },
  ] },
  { id: '57d17d66-f0fd-499e-ac4f-1f47a6c810e4', fachbereich: 'VWL', musterlosung: 'Ein Gini-Koeffizient zwischen 0 (Gleichheit) und 1 (maximale Ungleichheit) misst die Einkommensverteilung. Fällt er durch Steuern und Sozialabgaben von 0.38 auf 0.29, gleicht die sekundäre Verteilung die Primäreinkommen deutlich aus. Staatliche Umverteilung reduziert also die Ungleichheit spürbar.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein sinkender Gini bedeutet weniger Ungleichheit — die Umverteilung wirkt ausgleichend.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Rückgang von 0.38 auf 0.29 zeigt deutliche Reduktion der Einkommensunterschiede.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gini von 0.38 ist nicht null — die primäre Verteilung ist klar ungleich.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: 0.29 ist im internationalen Vergleich tief — die Schweiz liegt unter dem EU-Durchschnitt.' },
  ] },
  { id: '57e4e38b-dbe1-4841-a541-1bd74012ceb0', fachbereich: 'VWL', musterlosung: 'Bildung erzeugt positive externe Effekte: Neben dem privaten Nutzen profitieren Gesellschaft, Arbeitsmarkt und Demokratie. Ohne Eingriff würde der Markt zu wenig Bildung bereitstellen. Subventionen, kostenlose Schulen oder Schulpflicht korrigieren die Unterbereitstellung und internalisieren den Zusatznutzen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Vollständige Privatisierung würde die Unterbereitstellung eher verschärfen, nicht lösen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Verbote schränken das Angebot weiter ein — falsche Richtung bei Unterbereitstellung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Subventionen und Pflicht erhöhen den Bildungskonsum und internalisieren den externen Nutzen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Steuern passen zu negativen Externalitäten — bei positiven wäre das kontraproduktiv.' },
  ] },
  { id: '57fc347b-139d-4f8b-9a0d-dd7979b1cca1', fachbereich: 'VWL', musterlosung: 'Rawls\' Differenzprinzip erlaubt Ungleichheiten, sofern sie dem am schlechtesten Gestellten nützen. Entscheidend ist, dass die unterste Position besser dasteht als bei strikter Gleichverteilung. Einkommensunterschiede sind daher zulässig. Die Abschaffung von Privateigentum hingegen ist keine Forderung Rawls\'.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Ungleichheit ist erlaubt, wenn sie allen — besonders dem Schwächsten — nützt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Maximin — der am schlechtesten Gestellte soll besser dastehen als bei Gleichverteilung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Einkommensunterschiede sind mit dem Differenzprinzip vereinbar.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Abschaffung von Privateigentum ist eine kollektivistische Forderung, nicht Rawls\'.' },
  ] },
  { id: '5870e14e-5494-4d75-9d85-c5854e5e9edf', fachbereich: 'VWL', musterlosung: 'Die Fiskalquote misst die gesamten Fiskaleinnahmen aller Staatsebenen inklusive obligatorischer Sozialversicherungsbeiträge in Prozent des BIP. Sie gibt Auskunft über die gesamte Steuer- und Abgabenlast einer Volkswirtschaft und ist international vergleichbar.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das ist die Staatsquote — sie misst Ausgaben, nicht Einnahmen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Fiskaleinnahmen aller Staatsebenen plus Sozialversicherungsbeiträge in Prozent des BIP.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Mehrwertsteueranteil ist nur ein Teil — die Fiskalquote umfasst alle Abgaben.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Schuldenquote misst Staatsschulden zum BIP — eine eigene Kennzahl.' },
  ] },
  { id: '58c07995-a602-41f0-8598-d18c8a8a58c5', fachbereich: 'VWL', musterlosung: 'Nudging — «Stupsen» — bezeichnet subtile Beeinflussung von Entscheidungen ohne Zwang oder Verbot. Beispiele sind grüne Fussabdrücke zum Mülleimer oder die Widerspruchslösung bei der Organspende. Viele Regierungen setzen eigene Nudge Units ein, um gewünschtes Verhalten kostengünstig zu fördern.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Finanzielle Belohnungen sind klassische Anreize — ein Nudge ist psychologisch subtiler.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Sanfter Stoss via Architektur der Entscheidung, ohne Verbote oder Gebote.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Verbote sind das Gegenteil eines Nudges — sie sind direkter Zwang.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Adam Smith beschrieb die unsichtbare Hand, nicht Nudging.' },
  ] },
  { id: '58c25d55-5df7-4751-94c2-06d65139a40f', fachbereich: 'VWL', musterlosung: 'Die Staatsquote zeigt, welcher Anteil des BIP durch staatliche Ausgaben fliesst. Erfasst werden Bund, Kantone, Gemeinden und öffentliche Sozialversicherungen. Sie bildet die ökonomische Bedeutung des Staates in einer Volkswirtschaft ab — im Gegensatz zur einnahmenseitigen Fiskalquote.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Steuereinnahmen ohne Sozialabgaben liefern nicht die Staatsquote.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Gesamte Staatsausgaben in Prozent des BIP.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Sozialversicherungsbeiträge sind Teil der Fiskalquote, nicht die Staatsquote allein.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das ist die Schuldenquote — Staatsschulden im Verhältnis zum BIP.' },
  ] },
  { id: '58c7e9f7-80d7-4aea-aa60-dc652e5b2792', fachbereich: 'VWL', musterlosung: 'Anreize sind zentral, weil der Homo oeconomicus seinen Entscheid laufend überprüft. Veränderte Rahmenbedingungen — Gebühren, Steuern, Löhne, Preise — verschieben das Kosten-Nutzen-Kalkül und lösen Verhaltensänderungen aus. Reaktionen fallen aber nicht bei allen Personen gleich aus.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Anreize wirken in allen Lebensbereichen — Gary Becker zeigte das ausdrücklich.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Veränderte Rahmenbedingungen lösen Verhaltensänderungen aus.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Anreize wirken oft unerwartet (Kobra-Effekt) — sie sind nicht garantiert.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Reaktionen variieren stark — dieselbe Lohnerhöhung wirkt unterschiedlich.' },
  ] },
  { id: '5935e6de-87e6-498a-aa60-93b4d6e29d42', fachbereich: 'VWL', musterlosung: 'Die vier Produktionsfaktoren sind Arbeit (körperliche und geistige Tätigkeit), Boden (natürliche Ressourcen, Rohstoffe, Energie), Kapital (Sach- und Geldkapital, Maschinen) und Wissen (Humankapital, Know-how, Patente). Sie sind die Inputs jeder Güterproduktion und begründen gemeinsam die Wertschöpfung einer Volkswirtschaft.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Arbeit, Boden, Kapital und Wissen — die vier klassischen Produktionsfaktoren.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Löhne, Zinsen, Mieten, Gewinne sind Einkommensarten der Faktoren, nicht die Faktoren selbst.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Geld und Maschinen sind Teilaspekte von Kapital bzw. Boden — kein vollständiges Schema.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: C+I+G+NX sind Verwendungskategorien des BIP, keine Produktionsfaktoren.' },
  ] },
  { id: '59d9cc68-f0c5-4554-b04c-44c605efb01f', fachbereich: 'VWL', musterlosung: 'Der Kobra-Effekt beschreibt eine paradoxe Reaktion auf Anreize: In Indien setzte die Kolonialregierung eine Prämie pro erlegter Kobra aus; Einwohner züchteten Kobras, um sie zu kassieren. Das Problem verschärfte sich. Anreize wirken zuverlässig — aber nicht immer in die gewünschte Richtung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Gerade der Misserfolg wird beschrieben, nicht die Effektivität von Anreizen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Anzahl der Anreize ist nicht das Thema — die Fehlsteuerung ist es.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Anreizsystem wirkt gegenteilig — das Problem verschlimmert sich statt zu verschwinden.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Menschen handeln hier rational im eigenen Interesse — nicht irrational.' },
  ] },
  { id: '59dd4af2-c81a-4101-b45f-3dda32e5ee1f', fachbereich: 'VWL', musterlosung: 'Steuerparadiese zeichnen sich durch sehr tiefe oder keine Steuern, mangelnde Transparenz und geringe Substanzanforderungen aus. Sie ziehen ausländisches Kapital und Gewinne an, ohne dass dort echte Wertschöpfung stattfinden müsste. Bekannte Beispiele sind Cayman Islands, Bermuda, Jersey und Panama.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Art der Steuer (direkt/indirekt) ist nicht das Kriterium.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Jeder Staat hat Ausgaben; Steuerparadiese finanzieren sich oft über Gebühren.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: «Gerecht» ist subjektiv — und Steuerparadiese stehen unter Gerechtigkeitskritik.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Tiefe Steuern und geringe Transparenz sind die definierenden Merkmale.' },
  ] },
  { id: '5a4d0e4f-3ee5-4865-ae33-abd4ee5d56ef', fachbereich: 'VWL', musterlosung: 'Das OECD-BEPS-Projekt bekämpft Gewinnverschiebung multinationaler Konzerne mit strengeren Regeln für Verrechnungspreise und Substanz. Die globale Mindeststeuer von 15 Prozent (Pillar 2) setzt eine Untergrenze und entzieht Steuerparadiesen den Anreiz. Schuldenbremse und MwSt-Erhöhung sind inländische Fiskalinstrumente ohne Bezug zu BEPS.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: BEPS zielt direkt gegen Base Erosion and Profit Shifting.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Schuldenbremse ist Fiskalpolitik im Inland — kein internationales BEPS-Instrument.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Eine globale Mindeststeuer nimmt Null-Steuer-Jurisdiktionen den Vorteil.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Mehrwertsteuer wirkt auf Inlandkonsum, nicht auf Gewinnverschiebung.' },
  ] },
  { id: '5ab0acc8-c718-4eb0-8193-55af06d34380', fachbereich: 'VWL', musterlosung: 'Die Schweiz entwickelte sich seit 1800 vom Agrarland (1. Sektor dominant) über das Industrieland (2. Sektor dominant um 1900) zur Dienstleistungsgesellschaft. Heute arbeiten über 70 Prozent der Beschäftigten im 3. Sektor. Dieser Strukturwandel ist typisch für entwickelte Volkswirtschaften.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Richtung ist umgekehrt — die Schweiz war früher Agrarland, nicht Industrieland.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Entwicklung ging zum Dienstleistungssektor hin, nicht von ihm weg.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Agrar → Industrie → Dienstleistung — typische Sektoralverschiebung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Sektoranteile haben sich fundamental verschoben — ein gewaltiger Strukturwandel.' },
  ] },
  { id: '5bc47955-3a18-45e5-bd71-12f74bcd63af', fachbereich: 'VWL', musterlosung: 'Die Recheneinheitsfunktion zeigt sich dort, wo Geld als gemeinsamer Massstab dient: beim Preisvergleich verschiedener Produkte und bei der Messung gesamtwirtschaftlicher Grössen wie dem BIP. Das Aufbewahren unter dem Kopfkissen ist Wertaufbewahrung, das Bezahlen der Restaurant-Rechnung Tauschmittel.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Preisvergleich mehrerer Smartphones nutzt CHF als gemeinsamen Massstab.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Bargeld aufbewahren ist Wertaufbewahrungsfunktion, nicht Recheneinheit.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: BIP in Franken — Geld quantifiziert die Wirtschaftsleistung als Einheit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Rechnung bezahlen ist Tauschmittelfunktion, nicht Recheneinheit.' },
  ] },
  { id: '5c416995-0f73-4304-8a3a-f05df528e19e', fachbereich: 'VWL', musterlosung: 'Beim Emissionshandel (Cap-and-Trade) setzt der Staat ein Gesamtlimit und verteilt handelbare Emissionsrechte. Unternehmen mit hohen Reduktionskosten kaufen zu, Unternehmen mit tiefen Kosten verkaufen. So erfolgt die Reduktion dort, wo sie am günstigsten ist — die Obergrenze bleibt aber fix.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Verstaatlichung ist ein regulatorischer Eingriff, kein Marktmechanismus.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Cap-and-Trade nutzt den Markt für effiziente CO₂-Reduktion.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Abschaffung von Umweltregulierung würde externe Effekte ignorieren.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Subventionen für Fossile verstärken Emissionen — das Gegenteil des Ziels.' },
  ] },
  { id: '5c8e4764-0fef-43bf-af62-ac3522f1d27c', fachbereich: 'VWL', musterlosung: 'Wachstum bezeichnet die langfristige Zunahme des realen BIP entlang eines Trends. Konjunktur bezeichnet die kurzfristigen Schwankungen um diesen Trend. Eine Volkswirtschaft kann im Trend wachsen und dennoch kurzfristig eine Rezession erleben — die beiden Ebenen werden unterschiedlich analysiert und gesteuert.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wachstum = Trend (Jahrzehnte), Konjunktur = Schwankungen (Quartale/Jahre).' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Beide betreffen die gesamte Wirtschaft — Exporte sind nur ein Teil.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Beide Konzepte gelten für alle Sektoren gleichermassen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Wachstum kann negativ sein (Rezession), Konjunktur pendelt beidseitig.' },
  ] },
  { id: '5cb31e81-da20-459d-a846-9f89167a2743', fachbereich: 'VWL', musterlosung: 'Sozialversicherungen sind obligatorisch und folgen dem Solidaritätsprinzip: Einkommensschwache zahlen kleinere Beiträge, alle sind versichert. Private Versicherungen sind freiwillig und risikobasiert — wer höhere Risiken hat oder sich die Prämien nicht leisten kann, erhält oft keinen oder nur teureren Schutz.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Leistungsniveau ist nicht das Unterscheidungskriterium — beide können gut oder schlecht sein.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Obligatorium und einkommensabhängige Beiträge kennzeichnen Sozialversicherungen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Obligatorisch sind gerade Sozialversicherungen — private sind freiwillig.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Auch Sozialversicherungen haben Sparelemente (BVG) — das ist nicht der Unterschied.' },
  ] },
  { id: '5cf39cfd-0c2a-4a45-aca7-50918d45ba23', fachbereich: 'VWL', musterlosung: 'Nach 25 Jahren ergibt 40\'000 × 1.01²⁵ rund 51\'300, während 40\'000 × 1.03²⁵ rund 83\'800 liefert. Land B hat sich somit mehr als verdoppelt, Land A deutlich weniger. Der Unterschied beträgt über 32\'000 — die Kraft des Zinseszinseffekts bei Wachstumsraten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Nur Land B verdoppelt sich; Land A legt rund 28 Prozent zu.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Land B > 80\'000 (verdoppelt), Land A ≈ 51\'300 — deutliche Divergenz.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Unterschied liegt bei über 32\'000, nicht unter 10\'000.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Land A bleibt bei tieferem Wachstum dauerhaft zurück.' },
  ] },
  { id: '5e521b10-04d3-46b3-b291-dbef2b6e0c52', fachbereich: 'VWL', musterlosung: 'Die VWL hat drei Aufgaben: Erstens Phänomene theoretisch-wissenschaftlich beschreiben und erklären. Zweitens Entwicklungen prognostizieren. Drittens wirtschaftspolitische Handlungsmöglichkeiten aufzeigen. Sie ist eine Sozialwissenschaft und liefert keine Gesetze, sondern Modelle und Kausalitätshypothesen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Preise und Löhne bestimmt der Markt, nicht die VWL als Disziplin.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Gesetze erlässt die Politik — die VWL liefert höchstens Entscheidgrundlagen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gewinnmaximierung ist ein BWL-Ziel einzelner Firmen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Beschreiben/Erklären, Prognostizieren, Beeinflussungsmöglichkeiten aufzeigen.' },
  ] },
  { id: '5e739d08-efa8-4325-a8a9-bda47d6722ee', fachbereich: 'VWL', musterlosung: 'Die Schweizer Firma verschiebt Gewinn via Lizenzzahlungen auf die Cayman Islands. Die Lizenzgebühren mindern in der Schweiz den steuerbaren Gewinn (rund 14 Prozent Gewinnsteuer), während auf Cayman Islands null Steuer anfällt. Netto sinkt die Konzern-Steuerlast erheblich. Genau das bekämpft die OECD-Mindeststeuer.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Doppelbesteuerungsabkommen und Aufwandabzug verhindern doppelte Belastung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Cayman Islands haben praktisch null Steuern — das ist ja der Grund für die Struktur.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Gewinnverschiebung senkt die Gesamtsteuerlast des Konzerns deutlich.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Lizenzgebühren sind steuerlich relevant — sie sind abzugsfähiger Aufwand.' },
  ] },
  { id: '5e757f05-c4c5-49a1-a800-edf4aff58a1c', fachbereich: 'VWL', musterlosung: 'Der vorübergehende Anstieg im Gastgewerbe nach einem exogenen Schock ist konjunkturell — er verschwindet mit der Erholung. Der dauerhafte Fachkräftemangel in der IT ist dagegen strukturell: Qualifikationen und offene Stellen passen nicht zusammen (Mismatch). Er verschwindet nicht durch Konjunkturaufschwung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Gastgewerbe konjunkturell (erholt sich), IT-Mismatch strukturell (bleibt).' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ein dauerhafter Mismatch ist nicht konjunkturell — er folgt nicht dem Zyklus.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die temporäre Erholung im Gastgewerbe spricht gegen strukturelle Ursachen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Friktionell bedeutet kurze Suchprozesse, nicht dauerhafte Unterbesetzung.' },
  ] },
  { id: '5ee6eeab-aed6-46bd-a9e0-34c20a110c83', fachbereich: 'VWL', musterlosung: 'Friktionelle Arbeitslosigkeit ist kurzfristig und Teil jedes gut funktionierenden Arbeitsmarktes — Stellenwechsel und saisonale Übergänge dauern nur Wochen bis wenige Monate. Konjunkturelle Arbeitslosigkeit hält länger an und trifft viele gleichzeitig, was die volkswirtschaftlichen Kosten stark erhöht.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Staat verursacht sie nicht; sie entsteht durch Nachfragerückgang.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Konjunkturelle AL ist gut messbar — über ALV-Statistiken und SECO-Daten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Konjunkturelle AL trifft alle Qualifikationsniveaus, nicht nur Geringqualifizierte.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Die lange Dauer und breite Betroffenheit macht sie gesellschaftlich bedrohlicher.' },
  ] },
  { id: '5ef089ef-9201-4576-815f-4a186138f3f9', fachbereich: 'VWL', musterlosung: 'Nach dem Verwendungsansatz gilt BIP = C + I + G + (X − M). C ist der private Konsum, I die Bruttoinvestitionen, G der Staatskonsum und (X − M) die Nettoexporte. In der Schweiz macht der private Konsum den grössten Anteil aus, die Nettoexporte sind traditionell positiv.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: C, I, G, X, M sind die Standard-Variablen des Verwendungsansatzes.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Diese Deutungen entsprechen nicht der üblichen Notation — Verwechslung mit Buchhaltung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: I steht für Investitionen, nicht Zinsen; G für Staatskonsum.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: I ist nicht Importe; dafür steht M. Die Variablen sind verdreht.' },
  ] },
  { id: '5f01737f-5ba6-4cfe-8eb1-c50bebd80117', fachbereich: 'VWL', musterlosung: 'Progressive Einkommenssteuern belasten höhere Einkommen stärker. Prämienverbilligungen entlasten ärmere Haushalte gezielt. Die AHV hat eine Maximalrente trotz steigender Beiträge — Reiche zahlen mehr, erhalten aber nicht mehr. Die MWST belastet alle gleich; da Ärmere einen höheren Einkommensanteil konsumieren, wirkt sie regressiv.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Progressive Tarife belasten hohe Einkommen stärker — klare Umverteilung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Prämienverbilligungen sind direkte Transfers an einkommensschwache Haushalte.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: MWST ist regressiv — sie belastet Ärmere relativ stärker.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Deckelung schafft implizite Umverteilung zugunsten tieferer Einkommen.' },
  ] },
  { id: '5f0e15d4-ab6a-4d59-b2c4-7b052037b6ff', fachbereich: 'VWL', musterlosung: 'In der Schweiz sind Bargeld (Banknoten und Münzen) sowie die Giroguthaben der Geschäftsbanken bei der SNB gesetzliche Zahlungsmittel. Nur die SNB darf sie in Umlauf bringen. Buchgeld auf normalen Bankkonten gehört zur Geldmenge, ist aber kein gesetzliches Zahlungsmittel.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Münzen gehören ebenfalls dazu, ebenso die SNB-Giroguthaben.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Bargeld plus Giroguthaben bei der SNB sind gesetzliche Zahlungsmittel.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kreditkarten sind Zahlungsmittel, aber kein gesetzliches Zahlungsmittel.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Buchgeld auf Geschäftsbankkonten ist kein gesetzliches Zahlungsmittel.' },
  ] },
  { id: '5fe44d1e-b9c7-4349-a94c-f6ae3d6869e1', fachbereich: 'VWL', musterlosung: 'Cap-and-Trade setzt eine fixe Obergrenze für Gesamtemissionen. Kauft ein Unternehmen Zertifikate, muss ein anderes entsprechend weniger emittieren — die Summe bleibt gleich. Der Einwand verkennt die Gesamtlogik: Der Markt entscheidet nur, wer reduziert, nicht wie viel reduziert wird.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Die Obergrenze (Cap) begrenzt die Gesamtmenge — Käufe sind Umverteilung, nicht Zusatz.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das System lebt gerade von unterschiedlichen Reduktionskosten — Gleichheit wäre ineffizient.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Kritik zielt auf Zertifikate selbst, nicht auf Lenkungsabgaben.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Kritik übersieht den Cap — Zertifikate abzuschaffen wäre ein Rückschritt.' },
  ] },
  { id: '617a2b02-526f-4f30-904b-64e4cc421ab7', fachbereich: 'VWL', musterlosung: 'Kritiker argumentieren, dass kontinuierliche Schuldentilgung nötige Investitionen in Infrastruktur, Bildung oder Digitalisierung verdrängt. Die Schuldenbremse erzeuge einen strukturellen Überschuss und enge den Handlungsspielraum unnötig ein. Befürworter verweisen auf die Resilienz in Krisen — etwa während der Corona-Pandemie.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Schuldenabbau wirkt eher deflationär — keine Inflationsgefahr.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Bundes-Schuldenbremse verpflichtet Kantone nicht direkt zu höheren Ausgaben.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Weniger Spielraum für Investitionen und öffentliche Leistungen — Kern der Kritik.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Schuldenbremse erlaubt Schulden in Ausnahmelagen — ein Null-Verbot existiert nicht.' },
  ] },
  { id: '6292ad1c-63a6-4b3e-b1ea-95da5754dcc8', fachbereich: 'VWL', musterlosung: 'Der Schnittpunkt von Angebots- und Nachfragekurve bildet das Marktgleichgewicht. Beim Gleichgewichtspreis P* stimmen angebotene und nachgefragte Menge Q* überein, es gibt weder Mangel noch Überschuss. Unter vollkommener Konkurrenz pendelt sich der Preis automatisch auf diesem Niveau ein.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein Höchstpreis wäre ein staatlicher Eingriff, nicht der natürliche Schnittpunkt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Gleichgewichtspreis P* und Gleichgewichtsmenge Q* — der Markt räumt sich.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Mindestlohn ist Arbeitsmarktregulierung, nicht allgemeines Marktgleichgewicht.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Break-Even-Punkt ist BWL-Konzept einer einzelnen Firma.' },
  ] },
  { id: '62ebffbe-3ed2-4d0a-aef8-e087865f937f', fachbereich: 'VWL', musterlosung: 'Der Schneeballeffekt beschreibt einen Teufelskreis der Verschuldung: Steigende Schulden führen zu höheren Zinsen und damit zu einer steigenden Zinslast. Um diese zu begleichen, werden neue Schulden aufgenommen. Die Verschuldung wächst immer schneller — besonders wenn Risikoprämien zusätzlich anspringen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Weitergabe zwischen Staatsebenen ist kein eigenständiger Mechanismus.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das wäre das Gegenteil — ein Abbau im Aufschwung, kein Schneeballeffekt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Steuervermeidung ist ein anderes Phänomen (Laffer-Kurve).' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Zinslast wächst und zwingt zu neuen Schulden — Eigendynamik der Verschuldung.' },
  ] },
  { id: '62fdc238-1e6e-4628-9e99-9af2264cd5e4', fachbereich: 'VWL', musterlosung: 'Ein strukturelles Defizit besteht unabhängig von der Konjunkturlage: Die Einnahmen decken selbst bei Normallage die Ausgaben nicht. Es lässt sich nur durch Ausgabenkürzungen oder Steuererhöhungen beseitigen. Im Gegensatz dazu verschwindet ein konjunkturelles Defizit im Aufschwung von selbst.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Rezessionsdefizite sind konjunkturell, nicht strukturell.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das beschreibt ein konjunkturelles Defizit — selbstauflösend.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Auch bei konjunktureller Normallage decken die Einnahmen die Ausgaben nicht.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Sinkende Zinsen verringern eher die Schuldenkosten — kein struktureller Treiber.' },
  ] },
  { id: '63465166-faa3-47ae-9153-dae180e5f922', fachbereich: 'VWL', musterlosung: 'Im Marktgleichgewicht stimmen angebotene und nachgefragte Menge überein. Der zugehörige Preis ist der Gleichgewichtspreis P*, die Menge die Gleichgewichtsmenge Q*. Es gibt weder Angebotsüberschuss noch Nachfrageüberschuss. Bei Preisabweichungen führen Angebots- oder Nachfragedruck zurück zum Gleichgewicht.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Staatliche Preisfestlegung überlagert das Marktgleichgewicht, definiert es aber nicht.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Gewinne spielen im Modell der vollkommenen Konkurrenz eine Rolle, aber nicht als Kriterium.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Angebotsmenge = Nachfragemenge — Kern des Marktgleichgewichts.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Nachfragekurve verläuft typischerweise fallend.' },
  ] },
  { id: '63785ab8-c84a-4d54-80b2-84767de899af', fachbereich: 'VWL', musterlosung: 'Eine gemeinsame Recheneinheit vereinfacht das Wirtschaftsleben deutlich: Statt n(n−1)/2 Tauschverhältnisse braucht man nur n absolute Preise. Preise werden direkt vergleichbar und lassen sich über die Zeit verfolgen. Gleichheit der Preise entsteht dadurch natürlich nicht — nur die Vergleichbarkeit.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: n Preise statt n(n−1)/2 Tauschverhältnisse — drastische Informationsreduktion.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Einheitliche Einheit macht Preise direkt vergleichbar.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Eine Recheneinheit gleicht keine Preise an — sie misst sie nur.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Zeitvergleiche werden möglich — Grundlage für Teuerungsmessung.' },
  ] },
  { id: '640319ee-9292-4afa-9b53-0346db306a4a', fachbereich: 'VWL', musterlosung: 'Die Schweiz ist nicht EU-Mitglied und erhebt grundsätzlich Zölle. Dank bilateraler Verträge fallen Zölle auf Importe aus der EU jedoch weitgehend weg — sie sind damit keine nennenswerte Einnahme. Gebühren, Monopolerträge (SNB-Gewinnablieferung) und privatrechtliche Erträge gehören dagegen zu den regelmässigen Einnahmen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Zölle auf EU-Importe fallen dank Freihandelsabkommen kaum an — keine Bundeseinnahme.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Museumseintritte und Ähnliches gehören zu privatrechtlichen Erträgen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die SNB-Gewinnablieferung ist eine reguläre Einnahmequelle des Bundes.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Gebühren sind eine etablierte Einnahmequelle — z.B. für Passausstellung.' },
  ] },
  { id: '65be7593-daa5-466b-bcb1-3cc96a27e8a2', fachbereich: 'VWL', musterlosung: 'Das Wachstumstrilemma bezeichnet den Zielkonflikt zwischen drei Zielen: wirtschaftliches Wachstum, ökologische Nachhaltigkeit und soziale Gerechtigkeit. Fortschritte bei einem Ziel können Rückschritte bei einem anderen verursachen. Klimapolitik, Verteilungspolitik und Wachstumspolitik lassen sich nicht gleichzeitig maximieren.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das beschreibt fiskalische Zielkonflikte, nicht das Wachstumstrilemma.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das wäre das makroökonomische Dreieck (magisches Zieldreieck), nicht das Trilemma.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Wachstum, Umwelt und Gerechtigkeit stehen in Spannung zueinander.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Export- und Binnennachfrage konkurrieren nicht grundsätzlich in einem Trilemma.' },
  ] },
  { id: '660d9764-ee88-4741-85ea-2a90cdea841c', fachbereich: 'VWL', musterlosung: 'Erwerbspersonen umfassen alle, die dem Arbeitsmarkt zur Verfügung stehen: Erwerbstätige (arbeitend) und Erwerbslose (stellensuchend). Sie bilden den Nenner der Arbeitslosenquote. Personen im Ruhestand, in Ausbildung oder ohne Arbeitsmarktbezug gehören nicht dazu.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Rentner zählen nicht zu den Erwerbspersonen, wenn sie nicht erwerbstätig sind.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Erwerbstätige plus Erwerbslose — alle mit aktuellem Arbeitsmarktbezug.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Bevölkerung umfasst auch Kinder und Nicht-Erwerbstätige.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Auch Teilzeitbeschäftigte gehören zu den Erwerbspersonen.' },
  ] },
  { id: '66c8d7a7-f0a6-4bdf-af3a-6068df29de0e', fachbereich: 'VWL', musterlosung: 'Steuerwettbewerb diszipliniert die Staatshaushalte: Kantone müssen effizient wirtschaften, um konkurrenzfähig zu bleiben. Er ermöglicht zudem die «Abstimmung mit den Füssen» (Umzug) und fördert Vielfalt in der Steuerpolitik. Die Gefahr der Unterfinanzierung öffentlicher Leistungen ist dagegen ein Argument gegen, nicht für Steuerwettbewerb.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Disziplinierung und Sparsamkeit zählen zu den klassischen Pro-Argumenten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Genau die Unterfinanzierung ist ein Hauptkritikpunkt am Steuerwettbewerb.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Tiebout-Hypothese — Bürger wählen Kantone nach Steuer-Leistungs-Bündel.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Unterschiedliche Kantonsmodelle ermöglichen Lerneffekte und Vielfalt.' },
  ] },
  { id: '674ca700-9ea3-4564-993f-d7eb37e80559', fachbereich: 'VWL', musterlosung: 'Das Minimumprinzip (Sparsamkeitsprinzip) bedeutet, ein gegebenes Ergebnis mit minimalem Aufwand zu erreichen — hier Note 5 mit zwei statt vier Lernstunden. Das Maximumprinzip wäre der umgekehrte Fall: gegebener Aufwand, maximales Ergebnis. Beide Prinzipien sind Ausprägungen des ökonomischen Prinzips.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Knappheit betrifft alle Schüler gleichermassen — erklärt den Effizienzunterschied nicht.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Maximumprinzip wäre: bei 4 Stunden die bestmögliche Note — nicht das Szenario.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Note fix, Aufwand minimiert — klassisches Minimumprinzip.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Mitschüler setzte weniger Produktionsfaktor (Zeit) ein, nicht mehr.' },
  ] },
  { id: '678128b1-7974-4476-8b26-424735804c66', fachbereich: 'VWL', musterlosung: 'Investitionsgüter dienen der Herstellung anderer Güter oder Dienstleistungen — gewerblicher Zweck ist entscheidend. Die Nähmaschine in der Schneiderei und das Kassensystem im Supermarkt sind Investitionsgüter. Die Privat-Nähmaschine und der Schüler-Laptop sind Konsum-Gebrauchsgüter, weil sie dem privaten Endverbrauch dienen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Gewerblicher Einsatz zur Produktion — klassisches Investitionsgut.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Private Nutzung im Hobby-Kontext macht es zum Gebrauchsgut.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Ermöglicht den Verkaufsprozess — gewerblicher Zweck, also Investitionsgut.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Privater Bildungskonsum — Gebrauchsgut, kein Investitionsgut.' },
  ] },
  { id: '681a38b3-ceff-4f8f-9e4b-5c563937d50d', fachbereich: 'VWL', musterlosung: 'Die Finanzkrise 2008/09 und die Corona-Krise 2020 waren so tiefe Einbrüche, dass auch marktliberale Regierungen auf keynesianische Instrumente (Konjunkturprogramme, Rettungsschirme, Kurzarbeit) zurückgriffen. Die Corona-Krise verband Angebots- und Nachfrageschock — schnelles, massives Handeln war zur Vermeidung des Kollapses nötig.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die marktliberale Grundüberzeugung wurde danach meist wieder aufgenommen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Massnahmen zielten auf Nachfragestützung — typisch keynesianisch.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Es gab enorme Programme — KAE, Rettungspakete, Bankenrettungen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: In schweren Krisen ist Keynes pragmatisch — Selbstheilung wirkt zu langsam.' },
  ] },
  { id: '68303965-000f-417f-8362-eb383e11bd3a', fachbereich: 'VWL', musterlosung: 'Das BIP misst den Wert der Endprodukte — hier 1\'500 CHF. Die Wertschöpfungen summieren sich ebenfalls zu 1\'500: Zulieferer 520, Hersteller 680 (1\'200 − 520), Händler 300 (1\'500 − 1\'200). Doppelzählungen von Vorleistungen sind ausgeschlossen — der Endpreis ist der massgebende BIP-Beitrag.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Endpreis 1\'500 = Summe der Wertschöpfungen entlang der Kette.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das wäre Doppelzählung — Vorleistungen sind bereits im Endprodukt enthalten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Händler-Wertschöpfung ist 300 (Verkaufspreis minus Einkaufspreis).' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Produktionswert ist 1\'200, die Wertschöpfung aber nur 680.' },
  ] },
  { id: '68acf9eb-6f52-4518-8f2c-f81c40c194cb', fachbereich: 'VWL', musterlosung: 'Übersteigen die Staatsausgaben (Staatsquote) die Fiskaleinnahmen (Fiskalquote), entsteht ein Haushaltsdefizit. Dieses finanziert der Staat über Neuverschuldung auf den Kapitalmärkten. Umgekehrt weist ein Staat einen Überschuss aus, wenn die Fiskalquote höher ist als die Staatsquote.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Höhere Einnahmen würden zu einem Überschuss führen, nicht zu höheren Ausgaben.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Staatsquote ist nominal/real nicht direkt inflationsbereinigt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gebühren sind Teil der Fiskaleinnahmen im weiten Sinn.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Fehlbetrag wird über Kredite finanziert — klassische Defizitfinanzierung.' },
  ] },
  { id: '68d61e89-52f9-49bf-941f-8ec981cbefa8', fachbereich: 'VWL', musterlosung: 'In einer Tauschwirtschaft gibt es kein allgemein akzeptiertes Zahlungsmittel. Güter und Dienstleistungen werden direkt gegeneinander getauscht — Schuhe gegen Brot, Reparaturarbeit gegen Gemüse. Man spricht von Naturaltausch oder Barterhandel. Die doppelte Koinzidenz der Wünsche erschwert den Handel massiv.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Tauschwirtschaft ist nicht geschenkebasiert — Leistung und Gegenleistung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Gold wäre bereits Warengeld, nicht reiner Tausch.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Ware gegen Ware — Naturaltausch ohne Zahlungsmittel.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Staatliche Preisfestlegung beschreibt eine Planwirtschaft.' },
  ] },
  { id: '68fa291a-6e86-4e34-87fc-ac70ff9789ab', fachbereich: 'VWL', musterlosung: 'Konjunkturelle Defizite entstehen in Rezessionen: Steuereinnahmen sinken, Sozialausgaben steigen. Sie verschwinden im Aufschwung wieder und wirken als automatische Stabilisatoren. Im Gegensatz zu strukturellen Defiziten sind sie kein Signal für Konsolidierungsbedarf, sondern Teil einer gesunden antizyklischen Wirkung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Konjunkturbedingt vorübergehend — tieferes Einkommen, höhere Ausgaben.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Zinszahlungen verursachen Schulden, keinen konjunkturellen Charakter.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Dauerhaftigkeit definiert das strukturelle Defizit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Fehlinvestitionen sind ein spezifischeres Problem — nicht konjunkturdefinierend.' },
  ] },
  { id: '6a294555-0d6d-4dc1-bf2c-54971e6a1b48', fachbereich: 'VWL', musterlosung: 'Hohe Stundenlöhne erhöhen die Opportunitätskosten der Freizeit (Substitutionseffekt — mehr Arbeitsanreiz). Gleichzeitig ermöglicht hoher Lohn, mit weniger Arbeitsstunden den gewünschten Lebensstandard zu erreichen (Einkommenseffekt — mehr Freizeitnachfrage). In der Schweiz überwiegt oft der Einkommenseffekt, besonders bei Familien.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Motivation erklärt keine Teilzeitquote — es ist eine ökonomische Abwägung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Opportunitätskosten sind zentral — Substitutions- vs. Einkommenseffekt erklären das Muster.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Hoher Lohn macht Freizeit teuer, ermöglicht aber zugleich weniger Arbeitsstunden.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Teilzeit ist in der Schweiz freiwillig, nicht staatlich verordnet.' },
  ] },
  { id: '6a4e04b5-5c4f-4867-bab9-45e0c7ac3f68', fachbereich: 'VWL', musterlosung: 'Konjunkturindikatoren sind wirtschaftliche Kennzahlen, die den aktuellen Stand der Konjunktur zeigen oder ihre weitere Entwicklung andeuten. Man unterscheidet Früh-, Präsenz- und Spätindikatoren. Beispiele sind der KOF-Konjunkturbarometer, die Industrieaufträge und die Arbeitslosenquote.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das sind geldpolitische Instrumente (Leitzins, Devisenmarkt), keine Indikatoren.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Konjunkturpolitik ist etwas anderes als die Indikatoren, die sie auslösen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Kennzahlen, die Aktivitätsniveau oder zukünftige Richtung anzeigen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Gesetze regulieren, Indikatoren messen — unterschiedliche Ebenen.' },
  ] },
  { id: '6a626480-f19d-4b6a-87cb-ff952bb0d8a3', fachbereich: 'VWL', musterlosung: 'Investitionen erhöhen den Kapitalstock und die Kapitalintensität pro Arbeitnehmer. Das steigert die Produktivität und damit das langfristige Wachstumspotenzial. Länder mit hoher Investitionsquote (z.B. China rund 44 Prozent) wachsen schneller als Länder mit niedriger Quote (USA rund 16 Prozent).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Mehr Kapital pro Arbeiter — höhere Produktivität und Wachstum.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Vollbeschäftigung hängt von Konjunktur und Arbeitsmarkt ab, nicht nur von Investitionen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Investitionen sind in den VGR Teil des BIP, keine Konsum-Substitution.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Handel wird durch Öffnungsabkommen geregelt, nicht durch Investitionsquoten.' },
  ] },
  { id: '6b95ce13-652a-4182-b0f1-451e80ecc698', fachbereich: 'VWL', musterlosung: 'Der Finanzausgleich sorgt in der Schweiz dafür, dass auch finanzschwache Kantone ihre Aufgaben erfüllen können. Finanzstarke Kantone (Zürich, Genf) zahlen ein, finanzschwache (Uri, Jura) erhalten Beiträge. Der Bund ergänzt den horizontalen Ausgleich durch eigene Beiträge — NFA 2008.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Ausgleich finanzieller Unterschiede zwischen Kantonen — Kernfunktion der NFA.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das wäre die Bundes-Rechnung, nicht der Finanzausgleich.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: SNB-Verteilung ist separat geregelt — Finanzausgleich greift auf Steuerkraft zu.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Kantone behalten Steuerautonomie — keine Steuersatz-Harmonisierung.' },
  ] },
  { id: '6bfd46ae-7049-4b57-b2b3-2a4094985f21', fachbereich: 'VWL', musterlosung: 'Nach Keynes sind Löhne zugleich Kosten (für Firmen) und Einkommen (für Haushalte). Sinken die Löhne breit, fällt die Konsumnachfrage. Ohne Kompensation durch Exporte oder Staatsnachfrage kann eine Rezession entstehen. Der klassische Anpassungsmechanismus (tiefere Löhne → mehr Beschäftigung) funktioniert so nicht.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Lohnsenkung hat keinen direkten Produktivitätseffekt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Streiks sind politisch-sozial, die keynesianische Kritik ist ökonomisch.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das wäre das klassische Gegenargument — Keynes bestreitet genau diese Wirkung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Tiefere Löhne reduzieren Kaufkraft und damit Nachfrage — Rezession verstärkt sich.' },
  ] },
  { id: '6cba1109-affd-4ec7-984c-43eae0503dcb', fachbereich: 'VWL', musterlosung: 'Lohnrigidität bedeutet, dass Löhne in der Praxis nur sehr schwer gesenkt werden können. Gesamtarbeitsverträge, Mindestlöhne, soziale Normen und der Motivationsverlust bei Arbeitnehmern verhindern Lohnsenkungen. Darum reagiert der Arbeitsmarkt auf Nachfrageeinbrüche mit Entlassungen statt mit Lohnsenkungen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Rechtlich sind Lohnsenkungen in vielen Konstellationen zulässig — praktisch aber selten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: GAV, Mindestlöhne und soziale Normen verhindern Lohnsenkungen in der Praxis.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Löhne steigen und fallen mit Wirtschaftslage, aber asymmetrisch.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Löhne steigen in der Praxis regelmässig — Starrheit gilt primär nach unten.' },
  ] },
  { id: '6cc2f419-a59f-4d56-8490-96333fe06a73', fachbereich: 'VWL', musterlosung: 'Eine Rentenaltererhöhung wirkt doppelt: Betroffene zahlen länger Beiträge ein und beziehen kürzer Rente. Eine reine Beitragserhöhung hingegen wirkt nur auf der Einnahmenseite. Finanziell ist die Rentenalter-Erhöhung oft wirkungsvoller, sozial aber auch schwerer durchsetzbar.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Doppelte Wirkung — längere Einzahldauer und kürzere Bezugsdauer.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Wirkung auf die AHV-Finanzen ist nicht identisch.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Rentenalter-Erhöhung wirkt nachhaltiger, auch wenn sie später einsetzt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Sie wirkt klar auf die AHV-Finanzen — sogar doppelt.' },
  ] },
  { id: '6e6f5730-825a-4198-837e-caa13910974b', fachbereich: 'VWL', musterlosung: 'Adam Smith (1723–1790) formulierte in «Der Wohlstand der Nationen» (1776) das Bild des eigennützigen, rational handelnden Wirtschaftsmenschen. Später präzisierte John Stuart Mill die Idee, Herbert Simon ergänzte die begrenzte Rationalität, und Gary Becker erweiterte das Modell auf nicht-ökonomische Lebensbereiche.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Mill entwickelte Smiths Idee weiter, formulierte sie aber nicht zuerst.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Adam Smith (1776) gilt als Urheber des Konzepts.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Becker wandte die Idee auf neue Bereiche an, erfand sie aber nicht.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Simon kritisierte die Rationalitätsannahme — lange nach Smith.' },
  ] },
  { id: '6e776590-6c2b-4fa9-be14-a79893c6ddd2', fachbereich: 'VWL', musterlosung: 'Das Patent-Paradox beschreibt einen Zielkonflikt: Vor der Erfindung wirkt das Patent als Innovationsanreiz (Monopolgewinn belohnt Forschungsaufwand). Nach der Erfindung entsteht Ineffizienz, weil der Patentinhaber Monopolpreise verlangen kann, der Zugang für andere eingeschränkt wird und Folgeinnovationen ausgebremst werden.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Patente sind nicht durchweg schlecht — sie haben auch positive Effekte.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ohne Patente würden weniger riskante Forschungsinvestitionen getätigt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Anreiz ex ante, Ineffizienz ex post — der Kern des Patent-Paradoxes.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Patente gelten branchenübergreifend — Pharma, Technik, Landwirtschaft u.a.' },
  ] },
  { id: '6f648c9f-7b99-4ad5-bd76-294d308a1892', fachbereich: 'VWL', musterlosung: 'Staatsversagen liegt vor, wenn staatliche Eingriffe zu ineffizienten oder kontraproduktiven Ergebnissen führen. Subventionen für Kohlekraftwerke verstärken negative Externalitäten, statt sie zu internalisieren. Meist steuern politische Interessen (Arbeitsplätze, Lobby) die Politik, nicht die ökonomische Effizienz.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Monopolpreise sind klassisches Marktversagen, kein Staatsversagen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Politisch motivierte Subventionen verzögern den Übergang — typisches Staatsversagen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Umweltverschmutzung ist negative Externalität — Marktversagen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Ein einzelner Kauf ist kein volkswirtschaftliches Versagen.' },
  ] },
  { id: '71fecebf-7e17-4174-aac2-334d89942ca6', fachbereich: 'VWL', musterlosung: 'Monetaristen werfen keynesianischen Konjunkturprogrammen drei Hauptprobleme vor: Time lags (Wirkung kommt verspätet), Crowding-out (Staat verdrängt private Investitionen) und politische Irreversibilität (einmal eingeführte Programme werden selten abgebaut). Geldpolitik sehen sie hingegen als wirksam — bei stabiler Geldmengenregel.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Konjunkturprogramme greifen oft erst nach Überwindung der Krise.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Staatliche Kredit- und Ausgabentätigkeit verdrängt private Nachfrage am Kapitalmarkt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Monetaristen halten Geldpolitik gerade für das wirksamste Instrument.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Ausgabenprogramme bauen sich politisch kaum zurück — Sperrklinken-Effekt.' },
  ] },
  { id: '72943a59-4507-4397-8a88-3bf8c35c4b77', fachbereich: 'VWL', musterlosung: 'Der ökologische Fussabdruck misst, wie viel produktives Gebiet nötig ist, um den Konsum einer Bevölkerung zu ermöglichen und deren Abfall und Emissionen zu absorbieren. Die Schweiz hat rund 5 Hektaren pro Person. Lebten alle Menschen wie die Schweizer, bräuchte es rund 2.8 Planeten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: CO₂-Emissionen sind Teil, aber nicht das Ganze des Fussabdrucks.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Biodiversität ist eine eigene Kennzahl — nicht der Fussabdruck.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Wasser ist ein Teilaspekt (Wasser-Fussabdruck), nicht die Gesamtgrösse.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Flächenbedarf für Produktion und Abfallentsorgung — Kern der Definition.' },
  ] },
  { id: '732f3227-a7c6-4f12-bb73-9540f1bcc572', fachbereich: 'VWL', musterlosung: 'Die Hauptkritik an der praktischen Anwendung der keynesianischen Politik: Regierungen geben in Rezessionen mehr aus, sparen aber in Hochkonjunkturen nicht entsprechend (Defizitbias). Zudem greifen Programme zu spät (time lags), sind schwer dosierbar und folgen politischen statt ökonomischen Motiven.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Keynes forderte aktive Fiskalpolitik — nicht ihren Verzicht.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Multiplikatoreffekte wirken empirisch, auch wenn ihre Grösse umstritten ist.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Defizitbias, time lags und politische Motive sind die Hauptpraxiskritik.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Theorie gilt für Volkswirtschaften beliebiger Grösse.' },
  ] },
  { id: '735fdb14-b89b-4088-aa73-13e88057fdee', fachbereich: 'VWL', musterlosung: 'Nicht-Kooperation ist die dominante Strategie: Unabhängig vom Verhalten des anderen bringt Nicht-Kooperation mehr (5 > 3 bzw. 1 > 0). Rationale Akteure wählen daher beide Nicht-Kooperation und erhalten je einen Punkt — obwohl gegenseitige Kooperation je drei Punkte gebracht hätte. Das Nash-Gleichgewicht ist individuell rational, kollektiv ineffizient.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Kooperation ist kollektiv optimal, aber individuell nicht stabil — jeder hätte Defektionsanreiz.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Beide defektieren — Nash-Gleichgewicht, aber Pareto-ineffizient.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Spieltheorie gibt eine klare Vorhersage — Nicht-Kooperation.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das einseitige Ergebnis ist kein stabiles Gleichgewicht bei symmetrischer Matrix.' },
  ] },
  { id: '738a4b83-947a-4e04-a89f-b4377ea03052', fachbereich: 'VWL', musterlosung: 'Die negative Einkommenssteuer verbindet Sozial- und Steuersystem. Tiefe Einkommen erhalten Transferzahlungen (negative Steuer), die mit steigendem Einkommen abnehmen. Ab einem Schwellenwert beginnt der reguläre Steuertarif. Weil die Transfers nie ganz wegfallen, bleibt der Arbeitsanreiz erhalten — die Armutsfalle wird vermieden.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Verluste betreffen Unternehmen, nicht Haushalte — falsches Konzept.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das beschreibt keine BIP-Kopplung — die negative Steuer ist einkommensbezogen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Transfers an Einkommensschwache statt Besteuerung — Kern des Konzepts.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Einkommenssteuer bleibt bestehen, nur zusätzlich um einen negativen Bereich erweitert.' },
  ] },
  { id: '738e1638-fb25-4a97-aa20-65a8e3423f54', fachbereich: 'VWL', musterlosung: 'Die Nachfragekurve zeigt, welche Menge eines Gutes Konsumenten bei verschiedenen Preisen zu kaufen bereit sind. Sie verläuft typischerweise fallend: Je höher der Preis, desto geringer die Menge (Gesetz der Nachfrage). Ihre Lage hängt von Einkommen, Präferenzen und Preisen verwandter Güter ab.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Menge bei gegebenen Preisen — Kaufbereitschaft der Konsumenten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das beschreibt die Angebotskurve.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gewinn pro Menge ist ein BWL-Konzept, nicht die Nachfragekurve.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Produktionskapazität einer Volkswirtschaft ist das Produktionspotenzial.' },
  ] },
  { id: '7492cb73-e985-44ab-9175-4ff0ed68ff73', fachbereich: 'VWL', musterlosung: 'Die ökonomische Steuerlast hängt von den Elastizitäten ab, nicht von der gesetzlichen Aufteilung. Da die Arbeitsnachfrage meist elastischer ist als das Arbeitsangebot, überwälzen Arbeitgeber einen Teil der Beiträge auf die Löhne — die Arbeitnehmer tragen ökonomisch meist den grösseren Teil. Die 50:50-Aufteilung ist nur formal.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Immer Arbeitnehmer — diese Pauschale ignoriert Elastizitäten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die rechtliche Aufteilung sagt nichts über die ökonomische Last.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Arbeitgeber tragen ökonomisch meist weniger — Elastizitäten spielen eine Rolle.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Die Verteilung hängt von Angebots- und Nachfrageelastizität ab.' },
  ] },
  { id: '74c55b4c-d7dc-4085-b5ce-1b411143dee5', fachbereich: 'VWL', musterlosung: 'Die Fiskalquote misst nur den Anteil der Abgaben am BIP — sie sagt nichts über das absolute Einkommensniveau oder den Wohlstand aus. Ein Land kann reich sein und eine tiefe Fiskalquote haben (wie die Schweiz) oder arm sein und eine hohe Fiskalquote. Wohlstand und Staatsquote sind verschiedene Dimensionen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Die Fiskalquote sagt nichts über das absolute Einkommensniveau aus — nicht ableitbar.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Höhere Fiskalquote korreliert typischerweise mit umfassenderer Sozialpolitik.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Eine höhere Fiskalquote bedeutet relativ höhere Steuern — das ist direkt ableitbar.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Höhere Staats- und Fiskalquoten zeigen grössere Staatsrolle in der Wirtschaft.' },
  ] },
  { id: '7623b961-f88b-4c52-a92c-fcea9148e305', fachbereich: 'VWL', musterlosung: 'Ein Gesamtarbeitsvertrag (GAV) wird kollektiv zwischen Sozialpartnern ausgehandelt — Gewerkschaften und Arbeitgeberverbänden. Er regelt Mindestlöhne, Arbeitszeit, Ferien, Kündigungsfristen und weitere Bedingungen. Während der Laufzeit gilt eine Friedenspflicht (kein Arbeitskampf). GAV können allgemeinverbindlich erklärt werden.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: GAV sind zwischen Gewerkschaft und Arbeitgeberverband, nicht zwischen Gewerkschaften.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Kollektiver Vertrag zwischen Sozialpartnern mit Lohn- und Arbeitszeitregeln.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: GAV ist ein privatrechtlicher Vertrag, kein staatliches Gesetz.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Individuelle Arbeitsverträge sind Einzelverträge — GAV ist kollektiv.' },
  ] },
  { id: '7682b5f5-976c-4d5b-8566-b247ca2e7e5d', fachbereich: 'VWL', musterlosung: 'Die Grosse Depression widerlegte die klassische Annahme: Trotz fallender Preise und Löhne kehrte die US-Wirtschaft nicht zum Gleichgewicht zurück, die Arbeitslosigkeit lag über 25 Prozent und blieb jahrelang hoch. Keynes leitete daraus die Notwendigkeit aktiver Fiskalpolitik ab — die Grundlage seiner neuen Theorie.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Depression war deflationär — Preise fielen, nicht stiegen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der New Deal kam erst nach dem Ausbruch — Ursache war der Börsenkrach 1929.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Deflation prägte die 30er-Jahre, nicht Inflation.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Lange hohe Arbeitslosigkeit trotz fallender Löhne widersprach der klassischen Theorie.' },
  ] },
  { id: '76aa36c0-2491-4dba-bd4d-40600d9d6129', fachbereich: 'VWL', musterlosung: 'Ehrenamtliche Arbeit hat keinen Marktpreis und wird im BIP nicht erfasst. Umweltschäden werden nicht als Kosten vom BIP abgezogen. Kostenlose digitale Dienste schaffen Nutzen ohne Marktpreis. Die Medikamentenproduktion durch Novartis hingegen wird mit Marktpreisen korrekt erfasst.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Freiwilligenarbeit ist unbezahlt — erscheint nicht im BIP.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Novartis-Umsätze sind Marktumsätze — Bestandteil des BIP.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Umweltschäden sind externer Effekt — BIP behandelt sie nicht als Kosten.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Kostenlose Apps generieren Nutzen ohne Marktpreis — BIP erfasst sie nicht.' },
  ] },
  { id: '77381288-8951-4a59-b76a-1f6d53bc3424', fachbereich: 'VWL', musterlosung: 'Fischbestände in internationalen Gewässern sind ein klassisches Allmendegut: rival im Konsum (gefangene Fische fehlen anderen), aber nicht ausschliessbar (keine Eigentumsrechte auf hoher See). Jeder Staat hat den Anreiz, möglichst viel zu fischen — das führt zur Übernutzung und Dezimierung der Bestände.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Immobilienpreise sind Markt- und Regulierungsthemen — kein Allmendegut.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Gesundheitskosten hängen von Versicherungssystem und Alter ab, nicht von Allmende.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Smartphone-Innovationen sind private Güter mit Ausschluss.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Rival und nicht ausschliessbar — Lehrbuchbeispiel für die Tragödie der Allmende.' },
  ] },
  { id: '77fcc917-e41f-45bc-a593-3777fae729bf', fachbereich: 'VWL', musterlosung: 'Freie Güter sind von der Natur in ausreichender Menge vorhanden und daher gratis verfügbar — etwa Luft oder Sonnenlicht. Wirtschaftliche Güter sind knapp im Verhältnis zu den Bedürfnissen. Deshalb werden sie nachgefragt und haben einen Preis. In der modernen VWL gibt es nur wenige echte freie Güter.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Unterschied liegt in Knappheit und Preis — das ist ein klares Kriterium.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Freie Güter sind meist natürliche Ressourcen, nicht Dienstleistungen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Natürlich verfügbar und gratis vs. knapp und mit Preis.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Staatliche Bereitstellung betrifft öffentliche Güter, nicht freie Güter.' },
  ] },
  { id: '78ae0470-e6ef-4558-8815-75f6917723cf', fachbereich: 'VWL', musterlosung: 'Paritätisch heisst «zu gleichen Teilen». Bei der AHV zahlen Arbeitgeber und Arbeitnehmer je 4.35 Prozent des Bruttolohns — zusammen 8.7 Prozent. Dieses Prinzip gilt auch für die zweite Säule (BVG) und die ALV. Die Parität unterscheidet die Beitragsfinanzierung von steuerfinanzierten Leistungen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Arbeitgeber und Arbeitnehmer tragen je die Hälfte — Grundidee der Parität.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Bund-Kantone-Verteilung ist ein anderes Konzept (föderaler Finanzausgleich).' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Dynamik der Beiträge ist separat von der Paritätsfrage.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bei AHV zahlen Höhere Einkommen mehr — nicht alle gleich viel.' },
  ] },
  { id: '78c222af-c50f-49ad-bbf8-fda5e3edf90e', fachbereich: 'VWL', musterlosung: 'Die VWL betrachtet die Volkswirtschaft als Ganzes — Haushalte, Unternehmen, Staat und Ausland. Sie analysiert Themen wie Arbeitslosigkeit, Inflation, Wachstum. Die BWL hingegen betrachtet das einzelne Unternehmen und dessen interne Prozesse — Marketing, Buchführung, Organisation. Beide sind Teildisziplinen der Wirtschaftswissenschaften.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Auch private Akteure sind Teil der VWL — sie ist umfassender.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Makro- vs. Mikro-Perspektive — gesamtwirtschaftlich vs. einzelbetrieblich.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Beide behandeln Geld und Güter — das ist kein Abgrenzungskriterium.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Unterschied ist fundamental — Perspektive und Analyseebene.' },
  ] },
  { id: '78d33401-18b1-482d-b964-46bacd768b8f', fachbereich: 'VWL', musterlosung: 'Nach dem Ertragsgesetz sinkt der Grenzertrag bei zunehmender Produktion, wenn die übrigen Faktoren konstant bleiben. Jede weitere Einheit verursacht höhere Grenzkosten. Produzenten bieten deshalb nur bei höheren Preisen mehr an — die Angebotskurve verläuft steigend. Kurzfristig dominieren variable Faktorkosten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Konsumentenverhalten erklärt die Nachfrage, nicht die Angebotskurve.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Steigende Grenzkosten zwingen zu höheren Preisen für höhere Mengen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Fixkosten pro Stück sinken zwar, aber die Grenzkosten steigen am Ende.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Subventionen sind Ausnahme, nicht Grundlage der steigenden Angebotskurve.' },
  ] },
  { id: '79c5cc22-bae6-4899-91b4-8f0940fa15bd', fachbereich: 'VWL', musterlosung: 'Kostenlose digitale Dienste wie Suchmaschinen oder soziale Medien generieren grossen Nutzen, erscheinen aber kaum im BIP. Zudem lässt sich die Wertschöpfung digitaler Plattformen geografisch schwer zuordnen. Das BIP unterschätzt damit die tatsächliche Wohlfahrt der digitalen Wirtschaft.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Günstige Preise sind kein Messproblem — kostenlos aber schon.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Digitalisierung hat erheblichen BIP-Einfluss — nur unvollständig gemessen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Fehlende Marktpreise machen digitale Nutzenstiftung für das BIP unsichtbar.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Doppelzählung ist durch Wertschöpfungsrechnung ausgeschlossen.' },
  ] },
  { id: '7b06cf62-8d6d-4579-b63c-3d7355ca2047', fachbereich: 'VWL', musterlosung: 'Die Plastiktüten-Steuer verteuert deren Konsum und senkt die Nutzung — das ist der Lenkungszweck. Gleichzeitig fliessen die Einnahmen in den Umweltschutz — das ist der Fiskalzweck (mit Zweckbindung). Ein Umverteilungszweck (Reich zu Arm) liegt bei dieser konsumbezogenen Steuer nicht vor.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Verteuerung wirkt lenkend — nicht nur Fiskalzweck.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Umverteilung zielt auf Einkommen, nicht auf Konsumgüter.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Einnahmen (Fiskal) plus Verhaltenssteuerung (Lenkung) kombiniert.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Steuer ist nicht primär umverteilungsmotiviert.' },
  ] },
  { id: '7b06e640-97bb-4e06-8de9-513a4f776f37', fachbereich: 'VWL', musterlosung: 'Die Konsumentenrente ist die Differenz zwischen maximaler Zahlungsbereitschaft und tatsächlich bezahltem Marktpreis. Grafisch entspricht sie der Fläche zwischen Nachfragekurve und Gleichgewichtspreis. Sie misst den Wohlfahrtsgewinn der Käufer und ist Teil der gesamten Wohlfahrt zusammen mit der Produzentenrente.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Zahlungsbereitschaft minus Preis — Vorteil der Käufer.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das ist die Produzentenrente aus Sicht der Anbieter.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Differenz der Kurven definiert keine einzelne Rente, sondern die Gesamtwohlfahrt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Steuereinnahmen sind separater Bereich — kein Teil der Konsumentenrente.' },
  ] },
  { id: '7be464d8-5282-4607-ae80-a0fec91f9799', fachbereich: 'VWL', musterlosung: 'Konjunktur bezeichnet die kurzfristigen Schwankungen der gesamtwirtschaftlichen Aktivität (reales BIP) um den langfristigen Wachstumstrend (Produktionspotenzial). Sie zeigt sich in den Phasen Aufschwung, Boom, Abschwung und Rezession. Konjunktur ist damit die kurzfristige Schwester des Wachstums.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Langfristige Zunahme ist Wachstum, nicht Konjunktur.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Kurzfristige Schwankungen um den Trend — Kern der Konjunktur.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Verteilungsfragen sind Thema der Sozialpolitik, nicht der Konjunktur.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Demografie ist eine Strukturgrösse, nicht Konjunktur.' },
  ] },
  { id: '7bf8139d-75cc-483a-a420-8c58283d135c', fachbereich: 'VWL', musterlosung: 'Reale Schocks sind unerwartete Ereignisse, die Angebot oder Nachfrage plötzlich und stark verändern — etwa die Ölkrise 1973, Naturkatastrophen oder die Corona-Pandemie 2020. Sie gelten als eine Hauptursache von Konjunkturschwankungen neben monetären und psychologischen Impulsen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Reale Schocks sind exogene Ereignisse mit starker Konjunkturwirkung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Monetäre Impulse kommen von der Geldpolitik, nicht von Pandemien.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Strukturelle Anpassungen sind langfristig — keine plötzlichen Schocks.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Normalschwankungen sind zyklisch und erwartbar — Schocks sind unerwartet.' },
  ] },
  { id: '7c702ec1-2df0-42a9-9709-7f429fca712e', fachbereich: 'VWL', musterlosung: 'Der primäre Sektor sinkt seit 1800 kontinuierlich von über 50 Prozent auf rund 3 Prozent. Der sekundäre Sektor steigt im 19. Jh. an, erreicht um 1960 seinen Höhepunkt und sinkt dann. Der tertiäre Sektor wächst stetig und dominiert heute mit über 70 Prozent der Beschäftigten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: B mit dem typischen Glockenverlauf ist der sekundäre Sektor, nicht der tertiäre.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Primärsektor fällt, Sekundärsektor steigt und fällt, Tertiärsektor steigt — klassisches Muster.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: A als sinkende Kurve ist der primäre Sektor, nicht der tertiäre.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der primäre Sektor war nie eine steigende Kurve — er fällt langfristig.' },
  ] },
  { id: '7c83e8ee-fdd1-401f-a5b0-2d7796bbaf1c', fachbereich: 'VWL', musterlosung: 'Gary Becker (Nobelpreis 1992) wandte das Kosten-Nutzen-Kalkül auf nicht-traditionelle Felder an: Kriminalität (Räuber wägen Beute gegen Strafrisiko), Diskriminierung, Humankapital (Bildung als Investition) und Familienökonomie (Heirat, Kinderzahl). Er zeigte, dass ökonomische Prinzipien weit über die Wirtschaft hinaus gelten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Aktienmarkt und Banken sind klassische Finanzökonomie — nicht Beckers Neubeitrag.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Aussenhandel war schon vor Becker ein Standardfeld.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Becker blieb innerhalb der Sozialwissenschaften — Physik nicht relevant.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Diskriminierung, Kriminalität, Humankapital, Familie — Beckers Kernthemen.' },
  ] },
  { id: '7cd24ddd-fa3a-493b-9a60-6ad9256c0c69', fachbereich: 'VWL', musterlosung: 'Alle drei BIP-Ansätze ergeben 500: Produktion (Wertschöpfung) = 500, Einkommen = 300 + 200 = 500, Verwendung = C(400) + I(100) + G(100) + NX(0 − 100) = 500. Importe werden abgezogen, weil sie im Inland konsumiert, aber nicht produziert wurden. Die Kreislaufrechnung schliesst.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Löhne plus Gewinne ergeben 500 — nicht 600.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Importe werden im Verwendungsansatz abgezogen — sie erhöhen das BIP nicht.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Alle drei Ansätze liefern denselben Wert — 500.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Produktion, Einkommen, Verwendung ergeben jeweils 500 — Kreislauf schliesst.' },
  ] },
  { id: '7ce524eb-bae5-471f-96cd-5eeb8db71452', fachbereich: 'VWL', musterlosung: 'Der Nominallohn ist der tatsächlich ausgezahlte Geldbetrag (Lohnausweis). Der Reallohn berücksichtigt die Kaufkraft — er ist um die Teuerung bereinigt. Bei Inflation kann der Nominallohn steigen, während der Reallohn stagniert oder sinkt. Für die ökonomische Wohlfahrt ist der Reallohn entscheidend.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Reallohn kann bei hoher Inflation unter dem Nominallohn liegen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Umgekehrt — der Reallohn ist der um Teuerung bereinigte Lohn.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Nominallohn nominal, Reallohn inflationsbereinigt — massgebend für Kaufkraft.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Unterschied ist inhaltlich bedeutsam — Teuerung macht ihn sichtbar.' },
  ] },
  { id: '7da9fd29-b4c6-424b-be71-936aab992bd6', fachbereich: 'VWL', musterlosung: 'Die Tragödie der Allmende lässt sich auf drei Wegen vermeiden: (1) Privatisierung mit klaren Eigentumsrechten, (2) staatliche Regulierung mittels Quoten oder Nutzungsbeschränkungen und (3) Selbstorganisation gemäss Elinor Ostrom, bei der lokale Gemeinschaften eigene Regeln aushandeln und überwachen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Eigentumsrechte geben Anreize zur nachhaltigen Nutzung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Quoten und Lizenzen begrenzen die Gesamtnutzung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Ostroms Lösung — gemeinschaftliches Management mit Sanktionen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Monopolpreise lösen das Allmendeproblem nicht — sie verschärfen es sogar.' },
  ] },
  { id: '7e07263e-e2e2-4837-b1b0-f9c7b9f6ae9c', fachbereich: 'VWL', musterlosung: 'Bei öffentlichen Gütern (Landesverteidigung, Strassenbeleuchtung) kann niemand vom Konsum ausgeschlossen werden. Das lädt zu Trittbrettfahrerverhalten ein: Wer nicht bezahlt, profitiert trotzdem. Kein privater Anbieter kann so die Kosten decken — es kommt zu Marktversagen, und der Staat muss finanzieren.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Nachfrage ist oft hoch — das Problem ist nicht der Bedarf.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Free-Rider-Problem verhindert private Finanzierung — Marktversagen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kosten allein sind nicht das Problem — es ist die Ausschlussunmöglichkeit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Staat verbietet nichts — er springt ein, um die Lücke zu füllen.' },
  ] },
  { id: '7ee3f6c4-db3c-458c-85d6-bcfb724ac5d7', fachbereich: 'VWL', musterlosung: 'Der Gini-Koeffizient misst die Gleichmässigkeit der Einkommensverteilung, nicht das absolute Niveau. 0.25 ist gleichmässiger als 0.45 — Land A hat weniger Extreme. Bei gleichem BIP pro Kopf sagt das aber nichts darüber aus, ob die Menschen in A oder B im Durchschnitt reicher sind.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Aus dem Gini lässt sich keine Qualität der Sozialpolitik ableiten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Gleichmässigkeit ungleich Niveau — absolute Werte bleiben offen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gleiches BIP pro Kopf bedeutet durchschnittlich gleichen Wohlstand.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Ein Gini von 0.45 sagt nichts über absolute Armut aller Einwohner.' },
  ] },
  { id: '7f6227a3-f7ee-47c3-86c1-c3bf5262c079', fachbereich: 'VWL', musterlosung: 'Adam Smith (1723–1790) beschrieb die «unsichtbare Hand» des Marktes in «Der Wohlstand der Nationen» (1776): Wenn jeder seinen Vorteil verfolgt, wird über den Preismechanismus die gesamtgesellschaftliche Wohlfahrt erhöht. Die Idee bildet die Grundlage der liberalen Wirtschaftstheorie und steht im Kontrast zu Keynes, Rawls und Marx.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Keynes forderte staatliche Nachfragesteuerung, nicht die unsichtbare Hand.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Adam Smith prägte das Bild der unsichtbaren Hand 1776.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Rawls entwickelte die Theorie der Gerechtigkeit, nicht der Marktkoordination.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Marx kritisierte genau diesen Marktmechanismus.' },
  ] },
  { id: '7fb7fb69-4f1b-4c4d-965c-c06c3ae14583', fachbereich: 'VWL', musterlosung: 'Die elastische Seite kann leichter ausweichen, die unelastische Seite trägt die grössere Last. Bei elastischer Nachfrage und unelastischem Angebot tragen daher die Produzenten den grösseren Teil der Steuerlast. Im Diagramm ist die Fläche D (Last Produzenten) deutlich grösser als die Fläche B (Last Konsumenten).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Bei unterschiedlichen Elastizitäten verteilt sich die Last ungleich.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Elastische Nachfrage kann ausweichen — Konsumenten tragen weniger.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Vollständige Überwälzung setzt vollkommen unelastische Nachfrage voraus.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Unelastisches Angebot trägt den Hauptteil — D > B.' },
  ] },
  { id: '7fd100f0-dda4-4535-bf48-288825759a82', fachbereich: 'VWL', musterlosung: 'Die Steuerinzidenz beschreibt, wer die Steuerlast wirtschaftlich tatsächlich trägt — unabhängig von der formalen Steuerschuldnerschaft. Entscheidend sind die Elastizitäten von Angebot und Nachfrage: Die unelastischere Seite kann weniger ausweichen und trägt den grösseren Anteil. Das gilt für Konsumsteuern, Lohnabgaben und Gewinnsteuern.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Anzahl der Güter ist statistisch — nicht die Inzidenz.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Steuersatz ist die rechtliche Höhe — nicht die Inzidenz.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Steuereinnahmen sind die Summe, nicht die Verteilung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Ökonomische Lastverteilung zwischen Konsumenten und Produzenten.' },
  ] },
  { id: '8110291a-209f-4680-9ca6-36b21da8bda4', fachbereich: 'VWL', musterlosung: 'Der Primärhaushalt ist der Haushaltssaldo ohne Zinszahlungen. Ein ausgeglichener Primärhaushalt bedeutet, dass laufende Einnahmen die laufenden Ausgaben (ohne Zinsen) decken. Bei stabilem Zinssatz und positivem Wachstum hält das die Schuldenquote stabil — ein wichtiger Indikator für Tragfähigkeit der Staatsverschuldung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Einnahmen gleich Ausgaben ohne Zinsen — Kerndefinition.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: «Primär» bezieht sich auf Zinsfreiheit, nicht auf eine Steuerart.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Schuldentilgung ist etwas anderes — Primärsaldo lässt den Bestand unberührt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das wäre ein Überschuss — nicht ein Ausgleich.' },
  ] },
  { id: '819c9865-9faf-43d9-ac2a-28fbaa7efa2c', fachbereich: 'VWL', musterlosung: 'Die Ölkrise 1973/74 war ein klassischer realer Angebotsschock: Die OPEC drosselte die Erdölproduktion, der Ölpreis vervielfachte sich. Die erdölabhängige Schweizer Wirtschaft erlitt einen der stärksten Einbrüche seit dem Zweiten Weltkrieg. Die autofreien Sonntage sind noch heute Symbol dieses Schocks.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die MwSt wurde in der Schweiz erst 1995 eingeführt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: OPEC-Ölembargo verursachte den Einbruch Mitte 1970er.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Bretton Woods wurde 1971–73 aufgegeben, nicht 1944.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: UNO-Beitritt erfolgte 2002 — hat mit dem 70er-Einbruch nichts zu tun.' },
  ] },
  { id: '8333eabe-528d-440b-8e90-0cff985231a6', fachbereich: 'VWL', musterlosung: 'Rund 90 Prozent der japanischen Staatsschulden halten inländische Gläubiger — Banken, Versicherungen, die Bank of Japan und Privatpersonen. Das reduziert das Risiko eines Kapitalabzugs durch ausländische Investoren und ermöglicht sehr tiefe Zinsen. Risikolos ist die Lage jedoch nicht, besonders im Kontext der alternden Bevölkerung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der IWF garantiert keine Schulden von G7-Ländern.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Schulden bestehen offen und sind dokumentiert.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Inländische Gläubiger — weniger Abzugsrisiko, tiefe Zinsen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bevölkerungsgrösse erklärt Schuldenbedienbarkeit nicht.' },
  ] },
  { id: '833f8ee7-c5ab-4d9f-b702-5dd77652562c', fachbereich: 'VWL', musterlosung: 'Die 90-Prozent-Schwelle nach Reinhart und Rogoff markiert erhöhte Schuldenquoten. Japan (rund 263 Prozent), Italien (rund 144 Prozent) und Griechenland (rund 177 Prozent) liegen deutlich darüber. Deutschland (rund 64 Prozent) und die Schweiz (rund 27 Prozent) liegen klar darunter — die Schweiz gehört zu den niedrigsten weltweit.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Japan rund 263 Prozent — weit über der 90-Prozent-Schwelle.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Griechenland rund 177 Prozent — nach der Eurokrise weiterhin hoch.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Italien rund 144 Prozent — chronische strukturelle Überschuldung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Deutschland liegt bei rund 64 Prozent — unterhalb der Schwelle.' },
  ] },
  { id: '848cab1e-c996-4c52-8c75-dce2ede9b06d', fachbereich: 'VWL', musterlosung: 'Beim Crowding-out konkurriert der Staat als Kreditnehmer mit privaten Investoren um das verfügbare Kapital. Weil er als sicherer Schuldner gilt, bevorzugen Anleger Staatsanleihen — private Investitionen werden verdrängt. Der Effekt ist bei Vollbeschäftigung besonders stark und dämpft den fiskalischen Multiplikator.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Staatliche Kreditaufnahme verdrängt private Investoren am Kapitalmarkt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das ist Steuerflucht — ein anderes Phänomen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kapitalflüsse zwischen Ländern gehören nicht zum Crowding-out-Begriff.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Crowding-out bezieht sich auf Kapital-, nicht Arbeitsmärkte.' },
  ] },
  { id: '84b687f0-645d-4f65-aa71-dd9c75f8615b', fachbereich: 'VWL', musterlosung: 'Papiergeld hat praktisch keinen Materialwert und lässt sich leicht vermehren. Ohne eine vertrauenswürdige, unabhängige Institution würde das Vertrauen in die Währung rasch schwinden. Darum liegt das Geldmonopol bei der Zentralbank — in der Schweiz bei der SNB, gesetzlich auf Preisstabilität verpflichtet.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Geschäftsbanken haben sehr wohl Interesse an stabilem Geld — ihr Geschäftsmodell hängt davon ab.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Papiergeld ohne Materialwert braucht glaubwürdige Knappheitskontrolle.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Warengeld ist historisch, heute dominiert Fiatgeld.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das ist gerade der Grund für Zentralbank-Unabhängigkeit — gegen staatliche Willkür.' },
  ] },
  { id: '8635aee9-1ba5-4092-a3f6-9384058a5cb8', fachbereich: 'VWL', musterlosung: 'Keynesianische Politik ist in akuten Krisen besonders wirksam, weil die Nachfrage stark einbricht. Angebotsorientierte Reformen wirken erst mittel- bis langfristig über verbesserte Rahmenbedingungen. Die Konzeptionen unterscheiden sich fundamental, werden in der Praxis aber meist pragmatisch kombiniert — je nach Lage und politischer Ausrichtung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: In schweren Krisen ist Nachfragestützung wirksamer als in normalen Abschwüngen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Angebotsreformen brauchen Jahre — Investitionen und Ausbildungen wirken langsam.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Konzeptionen setzen unterschiedliche Hebel und führen zu unterschiedlichen Ergebnissen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: In der Praxis kombinieren die meisten Länder pragmatisch — Policy-Mix ist die Regel.' },
  ] },
  { id: '87452b71-0d97-4a92-aa1d-102a2bd42520', fachbereich: 'VWL', musterlosung: 'Briefkastenfirmen haben keine echte Geschäftstätigkeit, keine Mitarbeitenden und keine Büros vor Ort — nur eine Adresse. Steuerparadiese ermöglichen sie, indem sie geringe Substanzanforderungen stellen. Eine formale Registrierung reicht. Die anderen Merkmale (tiefe Steuern, Bankgeheimnis, Stabilität) machen das Paradies zusätzlich attraktiv.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Tiefe Steuern sind Motiv, nicht Voraussetzung der Briefkastenexistenz.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Bankgeheimnis verdeckt Vermögen, regelt aber nicht die Substanzanforderung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Geringe Substanzanforderungen erlauben reine Adressen ohne Tätigkeit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Politische Stabilität ist Rahmenfaktor, nicht Substanzdefinition.' },
  ] },
  { id: '88533367-bfc6-4c62-8b8c-613696ccdab0', fachbereich: 'VWL', musterlosung: 'Bei nahezu null Inflation ist der allgemeine Preisstand stabil. Wenn Zucker um 40 Prozent teurer wird, ändert sich sein relativer Preis — Zucker ist im Vergleich zu anderen Gütern teurer geworden. Mögliche Ursachen sind Missernten, steigende Produktionskosten oder erhöhte Nachfrage nach Zucker.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Geldmenge erklärt allgemeine Inflation, nicht relative Preisänderungen eines Gutes.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Wenn nur ein Gut teurer wird, ist es keine allgemeine Inflation.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der relative Preis hat sich gerade verändert — Zucker ist teurer relativ zu anderen Gütern.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Relativer Preis gestiegen — Ursache bei Zucker-spezifischen Faktoren.' },
  ] },
  { id: '89322e46-0bb5-4498-b163-e402a003d7da', fachbereich: 'VWL', musterlosung: 'Die allgemeine Akzeptanz ist die fundamentalste Geldeigenschaft. Ohne Akzeptanz ist ein Zahlungsmittel wertlos — egal wie viel darauf steht. Erst die universelle Akzeptanz ermöglicht die Tauschmittelfunktion. Der Warenwert pro Geldeinheit folgt aus Angebot und Nachfrage und kann schwanken, ohne dass Geld seine Funktion verliert.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Auch schwaches Geld wird genutzt, wenn nichts anderes zur Verfügung steht.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Akzeptanz ist Voraussetzung aller Geldfunktionen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die beiden Eigenschaften sind nicht gleichrangig — Akzeptanz kommt zuerst.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die blosse Menge ist ohne Akzeptanz wertlos.' },
  ] },
  { id: '89797fe5-1309-47a0-a29f-fbf8449f61f3', fachbereich: 'VWL', musterlosung: 'Seit den 1970er-Jahren hat sich in den USA eine Kluft zwischen Produktivität und Reallöhnen aufgetan: Die Produktivität hat sich mehr als verdoppelt, während die Reallöhne der Güter produzierenden Arbeiter praktisch stagnierten. Der Produktivitätsgewinn floss zunehmend in Kapitalerträge — eine verschärfte Verteilungsfrage.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Produktivität stieg stark, Reallöhne blieben — Abkoppelung seit 1970.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Beides hat nicht gesunken — die Produktivität stieg weiter.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Richtung ist umgekehrt — Produktivität wuchs, Löhne stagnierten.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Gerade die fehlende Parallelität ist das Phänomen.' },
  ] },
  { id: '89e24072-027f-4996-a9d4-ed6482d4a0c6', fachbereich: 'VWL', musterlosung: 'Die Klassiker — Adam Smith, Jean-Baptiste Say — vertrauen auf die Selbstheilungskräfte des Marktes. Flexible Preise, Löhne und Zinsen gleichen Angebot und Nachfrage automatisch aus. Staatliche Eingriffe in die Konjunktur sind demnach unnötig oder gar schädlich. Say\'s Law: Jedes Angebot schafft sich seine Nachfrage.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Aktive Nachfragesteuerung ist keynesianisch — nicht klassisch.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Stetige Geldmengenregel ist monetaristisch (Friedman), nicht klassisch.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Marktselbstregulierung — Staat bleibt aus der Konjunktur heraus.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Auch die Klassiker anerkennen Schwankungen, sehen sie aber als selbstheilend.' },
  ] },
  { id: '8a342ff9-14e7-4e9f-9478-7e50d98e5ba7', fachbereich: 'VWL', musterlosung: 'Bei elastischer Nachfrage reagiert die Menge stark auf den Steuerkeil — viele Transaktionen fallen weg, das Wohlfahrtsverlust-Dreieck wird gross. Bei unelastischer Nachfrage bleibt die Menge nahezu stabil, der Wohlfahrtsverlust bleibt gering, obwohl Konsumenten den grösseren Teil der Steuer tragen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Unterschiedliche Elastizitäten führen zu unterschiedlichen Wohlfahrtsverlusten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Elastische Nachfrage = grosse Mengenreaktion = grosser Deadweight Loss.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Unelastische Nachfrage führt zu geringerem Wohlfahrtsverlust.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Information reicht aus — Elastizitäten entscheiden eindeutig.' },
  ] },
  { id: '8a4837ad-7b9a-4138-ac71-0a566b5b96cd', fachbereich: 'VWL', musterlosung: 'Vertikale Gerechtigkeit fordert Umverteilung zwischen verschiedenen Einkommensgruppen (von oben nach unten). Horizontale Gerechtigkeit fordert, dass Menschen in gleicher Lage gleich behandelt werden. Beide Prinzipien sind zentrale Orientierungen für Steuer- und Sozialsysteme — sie ergänzen sich, nicht ersetzen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Beide Konzepte gelten für Steuern und Sozialversicherungen gleichermassen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Konzepte unterscheiden sich fundamental — unterschiedliche Ziele.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Vertikal = Umverteilung, horizontal = Gleichbehandlung bei gleicher Lage.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Definitionen sind vertauscht — horizontal meint Gleichbehandlung.' },
  ] },
  { id: '8a48f9cd-3d74-4d86-a85c-b4d8735504e2', fachbereich: 'VWL', musterlosung: 'Obwalden ist klein und hat kaum Zentrumslasten. Schon wenige wohlhabende Neuzuzüger verbessern die Steuerkraft spürbar. Luzern dagegen hat mit Entlebuch und Hinterland strukturschwache Gebiete sowie als Zentrum zusätzliche Kosten (Kultur, Verkehr, Soziales), die Steueranreize allein nicht kompensieren können.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Obwalden ist bevölkerungsmässig kleiner als Luzern.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Kleinheit plus tiefe Zentrumslasten erklären die stärkere Steuerwirkung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Erfolg beruhte gerade auf tieferen, nicht höheren Steuersätzen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Beide Kantone liegen ähnlich weit von Zürich entfernt — nicht das Kriterium.' },
  ] },
  { id: '8a713249-eb54-4ec0-96c1-844678f5e870', fachbereich: 'VWL', musterlosung: 'Quantitative Easing (QE) bezeichnet den Kauf längerfristiger Staatsanleihen (oder anderer Wertpapiere) durch die Zentralbank. Ziel ist es, die langfristigen Zinsen zu senken, wenn der Leitzins bereits bei null liegt und konventionelle Geldpolitik an ihre Grenzen stösst. Ben Bernanke lancierte das erste grosse QE-Programm der Fed während der Finanzkrise 2008.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: QE erhöht die Geldmenge — sie wird nicht reduziert.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Staatsanleihen-Käufe zur Senkung langfristiger Zinsen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Mindestreserven-Erhöhung wirkt entgegengesetzt — sie bremst Kreditvergabe.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Leitzinssenkung ist konventionelle Geldpolitik — QE setzt genau nach Null an.' },
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
  console.log(`Session 14: ${updates.length} Fragen appended (${withTeile} mit Teilerklärungen, ${updates.length - withTeile} ohne).`)
  console.log(`Total verarbeitet: ${state.verarbeitet} / ${state.totalFragen}`)
}

main().catch(err => { console.error(err); process.exit(1) })
