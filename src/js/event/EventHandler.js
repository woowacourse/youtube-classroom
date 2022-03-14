import MainView from '../view/MainView.js';
import ModalView from '../view/ModalView.js';
import videoAPI from '../videoAPI.js';
import validator from '../utils/validator.js';
import videoStorage from '../videoStorage.js';

export default class EventHandler {
  constructor() {
    this.mainView = new MainView();
    this.modalView = new ModalView();
    this.setBindEvents();
  }

  setBindEvents() {
    this.mainView.bindModalOpenButton(this.clickModalOpenButton.bind(this));
    this.modalView.bindOnClickSearchButton(this.clickSearchButton.bind(this));
    this.modalView.bindOnClickDimmer(this.clickDimmer.bind(this));
    this.modalView.bindVideoListScroll(this.videoListScroll.bind(this));
    this.modalView.bindVideoListClickStoreButton(this.clickStoreButton.bind(this));
  }

  clickModalOpenButton() {
    this.modalView.showModal();
  }

  clickDimmer() {
    this.modalView.hideModal();
  }

  clickStoreButton(videoId) {
    videoStorage.storeVideoId(videoId);
  }

  async clickSearchButton(searchInput) {
    try {
      validator.checkValidSearchInput(searchInput);
      this.modalView.resetVideoList();
      this.modalView.appendEmptyList();
      this.modalView.appendVideoItem();
      this.modalView.getSkeletonTemplate();
      const videoListData = await this.getVideoListData(searchInput);
      this.modalView.getData(videoListData);
    } catch (error) {
      alert(error.message);
      this.modalView.focusSearch();
    }
  }

  async videoListScroll(searchInput) {
    try {
      this.modalView.appendEmptyList();
      this.modalView.appendVideoItem();
      this.modalView.getSkeletonTemplate();
      const videoListData = await this.getVideoListData(searchInput);
      this.modalView.getData(videoListData);
    } catch (error) {
      alert(error.message);
    }
  }

  async getVideoListData(searchInput) {
    try {
      const rawData = await videoAPI.fetchData(searchInput);
      return videoAPI.parsingVideoData(rawData);
    } catch (error) {
      throw new Error(error);
    }
  }
}
