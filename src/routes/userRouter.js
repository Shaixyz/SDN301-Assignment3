const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const userRouter = express.Router();

const userController = require('../controllers/userController');
const orchidController = require('../controllers/orchidController');

userRouter
.route('/')
.get(orchidController.getAllOrchid)

userRouter
.route('/profile')
.get(ensureAuthenticated,userController.profile)
.post(ensureAuthenticated,userController.updateProfile)

userRouter
.route('/profile/change-password')
.post(ensureAuthenticated,userController.changePassword)

userRouter
.route('/login')
.get(userController.formLogin)
.post(userController.login)

userRouter
.route('/register')
.get(userController.formRegister)
.post(userController.createNewAccount)

userRouter
.route('/logout')
.get(userController.logout)

module.exports = userRouter;