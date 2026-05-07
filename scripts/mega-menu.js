(function () {
  // Inject the mega-menu markup if it isn't already present on the page,
  // then wire up hover/focus open/close behavior.

  var MEGA_HTML = ''
    + '<div class="mega-menu" data-mega-panel aria-hidden="true" aria-label="Categories">'
    +   '<div class="mega-menu__inner">'
    +     '<div class="mega-menu__feature">'
    +       '<img src="images/products/ligne-2-gold-guilloche.webp" alt="">'
    +     '</div>'
    +     '<div class="mega-menu__columns">'
    +       '<div>'
    +         '<h3 class="mega-menu__col-title">New products</h3>'
    +         '<ul class="mega-menu__list">'
    +           '<li><a href="collection.html">Orlinski</a></li>'
    +           '<li><a href="collection.html">Horse</a></li>'
    +           '<li><a href="collection.html">Maki-e</a></li>'
    +           '<li><a href="collection.html">Fuente</a></li>'
    +           '<li><a href="collection.html">Table Lighter &amp; Torch</a></li>'
    +           '<li><a href="collection.html">20\'000 Leagues Under the Sea</a></li>'
    +           '<li><a href="collection.html">Ligne 1</a></li>'
    +           '<li><a href="collection.html">Romeo y Julieta</a></li>'
    +         '</ul>'
    +       '</div>'
    +       '<div>'
    +         '<h3 class="mega-menu__col-title">Collections</h3>'
    +         '<ul class="mega-menu__list">'
    +           '<li><a href="collection.html">Ligne 2, Ligne 2 small</a></li>'
    +           '<li><a href="collection.html">Le Grand Dupont</a></li>'
    +           '<li><a href="collection.html">Biggy</a></li>'
    +           '<li><a href="collection.html">Slimmy</a></li>'
    +           '<li><a href="collection.html">Initial</a></li>'
    +           '<li><a href="collection.html">Ligne 1</a></li>'
    +           '<li><a href="collection.html">Twiggy</a></li>'
    +           '<li><a href="collection.html">Maxijet, Minijet &amp; Slim 7</a></li>'
    +           '<li><a href="collection.html">Windproof &amp; D\u00E9fi Extr\u00EAme</a></li>'
    +           '<li><a href="collection.html">Table Lighter &amp; Torch</a></li>'
    +         '</ul>'
    +       '</div>'
    +       '<div>'
    +         '<h3 class="mega-menu__col-title">Theme</h3>'
    +         '<ul class="mega-menu__list">'
    +           '<li><a href="collection.html">Maki-e</a></li>'
    +           '<li><a href="collection.html">Horse</a></li>'
    +           '<li><a href="collection.html">Camo</a></li>'
    +           '<li><a href="collection.html">Monogram 1872</a></li>'
    +           '<li><a href="collection.html">Fire X</a></li>'
    +           '<li><a href="collection.html">Snake</a></li>'
    +         '</ul>'
    +         '<h3 class="mega-menu__col-title" style="margin-top: var(--sp-6);">Smoking accessories</h3>'
    +         '<ul class="mega-menu__list">'
    +           '<li><a href="collection.html">Cigar &amp; cigarette case</a></li>'
    +           '<li><a href="collection.html">Lighter cases</a></li>'
    +           '<li><a href="collection.html">Cigar cutters</a></li>'
    +           '<li><a href="collection.html">Ashtrays</a></li>'
    +           '<li><a href="collection.html">Humidors</a></li>'
    +         '</ul>'
    +       '</div>'
    +       '<div>'
    +         '<h3 class="mega-menu__col-title">Personalization</h3>'
    +         '<ul class="mega-menu__list">'
    +           '<li><a href="collection.html">All customisable lighters</a></li>'
    +           '<li><a href="collection.html">Ligne 2</a></li>'
    +           '<li><a href="collection.html">Le Grand Dupont</a></li>'
    +           '<li><a href="collection.html">Initial</a></li>'
    +           '<li><a href="collection.html">Biggy</a></li>'
    +           '<li><a href="collection.html">Twiggy</a></li>'
    +         '</ul>'
    +         '<h3 class="mega-menu__col-title" style="margin-top: var(--sp-6);">Refill &amp; stones</h3>'
    +         '<ul class="mega-menu__list">'
    +           '<li><a href="collection.html">View all</a></li>'
    +         '</ul>'
    +       '</div>'
    +     '</div>'
    +   '</div>'
    + '</div>'
    + '<div class="mega-backdrop" data-mega-backdrop aria-hidden="true"></div>';

  // Inject only if missing
  if (!document.querySelector('[data-mega-panel]')) {
    var holder = document.createElement('div');
    holder.innerHTML = MEGA_HTML;
    while (holder.firstChild) document.body.appendChild(holder.firstChild);
  }

  var trigger = document.querySelector('[data-mega-trigger]');
  var panel = document.querySelector('[data-mega-panel]');
  var backdrop = document.querySelector('[data-mega-backdrop]');
  var header = document.querySelector('.site-header');
  if (!trigger || !panel || !backdrop) return;

  function setHeaderHeight() {
    if (!header) return;
    var h = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-height', h + 'px');
  }
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

  var openTimer, closeTimer;
  function open() {
    clearTimeout(closeTimer);
    setHeaderHeight();
    panel.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
  }
  function close() {
    panel.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
  }
  function delayedClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(close, 120);
  }
  function cancelClose() {
    clearTimeout(closeTimer);
  }

  trigger.addEventListener('mouseenter', open);
  trigger.addEventListener('mouseleave', delayedClose);
  trigger.addEventListener('focusin', open);

  panel.addEventListener('mouseenter', cancelClose);
  panel.addEventListener('mouseleave', delayedClose);

  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') close();
  });
})();
