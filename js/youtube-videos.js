// YouTube API configuration
const API_KEY = 'AIzaSyBV5FYCcV3QjBWfynrIvg5Q1Yw3_slFc9k';
const CHANNEL_HANDLE = 'bearsdenbaptistchurch7645';
let MAX_RESULTS = 3;

// Function to initialize the YouTube API
function initYouTubeAPI() {
  gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
  }).then(() => {
    // Allow per-page override via data attribute on #videos-grid
    try {
      const grid = document.getElementById('videos-grid');
      if (grid) {
        const override = parseInt(grid.getAttribute('data-max-results') || '', 10);
        if (!Number.isNaN(override) && override > 0 && override <= 50) {
          MAX_RESULTS = override;
        }
      }
    } catch (e) {
      // no-op
    }
    fetchChannelId();
  }).catch(error => {
    console.error('Error initializing YouTube API:', error);
  });
}

// Function to fetch channel ID from handle
async function fetchChannelId() {
  try {
    const response = await gapi.client.youtube.channels.list({
      part: 'id',
      forHandle: CHANNEL_HANDLE
    });

    if (response.result.items && response.result.items.length > 0) {
      const channelId = response.result.items[0].id;
      fetchLatestVideos(channelId);
    } else {
      console.error('Channel not found');
    }
  } catch (error) {
    console.error('Error fetching channel ID:', error);
  }
}

// Function to fetch the latest videos
async function fetchLatestVideos(channelId) {
  try {
    const response = await gapi.client.youtube.search.list({
      part: 'snippet',
      channelId: channelId,
      maxResults: MAX_RESULTS,
      order: 'date',
      type: 'video'
    });

    const videosGrid = document.getElementById('videos-grid');
    videosGrid.innerHTML = ''; // Clear existing content
    response.result.items.forEach(video => {
      const videoContainer = document.createElement('div');
      videoContainer.className = 'video-container';

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${video.id.videoId}`;
      iframe.title = video.snippet.title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;

      videoContainer.appendChild(iframe);
      videosGrid.appendChild(videoContainer);
    });
  } catch (error) {
    // error getting recent videos so just fall back to default
    console.error('Error fetching videos:', error);

    const defaultVideos = ['qbfiiSga_sw', 'hbZyJAaQlzQ', 'HOmvw3noQ8s']; 
    populateVideos(defaultVideos);
  }
}

function populateVideos(videoIDs) {
  const videosGrid = document.getElementById('videos-grid');
  videosGrid.innerHTML = ''; // Clear existing content
  videoIDs.forEach(videoID => {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoID}`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    videoContainer.appendChild(iframe);
    videosGrid.appendChild(videoContainer);
  });

}
// Load the YouTube API
gapi.load('client', initYouTubeAPI); 