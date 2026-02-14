// Übungspool: Staatsverschuldung
// Fachbereich: VWL
// Kapitel: Eisenhut, Aktuelle Volkswirtschaftslehre (2021), Kapitel 11
// Quellen: Eisenhut Kap. 11, Präsentation Staatsschulden, Arbeitsauftrag Staatsverschuldung
// Anzahl Fragen: 55

window.POOL_META = {
  id: "vwl_staatsverschuldung",
  fach: "VWL",
  title: "Übungspool: Staatsverschuldung",
  meta: "SF GYM3 · Gymnasium Hofwil · Individuell üben",
  color: "vwl"
};

window.TOPICS = {
  staatsanteil: {label:"Staatsanteil, Staatsquote & Fiskalquote", short:"Staatsanteil"},
  ausgaben:     {label:"Ausgaben des Bundes", short:"Ausgaben"},
  einnahmen:    {label:"Einnahmen des Bundes", short:"Einnahmen"},
  defizite:     {label:"Konjunkturelle & strukturelle Defizite", short:"Defizite"},
  international:{label:"Internationale Staatsverschuldung", short:"International"},
  gefahren:     {label:"Gefahren & Risiken der Verschuldung", short:"Gefahren"},
  richtlinien:  {label:"Richtlinien & Schuldenbremse", short:"Richtlinien"}
};

