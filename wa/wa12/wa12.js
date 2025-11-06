const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const results = document.getElementById('results');
const historyList = document.getElementById('historyList');
const saveHistory = document.getElementById('saveHistory');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');

// Load history if saved
let history = JSON.parse(localStorage.getItem('searchHistory')) || [];

function displayHistory() {
  historyList.innerHTML = history.map(item => `<li>${item}</li>`).join('');
}

displayHistory();

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (!query) return;

  fetchTracks(query);

  if (saveHistory.checked) {
    history.push(query);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    displayHistory();
  }
});

searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchBtn.click();
  }
});

async function fetchTracks(query) {
  results.innerHTML = "<p>Loading...</p>";
  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=12`);
    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    if (data.results.length === 0) {
      results.innerHTML = "<p>No tracks found.</p>";
      return;
    }

    results.innerHTML = data.results.map(track => `
    <div class="track">
        <img src="${track.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg')}" alt="${track.trackName}">
        <h3>${track.trackName}</h3>
        <p>${track.artistName}</p>
        ${track.previewUrl ? `<audio controls src="${track.previewUrl}"></audio>` : `<p>No preview available</p>`}
    </div>
    `).join('');

  } catch (err) {
    results.innerHTML = `<p>Error loading tracks: ${err.message}</p>`;
  }
}

// Clear and export features
clearBtn.addEventListener('click', () => {
  localStorage.removeItem('searchHistory');
  history = [];
  displayHistory();
});

exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "TuneFindr_History.json";
  a.click();
  URL.revokeObjectURL(url);
});