# Delivery Dashboard

Onderdeel van: [[Delivery Module Overzicht]]
Bestand: `pages/delivery/DeliveryDashboard.jsx`

---

## Beschrijving

Het hoofddashboard voor bezorgbedrijven. Toont een compleet overzicht van de huidige status.

## Onderdelen

### 1. Welkomstbericht
- Tijdsgebonden groet (Goedemorgen/Goedemiddag/Goedenavond)
- Bedrijfsnaam

### 2. Statistieken (4 kaarten)

| Kaart | Toont | Kleur |
|-------|-------|-------|
| Nieuwe Bestellingen | Aantal orders met status `nieuw` | Blauw |
| Ingepland | Aantal orders met status `ingepland` | Geel |
| Vandaag Bezorgen | Aantal orders gepland voor vandaag | Blauw |
| Bezorgd | Totaal afgeleverde orders | Groen |

### 3. Komende 7 dagen
- Horizontale weekstrip met per dag het aantal geplande bezorgingen
- Vandaag is gehighlight
- Klikbaar naar planning

### 4. Bezorgingen Vandaag
- Genummerde lijst van alle orders voor vandaag
- Per order: klantnaam, adres, postcode, stad, telefoon, status

### 5. Nieuwe Bestellingen
- Laatste 5 nieuwe orders
- Toont klantnaam, ordernummer, postcode, producten
- Link naar volledige bestellingenlijst

## Hooks gebruikt
- `useOrders` — orders, todayOrders, stats
- `useAuth` — profile voor bedrijfsnaam

---

*Aangemaakt: 2026-03-09*
