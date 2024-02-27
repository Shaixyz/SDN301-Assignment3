const passport = require('passport')
const bcrypt = require("bcrypt");
const Accounts = require("../models/user")

const LocalStrategy = require("passport-local").Strategy;

module.exports = (passport) => {
    passport.use(
        new LocalStrategy(
            { usernameField: "username" },
            (username, password, done) => {
                Accounts.findOne({ username: username }).then((account) => {
                    if (!account) {
                        return done(null, false, { message: "Incorrect Username" })
                    }
                    bcrypt.compare(password, account.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, account, { message: "Login Success" });
                        } else {
                            return done(null, false, { message: "Incorrect Password" })
                        }
                    });
                }).catch((e) => {
                    console.log(e);
                })
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        Accounts.findById(id).then((user) => {
            done(null , user);
        });
    });

}