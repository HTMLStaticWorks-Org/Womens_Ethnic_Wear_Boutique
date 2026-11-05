/**
 * ZARIYA — 3D Perspective Card Tilt & Soft Glare Plugin (tilt.js)
 * Vanilla ES6+ | Respects Touch Devices & prefers-reduced-motion
 */
(function () {
  'use strict';

  const MAX_TILT_DEG = 8;
  const SCALE_HOVER = 1.018;

  /**
   * Checks whether 3D pointer tilt should be active on the current device.
   * Disabled on touch-primary devices and when reduced motion is preferred.
   */
  function canEnableTilt() {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    return !reducedMotion && !coarsePointer;
  }

  /**
   * Attaches 3D perspective mouse-tracking and radial light glare to a single card.
   * @param {HTMLElement} card
   */
  function bindTiltCard(card) {
    if (!card || card.dataset.tiltBound === 'true') return;
    card.dataset.tiltBound = 'true';

    let glare = card.querySelector('.tilt-glare');
    if (!glare) {
      glare = document.createElement('span');
      glare.className = 'tilt-glare';
      glare.setAttribute('aria-hidden', 'true');
      card.appendChild(glare);
    }

    let rafId = null;

    function onMouseMove(event) {
      if (!canEnableTilt()) return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const relX = (event.clientX - rect.left) / rect.width;
      const relY = (event.clientY - rect.top) / rect.height;

      const rotateY = (relX - 0.5) * (MAX_TILT_DEG * 2);
      const rotateX = (0.5 - relY) * (MAX_TILT_DEG * 2);
      const glareX = Math.round(relX * 100);
      const glareY = Math.round(relY * 100);

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        card.style.transition = 'box-shadow 260ms ease, border-color 260ms ease';
        card.style.transform =
          'perspective(1050px) rotateX(' +
          rotateX.toFixed(2) +
          'deg) rotateY(' +
          rotateY.toFixed(2) +
          'deg) scale3d(' +
          SCALE_HOVER +
          ', ' +
          SCALE_HOVER +
          ', ' +
          SCALE_HOVER +
          ')';
        glare.style.opacity = '1';
        glare.style.background =
          'radial-gradient(circle at ' +
          glareX +
          '% ' +
          glareY +
          '%, rgba(255, 249, 232, 0.30), transparent 64%)';
      });
    }

    function onMouseLeave() {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transition =
        'transform 520ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 400ms ease, border-color 400ms ease';
      card.style.transform = 'perspective(1050px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      glare.style.opacity = '0';
    }

    card.addEventListener('mousemove', onMouseMove, { passive: true });
    card.addEventListener('mouseleave', onMouseLeave, { passive: true });
  }

  /**
   * Initializes all .tilt-card elements within a root container.
   * @param {Document|HTMLElement} [root=document]
   */
  function initTilt(root) {
    const scope = root || document;
    const cards = scope.querySelectorAll('.tilt-card');
    cards.forEach(bindTiltCard);
  }

  window.ZariyaTilt = {
    init: initTilt
  };
})();

