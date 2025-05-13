// YouTube API configuration
const API_KEY = 'AIzaSyBV5FYCcV3QjBWfynrIvg5Q1Yw3_slFc9k';
const CHANNEL_HANDLE = 'bearsdenbaptistchurch7645';
const MAX_RESULTS = 3;

// Function to initialize the YouTube API
function initYouTubeAPI() {
  gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
  }).then(() => {
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
    console.error('Error fetching videos:', error);
  }
}

// Load the YouTube API
gapi.load('client', initYouTubeAPI); 