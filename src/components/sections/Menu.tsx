"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { site } from "@/content/site";
import { formatPrice, priceCart } from "@/lib/cart";
import { setQty, useCart } from "../cart-store";
import { Stepper } from "../Stepper";

/** The menu as a printed sheet: category tabs across the top, items with dotted leaders to the price. */
export function Menu() {
  const cart = useCart();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const cat = site.menu[active];
  const { count, total } = priceCart(site.menu, cart);

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    const next = (active + step + site.menu.length) % site.menu.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="menu" aria-labelledby="menu-title" className="px-[var(--margin)] pb-[var(--section)]">
      <div data-reveal className="mx-auto max-w-[1180px] rounded-[28px] bg-paper p-5 sm:p-10 lg:p-14">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-6">
          <h2 id="menu-title" className="text-head">
            Menu
          </h2>
          <p className="text-small text-soft">Prices include tax. V vegetarian · VG vegan · GF gluten-free</p>
        </div>

        <div role="tablist" aria-label="Menu categories" className="mt-6 flex flex-wrap gap-2" onKeyDown={onKey}>
          {site.menu.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${c.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`tap shrink-0 px-5 text-small font-semibold ${i === active ? "bg-ink text-ground hover:!bg-ink" : "bg-surface"}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${cat.id}`} aria-labelledby={`tab-${cat.id}`} className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-surface">
              <Image key={cat.id} src={cat.photo.src} alt={cat.photo.alt} fill sizes="(min-width: 1024px) 36vw, 100vw" className="object-cover" />
            </div>
            {cat.note && <p className="mt-3 text-small font-semibold text-ember">{cat.note}</p>}
          </div>
          <ul className="grid gap-6">
            {cat.items.map((item) => {
              const qty = cart[item.id] ?? 0;
              return (
                <li key={item.id} className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <div className="min-w-0 flex-1 basis-[16rem]">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-lead tracking-[-0.02em]">{item.name}</h3>
                      {item.tags?.map((t) => (
                        <span key={t} className="text-[0.75rem] font-semibold text-soft">
                          {t}
                        </span>
                      ))}
                      <span aria-hidden className="leader" />
                      <span className="tabular text-lead font-semibold">{formatPrice(item.price)}</span>
                    </div>
                    <p className="mt-1 text-small text-soft">{item.text}</p>
                  </div>
                  {qty ? (
                    <Stepper label={item.name} qty={qty} onChange={(q) => setQty(item.id, q)} />
                  ) : (
                    <button type="button" className="btn btn-ghost min-w-[7.5rem]" onClick={() => setQty(item.id, 1)}>
                      Add<span className="sr-only"> {item.name}</span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink pt-6" aria-live="polite">
          <p className="tabular text-body">
            {count ? (
              <>
                <strong>{count}</strong> in your bag · <strong>{formatPrice(total)}</strong>
              </>
            ) : (
              "Your bag is empty. Add something above."
            )}
          </p>
          {count > 0 && (
            <Link href="/order" className="btn">
              Choose pickup time
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
