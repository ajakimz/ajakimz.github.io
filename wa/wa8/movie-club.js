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

  if (filterSelect && movieCards.length > 0) {
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
  }

  const screenings = document.querySelectorAll('.screenings li');
  const feedback = document.getElementById('screening-feedback');
  let selected = null;

  if (screenings.length > 0) {
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
  }
});

// Save user's theme choice
function setTheme(theme) {
    localStorage.setItem('userTheme', theme);
    document.body.className = theme;
}

// Load saved theme on page load
window.addEventListener('load', function() {
    const savedTheme = localStorage.getItem('userTheme') || 'light';
    document.body.className = savedTheme;
});

document.addEventListener('DOMContentLoaded', () => {
  const privacyPopup = document.getElementById('privacy-popup');
  const continuePrivacy = document.getElementById('continue-privacy');
  const clearData = document.getElementById('clear-data');

  if (localStorage.getItem('privacyAccepted') === 'true' &&
      localStorage.getItem('dataCleared') === 'true') {
      // Do not reload any saved data
      document.body.className = 'light';
  } else {
    // Load theme, filter, etc.
  }

  continuePrivacy.addEventListener('click', () => {
    privacyPopup.style.display = 'none';
    localStorage.setItem('privacyAccepted', 'true');
  });

  clearData.addEventListener('click', () => {
    const confirmClear = confirm(
      "Are you sure you want to clear your saved data (themes, filters, etc.)?\nThis will reset your site preferences."
    );

    if (confirmClear) {
        localStorage.clear();
        localStorage.setItem('privacyAccepted', 'true');
        localStorage.setItem('dataCleared', 'true'); // Track that user wants data cleared
        document.body.className = 'light';
        alert('Your data has been cleared.');
    }
});

const filterSelect = document.getElementById('genre-filter');
const movieCards = document.querySelectorAll('.movie-card');

if (filterSelect && movieCards.length > 0) {
    // Load saved filter
    const savedFilter = localStorage.getItem('genreFilter');
    if (savedFilter) filterSelect.value = savedFilter;

    movieCards.forEach(card => {
        if (savedFilter && savedFilter !== 'all' && card.dataset.genre !== savedFilter) {
            card.style.display = 'none';
        }
    });

    // Save filter on change
    filterSelect.addEventListener('change', (e) => {
        const genre = e.target.value;
        localStorage.setItem('genreFilter', genre);

        movieCards.forEach(card => {
            if (genre === 'all' || card.dataset.genre === genre) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Persist selected screening
const screenings = document.querySelectorAll('.screenings li');
const feedback = document.getElementById('screening-feedback');
let selected = null;

if (screenings.length > 0) {
    const savedScreening = localStorage.getItem('selectedScreening');

    screenings.forEach(item => {
        // Restore selection
        if (savedScreening && savedScreening === item.textContent) {
            item.classList.add('selected');
            selected = item;
            feedback.textContent = `You selected: ${item.textContent}`;
        }

        // Save selection on click
        item.addEventListener('click', () => {
            if (selected === item) {
                item.classList.remove('selected');
                selected = null;
                feedback.textContent = '';
                localStorage.removeItem('selectedScreening');
            } else {
                screenings.forEach(li => li.classList.remove('selected'));
                item.classList.add('selected');
                selected = item;
                feedback.textContent = `You selected: ${item.textContent}`;
                localStorage.setItem('selectedScreening', item.textContent);
            }
        });

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });
}
});

const expandBtn = document.querySelector('.expand-btn');
        const details = document.querySelector('.details-hidden');
        let info = false;

        expandBtn.addEventListener('click', showInfo);

        function showInfo() {
            // console.log("hi");
            // alert("this is an alert");
            if (info == false) {
                details.style.display = "flex";
                expandBtn.textContent = "-";
                expandBtn.setAttribute("aria-label", "Collapse card");
                info = true;
            }
            else {
                details.style.display = "none";
                expandBtn.textContent = "+";
                expandBtn.setAttribute("aria-label", "Expand card");
                info = false;
            }
        }