/* wa13.js
   WA13 prototype: iTunes search + novelty/fairness re-ranking
   - Uses iTunes Search API for results & preview
   - Simulates deterministic 'popularity' from trackId so rankings are repeatable
   - Novelty slider mixes personalization (query match) with novelty (inverse popularity)
   - Discovery slots (every 4th item) highlight lower-pop items
*/

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsEl = document.getElementById('results');
const historyList = document.getElementById('historyList');
const saveHistory = document.getElementById('saveHistory');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');
const noveltyRange = document.getElementById('noveltyRange');
const noveltyValue = document.getElementById('noveltyValue');
const resultsMeta = document.getElementById('resultsMeta');
const sortBtn = document.getElementById('sortBtn');
const resetBtn = document.getElementById('resetBtn');

// Load history
let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
function displayHistory() {
  historyList.innerHTML = history.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}
displayHistory();

// Utility: deterministic pseudo-popularity based on trackId (0..100)
function computePopularity(trackId) {
  // simple hash-like deterministic function
  let x = Number(trackId) || 0;
  // linear congruential-ish
  x = (x * 9301 + 49297) % 233280;
  return Math.floor((x / 233280) * 100); // 0..99
}

// Personalization score: simple genre/artist match boost from query tokens
function personalizationScore(track, queryTokens) {
  const title = (track.trackName || '').toLowerCase();
  const artist = (track.artistName || '').toLowerCase();
  let score = 0.25;
  queryTokens.forEach(t => {
    if (!t) return;
    if (title.includes(t)) score += 0.35;
    if (artist.includes(t)) score += 0.25;
  });
  // small variance
  score += (Math.random() * 0.08) - 0.04;
  return clamp(score, 0, 1);
}

// Novelty score: inverse normalized popularity (0..1)
function noveltyScore(popularity) {
  return 1 - (popularity / 100);
}

// compute final score mixing personalization and novelty
function computeFinalScore(track, tokens, noveltyWeight) {
  const p = personalizationScore(track, tokens);
  const n = noveltyScore(track.__popularity);
  const final = (1 - noveltyWeight) * p + noveltyWeight * n;
  return { final, personalization: p, novelty: n };
}

// clamp helper
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

// Escape html
function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// Render helper: builds DOM for a single track
function buildTrackCard(track, index, isDiscovery=false) {
  const div = document.createElement('div');
  div.className = 'track' + (isDiscovery ? ' discovery' : '');
  div.setAttribute('role','listitem');
  const artwork = escapeHtml((track.artworkUrl100 || '').replace('100x100bb.jpg','600x600bb.jpg'));
  const title = escapeHtml(track.trackName || 'Untitled');
  const artist = escapeHtml(track.artistName || 'Unknown artist');
  const preview = track.previewUrl ? escapeHtml(track.previewUrl) : null;
  const pop = track.__popularity;

  div.innerHTML = `
    <div class="art" aria-hidden="true">
      <img class="artwork" src="${artwork}" alt="${title} — artwork">
    </div>
    <h3>${title}</h3>
    <p>${artist}</p>
    <div class="meta-row">
      <div style="display:flex;gap:8px;align-items:center;width:100%;">
        <div class="popbar" aria-hidden="true"><i style="width:${pop}%"></i></div>
        <div style="min-width:56px;text-align:right;color:var(--muted);font-size:13px">${pop}%</div>
      </div>
      <div style="min-width:90px;text-align:right;font-size:13px;color:var(--muted)">
        Score: <strong>${track.__final.toFixed(2)}</strong>
      </div>
    </div>
    ${ preview ? `<audio controls preload="none" style="margin-top:8px"><source src="${preview}"></audio>` : `<p style="margin-top:8px;color:var(--muted)">No preview</p>` }
  `;
  return div;
}

