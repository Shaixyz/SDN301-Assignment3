const Accounts = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

class userController {

    formLogin(req, res, next) {
        res.render('login', {
            errors: []
        });
    }

    login(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            console.log(info)
            if (err) throw err;
            if (!user) {
                res.render('login', {
                    error: [info.message]
                });
            } else {
                req.logIn(user, (err) => {
                    if (err) throw err;
                    req.session.loggedIn = true;
                    req.flash('success_msg', 'Login success');
                    res.redirect('/');
                })
            }
        })(req, res, next);
    }

    formRegister(req, res, next) {
        res.render('register');
    }

    createNewAccount(req, res, next) {
        const { username, password, name, YOB } = req.body;
        let errorMessages = [];
    
        if (!username || !password || !name || !YOB) {
            errorMessages.push('Please enter all fields');
        }
    
        if (password.length < 6) {
            errorMessages.push('Password must be at least 6 characters');
        }
    
        Accounts.findOne({ username: username }).then(account => {
            if (account) {
                errorMessages.push('Username already exists');
            }
    
            if (errorMessages.length > 0) {
                req.flash('error_msg', errorMessages);
                return res.redirect('/register');
            } else {
                const newAccount = new Accounts({ username, password, name, YOB });
                bcrypt.hash(newAccount.password, 10, (err, hash) => {
                    if (err) throw err;
                    newAccount.password = hash;
                    newAccount.save().then(() => {
                        req.flash('success_msg', 'Register success');
                        res.redirect('/login');
                    }).catch(err => console.log(err));
                });
            }
        }).catch(err => {
            // Xử lý lỗi
            console.error(err);
            req.flash('error_msg', 'An error occurred');
            res.redirect('/register');
        });
    }
    
    
    logout(req, res, next) {
        req.session.passport.user = null;
        req.session.loggedIn = false;
        req.flash('error_msg', 'Logout success');
        res.redirect('/');
    }

    profile(req, res, next) {
        res.render('profile', {
            title: 'Profile',
            user: req.user,
            baseUrl: req.originalUrl
        });
    }

    updateProfile(req, res, next) {
        const { name, username, YOB } = req.body;
        let errors = [];

        if (!name || !username || !YOB) {
            errors.push({ msg: 'Please enter all fields' });
        }

        if (errors.length > 0) {
            res.render('profile', { errors });
        } else {
            //Keep same information
            Accounts.findById(req.user._id).then((account) => {
                if (account.name === name && account.username === username && account.YOB == YOB) {
                    res.redirect('/profile');
                }else{
                    Accounts.updateOne({ _id: req.user._id }, req.body).then(() => {
                        req.flash('success_msg', 'Update profile success');
                        res.redirect('/profile');
                    }).catch(next);
                }
            }).catch(next);
        }
    }

    changePassword(req, res, next) {
        let errors = [];
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            errors.push({ msg: 'Please enter all fields' });
        }

        if (newPassword.length < 6) {
            errors.push({ msg: 'Password must be at least 6 characters' });
        }

        if (newPassword != confirmNewPassword) {
            errors.push({ msg: 'Password confirmation does not match password' });
        }

        if (errors.length > 0) {
            req.flash('errorPassword', errors);
            res.redirect('/profile');
        } else {
            Accounts.findById(req.user._id).then((account) => {
                bcrypt.compare(oldPassword, account.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        bcrypt.hash(newPassword, 10, (err, hash) => {
                            if (err) throw err;
                            Accounts.updateOne({ _id: req.user._id }, { password: hash }).then(() => {
                                req.flash('successPassword_msg', 'Change password success');
                                res.redirect('/profile');
                            }).catch(next);
                        });
                    } else {
                        req.flash('errorPassword_msg', 'Password incorrect');
                        res.redirect('/profile');
                    }
                });
            }).catch(next);
        }
    }

}

module.exports = new userController;