const clientId = "YOUR_CLIENT_ID"; // Replace with your Spotify Client ID
const redirectUri = "YOUR_REDIRECT_URI"; // Replace with your Redirect URI
const scopes = "user-read-playback-state user-modify-playback-state";

const loginBtn = document.getElementById("login-btn");
const playerDiv = document.getElementById("player");
const trackName = document.getElementById("track-name");
const artistName = document.getElementById("artist-name");
const audioPlayer = document.getElementById("audio-player");

// Function to generate Spotify login URL
function getSpotifyAuthUrl() {
  const url = new URL("https://accounts.spotify.com/authorize");
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("response_type", "token");
  url.searchParams.append("redirect_uri", redirectUri);
  url.searchParams.append("scope", scopes);
  return url.toString();
}

// Function to extract access token from URL hash
function getAccessTokenFromHash() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get("access_token");
}

// Function to fetch currently playing track
async function fetchCurrentlyPlaying(accessToken) {
  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    const track = data.item;
    trackName.textContent = track.name;
    artistName.textContent = track.artists.map((artist) => artist.name).join(", ");
    audioPlayer.src = track.preview_url || "";
    playerDiv.classList.remove("hidden");
  } else {
    console.error("Failed to fetch currently playing track.");
  }
}

// Event Listener for Login Button
loginBtn.addEventListener("click", () => {
  window.location.href = getSpotifyAuthUrl();
});

// On Page Load: Check for Access Token
window.addEventListener("load", () => {
  const accessToken = getAccessTokenFromHash();
  if (accessToken) {
    loginBtn.classList.add("hidden");
    fetchCurrentlyPlaying(accessToken);
  }
});
