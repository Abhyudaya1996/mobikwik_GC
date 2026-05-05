// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  route: '/',
  score: '750',
  income: 65000,
  zip: 'Graduated',
  lens: 'Score Watcher',
  tab: 'placements',
  placement: 1,
  cohort: 'Score Watcher',
  day: 0,
  hook: 'H1',
  hookOverride: null,   // when set, P-renderers swap GC slot headline with this copy
  bankMap: {},
  bankLogoMap: {},
  initCards: [],
  initLoaded: false,
};

// ─── Constants ────────────────────────────────────────────────────────────────
const lensTags    = ['FD Pledge', 'EMI Grad', 'Bill-Pay', 'Spend-Backed', 'Score Watcher', 'NTC'];
const scoreBuckets = ['No score', '600', '680', '750', '800'];
const zipStatuses  = ['Active', 'Graduated', 'Never used'];

const SECURED_ALIASES = ['step-up-credit-card', 'insta-easy-credit-card', 'au-altura-credit-card'];
const PREMIUM_ALIASES  = [
  'hdfc-regalia-gold-credit-card', 'axis-magnus-credit-card',
  'amex-platinum-travel-credit-card', 'sbi-elite-credit-card', 'hdfc-millennia-credit-card'
];

const PLACEMENTS = [
  {
    id: 1, name: 'Homepage – Trending Cards',
    surface: 'Pulsing GC tile inside MobiKwik home feed → 4-step matched-cards funnel',
    n: 4, filter: { popular: true },
    commentary: {
      title: 'Placement 1 · Homepage Trending row',
      steps: [
        'Scroll the phone past the blue header and Wallet balance card.',
        'Past the quick-action grid (Scan / Bills / Recharge / Cards…), look for the <span class="cm-pulse">✨ POWERED BY GREAT.CARDS</span> tile sitting below "Trending offers".',
        'Tap it — pick 2-3 spend categories, drag the ₹ sliders per category, and 3 matched cards appear.',
        'Flip the credit-score pill in the bar above the phone — eligibility and matched cards update live.',
      ],
    },
  },
  {
    id: 2, name: 'EMI Bill Due (Zip) – Earned Access',
    surface: 'Post-3rd-EMI repayment screen → "earned" credit card unlock',
    n: 2, filter: { ltf: true },
    commentary: {
      title: 'Placement 2 · Zip Graduate earned-access',
      steps: [
        'User has just paid their 3rd Zip EMI on time. The phone shows the post-payment confirmation.',
        'The blue "<span class="cm-pulse">Good job! You\'re on a streak of 3. Banks notice this.</span>" banner is the GC slot. The cards below are reachable specifically because of this repayment track record.',
        'Switch <b>Zip status</b> in the top bar to <b>Active</b> — the placement is fully suppressed (cannibalisation firewall — no CC during active repayment).',
        'Switch Lens to <b>NTC</b> — routes to SBM MobiKwik First Card, GC catalogue excluded.',
      ],
    },
  },
  {
    id: 3, name: 'Bill-Pay Success – Loss Frame',
    surface: 'Post-recharge / bill-pay confirmation screen → loss-frame cashback pitch',
    n: 1, filter: { popular: true },
    commentary: {
      title: 'Placement 3 · Bill-pay loss frame',
      steps: [
        'User just paid a ₹2,400 electricity bill. Confirmation is the green "Bill Paid Successfully" banner.',
        'Below the success state, the yellow <span class="cm-pulse">YOU JUST PAID ₹2,400</span> tile is the GC slot — exact loss frame: "this card would have returned ₹120 of that".',
        'This is the highest-intent moment in the app — user just felt money leave.',
        'Card shown is filtered by score / income from the top bar.',
      ],
    },
  },
  {
    id: 4, name: 'Lens – Cashflow Match',
    surface: 'Lens AA cashflow summary → card matched to spend pattern',
    n: 2, filter: { match: true },
    commentary: {
      title: 'Placement 4 · Lens cashflow match',
      steps: [
        'User is on the Lens AA page — MobiKwik\'s cashflow analyser.',
        'Above the chart: monthly inflow + score bucket. Bars show 7-month spend pattern.',
        'The blue <span class="cm-pulse">LENS MATCH</span> tile below the chart is the GC slot — card recommendation framed as "matched to your cashflow", not pushed.',
        'Change <b>Lens cohort tag</b> in the top bar — the matched card recomputes (FD Pledge sees different cards than Spend-Backed).',
      ],
    },
  },
  {
    id: 5, name: 'Credit Score – What Can I Get?',
    surface: 'Credit score page → per-card approval likelihood bars',
    n: 4, filter: { match: true },
    commentary: {
      title: 'Placement 5 · Credit Score "What can I get"',
      steps: [
        'User just checked their score. The blue <span class="cm-pulse">At your score range of 750</span> hero is the entry point.',
        'Each card below has a green approval likelihood bar (88% / 82% / 74% / 65%).',
        'This is maximum credit intent in the app — user is already reading their bureau score.',
        'Switch <b>Credit score</b> chips above the phone → cards and likelihood bars update live.',
      ],
    },
  },
  {
    id: 6, name: 'App Grid – Cards Tile',
    surface: 'Home quick-action grid → Credit Cards tile permanently highlighted',
    n: 4, filter: { ltf: true },
    commentary: {
      title: 'Placement 6 · App grid CC tile',
      steps: [
        'The 8-icon quick-action grid is on every Mobikwik home session — permanent shelf presence.',
        'The <span class="cm-pulse">Credit Cards</span> tile (4th icon) sits at filled-blue with a glow shadow — a permanent slot, not a banner.',
        'Tapping it lands directly on the score-filtered card list shown below the grid.',
        'Cohort-aware: NTC users see this tile route to SBM First Card, not GC.',
      ],
    },
  },
  {
    id: 7, name: 'All Services – Credit Cards',
    surface: 'Services list → Credit Cards entry expands to score-filtered catalogue',
    n: 3, filter: { popular: true },
    commentary: {
      title: 'Placement 7 · All Services entry',
      steps: [
        'User is browsing the All Services page — high financial-product intent.',
        'The blue-bordered <span class="cm-pulse">Credit Cards</span> row says "<b>X matched →</b>" using a live count from your filter.',
        'Tap it — the panel expands to show the score-filtered catalogue inline (no full-screen jump).',
        'Other services (Wallet, Zip, FD, Loans, Insurance) are untouched — CC slot is purely additive.',
      ],
    },
  },
  {
    id: 8, name: 'Push Deep-link Landing',
    surface: 'Notification deep-link → contextual single-card landing',
    n: 1, filter: { popular: true },
    commentary: {
      title: 'Placement 8 · Push deep-link landing',
      steps: [
        'User tapped a notification — e.g. "Your score crossed 720, here\'s what unlocks". This is where they land.',
        'The dark <span class="cm-pulse">FROM YOUR NOTIFICATION</span> hero references the exact trigger that fired the push.',
        'A single hero card occupies the screen — no list, no choice fatigue. Apply or back.',
        'Switch <b>Lens cohort</b> above to see how the same mechanic fires for FD Pledge, EMI Grad, Bill-Pay etc.',
      ],
    },
  },
];

const hooks = {
  H1: { title: 'Score-Unlock',       trigger: 'Score improves 20+ pts',                 cost: '₹0',       lift: '+3-4pp CTR',             surface: 'Credit Score page',         renderFn: 'P10', copy: 'Your score just crossed 720. Three cards you couldn\'t get last month are now live.' },
  H2: { title: 'ZIP Graduate',       trigger: '3rd consecutive on-time EMI',             cost: '₹0–200',   lift: '+2pp card-out',           surface: 'Zip EMI post-repayment',    renderFn: 'P11', copy: '3 in a row. Banks look at exactly this. Here\'s what you\'ve earned access to.' },
  H3: { title: 'Wallet-to-Card',     trigger: '3 wallet load + spend txns / 30d',        cost: '₹0',       lift: '+2pp CTR',                surface: 'Homepage trending feed',    renderFn: 'P1',  copy: 'This card pays back on exactly what you already spend through Mobikwik.' },
  H4: { title: 'FD-Backed First Step', trigger: 'FD active or FD offer seen recently',  cost: '₹0',       lift: '6% card-out',             surface: 'Lens cashflow summary',     renderFn: 'P8',  copy: 'Your FD can become your credit card limit. No score needed.' },
  H5: { title: 'Bill-Pay Cashback',  trigger: 'Recurring bill payment completed',        cost: '₹0',       lift: '+1.5pp CTR',              surface: 'Bill-pay success screen',   renderFn: 'P12', copy: 'Every month you pay this bill, this card could return cashback.' },
  H6: { title: 'Referral Ladder',    trigger: 'Post card application',                   cost: '₹200–333', lift: '1.5-2% referral card-out', surface: 'Post-apply confirmation',  renderFn: 'Referral', copy: 'Refer a friend and earn Mobikwik wallet credit when they apply.' },
};

const notifications = {
  'FD Pledge': {
    days: {
      0: ['Push',      "You don't need a credit score for this. Your FD already qualifies you →"],
      1: ['Push',      "No approval risk. Your FD = your limit. Takes 2 mins to activate →"],
      5: ['WhatsApp',  "Quick one — your FD-backed card is ready whenever you are. No paperwork, no checks. →"],
    },
    tone: 'Confident, doubt-removing', cap: '3 / 30 days',
  },
  'EMI Grad': {
    days: {
      0:  ['Push',     "You've paid 3 EMIs on time. That's exactly what banks approve →"],
      1:  ['Push',     "People with your track record get approved fast. This is already open for you →"],
      3:  ['Push',     "You've done the hard part — repayment. Now unlock the rewards →"],
      10: ['WhatsApp', "You're already eligible — takes 2 mins to claim it →"],
    },
    tone: 'Earned, confident', cap: '4 / 30 days',
  },
  'Bill-Pay': {
    days: {
      0: ['Push', "You paid ₹8,400 in bills this month. ≈₹420 of that could've come back."],
      2: ['Push', "Same bills next month. This time — get paid for them →"],
      7: ['Push', "≈₹5,040/year back — based on your actual bills. Check how →"],
    },
    tone: 'Loss-framing, specific numbers', cap: '3 / 30 days',
  },
  'Spend-Backed': {
    days: {
      0: ['Push', "Based on how you use Mobikwik, you qualify for cards most people don't →"],
      2: ['Push', "Most people don't realise this — your spending already unlocks premium cards →"],
      6: ['Push', "No guesswork. These cards match your actual Mobikwik usage →"],
    },
    tone: 'Insider advantage, empowering', cap: '3 / 30 days',
  },
  'Score Watcher': {
    days: {
      0: ['Push', "You checked your score. Here's what you can get approved for today →"],
      1: ['Push', "At your score bucket, these are your best approval bets right now →"],
      3: ['Push', "Users who apply soon after checking their score are more likely to get approved →"],
      7: ['Push', "Your score range hasn't changed. But available cards might have →"],
    },
    tone: 'Peak-intent capture', cap: '4 / 30 days',
  },
  'NTC': {
    days: {
      3: ['Push', "No credit history yet? Mobikwik First Card has no score requirement. It's a start →"],
    },
    tone: 'Zero-pressure', cap: '1 / 30 days',
  },
};

const revenue = {
  mau: 3190000, see: 35, click: 4.5, apply: 25,
  approval: 22.8, commission: 2000, split: 30,
  team: 1200000, infra: 150000, caller: 150, ops: 100, hook: 0,
};

// ─── P1 funnel state ──────────────────────────────────────────────────────────
let p1State = { step: 0, cats: [], spendByCat: {} };
const SPEND_CATEGORIES = [
  { k: 'online',   label: 'Online shopping', icon: '🛍️', q: 'Monthly online shopping?',    rate: 0.03, defaultSpend: 8000 },
  { k: 'fuel',     label: 'Fuel',            icon: '⛽', q: 'Monthly fuel spend?',           rate: 0.015, defaultSpend: 5000 },
  { k: 'dining',   label: 'Dining & food',   icon: '🍽️', q: 'Monthly dining & delivery?',   rate: 0.05, defaultSpend: 4000 },
  { k: 'travel',   label: 'Travel',          icon: '✈️', q: 'Monthly travel spend?',         rate: 0.04, defaultSpend: 6000 },
  { k: 'grocery',  label: 'Groceries',       icon: '🛒', q: 'Monthly grocery spend?',        rate: 0.03, defaultSpend: 7000 },
  { k: 'bills',    label: 'Utility bills',   icon: '💡', q: 'Monthly utility bills?',        rate: 0.05, defaultSpend: 5000 },
];

