# Supabase Setup

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Tech Stack]] · [[Database Schema]] · [[Row Level Security]] · [[Authenticatie]]

---

## Project Details

- **URL:** `https://nqfcciajsrgxvgcrkqic.supabase.co`
- **Regio:** EU (GDPR-compliant)
- **Plan:** Free tier (upgrade naar Pro bij ~500MB / 50K requests)

## Environment Variabelen

```env
VITE_SUPABASE_URL=https://nqfcciajsrgxvgcrkqic.supabase.co
VITE_SUPABASE_ANON_KEY=<public anon key>
```

> ⚠️ **Alleen de anon (public) key** wordt gebruikt in de frontend. De service role key mag NOOIT in client-side code.

## Client Initialisatie

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

## Gebruikte Supabase Features

| Feature | Status |
|---------|--------|
| Auth (email/wachtwoord) | ✅ Actief |
| PostgreSQL Database | ✅ Actief |
| [[Row Level Security]] | ⚠️ Moet geactiveerd worden |
| Realtime | ❌ Niet gebruikt |
| Storage | ❌ Niet gebruikt |
| Edge Functions | ❌ Niet gebruikt (nodig voor [[Taken/Email Notificaties]]) |

## Database Trigger

Bij registratie wordt automatisch een `company` + `profile` record aangemaakt:

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_company_id uuid;
BEGIN
  INSERT INTO companies (name, email)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Mijn Bedrijf'),
    NEW.email
  )
  RETURNING id INTO new_company_id;

  INSERT INTO profiles (id, company_id, full_name, role)
  VALUES (
    NEW.id, new_company_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'admin'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Backups

- Dagelijkse automatische backups (Supabase)
- Point-in-time recovery beschikbaar op Pro plan
- Geen handmatige backup-strategie gedocumenteerd — zie [[Launch Checklist]]
