# 02 — In-App Placements: Mobikwik × Great.Cards

**Version:** 1.0  
**Owner:** Abhyudaya  
**Status:** Draft — Phase 1

---

## Placement map overview

12 confirmed placements across 6 surfaces. Each placement has: surface, trigger condition, cohorts served, card filter, and conversion rationale.

---

## Surface 1 — Home Screen (5 placements)

### P1 — Trending Offers Row

| Field | Detail |
|---|---|
| Location | Home screen, below wallet balance, horizontal scroll |
| Trigger | Always-on for all logged-in users |
| Cohorts served | All except NTC long-tail |
| Card filter | /cards popular:true limit:3 |
| Format | 3 tiles, horizontal scroll, card art + headline + "Apply Free →" |
| Why it converts | First thing users see post-balance check — high-intent moment |

**Copy template:**
> "Top picks this week — picked for Mobikwik users"

---

### P2 — Recommended for You Strip

| Field | Detail |
|---|---|
| Location | Home screen, below Trending Offers |
| Trigger | Lens cohort tag present OR credit score > 600 |
| Cohorts served | EMI Graduate, Spend-Backed, Score Watcher, Bill-Pay Regular |
| Card filter | /cards lens_tag:{cohort} credit_score:{bucket} limit:2 |
| Format | 2-card strip, labelled "Based on your Mobikwik activity" |
| Why it converts | Personalisation signal — users whose spend pattern informed the pick respond 2–3× better |

**Copy template:**
> "Based on how you use Mobikwik — 2 cards you'd likely get approved for"

---

### P3 — Credit Card Zone Banner

| Field | Detail |
|---|---|
| Location | Home screen, full-width banner slot (rotates with other offers) |
| Trigger | User has no active credit card on file |
| Cohorts served | All except active Zip repayment |
| Card filter | /cards is_ltf_only:true limit:1 (lead card) |
| Format | Full-width card, headline + sub + CTA button |
| Why it converts | LTF positioning removes fee-anxiety which is primary NTC objection |

**Copy template:**
> "Your first credit card — ₹0 annual fee, always"

---

### P4 — Credit & Loans Section Header

| Field | Detail |
|---|---|
| Location | Home screen, Credit & Loans expandable section, top card |
| Trigger | User taps Credit & Loans section |
| Cohorts served | FD Pledge, EMI Graduate, Score Watcher |
| Card filter | /eligibility score_bucket:{bucket} → /cards filtered |
| Format | Eligibility-first card: "These cards are open for you right now" |
| Why it converts | Eligibility pre-check removes fear of rejection — primary NTC dropout reason |

**Copy template:**
> "Cards open for you — checked against your score before you apply"

---

### P5 — Cricket / Seasonal Banner

| Field | Detail |
|---|---|
| Location | Home screen, contextual banner slot (IPL season / festive) |
| Trigger | Seasonal event active (IPL, Diwali, etc.) |
| Cohorts served | Spend-Backed, Bill-Pay Regular, EMI Graduate |
| Card filter | /cards rewards_type:entertainment OR rewards_type:cashback limit:1 |
| Format | Event-branded banner, sports/cashback card featured |
| Why it converts | Contextual relevance — user is in spend mode during events |

**Copy template (IPL):**
> "IPL on? Get cashback on every match-day spend →"

---

## Surface 2 — App Grid (1 placement)

### P6 — First Credit Card Tile

| Field | Detail |
|---|---|
| Location | App grid (home icon grid), dedicated "First Credit Card" tile |
| Trigger | Always-on; tile present permanently in grid |
| Cohorts served | All — acts as discovery entry for users who skip Home placements |
| Card filter | /cards free_cards:true limit:4 (LTF catalogue) |
| Format | Grid tile → taps to full CC catalogue page within GC webview |
| Why it converts | Permanent shelf presence — users who explore the grid find it without needing a push |

---

## Surface 3 — All Services (1 placement)

### P7 — Credit Cards Entry Point

| Field | Detail |
|---|---|
| Location | All Services screen, Financial Services section |
| Trigger | User opens All Services |
| Cohorts served | All |
| Card filter | /cards category:all (full catalogue, score-filtered) |
| Format | Tappable entry row → opens GC webview catalogue with user's score pre-loaded |
| Why it converts | High-intent surface — users in All Services are actively looking for something |

---

## Surface 4 — Lens (2 placements)

