"use client";

import { useCallback, useEffect, useState } from "react";
import { STATUSES, formatPrice, nextStatus, type Order, type Status } from "@/lib/cart";

const TITLES: Record<Status, string> = { new: "New", preparing: "Preparing", ready: "Ready" };
const ACTION: Record<Status, string> = { new: "Start preparing", preparing: "Mark ready", ready: "" };

/** Kitchen board: polls the API every 4s; one button moves a ticket to the next column. */
export function Board() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setOrders(await res.json());
      setError("");
    } catch {
      setError("Can't reach the order list. Retrying…");
    }
  }, []);

  useEffect(() => {
    load();
    const id = window.setInterval(() => !document.hidden && load(), 4000);
    return () => window.clearInterval(id);
  }, [load]);

  async function advance(o: Order) {
    const status = nextStatus(o.status);
    if (!status) return;
    setOrders((list) => list?.map((x) => (x.id === o.id ? { ...x, status } : x)) ?? null); // optimistic
    const res = await fetch("/api/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: o.id, status }) }).catch(() => null);
    if (!res?.ok) setError("That change didn't save. Refreshed the board.");
    load();
  }

  return (
    <>
      {error && (
        <p role="alert" className="mb-6 rounded-[12px] bg-surface p-4 font-semibold text-ember">
          {error}
        </p>
      )}
      <div className="grid gap-6 md:grid-cols-3">
        {STATUSES.map((s) => {
          const col = (orders ?? []).filter((o) => o.status === s).sort((a, b) => (a.pickup.date + a.pickup.time).localeCompare(b.pickup.date + b.pickup.time));
          return (
            <section key={s} aria-labelledby={`col-${s}`} className="rounded-[24px] bg-surface p-4">
              <h2 id={`col-${s}`} className="flex items-center justify-between px-2 pb-3 text-lead">
                {TITLES[s]}
                <span className="tabular text-small text-soft">{col.length}</span>
              </h2>
              <ul className="grid gap-3" aria-live="polite">
                {orders === null && <li className="px-2 text-small text-soft">Loading…</li>}
                {orders !== null && !col.length && <li className="px-2 py-2 text-small text-soft">No orders.</li>}
                {col.map((o) => (
                  <li key={o.id} className="ticket rounded-t-[16px] p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="tabular text-lead font-semibold">#{o.number}</span>
                      <span className="tabular text-small font-semibold text-ember">
                        {o.pickup.time}
                        <span className="sr-only"> pickup on {o.pickup.date}</span>
                      </span>
                    </div>
                    <p className="mt-1 font-semibold">{o.name}</p>
                    <p className="tabular text-small text-soft">
                      <a className="link inline-block py-1" href={`tel:${o.phone.replace(/[^\d+]/g, "")}`}>
                        {o.phone}
                      </a>
                    </p>
                    <ul className="mt-2 text-small">
                      {o.lines.map((l) => (
                        <li key={l.id}>
                          <span className="tabular font-semibold">{l.qty}×</span> {l.name}
                        </li>
                      ))}
                    </ul>
                    {o.note && <p className="mt-2 rounded-[8px] bg-surface px-2 py-1 text-small">Note: {o.note}</p>}
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="tabular text-small text-soft">{formatPrice(o.total)}</span>
                      {ACTION[s] && (
                        <button type="button" className="btn min-h-11 px-4" onClick={() => advance(o)}>
                          {ACTION[s]}
                          <span className="sr-only"> for order {o.number}</span>
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
