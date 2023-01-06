const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

// Export model
module.exports = mongoose.model('Comment', CommentSchema);