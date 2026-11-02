/* =========================================================
   js/theme-init.js  –  RUNS FIRST (in <head>)
   1. Sets the saved/OS theme before the page paints (no flash)
   2. Tells the CSS that JavaScript is available
   3. Turns on the opening-animation cover (see css/intro.css, js/intro.js)
   ========================================================= */
(function () {
  var root = document.documentElement;
  root.classList.add("js");

  try {
    var saved = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));
  } catch (e) {
    root.setAttribute("data-theme", "dark");
  }

  /* Opening animation: show the black cover right away (skipped if the visitor prefers less motion) */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("intro-active", "intro-lock");

    /* Safety net: if something goes wrong, never leave the visitor stuck on the black screen */
    window.setTimeout(function () {
      root.classList.remove("intro-active", "intro-lock");
      var stuck = document.getElementById("intro");
      if (stuck && stuck.parentNode) { stuck.parentNode.removeChild(stuck); }
    }, 12000);
  }
})();