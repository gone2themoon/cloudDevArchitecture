var http = require('http'),
    url = require('url');

var mysql = require('mysql');

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var sess;

var app = express();
app.use(cookieParser());
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));





var db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'app.js',
    database: 'shop'
});

var cart = [];
var theuser=null;
var theuserid =null;
var theuserStatus =null;
var theuserPassword =null;
var userName =null;
var userPass =null;

var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    var url1 = url.parse(request.url);
    var sess = request.session;

    console.log("user/app " +"path: "+path);
    console.log("user/app " +"url: "+url1)

    if (request.method == 'POST') {
        switch (path) {

            case "/logout":

                Break;

            case "/login":
                var body = '';
                console.log("user/app " +"user Login ");
                request.on('data', function (data) {
                    body += data;
                });

                request.on('end', function () {
                    var obj = JSON.parse(body);
                    console.log("user/app " +JSON.stringify(obj, null, 2));
                    var query = "SELECT * FROM Customer where name='"+obj.name+"'";
                    userName = obj.name;
                    userPass = obj.password;
                    response.writeHead(200, {
                        'Access-Control-Allow-Origin': '*'
                    });

                    db.query(
                        query,
                        [],
                        function(err, rows) {

                            if (err) {
                                response.end('{"error": "1"}');
                                throw err;
                            }
                            if (rows!=null && rows.length>0) {
                                console.log("user/app " +" user in database");
                                theuserid = rows[0].customerID;
                                theuserStatus = rows[0].status;
                                theuserPassword = rows[0].password;
                                console.log("user/app " +"User Id:" + theuserid);
                                console.log("user/app " +"User Status:" + theuserStatus);
                                console.log("user/app " +"User Password:" + theuserPassword);

                                console.log("user/app " +"obj.name: " + userName);
                                console.log("user/app " +"obj.password: " + userPass);

                                if (userPass === theuserPassword) {
                                    console.log("user/app " +userPass);
                                    console.log("user/app " +theuserPassword);
                                } else{
                                    response.end('{"error": "1"}');
                                    console.log("user/app " +" user/password not correct ");
                                    }


                                var obj = {
                                    id: theuserid,
                                    status: theuserStatus,
                                }

                                response.end(JSON.stringify(obj));
                                console.log("user/app " +obj);
                            }
                            else{
                                response.end('{"error": "1"}');
                                console.log("user/app " +" user not in database");

                            }

                        }
                    );


                });


                break;


            case "/register":
                var body = '';
                console.log("user/app " +"user Register ");
                request.on('data', function (data) {
                    body += data;
                });

                request.on('end', function () {
                    var obj = JSON.parse(body);
                    console.log("user/app " +JSON.stringify(obj, null, 2));
                    var query = "SELECT * FROM Customer where name='"+obj.name+"'";
                    response.writeHead(200, {
                        'Access-Control-Allow-Origin': '*'
                    });

                    db.query(
                        query,
                        [],
                        function(err, rows) {
                            if (err) {
                                response.end("error");
                                throw err;
                            }
                            if (rows!=null && rows.length>0) {
                                console.log("user/app " +" user already in database");
                                response.end('{"error": "2"}');
                            }
                            else{
                                query = "INSERT INTO Customer (name, password, address)"+
                                        "VALUES(?, ?, ?)";
                                db.query(
                                    query,
                                    [obj.name,obj.password,obj.address],
                                    function(err, result) {
                                        if (err) {
                                            // 2 response is an sql error
                                            response.end('{"error": "3"}');
                                            throw err;
                                        }
                                        theuserid = result.insertId;
                                        var obj = {
                                            id: theuserid
                                        }
                                        response.end(JSON.stringify(obj));

                                    }
                                );
                            }

                        }
                    );


                });


                break;
        } //switch
    }
   

});
server.listen(3001);

