/* ==========================================================================
   Zelvox — theme.js
   Foundation interactions: mobile navigation, search drawer, hero carousel.
   Commerce layer: Ajax Cart API, cart drawer, quick add, quick view,
   wishlist, variant picker, gallery zoom, predictive search.
   Kept dependency-free and defensive so every section works in isolation.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* --- Small helpers ------------------------------------------------------ */
  function money(cents) {
    /* Mirrors Shopify's money format from the shop currency */
    var format = (window.ZelvoxMoney && window.ZelvoxMoney.format) || '${{amount}}';
    if (typeof cents !== 'number') return '';
    var value = (cents / 100).toFixed(2);
    var parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return format
      .replace(/\{\{\s*amount\s*\}\}/, parts.join('.'))
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/, parts[0]);
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait || 250);
    };
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Focus trap helper shared by drawer + modal */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function trapFocus(container, event) {
    if (event.key !== 'Tab') return;
    var nodes = container.querySelectorAll(FOCUSABLE);
    if (!nodes.length) return;
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* --- Mobile navigation ------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var drawer = document.querySelector('[data-mobile-nav]');
    if (!toggle || !drawer) return;

    var closers = drawer.querySelectorAll('[data-nav-close]');

    function setOpen(open) {
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('is-locked', open);

      if (open) {
        var firstLink = drawer.querySelector('a, button');
        if (firstLink) firstLink.focus();
      } else {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(!drawer.classList.contains('is-open'));
    });

    Array.prototype.forEach.call(closers, function (el) {
      el.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
        setOpen(false);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 990 && drawer.classList.contains('is-open')) {
        setOpen(false);
      }
    });
  }

  /* --- Search drawer ------------------------------------------------------ */
  function initSearch() {
    var toggle = document.querySelector('[data-search-toggle]');
    var panel = document.querySelector('[data-search-panel]');
    if (!toggle || !panel) return;

    function setOpen(open) {
      panel.classList.toggle('is-open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');

      if (open) {
        var input = panel.querySelector('input[type="search"]');
        if (input) window.setTimeout(function () { input.focus(); }, 120);
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(!panel.classList.contains('is-open'));
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && panel.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* --- Hero carousel ------------------------------------------------------ */
  function initCarousels() {
    var carousels = document.querySelectorAll('[data-carousel]');

    Array.prototype.forEach.call(carousels, function (root) {
      var slides = root.querySelectorAll('[data-slide]');
      if (slides.length < 2) return;

      var dots = root.querySelectorAll('[data-dot]');
      var prev = root.querySelector('[data-carousel-prev]');
      var next = root.querySelector('[data-carousel-next]');
      var toggle = root.querySelector('[data-carousel-toggle]');
      var status = root.querySelector('[data-carousel-status]');
      var stage = root.querySelector('[data-stage]');
      var autoplay = root.getAttribute('data-autoplay') === 'true';
      var interval = parseInt(root.getAttribute('data-interval'), 10) || 3000;
      var pauseHover = root.getAttribute('data-pause-hover') !== 'false';
      var pauseFocus = root.getAttribute('data-pause-focus') !== 'false';

      var index = 0;
      var timer = null;
      var userPaused = false;   /* explicit pause via the play/pause control */
      var hoverPaused = false;  /* pointer over the hero */
      var focusPaused = false;  /* keyboard/user interaction */
      var coarsePointer = window.matchMedia('(pointer: coarse)').matches;

      function announce() {
        if (!status) return;
        var heading = slides[index].querySelector('.hero__title');
        var label = heading ? heading.textContent.trim() : '';
        var template = root.getAttribute('data-announce-template');
        if (template) {
          status.textContent = template
            .replace('[number]', index + 1)
            .replace('[total]', slides.length)
            .replace('[heading]', label);
        } else {
          status.textContent = 'Slide ' + (index + 1) + ' of ' + slides.length + (label ? ': ' + label : '');
        }
      }

      function render() {
        Array.prototype.forEach.call(slides, function (slide, i) {
          var active = i === index;
          slide.classList.toggle('is-active', active);
          slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        });

        Array.prototype.forEach.call(dots, function (dot, i) {
          dot.classList.toggle('is-active', i === index);
          dot.setAttribute('aria-current', i === index ? 'true' : 'false');
        });

        announce();
      }

      function go(to, fromUser) {
        var nextIndex = (to + slides.length) % slides.length;
        if (nextIndex === index && !fromUser) return;
        index = nextIndex;
        render();
        if (fromUser) {
          /* Interacting restarts the countdown (unless paused outright) */
          stop();
          start();
        }
      }

      function shouldAutoPlay() {
        return autoplay && !userPaused && !hoverPaused && !focusPaused && !reduceMotion && !document.hidden;
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      function start() {
        if (timer) return;
        if (!shouldAutoPlay()) return;
        timer = window.setInterval(function () {
          go(index + 1, false);
        }, interval);
      }

      function refresh() {
        stop();
        start();
      }

      /* Pause / resume control ------------------------------------------- */
      function setToggleState() {
        if (!toggle) return;
        var pauseLabel = toggle.getAttribute('data-label-pause') || 'Pause slideshow';
        var playLabel = toggle.getAttribute('data-label-play') || 'Play slideshow';
        toggle.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
        toggle.setAttribute('aria-label', userPaused ? playLabel : pauseLabel);
        toggle.innerHTML = userPaused
          ? '<svg class="icon icon--play" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 4.8v14.4L19.5 12 7 4.8z"/></svg>'
          : '<svg class="icon icon--pause" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 5v14"/><path d="M15 5v14"/></svg>';
      }

      if (toggle) {
        toggle.addEventListener('click', function () {
          userPaused = !userPaused;
          setToggleState();
          refresh();
        });
      }

      if (prev) {
        prev.addEventListener('click', function () {
          go(index - 1, true);
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          go(index + 1, true);
        });
      }

      Array.prototype.forEach.call(dots, function (dot) {
        dot.addEventListener('click', function () {
          go(parseInt(dot.getAttribute('data-dot'), 10) || 0, true);
        });
      });

      /* Pause on hover / focus (both configurable) ------------------------- */
      if (pauseHover) {
        root.addEventListener('mouseenter', function () {
          hoverPaused = true;
          refresh();
        });
        root.addEventListener('mouseleave', function () {
          hoverPaused = false;
          refresh();
        });
      }

      if (pauseFocus) {
        root.addEventListener('focusin', function () {
          focusPaused = true;
          refresh();
        });
        root.addEventListener('focusout', function () {
          focusPaused = false;
          refresh();
        });
      }

      /* Pause while the tab is inactive ------------------------------------ */
      document.addEventListener('visibilitychange', refresh);

      /* Swipe gestures (mobile) -------------------------------------------- */
      var touchStartX = 0;
      var touchStartY = 0;
      var swiping = false;

      root.addEventListener('touchstart', function (event) {
        if (event.touches.length !== 1) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        swiping = true;
      }, { passive: true });

      root.addEventListener('touchend', function (event) {
        if (!swiping) return;
        swiping = false;
        var touch = event.changedTouches[0];
        var dx = touch.clientX - touchStartX;
        var dy = touch.clientY - touchStartY;
        if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) {
          go(dx < 0 ? index + 1 : index - 1, true);
        }
      }, { passive: true });

      /* Keyboard: arrow keys when the hero has focus ------------------------ */
      root.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          go(index - 1, true);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          go(index + 1, true);
        }
      });

      /* Pointer parallax for the 3D stage (fine pointers only) --------------- */
      if (stage && !coarsePointer && !reduceMotion) {
        root.addEventListener('mousemove', function (event) {
          var rect = root.getBoundingClientRect();
          var px = (event.clientX - rect.left) / rect.width - 0.5;   /* -0.5 .. 0.5 */
          var py = (event.clientY - rect.top) / rect.height - 0.5;
          stage.style.setProperty('--px', px.toFixed(3));
          stage.style.setProperty('--py', py.toFixed(3));
        });
        root.addEventListener('mouseleave', function () {
          stage.style.setProperty('--px', 0);
          stage.style.setProperty('--py', 0);
        });
      }

      /* Simplify when the connection is slow -------------------------------- */
      if (navigator.connection && navigator.connection.saveData) {
        root.classList.add('is-simplified');
      }

      render();
      setToggleState();
      start();
    });
  }

  /* --- Scroll reveals (IntersectionObserver) ------------------------------ */
  function initReveals() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    /* Reduced motion or no IO support: show everything immediately */
    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

    Array.prototype.forEach.call(targets, function (el) {
      observer.observe(el);
    });
  }

  /* --- Header polish ------------------------------------------------------ */
  function initHeaderScroll() {
    var header = document.querySelector('[data-site-header]');
    if (!header) return;

    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* ======================================================================
     COMMERCE LAYER
     ====================================================================== */

  /* --- Cart store (Shopify Ajax Cart API) --------------------------------- */
  var Cart = {
    count: 0,
    total: 0,
    items: [],
    _subs: [],
    onChange: function (fn) { this._subs.push(fn); },
    _emit: function () {
      for (var i = 0; i < this._subs.length; i++) {
        try { this._subs[i](this); } catch (e) { /* keep other subscribers alive */ }
      }
    },
    fetch: function () {
      var self = this;
      return fetch((window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/') + 'cart.js', {
        headers: { Accept: 'application/json' }
      })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
        .then(function (cart) {
          self.count = cart.item_count || 0;
          self.total = cart.total_price || 0;
          self.items = cart.items || [];
          self._emit();
          return cart;
        });
    },
    add: function (payload) {
      var self = this;
      return fetch((window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/') + 'cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        return r.json().then(function (data) {
          if (!r.ok) {
            var err = new Error(data.description || data.message || 'Add failed');
            err.status = r.status;
            err.data = data;
            throw err;
          }
          return self.fetch().then(function () { return data; });
        });
      });
    },
    change: function (key, quantity) {
      var self = this;
      return fetch((window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/') + 'cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: key, quantity: quantity })
      })
        .then(function (r) { return r.json(); })
        .then(function (cart) {
          self.count = cart.item_count || 0;
          self.total = cart.total_price || 0;
          self.items = cart.items || [];
          self._emit();
          return cart;
        });
    },
    /* Buy Now: add the chosen variant then hand off to real Shopify checkout */
    checkout: function (variantId, quantity) {
      var id = parseInt(variantId, 10);
      var qty = Math.max(1, parseInt(quantity, 10) || 1);
      var body = new FormData();
      body.append('id', id);
      body.append('quantity', qty);
      return fetch((window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/') + 'cart/add', {
        method: 'POST',
        body: body,
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        if (!r.ok) return Promise.reject(r);
        /* Only redirect to the hosted checkout — never a fake one */
        window.location.href = (window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/') + 'checkout';
      });
    }
  };

  /* --- Live cart count (header badge) ------------------------------------- */
  function initCartCount() {
    var badges = document.querySelectorAll('[data-cart-count]');
    function paint(cart) {
      Array.prototype.forEach.call(badges, function (el) {
        el.textContent = cart.count;
        el.classList.toggle('is-hidden', cart.count === 0);
      });
      Array.prototype.forEach.call(document.querySelectorAll('[data-cart-drawer-count]'), function (el) {
        el.textContent = '(' + cart.count + ')';
      });
    }
    Cart.onChange(paint);
    Cart.fetch().catch(function () { /* offline: leave server-rendered value */ });
  }

  /* --- Cart drawer -------------------------------------------------------- */
  function initCartDrawer() {
    var drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;
    var panel = drawer.querySelector('[data-cart-drawer-panel]');
    var body = drawer.querySelector('[data-cart-drawer-body]');
    var foot = drawer.querySelector('[data-cart-drawer-foot]');
    var subtotalEl = drawer.querySelector('[data-cart-drawer-subtotal]');
    var lastFocus = null;

    function setOpen(open) {
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('is-locked', open);
      if (open) {
        lastFocus = document.activeElement;
        if (panel) panel.focus();
      } else if (lastFocus && lastFocus.focus) {
        lastFocus.focus();
      }
    }

    /* Open triggers (header cart, quick-add confirmations) */
    Array.prototype.forEach.call(document.querySelectorAll('[data-cart-open]'), function (el) {
      el.addEventListener('click', function (event) {
        event.preventDefault();
        setOpen(true);
      });
    });

    Array.prototype.forEach.call(drawer.querySelectorAll('[data-cart-drawer-close]'), function (el) {
      el.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) setOpen(false);
      if (drawer.classList.contains('is-open')) trapFocus(panel, event);
    });

    /* Render items from the live cart object */
    function render(cart) {
      if (!body) return;
      if (!cart.items || !cart.items.length) {
        body.innerHTML =
          '<div class="cart-drawer__empty">' +
          '<span class="empty-state__icon" aria-hidden="true">' +
          '<svg class="icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>' +
          '</span>' +
          '<p class="empty-state__text">' + escapeHtml((window.ZelvoxStrings && window.ZelvoxStrings.cartEmpty) || 'Your cart is empty') + '</p>' +
          '<button class="btn btn--outline btn--sm" type="button" data-cart-drawer-close>' +
          escapeHtml((window.ZelvoxStrings && window.ZelvoxStrings.continueShopping) || 'Continue shopping') +
          '</button></div>';
        if (foot) foot.hidden = true;
        Array.prototype.forEach.call(body.querySelectorAll('[data-cart-drawer-close]'), function (el) {
          el.addEventListener('click', function () { setOpen(false); });
        });
        return;
      }

      var html = '<ul class="cart-drawer__list" data-cart-drawer-list>';
      cart.items.forEach(function (item) {
        html +=
          '<li class="cart-drawer__item" data-cart-item data-key="' + escapeHtml(item.key) + '">' +
          '<a class="cart-drawer__media" href="' + escapeHtml(item.url) + '">' +
          (item.image
            ? '<img src="' + escapeHtml(item.image) + '" width="200" height="200" alt="' + escapeHtml(item.product_title) + '" loading="lazy">'
            : '<span class="cart-item__placeholder"></span>') +
          '</a>' +
          '<div class="cart-drawer__details">' +
          '<a class="cart-drawer__item-title" href="' + escapeHtml(item.url) + '">' + escapeHtml(item.product_title) + '</a>' +
          (item.variant_title && item.variant_title !== 'Default Title'
            ? '<p class="cart-drawer__variant">' + escapeHtml(item.variant_title) + '</p>' : '') +
          '<p class="cart-drawer__price">' + money(item.final_price) + '</p>' +
          '<div class="cart-drawer__controls">' +
          '<div class="qty-field qty-field--sm">' +
          '<button class="qty-field__btn" type="button" data-drawer-dec aria-label="−">−</button>' +
          '<input class="qty-field__input" type="number" value="' + item.quantity + '" min="0" data-drawer-qty inputmode="numeric" aria-label="Quantity">' +
          '<button class="qty-field__btn" type="button" data-drawer-inc aria-label="+">+</button>' +
          '</div>' +
          '<button class="cart-drawer__remove" type="button" data-drawer-remove>' +
          escapeHtml((window.ZelvoxStrings && window.ZelvoxStrings.remove) || 'Remove') +
          '</button>' +
          '</div></div>' +
          '<p class="cart-drawer__line-price">' + money(item.final_line_price) + '</p>' +
          '</li>';
      });
      html += '</ul>';
      body.innerHTML = html;
      if (foot) foot.hidden = false;
      /* Subscribers receive the Cart store (`.total`); accept a raw cart payload too */
      if (subtotalEl) subtotalEl.textContent = money(typeof cart.total_price === 'number' ? cart.total_price : cart.total);

      /* Wire row controls */
      Array.prototype.forEach.call(body.querySelectorAll('[data-cart-item]'), function (row) {
        var key = row.getAttribute('data-key');
        var qty = row.querySelector('[data-drawer-qty]');
        var dec = row.querySelector('[data-drawer-dec]');
        var inc = row.querySelector('[data-drawer-inc]');
        var rm = row.querySelector('[data-drawer-remove]');
        var busy = false;
        function setQty(next) {
          if (busy) return;
          busy = true;
          row.classList.add('is-loading');
          Cart.change(key, next).catch(function () { busy = false; row.classList.remove('is-loading'); });
        }
        if (dec) dec.addEventListener('click', function () { setQty(Math.max(0, (parseInt(qty.value, 10) || 0) - 1)); });
        if (inc) inc.addEventListener('click', function () { setQty((parseInt(qty.value, 10) || 0) + 1); });
        if (qty) qty.addEventListener('change', function () { setQty(Math.max(0, parseInt(qty.value, 10) || 0)); });
        if (rm) rm.addEventListener('click', function () { setQty(0); });
      });
    }

    Cart.onChange(render);

    /* Anything that signals "added" should surface the drawer */
    document.addEventListener('zelvox:cart:open', function () { setOpen(true); });

    Cart.fetch().then(render).catch(function () { /* leave SSR content */ });
  }

  /* --- Cart page (Ajax quantity updates + removal) ------------------------- */
  function initCartPage() {
    var page = document.querySelector('[data-cart-page]');
    if (!page) return;
    var subtotalEl = page.querySelector('[data-cart-page-subtotal]');
    var countEl = page.querySelector('[data-cart-page-count]');
    var busy = false;

    /* The translated string ships with a sample count baked in (e.g. "2 items");
       swap that number for the live one so we stay on a real Shopify string. */
    function countLabel(n) {
      var strings = window.ZelvoxStrings || {};
      var tpl = n === 1 ? strings.cartItemsOne : strings.cartItemsMany;
      if (!tpl) return n === 1 ? '1 item' : n + ' items';
      return tpl.replace(/\d+/, n);
    }

    function paint(cart) {
      if (!cart) return;
      if (subtotalEl) subtotalEl.textContent = money(cart.total_price);
      if (countEl) {
        if (cart.item_count > 0) {
          countEl.textContent = countLabel(cart.item_count);
          countEl.hidden = false;
        } else {
          countEl.textContent = '';
          countEl.hidden = true;
        }
      }
      var live = {};
      cart.items.forEach(function (item) { live[String(item.key)] = item; });
      Array.prototype.forEach.call(page.querySelectorAll('[data-cart-item]'), function (row) {
        var item = live[String(row.getAttribute('data-key'))];
        if (!item) {
          if (row.parentNode) row.parentNode.removeChild(row);
          return;
        }
        var price = row.querySelector('[data-cart-line-price]');
        if (price) price.textContent = money(item.final_line_price);
        var qty = row.querySelector('[data-cart-item-qty]');
        if (qty && String(qty.value) !== String(item.quantity)) qty.value = item.quantity;
      });
      /* Cart is now empty — reload so the server-rendered empty state shows */
      if (!cart.items.length) { window.location.reload(); }
    }

    page.addEventListener('change', function (event) {
      var input = event.target.closest && event.target.closest('[data-cart-item-qty]');
      if (!input) return;
      var row = input.closest('[data-cart-item]');
      var key = row && row.getAttribute('data-key');
      if (!key || busy) return;
      busy = true;
      if (row) row.classList.add('is-loading');
      Cart.change(key, Math.max(0, parseInt(input.value, 10) || 0))
        .then(function (cart) { busy = false; if (row) row.classList.remove('is-loading'); paint(cart); })
        .catch(function () { busy = false; if (row) row.classList.remove('is-loading'); });
    });

    page.addEventListener('click', function (event) {
      var rm = event.target.closest && event.target.closest('[data-cart-item-remove]');
      if (!rm) return;
      event.preventDefault();
      var key = rm.getAttribute('data-key');
      if (!key || busy) return;
      busy = true;
      var row = rm.closest('[data-cart-item]');
      if (row) row.classList.add('is-loading');
      Cart.change(key, 0)
        .then(function (cart) { busy = false; paint(cart); })
        .catch(function () { busy = false; if (row) row.classList.remove('is-loading'); });
    });
  }

  /* --- Quantity steppers (cart page + quick add) --------------------------- */
  function initQtySteppers() {
    document.addEventListener('click', function (event) {
      var inc = event.target.closest && event.target.closest('[data-qty-inc]');
      var dec = event.target.closest && event.target.closest('[data-qty-dec]');
      if (!inc && !dec) return;
      var wrap = event.target.closest('.qty-field');
      var input = wrap && wrap.querySelector('input[type="number"]');
      if (!input) return;
      var step = parseInt(input.getAttribute('step'), 10) || 1;
      var min = input.hasAttribute('min') ? parseInt(input.getAttribute('min'), 10) : 1;
      var val = parseInt(input.value, 10) || min;
      input.value = Math.max(min, val + (inc ? step : -step));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  /* --- Quick add ----------------------------------------------------------- */
  function initQuickAdd() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-quick-add]'), function (root) {
      var toggle = root.querySelector('[data-quick-add-toggle]');
      var panel = root.querySelector('[data-quick-add-panel]');
      var form = root.querySelector('[data-quick-add-form]');
      var status = root.querySelector('[data-quick-add-status]');
      if (!form) return;

      if (toggle && panel) {
        toggle.addEventListener('click', function () {
          var open = panel.hasAttribute('hidden');
          panel.toggleAttribute('hidden', !open);
          toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
          if (open) {
            var first = panel.querySelector('input, select, button');
            if (first) first.focus();
          }
        });
      }

      function say(msg, kind) {
        if (!status) return;
        status.textContent = msg;
        status.className = 'quick-add__status' + (kind ? ' is-' + kind : '');
      }

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var submit = form.querySelector('[data-quick-add-submit]');
        var idInput = form.querySelector('[data-quick-add-variant]');
        var qtyInput = form.querySelector('input[name="quantity"]');
        if (!idInput || !idInput.value) {
          say((window.ZelvoxStrings && window.ZelvoxStrings.chooseVariant) || 'Please choose an option.', 'error');
          return;
        }
        if (submit) { submit.disabled = true; submit.classList.add('is-loading'); }
        say((window.ZelvoxStrings && window.ZelvoxStrings.loading) || 'Adding…', 'busy');

        Cart.add({
          items: [{ id: parseInt(idInput.value, 10), quantity: Math.max(1, parseInt(qtyInput && qtyInput.value, 10) || 1) }]
        })
          .then(function () {
            say((window.ZelvoxStrings && window.ZelvoxStrings.added) || 'Added to your cart.', 'success');
            document.dispatchEvent(new CustomEvent('zelvox:cart:open'));
          })
          .catch(function () {
            say((window.ZelvoxStrings && window.ZelvoxStrings.addFailed) || "Sorry, that item couldn't be added.", 'error');
          })
          .finally(function () {
            if (submit) { submit.disabled = false; submit.classList.remove('is-loading'); }
          });
      });
    });
  }

  /* --- Variant picker (shared by PDP + quick add) -------------------------- */
  function initVariantPickers() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-variant-picker]'), function (picker) {
      var jsonEl = picker.querySelector('[data-variant-json]');
      var variants;
      try { variants = JSON.parse(jsonEl.textContent); } catch (e) { return; }
      if (!Array.isArray(variants) || !variants.length) return;

      /* Owning scope: the closest form, else the closest product section */
      var scope = picker.closest('form') || picker.closest('[data-product-section]') || picker.closest('[data-quick-add]') || document;
      /* Only the main product page picker drives the URL + gallery; quick-add
         pickers (inside cards/modals) must not touch the address bar. */
      var isMainProduct = !!picker.closest('[data-product-section]') && !picker.closest('[data-quick-add]') && !picker.closest('[data-quick-view-modal]');
      /* Price + SKU can live outside the form (product page layout), so widen
         the lookup to the containing section/card while keeping form-scoped
         controls (id input, buttons) where they are.
         Crucially, only the MAIN product picker may reach up to the product
         section — quick-add pickers nested in related cards must stay scoped to
         their own card, or they'd clobber the main product's price/SKU. */
      var outer;
      if (isMainProduct) {
        outer = picker.closest('[data-product-section]') || scope;
      } else {
        outer = picker.closest('[data-quick-add]') || picker.closest('[data-quick-view-dialog]') || picker.closest('[data-product-card]') || scope;
      }
      var idInput = scope.querySelector('[data-variant-id], [data-quick-add-variant]');
      var addBtn = scope.querySelector('[data-add-to-cart], [data-quick-add-submit]');
      var buyBtn = scope.querySelector('[data-buy-now]');
      var priceWrap = outer.querySelector('[data-price]') || scope.querySelector('[data-price]');
      var stockWrap = scope.querySelector('[data-stock-wrapper]') || outer.querySelector('[data-stock-wrapper]');
      var skuEl = outer.querySelector('[data-sku]') || scope.querySelector('[data-sku]');

      function selectedOptions() {
        var positions = {};
        Array.prototype.forEach.call(picker.querySelectorAll('[data-option-input]:checked'), function (input) {
          positions[input.getAttribute('data-option-position')] = input.value;
        });
        return positions;
      }

      function findVariant(options) {
        for (var i = 0; i < variants.length; i++) {
          var v = variants[i];
          var match = true;
          for (var pos in options) {
            if (!Object.prototype.hasOwnProperty.call(options, pos)) continue;
            var idx = parseInt(pos, 10);
            var val = v['option' + (idx + 1)];
            if (val !== options[pos]) { match = false; break; }
          }
          if (match) return v;
        }
        return null;
      }

      function update() {
        var variant = findVariant(selectedOptions());
        var inStock = variant ? variant.available : false;

        if (idInput && variant) idInput.value = variant.id;

        /* Selected value readouts */
        var options = selectedOptions();
        for (var pos in options) {
          if (!Object.prototype.hasOwnProperty.call(options, pos)) continue;
          var label = picker.querySelector('[data-option-selected="' + pos + '"]');
          if (label) label.textContent = options[pos];
        }

        /* Price + compare-at from the matched variant */
        if (priceWrap && variant) {
          var cur = priceWrap.querySelector('[data-price-current]');
          var cmp = priceWrap.querySelector('[data-price-compare]');
          var save = priceWrap.querySelector('[data-price-save]');
          if (cur) cur.textContent = money(variant.price);
          var hasCompare = variant.compare_at_price && variant.compare_at_price > variant.price;
          if (cmp) {
            if (hasCompare) { cmp.textContent = money(variant.compare_at_price); cmp.hidden = false; }
            else { cmp.hidden = true; }
          }
          if (save) {
            if (hasCompare) {
              var pct = Math.round((variant.compare_at_price - variant.price) * 100 / variant.compare_at_price);
              save.textContent = '-' + pct + '%';
              save.hidden = false;
            } else { save.hidden = true; }
          }
          priceWrap.classList.toggle('price--sale', !!hasCompare);
        }

        if (skuEl && variant) skuEl.textContent = variant.sku || '—';

        /* Availability → buttons + status */
        if (addBtn) {
          addBtn.disabled = !inStock;
          var base = addBtn.getAttribute('data-label-' + (inStock ? 'available' : 'soldout'));
          if (base) addBtn.textContent = base;
          addBtn.classList.toggle('is-soldout', !inStock);
        }
        if (buyBtn) buyBtn.hidden = !inStock;

        if (stockWrap && variant) {
          stockWrap.innerHTML =
            inStock
              ? '<span class="stock stock--in"><span>' + escapeHtml((window.ZelvoxStrings && window.ZelvoxStrings.stockIn) || 'In stock and ready to ship') + '</span></span>'
              : '<span class="stock stock--out"><span>' + escapeHtml((window.ZelvoxStrings && window.ZelvoxStrings.stockOut) || 'Out of stock') + '</span></span>';
        }

        /* Reflect the variant in the URL for shareable, correct links */
        if (isMainProduct && variant && window.history && window.history.replaceState) {
          var url = new URL(window.location.href);
          url.searchParams.set('variant', variant.id);
          window.history.replaceState({}, '', url.toString());
        }

        /* Swap the gallery image when the variant has its own media */
        if (isMainProduct && variant && variant.featured_image) {
          var img = document.querySelector('[data-gallery-image]');
          if (img && variant.featured_image.src) {
            img.src = variant.featured_image.src;
            if (variant.featured_image.alt) img.alt = variant.featured_image.alt;
          }
        }

        document.dispatchEvent(new CustomEvent('zelvox:variant:change', { detail: { variant: variant } }));
      }

      Array.prototype.forEach.call(picker.querySelectorAll('[data-option-input]'), function (input) {
        input.addEventListener('change', update);
      });

      /* Deep link: if the URL carries ?variant=ID, pre-select that variant's
         option values before the first update so shared links land correctly. */
      function seedFromUrl() {
        if (!isMainProduct || !window.URLSearchParams) return;
        var wanted = new URLSearchParams(window.location.search).get('variant');
        if (!wanted) return;
        var target = null;
        for (var i = 0; i < variants.length; i++) {
          if (String(variants[i].id) === String(wanted)) { target = variants[i]; break; }
        }
        if (!target) return;
        for (var pos = 1; pos <= 3; pos++) {
          var value = target['option' + pos];
          if (!value) continue;
          var input = picker.querySelector('[data-option-input][data-option-position="' + (pos - 1) + '"]');
          if (!input) continue;
          Array.prototype.forEach.call(
            picker.querySelectorAll('[data-option-input][data-option-position="' + (pos - 1) + '"]'),
            function (el) { el.checked = el.value === value; }
          );
        }
      }

      /* Seed the UI from the pre-selected variant (deep link ?variant=) */
      seedFromUrl();
      update();
    });
  }

  /* --- Product form (PDP add to cart + buy now) ---------------------------- */
  function initProductForm() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-product-form]'), function (form) {
      var buyBtn = form.querySelector('[data-buy-now]');
      var idInput = form.querySelector('[data-variant-id]');
      var submit = form.querySelector('[data-add-to-cart]');

      form.addEventListener('submit', function (event) {
        /* Progressive enhancement: without JS the native form posts normally */
        event.preventDefault();
        if (!idInput || !idInput.value) return;
        var qty = form.querySelector('input[name="quantity"]');
        if (submit) { submit.disabled = true; submit.classList.add('is-loading'); }

        Cart.add({
          items: [{ id: parseInt(idInput.value, 10), quantity: Math.max(1, parseInt(qty && qty.value, 10) || 1) }]
        })
          .then(function () {
            document.dispatchEvent(new CustomEvent('zelvox:cart:open'));
          })
          .catch(function () { window.location.reload(); })
          .finally(function () { if (submit) submit.disabled = false; submit.classList.remove('is-loading'); });
      });

      if (buyBtn) {
        buyBtn.addEventListener('click', function () {
          if (!idInput || !idInput.value) return;
          var qty = form.querySelector('input[name="quantity"]');
          Cart.checkout(idInput.value, qty && qty.value);
        });
      }
    });
  }

  /* --- Gallery (thumbnail switching + hover zoom) -------------------------- */
  function initGallery() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-gallery]'), function (gallery) {
      var img = gallery.querySelector('[data-gallery-image]');
      var main = gallery.querySelector('[data-gallery-main]');
      var thumbs = gallery.querySelectorAll('[data-gallery-thumb]');
      if (!img) return;

      Array.prototype.forEach.call(thumbs, function (thumb) {
        thumb.addEventListener('click', function () {
          var src = thumb.getAttribute('data-media-url');
          var zoom = thumb.getAttribute('data-media-zoom');
          var alt = thumb.getAttribute('data-media-alt') || '';
          if (src) {
            img.src = src;
            img.alt = alt;
            if (zoom) img.setAttribute('data-zoom-src', zoom);
          }
          Array.prototype.forEach.call(thumbs, function (t) { t.classList.remove('is-active'); });
          thumb.classList.add('is-active');
        });
      });

      /* Hover magnifier (fine pointers, non-reduced-motion only) */
      var toggle = gallery.querySelector('[data-zoom-toggle]');
      var lens = gallery.querySelector('[data-zoom-lens]');
      if (!toggle || !lens || reduceMotion) return;
      var zoomed = false;

      toggle.addEventListener('click', function () {
        zoomed = !zoomed;
        gallery.classList.toggle('is-zoomed', zoomed);
        toggle.setAttribute('aria-pressed', zoomed ? 'true' : 'false');
        if (!zoomed) lens.hidden = true;
      });

      main.addEventListener('mousemove', function (event) {
        if (!zoomed) return;
        var rect = main.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width) * 100;
        var y = ((event.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = x + '% ' + y + '%';
        var zsrc = img.getAttribute('data-zoom-src');
        if (zsrc && lens.getAttribute('data-src') !== zsrc) {
          lens.style.backgroundImage = 'url("' + zsrc + '")';
          lens.setAttribute('data-src', zsrc);
        }
        lens.hidden = false;
        lens.style.left = (event.clientX - rect.left) + 'px';
        lens.style.top = (event.clientY - rect.top) + 'px';
      });

      main.addEventListener('mouseleave', function () {
        lens.hidden = true;
      });
    });
  }

  /* --- Quick view ---------------------------------------------------------- */
  function initQuickView() {
    var modal = document.querySelector('[data-quick-view-modal]');
    if (!modal) return;
    var dialog = modal.querySelector('[data-quick-view-dialog]');
    var inner = modal.querySelector('[data-quick-view-inner]');
    var lastFocus = null;

    function setOpen(open) {
      modal.classList.toggle('is-open', open);
      modal.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('is-locked', open);
      if (open && dialog) dialog.focus();
      if (!open && lastFocus && lastFocus.focus) lastFocus.focus();
    }

    Array.prototype.forEach.call(modal.querySelectorAll('[data-quick-view-close]'), function (el) {
      el.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) setOpen(false);
      if (modal.classList.contains('is-open')) trapFocus(dialog, event);
    });

    function priceHtml(v) {
      var hasCompare = v.compare_at_price && v.compare_at_price > v.price;
      return (
        '<div class="price' + (hasCompare ? ' price--sale' : '') + '" data-price>' +
        '<span class="price__current" data-price-current>' + money(v.price) + '</span>' +
        (hasCompare
          ? '<s class="price__compare" data-price-compare>' + money(v.compare_at_price) + '</s>' +
            '<span class="price__save" data-price-save>-' + Math.round((v.compare_at_price - v.price) * 100 / v.compare_at_price) + '%</span>'
          : '<s class="price__compare" data-price-compare hidden></s><span class="price__save" data-price-save hidden></span>') +
        '</div>'
      );
    }

    function variantPickerHtml(product) {
      if (!product.options || !product.options.length || product.variants.length < 2) return '';
      var html = '<div class="variant-picker" data-variant-picker>';
      product.options.forEach(function (opt, oi) {
        html += '<fieldset class="variant-picker__group" data-option-index="' + oi + '">' +
          '<legend class="variant-picker__label">' + escapeHtml(opt.name) +
          ' <span class="variant-picker__selected" data-option-selected="' + oi + '">' + escapeHtml(opt.values[0]) + '</span></legend>' +
          '<div class="variant-picker__values">';
        opt.values.forEach(function (val, vi) {
          var id = 'qv-' + product.id + '-o' + oi + '-' + vi;
          var checked = vi === 0 ? ' checked' : '';
          html +=
            '<input class="variant-picker__input visually-hidden" type="radio" id="' + id + '" name="qv-opt-' + oi + '" value="' + escapeHtml(val) + '" data-option-input data-option-position="' + oi + '"' + checked + '>' +
            '<label class="variant-picker__value" for="' + id + '">' + escapeHtml(val) + '</label>';
        });
        html += '</div></fieldset>';
      });
      html += '<script type="application/json" data-variant-json>' + JSON.stringify(product.variants).replace(/<script/gi, '<\\/script>') + '<\/script>';
      html += '</div>';
      return html;
    }

    document.addEventListener('click', function (event) {
      var trigger = event.target.closest && event.target.closest('[data-quick-view]');
      if (!trigger) return;
      event.preventDefault();
      lastFocus = trigger;
      var handle = trigger.getAttribute('data-product-handle');
      if (!handle) return;

      inner.innerHTML = '<p class="qv__loading">' + escapeHtml((window.ZelvoxStrings && window.ZelvoxStrings.loading) || 'Loading…') + '</p>';
      setOpen(true);

      fetch((window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/') + 'products/' + handle + '.js', {
        headers: { Accept: 'application/json' }
      })
        .then(function (r) { return r.json(); })
        .then(function (p) {
          var featured = p.featured_image || (p.images && p.images[0]) || '';
          var first = p.variants && p.variants[0];
          inner.innerHTML =
            '<div class="qv__layout">' +
            '<div class="qv__media">' +
            (featured ? '<img src="' + escapeHtml(featured) + '" alt="' + escapeHtml(p.title) + '" width="700" height="700" loading="lazy">' : '') +
            '</div>' +
            '<div class="qv__details">' +
            (p.vendor ? '<p class="eyebrow">' + escapeHtml(p.vendor) + '</p>' : '') +
            '<h2 class="qv__title">' + escapeHtml(p.title) + '</h2>' +
            priceHtml(first) +
            (p.description ? '<div class="rte qv__desc">' + p.description + '</div>' : '') +
            variantPickerHtml(p) +
            '<form class="product-form qv__form" data-quick-view-form>' +
            '<input type="hidden" name="id" value="' + escapeHtml(first.id) + '" data-quick-add-variant>' +
            '<div class="product-form__row">' +
            '<div class="qty-field"><input class="qty-field__input" type="number" name="quantity" value="1" min="1" aria-label="Quantity"></div>' +
            '<button class="btn btn--primary btn--lg" type="submit" data-quick-add-submit>' +
            escapeHtml((window.ZelvoxStrings && window.ZelvoxStrings.addToCart) || 'Add to cart') + '</button>' +
            '</div>' +
            (p.available === false ? '<p class="quick-add__status is-error">' + escapeHtml((window.ZelvoxStrings && window.ZelvoxStrings.soldOut) || 'Sold out') + '</p>' : '') +
            '<p class="quick-add__status" data-quick-add-status role="status" aria-live="polite"></p>' +
            '<a class="quick-add__view" href="' + escapeHtml(p.url) + '">' + escapeHtml((window.ZelvoxStrings && window.ZelvoxStrings.viewDetails) || 'View details') + '</a>' +
            '</form>' +
            '</div></div>';

          /* Wire the in-modal variant picker + form */
          initVariantPickers.call(null);
          var form = inner.querySelector('[data-quick-view-form]');
          var status = inner.querySelector('[data-quick-add-status]');
          if (form) {
            form.addEventListener('submit', function (e) {
              e.preventDefault();
              var idVal = form.querySelector('[data-quick-add-variant]').value;
              var qtyVal = form.querySelector('input[name="quantity"]').value;
              var btn = form.querySelector('[data-quick-add-submit]');
              if (btn) btn.disabled = true;
              Cart.add({ items: [{ id: parseInt(idVal, 10), quantity: Math.max(1, parseInt(qtyVal, 10) || 1) }] })
                .then(function () {
                  if (status) { status.textContent = (window.ZelvoxStrings && window.ZelvoxStrings.added) || 'Added to your cart.'; status.className = 'quick-add__status is-success'; }
                  document.dispatchEvent(new CustomEvent('zelvox:cart:open'));
                  setOpen(false);
                })
                .catch(function () {
                  if (status) { status.textContent = (window.ZelvoxStrings && window.ZelvoxStrings.addFailed) || "Sorry, that item couldn't be added."; status.className = 'quick-add__status is-error'; }
                  if (btn) btn.disabled = false;
                });
            });
          }
        })
        .catch(function () {
          inner.innerHTML = '<p class="qv__loading">' + escapeHtml((window.ZelvoxStrings && window.ZelvoxStrings.loadFailed) || 'Could not load this product.') + '</p>';
        });
    });
  }

  /* --- Wishlist (localStorage; app can be connected later) ------------------ */
  var WISHLIST_KEY = 'zelvox:wishlist';
  function readWishlist() {
    try { return JSON.parse(window.localStorage.getItem(WISHLIST_KEY)) || []; } catch (e) { return []; }
  }
  function writeWishlist(list) {
    try { window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(list)); } catch (e) { /* private mode */ }
    paintWishlist(list);
  }
  function paintWishlist(list) {
    list = list || readWishlist();
    var ids = list.map(function (i) { return String(i.id); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-wishlist-btn]'), function (btn) {
      var on = ids.indexOf(btn.getAttribute('data-product-id')) > -1;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      var label = btn.querySelector('[data-wishlist-label]');
      var onText = btn.getAttribute('data-label-on') || 'Remove from wishlist';
      var offText = btn.getAttribute('data-label-off') || 'Add to wishlist';
      btn.setAttribute('aria-label', on ? onText : offText);
      if (label) label.textContent = on ? onText : offText;
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-wishlist-count]'), function (el) {
      el.textContent = list.length;
      el.classList.toggle('is-hidden', list.length === 0);
    });
    document.dispatchEvent(new CustomEvent('zelvox:wishlist:change', { detail: { items: list } }));
  }
  function initWishlist() {
    paintWishlist();
    document.addEventListener('click', function (event) {
      var btn = event.target.closest && event.target.closest('[data-wishlist-btn]');
      if (!btn) return;
      event.preventDefault();
      var list = readWishlist();
      var id = btn.getAttribute('data-product-id');
      var idx = -1;
      for (var i = 0; i < list.length; i++) { if (String(list[i].id) === id) { idx = i; break; } }
      if (idx > -1) list.splice(idx, 1);
      else {
        list.push({
          id: id,
          handle: btn.getAttribute('data-product-handle'),
          title: btn.getAttribute('data-product-title'),
          url: btn.getAttribute('data-product-url'),
          image: btn.getAttribute('data-product-image'),
          price: parseInt(btn.getAttribute('data-product-price'), 10) || 0
        });
      }
      writeWishlist(list);
      btn.classList.remove('is-pop');
      void btn.offsetWidth;
      btn.classList.add('is-pop');
    });
  }

  /* --- Predictive search --------------------------------------------------- */
  function initPredictiveSearch() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-predictive-form]'), function (form) {
      var input = form.querySelector('[data-search-input]');
      var panel = form.querySelector('[data-search-suggest]');
      if (!input || !panel) return;

      var cache = {};
      var activeIndex = -1;

      function close() {
        panel.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        activeIndex = -1;
      }

      function render(results) {
        if (!results.length) {
          panel.innerHTML = '<p class="search-suggest__empty">' + escapeHtml((window.ZelvoxStrings && window.ZelvoxStrings.noSuggestions) || 'No products match that search.') + '</p>';
          panel.hidden = false;
          input.setAttribute('aria-expanded', 'true');
          return;
        }
        var html = '<ul class="search-suggest__list">';
        results.forEach(function (r, i) {
          var img = r.featured_image_url || (r.image && r.image.replace(/_(\d+)x(\d+)?\./, '_240x.'));
          html +=
            '<li class="search-suggest__item" role="option" id="qsug-' + i + '" aria-selected="false">' +
            '<a href="' + escapeHtml(r.url) + '">' +
            (img ? '<img class="search-suggest__img" src="' + escapeHtml(img) + '" alt="" width="56" height="56" loading="lazy">' : '') +
            '<span class="search-suggest__meta">' +
            '<span class="search-suggest__title">' + escapeHtml(r.title) + '</span>' +
            (r.price ? '<span class="search-suggest__price">' + money(r.price) + '</span>' : '') +
            '</span></a></li>';
        });
        html += '</ul>';
        panel.innerHTML = html;
        panel.hidden = false;
        input.setAttribute('aria-expanded', 'true');
      }

      function search(q) {
        if (cache[q]) { render(cache[q]); return; }
        var url = (window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/') +
          'search/suggest.json?q=' + encodeURIComponent(q) +
          '&resources[type]=product&resources[limit]=5&resources[options][unavailable_products]=hide';
        fetch(url, { headers: { Accept: 'application/json' } })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            var products = (data.resources && data.resources.results && data.resources.results.products) || [];
            cache[q] = products;
            if (input.value.trim() === q) render(products);
          })
          .catch(close);
      }

      var run = debounce(function () {
        var q = input.value.trim();
        if (q.length < 2) { close(); return; }
        search(q);
      }, 220);

      input.addEventListener('input', run);
      input.addEventListener('focus', function () { if (input.value.trim().length >= 2) run(); });

      input.addEventListener('keydown', function (event) {
        var items = panel.querySelectorAll('.search-suggest__item');
        if (event.key === 'Escape') { close(); return; }
        if (!items.length) return;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          activeIndex += event.key === 'ArrowDown' ? 1 : -1;
          if (activeIndex < 0) activeIndex = items.length - 1;
          if (activeIndex >= items.length) activeIndex = 0;
          Array.prototype.forEach.call(items, function (li, i) { li.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false'); });
          input.setAttribute('aria-activedescendant', 'qsug-' + activeIndex);
          var link = items[activeIndex].querySelector('a');
          if (link) link.focus();
        } else if (event.key === 'Enter' && activeIndex > -1) {
          var a = items[activeIndex].querySelector('a');
          if (a) { event.preventDefault(); window.location.href = a.href; }
        }
      });

      document.addEventListener('click', function (event) {
        if (!form.contains(event.target)) close();
      });
    });
  }

  /* --- Collection filters + sorting ---------------------------------------- */
  function initCollectionControls() {
    /* Sort: navigate on change (server-side, SEO friendly) */
    Array.prototype.forEach.call(document.querySelectorAll('[data-sort-select]'), function (select) {
      select.addEventListener('change', function () {
        var form = select.closest('form');
        if (form) form.submit();
      });
    });

    /* Filter panel toggle (mobile) */
    var toggle = document.querySelector('[data-filter-toggle]');
    var panel = document.querySelector('[data-filter-panel]');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var open = panel.hasAttribute('hidden');
        panel.toggleAttribute('hidden', !open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  }

  /* --- Customer address forms (show/hide + delete confirm) ----------------- */
  function initAddressForms() {
    /* Toggle the new / edit address forms via aria-controls */
    document.addEventListener('click', function (event) {
      var toggle = event.target.closest && event.target.closest('[data-address-toggle]');
      if (!toggle) return;
      var id = toggle.getAttribute('aria-controls');
      var panel = id && document.getElementById(id);
      if (!panel) return;
      var open = panel.hasAttribute('hidden');
      panel.toggleAttribute('hidden', !open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    /* Confirm before destroying an address */
    Array.prototype.forEach.call(document.querySelectorAll('[data-address-delete]'), function (btn) {
      btn.addEventListener('click', function (event) {
        var msg = (window.ZelvoxStrings && window.ZelvoxStrings.addressDeleteConfirm) || 'Are you sure you want to delete this address?';
        if (!window.confirm(msg)) event.preventDefault();
      });
    });
  }

  onReady(function () {
    initMobileNav();
    initSearch();
    initCarousels();
    initReveals();
    initHeaderScroll();
    initCartCount();
    initCartDrawer();
    initCartPage();
    initQtySteppers();
    initQuickAdd();
    initVariantPickers();
    initProductForm();
    initGallery();
    initQuickView();
    initWishlist();
    initPredictiveSearch();
    initCollectionControls();
    initAddressForms();
  });
})();
