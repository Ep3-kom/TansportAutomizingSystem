# Logout

Onderdeel van: [[TAS Home]]
Gerelateerd: [[Authenticatie]]

---

## Beschrijving

Uitlogfunctionaliteit waarmee gebruikers hun sessie beeindigen en terugkeren naar het loginscherm.

## Implementatie

De `signOut` functie zit in `useAuth.jsx` en roept `supabase.auth.signOut()` aan. Na uitloggen worden `user` en `profile` op `null` gezet, waarna `App.jsx` automatisch redirect naar `/login`.

## Locaties van de uitlog-knop

| Dashboard | Bestand | Weergave |
|-----------|---------|----------|
| Transport | `components/layout/TopBar.jsx` | LogOut-icoon naast gebruikersnaam (rechtsboven) |
| Delivery | `components/delivery/DeliveryTopBar.jsx` | "Uitloggen" tekst-knop naast gebruikersnaam |

## Technisch

```jsx
// useAuth.jsx
async function signOut() {
  await supabase.auth.signOut()
  setUser(null)
  setProfile(null)
}
```

Na signOut detecteert `App.jsx` dat `user === null` en redirect naar `/login`.

---

*Aangemaakt: 2026-03-09*
