var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');


var seats = [
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
];

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);


app.get('/', function(req, res){
res.sendFile(__dirname + "/public/ticket.html");
});

app.get('/seats', function(req, res){
res.send(seats);
});

server.listen(8080, function(){
console.log('ticket server is running on 8080');
});