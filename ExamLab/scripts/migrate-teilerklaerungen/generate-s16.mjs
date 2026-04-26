#!/usr/bin/env node
/**
 * Session 16: 50 VWL-Fragen (alle mc).
 * Erste Hälfte des 100er-Batches nach Fachbereich → Typ → ID.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  { id: 'a8474216-ea0b-484c-b20a-eeb64a30c0e3', fachbereich: 'VWL', musterlosung: 'Eine Steuer verzerrt den Markt umso weniger, je weniger Konsumenten und Produzenten ihre Mengen anpassen. Bei unelastischer Nachfrage oder unelastischem Angebot bleibt die gehandelte Menge nahezu konstant — der Wohlfahrtsverlust ist klein. Steuern auf elastische Güter führen dagegen zu starken Mengenrückgängen und grossen Verzerrungen. Klassische Beispiele für unelastische Steuerobjekte sind Tabak, Benzin und Strom.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Geringe Mengenreaktion bedeutet kleine Verzerrung und damit kleinen Wohlfahrtsverlust.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Hohe Elastizitäten führen gerade zu grossen Mengenanpassungen und grossem Verlust.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Luxusgüter sind meist sehr elastisch — Konsumenten weichen leicht aus.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Importeigenschaft sagt nichts über die Elastizität aus.' },
  ] },
  { id: 'a84818ea-4d77-4663-b6aa-8add23281221', fachbereich: 'VWL', musterlosung: 'Monetaristen wie Milton Friedman empfehlen eine regelgebundene Geldpolitik. Die Geldmenge soll stetig und voraussagbar wachsen, orientiert am langfristigen realen Wirtschaftswachstum. Diskretionäre Eingriffe der Zentralbank wirken aus monetaristischer Sicht mit zu langen und unsicheren Verzögerungen und destabilisieren so eher, als dass sie glätten. Stabilität durch Regel statt durch Aktivismus ist der Kerngedanke.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Eine Verdopplung wäre stark expansiv und würde Inflation auslösen — gerade nicht regelgebunden.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Monetaristen schaffen die Notenbank nicht ab; sie soll nur regelgebunden agieren.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Aktivistische Konjunktursteuerung lehnen Monetaristen ausdrücklich ab.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Stetige, regelgebundene Geldmengenausweitung gemäss langfristigem Trendwachstum.' },
  ] },
  { id: 'a897391d-381c-40db-9231-a2efa18fb66f', fachbereich: 'VWL', musterlosung: 'Geld erleichtert den Tausch und macht Spezialisierung und Arbeitsteilung erst praktikabel. Ohne Geld müsste in einer Tauschwirtschaft jeder Anbieter direkte Tauschpartner mit übereinstimmenden Bedürfnissen finden. Die hochspezialisierte moderne Wirtschaft mit globalen Wertschöpfungsketten wäre auf dieser Basis nicht funktionsfähig. Geld ist somit Voraussetzung für den heutigen Wohlstand, nicht ein blosser Komfort.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Geld erlaubt Spezialisierung — der Lohn wird flexibel in beliebige Güter eingetauscht.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Geld funktioniert über Vertrauen, nicht primär über staatliche Verfügung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Status erklärt höchstens individuelles Verhalten, nicht die ökonomische Notwendigkeit von Geld.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Eigenproduktion aller Güter ist physisch unmöglich, nicht rechtlich verboten.' },
  ] },
  { id: 'a8aaffe3-2e68-49cb-ae41-4863c810e63a', fachbereich: 'VWL', musterlosung: 'Die Tragik der Allmende beschreibt die Übernutzung gemeinsamer Ressourcen. Jeder einzelne Nutzer maximiert seinen privaten Vorteil, während die Kosten der Übernutzung — Erschöpfung, Verschmutzung — von allen gemeinsam getragen werden. Klassisches Beispiel ist die überweidete Gemeinschaftsweide. Das Konzept erklärt zentrale Umweltprobleme wie Überfischung der Meere oder den Klimawandel und begründet Eingriffe wie Quoten, Privatisierung oder Regulierung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Privatisierung ist eine mögliche Lösung, aber nicht die Definition des Problems.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Genau das Gegenteil — gemeinsames Eigentum führt zu Übernutzung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Privater Nutzen, kollektive Kosten — die Ressource wird übernutzt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Allmende meint die Gemeinschaftsweide, nicht das BIP.' },
  ] },
  { id: 'a93c9821-cf9c-4580-ac5e-4a89191439b4', fachbereich: 'VWL', musterlosung: 'Geld funktioniert nur, solange Menschen darauf vertrauen. Viele gut gemachte Fälschungen würden dieses Vertrauen erschüttern: Geschäfte müssten jede Note aufwendig prüfen, würden sie nur noch zögerlich annehmen. Die Tauschmittelfunktion wäre beeinträchtigt, der Übergang zu bargeldlosen Alternativen beschleunigt. Deshalb investiert die Schweizerische Nationalbank stark in fälschungssichere Banknoten mit zahlreichen Sicherheitsmerkmalen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Mehr Geld zu drucken würde das Problem verschärfen, nicht lösen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Sinkende Akzeptanz aufgrund schwindenden Vertrauens und höheren Prüfaufwands.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Mehr Geld im Umlauf würde tendenziell Inflation auslösen, nicht Deflation.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Wirtschaft beruht zentral auf dem Vertrauen in echtes Geld.' },
  ] },
  { id: 'aa62b282-dea2-4652-80e5-350301ba6a4d', fachbereich: 'VWL', musterlosung: 'Das Coase-Theorem besagt, dass externe Effekte effizient gelöst werden können, wenn Eigentums- und Klagerechte klar definiert und die Transaktionskosten gering sind. Die Betroffenen können dann freiwillig verhandeln und Kompensationen vereinbaren — ohne staatliche Regulierung. Beispiel: Anwohner verhandeln direkt mit einem lärmenden Betrieb. In der Praxis sind Transaktionskosten oft hoch und blockieren diese Lösung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Externe Effekte treten auch in Wettbewerbsmärkten auf, nicht nur bei Monopolen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Coase argumentiert genau umgekehrt — der Staat muss nicht immer eingreifen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Markt kann externe Effekte unter Coase-Bedingungen sehr wohl lösen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Klare Eigentumsrechte plus geringe Transaktionskosten ermöglichen Verhandlungslösungen.' },
  ] },
  { id: 'aa8c1e58-c768-4576-9ad5-18febc879fb0', fachbereich: 'VWL', musterlosung: 'Liegt der Marktpreis P₁ über dem Gleichgewichtspreis P*, bieten die Produzenten eine Menge Q_A an, die Konsumenten fragen aber nur Q_N nach. Die Differenz Q_A − Q_N ist der Angebotsüberschuss. In einem freien Markt wachsen die Lagerbestände, Produzenten senken den Preis, das Gleichgewicht stellt sich wieder her. Bei einem staatlich vorgegebenen Mindestpreis bleibt der Überschuss bestehen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Bereits eine kleine Abweichung erzeugt einen Überschuss — der Markt ist nicht im Gleichgewicht.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Bei P₁ > P* ist die angebotene Menge grösser als die nachgefragte.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Der Preis bewegt sich auf der Kurve, sie verschiebt sich nicht wegen eines Preises.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Nachfrageüberschuss entsteht bei Preisen unter dem Gleichgewicht.' },
  ] },
  { id: 'aaeb2f19-d581-458a-aea0-5a1972c339c0', fachbereich: 'VWL', musterlosung: 'Befürworterinnen des bedingungslosen Grundeinkommens argumentieren mit dem Abbau der Armutsfalle (Erwerbsarbeit lohnt sich wieder), mit grösserer individueller Freiheit (Pflege, Weiterbildung, unbezahlte Arbeit) und mit weniger Bürokratie als im heutigen Sozialsystem. Günstiger als das bestehende System ist das BGE jedoch nicht — je nach Höhe würden die Gesamtkosten deutlich steigen. Genau dieses Finanzierungsproblem führte 2016 zur Ablehnung in der Schweiz.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Ein universeller Sockelbetrag macht jede Erwerbsarbeit netto attraktiver.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Wegfallender Erwerbsdruck eröffnet Spielräume für andere Tätigkeiten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Eine universelle Leistung ersetzt viele bedarfsgeprüfte Einzelprogramme.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Je nach Höhe wäre das BGE teurer; Finanzierung war 2016 das zentrale Gegenargument.' },
  ] },
  { id: 'abaf3645-b0e1-4525-82aa-33319807a0cd', fachbereich: 'VWL', musterlosung: 'Der Geldschöpfungsmultiplikator beschreibt das Verhältnis zwischen der Notenbankgeldmenge M0 und den breiteren Geldaggregaten wie M1, M2 oder M3. Geschäftsbanken können aus einer gegebenen Menge Notenbankgeld durch Kreditvergabe ein Vielfaches an Buchgeld schaffen. Der Multiplikator ist deshalb grösser als 1 und hängt von Mindestreserven, Bargeldhaltung und Liquiditätspräferenz der Banken ab.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das beschreibt den Interbanken-Zinssatz (z.B. SARON), nicht den Multiplikator.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Druckrate ist eine separate Grösse und bezeichnet nicht das Verhältnis zwischen Aggregaten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das Verhältnis Bargeld zu Buchgeld ist eine andere Kennzahl (Bargeldquote).' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Faktor zwischen breiterer Geldmenge und Notenbankgeldmenge.' },
  ] },
  { id: 'abec7d25-73b7-4239-b313-c055787c7fa1', fachbereich: 'VWL', musterlosung: 'Das Minimumprinzip — auch Sparsamkeitsprinzip — verlangt: Ein bestimmtes Ergebnis (Output) soll mit möglichst geringem Aufwand (Input) erreicht werden. Beispiel: Eine Note 5 mit minimaler Lernzeit. Sein Gegenstück ist das Maximumprinzip: Aus einem fixen Input maximalen Output erzielen. Beide sind Sonderfälle des Optimumprinzips, das Input und Output gleichzeitig optimal aufeinander abstimmt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Pauschal wenig zu arbeiten ist Faulheit, nicht das ökonomische Prinzip.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Fixiertes Ergebnis bei minimalem Aufwand ist die exakte Definition.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Produktion auf null zu fahren ist kein wirtschaftliches Prinzip.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Billig kaufen vermischt Input und Qualität — keine korrekte Definition.' },
  ] },
  { id: 'ac1a7ef5-f4af-461e-b356-59790c2605f8', fachbereich: 'VWL', musterlosung: 'Warengeld besitzt einen eigenen Materialwert: Goldmünzen, Silbermünzen, Salz, Muscheln. Papiergeld dagegen hat praktisch keinen Materialwert — eine 100-Franken-Note kostet weniger als 40 Rappen in der Produktion. Es funktioniert nur, weil alle Beteiligten darauf vertrauen, dass es als Zahlungsmittel akzeptiert wird. Diese Vertrauensbasis ist deutlich anfälliger als der direkte Materialwert von Warengeld.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Unterscheidung liegt im Materialwert, nicht im Emittenten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Papiergeld wird gerade für grosse Beträge gut eingesetzt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Warengeld ist historisch deutlich älter als Papiergeld.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Warengeld hat Materialwert, Papiergeld lebt vom Vertrauen.' },
  ] },
  { id: 'ac318ce4-8faf-4577-8b78-91b99a5ce72c', fachbereich: 'VWL', musterlosung: 'Auf dem Arbeitsmarkt bieten die Arbeitnehmenden ihre Arbeitskraft an, die Unternehmen fragen sie nach. Ein Mindestlohn oberhalb des Gleichgewichts erhöht die angebotene Menge (mehr Personen wollen arbeiten), senkt aber die nachgefragte (Unternehmen stellen weniger ein). Die Differenz ist ein Angebotsüberschuss an Arbeit — also Arbeitslosigkeit. Die Wirkung ist umso stärker, je höher der Mindestlohn über dem Gleichgewicht liegt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Mehr Angebot bei weniger Nachfrage ergibt Arbeitslosigkeit.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Nachfrageüberschuss entsteht bei Höchstpreisen unter dem Gleichgewicht.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Ein bindender Mindestpreis stört das Gleichgewicht definitionsgemäss.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Mindestlohn ist ein Preisuntergrenze; Löhne können nicht legal darunter fallen.' },
  ] },
  { id: 'ac7711c9-e5d8-42d4-9111-8cbc51004eff', fachbereich: 'VWL', musterlosung: 'Geld muss haltbar sein, damit es nicht verdirbt; knapp, damit es seinen Wert behält; und teilbar, damit unterschiedliche Beträge dargestellt werden können. Hinzu kommen Eigenschaften wie Transportierbarkeit und Erkennbarkeit. Hohes Gewicht ist dagegen kein Vorteil — im Gegenteil: Geld soll möglichst leicht zu transportieren sein. Historische Beispiele wie Goldmünzen, Muscheln oder moderne Banknoten erfüllen diese Eigenschaften unterschiedlich gut.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Haltbarkeit verhindert Wertverlust durch Verderb oder Zerfall.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Schweres Geld ist unpraktisch; gewünscht ist leichte Transportierbarkeit.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Knappheit sichert den Wert — beliebig vermehrbares Geld verliert ihn.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Teilbarkeit erlaubt das Abbilden beliebiger Beträge.' },
  ] },
  { id: 'ac94c1e0-0ad7-4e7b-b681-d4d69190c181', fachbereich: 'VWL', musterlosung: 'Beim Transfer Pricing setzen multinationale Konzerne die Verrechnungspreise zwischen ihren Tochtergesellschaften strategisch. Die Tochter im Hochsteuerland zahlt überhöhte Preise und realisiert tiefe Gewinne; die Tochter im Tiefsteuerland verrechnet hohe Preise und weist hohe Gewinne aus. So wird der konzernweite Gewinn dort versteuert, wo der Steuersatz am tiefsten ist. Die OECD versucht mit dem Fremdvergleichsgrundsatz dagegen vorzugehen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Konzerninterne Preise verschieben Gewinne ins Tiefsteuerland.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Doppelte Steuererklärung ist nicht das Konzept; es geht um Preisgestaltung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gewinnausschüttung an Aktionäre ist eine andere, spätere Stufe.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Währungsumrechnung ist Buchhaltung, nicht Steueroptimierung.' },
  ] },
  { id: 'aca510ec-d3f9-4dc0-a835-f39df852cc61', fachbereich: 'VWL', musterlosung: 'Bei der Einzahlung von Bargeld auf ein Sparkonto sinkt der Bargeldumlauf — ein Bestandteil von M1. Die Spareinlagen steigen im gleichen Umfang. Da M2 die Spareinlagen einschliesst, gleichen sich die Veränderungen in M2 aus, und M2 bleibt unverändert. M3 enthält M2 sowie weitere Termineinlagen und bleibt damit ebenfalls unverändert. Die monetäre Basis M0 ist durch die Einzahlung nicht betroffen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: M1 sinkt, weil Bargeld aus dem Umlauf in eine Spareinlage wandert.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: M2 = M1 + Spareinlagen — der Rückgang in M1 wird kompensiert.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: M3 enthält M2 und ändert sich entsprechend nicht.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: M1 sinkt durch die Einzahlung, es steigt nicht.' },
  ] },
  { id: 'ae1d4e52-bbdf-4c23-8941-4baf84558cff', fachbereich: 'VWL', musterlosung: 'Der Arbeitseinsatz hat eine natürliche Obergrenze — den sogenannten Niveaueffekt. Pro Person sind maximal 24 Stunden täglich verfügbar, die Erwerbsquote kann nicht über 100 Prozent steigen. Damit lässt sich «mehr Arbeit» nur einmalig steigern, nicht stetig. Dauerhaftes Wirtschaftswachstum erfordert deshalb Produktivitätsgewinne durch besseres Sachkapital, Humankapital und Technologie.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Tageszeit und Erwerbsquote setzen eine harte Obergrenze (Niveaueffekt).' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Arbeitsplätze sind nachfrageseitig variabel, das ist nicht die Grenze.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Bevölkerungsentwicklung ist ein weiterer Faktor, aber nicht der gemeinte Niveaueffekt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Gesundheitliche Aspekte sind zweitrangig gegenüber dem fundamentalen Zeitlimit.' },
  ] },
  { id: 'aec5007d-5a07-4cf4-8bfa-3a5866a0c591', fachbereich: 'VWL', musterlosung: 'Traditionelle Regulierung steuert Verhalten über Verbote, Gebote und Strafen — beispielsweise Rauchverbote oder Tempolimits. Nudging dagegen verändert die Entscheidungsumgebung so, dass Menschen tendenziell die gewünschte Wahl treffen, ohne Wahlfreiheit oder Anreize einzuschränken. Klassische Beispiele sind die Voreinstellung «Organspende ja» oder die Platzierung gesunder Lebensmittel auf Augenhöhe. Nudging stützt sich auf Erkenntnisse der Verhaltensökonomie.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Subtile Verhaltenslenkung ohne Verbote oder finanzielle Anreize.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Nudges sind oft günstiger als klassische Regulierung, nicht teurer.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Nudging unterscheidet sich grundlegend in Mittel und Wahlfreiheit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Nudging wirkt auf alle Menschen, weil alle systematischen Heuristiken folgen.' },
  ] },
  { id: 'afb5182e-10c3-4203-8738-11ba5cc2ee45', fachbereich: 'VWL', musterlosung: 'Der Arbeitsmarkt reagiert mit mehreren Monaten Verzögerung auf Konjunkturveränderungen. Bei einem Abschwung setzen Unternehmen zuerst Kurzarbeit ein, bauen Überstunden ab und stoppen Neueinstellungen, bevor sie entlassen. Im Aufschwung werden bestehende Mitarbeitende mehr beschäftigt, bevor neue Stellen geschaffen werden. Deshalb gilt die Arbeitslosenquote als Spätindikator und nicht als Frühindikator der Konjunktur.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die SECO-Quote wird monatlich publiziert, nicht jährlich.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das SECO erhebt die Arbeitslosenquote, nicht die SNB.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Verzögerte Reaktion über Puffer wie Kurzarbeit macht sie zum Spätindikator.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Quote misst alle Altersgruppen, nicht nur die Jugendarbeitslosigkeit.' },
  ] },
  { id: 'b017dab1-b895-434f-a3d1-74c9d79df93a', fachbereich: 'VWL', musterlosung: 'Moral Hazard meint übermässige Inanspruchnahme von Versicherungsleistungen, weil Versicherte die Kosten nicht selbst tragen. Franchise und Kostenbeteiligung lassen die Versicherten einen Teil der Kosten spüren und bremsen unnötige Arztbesuche. Wahlfranchisen mit Prämienrabatt verstärken den Anreiz zusätzlich. Das Obligatorium dagegen löst ein anderes Problem — die adverse Selektion — und wirkt nicht direkt gegen Moral Hazard.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Selbstbehalt macht jede Inanspruchnahme spürbar und bremst sie.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: 10-Prozent-Beteiligung schafft auch oberhalb der Franchise einen Sparanreiz.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das Obligatorium adressiert adverse Selektion, nicht Moral Hazard.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Höhere Wahlfranchise gegen Prämienrabatt verstärkt den Eigenanreiz.' },
  ] },
  { id: 'b01d3c25-499c-4b29-9c11-18b24fe825c6', fachbereich: 'VWL', musterlosung: 'Die Coronapandemie hat die Kehrseite der Arbeitsteilung sichtbar gemacht: Hohe Spezialisierung und globale Lieferketten schaffen Abhängigkeiten, ein gestörtes Glied bringt das ganze System ins Wanken. Das macht Arbeitsteilung nicht falsch — die Effizienzgewinne überwiegen deutlich. Es zeigt aber die Notwendigkeit von Risikomanagement, Diversifikation der Bezugsquellen und strategischen Reserven für kritische Güter.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Auch internationale Arbeitsteilung bringt grosse Wohlstandsgewinne.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Vorteile bleiben in normalen Zeiten klar überwiegend; Abschaffung wäre teuer.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Produktivitätsgewinne sind unbestritten; die Engpässe zeigen Verletzlichkeit, nicht Wirkungslosigkeit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Effizienz und Verletzlichkeit sind die zwei Seiten internationaler Arbeitsteilung.' },
  ] },
  { id: 'b067794e-29dd-4a0c-a88a-b71aea990b9b', fachbereich: 'VWL', musterlosung: 'Eine realistische Versicherungsprämie deckt drei Komponenten: den erwarteten Schaden, die Verwaltungskosten und einen Sicherheits- bzw. Gewinnaufschlag. Der erwartete Schaden allein wäre nicht kostendeckend. Eine Prämie unter dem Schadenserwartungswert führt langfristig in den Konkurs. Eine deutlich überhöhte Prämie wäre dagegen am Markt nicht wettbewerbsfähig. CHF 260 bei CHF 200 Erwartungsschaden entspricht einem realistischen Aufschlag von 30 Prozent.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: 150 Prozent Aufschlag wäre marktfremd und nicht konkurrenzfähig.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Unterhalb des Schadenserwartungswerts arbeitet der Versicherer defizitär.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Genau der Schaden deckt keine Verwaltungskosten und keinen Gewinn.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Schadenserwartungswert plus Verwaltungs- und Gewinnaufschlag.' },
  ] },
  { id: 'b0ac4519-c4df-45c0-9788-526c5ca6a361', fachbereich: 'VWL', musterlosung: 'Die Volkswirtschaftslehre hat vier zentrale Aufgaben: Beschreiben (was passiert?), Erklären (warum passiert es?), Prognostizieren (was wird passieren?) und Beeinflussen (was sollte getan werden?). Beispiel: Die Arbeitslosigkeit steigt — weil die Nachfrage einbricht — sie wird weiter steigen — der Staat sollte konjunkturpolitisch gegensteuern. Beschreiben und Erklären sind positive, Beeinflussen ist normative VWL.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Statistik ist Werkzeug, nicht der Aufgabenkreis der VWL.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Gesetze und Steuern legt die Politik fest, nicht die Wissenschaft.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das ist die Aufgabe der Betriebswirtschaft, nicht der VWL.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Beschreiben, Erklären, Prognostizieren und Beeinflussen.' },
  ] },
  { id: 'b1d0978f-cb48-4925-bff7-c9d0d07e686c', fachbereich: 'VWL', musterlosung: 'Die Notenbankgeldmenge M0 — auch monetäre Basis genannt — besteht aus dem Notenumlauf und den Giroguthaben inländischer Geschäftsbanken bei der Schweizerischen Nationalbank. Münzen gehören nicht dazu, da sie eine Verpflichtung des Bundes und nicht der SNB darstellen. M0 ist die Basis, auf der das Geschäftsbankensystem durch Kreditvergabe die breiteren Aggregate M1 bis M3 schöpft.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Notenumlauf plus Sichtguthaben der Geschäftsbanken bei der SNB.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Münzen sind Bundes-, nicht SNB-Verpflichtung — sie zählen nicht zu M0.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Bankguthaben gehören zu M1/M2/M3, nicht zur monetären Basis.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Spareinlagen sind Bestandteil von M2, nicht von M0.' },
  ] },
  { id: 'b22dad54-14f7-4bad-9a8f-15bf770c483a', fachbereich: 'VWL', musterlosung: 'Das BIP lässt sich auf drei Wegen ermitteln. Der Produktionsansatz summiert die Wertschöpfung aller Sektoren. Der Einkommensansatz summiert alle erzielten Einkommen — Löhne, Gewinne, Zinsen, Mieten — plus Abschreibungen und indirekte Steuern. Der Verwendungsansatz erfasst die Endverwendung als Konsum, Investitionen, Staatsausgaben und Nettoexporte (C + I + G + NX). Alle drei Ansätze führen rechnerisch zum identischen BIP-Wert.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Konsum und Sparen sind Verwendungskategorien, keine eigenen Berechnungsmethoden.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Brutto, Netto und Real sind Konzepte, nicht die drei Ansätze.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Aussenhandel ist nur ein Bestandteil des Verwendungsansatzes.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Produktionsansatz, Einkommensansatz und Verwendungsansatz.' },
  ] },
  { id: 'b231ee87-3b05-4cde-8c3d-ad485d8cbd3f', fachbereich: 'VWL', musterlosung: 'Im Spielversuch BOB übernimmt der Buchstabe X die Funktion eines allgemein akzeptierten Tauschmittels. Wird X konsequent eingesetzt, erzielen die Spielenden im Durchschnitt rund 110 Punkte gegenüber etwa 80 Punkten ohne X. Der Grund liegt in der Reduktion von Tauschproblemen: Die Spielenden müssen keinen direkten Tauschpartner mit übereinstimmenden Bedürfnissen mehr finden. X erleichtert den Tausch wie Geld in der realen Wirtschaft.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Mit X werden Tauschhindernisse abgebaut und damit mehr Punkte erzielt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Es geht primär um die Punktzahl, nicht um die Spieldauer.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Alle Spielenden profitieren, weil X den Markt insgesamt effizienter macht.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Geld bzw. X reduziert Reibungsverluste und steigert die Punktzahl.' },
  ] },
  { id: 'b23932aa-0dc7-42e1-a4a5-cd28ff408cf2', fachbereich: 'VWL', musterlosung: 'Die klassische Konzeption setzt auf drei Anpassungsmechanismen: flexible Güterpreise gleichen Angebot und Nachfrage am Gütermarkt aus, flexible Löhne sorgen für ein Gleichgewicht am Arbeitsmarkt, flexible Zinsen bringen Sparen und Investieren am Kapitalmarkt zur Deckung. Staatliche Preiskontrollen lehnen die Klassiker ab, weil sie genau diese Anpassungsmechanismen blockieren. Märkte räumen sich aus klassischer Sicht von selbst.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Flexible Güterpreise räumen den Gütermarkt klassisch.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Flexible Löhne führen den Arbeitsmarkt ins Gleichgewicht.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Klassiker lehnen Preiskontrollen ab; sie stören die Anpassung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Flexible Zinsen koordinieren Sparen und Investieren am Kapitalmarkt.' },
  ] },
  { id: 'b250000a-ec9a-4b1d-94d4-6e221b319b0e', fachbereich: 'VWL', musterlosung: 'Libertarians wie Robert Nozick, Friedrich von Hayek oder Milton Friedman vertreten eine reine Marktwirtschaft. Ökonomische Freiheit ist ihnen oberster Wert, staatliche Umverteilung lehnen sie ab — sie sehen darin einen Eingriff in individuelle Eigentumsrechte. Marktergebnisse können in ihrer Sicht weder gerecht noch ungerecht sein, da sie aus freiwilligen Tauschakten entstehen. Der Staat soll sich auf Schutzfunktionen beschränken.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Planwirtschaft widerspricht dem libertären Marktverständnis fundamental.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Soziale Marktwirtschaft verlangt Umverteilung — von Libertarians abgelehnt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Sozialismus ist das genaue Gegenstück zur libertären Position.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Reine Marktwirtschaft mit minimalem Staat.' },
  ] },
  { id: 'b25a8e95-d8c3-4cab-a1f3-f91f664f878b', fachbereich: 'VWL', musterlosung: 'Strukturelle Arbeitslosigkeit entsteht durch langfristige Veränderungen der Wirtschaftsstruktur. Technologischer Wandel automatisiert Tätigkeiten, Produktionsstandorte werden ins Ausland verlagert, ganze Branchen schrumpfen, weil sich Konsumpräferenzen ändern. Betroffene Erwerbstätige verfügen oft nicht über die geforderten neuen Qualifikationen. Ein vorübergehender Auftragsrückgang in einer Rezession führt dagegen zu konjunktureller Arbeitslosigkeit, nicht zu struktureller.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Automatisierung verändert dauerhaft die Nachfrage nach Qualifikationen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Vorübergehender Rückgang in der Rezession ist konjunkturell, nicht strukturell.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Standortverlagerung ist klassisches Strukturphänomen der Globalisierung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Branchenverschiebungen sind langfristig und damit strukturell.' },
  ] },
  { id: 'b28d1906-1ef8-4bdf-a234-15f974aba4c6', fachbereich: 'VWL', musterlosung: 'Reale Schocks sind unerwartete Störungen in der realen Wirtschaft — auf der Produktions- oder Nachfrageseite. Beispiele sind eine Ölknappheit nach einem Krieg, technologische Innovationen wie der Computer oder Naturkatastrophen wie eine Überschwemmung. Eine Zinssenkung der Nationalbank ist dagegen ein geldpolitisches Instrument und damit ein monetärer Schock — nicht ein realer. Die Unterscheidung prägt die Konjunkturanalyse seit der Real-Business-Cycle-Theorie.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Ölknappheit ist ein klassischer realer Angebotsschock.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Eine Zinssenkung ist ein monetärer, nicht ein realer Schock.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Technologische Innovationen sind reale Angebotsschocks.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Naturkatastrophen treffen die reale Produktions- und Lieferkette.' },
  ] },
  { id: 'b37e4fec-07a4-4f35-bb8f-36e330ddec4a', fachbereich: 'VWL', musterlosung: 'Working Poor sind Erwerbstätige, deren Einkommen aus Arbeit nicht ausreicht, um über der Armutsgrenze zu leben. Sie arbeiten Vollzeit oder annähernd Vollzeit, leben aber dennoch in finanzieller Knappheit. In der Schweiz besonders betroffen sind Alleinerziehende, kinderreiche Familien, Personen ohne Berufsabschluss sowie Beschäftigte in Tieflohnbranchen wie Gastronomie oder persönlichen Dienstleistungen. Sozialhilfe und Ergänzungsleistungen versuchen, die Lücke zu schliessen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Working Poor arbeiten oft Vollzeit; das Pensum ist nicht definitorisch.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Zwischenverdienst betrifft Arbeitslose, nicht Working Poor.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Working Poor verzichten nicht freiwillig — der erzielbare Lohn ist tief.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Erwerbstätige unterhalb der Armutsgrenze trotz Arbeit.' },
  ] },
  { id: 'b38a98f6-ed5c-4567-b343-441bfd0f306c', fachbereich: 'VWL', musterlosung: 'Auf dem Arbeitsmarkt wissen Bewerber typischerweise mehr über ihre Fähigkeiten als die Arbeitgeber. Diese Informationsasymmetrie kann zu adverser Selektion führen. Zeugnisse und Zertifikate signalisieren Qualifikation (Signalling nach Spence), Probezeiten erlauben dem Arbeitgeber, die tatsächliche Leistung zu beobachten (Screening). Beide Mechanismen reduzieren das Informationsgefälle und ermöglichen produktive Arbeitsverhältnisse, die sonst nicht zustande kämen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ohne Qualifikationsanforderungen würde sich die adverse Selektion verschärfen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Mindestlohn betrifft Lohnhöhe, nicht Informationsasymmetrie.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Ein Verbot würde die Informationsbeschaffung blockieren — kontraproduktiv.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Signalling und Screening reduzieren die Informationsasymmetrie.' },
  ] },
  { id: 'b3ae9dd0-daf1-4faa-8cfd-26367e5170e2', fachbereich: 'VWL', musterlosung: 'Lenkungssteuern verteuern gesellschaftlich unerwünschtes Verhalten und sollen es so reduzieren. Tabaksteuer (Konsumdämpfung), CO₂-Abgabe (Klimaschutz) und Alkoholsteuer (Konsumlenkung) verfolgen alle einen Lenkungszweck — neben dem fiskalischen Nebeneffekt. Die Einkommenssteuer dagegen dient primär dem Fiskal- und Umverteilungszweck. Sie soll Einkommen abschöpfen, nicht Verhalten lenken; ihre Arbeitsanreizwirkung wird deshalb möglichst gering gehalten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Verteuert das Rauchen und reduziert den Konsum.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Einkommenssteuer dient Fiskal- und Umverteilungszweck, nicht Lenkung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Bepreist CO₂-Emissionen und wirkt klimapolitisch lenkend.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Verteuert Alkohol und dämpft den Konsum.' },
  ] },
  { id: 'b53f8eb5-35bc-4eb2-858e-3363f9c9f5d0', fachbereich: 'VWL', musterlosung: 'Die Goldene Finanzierungsregel besagt, dass die staatliche Verschuldung die Höhe der Investitionen nicht übersteigen soll. Kredite werden also nur für investive Zwecke wie Infrastruktur oder Bildung aufgenommen, weil diese künftiges Wachstum und damit höhere Steuereinnahmen schaffen. Konsumtive Ausgaben — Personal, Sozialleistungen, Subventionen — sollen aus laufenden Einnahmen finanziert werden. Andernfalls entsteht eine Schuldenlast ohne entsprechenden Vermögenszuwachs.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Eine hälftige Aufteilung ist keine Regel der Finanzierung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Defizite nur in Höhe der investiven Ausgaben.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Eine starre jährliche Reduktion entspricht eher der Schuldenbremse.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Goldreserven der SNB stehen in keinem Bezug zur Finanzierungsregel.' },
  ] },
  { id: 'b5b7adaa-d31a-4f20-989d-3219daa01cb5', fachbereich: 'VWL', musterlosung: 'Der Landesindex der Konsumentenpreise (LIK) misst die Preisentwicklung eines repräsentativen Warenkorbs für einen durchschnittlichen Schweizer Haushalt. Der Warenkorb umfasst rund 1000 Güter und Dienstleistungen, gewichtet nach ihrem Anteil am Konsum. Der Index dient als Mass für die Inflation und als Berechnungsbasis für Lohn- und Mietanpassungen. Erhoben wird er monatlich vom Bundesamt für Statistik (BFS).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Repräsentativer Warenkorb eines durchschnittlichen Haushalts.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das BIP pro Kopf wird gesondert berechnet.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Wechselkurs-Kaufkraft misst der reale effektive Wechselkurs.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Notenumlauf ist eine Geldmengen-Kennzahl, kein Preisindex.' },
  ] },
  { id: 'b6ca6a22-0fcf-463d-86c9-d0f4abe30927', fachbereich: 'VWL', musterlosung: 'Die soziale Wohlfahrt — Sozialversicherungen, Sozialhilfe, Ergänzungsleistungen, Subventionen für Krankenkassenprämien — bildet mit rund einem Drittel der gesamten Staatsausgaben den grössten Ausgabenblock des Bundes, der Kantone und Gemeinden zusammen. Bildung, Verkehr und allgemeine Verwaltung folgen mit deutlich kleineren Anteilen. Verteidigung macht in der Schweiz nur einen kleinen Bruchteil aus.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Verteidigung ist in der Schweiz ein vergleichsweise kleiner Posten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Bildung ist gross, aber kleiner als die soziale Wohlfahrt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Verkehr und Infrastruktur folgen erst hinter Soziales und Bildung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Soziale Wohlfahrt macht rund einen Drittel der Staatsausgaben aus.' },
  ] },
  { id: 'b784adec-2135-44a0-b5f6-b54e36500d47', fachbereich: 'VWL', musterlosung: 'Eine Volkswirtschaft kann auf zwei grundsätzliche Arten wachsen: durch mehr Arbeitsstunden (mehr Erwerbstätige, höhere Erwerbsquote, Zuwanderung) oder durch eine höhere Arbeitsproduktivität (mehr Sachkapital, besseres Humankapital, technischer Fortschritt). Für den Wohlstand pro Kopf ist primär die Produktivität entscheidend — sie erlaubt mehr Output pro geleisteter Stunde. Mehr Arbeit allein stösst rasch an natürliche Grenzen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Höhere Preise sind Inflation, nicht reales Wachstum.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Aussenhandel verändert die Verwendung, ist aber nicht die fundamentale Quelle.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Konsum und Sparen sind Verwendungsentscheidungen, keine Wachstumsquellen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Mehr Arbeitsstunden oder höhere Produktivität pro Stunde.' },
  ] },
  { id: 'b8213f56-e35e-4e03-8e9a-cfca24bef9bc', fachbereich: 'VWL', musterlosung: 'Sparen die Haushalte plötzlich deutlich mehr, sinkt der Konsum und damit die Nachfrage am Gütermarkt. Unternehmen verkaufen weniger, reduzieren Produktion und Beschäftigung, zahlen tiefere Löhne — das Einkommen sinkt und löst eine zweite Welle reduzierter Nachfrage aus. Dieses Phänomen heisst Sparparadoxon: Was für den Einzelnen vernünftig ist (sparen), kann gesamtwirtschaftlich zu einem Abschwung führen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Sparen ist gerade kein Konsum und damit keine direkte Nachfrage am Gütermarkt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Banken können das gesparte Geld nur verleihen, wenn es Investitionsbedarf gibt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Antizyklische Staatspolitik ist möglich, geschieht aber nicht automatisch.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Sparparadoxon — sinkende Nachfrage führt zu sinkender Produktion und Einkommen.' },
  ] },
  { id: 'b9e5b0db-2c92-42b7-b484-9afa8fad0bc1', fachbereich: 'VWL', musterlosung: 'Geld muss bestimmte Eigenschaften erfüllen: Haltbarkeit, Transportierbarkeit, Teilbarkeit, Knappheit und Erkennbarkeit. Wassermelonen scheitern an der Haltbarkeit (sie verderben rasch), Baumstämme an Transportierbarkeit und Teilbarkeit. Historisch erfüllten Muscheln, Edelmetalle, Salz oder Zigaretten diese Bedingungen besser, weshalb sie als Geldformen verwendet wurden. Heute übernehmen Banknoten und Buchgeld diese Funktionen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Verwendung für andere Zwecke (Konsum) wäre eher Vorteil als Nachteil.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Materialwert ist gerade ein Vorteil von Warengeld, nicht der Disqualifikator.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Wassermelonen sind nicht selten — Knappheit ist nicht das Hauptproblem.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Haltbarkeit, Transportierbarkeit und Teilbarkeit sind ungenügend.' },
  ] },
  { id: 'bb30ac02-266f-4554-bee5-2428d8cf5172', fachbereich: 'VWL', musterlosung: 'Eine Steuer reduziert die gehandelte Menge von Q* auf Q_t. Die Flächen C und E bilden den Wohlfahrtsverlust (Deadweight Loss): Fläche C ist die entgangene Konsumentenrente, Fläche E die entgangene Produzentenrente. Diese Tauschgewinne gehen an niemanden — weder Konsumenten noch Produzenten noch Staat. Die Flächen B und D dagegen werden zu Steuereinnahmen umverteilt, A und F bleiben den Akteuren erhalten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Fläche A ist die verbleibende Konsumentenrente, kein Verlust.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Fläche B ist der Steueranteil aus der Konsumentenrente, kein Wohlfahrtsverlust.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Fläche C ist die entgangene Konsumentenrente — Deadweight Loss.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Fläche D ist der Steueranteil aus der Produzentenrente, kein Verlust.' },
    { feld: 'optionen', id: 'opt-4', text: 'Korrekt: Fläche E ist die entgangene Produzentenrente — Deadweight Loss.' },
    { feld: 'optionen', id: 'opt-5', text: 'Falsch: Fläche F ist die verbleibende Produzentenrente, kein Verlust.' },
  ] },
  { id: 'bb973522-e2e2-46ad-ab38-7113c858ee64', fachbereich: 'VWL', musterlosung: 'Die Tabaksteuer wird formal beim Produzenten erhoben — die wirtschaftliche Steuerlast hängt jedoch von den Elastizitäten ab. Die Nachfrage nach Zigaretten ist sehr unelastisch, da viele Konsumenten suchtbedingt nicht ausweichen können. Die Produzenten überwälzen daher den Grossteil der Steuer auf den Verkaufspreis, ohne dass die Nachfrage stark einbricht. Im Ergebnis tragen die Raucherinnen und Raucher den Hauptteil der Steuerlast.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Tabaksteuer ist eine indirekte Steuer; entscheidend ist die Überwälzung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Niemand bezahlt freiwillig mehr — die Überwälzung ist marktbedingt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Unelastische Nachfrage erlaubt fast vollständige Preisüberwälzung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Produzenten zahlen formal — die wirtschaftliche Last wird überwälzt.' },
  ] },
  { id: 'bc3083ec-1c00-4f51-8dd0-d2ae7075e651', fachbereich: 'VWL', musterlosung: 'Eine Steuer erhöht den Preis für Konsumenten und senkt den Erlös für Produzenten — die Gleichgewichtsmenge sinkt von Q* auf Q_t. Transaktionen, bei denen die Zahlungsbereitschaft über den Grenzkosten, aber unter Grenzkosten plus Steuer liegt, finden nicht mehr statt. Die so verlorenen Tauschgewinne sind der Wohlfahrtsverlust. Sie kommen niemandem zugute — auch der Staat erhält nur die Einnahmen aus den noch stattfindenden Transaktionen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Wohlfahrtsverlust besteht unabhängig von der Verwendung der Steuereinnahmen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Verlorene Tauschgewinne durch nicht mehr stattfindende Transaktionen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Produzenten verlieren nur einen Teil — den Steueranteil plus Mengenrückgang.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Konsumentenrente sinkt nicht auf null, nur ein Dreieck geht verloren.' },
  ] },
  { id: 'bc823f02-7f60-4f24-911a-5e70b4ca4009', fachbereich: 'VWL', musterlosung: 'Arbeitsproduktivität misst den Output pro geleisteter Arbeitsstunde. Sie steigt durch besseres Sachkapital (modernere Maschinen, Anlagen), besseres Humankapital (Aus- und Weiterbildung) und durch technischen Fortschritt (neue Verfahren, Software, Automatisierung). Ein höheres Rentenalter erhöht dagegen den gesamten Arbeitseinsatz, nicht den Output pro Stunde — es ist also ein Niveaueffekt, kein Produktivitätseffekt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Besseres Sachkapital steigert den Output pro Arbeitsstunde.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Höheres Rentenalter erhöht den Arbeitseinsatz, nicht die Produktivität.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Bessere Qualifikation steigert Humankapital und damit Produktivität.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Automatisierung ist klassischer Produktivitätstreiber.' },
  ] },
  { id: 'bc88d979-a9f8-472d-86d6-a6176f86a9c4', fachbereich: 'VWL', musterlosung: 'Die Wertaufbewahrungsfunktion erlaubt es, Konsum in die Zukunft zu verschieben — Geld kann gespart und später ausgegeben werden. Damit ist langfristiges Sparen überhaupt erst möglich. Die Funktion wird allerdings durch Inflation eingeschränkt, weil die Kaufkraft des Geldes sinkt. Die Aussage, Geld behalte immer seinen Wert, ist deshalb falsch — gerade in Hochinflationsphasen weichen Sparende auf Sachwerte wie Aktien oder Immobilien aus.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Konsumverschiebung in die Zukunft ist Kernfunktion.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Inflation schmälert die Kaufkraft und damit die Wertaufbewahrung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Geld verliert bei Inflation realen Wert; «immer» ist zu absolut.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Ohne Wertaufbewahrung wäre langfristiges Sparen nicht möglich.' },
  ] },
  { id: 'be57a1fd-6b3c-46f5-be30-d7cf4f3e0489', fachbereich: 'VWL', musterlosung: 'Eine Verschiebung von rund 40 Prozent der Konzerngewinne in Tiefsteuerländer erodiert die Steuerbasis der Hochsteuerländer massiv. Die entgangenen Einnahmen müssen kompensiert werden — entweder durch höhere Steuern auf weniger mobile Faktoren wie Arbeitseinkommen und Konsum oder durch Kürzungen bei öffentlichen Leistungen. Beides verschärft die Verteilungswirkung: Die Steuerlast verschiebt sich von international mobilen Konzernen zu weniger mobilen Personen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Produktivität wird durch Gewinnverschiebung nicht direkt beeinflusst.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Arbeitslosigkeit ist nicht das primäre Problem in Steueroasen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Inflation entsteht nicht durch verlagerte Gewinne.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Erosion der Steuerbasis verlagert Last auf andere Steuerzahlende.' },
  ] },
  { id: 'c0504412-6d0a-4cc5-9f0c-f555dc4f9dde', fachbereich: 'VWL', musterlosung: 'Der Ökonom verbindet zwei Aufgaben in einer Aussage: prognostizieren (Inflation 2,5 Prozent) und beeinflussen (SNB soll Leitzins erhöhen). Problematisch ist das, weil Prognosen mit Unsicherheit behaftet sind und Handlungsempfehlungen Werturteile enthalten — beispielsweise dass Preisstabilität wichtiger ist als Beschäftigung. Beides zu vermischen suggeriert eine wissenschaftliche Objektivität, die der normative Anteil nicht beanspruchen kann.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Prognose plus normative Empfehlung — vermischt positive und normative VWL.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Mikro- und Makro-Ebene werden nicht verwechselt; beide Aspekte sind makro.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Empfehlung folgt nicht zwingend, sondern beruht auf Wertentscheidungen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Beschreiben und Erklären ist methodisch zulässig und üblich.' },
  ] },
  { id: 'c05f8ee8-a476-442f-9345-96ce7efbde67', fachbereich: 'VWL', musterlosung: 'Der keynesianische Multiplikator beschreibt, wie eine zusätzliche autonome Ausgabe — typischerweise eine Staatsausgabe — durch mehrfache Einkommens- und Ausgabenrunden das BIP überproportional erhöht. Empfänger der ersten Ausgabe konsumieren einen Teil ihres Einkommens, was beim nächsten Empfänger neues Einkommen schafft. Ein Multiplikator von 1,5 bedeutet: Eine Ausgabe von 1 Mrd. CHF erhöht das BIP um 1,5 Mrd. CHF. Höhe und Wirkung hängen von der Konsumneigung ab.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Inflationsindex ist eine andere Grösse (Preisindex).' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Geldmengenwachstum gehört zur Geld-, nicht zur Multiplikatorlehre.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Exportquote ist eine separate Aussenhandelskennzahl.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Eine zusätzliche Staatsausgabe erhöht das BIP um ein Vielfaches.' },
  ] },
  { id: 'c083bbd6-0237-47a1-a657-50c2718cabb4', fachbereich: 'VWL', musterlosung: 'Bei der Steuerprogression steigt der Steuersatz mit zunehmendem Einkommen — das Einkommen wird also überproportional belastet. Das verfolgt einen Umverteilungszweck: Personen mit höherem Einkommen tragen sowohl absolut als auch relativ mehr zur Finanzierung des Staates bei. In der Schweiz ist die direkte Bundessteuer auf Einkommen klar progressiv ausgestaltet. Gegenmodelle sind die proportionale (Flat Tax) oder die degressive Besteuerung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Konstanter Satz wäre die proportionale Steuer (Flat Tax).' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Sinkender Satz ist die regressive bzw. degressive Steuer.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Steigender Steuersatz mit wachsendem Einkommen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Eine Schwelle ohne darüberliegende Progression beschreibt nur einen Freibetrag.' },
  ] },
  { id: 'c0a4be1b-c297-4d59-92f8-e58f6a52204f', fachbereich: 'VWL', musterlosung: 'Liegt der Marktpreis über dem Gleichgewichtspreis, ist die angebotene Menge grösser als die nachgefragte. Es entsteht ein Angebotsüberschuss. Lagerbestände wachsen, Produzenten reduzieren die Preise und passen die Produktion an, bis das Gleichgewicht wieder erreicht ist. Dieser Marktmechanismus funktioniert allerdings nur, wenn der Preis frei beweglich ist — bei staatlich verordneten Mindestpreisen bleibt der Überschuss bestehen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Mehr Angebot als Nachfrage bei zu hohem Preis.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Bei einem Preis über P* liegt kein Gleichgewicht vor.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Nachfrageüberschuss entsteht bei zu tiefem Preis.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Preis bewegt sich auf der Angebotskurve, ohne sie zu verschieben.' },
  ] },
  { id: 'c0f262a8-163b-4dc6-9b95-840bcab598ee', fachbereich: 'VWL', musterlosung: 'Am 15. Januar 2015 hob die Schweizerische Nationalbank den seit September 2011 verteidigten Mindestkurs von 1,20 CHF/EUR überraschend auf. Die Aufrechterhaltung wäre nur noch mit anhaltend hohen Devisenkäufen möglich gewesen. Die Folge war eine starke Frankenaufwertung, die exportorientierte Branchen unter Druck setzte. Die SNB führte gleichzeitig stark negative Leitzinsen ein, um die Aufwertung zu dämpfen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Aufhebung am 15. Januar 2015.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der 6.9.2011 ist das Datum der Einführung, nicht der Aufhebung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Im Januar 2016 war der Mindestkurs bereits ein Jahr aufgehoben.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Es war der 15., nicht der 22. Januar.' },
  ] },
  { id: 'c1cb8bf4-497e-467b-8ea8-afbc0cd40558', fachbereich: 'VWL', musterlosung: 'Auf dem Arbeitsmarkt fragen Unternehmen und der Staat Arbeitskräfte nach — sie bilden die Arbeitsnachfrage. Arbeitnehmerinnen und Arbeitnehmer bieten ihre Arbeitskraft an und bilden das Arbeitsangebot. Der Lohn ist der Preis für Arbeit; im Gleichgewicht stimmen Angebot und Nachfrage überein. Gewerkschaften und Arbeitgeberverbände treten als Verhandlungspartner auf, sind aber selbst keine direkten Marktteilnehmer auf der Nachfrage- oder Angebotsseite.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die ALV finanziert Lohnersatz, sie fragt keine Arbeit nach.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Unternehmen und Staat sind die Nachfrager nach Arbeit.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Arbeitnehmende bilden das Arbeitsangebot, nicht die Nachfrage.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Gewerkschaften vertreten das Angebot, sie sind nicht selbst Nachfrager.' },
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
  console.log(`Session 16: ${updates.length} Fragen appended (${withTeile} mit Teilerklärungen, ${updates.length - withTeile} ohne).`)
  console.log(`Total verarbeitet: ${state.verarbeitet} / ${state.totalFragen}`)
}

main().catch(err => { console.error(err); process.exit(1) })
