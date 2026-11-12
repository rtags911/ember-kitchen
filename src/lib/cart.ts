// Cart totals, pickup slots and the order schema. Shared by browser and server, RN-safe (no DOM/Next).
import { z } from "zod";
import type { MenuCategory, MenuItem, WeekHours } from "./types";

export const SLOT_MINUTES = 15;
export const LEAD_MINUTES = 20; // kitchen needs this long from order to pickup
export const LAST_ORDER_GAP = 30; // last slot is this long before close
export const MAX_QTY = 20;

/** id → quantity */
export type Cart = Record<string, number>;

export const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function findItem(menu: MenuCategory[], id: string): MenuItem | undefined {
  for (const c of menu) for (const i of c.items) if (i.id === id) return i;
}

export interface Line {
  id: string;
  name: string;
  price: number;
  qty: number;
}

/** Prices come from the menu, never from the client. Unknown ids and bad quantities are dropped. */
export function priceCart(menu: MenuCategory[], cart: Cart): { lines: Line[]; count: number; total: number } {
  const lines: Line[] = [];
  for (const [id, qty] of Object.entries(cart)) {
    const item = findItem(menu, id);
    if (!item || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) continue;
    lines.push({ id, name: item.name, price: item.price, qty });
  }
  return {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    total: lines.reduce((n, l) => n + l.price * l.qty, 0),
  };
}

const toMin = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
const toClock = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** Date, weekday and minutes-past-midnight of `at` on the café's own clock. */
export function cafeClock(at: Date, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short", hourCycle: "h23" })
      .formatToParts(at)
      .map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

export interface PickupDay {
  /** YYYY-MM-DD on the café's clock. */
  date: string;
  weekday: number;
  /** 0 = today, 1 = tomorrow … */
  offset: number;
  times: string[];
}

/** The first day (today or within a week) that still has pickup slots. */
export function pickupDay(hours: WeekHours, timeZone: string, now: Date): PickupDay | null {
  for (let offset = 0; offset < 7; offset++) {
    // shortcut: steps 24h, so a DST change within an hour of midnight can skip a day; fine for a café, use a date lib if hours go past midnight.
    const day = cafeClock(new Date(now.getTime() + offset * 86_400_000), timeZone);
    const h = hours[day.weekday];
    if (!h) continue;
    const earliest = offset === 0 ? Math.ceil((cafeClock(now, timeZone).minutes + LEAD_MINUTES) / SLOT_MINUTES) * SLOT_MINUTES : 0;
    const times: string[] = [];
    for (let m = Math.max(toMin(h.open), earliest); m <= toMin(h.close) - LAST_ORDER_GAP; m += SLOT_MINUTES) times.push(toClock(m));
    if (times.length) return { date: day.date, weekday: day.weekday, offset, times };
  }
  return null;
}

export const STATUSES = ["new", "preparing", "ready"] as const;
export type Status = (typeof STATUSES)[number];
export const nextStatus = (s: Status): Status | null => STATUSES[STATUSES.indexOf(s) + 1] ?? null;

export const orderSchema = z.object({
  items: z
    .record(z.string().max(40), z.number().int().min(1).max(MAX_QTY))
    .refine((r) => Object.keys(r).length > 0, "Add something to your bag first.")
    .refine((r) => Object.keys(r).length <= 30, "That's a lot of items. Call us for large orders."),
  pickup: z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a pickup time.") }),
  name: z.string().trim().min(1, "Enter your name.").max(60),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s.-]{7,20}$/, "Enter a phone number we can call."),
  note: z.string().trim().max(200, "Keep the note under 200 characters.").default(""),
});
export type OrderInput = z.input<typeof orderSchema>;

export interface Order {
  id: string;
  number: number;
  lines: Line[];
  total: number;
  pickup: { date: string; time: string };
  name: string;
  phone: string;
  note: string;
  status: Status;
  createdAt: string;
}

/** True when the chosen slot is still offered (with a few minutes' grace for slow submits). */
export function slotIsOpen(hours: WeekHours, timeZone: string, now: Date, pickup: { date: string; time: string }, graceMin = 10) {
  const day = pickupDay(hours, timeZone, new Date(now.getTime() - graceMin * 60_000));
  return !!day && day.date === pickup.date && day.times.includes(pickup.time);
}
