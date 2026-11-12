"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { cafeClock } from "@/lib/cart";

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Today's weekday on the café's clock; null until mounted (server has no "today"). */
export function useWeekday() {
  const [day, setDay] = useState<number | null>(null);
  useEffect(() => setDay(cafeClock(new Date(), site.timeZone).weekday), []);
  return day;
}

/** "Open now until 15:00" line for the hero; says when we open if we're closed. */
export function TodayHours({ className = "" }: { className?: string }) {
  const [text, setText] = useState(" ");
  useEffect(() => {
    const now = cafeClock(new Date(), site.timeZone);
    const h = site.hours[now.weekday];
    const clock = `${String(Math.floor(now.minutes / 60)).padStart(2, "0")}:${String(now.minutes % 60).padStart(2, "0")}`;
    setText(
      !h || clock >= h.close
        ? "Closed now · order ahead for our next opening"
        : clock < h.open
          ? `Opens today at ${h.open}`
          : `Open now until ${h.close}`,
    );
  }, []);
  return <p className={className}>{text}</p>;
}

/** Weekly hours, today marked. */
export function HoursTable() {
  const today = useWeekday();
  // Start the week on Monday, as on the door.
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <table className="w-full text-body">
      <caption className="sr-only">Opening hours</caption>
      <tbody>
        {order.map((d) => {
          const h = site.hours[d];
          const isToday = d === today;
          return (
            <tr key={d} className={`border-b border-hair ${isToday ? "font-semibold text-ember" : ""}`}>
              <th scope="row" className="py-3 text-left font-[inherit]">
                {DAYS[d]}
                {isToday && <span className="ml-2 text-small">· today</span>}
              </th>
              <td className="tabular py-3 text-right">{h ? `${h.open}–${h.close}` : "Closed"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
