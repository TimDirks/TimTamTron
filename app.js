require('dotenv-flow').config();

let express = require('express');
let port = process.env.PORT || 5000;
let app = express();
let http = require('http');

// Mongoose database setup
let mongoose = require('mongoose');
mongoose.connect(`mongodb://${process.env.DB_NAME}:${encodeURIComponent(process.env.DB_PASS)}@ds219641.mlab.com:19641/timtamtron`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

require('./models/user.js');
require('./models/guild.js');

let client = require('./bot.js');

app.listen(port, function(){
    console.log("Server started ..! on port " + port);
});

client.login(process.env.BOT_TOKEN);

// Keep Heroku awake
app.use('/', function (req, res){
    res.send("I'm awake!");
});
setInterval(function() {
    http.get("http://timtamtron.herokuapp.com/");
}, 900000);