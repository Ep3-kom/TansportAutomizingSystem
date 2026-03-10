DELETE FROM orders WHERE company_id = (
  SELECT id FROM companies WHERE name = 'BoxspringPlace'
);
