import Store from '@Core/Store';
import { requestYoutubeSearch } from '../api';

class YoutubeSearchStore extends Store {
  state = {
    searchKeyword: '',
    isLoading: false,
    isLoaded: false,
    items: [],
    nextPageToken: '',
    error: '',
  };

  dispatch(type, data) {
    const stateByType = {
      UPDATE_SEARCH_KEYWORD: () => {
        this.setState({
          ...this.state,
          searchKeyword: data,
          isLoading: true,
          isLoaded: false,
          items: [],
          nextPageToken: '',
          error: false,
        });
      },
      UPDATE_SEARCH_RESULT: async () => {
        if (this.state.nextPageToken === undefined) return; // 분리하기

        const {
          items = [],
          nextPageToken = '',
          error = false,
        } = await requestYoutubeSearch(this.state.searchKeyword, this.state.nextPageToken);

        this.setState({
          ...this.state,
          isLoading: false,
          isLoaded: true,
          items: [...this.state.items, ...items],
          error,
          nextPageToken,
        });
      },
    };
    stateByType[type] && stateByType[type]();
  }
}

export default new YoutubeSearchStore();
