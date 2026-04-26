#!/usr/bin/env node
/**
 * Session 27: 50 Fragen, alles BWL.
 * 19 buchungssatz (Teilerklärungen pro buchungen, ID=buchungen[].id)
 *  1 code (keine Sub-Struktur)
 *  6 dragdrop_bild (Teilerklärungen pro zielzonen, ID=zielzonen[].id)
 *  1 freitext (keine Sub-Struktur)
 *  5 hotspot (Teilerklärungen pro bereiche, ID=bereiche[].id — einr-hs-europa hat keine bereiche)
 *  5 kontenbestimmung (Teilerklärungen pro aufgaben, ID=aufgaben[].id)
 * 13 lueckentext (Teilerklärungen pro luecken, ID=luecken[].id)
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  // ===== BWL/buchungssatz (19) =====
  {
    id: '0477fe0d-9f7a-493e-a3a0-df313b8a90dd',
    fachbereich: 'BWL',
    musterlosung: `Vorausbezahlte Miete des neuen Jahres wird per 31.12. als Transitorische Aktive abgegrenzt. Buchungssatz: Transitorische Aktiven an Mietaufwand 3'000. Die TA (Aktivkonto) nehmen im Soll zu, der Mietaufwand wird im Haben entsprechend reduziert. So fliesst nur der Anteil des laufenden Jahres in die Erfolgsrechnung — das Matching-Prinzip wird eingehalten.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_95384832', text: `Transitorische Aktiven (Aktivkonto 1300) nehmen im Soll zu, Mietaufwand (6000) wird im Haben um den abgegrenzten Betrag reduziert.` },
    ],
  },
  {
    id: '0de9887a-0eed-4ea5-bd3d-2628f1f9f2a9',
    fachbereich: 'BWL',
    musterlosung: `Beim Privatbezug verwendet der Eigentümer Geschäftsgeld für private Zwecke. Das Privatkonto (Unterkonto des Eigenkapitals) nimmt zu und steht im Soll. Die Kasse als Aktivkonto nimmt ab und steht im Haben. Buchungssatz: Privat an Kasse 2'000. Am Jahresende wird das Privatkonto gegen das Eigenkapital abgeschlossen und reduziert dieses.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_2ba7aadc', text: `Privat (2850, Unterkonto EK) nimmt im Soll zu, Kasse (1000, Aktivkonto) nimmt im Haben ab. Klassischer Privatbezug bar.` },
    ],
  },
  {
    id: '2b9df43c-300b-4250-ad74-ec21ce774dea',
    fachbereich: 'BWL',
    musterlosung: `Noch nicht bezahlte Zinsen werden per 31.12. abgegrenzt, damit sie in der richtigen Periode wirken. Der Zinsaufwand (Aufwandkonto) nimmt zu und steht im Soll. Die Transitorischen Passiven (Passivkonto) nehmen zu und stehen im Haben. Buchungssatz: Zinsaufwand an Transitorische Passiven 1'800. Die Bezahlung erfolgt erst im neuen Jahr.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_495a0b25', text: `Zinsaufwand (6800) nimmt im Soll zu, Transitorische Passiven (2300, Passivkonto) nehmen im Haben zu. Aufgelaufener, noch nicht bezahlter Zins.` },
    ],
  },
  {
    id: '339c1c25-ff14-48ab-aa6e-32c353542ed9',
    fachbereich: 'BWL',
    musterlosung: `Der Geschäftsfall umfasst zwei unabhängige Buchungen. Erstens ein Verkauf auf Rechnung: Debitoren an Warenertrag 4'000. Zweitens ein Wareneinkauf bar: Warenaufwand an Kasse 600. Beide Buchungen sind erfolgswirksam; die erste erhöht den Ertrag, die zweite den Aufwand. Der Nettoeffekt auf die Erfolgsrechnung beträgt 3'400 CHF.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_72f4bf0f', text: `Verkauf auf Rechnung: Debitoren (1100, Aktivkonto) nehmen im Soll zu, Warenertrag (3200, Ertragskonto) nimmt im Haben zu.` },
      { feld: 'buchungen', id: 'b_b086f954', text: `Wareneinkauf bar: Warenaufwand (4200) nimmt im Soll zu, Kasse (1000, Aktivkonto) nimmt im Haben ab.` },
    ],
  },
  {
    id: '5c086d34-36b1-4aad-882e-49b5b38d9d23',
    fachbereich: 'BWL',
    musterlosung: `Bei der indirekten Abschreibung bleibt das Anlagekonto unverändert; der Wertverlust wird über ein Minus-Aktivkonto erfasst. Abschreibungen (Aufwandkonto) nehmen zu und stehen im Soll. Wertberichtigung Mobiliar (Minus-Aktivkonto) nimmt zu und steht im Haben. Buchungssatz: Abschreibungen an Wertberichtigung Mobiliar 2'500. Das Mobiliar zeigt weiterhin den Anschaffungswert — der Buchwert ergibt sich aus der Differenz.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_0c833678', text: `Abschreibungen (6800, Aufwand) nehmen im Soll zu, Wertberichtigung Mobiliar (1521, Minus-Aktivkonto) nimmt im Haben zu. Indirekte Methode.` },
    ],
  },
  {
    id: '668c4ad4-6fed-4d6b-aba5-0a3eede61b6d',
    fachbereich: 'BWL',
    musterlosung: `Die Stromrechnung ist ein klassischer Betriebsaufwand. Der Energieaufwand (Aufwandkonto) nimmt zu und steht im Soll. Die Kasse als Aktivkonto nimmt ab und steht im Haben. Buchungssatz: Energieaufwand an Kasse 350. Die Buchung ist erfolgswirksam und reduziert den Gewinn der Periode um 350 CHF.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_14b91980', text: `Energieaufwand (6200) nimmt im Soll zu, Kasse (1000, Aktivkonto) nimmt im Haben ab. Erfolgswirksame Barausgabe.` },
    ],
  },
  {
    id: '75fca451-90dd-4d7c-8168-dc0de68d6597',
    fachbereich: 'BWL',
    musterlosung: `Beim Verkauf auf Rechnung entsteht eine Forderung an die Kundin. Die Debitoren (Aktivkonto) nehmen zu und stehen im Soll. Der Warenertrag (Ertragskonto) nimmt zu und steht im Haben. Buchungssatz: Debitoren an Warenertrag 6'000. Der Ertrag wird nach dem Realisationsprinzip bereits bei Rechnungsstellung erfasst — nicht erst bei Zahlungseingang.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_f2650305', text: `Debitoren (1100, Aktivkonto) nehmen im Soll zu — neue Forderung. Warenertrag (3200, Ertragskonto) nimmt im Haben zu. Realisationsprinzip.` },
    ],
  },
  {
    id: '83b95c52-0bb9-4ad6-83ed-d0b90fd55330',
    fachbereich: 'BWL',
    musterlosung: `Die Lohnzahlung ist ein Personalaufwand. Der Lohnaufwand (Aufwandkonto) nimmt zu und steht im Soll. Die Bank (Aktivkonto) nimmt ab und steht im Haben. Buchungssatz: Lohnaufwand an Bank 4'500. Der Lohnaufwand ist erfolgswirksam und reduziert direkt den Periodengewinn.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_04dc5019', text: `Lohnaufwand (6500) nimmt im Soll zu, Bank (1020, Aktivkonto) nimmt im Haben ab. Personalaufwand der Periode.` },
    ],
  },
  {
    id: '965c46c3-9e30-473e-830f-c49444ab6ae0',
    fachbereich: 'BWL',
    musterlosung: `Die Bank schreibt Zinsen auf dem Guthaben gut — ein Finanzertrag des Unternehmens. Die Bank (Aktivkonto) nimmt zu und steht im Soll. Der Zinsertrag (Ertragskonto) nimmt zu und steht im Haben. Buchungssatz: Bank an Zinsertrag 120. Der Ertrag wird in der Erfolgsrechnung als neutraler Finanzertrag ausgewiesen.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_972a386e', text: `Bank (1020, Aktivkonto) nimmt im Soll zu, Zinsertrag (3400, Ertragskonto) nimmt im Haben zu. Finanzertrag ausserhalb des Betriebszwecks.` },
    ],
  },
  {
    id: '9a99a7cd-ba30-47bd-9712-788fa99b2576',
    fachbereich: 'BWL',
    musterlosung: `Die Mietzahlung ist ein Betriebsaufwand. Der Mietaufwand (Aufwandkonto) nimmt zu und steht im Soll. Die Bank (Aktivkonto) nimmt ab und steht im Haben. Buchungssatz: Mietaufwand an Bank 1'500. Die Buchung reduziert den Gewinn der Periode und ist typischer periodengerechter Aufwand.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_02cfd25b', text: `Mietaufwand (6000) nimmt im Soll zu, Bank (1020, Aktivkonto) nimmt im Haben ab. Periodengerechter Betriebsaufwand.` },
    ],
  },
  {
    id: 'bbc4d527-6508-4758-afa5-0abb23edbfab',
    fachbereich: 'BWL',
    musterlosung: `Die Zahlung an die Lieferantin tilgt eine bestehende Verbindlichkeit. Die Kreditoren (Passivkonto) nehmen ab und stehen im Soll. Die Kasse (Aktivkonto) nimmt ab und steht im Haben. Buchungssatz: Kreditoren an Kasse 3'000. Es entsteht keine Erfolgswirkung — nur Bilanzpositionen verändern sich (Bilanzverkürzung).`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_c886a7eb', text: `Kreditoren (2000, Passivkonto) nehmen im Soll ab, Kasse (1000, Aktivkonto) nimmt im Haben ab. Erfolgsneutrale Schuldentilgung.` },
    ],
  },
  {
    id: 'e1c1bf54-5eaa-4d27-8ea5-0619e31c7b0b',
    fachbereich: 'BWL',
    musterlosung: `Die Warenrücksendung reduziert sowohl die Schuld an die Lieferantin als auch den Warenaufwand. Die Kreditoren (Passivkonto) nehmen ab und stehen im Soll. Der Warenaufwand wird korrigiert und steht im Haben. Buchungssatz: Kreditoren an Warenaufwand 500. Die Buchung entspricht einer Stornierung des ursprünglichen Wareneinkaufs auf Kredit.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_41e1d90a', text: `Kreditoren (2000, Passivkonto) nehmen im Soll ab, Warenaufwand (4200) wird im Haben korrigiert. Storno des Einkaufs auf Kredit.` },
    ],
  },
  {
    id: 'ecf459d2-f59c-4b12-b9e3-971b75738a3e',
    fachbereich: 'BWL',
    musterlosung: `Der Kunde begleicht eine offene Rechnung per Bank. Die Bank (Aktivkonto) nimmt zu und steht im Soll. Die Debitoren (Aktivkonto) nehmen ab und stehen im Haben. Buchungssatz: Bank an Debitoren 1'200. Es handelt sich um einen reinen Aktivtausch — Bilanzsumme und Eigenkapital bleiben unverändert.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_a7788057', text: `Bank (1020, Aktivkonto) nimmt im Soll zu, Debitoren (1100, Aktivkonto) nehmen im Haben ab. Reiner Aktivtausch, erfolgsneutral.` },
    ],
  },
  {
    id: 'einr-bs-eis',
    fachbereich: 'BWL',
    musterlosung: `Der Barkauf eines Eises ist ein kleiner Wareneinkauf gegen Bargeld — eingesetzt als Einstieg in die Buchungssatz-Eingabe. Der Warenaufwand (Aufwandkonto) nimmt zu und steht im Soll. Die Kasse (Aktivkonto) nimmt ab und steht im Haben. Buchungssatz: Warenaufwand an Kasse 5. Erfolgswirksame Barausgabe zur Einführung in die Buchungslogik.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'bs-eis', text: `Warenaufwand (4200) nimmt im Soll zu, Kasse (1000, Aktivkonto) nimmt im Haben ab. Einführungsbeispiel Wareneinkauf bar.` },
    ],
  },
  {
    id: 'f1e89c1d-e2a3-40bd-8479-56de1637f7e0',
    fachbereich: 'BWL',
    musterlosung: `Beim Wareneinkauf auf Kredit entsteht eine neue Lieferantenschuld. Der Warenaufwand (Aufwandkonto) nimmt zu und steht im Soll. Die Kreditoren (Passivkonto) nehmen zu und stehen im Haben. Buchungssatz: Warenaufwand an Kreditoren 2'500. Die Bezahlung erfolgt später — bis dahin bleibt die Schuld bestehen, die Buchung ist erfolgswirksam.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_dc98db4a', text: `Warenaufwand (4200) nimmt im Soll zu, Kreditoren (2000, Passivkonto) nehmen im Haben zu. Neue Lieferantenschuld.` },
    ],
  },
  {
    id: 'f3b8d547-6cb6-4ea8-a64c-c3d23a16eb8d',
    fachbereich: 'BWL',
    musterlosung: `Der Wareneinkauf erfolgt direkt per Bank — ohne Zwischenschritt über die Kreditoren. Der Warenaufwand (Aufwandkonto) nimmt zu und steht im Soll. Die Bank (Aktivkonto) nimmt ab und steht im Haben. Buchungssatz: Warenaufwand an Bank 3'800. Erfolgswirksame Ausgabe, die den Gewinn der Periode reduziert.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_b1b6b20e', text: `Warenaufwand (4200) nimmt im Soll zu, Bank (1020, Aktivkonto) nimmt im Haben ab. Direktzahlung ohne Kreditorbildung.` },
    ],
  },
  {
    id: 'fa1e5b90-011d-4e54-8668-33d23df6a5b2',
    fachbereich: 'BWL',
    musterlosung: `Bei der Sacheinlage bringt die Inhaberin ein privates Fahrzeug in den Betrieb ein. Die Fahrzeuge (Aktivkonto) nehmen zu und stehen im Soll. Das Eigenkapital (Passivkonto) nimmt zu und steht im Haben. Buchungssatz: Fahrzeuge an Eigenkapital 15'000. Es entsteht keine Schuld — nur die Eigenfinanzierung des Betriebs wächst (Bilanzverlängerung).`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_4f554322', text: `Fahrzeuge (1500, Aktivkonto) nehmen im Soll zu, Eigenkapital (2800, Passivkonto) nimmt im Haben zu. Sacheinlage erhöht die Eigenfinanzierung.` },
    ],
  },
  {
    id: 'fa2260e9-29c1-4b2a-ab6a-713875353b32',
    fachbereich: 'BWL',
    musterlosung: `Die Maschine mit Buchwert 8'000 wird für 6'000 verkauft — es entsteht ein Buchverlust von 2'000. Erste Buchung: Debitoren an Maschinen 6'000 (Verkaufserlös). Zweite Buchung: Ausserordentlicher Aufwand an Maschinen 2'000 (Buchverlust). Das Maschinenkonto wird insgesamt um 8'000 entlastet und damit ausgebucht.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_172f1b80', text: `Debitoren (1100, Aktivkonto) nehmen im Soll zu — Forderung zum Verkaufspreis 6'000. Maschinen (1500, Aktivkonto) nehmen im Haben ab.` },
      { feld: 'buchungen', id: 'b_834428e8', text: `Ausserordentlicher Aufwand (6900) nimmt im Soll zu, Maschinen (1500) nehmen im Haben ab. Buchverlust = Buchwert 8'000 minus Erlös 6'000.` },
    ],
  },
  {
    id: 'fc7be466-0e99-45d0-b4f4-deb77816b6f3',
    fachbereich: 'BWL',
    musterlosung: `Bei der direkten Abschreibung wird das Anlagekonto unmittelbar um den Wertverlust reduziert. Die Abschreibungen (Aufwandkonto) nehmen zu und stehen im Soll. Die Maschinen (Aktivkonto) nehmen ab und stehen im Haben. Buchungssatz: Abschreibungen an Maschinen 4'000. Das Maschinenkonto zeigt nach der Buchung direkt den neuen Buchwert.`,
    teilerklaerungen: [
      { feld: 'buchungen', id: 'b_a341d8b5', text: `Abschreibungen (6800, Aufwand) nehmen im Soll zu, Maschinen (1500, Aktivkonto) nehmen im Haben ab. Direkte Methode ohne Minus-Aktivkonto.` },
    ],
  },

  // ===== BWL/code (1) =====
  {
    id: 'ueb-code-python',
    fachbereich: 'BWL',
    musterlosung: `Eine Primzahl ist eine natürliche Zahl grösser als 1, die nur durch 1 und sich selbst teilbar ist. Für n kleiner als 2 gibt die Funktion direkt False zurück. Für grössere Zahlen werden alle möglichen Teiler von 2 bis zur Wurzel von n geprüft; findet sich ein Teiler, ist n keine Primzahl und die Funktion gibt False zurück. Andernfalls True.`,
    teilerklaerungen: [],
  },

  // ===== BWL/dragdrop_bild (6) =====
  {
    id: '3d6f7e54-86e5-4214-8563-edcde53b63b3',
    fachbereich: 'BWL',
    musterlosung: `Der Marketing-Mix (4P) bündelt Instrumente der Absatzpolitik. Product umfasst das Leistungsangebot — Sortiment, Qualität, Design, Verpackung. Price regelt Preisstrategien und Rabatte. Place betrifft Distributionskanäle wie Filiale oder Online-Shop. Promotion meint die Kommunikation mit Werbung, PR und Social Media. Die vier Instrumente werden aufeinander abgestimmt.`,
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'product', text: `Verpackungsdesign gestaltet das Produkt selbst und prägt dessen Wahrnehmung — klassisches Instrument der Produktpolitik.` },
      { feld: 'zielzonen', id: 'price', text: `Rabattaktionen verändern den Verkaufspreis direkt — typische Massnahme der Preispolitik (Price).` },
      { feld: 'zielzonen', id: 'place', text: `Ein Online-Shop ist ein Distributionskanal — Teil der Place-Entscheidung, wie das Angebot zur Kundschaft gelangt.` },
      { feld: 'zielzonen', id: 'promotion', text: `Ein TV-Werbespot ist ein Kommunikationsinstrument und gehört zur Promotionspolitik.` },
    ],
  },
  {
    id: '756aa15b-6db2-471c-9fec-b683edd5b95b',
    fachbereich: 'BWL',
    musterlosung: `Die Bilanz gliedert Aktiven in Umlauf- (UV) und Anlagevermögen (AV), Passiven in Fremd- (FK) und Eigenkapital (EK). UV umfasst kurzfristig verfügbare Mittel und Forderungen, AV langfristig genutzte Vermögenswerte. FK sind Schulden gegenüber Dritten, EK die Eigenfinanzierung der Inhaberin. Diese Grundgliederung bildet die Basis jeder Bilanzanalyse.`,
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'uv', text: `Kasse ist Bargeld und sofort verfügbar — typische Position des Umlaufvermögens.` },
      { feld: 'zielzonen', id: 'av', text: `Maschinen werden langfristig zur Leistungserstellung genutzt — sie gehören zum Anlagevermögen.` },
      { feld: 'zielzonen', id: 'fk', text: `Kreditoren sind offene Schulden an Lieferanten — Teil des Fremdkapitals.` },
      { feld: 'zielzonen', id: 'ek', text: `Eigenkapital ist die Eigenfinanzierung durch die Inhaberin — keine Schuld, sondern Residualgrösse.` },
    ],
  },
  {
    id: '8df88023-d8db-4fd3-92ec-9e80ffac0476',
    fachbereich: 'BWL',
    musterlosung: `Güter werden nach Knappheit und Zugang kategorisiert. Freie Güter sind unbegrenzt verfügbar und kostenlos — zum Beispiel Sonnenlicht oder Luft in unbelasteter Umgebung. Wirtschaftliche Güter sind knapp und haben einen Preis, etwa ein Smartphone. Öffentliche Güter werden vom Staat bereitgestellt und sind nicht-rivalisierend sowie nicht-ausschliessbar, wie die Strassenbeleuchtung.`,
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'frei', text: `Sonnenlicht steht unbegrenzt allen zur Verfügung und kostet nichts — klassisches freies Gut.` },
      { feld: 'zielzonen', id: 'wirtschaftlich', text: `Ein Smartphone ist knapp und wird nur gegen Bezahlung abgegeben — wirtschaftliches Gut.` },
      { feld: 'zielzonen', id: 'oeffentlich', text: `Strassenbeleuchtung wird staatlich bereitgestellt, nicht-rivalisierend und nicht-ausschliessbar — öffentliches Gut.` },
    ],
  },
  {
    id: 'd71790b8-2771-49dd-9eb6-066273a72d3e',
    fachbereich: 'BWL',
    musterlosung: `Die Umweltsphären beschreiben externe Einflüsse auf ein Unternehmen. Die technologische Sphäre betrifft Innovation und Digitalisierung. Die ökonomische Sphäre umfasst Konjunktur, Wechselkurse und Arbeitsmarkt. Die soziale Sphäre betrifft Demografie, Normen und Werte. Die ökologische Sphäre betrifft Klima, Ressourcen und Umweltauflagen. Die rechtliche Sphäre ergänzt das Modell.`,
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'tech', text: `Digitalisierung verändert Produkte und Prozesse — zentrale Entwicklung der technologischen Sphäre.` },
      { feld: 'zielzonen', id: 'oeko', text: `Die Konjunkturlage beeinflusst Nachfrage und Finanzierung — typische ökonomische Sphäre.` },
      { feld: 'zielzonen', id: 'sozial', text: `Der demografische Wandel betrifft Altersstruktur und Arbeitsangebot — soziale Sphäre.` },
      { feld: 'zielzonen', id: 'oekol', text: `Der Klimawandel bedroht Ressourcen und Standorte — zentrale Herausforderung der ökologischen Sphäre.` },
    ],
  },
  {
    id: 'e17783c7-a3e8-4f45-a069-f5f0a06bcfba',
    fachbereich: 'BWL',
    musterlosung: `Güter werden nach Knappheit und Zugang kategorisiert. Freie Güter sind unbegrenzt verfügbar und kostenlos — zum Beispiel Sonnenlicht oder Luft in unbelasteter Umgebung. Wirtschaftliche Güter sind knapp und haben einen Preis, etwa ein Smartphone. Öffentliche Güter werden vom Staat bereitgestellt und sind nicht-rivalisierend sowie nicht-ausschliessbar, wie die Strassenbeleuchtung.`,
    teilerklaerungen: [
      { feld: 'zielzonen', id: 'frei', text: `Sonnenlicht steht unbegrenzt allen zur Verfügung und kostet nichts — klassisches freies Gut.` },
      { feld: 'zielzonen', id: 'wirtschaftlich', text: `Ein Smartphone ist knapp und wird nur gegen Bezahlung abgegeben — wirtschaftliches Gut.` },
      { feld: 'zielzonen', id: 'oeffentlich', text: `Strassenbeleuchtung wird staatlich bereitgestellt, nicht-rivalisierend und nicht-ausschliessbar — öffentliches Gut.` },
    ],
  },
  {
    id: 'fcb84a42-343b-42f3-b6a4-65e3439ccd1f',
    fachbereich: 'BWL',
    musterlosung: `Die SWOT-Analyse trennt interne und externe Faktoren. Stärken (Strengths) und Schwächen (Weaknesses) beschreiben die interne Sicht: Was kann das Unternehmen gut oder schlecht? Chancen (Opportunities) und Risiken (Threats) beschreiben die externe Umwelt: Welche Trends bieten Potenzial, welche bedrohen den Erfolg? Die Analyse stützt die strategische Positionierung.`,
    teilerklaerungen: [
      { feld: 'zielzonen', id: 's', text: `Eine starke Marke ist ein interner Wettbewerbsvorteil — klassische Stärke des Unternehmens.` },
      { feld: 'zielzonen', id: 'w', text: `Hohe Fixkosten sind eine interne Belastung und reduzieren die Flexibilität — typische Schwäche.` },
      { feld: 'zielzonen', id: 'o', text: `Ein wachsender Markt bietet externe Absatzmöglichkeiten — eine Chance aus der Umwelt.` },
      { feld: 'zielzonen', id: 't', text: `Neue Konkurrenten bedrohen die bestehende Marktstellung — externes Risiko für das Unternehmen.` },
    ],
  },

  // ===== BWL/freitext (1) =====
  {
    id: 'einr-ft-morgen',
    fachbereich: 'BWL',
    musterlosung: `Die Aufgabe dient der Einführung in den Texteditor. Der konkrete Inhalt ist zweitrangig — erwartet werden drei bis fünf sinnvolle Sätze zum eigenen Morgen. Bewertet wird die korrekte Bedienung: sachgerechte Sätze und die Nutzung einer Aufzählungsliste über das Listen-Symbol in der Formatierungsleiste. Die Eingabe zeigt die Grundfunktionen des Editors.`,
    teilerklaerungen: [],
  },

  // ===== BWL/hotspot (5) =====
  {
    id: '0a46a243-794d-4ba8-8904-9279f9ea675a',
    fachbereich: 'BWL',
    musterlosung: `Die Frage greift Porters Wettbewerbsstrategien auf. Kostenführerschaft bedeutet, auf dem Gesamtmarkt den niedrigsten Preis anzubieten — erreicht durch Skaleneffekte, Effizienz und tiefe Stückkosten. Differenzierung setzt dagegen auf einzigartige Produkteigenschaften und höhere Preise. Die beiden Fokus-Strategien beschränken sich jeweils auf eine Marktnische. Die richtige Antwort ist Kostenführerschaft (A).`,
    teilerklaerungen: [
      { feld: 'bereiche', id: 'b_four1a5j', text: `Kostenführerschaft (A) — korrekt. Gesamtmarkt mit niedrigstem Preis über Kostenvorteile und Skaleneffekte.` },
      { feld: 'bereiche', id: 'b_2s9pbppk', text: `Differenzierung (B) — falsch. Denkfehler: Einzigartigkeit führt zu höheren Preisen, nicht zum niedrigsten Preis.` },
      { feld: 'bereiche', id: 'b_rj53j29q', text: `Kostenfokus (C) — falsch. Die Strategie zielt nur auf ein Nischensegment, nicht auf den Gesamtmarkt.` },
      { feld: 'bereiche', id: 'b_ry1j6fmn', text: `Differenzierungsfokus (D) — falsch. Nischenstrategie mit Einzigartigkeit, nicht mit Preisführerschaft.` },
    ],
  },
  {
    id: 'b51f078b-3f1c-4586-a5f7-72fcea7f1a97',
    fachbereich: 'BWL',
    musterlosung: `In der BCG-Matrix werden Produkte nach Marktanteil und Marktwachstum gegliedert. Cash Cows haben einen hohen Marktanteil und niedriges Marktwachstum — sie generieren stabile Gewinne bei geringen Investitionen und finanzieren Stars und Question Marks. Stars wachsen stark bei hohem Anteil, Question Marks brauchen Investitionen, Dogs sind Desinvestitions-Kandidaten.`,
    teilerklaerungen: [
      { feld: 'bereiche', id: 'b_3ae2cjvf', text: `Stars (A) — falsch. Hohes Wachstum und hoher Anteil, brauchen aber noch Investitionen — kein stabiler Nettocashflow.` },
      { feld: 'bereiche', id: 'b_agquh6oj', text: `Question Marks (B) — falsch. Tiefer Anteil im Wachstumsmarkt — brauchen Kapital, liefern aber kaum Gewinne.` },
      { feld: 'bereiche', id: 'b_89i85k7x', text: `Cash Cows (C) — korrekt. Hoher Marktanteil in reifem Markt — stabiler Cashflow bei geringen Investitionen.` },
      { feld: 'bereiche', id: 'b_jhjyh6s1', text: `Dogs (D) — falsch. Tiefer Anteil und tiefes Wachstum — typische Desinvestitions-Kandidaten.` },
    ],
  },
  {
    id: 'd9ab7fa2-7281-46ab-a16a-a7d2dc7ad177',
    fachbereich: 'BWL',
    musterlosung: `In der BCG-Matrix werden Produkte nach Marktanteil und Marktwachstum gegliedert. Cash Cows haben einen hohen Marktanteil und niedriges Marktwachstum — sie generieren stabile Gewinne bei geringen Investitionen und finanzieren Stars und Question Marks. Stars wachsen stark bei hohem Anteil, Question Marks brauchen Investitionen, Dogs sind Desinvestitions-Kandidaten.`,
    teilerklaerungen: [
      { feld: 'bereiche', id: 'b_9o8ws1pt', text: `Stars (A) — falsch. Hohes Wachstum und hoher Anteil, brauchen aber noch Investitionen — kein stabiler Nettocashflow.` },
      { feld: 'bereiche', id: 'b_t1ubgw19', text: `Question Marks (B) — falsch. Tiefer Anteil im Wachstumsmarkt — brauchen Kapital, liefern aber kaum Gewinne.` },
      { feld: 'bereiche', id: 'b_0qywc0gu', text: `Cash Cows (C) — korrekt. Hoher Marktanteil in reifem Markt — stabiler Cashflow bei geringen Investitionen.` },
      { feld: 'bereiche', id: 'b_popxzl11', text: `Dogs (D) — falsch. Tiefer Anteil und tiefes Wachstum — typische Desinvestitions-Kandidaten.` },
    ],
  },
  {
    id: 'einr-hs-europa',
    fachbereich: 'BWL',
    musterlosung: `Die Einführungsaufgabe dient dem Kennenlernen der Hotspot-Interaktion. Die Schweiz liegt zentral in Europa — südlich von Deutschland, westlich von Österreich und nördlich von Italien. Auf der Karte der Aufgabe befindet sie sich ungefähr bei x = 48 % und y = 55 %. Bewertet wird, ob der Klick innerhalb des zulässigen Toleranzbereichs landet.`,
    teilerklaerungen: [],
  },
  {
    id: 'f74081dc-94d8-4fac-b171-aa2e030d07c2',
    fachbereich: 'BWL',
    musterlosung: `Die soziale Umweltsphäre umfasst gesellschaftliche Rahmenbedingungen — insbesondere Gesetze, soziale Normen, Werte sowie demografische Entwicklungen. Die technologische Sphäre betrifft Digitalisierung und Innovation, die ökonomische Sphäre Konjunktur und Märkte, die ökologische Sphäre Umwelt und Ressourcen. Die richtige Antwort ist deshalb die soziale Sphäre (C).`,
    teilerklaerungen: [
      { feld: 'bereiche', id: 'b_utuxvx91', text: `Technologische Sphäre (A) — falsch. Betrifft Digitalisierung und Innovation, nicht Gesetze oder Demografie.` },
      { feld: 'bereiche', id: 'b_3w1339sa', text: `Ökonomische Sphäre (B) — falsch. Umfasst Konjunktur, Wechselkurse und Arbeitsmarkt.` },
      { feld: 'bereiche', id: 'b_vb36x5r1', text: `Soziale Sphäre (C) — korrekt. Umfasst Gesetze, Normen, Werte und demografische Entwicklungen.` },
      { feld: 'bereiche', id: 'b_qqaa3gua', text: `Ökologische Sphäre (D) — falsch. Betrifft Klima, Ressourcen und Umweltauflagen.` },
    ],
  },

  // ===== BWL/kontenbestimmung (5) =====
  {
    id: '5df92747-3f96-4ddf-9d86-c94a4c621154',
    fachbereich: 'BWL',
    musterlosung: `Bei der Kontenbestimmung wird jedem Geschäftsfall geklärt, welche Kontentypen betroffen sind und welche Zu- oder Abnahmen die Buchung auslöst. Maschinenkauf auf Kredit: Aktivzunahme (Maschinen) und Passivzunahme (Kreditoren). Direkte Abschreibung: Aufwandzunahme und Aktivabnahme. Darlehensrückzahlung per Bank: Passivabnahme und Aktivabnahme — Bilanzverkürzung.`,
    teilerklaerungen: [
      { feld: 'aufgaben', id: '5df92747-3f96-4ddf-9d86-c94a4c621154-0', text: `Maschinen (Aktivkonto) nehmen zu, Kreditoren (Passivkonto) nehmen zu — Bilanzverlängerung durch Kreditkauf.` },
      { feld: 'aufgaben', id: '5df92747-3f96-4ddf-9d86-c94a4c621154-1', text: `Abschreibungen (Aufwandkonto) nehmen zu, Maschinen (Aktivkonto) nehmen ab — erfolgswirksamer Wertverlust.` },
      { feld: 'aufgaben', id: '5df92747-3f96-4ddf-9d86-c94a4c621154-2', text: `Bankdarlehen (Passivkonto) nimmt ab, Bank (Aktivkonto) nimmt ab — Bilanzverkürzung durch Schuldentilgung.` },
    ],
  },
  {
    id: '784e1c23-aa22-46ad-994e-5c49960f9cc2',
    fachbereich: 'BWL',
    musterlosung: `Die drei Geschäftsfälle zeigen unterschiedliche Bilanz- und Erfolgsauswirkungen. Lohnzahlung per Bank: Aufwandzunahme und Aktivabnahme. Bareinzahlung auf Bankkonto: reiner Aktivtausch — Kasse nimmt ab, Bank zu. Barverkauf von Waren: Aktivzunahme (Kasse) und Ertragszunahme (Warenertrag). Zwei erfolgswirksame Fälle, einer erfolgsneutral.`,
    teilerklaerungen: [
      { feld: 'aufgaben', id: '784e1c23-aa22-46ad-994e-5c49960f9cc2-0', text: `Lohnaufwand (Aufwandkonto) nimmt zu, Bank (Aktivkonto) nimmt ab — erfolgswirksame Ausgabe.` },
      { feld: 'aufgaben', id: '784e1c23-aa22-46ad-994e-5c49960f9cc2-1', text: `Bank (Aktivkonto) nimmt zu, Kasse (Aktivkonto) nimmt ab — reiner Aktivtausch, erfolgsneutral.` },
      { feld: 'aufgaben', id: '784e1c23-aa22-46ad-994e-5c49960f9cc2-2', text: `Kasse (Aktivkonto) nimmt zu, Warenertrag (Ertragskonto) nimmt zu — erfolgswirksamer Barverkauf.` },
    ],
  },
  {
    id: '95138ed7-24ae-41b3-bdde-09bee556b2b5',
    fachbereich: 'BWL',
    musterlosung: `Beide Geschäftsfälle sind erfolgswirksam und verändern das Eigenkapital. Barverkauf von Waren: Kasse (Aktivkonto) nimmt zu im Soll, Warenertrag (Ertragskonto) nimmt zu im Haben. Wareneinkauf auf Kredit: Warenaufwand (Aufwandkonto) nimmt zu im Soll, Kreditoren (Passivkonto) nehmen zu im Haben. Beide Fälle beeinflussen den Periodengewinn.`,
    teilerklaerungen: [
      { feld: 'aufgaben', id: '95138ed7-24ae-41b3-bdde-09bee556b2b5-0', text: `Kasse (Aktivkonto) nimmt zu, Warenertrag (Ertragskonto) nimmt zu — erfolgswirksamer Barverkauf.` },
      { feld: 'aufgaben', id: '95138ed7-24ae-41b3-bdde-09bee556b2b5-1', text: `Warenaufwand (Aufwandkonto) nimmt zu, Kreditoren (Passivkonto) nehmen zu — Einkauf auf Kredit.` },
    ],
  },
  {
    id: 'f0fb8c2e-901c-4c2e-86f6-dc98888c8e30',
    fachbereich: 'BWL',
    musterlosung: `Die drei Fälle decken verschiedene Bilanz- und Erfolgsauswirkungen ab. Miete per Bank: Aufwandzunahme (Mietaufwand) und Aktivabnahme (Bank). Rückzahlung Bankdarlehen: Passivabnahme (Darlehen) und Aktivabnahme (Bank) — Bilanzverkürzung. Debitorenzahlung bar: Aktivzunahme (Kasse) und Aktivabnahme (Debitoren) — reiner Aktivtausch.`,
    teilerklaerungen: [
      { feld: 'aufgaben', id: 'f0fb8c2e-901c-4c2e-86f6-dc98888c8e30-0', text: `Mietaufwand (Aufwandkonto) nimmt zu, Bank (Aktivkonto) nimmt ab — erfolgswirksamer Betriebsaufwand.` },
      { feld: 'aufgaben', id: 'f0fb8c2e-901c-4c2e-86f6-dc98888c8e30-1', text: `Darlehen (Passivkonto) nimmt ab, Bank (Aktivkonto) nimmt ab — Bilanzverkürzung durch Schuldentilgung.` },
      { feld: 'aufgaben', id: 'f0fb8c2e-901c-4c2e-86f6-dc98888c8e30-2', text: `Kasse (Aktivkonto) nimmt zu, Debitoren (Aktivkonto) nehmen ab — reiner Aktivtausch, erfolgsneutral.` },
    ],
  },
  {
    id: 'ueb-kb-kategorien',
    fachbereich: 'BWL',
    musterlosung: `Die vier Grundkategorien der Buchhaltung sind Aktiv, Passiv, Aufwand und Ertrag. Aktivkonten wie die Kasse zeigen Vermögenswerte. Passivkonten wie das Eigenkapital zeigen Finanzierungsquellen. Aufwandkonten wie der Warenaufwand erfassen erfolgsmindernde Posten. Ertragskonten wie der Warenertrag erfassen erfolgssteigernde Posten. Die Einordnung ist die Basis jedes Buchungssatzes.`,
    teilerklaerungen: [
      { feld: 'aufgaben', id: 'kb-kasse', text: `Kasse (1000) ist ein Aktivkonto — Bargeldbestand gehört zum Vermögen des Unternehmens.` },
      { feld: 'aufgaben', id: 'kb-warenaufwand', text: `Warenaufwand (4200) ist ein Aufwandkonto — erfasst Kosten für eingekaufte Waren und mindert den Gewinn.` },
      { feld: 'aufgaben', id: 'kb-warenertrag', text: `Warenertrag (3200) ist ein Ertragskonto — erfasst Erlöse aus dem Verkauf von Waren.` },
      { feld: 'aufgaben', id: 'kb-eigenkapital', text: `Eigenkapital (2800) ist ein Passivkonto — zeigt die Eigenfinanzierung durch die Inhaberin.` },
    ],
  },

  // ===== BWL/lueckentext (13) =====
  {
    id: '021c6b4b-bf15-4540-aa32-26490672f0a3',
    fachbereich: 'BWL',
    musterlosung: `Kundinnen und Kunden sind eine zentrale externe Anspruchsgruppe des Unternehmens. Sie erwarten ein gutes Preis-Leistungs-Verhältnis, Zusatzleistungen (Service, Beratung, Garantie) und einen zuverlässigen Service. Ihre Erwartungen beeinflussen Produktgestaltung, Preispolitik und Servicequalität direkt und bilden einen strategischen Kompass. Andere Anspruchsgruppen wie Lieferanten oder der Staat setzen andere Schwerpunkte.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Kundinnen und Kunden» (Kundschaft). Typische Ansprüche: Preis-Leistung, Zusatzleistungen, Service — nicht mit anderen Anspruchsgruppen verwechseln.` },
    ],
  },
  {
    id: '05f19276-6977-4248-bc96-0ed86147a74c',
    fachbereich: 'BWL',
    musterlosung: `Die Telefonrechnung ist ein Sach- oder Verwaltungsaufwand. Der Telefonaufwand (Aufwandkonto) nimmt zu und steht im Soll. Die Kasse (Aktivkonto) nimmt ab und steht im Haben. Buchungssatz: Telefonaufwand an Kassa 350. Die Buchung ist erfolgswirksam und mindert den Gewinn der Periode um 350 CHF.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Telefonaufwand» (oder Übriger Aufwand). Aufwandkonto — Zunahme steht im Soll.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Kassa». Aktivkonto Bargeld — Abnahme steht im Haben.` },
    ],
  },
  {
    id: '0ad537a0-151f-4aa6-a3bd-ce594c6965fb',
    fachbereich: 'BWL',
    musterlosung: `Marktdurchdringung (Marktpenetration) ist eine Strategie der Ansoff-Matrix: Bestehende Produkte werden auf bestehenden Märkten intensiver vermarktet. Typische Massnahmen sind mehr Werbung, Preisaktionen oder besserer Service. Ziel ist es, Marktanteile gegenüber der Konkurrenz zu gewinnen — ohne neue Produkte zu entwickeln oder neue Märkte zu erschliessen.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Marktpenetration» (Marktdurchdringung). Ansoff: alter Markt, altes Produkt, intensivere Bearbeitung.` },
    ],
  },
  {
    id: '12644938-2292-4880-ad50-d8b8963263bd',
    fachbereich: 'BWL',
    musterlosung: `USP steht für Unique Selling Proposition — das einmalige Verkaufsargument eines Angebots. Die USP beruht auf objektiven Produkteigenschaften wie Qualität, Technologie oder Service. Sie grenzt ein Angebot klar von der Konkurrenz ab und ist zentraler Ankerpunkt der Positionierung, Werbung und Preisstrategie.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «unique selling proposition». Englischer Fachbegriff — objektives Alleinstellungsmerkmal als Basis der Positionierung.` },
    ],
  },
  {
    id: '13adeb59-d409-4e86-9a88-0104fdc7fb90',
    fachbereich: 'BWL',
    musterlosung: `Zwischen Unternehmenszielen gibt es drei mögliche Beziehungen. Zielharmonie: Ein Ziel fördert das andere (z. B. Qualität und Kundenzufriedenheit). Zielneutralität: Die Ziele beeinflussen sich nicht gegenseitig. Zielkonflikt (Zielkonkurrenz): Die Ziele behindern sich gegenseitig, etwa tiefe Kosten gegenüber hoher Qualität. Die Unternehmensleitung muss Konflikte erkennen und priorisieren.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Zielharmonie». Gegenseitige Förderung der Ziele — das Erreichen des einen begünstigt das andere.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Konflikt» (oder Zielkonflikt/Zielkonkurrenz). Gegenseitige Behinderung — erfordert Priorisierung.` },
    ],
  },
  {
    id: '15d6c8fc-f30f-4d11-a11d-bd46b7bf7893',
    fachbereich: 'BWL',
    musterlosung: `Eine private Ausgabe des Eigentümers darf nicht als Betriebsaufwand erscheinen. Das Privatkonto (Unterkonto des Eigenkapitals) nimmt zu und steht im Soll. Die Bank (Aktivkonto) nimmt ab und steht im Haben. Buchungssatz: Privatkonto an Bankkonto 400. Am Jahresende wird das Privatkonto gegen das Eigenkapital abgeschlossen.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Privatkonto». Unterkonto des Eigenkapitals — Privatbezüge stehen im Soll und senken indirekt das Eigenkapital.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Bankkonto». Aktivkonto — Abnahme steht im Haben.` },
    ],
  },
  {
    id: '1be40986-1d20-454d-909d-1614168b8e83',
    fachbereich: 'BWL',
    musterlosung: `Strategische Erfolgspotenziale sind dauerhafte Fähigkeiten und Kompetenzen, die einem Unternehmen Wettbewerbsvorteile verschaffen — beispielsweise besonderes Know-how, eine starke Marke, Zugang zu wichtigen Ressourcen oder enge Kundenbeziehungen. Sie sind schwer imitierbar und bilden die Grundlage langfristig überdurchschnittlicher Leistung gegenüber der Konkurrenz.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Erfolgspotentiale». Dauerhafte, schwer imitierbare Stärken als Basis nachhaltiger Wettbewerbsvorteile.` },
    ],
  },
  {
    id: '20ba293a-cdee-4297-a60e-966808bde108',
    fachbereich: 'BWL',
    musterlosung: `Der Computerkauf per Bank ist ein Aktivtausch innerhalb der Bilanz. Die Mobilien bzw. Informatikausstattung (Aktivkonto) nimmt zu und steht im Soll. Die Bank (Aktivkonto) nimmt ab und steht im Haben. Buchungssatz: Informatik an Bankkonto 2'500. Bilanzsumme und Eigenkapital bleiben unverändert.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Informatik» (oder EDV). Aktivkonto für IT-Geräte — Zunahme steht im Soll.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Bankkonto». Aktivkonto — Abnahme steht im Haben.` },
    ],
  },
  {
    id: '21572d05-5f18-4730-b8ec-fb5bc489fe12',
    fachbereich: 'BWL',
    musterlosung: `Der absolute Marktanteil gibt an, welchen Prozentsatz des gesamten Marktvolumens ein Unternehmen erwirtschaftet. Formel: Marktanteil = (eigener Umsatz / Marktvolumen) × 100. Ein hoher Marktanteil deutet auf Marktmacht und oft Grössenvorteile hin, ist aber nur im Branchenvergleich aussagekräftig. Er ergänzt den relativen Marktanteil (gegenüber dem stärksten Wettbewerber).`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Marktanteil» (absoluter Marktanteil). Anteil in Prozent am gesamten Marktvolumen.` },
    ],
  },
  {
    id: '22aad7e1-eaf3-444b-952b-cfe2bca27d84',
    fachbereich: 'BWL',
    musterlosung: `Materielle Güter (Sachgüter) lassen sich nach Verwendungszweck unterteilen. Konsumgüter dienen dem direkten privaten Verbrauch — zum Beispiel Lebensmittel, Kleidung oder Bücher. Investitionsgüter werden zur Erstellung weiterer Güter eingesetzt — Maschinen, Werkzeuge oder Fahrzeuge. Die Unterscheidung ist wichtig für Absatz-, Beschaffungs- und Produktionsanalysen.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Konsumgueter». Güter für den direkten privaten Verbrauch (Lebensmittel, Kleidung).` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «Investitionsgueter». Güter zur Erstellung weiterer Güter — typisch Maschinen und Werkzeuge.` },
    ],
  },
  {
    id: '23b59d6a-50d0-4233-bf10-7dcf82f72c9f',
    fachbereich: 'BWL',
    musterlosung: `Das Belegprinzip ist ein Grundsatz ordnungsmässiger Rechnungslegung: Jede Buchung muss durch ein Dokument nachweisbar sein — Rechnung, Quittung, Kontoauszug oder interner Beleg. So bleibt die Buchhaltung nachvollziehbar und prüfbar. Ohne Beleg ist keine Buchung zulässig, weil die tatsächliche Grundlage des Geschäftsfalls fehlt.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Beleg» (oder Dokument). Grundsatz «Keine Buchung ohne Beleg» — Basis der Nachprüfbarkeit.` },
    ],
  },
  {
    id: '28386ba4-e5e1-4e7f-8cf4-a56dc4883a12',
    fachbereich: 'BWL',
    musterlosung: `Entnimmt die Eigentümerin Waren für den privaten Gebrauch, wird der Vorgang zum Einstandspreis gebucht. Das Privatkonto (via Eigenverbrauch) nimmt zu und steht im Soll. Der Wareneinkauf (WE) wird entsprechend reduziert und steht im Haben. Buchungssatz: Eigenverbrauch an Wareneinkauf 200. Der Warenaufwand der Periode wird korrigiert.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Eigenverbrauch» (oder Privatbezug). Korrekturkonto zum Privatkonto bei Warenentnahme für private Zwecke.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «WE» (Wareneinkauf). Aufwandkonto — wird durch Privatentnahme zum Einstandspreis entlastet.` },
    ],
  },
  {
    id: '28621841-cb6e-4962-a2ce-b796c927fe30',
    fachbereich: 'BWL',
    musterlosung: `Soll-Delkrederebestand: 5 % von 80'000 = 4'000 CHF. Bestehend sind 2'000, also muss das Delkredere um 2'000 erhöht werden. Debitorenverluste (Aufwandkonto) nehmen zu und stehen im Soll. Delkredere (Minus-Aktivkonto) nimmt zu und steht im Haben. Buchungssatz: Debitorenverlust an Delkredere 2'000. Die Forderungsbewertung bleibt vorsichtig.`,
    teilerklaerungen: [
      { feld: 'luecken', id: 'luecke-0', text: `Lücke 0 = «Debitorenverlust». Aufwandkonto für erwartete Forderungsausfälle — Zunahme steht im Soll.` },
      { feld: 'luecken', id: 'luecke-1', text: `Lücke 1 = «DK» (Delkredere). Minus-Aktivkonto zu den Debitoren — Zunahme steht im Haben.` },
    ],
  },
]

async function main() {
  const stateRaw = await fs.readFile(STATE, 'utf8')
  const state = JSON.parse(stateRaw)
  state.fragen = state.fragen || {}

  const outLines = []
  let done = 0
  const now = new Date().toISOString()

  for (const u of updates) {
    const existing = state.fragen[u.id]
    if (existing && existing.status === 'done') {
      console.warn(`skip already done: ${u.id}`)
      continue
    }
    outLines.push(JSON.stringify(u))
    state.fragen[u.id] = {
      status: 'done',
      zeitpunkt: now,
      teile: u.teilerklaerungen.length,
    }
    done++
  }

  state.verarbeitet = (state.verarbeitet || 0) + done
  state.letzteSession = now

  await fs.appendFile(OUT, outLines.join('\n') + (outLines.length ? '\n' : ''), 'utf8')
  await fs.writeFile(STATE, JSON.stringify(state, null, 2), 'utf8')

  console.log(`Session 27: ${done} verarbeitet, total ${state.verarbeitet}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
