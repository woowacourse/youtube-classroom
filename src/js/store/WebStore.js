import { ALERT_MESSAGE } from '../constant.js';

export default class WebStore {
  #key;

  #cached;

  constructor(key) {
    this.#key = key;
    this.#cached = JSON.parse(localStorage.getItem(this.#key)) || [];
  }

  #cache(data) {
    this.#cached = [...data];
  }

  load() {
    return [...this.#cached] || JSON.parse(localStorage.getItem(this.#key));
  }

  save(data) {
    if (this.#cached.length > 100) {
      throw Error(ALERT_MESSAGE.EXCEED_MAX_SAVE);
    }
    this.#cache(data);
    localStorage.setItem(this.#key, JSON.stringify(data));
  }
}

export const webStore = new WebStore('savedVideos');
