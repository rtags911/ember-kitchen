"use client";

import Link from "next/link";
import { site } from "@/content/site";
import { priceCart } from "@/lib/cart";
import { useCart } from "./cart-store";

const links = [
  { label: "Menu", href: "/#menu" },
  { label: "How it works", href: "/#how" },
  { label: "Visit", href: "/#visit" },
];

/** Cream bar with the wordmark, section links (desktop) and the bag, which always shows its count. */
export function Nav() {
  const { count } = priceCart(site.menu, useCart());
  return (
    <header className="sticky top-0 z-40 bg-ground/95 backdrop-blur-sm">
      <nav aria-label="Main" className="flex h-[64px] items-center justify-between gap-6 px-[var(--margin)] text-small">
        <Link href="/" className="flex min-h-11 items-center gap-2 text-[1.125rem] font-semibold tracking-[-0.02em]">
          <svg aria-hidden width="18" height="22" viewBox="0 0 18 22" className="text-ember">
            <path fill="currentColor" d="M9 0c1 4 6 6.5 6 12a6 6 0 0 1-12 0c0-2.6 1.4-4.4 2.6-5.6C6 8.5 7 9.5 8 9.5 8 6 7.4 3 9 0Z" />
          </svg>
          {site.name}
        </Link>
        <ul className="hidden gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link className="py-3 hover:text-ember" href={l.href}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/order" className="btn">
          Your bag
          <span key={count} className="bump tabular inline-grid min-w-6 place-items-center rounded-full bg-ground px-1.5 text-[0.8125rem] leading-6 text-ink">
            {count}
          </span>
          <span className="sr-only">{count === 1 ? "item" : "items"}</span>
        </Link>
      </nav>
    </header>
  );
}
