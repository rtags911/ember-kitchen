import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { OrderForm } from "@/components/OrderForm";

export const metadata: Metadata = { title: "Your order — Ember Kitchen" };

export default function OrderPage() {
  return (
    <>
      <Nav />
      <main className="px-[var(--margin)] py-12 sm:py-16">
        <h1 className="mx-auto mb-10 max-w-[1080px] text-head">Order for pickup</h1>
        <OrderForm />
      </main>
    </>
  );
}
