# TransportPlan — Projectplan & Roadmap

## 1. Productvisie

**Missie:** De simpelste manier voor kleine transportbedrijven om hun wagenpark en chauffeurs te plannen — zonder cursus, zonder implementatietraject, zonder gedoe.

**Doelgroep:** Transportbedrijven met 5–25 vrachtwagens in Nederland die nu werken met Excel, WhatsApp-groepen en papieren planningen.

**Kernbelofte:** Vandaag aanmelden, morgen plannen.

---

## 2. MVP Scope — Wat bouwen we wél en wat niet

### Wél in de MVP

| Feature | Beschrijving |
|---------|-------------|
| Dashboard | Overzicht van actieve chauffeurs, beschikbare trucks, ritten vandaag, APK-waarschuwingen |
| Chauffeurbeheer | Toevoegen, bewerken, verwijderen van chauffeurs met status (actief/verlof/ziek) |
| Voertuigbeheer | Toevoegen, bewerken, verwijderen van trucks met kenteken, APK-datum, kilometerstand |
| Ritplanning | Weekkalender met dag-weergave, ritten aanmaken met chauffeur + truck + route + klant |
| Onderhoudstracker | Bijhouden van APK, onderhoud en reparaties per voertuig |
| Klantenbeheer | Toevoegen en beheren van klanten met contactgegevens |
| PDF Export | Weekplanning exporteren als PDF om te delen via WhatsApp |
| Excel Export | Weekplanning exporteren als Excel-bestand |
| Authenticatie | Login/registratie per bedrijf, meerdere gebruikers per account |
| Multi-tenant | Elk bedrijf ziet alleen eigen data |

### NIET in de MVP

| Feature | Reden | Wanneer |
|---------|-------|---------|
| GPS-tracking | Te complex, aparte hardware nodig | v2.0 |
| Boordcomputer-integratie | API-koppeling vereist per leverancier | v2.0 |
| Facturatie/financieel | Buiten scope, koppeling met boekhoudpakket | v2.0 |
| Automatische routeplanning | Google Maps API kost geld, niet nodig voor MVP | v1.5 |
| Mobiele app | Responsive webapp is voldoende voor MVP | v2.0 |
| Chauffeur-app | Planners zijn primaire gebruiker, niet chauffeurs | v2.0 |
| Drag-and-drop planning | Nice to have, niet essentieel | v1.5 |
| Rapportages/analytics | Eerst data verzamelen, dan rapporteren | v1.5 |
| Multi-taal | Alleen Nederlands voor nu | v3.0 |

---

## 3. Ontwikkelingsfasen

### Fase 1 — Fundament (Week 1–2)

**Doel:** Project opgezet, database klaar, authenticatie werkend.

**Taken:**
- Vite + React + Tailwind project opzetten
- GitHub repository aanmaken met .gitignore en README
- Supabase project aanmaken
- Database schema uitvoeren (alle tabellen + indexen)
- Row Level Security (RLS) configureren
- Authenticatie bouwen: registratie, login, logout
- Database trigger voor automatische company + profile aanmaak
- App shell bouwen: sidebar, routing, basis layout
- Vercel project koppelen aan GitHub (auto-deploy)

**Oplevering:** Werkende app met login en lege dashboard-pagina op `app.transportplan.nl`.

---

### Fase 2 — CRUD Kernmodules (Week 3–4)

**Doel:** Alle data-entiteiten kunnen worden aangemaakt, gelezen, bewerkt en verwijderd.

**Taken:**
- Chauffeursbeheer: lijst, toevoegen, bewerken, verwijderen, zoeken
- Voertuigbeheer: kaartweergave, toevoegen, bewerken, verwijderen
- Klantenbeheer: lijst, toevoegen, bewerken, verwijderen
- Custom hooks voor elke entiteit (useDrivers, useTrucks, useClients)
- Formuliervalidatie met React Hook Form
- Bevestigingsdialoog bij verwijderen
- Loading states en error handling

**Oplevering:** Volledig werkend CRUD-systeem voor chauffeurs, voertuigen en klanten.

---

### Fase 3 — Planning & Onderhoud (Week 5–6)

**Doel:** Kernfunctionaliteit: ritplanning en onderhoudstracking.

**Taken:**
- Weekkalender bouwen met dag-kolommen
- Navigatie: vorige week / vandaag / volgende week
- Rit aanmaken: chauffeur + voertuig + datum + tijd + route + klant selecteren
- Ritstatus bijwerken (gepland → onderweg → afgerond)
- Conflictdetectie: waarschuwing als chauffeur of truck al ingepland is
- Dashboard: ritten vandaag met status-overzicht
- Onderhoudstracker: lijst per voertuig
- APK-waarschuwingen op dashboard (< 60 dagen)
- Onderhoudsrecords aanmaken en bijwerken

**Oplevering:** Volledig werkende weekplanning en onderhoudstracker.

