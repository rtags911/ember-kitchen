// Self-check: node --experimental-strip-types src/lib/cart.check.ts
import assert from "node:assert/strict";
import { advanceOrder, cafeClock, formatPrice, nextStatus, orderSchema, pickupDay, placeOrder, priceCart, slotIsOpen } from "./cart.ts";
import type { MenuCategory, WeekHours } from "./types.ts";

const tz = "UTC";
const menu: MenuCategory[] = [
  {
    id: "c",
    name: "C",
    photo: { src: "", alt: "", width: 1, height: 1 },
    items: [
      { id: "a", name: "A", text: "", price: 425 },
      { id: "b", name: "B", text: "", price: 1150 },
    ],
  },
];
// Mon closed, others 07:00–15:00.
const hours: WeekHours = [0, 1, 2, 3, 4, 5, 6].map((d) => (d === 1 ? null : { open: "07:00", close: "15:00" }));

// Totals: server prices, unknown ids and bad quantities dropped.
const p = priceCart(menu, { a: 2, b: 1, ghost: 3, zero: 0 });
assert.equal(p.total, 2000);
assert.equal(p.count, 3);
assert.deepEqual(priceCart(menu, { a: 0, b: 1.5, c: 99 }).lines, []);
assert.equal(formatPrice(2000), "$20.00");
assert.equal(formatPrice(425), "$4.25");

// Clock in a zone.
assert.deepEqual(cafeClock(new Date("2026-11-12T13:05:00Z"), tz), { date: "2026-11-12", weekday: 4, minutes: 785 });

// Thu 08:05 → earliest 08:30 (08:25 rounded up), last 14:30.
const thu = pickupDay(hours, tz, new Date("2026-11-12T08:05:00Z"))!;
assert.equal(thu.offset, 0);
assert.equal(thu.times[0], "08:30");
assert.equal(thu.times.at(-1), "14:30");
// Before opening → first slot is opening time.
assert.equal(pickupDay(hours, tz, new Date("2026-11-12T05:00:00Z"))!.times[0], "07:00");
// After last slot on Sunday → Monday is closed → Tuesday.
const sun = pickupDay(hours, tz, new Date("2026-11-15T14:20:00Z"))!;
assert.equal(sun.offset, 2);
assert.equal(sun.date, "2026-11-17");
assert.equal(sun.times[0], "07:00");
// Always closed → null.
assert.equal(pickupDay([null, null, null, null, null, null, null], tz, new Date()), null);

// Slot validation with grace.
const now = new Date("2026-11-12T08:05:00Z");
assert.ok(slotIsOpen(hours, tz, now, { date: "2026-11-12", time: "08:30" }));
assert.ok(slotIsOpen(hours, tz, new Date("2026-11-12T08:12:00Z"), { date: "2026-11-12", time: "08:30" }), "grace keeps a slot open briefly");
assert.ok(!slotIsOpen(hours, tz, now, { date: "2026-11-12", time: "08:10" }));
assert.ok(!slotIsOpen(hours, tz, now, { date: "2026-11-12", time: "14:45" }));
assert.ok(!slotIsOpen(hours, tz, now, { date: "2026-11-13", time: "08:30" }));

// Schema.
const good = { items: { a: 1 }, pickup: { date: "2026-11-12", time: "08:30" }, name: " Ada ", phone: "(503) 555-0148" };
const parsed = orderSchema.parse(good);
assert.equal(parsed.name, "Ada");
assert.equal(parsed.note, "");
assert.ok(!orderSchema.safeParse({ ...good, items: {} }).success);
assert.ok(!orderSchema.safeParse({ ...good, items: { a: 21 } }).success);
assert.ok(!orderSchema.safeParse({ ...good, name: "  " }).success);
assert.ok(!orderSchema.safeParse({ ...good, phone: "call me" }).success);
assert.ok(!orderSchema.safeParse({ ...good, pickup: { date: "2026-11-12", time: "" } }).success);

// Status flow.
assert.equal(nextStatus("new"), "preparing");
assert.equal(nextStatus("preparing"), "ready");
assert.equal(nextStatus("ready"), null);

// placeOrder / advanceOrder (shared by API and static store).
const ctx = { menu, hours, timeZone: tz, now, id: "x1", number: 101 };
const placed = placeOrder({ ...good, items: { a: 2, ghost: 1 } }, ctx);
assert.ok(placed.ok && placed.value.total === 850 && placed.value.status === "new" && placed.value.lines.length === 1);
assert.deepEqual(placeOrder({ ...good, items: { ghost: 1 } }, ctx), { ok: false, status: 400, error: "Those items aren't on the menu any more." });
const late = placeOrder({ ...good, pickup: { date: "2026-11-12", time: "08:10" } }, ctx);
assert.ok(!late.ok && late.status === 409);
assert.ok(!placeOrder(null, ctx).ok);
const list = placed.ok ? [placed.value] : [];
assert.ok(!advanceOrder(list, "x1", "ready").ok, "can't skip preparing");
assert.ok(advanceOrder(list, "x1", "preparing").ok);
assert.ok(!advanceOrder(list, "x1", "preparing").ok, "can't repeat");
assert.ok(advanceOrder(list, "x1", "ready").ok);
assert.equal(advanceOrder(list, "nope", "ready").ok, false);

console.log("cart self-check passed");
