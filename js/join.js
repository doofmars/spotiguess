(function() {

  function joinGame(session) {
    socket.emit('request-join', session);
    socket.on('join-accepted', function(msg){
      if (msg === session.name) {
        console.log('join-accepted');
        localStorage.setItem(sessionKey, JSON.stringify(session));
        $('#gamestart').hide();
        $('#play').show();
      }
    });
  }

  var socket = io();
  var sessionKey = 'spotiguess_client_session';
  socket.emit('type', 'client');
  var sessionString = localStorage.getItem(sessionKey);

  if (sessionString) {
    try {
      var session = JSON.parse(sessionString);
      joinGame(session);
    } catch(err) {
      localStorage.removeItem(sessionKey);
    }

  }

  $("#join-init").click(function() {
    $("#join-info").slideDown( "slow", function() {
      //complete
    });
  });

  $('#join-accept').click(function(event) {
    var name = $('#name').val();
    var code = $('#room-code').val().toUpperCase();
    if (! /^[a-z][-a-z _0-9]{0,15}$/i.test(name)) {
      $('#bad-message').text('Bad username, only chars, numbers or one of "-_ ". Must start with a char and not longer than 15').show();
      return;
    }
    if (! /^[A-Z]{5}$/.test(code)) {
      $('#bad-message').text('Bad code, must be 5 characters').show();
      return;
    }
    $('#bad-message').hide();
    var session = { name:name, roomcode:code};
    joinGame(session);
  });

  socket.on('options', function(msg){
    msg.forEach(function callback(option) {
      console.log(option);
    });
  });

})();
