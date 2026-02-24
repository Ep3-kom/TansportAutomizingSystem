# TransportPlan — Technische Architectuur & Development Guide

## 1. Overzicht

TransportPlan is een SaaS-planningsdashboard voor kleine tot middelgrote transportbedrijven (5–25 vrachtwagens). Dit document beschrijft de volledige technische architectuur, tech stack, database-opzet en development-richtlijnen voor het bouwen van de MVP.

**Kernprincipes van de MVP:**
- Simpel en snel — geen overengineering
- Multi-tenant vanaf dag 1
- Geen externe API-koppelingen in de MVP
- Client-side export (PDF/Excel) zonder server-side rendering
- Mobile-responsive voor tablet-gebruik door planners

---

## 2. Tech Stack

### Frontend
| Technologie | Versie | Doel |
|-------------|--------|------|
| React | 18+ | UI framework |
| Vite | 5+ | Build tool & dev server |
| Tailwind CSS | 3.4+ | Styling |
| React Router | 6+ | Client-side routing |
| Zustand | 4+ | Lichtgewicht state management |
| React Hook Form | 7+ | Formuliervalidatie |
| date-fns | 3+ | Datummanipulatie (NL locale) |

### Backend & Database
| Technologie | Doel |
|-------------|------|
| Supabase | PostgreSQL database + Auth + Realtime + Storage |
| Supabase Auth | Login/registratie met e-mail of magic link |
| Row Level Security (RLS) | Data-isolatie per bedrijf (multi-tenant) |

### Export & Utilities
| Technologie | Doel |
|-------------|------|
| jsPDF + html2canvas | PDF-export van planningen |
| SheetJS (xlsx) | Excel-export van planningen en overzichten |
| Lucide React | Iconen (lichtgewicht, consistent) |

### Hosting & DevOps
| Technologie | Doel |
|-------------|------|
| Vercel | Frontend hosting + CI/CD |
| Supabase Cloud | Database hosting (gratis tier voor MVP) |
| GitHub | Versiebeheer |
| Stripe | Betalingen (Fase 5) |

---

## 3. Projectstructuur

```
transportplan/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── AppShell.jsx
│   │   ├── ui/
│   │   │   ├── Modal.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── InputField.jsx
│   │   │   ├── DataTable.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── drivers/
│   │   │   ├── DriverList.jsx
│   │   │   ├── DriverForm.jsx
│   │   │   └── DriverCard.jsx
│   │   ├── trucks/
│   │   │   ├── TruckList.jsx
│   │   │   ├── TruckForm.jsx
│   │   │   └── TruckCard.jsx
│   │   ├── planning/
│   │   │   ├── WeekView.jsx
│   │   │   ├── DayColumn.jsx
│   │   │   ├── TripCard.jsx
│   │   │   └── TripForm.jsx
│   │   ├── maintenance/
│   │   │   ├── MaintenanceList.jsx
│   │   │   └── MaintenanceForm.jsx
│   │   └── clients/
│   │       ├── ClientList.jsx
│   │       └── ClientForm.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Planning.jsx
│   │   ├── Drivers.jsx
│   │   ├── Trucks.jsx
│   │   ├── Maintenance.jsx
│   │   ├── Clients.jsx
│   │   ├── Settings.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── lib/
│   │   ├── supabase.js          # Supabase client init
│   │   ├── auth.js              # Auth helpers
│   │   ├── exportPdf.js         # PDF export logica
│   │   └── exportExcel.js       # Excel export logica
│   ├── hooks/
│   │   ├── useAuth.js           # Auth state hook
│   │   ├── useDrivers.js        # CRUD hook chauffeurs
│   │   ├── useTrucks.js         # CRUD hook voertuigen
│   │   ├── useTrips.js          # CRUD hook ritten
│   │   ├── useMaintenance.js    # CRUD hook onderhoud
│   │   └── useClients.js        # CRUD hook klanten
│   ├── store/
│   │   └── appStore.js          # Zustand global state
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.local                    # Supabase keys (NIET committen)
├── .gitignore
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 4. Database Schema

### ERD Overzicht

```
companies ──< drivers
companies ──< trucks ──< maintenance
companies ──< clients
companies ──< trips >── drivers
                trips >── trucks
                trips >── clients
