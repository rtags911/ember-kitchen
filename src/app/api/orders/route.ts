import { NextResponse } from "next/server";
import { site } from "@/content/site";
import { advanceOrder, placeOrder, type Order } from "@/lib/cart";

// shortcut: orders live in this process's memory, so they vanish on restart and aren't shared across instances.
// Upgrade to Mongo before real use: an OrderModel like lokalpikol/apps/web/src/server/models/ (BookingModel), status indexed.
const store = ((globalThis as { __emberOrders?: { orders: Order[]; next: number } }).__emberOrders ??= { orders: [], next: 101 });

export const dynamic = "force-dynamic";

const reply = (r: ReturnType<typeof placeOrder>, okStatus = 200) =>
  r.ok ? NextResponse.json(r.value, { status: okStatus }) : NextResponse.json({ error: r.error }, { status: r.status });

// No auth on purpose: /admin is a demo board. Add auth before this holds real customer phone numbers.
export function GET() {
  return NextResponse.json(store.orders.slice(-200));
}

export async function POST(req: Request) {
  const raw = await req.json().catch(() => null);
  const r = placeOrder(raw, { menu: site.menu, hours: site.hours, timeZone: site.timeZone, now: new Date(), id: crypto.randomUUID(), number: store.next });
  if (r.ok) {
    store.next++;
    store.orders.push(r.value);
  }
  return reply(r, 201);
}

/** Moves an order one step along new → preparing → ready. */
export async function PATCH(req: Request) {
  const body = (await req.json().catch(() => null)) as { id?: unknown; status?: unknown } | null;
  if (typeof body?.id !== "string" || typeof body.status !== "string") return NextResponse.json({ error: "Bad request." }, { status: 400 });
  return reply(advanceOrder(store.orders, body.id, body.status));
}
