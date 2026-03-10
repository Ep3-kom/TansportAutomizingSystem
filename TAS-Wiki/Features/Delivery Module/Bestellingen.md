# Bestellingen

Onderdeel van: [[Delivery Module Overzicht]]
Bestand: `pages/delivery/Orders.jsx`

---

## Beschrijving

Volledige orderlijst met zoeken, filteren, toevoegen en statusbeheer.

## Features

### Zoeken
- Zoek op klantnaam, postcode, stad, ordernummer of adres
- Real-time filtering

### Status filters
Tabs bovenaan de lijst:
- **Alle** — alle orders
- **Nieuw** — net binnengekomen, nog niet ingepland
- **Ingepland** — op een datum gezet
- **Onderweg** — momenteel bezorgd
- **Bezorgd** — afgeleverd
- **Geannuleerd** — geannuleerd

### Order toevoegen (handmatig)
Modal met velden:
- Klantnaam (verplicht)
- Telefoon, email
- Adres, postcode, stad (verplicht)
- Producten (komma-gescheiden)
- Notities

### Status wijzigen
- Hover over de status-badge → dropdown met andere statussen
- Directe update in de database

### Detail modal
- Volledige orderinformatie
- Klikbare telefoon- en emaillinks
- Productlijst
- Notities en geplande datum

### Verwijderen
- Bevestigingsdialoog voor verwijderen

## Order statusflow

```
Nieuw → Ingepland → Onderweg → Bezorgd
  ↓
Geannuleerd
```

## Hooks gebruikt
- `useOrders` — CRUD, filtering, status updates

---

*Aangemaakt: 2026-03-09*