// ─── Utilities ────────────────────────────────────────────────────────────────
function fmt(n) { return Number(Math.round(n)).toLocaleString('en-IN'); }
function money(n) {
  const cr = n / 10000000;
  if (Math.abs(cr) >= 1) return `₹${cr.toFixed(2)} Cr`;
  return `₹${(n / 100000).toFixed(2)} L`;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function ensureStyle(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
function bucketScore(s) {
  if (s === 'No score') return 0;
  return parseFloat(s) || 0;
}
function roundIncome(n) { return Math.ceil(n / 10000) * 10000; }

// ─── Init bundle ──────────────────────────────────────────────────────────────
async function loadInitBundle() {
  if (state.initLoaded) return;
  try {
    const res  = await fetch('/api/init');
    const json = await res.json();
    const inner = json?.data?.data || json?.data || {};
    (inner.bank_data || []).forEach(b => {
      state.bankMap[b.id]     = b.name;
      state.bankLogoMap[b.id] = b.logo || null;
    });
    state.initCards  = inner.card_data || [];
    state.initLoaded = true;
    console.log('[Init] Bundle loaded ✓', state.initCards.length, 'cards');
  } catch (e) {
    console.warn('[Init] Could not load init bundle:', e.message);
  }
}

function normalizeCard(raw) {
  if (!raw) return null;
  const alias      = raw.seo_card_alias || raw.card_alias || raw.alias || '';
  const name       = (raw.name || raw.card_name || 'Credit Card').trim();
  const bankId     = raw.bank_id;
  const bank       = bankId ? (state.bankMap[bankId] || '') : (raw.bank_name || '');
  const joiningFee = parseFloat(raw.joining_fee || 0);
  const annualFee  = parseFloat(raw.annual_fee  || 0);
  const isLTF      = joiningFee === 0 && annualFee === 0;
  const usp        = (raw.product_usps || [])[0];
  const uspText    = usp ? ((usp.header || '') + ' ' + (usp.description || '')).trim() : '';
  const minIncome  = parseFloat(raw.income || 0);
  const minScore   = parseFloat(raw.crif   || 0);
  return { alias, name, bank, bankId, isLTF, joiningFee, annualFee, uspText, minIncome, minScore };
}

function filterInitCards(placement) {
  const f     = placement.filter || {};
  const score  = bucketScore(state.score);
  const income = roundIncome(state.income);
  let cards    = (state.initCards || []).slice();

  // Score + income gates
  cards = cards.filter(c =>
    (parseFloat(c.crif   || 0) <= score  || score  === 0) &&
    (parseFloat(c.income || 0) <= income)
  );

  if (f.ltf) {
    cards = cards.filter(c =>
      parseFloat(c.joining_fee || 0) === 0 && parseFloat(c.annual_fee || 0) === 0
    );
  }
  if (f.secured) {
    const s   = cards.filter(c => SECURED_ALIASES.includes(c.seo_card_alias));
    const need = (placement.n || 4) - s.length;
    if (need > 0) {
      const pad = cards.filter(c => !s.includes(c) && parseFloat(c.joining_fee || 0) === 0).slice(0, need);
      cards = [...s, ...pad];
    } else {
      cards = s;
    }
  }
  if (f.premium) {
    let p = cards.filter(c => PREMIUM_ALIASES.includes(c.seo_card_alias));
    if (!p.length) p = cards.filter(c => parseFloat(c.annual_fee || 0) >= 500);
    cards = p;
  }
  cards = cards.sort((a, b) => parseFloat(a.priority || 99) - parseFloat(b.priority || 99));
  return cards.slice(0, placement.n).map(normalizeCard).filter(Boolean);
}

// Fallback cards for when API hasn't loaded yet
const FALLBACK_CARDS = [
  { alias: 'axis-ace', name: 'Axis ACE Credit Card',   bank: 'Axis Bank',    bankId: 5,  isLTF: true,  joiningFee: 0,   annualFee: 0,   uspText: '5% cashback on bill payments', minIncome: 15000, minScore: 700 },
  { alias: 'hdfc-mill', name: 'HDFC Millennia',         bank: 'HDFC Bank',    bankId: 2,  isLTF: false, joiningFee: 1000,annualFee: 1000, uspText: 'Cashback on Amazon Flipkart',  minIncome: 35000, minScore: 700 },
  { alias: 'sbi-click', name: 'SBI SimplyCLICK',        bank: 'SBI Card',     bankId: 3,  isLTF: false, joiningFee: 499, annualFee: 499,  uspText: 'eVoucher on joining Amazon',   minIncome: 20000, minScore: 650 },
  { alias: 'ap-icici',  name: 'Amazon Pay ICICI',       bank: 'ICICI Bank',   bankId: 4,  isLTF: true,  joiningFee: 0,   annualFee: 0,   uspText: '5% back on Amazon Prime',      minIncome: 25000, minScore: 650 },
  { alias: 'idfc-wow',  name: 'IDFC First WOW',         bank: 'IDFC FIRST',   bankId: 7,  isLTF: true,  joiningFee: 0,   annualFee: 0,   uspText: 'FD-backed secured card',       minIncome: 0,     minScore: 0 },
  { alias: 'rbl-bank',  name: 'RBL Bank Zomato Edition',bank: 'RBL Bank',     bankId: 9,  isLTF: true,  joiningFee: 0,   annualFee: 0,   uspText: '10% back on Zomato orders',    minIncome: 20000, minScore: 650 },
].map(c => ({ ...c }));

function getCards(placement) {
  if (state.initLoaded && state.initCards.length) return filterInitCards(placement);
  // Fallback: filter by score/income from hardcoded set
  const score = bucketScore(state.score);
  let cards = FALLBACK_CARDS.filter(c =>
    (c.minScore <= score || score === 0) && c.minIncome <= state.income
  );
  if ((placement.filter || {}).ltf)  cards = cards.filter(c => c.isLTF);
  return cards.slice(0, placement.n);
}

// ─── Card rendering ───────────────────────────────────────────────────────────
function cardGradient(c) {
  const palettes = [
    ['#7c3aed','#4f46e5'], ['#1e40af','#1e3a8a'], ['#be123c','#881337'],
    ['#c2410c','#9a3412'], ['#0e7490','#0891b2'], ['#047857','#065f46'],
    ['#a16207','#713f12'], ['#9d174d','#500724'], ['#0f766e','#134e4a'],
    ['#6b21a8','#3b0764'], ['#003FA3','#0055D4'], ['#1f2937','#111827'],
  ];
  const i = (c.bankId || 0) % palettes.length;
  return `linear-gradient(135deg,${palettes[i][0]},${palettes[i][1]})`;
}

function shortCardName(n) {
  if (!n) return '';
  return String(n).replace(/\s+Credit Card$/i, '').trim();
}

function cardCategory(c) {
  const txt = ((c.uspText || '') + ' ' + (c.name || '')).toLowerCase();
  if (/travel|airline|flight|lounge|miles/.test(txt)) return 'Travel';
  if (/fuel|iocl|hpcl|bpcl|indianoil/.test(txt))      return 'Fuel';
  if (/amazon|flipkart|online|shopping/.test(txt))    return 'Shopping';
  if (/dining|swiggy|zomato|food/.test(txt))          return 'Dining';
  if (/premium|reward|platinum|gold|elite|signature/.test(txt)) return 'Premium';
  if (/fd|secured|fixed deposit/.test(txt))           return 'Secured';
  return 'Cashback';
}

function renderCardFace(c, opts = {}) {
  const bankLogo = state.bankLogoMap[c.bankId];
  const grad = cardGradient(c);
  const size = opts.size || 'sm';
  const dims = { sm: [60, 40], md: [110, 68], lg: [150, 95] }[size];
  const logoH = size === 'sm' ? 10 : size === 'md' ? 16 : 20;
  const logoW = size === 'sm' ? 36 : size === 'md' ? 56 : 72;
  return `
    <div style="width:${dims[0]}px;height:${dims[1]}px;border-radius:8px;background:${grad};position:relative;overflow:hidden;flex-shrink:0;box-shadow:0 2px 6px rgba(0,0,0,0.15)">
      <div style="position:absolute;inset:0;background:radial-gradient(circle at 20% 120%,rgba(255,255,255,0.18),transparent 55%),radial-gradient(circle at 110% -10%,rgba(255,255,255,0.22),transparent 60%)"></div>
      ${bankLogo ? `<img src="${bankLogo}" style="position:absolute;top:5px;left:6px;height:${logoH}px;max-width:${logoW}px;object-fit:contain;background:#fff;border-radius:2px;padding:1px 3px" onerror="this.style.display='none'">` : `<div style="position:absolute;top:5px;left:6px;font-size:${size==='sm'?8:10}px;font-weight:800;color:rgba(255,255,255,0.75);letter-spacing:0.05em;text-transform:uppercase">${esc((c.bank||'').split(' ')[0])}</div>`}
      ${size !== 'sm' ? `<div style="position:absolute;bottom:${size==='md'?22:28}px;left:${size==='md'?8:12}px;color:rgba(255,255,255,0.7);font-size:${size==='md'?8:10}px;letter-spacing:0.14em;font-family:monospace">•••• ${4000+(c.bankId||0)}</div>` : ''}
      <div style="position:absolute;bottom:${size==='sm'?4:6}px;left:${size==='sm'?5:8}px;right:${size==='sm'?5:8}px;color:#fff;font-size:${size==='sm'?7:size==='md'?9:11}px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.name||'')}</div>
    </div>`;
}

function renderCardTile(c, opts = {}) {
  const feeTag = c.isLTF
    ? `<span style="display:inline-block;font-size:9px;font-weight:800;color:#007048;background:#00704815;padding:2px 7px;border-radius:4px;letter-spacing:0.04em;text-transform:uppercase;margin-top:4px">Lifetime Free</span>`
    : `<div style="font-size:10px;color:#64748b;margin-top:3px">₹${fmt(c.joiningFee)} joining${c.annualFee > 0 ? ' · ₹'+fmt(c.annualFee)+' annual' : ''}</div>`;
  const cat = cardCategory(c);
  const applyBtn = opts.noApply ? '' : `<button style="flex-shrink:0;margin-top:6px;background:#0055D4;color:#fff;font-size:10px;font-weight:800;padding:7px 11px;border-radius:7px;border:none;cursor:pointer;white-space:nowrap">Apply →</button>`;
  return `
    <div style="display:flex;gap:14px;align-items:flex-start;padding:14px;background:#fff;border-radius:14px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,0.05)">
      ${renderCardFace(c, { size: 'md' })}
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;font-size:14px;color:#141B2B;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(shortCardName(c.name))}</div>
        <div style="font-size:11px;color:#64748b;font-weight:500;margin-top:2px">${esc(cat)} · ${esc(c.bank||'')}</div>
        ${feeTag}
        ${opts.savings ? `<div style="font-size:11px;color:#0055D4;font-weight:700;margin-top:4px">Saves ₹${fmt(opts.savings)}/yr</div>` : ''}
        ${applyBtn}
      </div>
    </div>`;
}

// ─── Mobikwik phone chrome ────────────────────────────────────────────────────
function mwStatusBar() {
  return `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 18px 0;font-size:11px;font-weight:600;color:#fff;opacity:0.9;background:transparent">
    <span>9:41</span>
    <span style="display:flex;gap:4px;align-items:center">
      <span class="material-symbols-outlined" style="font-size:12px">signal_cellular_alt</span>
      <span class="material-symbols-outlined" style="font-size:12px">wifi</span>
      <span class="material-symbols-outlined" style="font-size:12px">battery_5_bar</span>
    </span>
  </div>`;
}

function mwHeader(opts = {}) {
  const scoreLabel = state.score === 'No score' ? 'No score' : state.score + ' ↑';
  if (opts.back) {
    return `<div style="background:${opts.bg||'#0055D4'};color:#fff;padding:0 0 14px">
      ${mwStatusBar()}
      <div style="display:flex;align-items:center;gap:10px;padding:10px 16px 0">
        <span class="material-symbols-outlined" style="font-size:22px;cursor:pointer" id="mwBack">arrow_back</span>
        <div style="font-weight:800;font-size:16px">${esc(opts.title||'')}</div>
      </div>
    </div>`;
  }
  return `<div style="background:#0055D4;color:#fff;padding:0 0 18px">
    ${mwStatusBar()}
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px 0">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,0.22);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px">M</div>
        <div>
          <div style="font-size:11px;opacity:0.8">Good morning</div>
          <div style="font-size:14px;font-weight:800">MobiKwik</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span style="font-size:11px;background:rgba(255,255,255,0.18);border-radius:99px;padding:4px 12px;font-weight:700">${esc(scoreLabel)}</span>
        <span class="material-symbols-outlined" style="font-size:20px;opacity:0.9">notifications</span>
      </div>
    </div>
    <div style="margin:14px 16px 0;background:rgba(255,255,255,0.14);border-radius:14px;padding:14px 16px">
      <div style="font-size:11px;opacity:0.8">Wallet Balance</div>
      <div style="font-size:26px;font-weight:800;margin:2px 0">₹12,480</div>
      <div style="display:flex;gap:12px;margin-top:8px">
        <span style="font-size:10px;opacity:0.8;font-weight:600">+ Add Money</span>
        <span style="font-size:10px;opacity:0.8;font-weight:600">⟳ History</span>
        <span style="font-size:10px;opacity:0.8;font-weight:600">↗ Send</span>
      </div>
    </div>
  </div>`;
}

function mwQuickGrid() {
  const items = [
    { icon: 'qr_code_scanner', label: 'Scan & Pay' },
    { icon: 'receipt_long',    label: 'Pay Bills'  },
    { icon: 'sim_card',        label: 'Recharge'   },
    { icon: 'credit_card',     label: 'Cards'      },
    { icon: 'currency_rupee',  label: 'Send Money' },
    { icon: 'savings',         label: 'FD'         },
    { icon: 'local_offer',     label: 'Offers'     },
    { icon: 'more_horiz',      label: 'More'       },
  ];
  return `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:14px 12px;background:#fff;border-radius:16px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
    ${items.map(it => `<div style="display:flex;flex-direction:column;align-items:center;gap:5px;padding:8px 0;cursor:pointer">
      <div style="width:38px;height:38px;border-radius:12px;background:#EEF2FF;display:flex;align-items:center;justify-content:center">
        <span class="material-symbols-outlined" style="font-size:20px;color:#0055D4">${it.icon}</span>
      </div>
      <span style="font-size:9.5px;font-weight:600;color:#424654;text-align:center;line-height:1.2">${it.label}</span>
    </div>`).join('')}
  </div>`;
}

function mwBottomNav(active = 'home') {
  const tabs = [
    { k: 'home',    label: 'Home',    icon: 'home'           },
    { k: 'pay',     label: 'Pay',     icon: 'account_balance_wallet' },
    { k: 'zip',     label: 'ZIP',     icon: 'credit_score'   },
    { k: 'profile', label: 'Profile', icon: 'account_circle' },
  ];
  return `<div style="position:absolute;inset:auto 0 0;height:60px;display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-top:1px solid #E9EDFF;z-index:5">
    ${tabs.map(t => `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer">
      <span class="material-symbols-outlined" style="font-size:20px;color:${t.k===active?'#0055D4':'#94A3B8'}">${t.icon}</span>
      <span style="font-size:9px;font-weight:700;color:${t.k===active?'#0055D4':'#94A3B8'}">${t.label}</span>
    </div>`).join('')}
  </div>`;
}

function mwSectionTitle(title) {
  return `<div style="font-size:14px;font-weight:800;color:#141B2B;margin:16px 0 10px">${esc(title)}</div>`;
}

// ─── Placement screen renderers ───────────────────────────────────────────────

// ─── Real MobiKwik chrome (matches actual app screenshots) ────────────────────
function mwTopBar(opts = {}) {
  // Real MobiKwik header: avatar(badge) + Balance: ₹0 ▼ + UPI ID + search + trophy
  const back = opts.back;
  return `<div style="background:#0055D4;color:#fff;padding:0 0 14px;flex-shrink:0">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px 0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.9)">
      <span>9:41</span>
      <span style="display:flex;gap:4px;align-items:center">
        <span class="material-symbols-outlined" style="font-size:12px">signal_cellular_alt</span>
        <span class="material-symbols-outlined" style="font-size:12px">wifi</span>
        <span class="material-symbols-outlined" style="font-size:12px">battery_5_bar</span>
      </span>
    </div>
    ${back ? `
      <div style="display:flex;align-items:center;gap:14px;padding:14px 16px 0">
        <span class="material-symbols-outlined" style="font-size:24px;cursor:pointer" id="mwBack">arrow_back</span>
        <div style="font-weight:800;font-size:16px">${esc(opts.title||'')}</div>
      </div>
    ` : `
      <div style="display:flex;align-items:flex-start;justify-content:space-between;padding:14px 16px 0;gap:10px">
        <div style="display:flex;align-items:flex-start;gap:10px;min-width:0;flex:1">
          <div style="position:relative;flex-shrink:0">
            <div style="width:34px;height:34px;border-radius:50%;background:#7DD3FC;display:flex;align-items:center;justify-content:center;font-size:18px">🤖</div>
            <div style="position:absolute;top:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:#DC2626;color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;border:1.5px solid #0055D4">1</div>
          </div>
          <div style="min-width:0;flex:1">
            <div style="display:flex;align-items:center;gap:4px;font-size:14px;font-weight:700">Balance: ₹0 <span class="material-symbols-outlined" style="font-size:14px">expand_more</span></div>
            <div style="font-size:11px;opacity:0.85;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">UPI ID: 8299207828@mbkns</div>
          </div>
        </div>
        <div style="display:flex;gap:14px;align-items:center;flex-shrink:0">
          <span class="material-symbols-outlined" style="font-size:22px">search</span>
          <span style="font-size:18px">🏆</span>
        </div>
      </div>
    `}
  </div>`;
}

function mwBottomNavReal(active = 'home') {
  // Real MobiKwik bottom nav: Home / All Services / [scan FAB] / History / Loans
  const t = (k, label, icon) => `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer">
    <span class="material-symbols-outlined" style="font-size:22px;color:${k===active?'#0055D4':'#6B7280'};font-variation-settings:${k===active?"'FILL' 1":"'FILL' 0"}">${icon}</span>
    <span style="font-size:10px;font-weight:${k===active?800:600};color:${k===active?'#0055D4':'#6B7280'}">${label}</span>
  </div>`;
  return `<div style="position:absolute;inset:auto 0 0;height:64px;background:#fff;border-top:1px solid #E5E7EB;display:grid;grid-template-columns:1fr 1fr 70px 1fr 1fr;align-items:center;z-index:5">
    ${t('home','Home','home')}${t('services','All Services','apps')}
    <div style="display:flex;justify-content:center;align-items:flex-start;height:100%;position:relative">
      <div style="position:absolute;top:-14px;width:50px;height:50px;border-radius:50%;background:#0055D4;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,85,212,0.4)">
        <span class="material-symbols-outlined" style="font-size:26px;color:#fff">qr_code_scanner</span>
      </div>
    </div>
    ${t('history','History','history')}${t('loans','Loans','storefront')}
  </div>`;
}

// Click-through: GC catalogue screen — opens when any GC slot is tapped
function renderGCCatalogue(phone, cards, opts = {}) {
  phone.innerHTML = `
    <div style="height:100%;background:#F9F9FF;display:flex;flex-direction:column;overflow:hidden">
      ${mwTopBar({ back: true, title: opts.title || 'Credit Cards' })}
      <div style="flex:1;overflow-y:auto;padding:16px 14px 80px">
        <div style="background:linear-gradient(135deg,#0055D4,#0C35BB);border-radius:14px;padding:14px 16px;color:#fff;margin-bottom:14px">
          <div style="font-size:8px;font-weight:500;letter-spacing:0.05em;opacity:0.55;margin-bottom:6px">Powered by Great.Cards</div>
          <div style="font-size:14px;font-weight:800;line-height:1.35;margin-bottom:6px">${esc(opts.subtitle || `${cards.length} cards matched to your profile`)}</div>
          <div style="font-size:11px;opacity:0.85">Score ${esc(state.score)} · Income ₹${fmt(state.income)} · ${esc(state.lens)}</div>
        </div>
        ${cards.length ? cards.map(c => renderCardTile(c)).join('') : '<div style="color:#64748b;text-align:center;padding:30px;font-size:13px">No cards matched. Adjust the controls above.</div>'}
        <div style="text-align:center;font-size:10px;color:#94A3B8;padding:14px 0">Secure webview · Zero PII passed · 30-second decision</div>
      </div>
      ${mwBottomNavReal()}
    </div>`;
  const back = document.getElementById('mwBack');
  if (back) back.addEventListener('click', () => {
    state.placementClicked = false;
    renderPhone();
  });
}

// P1: Homepage – Trending Cards (real MobiKwik homepage matching Media 13)
function renderP1(phone, cards) {
  // If user clicked the GC slot → show 4-step funnel
  if (state.placementClicked) {
    if (p1State.step === 0) p1State.step = 1;
    if (p1State.step === 1) renderP1_Step1(phone);
    else if (p1State.step === 2) renderP1_Step2(phone);
    else if (p1State.step === 3) renderP1_Step3(phone);
    else if (p1State.step === 4) renderP1_Step4(phone, cards);
    return;
  }
  // Default: real MobiKwik homepage with GC slot
  renderP1_Home(phone, cards);
}

function renderP1_Home(phone, cards) {
  phone.innerHTML = `
    <div style="height:100%;background:#0055D4;display:flex;flex-direction:column;overflow:hidden">
      ${mwTopBar()}
      <div style="flex:1;overflow-y:auto;padding:0 0 80px;background:#0055D4">
        <!-- IPL hero — full bleed, dark stadium gradient, fireworks, players, big yellow headline -->
        <div style="position:relative;height:230px;color:#fff;overflow:hidden;background:
            radial-gradient(ellipse 60% 80% at 50% 100%, #1E1B4B 0%, #1E40AF 45%, #0055D4 75%);">
          <!-- stadium light glow -->
          <div style="position:absolute;left:0;bottom:0;width:120px;height:160px;background:radial-gradient(ellipse at bottom left, rgba(255,255,255,0.35), transparent 60%)"></div>
          <div style="position:absolute;right:0;bottom:0;width:120px;height:160px;background:radial-gradient(ellipse at bottom right, rgba(255,255,255,0.35), transparent 60%)"></div>
          <!-- fireworks (CSS sparkle dots) -->
          <div style="position:absolute;top:18px;left:24px;font-size:18px;color:#FCD34D;text-shadow:0 0 6px #FCD34D">✦ ✦</div>
          <div style="position:absolute;top:34px;left:60px;font-size:11px;color:#FCD34D;opacity:0.9">· ✦ ·</div>
          <div style="position:absolute;top:18px;right:24px;font-size:18px;color:#FCD34D;text-shadow:0 0 6px #FCD34D">✦ ✦</div>
          <div style="position:absolute;top:34px;right:60px;font-size:11px;color:#FCD34D;opacity:0.9">· ✦ ·</div>
          <!-- headline -->
          <div style="position:absolute;top:14px;left:0;right:0;text-align:center;z-index:3">
            <div style="font-size:30px;font-weight:900;color:#FCD34D;font-style:italic;letter-spacing:-0.5px;line-height:1.05;text-shadow:0 2px 6px rgba(0,0,0,0.3)">Up to ₹15 Lakh<span style="font-size:14px;vertical-align:super">*</span></div>
            <button style="margin-top:14px;background:#fff;color:#1F2937;font-weight:800;font-size:15px;padding:11px 32px;border-radius:99px;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.25)">Apply Now</button>
          </div>
          <!-- "players" silhouette row — emoji approximation -->
          <div style="position:absolute;bottom:0;left:0;right:0;height:96px;display:flex;align-items:flex-end;justify-content:center;gap:0;font-size:64px;line-height:1;filter:drop-shadow(0 -2px 8px rgba(0,0,0,0.4))">
            <span style="transform:translateY(8px)">🏏</span><span style="font-size:78px">🏏</span><span style="transform:translateY(8px)">🏏</span>
          </div>
          <div style="position:absolute;bottom:4px;right:8px;font-size:7px;opacity:0.7">*T&C Apply</div>
        </div>
        <!-- White rounded sheet that contains the rest of the content (matches Media 13) -->
        <div style="background:#F3F4F6;border-top-left-radius:24px;border-top-right-radius:24px;margin-top:-14px;padding-top:14px;position:relative;z-index:2">
        <!-- Pay quick row card -->
        <div style="margin:6px 14px 12px;background:#fff;border-radius:14px;padding:14px 12px;box-shadow:0 1px 3px rgba(0,0,0,0.04)">

          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px">
            ${[
              {ic:'send',lbl:'Pay Mobile /<br>UPI ID'},
              {ic:'account_balance',lbl:'Pay to<br>Bank A/c'},
              {ic:'currency_rupee',lbl:'Pocket<br>UPI', badge:'5% BACK'},
              {ic:'person_pin',lbl:'Self<br>Transfer'},
            ].map(it => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;position:relative">
              <div style="width:38px;height:38px;border-radius:10px;background:#F3F4F6;display:flex;align-items:center;justify-content:center;position:relative">
                <span class="material-symbols-outlined" style="font-size:20px;color:#374151">${it.ic}</span>
                ${it.badge?`<div style="position:absolute;top:-7px;left:50%;transform:translateX(-50%);background:#DC2626;color:#fff;font-size:8px;font-weight:800;padding:2px 6px;border-radius:8px;white-space:nowrap;letter-spacing:0.04em">${it.badge}</div>`:''}
              </div>
              <span style="font-size:10px;font-weight:600;color:#1F2937;text-align:center;line-height:1.25">${it.lbl}</span>
            </div>`).join('')}
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;padding-top:10px;border-top:1px solid #F3F4F6">
            ${[['account_balance_wallet','Check Balance'],['credit_card','Link RuPay CC'],['qr_code_2','My QR']].map(([ic,lbl])=>
              `<div style="display:flex;align-items:center;gap:5px;padding:6px 10px;border-radius:99px;background:#F9FAFB;font-size:11px;font-weight:600;color:#4B5563;border:1px solid #E5E7EB">
                <span class="material-symbols-outlined" style="font-size:14px;color:#6B7280">${ic}</span>${lbl}
              </div>`).join('')}
          </div>
        </div>
        <!-- EMI Bill Due card -->
        <div style="margin:0 14px 12px;display:flex;gap:10px">
          <div style="flex:1;background:#FEE2E2;border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:10px">
            <div style="background:#fff;border-radius:8px;padding:6px 10px;text-align:center"><div style="font-size:18px;font-weight:900;color:#DC2626">3</div><div style="font-size:8px;font-weight:700;color:#991B1B;letter-spacing:0.04em">Days Left</div></div>
            <div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:800;color:#111827">EMI Bill Due</div><div style="font-size:10px;color:#6B7280;font-family:monospace;overflow:hidden;text-overflow:ellipsis">P580PSP11024842 · ₹1809...</div></div>
            <button style="background:#0055D4;color:#fff;font-size:12px;font-weight:800;padding:8px 16px;border-radius:99px;border:none;cursor:pointer">Pay</button>
          </div>
          <div style="background:linear-gradient(135deg,#FEE2E2,#FECACA);border-radius:14px;padding:12px 8px;text-align:center;width:64px;display:flex;flex-direction:column;align-items:center;justify-content:center">
            <div style="font-size:8px;font-weight:900;color:#0055D4;background:#FEF3C7;padding:1px 4px;border-radius:3px;margin-bottom:2px">ZIP</div>
            <div style="font-size:11px;font-weight:800;color:#111827">EMI</div>
          </div>
        </div>
        <!-- Lower app grid -->
        <div style="margin:0 14px 12px;background:#fff;border-radius:14px;padding:14px 8px">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
            ${[
              {ic:'sync_alt',lbl:'UPI<br>Transfers'},
              {ic:'bolt',lbl:'Recharge',badge:'3PE30'},
              {ic:'credit_card',lbl:'Credit'},
              {ic:'account_balance_wallet',lbl:'Wallet'},
            ].map(it => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 0;cursor:pointer;position:relative">
              <div style="width:42px;height:42px;border-radius:12px;background:#EEF2FF;display:flex;align-items:center;justify-content:center;position:relative">
                <span class="material-symbols-outlined" style="font-size:22px;color:#0055D4">${it.ic}</span>
                ${it.badge?`<div style="position:absolute;top:-6px;left:50%;transform:translateX(-50%);background:#7C3AED;color:#fff;font-size:8px;font-weight:800;padding:2px 5px;border-radius:6px;letter-spacing:0.04em">${it.badge}</div>`:''}
              </div>
              <span style="font-size:10px;font-weight:600;color:#1F2937;text-align:center;line-height:1.25">${it.lbl}</span>
            </div>`).join('')}
          </div>
        </div>
        <!-- GC slot — pulsing CTA card (placed last, like Media 13's home strip) -->
        <div id="p1GCSlot" class="gc-slot-tappable" style="margin:0 14px 14px;background:linear-gradient(135deg,#0055D4,#0C35BB);border-radius:14px;padding:14px 16px;color:#fff;cursor:pointer;position:relative;overflow:hidden;animation:p1Pulse 2.4s ease-in-out infinite">
          <div style="position:absolute;right:-12px;top:-12px;width:80px;height:80px;background:rgba(255,255,255,0.08);border-radius:50%"></div>
          <div style="position:absolute;right:30px;bottom:-10px;width:50px;height:50px;background:rgba(252,211,77,0.2);border-radius:50%"></div>
          ${state.hookOverride
            ? `<div style="position:absolute;top:8px;right:10px;background:#FCD34D;color:#1F2937;font-size:9px;font-weight:900;padding:3px 8px;border-radius:99px;letter-spacing:0.06em;z-index:2">H3 · HERE</div>`
            : `<div style="position:absolute;top:8px;right:10px;background:#FCD34D;color:#1F2937;font-size:9px;font-weight:900;padding:3px 8px;border-radius:99px;letter-spacing:0.06em;z-index:2;box-shadow:0 2px 6px rgba(0,0,0,0.18)">↗ TAP</div>`}
          <div style="display:flex;justify-content:space-between;align-items:flex-start;position:relative">
            <div style="flex:1">
              <div style="font-size:8px;font-weight:500;letter-spacing:0.04em;opacity:0.6;margin-bottom:4px">Powered by Great.Cards</div>
              <div style="font-size:14px;font-weight:800;line-height:1.3;margin-bottom:6px">${state.hookOverride || 'Find the credit card that pays back the most on your spend'}</div>
              <div style="font-size:10px;opacity:0.85">100+ cards · Pre-checked · ₹0 to apply</div>
            </div>
            <div style="font-size:28px;margin-left:8px">💳</div>
          </div>
          <div style="margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:#FCD34D;color:#1F2937;font-size:11px;font-weight:800;padding:6px 14px;border-radius:99px">${state.hookOverride ? 'See matched cards' : 'Match my spend'} <span class="material-symbols-outlined" style="font-size:14px">arrow_forward</span></div>
        </div>
        </div><!-- /sheet -->
      </div>
      ${mwBottomNavReal('home')}
    </div>`;

  ensureStyle('p1Pulse-kf','@keyframes p1Pulse{0%,100%{box-shadow:0 0 0 0 rgba(252,211,77,0.55),0 4px 12px rgba(0,85,212,0.3)}50%{box-shadow:0 0 0 6px rgba(252,211,77,0),0 6px 18px rgba(0,85,212,0.45)}}');
  document.getElementById('p1GCSlot').addEventListener('click', () => {
    state.placementClicked = true;
    p1State.step = 1;
    renderP1_Step1(phone);
    setTimeout(() => { if (state.placementClicked && p1State.step === 1) { p1State.step = 2; renderP1_Step2(phone); } }, 1400);
  });
}

function renderP1_Step1(phone) {
  phone.innerHTML = `
    <div style="height:100%;background:#fff;display:flex;flex-direction:column">
      <div style="background:#0055D4;color:#fff;padding:0 0 14px">
        ${mwStatusBar()}
        <div style="display:flex;align-items:center;gap:10px;padding:10px 16px 0">
          <span class="material-symbols-outlined" style="font-size:22px;cursor:pointer" id="mwBack">arrow_back</span>
          <div style="font-weight:800;font-size:16px">Great.Cards</div>
        </div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center">
        <div style="width:52px;height:52px;border:3px solid #E9EDFF;border-top-color:#0055D4;border-radius:50%;animation:spin 0.7s linear infinite;margin-bottom:20px"></div>
        <div style="font-size:16px;font-weight:800;color:#141B2B;margin-bottom:6px">Opening secure webview…</div>
        <div style="font-size:12px;color:#64748b;line-height:1.5">Zero PII passed. Only bucketed score and income band.</div>
        <div style="margin-top:20px;display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:20px;background:#F1F3FF;font-size:11px;color:#424654;font-weight:600">
          <span class="material-symbols-outlined" style="font-size:14px;color:#0055D4">lock</span> great.cards — verified partner
        </div>
      </div>
    </div>`;
  ensureStyle('spin-kf', '@keyframes spin{to{transform:rotate(360deg)}}');
  document.getElementById('mwBack').addEventListener('click', () => {
    state.placementClicked = false; p1State = { step: 0, cats: [], spendByCat: {} }; renderP1_Home(phone, getCards(PLACEMENTS[0]));
  });
}

function renderP1_Step2(phone) {
  phone.innerHTML = `
    <div style="height:100%;background:#fff;display:flex;flex-direction:column">
      <div style="background:#0055D4;color:#fff;padding:0 0 14px">
        ${mwStatusBar()}
        <div style="display:flex;align-items:center;gap:10px;padding:10px 16px 0">
          <span class="material-symbols-outlined" style="font-size:22px;cursor:pointer" id="mwBack">arrow_back</span>
          <div style="font-weight:800;font-size:16px">Find your best card</div>
        </div>
      </div>
      <div style="padding:16px 18px 0">
        <div style="display:flex;gap:4px;margin-bottom:12px">
          ${[1,2,3].map(i => `<div style="flex:1;height:4px;border-radius:2px;background:${i===1?'#0055D4':'#E9EDFF'}"></div>`).join('')}
        </div>
        <div style="font-size:17px;font-weight:800;color:#141B2B;margin-bottom:4px">What do you spend on?</div>
        <div style="font-size:12px;color:#64748b;margin-bottom:16px">Pick all that apply. We'll match the card that pays back the most.</div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:0 16px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px" id="p1CatGrid">
          ${SPEND_CATEGORIES.map(c => `
            <button data-cat="${c.k}" class="p1cat${p1State.cats.includes(c.k)?' p1cat-on':''}" style="padding:12px 10px;border-radius:12px;border:1.5px solid ${p1State.cats.includes(c.k)?'#0055D4':'#E9EDFF'};background:${p1State.cats.includes(c.k)?'#F0F4FF':'#fff'};display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:#141B2B;cursor:pointer;text-align:left">
              <span style="font-size:18px">${c.icon}</span><span>${c.label}</span>
            </button>`).join('')}
        </div>
      </div>
      <div style="padding:12px 16px 16px;border-top:1px solid #E9EDFF">
        <button id="p1Next" style="width:100%;padding:14px;border-radius:10px;background:#0055D4;color:#fff;font-weight:800;font-size:14px;border:none;cursor:pointer;opacity:${p1State.cats.length?1:0.5}">Next →</button>
      </div>
    </div>`;
  document.getElementById('mwBack').addEventListener('click', () => {
    state.placementClicked = false; p1State = { step: 0, cats: [], spendByCat: {} }; renderP1_Home(phone, getCards(PLACEMENTS[0]));
  });
  phone.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.dataset.cat;
      const i = p1State.cats.indexOf(k);
      if (i >= 0) p1State.cats.splice(i, 1); else p1State.cats.push(k);
      btn.style.border  = p1State.cats.includes(k) ? '1.5px solid #0055D4' : '1.5px solid #E9EDFF';
      btn.style.background = p1State.cats.includes(k) ? '#F0F4FF' : '#fff';
      document.getElementById('p1Next').style.opacity = p1State.cats.length ? 1 : 0.5;
    });
  });
  document.getElementById('p1Next').addEventListener('click', () => {
    if (!p1State.cats.length) return;
    p1State.step = 3; renderP1_Step3(phone);
  });
}

