/**
 * Login to spotify using implicit grant oauth flow
 */
export default function login() {
  const client_id = '10bc80659da04939b8ff8b6014793016'; // Your client id
  const redirect_uri = window.location.href; // Your redirect uri

  const state = generateRandomString(16);

  localStorage.setItem(stateKey, state);
  //user-read-private user-read-email
  const scope = 'playlist-read-collaborative';

  let url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(client_id);
  url += '&scope=' + encodeURIComponent(scope);
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
  url += '&state=' + encodeURIComponent(state);

  console.log("meh")
  window.location.href = url;
}

var stateKey = 'spotify_auth_state';

/**
 * Helper to generate a random string for API access
 *
 * @param {String} length length of string
 */
function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
