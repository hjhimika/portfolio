/* Humayra Jahan — Portfolio interactions */
(function () {
  'use strict';

  /* ---- Sticky nav state + active link ---- */
  var nav = document.querySelector('.nav');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
    var y = window.scrollY + 110;
    var current = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= y) current = sections[i];
    }
    navLinks.forEach(function (a) {
      a.classList.toggle('active', current && a.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var menuBtn = document.querySelector('.menu-btn');
  var linksWrap = document.querySelector('.nav-links');
  if (menuBtn && linksWrap) {
    menuBtn.addEventListener('click', function () {
      linksWrap.classList.toggle('open');
    });
    linksWrap.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') linksWrap.classList.remove('open');
    });
  }

  /* ---- Reveal on scroll (rAF-throttled, IO-free for reliability) ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function show(el) {
    if (el.classList.contains('in')) return;
    el.classList.add('in');
    if (el.hasAttribute('data-count')) animateCounters(el);
    if (el.hasAttribute('data-bars')) animateBars(el);
  }
  function revealCheck() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = 0; i < reveals.length; i++) {
      var el = reveals[i];
      if (el.classList.contains('in')) continue;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) show(el);
    }
  }
  var ticking = false;
  function onRevealScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { revealCheck(); ticking = false; });
  }
  window.addEventListener('scroll', onRevealScroll, { passive: true });
  window.addEventListener('resize', onRevealScroll);
  revealCheck();
  setTimeout(revealCheck, 150);
  // Safety net: never leave content hidden.
  setTimeout(function () { reveals.forEach(show); }, 1500);

  /* ---- Animated counters ---- */
  function animateCounters(scope) {
    var nums = scope.querySelectorAll('[data-target]');
    nums.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-target'));
      var dec = (el.getAttribute('data-dec') === '1');
      var finalTxt = dec ? target.toFixed(1) : Math.round(target).toString();
      el.textContent = finalTxt; // fallback: show final value immediately
      var dur = 1100, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = target * eased;
        el.textContent = dec ? val.toFixed(1) : Math.round(val).toString();
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = finalTxt;
      }
      requestAnimationFrame(step);
    });
  }

  /* ---- Animated progress bars (competitive) ---- */
  function animateBars(scope) {
    scope.querySelectorAll('.jbar i').forEach(function (bar) {
      bar.style.width = (bar.getAttribute('data-w') || '0') + '%';
    });
  }

  /* ---- Year in footer ---- */
  var y = document.getElementById('yr');
  if (y) y.textContent = new Date().getFullYear();
})();