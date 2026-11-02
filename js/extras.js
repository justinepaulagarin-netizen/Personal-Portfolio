/* =========================================================
   js/extras.js  –  EXTRA EFFECTS (all pages)
   - Scroll progress bar at the top
   - Back-to-top button
   - Cursor glow + card spotlight (mouse devices only, not phones)
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Scroll progress + back-to-top ---------- */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  var toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.textContent = "↑";
  document.body.appendChild(toTop);

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  var ticking = false;
  function updateScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progress.style.transform = "scaleX(" + ratio + ")";
    toTop.classList.toggle("show", window.scrollY > 600);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener("resize", updateScroll);
  updateScroll();

  /* ---------- Cursor glow + card spotlight ---------- */
  if (canHover && !reduceMotion) {
    var glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    var gx = 0, gy = 0, raf = null;
    window.addEventListener("mousemove", function (e) {
      gx = e.clientX; gy = e.clientY;
      glow.classList.add("on");
      if (!raf) {
        raf = window.requestAnimationFrame(function () {
          glow.style.transform = "translate(" + gx + "px," + gy + "px)";
          raf = null;
        });
      }
    }, { passive: true });
    document.addEventListener("mouseleave", function () { glow.classList.remove("on"); });

    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }
})();
