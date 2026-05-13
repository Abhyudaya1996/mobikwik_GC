# 05 — Revenue Model: Mobikwik × Great.Cards

**Version:** 2.0  
**Owner:** Abhyudaya  
**Status:** Active — Phase 1

---

## Purpose

A sequential conversion model with all assumptions visible and editable. No static claims. The demo page renders this model live — every number below is a default in the app and can be changed on screen.

---

## Industry benchmark (sanity check)

```
Paisabazaar                  ~80–100K CC / year (at scale, multi-year)
BankBazaar                   ~60–90K CC / year
Bajaj Markets                ~40–70K CC / year
Total Indian digital CC aggregator market    ~8–10 lakh / year

Mobikwik realistic share as new entrant:
  Year 1   20,000 – 25,000 cards (seasonalized)
  Year 2   40,000 – 60,000 cards
  Year 3   60,000 – 1,00,000 cards
```

Year 1 conservative output: **22,392 cards/year** (flat 12×) or **24,070 cards** (seasonalized). Sits at the lower end of the Year 1 range — deliberately conservative.

---

## Section 1 — The 6-step Sequential Funnel

Each step is an independently editable input. No derived constants hardcoded.

```
Step  Label                 Default    Output (at defaults)
────  ──────────────────    ────────   ────────────────────
  1   Total MAU             31,90,000  31,90,000
  2   Relevant Cohort       30%         9,57,000
  3   Placement Visible     65%         6,22,050
  4   Blended CTR           10%           62,205
  5   Form Completion       40%           24,882
  6   Bank Approval         7.5%           1,866  ← Cards / month
```

**Cards / year (flat):** 1,866 × 12 = **22,392**  
**Cards / year (seasonalized):** **24,070** (avg index 1.075)

### Why 10% blended CTR is defensible at conservative

The blended 10% is not applied to all MAU — it is applied to the 6.22L users who have already passed two filters (credit-eligible + placement visible). These are users on high-intent surfaces:

- EMI bill-due screen after a repayment streak: 10–15% CTR
- Bill-pay success screen (loss frame): 8–14% CTR
- Score-unlock pulse: 5–12% CTR
- Lens cashflow match: 5–10% CTR

Generic homepage tile (0.5–2%) pulls the blend down. The 10% blended figure is consistent with the cohort-level weighted average (see Section 2).

### Why 40% form completion is defensible

Placement → form is a short, personalized journey:
- Card pre-matched to user's cohort
- Income and score pre-populated from Lens / score page
- No bureau pull at this stage (eligibility displayed upfront)

40% is lower than a native app checkout (60–70%) to account for users who browse but don't commit.

---

## Section 2 — Cohort Breakdown (5 revenue cohorts)

These are **revenue model cohorts** — financial groupings for the projection. They are distinct from the 6 operational routing cohorts used in the demo (see `06-COHORT-DEFINITIONS.md`).

Relevant MAU (Step 2) = 9,57,000. All MAU%s apply to this base.

| Cohort | MAU% | CTR | Completion | Approval | Cards/mo | Comm/card | Card Type |
|---|---|---|---|---|---|---|---|
| Utility Bill Payer | 30% | 12% | 42% | 7% | 659 | ₹1,200 | Cashback utility |
| Brand Spender | 25% | 11% | 40% | 6% | 411 | ₹1,500 | Co-branded |
| Score Watcher | 15% | 14% | 45% | 9% | 529 | ₹1,800 | Score-matched |
| FD Holder | 10% | 10% | 38% | 8% | 189 | ₹1,100 | Secured FD-backed |
| Generic / No Signal | 20% | 6% | 35% | 4% | 105 | ₹900 | Entry-level LTF |
| **Blended / Total** | **100%** | **—** | **—** | **—** | **1,892** | **₹1,406** | — |

**Reconciliation:** Cohort model (1,892) vs funnel model (1,866) = **1.4% diff** (within 5% tolerance ✓).

**Blended commission: ₹1,406/card** (weighted by card volume).

### Cohort → operational routing mapping

| Revenue cohort | Operational routing cohort (06-COHORT-DEFINITIONS.md) |
|---|---|
| Utility Bill Payer | Bill-Pay Regular |
| Brand Spender | Spend-Backed (Lens Cashflow) |
| Score Watcher | Score Watcher |
| FD Holder | FD Pledge |
| Generic / No Signal | Residual (EMI Graduate thin-file + NTC with weak signal) |

Note: Long-tail NTC routed to SBM First Card is excluded from this revenue model entirely — Mobikwik earns that commission; GC earns ₹0.

---

## Section 3 — Month-on-Month Seasonality

Base: 1,866 cards/month. Multiplied by seasonality index each month.

