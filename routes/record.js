const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");
const mail = require("../mail");
const text = require("../textotp");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
recordRoutes.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: true });

const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "858a604b",
  apiSecret: "pH3zl01yocjMy8uC"
})



// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
    let db_connect = dbo.getDb("employees");
    db_connect
        .collection("records")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you get a list of all the users.
recordRoutes.route("/users").get(function (req, res) {
    let db_connect = dbo.getDb("employees");
    db_connect
        .collection("user")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect
        .collection("records")
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(urlencodedParser, function (req, response) {
    let db_connect = dbo.getDb();

    let myobj = {
        name: `${req.body.name}`,
        position: `${req.body.position}`,
        level: `${req.body.level}`
    };
    // console.log(myobj);
    // console.log(req.body);
    db_connect.collection("records").insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").put(urlencodedParser, function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $set: {
            name: `${req.body.name}`,
            position: `${req.body.position}`,
            level: `${req.body.level}`
        },
    };
    db_connect.collection("records").updateOne(myquery, newvalues, function (err, obj) {
        if (err) throw err;
        console.log("updated");
        response.json(obj);
    });
});

// This section will help you delete a record
recordRoutes.route("/delete/:id").delete(urlencodedParser, async (req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("records").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("deleted");
        response.json(obj);
    });
});

// verify code page
recordRoutes.route("/entercode").get(urlencodedParser, function (req, resp) {
    resp.sendFile(__dirname + "/code.html");
});

// home page
recordRoutes.route("/home").get(urlencodedParser, function (req, resp) {
    resp.sendFile(__dirname + "/home.html");
});

// verify code
recordRoutes.route("/verify").post(urlencodedParser, (req, res) => {
    // Check the code provided by the user
    vonage.verify.check(
        {
            request_id: req.header('request_id', req.body.request_id),
            code: req.body.code,
        },
        (err, result) => {
            if (err) {
                console.error(err);
            } else {
                if (result.status == 0) {
                    // User provided correct code, so create a session for that user
                    req.session.user = {
                        number: verifyRequestNumber,
                    };
                }
            }
            // Redirect to the home page
            res.redirect('/home');
            console.log("verified")
        }
    );
});



var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

// Register new users 
recordRoutes.route("/register").post(urlencodedParser, function (req, resp) {

    let db_connect = dbo.getDb();
    bcrypt.hash(req.body.password, 10, function (err, hash) {

        let myobj = {
            name: `${req.body.name}`,
            username: `${req.body.username}`,
            email: `${req.body.email}`,
            password: `${hash}`,
            phonenumber: `${req.body.phonenumber}`,
            date: date + " " + time 
        };
        // console.log(myobj);
        // console.log(req.body);
        db_connect.collection("user").insertOne(myobj, function (err, res) {
            if (err) throw err;
            // mail
            // text
            mail.mail(myobj.email)
            console.log("mail sent")
            text.text(myobj.phonenumber)
            resp.redirect('entercode');
            // resp.redirect('entercode');
            
        });

    });



});

module.exports = recordRoutes;