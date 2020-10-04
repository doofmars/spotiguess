var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 8080;

app.use('/',
        express.static(__dirname + '/build'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/build/' + 'index.html');
});

io.on('connection', function(socket){
  console.log('connected');

  socket.on('room-code', function(roomcode) {
    console.log('A new server has been created, code:' + roomcode);
    socket.join(roomcode + '_host');
  });

  socket.on('room-code-reconnect', function(roomcode) {
    console.log('A server has reconnected, code:' + roomcode);
    socket.join(roomcode + '_host');
  });

  // msg: {roomcode:str, name:str}
  socket.on('request-join', function(msg){
    socket.leaveAll();
    console.log('Join request: ' + JSON.stringify(msg));
    //Server side validation
    if (! /^[a-z][-a-z _0-9]{0,15}$/i.test(msg.name)) {
      console.log('rejected name');
      return;
    }
    if (! /^[A-Z]{5}$/.test(msg.roomcode)) {
      console.log('rejected code');
      return;
    }
    socket.join(msg.roomcode);
    socket.to(msg.roomcode + '_host').emit('request-join', msg);
  });

  // msg: {roomcode:str, name:str}
  socket.on('join-accepted', function(msg){
    socket.to(msg.roomcode).emit('join-accepted', msg.name);
  });

  // msg: {roomcode:str, options:Set}
  socket.on('options', function(msg){
    console.log('options for room: ' + JSON.stringify(msg));
    socket.to(msg.roomcode).emit('options', msg.options);
  });

  // msg: {name:str, roomcode:str, option:str}
  socket.on('vote', function(msg){
    console.log('Player voted: ' + JSON.stringify(msg));
    socket.to(msg.roomcode + '_host').emit('vote', msg);
  });

  // msg: {roomcode:str, artist:str, title:str, voteTime:num}
  socket.on('next-song', function(msg){
    console.log('next-song: ' + JSON.stringify(msg));
    socket.to(msg.roomcode).emit('next-song', msg);
  });


  socket.on('disconnect', function(){
    console.log('disconnected');
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
