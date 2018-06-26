var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userId: {
        type: String,
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