"use client";

import { useSyncExternalStore } from "react";
import { MAX_QTY, type Cart } from "@/lib/cart";

// One bag shared by Nav, Menu and /order; kept in localStorage so it survives the page change.
const KEY = "ember-cart";
const EMPTY: Cart = {};
let cart: Cart = EMPTY;
let loaded = false;
const subs = new Set<() => void>();

function read(): Cart {
  if (!loaded) {
    loaded = true;
    try {
      cart = JSON.parse(localStorage.getItem(KEY) ?? "{}") ?? {};
    } catch {
      cart = {};
    }
  }
  return cart;
}

function write(next: Cart) {
  cart = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode: the bag still works for this page view.
  }
  subs.forEach((f) => f());
}

export function setQty(id: string, qty: number) {
  const next = { ...read() };
  if (qty < 1) delete next[id];
  else next[id] = Math.min(qty, MAX_QTY);
  write(next);
}

export const clearCart = () => write({});

export function useCart(): Cart {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    read,
    () => EMPTY,
  );
}
