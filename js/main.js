/**
 * HEW GROUPS - Health, Education, Wealth
 * Modern Animation & Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initAnimatedCounters();
  initHeaderScroll();
  initMobileMenu();
  initCountdown();
  initFaqAccordion();
  initAssessmentCalculator();
  initRegistrationForms();
  initModalHandlers();
  initDynamicDates();
  initButtonRipple();
  initPillarStationedBalloons();
  initAijugaadTextTransition();
  initVideoMarqueeEngine();
});

/* ==========================================================================
   1. SCROLL REVEAL ENGINE (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (!('IntersectionObserver' in window)) {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   2. ANIMATED NUMBER COUNTERS (On Viewport Entry)
   ========================================================================== */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => counterObserver.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-counter')) || 0;
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
  const duration = 1800;
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const currentVal = (target * easedProgress).toFixed(decimals);

    el.textContent = `${prefix}${formatNumber(currentVal)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${prefix}${formatNumber(target.toFixed(decimals))}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

function formatNumber(numStr) {
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/* ==========================================================================
   3. DYNAMIC DATES & SCHEDULE
   ========================================================================== */
function initDynamicDates() {
  const dateElements = document.querySelectorAll('.dynamic-session-date');
  const monthElements = document.querySelectorAll('.dynamic-session-month');

  const now = new Date();
  let targetDate = new Date();

  const dayOfWeek = now.getDay();
  let daysUntilTarget = (6 - dayOfWeek + 7) % 7;
  if (daysUntilTarget === 0) daysUntilTarget = 1;
  targetDate.setDate(now.getDate() + daysUntilTarget);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedDay = getOrdinalNum(targetDate.getDate()) + ' ' + months[targetDate.getMonth()].slice(0, 3);
  const fullMonth = months[targetDate.getMonth()];

  dateElements.forEach(el => el.textContent = formattedDay);
  monthElements.forEach(el => el.textContent = fullMonth);
}

function getOrdinalNum(n) {
  return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
}

/* ==========================================================================
   4. LIVE COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  if (!hoursEl || !minsEl || !secsEl) return;

  let targetTime = sessionStorage.getItem('hew_countdown_target');
  if (!targetTime) {
    targetTime = Date.now() + (5 * 3600 + 42 * 60 + 19) * 1000;
    sessionStorage.setItem('hew_countdown_target', targetTime);
  } else {
    targetTime = parseInt(targetTime, 10);
  }

  function update() {
    const diff = targetTime - Date.now();
    if (diff <= 0) {
      targetTime = Date.now() + 3 * 3600 * 1000;
      sessionStorage.setItem('hew_countdown_target', targetTime);
    }

    const totalSecs = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   5. STICKY HEADER & SCROLL SPY
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentId = '';
    const scrollPos = window.scrollY + 220;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   6. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-drawer .nav-link, .mobile-drawer button');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    const isOpen = drawer.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
  });

  mobileLinks.forEach(item => {
    item.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE HEW SCORE CALCULATOR (With Animated Radial Meter)
   ========================================================================== */
function initAssessmentCalculator() {
  const sliderH = document.getElementById('slider-health');
  const sliderE = document.getElementById('slider-education');
  const sliderW = document.getElementById('slider-wealth');

  const valH = document.getElementById('val-health');
  const valE = document.getElementById('val-education');
  const valW = document.getElementById('val-wealth');

  const scoreEl = document.getElementById('overall-hew-score');
  const circleBar = document.getElementById('score-circle-bar');
  const verdictTitle = document.getElementById('assessment-verdict-title');
  const verdictDesc = document.getElementById('assessment-verdict-desc');
  const applyScoreBtn = document.getElementById('btn-apply-score');

  if (!sliderH || !sliderE || !sliderW) return;

  let currentDisplayedScore = 62;

  function updateSliderFill(slider, color) {
    const min = slider.min || 1;
    const max = slider.max || 10;
    const val = slider.value;
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, rgba(255, 255, 255, 0.12) ${percentage}%, rgba(255, 255, 255, 0.12) 100%)`;
  }

  function smoothCountTo(targetScore) {
    const start = currentDisplayedScore;
    const diff = targetScore - start;
    if (diff === 0) return;
    const duration = 400;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 2);
      const val = Math.round(start + diff * ease);
      scoreEl.textContent = val;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        currentDisplayedScore = targetScore;
        scoreEl.textContent = targetScore;
      }
    }
    requestAnimationFrame(step);
  }

  function recalculate() {
    const h = parseInt(sliderH.value, 10);
    const e = parseInt(sliderE.value, 10);
    const w = parseInt(sliderW.value, 10);

    valH.textContent = `${h}/10`;
    valE.textContent = `${e}/10`;
    valW.textContent = `${w}/10`;

    updateSliderFill(sliderH, 'var(--health)');
    updateSliderFill(sliderE, 'var(--education)');
    updateSliderFill(sliderW, 'var(--wealth)');

    const average = (h + e + w) / 3;
    const minVal = Math.min(h, e, w);
    const balancePenalty = (average - minVal) * 1.5;
    const rawScore = Math.round(((average * 10) - balancePenalty));
    const finalScore = Math.max(10, Math.min(98, rawScore));

    smoothCountTo(finalScore);

    // Update Radial SVG bar stroke:
    // circumference of circle r=55 is 2 * PI * 55 ~= 345.57
    if (circleBar) {
      const circumference = 345.57;
      const offset = circumference - (finalScore / 100) * circumference;
      circleBar.style.strokeDashoffset = offset;

      if (finalScore >= 80) {
        circleBar.style.stroke = 'var(--health)';
      } else if (finalScore >= 50) {
        circleBar.style.stroke = 'var(--primary)';
      } else {
        circleBar.style.stroke = 'var(--wealth)';
      }
    }

    if (minVal === h && h < 6) {
      verdictTitle.textContent = "Your Biggest Area to Improve: Health & Daily Energy";
      verdictDesc.textContent = "Your goals are being slowed down by low energy or poor sleep. Learning simple daily sleep and nutrition habits will give you the stamina you need to do your best work.";
      verdictTitle.style.color = "var(--health-light)";
    } else if (minVal === e && e < 6) {
      verdictTitle.textContent = "Your Biggest Area to Improve: High-Demand Skills";
      verdictDesc.textContent = "You work hard, but your skills are not earning you what you deserve. Learning in-demand digital skills and easy AI tools will help you grow your income much faster.";
      verdictTitle.style.color = "var(--education-light)";
    } else if (minVal === w && w < 6) {
      verdictTitle.textContent = "Your Biggest Area to Improve: Income, Real Estate & Savings";
      verdictDesc.textContent = "You have great energy and drive, but you still rely on only one paycheck. Learning how to build extra income streams and invest in real estate assets will give you true financial peace of mind.";
      verdictTitle.style.color = "var(--wealth-light)";
    } else {
      verdictTitle.textContent = "Great Job: You Have A Solid Foundation!";
      verdictDesc.textContent = "You already have good habits and skills across Health, Education, and Wealth. In this masterclass, Coach Sreenivas Paturi will show you how to take everything to the next level.";
      verdictTitle.style.color = "#ffffff";
    }
  }

  [sliderH, sliderE, sliderW].forEach(input => {
    input.addEventListener('input', recalculate);
  });

  recalculate();

  if (applyScoreBtn) {
    applyScoreBtn.addEventListener('click', () => {
      openBookingModal();
    });
  }
}

