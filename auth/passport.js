const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

import User from '../models/User';

const loginCheck = (passport) => {
    passport.use(
        new LocalStrategy((username, password, done) => {
            User.findOne({ username: username }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username' });
                }
                // Match Password
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) {
                        // passwords match! log user in
                        return done(null, user, {
                            message: 'Logged in successfully!',
                        });
                    } else {
                        // passwords do not match!
                        return done(null, false, {
                            message: 'Incorrect password',
                        });
                    }
                });
            });
        }),
    );
};

module.exports = { loginCheck };
