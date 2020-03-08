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

  /*
   * Resets the game state
   * @params {reason} why was the reset called
   * @params {error} true if error message should be displayed
   */
  function reset(reason, error) {
    console.log("Reset: " + reason);
    $('#create').hide();
    $('#login').show();
    if (error) {
      $('#error').show();
    } else {
      game = {pos:-1, id:"", phase:"create"};
    }
  }

  function setNextSong() {
    if (game.phase === "play" && items !== null) {
      var item = items[Math.floor(Math.random() * items.length)];
      console.log('selected: ' + item.track.name);
      $('#song').html(songTempalate(item));
      $('#audioPreviewUrl').on("canplay", function() {
        $('#audioPreviewUrl')[0].play();
      });
    }
  }

  //Templates
  var playlistsTempalate = Handlebars.templates.playlists;
  var songTempalate = Handlebars.templates.song;
  //Login
  var params = getHashParams();
  var state = params.state,
    storedState = localStorage.getItem(stateKey);
  var access_token = null;
  //Game state
  var game = {pos:-1, id:"", phase:"create"};
  var items = null;

  if (state === storedState) {
    // new login, store access token.
    access_token = params.access_token;
    if (access_token) {
      localStorage.removeItem(stateKey);
      localStorage.setItem(accessTokenKey, access_token);
    } else {
      // Failed login
      reset("Failed to login", true);
    }
  } else {
    access_token = localStorage.getItem(accessTokenKey);
  }

  //check if the access_token is not null
  if (access_token && game.phase === "create") {
    $.ajax({
      url: 'https://api.spotify.com/v1/me/playlists',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        $('#playlists').html(playlistsTempalate(response));
        $('#playlists button').click(function(event) {
          $('#playlists tr#' + game.pos).removeClass('selected');
          game.pos = this.value;
          game.id = this.id;
          $('#playlists tr#' + game.pos).addClass('selected');
        });
        $('#login').hide();
        $('#error').hide();
        $('#error-shuffle').hide();
        $('#play').hide();
        $('#create').show();
      },
      error: function(response) {
        reset("Invalid access token", true);
      }
    });
  } else {
    reset("Missing access token", false);
  }

  $('#shuffle').click(function(event) {
    if (!access_token) {
      reset("Missing access token", false);
    } else if (game.pos === -1 || game.id === "") {
      $('#error-shuffle').show().html("Please select a playlist");
    } else if (game.phase !== "create") {
      $('#error-shuffle').show().html("Wrong game state");
    } else {
       $('#error-shuffle').hide();
       $('#login').hide();
       $('#create').hide();
       game.phase = "play";
       $.ajax({
         url: 'https://api.spotify.com/v1/playlists/'+game.id+'/tracks',
         headers: {
           'Authorization': 'Bearer ' + access_token
         },
         success: function(response) {
           items = response.items;
           setNextSong();
           $('#play').show();
         },
         error: function(response) {
           reset("Invalid access token", true);
         }
       });
    }
  });


  $('#next').click(function(event) {
    setNextSong();
  });
})();
