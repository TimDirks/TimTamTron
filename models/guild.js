let mongoose = require('mongoose');

let defCompl = require('./compliments.js');
let defJokes = require('./jokes.js');
let def8ball = require('./magic8ball.js');
let defFoxHunt = require('./foxHunt.js');

let guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    compliments: {
        type: [String],
        default: defCompl
    },
    jokes: {
        type: [String],
        default: defJokes
    },
    magicBall: {
        type: [String],
        default: def8ball
    },
    foxHunt: {
        type: Object,
        default: defFoxHunt
    }
});

guildSchema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
    const self = this
    self.findOne(condition, (err, result) => {
        return result ? callback(err, result) : self.create(condition, (err, result) => { return callback(err, result) })
    })
};

guildSchema.statics.resetCompliments = function resetCompliments(condition, callback) {
    this.findOneAndUpdate(condition, {compliments: defCompl}, function(err, result){
        return callback(err, result);
    })
};

guildSchema.statics.resetJokes = function resetJokes(condition, callback) {
    this.findOneAndUpdate(condition, {jokes: defJokes}, function(err, result){
        return callback(err, result);
    })
};

guildSchema.statics.reset8ball = function reset8ball(condition, callback) {
    this.findOneAndUpdate(condition, {magicBall: def8ball}, function(err, result){
        return callback(err, result);
    })
};

guildSchema.statics.resetFoxHunt = function resetFoxHunt(condition, callback) {
    this.findOneAndUpdate(condition, {foxHunt: defFoxHunt}, function(err, result){
        return callback(err, result);
    })
};

mongoose.model('Guild', guildSchema);