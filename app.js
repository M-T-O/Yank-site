/**
 * YANKI: 2045'e 5 Dakika - Etkileşimli Ekolojik Hesaplayıcı & Farkındalık Portalı
 * Sosyal Farkındalık ve Gezegensel Eşik Simülasyonu
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initCalculator();
  initMobileNav();
  initScrollHeader();
});

/* ==========================================================================
   1. CANLI SAYAÇ: 2045 İKLİM EŞİĞİNE KALAN EKOLOJİK SÜRE
   ========================================================================== */
function initCountdown() {
  const targetDate = new Date('2045-01-01T00:00:00Z').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      const banner = document.getElementById('countdown-digits');
      if (banner) banner.innerHTML = '<span>2045 EŞİĞİ AŞILDI</span>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dEl = document.getElementById('count-days');
    const hEl = document.getElementById('count-hours');
    const mEl = document.getElementById('count-mins');
    const sEl = document.getElementById('count-secs');

    if (dEl) dEl.textContent = days.toLocaleString('tr-TR');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');

    // Header mini countdown
    const headerEl = document.getElementById('header-live-countdown');
    if (headerEl) {
      headerEl.textContent = `${days.toLocaleString('tr-TR')} Gün ${hours}s`;
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. INTERACTIVE WIDGET 1: 2045 GÜNDELİK FATURA VE ETKİ HESAPLAYICI
   ========================================================================== */
function initCalculator() {
  // 5 Habits data definitions
  const habitImpacts = {
    transport: {
      a: { co2: 1450, waste: 0, water: 0, score: 0 },      // Car/Taxi
      b: { co2: -1100, waste: 0, water: 0, score: 20 }     // Rail/Walk
    },
    cup: {
      a: { co2: 45, waste: 730, water: 5800, score: 0 },    // 2 cups/day
      b: { co2: 0, waste: 0, water: 0, score: 20 }          // Steel thermos
    },
    lunch: {
      a: { co2: 120, waste: 365, water: 2400, score: 0 },   // Takeout plastic
      b: { co2: 0, waste: 0, water: 0, score: 20 }          // Home meal / porcelain
    },
    fashion: {
      a: { co2: 320, waste: 24, water: 18000, score: 0 },   // Fast fashion
      b: { co2: -150, waste: 0, water: 0, score: 20 }       // Repair/Tailor
    },
    energy: {
      a: { co2: 340, waste: 0, water: 0, score: 0 },        // AC 18C + 4K stream
      b: { co2: 0, waste: 0, water: 0, score: 20 }          // Ventilation + detox
    }
  };

  const currentChoices = {
    transport: 'a',
    cup: 'a',
    lunch: 'a',
    fashion: 'a',
    energy: 'a'
  };

  const inputs = document.querySelectorAll('input[type="radio"]');
  const resetBtn = document.getElementById('calc-reset-btn');

  function calculate() {
    let totalCo2 = 0;
    let totalWaste = 0;
    let totalWater = 0;
    let totalScore = 0;

    Object.keys(currentChoices).forEach(habit => {
      const choice = currentChoices[habit];
      const data = habitImpacts[habit][choice];
      totalCo2 += data.co2;
      totalWaste += data.waste;
      totalWater += data.water;
      totalScore += data.score;
    });

    // Update numbers with animation
    animateValue('res-co2', totalCo2, ' kg');
    animateValue('res-waste', totalWaste, ' adet');
    animateValue('res-water', totalWater, ' L');
    animateValue('res-score', totalScore, '');

    // Dial graphic update (circumference ~ 408)
    const dialCircle = document.getElementById('dial-progress-circle');
    if (dialCircle) {
      const circumference = 408;
      const offset = circumference - (totalScore / 100) * circumference;
      dialCircle.style.strokeDashoffset = offset;

      if (totalScore <= 20) {
        dialCircle.style.stroke = '#f43f5e'; // red
      } else if (totalScore <= 60) {
        dialCircle.style.stroke = '#f59e0b'; // amber
      } else {
        dialCircle.style.stroke = '#10b981'; // emerald
      }
    }

    // Evaluation text
    const evalTag = document.getElementById('res-eval-tag');
    if (evalTag) {
      evalTag.className = 'score-evaluation';
      if (totalScore <= 20) {
        evalTag.classList.add('eval-critical');
        evalTag.textContent = 'Kritik Ekolojik İflas (Plastik Şafak)';
      } else if (totalScore <= 40) {
        evalTag.classList.add('eval-warning');
        evalTag.textContent = 'Yüksek Antropojenik Yük';
      } else if (totalScore <= 70) {
        evalTag.classList.add('eval-good');
        evalTag.textContent = 'Dönüşüm Eşiğinde Denge';
      } else {
        evalTag.classList.add('eval-regenerative');
        evalTag.textContent = 'Simbiyoz ve Onarım Potansiyeli 🌿';
      }
    }

    // Update UI selected classes
    document.querySelectorAll('.toggle-option').forEach(card => {
      const input = card.querySelector('input');
      if (input && input.checked) {
        if (input.value === 'a') {
          card.classList.add('selected-destructive');
          card.classList.remove('selected-regenerative');
        } else {
          card.classList.add('selected-regenerative');
          card.classList.remove('selected-destructive');
        }
      } else {
        card.classList.remove('selected-destructive', 'selected-regenerative');
      }
    });
  }

  inputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const name = e.target.name;
      const value = e.target.value;
      if (currentChoices[name] !== undefined) {
        currentChoices[name] = value;
        calculate();
      }
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('input[type="radio"][value="b"]').forEach(radio => {
        radio.checked = true;
        currentChoices[radio.name] = 'b';
      });
      calculate();
      showToast('Ekolojik seçimler maksimum onarıma ayarlandı (Simbiyoz Senaryosu).');
    });
  }

  calculate();
}

function animateValue(elementId, endValue, suffix = '') {
  const obj = document.getElementById(elementId);
  if (!obj) return;
  const startValue = parseInt(obj.getAttribute('data-val') || '0', 10);
  obj.setAttribute('data-val', endValue);

  const duration = 500;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const current = Math.floor(progress * (endValue - startValue) + startValue);
    obj.textContent = current.toLocaleString('tr-TR') + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = endValue.toLocaleString('tr-TR') + suffix;
    }
  }

  window.requestAnimationFrame(step);
}

/* ==========================================================================
   PARTICLE / CONFETTI FIREWORKS
   ========================================================================== */
function triggerCelebration() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#10b981', '#06b6d4', '#34d399', '#f59e0b', '#38bdf8', '#ffffff'];

  for (let i = 0; i < 75; i++) {
    particles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight * 0.7,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.alpha -= 0.012;
      p.rotation += p.vRot;

      if (p.alpha > 0) {
        activeCount++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (activeCount > 0) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(frame);
}

/* ==========================================================================
   TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>◈</span> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   NAVIGATION & SCROLL EFFECTS
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const links = document.getElementById('nav-links-menu');

  if (toggleBtn && links) {
    toggleBtn.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
      });
    });
  }
}

function initScrollHeader() {
  const header = document.querySelector('.top-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}