/* ==========================================================================
   8. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isAlreadyActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   9. REGISTRATION & VIP PASS ISSUANCE
   ========================================================================== */
function initRegistrationForms() {
  const mainForm = document.getElementById('main-register-form');

  if (mainForm) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmission(mainForm);
    });
  }
}

// ==========================================================================
// PAYMENT CONFIGURATION (TEST MODE: ₹0 | PRODUCTION MODE: ₹199)
// ==========================================================================
const PAYMENT_CONFIG = {
  // SET TO 1 FOR TESTING (Charges ₹1 via Razorpay test/live gateway)
  // CHANGE TO 199 FOR LIVE PRODUCTION (Charges ₹199 via Razorpay)
  amountINR: 1,
  originalPriceINR: 499,

  // Razorpay Gateway Settings (Active when amountINR > 0)
  key: (typeof window !== 'undefined' && window.__ENV && window.__ENV.RAZORPAY_KEY_ID) || 'rzp_live_TrmHqpHyg2ZHZJ',
  currency: 'INR',
  name: 'HEW Groups',
  description: 'Batch #1 Live Transformation Masterclass + Document Kit',
  image: 'assets/logo/HEW-Groups_32x32.png',
  theme: {
    color: '#096410'
  }
};

// ==========================================================================
// EMAILJS AUTOMATION CONFIGURATION (MASTERCLASS DOCUMENT DELIVERY)
// ==========================================================================
const EMAILJS_CONFIG = {
  // Configured with your live credentials & dynamic environment overrides
  publicKey: (typeof window !== 'undefined' && window.__ENV && window.__ENV.EMAILJS_PUBLIC_KEY) || 'ADLPcbBYvbEWCitDI',
  serviceId: (typeof window !== 'undefined' && window.__ENV && window.__ENV.EMAILJS_SERVICE_ID) || 'service_g9bl4go',
  templateId: (typeof window !== 'undefined' && window.__ENV && window.__ENV.EMAILJS_TEMPLATE_ID) || 'template_bz2ad5p',

  // Masterclass Document located in the masterclass folder
  masterclassDocRelativeUrl: 'masterclass/HEW_Groups_Premium_Guide_With_Founder_Photos.pdf',
  masterclassDocName: 'HEW Groups Masterclass Premium Guide (PDF)',

  // Official VIP Community WhatsApp group invite link
  whatsappGroupUrl: 'https://chat.whatsapp.com/DXSQDaEwfrL6Bk8y1jYKWm?s=cl&p=i&ilr=4&iam=0'
};

