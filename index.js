var app = require('express')();
var http = require('http').createServer(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + "/" + "style.css");
});

app.get('/jquery-3.4.1.min.js', function(req, res) {
  res.sendFile(__dirname + "/" + "jquery-3.4.1.min.js");
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
