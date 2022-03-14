import { $, isEndOfScroll, throttle } from './util/general.js';
import YoutubeSearchClient from './domain/YoutubeSearchClient.js';
import userInterface from './UI/userInterface.js';
import '../css/index.css';
import '../assets/images/not_found.png';
import storage from './storage/storage.js';
import { THROTTLE_DELAY } from './constants/constants.js';

export default function App() {
  const youtubeSearchClient = new YoutubeSearchClient();

  // 핸들러
  const handleSearch = () => {
    try {
      youtubeSearchClient.resetSearchResults();
      userInterface.resetVideoList();

      const searchInput = $('#search-input-keyword').value.trim();
      youtubeSearchClient.searchTarget = searchInput;

      userInterface.renderSkeletonUI();

      const response = youtubeSearchClient.callSearchAPI();
      youtubeSearchClient.updateSearchResults(response);

      userInterface.renderSearchResult(response);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleScroll = e => {
    if (isEndOfScroll(e.target)) {
      userInterface.renderSkeletonUI();

      const response = youtubeSearchClient.callSearchAPI();
      youtubeSearchClient.updateSearchResults(response);

      userInterface.renderNextSearchResult(response);
    }
  };

  const handleSaveButtonClick = e => {
    if (!e.target.classList.contains('video-item__save-button')) {
      return;
    }
    try {
      const saveTargetVideo = e.target.parentElement.dataset;
      storage.updateSavedVideos(saveTargetVideo);

      e.target.closest('button').hidden = true;
    } catch (error) {
      alert(error.message);
    }
  };

  // 이벤트 등록
  $('#search-modal-button').addEventListener('click', () => {
    $('.modal-container').classList.toggle('hide');
  });

  $('#search-button').addEventListener('click', handleSearch);

  $('#search-input-keyword').addEventListener('keypress', e => {
    if (e.key === 'Enter') handleSearch();
  });

  $('.video-list').addEventListener('scroll', throttle(handleScroll, THROTTLE_DELAY));

  $('.video-list').addEventListener('click', handleSaveButtonClick);
}

App();
