import { site } from "@/content/site";

/** Native <details>: keyboard and screen-reader friendly with no script. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-surface px-[var(--margin)] py-[var(--section)]">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1fr_1.6fr]">
        <h2 id="faq-title" data-reveal className="text-head">
          Questions
        </h2>
        <div data-reveal className="grid gap-3">
          {site.faqs.map((f) => (
            <details key={f.q} className="group rounded-[20px] bg-ground px-5">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lead tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="text-ember transition-transform duration-[var(--dur-ui)] group-open:rotate-45 motion-reduce:transition-none">
                  +
                </span>
              </summary>
              <p className="max-w-[60ch] pb-5 text-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
