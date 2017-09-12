var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('public_html'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public_html/index.html');
});

http.listen(3000, function(){
  console.log('Server up on *:3000');
});