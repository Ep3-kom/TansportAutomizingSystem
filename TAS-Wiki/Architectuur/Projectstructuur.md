# Projectstructuur

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Tech Stack]] · [[Database Schema]]

---

```
TansportAutomizingSystem/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          → Sidebar.jsx, TopBar.jsx (transport)
│   │   │   ├── delivery/        → DeliveryLayout.jsx, DeliverySidebar.jsx, DeliveryTopBar.jsx
│   │   │   ├── ui/              → Modal.jsx, ConfirmDialog.jsx, StatCard.jsx
│   │   │   ├── drivers/         → DriverForm.jsx
│   │   │   ├── trucks/          → TruckForm.jsx
│   │   │   ├── planning/        → ScheduleForm.jsx
│   │   │   └── clients/         → ClientForm.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     → [[Dashboard]]
│   │   │   ├── Drivers.jsx       → [[Chauffeursbeheer]]
│   │   │   ├── Trucks.jsx        → [[Voertuigbeheer]]
│   │   │   ├── Planning.jsx      → [[Ritplanning]]
│   │   │   ├── Clients.jsx       → [[Klantenbeheer]]
│   │   │   ├── Maintenance.jsx   → [[Onderhoudstracker]] (placeholder)
│   │   │   ├── Settings.jsx      → [[Settings Pagina]]
│   │   │   ├── Login.jsx         → [[Authenticatie]]
│   │   │   ├── Register.jsx      → [[Authenticatie]]
│   │   │   └── delivery/         → [[Delivery Module Overzicht]]
│   │   │       ├── DeliveryDashboard.jsx  → [[Delivery Dashboard]]
│   │   │       ├── Orders.jsx             → [[Bestellingen]]
│   │   │       ├── DeliveryPlanning.jsx   → [[Bezorgplanning]]
│   │   │       └── DeliverySettings.jsx   → [[Delivery Instellingen]]
│   │   ├── hooks/
│   │   │   ├── useAuth.jsx       → Auth state + bedrijfsprofiel
│   │   │   ├── useDrivers.js     → CRUD chauffeurs
│   │   │   ├── useTrucks.js      → CRUD voertuigen + RDW API
│   │   │   ├── useSchedules.js   → CRUD planningen
│   │   │   ├── useClients.js     → CRUD klanten
│   │   │   ├── useOrders.js      → CRUD bezorgorders
│   │   │   ├── useShopify.js     → Shopify API koppeling
│   │   │   └── useDeliveryRoutes.js → Bezorgroutes + Google Maps
│   │   ├── lib/
│   │   │   └── supabase.js       → [[Supabase Setup]]
│   │   ├── App.jsx               → Router + auth guard + plan_type routing
│   │   ├── main.jsx              → Entry point
│   │   └── index.css             → Tailwind + thema
│   ├── package.json
│   └── vite.config.js
├── supabase/
│   ├── migration_delivery.sql    → [[Delivery Database Schema]]
│   └── seed_delivery_user.sql    → Test gebruiker aanmaken
├── Documentatie/
│   ├── technischeplanTAS.md
│   └── projectplanTAS.md
└── SETUP.md
```

## Ontbrekende bestanden (gepland maar niet aangemaakt)

- `src/lib/exportPdf.js` — zie [[Data Export]]
- `src/lib/exportExcel.js` — zie [[Data Export]]
- `src/hooks/useMaintenance.js` — zie [[Onderhoudstracker]]
