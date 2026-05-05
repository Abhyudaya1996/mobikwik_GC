# 04 — Notifications Strategy: Mobikwik × Great.Cards

**Version:** 2.0 — revised after GPT review + validation  
**Owner:** Abhyudaya  
**Status:** Active — Phase 1

---

## Core Philosophy

**Phase 1 goal:** Scheduled, cohort-specific journeys. Intent-based, psychologically sharp — but within zero-backend-change constraint.

Three shifts from v1.0:
- From "informing" → **triggering action**
- From spaced 30-day journeys → **D0–D10 burst windows** then silence
- From generic clarity → **specific personal relevance** (loss framing, earned achievement, insider access)

---

## Global Principles

1. **One arc per cohort.** No generic blasts across cohorts.
2. **Frequency cap: 4 touches / 30 days per user.** Hard stop.
3. **Channel: push-first. WhatsApp only for FD Pledge + EMI Graduate** after no-click on D+1. Expandable based on WABA consent + cost alignment with Mobikwik.
4. **In-journey = hard silence.** Zero CC notification while active Zip EMI repayment cycle.
5. **NTC: 1 touch, strict.** No GC follow-up. First Card routes sit outside this integration.
6. **No urgency manipulation.** No "offer expires tonight." No countdown timers. "Eligible right now" is factual, not urgency.
7. **No unverified statistics.** No percentage claims unless backed by actual Mobikwik post-launch data.

---

## Cohort 1 — FD Pledge

**Size:** ~3–5% of targeted MAU  
**Signal:** Active FD on file  
**Card-out rate:** 6%  
**Max touches:** 3 / 30 days  
**Strategy:** Remove fear of rejection immediately. FD = pre-approved. Convert early before intent drops.

| Day | Channel | Message |
|---|---|---|
| D+0 | Push | "You don't need a credit score for this. Your FD already qualifies you →" |
| D+1 | Push *(new)* | "No approval risk. Your FD = your limit. Takes 2 mins to activate →" |
| D+5 | WhatsApp *(if no click on D+0 or D+1)* | "Quick one — your FD-backed card is ready whenever you are. No paperwork, no checks. →" |

**Tone:** Confident, doubt-removing. FD holder is financially stable — address rejection fear directly.

**Silent days:** D+2, D+3, D+4, D+6–D+30

---

## Cohort 2 — EMI Graduate (ZIP)

**Size:** ZIP users with ≥3 consecutive on-time repayments  
**Signal:** 3rd consecutive on-time Zip EMI confirmed  
**Card-out rate:** 5%  
**Max touches:** 4 / 30 days  
**Strategy:** Capitalise on repayment momentum immediately. Effort → reward frame.

| Day | Channel | Message |
|---|---|---|
| D+0 | Push *(on 3rd repayment event)* | "You've paid 3 EMIs on time. That's exactly what banks approve →" |
| D+1 | Push *(new — critical)* | "People with your track record get approved fast. This is already open for you →" |
| D+3 | Push | "You've done the hard part — repayment. Now unlock the rewards →" |
| D+10 | WhatsApp | "You're already eligible — takes 2 mins to claim it →" |

**Tone:** Earned, confident. The card is a reward they've earned, not a product being sold.

**Silent days:** D+2, D+4–D+9, D+11–D+30

**Hard constraint:** If user returns to active EMI cycle, pause for full repayment period.

---

## Cohort 3 — Bill-Pay Regular

**Size:** ~15–20% of wallet MAU  
**Signal:** ≥2 utility bill payments via Mobikwik in last 30 days  
**Card-out rate:** 3%  
**Max touches:** 3 / 30 days  
**Strategy:** Make loss visible. User just watched money leave — that's the moment.

| Day | Channel | Message |
|---|---|---|
| D+0 *(after 2nd bill this month)* | Push | "You paid ₹{bill_amount} in bills this month. ≈₹{cashback_estimate} of that could've come back." |
| D+2 | Push *(new)* | "Same bills next month. This time — get paid for them →" |
| D+7 | Push | "≈₹{annual_cashback}/year back — based on your actual bills. Check how →" |

**Tone:** Loss-framing, specific numbers. Bill-payers respond to math, not aspiration.

**Silent days:** D+1, D+3–D+6, D+8–D+30

**Dynamic variables:** `{bill_amount}`, `{cashback_estimate}` (bill × 5%), `{annual_cashback}` — sourced from Lens cashflow. Fallback medians: ₹8,400 / ₹420 / ₹5,040.

---

## Cohort 4 — Spend-Backed (Lens Cashflow)

**Size:** Lens-tagged users with consistent discretionary spend  
**Signal:** Lens AA Spend-Backed tag  
**Card-out rate:** 3%  
**Max touches:** 3 / 30 days  
**Strategy:** Insider access frame — not surveillance. "You qualify because of how you spend."

