const categories = require('../models/category');

class categoryController {

    getAllCategory(req, res, next) {
        categories.find({}).then(categories => {
            res.render('category', {
                title: 'List of Categories',
                categories: categories,
                baseURL: req.originalUrl
            });
        }).catch(next);
    }

    createNewCategory(req, res, next) {
        const { categoryName } = req.body;
        const newCategory = new categories({ categoryName });
        newCategory.save()
            .then(() => {
                res.redirect('/categories');
            }).catch(next);
    }

    deleteCategory(req, res, next) {
        const { id } = req.params;
        categories.findByIdAndDelete(id)
            .then(() => {
                res.redirect('/categories');
            }).catch(next);
    }

    getCategoryById(req, res, next) {
        const { id } = req.params;
        categories.findById(id)
            .then(category => {
                res.render('editCategory', {
                    category: category
                })
            }).catch(next);
    }

    getCategoryEditById(req, res, next) {
        const { id } = req.params;
        categories.findById(id)
            .then(category => {
                res.render('categoryEdit', {
                    title: category.categoryName,
                    category: category
                })
            }).catch(next);
    }

    updateCategoryById(req, res, next) {
        categories.updateOne({_id: req.params.id}, req.body).then(() => {
            res.redirect('/categories');
        }).catch(next);
    }

}

module.exports = new categoryController();
