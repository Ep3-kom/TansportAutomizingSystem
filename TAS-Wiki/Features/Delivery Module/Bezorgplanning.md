# Bezorgplanning

Onderdeel van: [[Delivery Module Overzicht]]
Bestand: `pages/delivery/DeliveryPlanning.jsx`

---

## Beschrijving

Drag & drop kalender om bestellingen op dagen in te plannen, met week- en dagweergave.

## Features

### Weekweergave
- 7 kolommen (ma-zo) met datum headers
- Orders worden als kaartjes weergegeven per dag
- Vandaag is gehighlight met blauwe border
- Weekendkolommen hebben lichtgrijze achtergrond
- Navigatie: vorige/volgende week + "Vandaag" knop

### Dagweergave
- Uitgebreide lijst van alle orders op geselecteerde dag
- Per order: volgnummer, klantnaam, ordernummer, adres, telefoon, producten
- "Bezorgd" knop per order (directe statusupdate)
- "Verwijder" knop om order uit planning te halen (terug naar status `nieuw`)
- Navigatie: vorige/volgende dag

### Drag & Drop
- **Ongeplande orders** staan in een sidebar links
- Sleep een order naar een dag om te plannen (status wordt `ingepland`)
- Sleep een order tussen dagen om te verplaatsen
- Sleep een geplande order terug naar "Ongepland" om te de-plannen

### Google Maps integratie
- "Route" knop per dag in weekweergave
- "Open route in Google Maps" knop in dagweergave
- Opent Google Maps met alle stops als waypoints in volgorde

## Hooks gebruikt
- `useOrders` — planOrder, unplanOrder, updateOrderStatus
- `useDeliveryRoutes` — getGoogleMapsUrl

---

*Aangemaakt: 2026-03-09*
