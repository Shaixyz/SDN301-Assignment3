const express = require('express');
const accountRouter = express.Router();
const { isAdmin } = require('../config/auth');

const accountController = require('../controllers/accountController');

accountRouter
.route('/')
.get(isAdmin, accountController.getAllAccount)

module.exports = accountRouter