function renderP1_Step3(phone) {
  const cats = p1State.cats.map(k => SPEND_CATEGORIES.find(c => c.k === k)).filter(Boolean);
  cats.forEach(c => { if (!(c.k in p1State.spendByCat)) p1State.spendByCat[c.k] = c.defaultSpend; });
  const total = () => cats.reduce((s, c) => s + (p1State.spendByCat[c.k]||0), 0);
  const earn  = () => Math.round(cats.reduce((s, c) => s + (p1State.spendByCat[c.k]||0) * 12 * c.rate, 0));
  phone.innerHTML = `
    <div style="height:100%;background:#fff;display:flex;flex-direction:column">
      <div style="background:#0055D4;color:#fff;padding:0 0 14px">
        ${mwStatusBar()}
        <div style="display:flex;align-items:center;gap:10px;padding:10px 16px 0">
          <span class="material-symbols-outlined" style="font-size:22px;cursor:pointer" id="mwBack">arrow_back</span>
          <div style="font-weight:800;font-size:16px">Find your best card</div>
        </div>
      </div>
      <div style="padding:16px 18px 0">
        <div style="display:flex;gap:4px;margin-bottom:12px">
          ${[1,2,3].map(i => `<div style="flex:1;height:4px;border-radius:2px;background:${i<=2?'#0055D4':'#E9EDFF'}"></div>`).join('')}
        </div>
        <div style="font-size:17px;font-weight:800;color:#141B2B;margin-bottom:4px">Your monthly spend</div>
        <div style="font-size:12px;color:#64748b;margin-bottom:10px">Adjust each slider. We'll pick the card that maximises cashback on your mix.</div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:0 16px 8px">
        ${cats.map(c => `
          <div style="margin-bottom:14px;padding:14px;background:#F9F9FF;border-radius:12px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:18px">${c.icon}</span>
              <span style="font-size:13px;font-weight:700;color:#141B2B">${c.q}</span>
            </div>
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px">
              <div style="font-size:22px;font-weight:800;color:#0055D4">₹<span data-v="${c.k}">${fmt(p1State.spendByCat[c.k])}</span></div>
              <div style="font-size:10px;color:#64748b">/ month</div>
            </div>
            <input type="range" data-cat="${c.k}" min="0" max="80000" step="500" value="${p1State.spendByCat[c.k]}" style="width:100%;accent-color:#0055D4">
          </div>`).join('')}
        <div style="padding:14px;background:linear-gradient(135deg,#EEF2FF,#E0E8FF);border:1px solid #C7D2FE;border-radius:12px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:11px;color:#64748b">Total / month</span>
            <span style="font-weight:700;color:#141B2B">₹<span id="p1Total">${fmt(total())}</span></span>
          </div>
          <div style="border-top:1px dashed #C7D2FE;padding-top:8px">
            <div style="font-size:11px;color:#424654;font-weight:600">Best card earns you up to</div>
            <div style="font-size:24px;font-weight:800;color:#0055D4;margin-top:2px">₹<span id="p1Earn">${fmt(earn())}</span>/yr</div>
          </div>
        </div>
      </div>
      <div style="padding:12px 16px 16px;border-top:1px solid #E9EDFF">
        <button id="p1Next" style="width:100%;padding:14px;border-radius:10px;background:#0055D4;color:#fff;font-weight:800;font-size:14px;border:none;cursor:pointer">Find my cards →</button>
      </div>
    </div>`;
  document.getElementById('mwBack').addEventListener('click', () => { p1State.step = 2; renderP1_Step2(phone); });
  phone.querySelectorAll('input[data-cat]').forEach(sl => {
    sl.addEventListener('input', e => {
      const k = e.target.dataset.cat;
      p1State.spendByCat[k] = parseInt(e.target.value, 10);
      const vEl = phone.querySelector(`[data-v="${k}"]`);
      if (vEl) vEl.textContent = fmt(p1State.spendByCat[k]);
      document.getElementById('p1Total').textContent = fmt(total());
      document.getElementById('p1Earn').textContent  = fmt(earn());
    });
  });
  document.getElementById('p1Next').addEventListener('click', () => {
    p1State.step = 4; renderP1_Step4(phone, getCards(PLACEMENTS[0]));
  });
}

