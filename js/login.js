(function() {
  var stateKey = 'spotify_auth_state';

  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */
  function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  document.getElementById('login-button').addEventListener('click', function() {
    var client_id = '10bc80659da04939b8ff8b6014793016'; // Your client id
    var redirect_uri = 'http://localhost:3000/gamemaster.html'; // Your redirect uri

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

    window.location = url;
  }, false);
})();
