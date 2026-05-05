# 03 — Marketing Hooks: Mobikwik × Great.Cards

**Version:** 1.0  
**Owner:** Abhyudaya  
**Status:** Draft — Phase 1

---

## Principles

All hooks are written for Mobikwik's NTC-heavy base. The primary barrier is not awareness — it is belief that the user can actually get approved. Every hook resolves that barrier first before introducing the card.

Rules:
- No hook mentions "credit card" in the headline. The benefit lands first.
- No hook requires an existing credit history to feel relevant.
- Each hook has a single trigger condition (not "when user is active").
- Hooks H4 and H5 require no bureau pull — designed for pure NTC.

---

## H1 — Score-Unlock

**Concept:** Score improves → a new card tier is "unlocked" and revealed with a celebration moment. Gamifies credit building without making it feel like a financial product.

**Trigger:** User's Mobikwik credit score increases by ≥20 points since last check.

**Cohort:** Score Watcher

**Where it fires:** Credit Score page, push notification

**In-app experience:**
```
[Score doughnut animates up]

"Your score just crossed 720."

3 cards appear below, previously greyed out — now lit up:
  ├── Card A — "Unlocked: HDFC MoneyBack+"
  ├── Card B — "Unlocked: Axis ACE"
  └── Card C — "Unlocked: SBI SimplyCLICK"

CTA: "See what changed →"
```

**Push notification copy:**
> Your Mobikwik score hit 720. Three cards you couldn't get last month? You can now.

**Why it works:** Score improvement is an emotional win. Timing the card reveal to that exact moment converts curiosity into application intent.

**Cost per card:** ₹0 (no incentive needed — reveal itself is the hook)  
**Expected CTR lift:** +3–4pp vs unprompted placement

---

## H2 — ZIP Graduate

**Concept:** After a user completes repayment of a Zip EMI on time, they receive a "credit graduation" moment — positioned as having earned something, not been sold to.

**Trigger:** 3rd consecutive on-time EMI repayment on Zip.

**Cohort:** EMI Graduate (ZIP)

**Where it fires:** EMI Bill Due screen (post-payment confirmation) + push

**In-app experience:**
```
[Payment confirmation screen]

"₹{amount} paid. On time, again."

Below payment receipt:
"3 in a row. Banks look at exactly this.

Here's what you've earned access to →"

[2 LTF cards, approval-likelihood badge on each]
```

**Push notification copy (D+0 after 3rd payment):**
> You've paid 3 Zip EMIs on time. That track record counts. Here's the card it unlocks.

**Why it works:** Repayment confirmation is peak financial confidence. User just acted responsibly; framing the card as a reward (not a sell) matches that emotional state.

**Cost per card:** ₹0 for base placement; optional ₹200 co-fund for first-EMI waiver upgrade  
**Expected card-out lift:** +2pp vs unprompted (EMI Graduate cohort baseline: 5%)

---

## H3 — Wallet-to-Card

**Concept:** A user who regularly loads and spends from their Mobikwik wallet is shown a card that does the same job — but pays them cashback. Framing: you're already spending this way; this card just gives you something back.

**Trigger:** User has ≥3 wallet load + spend transactions in a 30-day window (Bill-Pay Regular or Spend-Backed cohort from Lens).

**Cohort:** Bill-Pay Regular, Spend-Backed

**Where it fires:** Home — Recommended strip, Lens Cashflow footer

**In-app experience:**
```
[Lens cashflow screen]

"You spent ₹{X} on bills last month via Mobikwik."

Below cashflow bar:
"This card pays ₹{cashback_estimate} back on exactly what you already spend.
No new habits. Just the card behind the wallet."

[1 cashback card, spend-matched]

CTA: "See how it calculates →"
```

**Push notification copy:**
> Last month you spent ₹{X} on bills. That exact pattern earns ₹{cashback}/year on this card.

**Why it works:** Anchors the card to existing behaviour — zero behavioural change required. Cashback estimate is computed from Lens cashflow data, so it's specific to that user.

**Cost per card:** ₹0 (data-driven, no incentive needed)  
**Expected CTR lift:** +2pp (personalised estimate vs generic cashback claim)

---

## H4 — FD-Backed First Step

**Concept:** For users with a Mobikwik FD (or who are shown FD options), a secured card is positioned as "your FD, working harder" — not as a last resort but as a smart financial move.

**Trigger:** User has a Mobikwik/partner FD active OR user has been shown FD offers in the last 30 days.

**Cohort:** FD Pledge

**Where it fires:** Credit Score page (for users with score < 650 or no score), Credit & Loans section

