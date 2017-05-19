var mysql = require('mysql');


var db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'app.js',
    database: 'shop'
});

var express = require("express")
    , morgan = require("morgan")
    , path = require("path")
    , bodyParser = require("body-parser")

    , app = express();
var qs = require('querystring');

var auth = function(req, res, next) {
    //console.log(req.session.user);
    if (req.session && req.session.user === "joe" && req.session.admin)
        return next();
    else
        return res.sendStatus(401);
};

app.use(morgan('combined'));
app.use(morgan("dev", {}));
app.use(bodyParser.json());

//app.use(morgan("dev", {}));
var cart = [];

//add to the cart & increase specific product quantities accordingly
// options, function (error, response, body
app.post("/add", function (req, res, next) {
    var obj = req.body;
    console.log("add ");
    console.log("Attempting to add to cart: " + JSON.stringify(req.body));


    var max = 0;
    var ind = 0;
    if (cart["" + obj.custId] === undefined)
        cart["" + obj.custId] = [];
    console.log("cartApp " +obj.custId);
    var c = cart["" + obj.custId];
    for (ind = 0; ind < c.length; ind++)
        if (max < c[ind].cartid)
            max = c[ind].cartid;
    var cartid = max + 1;

    var data = {
        "orderID": obj.orderID,
        "customerID": obj.custId,
        "saledate" : "22.01.2017",
        "status" : "Pending",
        "cartid": cartid,
        "productID": obj.productID, //rows[0].productID, //obj.productID,
        "name": obj.name, //rows[0].name, //obj.name,
        "price": obj.price, //rows[0].price, //obj.price,
        "image": obj.image, //rows[0].image, //obj.image,
        "quantity": obj.quantity //obj.quantity
    };
    console.log(JSON.stringify(data));

    //if product already exists in cart then add to quantity, else create new object in cart
    var found = false;
    for(var i=0; i < c.length; i++){
        if(c[i].productID == data.productID ){
            var tmpq = c[i].quantity;
            c[i].quantity = parseInt(tmpq) + parseInt(data.quantity);
            found = true;
            break;
        }
    }
    if (!found) {
        //c.push(data);
        // Add Cart items to DB here time Permitting
        //  Edit: This will add to the db but it does not update the QTY... :-(
        var query = "REPLACE INTO orders (orderid,customerID,saledate,status,cartid,productID,name,price,image,quantity)"+
        "VALUES(?, ?, ?, ?, ?, ?, ?, ? ,? ,?)";
        db.query(
            query,
            //["04","001","sdda","sdda","sdda","sdda","sdda","321","12","21"],
           [data.customerID,data.customerID,data.saledate,data.status,data.cartid,data.productID,data.name,data.price,data.image,data.quantity],
            function(err, result) {
                if (err) {
                    // 2 response is an sql error
                    res.end('{"error": "3"}');
                    console.log("sql error");
                    throw err;
                }
                //res.send(200);
            }
        );
    }

    res.status(201);

    res.send("");





});

/* toDO */
app.delete("/cart/:custId/items/:id", function (req, res, next) {
    var body = '';
    console.log("Delete item from cart: for custId " + req.url + ' ' +
        req.params.id.toString());
        var custId = req.params.custId;
        console.log(custId);
        console.log("delete ");

    // Deal with Removing the Selected item from the Cart.

   // Identify Current cart by session ID & Handle Undefined.
    if (cart["" + custId] === undefined)
        cart["" + custId] = [];

    // create a reference to the current cart in app.js
    var c = cart["" + custId];

    //  reference the Selected item in the defined cart
    console.log("Attempting to remove item # " + req.params.id);
    for (var i=0;i<c.length;i++){
        if (c[i].cartid==req.params.id)
        {
            c.splice(i,1);
        }
    }
    // Finished Dealing with deleting Selected Items
    res.send(" ");



});


app.get("/cart/:custId/items", function (req, res, next) {


    var custId = req.params.custId;
    console.log("getCart" + custId);


    console.log('custID ' + custId);


    console.log(JSON.stringify(cart["" + custId], null, 2));

    res.send(JSON.stringify(cart["" + custId]));
    console.log("cart sent");

});


var server = app.listen(process.env.PORT || 3003, function () {
    var port = server.address().port;
    console.log("App now running in %s mode on port %d", app.get("env"), port);
});
