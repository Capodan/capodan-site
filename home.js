/* Capodan homepage motion. No libraries.
   Works with home.css. Does nothing extra for visitors who ask for reduced motion. */
(function () {
  "use strict";

  window.__capoHome = true;
  var root = document.documentElement;
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  function $(id) { return document.getElementById(id); }

  function nextFrame(fn) {
    window.requestAnimationFrame(function () { window.requestAnimationFrame(fn); });
  }

  /* ---------- 4. Nav turns solid once you scroll ---------- */
  var nav = $("site-nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 12); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 4. Headline colours separate ---------- */
  nextFrame(function () { document.body.classList.add("is-ready"); });

  /* ---------- 2. Count-up numbers ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (isNaN(target)) return;
    if (still) { el.textContent = target.toFixed(decimals); return; }
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (t < 1) window.requestAnimationFrame(step);
    }
    el.textContent = (0).toFixed(decimals);
    window.requestAnimationFrame(step);
  }

  /* ---------- 2 and 3. Reveal on scroll ---------- */
  function reveal(el) {
    el.classList.add("is-in");
    var counters = el.closest(".h-card") ? el.closest(".h-card").querySelectorAll("[data-count]") : [];
    Array.prototype.forEach.call(counters, countUp);
  }

  var watched = Array.prototype.slice.call(document.querySelectorAll(".h-findings .h-grow"));
  var steps = $("steps");
  if (steps) watched.push(steps);

  if (still || !hasIO) {
    watched.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -15% 0px", threshold: 0.2 });
    Array.prototype.forEach.call(document.querySelectorAll(".h-findings [data-count]"), function (el) {
      el.textContent = (0).toFixed(parseInt(el.getAttribute("data-decimals") || "0", 10));
    });
    watched.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 1. Hero specimen cycles through real comparisons ---------- */
  var slides = [
    {
      source: "PUBLIC FAMILY DISCUSSION",
      pillA: "Families choosing a community",
      pillB: "Families already living in one",
      left: "many other random and monthly",
      key: "charges",
      right: "that were not mentioned",
      labelA: "Choosing",
      labelB: "Living in one",
      wB: "26%",
      line: "Families choosing a senior living community ask questions <span class=\"h-a\">3.85 times</span> more often than families already living in one.",
      aria: "Example finding: families choosing a senior living community ask questions 3.85 times more often than families already living in one."
    },
    {
      source: "PUBLIC OWNER DISCUSSION",
      pillA: "Jaguar owners",
      pillB: "Land Rover, Audi and Infiniti owners",
      left: "a brilliant modern sport saloon with nothing",
      key: "old man",
      right: "about it at all",
      labelA: "Jaguar owners",
      labelB: "The other owners",
      wB: "5.8%",
      line: "Jaguar owners talk about how the car makes them look <span class=\"h-a\">17.3 times</span> more often than the other owners.",
      aria: "Example finding: Jaguar owners talk about how the car makes them look 17.3 times more often than Land Rover, Audi and Infiniti owners."
    }
  ];

  var spec = $("specimen");
  var body = $("spec-body");
  var bars = $("spec-bars");
  var dots = $("spec-dots");
  if (!spec || !body || !bars) return;

  var current = 0;
  var timer = null;
  var paused = false;
  var INTERVAL = 7000;

  function fill(i) {
    var s = slides[i];
    $("spec-source").textContent = s.source;
    $("spec-pill-a").textContent = s.pillA;
    $("spec-pill-b").textContent = s.pillB;
    $("spec-left").textContent = s.left;
    $("spec-key").textContent = s.key;
    $("spec-right").textContent = s.right;
    $("spec-label-a").textContent = s.labelA;
    $("spec-label-b").textContent = s.labelB;
    $("spec-bar-b").style.setProperty("--w", s.wB);
    $("spec-line").innerHTML = s.line;
    spec.setAttribute("aria-label", s.aria);
    if (dots) {
      Array.prototype.forEach.call(dots.querySelectorAll("button"), function (b) {
        var on = parseInt(b.getAttribute("data-slide"), 10) === i;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
  }

  function show(i) {
    if (i === current) return;
    body.classList.add("is-out");
    bars.classList.remove("is-in");
    window.setTimeout(function () {
      current = i;
      fill(i);
      nextFrame(function () {
        body.classList.remove("is-out");
        bars.classList.add("is-in");
      });
    }, 380);
  }

  function schedule() {
    window.clearTimeout(timer);
    if (still || paused || document.hidden) return;
    timer = window.setTimeout(function () {
      show((current + 1) % slides.length);
      schedule();
    }, INTERVAL);
  }

  if (still) {
    bars.classList.add("is-in");
    return;
  }

  /* first entrance: bars grow in after the headline settles */
  window.setTimeout(function () { bars.classList.add("is-in"); }, 500);

  if (dots) {
    dots.hidden = false;
    dots.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-slide]");
      if (!b) return;
      show(parseInt(b.getAttribute("data-slide"), 10));
      schedule();
    });
  }

  spec.addEventListener("mouseenter", function () { paused = true; window.clearTimeout(timer); });
  spec.addEventListener("mouseleave", function () { paused = false; schedule(); });
  spec.addEventListener("focusin", function () { paused = true; window.clearTimeout(timer); });
  spec.addEventListener("focusout", function () { paused = false; schedule(); });
  document.addEventListener("visibilitychange", schedule);

  fill(0);
  schedule();
})();
