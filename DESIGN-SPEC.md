# SAUBHAGYA — Personal Portfolio · Design Spec v1 (Concept Lock)

> Locked 2026-07-18. Every build decision traces back to this document.
> Change this file only with deliberate intent — it exists to stop mid-build redesigns.

---

## 1. The Concept — "Connecting the Dots"

**One line:** A strategist is someone who sees the pattern before it exists.
The site performs this idea instead of claiming it: career moments, numbers, and
case studies appear as scattered **star-points**, and as the visitor scrolls, ink
lines **draw the connections** — the way Saubhagya connects market signals into
strategy.

Why it wins:
- It is *about* him, not decoration. The metaphor = the service (pattern-seeing).
- It quietly echoes "Chanakya" (niti, strategy, reading the board) without saying it.
- It is NOT the Baaz notebook genre — no tape, no handwriting, no torn paper.
  New genre: **celestial-minimal / cartographer's night sky on fine paper**.

**Explicit non-goals:** no loud color blocks, no maximalist textures, no copied
ticker bar, no "You've seen X%" gauge (replaced — see §5.5).

---

## 2. Palette — "Paper by day, sky by night"

95% of the page is paper + ink. The two accents appear only where meaning lives.

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F6F3EC` | Page background (warm bone, not white) |
| `--ink` | `#191713` | All primary text (warm near-black) |
| `--ink-faint` | `rgba(25,23,19,0.12)` | Hairlines, constellation guide-lines |
| `--iris` | `#55498F` | The intellect accent: links, active states, drawn constellation lines |
| `--gold` | `#C9A227` | The star accent: cursor star, flare moments, key numbers |
| `--night` | `#14121F` | Chapter 02 inverted scene background (deep ink-violet night) |
| `--paper-on-night` | `#EDE9DE` | Text color inside the night scene |

Rules:
- Gold is *earned* — only on the cursor, star-points, and the single most
  important number per screen. Never for large fills.
- Iris carries interaction (hover, active, drawn lines). Never both accents on
  the same element.
- One full inversion in the whole page (Chapter 02). Everything else stays paper.

---

## 3. Typography

| Use | Font | Notes |
|---|---|---|
| Display / headlines | **Fraunces** (Google, variable) | High-contrast serif with personality ("wonk" axis). Premium with a wink — the "funky but subtle" requirement lives here |
| Body, UI, labels, numbers | **Space Grotesk** (Google) | Slightly quirky grotesque; digits look great counting up |
| Meta / coordinates | Space Grotesk + `letter-spacing: 0.12em`, uppercase, 11–12px | Fake-mono star-map labels, e.g. `26.85° N · 80.95° E` |

Scale (desktop → mobile): Hero name ~ `clamp(4rem, 12vw, 11rem)`; chapter titles
~ `clamp(2rem, 5vw, 3.5rem)`; body 17–18px/1.6. Two font families total. Both
free, both preloaded.

---

## 4. Section Map (the scroll journey)

| # | Section | Label on page | Content |
|---|---|---|---|
| 0 | Intro (optional, ≤1s) | — | Scattered dots connect into one star, fade to hero. Skippable; cut entirely if it costs performance |
| 1 | **Hero** | `26.85° N · 80.95° E` | Giant "Saubhagya" in Fraunces. Sub-line: the arc *Social Media Kid → Performance Marketer → The Strategist* rendered as a mini 3-star constellation that draws itself on load. One quip line. Scroll cue |
| 2 | **Origin** | `Chapter 01 · The Dots` | Career timeline as constellation: star-points for 2016 (weddings), 2019 (real estate), 2024 (the ₹1-crore campaign). Scroll draws the connecting line; narrative text illuminates alongside (spotlight treatment) |
| 3 | **Numbers** | `Chapter 02 · The Receipts` | THE set-piece. Page inverts to `--night`. Scene **pins**; stats appear one at a time as stars that flare gold, then count up. Scroll releases only after the last stat lands. (Direct answer to the v1 feedback: "numbers stay until seen") |
| 4 | **Work** | `Chapter 03 · The Proof` | 2–4 selected case studies as quiet cards; each = client type, one sharp result line, one visual. Cards tilt/glow subtly toward the cursor |
| 5 | **Playbook** | `Chapter 04 · The Method` | 3–4 working principles. Words illuminate as they cross the reading zone (scroll-linked spotlight text) |
| 6 | **Contact** | `The Next Dot` | "Your business could be the next dot." One CTA (WhatsApp / email), links, tiny footer |

---

## 5. Signature Interactions (five, no more)

1. **Star cursor** — small gold four-point star replaces the cursor, with a
   short fading trail. Scales up slightly over interactive elements. Pure
   canvas layer; hidden on touch devices (their signature move is #2 instead).
2. **Constellation drawing** — SVG polylines between star-points, drawn by
   scroll (stroke-dashoffset ↔ GSAP ScrollTrigger scrub). Used in Hero (auto,
   on load) and Origin (scroll-driven).
3. **Pinned Receipts scene** — ScrollTrigger pin; sequential star-flare +
   count-up per stat; progress dots; unpins after final stat. Reduced-motion
   fallback: static list, no pin.
4. **Spotlight text** — scroll-linked word illumination (Framer Motion
   `useScroll` + `useTransform`, clip-path/opacity per line). Origin narrative +
   Playbook principles only.
5. **Sky-fill progress** — top-right corner holds a tiny 7-star constellation
   outline; stars fill as the visitor progresses through sections; at the end it
   glows once, complete. (Our replacement for Baaz's % gauge — same retention
   psychology, original form.)

Restraint rules: one signature move per viewport; everything else is opacity /
transform micro-motion ≤ 600ms; `prefers-reduced-motion` gets a fully static,
still-beautiful site.

---

## 6. Copy Voice

- Calm confidence. Short declaratives. The numbers do the bragging.
- Strategist's cadence: setup → turn. *"Everyone has a marketing budget. Few
  have a marketing brain."* stays.
- No agency-speak ("solutions", "leverage", "synergy" banned).
- English primary; at most one Hindi/Hinglish garnish line if it lands naturally.

---

## 7. Tech + Performance Budget

- **Stack:** Vite + React 18 · Framer Motion (spotlight, micro) · GSAP +
  ScrollTrigger (pin, constellation scrub) · Lenis (smooth scroll) · plain CSS
  custom properties (tokens above).
- **Budget:** LCP < 1.8s (4G) · initial JS < 250KB gz · fonts preloaded ·
  images lazy + AVIF/WebP · canvas only for the cursor layer.
- **Deploy:** GitHub → Netlify auto-deploy from `main`.

---

## 8. Assets Needed (external to code)

| Asset | Source | Status |
|---|---|---|
| 1–2 night-sky / constellation textures (subtle, paper-grain compatible) | Higgsfield | pending |
| Optional line-art strategist portrait | Higgsfield | pending |
| Real case-study numbers + client references | Saubhagya | pending |
| Contact channel (WhatsApp number / email) + domain choice | Saubhagya | pending |

---

## 9. Open Questions (answer before Chapter 03 build)

1. Which 2–4 case studies go in **The Proof**, and what single number leads each?
2. Real photo anywhere, or fully abstract (type + stars only)?
3. Domain: `saubhagya.me` / `.in` / other?
4. Keep or cut the ≤1s intro after we test real load speed?
