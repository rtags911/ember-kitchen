import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import SplitText from "../bits/SplitText/SplitText";
import { TodayHours } from "../Today";

/** Headline across the full width; under it the action on the left and the oven on the right, behind a door that opens once on load (signature). */
export function Hero() {
  const p = site.heroPhoto;
  return (
    <section id="top" className="px-[var(--margin)] pb-[var(--section)] pt-10 lg:pt-16">
      <div className="mx-auto max-w-[1180px]">
        <TodayHours className="text-small font-semibold text-ember" />
        <SplitText
          tag="h1"
          text={site.headline}
          className="mt-4 text-display"
          splitType="lines"
          effect="rise"
          mask
          trigger="load"
          delay={110}
          duration={1}
          ease="expo.out"
          textAlign="left"
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-end">
          <div>
            <p data-reveal className="max-w-[34ch] text-lead text-soft">
              Wood-fired breakfast, sandwiches and bakery. Order here, collect at the counter, pay when you pick up.
            </p>
            <div data-reveal className="mt-8 flex flex-wrap gap-3">
              <Link href="#menu" className="btn">
                Start an order
              </Link>
              <Link href="#visit" className="btn btn-ghost">
                Hours and address
              </Link>
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-coal">
            <Image src={p.src} alt={p.alt} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-[35%_50%]" />
            {/* Oven door: covers the fire, then drops away. Pure CSS so it never sticks if JS fails; off under reduced motion. */}
            <div aria-hidden className="door absolute inset-0 origin-bottom bg-coal" />
          </div>
        </div>
      </div>
    </section>
  );
}
