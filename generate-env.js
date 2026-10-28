// generate-env.js - Runs during Vercel Build to bake environment variables into static client config
const fs = require('fs');
const path = require('path');

// 1. Read local .env if present (useful for local builds)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

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

const config = {
  RAZORPAY_KEY_ID: getVar(['RAZORPAY_KEY_ID', 'RAZORPAY_KEY', 'RZP_KEY', 'NEXT_PUBLIC_RAZORPAY_KEY_ID']),
  EMAILJS_PUBLIC_KEY: getVar(['EMAILJS_PUBLIC_KEY', 'EMAILJS_KEY', 'EMAILJS_USER_ID', 'PUBLIC_KEY', 'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY', 'VITE_EMAILJS_PUBLIC_KEY']),
  EMAILJS_SERVICE_ID: getVar(['EMAILJS_SERVICE_ID', 'SERVICE_ID', 'EMAIL_SERVICE_ID', 'NEXT_PUBLIC_EMAILJS_SERVICE_ID', 'VITE_EMAILJS_SERVICE_ID']),
  EMAILJS_TEMPLATE_ID: getVar(['EMAILJS_TEMPLATE_ID', 'TEMPLATE_ID', 'EMAIL_TEMPLATE_ID', 'NEXT_PUBLIC_EMAILJS_TEMPLATE_ID', 'VITE_EMAILJS_TEMPLATE_ID'])
};

const fileContent = `// Auto-generated during build from environment variables\nwindow.__ENV = Object.assign(window.__ENV || {}, ${JSON.stringify(config, null, 2)});\n`;

const targetPath = path.join(__dirname, 'js', 'env-config.js');
fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log('[HEW Groups] Successfully generated js/env-config.js from environment.');

