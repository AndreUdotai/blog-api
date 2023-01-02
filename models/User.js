const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 16,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
});

// Export model
module.exports = mongoose.model('User', UserSchema);