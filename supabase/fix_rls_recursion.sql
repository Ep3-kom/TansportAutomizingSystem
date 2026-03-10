-- ============================================
-- FIX: RLS infinite recursion op profiles tabel
-- ============================================
-- Probleem: alle RLS policies gebruiken een subquery op profiles,
-- maar profiles zelf heeft ook RLS → oneindige recursie → 500 error.
--
-- Oplossing: een SECURITY DEFINER functie die RLS bypassed
-- om de company_id van de ingelogde gebruiker op te halen.
-- ============================================

-- STAP 1: Helper functie aanmaken
CREATE OR REPLACE FUNCTION get_my_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM profiles WHERE id = auth.uid()
$$;

-- STAP 2: Profiles policies opnieuw aanmaken (zonder zelf-referentie)
DROP POLICY IF EXISTS profiles_select ON profiles;
DROP POLICY IF EXISTS profiles_update ON profiles;

CREATE POLICY profiles_select ON profiles FOR SELECT
  USING (
    id = auth.uid()
    OR company_id = get_my_company_id()
  );

CREATE POLICY profiles_update ON profiles FOR UPDATE
  USING (id = auth.uid());

-- STAP 3: Companies policies opnieuw aanmaken
DROP POLICY IF EXISTS companies_select ON companies;
DROP POLICY IF EXISTS companies_update ON companies;

CREATE POLICY companies_select ON companies FOR SELECT
  USING (id = get_my_company_id());

CREATE POLICY companies_update ON companies FOR UPDATE
  USING (id = get_my_company_id());

-- STAP 4: Alle andere tabellen — gebruik de functie i.p.v. subquery
-- CLIENTS
DROP POLICY IF EXISTS clients_select ON clients;
DROP POLICY IF EXISTS clients_insert ON clients;
DROP POLICY IF EXISTS clients_update ON clients;
DROP POLICY IF EXISTS clients_delete ON clients;

CREATE POLICY clients_select ON clients FOR SELECT
  USING (company_id = get_my_company_id());
CREATE POLICY clients_insert ON clients FOR INSERT
  WITH CHECK (company_id = get_my_company_id());
CREATE POLICY clients_update ON clients FOR UPDATE
  USING (company_id = get_my_company_id());
CREATE POLICY clients_delete ON clients FOR DELETE
  USING (company_id = get_my_company_id());

-- DRIVERS
DROP POLICY IF EXISTS drivers_select ON drivers;
DROP POLICY IF EXISTS drivers_insert ON drivers;
DROP POLICY IF EXISTS drivers_update ON drivers;
DROP POLICY IF EXISTS drivers_delete ON drivers;

CREATE POLICY drivers_select ON drivers FOR SELECT
  USING (company_id = get_my_company_id());
CREATE POLICY drivers_insert ON drivers FOR INSERT
  WITH CHECK (company_id = get_my_company_id());
CREATE POLICY drivers_update ON drivers FOR UPDATE
  USING (company_id = get_my_company_id());
CREATE POLICY drivers_delete ON drivers FOR DELETE
  USING (company_id = get_my_company_id());

-- TRUCKS
DROP POLICY IF EXISTS trucks_select ON trucks;
DROP POLICY IF EXISTS trucks_insert ON trucks;
DROP POLICY IF EXISTS trucks_update ON trucks;
DROP POLICY IF EXISTS trucks_delete ON trucks;

CREATE POLICY trucks_select ON trucks FOR SELECT
  USING (company_id = get_my_company_id());
CREATE POLICY trucks_insert ON trucks FOR INSERT
  WITH CHECK (company_id = get_my_company_id());
CREATE POLICY trucks_update ON trucks FOR UPDATE
  USING (company_id = get_my_company_id());
CREATE POLICY trucks_delete ON trucks FOR DELETE
  USING (company_id = get_my_company_id());

-- TRIPS
DROP POLICY IF EXISTS trips_select ON trips;
DROP POLICY IF EXISTS trips_insert ON trips;
DROP POLICY IF EXISTS trips_update ON trips;
DROP POLICY IF EXISTS trips_delete ON trips;

CREATE POLICY trips_select ON trips FOR SELECT
  USING (company_id = get_my_company_id());
