var express = require('express');
var router = express.Router();


var fs = require('fs');
const { parse } = require('path');
var locker = fs.readFileSync(__dirname+'/../locker.json');
var lockerJSON = JSON.parse(locker);
//console.log(lockerJSON.seats);


//라우팅 -> 나중에 라우팅 따로 해주자
router.get('/', function(req, res){
    res.render('main');
});

router.get('/map', function(req, res){
    res.render('map');
});

router.get('/seats', function(req, res){ // /seats 에 상태 보내기
    res.send(lockerJSON.seats);
});


module.exports = router;

