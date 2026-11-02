/* =========================================================
   js/intro.js  –  OPENING ANIMATION
   Timeline (about 4 seconds):
     1. Letters of your name rise up one by one
     2. Role text "decodes" from random characters
     3. Counter climbs 000 -> 100 while the line fills
     4. Content fades, the black curtain splits open
     5. Your Home section animates in
   Edit the settings just below. The words come from sections/intro.html.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- SETTINGS (change these) ---------- */
  var COUNT_MS = 2400;      // how long the 0 -> 100 counter takes (milliseconds)
  var PLAY_ONCE = false;    // true = only play once per browser tab (not on every refresh)

  var root = document.documentElement;
  var intro = document.getElementById("intro");

  function endAll() {
    root.classList.remove("intro-active", "intro-lock");
    if (intro && intro.parentNode) { intro.parentNode.removeChild(intro); }
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seen = false;
  try { seen = PLAY_ONCE && sessionStorage.getItem("introSeen") === "1"; } catch (e) { /* ignore */ }

  if (!intro || reduceMotion || seen) { endAll(); return; }
  try { if (PLAY_ONCE) { sessionStorage.setItem("introSeen", "1"); } } catch (e) { /* ignore */ }

  if (!location.hash) { window.scrollTo(0, 0); }

  var name = intro.getAttribute("data-name") || "";
  var role = intro.getAttribute("data-role") || "";
  var nameEl = document.getElementById("intro-name");
  var roleEl = document.getElementById("intro-role");
  var countEl = document.getElementById("intro-count");
  var lineFill = document.getElementById("intro-line-fill");
  var skipBtn = document.getElementById("intro-skip");

  /* ---------- Build the letters of the name ---------- */
  nameEl.setAttribute("aria-label", name);
  var index = 0;
  name.split(" ").forEach(function (word) {
    var w = document.createElement("span");
    w.className = "intro-word";
    word.split("").forEach(function (ch) {
      var mask = document.createElement("span");
      mask.className = "intro-ch";
      var inner = document.createElement("span");
      inner.textContent = ch;
      inner.style.setProperty("--i", index++);
      mask.appendChild(inner);
      w.appendChild(mask);
    });
    nameEl.appendChild(w);
  });

  /* ---------- Role text: random characters that settle into the real text ---------- */
  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$";
  function scramble(el, text, duration) {
    var start = null;
    function frame(t) {
      if (start === null) { start = t; }
      var progress = Math.min((t - start) / duration, 1);
      var settled = Math.floor(progress * text.length);
      var out = "";
      for (var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        if (i < settled || c === " " || c === "|" || c === "[" || c === "]") { out += c; }
        else { out += GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)); }
      }
      el.textContent = out;
      if (progress < 1) { window.requestAnimationFrame(frame); }
    }
    window.requestAnimationFrame(frame);
  }

  /* ---------- Counter + line ---------- */
  function pad(n) { return ("000" + n).slice(-3); }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  var finished = false;
  var timers = [];
  function later(fn, ms) { timers.push(window.setTimeout(fn, ms)); }

  function setProgress(p) {
    countEl.textContent = pad(Math.round(p * 100));
    lineFill.parentNode.style.setProperty("--p", p);
    lineFill.style.setProperty("--p", p);
  }

  function runCounter(onDone) {
    var start = null;
    function frame(t) {
      if (finished) { return; }
      if (start === null) { start = t; }
      var p = Math.min((t - start) / COUNT_MS, 1);
      setProgress(ease(p));
      if (p < 1) { window.requestAnimationFrame(frame); } else { onDone(); }
    }
    window.requestAnimationFrame(frame);
  }

  /* ---------- Ending: fade content -> open curtain -> remove intro ---------- */
  function open() {
    intro.classList.add("open");
    root.classList.remove("intro-active");   // lets the Home section animate in as the curtain lifts
    later(function () { endAll(); }, 1150);
  }

  function finish(fast) {
    if (finished) { return; }
    finished = true;
    timers.forEach(window.clearTimeout);
    setProgress(1);
    intro.classList.add("done");
    later(open, fast ? 250 : 450);
  }

  /* ---------- Start ---------- */
  skipBtn.addEventListener("click", function () { finish(true); });

  window.requestAnimationFrame(function () {
    intro.classList.add("go");
    later(function () { scramble(roleEl, role, 1100); }, 650);
    later(function () {
      runCounter(function () { later(function () { finish(false); }, 250); });
    }, 300);
  });
})();