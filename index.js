var app = require('express')();
var http = require('http').createServer(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/css/style.css', function(req, res) {
  res.sendFile(__dirname + "/css/" + "style.css");
});

app.get('/js/lib/jquery-3.4.1.min.js', function(req, res) {
  res.sendFile(__dirname + "/js/lib/" + "jquery-3.4.1.min.js");
});

app.get('/gamemaster.html', function(req, res) {
  res.sendFile(__dirname + "/html/" + "gamemaster.html");
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
