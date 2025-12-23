document.addEventListener('DOMContentLoaded', () => {
  const savedFaviconUrl = localStorage.getItem('faviconUrl');
  const savedTitle = localStorage.getItem('pageTitle');
  const savedKeybind = localStorage.getItem('keybind');
  const savedCustomUrl = localStorage.getItem('customUrl');
  const savedTheme = localStorage.getItem('siteTheme');

  if (savedFaviconUrl) {
    let link = document.querySelector('link[rel="shortcut icon"]') || document.createElement('link');
    link.rel = 'shortcut icon';
    link.href = savedFaviconUrl;
    document.head.appendChild(link);
  }

  if (savedTitle) {
    document.title = savedTitle;
  }

  if (savedKeybind && savedCustomUrl) {
    document.addEventListener('keydown', (e) => {
      if (e.key === savedKeybind) {
        window.open(savedCustomUrl, '_blank');
      }
    });
  }

  const anticloseCheckbox = document.getElementById('anticlose');
  const ANTICLOSE_STORAGE_KEY = 'anticloseEnabled';

  if (anticloseCheckbox) {
    const savedAnticloseState = localStorage.getItem(ANTICLOSE_STORAGE_KEY);
    if (savedAnticloseState !== null) {
      anticloseCheckbox.checked = savedAnticloseState === 'true';
    }

    anticloseCheckbox.addEventListener('change', () => {
      localStorage.setItem(ANTICLOSE_STORAGE_KEY, anticloseCheckbox.checked.toString());
      updateAnticloseHandler();
    });
  }

  function updateAnticloseHandler() {
    const isAnticloseEnabled = localStorage.getItem(ANTICLOSE_STORAGE_KEY) === 'true';
    
    if (isAnticloseEnabled) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    } else {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }

  function handleBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave? Your work may not be saved.';
    return e.returnValue;
  }

  updateAnticloseHandler();

  const themeDropdown = document.getElementById('themee');

  function loadParticlesConfig(theme) {
    const configMap = {
      'dark': '/dark.json',
      'light': '/light.json',
      'mexi': '/mexi.json',
      'bubblegum': '/bubblegum.json',
      'brunys': '/brunys.json',
      'evergreen': '/evergreen.json',
      'frogiee': '/frogiee.json',
      'lavender': '/lavender.json',
      'solarflare': '/solarflare.json',
      'moonlight': '/moonlight.json',
      'v1': null,
      'default': '/particlesjs-config.json'
    };

    const existingCanvas = document.querySelector('#particles-js canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    const configFile = configMap[theme];
    if (configFile && typeof particlesJS !== 'undefined') {
      particlesJS.load('particles-js', configFile, function() {
        console.log(`Particles.js config loaded: ${configFile}`);
      });
    }
  }

  const themeToApply = savedTheme || 'default';
  document.documentElement.setAttribute('data-theme', themeToApply);
  
  if (themeDropdown) {
    themeDropdown.value = themeToApply;
    themeDropdown.addEventListener('change', () => {
      const selectedTheme = themeDropdown.value;
      document.documentElement.setAttribute('data-theme', selectedTheme);
      localStorage.setItem('siteTheme', selectedTheme);
      loadParticlesConfig(selectedTheme);
    });
  }

  loadParticlesConfig(themeToApply);
});