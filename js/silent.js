// =======================
// Variables
// =======================
const themeBtn = document.getElementById('theme-toggle');
const themeMenu = document.getElementById('theme-menu');
const themeOptions = document.querySelectorAll('.theme-option');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
const count = 100;
let particleColor = '#64d2ffB3';
let bgColor = '#05060a';

// =======================
// Load saved theme
// =======================
const savedColor = localStorage.getItem('themeColor');
const savedBg = localStorage.getItem('themeBg');

if (savedColor && savedBg) {
  document.documentElement.style.setProperty('--accent-1', savedColor);
  document.documentElement.style.setProperty('--accent-2', savedColor);
  canvas.style.background = savedBg;
  particleColor = savedColor + 'B3';
  bgColor = savedBg;

  // Highlight active theme
  themeOptions.forEach(opt => {
    if (opt.dataset.color === savedColor) opt.classList.add('active');
  });
}

// =======================
// Theme menu toggle
// =======================
themeBtn.addEventListener('click', () => {
  themeMenu.classList.toggle('open');
});

// =======================
// Close theme menu when clicking outside
// =======================
document.addEventListener('click', (e) => {
  if (!themeBtn.contains(e.target) && !themeMenu.contains(e.target)) {
    themeMenu.classList.remove('open');
  }
});

// =======================
// Theme selection
// =======================
themeOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    const color = opt.dataset.color;
    const bg = opt.dataset.bg;

    // Change CSS variables
    document.documentElement.style.setProperty('--accent-1', color);
    document.documentElement.style.setProperty('--accent-2', color);

    // Change particle and background colors
    particleColor = color + 'B3';
    bgColor = bg;
    canvas.style.background = bg;

    // Mark active
    themeOptions.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');

    // Save theme
    localStorage.setItem('themeColor', color);
    localStorage.setItem('themeBg', bg);
  });
});

// =======================
// Particle setup
// =======================
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Initialize particles
for (let i = 0; i < count; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: (Math.random() - 0.5) * 0.8,
    dy: (Math.random() - 0.5) * 0.8,
    size: Math.random() * 2 + 1
  });
}

// Draw particles
function draw() {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = particleColor;
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Update particle positions
function update() {
  for (const p of particles) {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  }
}

// Animation loop
function loop() {
  draw();
  update();
  requestAnimationFrame(loop);
}
loop();
