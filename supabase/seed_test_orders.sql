-- ============================================
-- Test orders voor BoxspringPlace
-- ============================================
-- Voer dit uit in de SQL Editor om testdata te laden

INSERT INTO orders (company_id, order_number, customer_name, customer_phone, customer_email, address, postcode, city, products, status, notes)
SELECT c.id, '#1001', 'Jan de Vries', '0612345678', 'jan@email.nl', 'Keizersgracht 123', '1015 CJ', 'Amsterdam',
  '[{"title": "Boxspring 180x200", "quantity": 1}, {"title": "Matras Comfort", "quantity": 1}]'::jsonb,
  'nieuw', '2e verdieping, geen lift'
FROM companies c WHERE c.name = 'BoxspringPlace';

INSERT INTO orders (company_id, order_number, customer_name, customer_phone, customer_email, address, postcode, city, products, status, notes)
SELECT c.id, '#1002', 'Maria Jansen', '0687654321', 'maria@email.nl', 'Oudegracht 45', '3511 AP', 'Utrecht',
  '[{"title": "Boxspring 160x200", "quantity": 1}]'::jsonb,
  'nieuw', NULL
FROM companies c WHERE c.name = 'BoxspringPlace';

INSERT INTO orders (company_id, order_number, customer_name, customer_phone, customer_email, address, postcode, city, products, status, notes)
SELECT c.id, '#1003', 'Pieter Bakker', '0698765432', 'pieter@email.nl', 'Marktweg 78', '2515 BH', 'Den Haag',
  '[{"title": "Topper 180x200", "quantity": 2}]'::jsonb,
  'nieuw', 'Graag voor 14:00'
FROM companies c WHERE c.name = 'BoxspringPlace';

INSERT INTO orders (company_id, order_number, customer_name, customer_phone, customer_email, address, postcode, city, products, status, notes)
SELECT c.id, '#1004', 'Sophie van Dijk', '0676543210', 'sophie@email.nl', 'Coolsingel 100', '3011 AG', 'Rotterdam',
  '[{"title": "Boxspring 140x200", "quantity": 1}, {"title": "Hoofdkussen Memory Foam", "quantity": 2}]'::jsonb,
  'nieuw', 'Bellen voor levering'
FROM companies c WHERE c.name = 'BoxspringPlace';

INSERT INTO orders (company_id, order_number, customer_name, customer_phone, customer_email, address, postcode, city, products, status, notes)
SELECT c.id, '#1005', 'Thomas Mulder', '0665432109', NULL, 'Grote Markt 12', '9712 CH', 'Groningen',
  '[{"title": "Boxspring 180x200 Deluxe", "quantity": 1}]'::jsonb,
  'nieuw', NULL
FROM companies c WHERE c.name = 'BoxspringPlace';

INSERT INTO orders (company_id, order_number, customer_name, customer_phone, customer_email, address, postcode, city, products, status, notes)
SELECT c.id, '#1006', 'Lisa de Boer', '0654321098', 'lisa@email.nl', 'Brink 5', '7411 BR', 'Deventer',
  '[{"title": "Matras Stevig 90x200", "quantity": 2}]'::jsonb,
  'nieuw', 'Studentenkamer, smalle trap'
FROM companies c WHERE c.name = 'BoxspringPlace';

INSERT INTO orders (company_id, order_number, customer_name, customer_phone, customer_email, address, postcode, city, products, status, notes)
SELECT c.id, '#1007', 'Ahmed El Amrani', '0643210987', 'ahmed@email.nl', 'Stratumseind 55', '5611 ER', 'Eindhoven',
  '[{"title": "Boxspring 200x200 King", "quantity": 1}, {"title": "Dekbed 4-seizoenen", "quantity": 1}]'::jsonb,
  'nieuw', 'Begane grond'
FROM companies c WHERE c.name = 'BoxspringPlace';

INSERT INTO orders (company_id, order_number, customer_name, customer_phone, customer_email, address, postcode, city, products, status, notes)
SELECT c.id, '#1008', 'Emma Visser', '0632109876', 'emma@email.nl', 'Herestraat 20', '1011 AB', 'Amsterdam',
  '[{"title": "Boxspring 180x200", "quantity": 1}]'::jsonb,
  'nieuw', NULL
FROM companies c WHERE c.name = 'BoxspringPlace';
