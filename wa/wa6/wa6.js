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
    if (!navMenu.contains(e.target) && navMenu.classList.contains('show')) {
      navMenu.classList.remove('show');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
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

  screenings.forEach(item => {
    item.addEventListener('click', () => {
      screenings.forEach(li => li.style.backgroundColor = '#ffe0e0');
      item.style.backgroundColor = '#ffb3b3';
      feedback.textContent = `You selected: ${item.textContent}`;
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
});