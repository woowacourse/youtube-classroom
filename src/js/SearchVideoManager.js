import { ALERT_MESSAGE, MAX_DATA_FETCH_AT_ONCE } from './constants';
import { event } from './util';
import { validateSearchKeyword, checkNoUndefinedProperty } from './validation';

const DUMMY_YOUTUBE_API_URL = (keyword) =>
  `https://elastic-goldstine-10f16a.netlify.app/dummy/youtube/v3/search?part=snippet&q=${keyword}&maxResults=${MAX_DATA_FETCH_AT_ONCE}`;
const YOUTUBE_API_URL = (keyword) =>
  `https://elastic-goldstine-10f16a.netlify.app/youtube/v3/search?part=snippet&q=${keyword}&maxResults=${MAX_DATA_FETCH_AT_ONCE}`;
const WRONG_API_URL= (keyword) =>
  `https://elastic-goldstine-10f16a.netlify.app/search?part=snippettt&q=${keyword}&maxResults=${MAX_DATA_FETCH_AT_ONCE}`;

const FETCH_URL = (keyword, nextPageToken) =>
  `${DUMMY_YOUTUBE_API_URL(keyword)}${nextPageToken ? `&pageToken=${  nextPageToken}` : ''}`;

export default class SearchVideoManager {
  #keyword;

  #nextPageToken;

  #isLastPage;

  constructor(storage) {
    this.storage = storage;

    this.#keyword = '';
    this.#nextPageToken = '';
    this.#isLastPage = false;

    event.addListener('searchWithNewKeyword', this.searchWithNewKeyword.bind(this));
    event.addListener('searchOnScroll', this.searchOnScroll.bind(this));
  }

  searchWithNewKeyword(e) {
    const { keyword } = e.detail;
    try {
      validateSearchKeyword(keyword);
    } catch (err) {
      return alert(err.message);
    }
    this.#keyword = keyword;
    event.dispatch('resetSearchResult');
    this.resetNextPageToken();
    this.search();
  }

  searchOnScroll() {
    if (this.#isLastPage) {
      return alert(ALERT_MESSAGE.NO_MORE_SEARCH_RESULT);
    }
    this.search();
  }

  search() {
    this.fetchYoutubeData(this.#keyword)
      .then((data) => this.processFetchedResult(data))
      .then((fetchedData) => { 
        event.dispatch('updateFetchedData', { videos: fetchedData })
      }).catch(() => {
        event.dispatch('showSearchErrorResult');
      });
  }

  resetNextPageToken() {
    this.#nextPageToken = '';
    this.#isLastPage = false;
  }

  fetchYoutubeData(keyword) {
    return fetch(FETCH_URL(keyword, this.#nextPageToken))
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      });
  }

  processFetchedResult(result) {
    if (!result.nextPageToken) this.#isLastPage = true;
    this.#nextPageToken = result.nextPageToken;
    return result.items.map((item) => ({
      id: item.id.videoId,
      thumbnail: item.snippet.thumbnails.medium.url,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      publishedDate: new Date(item.snippet.publishedAt),
      saved: this.storage.findVideoById(item.id.videoId),
    })).filter((item) => checkNoUndefinedProperty(item));
  }
}
