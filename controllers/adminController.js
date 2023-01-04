import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { ResultWithContext } from 'express-validator/src/chain';
import passport from 'passport';

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
            res.status(200).json({
                users: users
            })
        })
}

exports.adminUser_detail = (req, res, next) => {
    User.findById(req.params.id)
        .exec((err, user) => {
            if (err) {
                return next(err);
            }
            res.status(200).json({
                user: user
            })
        })
    // res.send("Hala Ronaldo!");
}

// adminUser_update_post
// adminUser_login_get
// adminUser_login_post
// adminUser_logout
// adminPost_create_post
// adminPost_list
// adminPost_update_get
// admin_update_post
// adminPost_detail
exports.adminDashboard = (req, res) => {
    res.json({
        message: "User successfully created"
    })
}
