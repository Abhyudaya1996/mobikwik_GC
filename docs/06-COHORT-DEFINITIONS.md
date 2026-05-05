# 06 — Cohort Definitions: Mobikwik × Great.Cards

**Version:** 1.0  
**Owner:** Abhyudaya  
**Status:** Draft — Phase 1

---

## Overview

6 cohorts. 5 route to GC catalogue. 1 routes to SBM Mobikwik First Card. Cohort assignment is real-time — derived from Mobikwik's existing data layers: Lens AA (cashflow), Zip EMI status, credit score page events, and wallet transaction history.

No new data infrastructure required. All signals already exist inside Mobikwik.

---

## Cohort 1 — FD Pledge

| Field | Detail |
|---|---|
| **Definition** | User has an active fixed deposit with Mobikwik or a Mobikwik partner bank |
| **Size (est.)** | ~1.6L of targeted MAU (~5%) |
| **Lens AA input** | Not required — FD flag is a direct product signal |
| **Bureau score** | Not required — FD-backed card needs no credit history |
| **Placement trigger** | FD product flag = true |
| **Card type routed** | Secured FD-backed card (e.g., Kotak 811, IDFC First WOW, AU Secured) |
| **CTR** | 9% |
| **Card-out rate** | 6% |
| **Revenue route** | GC |
| **Why this cohort works** | FD holder has collateral. Secured card is near-guaranteed approval. Objection "I don't have a credit history" is resolved — the FD IS the credit. |

**Lens-derived params passed to GC API:**
```
lens_tag=fd_pledge
credit_score=none_required
income_bucket=not_required
card_filter=secured_only
```

**Cards mapped:**
- Secured FD-backed cards from GC catalogue
- No unsecured cards surfaced to this cohort
- If bureau score > 700 exists alongside FD → upgrade path to unsecured surfaced in D+30 follow-up

---

## Cohort 2 — EMI Graduate (ZIP)

| Field | Detail |
|---|---|
| **Definition** | User has completed ≥3 consecutive on-time Zip EMI repayments |
| **Size (est.)** | ~3.2L of targeted MAU (~10% of 1.51M ZIP activated) |
| **Lens AA input** | Confirms cashflow stability alongside ZIP repayment history |
| **Bureau score** | Optional — EMI history alone is qualifying signal |
| **Placement trigger** | zip_repayments_ontime ≥ 3 |
| **Card type routed** | Entry-level unsecured (Axis MY Zone, SBI Cashback, HDFC Millennia) |
| **CTR** | 9% |
| **Card-out rate** | 5% |
| **Revenue route** | GC |
| **Why this cohort works** | 3 on-time EMI repayments is a demonstrated behaviour, not a score. Banks weight this highly for NTC applicants. Conversion is strong because the user already trusts EMI as a format. |

**Lens-derived params passed to GC API:**
```
lens_tag=emi_graduate
zip_repayments=3+
credit_score={bucket_if_available}
income_bucket={from_zip_loan_amount}
card_filter=entry_unsecured
```

**Cards mapped:**
- Axis MY Zone (LTF, low income threshold)
- SBI SimplyCLICK (annual fee waivable)
- HDFC Millennia (₹1L annual spend threshold)
- If score > 720 exists → HDFC Regalia First, Axis ACE surfaced

---

## Cohort 3 — Bill-Pay Regular

| Field | Detail |
|---|---|
| **Definition** | User has paid ≥2 utility bills (electricity, DTH, mobile, gas) via Mobikwik in the last 30 days |
| **Size (est.)** | ~6.4L of targeted MAU (~20%) |
| **Lens AA input** | Bill-pay pattern is a primary Lens AA cashflow signal |
| **Bureau score** | Optional — bill regularity is the qualifying behaviour |
| **Placement trigger** | utility_bill_payments_30d ≥ 2 |
| **Card type routed** | Utility cashback cards (Axis ACE, BPCL SBI, IDFC First Power) |
| **CTR** | 6% |
| **Card-out rate** | 3% |
| **Revenue route** | GC |
| **Why this cohort works** | Utility spend is locked-in recurring behaviour. Cashback card for utilities converts because the card directly offsets an existing cost — not aspirational spend. |

**Lens-derived params passed to GC API:**
```
lens_tag=bill_pay_regular
spend_category=utility
monthly_utility_spend={from_lens}
credit_score={bucket_if_available}
card_filter=cashback_utility
```

**Cards mapped:**
- Axis ACE (5% cashback on bill payments)
- BPCL SBI Octane (fuel + utility)
- IDFC First Power (utility rewards)
- If score > 700 → HDFC Regalia First (grocery + utility tier)

---

## Cohort 4 — Spend-Backed (Lens Cashflow)

| Field | Detail |
|---|---|
| **Definition** | Lens AA identifies consistent discretionary spending pattern — regular inflows + outflows indicate financial activity without formal credit history |
| **Size (est.)** | ~4.8L of targeted MAU (~15%) |
| **Lens AA input** | Primary signal — this cohort exists ONLY because of Lens |
| **Bureau score** | Often absent or thin-file — Lens cashflow is the substitute |
| **Placement trigger** | lens_cashflow_tag = spend_backed (Lens AA assigns this) |
| **Card type routed** | Spend-matched cards by category (travel, dining, groceries) |
| **CTR** | 6% |
| **Card-out rate** | 3% |
| **Revenue route** | GC |
| **Why this cohort works** | Lens AA is Mobikwik's proprietary NTC unlock. This cohort represents users banks can't see without Lens — GC's card match uses the cashflow data to select cards the user will actually get approved for and use. |

**Lens-derived params passed to GC API:**
```
lens_tag=spend_backed
top_spend_category={from_lens: travel|dining|grocery|fuel}
monthly_income_estimate={from_lens_cashflow}
credit_score={bucket_if_available}
card_filter=category_matched
```

