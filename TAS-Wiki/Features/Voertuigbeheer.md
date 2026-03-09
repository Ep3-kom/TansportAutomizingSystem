# Voertuigbeheer

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Dashboard]] · [[Onderhoudstracker]] · [[Database Schema]]

---

## Status: ✅ Functioneel

## Beschrijving

Volledig CRUD-beheer van voertuigen (trucks) met RDW API integratie.

## Velden

| Veld | Type | Verplicht |
|------|------|-----------|
| Kenteken | text | ✅ |
| Merk & model | text | ❌ (auto-fill via RDW) |
| Gewicht | integer | ❌ (auto-fill via RDW) |
| Kilometerstand | integer | ❌ |
| APK vervaldatum | date | ❌ (auto-fill via RDW) |
| Status | select (beschikbaar/onderhoud/defect) | ✅ |

## RDW API Integratie

Bij het invoeren van een kenteken wordt automatisch voertuigdata opgehaald van de RDW (Rijksdienst voor het Wegverkeer) openbare API.

- Kenteken wordt genormaliseerd (spaties/streepjes verwijderd, uppercase)
- Merk, model, gewicht en APK-datum worden automatisch ingevuld
- Status feedback: laden / gevonden / niet gevonden / fout

## APK Tracking

- Kleurcodering in de lijst:
  - **Rood:** APK verlopen of < 30 dagen
  - **Oranje:** APK < 60 dagen
  - **Groen:** APK > 60 dagen
- APK waarschuwingen verschijnen ook op [[Dashboard]]

## Hook: `useTrucks.js`

Levert: `{ trucks, loading, addTruck, updateTruck, deleteTruck, refetch }`

## Database Tabel

Zie [[Database Schema]] → `trucks`
