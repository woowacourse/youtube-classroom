import { $, debounce } from '../util';
import SearchKeywordFormView from './SearchKeywordFormView';
import SearchResultView from './SearchResultView';
import { ALERT_MESSAGE, SCROLL_BUFFER_SECOND, SCROLL_BUFFER_HEIGHT } from '../constants';
import { validateSearchKeyword } from '../validation';

export default class SearchModalView {
  #modal;

  constructor(searchManager, saveManager) {
    this.#modal = $('#search-modal');

    this.searchKeywordFormView = new SearchKeywordFormView();
    this.searchResultView = new SearchResultView();

    this.searchManager = searchManager;
    this.saveManager = saveManager;

    this.bindEvents();
  }

  bindEvents() {
    $('.dimmer').addEventListener('click', this.closeModal);
    this.#modal.addEventListener('searchKeyword', this.onSubmitSearchKeyword.bind(this));
    this.#modal.addEventListener('searchOnScroll', debounce(this.searchOnScroll.bind(this), SCROLL_BUFFER_SECOND));
    this.#modal.addEventListener('saveVideo', this.onClickVideoSaveButton.bind(this));
  }

  closeModal() {
    $('#modal-container').classList.add('hide');
  }

  onSubmitSearchKeyword(e) {
    const { keyword } = e.detail;
    try {
      validateSearchKeyword(keyword);
    } catch ({ message }) {
      return alert(message);
    }
    this.searchOnSubmitKeyword(keyword);
  }

  onClickVideoSaveButton(e) {
    const { target } = e.detail;
    const { videoId } = target.parentNode.dataset;
    try {
      this.saveManager.saveVideoById(videoId);
    } catch ({ message }) {
      return alert(message);
    }
    target.remove();
  }

  searchOnSubmitKeyword(keyword) {
    this.searchResultView.resetSearchResultVideoList();
    this.searchResultView.updateOnLoading();
    this.searchAndShowResult(keyword);
  }

  searchOnScroll(e) {
    if (this.impossibleToLoadMore(e)) return;
    this.searchResultView.updateOnLoading();
    this.searchAndShowResult();
  }

  searchAndShowResult(keyword) {
    this.searchManager
      .search(keyword)
      .then((videos) => {
        const checkedVideos = this.addSavedInfoToVideos(videos);
        this.searchResultView.updateOnSearchDataReceived(checkedVideos);
      })
      .catch(() => {
        this.searchResultView.showErrorResult();
      });
  }

  addSavedInfoToVideos(videos) {
    return videos.map((video) => ({
      ...video,
      saved: this.saveManager.findVideoById(video.id),
    }));
  }

  impossibleToLoadMore(e) {
    const { scrollTop, clientHeight, scrollHeight } = e.detail;
    if (scrollTop + clientHeight + SCROLL_BUFFER_HEIGHT < scrollHeight) return true;
    if (this.searchManager.isLastPage) {
      alert(ALERT_MESSAGE.NO_MORE_SEARCH_RESULT);
      return true;
    }
    return false;
  }
}
