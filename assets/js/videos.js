const API_KEY = "AIzaSyC5ndE6gYbWXUmRFS3TjT4AvEXHht9xBUo";
const SHORTS_PLAYLIST_ID = "PLBHyrORCfFQLcJgiAIzEA_FCpTe_xsyv2";
const LONG_PLAYLIST_ID = "PLBHyrORCfFQIsnCiu86ACWdxQOVXcePRh";

const MAX_RESULTS = 12;

async function fetchPlaylistVideos(playlistId) {
  const endpoint = new URL(
    "https://www.googleapis.com/youtube/v3/playlistItems",
  );
  endpoint.search = new URLSearchParams({
    part: "snippet,contentDetails",
    maxResults: MAX_RESULTS.toString(),
    playlistId,
    key: API_KEY,
  });

  const res = await fetch(endpoint);
  if (!res.ok) {
    console.error("YouTube API error:", res.status, await res.text());
    return [];
  }

  const data = await res.json();
  return data.items || [];
}

function createVideoCard(item) {
  const videoId = item.contentDetails.videoId;
  const title = item.snippet.title;
  const thumb =
    item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url;

  const url = `https://www.youtube.com/watch?v=${videoId}`;

  const card = document.createElement("article");
  card.className = "video-card";

  card.innerHTML = `
    <a href="${url}" target="_blank" rel="noopener noreferrer" class="video-card__link">
      <div class="video-card__thumb-wrap">
        <img src="${thumb}" alt="${title}" class="video-card__thumb" loading="lazy" />
      </div>
      <h3 class="video-card__title">${title}</h3>
    </a>
  `;

  return card;
}

async function renderPlaylist(playlistId, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const items = await fetchPlaylistVideos(playlistId);

    if (!items.length) {
      container.innerHTML = "<p>No videos yet. Check back soon!</p>";
      return;
    }

    items.forEach((item) => {
      const card = createVideoCard(item);
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Sorry, videos could not be loaded right now.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderPlaylist(LONG_PLAYLIST_ID, "videos-grid--full");
  renderPlaylist(SHORTS_PLAYLIST_ID, "videos-grid--shorts");
});
