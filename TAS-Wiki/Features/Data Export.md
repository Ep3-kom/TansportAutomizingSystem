# Data Export

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Ritplanning]] · [[Launch Checklist]]

---

## Status: ❌ Niet geïmplementeerd

## Beschrijving

Exporteer planningen en overzichten als PDF of Excel. Gepland in het technische plan maar nog niet gebouwd.

## Geplande Exports

| Export | Formaat | Beschrijving |
|--------|---------|-------------|
| Weekplanning | PDF | Planning van de week, deelbaar via WhatsApp |
| Weekplanning | Excel | Bewerkbare export voor administratie |
| Voertuigenoverzicht | Excel | Alle trucks met APK-data |
| Chauffeursoverzicht | Excel | Alle chauffeurs met status |

## Technische Aanpak

### PDF Export

```
jsPDF + jspdf-autotable → client-side PDF generatie
```

### Excel Export

```
SheetJS (xlsx) → client-side Excel generatie
```

> Beide libraries staan in het technische plan maar zijn **nog niet geïnstalleerd** als dependencies.

## Benodigde Implementatie

- [ ] `npm install jspdf jspdf-autotable xlsx`
- [ ] `src/lib/exportPdf.js` aanmaken
- [ ] `src/lib/exportExcel.js` aanmaken
- [ ] Export knoppen toevoegen aan [[Ritplanning]] pagina
- [ ] Export knoppen toevoegen aan [[Voertuigbeheer]] pagina
- [ ] Export knoppen toevoegen aan [[Chauffeursbeheer]] pagina
