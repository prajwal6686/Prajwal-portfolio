/**
 * PRAJWAL AUGHADE — EDITORIAL MARKETING PORTFOLIO SCRIPT
 * Minimalist, Editorial, Continuous Scroll Storytelling
 * GSAP ScrollTrigger Choreography · Accessible Single-Page UI
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 01. DOM ELEMENTS SELECTION
  // --------------------------------------------------------------------------
  const progressBar = document.getElementById('progressBar');
  const siteHeader = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  // Analytics panel tabs
  const panelTabs = document.querySelectorAll('.panel-tab');
  const dashboardViews = document.querySelectorAll('.dashboard-view');

  // Modal elements
  const modal = document.getElementById('projectModal');
  const backdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalKicker = document.getElementById('modalKicker');
  const modalTitle = document.getElementById('modalTitle');
  const modalSummary = document.getElementById('modalSummary');
  const modalChallenge = document.getElementById('modalChallenge');
  const modalFocus = document.getElementById('modalFocus');
  const modalWork = document.getElementById('modalWork');
  const modalOutcome = document.getElementById('modalOutcome');
  const modalTools = document.getElementById('modalTools');
  const modalExternalWrap = document.getElementById('modalExternalWrap');
  const modalLiveLink = document.getElementById('modalLiveLink');

  // Project cards trigger
  let lastActiveElement = null;

  function initSignalNodeInteractions() {
    const canvas = document.getElementById('signalDiagram');
    const nodes = Array.from(document.querySelectorAll('.signal-node-button'));
    if (!canvas || !nodes.length) return;

    let selectedSignal = null;
    const preview = (signal) => { canvas.dataset.activeSignal = signal; };
    const clearPreview = () => {
      if (selectedSignal) preview(selectedSignal);
      else delete canvas.dataset.activeSignal;
    };

    nodes.forEach((node) => {
      node.addEventListener('pointerenter', () => preview(node.dataset.signal));
      node.addEventListener('pointerleave', clearPreview);
      node.addEventListener('focus', () => preview(node.dataset.signal));
      node.addEventListener('blur', clearPreview);
      node.addEventListener('click', () => {
        const nextSignal = node.getAttribute('aria-pressed') === 'true' ? null : node.dataset.signal;
        selectedSignal = nextSignal;
        nodes.forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.signal === selectedSignal)));
        clearPreview();
      });
    });
  }

  function initCapabilityNotes() {
    document.querySelectorAll('.pillar-explore[aria-controls]').forEach((button) => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      if (!panel) return;
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        panel.hidden = expanded;
        const label = button.querySelector('span');
        if (label) label.textContent = expanded ? 'See it in practice' : 'Close field note';
      });
    });
  }

  function initProjectGalleryKeyboard() {
    const stage = document.getElementById('projectStoryStage');
    if (!stage) return;
    const cards = Array.from(stage.querySelectorAll('.project-showcase-card'));
    stage.addEventListener('keydown', (event) => {
      if (!window.matchMedia('(max-width: 767px)').matches || !['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
      if (event.target.closest('a, button, input, select, textarea')) return;
      const firstCard = cards[0];
      if (!firstCard || stage.scrollWidth <= stage.clientWidth + 2) return;
      event.preventDefault();
      const styles = getComputedStyle(stage);
      const gap = parseFloat(styles.columnGap || styles.gap) || 18;
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      stage.scrollBy({ left: direction * (firstCard.getBoundingClientRect().width + gap), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  function splitAnimatedWords(element, maskClass, wordClass) {
    if (!element || element.dataset.wordsReady === 'true') return [];
    const textNodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.trim()) textNodes.push(walker.currentNode);
    }
    textNodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      textNode.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
          return;
        }
        const mask = document.createElement('span');
        const word = document.createElement('span');
        mask.className = maskClass;
        word.className = wordClass;
        word.textContent = part;
        mask.appendChild(word);
        fragment.appendChild(mask);
      });
      textNode.parentNode.replaceChild(fragment, textNode);
    });
    element.dataset.wordsReady = 'true';
    if (!element.hasAttribute('aria-label')) element.setAttribute('aria-label', element.textContent.replace(/\s+/g, ' ').trim());
    return Array.from(element.querySelectorAll(`.${wordClass}`));
  }



  function initFinePointerEffects(gsapInstance) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
    const cursor = document.getElementById('portfolioCursor');
    const cursorLabel = cursor && cursor.querySelector('span');
    if (!cursor) return;

    document.body.classList.add('has-project-cursor');
    gsapInstance.set(cursor, { xPercent: -50, yPercent: -50 });
    const moveX = gsapInstance.quickTo(cursor, 'x', { duration: .16, ease: 'power3.out' });
    const moveY = gsapInstance.quickTo(cursor, 'y', { duration: .16, ease: 'power3.out' });

    document.querySelectorAll('[data-magnetic]').forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty('--magnetic-x', `${((event.clientX - rect.left) / rect.width - .5) * 8}px`);
        element.style.setProperty('--magnetic-y', `${((event.clientY - rect.top) / rect.height - .5) * 6}px`);
      });
      element.addEventListener('pointerleave', () => {
        element.style.setProperty('--magnetic-x', '0px');
        element.style.setProperty('--magnetic-y', '0px');
      });
    });

    document.addEventListener('pointermove', (event) => {
      moveX(event.clientX);
      moveY(event.clientY);
      const hoverTarget = event.target.closest('[data-cursor-label]');
      if (hoverTarget) {
        if (cursorLabel) cursorLabel.textContent = hoverTarget.dataset.cursorLabel;
        cursor.classList.add('is-visible');
      } else {
        cursor.classList.remove('is-visible');
      }

      const visual = event.target.closest('.card-visual');
      if (visual) {
        const bounds = visual.getBoundingClientRect();
        visual.style.setProperty('--project-spot-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
        visual.style.setProperty('--project-spot-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
      }
    }, { passive: true });
    document.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'));
    document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
  }

  initSignalNodeInteractions();
  initCapabilityNotes();
  initProjectGalleryKeyboard();

  // --------------------------------------------------------------------------
  // 02. SCROLL PROGRESS BAR
  // --------------------------------------------------------------------------
  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // --------------------------------------------------------------------------
  // 03. LENIS SMOOTH MOMENTUM-BASED INERTIAL SCROLLING LAYER
  // --------------------------------------------------------------------------
  let lenis = null;
  let lenisTicker = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const usesNativeScroll = prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 767px)').matches;

  function initLenis() {
    if (lenis || typeof Lenis === 'undefined' || prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 767px)').matches) {
      return;
    }

    try {
      lenis = new Lenis({
        duration: 0.82,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 1.2
      });

      // Synchronize Lenis scroll with GSAP ScrollTrigger
      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
      }

      if (typeof gsap !== 'undefined') {
        lenisTicker = (time) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(lenisTicker);
        gsap.ticker.lagSmoothing(0);
      }
    } catch (e) {
      console.warn('Lenis initialization deferred or unavailable:', e);
    }
  }

  // --------------------------------------------------------------------------
  // 04. MOBILE MENU TOGGLE & ACCESSIBILITY
  // --------------------------------------------------------------------------
  function toggleMobileMenu(forceState) {
    if (!mobileToggle || !mobileMenu) return;
    const isCurrentlyExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    const nextState = typeof forceState === 'boolean' ? forceState : !isCurrentlyExpanded;

    mobileToggle.setAttribute('aria-expanded', String(nextState));
    mobileMenu.setAttribute('aria-hidden', String(!nextState));
    mobileMenu.inert = !nextState;

    if (nextState) {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    } else {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
      if (mobileMenu.contains(document.activeElement)) mobileToggle.focus({ preventScroll: true });
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileToggle && mobileToggle.getAttribute('aria-expanded') === 'true') {
      toggleMobileMenu(false);
    }
  });

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // --------------------------------------------------------------------------
  // 05. SMOOTH IN-PAGE ANCHOR NAVIGATION (STRICT SINGLE-PAGE + LENIS)
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      // Keep touch and reduced-motion scrolling native, but make the home
      // control return to the document top so the sticky header cannot cover it.
      if (usesNativeScroll && (targetId === '#top' || targetId === '#home')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'auto' });
        history.replaceState(null, '', '#home');
        toggleMobileMenu(false);
        return;
      }
      if (usesNativeScroll) return;

      if (targetId === '#top' || targetId === '#home') {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.1 });
        } else {
          window.scrollTo({ top: 0, behavior: usesNativeScroll ? 'auto' : 'smooth' });
        }
        history.replaceState(null, '', '#home');
        toggleMobileMenu(false);
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = siteHeader ? siteHeader.offsetHeight : 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;

        if (lenis) {
          lenis.scrollTo(targetElement, { offset: -(headerHeight + 10), duration: 1.1 });
        } else {
          window.scrollTo({
            top: targetPosition,
            behavior: usesNativeScroll ? 'auto' : 'smooth'
          });
        }

        history.replaceState(null, '', targetId);
        toggleMobileMenu(false);
      }
    });
  });

  window.addEventListener('hashchange', () => {
    if (!usesNativeScroll) return;
    const target = document.getElementById(window.location.hash.slice(1)) || document.getElementById('home');
    if (!target) return;
    const offset = target.id === 'home' || target.id === 'top' ? 0 : (siteHeader ? siteHeader.offsetHeight + 10 : 80);
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: Math.max(0, targetPosition), behavior: 'auto' });
  });

  // --------------------------------------------------------------------------
  // 06. SCROLLSPY: ACTIVE NAVIGATION HIGHLIGHT
  // --------------------------------------------------------------------------
  const sectionsToObserve = [
    { id: 'home', link: document.querySelector('.desktop-nav a[href="#home"]') },
    { id: 'proof', link: document.querySelector('.desktop-nav a[href="#proof"]') },
    { id: 'work', link: document.querySelector('.desktop-nav a[href="#work"]') },
    { id: 'about', link: document.querySelector('.desktop-nav a[href="#about"]') },
    { id: 'skills', link: document.querySelector('.desktop-nav a[href="#skills"]') },
    { id: 'experience', link: document.querySelector('.desktop-nav a[href="#experience"]') },
    { id: 'contact', link: document.querySelector('.desktop-nav a[href="#contact"]') }
  ];

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 140;

    sectionsToObserve.forEach(({ id, link }) => {
      const sec = document.getElementById(id);
      if (sec && link) {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          desktopNavLinks.forEach((n) => n.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // --------------------------------------------------------------------------
  // 07. GSAP & SCROLLTRIGGER CONTINUOUS CHOREOGRAPHY
  // --------------------------------------------------------------------------
  function initGSAPAnimations() {
    if (prefersReducedMotion) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded. Falling back to native behavior.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    initFinePointerEffects(gsap);

    const heroWords = splitAnimatedWords(document.querySelector('.hero-title'), 'hero-word-mask', 'hero-title-word');
    if (heroWords.length) {
      gsap.fromTo(heroWords, { yPercent: 118, autoAlpha: .2 }, {
        yPercent: 0,
        autoAlpha: 1,
        duration: .76,
        stagger: .035,
        delay: .12,
        ease: 'power4.out',
        clearProps: 'transform,opacity'
      });
    }

    gsap.utils.toArray('.section-main-heading, .closing-pitch').forEach((heading) => {
      const words = splitAnimatedWords(heading, 'animated-word-mask', 'animated-word');
      if (!words.length) return;
      gsap.fromTo(words, { yPercent: 112, autoAlpha: .2 }, {
        yPercent: 0,
        autoAlpha: 1,
        duration: .66,
        stagger: .025,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: heading,
          start: 'top 88%',
          once: true
        }
      });
    });

    const thesisTrack = document.getElementById('thesisRibbonTrack');
    if (thesisTrack) {
      gsap.fromTo(thesisTrack, { xPercent: 0 }, {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: { trigger: '.creative-thesis-ribbon', start: 'top bottom', end: 'bottom top', scrub: .8 }
      });
    }

    // Initialize Lenis momentum scrolling
    initLenis();

    // Respect reduced motion preferences
    if (prefersReducedMotion) {
      return;
    }

    const motionScenes = gsap.matchMedia();

    // 1. Expand the existing signal card into an immersive, pinned handoff.
    const heroLeftCol = document.querySelector('.hero-left-col');
    const signalCard = document.getElementById('marketingSignalCard');
    const heroSection = document.getElementById('home');
    const proofSection = document.getElementById('proof');
    const heroSignalCol = document.getElementById('heroSignalCol');

    if (heroSection && proofSection && signalCard && heroSignalCol) {
      motionScenes.add('(min-width: 1081px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const cardRect = signalCard.getBoundingClientRect();
        const heroRect = heroSection.getBoundingClientRect();
        const startTop = cardRect.top - heroRect.top;
        const startLeft = cardRect.left;
        heroSignalCol.style.minHeight = `${cardRect.height}px`;

        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: '+=72%',
            pin: true,
            pinSpacing: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onLeave: () => gsap.set(signalCard, { autoAlpha: 0 }),
            onEnterBack: () => gsap.set(signalCard, { autoAlpha: 1 })
          }
        });

        heroTl.to(heroLeftCol, { y: -55, opacity: 0, filter: 'blur(5px)', ease: 'none' }, 0);
        heroTl.fromTo(signalCard, {
          immediateRender: false,
          position: 'fixed',
          top: startTop,
          left: startLeft,
          right: 'auto',
          bottom: 'auto',
          width: cardRect.width,
          height: cardRect.height,
          maxWidth: 'none',
          margin: 0,
          borderRadius: 24,
          zIndex: 30
        }, {
          top: '12vh',
          left: '4vw',
          width: '92vw',
          height: '76vh',
          borderRadius: 20,
          boxShadow: '0 32px 100px rgba(13, 27, 46, 0.22)',
          ease: 'none',
          immediateRender: false,
          onUpdate: function () {
            if (this.progress() > 0.3) signalCard.classList.add('signal-immersive');
            else signalCard.classList.remove('signal-immersive');
          }
        }, 0);

        heroTl.to('.signal-wire', { strokeDashoffset: 12, opacity: 0.95, ease: 'none' }, 0.08);
        heroTl.to('#chipFollowers, #chipViews', { scale: 1.08, borderColor: '#315EFB', ease: 'none' }, 0.2);
        heroTl.to('#connectorBeam', { scaleY: 1.8, opacity: 1, ease: 'none' }, 0.1);

        return () => {
          signalCard.classList.remove('signal-immersive');
          heroSignalCol.style.minHeight = '';
          gsap.set(signalCard, { clearProps: 'position,top,left,right,bottom,width,height,maxWidth,margin,borderRadius,zIndex,boxShadow,visibility' });
        };
      });
    }

    // 2. Five project identities become a scroll-scrubbed editorial sequence.
    const projectStage = document.getElementById('projectStoryStage');
    const projectCards = Array.from(document.querySelectorAll('.project-showcase-card'));
    const projectProgress = document.getElementById('projectStoryProgressFill');

    if (projectStage && projectCards.length > 1) {
      motionScenes.add('(min-width: 1081px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        projectStage.classList.add('project-story-active');
        projectCards.forEach((card, index) => {
          gsap.set(card, { autoAlpha: index === 0 ? 1 : 0, x: index === 0 ? 0 : 72, scale: index === 0 ? 1 : 0.97 });
          card.setAttribute('aria-hidden', String(index !== 0));
          card.inert = index !== 0;
        });

        const projectTl = gsap.timeline({
          scrollTrigger: {
            trigger: projectStage,
            start: 'top 96px',
            end: `+=${(projectCards.length - 1) * 55}%`,
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const activeIndex = Math.min(projectCards.length - 1, Math.round(self.progress * (projectCards.length - 1)));
              projectCards.forEach((card, index) => {
                const active = index === activeIndex;
                card.setAttribute('aria-hidden', String(!active));
                card.inert = !active;
              });
            }
          }
        });

        projectCards.forEach((card, index) => {
          if (index === 0) return;
          const previous = projectCards[index - 1];
          const step = index - 1;
          projectTl.to(previous, { autoAlpha: 0, x: -64, scale: 0.97, duration: 0.34, ease: 'none' }, step);
          projectTl.to(card, { autoAlpha: 1, x: 0, scale: 1, duration: 0.42, ease: 'none' }, step + 0.18);
          projectTl.fromTo(card.querySelector('.card-visual'), { scale: 1.08 }, { scale: 1, duration: 0.55, ease: 'none' }, step + 0.18);
        });

        if (projectProgress) {
          projectTl.fromTo(projectProgress, { scaleX: 0 }, { scaleX: 1, duration: projectCards.length - 1, ease: 'none' }, 0);
        }

        return () => {
          projectStage.classList.remove('project-story-active');
          projectCards.forEach((card) => {
            card.removeAttribute('aria-hidden');
            card.inert = false;
            gsap.set(card, { clearProps: 'all' });
            const visual = card.querySelector('.card-visual');
            if (visual) gsap.set(visual, { clearProps: 'transform' });
          });
          if (projectProgress) gsap.set(projectProgress, { clearProps: 'transform' });
        };
      });
    }

    // 3. Draw the conceptual content-discovery illustration (not a time series).
    const curveLine = document.getElementById('growthCurveLine');
    if (curveLine) {
      gsap.fromTo(curveLine, 
        { strokeDasharray: 800, strokeDashoffset: 800 },
        {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#analyticsPanel',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // 4. Keep a few restrained chapter transitions between the two pinned stories.
    const verticalRevealTargets = gsap.utils.toArray([
      '.proof-chapter .section-intro-row', '.work-chapter .section-intro-row',
      '.approach-chapter .section-intro-row', '.capabilities-chapter .section-intro-row',
      '.experience-chapter .section-intro-row', '.closing-chapter .closing-marquee-box'
    ].join(','));

    verticalRevealTargets.forEach((element) => {
      gsap.from(element, {
        y: 30,
        opacity: 0,
        duration: 0.72,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // 5. Carry the hero's geometric signal into the next chapters with a
    // restrained scrub. The content itself remains in normal document flow.
    const heroGeometry = document.querySelector('.hero-geometry-art');
    if (heroGeometry && heroSection) {
      gsap.fromTo(heroGeometry, { y: 0, rotate: 0, scale: 1 }, {
        y: -46,
        rotate: 5,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8
        }
      });
    }



    // Fine-pointer parallax adds a little depth without changing touch behavior.
    if (heroSection && heroGeometry && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      heroSection.addEventListener('pointermove', (event) => {
        const bounds = heroSection.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        gsap.to(heroGeometry, { x: x * 10, y: y * 8, duration: 0.55, overwrite: 'auto', ease: 'power2.out' });
      }, { passive: true });
      heroSection.addEventListener('pointerleave', () => {
        gsap.to(heroGeometry, { x: 0, y: 0, duration: 0.6, overwrite: 'auto', ease: 'power2.out' });
      }, { passive: true });
    }

    // The impact target responds to section progress, while reported figures
    // stay static and factual.
    const impactTarget = document.querySelector('.impact-target-symbol');
    if (impactTarget) {
      gsap.fromTo(impactTarget, { rotate: -28, scale: 0.82, autoAlpha: 0.45 }, {
        rotate: 0,
        scale: 1,
        autoAlpha: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#analyticsPanel',
          start: 'top 82%',
          end: 'top 35%',
          scrub: 0.7
        }
      });
    }

    // Process cards and timeline nodes connect the later chapters without
    // pinning them or adding horizontal travel.
    gsap.utils.toArray('.process-step-card').forEach((card, index) => {
      gsap.from(card, {
        y: 24,
        autoAlpha: 0,
        duration: 0.55,
        delay: (index % 3) * 0.04,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      });
    });
    gsap.utils.toArray('.timeline-entry').forEach((entry) => {
      const marker = entry.querySelector('.node-marker');
      if (!marker) return;
      gsap.fromTo(marker, { scale: 0.65 }, {
        scale: 1,
        duration: 0.45,
        ease: 'back.out(1.8)',
        scrollTrigger: { trigger: entry, start: 'top 86%', toggleActions: 'play none none reverse' }
      });
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    } else {
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    }
  }

  // Initialize animations once DOM is ready
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initGSAPAnimations);
  } else {
    initGSAPAnimations();
  }

  // --------------------------------------------------------------------------
  // 07. PROOF OF IMPACT: INTERACTIVE TAB CONTROLS
  // --------------------------------------------------------------------------
  panelTabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      const selectedView = this.getAttribute('data-view');

      // Update tab buttons
      panelTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      // Update views
      dashboardViews.forEach((view) => {
        if (view.id === `view${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}`) {
          view.classList.add('active');
          view.removeAttribute('hidden');

          // Trigger bar animation if switching to reach view
          if (selectedView === 'reach') {
            const barFills = view.querySelectorAll('.bar-fill');
            barFills.forEach((fill) => {
              const target = fill.style.getPropertyValue('--target-width') || '50%';
              fill.style.width = '0%';
              setTimeout(() => {
                fill.style.width = target;
              }, 40);
            });
          }
        } else {
          view.classList.remove('active');
          view.setAttribute('hidden', '');
        }
      });
    });

    tab.addEventListener('keydown', (event) => {
      const currentIndex = Array.from(panelTabs).indexOf(tab);
      let nextIndex = currentIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % panelTabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + panelTabs.length) % panelTabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = panelTabs.length - 1;
      if (nextIndex !== currentIndex) {
        event.preventDefault();
        panelTabs[nextIndex].focus();
        panelTabs[nextIndex].click();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 08. PROJECT CASE STUDY MODAL DATA & HANDLERS
  // (Strict Single-Page - No routing)
  // --------------------------------------------------------------------------
  const caseStudiesData = {
    resilia: {
      kicker: '01 / END-TO-END BRAND IDENTITY & DIGITAL PLATFORM · 2026',
      title: 'RESILIA — Psychologist Personal Brand & Live Web Platform',
      summary: 'Developed a psychologist’s complete brand identity and digital presence from the ground up, establishing credibility, positioning, and client consultation pathways.',
      challenge: 'Create a distinctive, empathetic, and professional brand identity for a clinical psychologist, establishing trust and facilitating client consultation enquiries.',
      focus: 'End-to-end creative direction, brand architecture, responsive web development, visual identity, and strategic copycraft.',
      work: 'Defined core brand positioning around empathy and resilience. Designed the brand wordmark logo, developed the tagline, and wrote tailored website content aligned with therapy services. Architected, designed, and coded the live responsive website hosted on Netlify.',
      outcome: 'Launched the live responsive website with the brand identity, tagline, service-aligned copy, and digital presence delivered for the project.',
      tools: ['Brand Strategy', 'Logo Design', 'Website Design', 'Web Development', 'Netlify', 'Copywriting'],
      liveUrl: 'https://resilia-the-resilience.netlify.app/'
    },
    instagram: {
      kicker: '02 / PERSONAL INSTAGRAM · 2025',
      title: 'Personal Instagram — 117K Followers & 70M+ Reported Views',
      summary: 'The personal Instagram page reached 117,000 verified followers and reported 70M+ organic views in 2025.',
      challenge: 'Build an audience for a personal Instagram page through organic content and distribution.',
      focus: 'Content strategy, visual hooks, audience retention, and community engagement.',
      work: 'Created and refined short-form content formats, hooks, and pacing, using audience response to guide subsequent content and distribution.',
      outcome: '117,000 verified followers and 70M+ reported organic views on the personal Instagram page in 2025.',
      tools: ['Instagram', 'Content Strategy', 'Short-form Content', 'Organic Distribution'],
      liveUrl: 'https://www.instagram.com/prajwal_says/'
    },
    hbits: {
      kicker: '03 / BRAND MARKETING & SEO INTERNSHIP · MAR 2026 — AUG 2026',
      title: 'hBits Investment Management — Brand & Marketing Internship',
      summary: 'Conducted market and competitor research, supported research-based Reddit and Quora topic work, and maintained an Excel content tracker.',
      challenge: 'Strengthen institutional brand awareness and search discovery within fractional real estate investment and wealth management niches.',
      focus: 'Competitor benchmarking, community SEO discovery, social communication support, and content operations tracking.',
      work: 'Conducted competitor research and supported research-based Reddit and Quora content topics. Assisted with WhatsApp communication and maintained an Excel content tracker.',
      outcome: 'Delivered competitor research, research-based Reddit and Quora topic ideas, WhatsApp communication support, and an Excel content tracker.',
      tools: ['Market Research', 'Reddit SEO', 'Quora SEO', 'WhatsApp Marketing', 'Microsoft Excel Tracker'],
      liveUrl: null
    },
    finverse: {
      kicker: '04 / COMMUNITY LEADERSHIP · JUL 2025 — SEP 2026',
      title: 'Finverse — The Finance Club (Social Media Director)',
      summary: 'Created social media campaigns and finance-education content, and supported event promotion for the student-led club.',
      challenge: 'Transform dense financial market concepts into engaging social media formats that attract university students and workshop participants.',
      focus: 'Campaign strategy, editorial calendar management, event promotion, and cross-functional team coordination.',
      work: 'Devised marketing campaigns for speaker sessions, mock trading games, and financial literacy workshops. Designed educational carousel formats and infographics that broke down complex financial instruments. Managed multi-channel student outreach schedules.',
      outcome: 'Supported brand awareness, audience engagement, and event promotion through campaigns and finance-education content.',
      tools: ['Campaign Direction', 'Event Marketing', 'Content Planning', 'Canva Design', 'Audience Engagement'],
      liveUrl: null
    },
    rojgaar: {
      kicker: '05 / B2B BUSINESS DEVELOPMENT · AUG 2025 — NOV 2025',
      title: 'TheRojgaar.com — Business Development Internship',
      summary: 'Supported commercial growth for an employment platform through market research, competitive benchmarking, employer outreach, and lead pipeline tracking.',
      challenge: 'Map competitive employment platforms and establish direct engagement pipelines with potential corporate hiring partners.',
      focus: 'Market intelligence, B2B stakeholder outreach, relationship building, and CRM lead tracking.',
      work: 'Researched competing recruitment platforms and potential employers. Supported stakeholder outreach, lead tracking, relationship management, and partnership research.',
      outcome: 'Supported employer outreach, lead tracking, relationship management, and partnership research.',
      tools: ['B2B Outreach', 'Competitor Research', 'Lead Pipeline Tracking', 'Market Analysis'],
      liveUrl: null
    }
  };

  function openModal(projectKey) {
    const data = caseStudiesData[projectKey];
    if (!data) return;

    lastActiveElement = document.activeElement;

    modalKicker.textContent = data.kicker;
    modalTitle.textContent = data.title;
    modalSummary.textContent = data.summary;
    modalChallenge.textContent = data.challenge;
    modalFocus.textContent = data.focus;
    modalWork.textContent = data.work;
    modalOutcome.textContent = data.outcome;

    // Render tools tags
    modalTools.innerHTML = '';
    data.tools.forEach((tool) => {
      const tag = document.createElement('span');
      tag.textContent = tool;
      modalTools.appendChild(tag);
    });

    // Optional live site button
    if (data.liveUrl) {
      modalLiveLink.setAttribute('href', data.liveUrl);
      const modalLinkLabel = modalLiveLink.querySelector('span');
      if (modalLinkLabel) {
        modalLinkLabel.textContent = projectKey === 'instagram' ? 'View Instagram Profile' : 'Visit Live Website';
      }
      modalExternalWrap.style.display = 'block';
    } else {
      modalExternalWrap.style.display = 'none';
    }

    modal.classList.add('open');
    modal.inert = false;
    backdrop.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();

    // Focus close button for accessibility
    setTimeout(() => {
      if (modalClose) modalClose.focus();
    }, 80);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.inert = true;
    backdrop.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenis) lenis.start();

    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  }

  // The explicit button opens each case study; external card links remain independent.
  document.querySelectorAll('.inline-details-btn[data-project]').forEach((button) => {
    button.addEventListener('click', () => openModal(button.dataset.project));
  });

  document.querySelectorAll('.card-visual[data-project]').forEach((visual) => {
    visual.addEventListener('click', () => openModal(visual.dataset.project));
    visual.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(visual.dataset.project);
      }
    });
  });

  if (mobileMenu) mobileMenu.inert = true;

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') {
      const focusable = Array.from(modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        .filter((element) => !element.hidden && !element.inert && element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  if (modal) modal.inert = true;

})();
