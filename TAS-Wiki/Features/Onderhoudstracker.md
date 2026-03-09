# Onderhoudstracker

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Voertuigbeheer]] · [[Database Schema]] · [[Launch Checklist]]

---

## Status: ⚠️ Placeholder — Moet gebouwd worden

## Huidige Staat

De pagina bestaat maar toont alleen een placeholder met een Wrench-icoon. De database tabel `maintenance` is aangemaakt maar er is geen UI of hook voor.

## Geplande Functionaliteit

- Onderhoudsrecords per voertuig
- Types: APK / onderhoud / reparatie / banden
- Status tracking: gepland → bezig → afgerond
- Kosten bijhouden
- Geplande datum + voltooiingsdatum
- Koppeling met [[Voertuigbeheer|trucks]] tabel

## Benodigde Implementatie

- [ ] `useMaintenance.js` hook schrijven (CRUD)
- [ ] `MaintenanceForm.jsx` component bouwen
- [ ] `MaintenanceList.jsx` component bouwen
- [ ] Pagina `Maintenance.jsx` invullen
- [ ] Filter per voertuig
- [ ] Kostenoverzicht / totalen

## Database Tabel

Zie [[Database Schema]] → `maintenance`

## Prioriteit

**P1** op de [[Launch Checklist]] — Transport = onderhoud. Dit is een kernfeature die klanten verwachten.