```

### Tabel: `companies`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| name | text | Bedrijfsnaam |
| kvk_number | text | KvK-nummer |
| email | text | Hoofde-mail |
| phone | text | Telefoonnummer |
| plan | text | 'starter' / 'groei' / 'pro' |
| stripe_customer_id | text | Stripe klant-ID (later) |
| created_at | timestamptz | Aangemaakt op |

### Tabel: `profiles`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK, FK → auth.users) | Gekoppeld aan Supabase Auth |
| company_id | uuid (FK → companies) | Bedrijf van de gebruiker |
| full_name | text | Volledige naam |
| role | text | 'admin' / 'planner' / 'viewer' |
| created_at | timestamptz | Aangemaakt op |

### Tabel: `drivers`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| company_id | uuid (FK → companies) | Bedrijf |
| name | text | Volledige naam |
| phone | text | Telefoonnummer |
| license_type | text | 'C' / 'CE' / 'C1' / 'C1E' |
| status | text | 'actief' / 'verlof' / 'ziek' |
| notes | text | Opmerkingen |
| created_at | timestamptz | Aangemaakt op |

### Tabel: `trucks`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| company_id | uuid (FK → companies) | Bedrijf |
| license_plate | text | Kenteken |
| brand_model | text | Merk en type |
| apk_expiry | date | APK vervaldatum |
| status | text | 'beschikbaar' / 'onderhoud' / 'defect' |
| mileage | integer | Kilometerstand |
| notes | text | Opmerkingen |
| created_at | timestamptz | Aangemaakt op |

### Tabel: `trips`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| company_id | uuid (FK → companies) | Bedrijf |
| driver_id | uuid (FK → drivers) | Chauffeur |
| truck_id | uuid (FK → trucks) | Voertuig |
| client_id | uuid (FK → clients) | Klant (optioneel) |
| date | date | Ritdatum |
| departure_time | time | Vertrektijd |
| origin | text | Vertreklocatie |
| destination | text | Bestemmingslocatie |
| status | text | 'gepland' / 'onderweg' / 'afgerond' / 'geannuleerd' |
| notes | text | Opmerkingen |
| created_at | timestamptz | Aangemaakt op |

### Tabel: `maintenance`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| company_id | uuid (FK → companies) | Bedrijf |
| truck_id | uuid (FK → trucks) | Voertuig |
| type | text | 'apk' / 'onderhoud' / 'reparatie' / 'banden' |
| scheduled_date | date | Geplande datum |
| completed_date | date | Afgeronde datum (nullable) |
| status | text | 'gepland' / 'bezig' / 'afgerond' |
| cost | decimal | Kosten (nullable) |
| notes | text | Opmerkingen |
| created_at | timestamptz | Aangemaakt op |

### Tabel: `clients`

| Kolom | Type | Beschrijving |
|-------|------|-------------|
| id | uuid (PK) | Unieke ID |
| company_id | uuid (FK → companies) | Bedrijf |
| name | text | Bedrijfsnaam klant |
| contact_person | text | Contactpersoon |
| email | text | E-mailadres |
| phone | text | Telefoonnummer |
| address | text | Adres |
| notes | text | Opmerkingen |
| created_at | timestamptz | Aangemaakt op |

### SQL Migratie

```sql
-- Companies
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  kvk_number text,
  email text,
  phone text,
  plan text DEFAULT 'starter',
  stripe_customer_id text,
  created_at timestamptz DEFAULT now()
);

-- Profiles (gekoppeld aan Supabase Auth)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  full_name text,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Drivers
CREATE TABLE drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  phone text,
  license_type text DEFAULT 'CE',
  status text DEFAULT 'actief',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Trucks
