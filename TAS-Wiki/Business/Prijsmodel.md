# Prijsmodel

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Productvisie]] · [[Launch Checklist]] · [[KPIs & Doelen]]

---

## Pakketten

| Plan | Vlootgrootte | Prijs/maand | Inclusief |
|------|-------------|-------------|-----------|
| **Starter** | 1–8 trucks | €99/maand | Dashboard, planning, 2 gebruikersaccounts, PDF/Excel export |
| **Groei** | 9–18 trucks | €199/maand | Alles van Starter + onbeperkt gebruikers, [[Onderhoudstracker]], prioriteit support |
| **Pro** | 19–30 trucks | €299/maand | Alles van Groei + custom branding op exports, dedicated support |

## Founding Customer Deal (eerste 5 klanten)

- **50% korting** gedurende 3 maanden
- Directe WhatsApp-lijn voor support
- In ruil voor: testimonial + case study + feedback
- Doel: social proof verzamelen vóór publieke launch

## Betalingsmodel

- Maandelijks opzegbaar (geen jaarcontracten in het begin)
- 14 dagen gratis trial
- Betaling via **Stripe** (iDEAL + creditcard)
- Facturen automatisch via Stripe

## Stripe Integratie Status

❌ **Nog niet geïmplementeerd** — zie [[Launch Checklist]]

Benodigde stappen:
- [ ] Stripe account aanmaken
- [ ] Products + Prices aanmaken in Stripe
- [ ] Stripe Checkout integratie
- [ ] Webhook voor subscription status updates
- [ ] Stripe Customer Portal koppelen
- [ ] Trial logica implementeren
- [ ] Plan-limiet checks in de app (bijv. max trucks per plan)

## Database

`companies.plan` → 'starter' / 'groei' / 'pro'
`companies.stripe_customer_id` → Stripe klant-ID (voorbereid maar leeg)
