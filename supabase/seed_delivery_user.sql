-- ============================================
-- Testgebruiker aanmaken voor Delivery dashboard
-- ============================================
--
-- BELANGRIJK: Dit script maakt ALLEEN het bedrijf + profiel aan.
-- De USER (auth) moet je HANDMATIG aanmaken in Supabase:
--
-- 1. Ga naar Supabase Dashboard → Authentication → Users
-- 2. Klik op "Add User" → "Create new user"
-- 3. Vul in:
--    - Email: delivery@boxspringplace.nl
--    - Password: admin123
--    - Auto confirm: AAN
-- 4. Kopieer de UUID van de nieuwe user
-- 5. Vervang hieronder '<USER_UUID>' door die UUID
-- 6. Voer dit script uit in de SQL Editor

-- Stap 1: Maak het bedrijf aan met plan_type = 'delivery'
INSERT INTO companies (id, name, plan_type)
VALUES (
  gen_random_uuid(),
  'BoxspringPlace',
  'delivery'
)
ON CONFLICT DO NOTHING;

-- Stap 2: Haal het company_id op en maak het profiel
-- VERVANG '<USER_UUID>' met de echte UUID uit stap 4 hierboven!
--
-- INSERT INTO profiles (id, full_name, company_id, role)
-- SELECT
--   '<USER_UUID>'::uuid,
--   'Delivery Admin',
--   c.id,
--   'admin'
-- FROM companies c
-- WHERE c.name = 'BoxspringPlace';
