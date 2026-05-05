# 07 — Design System: Mobikwik × Great.Cards

**Version:** 1.0  
**Owner:** Abhyudaya  
**Status:** Draft — Phase 1  
**Source:** `stitch_design/stitch_digital_payment_wallet/financial_services_system/DESIGN.md`

---

## Philosophy

Corporate Modernism. Clarity, speed, reliability. The prototype must feel like a Mobikwik product — not a third-party overlay. Users should trust it on first look.

Primary Blue dominates. Yellow is used sparingly — only for rewards, promotions, and the single most important CTA per screen. Whitespace is generous; cognitive load during financial decisions must be low.

---

## Color tokens

### Core palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#003FA3` | Text on light surfaces, deep UI elements |
| `primary-container` | `#0055D4` | Primary buttons, active states, revenue numbers |
| `on-primary` | `#FFFFFF` | Text on primary buttons |
| `on-primary-container` | `#CCD7FF` | Text on primary-container backgrounds |
| `secondary-container` | `#F9DA00` | Accent CTA (Pay / Apply), reward badges |
| `on-secondary-container` | `#6D5F00` | Text on yellow buttons |
| `tertiary` | `#0C35BB` | Gradient depth, text hierarchy secondary |
| `tertiary-container` | `#3251D3` | Gradient end-stop on banners |
| `error` | `#BA1A1A` | Below-unit states in revenue model, hard fails |
| `on-error-container` | `#93000A` | Error text |

### Surface palette

| Token | Hex | Usage |
|---|---|---|
| `background` | `#F9F9FF` | Page background — homepage and revenue pages |
| `surface` | `#F9F9FF` | Card surfaces inside phone mock |
| `surface-container-lowest` | `#FFFFFF` | White cards, modals |
| `surface-container-low` | `#F1F3FF` | Input field backgrounds |
| `surface-container` | `#E9EDFF` | Active chip background |
| `surface-container-high` | `#E1E8FD` | Hover state on list items |
| `surface-container-highest` | `#DCE2F7` | Dividers, subtle separators |
| `on-surface` | `#141B2B` | Primary body text |
| `on-surface-variant` | `#424654` | Secondary body text, labels |
| `outline` | `#737686` | Default input borders |
| `outline-variant` | `#C3C6D7` | Inactive dividers |

### Demo page (dark panels — outside phone mock)

| Role | Hex |
|---|---|
| Panel background | `#0D1A2E` |
| Revenue numbers | `#0055D4` |
| Negative/error values | `#DC2626` |
| Muted text on dark | `#94A3B8` |

---

## Typography

All text uses **Inter**. No other typeface.

| Scale | Size | Weight | Line height | Letter spacing | Usage |
|---|---|---|---|---|---|
| `headline-xl` | 40px | 700 | 1.2 | −0.02em | Page hero (homepage problem statement) |
| `headline-lg` | 32px | 700 | 1.2 | −0.01em | Section headers |
| `headline-md` | 24px | 600 | 1.3 | — | Sub-section headers, card titles |
| `headline-sm` | 20px | 600 | 1.4 | — | Panel headers, placement names |
| `body-lg` | 18px | 400 | 1.6 | — | Primary body copy |
| `body-md` | 16px | 400 | 1.6 | — | Standard body (default) |
| `body-sm` | 14px | 400 | 1.5 | — | Supporting text, card sub-copy |
| `label-md` | 12px | 600 | 1 | +0.05em | Metadata labels, caps tags |
| `label-sm` | 11px | 500 | 1 | — | Status chips, micro-labels |

**Rules:**
- Revenue numbers: `headline-md` or larger, always in `#0055D4`
- Negative values: same size, `#DC2626`
- No mixed fonts. No system fallback fonts in the demo UI.

---

## Spacing

8px base grid. Every margin, padding, and gap is a multiple of 8.

| Token | Value | Usage |
|---|---|---|
| `xs` | 4px | Icon-to-text gap, tight chip padding |
| `sm` | 12px | Internal card padding (compact) |
| `md` | 16px | Standard internal padding, gutter |
| `lg` | 24px | Section padding, card-to-card gap |
| `xl` | 32px | Section block bottom margin |
| `container-margin` | 20px | Page side margins |

---

## Border radius

| Token | Value | Applies to |
|---|---|---|
| `sm` | 4px | Chips, status indicators (pill for full-round) |
| `DEFAULT` | 8px | Buttons, input fields |
| `md` | 12px | Small cards |
| `lg` | 16px | Main cards, modals, phone mock inner screen |
| `xl` | 24px | Bottom sheets |
| `phone-outer` | 44px (`rounded-[2.75rem]`) | Phone mock outer shell |
| `phone-inner` | 36px (`rounded-[2.25rem]`) | Phone mock inner screen |

---

