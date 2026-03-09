# Klantenbeheer

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Ritplanning]] · [[Database Schema]]

---

## Status: ✅ Functioneel

## Beschrijving

CRUD-beheer van klanten (bedrijven) waarvoor ritten worden uitgevoerd.

## Velden

| Veld | Type | Verplicht |
|------|------|-----------|
| Bedrijfsnaam | text | ✅ |
| Contactpersoon | text | ❌ |
| E-mail | email | ❌ |
| Telefoon | text | ❌ |
| Adres | text | ❌ |
| Opmerkingen | textarea | ❌ |

## Functionaliteit

- ✅ Toevoegen via modal formulier
- ✅ Bewerken via modal
- ✅ Verwijderen met bevestigingsdialoog
- ✅ Zoeken/filteren over meerdere velden

## Hook: `useClients.js`

Levert: `{ clients, loading, addClient, updateClient, deleteClient, refetch }`

## Database Tabel

Zie [[Database Schema]] → `clients`

## Relaties

- Klanten worden optioneel gekoppeld aan [[Ritplanning|schedules]]