### P8 — Lens Cashflow Summary Footer

| Field | Detail |
|---|---|
| Location | Lens screen, below cashflow chart, sticky footer card |
| Trigger | Lens cashflow analysis complete; user has Spend-Backed tag OR Bill-Pay tag |
| Cohorts served | Spend-Backed, Bill-Pay Regular |
| Card filter | /calculate income:{cashflow_avg} → /cards matched |
| Format | 1 card, "Your spend pattern matches this card", cashback estimate shown |
| Why it converts | Highest-trust surface — Lens just told the user their financial story; card recommendation reads as a natural next step |

**Copy template:**
> "Your Mobikwik cashflow qualifies you for this — ₹{X} cashback/year on your bill pattern"

---

### P9 — Lens Check Credit Score CTA

| Field | Detail |
|---|---|
| Location | Lens screen, "Check Credit Score" module footer |
| Trigger | User has viewed their score OR clicked "Check Credit Score" |
| Cohorts served | Score Watcher |
| Card filter | /cards credit_score:{bucket} limit:2 |
| Format | "At your score, these cards are reachable" — 2 cards below score reveal |
| Why it converts | Score reveal is a high-intent moment; user just saw a number and wants to know what it unlocks |

---

## Surface 5 — Credit Score Page (1 placement)

### P10 — What Can I Get? Card Reveal

| Field | Detail |
|---|---|
| Location | Dedicated Credit Score page, below score doughnut |
| Trigger | Score page loaded (user explicitly navigated here) |
| Cohorts served | Score Watcher, FD Pledge (with note: "Pledge FD → unlock these") |
| Card filter | /eligibility score_bucket:{bucket} → /cards filtered by approval likelihood |
| Format | "Cards live at your score right now" — 3–4 cards, approval likelihood badge |
| Why it converts | Maximum intent surface — user came to a credit page; they are ready to act |

**Copy template:**
> "At {score}, these 3 cards have the highest approval chance for you"

---

## Surface 6 — Transactional Screens (2 placements)

### P11 — EMI Bill Due Screen

| Field | Detail |
|---|---|
| Location | Zip EMI repayment screen, below payment confirmation |
| Trigger | User has just paid an EMI OR is viewing an upcoming due |
| Cohorts served | EMI Graduate (≥3 EMIs paid on time) |
| Card filter | /cards free_cards:true annual_savings:true limit:2 |
| Format | "You've proven your repayment track record — here's what that unlocks", 2 LTF cards |
| Why it converts | Repayment moment = peak financial confidence; user just acted responsibly and is primed for credit upgrade |

**Copy template:**
> "3 EMIs on time. Banks notice that. Here's what you can get now →"

---

### P12 — Recharge / Bill-Pay Confirmation

| Field | Detail |
|---|---|
| Location | Post-payment success screen (recharge, electricity, DTH, etc.) |
| Trigger | Bill-Pay transaction completed |
| Cohorts served | Bill-Pay Regular (≥2 utility bills paid/month on Mobikwik) |
| Card filter | /cards cashback_type:utility limit:1 |
| Format | Single card, "This bill just cost you ₹X — this card would have paid you back ₹Y" |
| Why it converts | Loss-frame at moment of payment — user just spent money; cashback card immediately quantifies the upside |

**Copy template:**
> "You paid ₹{bill_amount}. This card would have returned ₹{cashback} of that →"

---

## Placement priority for 2-week sprint

| Priority | Placement | Reason |
|---|---|---|
| P1 | P10 — Credit Score page | Highest intent; Lens already running |
| P2 | P8 — Lens Cashflow footer | Spend-Backed cohort is highest card-out rate |
| P3 | P11 — EMI Bill Due | EMI Graduate cohort: 9% CTR, 5% card-out |
| P4 | P6 — App grid tile | Permanent shelf; zero marginal effort |
| P5 | P2 — Recommended strip | Personalisation lift; needs Lens tag passed |
| P6+ | All remaining | Phase 2 |

---

## Hard rules across all placements

| Rule | Applies to |
|---|---|
| NTC long-tail never sees GC catalogue cards | All placements — routing check at API call level |
| Active Zip repayment = zero CC placements | P1–P12 suppressed for in-journey users |
| Score shown as bucket only (600/680/750/800) | P9, P10 — no raw CIBIL score displayed |
| Max 1 CC placement per screen | No stacking — single highest-priority placement wins per screen |
