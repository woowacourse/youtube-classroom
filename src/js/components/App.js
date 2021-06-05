import YoutubeAPIManager from '../model/YoutubeAPIManager.js';
import VideoSearchModal from './videoSearchModal/VideoSearchModal.js';
import VideoList from './videoList/VideoList.js';
import {
  $,
  $$,
  localStorageSetItem,
  localStorageGetItem,
} from '../utils/utils.js';
import { LOCALSTORAGE_KEYS, SELECTORS, TYPES } from '../constants/constants.js';

export const youtubeAPIManager = new YoutubeAPIManager();
export default class App {
  constructor($target) {
    this.$target = $target;
    this.setup();
  }

  setup() {
    this.localStorageSetup();
    this.states = {
      searchedVideos: [],
      searchHistory: localStorageGetItem(LOCALSTORAGE_KEYS.SEARCH_HISTORY),
      requestPending: false,
      savedVideoCount: Object.keys(
        localStorageGetItem(LOCALSTORAGE_KEYS.VIDEOS)
      ).length,
    };
  }

  run() {
    this.initRender();
    this.mount();
    this.selectDOM();
    this.bindEvent();
  }

  localStorageSetup() {
    if (localStorageGetItem(LOCALSTORAGE_KEYS.VIDEOS) === null) {
      localStorageSetItem(LOCALSTORAGE_KEYS.VIDEOS, {});
    }

    if (localStorageGetItem(LOCALSTORAGE_KEYS.SEARCH_HISTORY) === null) {
      localStorageSetItem(LOCALSTORAGE_KEYS.SEARCH_HISTORY, []);
    }
  }

  initRender() {
    this.$target.innerHTML = `
      <div class="d-flex justify-center mt-5 w-100">
      <div class="w-100">
        <header class="my-4">
          <h1 class="text-center font-bold">👩🏻‍💻 나만의 유튜브 강의실 👨🏻‍💻</h1>
          <nav id="menu-buttons" class="d-flex justify-between">
          <form id="filter-form">  
            <fieldset id="filter">  
              <input type="radio" name="filter" id="watch-later-button" class="d-none" value="👁️ 볼 영상" checked/>
              <label for="watch-later-button" class="d-inline-block btn menu-btn text-base">👁️ 볼 영상</label>
              <input type="radio" name="filter" id="watched-button" class="d-none" value="✅ 본 영상"/>
              <label for="watched-button" class="d-inline-block btn menu-btn mx-1 text-base">✅ 본 영상</label>
              <input type="radio" name="filter" id="liked-button" class="d-none" value="👍 좋아요 한 영상"/>
              <label for="liked-button" class="d-inline-block btn menu-btn mx-1 text-base">👍 좋아요 한 영상</label>
            </fieldset>
          </form>
          <div class="d-flex">
            <button id="search-button" class="btn menu-btn text-base" type="button">🔍 동영상 검색</button>
          </div>
          </nav>
        </header>
        <main class="mt-10 d-flex flex-col items-center">
          <section id="video-list-wrapper" class="video-wrapper relative">
          </section>
          <img src="./src/images/status/youtube_no_saved_image_light.jpeg" alt="no_saved_video" class="no-saved-video-image d-none"/>
        </main>
      </div>
      <div class="modal" role="dialog" aria-modal="true">
      </div>
      <div id="snackbar"></div>
    </div>`;
  }

  mount() {
    this.videoList = new VideoList($(SELECTORS.VIDEO_LIST.VIDEO_LIST_ID));
    this.viewSearchModal = new VideoSearchModal(
      $(SELECTORS.SEARCH_MODAL.MODAL_CLASS)
    );
  }

  selectDOM() {
    this.$watchLaterButton = $(SELECTORS.MENU_BUTTON.WATCH_LATER_ID);
    this.$watchedButton = $(SELECTORS.MENU_BUTTON.WATCHED_ID);
    this.$likedButton = $(SELECTORS.MENU_BUTTON.LIKED_ID);
    this.$searchButton = $(SELECTORS.MENU_BUTTON.SEARCH_ID);
  }

  bindEvent() {
    this.$watchLaterButton.addEventListener('click', () => {
      this.videoList.setFilter(TYPES.FILTER.WATCH_LATER);
    });

    this.$watchedButton.addEventListener('click', () => {
      this.videoList.setFilter(TYPES.FILTER.WATCHED);
    });

    this.$likedButton.addEventListener('click', () => {
      this.videoList.setFilter(TYPES.FILTER.LIKED);
    });

    this.$searchButton.addEventListener('click', () =>
      this.viewSearchModal.onModalShow()
    );
  }
}
