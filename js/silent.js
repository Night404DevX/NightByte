// script.js — improved theme + particles handling

// helper: convert hex to rgba string with alpha
function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(100,210,255,${alpha})`; // fallback
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

document.addEventListener('DOMContentLoaded', () => {
  // --- THEME LOADING & PERSISTENCE ---
  const savedColor = localStorage.getItem('themeColor'); // hex like '#64d2ff'
  const savedBg = localStorage.getItem('themeBg');
  const savedText = localStorage.getItem('themeText');

  if (savedColor) {
    document.documentElement.style.setProperty('--accent-1', savedColor);
    document.documentElement.style.setProperty('--accent-2', savedColor);
  }
  if (savedText) {
    document.documentElement.style.setProperty('--text', savedText);
  }
  // we keep bg handling for the particle canvas; CSS var --bg can be overridden too
  if (savedBg) {
    document.documentElement.style.setProperty('--bg', savedBg);
  }

  // --- PARTICLES SETUP ---
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 100;

  // Determine initial colors (fall back to CSS var)
  const getComputedAccent = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--accent-1').trim();
    return v || '#64d2ff';
  };
  const getComputedBg = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    return v || '#05060a';
  };

  let particleColor = hexToRgba(savedColor || getComputedAccent(), 0.7);
  let bgColor = savedBg || getComputedBg();

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // init particles
  function initParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.8,
        dy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1
      });
    }
  }
  initParticles();

  function draw() {
    // fill background (use bgColor)
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw particles using particleColor
    ctx.fillStyle = particleColor;
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    }
  }

  function loop() {
    draw();
    update();
    requestAnimationFrame(loop);
  }
  loop();

  // --- THEME MENU / PRESET THEME HANDLING ---
  const themeMenu = document.getElementById('theme-menu');
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn && themeBtn.addEventListener('click', () => {
    themeMenu.style.display = themeMenu.style.display === 'flex' ? 'none' : 'flex';
  });

  function applyTheme(hexColor, bg) {
  if (!hexColor) return;

  // Apply accent color
  document.documentElement.style.setProperty('--accent-1', hexColor);
  document.documentElement.style.setProperty('--accent-2', hexColor);

  // Handle background color
  if (bg) {
    document.documentElement.style.setProperty('--bg', bg);
    bgColor = bg;
  } else {
    bgColor = getComputedBg();
  }

  // Auto-adjust text color for readability
  // Convert bg to RGB so we can estimate brightness
  const rgb = bgColor.replace(/[^\d,]/g, '').split(',');
  let brightness = 0;
  if (rgb.length >= 3) {
    brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
  }

  // If background is dark → use white text; else → use black text
  const textColor = brightness

  // wire up preset theme options
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const color = opt.dataset.color;
      const bg = opt.dataset.bg;
      applyTheme(color, bg);

      // active state
      themeOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      // close menu
      if (themeMenu) themeMenu.style.display = 'none';
    });
  });

  // Custom Theme Creator (if you added elements)
  const customBtn = document.getElementById('custom-theme-btn');
  const customPopup = document.getElementById('custom-theme-popup');
  const applyCustomBtn = document.getElementById('apply-custom-theme');
  if (customBtn && customPopup && applyCustomBtn) {
    customBtn.addEventListener('click', () => {
      customPopup.style.display = customPopup.style.display === 'flex' ? 'none' : 'flex';
    });

    applyCustomBtn.addEventListener('click', () => {
      const accent = document.getElementById('custom-accent').value;
      const bg = document.getElementById('custom-bg').value;
      const text = document.getElementById('custom-text').value;

      document.documentElement.style.setProperty('--accent-1', accent);
      document.documentElement.style.setProperty('--accent-2', accent);
      document.documentElement.style.setProperty('--bg', bg);
      document.documentElement.style.setProperty('--text', text);

      particleColor = hexToRgba(accent, 0.7);
      bgColor = bg;

      localStorage.setItem('themeColor', accent);
      localStorage.setItem('themeBg', bg);
      localStorage.setItem('themeText', text);

      customPopup.style.display = 'none';
    });
  }

  // If themeColor changes elsewhere (e.g., other scripts), keep particles in sync:
  // Observe changes to the --accent-1 CSS variable using a MutationObserver on documentElement.style would be brittle.
  // Instead, provide a small API function window.setThemeFromHex to update both CSS vars and particles:
  window.setThemeFromHex = function(hexColor, bg) {
    applyTheme(hexColor, bg);
  };

  // --- Fade-in IntersectionObserver (sections) ---
  const sections = document.querySelectorAll('section.fade-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.2 });
  sections.forEach(sec => observer.observe(sec));
});
