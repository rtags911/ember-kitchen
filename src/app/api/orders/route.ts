import { NextResponse } from "next/server";
import { z } from "zod";
import { site } from "@/content/site";
import { STATUSES, nextStatus, orderSchema, priceCart, slotIsOpen, type Order } from "@/lib/cart";

// shortcut: orders live in this process's memory, so they vanish on restart and aren't shared across instances.
// Upgrade to Mongo before real use: an OrderModel like lokalpikol/apps/web/src/server/models/ (BookingModel), status indexed.
const store = ((globalThis as { __emberOrders?: { orders: Order[]; next: number } }).__emberOrders ??= { orders: [], next: 101 });

export const dynamic = "force-dynamic";

// No auth on purpose: /admin is a demo board. Add auth before this holds real customer phone numbers.
export function GET() {
  return NextResponse.json(store.orders.slice(-200));
}

export async function POST(req: Request) {
  const parsed = orderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check your order." }, { status: 400 });
  const input = parsed.data;

  const { lines, total } = priceCart(site.menu, input.items);
  if (!lines.length) return NextResponse.json({ error: "Those items aren't on the menu any more." }, { status: 400 });
  if (!slotIsOpen(site.hours, site.timeZone, new Date(), input.pickup))
    return NextResponse.json({ error: "That pickup time has passed. Choose another." }, { status: 409 });

  const order: Order = {
    id: crypto.randomUUID(),
    number: store.next++,
    lines,
    total,
    pickup: input.pickup,
    name: input.name,
    phone: input.phone,
    note: input.note,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  store.orders.push(order);
  return NextResponse.json(order, { status: 201 });
}

const patchSchema = z.object({ id: z.string(), status: z.enum(STATUSES) });

/** Moves an order one step along new → preparing → ready. */
export async function PATCH(req: Request) {
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Bad request." }, { status: 400 });
  const order = store.orders.find((o) => o.id === parsed.data.id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (nextStatus(order.status) !== parsed.data.status) return NextResponse.json({ error: "Order already moved." }, { status: 409 });
  order.status = parsed.data.status;
  return NextResponse.json(order);
}
