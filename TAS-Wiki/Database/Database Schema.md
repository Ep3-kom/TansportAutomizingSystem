# Database Schema

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Supabase Setup]] · [[Row Level Security]]

---

## ERD (Entity Relationship Diagram)

```
companies ──< profiles (via company_id)
companies ──< drivers (via company_id)
companies ──< trucks (via company_id)  ──< maintenance (via truck_id)
companies ──< clients (via company_id)
companies ──< schedules (via company_id)
                schedules >── drivers (via driver_id)
                schedules >── trucks (via truck_id)
                schedules >── clients (via client_id)

— Delivery Module (zie [[Delivery Database Schema]]) —
companies ──< orders (via company_id)
companies ──< integrations (via company_id)
companies ──< delivery_routes (via company_id)
```

> Alle tabellen hebben `company_id` als FK → dit maakt [[Row Level Security|multi-tenant isolatie]] mogelijk.

---

## Tabellen

### `companies`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| name | text | Bedrijfsnaam |
| kvk_number | text | KvK-nummer |
| email | text | Hoofde-mail |
| phone | text | Telefoonnummer |
| plan | text | 'starter' / 'groei' / 'pro' |
| stripe_customer_id | text | Stripe klant-ID *(nog niet gebruikt)* |
| created_at | timestamptz | Aangemaakt op |

→ Gebruikt door: [[Authenticatie]], [[Settings Pagina]], [[Prijsmodel]]

### `profiles`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK, FK → auth.users) | Gekoppeld aan Supabase Auth |
| company_id | uuid (FK → companies) | Bedrijf van de gebruiker |
| full_name | text | Volledige naam |
| role | text | 'admin' / 'planner' / 'viewer' |
| created_at | timestamptz | Aangemaakt op |

→ Gebruikt door: [[Authenticatie]], rollen (zie [[Launch Checklist]] — RBAC)

### `drivers`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| company_id | uuid (FK) | Bedrijf |
| name | text | Volledige naam |
| phone | text | Telefoonnummer |
| license_type | text | 'C' / 'CE' / 'C1' / 'C1E' |
| status | text | 'actief' / 'verlof' / 'ziek' |
| notes | text | Opmerkingen |
| created_at | timestamptz | Aangemaakt op |

→ Gebruikt door: [[Chauffeursbeheer]], [[Ritplanning]], [[Dashboard]]

### `trucks`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| company_id | uuid (FK) | Bedrijf |
| license_plate | text | Kenteken |
| brand_model | text | Merk en type |
| apk_expiry | date | APK vervaldatum |
| status | text | 'beschikbaar' / 'onderhoud' / 'defect' |
| mileage | integer | Kilometerstand |
| weight | integer | Gewicht |
| notes | text | Opmerkingen |
| created_at | timestamptz | Aangemaakt op |

→ Gebruikt door: [[Voertuigbeheer]], [[Onderhoudstracker]], [[Dashboard]]

### `clients`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| company_id | uuid (FK) | Bedrijf |
| name | text | Bedrijfsnaam klant |
| contact_person | text | Contactpersoon |
| email | text | E-mailadres |
| phone | text | Telefoonnummer |
| address | text | Adres |
| notes | text | Opmerkingen |
| created_at | timestamptz | Aangemaakt op |

→ Gebruikt door: [[Klantenbeheer]], [[Ritplanning]]

### `schedules`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| company_id | uuid (FK) | Bedrijf |
| driver_id | uuid (FK → drivers) | Chauffeur |
| client_id | uuid (FK → clients) | Klant (optioneel) |
| date | date | Datum |
| start_time | time | Starttijd |
| end_time | time | Eindtijd |
| notes | text | Opmerkingen |
| created_at | timestamptz | Aangemaakt op |

→ Gebruikt door: [[Ritplanning]], [[Dashboard]]

### `maintenance`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| company_id | uuid (FK) | Bedrijf |
| truck_id | uuid (FK → trucks) | Voertuig |
| type | text | 'apk' / 'onderhoud' / 'reparatie' / 'banden' |
| scheduled_date | date | Geplande datum |
| completed_date | date | Afgeronde datum |
| status | text | 'gepland' / 'bezig' / 'afgerond' |
| cost | decimal | Kosten |
| notes | text | Opmerkingen |
| created_at | timestamptz | Aangemaakt op |

→ Gebruikt door: [[Onderhoudstracker]]

---

## Indexen

```sql
CREATE INDEX idx_drivers_company ON drivers(company_id);
CREATE INDEX idx_trucks_company ON trucks(company_id);
CREATE INDEX idx_trips_company ON trips(company_id);
CREATE INDEX idx_trips_date ON trips(company_id, date);
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_maintenance_truck ON maintenance(truck_id);
CREATE INDEX idx_clients_company ON clients(company_id);
```
