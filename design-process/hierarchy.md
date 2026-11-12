# Page hierarchy — Ember Kitchen

Order = what a hungry visitor needs first: what is it, what can I get, how do I get it, when/where.

```
Home (/)
├─ Nav — wordmark · Menu · How it works · Visit · [Order pickup] (cart count badge)
├─ Hero — name, one promise ("Order ahead, pick up hot"), today's hours line, [Order pickup]
├─ Menu — category tabs (Breakfast · Sandwiches · Bakery · Coffee & drinks); item, short line, price, [Add]
├─ How ordering works — 3 steps: pick food → choose a pickup time → collect at the counter & pay
├─ Hours / Visit — weekly hours table (today highlighted), address, phone, map link
├─ FAQ — pickup window, paying, allergies, changing an order, large orders
└─ Footer — wordmark, hours summary, contact, "fictional café" note, photo credits

/order
├─ Cart — items, qty steppers, remove, subtotal/total
├─ Pickup time — today's open slots (from hours); "closed — order for tomorrow" when none
├─ Contact — name, phone, optional note
└─ Place order → confirmation with order number + pickup time

/admin (demo, no auth)
└─ Order board — three columns New → Preparing → Ready; advance button per card; polls every few seconds
```

What each proves:
- Hero: this is a real café and ordering is the point. Menu: what you can get and what it costs.
- How it works: ordering is low-risk (no payment online). Visit: when and where. FAQ: removes the last doubts.
- /order: the job. /admin: the kitchen sees it.

Cut: About/story, gallery, testimonials, newsletter — no job without real client material.
