// Übungspool: Sozialpolitik und Sozialversicherungen
// Fachbereich: VWL
// Stufe: SF GYM3
// Anzahl Fragen: 50

window.POOL_META = {
  id: "vwl_sozialpolitik",
  fach: "VWL",
  title: "Übungspool: Sozialpolitik und Sozialversicherungen",
  meta: "SF GYM3 · Gymnasium Hofwil · Individuell üben",
  color: "vwl"
};

window.TOPICS = {
  verteilung: {label:"Einkommensverteilung & Umverteilung", short:"Verteilung"},
  gerechtigkeit: {label:"Gerechtigkeitstheorien", short:"Gerechtigkeit"},
  sozialversicherungen: {label:"Sozialversicherungssystem Schweiz", short:"Sozialvers."},
  finanzierung: {label:"Finanzierung der Sozialversicherungen", short:"Finanzierung"},
  versicherung: {label:"Versicherungsprinzipien & -theorie", short:"Versicherung"},
  staatseingriffe: {label:"Staatseingriffe & Staatsversagen", short:"Staatseingriffe"},
  herausforderungen: {label:"Herausforderungen & Reformen", short:"Reformen"}
};

window.QUESTIONS = [
// ── VERTEILUNG (v01–v08) ──
{id:"v01", topic:"verteilung", type:"mc", diff:1, tax:"K1",
 q:"Was zeigt die Lorenzkurve?",
 options:[
   {v:"A", t:"Die personelle Einkommensverteilung zu einem bestimmten Zeitpunkt."},
   {v:"B", t:"Die Entwicklung des BIP über die Zeit."},
   {v:"C", t:"Die Verteilung der Staatsausgaben auf verschiedene Bereiche."},
   {v:"D", t:"Den Zusammenhang zwischen Inflation und Arbeitslosigkeit."}
 ],
 correct:"A",
 explain:"Die Lorenzkurve stellt die personelle Einkommensverteilung grafisch dar. Je «bauchiger» die Kurve, desto ungleicher ist das Einkommen verteilt."},

{id:"v02", topic:"verteilung", type:"tf", diff:1, tax:"K1",
 q:"Ein Gini-Koeffizient von 0 bedeutet, dass alle Einkommen vollständig gleich verteilt sind (Einheitslohn).",
 correct:true,
 explain:"Korrekt. Bei einem Gini-Koeffizienten von 0 herrscht vollständige Gleichverteilung. Bei einem Wert von 1 würde eine einzige Person alles verdienen."},

{id:"v03", topic:"verteilung", type:"mc", diff:2, tax:"K2",
 q:"Worin liegt der Hauptgrund für die Lohnunterschiede zwischen verschiedenen Branchen?",
 options:[
   {v:"A", t:"Unterschiedliche gesetzliche Mindestlöhne pro Branche."},
   {v:"B", t:"Die grossen Differenzen bei der Arbeitsproduktivität zwischen den Branchen."},
   {v:"C", t:"Unterschiedliche Arbeitszeiten in den verschiedenen Branchen."},
   {v:"D", t:"Die Anzahl der Beschäftigten pro Branche."}
 ],
 correct:"B",
 explain:"Der Hauptgrund für Lohnunterschiede zwischen Branchen sind die grossen Differenzen bei der Produktivität (Wertschöpfung pro Vollzeitstelle). Je grösser die Wertschöpfung pro Arbeitsplatz, desto höhere Löhne können bezahlt werden."},

{id:"v04", topic:"verteilung", type:"fill", diff:1, tax:"K1",
 q:"Die Einkommensverteilung vor staatlichen Eingriffen (Steuern, Sozialversicherungen) heisst {0} Einkommensverteilung. Die Verteilung nach staatlichen Eingriffen heisst {1} Einkommensverteilung.",
 blanks:[
   {answer:"primäre", alts:["primaere"]},
   {answer:"sekundäre", alts:["sekundaere"]}
 ],
 explain:"Die primäre Einkommensverteilung entsteht durch den Markt (v.a. bestimmt durch die Produktivität). Durch Steuern und Sozialversicherungen entsteht die sekundäre Einkommensverteilung, die gleichmässiger ist als die primäre."},

{id:"v05", topic:"verteilung", type:"mc", diff:2, tax:"K2",
 q:"Die Schweiz hat vor Steuern und Sozialabgaben einen Gini-Koeffizienten von 0.38, nach Steuern und Sozialabgaben von 0.29. Was lässt sich daraus schliessen?",
 options:[
   {v:"A", t:"Die staatliche Umverteilung vergrössert die Einkommensunterschiede."},
   {v:"B", t:"Die staatliche Umverteilung reduziert die Einkommensunterschiede deutlich."},
   {v:"C", t:"Die Schweiz hat die höchste Ungleichheit in Europa."},
   {v:"D", t:"Die primäre Verteilung ist bereits vollständig gleich."}
 ],
 correct:"B",
 explain:"Ein Rückgang des Gini-Koeffizienten von 0.38 auf 0.29 zeigt, dass Steuern und Sozialversicherungen die Einkommensunterschiede deutlich reduzieren. Die sekundäre Verteilung ist gleichmässiger als die primäre."},

{id:"v06", topic:"verteilung", type:"sort", diff:2, tax:"K2",
 q:"Ordnen Sie die folgenden Konzepte dem passenden Gerechtigkeitsprinzip zu.",
 categories:["Leistungsgerechtigkeit", "Bedarfsgerechtigkeit"],
 items:[
   {t:"Verteilung nach Produktivität", cat:0},
   {t:"Anrecht auf Existenzminimum unabhängig von Leistung", cat:1},
   {t:"Wer mehr leistet, soll mehr verdienen", cat:0},
   {t:"Jeder Mensch hat Anrecht auf angemessenes Einkommen", cat:1},
   {t:"Marktlöhne als gerechte Entlohnung", cat:0},
   {t:"Staatlich finanzierte Grundsicherung", cat:1}
 ],
 explain:"Leistungsgerechtigkeit stuft eine Verteilung nach Produktivität als gerecht ein. Bedarfsgerechtigkeit gewährt jedem Menschen unabhängig von seiner Leistungsfähigkeit ein angemessenes Einkommen. Beide Prinzipien widerspiegeln den Zielkonflikt zwischen Effizienz und Verteilungsgerechtigkeit."},

{id:"v07", topic:"verteilung", type:"sort", diff:1, tax:"K2",
 q:"Ordnen Sie die folgenden sozialpolitischen Instrumente der richtigen Kategorie zu.",
 categories:["Einnahmenseite (Staat nimmt)", "Ausgabenseite (Staat gibt)"],
 items:[
   {t:"Progressive Einkommenssteuer", cat:0},
   {t:"Sozialversicherungsleistungen (z.B. AHV-Rente)", cat:1},
   {t:"Lohnprozente (Arbeitnehmer- und Arbeitgeberbeiträge)", cat:0},
   {t:"Prämienverbilligungen Krankenkasse", cat:1},
   {t:"Subventionen für Kinderkrippen", cat:1},
   {t:"Mehrwertsteuer", cat:0}
 ],
 explain:"Die Umverteilung erfolgt über die Einnahmenseite (progressive Steuern, Lohnbeiträge) und die Ausgabenseite (Sozialversicherungsleistungen, Subventionen, Prämienverbilligungen). Beide Seiten zusammen bewirken eine gleichmässigere sekundäre Einkommensverteilung."},

{id:"v08", topic:"verteilung", type:"open", diff:3, tax:"K5",
 q:"Die Schweiz hat im internationalen Vergleich bereits vor staatlichen Eingriffen eine relativ gleichmässige primäre Einkommensverteilung (Gini 0.38 vs. OECD-Durchschnitt 0.44). Beurteilen Sie, ob dies ein Argument für oder gegen einen Ausbau der staatlichen Umverteilung ist.",
 sample:"Man kann argumentieren, dass eine bereits relativ gleichmässige Primärverteilung weniger Umverteilung nötig macht (Effizienzargument). Gleichzeitig bleibt die Differenz von 0.38 auf 0.29 nach Umverteilung erheblich, was zeigt, dass Eingriffe weiterhin Wirkung zeigen. Es kommt auf die zugrundeliegende Gerechtigkeitsvorstellung an: Aus liberaler Sicht reicht die Primärverteilung, aus sozialliberaler oder sozialistischer Sicht bleibt Handlungsbedarf.",
 explain:"Die Antwort hängt von der Gerechtigkeitsvorstellung ab. Die relativ gleichmässige Primärverteilung der Schweiz ist teilweise auf die geringen Produktivitätsunterschiede zurückzuführen. Der Zielkonflikt zwischen Effizienz und Verteilungsgerechtigkeit bleibt bestehen."},

// ── GERECHTIGKEITSTHEORIEN (g01–g08) ──
{id:"g01", topic:"gerechtigkeit", type:"mc", diff:1, tax:"K1",
 q:"Welche Wirtschaftsordnung vertreten die Libertarians (Neo-Liberale)?",
 options:[
   {v:"A", t:"Soziale Marktwirtschaft"},
   {v:"B", t:"Reine Marktwirtschaft"},
   {v:"C", t:"Sozialismus"},
   {v:"D", t:"Planwirtschaft"}
 ],
 correct:"B",
 explain:"Libertarians (Neo-Liberale) wie Nozick, Hayek und Friedman befürworten eine reine Marktwirtschaft. Sie lehnen Umverteilung ab, da sie die ökonomische Freiheit einschränkt. Der Markt und sein Ergebnis können ihrer Meinung nach nicht gerecht oder ungerecht sein."},

{id:"g02", topic:"gerechtigkeit", type:"tf", diff:1, tax:"K1",
 q:"Gemäss dem naturrechtlichen Liberalismus (Nozick) ist Besteuerung eine Form von Diebstahl.",
 correct:true,
 explain:"Korrekt. Nozick vertritt die Position, dass jedes Individuum das natürliche Recht hat, sich die durch seine Arbeit erworbenen Erträge anzueignen. Die Hauptaufgabe des Staates beschränkt sich auf den Schutz der Eigentumsrechte. Besteuerung wird als Eingriff in dieses Recht betrachtet."},

{id:"g03", topic:"gerechtigkeit", type:"sort", diff:2, tax:"K2",
 q:"Ordnen Sie die folgenden Positionen der richtigen Gerechtigkeitstheorie zu.",
 categories:["Libertarians (Neo-Liberale)", "Liberals (Sozial-Liberale)", "Collectivists (Sozialisten)"],
 items:[
   {t:"Umverteilung ist eine Einschränkung der Freiheit", cat:0},
   {t:"Differenzprinzip: Nutzen des Schwächsten maximieren", cat:1},
   {t:"Verstaatlichung der Produktionsmittel", cat:2},
   {t:"Kombination von Kapitalismus und Staatseingriffen", cat:1},
   {t:"Mehrwert = Ausbeutung der Arbeiterschaft", cat:2},
   {t:"Staatseingriffe reduzieren die Wohlfahrt", cat:0}
 ],
 explain:"Libertarians lehnen Umverteilung und Staatseingriffe ab. Liberals (z.B. Rawls) befürworten eine Kombination von Markt und Staat, wobei der Schwächste bessergestellt werden soll (Differenzprinzip). Collectivists (insbesondere Marxisten) fordern die Verstaatlichung der Produktionsmittel und sehen im Kapitalismus Ausbeutung."},

{id:"g04", topic:"gerechtigkeit", type:"mc", diff:2, tax:"K2",
 q:"Was besagt das Differenzprinzip von John Rawls?",
 options:[
   {v:"A", t:"Alle Menschen sollen exakt gleich viel verdienen."},
   {v:"B", t:"Ungleichheiten sind nur dann gerechtfertigt, wenn sie dem am schlechtesten Gestellten nützen."},
   {v:"C", t:"Der Staat soll sich aus der Wirtschaft vollständig heraushalten."},
   {v:"D", t:"Die Produktionsmittel sollen verstaatlicht werden."}
 ],
 correct:"B",
 explain:"Rawls' Differenzprinzip (Maxmin-Regel) besagt, dass der Nutzen des am schlechtesten gestellten Individuums maximiert werden soll. Ungleichheiten sind akzeptabel, wenn sie auch den Schwächsten besser stellen als eine Gleichverteilung."},

{id:"g05", topic:"gerechtigkeit", type:"fill", diff:2, tax:"K2",
 q:"Rawls' Gedankenexperiment heisst «Schleier des {0}». Dabei wählen Menschen eine Gesellschaftsordnung, ohne zu wissen, welche {1} sie in dieser Gesellschaft einnehmen werden.",
 blanks:[
   {answer:"Nichtwissens", alts:["Unwissens","Unwissenheit"]},
   {answer:"Stellung", alts:["Position","Rolle"]}
 ],
 explain:"Hinter dem Schleier des Nichtwissens kennen die Menschen weder ihr Geschlecht, ihre Gesundheit, ihren Reichtum, ihre Intelligenz noch ihren sozialen Status. Rawls argumentiert, dass Menschen unter diesen Bedingungen eine Gesellschaftsordnung mit Freiheitsprinzip, Differenzprinzip und Chancengleichheit wählen würden."},

{id:"g06", topic:"gerechtigkeit", type:"tf", diff:2, tax:"K2",
 q:"Der Utilitarismus strebt eine Gleichverteilung aller Güter an.",
 correct:false,
 explain:"Falsch. Der Utilitarismus strebt nicht Gleichverteilung an, sondern die Maximierung der gesellschaftlichen Wohlfahrt (Nutzensumme). Dies berücksichtigt sowohl Effizienz als auch Gerechtigkeit, ist aber nicht gleichbedeutend mit Gleichverteilung. Die optimale Verteilung ergibt sich dort, wo die Grenznutzen aller Individuen gleich sind."},

{id:"g07", topic:"gerechtigkeit", type:"open", diff:3, tax:"K4",
 q:"Erklären Sie den Unterschied zwischen erzwungener und freiwilliger Umverteilung. Warum reicht freiwillige Umverteilung gemäss ökonomischer Theorie nicht aus?",
 sample:"Erzwungene Umverteilung geschieht über Steuern und Sozialversicherungen durch den Staat. Freiwillige Umverteilung beruht darauf, dass der Nutzen der Reichen auch vom Einkommen der Armen abhängt (Spenden, Philanthropie). Freiwillige Umverteilung reicht nicht aus, weil die Einkommensunterstützung der Armen Eigenschaften eines öffentlichen Gutes hat: Es kommt zu Trittbrettfahrerverhalten – jeder Reiche hofft, dass andere spenden. Deshalb bleibt das Niveau der Einkommensunterstützung unter dem gesellschaftlichen Optimum.",
 explain:"Das Trittbrettfahrerproblem bei freiwilliger Umverteilung ist ein klassisches ökonomisches Argument für staatliche Umverteilung: Weil die Verringerung von Armut ein öffentliches Gut ist, investieren Individuen freiwillig weniger als das gesellschaftliche Optimum."},

{id:"g08", topic:"gerechtigkeit", type:"mc", diff:3, tax:"K4",
 q:"Welche Aussage beschreibt am besten die Haltung der Marxisten gegenüber Sozialpolitik?",
 options:[
   {v:"A", t:"Sozialpolitik ist immer positiv, da sie die Arbeiterschaft unterstützt."},
   {v:"B", t:"Sozialpolitik ist überflüssig, weil der Markt alles regelt."},
   {v:"C", t:"Marxisten sind ambivalent: Sozialpolitik kann als Sieg der Arbeiterschaft oder als Schutz des Kapitalismus interpretiert werden."},
   {v:"D", t:"Marxisten lehnen jede Form von Sozialpolitik kategorisch ab."}
 ],
 correct:"C",
 explain:"Marxisten sind tatsächlich ambivalent gegenüber Sozialpolitik. Einerseits kann sie als Errungenschaft der Arbeiterschaft gesehen werden. Andererseits könnte Sozialpolitik den Kapitalismus stabilisieren und damit die Revolution verhindern – sie wirkt dann systemerhaltend."},

// ── SOZIALVERSICHERUNGSSYSTEM (s01–s08) ──
{id:"s01", topic:"sozialversicherungen", type:"mc", diff:1, tax:"K1",
 q:"Wie viele Hauptzweige umfasst das Schweizer Sozialversicherungssystem?",
 options:[
   {v:"A", t:"5 Zweige"},
   {v:"B", t:"6 Zweige"},
   {v:"C", t:"8 Zweige"},
   {v:"D", t:"10 Zweige"}
 ],
 correct:"C",
 explain:"Das Schweizer Sozialversicherungssystem umfasst 8 Hauptzweige: AHV (inkl. EL), IV, Berufliche Vorsorge (BV), EO/Mutterschaft, Unfallversicherung, Krankenversicherung, Arbeitslosenversicherung und Familienzulagen."},

{id:"s02", topic:"sozialversicherungen", type:"sort", diff:1, tax:"K1",
 q:"Ordnen Sie die Sozialversicherungen der richtigen Säule der Altersvorsorge zu.",
 categories:["1. Säule (AHV)", "2. Säule (BV)", "3. Säule (Individuelle Vorsorge)"],
 items:[
   {t:"Deckung des Existenzbedarfs im Alter", cat:0},
   {t:"Fortführung der gewohnten Lebenshaltung", cat:1},
   {t:"Deckung des Komfortbedarfs im Alter", cat:2},
   {t:"Obligatorisch seit 1948", cat:0},
   {t:"Obligatorisch seit 1985", cat:1},
   {t:"Steuerlich begünstigt, aber freiwillig", cat:2}
 ],
 explain:"Die 1. Säule (AHV) sichert das Existenzminimum, die 2. Säule (Berufliche Vorsorge) ermöglicht die Fortführung der gewohnten Lebenshaltung, und die 3. Säule (individuelle Vorsorge) dient dem Komfortbedarf. Zusammen bilden sie das Drei-Säulen-System der Schweizer Altersvorsorge."},

{id:"s03", topic:"sozialversicherungen", type:"tf", diff:1, tax:"K1",
 q:"Die Krankenversicherung (Grundversicherung) bietet für alle Versicherten pro Kasse und Region die gleichen Prämien für Erwachsene.",
 correct:true,
 explain:"Korrekt. Nach dem KVG muss jede Kasse in der Grundversicherung dasselbe Leistungsangebot führen. Die Prämien sind für alle Erwachsenen pro Kasse und Region gleich hoch (Kopfprämie). Personen in bescheidenen wirtschaftlichen Verhältnissen erhalten Prämienverbilligungen von den Kantonen."},

{id:"s04", topic:"sozialversicherungen", type:"fill", diff:1, tax:"K1",
 q:"Die AHV wurde im Jahr {0} eingeführt und gehört zur {1}. Säule der Altersvorsorge. Ihr Zweck ist die Deckung des {2} der nicht mehr im Berufsleben stehenden Personen.",
 blanks:[
   {answer:"1948", alts:[]},
   {answer:"1", alts:["ersten","erste","1."]},
   {answer:"Existenzbedarfs", alts:["Existenzminimums"]}
 ],
 explain:"Die AHV (Alters- und Hinterlassenenversicherung) wurde 1948 eingeführt. Als 1. Säule soll sie den Existenzbedarf der Rentnerinnen und Rentner, Witwen, Witwer und Waisen decken."},

{id:"s05", topic:"sozialversicherungen", type:"mc", diff:2, tax:"K2",
 q:"Worin unterscheiden sich Sozialversicherungen von privaten Versicherungen?",
 options:[
   {v:"A", t:"Sozialversicherungen sind freiwillig, private Versicherungen obligatorisch."},
   {v:"B", t:"Bei Sozialversicherungen zahlen Ärmere kleinere Beiträge, und sie sind obligatorisch."},
   {v:"C", t:"Private Versicherungen bieten bessere Leistungen als Sozialversicherungen."},
   {v:"D", t:"Sozialversicherungen decken nur Risiken ab, private Versicherungen auch Sparen."}
 ],
 correct:"B",
 explain:"Im Unterschied zu privaten Versicherungen sind Sozialversicherungen erstens obligatorisch und zweitens zahlen Ärmere kleinere Beiträge als Reichere (Solidaritätsprinzip). Auch Personen, die sich keine Prämien leisten können, sind versichert."},

{id:"s06", topic:"sozialversicherungen", type:"tf", diff:2, tax:"K2",
 q:"Die Berufliche Vorsorge (2. Säule), die AHV und die Krankenversicherung vereinigen zusammen rund 80% der Sozialversicherungseinnahmen auf sich.",
 correct:true,
 explain:"Korrekt. Gemäss den Daten von 2017 entfallen auf die BV 39%, die AHV (inkl. EL) 25% und die Krankenversicherung 17% der Einnahmen – zusammen also rund 81%. Sie sind damit die mit Abstand wichtigsten Zweige des sozialen Sicherungssystems."},

{id:"s07", topic:"sozialversicherungen", type:"sort", diff:2, tax:"K2",
 q:"Ordnen Sie die folgenden Risikogruppen der passenden Sozialversicherung zu.",
 categories:["ALV", "IV", "UV", "KV"],
 items:[
   {t:"Stellenlose Erwerbstätige", cat:0},
   {t:"Personen mit dauerhafter Beeinträchtigung", cat:1},
   {t:"Bei Betriebsunfall Verunglückte", cat:2},
   {t:"Erkrankte Personen (ambulante Behandlung)", cat:3}
 ],
 explain:"Die ALV schützt gegen Verdienstausfall bei Arbeitslosigkeit, die IV unterstützt invalide Personen, die UV deckt Betriebs- und Nichtbetriebsunfälle ab, und die KV übernimmt Kosten bei Krankheit."},

{id:"s08", topic:"sozialversicherungen", type:"open", diff:2, tax:"K2",
 q:"Erklären Sie den Unterschied zwischen den drei Armutskonzepten: absolute, relative und subjektive Armut.",
 sample:"Absolute Armut: Das Einkommen oder Vermögen reicht nicht, um sich mit dem Lebensnotwendigen zu versorgen (Existenzminimum). Relative Armut: Man ist arm im Vergleich zum allgemeinen Lebensstandard, z.B. weniger als die Hälfte des Durchschnittseinkommens. Subjektive Armut: Das persönliche Empfinden, arm zu sein – jemand mit unterdurchschnittlichem Einkommen kann sich nicht arm fühlen, während jemand mit überdurchschnittlichem Einkommen sich arm fühlen kann.",
 explain:"Welches Armutskonzept als relevant angesehen wird, hat direkte Auswirkungen darauf, wie weit die staatliche Umverteilung gehen soll. In der Schweiz garantiert die Bundesverfassung die wirtschaftliche Existenzsicherung (Schutz vor absoluter Armut)."},

// ── FINANZIERUNG (f01–f07) ──
{id:"f01", topic:"finanzierung", type:"mc", diff:1, tax:"K1",
 q:"Wie wird die AHV (1. Säule) finanziert?",
 options:[
   {v:"A", t:"Im Kapitaldeckungsverfahren: Individuelle Beiträge werden angespart und verzinst."},
   {v:"B", t:"Im Umlageverfahren: Laufende Einnahmen werden für laufende Ausgaben verwendet."},
   {v:"C", t:"Ausschliesslich über die Mehrwertsteuer."},
   {v:"D", t:"Durch freiwillige Spenden der Bevölkerung."}
 ],
 correct:"B",
 explain:"Die AHV wird im Umlageverfahren finanziert: Die aktuellen Beiträge der Erwerbstätigen (Lohnprozente, je hälftig Arbeitgeber/Arbeitnehmer) werden direkt für die laufenden Renten verwendet. Die heutigen Erwerbstätigen finanzieren die heutigen Rentner (Generationenvertrag)."},

{id:"f02", topic:"finanzierung", type:"tf", diff:1, tax:"K1",
 q:"Bei der Beruflichen Vorsorge (2. Säule) werden individuelle Beiträge auf einem persönlichen Konto angespart und verzinst (Kapitaldeckungsverfahren).",
 correct:true,
 explain:"Korrekt. Im Gegensatz zur AHV funktioniert die 2. Säule nach dem Kapitaldeckungsverfahren: Arbeitgeber und Arbeitnehmer zahlen je hälftig Beiträge ein, die auf einem individuellen Konto angespart und mit Zins für die spätere Pension verwendet werden."},

{id:"f03", topic:"finanzierung", type:"sort", diff:2, tax:"K2",
 q:"Ordnen Sie die Merkmale dem richtigen Finanzierungsverfahren zu.",
 categories:["Umlageverfahren", "Kapitaldeckungsverfahren"],
 items:[
   {t:"Generationenvertrag: Junge finanzieren Alte", cat:0},
   {t:"Individuelles Sparkonto mit Zins", cat:1},
   {t:"Stark abhängig von der demografischen Entwicklung", cat:0},
   {t:"Stark abhängig von der Entwicklung der Finanzmärkte", cat:1},
   {t:"AHV als Beispiel", cat:0},
   {t:"Pensionskasse als Beispiel", cat:1}
 ],
 explain:"Das Umlageverfahren (AHV) ist ein Generationenvertrag und daher stark von der Demografie abhängig. Das Kapitaldeckungsverfahren (BV/Pensionskasse) basiert auf individuellem Ansparen und ist daher von den Finanzmärkten abhängig. Beide Verfahren haben unterschiedliche Stärken und Schwächen."},

{id:"f04", topic:"finanzierung", type:"fill", diff:1, tax:"K1",
 q:"Die {0} misst die Sozialversicherungseinnahmen in Prozent des BIP. Die {1} misst die Sozialversicherungsleistungen in Prozent des BIP.",
 blanks:[
   {answer:"Soziallastquote", alts:[]},
   {answer:"Sozialleistungsquote", alts:[]}
 ],
 explain:"Die Soziallastquote zeigt, wie stark die Volkswirtschaft durch Sozialversicherungseinnahmen belastet wird. Die Sozialleistungsquote zeigt, welcher Teil der Wirtschaftsleistung durch Empfänger von Sozialleistungen beansprucht wird. Beide Quoten sind seit 1960 stark gestiegen."},

{id:"f05", topic:"finanzierung", type:"calc", diff:2, tax:"K3",
 q:"Die Sozialversicherungseinnahmen der Schweiz betrugen 2017 rund 182 Mrd. CHF. Das BIP lag bei ca. 670 Mrd. CHF. Berechnen Sie:",
 rows:[
   {label:"Soziallastquote (in %)", answer:27.2, tolerance:0.5, unit:"%"}
 ],
 explain:"Soziallastquote = Sozialversicherungseinnahmen / BIP × 100 = 182 / 670 × 100 ≈ 27.2%. Das bedeutet, dass von jedem Franken Wertschöpfung rund 27 Rappen für die soziale Sicherheit aufgewendet werden."},

{id:"f06", topic:"finanzierung", type:"mc", diff:2, tax:"K2",
 q:"Die Sozialausgaben des Bundes sind von 326 Mio. CHF (1960) auf über 22 Mrd. CHF (2019) gestiegen. Welcher Anteil der gesamten Bundesausgaben entfiel 2019 auf die Sozialausgaben?",
 options:[
   {v:"A", t:"Rund 12%"},
   {v:"B", t:"Rund 21%"},
   {v:"C", t:"Rund 31%"},
   {v:"D", t:"Rund 45%"}
 ],
 correct:"C",
 explain:"2019 machten die Sozialausgaben rund 31.3% der gesamten Bundesausgaben aus. Dieser Anteil ist seit 1960 (12.5%) kontinuierlich gestiegen und zeigt die wachsende Bedeutung der sozialen Sicherheit in den Staatsausgaben."},

{id:"f07", topic:"finanzierung", type:"open", diff:3, tax:"K5",
 q:"Das Umlageverfahren der AHV wird oft als «Generationenvertrag» bezeichnet. Beurteilen Sie, inwiefern dieser Vertrag unter den heutigen demografischen Bedingungen noch tragfähig ist.",
 sample:"Der Generationenvertrag gerät unter Druck, weil der Alterslastquotient sinkt: 1948 finanzierten 9.5 Erwerbstätige einen Rentner, heute sind es nur noch 2.9, und bis 2050 werden es voraussichtlich nur noch 2 sein. Das bedeutet, dass immer weniger Beitragszahlende immer mehr Renten finanzieren müssen. Ohne Reformen (höheres Rentenalter, höhere Beiträge oder Leistungskürzungen) wird die AHV in ein strukturelles Defizit geraten. Allerdings könnte ein starkes Wirtschaftswachstum oder eine höhere Geburtenrate die Situation entspannen.",
 explain:"Bis 2035 wird die AHV einen zusätzlichen Finanzierungsbedarf von rund 15 Mrd. CHF haben. Die Lösung erfordert entweder höhere Beiträge, tiefere Renten, ein höheres Rentenalter oder alternative Finanzierungsquellen (z.B. MWST)."},

// ── VERSICHERUNGSPRINZIPIEN (i01–i07) ──
{id:"i01", topic:"versicherung", type:"mc", diff:1, tax:"K1",
 q:"Was ist das Grundprinzip einer Versicherung?",
 options:[
   {v:"A", t:"Der Staat übernimmt alle individuellen Risiken."},
   {v:"B", t:"Risiken werden zusammengelegt und gemeinsam getragen (kollektive Risikoübernahme)."},
   {v:"C", t:"Jede Person spart individuell für den Schadensfall."},
   {v:"D", t:"Versicherungen verhindern das Eintreten von Schäden."}
 ],
 correct:"B",
 explain:"Das Grundprinzip einer Versicherung ist die kollektive Risikoübernahme (Solidaritätsprinzip): Risiken werden zusammengelegt und gemeinsam getragen. Nur bei einem kleinen Teil der Versicherten tritt tatsächlich ein Schaden ein, sodass sich die Kosten auf viele Prämienzahlende verteilen."},

{id:"i02", topic:"versicherung", type:"fill", diff:1, tax:"K1",
 q:"Das «{0}» besagt: Je grösser die Zahl der Versicherten, desto genauer kann die Versicherung die tatsächliche Zahl der Schadensfälle vorhersagen.",
 blanks:[
   {answer:"Gesetz der grossen Zahlen", alts:["Gesetz der Grossen Zahlen"]}
 ],
 explain:"Das Gesetz der grossen Zahlen ist ein mathematisches Prinzip: Bei einer grossen Anzahl Versicherter nähert sich die Häufigkeit eines Schadensfalls dem theoretischen Mittelwert an. So kann die Versicherung die Kosten zuverlässig kalkulieren."},

{id:"i03", topic:"versicherung", type:"mc", diff:2, tax:"K2",
 q:"Was versteht man unter «Adverse Selektion» (Negativauslese) bei Versicherungen?",
 options:[
   {v:"A", t:"Versicherungen wählen absichtlich die schlechtesten Kunden aus."},
   {v:"B", t:"Gute Risiken scheiden nach und nach aus dem Markt aus, weil die Durchschnittsprämie für sie zu hoch ist."},
   {v:"C", t:"Versicherte verhalten sich nach Abschluss einer Versicherung riskanter."},
   {v:"D", t:"Der Staat wählt aus, welche Risiken versichert werden dürfen."}
 ],
 correct:"B",
 explain:"Bei adverser Selektion ist die Durchschnittsprämie für «gute» Risiken (z.B. vorsichtige Autofahrer) unattraktiv, da sie mehr zahlen als ihrem Risiko entspricht. Sie verzichten auf die Versicherung, wodurch der Anteil «schlechter» Risiken steigt, die Prämien weiter steigen und im Extremfall der Markt zusammenbrechen kann."},

{id:"i04", topic:"versicherung", type:"mc", diff:2, tax:"K2",
 q:"Was ist «Moral Hazard» im Versicherungskontext?",
 options:[
   {v:"A", t:"Eine betrügerische Absicht beim Abschluss einer Versicherung."},
   {v:"B", t:"Die Verhaltensänderung von Versicherten, die nach Abschluss einer Versicherung grössere Risiken eingehen."},
   {v:"C", t:"Die Gefahr, dass die Versicherungsgesellschaft insolvent wird."},
   {v:"D", t:"Ein moralisches Dilemma bei der Festlegung von Prämien."}
 ],
 correct:"B",
 explain:"Moral Hazard (moralisches Risiko) beschreibt die Verhaltensänderung nach Abschluss einer Versicherung: Versicherte geben sich weniger Mühe, Schäden zu verhindern, weil der Schaden ja gedeckt wäre. Beispiel: Ein Autofahrer mit Vollkaskoversicherung fährt unvorsichtiger."},

{id:"i05", topic:"versicherung", type:"sort", diff:2, tax:"K2",
 q:"Ordnen Sie die Gegenmassnahmen dem richtigen Versicherungsproblem zu.",
 categories:["Gegen Moral Hazard", "Gegen Adverse Selektion"],
 items:[
   {t:"Selbstbehalt einführen", cat:0},
   {t:"Bonus-Malus-System", cat:0},
   {t:"Verschiedene Risikogruppen unterschiedlich versichern", cat:1},
   {t:"Obligatorium (Versicherungspflicht)", cat:1}
 ],
 explain:"Gegen Moral Hazard helfen Selbstbehalt (eigene Kostenbeteiligung reduziert Anreiz zu riskantem Verhalten) und Bonus-Malus-Systeme (schadenfreie Versicherte erhalten Prämienreduktionen). Gegen adverse Selektion helfen Risikoklassifizierung (unterschiedliche Prämien für unterschiedliche Risiken) und Obligatorien (alle müssen versichert sein, auch die «guten» Risiken)."},

{id:"i06", topic:"versicherung", type:"tf", diff:2, tax:"K2",
 q:"Ersparnisse auf einem Bankkonto können bei kleinen Schäden (z.B. Glasbruch) eine sinnvolle Alternative zu einer Versicherung sein.",
 correct:true,
 explain:"Korrekt. Bei Schäden mit hoher Eintrittswahrscheinlichkeit und kleiner Schadenssumme (z.B. Glasbruch) ist die Prämie im Verhältnis zum Schaden hoch. Ersparnisse bieten den Vorteil, dass sie gegen verschiedenste Risiken schützen. Bei grossen Schäden (z.B. Brand, Krankheit) sind Ersparnisse hingegen keine echte Alternative."},

{id:"i07", topic:"versicherung", type:"open", diff:3, tax:"K4",
 q:"In der Schweizer Krankenversicherung (Grundversicherung) zahlen alle Erwachsenen pro Kasse und Region die gleiche Prämie, unabhängig von Alter oder Gesundheitszustand. Analysieren Sie, welche versicherungstheoretischen Probleme dadurch entstehen und warum trotzdem ein Obligatorium besteht.",
 sample:"Einheitsprämien schaffen ein Problem der adversen Selektion: Junge, Gesunde zahlen relativ zu ihrem Risiko zu viel, Ältere und Kranke zu wenig. Ohne Obligatorium würden viele Junge und Gesunde die Versicherung verlassen. Das Obligatorium verhindert dieses Ausscheiden der «guten» Risiken und stellt sicher, dass die Solidargemeinschaft bestehen bleibt. Die Einheitsprämie dient dem Solidaritätsprinzip (Umverteilung von Gesund zu Krank und von Jung zu Alt). Prämienverbilligungen mildern die Belastung für Einkommensschwache.",
 explain:"Die Schweizer Krankenversicherung kombiniert bewusst das Versicherungsprinzip mit dem Solidaritätsprinzip. Das Obligatorium ist nötig, um die adverse Selektion zu verhindern, die bei freiwilliger Teilnahme und Einheitsprämien unvermeidlich wäre."},

// ── STAATSEINGRIFFE & STAATSVERSAGEN (e01–e07) ──
{id:"e01", topic:"staatseingriffe", type:"mc", diff:1, tax:"K1",
 q:"Welches ist KEIN Grund für Staatseingriffe in die Wirtschaft?",
 options:[
   {v:"A", t:"Marktversagen (z.B. öffentliche Güter, externe Effekte)"},
   {v:"B", t:"Sicherung des Wettbewerbs und Bekämpfung von Monopolen"},
   {v:"C", t:"Maximierung des Gewinns einzelner Unternehmen"},
   {v:"D", t:"Bereitstellung öffentlicher Güter"}
 ],
 correct:"C",
 explain:"Die Maximierung von Unternehmensgewinnen ist kein legitimer Grund für Staatseingriffe. Staatliche Eingriffe sind gerechtfertigt bei Marktversagen, zur Sicherung des Wettbewerbs, zur Bereitstellung öffentlicher Güter und zum Schutz bei externen Effekten oder asymmetrischer Information."},

{id:"e02", topic:"staatseingriffe", type:"sort", diff:1, tax:"K1",
 q:"Ordnen Sie die Beispiele der richtigen Art des Staatseingriffs zu.",
 categories:["Regulierung", "Finanzierung (Steuern/Subventionen)", "Produktion", "Transfers"],
 items:[
   {t:"Obligatorische Sozialversicherungsbeiträge", cat:0},
   {t:"Verbilligung der Krankenkassenprämien", cat:1},
   {t:"Staatliche Schulhäuser und Lehrpersonen", cat:2},
   {t:"Sozialhilfe und Mietbeiträge", cat:3},
   {t:"Mindestlöhne", cat:0},
   {t:"Einkommenssteuer", cat:1}
 ],
 explain:"Der Staat greift auf vier Arten ein: Regulierung (Qualitäts-, Quantitäts- und Preiskontrolle), Finanzierung (Steuern und Subventionen), Produktion (öffentliche Güter bereitstellen) und Transfers (direkte Geld- oder Sachleistungen an Bedürftige)."},

{id:"e03", topic:"staatseingriffe", type:"fill", diff:2, tax:"K2",
 q:"In einer Welt mit {0} Wettbewerb, {1} Märkten und keinem Marktversagen bräuchte es keine Staatseingriffe. Da diese Bedingungen in der Realität nicht erfüllt sind, können Interventionen sinnvoll sein.",
 blanks:[
   {answer:"vollkommenem", alts:["vollständigem","perfektem"]},
   {answer:"vollständigen", alts:["vollkommenen","perfekten"]}
 ],
 explain:"Ohne Staatseingriffe funktioniert die Wirtschaft effizient, wenn drei Bedingungen erfüllt sind: vollkommener Wettbewerb (keine Marktmacht), vollständige Märkte (für jedes Gut existiert ein Markt) und kein Marktversagen. Da diese Idealbedingungen nie vollständig erfüllt sind, gibt es Raum für staatliche Interventionen."},

{id:"e04", topic:"staatseingriffe", type:"mc", diff:2, tax:"K2",
 q:"Was ist mit «Staatsversagen» gemeint?",
 options:[
   {v:"A", t:"Der Staat geht in Konkurs."},
   {v:"B", t:"Staatliche Massnahmen verfehlen ihre Ziele oder verursachen unbeabsichtigte Nebenwirkungen."},
   {v:"C", t:"Die Bürger verweigern die Steuerzahlung."},
   {v:"D", t:"Der Staat stellt keine öffentlichen Güter mehr bereit."}
 ],
 correct:"B",
 explain:"Staatsversagen bedeutet, dass staatliche Eingriffe ihre Ziele nicht erreichen oder sogar unbeabsichtigte negative Nebenwirkungen haben. Gründe sind u.a.: Eigendynamik/Überangebot, Ineffizienz, veränderte Leistungsanreize und unbeabsichtigte Nebenwirkungen (z.B. Arbeitnehmerschutz führt zu mehr Arbeitslosigkeit)."},

{id:"e05", topic:"staatseingriffe", type:"tf", diff:2, tax:"K2",
 q:"Arbeitnehmerschutz kann als unbeabsichtigte Nebenwirkung zu mehr Arbeitslosigkeit führen.",
 correct:true,
 explain:"Korrekt. Strenger Arbeitnehmerschutz kann den Kündigungsschutz so stark erhöhen, dass Unternehmen weniger Arbeitskräfte einstellen (Insider-Outsider-Modell). Die «Insider» (Angestellte) profitieren, während «Outsider» (Arbeitslose) schlechtere Chancen haben. Dies ist ein klassisches Beispiel für Staatsversagen durch unbeabsichtigte Nebenwirkungen."},

{id:"e06", topic:"staatseingriffe", type:"mc", diff:3, tax:"K4",
 q:"Die Sozialhilfe bietet ein Einkommen ohne Gegenleistung. Welches ökonomische Problem entsteht dadurch?",
 options:[
   {v:"A", t:"Inflation steigt, weil mehr Geld im Umlauf ist."},
   {v:"B", t:"Ein Moral-Hazard-Problem: Der Anreiz, erwerbstätig zu sein, sinkt durch das «Gratiseinkommen»."},
   {v:"C", t:"Die Arbeitsproduktivität der Gesamtwirtschaft steigt."},
   {v:"D", t:"Der Staat spart langfristig Geld."}
 ],
 correct:"B",
 explain:"Je grosszügiger staatliche Sozialtransfers sind, desto grösser ist der Anreiz, die eigene Leistungsbereitschaft zu reduzieren (Moral-Hazard-Problem). Dies kann zu einem Teufelskreis führen: Geringere Leistungsbereitschaft reduziert die Wirtschaftsleistung, was die Finanzierung der Sozialwerke erschwert."},

{id:"e07", topic:"staatseingriffe", type:"open", diff:3, tax:"K5",
 q:"«Grundsätzlich sollten Umverteilungsmassnahmen als Geldleistungen und nicht als Sachleistungen erfolgen.» Diskutieren Sie diese Aussage und nennen Sie Argumente für und gegen Sachleistungen.",
 sample:"Für Geldleistungen spricht, dass Individuen ihre eigenen Präferenzen am besten kennen und das Geld optimal einsetzen können (Konsumentensouveränität). Für Sachleistungen sprechen paternalistische Gründe (z.B. sicherstellen, dass Arme tatsächlich Essen kaufen) und das Konzept meritorischer Güter (vom Markt ungenügend bereitgestellte Güter wie Bildung). Sachleistungen können auch gezielter sein, bergen aber die Gefahr, dass sie nicht den tatsächlichen Bedürfnissen entsprechen.",
 explain:"Die Debatte zwischen Geld- und Sachleistungen ist ein Kernthema der Sozialpolitik. In der Praxis gibt es in der Schweiz beides: Geldleistungen (Sozialhilfe, AHV-Renten) und Sachleistungen bzw. zweckgebundene Transfers (Prämienverbilligungen, subventionierte Kitaplätze)."},

// ── HERAUSFORDERUNGEN & REFORMEN (h01–h05) ──
{id:"h01", topic:"herausforderungen", type:"mc", diff:1, tax:"K1",
 q:"Wie hat sich der Alterslastquotient (Verhältnis der über 64-Jährigen zu den 20–64-Jährigen) in der Schweiz entwickelt?",
 options:[
   {v:"A", t:"Er ist von 2:1 (1948) auf 9.5:1 (heute) gestiegen."},
   {v:"B", t:"Er ist von 9.5:1 (1948) auf ca. 2.9:1 (heute) gesunken und wird weiter auf 2:1 sinken."},
   {v:"C", t:"Er ist stabil bei 5:1 geblieben."},
   {v:"D", t:"Er hat sich seit 1948 nicht verändert."}
 ],
 correct:"B",
 explain:"Der Alterslastquotient ist von 9.5:1 (1948) auf heute 2.9:1 gesunken. Bis 2050 wird er voraussichtlich auf 2:1 absinken. Das bedeutet: 1948 finanzierten 9.5 Erwerbstätige einen Rentner, heute nur noch 2.9. Dies ist eine der grössten Herausforderungen für das Umlageverfahren der AHV."},

{id:"h02", topic:"herausforderungen", type:"tf", diff:1, tax:"K1",
 q:"Am 5. Juni 2016 hat das Schweizer Stimmvolk die Initiative für ein bedingungsloses Grundeinkommen abgelehnt.",
 correct:true,
 explain:"Korrekt. Die Initiative forderte ein bedingungsloses Grundeinkommen von CHF 2'500 pro Monat für jede in der Schweiz lebende Person (Kinder CHF 625), ohne jede Bedingung. Sie wurde vom Volk abgelehnt."},

{id:"h03", topic:"herausforderungen", type:"mc", diff:2, tax:"K2",
 q:"Was ist die «negative Einkommenssteuer»?",
 options:[
   {v:"A", t:"Eine Steuer, die nur auf negative Einkommen (Verluste) erhoben wird."},
   {v:"B", t:"Ein System, bei dem Haushalte mit tiefem Einkommen Transferzahlungen erhalten statt Steuern zu zahlen."},
   {v:"C", t:"Eine Steuer, die bei sinkendem BIP automatisch gesenkt wird."},
   {v:"D", t:"Die Abschaffung aller Einkommenssteuern."}
 ],
 correct:"B",
 explain:"Die negative Einkommenssteuer verbindet Sozial- und Steuersystem: Tiefe Einkommen erhalten Transferzahlungen (negative Steuer), die mit steigendem Einkommen abnehmen. Ab einem Schwellenwert werden reguläre Steuern fällig. Da die Transfers nicht vollständig gekürzt werden, besteht immer ein Anreiz zur Erwerbstätigkeit – die «Armutsfalle» wird vermieden."},

{id:"h04", topic:"herausforderungen", type:"sort", diff:2, tax:"K2",
 q:"Ordnen Sie die Reformvorschläge der richtigen Seite zu.",
 categories:["Leistungsseite (Ausgaben ändern)", "Finanzierungsseite (Einnahmen ändern)"],
 items:[
   {t:"Heraufsetzung des Rentenalters", cat:0},
   {t:"Umstellung auf Kapitaldeckungsverfahren", cat:1},
   {t:"Einführung einer steuerfreien Einheitsrente", cat:0},
   {t:"Finanzierung über Mehrwertsteuer statt Lohnprozente", cat:1},
   {t:"Privatisierung der ALV", cat:0},
   {t:"Finanzierung aus Ökosteuern", cat:1}
 ],
 explain:"Reformen können entweder die Leistungsseite (was und wie viel ausbezahlt wird) oder die Finanzierungsseite (wie die Einnahmen generiert werden) betreffen. Oft braucht es eine Kombination beider Ansätze."},

{id:"h05", topic:"herausforderungen", type:"open", diff:3, tax:"K5",
 q:"Im Interview mit den Jungparteien werden drei unterschiedliche Positionen zum Sozialstaat vertreten. Vergleichen Sie die Positionen von Junger SP, Jungfreisinnigen und Junger SVP zur Frage, ob der Sozialstaat weiter ausgebaut werden soll.",
 sample:"Junge SP (Jansen): Fordert einen Ausbau des Sozialstaats, besonders im Gesundheitsbereich und bei der Kinderbetreuung. Begründung: Pflegeleistungen sind kaum rationalisierbar, daher steigen die Kosten zwangsläufig. Lehnt Kürzungen ab. Jungfreisinnige (Müller): Sehen den Sozialstaat als «fertig gebaut». Fordern Eigenverantwortung und warnen, dass die Jungen die Lasten des Ausbaus tragen müssen. Junge SVP (Trachsel): Fordert sogar einen Rückbau, da das aufgeblasene Netz eine Anspruchsmentalität fördert und die Selbstverantwortung lähmt. Sieht die Grenzen der Finanzierbarkeit als erreicht.",
 explain:"Die drei Positionen widerspiegeln die Gerechtigkeitstheorien: Die Junge SP steht den Collectivists/Liberals nahe (mehr Umverteilung), die Jungfreisinnigen den Liberals/Libertarians (Eigenverantwortung), die Junge SVP den Libertarians (weniger Staat). Diese Debatte ist zentral für die Schweizer Sozialpolitik."}
];
