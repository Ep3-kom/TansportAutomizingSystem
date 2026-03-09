# Security Checklist

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Launch Checklist]] · [[Row Level Security]] · [[Supabase Setup]] · [[Authenticatie]]

---

## Authenticatie & Autorisatie

| Item | Status | Actie |
|------|--------|-------|
| Supabase Auth actief | ✅ | — |
| Wachtwoord minimum 6 tekens | ✅ | — |
| E-mail verificatie | ⚠️ | Afdwingen in Supabase Auth settings |
| [[Row Level Security\|RLS]] op alle tabellen | ❌ | **KRITIEK** — activeren en testen |
| RBAC in UI afdwingen | ❌ | Roles bestaan in DB maar UI checkt niet |

## Data Bescherming

| Item | Status | Actie |
|------|--------|-------|
| Multi-tenant isolatie (company_id) | ✅ | Via hooks, maar RLS is de echte beveiliging |
| Alleen anon key in frontend | ✅ | Service role key NOOIT client-side |
| .env.local in .gitignore | ✅ | — |
| Geen secrets in git history | ✅ | — |

## Input Validatie

| Item | Status | Actie |
|------|--------|-------|
| Client-side validatie | ⚠️ | Basis HTML validatie, geen React Hook Form |
| Database constraints | ⚠️ | NOT NULL op key fields, maar meer nodig |
| Kenteken normalisatie | ✅ | Uppercase, spaties/streepjes verwijderd |
| SQL injection preventie | ✅ | Supabase query builder (parameterized) |
| XSS preventie | ✅ | React escapet standaard user input |

## Infrastructuur

| Item | Status | Actie |
|------|--------|-------|
| HTTPS | ✅ | Automatisch via Vercel |
| Rate limiting | ✅ | Supabase standaard |
| CORS | ✅ | Supabase standaard |
| CSP headers | ❌ | Overwegen in Vercel config |

## Compliance

| Item | Status | Actie |
|------|--------|-------|
| EU datacenter | ✅ | Supabase EU |
| Privacy Policy | ❌ | Moet geschreven worden → [[Juridisch — AVG & Voorwaarden]] |
| Verwerkersovereenkomst | ❌ | Verplicht → [[Juridisch — AVG & Voorwaarden]] |
| Data export mogelijkheid | ❌ | AVG-recht, moet gebouwd worden → [[Data Export]] |
| Data verwijdering | ⚠️ | Account delete flow ontbreekt |
