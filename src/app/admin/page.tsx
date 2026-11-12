import type { Metadata } from "next";
import Link from "next/link";
import { Board } from "@/components/Board";

export const metadata: Metadata = { title: "Order board — Ember Kitchen" };

/** Demo kitchen board. No auth: do not deploy with real customer data. */
export default function AdminPage() {
  return (
    <main className="min-h-svh px-[var(--margin)] py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small font-semibold text-ember">Ember Kitchen · kitchen</p>
          <h1 className="mt-2 text-head">Order board</h1>
        </div>
        <Link href="/" className="link py-3 text-small">
          Back to site
        </Link>
      </div>
      {process.env.NEXT_PUBLIC_STATIC === "1" && (
        <p className="mb-6 max-w-[70ch] text-small text-soft">
          Static demo: with no server, this board shows the orders placed in this browser. Place one on the order page, then move it along here.
        </p>
      )}
      <Board />
    </main>
  );
}
