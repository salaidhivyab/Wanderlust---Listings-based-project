// Example starter JavaScript for disabling form submissions if there are invalid fields
console.log("✅ script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        // Form is valid -> let it submit normally
        console.log("✅ Form passed Bootstrap validation, submitting...");
      }
      form.classList.add('was-validated');
    }, false);
  });
});
