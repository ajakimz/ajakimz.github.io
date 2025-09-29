document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('main-menu');

  function toggleMenu() {
    const isShown = navMenu.classList.toggle('show');
    navToggle.classList.toggle('open', isShown);
    navToggle.setAttribute('aria-expanded', isShown ? 'true' : 'false');
  }

  navToggle.addEventListener('click', toggleMenu);
  navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') toggleMenu();
  });

  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      if (navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  const filterSelect = document.getElementById('genre-filter');
  const movieCards = document.querySelectorAll('.movie-card');

  filterSelect.addEventListener('change', (e) => {
    const genre = e.target.value;
    movieCards.forEach(card => {
      if (genre === 'all' || card.dataset.genre === genre) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });

  const screenings = document.querySelectorAll('.screenings li');
  const feedback = document.getElementById('screening-feedback');
  let selected = null;

  screenings.forEach(item => {
    item.addEventListener('click', () => {
      if (selected === item) {
        item.classList.remove('selected');
        selected = null;
        feedback.textContent = '';
      } else {
        screenings.forEach(li => li.classList.remove('selected'));
        item.classList.add('selected');
        selected = item;
        feedback.textContent = `You selected: ${item.textContent}`;
      }
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
});