# Projectstructuur

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Tech Stack]] · [[Database Schema]]

---

```
TansportAutomizingSystem/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          → Sidebar.jsx, TopBar.jsx
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
│   │   │   ├── Settings.jsx      → [[Settings Pagina]] (placeholder)
│   │   │   ├── Login.jsx         → [[Authenticatie]]
│   │   │   └── Register.jsx      → [[Authenticatie]]
│   │   ├── hooks/
│   │   │   ├── useAuth.js        → Auth state + bedrijfsprofiel
│   │   │   ├── useDrivers.js     → CRUD chauffeurs
│   │   │   ├── useTrucks.js      → CRUD voertuigen + RDW API
│   │   │   ├── useSchedules.js   → CRUD planningen
│   │   │   └── useClients.js     → CRUD klanten
│   │   ├── lib/
│   │   │   └── supabase.js       → [[Supabase Setup]]
│   │   ├── App.jsx               → Router + auth guard
│   │   ├── main.jsx              → Entry point
│   │   └── index.css             → Tailwind + thema
│   ├── package.json
│   └── vite.config.js
├── Documentatie/
│   ├── technischeplanTAS.md
│   └── projectplanTAS.md
└── SETUP.md
```

## Ontbrekende bestanden (gepland maar niet aangemaakt)

- `src/lib/exportPdf.js` — zie [[Data Export]]
- `src/lib/exportExcel.js` — zie [[Data Export]]
- `src/hooks/useMaintenance.js` — zie [[Onderhoudstracker]]
- `src/store/appStore.js` — Zustand store (niet nodig gebleken)
