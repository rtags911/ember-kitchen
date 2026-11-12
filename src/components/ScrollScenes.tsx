"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Section entrances: each [data-reveal] rises 24px and fades in as it enters, batched so siblings stagger.
 * Transform + opacity only. Reduced motion: nothing runs and content is already in place.
 * Without JS the content is simply visible (GSAP sets the start state, not CSS).
 */
export function ScrollScenes() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set("[data-reveal]", { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.08, overwrite: true }),
      });
    });
    // Photos and fonts shift layout after load; re-measure once everything is in.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  });
  return null;
}