**In-app experience:**
```
[Credit Score page — score < 650 or "No score yet"]

"No credit history yet? That's fine.

Your FD can become your credit card limit.
No bureau score needed. No hard inquiry.
The bank holds your FD; you get a card with the same limit."

[1 secured card — FD-backed]

CTA: "See how it works →"
```

**Push notification copy:**
> Your FD isn't just savings. It can become a credit card — instantly approved, no score required.

**Why it works:** Removes the #1 NTC rejection fear (bureau pull + rejection). Reframes the FD the user already has as an asset that unlocks credit. No financial identity required.

**Cost per card:** ₹0 (no incentive; FD-backed = bank's secured product)  
**Expected card-out:** 6% (highest of all cohorts — no approval risk)

---

## H5 — Bill-Pay Cashback Boost

**Concept:** A user who pays recurring utility bills (electricity, DTH, mobile) through Mobikwik is shown the specific rupee amount they're "leaving behind" each month by not using a cashback card. Loss-framing at transaction moment.

**Trigger:** Recharge or bill-pay transaction completed; user has ≥2 bill payments in last 30 days.

**Cohort:** Bill-Pay Regular

**Where it fires:** Recharge / Bill-Pay confirmation screen

**In-app experience:**
```
[Post-bill-pay success screen]

"₹{bill_amount} paid ✓

Every month you pay this, you're leaving ₹{cashback_estimate} on the table.
That's ₹{annual_cashback} a year — uncollected."

[1 utility cashback card]

CTA: "Stop leaving it behind →"
```

**Push notification (D+1 after bill payment):**
> You paid your electricity bill. A card for exactly this would have returned ₹{X} on that transaction.

**Why it works:** Loss-framing converts better than gain-framing at a payment moment. The amount is specific (not "up to X%") because it's calculated from the actual bill amount just paid.

**Cost per card:** ₹0  
**Expected CTR lift:** +1.5pp vs generic cashback placement

---

## H6 — Referral Ladder

**Concept:** Refer friends to apply for a card via Mobikwik. Each successful card issued by a referral earns the referrer a Mobikwik wallet credit. Designed as a ladder — more referrals unlock higher reward tiers.

**Trigger:** User has successfully applied for or been approved for a card via GC webview.

**Cohort:** All approved users (post-card-out)

**Where it fires:** Post-application confirmation screen + push

**In-app experience:**
```
[Post-application screen]

"Application submitted. While you wait —

Refer a friend and earn:
  1 friend applies   →  ₹200 wallet credit
  2 friends apply    →  ₹500 total
  3 friends apply    →  ₹1,000 total + unlock {premium_card_name}

Your referral link: [Copy link]"
```

**Push notification (D+1 after application):**
> Know someone who'd want their first credit card? Refer them — you get ₹200 in your Mobikwik wallet when they apply.

**Why it works:** Post-application moment is high satisfaction. User is not yet in card-use mode but is engaged. Wallet credit as reward is native to Mobikwik — no external payout friction.

**Cost per card (referral):** ₹200–₹333 blended (3-tier ladder / 3 referral applications)  
**Expected referral card-out:** 1.5–2% of approved base (conservative)

---

## Hook summary table

| Hook | Cohort | Trigger | Cost/card | CTR lift | Card-out |
|---|---|---|---|---|---|
| H1 Score-Unlock | Score Watcher | +20pt score increase | ₹0 | +3–4pp | 7% |
| H2 ZIP Graduate | EMI Graduate | 3rd on-time EMI | ₹0–₹200 | — | 5% |
| H3 Wallet-to-Card | Bill-Pay / Spend-Backed | ≥3 wallet transactions | ₹0 | +2pp | 3% |
| H4 FD-Backed First Step | FD Pledge | FD active or shown | ₹0 | — | 6% |
| H5 Bill-Pay Cashback Boost | Bill-Pay Regular | Bill payment complete | ₹0 | +1.5pp | 3% |
| H6 Referral Ladder | All post-approval | Post-application | ₹200–₹333 | — | 1.5–2% |

---

## What is explicitly not used here

- **EMI-on-us** (first EMI paid by GC) — evaluated and deprioritised for Year 1. Cost at Mobikwik scale is too high to run without co-funding commitment. Can be reintroduced if Mobikwik agrees to co-fund H2.
- **Play & Win** (coin-game unlock) — Mobikwik does not have a native gamification layer equivalent to Fibe's reward games. Deprioritised unless MobiKwik confirms a game mechanic exists.
- Score-degradation warnings — ethically adjacent to debt-anxiety marketing. Not used.
