// Vercel Serverless Function: Exposes environment variables to client
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  function isRealKey(val) {
    if (!val || typeof val !== 'string') return false;
    const v = val.trim().toLowerCase();
    if (v.includes('your_') || v.includes('_here') || v.includes('placeholder') || v.includes('example')) {
      return false;
    }
    return true;
  }

  function getVar(aliases, fallback) {
    for (const key of aliases) {
      if (process.env[key] && isRealKey(process.env[key])) {
        return process.env[key].trim().replace(/^['"]|['"]$/g, '');
      }
    }
    const envKeys = Object.keys(process.env);
    for (const alias of aliases) {
      const lower = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
      for (const k of envKeys) {
        if (k.toLowerCase().replace(/[^a-z0-9]/g, '') === lower && process.env[k] && isRealKey(process.env[k])) {
          return process.env[k].trim().replace(/^['"]|['"]$/g, '');
        }
      }
    }
    return fallback || '';
  }

  const razorpayKey = getVar(['RAZORPAY_KEY_ID', 'RAZORPAY_KEY', 'RZP_KEY', 'NEXT_PUBLIC_RAZORPAY_KEY_ID'], 'rzp_live_TrmHqpHyg2ZHZJ');
  const publicKey = getVar(['EMAILJS_PUBLIC_KEY', 'EMAILJS_KEY', 'EMAILJS_USER_ID', 'PUBLIC_KEY', 'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY', 'VITE_EMAILJS_PUBLIC_KEY'], 'ADLPcbBYvbEWCitDI');
  const serviceId = getVar(['EMAILJS_SERVICE_ID', 'SERVICE_ID', 'EMAIL_SERVICE_ID', 'NEXT_PUBLIC_EMAILJS_SERVICE_ID', 'VITE_EMAILJS_SERVICE_ID'], 'service_g9bl4go');
  const templateId = getVar(['EMAILJS_TEMPLATE_ID', 'TEMPLATE_ID', 'EMAIL_TEMPLATE_ID', 'NEXT_PUBLIC_EMAILJS_TEMPLATE_ID', 'VITE_EMAILJS_TEMPLATE_ID'], 'template_bz2ad5p');

  return res.status(200).json({
    RAZORPAY_KEY_ID: razorpayKey,
    EMAILJS_PUBLIC_KEY: publicKey,
    EMAILJS_SERVICE_ID: serviceId,
    EMAILJS_TEMPLATE_ID: templateId
  });
};
