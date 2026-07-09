document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // contact form handler - submits to Formspree without leaving the page
  var form = document.querySelector('#enquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.querySelector('#form-status');
      var submitBtn = form.querySelector('button[type="submit"]');
      var formData = new FormData(form);

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          if (status) {
            status.textContent = "Thanks, your enquiry has been sent. We'll get back to you shortly.";
            status.style.display = 'block';
            status.style.color = 'var(--rust)';
          }
          form.reset();
        } else {
          throw new Error('Form submission failed');
        }
      }).catch(function () {
        if (status) {
          status.textContent = "Something went wrong sending that. Please email us directly at info@civicbuildco.com.au instead.";
          status.style.display = 'block';
          status.style.color = '#C0392B';
        }
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send enquiry'; }
      });
    });
  }

  // scroll-triggered reveal for sections/cards as they enter the viewport
  var revealTargets = document.querySelectorAll(
    '.grid > *, .section-head, .cta-band .wrap, .info-block'
  );
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 3, 2) * 0.08) + 's';
      revealObserver.observe(el);
    });
  } else {
    // no IntersectionObserver support — just show everything
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // count-up animation for stat numbers, triggered once when visible
  var statEls = document.querySelectorAll('.stat-number[data-count-to]');
  if (statEls.length && 'IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1200;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        statObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    statEls.forEach(function (el) { statObserver.observe(el); });
  }

  // sticky header shadow once the page is scrolled
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // project filter tabs
  var filterTabs = document.querySelectorAll('.filter-tab');
  var projectCards = document.querySelectorAll('.project-card');
  if (filterTabs.length && projectCards.length) {
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filterTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var filter = tab.getAttribute('data-filter');
        projectCards.forEach(function (card) {
          var match = filter === 'all' || card.getAttribute('data-category') === filter;
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }
});

