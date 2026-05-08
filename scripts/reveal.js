/* =========================================================
   DuPont Lighters — Reveal-on-scroll
   Subtle fade + lift + blur. Once per element. Respects
   prefers-reduced-motion. Filter is removed after the
   transition so the GPU isn't paying for a permanent blur.

   Public API (after DOMContentLoaded):
     window.cwReveal.observe(element, { delay })
   Useful for elements added to the DOM after init
   (e.g. infinite-scroll cards).
   ========================================================= */
(function () {
  'use strict';

  var REDUCED = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function markVisibleNow(el) {
    el.classList.add('reveal', 'is-visible');
    el.style.filter = 'none';
  }

  /* Keep the observer module-scoped so the public API can use it. */
  var observer = null;

  function attachClear(el) {
    var clear = function () {
      el.style.filter = 'none';
      el.style.willChange = 'auto';
      el.removeEventListener('transitionend', clear);
    };
    el.addEventListener('transitionend', clear);
    var delay = parseInt(el.style.transitionDelay, 10) || 0;
    setTimeout(clear, 1500 + delay);
  }

  function makeObserver() {
    return new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        obs.unobserve(el);
        attachClear(el);
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });
  }

  function observeOne(el, opts) {
    if (!el) return;
    el.classList.add('reveal');
    if (opts && typeof opts.delay === 'number') {
      el.style.transitionDelay = opts.delay + 'ms';
    }
    if (REDUCED || typeof IntersectionObserver === 'undefined') {
      markVisibleNow(el);
      return;
    }
    if (!observer) observer = makeObserver();
    observer.observe(el);
  }

  function init() {
    /* Reduced motion: skip animations entirely. */
    if (REDUCED) {
      document.querySelectorAll('[data-reveal]').forEach(markVisibleNow);
      document.querySelectorAll('[data-reveal-stagger]').forEach(function (parent) {
        Array.prototype.forEach.call(parent.children, markVisibleNow);
      });
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('[data-reveal]').forEach(markVisibleNow);
      document.querySelectorAll('[data-reveal-stagger]').forEach(function (parent) {
        Array.prototype.forEach.call(parent.children, markVisibleNow);
      });
      return;
    }

    observer = makeObserver();

    /* Single elements */
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });

    /* Staggered containers — children cascade in */
    document.querySelectorAll('[data-reveal-stagger]').forEach(function (parent) {
      var step = parseInt(parent.getAttribute('data-reveal-stagger'), 10);
      if (isNaN(step) || step < 0) step = 110;
      Array.prototype.forEach.call(parent.children, function (child, i) {
        child.classList.add('reveal');
        child.style.transitionDelay = (i * step) + 'ms';
        observer.observe(child);
      });
    });
  }

  /* Expose a tiny API for dynamic content. */
  window.cwReveal = {
    observe: observeOne
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
