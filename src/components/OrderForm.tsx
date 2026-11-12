"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { formatPrice, orderSchema, pickupDay, priceCart, type Order, type PickupDay } from "@/lib/cart";
import { clearCart, setQty, useCart } from "./cart-store";
import { Stepper } from "./Stepper";
import { DAYS } from "./Today";

type Errors = Partial<Record<"items" | "pickup" | "name" | "phone" | "note" | "form", string>>;

const dayLabel = (d: PickupDay) => (d.offset === 0 ? "Today" : d.offset === 1 ? "Tomorrow" : DAYS[d.weekday]);

/** Bag → pickup time → name and phone → placed. Validated with the same schema the API uses. */
export function OrderForm() {
  const cart = useCart();
  const { lines, count, total } = priceCart(site.menu, cart);
  const [day, setDay] = useState<PickupDay | null | undefined>(undefined);
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [placed, setPlaced] = useState<Order | null>(null);

  // Slots depend on the clock: compute after mount and refresh each minute.
  useEffect(() => {
    const tick = () => setDay(pickupDay(site.hours, site.timeZone, new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  const timeStillOffered = !!day && day.times.includes(time);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const input = {
      items: Object.fromEntries(lines.map((l) => [l.id, l.qty])),
      pickup: { date: day?.date ?? "", time: timeStillOffered ? time : "" },
      name: String(f.get("name") ?? ""),
      phone: String(f.get("phone") ?? ""),
      note: String(f.get("note") ?? ""),
    };
    const check = orderSchema.safeParse(input);
    if (!check.success) {
      const next: Errors = {};
      for (const i of check.error.issues) next[i.path[0] as keyof Errors] ??= i.message;
      if (next.pickup) next.pickup = "Choose a pickup time.";
      setErrors(next);
      document.querySelector<HTMLElement>("[aria-invalid='true'], [data-error]")?.focus();
      return;
    }
    setErrors({});
    setSending(true);
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(check.data) });
      const body = await res.json();
      if (!res.ok) {
        setErrors({ form: body.error ?? "We couldn't place that order. Try again." });
        if (res.status === 409) setDay(pickupDay(site.hours, site.timeZone, new Date()));
        return;
      }
      setPlaced(body as Order);
      clearCart();
      window.scrollTo({ top: 0 });
    } catch {
      setErrors({ form: "No connection. Your bag is saved; try again." });
    } finally {
      setSending(false);
    }
  }

  if (placed) {
    return (
      <div className="ticket mx-auto max-w-[520px] rounded-t-[24px] p-8 text-center" role="status">
        <p className="text-small font-semibold text-ember">Order placed</p>
        <p className="tabular mt-2 text-display leading-none">#{placed.number}</p>
        <p className="mt-6 text-lead">
          Pick up {day && placed.pickup.date === day.date ? (day.offset < 2 ? dayLabel(day).toLowerCase() : `on ${dayLabel(day)}`) : placed.pickup.date} at <strong className="tabular">{placed.pickup.time}</strong>
        </p>
        <p className="mt-2 text-soft">
          Give the name <strong className="text-ink">{placed.name}</strong> at the counter and pay there: <span className="tabular">{formatPrice(placed.total)}</span>.
        </p>
        <Link href="/" className="btn btn-ghost mt-8">
          Back to the menu
        </Link>
      </div>
    );
  }

  if (!count) {
    return (
      <div className="mx-auto max-w-[520px] text-center">
        <p className="text-lead">Your bag is empty.</p>
        <Link href="/#menu" className="btn mt-6">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="mx-auto grid max-w-[1080px] gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      <section aria-labelledby="bag-title" className="ticket rounded-t-[24px] p-6 sm:p-8">
        <h2 id="bag-title" className="text-lead">
          Your bag
        </h2>
        <ul className="mt-4 divide-y divide-hair">
          {lines.map((l) => (
            <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0 basis-full sm:basis-auto">
                <p className="font-semibold">{l.name}</p>
                <p className="tabular text-small text-soft">{formatPrice(l.price)} each</p>
              </div>
              <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
                <Stepper label={l.name} qty={l.qty} onChange={(q) => setQty(l.id, q)} />
                <span className="tabular w-16 text-right font-semibold">{formatPrice(l.price * l.qty)}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between border-t-2 border-ink pt-4">
          <span>Total, paid at pickup</span>
          <span className="tabular text-lead font-semibold">{formatPrice(total)}</span>
        </div>
        <Link href="/#menu" className="link mt-4 inline-block py-2 text-small">
          Add more
        </Link>
      </section>

      <div className="grid gap-8">
        <fieldset data-error={errors.pickup ? true : undefined} tabIndex={-1} aria-describedby={errors.pickup ? "pickup-err" : undefined} className="outline-none">
          <legend className="text-lead">Pickup time{day ? ` · ${dayLabel(day)}` : ""}</legend>
          {day === undefined ? (
            <p className="mt-3 text-soft">Finding times…</p>
          ) : day === null ? (
            <p className="mt-3 text-soft">We have no pickup times this week. Call us on {site.phone}.</p>
          ) : (
            <>
              {day.offset > 0 && <p className="mt-2 text-small text-soft">We&apos;re closed for the rest of today. These are our next times.</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {day.times.map((t) => (
                  <label key={t} className="tap tabular cursor-pointer bg-surface px-4 text-small font-semibold has-[:checked]:bg-ink has-[:checked]:text-ground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember">
                    <input type="radio" name="time" value={t} checked={time === t} onChange={() => setTime(t)} className="sr-only" />
                    {t}
                  </label>
                ))}
              </div>
            </>
          )}
          {errors.pickup && (
            <p id="pickup-err" className="mt-2 text-small font-semibold text-ember">
              {errors.pickup}
            </p>
          )}
        </fieldset>

        <fieldset className="grid gap-4">
          <legend className="text-lead">Your details</legend>
          <Field name="name" label="Name for the order" autoComplete="given-name" error={errors.name} />
          <Field name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" error={errors.phone} hint="Only used if we need to reach you about this order." />
          <Field name="note" label="Note (optional)" error={errors.note} hint="Allergies, no onions, extra hot…" textarea />
        </fieldset>

        {errors.form && (
          <p role="alert" className="rounded-[12px] bg-surface p-4 font-semibold text-ember">
            {errors.form}
          </p>
        )}
        <button type="submit" className="btn w-full" aria-disabled={sending || undefined} disabled={sending}>
          {sending ? "Placing order…" : `Place order · ${formatPrice(total)}`}
        </button>
        <p className="-mt-4 text-center text-small text-soft">No payment now. Pay at the counter.</p>
      </div>
    </form>
  );
}

function Field(props: {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "tel";
  textarea?: boolean;
}) {
  const { name, label, error, hint, textarea, ...rest } = props;
  const describedBy = [hint && `${name}-hint`, error && `${name}-err`].filter(Boolean).join(" ") || undefined;
  const common = { id: name, name, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, className: "field mt-1.5" };
  return (
    <div>
      <label htmlFor={name} className="text-small font-semibold">
        {label}
      </label>
      {textarea ? <textarea {...common} rows={3} maxLength={200} /> : <input {...common} {...rest} />}
      {hint && (
        <p id={`${name}-hint`} className="mt-1 text-small text-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-err`} className="mt-1 text-small font-semibold text-ember">
          {error}
        </p>
      )}
    </div>
  );
}
