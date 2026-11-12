# Ember Kitchen (fictional client)

A neighbourhood wood-fired café with online **pickup** ordering. Portfolio demo: no payments, no auth.

Port: **3280**

```bash
npm install
npx next build
npx next start -p 3280
```

- `/` — hero, menu with category tabs and add-to-bag, how ordering works, hours and visit, FAQ
- `/order` — bag, pickup-time picker (slots from opening hours), name/phone/note, confirmation
- `/admin` — kitchen board: New → Preparing → Ready (polls every 4 s). **No auth — demo only.**

## Where things live
- Content (menu, prices, hours, address, FAQ) → `src/content/site.ts`
- Cart totals, pickup slots, zod order schema → `src/lib/cart.ts` (RN-safe, shared by browser and API)
- Self-check → `node --experimental-strip-types src/lib/cart.check.ts`
- API → `src/app/api/orders/route.ts` (GET list, POST create, PATCH next status). Orders are kept **in memory** and vanish on restart; see the `shortcut:` note there for the Mongo upgrade.
- Tokens → `src/app/globals.css` · look → `DESIGN.md` · product truth → `PRODUCT.md` · brief, hierarchy, palette → `design-process/`
- Photos → `public/images/` with `credits.json` (all CC0; credited in the footer)

## Sample values for the client to confirm
Everything below is made up and must be replaced or confirmed:

- **Name / address / contact:** Ember Kitchen, 418 Alder Street, Portland, OR 97205 · (503) 555-0148 · hello@ember-kitchen.example
- **Time zone:** America/Los_Angeles
- **Hours:** Mon closed · Tue–Thu 07:00–15:00 · Fri 07:00–16:00 · Sat 08:00–16:00 · Sun 08:00–14:00
- **Ordering rules:** slots every 15 min, earliest 20 min from now, last slot 30 min before close, max 20 of one item, held 30 min after pickup time
- **Breakfast (until 11:30):** Ember muffin $9.00 · Green eggs $11.50 · Oven oats $8.50 · Fire hash $13.00
- **Sandwiches (from 11:00):** Smoked chicken $14.00 · Blistered veg $12.50 · Brisket melt $15.50 · Oven flatbread $13.50
- **Bakery:** Butter croissant $4.25 · Brown butter cookie $3.75 · Morning bun $4.75 · Sourdough loaf $9.00
- **Coffee & drinks:** Espresso $3.50 · Latte $5.25 · Cold brew $4.75 · Smoked chai $5.50
- **Claims in copy:** "prices include tax", allergen list (wheat, dairy, eggs, nuts, sesame), "baked at 6", cold brew "steeped 18 hours", "call a day ahead for 20+ items"
- **Photos:** open-licence stock, not the café's own (the counter photo shows another café). Replace with the client's photos.

The site is `noindex` because the café is fictional; remove `robots` in `src/app/layout.tsx` for a real launch.

## GitHub Pages (static demo)
Live: https://rtags911.github.io/ember-kitchen/ · deployed by `.github/workflows/pages.yml` on every push to `main`.

```bash
NEXT_PUBLIC_STATIC=1 NEXT_PUBLIC_BASE_PATH=/ember-kitchen npx next build   # → out/
```

Pages has no server, so the static build drops `/api/orders` and keeps orders in the visitor's browser (`src/components/orders-api.ts`), validated by the same `placeOrder` / `advanceOrder` in `src/lib/cart.ts`. The /admin board then shows orders placed in that browser. Run `npx next start -p 3280` for the real API version.
On Git Bash for Windows, prefix the build with `MSYS_NO_PATHCONV=1` so `/ember-kitchen` isn't rewritten to a Windows path.

Portfolio screenshot: `design-process/screenshot-1200x750.png`.
