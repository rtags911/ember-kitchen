"use client";

import { site } from "@/content/site";
import { advanceOrder, placeOrder, type Order, type OrderInput, type Status } from "@/lib/cart";

type Reply = { ok: true; order: Order } | { ok: false; status: number; error: string };

// GitHub Pages has no server, so the static build keeps orders in this browser instead of /api/orders.
// Same validation either way (placeOrder/advanceOrder in lib/cart.ts). The board then shows orders placed in this browser.
const STATIC = process.env.NEXT_PUBLIC_STATIC === "1";
const KEY = "ember-orders";

function load(): { orders: Order[]; next: number } {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "") ?? { orders: [], next: 101 };
  } catch {
    return { orders: [], next: 101 };
  }
}
const save = (s: { orders: Order[]; next: number }) => localStorage.setItem(KEY, JSON.stringify(s));

async function send(method: string, body?: unknown): Promise<Response> {
  return fetch("/api/orders", { method, cache: "no-store", headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
}

export async function listOrders(): Promise<Order[]> {
  if (STATIC) return load().orders;
  const res = await send("GET");
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

export async function createOrder(input: OrderInput): Promise<Reply> {
  if (STATIC) {
    const s = load();
    const r = placeOrder(input, { menu: site.menu, hours: site.hours, timeZone: site.timeZone, now: new Date(), id: crypto.randomUUID(), number: s.next });
    if (!r.ok) return r;
    save({ orders: [...s.orders, r.value].slice(-200), next: s.next + 1 });
    return { ok: true, order: r.value };
  }
  const res = await send("POST", input);
  const body = await res.json();
  return res.ok ? { ok: true, order: body } : { ok: false, status: res.status, error: body.error ?? "We couldn't place that order. Try again." };
}

export async function moveOrder(id: string, status: Status): Promise<boolean> {
  if (STATIC) {
    const s = load();
    const r = advanceOrder(s.orders, id, status);
    if (r.ok) save(s);
    return r.ok;
  }
  return (await send("PATCH", { id, status })).ok;
}
