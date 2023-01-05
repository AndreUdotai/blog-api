import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { ResultWithContext } from 'express-validator/src/chain';
import passport from 'passport';
import async from 'async';

exports.adminUser_create_post = [
    // validate and sanitize fields.
    body('username')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Username must be specified'),
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('confirmPassword')
        .isLength({min: 1})
        .withMessage('Confirm password!')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match!'),

    // Process request after validation and sanitation.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a User object with trimmed data.
        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });

        if(!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.status(400).json({
                user: user,
                errors: errors,
            });
            return;
        } else {
            // Data from form is valid.
            // Check if a User with the same username already exists.
            User.findOne({ username: user.username }).exec(
                (err, found_username) => {
                    if (err) {
                        return next(err);
                    }

                    if (found_username) {
                        // User with same username already exist, Render form again with sanitized values/errors messages.
                        res.status(400).json({
                            user: user,
                            usernameError: "Username already exists!",
                        });
                        return;
                    } else {
                        bcrypt.hash(
                            user.password,
                            10,
                            (err, hashedPassword) => {
                                if (err) {
                                    return next(err);
                                }
                                user.password = hashedPassword;
                                user.save((err) => {
                                    if (err) {
                                        return next(err);
                                    }
                                    res.status(200).json({
                                        message: 'User created successfully',
                                        user: user
                                    })
                                });
                            },
                        );
                    }
                },
            );
        }
    },
];


exports.adminUser_list = (req, res, next) => {
    User.find({})
        .exec((err, users) => {
            if (err) {
                return next(err);
            }
            res.status(200).json(users)
        })
}

exports.adminUser_detail = (req, res, next) => {
    User.findById(req.params.id)
        .exec((err, user) => {
            if (err) {
                return next(err);
            }
            res.status(200).json(user)
        })
}

exports.adminUser_update_post = [
    //Validate and sanitize fields.
    body('username')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Username must be specified'),
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a User object with trimmed and old id.
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            // There are errors, render form again with sanitized values/error messages.
            res.status(400).json({
                user: user,
                errors: errors,
            });
            return;
        } else {
            User.findByIdAndUpdate(user._id, user, {new: true}, (err, updatedUser) => {
                if (err) {
                    return next(err);
                }
                res.status(200).json(updatedUser);
            });
        }
    }
];

exports.adminUser_login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json(req.body);
    } else {
        passport.authenticate('local', {

        })(req, res);
    }
}

exports.adminUser_logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            message: "Successfully signed out"
        })
    })
};

// POST
// title, post, published, comments, timestamp

exports.adminPost_create = [
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    body('post', 'Post must not be empty.').trim().isLength({ min: 1 }),
    
    (req, res, next) => {
        const errors = validationResult(req);

        const post = new Post({
            title: req.body.title,
            post: req.body.post,
        });

        if(!errors.isEmpty()) {
            res.status(400).json({
                post: post,
                errors: errors,
            });
            return;
        } else {
            post.save((err) => {
                if (err) {
                    return next(err);
                }
                res.status(200).json(post);
            })
        }
    }
];

exports.adminPost_list = (req, res, next) => {
    Post.find({})
        .populate('comments')
        .exec((err, posts) => {
            if (err) {
                return next(err);
            }
            res.status(200).json(posts);
        })
}

exports.adminPost_update = [
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    body('post', 'Post must not be empty.').trim().isLength({ min: 1 }),

    (req, res, next) => {
        const errors = validationResult(req);

        const post = new Post({
            title: req.body.title,
            post: req.body.post,
            published: req.body.published,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.status(400).json({
                post: post,
                errors: errors,
            });
            return;
        } else {
            Post.findByIdAndUpdate(post._id, post, {new: true}, (err, updatedPost) => {
                if (err) {
                    return next(err);
                }
                res.status(200).json(updatedPost);
            })
        }
    }
];

// adminPost_detail
exports.adminDashboard = (req, res, next) => {
    async.parallel(
        {
            post_count(callback) {
                Post.countDocuments({}, callback);
            },
            user_count(callback) {
                User.countDocuments({}, callback);
            },
            comment_count(callback) {
                Comment.countDocuments({}, callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err)
            }
            res.status(200).json(results);
        }
    )
}
