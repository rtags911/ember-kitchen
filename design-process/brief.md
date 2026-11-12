# Ember Kitchen — brief

- **Client:** EMBER KITCHEN (fictional neighbourhood café; all menu items, prices, hours and contact details are sample values for confirmation).
- **What it is:** a small all-day café — wood-fired breakfast, sandwiches, pastries, coffee — with online **pickup** ordering.
- **Tagline (draft):** "Fired up since 7 a.m."
- **Personality:** warm, honest, a bit of smoke and char; neighbourly, not hip-for-hip's-sake.
- **Audience:** locals on the way to work (fast order-ahead), weekend brunch crowd, office lunch runs.
- **Primary action:** Order for pickup. Secondary: see the menu, find hours/address.
- **Pages:** Home (`/`), Order (`/order`: cart, pickup-time picker, contact fields), Admin (`/admin`: order board new → preparing → ready; no auth, demo only).
- **Ordering rules:** pickup only, no delivery, no payments (pay at the counter). Pickup slots every 15 min inside opening hours, starting ≥ 20 min from now, last slot 30 min before close.
- **Data:** menu, prices, hours in `src/content/site.ts`; totals, slots, zod order schema in `src/lib/cart.ts`; orders kept in memory by `/api/orders` (shortcut, resets on restart).
- **Motion:** GSAP + ScrollTrigger section entrances, one signature move (ember glow / "fire-up" on the hero headline), press feedback on every control, all off under reduced motion.
- **Must not:** fake reviews, ratings, "best café" awards, press logos, delivery partners, or stock counters.
- **Port:** 3280.
