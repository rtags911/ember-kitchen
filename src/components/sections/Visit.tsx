import Image from "next/image";
import { site } from "@/content/site";
import { HoursTable } from "../Today";

/** When and where: weekly hours with today marked, address, phone, map link. */
export function Visit() {
  const p = site.visitPhoto;
  const tel = site.phone.replace(/[^\d+]/g, "");
  return (
    <section id="visit" aria-labelledby="visit-title" className="px-[var(--margin)] py-[var(--section)]">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-2">
        <div>
          <h2 id="visit-title" data-reveal className="text-head">
            Hours and visit
          </h2>
          <div data-reveal className="mt-10">
            <HoursTable />
          </div>
          <address data-reveal className="mt-10 not-italic">
            <p className="text-lead">{site.address.street}</p>
            <p className="text-soft">{site.address.city}</p>
            <p className="mt-4 flex flex-wrap gap-x-6">
              <a className="link inline-block py-3" href={`tel:${tel}`}>
                {site.phone}
              </a>
              <a className="link inline-block py-3" href={site.address.mapUrl} target="_blank" rel="noreferrer">
                Open map
              </a>
            </p>
          </address>
        </div>
        <div data-reveal className="relative aspect-[4/3] self-end overflow-hidden rounded-[28px] bg-surface lg:aspect-[4/5]">
          <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