| Month | Index | Cards | Notes |
|---|---|---|---|
| Jan | 0.85 | 1,586 | Post-Diwali slowdown |
| Feb | 0.85 | 1,586 | |
| Mar | 0.90 | 1,679 | |
| Apr | 1.20 | 2,239 | Summer travel + spend |
| May | 1.20 | 2,239 | |
| Jun | 0.80 | 1,493 | Monsoon lean ☂ |
| Jul | 0.80 | 1,493 | Monsoon lean ☂ |
| Aug | 0.90 | 1,679 | |
| Sep | 1.40 | 2,612 | Navratri / Onam |
| Oct | 1.40 | 2,612 | Dussehra |
| Nov | 1.50 | 2,799 | **Diwali peak** 🪔 |
| Dec | 1.10 | 2,053 | |
| **Full Year** | **1.075 avg** | **24,070** | |

Gross commission (seasonalized) = 24,070 × ₹1,406 = **₹3.38 Cr**

---

## Section 4 — Revenue Split Sensitivity

Fixed cost: ₹2,00,000/mo (Year 1 lean team). Variable: ₹150/card.

| Split (MW / GC) | GC Rev/card | Ops/card | GC Net/card | GC Annual Rev | GC Annual Net | Break-even cards/mo |
|---|---|---|---|---|---|---|
| 80 / 20 | ₹281 | ₹150 | ₹131 | ₹62.92L | ₹5.33L | **1,527** |
| **70 / 30** | ₹422 | ₹150 | ₹272 | ₹94.49L | ₹36.91L | **735** |
| 60 / 40 | ₹562 | ₹150 | ₹412 | ₹1.26Cr | ₹68.26L | **485** |
| 50 / 50 | ₹703 | ₹150 | ₹553 | ₹1.57Cr | ₹99.83L | **362** |

Projected cards/mo: **1,866**. All four splits are profitable (break-even < projection).

**Pitch anchor: 70/30.** GC margin 39%, net ₹36.91L/year. Mobikwik takes ₹2.20 Cr/year.

---

## GC P&L at 70/30 (Year 1 conservative)

```
Gross Revenue (GC 30% share)     ₹94.49L / year    ₹7.87L / month
Fixed Costs (team + infra)       ₹24.00L / year    ₹2.00L / month
Variable Costs (₹150 × 22,392)  ₹33.59L / year    ₹2.80L / month
──────────────────────────────────────────────────────────────────
Net Profit                       ₹36.90L / year    ₹3.07L / month
GC margin                        39%
Unit positive?                   YES ✓
```

---

## Three scenario presets

### Conservative (Year 1 default — locked in demo)

```
MAU: 31,90,000  cohort%: 30  vis%: 65  CTR: 10  comp: 40  appr: 7.5
Split: 70/30    Fixed: ₹2L/mo   Ops: ₹150/card
Cards/mo: 1,866  |  Annual gross: ₹3.15Cr  |  GC net: ₹36.9L
```

### Realistic (Year 2 — Lens coverage expands)

```
MAU: 31,90,000  cohort%: 35  vis%: 70  CTR: 11  comp: 42  appr: 8
Split: 70/30    Fixed: ₹1.75L/mo   Ops: ₹150/card
Cards/mo: ~2,680  |  Annual gross: ₹4.52Cr  |  GC net: higher
```

### Aggressive (Year 2–3 — all surfaces, full Lens, AI calling)

```
MAU: 31,90,000  cohort%: 40  vis%: 75  CTR: 12  comp: 45  appr: 9
Split: 60/40    Fixed: ₹1.5L/mo   Ops: ₹150/card
Cards/mo: ~4,112  |  Annual gross: ₹6.93Cr
```

---

## Cost structure

| Item | Year 1 | Notes |
|---|---|---|
| Team + infra (fixed) | ₹2,00,000/mo | 2 people + cloud infra. Year 1 lean. |
| Ops per card | ₹150/card | Processing, caller support, infra variable |
| Hook funding | ₹0/card | Year 1: zero-cost hooks only (H1 Score-Unlock, H4 FD-Backed) |

Zero-cost hook policy for Year 1: H1 and H4 require no payout. H2 (ZIP Graduate waiver) and H6 (Referral) introduced in Year 2 once volume justifies it.

---

## What changed from v1.0

| Item | v1.0 | v2.0 |
|---|---|---|
| Funnel architecture | Cohort × card-out rate | 6-step sequential conversion |
| Cards/month (conservative) | 2,871 | 1,866 |
| Fixed cost assumption | ₹13.5L/mo | ₹2.0L/mo (Year 1 lean) |
| Commission (blended) | ₹2,000 | ₹1,406 (cohort-weighted) |
| Annual gross (conservative) | ₹6.89Cr | ₹3.15Cr (flat) / ₹3.38Cr (seasonalized) |
| Unit positive at 70/30? | No (below unit at ₹13.5L/mo fixed) | **Yes (margin 39%)** |
| Revenue cohorts | 6 operational cohorts | 5 financial groupings |
| Seasonality | Not modelled | 12-month index (1.075 avg) |
| Split sensitivity | 3 splits, no break-even row | 4 splits + break-even cards/mo |
