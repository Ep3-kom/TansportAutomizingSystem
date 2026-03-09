# Settings Pagina

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Authenticatie]] · [[Launch Checklist]]

---

## Status: ✅ Geïmplementeerd

## Overzicht

De instellingenpagina is bereikbaar via de **Instellingen**-link linksonder in de [[Sidebar]]. De pagina bevat twee tabs: **Bedrijfsgegevens** en **Mijn Account**. Alle wijzigingen worden direct naar [[Supabase Setup|Supabase]] geschreven.

**Bestand:** `frontend/src/pages/Settings.jsx`

---

## Tab 1: Bedrijfsgegevens

Beheert de `companies`-tabel in Supabase.

| Veld | Kolom in DB | Type | Beschrijving |
|------|-------------|------|-------------|
| Bedrijfsnaam | `name` | text | Naam van het transportbedrijf |
| KVK-nummer | `kvk_number` | text | Kamer van Koophandel nummer |
| BTW-nummer | `btw_number` | text | Belasting (BTW) identificatienummer |
| E-mailadres | `email` | text | Hoofd e-mailadres bedrijf |
| Telefoonnummer | `phone` | text | Telefoonnummer bedrijf |
| Adres | `address` | text | Straatnaam + huisnummer |
| Postcode | `postcode` | text | Postcode (bijv. 1234 AB) |
| Plaats | `city` | text | Vestigingsplaats |

### Nieuwe kolommen (migratie nodig)

De volgende kolommen zijn **nieuw** en moeten in Supabase worden aangemaakt:

```sql
ALTER TABLE companies ADD COLUMN IF NOT EXISTS btw_number text;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS postcode text;
```

De overige kolommen (`name`, `kvk_number`, `email`, `phone`) bestonden al in het [[Database Schema]].

---

## Tab 2: Mijn Account

Beheert de `profiles`-tabel en toont auth-gegevens.

| Veld | Bewerkbaar | Bron | Beschrijving |
|------|-----------|------|-------------|
| Volledige naam | ✅ Ja | `profiles.full_name` | Naam van de ingelogde gebruiker |
| E-mailadres | ❌ Nee | `auth.users.email` | Alleen lezen — gekoppeld aan Supabase Auth |
| Rol | ❌ Nee | `profiles.role` | Weergave: Beheerder / Planner / Viewer |

---

## Technische Details

### Dataflow

1. Bij laden: `useAuth()` → `profile` (bevat `profiles.*` + `companies.*`)
2. Formuliervelden worden gevuld vanuit `profile.companies` en `profile`
3. Bij opslaan: directe `supabase.update()` op `companies` of `profiles` tabel
4. Succesmelding verschijnt 3 seconden na opslaan

### Afhankelijkheden

- `useAuth` hook — levert `profile`, `user`, `profile.companies`
- `supabase` client — voor directe database updates
- Lucide icons: `Building2`, `User`, `Save`, `Loader2`, `CheckCircle`, `MapPin`, `Mail`, `Phone`, `Hash`

### UI Componenten

- **Tab-switcher** — `bg-gray-100` pill-navigatie met actieve state
- **Formuliervelden** — consistent met de rest van TAS (icoon links, `bg-gray-50`)
- **Opslaan-knop** — primaire kleur, loading spinner bij opslaan
- **Succesmelding** — groene banner met `CheckCircle` icoon

---

## Nog te bouwen (toekomst)

### Gebruikersbeheer
- Overzicht van gebruikers binnen het bedrijf
- Nieuwe gebruiker uitnodigen (e-mail invite)
- Rol toewijzen (admin / planner / viewer)
- Gebruiker verwijderen

### Abonnement *(na [[Prijsmodel|Stripe integratie]])*
- Huidig plan weergeven
- Plan upgraden/downgraden
- Betaalgegevens beheren
- Facturen inzien (Stripe Customer Portal)

---

## Prioriteit

**P0** op de [[Launch Checklist]] — ✅ Basis is afgerond.
