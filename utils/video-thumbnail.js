/**
 * Extract thumbnail from video file
 * @param {string} videoUrl - URL to the video file
 * @param {number} timeOffset - Time in seconds to capture frame (default: 5)
 * @returns {Promise<string>} - Base64 data URL of the thumbnail
 */
export function extractVideoThumbnail(videoUrl, timeOffset = 5) {
  return new Promise((resolve, reject) => {
    // Check if running in browser environment
    if (typeof document === 'undefined') {
      reject(new Error('extractVideoThumbnail can only run in browser environment'))
      return
    }
    
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.currentTime = timeOffset;
    
    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnail);
    });
    
    video.addEventListener('error', (e) => {
      reject(new Error('Failed to load video: ' + e.message));
    });
    
    video.src = videoUrl;
    video.load();
  });
}

/**
 * Save thumbnail to localStorage for caching
 */
export function cacheThumbnail(videoId, timeOffset, thumbnailData) {
  try {
    // Check if localStorage is available (browser environment)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`thumbnail_${videoId}_${timeOffset}`, thumbnailData);
    }
  } catch (e) {
    console.warn('Failed to cache thumbnail:', e);
  }
}

/**
 * Get cached thumbnail from localStorage
 */
export function getCachedThumbnail(videoId, timeOffset) {
  try {
    // Check if localStorage is available (browser environment)
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(`thumbnail_${videoId}_${timeOffset}`);
    }
    return null;
  } catch (e) {
    console.warn('Failed to get cached thumbnail:', e);
    return null;
  }
}