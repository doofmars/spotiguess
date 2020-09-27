import axios from 'axios';

export default function getPlaylist(id, access_token, successHandler, errorHandler) {
  var playlist = getPlaylistRecursive([], 0, id, access_token, successHandler, errorHandler)
}

/**
 * Recursivly get all playlist items if playlist has more than 100 items of spotify api limit
 */
function getPlaylistRecursive(items, offset, id, access_token, successHandler, errorHandler) {
  axios.get('https://api.spotify.com/v1/playlists/'+id+'/tracks?offset=' + offset,
    { headers: { 'Authorization': 'Bearer ' + access_token
  }}).then(response => {
    var stats = {limit:response.data.limit, offset:response.data.offset, total:response.data.total};
    console.log('Received items: ' + JSON.stringify(stats));

    items = items.concat(response.data.items);

    if (offset + 100 < response.data.total) {
      getPlaylistRecursive(items, offset + 100, id, access_token);
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
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
