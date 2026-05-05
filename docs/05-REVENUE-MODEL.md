# 05 — Revenue Model: Mobikwik × Great.Cards

**Version:** 1.0  
**Owner:** Abhyudaya  
**Status:** Draft — Phase 1

---

## Purpose

Replace every static revenue claim with a variable model. Change the inputs; the output recomputes. No "₹X Cr base / ₹Y Cr stretch" claims in the pitch — only the calculator with inputs visible.

---

## Benchmark context (sanity check before touching inputs)

```
Industry reference (reported / modelled):

Paisabazaar                  ~80–100K CC / year (at scale, multi-year)
BankBazaar                   ~60–90K CC / year
Bajaj Markets                ~40–70K CC / year
Total Indian digital CC aggregator market    ~8–10 lakh / year

Mobikwik realistic share as new entrant:
  Year 1   20,000 – 50,000 cards
  Year 2   50,000 – 1,20,000 cards
  Year 3   80,000 – 2,00,000 cards
```

Any Year 1 projection above 60K cards needs an explicit reason to justify it.

---

## MAU split across 6 cohorts

Starting MAU: **31,90,000** (conservative slice of 36M wallet MAU)

| Cohort | MAU | Basis |
|---|---|---|
| FD Pledge | 1,59,500 | ~5% of MAU — FD holders inferred from Mobikwik savings product |
| EMI Graduate (ZIP) | 3,19,000 | ~10% — ZIP activated base ~1.51M; graduates (≥3 EMIs) subset |
| Bill-Pay Regular | 6,38,000 | ~20% — recurring utility bill payers via wallet |
| Spend-Backed (Lens) | 4,78,500 | ~15% — Lens AA cashflow-tagged users |
| Score Watcher | 4,78,500 | ~15% — users who have viewed credit score in last 30 days |
| Long-tail NTC | 11,16,500 | ~35% — no qualifying signal; routes to First Card |
| **Total** | **31,90,000** | |

---

## Inputs — all editable

```
INPUT                                    Variable           Default       Range
─────────────────────────────────────    ──────────         ────────      ─────────────
MAU: FD Pledge                           M_fd               1,59,500      50K–3L
MAU: EMI Graduate                        M_emi              3,19,000      1L–6L
MAU: Bill-Pay Regular                    M_bill             6,38,000      2L–12L
MAU: Spend-Backed (Lens)                 M_lens             4,78,500      1L–8L
MAU: Score Watcher                       M_score            4,78,500      1L–8L
MAU: Long-tail NTC                       M_ntc              11,16,500     5L–20L

CTR by cohort
  FD Pledge                              CTR_fd             9%            4%–15%
  EMI Graduate                           CTR_emi            9%            4%–15%
  Bill-Pay Regular                       CTR_bill           6%            2%–10%
  Spend-Backed (Lens)                    CTR_lens           6%            2%–10%
  Score Watcher                          CTR_score          9%            4%–15%
  Long-tail NTC                          CTR_ntc            3%            1%–6%

Apply-now rate (% of clicks)             Apply_rate         25%           15%–40%

Card-out rate (% of MAU — not clicks)
  FD Pledge                              CO_fd              6%            2%–10%
  EMI Graduate                           CO_emi             5%            2%–8%
  Bill-Pay Regular                       CO_bill            3%            1%–6%
  Spend-Backed (Lens)                    CO_lens            3%            1%–6%
  Score Watcher                          CO_score           7%            3%–12%
  Long-tail NTC → First Card             CO_ntc             1%            0.5%–2%

Commission per card — GC cohorts (blended)   Comm_gc        ₹2,000        ₹1,500–₹3,000
Commission per card — First Card (NTC)       Comm_ntc       ₹0            ₹0 (Mobikwik earns; GC does not)

Revenue share
  GC share (base placements)            GC_share           30%           20%–40%
  Mobikwik share                        MW_share           70%           60%–80%

GC cost per card
  Ops + infra                           GC_fixed           ₹150          ₹100–₹250
  Hook funding per card (blended)       Hook_cost          ₹350          ₹0–₹600
```

---

## Formulas

```
Cards_monthly_gc =
    M_fd    × CO_fd
  + M_emi   × CO_emi
  + M_bill  × CO_bill
  + M_lens  × CO_lens
  + M_score × CO_score

Cards_monthly_ntc  = M_ntc × CO_ntc   [→ First Card; no GC revenue]

Cards_annual_gc    = Cards_monthly_gc × 12
Gross_revenue      = Cards_annual_gc × Comm_gc

GC_gross_revenue   = Gross_revenue × GC_share
MW_gross_revenue   = Gross_revenue × MW_share

GC_total_cost      = Cards_annual_gc × (GC_fixed + Hook_cost)
GC_net_revenue     = GC_gross_revenue − GC_total_cost

Unit_positive      = GC_net_revenue > 0
GC_margin_pct      = GC_net_revenue / GC_gross_revenue
```

---

## Three scenario presets

### Preset 1 — Conservative (Year 1, 4 placements, no hooks live)

4 placements: Credit Score page + Lens Cashflow footer + EMI Bill Due + App grid tile. No AI calling. No hooks.

