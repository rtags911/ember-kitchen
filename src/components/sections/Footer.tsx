import Link from "next/link";
import { site } from "@/content/site";
import credits from "../../../public/images/credits.json";

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Footer() {
  return (
    <footer className="bg-coal px-[var(--margin)] pb-10 pt-[var(--section)] text-ground">
      <div className="mx-auto max-w-[1180px]">
        <p className="text-display leading-none">{site.name}</p>
        <div className="mt-14 grid gap-10 text-small sm:grid-cols-3">
          <div>
            <h2 className="text-small font-semibold text-glow">Hours</h2>
            <ul className="tabular mt-3 space-y-1">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                <li key={d}>
                  {DAY[d]} {site.hours[d] ? `${site.hours[d]!.open}–${site.hours[d]!.close}` : "closed"}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-small font-semibold text-glow">Find us</h2>
            <p className="mt-3">
              {site.address.street}
              <br />
              {site.address.city}
            </p>
            <p className="mt-3">
              <a className="link inline-block py-2" href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>
                {site.phone}
              </a>
              <br />
              <a className="link inline-block py-2" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          </div>
          <div>
            <h2 className="text-small font-semibold text-glow">Order</h2>
            <p className="mt-3">
              <Link className="link inline-block py-2" href="/order">
                Your bag and pickup time
              </Link>
            </p>
            <p className="mt-3 text-ground/80">Pickup only. Pay at the counter.</p>
          </div>
        </div>
        <div className="mt-16 space-y-3 text-small text-ground/80">
          <p className="max-w-[75ch]">Ember Kitchen is a fictional café made for a portfolio demo. Menu, prices, hours and contact details are sample values.</p>
          <p className="max-w-[75ch]">
            Photos:{" "}
            {credits.map((c, i) => (
              <span key={c.file}>
                <a className="link" href={c.page}>
                  “{c.title}”
                </a>{" "}
                by {c.creator}, {c.license}, via {c.via}
                {i < credits.length - 1 ? "; " : "."}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
