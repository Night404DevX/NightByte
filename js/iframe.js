// Iframe Window
const iframeWindow = document.getElementById('iframe-window');
const iframeClose = document.querySelector('.iframe-close');
const iframeFrame = document.getElementById('iframe-frame');
const iframeTitle = document.getElementById('iframe-title');

/**
 * Open an iframe window with a direct URL
 * @param {string} url - URL to load
 * @param {string} title - Window title
 */
window.openIframe = function(url, title = "Window") {
  iframeFrame.src = url;
  iframeTitle.textContent = title;
  iframeWindow.classList.add('open');
};

// Close button
iframeClose.addEventListener('click', () => {
  iframeWindow.classList.remove('open');
  setTimeout(() => iframeFrame.src = '', 400); // clear iframe after animation
});
