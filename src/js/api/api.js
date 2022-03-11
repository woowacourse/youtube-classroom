import { YOUTUBE_API_KEY } from '../../../api_key.js';
import { searchVideosMock } from '../__mocks__/api.js';

const API_SERVER = 'https://www.googleapis.com/youtube/v3';
const QUERY_OPTIONS = {
  SEARCH: {
    part: 'snippet',
    type: 'video',
    maxResults: 10,
  },
};

// export const searchVideos = (query, nextPageToken = null) => {
//   const options = QUERY_OPTIONS.SEARCH;
//   const spreadQuery = `part=${
//     options.part
//   }&q=${query}&key=${YOUTUBE_API_KEY}&type=${options.type}&maxResults=${
//     options.maxResults
//   }${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
//   const url = `${API_SERVER}/search?${spreadQuery}`;

//   return fetch(url)
//     .then((res) => res.json())
//     .catch((err) => err);
// };

export const searchVideos = searchVideosMock;
