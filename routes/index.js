var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');

var router = express.Router();


var seats = [[
    [1,1,1,0,1,1,1,0,1,1,],
    [1,1,1,0,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,0,0,0,1,],
    [1,1,1,1,1,1,1,1,1,0,],
    [1,1,1,1,1,0,1,1,1,1,],
],
[
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,0,1,1,],
    [1,1,1,1,1,1,0,0,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,0,1,1,1,],
    [1,1,1,1,1,1,0,0,0,1,],
],
[
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,0,],
    [0,0,1,0,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
],
[
    [1,1,1,1,1,1,],
    [1,1,1,0,1,1,],
    [1,1,0,1,0,0,],
    [1,1,1,1,0,1,],
    [0,1,1,1,0,1,],
    [1,1,1,1,1,1,],
],
[
    [1,1,0,1,1,1,],
    [1,0,0,1,1,0,],
    [1,1,0,1,1,1,],
    [0,1,0,0,0,1,],
    [1,1,1,1,1,1,],
    [1,1,1,0,1,1,],
]
    
];


//라우팅 -> 나중에 라우팅 따로 해주자
router.get('/', function(req, res){
    res.render('reservation', { title: 'Express' });
});

router.get('/seats', function(req, res){ // /seats 에 상태 보내기
    res.send(seats);
});

var app = require('../app');
var server = http.createServer(app);
var io = socketio(server); //socketio.listen(server) 하니까 오류가 발생한다. -> 왜 그런지 나중에 알아보자..



io.sockets.on('connection', function (socket) {
    socket.on('reserve', function (data) {
        seats[data.page][data.y][data.x] = 2;
        io.sockets.emit('reserve', data);
    });
});

module.exports = router;

