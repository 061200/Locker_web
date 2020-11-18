var express = require('express');
var mySql = require('mysql');

var router = express.Router();

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


router.get('/login', function(_req, res) {
    res.sendFile(__dirname + '/login/login.html');
}); 
 
router.get('/addUser', function(_req, res) {
    res.sendFile(__dirname + '/login/signup.html');
}); 

router.get('/reservation', function(_req, res) {
    res.sendFile(__dirname + '/reservation/main.html');
});

router.route('/addUser').post(
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
 
 
 
router.route('/login').post(
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

module.exports = router;
