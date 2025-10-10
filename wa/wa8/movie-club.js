// ==============================
// NAVIGATION MENU TOGGLE
// ==============================
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
});

// ==============================
// THEME MANAGEMENT
// ==============================
function setTheme(theme) {
  localStorage.setItem('userTheme', theme);
  document.body.className = theme;
}

window.addEventListener('load', function() {
  const savedTheme = localStorage.getItem('userTheme') || 'light';
  document.body.className = savedTheme;
});

// ==============================
// PRIVACY POPUP CONTROLS
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  const privacyPopup = document.getElementById('privacy-popup');
  const continuePrivacy = document.getElementById('continue-privacy');
  const clearData = document.getElementById('clear-data');

  // Handle privacy popup buttons
  if (privacyPopup) {
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
        localStorage.setItem('dataCleared', 'true');
        document.body.className = 'light';
        alert('Your data has been cleared.');
      }
    });
  }
});

// ==============================
// GENRE FILTER FOR FEATURED MOVIES
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  const filterSelect = document.getElementById('genre-filter');
  const movieItems = document.querySelectorAll('.movie-item');

  if (filterSelect && movieItems.length > 0) {
    // Load saved filter from localStorage
    const savedFilter = localStorage.getItem('genreFilter');
    if (savedFilter) filterSelect.value = savedFilter;

    // Apply saved filter on load
    movieItems.forEach(item => {
      if (savedFilter && savedFilter !== 'all' && item.dataset.genre !== savedFilter) {
        item.style.display = 'none';
      }
    });

    // Apply and save filter on change
    filterSelect.addEventListener('change', (e) => {
      const genre = e.target.value;
      localStorage.setItem('genreFilter', genre);

      movieItems.forEach(item => {
        if (genre === 'all' || item.dataset.genre === genre) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
});

// ==============================
// SCREENING SELECTION (UPCOMING PAGE)
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  const screenings = document.querySelectorAll('.screenings li');
  const feedback = document.getElementById('screening-feedback');
  let selected = null;

  if (screenings.length > 0) {
    const savedScreening = localStorage.getItem('selectedScreening');

    // Restore saved selection
    screenings.forEach(item => {
      if (savedScreening && savedScreening === item.textContent) {
        item.classList.add('selected');
        selected = item;
        if (feedback) feedback.textContent = `You selected: ${item.textContent}`;
      }

      // Save new selection on click
      item.addEventListener('click', () => {
        if (selected === item) {
          item.classList.remove('selected');
          selected = null;
          if (feedback) feedback.textContent = '';
          localStorage.removeItem('selectedScreening');
        } else {
          screenings.forEach(li => li.classList.remove('selected'));
          item.classList.add('selected');
          selected = item;
          if (feedback) feedback.textContent = `You selected: ${item.textContent}`;
          localStorage.setItem('selectedScreening', item.textContent);
        }
      });

      // Keyboard accessibility
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
  }
});

// RSVP Buttons
document.addEventListener('DOMContentLoaded', () => {
  const rsvpButtons = document.querySelectorAll('.rsvp-btn');
  const feedback = document.getElementById('screening-feedback');

  rsvpButtons.forEach(button => {
    button.addEventListener('click', () => {
      const movieRow = button.closest('tr');
      const movieName = movieRow.querySelector('td:nth-child(2)').textContent;

      if (movieRow.classList.contains('rsvped')) {
        // Un-RSVP
        movieRow.classList.remove('rsvped');
        button.textContent = 'RSVP';
        feedback.textContent = '';

        // Re-enable all other buttons
        rsvpButtons.forEach(btn => btn.disabled = false);

      } else {
        // RSVP current row
        movieRow.classList.add('rsvped');
        feedback.textContent = `You RSVP'd for: ${movieName}`;

        // Disable all other buttons
        rsvpButtons.forEach(btn => {
          if (btn !== button) btn.disabled = true;
        });
      }
    });
  });
});

// ==============================
// PRIVACY STATEMENT EXPAND/COLLAPSE
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  const expandBtn = document.querySelector('.expand-btn');
  const details = document.querySelector('.details-hidden');
  let info = false;

  if (expandBtn && details) {
    expandBtn.addEventListener('click', () => {
      if (!info) {
        details.style.display = "flex";
        expandBtn.textContent = "-";
        expandBtn.setAttribute("aria-label", "Collapse card");
        info = true;
      } else {
        details.style.display = "none";
        expandBtn.textContent = "+";
        expandBtn.setAttribute("aria-label", "Expand card");
        info = false;
      }
    });
  }
});
