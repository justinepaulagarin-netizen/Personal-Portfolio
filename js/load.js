/* =========================================================
   js/load.js  –  PUTS THE SEPARATE FILES TOGETHER
   1. Loads every <div data-include="sections/xxx.html"> into index.html,
      so the site runs as ONE page you can scroll from top to bottom.
   2. Then starts the rest of the scripts (menu, animations, form, ...).

   NOTE: this needs the site to run from a server, so open it with
   "Live Server" in VS Code (or upload it to GitHub Pages / Netlify).
   Double-clicking index.html from your folder will NOT work in most browsers.
   ========================================================= */
(function () {
  "use strict";

  /* Scripts to start AFTER the sections are loaded (they run in this order).
     To add a new script, add its path here. */
  var SCRIPTS = [
    "js/intro.js",          // opening animation (delete this line to turn it off)
    "js/navbar.js",
    "js/reveal.js",
    "js/extras.js",
    "js/contact-form.js",
    "js/social-links.js"
  ];

  function showError() {
    document.documentElement.classList.remove("intro-active", "intro-lock");   // don't stay on the black cover
    var main = document.getElementById("main");
    main.innerHTML =
      '<div style="min-height:100vh;display:grid;place-items:center;padding:2rem;text-align:center">' +
      '<div style="max-width:520px"><h1 style="font-size:1.6rem;margin-bottom:.75rem">Almost there!</h1>' +
      '<p style="color:var(--text-muted)">The page could not load its sections. ' +
      'Open this folder in VS Code and click <strong>Go Live</strong> (Live Server), ' +
      'or upload the site to GitHub Pages / Netlify. ' +
      'Also check that the <code>sections</code> folder is next to <code>index.html</code>.</p></div></div>';
  }

  function loadScripts(index, done) {
    if (index >= SCRIPTS.length) { done(); return; }
    var s = document.createElement("script");
    s.src = SCRIPTS[index];
    s.onload = function () { loadScripts(index + 1, done); };
    s.onerror = function () { loadScripts(index + 1, done); };   // skip a missing script, keep going
    document.body.appendChild(s);
  }

  var slots = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));

  Promise.all(slots.map(function (slot) {
    return fetch(slot.getAttribute("data-include")).then(function (res) {
      if (!res.ok) { throw new Error(res.status + " " + res.url); }
      return res.text();
    });
  })).then(function (texts) {
    // Swap each placeholder <div> for the real section
    slots.forEach(function (slot, i) { slot.outerHTML = texts[i]; });

    loadScripts(0, function () {
      // If the address has #about, #contact, ... jump to that section
      if (location.hash) {
        var target = document.querySelector(location.hash);
        if (target) { target.scrollIntoView(); }
      }
    });
  }).catch(showError);
})();