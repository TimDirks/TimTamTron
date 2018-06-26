var express = require('express');
var port = process.env.PORT || 5000;
var app = express();

// Mongoose database setup
var dbConfig = require('./config/database');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);
// /Mongoose database setup

const config = require("./auth.json");

require('./models/user.js');

var client = require('./bot.js');

client.login(config.token);

app.listen(port, function(){
    console.log("Server started ..!");
});