---

### Fase 4 — Export & Polish (Week 7–8)

**Doel:** Exportfunctionaliteit en gebruikservaring afronden.

**Taken:**
- PDF-export van weekplanning (jsPDF + autotable)
- Excel-export van weekplanning (SheetJS)
- Export van voertuigenoverzicht met APK-data
- Responsive design voor tablet (planners gebruiken vaak iPads)
- Onboarding: welkomstscherm na registratie met uitleg
- Settings-pagina: bedrijfsgegevens bewerken
- Gebruikersbeheer: extra gebruikers uitnodigen per e-mail
- Profielpagina: naam en wachtwoord wijzigen
- Empty states: duidelijke instructies als er nog geen data is
- Performance: lazy loading van pagina's

**Oplevering:** Volledig afgeronde MVP klaar voor beta-testers.

---

### Fase 5 — Beta & Launch (Week 9–10)

**Doel:** Testen met echte bedrijven, betalingen aanzetten, live gaan.

**Taken:**
- 2–3 beta-testers werven (transportbedrijven uit netwerk)
- Feedback verzamelen en verwerken (1 week)
- Bugfixes en UX-verbeteringen
- Stripe-integratie: abonnementen aanmaken (Starter/Groei/Pro)
- Betaalpagina bouwen met plan-selectie
- Trial-periode: 14 dagen gratis
- Landingspagina bouwen op `transportplan.nl`
- Terms of Service en Privacy Policy opstellen
- Go-live

**Oplevering:** Live product met betalende klanten.

---

## 4. Tijdlijn Overzicht

```
Week 1-2   ████████░░░░░░░░░░░░  Fase 1: Fundament
Week 3-4   ░░░░░░░░████████░░░░  Fase 2: CRUD Modules
Week 5-6   ░░░░░░░░░░░░░░░█████  Fase 3: Planning & Onderhoud
Week 7-8   ░░░░░░░░░░░░░░░░░░██  Fase 4: Export & Polish
Week 9-10  ░░░░░░░░░░░░░░░░░░░█  Fase 5: Beta & Launch
```

**Totale doorlooptijd MVP: 10 weken** (bij 15–20 uur per week development)

---

## 5. Prijsmodel

### Pakketten

| Plan | Vlootgrootte | Prijs/maand | Inclusief |
|------|-------------|-------------|-----------|
| **Starter** | 1–8 trucks | €99/maand | Dashboard, planning, 2 gebruikersaccounts, PDF/Excel export |
| **Groei** | 9–18 trucks | €199/maand | Alles van Starter + onbeperkt gebruikers, onderhoudstracker, prioriteit support |
| **Pro** | 19–30 trucks | €299/maand | Alles van Groei + custom branding op exports, dedicated support |

### Founding Customer Deal (eerste 5 klanten)

- 50% korting gedurende 3 maanden
- Directe WhatsApp-lijn voor support
- In ruil voor: testimonial + case study + feedback
- Doel: social proof verzamelen vóór publieke launch

### Betalingsmodel

- Maandelijks opzegbaar (geen jaarcontracten in het begin)
- 14 dagen gratis trial
- Betaling via Stripe (iDEAL + creditcard)
- Facturen automatisch via Stripe

---

## 6. Go-to-Market Strategie

### Fase A — Pre-launch (Week 1–8)

**Doel:** Landingspagina live, wachtlijst opbouwen, beta-testers vinden.

- Landingspagina op `transportplan.nl` met wachtlijst-formulier
- LinkedIn-posts over het probleem (niet het product): "Hoe plan jij je wagenpark?"
- 50 transportbedrijven in regio Amsterdam/Randstad op een lijst zetten
- 10 bedrijven bellen voor kennismakingsgesprek

### Fase B — Beta (Week 9–10)

**Doel:** 3 betalende beta-klanten.

- Live demo's bij geïnteresseerde bedrijven (schermdeelsessie of ter plekke)
- Founding customer deal aanbieden
- Feedback verwerken in product
- Eerste case study schrijven

### Fase C — Publieke Launch (Week 11–14)

**Doel:** 5–10 betalende klanten.

- Case study publiceren op website en LinkedIn
- Google Ads starten op "ritplanning software" en "wagenpark beheer"
- SEO-content: blogposts over "Excel vervangen als transportplanner"
- Referral-programma: €50 korting per doorverwijzing
- Koud bellen: 5 bedrijven per week vanuit de lijst

### Fase D — Groei (Maand 4–6)

**Doel:** 20+ betalende klanten.

- Google Ads optimaliseren op conversie
- Partnerschappen verkennen: transportverenigingen (TLN), branche-events
- Mond-tot-mond via tevreden klanten
- Feature-updates communiceren via maandelijkse nieuwsbrief

---

## 7. Concurrentiepositie

### Directe concurrenten

