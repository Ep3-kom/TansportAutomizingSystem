# TAS Launch Checklist

> Alle taken die af moeten voordat we €200/maand kunnen vragen.

---

## P0 — Showstoppers (zonder dit NIET lanceren)

- [x] **Supabase RLS (Row Level Security) activeren & testen** — ✅ Actief op alle 11 tabellen (10 maart 2025). Zie [[Row Level Security]].
- [ ] **Stripe betalingsintegratie** — Geen betaling = geen SaaS. Subscription, checkout, webhook voor plan-status.
- [ ] **Settings pagina afmaken** — Bedrijfsgegevens wijzigen, wachtwoord veranderen. Basisverwachting van elke gebruiker.
- [ ] **Gebruikersbeheer / uitnodigingen** — Een transportbedrijf heeft meerdere planners. Zonder user management is het single-user.
- [ ] **Rollen & permissies (RBAC) implementeren** — Schema ondersteunt admin/planner/viewer maar de UI dwingt het niet af.
- [ ] **Error handling & gebruiker-feedback verbeteren** — Nu worden fouten stil geslikt. Klant ziet niks als iets misgaat.
- [ ] **Hardcoded "Admin" / "TAS Demo" in TopBar vervangen** — Moet echte user- en bedrijfsnaam tonen.

---

## P1 — Verwacht bij €200/maand

- [ ] **Onderhoudstracker afmaken** — Pagina bestaat als placeholder. Transport = onderhoud. Kernfeature.
- [ ] **Email notificaties** — APK-herinneringen, planning updates. Via Supabase Edge Functions of Resend/SendGrid.
- [ ] **Zoekfunctie in TopBar werkend maken** — Zoekbalk staat er maar doet niks. Werkend maken of verwijderen.
- [ ] **Notificatie-systeem** — Bell icon met nep-dot. Werkend maken of verwijderen.
- [ ] **Algemene Voorwaarden + Privacyverklaring** — Wettelijk verplicht (AVG/GDPR). Zonder dit geen klantdata verwerken.
- [ ] **Verwerkersovereenkomst (DPA)** — Verplicht in NL bij verwerking persoonsgegevens van chauffeurs.
- [ ] **Data export (PDF/Excel)** — Klant moet eigen data kunnen exporteren.
- [ ] **Loading states & empty states** — Skeleton loaders, lege-state illustraties voor professionele UX.

---

## P2 — Belangrijk voor retentie & professionaliteit

- [ ] **Basis tests schrijven (Vitest)** — Geen tests = elke deploy is een gok. Minimaal auth flow + CRUD.
- [ ] **Error monitoring (Sentry)** — Weten wanneer klanten errors tegenkomen voordat ze klagen.
- [ ] **Onboarding flow voor nieuwe klanten** — Eerste indruk telt. Walkthrough of setup wizard.
- [ ] **Responsive design check** — Planners gebruiken soms tablets/telefoons. Planning view mobiel bruikbaar maken.
- [ ] **Performance: lazy loading routes** — React.lazy() voorkomt trage initial loads naarmate de app groeit.
- [ ] **Facturatie-overzicht in app** — Klant wil facturen kunnen inzien (Stripe Customer Portal).
- [ ] **Backup & disaster recovery plan documenteren** — Supabase doet backups, maar herstelproces moet bekend zijn.
