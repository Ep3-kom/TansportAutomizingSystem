# Row Level Security (RLS)

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Database Schema]] · [[Supabase Setup]] · [[Security Checklist]] · [[Authenticatie]]

---

## Status: ⚠️ MOET NOG GEACTIVEERD WORDEN

RLS is **gepland en gedocumenteerd** maar het is onduidelijk of het daadwerkelijk in Supabase is geactiveerd. Dit is de **#1 prioriteit** op de [[Launch Checklist]].

> Zonder RLS kan elke geauthenticeerde gebruiker in theorie data van ALLE bedrijven opvragen via de Supabase API. De frontend filtert op `company_id`, maar dat is geen echte beveiliging.

---

## Helper Functie

```sql
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS uuid AS $$
  SELECT company_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;
```

## RLS Activeren

```sql
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
```

## Policies (per tabel herhalen)

```sql
-- Voorbeeld: drivers (herhaal voor trucks, schedules, maintenance, clients)

CREATE POLICY "Users can view own company drivers"
  ON drivers FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert own company drivers"
  ON drivers FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update own company drivers"
  ON drivers FOR UPDATE
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete own company drivers"
  ON drivers FOR DELETE
  USING (company_id = get_user_company_id());
```

## Speciale Policies

### Profiles

```sql
-- Gebruiker mag alleen eigen profiel zien
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Gebruiker mag alleen eigen profiel updaten
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());
```

### Companies

```sql
-- Gebruiker mag alleen eigen bedrijf zien
CREATE POLICY "Users can view own company"
  ON companies FOR SELECT
  USING (id = get_user_company_id());
```

---

## Te Testen

- [ ] Maak 2 test-accounts bij verschillende bedrijven
- [ ] Verifieer dat bedrijf A geen data van bedrijf B kan zien
- [ ] Test INSERT met verkeerde company_id → moet falen
- [ ] Test via Supabase API explorer (niet alleen via de UI)
