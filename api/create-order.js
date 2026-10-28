// Vercel Serverless Function: Creates Razorpay Order securely using Orders API
const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Parse request body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  body = body || {};

  const amountINR = Number(body.amountINR) || 1;
  const amountPaise = Math.round(amountINR * 100);

  function getVar(aliases) {
    for (const key of aliases) {
      if (process.env[key]) return process.env[key].trim().replace(/^['"]|['"]$/g, '');
    }
    const envKeys = Object.keys(process.env);
    for (const alias of aliases) {
      const lower = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
      for (const k of envKeys) {
        if (k.toLowerCase().replace(/[^a-z0-9]/g, '') === lower && process.env[k]) {
          return process.env[k].trim().replace(/^['"]|['"]$/g, '');
        }
      }
    }
    return '';
  }

  const keyId = getVar(['RAZORPAY_KEY_ID', 'RAZORPAY_KEY', 'RZP_KEY', 'NEXT_PUBLIC_RAZORPAY_KEY_ID']) || 'rzp_live_TrmHqpHyg2ZHZJ';
  const keySecret = getVar(['RAZORPAY_KEY_SECRET', 'RAZORPAY_SECRET', 'KEY_SECRET', 'RZP_SECRET']) || 'u4usNRIV0EZpUAIYRHEriNXm';

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Razorpay API credentials not configured.' });
  }

  const payload = JSON.stringify({
    amount: amountPaise,
    currency: 'INR',
    receipt: 'rcpt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
    notes: {
      name: body.name || 'Member',
      email: body.email || '',
      phone: body.phone || '',
      focus: body.focus || 'Complete Transformation'
    }
  });

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  return new Promise((resolve) => {
    const rzpReq = https.request('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Basic ${auth}`
      }
    }, (rzpRes) => {
      let rawData = '';
      rzpRes.on('data', chunk => rawData += chunk);
      rzpRes.on('end', () => {
        try {
          const json = JSON.parse(rawData);
          if (rzpRes.statusCode >= 200 && rzpRes.statusCode < 300 && json.id) {
            res.status(200).json({
              success: true,
              order_id: json.id,
              amount: json.amount,
              currency: json.currency,
              key: keyId
            });
          } else {
            console.error('[Razorpay Order Error]', rzpRes.statusCode, rawData);
            res.status(rzpRes.statusCode || 500).json({
              success: false,
              error: json.error ? (json.error.description || json.error.message) : 'Failed to create order on Razorpay',
              raw: json
            });
          }
        } catch (err) {
          res.status(500).json({ success: false, error: 'Invalid response from Razorpay API' });
        }
        resolve();
      });
    });

    rzpReq.on('error', (err) => {
      console.error('[Razorpay Request Error]', err);
      res.status(500).json({ success: false, error: err.message });
      resolve();
    });

    rzpReq.write(payload);
    rzpReq.end();
  });
};

