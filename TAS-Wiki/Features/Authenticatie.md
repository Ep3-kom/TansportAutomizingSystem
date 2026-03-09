# Authenticatie

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Supabase Setup]] · [[Row Level Security]] · [[Database Schema]]

---

## Status: ✅ Functioneel

## Beschrijving

Login en registratie systeem via Supabase Auth met multi-tenant ondersteuning.

## Registratie Flow

1. Gebruiker vult in: bedrijfsnaam, volledige naam, e-mail, wachtwoord
2. Supabase Auth maakt een `auth.users` record
3. Database trigger (`handle_new_user`) maakt automatisch:
   - `companies` record met bedrijfsnaam
   - `profiles` record met role = 'admin', gekoppeld aan company
4. Redirect naar [[Dashboard]]

## Login Flow

1. E-mail + wachtwoord → Supabase Auth
2. JWT token met user ID
3. `useAuth` hook haalt profiel + bedrijfsdata op
4. [[Row Level Security|RLS]] filtert data op `company_id`

## Validatie

- Wachtwoord minimaal 6 tekens
- E-mail type validatie
- Verplichte velden check

## Hook: `useAuth.js`

```
AuthProvider (Context) → useAuth()
  ├── user (Supabase auth user)
  ├── profile (profiles + companies data)
  ├── loading
  ├── signUp(email, password, metadata)
  ├── signIn(email, password)
  └── signOut()
```

## Wat ontbreekt

- [ ] Wachtwoord vergeten / reset flow
- [ ] E-mail verificatie afdwingen
- [ ] Meerdere gebruikers per bedrijf (user management) → zie [[Launch Checklist]]
- [ ] Rollen afdwingen in de UI (RBAC) → zie [[Launch Checklist]]
- [ ] Magic link login (optioneel)
