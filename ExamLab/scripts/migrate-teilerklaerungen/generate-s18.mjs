#!/usr/bin/env node
/**
 * Session 18: 50 VWL-Fragen (alle mc).
 * Erste Hälfte des 100er-Batches nach Fachbereich → Typ → ID.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  { id: 'dd61fec5-91b2-489a-a0e4-4e3e884b57af', fachbereich: 'VWL', musterlosung: 'Der Staat finanziert seine Ausgaben aus drei Hauptquellen: Steuern (direkte wie Einkommens- oder Gewinnsteuer sowie indirekte wie die MwSt), Gebühren als Entgelt für konkrete Staatsleistungen und Verschuldung über den Kapitalmarkt. Langfristig tragfähig ist aber nur die Finanzierung über Steuern, weil Schulden verzinst und zurückgezahlt werden müssen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Zölle zählen zu den Staatseinnahmen, Spenden sind aber keine nennenswerte Finanzierungsquelle.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Gebühren gehören dazu, Bussen und Lotterien sind aber nur Randposten, keine Hauptquellen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Steuern, Gebühren und Verschuldung sind die drei Hauptquellen der Staatsfinanzierung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Geldschöpfung ist Aufgabe der Nationalbank, nicht eine Finanzierungsquelle des Bundes.' },
  ] },
  { id: 'dd85bafc-520a-45a9-a369-5e635b2045b5', fachbereich: 'VWL', musterlosung: 'Der modellhafte Konjunkturzyklus durchläuft fünf Phasen: Rezession (Talsohle), Erholung/Aufschwung, Hochkonjunktur/Boom, Stagnation und Abschwung zurück in die Rezession. Die Wirtschaftsleistung schwankt dabei um das Produktionspotenzial bei Normalauslastung. Die Abfolge ist stets gerichtet — nach einem Tief folgt eine Erholung, nach dem Höhepunkt eine Abkühlung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein Aufschwung kann nicht direkt in eine Rezession übergehen, dazwischen liegt der Boom.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Nach Stagnation folgt Abschwung, nicht direkt Erholung — die Reihenfolge ist vertauscht.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Erholung führt zu Boom, nicht in Rezession — die Logik des Zyklus ist umgekehrt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Rezession → Aufschwung → Boom → Stagnation → Abschwung entspricht dem Konjunkturzyklus.' },
  ] },
  { id: 'ddcfeb48-b1c6-4cc5-88fa-bcb48737fa85', fachbereich: 'VWL', musterlosung: 'Die Verrechnungssteuer ist eine Sicherungssteuer: Banken behalten 35 % auf Kapitalerträgen zurück und liefern sie an den Bund ab. Wer die Erträge in der Steuererklärung korrekt deklariert, erhält die Verrechnungssteuer vollständig zurück. Wer die Einkünfte verschweigt, verliert den Betrag — das schafft einen starken Anreiz zur ehrlichen Deklaration.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Bund benötigt die Einnahmen sehr wohl, die Rückerstattung dient nicht dem Einnahmeverzicht.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ausländische Anleger erhalten die Verrechnungssteuer nur über Doppelbesteuerungsabkommen teilweise zurück.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Verrechnungssteuer ist in der Bundesverfassung verankert und keineswegs verfassungswidrig.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Als Sicherungssteuer erzwingt sie die Deklaration — ohne Deklaration keine Rückerstattung.' },
  ] },
  { id: 'dfdf2521-aa54-4399-b58f-0ef6b4adb025', fachbereich: 'VWL', musterlosung: 'Das Schweizer Sozialversicherungssystem umfasst acht Hauptzweige: AHV, IV, berufliche Vorsorge, EO/Mutterschaft, Unfallversicherung, Krankenversicherung, Arbeitslosenversicherung und Familienzulagen. Diese werden obligatorisch und solidarisch finanziert. Private Versicherungen wie Haftpflicht oder Hausrat stehen ausserhalb des Systems und werden freiwillig abgeschlossen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Die ALV ist der siebte Zweig und deckt Erwerbsausfall bei Arbeitslosigkeit.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Private Haftpflicht ist freiwillig und gehört nicht zum Sozialversicherungssystem.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Die EO deckt Erwerbsausfall bei Militärdienst oder Mutterschaft und gehört zu den 8 Zweigen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Familienzulagen sind der jüngste Zweig (seit 2009 bundesweit) und zählen zum System.' },
  ] },
  { id: 'e013af89-c410-4c78-8c93-b9d14a3e3769', fachbereich: 'VWL', musterlosung: 'Realkapital (auch Sachkapital) umfasst die produzierten Produktionsmittel eines Unternehmens: Maschinen, Anlagen, Werkzeuge und Gebäude. Es entstand selbst aus früheren Produktionsprozessen und dient nun der Herstellung weiterer Güter. Nicht zu verwechseln mit Geldkapital (finanzielle Mittel) oder dem Produktionsfaktor Wissen, zu dem Patente, Humankapital und technisches Know-how gehören.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Patente und geistiges Eigentum gehören zum Produktionsfaktor Wissen, nicht zum Realkapital.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Maschinen, Anlagen und Gebäude sind produzierte Produktionsmittel und bilden das Realkapital.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Arbeitskraft ist der Produktionsfaktor Arbeit, eine andere Kategorie als Realkapital.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bankguthaben sind Geldkapital (finanzielle Mittel), nicht Realkapital.' },
  ] },
  { id: 'e02e7f2f-a84d-4e45-b84a-22da7016774c', fachbereich: 'VWL', musterlosung: 'Externe Effekte entstehen, wenn eine wirtschaftliche Aktivität Kosten oder Nutzen bei unbeteiligten Dritten verursacht, die nicht im Marktpreis berücksichtigt werden. Negative Beispiele sind Umweltverschmutzung durch eine Fabrik, positive Beispiele sind Impfungen oder Bildung. Bei negativen Externalitäten produziert der Markt «zu viel», bei positiven «zu wenig» — in beiden Fällen spricht man von Marktversagen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Gewinne für Investoren sind keine Externalitäten — sie fliessen über den Markt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Externe Effekte haben nichts mit geografischer Lage zu tun, sondern mit nicht internalisierten Kosten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Exportwirkungen auf das BIP sind direkte Markteffekte, keine Externalitäten.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Kosten oder Nutzen bei Dritten, die nicht vom Verursacher getragen werden.' },
  ] },
  { id: 'e0592ecd-4315-46cb-8ef1-4f738932d78a', fachbereich: 'VWL', musterlosung: 'Wirtschaftswachstum beschreibt die langfristige Entwicklung der Wirtschaftsleistung, nicht kurzfristige Konjunkturschwankungen. Gemessen wird es am realen BIP (preisbereinigt), damit Inflation nicht als Wachstum erscheint. Zusätzlich betrachtet man das BIP pro Kopf, um das Bevölkerungswachstum herauszurechnen und die tatsächliche Wohlstandsentwicklung sichtbar zu machen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wachstum ist ein langfristiges Phänomen, Konjunktur beschreibt kurzfristige Schwankungen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Das reale (preisbereinigte) BIP isoliert echtes Wachstum von Inflationseffekten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das BIP misst Werte und erfasst Qualitätsverbesserungen über die Wertschöpfung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: BIP pro Kopf rechnet das Bevölkerungswachstum heraus und zeigt echte Wohlstandsveränderung.' },
  ] },
  { id: 'e06062a2-a772-4f89-a8ad-aab2fb995117', fachbereich: 'VWL', musterlosung: 'Die Nachfragekurve verläuft fallend, weil der Grenznutzen einer zusätzlich konsumierten Einheit abnimmt: Das zweite Glas Wasser stiftet weniger Nutzen als das erste. Konsumenten kaufen deshalb nur bei tieferem Preis mehr Einheiten. Unterstützend wirken Substitutions- und Einkommenseffekt: Teurere Güter werden durch Alternativen ersetzt, und höhere Preise reduzieren die reale Kaufkraft.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das beschreibt die steigende Angebotskurve, nicht das Nachfrageverhalten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Abnehmender Grenznutzen erklärt, warum die Zahlungsbereitschaft mit der Menge sinkt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Staatssteuern beeinflussen das Preisniveau, nicht den Verlauf der Nachfragekurve an sich.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Sinkende Produktionskosten betreffen das Angebot, nicht die Nachfrage.' },
  ] },
  { id: 'e0b4da24-1d39-4a13-a1bb-84751a1ee65d', fachbereich: 'VWL', musterlosung: 'Nullwachstum wäre laut Eisenhut eine Illusion aus zwei Gründen. Ohne Wachstum könnte niemand materiell reicher werden, ohne dass jemand anderes ärmer wird — Verteilungskonflikte würden zum Nullsummenspiel. Zudem sind die Sozialwerke (AHV, IV, Pensionskassen) umlagefinanziert oder auf steigende Beiträge angewiesen. Ohne Wachstum wäre ihre Finanzierung dauerhaft gefährdet.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Nullwachstum erfordert keinen Fortschrittsstopp, nur stagnierende Gesamtwertschöpfung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Umverteilung ohne Wachstum ist Nullsummenspiel, Sozialwerke brauchen Wachstum.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Nullwachstum und Inflation sind unabhängige Phänomene — ein Zusammenhang ist nicht zwingend.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bevölkerungsschrumpfung ist ein demografisches Thema, nicht Folge von Nullwachstum.' },
  ] },
  { id: 'e0b5b289-be89-453d-a5d9-3ad14ba27e7e', fachbereich: 'VWL', musterlosung: 'Strukturelle Arbeitslosigkeit hat einen längerfristigen Charakter und entsteht, wenn Angebot und Nachfrage auf dem Arbeitsmarkt nicht zusammenpassen. Sie zeigt sich in regionalen, branchenspezifischen, qualifikationsbezogenen oder alters- und geschlechtsbezogenen Unterschieden. Ursachen sind oft technologischer Wandel, Verlagerung von Industrien ins Ausland oder fehlende Weiterbildung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Saisonale Ursachen gehören zur saisonalen Arbeitslosigkeit, nicht zur strukturellen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Regionale, branchen- und qualifikationsspezifische Ungleichgewichte kennzeichnen sie.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Strukturelle Arbeitslosigkeit tritt in allen Sektoren auf, nicht nur in der Industrie.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Gerade die längere Dauer unterscheidet sie von friktioneller Arbeitslosigkeit.' },
  ] },
  { id: 'e0c66ee6-4637-439f-a95a-8722a1080021', fachbereich: 'VWL', musterlosung: 'Seit der Einführung der Schuldenbremse im Jahr 2003 hat der Bund rund 27 Mrd. Franken an Schulden abgebaut. Dies schuf fiskalischen Spielraum, den die Schweiz in der Coronakrise 2020 nutzen konnte, um rasch umfangreiche Hilfspakete zu schnüren. Christoph Schaltegger nennt diese Resilienz einen strukturellen Vorteil gegenüber hochverschuldeten Nachbarstaaten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Rund 27 Mrd. Franken Schuldenabbau seit 2003 durch die Schuldenbremse.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: 50 Mrd. ist zu hoch — die Zahl beträgt gut die Hälfte davon.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Schuldenbremse hat durchaus gewirkt — der Bund hat netto Schulden reduziert.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: 10 Mrd. unterschätzt die Wirkung der Schuldenbremse deutlich.' },
  ] },
  { id: 'e1c014c0-b6be-49ad-90d5-fda687e8d4c4', fachbereich: 'VWL', musterlosung: 'Die VWL unterscheidet vier Produktionsfaktoren: Arbeit (jede produktive menschliche Tätigkeit), natürliche Ressourcen (Boden, Rohstoffe, Energie), Realkapital (Maschinen, Anlagen, Gebäude) und Wissen (Humankapital und technischer Fortschritt). Durch ihre Kombination entstehen Güter und Dienstleistungen. Wissen gilt heute als zentraler Faktor moderner Volkswirtschaften.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Arbeit, Boden, Realkapital und Wissen sind die vier klassischen Produktionsfaktoren.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Löhne, Zinsen und Gewinne sind die Entlohnungen der Faktoren, nicht die Faktoren selbst.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Geld ist Finanzkapital, keine eigene Kategorie der Produktionsfaktoren.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Konsum, Investitionen und Staat sind BIP-Verwendungskomponenten, nicht Produktionsfaktoren.' },
  ] },
  { id: 'e2bea662-e537-4e7c-bdb8-fc113bde2c25', fachbereich: 'VWL', musterlosung: 'Das Schweizer Sozialversicherungssystem umfasst genau 8 Hauptzweige: AHV (inkl. Ergänzungsleistungen), IV, berufliche Vorsorge, EO/Mutterschaft, Unfallversicherung, Krankenversicherung, Arbeitslosenversicherung und Familienzulagen. Zusammen bilden sie das soziale Sicherungssystem der Schweiz und decken die zentralen Lebensrisiken Alter, Invalidität, Krankheit, Unfall und Erwerbsausfall.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: 10 ist zu hoch — EL gelten als Teil der AHV und werden nicht separat gezählt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: 5 ist deutlich zu tief und erfasst nicht alle Zweige des Systems.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Das Schweizer System kennt 8 Hauptzweige von AHV bis Familienzulagen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: 6 unterschätzt die Zahl — es fehlen beispielsweise die ALV und Familienzulagen.' },
  ] },
  { id: 'e2f3ae4a-3f61-466d-9512-ba3188604060', fachbereich: 'VWL', musterlosung: 'Im Geldmarktdiagramm bestimmen Geldangebot und Geldnachfrage den Wert (Kaufkraft) des Geldes. Weitet die Zentralbank das Geldangebot aus, ohne dass die Nachfrage mitsteigt, entsteht ein Überangebot — die Kaufkraft pro Einheit sinkt, das Preisniveau steigt. Hyperinflationen wie in Simbabwe oder der Weimarer Republik zeigen diesen Wertzerfall in extremer Form.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Eine monotone Ausweitung führt zu sinkender Kaufkraft, nicht zu einem vorübergehenden Anstieg.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Überangebot an Geld senkt die Kaufkraft, das Geld verliert an Wert.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Mehr Geld bedeutet nicht mehr Güter — die Gütermenge bleibt unverändert.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Ohne Nachfrageanpassung kann die Kaufkraft nicht konstant bleiben.' },
  ] },
  { id: 'e335e463-8b02-482d-93ed-4dfafd0fa0d2', fachbereich: 'VWL', musterlosung: 'Moral Hazard (moralisches Risiko) bezeichnet die Tendenz von Personen, sich risikoreicher zu verhalten, wenn sie die Konsequenzen nicht vollständig selber tragen müssen. Ein klassisches Beispiel ist die Vollkaskoversicherung: Wer den Schaden nicht selbst zahlt, fährt möglicherweise weniger vorsichtig. Versicherungen begegnen dem Problem mit Selbstbehalten, Franchisen und Boni-Malus-Systemen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das beschreibt Adverse Selection (Lemon-Problem), nicht Moral Hazard.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Risikofreudigeres Verhalten, wenn Schadenskosten auf andere abgewälzt werden.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Betrug ist Arglist, Moral Hazard ist dagegen ein Verhaltensreiz ohne Täuschung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Überbewertung ist eine kognitive Verzerrung, kein Moral-Hazard-Problem.' },
  ] },
  { id: 'e38ba53d-be84-4864-ab22-d79065559e3e', fachbereich: 'VWL', musterlosung: 'Zigaretten erfüllten in Kriegsgefangenenlagern alle zentralen Geldeigenschaften und setzten sich daher spontan als Zahlungsmittel durch. Sie waren knapp (begrenzte Rotkreuz-Lieferungen), relativ haltbar, gut teilbar (einzelne Zigaretten oder Päckchen) und einheitlich (gleiche Marke = gleicher Wert). Der Ökonom R. A. Radford beschrieb dies 1945 in einem berühmten Aufsatz.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Begrenzte Rotkreuz-Lieferungen machten Zigaretten knapp — Grundvoraussetzung für Geld.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Zigaretten verderben nicht schnell und bleiben über Monate werthaltig.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Einzelne Zigaretten oder Päckchen erlauben feine Preisabstufungen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Dieselbe Marke = dieselbe Qualität → fungibel wie Münzen.' },
  ] },
  { id: 'e4878a58-9ebd-4dbc-be9e-fd6bf50cc5e4', fachbereich: 'VWL', musterlosung: 'Wissen gilt als wichtigster Produktionsfaktor moderner Volkswirtschaften, weil es die Produktivität aller anderen Faktoren steigert. Besseres Know-how macht Arbeit effizienter, ermöglicht sparsamere Nutzung natürlicher Ressourcen und höhere Leistung von Maschinen. Deshalb investieren hochentwickelte Länder überproportional in Bildung, Forschung und Entwicklung — der Produktivitätshebel ist enorm.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Auch ohne spezialisiertes Wissen ist einfache Güterproduktion möglich, nur weniger produktiv.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Wissen ist nicht gratis — Bildung, Forschung und Know-how-Transfer verursachen grosse Kosten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Wissen ergänzt Arbeit, es ersetzt sie nicht vollständig.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Humankapital und technischer Fortschritt heben die Produktivität aller anderen Faktoren.' },
  ] },
  { id: 'e4ad0c1d-c4f5-4519-a5ed-e117d9825955', fachbereich: 'VWL', musterlosung: 'Direkte Steuern werden aufgrund persönlicher oder unternehmerischer Merkmale erhoben: Einkommen, Vermögen oder Gewinn. Steuerschuldner und Steuerträger sind identisch. Indirekte Steuern wie die Mehrwertsteuer hängen dagegen an Transaktionen und werden über den Preis auf die Konsumenten überwälzt — dort fallen Schuldner (Unternehmen) und Träger (Konsumenten) auseinander.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Die Einkommenssteuer knüpft direkt am persönlichen Einkommen an.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die MwSt ist eine Transaktionssteuer und damit eine indirekte Steuer.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Die Vermögenssteuer wird direkt auf das persönliche Vermögen erhoben.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Die Gewinnsteuer belastet unmittelbar den Unternehmensgewinn — eine direkte Steuer.' },
  ] },
  { id: 'e4dfa9c2-9755-4c56-8777-d6ba76db7d4d', fachbereich: 'VWL', musterlosung: 'Der Grenzsteuersatz gibt an, welcher Prozentsatz Steuer auf den zuletzt verdienten Franken fällt (z.B. 30 % auf die letzten 1\'000 Franken). Der Durchschnittssteuersatz bezieht die gesamte Steuerschuld auf das gesamte Einkommen (z.B. 15 %). Bei progressiven Tarifen liegt der Grenzsatz immer über dem Durchschnittssatz — das ist der Kern der Progression.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Beide Sätze können auf Bundes-, Kantons- und Gemeindeebene existieren.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Begriffe sind nicht synonym — sie messen unterschiedliche Dinge.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Grenz- = letzter Franken, Durchschnitt = gesamtes Einkommen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Beide Sätze gelten für alle Steuerpflichtigen, unabhängig von Rechtsform.' },
  ] },
  { id: 'e5018185-7dcf-4861-8292-f7916fb559a8', fachbereich: 'VWL', musterlosung: 'Die Elefantengrafik von Branko Milanović zeigt das weltweite Realeinkommenswachstum zwischen 1988 und 2008 nach Einkommensperzentilen. Im «Knick des Rüssels» (ca. 75. bis 85. Perzentil) befindet sich die untere Mittelschicht westlicher Industrieländer. Ihr Realeinkommen stagnierte oder sank leicht, während aufstrebende Mittelschichten in Schwellenländern und Top-Verdiener stark zulegten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Schwellenland-Mittelschicht sitzt auf dem Rücken des Elefanten mit starkem Wachstum.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das oberste 1 % bildet die Spitze des Rüssels, nicht den Knick.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Die untere westliche Mittelschicht stagnierte im Einkommen — der namensgebende Knick.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die ärmsten liegen ganz links auf tiefem Niveau, mit kaum Wachstum.' },
  ] },
  { id: 'e52441c7-4668-418d-88ae-5a51a6f10d02', fachbereich: 'VWL', musterlosung: 'Die Effizienzlohntheorie besagt, dass höhere Löhne die Produktivität der Beschäftigten erhöhen — nicht nur umgekehrt. Bessere Bezahlung steigert Motivation, Loyalität und Leistungsbereitschaft, senkt die Fluktuation und zieht qualifiziertere Bewerber an. Unternehmen können deshalb profitabel sein, obwohl sie über dem Markträumungslohn zahlen. Die Theorie erklärt auch dauerhafte Arbeitslosigkeit trotz Arbeitssuchender.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Gerade das Gegenteil trifft zu — Löhne beeinflussen die Produktivität positiv.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Höhere Löhne steigern Motivation, Loyalität und Auswahl qualifizierter Bewerber.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Theorie empfiehlt keine staatliche Lohnfestsetzung, sondern erklärt Verhalten auf dem Markt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der niedrigste Lohn wäre laut Theorie gerade nicht effizient, weil er Motivation untergräbt.' },
  ] },
  { id: 'e62546f6-1c95-4e0a-ae53-937b61029db0', fachbereich: 'VWL', musterlosung: 'Lenkungssteuern sollen unerwünschtes Verhalten (z.B. Rauchen, CO₂-Ausstoss) durch höhere Kosten reduzieren. Wirkt die Steuer, sinkt die besteuerte Menge — und damit auch das Steueraufkommen. Eine perfekt wirkende Lenkungssteuer würde null Einnahmen bringen. Dieses Paradox zeigt den Zielkonflikt zwischen Fiskalzweck (Einnahmen) und Lenkungszweck (Verhaltensänderung).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Lenkungssteuern werden nicht automatisch durch Subventionen ersetzt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Steuersatz sinkt nicht automatisch — er bleibt gleich, nur die Basis schrumpft.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Politisch werden sie selten abgeschafft, nur weil sie wirken — oft sind sie populär.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Wenn das besteuerte Verhalten abnimmt, sinken auch die Einnahmen zwangsläufig.' },
  ] },
  { id: 'e6ce0a39-4291-40e2-ba4b-6cffab6c43e7', fachbereich: 'VWL', musterlosung: 'Bei der Monetisierung kauft die Zentralbank Staatsanleihen, womit die Geldmenge ausgeweitet wird. Kurzfristig sinken die Zinsen dank zusätzlicher Liquidität. Langfristig droht jedoch Inflation, wenn die zusätzliche Geldmenge nicht durch höhere Gütermengen gedeckt wird. Historisch haben Hyperinflationen (z.B. Weimarer Republik, Simbabwe) oft ihren Ursprung in exzessiver Monetisierung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Kern der Monetisierung ist der Ankauf von Staatsanleihen durch die Zentralbank.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Zentralbankkäufe weiten die Geldmenge aus — das ist der Mechanismus.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kurzfristig sinken die Zinsen zunächst, sie steigen nicht sofort dauerhaft.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Langfristig steigt die Inflationsgefahr durch die ausgeweitete Geldmenge.' },
  ] },
  { id: 'e7eca38a-9554-468e-bbde-0da8f4a85ae5', fachbereich: 'VWL', musterlosung: 'Eine Mengensteuer (Stücksteuer) treibt einen Keil t zwischen Konsumenten- und Produzentenpreis. Das Steueraufkommen entspricht dem Rechteck aus Steuersatz t und gehandelter Menge Q_t — im Diagramm die Flächen B und D. B war zuvor Konsumentenrente, D Produzentenrente — beide gehen jetzt an den Staat. Fläche C bleibt als Wohlfahrtsverlust.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: A ist ein Teil der verbleibenden Konsumentenrente, nicht Steuereinnahme.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: B ist die Konsumenten-Teilfläche des Steueraufkommens.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: C ist der Wohlfahrtsverlust durch verhinderten Handel, keine Steuereinnahme.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: D ist die Produzenten-Teilfläche des Steueraufkommens.' },
    { feld: 'optionen', id: 'opt-4', text: 'Falsch: E ist Teil der verbleibenden Produzentenrente.' },
    { feld: 'optionen', id: 'opt-5', text: 'Falsch: F ist der Bereich unter der Grenzkostenkurve und zählt nicht zum Steueraufkommen.' },
  ] },
  { id: 'e9ce2fe3-66e3-40bc-9080-0a8b71ed853c', fachbereich: 'VWL', musterlosung: 'Öffentliche Leistungen wie Bildung, Gesundheit oder Verwaltung sind stark personenbezogen und lassen sich schwer automatisieren. Ein Lehrer braucht dieselbe Zeit für eine Klasse wie vor 50 Jahren, während in der Industrie Roboter die Stückzahl vervielfachen. Diese strukturelle Produktivitätsschwäche heisst «Baumol-Kosten-Krankheit» und erklärt, warum öffentliche Dienste tendenziell relativ teurer werden.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Staat hat sehr wohl Zugang zum Kapitalmarkt über Obligationen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Staatsangestellte sind nicht pauschal weniger produktiv — der Sektor ist anders.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Moderne Technologien werden eingesetzt, ersetzen Personalintensität aber nur bedingt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Öffentliche Dienstleistungen sind arbeitsintensiv und schwer automatisierbar.' },
  ] },
  { id: 'eac9cfe5-0340-4c1d-9e89-7f312689c130', fachbereich: 'VWL', musterlosung: 'Externe Effekte sind Auswirkungen wirtschaftlicher Aktivitäten auf unbeteiligte Dritte, die weder im Preis noch in der Entscheidung der Marktteilnehmer berücksichtigt werden. Sie können negativ sein (Umweltverschmutzung, Lärm) oder positiv (Bildung, Impfungen). In beiden Fällen führt der Markt ohne Korrektur zu ineffizienten Mengen — bei negativen zu viel, bei positiven zu wenig.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Kosten oder Nutzen bei Dritten ausserhalb des Preismechanismus.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das ist die Preiselastizität, nicht ein externer Effekt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Steuerwirkungen sind direkte politische Eingriffe, keine Externalitäten.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Importwirkungen sind Markteffekte über den Preis, nicht Externalitäten.' },
  ] },
  { id: 'eb52c6e3-6f3d-4bdb-bdf4-4a014cb41662', fachbereich: 'VWL', musterlosung: 'Endprodukte sind Güter, die nicht weiterverarbeitet werden und direkt in die Endverwendung fliessen: Konsum, Investition, Staatsausgaben oder Exporte. Vorleistungen dagegen (Stahl, Mehl, Halbfabrikate) werden vor dem Verkauf in andere Produkte eingebaut. Das BIP erfasst nur Endprodukte, um Doppelzählungen zu vermeiden — jede Vorleistung steckt bereits im Preis des Endprodukts.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Das Familienauto ist privates Konsumgut — geht direkt ins BIP ein.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Stahl für die Autoproduktion ist Vorleistung und schon im Autopreis enthalten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Der Bürocomputer ist Investition eines Unternehmens — Endprodukt für BIP-Zwecke.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Mehl ist Vorleistung der Bäckerei und steckt im Brotpreis.' },
  ] },
  { id: 'eb63dbb7-149b-443a-9214-fb90b53e2f4b', fachbereich: 'VWL', musterlosung: 'Im klassischen Arbeitsmarktmodell führt Lohnflexibilität zum Gleichgewicht: Bei Nachfragerückgang sinken die Löhne, bis alle Arbeitswilligen wieder eine Stelle finden. Bleiben die Löhne aber unflexibel (z.B. durch Tarifverträge oder Mindestlöhne), fragen Unternehmen weniger Arbeit nach als angeboten wird. Es entsteht unfreiwillige Arbeitslosigkeit — Menschen wollen arbeiten, finden aber keine Stelle zum herrschenden Lohn.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ohne Flexibilität steigen die Löhne gerade nicht automatisch.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Bei starren Löhnen und sinkender Nachfrage steigt die Arbeitslosigkeit, sie sinkt nicht.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Arbeitswillige finden keine Stelle zum vorhandenen Lohn — unfreiwillige Arbeitslosigkeit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Freiwillige Arbeitslosigkeit wäre Verzicht auf Arbeit bei ausreichendem Lohnangebot.' },
  ] },
  { id: 'ebb08ee5-211c-4b6f-a3ab-c7c2ede71d22', fachbereich: 'VWL', musterlosung: 'Transferzahlungen sind Zahlungen des Staates an Haushalte ohne direkte Gegenleistung. Beispiele sind AHV- und IV-Renten, Sozialhilfe, Kinderzulagen oder Stipendien. Damit unterscheiden sie sich von Löhnen (Entgelt für geleistete Arbeit) und Subventionen (Zahlungen an Unternehmen). Transfers dienen der sozialen Umverteilung und stabilisieren die Kaufkraft in wirtschaftlichen Schwächephasen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Export ist eine Güterbewegung über die Grenze, kein Transfer im Kreislaufsinn.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Staatliche Leistungen ohne Gegenleistung wie AHV oder Sozialhilfe.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Überweisungen ins Ausland sind grenzüberschreitende Zahlungen, nicht Transfers im Modell.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Steuerzahlungen fliessen von Haushalten zum Staat, nicht umgekehrt.' },
  ] },
  { id: 'ec31148a-a6a4-441d-9a6b-a6e312dbc44f', fachbereich: 'VWL', musterlosung: 'Wettbewerbsbeschränkungen sind Massnahmen oder Strukturen, die den freien Wettbewerb auf einem Markt behindern. Sie können aus Marktmacht entstehen (Monopole, Kartelle, Oligopole) oder aus staatlichen Eingriffen (Zölle, Normen, Lizenzen). Die Folge sind höhere Preise, geringere Mengen und Wohlfahrtsverluste. Die WEKO (Wettbewerbskommission) überwacht in der Schweiz den fairen Wettbewerb.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Wettbewerbsförderung ist gerade das Gegenteil von Wettbewerbsbeschränkung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Konjunkturelle Nachfragerückgänge sind keine strukturellen Wettbewerbsbeschränkungen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Ressourcenknappheit ist eine natürliche Grenze, keine künstliche Wettbewerbsbeschränkung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Massnahmen oder Strukturen, die freien Wettbewerb behindern.' },
  ] },
  { id: 'ec79ed28-5e67-4d7c-88e2-21a06ae3dfd2', fachbereich: 'VWL', musterlosung: 'Die keynesianische Theorie entstand als Antwort auf die Grosse Depression der 1930er-Jahre. Die klassische Vorstellung einer Selbstregulierung des Marktes versagte angesichts jahrelanger Massenarbeitslosigkeit. Keynes argumentierte 1936 in der «General Theory», dass aggregierte Nachfrage, Erwartungen und starre Löhne Gleichgewichte bei Unterbeschäftigung erzeugen können. Der Staat müsse daher antizyklisch eingreifen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Ölkrise ist 50 Jahre später und spielte keine Rolle bei der Entstehung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Finanzkrise 2008/09 ist ebenfalls viel zu spät — Keynes lebte 1883–1946.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Die Grosse Depression der 1930er-Jahre war der historische Auslöser.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Dotcom-Blase liegt ebenfalls weit nach Keynes\' Wirken.' },
  ] },
  { id: 'ed911dbf-727e-4e51-a5ed-8e7724421705', fachbereich: 'VWL', musterlosung: 'Im erweiterten Wirtschaftskreislauf stehen Staat, Haushalte und Unternehmen in wechselseitigen Zahlungsbeziehungen. Vom Staat an die Haushalte fliessen zwei Arten Ströme: Transfers (AHV, Sozialhilfe — ohne Gegenleistung) und Löhne (an Staatsangestellte — als Entgelt für Arbeit). In die umgekehrte Richtung fliessen Steuern und Sozialabgaben.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Transfers wie AHV-Renten oder Sozialhilfe fliessen vom Staat zu Haushalten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Staatsangestellte erhalten Löhne — ein weiterer Strom vom Staat zu Haushalten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Subventionen fliessen an Unternehmen, nicht an Haushalte.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Steuereinnahmen fliessen von Haushalten zum Staat — entgegengesetzte Richtung.' },
  ] },
  { id: 'edd582dd-558f-45c2-9a62-eb3145d794d6', fachbereich: 'VWL', musterlosung: 'Die funktionale Einkommensverteilung zeigt, wie das Volkseinkommen auf die Produktionsfaktoren aufgeteilt wird: Löhne für Arbeit, Zinsen und Gewinne für Kapital, Mieten und Pachten für Boden. Die personelle Einkommensverteilung betrachtet dagegen Individuen oder Haushalte (Gini-Koeffizient, Dezile). Beide Perspektiven zeigen unterschiedliche Facetten derselben Volkswirtschaft.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das beschreibt die personelle Einkommensverteilung, nicht die funktionale.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Verteilung des Volkseinkommens auf die Produktionsfaktoren Arbeit, Kapital und Boden.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das wäre eine intertemporale Betrachtung, nicht die funktionale Verteilung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das ist die regionale Einkommensverteilung, eine andere Dimension.' },
  ] },
  { id: 'eec873b7-3a33-4d9a-bc56-8293087ea58e', fachbereich: 'VWL', musterlosung: 'Papiergeld hat keinen nennenswerten Eigenwert — sein Wert beruht ausschliesslich auf Vertrauen und allgemeiner Akzeptanz. Im Spiel BOB entspricht X dann Papiergeld, wenn es keinen Siegpunkt wert wäre (also keinen Eigennutzen hätte), aber trotzdem von allen als Tauschmittel akzeptiert würde. Wert durch Vertrauen, nicht durch Substanz.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wert ohne Eigennutzen, nur durch allgemeine Akzeptanz — typisch für Papiergeld.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Mehr Menge ändert die Geldart nicht, nur den Wert (Inflation).' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das Material (Papier statt Karton) bestimmt die Geldart nicht.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Zentrale Ausgabe ist kein Merkmal von Papier- gegenüber Warengeld.' },
  ] },
  { id: 'efcd3327-9e66-4ac4-abc6-7ec41008ef21', fachbereich: 'VWL', musterlosung: 'Allmendegüter wie Fischbestände, Weideland oder saubere Luft sind rivalisierend (Nutzung reduziert verfügbare Menge), aber nicht ausschliessbar (niemand kann von der Nutzung abgehalten werden). Individuell erhält jeder den vollen Nutzen, trägt aber nur einen Bruchteil der Übernutzungskosten. Das führt zur «Tragödie der Allmende»: Die Ressource wird systematisch übernutzt, selbst wenn das kollektiv schädlich ist.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Asymmetrische Information ist ein anderer Marktversagenstyp (Lemon-Problem).' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Allmendegüter werden übernutzt, nicht unterproduziert — das wäre bei öffentlichen Gütern.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Monopolbildung betrifft Marktstruktur, nicht Nutzung einer gemeinsamen Ressource.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Individueller Vollnutzen vs. Kostenteilung führt zur Übernutzung der Ressource.' },
  ] },
  { id: 'efe373c1-11b8-47e7-abf3-2f637cdbac6b', fachbereich: 'VWL', musterlosung: 'In der realen Welt gibt es Tausende verschiedener Güter, Millionen Wirtschaftsteilnehmer und hochgradig spezialisierte Produktionsprozesse. Die Wahrscheinlichkeit einer «doppelten Koinzidenz der Wünsche» (A hat, was B will, und umgekehrt) ist minimal. Geld löst dieses Problem als universelles Tauschmittel. Im Spiel BOB ist die Güter- und Teilnehmerzahl klein — der Vorteil von Geld ist hier schwächer ausgeprägt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Realität kennt viel mehr Güter als das Spiel — die Aussage ist verkehrt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Geld verliert durch Inflation durchaus an Wert — Werterhalt ist keine Garantie.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Mehr Güter und Akteure senken die Wahrscheinlichkeit doppelter Koinzidenz massiv.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Auch im Spiel müssen Güter erst produziert oder gehandelt werden.' },
  ] },
  { id: 'einr-mc-features', fachbereich: 'VWL', musterlosung: 'Die Einrichtungsprüfung testet vier Basisfunktionen von ExamLab: Dark Mode (Mond-Symbol), Frage-Markierung (Unsicher-Button), Tastaturkürzel (Cmd/Ctrl+Enter) und das Material-Panel. Alle vier Funktionen sollten nach korrektem Ausprobieren funktionieren. Zweck ist, dass Lernende sich mit der Oberfläche vertraut machen, bevor echte Prüfungen stattfinden.', teilerklaerungen: [
    { feld: 'optionen', id: 'a', text: 'Korrekt: Dark Mode wird durch Klick auf das Mond-Symbol aktiviert.' },
    { feld: 'optionen', id: 'b', text: 'Korrekt: Unsicher-Markierung über den «?»-Button pro Frage.' },
    { feld: 'optionen', id: 'c', text: 'Korrekt: Cmd+Enter (Mac) bzw. Ctrl+Enter (Windows) springt zur nächsten Frage.' },
    { feld: 'optionen', id: 'd', text: 'Korrekt: Der Material-Button in der Sidebar öffnet das seitliche Panel.' },
  ] },
  { id: 'einr-mc-orientierung', fachbereich: 'VWL', musterlosung: 'Die Einrichtungsprüfung umfasst 23 Fragen, sichtbar in der Sidebar links und im Header-Zähler (Format «X/23»). Dieser Überblick ermöglicht zeitliche Planung während der Prüfung. Die Orientierung ist eine Basisfähigkeit — wer die Gesamtzahl kennt, kann Tempo und Prioritäten besser steuern und weiss, wie viele Fragen noch offen sind.', teilerklaerungen: [
    { feld: 'optionen', id: 'a', text: 'Falsch: 16 ist zu tief — der Zähler zeigt eindeutig eine grössere Gesamtzahl.' },
    { feld: 'optionen', id: 'b', text: 'Falsch: 20 ist ebenfalls zu tief und entspricht nicht der Sidebar-Anzeige.' },
    { feld: 'optionen', id: 'c', text: 'Korrekt: Sidebar und Header zeigen «X/23» als Gesamtzahl.' },
    { feld: 'optionen', id: 'd', text: 'Falsch: 30 ist zu hoch — der Header-Zähler endet bei 23.' },
  ] },
  { id: 'f00becef-da6d-4b10-a887-17258b5986e9', fachbereich: 'VWL', musterlosung: 'Absolute Schuldenzahlen sagen wenig über Tragfähigkeit aus. Ein Land mit hohem BIP kann viel mehr Schulden tragen als ein kleines. Die Schuldenquote (Schulden in Prozent des BIP) setzt den Schuldenstand ins Verhältnis zur jährlichen Wirtschaftsleistung und ermöglicht damit internationalen Vergleich. Ein Staat mit einer Schuldenquote von 30 % ist weit solider aufgestellt als einer mit 200 %.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Absolute Zahlen lassen sich einfach berechnen — die Präferenz hat andere Gründe.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Staatsschulden werden nicht geheim gehalten, sie sind öffentlich zugänglich.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Das Verhältnis zur Wirtschaftsleistung zeigt, ob die Schulden tragbar sind.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die UNO erhebt keine solchen Formvorschriften für Schuldenquoten.' },
  ] },
  { id: 'f0ab4ead-afcc-4b40-9d6d-f06c0d1a1302', fachbereich: 'VWL', musterlosung: 'Lohnunterschiede zwischen Branchen erklären sich hauptsächlich durch Unterschiede in der Arbeitsproduktivität, also der Wertschöpfung pro Vollzeitstelle. Branchen wie Pharma oder Finanzdienstleistungen erwirtschaften pro Stelle hohe Wertschöpfung und können hohe Löhne zahlen. In personalintensiven Dienstleistungen wie Gastronomie oder Detailhandel ist die Produktivität tiefer — entsprechend auch die Löhne.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Schweizer Mindestlöhne sind kantonal geregelt, nicht branchenspezifisch auf Bundesebene.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Beschäftigtenzahl allein erklärt die Lohnhöhe nicht.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Produktivitätsunterschiede (Wertschöpfung pro Vollzeitstelle) sind der Hauptgrund.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Arbeitszeiten sind in der Schweiz weitgehend vergleichbar und kein Haupttreiber.' },
  ] },
  { id: 'f1a2b1ab-3483-4179-a24b-a5409d2b5e5a', fachbereich: 'VWL', musterlosung: 'Japan weist mit über 230 % des BIP die weltweit höchste Schuldenquote auf. Der Grossteil der Schulden liegt bei inländischen Gläubigern (Banken, Pensionskassen), was die Tragfähigkeit stabilisiert. Dahinter folgen Griechenland, Italien und Portugal. Die Schweiz gehört mit unter 30 % zu den am wenigsten verschuldeten Ländern weltweit — ein Ergebnis der Schuldenbremse seit 2003.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Griechenland liegt hoch (rund 170 %), aber klar unter Japans Niveau.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Japans Schuldenquote über 230 % ist die höchste weltweit.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die USA liegen mit rund 130 % deutlich tiefer als Japan.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Italien (ca. 140 %) ist hoch verschuldet, bleibt aber unter Japan.' },
  ] },
  { id: 'f1b5eb9f-1140-4369-9fe4-c80727271d9f', fachbereich: 'VWL', musterlosung: 'Der Gini-Koeffizient misst die Einkommensungleichheit: 0 bedeutet völlige Gleichverteilung, 1 extreme Ungleichheit. Die Schweiz hat einen Gini von etwa 0.29 (relativ gleichmässig), die USA rund 0.37 (deutlich ungleicher). Staatliche Umverteilung (Steuern, Transfers) senkt den Gini in der Schweiz vom Primäreinkommen (0.34) auf das verfügbare Einkommen (0.29).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Anzahl Milliardäre ist keine direkte Aussage des Gini-Koeffizienten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Gini misst Verteilung, nicht Niveau — beide Länder könnten gleich reich sein.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das BIP pro Kopf wird nicht durch den Gini ausgedrückt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Höherer Gini = grössere Ungleichheit, deshalb USA > Schweiz.' },
  ] },
  { id: 'f1dc1d3b-87fc-4e71-b4d8-de9b6452f873', fachbereich: 'VWL', musterlosung: 'Die Theorie der realen Schocks (Real-Business-Cycle-Theorie) erklärt Konjunkturschwankungen als Folge unerwarteter realer Störungen. Beispiele sind Ölkrisen, Naturkatastrophen, Kriege oder technologische Durchbrüche wie Dampfmaschine, Internet oder Penicillin. Diese Schocks verändern Produktionsmöglichkeiten und Preise. Im Unterschied zu monetären Theorien stehen nicht Geldpolitik, sondern reale Ereignisse im Zentrum.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Reale Schocks wie Katastrophen oder Technologiesprünge erklären Schwankungen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das wäre eine monetaristische Theorie, nicht die Real-Schocks-Theorie.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Zufall ohne Ursachen widerspricht dem Theoriezweck — Ursachen werden gerade benannt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Politische Wahlen sind keine zentrale Erklärung in dieser Theorie.' },
  ] },
  { id: 'f1e880ab-a246-47a4-9784-f504cde96d73', fachbereich: 'VWL', musterlosung: 'Bei progressiver Besteuerung steigt der Steuersatz mit zunehmendem Einkommen. Wer mehr verdient, zahlt nicht nur absolut, sondern auch prozentual einen höheren Anteil. Dadurch entsteht eine Umverteilung von wohlhabenderen zu weniger wohlhabenden Personen über den Staatshaushalt (Transfers, öffentliche Leistungen). Die Progression ist damit zentrales Instrument fiskalischer Umverteilungspolitik.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Progression gilt vor allem bei direkten Steuern (Einkommen), nicht indirekten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Höhere Einkommen zahlen prozentual mehr — genau das ist die Umverteilungswirkung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gleicher Betrag wäre eine Kopfsteuer, keine Progression.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Konsumlenkung ist Ziel von Lenkungssteuern, nicht der Progression.' },
  ] },
  { id: 'f26cce89-c7de-4d4e-902d-6e5d803dcc71', fachbereich: 'VWL', musterlosung: 'Der einfache Wirtschaftskreislauf zeigt zwei Akteure: Haushalte und Unternehmen. Haushalte bieten Arbeit, Kapital und Boden an und fragen im Gegenzug Güter nach. Unternehmen produzieren Güter und fragen dafür Produktionsfaktoren nach. Zwischen beiden fliessen Geld- und Güterströme in entgegengesetzte Richtungen. Der erweiterte Kreislauf ergänzt Staat, Ausland und Banken.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Staat und Ausland gehören zum erweiterten Kreislauf, nicht zum einfachen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Arbeitnehmer/Arbeitgeber sind Rollen innerhalb der Haushalts-Unternehmens-Beziehung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Banken gehören zum erweiterten Kreislauf mit Finanzsektor.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Haushalte und Unternehmen bilden den einfachen Wirtschaftskreislauf.' },
  ] },
  { id: 'f2ee9ebe-dee5-4848-974d-b37f9abe29e7', fachbereich: 'VWL', musterlosung: 'Eine steile Nachfragekurve bedeutet, dass die nachgefragte Menge bei Preisänderungen kaum reagiert — die Preiselastizität ist nahe null. Insulin ist lebensnotwendig und hat keine echten Substitute. Diabetiker brauchen es unabhängig vom Preis. Diese Unelastizität tritt typischerweise bei lebensnotwendigen Gütern ohne Alternativen auf (Medikamente, Trinkwasser, kurzfristig Benzin).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein Luxusgut hätte eine flache (elastische) Nachfragekurve, kein steile.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Elastische Nachfrage zeigt sich in flachem Verlauf — das Gegenteil von steil.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Frage bezieht sich auf die Nachfrage, das Angebot ist hier nicht thematisiert.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Steile Kurve = unelastische Nachfrage, weil Insulin lebensnotwendig ist.' },
  ] },
  { id: 'f45f500d-4dae-4c75-9501-e2f7de2c2e4f', fachbereich: 'VWL', musterlosung: 'Staatsversagen tritt auf, wenn staatliche Eingriffe gesellschaftliche Probleme nicht lösen oder verschärfen. Typische Formen: ineffiziente Bürokratie, Erhaltung nicht mehr wettbewerbsfähiger Strukturen durch Subventionen, Fehlanreize in Sozialsystemen. Der Bau von Strassen und Schulen ist dagegen Bereitstellung öffentlicher und meritorischer Güter — ein legitimer Staatszweck, kein Staatsversagen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Bürokratiekosten und Verzögerungen sind klassisches Staatsversagen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Subventionen verhindern Strukturwandel und binden Ressourcen in unproduktiven Sektoren.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Öffentliche Infrastruktur ist Kernaufgabe, kein Staatsversagen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Transfer-Fehlanreize senken die Arbeitsaufnahme und sind Staatsversagen.' },
  ] },
  { id: 'f476a596-c274-4ecb-83fe-d682c53d7438', fachbereich: 'VWL', musterlosung: 'Das BIP erfasst nur marktbezogene Leistungen. Hausarbeit, Betreuung eigener Kinder, ehrenamtliche Tätigkeit oder Selbsthilfe werden nicht erfasst, weil kein Marktpreis existiert. Paradox: Wer seine Kinder selbst betreut, zählt nicht zum BIP; wer sie in die Krippe bringt, erhöht das BIP — obwohl die Leistung dieselbe bleibt. Das führt zu systematischen Verzerrungen der BIP-Messung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Coiffeur-Dienstleistungen sind marktbezogen und gehen ins BIP ein.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Autoproduktion ist klassische BIP-Komponente (Investitionsgut oder Konsum).' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Hausarbeit und Eigenleistungen ohne Marktpreis bleiben unerfasst.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Staatliche Leistungen werden mit Kosten (Löhnen) ins BIP einbezogen.' },
  ] },
  { id: 'f5c7559f-0803-484d-a65b-efda94de1fd6', fachbereich: 'VWL', musterlosung: 'Opportunitätskosten sind der entgangene Nutzen der besten nicht gewählten Alternative. Wer Geld im Portemonnaie oder auf einem unverzinsten Konto hält, verzichtet auf Zinsen einer alternativen Anlage (Sparkonto, Wertpapiere). Diese entgangenen Erträge sind die Opportunitätskosten der Geldhaltung. Je höher die Marktzinsen, desto teurer ist das Halten von Bargeld — weshalb Geldnachfrage und Zins negativ korrelieren.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Entgangene Zinsen einer Alternativanlage = Opportunitätskosten der Geldhaltung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Kontoführungsgebühren sind direkte Kosten, keine Opportunitätskosten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Banknotenherstellung trägt die Nationalbank, nicht der Geldhalter.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Inflationsverlust ist die Kaufkrafterosion, nicht die Opportunitätskosten.' },
  ] },
  { id: 'f673bb33-7af8-4c0b-9316-92d71e88e970', fachbereich: 'VWL', musterlosung: 'Die Preiselastizität der Nachfrage misst, wie stark die nachgefragte Menge auf Preisänderungen reagiert. Formal: prozentuale Mengenänderung dividiert durch prozentuale Preisänderung. Werte über 1 bedeuten elastische Nachfrage (starke Reaktion, z.B. Luxusgüter), Werte unter 1 unelastische Nachfrage (schwache Reaktion, z.B. Insulin). Die Elastizität hängt von Substituten, Budgetanteil und Zeithorizont ab.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das wäre die Einkommenselastizität, nicht die Preiselastizität der Nachfrage.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Sensitivität der Nachfragemenge auf Preisänderungen — das ist die Definition.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das betrifft die Anpassungsgeschwindigkeit, nicht die Preiselastizität.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das ist die Preiselastizität des Angebots, nicht der Nachfrage.' },
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
  console.log(`Session 18 done.`)
  console.log(`  Verarbeitet diese Session: ${done + skip} (done=${done}, skip=${skip})`)
  console.log(`  Total: ${total}/${totalAll} (${pct}%)`)
  if (skipped.length > 0) console.log(`  Skip-Fragen: ${skipped.join(', ')}`)
  console.log(`  Verteilung: 50 VWL/mc`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
