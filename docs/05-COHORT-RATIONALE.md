# 05 — Cohort Rationale: Mobikwik × Great.Cards

**Version:** 1.0  
**Owner:** Abhyudaya  
**Status:** Active — Phase 1

---

## Why cohorts at all

Generic CC placements fail on a base like Mobikwik's. The population spans users with 800+ bureau scores and users with no credit history at all. A single card recommendation optimised for the average gets rejected by both ends — too risky for the bank on the NTC side, too basic for the scored user on the other.

Lens AA already creates behavioural tags. Zip EMI already records repayment events. The credit score page captures explicit bureau-check intent. These are live signals inside the Mobikwik stack — they don't require any new data collection.

The six cohorts below convert those existing signals into routing decisions: which card, which message frame, how many touches, and when to stop.

---

## Cohort 1 — FD Pledge

### Who they are
Users who hold an active Fixed Deposit on the Mobikwik/partner FD product. Size: approximately 3–5% of targeted MAU.

### The signal
An active FD on file. This is not inferred — it is a direct data point from the FD product itself.

### Why this predicts credit readiness
FD-backed secured cards require no bureau score. The deposit becomes the credit limit — approval is near-certain as long as the user holds the FD. Rejection risk, which kills conversion for NTC users elsewhere, is structurally absent here.

These users are also financially stable by definition. They have surplus capital parked in a savings instrument. They are not distressed; they just haven't crossed into credit yet.

### Card routing
Secured cards: IDFC WOW, AU Altura, SBI Unnati. The FD is the collateral — the card limit equals the FD amount. No bureau pull required at discovery stage.

### Messaging frame
**Doubt removal.** The single biggest barrier for this cohort is fear of rejection or paperwork. Every message removes that fear directly: "Your FD already qualifies you." "No approval risk." "No paperwork." This is not aspirational copy — it is factual reassurance targeted at the one objection that blocks conversion.

### Notification arc
- D+0 Push: Immediate qualification message
- D+1 Push: Reinforce zero-risk angle
- D+5 WhatsApp (if no click): Softer reminder, conversational

3 touches maximum. WhatsApp triggered only on D+5 after no click, requiring WABA consent.

### Card-out rate
**6%** — highest of all cohorts outside Score Watcher. Near-certain approval eliminates the biggest conversion drop-off (fear of rejection before applying).

### Key constraints
- Requires active FD on file (live signal from FD product). If FD closes, cohort tag drops.
- No bureau pull at discovery. Eligibility communicated before any application event.

---

## Cohort 2 — EMI Graduate (ZIP)

### Who they are
Zip EMI users who have made 3 or more consecutive on-time repayments. These are users who have already demonstrated the core behaviour banks look for in CC approval: disciplined, scheduled repayment.

### The signal
The 3rd consecutive on-time Zip EMI event, fired from the Zip repayment engine. This is a precise, event-driven trigger — not a periodic scan.

### Why this predicts credit readiness
Repayment history is the single largest driver of credit score movement and bank approval decisions. A user who has completed 3 consecutive on-time EMIs has demonstrated:

1. They borrow responsibly (they took Zip, not a desperation product)
2. They repay on schedule (3-in-a-row is not accidental)
3. Their cashflow supports the commitment (they had the money on the due date, three times)

Many of these users may not have a bureau score yet or may have a thin file. The Zip repayment track record is the substitute bureau signal — banks issuing LTF or entry-level cards will take it.

### Card routing
Lifetime-free cards with lower income/score floors: Axis ACE, Amazon Pay ICICI, IDFC First Classic. Cards that are accessible to thin-file users who demonstrate repayment discipline. Not premium cards — the match is calibrated to where approval is realistic.

### Messaging frame
**Earned reward.** The card is framed as something they have earned through their own behaviour — not a product being sold to them. "You've done the hard part — repayment. Now unlock the rewards." This is psychologically distinct from a generic CC pitch. The user feels they are claiming something owed to them, not being upsold.

The streak is named explicitly ("3 in a row", "a streak of 3") because it makes the abstract repayment record concrete and personal.

### Notification arc
- D+0 Push: On the 3rd repayment event — peak momentum
- D+1 Push: Reinforce approval likelihood ("People with your track record get approved fast")
- D+3 Push: Effort → reward bridge
- D+10 WhatsApp: Final claim message if no conversion