window.QUESTIONS = [
// ── STAATSANTEIL (s01–s09) ──
{id:"s01", topic:"staatsanteil", type:"mc", diff:1, tax:"K1",
 q:"Was misst die Staatsquote?",
 options:[
   {v:"A", t:"Den Anteil der Staatsausgaben am BIP."},
   {v:"B", t:"Den Anteil der Steuereinnahmen am BIP."},
   {v:"C", t:"Den Anteil der Staatsschulden am BIP."},
   {v:"D", t:"Den Anteil der Sozialversicherungsbeiträge am BIP."}
 ],
 correct:"A",
 explain:"Die Staatsquote gibt an, wie viel der gesamten volkswirtschaftlichen Leistung (BIP) durch die Hand des Staates fliesst. Sie umfasst die Ausgaben von Bund, Kantonen, Gemeinden und öffentlichen Sozialversicherungen."},

{id:"s02", topic:"staatsanteil", type:"mc", diff:1, tax:"K1",
 q:"Was misst die Fiskalquote?",
 options:[
   {v:"A", t:"Die Fiskaleinnahmen aller Staatsebenen inkl. Sozialversicherungsbeiträge in % des BIP."},
   {v:"B", t:"Die Gesamtausgaben des Staates in % des BIP."},
   {v:"C", t:"Den Anteil der Mehrwertsteuer an den gesamten Steuern."},
   {v:"D", t:"Die Verschuldung des Staates in % des BIP."}
 ],
 correct:"A",
 explain:"Die Fiskalquote entspricht den Fiskaleinnahmen aller Staatsebenen einschliesslich der obligatorischen Sozialversicherungsbeiträge in Prozent des BIP. Sie misst somit die gesamte Steuerbelastung."},

{id:"s03", topic:"staatsanteil", type:"tf", diff:1, tax:"K1",
 q:"Die Staatsquote der Schweiz liegt im internationalen Vergleich auf einem tiefen Niveau.",
 correct:true,
 explain:"Korrekt. Die Staatsquote der Schweiz lag zuletzt bei rund 33%, was im internationalen Vergleich tief ist. Der OECD-Durchschnitt der Fiskalquote liegt bei ca. 35%."},

{id:"s04", topic:"staatsanteil", type:"tf", diff:2, tax:"K2",
 q:"Gemäss dem 'Gesetz der wachsenden Ausdehnung der Staatstätigkeit' von Adolf Wagner wachsen die Staatsausgaben langfristig proportional zum Wirtschaftswachstum.",
 correct:false,
 explain:"Falsch. Wagner formulierte, dass die Staatsausgaben überproportional zum Wirtschaftswachstum ansteigen – also schneller als die Wirtschaft wächst."},

{id:"s05", topic:"staatsanteil", type:"sort", diff:2, tax:"K2",
 q:"Ordnen Sie die folgenden Aussagen den Gründen für das Wachstum der Staatsausgaben zu.",
 categories:["Zunehmende Staatsaufgaben", "Neue Politische Ökonomie (Public Choice)"],
 items:[
   {t:"Ausbau der Sozial- und Bildungspolitik", cat:0},
   {t:"Budgetmaximierung durch Verwaltungsbeamte", cat:1},
   {t:"Staatliche Eingriffe im Umwelt- und Gesundheitssektor", cat:0},
   {t:"Ausgabenfreudigkeit der Parlamente", cat:1},
   {t:"Wachsende Infrastrukturaufgaben", cat:0},
   {t:"Macht und Prestige durch hohes Budget", cat:1}
 ],
 explain:"Die Neue Politische Ökonomie erklärt das Ausgabenwachstum durch eigeninteressierte Akteure (Beamte, Politiker). Zunehmende Staatsaufgaben ergeben sich aus erweiterten Aufgabenbereichen wie Sozial-, Bildungs- und Umweltpolitik."},

{id:"s06", topic:"staatsanteil", type:"fill", diff:1, tax:"K1",
 q:"Der TAX-I (Tax Independence Day) bezeichnet den Tag, an dem ein Steuerzahler das Geld zum Bezahlen seiner {0} verdient hat. In der Schweiz lag dieser Tag zuletzt ca. Mitte {1}.",
 blanks:[
   {answer:"Steuern", alts:["Steuerlast","Steuerbelastung"]},
   {answer:"April", alts:[]}
 ],
 explain:"Rechnet man die Fiskalquote in Tage um, benötigt der durchschnittliche Steuerzahler gut 100 Tage, um seine Steuer- und Sozialversicherungsverpflichtungen zu erfüllen. Nimmt man die erweiterte Fiskalquote, verschiebt sich der TAX-I sogar auf Ende Mai."},

{id:"s07", topic:"staatsanteil", type:"mc", diff:2, tax:"K2",
 q:"Warum sind die Möglichkeiten zur Produktivitätssteigerung im öffentlichen Sektor geringer als in der Privatwirtschaft?",
 options:[
   {v:"A", t:"Öffentliche Dienstleistungen sind arbeitsintensiv und schwer automatisierbar."},
   {v:"B", t:"Der Staat darf keine modernen Technologien einsetzen."},
   {v:"C", t:"Staatsangestellte arbeiten grundsätzlich weniger produktiv."},
   {v:"D", t:"Der Staat hat keinen Zugang zum Kapitalmarkt."}
 ],
 correct:"A",
 explain:"Öffentliche Leistungen wie Bildung, Gesundheit und Verwaltung sind personalintensiv. Anders als in der industriellen Produktion lässt sich die Arbeitsproduktivität hier nur beschränkt steigern, was zu einer überdurchschnittlichen Kostenentwicklung führt."},

{id:"s08", topic:"staatsanteil", type:"open", diff:3, tax:"K4",
 q:"Die Neue Politische Ökonomie (Public Choice) überträgt das ökonomische Prinzip auf den politischen Bereich. Erklären Sie, warum dieses Verhalten tendenziell zu steigenden Staatsausgaben führt.",
 sample:"Die Bürokratie strebt nach Budget- und Ausgabenmaximierung, weil Macht, Prestige und Einkommen an die Grösse des verwalteten Budgets geknüpft sind. Beamte haben einen Anreiz, ihr Budget jährlich auszudehnen. Kombiniert mit der Ausgabenfreudigkeit der Parlamente, die vor Wahlen gerne Ausgaben bewilligen, entsteht eine systematische Tendenz zu höheren Staatsausgaben.",
 explain:"Der Public-Choice-Ansatz erklärt, warum staatliche Ausgaben wachsen, obwohl dies nicht immer im Interesse der Bürger ist. Es fehlt ein Gewinnkriterium wie in der Privatwirtschaft – stattdessen dient die Budgetgrösse als Erfolgsindikator."},

{id:"s09", topic:"staatsanteil", type:"tf", diff:2, tax:"K2",
 q:"Mit steigendem Einkommen steigt die Nachfrage nach Staatsleistungen überproportional an.",
 correct:true,
 explain:"Korrekt. Öffentliche Leistungen (z.B. Bildung, Gesundheit, Sicherheit) gelten als einkommenselastisch: Je wohlhabender eine Gesellschaft, desto mehr erwartet sie vom Staat."},

// ── AUSGABEN (a01–a08) ──
{id:"a01", topic:"ausgaben", type:"mc", diff:1, tax:"K1",
 q:"Welcher Ausgabenposten des Bundes ist der grösste?",
 options:[
   {v:"A", t:"Soziale Wohlfahrt"},
   {v:"B", t:"Landesverteidigung"},
   {v:"C", t:"Bildung"},
   {v:"D", t:"Verkehr"}
 ],
 correct:"A",
 explain:"Die soziale Wohlfahrt ist mit rund 22 Mrd. Fr. (Rechnung 2018) der mit Abstand grösste Ausgabenposten des Bundes. Am stärksten angestiegen sind allerdings die Ausgaben für Bildung (+67% seit 2008)."},

{id:"a02", topic:"ausgaben", type:"tf", diff:1, tax:"K1",
 q:"Der Bundeshaushalt der Schweiz wird als 'Transferhaushalt' bezeichnet, weil der Bund zwei Drittel seiner Mittel als Übertragungen an Dritte weitergibt.",
 correct:true,
 explain:"Korrekt. Nur ein Drittel der Bundesausgaben verbleibt für eigene Zwecke (Verwaltung, Verteidigung, Hochschulen). Rund 59% der Gesamtausgaben sind Subventionen, die grösstenteils in die soziale Wohlfahrt fliessen."},

{id:"a03", topic:"ausgaben", type:"fill", diff:1, tax:"K1",
 q:"{0} sind unentgeltliche finanzielle Leistungen der öffentlichen Hand. Sie beanspruchen rund {1}% der gesamten Bundesausgaben.",
 blanks:[
   {answer:"Subventionen", alts:[]},
   {answer:"59", alts:["60"]}
 ],
 explain:"Subventionen machen ca. 59% der Bundesausgaben aus. 45% aller Subventionen entfallen auf die soziale Wohlfahrt, gefolgt von Bildung und Forschung (17%), Verkehr (15%) und Landwirtschaft (9%)."},

{id:"a04", topic:"ausgaben", type:"sort", diff:2, tax:"K2",
 q:"Ordnen Sie die folgenden Ausgabenposten nach ihrem Anteil an den Bundesausgaben (2018): vom grössten zum kleinsten.",
 categories:["Rang 1 (grösster)", "Rang 2", "Rang 3"],
 items:[
   {t:"Soziale Wohlfahrt (ca. 22 Mrd. Fr.)", cat:0},
   {t:"Finanzen und Steuern (ca. 10 Mrd. Fr.)", cat:1},
   {t:"Verkehr (ca. 10 Mrd. Fr.)", cat:1},
   {t:"Bildung (ca. 8 Mrd. Fr.)", cat:2},
   {t:"Landesverteidigung (ca. 6 Mrd. Fr.)", cat:2}
 ],
 explain:"Soziale Wohlfahrt dominiert mit ca. 22 Mrd. Fr. Es folgen Finanzen/Steuern und Verkehr (je ca. 10 Mrd. Fr.), dann Bildung (ca. 8 Mrd. Fr.) und Landesverteidigung (ca. 6 Mrd. Fr.)."},

{id:"a05", topic:"ausgaben", type:"mc", diff:2, tax:"K2",
 q:"Im Ausgabenposten 'Finanzen und Steuern' des Bundes sind vor allem enthalten:",
 options:[
   {v:"A", t:"Schuldzinsen und Kantonsanteile an den Bundessteuern."},
   {v:"B", t:"Die Gehälter der Steuerbeamten."},
   {v:"C", t:"Die Ausgaben für die Eidgenössische Steuerverwaltung."},
   {v:"D", t:"Die Kosten für die Steuerhinterziehungsbekämpfung."}
 ],
 correct:"A",
 explain:"Der Posten 'Finanzen und Steuern' enthält insbesondere die Schuldzinsen auf der Bundesschuld sowie die Kantonsanteile an den Bundessteuern (z.B. direkte Bundessteuer)."},

{id:"a06", topic:"ausgaben", type:"mc", diff:2, tax:"K2",
 q:"Welcher Bundesausgabenbereich verzeichnete zwischen 2008 und 2018 das stärkste prozentuales Wachstum?",
 options:[
   {v:"A", t:"Bildung (+67%)"},
   {v:"B", t:"Soziale Wohlfahrt (+27%)"},
   {v:"C", t:"Verkehr (+15%)"},
   {v:"D", t:"Landesverteidigung (+11%)"}
 ],
 correct:"A",
 explain:"Die Bildungsausgaben stiegen mit +67% am stärksten, gefolgt von der sozialen Wohlfahrt (+27%). Die Ausgaben für Finanzen und Steuern sanken sogar um 5%."},

{id:"a07", topic:"ausgaben", type:"tf", diff:2, tax:"K2",
 q:"Dem Bund verbleibt der grössere Teil seiner Mittel für eigene Zwecke wie Verwaltung und Landesverteidigung.",
 correct:false,
 explain:"Falsch. Dem Bund verbleibt nur der kleinere Teil (ca. ein Drittel) für eigene Zwecke. Zwei Drittel werden als Übertragungen an Dritte weitergegeben – hauptsächlich als Subventionen."},

{id:"a08", topic:"ausgaben", type:"open", diff:3, tax:"K4",
 q:"Erklären Sie, warum der Bundeshaushalt als 'Transferhaushalt' bezeichnet wird, und diskutieren Sie eine mögliche Problematik dieser Struktur.",
 sample:"Der Bund gibt ca. zwei Drittel seiner Mittel als Übertragungen (vor allem Subventionen) an Kantone, Gemeinden, Sozialversicherungen und andere Empfänger weiter. Nur ein Drittel nutzt er für eigene Aufgaben. Eine Problematik besteht darin, dass der Bund so hauptsächlich Gelder umverteilt, was die Ausgabensteuerung erschwert: Die gebundenen Transfers lassen wenig Spielraum für Kürzungen bei Bedarf.",
 explain:"Der Begriff 'Transferhaushalt' verdeutlicht, dass der Bund primär als Umverteiler fungiert. 45% aller Subventionen fliessen in die soziale Wohlfahrt."},

// ── EINNAHMEN (e01–e08) ──
{id:"e01", topic:"einnahmen", type:"mc", diff:1, tax:"K1",
 q:"Welche Steuer ist die wichtigste Einnahmequelle des Bundes?",
 options:[
   {v:"A", t:"Die Mehrwertsteuer"},
   {v:"B", t:"Die Einkommenssteuer"},
   {v:"C", t:"Die Verrechnungssteuer"},
   {v:"D", t:"Die Mineralölsteuer"}
 ],
 correct:"A",
 explain:"Die Mehrwertsteuer und die direkte Bundessteuer sind die beiden dominierenden Einnahmequellen des Bundes. Die Mehrwertsteuer ist eine indirekte Steuer auf den Verbrauch."},

{id:"e02", topic:"einnahmen", type:"sort", diff:1, tax:"K1",
 q:"Ordnen Sie die folgenden Steuern der korrekten Kategorie zu.",
 categories:["Direkte Steuern", "Indirekte Steuern"],
 items:[
   {t:"Einkommenssteuer", cat:0},
   {t:"Mehrwertsteuer", cat:1},
   {t:"Vermögenssteuer", cat:0},
   {t:"Mineralölsteuer", cat:1},
   {t:"Direkte Bundessteuer", cat:0},
   {t:"Tabaksteuer", cat:1}
 ],
 explain:"Direkte Steuern werden auf Einkommen und Vermögen erhoben. Indirekte Steuern belasten den Verbrauch (Konsum). Nirgendwo in Europa ist der Anteil der direkten Steuern so hoch wie in der Schweiz."},

{id:"e03", topic:"einnahmen", type:"fill", diff:1, tax:"K1",
 q:"Direkte Steuern werden auf {0} und {1} erhoben. Indirekte Steuern werden auf den {2} erhoben.",
 blanks:[
   {answer:"Einkommen", alts:["das Einkommen"]},
   {answer:"Vermögen", alts:["das Vermögen"]},
   {answer:"Verbrauch", alts:["Konsum"]}
 ],
 explain:"Direkte Steuern betreffen direkt die wirtschaftliche Leistungsfähigkeit (Einkommen, Vermögen). Indirekte Steuern belasten den Verbrauch – die wichtigste ist die Mehrwertsteuer."},

{id:"e04", topic:"einnahmen", type:"tf", diff:1, tax:"K1",
 q:"Nirgendwo in Europa ist der Anteil der direkten Steuern so hoch wie in der Schweiz.",
 correct:true,
 explain:"Korrekt. Die Schweiz hat im europäischen Vergleich einen besonders hohen Anteil an direkten Steuern (Einkommens- und Vermögenssteuern) an den Gesamtsteuereinnahmen."},

{id:"e05", topic:"einnahmen", type:"mc", diff:2, tax:"K2",
 q:"Neben Steuern erzielt der Bund auch Einnahmen aus anderen Quellen. Welche der folgenden gehört NICHT dazu?",
 options:[
   {v:"A", t:"Zölle auf Importe aus der EU"},
   {v:"B", t:"Gebühren für Amtshandlungen"},
   {v:"C", t:"Gewinnablieferung der SNB"},
   {v:"D", t:"Erträge aus privatrechtlicher Tätigkeit (z.B. Museen)"}
 ],
 correct:"A",
 explain:"Die Schweiz erhebt als Nicht-EU-Mitglied zwar Zölle, diese machen aber keinen wesentlichen Einnahmeposten aus. Zu den übrigen Einnahmen gehören Gebühren, Monopolerträge (z.B. SNB-Gewinnablieferung) und Erträge aus privatrechtlicher Tätigkeit."},

{id:"e06", topic:"einnahmen", type:"tf", diff:2, tax:"K2",
 q:"Die Verrechnungssteuer ist eine direkte Steuer auf Kapitalerträge.",
 correct:false,
 explain:"Falsch. Die Verrechnungssteuer ist eine indirekte Steuer, die als Sicherungssteuer auf Kapitalerträgen (z.B. Dividenden, Zinsen) erhoben wird. Sie soll die korrekte Deklaration in der Steuererklärung sicherstellen und wird bei korrekter Deklaration zurückerstattet."},

{id:"e07", topic:"einnahmen", type:"mc", diff:2, tax:"K2",
 q:"Die gesamten Einnahmen des Bundes sind von 2008 bis 2019 um wie viel Prozent gestiegen?",
 options:[
   {v:"A", t:"Etwa 15,6%"},
   {v:"B", t:"Etwa 8%"},
   {v:"C", t:"Etwa 25%"},
   {v:"D", t:"Etwa 5%"}
 ],
 correct:"A",
 explain:"Die Einnahmen des Bundes stiegen von 2008 bis 2019 um 15,6%. Im gleichen Zeitraum stiegen die Ausgaben nur um 8% – was auf eine Verbesserung der Haushaltslage hindeutet."},

{id:"e08", topic:"einnahmen", type:"open", diff:3, tax:"K4",
 q:"Erklären Sie den Unterschied zwischen der Fiskalquote und der erweiterten Fiskalquote der Schweiz und diskutieren Sie, warum dieser Unterschied relevant ist.",
 sample:"Die Fiskalquote umfasst die Steuern und obligatorischen Sozialversicherungsbeiträge in % des BIP (ca. 28,6% in der Schweiz). Die erweiterte Fiskalquote berücksichtigt alle Zwangsabgaben und liegt gemäss Avenir Suisse bei ca. 45%. Der Unterschied ist relevant, weil er zeigt, dass die tatsächliche Belastung der Bürger deutlich höher ist als die offizielle Fiskalquote suggeriert – nur gut die Hälfte des Einkommens steht zur freien Verfügung.",
 explain:"Die erweiterte Fiskalquote schliesst z.B. obligatorische Krankenkassenprämien und weitere Zwangsabgaben ein, die in der offiziellen Statistik nicht enthalten sind."},

// ── DEFIZITE (d01–d08) ──
{id:"d01", topic:"defizite", type:"mc", diff:1, tax:"K1",
 q:"Was versteht man unter einem konjunkturellen Defizit?",
 options:[
   {v:"A", t:"Ein vorübergehendes Defizit aufgrund rezessionsbedingt tieferer Einnahmen und höherer Ausgaben."},
   {v:"B", t:"Ein dauerhaftes Defizit, das auch bei guter Konjunktur bestehen bleibt."},
   {v:"C", t:"Ein Defizit, das durch Fehlinvestitionen des Staates entsteht."},
   {v:"D", t:"Ein Defizit, das durch zu hohe Zinszahlungen verursacht wird."}
 ],
 correct:"A",
 explain:"Konjunkturelle Defizite entstehen in Rezessionsphasen durch sinkende Steuereinnahmen und steigende Sozialausgaben. Sie verschwinden im Aufschwung von selbst und wirken als automatische Stabilisatoren."},

{id:"d02", topic:"defizite", type:"mc", diff:1, tax:"K1",
 q:"Was kennzeichnet ein strukturelles Defizit?",
 options:[
   {v:"A", t:"Die Einnahmen decken die Ausgaben auch bei konjunktureller Normallage nicht."},
   {v:"B", t:"Es entsteht nur in Phasen einer Rezession."},
   {v:"C", t:"Es verschwindet automatisch im nächsten Aufschwung."},
   {v:"D", t:"Es wird durch sinkende Zinsen verursacht."}
 ],
 correct:"A",
 explain:"Strukturelle Defizite bestehen unabhängig von der Konjunkturlage. Sie können nur durch Ausgabenkürzungen oder Steuererhöhungen beseitigt werden – im Gegensatz zu konjunkturellen Defiziten, die sich im Aufschwung von selbst korrigieren."},

{id:"d03", topic:"defizite", type:"sort", diff:2, tax:"K2",
 q:"Ordnen Sie die folgenden Merkmale den Defizitarten zu.",
 categories:["Konjunkturelles Defizit", "Strukturelles Defizit"],
 items:[
   {t:"Verschwindet im Aufschwung von selbst", cat:0},
   {t:"Nur durch Ausgabenkürzungen oder Steuererhöhungen beseitigbar", cat:1},
   {t:"Wirkt als automatischer Stabilisator", cat:0},
   {t:"Auch als 'selbstverschuldetes Defizit' bezeichenbar", cat:1},
   {t:"Entsteht durch rezessionsbedingt tiefere Einnahmen", cat:0},
   {t:"Dauerhaft nicht finanzierte Ausgaben", cat:1}
 ],
 explain:"Konjunkturelle Defizite sind temporär und stabilisierend (automatische Stabilisatoren). Strukturelle Defizite sind dauerhaft und erfordern aktives Handeln zur Beseitigung."},

{id:"d04", topic:"defizite", type:"tf", diff:2, tax:"K2",
 q:"Konjunkturelle Defizite sind unproblematisch, weil sie als automatische Stabilisatoren wirken.",
 correct:true,
 explain:"Korrekt. In einer Rezession stützen konjunkturelle Defizite die gesamtwirtschaftliche Nachfrage (keynesianische Logik). Im Aufschwung verschwinden sie dank steigender Einkommen, Gewinne und Umsätze wieder."},

{id:"d05", topic:"defizite", type:"fill", diff:2, tax:"K2",
 q:"Die Veränderung des {0} Defizits widerspiegelt den Impuls der aktiven Finanzpolitik – den sogenannten {1}.",
 blanks:[
   {answer:"strukturellen", alts:[]},
   {answer:"Fiskalimpuls", alts:[]}
 ],
 explain:"Der Fiskalimpuls misst, wie stark der Staat aktiv in die Konjunktur eingreift. Eine Veränderung des strukturellen Defizits zeigt den bewussten finanzpolitischen Impuls – im Gegensatz zu automatischen, konjunkturbedingten Schwankungen."},

{id:"d06", topic:"defizite", type:"mc", diff:2, tax:"K3",
 q:"In einer Rezession sinken die Einnahmen aus der Mehrwertsteuer besonders stark. Warum?",
 options:[
   {v:"A", t:"Weil die Konsumausgaben der Haushalte und Unternehmen zurückgehen."},
   {v:"B", t:"Weil der Staat den Mehrwertsteuersatz in Rezessionen automatisch senkt."},
   {v:"C", t:"Weil die Bevölkerung in Rezessionen keine Steuern mehr zahlen muss."},
   {v:"D", t:"Weil die Mehrwertsteuer nur auf Exporte erhoben wird."}
 ],
 correct:"A",
 explain:"Die Mehrwertsteuer wird auf den Konsum erhoben. In einer Rezession geben Haushalte und Unternehmen weniger aus, wodurch die Steuereinnahmen sinken. Auch die Verrechnungssteuer und Stempelabgaben reagieren konjunktursensibel."},

{id:"d07", topic:"defizite", type:"tf", diff:2, tax:"K2",
 q:"Bestimmte Bundesausgaben wie Personalausgaben und Renten sind indexgebunden und reagieren daher verzögert auf Konjunktureinbrüche.",
 correct:true,
 explain:"Korrekt. Indexgebundene Ausgaben (z.B. Löhne, Renten) lassen sich kurzfristig nicht senken. Manche Ausgaben steigen in Rezessionen sogar – z.B. Arbeitslosenentschädigungen. Das führt zu einem 'Schereneffekt' zwischen sinkenden Einnahmen und steigenden Ausgaben."},

{id:"d08", topic:"defizite", type:"open", diff:3, tax:"K4",
 q:"Erklären Sie anhand eines Beispiels, warum ein strukturelles Defizit problematischer ist als ein konjunkturelles Defizit.",
 sample:"Ein konjunkturelles Defizit entsteht z.B., wenn in einer Rezession die MwSt.-Einnahmen sinken und die Arbeitslosenentschädigungen steigen. Es korrigiert sich im Aufschwung automatisch. Ein strukturelles Defizit entsteht dagegen, wenn der Staat z.B. dauerhaft höhere Renten beschliesst, ohne die Finanzierung sicherzustellen. Dieses Defizit bleibt auch bei guter Konjunktur bestehen und lässt sich nur durch schmerzhafte Massnahmen (Leistungskürzungen oder Steuererhöhungen) beseitigen.",
 explain:"Strukturelle Defizite sind gefährlicher, weil sie sich kumulieren und über die Zeit zu einer wachsenden Verschuldung führen – unabhängig davon, wie gut die Wirtschaft läuft."},

// ── INTERNATIONAL (i01–i07) ──
{id:"i01", topic:"international", type:"mc", diff:1, tax:"K1",
 q:"Welches Land weist weltweit die höchste Schuldenquote (Schulden in % des BIP) auf?",
 options:[
   {v:"A", t:"Japan"},
   {v:"B", t:"USA"},
   {v:"C", t:"Griechenland"},
   {v:"D", t:"Italien"}
 ],
 correct:"A",
 explain:"Japan hat mit über 230% des BIP die höchste Schuldenquote weltweit. Es folgen Griechenland, Italien und Portugal. Die Schweiz belegt mit unter 30% einen der besten Plätze."},

{id:"i02", topic:"international", type:"tf", diff:1, tax:"K1",
 q:"Die Schweiz gehört im internationalen Vergleich zu den am stärksten verschuldeten Ländern.",
 correct:false,
 explain:"Falsch. Die Schweiz hat eine der tiefsten Schuldenquoten weltweit. Die Schuldenquote lag bei unter 30% des BIP, während z.B. Japan über 230%, Italien über 130% und die USA über 100% aufweisen."},

{id:"i03", topic:"international", type:"mc", diff:2, tax:"K2",
 q:"Warum wird die Staatsverschuldung typischerweise als Schuldenquote (in % des BIP) und nicht in absoluten Zahlen verglichen?",
 options:[
   {v:"A", t:"Weil erst das Verhältnis zur Wirtschaftsleistung die Tragbarkeit der Schulden zeigt."},
   {v:"B", t:"Weil absolute Zahlen schwieriger zu berechnen sind."},
   {v:"C", t:"Weil die UNO nur prozentuale Angaben akzeptiert."},
   {v:"D", t:"Weil absolute Zahlen geheim gehalten werden."}
 ],
 correct:"A",
 explain:"Absolute Schulden allein sagen wenig aus. Erst der Bezug zum BIP zeigt, ob ein Staat seine Schulden tragen kann. Ein Land mit hohem BIP kann höhere absolute Schulden bewältigen als ein kleines Land."},

{id:"i04", topic:"international", type:"fill", diff:2, tax:"K1",
 q:"In der Schweiz entfallen die Gesamtschulden (ohne Finanzsektor) zu 47% auf {0}, zu 35% auf {1} und zu 18% auf den {2}.",
 blanks:[
   {answer:"Private Haushalte", alts:["Haushalte"]},
   {answer:"Unternehmen", alts:[]},
   {answer:"Staat", alts:[]}
 ],
 explain:"In der Schweiz haben die privaten Haushalte den grössten Schuldenanteil (v.a. Hypotheken). Der Staatsanteil ist mit 18% vergleichsweise tief."},

{id:"i05", topic:"international", type:"mc", diff:2, tax:"K2",
 q:"Was ist der Unterschied zwischen Bruttoverschuldung und Nettoverschuldung eines Staates?",
 options:[
   {v:"A", t:"Die Nettoverschuldung berücksichtigt auch die Vermögenswerte des Staates."},
   {v:"B", t:"Die Bruttoverschuldung umfasst nur die Inlandsschulden."},
   {v:"C", t:"Die Nettoverschuldung berücksichtigt nur die Auslandsschulden."},
   {v:"D", t:"Es gibt keinen Unterschied – beide Begriffe sind synonym."}
 ],
 correct:"A",
 explain:"Die Nettoverschuldung = Bruttoschulden minus Vermögenswerte (z.B. Infrastruktur, Staatsbeteiligungen). Sie wäre aussagekräftiger, doch es fehlen internationale Standards zur Bewertung staatlicher Vermögen."},

{id:"i06", topic:"international", type:"tf", diff:2, tax:"K2",
 q:"Die Staatsverschuldung ist ausschliesslich ein Problem der Industrieländer.",
 correct:false,
 explain:"Falsch. In jüngster Zeit wachsen die Schulden auch in China und anderen Schwellenländern stark an. Die Verschuldung ist ein globales Problem, das alle Ländergruppen betrifft."},

{id:"i07", topic:"international", type:"open", diff:3, tax:"K5",
 q:"Beurteilen Sie: Warum ist es für Staaten politisch attraktiv, Ausgaben über Kredite statt über Steuererhöhungen zu finanzieren?",
 sample:"Kreditfinanzierung verschiebt die Zahllast auf zukünftige Generationen. Die heutigen Wähler profitieren von den Ausgaben, ohne die Kosten sofort tragen zu müssen. Steuererhöhungen sind politisch unpopulär und können zu Wahlniederlagen führen. Ökonomisch betrachtet ist Schulden-Machen kurzfristig rational – die Schweizer Schuldenbremse zeigt aber, dass langfristige Rationalität durch institutionelle Regeln erzwungen werden kann.",
 explain:"Die Verschiebung der Zahllast auf zukünftige Generationen macht die Kreditfinanzierung politisch attraktiv. Dies erklärt, warum viele Demokratien zu steigender Verschuldung neigen."},

// ── GEFAHREN (g01–g10) ──
{id:"g01", topic:"gefahren", type:"mc", diff:1, tax:"K1",
 q:"Was versteht man unter dem Verdrängungseffekt ('Crowding-out')?",
 options:[
   {v:"A", t:"Der Staat verdrängt als Kreditnehmer private Investoren vom Kapitalmarkt."},
   {v:"B", t:"Private Unternehmen verdrängen den Staat vom Arbeitsmarkt."},
   {v:"C", t:"Ausländische Investoren verdrängen inländische Anleger."},
   {v:"D", t:"Hohe Steuern verdrängen Unternehmen ins Ausland."}
 ],
 correct:"A",
 explain:"Beim Crowding-out konkurriert der Staat auf den Geld- und Kapitalmärkten mit privaten Investoren. Investoren ziehen den sicheren Schuldner Staat den privaten Nachfragern vor – private Investitionen werden dadurch verdrängt."},

{id:"g02", topic:"gefahren", type:"fill", diff:1, tax:"K1",
 q:"Der Staat kann seine Finanzierungslücke entweder durch den Verkauf von {0} am Kapitalmarkt oder durch {1} bei der Nationalbank decken.",
 blanks:[
   {answer:"Staatsobligationen", alts:["Wertpapieren","Staatsanleihen"]},
   {answer:"Kreditaufnahme", alts:["Kredite","Geldschöpfung"]}
 ],
 explain:"Beide Finanzierungswege haben unterschiedliche Auswirkungen: Kapitalmarktfinanzierung kann Zinsen treiben und Crowding-out verursachen. Zentralbankfinanzierung (Monetisierung) vergrössert die Geldmenge und birgt Inflationsgefahren."},

{id:"g03", topic:"gefahren", type:"tf", diff:2, tax:"K2",
 q:"Wenn der Staat seine Defizite durch Kreditaufnahme bei der Nationalbank finanziert, vergrössert sich die Geldmenge.",
 correct:true,
 explain:"Korrekt. Im Gegensatz zur Finanzierung am Kapitalmarkt führt die Monetisierung zu einer Ausweitung der Geldmenge. Dies birgt langfristig Inflationsgefahren, wenn die Geldmenge schneller wächst als das BIP."},

{id:"g04", topic:"gefahren", type:"mc", diff:2, tax:"K2",
 q:"Was passiert tendenziell mit den Zinsen, wenn der Staat am Kapitalmarkt grosse Mengen an Staatsanleihen ausgibt?",
 options:[
   {v:"A", t:"Die Zinsen steigen, weil die Geldnachfrage zunimmt."},
   {v:"B", t:"Die Zinsen sinken, weil mehr Geld im Umlauf ist."},
   {v:"C", t:"Die Zinsen bleiben unverändert, weil der Staat kein normaler Marktteilnehmer ist."},
   {v:"D", t:"Die Zinsen sinken, weil Staatsanleihen als sichere Anlagen gelten."}
 ],
 correct:"A",
 explain:"Beschafft sich der Staat Mittel am Kapitalmarkt, erhöht sich die Geldnachfrage. Dies übt Druck auf die Zinsen nach oben aus. Bei freiem Kapitalverkehr können steigende Zinsen eines grossen Landes auch andere Länder betreffen."},

{id:"g05", topic:"gefahren", type:"mc", diff:2, tax:"K2",
 q:"Was versteht man unter dem 'Schneeballeffekt' der Staatsverschuldung?",
 options:[
   {v:"A", t:"Steigende Schulden führen zu höherer Zinslast, die nur durch neue Schulden finanzierbar ist."},
   {v:"B", t:"Die Schulden schmelzen im Aufschwung wie Schnee in der Sonne."},
   {v:"C", t:"Kleine Steuererhöhungen lösen eine Lawine an Steuervermeidung aus."},
   {v:"D", t:"Schulden werden von Kanton zu Kanton weitergereicht."}
 ],
 correct:"A",
 explain:"Der Schneeballeffekt entsteht, wenn die Zinslast auf den Schulden selbst wieder mit neuen Schulden finanziert werden muss. Die Verschuldung beginnt ein Eigenleben zu führen und wird zum Teufelskreis. Besonders gefährlich ist dies, wenn die Schulden zusätzlich zu höheren Zinsen (Risikoprämien) führen."},

{id:"g06", topic:"gefahren", type:"sort", diff:2, tax:"K2",
 q:"Ordnen Sie die Auswirkungen dem jeweiligen Finanzierungsweg zu.",
 categories:["Finanzierung am Kapitalmarkt", "Finanzierung bei der Nationalbank (Monetisierung)"],
 items:[
   {t:"Zinsdruck nach oben", cat:0},
   {t:"Geldmenge wird ausgeweitet", cat:1},
   {t:"Crowding-out privater Investitionen", cat:0},
   {t:"Inflationsgefahr steigt", cat:1},
   {t:"Geldmenge bleibt unverändert", cat:0},
   {t:"Zinsen sinken kurzfristig", cat:1}
 ],
 explain:"Kapitalmarktfinanzierung: Zinsdruck, Crowding-out, keine Geldmengenausweitung. Monetisierung: Geldmengenausweitung, Inflationsgefahr, kurzfristig sinkende Zinsen (aber langfristig steigende)."},

{id:"g07", topic:"gefahren", type:"tf", diff:2, tax:"K2",
 q:"Für die Schweiz hat das Crowding-out-Argument grosse Relevanz.",
 correct:false,
 explain:"Falsch. Für die Schweiz hat das Crowding-out-Argument keine grosse Relevanz, weil der private Sektor einen chronischen Sparüberhang aufweist – es gibt also genügend Kapital am Markt. Anders ist die Lage z.B. in den USA."},

{id:"g08", topic:"gefahren", type:"mc", diff:3, tax:"K3",
 q:"Eine Studie der Ökonomen Rogoff und Reinhart ergab 2013 einen kritischen Schwellenwert für die Schuldenquote. Bei welchem Wert beginnen gemäss dieser Studie die negativen Wachstumseffekte zu dominieren?",
 options:[
   {v:"A", t:"90% des BIP"},
   {v:"B", t:"60% des BIP"},
   {v:"C", t:"120% des BIP"},
   {v:"D", t:"50% des BIP"}
 ],
 correct:"A",
 explain:"Die Studie 'Growth in Time of Debt' ergab einen Schwellenwert von 90% des BIP. Die Frage, ab welcher Schuldenquote die negativen Auswirkungen überwiegen, bleibt aber umstritten."},

{id:"g09", topic:"gefahren", type:"open", diff:3, tax:"K4",
 q:"Erklären Sie den Schneeballeffekt der Staatsverschuldung und weshalb er zu einem Teufelskreis führen kann.",
 sample:"Wenn ein Staat mehr ausgibt als er einnimmt, muss er die Differenz mit Schulden finanzieren. Auf diese Schulden fallen Zinsen an. Selbst bei einem ausgeglichenen Primärhaushalt (ohne Zinszahlungen) muss der Staat die Zinslast durch neue Schulden finanzieren. Mit steigenden Schulden steigen auch die Zinszahlungen, was wiederum neue Schulden erfordert. Der Effekt wird verstärkt, wenn steigende Schulden zu höheren Risikoprämien und damit höheren Zinssätzen führen.",
 explain:"Der Schneeballeffekt führt dazu, dass die Verschuldung ein Eigenleben entwickelt. Für Privatpersonen bedeutet dies Konkurs – für Staaten den faktischen Bankrott."},

{id:"g10", topic:"gefahren", type:"mc", diff:3, tax:"K3",
 q:"Was passiert, wenn ein Staat faktisch zahlungsunfähig wird?",
 options:[
   {v:"A", t:"Er verhandelt mit Gläubigern über Schuldenumstrukturierung oder -erlass, die Währung wird oft ruiniert."},
   {v:"B", t:"Die UNO übernimmt automatisch die Schulden."},
   {v:"C", t:"Der Staat wird aufgelöst und in Nachbarländer eingegliedert."},
   {v:"D", t:"Alle Bürger müssen ihre privaten Ersparnisse abgeben."}
 ],
 correct:"A",
 explain:"Bei einem Staatsbankrott werden Verhandlungen mit Gläubigern geführt, die zu Zahlungsaufschub oder einem Schuldenerlass ('Haircut') führen können. Die Währung verliert oft dramatisch an Wert und muss saniert werden. Der IWF begleitet häufig den Neuanfang mit strengen Auflagen."},

// ── RICHTLINIEN (r01–r10) ──
{id:"r01", topic:"richtlinien", type:"mc", diff:1, tax:"K1",
 q:"Was besagt die 'Goldene Finanzierungsregel'?",
 options:[
   {v:"A", t:"Budgetdefizite sollten die Höhe der Staatsinvestitionen nicht übersteigen."},
   {v:"B", t:"Die Staatsschulden sollten jedes Jahr um 1% sinken."},
   {v:"C", t:"Der Goldbestand der Nationalbank muss die Staatsschulden decken."},
   {v:"D", t:"Kantone und Bund müssen ihre Budgets genau hälftig teilen."}
 ],
 correct:"A",
 explain:"Die Goldene Finanzierungsregel besagt, dass Kredite nur für investive Zwecke (z.B. Infrastruktur) aufgenommen werden sollten, weil diese zu Wachstum und höheren Steuereinnahmen führen. Konsumausgaben (z.B. Sozial-, Personalausgaben) sollten nicht auf Pump finanziert werden."},

{id:"r02", topic:"richtlinien", type:"fill", diff:1, tax:"K1",
 q:"Die Schweizer {0} ist in der Verfassung verankert. Sie besagt, dass über einen gesamten {1} die Staatseinnahmen und Staatsausgaben ausgeglichen sein müssen.",
 blanks:[
   {answer:"Schuldenbremse", alts:[]},
   {answer:"Konjunkturzyklus", alts:["Konjunkturzyklus hinweg"]}
 ],
 explain:"Die Schuldenbremse wurde 2003 in der Schweiz eingeführt. In Rezessionen sind Defizite erlaubt (sogar erwünscht), aber im Aufschwung müssen Überschüsse erzielt werden. Über den ganzen Zyklus muss der Haushalt ausgeglichen sein."},

{id:"r03", topic:"richtlinien", type:"tf", diff:1, tax:"K1",
 q:"Gemäss der Schuldenbremse sind Staatsdefizite in einer Rezession erlaubt.",
 correct:true,
 explain:"Korrekt. Die Schuldenbremse verbietet Defizite nicht generell, sondern verlangt einen Ausgleich über den gesamten Konjunkturzyklus. In einer Rezession sind Defizite sogar erwünscht, weil sie als Stabilisatoren wirken."},

{id:"r04", topic:"richtlinien", type:"mc", diff:2, tax:"K2",
 q:"Was ist ein 'ausgeglichener Primärhaushalt'?",
 options:[
   {v:"A", t:"Ein Haushalt, bei dem Einnahmen und Ausgaben ohne Berücksichtigung der Zinszahlungen ausgeglichen sind."},
   {v:"B", t:"Ein Haushalt, bei dem alle Schulden getilgt sind."},
   {v:"C", t:"Ein Haushalt, bei dem die Einnahmen die Ausgaben inklusive Zinsen übersteigen."},
   {v:"D", t:"Ein Haushalt, bei dem nur die primären Steuern erhoben werden."}
 ],
 correct:"A",
 explain:"Der Primärhaushalt = Haushaltssaldo ohne Zinszahlungen. Ein ausgeglichener Primärhaushalt bedeutet, dass die laufenden Einnahmen die laufenden Ausgaben (ohne Zinsen) decken. Bei einem stabilen Zinssatz und positivem Wirtschaftswachstum bleibt die Schuldenquote dann stabil."},

{id:"r05", topic:"richtlinien", type:"tf", diff:2, tax:"K2",
 q:"Die dritte Richtlinie für die Staatsverschuldung besagt, dass die Ausgaben im Gleichschritt mit dem Wirtschaftswachstum zunehmen sollten. Die Schweiz hält diese Regel ein.",
 correct:false,
 explain:"Falsch. Auch die Schweiz hält diese Regel nicht ein – die Staatsausgaben sind in den letzten Jahrzehnten schneller angestiegen als das Wirtschaftswachstum (Wagners Gesetz)."},

{id:"r06", topic:"richtlinien", type:"sort", diff:2, tax:"K2",
 q:"Ordnen Sie zu: Welche Formen der Verschuldung sind gerechtfertigt und welche problematisch?",
 categories:["Gerechtfertigt", "Problematisch"],
 items:[
   {t:"Kredite für Infrastrukturinvestitionen", cat:0},
   {t:"Schulden zur Finanzierung von Konsumausgaben", cat:1},
   {t:"Defizite zur Konjunkturstabilisierung in der Rezession", cat:0},
   {t:"Dauerhaft über die Verhältnisse leben", cat:1},
   {t:"Kredite für Bildungsinvestitionen", cat:0},
   {t:"Schulden zur Finanzierung laufender Personalausgaben", cat:1}
 ],
 explain:"Investive Schulden und temporäre Konjunkturdefizite sind gerechtfertigt, weil sie zu zukünftigem Wachstum oder Stabilisierung beitragen. Schulden für Konsumausgaben sind problematisch, weil sie keine zukünftigen Erträge generieren."},

{id:"r07", topic:"richtlinien", type:"mc", diff:2, tax:"K2",
 q:"Seit der Einführung der Schuldenbremse im Jahr 2003 hat die Schweiz Schulden in welcher Höhe abgebaut?",
 options:[
   {v:"A", t:"Fast 27 Mrd. Fr."},
   {v:"B", t:"Fast 10 Mrd. Fr."},
   {v:"C", t:"Fast 50 Mrd. Fr."},
   {v:"D", t:"Es wurden keine Schulden abgebaut."}
 ],
 correct:"A",
 explain:"Gemäss Christoph Schaltegger wurden seit 2003 fast 27 Mrd. Fr. an Schulden abgebaut. Diese Resilienz ermöglichte es der Schweiz, in der Coronakrise schnell und umfangreich Fiskalimpulse zu setzen."},

{id:"r08", topic:"richtlinien", type:"open", diff:3, tax:"K5",
 q:"'Die Schulden von heute sind die Steuern von morgen.' Beurteilen Sie diese Aussage von Christoph Schaltegger im Zusammenhang mit der Generationengerechtigkeit.",
 sample:"Die Aussage bedeutet, dass heutige Kreditfinanzierung die Zahllast auf zukünftige Generationen verschiebt. Diese müssen die Schulden über Steuererhöhungen oder Ausgabenkürzungen abtragen – obwohl sie an den ursprünglichen Ausgabeentscheiden nicht beteiligt waren. Das ist ein Problem der Generationengerechtigkeit: Die heutige Generation profitiert von den Ausgaben, die nächste Generation trägt die Kosten. Die Schuldenbremse soll genau dies verhindern, indem sie langfristig ausgeglichene Haushalte erzwingt.",
 explain:"Generationengerechtigkeit ist ein zentrales Argument für eine verantwortungsvolle Haushaltspolitik. Die Schweizer Schuldenbremse wird als Instrument gesehen, das langfristige Rationalität erzwingt."},

{id:"r09", topic:"richtlinien", type:"mc", diff:3, tax:"K3",
 q:"Welche drei Optionen stehen einem Staat grundsätzlich zur Verfügung, um eine hohe Staatsverschuldung abzubauen?",
 options:[
   {v:"A", t:"Haushaltsdisziplin (Ausgabenkürzungen/Steuererhöhungen), Inflation und Wirtschaftswachstum."},
   {v:"B", t:"Schulden ignorieren, neue Schulden aufnehmen und Währung abwerten."},
   {v:"C", t:"Goldreserven verkaufen, Steuern abschaffen und Subventionen streichen."},
   {v:"D", t:"IWF-Beitritt, EU-Hilfe und Schuldenerlass."}
 ],
 correct:"A",
 explain:"Die drei Hauptoptionen sind: 1) Haushaltsdisziplin (weniger ausgeben oder mehr einnehmen), 2) Inflation (realer Wert der Schulden sinkt), 3) Wirtschaftswachstum (BIP wächst, Schuldenquote sinkt). Alle drei Optionen haben Vor- und Nachteile."},

{id:"r10", topic:"richtlinien", type:"open", diff:3, tax:"K5",
 q:"Beurteilen Sie die Debatte 'Sparen vs. Wachstum' in der europäischen Schuldenkrise: Warum ist es weder ein reines 'Entweder-oder', sondern ein 'Sowohl-als-auch'?",
 sample:"Nur Sparen (Austerität) bremst kurzfristig die Konjunktur und kann die Krise verschärfen. Nur Wachstumsprogramme ohne Konsolidierung führen zu weiterer Verschuldung. Die Lösung liegt in einer Kombination: Einerseits muss der Haushalt konsolidiert werden (weniger Konsum-, mehr Investitionsausgaben). Andererseits müssen langfristige Wachstumsimpulse gesetzt werden – vor allem durch bessere Rahmenbedingungen für Unternehmen (Liberalisierungen, Strukturreformen, Bildungspolitik). Wachstum dank Investitionen ist primär Sache der Unternehmen, nicht des Staates.",
 explain:"Die historische Erfahrung zeigt: Weder reine Sparpolitik noch reine Schuldenfinanzierung führen aus der Krise. Strukturreformen und verbesserte Rahmenbedingungen sind der Schlüssel."},

// ── ZUSÄTZLICHE QUERSCHNITTSFRAGEN ──
{id:"q01", topic:"gefahren", type:"fill", diff:2, tax:"K2",
 q:"Der Fachbegriff für den Aufkauf von Staatsanleihen durch die eigene Zentralbank lautet {0} der Staatsschuld.",
 blanks:[
   {answer:"Monetisierung", alts:[]}
 ],
 explain:"Bei der Monetisierung kauft die Zentralbank Staatsanleihen auf. Dies ist prinzipiell nicht unüblich, wird aber schädlich, wenn eine zu lockere Geldpolitik mit inflationären Folgen betrieben wird."},

{id:"q02", topic:"international", type:"fill", diff:2, tax:"K1",
 q:"Die {0} Staatsverschuldung umfasst die aktuell bestehenden Verpflichtungen. Die {1} Staatsverschuldung berücksichtigt zusätzlich zukünftige, nicht gedeckte Verpflichtungen wie Rentenansprüche.",
 blanks:[
   {answer:"explizite", alts:[]},
   {answer:"implizite", alts:[]}
 ],
 explain:"Die implizite Verschuldung beträgt oft ein Vielfaches der expliziten. Für die Schweiz ergibt sich z.B. allein in der AHV bis 2030 ein geschätzter Fehlbetrag von 5 bis 11 Mrd. Fr."},

{id:"q03", topic:"richtlinien", type:"tf", diff:2, tax:"K2",
 q:"Direkte Demokratien wie die Schweiz tendieren gemäss ökonomischer Analyse eher zu langfristiger Rationalität in der Finanzpolitik.",
 correct:true,
 explain:"Korrekt. Die Einführung der Schuldenbremse per Volksabstimmung zeigt, dass direkte Demokratien langfristige Interessen besser berücksichtigen können. Die Bürger haben erkannt, dass kurzfristiges Schulden-Machen langfristige Kosten verursacht."},

{id:"q04", topic:"gefahren", type:"mc", diff:3, tax:"K3",
 q:"Warum haben die Notenbanken nach der Finanzkrise 2008 und der Coronakrise 2020 massiv Staatsanleihen aufgekauft?",
 options:[
   {v:"A", t:"Um die Zinsen der hochverschuldeten Staaten zu senken und die Wirtschaft zu stützen."},
   {v:"B", t:"Um die Staatsschulden endgültig zu tilgen."},
   {v:"C", t:"Um die Inflation absichtlich zu erhöhen."},
   {v:"D", t:"Um die Geldmenge dauerhaft zu reduzieren."}
 ],
 correct:"A",
 explain:"Die Zentralbanken (EZB, FED) kauften Staatsanleihen, um die Zinsen zu senken und die Finanzierungskosten der Staaten tragbar zu halten. Man erhoffte sich, dass die Staaten die Entlastung für den Schuldenabbau nutzen – was aber grösstenteils nicht geschah."},

{id:"q05", topic:"einnahmen", type:"mc", diff:2, tax:"K2",
 q:"Was versteht man unter dem Finanzausgleich?",
 options:[
   {v:"A", t:"Ein System, das finanzielle Unterschiede zwischen finanzstarken und finanzschwachen Kantonen ausgleicht."},
   {v:"B", t:"Den jährlichen Ausgleich zwischen Einnahmen und Ausgaben des Bundes."},
   {v:"C", t:"Die Angleichung der Steuersätze aller Kantone."},
   {v:"D", t:"Die Verteilung der SNB-Gewinne an die Kantone."}
 ],
 correct:"A",
 explain:"Der Finanzausgleich sorgt dafür, dass auch finanzschwache Kantone ihre Aufgaben erfüllen können. Finanzstarke Kantone zahlen in den Ausgleich ein, finanzschwache erhalten Beiträge."}
];
