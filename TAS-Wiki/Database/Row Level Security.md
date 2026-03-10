# Row Level Security (RLS)

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Database Schema]] · [[Supabase Setup]] · [[Security Checklist]] · [[Authenticatie]]

---

## Status: ✅ ACTIEF (10 maart 2025)

RLS is geactiveerd op **alle 11 tabellen** in de database. Elke tabel heeft policies voor SELECT, INSERT, UPDATE en DELETE die afdwingen dat gebruikers alleen data van hun eigen bedrijf kunnen zien en bewerken.

---

## Wat is RLS?

Row Level Security is beveiliging op **database-niveau**. Zonder RLS kan iedereen met de publieke `anon` key (die in de frontend staat) via de Supabase API data van **alle bedrijven** opvragen. Met RLS voegt de database automatisch een onzichtbaar `WHERE`-filter toe:

```
Zonder RLS:  SELECT * FROM orders  → ALLE orders van ALLE bedrijven
Met RLS:     SELECT * FROM orders  → alleen orders van JOUW bedrijf
```

De frontend filterde al op `company_id`, maar dat is geen echte beveiliging — een technisch handig persoon kan dat omzeilen. RLS maakt het onmogelijk op database-niveau.

---

## Beveiligde Tabellen

| Tabel | RLS | Policies | Isolatie |
|-------|-----|----------|----------|
| `companies` | ✅ | SELECT, UPDATE | `id` match via profiles |
| `profiles` | ✅ | SELECT, UPDATE | eigen profiel + collega's |
| `clients` | ✅ | SELECT, INSERT, UPDATE, DELETE | `company_id` |
| `drivers` | ✅ | SELECT, INSERT, UPDATE, DELETE | `company_id` |
| `trucks` | ✅ | SELECT, INSERT, UPDATE, DELETE | `company_id` |
| `trips` | ✅ | SELECT, INSERT, UPDATE, DELETE | `company_id` |
| `schedules` | ✅ | SELECT, INSERT, UPDATE, DELETE | `company_id` |
| `maintenance` | ✅ | SELECT, INSERT, UPDATE, DELETE | `company_id` |
| `orders` | ✅ | SELECT, INSERT, UPDATE, DELETE | `company_id` |
| `integrations` | ✅ | SELECT, INSERT, UPDATE, DELETE | `company_id` |
| `delivery_routes` | ✅ | SELECT, INSERT, UPDATE, DELETE | `company_id` |

---

## Hoe werkt het?

Elke policy controleert of de `company_id` van de rij overeenkomt met het bedrijf van de ingelogde gebruiker:

```sql
-- Standaard policy (voor tabellen met company_id)
CREATE POLICY {tabel}_select ON {tabel} FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));
```

`auth.uid()` is de ingelogde gebruiker → opzoeken in `profiles` → `company_id` ophalen → alleen rijen tonen met die `company_id`.

### Speciale gevallen

**Companies** — gebruikt `id` in plaats van `company_id`:
```sql
USING (id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));
```

**Profiles** — gebruiker ziet eigen profiel + collega's van hetzelfde bedrijf:
```sql
USING (id = auth.uid() OR company_id IN (
  SELECT company_id FROM profiles WHERE id = auth.uid()
));
```

**Companies & Profiles** — hebben geen INSERT/DELETE policies omdat ze aangemaakt worden via de `handle_new_user()` trigger bij registratie.

---

## Service Role Key

De `service_role` key bypassed RLS automatisch. Deze key wordt alleen server-side gebruikt en staat **nooit** in frontend code.

- `anon` key (frontend) → RLS is actief, data gefilterd
- `service_role` key (backend) → RLS wordt overgeslagen, volledige toegang

---

## Migratiebestand

Het volledige SQL-script staat in:
`supabase/migration_rls_all_tables.sql`

Dit script is idempotent (veilig om meerdere keren te draaien) — het dropt eerst bestaande policies voordat het nieuwe aanmaakt.

---

## Verificatie

Controleer RLS-status met:
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```
Alle 11 tabellen moeten `true` tonen.

### Test checklist

- [x] RLS geactiveerd op alle tabellen
- [x] Alle tabellen tonen `rowsecurity = true`
- [ ] Maak 2 test-accounts bij verschillende bedrijven
- [ ] Verifieer dat bedrijf A geen data van bedrijf B kan zien
- [ ] Test INSERT met verkeerde company_id → moet falen
- [ ] Test via Supabase API explorer (niet alleen via de UI)
