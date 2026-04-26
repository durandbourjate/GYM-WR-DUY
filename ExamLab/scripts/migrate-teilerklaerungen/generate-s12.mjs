#!/usr/bin/env node
/**
 * Session 12: 100 VWL-Fragen (40 lueckentext + 60 mc)
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  // ============ LÜCKENTEXT (40) ============
  { id: '95ae298c-ce5a-4d81-83a8-e68a591cf684', fachbereich: 'VWL', musterlosung: 'Übersteigt die nachgefragte Menge das Angebot, spricht man von einem Nachfrageüberhang (Mangel). Im umgekehrten Fall — wenn das Angebot grösser ist als die Nachfrage — besteht ein Angebotsüberhang (Überschuss). Beide Ungleichgewichte drücken Preisdruck aus: Bei Mangel steigt der Preis, bei Überschuss fällt er. So tendiert der Markt zurück zum Gleichgewichtspreis.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Nachfrageüberhang (Mangel, Engpass): Nachgefragte Menge übersteigt das Angebot — Preis steigt.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Angebotsüberhang (Überschuss): Angebot übersteigt die Nachfrage — Preis sinkt.' },
  ] },
  { id: '99b78e93-a19c-4db4-941c-eff66e5d3c6a', fachbereich: 'VWL', musterlosung: 'Die Sozialhilfefalle (Armutsfalle) beschreibt die Situation, in der sich Erwerbsarbeit finanziell kaum lohnt: Der Wegfall von Transferleistungen hebt den zusätzlichen Verdienst weitgehend auf. Der Grenzsteuersatz liegt nahe 100 Prozent. Dadurch sinkt der Arbeitsanreiz und ein Verbleib in der Sozialhilfe wird rational. Diese Nebenwirkung gilt als klassisches Beispiel für Staatsversagen im Sozialbereich.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Sozialhilfefalle (Armutsfalle): Situation, in der sich Erwerbsarbeit finanziell kaum lohnt.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Transferleistungen (Sozialhilfe) entfallen bei Aufnahme einer Erwerbstätigkeit — kompensieren den Mehrverdienst.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Reduziert (vermindert, gesenkt): Der marginale Nettoverdienst ist so tief, dass Arbeit sich nicht lohnt.' },
  ] },
  { id: '9b826021-7f70-4611-b789-395753591a71', fachbereich: 'VWL', musterlosung: 'Ein anhaltender Anstieg des allgemeinen Preisniveaus heisst Inflation (Teuerung). Das Gegenteil — ein anhaltendes Sinken des Preisniveaus — heisst Deflation. Entscheidend ist das allgemeine Niveau: Einzelne Preisänderungen (z.B. Benzin) bedeuten noch keine Inflation. In der Schweiz misst das BFS die Teuerung mit dem Landesindex der Konsumentenpreise.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Teuerung (Inflation): Anhaltender Anstieg des allgemeinen Preisniveaus über längere Zeit.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Deflation: Anhaltendes Sinken des Preisniveaus — seltener als Inflation, aber gefährlich für die Konjunktur.' },
  ] },
  { id: '9c899a26-48be-4e9d-bab6-990a46c69f37', fachbereich: 'VWL', musterlosung: 'Das Gefangenendilemma zeigt den Konflikt zwischen individuellem und kollektivem Interesse: Jeder hat einen Anreiz, nicht zu kooperieren, auch wenn Kooperation für alle besser wäre. Die nicht-kooperative Wahl heisst dominante Strategie, weil sie individuell immer zum besseren Ergebnis führt. Das Resultat ist ein schlechteres Gesamtergebnis — ein zentrales Beispiel der Spieltheorie.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Kooperation (kooperieren): Die gemeinsame Handlung, die individuell riskant, kollektiv aber optimal wäre.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Kooperation (Zusammenarbeit): Auf Gruppenebene wäre dies das bessere Ergebnis.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Dominant: Strategie, die unabhängig vom Verhalten der anderen individuell am besten abschneidet.' },
  ] },
  { id: 'a0b7e978-d0c3-4f24-bba4-1e3e617c2b43', fachbereich: 'VWL', musterlosung: 'Rawls\' Gedankenexperiment heisst «Schleier des Unwissens» (englisch: veil of ignorance). Hinter diesem Schleier kennen die Menschen weder ihr Geschlecht noch ihre Gesundheit, ihr Vermögen oder ihren sozialen Status. Sie wählen eine Gesellschaftsordnung, ohne zu wissen, welche Position sie einnehmen werden. Rawls folgert daraus ein gerechtes Gesellschaftsmodell mit Freiheits- und Differenzprinzip.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Unwissens (Unwissenheit): Zentraler Begriff bei Rawls — die Teilnehmenden kennen ihre spätere Lage nicht.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Position (Rolle): Die eigene Stellung in der Gesellschaft bleibt hinter dem Schleier verborgen.' },
  ] },
  { id: 'a59a0844-5911-4762-902f-36c6069e88d0', fachbereich: 'VWL', musterlosung: 'Steuerparadiese kennzeichnen vier zentrale Merkmale: tiefe oder keine Steuern auf Unternehmensgewinne und Kapitalerträge, mangelnde Transparenz (Bankgeheimnis), geringe Substanzanforderungen (keine echte wirtschaftliche Tätigkeit nötig) und politische Stabilität. Diese Kombination zieht multinationale Konzerne und vermögende Privatpersonen an. Die OECD-Mindestbesteuerung soll solchen Standorten künftig entgegenwirken.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Tiefe oder keine Steuern auf Unternehmensgewinne und Kapitalerträge — das Kernmerkmal eines Steuerparadieses.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Geringe Substanzpflicht: Firmen benötigen keine reale wirtschaftliche Tätigkeit im Standortland.' },
  ] },
  { id: 'a6cbe4d4-e092-469c-bc8c-6c681f5dc9a2', fachbereich: 'VWL', musterlosung: 'Gemäss der keynesianischen Konzeption bestimmt die Gesamtnachfrage (Konsum + Investitionen + Staatsausgaben + Nettoexporte) die Wirtschaftsleistung und die Beschäftigung. Bei einem Nachfragedefizit kommt es zu Unterauslastung und Arbeitslosigkeit. Keynes plädierte deshalb für antizyklische Staatsausgaben in Rezessionen — im Gegensatz zum klassischen Denken, das auf Selbstregulierung der Märkte setzte.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Gesamtnachfrage (Nachfrageseite): Konsum, Investitionen, Staatsausgaben, Nettoexporte — entscheidet über die Produktion.' },
  ] },
  { id: 'aa3748b0-715a-40c1-bdc4-b268852ef100', fachbereich: 'VWL', musterlosung: 'Die Konsumentenrente ist im Preis-Mengen-Diagramm die Fläche zwischen der Nachfragekurve und dem Marktpreis. Sie misst den Nutzenüberschuss: Konsumenten wären bereit, mehr zu zahlen, müssen aber nur den Gleichgewichtspreis bezahlen. Je grösser diese Fläche, desto stärker profitieren die Konsumenten vom Tausch. Zusammen mit der Produzentenrente ergibt sie die Gesamtwohlfahrt.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Nachfragekurve: Bildet die maximale Zahlungsbereitschaft der Konsumenten ab — Oberkante der Konsumentenrente.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Marktpreis: Der tatsächlich bezahlte Preis — Unterkante der Konsumentenrente.' },
  ] },
  { id: 'ac4a0504-22f0-48bb-af71-9d6a85e5dc9b', fachbereich: 'VWL', musterlosung: 'Keynes forderte, dass der Staat in Rezessionen die öffentlichen Ausgaben erhöht, um die einbrechende Privatnachfrage zu ersetzen. Diese Politik heisst antizyklische Fiskalpolitik: Der Staat wirkt bewusst gegen den Konjunkturzyklus. In der Rezession gibt er mehr aus, im Boom spart er. Ziel ist die Stabilisierung der Nachfrage und damit der Beschäftigung.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Ausgaben (öffentliche Ausgaben): Staatsausgaben ersetzen in Rezessionen die einbrechende Privatnachfrage.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Antizyklisch: Der Staat handelt gegen den Konjunkturzyklus — in der Rezession ausgeben, im Boom sparen.' },
  ] },
  { id: 'acc5fd0b-9c83-4f72-9d78-330a794007ae', fachbereich: 'VWL', musterlosung: 'Die Nobelpreisträgerin Elinor Ostrom (1933–2012) zeigte, dass Gemeinschaften ihre natürlichen Ressourcen oft selbst verwalten können, ohne dass der Staat eingreifen muss. Sie widerlegte damit die verbreitete These der «Tragödie der Allmende». Als Beispiele nannte sie Schweizer Alpgenossenschaften und asiatische Bewässerungssysteme. 2009 erhielt sie den Wirtschaftsnobelpreis.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Ostrom: Elinor Ostrom, Wirtschaftsnobelpreisträgerin 2009 — erforschte die kollektive Ressourcenverwaltung.' },
  ] },
  { id: 'af43d089-6b17-4457-9502-acd2d42de5e1', fachbereich: 'VWL', musterlosung: 'Die Elefantengrafik stellt auf der X-Achse die Einkommensperzentile der globalen Verteilung dar und auf der Y-Achse die prozentuale Veränderung der realen Einkommen zwischen 1988 und 2008. Die charakteristische Form erinnert an einen Elefanten: starkes Wachstum bei der aufstrebenden Mittelschicht und den Superreichen, Stagnation bei der westlichen Unterschicht.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Einkommensperzentile: Alle Menschen sind nach ihrem Einkommen geordnet (0 = ärmste, 100 = reichste).' },
    { feld: 'luecken', id: 'luecke-1', text: 'Realen Einkommen: Preisbereinigte Kaufkraft — zeigt die tatsächliche Wohlstandsveränderung.' },
  ] },
  { id: 'b2a50d84-9590-46e1-abf7-404d308a6d9a', fachbereich: 'VWL', musterlosung: 'Die Bundesausgaben für Bildung und Forschung sind zwischen 2008 und 2018 mit rund 67 Prozent am stärksten gewachsen. Dahinter folgte die soziale Wohlfahrt mit +27 Prozent. Andere Bereiche wuchsen deutlich schwächer oder sanken (Finanzen und Steuern: −5 Prozent). Bildung und Forschung gelten als Investitionsausgabe mit langfristigem Wachstumseffekt.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Bildung: Bildungs- und Forschungsausgaben wuchsen im Zeitraum mit Abstand am stärksten.' },
    { feld: 'luecken', id: 'luecke-1', text: '67: Zuwachs der Bildungsausgaben des Bundes zwischen 2008 und 2018 in Prozent.' },
  ] },
  { id: 'b6a53f80-3b8a-4a8b-a1e8-303204243244', fachbereich: 'VWL', musterlosung: 'Die Volkswirtschaftliche Gesamtrechnung erfasst nur monetäre Flüsse — also Transaktionen, die in Franken bezahlt wurden. Deshalb fehlen im BIP die Schattenwirtschaft und unbezahlte Eigenleistungen (z.B. Haus- und Familienarbeit). Auch Umweltschäden werden nicht als Kosten abgezogen. Das BIP ist deshalb als Wohlstandsmass beschränkt und wird durch Zusatzindikatoren ergänzt.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Monetäre (geldmässige) Flüsse: Nur in Geld bewertete Transaktionen fliessen ins BIP ein.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Schattenwirtschaft: Schwarzarbeit und Eigenarbeit sind nicht erfasst — obwohl sie Wohlstand schaffen.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Umweltschäden (externe Kosten): Werden vom BIP nicht abgezogen — das BIP überschätzt so den Wohlstand.' },
  ] },
  { id: 'b7ea185c-c37a-4b85-9232-74590497ad97', fachbereich: 'VWL', musterlosung: 'Öffentliche Güter zeichnen sich durch Nicht-Rivalität im Konsum und Nicht-Ausschliessbarkeit vom Konsum aus. Nicht-Rivalität heisst: Der Konsum einer Person beeinträchtigt nicht den Konsum anderer. Nicht-Ausschliessbarkeit heisst: Niemand kann vom Konsum ausgeschlossen werden. Beispiele sind Landesverteidigung, Strassenbeleuchtung oder Hochwasserschutz. Private Märkte versagen bei solchen Gütern — der Staat organisiert sie meistens.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Nicht-Rivalität (keine Rivalität): Der Konsum einer Person schmälert nicht den Konsum anderer.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Nicht-Ausschliessbarkeit (keine Ausschliessbarkeit): Niemand kann vom Konsum ausgeschlossen werden.' },
  ] },
  { id: 'b919a7da-d412-4d4f-9ac2-a6db56c642df', fachbereich: 'VWL', musterlosung: 'Unter wirtschaftlichem Wachstum versteht man die langfristige Entwicklung des realen BIP pro Einwohner. «Real» bedeutet preisbereinigt: Inflationseffekte werden herausgerechnet. «Pro Einwohner» rechnet das Bevölkerungswachstum heraus, damit man die tatsächliche Wohlstandsentwicklung pro Person sieht. Nur dieses Mass zeigt, ob der Durchschnittsbürger wirtschaftlich besser gestellt ist als früher.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Reelles (reales) BIP: Preisbereinigt — Inflationseffekte werden herausgerechnet.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Pro Einwohner: Bevölkerungswachstum wird herausgerechnet, um die individuelle Wohlstandsentwicklung zu zeigen.' },
  ] },
  { id: 'bf4a9e24-6f63-45a7-8bb0-73ed98e81883', fachbereich: 'VWL', musterlosung: 'Ein konjunkturelles Defizit entsteht in Rezessionsphasen und verschwindet im Aufschwung von selbst — die automatischen Stabilisatoren (Steuereinnahmen, Arbeitslosengeld) wirken antizyklisch. Ein strukturelles Defizit hingegen besteht auch bei normaler Konjunkturlage. Es ist dauerhaft und muss durch politische Massnahmen (Ausgabenkürzungen, Steuererhöhungen) aktiv beseitigt werden.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Konjunkturelles Defizit: Tritt in Rezessionen auf und verschwindet im Aufschwung von selbst — vorübergehend.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Strukturelles Defizit: Besteht auch bei Normalkonjunktur — muss aktiv politisch beseitigt werden.' },
  ] },
  { id: 'c00e729e-a0c7-4b6b-ab29-be8689afb3eb', fachbereich: 'VWL', musterlosung: 'Der Crowding-Out-Effekt (Verdrängungseffekt) beschreibt, wie staatliche Kreditaufnahme am Kapitalmarkt die Zinsen erhöht und dadurch private Investitionen verdrängt. Monetaristen nutzen dieses Argument gegen die keynesianische Fiskalpolitik: Eine Nachfragestimulierung durch mehr Staatsausgaben werde teilweise neutralisiert, weil gleichzeitig private Investitionen zurückgehen. Die Gesamtwirkung auf die Konjunktur bleibe daher begrenzt.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Crowding Out (Verdrängungseffekt): Staatliche Kreditaufnahme verdrängt private Investitionen über steigende Zinsen.' },
  ] },
  { id: 'c1d5ac79-a648-439d-961a-605af5fd4549', fachbereich: 'VWL', musterlosung: 'Die Gesamtwohlfahrt (Gesamtrente) ist die Summe aus Konsumentenrente (KR) und Produzentenrente (PR). Im Gleichgewicht bei vollkommener Konkurrenz wird diese Gesamtrente maximiert — das ist das zentrale Effizienzkriterium der Markttheorie. Staatliche Eingriffe wie Steuern oder Höchstpreise reduzieren die Gesamtwohlfahrt, weil sie den Handel einschränken. Den entstehenden Verlust nennt man Wohlfahrtsverlust.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'KR: Konsumentenrente — Nutzenüberschuss der Konsumenten im Marktgleichgewicht.' },
    { feld: 'luecken', id: 'luecke-1', text: 'PR: Produzentenrente — Gewinnüberschuss der Produzenten im Marktgleichgewicht.' },
  ] },
  { id: 'c20882e4-ad90-4e7b-9948-0baef4d5898b', fachbereich: 'VWL', musterlosung: 'Der Gini-Koeffizient misst die Ungleichheit einer Einkommensverteilung. Er nimmt Werte zwischen null (vollständige Gleichverteilung — alle haben gleich viel) und eins (maximale Ungleichheit — eine Person hat alles) an. Grafisch entspricht er dem Verhältnis aus der Fläche zwischen 45-Grad-Linie und Lorenzkurve zur Gesamtfläche unterhalb der Gleichverteilungslinie.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Gini-Koeffizient: Standardmass für Einkommens- oder Vermögensungleichheit in einer Bevölkerung.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Null: Perfekte Gleichverteilung — alle Personen haben exakt dasselbe Einkommen.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Eins: Maximale Ungleichheit — eine einzige Person erhält das gesamte Einkommen.' },
  ] },
  { id: 'c46dc9c2-a8fb-43ee-bb80-23c6b5ad54a4', fachbereich: 'VWL', musterlosung: 'Art. 100 der Bundesverfassung verpflichtet den Bund zu Massnahmen für eine ausgeglichene konjunkturelle Entwicklung. Insbesondere soll er Arbeitslosigkeit in der Rezession und Inflation in der Hochkonjunktur bekämpfen. Dieser Verfassungsauftrag ist die Grundlage für die antizyklische Fiskal- und Geldpolitik. Die SNB leitet aus Art. 99 BV ihren eigenständigen geldpolitischen Auftrag ab.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Konjunkturellen: Der Bund soll für Stabilität im Konjunkturzyklus sorgen — weder Boom noch Rezession zu stark.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Arbeitslosigkeit: Zentrales negatives Symptom einer Rezession — der Bund soll dagegen eingreifen.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Inflation: Hauptrisiko einer Hochkonjunktur — ebenso zu bekämpfen.' },
  ] },
  { id: 'c4f28910-9267-47b0-ac71-c30ffebba387', fachbereich: 'VWL', musterlosung: 'Die Fläche zwischen der Gleichverteilungslinie (45-Grad-Linie) und der Lorenzkurve heisst Ungleichheitsfläche oder Gini-Fläche. Je grösser diese Fläche, desto ungleichmässiger ist die Einkommensverteilung. Der Gini-Koeffizient berechnet sich als Verhältnis dieser Fläche zur gesamten Fläche unter der Gleichverteilungslinie. Er bewegt sich zwischen null und eins.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Ungleichheitsfläche (Gini-Fläche): Fläche zwischen 45-Grad-Linie und Lorenzkurve — Mass der Ungleichheit.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Ungleichmässiger: Je grösser die Fläche, desto ungleicher die Verteilung.' },
  ] },
  { id: 'c50b9c0a-307f-43aa-bb7c-088c57f3c82c', fachbereich: 'VWL', musterlosung: 'Die Erwerbsquote gibt den Anteil der Erwerbspersonen (Erwerbstätige plus Arbeitsuchende) an der Wohnbevölkerung im Alter von 15 bis 64 Jahren an. Sie zeigt, wie stark die erwerbsfähige Bevölkerung am Arbeitsmarkt teilnimmt. In der Schweiz liegt sie bei rund 84 Prozent — einer der höchsten Werte in Europa. Eine hohe Erwerbsquote stützt das Wirtschaftswachstum.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Erwerbsquote: Anteil der Erwerbspersonen an der Bevölkerung im erwerbsfähigen Alter.' },
    { feld: 'luecken', id: 'luecke-1', text: '15: Untergrenze des Erwerbsalters — entspricht dem Ende der obligatorischen Schulzeit.' },
    { feld: 'luecken', id: 'luecke-2', text: '64: Obergrenze — deckt die meisten Erwerbstätigen bis zum ordentlichen Rentenalter ab.' },
  ] },
  { id: 'c8559443-698b-48b4-8dba-c4fe4a60783f', fachbereich: 'VWL', musterlosung: 'Die Nachfragekurve spiegelt den Grenznutzen (die maximale Zahlungsbereitschaft) der Konsumenten wider: Für jede weitere Einheit sind sie nur bis zu einem bestimmten Preis bereit, zu zahlen. Die Angebotskurve spiegelt die Grenzkosten der Produzenten: Jede weitere Einheit muss mindestens ihre Grenzkosten decken. Der Gleichgewichtspreis entsteht im Schnittpunkt — hier entspricht die Wertschätzung genau den Kosten.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Grenznutzen (Wertschätzung): Maximale Zahlungsbereitschaft der Konsumenten für jede weitere Einheit.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Grenzkosten: Minimale Kosten, zu denen Produzenten eine weitere Einheit anbieten können.' },
  ] },
  { id: 'c9cda6b7-7e38-4f85-ac91-dcd9aaa68539', fachbereich: 'VWL', musterlosung: 'Subventionen sind unentgeltliche finanzielle Leistungen der öffentlichen Hand an Private oder andere Gebietskörperschaften. Sie machen beim Bund rund 60 Prozent der Gesamtausgaben aus. Die Schwerpunkte liegen in der sozialen Wohlfahrt (rund 45 Prozent aller Subventionen), gefolgt von Bildung und Forschung, Verkehr sowie Landwirtschaft. Ihre Höhe macht den Bund zum sogenannten «Transferhaushalt».', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Subventionen: Unentgeltliche finanzielle Leistungen der öffentlichen Hand an Dritte.' },
    { feld: 'luecken', id: 'luecke-1', text: '60: Anteil der Subventionen an den Bundesausgaben in Prozent.' },
  ] },
  { id: 'cc3dcb3f-9ebd-4add-87f2-524ee12cbf90', fachbereich: 'VWL', musterlosung: 'Wenn das Anstreben eines Ziels ein anderes fördert, spricht man von Zielharmonie. Behindert ein Ziel das andere, liegt Zielkonkurrenz (Zielkonflikt) vor. In der Fachsprache heissen solche Austauschbeziehungen Trade-offs. Ein klassisches Beispiel ist der Zielkonflikt zwischen Inflation und Arbeitslosigkeit (Phillips-Kurve) oder zwischen Wachstum und Umweltschutz.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Zielharmonie: Zwei Ziele fördern sich gegenseitig — Umsetzen des einen hilft auch dem anderen.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Zielkonkurrenz (Zielkonflikt): Zwei Ziele behindern sich — Fortschritt beim einen geht zulasten des anderen.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Trade-off: Fachbegriff für Austauschbeziehungen — man muss zwischen Zielen abwägen.' },
  ] },
  { id: 'cd946658-71f6-40a7-8634-22e4cf3d63e7', fachbereich: 'VWL', musterlosung: 'Jede Entscheidung beinhaltet einen Verzicht — man entscheidet sich für eine Option und gegen andere. Diesen Verzicht nennt man Opportunitätskosten (Verzichtskosten): den entgangenen Nutzen der nächstbesten Alternative. Austauschbeziehungen zwischen verschiedenen Zielen heissen in der Fachsprache Trade-offs. Diese zwei Konzepte sind zentral für ökonomisches Denken und Entscheiden.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Opportunitätskosten (Verzichtskosten): Der entgangene Nutzen der nächstbesten Alternative.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Trade-off: Austauschbeziehung zwischen Zielen — ein Mehr beim einen bedeutet ein Weniger beim anderen.' },
  ] },
  { id: 'd761ac32-ab9c-4f95-9a3c-176e6b30cf6c', fachbereich: 'VWL', musterlosung: 'In einer Geldwirtschaft wird Ware nicht gegen Ware getauscht, sondern gegen ein allgemein akzeptiertes Zahlungsmittel. Das erleichtert den Handel erheblich: Man muss keinen Tauschpartner finden, der genau die angebotene Ware braucht und gleichzeitig das gewünschte Gut anbietet. Diese Vereinfachung nennt man den Wegfall der doppelten Übereinstimmung (Koinzidenz) der Bedürfnisse.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Zahlungsmittel: In der Geldwirtschaft wird Ware gegen Geld getauscht — nicht mehr direkt Ware gegen Ware.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Übereinstimmung (Koinzidenz): Fällt in der Geldwirtschaft weg — Geld funktioniert als universelles Tauschmittel.' },
  ] },
  { id: 'da5e5329-ada2-4ca9-80b6-8bd6877191f3', fachbereich: 'VWL', musterlosung: 'Das BIP kann nach drei gleichwertigen Ansätzen berechnet werden. Beim Produktionsansatz addiert man alle Wertschöpfungen der inländischen Unternehmen. Beim Einkommensansatz addiert man alle Faktoreinkommen (Löhne, Zinsen, Gewinne). Beim Verwendungsansatz betrachtet man, wofür die Güter verwendet werden: Konsum, Investitionen, Staatsausgaben und Nettoexporte. Alle drei Ansätze liefern dasselbe Ergebnis.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Produktionsansatz: Summe aller Wertschöpfungen — Output abzüglich Vorleistungen.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Einkommensansatz: Summe aller Faktoreinkommen — Löhne, Zinsen, Gewinne.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Verwendungsansatz: Konsum plus Investitionen plus Staatsausgaben plus Nettoexporte.' },
  ] },
  { id: 'df5a6615-4006-4e07-a14b-8bff14e0da21', fachbereich: 'VWL', musterlosung: 'Die Volkswirtschaft teilt sich in drei Sektoren. Der erste (primäre) Sektor umfasst die Urproduktion, also Landwirtschaft, Forstwirtschaft und Bergbau. Der zweite (sekundäre) Sektor umfasst die Industrie und das verarbeitende Gewerbe. Der dritte (tertiäre) Sektor umfasst die Dienstleistungen. In Industrieländern dominiert heute klar der tertiäre Sektor — ein Ergebnis des Strukturwandels.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Erste (primäre): Urproduktion — Landwirtschaft, Forstwirtschaft, Fischerei, Bergbau.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Zweite (sekundäre): Industrie und verarbeitendes Gewerbe — Veredelung von Rohstoffen.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Dritte (tertiäre): Dienstleistungen — Handel, Banken, Gesundheit, Bildung, Tourismus.' },
  ] },
  { id: 'e1f97481-13ed-4e3f-88bf-3b39253a40b9', fachbereich: 'VWL', musterlosung: 'Im Insider-Outsider-Modell nutzen die Insider (Beschäftigten, vertreten durch die Gewerkschaften) ihre Verhandlungsmacht, um Lohnerhöhungen für sich durchzusetzen. Dadurch bleiben die Löhne hoch — und die Outsider (Arbeitslosen) haben schlechtere Chancen auf eine Stelle. Das Modell erklärt, warum starker Kündigungsschutz zu hoher Sockelarbeitslosigkeit führen kann.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Insider-Outsider: Modell, das die Machtasymmetrie zwischen Beschäftigten und Arbeitslosen erklärt.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Gewerkschaften: Vertreten primär die Insider — Beschäftigte mit Verhandlungsmacht.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Outsider (Arbeitslosen): Haben wenig Einfluss auf Lohnverhandlungen — leiden unter hohen Löhnen.' },
  ] },
  { id: 'e6228f1f-0494-4f51-8c5a-3b6c89c9006c', fachbereich: 'VWL', musterlosung: 'Direkte Steuern werden auf das Einkommen und das Vermögen einer Person erhoben. Sie orientieren sich an der wirtschaftlichen Leistungsfähigkeit und wirken meist progressiv. Indirekte Steuern werden auf den Konsum erhoben — wichtigstes Beispiel ist die Mehrwertsteuer. Sie wirken eher regressiv, weil Geringverdienende einen höheren Anteil ihres Einkommens konsumieren.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Einkommen (Vermögen): Direkte Steuern setzen bei der wirtschaftlichen Leistungsfähigkeit an.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Vermögen (Einkommen): Zweite Grundlage der direkten Besteuerung.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Konsum: Grundlage der indirekten Steuern — Mehrwertsteuer, Tabak- und Alkoholsteuern.' },
  ] },
  { id: 'e6548da7-cf5f-4c76-92f6-5a88de34428e', fachbereich: 'VWL', musterlosung: 'Die Geldschöpfung ist ein zweistufiger Prozess. Die Schweizerische Nationalbank (SNB) schöpft das Notenbankgeld M0: Banknoten und Giroguthaben der Banken bei der SNB. Die Geschäftsbanken erzeugen daraus über die Kreditvergabe die breiteren Geldmengen M1 bis M3 (Buchgeld). Jedes Mal, wenn eine Bank einen Kredit vergibt, entsteht neues Buchgeld — ein multiplikativer Effekt.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'SNB (Schweizerische Nationalbank): Schöpft Notenbankgeld M0 — Banknoten und Giroguthaben.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Geschäftsbanken (Banken): Erzeugen Buchgeld durch Kreditvergabe — expandieren M1 bis M3.' },
  ] },
  { id: 'e80bbc2f-c005-4bcf-acd5-b986f2a4705f', fachbereich: 'VWL', musterlosung: 'Die Verhaltensökonomik (Behavioral Economics) erweitert die Standardtheorie um psychologische Erkenntnisse. Sie zeigt, dass Menschen nicht immer vernünftig (rational) entscheiden, sondern Heuristiken und systematischen Fehlern unterliegen. Eine praktische Anwendung ist das Nudging: Menschen werden subtil in eine bestimmte Richtung gestupst, ohne dass Freiheiten eingeschränkt werden. Beispiel: Opt-out statt Opt-in bei der Organspende.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Verhaltensökonomik (Behavioral Economics): Verbindet Ökonomie mit Psychologie — untersucht reales Entscheidungsverhalten.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Vernünftig (rational): Menschen weichen systematisch vom Ideal rationalen Entscheidens ab.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Nudge: Subtiler Anreiz zur Verhaltensänderung, ohne Wahlfreiheit einzuschränken.' },
  ] },
  { id: 'ebc11cc5-f55e-4d84-b20b-0cff68b0bf50', fachbereich: 'VWL', musterlosung: 'Die Einkommensverteilung vor staatlichen Eingriffen heisst primäre Einkommensverteilung — sie entsteht durch Markt, Arbeit und Kapital. Nach staatlichen Eingriffen (Steuern, Sozialversicherungen, Transfers) spricht man von der sekundären Einkommensverteilung. Sie ist in der Regel gleichmässiger als die primäre. Der Unterschied zwischen beiden misst die Umverteilungswirkung des Staates.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Primäre Einkommensverteilung: Entsteht durch Marktmechanismen vor staatlichen Eingriffen.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Sekundäre Einkommensverteilung: Nach Steuern und Transfers — meist gleichmässiger als die primäre.' },
  ] },
  { id: 'ef41937f-6c31-4746-952a-faa1aad29937', fachbereich: 'VWL', musterlosung: 'Güter lassen sich nach Rivalität und Ausschliessbarkeit klassifizieren. Rivalisierende, aber nicht ausschliessbare Güter heissen Gemeingüter (Allmendegüter, Common Pool Resources) — z.B. Fischbestände. Nicht rivalisierende, aber ausschliessbare Güter heissen Klubgüter (Mautgüter, Club Goods) — z.B. Fitnessstudio, Mautstrasse. Bei Allmendegütern droht die Übernutzung, bei Klubgütern kann der Zugang ausgeschlossen werden.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Gemeingüter (Allmendegüter): Rivalisierend, aber nicht ausschliessbar — Beispiel: Fischbestände.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Mautgüter (Klubgüter): Nicht rivalisierend, aber ausschliessbar — Beispiel: Fitnessstudio, Autobahn mit Vignette.' },
  ] },
  { id: 'f30a7d86-a72b-439b-85ef-a4912d941f66', fachbereich: 'VWL', musterlosung: 'Die Beveridge-Kurve zeigt den Zusammenhang zwischen offenen Stellen (Vakanzen, Y-Achse) und Arbeitslosen (X-Achse). Sie verläuft typischerweise fallend: Je mehr Arbeitslose, desto weniger offene Stellen. Die Winkelhalbierende (45-Grad-Linie) verbindet alle Punkte, an denen Vakanzen und Arbeitslose gleich gross sind — dies markiert die Sockelarbeitslosigkeit.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Vakanzen (offene Stellen): Y-Achse — die Zahl der unbesetzten Stellen.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Arbeitslose (Arbeitslosenzahl): X-Achse — die Zahl der Stellensuchenden.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Winkelhalbierende (45-Grad-Linie): Zeigt die Sockelarbeitslosigkeit — Vakanzen gleich Arbeitslose.' },
  ] },
  { id: 'f7258638-7c05-4332-adc5-4ee5580d6150', fachbereich: 'VWL', musterlosung: 'Die fundamentale Wachstumsgleichung zerlegt das BIP pro Einwohner in zwei Hebel: Arbeitsstunden pro Einwohner multipliziert mit der Produktivität (Output pro Arbeitsstunde). Wohlstand lässt sich also entweder durch mehr Arbeit oder durch produktivere Arbeit steigern. In Industrieländern ist die Arbeitszeit kaum noch zu erhöhen — Produktivitätsfortschritt wird damit zum entscheidenden Wachstumsmotor.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Arbeitsstunden (Arbeitsvolumen): Erster Hebel — wie viele Stunden pro Einwohner gearbeitet werden.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Produktivität: Zweiter Hebel — wie viel Wertschöpfung pro Arbeitsstunde entsteht.' },
  ] },
  { id: 'fae3622a-a62d-4fa8-aab7-9a347eae58a1', fachbereich: 'VWL', musterlosung: 'Ein Preiskartell ist eine Absprache zwischen Wettbewerbern über Preise — meist geheim, um höhere Preise durchzusetzen. Kartelle schaden Konsumenten und reduzieren die Gesamtwohlfahrt. Die Schweizer Wettbewerbskommission (WEKO) verfolgt solche Absprachen und kann Bussen bis zu zehn Prozent des Umsatzes der letzten drei Jahre verhängen. Rechtsgrundlage ist das Kartellgesetz (KG).', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Preiskartell: Geheime Preisabsprache zwischen Wettbewerbern — illegal und wohlfahrtsmindernd.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Wettbewerbskommission (WEKO): Schweizer Behörde, die Kartellverbote durchsetzt.' },
  ] },
  { id: 'fb9de909-0f88-4954-9ed7-f6a208efc6e1', fachbereich: 'VWL', musterlosung: 'Steuern verfolgen drei Hauptzwecke. Der fiskalische Zweck dient der Finanzierung von Staatsaufgaben — Einnahmen generieren. Der Lenkungseffekt soll Verhalten beeinflussen, z.B. CO₂-Abgabe oder Tabaksteuer. Der Verteilungszweck (Umverteilung) reduziert Einkommensunterschiede — insbesondere durch progressive Einkommensteuern. Die meisten Steuern verfolgen mehrere Zwecke gleichzeitig.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Fiskalischer Zweck: Einnahmen generieren — Hauptfunktion fast jeder Steuer.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Lenkungseffekt: Verhalten beeinflussen — z.B. CO₂-Abgabe gegen Emissionen.' },
    { feld: 'luecken', id: 'luecke-2', text: 'Verteilungszweck: Einkommensunterschiede reduzieren — progressive Einkommensteuer.' },
  ] },
  { id: 'feefcabd-9ce0-4b20-8e60-31ca2b013d85', fachbereich: 'VWL', musterlosung: 'Nachhaltige Entwicklung ist die Entwicklung, die die Bedürfnisse der heutigen Generation befriedigt, ohne zu riskieren, dass zukünftige Generationen ihre eigenen Bedürfnisse nicht befriedigen können. Diese Definition stammt aus dem Brundtland-Bericht (1987) der UNO-Weltkommission für Umwelt und Entwicklung. Sie betont die intergenerationelle Gerechtigkeit und gilt als Leitbild moderner Umwelt- und Wachstumspolitik.', teilerklaerungen: [
    { feld: 'luecken', id: 'luecke-0', text: 'Heutigen Generation (jetzigen): Die jetzt lebenden Menschen — ihre Bedürfnisse dürfen befriedigt werden.' },
    { feld: 'luecken', id: 'luecke-1', text: 'Zukünftige (kommende, nachfolgende) Generationen: Dürfen durch heutiges Handeln nicht benachteiligt werden.' },
  ] },

  // ============ MULTIPLE CHOICE (60) ============
  { id: '00c0a928-f62b-428b-8e3e-9375a63f3a16', fachbereich: 'VWL', musterlosung: 'Die SNB überträgt ihre Zinsentscheidungen über drei Kanäle auf die Realwirtschaft: den Kreditkanal (Zinsen verändern Kreditnachfrage und -angebot), die Inflationserwartungen (beeinflussen langfristige Zinsen und Lohnabschlüsse) und den Wechselkurskanal (Zinsdifferenzen verändern die Attraktivität der Währung). Ein «Fiskalkanal» ist kein geldpolitischer Transmissionskanal — Fiskalpolitik ist ein eigenständiges Politikfeld.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Kreditkanal: Zinsänderung verändert Kreditkosten und damit Konsum und Investitionen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Inflationserwartungen: Beeinflussen langfristige Zinsen und Lohnabschlüsse — zweiter zentraler Kanal.' },
    { feld: 'optionen', id: 'opt-2', text: 'Wechselkurskanal: Zinsdifferenzen verändern den Franken-Kurs und damit Import- und Exportpreise.' },
    { feld: 'optionen', id: 'opt-3', text: 'Fiskalkanal gibt es nicht in der Geldpolitik — Fiskalpolitik ist Sache des Bundes, nicht der SNB.' },
  ] },
  { id: '00c65c9a-01de-4680-ad04-b304768b0325', fachbereich: 'VWL', musterlosung: 'Die Volkswirtschaft wird nach der Drei-Sektoren-Hypothese von Fourastié eingeteilt: primärer Sektor (Urproduktion — Landwirtschaft, Bergbau, Fischerei), sekundärer Sektor (Industrie und verarbeitendes Gewerbe) und tertiärer Sektor (Dienstleistungen wie Handel, Banken, Bildung). Diese Einteilung folgt der Wertschöpfungsstufe. Andere Einteilungen (Akteure, Märkte, Aussenhandel) betreffen nicht die Sektoren.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Die klassische Drei-Sektoren-Hypothese nach Fourastié.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Produktion, Handel und Konsum sind Wirtschaftsphasen, keine Sektoren.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Staat, Unternehmen und Haushalte sind Wirtschaftsakteure im Kreislauf, keine Sektoren.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Import, Export und Binnenmarkt beschreiben Aussenhandelsrichtungen, keine Sektoren.' },
  ] },
  { id: '0110c220-188b-420c-8c1a-69851d32d1a3', fachbereich: 'VWL', musterlosung: 'Als «Transferhaushalt» gibt der Bund rund zwei Drittel seiner Mittel über gebundene Transfers aus — Sozialversicherungen, Subventionen, Kantonsanteile. Diese Ausgaben sind gesetzlich verankert und können kurzfristig nicht gekürzt werden. Sparanstrengungen können deshalb fast nur beim verbleibenden Drittel der Eigenausgaben ansetzen. Das begrenzt den haushaltspolitischen Spielraum stark.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Rund zwei Drittel der Ausgaben sind gebundene Transfers — kaum kurzfristig kürzbar.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das Parlament genehmigt den Voranschlag als Ganzes, nicht jeden Transfer einzeln jedes Jahr.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kantone können gesetzlich festgelegte Transfers nicht beliebig zurückweisen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das Problem liegt bei den gebundenen Ausgaben, nicht bei zu tiefen Einnahmen.' },
  ] },
  { id: '01b78ac4-8ae3-4ccd-ab31-73119bf5578b', fachbereich: 'VWL', musterlosung: 'Die Tabaksteuer verfolgt primär einen Lenkungszweck: Sie soll gesundheitsschädliches Verhalten verteuern und so den Konsum reduzieren. Sie generiert zwar auch Fiskaleinnahmen, die primäre Motivation ist aber die Verhaltensbeeinflussung. Typisch für Lenkungssteuern: Je wirksamer sie sind, desto weniger Einnahmen bringen sie — langfristig sinken die Erträge mit dem Konsum.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Einnahmen sind Nebeneffekt — primäre Motivation ist die Verhaltenssteuerung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: «Solidaritätszweck» ist kein klassischer Steuerzweck.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Lenkungszweck — Rauchen soll verteuert und so reduziert werden.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Umverteilung setzt bei Einkommen oder Vermögen an, nicht bei einzelnen Konsumgütern.' },
  ] },
  { id: '01cdca01-0d61-4eec-a6b0-e3ec448e5dba', fachbereich: 'VWL', musterlosung: 'Der Deichschutz ist ein klassisches öffentliches Gut — niemand kann vom Schutz ausgeschlossen werden (Nicht-Ausschliessbarkeit). Der Anwohner profitiert, ohne zu bezahlen — das ist das Trittbrettfahrerverhalten. Wenn alle so handeln, wird der Deich nicht finanziert. Deshalb organisiert der Staat solche Güter und finanziert sie über Steuern. Bauer, Unternehmen und unzufriedene Kunden illustrieren andere ökonomische Konzepte.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Marktverkäufe sind kein Trittbrettfahren — beide Seiten tauschen freiwillig.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Klassisches Trittbrettfahren beim öffentlichen Gut Deichschutz.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Ein patentierter Erfinder profitiert exklusiv — das Gegenteil vom Trittbrettfahren.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Kundenunzufriedenheit ist ein Qualitätsproblem, kein Trittbrettfahren.' },
  ] },
  { id: '0290ebde-95b1-4d47-bf2e-766df96eda19', fachbereich: 'VWL', musterlosung: 'Nachfrageseitige Konjunkturtheorien erklären Schwankungen durch Veränderungen der Gesamtnachfrage. Die Unterkonsumtionstheorie sieht zu geringen Konsum als Ursache, psychologische Theorien betonen die Rolle von Stimmung und Erwartungen. Die Theorie realer Schocks ist ein Oberbegriff für angebots- und nachfrageseitige Schocks. Die Überinvestitionstheorie erklärt Schwankungen angebotsseitig — zu viele Produktionskapazitäten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Unterkonsumtion sieht zu geringe Konsumnachfrage als Konjunkturursache.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Theorie realer Schocks umfasst Angebots- und Nachfrageschocks — nicht rein nachfrageseitig.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Psychologische Theorien — Pessimismus der Konsumenten drückt die Nachfrage.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Überinvestitionen sind ein Angebotsphänomen — zu viele Produktionskapazitäten.' },
  ] },
  { id: '03de5dfe-5681-4c71-b63a-762390401468', fachbereich: 'VWL', musterlosung: 'Die Landesverteidigung erfüllt beide Kriterien eines öffentlichen Gutes: Nicht-Rivalität (der Schutz des einen schmälert nicht den Schutz des anderen) und Nicht-Ausschliessbarkeit (niemand kann vom Schutz ausgeschlossen werden, auch Steuerhinterzieher nicht). Smartphones, Milch und Kinobesuche sind dagegen private Güter — sie sind rivalisierend und ausschliessbar.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Smartphones sind rivalisierend (ein Gerät gehört einer Person) und ausschliessbar — privates Gut.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Milch ist rivalisierend (verbraucht) und ausschliessbar (im Kassenbetrieb) — privates Gut.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kinobesuche sind ausschliessbar durch Ticketpflicht — Klubgut, kein öffentliches Gut.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Landesverteidigung ist nicht rivalisierend und nicht ausschliessbar — klassisches öffentliches Gut.' },
  ] },
  { id: '040623ff-2378-41ec-9f23-3de63f9f37d0', fachbereich: 'VWL', musterlosung: 'Das soziale Existenzminimum geht über das physische Überleben hinaus. Es soll eine minimale Teilhabe am gesellschaftlichen Leben ermöglichen — Mobilität, Kommunikation, einfache kulturelle Aktivitäten. In der Schweiz definiert die SKOS (Schweizerische Konferenz für Sozialhilfe) dieses Minimum in den SKOS-Richtlinien. Das physische Minimum ist davon zu unterscheiden.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die AHV-Minimalrente ist eine sozialversicherungsrechtliche Grösse, nicht das Existenzminimum.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Durchschnittslohn ist weit über dem Existenzminimum angesiedelt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Das soziale Existenzminimum ermöglicht Teilhabe über das physische Überleben hinaus.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das ist das physische Existenzminimum, nicht das soziale.' },
  ] },
  { id: '050eefad-33dc-477a-b5ed-cb452697b7e8', fachbereich: 'VWL', musterlosung: 'Konjunktursensibel sind Steuern, die von der Wirtschaftsaktivität abhängen. Die Verrechnungssteuer schwankt mit Kapitalerträgen, die Mehrwertsteuer mit dem Konsum und die Stempelabgaben mit Börsentransaktionen. Alle drei fallen in Rezessionen spürbar zurück. Die Mineralölsteuer ist dagegen konjunkturunempfindlich — der Treibstoffverbrauch bleibt auch in Krisen relativ stabil.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Verrechnungssteuer hängt stark von Kapitalerträgen ab — sinkt in Rezessionen deutlich.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Mehrwertsteuer hängt direkt vom Konsum ab — reagiert stark auf Konjunktur.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Stempelabgaben sinken mit Börsenumsätzen — stark konjunkturabhängig.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Treibstoffverbrauch bleibt relativ konstant — Mineralölsteuer wenig konjunktursensibel.' },
  ] },
  { id: '055c5962-9fb2-4bad-9f14-dcb251e65e0e', fachbereich: 'VWL', musterlosung: 'In der Schweiz besitzt nur die Schweizerische Nationalbank (SNB) das Recht, Banknoten herauszugeben — ein Monopol aus Art. 99 BV. Münzen werden von der Swissmint geprägt, einer Einheit der Bundesverwaltung. Geschäftsbanken dürfen keine eigenen Banknoten drucken — sie schöpfen lediglich Buchgeld durch Kreditvergabe. Der Bundesrat setzt geldpolitische Rahmenbedingungen, aber gibt selbst keine Banknoten heraus.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Die SNB hat gemäss Art. 99 BV das alleinige Banknoten-Monopol.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Geschäftsbanken schöpfen Buchgeld, geben aber keine Banknoten heraus.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Swissmint ist für Münzen zuständig, nicht für Banknoten.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Bundesrat hat keine Banknoten-Kompetenz — die SNB ist unabhängig.' },
  ] },
  { id: '06244874-6735-4da1-986b-45acc5cc85fe', fachbereich: 'VWL', musterlosung: 'Die Schweiz hat eine der höchsten Erwerbsquoten Europas, die Wochenarbeitszeit sinkt aber seit Jahrzehnten. Damit ist der Hebel «mehr Arbeitsmenge» weitgehend ausgeschöpft. Der verbleibende nachhaltige Wachstumsmotor ist die Produktivitätssteigerung — durch Innovation, Bildung und Kapitalausstattung. Genau deshalb setzt die Schweiz stark auf Forschung, Ausbildung und hochwertige Exporte.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Bei ausgeschöpftem Arbeitsvolumen bleibt Produktivitätssteigerung als nachhaltiger Wachstumsmotor.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Längere Arbeitszeit ist politisch kaum durchsetzbar und nicht der Haupthebel moderner Volkswirtschaften.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Sinkende Arbeitszeit kann durch Produktivität kompensiert werden — Wohlstand stieg trotzdem.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Erwerbsquote ist ein zentraler Wachstumshebel — nicht irrelevant.' },
  ] },
  { id: '06bdfc17-17b6-4050-8862-c19f65bd248a', fachbereich: 'VWL', musterlosung: 'Die höhere Besteuerung von Alcopops ist ein gezielter Lenkungseingriff: Jugendliche mit geringem Budget reagieren besonders stark auf Preiserhöhungen. Da sie die Hauptkonsumenten süsser Alkoholgetränke sind, trifft die Steuer sie überproportional und soll sie vom Konsum abhalten. Dies ist ein Beispiel für zielgruppenspezifische Lenkung. Produktionskosten spielen bei der Besteuerung keine Rolle.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Einnahmen sind nicht der Hauptzweck — es geht um Verhaltenssteuerung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die ökonomische Begründung ist die zielgruppenspezifische Lenkung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Zielgruppenspezifische Lenkung — Jugendliche sollen vom Konsum abgehalten werden.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Produktionskosten sind kein Grund für eine höhere Besteuerung.' },
  ] },
  { id: '07ad4622-4ac4-4011-8159-574a86655bf1', fachbereich: 'VWL', musterlosung: 'Bei Emissionszertifikaten legt der Staat eine Gesamtmenge an zulässigen Emissionen fest und verteilt handelbare Verschmutzungsrechte. Wer die Umwelt belasten will, muss Zertifikate kaufen. Wer Emissionen reduziert, kann überschüssige Zertifikate verkaufen. So wird die Gesamtmenge begrenzt und die Reduktion dort vorgenommen, wo sie am günstigsten ist. Das EU-Emissionshandelssystem ist das bekannteste Beispiel.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Emissionszertifikate sind keine Umweltversicherung — sie sind Nutzungsrechte.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Unternehmen müssen Zertifikate kaufen, nicht umgekehrt Geld erhalten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Cap-and-Trade-System — Gesamtmenge begrenzen, Rechte handelbar machen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Emissionszertifikate verbieten nicht, sie bepreisen die Umweltnutzung.' },
  ] },
  { id: '07afead3-042d-4e25-8431-1c0636205386', fachbereich: 'VWL', musterlosung: 'Staatsversagen bedeutet, dass staatliche Eingriffe ihre Ziele nicht erreichen oder sogar unbeabsichtigte negative Nebenwirkungen erzeugen. Gründe sind Eigendynamik von Behörden, Ineffizienz, fehlende Marktsignale und veränderte Verhaltensanreize. Staatsversagen ist das Spiegelbild zum Marktversagen — auch der Staat handelt nicht immer optimal. Das Konzept warnt vor überzogenen Erwartungen an staatliche Lösungen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Ein Staatsbankrott ist eine Finanzkrise, nicht das allgemeine Konzept Staatsversagen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Staatsversagen heisst nicht, dass Staaten ihre Aufgaben aufgeben.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Staatsversagen — Eingriffe verfehlen Ziele oder erzeugen Nebenwirkungen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Steuerverweigerung ist ziviler Ungehorsam, kein Staatsversagen.' },
  ] },
  { id: '07b56e88-1bdb-4d93-b1b4-be37b7f54435', fachbereich: 'VWL', musterlosung: 'Staatliche Leistungen werden nicht am Markt verkauft — es gibt keinen Marktpreis. Deshalb werden sie im BIP zu ihren Kosten bewertet, vor allem über die Löhne der Beamten. Eine Lohnerhöhung im öffentlichen Dienst erhöht dadurch das BIP, ohne dass die Leistung besser wird. Das verzerrt internationale Vergleiche, weil Länder mit hohem Staatsanteil systematisch anders erfasst werden.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Fehlender Marktpreis führt zu Kostenbewertung — Lohnerhöhungen erhöhen das BIP künstlich.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Doppelzählung wird durch die Wertschöpfungsrechnung vermieden.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Staatsleistungen sind erfasst — aber zu Kosten, nicht zu Marktpreisen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Staat produziert Güter und Dienstleistungen (Schulen, Spitäler, Verwaltung).' },
  ] },
  { id: '07f7cdfd-b788-44f3-82cd-28fad19266f2', fachbereich: 'VWL', musterlosung: 'Bereich B der Elefantengrafik (etwa 75. bis 85. Perzentil) zeigt die westliche untere Mittelschicht. Ihre Realeinkommen stagnierten zwischen 1988 und 2008. Ursachen sind Globalisierung (Verlagerung einfacher Produktion ins Ausland) und Automatisierung (Maschinen ersetzen Routinearbeit). Diese Bevölkerungsgruppe gilt als politisch besonders relevant — sie erklärt viele populistische Bewegungen der 2010er-Jahre.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Superreichen sind in Bereich C und profitierten deutlich (Rüssel der Kurve).' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Ärmsten liegen ganz links und sind nicht Teil der westlichen Mittelschicht.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die chinesische Mittelschicht stieg auf, wird im Rumpf der Kurve abgebildet.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Westliche untere Mittelschicht — Einkommen stagnierten durch Globalisierung und Automatisierung.' },
  ] },
  { id: '085d01e4-8891-4819-b30f-f6983eb0ecef', fachbereich: 'VWL', musterlosung: 'Der Staat hat in einer Marktwirtschaft klare Wachstumsaufgaben: Spielregeln setzen (Eigentumsrechte, Vertragsfreiheit), öffentliche Güter bereitstellen und Marktversagen korrigieren (externe Effekte). Die staatliche Festlegung aller Preise ist damit unvereinbar — Preise sollen sich über den Markt bilden, weil sie Knappheit signalisieren und Allokation steuern. Staatliche Preisregulierung ist nur in Ausnahmefällen sinnvoll.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Öffentliche Güter bereitstellen ist eine zentrale Staatsaufgabe.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Alle Preise festlegen wäre Planwirtschaft — widerspricht der Marktwirtschaft.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Bei externen Effekten muss der Staat eingreifen — klassische Aufgabe.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Rahmenbedingungen schaffen ist die Kernaufgabe — Privateigentum, Vertragsfreiheit.' },
  ] },
  { id: '08d4388a-0c72-4152-b518-a6bd3abcb383', fachbereich: 'VWL', musterlosung: 'Selbst bei unbegrenzter Güterproduktion blieben Dinge knapp: Zeit (jeder Mensch hat nur 24 Stunden pro Tag), Aufmerksamkeit anderer Menschen, einzigartige Standorte (Seegrundstücke), natürliche Schönheit, Status und Ansehen. Knappheit ist daher ein Grundproblem der menschlichen Existenz, das sich nicht vollständig aufheben lässt. Die VWL bleibt relevant — auch in einer hypothetischen Überflussgesellschaft.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Zeit, Aufmerksamkeit und Standorte sind nicht vermehrbar — Knappheit bleibt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Prämisse sagt gratis herstellbar — dann wären auch Roboter nicht knapp.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Knappheit umfasst auch Zeit, Aufmerksamkeit und Standorte — nicht nur Produktion.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Nicht alle Bedürfnisse sind materiell — Anerkennung, Zeit bleiben knapp.' },
  ] },
  { id: '08d80a39-9924-46bc-b7fc-f5a6af53821f', fachbereich: 'VWL', musterlosung: 'Moral Hazard entsteht, wenn Versicherte ihr Verhalten nach Vertragsabschluss ändern, weil der Schaden gedeckt wäre. Ein wirksames Gegenmittel ist der Selbstbehalt: Der Versicherte trägt einen Teil des Schadens selbst und behält so ein Interesse an Schadensvermeidung. Weitere Massnahmen sind Bonus-Malus-Systeme, Überwachung und vertragliche Auflagen. Ein Verbot von Risikoprüfungen würde Moral Hazard nicht lösen, sondern verschärfen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Risikoprüfungen helfen gegen Adverse Selektion, nicht gegen Moral Hazard.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Versicherungen abschaffen würde grösseren Schaden verursachen als Moral Hazard.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Selbstbehalt schafft Eigeninteresse an Schadensvermeidung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Pauschale Prämienerhöhung löst das Anreizproblem nicht — alle zahlen, niemand ändert Verhalten.' },
  ] },
  { id: '09b89635-c53c-452a-87b9-8110e491968c', fachbereich: 'VWL', musterlosung: 'Die Schweizer CO₂-Abgabe ist eine Lenkungsabgabe (Pigou-Steuer). Sie internalisiert die negativen externen Effekte von CO₂-Emissionen, indem sie fossile Brennstoffe um die geschätzten externen Kosten verteuert. So entstehen Anreize, weniger CO₂ auszustossen und auf erneuerbare Alternativen umzusteigen. Der grössere Teil der Einnahmen wird an die Bevölkerung und an Unternehmen zurückverteilt. Sie ist also primär Lenkung, nicht Fiskal.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Subventionierung ist ein separates Instrument — die Abgabe selbst setzt Lenkungssignale.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Internalisierung negativer externer Effekte — Umweltkosten werden eingepreist.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Ein Grossteil der Einnahmen wird rückverteilt — kein Fiskalzweck.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Abgabe verbietet nicht, sie bepreist — Verbot ist ein anderes Instrument.' },
  ] },
  { id: '0aafe126-7dea-474a-9776-b0386f60d917', fachbereich: 'VWL', musterlosung: 'Gemäss Eisenhut ist Wissen (Humankapital und technischer Fortschritt) der einzige Produktionsfaktor, der unbegrenzt wachsen kann und damit stetiges Wirtschaftswachstum ermöglicht. Natürliche Ressourcen sind erschöpfbar, Arbeit durch Bevölkerungsgrösse und Arbeitszeit begrenzt, Realkapital unterliegt abnehmenden Grenzerträgen. Wissen hingegen kann kumuliert, weitergegeben und beliebig vervielfältigt werden — das erklärt seinen zentralen Stellenwert.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Wissen (Humankapital, technischer Fortschritt) ist unbegrenzt vermehrbar.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Natürliche Ressourcen sind erschöpfbar — kein Motor für stetiges Wachstum.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Arbeit ist durch Bevölkerung und Arbeitszeit begrenzt — kein stetiger Wachstumstreiber.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Realkapital unterliegt abnehmenden Grenzerträgen — alleine kein stetiges Wachstum.' },
  ] },
  { id: '0af500fe-b2a8-418a-9ef6-8e8f04991436', fachbereich: 'VWL', musterlosung: 'Die Linie bei 1,8 Hektaren pro Person entspricht der global verfügbaren Biokapazität. Liegt der ökologische Fussabdruck eines Landes darüber, verbraucht es mehr Ressourcen, als die Erde pro Person regenerieren kann. Würden alle so leben, wären mehrere Planeten nötig — der «Earth Overshoot Day» zeigt dieses Ungleichgewicht. Die Kennzahl misst weder Handel noch BIP direkt, sondern Ressourcennutzung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Fussabdruck misst Ressourcenverbrauch, nicht die Handelsbilanz.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Verbrauch über der Biokapazität ist nicht nachhaltig.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Hohes BIP korreliert oft, ist aber nicht die direkte Aussage der Linie.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Fussabdruck pro Person hat nichts mit Bevölkerungsdichte zu tun.' },
  ] },
  { id: '0c28d2da-fb9b-4385-a318-d2a7653b3374', fachbereich: 'VWL', musterlosung: 'Ein absoluter Preis ist der Preis eines Gutes, ausgedrückt in einer Geldeinheit (Recheneinheit). Beispiel: Ein Brot kostet 5 Franken. Davon zu unterscheiden ist der relative Preis — das Tauschverhältnis zwischen zwei Gütern (z.B. ein Brot kostet so viel wie 500 Gramm Käse). Absolute Preise sind unmittelbar ablesbar, relative Preise geben die echte Knappheitsinformation.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Preis in Geldeinheit ausgedrückt — der klassische absolute Preis.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das ist der relative Preis — Tauschverhältnis zwischen zwei Gütern.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Historischer Höchstpreis ist kein ökonomisches Konzept.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Staatlich festgelegte Preise sind Höchst- oder Mindestpreise, nicht «absolut».' },
  ] },
  { id: '0c2c6819-4158-4881-aa80-98fe8593cc5c', fachbereich: 'VWL', musterlosung: 'Die monetäre Konjunkturtheorie stützt sich auf die Quantitätsgleichung MV = PY. Ändert sich die Geldmenge M, während die Umlaufgeschwindigkeit V und das Preisniveau P kurzfristig konstant bleiben, verändert sich auch das reale BIP Y. Geld beeinflusst damit kurzfristig die Realwirtschaft. Mittel- bis langfristig wirkt eine Geldmengenausweitung allerdings primär auf das Preisniveau — dann gilt die klassische Neutralität des Geldes.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Quantitätsgleichung MV = PY — Geldmenge beeinflusst kurzfristig die Realwirtschaft.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Geld ist nicht neutral — zumindest kurzfristig wirkt es auf die Realwirtschaft.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das wäre Friedmans k-Regel, nicht die monetäre Konjunkturtheorie allgemein.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Auch Geldpolitik wirkt auf die Konjunktur — das ist der Kern der Theorie.' },
  ] },
  { id: '0c4f6f46-94a6-4250-8d26-5cc50284e80f', fachbereich: 'VWL', musterlosung: 'Knappheit ist eine Grundvoraussetzung für Wert. Wäre Geld unbeschränkt verfügbar — wie Sand in der Wüste — hätte es keinen Tauschwert. Niemand würde wertvolle Güter gegen etwas tauschen, das jeder in beliebiger Menge besitzt. Deshalb muss Geld knapp sein. Gleichzeitig darf Geld nicht zu knapp sein, damit genügend Zahlungsmittel für den Wirtschaftsverkehr vorhanden sind. Die SNB steuert diese Balance.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Knappes Geld ist tendenziell schwerer zu fälschen, aber Fälschungsschutz hängt von Technik ab.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das Gewicht ist ein praktisches Detail, kein ökonomischer Grund für Knappheit.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Ästhetik ist kein ökonomischer Grund für Knappheit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Unbeschränkt verfügbares Geld verliert seinen Wert — Knappheit ist Wertvoraussetzung.' },
  ] },
  { id: '0c75b616-0b44-498f-a7c7-c33472c2b734', fachbereich: 'VWL', musterlosung: 'Bei hoher und unberechenbarer Inflation ist unklar, ob der Zuckerpreis relativ gestiegen ist (Zucker knapper als andere Güter) oder ob der Anstieg nur die allgemeine Teuerung widerspiegelt. Die Signalfunktion der Preise geht verloren — Marktteilnehmer erkennen nicht mehr, wo echte Knappheit herrscht. Dies gilt als eine der schwerwiegendsten Folgen hoher Inflation: Die Recheneinheit-Funktion des Geldes wird beeinträchtigt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Bei hoher Inflation werden Preise sogar häufiger angepasst, nicht seltener.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Signalfunktion geht verloren — relative und absolute Preisänderungen vermischen sich.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Preise sind weiterhin ablesbar — das Problem ist die Interpretation.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Nachfragereaktion ist nicht die zentrale Interpretationsschwierigkeit.' },
  ] },
  { id: '0ca8fd78-0303-4ce3-9710-ec40fea7ab25', fachbereich: 'VWL', musterlosung: 'Der Strukturwandel wird primär durch Produktivitätssteigerungen getrieben: Dank Mechanisierung braucht die Landwirtschaft viel weniger Arbeitskräfte für denselben Output. Dasselbe gilt dank Automatisierung für die Industrie. Die freigesetzten Arbeitskräfte wandern in den Dienstleistungssektor, wo die Nachfrage mit steigendem Einkommen überproportional wächst (Engel-Gesetz). So wächst der tertiäre Sektor.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Produktivitätssteigerungen setzen Arbeitskräfte frei — diese wechseln in den 3. Sektor.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Agrarnachfrage ist nicht null — der Output wird heute mit weniger Arbeitskräften produziert.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Es gibt kein Verbot — der Wandel läuft über Marktmechanismen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Sektor wächst durch Einkommensverschiebung, nicht mit der Bevölkerung als Automatismus.' },
  ] },
  { id: '0cf0aec2-caba-40cc-aa29-898a607cc0bd', fachbereich: 'VWL', musterlosung: 'Rechts des Scheitelpunkts (im sogenannten prohibitiven Bereich) ist der Steuersatz so hoch, dass die Bemessungsgrundlage stark schrumpft. Eine Senkung des Steuersatzes führt hier zu mehr Arbeit, weniger Steuervermeidung — die Einnahmen steigen trotz tieferem Satz. Links des Scheitelpunkts hingegen führt eine Steuersenkung zu tieferen Einnahmen, da die Bemessungsgrundlage weniger stark reagiert.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Im Normalbereich steigen die Einnahmen mit dem Satz — Senkung senkt Einnahmen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das widerspricht der Laffer-Logik — rechts vom Scheitelpunkt steigen Einnahmen bei Senkung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Im prohibitiven Bereich erhöhen Steuersenkungen die Einnahmen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Am Scheitelpunkt selbst ändern sich die Einnahmen nicht — Ableitung ist null.' },
  ] },
  { id: '0dfe691c-72f6-4a68-a5b9-55c7db321b8b', fachbereich: 'VWL', musterlosung: 'Die Schweiz ist ein Paradebeispiel dafür, dass Wissen (Humankapital und Innovation) der entscheidende Produktionsfaktor ist. Hochqualifizierte Arbeitskräfte, exzellente Forschung (ETH, Pharmaindustrie), starke Berufsbildung und technologischer Fortschritt kompensieren den Mangel an Rohstoffen. Eisenhut betont: Wissen ist «für die wirtschaftliche Entwicklung eines Landes besonders bedeutungsvoll». Es steigert die Produktivität aller anderen Faktoren.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Schweiz arbeitet nicht signifikant mehr Stunden als andere — nicht der Hauptgrund.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Wasserkraft ist ein Teilfaktor, erklärt aber nicht den Gesamtwohlstand.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Realkapital alleine erklärt nicht, warum ein ressourcenarmes Land reich wird.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Wissen steigert die Produktivität aller Faktoren — Schweizer Erfolgsrezept.' },
  ] },
  { id: '0e90aacc-e3e8-4322-94c3-5833e00eee62', fachbereich: 'VWL', musterlosung: 'Die Corona-Pandemie wirkte gleichzeitig als Angebots- und Nachfrageschock — das machte sie einzigartig. Angebotsseitig: Lockdowns legten die Produktion lahm, Lieferketten brachen ein. Nachfrageseitig: Konsumenten konnten weniger einkaufen (geschlossene Geschäfte, Reiseverbote), viele sparten aus Unsicherheit. Zusätzlich kam es zu internationalen Handelsverwerfungen. Dieser Doppelcharakter erklärte die ausserordentliche Heftigkeit der Krise.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Auch die Produktion brach ein — nicht nur die Nachfrage.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Gleichzeitiger Angebots- und Nachfrageschock — einzigartiger Charakter der Pandemie.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Auch der Konsum brach ein — nicht nur die Produktion.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Pandemie hatte massive Auswirkungen — der grösste BIP-Einbruch seit 1975.' },
  ] },
  { id: '0f0071e1-52f9-4e8d-a6ca-82b61b39930a', fachbereich: 'VWL', musterlosung: 'Bei unelastischer Nachfrage und elastischem Angebot tragen die Konsumenten den grösseren Anteil der Steuerlast. Im Diagramm ist Fläche B (Steuerlast Konsumenten) deutlich grösser als Fläche D (Steuerlast Produzenten). Unelastische Nachfrage bedeutet: Konsumenten können kaum ausweichen — sie akzeptieren höhere Preise. Die Steuer wird überwälzt auf die Marktseite, die weniger flexibel reagiert. Das ist die Steuerinzidenzregel.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Umgekehrt — die unelastische Seite trägt mehr, hier also die Konsumenten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Symmetrische Verteilung gilt nur bei gleicher Elastizität beider Seiten.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Unelastische Nachfrage trägt mehr Last — B grösser als D.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Wohlfahrtsverlust ist nie grösser als die Steuereinnahmen — er ist nur ein Zusatzverlust.' },
  ] },
  { id: '0f9917ae-9392-444f-b94e-e9c992e3879f', fachbereich: 'VWL', musterlosung: 'Vor der Einführung des Höchstpreises P_H war Fläche B Teil der Produzentenrente. Durch den Höchstpreis sinkt der effektive Preis auf P_H, und Fläche B wird zu den Konsumenten transferiert — sie ist nun Teil der Konsumentenrente. Zusätzlich geht Fläche C als Wohlfahrtsverlust verloren, weil bei P_H weniger gehandelt wird. Fläche A blieb schon vorher Konsumentenrente, D blieb Produzentenrente.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Fläche A war schon vorher Konsumentenrente — nicht transferiert.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Fläche D blieb Produzentenrente — wurde nicht transferiert.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Fläche B wurde von Produzenten zu Konsumenten umverteilt.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Fläche C ist Wohlfahrtsverlust — geht ganz verloren, keine Umverteilung.' },
  ] },
  { id: '1131fcac-9fa7-4ed7-be4e-4528ec161d51', fachbereich: 'VWL', musterlosung: 'Der «Homo oeconomicus» ist ein vereinfachtes Modell des rational handelnden Menschen. Er bewertet Fakten, wägt Kosten und Nutzen ab und trifft Entscheidungen, die seinen persönlichen Nutzen maximieren. Es handelt sich um ein Durchschnittsmodell, keine Beschreibung einzelner realer Menschen. Die Verhaltensökonomik zeigt, dass reales Verhalten systematisch davon abweicht. Trotzdem bleibt das Modell ein nützlicher Ausgangspunkt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Rational handelnder Nutzenmaximierer — klassisches Modell der VWL.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Fehlende Emotionen sind nicht Definitionsmerkmal — der Homo oeconomicus kann emotional sein.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das Konzept stammt aus dem 19. Jahrhundert, nicht aus der Antike.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Der Nutzen umfasst alles Wertvolle — nicht nur Geld.' },
  ] },
  { id: '11429588-5a94-4a02-9234-c9b818464251', fachbereich: 'VWL', musterlosung: 'Die Synthese im Eisenhut-Lehrbuch lautet: Kurzfristig hat eher Keynes recht — in einer akuten Krise kann staatliche Nachfragestimulierung helfen, die Wirtschaft zu stabilisieren. Langfristig sind eher die Angebotsökonomen im Recht — nachhaltiges Wachstum erfordert gute Rahmenbedingungen, Investitionsanreize und Strukturreformen. Beide Perspektiven haben damit ihre Berechtigung auf unterschiedlichen Zeithorizonten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Kurzfristig Keynes, langfristig Angebotsökonomie — die Eisenhut-Synthese.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Theorien prägen reale Politik — sie sind nicht nutzlos.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Auch staatliche Eingriffe haben kurzfristig ihren Platz — nicht immer schädlich.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Monetaristen decken nur einen Teil der Wahrheit ab — andere Ansätze bleiben relevant.' },
  ] },
  { id: '114b6b86-2310-4341-9a53-d545b28acb83', fachbereich: 'VWL', musterlosung: 'Die Schweizerische Nationalbank sichert das Vertrauen ins Geld auf zwei Wegen: Erstens durch Preisstabilität — sie hält die Inflation tief, indem sie die Geldmenge steuert. Zweitens durch Fälschungssicherheit — Sicherheitsmerkmale wie Wasserzeichen oder Hologrammstreifen erschweren das Fälschen. Eine Goldeinlösepflicht besteht nicht mehr, seit der Goldstandard abgeschafft wurde (in der Schweiz 2000).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Preisstabilität durch Geldmengensteuerung — Kernauftrag der SNB.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Fälschungsschutz durch technische Sicherheitsmerkmale — sichtbares Vertrauenszeichen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Goldeinlösepflicht wurde 2000 abgeschafft — keine Golddeckung mehr.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Verhinderung von Inflation durch begrenzte Geldmenge — Teil der Preisstabilität.' },
  ] },
  { id: '12016203-8b28-4f1d-8680-f8def5cf1371', fachbereich: 'VWL', musterlosung: 'Die Lorenzkurve zeigt, wie ungleich Einkommen oder Vermögen in einer Gesellschaft verteilt sind. Je weiter sie von der 45-Grad-Linie (perfekte Gleichverteilung) entfernt ist, desto ungleicher ist die Verteilung. Land B weicht stärker ab — der Gini-Koeffizient ist höher, die Ungleichheit grösser. Eine Kurve auf der 45-Grad-Linie bedeutet perfekte Gleichverteilung (Gini = 0).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Grössere Entfernung von der 45-Grad-Linie bedeutet höhere Ungleichheit.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Näher an der 45-Grad-Linie heisst gleichmässiger, nicht ungleicher.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Verschiedene Kurvenverläufe bedeuten unterschiedliche Gini-Werte.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Lorenzkurven zeigen die Verteilung, nicht das BIP-Wachstum.' },
  ] },
  { id: '127323bc-ee68-4aa6-bf41-b179ad0266c7', fachbereich: 'VWL', musterlosung: 'Multinationale Konzerne nutzen drei Hauptmethoden der Gewinnverschiebung: Transfer Pricing (Verrechnungspreise), Lizenzzahlungen für geistiges Eigentum und konzerninterne Darlehen. Alle drei gestalten konzerninterne Zahlungen so, dass Kosten im Hochsteuerland und Gewinne im Tiefsteuerland anfallen. Ein Börsengang hingegen hat keinen direkten Einfluss auf die steuerliche Gewinnzuteilung — er betrifft nur die Kapitalbeschaffung.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Transfer Pricing — konzerninterne Preise so, dass Gewinne im Tiefsteuerland anfallen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Lizenzzahlungen für Marken und Patente ins Steuerparadies verschieben Gewinne.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Konzerninterne Darlehen schaffen Zinsaufwand im Hochsteuerland.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Börsengänge betreffen die Kapitalbeschaffung, nicht die Steuerzuteilung.' },
  ] },
  { id: '12dd20d0-f946-43e0-8646-1b6adbaed26f', fachbereich: 'VWL', musterlosung: 'Das Maximumprinzip (Ergiebigkeitsprinzip) sagt: Mit gegebenem Aufwand (Input) soll das grösstmögliche Ergebnis (Output) erzielt werden. Beispiel: Vier Stunden lernen — und damit die bestmögliche Note erreichen. Das Gegenstück ist das Minimumprinzip (Sparprinzip): Ein bestimmtes Ziel mit minimalem Aufwand erreichen. Beide sind Ausprägungen des übergeordneten ökonomischen Prinzips.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Preis-Maximierung ist keine volkswirtschaftliche Regel, sondern eine Einzelstrategie.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ohne Kostenbezug wäre das nicht ökonomisch — das Prinzip berücksichtigt Input.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das ist das Minimumprinzip — das Gegenstück zum Maximum.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Gegebener Input — maximaler Output. Ergiebigkeitsprinzip.' },
  ] },
  { id: '132ba598-7b85-48a3-95aa-e7f741be2572', fachbereich: 'VWL', musterlosung: 'Moral Hazard (moralisches Risiko) beschreibt die Verhaltensänderung von Versicherten nach Abschluss einer Versicherung: Weil der Schaden gedeckt wäre, geben sie sich weniger Mühe, ihn zu vermeiden. Klassisches Beispiel: Ein Autofahrer mit Vollkaskoversicherung fährt unvorsichtiger. Gegenmittel sind Selbstbehalte, Bonus-Malus-Systeme oder vertragliche Auflagen. Moral Hazard ist ein Problem asymmetrischer Information nach Vertragsschluss (ex post).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Prämiendilemma ist kein eigenständiger Begriff — Moral Hazard betrifft das Versicherten-Verhalten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das wäre Versicherungsbetrug — Moral Hazard ist subtiler, kein Vorsatz.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Das wäre Solvenzproblem der Versicherung — nicht Moral Hazard.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Verhaltensänderung nach Vertragsabschluss — Versicherte nehmen grössere Risiken.' },
  ] },
  { id: '136c9401-ba19-4e00-88c2-53be6dc039bb', fachbereich: 'VWL', musterlosung: 'Ändert sich der Preis des Gutes selbst, bewegt man sich entlang der bestehenden Nachfragekurve — eine Bewegung. Ändert sich ein anderer Faktor (Einkommen, Präferenzen, Preise verwandter Güter), verschiebt sich die gesamte Kurve — eine Verschiebung. Diese Unterscheidung ist in der VWL zentral: Verwechselt man sie, entstehen grobe Fehlschlüsse über Ursache und Wirkung im Markt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Bewegungen und Verschiebungen gibt es sowohl bei Angebot als auch bei Nachfrage.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Genau umgekehrt — Preisänderung bewegt, Einkommen verschiebt.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Die Begriffe beschreiben unterschiedliche Vorgänge.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Preis des Gutes bewegt, andere Faktoren verschieben die Kurve.' },
  ] },
  { id: '1381fcfd-1e06-40f6-860e-ee0cb9f28dac', fachbereich: 'VWL', musterlosung: 'Die Laffer-Kurve beschreibt den Zusammenhang zwischen Steuersatz und Steuereinnahmen. Bei einem Steuersatz von 0 Prozent gibt es keine Einnahmen. Bei 100 Prozent entfällt jeder Arbeitsanreiz — niemand arbeitet, niemand zahlt Steuern. Dazwischen gibt es einen Scheitelpunkt mit maximalen Einnahmen. Der Verlauf begründet Steuerwettbewerb und die Diskussion um optimale Steuersätze.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Steuersatz auf der X-Achse, Steuereinnahmen auf der Y-Achse — klassische Laffer-Darstellung.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das wäre ein Staatsquoten-Diagramm, keine Laffer-Kurve.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Schulden-Zins-Beziehung beschreibt die Zinslastkurve, nicht Laffer.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Das ist die Phillips-Kurve — Inflation vs. Arbeitslosigkeit.' },
  ] },
  { id: '1390fe32-5d3e-4157-84bf-24fb1867cf3b', fachbereich: 'VWL', musterlosung: 'Bei einem starren Lohn w̄ oberhalb des Gleichgewichtslohns w* liegt die angebotene Arbeitsmenge (P auf der Angebotskurve Lₛ) über der nachgefragten (Q auf der Nachfragekurve Lᴅ). Die Differenz — die Strecke von Q nach P — ist das Überangebot an Arbeit, also unfreiwillige Arbeitslosigkeit. Im Gleichgewicht w* wären Angebot und Nachfrage ausgeglichen und niemand wäre unfreiwillig arbeitslos.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Bei w̄ wird weniger Arbeit nachgefragt (Q) als angeboten (P) — nicht umgekehrt.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ein Lohn über dem Gleichgewicht führt zu Arbeitslosigkeit — nicht zur Vollbeschäftigung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Überangebot Lₛ minus Lᴅ ist unfreiwillige Arbeitslosigkeit.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Im Gleichgewicht arbeiten mehr Menschen, weil sich Angebot und Nachfrage treffen.' },
  ] },
  { id: '13a19fd4-e7e3-4068-be5b-69ae88d23178', fachbereich: 'VWL', musterlosung: 'Wenn Geld schnell an Wert verliert, würden die Menschen es sofort ausgeben — Warten bedeutet Kaufkraftverlust. Dieses Phänomen heisst «Flucht in Sachwerte» und tritt bei Hyperinflationen auf. Niemand würde sparen wollen, der Konsum stiege kurzfristig an. Langfristig würden Planung und Investition massiv erschwert: Die Wertaufbewahrungs- und Recheneinheit-Funktion des Geldes wäre zerstört.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Sparen in wertloser Währung würde den Verlust vergrössern, nicht ausgleichen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Neues Geld drucken würde die Inflation verschärfen — kein Lösungsansatz.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Flucht in Sachwerte — klassische Reaktion bei Geldwertverfall.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Kreditkarten sind auch in Geldeinheiten abgerechnet — kein Ausweg.' },
  ] },
  { id: '14073bc3-d18b-47a1-8066-d343d686b02f', fachbereich: 'VWL', musterlosung: 'Frühindikatoren (vorlaufende Indikatoren) verändern sich bevor die Konjunktur dreht — sie ermöglichen Prognosen. Beispiele sind der Einkaufsmanagerindex oder Auftragseingänge. Spätindikatoren reagieren erst mit Verzögerung auf Veränderungen — z.B. die Arbeitslosenquote, die einen Abschwung erst zeigt, wenn er bereits im Gange ist. Gleichlaufende Indikatoren bewegen sich zeitgleich mit dem BIP.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Früh läuft vor dem BIP, Spät läuft nach dem BIP.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Der Unterschied liegt im Timing, nicht im Messgegenstand.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Beide Typen gibt es weltweit, nicht länderspezifisch.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Genauigkeit ist nicht das Unterscheidungskriterium.' },
  ] },
  { id: '142e8792-968e-4ad6-8135-f6de438768dd', fachbereich: 'VWL', musterlosung: 'Ein allgemeinverbindlich erklärter GAV gilt für die ganze Branche — auch für Unternehmen und Arbeitnehmende, die nicht Mitglieder der unterzeichnenden Verbände sind. Damit schützt er die sozialvertraglichen Vereinbarungen vor Niedriglohnkonkurrenz und verhindert, dass Aussenseiter die Branchenstandards unterlaufen. Der Bundesrat erklärt einen GAV nur unter bestimmten Voraussetzungen allgemeinverbindlich.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Gerade der Allgemeinverbindlich erklärte GAV gilt auch für Nicht-Gewerkschaftsmitglieder.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Grösse des Unternehmens ist nicht das Kriterium.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Allgemeinverbindlicherklärung gibt dem GAV mehr Gewicht, ersetzt ihn nicht durch ein Gesetz.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Der GAV wird auf die ganze Branche ausgedehnt — auch auf Nichtmitglieder.' },
  ] },
  { id: '1487a554-5002-491a-af17-5a49f41c2dca', fachbereich: 'VWL', musterlosung: 'Der Zahlungsverkehr zwischen Banken erfolgt über Giroguthaben bei der SNB. Wenn ein Kunde der Bank A eine Zahlung an einen Kunden der Bank B auslöst, überweist Bank A Notenbankgeld von ihrem SNB-Girokonto auf das Girokonto von Bank B. Deshalb können Banken nur dann Kredite vergeben und Zahlungen ausführen, wenn sie genügend Giroguthaben bei der SNB halten.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Zahlungsverkehr läuft über Buchgeld und SNB-Giroguthaben, nicht über Bargeldtransport.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die SNB überweist nicht automatisch — sie stellt nur die Infrastruktur.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Zahlungsverkehr via SNB-Giroguthaben — zentrale Infrastruktur.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Bilateraler Direkt-Verrechnungsverkehr ohne SNB wäre unsicher und nicht systematisch.' },
  ] },
  { id: '148ae1ec-3cd4-45ac-832e-780e276b55c1', fachbereich: 'VWL', musterlosung: 'Die Beveridge-Kurve verschiebt sich nach aussen, wenn bei gleicher Konjunktur gleichzeitig mehr Arbeitslose und mehr offene Stellen existieren. Ursachen sind: Mismatch zwischen Qualifikationen und offenen Stellen, hemmende Arbeitsmarkt-Regulierungen (höherer Kündigungsschutz) und grosszügige Arbeitslosenunterstützung, die die Suchintensität senkt. Ein konjunktureller Aufschwung verschiebt hingegen nur den Punkt entlang der bestehenden Kurve.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Mismatch zwischen Qualifikationen und offenen Stellen verschiebt die Kurve nach aussen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Ein Aufschwung bewegt den Punkt entlang der Kurve — verschiebt sie nicht.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Starre Regulierungen erschweren die Besetzung offener Stellen — Kurve nach aussen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Geringere Suchintensität lässt Vakanzen und Arbeitslose gleichzeitig steigen.' },
  ] },
  { id: '1514a248-33aa-40de-b5ca-af1cc20969d2', fachbereich: 'VWL', musterlosung: 'Die Arbeitslosenquote (SECO) basiert auf beim Arbeitsamt registrierten Arbeitslosen. Weil die Registrierungskriterien und Bezugsberechtigungen international variieren, ist sie für Ländervergleiche ungeeignet. International vergleichbar ist die Erwerbslosenquote nach ILO-Standard: Sie basiert auf Stichprobenbefragungen (SAKE) und einheitlichen Kriterien — damit kann sie auch Stellensuchende erfassen, die nicht registriert sind.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Andere Länder berechnen ebenfalls eine Arbeitslosenquote — aber mit unterschiedlichen Kriterien.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Berechnung ist nicht kompliziert, sondern uneinheitlich.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Registrierungs- und Bezugsberechtigungs-Unterschiede machen Vergleiche unzuverlässig.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Inflation spielt für diese Quote keine Rolle.' },
  ] },
  { id: '163768e0-cd23-4c15-9baf-46547c5ac511', fachbereich: 'VWL', musterlosung: 'Die Erwerbstätigenstatistik ist personenorientiert: Jede erwerbstätige Person wird genau einmal gezählt. Die Beschäftigungsstatistik ist stellenorientiert: Personen mit mehreren Stellen werden mehrfach gezählt. Der Unterschied wird durch die Mehrfachbeschäftigung erzeugt. Für Auswertungen zum Arbeitsmarkt ist je nach Fragestellung die eine oder andere Statistik geeigneter — Personen-Effekte versus Stellen-Effekte.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Beschäftigungsstatistik erfasst alle Sektoren, nicht nur die Industrie.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Es gibt einen klaren Unterschied — Personen vs. Stellen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Personen- vs. stellenorientiert — Mehrfachbeschäftigung als Unterscheidungsgrösse.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Altersgruppen sind nicht das Unterscheidungsmerkmal.' },
  ] },
  { id: '16916eb5-c6bd-4b7a-a6d3-1289c767adf1', fachbereich: 'VWL', musterlosung: 'Herbert Simon (1957) prägte den Begriff «bounded rationality». Die Welt ist zu komplex, um alle Informationen zu sammeln und vollständig zu verarbeiten. Deshalb nutzen Menschen Heuristiken — vereinfachte Faustregeln — die meistens gut funktionieren, aber gelegentlich zu systematischen Fehlern führen. Die Verhaltensökonomik baut darauf auf und erklärt Abweichungen vom rationalen Idealmodell.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Begrenzte Rationalität bezieht sich auf die Verarbeitungskapazität, nicht auf Situationen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Das Modell sagt nicht, dass Menschen irrational sind — sie entscheiden nur beschränkt rational.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Heuristiken kompensieren beschränkte Informationsverarbeitung.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Intelligenz ist nicht das Unterscheidungsmerkmal — alle Menschen haben begrenzte Rationalität.' },
  ] },
  { id: '17a52e90-d432-4f6a-b25f-9437f51ea78f', fachbereich: 'VWL', musterlosung: 'Die Bruttoverschuldung umfasst alle Schulden eines Staates. Die Nettoverschuldung zieht davon die Vermögenswerte ab — Infrastruktur, Staatsbeteiligungen, Reserven. Sie wäre ökonomisch aussagekräftiger als die Bruttoverschuldung, weil sie die finanzielle Substanz berücksichtigt. International fehlen jedoch einheitliche Bewertungsstandards für Staatsvermögen, weshalb meistens die Bruttoverschuldung verglichen wird (z.B. Maastricht-Kriterien).', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Der Unterschied liegt bei den Vermögenswerten, nicht bei der Schuldnernation.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Bruttoverschuldung umfasst In- und Ausland gleichermassen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Nettoverschuldung gleich Brutto minus Vermögen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Brutto und Netto sind unterschiedliche Konzepte.' },
  ] },
  { id: '17b33c02-b0b0-4c6b-ad46-891a0ccf82d3', fachbereich: 'VWL', musterlosung: 'Das magische Sechseck der Wirtschaftspolitik umfasst sechs gleichwertige Ziele: Preisstabilität, Vollbeschäftigung, angemessenes Wirtschaftswachstum, aussenwirtschaftliches Gleichgewicht, gerechte Einkommens- und Vermögensverteilung sowie Umweltqualität. Maximierung von Unternehmensgewinnen gehört nicht dazu — das ist ein betriebswirtschaftliches, kein wirtschaftspolitisches Ziel. Das Adjektiv «magisch» verweist auf die Zielkonflikte zwischen diesen sechs Zielen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Preisstabilität gehört zum magischen Sechseck.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Unternehmensgewinne sind betriebswirtschaftlich, kein wirtschaftspolitisches Ziel.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Umweltqualität ist ein Ziel des Sechsecks.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Vollbeschäftigung gehört ebenfalls zum Sechseck.' },
  ] },
  { id: '17f1c80e-94b1-40d6-9e12-b92604a0e1d6', fachbereich: 'VWL', musterlosung: 'Die Steuerinzidenz zeigt, wer die wirtschaftliche Last einer Steuer wirklich trägt. Die weniger elastische Marktseite trägt stets die grössere Last (sie kann schlecht ausweichen). Zudem ist es irrelevant, wo die Steuer formal erhoben wird: Die wirtschaftliche Last hängt nur von den Elastizitäten ab, nicht von der juristischen Auferlegung. Daraus folgt, dass die formal belastete Seite nicht immer ökonomisch belastet ist.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Formale und ökonomische Belastung können auseinanderfallen — ist der Kern der Inzidenzlehre.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Weniger elastische Seite trägt die grössere Last.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Formale Zuteilung ist für die ökonomische Inzidenz irrelevant.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Überwälzung hängt von Elastizitäten ab, nicht von der formalen Zuteilung.' },
  ] },
  { id: '17fe2a83-e353-4718-b314-849919b08f4c', fachbereich: 'VWL', musterlosung: 'Die Baumol\'sche Kostenkrankheit beschreibt, dass personalintensive Dienstleistungen (Pflege, Bildung, Kunst) kaum produktiver werden. Eine Pflegefachperson kann nicht doppelt so viele Patienten betreuen wie vor 50 Jahren. Löhne steigen aber mit der Gesamtwirtschaft — sonst würde niemand mehr in der Pflege arbeiten. Folge: Die Kosten im Gesundheitswesen steigen relativ zum BIP. Das Phänomen ist kein Versagen, sondern strukturell bedingt.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Pharmagewinne sind ein separates Problem — die Kostenkrankheit ist strukturell.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: Produktivitätsstagnation bei steigenden Löhnen — klassische Baumol\'sche Logik.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Krankheitsrate ist kein zentraler Faktor im Baumol-Modell.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Arztgehälter sind ein Teilaspekt — das Problem ist umfassender.' },
  ] },
  { id: '180677f9-aa61-419a-bc4b-a0bb4c1434e9', fachbereich: 'VWL', musterlosung: 'Alle drei Geldfunktionen sind beteiligt. Tauschmittel: Max erhält Geld für die Spielkonsole. Recheneinheit: Der Preis von 200 Franken drückt den Wert der Konsole in einer vergleichbaren Einheit aus. Wertaufbewahrungsmittel: Max legt das Geld auf sein Sparkonto, um es später für das Fahrrad einzusetzen. Das Beispiel illustriert, wie alle drei Funktionen im Alltag ineinandergreifen.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Auch die Recheneinheits- und Wertaufbewahrungsfunktion sind involviert.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die Wertaufbewahrung fehlt in dieser Auswahl — auf dem Sparkonto gelagert.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Verkauf (Tausch), Preisangabe (Recheneinheit), Sparen (Wertaufbewahrung).' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Die Recheneinheitsfunktion (Preis in CHF) fehlt in dieser Auswahl.' },
  ] },
  { id: '182b0f44-d733-4515-bf78-dacdeb0d3240', fachbereich: 'VWL', musterlosung: 'Konjunkturprognosen sind unsicher, weil die Wirtschaft ein komplexes System ist. Unvorhergesehene Ereignisse (Kriege, Pandemien, Finanzkrisen), psychologische Faktoren (Stimmungsumschwünge) und politische Entscheide können die Entwicklung jederzeit verändern. Prognosemodelle bilden die Realität nur vereinfacht ab. Ökonomen publizieren deshalb meistens Bandbreiten statt Punktprognosen — das ist keine methodische Schwäche, sondern realitätsgerechte Darstellung der Unsicherheit.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Prognostiker haben professionelle Interessen an Genauigkeit, nicht an Fehlprognosen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Auch andere Grössen werden prognostiziert — Beschäftigung, Inflation, Investitionen.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Auch Schweizer Konjunkturprognosen werden routinemässig erstellt (SECO, KOF).' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Unvorhersehbare Faktoren und Modellvereinfachungen begrenzen die Prognosegüte.' },
  ] },
  { id: '192fc5fd-d836-46d0-a42f-cd3ca1517085', fachbereich: 'VWL', musterlosung: 'Die Erwerbsquote gibt den Anteil der Erwerbspersonen (Erwerbstätige plus Arbeitsuchende) an der Wohnbevölkerung im Alter von 15 bis 64 Jahren an. Sie zeigt, wie stark die erwerbsfähige Bevölkerung am Arbeitsmarkt teilnimmt. In der Schweiz liegt sie bei rund 84 Prozent. Sie ist nicht identisch mit der Beschäftigungsquote (nur tatsächlich Beschäftigte) oder der Arbeitslosenquote.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Das ist die Arbeitslosenquote — die Erwerbsquote erfasst alle Erwerbspersonen.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die durchschnittliche Arbeitszeit ist die Wochenarbeitszeit, nicht die Erwerbsquote.' },
    { feld: 'optionen', id: 'opt-2', text: 'Korrekt: Erwerbspersonen in Prozent der 15–64-Jährigen.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Teilzeit-Vollzeit-Verhältnis ist ein anderer Indikator.' },
  ] },
  { id: '1950caba-b264-4155-b655-09a9e3f39737', fachbereich: 'VWL', musterlosung: 'Die Erwerbslosenquote (BFS) basiert auf der Schweizerischen Arbeitskräfteerhebung (SAKE) — einer repräsentativen Stichprobenbefragung. Sie nutzt die ILO-Definition und ist deshalb international vergleichbar. Sie erfasst auch Personen, die nicht beim Arbeitsamt registriert, aber aktiv auf Stellensuche sind. Darum ist die Erwerbslosenquote in der Schweiz regelmässig HÖHER als die Arbeitslosenquote des SECO — nicht tiefer.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: SAKE-Stichprobenbefragung ist die Datengrundlage der Erwerbslosenquote.' },
    { feld: 'optionen', id: 'opt-1', text: 'Korrekt: ILO-Standard macht internationale Vergleiche möglich.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Umgekehrt — die Erwerbslosenquote ist typisch HÖHER als die Arbeitslosenquote.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Nicht-registrierte Stellensuchende werden erfasst.' },
  ] },
  { id: '19cb7072-920e-4062-80c5-b9e6cd48e39e', fachbereich: 'VWL', musterlosung: 'Konjunktur beschreibt das Auf und Ab des BIP in kurzer Frist — Quartale bis ein bis zwei Jahre. Wachstum hingegen betrachtet die langfristige Entwicklung des realen BIP pro Kopf über Jahre und Jahrzehnte. Konjunktur ist die Welle auf dem Ozean, Wachstum der steigende oder fallende Meeresspiegel darunter. Beide Begriffe ergänzen sich — kurze vs. lange Frist, Schwankung vs. Trend.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Falsch: Die Zeithorizonte sind grundlegend unterschiedlich.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Beide Konzepte umfassen die gesamte Volkswirtschaft, nicht nur einzelne Sektoren.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Beide Konzepte nutzen das reale BIP — Inflation wird herausgerechnet.' },
    { feld: 'optionen', id: 'opt-3', text: 'Korrekt: Konjunktur ist kurzfristig, Wachstum langfristig.' },
  ] },
  { id: '1b6873cd-a6d0-4f99-810a-7c231eee70db', fachbereich: 'VWL', musterlosung: 'Die AHV (1. Säule) wird im Umlageverfahren finanziert: Die aktuellen Beiträge der Erwerbstätigen (Lohnprozente, je hälftig von Arbeitgeber und Arbeitnehmer) fliessen direkt in die laufenden Renten. Die heutigen Erwerbstätigen finanzieren die heutigen Rentner — das ist der Generationenvertrag. Ergänzt wird das Umlageverfahren durch Mehrwertsteuer-Anteile und Bundesbeiträge. Im Gegensatz dazu funktioniert die 2. Säule im Kapitaldeckungsverfahren.', teilerklaerungen: [
    { feld: 'optionen', id: 'opt-0', text: 'Korrekt: Umlageverfahren — laufende Beiträge finanzieren laufende Renten.' },
    { feld: 'optionen', id: 'opt-1', text: 'Falsch: Die AHV ist obligatorisch — keine freiwillige Finanzierung.' },
    { feld: 'optionen', id: 'opt-2', text: 'Falsch: Kapitaldeckungsverfahren gilt für die 2. Säule (BVG), nicht die AHV.' },
    { feld: 'optionen', id: 'opt-3', text: 'Falsch: Mehrwertsteuer ist nur eine Ergänzung — Hauptfinanzierung sind Lohnbeiträge.' },
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
  console.log(`Session 12: ${updates.length} Fragen appended (${withTeile} mit Teilerklärungen, ${updates.length - withTeile} ohne).`)
  console.log(`Total verarbeitet: ${state.verarbeitet} / ${state.totalFragen}`)
}

main().catch(err => { console.error(err); process.exit(1) })
