# Ember Kitchen — design system

**Idea:** the page is the café's own paper. The menu is a printed sheet (dotted leaders to the price, ink rules top and bottom); the bag, the confirmation and the kitchen board are order tickets with a torn zig-zag edge.

## Tokens (`src/app/globals.css`)
Three layers: primitives (`--p-*`) → semantic (`--ground`, `--ink`, `--ember`, `--surface`, `--paper`, `--coal`, `--glow`, `--soft`, `--hair`) → component (`--btn-*`). Palette and contrast: `design-process/palette.md`.

## Type
Hanken Grotesk only (local woff2, 400–600). Headings 600, tracking −0.035em, leading 0.98. Five sizes: `text-small`, `text-body`, `text-lead`, `text-head`, `text-display`. Prices use `.tabular`.

## Components
- `.btn` ember pill, 48px; `.btn-ghost` outlined. `.tap` 44px round control (steppers, tabs, time chips).
- `.field` paper input with inset ring; ember ring when invalid.
- `.ticket` paper with zig-zag bottom (clip-path).
- `.leader` dotted menu leader.

## Motion
- Signature: the hero oven "door" (coal panel) drops open once on load (`.door`, CSS scaleY, 1.1s ease-in-out).
- Headline: React Bits SplitText, lines rise on load.
- Entrances: `[data-reveal]` via GSAP `ScrollTrigger.batch` (`ScrollScenes.tsx`), opacity + 24px rise, staggered.
- Press: `.btn` scale 0.97, `.tap` 0.92; bag count bumps when it changes.
- Reduced motion: no door, no entrances, no press scale; everything renders in its final state.

## Layout
Content column `max-w-[1180px]` centred; side margin `--margin`; section rhythm `--section`.
