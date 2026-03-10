-- ============================================
-- TAS Delivery Module - Database Migration
-- ============================================
-- Dit raakt GEEN bestaande tabellen (profiles, companies, drivers, trucks, clients, schedules)
-- Het voegt alleen NIEUWE tabellen toe + 1 kolom aan companies

-- 1. Voeg plan_type toe aan companies (bestaande bedrijven worden 'transport')
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS plan_type TEXT NOT NULL DEFAULT 'transport'
CHECK (plan_type IN ('transport', 'delivery'));

-- 2. Integrations tabel (Shopify API keys per bedrijf)
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  platform TEXT NOT NULL DEFAULT 'shopify',
  shop_domain TEXT,           -- bijv. "mijn-winkel.myshopify.com"
  api_key TEXT,               -- Shopify API key
  api_secret TEXT,            -- Shopify API secret
  access_token TEXT,          -- Shopify access token
  webhook_secret TEXT,        -- Voor HMAC verificatie
  is_active BOOLEAN NOT NULL DEFAULT false,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, platform)
);

-- 3. Orders tabel (Shopify orders)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  shopify_order_id TEXT,
  order_number TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  address TEXT NOT NULL,
  postcode TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT,
  country TEXT DEFAULT 'NL',
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'nieuw'
    CHECK (status IN ('nieuw', 'ingepland', 'onderweg', 'bezorgd', 'geannuleerd')),
  planned_date DATE,
  planned_position INTEGER,     -- volgorde binnen een dag
  notes TEXT,
  shopify_data JSONB,           -- volledige Shopify order data als backup
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes voor orders
CREATE INDEX IF NOT EXISTS idx_orders_company_id ON orders(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_planned_date ON orders(planned_date);
CREATE INDEX IF NOT EXISTS idx_orders_postcode ON orders(postcode);
CREATE INDEX IF NOT EXISTS idx_orders_shopify_id ON orders(shopify_order_id);

-- 4. Delivery Routes tabel
CREATE TABLE IF NOT EXISTS delivery_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  name TEXT,                    -- optionele route naam
  stops JSONB NOT NULL DEFAULT '[]'::jsonb,  -- geordende lijst van order_ids
  status TEXT NOT NULL DEFAULT 'gepland'
    CHECK (status IN ('gepland', 'onderweg', 'voltooid')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, date, name)
);

CREATE INDEX IF NOT EXISTS idx_delivery_routes_company_date ON delivery_routes(company_id, date);

-- 5. RLS Policies (Row Level Security)
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_routes ENABLE ROW LEVEL SECURITY;

-- Drop bestaande policies (zodat script opnieuw gedraaid kan worden)
DROP POLICY IF EXISTS integrations_select ON integrations;
DROP POLICY IF EXISTS integrations_insert ON integrations;
DROP POLICY IF EXISTS integrations_update ON integrations;
DROP POLICY IF EXISTS integrations_delete ON integrations;
DROP POLICY IF EXISTS orders_select ON orders;
DROP POLICY IF EXISTS orders_insert ON orders;
DROP POLICY IF EXISTS orders_update ON orders;
DROP POLICY IF EXISTS orders_delete ON orders;
DROP POLICY IF EXISTS delivery_routes_select ON delivery_routes;
DROP POLICY IF EXISTS delivery_routes_insert ON delivery_routes;
DROP POLICY IF EXISTS delivery_routes_update ON delivery_routes;
DROP POLICY IF EXISTS delivery_routes_delete ON delivery_routes;

-- Integrations: alleen eigen bedrijf
CREATE POLICY integrations_select ON integrations FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));
CREATE POLICY integrations_insert ON integrations FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));
CREATE POLICY integrations_update ON integrations FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));
CREATE POLICY integrations_delete ON integrations FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));

-- Orders: alleen eigen bedrijf
CREATE POLICY orders_select ON orders FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));
CREATE POLICY orders_insert ON orders FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));
CREATE POLICY orders_update ON orders FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));
CREATE POLICY orders_delete ON orders FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));

-- Delivery Routes: alleen eigen bedrijf
CREATE POLICY delivery_routes_select ON delivery_routes FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));
CREATE POLICY delivery_routes_insert ON delivery_routes FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));
CREATE POLICY delivery_routes_update ON delivery_routes FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));
CREATE POLICY delivery_routes_delete ON delivery_routes FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));

-- 6. Updated_at trigger functie (herbruikbaar)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers voor updated_at
DROP TRIGGER IF EXISTS set_updated_at_integrations ON integrations;
CREATE TRIGGER set_updated_at_integrations
  BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_orders ON orders;
CREATE TRIGGER set_updated_at_orders
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_delivery_routes ON delivery_routes;
CREATE TRIGGER set_updated_at_delivery_routes
  BEFORE UPDATE ON delivery_routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