```
M_fd=1,59,500     CO_fd=5%      → 7,975/mo
M_emi=3,19,000    CO_emi=4%     → 12,760/mo
M_bill=6,38,000   CO_bill=2%    → 12,760/mo  [bill only 2 placements live]
M_lens=4,78,500   CO_lens=2%    → 9,570/mo   [Lens footer only]
M_score=4,78,500  CO_score=6%   → 28,710/mo  [Score page highest performer]
────────────────────────────────────────────────────────
Cards_monthly_gc = 71,775 / 5 = [see note]
```

> **Note:** Card-out rate is applied to MAU, not a sequence; sum above is illustrative per-cohort monthly adds. Lock to a single-funnel output for the pitch.

**Single-funnel conservative output:**

```
31,90,000 MAU × 4.5% blended CTR × 25% apply × 25% bank approval
= 2,871 cards/month
= 34,452 cards/year
Gross = ₹6.89 Cr
GC 30% = ₹2.07 Cr/year
```

This is within the Year 1 benchmark range. Use this as the pitch default.

---

### Preset 2 — Realistic (Year 2, all 12 placements, 3 hooks live)

H1 Score-Unlock + H2 ZIP Graduate + H3 Wallet-to-Card deployed. All placements live.

```
Blended CTR lifts to 6% with hooks
Apply-now improves to 28%
Bank approval improves to 30% (better-matched users from Lens)

31,90,000 × 6% × 28% × 30% = 1,606 cards/month → [scaled to Year 2 MAU growth]

Assume MAU in scope grows to 45L (Year 2 wallet growth):
45,00,000 × 6% × 28% × 30% = 2,268 cards/month
= 27,216 cards/year
Gross = ₹5.44 Cr
GC 30% = ₹1.63 Cr/year [conservative — Year 2 with hooks]
```

> This looks lower than Year 1 conservative because it applies strict bank approval rate. Adjust `CO_*` inputs per actual bank data from Mobikwik.

---

### Preset 3 — Aggressive (Year 2–3, all hooks, AI calling, referral)

All 12 placements + all 6 hooks + AI calling on Score Watcher and EMI Graduate cohorts.

```
AI calling lift: +2pp card-out on Score Watcher and EMI Graduate
Referral ladder adds ~5% incremental cards from post-approval users

Conservative Year 2 base: 27,216 cards/year
+ AI calling lift (~3,000 incremental/year)
+ Referral (~1,360 incremental/year)
= ~31,576 cards/year
Gross = ₹6.32 Cr
GC 30% = ₹1.90 Cr/year [before hook costs]
GC net after hooks = depends on Hook_cost input
```

---

## Revenue split sensitivity (at Year 1 conservative: ₹6.89 Cr gross)

| Split | Mobikwik revenue | GC gross | GC cost (₹500/card) | GC net | Unit positive? |
|---|---|---|---|---|---|
| 70/30 | ₹4.82 Cr | ₹2.07 Cr | ₹1.72 Cr | **₹0.35 Cr** | Yes, thin |
| 60/40 | ₹4.13 Cr | ₹2.76 Cr | ₹1.72 Cr | **₹1.04 Cr** | Yes |
| 50/50 | ₹3.45 Cr | ₹3.45 Cr | ₹1.72 Cr | **₹1.73 Cr** | Yes |
| 80/20 | ₹5.51 Cr | ₹1.38 Cr | ₹1.72 Cr | **−₹0.34 Cr** | NO |

GC cost = ₹34,452 cards × ₹500 blended (₹150 fixed + ₹350 hook) = ₹1.72 Cr.  
80/20 only breaks even if hook cost drops to ₹0 (H3, H4, H5 only — no ZIP Graduate waiver, no referral payout).

---

## GC unit economics at 30% share (Year 1 default)

```
GC gross revenue                     ₹2.07 Cr/year
Fixed costs
  Team (PM + ops + callers)          ₹1.44 Cr/year  (₹12L/mo)
  Infra + API                        ₹0.18 Cr/year  (₹1.5L/mo)
Variable costs
  Ops / card: ₹150 × 34,452          ₹0.52 Cr/year
  Hook funding: ₹350 × 34,452        ₹1.21 Cr/year

GC total cost                        ₹3.35 Cr/year
GC net                               −₹1.28 Cr/year   [BELOW UNIT at Year 1]
```

**Year 1 is below unit at 30% share with full hook deployment.** Two paths to unit-positive:

1. **Reduce hook cost** — deploy only H4 (FD-Backed, ₹0 cost) and H1 (Score-Unlock, ₹0 cost) in Year 1. Drops hook cost to ~₹0. GC net = ₹2.07 − ₹1.62 = **+₹0.45 Cr**. Unit positive.
2. **Increase share to 40%** — GC gross = ₹2.76 Cr. Net = ₹2.76 − ₹1.62 = **+₹1.14 Cr** (hooks at ₹0 only).

**Pitch recommendation:** Open at 30% with zero-cost hooks only. Year 2 introduces paid hooks once volume justifies it.

---

## What to do with this model

```
1. Put INPUT table into a Google Sheet.
2. Add FORMULAS as a second sheet.
3. Before the meeting: lock a scenario as "pitch default" (Preset 1 — Conservative).
4. During the meeting: if Bipin pushes back on a number, change it on screen.
5. Do not present Year 2/3 numbers unless asked — lead with Year 1 conservative only.
```