| Concurrent | Prijs | Sterkte | Zwakte |
|-----------|-------|---------|--------|
| Winsol | €300+/maand | Compleet TMS | Te complex en duur voor MKB |
| Transporeon | Enterprise | Groot netwerk | Niet toegankelijk voor kleine bedrijven |
| Verizon Connect | €200+/maand | GPS + fleet | Overshoot voor 5-truck bedrijven |
| Planpoint | Onbekend | NL-markt | Beperkte online aanwezigheid |

### Onze positie

We concurreren **niet** met enterprise TMS-systemen. Onze echte concurrent is **Excel + WhatsApp**. We positioneren ons als het simpele alternatief dat:

1. In 15 minuten werkend is (geen implementatietraject)
2. Volledig in het Nederlands is
3. Transparante prijzen heeft (geen "neem contact op")
4. Maandelijks opzegbaar is
5. Gebouwd is voor bedrijven met 5–25 trucks, niet 500

---

## 8. KPI's & Doelen

### Maand 1–3 (Launch)

| KPI | Doel |
|-----|------|
| Beta-testers | 3 bedrijven |
| Betalende klanten | 5 |
| MRR (Monthly Recurring Revenue) | €500 |
| Churn rate | < 20% |

### Maand 4–6 (Groei)

| KPI | Doel |
|-----|------|
| Betalende klanten | 15–20 |
| MRR | €2.500 |
| Churn rate | < 10% |
| NPS score | > 40 |

### Maand 7–12 (Schaalbaar)

| KPI | Doel |
|-----|------|
| Betalende klanten | 40–50 |
| MRR | €7.500 |
| Churn rate | < 5% |
| Break-even | Bereikt |

---

## 9. Roadmap na MVP

### Versie 1.5 (Maand 4–6)

- Drag-and-drop planning op de weekkalender
- Eenvoudige rapportages (ritten per chauffeur, bezettingsgraad)
- Google Maps integratie voor routeweergave
- Notificaties: APK-herinneringen per e-mail
- Herhalende ritten (wekelijks/dagelijks)

### Versie 2.0 (Maand 7–12)

- Chauffeur-app (PWA): chauffeur ziet eigen planning op telefoon
- GPS-tracking integratie (koppeling met bestaande systemen)
- Koppeling met boekhoudpakketten (Exact, Moneybird)
- Digitale CMR-vrachtbrieven
- Geavanceerde conflictdetectie (rijtijdenwet)

### Versie 3.0 (Jaar 2)

- AI-suggesties voor optimale planning
- Automatische routeoptimalisatie
- Klantportaal: klanten kunnen eigen ritten inzien
- Multi-taal: Engels, Duits (België/Duitsland expansie)
- API voor koppelingen met externe systemen
- Marktplaats: beschikbare capaciteit aanbieden

---

## 10. Risico's & Mitigatie

| Risico | Impact | Mitigatie |
|--------|--------|----------|
| Lage adoptie ("we gebruiken liever Excel") | Hoog | Gratis trial, live onboarding, founding deals |
| Churn na trial | Hoog | Onboarding verbeteren, proactief bellen na 7 dagen |
| Concurrentie verlaagt prijzen | Medium | Focus op niche + klantenservice als differentiator |
| Technische schuld door snelle MVP | Medium | Code reviews, refactoring sprints elke 4 weken |
| Te weinig development-capaciteit | Medium | Scope strikt bewaken, features prioriteren op klantwaarde |
| GDPR/AVG compliance | Medium | Privacy policy, data processing agreement, Supabase EU hosting |

---

## 11. Kosten Overzicht (Eerste 6 Maanden)

| Kostenpost | Maandelijks | Toelichting |
|-----------|-------------|-------------|
| Supabase | €0 (free tier) → €25 | Gratis tot ~500MB / 50K requests |
| Vercel | €0 (free tier) → €20 | Gratis voor hobby, Pro als nodig |
| Domein | ~€1 | transportplan.nl |
| Stripe fees | 1.4% + €0.25 per transactie | iDEAL kosten |
| Google Ads | €200–500 | Start bij Fase C |
| Totaal (maand 1–3) | ~€25 | Bijna volledig gratis |
| Totaal (maand 4–6) | ~€300–550 | Vooral marketing |

---

## 12. Team & Verantwoordelijkheden

| Rol | Wie | Verantwoordelijkheid |
|-----|-----|---------------------|
| Lead Developer | Nader te bepalen | Frontend, Supabase, deployment |
| Product & Sales | Nader te bepalen | Klantcontact, demo's, feedback, marketing |
| Gedeeld | Beiden | Strategische beslissingen, prijsstelling, roadmap |

**Belangrijk:** In de eerste 3 maanden moet minimaal 50% van de tijd naar sales en klantcontact gaan, niet naar development. Een werkend product zonder klanten is waardeloos.

---

*Dit document is een levend document. Update het na elke sprint/fase met nieuwe inzichten, feedback van klanten en aangepaste prioriteiten.*
