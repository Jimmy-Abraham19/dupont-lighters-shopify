(function () {
  /* ----- Video rail arrows ----- */
  var rail = document.querySelector('[data-video-rail]');
  if (rail) {
    var track = rail.querySelector('[data-video-track]');
    var prev = rail.querySelector('[data-video-prev]');
    var next = rail.querySelector('[data-video-next]');
    if (track && prev && next) {
      function step() {
        var item = track.querySelector('.video-rail__item');
        if (!item) return 100;
        var styles = window.getComputedStyle(track);
        var gap = parseFloat(styles.columnGap || styles.gap || 24) || 24;
        return item.getBoundingClientRect().width + gap;
      }
      function update() {
        var max = track.scrollWidth - track.clientWidth - 1;
        prev.disabled = track.scrollLeft <= 0;
        next.disabled = track.scrollLeft >= max;
      }
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -step() * 2, behavior: 'smooth' });
      });
      next.addEventListener('click', function () {
        track.scrollBy({ left: step() * 2, behavior: 'smooth' });
      });
      track.addEventListener('scroll', function () { window.requestAnimationFrame(update); });
      window.addEventListener('resize', update);
      update();
      setTimeout(update, 250);
    }
  }

  /* ----- Video modal ----- */
  var modal = document.querySelector('[data-video-modal]');
  var closeBtn = modal ? modal.querySelector('[data-video-close]') : null;
  var placeholder = modal ? modal.querySelector('[data-video-placeholder]') : null;
  var thumbs = document.querySelectorAll('[data-video-src]');

  function openModal(name) {
    if (!modal) return;
    if (placeholder) placeholder.textContent = '“' + name.replace(/-/g, ' ') + '” video preview';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      openModal(thumb.getAttribute('data-video-src') || 'video');
    });
  });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  /* ----- Swatch selection — updates finish label ----- */
  var swatches = document.querySelectorAll('.pdp-swatch');
  var finishLabel = document.querySelector('[data-selected-finish] strong');
  swatches.forEach(function (sw) {
    sw.addEventListener('click', function () {
      swatches.forEach(function (s) { s.classList.remove('is-active'); });
      sw.classList.add('is-active');
      var name = sw.getAttribute('aria-label');
      if (finishLabel && name) finishLabel.textContent = name;
    });
  });
})();
