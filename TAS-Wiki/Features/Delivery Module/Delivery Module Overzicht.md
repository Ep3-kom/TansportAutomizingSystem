# Delivery Module — Overzicht

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Database Schema]] · [[Projectstructuur]] · [[Authenticatie]]

---

## Wat is de Delivery Module?

Een **tweede modus** binnen TAS, specifiek voor kleine bezorg-/transportbedrijven (1-10 medewerkers). Denk aan:
- Bedden- & boxspringwinkels die zelf bezorgen
- Meubelvervoer / verhuisbedrijven
- Keuken-/witgoed bezorging
- Elke kleine ondernemer die online verkoopt en zelf levert

Deze gebruikers zien een **volledig apart dashboard** zonder vlootbeheer, chauffeursbeheer of complexe planning-features.

---

## Hoe werkt de scheiding?

Het `companies` tabel heeft een `plan_type` kolom:

| plan_type | Dashboard | Doelgroep |
|-----------|-----------|-----------|
| `transport` | Bestaand TAS dashboard (chauffeurs, voertuigen, planning) | Transportbedrijven 5-25 vrachtwagens |
| `delivery` | Bezorg-dashboard (bestellingen, agenda, routes) | Kleine bezorgbedrijven 1-10 medewerkers |

Na inloggen checkt `App.jsx` het `plan_type` van het bedrijf en routeert naar het juiste dashboard. **Er is geen crossover** — elk type ziet alleen zijn eigen wereld.

---

## Features

- [[Delivery Dashboard]] — Overzicht met statistieken, weekoverzicht, vandaag-bezorgingen
- [[Bestellingen]] — Orderlijst met status-filters, toevoegen, detail-view
- [[Bezorgplanning]] — Drag & drop weekkalender, dag-weergave, Google Maps integratie
- [[Shopify Koppeling]] — API koppeling om automatisch orders te importeren
- [[Delivery Instellingen]] — Shopify koppeling + bedrijfsgegevens

---

## Technische architectuur

```
App.jsx
├── plan_type === 'transport'  →  AppLayout (bestaand, ONGEWIJZIGD)
│   ├── Sidebar.jsx
│   ├── TopBar.jsx
│   └── /dashboard, /chauffeurs, /voertuigen, /planning...
│
└── plan_type === 'delivery'   →  DeliveryLayout (NIEUW)
    ├── DeliverySidebar.jsx
    ├── DeliveryTopBar.jsx
    └── /delivery, /delivery/bestellingen, /delivery/planning, /delivery/instellingen
```

### Bestaande code impact

| Bestand | Wijziging |
|---------|-----------|
| `App.jsx` | DeliveryLayout import + plan_type routing toegevoegd |
| `useAuth.jsx` | **Geen wijziging** — haalt al `companies(*)` op inclusief plan_type |
| Alle andere bestanden | **Ongewijzigd** |

---

## Database tabellen

Zie [[Delivery Database Schema]] voor het volledige schema.

Nieuwe tabellen:
- `orders` — Bezorgorders (handmatig of via Shopify)
- `integrations` — Shopify API keys per bedrijf
- `delivery_routes` — Bezorgroutes per dag

Gewijzigd:
- `companies` — `plan_type` kolom toegevoegd (default `'transport'`)

---

## Bestanden overzicht

### Hooks (nieuw)
| Bestand | Functie |
|---------|---------|
| `hooks/useOrders.js` | CRUD orders, planning, statistieken |
| `hooks/useShopify.js` | Shopify integratie, sync orders |
| `hooks/useDeliveryRoutes.js` | Routes, Google Maps URL generator |

### Components (nieuw)
| Bestand | Functie |
|---------|---------|
| `components/delivery/DeliveryLayout.jsx` | Layout wrapper met eigen routing |
| `components/delivery/DeliverySidebar.jsx` | Navigatie voor bezorg-dashboard |
| `components/delivery/DeliveryTopBar.jsx` | Topbar met gebruiker + uitloggen |

### Pages (nieuw)
| Bestand | Functie |
|---------|---------|
| `pages/delivery/DeliveryDashboard.jsx` | Hoofddashboard |
| `pages/delivery/Orders.jsx` | Bestellingenlijst |
| `pages/delivery/DeliveryPlanning.jsx` | Drag & drop kalender |
| `pages/delivery/DeliverySettings.jsx` | Shopify koppeling + instellingen |

---

## Roadmap

### Fase 1 (MVP) — Voltooid
- [x] Database tabellen + RLS policies
- [x] Aparte delivery layout + routing
- [x] Bestellingen CRUD + status flow
- [x] Drag & drop planning kalender
- [x] Shopify API koppeling
- [x] Google Maps route-link

### Fase 2 (Gepland)
- [ ] Shopify webhook voor real-time sync
- [ ] Postcode-clustering voor slimme dagindeling
- [ ] Mobile-friendly "Vandaag" bezorg-view
- [ ] Notificaties bij nieuwe bestellingen

### Fase 3 (Gepland)
- [ ] Google Maps kaart-integratie in de app
- [ ] Shopify order status terugschrijven (fulfilled)
- [ ] WooCommerce / Bol.com koppelingen
- [ ] Geavanceerde statistieken

---

*Aangemaakt: 2026-03-09*
