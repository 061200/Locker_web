var express = require('express');
var http = require('http');
var serveStatic = require('serve-static');      //특정 폴더의 파일들을 특정 패스로 접근할 수 있도록 열어주는 역할
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
//var expressErrorHandler = require('express-error-handler');

var mySql = require('mysql');
 
//connection 은 한정되어 있어서 풀을 만들어 그 안에서 사용한다
//connection 할때도 비용이 들어감, 만들고 닫고

var pool = mySql.createPool({
    connectionLimit: 10,            //접속을 10개 만들고 10개를 재사용
    host: 'localhost',
    user:'root',
    password: 'dpwlsl0021',   //MySql 설치할때의 비번을 입력하면 됨!!
    database: 'test',
    debug: false
 
});
 
 
 
var app = express();      //express 서버 객체
app.set('port', 3000);

//app.use(serveStatic(path.join(__dirname, 'login')));


var bodyParser_post = require('body-parser');       //post 방식 파서
//post 방식 일경우 begin
//post 의 방식은 url 에 추가하는 방식이 아니고 body 라는 곳에 추가하여 전송하는 방식
app.use(bodyParser_post.urlencoded({ extended: false }));            // post 방식 세팅
app.use(bodyParser_post.json());                                     // json 사용 하는 경우의 세팅
//post 방식 일경우 end
 
 
app.use(serveStatic(path.join(__dirname)));
 

app.get('/process/login', function(_req, res) {
    res.sendFile(__dirname + '/login/login.html');
}); 
 
app.get('/process/addUser', function(_req, res) {
    res.sendFile(__dirname + '/login/signup.html');
}); 

app.get('/process/reservation', function(_req, res) {
    res.sendFile(__dirname + '/reservation/main.html');
});


//쿠키와 세션을 미들웨어로 등록한다
app.use(cookieParser());
 
//세션 환경 세팅
//세션은 서버쪽에 저장하는 것을 말하는데, 파일로 저장 할 수도 있고 레디스라고 하는 메모리DB등 다양한 저장소에 저장 할 수가 있는데
app.use(expressSession({
    secret: 'my key',           //이때의 옵션은 세션에 세이브 정보를 저장할때 할때 파일을 만들꺼냐 , 아니면 미리 만들어 놓을꺼냐 등에 대한 옵션들임
    resave: true,
    saveUninitialized: true

}));
 
 
 
 
//라우트를 미들웨어에 등록하기 전에 라우터에 설정할 경로와 함수를 등록한다
//
//라우터를 사용 (특정 경로로 들어오는 요청에 대하여 함수를 수행 시킬 수가 있는 기능을 express 가 제공해 주는것)
var router = express.Router();

router.route('/process/addUser').post(
    function (req, res)
    {
        console.log('process/addUser 호출됨');
        var paramID = req.body.id || req.query.id;
        var paramPW = req.body.passwords || req.query.passwords;
        var paramName = req.body.name || req.query.name;
        var paramEmail = req.body.email|| req.query.email;

        console.log('id:' + paramID + ', paramPW: ' + paramPW + ' ,paramName: ' + paramName + ' ,paramEmail: ' + paramEmail);
 
        addUser(paramID, paramName, paramEmail, paramPW,
            function (err, result) {
                if (err) {
                    console.log('Error!!!');
                    res.send('<script type="text/javascript">alert("에러!!");</script>');
                    res.end();
                    return;
                }
 
                if (result)
                {
                    console.dir(result);
                    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                    res.send('<script type="text/javascript">alert("가입 성공.");</script>');
                    res.write('<br><a href="./login"> re login </a>');
                    res.end();
                }
                else
                {
                    console.log('데이터베이스에 추가 에러');
                    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                    res.send('<script type="text/javascript">alert("데이터베이스 에러.");</script>');
                    res.write('<a href="./process/login"> re login</a>');
                    res.end();
                }
            }
        );
    }
);
 
 
 
router.route('/process/login').post(
    function (req, res) {
        console.log('process/login 호출됨');
        var paramID = req.body.id || req.query.id;
        var paramPW = req.body.passwords || req.query.passwords;
        console.log('paramID : ' + paramID + ', paramPW : ' + paramPW);
 
        authUser( paramID, paramPW,
            function (err, rows)
            {
                if (err) {
                    console.log('Error!!!');
                    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                    res.send('<script type="text/javascript">alert("에러 발생.");</script>');
                    res.end();
                    return;
                }
 
                if (rows) {
                    console.dir(rows);
                    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                    res.write('<h1>Login Success</h1>');
                    res.write('<br><a href="./reservation">메인 화면으로 ~ </a></br>');
                    res.write('<a href="./login"> re login</a>');
                    res.end();
 
                }
                else {
                    console.log('empty Error!!!');
                    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                    res.send('<script type="text/javascript">alert("존재하지 않는 사용자입니다.");</script>');
                    res.write('<a href="./login"> re login</a>');
                    res.end();
                }
            }
        );
    }
);
 
 
 
 
 
//라우터 미들웨어 등록하는 구간에서는 라우터를 모두  등록한 이후에 다른 것을 세팅한다
//그렇지 않으면 순서상 라우터 이외에 다른것이 먼저 실행될 수 있다
app.use('/', router);       //라우트 미들웨어를 등록한다
 
 
var addUser = function(id,name,email,passwords,callback)
{
    console.log('addUser 호출');
 
    //pool로 DB접근 함수 호출(mysql 접근)
    //conn 연결된 객체
    pool.getConnection(
        function (err, poolConn)
        {
            if (err)
            {
                if (poolConn) {
                    poolConn.release();        // 사용한후 해제(반납)한다
                }
                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디' + poolConn.threadId);
            var data = { id: id, name: name, email: email, passwords: passwords };
 
            //users 테이블에 데이터 추가
            var exec = poolConn.query('insert into users set ?', data,
                function (err, result)
                {
                    poolConn.release();
                    console.log('실행된 SQL : ' + exec.sql);
 
                    if (err) {
                        console.log('sql 실행 시 에러 발생');
                        callback(err, null);
                        return;
                    }
 
                    callback(null, result);
                }
            );
        }
    );
}
 
var authUser = function (id, password, callback) {
    console.log('input id :' + id + '  :  pw : ' + password);
 
 
    pool.getConnection(function (err, poolConn) {
        if (err) {
            if (poolConn) {
                poolConn.release();     //pool 반환처리
            }
 
            callback(err, null);
            return;
        }
 
        console.log('데이터베이스 연결 스레드 아이디' + poolConn.threadId);
 
        var tablename = 'users';
        var columns = ['id', 'name', 'email'];
 
 
        //id 와 pw 가 같은것을 조회한다
        var exec = poolConn.query("select ?? from ?? where id = ? and passwords=?", [columns, tablename, id, password],
 
            function (err, rows)
            {
                poolConn.release();     //pool 반환처리
                console.log('실행된 ssql : ' + exec.sql);
 
                if (err) {
                    callback(err, null);
                    return;
                }
 
                if (rows.length > 0) {
                    console.log('사용자 찾음');
                    callback(null, rows);
                } else {
                    console.log('사용자 찾지 못함');
                    callback(null, null);
                }
 
            }
        );
 
    }
    );
 
 
};
 
 
 
 
 
 

 
//app.use(expressErrorHandler.httpError(404));
//app.use(expressErrorHandler);
 
//웹서버를 app 기반으로 생성
var appServer = http.createServer(app);
appServer.listen(app.get('port'),
    function () {
        console.log('express 웹서버 실행' + app.get('port'));
    }
);