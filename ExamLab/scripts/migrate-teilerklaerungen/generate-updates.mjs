#!/usr/bin/env node
/**
 * Stichprobe Session 1: Generiert fragen-updates.jsonl fuer die 30 IDs aus
 * stichprobe-ids.json. Claude Code hat die Musterloesungen + Teilerklaerungen
 * inline definiert (siehe "updates"-Array).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

// 30 Updates fuer Stichprobe-Session 1.
// Reihenfolge: Recht (10) → VWL (10) → BWL (10).
const updates = [
  // --- Recht — Lueckentext (4) ---
  {
    id: '15d5b2ba-a99b-4b3a-aa19-ceaf3019bd6d',
    fachbereich: 'Recht',
    musterlosung:
      'Bei einer Grunddienstbarkeit bestehen stets zwei Grundstücke: Das «dienende» (belastete) Grundstück muss eine Einschränkung dulden oder etwas unterlassen. Das «herrschende» (berechtigte) Grundstück profitiert vom Recht. Typische Beispiele sind Wegrecht, Quellenrecht oder Näherbaurecht. Die Dienstbarkeit wird im Grundbuch eingetragen und gilt gegenüber jedem neuen Eigentümer.',
    teilerklaerungen: [
      {
        feld: 'luecken',
        id: 'luecke-0',
        text: 'Das belastete Grundstück heisst «dienend», weil es der Dienstbarkeit dient.',
      },
      {
        feld: 'luecken',
        id: 'luecke-1',
        text: 'Das berechtigte Grundstück heisst «herrschend», weil sein Eigentümer die Dienstbarkeit ausübt.',
      },
    ],
  },
  {
    id: '50d88137-8092-4a53-b0ac-67e0aabb8aca',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 36 Abs. 3 der Bundesverfassung verlangt, dass Eingriffe in Grundrechte verhältnismässig sein müssen. Die Massnahme muss geeignet sein, das Ziel zu erreichen, sie muss das mildeste taugliche Mittel darstellen, und die Nachteile für die Betroffenen dürfen nicht im Missverhältnis zum öffentlichen Interesse stehen. Ohne Verhältnismässigkeit ist der Eingriff unzulässig.',
    teilerklaerungen: [
      {
        feld: 'luecken',
        id: 'luecke-0',
        text: '«Verhältnismässig» heisst geeignet, erforderlich und zumutbar — ein Eingriff darf nicht weiter gehen als nötig.',
      },
    ],
  },
  {
    id: 'adc01b73-2bdd-44a1-869d-43dfa9cf43c3',
    fachbereich: 'Recht',
    musterlosung:
      'Nach Art. 199 OR kann die Sachgewährleistung vertraglich wegbedungen werden (Freizeichnungsklausel). Hat der Verkäufer den Mangel aber arglistig verschwiegen, ist die Klausel nichtig und die gesetzliche Gewährleistung greift. Die Bestimmung schützt den Käufer vor unredlichem Verhalten des Verkäufers.',
    teilerklaerungen: [
      {
        feld: 'luecken',
        id: 'luecke-0',
        text: 'Art. 199 OR ist die Sonderregel zur Freizeichnung: Wegbedingung ist möglich, wird aber bei Arglist unwirksam.',
      },
    ],
  },
  {
    id: 'e93c1a84-7bf0-440d-ad10-83bce907382d',
    fachbereich: 'Recht',
    musterlosung:
      'Das öffentliche Recht ist dadurch gekennzeichnet, dass sich die beteiligten Rechtssubjekte nicht auf Augenhöhe begegnen: Der Staat tritt dem Bürger hoheitlich gegenüber. Diese Über-/Unterordnung nennt man subordinativ. Das Privatrecht regelt demgegenüber koordinative Rechtsverhältnisse zwischen Privaten, die grundsätzlich gleichgestellt sind.',
    teilerklaerungen: [
      {
        feld: 'luecken',
        id: 'luecke-0',
        text: 'Subordinativ heisst Über-/Unterordnung: Der Staat handelt hoheitlich, der Bürger ist unterworfen.',
      },
    ],
  },

  // --- Recht — MC (3) ---
  {
    id: '08fcfac7-0fa4-4e94-b354-92689e6cde30',
    fachbereich: 'Recht',
    musterlosung:
      'Gemäss Art. 262 Abs. 2 OR darf der Vermieter die Zustimmung zur Untermiete nur aus drei Gründen verweigern: fehlende Angaben, missbräuchliche Bedingungen oder wesentliche Nachteile. Hier kassiert Linus CHF 1\'400 Untermiete bei CHF 1\'350 eigener Miete — er erzielt also einen Gewinn. Das gilt als missbräuchlich; die Untermiete darf verboten werden.',
    teilerklaerungen: [
      {
        feld: 'optionen',
        id: 'opt-0',
        text: 'Die Personen der Untermieter sind kein Ablehnungsgrund — OR 262 Abs. 2 nennt die Gründe abschliessend.',
      },
      {
        feld: 'optionen',
        id: 'opt-1',
        text: 'Missbräuchliche Bedingungen sind gerade der gesetzliche Verweigerungsgrund — die Preise sind nicht frei.',
      },
      {
        feld: 'optionen',
        id: 'opt-2',
        text: 'Untermiete braucht grundsätzlich die Zustimmung; sie kann nach OR 262 Abs. 2 verweigert werden.',
      },
      {
        feld: 'optionen',
        id: 'opt-3',
        text: 'Korrekt: Die Summe der Untermieten übersteigt den Hauptmietzins — Linus verdient an der Untermiete, das ist missbräuchlich.',
      },
    ],
  },
  {
    id: '806ac2fb-3ead-401a-b405-dd1189ce3683',
    fachbereich: 'Recht',
    musterlosung:
      'Die Abdichtung einer Terrasse betrifft die Gebäudesubstanz und zählt zu den zwingend gemeinschaftlichen Teilen (Art. 712a ZGB). Die Kosten werden unabhängig vom Sondernutzungsrecht gemäss Wertquoten von allen Stockwerkeigentümern getragen (Art. 712h ZGB). A hat zwar das alleinige Nutzungsrecht; B muss sich dennoch anteilig an den Sanierungskosten beteiligen.',
    teilerklaerungen: [
      {
        feld: 'optionen',
        id: 'opt-0',
        text: 'Die Kostenhöhe ändert nichts an der Kostenträgerschaft — gemeinschaftliche Teile werden immer gemeinsam finanziert.',
      },
      {
        feld: 'optionen',
        id: 'opt-1',
        text: 'Eine Gebäudeversicherung deckt nur Schadenfälle, nicht die regelmässige Sanierung der Bausubstanz.',
      },
      {
        feld: 'optionen',
        id: 'opt-2',
        text: 'Das Sondernutzungsrecht erfasst nur die Nutzung, nicht die Kosten für gemeinschaftliche Gebäudesubstanz.',
      },
      {
        feld: 'optionen',
        id: 'opt-3',
        text: 'Korrekt: Die Abdichtung gehört zur gemeinschaftlichen Substanz — die Kosten werden nach Wertquoten verteilt.',
      },
    ],
  },
  {
    id: 'fad6dd7d-3a34-4651-a9b6-58d164ccf644',
    fachbereich: 'Recht',
    musterlosung:
      'Lehr-, Handelsreisenden- und Heimarbeitsvertrag sind die im OR besonders geregelten Arbeitsverträge (Art. 344 ff., 347 ff., 351 ff.). GAV und NAV sind dagegen kollektive Rahmenregelungen zwischen Sozialpartnern bzw. vom Staat — sie ergänzen Einzelarbeitsverträge, sind aber selbst keine. Die Kündigungsfristen variieren stark je nach Vertragsart.',
    teilerklaerungen: [
      {
        feld: 'optionen',
        id: 'opt-0',
        text: 'Korrekt: Der Lehrvertrag verlangt nach Art. 344a OR Schriftform und muss die Ausbildungsinhalte regeln.',
      },
      {
        feld: 'optionen',
        id: 'opt-1',
        text: 'Korrekt: Beide sind im OR als besondere Arbeitsverträge geregelt (Handelsreise Art. 347, Heimarbeit Art. 351).',
      },
      {
        feld: 'optionen',
        id: 'opt-2',
        text: 'GAV und NAV sind Kollektivnormen zwischen Sozialpartnern oder vom Staat — keine Einzelverträge zwischen AG und AN.',
      },
      {
        feld: 'optionen',
        id: 'opt-3',
        text: 'Die Fristen variieren stark: Lehrvertrag und Heimarbeit haben unterschiedliche Kündigungsregeln.',
      },
    ],
  },

  // --- Recht — Richtig/Falsch (3) — aussagen ohne IDs, darum teilerklaerungen=[] ---
  {
    id: '6c4ab016-6dec-43d2-8794-b19f46559e18',
    fachbereich: 'Recht',
    musterlosung:
      'Richtig. Das öffentlich-rechtliche Arbeitsrecht — insbesondere das Arbeitsgesetz (ArG) — wird vom Staat zwingend erlassen, um die Arbeitnehmenden zu schützen. Es regelt Höchstarbeitszeiten, Pausen, Nachtarbeit und Jugendschutz. Abweichungen zulasten der Arbeitnehmenden sind ausgeschlossen.',
    teilerklaerungen: [],
  },
  {
    id: 'dc970aed-8eff-4c80-9569-e17798dd45f1',
    fachbereich: 'Recht',
    musterlosung:
      'Falsch. Typisch für den Arbeitsvertrag nach OR 319 sind Unterordnung, Weisungsgebundenheit und persönliche Leistungspflicht. Der Designer ist zeitlich frei und unterliegt keinen Weisungen — es fehlt das Subordinationsverhältnis. Wahrscheinlicher liegt ein Werkvertrag oder Auftrag vor (Erfolgs- bzw. Tätigkeitspflicht ohne Unterordnung).',
    teilerklaerungen: [],
  },
  {
    id: 'e3ef8fa7-a1f5-485d-a467-4d62c67154d1',
    fachbereich: 'Recht',
    musterlosung:
      'Richtig. Der Betreibungsauszug zeigt, ob in den letzten fünf Jahren Betreibungen gegen die Person eingeleitet wurden. Für Vermieter ist er ein wichtiges Indiz für die Zahlungsmoral — allerdings nur ein Indiz, denn er bildet Vergangenes ab. Viele Vermieter verlangen ihn routinemässig als Teil der Mietbewerbung.',
    teilerklaerungen: [],
  },

  // --- VWL — Berechnung (2) — keine teilerklaerungen ---
  {
    id: '3b538d07-17ee-440b-8c0f-dcf24493ba3d',
    fachbereich: 'VWL',
    musterlosung:
      'Das BIP misst den Wert der Endprodukte, nicht die Summe aller Umsätze. Endprodukt ist das Brot, Preis CHF 150. Die Wertschöpfungsrechnung ergibt: Bauer CHF 40, Müller 90 − 40 = CHF 50, Bäcker 150 − 90 = CHF 60. Die Summe aller Wertschöpfungen beträgt CHF 150 — identisch mit dem Endproduktpreis.',
    teilerklaerungen: [],
  },
  {
    id: 'a04a793c-890e-4f7f-b978-47f4b97de56b',
    fachbereich: 'VWL',
    musterlosung:
      'Im Marktgleichgewicht sind nachgefragte und angebotene Menge gleich. Aus 100 − 2Q = 20 + Q folgt 80 = 3Q und damit Q* ≈ 26.67 Einheiten. Einsetzen in die Angebotsfunktion ergibt P* = 20 + 26.67 ≈ CHF 46.67. Am Schnittpunkt von Angebot und Nachfrage räumt der Markt sich selbst.',
    teilerklaerungen: [],
  },

  // --- VWL — Bildbeschriftung (1) ---
  {
    id: 'ueb-bb-zelle',
    fachbereich: 'VWL',
    musterlosung:
      'Die tierische Zelle besteht aus drei zentralen Bestandteilen: Der Zellkern (Nukleus) enthält das Erbgut (DNA) und steuert als Kommandozentrale die Zellfunktionen. Die Zellmembran grenzt die Zelle ab und regelt den Ein- und Austritt von Stoffen. Die Mitochondrien sind die «Kraftwerke» der Zelle und erzeugen durch Zellatmung Energie in Form von ATP.',
    teilerklaerungen: [
      {
        feld: 'beschriftungen',
        id: '1',
        text: 'Der Zellkern (Nukleus) enthält die DNA und steuert sämtliche Zellaktivitäten.',
      },
      {
        feld: 'beschriftungen',
        id: '2',
        text: 'Die Zellmembran grenzt die Zelle ab und regelt den Stoffaustausch mit der Umgebung.',
      },
      {
        feld: 'beschriftungen',
        id: '3',
        text: 'Mitochondrien erzeugen durch Zellatmung die Energieform ATP — das «Kraftwerk» der Zelle.',
      },
    ],
  },

  // --- VWL — DragDrop-Bild (1) ---
  {
    id: 'ueb-dd-kontinente',
    fachbereich: 'VWL',
    musterlosung:
      'Auf einer Standardprojektion der Welt liegt Nordamerika links oben (Nordwesten), Europa mittig oben und Asien rechts oben. Südamerika befindet sich links unten, südlich von Nordamerika. Die Weltkarte folgt damit der üblichen Ausrichtung mit Norden oben und Greenwich-Meridian in der Mitte.',
    teilerklaerungen: [
      {
        feld: 'zielzonen',
        id: '1',
        text: 'Nordamerika liegt im Nordwesten der Karte, links oben.',
      },
      {
        feld: 'zielzonen',
        id: '2',
        text: 'Europa liegt oben mittig — zwischen Nordamerika und Asien.',
      },
      {
        feld: 'zielzonen',
        id: '3',
        text: 'Asien liegt rechts oben, östlich von Europa.',
      },
      {
        feld: 'zielzonen',
        id: '4',
        text: 'Südamerika liegt links unten, südlich von Nordamerika.',
      },
    ],
  },

  // --- VWL — Hotspot (1) ---
  {
    id: '3b447f0c-0a94-4959-b57c-4791a7d555bd',
    fachbereich: 'VWL',
    musterlosung:
      'Die Laffer-Kurve zeigt den Zusammenhang zwischen Steuersatz und Steuereinnahmen. Bei 0 Prozent fehlen alle Einnahmen, bei 100 Prozent arbeitet niemand mehr — die Einnahmen sind ebenfalls null. Dazwischen liegt das Maximum am optimalen Steuersatz (Punkt B). Jenseits davon sinken die Einnahmen durch geringere Leistungsbereitschaft und Steuerflucht.',
    teilerklaerungen: [
      {
        feld: 'bereiche',
        id: 'b_7qm2tdd8',
        text: 'Bei tiefem Steuersatz liegen die Einnahmen unter dem Optimum — eine Erhöhung brächte noch mehr ein.',
      },
      {
        feld: 'bereiche',
        id: 'b_sqr6agov',
        text: 'Optimaler Steuersatz: Hier sind die Steuereinnahmen maximal; jede Verschiebung senkt den Ertrag.',
      },
      {
        feld: 'bereiche',
        id: 'b_sn0gwda8',
        text: 'Hoher Steuersatz über dem Optimum: Leistungsbereitschaft sinkt, Einnahmen gehen zurück.',
      },
      {
        feld: 'bereiche',
        id: 'b_4vrrrc3o',
        text: 'Bei 100 Prozent Steuersatz lohnt sich Arbeit nicht mehr — die Steuereinnahmen fallen theoretisch auf null.',
      },
    ],
  },

  // --- VWL — MC (2) ---
  {
    id: 'a9b32c79-6f44-452d-b435-e26e6570c934',
    fachbereich: 'VWL',
    musterlosung:
      'Die «Tragödie der Allmende» (Garrett Hardin, 1968) beschreibt die Übernutzung frei zugänglicher Ressourcen. Jede einzelne Nutzerin maximiert ihren individuellen Vorteil, trägt aber nur einen Bruchteil der Übernutzungskosten. Das Resultat: Weiden, Fischgründe oder Atmosphäre werden bis zur Zerstörung ausgebeutet — ein klassisches Marktversagen bei Kollektivgütern.',
    teilerklaerungen: [
      {
        feld: 'optionen',
        id: 'opt-0',
        text: 'Der Zusammenbruch eines Monopols beschreibt ein anderes Phänomen — Allmende-Probleme entstehen durch freien Zugang, nicht durch Marktmacht.',
      },
      {
        feld: 'optionen',
        id: 'opt-1',
        text: 'Korrekt: Bei gemeinsamen Ressourcen handelt jeder individuell rational, kollektiv führt es zur Zerstörung der Ressource.',
      },
      {
        feld: 'optionen',
        id: 'opt-2',
        text: 'Unternutzung ist das Gegenteil — die Allmende-Tragödie beschreibt gerade die Übernutzung.',
      },
      {
        feld: 'optionen',
        id: 'opt-3',
        text: 'Hohe Steuern gehören nicht zum Allmende-Konzept, das sich auf Ressourcennutzung bezieht.',
      },
    ],
  },
  {
    id: 'e695eb9d-d866-4ea8-8481-6f168436e2cf',
    fachbereich: 'VWL',
    musterlosung:
      'Rogoff und Reinhart berichteten 2010 in «Growth in a Time of Debt» von einem kritischen Schwellenwert bei 90 Prozent des BIP, ab dem das Wirtschaftswachstum deutlich zurückgeht. Die Studie wurde später wegen methodischer Fehler kritisiert — der genaue Schwellenwert ist umstritten. Die Grundthese negativer Wachstumseffekte bei hoher Verschuldung wird weiterhin diskutiert.',
    teilerklaerungen: [
      {
        feld: 'optionen',
        id: 'opt-0',
        text: 'Korrekt: Rogoff und Reinhart nannten 90 Prozent des BIP als kritischen Schwellenwert.',
      },
      {
        feld: 'optionen',
        id: 'opt-1',
        text: '60 Prozent ist die Maastricht-Vorgabe der EU — Rogoff/Reinhart setzten den Schwellenwert deutlich höher.',
      },
      {
        feld: 'optionen',
        id: 'opt-2',
        text: '50 Prozent ist kein gängiger Schwellenwert — zu tief gegenüber dem Studienergebnis.',
      },
      {
        feld: 'optionen',
        id: 'opt-3',
        text: '120 Prozent wird oft als «sehr hoch» diskutiert, entspricht aber nicht dem Ergebnis dieser Studie.',
      },
    ],
  },

  // --- VWL — Richtig/Falsch (2) — aussagen ohne IDs ---
  {
    id: '17137c4c-4498-4df2-b339-c8eda7baac34',
    fachbereich: 'VWL',
    musterlosung:
      'Richtig. Selbstständig Erwerbende zahlen den gesamten AHV-/IV-/EO-Beitrag selbst, weil kein Arbeitgeber die Hälfte übernimmt. Bei tiefen Einkommen greift eine sinkende Beitragsskala zur Entlastung. Nicht erwerbstätige Personen — etwa Studierende ohne Nebenerwerb — bezahlen einen Mindestbeitrag an die AHV.',
    teilerklaerungen: [],
  },
  {
    id: '64f6bbe5-2b25-444c-8268-3d89b640a828',
    fachbereich: 'VWL',
    musterlosung:
      'Richtig. Am 5. Juni 2016 lehnte das Schweizer Stimmvolk die Initiative «Für ein bedingungsloses Grundeinkommen» mit rund 77 Prozent Nein-Stimmen deutlich ab. Die Initiative forderte CHF 2\'500 pro Monat für jede erwachsene Person und CHF 625 für Kinder, ohne Einkommensprüfung oder Gegenleistung.',
    teilerklaerungen: [],
  },

  // --- VWL — Zuordnung (1) — paare ohne IDs, keine teilerklaerungen ---
  {
    id: '631afcd9-98c9-4627-8022-a7aef1411c31',
    fachbereich: 'VWL',
    musterlosung:
      'Die VWL erfüllt vier Kernaufgaben: Beschreiben (Fakten darstellen, etwa Quoten oder Wachstumsraten), Erklären (Ursachen analysieren — warum kommt es dazu?), Prognostizieren (Zukunft schätzen) und Beeinflussen (wirtschaftspolitische Empfehlungen). Die ersten drei sind deskriptiv, die letzte normativ — sie verbindet Analyse mit Handlungsempfehlung.',
    teilerklaerungen: [],
  },

  // --- BWL — Bilanzstruktur (2) — feld=kontenMitSaldi, id=kontonummer ---
  {
    id: 'einr-bilanz-einfach',
    fachbereich: 'BWL',
    musterlosung:
      'Die Aktivseite der Bilanz umfasst das Umlaufvermögen: Kasse CHF 50 und Bank CHF 150, zusammen CHF 200. Die Passivseite besteht aus Fremdkapital (Kreditoren CHF 80) und Eigenkapital (CHF 120), ebenfalls CHF 200. Aktiv- und Passivsumme stimmen überein — die Bilanz ist ausgeglichen bei CHF 200.',
    teilerklaerungen: [
      {
        feld: 'kontenMitSaldi',
        id: '1000',
        text: 'Kasse (1000) ist ein Aktivkonto des Umlaufvermögens — flüssige Mittel, die sofort verfügbar sind.',
      },
      {
        feld: 'kontenMitSaldi',
        id: '1020',
        text: 'Bank (1020) gehört ebenfalls zum Umlaufvermögen — leicht verfügbare flüssige Mittel auf einem Konto.',
      },
      {
        feld: 'kontenMitSaldi',
        id: '2000',
        text: 'Kreditoren (2000) sind kurzfristiges Fremdkapital — offene Schulden gegenüber Lieferanten.',
      },
      {
        feld: 'kontenMitSaldi',
        id: '2800',
        text: 'Eigenkapital (2800) ist die Differenz zwischen Aktiven und Fremdkapital — der Finanzierungsanteil der Eigentümer.',
      },
    ],
  },
  {
    id: 'ueb-bilanz-einfach',
    fachbereich: 'BWL',
    musterlosung:
      'Auf der Aktivseite stehen das Umlaufvermögen (Kasse CHF 500) und das Anlagevermögen (Maschinen CHF 1\'500) — zusammen CHF 2\'000. Die Passivseite besteht aus Fremdkapital (Darlehen CHF 800) und Eigenkapital (CHF 1\'200), ebenfalls CHF 2\'000. Aktiven und Passiven sind im Gleichgewicht.',
    teilerklaerungen: [
      {
        feld: 'kontenMitSaldi',
        id: '1000',
        text: 'Kasse (1000) ist Umlaufvermögen — liquide Mittel, sofort verfügbar.',
      },
      {
        feld: 'kontenMitSaldi',
        id: '1500',
        text: 'Maschinen (1500) sind Anlagevermögen — langfristig im Betrieb gebunden.',
      },
      {
        feld: 'kontenMitSaldi',
        id: '2400',
        text: 'Darlehen (2400) zählen zum langfristigen Fremdkapital — externe Finanzierung.',
      },
      {
        feld: 'kontenMitSaldi',
        id: '2800',
        text: 'Eigenkapital (2800) ist der Finanzierungsanteil der Eigentümer — Differenz aus Aktiven und Fremdkapital.',
      },
    ],
  },

  // --- BWL — Buchungssatz (2) ---
  {
    id: 'fc163bff-f3ba-4de3-99ed-cb14a5c563b3',
    fachbereich: 'BWL',
    musterlosung:
      'Bei einem Barverkauf fliesst Geld in die Kasse. Die Kasse ist ein Aktivkonto, Zunahmen werden im Soll gebucht (Konto 1000). Gleichzeitig entsteht Warenertrag — ein Ertragskonto, Zunahmen im Haben (Konto 3200). Der Buchungssatz lautet: Kasse an Warenertrag CHF 800.',
    teilerklaerungen: [
      {
        feld: 'buchungen',
        id: 'b_38f719f9',
        text: 'Kasse 1000 Soll CHF 800 / Warenertrag 3200 Haben CHF 800 — Aktivzunahme im Soll, Ertragszunahme im Haben.',
      },
    ],
  },
  {
    id: 'ueb-bs-einkauf',
    fachbereich: 'BWL',
    musterlosung:
      'Beim bar bezahlten Wareneinkauf entsteht Aufwand. Warenaufwand ist ein Aufwandkonto, Zunahmen werden im Soll gebucht (Konto 4200). Gleichzeitig nimmt die Kasse ab — Aktivkonto, Abnahmen im Haben (Konto 1000). Der Buchungssatz lautet: Warenaufwand an Kasse CHF 50.',
    teilerklaerungen: [
      {
        feld: 'buchungen',
        id: 'bs-einkauf',
        text: 'Warenaufwand 4200 Soll CHF 50 / Kasse 1000 Haben CHF 50 — Aufwandzunahme im Soll, Aktivabnahme im Haben.',
      },
    ],
  },

  // --- BWL — DragDrop-Bild (1) ---
  {
    id: 'einr-dd-kontinente',
    fachbereich: 'BWL',
    musterlosung:
      'Auf einer Standardprojektion der Welt liegt Nordamerika links oben (Nordwesten), Europa mittig oben und Asien rechts oben. Südamerika befindet sich links unten unter Nordamerika. Afrika und Australien sind Distraktoren und haben in dieser Aufgabe keine Zielzone.',
    teilerklaerungen: [
      {
        feld: 'zielzonen',
        id: '1',
        text: 'Nordamerika liegt im Nordwesten der Karte, links oben.',
      },
      {
        feld: 'zielzonen',
        id: '2',
        text: 'Europa liegt oben mittig — zwischen Nordamerika und Asien.',
      },
      {
        feld: 'zielzonen',
        id: '3',
        text: 'Asien liegt rechts oben, östlich von Europa.',
      },
      {
        feld: 'zielzonen',
        id: '4',
        text: 'Südamerika liegt links unten, südlich von Nordamerika.',
      },
    ],
  },

  // --- BWL — Kontenbestimmung (2) ---
  {
    id: '3ec0784b-bb93-4b7d-a98f-166fb659da9a',
    fachbereich: 'BWL',
    musterlosung:
      'Barverkauf einer Dienstleistung: Die Kasse nimmt als Aktivkonto zu (Soll 1000), der Dienstleistungsertrag als Ertragskonto ebenfalls (Haben 3400). Stromrechnung auf Kredit: Energieaufwand entsteht (Soll 6400), die Schuld gegenüber dem Lieferanten wird als Kreditor verbucht (Haben 2000). Beide Buchungen folgen der Soll-Haben-Logik der vier Kontentypen.',
    teilerklaerungen: [
      {
        feld: 'aufgaben',
        id: '3ec0784b-bb93-4b7d-a98f-166fb659da9a-0',
        text: 'Kasse 1000 Soll CHF 800 / DL-Ertrag 3400 Haben CHF 800 — Aktivzunahme und Ertragszunahme.',
      },
      {
        feld: 'aufgaben',
        id: '3ec0784b-bb93-4b7d-a98f-166fb659da9a-1',
        text: 'Energieaufwand 6400 Soll CHF 450 / Kreditoren 2000 Haben CHF 450 — Aufwandzunahme und Schuldenzunahme.',
      },
    ],
  },
  {
    id: 'einr-kb-einfach',
    fachbereich: 'BWL',
    musterlosung:
      'Konten werden nach vier Typen klassifiziert: Aktiven (Vermögen, links der Bilanz), Passiven (Schulden/EK, rechts der Bilanz), Aufwand und Ertrag (Erfolgsrechnung). Kasse 1000 ist ein Aktivkonto — sie hält liquide Mittel. Mietaufwand 6000 ist ein Aufwandkonto — er schmälert den Erfolg.',
    teilerklaerungen: [
      {
        feld: 'aufgaben',
        id: 'kb-kasse',
        text: 'Kasse ist ein Aktivkonto — sie steht auf der Aktivseite der Bilanz und wächst im Soll.',
      },
      {
        feld: 'aufgaben',
        id: 'kb-miete',
        text: 'Mietaufwand ist ein Aufwandkonto der Erfolgsrechnung — Zunahmen werden im Soll gebucht.',
      },
    ],
  },

  // --- BWL — MC (2) ---
  {
    id: '15e63162-a272-49cb-a7b6-0e33dbffdb58',
    fachbereich: 'BWL',
    musterlosung:
      'Die SWOT-Matrix kombiniert interne Stärken/Schwächen mit externen Chancen/Gefahren. Die gefährlichste Konstellation ist W–T: Schwächen treffen auf Gefahren. Das Unternehmen ist intern anfällig und gleichzeitig externen Bedrohungen ausgesetzt. Ohne Gegensteuer drohen ernste Probleme — die defensive Strategie (verminden, vermeiden, weichen) ist gefragt.',
    teilerklaerungen: [
      {
        feld: 'optionen',
        id: 'opt-0',
        text: 'Schwächen-Chancen (W–O) sind kritisch, aber auch eine Lernchance — die Schwäche kann behoben werden.',
      },
      {
        feld: 'optionen',
        id: 'opt-1',
        text: 'Korrekt: W–T kombiniert interne Anfälligkeit mit externer Bedrohung — die riskanteste Lage.',
      },
      {
        feld: 'optionen',
        id: 'opt-2',
        text: 'Stärken-Chancen (S–O) sind die günstigste Konstellation — das Unternehmen kann expandieren.',
      },
      {
        feld: 'optionen',
        id: 'opt-3',
        text: 'Stärken-Gefahren (S–T) ist problematisch, aber nicht am gefährlichsten — Stärken können Gefahren oft abfedern.',
      },
    ],
  },
  {
    id: '58974847-00a7-44ff-a636-f2cf1885eaa7',
    fachbereich: 'BWL',
    musterlosung:
      'Die Buchhaltungsregel lautet: Aktivkonten und Aufwandkonten nehmen im Soll (links) zu, Passivkonten und Ertragskonten im Haben (rechts). Das folgt aus der Bilanzstruktur (Aktiven links, Passiven rechts) und der Logik der Erfolgsrechnung. Zunahmen im Haben: Passiv- und Ertragskonten.',
    teilerklaerungen: [
      {
        feld: 'optionen',
        id: 'opt-0',
        text: 'Aktivkonten nehmen im Soll zu — im Haben werden sie abgebaut (zum Beispiel Kassaabnahme).',
      },
      {
        feld: 'optionen',
        id: 'opt-1',
        text: 'Korrekt: Passivkonten (Schulden, Eigenkapital) nehmen im Haben zu — rechts in der Bilanz.',
      },
      {
        feld: 'optionen',
        id: 'opt-2',
        text: 'Aufwandkonten nehmen im Soll zu — sie gleichen strukturell den Aktivkonten.',
      },
      {
        feld: 'optionen',
        id: 'opt-3',
        text: 'Korrekt: Ertragskonten nehmen im Haben zu — sie gleichen strukturell den Passivkonten.',
      },
    ],
  },

  // --- BWL — T-Konto (1) — keine teilerklaerungen-Struktur ---
  {
    id: 'bd40adcc-3062-40e0-b8d3-5271f2481ac6',
    fachbereich: 'BWL',
    musterlosung:
      'Das Konto 1100 Forderungen aus Lieferungen und Leistungen startet mit einem Anfangsbestand von CHF 3\'000 im Soll. Kreditverkäufe erhöhen es um CHF 8\'000 (Soll, gegen Warenertrag). Zahlungseingänge von CHF 5\'500 und ein Verlust von CHF 500 reduzieren es im Haben. Der Saldo beträgt CHF 5\'000 auf der Soll-Seite — offene Kundenforderungen.',
    teilerklaerungen: [],
  },
]

// Schreibe JSONL
const lines = updates.map((u) => JSON.stringify(u)).join('\n') + '\n'
await fs.writeFile(OUT, lines)

// Update state.json
const state = JSON.parse(await fs.readFile(STATE, 'utf8'))
state.letzteSession = new Date().toISOString()
state.verarbeitet = updates.length
state.fragen = state.fragen || {}
for (const u of updates) {
  state.fragen[u.id] = {
    status: 'done',
    zeitpunkt: state.letzteSession,
    teile: u.teilerklaerungen.length,
  }
}
await fs.writeFile(STATE, JSON.stringify(state, null, 2))

console.log(`[generate] ${updates.length} Updates nach ${OUT} geschrieben`)
console.log(`[generate] state.json aktualisiert — verarbeitet=${state.verarbeitet}`)

// Validierung
console.log('\n[validate]')
const byFb = {}
for (const u of updates) {
  byFb[u.fachbereich] = (byFb[u.fachbereich] || 0) + 1
}
console.log('Pro Fachbereich:', byFb)
const withTeile = updates.filter((u) => u.teilerklaerungen.length > 0).length
console.log(`Mit Teilerklärungen: ${withTeile}/${updates.length}`)
const totalTeile = updates.reduce((s, u) => s + u.teilerklaerungen.length, 0)
console.log(`Total Teilerklärungen: ${totalTeile}`)