// Render list of tracks (with discovery slots)
function renderResults(tracks, noveltyPercent) {
  resultsEl.innerHTML = '';
  if (!tracks || tracks.length === 0) {
    resultsEl.innerHTML = '<p style="color:var(--muted)">No tracks found.</p>';
    resultsMeta.textContent = '';
    return;
  }

  // Build discovery slots: every 4th item we prefer a high-novelty item
  const discoveryInterval = 4;
  const used = new Set();
  const finalList = [];
  let j = 0;

  while (finalList.length < Math.min(12, tracks.length) && j < tracks.length) {
    // if it's a discovery slot
    if ((finalList.length + 1) % discoveryInterval === 0) {
      const candidate = tracks.find(t => !used.has(t.trackId) && t.__final && t.__novelty > 0.6);
      if (candidate) {
        finalList.push(candidate);
        used.add(candidate.trackId);
        continue;
      }
    }
    // otherwise take next highest remaining
    const next = tracks.find(t => !used.has(t.trackId));
    if (next) {
      finalList.push(next);
      used.add(next.trackId);
    } else break;
    j++;
  }

  // render DOM
  finalList.forEach((t, idx) => {
    const isDiscovery = ((idx + 1) % discoveryInterval === 0);
    const card = buildTrackCard(t, idx+1, isDiscovery);
    resultsEl.appendChild(card);
  });

  resultsMeta.textContent = `Showing ${finalList.length} tracks — Novelty ${noveltyPercent}%`;
}

// Fetch iTunes tracks then augment with pop & compute ranking
async function fetchAndRank(query, noveltyPercent=20) {
  resultsEl.innerHTML = '<p style="color:var(--muted)">Loading…</p>';
  resultsMeta.textContent = '';
  try {
    const resp = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=30`);
    if (!resp.ok) throw new Error('Network error');
    const data = await resp.json();
    const items = data.results || [];

    // augment deterministic popularity and compute scores
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const noveltyWeight = noveltyPercent / 100;

    const scored = items.map(item => {
      const pop = computePopularity(item.trackId || item.collectionId || item.trackTimeMillis || Math.random()*100);
      item.__popularity = pop;
      const s = computeFinalScore(item, tokens, noveltyWeight);
      item.__final = s.final;
      item.__personalization = s.personalization;
      item.__novelty = s.novelty;
      return item;
    });

    // sort by final descending
    scored.sort((a,b) => b.__final - a.__final);

    renderResults(scored, noveltyPercent);
  } catch (err) {
    resultsEl.innerHTML = `<p style="color:var(--muted)">Error: ${escapeHtml(err.message)}</p>`;
  }
}

// update novelty label when slider moves
function updateNoveltyLabel() {
  const v = Number(noveltyRange.value);
  noveltyValue.textContent = `${v}%`;
  noveltyRange.setAttribute('aria-valuenow', String(v));
}

// Event wiring
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if (!q) return;
  const novelty = Number(noveltyRange.value);

  // save history if checked
  if (saveHistory.checked) {
    history.unshift(q);
    // keep last 12
    history = history.slice(0,12);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    displayHistory();
  }

  fetchAndRank(q, novelty);
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    // form submit handles it
    return;
  }
});

// Export & clear
clearBtn.addEventListener('click', () => {
  localStorage.removeItem('searchHistory');
  history = [];
  displayHistory();
});

exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "TuneFinder_History.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Sort button (toggles sort mode) — kept for UX demonstration (final score vs popularity)
let sortMode = 'final';
sortBtn.addEventListener('click', async () => {
  // if we already have results on screen, re-sort them client-side
  const q = searchInput.value.trim();
  if (!q) return;
  const novelty = Number(noveltyRange.value);
  // fetch and rank again; it's quick and demonstrates effect
  await fetchAndRank(q, novelty);
  // toggle visual state briefly
  sortBtn.textContent = 'Sort: Final Score';
});

// Reset control
resetBtn.addEventListener('click', () => {
  noveltyRange.value = 20;
  updateNoveltyLabel();
  saveHistory.checked = false;
  resultsEl.innerHTML = '';
  resultsMeta.textContent = '';
  // leave history intact
});

// slider immediate re-ranking if results exist
noveltyRange.addEventListener('input', () => {
  updateNoveltyLabel();
  // if we have a last search, re-run ranking
  const q = searchInput.value.trim();
  if (q) {
    // small debounce
    if (window.__noveltyTimer) clearTimeout(window.__noveltyTimer);
    window.__noveltyTimer = setTimeout(() => fetchAndRank(q, Number(noveltyRange.value)), 250);
  }
});

// initialize UI
updateNoveltyLabel();