CREATE TABLE trucks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  license_plate text NOT NULL,
  brand_model text,
  apk_expiry date,
  status text DEFAULT 'beschikbaar',
  mileage integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Clients
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  contact_person text,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Trips
CREATE TABLE trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
  truck_id uuid REFERENCES trucks(id) ON DELETE SET NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  date date NOT NULL,
  departure_time time,
  origin text NOT NULL,
  destination text NOT NULL,
  status text DEFAULT 'gepland',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Maintenance
CREATE TABLE maintenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  truck_id uuid REFERENCES trucks(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  scheduled_date date NOT NULL,
  completed_date date,
  status text DEFAULT 'gepland',
  cost decimal,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Indexen voor performance
CREATE INDEX idx_drivers_company ON drivers(company_id);
CREATE INDEX idx_trucks_company ON trucks(company_id);
CREATE INDEX idx_trips_company ON trips(company_id);
CREATE INDEX idx_trips_date ON trips(company_id, date);
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_maintenance_truck ON maintenance(truck_id);
CREATE INDEX idx_clients_company ON clients(company_id);
```

### Row Level Security (RLS)

```sql
-- Activeer RLS op alle tabellen
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Helper functie: haal company_id op van ingelogde user
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS uuid AS $$
  SELECT company_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Voorbeeld policy voor drivers (herhaal voor alle tabellen)
CREATE POLICY "Users can view own company drivers"
  ON drivers FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert own company drivers"
  ON drivers FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update own company drivers"
  ON drivers FOR UPDATE
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete own company drivers"
  ON drivers FOR DELETE
  USING (company_id = get_user_company_id());

-- Herhaal bovenstaande 4 policies voor: trucks, trips, maintenance, clients
```

---

## 5. Authenticatie Flow

### Registratie (nieuw bedrijf)

```
1. Gebruiker vult in: bedrijfsnaam, naam, e-mail, wachtwoord
2. Frontend roept Supabase Auth signup aan
3. Database trigger maakt automatisch:
   a. Nieuw record in `companies`
   b. Nieuw record in `profiles` (role = 'admin', gekoppeld aan company)
4. Gebruiker wordt doorgestuurd naar dashboard
```

### Supabase Trigger

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_company_id uuid;
BEGIN
  -- Maak een nieuw bedrijf aan
  INSERT INTO companies (name, email)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Mijn Bedrijf'),
    NEW.email
  )
  RETURNING id INTO new_company_id;

  -- Maak een profiel aan
  INSERT INTO profiles (id, company_id, full_name, role)
  VALUES (
    NEW.id,
    new_company_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'admin'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Login

```
1. Gebruiker vult e-mail + wachtwoord in
2. Supabase Auth valideert
3. JWT token bevat user ID
4. RLS policies gebruiken auth.uid() om data te filteren
5. Gebruiker ziet alleen data van eigen bedrijf
```

---

## 6. Frontend Architectuur

### Supabase Client Setup

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### Custom Hook Voorbeeld (Chauffeurs)

```javascript
// src/hooks/useDrivers.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useDrivers() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchDrivers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('name')
    if (!error) setDrivers(data)
    setLoading(false)
  }

  async function addDriver(driver) {
    const { data, error } = await supabase
      .from('drivers')
      .insert([driver])
      .select()
      .single()
    if (!error) setDrivers(prev => [...prev, data])
    return { data, error }
  }

  async function updateDriver(id, updates) {
    const { data, error } = await supabase
      .from('drivers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error) setDrivers(prev => prev.map(d => d.id === id ? data : d))
    return { data, error }
  }

  async function deleteDriver(id) {
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', id)
    if (!error) setDrivers(prev => prev.filter(d => d.id !== id))
    return { error }
  }

  useEffect(() => { fetchDrivers() }, [])

  return { drivers, loading, addDriver, updateDriver, deleteDriver, refetch: fetchDrivers }
}
```

### PDF Export

```javascript
// src/lib/exportPdf.js
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export function exportWeekPlanningPdf(trips, drivers, trucks, weekDates) {
  const doc = new jsPDF('landscape')

  doc.setFontSize(18)
  doc.text('Weekplanning', 14, 20)
  doc.setFontSize(10)
  doc.text(`Week van ${weekDates[0]} t/m ${weekDates[6]}`, 14, 28)

  const headers = ['Dag', 'Tijd', 'Chauffeur', 'Voertuig', 'Van', 'Naar', 'Klant', 'Status']
  const rows = trips.map(trip => [
    new Date(trip.date).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric' }),
    trip.departure_time || '-',
    drivers.find(d => d.id === trip.driver_id)?.name || '-',
    trucks.find(t => t.id === trip.truck_id)?.license_plate || '-',
    trip.origin,
    trip.destination,
    trip.client_name || '-',
    trip.status
  ])

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 35,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] }
  })

  doc.save(`weekplanning-${weekDates[0]}.pdf`)
}
```

### Excel Export

```javascript
// src/lib/exportExcel.js
import * as XLSX from 'xlsx'

