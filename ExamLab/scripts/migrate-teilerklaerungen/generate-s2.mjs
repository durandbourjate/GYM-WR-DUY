#!/usr/bin/env node
/**
 * Session 2: 100 Recht-Fragen (aufgabengruppe 1, berechnung 3, bildbeschriftung 11,
 * code 1, dragdrop_bild 10, freitext 1, hotspot 1, lueckentext 72).
 * Appendet an fragen-updates.jsonl. Updated state.json.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  // === Recht / aufgabengruppe (1) ===
  {
    id: 'einr-ag-material',
    fachbereich: 'Recht',
    musterlosung:
      'Die Aufgabengruppe besteht aus zwei Teilaufgaben (a und b), die thematisch verbunden sind. Die Lernenden arbeiten beide Aufgaben nacheinander ab und nutzen dabei das begleitende Materialpanel. Jede Teilaufgabe wird einzeln bewertet.',
    teilerklaerungen: [],
  },

  // === Recht / berechnung (3) — keine teilerklaerungen ===
  {
    id: '0463d28f-ec67-4183-a04e-52a6a9b74c05',
    fachbereich: 'Recht',
    musterlosung:
      'Bei Mietschäden wird der Kostenanteil nach der Zeitwert-Formel berechnet: (Restlebensdauer ÷ Gesamtlebensdauer) × Neuwert. Der Teppichboden hat eine Lebensdauer von 10 Jahren, der Mieter hat 4 Jahre gewohnt — Restlebensdauer 6 Jahre. Kostenanteil: 6/10 × CHF 5\'000 = CHF 3\'000.',
    teilerklaerungen: [],
  },
  {
    id: '3a1aaf26-f50c-4210-b5e3-66e8f96edea8',
    fachbereich: 'Recht',
    musterlosung:
      'Die Formel lautet: (Restlebensdauer ÷ Gesamtlebensdauer) × Neuwert. Der Parkettboden hat eine Gesamtlebensdauer von 40 Jahren, ist 30 Jahre alt — Restlebensdauer 10 Jahre. Sandra muss den Wert der ungenutzten Restlebensdauer tragen: 10/40 × CHF 6\'000 = CHF 1\'500.',
    teilerklaerungen: [],
  },
  {
    id: '98df2352-9691-4b1a-a25d-3f0f781e5ec1',
    fachbereich: 'Recht',
    musterlosung:
      'Der Anteil berechnet sich nach (Restlebensdauer ÷ Gesamtlebensdauer) × Neuwert. Der Anstrich hat eine Lebensdauer von 8 Jahren, das Mieterpaar hat 5 Jahre gewohnt — Restlebensdauer 3 Jahre. Ihr Anteil: 3/8 × CHF 4\'000 = CHF 1\'500. Normale Abnutzung während der Mietdauer zahlt der Mieter nicht.',
    teilerklaerungen: [],
  },

  // === Recht / bildbeschriftung (11) ===
  {
    id: '1bbe000a-f0a0-4c87-af11-eeacd9787a14',
    fachbereich: 'Recht',
    musterlosung:
      'Das Arbeitsrecht gliedert sich in drei Ebenen: individuell (Einzelarbeitsvertrag nach OR 319 ff.), kollektiv (GAV zwischen Sozialpartnern, NAV vom Staat) und öffentlich-rechtlich (ArG, UVG zum Schutz der Arbeitnehmenden). Jede Ebene hat ihre eigenen Rechtsinstrumente und Zuständigkeiten.',
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: 'Einzelarbeitsvertrag regelt das konkrete AG-AN-Verhältnis nach OR 319 ff.' },
      { feld: 'beschriftungen', id: 'l2', text: 'GAV (Gesamtarbeitsvertrag) wird zwischen Sozialpartnern abgeschlossen und rahmt Einzelverträge.' },
      { feld: 'beschriftungen', id: 'l3', text: 'NAV wird vom Staat für Branchen ohne GAV erlassen, v.a. bei Schutzbedarf.' },
      { feld: 'beschriftungen', id: 'l4', text: 'Das Arbeitsgesetz regelt Arbeitszeit, Pausen, Nacht- und Jugendarbeit zum Schutz der AN.' },
      { feld: 'beschriftungen', id: 'l5', text: 'Das UVG regelt die obligatorische Unfallversicherung für Berufs- und Nichtberufsunfälle.' },
    ],
  },
  {
    id: '420005c0-2a68-4064-82c7-a3c242ff5d45',
    fachbereich: 'Recht',
    musterlosung:
      'Ein Vertrag entsteht durch zwei übereinstimmende Willensäusserungen: Antrag (Offerte) und Annahme (Akzept) führen zum Konsens (OR 1). Für die Gültigkeit braucht es zusätzlich Handlungsfähigkeit beider Parteien und einen erlaubten, formgerechten Inhalt (OR 19/20). Fehlt eine Voraussetzung, ist der Vertrag nichtig oder anfechtbar.',
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: 'Der Antrag ist die erste Willensäusserung — ein bindendes Angebot mit allen wesentlichen Punkten.' },
      { feld: 'beschriftungen', id: 'l2', text: 'Die Annahme ist die zustimmende Antwort auf den Antrag — damit ist der Konsens erreicht.' },
      { feld: 'beschriftungen', id: 'l3', text: 'Konsens heisst Übereinstimmung beider Willenserklärungen — der Vertrag ist geschlossen.' },
      { feld: 'beschriftungen', id: 'l4', text: 'Beide Parteien müssen handlungsfähig sein (urteilsfähig + mündig, Art. 12 ZGB).' },
      { feld: 'beschriftungen', id: 'l5', text: 'Der Inhalt muss erlaubt und formgerecht sein — sonst Nichtigkeit nach OR 19/20.' },
    ],
  },
  {
    id: '4dffab2c-cd7e-48dd-bc1e-4cf575d53be3',
    fachbereich: 'Recht',
    musterlosung:
      'Der Schweizer Instanzenzug im Zivilprozess hat drei Stufen: erste Instanz (Bezirks- oder Regionalgericht), zweite Instanz (Obergericht oder Kantonsgericht, Zugang via Berufung oder Beschwerde) und Bundesgericht in Lausanne (Zugang via Beschwerde in Zivil- oder Strafsachen). Das Bundesgericht prüft primär Rechtsfragen, nicht den Sachverhalt.',
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: 'Die erste Instanz entscheidet über Sachverhalt und Rechtsfragen — Beweise werden hier erhoben.' },
      { feld: 'beschriftungen', id: 'l2', text: 'Berufung oder Beschwerde führen zur zweiten Instanz — erneute Überprüfung ist möglich.' },
      { feld: 'beschriftungen', id: 'l3', text: 'Das Obergericht prüft den Fall als kantonale Berufungsinstanz.' },
      { feld: 'beschriftungen', id: 'l4', text: 'Die Beschwerde in Zivil- oder Strafsachen öffnet den Weg zum Bundesgericht.' },
      { feld: 'beschriftungen', id: 'l5', text: 'Das Bundesgericht in Lausanne ist letzte innerstaatliche Instanz und prüft primär Rechtsfragen.' },
    ],
  },
  {
    id: '59b8e51b-1401-4e6b-b2f3-74856cbbb7d5',
    fachbereich: 'Recht',
    musterlosung:
      'Der Mietvertrag (OR 253) verpflichtet den Vermieter zur Gebrauchsüberlassung und den Mieter zur Mietzinszahlung. Bei Mängeln stehen dem Mieter Mängelrechte zu (Herabsetzung, Hinterlegung, Kündigung, Art. 259a ff. OR). Die Kündigung braucht Formvorschriften; bei Wohnungen ist eine Erstreckung möglich (OR 272).',
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: 'Der Mietvertrag ist in OR 253 ff. geregelt — Grundlage aller mietrechtlichen Fragen.' },
      { feld: 'beschriftungen', id: 'l2', text: 'Der Vermieter muss die Sache gebrauchstauglich übergeben und im vertragsgemässen Zustand erhalten.' },
      { feld: 'beschriftungen', id: 'l3', text: 'Der Mieter muss den Mietzins pünktlich bezahlen und die Sache sorgfältig nutzen.' },
      { feld: 'beschriftungen', id: 'l4', text: 'Mängelrechte nach OR 259a–i: Herabsetzung, Hinterlegung und fristlose Kündigung bei schweren Mängeln.' },
      { feld: 'beschriftungen', id: 'l5', text: 'Formvorschriften bei Kündigung (OR 266l); Erstreckung schützt Wohnungsmieter vor Härten.' },
    ],
  },
  {
    id: '631c2211-1ce7-4928-9c74-7bd2a1e152ed',
    fachbereich: 'Recht',
    musterlosung:
      'Die Rechtsanwendung durch Subsumtion folgt vier Schritten: Obersatz (Rechtsnorm mit ihren Tatbestandsmerkmalen), Untersatz (konkreter Sachverhalt), Subsumtion (prüfen, ob der Sachverhalt die Merkmale erfüllt) und Schlussfolgerung (Rechtsfolge anwenden). Dieses Schema strukturiert jede juristische Falllösung.',
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: 'Der Obersatz nennt die anzuwendende Rechtsnorm und ihre Tatbestandsmerkmale.' },
      { feld: 'beschriftungen', id: 'l2', text: 'Der Untersatz fasst den konkreten Sachverhalt präzise zusammen.' },
      { feld: 'beschriftungen', id: 'l3', text: 'Die Subsumtion prüft jedes Merkmal der Norm am Sachverhalt.' },
      { feld: 'beschriftungen', id: 'l4', text: 'Die Schlussfolgerung zieht die Rechtsfolge aus der Subsumtion.' },
    ],
  },
  {
    id: '8378eace-e556-485e-83c6-347eb348a59c',
    fachbereich: 'Recht',
    musterlosung:
      'Die Normenpyramide ordnet Rechtsnormen hierarchisch: Bundesverfassung (oberste Norm) → Bundesgesetze (OR, StGB) → Verordnungen (Bundesrat) → kantonales Recht → Gemeinderecht. Untere Normen dürfen oberen nicht widersprechen («lex superior derogat legi inferiori»). Bundesrecht bricht kantonales Recht (Art. 49 BV).',
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: 'Die Bundesverfassung ist die oberste Norm — sie bindet Gesetzgeber, Exekutive und Gerichte.' },
      { feld: 'beschriftungen', id: 'l2', text: 'Bundesgesetze wie OR oder StGB werden vom Parlament erlassen und müssen verfassungskonform sein.' },
      { feld: 'beschriftungen', id: 'l3', text: 'Verordnungen erlässt der Bundesrat zur Konkretisierung von Gesetzen — niemals gegen sie.' },
      { feld: 'beschriftungen', id: 'l4', text: 'Kantonales Recht gilt nur soweit, als Bundesrecht nicht abschliessend regelt (Art. 49 BV).' },
      { feld: 'beschriftungen', id: 'l5', text: 'Gemeinderecht ist die unterste Stufe und muss mit übergeordnetem Recht vereinbar sein.' },
    ],
  },
  {
    id: '8b251a6c-b3f1-4542-9fcb-2475e7f4e9f5',
    fachbereich: 'Recht',
    musterlosung:
      'Eine Straftat wird in drei Stufen geprüft: Tatbestandsmässigkeit (objektiver und subjektiver Tatbestand), Rechtswidrigkeit (keine Rechtfertigungsgründe wie Notwehr) und Schuld (Schuldfähigkeit, keine Entschuldigung). Nur wenn alle drei Stufen bejaht werden, ist die Tat strafbar. Fehlt eine Stufe, ist kein Schuldspruch möglich.',
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: 'Tatbestandsmässigkeit: Der Sachverhalt erfüllt den gesetzlichen Straftatbestand vollständig.' },
      { feld: 'beschriftungen', id: 'l2', text: 'Objektiver Tatbestand: Handlung, Erfolg und Kausalzusammenhang zwischen beiden.' },
      { feld: 'beschriftungen', id: 'l3', text: 'Subjektiver Tatbestand: Vorsatz oder Fahrlässigkeit (Art. 12 StGB).' },
      { feld: 'beschriftungen', id: 'l4', text: 'Rechtswidrigkeit: Keine Rechtfertigung (Notwehr Art. 15, Notstand Art. 17) greift.' },
      { feld: 'beschriftungen', id: 'l5', text: 'Schuld: Der Täter ist schuldfähig (Art. 19) und hat keinen Entschuldigungsgrund.' },
    ],
  },
  {
    id: '9483314e-201e-4437-a8dc-1d5453d117b8',
    fachbereich: 'Recht',
    musterlosung:
      'Die Handlungsfähigkeit setzt Urteilsfähigkeit und Mündigkeit voraus (Art. 12–14 ZGB). Wer unter 18, aber urteilsfähig ist, ist beschränkt handlungsfähig (Art. 19 ZGB) — braucht Zustimmung der gesetzlichen Vertretung. Wer urteilsunfähig ist (Kleinkind, schwere geistige Beeinträchtigung), ist handlungsunfähig (Art. 16 ZGB).',
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: 'Handlungsfähigkeit heisst rechtsgültig handeln können — Verträge schliessen, Verpflichtungen eingehen.' },
      { feld: 'beschriftungen', id: 'l2', text: 'Sie setzt zwei Voraussetzungen voraus: Urteilsfähigkeit und Mündigkeit (ab 18).' },
      { feld: 'beschriftungen', id: 'l3', text: 'Beschränkt handlungsfähig ist, wer urteilsfähig, aber noch nicht mündig ist.' },
      { feld: 'beschriftungen', id: 'l4', text: 'Urteilsfähig, aber unter 18 Jahren — Geschäfte sind mit Zustimmung der Eltern möglich.' },
      { feld: 'beschriftungen', id: 'l5', text: 'Handlungsunfähigkeit bedeutet, dass die Person nicht rechtsgültig handeln kann.' },
      { feld: 'beschriftungen', id: 'l6', text: 'Urteilsunfähig sind z.B. Kleinkinder — Rechtsgeschäfte laufen über den gesetzlichen Vertreter.' },
    ],
  },
  {
    id: 'einr-bb-zelle',
    fachbereich: 'Recht',
    musterlosung:
      'Die tierische Zelle besteht aus drei zentralen Bestandteilen: Der Zellkern (Nukleus) enthält die DNA und steuert die Zellfunktionen. Die Zellmembran grenzt die Zelle ab und regelt den Stoffaustausch. Mitochondrien sind die «Kraftwerke» — sie erzeugen durch Zellatmung die Energieform ATP.',
    teilerklaerungen: [
      { feld: 'beschriftungen', id: '1', text: 'Der Zellkern enthält die DNA und steuert sämtliche Zellaktivitäten.' },
      { feld: 'beschriftungen', id: '2', text: 'Die Zellmembran grenzt die Zelle ab und regelt den Stoffaustausch mit der Umgebung.' },
      { feld: 'beschriftungen', id: '3', text: 'Mitochondrien erzeugen durch Zellatmung ATP — die Energieform der Zelle.' },
    ],
  },
  {
    id: 'f2cfe525-34cc-4ce8-8dd3-2963f480451b',
    fachbereich: 'Recht',
    musterlosung:
      'Das Sachenrecht unterscheidet Eigentum (umfassendstes dingliches Recht, Art. 641 ZGB) von Besitz (tatsächliche Sachherrschaft, Art. 919 ZGB). Daneben gibt es drei beschränkte dingliche Rechte: Grundpfand (z.B. Hypothek, Art. 793 ZGB), Dienstbarkeiten (z.B. Wegrecht, Art. 730 ZGB) und Fahrnispfand (Art. 884 ZGB).',
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: 'Eigentum ist das umfassendste dingliche Recht — der Eigentümer verfügt nach Belieben.' },
      { feld: 'beschriftungen', id: 'l2', text: 'Besitz ist die tatsächliche Herrschaft — kein Recht, sondern ein Sachverhalt.' },
      { feld: 'beschriftungen', id: 'l3', text: 'Grundpfandrechte sichern Forderungen durch Grundstücke — Hypothek oder Schuldbrief.' },
      { feld: 'beschriftungen', id: 'l4', text: 'Dienstbarkeiten belasten ein Grundstück zugunsten eines anderen, z.B. Wegrecht.' },
      { feld: 'beschriftungen', id: 'l5', text: 'Fahrnispfand sichert Forderungen durch bewegliche Sachen (Faustpfand).' },
    ],
  },
  {
    id: 'ff24a7d6-718c-49eb-8888-6751931d461c',
    fachbereich: 'Recht',
    musterlosung:
      'Ein Grundrechtseingriff wird nach Art. 36 BV geprüft: Schutzbereich (ist das Recht betroffen?), Eingriff (liegt eine staatliche Beeinträchtigung vor?), Rechtfertigung (gesetzliche Grundlage, öffentliches Interesse, Verhältnismässigkeit) und Kerngehalt (unantastbar). Fehlt eine Voraussetzung, ist der Eingriff verfassungswidrig.',
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: 'Der Schutzbereich ist der persönlich und sachlich geschützte Kern des Grundrechts.' },
      { feld: 'beschriftungen', id: 'l2', text: 'Ein Eingriff ist jede staatliche Massnahme, die den Schutzbereich beeinträchtigt.' },
      { feld: 'beschriftungen', id: 'l3', text: 'Jede Einschränkung braucht eine gesetzliche Grundlage (Art. 36 Abs. 1 BV).' },
      { feld: 'beschriftungen', id: 'l4', text: 'Das öffentliche Interesse rechtfertigt den Eingriff — rein private Interessen genügen nicht.' },
      { feld: 'beschriftungen', id: 'l5', text: 'Verhältnismässigkeit: geeignet, erforderlich und zumutbar (Art. 36 Abs. 3 BV).' },
      { feld: 'beschriftungen', id: 'l6', text: 'Der Kerngehalt ist unantastbar — auch der Gesetzgeber darf ihn nicht antasten.' },
    ],
  },

  // === Recht / code (1) — keine teilerklaerungen ===
  {
    id: 'einr-code-python',
    fachbereich: 'Recht',
    musterlosung:
      'Eine effiziente Primzahlprüfung muss nur bis zur Wurzel von n suchen: Hat n einen Teiler grösser als √n, hat es auch einen kleineren. Werte unter 2 sind keine Primzahlen. Die Schleife prüft von 2 bis int(n**0.5) + 1 — findet sie einen Teiler, ist n keine Primzahl.',
    teilerklaerungen: [],
  },

  // === Recht / dragdrop_bild (10) ===
  {
    id: '0cea29a9-c35e-4a98-bc96-9faf787eede8',
    fachbereich: 'Recht',
    musterlosung:
      'Die Normenpyramide ordnet Rechtsnormen in drei Hauptstufen: Verfassung (z.B. Art. 8 BV), Gesetze (OR, StGB, ZGB vom Parlament erlassen) und Verordnungen (vom Bundesrat zur Konkretisierung, wie COVID-VO). Jede untere Stufe muss mit der oberen vereinbar sein.',
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'verfassung', text: 'Art. 8 BV (Rechtsgleichheit) steht als Verfassungsnorm an der Spitze der Normenpyramide.' },
      { feld: 'zielzonen', id: 'gesetz', text: 'Das OR regelt das Vertragsrecht — vom Parlament erlassen, also Gesetzesstufe.' },
      { feld: 'zielzonen', id: 'verordnung', text: 'Die COVID-Verordnung wurde vom Bundesrat erlassen und konkretisiert bestehende Gesetze.' },
    ],
  },
  {
    id: '1011bbcc-0719-438f-b30e-47828aaeb8e2',
    fachbereich: 'Recht',
    musterlosung:
      'Der Persönlichkeitsschutz (Art. 28 ZGB) kennt drei Sphären mit abgestuftem Schutz: Geheimsphäre (stärkster Schutz, z.B. Tagebuch, Arzt-Patient), Privatsphäre (mittlerer Schutz, z.B. Familie, Wohnung) und öffentliche Sphäre (geringster Schutz, z.B. Beruf, politisches Engagement).',
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'geheim', text: 'Tagebucheinträge gehören zur Geheimsphäre — stärkster Schutz, nur der Betroffene hat Zugriff.' },
      { feld: 'zielzonen', id: 'privat', text: 'Das Familienleben gehört zur Privatsphäre — Schutz vor neugierigen Blicken Dritter.' },
      { feld: 'zielzonen', id: 'oeffentlich', text: 'Die berufliche Tätigkeit spielt sich in der Öffentlichkeit ab — geringster Schutz.' },
    ],
  },
  {
    id: '13c252a1-1c7e-40d8-a3bf-ced5106aae87',
    fachbereich: 'Recht',
    musterlosung:
      'Der Eigentumserwerb wird in originären (ursprünglichen) und derivativen (abgeleiteten) Erwerb unterteilt. Originär: Aneignung herrenloser Sachen, Fund, Ersitzung, Verarbeitung. Derivativ: Kauf, Schenkung, Erbschaft, Tausch — das Eigentum wird vom bisherigen Eigentümer übertragen.',
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'originar', text: 'Der Fund (Art. 720 ZGB) ist originärer Erwerb — Eigentum entsteht neu am Fundstück.' },
      { feld: 'zielzonen', id: 'derivativ', text: 'Der Kauf (Art. 714 ZGB) ist derivativer Erwerb — das Eigentum wird vom Verkäufer abgeleitet.' },
    ],
  },
  {
    id: '1633deb5-2557-4474-a6f2-b9b814b233c7',
    fachbereich: 'Recht',
    musterlosung:
      'Das Strafrecht kennt drei Sanktionsarten: Strafen (vergeltend, z.B. Freiheits- oder Geldstrafe), Massnahmen (sichernd oder therapeutisch, z.B. stationäre Therapie oder Verwahrung) und Nebenfolgen (z.B. Berufsverbot, Landesverweisung). Strafen und Massnahmen können kombiniert werden.',
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'strafen', text: 'Die Freiheitsstrafe (Art. 40 StGB) ist klassische Strafe — Vergeltung der Tat.' },
      { feld: 'zielzonen', id: 'massnahmen', text: 'Die therapeutische Massnahme (Art. 59) will den Täter behandeln, nicht primär bestrafen.' },
      { feld: 'zielzonen', id: 'nebenfolgen', text: 'Das Berufsverbot (Art. 67) ergänzt die Hauptstrafe und schützt vor weiteren Taten im Beruf.' },
    ],
  },
  {
    id: '27beb27c-1c71-4bc2-ab58-3fca4f09dc0c',
    fachbereich: 'Recht',
    musterlosung:
      'Die Kündigungsfristen im Arbeitsvertrag steigen mit der Anstellungsdauer (OR 335b/c): Probezeit (max. 3 Monate) — 7 Tage jederzeit; im 1. Dienstjahr — 1 Monat auf Monatsende; ab 2. bis 9. Dienstjahr — 2 Monate; ab 10. Dienstjahr — 3 Monate. Längere Fristen sind vertraglich zulässig.',
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'probezeit', text: 'In der Probezeit gilt die kurze 7-Tage-Frist (OR 335b I) — jederzeit kündbar.' },
      { feld: 'zielzonen', id: 'jahr1', text: 'Im 1. Dienstjahr: 1 Monat Frist auf Monatsende — nach der Probezeit.' },
      { feld: 'zielzonen', id: 'ab2', text: 'Ab dem 2. bis 9. Dienstjahr: 2 Monate Frist auf Monatsende.' },
    ],
  },
  {
    id: '488b0d5c-78c3-48ab-82e9-2eda3db6dd5c',
    fachbereich: 'Recht',
    musterlosung:
      'Vertragsstörungen lassen sich in drei Kategorien einteilen: Leistungsstörungen (Verzug, Mangel, Unmöglichkeit nach OR 97 ff.), Willensmängel (Irrtum, Täuschung, Furchterregung nach OR 23–31 — Vertrag anfechtbar) und Formfehler (fehlende vorgeschriebene Form nach OR 11 — Nichtigkeit).',
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'leistung', text: 'Der Schuldnerverzug (OR 102 ff.) ist eine Leistungsstörung nach Vertragsschluss.' },
      { feld: 'zielzonen', id: 'willen', text: 'Ein Irrtum (Art. 23 OR) bei Vertragsschluss ist ein Willensmangel — der Vertrag ist anfechtbar.' },
      { feld: 'zielzonen', id: 'form', text: 'Fehlt die vorgeschriebene Schriftform, ist der Vertrag nach OR 11 nichtig.' },
    ],
  },
  {
    id: '4b79304d-bb99-4057-a721-9b2684352f3f',
    fachbereich: 'Recht',
    musterlosung:
      'Im Mietvertrag hat der Vermieter die Pflicht zur Gebrauchsüberlassung (OR 256), zur Mängelbehebung (OR 259a) und zur korrekten Nebenkostenabrechnung (OR 257a). Der Mieter muss den Mietzins pünktlich zahlen, die Sache sorgfältig nutzen (OR 257f) und kleine Unterhaltskosten selbst tragen.',
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'vermieter', text: 'Gebrauchsüberlassung ist die Hauptpflicht des Vermieters — Sache im vertragsgemässen Zustand.' },
      { feld: 'zielzonen', id: 'mieter', text: 'Pünktliche Mietzinszahlung ist die Hauptpflicht des Mieters — Verzug führt zu Kündigung.' },
    ],
  },
  {
    id: '701fb8d2-19fe-4d93-8c37-90febabba782',
    fachbereich: 'Recht',
    musterlosung:
      'Die Grundrechte gliedern sich in drei Kategorien: Freiheitsrechte (Abwehrrechte gegen den Staat, z.B. Meinungs- und Religionsfreiheit), Gleichheitsrechte (Art. 8 BV: Gleichbehandlung vor dem Gesetz) und soziale Grundrechte (Leistungsansprüche an den Staat, z.B. Art. 12, 19 BV).',
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'freiheit', text: 'Die Meinungsfreiheit (Art. 16 BV) schützt vor staatlichen Eingriffen — klassisches Abwehrrecht.' },
      { feld: 'zielzonen', id: 'gleichheit', text: 'Rechtsgleichheit (Art. 8 BV) garantiert gleiche Behandlung vor dem Gesetz.' },
      { feld: 'zielzonen', id: 'sozial', text: 'Das Recht auf Grundschulunterricht (Art. 19 BV) ist ein Leistungsanspruch an den Staat.' },
    ],
  },
  {
    id: 'd98a4c5e-1424-4440-bd7a-4852b38e6673',
    fachbereich: 'Recht',
    musterlosung:
      'Das Recht wird in öffentliches Recht (Staat-Bürger-Verhältnis — Verfassung, Verwaltung, Strafrecht, Steuern) und Privatrecht (Bürger-Bürger-Verhältnis — OR, ZGB inkl. Sachen-, Familien-, Erbrecht) unterteilt. Im öffentlichen Recht herrscht Über-/Unterordnung, im Privatrecht Gleichstellung.',
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'oeffentlich', text: 'Verfassungsrecht regelt Staatsaufbau und Grundrechte — klassisches öffentliches Recht.' },
      { feld: 'zielzonen', id: 'privat', text: 'Das Obligationenrecht regelt Verträge und Schuldverhältnisse zwischen Privaten.' },
    ],
  },
  {
    id: 'daff157c-0f00-45a9-8021-88a3b61a63df',
    fachbereich: 'Recht',
    musterlosung:
      'Zivil- und Strafprozess unterscheiden sich fundamental. Zivilprozess: Kläger gegen Beklagter, Parteien bestimmen den Streitgegenstand (Dispositionsmaxime) und tragen die Kosten. Strafprozess: Staatsanwaltschaft gegen Beschuldigter, Offizialprinzip (Staat muss verfolgen), Untersuchungsgrundsatz, Unschuldsvermutung.',
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'zivil', text: 'Im Zivilprozess treten Kläger und Beklagter auf Augenhöhe vor Gericht auf.' },
      { feld: 'zielzonen', id: 'straf', text: 'Im Strafprozess klagt der Staat durch die Staatsanwaltschaft gegen den Beschuldigten.' },
    ],
  },

  // === Recht / freitext (1) — keine teilerklaerungen ===
  {
    id: 'einr-ag-material-freitext',
    fachbereich: 'Recht',
    musterlosung:
      'Eine gute Antwort wählt einen konkreten Witz aus dem Materialpanel und formuliert ihn sinngemäss neu, ohne die Pointe zu verlieren. Wortlaut und Reihenfolge dürfen variieren. Die Herausforderung ist, den Humor zu erhalten — das Umformulieren darf nicht nur die Wörter ersetzen.',
    teilerklaerungen: [],
  },

  // === Recht / hotspot (1) ===
  {
    id: '27bc1e98-8957-4083-8bb2-877ab4b15d42',
    fachbereich: 'Recht',
    musterlosung:
      'Das Bundesgericht in Lausanne ist die letzte innerstaatliche Instanz der Schweiz. Es prüft primär Rechtsfragen — den Sachverhalt stellt es nur eingeschränkt fest. Nach dem Bundesgericht bleibt nur noch der EGMR in Strassburg — aber nur für EMRK-Fragen, nicht für innerstaatliche Entscheide.',
    teilerklaerungen: [
      { feld: 'bereiche', id: 'b_yrbsygr6', text: 'Das Bezirksgericht ist erste Instanz — weitere Instanzen können darauf folgen.' },
      { feld: 'bereiche', id: 'b_68o2gv0b', text: 'Das Obergericht ist Zwischeninstanz — das Bundesgericht kommt später.' },
      { feld: 'bereiche', id: 'b_48c98fzo', text: 'Korrekt: Das Bundesgericht in Lausanne ist die letzte innerstaatliche Instanz.' },
      { feld: 'bereiche', id: 'b_i26qqic1', text: 'Der EGMR ist international und kein innerstaatliches Gericht — er prüft nur EMRK-Verletzungen.' },
    ],
  },

  // === Recht / lueckentext (72) ===
  {
    id: '0397067f-eb66-4663-a1a3-2b959ec4afdc',
    fachbereich: 'Recht',
    musterlosung:
      'Rechtssubjekte — also Träger von Rechten und Pflichten — gibt es in zwei Arten: natürliche Personen (alle Menschen von Geburt bis Tod) und juristische Personen (rechtliche Gebilde wie AG, GmbH, Verein, Stiftung). Beide können klagen, Verträge schliessen und Eigentum halten.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Natürliche Personen sind alle Menschen — Rechtsfähigkeit ab Geburt (Art. 11 ZGB).' },
      { feld: 'luecken', id: 'luecke-1', text: 'Juristische Personen sind rechtliche Gebilde wie AG, GmbH, Verein oder Stiftung.' },
    ],
  },
  {
    id: '04c5a33d-4bfd-4dd0-8384-63244136f807',
    fachbereich: 'Recht',
    musterlosung:
      'Nach OR 321a Abs. 4 muss der Arbeitnehmende Geschäfts- und Betriebsgeheimnisse des Arbeitgebers wahren — auch nach Beendigung des Arbeitsverhältnisses. Diese Geheimhaltungspflicht schützt die wirtschaftlichen Interessen des Arbeitgebers und wirkt zeitlich unbeschränkt, solange das Geheimnis besteht.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Geschäfts- und Betriebsgeheimnisse sind nach OR 321a Abs. 4 auch nach Kündigung geschützt.' },
    ],
  },
  {
    id: '06cd83bb-30e5-433a-9c9c-a0bc27f53071',
    fachbereich: 'Recht',
    musterlosung:
      'Bei der Gefährdungshaftung kann sich der Halter nur durch drei Gründe entlasten: grobes Verschulden eines Dritten, höhere Gewalt (Naturereignis) oder grobes Eigenverschulden des Geschädigten. Diese Unterbrechungsgründe durchbrechen den adäquaten Kausalzusammenhang zwischen der gefährlichen Sache und dem Schaden.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Grobes Drittverschulden unterbricht den Kausalzusammenhang — der Halter ist entlastet.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Grobes Eigenverschulden des Geschädigten durchbricht ebenfalls den Kausalzusammenhang.' },
    ],
  },
  {
    id: '0711d35e-c6b7-4c23-80be-68aa6b7aa0f9',
    fachbereich: 'Recht',
    musterlosung:
      'Die gesetzliche Kündigungsfrist für Wohnungen beträgt nach Art. 266c OR drei Monate. Die Kündigung muss auf einen ortsüblichen Termin erfolgen — ohne Ortsgebrauch auf Ende einer dreimonatigen Mietdauer. Die Frist schützt den Mieter vor kurzfristigem Wohnungsverlust und ist zwingend.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Drei Monate gesetzliche Kündigungsfrist nach Art. 266c OR — zwingend für Wohnräume.' },
    ],
  },
  {
    id: '078f55a5-2481-4ac9-b635-3dbaf40f8c22',
    fachbereich: 'Recht',
    musterlosung:
      'Die übliche Nachtruhe dauert von 22 bis 6 Uhr — während dieser Zeit ist Lärmemission zu minimieren. An Werktagen gelten zusätzliche Ruhezeiten von 12 bis 13 Uhr und ab 20 Uhr. Diese Regeln sind oft in Hausordnungen verankert und beruhen auf dem nachbarrechtlichen Rücksichtnahmegebot.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Die Nachtruhe beginnt üblicherweise um 22 Uhr — ab dann ist Lärm zu vermeiden.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Die Nachtruhe endet morgens um 6 Uhr — danach ist übliche Tätigkeit wieder zulässig.' },
    ],
  },
  {
    id: '0938f323-03fa-4f60-bef4-9c847ede45ad',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 1 der Allgemeinen Erklärung der Menschenrechte (AEMR, 1948) lautet: «Alle Menschen sind frei und gleich an Würde und Rechten geboren.» Der Artikel ist programmatische Grundlage der ganzen Erklärung — Würde und Gleichheit sind die Kernwerte des modernen Menschenrechtsverständnisses.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Würde ist nach AEMR Art. 1 allen Menschen inhärent — unveräusserlich.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Rechte sind ebenfalls angeboren — alle Menschen sind gleich berechtigt.' },
    ],
  },
  {
    id: '0d1d0a10-f436-49e6-b5df-9c59683abf83',
    fachbereich: 'Recht',
    musterlosung:
      'Das Reugeld nach OR 158 Abs. 3 ist ein vertraglich vereinbartes Entgelt, das eine Partei bezahlt, um vom Vertrag zurückzutreten. Es unterscheidet sich von der Konventionalstrafe (OR 160) — diese ist Sanktion für Vertragsbruch, das Reugeld dagegen die vereinbarte Rücktrittsprämie.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Reugeld ist das vereinbarte Rücktrittsentgelt — die Partei kauft sich aus dem Vertrag frei.' },
    ],
  },
  {
    id: '0eb3d079-9674-4431-874c-7c4dded33a77',
    fachbereich: 'Recht',
    musterlosung:
      'Nach Art. 36 Abs. 1 BV darf der Staat Grundrechte nur auf einer gesetzlichen Grundlage einschränken. Die demokratische Legitimation durch den Gesetzgeber (Parlament) schützt die Bürgerinnen und Bürger vor willkürlichem Handeln der Verwaltung. Bei schweren Eingriffen braucht es sogar ein Gesetz im formellen Sinn.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Gesetzliche Grundlage heisst: Nur wenn ein Gesetz es vorsieht, darf der Staat eingreifen.' },
    ],
  },
  {
    id: '0f0b758a-e08d-4296-b29e-02cc4ac0fd83',
    fachbereich: 'Recht',
    musterlosung:
      'Pfandrechte unterteilen sich nach der Art der verpfändeten Sache: Fahrnispfand (oder Faustpfand, Art. 884 ff. ZGB) dient die bewegliche Sache als Sicherheit. Grundpfand (Art. 793 ff. ZGB) basiert auf einem Grundstück — es erscheint als Hypothek oder Schuldbrief.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Fahrnispfand oder Faustpfand: bewegliche Sache als Sicherheit (Art. 884 ZGB).' },
      { feld: 'luecken', id: 'luecke-1', text: 'Grundpfand: unbewegliche Sache (Grundstück) als Sicherheit — Hypothek oder Schuldbrief.' },
    ],
  },
  {
    id: '0fbaf6f6-4781-4419-ac4e-9de7a28c094b',
    fachbereich: 'Recht',
    musterlosung:
      'Nach Art. 934 ZGB kann der Eigentümer einer gestohlenen oder sonst wider Willen abhanden gekommenen Sache sie während fünf Jahren jedem Empfänger abfordern — auch dem gutgläubigen. Die Frist schützt langfristig den ursprünglichen Eigentümer, schränkt aber den gutgläubigen Erwerb ein.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Art. 934 ZGB regelt die Rückforderung abhanden gekommener Sachen vom gutgläubigen Empfänger.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Fünf Jahre Rückforderungsfrist — ab Abhandenkommen (Diebstahl, Verlust) beginnt die Frist.' },
    ],
  },
  {
    id: '1541512c-a85d-4021-9010-b943dedf3e91',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 641 ZGB definiert Eigentum als das umfassendste dingliche Recht: Der Eigentümer kann in den Schranken der Rechtsordnung frei über die Sache verfügen. Art. 919 ZGB definiert Besitz als die tatsächliche Gewalt über eine Sache — ein blosser Sachverhalt, kein Recht, aber rechtlich relevant.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Art. 641 ZGB definiert das Eigentum als umfassendstes dingliches Recht.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Art. 919 ZGB definiert den Besitz als tatsächliche Sachherrschaft.' },
    ],
  },
  {
    id: '18c6b713-409a-4618-b18f-232041a750db',
    fachbereich: 'Recht',
    musterlosung:
      'Die Kondiktion (Rückforderung aus ungerechtfertigter Bereicherung, Art. 62 ff. OR) setzt drei Elemente voraus: Vermögensvermehrung bei der einen Partei, auf Kosten einer anderen, und das Fehlen eines genügenden Rechtsgrundes. Fehlt einer dieser Punkte, besteht kein Bereicherungsanspruch.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Vermögensvermehrung ist die erste Voraussetzung — ein messbarer Zugewinn beim Bereicherten.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Fehlender Rechtsgrund: keine vertragliche oder gesetzliche Grundlage rechtfertigt die Bereicherung.' },
    ],
  },
  {
    id: '19423220-003b-4ec3-8cfc-a3053057e3f5',
    fachbereich: 'Recht',
    musterlosung:
      'Nach OR 322 muss der Arbeitgeber dem Arbeitnehmenden bei jeder Lohnzahlung eine schriftliche Lohnabrechnung aushändigen. Sie enthält den Bruttolohn, alle Abzüge (Sozialversicherungen, Quellensteuer) und den Nettolohn. Dies macht die Lohnzusammensetzung transparent und nachvollziehbar.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Die schriftliche Lohnabrechnung ist nach OR 322 Pflicht — mit Brutto, Abzügen und Netto.' },
    ],
  },
  {
    id: '1a633e9c-aad3-4eea-a925-5e9b305b163f',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 13 ZGB: Handlungsfähig ist, wer volljährig (Mündigkeit ab 18 Jahren, Art. 14 ZGB) und urteilsfähig (vernunftgemässes Handeln, Art. 16 ZGB) ist. Beide Voraussetzungen müssen kumulativ erfüllt sein — fehlt eine, ist die Person beschränkt oder nicht handlungsfähig.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Volljährigkeit (Mündigkeit) ab 18 Jahren nach Art. 14 ZGB — eine der zwei Voraussetzungen.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Urteilsfähigkeit: Fähigkeit zu vernunftgemässem Handeln — zweite Voraussetzung (Art. 16 ZGB).' },
    ],
  },
  {
    id: '204774e2-7dc5-4f5d-8ef2-93783c7fab9c',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 3 ZGB verankert die Gutgläubigkeitsvermutung: Das Gesetz geht von der Anständigkeit der Menschen aus. Bis zum Beweis der Bösgläubigkeit gilt jeder als gutgläubig. Wer sich auf Bösgläubigkeit beruft, trägt die Beweislast — das schützt den redlichen Rechtsverkehr.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Anständigkeit der Menschen ist die Grundannahme von Art. 3 ZGB.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Gutgläubig ist jeder bis zum Beweis des Gegenteils — Beweislast bei dem, der Bösgläubigkeit behauptet.' },
    ],
  },
  {
    id: '215c9839-c17f-496b-9e88-d346ec883f99',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 8 ZGB enthält die Grundregel der Beweislast: Wer aus einer Tatsache Rechte ableiten will, muss ihr Vorhandensein beweisen. Gelingt der Beweis nicht, trägt er die Folgen der Beweislosigkeit — die Gegenpartei gewinnt. Die Regel strukturiert jeden Zivilprozess.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Beweisen muss derjenige, der aus der Tatsache Rechte ableitet — Beweislast liegt bei ihm.' },
    ],
  },
  {
    id: '222a3800-858d-4861-b0e9-4bb77e335540',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 2 Abs. 2 ZGB verankert das Rechtsmissbrauchsverbot: Wer sein Recht offenbar missbräuchlich ausübt, findet keinen Rechtsschutz. Der Richter verweigert den Anspruch, selbst wenn er formal zustünde — reine Schikane oder grob unverhältnismässige Rechtsausübung wird nicht geschützt.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Der Rechtsschutz wird verweigert — der Richter ignoriert offensichtlich missbräuchliche Ansprüche.' },
    ],
  },
  {
    id: '2a1e608f-cdad-4fff-ad49-f2149e44ad40',
    fachbereich: 'Recht',
    musterlosung:
      'Das entscheidende Merkmal des Rechts gegenüber Moral und Sitte ist die staatliche Durchsetzbarkeit. Der Staat kann Rechtsnormen mit Zwangsmitteln durchsetzen (Polizei, Gerichte, Vollstreckung). Moral- und Sittenregeln kennen nur soziale Sanktionen — der Staat erzwingt ihre Befolgung nicht.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Staatlich durchsetzbar heisst: Der Staat setzt die Rechtsnorm mit Zwang durch — das unterscheidet Recht von Moral.' },
    ],
  },
  {
    id: '2b64119c-b1fb-46a2-ae67-af81ea925921',
    fachbereich: 'Recht',
    musterlosung:
      'Das Arbeitsrecht kennt nach OR 320 Abs. 1 grundsätzlich Formfreiheit — ein Arbeitsvertrag kann mündlich oder schriftlich abgeschlossen werden, sogar konkludent durch Antritt der Arbeit. Ausnahmen: Lehrverträge (OR 344a) und gewisse Informationspflichten des Arbeitgebers (OR 330b) verlangen Schriftform.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Formfrei bedeutet: Schriftform ist nicht zwingend — mündlicher oder konkludenter Abschluss genügt.' },
    ],
  },
  {
    id: '311f44d3-079c-4229-9ab5-fc915f0c5122',
    fachbereich: 'Recht',
    musterlosung:
      'Auf Bundesebene gilt die klassische Gewaltenteilung: Legislative ist das Parlament (Bundesversammlung aus National- und Ständerat), Exekutive ist der Bundesrat (siebenköpfig), Judikative ist das Bundesgericht (Sitz Lausanne). Die Gewaltenteilung schützt vor Machtkonzentration.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Parlament = Bundesversammlung, bestehend aus National- und Ständerat — die Gesetzgebende Gewalt.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Bundesrat ist die ausführende Gewalt — sieben Mitglieder, die Schweizer Regierung.' },
      { feld: 'luecken', id: 'luecke-2', text: 'Bundesgericht ist die richterliche Gewalt — letzte innerstaatliche Instanz.' },
    ],
  },
  {
    id: '33831d29-65a6-4be8-94c0-203202d31b9f',
    fachbereich: 'Recht',
    musterlosung:
      'Im Kanton Bern lautet der dreistufige Instanzenzug: Regionalgericht (1. Instanz, Sachverhaltsfeststellung) → Obergericht (2. Instanz, kantonale Berufungsinstanz) → Bundesgericht (3. Instanz, prüft primär Rechtsfragen). Der Instanzenzug garantiert Rechtsschutz und Rechtseinheit.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Regionalgericht ist die erste Instanz im Kanton Bern — zuständig für Sachverhalt und Recht.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Obergericht ist kantonale Rechtsmittelinstanz — überprüft Urteile der ersten Instanz.' },
      { feld: 'luecken', id: 'luecke-2', text: 'Bundesgericht ist letzte innerstaatliche Instanz — prüft primär Rechtsfragen.' },
    ],
  },
  {
    id: '375ebd89-6867-401b-880e-568934397b36',
    fachbereich: 'Recht',
    musterlosung:
      'Nach OR 335c beträgt die ordentliche Kündigungsfrist im 1. Dienstjahr einen Monat, Kündigung auf Ende eines Kalendermonats. Beispiel: Eine Kündigung am 15. Juni wirkt auf Ende Juli. Ab dem 2. Dienstjahr verlängert sich die Frist auf zwei Monate, ab dem 10. Dienstjahr auf drei Monate.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Einen Monat Kündigungsfrist im 1. Dienstjahr — Mindestschutz nach OR 335c.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Kündigungstermin ist das Ende eines Kalendermonats — die Frist wirkt monatsweise.' },
    ],
  },
  {
    id: '39998d4d-0909-4404-a1ff-d04a8e66603e',
    fachbereich: 'Recht',
    musterlosung:
      'Das Legalitätsprinzip (Art. 5 Abs. 1 BV) verpflichtet den Staat, sich streng an das Gesetz zu halten. Jedes staatliche Handeln braucht eine gesetzliche Grundlage — willkürliches Handeln ist unzulässig. Es schützt die Bürgerinnen und Bürger vor unberechenbarem Eingriff und sichert Rechtssicherheit.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Legalitätsprinzip: Staatliches Handeln braucht gesetzliche Grundlage — kein willkürliches Eingreifen.' },
    ],
  },
  {
    id: '39ce7bf7-53c4-4757-92f7-62c490b85f19',
    fachbereich: 'Recht',
    musterlosung:
      'Das Sachenrecht verleiht dingliche Rechte — auch absolute Rechte genannt, weil sie gegenüber jedermann gelten. Der Berechtigte kann sie gegen jede Drittperson durchsetzen. Im Gegensatz dazu stehen obligatorische (relative) Rechte, die nur zwischen den Vertragsparteien wirken.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Dingliche Rechte sind unmittelbare Herrschaftsrechte an einer Sache — z.B. Eigentum, Pfand.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Absolute Rechte wirken gegen jedermann — im Gegensatz zu relativen Vertragsrechten.' },
    ],
  },
  {
    id: '3aa6085b-a525-432a-8b63-c062a7933686',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 257f OR verpflichtet den Mieter zur Anzeigepflicht: Mängel und Schäden an der Mietsache müssen dem Vermieter gemeldet werden. Unterlässt der Mieter die Meldung und vergrössert sich der Schaden, kann er für den zusätzlichen Schaden haftbar gemacht werden. Die Meldung ermöglicht rechtzeitige Reparatur.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Anzeigepflicht: Mängel sofort dem Vermieter melden — sonst Haftung für Folgeschäden.' },
    ],
  },
  {
    id: '3bb4746a-063e-469c-a637-615d50f9a6dd',
    fachbereich: 'Recht',
    musterlosung:
      'Nach Art. 9 Abs. 1 ArG beträgt die wöchentliche Höchstarbeitszeit für «übrige Betriebe» (z.B. Landwirtschaft, Gastgewerbe) 50 Stunden. Für Industriebetriebe und Büros liegt sie bei 45 Stunden. Die Höchstarbeitszeit schützt die Gesundheit der Arbeitnehmenden und ist zwingend.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: '50 Stunden Höchstarbeitszeit für übrige Betriebe (ArG 9 Abs. 1).' },
    ],
  },
  {
    id: '3f6736ea-dbcd-46f4-bd94-20c94d529f5f',
    fachbereich: 'Recht',
    musterlosung:
      'Nach OR 130 beginnt die Verjährungsfrist mit der Fälligkeit der Forderung zu laufen. Ab diesem Zeitpunkt könnte der Gläubiger die Leistung fordern und Klage erheben. Die Verjährung sanktioniert deshalb das Unterlassen der Rechtsverfolgung ab Fälligkeit — nicht ab Entstehung.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Fälligkeit ist der Zeitpunkt, ab dem der Gläubiger die Leistung fordern kann — Start der Verjährung.' },
    ],
  },
  {
    id: '41bd721b-5fc0-40bc-b3b9-bb2ac2968499',
    fachbereich: 'Recht',
    musterlosung:
      'Nach OR 330b muss der Arbeitgeber die wesentlichen Vertragsbedingungen schriftlich und vor oder spätestens bei Stellenantritt mitteilen. Das betrifft Lohn, Arbeitszeit, Ferien, Probezeit und Kündigungsfristen. Die Norm ist eine Ausnahme von der Formfreiheit und sichert Transparenz.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Schriftlich: Die wesentlichen Vertragsbedingungen müssen nach OR 330b schriftlich fixiert werden.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Vor Arbeitsbeginn: Die Mitteilung muss spätestens bei Stellenantritt erfolgen.' },
    ],
  },
  {
    id: '44b84731-8aa5-41dd-a75a-09c1693e5063',
    fachbereich: 'Recht',
    musterlosung:
      'Grundrechte sind primär Abwehrrechte — sie schützen Einzelne vor staatlichen Eingriffen. Der Staat ist verpflichtet zu unterlassen: Er darf nicht in geschützte Freiheiten eingreifen, ausser eine Einschränkung ist nach Art. 36 BV gerechtfertigt. Nur wenige Grundrechte begründen Leistungsansprüche (z.B. Art. 12 BV).',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Der Staat ist Adressat der Grundrechte — sein Handeln soll begrenzt werden.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Unterlassen ist die Hauptpflicht — kein Eingreifen in geschützte Freiheiten.' },
    ],
  },
  {
    id: '44d801ba-4b89-4b5d-9bb9-92ef7bd8590b',
    fachbereich: 'Recht',
    musterlosung:
      'Nach OR 337 ist eine fristlose Kündigung zulässig, wenn ein wichtiger (schwerwiegender) Grund besteht und die Fortsetzung dem Kündigenden unzumutbar ist. Typische Gründe: Diebstahl, grobe Pflichtverletzung, schwere Beleidigung. Die fristlose Kündigung beendet das Arbeitsverhältnis sofort.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Schwerwiegender Grund erforderlich — leichte Pflichtverletzungen genügen nicht.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Unmöglich/unzumutbar: Die Fortsetzung bis zum ordentlichen Kündigungstermin kann nicht verlangt werden.' },
    ],
  },
  {
    id: '4664f301-ce2d-4f28-86f8-fc151692390e',
    fachbereich: 'Recht',
    musterlosung:
      'Man unterscheidet originären (ursprünglichen) und derivativen (abgeleiteten) Eigentumserwerb. Originär: Eigentum entsteht neu (Aneignung herrenloser Sachen, Ersitzung, Fund, Verarbeitung). Derivativ: Eigentum wird vom bisherigen Eigentümer übertragen (Kauf, Schenkung, Erbschaft, Tausch).',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Originär: Eigentum entsteht neu — kein Vorgänger überträgt es.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Derivativ: Eigentum wird vom bisherigen Eigentümer abgeleitet, z.B. durch Kauf.' },
    ],
  },
  {
    id: '48e56495-7961-4354-850d-0c25e95d4858',
    fachbereich: 'Recht',
    musterlosung:
      'Die Zivilprozessordnung kennt fünf Beweismittel: Urkunden (schriftliche Dokumente), Zeugen (befragte Drittpersonen), Augenschein (Besichtigung durch Gericht), Parteibefragung (Aussagen der Parteien) und Gutachten (Expertise von Sachverständigen). Alle fünf helfen, den Sachverhalt festzustellen.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Zeugen sind Drittpersonen, die über Wahrgenommenes aussagen — wichtiges Beweismittel.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Parteianhörung: Die Parteien selbst werden befragt — anders gewichtet als Zeugenaussagen.' },
    ],
  },
  {
    id: '4c220479-f72f-47f3-83de-3db4ef1d2ff9',
    fachbereich: 'Recht',
    musterlosung:
      'Im Kanton Bern heisst die erste Instanz im Zivilprozess Regionalgericht. Andere Kantone verwenden Bezeichnungen wie Bezirksgericht oder Kreisgericht. Die zweite kantonale Instanz in Bern ist das Obergericht, die dritte (ausserkantonale) das Bundesgericht.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Regionalgericht ist die erste Zivilprozess-Instanz im Kanton Bern — Sachverhalt und Recht.' },
    ],
  },
  {
    id: '4fefe48f-d421-425e-81ff-c96d87409cc1',
    fachbereich: 'Recht',
    musterlosung:
      'Als Richtwert gilt: Der Mietzins (inkl. Nebenkosten) sollte einen Drittel des Bruttoeinkommens nicht übersteigen. Viele Verwaltungen prüfen Mietbewerbungen nach dieser Faustregel. Liegt der Mietzins deutlich darüber, gilt er als finanziell riskant — der Haushalt hat wenig Puffer.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Ein Drittel: Faustregel der Budgetberatung — Mietzins inkl. Nebenkosten ≤ 1/3 Bruttoeinkommen.' },
    ],
  },
  {
    id: '52361b7f-5d53-4868-8fcb-75037a264696',
    fachbereich: 'Recht',
    musterlosung:
      'Der Mietvertrag gehört zu den Verträgen auf Gebrauchsüberlassung. Daneben zählen dazu: Gebrauchsleihe (unentgeltlich, OR 305), Darlehen (Geld wird übergeben, OR 312) und Pacht (Nutzung mit Fruchtziehung, OR 275). Der Mietvertrag ist in dieser Gruppe der praktisch wichtigste.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Gebrauchsüberlassung: Der Vermieter überlässt die Sache zum Gebrauch gegen Mietzins.' },
    ],
  },
  {
    id: '52bd344b-23f3-4b10-a5c9-25216180c90f',
    fachbereich: 'Recht',
    musterlosung:
      'Das Strafrecht verfolgt zwei Grundfunktionen: Die Vergeltungsfunktion ist vergangenheitsorientiert und reagiert auf die begangene Tat — sie stillt das Gerechtigkeitsbedürfnis. Die Präventionsfunktion ist zukunftsorientiert: Sie will künftige Straftaten verhindern (Spezial- und Generalprävention).',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Vergeltungsfunktion: reagiert auf die Tat — vergangenheitsbezogen, klassische Straffunktion.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Präventionsfunktion: verhindert künftige Taten — zukunftsgerichtet, Spezial- und Generalprävention.' },
    ],
  },
  {
    id: '545e141b-5597-4911-9be6-31c11cc97981',
    fachbereich: 'Recht',
    musterlosung:
      'Eine Normalarbeitsverordnung (NAV) wird nach OR 359–360 von Kantons- oder Bundesbehörden erlassen. Sie greift in Branchen, wo Arbeitnehmende intensiv gefährdet sind oder das Lohnniveau tief ist (z.B. Gastgewerbe, Landwirtschaft). In der Schweiz hat die NAV eher untergeordnete Bedeutung gegenüber dem GAV.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Der Behörde: Kantons- oder Bundesbehörden erlassen eine NAV — nicht Sozialpartner.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Intensiv gefährdet: Die NAV schützt Branchen mit besonderem Risiko oder tiefen Löhnen.' },
    ],
  },
  {
    id: '547b0b5e-bc35-4dd2-94f1-69d48925deff',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 19 StGB regelt die Schuldunfähigkeit. Abs. 1 beschreibt die vollständige Schuldunfähigkeit — sie führt zu Straffreiheit. Dem Täter kann das Unrecht nicht vorgeworfen werden, weil er nicht vernunftgemäss handeln konnte. Abs. 2 regelt die verminderte Schuldfähigkeit, die zu milderer Strafe führt.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Art. 19 StGB ist die zentrale Schuldnorm — regelt volle und verminderte Schuldunfähigkeit.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Straffreiheit: Der Täter wird nicht bestraft — das Unrecht kann ihm nicht vorgeworfen werden.' },
    ],
  },
  {
    id: '5a27787b-e1a5-4bb6-8c85-5af18f9437e9',
    fachbereich: 'Recht',
    musterlosung:
      'Nach Art. 15 ArG variieren die Mindestpausen nach Arbeitsdauer: bei über 5,5 Stunden sind es 15 Minuten, bei über 7 Stunden 30 Minuten, bei über 9 Stunden 60 Minuten. Die Pausen dienen der Erholung und sind zwingend — sie können nicht abgegolten werden.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Dreissig Minuten Pause bei über 7 Stunden Arbeit — Mindestvorgabe nach ArG 15.' },
    ],
  },
  {
    id: '5a4aa649-ddf9-4986-b9de-e55516feacde',
    fachbereich: 'Recht',
    musterlosung:
      'Beim Einzug wird ein Übergabeprotokoll (auch Schaden- oder Zustandsprotokoll) erstellt. Es hält vorhandene Mängel und Schäden fest und wird gemeinsam von Mieter und Vermieter unterzeichnet. Es dient als Beweis dafür, dass bestimmte Mängel bereits vor Einzug bestanden und keine Mieterhaftung auslösen.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Übergabeprotokoll dokumentiert den Zustand beim Einzug — Beweis für vorbestehende Mängel.' },
    ],
  },
  {
    id: '5ce47efd-91b1-4099-9ab0-71b25f720652',
    fachbereich: 'Recht',
    musterlosung:
      'Die Teilnahme an einer Straftat wird strafrechtlich unterschieden: Art. 24 StGB regelt die Anstiftung — wer jemanden vorsätzlich zur Tat bestimmt, wird wie der Haupttäter bestraft. Art. 25 StGB regelt die Gehilfenschaft — wer vorsätzlich Hilfe leistet, wird milder bestraft.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Art. 24 StGB regelt die Anstiftung — Bestrafung nach dem Tatbestand des Haupttäters.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Art. 25 StGB regelt die Gehilfenschaft — mildere Bestrafung wegen geringerer Tatbeteiligung.' },
    ],
  },
  {
    id: '66a5d28a-4c9f-401b-91e2-e3b7365f3456',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 3 AEMR lautet: «Jeder hat das Recht auf Leben, Freiheit und Sicherheit der Person.» Dieser Artikel gehört zu den fundamentalsten Menschenrechten — das Recht auf Leben bildet die Grundlage aller weiteren Rechte, Freiheit und Sicherheit ergänzen den Schutz der Person.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Das Leben ist das erste geschützte Gut nach Art. 3 AEMR — Grundlage aller weiteren Rechte.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Die Freiheit ist das zweite Schutzgut — individuelle Selbstbestimmung.' },
    ],
  },
  {
    id: '69110e7e-d34b-4ab2-b298-2dd133ef0132',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 2 Abs. 1 ZGB enthält das Gebot von Treu und Glauben: Jeder muss in Ausübung seiner Rechte und Erfüllung seiner Pflichten nach Treu und Glauben handeln. Das bedeutet: anständig, ehrlich, ohne Hintergedanken. Das Gebot ist ein Grundprinzip des ganzen Privatrechts.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Treu: Zuverlässigkeit und Beständigkeit im Verhalten.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Glauben: Ehrlichkeit und redliche Erwartungshaltung gegenüber dem Gegenüber.' },
    ],
  },
  {
    id: '6a0f218c-26a5-416f-80df-35228ca49738',
    fachbereich: 'Recht',
    musterlosung:
      'Nach OR 135 wird die Verjährung unterbrochen durch Klageerhebung bzw. Betreibung des Gläubigers oder durch Schuldanerkennung des Schuldners (z.B. Abschlagszahlung, schriftliche Bestätigung). Nach Unterbrechung beginnt die Frist neu zu laufen (OR 137) — der Gläubiger gewinnt wieder Zeit.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Klageerhebung durch den Gläubiger unterbricht die Verjährung — neben der Betreibung.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Schuldanerkennung durch den Schuldner unterbricht ebenfalls — z.B. Abschlagszahlung.' },
    ],
  },
  {
    id: '6b829967-af69-4c65-ae98-55677fb8876f',
    fachbereich: 'Recht',
    musterlosung:
      'Der Erklärungsirrtum nach OR 24 Abs. 1 Ziff. 1–3 umfasst drei Varianten: Irrtum über die Natur des Vertrags (Ziff. 1), über die Person des Vertragspartners (Ziff. 2) oder über den Gegenstand (Ziff. 3). Ein solcher Irrtum macht den Vertrag anfechtbar — die irrende Partei kann ihn binnen Jahresfrist aufheben.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Erklärungsirrtum: Irrtum über Natur, Person oder Gegenstand des Vertrags (OR 24 Abs. 1 Ziff. 1–3).' },
    ],
  },
  {
    id: '6cb4e09a-3ad5-4f8b-8992-be58deb997c5',
    fachbereich: 'Recht',
    musterlosung:
      'Nach OR 321b hat der Arbeitnehmende eine Rechenschafts- und Herausgabepflicht. Er muss den Arbeitgeber über relevante Geschäftsvorgänge informieren (Rechenschaft) und erhaltene Geldmittel oder Gegenstände herausgeben (Herausgabe). Die Pflicht sichert die Kontrolle des Arbeitgebers über das Arbeitsergebnis.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Rechenschaft: Information über alle relevanten Geschäftsvorgänge.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Herausgabe: Rückgabe erhaltener Mittel und Gegenstände an den Arbeitgeber.' },
    ],
  },
  {
    id: '707270a4-5867-4200-a9a5-d2ac394b1f46',
    fachbereich: 'Recht',
    musterlosung:
      'Nach Art. 243 ZPO gilt das vereinfachte Verfahren für vermögensrechtliche Streitigkeiten bis CHF 30\'000. Es ist schneller, formloser und kostengünstiger als das ordentliche Verfahren. Darüber greift das ordentliche Verfahren mit strengeren Formvorschriften und höherem Kostenrisiko.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'CHF 30\'000 ist die Streitwertgrenze — darunter vereinfachtes, darüber ordentliches Verfahren.' },
    ],
  },
  {
    id: '71c54bbe-aa37-4c52-9cff-33bb926f28b0',
    fachbereich: 'Recht',
    musterlosung:
      'Nach OR 357a verpflichtet die Friedenspflicht die Parteien eines Gesamtarbeitsvertrags (GAV), während der Laufzeit keine Streiks, Aussperrungen oder Boykotte durchzuführen. Die Friedenspflicht sichert den Arbeitsfrieden und ist essenziell für die Sozialpartnerschaft in der Schweiz.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Friedenspflicht: Verzicht auf Arbeitskampfmassnahmen während GAV-Laufzeit.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Streiks sind während der Friedenspflicht verboten — ebenso Aussperrungen und Boykotte.' },
    ],
  },
  {
    id: '7241460d-28d0-4831-8d34-d9c537dd45e7',
    fachbereich: 'Recht',
    musterlosung:
      'Der gesetzliche Verzugszins für Geldschulden beträgt nach OR 104 fünf Prozent pro Jahr. Dieser Zinssatz gilt, sofern vertraglich nichts anderes vereinbart ist. Er soll den Gläubiger für den Vermögensschaden entschädigen, der durch die verspätete Zahlung entsteht.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Fünf Prozent pro Jahr — gesetzlicher Verzugszins nach OR 104.' },
    ],
  },
  {
    id: '750d085d-8523-45e6-b24e-b7df6051aeea',
    fachbereich: 'Recht',
    musterlosung:
      'Nach Art. 64b StGB muss bei einer Verwahrung die Möglichkeit einer bedingten Entlassung jährlich psychiatrisch überprüft werden. Die Verwahrung ist die zeitlich unbefristete Sicherungsmassnahme — sie kann nach der Freiheitsstrafe verhängt werden, wenn weitere schwere Straftaten drohen.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Jährlich: Die Möglichkeit einer Entlassung aus der Verwahrung wird jedes Jahr geprüft.' },
    ],
  },
  {
    id: '7584d495-b586-4db4-96f0-be196c6c58f4',
    fachbereich: 'Recht',
    musterlosung:
      'Der Persönlichkeitsschutz (Art. 28 ZGB) gliedert sich in drei konzentrische Sphären: Gemeinsphäre (öffentliches Leben, z.B. Strasse), Privatsphäre (z.B. Wohnung, Familie) und Intimsphäre (z.B. Sexualität, Gesundheit). Je näher am Kern, desto stärker der Schutz vor Eingriffen Dritter.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Gemeinsphäre: Öffentliches Auftreten — geringster Schutz.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Privatsphäre: Privates Umfeld wie Familie und Wohnung — mittlerer Schutz.' },
      { feld: 'luecken', id: 'luecke-2', text: 'Intimsphäre: Kernbereich mit stärkstem Schutz — Sexualität, Gesundheit, Tagebuch.' },
    ],
  },
  {
    id: '79d5629e-b87d-4c03-b6d5-9aa6486c334a',
    fachbereich: 'Recht',
    musterlosung:
      'Die Zustimmung des gesetzlichen Vertreters (Art. 19 Abs. 1, Art. 19a ZGB) kann im Voraus oder im Nachhinein erfolgen. Voraus heisst Einwilligung vor Vertragsschluss, nachhinein heisst Genehmigung eines bereits geschlossenen Geschäfts. Zudem kann sie ausdrücklich oder stillschweigend erteilt werden.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Im Voraus: Einwilligung vor Abschluss des Rechtsgeschäfts.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Im Nachhinein: Genehmigung eines bereits abgeschlossenen Geschäfts.' },
    ],
  },
  {
    id: '8701147d-7488-4371-b198-77db2a44cf79',
    fachbereich: 'Recht',
    musterlosung:
      'Nach OR 336a beträgt die Entschädigung bei missbräuchlicher Kündigung zwischen einem und sechs Monatslöhnen. Das Gericht berücksichtigt die Schwere des Missbrauchs und die Umstände des Einzelfalls. Die Entschädigung ist kein Strafschadenersatz, sondern Genugtuung für den betroffenen Arbeitnehmenden.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Einen Monatslohn ist die Mindestentschädigung bei missbräuchlicher Kündigung.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Sechs Monatslöhne ist die Höchstentschädigung — bei besonders schwerem Missbrauch.' },
    ],
  },
  {
    id: '879bd5aa-96a8-4606-bf9f-7666f3257904',
    fachbereich: 'Recht',
    musterlosung:
      'Im Zivilprozess stehen sich die Kläger (wer klagt) und der Beklagte (gegen wen geklagt wird) gegenüber. Die Bezeichnungen stammen aus der Dispositionsmaxime — die Parteien bestimmen selbst über den Streitgegenstand. Im Strafprozess dagegen treten Staatsanwaltschaft und Beschuldigter auf.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Klägerin ist die Partei, die das Verfahren initiiert — sie hat den Klageantrag gestellt.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Beklagter ist die Partei, gegen die geklagt wird.' },
    ],
  },
  {
    id: '8a073ecc-b9d3-4e5d-a137-37cfc6275d61',
    fachbereich: 'Recht',
    musterlosung:
      'Die Rechtsanwendung folgt vier Schritten: (1) Sachverhalt feststellen (was ist passiert?), (2) Rechtsnorm finden (welcher Artikel ist einschlägig?), (3) Subsumtion (erfüllt der Sachverhalt die Tatbestandsmerkmale?), (4) Rechtsfolge bestimmen (was ist die rechtliche Konsequenz?). Dieses Schema strukturiert jede Falllösung.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Sachverhalt feststellen: Was ist konkret passiert? Grundlage jeder juristischen Analyse.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Rechtsnorm finden: Welcher Artikel regelt den Fall? Aus Gesetz und Rechtsprechung.' },
      { feld: 'luecken', id: 'luecke-2', text: 'Subsumtion: Die Tatbestandsmerkmale der Norm werden am Sachverhalt geprüft.' },
      { feld: 'luecken', id: 'luecke-3', text: 'Rechtsfolge: Die Konsequenz der Norm tritt ein, wenn alle Merkmale erfüllt sind.' },
    ],
  },
  {
    id: '8a922e68-c4cb-4f06-800a-0d8337ccb6b6',
    fachbereich: 'Recht',
    musterlosung:
      'Das Stockwerkeigentum ist im Zivilgesetzbuch ab Art. 712a ZGB geregelt. Eingeführt wurde es in der Schweiz in den 1960er-Jahren — es ist heute die praktisch häufigste Form gemeinschaftlichen Eigentums bei Mehrfamilienhäusern. Jeder Eigentümer hat ein Sondernutzungsrecht an seiner Einheit.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Zivilgesetzbuch regelt das Stockwerkeigentum — Bundesrecht.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Art. 712a ZGB ist die Einstiegsnorm — es folgen Regeln zu Verwaltung und Kostentragung.' },
    ],
  },
  {
    id: '8bcd53f4-f867-4c6b-b88c-3924deaefc51',
    fachbereich: 'Recht',
    musterlosung:
      'Nach Art. 86 Abs. 1 StGB ist eine inhaftierte Person bedingt zu entlassen, wenn sie zwei Drittel der Strafe (mindestens 3 Monate) verbüsst hat, sich im Vollzug bewährt hat und nicht anzunehmen ist, dass weitere Straftaten drohen. Die bedingte Entlassung gibt dem Verurteilten einen Anreiz zur Wohlverhaltens.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Zwei Drittel der Strafe müssen verbüsst sein — dann kommt die bedingte Entlassung in Betracht.' },
    ],
  },
  {
    id: '8c38878d-feb6-4832-8a4a-c407666da28b',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 11 Abs. 1 ZGB bestimmt: «Rechtsfähig ist jeder Mensch.» Das heisst: Jede natürliche Person kann Trägerin von Rechten und Pflichten sein — unabhängig von Alter, Geschlecht, Herkunft oder geistigem Zustand. Die Rechtsfähigkeit beginnt mit der Geburt und endet mit dem Tod.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Mensch: Jeder Mensch ist rechtsfähig — ohne Einschränkung, ab Geburt.' },
    ],
  },
  {
    id: '8d5c0ad8-c45a-4573-bc4a-f4310e5ddd2d',
    fachbereich: 'Recht',
    musterlosung:
      'Nach OR 19/20 ist ein Vertrag mit unmöglichem, rechtswidrigem oder unsittlichem Inhalt nichtig. Unmöglich: Leistung objektiv nicht erbringbar. Rechtswidrig: Verstösst gegen das Gesetz (z.B. Drogenhandel). Unsittlich: Verletzt grundlegende Moral- und Wertvorstellungen. Die Vertragsfreiheit hat hier ihre Grenzen.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Rechtswidrig: Der Vertragsinhalt verstösst gegen zwingendes Gesetz — Nichtigkeit nach OR 20.' },
    ],
  },
  {
    id: '8e48162f-a122-413e-b5a1-20a5a494bd03',
    fachbereich: 'Recht',
    musterlosung:
      'Bei Schuldnerverzug in zweiseitigen Verträgen muss der Gläubiger dem Schuldner zunächst eine angemessene Nachfrist zur nachträglichen Erfüllung setzen (OR 107 Abs. 1). Erst danach kann er zwischen Erfüllung mit Schadenersatz oder Vertragsrücktritt wählen. Bei Fixgeschäften (OR 108) entfällt die Nachfrist.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Angemessene Nachfrist: Der Schuldner bekommt eine zweite Chance — erst danach folgen Wahlrechte.' },
    ],
  },
  {
    id: '905b9887-a2be-421f-9fb5-674bc51742bf',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 97 StGB regelt die Verjährungsfristen für Straftaten — sie bemessen sich an der abstrakten Maximalstrafe des Tatbestands, nicht an der konkret ausgesprochenen Strafe. Besonders schwere Delikte (z.B. Mord) verjähren nach Art. 101 StGB nicht. Die Verjährung sichert Rechtsfrieden nach Zeitablauf.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Art. 97 StGB regelt die Verjährungsfristen — gestaffelt nach Strafrahmen der Tat.' },
    ],
  },
  {
    id: '924d5a42-8e50-4a8d-bc94-6e6d1b135365',
    fachbereich: 'Recht',
    musterlosung:
      'Der Grundsatz «lex specialis derogat legi generali» besagt: Das speziellere Gesetz geht dem allgemeineren vor. Beispiel: Ein Versicherungsvertragsgesetz verdrängt das allgemeine OR, soweit es besondere Regeln aufstellt. Der Grundsatz vermeidet Normenkollisionen und sichert Rechtsklarheit.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Lex specialis: Die spezielle Norm geht der generellen vor — Kollisionsregel im Recht.' },
    ],
  },
  {
    id: '950daf00-a781-4d8d-8886-2411c939cd62',
    fachbereich: 'Recht',
    musterlosung:
      'Das StGB besteht aus zwei grossen Teilen: Allgemeiner Teil (Art. 1–110) mit den für alle Straftaten geltenden Regeln (Strafarten, Verjährung, Schuldfähigkeit) und Besonderer Teil (Art. 111–332) mit der Liste aller Straftatbestände (Diebstahl, Körperverletzung, Mord).',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Allgemeiner Teil: Regeln, die für alle Straftatbestände gelten — Voraussetzungen und Strafzumessung.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Besonderer Teil: Einzelne Straftatbestände — die konkreten Delikte.' },
    ],
  },
  {
    id: '989ab055-872c-4f13-8d3a-edef6392af73',
    fachbereich: 'Recht',
    musterlosung:
      'Nach Art. 40 StGB beträgt die Mindestdauer einer Freiheitsstrafe drei Tage, die Höchstdauer zwanzig Jahre. Die lebenslängliche Freiheitsstrafe ist bei besonders schweren Straftaten (z.B. Mord nach Art. 112 StGB) zusätzlich möglich. Unter drei Tagen gibt es keine Freiheitsstrafe — Geldstrafen greifen dann.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Drei Tage Minimum — unter dieser Dauer wird statt Freiheitsstrafe Geldstrafe verhängt.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Zwanzig Jahre Höchstdauer — darüber nur lebenslängliche Strafe.' },
    ],
  },
  {
    id: '9ac126d1-c27f-4e91-8eae-df9842032de0',
    fachbereich: 'Recht',
    musterlosung:
      'Bei einer Gattungsschuld ist die geschuldete Sache nur nach Gattung bestimmt — Qualität und Quantität reichen (z.B. «100 kg Weizen»). Bei einer begrenzten Gattungsschuld stammt die Sache aus einem begrenzten Bestand oder Lager (z.B. «100 kg Weizen aus Ernte 2024, Lager Burgdorf»). Das beschränkt die Austauschbarkeit.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Genus-Schuld: Die Sache ist nur nach Gattung bestimmt — austauschbar innerhalb der Gattung.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Bestand: Die begrenzte Gattungsschuld kommt aus einem bestimmten Lager oder Vorrat.' },
    ],
  },
  {
    id: '9ba1a5d8-b5f1-495b-be94-39f9378acc67',
    fachbereich: 'Recht',
    musterlosung:
      'Die Grundrechte der Schweiz stehen im zweiten Titel der Bundesverfassung (Art. 7–41 BV) unter dem Titel «Grundrechte, Bürgerrechte und Sozialziele». Die Grundrechte (Art. 7–34) gelten für alle Menschen, die Bürgerrechte (Art. 34–40) nur für Schweizer Staatsangehörige.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Zweiter Titel der BV: Dort finden sich die Grundrechte systematisch zusammengefasst.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Bürgerrechte: Nur Schweizer Staatsangehörige haben sie — z.B. politische Rechte (Art. 34 BV).' },
    ],
  },
  {
    id: '9cde3495-3d26-4022-a0b1-5751135a3c06',
    fachbereich: 'Recht',
    musterlosung:
      'Art. 55 OR regelt die Geschäftsherrenhaftung: Der Geschäftsherr haftet für Schäden, die seine Arbeitnehmenden in Ausübung ihrer dienstlichen Tätigkeit verursachen. Die Haftung ist eine einfache Kausalhaftung — sie entsteht unabhängig vom Verschulden des Geschäftsherrn selbst, setzt aber Widerrechtlichkeit voraus.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Art. 55 OR ist die zentrale Norm der Geschäftsherrenhaftung.' },
    ],
  },
  {
    id: '9f01652b-bf7a-4f4f-af40-0c4894efefc6',
    fachbereich: 'Recht',
    musterlosung:
      'Die Kaution im Mietrecht ist in Art. 257e OR geregelt: Der Mieter leistet eine Sicherheit, die auf einem Sperrkonto hinterlegt wird. Im Arbeitsrecht regelt Art. 330 OR die Kaution des Arbeitnehmenden. In beiden Fällen dient die Kaution als Sicherheit für mögliche Forderungen der anderen Partei.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: '257e OR regelt die Mietkaution — auf Sperrkonto hinterlegt.' },
      { feld: 'luecken', id: 'luecke-1', text: '330 OR regelt die arbeitsrechtliche Kaution — bei Bedarf vom Arbeitnehmer gestellt.' },
    ],
  },
  {
    id: 'a5c57256-6cbf-4f1a-9e52-40ac3e7492ef',
    fachbereich: 'Recht',
    musterlosung:
      'Die Rechtsordnung umfasst alle staatlichen Vorschriften — Gebote, Verbote, Rechte und Pflichten — deren Befolgung der Staat erzwingen kann. Sie ist die Gesamtheit aller geltenden Normen in einem Staat zu einem bestimmten Zeitpunkt. Sie unterscheidet sich durch die staatliche Durchsetzbarkeit von Moral und Sitte.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Rechtsordnung: Gesamtheit aller staatlich durchsetzbaren Vorschriften.' },
    ],
  },
  {
    id: 'b3f42311-3f41-4d51-a915-b3797e824deb',
    fachbereich: 'Recht',
    musterlosung:
      'Die subjektive Tatbestandsmässigkeit betrifft die innere Einstellung des Täters und kennt drei Varianten: Vorsatz (Wissen und Willen, Art. 12 Abs. 2 StGB), Fahrlässigkeit (Sorgfaltspflichtverletzung, Art. 12 Abs. 3 StGB) und Zufall (kein Vorwurf). Nur Vorsatz und Fahrlässigkeit führen zu Bestrafung.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Vorsatz: Der Täter handelt wissentlich und willentlich — volle innere Beteiligung.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Fahrlässigkeit: Der Täter verletzt eine Sorgfaltspflicht — mildere Strafe als bei Vorsatz.' },
    ],
  },
  {
    id: 'b5e0cf92-db35-496b-8565-fa972484eb8a',
    fachbereich: 'Recht',
    musterlosung:
      'Vertretbare Sachen sind nach Art, Zahl, Mass oder Gewicht bestimmt (z.B. Getreide, Geld) — sie können jederzeit durch gleichartige ersetzt werden. Nicht vertretbare Sachen sind einzeln bestimmt (z.B. ein bestimmtes Gemälde) — sie sind individuell. Diese Unterscheidung beeinflusst Erfüllungsort und Ersatzleistung.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'Mass: Vertretbare Sachen werden nach Art, Zahl, Mass oder Gewicht bestimmt.' },
      { feld: 'luecken', id: 'luecke-1', text: 'Einzeln: Nicht vertretbare Sachen sind individuell — z.B. ein konkretes Kunstwerk.' },
    ],
  },
  {
    id: 'c09593d1-6f39-484d-aabe-97915257d231',
    fachbereich: 'Recht',
    musterlosung:
      'OR 19 statuiert die inhaltliche Vertragsfreiheit: Die Parteien bestimmen den Vertragsinhalt frei. OR 20 setzt die Grenze: Ein unmöglicher, rechtswidriger oder unsittlicher Inhalt führt zur Nichtigkeit. Die Freiheit endet dort, wo zwingendes Recht oder grundlegende Wertordnung berührt werden.',
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: 'OR 19/20 sind die zentralen Normen zur Vertragsfreiheit und ihren Grenzen.' },
    ],
  },
]

// Append JSONL (nicht überschreiben!)
const lines = updates.map((u) => JSON.stringify(u)).join('\n') + '\n'
await fs.appendFile(OUT, lines)

// Update state
const state = JSON.parse(await fs.readFile(STATE, 'utf8'))
state.letzteSession = new Date().toISOString()
state.verarbeitet = (state.verarbeitet || 0) + updates.length
state.fragen = state.fragen || {}
for (const u of updates) {
  state.fragen[u.id] = {
    status: 'done',
    zeitpunkt: state.letzteSession,
    teile: u.teilerklaerungen.length,
  }
}
await fs.writeFile(STATE, JSON.stringify(state, null, 2))

console.log(`[s2] ${updates.length} Updates angehängt`)
console.log(`[s2] state.verarbeitet=${state.verarbeitet}/${state.totalFragen}`)
const withT = updates.filter((u) => u.teilerklaerungen.length > 0).length
const totT = updates.reduce((s, u) => s + u.teilerklaerungen.length, 0)
console.log(`[s2] ${withT}/${updates.length} mit Teilerklärungen, total ${totT} Teilerklärungen`)
