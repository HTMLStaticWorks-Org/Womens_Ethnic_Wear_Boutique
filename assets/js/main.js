/**
 * ZARIYA — Luxury Women's Ethnic Wear Boutique
 * Main Application Script (main.js)
 * Pure Vanilla ES6+ | Zero Dependencies | Accessible (WCAG 2.1 AA)
 */
(function () {
  'use strict';

  const STORAGE_THEME_KEY = 'zariya-theme';
  const STORAGE_DIR_KEY = 'zariya-dir';
  const SESSION_PRELOADER_KEY = 'zariya-preloader-seen';

  const prefersReducedMotion = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /* ==========================================================================
     1. THEME (DARK / LIGHT) & RTL DIRECTION MANAGEMENT
     ========================================================================== */

  /**
   * Resolves the initial theme from saved preference or OS color-scheme.
   */
  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (_) {
      /* Ignore storage restrictions */
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Applies the active theme to <html> and updates all theme toggle buttons.
   * @param {'light'|'dark'} theme
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggles = document.querySelectorAll('.js-theme-toggle');
    toggles.forEach(function (btn) {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = isDark
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
    });
  }

  /**
   * Resolves saved reading direction ('ltr' or 'rtl').
   */
  function getPreferredDir() {
    try {
      const saved = localStorage.getItem(STORAGE_DIR_KEY);
      if (saved === 'rtl' || saved === 'ltr') return saved;
    } catch (_) {
      /* Ignore storage restrictions */
    }
    return document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
  }

  /**
   * Applies text direction ('ltr' or 'rtl') to <html> and updates toggle buttons.
   * @param {'ltr'|'rtl'} dir
   */
  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    const toggles = document.querySelectorAll('.js-rtl-toggle');
    toggles.forEach(function (btn) {
      const isRtl = dir === 'rtl';
      btn.setAttribute('aria-pressed', String(isRtl));
      btn.setAttribute(
        'aria-label',
        isRtl ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout'
      );
      btn.setAttribute(
        'title',
        isRtl ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)'
      );
      const labelSpan = btn.querySelector('.js-rtl-label');
      if (labelSpan) {
        labelSpan.textContent = isRtl ? 'LTR' : 'RTL';
      }
    });
  }

  function initThemeAndDirection() {
    applyTheme(getPreferredTheme());
    applyDirection(getPreferredDir());

    document.querySelectorAll('.js-theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem(STORAGE_THEME_KEY, next);
        } catch (_) { /* noop */ }
        applyTheme(next);
      });
    });

    document.querySelectorAll('.js-rtl-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const next = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
        try {
          localStorage.setItem(STORAGE_DIR_KEY, next);
        } catch (_) { /* noop */ }
        applyDirection(next);
      });
    });

    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) {
        mq.addEventListener('change', function (e) {
          try {
            if (!localStorage.getItem(STORAGE_THEME_KEY)) {
              applyTheme(e.matches ? 'dark' : 'light');
            }
          } catch (_) { /* noop */ }
        });
      }
    }
  }

  /* ==========================================================================
     2. PRELOADER & PAGE TRANSITION VEIL
     ========================================================================== */
  function initPreloaderAndTransitions() {
    const preloader = document.querySelector('.preloader');
    const veil = document.querySelector('.page-veil');

    if (preloader) {
      let seen = false;
      try {
        seen = sessionStorage.getItem(SESSION_PRELOADER_KEY) === '1';
        sessionStorage.setItem(SESSION_PRELOADER_KEY, '1');
      } catch (_) { /* noop */ }

      const delay = prefersReducedMotion() || seen ? 40 : 320;
      setTimeout(function () {
        preloader.classList.add('is-hidden');
      }, delay);
    }

    if (veil && !prefersReducedMotion()) {
      document.querySelectorAll('a[href]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          const href = link.getAttribute('href');
          if (
            !href ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('https://wa.me') ||
            link.target === '_blank' ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey
          ) {
            return;
          }
          if (href.endsWith('.html') || href.includes('.html?') || href.includes('.html#')) {
            e.preventDefault();
            veil.classList.add('is-active');
            setTimeout(function () {
              window.location.href = href;
            }, 220);
          }
        });
      });
    }
  }

  /* ==========================================================================
     3. STICKY HEADER & ACCESSIBLE MOBILE NAVIGATION DRAWER
     ========================================================================== */
  function initHeaderAndDrawer() {
    const header = document.querySelector('.site-header');
    if (header) {
      const updateHeader = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
      };
      updateHeader();
      window.addEventListener('scroll', updateHeader, { passive: true });
    }

    const drawer = document.getElementById('mobile-drawer');
    const openBtn = document.querySelector('.js-menu-open');
    const closeBtns = document.querySelectorAll('.js-menu-close');

    if (!drawer || !openBtn) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
      const firstLink = drawer.querySelector('a, button');
      if (firstLink) firstLink.focus();
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      openBtn.focus();
    }

    openBtn.addEventListener('click', openDrawer);
    closeBtns.forEach(function (btn) {
      btn.addEventListener('click', closeDrawer);
    });

    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });
  }

  /* ==========================================================================
     4. CUSTOM DESKTOP CURSOR & MAGNETIC BUTTONS
     ========================================================================== */
  function initCursorAndMagnetic() {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      let mouseX = -100;
      let mouseY = -100;
      let ringX = -100;
      let ringY = -100;

      window.addEventListener(
        'mousemove',
        function (e) {
          mouseX = e.clientX;
          mouseY = e.clientY;
          dot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px) translate(-50%, -50%)';
        },
        { passive: true }
      );

      const renderCursor = function () {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform =
          'translate(' + ringX.toFixed(1) + 'px, ' + ringY.toFixed(1) + 'px) translate(-50%, -50%)';
        requestAnimationFrame(renderCursor);
      };
      requestAnimationFrame(renderCursor);

      const interactiveSelector =
        'a, button, select, input, textarea, .tilt-card, .masonry-item, .hotspot-pin';
      document.addEventListener('mouseover', function (e) {
        if (e.target && e.target.closest(interactiveSelector)) {
          document.body.classList.add('cursor-hover');
        }
      });
      document.addEventListener('mouseout', function (e) {
        if (e.target && e.target.closest(interactiveSelector)) {
          document.body.classList.remove('cursor-hover');
        }
      });
    }

    /* Subtle Magnetic Pull on Primary CTAs */
    document.querySelectorAll('.btn-magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.16;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.16;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     5. SCROLL REVEALS & PARALLAX BANNERS
     ========================================================================== */
  function initScrollRevealsAndParallax() {
    const revealTargets = document.querySelectorAll('.reveal-up, .reveal-curtain');

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      revealTargets.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });

    /* Subtle Parallax on Hero & Banner Media */
    const parallaxNodes = document.querySelectorAll('.js-parallax');
    if (parallaxNodes.length) {
      let ticking = false;
      window.addEventListener(
        'scroll',
        function () {
          if (!ticking) {
            requestAnimationFrame(function () {
              parallaxNodes.forEach(function (node) {
                const parent = node.parentElement;
                if (!parent) return;
                const rect = parent.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) return;
                const offset = rect.top * -0.1;
                node.style.transform = 'translate3d(0, ' + offset.toFixed(1) + 'px, 0)';
              });
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true }
      );
    }
  }

  /* ==========================================================================
     6. HOME 1 — CUSTOMER STYLE STORIES SLIDER
     ========================================================================== */
  function initCustomerStories() {
    const stage = document.querySelector('.js-stories-stage');
    if (!stage) return;

    const slides = Array.from(stage.querySelectorAll('.story-slide'));
    const dots = Array.from(stage.querySelectorAll('.story-dot'));
    const prevBtn = stage.querySelector('.js-story-prev');
    const nextBtn = stage.querySelector('.js-story-next');
    if (!slides.length) return;

    let activeIndex = 0;

    function showStory(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        const active = idx === activeIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach(function (dot, idx) {
        dot.setAttribute('aria-selected', String(idx === activeIndex));
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        showStory(activeIndex - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        showStory(activeIndex + 1);
      });
    }
    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        showStory(idx);
      });
    });

    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') showStory(activeIndex - 1);
      if (e.key === 'ArrowRight') showStory(activeIndex + 1);
    });
  }

  /* ==========================================================================
     7. HOME 2 — DRAGGABLE FILMSTRIP, BUILD-THE-LOOK HOTSPOTS & LIGHTBOX
     ========================================================================== */
  function initHome2Features() {
    /* 7A. Horizontal Drag-to-Scroll Magazine Filmstrip */
    const filmstrip = document.querySelector('.js-filmstrip');
    if (filmstrip) {
      let isDown = false;
      let startX = 0;
      let scrollStart = 0;

      filmstrip.addEventListener('mousedown', function (e) {
        isDown = true;
        filmstrip.classList.add('is-dragging');
        startX = e.pageX - filmstrip.offsetLeft;
        scrollStart = filmstrip.scrollLeft;
      });

      window.addEventListener('mouseup', function () {
        isDown = false;
        filmstrip.classList.remove('is-dragging');
      });

      filmstrip.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - filmstrip.offsetLeft;
        const walk = (x - startX) * 1.4;
        filmstrip.scrollLeft = scrollStart - walk;
      });

      const prevFilm = document.querySelector('.js-film-prev');
      const nextFilm = document.querySelector('.js-film-next');
      const dirSign = function () {
        return document.documentElement.getAttribute('dir') === 'rtl' ? -1 : 1;
      };
      if (prevFilm) {
        prevFilm.addEventListener('click', function () {
          filmstrip.scrollBy({ left: -380 * dirSign(), behavior: 'smooth' });
        });
      }
      if (nextFilm) {
        nextFilm.addEventListener('click', function () {
          filmstrip.scrollBy({ left: 380 * dirSign(), behavior: 'smooth' });
        });
      }
    }

    /* 7B. Interactive "Style It Your Way" Hotspot Look Builder */
    const lookBuilder = document.querySelector('.js-look-builder');
    if (lookBuilder) {
      const pins = Array.from(lookBuilder.querySelectorAll('.hotspot-pin'));
      const stepBtns = Array.from(lookBuilder.querySelectorAll('.styling-step-btn'));
      const liveNote = lookBuilder.querySelector('.js-hotspot-live-note');

      const activateStep = function (stepIdx) {
        pins.forEach(function (pin) {
          pin.setAttribute('aria-selected', String(pin.dataset.step === stepIdx));
        });
        stepBtns.forEach(function (btn) {
          const isMatch = btn.dataset.step === stepIdx;
          btn.setAttribute('aria-selected', String(isMatch));
          if (isMatch && liveNote) {
            liveNote.textContent = btn.dataset.tip || '';
          }
        });
      };

      pins.forEach(function (pin) {
        pin.addEventListener('click', function () {
          activateStep(pin.dataset.step);
        });
      });
      stepBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          activateStep(btn.dataset.step);
        });
      });
    }

    /* 7C. Masonry Campaign Gallery Lightbox */
    const masonryItems = Array.from(document.querySelectorAll('.js-lightbox-trigger'));
    const lightbox = document.getElementById('campaign-lightbox');
    if (masonryItems.length && lightbox) {
      const lbImg = lightbox.querySelector('.lightbox__img');
      const lbCaption = lightbox.querySelector('.lightbox__caption');
      const lbClose = lightbox.querySelector('.lightbox__close');
      const lbPrev = lightbox.querySelector('.lightbox__nav--prev');
      const lbNext = lightbox.querySelector('.lightbox__nav--next');
      let currentIdx = 0;
      let lastTrigger = null;

      const openLightbox = function (idx) {
        currentIdx = (idx + masonryItems.length) % masonryItems.length;
        const item = masonryItems[currentIdx];
        const imgEl = item.querySelector('img');
        if (lbImg && imgEl) {
          lbImg.src = imgEl.currentSrc || imgEl.src;
          lbImg.alt = imgEl.alt;
        }
        if (lbCaption) {
          lbCaption.textContent = item.dataset.caption || '';
        }
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        if (lbClose) lbClose.focus();
      };

      const closeLightbox = function () {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (lastTrigger) lastTrigger.focus();
      };

      masonryItems.forEach(function (item, idx) {
        item.addEventListener('click', function () {
          lastTrigger = item;
          openLightbox(idx);
        });
      });

      if (lbClose) lbClose.addEventListener('click', closeLightbox);
      if (lbPrev) {
        lbPrev.addEventListener('click', function () {
          openLightbox(currentIdx - 1);
        });
      }
      if (lbNext) {
        lbNext.addEventListener('click', function () {
          openLightbox(currentIdx + 1);
        });
      }

      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });

      document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') openLightbox(currentIdx - 1);
        if (e.key === 'ArrowRight') openLightbox(currentIdx + 1);
      });
    }
  }

  /* ==========================================================================
     8. PRODUCTS PAGE — FILTERS, SORTING, SKELETON LOADER & DETAIL MODAL
     ========================================================================== */

  /**
   * Rich Couture Metadata for the 12 Boutique Products on products.html
   * TODO: Customize descriptions, fabrics, care instructions, or prices as needed.
   */
  const PRODUCT_DETAILS_MAP = {
    'kurti-01': {
      colors: ['Warm Ivory', 'Champagne Mist'],
      care: 'Dry clean only. Store folded in breathable mulmul cloth away from direct sunlight.',
      styling:
        'Pair with tailored Chanderi cigarette trousers, oxidized silver-gold jhumkas, and ivory pearl-embroidered leather juttis.',
      description:
        'Handloom Chanderi straight-cut kurti woven with gossamer zari borders along the placket and cuffs, finished with tonal resham motifs for effortless daytime refinement.'
    },
    'kurti-02': {
      colors: ['Royal Maroon', 'Deep Garnet'],
      care: 'Professional dry clean recommended. Steam gently from the reverse side.',
      styling:
        'Style with a sheer antique-gold organza dupatta, kundan chandbalis, and gilded kolhapuri heels for intimate festive evenings.',
      description:
        'Fluid mulberry silk Anarkali kurti featuring a sculpted empire bodice, hand-embroidered antique zari kalis, and delicate gold gota edging along the flared hemline.'
    },
    'kurti-03': {
      colors: ['Blush Pink', 'Dusty Rose'],
      care: 'Dry clean only. Avoid spraying perfume directly onto hand-embroidered zari threads.',
      styling:
        'Complete the look with wide-leg ivory silk palazzos, pearl choker jewellery, and a blush potli clutch.',
      description:
        'Luminous silk-organza kurti adorned with intricate Lucknowi-inspired floral threadwork, fine badla highlights, and soft mulmul lining for featherlight comfort.'
    },
    'kurti-04': {
      colors: ['Emerald Green', 'Forest Sage'],
      care: 'Gentle cold hand-wash separately or dry clean. Dry in shade.',
      styling:
        'Team with crispecru cotton-silk churidars, sculpted brass cuffs, and tan handcrafted juttis for daytime grace.',
      description:
        'Artisanal A-line cotton-mulmul kurti showcasing heritage botanical handblock motifs accented with subtle kantha running stitch at the neckline.'
    },
    'lehenga-05': {
      colors: ['Oxblood Maroon', 'Sindoor Crimson'],
      care: 'Specialist couture dry clean only. Store in padded heirloom garment bag.',
      styling:
        'Drape with double dupattas—one pleated over the shoulder and a sheer veil overhead—paired with uncut polki choker jewellery and zardozi bridal juttis.',
      description:
        'Heirloom bridal lehenga crafted from pure raw silk, richly hand-embroidered over 340 artisan hours with antique dabka, nakshi, kundan, and architectural peacock-garden motifs.'
    },
    'lehenga-06': {
      colors: ['Midnight Blue', 'Twilight Indigo'],
      care: 'Dry clean only. Handle mirror-work panels with care.',
      styling:
        'Elevate for sangeet nights with diamond-polki drop earrings, metallic stackable bangles, and a structured embellished box clutch.',
      description:
        'Contemporary sangeet and cocktail lehenga in fluid pure georgette illuminated by geometric abhla mirror-work, metallic kasab embroidery, and a modern sweetheart choli.'
    },
    'lehenga-07': {
      colors: ['Antique Gold', 'Saffron Brocade'],
      care: 'Dry clean only. Refold periodically along different crease lines to preserve pure zari.',
      styling:
        'Contrast the molten gold weave with an emerald stone choker, gajra hair florals, and woven brocade potli accessories.',
      description:
        'Handwoven Banarasi kadhua silk lehenga gleaming with heirloom floral jaal brocade, paired with an elbow-sleeve silk blouse and tasseled tissue dupatta.'
    },
    'lehenga-08': {
      colors: ['Blush Pink', 'Peach Blossom'],
      care: 'Dry clean only. Low-heat steam for organza pleats.',
      styling:
        'Ideal for sunlit mehendi or daytime weddings alongside pastel meenakari earrings and pearl-studded block-heel juttis.',
      description:
        'Whisper-light pure organza lehenga skirt delicately embroidered with pastel silk resham blooms, sequin dew-drops, and a scalloped pearl dupatta.'
    },
    'suit-09': {
      colors: ['Emerald Green', 'Bottle Jewel'],
      care: 'Dry clean only. Protect zari borders with acid-free tissue paper.',
      styling:
        'Pair with heritage gold jhumkas, a statement cocktail ring, and metallic gold heels for wedding receptions.',
      description:
        'Regal floor-grazing mulberry silk Anarkali suit set tailored with 24 voluminous panels, intricate zardozi neckline embroidery, churidar bottoms, and a bordered silk dupatta.'
    },
    'suit-10': {
      colors: ['Champagne Gold', 'Marigold Ivory'],
      care: 'Dry clean only. Steam lightly while hanging.',
      styling:
        'Accessorize with kundan passa/maang-tikka, pearl-drop earrings, and gilded potli bag for haldi and festive soirées.',
      description:
        'Festive Chanderi silk short kurta and flared sharara ensemble detailed with artisanal Rajasthani gota-patti किरण (kiran) edging and airy scalloped dupatta.'
    },
    'suit-11': {
      colors: ['Warm Ivory', 'Pearl Cream'],
      care: 'Dry clean recommended. Cool iron on reverse if required.',
      styling:
        'Pair effortlessly with emerald-drop earrings, a contrasting jewel-toned silk shawl or dupatta, and embroidered mules.',
      description:
        'Architectural straight-cut georgette-silk kurta paired with fluid wide-leg palazzo trousers and intricate tonal threadwork along the sleeves and hem.'
    },
    'suit-12': {
      colors: ['Midnight Blue', 'Royal Aubergine'],
      care: 'Specialist velvet dry clean only. Never press velvet directly with a flat iron.',
      styling:
        'Complete winter wedding celebrations with antique gold chandbalis, velvet potli clutch, and closed-toe zardozi juttis.',
      description:
        'Opulent micro-velvet embroidered suit set featuring antique tilla and marodi gold embroidery along the neckline, cuffs, and heirloom silk-organza dupatta.'
    }
  };

  function initProductsCatalogue() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const allCards = Array.from(grid.querySelectorAll('.js-product-card'));
    const skeleton = document.getElementById('products-skeleton');
    const countEl = document.getElementById('results-count');
    const emptyState = document.getElementById('products-empty');
    const clearBtns = document.querySelectorAll('.js-clear-filters');

    const selCategory = document.getElementById('filter-category');
    const selPrice = document.getElementById('filter-price');
    const selSize = document.getElementById('filter-size');
    const selColor = document.getElementById('filter-color');
    const selFabric = document.getElementById('filter-fabric');
    const selOccasion = document.getElementById('filter-occasion');
    const selSort = document.getElementById('sort-products');
    const subcatPills = Array.from(document.querySelectorAll('.js-subcat-pill'));

    let activeSubcat = 'all';
    let filterTimer = null;

    /* Pre-populate filter from URL query params (?category=Kurtis&occasion=Festive) */
    const params = new URLSearchParams(window.location.search);
    if (params.get('category') && selCategory) {
      selCategory.value = params.get('category');
    }
    if (params.get('occasion') && selOccasion) {
      selOccasion.value = params.get('occasion');
    }

    function matchesPriceRange(price, rangeVal) {
      if (!rangeVal || rangeVal === 'all') return true;
      if (rangeVal === 'under-10000') return price < 10000;
      if (rangeVal === '10000-25000') return price >= 10000 && price <= 25000;
      if (rangeVal === '25000-50000') return price > 25000 && price <= 50000;
      if (rangeVal === 'above-50000') return price > 50000;
      return true;
    }

    function runFilterAndSort(withSkeleton) {
      const catVal = selCategory ? selCategory.value : 'all';
      const priceVal = selPrice ? selPrice.value : 'all';
      const sizeVal = selSize ? selSize.value : 'all';
      const colorVal = selColor ? selColor.value : 'all';
      const fabricVal = selFabric ? selFabric.value : 'all';
      const occVal = selOccasion ? selOccasion.value : 'all';
      const sortVal = selSort ? selSort.value : 'newest';

      const applyDOM = function () {
        const matched = allCards.filter(function (card) {
          const cCat = card.dataset.category || '';
          const cSubcats = (card.dataset.subcategories || '').split('|');
          const cPrice = Number(card.dataset.price || 0);
          const cSizes = (card.dataset.sizes || '').split(',');
          const cColor = card.dataset.color || '';
          const cFabric = card.dataset.fabric || '';
          const cOccasions = (card.dataset.occasion || '').split('|');

          if (catVal !== 'all' && cCat !== catVal) return false;
          if (activeSubcat !== 'all' && !cSubcats.includes(activeSubcat)) return false;
          if (!matchesPriceRange(cPrice, priceVal)) return false;
          if (sizeVal !== 'all' && !cSizes.includes(sizeVal)) return false;
          if (colorVal !== 'all' && cColor !== colorVal) return false;
          if (fabricVal !== 'all' && cFabric !== fabricVal) return false;
          if (occVal !== 'all' && !cOccasions.includes(occVal)) return false;
          return true;
        });

        matched.sort(function (a, b) {
          const priceA = Number(a.dataset.price || 0);
          const priceB = Number(b.dataset.price || 0);
          const orderA = Number(a.dataset.order || 0);
          const orderB = Number(b.dataset.order || 0);
          if (sortVal === 'price-asc') return priceA - priceB;
          if (sortVal === 'price-desc') return priceB - priceA;
          return orderA - orderB;
        });

        allCards.forEach(function (c) {
          c.style.display = 'none';
        });

        matched.forEach(function (c) {
          c.style.display = '';
          c.classList.add('is-visible');
          grid.appendChild(c);
        });

        if (skeleton) skeleton.classList.remove('is-loading');
        grid.style.display = matched.length ? '' : 'none';

        if (emptyState) {
          emptyState.hidden = matched.length > 0;
        }
        if (countEl) {
          countEl.textContent =
            'Showing ' + matched.length + ' of ' + allCards.length + ' curated outfits';
        }
        if (window.ZariyaTilt) {
          window.ZariyaTilt.init(grid);
        }
      };

      if (filterTimer) clearTimeout(filterTimer);

      if (withSkeleton && skeleton && !prefersReducedMotion()) {
        grid.style.display = 'none';
        if (emptyState) emptyState.hidden = true;
        skeleton.classList.add('is-loading');
        filterTimer = setTimeout(applyDOM, 260);
      } else {
        applyDOM();
      }
    }

    [selCategory, selPrice, selSize, selColor, selFabric, selOccasion, selSort].forEach(function (el) {
      if (el) {
        el.addEventListener('change', function () {
          runFilterAndSort(true);
        });
      }
    });

    subcatPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        activeSubcat = pill.dataset.subcat || 'all';
        subcatPills.forEach(function (p) {
          p.setAttribute('aria-pressed', String(p === pill));
        });
        runFilterAndSort(true);
      });
    });

    /* Category Banner Quick-Jump Links on Products Page */
    document.querySelectorAll('.js-jump-category').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetCat = link.dataset.targetCategory;
        if (targetCat && selCategory) {
          e.preventDefault();
          selCategory.value = targetCat;
          activeSubcat = 'all';
          subcatPills.forEach(function (p) {
            p.setAttribute('aria-pressed', String(p.dataset.subcat === 'all'));
          });
          runFilterAndSort(true);
          const section = document.getElementById('all-products');
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    /* Featured Collection Quick-Filter Triggers */
    document.querySelectorAll('.js-collection-trigger').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const occ = btn.dataset.filterOccasion || 'all';
        if (selCategory) selCategory.value = 'all';
        if (selPrice) selPrice.value = 'all';
        if (selSize) selSize.value = 'all';
        if (selColor) selColor.value = 'all';
        if (selFabric) selFabric.value = 'all';
        if (selOccasion) selOccasion.value = occ;
        activeSubcat = 'all';
        runFilterAndSort(true);
        const section = document.getElementById('all-products');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      });
    });

    clearBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (selCategory) selCategory.value = 'all';
        if (selPrice) selPrice.value = 'all';
        if (selSize) selSize.value = 'all';
        if (selColor) selColor.value = 'all';
        if (selFabric) selFabric.value = 'all';
        if (selOccasion) selOccasion.value = 'all';
        if (selSort) selSort.value = 'newest';
        activeSubcat = 'all';
        subcatPills.forEach(function (p) {
          p.setAttribute('aria-pressed', String(p.dataset.subcat === 'all'));
        });
        runFilterAndSort(true);
      });
    });

    /* Initial Filter Pass (applies query string filters if present) */
    runFilterAndSort(false);

    /* Product Details & Styling Modal */
    initProductDetailModal();
  }

  function initProductDetailModal() {
    const modal = document.getElementById('product-detail-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.js-modal-close');
    const stageWrap = modal.querySelector('.modal-gallery__stage');
    const mainImg = document.getElementById('modal-product-img');
    const thumbBtns = Array.from(modal.querySelectorAll('.js-modal-thumb'));

    const badgeEl = document.getElementById('modal-product-badge');
    const titleEl = document.getElementById('modal-product-title');
    const priceEl = document.getElementById('modal-product-price');
    const descEl = document.getElementById('modal-product-desc');
    const fabricEl = document.getElementById('modal-product-fabric');
    const sizesEl = document.getElementById('modal-product-sizes');
    const colorsEl = document.getElementById('modal-product-colors');
    const careEl = document.getElementById('modal-product-care');
    const stylingEl = document.getElementById('modal-product-styling');
    const enquireLink = document.getElementById('modal-enquire-cta');

    let lastOpener = null;

    function applyZoomPreset(preset) {
      if (!mainImg) return;
      if (preset === 'bodice') {
        mainImg.style.transformOrigin = '50% 24%';
        mainImg.style.transform = 'scale(1.95)';
      } else if (preset === 'hem') {
        mainImg.style.transformOrigin = '50% 80%';
        mainImg.style.transform = 'scale(1.95)';
      } else {
        mainImg.style.transformOrigin = '50% 50%';
        mainImg.style.transform = 'scale(1)';
      }
    }

    thumbBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        thumbBtns.forEach(function (b) {
          b.setAttribute('aria-selected', String(b === btn));
        });
        applyZoomPreset(btn.dataset.view || 'full');
      });
    });

    if (stageWrap && mainImg) {
      stageWrap.addEventListener('mousemove', function (e) {
        const rect = stageWrap.getBoundingClientRect();
        const xPct = ((e.clientX - rect.left) / rect.width) * 100;
        const yPct = ((e.clientY - rect.top) / rect.height) * 100;
        mainImg.style.transformOrigin = xPct.toFixed(1) + '% ' + yPct.toFixed(1) + '%';
        mainImg.style.transform = 'scale(2.1)';
      });
      stageWrap.addEventListener('mouseleave', function () {
        const activeThumb = modal.querySelector('.js-modal-thumb[aria-selected="true"]');
        applyZoomPreset(activeThumb ? activeThumb.dataset.view : 'full');
      });
    }

    function openModalFromCard(card, triggerEl) {
      lastOpener = triggerEl;
      const pid = card.dataset.id || 'kurti-01';
      const details = PRODUCT_DETAILS_MAP[pid] || PRODUCT_DETAILS_MAP['kurti-01'];
      const cardImg = card.querySelector('img');
      const name = card.dataset.name || '';
      const category = card.dataset.category || 'Kurtis';
      const formattedPrice = card.dataset.priceFormatted || '';
      const badge = card.dataset.badge || 'Couture Edit';
      const fabric = card.dataset.fabric || 'Pure Silk';
      const sizes = (card.dataset.sizes || 'S,M,L').split(',');

      if (mainImg && cardImg) {
        mainImg.src = cardImg.currentSrc || cardImg.src;
        mainImg.alt = cardImg.alt;
        applyZoomPreset('full');
      }
      thumbBtns.forEach(function (b, idx) {
        b.setAttribute('aria-selected', String(idx === 0));
      });

      if (badgeEl) badgeEl.textContent = badge + ' · ' + category;
      if (titleEl) titleEl.textContent = name;
      if (priceEl) priceEl.textContent = formattedPrice;
      if (descEl) descEl.textContent = details.description;
      if (fabricEl) fabricEl.textContent = fabric;
      if (careEl) careEl.textContent = details.care;
      if (stylingEl) stylingEl.textContent = details.styling;

      if (sizesEl) {
        sizesEl.innerHTML = sizes
          .map(function (s, idx) {
            return (
              '<button type="button" class="subcat-pill js-size-option" aria-pressed="' +
              (idx === 0 ? 'true' : 'false') +
              '">' +
              s +
              '</button>'
            );
          })
          .join('');
        sizesEl.querySelectorAll('.js-size-option').forEach(function (sb) {
          sb.addEventListener('click', function () {
            sizesEl.querySelectorAll('.js-size-option').forEach(function (other) {
              other.setAttribute('aria-pressed', String(other === sb));
            });
          });
        });
      }

      if (colorsEl) {
        colorsEl.textContent = details.colors.join(' · ');
      }

      if (enquireLink) {
        const q = new URLSearchParams({
          category: category,
          product: name
        });
        enquireLink.href = 'contact.html?' + q.toString() + '#enquiry-form';
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastOpener) lastOpener.focus();
    }

    document.querySelectorAll('.js-open-product-modal').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const card = btn.closest('.js-product-card');
        if (card) openModalFromCard(card, btn);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     9. ACCESSIBLE ACCORDION (SHOPPING ASSISTANCE)
     ========================================================================== */
  function initAccordions() {
    document.querySelectorAll('.js-accordion-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        const panelId = trigger.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        trigger.setAttribute('aria-expanded', String(!expanded));
        if (panel) {
          panel.hidden = expanded;
        }
      });
    });
  }

  /* ==========================================================================
     10. FESTIVE EDIT — INTERACTIVE COLOURS OF CELEBRATION SWATCHES
     ========================================================================== */
  function initFestiveColorSwatches() {
    const shell = document.querySelector('.js-color-story-shell');
    if (!shell) return;

    const swatches = Array.from(shell.querySelectorAll('.swatch-btn'));
    const panels = Array.from(shell.querySelectorAll('.color-story-panel'));

    swatches.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetColor = btn.dataset.colorId;
        const hex = btn.dataset.accentHex || '#8B1538';
        const soft = btn.dataset.accentSoft || 'rgba(139, 21, 56, 0.12)';

        document.documentElement.style.setProperty('--festive-accent', hex);
        document.documentElement.style.setProperty('--festive-accent-soft', soft);

        swatches.forEach(function (b) {
          b.setAttribute('aria-selected', String(b === btn));
        });

        panels.forEach(function (panel) {
          const isMatch = panel.dataset.colorPanel === targetColor;
          panel.classList.toggle('is-active', isMatch);
          panel.setAttribute('aria-hidden', String(!isMatch));
        });
      });
    });
  }

  /* ==========================================================================
     11. CONTACT ENQUIRY FORM, NEWSLETTER VALIDATION & COUNTDOWN TIMER
     ========================================================================== */
  function initFormsAndCountdown() {
    /* Auto-prefill Contact Form from Product Enquiry URL Params */
    const enquiryForm = document.getElementById('boutique-enquiry-form');
    if (enquiryForm) {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      const prodParam = params.get('product');

      const catSelect = enquiryForm.querySelector('#enquiry-category');
      const prodInput = enquiryForm.querySelector('#enquiry-product');

      if (catParam && catSelect) {
        Array.from(catSelect.options).forEach(function (opt) {
          if (opt.value.toLowerCase() === catParam.toLowerCase()) {
            catSelect.value = opt.value;
          }
        });
      }
      if (prodParam && prodInput) {
        prodInput.value = prodParam;
      }

      const fields = {
        name: {
          el: enquiryForm.querySelector('#enquiry-name'),
          err: enquiryForm.querySelector('#error-name'),
          validate: function (v) {
            return v.trim().length >= 2
              ? ''
              : 'Please enter your full name (at least 2 characters).';
          }
        },
        phone: {
          el: enquiryForm.querySelector('#enquiry-phone'),
          err: enquiryForm.querySelector('#error-phone'),
          validate: function (v) {
            const digits = v.replace(/[^\d]/g, '');
            return digits.length >= 10 && digits.length <= 15
              ? ''
              : 'Please enter a valid 10–15 digit phone or WhatsApp number.';
          }
        },
        email: {
          el: enquiryForm.querySelector('#enquiry-email'),
          err: enquiryForm.querySelector('#error-email'),
          validate: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
              ? ''
              : 'Please enter a valid email address (e.g., priya@example.com).';
          }
        },
        category: {
          el: catSelect,
          err: enquiryForm.querySelector('#error-category'),
          validate: function (v) {
            return v.trim() !== '' ? '' : 'Please choose Kurtis, Lehengas, or Salwar Suits.';
          }
        },
        message: {
          el: enquiryForm.querySelector('#enquiry-message'),
          err: enquiryForm.querySelector('#error-message'),
          validate: function (v) {
            return v.trim().length >= 10
              ? ''
              : 'Please share a brief note about your styling enquiry (at least 10 characters).';
          }
        }
      };

      const validateSingleField = function (key) {
        const item = fields[key];
        if (!item || !item.el) return true;
        const msg = item.validate(item.el.value);
        item.el.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (item.err) item.err.textContent = msg;
        return !msg;
      };

      Object.keys(fields).forEach(function (key) {
        const item = fields[key];
        if (item.el) {
          item.el.addEventListener('blur', function () {
            validateSingleField(key);
          });
          item.el.addEventListener('input', function () {
            if (item.el.getAttribute('aria-invalid') === 'true') {
              validateSingleField(key);
            }
          });
        }
      });

      enquiryForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let firstInvalid = null;
        let allValid = true;

        Object.keys(fields).forEach(function (key) {
          const ok = validateSingleField(key);
          if (!ok && !firstInvalid) {
            firstInvalid = fields[key].el;
          }
          if (!ok) allValid = false;
        });

        if (!allValid) {
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        const successBox = document.getElementById('enquiry-success');
        /* TODO: Replace placeholder action or enable fetch POST to Formspree endpoint */
        const endpoint = enquiryForm.dataset.formspreeEndpoint;
        if (endpoint && endpoint.startsWith('https://formspree.io/f/') && !endpoint.includes('YOUR_FORM_ID')) {
          fetch(endpoint, {
            method: 'POST',
            body: new FormData(enquiryForm),
            headers: { Accept: 'application/json' }
          }).catch(function () { /* Graceful static fallback */ });
        }

        enquiryForm.reset();
        Object.keys(fields).forEach(function (key) {
          if (fields[key].el) fields[key].el.setAttribute('aria-invalid', 'false');
        });
        if (successBox) {
          successBox.classList.add('is-visible');
          successBox.focus();
        }
      });
    }

    /* Newsletter Email Capture Forms (Footer & Coming Soon Page) */
    document.querySelectorAll('.js-newsletter-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const feedback = form.querySelector('.js-newsletter-feedback');
        if (!input) return;

        const email = input.value.trim();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        if (!valid) {
          input.setAttribute('aria-invalid', 'true');
          if (feedback) {
            feedback.textContent = 'Please enter a valid email address to join the guest list.';
            feedback.style.color = '#F87171';
          }
          input.focus();
          return;
        }

        input.setAttribute('aria-invalid', 'false');
        input.value = '';
        if (feedback) {
          feedback.textContent =
            'Thank you. You are now on the Zariya Private Preview & Festive Edit list.';
          feedback.style.color = '#E3C57B';
        }
      });
    });

    /* Coming Soon Countdown Timer */
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMins = document.getElementById('cd-mins');
    const cdSecs = document.getElementById('cd-secs');

    if (cdDays && cdHours && cdMins && cdSecs) {
      /* Counts down to a rolling 24-day seasonal couture launch window */
      const targetTime = Date.now() + 24 * 24 * 60 * 60 * 1000 + 7 * 3600 * 1000 + 42 * 60 * 1000;
      const updateTimer = function () {
        const diff = Math.max(0, targetTime - Date.now());
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        cdDays.textContent = String(d).padStart(2, '0');
        cdHours.textContent = String(h).padStart(2, '0');
        cdMins.textContent = String(m).padStart(2, '0');
        cdSecs.textContent = String(s).padStart(2, '0');
      };
      updateTimer();
      setInterval(updateTimer, 1000);
    }
  }

  /* ==========================================================================
     11B. SCROLL UP (BACK TO TOP) BUTTON
     ========================================================================== */
  function initScrollUpButton() {
    let btn = document.getElementById('scroll-up-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'scroll-up-btn';
      btn.className = 'scroll-up-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Scroll back to top');
      btn.setAttribute('title', 'Back to top');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      `;
      document.body.appendChild(btn);
    }

    let isVisible = false;
    const toggleVisibility = function () {
      const shouldShow = window.scrollY > 320;
      if (shouldShow !== isVisible) {
        isVisible = shouldShow;
        btn.classList.toggle('is-visible', isVisible);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
      /* Return focus to main landmark or skip link for keyboard accessibility */
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.focus({ preventScroll: true });
      }
    });
  }

  /* ==========================================================================
     12. BOOTSTRAP ON DOM READY
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initThemeAndDirection();
    initPreloaderAndTransitions();
    initHeaderAndDrawer();
    initCursorAndMagnetic();
    initScrollRevealsAndParallax();
    initCustomerStories();
    initHome2Features();
    initProductsCatalogue();
    initAccordions();
    initFestiveColorSwatches();
    initFormsAndCountdown();
    initScrollUpButton();

    if (window.ZariyaTilt) {
      window.ZariyaTilt.init(document);
    }
  });
})();

