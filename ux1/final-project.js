/* script.js
   Smooth scrolling for top nav, reveal-on-scroll for sections.
*/

document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          // Account for fixed header height
          const headerOffset = document.querySelector('.site-header').offsetHeight + 8;
          const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }
    });
  });

  // IntersectionObserver to reveal sections
  const sections = document.querySelectorAll('.section');
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.12 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  sections.forEach(s => observer.observe(s));

  // Progressive enhancement: make prototype link open in new tab (if provided)
  const proto = document.getElementById('prototype-link');
  if (proto && proto.href && proto.href !== '#') {
    proto.setAttribute('target', '_blank');
    proto.setAttribute('rel', 'noopener noreferrer');
  }
});