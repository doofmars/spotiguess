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
    clearInterval(interval);
    if (game.round >= game.roundMax - 1) {
      game.phase = 'finish';
      showFinish();
    }
    if (game.phase === "play" && items !== null) {
      var item = items[Math.floor(Math.random() * items.length)];
      game.answer = item.added_by.id;
      game.round += 1;
      console.log(game.round + ': selected ' + item.track.name + ' ' + item.track.preview_url);
      $('#audioPreviewUrl').attr('src', item.track.preview_url);
      $('#audioPreviewUrl').on("canplay", function() {
        $('#audioPreviewUrl')[0].play();
      });
      $('#song').fadeOut("fast", function() {
        $('#song').html(songTempalate(item));
        $('#song').fadeIn("fast", function() {
          var countdown = 20;
          var date = new Date();
          date.setSeconds(date.getSeconds() + countdown);
          var now = date.getTime();
          currentSong = {
                        roomcode:game.roomcode,
                        title:item.track.name,
                        artist:item.track.artists[0].name,
                        votetime:now
                      };
          socket.emit('next-song', currentSong);
          $('.play .sbtn')
          .removeClass('sbtn-white')
          .removeClass('sbtn-green')
          .removeClass('sbtn-red')
          .addClass('sbtn-yellow');
          var countdownNumberEl = $('#countdown-number');

          interval = setInterval(function() {
            countdown = --countdown;

            if (countdown <= 0) {
              clearInterval(interval);
              $('#countdown').hide();
              $('#added-by').show();
              showResults();
              setTimeout(function () {
                setNextSong();
              }, 4500);
            }

            countdownNumberEl.text(countdown);
          }, 1000);
        });
      });
    }
  }

  /**
   * Reveal the results
   */
  function showResults() {
    game.players.forEach(function each(player, name) {
      if (player.currentVote === game.answer) {
        $('.play #'+name).removeClass('sbtn-white').addClass('sbtn-green');
        player.score += 1;
      } else {
        $('.play #'+name).removeClass('sbtn-white').addClass('sbtn-red');
      }
      player.currentVote = '';
    });
  }

  /**
   * Show end screen
   */
  function showFinish() {
    var results = [];
    var max = 0;
    game.players.forEach(function each(player, name) {
      if (player.score > max) {
        results.unshift({name:name, score:player.score});
        max = player.score;
      } else {
        results.push({name:name, score:player.score});
      }
    });
    results.forEach(function each(val, index) {
      $('#results').append('<tr><th scope="row">' + (index + 1) +
        '</th><td>' + val.name + '</td><td>' + val.score + '</td></tr>');
    });
    $('#play').hide('slow', function() {
      $('#finish').show('fast');
    });
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
  var game = {
    pos:-1,
    id:"",
    round:0,
    roundMax:30,
    phase:"create",
    roomcode:generateRoomCode(),
    players:new Map(), //values: {score:num, currentVote:str}
    answer:null
  };
  var items = null;
  var currentSong = null;
  var interval = null;
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
      if (currentSong !== null) {
        socket.emit('next-song', currentSong);
      }
    }
    if (game.players.get(msg.name)) {
      console.log('Player Rejoined: ' + msg.name);
    } else {
      console.log('Player Joined: ' + msg.name);
      game.players.set(msg.name, {score: 0, currentVote:""});
      $('.players').append('<button class="sbtn sbtn-yellow mb-1 float-right" id="'+
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
    $('.play #'+msg.name).removeClass('sbtn-yellow').addClass('sbtn-white');
    var player = game.players.get(msg.name);
    if (player) {
      player.currentVote = msg.option;
    }
  });


  $('#next').click(function(event) {
    setNextSong();
  });
})();
