var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');

var seats = [[
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
],[
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,],
],[
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
],[
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
],[
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
    [1,1,1,1,1,1,],
]
    
];

var app = express();
var server = http.createServer(app);


//public 폴더를 정적 파일로 지정해주기. (css, image 등 사용을 위해)
app.use(express.static(path.join(__dirname, 'public')));


//라우팅 -> 나중에 라우팅 따로 해주자
app.get('/', function(req, res){
    res.sendFile(__dirname + "/views/reservation/reservation.html");
});

app.get('/seats', function(req, res){ // /seats 에 상태 보내기
    res.send(seats);
});

server.listen(8080, function(){  // 8080 포트 열기
    console.log('ticket server is running on 8080');
});

var io = socketio(server); //socketio.listen(server) 하니까 오류가 발생한다. -> 왜 그런지 나중에 알아보자..
io.sockets.on('connection', function (socket) {
    socket.on('reserve', function (data) {
        seats[data.page][data.y][data.x] = 2;
        io.sockets.emit('reserve', data);
    });
});