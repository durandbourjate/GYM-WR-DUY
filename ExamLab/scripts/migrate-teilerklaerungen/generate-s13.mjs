#!/usr/bin/env node
/**
 * Session 13: 100 VWL-Fragen (alle mc).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  { id: '1bab8506-23a6-4cc1-8ade-d1916539b5cb', fachbereich: 'VWL', musterlosung: 'Damit ein Gegenstand als Geld akzeptiert wird, muss er knapp, einheitlich und haltbar sein, sich gut transportieren und teilen lassen. Ein hoher Materialwert ist nicht nötig — Papiergeld hat praktisch keinen. Entscheidend ist das Vertrauen in den Herausgeber (in der Schweiz: SNB).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Knappheit ist nötig, damit Geld nicht beliebig vermehrt werden kann und seinen Wert behält.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Einheitlichkeit ermöglicht die Recheneinheitsfunktion — gleiche Werteinheiten sind direkt vergleichbar.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Haltbar, transportierbar, teilbar — praktische Voraussetzungen für den alltäglichen Zahlungsverkehr.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Papiergeld hat keinen hohen Materialwert — entscheidend ist das Vertrauen, nicht der Stoff.' },
  ] },
  { id: '1bd63c12-3c2d-4e0e-b0dc-dd5f37649122', fachbereich: 'VWL', musterlosung: 'Bei Kurzarbeit reduziert das Unternehmen die Arbeitszeit vorübergehend oder setzt sie ganz aus. Die ALV deckt rund 80 Prozent des Verdienstausfalls während maximal 12 Monaten. Ziel ist, Kündigungen zu vermeiden, wenn Auftragsrückgänge voraussichtlich nur kurzfristig sind.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Kurzarbeit ist gerade das Gegenteil von dauerhaftem Stellenabbau — sie soll Kündigungen verhindern.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Arbeitszeit vorübergehend reduziert, ALV übernimmt einen Teil des Lohnausfalls.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kurzarbeit bedeutet weniger Arbeit, nicht mehr — und niemals bei gleichbleibendem Lohn.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Kurzarbeiter bleiben Angestellte, sie werden nicht selbständig.' },
  ] },
  { id: '1beb6c24-c29a-4a47-aef5-1b70f63c91a4', fachbereich: 'VWL', musterlosung: 'Der Geländewagen im Stadtverkehr dient nicht der eigentlichen Funktion (Gelände), sondern als Statussymbol. Er befriedigt damit ein Wertschätzungsbedürfnis — Ansehen und soziale Anerkennung. Maslow ordnet diese Stufe oberhalb der Grundbedürfnisse ein. Das Beispiel zeigt: Güter können andere Bedürfnisse befriedigen als die, für die sie entwickelt wurden.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Zugehörigkeit würde kein teures Einzelgut erfordern — das passt nicht zur Situation.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Mobilität wäre mit einem kleineren Wagen billiger zu haben — das erklärt nicht die Wahl.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Wertschätzung/Status — der Wagen wird zum sichtbaren Zeichen des Erfolgs.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Sicherheit lässt sich auch mit anderen Fahrzeugen erreichen, Geländewagen sind nicht per se sicherer.' },
  ] },
  { id: '1c40ab93-5d78-4fab-bef5-77ed4b6a81d0', fachbereich: 'VWL', musterlosung: 'Die angebotsorientierte Wirtschaftspolitik (neoklassisch) setzt auf langfristig gute Rahmenbedingungen für Unternehmen: tiefere Steuern, weniger Regulierung, flexible Arbeitsmärkte, gute Infrastruktur und Bildung. Ziel sind Investitionen und nachhaltiges Wachstum — nicht kurzfristige Nachfragestimulierung wie bei Keynes.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Stetiges Geldmengenwachstum ist das monetaristische Kernanliegen, nicht das angebotsorientierte.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Kurzfristige Nachfragesteigerung ist keynesianische Logik — nicht angebotsorientiert.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Preisfestlegung durch den Staat wäre Planwirtschaft — das Gegenteil der Angebotspolitik.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Langfristige Verbesserung der Rahmenbedingungen — Kern der Angebotsökonomie.' },
  ] },
  { id: '1c9a951f-5d4c-4295-85f0-f75388984250', fachbereich: 'VWL', musterlosung: 'Die Strafmöglichkeit erhöht die Kooperation, auch wenn das Strafen selbst kostet. Schon die Androhung genügt oft, um Übernutzung zu verhindern. Die Teilnehmenden antizipieren die Sanktion und verhalten sich rücksichtsvoller — analog zu Bussen und Steuern in der realen Welt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Bestraft werden kann jeder, der gegen die Gruppennorm verstösst — nicht nur der grösste Fischer.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Strafdrohung macht Übernutzung unattraktiv, auch wenn selten gestraft wird.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Empirisch reicht schon die Option zum Strafen aus — sie wird oft gar nicht genutzt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Gegenseitige Strafen sind selten — die Norm reguliert sich meist selbst.' },
  ] },
  { id: '1ca03ca5-973c-466b-9fcb-831bb28725af', fachbereich: 'VWL', musterlosung: 'In Krisenzeiten wächst der Bedarf an sicheren, liquiden Vermögenswerten. Aktien und Obligationen erschienen 2008 riskant, Bargeld galt als sicherer Hafen. Die Geldnachfrage verschob sich nach rechts — die Menschen horteten grosse Banknoten. Das Phänomen heisst Flucht in Liquidität.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Kredite werden unbar vergeben (Buchgeld) — das erklärt keinen Anstieg der Bargeldnachfrage.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Flucht in Liquidität — Bargeld galt als sichere Wertaufbewahrung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Inflation war 2008 tief; hohe Inflation würde Bargeld sogar unattraktiv machen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die SNB druckt Noten nur auf Nachfrage — Auslöser war die Nachfrage, nicht das Angebot.' },
  ] },
  { id: '1d181d42-b6fb-4ab8-b0bf-817215291fec', fachbereich: 'VWL', musterlosung: 'Wechselkurse spiegeln nicht, was man mit einem Betrag in verschiedenen Ländern tatsächlich kaufen kann. Kaufkraftparitäten berücksichtigen die Preisniveauunterschiede: Mit umgerechnet CHF 10 lebt man in Thailand deutlich komfortabler als in der Schweiz. PPP macht BIP-Vergleiche aussagekräftiger.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die UNO schreibt keine Methode vor — PPP ist eine ökonomische Konvention.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Wechselkurs-Umrechnung wäre einfacher; PPP ist aufwendig (Warenkorb, Preiserhebungen).' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: BIP in PPP ist nicht systematisch höher — es zeigt nur die reale Kaufkraft.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Wechselkurse schwanken, Preisniveaus unterscheiden sich — PPP korrigiert das.' },
  ] },
  { id: '1d45360a-348a-499d-ade2-bbdf004a30e4', fachbereich: 'VWL', musterlosung: 'Eine Verschiebung der Beveridge-Kurve nach aussen bedeutet, dass bei gleicher Konjunktur mehr Arbeitslose und gleichzeitig mehr offene Stellen bestehen. Das ist ein Mismatch: Qualifikationen der Arbeitslosen passen nicht mehr zu den Anforderungen. Die strukturelle oder Sockelarbeitslosigkeit hat zugenommen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Konjunkturelle Arbeitslosigkeit entspricht einer Bewegung entlang der Kurve, nicht einer Verschiebung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Mehr Arbeitslose und mehr offene Stellen gleichzeitig — klassischer Strukturmismatch.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Würden Arbeitslose schneller vermitteln, würde sich die Kurve nach innen verschieben.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Vollbeschäftigung wäre eine Bewegung in den Ursprung — nicht eine Auswärtsverschiebung.' },
  ] },
  { id: '1dd93a55-8ed2-46e7-b746-daa2746a5af3', fachbereich: 'VWL', musterlosung: 'Die Elefantengrafik von Branko Milanovic zeigt die globale Einkommensverteilung: X-Achse = Perzentile der Weltbevölkerung (ärmste bis reichste), Y-Achse = prozentuale Realeinkommenveränderung von 1988 bis 2008. Die Kurve ähnelt einem Elefanten mit Rüssel — auffällig ist das Wachstum bei Mittelschicht in Schwellenländern und Topverdienern.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Prozentuale Realeinkommensveränderung 1988–2008 nach Einkommensperzentil.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Börsenkurse sind nicht Thema — die Grafik zeigt Haushaltseinkommen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Branchenanteile werden nicht abgebildet — es geht um Personen, nicht Sektoren.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Nicht absolute Höhen, sondern Veränderungsraten werden gezeigt.' },
  ] },
  { id: '1ebd4eb1-9ff5-4a04-b348-d4765af1b973', fachbereich: 'VWL', musterlosung: 'Friktionelle Arbeitslosigkeit entsteht durch jahreszeitliche Schwankungen (Tourismus, Landwirtschaft, Bau) oder durch Stellenwechsel mit kurzer Übergangszeit. Sie ist wirtschaftspolitisch unbedenklich, weil sie Teil eines funktionierenden Arbeitsmarktes ist.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Friktionell — Saison- und Suchprozesse verursachen kurzfristige Arbeitslosigkeit.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Konjunkturelle AL entsteht in Rezessionen, nicht durch Saison oder Stellenwechsel.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Sockelarbeitslosigkeit umfasst die dauerhafte Grundquote, nicht kurzfristige Wechsel.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Strukturelle AL entsteht durch Mismatch — nicht durch normale Wechsel oder Saison.' },
  ] },
  { id: '1ee130bd-096a-4251-ae41-cc7fe89ee7ae', fachbereich: 'VWL', musterlosung: 'Wenn eine Geschäftsbank einen Kredit vergibt, schreibt sie den Betrag dem Konto des Kreditnehmers gut. Dieses Buchgeld entsteht im Moment der Gutschrift — aus dem Nichts. Es zählt zur Geldmenge und wird für Zahlungen genutzt. Die Geldmenge wächst so mit der Kreditvergabe.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Banknoten druckt ausschliesslich die SNB — Geschäftsbanken erzeugen kein Bargeld.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Kreditvergabe schafft Buchgeld — Gutschrift auf dem Konto erhöht die Geldmenge.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das ist das falsche «Multiplikator»-Bild — Banken leiten nicht einfach weiter, sie schöpfen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Devisenverkauf ändert die Zusammensetzung, schafft aber kein neues Buchgeld.' },
  ] },
  { id: '1ee2c169-10eb-4c27-87a3-99da154dc153', fachbereich: 'VWL', musterlosung: 'Kann ein Staat seine Schulden nicht bedienen, droht ein Staatsbankrott. Üblich sind Verhandlungen mit den Gläubigern über einen Schuldenerlass (Haircut) — sie verzichten auf einen Teil der Forderungen. Der IWF unterstützt oft, knüpft dies aber an strenge Auflagen (Strukturreformen).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die UNO übernimmt keine Staaten — souveräne Staaten bleiben auch bei Pleite souverän.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Persönliche Bürgerhaftung für Staatsschulden existiert in modernen Demokratien nicht.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Staatsbankrott mit möglichem Haircut — übliches Ergebnis von Umschuldungsverhandlungen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Staatsanleihen verjähren nicht nach 10 Jahren — Gläubiger können ihre Forderungen einklagen.' },
  ] },
  { id: '1f740632-d8f1-42e3-a700-6dd9c23981db', fachbereich: 'VWL', musterlosung: 'Eine Zentralbank steuert die kurzfristigen Zinsen direkt, die langfristigen aber nur über Erwartungen des Publikums. Vertraut der Markt, dass sie die Preisstabilität hält, bleiben die Inflationserwartungen verankert und die langen Zinsen tief. Verliert sie Glaubwürdigkeit, verselbstständigen sich die Inflationserwartungen — dann wirkt Geldpolitik nicht mehr.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das Banknotenmonopol ist gesetzlich geregelt — es hängt nicht an der Glaubwürdigkeit.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Kreditvergabe hängt von Bonität und Kapital ab, nicht von der Zentralbank-Glaubwürdigkeit.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Erwartungen der Publikums steuern die langen Zinsen — Glaubwürdigkeit ist die Voraussetzung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bargeld wird aus Gewohnheit gehalten — nicht wegen oder trotz der Zentralbank-Glaubwürdigkeit.' },
  ] },
  { id: '20069095-8289-4a5c-bf91-2a1bdb3931a8', fachbereich: 'VWL', musterlosung: 'Die Beveridge-Kurve zeigt den empirischen Zusammenhang zwischen offenen Stellen (Y-Achse) und Arbeitslosen (X-Achse). Je mehr Stellen offen sind, desto weniger Arbeitslose gibt es — und umgekehrt. Sie verschiebt sich, wenn sich die strukturelle Passung auf dem Arbeitsmarkt ändert.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das ist die Phillips-Kurve — Inflation und Arbeitslosigkeit.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Offene Stellen versus Arbeitslose — Grundform der Beveridge-Kurve.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: BIP und Arbeitslosigkeit beschreibt das Okun-Gesetz.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Löhne und Beschäftigung wäre die Arbeitsangebotskurve.' },
  ] },
  { id: '20acb91a-f956-46f7-9344-fd2356f28e0b', fachbereich: 'VWL', musterlosung: 'Der Strukturwandel zeigt den Rückgang der Landwirtschaft und den Vormarsch von Industrie und später Dienstleistungen. 1800: über 50 Prozent im primären Sektor (Agrarland). 1900: sekundärer Sektor dominiert (Industrieland). Heute: über 70 Prozent im tertiären Sektor (Dienstleistungsgesellschaft), nur noch ca. 3 Prozent in der Landwirtschaft.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Industrie verliert seit Jahrzehnten Anteile — Dienstleistungen dominieren heute.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der primäre Sektor ist dramatisch geschrumpft, nicht gewachsen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Agrarland → Industrieland → Dienstleistungsgesellschaft — klassischer Drei-Sektoren-Wandel.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Sektoranteile haben sich fundamental verschoben.' },
  ] },
  { id: '20de762f-1382-4d68-b678-53a649888caa', fachbereich: 'VWL', musterlosung: 'Die Steuerinzidenz zeigt, wer die wirtschaftliche Last einer Steuer tatsächlich trägt. Das muss nicht die Seite sein, die die Steuer formal bezahlt. Entscheidend ist, welche Marktseite dem Preis weniger gut ausweichen kann — sie trägt den grösseren Teil der Last.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Höhe ist der Steuersatz — Inzidenz beantwortet die Verteilungsfrage.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Inzidenz = Frage, wer die Last wirtschaftlich trägt, nicht formal bezahlt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Häufigkeit der Erhebung ist ein anderes Konzept.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Unterscheidung direkt/indirekt betrifft die Erhebungsart, nicht die Lastverteilung.' },
  ] },
  { id: '2195661f-361e-41ae-ac51-a3fccdedf758', fachbereich: 'VWL', musterlosung: 'Hohe Inflation beschädigt vor allem die Wertaufbewahrungsfunktion des Geldes: Gespartes verliert laufend Kaufkraft. Die Recheneinheit leidet ebenfalls, weil sich Preise ständig ändern. Die Tauschmittelfunktion versagt erst bei Hyperinflation. Der direkteste Effekt trifft das Sparen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wertaufbewahrungsmittel — Geld verliert kontinuierlich an Kaufkraft.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Preise steigen nicht gleich stark — gerade die Streuung macht Inflation schädlich für die Recheneinheit.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Bei moderater Inflation wird Geld weiter angenommen — die Tauschfunktion bleibt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Inflation hat sehr wohl Auswirkungen — mindestens auf die Wertaufbewahrung.' },
  ] },
  { id: '21e80819-5ac2-40d0-8ecf-f9b4f58c6355', fachbereich: 'VWL', musterlosung: 'Schweizer Banknoten haben mehrere Sicherheitsmerkmale: Wasserzeichen, Glitzerzahlen (irisierende Elemente), spezielle Drucktechniken, Durchsichtsregister und weitere schwer fälschbare Eigenschaften. Mikrochips, QR-Codes mit Kontostand oder Ablaufdaten existieren nicht — Banknoten sind anonyme Inhaberpapiere.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Banknoten sind anonyme Inhaberpapiere — kein Bezug zu persönlichen Konten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Chips wären zu teuer und anfällig für Fälschung — Schweizer Noten haben keine.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Wasserzeichen, Glitzerzahlen und spezielle Druckverfahren — etablierte Sicherheitsmerkmale.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Banknoten verfallen nicht — ältere Serien können jahrzehntelang umgetauscht werden.' },
  ] },
  { id: '2205214d-8943-4ee8-a5db-feee3996cc31', fachbereich: 'VWL', musterlosung: 'Das Bruttoinlandprodukt entspricht dem Marktwert aller Endprodukte — Waren und Dienstleistungen — die in einem Land innerhalb eines Jahres hergestellt werden. Vorleistungen werden abgezogen, um Doppelzählungen zu vermeiden. Es misst die wirtschaftliche Leistung, nicht das Vermögen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Exporte sind ein Teil, aber nicht das ganze BIP — Konsum und Investitionen fehlen hier.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Marktwert aller Endprodukte eines Landes in einem Jahr — Standarddefinition.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Vorleistungen werden ausgeschlossen — sonst käme es zu Doppelzählungen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: BIP ist eine Strom-, keine Bestandsgrösse — Vermögen wird separat erfasst.' },
  ] },
  { id: '223b0f7a-d107-4916-a2ac-d60d4ae9f025', fachbereich: 'VWL', musterlosung: 'Die Lorenzkurve zeigt die kumulative Verteilung von Einkommen oder Vermögen. Die Diagonale (45°-Linie) wäre perfekte Gleichverteilung. Je weiter die Kurve davon abweicht, desto ungleicher ist die Verteilung. Der Gini-Koeffizient misst den Abstand numerisch.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Abstand zur 45°-Linie = Ungleichheit. Je bauchiger, desto ungleicher.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Wirtschaftswachstum im Zeitverlauf ist eine andere Darstellung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das ist die Phillips-Kurve — Inflation und Arbeitslosigkeit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: BIP pro Kopf ist eine eindimensionale Zeitreihe, keine Verteilungskurve.' },
  ] },
  { id: '22a00033-68b9-4f03-837d-8f89f9323856', fachbereich: 'VWL', musterlosung: 'Staatsversagen (Government Failure) liegt vor, wenn der Staat ein Marktversagen korrigieren will, aber dabei selbst ineffizient oder kontraproduktiv handelt — z.B. durch Fehlplanung, Bürokratie oder politische Einflussnahme. Es ist das Pendant zum Marktversagen und Teil der ökonomischen Analyse von Staatseingriffen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Nicht-Regulierung ist kein Versagen — nur die schädliche staatliche Aktion ist es.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Staatsbankrott ist Zahlungsunfähigkeit, nicht Staatsversagen im ökonomischen Sinn.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Staatliche Eingriffe führen zu schlechteren Ergebnissen als der Markt — Kern der Definition.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Keine Steuerhebung wäre fehlende Einnahmequelle, nicht Staatsversagen.' },
  ] },
  { id: '22d05355-3c88-4713-bf1b-d428689a6fe7', fachbereich: 'VWL', musterlosung: 'Der Kernunterschied: Monetaristen (Friedman) betonen die Geldpolitik und bevorzugen feste Regeln (stetige Geldmengenausweitung). Keynesianer (Keynes) setzen auf Fiskalpolitik — Staatsausgaben und Steuern — und diskretionäre, situationsabhängige Eingriffe. Beide erkennen Konjunkturschwankungen an, unterscheiden sich aber fundamental in der empfohlenen Therapie.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Beide Schulen empfehlen Wirtschaftspolitik — sie unterscheiden sich nur im Instrument.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Unterscheidung läuft nicht entlang von Arbeitsmarkt vs. Gütermarkt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Monetaristen → Geld + Regeln; Keynesianer → Fiskal + Diskretion. Kernunterschied.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Empfehlungen unterscheiden sich grundlegend — das ist gerade der Punkt.' },
  ] },
  { id: '238da0f5-8c40-4c24-b836-006af53040d6', fachbereich: 'VWL', musterlosung: 'Die Unterkonsumtionstheorie erklärt Rezessionen mit einer schwachen Konsumnachfrage: Niedrige Löhne und eine hohe Sparquote bewirken, dass die Nachfrage im Aufschwung nicht mit dem wachsenden Angebot Schritt hält. Das Überangebot führt zum Einbruch. Sie gehört zu den nachfrageorientierten Konjunkturerklärungen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Überkonsum wäre das Gegenteil — die Theorie argumentiert mit Unter-Konsumtion.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Hohe Löhne würden den Konsum eher stärken, nicht zur Krise führen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Staatskonsum ist hier nicht der Fokus — es geht um die private Nachfrage.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Niedriges Lohnwachstum + niedrige Konsumneigung → Nachfrage hinkt hinterher.' },
  ] },
  { id: '240511c0-7243-4df3-8c7b-5bb386a92524', fachbereich: 'VWL', musterlosung: 'Die Schülerin hat eine begrenzte Gesamtzeit (5 Stunden) und muss sie auf zwei Verwendungen (Mathe, Deutsch) aufteilen, um das Gesamtergebnis zu maximieren. Genau das ist das Optimumprinzip: Knappe Mittel möglichst gut einsetzen. Ökonomische Prinzipien gelten in allen Bereichen des Lebens.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ökonomische Prinzipien gelten überall, wo knappe Ressourcen aufgeteilt werden — auch beim Lernen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Optimumprinzip — begrenzte Lernzeit auf Fächer so aufteilen, dass das Gesamtergebnis am besten wird.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Maximumprinzip fixiert den Input pro Fach — hier wird die Gesamtzeit aufgeteilt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Minimumprinzip würde ein fixes Ziel mit minimaler Zeit erreichen — hier fix sind aber die Inputs.' },
  ] },
  { id: '244c771f-71c9-4e64-b3e4-5fe1ceb30baa', fachbereich: 'VWL', musterlosung: 'Luzern erlebte einen doppelten Effekt: Die tiefen Unternehmenssteuern lockten zu wenig Neuzuzüger an, um die Ausfälle zu kompensieren (Zentrumslast, ländliche Gebiete). Gleichzeitig stieg die Ressourcenstärke, Luzern erhielt weniger aus dem NFA. Die Bevölkerung musste die Lücke über höhere Privatsteuern und Sparpakete tragen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Zu viele Unternehmen wären positiv — das Problem war die ungenügende Kompensation.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Finanzkrise trifft alle Kantone ähnlich — das erklärt nicht Luzerns Sonderweg.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Bundessteuer hat der Kanton nicht gesetzt — sie bleibt konstant.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Nicht genug Neuzuzüger + weniger NFA-Beitrag — das doppelte Problem.' },
  ] },
  { id: '255269e7-0f10-4ef7-88e0-85d9e98bcad9', fachbereich: 'VWL', musterlosung: 'Globalisierung und Digitalisierung lassen Stellen für Unqualifizierte kontinuierlich wegfallen. Wer beschäftigungsfähig bleiben will, muss sich laufend weiterbilden. Das heisst lebenslanges Lernen. Es bekämpft strukturelle Arbeitslosigkeit an der Ursache — dem Mismatch zwischen Qualifikation und Anforderungen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Viele Branchen suchen Fachkräfte aller Stufen — nicht nur Akademiker.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Globalisierung und technologischer Wandel vernichten Stellen für Unqualifizierte.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Sozialleistungen hängen nicht an der Weiterbildung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Es gibt keine gesetzliche Pflicht zur Weiterbildung.' },
  ] },
  { id: '265ff682-6bdb-46f7-9ac7-4c2b52fd6d1f', fachbereich: 'VWL', musterlosung: 'Ein Bedürfnis ist der Wunsch, einen empfundenen Mangel zu beseitigen oder zu mildern. Der Begriff wird in der VWL weit gefasst: Er umfasst nicht nur materielle Güter, sondern auch Macht, Ansehen, Sicherheit, Schönheit, Abwechslung und Selbstverwirklichung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Bedürfnis = Wunsch, einen Mangel zu mildern — Standarddefinition.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Einkommen ist ein Mittel — Bedürfnisse sind die Motivation dahinter.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gekaufte Gütermengen sind Nachfrage — Bedürfnisse stehen davor.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das ist ein Produktionsbegriff — Bedürfnisse betreffen den Konsumenten.' },
  ] },
  { id: '267f5706-b1f5-4cf3-99f2-05ca685202bf', fachbereich: 'VWL', musterlosung: 'Lohnrigidität hat drei Hauptursachen: Institutionelle Regelungen (GAV, Mindestlöhne), Effizienzlöhne (Firmen zahlen bewusst über dem Gleichgewicht, um Produktivität zu steigern) und das Insider-Outsider-Modell (Beschäftigte setzen über Gewerkschaften höhere Löhne durch). Inflation blockiert keine Lohnanpassungen — sie kann sie sogar erleichtern.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: GAV und Mindestlöhne fixieren Lohnniveaus — institutionelle Rigidität.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Effizienzlohntheorie — hoher Lohn erzeugt Produktivität, Firma hält ihn.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Inflation verhindert nichts — sie erleichtert reale Lohnsenkungen bei konstanten Nominallöhnen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Insider nutzen Gewerkschaftsmacht — klassisches Insider-Outsider-Argument.' },
  ] },
  { id: '2786e59a-8cc3-469c-bcc1-acf1a2b126e1', fachbereich: 'VWL', musterlosung: 'Marktbasierte Instrumente der Umweltpolitik arbeiten über Preissignale. Emissionszertifikate, Lenkungsabgaben und Subventionen verändern die relativen Preise und schaffen Anreize für umweltfreundliches Verhalten. Ein Verbot ist dagegen ein ordnungsrechtliches Instrument — es setzt eine harte Grenze statt einer Preisanpassung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Handelbare Emissionszertifikate sind ein marktbasiertes Instrument — EU ETS.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Verbote sind ordnungsrechtlich, nicht marktbasiert.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: CO₂-Lenkungsabgabe mit Rückverteilung — klassisches Preissignal.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Subventionen für erneuerbare Energien verändern relative Preise, fördern klimafreundliche Alternativen.' },
  ] },
  { id: '27e134a2-ced4-4f95-86ec-c00aa8a83a75', fachbereich: 'VWL', musterlosung: 'Die angebotsorientierte Wirtschaftspolitik setzt auf Steuersenkungen, Deregulierung und flexible Arbeitsmärkte — also langfristige Verbesserung der Rahmenbedingungen. Antizyklische Staatsausgaben zur Rezessionsbekämpfung sind dagegen das Kerninstrument der keynesianischen Konzeption, nicht der angebotsorientierten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Unternehmenssteuern senken ist ein angebotsorientiertes Instrument.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Flexiblere Arbeitsmärkte sind Kern der Angebotsökonomie.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Deregulierung verbessert Rahmenbedingungen — angebotsorientiert.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Antizyklische Staatsausgaben sind keynesianisch, nicht angebotsorientiert.' },
  ] },
  { id: '27e37d68-4e4d-4357-ba1a-3b00d0ad4eba', fachbereich: 'VWL', musterlosung: 'Die westliche Mittelschicht im Knick der Kurve stagniert, während Schwellenländer-Mittelschicht und Topverdiener stark profitieren. Dieses Gefühl des Zurückbleibens schafft Nährboden für populistische Bewegungen, die Wandel versprechen. Brexit und ähnliche Phänomene lassen sich darüber teilweise erklären.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Argumentation verknüpft beides gerade — Einkommensstagnation und Politikwahl.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Stagnierende Mittelschicht fühlt sich abgehängt und wählt populistisch.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die ärmsten Länder profitieren nicht stark genug, um sich dagegen aufzulehnen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Direkte Wahlmanipulation ist nicht das Argument — es geht um Wählerverhalten.' },
  ] },
  { id: '28e1cd02-4d81-441e-9e80-a284694f2625', fachbereich: 'VWL', musterlosung: 'Das stärkste pro-Argument für Steuerparadiese ist der Disziplinierungseffekt: Sie zwingen Hochsteuerländer, Steuergelder effizient einzusetzen und die Steuerlast moderat zu halten. In der ökonomischen Literatur überwiegen die Gegenargumente — Steuerparadiese reduzieren Einnahmen, begünstigen Vermögende und untergraben öffentliche Güter.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Steuerparadiese senken die weltweiten Einnahmen — das ist gerade das Hauptargument gegen sie.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Disziplinierungseffekt — Hochsteuerländer müssen effizient bleiben.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gerade Wohlhabende profitieren überdurchschnittlich — Ungleichheit nimmt zu.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bankgeheimnis und Substanzlücken machen das System intransparenter.' },
  ] },
  { id: '2a43e2a1-b110-4e29-ae63-9953c8854f23', fachbereich: 'VWL', musterlosung: 'Typisch für Konjunkturschwankungen ist: In Rezessionen steigt die Arbeitslosigkeit, in Hochkonjunkturen droht Inflation, und die Schwankungen verlaufen um das langfristige Produktionspotenzial. Feste Zyklendauern gibt es nicht — reale Zyklen variieren je nach Ursachen deutlich.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Rezession → steigende Arbeitslosigkeit — empirisch stabil.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Hochkonjunktur → Überhitzung und Preisdruck — Inflationsgefahr.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Keine festen 7-Jahres-Zyklen — die Dauer variiert stark (2–10 Jahre).' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Schwankungen um das Produktionspotenzial — Grundform des Konjunkturmodells.' },
  ] },
  { id: '2bf4e64a-12aa-498c-9477-4e238eb9ced9', fachbereich: 'VWL', musterlosung: 'Legitime Gründe für Staatseingriffe sind Marktversagen, Bereitstellung öffentlicher Güter und Sicherung des Wettbewerbs. Die Gewinnmaximierung einzelner Unternehmen gehört nicht dazu — das wäre unzulässige Klientelpolitik. Staatseingriffe müssen dem Gemeinwohl dienen, nicht privaten Interessen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Unternehmensgewinn-Maximierung ist kein Grund für Staatseingriffe — das wäre Klientelismus.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Öffentliche Güter sind ein klassischer Grund für Staatseingriffe.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Marktversagen rechtfertigt Eingriffe — externe Effekte, Informationsasymmetrien.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Wettbewerbssicherung und Monopolbekämpfung sind zentrale Aufgaben des Staates.' },
  ] },
  { id: '2c6769e8-4fc5-45a6-a42e-f1994c5cb85d', fachbereich: 'VWL', musterlosung: 'Überdurchschnittlich armutsgefährdet in der Schweiz sind Alleinerziehende (Betreuungskosten, fehlendes Zweiteinkommen), Menschen ohne Berufsabschluss (tiefe Löhne, unsichere Stellen) und Personen mit gesundheitlichen Einschränkungen (eingeschränkte Erwerbsfähigkeit). Hochschulabsolventen mit Berufserfahrung sind die am wenigsten betroffene Gruppe.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Alleinerziehende tragen höchste Armutsrisiken — eine Einkommensquelle, hohe Betreuungskosten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Ohne Berufsabschluss: tiefere Löhne und grössere Beschäftigungsunsicherheit.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Hochschulabsolventen haben die tiefsten Armutsquoten — nicht überdurchschnittlich betroffen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Gesundheitliche Einschränkungen reduzieren Erwerbsfähigkeit — erhöhtes Armutsrisiko.' },
  ] },
  { id: '2c93cb02-e893-4018-bfa1-b9a9a2719f8a', fachbereich: 'VWL', musterlosung: 'Die Monetaristen um Milton Friedman betonen die Geldpolitik als Hauptinstrument: Schwankungen der Geldmenge sind die wichtigste Konjunkturursache. Die Zentralbank soll für eine stetige, voraussagbare Geldmengenentwicklung sorgen, statt aktive Fiskalpolitik zu betreiben. Regelbindung statt Diskretion.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Geldpolitik ist das zentrale Instrument — monetaristisches Kernprinzip.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Vollständige Deregulierung ist nicht das monetaristische Programm — es geht um Geldmengenregel.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Fiskalpolitik lehnen Monetaristen gerade als Hauptinstrument ab.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Monetaristen sehen die Geldmenge als entscheidend — das ist der Kern der Schule.' },
  ] },
  { id: '2cbc880f-db0c-481c-a369-d5680f7be513', fachbereich: 'VWL', musterlosung: 'Ohne Wettbewerbsdruck haben Marktführer weniger Anreize, Produkte oder Prozesse zu verbessern. Langfristig leiden Effizienz und Innovation. Das Gegenargument (Schumpeter: Monopolgewinne finanzieren Forschung) gilt nur begrenzt — empirisch überwiegt der Wettbewerb als Innovationstreiber.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Geschützte Unternehmen haben weniger Anreiz zur Innovation — Wettbewerbsdruck fehlt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Protektion begünstigt keine Innovation — sie verzögert notwendige Anpassungen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Monopolgewinne fliessen selten in Forschung — Schumpeters These überzeugt empirisch nur begrenzt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Wettbewerbsbedingungen beeinflussen Innovation direkt.' },
  ] },
  { id: '2d1a6dd7-d11a-413d-9809-e9cfcce32d86', fachbereich: 'VWL', musterlosung: 'Die gesamten Bundeseinnahmen stiegen von 2008 bis 2019 um rund 15.6 Prozent. Im gleichen Zeitraum stiegen die Ausgaben nur um 8 Prozent — daraus folgt eine Verbesserung der Haushaltslage. Ein zentraler Faktor dafür war die Schuldenbremse mit ihrer Disziplinwirkung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: 25 Prozent überschätzen den realen Zuwachs deutlich.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: 5 Prozent sind zu tief — die Einnahmen stiegen deutlich stärker.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Rund 15.6 Prozent — gemäss Eidgenössischer Finanzverwaltung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: 8 Prozent ist der Ausgabenzuwachs, nicht der Einnahmenzuwachs.' },
  ] },
  { id: '2df538d1-6c5f-4796-b9a9-367be2dd8f72', fachbereich: 'VWL', musterlosung: 'In der Schweiz bilden die direkten Steuern (Einkommens- und Gewinnsteuern) den grössten Anteil der Staatseinnahmen — rund 60 Prozent. Die indirekten Steuern (vor allem Mehrwertsteuer) tragen etwa 25 Prozent bei, Gebühren und übrige Einnahmen den Rest.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Direkte Steuern dominieren — rund 60 Prozent der Staatseinnahmen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Mehrwertsteuer allein generiert rund 25 Prozent — deutlich weniger als alle direkten Steuern.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Indirekte Steuern sind die zweitgrösste Quelle, nicht die grösste.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Gebühren und Beiträge sind Nebenposten — die Steuern dominieren.' },
  ] },
  { id: '2e743efb-4ef3-424d-874b-441e811c3a7f', fachbereich: 'VWL', musterlosung: 'In einer Rezession gibt es viele Arbeitslose und gleichzeitig wenige offene Stellen — dieser Punkt liegt rechts unten auf der Beveridge-Kurve. Punkt A (links oben) wäre Hochkonjunktur, Punkt C auf der Winkelhalbierenden entspricht der Sockelarbeitslosigkeit.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Winkelhalbierende = Gleichstand → Sockelarbeitslosigkeit, nicht Rezession.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Links oben = viele Stellen, wenige Arbeitslose = Hochkonjunktur.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Rechts unten = viele Arbeitslose, wenige Stellen = Rezession.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Konjunkturlage lässt sich aus der Position auf der Kurve sehr wohl ablesen.' },
  ] },
  { id: '2eda70cf-f295-43be-a5eb-7e9fcadab1c4', fachbereich: 'VWL', musterlosung: 'Das Grundprinzip einer Versicherung ist die kollektive Risikoübernahme (Solidaritätsprinzip): Viele Versicherte tragen zusammen wenige Schadensfälle. Ein kleiner Teil der Gemeinschaft erleidet einen Schaden, die Prämien aller decken diesen ab. Das funktioniert auf dem Gesetz der grossen Zahlen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Kollektive Risikoübernahme — Kern jeder Versicherung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Versicherungen verhindern Schäden nicht, sondern decken sie ab.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Individuelles Sparen wäre keine Versicherung — Risikoteilung ist der Punkt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Auch private Versicherungen folgen dem Solidaritätsprinzip — nicht nur staatliche.' },
  ] },
  { id: '2eeeb13f-d90c-41bf-92e8-09fba2f1a496', fachbereich: 'VWL', musterlosung: 'Der einfache Wirtschaftskreislauf kennt nur Haushalte und Unternehmen. Der erweiterte Kreislauf ergänzt Staat (Steuern, Güter, Transfers), Ausland (Exporte, Importe) und Banken (Ersparnisse, Kredite). Damit bildet er eine offene Volkswirtschaft realistischer ab.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Nur der Staat wäre der «geschlossene Wirtschaftskreislauf mit Staat» — hier fehlt der Aussenhandel.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Börse/SNB sind keine eigenen Akteure im Standardmodell — sie zählen zu den Banken.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gewerkschaften und Verbände sind Interessenvertreter, keine Kreislaufakteure.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Staat, Ausland und Banken — das Standardschema des erweiterten Kreislaufs.' },
  ] },
  { id: '2fa6d0f7-1892-42db-95d0-950ad6ce94cf', fachbereich: 'VWL', musterlosung: 'Die Sozialausgaben des Bundes machten 2019 rund 31 Prozent der gesamten Bundesausgaben aus. Dieser Anteil ist seit 1960 (12.5 Prozent) kontinuierlich gestiegen und unterstreicht die wachsende Bedeutung der sozialen Sicherheit. Er ist damit der grösste Ausgabenposten des Bundes.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Rund 31 Prozent — grösster Posten im Bundeshaushalt 2019.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: 21 Prozent unterschätzt den tatsächlichen Anteil.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: 12 Prozent entspricht dem Niveau von 1960, nicht 2019.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: 45 Prozent überschätzt — die Sozialausgaben sind gross, aber nicht fast die Hälfte.' },
  ] },
  { id: '305c6fb9-ba8b-44f4-ad4e-a4c869c68946', fachbereich: 'VWL', musterlosung: 'Die Geldmengen werden hierarchisch definiert. M1 = Bargeld + Sichteinlagen + Transaktionskonten. M2 = M1 + Spareinlagen (ohne gebundene Vorsorge). M3 = M2 + Termineinlagen. Jede weitere Stufe schliesst weniger liquide Guthaben ein.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Bargeld ist in beiden enthalten (in M1), der Unterschied sind Spareinlagen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Sichteinlagen sind bereits in M1 enthalten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Termineinlagen kommen erst bei M3 dazu, nicht bei M2.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: M2 = M1 + Spareinlagen.' },
  ] },
  { id: '319e465e-3e9d-45e4-a9b4-a43c85e5d9c8', fachbereich: 'VWL', musterlosung: 'Die Produzentenrente misst den Vorteil der Verkäufer: Sie erhalten mehr, als sie minimal verlangen würden. Grafisch ist das die Fläche zwischen dem Marktpreis und der Angebotskurve — das Dreieck unterhalb der Preislinie. Zusammen mit der Konsumentenrente bildet sie die Gesamtwohlfahrt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Spanne aus Höchst- und Tiefstpreis ist nicht definiert — keine ökonomische Kennzahl.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Umsatz ist Preis × Menge, nicht die Rente.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kosten sind Teil der Kalkulation, nicht der Rente selbst.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Erhaltener Marktpreis minus minimaler Verkaufspreis — Produzentenrente.' },
  ] },
  { id: '31e25cb1-d236-412c-89d0-332f01be0884', fachbereich: 'VWL', musterlosung: 'Die Schuldenbremse unterscheidet zwischen ordentlichem und ausserordentlichem Haushalt. Ausserordentliche Ausgaben wie die Coronahilfen werden separat verbucht und müssen innerhalb von sechs Jahren über den ordentlichen Haushalt abgebaut werden. So bleibt die langfristige Haushaltsdisziplin gewahrt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Ausserordentlicher Haushalt + 6-Jahres-Abbau — der Mechanismus der Schuldenbremse.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Coronaausgaben wurden sehr wohl als Staatsausgaben verbucht — nur ausserordentlich.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Schuldenbremse wurde nicht ausser Kraft gesetzt, sondern wie vorgesehen angewendet.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Unbegrenzte Ausgaben sind nicht erlaubt — nur ausserordentliche mit Abbauverpflichtung.' },
  ] },
  { id: '323505c6-4705-4f25-aafe-e205c858a170', fachbereich: 'VWL', musterlosung: 'Vor der Steuer betrug die Konsumentenrente A + B + C — die gesamte Fläche zwischen Nachfragekurve und Gleichgewichtspreis P*. Nach der Steuer schrumpft sie auf A: B geht als Steuereinnahme an den Staat, C als Wohlfahrtsverlust verloren. Flächen D, E, F gehören zur Produzentenrente.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Fläche A war vor und nach der Steuer Teil der Konsumentenrente.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Fläche B war vor der Steuer Konsumentenrente — geht danach an den Staat.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Fläche C war Konsumentenrente — geht als Wohlfahrtsverlust verloren.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Fläche D gehört zur Produzentenrente, nicht zur Konsumentenrente.' },
    { feld: 'optionen', id: 'opt-4', text: 'Falsch: Fläche E ist auf der Produzentenseite — unter der Angebotskurve.' },
    { feld: 'optionen', id: 'opt-5', text: 'Falsch: Fläche F ist Produzentenrente nach der Steuer — nicht Konsumentenseite.' },
  ] },
  { id: '333ef37b-9a47-4433-a513-80e0c354b7a6', fachbereich: 'VWL', musterlosung: 'Der relative Preis drückt das Tauschverhältnis zwischen zwei Gütern aus. Beispiel: Kostet ein Hemd CHF 40 und ein Buch CHF 20, beträgt der relative Preis 1 Hemd = 2 Bücher. Relative Preise zeigen den Wert eines Gutes im Vergleich zu anderen und sind deshalb für Entscheidungen zentraler als absolute Preise.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das wäre der reale Preis — inflationsbereinigt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Tauschverhältnis zwischen zwei Gütern — Hemd und Buch.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Verwandtenrabatt ist kein ökonomischer Fachbegriff.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Durchschnittspreis aller Güter wäre das Preisniveau.' },
  ] },
  { id: '340f8348-525c-409e-9d43-20a06ff84e38', fachbereich: 'VWL', musterlosung: 'Eine Zunahme des Geldangebots verschiebt die Kurve nach rechts, die Kaufkraft sinkt und das Preisniveau steigt. Analog: Eine Abnahme der Geldnachfrage verschiebt die Nachfragekurve nach links — ebenfalls sinkende Kaufkraft, steigendes Preisniveau. Umgekehrt senken Geldnachfrage-Zunahme oder Geldangebot-Abnahme das Preisniveau.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Mehr Geldangebot → höheres Preisniveau.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Mehr Geldnachfrage erhöht die Kaufkraft → Preisniveau sinkt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Weniger Geldnachfrage → tiefere Kaufkraft → höheres Preisniveau.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Weniger Geldangebot senkt das Preisniveau.' },
  ] },
  { id: '34811268-defa-4689-86e4-c7399f6dffc7', fachbereich: 'VWL', musterlosung: 'Stark profitiert haben gemäss Milanovic die globale Mittelschicht in Schwellenländern (Rücken des Elefanten) und die reichsten 1 Prozent (Rüsselspitze). Die westliche Mittelschicht im Knick und die Allerärmsten haben kaum profitiert. Das prägt die typische Elefantenform.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Aufstrebende Mittelschicht in China und Indien — starke Wachstumsraten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die untere westliche Mittelschicht stagnierte — der Knick der Kurve.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Globale Superreiche — Rüsselspitze des Elefanten.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die allerärmsten Menschen haben kaum profitiert — Elefantenschwanz liegt tief.' },
  ] },
  { id: '35c0ab8b-fc24-4352-b098-ca226cf1f950', fachbereich: 'VWL', musterlosung: 'Reine Tauschwirtschaften leiden an drei Kernproblemen: Schwierige Suche nach einem passenden Tauschpartner (doppelte Koinzidenz der Bedürfnisse), komplizierter Wertvergleich ohne gemeinsame Recheneinheit und beschränkte Wertaufbewahrung, weil viele Güter verderblich sind. Diese Probleme lösen sich durch Einführung von Geld.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Doppelte Koinzidenz der Bedürfnisse — beide Partner müssen genau das wollen, was der andere hat.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Ohne Recheneinheit ist der Wertvergleich aufwendig.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Verderbliche Güter eignen sich schlecht als Wertaufbewahrung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Staat kann Steuern auch in Naturalien erheben — kein Grundproblem der Tauschwirtschaft.' },
  ] },
  { id: '367a8cc3-03e9-422f-84bb-aaeb115a5526', fachbereich: 'VWL', musterlosung: 'Der Arbeitsmarkt hat drei Besonderheiten: Das Angebot ist extrem heterogen (jede Arbeitskraft ist einzigartig), die Teilnahme ist für die meisten existenziell (Löhne sichern den Lebensunterhalt) und der Markt ist stark reguliert (GAV, Kündigungsschutz, Sozialpartnerschaft). Deshalb funktioniert er nicht wie ein normaler Gütermarkt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Angebot ist gerade heterogen, nicht homogen — jede Person ist unterschiedlich qualifiziert.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Es gibt Löhne — das sind die Preise auf dem Arbeitsmarkt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Existenzielle Teilnahme + heterogenes Angebot — Kernbesonderheiten.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Staat reguliert, kontrolliert aber nicht vollständig — Arbeitgeber und -nehmer handeln frei.' },
  ] },
  { id: '376a6a26-7e5a-4da0-8d6b-0239350e9c3f', fachbereich: 'VWL', musterlosung: 'Die offizielle Fiskalquote erfasst nur Steuern und obligatorische Sozialversicherungsbeiträge. Die erweiterte Fiskalquote berücksichtigt zusätzlich weitere Zwangsabgaben wie obligatorische Krankenkassenprämien, Gebühren und regulatorische Kosten — für die betroffenen Haushalte ebenfalls zwingend, statistisch aber nicht als Steuern erfasst.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Zwangsabgaben wie Krankenkassenprämien sind nicht statistische Steuern, aber faktisch verpflichtend.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das BIP wird einheitlich berechnet — keine Differenz durch die BIP-Definition.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Beide Quoten arbeiten mit den gleichen Inflationsdaten.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Freiwillige Spenden sind eine Randgrösse — nicht die Erklärung für die Differenz.' },
  ] },
  { id: '37d0ae4b-77dc-4aac-ae6e-f9db4b9fa403', fachbereich: 'VWL', musterlosung: 'Regulatory Capture beschreibt die Übernahme von Regulierungsbehörden durch die Interessen der regulierten Branche — meist über Lobbying, Informationsasymmetrien oder Personalrotationen (Drehtüreffekt). Das Ergebnis: Regulierung dient weniger dem Gemeinwohl, sondern den Branchen. Es ist eine klassische Form von Staatsversagen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Behörden dienen Branchen statt Gemeinwohl — klassische Regulatory Capture.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Regulatory Capture ist gerade eine Folge ZU VIELER oder falscher Regulierung, nicht zu wenig.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das ist ein Missverständnis — Regulierung schafft nicht automatisch Wettbewerb.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Konsumentenhaltung ist hier nicht das Thema.' },
  ] },
  { id: '386f3d5b-42ea-482d-b343-7214a34f82ab', fachbereich: 'VWL', musterlosung: 'Eine tiefe Fiskalquote bedeutet: Der Staat erhebt relativ wenig Steuern und Abgaben gemessen an der Wirtschaftsleistung. Die Schweiz liegt mit rund 28 Prozent deutlich unter dem OECD-Durchschnitt von ca. 34 Prozent. Das widerspiegelt die traditionell liberale Wirtschaftspolitik mit vergleichsweise geringer staatlicher Umverteilung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Schuldenquote ist ein anderer Indikator — Fiskalquote misst die Abgabenlast.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ausgaben misst die Staatsquote, nicht die Fiskalquote.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Schweiz erhebt sehr wohl indirekte Steuern (Mehrwertsteuer).' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Geringer Abgabenanteil am BIP = tiefe Fiskalquote.' },
  ] },
  { id: '39677ba7-d827-4a3d-9a2b-246409bbb18b', fachbereich: 'VWL', musterlosung: 'Hinter dem Schleier des Nichtwissens kennen die Menschen weder Geschlecht, Alter, Gesundheitszustand, Reichtum, Intelligenz noch sozialen Status. Sie wissen nicht, welche Position sie in der Gesellschaft einnehmen werden. Genau weil sie diese Unsicherheit spüren, wählen rationale Menschen laut Rawls eine Gesellschaftsordnung, die auch den Schwächsten schützt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Geschlecht und Alter gehören zu den ausgeblendeten Merkmalen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der spätere Beruf bleibt verborgen — das ist Kern des Gedankenexperiments.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Gesundheitszustand ist hinter dem Schleier unbekannt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Materielle Lage ist ebenfalls verborgen — sonst würden Reiche anders stimmen.' },
  ] },
  { id: '3b74ac8c-9aa0-4020-aee8-219dcf9496d3', fachbereich: 'VWL', musterlosung: 'Die Schweiz hatte dank starker Währung und SNB-Geldpolitik durchgehend die tiefsten Inflationsraten. Ab 2021 stiegen die Raten aufgrund Lieferkettenprobleme, Energiepreise und Nachholeffekten nach Corona stark an — in allen Industrieländern. Die Schweiz erlebte in einzelnen Jahren (z.B. 2015/16) sogar eine negative Teuerung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Schweiz hatte durchgehend die tiefsten Inflationsraten — Effekt des starken Frankens.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Ab 2021 stiegen alle Inflationsraten — gemeinsame Schocks wie Energie und Lieferketten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Einzelne Deflationsjahre in der Schweiz (z.B. 2015, 2016).' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Verläufe unterscheiden sich deutlich — sonst wäre die Grafik uninteressant.' },
  ] },
  { id: '3ba35396-cdb8-4f80-8fa4-505532e45807', fachbereich: 'VWL', musterlosung: 'Buchgeld (Giralgeld) ist der elektronische Buchungseintrag auf Bank- oder Postkonten. Es lässt sich nicht physisch halten — nur in Bargeld umtauschen. Es ist die abstrakteste Geldform und macht heute den weitaus grössten Teil der Geldmenge und der Zahlungen aus.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Buchgeld existiert nur als Kontoeintrag — nicht physisch.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Man kann Buchgeld nicht in den Händen halten — nur in Bargeld umwandeln.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Buchgeld ist die abstrakteste Geldform.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Überweisungen, Lastschriften und Kartenzahlungen sind Buchgeld-Transaktionen.' },
  ] },
  { id: '3c3ae990-f926-4dd5-a49f-f68400aa8940', fachbereich: 'VWL', musterlosung: 'Geld erfüllt drei Funktionen: Zahlungsmittel (ermöglicht einfachen Tausch ohne Gütertausch), Rechnungseinheit (ermöglicht transparente, vergleichbare Preise) und Wertaufbewahrungsmittel (ermöglicht Sparen und zeitliches Verschieben von Konsum). Alle drei müssen funktionieren, damit Geld seinen Zweck erfüllt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Sparen ist ein Teilaspekt der Wertaufbewahrung, Kreditfunktion ist keine Grundfunktion des Geldes.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Zahlungsmittel, Rechnungseinheit, Wertaufbewahrungsmittel — die drei klassischen Geldfunktionen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das sind Geldformen, nicht Geldfunktionen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das sind wirtschaftliche Prozesse, nicht Funktionen des Geldes.' },
  ] },
  { id: '3d39f572-f4c8-416f-b815-59b4ee2def24', fachbereich: 'VWL', musterlosung: 'Die Lorenzkurve zeigt die personelle Einkommensverteilung zu einem bestimmten Zeitpunkt. Die X-Achse gibt die kumulierten Bevölkerungsanteile an, die Y-Achse die kumulierten Einkommensanteile. Je bauchiger die Kurve, desto ungleicher ist die Verteilung. Perfekte Gleichverteilung wäre die 45°-Linie.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das wäre die Phillips-Kurve — Inflation und Arbeitslosigkeit.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Personelle Einkommensverteilung zu einem Zeitpunkt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Staatsausgaben werden mit anderen Darstellungen visualisiert.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: BIP-Entwicklung ist eine Zeitreihe, keine Verteilungskurve.' },
  ] },
  { id: '3dd64eb1-ac68-437a-86e8-425b37b9b5e0', fachbereich: 'VWL', musterlosung: 'Mehr Geld bei gleicher Gütermenge treibt die Preise. Wird unbegrenzt Geld gedruckt, kommt es zur Hyperinflation — das Geld verliert seinen Wert. Historische Beispiele: Deutschland 1923, Simbabwe 2008, Venezuela 2018. Wohlstand hängt von realer Güterproduktion ab, nicht von der Geldmenge.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Hyperinflation zerstört den Geldwert — kein Paradies, sondern eine Katastrophe.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Zinserhöhungen würden die Inflation teilweise bremsen, aber nicht lösen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das Geld wäre wertlos — niemand könnte damit etwas kaufen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Produktion hängt an realen Ressourcen, nicht an der Geldmenge.' },
  ] },
  { id: '3e01c2a3-3679-499c-aeb8-6bf6b355973c', fachbereich: 'VWL', musterlosung: 'Opportunitätskosten entstehen, weil Ressourcen knapp sind und Entscheidungen Verzicht bedeuten. Nur die BESTE nicht gewählte Alternative zählt, nicht die Summe. Auch kostenlose Angebote haben Opportunitätskosten — mindestens Zeit. Je nach Person (Einkommen, Zeitwert) können sie unterschiedlich hoch sein.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Knappheit erzwingt Auswahl — daraus entstehen Opportunitätskosten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Nur die beste nicht gewählte Alternative zählt, nicht die Summe aller.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Zeitaufwand macht auch «gratis» nicht kostenlos.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Individuelle Präferenzen und Zeitwert variieren — Kosten können unterschiedlich hoch sein.' },
  ] },
  { id: '3eb92edf-856c-495d-a912-b21ae42c396b', fachbereich: 'VWL', musterlosung: 'Sinkt der Nominalzins, sinken auch die Opportunitätskosten der Geldhaltung — der entgangene Zinsertrag durch das Halten von Geld statt Sparen wird kleiner. Deshalb halten Publikum und Unternehmen mehr Geld; die Geldnachfrage steigt. Das ist ein Kernmechanismus der Geldpolitik.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Transaktionsmotiv hängt primär an Y (Einkommen), nicht am Zins.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Nominalzins sagt direkt nichts über den Geldwert aus.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Tieferer Zins = geringere Opportunitätskosten → mehr Geldhaltung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: R beeinflusst die Geldnachfrage direkt über Opportunitätskosten, nicht nur die Sparquote.' },
  ] },
  { id: '3ebad239-c433-4566-89e3-c36255cec524', fachbereich: 'VWL', musterlosung: 'Das Drei-Säulen-Konzept kombiniert staatliche Vorsorge (1. Säule: AHV/IV), berufliche Vorsorge (2. Säule: Pensionskasse) und private Vorsorge (3. Säule: 3a/3b). Ziel ist, dass die drei Säulen zusammen ca. 60 Prozent des letzten Lohns im Alter sicherstellen — Verfassungsauftrag.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Steuersätze sind nicht das Konzept — es geht um Altersvorsorge.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: AHV + Pensionskasse + 3a/3b — Drei-Säulen-Konzept der Schweizer Altersvorsorge.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Krankenkassen sind ein anderes Versicherungsgebiet.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Föderale Ebenen sind nicht das Konzept — es geht um Vorsorgearten.' },
  ] },
  { id: '3ef08ca1-cc6e-4ed1-bf24-82330b7ab765', fachbereich: 'VWL', musterlosung: 'In den 1970er-Jahren erlebten viele Länder Stagflation — gleichzeitige Stagnation und Inflation. Die keynesianische Theorie konnte das nicht gut erklären. Die Monetaristen um Friedman boten eine alternative Lesart (übermässige Geldmengenausweitung als Ursache) und gewannen massiv an Einfluss, unter anderem in der Thatcher- und Reagan-Politik.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: In den 30ern dominierte der Aufstieg des Keynesianismus, nicht des Monetarismus.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: 1970er/80er — Stagflation als Anlass für die monetaristische Wende.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Im 1. Weltkrieg gab es noch keine ausgeprägte monetaristische Schule.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: In der Coronakrise dominierten eher keynesianische Stimuli.' },
  ] },
  { id: '3fdd50d9-eaef-4c15-9741-dd10bb0690be', fachbereich: 'VWL', musterlosung: 'Eine Volkswirtschaft kann wirtschaftlich nur auf zwei Arten wachsen: Entweder werden mehr Arbeitsstunden geleistet (extensives Wachstum) oder die Arbeitsproduktivität steigt (intensives Wachstum). Alle anderen Faktoren — Investitionen, Technik, Bildung — wirken über diese beiden Kanäle.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Aussenhandel erhöht den Wohlstand, verändert aber nicht die Produktionsbasis.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Mehr Arbeitsstunden oder höhere Produktivität — die zwei Grundmechanismen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Geldmenge und Steuern wirken indirekt, nicht als Grundmechanismen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Rohstoffe und Arbeitskräfte zählen zu den Produktionsfaktoren — sie sind Zwischenschritte, nicht die Grundlogik.' },
  ] },
  { id: '402c0349-e0ec-4813-9eca-2e61f91ddb29', fachbereich: 'VWL', musterlosung: 'Die Geldschöpfung der Geschäftsbanken wird begrenzt durch Kreditnachfrage (Haushalte und Firmen müssen Kredite wollen), Mindestreserve- und Eigenkapitalvorschriften sowie Bonitätsprüfung (Banken vergeben nur Kredite an zahlungsfähige Kunden). Die Anzahl Bankomaten hat damit nichts zu tun.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Ohne Kreditnachfrage keine Geldschöpfung — unabhängig vom Angebot der Banken.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Mindestreserven binden Liquidität und begrenzen die Schöpfungsmenge.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Banken prüfen Bonität — nicht jede Nachfrage wird zu einem Kredit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Bankomaten-Zahl beeinflusst die Bargeldverteilung, nicht die Geldschöpfung.' },
  ] },
  { id: '4054b070-4ec5-4988-b585-1fab7350de0f', fachbereich: 'VWL', musterlosung: 'Bei der Einkommenssteuer steht der Fiskalzweck im Vordergrund: Sie soll dem Staat die Mittel zur Finanzierung seiner Aufgaben verschaffen. Die Einkommenssteuer ist eine der wichtigsten Einnahmequellen. Neben dem Fiskalzweck hat sie auch einen Umverteilungseffekt (Progression), aber der Hauptzweck ist die Finanzierung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Kontrollzweck ist bei Abgaben wie der Motorfahrzeugsteuer relevanter.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Umverteilung ist Nebeneffekt, nicht Hauptzweck der Einkommenssteuer.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Fiskalzweck = Finanzierung der Staatsaufgaben — Hauptzweck der Einkommenssteuer.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Lenkungssteuern (CO₂, Tabak) sollen Verhalten steuern — nicht die Einkommenssteuer.' },
  ] },
  { id: '40f9205e-e9d1-41b1-b532-6c42ad3ff7f1', fachbereich: 'VWL', musterlosung: 'Die Überinvestitionstheorie erklärt Rezessionen damit, dass Unternehmen bei tiefen Kreditzinsen im Verhältnis zur erwarteten Rendite zu stark in Kapazitäten investieren. Das erzeugt ein Überangebot. Wenn die Nachfrage dann nicht mithält, bricht der Markt ein und es folgt eine Rezession. Eine angebotsseitige Erklärung des Zyklus.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das ist das Crowding-out-Argument, nicht Überinvestition.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Hohe Zinsen bremsen Investitionen — Überinvestition geschieht bei tiefen Zinsen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Zu viel Sparen wäre Unterkonsumtionstheorie — eine andere Schule.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Zinsen unter erwarteter Rendite → Kapazitätsüberhang → Rezession.' },
  ] },
  { id: '4306955f-3cb7-4a8d-9377-031bfa9df0f8', fachbereich: 'VWL', musterlosung: 'Drei klassische Wege aus dem Gefangenendilemma: Kommunikation ermöglicht Absprachen und Vertrauen. Sanktionen bestrafen Vertragsbruch und erhöhen die Kooperationskosten. Wiederholte Interaktion macht Kooperation langfristig lohnend — Vergeltung bei Abweichung droht. Axelrod zeigte in Turnieren, dass «nett, vergeltend, verzeihend, klar» die beste Strategie ist.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das Dilemma ist überwindbar — dafür gibt es die genannten drei Wege.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Gesetze sind nur ein Weg — Kommunikation und Wiederholung wirken oft ohne Gesetz.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Geld und weniger Regeln lösen kein Dilemma — Anreize müssen kollektiv reguliert werden.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Kommunikation, Sanktionen, Wiederholung — die drei etablierten Lösungswege.' },
  ] },
  { id: '4312907b-af02-4115-b0ca-b9d9f4377b6c', fachbereich: 'VWL', musterlosung: 'Humankapital umfasst Wissen, Fähigkeiten und Erfahrung von Menschen. Sprachkurse für Angestellte und ein Informatikstudium sind Investitionen in Humankapital. Eine Autobahnbrücke ist Infrastruktur (Sachkapital), CNC-Fräsmaschinen sind ebenfalls Realkapital. Humankapital-Investitionen wirken langfristig auf Produktivität und Wachstum.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Sprachkurse erhöhen die Fähigkeiten der Angestellten — Humankapital.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Eine Autobahnbrücke ist Sachkapital (Infrastruktur), nicht Humankapital.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Ein Studium erhöht Wissen und Qualifikation — Humankapital-Aufbau.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Maschinen sind Realkapital, nicht Humankapital.' },
  ] },
  { id: '43ea4bba-9fc8-4a11-87e5-812053da7af6', fachbereich: 'VWL', musterlosung: 'Für Milanovic gibt es zwei Arten von Ungleichheit: «Gute» Ungleichheit entsteht durch Leistungsanreize — sie motiviert und treibt Wachstum. «Schlechte» Ungleichheit entsteht durch Rent-Seeking, Privilegien und fehlenden Bildungszugang. Sie zementiert Ungleichheit über Generationen und behindert Chancengleichheit.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Unterschied ist nicht die Vermögensart, sondern die Ursache der Ungleichheit.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Beide Formen existieren überall — nicht länderspezifisch.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Milanovic unterscheidet gerade — nicht jede Ungleichheit ist schlecht.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Gute Ungleichheit = Leistungsanreize, schlechte = Privilegien und fehlende Chancengleichheit.' },
  ] },
  { id: '442278fe-5d74-4c0b-9228-66656efe1cb9', fachbereich: 'VWL', musterlosung: 'Nach Einführung eines Höchstpreises P_H (unter dem Gleichgewichtspreis) besteht die Konsumentenrente aus A + B. A war schon vorher Teil der KR (Dreieck oberhalb P*). B wurde von den Produzenten umverteilt — durch den tieferen Preis P_H geht ein Teil der früheren Produzentenrente an die Konsumenten. C geht als Wohlfahrtsverlust verloren.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Fläche A war schon vor dem Höchstpreis Teil der KR.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Fläche B wurde von der PR in die KR umverteilt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Fläche C ist Wohlfahrtsverlust — sie verschwindet aus der Wohlfahrt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Fläche D bleibt verbleibende Produzentenrente — nicht Teil der KR.' },
  ] },
  { id: '44f86f2a-4402-454c-a959-3ff20f3689e9', fachbereich: 'VWL', musterlosung: 'Pareto-Effizienz nach Vilfredo Pareto beschreibt eine Situation, in der keine Umverteilung möglich ist, die jemanden besserstellt, ohne jemand anderen schlechter zu stellen. Das Marktgleichgewicht bei vollkommener Konkurrenz ist pareto-effizient — aber nicht automatisch «gerecht» im normativen Sinn.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das ist die 80/20-Regel (Pareto-Verteilung), nicht Pareto-Effizienz.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Staatliche Wohlfahrtsmaximierung ist ein anderes Konzept.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Gleichverteilung muss nicht pareto-effizient sein.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Niemand bessergestellt werden kann ohne einen anderen schlechterzustellen — Pareto-Kriterium.' },
  ] },
  { id: '453aa260-f907-4186-8ea2-a8cfdce7e971', fachbereich: 'VWL', musterlosung: 'Öffentliche und Allmendegüter sind beide nicht-ausschliessbar. Der Unterschied liegt in der Rivalität: Bei Allmendegütern (Fisch, Weide) mindert die Nutzung einer Person die Verfügbarkeit für andere — sie sind rival im Konsum. Öffentliche Güter (Landesverteidigung, Strassenbeleuchtung) sind hingegen nicht-rival.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Umgekehrt — Allmendegüter sind rival, öffentliche Güter nicht.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Beide sind nicht-ausschliessbar — das ist das Gemeinsame.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Rivalität im Konsum unterscheidet Allmende- von öffentlichen Gütern.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Begriffe sind klar unterschieden — nicht synonym.' },
  ] },
  { id: '453e1a02-a5b3-4ed4-b7c8-f9de38e37fd1', fachbereich: 'VWL', musterlosung: 'Langzeitarbeitslosigkeit erhöht das Armutsrisiko massiv — die ALV-Taggelder sind zeitlich befristet (max. 520 Taggelder für über 55-Jährige). Nach der Aussteuerung bleibt oft nur die Sozialhilfe. Arbeitslosigkeit betrifft nicht nur das Einkommen, sondern auch soziale Integration und Selbstwert. Der Übergang in Armut erfolgt meist schleichend.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Befristete ALV-Leistungen erhöhen das Armutsrisiko bei Langzeitarbeitslosigkeit.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Arbeitslosigkeit wirkt auf soziale Integration und Selbstwert — nicht nur finanziell.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die ALV ist zeitlich befristet — kein vollständiger Armutsschutz.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Schleichender Übergang ALV → Aussteuerung → Sozialhilfe.' },
  ] },
  { id: '456fe5cf-338c-43c0-b5b9-aa47f2577a2e', fachbereich: 'VWL', musterlosung: 'Das Jevons-Paradoxon (1865) beschreibt, dass Effizienzsteigerungen NICHT zu Ressourceneinsparungen führen, weil die günstigere Ressource zu höherer Nutzung führt. Beispiel: Effizientere Dampfmaschinen führten zu MEHR Kohleverbrauch. Modern: LED-Lampen sparen Strom pro Stunde, aber Menschen lassen mehr Licht länger brennen. Effizienz allein reicht nicht zur Ressourcenschonung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das ist gerade NICHT der Fall — das ist der naive Effizienz-Optimismus.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das ist Preiselastizität der Nachfrage, nicht Jevons.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Regulierung ist ein anderer Ansatz — Jevons ist deskriptiv.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Günstigere Ressource → mehr Nutzung → Effizienzgewinn wird aufgezehrt.' },
  ] },
  { id: '45d2b4b0-f20c-4b28-b62e-4a04d1c9bcef', fachbereich: 'VWL', musterlosung: 'Der Produktionsfaktor Wissen umfasst Humankapital (Berufserfahrung, Ausbildung, Fähigkeiten) und technisches Wissen (Patente, Know-how). Die Berufserfahrung einer Ärztin und ein Patent sind Wissen. Das Spitalgebäude und medizinische Geräte sind Sachkapital — produzierte Produktionsmittel.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Berufserfahrung ist Humankapital — Teil des Produktionsfaktors Wissen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das Gebäude ist Sachkapital — nicht Wissen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Patent = kodifiziertes technisches Wissen — Produktionsfaktor Wissen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Medizinische Geräte sind Sachkapital, nicht Wissen.' },
  ] },
  { id: '46d9434b-448f-498b-a83c-d15ec30ead4c', fachbereich: 'VWL', musterlosung: 'Nach der Steuer: Konsumentenrente = A (Dreieck oberhalb P_K unter der Nachfragekurve). Produzentenrente = F (Dreieck unterhalb P_P oberhalb der Angebotskurve). Steuereinnahmen = B + D (Rechteck zwischen P_K und P_P bis Q_t). Wohlfahrtsverlust = C + E (zwei Dreiecke rechts von Q_t). Die Gesamtwohlfahrt schrumpft.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Es gibt einen Wohlfahrtsverlust C + E — nicht null.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: KR = A, PR = F, Steuer = B + D, WV = C + E.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: C gehört nicht zur KR nach der Steuer — es ist Wohlfahrtsverlust.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: B und E sind falsch zugeordnet — B ist Steueraufkommen, E ist Wohlfahrtsverlust.' },
  ] },
  { id: '4829ac80-b9b4-40ab-9577-e606feb44631', fachbereich: 'VWL', musterlosung: 'Geld in der VWL ist der liquideste Teil des Vermögens — der Teil, der sich leicht und ohne Wertverlust in Güter und Dienstleistungen tauschen lässt. «Viel Geld haben» und «reich sein» sind deshalb nicht identisch: Reichtum umfasst auch Aktien, Immobilien und Kunstwerke, die nicht als Zahlungsmittel taugen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das wäre Vermögen — Geld ist nur der liquide Teil davon.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Liquidester Teil des Vermögens — VWL-Definition des Geldes.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Buchgeld gehört auch zum Geld — nicht nur Bargeld.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Immobilien sind Vermögen, aber kein Geld — zu illiquide.' },
  ] },
  { id: '494f7deb-fbb1-4293-a59a-4b47799da490', fachbereich: 'VWL', musterlosung: 'Anonymität verhindert Kooperation: Ohne Kommunikation können keine Absprachen getroffen werden, ohne Identifikation keine Trittbrettfahrer bestraft werden. Jeder Fischer maximiert rational seinen eigenen Fang. Kollektiv führt das zu Übernutzung und möglicher Zerstörung der Ressource — die klassische Allmende-Tragödie.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Fähigkeiten sind nicht das Thema — Anonymität beeinflusst das Verhalten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Ohne Kommunikation und Identifikation fehlen Vertrauen und Sanktionsdrohung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Grösse ist vorgegeben — sie erklärt nicht die Strategie.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Regeln sind in allen Bedingungen gleich — Anonymität ändert das Verhalten.' },
  ] },
  { id: '498f3e93-b056-448c-a642-dba1f664b492', fachbereich: 'VWL', musterlosung: 'Bei hoher Elastizität reagieren Angebot und Nachfrage stark auf die steuerbedingte Preisveränderung. Viele Transaktionen finden nicht mehr statt — die Menge sinkt deutlich. Das erzeugt einen grossen Wohlfahrtsverlust. Bei unelastischer Nachfrage oder unelastischem Angebot bleibt die Menge stabil und der Wohlfahrtsverlust ist gering.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Starke Mengenreaktion → viele entgangene Transaktionen → hoher WV.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Steuer kann weiter erhoben werden — die Einnahmen sind aber geringer.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Preise steigen durch die Steuer, nicht umgekehrt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bei hoher Elastizität sind die Einnahmen eher tief, nicht hoch.' },
  ] },
  { id: '49931067-3a4c-4554-9b70-525cd18f5211', fachbereich: 'VWL', musterlosung: 'Zwischen dem sozialen Optimum Q* und dem Marktgleichgewicht Q_M übersteigen die gesellschaftlichen Grenzkosten den gesellschaftlichen Grenznutzen. Jede zusätzliche Einheit in diesem Bereich verursacht mehr Kosten als Nutzen — es wird zu viel produziert. Der Wohlfahrtsverlust entspricht dem Dreieck dieser Differenz.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Konsumenten müssen die externen Kosten nicht kennen — entscheidend ist, dass sie nicht eingepreist sind.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Im Bereich Q* bis Q_M übersteigen gesellschaftliche Kosten den gesellschaftlichen Nutzen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Es gibt keine Steuer — die externen Effekte erzeugen den WV.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Produzenten produzieren zu viel (am Markt), nicht zu wenig.' },
  ] },
  { id: '499a7cf0-ff87-4e37-836a-342c4726fa3f', fachbereich: 'VWL', musterlosung: 'Ab einer bestimmten Grenze («effektive Untergrenze») lohnt es sich, Geld als Bargeld zu halten statt auf Konten mit negativer Verzinsung. Bargeld hat den impliziten Zins null. Die Lagerung ist zwar aufwendig, aber ab einem gewissen Negativzins günstiger. Die exakte Schwelle hängt von Lagerkosten und Versicherung ab.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Negative Zinsen sind rechtlich nicht verboten — die Grenze ist ökonomisch.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Reservewährung-Status wird hier nicht durch Zinsen bedroht.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Geschäftsbanken geben Negativzinsen teils weiter — das ist nicht die Grenze.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Ab einer gewissen Grenze rentiert Bargeldhortung mehr als Kontoguthaben.' },
  ] },
  { id: '49ab53a3-cb96-4f01-9840-e80546dfc6b2', fachbereich: 'VWL', musterlosung: 'Minimumprinzip: Das Ergebnis ist vorgegeben, der Aufwand wird minimiert. Logistikroute nach Basel: Ziel steht, kürzester Weg gesucht. 10\'000 Einheiten produzieren: Output fix, minimaler Materialverlust. Die beiden anderen Beispiele fixieren den Input (Monatsbudget, Trainingszeit) und sind damit Maximumprinzip.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Ziel (Basel) fix, Aufwand (Route) minimieren — Minimumprinzip.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Budget (CHF 500) fix, Nutzen maximieren — Maximumprinzip.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Output (10\'000 Stück) fix, Materialverlust minimieren — Minimumprinzip.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Zeit (60 Min) fix, Output (Kalorien) maximieren — Maximumprinzip.' },
  ] },
  { id: '4a610399-853f-4c5f-aeba-c06b4962fb72', fachbereich: 'VWL', musterlosung: 'Die Arbeitslosenquote misst die beim Arbeitsamt (RAV) registrierten Arbeitslosen in Prozent der Erwerbspersonen. Das SECO erfasst sie monatlich anhand der Meldedaten. Sie ist NICHT dasselbe wie die Erwerbslosenquote des BFS, die auf Stichprobenbefragungen basiert und international vergleichbar ist.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Nenner sind die Erwerbspersonen, nicht die Gesamtbevölkerung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das wäre eine Verhältniszahl ohne Arbeitslose — keine Arbeitslosenquote.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Registrierte Arbeitslose / Erwerbspersonen — SECO-Definition.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Stellensuchende ist ein weiterer Begriff — die Quote erfasst registrierte Arbeitslose.' },
  ] },
  { id: '4c4d2a73-393e-49af-828e-e0a4ca6eff7a', fachbereich: 'VWL', musterlosung: 'Knappheit ist ein relatives Konzept: Sie entsteht aus dem Verhältnis von Bedürfnissen zu verfügbaren Mitteln. Auch wohlhabende Gesellschaften sind mit Knappheit konfrontiert — z.B. Zeit, Bauland, Fachkräfte. Armut bedeutet dagegen, dass Grundbedürfnisse nicht gedeckt werden können — das ist etwas Anderes als Knappheit.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Knappheit = Bedürfnisse > Mittel. Grundkonzept der VWL.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Auch reiche Länder sind von Knappheit betroffen — Zeit, Umwelt, Fachkräfte.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Wohlstand eliminiert Knappheit nicht — er verschiebt sie.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Knappheit und Armut sind unterschiedliche Konzepte.' },
  ] },
  { id: '4c6c8fe5-83ac-4eb0-ae37-749a91d3be5e', fachbereich: 'VWL', musterlosung: 'Die Einordnung als freies oder wirtschaftliches Gut hängt von der Knappheit ab. Wasser ist in der Schweiz relativ günstig (geringe Knappheit), in der Wüste extrem teuer (hohe Knappheit). Saubere Luft kann in stark verschmutzten Städten zum wirtschaftlichen Gut werden. Die Güterklassifikation ist also kontextabhängig.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Klassifikation gilt für alle Güter, auch natürliche Ressourcen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Frei/wirtschaftlich ist nicht fix, sondern hängt von der lokalen Knappheit ab.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: In manchen Regionen ist Wasser frei — nicht immer wirtschaftlich.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Wasser in der Wüste ist das klassische Beispiel eines sehr knappen wirtschaftlichen Gutes.' },
  ] },
  { id: '4ceeeb29-b805-4cc1-9096-3f93ef7e1740', fachbereich: 'VWL', musterlosung: 'Frühindikatoren verändern sich vor dem Konjunkturverlauf und erlauben Prognosen. Auftragseingänge, Geschäftsklimaindex (KOF) und Konsumentenstimmung sind klassische Frühindikatoren. Die Arbeitslosenquote ist dagegen ein Spätindikator — der Arbeitsmarkt reagiert erst mit Verzögerung auf Konjunkturveränderungen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Auftragseingänge laufen der tatsächlichen Produktion voraus — Frühindikator.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Geschäftsklimaindex (KOF) misst Erwartungen — typischer Frühindikator.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Arbeitslosenquote reagiert verzögert — Spätindikator.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Konsumentenstimmung — Vorbote künftiger Konsumentscheidungen.' },
  ] },
  { id: '4d2dac9e-3a95-4ca8-8275-c436dd919691', fachbereich: 'VWL', musterlosung: 'Die stärkste Kritik an Maslow betrifft die starre Hierarchie: Empirisch lässt sich nicht belegen, dass Bedürfnisse strikt stufenweise befriedigt werden. In manchen Kulturen stehen soziale Bedürfnisse über individuellen Sicherheitsbedürfnissen. Eisenhut selbst relativiert: Menschen erfüllen Wünsche aus verschiedenen Ebenen gleichzeitig.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Maslow umfasst auch immaterielle Bedürfnisse wie Selbstverwirklichung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Maslow hat seine Theorie später erweitert — keine beweiskräftige Kritik.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Pyramide wird weltweit angewendet — kultureller Bias ist geringer als der Hierarchie-Bias.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Starre Hierarchie empirisch widerlegt — Bedürfnisgewichtung variiert stark.' },
  ] },
  { id: '4dbebef0-47ee-44d8-8c90-687c2ec03c1d', fachbereich: 'VWL', musterlosung: 'Das Schweizer Steuersystem ist dreistufig aufgebaut (Steuerföderalismus): Bund, Kantone und Gemeinden erheben eigene Steuern. Die Steuerbelastung variiert je nach Wohnort erheblich. Der Steuerwettbewerb zwischen Kantonen und Gemeinden ist die Grundlage dieses Systems.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Bezirke erheben keine eigenen Steuern — nur Bund, Kantone, Gemeinden.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Neben dem Bund erheben Kantone und Gemeinden Steuern.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Gemeinden fehlen — sie sind eigenständige Steuerhoheit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Bund, Kantone, Gemeinden — drei Ebenen des Steuerföderalismus.' },
  ] },
  { id: '4dbfac86-7d31-4b58-8dfe-672bb34a4cae', fachbereich: 'VWL', musterlosung: 'Die Steuerlast wird stets von der Marktseite mit der geringeren Preiselastizität getragen. Wer dem Preis schlechter ausweichen kann — also auf Preiserhöhungen kaum reagiert —, trägt den grösseren Teil der Steuer. Das gilt unabhängig davon, bei wem die Steuer formal erhoben wird.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Geringere Preiselastizität = weniger Ausweichmöglichkeit = höhere Steuerlast.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die formale Zuteilung ist für die wirtschaftliche Inzidenz irrelevant.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Es hängt von den Elastizitäten ab — Produzenten können den grösseren oder kleineren Teil tragen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Auch die Konsumentenlast hängt von den Elastizitäten ab, nicht automatisch auf ihn zu.' },
  ] },
  { id: '4eab1e8b-39b8-4586-8feb-3d16d943d1fa', fachbereich: 'VWL', musterlosung: 'Steuerwettbewerb bedeutet, dass Länder, Kantone oder Gemeinden versuchen, durch tiefe Steuersätze attraktive Steuerzahlende (wohlhabende Privatpersonen, profitable Unternehmen) anzulocken. Das Schweizer föderalistische System mit unterschiedlichen Kantons- und Gemeindesteuern ist ein typisches Beispiel dafür.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das wäre Wettbewerb zwischen Steuern — nicht zwischen Gebietskörperschaften.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Steuerzahlende wählen den günstigsten Standort — es sind nicht sie, die konkurrieren.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Gebiete locken mit tiefen Steuern attraktive Steuerzahlende an.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Verteilungsstreit ist NFA-Thema, nicht Steuerwettbewerb.' },
  ] },
  { id: '4ec8e1d6-fb51-46c8-8b8e-05e851b66f49', fachbereich: 'VWL', musterlosung: 'Je höher die Kaufkraft des Geldes, desto weniger braucht man für tägliche Einkäufe. Die nachgefragte Geldmenge sinkt. Umgekehrt: Bei tiefer Kaufkraft braucht man mehr Geld, die Nachfrage steigt. Das erklärt die negative Steigung der Geldnachfragekurve im Kaufkraft-Geldmenge-Diagramm.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Höhere Kaufkraft → weniger Geld nötig → Nachfrage sinkt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Kaufkraft und Kreditvergabe sind nicht direkt verknüpft.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Zentralbank steuert das Angebot, nicht die Nachfragekurve.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bei hoher Kaufkraft reicht weniger Geld — die Nachfrage sinkt, steigt nicht.' },
  ] },
  { id: '50ebd310-6b5c-47ea-ab0c-3ed835ce200e', fachbereich: 'VWL', musterlosung: 'Arbeitsteilung und Spezialisierung erhöhen die Produktivität: Jeder konzentriert sich auf das, was er am besten kann. Kräftige werden Bauarbeiter, Kreative Künstler, Unentwegte Volkswirtschafter (Eisenhut). Das entschärft das Knappheitsproblem und ermöglicht höheren Wohlstand — einer der wichtigsten Mechanismen moderner Wirtschaft.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Produktivität steigt durch Spezialisierung — Kernvorteil.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Preise hängen von vielen Faktoren ab — nicht automatisch tiefer.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Spezialisierung kann Arbeitslosigkeit sogar erhöhen bei Strukturwandel.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Spezialisierung führt gerade zu Lohnunterschieden — nicht Gleichheit.' },
  ] },
  { id: '5180e976-bff0-47ac-8263-a1bf506e38a0', fachbereich: 'VWL', musterlosung: 'Die soziale Wohlfahrt ist mit rund 22 Milliarden CHF (Rechnung 2018) der mit Abstand grösste Ausgabenposten des Bundes. Am stärksten gewachsen sind seit 2008 die Bildungsausgaben (+67 Prozent), aber in absoluter Höhe bleibt die soziale Wohlfahrt führend.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Verkehrsausgaben sind bedeutend, aber deutlich kleiner als soziale Wohlfahrt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Soziale Wohlfahrt — grösster Ausgabenposten des Bundes.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Bildung wächst am stärksten, liegt absolut aber unter der sozialen Wohlfahrt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Landesverteidigung ist in der Schweiz relativ klein — rund 5 Mrd CHF.' },
  ] },
  { id: '5259955c-a10f-4b39-b53d-b9376aaccecc', fachbereich: 'VWL', musterlosung: 'Ceteris Paribus heisst «unter sonst gleichen Bedingungen». In ökonomischen Modellen isoliert man damit einzelne Einflussfaktoren: Man verändert z.B. den Preis und hält alle anderen Faktoren (Einkommen, Präferenzen, Preise anderer Güter) konstant. So lassen sich saubere Wirkungsketten analysieren.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Alle anderen Einflussgrössen bleiben gleich — Definition von Ceteris Paribus.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Elastizität ist ein anderes Konzept — nicht synonym mit Ceteris Paribus.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Marktgleichgewicht wird mit Ceteris Paribus analysiert, ist aber nicht identisch.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Staatliche Preisfestlegung ist kein Bestandteil der Definition.' },
  ] },
  { id: '53ba2f89-049d-47a3-bf31-282d73b12740', fachbereich: 'VWL', musterlosung: 'Strukturelle Arbeitslosigkeit erfordert langfristige Massnahmen: Aus- und Weiterbildung passt Qualifikationen an, Förderung der Mobilität erleichtert den Wechsel zu neuen Stellen, Innovationsförderung schafft neue Arbeitsplätze. Konjunkturprogramme helfen hingegen gegen konjunkturelle Arbeitslosigkeit und können strukturelle Probleme sogar konservieren.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Bildung passt Qualifikationen an den Strukturwandel an.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Konjunkturprogramme wirken kurzfristig, nicht strukturell.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Mobilität hilft Arbeitskräften, Strukturlücken zu schliessen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Innovation schafft neue Arbeitsplätze für moderne Qualifikationen.' },
  ] },
  { id: '56c68d6d-e0d3-4b9c-b486-0caa72a9482b', fachbereich: 'VWL', musterlosung: 'Die Quantitätsgleichung M × V = P × Y muss stets erfüllt bleiben. Ist V konstant und wächst M stärker als Y, muss P steigen — Inflation. Der Satz «zu viel Geld jagt zu wenig Güter» ist die intuitive Form dieser Gleichung. Grundlage monetaristischer Inflations-Analyse.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Y ist kurzfristig exogen — es passt sich nicht automatisch an die Geldmenge an.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Bei konstantem V und starkem M-Wachstum muss P steigen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: M wird von der Zentralbank gesteuert — nicht selbstregulierend.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: V wurde als konstant angenommen — es sinkt nicht als Ausgleich.' },
  ] },
  { id: '56cd49bc-fb59-4b0a-a56d-afc0c13574c3', fachbereich: 'VWL', musterlosung: 'Nominales BIP = Produktion zu aktuellen Marktpreisen — enthält Preisveränderungen. Reales BIP = Produktion zu konstanten Preisen eines Basisjahres — inflationsbereinigt. Nur das reale BIP zeigt die tatsächliche Mengenveränderung und erlaubt den sinnvollen Vergleich zwischen Jahren.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Genau umgekehrt — das reale BIP bereinigt Inflation, nicht das nominale.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Unterschied ist zentral und praktisch relevant.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Nominal = aktuelle Preise; Real = Basisjahrpreise (inflationsbereinigt).' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Reales BIP wird für alle Länder berechnet — Standardindikator.' },
  ] },
]

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
  console.log(`Session 13: ${updates.length} Fragen appended (${withTeile} mit Teilerklärungen, ${updates.length - withTeile} ohne).`)
  console.log(`Total verarbeitet: ${state.verarbeitet} / ${state.totalFragen}`)
}

main().catch(err => { console.error(err); process.exit(1) })
