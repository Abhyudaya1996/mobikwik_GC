require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

// IMPORTANT: Vercel compatibility
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Config ─────────────────────────────────────────

const BASE_URL = `https://${process.env.BASE_URL}/partner`;
const API_KEY  = process.env.PARTNER_API_KEY;
const TIMEOUT  = 40000;

if (!API_KEY) {
  console.error('❌ PARTNER_API_KEY missing');
}

// ─── Token Cache ────────────────────────────────────

let _token = null;
let _tokenExpiry = 0;
let _initBundle = null;

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token;

  const res = await axios.post(
    `${BASE_URL}/token`,
    { 'x-api-key': API_KEY },
    { timeout: 15000, headers: { 'Content-Type': 'application/json' } }
  );

  const jwt =
    res.data?.data?.jwttoken ||
    res.data?.jwttoken ||
    res.data?.token;

  if (!jwt) throw new Error('Token not found');

  _token = jwt;
  _tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;

  return _token;
}

async function getInitBundle() {
  if (_initBundle) return _initBundle;

  const token = await getToken();
  const res = await axios.get(`${BASE_URL}/cardgenius/init-bundle`, {
    headers: { 'partner-token': token },
    timeout: 30000,
  });

  _initBundle = res.data;
  return _initBundle;
}

// ─── Headers ───────────────────────────────────────

function headers(token) {
  return {
    'partner-token': token,
    'Content-Type': 'application/json',
  };
}

// ─── Error Handler ─────────────────────────────────

function handle(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      const status = err.response?.status || 500;
      res.status(status).json({
        ok: false,
        error: err.message,
      });
    }
  };
}

// ─── Routes ───────────────────────────────────────

// Health
app.get('/api/status', handle(async (_req, res) => {
  await getToken();
  res.json({ ok: true });
}));

// Init
app.get('/api/init', handle(async (_req, res) => {
  const data = await getInitBundle();
  res.json({ ok: true, data });
}));

// Cards
app.post('/api/cards', handle(async (req, res) => {
  const token = await getToken();
  const upstream = await axios.post(
    `${BASE_URL}/cardgenius/cards`,
    req.body,
    { headers: headers(token), timeout: TIMEOUT }
  );
  res.json({ ok: true, data: upstream.data });
}));

// Card detail
app.get('/api/cards/:alias', handle(async (req, res) => {
  const token = await getToken();
  const upstream = await axios.get(
    `${BASE_URL}/cardgenius/cards/${req.params.alias}`,
    { headers: headers(token), timeout: TIMEOUT }
  );
  res.json({ ok: true, data: upstream.data });
}));

// Calculate
app.post('/api/calculate', handle(async (req, res) => {
  const token = await getToken();
  const upstream = await axios.post(
    `${BASE_URL}/cardgenius/calculate`,
    req.body,
    { headers: headers(token), timeout: TIMEOUT }
  );
  res.json({ ok: true, data: upstream.data });
}));

// Eligibility
app.post('/api/eligibility', handle(async (req, res) => {
  const token = await getToken();
  const upstream = await axios.post(
    `${BASE_URL}/cardgenius/eligiblity`,
    req.body,
    { headers: headers(token), timeout: TIMEOUT }
  );
  res.json({ ok: true, data: upstream.data });
}));

// Pincode → city
app.get('/api/city/:pincode', handle(async (req, res) => {
  const { pincode } = req.params;

  const upstream = await axios.get(
    `https://api.postalpincode.in/pincode/${pincode}`
  );

  const result = upstream.data?.[0];

  if (!result || result.Status !== 'Success') {
    return res.json({ ok: false });
  }

  const po = result.PostOffice[0];

  res.json({
    ok: true,
    city: po.District,
    state: po.State,
  });
}));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start Server (LOCAL ONLY) ─────────────────────

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Running on http://localhost:${PORT}`);
  });
}

// REQUIRED FOR VERCEL
module.exports = app;