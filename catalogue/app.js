var http = require('http'),
    fs = require('fs'),
    url = require('url');
var p = require('path');
var qs = require('querystring');

var mysql = require('mysql');
var root = __dirname;
var headers = [
    "Product Name", "Price", "Picture", "Buy Button"
];


var db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'app.js',
    database: 'shop'
});
var cart = [];
var theuser=null;
var theuserid =null;
var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    var url1 = url.parse(request.url);
    if (request.method == 'POST') {
        switch (path) {
            /* TODO */
            case "/newProduct":

                console.log("Entering newProduct");
                var body = '';
                request.on('data', function (data) {
                    body += data;
                });

                request.on('end', function () {
                    var product = qs.parse(body);


                    console.log('New Product added to Table.');
                    console.log(JSON.stringify(product, null, 2));

              /*      var index = 0;
                    data = [];
                    var query = "INSERT INTO products (name, price, image, quant) " +
                        "VALUES (?, ?, ?, ?)";
                    for (index = 0; index < cart.length; index++) {
                        if (index != 0)
                            query += ',';
                        query += " (?,?,?,?)";
                       // data.push(result.insertId);
                        data.push(cart[index].name);
                        data.push(cart[index].price);
                        data.push(cart[index].image);
                        data.push(cart[index].quant);
                    }
                    db.query(
                        query,
                        data,
                        function (err, result) {
                            if (err) {
                                response.end("error");
                                throw err;
                            } */
                            console.log("Exiting newProduct");
                        });
            //    });
                break;
        }
    //switch
    }

    else {
        switch (path) {


            case "/getProducts"    :
                console.log("getProducts");
                response.writeHead(200, {'Content-Type': 'text/html','Access-Control-Allow-Origin': '*' });
                var query = "SELECT * FROM products ";
                db.query(query,[],function(err, rows) {if (err) throw err;
                console.log(JSON.stringify(rows, null, 2));
                response.end(JSON.stringify(rows));
                console.log("Products sent");
                    }
                );

                break;
            case "/getProduct"    :
                console.log("getProduct");
                var body="";
                request.on('data', function (data) {
                    body += data;
                });

                request.on('end', function () {
                    var product = JSON.parse(body);
                    response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    });
                    console.log(JSON.stringify(product, null, 2));
                    var query = "SELECT * FROM products where productID="+
                        product.id;


                    db.query(
                        query,
                        [],
                        function(err, rows) {
                            if (err) throw err;
                            console.log(JSON.stringify(rows, null, 2));
                            response.end(JSON.stringify(rows[0]));
                            console.log("Products sent");
                        }
                    );

                });



                break;




        }
    }



});

server.listen(3002);