4 touches — the largest allowance of any cohort, justified by the high intent signal.

### Card-out rate
**5%**. High but below FD Pledge because approval still requires score/income gate for most cards — thin-file users may not clear all banks.

### Key constraints
- **Hard silence during active repayment.** If the user re-enters an active Zip EMI cycle (new purchase before the existing one closes), all CC notifications pause. Debt-stacking signal is a compliance and product risk.
- The trigger is event-based, not date-based. The notification sequence starts on repayment confirmation, not on a calendar schedule.

---

## Cohort 3 — Bill-Pay Regular

### Who they are
Users who have paid 2 or more utility bills via Mobikwik in the last 30 days. Size: 15–20% of wallet MAU — the largest eligible cohort in volume terms.

### The signal
Lens cashflow data showing recurring utility bill payments (electricity, gas, broadband, DTH). Two payments in 30 days establishes the pattern is regular, not one-off.

### Why this predicts credit readiness
Bill-pay regulars have two things that make them good CC candidates:

1. **Regular, predictable cash outflows.** They pay on time, every month, for fixed amounts. This is the same cashflow discipline banks want to see.
2. **An obvious and specific use case for a cashback card.** A user who pays ₹8,400/month in bills and learns that a card would return ₹420 of that — every month — has a quantifiable, personal reason to apply. The benefit is not abstract.

Crucially, these users are already spending the money. A cashback card does not change their behaviour — it just makes their existing behaviour pay them back. That is a very easy sell.

### Card routing
Cashback cards optimised for bill payments and utility spend: Axis ACE (5% on bill payments via Axis app), SBI SimplyCLICK (utility rewards). Cards where the cashback structure directly matches the user's actual spend pattern.

### Messaging frame
**Loss framing.** The user just watched money leave their account. "You paid ₹2,400. This card would have returned ₹120 of that." The number is specific, personal, and based on their actual payment — not a generic estimate. The message arrives immediately after the bill-pay confirmation, at the exact moment the loss is salient.

D+2 and D+7 messages maintain the math angle: "Same bills next month. This time — get paid for them." The loss frame does not need to escalate — it just needs to stay concrete.

### Notification arc
- D+0 Push: Immediately after 2nd bill payment — loss frame with specific amounts
- D+2 Push: Forward-looking version of the same frame
- D+7 Push: Annual savings calculation

3 touches. Push only — bill-pay users tend to be pragmatic; WhatsApp is not warranted unless Phase 2 data shows otherwise.

### Card-out rate
**3%**. Lower than FD Pledge and EMI Grad because the population is broad and heterogeneous — the cashflow signal is strong but the credit readiness signal is less specific. Some will have score barriers.

### Key constraints
- Dynamic copy requires `{bill_amount}` and `{cashback_estimate}` from Lens cashflow. Fallback medians (₹8,400 / ₹420) used if Lens data is unavailable.
- The D+0 trigger fires after the 2nd bill this month, not the 1st. One bill payment could be coincidental; two establishes a pattern.

---

## Cohort 4 — Spend-Backed (Lens Cashflow)

### Who they are
Users tagged by Lens AA as having consistent discretionary spend patterns — online shopping, dining, travel, fuel — that map cleanly to cashback or rewards card categories. These are wallet-active users whose spend behaviour signals they would benefit from and use a rewards card.

### The signal
Lens AA Spend-Backed tag. This requires Lens to have processed AA data for the user — the cohort is only available for users who have completed the Account Aggregator consent flow.

### Why this predicts credit readiness
The Spend-Backed cohort is not primarily a credit readiness signal — it is a **product-fit signal**. These users spend in categories where credit cards offer meaningful rewards. The pitch is not "you can get a credit card" — it is "you already spend in a way that makes this card worth having."

That said, Lens-tagged users tend to have higher income and more stable cashflow than the NTC base, which correlates with better approval odds at mid-tier cards.

### Card routing
Category-matched: Amazon Pay ICICI for online shoppers, Axis ACE for utility/dining, premium rewards cards (HDFC Millennia, SBI SimplyCLICK) for higher-income Spend-Backed users. The matching algorithm uses spend category breakdown from Lens to select the card with the highest estimated annual cashback for that user's specific mix.

