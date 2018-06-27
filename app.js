var express = require('express');
var port = process.env.PORT || 5000;
var app = express();
var http = require('http');

// Mongoose database setup
var dbConfig = require('./config/database');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);
// /Mongoose database setup

const config = require("./auth.json");

require('./models/user.js');
require('./models/guild.js');

var client = require('./bot.js');

app.listen(port, function(){
    console.log("Server started ..! on port " + port);
});

client.login(config.token);

// Keep Heroku awake
app.use('/', function (req, res){
    res.send("I'm awake!");
});
setInterval(function() {
    http.get("http://timtamtron.herokuapp.com/");
}, 900000);