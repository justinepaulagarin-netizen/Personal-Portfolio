/* =========================================================
   js/social-links.js  –  CONTACT PAGE ONLY
   Auto-fix for social links: if you type a link WITHOUT "https://"
   (for example "github.com/yourname"), the browser treats it as a file in
   your folder and the click goes nowhere. This adds "https://" for you.
   ========================================================= */
(function () {
  "use strict";

  document.querySelectorAll(".social").forEach(function (link) {
    var href = (link.getAttribute("href") || "").trim();
    if (href && !/^(https?:|mailto:|tel:|#|\/)/i.test(href)) {
      link.setAttribute("href", "https://" + href);
    }
  });
})();
