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

  function joinAccept(event) {
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
    var session = { name:name, roomcode:code, options:false};
    joinGame(session);
  }
  $('#room-code').keyup(function(e){
      if(e.keyCode == 13)
      {
          $(this).trigger("enterKey");
      }
  });
  $('#room-code').bind("enterKey", joinAccept);
  $('#join-accept').click(joinAccept);

  socket.on('options', function(msg){
    $('#waiting').hide();
    if (!session.options) {
      session.options = true;
      msg.forEach(function callback(option) {
        $('#play').append(
          '<button class="sbtn sbtn-green mb-1 btn-block option" value="'+
          option+'">'+option+'</button>'
        );
        console.log("Added: " + option);
      });
      $('.option').click(function(event) {
        socket.emit('vote',
                {
                  name:session.name,
                  roomcode:session.roomcode,
                  option:event.currentTarget.value
                });
      });
    }
  });

})();
