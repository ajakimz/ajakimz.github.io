let albumBtn = document.querySelector("#js-new-quote").addEventListener('click', newAlbum);
let revealBtn = document.querySelector("#js-tweet").addEventListener('click', revealAnswer);

let currentAlbum = {
  artist: "",
  album: "",
  artwork: ""
};

// Array of some artist names to randomize searches
const artists = ["Drake", "Billie Eilish", "Coldplay", "Ariana Grande", "Still Woozy", "Kendrick Lamar", "The Weeknd", "Olivia Rodrigo", "Bruno Mars", "Lady Gaga", "Bad Bunny", "SZA", "Post Malone", "Doja Cat", "Tate McRae", "Black Eyed Peas", "Khalid", "Artic Monkeys", "TV Girl", "ILLIT", "Tomorrow X Together"];

async function newAlbum() {
  try {
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    const endpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(randomArtist)}&entity=album&limit=25`;

    const response = await fetch(endpoint);
    if (!response.ok) throw Error(response.statusText);

    const json = await response.json();

    if (json.results.length === 0) {
      throw Error("No albums found.");
    }

    // Pick random album from that artist
    const randomAlbum = json.results[Math.floor(Math.random() * json.results.length)];

    currentAlbum.artist = randomAlbum.artistName;
    currentAlbum.album = randomAlbum.collectionName;
    currentAlbum.artwork = randomAlbum.artworkUrl100.replace("100x100bb", "600x600bb");

    displayAlbum(currentAlbum.artwork);
  } catch (err) {
    console.error(err);
    alert("Failed to get album. Try again!");
  }
}

function displayAlbum(artwork) {
  const albumCover = document.querySelector("#album-cover");
  const answerText = document.querySelector("#js-answer-text");

  albumCover.src = artwork;
  answerText.textContent = ""; // clear previous answer
}

function revealAnswer() {
  const answerText = document.querySelector("#js-answer-text");
  answerText.textContent = `${currentAlbum.album} — ${currentAlbum.artist}`;
}

// Load one at start
newAlbum();