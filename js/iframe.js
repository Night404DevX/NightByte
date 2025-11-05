// --- IFRAME WINDOW HANDLER ---
(function() {
  const iframeWindow = document.getElementById('iframe-window');
  const iframeClose = document.getElementById('iframe-close');
  const iframeBack = document.getElementById('iframe-back');
  const iframeFrame = document.getElementById('iframe-frame');
  const iframeLoader = document.getElementById('iframe-loader');
  const iframeTitle = document.getElementById('iframe-title');
  const iframeOpenTab = document.getElementById('iframe-open-tab');

  let currentUrl = '';

  // Open function (global)
  window.openIframe = function(url, title = 'Window') {
    // normalize url
    currentUrl = url;
    iframeTitle.textContent = title || url;
    iframeLoader.style.display = 'flex';
    iframeOpenTab.href = url;
    iframeOpenTab.hidden = true;
    iframeOpenTab.classList.remove('show');

    // set src and open window
    iframeFrame.src = url;
    iframeWindow.classList.add('open');
    iframeWindow.setAttribute('aria-hidden', 'false');

    // Add a timeout for load fallback (some sites purposely deny embedding)
    const loadTimeout = setTimeout(() => {
      // if still loading show fallback option
      if (iframeLoader.style.display !== 'none') {
        // show "Open in new tab" fallback
        iframeOpenTab.hidden = false;
        iframeOpenTab.classList.add('show');
        iframeOpenTab.textContent = 'Open in new tab';
        // keep loader visible but indicate user action available
        iframeLoader.textContent = 'Embedding blocked or slow — you can open this in a new tab.';
      }
    }, 3500);

    // on successful load we hide loader and clear timeout
    function onLoad() {
      clearTimeout(loadTimeout);
      iframeLoader.style.display = 'none';
      iframeLoader.textContent = 'Loading…';
      iframeOpenTab.hidden = true;
      iframeOpenTab.classList.remove('show');
      iframeFrame.removeEventListener('load', onLoad);
    }
    iframeFrame.addEventListener('load', onLoad);
  };

  // Close handler
  function closeIframe() {
    iframeWindow.classList.remove('open');
    iframeWindow.setAttribute('aria-hidden', 'true');

    // clear src after animation so content stops playing
    setTimeout(() => {
      iframeFrame.src = '';
      iframeLoader.style.display = 'flex';
      iframeLoader.textContent = 'Loading…';
    }, 320);
  }

  iframeClose.addEventListener('click', closeIframe);
  iframeBack.addEventListener('click', closeIframe);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!iframeWindow.classList.contains('open')) return;
    const within = iframeWindow.contains(e.target);
    // allow clicks on open-in-tab link
    if (!within && e.target !== iframeOpenTab) closeIframe();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && iframeWindow.classList.contains('open')) closeIframe();
  });

  // Accessibility: focus trap basic (put focus to close button on open)
  const obs = new MutationObserver(() => {
    if (iframeWindow.classList.contains('open')) {
      iframeClose.focus();
    }
  });
  obs.observe(iframeWindow, { attributes: true, attributeFilter: ['class'] });
})();
