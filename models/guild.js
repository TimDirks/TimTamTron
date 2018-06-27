var mongoose = require('mongoose');

var defCompl = [
    "[user] I love your hairstyle!",
    "[user] you look lovely as ever!",
    "[user] I'm really glad I met you!",
    "Hey everyone, have you met this swell person [user] yet?",
    "[user] always brightens my day!",
    "I bet [user] is so magical that (s)he sweats glitter!",
    "[user] has **the cutest** elbows I've ever seen!",
    "[user] is more fun than bubble wrap!",
    "[user] is my reason to smile!",
    "Any team would be lucky to have [user] in it!",
    "This server is so much better with [user] in it!",
    "Everytime [user] talks to me, I start to blush..."
];

var guildSchema = new mongoose.Schema({
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
    }
});

guildSchema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
    const self = this
    self.findOne(condition, (err, result) => {
        return result ? callback(err, result) : self.create(condition, (err, result) => { return callback(err, result) })
})
};

mongoose.model('Guild', guildSchema);