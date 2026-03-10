-- ============================================
-- TAS - Row Level Security (RLS) voor ALLE tabellen
-- ============================================
-- Voer dit uit in de Supabase SQL Editor.
-- Dit script is veilig om meerdere keren te draaien (idempotent).
--
-- Wat het doet:
--   1. Activeert RLS op alle tabellen
--   2. Maakt policies aan zodat gebruikers ALLEEN data van hun eigen bedrijf zien
--   3. Dekt: companies, profiles, clients, drivers, trucks, trips,
--            schedules, maintenance, orders, integrations, delivery_routes

-- ============================================
-- STAP 0: Check huidige RLS status (optioneel, voor debugging)
-- ============================================
-- Voer dit apart uit om te zien welke tabellen al RLS aan hebben:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- ============================================
-- STAP 1: RLS activeren op alle tabellen
-- ============================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_routes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STAP 2: Verwijder bestaande policies (zodat dit script opnieuw gedraaid kan worden)
-- ============================================

-- companies
DROP POLICY IF EXISTS companies_select ON companies;
DROP POLICY IF EXISTS companies_update ON companies;

-- profiles
DROP POLICY IF EXISTS profiles_select ON profiles;
DROP POLICY IF EXISTS profiles_update ON profiles;

-- clients
DROP POLICY IF EXISTS clients_select ON clients;
DROP POLICY IF EXISTS clients_insert ON clients;
DROP POLICY IF EXISTS clients_update ON clients;
DROP POLICY IF EXISTS clients_delete ON clients;

-- drivers
DROP POLICY IF EXISTS drivers_select ON drivers;
DROP POLICY IF EXISTS drivers_insert ON drivers;
DROP POLICY IF EXISTS drivers_update ON drivers;
DROP POLICY IF EXISTS drivers_delete ON drivers;

-- trucks
DROP POLICY IF EXISTS trucks_select ON trucks;
DROP POLICY IF EXISTS trucks_insert ON trucks;
DROP POLICY IF EXISTS trucks_update ON trucks;
DROP POLICY IF EXISTS trucks_delete ON trucks;

-- trips
DROP POLICY IF EXISTS trips_select ON trips;
DROP POLICY IF EXISTS trips_insert ON trips;
DROP POLICY IF EXISTS trips_update ON trips;
DROP POLICY IF EXISTS trips_delete ON trips;

-- schedules
DROP POLICY IF EXISTS schedules_select ON schedules;
DROP POLICY IF EXISTS schedules_insert ON schedules;
DROP POLICY IF EXISTS schedules_update ON schedules;
DROP POLICY IF EXISTS schedules_delete ON schedules;

-- maintenance
DROP POLICY IF EXISTS maintenance_select ON maintenance;
DROP POLICY IF EXISTS maintenance_insert ON maintenance;
DROP POLICY IF EXISTS maintenance_update ON maintenance;
DROP POLICY IF EXISTS maintenance_delete ON maintenance;

-- orders
DROP POLICY IF EXISTS orders_select ON orders;
DROP POLICY IF EXISTS orders_insert ON orders;
DROP POLICY IF EXISTS orders_update ON orders;
DROP POLICY IF EXISTS orders_delete ON orders;

-- integrations
DROP POLICY IF EXISTS integrations_select ON integrations;
DROP POLICY IF EXISTS integrations_insert ON integrations;
DROP POLICY IF EXISTS integrations_update ON integrations;
DROP POLICY IF EXISTS integrations_delete ON integrations;

-- delivery_routes
DROP POLICY IF EXISTS delivery_routes_select ON delivery_routes;
DROP POLICY IF EXISTS delivery_routes_insert ON delivery_routes;
DROP POLICY IF EXISTS delivery_routes_update ON delivery_routes;
DROP POLICY IF EXISTS delivery_routes_delete ON delivery_routes;

-- ============================================
-- STAP 3: Policies aanmaken
-- ============================================

