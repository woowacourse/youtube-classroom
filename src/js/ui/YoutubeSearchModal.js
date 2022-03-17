import { $ } from '../utils/dom';
import Search from './Search';

export default class YoutubeSearchModal {
  constructor() {
    this.addSearchModalButtonClickEvent();
    this.addModalCloseEvent();
    this.search = new Search();
  }

  reset() {
    this.toggleShowSearchModal();
    this.search.reset();
  }

  toggleShowSearchModal() {
    $('.modal-container').classList.toggle('hide');
  }

  addSearchModalButtonClickEvent() {
    $('#search-modal-button').addEventListener('click', () => {
      this.toggleShowSearchModal();
      this.search.input.focus();
    });
  }

  addModalCloseEvent() {
    $('.dimmer').addEventListener('click', e => {
      this.reset();
    });
    $('.modal-container').addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.reset();
      }
    });
  }
}
