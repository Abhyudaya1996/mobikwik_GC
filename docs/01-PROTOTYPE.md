# 01 — Web Prototype Spec: Mobikwik × Great.Cards

**Version:** 1.0  
**Owner:** Abhyudaya  
**Status:** Draft — Phase 1

---

## What we are building

A shareable stakeholder demo. Bipin or his PM team opens it, understands the integration in 5 minutes, wants to move forward. Not a pitch deck. Not a brochure. A simulation tool.

**Reference aesthetic:** BHIM Cashback-as-a-Service prototype — left panel controls, phone mockup in centre, everything simulatable. Clean, uses Mobikwik design tokens, no decorative copy.

---

## Architecture — 3 pages

| Route | Page name | Audience | Linked in nav? |
|---|---|---|---|
| `/` | Homepage | Mobikwik stakeholders | Yes |
| `/demo` | See It Working | Mobikwik stakeholders | Yes |
| `/revenue` | Revenue Potential | Mobikwik stakeholders | Yes |

Nav shows: `Homepage · See It Working · Revenue Potential`

---

## Page 1 — Homepage `/`

**Layout: Inline. No card grid. No bento. Top-to-bottom linear.**

### Block 1 — The problem (2 sentences max)

> Mobikwik has 36M wallet MAU and 34.4M pre-approved users. Every one of them who wants a credit card leaves the app today to apply elsewhere.

No sub-bullets. No moat language. Just the problem.

### Block 2 — The fix (1 sentence)

> We put 100+ credit cards inside Mobikwik — sorted by the cohort tags Lens already creates — without touching the wallet, the Zip book, or a single line of Mobikwik's backend.

### Block 3 — Revenue headline (inline, not a card)

Single number with math shown inline, editable:

```
31,90,000 MAU in scope × 4.5% blended CTR × 25% apply × 3.5% card-out × ₹2,000 = ₹0.57 Cr/month
```

Every multiplier is an inline editable input. Number updates as they type.  
One line below: "Conservative Year 1. See the full model →" links to /revenue.

### Block 4 — Why Great.Cards (3 bullets, inline list)

```
· 100+ cards vs zero aggregator options on Mobikwik today
· Lens-aware routing — each of your 6 cohorts sees only the cards it can get approved for
· NTC users route to Mobikwik First Card — your co-brand stays intact
```

No elaboration.

### CTA

One button → `/demo`  
Label: "See the integration →"

---

## Page 2 — See It Working `/demo`

**Layout: BHIM-style. Left panel (280px) + Phone mockup centre (375px) + Context strip right.**

### Left panel — top section (always visible)

User profile controls:
```
Credit score    [No score | 600 | 680 | 750 | 800]  toggle pills
Monthly income  [slider, ₹10K–₹2L]
Zip EMI status  [Active | Graduated | Never used]  toggle
Lens tag        [FD Pledge | EMI Grad | Bill-Pay | Spend-Backed | Score Watcher | NTC]  dropdown
```

### Left panel — bottom section (tab switcher)

Three tabs stacked vertically:

```
▶ In-App Placements
  12 touchpoints inside Mobikwik

  Notification Simulator
  What gets sent, when, to which cohort

  Marketing Hooks
  What the user sees when a hook fires
```

Active tab highlights in Mobikwik blue `#0055D4`. One tab active at a time.

---

### Tab 1 — In-App Placements

Left panel shows placement list (12 items):
```
 1  Home — Trending Offers row
 2  Home — Recommended for You strip
 3  Home — Credit Card Zone banner
 4  Home — Credit & Loans section
 5  Home — Cricket / seasonal banner
 6  App grid — First Credit Card tile
 7  All Services — Credit Cards entry
 8  Lens — Cashflow summary footer
 9  Lens — Check Credit Score CTA
10  Credit Score page — What can I get?
11  EMI Bill Due screen
12  Recharge / Bill-Pay confirmation
```

Click a placement → phone updates to show that screen with live API card data.

| Placement | API call | What phone shows |
|---|---|---|
| 1 Trending Offers | /cards popular:true | 2–3 trending CC tiles |
| 2 Recommended | /cards lens_tag + score | 2 personalised cards |
| 3 CC Zone | /cards full catalogue | Category filter + 4 cards |
| 4 Credit & Loans | /cards + /eligibility | Eligibility-checked 2 cards |
| 5 Cricket banner | /cards rewards_type:sports | 1 featured co-brand card |
| 6 App grid tile | /cards free_cards:true | Entry screen — "First Credit Card" |
| 7 All Services | /cards category:all | 3-card grid with score filter |
| 8 Lens Cashflow | /calculate → /cards | 1 spend-matched card below cashflow bar |
| 9 Lens Score CTA | /cards credit_score bucket | Score-gated card unlock reveal |
| 10 Credit Score page | /eligibility score_bucket | "At your score, these 4 cards are live" |
| 11 EMI Bill Due | /cards free_cards:true annual_savings | 2 free cards below payment row |
| 12 Recharge confirm | /cards cashback_type:utility | 1 utility-cashback card post-confirm |

Right strip: placement name + 1 line on why it converts.

---

### Tab 2 — Notification Simulator

Left panel controls:
```
Cohort          [dropdown — 6 cohorts]
Today's date    [auto-populated: current date]
Day offset      [+0  +1  +3  +7  +14  +30  — click to select]
```

