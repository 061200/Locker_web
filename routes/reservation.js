var express = require('express');
var router = express.Router();


var fs = require('fs');
const { parse } = require('path');
var locker = fs.readFileSync(__dirname+'/../locker.json');
var lockerJSON = JSON.parse(locker);
//console.log(lockerJSON.seats);



//reservation 에서의 라우팅
router.get('/', function(req, res){
    res.render('reservation');
});

router.get('/:pageid',(req,res)=>{
    res.render('reservation',{data:req.params.pageid});
})
router.get('/seats', function(req, res){ // /seats 에 상태 보내기
    res.send(lockerJSON.seats);
});


module.exports = router;

