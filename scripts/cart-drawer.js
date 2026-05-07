/* =========================================================
   DuPont Lighters — Cart Drawer
   Shared luxury checkout side-panel; injects markup, wires
   up triggers across pages, owns in-memory line items.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Demo state (in-memory only) ---------- */
  var bag = [
    {
      id: 'ligne-2-palladium',
      name: 'Ligne 2 Palladium',
      finish: 'Palladium',
      collection: 'Ligne 2 — Signature',
      price: 1650,
      qty: 1,
      img: 'images/products/ligne-2-palladium.webp'
    }
  ];

  var fmt = function (n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  /* ---------- Markup injection ---------- */
  function injectDrawer() {
    if (document.querySelector('[data-cart-drawer]')) return;

    var html =
      '<div class="cart-drawer" data-cart-drawer aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">' +
        '<div class="cart-drawer__backdrop" data-cart-close></div>' +
        '<aside class="cart-drawer__panel">' +
          '<header class="cart-drawer__header">' +
            '<h2 class="cart-drawer__title" id="cart-drawer-title">My Cart<span class="cart-drawer__count" data-cart-count></span></h2>' +
            '<button class="cart-drawer__close" type="button" aria-label="Close" data-cart-close>' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
            '</button>' +
          '</header>' +

          '<div class="cart-drawer__body" data-cart-body></div>' +

          '<footer class="cart-drawer__footer" data-cart-footer></footer>' +
        '</aside>' +
      '</div>';

    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap.firstChild);
  }

  /* ---------- Render ---------- */
  function renderItem(item) {
    return (
      '<li class="cart-drawer__item" data-id="' + item.id + '">' +
        '<div class="cart-drawer__item-media">' +
          '<img src="' + item.img + '" alt="' + item.name + '" onerror="this.style.display=\'none\'">' +
        '</div>' +
        '<div class="cart-drawer__item-body">' +
          '<div class="cart-drawer__item-top">' +
            '<h3 class="cart-drawer__item-name">' + item.name + '</h3>' +
            '<span class="cart-drawer__item-price">' + fmt(item.price * item.qty) + '</span>' +
          '</div>' +
          '<p class="cart-drawer__item-meta">' + item.finish + '</p>' +
          '<div class="cart-drawer__item-row">' +
            '<div class="cart-drawer__qty">' +
              '<button type="button" data-qty-dec aria-label="Decrease quantity">−</button>' +
              '<span data-qty>' + item.qty + '</span>' +
              '<button type="button" data-qty-inc aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<button type="button" class="cart-drawer__item-remove" data-remove>Remove</button>' +
          '</div>' +
        '</div>' +
      '</li>'
    );
  }

  function renderSuggest() {
    return (
      '<div class="cart-drawer__suggest">' +
        '<h4 class="cart-drawer__section-title">Complete your collection</h4>' +
        '<ul class="cart-drawer__suggest-list">' +
          '<li class="cart-drawer__suggest-item">' +
            '<div class="cart-drawer__suggest-media"><img src="images/products/Product-pairing-1.webp" alt=""></div>' +
            '<div>' +
              '<div class="cart-drawer__suggest-name">Premium Yellow Butane</div>' +
              '<div class="cart-drawer__suggest-price">' + fmt(34) + '</div>' +
            '</div>' +
            '<button type="button" class="cart-drawer__suggest-add" data-suggest-add>Add</button>' +
          '</li>' +
          '<li class="cart-drawer__suggest-item">' +
            '<div class="cart-drawer__suggest-media"><img src="images/products/Product-pairing-2.webp" alt=""></div>' +
            '<div>' +
              '<div class="cart-drawer__suggest-name">Maison Flint Service Kit</div>' +
              '<div class="cart-drawer__suggest-price">' + fmt(48) + '</div>' +
            '</div>' +
            '<button type="button" class="cart-drawer__suggest-add" data-suggest-add>Add</button>' +
          '</li>' +
          '<li class="cart-drawer__suggest-item">' +
            '<div class="cart-drawer__suggest-media"><img src="images/products/Product-pairing-3.webp" alt=""></div>' +
            '<div>' +
              '<div class="cart-drawer__suggest-name">Saddle Leather Pouch</div>' +
              '<div class="cart-drawer__suggest-price">' + fmt(220) + '</div>' +
            '</div>' +
            '<button type="button" class="cart-drawer__suggest-add" data-suggest-add>Add</button>' +
          '</li>' +
        '</ul>' +
      '</div>'
    );
  }

  function renderEmpty() {
    return (
      '<div class="cart-drawer__empty">' +
        '<h3 class="cart-drawer__empty-title">Your selection is empty</h3>' +
        '<p>Discover the maison\'s signature lighters, hand-finished in Faverges.</p>' +
        '<a href="collection.html" class="cart-drawer__cta" style="display:inline-block;width:auto;padding:14px 28px;">Browse the collection</a>' +
      '</div>'
    );
  }

  function render() {
    var body = document.querySelector('[data-cart-body]');
    var footer = document.querySelector('[data-cart-footer]');
    var count = document.querySelector('[data-cart-count]');
    if (!body || !footer) return;

    var totalQty = bag.reduce(function (s, i) { return s + i.qty; }, 0);
    var subtotal = bag.reduce(function (s, i) { return s + i.qty * i.price; }, 0);

    if (count) count.textContent = totalQty ? ' (' + totalQty + ')' : '';

    if (!bag.length) {
      body.innerHTML = renderEmpty();
      footer.innerHTML = '';
      return;
    }

    body.innerHTML =
      '<ul class="cart-drawer__items">' +
        bag.map(renderItem).join('') +
      '</ul>' +
      renderSuggest();

    footer.innerHTML =
      '<div class="cart-drawer__summary">' +
        '<span class="cart-drawer__summary-label">Subtotal</span>' +
        '<span class="cart-drawer__summary-value">' + fmt(subtotal) + '</span>' +
      '</div>' +
      '<p class="cart-drawer__footnote">Duties, taxes and signature shipping calculated at checkout.</p>' +
      '<a href="checkout.html" class="cart-drawer__cta">Proceed to checkout</a>' +
      '<a href="cart.html" class="cart-drawer__viewbag">View full bag</a>';

    bindBodyEvents();
  }

  /* ---------- State ops ---------- */
  function inc(id) {
    bag.forEach(function (i) { if (i.id === id) i.qty += 1; });
    render();
  }
  function dec(id) {
    bag.forEach(function (i) { if (i.id === id) i.qty = Math.max(1, i.qty - 1); });
    render();
  }
  function remove(id) {
    bag = bag.filter(function (i) { return i.id !== id; });
    render();
  }
  function addItem(item) {
    var existing = null;
    bag.forEach(function (i) { if (i.id === item.id) existing = i; });
    if (existing) existing.qty += item.qty || 1;
    else bag.push(Object.assign({ qty: 1 }, item));
    render();
  }

  /* Defaults for "Add to cart" without explicit data */
  function defaultItemFromPDP() {
    return {
      id: 'ligne-2-palladium',
      name: 'Ligne 2 Palladium',
      finish: 'Palladium',
      collection: 'Ligne 2 — Signature',
      price: 1650,
      qty: 1,
      img: 'images/products/ligne-2-palladium.webp'
    };
  }

  /* ---------- Body event delegation ---------- */
  function bindBodyEvents() {
    var body = document.querySelector('[data-cart-body]');
    if (!body) return;

    body.querySelectorAll('[data-qty-inc]').forEach(function (b) {
      b.addEventListener('click', function () {
        var li = b.closest('[data-id]');
        if (li) inc(li.getAttribute('data-id'));
      });
    });
    body.querySelectorAll('[data-qty-dec]').forEach(function (b) {
      b.addEventListener('click', function () {
        var li = b.closest('[data-id]');
        if (li) dec(li.getAttribute('data-id'));
      });
    });
    body.querySelectorAll('[data-remove]').forEach(function (b) {
      b.addEventListener('click', function () {
        var li = b.closest('[data-id]');
        if (li) remove(li.getAttribute('data-id'));
      });
    });
    body.querySelectorAll('[data-suggest-add]').forEach(function (b) {
      b.addEventListener('click', function () {
        var li = b.closest('.cart-drawer__suggest-item');
        if (!li) return;
        var name = li.querySelector('.cart-drawer__suggest-name').textContent.trim();
        var priceText = li.querySelector('.cart-drawer__suggest-price').textContent.replace(/[^0-9.]/g, '');
        addItem({
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: name,
          finish: '—',
          collection: 'Atelier accessories',
          price: parseFloat(priceText) || 0,
          qty: 1,
          img: ''
        });
      });
    });
  }

  /* ---------- Open / close ---------- */
  function open() {
    var d = document.querySelector('[data-cart-drawer]');
    if (!d) return;
    d.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    var d = document.querySelector('[data-cart-drawer]');
    if (!d) return;
    d.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ---------- Trigger wiring ---------- */
  function wireTriggers() {
    /* Cart icon in nav (every page) */
    document.querySelectorAll('a.icon-btn[aria-label="Cart"], [data-cart-trigger]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        open();
      });
    });

    /* Quick-add buttons (cart-page upsell rail and similar) */
    document.querySelectorAll('[data-quick-add]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var price = parseFloat(btn.getAttribute('data-product-price'));
        addItem({
          id: btn.getAttribute('data-product-id') ||
              (btn.getAttribute('data-product-name') || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: btn.getAttribute('data-product-name') || '',
          finish: btn.getAttribute('data-product-finish') || '—',
          collection: btn.getAttribute('data-product-collection') || '',
          price: isNaN(price) ? 0 : price,
          qty: 1,
          img: btn.getAttribute('data-product-img') || ''
        });
        /* Brief "Added" affordance, then open the drawer */
        var label = btn.querySelector('span');
        var prev = label ? label.textContent : null;
        if (label) label.textContent = 'Added';
        btn.classList.add('is-added');
        setTimeout(function () {
          btn.classList.remove('is-added');
          if (label && prev) label.textContent = prev;
        }, 1400);
        open();
      });
    });

    /* Add to cart buttons */
    document.querySelectorAll('.pdp-addtocart, [data-add-to-cart]').forEach(function (btn) {
      /* Strip any existing onclick that redirects */
      btn.removeAttribute('onclick');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var item = defaultItemFromPDP();

        /* If on PDP, pull live finish + qty */
        var titleEl = document.getElementById('pdp-title');
        var priceEl = document.querySelector('.pdp-info__price');
        var finishEl = document.querySelector('[data-selected-finish] strong');
        var qtyInput = document.querySelector('.qty-stepper input');
        if (titleEl) item.name = titleEl.textContent.trim();
        if (finishEl) {
          item.finish = finishEl.textContent.trim();
          item.id = (item.name + '-' + item.finish).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        if (priceEl) {
          var p = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));
          if (!isNaN(p)) item.price = p;
        }
        if (qtyInput) {
          var q = parseInt(qtyInput.value, 10);
          if (!isNaN(q) && q > 0) item.qty = q;
        }
        addItem(item);
        open();
      });
    });

    /* Close on backdrop / X / Esc */
    document.querySelectorAll('[data-cart-close]').forEach(function (b) {
      b.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var d = document.querySelector('[data-cart-drawer]');
        if (d && d.getAttribute('aria-hidden') === 'false') close();
      }
    });
  }

  /* ---------- Boot ---------- */
  function init() {
    injectDrawer();
    render();
    wireTriggers();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
