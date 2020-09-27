export default function login() {
  var client_id = '10bc80659da04939b8ff8b6014793016'; // Your client id
  var redirect_uri = window.location.href; // Your redirect uri

  var state = generateRandomString(16);

  localStorage.setItem(stateKey, state);
  //user-read-private user-read-email
  var scope = 'playlist-read-collaborative';

  var url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(client_id);
  url += '&scope=' + encodeURIComponent(scope);
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
  url += '&state=' + encodeURIComponent(state);

  console.log("meh")
  window.location = url;
}

var stateKey = 'spotify_auth_state';

function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
