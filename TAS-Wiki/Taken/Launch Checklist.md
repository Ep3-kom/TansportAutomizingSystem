# Launch Checklist

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Roadmap Overzicht]] · [[Security Checklist]] · [[Juridisch — AVG & Voorwaarden]]

---

> Alle taken die af moeten voordat we €200/maand kunnen vragen.

---

## P0 — Showstoppers (zonder dit NIET lanceren)

- [ ] **[[Row Level Security]] activeren & testen** — Zonder RLS kan een klant data van andere bedrijven zien. Kritiek beveiligingslek.
- [ ] **[[Prijsmodel|Stripe betalingsintegratie]]** — Geen betaling = geen SaaS. Subscription, checkout, webhook voor plan-status.
- [ ] **[[Settings Pagina]] afmaken** — Bedrijfsgegevens wijzigen, wachtwoord veranderen. Basisverwachting.
- [ ] **Gebruikersbeheer / uitnodigingen** — Een transportbedrijf heeft meerdere planners. Zonder user management is het single-user.
- [ ] **Rollen & permissies (RBAC)** — Schema ondersteunt admin/planner/viewer maar de UI dwingt het niet af.
- [ ] **Error handling & gebruiker-feedback** — Nu worden fouten stil geslikt. Toast notifications / error messages.
- [ ] **Hardcoded "Admin" / "TAS Demo" in TopBar** — Moet echte user- en bedrijfsnaam tonen uit [[Authenticatie|useAuth]].

---

## P1 — Verwacht bij €200/maand

- [ ] **[[Onderhoudstracker]] afmaken** — Placeholder nu. Transport = onderhoud. Kernfeature.
- [ ] **Email notificaties** — APK-herinneringen, planning updates. Via Supabase Edge Functions of Resend/SendGrid.
- [ ] **Zoekfunctie in TopBar werkend maken** — Staat er maar doet niks. Werkend maken of verwijderen.
- [ ] **Notificatie-systeem** — Bell icon met nep-dot. Werkend maken of verwijderen.
- [ ] **[[Juridisch — AVG & Voorwaarden|Algemene Voorwaarden + Privacyverklaring]]** — Wettelijk verplicht (AVG/GDPR).
- [ ] **[[Juridisch — AVG & Voorwaarden|Verwerkersovereenkomst (DPA)]]** — Verplicht in NL bij persoonsgegevens.
- [ ] **[[Data Export]]** — Klant moet eigen data kunnen exporteren (PDF/Excel).
- [ ] **Loading states & empty states** — Skeleton loaders, lege-state illustraties.

---

## P2 — Belangrijk voor retentie

- [ ] **Basis tests (Vitest)** — Geen tests = elke deploy is een gok.
- [ ] **Error monitoring (Sentry)** — Weten wanneer klanten errors tegenkomen.
- [ ] **Onboarding flow** — Walkthrough of setup wizard voor nieuwe klanten.
- [ ] **Responsive design check** — [[Ritplanning]] mobiel bruikbaar maken.
- [ ] **Performance: lazy loading routes** — React.lazy() voor snellere loads.
- [ ] **Facturatie-overzicht** — Stripe Customer Portal integratie.
- [ ] **Backup & disaster recovery plan** — Documenteren hoe te herstellen.

---

## Voortgang

**P0:** 0/7 afgerond
**P1:** 0/8 afgerond
**P2:** 0/7 afgerond
