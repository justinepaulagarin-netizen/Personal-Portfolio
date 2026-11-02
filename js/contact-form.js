/* =========================================================
   js/contact-form.js  –  CONTACT PAGE ONLY
   CONNECT THE FORM LATER:
   1. Set the form's action="..." in contact.html (for example, a Formspree URL).
   2. DELETE the whole "form.addEventListener" block below so the form really submits.
   Until then, this only shows a friendly demo message and sends nothing.
   ========================================================= */
(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "Thanks! This is a template – connect the form to send real messages.";
    form.reset();
  });
})();