| Day | Channel | Message |
|---|---|---|
| D+0 | Push | "Based on how you use Mobikwik, you qualify for cards most people don't →" |
| D+2 | Push *(new)* | "Most people don't realise this — your spending already unlocks premium cards →" |
| D+6 | Push | "No guesswork. These cards match your actual Mobikwik usage →" |

**Tone:** Insider advantage. Empowering, not invasive.

**Silent days:** D+1, D+3–D+5, D+7–D+30

**Note:** Removed "better cards than most users" (unverifiable comparative). Now: "cards most people don't qualify for."

---

## Cohort 5 — Score Watcher

**Size:** Users who checked credit score on Mobikwik  
**Signal:** Credit Score page viewed ≥1× in last 30 days  
**Card-out rate:** 7% — highest of GC cohorts  
**Max touches:** 4 / 30 days  
**Strategy:** Capture peak research intent. First 72 hours after score check is the conversion window.

| Day | Channel | Message |
|---|---|---|
| D+0 *(immediate after score check)* | Push | "You checked your score. Here's what you can get approved for today →" |
| D+1 | Push | "At your score bucket, these are your best approval bets right now →" |
| D+3 | Push *(new)* | "Users who apply soon after checking their score are more likely to get approved →" |
| D+7 | Push | "Your score range hasn't changed. But available cards might have →" |

**Tone:** Informational, prompt. Research-mode users want data, not pressure.

**Silent days:** D+2, D+4–D+6, D+8–D+30

**Dynamic variable:** `{score_bucket}` = bucketed (600 / 680 / 750 / 800 / 800+) — never raw CIBIL.

**Note:** Removed "40% more often" stat (unverified). Replaced with directional claim.

**Bonus trigger (H1 hook — Phase 1 compatible):** Score increases ≥20 pts → H1 Score-Unlock fires as additional push. Does not count toward 4-touch cap. Event already available from Mobikwik score-check flow.

---

## Cohort 6 — Long-tail NTC

**Size:** Largest cohort  
**Signal:** No qualifying signal for cohorts 1–5  
**Card-out rate:** 1% → SBM Mobikwik First Card  
**Max touches:** 1 / 30 days (strict — unchanged)

| Day | Channel | Message |
|---|---|---|
| D+3 | Push | "No credit history yet? Mobikwik First Card has no score requirement. It's a start →" |

**No GC follow-up. Single message only.** Additional First Card sequences (if any) are Mobikwik's remit — outside this integration. GC earns zero commission on NTC conversions.

---

## Cross-cohort suppression rules

| Condition | Action |
|---|---|
| Active Zip repayment cycle | All CC notifications paused |
| User applied (any status) | Sequence ends immediately |
| Active credit card on file | Acquisition stops; lifecycle begins (Phase 2) |
| User opts out | Permanent suppression |
| 4 CC notifications sent this month | Hard stop until next calendar month |

---

## Channel selection logic

```
First touch: always Push
No click by D+1:
    FD Pledge    → WhatsApp at D+5
    EMI Graduate → WhatsApp at D+10
    All others   → Push only
NTC: Push only. No WhatsApp.

WhatsApp expansion: requires WABA consent + cost alignment per cohort.
```

---

## 30-day arc visual summary (v2.0)

```
           D0  D1  D2  D3  D5  D6  D7  D10
FD Pledge   P   P   ○   ○   W   ○   ○   ○
EMI Grad    P   P   ○   P   ○   ○   ○   W
Bill-Pay    P   ○   P   ○   ○   ○   P   ○
Spend-Back  P   ○   P   ○   ○   P   ○   ○
Score Watch P   P   ○   P   ○   ○   P   ○
NTC         ○   ○   ○   P   ○   ○   ○   ○

P = Push    W = WhatsApp    ○ = Silent
```

---

## Phase 2 — Intent-Based Triggers (post-MVP)

*Requires GC → Mobikwik webhook integration. Not in scope for Phase 1.*

| Trigger | Condition | Message |
|---|---|---|
| **Click → No Apply** | Taps GC slot, no application within 24 hrs | "You checked your options — want to finish it in under 3 mins?" |
| **Drop at Application** | Form started, not submitted | "You're halfway done. Your eligibility is still saved →" |
| **Eligibility Seen → No Action** | Card list viewed >30s, exits without Apply tap | "You're already eligible. Just need to complete the last step →" |
| **Score Increase** | Score rises ≥20 pts | "Your score just moved up. That unlocks better cards now →" |

**Integration requirement:** GC exposes conversion event API. Mobikwik CRM subscribes to: `click`, `application_started`, `application_dropped`, `application_submitted`.

**WhatsApp at Phase 2:** Clicked/dropped users move Push → WhatsApp. Conversational tone. Requires per-cohort WABA consent.
