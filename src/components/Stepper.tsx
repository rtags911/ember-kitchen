import { MAX_QTY } from "@/lib/cart";

/** − qty + control. Going below 1 removes the item. */
export function Stepper({ label, qty, onChange }: { label: string; qty: number; onChange: (qty: number) => void }) {
  return (
    <div className="inline-flex min-w-[7.5rem] items-center justify-between rounded-full bg-surface" role="group" aria-label={`${label} quantity`}>
      <button type="button" className="tap text-lead" onClick={() => onChange(qty - 1)} aria-label={qty === 1 ? `Remove ${label}` : `One less ${label}`}>
        −
      </button>
      <span className="tabular min-w-6 text-center font-semibold" aria-live="polite">
        {qty}
      </span>
      <button type="button" className="tap text-lead" onClick={() => onChange(qty + 1)} disabled={qty >= MAX_QTY} aria-label={`One more ${label}`}>
        +
      </button>
    </div>
  );
}
