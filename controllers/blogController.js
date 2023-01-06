import Post from '../models/Post';
import Comment from '../models/Comment';
import { body, validationResult } from 'express-validator';
import async from 'async';


exports.post_list = (req, res, next) => {
    Post.find({}).exec((err, posts) => {
        if (err) {
            return next(err);
        }
        res.status(200).json(posts);
    })
}

exports.post_detail = (req, res, next) => {
    async.parallel(
        {
            post(callback) {
                Post.findById(req.params.id)
                    .exec(callback);
            },
            post_comments(callback) {
                Comment.find({ post: req.params.id }, 'username email comment timestamp')
                    .exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            // Successful
            res.status(200).json({
                post: results.post,
                comments: results.post_comments,
            })
        }
    )
}

exports.comment_create = [
    body('username').trim().isLength({ min: 1 }).withMessage('Username must be specified'),
    body('email')
        .isLength({ min: 1 })
        .withMessage("email must be specified.")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("email must be in the format adam@gmail.com"),
    body('comment')
        .isLength({ min: 1 })
        .withMessage("You have not entered a comment."),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Comment object with sanitized/trimmed data
        const comment = new Comment({
            username: req.body.username,
            email: req.body.email,
            comment: req.body.comment,
            post: req.params.id,
        })

        if (!errors.isEmpty()) {
            // There are errors.
            res.status(400).json({
                comment: comment,
                errors: errors,
            });
            return;
        } else {
            comment.save((err) => {
                if (err) {
                    return next(err);
                }
                res.status(200).json(comment);
            })
        }
    }
]