### Messaging frame
**Insider access.** Not "here is a credit card" but "your specific spend pattern qualifies you for cards most people don't." This respects the user's intelligence and avoids the surveillance-adjacent framing of "we know what you spend on."

The angle is empowering: the user's behaviour is an asset that gives them access to something valuable. The card is a reward for how they already live, not a product being pushed.

### Notification arc
- D+0 Push: Access frame ("qualify for cards most people don't")
- D+2 Push: Reinforce the insight angle
- D+6 Push: Data-grounded close ("these cards match your actual usage")

3 touches. Push only. No urgency — the Spend-Backed user is not responding to a time-sensitive event; they are in a steady state.

### Card-out rate
**3%**. Comparable to Bill-Pay. The product fit is strong but the cohort is filtered by Lens consent, which reduces its size and may skew toward users who are more privacy-aware and therefore more deliberate in their decision-making.

### Key constraints
- Requires Lens AA consent to be active. Users who have not completed the consent flow do not get a Spend-Backed tag — they fall to Score Watcher or generic if eligible.
- No comparative claims ("better cards than most users") — unverifiable. Copy says "cards most people don't qualify for."

---

## Cohort 5 — Score Watcher

### Who they are
Users who have viewed the Credit Score page on Mobikwik at least once in the last 30 days. Size varies but covers any user actively monitoring their bureau score — the highest explicit credit intent signal in the app.

### The signal
Credit Score page view event. This is a zero-inference trigger: the user has voluntarily opened the score page. There is no interpretation required.

### Why this predicts credit readiness
A user checking their credit score is, by definition, in a credit-research mindset. They are asking "where do I stand?" — which is immediately adjacent to "what can I get?" The gap between checking a score and applying for a card is the shortest of any user journey on the platform.

Score Watcher is not a demographic cohort — it is a behavioural intent cohort. The user's score could be 600 or 800; the signal that matters is the act of checking.

The card catalogue is score-filtered, so a 600-score user sees entry/secured cards, a 750-score user sees mainstream LTF and cashback cards, and an 800+ user sees premium options. The cohort routing does the heavy lifting; the notification just needs to capture the moment.

### Card routing
Dynamic, score-filtered. The full eligible catalogue from the BankKaro API filtered by the user's score bucket. Per-card approval likelihood bars displayed (88% / 82% / 74% / 65% illustrative — live data from API in production). The card list shown to a 680-score user is entirely different from what a 750-score user sees.

### Messaging frame
**Informational capture.** Research-mode users want data, not pressure. "Here's what you can get approved for today" is a direct answer to the question they just asked themselves by opening the score page. No aspiration, no urgency — just the answer to "what does my score unlock?"

D+3 includes the directional claim "users who apply soon after checking their score are more likely to get approved" — this is a behavioural nudge, not a false urgency tactic, and is directionally supported by intent-to-apply literature.

The H1 Score-Unlock hook fires as a bonus trigger if the user's score increases 20+ points. This does not count toward the 4-touch cap — it is event-driven, not schedule-driven.

### Notification arc
- D+0 Push: Immediate capture ("You checked your score. Here's what you can get today")
- D+1 Push: Best-match framing ("your best approval bets right now")
- D+3 Push: Behavioural nudge
- D+7 Push: Re-engagement ("available cards might have changed")

4 touches — same as EMI Graduate, justified by the highest intent signal of any cohort.

### Card-out rate
**7%** — highest of GC cohorts. Explicit intent + personalised card matching + real-time score filtering combine to produce the strongest conversion rate. The user already knows their score; showing them what it unlocks removes the remaining uncertainty.

### Key constraints
- Score is passed as a bucket (600 / 680 / 750 / 800), never raw CIBIL. Zero PII.
- The D+0 trigger must fire within minutes of the score-check event, not on a batch schedule. Peak intent is extremely time-sensitive — a 24-hour delay is too late.
- The "40% more often" stat was removed in v2.0. Directional claim only until Mobikwik post-launch data is available.

---

## Cohort 6 — Long-Tail NTC