function applyAppConfig(env) {
  if (!env || typeof env !== 'object') return;
  const clean = (val) => (typeof val === 'string' ? val.trim().replace(/^['"]|['"]$/g, '') : '');

  function isRealKey(val) {
    if (!val || typeof val !== 'string') return false;
    const lower = val.toLowerCase();
    if (lower.includes('your_') || lower.includes('_here') || lower.includes('placeholder') || lower.includes('example')) {
      return false;
    }
    return true;
  }

  const rzpKey = clean(env.RAZORPAY_KEY_ID);
  if (rzpKey && isRealKey(rzpKey) && rzpKey.startsWith('rzp_')) {
    PAYMENT_CONFIG.key = rzpKey;
  }
  const pubKey = clean(env.EMAILJS_PUBLIC_KEY);
  if (pubKey && isRealKey(pubKey)) {
    EMAILJS_CONFIG.publicKey = pubKey;
  }
  const srvId = clean(env.EMAILJS_SERVICE_ID);
  if (srvId && isRealKey(srvId)) {
    EMAILJS_CONFIG.serviceId = srvId;
  }
  const tmplId = clean(env.EMAILJS_TEMPLATE_ID);
  if (tmplId && isRealKey(tmplId)) {
    EMAILJS_CONFIG.templateId = tmplId;
  }
}

// Global environment resolution promise
const envReadyPromise = (async function loadEnvironmentConfig() {
  // 1. If window.__ENV already exists (from js/env-config.js or js/env.js), apply immediately
  if (window.__ENV) {
    applyAppConfig(window.__ENV);
  }

  // 2. If running locally (localhost / 127.0.0.1 / file:), load gitignored js/env.js
  const isLocalEnv =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:';

  if (isLocalEnv && (!window.__ENV || !window.__ENV.EMAILJS_PUBLIC_KEY)) {
    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'js/env.js';
      script.onload = () => {
        if (window.__ENV) applyAppConfig(window.__ENV);
        resolve();
      };
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });
  }

  // 3. When deployed on Vercel or server, fetch environment variables from /api/config serverless function
  if (window.location.protocol.startsWith('http')) {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const remoteEnv = await res.json();
        applyAppConfig(remoteEnv);
      }
    } catch (e) {
      // Offline or local static server without serverless backend
    }
  }
})();

function getMasterclassDocumentUrl(forEmail = false) {
  const relativeUrl = EMAILJS_CONFIG.masterclassDocRelativeUrl || 'masterclass/HEW_Groups_Premium_Guide_With_Founder_Photos.pdf';

  // 1. For in-browser modal: direct relative URL works locally on file://, localhost, and live domains
  if (!forEmail) {
    return relativeUrl;
  }

  // 2. For outbound email delivery:
  const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
  const isLocal =
    !origin ||
    origin === 'null' ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');

  // If live on Vercel or custom domain
  if (!isLocal) {
    const pathname = window.location.pathname || '';
    const basePath = pathname.substring(0, pathname.lastIndexOf('/') + 1);
    return `${origin}${basePath}${relativeUrl}`;
  }

  // When testing locally (localhost / 127.0.0.1 / file:):
  // Provide verified public raw link so emails opened on any device (phone, laptop) download the PDF immediately
  return 'https://github.com/hewgroups/hewgroups/raw/main/masterclass/HEW_Groups_Premium_Guide_With_Founder_Photos.pdf';
}

