/* =========================================================
   js/navbar.js  –  NAVIGATION
   1. Mobile menu toggle
   2. Light / dark theme toggle
   3. Navbar shadow when scrolling
   4. Highlights the nav link of the section you are viewing
   Smooth scrolling itself is done by CSS (scroll-behavior: smooth in base.css).
   ========================================================= */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var menuToggle = document.getElementById("menu-toggle");
  var navMenu = document.getElementById("nav-menu");
  var navLinks = navMenu.querySelectorAll("a");
  var themeToggle = document.getElementById("theme-toggle");
  var themeIcon = document.getElementById("theme-icon");

  /* ---------- 1. MOBILE MENU ---------- */
  function setMenu(open) {
    navMenu.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  menuToggle.addEventListener("click", function () {
    setMenu(!navMenu.classList.contains("open"));
  });

  // Close the menu after choosing a link
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });

  // Close the menu with the Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  /* ---------- 2. THEME TOGGLE ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var isDark = theme === "dark";
    themeIcon.textContent = isDark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  applyTheme(document.documentElement.getAttribute("data-theme") || "dark");

  themeToggle.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable – ignore */ }
  });

  /* ---------- 3. NAVBAR SHADOW ---------- */
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 4. ACTIVE LINK WHILE SCROLLING ---------- */
  var sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var isCurrent = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("active", isCurrent);
          if (isCurrent) { link.setAttribute("aria-current", "true"); }
          else { link.removeAttribute("aria-current"); }
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (section) { spy.observe(section); });
  }
})();
