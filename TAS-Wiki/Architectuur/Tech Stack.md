# Tech Stack

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Projectstructuur]] · [[Supabase Setup]] · [[Deployment]]

---

## Frontend

| Technologie | Versie | Doel |
|-------------|--------|------|
| React | 19.2.0 | UI framework |
| Vite | 7.3.1 | Build tool & dev server |
| Tailwind CSS | 4.2.1 | Styling (custom theme variabelen) |
| React Router | 7.13.1 | Client-side routing |
| Lucide React | 0.575.0 | Iconen |

> **Let op:** Zustand, React Hook Form en date-fns staan in het [[technische plan|Architectuur/Projectstructuur]] maar zijn nog niet geïnstalleerd.

## Backend & Database

| Technologie | Doel |
|-------------|------|
| [[Supabase Setup\|Supabase]] | PostgreSQL + Auth + Realtime |
| [[Row Level Security\|RLS]] | Data-isolatie per bedrijf (multi-tenant) |

## Hosting & DevOps

| Technologie | Doel |
|-------------|------|
| [[Deployment\|Vercel]] | Frontend hosting + CI/CD + HTTPS |
| Supabase Cloud | Database hosting (EU datacenter) |
| GitHub | Versiebeheer |
| Stripe | Betalingen *(nog niet geïmplementeerd — zie [[Launch Checklist]])* |

## State Management

Huidige aanpak: **React Context API** (useAuth) + **useState hooks** per module.
Geen Zustand geïnstalleerd ondanks dat het in het originele plan stond.

---

*Totaal ~2.883 regels JavaScript/JSX code.*