function ensureRazorpayLoaded() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function ensureEmailJSLoaded() {
  await envReadyPromise;
  return new Promise((resolve) => {
    function initSdk() {
      if (window.emailjs && EMAILJS_CONFIG.publicKey && !EMAILJS_CONFIG.publicKey.includes('YOUR_')) {
        try {
          window.emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
        } catch (e) {
          console.warn('[HEW Groups] EmailJS init note:', e);
        }
      }
      resolve(true);
    }

    if (window.emailjs) {
      initSdk();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => initSdk();
    script.onerror = () => {
      console.warn('[HEW Groups] EmailJS CDN load failed.');
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

async function sendMasterclassEmail(data) {
  await ensureEmailJSLoaded();

  // If credentials are still missing, try re-syncing from window.__ENV or /api/config
  let isConfigured =
    window.emailjs &&
    EMAILJS_CONFIG.publicKey && !EMAILJS_CONFIG.publicKey.includes('YOUR_') &&
    EMAILJS_CONFIG.serviceId && !EMAILJS_CONFIG.serviceId.includes('YOUR_') &&
    EMAILJS_CONFIG.templateId && !EMAILJS_CONFIG.templateId.includes('YOUR_');

  if (!isConfigured) {
    if (window.__ENV) applyAppConfig(window.__ENV);
    if (window.location.protocol.startsWith('http')) {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const remote = await res.json();
          applyAppConfig(remote);
        }
      } catch (e) { }
    }
    isConfigured =
      window.emailjs &&
      EMAILJS_CONFIG.publicKey && !EMAILJS_CONFIG.publicKey.includes('YOUR_') &&
      EMAILJS_CONFIG.serviceId && !EMAILJS_CONFIG.serviceId.includes('YOUR_') &&
      EMAILJS_CONFIG.templateId && !EMAILJS_CONFIG.templateId.includes('YOUR_');
  }

  const docUrl = getMasterclassDocumentUrl(true);
  const templateParams = {
    // Recipient Identification (matches any template variable style)
    name: data.name,
    user_name: data.name,
    to_name: data.name,
    recipient_name: data.name,

    email: data.email,
    user_email: data.email,
    to_email: data.email,
    recipient_email: data.email,
    reply_to: data.email,

    phone: data.phone,
    user_phone: data.phone,
    whatsapp_number: data.phone,

    focus: data.focus,
    focus_area: data.focus,
    ticket_id: data.ticketId,
    ticketId: data.ticketId,
    payment_id: data.paymentId,
    paymentId: data.paymentId,
    amount_paid: data.amountPaid,
    amountPaid: data.amountPaid,

    masterclass_title: 'HEW Groups - Health, Education & Wealth Masterclass',
    document_name: EMAILJS_CONFIG.masterclassDocName,
    document_url: docUrl,
    masterclass_doc_url: docUrl,
    whatsapp_link: EMAILJS_CONFIG.whatsappGroupUrl,
    whatsapp_group: EMAILJS_CONFIG.whatsappGroupUrl,
    session_timing: 'Batch #1 Live Orientation · Sunday 11:00 AM IST'
  };

  if (!isConfigured) {
    console.group('%c[HEW Groups] ⚠️ EmailJS Configuration Notice', 'color: #d97706; font-weight: bold;');
    console.warn('EmailJS keys are missing or unconfigured.');
    console.warn('Set environment variables in Vercel or local .env: EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID.');
    console.info('Current Config Values:', {
      publicKey: EMAILJS_CONFIG.publicKey || '(empty)',
      serviceId: EMAILJS_CONFIG.serviceId || '(empty)',
      templateId: EMAILJS_CONFIG.templateId || '(empty)'
    });
    console.info('Prepared Email Payload:', templateParams);
    console.groupEnd();
    return { success: false, unconfigured: true, payload: templateParams };
  }

  try {
    // 1. Initialize EmailJS instance
    if (window.emailjs && window.emailjs.init) {
      try {
        window.emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
      } catch (e) {
        try { window.emailjs.init(EMAILJS_CONFIG.publicKey); } catch (e2) { }
      }
    }

    // 2. Dispatch with dual v4/v3 compatibility
    let response;
    try {
      response = await window.emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        { publicKey: EMAILJS_CONFIG.publicKey }
      );
    } catch (sendErr) {
      // Fallback: try with plain string public key if SDK build prefers it
      response = await window.emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );
    }

    console.log('[HEW Groups] ✅ Masterclass welcome email sent successfully:', response);
    return { success: true, response };
  } catch (err) {
    console.error('[HEW Groups] ❌ EmailJS delivery failed:', err);
    return { success: false, error: err };
  }
}

async function handleFormSubmission(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalHtml = submitBtn.innerHTML;

  submitBtn.disabled = true;

  const formData = new FormData(form);
  const nameInput = form.querySelector('input[name="name"]') || form.querySelector('input[type="text"]');
  const phoneInput = form.querySelector('input[name="phone"]') || form.querySelector('input[type="tel"]');
  const emailInput = form.querySelector('input[name="email"]') || form.querySelector('input[type="email"]');
  const focusInput = form.querySelector('select[name="focus"]') || form.querySelector('select');

  const name = (nameInput ? nameInput.value.trim() : formData.get('name')) || 'Member';
  const phone = (phoneInput ? phoneInput.value.trim() : formData.get('phone')) || '+91 98765 43210';
  const email = (emailInput ? emailInput.value.trim() : formData.get('email')) || '';
  const focus = (focusInput ? focusInput.value : formData.get('focus')) || 'Complete Transformation (H + E + W)';

  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address to receive your Masterclass Guide.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
    if (emailInput) emailInput.focus();
    return;
  }

  // =========================================================================
  // ZERO-RUPEES TEST MODE (amountINR === 0)
  // Bypasses gateway since gateways do not permit ₹0 charges, issues instant VIP pass
  // and immediately triggers EmailJS Masterclass Document delivery.
  // =========================================================================
  if (PAYMENT_CONFIG.amountINR === 0) {
    submitBtn.innerHTML = `<span>Enrolling & Sending Email...</span>`;

    const ticketData = {
      name,
      phone,
      email,
      focus,
      ticketId: 'HEW-' + Math.floor(100000 + Math.random() * 900000),
      paymentId: 'TEST_FREE_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      amountPaid: '₹0 (Free Test Pass)'
    };

    // Dispatch automated confirmation email with document via EmailJS
    const emailResult = await sendMasterclassEmail(ticketData);

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
    form.reset();
    showConfirmationTicket(ticketData, emailResult);
    return;
  }

  // =========================================================================
  // LIVE PAID CHECKOUT (e.g. ₹199 via Razorpay)
  // =========================================================================
  submitBtn.innerHTML = `<span>Connecting to Razorpay...</span>`;
  await envReadyPromise;
  await ensureRazorpayLoaded();

  // If Razorpay SDK not available or test placeholder key
  if (!window.Razorpay || !PAYMENT_CONFIG.key || PAYMENT_CONFIG.key.includes('YOUR_KEY') || PAYMENT_CONFIG.key === 'rzp_test_YOUR_KEY_HERE') {
    console.info('[HEW Groups] Razorpay Key pending or unavailable. Running fallback simulation.');
    setTimeout(async () => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
      form.reset();

      const ticketData = {
        name,
        phone,
        email,
        focus,
        ticketId: 'HEW-' + Math.floor(100000 + Math.random() * 900000),
        paymentId: 'pay_' + Math.random().toString(36).substring(2, 12).toUpperCase(),
        amountPaid: '₹' + PAYMENT_CONFIG.amountINR
      };

      const emailResult = await sendMasterclassEmail(ticketData);
      showConfirmationTicket(ticketData, emailResult);
    }, 900);
    return;
  }

  // Live/Test Razorpay Checkout integration
  submitBtn.innerHTML = `<span>Connecting to Razorpay...</span>`;

  const cleanPhone = phone.replace(/[^\d+]/g, '');
  let orderId = '';

  // Attempt server-side Order creation (Required by Razorpay Standard Checkout in Live Mode)
  try {
    const orderRes = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amountINR: PAYMENT_CONFIG.amountINR,
        name: name,
        email: email,
        phone: cleanPhone,
        focus: focus
      })
    });

    const resJson = await orderRes.json().catch(() => ({}));
    if (orderRes.ok && resJson.order_id) {
      orderId = resJson.order_id;
      if (resJson.key) {
        PAYMENT_CONFIG.key = resJson.key;
      }
    } else {
      const errorMsg = resJson.error || 'Server could not create Razorpay order.';
      console.error('[HEW Groups] Razorpay order creation failed:', resJson);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
      alert('Payment Error: ' + errorMsg);
      return;
    }
  } catch (e) {
    console.error('[HEW Groups] Order API network error:', e);
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
    alert('Payment Network Error: Could not connect to order server. Please check your connection and try again.');
    return;
  }

  if (!orderId) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
    alert('Payment Error: Missing Razorpay Order ID. Please check server configuration.');
    return;
  }

  const options = {
    key: PAYMENT_CONFIG.key,
    amount: PAYMENT_CONFIG.amountINR * 100, // paise (e.g. 1 * 100 = 100 paise)
    currency: PAYMENT_CONFIG.currency,
    name: PAYMENT_CONFIG.name,
    description: PAYMENT_CONFIG.description,
    order_id: orderId,
    prefill: {
      name: name,
      email: email,
      contact: cleanPhone
    },
    notes: {
      focus_area: focus,
      batch: 'Batch #1'
    },
    theme: PAYMENT_CONFIG.theme,
    handler: async function (response) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
      form.reset();

      const ticketData = {
        name,
        phone,
        email,
        focus,
        ticketId: 'HEW-' + Math.floor(100000 + Math.random() * 900000),
        paymentId: response.razorpay_payment_id || response.razorpay_order_id,
        amountPaid: '₹' + PAYMENT_CONFIG.amountINR
      };

      // Trigger automated email with Masterclass Document via EmailJS
      const emailResult = await sendMasterclassEmail(ticketData);

      showConfirmationTicket(ticketData, emailResult);
    },
    modal: {
      ondismiss: function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
      const desc = response.error ? (response.error.description || response.error.reason || 'Payment could not be completed.') : 'Payment cancelled or failed.';
      console.warn('[Razorpay Payment Failed]', response);
      alert('Payment Note: ' + desc);
    });
    rzp.open();
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
    console.error('Razorpay invocation error:', err);
    alert('Payment Gateway Error: ' + (err.message || 'Could not open Razorpay checkout.'));
  }
}

