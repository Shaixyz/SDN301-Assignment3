const express = require('express');
const categoryRouter = express.Router();
const { isAdmin } = require('../config/auth');

const categoryController = require('../controllers/categoryController');

categoryRouter
.route('/')
.get(isAdmin, categoryController.getAllCategory)
.post(isAdmin, categoryController.createNewCategory)

categoryRouter
.route('/delete/:id')
.get(isAdmin, categoryController.deleteCategory)

categoryRouter
.route('/:id')
.get(isAdmin, categoryController.getCategoryById)

categoryRouter
.route('/edit/:id')
.get(isAdmin, categoryController.getCategoryEditById)
.post(isAdmin, categoryController.updateCategoryById)

module.exports = categoryRouter;