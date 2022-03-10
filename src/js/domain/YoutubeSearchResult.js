import Store from '@Core/Store';
import { requestYoutubeSearch } from '../api';

class SearchStore extends Store {
  state = {
    searchKeyword: '',
    isLoading: false,
    isLoaded: false,
    items: [],
    nextPageToken: '',
    error: '',
  };

  reducer(type, data) {
    const stateByType = {
      UPDATE_SEARCH_KEYWORD: () => {
        this.setState({
          ...this.state,
          searchKeyword: data,
          isLoading: true,
          isLoaded: false,
        });
      },
      UPDATE_SEARCH_RESULT: async () => {
        const { items, nextPageToken } = await requestYoutubeSearch(
          this.state.searchKeyword,
          this.state.nextPageToken,
        );
        this.setState({
          ...this.state,
          isLoading: false,
          isLoaded: true,
          items: [...this.state.items, ...items],
          nextPageToken,
        });
      },
    };
    stateByType[type] && stateByType[type]();
  }
}

export default new SearchStore();
