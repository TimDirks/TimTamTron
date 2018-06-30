var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    complimented: {
        type: Number,
        default: 0,
        required: true
    },
    complimenting: {
        type: Number,
        default: 0,
        required: true
    },
    joked: {
        type: Number,
        default: 0,
        required: true
    },
    rpsWin: {
        type: Number,
        default: 0,
        required: true
    },
    rpsTie: {
        type: Number,
        default: 0,
        required: true
    },
    rpsLose: {
        type: Number,
        default: 0,
        required: true
    }
});

userSchema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
    const self = this
    self.findOne(condition, (err, result) => {
        return result ? callback(err, result) : self.create(condition, (err, result) => { return callback(err, result) })
})
};

mongoose.model('User', userSchema);