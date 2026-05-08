/* =========================================================
   DuPont Lighters — PLP infinite scroll
   Watches a sentinel below the grid; when it comes into
   view, appends the next batch of products. Hooks into
   reveal.js so newly added cards animate in.
   ========================================================= */
(function () {
  'use strict';

  /* Pool of products. The first six match the cards already
     rendered in the HTML; the rest provide additional variety
     for subsequent batches. */
  var POOL = [
    { name: 'Ligne 2 Atelier Brushed',     price: '$1,750.00', primary: 'ligne-2-palladium',     alt: 'ligne-2-palladium-alt' },
    { name: 'Maxijet Black Lacquer',       price: '$425.00',   primary: 'limited-editions',      alt: 'limited-editions-alt' },
    { name: 'Ligne 2 Soubrény',            price: '$2,180.00', primary: 'ligne-2-gold-guilloche', alt: 'ligne-2-gold-guilloche-alt' },
    { name: 'Slim 7 Onyx Lacquer',         price: '$2,450.00', primary: 'limited-serpent',       alt: 'limited-serpent-alt' },
    { name: 'Ligne D Atelier Edition',     price: '$1,890.00', primary: 'ligne-d-initial',       alt: 'ligne-d-initial-alt' },
    { name: 'Maxijet Champagne Gold',      price: '$485.00',   primary: 'limited-editions',      alt: 'limited-editions-alt' },
    { name: 'Ligne 2 Diamond Head',        price: '$3,250.00', primary: 'ligne-2-palladium',     alt: 'ligne-2-palladium-alt' },
    { name: 'Slim 7 Lacquer & Palladium',  price: '$2,650.00', primary: 'limited-serpent',       alt: 'limited-serpent-alt' },
    { name: 'Ligne D Pure Black',          price: '$995.00',   primary: 'ligne-d-initial',       alt: 'ligne-d-initial-alt' },
    { name: 'Ligne 2 Vertigo',             price: '$2,950.00', primary: 'ligne-2-gold-guilloche', alt: 'ligne-2-gold-guilloche-alt' },
    { name: 'Année du Dragon',             price: '$3,950.00', primary: 'limited-editions',      alt: 'limited-editions-alt' },
    { name: 'Maxijet Steel Brushed',       price: '$395.00',   primary: 'ligne-d-initial',       alt: 'ligne-d-initial-alt' }
  ];

  var BATCH_SIZE = 4;
  var MAX_BATCHES = 4;

  function buildCard(p) {
    var card = document.createElement('a');
    card.className = 'product-card';
    card.href = 'product.html';
    card.innerHTML =
      '<div class="product-card__media">' +
        '<img class="product-card__media-primary" src="images/products/' + p.primary + '.webp" alt="' + p.name + ' lighter">' +
        '<img class="product-card__media-alt" src="images/products/' + p.alt + '.webp" alt="" aria-hidden="true">' +
      '</div>' +
      '<div class="product-card__body">' +
        '<h3 class="product-card__name">' + p.name + '</h3>' +
        '<p class="product-card__price">' + p.price + '</p>' +
      '</div>';
    return card;
  }

  function init() {
    var grid = document.querySelector('.product-grid--plp');
    var sentinel = document.querySelector('[data-plp-sentinel]');
    var endNote = document.querySelector('[data-plp-end]');
    var spinner = document.querySelector('[data-plp-spinner]');
    if (!grid || !sentinel) return;

    var poolIdx = 0;
    var batchesLoaded = 0;
    var loading = false;

    function appendNextBatch() {
      if (loading || batchesLoaded >= MAX_BATCHES) return;
      loading = true;
      if (spinner) spinner.style.display = 'flex';

      /* Small delay so it feels like content is fetching, not a flash. */
      setTimeout(function () {
        for (var i = 0; i < BATCH_SIZE; i++) {
          var product = POOL[poolIdx % POOL.length];
          poolIdx++;
          var card = buildCard(product);
          grid.appendChild(card);
          /* Hook into the reveal pipeline so new cards animate. */
          if (window.cwReveal && typeof window.cwReveal.observe === 'function') {
            window.cwReveal.observe(card, { delay: i * 90 });
          }
        }
        batchesLoaded++;
        loading = false;
        if (spinner) spinner.style.display = 'none';

        if (batchesLoaded >= MAX_BATCHES) {
          if (endNote) endNote.style.display = 'block';
          observer.unobserve(sentinel);
          sentinel.remove();
        }
      }, 380);
    }

    if (typeof IntersectionObserver === 'undefined') {
      /* Fallback: just append everything once. */
      while (batchesLoaded < MAX_BATCHES) appendNextBatch();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) appendNextBatch();
      });
    }, {
      rootMargin: '300px 0px'
    });
    observer.observe(sentinel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