function renderP1_Step4(phone, cards) {
  const best = Math.round(Object.keys(p1State.spendByCat).reduce((s, k) => {
    const c = SPEND_CATEGORIES.find(x => x.k === k);
    return s + (p1State.spendByCat[k] || 0) * 12 * (c ? c.rate : 0.02);
  }, 0));
  const withSav = cards.slice(0, 3).map((c, i) => ({ ...c, _sav: Math.round(best * [1, 0.82, 0.64][i]) }));
  phone.innerHTML = `
    <div style="height:100%;background:#F9F9FF;display:flex;flex-direction:column">
      <div style="background:#0055D4;color:#fff;padding:0 0 14px">
        ${mwStatusBar()}
        <div style="display:flex;align-items:center;gap:10px;padding:10px 16px 0">
          <span class="material-symbols-outlined" style="font-size:22px;cursor:pointer" id="mwBack">arrow_back</span>
          <div style="font-weight:800;font-size:16px">Your matched cards</div>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:16px 14px 16px">
        <div style="font-size:15px;font-weight:800;color:#141B2B;margin-bottom:4px">${cards.length ? '3 cards matched to your spend' : 'No cards matched'}</div>
        <div style="font-size:12px;color:#64748b;margin-bottom:14px">Top pick first · ${p1State.cats.length} categor${p1State.cats.length > 1?'ies':'y'} analysed</div>
        ${withSav.map((c, i) => `
          <div style="position:relative">
            ${i === 0 ? '<div style="position:absolute;top:-6px;left:10px;background:#0055D4;color:#fff;font-size:9px;font-weight:800;padding:3px 8px;border-radius:4px;letter-spacing:0.04em;z-index:2;text-transform:uppercase">Best Match</div>' : ''}
            ${renderCardTile(c, { savings: c._sav })}
          </div>`).join('')}
        <button id="p1Restart" style="width:100%;padding:10px;border-radius:8px;border:1px solid #E9EDFF;background:#fff;color:#64748b;font-size:12px;cursor:pointer;margin-top:4px">Start over</button>
      </div>
    </div>`;
  document.getElementById('mwBack').addEventListener('click', () => { p1State.step = 3; renderP1_Step3(phone); });
  document.getElementById('p1Restart').addEventListener('click', () => {
    state.placementClicked = false;
    p1State = { step: 0, cats: [], spendByCat: {} };
    renderP1_Home(phone, getCards(PLACEMENTS[0]));
  });
}

// P2: Home – Recommended For You
function renderP2(phone, cards) {
  phone.innerHTML = `
    <div style="height:100%;background:#F9F9FF;display:flex;flex-direction:column;overflow:hidden">
      ${mwHeader()}
      <div style="flex:1;overflow-y:auto;padding:14px 14px 70px">
        ${mwQuickGrid()}
        <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.05);margin-bottom:12px">
          <div style="background:linear-gradient(135deg,#0055D4,#0C35BB);padding:14px 16px;color:#fff">
            <div style="font-size:10px;font-weight:800;letter-spacing:0.08em;opacity:0.8;margin-bottom:4px">BASED ON YOUR ACTIVITY</div>
            <div style="font-size:15px;font-weight:800">Cards matched to your Mobikwik spend</div>
            <div style="font-size:11px;opacity:0.85;margin-top:4px">Lens tag: ${esc(state.lens)} · Score: ${esc(state.score)}</div>
          </div>
          <div style="padding:14px">
            ${cards.map(c => renderCardTile(c)).join('')}
          </div>
        </div>
      </div>
      ${mwBottomNav('home')}
    </div>`;
}

// P3: Credit Card Zone (LTF focus)
function renderP3(phone, cards) {
  phone.innerHTML = `
    <div style="height:100%;background:#F9F9FF;display:flex;flex-direction:column;overflow:hidden">
      <div style="background:#0055D4;color:#fff;padding:0 0 14px">
        ${mwStatusBar()}
        <div style="display:flex;align-items:center;gap:10px;padding:10px 16px 0">
          <span class="material-symbols-outlined" style="font-size:22px;cursor:pointer">arrow_back</span>
          <div style="font-weight:800;font-size:16px">Credit Card Zone</div>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:14px 14px 16px">
        <div style="background:linear-gradient(135deg,#F9DA00,#F5C800);border-radius:16px;padding:16px;margin-bottom:14px;position:relative;overflow:hidden">
          <div style="position:absolute;right:-8px;top:-8px;width:80px;height:80px;background:rgba(255,255,255,0.2);border-radius:50%"></div>
          <div style="font-size:10px;font-weight:900;letter-spacing:0.1em;color:#7a5c00;margin-bottom:6px">ZERO ANNUAL FEE</div>
          <div style="font-size:18px;font-weight:900;color:#141B2B;line-height:1.25;margin-bottom:6px">Your first credit card.<br/>₹0 annual fee. Forever.</div>
          <div style="font-size:11px;color:#5a4200;line-height:1.4">Pre-checked against your Mobikwik score before you apply.</div>
        </div>
        ${mwSectionTitle('Lifetime Free Cards for You')}
        ${cards.map(c => renderCardTile(c)).join('')}
        <div style="text-align:center;padding:14px 0;font-size:11px;color:#94A3B8">Powered by Great.Cards · 100+ cards across 20+ banks</div>
      </div>
    </div>`;
}

// P4: Credit & Loans Section
function renderP4(phone, cards) {
  const approved = cards.slice(0, 1)[0];
  phone.innerHTML = `
    <div style="height:100%;background:#F9F9FF;display:flex;flex-direction:column;overflow:hidden">
      ${mwHeader()}
      <div style="flex:1;overflow-y:auto;padding:14px 14px 70px">
        <div style="background:#fff;border-radius:16px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,0.05)">
          <div style="font-size:13px;font-weight:800;color:#141B2B;margin-bottom:10px">Credit & Loans</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            ${[
              {icon:'credit_card',label:'Credit Cards',sub:'100+ options'},
              {icon:'account_balance',label:'Personal Loan',sub:'Up to ₹5L'},
              {icon:'home',label:'Home Loan',sub:'Check rates'},
              {icon:'directions_car',label:'Car Loan',sub:'Pre-approved'},
            ].map(it => `<div style="padding:12px;background:#F9F9FF;border-radius:12px;cursor:pointer;border:1px solid #E9EDFF">
              <span class="material-symbols-outlined" style="font-size:22px;color:#0055D4">${it.icon}</span>
              <div style="font-size:12px;font-weight:700;color:#141B2B;margin-top:4px">${it.label}</div>
              <div style="font-size:10px;color:#64748b">${it.sub}</div>
            </div>`).join('')}
          </div>
        </div>
        ${approved ? `
          <div style="background:linear-gradient(135deg,#EEF2FF,#E0E8FF);border:1px solid #C7D2FE;border-radius:16px;padding:14px;margin-bottom:12px">
            <div style="font-size:10px;font-weight:800;color:#0055D4;letter-spacing:0.08em;margin-bottom:6px">PRE-CHECKED FOR YOU</div>
            <div style="font-size:14px;font-weight:800;color:#141B2B;margin-bottom:10px">Likely approved at your score bucket</div>
            ${renderCardTile(approved)}
          </div>` : ''}
        ${cards.slice(1).map(c => renderCardTile(c)).join('')}
      </div>
      ${mwBottomNav('home')}
    </div>`;
}

// P5: Cricket / Seasonal Banner
function renderP5(phone, cards) {
  const card = cards[0];
  phone.innerHTML = `
    <div style="height:100%;background:#F9F9FF;display:flex;flex-direction:column;overflow:hidden">
      ${mwHeader()}
      <div style="flex:1;overflow-y:auto;padding:14px 14px 70px">
        ${mwQuickGrid()}
        <div style="background:linear-gradient(135deg,#0055D4,#7C3AED);border-radius:16px;padding:16px;color:#fff;margin-bottom:14px;position:relative;overflow:hidden">
          <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 80% 20%,rgba(249,218,0,0.15),transparent 50%);pointer-events:none"></div>
          <div style="font-size:10px;font-weight:800;letter-spacing:0.1em;opacity:0.8;margin-bottom:6px">🏏 IPL SEASON OFFER</div>
          <div style="font-size:18px;font-weight:900;line-height:1.25;margin-bottom:8px">Get cashback on every match-day spend</div>
          <div style="font-size:11px;opacity:0.85;margin-bottom:12px">10% back on food, travel & tickets · Offer live till May 25</div>
          ${card ? `<div style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.15);border-radius:12px;padding:10px">
            ${renderCardFace(card, { size: 'md' })}
            <div>
              <div style="font-size:13px;font-weight:800">${esc(shortCardName(card.name))}</div>
              <div style="font-size:10px;opacity:0.85;margin-top:2px">${esc(cardCategory(card))} · ${card.isLTF ? '₹0 annual fee' : 'Fee applicable'}</div>
              <div style="margin-top:8px;background:#F9DA00;color:#111827;font-size:10px;font-weight:800;padding:6px 12px;border-radius:6px;display:inline-block">Apply Now →</div>
            </div>
          </div>` : ''}
        </div>
      </div>
      ${mwBottomNav('home')}
    </div>`;
}

// P6: Credit Card Zone (matches Media 11 — real MobiKwik CC Zone screen)
function renderP6(phone, cards) {
  if (state.placementClicked) {
    return renderGCCatalogue(phone, cards, {
      title: 'Apply for a Credit Card',
      subtitle: `${cards.length} cards open at your score · LTF first`
    });
  }
  const score = state.score === 'No score' ? '—' : state.score;
  phone.innerHTML = `
    <div style="height:100%;background:#F3F4F6;display:flex;flex-direction:column;overflow:hidden">
      ${mwTopBar()}
      <div style="flex:1;overflow-y:auto;padding:14px 14px 80px">
        <!-- Credit Card Zone heading -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding:0 4px">
          <div style="display:flex;align-items:center;gap:8px;font-size:18px;font-weight:800;color:#111827">
            <span style="font-size:22px">💳</span> Credit Card Zone
          </div>
          <div style="font-size:13px;color:#0055D4;font-weight:600;display:flex;align-items:center;gap:2px">Add Card <span class="material-symbols-outlined" style="font-size:16px">chevron_right</span></div>
        </div>
        <!-- 2x2 grid -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px">
          <!-- Tile 1: Credit card payment -->
          <div style="background:#fff;border-radius:14px;padding:14px 12px;height:170px;display:flex;flex-direction:column;justify-content:space-between">
            <div>
              <div style="font-size:9px;font-weight:800;color:#9CA3AF;letter-spacing:0.06em;margin-bottom:6px">INSTANT SETTLEMENT</div>
              <div style="font-size:14px;font-weight:800;color:#111827;line-height:1.25">Credit card<br>payment</div>
            </div>
            <div style="text-align:right;font-size:36px">💳</div>
          </div>
          <!-- Tile 2: Add money via CC -->
          <div style="background:#fff;border-radius:14px;padding:14px 12px;height:170px;display:flex;flex-direction:column;justify-content:space-between">
            <div>
              <div style="font-size:9px;font-weight:800;color:#9CA3AF;letter-spacing:0.06em;margin-bottom:6px">VIA CREDIT CARD</div>
              <div style="font-size:14px;font-weight:800;color:#111827;line-height:1.25">Add money to<br>your wallet</div>
            </div>
            <div style="text-align:right;font-size:36px">📘</div>
          </div>
          <!-- Tile 3: MobiKwik First (NTC — kept) -->
          <div style="background:#fff;border-radius:14px;padding:14px 12px;height:170px;display:flex;flex-direction:column;justify-content:space-between;${state.lens==='NTC'?'border:2px solid #16A34A':''}">
            <div>
              <div style="font-size:9px;font-weight:800;color:#9CA3AF;letter-spacing:0.06em;margin-bottom:6px">100% APPROVAL</div>
              <div style="font-size:14px;font-weight:800;color:#111827;line-height:1.25">MobiKwik First<br>Credit Card</div>
              ${state.lens==='NTC'?'<div style="font-size:9px;font-weight:800;color:#16A34A;margin-top:4px">✓ Routed for NTC</div>':''}
            </div>
            <div style="display:flex;justify-content:flex-end"><div style="background:#0055D4;color:#fff;font-size:9px;font-weight:900;padding:4px 8px;border-radius:6px;letter-spacing:0.04em">RuPay first</div></div>
          </div>
          <!-- Tile 4: GC SLOT (replaces "Pay Education Fee") -->
          <div id="p6GCSlot" style="background:linear-gradient(135deg,#0055D4,#0C35BB);color:#fff;border-radius:14px;padding:14px 12px;height:170px;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;position:relative;overflow:hidden;animation:p6Pulse 2.4s ease-in-out infinite">
            <div style="position:absolute;right:-12px;bottom:-12px;width:60px;height:60px;background:rgba(252,211,77,0.18);border-radius:50%"></div>
            <div style="position:relative">
              <div style="font-size:8px;font-weight:500;color:rgba(255,255,255,0.5);letter-spacing:0.04em;margin-bottom:6px">Powered by Great.Cards</div>
              <div style="font-size:14px;font-weight:800;line-height:1.25">Apply for a<br>Credit Card</div>
              <div style="font-size:10px;opacity:0.85;margin-top:4px">${cards.length} cards matched</div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:flex-end;position:relative">
              <div style="background:#FCD34D;color:#1F2937;font-size:10px;font-weight:800;padding:4px 8px;border-radius:6px">Apply →</div>
              <div style="font-size:32px">💎</div>
            </div>
          </div>
        </div>
        <!-- Credit & Loans -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:0 4px">
          <div style="display:flex;align-items:center;gap:8px;font-size:17px;font-weight:800;color:#111827">
            <span style="font-size:20px">💵</span> Credit & Loans
          </div>
          <div style="font-size:13px;color:#0055D4;font-weight:600;display:flex;align-items:center;gap:2px">Credit Score <span class="material-symbols-outlined" style="font-size:16px">chevron_right</span></div>
        </div>
        <div style="background:#F0F4FF;border-radius:14px;padding:16px;display:flex;align-items:center;gap:14px">
          <div style="flex:1">
            <div style="font-size:11px;font-weight:700;color:#6B7280;letter-spacing:0.06em;margin-bottom:4px">CREDIT SCORE</div>
            <div style="font-size:24px;font-weight:800;color:#111827"><span style="color:#16A34A">${esc(score)}</span><span style="color:#9CA3AF;font-size:18px">/900</span></div>
            <button style="margin-top:10px;background:transparent;color:#0055D4;font-size:11px;font-weight:700;padding:6px 14px;border-radius:99px;border:1px solid #0055D4;cursor:pointer">Check Dashboard</button>
          </div>
          <div style="width:80px;height:80px;flex-shrink:0;position:relative">
            <svg viewBox="0 0 80 80" width="80" height="80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#FED7AA" stroke-width="6"/>
              <circle cx="40" cy="40" r="32" fill="none" stroke="#FCD34D" stroke-width="6" stroke-dasharray="${201 * 0.3} 201" stroke-dashoffset="-${201*0.0}" transform="rotate(-90 40 40)"/>
              <circle cx="40" cy="40" r="32" fill="none" stroke="#34D399" stroke-width="6" stroke-dasharray="${201 * 0.4} 201" stroke-dashoffset="-${201*0.3}" transform="rotate(-90 40 40)"/>
              <line x1="40" y1="40" x2="56" y2="36" stroke="#0055D4" stroke-width="2" stroke-linecap="round"/>
              <circle cx="40" cy="40" r="3" fill="#0055D4"/>
            </svg>
          </div>
        </div>
      </div>
      ${mwBottomNavReal('home')}
    </div>`;
  ensureStyle('p6Pulse-kf','@keyframes p6Pulse{0%,100%{box-shadow:0 0 0 0 rgba(252,211,77,0.45),0 4px 12px rgba(0,85,212,0.25)}50%{box-shadow:0 0 0 4px rgba(252,211,77,0),0 6px 16px rgba(0,85,212,0.4)}}');
  document.getElementById('p6GCSlot').addEventListener('click', () => {
    state.placementClicked = true; renderPhone();
  });
}