-- ------------------------------------------
-- COMPANIES - gebruiker ziet alleen eigen bedrijf
-- ------------------------------------------
CREATE POLICY companies_select ON companies FOR SELECT
  USING (id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY companies_update ON companies FOR UPDATE
  USING (id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));
-- Geen INSERT/DELETE: bedrijven worden aangemaakt via de handle_new_user() trigger

-- ------------------------------------------
-- PROFILES - gebruiker ziet eigen profiel + collega's van hetzelfde bedrijf
-- ------------------------------------------
CREATE POLICY profiles_select ON profiles FOR SELECT
  USING (
    id = auth.uid()
    OR company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY profiles_update ON profiles FOR UPDATE
  USING (id = auth.uid());
-- Geen INSERT/DELETE: profielen worden aangemaakt via de handle_new_user() trigger

-- ------------------------------------------
-- CLIENTS - alleen eigen bedrijf
-- ------------------------------------------
CREATE POLICY clients_select ON clients FOR SELECT
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY clients_insert ON clients FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY clients_update ON clients FOR UPDATE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY clients_delete ON clients FOR DELETE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- ------------------------------------------
-- DRIVERS - alleen eigen bedrijf
-- ------------------------------------------
CREATE POLICY drivers_select ON drivers FOR SELECT
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY drivers_insert ON drivers FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY drivers_update ON drivers FOR UPDATE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY drivers_delete ON drivers FOR DELETE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- ------------------------------------------
-- TRUCKS - alleen eigen bedrijf
-- ------------------------------------------
CREATE POLICY trucks_select ON trucks FOR SELECT
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY trucks_insert ON trucks FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY trucks_update ON trucks FOR UPDATE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY trucks_delete ON trucks FOR DELETE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- ------------------------------------------
-- TRIPS - alleen eigen bedrijf
-- ------------------------------------------
CREATE POLICY trips_select ON trips FOR SELECT
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY trips_insert ON trips FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY trips_update ON trips FOR UPDATE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY trips_delete ON trips FOR DELETE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- ------------------------------------------
-- SCHEDULES - alleen eigen bedrijf
-- ------------------------------------------
CREATE POLICY schedules_select ON schedules FOR SELECT
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY schedules_insert ON schedules FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY schedules_update ON schedules FOR UPDATE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY schedules_delete ON schedules FOR DELETE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- ------------------------------------------
-- MAINTENANCE - alleen eigen bedrijf
-- ------------------------------------------
CREATE POLICY maintenance_select ON maintenance FOR SELECT
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY maintenance_insert ON maintenance FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY maintenance_update ON maintenance FOR UPDATE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY maintenance_delete ON maintenance FOR DELETE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- ------------------------------------------
-- ORDERS - alleen eigen bedrijf
-- ------------------------------------------
CREATE POLICY orders_select ON orders FOR SELECT
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY orders_insert ON orders FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY orders_update ON orders FOR UPDATE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY orders_delete ON orders FOR DELETE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- ------------------------------------------
-- INTEGRATIONS - alleen eigen bedrijf
-- ------------------------------------------
CREATE POLICY integrations_select ON integrations FOR SELECT
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY integrations_insert ON integrations FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY integrations_update ON integrations FOR UPDATE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY integrations_delete ON integrations FOR DELETE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- ------------------------------------------
-- DELIVERY_ROUTES - alleen eigen bedrijf
-- ------------------------------------------
CREATE POLICY delivery_routes_select ON delivery_routes FOR SELECT
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY delivery_routes_insert ON delivery_routes FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY delivery_routes_update ON delivery_routes FOR UPDATE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY delivery_routes_delete ON delivery_routes FOR DELETE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- ============================================
-- KLAAR!
-- ============================================
-- Verificatie: voer dit uit om te checken dat alles actief is:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- Alle 11 tabellen moeten "true" tonen bij rowsecurity.
