(function() {
    'use strict';
    var sess;

    var async = require("async"),
        express = require("express"),
        request = require("request"),
        endpoints = require("../endpoints"),
        helpers = require("../../helpers"),
        app = express(),
        cookie_name = "logged_in"

    var auth = function(req, res, next) {
        console.log("auth user\index" + req.session.user);
        if (req.session && req.session.user === "joe" && req.session.admin)
            return next();
        else
            return res.sendStatus(401);
    };


    app.get("/customers/:id", function(req, res, next) {
        helpers.simpleHttpRequest(endpoints.customersUrl + "/" + req.session.customerId, res, next);
    });
    app.get("/cards/:id", function(req, res, next) {
        helpers.simpleHttpRequest(endpoints.cardsUrl + "/" + req.params.id, res, next);
    });

    app.get("/customers", function(req, res, next) {
        helpers.simpleHttpRequest(endpoints.customersUrl, res, next);
    });
    app.get("/addresses", function(req, res, next) {
        helpers.simpleHttpRequest(endpoints.addressUrl, res, next);
    });
    app.get("/cards", function(req, res, next) {
        helpers.simpleHttpRequest(endpoints.cardsUrl, res, next);
    });

    app.post("/customers", function(req, res, next) {
        var options = {
            uri: endpoints.customersUrl,
            method: 'POST',
            json: true,
            body: req.body
        };

        console.log("user\index " + "Posting Customer: " + JSON.stringify(req.body));

        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            helpers.respondSuccessBody(res, JSON.stringify(body));
        }.bind({
            res: res
        }));
    });



    app.post("/addresses", function(req, res, next) {
        var options = {
            uri: endpoints.addressUrl,
            method: 'POST',
            json: true,
            body: req.body
        };
        console.log("user\index " + "Posting Address: " + JSON.stringify(req.body));
        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            helpers.respondSuccessBody(res, JSON.stringify(body));
        }.bind({
            res: res
        }));
    });


    app.post("/cards", function(req, res, next) {
        var options = {
            uri: endpoints.cardsUrl,
            method: 'POST',
            json: true,
            body: req.body
        };
        console.log("user\index" + "Posting Card: " + JSON.stringify(req.body));
        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            helpers.respondSuccessBody(res, JSON.stringify(body));
        }.bind({
            res: res
        }));
    });


    app.delete("/customers/:id", function(req, res, next) {
        console.log("user\index " + "Deleting Customer " + req.params.id);
        var options = {
            uri: endpoints.customersUrl + "/" + req.params.id,
            method: 'DELETE'
        };
        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            helpers.respondSuccessBody(res, JSON.stringify(body));
        }.bind({
            res: res
        }));
    });


    app.delete("/addresses/:id", function(req, res, next) {
        console.log("user\index" + "Deleting Address " + req.params.id);
        var options = {
            uri: endpoints.addressUrl + "/" + req.params.id,
            method: 'DELETE'
        };
        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            helpers.respondSuccessBody(res, JSON.stringify(body));
        }.bind({
            res: res
        }));
    });


    app.delete("/cards/:id", function(req, res, next) {
        console.log("user\index " + "Deleting Card " + req.params.id);
        var options = {
            uri: endpoints.cardsUrl + "/" + req.params.id,
            method: 'DELETE'
        };
        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            helpers.respondSuccessBody(res, JSON.stringify(body));
        }.bind({
            res: res
        }));
    });


    app.post("/register", function(req, res, next) {
        var options = {
            uri: endpoints.registerUrl,
            method: 'POST',
            json: true,
            body: req.body
        };

        console.log("user\index " +"Posting Customer: " + JSON.stringify(req.body));
        request(options, function(error, response, body) {
            if (error !== null ) {
                console.log("user\index " +"error "+JSON.stringify(error));
                return;
            }
            if (response.statusCode == 200 &&
                body != null && body != "") {
                if (body.error) {
                    console.log("user\index " + "Error with log in: ");
                    res.status(500);
                    res.end();
                    return;
                }
                console.log( "user\index " + body);
                var customerId = body.id;
                console.log("user\index " +customerId);
                req.session.customerId = customerId;
                console.log("user\index " +"set cookie" + customerId);
                res.status(200);
                res.cookie(cookie_name, req.session.id, {
                    maxAge: 3600000
                }).send({id: customerId});
                console.log("user\index " +"Sent cookies.");
                res.end();
                return;
            }
            console.log("user\index " +response.statusCode);

        });

    });

    app.post('/logout',function(req,res){
        req.session.destroy(function(err){
            if(err){
                console.log(err);
            }
            else
            {
                res.redirect('/');
            }
        });

    });



    app.post("/login", function(req, res, next) {
        var options = {
            uri: endpoints.loginUrl,
            method: 'POST',
            json: true,
            body: req.body
        };

        console.log("user\index " + "Posting Customer Regular: " + JSON.stringify(req.body));
        request(options, function(error, response, body) {
            if (error !== null ) {
                console.log("user\index " + "error "+JSON.stringify(error));
                return;
            }
            if (response.statusCode == 200 &&
                body != null && body != "") {
                //body = JSON.parse(body);
                    console.log("user\index " +'body '+JSON.stringify(body))
                if (body.error) {
                    console.log("user\index " +"Error with log in: " + body.error);
                    res.status(500);
                    res.end();
                    return;
                }
                console.log("user\index " + body);
                var customerId = body.id;
                console.log("user\index " +'cust id ' +customerId);
                req.session.customerId = customerId;
                console.log("user\index " +"set cookie " + customerId);

                if(body.status ===  "admin") {
                    req.session.admin = true;

                    console.log("user\index " +"Admin User Logged in.");
                    console.log("Show Admin Page");
                }
                else{
                    req.session.admin = false;
                    console.log("user\index " +"Customner User Logged in.");
                    console.log("Show User Page");

                }


                res.status(200);
                res.cookie(cookie_name, req.session.id, {
                    maxAge: 3600000
                }).send({id: customerId});
                console.log("Sent cookies.");
                res.end();
                return;
            }
            console.log("user\index " +response.statusCode);

        });

    });


    module.exports = app;
}());