export function exportWeekPlanningExcel(trips, drivers, trucks, weekDates) {
  const data = trips.map(trip => ({
    Dag: new Date(trip.date).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' }),
    Tijd: trip.departure_time || '-',
    Chauffeur: drivers.find(d => d.id === trip.driver_id)?.name || '-',
    Voertuig: trucks.find(t => t.id === trip.truck_id)?.license_plate || '-',
    Van: trip.origin,
    Naar: trip.destination,
    Klant: trip.client_name || '-',
    Status: trip.status
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)

  // Kolombreedte instellen
  ws['!cols'] = [
    { wch: 25 }, { wch: 8 }, { wch: 20 },
    { wch: 15 }, { wch: 15 }, { wch: 15 },
    { wch: 20 }, { wch: 12 }
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Weekplanning')
  XLSX.writeFile(wb, `weekplanning-${weekDates[0]}.xlsx`)
}
```

---

## 7. Environment Variabelen

```env
# .env.local (NOOIT committen naar Git)
VITE_SUPABASE_URL=https://jouw-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... (later)
```

---

## 8. Deployment

### Vercel Setup

```bash
# Installeer Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Vercel instellingen:**
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: voeg VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY toe in Vercel dashboard

### Custom Domein

Koppel `app.transportplan.nl` aan je Vercel project via de Vercel dashboard. Zet DNS CNAME naar `cname.vercel-dns.com`.

---

## 9. Performance & Security Checklist

- [ ] RLS ingeschakeld op alle tabellen
- [ ] Supabase anon key is ALLEEN de public key (nooit service role key in frontend)
- [ ] .env.local staat in .gitignore
- [ ] Alle user input wordt gevalideerd (client + database constraints)
- [ ] Indexen op veelgebruikte query-kolommen (company_id, date)
- [ ] Lazy loading van pagina's via React.lazy()
- [ ] Afbeeldingen geoptimaliseerd (als van toepassing)
- [ ] HTTPS via Vercel (automatisch)
- [ ] Rate limiting via Supabase (standaard ingeschakeld)

---

## 10. Packages Installatie

```bash
# Project aanmaken
npm create vite@latest transportplan -- --template react
cd transportplan

# Core dependencies
npm install @supabase/supabase-js zustand react-router-dom react-hook-form

# UI
npm install tailwindcss @tailwindcss/forms postcss autoprefixer lucide-react
npx tailwindcss init -p

# Export
npm install jspdf jspdf-autotable xlsx

# Date handling
npm install date-fns

# Dev tools
npm install -D eslint prettier
```

---

*Dit document is de technische basis voor het TransportPlan MVP. Alle keuzes zijn gemaakt met het oog op snelheid van development, schaalbaarheid naar meer klanten, en lage operationele kosten.*
