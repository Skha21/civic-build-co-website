document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // simple contact form handler (no backend yet — shows a confirmation state)
  var form = document.querySelector('#enquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.querySelector('#form-status');
      if (status) {
        status.textContent = 'Thanks — your enquiry has been noted. This form is a placeholder until it is connected to a real inbox (see setup notes provided separately).';
        status.style.display = 'block';
      }
      form.reset();
    });
  }
});
