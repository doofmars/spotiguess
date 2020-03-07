(function() {

  var stateKey = 'spotify_auth_state';

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    history.replaceState(null, null, ' ');
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  userProfileTemplate = Handlebars.templates.playlists,
    userProfilePlaceholder = document.getElementById('user-profile');

  var params = getHashParams();

  var access_token = params.access_token,
    state = params.state,
    storedState = localStorage.getItem(stateKey);


  if (access_token && (state === null || state !== storedState)) {
    alert('There was an error during the authentication');
  } else {
    localStorage.removeItem(stateKey);
    if (access_token) {
      $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          userProfilePlaceholder.innerHTML = userProfileTemplate(response);
          $('#login').hide();
          $('#loggedin').show();
        }
      });
    } else {
      $('#login').show();
      $('#loggedin').hide();
    }
  }
})();
