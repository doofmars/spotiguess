(function() {

  var stateKey = 'spotify_auth_state';
  var accessTokenKey = 'spoitify_access_token';

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    // Clear hash location from url to prevent access key leaking
    history.replaceState(null, null, ' ');
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var playlistsTempalate = Handlebars.templates.playlists;
  var playlistsPlaceholder = document.getElementById('playlists');

  var params = getHashParams();

  var state = params.state,
    storedState = localStorage.getItem(stateKey);
  var access_token = null;

  if (state === storedState) {
    // new login, store access token.
    access_token = params.access_token;
    if (access_token) {
      localStorage.removeItem(stateKey);
      localStorage.setItem(accessTokenKey, access_token);
    } else {
      // Failed login
      $('#login').show();
      $('#error').show();
      $('#loggedin').hide();
    }
  } else {
    access_token = localStorage.getItem(accessTokenKey);
  }

  //check if the access_token is not null
  if (access_token) {
    $.ajax({
      url: 'https://api.spotify.com/v1/me/playlists',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        playlistsPlaceholder.innerHTML = playlistsTempalate(response);
        $('#login').hide();
        $('#loggedin').show();
      },
      error: function(response) {
        $('#loggedin').hide();
        $('#login').show();
        $('#error').show();
      }
    });
  } else {
    $('#login').show();
    $('#loggedin').hide();
  }
})();