Phone shows:
- The exact notification (push / WhatsApp) for that cohort on that day
- If day is silent: phone shows lock screen, label "No message today"
- In-journey cohort: every day silent — phone shows "Active Zip repayment — no CC touch"

Right strip shows 30-day arc for selected cohort:
```
D+0  D+1  D+3  D+7  D+14  D+30
 ●    ○    ●    ●    ○      ●      ← blue = message fires, grey = silent
```

Below arc: channel (push / WhatsApp), tone label, monthly volume cap.

Full copy sourced from `04-NOTIFICATIONS-STRATEGY.md`.

---

### Tab 3 — Marketing Hooks

Left panel shows hook list:
```
H1  Score-Unlock (score improves → new card tier revealed)
H2  ZIP Graduate (first card earned after repayment)
H3  Wallet-to-Card (spend pattern → matched card)
H4  FD-Backed First Step (FD pledge → secured card, no bureau)
H5  Bill-Pay Cashback Boost (recurring bills → cashback card match)
H6  Referral Ladder (refer → earn, unlock premium tier)
```

Click hook → phone shows what the user sees when hook fires:
- In-app banner / notification
- Card offer that appears
- CTA

Right strip: trigger condition, cost per card (blended), expected conversion lift.

Full copy sourced from `03-MARKETING-HOOKS.md`.

---

## Page 3 — Revenue Potential `/revenue`

**Layout: Inline funnel, top to bottom. No sliders. Editable inline numbers.**

### Section 1 — The funnel

Single top-down funnel, every number editable inline:

```
Mobikwik MAU in scope              [31,90,000]
↓  % who see a placement              [35%]       →  11,16,500 users
↓  % who click                        [4.5%]      →      50,243 users
↓  % who apply                        [25%]       →      12,561 users
↓  Bank approval rate                 [22.8%]     →       2,864 cards/month
×  Commission per card               [₹2,000]
=  Monthly gross                                   ₹0.57 Cr
=  Annual gross                                    ₹6.89 Cr
```

Defaults load Conservative Year 1 from `05-REVENUE-MODEL.md`.  
One line below: "Paisabazaar does ~80–100K cards/year at peak across all partners."

### Section 2 — Revenue split (inline table)

```
                        Mobikwik share    GC share
Split 70/30             ₹4.82 Cr          ₹2.07 Cr
Split 60/40             ₹4.13 Cr          ₹2.76 Cr
Split 50/50             ₹3.45 Cr          ₹3.45 Cr
```

Split % is editable — all three rows update simultaneously.

### Section 3 — Unit economics (GC side)

```
GC gross revenue (from above)       ₹2.07 Cr
Fixed monthly costs (editable)
  Team (callers + PM + ops)         [₹12 L/mo]
  Infra + API                       [₹1.5 L/mo]
Variable per card (editable)
  Caller cost / card                [₹150]
  Ops / card                        [₹100]
  Hook funding / card (blended)     [₹350]
────────────────────────────────────────────────
GC total cost / year                ₹X Cr
GC net / year                       ₹X Cr
Unit positive?                      ✓ / ✗
```

All numbers editable. Green = unit positive. Red = below unit with plain-English reason.

### Section 4 — Scenario toggle (inline text links)

```
Load: [Conservative — Year 1, 4 placements]  [Realistic — Year 2, all placements]  [Aggressive — all hooks live]
```

Source: `05-REVENUE-MODEL.md` Presets 1, 2, 3.

---

## Design directives

**Outside the phone mock:**
- Background: `#f9f9ff` (off-white) for homepage and revenue; `#0d1a2e` (dark) for demo page panels
- No card grids. No bento. Inline lists, inline tables, inline numbers
- Font: Inter everywhere
- All revenue numbers in Mobikwik blue `#0055D4`
- Negative / red states in `#dc2626`
- Accent yellow `#FFDF00` for key CTA highlights only

**Inside the phone mock (Mobikwik tonality):**
- Background: `#f9f9ff`
- Primary: `#0055D4`, Accent: `#FFDF00`
- Bottom tab bar with Mobikwik nav icons
- Inter font, 8px button radius, 16px card radius

**Phone mock shell:**
- Outer: `bg-slate-900 rounded-[2.75rem]`, 360px wide
- Inner: `bg-[#f9f9ff] rounded-[2.25rem]`
- Notch at top, no browser chrome

---

## Build order (Phase 2)

1. Router — 3 routes, clean URL handling (no hash routing)
2. Homepage `/` — 4 inline blocks, working revenue headline calculator
3. Demo page `/demo` — BHIM layout shell, user profile controls, Tab 1 wired to BankKaro API
4. Demo Tab 2 — Notification simulator (cohort + day offset → phone shows copy)
5. Demo Tab 3 — Marketing hooks (hook selector → phone shows hook UI)
6. Revenue page `/revenue` — editable funnel, split table, unit economics
7. Final: verify all 12 phone mocks render live API cards, no DOM ID conflicts

---

## Non-negotiables

| Constraint | How it shows up |
|---|---|
| Zero hard bureau pull at discovery | Score shown as bucket (No score / 600 / 680 / 750 / 800) — never raw |
| NTC → First Card routing | Notification simulator labels NTC cohort "→ SBM First Card" visibly |
| In-journey = 0 CC touches | Simulator shows "Active Zip repayment — paused" on every day |
| No deck page | No /deck route. No unlisted page. Deck is a separate file. |
