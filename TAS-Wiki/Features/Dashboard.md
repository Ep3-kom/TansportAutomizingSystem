# Dashboard

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Chauffeursbeheer]] · [[Voertuigbeheer]] · [[Ritplanning]]

---

## Status: ✅ Functioneel

## Beschrijving

De hoofdpagina na inloggen. Geeft een real-time overzicht van het bedrijf.

## Componenten

| Widget | Data | Bron |
|--------|------|------|
| Actieve chauffeurs | Totaal + status verdeling (verlof/ziek) | `drivers` tabel |
| Beschikbare trucks | Totaal + onderhoud status | `trucks` tabel |
| Ritten vandaag | Aantal geplande ritten voor vandaag | `schedules` tabel |
| APK Waarschuwingen | Trucks met APK vervaldatum < 60 dagen | `trucks.apk_expiry` |

## Features

- Contextafhankelijke begroeting (Goedemorgen / Goedemiddag / Goedenavond)
- StatCard componenten met iconen
- APK warnings met kleurcodering

## Afhankelijkheden

- [[Chauffeursbeheer|useDrivers hook]]
- [[Voertuigbeheer|useTrucks hook]]
- [[Ritplanning|useSchedules hook]]

## Verbeterpunten

- Hardcoded "Admin" en "TAS Demo" moet vervangen worden door echte data → zie [[Launch Checklist]]
- Geen loading skeleton states
- Geen empty states bij lege data