CREATE POLICY trips_insert ON trips FOR INSERT
  WITH CHECK (company_id = get_my_company_id());
CREATE POLICY trips_update ON trips FOR UPDATE
  USING (company_id = get_my_company_id());
CREATE POLICY trips_delete ON trips FOR DELETE
  USING (company_id = get_my_company_id());

-- SCHEDULES
DROP POLICY IF EXISTS schedules_select ON schedules;
DROP POLICY IF EXISTS schedules_insert ON schedules;
DROP POLICY IF EXISTS schedules_update ON schedules;
DROP POLICY IF EXISTS schedules_delete ON schedules;

CREATE POLICY schedules_select ON schedules FOR SELECT
  USING (company_id = get_my_company_id());
CREATE POLICY schedules_insert ON schedules FOR INSERT
  WITH CHECK (company_id = get_my_company_id());
CREATE POLICY schedules_update ON schedules FOR UPDATE
  USING (company_id = get_my_company_id());
CREATE POLICY schedules_delete ON schedules FOR DELETE
  USING (company_id = get_my_company_id());

-- MAINTENANCE
DROP POLICY IF EXISTS maintenance_select ON maintenance;
DROP POLICY IF EXISTS maintenance_insert ON maintenance;
DROP POLICY IF EXISTS maintenance_update ON maintenance;
DROP POLICY IF EXISTS maintenance_delete ON maintenance;

CREATE POLICY maintenance_select ON maintenance FOR SELECT
  USING (company_id = get_my_company_id());
CREATE POLICY maintenance_insert ON maintenance FOR INSERT
  WITH CHECK (company_id = get_my_company_id());
CREATE POLICY maintenance_update ON maintenance FOR UPDATE
  USING (company_id = get_my_company_id());
CREATE POLICY maintenance_delete ON maintenance FOR DELETE
  USING (company_id = get_my_company_id());

-- ORDERS
DROP POLICY IF EXISTS orders_select ON orders;
DROP POLICY IF EXISTS orders_insert ON orders;
DROP POLICY IF EXISTS orders_update ON orders;
DROP POLICY IF EXISTS orders_delete ON orders;

CREATE POLICY orders_select ON orders FOR SELECT
  USING (company_id = get_my_company_id());
CREATE POLICY orders_insert ON orders FOR INSERT
  WITH CHECK (company_id = get_my_company_id());
CREATE POLICY orders_update ON orders FOR UPDATE
  USING (company_id = get_my_company_id());
CREATE POLICY orders_delete ON orders FOR DELETE
  USING (company_id = get_my_company_id());

-- INTEGRATIONS
DROP POLICY IF EXISTS integrations_select ON integrations;
DROP POLICY IF EXISTS integrations_insert ON integrations;
DROP POLICY IF EXISTS integrations_update ON integrations;
DROP POLICY IF EXISTS integrations_delete ON integrations;

CREATE POLICY integrations_select ON integrations FOR SELECT
  USING (company_id = get_my_company_id());
CREATE POLICY integrations_insert ON integrations FOR INSERT
  WITH CHECK (company_id = get_my_company_id());
CREATE POLICY integrations_update ON integrations FOR UPDATE
  USING (company_id = get_my_company_id());
CREATE POLICY integrations_delete ON integrations FOR DELETE
  USING (company_id = get_my_company_id());

-- DELIVERY_ROUTES
DROP POLICY IF EXISTS delivery_routes_select ON delivery_routes;
DROP POLICY IF EXISTS delivery_routes_insert ON delivery_routes;
DROP POLICY IF EXISTS delivery_routes_update ON delivery_routes;
DROP POLICY IF EXISTS delivery_routes_delete ON delivery_routes;

CREATE POLICY delivery_routes_select ON delivery_routes FOR SELECT
  USING (company_id = get_my_company_id());
CREATE POLICY delivery_routes_insert ON delivery_routes FOR INSERT
  WITH CHECK (company_id = get_my_company_id());
CREATE POLICY delivery_routes_update ON delivery_routes FOR UPDATE
  USING (company_id = get_my_company_id());
CREATE POLICY delivery_routes_delete ON delivery_routes FOR DELETE
  USING (company_id = get_my_company_id());

-- ============================================
-- KLAAR! De 500 errors zouden nu opgelost moeten zijn.
-- ============================================