### Who they are
Users who do not qualify for any of cohorts 1–5. No bureau score, no Lens AA tag, no Zip EMI history, no qualifying bill-pay pattern, no score-check event. This is the largest cohort by raw headcount — the majority of Mobikwik's NTC and thin-file base.

### The signal
Absence of all other qualifying signals. This is a residual routing decision, not a positive intent trigger.

### Why this cohort is different — and why it is handled differently

NTC users are not ready for GC's mainstream catalogue. The issue is not desire — it is approval. Sending an NTC user into the GC card list produces hard rejections, which harms both the user (score impact if hard pull is triggered downstream) and Mobikwik (churn from a failed CC experience).

The cannibalisation firewall exists specifically for this cohort: NTC users route to **SBM Mobikwik First Card**, not GC. This is not a downgrade — the First Card is the correct product for this population. No score required. No bureau pull. Mobikwik keeps 100% of the commission on First Card conversions; GC earns nothing and does not attempt to.

### Card routing
SBM Mobikwik First Card only. GC catalogue is excluded. This is a hard route — no fallback to GC cards regardless of the user's in-app behaviour.

### Messaging frame
**Zero pressure.** One message. "No credit history yet? Mobikwik First Card has no score requirement. It's a start →" The tone is factual and non-judgmental. The word "start" is intentional — it acknowledges where the user is without shame and positions First Card as a legitimate first step in a credit journey.

No follow-up. No WhatsApp. One touch, hard stop.

### Notification arc
- D+3 Push: Single message only

The D+3 delay (vs D+0 for other cohorts) is intentional — NTC users have no time-sensitive intent trigger. A 3-day delay reduces the sense of being watched.

### Card-out rate
**1%** → to First Card. GC earns zero commission on these conversions. The figure is tracked separately from GC cohort performance.

### Key constraints
- **Strict single-touch.** One push, no follow-up, ever. Additional First Card nurturing sequences (if any) are Mobikwik's remit — outside this integration entirely.
- Any GC card placements are suppressed. The NTC screen shown in the demo explicitly labels this: "NTC users routed to First Card only. GC catalogue excluded. Mobikwik keeps 100% of commission." This framing is intentional in the pitch — it makes the GC integration non-threatening to Mobikwik's co-brand revenue.
- If a user later achieves a qualifying signal (checks credit score, gets a Zip EMI streak, etc.), they move to the appropriate cohort and GC routing applies. NTC is not a permanent designation.

---

## Cross-cohort priority and suppression

When a user qualifies for multiple cohorts simultaneously (e.g., a Zip EMI graduate who also checks their credit score), routing follows this priority:

1. **EMI Graduate** — event-based, time-sensitive, highest earned-reward signal
2. **FD Pledge** — near-certain approval, high card-out rate
3. **Score Watcher** — explicit intent signal
4. **Bill-Pay** — recurring spend pattern
5. **Spend-Backed** — Lens-derived, lower immediacy
6. **NTC** — residual only

A user in EMI Graduate who also checks their score gets the EMI Graduate sequence. Score Watcher is suppressed for that 30-day window.

**Hard suppressions (override all routing):**

| Condition | Action |
|---|---|
| Active Zip repayment cycle | All CC placements and notifications paused |
| User applied (any status) | Sequence ends immediately for that cohort |
| Active credit card on file | Acquisition stops; lifecycle begins (Phase 2) |
| User opts out | Permanent suppression across all cohorts |
| 4 CC notifications sent this month | Hard stop until next calendar month |

---

## Cohort summary table

| Cohort | Signal | Card type | Frame | Card-out | Touches | WhatsApp |
|---|---|---|---|---|---|---|
| FD Pledge | Active FD on file | Secured (FD-backed) | Doubt removal | 6% | 3 | D+5 if no click |
| EMI Graduate | 3rd on-time Zip EMI | LTF, entry-level | Earned reward | 5% | 4 | D+10 if no click |
| Bill-Pay | ≥2 bills / 30 days | Cashback on bills | Loss framing | 3% | 3 | No |
| Spend-Backed | Lens AA tag | Category-matched rewards | Insider access | 3% | 3 | No |
| Score Watcher | Score page view | Score-filtered full catalogue | Intent capture | 7% | 4 | No |
| NTC | No qualifying signal | SBM First Card only | Zero-pressure start | 1% | 1 | No |
