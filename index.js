var express = require('express');
var app = express();
var http = require('http').createServer(app);

app.use('/js',
        express.static(__dirname + '/js'));
app.use('/css',
        express.static(__dirname + '/css'));
app.use('/templates',
        express.static(__dirname + '/templates'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/html/' + 'index.html');
});

app.get('/gamemaster.html', function(req, res) {
  res.sendFile(__dirname + '/html/' + 'gamemaster.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
