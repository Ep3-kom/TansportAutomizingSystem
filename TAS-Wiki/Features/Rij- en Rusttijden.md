# Rij- en Rusttijden

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Ritplanning]] · [[Chauffeursbeheer]] · [[Dashboard]]

---

## Status: ✅ Geïmplementeerd

## Beschrijving

Automatische controle van EU rij- en rusttijden (Verordening (EG) 561/2006) bij het inplannen van chauffeurs. Waarschuwingen en blokkeringen bij overtredingen.

## EU 561/2006 Regels

| Regel | Limiet |
|-------|--------|
| Max rijtijd per dag | **9 uur** (2x per week 10 uur) |
| Max rijtijd per week | **56 uur** |
| Max rijtijd per 2 weken | **90 uur** |
| Min dagelijkse rust | **11 uur** (3x per week 9 uur verkort) |
| Min wekelijkse rust | **45 uur** |

## Hoe het werkt

### Bij inplannen ([[Ritplanning]])
Wanneer een planner een chauffeur inplant, berekent het systeem automatisch:
- Totale rijtijd voor die dag (bestaande + nieuwe rit)
- Wekelijkse en 2-wekelijkse totalen
- Rusttijd sinds de laatste shift

**Resultaat:**
- **Groen** → Alles in orde
- **Oranje waarschuwing** → Boven 80% van een limiet
- **Rood blokkade** → Overtreding, inplannen geblokkeerd

### Op het [[Dashboard]]
Widget "Rij- & Rusttijden" toont per chauffeur:
- Dagelijkse, wekelijkse en 2-wekelijkse voortgangsbalken
- Status: in orde / waarschuwing / overtreding

## Bestanden

| Bestand | Doel |
|---------|------|
| `src/hooks/useDrivingHours.js` | Berekeningen + limiet checks |
| `src/components/planning/DrivingHoursWarning.jsx` | Waarschuwing in ScheduleForm |
| `src/components/drivers/DrivingHoursCard.jsx` | Dashboard widget |

## Hook: `useDrivingHours`

```
useDrivingHours()
  ├── checkViolations(driverId, date, startTime, endTime)
  │     → { violations: [...], warnings: [...] }
  ├── getDriverSummary(driverId)
  │     → { dailyHours, weeklyHours, biweeklyHours, status }
  ├── getDailyHours(driverId, date)
  ├── getWeeklyHours(driverId, weekStart?)
  ├── getBiweeklyHours(driverId)
  └── LIMITS (alle constanten)
```

## Beperkingen

- Berekening is gebaseerd op geplande tijden, niet op werkelijke rijtijd
- Pauzes binnen een shift worden niet apart bijgehouden (4,5u aaneengesloten regel)
- Wekelijkse rust (45u) wordt nog niet actief gecheckt
