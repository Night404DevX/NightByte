// Load theme from localStorage if available
const savedColor = localStorage.getItem('themeColor');
const savedBg = localStorage.getItem('themeBg');
if (savedColor && savedBg) {
  document.documentElement.style.setProperty('--accent-1', savedColor);
  document.documentElement.style.setProperty('--accent-2', savedColor);
  document.getElementById('particles').style.background = savedBg;
}

const themeBtn = document.getElementById('theme-toggle');
const themeMenu = document.getElementById('theme-menu');
themeBtn.addEventListener('click', () => {
  themeMenu.style.display = themeMenu.style.display === 'flex' ? 'none' : 'flex';
});

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
const count = 100;
let particleColor = 'rgba(100,210,255,0.7)';
let bgColor = savedBg || '#05060a';

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

for (let i = 0; i < count; i++) {
  particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, dx: (Math.random() - 0.5) * 0.8, dy: (Math.random() - 0.5) * 0.8, size: Math.random() * 2 + 1 });
}

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

const themeOptions = document.querySelectorAll('.theme-option');
themeOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    const color = opt.dataset.color;
    const bg = opt.dataset.bg;
    document.documentElement.style.setProperty('--accent-1', color);
    document.documentElement.style.setProperty('--accent-2', color);
    particleColor = color + 'b3';
    bgColor = bg;
    themeMenu.style.display = 'none';

    themeOptions.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');

    // Save theme to localStorage for persistence across pages
    localStorage.setItem('themeColor', color);
    localStorage.setItem('themeBg', bg);
  });
});

const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });
sections.forEach(sec => observer.observe(sec));
