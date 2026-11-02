/* =========================================================
   js/reveal.js  –  SCROLL REVEAL (all pages)
   Elements with class="reveal" fade/slide in when scrolled into view.
   Cards appear one after another. Skill bars (About page) fill up.
   ========================================================= */
(function () {
  "use strict";

  var revealItems = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Stagger: items inside a grid / tag list / skill list get a small delay each */
  document.querySelectorAll(".grid, .tag-list, .skill-list").forEach(function (group) {
    group.querySelectorAll(":scope > .reveal, :scope > li").forEach(function (item, i) {
      item.style.setProperty("--d", (i % 4) * 110 + "ms");
    });
  });

  /* After an element finishes appearing, remove its delay so hover feels instant */
  revealItems.forEach(function (el) {
    var done = function (e) {
      if (e.propertyName === "opacity" && el.classList.contains("visible")) {
        el.classList.add("settled");
        el.removeEventListener("transitionend", done);
      }
    };
    el.addEventListener("transitionend", done);
  });

  function fillBars(root) {
    root.querySelectorAll(".bar-fill").forEach(function (bar) {
      bar.style.width = bar.dataset.level + "%";
    });
  }

  if ("IntersectionObserver" in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fillBars(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    // Fallback: show everything immediately
    revealItems.forEach(function (item) { item.classList.add("visible"); });
    fillBars(document);
  }
})();
