# Ritplanning

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Chauffeursbeheer]] · [[Klantenbeheer]] · [[Dashboard]]

---

## Status: ✅ Functioneel

## Beschrijving

Weekoverzicht-kalender met drag-and-drop functionaliteit voor het plannen van chauffeurs.

## Features

- ✅ Weekweergave met 7 dagkolommen
- ✅ Drag & drop chauffeurs vanuit sidebar naar dagen
- ✅ Drag & drop bestaande schedules tussen dagen
- ✅ Delete zone om schedules te verwijderen
- ✅ Navigatie: vorige week / vandaag / volgende week
- ✅ Schedule formulier: chauffeur, klant (optioneel), start/eindtijd, notities
- ✅ Alleen actieve chauffeurs kunnen ingepland worden

## Velden per Schedule

| Veld | Type | Verplicht |
|------|------|-----------|
| Chauffeur | select (FK → drivers) | ✅ |
| Klant | select (FK → clients) | ❌ |
| Datum | date | ✅ |
| Starttijd | time | ❌ |
| Eindtijd | time | ❌ |
| Notities | textarea | ❌ |

## Hook: `useSchedules.js`

Levert: `{ schedules, loading, addSchedule, updateSchedule, deleteSchedule, refetch }`

## Database Tabel

Zie [[Database Schema]] → `schedules`

## Ontbrekend (gepland)

- [ ] Truck koppelen aan schedule (veld bestaat in schema maar niet in UI)
- [ ] Conflictdetectie (chauffeur dubbel ingepland)
- [ ] Ritstatus tracking (gepland → onderweg → afgerond)
- [ ] Herhalende ritten
- [ ] [[Data Export|PDF/Excel export]] van weekplanning
