# Chauffeursbeheer

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Dashboard]] · [[Ritplanning]] · [[Database Schema]]

---

## Status: ✅ Functioneel

## Beschrijving

Volledig CRUD-beheer van chauffeurs binnen een bedrijf.

## Velden

| Veld | Type | Verplicht |
|------|------|-----------|
| Naam | text | ✅ |
| Telefoon | text | ❌ |
| Rijbewijs type | select (C/CE/C1/C1E) | ✅ |
| Status | select (actief/verlof/ziek) | ✅ |
| Opmerkingen | textarea | ❌ |

## Functionaliteit

- ✅ Toevoegen via modal formulier (DriverForm)
- ✅ Bewerken via modal
- ✅ Verwijderen met bevestigingsdialoog
- ✅ Zoeken/filteren op naam of telefoon
- ✅ Status management

## Hook: `useDrivers.js`

Levert: `{ drivers, loading, addDriver, updateDriver, deleteDriver, refetch }`

Filtert automatisch op `company_id` van de ingelogde gebruiker via [[Authenticatie|useAuth]].

## Database Tabel

Zie [[Database Schema]] → `drivers`

## Relaties

- Chauffeurs worden gekoppeld aan [[Ritplanning|schedules]]
- Status wordt getoond op [[Dashboard]]
- Alleen chauffeurs met status "actief" kunnen ingepland worden
