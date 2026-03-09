# Juridisch — AVG & Voorwaarden

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Launch Checklist]] · [[Security Checklist]]

---

## Status: ❌ Moet nog opgesteld worden

## Verplichte Documenten

### 1. Algemene Voorwaarden

Regelt de contractuele relatie met klanten. Moet bevatten:
- Dienstomschrijving
- Prijzen en betalingsvoorwaarden
- Aansprakelijkheid en garantie
- Opzegging en restitutie
- Intellectueel eigendom
- Service Level Agreement (uptime)

### 2. Privacyverklaring (Privacy Policy)

Wettelijk verplicht onder AVG/GDPR. Moet bevatten:
- Welke persoonsgegevens worden verzameld
- Doel van de verwerking
- Rechtsgrond (overeenkomst / gerechtvaardigd belang)
- Bewaartermijnen
- Rechten van betrokkenen (inzage, correctie, verwijdering)
- Verwerkers (Supabase, Vercel, Stripe)
- Contactgegevens verwerkingsverantwoordelijke

### 3. Verwerkersovereenkomst (DPA)

**Verplicht** omdat TAS persoonsgegevens van chauffeurs verwerkt namens het transportbedrijf.

Moet bevatten:
- Onderwerp en duur van de verwerking
- Aard en doel van de verwerking
- Soort persoonsgegevens (namen, telefoonnummers, rijbewijzen)
- Categorieën betrokkenen (chauffeurs, contactpersonen klanten)
- Beveiligingsmaatregelen
- Sub-verwerkers (Supabase, Vercel)

### 4. Cookie Banner

Technisch gezien is een cookie banner nodig als je analytics/marketing cookies gebruikt. Supabase auth gebruikt session cookies — check of een banner nodig is.

## Persoonsgegevens in TAS

| Data | Betrokkene | Tabel |
|------|-----------|-------|
| Naam, e-mail, wachtwoord | Gebruiker | `profiles`, `auth.users` |
| Naam, telefoon | Chauffeur | `drivers` |
| Naam, e-mail, telefoon | Klant-contactpersoon | `clients` |

## Actie Items

- [ ] Algemene Voorwaarden opstellen (juridisch template + aanpassen)
- [ ] Privacyverklaring opstellen
- [ ] Verwerkersovereenkomst opstellen
- [ ] Documenten op de website plaatsen (footer links)
- [ ] Checkbox bij registratie: "Ik ga akkoord met de Algemene Voorwaarden"
- [ ] DPA aanbieden als downloadbaar PDF voor klanten
- [ ] Sub-verwerkers lijst bijhouden (Supabase, Vercel, Stripe)