## Elevation & shadows

| Level | Usage | Shadow |
|---|---|---|
| Level 0 (Flat) | Background canvas, dividers | None |
| Level 1 (Surface) | Default card state | `0px 4px 12px rgba(0, 0, 0, 0.05)` |
| Level 2 (Active/Floating) | Bottom sheets, active modals, phone mock | `0px 12px 24px rgba(0, 85, 212, 0.12)` |

---

## Components

### Buttons

| Variant | Background | Text | Radius | Padding | When to use |
|---|---|---|---|---|---|
| Primary | `#0055D4` | `#FFFFFF` | 8px | 16px vertical | Main CTA — "See the integration →", "Apply" |
| Accent | `#F9DA00` | `#111827` | 8px | 16px vertical | Single highest-priority action per screen only |
| Ghost | Transparent, 1px `#0055D4` border | `#0055D4` | 8px | 14px vertical | Secondary actions — "View History", "Learn more" |

**Rule:** Maximum one Accent button per screen. If a screen has both a Primary and an Accent, Accent wins only if it's a financial transaction action (Apply, Pay). Navigation CTAs always use Primary.

---

### Cards

Internal structure: **Header → Body → Footer** with a 1px `#DCE2F7` divider between sections.

```
┌────────────────────────────────┐  ← radius 16px, shadow Level 1
│  Header: card name + logo      │
├────────────────────────────────┤  ← 1px #DCE2F7 divider
│  Body: key benefit, cashback   │
│  estimate, approval likelihood │
├────────────────────────────────┤  ← 1px #DCE2F7 divider
│  Footer: CTA button            │
└────────────────────────────────┘
```

Background: `#FFFFFF`  
Internal padding: 16px  
Card-to-card gap: 16px

---

### Input fields

Background: `#F1F3FF`  
Default border: 1px `#737686`  
Focus border: 2px `#0055D4`  
Error border: 1px `#BA1A1A` + red sub-label  
Radius: 8px  
Padding: 12px horizontal, 14px vertical

---

### Chips (score buckets, cohort toggles, placement tabs)

Default: `#E9EDFF` background, `#424654` text  
Active: `#0055D4` background, `#FFFFFF` text  
Radius: `full` (pill) for score/cohort chips, `sm` (4px) for filter chips  
Font: `label-md` (12px, 600, +0.05em)

---

### Status indicators

| State | Color | Icon |
|---|---|---|
| Success (card approved) | `#16A34A` (green) | ✓ |
| Pending (application submitted) | `#D97706` (amber) | ⏳ |
| Failed / below unit | `#BA1A1A` (red) | ✗ |
| Silent / paused (in-journey) | `#737686` (grey) | — |

Always paired with icon — never colour alone.

---

### Lists (placements, cohorts, notifications)

- 40px circular icon prefix for each list item
- Item height: 56px minimum
- Divider: 1px `#DCE2F7` between items
- Hover state: `#E1E8FD` background
- Active/selected: `#E9EDFF` background, left border 3px `#0055D4`

---

## Phone mock shell

```css
/* Outer shell */
width: 375px;
background: #0F172A;  /* slate-900 */
border-radius: 44px;  /* rounded-[2.75rem] */
padding: 12px;
box-shadow: 0px 12px 24px rgba(0, 85, 212, 0.12);

/* Inner screen */
background: #F9F9FF;
border-radius: 36px;  /* rounded-[2.25rem] */
overflow: hidden;
min-height: 720px;

/* Notch */
width: 120px;
height: 28px;
background: #0F172A;
border-radius: 0 0 18px 18px;
margin: 0 auto;
```

---

## Page-level layout rules

### Homepage `/` and Revenue `/revenue`

```
Background: #F9F9FF
Max content width: 760px, centred
Side margins: 20px (mobile), auto (desktop)
Section spacing: 48px between blocks
No card grids. No bento. Top-to-bottom linear only.
Revenue numbers: headline-md, #0055D4
```

### Demo page `/demo`

```
Background: #0D1A2E (full page dark)
Left panel: 280px fixed, #1E293B background, 24px internal padding
Centre: phone mock, vertically centred
Right context strip: 240px, #1E293B background, 20px internal padding
Font on dark: #F1F5F9 (primary text), #94A3B8 (muted)
```

---

## Do-not-use list

| Element | Reason |
|---|---|
| Card grids / bento layouts | Breaks linear reading flow — prohibited by prototype spec |
| Drop shadows larger than Level 2 | Looks decorative, not functional |
| Yellow `#F9DA00` for more than 1 element per screen | Dilutes accent signal |
| Raw CIBIL score (e.g. "742") | Must always be shown as bucket ("750 range") |
| Countdown timers | No urgency manipulation |
| Gradients on body text | Legibility on financial data |
| Any font other than Inter | Off-brand |
