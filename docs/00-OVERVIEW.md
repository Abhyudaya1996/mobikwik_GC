# 00 — Overview: Mobikwik × Great.Cards

**Version:** 1.0  
**Owner:** Abhyudaya  
**Status:** Draft — Phase 1

---

## The thesis

Mobikwik has 186.6M registered users, 36M wallet MAU, and a FinancialServices layer (Zip EMI, Credit Score, Lens AA) already embedded in the app. The base is overwhelmingly NTC or thin-file — people who want credit but can't get it from a bank directly.

No credit card aggregator is live on Mobikwik today. That is a greenfield opportunity.

Great.Cards goes in as the credit graduation engine:
- Lens AA tags users by cashflow quality, not bureau score alone
- Cohort-matched placements surface cards users can actually get approved for
- Long-tail NTC routes to SBM Mobikwik First Card (no cannibalization of GC commission yield)
- Score-ready and EMI-graduate cohorts route to GC's full card catalogue

---

## Why Mobikwik, why now

| Signal | What it tells us |
|---|---|
| Zip EMI: 1.51M activated | These users have demonstrated repayment behaviour — EMI graduates are prime CC candidates |
| Pre-approved: 34.4M | Bureau pull already done. Eligibility overlay is fast |
| Lens AA live | Cashflow-based cohort tagging without bureau inquiry — uniquely valuable for NTC |
| Credit Score page in-app | Explicit intent signal. Users watching their score want to know what it unlocks |
| No CC aggregator today | Zero shelf competition. First mover owns the placement real estate |
| FY25 FS revenue: ₹402Cr | Mobikwik already monetizes the credit intent — GC extends it without new infra |

---

## What we are NOT doing

- Not touching Mobikwik's lending book
- Not sharing PII — bucketed score + rounded income only, passed as query params
- Not rebuilding anything on Mobikwik's backend — webview overlay + 3 BankKaro API calls
- Not competing with SBM Mobikwik First Card — NTC routes there, scored cohorts route to GC

---

## The cannibalisation firewall

```
User lands on a GC placement
        │
        ├── Has bureau score OR Lens cashflow tag → GC catalogue
        │
        └── Long-tail NTC (no score, no cashflow signal) → SBM Mobikwik First Card
                (Mobikwik keeps 100% of that commission; GC does not touch it)
```

This makes the pitch non-threatening: Bipin sees GC as additive to First Card, not a substitution risk.

---

## Integration architecture

```
Mobikwik app (existing)
        │
        ├── Lens AA cohort tag → passed as query param to GC webview
        ├── Credit score bucket → passed as query param
        ├── Zip EMI status → cohort flag
        │
        └── GC webview (BankKaro Partner API — same as Fibe build)
                ├── /cards          → filtered catalogue
                ├── /eligibility    → pre-screen without hard pull
                └── /calculate      → commission + savings display
```

2-week sprint. No Mobikwik backend changes. Webview opens in-app browser.

---

## Year 1 locked funnel

| Metric | Monthly | Yearly |
|---|---|---|
| MAU in scope | 31,90,000 | — |
| Blended CTR | 4–5% | — |
| Apply-now | 25% of clicks | — |
| Card-out | 3–4% of MAU | — |
| **Cards issued** | **2,871** | **34,452** |
| Gross commission (₹2,000 blended) | ₹0.57Cr | ₹6.89Cr |
| GC share (30%) | ₹0.17Cr | **₹2.07Cr** |

---

## Constraints that do not change

| Constraint | Rationale |
|---|---|
| Zero hard bureau pull at discovery | NTC users fear score drops — eligibility shown before any pull |
| NTC → First Card only | Keeps Mobikwik co-brand revenue intact; avoids approval failures on GC cards |
| Lens cohort tag required for Spend-Backed routing | No tag = no placement in that cohort; user falls to generic recommendation |
| In-journey users (active Zip repayment) | Zero CC placements during active EMI — avoids debt-stacking signal |
