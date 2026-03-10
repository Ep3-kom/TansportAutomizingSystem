# Shopify Koppeling

Onderdeel van: [[Delivery Module Overzicht]]
Hook: `hooks/useShopify.js`
Settings UI: `pages/delivery/DeliverySettings.jsx`

---

## Beschrijving

Koppelt een Shopify webshop aan TAS om automatisch bestellingen te importeren.

## Setup instructies

### In Shopify:
1. Ga naar **Settings → Apps and sales channels → Develop apps**
2. Maak een **Custom App** aan
3. Geef de app de volgende API rechten:
   - `read_orders` — bestellingen ophalen
   - `write_orders` — status terugschrijven (fase 3)
   - `read_products` — productinfo ophalen
4. Installeer de app en kopieer het **Admin API access token**

### In TAS:
1. Ga naar **Instellingen → Shopify Koppeling**
2. Vul in:
   - **Shop domein**: `jouw-winkel.myshopify.com`
   - **Access Token**: het token uit stap 4
3. Klik **Koppelen**
4. Klik **Sync nu** om bestellingen op te halen

## Hoe de sync werkt

1. TAS roept de Shopify Admin API aan: `GET /admin/api/2024-01/orders.json`
2. Per order wordt gecheckt of `shopify_order_id` al bestaat in de database
3. Nieuwe orders worden aangemaakt met:
   - Klantgegevens uit shipping/billing address
   - Producten uit line_items
   - Status: `nieuw` (tenzij al fulfilled in Shopify → `bezorgd`)
4. `last_sync_at` wordt bijgewerkt

## Data mapping

| Shopify veld | TAS orders kolom |
|-------------|-----------------|
| `id` | `shopify_order_id` |
| `name` / `order_number` | `order_number` |
| `shipping_address.first_name + last_name` | `customer_name` |
| `email` | `customer_email` |
| `shipping_address.phone` | `customer_phone` |
| `shipping_address.address1 + address2` | `address` |
| `shipping_address.zip` | `postcode` |
| `shipping_address.city` | `city` |
| `line_items[]` | `products` (JSONB) |
| `note` | `notes` |
| Volledige order | `shopify_data` (JSONB backup) |

## Database

Opgeslagen in de `integrations` tabel:

| Kolom | Beschrijving |
|-------|-------------|
| `shop_domain` | Shopify winkel URL |
| `access_token` | API token |
| `is_active` | Koppeling actief? |
| `last_sync_at` | Laatste synchronisatie |

## Beperkingen (huidige versie)

- Sync is handmatig (klik op "Sync nu")
- Maximaal 50 orders per sync
- Geen webhook (real-time) — gepland voor Fase 2
- Geen status terugschrijven naar Shopify — gepland voor Fase 3

---

*Aangemaakt: 2026-03-09*
