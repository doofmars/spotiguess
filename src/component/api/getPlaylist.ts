import axios from 'axios';

/**
 * Get all playlist items
 *
 * @param {String} id Playlist ID
 * @param {String} access_token Spotify access token
 * @param {Function} successHandler Callback when all tracks are received
 * @param {Function} errorHandler Callback when some error occurs
 */
export default function getPlaylist(id, access_token, successHandler, errorHandler) {
  getPlaylistRecursive([], 0, id, access_token, successHandler, errorHandler)
}

/**
 * Recursively get all playlist items if playlist has more than 100 items of Spotify api limit
 *
 * @param {Array} items Collected track list used for recursion
 * @param {Integer} offset current offset
 * @param {String} id Playlist ID
 * @param {String} access_token Spotify access token
 * @param {Function} successHandler Callback when all tracks are received
 * @param {Function} errorHandler Callback when some error occurs
 */
function getPlaylistRecursive(items, offset, id, access_token, successHandler, errorHandler) {
  axios.get('https://api.spotify.com/v1/playlists/' + id + '/tracks?offset=' + offset,
    {
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }).then(response => {
    var stats = {limit: response.data.limit, offset: response.data.offset, total: response.data.total};
    console.log('Received items: ' + JSON.stringify(stats));

    items = items.concat(response.data.items);

    if (offset + 100 < response.data.total) {
      getPlaylistRecursive(items, offset + 100, id, access_token, successHandler, errorHandler);
    } else {
      console.log('Total items: ' + items.length);
      shuffleArray(items);
      successHandler(items);
    }
  }).catch(error => {
    console.log(error);
    errorHandler();
  });
}

/**
 * Randomize array in-place using Durstenfeld shuffle algorithm
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