// P7: All Services – Credit Cards
function renderP7(phone, cards) {
  if (state.placementClicked) {
    return renderGCCatalogue(phone, cards, {
      title: 'Credit Cards',
      subtitle: `${cards.length} cards filtered to your score bucket`
    });
  }
  const services = [
    { icon: 'account_balance_wallet', label: 'Wallet',        sub: 'Add · Send · Load'          },
    { icon: 'bolt',                   label: 'Zip EMI',        sub: 'Buy now, pay later'          },
    { icon: 'credit_card',            label: 'Credit Cards',  sub: `${cards.length} matched →`,  highlight: true },
    { icon: 'savings',                label: 'Fixed Deposit', sub: 'Earn up to 7.5%'             },
    { icon: 'account_balance',        label: 'Loans',          sub: 'Personal · Auto · Home'     },
    { icon: 'health_and_safety',      label: 'Insurance',      sub: 'Health · Term · Motor'      },
    { icon: 'bar_chart',              label: 'Invest',         sub: 'Mutual funds · NPS'         },
  ];
  phone.innerHTML = `
    <div style="height:100%;background:#F9F9FF;display:flex;flex-direction:column;overflow:hidden">
      <div style="background:#0055D4;color:#fff;padding:0 0 14px">
        ${mwStatusBar()}
        <div style="display:flex;align-items:center;gap:10px;padding:10px 16px 0">
          <span class="material-symbols-outlined" style="font-size:22px;cursor:pointer">arrow_back</span>
          <div style="font-weight:800;font-size:16px">All Services</div>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:14px 14px 80px">
        ${services.map(s => `
          <div style="display:flex;align-items:center;gap:14px;padding:14px;background:#fff;border-radius:14px;margin-bottom:8px;box-shadow:0 1px 3px rgba(0,0,0,0.04);cursor:pointer;position:relative;${s.highlight?'border:1.5px solid #0055D4;animation:p7Pulse 2.4s ease-in-out infinite':''}" ${s.highlight?'id="p7CCEntry" class="gc-slot-tappable"':''}>
            ${s.highlight?'<div style="position:absolute;top:-8px;right:10px;background:#FCD34D;color:#1F2937;font-size:9px;font-weight:900;padding:3px 8px;border-radius:99px;letter-spacing:0.06em;box-shadow:0 2px 6px rgba(0,0,0,0.18)">↗ TAP</div>':''}
            <div style="width:40px;height:40px;border-radius:12px;background:${s.highlight?'#0055D4':'#EEF2FF'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <span class="material-symbols-outlined" style="font-size:20px;color:${s.highlight?'#fff':'#0055D4'}">${s.icon}</span>
            </div>
            <div style="flex:1">
              <div style="font-size:14px;font-weight:700;color:#141B2B">${s.label}${s.highlight?' <span style="font-size:9px;font-weight:800;color:#0055D4;background:#EEF2FF;padding:2px 6px;border-radius:4px;margin-left:6px;letter-spacing:0.04em">GC</span>':''}</div>
              <div style="font-size:11px;color:${s.highlight?'#0055D4':'#64748b'};margin-top:2px;font-weight:${s.highlight?700:400}">${s.sub}</div>
            </div>
            <span class="material-symbols-outlined" style="font-size:18px;color:#C3C6D7">chevron_right</span>
          </div>`).join('')}
      </div>
      ${mwBottomNavReal('services')}
    </div>`;
  ensureStyle('p7Pulse-kf','@keyframes p7Pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,85,212,0.3),0 1px 3px rgba(0,0,0,0.04)}50%{box-shadow:0 0 0 5px rgba(0,85,212,0),0 4px 14px rgba(0,85,212,0.25)}}');
  document.getElementById('p7CCEntry')?.addEventListener('click', () => {
    state.placementClicked = true; renderPhone();
  });
}

