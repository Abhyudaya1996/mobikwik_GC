# Lovable Edits — What Changed & Where Placements Live

## Where placements live

Each row in the **In-App Placements** list maps to a `renderPN` function in `public/app.js`:

| Left-list label | `state.placement` ID | `renderPhone()` calls | GC slot element |
|---|---|---|---|
| Homepage – Trending Cards | 1 | `renderP1` → `renderP1_Home` | `#p1GCSlot` |
| EMI Bill Due (Zip) | 2 | `renderP11` | `#p11GCSlot` |
| Bill-Pay Success | 3 | `renderP12` | `#p12GCSlot` |
| Lens – Cashflow Match | 4 | `renderP8` | `.gc-slot-tappable` inside Lens screen |
| Credit Score – What Can I Get? | 5 | `renderP10` | `#p10GCSlot` |
| App Grid – Cards Tile | 6 | `renderP6` | `#p6CCTile` |
| All Services – Credit Cards | 7 | `renderP7` | `#p7CCEntry` |
| Push Deep-link Landing | 8 | `renderP_PushLanding` | `#pushHero` |

All GC slots carry the `.gc-slot-tappable` CSS class which adds `:hover` lift. Fire-day chips in the Notification Simulator use `.arc-cell.fire` (blue bg) vs silent days (dim).

## Changes made by Lovable (this session)

### `public/app.js`
- **`renderP1_Home`** — restructured top→bottom to match Media 13: mwTopBar → IPL hero (230px gradient, yellow ₹15L headline, Apply Now pill, 🏏 silhouettes, stadium glows) → white quick-pay card → EMI Bill Due → lower app grid → GC slot (last). Added `↗ TAP` badge on GC slot.
- **`renderP7`** — added `↗ TAP` badge on the highlighted Credit Cards row (`#p7CCEntry`).
- **`renderP11`** — added `↗ TAP` badge on `#p11GCSlot`.
- **`renderP12`** — added `↗ TAP` badge on `#p12GCSlot`.
- **`renderLeftList`** — added hint chip above placement list: *"Tap any placement, then tap the yellow ↗ TAP tile inside the phone"*. Updated day-row chips to distinguish fire days (blue, bold) from silent days (dim).
- **`mwTopBar`** — real MobiKwik header chrome: robot avatar + red `1` badge, Balance: ₹0 ▼, UPI ID, search, trophy.
- **`mwBottomNavReal`** — real bottom nav: Home / All Services / scan FAB / History / Loans.

### `public/styles.css`
- Added `.gc-slot-tappable` — `:hover` lift (`translateY(-1px)`) transition.
- Added `.arc-cell`, `.arc-cell.fire` — notification day chip states.
- Added `.day-fire-dot` — yellow dot indicator on fire-day chips.

## Still out of scope (deferred)
- Revenue page unification / redesign
- P4 Lens screen full rebuild to match Media 20 (partially done)
