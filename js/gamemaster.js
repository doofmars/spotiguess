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

  /**
   * Generates a room code string containing only uppercase letters
   * @return {string} The generated string
   */
  function generateRoomCode() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
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

  function loadOptions() {
    var set = new Set();
    items.forEach(function callback(item) {
      set.add(item.added_by.id);
    });
    game.options = Array.from(set);
  }

  /**
   * Set the stage for the next song
   */
  function setNextSong() {
    if (game.phase === "play" && items !== null) {
      var item = items[Math.floor(Math.random() * items.length)];
      console.log('selected: ' + item.track.name + ' ' + item.track.preview_url);
      $('#song').html(songTempalate(item));
      $('#audioPreviewUrl').on("canplay", function() {
        $('#audioPreviewUrl')[0].play();
      });
      socket.emit('next-song',
                  {
                    roomcode:game.roomcode,
                    title:item.track.name,
                    artist:item.track.artists[0].name
                  });
      $('.play .sbtn').removeClass('sbtn-white').addClass('sbtn-green')
      var countdownNumberEl = $('#countdown-number');
      var countdown = 30;
      var interval = setInterval(function() {
        countdown = --countdown;

        if (countdown <= 0) {
          $('#countdown').hide();
          $('#added-by').show();
          clearInterval(interval);
        }

        countdownNumberEl.text(countdown);
      }, 1000);
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
  var game = {pos:-1, id:"", phase:"create", roomcode:generateRoomCode(), players:new Map()};
  var items = null;
  //sockets
  var socket = io();
  socket.emit('room-code', game.roomcode);
  socket.on('reconnect', function() {
      socket.emit('room-code-reconnect', game.roomcode);
  });

  $('#room-code').text(game.roomcode);

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

  socket.on('request-join', function(msg){

    socket.emit('join-accepted', msg);
    if (game.phase === 'play') {
      socket.emit('options', {roomcode:game.roomcode, options:game.options});
    }
    if (game.players.get(msg.name)) {
      console.log('Player Rejoined: ' + msg.name);
    } else {
      console.log('Player Joined: ' + msg.name);
      game.players.set(msg.name, {score: 0, currentVote:""});
      $('.players').append('<button class="sbtn sbtn-green mb-1 float-right" id="'+
                           msg.name+'">'+msg.name+'</button>');
    }

  });

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
           loadOptions();
           console.log('Detected options: ' + JSON.stringify(game.options));
           socket.emit('options', {roomcode:game.roomcode, options:game.options});
           setNextSong();
           $('#play').show();
         },
         error: function(response) {
           reset("Invalid access token", true);
         }
       });
    }
  });

  socket.on('vote', function(msg){
    console.log('Got player ' + msg.name + " voted for:" + msg.option);
    $('.play #'+msg.name).removeClass('sbtn-green').addClass('sbtn-white');
  });


  $('#next').click(function(event) {
    setNextSong();
  });
})();