**Cards mapped (by top spend category):**
- Travel heavy → SBI IRCTC, Axis Vistara, Air India SBI
- Dining heavy → Swiggy HDFC, Zomato RBL
- Grocery heavy → Amazon Pay ICICI, Flipkart Axis
- Fuel heavy → BPCL SBI, IndianOil Kotak

---

## Cohort 5 — Score Watcher

| Field | Detail |
|---|---|
| **Definition** | User has opened the Mobikwik Credit Score page ≥1× in the last 30 days |
| **Size (est.)** | ~4.8L of targeted MAU (~15%) |
| **Lens AA input** | Supplementary — score page view is the primary trigger |
| **Bureau score** | Available (user checked it — score exists) |
| **Placement trigger** | credit_score_page_viewed = true AND score_bucket ≥ 600 |
| **Card type routed** | Score-appropriate catalogue (filtered by approval likelihood at that bucket) |
| **CTR** | 9% |
| **Card-out rate** | 7% (highest GC cohort) |
| **Revenue route** | GC |
| **Why this cohort works** | Checking your credit score is an explicit act of credit-preparedness. This user is researching, not browsing. Highest intent of all cohorts. Score bucket allows precise eligibility filtering — user never sees a card they'd be rejected for. |

**Lens-derived params passed to GC API:**
```
lens_tag=score_watcher
credit_score={bucket: 600|680|750|800|800+}
income_bucket={from_lens_if_available}
card_filter=approval_likelihood_high
```

**Cards mapped by score bucket:**
- 600 → Axis MY Zone LTF, SBI SimplyCLICK, AU Bank Zenith Jr
- 680 → HDFC Millennia, Axis ACE, ICICI Amazon Pay
- 750 → HDFC Regalia First, Axis Magnus (entry), SBI Cashback
- 800+ → HDFC Regalia, Axis Magnus, Amex Membership Rewards

---

## Cohort 6 — Long-tail NTC

| Field | Detail |
|---|---|
| **Definition** | Registered Mobikwik user with no qualifying signal for cohorts 1–5: no FD, no ZIP history, no bill pattern, no Lens cashflow tag, no score |
| **Size (est.)** | ~11.2L of targeted MAU (~35%) |
| **Lens AA input** | Not available — insufficient transaction history |
| **Bureau score** | Absent or < 600 |
| **Placement trigger** | Absence of all cohort 1–5 flags |
| **Card type routed** | SBM Mobikwik First Card (co-brand — NOT GC catalogue) |
| **CTR** | 3% |
| **Card-out rate** | 1% |
| **Revenue route** | Mobikwik (SBM co-brand) — GC earns ₹0 |
| **Why this routing** | NTC users with no signal have low bank approval rates on open-market cards. Routing them to First Card (Mobikwik-branded, SBM-secured) protects the user experience and keeps Mobikwik's co-brand revenue intact. GC does not cannibalise this. |

**Params passed:**
```
route=first_card_mobikwik
gc_catalogue=excluded
destination=SBM_Mobikwik_First_Card_product_page
```

---

## Cohort routing decision tree

```
User enters GC placement
        │
        ├── FD active? ──────────────────────────→ Cohort 1: FD Pledge → GC secured cards
        │
        ├── ZIP on-time repayments ≥ 3? ──────────→ Cohort 2: EMI Graduate → GC unsecured
        │
        ├── Score page viewed + score ≥ 600? ────→ Cohort 5: Score Watcher → GC score-matched
        │
        ├── Lens spend_backed tag? ───────────────→ Cohort 4: Spend-Backed → GC category-matched
        │
        ├── Utility bills ≥ 2/month? ────────────→ Cohort 3: Bill-Pay Regular → GC utility cashback
        │
        └── None of the above ────────────────────→ Cohort 6: Long-tail NTC → Mobikwik First Card
```

Priority order: FD > EMI Graduate > Score Watcher > Spend-Backed > Bill-Pay > NTC  
If multiple signals present → highest-priority cohort wins.

---

## Cohort performance summary

| Cohort | MAU | CTR | Card-out | Cards/month | Revenue route |
|---|---|---|---|---|---|
| FD Pledge | 1,59,500 | 9% | 6% | 9,570 | GC |
| EMI Graduate | 3,19,000 | 9% | 5% | 15,950 | GC |
| Bill-Pay Regular | 6,38,000 | 6% | 3% | 19,140 | GC |
| Spend-Backed | 4,78,500 | 6% | 3% | 14,355 | GC |
| Score Watcher | 4,78,500 | 9% | 7% | 33,495 | GC |
| Long-tail NTC | 11,16,500 | 3% | 1% | 11,165 | First Card (MW) |
| **Total GC** | **20,73,500** | — | — | **~2,871*** | **GC** |

*2,871 cards/month is the locked Year 1 conservative funnel figure. The cohort-level card-out rates above are the theoretical upper bound if all placements are live and fully optimised. Start with the funnel figure for the pitch.

---

## Data handshake with Mobikwik (what GC needs)

| Signal | Source | Format |
|---|---|---|
| FD active flag | Mobikwik savings product DB | Boolean, passed at webview open |
| ZIP on-time count | Zip loan servicing | Integer, passed at webview open |
| Lens cashflow tag | Lens AA output | Enum: fd_pledge / emi_graduate / bill_pay_regular / spend_backed / score_watcher / ntc |
| Credit score bucket | Credit Score page event | Enum: none / 600 / 680 / 750 / 800 / 800+ |
| Utility bill count | Wallet transaction log | Integer (last 30 days), passed at webview open |

All signals passed as URL query params to GC webview. No PII. No raw scores. No names or account numbers.