function showConfirmationTicket(data, emailResult) {
  const modal = document.getElementById('booking-modal') || document.getElementById('bookingModal');
  if (!modal) return;

  let modalBody = document.getElementById('modal-body-content');
  if (!modalBody) {
    const container = modal.querySelector('.modal-container') || modal.querySelector('.modal-content');
    if (container) {
      modalBody = container.querySelector('#modal-body-content');
      if (!modalBody) {
        modalBody = document.createElement('div');
        modalBody.id = 'modal-body-content';
        container.appendChild(modalBody);
      }
    }
  }

  if (!modalBody) return;

  const whatsappUrl = EMAILJS_CONFIG.whatsappGroupUrl;
  const isMailSent = emailResult && emailResult.success;
  const mailErrorMsg = emailResult && emailResult.error ? (typeof emailResult.error === 'string' ? emailResult.error : (emailResult.error.text || emailResult.error.message || '')) : '';

  modalBody.innerHTML = `
    <div style="text-align: center;">
      <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(9, 100, 16, 0.12); border: 1.5px solid var(--health); color: var(--health); display: grid; place-items: center; margin: 0 auto 1.25rem auto;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <span style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; color: var(--health); text-transform: uppercase;">Registration Confirmed !!</span>
      <h3 style="font-family: var(--font-heading); font-size: 1.85rem; color: var(--text-main); margin-top: 0.35rem; font-weight: 700;">Access Issued </h3>
      <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.35rem;">Welcome, <strong>${escapeHtml(data.name)}</strong>. Your pass for <strong>${data.amountPaid}</strong> is confirmed.</p>
    </div>

    <!-- Automated Mail Delivery Notification Banner (Document delivered exclusively to email) -->
    <div style="background: rgba(9, 100, 16, 0.08); border: 1px solid rgba(9, 100, 16, 0.25); border-radius: 12px; padding: 14px 16px; margin: 1rem 0; text-align: left; display: flex; align-items: flex-start; gap: 12px;">
      <div style="color: var(--health); font-size: 1.25rem; flex-shrink: 0; margin-top: 2px;">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
      </div>
      <div>
        <strong style="display: block; font-size: 0.9rem; color: var(--text-main); font-weight: 700;">Sent Exclusively To Your Email!</strong>
        <span style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45; display: block; margin-top: 3px;">
          Your official <strong>Masterclass Document &amp; Guide (PDF)</strong> has been sent directly to <span style="color: var(--health); font-weight: 600;">${escapeHtml(data.email)}</span>. Please check your inbox (and spam folder) to download your exclusive copy.
        </span>
      </div>
    </div>

    <div class="ticket-preview">
      <div class="ticket-header">
        <div>
          <strong style="color: var(--text-main); font-family: var(--font-heading); font-size: 1.05rem; letter-spacing: 0.02em;">HEW Groups · Cohort #1</strong>
          <span style="display: block; font-size: 0.72rem; color: var(--text-dim); margin-top: 2px;">Lead Coach: Sreenivas Paturi</span>
        </div>
        <div class="ticket-id" style="color: var(--primary);">${data.ticketId}</div>
      </div>
      <div class="ticket-detail-row">
        <div>
          <span>ATTENDEE</span>
          <strong>${escapeHtml(data.name)}</strong>
        </div>
        <div>
          <span>FOCUS AREA</span>
          <strong>${escapeHtml(data.focus)}</strong>
        </div>
        <div>
          <span>WHATSAPP</span>
          <strong>${escapeHtml(data.phone)}</strong>
        </div>
        <div>
          <span>PAYMENT STATUS</span>
          <strong style="color: var(--health);">Paid ${data.amountPaid}</strong>
          <span style="display: block; font-size: 0.72rem; color: var(--text-dim); margin-top: 2px; word-break: break-all;">Ref: ${escapeHtml(data.paymentId || 'Confirmed')}</span>
        </div>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem;">
      <!-- Updated Live VIP WhatsApp Group Link -->
      <a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn-primary" style="background: #25D366; box-shadow: 0 10px 25px rgba(37, 211, 102, 0.35); text-align: center; border: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
        Join WhatsApp Group
      </a>

      <button id="btn-add-calendar" class="btn-secondary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Add to Calendar
      </button>
    </div>
  `;

  modal.classList.add('open');

  const calBtn = document.getElementById('btn-add-calendar');
  if (calBtn) {
    calBtn.addEventListener('click', () => {
      const title = encodeURIComponent("HEW Groups - Health, Education & Wealth Live Masterclass");
      const details = encodeURIComponent("Batch #1 Live Transformation Masterclass with Coach Sreenivas Paturi at HEW Groups. Zoom access link sent to WhatsApp.");
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=Zoom`;
      window.open(gcalUrl, '_blank');
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}

/* ==========================================================================
   10. MODAL DIALOG CONTROLS
   ========================================================================== */
function initModalHandlers() {
  const modal = document.getElementById('booking-modal') || document.getElementById('bookingModal');
  const closeBtn = document.getElementById('modal-close-btn') || document.getElementById('modalCloseBtn') || (modal ? modal.querySelector('.modal-close-btn') : null);
  const openTriggers = document.querySelectorAll('.trigger-booking-modal');

  if (!modal) return;

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('.modal-close-btn')) {
      modal.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
}

function openBookingModal() {
  const modal = document.getElementById('booking-modal') || document.getElementById('bookingModal');
  if (!modal) return;
  let modalBody = document.getElementById('modal-body-content');
  if (!modalBody) {
    const container = modal.querySelector('.modal-container') || modal.querySelector('.modal-content');
    if (container) {
      modalBody = container.querySelector('#modal-body-content');
      if (!modalBody) {
        modalBody = document.createElement('div');
        modalBody.id = 'modal-body-content';
        container.appendChild(modalBody);
      }
    }
  }
  if (!modalBody) return;

  const isZeroCost = PAYMENT_CONFIG.amountINR === 0;

  modalBody.innerHTML = `
    <div class="form-header" style="margin-bottom: 1.5rem; text-align: left;">
      <span class="sub-tag">HEW Groups · Cohort #1</span>
      <h3 style="font-size: 1.85rem; font-weight: 700;">Reserve Your Live Seat</h3>
      <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.25rem;">
        Complete details below to confirm your seat. Access &amp; Masterclass Document will be sent directly to your email.
      </p>
    </div>

    <form id="modal-register-form" class="form-grid">
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" name="name" required placeholder="Enter your full name">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>WhatsApp Number</label>
          <input type="tel" name="phone" required placeholder="+91 98765 43210">
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" name="email" required placeholder="you@email.com">
        </div>
      </div>
      <div class="form-group">
        <label>Primary Focus Area</label>
        <select name="focus" required>
          <option value="Complete Transformation (All 3)" selected>Complete Transformation (H + E + W)</option>
          <option value="Health (Energy, Stamina & Longevity)">Health &amp; Bio-Optimization</option>
          <option value="Education (Modern High-Income Skills)">Education &amp; Skill Architecture</option>
          <option value="Wealth (Cashflow, Real Estate & Compounding)">Wealth, Real Estate &amp; Passive Portfolios</option>
        </select>
      </div>
      <button type="submit" id="btn-razorpay-submit" class="btn-primary" style="width: 100%; margin-top: 0.75rem; height: 54px; font-size: 1.05rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
        ${isZeroCost
      ? `<span><s style="opacity: 0.65; margin-right: 6px; text-decoration: line-through;">₹${PAYMENT_CONFIG.originalPriceINR}</s> <strong>Enroll for ₹0/- (Test Pass)</strong></span>`
      : `<span><s style="opacity: 0.65; margin-right: 6px; text-decoration: line-through;">₹${PAYMENT_CONFIG.originalPriceINR}</s> <strong>Pay ₹${PAYMENT_CONFIG.amountINR}/-</strong></span>`
    }
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
      <p class="form-note" style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 0.65rem;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        ${isZeroCost
      ? 'Free Test Registration · Masterclass Document Sent Exclusively to Email'
      : '100% Secure Checkout via Razorpay '}
      </p>
    </form>
  `;

  const newForm = document.getElementById('modal-register-form');
  if (newForm) {
    newForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmission(newForm);
    });
  }

  modal.classList.add('open');
}

/* ==========================================================================
   11. BUTTON RIPPLE EFFECT
   ========================================================================== */
function initButtonRipple() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

  buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;

      const rect = btn.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.style.position = 'absolute';
      circle.style.borderRadius = '50%';
      circle.style.background = 'rgba(255, 255, 255, 0.25)';
      circle.style.transform = 'scale(0)';
      circle.style.animation = 'ripple 0.55s ease-out';
      circle.style.pointerEvents = 'none';

      const existing = btn.querySelector('.ripple-effect');
      if (existing) existing.remove();

      circle.classList.add('ripple-effect');
      btn.appendChild(circle);

      setTimeout(() => circle.remove(), 600);
    });
  });
}

/* ==========================================================================
   12. STATIONED PILLAR BALLOONS HOVER INTERACTION
   ========================================================================== */
function initPillarStationedBalloons() {
  const video = document.querySelector('.hero-bg-video');
  if (video) {
    const handleVideoActive = () => video.classList.add('is-active');
    video.addEventListener('playing', handleVideoActive);
    video.addEventListener('canplay', () => {
      video.play().then(handleVideoActive).catch(() => { });
    });
    video.play().catch(() => { });
  }

  const cards = document.querySelectorAll('.ecosystem-hub-card');
  cards.forEach(card => {
    const balloon = card.querySelector('.pillar-stationed-balloon');
    if (!balloon) return;

    card.addEventListener('mouseenter', () => {
      balloon.style.animation = 'none';
      void balloon.offsetWidth;
      balloon.style.animation = 'balloonHoverPlay 1s ease-in-out infinite alternate';
    });

    card.addEventListener('mouseleave', () => {
      balloon.style.animation = 'none';
      void balloon.offsetWidth;
      balloon.style.animation = 'balloonFloatBob 3.6s ease-in-out infinite alternate';
    });
  });
}

/* ==========================================================================
   AIJUGAAD TEXT TRANSITION ENGINE (Exact "We Are Chefs" Roll & Flip - Staggered)
   ========================================================================== */
function initAijugaadTextTransition() {
  const wordsContainer = document.querySelector('.aijugaad-words-container');
  const singleContainer = document.querySelector('.aijugaad-text-rotator');

  if (wordsContainer) {
    const slots = wordsContainer.querySelectorAll('.aijugaad-word-slot');
    if (!slots.length) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function runWordStagger(initial = false) {
      slots.forEach((slot, idx) => {
        const enterEl = slot.querySelector('.aijugaad-word-enter');
        const exitEl = slot.querySelector('.aijugaad-word-exit');
        if (!enterEl) return;

        const text = enterEl.innerHTML;
        const delaySec = parseFloat(slot.getAttribute('data-delay')) || (idx * 0.18);
        const animDelay = delaySec * 1000;

        const animOptions = {
          duration: 700,
          delay: animDelay,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both'
        };

        if (initial) {
          enterEl.animate([
            { transform: 'translateY(115%) rotate(3deg)', opacity: 0 },
            { transform: 'none', opacity: 1 }
          ], animOptions);
        } else if (exitEl) {
          exitEl.innerHTML = text;
          enterEl.innerHTML = text;

          enterEl.animate([
            { transform: 'translateY(115%) rotate(3deg)', opacity: 0 },
            { transform: 'none', opacity: 1 }
          ], animOptions);

          const exitAnim = exitEl.animate([
            { transform: 'none', opacity: 1 },
            { transform: 'translateY(-115%) rotate(-3deg)', opacity: 0 }
          ], animOptions);

          exitAnim.onfinish = () => {
            exitEl.innerHTML = '';
          };
        }
      });
    }

    // Initial page load staggered roll
    if (!isReducedMotion) {
      runWordStagger(true);
    }

    // Periodic roll one after another (cycle every 3.2s)
    setInterval(() => {
      if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      runWordStagger(false);
    }, 3200);

    return;
  }

  if (singleContainer) {
    const enterEl = singleContainer.querySelector('.aijugaad-text-enter');
    const exitEl = singleContainer.querySelector('.aijugaad-text-exit');
    if (!enterEl || !exitEl) return;

    const text = enterEl.innerHTML;
    const animOptions = {
      duration: 700,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'both'
    };

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isReducedMotion) {
      enterEl.animate([
        { transform: 'translateY(115%) rotate(3deg)', opacity: 0 },
        { transform: 'none', opacity: 1 }
      ], animOptions);
    }

    setInterval(() => {
      if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      exitEl.innerHTML = text;
      enterEl.innerHTML = text;

      enterEl.animate([
        { transform: 'translateY(115%) rotate(3deg)', opacity: 0 },
        { transform: 'none', opacity: 1 }
      ], animOptions);

      const exitAnim = exitEl.animate([
        { transform: 'none', opacity: 1 },
        { transform: 'translateY(-115%) rotate(-3deg)', opacity: 0 }
      ], animOptions);

      exitAnim.onfinish = () => {
        exitEl.innerHTML = '';
      };
    }, 2800);
  }
}

/* ==========================================================================
   COMMUNITY VIDEO MARQUEE ENGINE (Review Layout Reels + Hover/Select Unmute)
   ========================================================================== */
function initVideoMarqueeEngine() {
  const container = document.querySelector('.video-marquee-container');
  if (!container) return;

  const cards = container.querySelectorAll('.video-showcase-card');
  const allVideos = container.querySelectorAll('.showcase-video');
  let selectedCard = null;

  function updateAudioButton(card, isUnmuted) {
    const btn = card.querySelector('.video-volume-btn');
    if (!btn) return;
    const mutedIcon = btn.querySelector('.vol-icon-muted');
    const activeIcon = btn.querySelector('.vol-icon-active');

    if (isUnmuted) {
      btn.classList.add('is-active');
      if (mutedIcon) mutedIcon.style.display = 'none';
      if (activeIcon) activeIcon.style.display = 'block';
    } else {
      btn.classList.remove('is-active');
      if (mutedIcon) mutedIcon.style.display = 'block';
      if (activeIcon) activeIcon.style.display = 'none';
    }
  }

  // High-performance lazy playback: only stream/play videos when approaching viewport
  let videosInitialized = false;
  function startPlayback() {
    if (videosInitialized) return;
    videosInitialized = true;

    allVideos.forEach(v => {
      v.muted = true;
      v.playsInline = true;
      v.loop = true;
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback: start playback on first touch/interaction if browser blocked autoplay
          const startOnInteract = () => {
            v.play().catch(() => { });
            window.removeEventListener('pointerdown', startOnInteract);
            window.removeEventListener('touchstart', startOnInteract);
          };
          window.addEventListener('pointerdown', startOnInteract, { once: true });
          window.addEventListener('touchstart', startOnInteract, { once: true });
        });
      }

      // Safety restart to guarantee continuous start-to-end loop
      v.addEventListener('ended', () => {
        v.currentTime = 0;
        v.play().catch(() => { });
      });
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startPlayback();
          allVideos.forEach(v => v.play().catch(() => { }));
        } else if (videosInitialized) {
          // Pause when completely offscreen to save battery and network bandwidth
          allVideos.forEach(v => v.pause());
        }
      });
    }, { rootMargin: '300px 0px' });
    observer.observe(container);
  } else {
    startPlayback();
  }

  function muteAllExcept(targetCard) {
    cards.forEach(c => {
      if (c !== targetCard) {
        const vid = c.querySelector('.showcase-video');
        if (vid) {
          vid.muted = true;
        }
        c.classList.remove('is-active-sound');
        updateAudioButton(c, false);
      }
    });
  }

  function unmuteCard(card) {
    muteAllExcept(card);
    const video = card.querySelector('.showcase-video');
    if (video) {
      video.muted = false;
      video.volume = 1.0;
      video.play().catch(() => { });
      card.classList.add('is-active-sound');
      updateAudioButton(card, true);
    }
  }

  function muteCard(card) {
    const video = card.querySelector('.showcase-video');
    if (video) {
      video.muted = true;
    }
    card.classList.remove('is-active-sound');
    updateAudioButton(card, false);
  }

  function muteAll() {
    selectedCard = null;
    cards.forEach(c => muteCard(c));
  }

  cards.forEach(card => {
    // Hover: play with sound for this card only (unless another is actively locked)
    card.addEventListener('mouseenter', () => {
      if (!selectedCard || selectedCard === card) {
        unmuteCard(card);
      }
    });

    // Leave: mute sound again unless explicitly selected
    card.addEventListener('mouseleave', () => {
      if (!selectedCard) {
        muteCard(card);
      } else if (selectedCard !== card) {
        muteCard(card);
      }
    });

    // Click / Select: particularly select this video to listen
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const video = card.querySelector('.showcase-video');
      if (!video) return;

      if (selectedCard === card && !video.muted) {
        // Deselect & mute
        selectedCard = null;
        muteCard(card);
      } else {
        // Select particularly & turn sound on
        selectedCard = card;
        unmuteCard(card);
      }
    });

    // Handle clicking the circular audio button directly
    const volBtn = card.querySelector('.video-volume-btn');
    if (volBtn) {
      volBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.click();
      });
    }

    // Keyboard support: Enter or Space
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Click outside: deselect and mute all videos
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      muteAll();
    }
  });

  // Mute all when leaving the tab / browser window
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      muteAll();
    }
  });
  window.addEventListener('blur', () => {
    muteAll();
  });
}