// P8: Lens – Cashflow Summary (matches Media 20 — real Lens screen with GC slot)
function renderP8(phone, cards) {
  if (state.placementClicked) {
    return renderGCCatalogue(phone, cards, {
      title: 'Cards matched to your cashflow',
      subtitle: `${cards.length} cards matched to your Mobikwik spend pattern`
    });
  }
  const txns = [
    { name: 'JAVED ALAM', amt: 119, time: '28 Apr, 6:58 PM', tag: 'Merchant' },
    { name: 'MobiKwik',    amt: 80,  time: '28 Apr, 1:43 PM', tag: 'Merchant' },
    { name: 'VIKAS',       amt: 47,  time: '28 Apr, 11:02 AM', tag: 'Merchant' },
  ];
  phone.innerHTML = `
    <div style="height:100%;background:#fff;display:flex;flex-direction:column;overflow:hidden">
      <!-- White status bar + Lens header (Media 20) -->
      <div style="background:#fff;flex-shrink:0">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px 0;font-size:11px;font-weight:600;color:#6B7280">
          <span>9:41</span>
          <span style="display:flex;gap:4px;align-items:center"><span class="material-symbols-outlined" style="font-size:12px">signal_cellular_alt</span><span class="material-symbols-outlined" style="font-size:12px">wifi</span><span class="material-symbols-outlined" style="font-size:12px">battery_5_bar</span></span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px">
          <span class="material-symbols-outlined" style="font-size:24px;color:#374151;cursor:pointer">arrow_back_ios_new</span>
          <div style="display:flex;align-items:baseline;gap:1px;font-weight:900;font-size:20px;color:#111827;letter-spacing:0.04em">L<span style="color:#16A34A">E</span>NS<span style="display:inline-block;width:8px;height:8px;border:2px solid #16A34A;border-top:0;border-right:0;transform:rotate(-45deg);margin-left:-2px;margin-bottom:6px"></span></div>
          <span class="material-symbols-outlined" style="font-size:22px;color:#374151">search</span>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:0 0 80px;background:#F3F4F6">
        <!-- Balance + privacy tooltip (Media 20) -->
        <div style="background:#fff;padding:8px 18px 22px;position:relative">
          <div style="font-size:14px;color:#374151;margin-bottom:6px">All Bank Balance</div>
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:30px;font-weight:800;color:#111827;letter-spacing:0.05em">₹ ✱ ✱ ✱</span>
              <span class="material-symbols-outlined" style="font-size:20px;color:#0055D4">visibility</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:34px;height:34px;border:1px solid #E5E7EB;border-radius:8px;display:flex;align-items:center;justify-content:center;background:#fff">
                <div style="width:14px;height:14px;background:#DC2626;border-radius:2px;position:relative"><div style="position:absolute;inset:3px;background:#1E40AF;border-radius:1px"></div></div>
              </div>
              <span class="material-symbols-outlined" style="font-size:20px;color:#9CA3AF">expand_more</span>
            </div>
          </div>
          <!-- Privacy update dark tooltip -->
          <div style="margin-top:14px;background:#0F172A;color:#fff;border-radius:12px;padding:14px 16px;position:relative">
            <div style="position:absolute;top:-8px;left:54px;width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-bottom:9px solid #0F172A"></div>
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
              <div>
                <div style="font-size:10px;font-weight:800;color:#F59E0B;letter-spacing:0.08em;margin-bottom:6px">PRIVACY UPDATE</div>
                <div style="font-size:15px;font-weight:800;margin-bottom:4px">Hide/Unhide Balances</div>
                <div style="font-size:11px;color:#CBD5E1;line-height:1.5">Protect your total earnings, spending, and bank balance from prying eyes.</div>
              </div>
              <span class="material-symbols-outlined" style="font-size:18px;color:#94A3B8;cursor:pointer">close</span>
            </div>
          </div>
          <div style="margin-top:14px;font-size:12px;color:#6B7280;border-top:1px solid #F3F4F6;padding-top:12px">Updated on 05:39 PM, 29 Apr '26</div>
        </div>
        <!-- GC slot — replaces "Check your Credit Score for Free" card from Media 20, but framed as Lens cashflow match -->
        <div style="padding:14px 14px 0">
          <div id="p8GCSlot" class="gc-slot-tappable" style="background:#fff;border-radius:14px;padding:16px;display:flex;align-items:center;gap:14px;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.05);position:relative;overflow:hidden;animation:p8Pulse 2.4s ease-in-out infinite">
            ${state.hookOverride ? `<div style="position:absolute;top:8px;right:10px;background:#FCD34D;color:#1F2937;font-size:9px;font-weight:900;padding:2px 7px;border-radius:99px;letter-spacing:0.06em">H4 · HERE</div>` : ''}
            <div style="flex:1">
              <div style="font-size:8px;font-weight:500;color:#94A3B8;letter-spacing:0.04em;margin-bottom:6px">Powered by Great.Cards · Lens Match</div>
              <div style="font-size:15px;font-weight:800;color:#111827;line-height:1.3">${state.hookOverride || `Your spend pattern qualifies you for ${cards.length} cards`}</div>
              <div style="font-size:11px;color:#6B7280;margin-top:4px">₹${fmt(Math.round(state.income * 0.045 * 12))}/year cashback on your bill pattern</div>
              <div style="margin-top:8px;font-size:13px;color:#0055D4;font-weight:700">See matched cards →</div>
            </div>
            <div style="width:64px;height:64px;flex-shrink:0;border-radius:50%;background:conic-gradient(#FCD34D 0 25%,#34D399 25% 65%,#F87171 65% 100%);display:flex;align-items:center;justify-content:center;position:relative">
              <div style="width:44px;height:44px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center"><span class="material-symbols-outlined" style="font-size:22px;color:#0055D4">speed</span></div>
            </div>
          </div>
        </div>
        <!-- Recent transactions (Media 20) -->
        <div style="padding:24px 18px 0">
          <div style="font-size:18px;font-weight:800;color:#111827;margin-bottom:12px">Recent Transactions</div>
          <div style="background:#fff;border-radius:14px;padding:6px 16px">
            ${txns.map((t,i) => `
              <div style="padding:14px 0;${i===0?'':'border-top:1px solid #F3F4F6'};display:flex;align-items:center;justify-content:space-between">
                <div>
                  <div style="font-size:14px;font-weight:700;color:#111827;letter-spacing:0.02em">${t.name}</div>
                  <div style="font-size:11px;color:#9CA3AF;margin-top:4px;display:flex;align-items:center;gap:5px">${t.time} <span style="display:inline-block;width:10px;height:10px;background:#DC2626;border-radius:1px"></span></div>
                </div>
                <div style="text-align:right">
                  <div style="font-size:14px;font-weight:700;color:#111827;display:flex;align-items:center;gap:4px;justify-content:flex-end">₹${t.amt} <span style="color:#DC2626">↗</span></div>
                  <div style="display:inline-flex;align-items:center;gap:4px;background:#F3F4F6;padding:3px 8px;border-radius:6px;font-size:10px;color:#6B7280;margin-top:4px">⊙ ${t.tag} ...</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>
      ${mwBottomNavReal()}
    </div>`;
  ensureStyle('p8Pulse-kf','@keyframes p8Pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,85,212,0.35),0 1px 3px rgba(0,0,0,0.05)}50%{box-shadow:0 0 0 5px rgba(0,85,212,0),0 4px 14px rgba(0,85,212,0.25)}}');
  document.getElementById('p8GCSlot').addEventListener('click', () => {
    state.placementClicked = true; renderPhone();
  });
}

// P9: Lens – Check Credit Score CTA
function renderP9(phone, cards) {
  const score = state.score === 'No score' ? null : parseInt(state.score, 10);
  const scoreAngle = score ? Math.min((score - 300) / (850 - 300) * 180, 180) : 0;
  phone.innerHTML = `
    <div style="height:100%;background:#F9F9FF;display:flex;flex-direction:column;overflow:hidden">
      <div style="background:#0055D4;color:#fff;padding:0 0 14px">
        ${mwStatusBar()}
        <div style="padding:10px 16px 0;font-weight:800;font-size:16px">Credit Score</div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:14px 14px 16px">
        <div style="background:#fff;border-radius:16px;padding:20px 16px;margin-bottom:12px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.05)">
          <div style="font-size:11px;color:#64748b;margin-bottom:14px">Your CIBIL Score Range</div>
          <div style="position:relative;display:inline-block;margin-bottom:10px">
            <svg width="140" height="80" viewBox="0 0 140 80">
              <path d="M10 70 A60 60 0 0 1 130 70" fill="none" stroke="#E9EDFF" stroke-width="12" stroke-linecap="round"/>
              ${score ? `<path d="M10 70 A60 60 0 0 1 130 70" fill="none" stroke="#0055D4" stroke-width="12" stroke-linecap="round" stroke-dasharray="${scoreAngle * 2.09}" stroke-dashoffset="0"/>` : ''}
            </svg>
            <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);text-align:center">
              <div style="font-size:26px;font-weight:900;color:#0055D4">${score ? state.score : '—'}</div>
              <div style="font-size:10px;color:#64748b">${score ? (score>=750?'Excellent':score>=700?'Good':score>=650?'Fair':'Poor') : 'Not yet checked'}</div>
            </div>
          </div>
          ${score ? `
            <div style="font-size:12px;color:#16A34A;font-weight:700;background:#F0FDF4;border-radius:8px;padding:8px 12px;margin-top:8px">
              ✓ ${cards.length} card${cards.length!==1?'s':''} available at your score range
            </div>` : `
            <button style="margin-top:8px;padding:12px 24px;background:#0055D4;color:#fff;font-weight:800;font-size:13px;border:none;border-radius:10px;cursor:pointer">Check my score free →</button>`}
        </div>
        ${score ? `
          <div style="font-size:14px;font-weight:800;color:#141B2B;margin-bottom:10px">Unlocked at ${esc(state.score)} range</div>
          ${cards.map(c => renderCardTile(c)).join('')}` : ''}
      </div>
      ${mwBottomNav()}
    </div>`;
}

// P10: Credit Score (matches Media 6 — real score screen with GC slot replacing pre-approved loan)
function renderP10(phone, cards) {
  if (state.placementClicked) {
    return renderGCCatalogue(phone, cards, {
      title: 'Cards at your score',
      subtitle: `${cards.length} cards approval-likely at ${state.score}`
    });
  }
  const score = state.score === 'No score' ? 0 : parseInt(state.score, 10);
  const verdict = !score ? 'Not yet checked' : score >= 750 ? 'Excellent' : score >= 700 ? 'Good' : score >= 650 ? 'Fair' : 'Poor';
  const verdictColor = !score ? '#9CA3AF' : score >= 750 ? '#16A34A' : score >= 700 ? '#65A30D' : score >= 650 ? '#D97706' : '#DC2626';
  // Arc geometry
  const startA = -210, endA = 30; // degrees, sweeping right side
  const pct = score ? Math.max(0, Math.min(1, (score - 300) / 600)) : 0;
  const arcA = startA + (endA - startA) * pct;
  const polar = (a, r) => [40 + r*Math.cos(a*Math.PI/180), 40 + r*Math.sin(a*Math.PI/180)];
  const [bgX1, bgY1] = polar(startA, 32), [bgX2, bgY2] = polar(endA, 32);
  const [fgX2, fgY2] = polar(arcA, 32);
  const largeArcBg = (endA - startA) > 180 ? 1 : 0;
  const largeArcFg = (arcA - startA) > 180 ? 1 : 0;
  const [tipX, tipY] = polar(arcA, 32);
  phone.innerHTML = `
    <div style="height:100%;background:#F3F4F6;display:flex;flex-direction:column;overflow:hidden">
      <!-- Header (white per Media 6) -->
      <div style="background:#fff;padding:0;flex-shrink:0;border-bottom:1px solid #F3F4F6">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px 0;font-size:11px;font-weight:600;color:#6B7280">
          <span>9:41</span><span style="display:flex;gap:4px;align-items:center"><span class="material-symbols-outlined" style="font-size:12px">signal_cellular_alt</span><span class="material-symbols-outlined" style="font-size:12px">wifi</span><span class="material-symbols-outlined" style="font-size:12px">battery_5_bar</span></span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px">
          <span class="material-symbols-outlined" style="font-size:24px;color:#374151;cursor:pointer">arrow_back_ios_new</span>
          <div style="font-size:17px;font-weight:800;color:#111827">Your credit score</div>
          <span class="material-symbols-outlined" style="font-size:22px;color:#9CA3AF">info</span>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:0 0 80px;background:#F3F4F6">
        <!-- Score arc card -->
        <div style="background:#fff;padding:24px 20px 20px;text-align:center">
          <svg viewBox="0 0 80 70" width="240" height="190">
            <path d="M ${bgX1.toFixed(2)} ${bgY1.toFixed(2)} A 32 32 0 ${largeArcBg} 1 ${bgX2.toFixed(2)} ${bgY2.toFixed(2)}" fill="none" stroke="#E5E7EB" stroke-width="6" stroke-linecap="round"/>
            ${score ? `<path d="M ${bgX1.toFixed(2)} ${bgY1.toFixed(2)} A 32 32 0 ${largeArcFg} 1 ${fgX2.toFixed(2)} ${fgY2.toFixed(2)}" fill="none" stroke="#86EFAC" stroke-width="6" stroke-linecap="round"/>
            <circle cx="${tipX.toFixed(2)}" cy="${tipY.toFixed(2)}" r="3.5" fill="#16A34A"/>` : ''}
            <text x="40" y="42" font-size="14" font-weight="700" fill="#111827" text-anchor="middle" font-family="Inter">${score || '—'}</text>
            <text x="40" y="52" font-size="6" font-weight="600" fill="${verdictColor}" text-anchor="middle" font-family="Inter">${verdict}</text>
          </svg>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0 28px;margin-top:-30px">
            <span style="font-size:12px;color:#9CA3AF">300</span>
            <span style="font-size:11px;font-weight:800;color:#0055D4;letter-spacing:0.05em">CRIF</span>
            <span style="font-size:12px;color:#9CA3AF">900</span>
          </div>
          <div style="font-size:13px;color:#9CA3AF;margin-top:18px">We'll remind you in 29 days</div>
        </div>
        <!-- GC slot (replaces pre-approved loan card from Media 6) -->
        <div style="padding:18px 14px 0">
          <div id="p10GCSlot" class="gc-slot-tappable" style="background:linear-gradient(135deg,#EEF2FF,#DDD6FE);border:1.5px solid #C4B5FD;border-radius:14px;padding:18px;cursor:pointer;position:relative;animation:p10Pulse 2.4s ease-in-out infinite">
            ${state.hookOverride ? `<div style="position:absolute;top:8px;right:10px;background:#FCD34D;color:#1F2937;font-size:9px;font-weight:900;padding:2px 7px;border-radius:99px;letter-spacing:0.06em">H1 · HERE</div>` : ''}
            <div style="display:flex;align-items:center;gap:14px">
              <div style="flex:1">
                <div style="font-size:8px;font-weight:500;color:#94A3B8;letter-spacing:0.04em;margin-bottom:6px">Powered by Great.Cards</div>
                ${state.hookOverride
                  ? `<div style="font-size:14px;font-weight:800;color:#1F2937;line-height:1.4;margin-bottom:8px">${esc(state.hookOverride)}</div>`
                  : `<div style="font-size:14px;color:#1F2937;line-height:1.4">You're eligible for</div>
                     <div style="font-size:14px;color:#1F2937;line-height:1.4;margin-bottom:6px">${cards.length} pre-approved Credit Cards</div>
                     <div style="font-size:24px;font-weight:900;color:#111827">${cards.length ? `Up to ₹${fmt(Math.max(...cards.map(c=>c.minIncome*8 || 200000), 200000))}` : '—'}</div>
                     <div style="font-size:11px;color:#4B5563;margin-top:2px">credit limit available</div>`}
              </div>
              <button style="background:#0055D4;color:#fff;font-weight:800;font-size:13px;padding:12px 22px;border-radius:99px;border:none;cursor:pointer;flex-shrink:0">Apply Now</button>
            </div>
            <div style="border-top:1px dashed #C4B5FD;margin-top:14px;padding-top:10px;font-size:11px;color:#4B5563;display:flex;align-items:center;gap:6px">
              <span style="color:#FCD34D;font-size:14px">⚡</span> Lifetime free options · 30-second decision · No score impact
            </div>
          </div>
        </div>
        <!-- Account Summary -->
        <div style="padding:24px 14px 0">
          <div style="font-size:11px;font-weight:800;color:#9CA3AF;letter-spacing:0.08em;margin-bottom:10px">ACCOUNT SUMMARY</div>
          <div style="background:#fff;border-radius:14px;padding:16px;display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-size:14px;color:#374151">2 Credit Cards</div>
              <div style="display:flex;gap:4px;margin-top:8px">
                <div style="width:24px;height:16px;border-radius:3px;background:linear-gradient(135deg,#1E40AF,#3B82F6)"></div>
                <div style="width:24px;height:16px;border-radius:3px;background:linear-gradient(135deg,#0055D4,#0C35BB)"></div>
              </div>
            </div>
            <div style="text-align:right">
              <div style="font-size:14px;font-weight:800;color:#111827">₹51,877</div>
              <div style="font-size:10px;color:#9CA3AF">Limit Used</div>
            </div>
            <span class="material-symbols-outlined" style="font-size:18px;color:#9CA3AF">chevron_right</span>
          </div>
        </div>
      </div>
      ${mwBottomNavReal()}
    </div>`;
  ensureStyle('p10Pulse-kf','@keyframes p10Pulse{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.35),0 2px 8px rgba(124,58,237,0.1)}50%{box-shadow:0 0 0 5px rgba(124,58,237,0),0 4px 12px rgba(124,58,237,0.25)}}');
  document.getElementById('p10GCSlot').addEventListener('click', () => {
    state.placementClicked = true; renderPhone();
  });
}

// P11: EMI Bill Due Screen
function renderP11(phone, cards) {
  if (state.placementClicked) {
    return renderGCCatalogue(phone, cards, {
      title: 'Earned access',
      subtitle: `${cards.length} cards your repayment record unlocked`
    });
  }
  phone.innerHTML = `
    <div style="height:100%;background:#F9F9FF;display:flex;flex-direction:column;overflow:hidden">
      <div style="background:#0055D4;color:#fff;padding:0 0 14px">
        ${mwStatusBar()}
        <div style="display:flex;align-items:center;gap:10px;padding:10px 16px 0">
          <span class="material-symbols-outlined" style="font-size:22px">arrow_back</span>
          <div style="font-weight:800;font-size:16px">Zip EMI</div>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:14px 14px 80px">
        <div style="background:#fff;border-radius:16px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,0.05)">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
            <div style="width:40px;height:40px;border-radius:12px;background:#F0FDF4;display:flex;align-items:center;justify-content:center">
              <span class="material-symbols-outlined" style="font-size:22px;color:#16A34A">check_circle</span>
            </div>
            <div>
              <div style="font-size:14px;font-weight:800;color:#141B2B">EMI paid on time</div>
              <div style="font-size:11px;color:#16A34A;font-weight:600">3 in a row · Your repayment score just improved</div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid #E9EDFF">
            <span style="font-size:12px;color:#64748b">Amount paid</span>
            <span style="font-size:14px;font-weight:800;color:#141B2B">₹4,850</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid #E9EDFF">
            <span style="font-size:12px;color:#64748b">Remaining EMIs</span>
            <span style="font-size:14px;font-weight:800;color:#141B2B">9 of 12</span>
          </div>
        </div>
        <div id="p11GCSlot" class="gc-slot-tappable" style="position:relative;background:linear-gradient(135deg,#EEF2FF,#DCE4FF);border:1px solid #C7D2FE;border-radius:14px;padding:14px;margin-bottom:12px;cursor:pointer;animation:p11Pulse 2.4s ease-in-out infinite">
          <div style="position:absolute;top:-8px;right:10px;background:#FCD34D;color:#1F2937;font-size:9px;font-weight:900;padding:3px 8px;border-radius:99px;letter-spacing:0.06em;box-shadow:0 2px 6px rgba(0,0,0,0.18)">${state.hookOverride ? 'H2 · HERE' : '↗ TAP'}</div>
          <div style="font-size:15px;font-weight:800;color:#141B2B;margin-bottom:2px;line-height:1.3">Good job! You're on a streak of 3.</div>
          <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">Banks notice this kind of consistency.</div>
          <div style="font-size:13px;font-weight:700;color:#141B2B;margin-bottom:8px;line-height:1.4">${state.hookOverride || 'Your track record just unlocked better cards'}</div>
          <div style="font-size:8px;font-weight:500;color:#6B7280;letter-spacing:0.04em;margin-bottom:8px">Powered by Great.Cards</div>
          ${cards.map(c => renderCardTile(c)).join('')}
          <div style="text-align:center;margin-top:6px;font-size:12px;color:#0055D4;font-weight:700">See all matched cards →</div>
        </div>
      </div>
      ${mwBottomNavReal()}
    </div>`;
  ensureStyle('p11Pulse-kf','@keyframes p11Pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,85,212,0.25)}50%{box-shadow:0 0 0 5px rgba(0,85,212,0)}}');
  document.getElementById('p11GCSlot')?.addEventListener('click', () => {
    state.placementClicked = true; renderPhone();
  });
}

// P12: Recharge / Bill Confirmation
function renderP12(phone, cards) {
  if (state.placementClicked) {
    return renderGCCatalogue(phone, cards, {
      title: 'Cashback cards on your bills',
      subtitle: `Card ${cards.length>1?'s':''} that pay you back on every bill`
    });
  }
  const card = cards[0];
  phone.innerHTML = `
    <div style="height:100%;background:#F9F9FF;display:flex;flex-direction:column;overflow:hidden">
      <div style="background:#16A34A;color:#fff;padding:0 0 18px;text-align:center">
        ${mwStatusBar()}
        <div style="padding:14px 16px 0">
          <span class="material-symbols-outlined" style="font-size:40px;margin-bottom:6px;display:block">check_circle</span>
          <div style="font-size:18px;font-weight:900">Bill Paid Successfully</div>
          <div style="font-size:26px;font-weight:900;margin:4px 0">₹2,400</div>
          <div style="font-size:11px;opacity:0.85">Electricity bill · BSES Delhi</div>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:14px 14px 80px">
        ${card ? `
          <div id="p12GCSlot" class="gc-slot-tappable" style="position:relative;background:linear-gradient(135deg,#FFF7E6,#FFF0CC);border:1px solid #F5C800;border-radius:16px;padding:14px;margin-bottom:12px;cursor:pointer;animation:p12Pulse 2.4s ease-in-out infinite">
            <div style="position:absolute;top:-8px;right:10px;background:#0055D4;color:#fff;font-size:9px;font-weight:900;padding:3px 8px;border-radius:99px;letter-spacing:0.06em;box-shadow:0 2px 6px rgba(0,0,0,0.18)">${state.hookOverride ? 'H5 · HERE' : '↗ TAP'}</div>
            <div style="font-size:18px;font-weight:900;color:#141B2B;letter-spacing:0.01em;margin-bottom:3px">YOU JUST PAID ₹2,400</div>
            <div style="font-size:8px;font-weight:500;color:#7a5c00;letter-spacing:0.04em;margin-bottom:8px">Powered by Great.Cards</div>
            <div style="font-size:15px;font-weight:800;color:#141B2B;margin-bottom:4px;line-height:1.3">${state.hookOverride || 'This card would have returned ₹120 cashback on that payment.'}</div>
            <div style="font-size:11px;color:#5a4200;margin-bottom:12px">₹1,440/year on bills alone. ₹0 annual fee.</div>
            ${renderCardTile(card, { noApply: true })}
            <div style="text-align:center;margin-top:6px;font-size:12px;color:#7a5c00;font-weight:800">Tap to apply →</div>
          </div>` : ''}
        <div style="background:#fff;border-radius:14px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
          <div style="font-size:12px;font-weight:700;color:#141B2B;margin-bottom:10px">Transaction details</div>
          ${[['Bill type','Electricity'],['Biller','BSES Delhi'],['Reference No.','TXN24091842'],['Date','Today, 9:41 AM']].map(([k,v]) =>
            `<div style="display:flex;justify-content:space-between;padding:8px 0;border-top:1px solid #E9EDFF;font-size:12px">
              <span style="color:#64748b">${k}</span><span style="font-weight:700;color:#141B2B">${v}</span>
            </div>`).join('')}
        </div>
      </div>
      ${mwBottomNavReal()}
    </div>`;
  ensureStyle('p12Pulse-kf','@keyframes p12Pulse{0%,100%{box-shadow:0 0 0 0 rgba(245,200,0,0.4)}50%{box-shadow:0 0 0 6px rgba(245,200,0,0)}}');
  document.getElementById('p12GCSlot')?.addEventListener('click', () => {
    state.placementClicked = true; renderPhone();
  });
}

// ─── Placement router ─────────────────────────────────────────────────────────
function renderPlacementPhone(phone) {
  const p = PLACEMENTS.find(x => x.id === state.placement);
  if (!p) return;

  if (state.lens === 'NTC') {
    phone.innerHTML = `
      <div style="height:100%;background:#F9F9FF;display:flex;flex-direction:column;overflow:hidden">
        <div style="background:#0055D4;color:#fff;padding:0 0 18px">
          ${mwStatusBar()}
          <div style="padding:10px 16px 0;font-weight:800;font-size:16px">First Credit Card</div>
        </div>
        <div style="flex:1;overflow-y:auto;padding:20px 16px">
          <div style="background:linear-gradient(135deg,#0055D4,#0C35BB);border-radius:16px;padding:20px;color:#fff;text-align:center;margin-bottom:16px">
            <div style="font-size:32px;margin-bottom:12px">🎯</div>
            <div style="font-size:18px;font-weight:900;margin-bottom:8px;line-height:1.3">No credit history? That's fine.</div>
            <div style="font-size:12px;opacity:0.85;line-height:1.5;margin-bottom:16px">Mobikwik First Card — no score required. Issued by SBM Bank, fully on Mobikwik.</div>
            <button style="background:#F9DA00;color:#111827;font-weight:900;font-size:13px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer">See Mobikwik First Card →</button>
          </div>
          <div style="font-size:11px;color:#94A3B8;text-align:center;padding:8px">NTC users routed to First Card only. GC catalogue excluded. Mobikwik keeps 100% of commission.</div>
        </div>
        ${mwBottomNav()}
      </div>`;
    return;
  }

  if (state.zip === 'Active' && state.tab === 'placements') {
    phone.innerHTML = `
      <div style="height:100%;background:#F9F9FF;display:flex;flex-direction:column;overflow:hidden">
        ${mwHeader()}
        <div style="flex:1;overflow-y:auto;padding:20px 16px 70px">
          <div style="background:#fff;border-radius:16px;padding:20px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.05)">
            <span class="material-symbols-outlined" style="font-size:36px;color:#D97706;margin-bottom:10px;display:block">warning</span>
            <div style="font-size:15px;font-weight:800;color:#141B2B;margin-bottom:8px">Zip EMI active</div>
            <div style="font-size:12px;color:#64748b;line-height:1.5">Credit card placements are paused while a Zip repayment journey is active. Resumes after final payment.</div>
          </div>
        </div>
        ${mwBottomNav()}
      </div>`;
    return;
  }

  const cards = getCards(p);
  if      (p.id === 1) renderP1(phone, cards);             // Home Trending (4-step funnel)
  else if (p.id === 2) renderP11(phone, cards);            // Zip Earned Access
  else if (p.id === 3) renderP12(phone, cards);            // Bill Pay Success loss-frame
  else if (p.id === 4) renderP8(phone, cards);             // Lens Cashflow Match
  else if (p.id === 5) renderP10(phone, cards);            // Credit Score - What Can I Get
  else if (p.id === 6) renderP6(phone, cards);             // App Grid CC Tile
  else if (p.id === 7) renderP7(phone, cards);             // All Services
  else if (p.id === 8) renderP_PushLanding(phone, cards);  // Push deep-link landing
}

// P8: Push deep-link landing
function renderP_PushLanding(phone, cards) {
  if (state.placementClicked) {
    return renderGCCatalogue(phone, cards, {
      title: 'From your notification',
      subtitle: `${cards.length} cards matched to your trigger`
    });
  }
  const card = cards[0];
  const cohortTrigger = {
    'FD Pledge':     { line: 'You have an active FD with MobiKwik', body: 'Your ₹50,000 FD just unlocked an FD-backed credit card. Same limit, no score check, instant approval.' },
    'EMI Grad':      { line: 'You paid your 3rd Zip EMI on time',   body: 'Banks notice exactly this. Here\'s the card your repayment record just unlocked.' },
    'Bill-Pay':      { line: 'You paid ₹8,400 in bills this month',  body: 'This card returns ₹420 of that every month. ₹0 annual fee, lifetime free.' },
    'Spend-Backed':  { line: 'Your Mobikwik cashflow qualifies you', body: 'Lens AA scored your spend pattern. This card is built for exactly how you transact.' },
    'Score Watcher': { line: 'Your CIBIL score crossed 720',         body: 'Three cards you couldn\'t get last month are now live. Highest approval rate at your score.' },
    'NTC':           { line: 'No credit history yet — that\'s fine', body: 'MobiKwik First Card needs no score. Full credit on your wallet activity. Issued by SBM Bank.' },
  };
  const trig = cohortTrigger[state.lens] || cohortTrigger['Score Watcher'];
  phone.innerHTML = `
    <div style="height:100%;background:#0D1A2E;display:flex;flex-direction:column;overflow:hidden;color:#fff">
      <div style="background:#0D1A2E;padding:0 0 8px">
        ${mwStatusBar()}
        <div style="display:flex;align-items:center;gap:10px;padding:10px 16px 0">
          <span class="material-symbols-outlined" style="font-size:22px;cursor:pointer">arrow_back</span>
          <div style="font-weight:800;font-size:14px;opacity:0.9">MobiKwik · Cards</div>
          <div style="margin-left:auto;font-size:9px;font-weight:800;background:rgba(96,165,250,0.18);color:#93C5FD;padding:4px 10px;border-radius:99px;letter-spacing:0.06em">VIA NOTIFICATION</div>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:16px 18px 16px">
        <div style="font-size:9px;font-weight:800;color:#60A5FA;letter-spacing:0.14em;margin-bottom:8px">FROM YOUR NOTIFICATION</div>
        <div style="font-size:22px;font-weight:900;line-height:1.2;margin-bottom:6px">${esc(trig.line)}</div>
        <div style="font-size:13px;color:#94A3B8;line-height:1.55;margin-bottom:18px">${esc(trig.body)}</div>
        ${card ? `
          <div style="background:#fff;border-radius:18px;padding:18px;color:#141B2B">
            <div style="display:flex;justify-content:center;margin-bottom:14px">
              ${renderCardFace(card, { size: 'lg' })}
            </div>
            <div style="font-size:16px;font-weight:800;text-align:center;margin-bottom:4px">${esc(shortCardName(card.name))}</div>
            <div style="font-size:11px;color:#64748b;text-align:center;margin-bottom:14px">${esc(card.bank)} · ${esc(cardCategory(card))}</div>
            <div style="display:flex;justify-content:space-around;padding:12px 0;border-top:1px solid #E9EDFF;border-bottom:1px solid #E9EDFF;margin-bottom:14px">
              <div style="text-align:center"><div style="font-size:10px;color:#64748b">Joining</div><div style="font-size:13px;font-weight:800;color:#0055D4;margin-top:2px">${card.isLTF?'₹0':'₹'+fmt(card.joiningFee)}</div></div>
              <div style="text-align:center"><div style="font-size:10px;color:#64748b">Annual</div><div style="font-size:13px;font-weight:800;color:#0055D4;margin-top:2px">${card.annualFee?'₹'+fmt(card.annualFee):'₹0'}</div></div>
              <div style="text-align:center"><div style="font-size:10px;color:#64748b">Approval</div><div style="font-size:13px;font-weight:800;color:#16A34A;margin-top:2px">High</div></div>
            </div>
            <button id="pushApplyBtn" style="width:100%;padding:14px;background:#0055D4;color:#fff;font-weight:800;font-size:14px;border:none;border-radius:10px;cursor:pointer">Apply now →</button>
            <div style="text-align:center;font-size:10px;color:#94A3B8;margin-top:10px">Powered by Great.Cards · 30-second decision</div>
          </div>` : '<div style="color:#94A3B8;text-align:center;padding:20px">No card matched. Adjust the score / income above.</div>'}
      </div>
    </div>`;
}

// ─── Notification phone ───────────────────────────────────────────────────────
function renderNotificationPhone(phone) {
  if (state.zip === 'Active') {
    phone.innerHTML = `
      <div style="height:100%;background:#1A1A2E;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px">
        <div style="background:rgba(255,255,255,0.06);border-radius:20px;padding:20px 24px;width:100%;max-width:300px">
          <div style="font-size:11px;color:#64748b;margin-bottom:10px">No notification</div>
          <div style="font-size:14px;font-weight:700;color:#E2E8F0;margin-bottom:6px">Active Zip repayment</div>
          <div style="font-size:12px;color:#94A3B8;line-height:1.5">No credit-card touch while user is repaying Zip. Suppression rule active.</div>
        </div>
      </div>`;
    return;
  }
  const cohort = notifications[state.cohort] || notifications['Score Watcher'];
  const msg    = cohort.days[state.day];
  if (!msg) {
    phone.innerHTML = `
      <div style="height:100%;background:#1A1A2E;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px">
        <div style="background:rgba(255,255,255,0.06);border-radius:20px;padding:20px;width:100%;max-width:300px;text-align:center">
          <div style="font-size:20px;margin-bottom:10px">🔕</div>
          <div style="font-size:14px;font-weight:700;color:#E2E8F0;margin-bottom:6px">Silent day</div>
          <div style="font-size:12px;color:#94A3B8">This cohort has no credit-card touch on D+${state.day}.</div>
        </div>
      </div>`;
    return;
  }
  const isNTC = state.cohort === 'NTC';
  const isWA  = msg[0] === 'WhatsApp';

  if (isWA) {
    // WhatsApp-style chat bubble UI
    phone.innerHTML = `
      <div style="height:100%;background:#ECE5DD;display:flex;flex-direction:column">
        <!-- WA header -->
        <div style="background:#075E54;padding:10px 14px;display:flex;align-items:center;gap:10px;flex-shrink:0">
          <div style="width:36px;height:36px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px;color:#fff">M</div>
          <div>
            <div style="font-size:13px;font-weight:700;color:#fff">MobiKwik</div>
            <div style="font-size:10px;color:#B2DFDB">Business Account · WhatsApp</div>
          </div>
          <div style="margin-left:auto;font-size:10px;color:#B2DFDB">D+${state.day}</div>
        </div>
        <!-- Chat area -->
        <div style="flex:1;padding:16px 12px;display:flex;flex-direction:column;justify-content:flex-end;gap:10px">
          <div style="max-width:85%;align-self:flex-start">
            <div style="background:#fff;border-radius:0 12px 12px 12px;padding:12px 14px;box-shadow:0 1px 2px rgba(0,0,0,0.1)">
              <div style="font-size:10px;font-weight:700;color:#075E54;margin-bottom:6px">MobiKwik</div>
              <div style="font-size:13px;color:#111;line-height:1.5;margin-bottom:8px">${esc(msg[1])}</div>
              ${isNTC ? '<div style="font-size:10px;color:#075E54;font-weight:600">→ Routes to SBM Mobikwik First Card only</div>' : ''}
              <div style="background:#25D366;color:#fff;font-size:11px;font-weight:700;padding:8px 12px;border-radius:8px;text-align:center;margin-top:10px;cursor:pointer">Open Mobikwik →</div>
              <div style="font-size:9px;color:#94A3B8;text-align:right;margin-top:6px">✓✓ Delivered</div>
            </div>
          </div>
          <div style="font-size:9px;color:#6B7280;text-align:center;padding:4px 12px;background:rgba(255,255,255,0.6);border-radius:8px;align-self:center">${esc(state.cohort)} cohort · ${cohort.tone}</div>
        </div>
        <!-- WA input bar -->
        <div style="background:#F0F0F0;padding:8px 10px;display:flex;align-items:center;gap:8px;flex-shrink:0">
          <div style="flex:1;background:#fff;border-radius:22px;padding:8px 14px;font-size:11px;color:#999">Message</div>
          <div style="width:36px;height:36px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center">
            <span style="color:#fff;font-size:16px">➤</span>
          </div>
        </div>
      </div>`;
  } else {
    // Push notification lock-screen UI
    phone.innerHTML = `
      <div style="height:100%;background:#1A1A2E;display:flex;flex-direction:column;justify-content:flex-end;padding:24px 20px 40px">
        <div style="font-size:10px;color:#94A3B8;text-align:center;margin-bottom:24px">Lock screen · D+${state.day}</div>
        <div style="background:#1E293B;border-radius:20px;padding:18px;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div style="width:32px;height:32px;border-radius:8px;background:#0055D4;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff">M</div>
            <div>
              <div style="font-size:12px;font-weight:800;color:#E2E8F0">MobiKwik</div>
              <div style="font-size:10px;color:#64748b">Push · now</div>
            </div>
          </div>
          <div style="font-size:13px;color:#E2E8F0;line-height:1.5;margin-bottom:12px">${esc(msg[1])}</div>
          ${isNTC ? '<div style="font-size:10px;color:#60A5FA;font-weight:600">→ Routes to SBM Mobikwik First Card only</div>' : ''}
          <div style="background:#0055D4;color:#fff;font-size:11px;font-weight:800;padding:10px 14px;border-radius:10px;text-align:center;cursor:pointer;margin-top:10px">Open Mobikwik →</div>
        </div>
        <div style="font-size:9px;color:#475569;text-align:center">${esc(state.cohort)} cohort · ${cohort.tone}</div>
      </div>`;
  }
}

// ─── Hook phone ───────────────────────────────────────────────────────────────
// H6: Post-apply referral confirmation screen
function renderP_Referral(phone, cards) {
  const card = cards[0];
  phone.innerHTML = `
    <div style="height:100%;background:#F3F4F6;display:flex;flex-direction:column;overflow:hidden">
      <div style="background:#16A34A;color:#fff;padding:0 0 20px;text-align:center;flex-shrink:0">
        ${mwStatusBar()}
        <div style="padding:14px 16px 0">
          <span class="material-symbols-outlined" style="font-size:44px;display:block;margin-bottom:8px">check_circle</span>
          <div style="font-size:18px;font-weight:900">Application Submitted!</div>
          <div style="font-size:12px;opacity:0.9;margin-top:4px">${card ? esc(card.name) : 'Credit Card'} · Decision in ~10 min</div>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:14px 14px 80px">
        <!-- Hook H6 Referral slot -->
        <div id="p_refGCSlot" class="gc-slot-tappable" style="position:relative;background:linear-gradient(135deg,#FEF9C3,#FEF08A);border:1px solid #FDE047;border-radius:16px;padding:16px;margin-bottom:14px;cursor:pointer;animation:p1Pulse 2.4s ease-in-out infinite">
          <div style="position:absolute;top:-8px;right:10px;background:#0055D4;color:#fff;font-size:9px;font-weight:900;padding:3px 8px;border-radius:99px;letter-spacing:0.06em">${state.hookOverride ? 'H6 · HERE' : '↗ TAP'}</div>
          <div style="font-size:8px;font-weight:500;color:#92400E;letter-spacing:0.04em;margin-bottom:6px">Powered by Great.Cards</div>
          <div style="font-size:15px;font-weight:800;color:#1C1917;margin-bottom:12px;line-height:1.35">${state.hookOverride || 'Refer a friend and earn Mobikwik wallet credit when they apply.'}</div>
          ${[['1 friend applies','₹200 wallet'],['3 friends apply','₹700 total'],['5 friends apply','₹1,000 total']].map(([k,v]) =>
            `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-top:1px solid rgba(0,0,0,0.07)">
              <span style="font-size:12px;color:#44403C">${k}</span>
              <span style="font-size:13px;font-weight:800;color:#0055D4">${v}</span>
            </div>`).join('')}
          <button style="width:100%;margin-top:12px;padding:11px;background:#0055D4;color:#fff;font-weight:800;font-size:13px;border:none;border-radius:10px;cursor:pointer">Copy referral link →</button>
        </div>
        <!-- Transaction detail -->
        <div style="background:#fff;border-radius:14px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
          <div style="font-size:12px;font-weight:700;color:#374151;margin-bottom:10px">Application details</div>
          ${[['Card',card?card.name:'—'],['Bank',card?card.bank:'—'],['Ref No.','GC24091842'],['Submitted','Today, 9:41 AM']].map(([k,v])=>
            `<div style="display:flex;justify-content:space-between;padding:8px 0;border-top:1px solid #E9EDFF;font-size:12px">
              <span style="color:#64748b">${k}</span><span style="font-weight:700;color:#141B2B">${esc(v)}</span>
            </div>`).join('')}
        </div>
      </div>
      ${mwBottomNavReal()}
    </div>`;
}

function renderHookPhone(phone) {
  const h = hooks[state.hook];
  const cards = getCards(PLACEMENTS[0]);
  // Set hookOverride so each P-renderer shows the hook copy in its GC slot
  state.hookOverride = h.copy;
  state.placementClicked = false;
  if      (h.renderFn === 'P10')       renderP10(phone, cards);
  else if (h.renderFn === 'P11')       renderP11(phone, cards);
  else if (h.renderFn === 'P1')        renderP1_Home(phone, cards);
  else if (h.renderFn === 'P8')        renderP8(phone, cards);
  else if (h.renderFn === 'P12')       renderP12(phone, cards);
  else if (h.renderFn === 'Referral')  renderP_Referral(phone, cards);
  // Must clear override AFTER render so template literals above read the value
  state.hookOverride = null;
}

// ─── Phone dispatcher ─────────────────────────────────────────────────────────
function renderPhone() {
  const phone = document.getElementById('phone');
  if (!phone) return;
  if      (state.tab === 'placements')    renderPlacementPhone(phone);
  else if (state.tab === 'notifications') renderNotificationPhone(phone);
  else                                     renderHookPhone(phone);
}

// ─── Placements list (right column) ───────────────────────────────────────────
function renderLeftList() {
  document.querySelectorAll('.tab-pill').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.tab === state.tab)
  );
  const el = document.getElementById('leftList');
  if (state.tab === 'placements') {
    el.innerHTML = `
      <div class="pl-head">Placements · ${PLACEMENTS.length} touchpoints</div>
      <div style="font-size:11px;color:#0055D4;font-weight:700;background:#EEF2FF;border:1px dashed #C7D2FE;border-radius:8px;padding:8px 10px;margin:0 0 10px;display:flex;align-items:center;gap:6px"><span style="font-size:14px">👆</span> Tap any placement, then tap the yellow <span style="background:#FCD34D;color:#1F2937;font-size:9px;font-weight:900;padding:2px 6px;border-radius:99px;letter-spacing:0.06em">↗ TAP</span> tile inside the phone to open the GC catalogue.</div>
      ${PLACEMENTS.map(p => `
        <button class="pl-item ${p.id === state.placement ? 'active' : ''}" data-placement="${p.id}">
          <span class="pl-num">${p.id}</span>
          <span class="pl-body">
            <span class="pl-title">${esc(p.name)}</span>
            <span class="pl-sub">${esc(p.surface)}</span>
          </span>
        </button>`).join('')}`;
  } else if (state.tab === 'notifications') {
    el.innerHTML = `
      <div class="pl-head">Cohort</div>
      <div class="cohort-row">
        ${lensTags.map(c => `<button class="pl-item ${c === state.cohort ? 'active' : ''}" data-cohort="${c}">
          <span class="pl-title">${esc(c)}</span>
          <span class="pl-sub">${esc((notifications[c]||{}).tone || '')}</span>
        </button>`).join('')}
      </div>
      <div class="pl-head" style="margin-top:14px">Day offset <span style="font-size:10px;font-weight:500;color:#94A3B8;margin-left:6px"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:#0055D4;vertical-align:middle;margin-right:3px"></span>fire &nbsp;<span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);vertical-align:middle;margin-right:3px"></span>silent</span></div>
      <div class="day-row">
        ${(()=>{ const n=notifications[state.cohort]||notifications['Score Watcher']; const fireDays=Object.keys(n.days).map(Number); return [0,1,2,3,5,6,7,10,14,30].map(d=>{ const isFire=fireDays.includes(d); const isActive=d===state.day; const ch=isFire?(notifications[state.cohort]||notifications['Score Watcher']).days[d]||[]:[];const title=isFire?`${ch[0]||'Push'} fires`:'Silent day'; return `<button class="chip arc-cell${isFire?' fire':''}${isFire&&ch[0]==='WhatsApp'?' wa':''}${isActive?' active':''}" data-day="${d}" title="${title}">D+${d}${isFire?'<span class="day-fire-dot"></span>':''}</button>`; }).join(''); })()}
      </div>`;
  } else {
    el.innerHTML = `
      <div class="pl-head">Marketing hooks · ${Object.keys(hooks).length} variants</div>
      ${Object.entries(hooks).map(([id, h]) => `
        <button class="pl-item ${id === state.hook ? 'active' : ''}" data-hook="${id}">
          <span class="pl-num">${id.slice(1)}</span>
          <span class="pl-body">
            <span class="pl-title">${esc(h.title)}</span>
            <span class="pl-sub">${esc(h.trigger)} · ${esc(h.lift)}</span>
          </span>
        </button>`).join('')}`;
  }
}

// ─── Inline commentary panel (above placement list) ───────────────────────────
function renderCommentary() {
  const el = document.getElementById('commentaryPanel');
  if (!el) return;

  if (state.tab === 'placements') {
    const p = PLACEMENTS.find(x => x.id === state.placement);
    if (!p || !p.commentary) return;
    const c = p.commentary;
    el.innerHTML = `
      <div class="cm-eyebrow"><span class="cm-arrow">▸</span> Try this</div>
      <h4>${esc(c.title)}</h4>
      <ol>${c.steps.map(s => `<li>${s}</li>`).join('')}</ol>`;
  } else if (state.tab === 'notifications') {
    const n   = notifications[state.cohort] || notifications['Score Watcher'];
    const msg = n.days[state.day];
    const fireDays = Object.keys(n.days).map(Number);
    const isNTC = state.cohort === 'NTC';
    el.innerHTML = `
      <div class="cm-eyebrow"><span class="cm-arrow">▸</span> Try this</div>
      <h4>${esc(state.cohort)} cohort · D+${state.day}</h4>
      <ul>
        <li>${msg ? `Push fires today: <span class="cm-pulse">${esc(msg[0])}</span> — copy mirrors the cohort's earned trigger.` : `Silent day. Cap-rule respects ${esc(n.cap)} — no fatigue.`}</li>
        <li>Tone for ${esc(state.cohort)}: <b>${esc(n.tone)}</b>. Cap: <b>${esc(n.cap)}</b>.</li>
        <li>Touchpoints across 30 days: ${fireDays.map(d => `D+${d}`).join(' · ')}.</li>
        ${isNTC ? '<li>NTC cohort routes to <b>SBM MobiKwik First Card</b> only. GC catalogue excluded — Mobikwik keeps 100% of commission.</li>' : '<li>Switch the day chips below to walk the 30-day arc.</li>'}
      </ul>`;
  } else {
    const h = hooks[state.hook];
    el.innerHTML = `
      <div class="cm-eyebrow"><span class="cm-arrow">▸</span> Try this</div>
      <h4>Hook ${esc(state.hook)} · ${esc(h.title)}</h4>
      <ul>
        <li>Fires on: <span class="cm-pulse">${esc(h.surface)}</span> — the phone shows the actual MobiKwik screen where this hook appears.</li>
        <li>Trigger: <b>${esc(h.trigger)}</b>. Zero user input needed — Mobikwik already has the signal.</li>
        <li>Copy shown: <em>"${esc(h.copy)}"</em></li>
        <li>Cost per card: <span class="cm-pulse">${esc(h.cost)}</span> · Lift: <b>${esc(h.lift)}</b>. ${state.hook==='H4'?'Score-agnostic — FD-backed path works even for NTC users.':state.hook==='H6'?'Referral only fires post-approval — zero funnel friction.':'Switch hooks to compare surfaces and costs side by side.'}</li>
      </ul>`;
  }
}

// ─── Controls setup ───────────────────────────────────────────────────────────
function setupControls() {
  document.getElementById('scoreControls').innerHTML =
    scoreBuckets.map(s => `<button class="chip ${s===state.score?'active':''}" data-score="${s}">${s}</button>`).join('');
  document.getElementById('zipControls').innerHTML =
    zipStatuses.map(z => `<button class="chip ${z===state.zip?'active':''}" data-zip="${z}">${z}</button>`).join('');
  document.getElementById('lensControl').innerHTML =
    lensTags.map(t => `<option${t===state.lens?' selected':''}>${t}</option>`).join('');
  document.getElementById('incomeControl').value = state.income;
  document.getElementById('incomeValue').textContent = `₹${fmt(state.income)}`;
}

// ─── Demo page ────────────────────────────────────────────────────────────────
async function renderDemo() {
  setupControls();
  await loadInitBundle();
  renderLeftList();
  renderPhone();
  renderCommentary();
}

// ─── Homepage formula ─────────────────────────────────────────────────────────
function renderHome() {
  const el = document.getElementById('homeFormula');
  if (!el) return;
  const calc = () => {
    const mau   = Number(document.getElementById('hfMau')?.value   || 3190000);
    const ctr   = Number(document.getElementById('hfCtr')?.value   || 4.5);
    const apply = Number(document.getElementById('hfApply')?.value || 25);
    const appr  = Number(document.getElementById('hfAppr')?.value  || 22.8);
    const comm  = Number(document.getElementById('hfComm')?.value  || 2000);
    const cardsM = mau * ctr/100 * apply/100 * appr/100;
    const annual = cardsM * comm * 12;
    const gcShare = annual * 0.30;
    const out = document.getElementById('hfOut');
    if (out) out.innerHTML = `
      <span class="hf-out-main">${money(cardsM * comm)}<em>/month</em></span>
      <span class="hf-out-sep">·</span>
      <span class="hf-out-mid">${money(annual)}<em>/year gross</em></span>
      <span class="hf-out-sep">·</span>
      <span class="hf-out-acc">GC 30% = ${money(gcShare)}<em>/year</em></span>`;
  };
  el.innerHTML = `
    <div class="hf-inputs">
      <span class="hf-pair"><input id="hfMau"   value="3190000"> <em>MAU</em></span>
      <span class="hf-op">×</span>
      <span class="hf-pair"><input id="hfCtr"   value="4.5"> <em>% CTR</em></span>
      <span class="hf-op">×</span>
      <span class="hf-pair"><input id="hfApply" value="25"> <em>% apply</em></span>
      <span class="hf-op">×</span>
      <span class="hf-pair"><input id="hfAppr"  value="22.8"> <em>% approval</em></span>
      <span class="hf-op">×</span>
      <span class="hf-pair">₹<input id="hfComm" value="2000"> <em>commission</em></span>
    </div>
    <div class="hf-out" id="hfOut"></div>`;
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', calc));
  calc();
}

// ─── Revenue model ────────────────────────────────────────────────────────────
function renderRevenue() {
  const el = document.getElementById('revenueModel');
  if (!el) return;

  const shown    = revenue.mau * revenue.see / 100;
  const clicks   = shown * revenue.click / 100;
  const applies  = clicks * revenue.apply / 100;
  const cards    = applies * revenue.approval / 100;
  const monthly  = cards * revenue.commission;
  const annual   = monthly * 12;
  const gcGross  = annual * revenue.split / 100;
  const mwGross  = annual - gcGross;
  const fixed    = (revenue.team + revenue.infra) * 12;
  const variable = cards * 12 * (revenue.caller + revenue.ops + revenue.hook);
  const cost     = fixed + variable;
  const net      = gcGross - cost;
  const margin   = gcGross > 0 ? Math.round((net / gcGross) * 100) : 0;
  const fixedMo  = revenue.team + revenue.infra;

  // Determine active scenario
  const scen = revenue._scenario || 'conservative';

  el.innerHTML = `
    <div class="rev-grid">
      <!-- LEFT: input rail -->
      <aside class="rev-left">
        <div class="rev-card">
          <p class="rev-card-eyebrow">Scenario</p>
          <div class="rev-scenarios">
            <button class="rev-scen ${scen==='conservative'?'is-on':''}" data-scenario="conservative">Conservative</button>
            <button class="rev-scen ${scen==='realistic'?'is-on':''}" data-scenario="realistic">Realistic</button>
            <button class="rev-scen ${scen==='aggressive'?'is-on':''}" data-scenario="aggressive">Aggressive</button>
          </div>
        </div>

        <div class="rev-card">
          <p class="rev-card-eyebrow">Funnel Inputs</p>

          <p class="rev-group-label">Traffic</p>
          ${slider('Mobikwik MAU',   'mau', revenue.mau,       500000, 5000000, 100000, fmt(revenue.mau))}
          ${slider('% see placement','see', revenue.see,       10,     100,     1,      revenue.see+'%')}

          <p class="rev-group-label">Conversion</p>
          ${slider('Blended CTR',   'click',    revenue.click,    1,    15,   0.5, revenue.click+'%')}
          ${slider('% apply',       'apply',    revenue.apply,    10,   50,   1,   revenue.apply+'%')}
          ${slider('Bank approval', 'approval', revenue.approval, 5,    50,   0.5, revenue.approval+'%')}

          <p class="rev-group-label">Monetization</p>
          ${slider('Commission/card','commission', revenue.commission, 1000, 3500, 100, '₹'+fmt(revenue.commission))}
        </div>

        <div class="rev-card">
          <p class="rev-card-eyebrow">Revenue Split (Mobikwik / GC)</p>
          <div class="rev-split-row">
            <button class="rev-split ${revenue.split===40?'is-on':''}" data-split="40">60 / 40</button>
            <button class="rev-split ${revenue.split===30?'is-on':''}" data-split="30">70 / 30</button>
            <button class="rev-split ${revenue.split===20?'is-on':''}" data-split="20">80 / 20</button>
          </div>
        </div>

        <div class="rev-card">
          <p class="rev-card-eyebrow">GC Fixed Costs / Month</p>
          ${slider('Team + Infra', '_fixed', fixedMo, 200000, 2000000, 50000, '₹'+fmt(fixedMo))}
          <p class="rev-card-eyebrow" style="margin-top:18px">Variable / card</p>
          ${slider('Hook funding','hook', revenue.hook, 0, 600, 25, '₹'+fmt(revenue.hook))}
          ${slider('Ops + caller','_var', (revenue.ops+revenue.caller), 0, 500, 10, '₹'+fmt(revenue.ops+revenue.caller))}
        </div>
      </aside>

      <!-- RIGHT: dashboard -->
      <section class="rev-right">
        <p class="rev-pretitle">Revenue Funnel · adjust assumptions on the left</p>

        <div class="rev-funnel-row">
          <div class="rev-kpi">
            <div class="rev-kpi-num">${fmt(revenue.mau)}</div>
            <div class="rev-kpi-lbl">MOBIKWIK MAU</div>
            <div class="rev-kpi-sub">monthly active users</div>
          </div>
          <div class="rev-funnel-arrow">→</div>
          <div class="rev-kpi">
            <div class="rev-kpi-num">${fmt(clicks)}</div>
            <div class="rev-kpi-lbl">CLICKS / MONTH</div>
            <div class="rev-kpi-sub">${revenue.click}% blended CTR</div>
          </div>
          <div class="rev-funnel-arrow">→</div>
          <div class="rev-kpi">
            <div class="rev-kpi-num">${fmt(cards)}</div>
            <div class="rev-kpi-lbl">CARDS / MONTH</div>
            <div class="rev-kpi-sub">${revenue.approval}% approval</div>
          </div>
        </div>

        <div class="rev-hero-card">
          <div class="rev-hero-top">
            <span class="rev-hero-eyebrow">Gross Commission</span>
            <span class="rev-hero-side">${money(monthly)} / month</span>
          </div>
          <div class="rev-hero-num">${money(annual)}<span class="rev-hero-unit">/ year</span></div>
          <div class="rev-hero-foot">${fmt(cards*12)} cards / year · ₹${fmt(revenue.commission)}/card</div>
        </div>

        <div class="rev-split-cards">
          <div class="rev-side-card">
            <p class="rev-side-eyebrow">Mobikwik Revenue</p>
            <p class="rev-side-meta">${100-revenue.split}% share</p>
            <div class="rev-side-num">${money(mwGross)}</div>
            <p class="rev-side-foot">per year</p>
          </div>
          <div class="rev-side-card gc-accent">
            <p class="rev-side-eyebrow">GC Revenue</p>
            <p class="rev-side-meta">${revenue.split}% share</p>
            <div class="rev-side-num">${money(gcGross)}</div>
            <p class="rev-side-foot">per year</p>
          </div>
        </div>

        <div class="rev-pl">
          <p class="rev-pl-title">GC P&amp;L</p>
          <div class="rev-pl-row">
            <span>Gross Revenue (GC share)</span>
            <span class="rev-pl-mo">${money(gcGross/12)} / mo</span>
            <span class="rev-pl-yr">${money(gcGross)} / yr</span>
          </div>
          <div class="rev-pl-row">
            <span>Fixed Costs</span>
            <span class="rev-pl-mo">${money(fixed/12)} / mo</span>
            <span class="rev-pl-yr">${money(fixed)} / yr</span>
          </div>
          <div class="rev-pl-row">
            <span>Variable Costs</span>
            <span class="rev-pl-mo">${money(variable/12)} / mo</span>
            <span class="rev-pl-yr">${money(variable)} / yr</span>
          </div>
          <div class="rev-pl-row rev-pl-net ${net>=0?'is-pos':'is-neg'}">
            <span><b>Net Profit</b></span>
            <span class="rev-pl-mo"><b>${money(net/12)} / mo</b></span>
            <span class="rev-pl-yr"><b>${money(net)} / yr</b></span>
          </div>
        </div>

        <div class="rev-status ${net>=0?'is-good':'is-bad'}">
          <span class="rev-status-icon">${net>=0?'✓':'⚠️'}</span>
          <span>${net>=0
            ? `Unit positive · GC margin ${margin}% · ${money(fixed/12)}/mo fixed costs covered`
            : `Below unit · shortfall ${money(-net)}/yr · use zero-cost hooks (H1+H4) only`}</span>
        </div>

        <div class="rev-bench">
          <div class="rev-bench-head">
            <span class="rev-bench-title">CTR Benchmarks by Placement</span>
            <span class="rev-bench-sub">blended ${revenue.click}% = mix of active placements</span>
          </div>
          ${benchRow('Post-disbursal thank-you', '8–15%',  'Emotional peak — highest intent')}
          ${benchRow('Loan rejection',           '5–10%',  'Only positive option on screen')}
          ${benchRow('Score-Unlock pulse',       '5–12%',  'Gamified, reward-motivated')}
          ${benchRow('Credit score page',        '2–4%',   'Credit-aware, medium intent')}
          ${benchRow('Sanctioned email',         '2–5%',   'Transactional email benchmark')}
          ${benchRow('Homepage / Trending',      '0.5–1.5%','Passive browse, lowest intent')}
        </div>
      </section>
    </div>
  `;
}

function slider(label, key, value, min, max, step, display) {
  return `<div class="rev-slider">
    <div class="rev-slider-top"><span>${label}</span><b>${display}</b></div>
    <input type="range" class="rev-range" data-rev="${key}" min="${min}" max="${max}" step="${step}" value="${value}">
  </div>`;
}
function benchRow(name, ctr, why) {
  return `<div class="rev-bench-row">
    <div class="rev-bench-left">
      <span class="rev-bench-name">${name}</span>
      <span class="rev-bench-why">${why}</span>
    </div>
    <span class="rev-bench-ctr">${ctr}</span>
  </div>`;
}


// ─── API status ───────────────────────────────────────────────────────────────
async function apiStatus() {
  const dot  = document.getElementById('apiDot');
  const text = document.getElementById('apiText');
  try {
    const res  = await fetch('/api/status');
    const json = await res.json();
    dot.style.background  = json.ok ? '#16A34A' : '#D97706';
    text.textContent      = json.ok ? 'API ready' : 'fallback mode';
  } catch {
    dot.style.background = '#DC2626';
    text.textContent     = 'offline';
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────
function route(path = location.pathname) {
  state.route = ['/', '/demo', '/revenue'].includes(path) ? path : '/404';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const id = state.route === '/404' ? 'notfound' : state.route === '/' ? 'home' : state.route.slice(1);
  document.getElementById(id)?.classList.add('active');
  document.querySelectorAll('[data-nav]').forEach(a =>
    a.classList.toggle('active', a.dataset.nav === state.route)
  );
  document.body.classList.toggle('dark-body', state.route === '/demo');
  if (state.route === '/')        renderHome();
  if (state.route === '/demo')    renderDemo();
  if (state.route === '/revenue') renderRevenue();
}

// ─── Event delegation ─────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const link = e.target.closest('a[data-link]');
  if (link) { e.preventDefault(); history.pushState({}, '', link.getAttribute('href')); route(); return; }
});
window.addEventListener('popstate', () => route());

document.addEventListener('click', e => {
  const score     = e.target.closest('[data-score]')?.dataset.score;
  const zip       = e.target.closest('[data-zip]')?.dataset.zip;
  const tab       = e.target.closest('[data-tab]')?.dataset.tab;
  const placement = e.target.closest('[data-placement]')?.dataset.placement;
  const cohort    = e.target.closest('[data-cohort]')?.dataset.cohort;
  const day       = e.target.closest('[data-day]')?.dataset.day;
  const hook      = e.target.closest('[data-hook]')?.dataset.hook;
  const scenario  = e.target.closest('[data-scenario]')?.dataset.scenario;

  if (score)     { state.score = score; }
  if (zip)       { state.zip   = zip;   }
  if (tab)       { state.tab   = tab;   if (tab === 'placements') { p1State = { step: 0, cats: [], spendByCat: {} }; } }
  if (placement) { state.placement = Number(placement); state.placementClicked = false; p1State = { step: 0, cats: [], spendByCat: {} }; }
  if (cohort)    { state.cohort = cohort; }
  if (day !== undefined && day !== null) { state.day = Number(day); }
  if (hook)      { state.hook = hook; }

  if (score || zip || tab || placement || cohort || day !== undefined || hook) {
    if (score) setupControls();
    if (zip)   setupControls();
    renderLeftList();
    renderPhone();
    renderCommentary();
  }

  if (scenario) {
    const presets = {
      conservative: { mau: 3190000, see: 35, click: 4.5, apply: 25, approval: 22.8, commission: 2000, split: 30, hook: 0 },
      realistic:    { mau: 4500000, see: 50, click: 6,   apply: 28, approval: 30,   commission: 2000, split: 30, hook: 150 },
      aggressive:   { mau: 4500000, see: 65, click: 8,   apply: 32, approval: 32,   commission: 2200, split: 40, hook: 350 },
    };
    Object.assign(revenue, presets[scenario]);
    renderRevenue();
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'incomeControl') {
    state.income = Number(e.target.value);
    document.getElementById('incomeValue').textContent = `₹${fmt(state.income)}`;
    renderPhone();
    renderCommentary();
  }
  const key = e.target.dataset.rev;
  if (key) {
    const v = Number(e.target.value) || 0;
    if (key === '_fixed') {
      revenue.team  = Math.round(v * 0.88);
      revenue.infra = v - revenue.team;
    } else if (key === '_var') {
      revenue.ops    = Math.round(v * 0.4);
      revenue.caller = v - revenue.ops;
    } else {
      revenue[key] = v;
    }
    renderRevenue();
  }
});

document.addEventListener('change', e => {
  if (e.target.id === 'lensControl') {
    state.lens = e.target.value;
    state.cohort = e.target.value;
    renderPhone();
    renderCommentary();
  }
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
(async function boot() {
  apiStatus();
  renderHome();
  route();
  // Pre-load init bundle in background so first demo render gets real card data
  await loadInitBundle();
  if (state.route === '/demo') { renderPhone(); renderCommentary(); }
})();
