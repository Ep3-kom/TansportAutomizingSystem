# Delivery Database Schema

Onderdeel van: [[Database Schema]] · [[Delivery Module Overzicht]]
Gerelateerd: [[Row Level Security]]

---

## ERD (aanvulling op bestaand schema)

```
companies ──< integrations (via company_id)
companies ──< orders (via company_id)
companies ──< delivery_routes (via company_id)
```

> Deze tabellen zijn volledig gescheiden van de transport-tabellen (drivers, trucks, schedules).

---

## Gewijzigde tabel

### `companies` — nieuwe kolom

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| plan_type | text NOT NULL DEFAULT 'transport' | 'transport' of 'delivery' — bepaalt welk dashboard |

CHECK constraint: `plan_type IN ('transport', 'delivery')`

> Alle bestaande bedrijven krijgen automatisch `plan_type = 'transport'`.

---

## Nieuwe tabellen

### `integrations`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| company_id | uuid (FK → companies) | Bedrijf |
| platform | text DEFAULT 'shopify' | Platform type |
| shop_domain | text | Shopify winkel URL |
| api_key | text | API key |
| api_secret | text | API secret |
| access_token | text | Access token |
| webhook_secret | text | HMAC verificatie |
| is_active | boolean DEFAULT false | Koppeling actief? |
| last_sync_at | timestamptz | Laatste sync |
| created_at | timestamptz | Aangemaakt op |
| updated_at | timestamptz | Bijgewerkt op |

UNIQUE constraint: `(company_id, platform)` — 1 koppeling per platform per bedrijf

→ Gebruikt door: [[Shopify Koppeling]]

### `orders`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| company_id | uuid (FK → companies) | Bedrijf |
| shopify_order_id | text | Shopify order ID |
| order_number | text | Ordernummer (#1001) |
| customer_name | text NOT NULL | Klantnaam |
| customer_email | text | E-mailadres |
| customer_phone | text | Telefoonnummer |
| address | text NOT NULL | Straat + huisnummer |
| postcode | text NOT NULL | Postcode |
| city | text NOT NULL | Stad |
| province | text | Provincie |
| country | text DEFAULT 'NL' | Landcode |
| products | jsonb DEFAULT '[]' | Producten array |
| status | text DEFAULT 'nieuw' | nieuw/ingepland/onderweg/bezorgd/geannuleerd |
| planned_date | date | Geplande bezorgdatum |
| planned_position | integer | Volgorde binnen een dag |
| notes | text | Notities |
| shopify_data | jsonb | Volledige Shopify data (backup) |
| created_at | timestamptz | Aangemaakt op |
| updated_at | timestamptz | Bijgewerkt op |

Indexes: `company_id`, `status`, `planned_date`, `postcode`, `shopify_order_id`

→ Gebruikt door: [[Bestellingen]], [[Bezorgplanning]], [[Delivery Dashboard]]

### `delivery_routes`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| company_id | uuid (FK → companies) | Bedrijf |
| date | date NOT NULL | Route datum |
| name | text | Route naam (optioneel) |
| stops | jsonb DEFAULT '[]' | Geordende lijst van order_ids |
| status | text DEFAULT 'gepland' | gepland/onderweg/voltooid |
| notes | text | Notities |
| created_at | timestamptz | Aangemaakt op |
| updated_at | timestamptz | Bijgewerkt op |

UNIQUE constraint: `(company_id, date, name)`
Index: `(company_id, date)`

→ Gebruikt door: [[Bezorgplanning]]

---

## RLS Policies

Alle drie de tabellen hebben Row Level Security ingeschakeld met policies voor SELECT, INSERT, UPDATE en DELETE. Elke policy checkt:

```sql
company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
```

Dit zorgt ervoor dat elk bedrijf alleen eigen data kan zien/bewerken.

---

## Triggers

Alle drie de tabellen hebben een `updated_at` trigger die automatisch het tijdstip bijwerkt bij elke UPDATE.

---

## Migration bestand

`supabase/migration_delivery.sql` — bevat het volledige schema + RLS + triggers.

---

*Aangemaakt: 2026-03-09*
