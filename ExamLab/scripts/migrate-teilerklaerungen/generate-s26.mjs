#!/usr/bin/env node
/**
 * Session 26: 50 Fragen.
 * 6 VWL/zuordnung (keine Sub-IDs → keine Teilerklärungen)
 * 5 BWL/aufgabengruppe (keine Sub-Struktur)
 * 29 BWL/berechnung (keine Sub-Struktur)
 * 4 BWL/bilanzstruktur (Teilerklärungen pro kontenMitSaldi, ID=kontonummer)
 * 6 BWL/bildbeschriftung (Teilerklärungen pro beschriftungen, ID=l1..ln)
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'fragen-updates.jsonl')
const STATE = path.join(__dirname, 'state.json')

const updates = [
  // ===== VWL/zuordnung (6) =====
  { id: 'fa06f34a-e851-421e-a977-820b5d7dd234', fachbereich: 'VWL', musterlosung: `Das Maximumprinzip geht von festem Input aus und maximiert den Output — zum Beispiel möglichst viele Lebensmittel für CHF 50 oder die beste Note in 4 Stunden Lernzeit. Das Minimumprinzip fixiert den Output und minimiert den Input — etwa eine Note 5 mit möglichst wenig Lernaufwand oder ein Haus mit möglichst tiefen Baukosten. Entscheidend ist, welche Grösse gegeben und welche variabel ist.`, teilerklaerungen: [] },
  { id: 'faeb0062-2202-4769-b4a9-d06d8a9457e0', fachbereich: 'VWL', musterlosung: `Echte öffentliche Güter sind nicht-rival und nicht-ausschliessbar: Landesverteidigung, ein leerer Park oder ein Leuchtturm profitieren alle gleichzeitig. Eine öffentliche Schule oder ein Schwimmbad sind dagegen kapazitätsbegrenzt (rival bei Überfüllung) und prinzipiell ausschliessbar. «Öffentlich» im politischen Sinne (staatlich finanziert) ist also nicht dasselbe wie «öffentlich» im ökonomischen Sinne.`, teilerklaerungen: [] },
  { id: 'fb7c8bbe-653e-4dea-8bd9-1bf50a6413f5', fachbereich: 'VWL', musterlosung: `Jede Sozialversicherung deckt ein spezifisches Risiko ab: Die ALV springt bei Arbeitslosigkeit ein, die IV bei dauerhafter Invalidität. Die Unfallversicherung (UV) trägt Kosten nach Betriebs- und Nichtbetriebsunfällen. Die obligatorische Krankenversicherung (KV) übernimmt Kosten für Arzt- und Spitalbehandlungen. Die Zuordnung folgt dem konkreten Lebensrisiko der betroffenen Person.`, teilerklaerungen: [] },
  { id: 'fc0f1012-f814-49b0-b087-ae3dcfd9081f', fachbereich: 'VWL', musterlosung: `Der nationale Finanzausgleich (NFA) orientiert sich an der Ressourcenstärke pro Kopf. Geberkantone sind wirtschaftsstark und haben tiefe Steuersätze: Zug, Schwyz, Nidwalden, Zürich und Basel-Stadt. Nehmerkantone verfügen über geringere Ressourcen und erhalten Ausgleichszahlungen: Uri, Jura, Glarus, Wallis und Freiburg. Ziel ist eine annähernde Angleichung der öffentlichen Leistungen in allen Kantonen.`, teilerklaerungen: [] },
  { id: 'ff2e32cf-e95a-4da8-9989-4a12f7589453', fachbereich: 'VWL', musterlosung: `Marktversagen liegt vor, wenn der Markt allein kein effizientes Ergebnis liefert — etwa Monopole, externe Effekte wie Umweltverschmutzung, öffentliche Güter oder asymmetrische Information. Staatsversagen entsteht, wenn die staatliche Korrektur das Problem verschlimmert oder neue schafft: übermässige Bürokratie, politisch motivierte Subventionen oder Korruption in der Verwaltung. Beide Fehlerarten rechtfertigen unterschiedliche wirtschaftspolitische Antworten.`, teilerklaerungen: [] },
  { id: 'ueb-zu-emojis', fachbereich: 'VWL', musterlosung: `Die Emojis illustrieren bekannte Schweizer Symbole: 🎓 steht für Bildung, 🏔️ für die Berge, 🧀 für den Käse und 🕐 für die Uhren. Die Frage vermittelt kein Fachwissen, sondern führt in das Antwortformat ein. Über die Dropdown-Menüs auf der rechten Seite wird jedem Emoji der passende Begriff zugeordnet; sie dient als Einführung in die Bedienung.`, teilerklaerungen: [] },

  // ===== BWL/aufgabengruppe (5) =====
  { id: '1b7b85d1-69b1-4e9d-a513-bb4d9bdb12a7', fachbereich: 'BWL', musterlosung: `Bei der linearen Abschreibung wird jedes Jahr ein fester Betrag abgeschrieben, berechnet aus Anschaffungswert und Nutzungsdauer. Die jährliche Abschreibung ergibt sich aus Anschaffungswert geteilt durch Nutzungsdauer. Der Buchwert sinkt gleichmässig und entspricht dem Anschaffungswert abzüglich der kumulierten Abschreibungen. Die lineare Methode ist einfach und wird bei gleichmässiger Nutzung bevorzugt.`, teilerklaerungen: [] },
  { id: '28aac47a-aab8-490a-837d-0129f33dab7a', fachbereich: 'BWL', musterlosung: `Rechnungsabgrenzungen stellen die zeitliche Zuordnung von Aufwand und Ertrag sicher. Vorausbezahlte Aufwände des Folgejahres werden als Transitorische Aktive erfasst, erhaltene Vorauszahlungen als Transitorische Passive. So gehört nur der Teil des laufenden Jahres ins Ergebnis; das Matching-Prinzip wird eingehalten. Am Jahresende wird jeder Posten auf Periodenzugehörigkeit überprüft und bei Bedarf abgegrenzt.`, teilerklaerungen: [] },
  { id: '307e5544-27be-4f58-a8e1-5c2168220f57', fachbereich: 'BWL', musterlosung: `Der Bruttogewinn ist die Differenz zwischen Warenertrag und Warenaufwand und bildet die erste Stufe der dreistufigen Erfolgsrechnung. Er zeigt, wie viel Marge das Kerngeschäft nach Abzug der Einstandskosten liefert. Erst auf den folgenden Stufen werden Betriebs-, Finanz- und ausserordentliche Aufwände abgezogen, bis schliesslich der Jahresgewinn ausgewiesen wird. Der Bruttogewinn ist eine zentrale Handelskennzahl.`, teilerklaerungen: [] },
  { id: '569e3acf-ab64-403e-9372-19f3344f58c7', fachbereich: 'BWL', musterlosung: `Erfolgswirksame Geschäftsfälle verändern das Eigenkapital und damit die Bilanzsumme, weil sie ein Erfolgskonto berühren. Ein Barverkauf erhöht Kasse und indirekt — über das Erfolgskonto Warenertrag — das Eigenkapital. Erfolgsneutrale Buchungen sind reine Aktiv- oder Passivtausche, zum Beispiel eine Kreditorzahlung: Bilanzsumme und Eigenkapital bleiben unverändert, nur Aktiven werden umgeschichtet.`, teilerklaerungen: [] },
  { id: '5dc71093-bf62-42cc-97e8-7b0256e3a030', fachbereich: 'BWL', musterlosung: `Erfolgswirksame Geschäftsfälle berühren mindestens ein Erfolgskonto (Aufwand oder Ertrag) und verändern deshalb das Eigenkapital sowie die Bilanzsumme. Klassische Beispiele sind Lohnzahlung oder Warenverkauf. Erfolgsneutrale Buchungen bleiben innerhalb der Bilanz und sind reine Aktiv- oder Passivtausche: eine Umbuchung von Kasse auf Bank oder die Rückzahlung eines Kreditors verändert das Eigenkapital nicht.`, teilerklaerungen: [] },

  // ===== BWL/berechnung (29) =====
  { id: '18bb5f8f-a06b-44b8-b68a-8b7431545f5d', fachbereich: 'BWL', musterlosung: `Betriebsaufwand (1. Stufe): 175'000 + 80'000 + 15'000 + 25'000 + 15'000 + 10'000 = 320'000. Betriebsgewinn = 395'000 – 320'000 = 75'000. Neutraler Erfolg (2. Stufe): Gewinn Liegenschaft 20'000 – Steueraufwand 13'000 = 7'000. Jahresgewinn = 75'000 + 7'000 = 82'000 CHF.`, teilerklaerungen: [] },
  { id: '1ecd7b88-89ed-4a7a-ab0a-1f0fcdf5b8d6', fachbereich: 'BWL', musterlosung: `Summe der Aktiven: 5'000 + 25'000 + 15'000 + 30'000 + 10'000 + 40'000 = 125'000 CHF. Die Bilanzsumme entspricht dem Total der Aktiven (= Total der Passiven). Fremdkapital: 20'000 + 60'000 = 80'000 CHF. Eigenkapital ergibt sich als Saldogrösse: 125'000 – 80'000 = 45'000 CHF.`, teilerklaerungen: [] },
  { id: '31aa3c2c-7a0b-4fb1-9a68-9352641bbb93', fachbereich: 'BWL', musterlosung: `Der Marktanteil misst die Stellung eines Unternehmens im relevanten Markt und berechnet sich aus Umsatz geteilt durch Marktvolumen. Marktanteil = (72 / 450) × 100 = 16 %. Das Unternehmen bedient also 16 % des Schweizer Sportschuhmarkts. Der Wert ist nur im Branchenvergleich aussagekräftig; ein hoher Marktanteil deutet oft auf Grössenvorteile und Marktmacht hin.`, teilerklaerungen: [] },
  { id: '31eddb7a-57c7-4399-a46e-00859f67e321', fachbereich: 'BWL', musterlosung: `Lineare Abschreibung = Anschaffungswert / Nutzungsdauer = 50'000 / 10 = 5'000 CHF pro Jahr. Der Buchwert sinkt gleichmässig um diesen Betrag. Nach 3 Jahren beträgt die kumulierte Abschreibung 3 × 5'000 = 15'000. Buchwert = 50'000 – 15'000 = 35'000 CHF. Das Konto Abschreibungen erfasst den jährlichen Aufwand.`, teilerklaerungen: [] },
  { id: '3abee956-3bea-4608-8d1a-8e0e671dcb45', fachbereich: 'BWL', musterlosung: `Soll-Bestand Delkredere: 5 % von 120'000 = 6'000 CHF. Ist-Bestand: 8'000. Das Delkredere ist um 2'000 zu hoch und wird aufgelöst. Buchungssatz: Delkredere an Debitorenverluste 2'000. Dadurch sinkt das Minusaktivkonto, und der Aufwand wird entsprechend reduziert (Ertragskorrektur). Die Bewertung bleibt vorsichtig, ohne zu hohe Reserven zu bilden.`, teilerklaerungen: [] },
  { id: '46558d1d-c095-4415-b47a-e8fbeefd39f8', fachbereich: 'BWL', musterlosung: `Marktanteil Roche = (62.1 / 1'162) × 100 ≈ 5.3 %. Marktanteil Sinopharm = (66.3 / 1'162) × 100 ≈ 5.7 %. Relativer Marktanteil Roche = 5.3 / 5.7 ≈ 0.93. Der Wert unter 1 zeigt, dass Roche nicht Marktführer ist; trotzdem liegt der relative Marktanteil sehr nahe bei 1 — Hinweis auf einen zersplitterten, stark umkämpften Pharmamarkt ohne dominanten Anbieter.`, teilerklaerungen: [] },
  { id: '61d5a76e-743c-4fcd-83db-18d439d02f0c', fachbereich: 'BWL', musterlosung: `Bank (Aktivkonto): Soll 45'000 + 15'000 + 8'000 + 22'000 = 90'000. Haben 30'000 + 12'000 + 5'000 = 47'000. Saldo Bank = 90'000 – 47'000 = 43'000 CHF (Sollsaldo). Kreditoren (Passivkonto): Haben 32'000 + 14'000 + 9'000 = 55'000. Soll 18'000 + 7'000 = 25'000. Saldo Kreditoren = 55'000 – 25'000 = 30'000 CHF (Habensaldo).`, teilerklaerungen: [] },
  { id: '685ef6ad-6684-4767-b2fb-829f26a569fd', fachbereich: 'BWL', musterlosung: `Privatkonto (Mischkonto): Haben Eigenlohn 72'000 – Soll Privatbezüge 60'000 = Habensaldo 12'000. Der Saldo wird ins Eigenkapital übertragen und erhöht es. Eigenkapital per 31.12. = 120'000 (Anfang) + 12'000 (Privatsaldo) + 45'000 (Jahresgewinn) = 177'000 CHF. Der Jahresgewinn fliesst via Abschluss der Erfolgsrechnung ins EK.`, teilerklaerungen: [] },
  { id: '6fbd390a-63f6-4c79-823e-865767df9d80', fachbereich: 'BWL', musterlosung: `Bei der degressiven Abschreibung werden jedes Jahr 25 % des aktuellen Buchwerts abgeschrieben. Jahr 1: 60'000 × 25 % = 15'000 → Buchwert 45'000. Jahr 2: 45'000 × 25 % = 11'250 → Buchwert 33'750. Jahr 3: 33'750 × 25 % ≈ 8'438 → Buchwert 25'312. Die Abschreibungsbeträge sinken; diese Methode bildet Wertverlust realistischer ab.`, teilerklaerungen: [] },
  { id: '744c51fd-13a9-4520-b11a-2ad6d4364def', fachbereich: 'BWL', musterlosung: `Nutzwert = Gewichtung × Bewertung. In der Nutzwertanalyse wird die Gewichtung als ganze Prozentzahl (hier 40) mit der Punktbewertung multipliziert, nicht als Dezimalzahl. Für das Kriterium «Kundenfrequenz» ergibt das: 40 × 5 = 200 Nutzwertpunkte. Die Gesamtnutzwerte der Standorte werden am Schluss addiert; der höchste Wert gilt als beste Alternative.`, teilerklaerungen: [] },
  { id: '75f4be0d-1e70-4c21-893d-18860669c0a5', fachbereich: 'BWL', musterlosung: `Der Warenaufwand setzt sich aus Wareneinkauf und Bestandeskorrektur zusammen. Eine Bestandesabnahme erhöht den Warenaufwand, weil zusätzlich aus dem Lager verkauft wurde. Warenaufwand = 300'000 + 10'000 = 310'000 CHF. Bruttogewinn = Warenverkauf – Warenaufwand = 500'000 – 310'000 = 190'000 CHF. Dies ist die erste Stufe der dreistufigen Erfolgsrechnung.`, teilerklaerungen: [] },
  { id: '7d417561-3ac6-4512-811e-992cb69c8e56', fachbereich: 'BWL', musterlosung: `Erträge aufsummieren: Warenverkauf 350'000 + Finanzertrag 4'000 = 354'000. Aufwände: Lohn 120'000 + Miete 36'000 + Abschreibungen 15'000 + Finanzaufwand 8'000 = 179'000. Jahresgewinn = Erträge – Aufwände = 354'000 – 179'000 = 175'000 CHF. Die Erfolgsrechnung weist den Jahresgewinn immer als Saldogrösse aus.`, teilerklaerungen: [] },
  { id: '8e78f5a2-b757-4029-a73c-06f1b8a96567', fachbereich: 'BWL', musterlosung: `Die Bank ist ein Aktivkonto — Zugänge stehen im Soll, Abgänge im Haben, und der Saldo wird auf der Habenseite ausgewiesen. Soll-Total: 30'000 (Anfangsbestand) + 85'000 (Zugänge) = 115'000. Haben-Total: 72'000 (Abgänge). Saldo = 115'000 – 72'000 = 43'000 CHF. Das entspricht dem Endbestand der flüssigen Mittel auf der Bank.`, teilerklaerungen: [] },
  { id: '9e5e5a7a-6faa-47ba-9abc-2a83b0671686', fachbereich: 'BWL', musterlosung: `Der Sättigungsgrad zeigt, wie weit der Markt bereits ausgeschöpft ist. Formel: Sättigungsgrad = (Marktvolumen / Marktpotenzial) × 100 = (520 / 800) × 100 = 65 %. Der Markt hat also noch rund 35 % ungenutztes Wachstumspotenzial. Ein tiefer Sättigungsgrad deutet auf Expansionsmöglichkeiten hin; ein Wert nahe 100 % signalisiert einen gesättigten Markt.`, teilerklaerungen: [] },
  { id: 'a00f0401-fe39-40a2-a6e8-48160f8cc93f', fachbereich: 'BWL', musterlosung: `Warenkalkulation stufenweise: NZEP = Katalogpreis – Rabatt = 10'000 – 20 % = 8'000. NBEP = NZEP – Skonto = 8'000 – 2 % = 7'840. Einstandspreis = NBEP + Bezugsspesen = 7'840 + 350 = 8'190 CHF. Der Einstandspreis bildet die Basis für die weitere Kalkulation (Gemeinkostenzuschlag und Gewinnzuschlag bis zum Verkaufspreis).`, teilerklaerungen: [] },
  { id: 'aaed401d-4ec6-433d-830b-08e88579b86d', fachbereich: 'BWL', musterlosung: `Das Konto Debitoren ist ein Aktivkonto: Rechnungen stehen im Soll (Zunahme), Zahlungen und Verluste im Haben (Abnahme). Soll-Total: 42'000 (AB) + 180'000 (neue Rechnungen) = 222'000. Haben-Total: 165'000 (Zahlungen) + 3'000 (Debitorenverlust) = 168'000. Saldo = 222'000 – 168'000 = 54'000 CHF. Dies ist der Endbestand der offenen Forderungen.`, teilerklaerungen: [] },
  { id: 'ac0d8284-dae8-4ea3-826e-e367dee9def3', fachbereich: 'BWL', musterlosung: `Bruttogewinn = 600'000 – 390'000 = 210'000. Der Bruttogewinnzuschlag bezieht sich auf den Einstand: (210'000 × 100) / 390'000 ≈ 54 %. Die Bruttogewinnquote misst den Bruttogewinn am Umsatz: (210'000 × 100) / 600'000 = 35 %. Zuschlag und Quote beschreiben dieselbe Marge aus unterschiedlicher Perspektive; der Zuschlag ist immer höher als die Quote.`, teilerklaerungen: [] },
  { id: 'b664006e-3234-4ff6-9a48-83718cbfd5fd', fachbereich: 'BWL', musterlosung: `Die Gesamtkapitalrentabilität misst die Verzinsung des gesamten eingesetzten Kapitals, unabhängig von der Finanzierungsstruktur. Zum Gewinn werden deshalb die Fremdkapitalzinsen addiert. Formel: GKR = (Gewinn + Zinsen) / Gesamtkapital × 100 = (200'000 + 50'000) / 2'500'000 × 100 = 10 %. Der Wert erlaubt einen fairen Vergleich zwischen Unternehmen mit unterschiedlichem Verschuldungsgrad.`, teilerklaerungen: [] },
  { id: 'ca394443-b22e-42ff-95c7-41d78b8b90f3', fachbereich: 'BWL', musterlosung: `Der Fahrzeugkauf ist ein Aktivtausch: Der Bestand Fahrzeuge steigt, die Bank sinkt; die Bilanzsumme bleibt unverändert. Fahrzeuge: Anfangsbestand 50'000 + Zugang 30'000 = neuer Saldo 80'000 CHF. Bank: Anfangsbestand 80'000 – Abgang 30'000 = neuer Saldo 50'000 CHF. Buchungssatz: Fahrzeuge an Bank 30'000. Eigenkapital bleibt unverändert.`, teilerklaerungen: [] },
  { id: 'cb40bb6a-9e8e-4000-aecc-90ee3aa7533a', fachbereich: 'BWL', musterlosung: `Kreditoren sind ein Passivkonto: Anfangsbestand und neue Rechnungen stehen im Haben (Zunahme), Zahlungen im Soll (Abnahme). Haben-Total: 18'000 (AB) + 52'000 (neue Rechnungen) = 70'000. Soll-Total: 45'000 (Zahlungen). Saldo (Habenüberschuss) = 70'000 – 45'000 = 25'000 CHF. Dies ist der Endbestand der offenen Lieferantenschulden.`, teilerklaerungen: [] },
  { id: 'd705c1b5-e325-47f2-85bf-0084f6df9356', fachbereich: 'BWL', musterlosung: `Sättigungsgrad = Marktvolumen / Marktpotenzial × 100. Nach Marktvolumen umgestellt: Marktvolumen = Sättigungsgrad × Marktpotenzial / 100 = 58 × 6 Mrd. / 100 = 3.48 Mrd. CHF. Der Schweizer Bio-Markt ist also zu 58 % ausgeschöpft, Wachstumsspielraum besteht bei rund 2.52 Mrd. CHF. Die Umstellung nach einer gesuchten Grösse ist die zentrale Rechenfertigkeit.`, teilerklaerungen: [] },
  { id: 'e9e19dfd-ca78-4f75-ad6e-e4f3af15cd56', fachbereich: 'BWL', musterlosung: `Relativer Marktanteil = eigener Marktanteil / Marktanteil des grössten Konkurrenten. Für Unternehmen A: 8 % / 20 % = 0.4. Ein Wert unter 1 zeigt, dass A nicht Marktführer ist — der Marktführer hat den 2.5-fachen Anteil. Der relative Marktanteil ergänzt den absoluten Wert, indem er die Stellung gegenüber dem stärksten Wettbewerber abbildet; er ist zentral in der BCG-Matrix.`, teilerklaerungen: [] },
  { id: 'einr-be-pizza', fachbereich: 'BWL', musterlosung: `Zuerst den Pizza-Preis berechnen: 3 × 18.50 = 55.50 CHF. Das Trinkgeld beträgt 10 % dieses Betrags: 55.50 × 0.10 = 5.55 CHF. Der Gesamtbetrag ist die Summe aus Pizza-Preis und Trinkgeld: 55.50 + 5.55 = 61.05 CHF. Die Eingabe erfolgt als Zahl mit Punkt als Dezimaltrennzeichen und ohne Währungssymbol.`, teilerklaerungen: [] },
  { id: 'f4eb6836-4364-4b6b-860e-3bab0501244c', fachbereich: 'BWL', musterlosung: `1. Stufe: Bruttogewinn = 800'000 – 480'000 = 320'000. 2. Stufe: Betriebsgewinn = 320'000 – Lohn 150'000 – Miete 48'000 – Abschreibungen 20'000 – Finanzaufwand 12'000 = 90'000. 3. Stufe: Jahresgewinn = 90'000 + ausserordentlicher Ertrag 5'000 – Steueraufwand 18'000 = 77'000 CHF. Die drei Stufen trennen Handel, Betrieb und neutrales Ergebnis.`, teilerklaerungen: [] },
  { id: 'f767b236-a01f-473c-ad13-09723ace2d7d', fachbereich: 'BWL', musterlosung: `Die Wirtschaftlichkeit setzt Ertrag ins Verhältnis zum Aufwand und zeigt, wie effizient ein Unternehmen wirtschaftet. Formel: Wirtschaftlichkeit = Ertrag / Aufwand = 800'000 / 600'000 ≈ 1.33. Werte über 1 bedeuten, dass die Erträge die Aufwände übersteigen — das Unternehmen arbeitet wirtschaftlich. Werte unter 1 deuten auf Verluste hin.`, teilerklaerungen: [] },
  { id: 'f8ef25f6-30c2-4894-8fcb-0ac9c9fcbfe0', fachbereich: 'BWL', musterlosung: `Arbeitsproduktivität = Output / Arbeitsinput. Hier: 4 Stühle / 8 Stunden = 0.5 Stühle pro Stunde. Die Kennzahl zeigt, wie viel pro Arbeitsstunde hergestellt wird, und dient dem Vergleich von Produktionsabläufen oder Mitarbeitenden. Höhere Arbeitsproduktivität bedeutet grundsätzlich höhere Wertschöpfung pro Zeiteinheit und ist ein zentraler Wettbewerbsfaktor.`, teilerklaerungen: [] },
  { id: 'fa8fae08-0116-4bbe-ac31-16d7c3e72411', fachbereich: 'BWL', musterlosung: `Die Eigenkapitalrentabilität misst, wie stark sich das eingesetzte Eigenkapital verzinst. Formel: EKR = Gewinn / Eigenkapital × 100 = 150'000 / 1'000'000 × 100 = 15 %. Der Wert ist für Eigenkapitalgebende besonders relevant, da er ihre Rendite zeigt. Er sollte deutlich über dem risikolosen Zinssatz liegen, um das unternehmerische Risiko zu entschädigen.`, teilerklaerungen: [] },
  { id: 'ffaf25fb-0df9-4ecf-9a85-70db11040190', fachbereich: 'BWL', musterlosung: `Jahreszins = 100'000 × 3 % = 3'000 CHF. Monatszins = 3'000 / 12 = 250 CHF. Für die Abgrenzung per 31.12. werden 4 Monate (Sept.–Dez.) erfasst: 4 × 250 = 1'000 CHF. Buchung: Finanzaufwand an Transitorische Passive 1'000. So wird der noch nicht bezahlte Zinsaufwand in der richtigen Periode verbucht und das Matching-Prinzip eingehalten.`, teilerklaerungen: [] },
  { id: 'ueb-be-rechnung', fachbereich: 'BWL', musterlosung: `Zuerst den Pizza-Preis berechnen: 3 × 18.50 = 55.50 CHF. Das Trinkgeld beträgt 10 % dieses Betrags: 55.50 × 0.10 = 5.55 CHF. Der Gesamtbetrag ist die Summe aus Pizza-Preis und Trinkgeld: 55.50 + 5.55 = 61.05 CHF. Die Eingabe erfolgt als Zahl mit Punkt als Dezimaltrennzeichen und ohne Währungssymbol.`, teilerklaerungen: [] },

  // ===== BWL/bilanzstruktur (4) =====
  {
    id: '3210e577-d1a5-4119-abff-4b0193414a0d',
    fachbereich: 'BWL',
    musterlosung: `Aktiven: Kasse 2'000 + Bank 18'000 (flüssige Mittel) + Debitoren 5'000 (Forderungen) + Maschinen 40'000 (Sachanlagen) = 65'000. Passiven: Kreditoren 15'000 (kurzfr. FK) + Bankdarlehen 25'000 (langfr. FK) + Eigenkapital 25'000 = 65'000. Aktiven und Passiven sind ausgeglichen — die Bilanz geht auf.`,
    teilerklaerungen: [
      { feld: 'kontenMitSaldi', id: '1000', text: `Die Kasse enthält Bargeld und gehört zu den flüssigen Mitteln, also zum kurzfristig verfügbaren Umlaufvermögen.` },
      { feld: 'kontenMitSaldi', id: '1020', text: `Das Bankkonto zählt wie die Kasse zu den flüssigen Mitteln und wird im Umlaufvermögen ausgewiesen.` },
      { feld: 'kontenMitSaldi', id: '1100', text: `Debitoren sind offene Kundenforderungen — eine typische Position des kurzfristigen Umlaufvermögens.` },
      { feld: 'kontenMitSaldi', id: '1500', text: `Maschinen sind langfristig genutzte Produktionsmittel und gehören zu den Sachanlagen des Anlagevermögens.` },
      { feld: 'kontenMitSaldi', id: '2000', text: `Kreditoren sind offene Lieferantenschulden, typischerweise kurzfristig — sie gehören zum kurzfristigen Fremdkapital.` },
      { feld: 'kontenMitSaldi', id: '2400', text: `Ein Bankdarlehen ist langfristig und wird deshalb im langfristigen Fremdkapital ausgewiesen.` },
      { feld: 'kontenMitSaldi', id: '2800', text: `Das Eigenkapital steht separat in der Bilanz als Residualgrösse (Aktiven minus Fremdkapital).` },
    ],
  },
  {
    id: 'b4620726-7cb6-4059-a740-698eaf8f8203',
    fachbereich: 'BWL',
    musterlosung: `Aktiven: Kasse 3'000 (flüssige Mittel) + Debitoren 7'000 (Forderungen) = 10'000. Passiven: Kreditoren 4'000 (kurzfr. FK) + Eigenkapital 6'000 = 10'000. Die Bilanzsumme beträgt 10'000 CHF. Aktiv- und Passivseite gleichen sich aus — die Buchführungsgleichung Aktiven = Fremdkapital + Eigenkapital ist erfüllt.`,
    teilerklaerungen: [
      { feld: 'kontenMitSaldi', id: '1000', text: `Die Kasse enthält Bargeld und zählt zu den flüssigen Mitteln im Umlaufvermögen.` },
      { feld: 'kontenMitSaldi', id: '1100', text: `Debitoren sind offene Kundenforderungen und gehören zum kurzfristigen Umlaufvermögen.` },
      { feld: 'kontenMitSaldi', id: '2000', text: `Kreditoren sind Lieferantenschulden und bilden einen Teil des kurzfristigen Fremdkapitals.` },
      { feld: 'kontenMitSaldi', id: '2800', text: `Das Eigenkapital wird separat ausgewiesen und entspricht Aktiven abzüglich Fremdkapital.` },
    ],
  },
  {
    id: 'cf4b5c46-6c9f-4714-8ed9-fb7fcf167c8d',
    fachbereich: 'BWL',
    musterlosung: `Aktiven: Bank 12'000 (flüssige Mittel) + Debitoren 8'000 (Forderungen) + Maschinen 50'000 – Wertberichtigung 10'000 = 40'000 (Sachanlagen netto). Total Aktiven = 60'000. Passiven: Kreditoren 18'000 (kurzfr. FK) + Eigenkapital 42'000 = 60'000. Die Wertberichtigung ist ein Minusaktivkonto — sie reduziert den Maschinenwert auf der Aktivseite.`,
    teilerklaerungen: [
      { feld: 'kontenMitSaldi', id: '1020', text: `Die Bank ist ein flüssiges Mittel und gehört zum kurzfristigen Umlaufvermögen.` },
      { feld: 'kontenMitSaldi', id: '1100', text: `Debitoren sind offene Kundenforderungen und zählen zum Umlaufvermögen (Forderungen).` },
      { feld: 'kontenMitSaldi', id: '1500', text: `Maschinen sind langfristig genutzte Produktionsmittel und gehören zu den Sachanlagen im Anlagevermögen.` },
      { feld: 'kontenMitSaldi', id: '1510', text: `Die Wertberichtigung Maschinen ist ein Minusaktivkonto und steht bei den Sachanlagen mit negativem Saldo.` },
      { feld: 'kontenMitSaldi', id: '2000', text: `Kreditoren sind offene Lieferantenschulden und zählen zum kurzfristigen Fremdkapital.` },
      { feld: 'kontenMitSaldi', id: '2800', text: `Das Eigenkapital entspricht dem Residualanspruch der Eigentümer nach Abzug des Fremdkapitals.` },
    ],
  },
  {
    id: 'e8eab747-56a7-488c-913b-1c3504d0681d',
    fachbereich: 'BWL',
    musterlosung: `Aktiven: Kasse 5'000 + Bank 15'000 (flüssige Mittel) + Maschinen 30'000 (Sachanlagen) = 50'000. Passiven: Kreditoren 12'000 (kurzfr. FK) + Bankdarlehen 20'000 (langfr. FK) + Eigenkapital 18'000 = 50'000. Aktiven und Passiven sind ausgeglichen; die Bilanzsumme beträgt 50'000 CHF.`,
    teilerklaerungen: [
      { feld: 'kontenMitSaldi', id: '1000', text: `Die Kasse enthält Bargeld und gehört zu den flüssigen Mitteln des Umlaufvermögens.` },
      { feld: 'kontenMitSaldi', id: '1020', text: `Das Bankkonto ist ein flüssiges Mittel und wird im Umlaufvermögen ausgewiesen.` },
      { feld: 'kontenMitSaldi', id: '1500', text: `Maschinen sind langfristig genutzte Betriebsmittel und bilden einen Teil der Sachanlagen im Anlagevermögen.` },
      { feld: 'kontenMitSaldi', id: '2000', text: `Kreditoren sind Lieferantenschulden und zählen zum kurzfristigen Fremdkapital.` },
      { feld: 'kontenMitSaldi', id: '2400', text: `Das Bankdarlehen ist langfristig finanziert und wird deshalb im langfristigen Fremdkapital ausgewiesen.` },
      { feld: 'kontenMitSaldi', id: '2800', text: `Das Eigenkapital entspricht dem Anteil der Eigentümer am Unternehmensvermögen.` },
    ],
  },

  // ===== BWL/bildbeschriftung (6) =====
  {
    id: '03881ff6-fd94-4f33-944a-1a696631ffc4',
    fachbereich: 'BWL',
    musterlosung: `Die Ansoff-Matrix kombiniert die Dimensionen Produkt (bestehend/neu) und Markt (bestehend/neu) zu vier Wachstumsstrategien. Marktdurchdringung und Produktentwicklung nutzen den bekannten Markt, Marktentwicklung erschliesst neue Märkte mit bestehenden Produkten. Die Diversifikation kombiniert neues Produkt mit neuem Markt und gilt als risikoreichste Strategie. Die Matrix hilft bei der Einordnung und Risikoabschätzung von Wachstumsinitiativen.`,
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: `Marktdurchdringung bedeutet, mit einem bestehenden Produkt im bestehenden Markt mehr Umsatz zu erzielen — die Strategie mit dem tiefsten Risiko.` },
      { feld: 'beschriftungen', id: 'l2', text: `Produktentwicklung bringt ein neues Produkt in den bestehenden Markt, etwa als Variante oder Ergänzung eines Sortiments.` },
      { feld: 'beschriftungen', id: 'l3', text: `Marktentwicklung führt ein bestehendes Produkt in einen neuen Markt ein, zum Beispiel geografisch oder in eine neue Zielgruppe.` },
      { feld: 'beschriftungen', id: 'l4', text: `Diversifikation verbindet neues Produkt mit neuem Markt und gilt als risikoreichste Strategie der Ansoff-Matrix.` },
    ],
  },
  {
    id: '708a935f-9965-42f2-bae2-d18862e5f001',
    fachbereich: 'BWL',
    musterlosung: `Die Nutzwertanalyse bewertet Alternativen systematisch in fünf Schritten: Bewertungskriterien festlegen, gewichten (Summe = 100 %), einzelne Alternativen mit Punkten beurteilen (z. B. 1–5), gewichtete Punkte durch Multiplikation berechnen und die Summe als Gesamtnutzwert bilden. Die Alternative mit dem höchsten Gesamtnutzwert gilt als beste Wahl. Die Methode eignet sich besonders bei qualitativ schwer vergleichbaren Optionen.`,
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: `Bewertungskriterien sind die sachlichen Massstäbe, nach denen die Alternativen verglichen werden, zum Beispiel Lage oder Kosten.` },
      { feld: 'beschriftungen', id: 'l2', text: `Die Gewichtung in Prozent zeigt, wie wichtig jedes Kriterium im Vergleich ist; die Summe aller Gewichte beträgt 100 %.` },
      { feld: 'beschriftungen', id: 'l3', text: `Die Punktbewertung (meist 1–5 oder 1–10) drückt aus, wie gut eine Alternative ein bestimmtes Kriterium erfüllt.` },
      { feld: 'beschriftungen', id: 'l4', text: `Gewichtete Punkte ergeben sich aus Gewichtung × Bewertung und berücksichtigen die relative Bedeutung jedes Kriteriums.` },
      { feld: 'beschriftungen', id: 'l5', text: `Der Gesamtnutzwert ist die Summe aller gewichteten Punkte; die Alternative mit dem höchsten Wert gilt als beste Wahl.` },
    ],
  },
  {
    id: '8b8e509d-5a70-4dc0-bc61-9a49cd8e3358',
    fachbereich: 'BWL',
    musterlosung: `Die Bilanz zeigt Mittelherkunft und Mittelverwendung zu einem Stichtag. Die linke Aktivseite gliedert sich in Umlauf- und Anlagevermögen. Die rechte Passivseite zeigt kurz- und langfristiges Fremdkapital sowie das Eigenkapital. Die Bilanzsumme ist auf beiden Seiten identisch (Aktiven = Passiven). Die Reihenfolge folgt der Liquidität (Aktiven) und der Fristigkeit (Passiven).`,
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: `Das Umlaufvermögen enthält kurzfristig verfügbare Mittel wie Kasse, Bank, Debitoren und Warenvorräte.` },
      { feld: 'beschriftungen', id: 'l2', text: `Das Anlagevermögen umfasst langfristig genutzte Güter wie Maschinen, Gebäude und Fahrzeuge.` },
      { feld: 'beschriftungen', id: 'l3', text: `Kurzfristiges Fremdkapital besteht aus Schulden mit Fristigkeit unter einem Jahr, etwa Kreditoren oder kurzfristige Darlehen.` },
      { feld: 'beschriftungen', id: 'l4', text: `Langfristiges Fremdkapital umfasst Schulden mit Fristigkeit über einem Jahr, zum Beispiel Hypotheken oder langfristige Bankdarlehen.` },
      { feld: 'beschriftungen', id: 'l5', text: `Das Eigenkapital ist das Nettovermögen der Eigentümer: Aktiven abzüglich Fremdkapital — die Residualgrösse der Bilanz.` },
      { feld: 'beschriftungen', id: 'l6', text: `Die Bilanzsumme ist das Total auf beiden Seiten; Aktiven und Passiven müssen stets übereinstimmen.` },
    ],
  },
  {
    id: '93a165ff-8613-4afe-b153-407999aa750a',
    fachbereich: 'BWL',
    musterlosung: `Das St. Galler Unternehmensmodell stellt das Unternehmen als offenes System dar. Im Zentrum steht das Unternehmen, umgeben von Anspruchsgruppen (Stakeholder) und eingebettet in Umweltsphären (Wirtschaft, Technologie, Natur, Gesellschaft). Zwischen Unternehmen und Umwelt bestehen Interaktionsthemen wie Anliegen oder Ressourcen. Ordnungsmomente (Strategie, Struktur, Kultur) steuern die Prozesse (Management, Geschäft, Unterstützung) und sichern die Handlungsfähigkeit.`,
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: `Der Kern ist das Unternehmen selbst — es wird im Zentrum des Modells analysiert und gesteuert.` },
      { feld: 'beschriftungen', id: 'l2', text: `Anspruchsgruppen sind Stakeholder wie Kunden, Mitarbeitende, Aktionäre oder Lieferanten mit Einfluss oder Interesse am Unternehmen.` },
      { feld: 'beschriftungen', id: 'l3', text: `Umweltsphären sind die übergeordneten Rahmenbedingungen: Wirtschaft, Technologie, Gesellschaft und Natur.` },
      { feld: 'beschriftungen', id: 'l4', text: `Interaktionsthemen sind Ressourcen, Normen und Werte sowie Anliegen und Interessen, die zwischen Unternehmen und Umwelt ausgetauscht werden.` },
      { feld: 'beschriftungen', id: 'l5', text: `Ordnungsmomente Strategie, Struktur und Kultur geben dem Unternehmen Richtung und halten es funktionsfähig.` },
      { feld: 'beschriftungen', id: 'l6', text: `Prozesse unterteilen sich in Management-, Geschäfts- und Unterstützungsprozesse und realisieren die eigentliche Leistungserbringung.` },
    ],
  },
  {
    id: '9f9fc010-288e-46a3-9819-7490012ff7c8',
    fachbereich: 'BWL',
    musterlosung: `Die Nutzwertanalyse bewertet Alternativen systematisch in fünf Schritten: Bewertungskriterien festlegen, gewichten (Summe = 100 %), einzelne Alternativen mit Punkten beurteilen (z. B. 1–5), gewichtete Punkte durch Multiplikation berechnen und die Summe als Gesamtnutzwert bilden. Die Alternative mit dem höchsten Gesamtnutzwert gilt als beste Wahl. Die Methode eignet sich besonders bei qualitativ schwer vergleichbaren Optionen.`,
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: `Bewertungskriterien sind die sachlichen Massstäbe, nach denen die Alternativen verglichen werden, zum Beispiel Lage oder Kosten.` },
      { feld: 'beschriftungen', id: 'l2', text: `Die Gewichtung in Prozent zeigt, wie wichtig jedes Kriterium im Vergleich ist; die Summe aller Gewichte beträgt 100 %.` },
      { feld: 'beschriftungen', id: 'l3', text: `Die Punktbewertung (meist 1–5 oder 1–10) drückt aus, wie gut eine Alternative ein bestimmtes Kriterium erfüllt.` },
      { feld: 'beschriftungen', id: 'l4', text: `Gewichtete Punkte ergeben sich aus Gewichtung × Bewertung und berücksichtigen die relative Bedeutung jedes Kriteriums.` },
      { feld: 'beschriftungen', id: 'l5', text: `Der Gesamtnutzwert ist die Summe aller gewichteten Punkte; die Alternative mit dem höchsten Wert gilt als beste Wahl.` },
    ],
  },
  {
    id: 'fdc4d60e-2dcc-4929-8b28-7f8e45ac8d44',
    fachbereich: 'BWL',
    musterlosung: `Der Marketing-Mix fasst die vier klassischen Instrumente der Absatzpolitik zusammen (4P). Product legt das Leistungsangebot fest: Sortiment, Qualität, Design, Service. Price regelt die Preisgestaltung mit Strategie und Rabatten. Place bestimmt Distribution und Vertriebskanäle — online, Filiale oder Grosshandel. Promotion umfasst die Kommunikation mit dem Markt via Werbung, Verkaufsförderung und PR. Die 4P werden aufeinander abgestimmt, um einen kohärenten Marktauftritt zu erzielen.`,
    teilerklaerungen: [
      { feld: 'beschriftungen', id: 'l1', text: `Product (Produktpolitik) legt Sortiment, Qualität, Design und Service des Angebots fest — das «Was» des Marketings.` },
      { feld: 'beschriftungen', id: 'l2', text: `Price (Preispolitik) regelt die Preisgestaltung, Rabatte und Zahlungsbedingungen — entscheidend für Positionierung und Marge.` },
      { feld: 'beschriftungen', id: 'l3', text: `Place (Distributionspolitik) bestimmt Vertriebskanäle und Logistik — online, Filiale, Grosshandel oder Direktvertrieb.` },
      { feld: 'beschriftungen', id: 'l4', text: `Promotion (Kommunikationspolitik) umfasst Werbung, PR und Verkaufsförderung, um das Angebot bekannt zu machen und abzusetzen.` },
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

  console.log(`Session 26: ${done} verarbeitet, total ${state.verarbeitet}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
