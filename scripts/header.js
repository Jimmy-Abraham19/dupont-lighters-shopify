// Search panel — open/close + focus management + ESC to dismiss
(function () {
  var openBtn = document.querySelector('[data-search-toggle]');
  var panel = document.querySelector('[data-search-panel]');
  var backdrop = document.querySelector('[data-search-backdrop]');
  var closeBtn = panel ? panel.querySelector('[data-search-close]') : null;
  var input = panel ? panel.querySelector('input[type="search"], input[type="text"]') : null;

  if (!openBtn || !panel) return;

  function open() {
    panel.setAttribute('aria-hidden', 'false');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
    if (input) {
      // delay focus so the slide animation doesn't fight with caret placement
      setTimeout(function () { input.focus(); }, 60);
    }
    document.body.style.overflow = 'hidden';
  }
  function close() {
    panel.setAttribute('aria-hidden', 'true');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var isOpen = panel.getAttribute('aria-hidden') === 'false';
    if (isOpen) close(); else open();
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
