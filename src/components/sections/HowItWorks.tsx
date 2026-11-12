import Image from "next/image";
import { site } from "@/content/site";

const band = site.menu.find((c) => c.id === "bakery")!.photo;
const cup = site.menu.find((c) => c.id === "drinks")!.photo;

/** Three steps on the coal band: ordering is low-risk because nothing is paid online. Bakery photo leads into it. */
export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="bg-coal text-ground">
      <div data-reveal className="relative aspect-[21/9] max-h-[70svh] w-full overflow-hidden">
        <Image src={band.src} alt={band.alt} fill sizes="100vw" className="object-cover" />
      </div>
      <div className="mx-auto grid max-w-[1180px] gap-12 px-[var(--margin)] py-[var(--section)] box-content lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <h2 id="how-title" data-reveal className="max-w-[14ch] text-head">
            How ordering works
          </h2>
          <ol className="mt-12 grid gap-10">
            {site.steps.map((s) => (
              <li key={s.title} data-reveal>
                <h3 className="text-lead tracking-[-0.02em] text-glow">{s.title}</h3>
                <p className="mt-2 max-w-[40ch] text-ground/85">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div data-reveal className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
          <Image src={cup.src} alt={cup.alt} fill sizes="(min-width: 1024px) 36vw, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
