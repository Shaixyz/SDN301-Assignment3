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
        categories.findOne({ categoryName: categoryName })
            .then(existingCategory => {
                if (existingCategory) {
                    req.flash('error_msg', 'Category already exists');
                    return res.redirect('/categories');
                } else {
                    const newCategory = new categories({ categoryName });
                    newCategory.save()
                        .then(() => {
                            req.flash('success_msg', 'Category created successfully');
                            res.redirect('/categories');
                        })
                        .catch(next);
                }
            })
            .catch(next);
    }
    
    deleteCategory(req, res, next) {
        const { id } = req.params;
        categories.findByIdAndDelete(id)
            .then(() => {
                req.flash('success_msg', 'Category deleted successfully');
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
        const { categoryName } = req.body;
        categories.findOne({ _id: req.params.id }) 
            .then(existingCategory => {
                if (!existingCategory) {   
                    req.flash('error_msg', 'Category not found');
                    return res.redirect('/categories');
                }     
                categories.findOne({ categoryName: categoryName, _id: { $ne: req.params.id } })
                    .then(duplicateCategory => {
                        if (duplicateCategory) {                        
                            req.flash('error_msg', 'Category name already exists');
                            return res.redirect('/categories');
                        } else {                       
                            categories.updateOne({ _id: req.params.id }, req.body)
                                .then(() => {
                                    req.flash('success_msg', 'Category updated successfully');
                                    res.redirect('/categories');
                                })
                                .catch(next);
                        }
                    })
                    .catch(next);
            })
            .catch(next);
    }
    

}

module.exports = new categoryController();
