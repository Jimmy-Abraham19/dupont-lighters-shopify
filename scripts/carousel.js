(function () {
  var rails = document.querySelectorAll('[data-rail]');
  if (!rails.length) return;

  rails.forEach(function (rail) {
    var track = rail.querySelector('[data-rail-track]');
    var prev = rail.querySelector('[data-rail-prev]');
    var next = rail.querySelector('[data-rail-next]');
    if (!track || !prev || !next) return;

    function step() {
      // Scroll by ~one card width (first child + gap)
      var firstCard = track.querySelector('.product-card');
      if (!firstCard) return track.clientWidth * 0.9;
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap || 24) || 24;
      return firstCard.getBoundingClientRect().width + gap;
    }

    function update() {
      var max = track.scrollWidth - track.clientWidth - 1;
      prev.disabled = track.scrollLeft <= 0;
      next.disabled = track.scrollLeft >= max;
    }

    prev.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', function () {
      window.requestAnimationFrame(update);
    });
    window.addEventListener('resize', update);
    // initial state
    update();
    // re-check shortly after layout/images settle
    setTimeout(update, 250);
  });
})();
