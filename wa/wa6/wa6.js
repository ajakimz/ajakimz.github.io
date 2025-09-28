document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.main-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('main-menu');

  if (!navToggle || !navMenu) return; // defensive

  function toggleMenu() {
    const isShown = navMenu.classList.toggle('show');
    navToggle.classList.toggle('open', isShown);
    navToggle.setAttribute('aria-expanded', isShown ? 'true' : 'false');

    if (isShown) {
      const firstLink = navMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    } else {
      navToggle.focus();
    }
  }

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      toggleMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('show')) {
      navMenu.classList.remove('show');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navMenu.classList.contains('show')) {
      navMenu.classList.remove('show');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  navMenu.addEventListener('click', (e) => {
    const clickedLink = e.target.closest('a');
    if (clickedLink && navMenu.classList.contains('show')) {
      navMenu.classList.remove('show');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});