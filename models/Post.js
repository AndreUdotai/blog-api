const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    post: {
        type: String,
        required: true,
    },
    published: {
        type: Boolean,
        default: false,
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

// Export model
module.exports = mongoose.model('Post', PostSchema);