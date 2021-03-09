// TODO : 이름 videoToWatch -> watchingVideo

import { LOCAL_STORAGE_KEY } from '../constants.js';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from './localStorageUtil.js';

const videoToWatch = {
  getVideos() {
    return getLocalStorageItem(LOCAL_STORAGE_KEY.VIDEOS_TO_WATCH) || [];
  },

  setVideos(videos) {
    if (!Array.isArray(videos)) {
      return;
    }
    setLocalStorageItem(LOCAL_STORAGE_KEY.VIDEOS_TO_WATCH, videos);
  },

  pushVideo(newVideo) {
    const videosToWatch = videoToWatch.getVideos();
    videosToWatch.push(newVideo);
    videoToWatch.setVideos(videosToWatch);
  },

  popVideoByVideoId(videoId) {
    const videos = videoToWatch.getVideos();
    const poppedVideo = videos.find(video => video.videoId === videoId);
    if (!poppedVideo) {
      return;
    }
    videoToWatch.setVideos(videos.filter(video => video.videoId !== videoId));

    return poppedVideo;
  },
};

export default videoToWatch;
