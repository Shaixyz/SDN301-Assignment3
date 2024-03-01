const orchids = require('../models/orchid')
const category = require('../models/category')

class orchidController {

    getAllOrchid(req, res, next) {
        if (req.query.search != undefined && req.query.search != '' && req.query.search != null) {
            orchids.find({ name: { $regex: req.query.search } }).then((orchid) => {
                res.render('orchids', {
                    title: 'List of Orchids',
                    orchids: orchid,
                    baseURL: req.originalUrl
                });
            }).catch(next);
        } else {
            orchids.find({}).then((orchid) => {
                res.render('orchids', {
                    title: 'List of Orchids',
                    orchids: orchid,
                    baseURL: req.originalUrl
                });
            }).catch(next);
        }
    }

    manageOrchid(req, res, next) {
        let categories = []
        category.find({}).then((category) => {
            categories.push(...category)
        }).catch(next);

        orchids.find({}).populate('category', 'categoryName').then((orchid) => {
            res.render('manageOrchid', {
                title: 'Manage Orchids',
                orchids: orchid,
                baseURL: req.originalUrl,
                categories: categories
            });
        }).catch(next);
    }

    createNewOrchid(req, res, next) {
        req.body.isNatural === 'on' ? req.body.isNatural = true : req.body.isNatural = false;

        const orchid = new orchids(req.body);
        orchids.findOne({ name: orchid.name }).then((orchidName) => {
            if (orchidName) {
                req.flash('error_msg', 'Orchid already exists');
                res.redirect('/orchids');
            } else {
                orchid.save().then(() => {
                    req.flash('success_msg', 'Orchid created successfully');
                    res.redirect('/orchids');
                }).catch(next);
            }
        }).catch(next);
    }

    deleteOrchid(req, res, next) {
        orchids.findByIdAndDelete(req.params.id).then(() => {
            req.flash('success_msg', 'Orchid deleted successfully');
            res.redirect('/orchids');
        }).catch(next);
    }

    // getOrchidById(req, res, next) {
    //     orchids.findById(req.params.id).populate('category', 'categoryName').then((orchid) => {
    //         res.render('orchidDetail', {
    //             title: orchid.name,
    //             orchid: orchid,
    //             baseURL: req.originalUrl
    //         });
    //     }).catch(next);
    // }

    getOrchidById(req, res, next) {
        orchids.findById(req.params.id)
            .populate('category', 'categoryName')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'name'
                }
            })
            .then((orchid) => {
                res.render('orchidDetail', {
                    title: orchid.name,
                    orchid: orchid,
                    baseURL: req.originalUrl
                });
            }).catch(next);
    }

    addComment(req, res, next) {
        const orchidId = req.params.id;
        const { rating, comment } = req.body;
        const userId = req.user.id; 
    
        orchids.findById(orchidId)
            .then(orchid => {
                if (!orchid) {
                    return res.status(404).render('error', { error: 'Orchid not found' });
                }
                if (orchid.comments.length > 0) {
                    req.flash('error_msg', 'Just 1 comment on an orchid');
                    return res.redirect(`/orchids/${orchidId}`);
                }
                const newComment = {
                    rating,
                    comment,
                    author: userId
                };
    
                orchid.comments.push(newComment);
                req.flash('success_msg', 'Add comment successfully');
    
                return orchid.save();
            })
            .then(orchid => {
                return res.redirect(`/orchids/${orchidId}`);
            })
            .catch(next);
    }


    getOrchidEditById(req, res, next) {
        let categories = []
        category.find({}).then((category) => {
            categories.push(...category)
        }).catch(next);

        orchids.findById(req.params.id).populate('category', 'categoryName').then((orchid) => {
            res.render('orchidEdit', {
                title: orchid.name,
                orchid: orchid,
                categories: categories,
                baseURL: req.originalUrl
            });
        }).catch(next);
    }

    updateOrchidById(req, res, next) {
        req.body.isNatural === 'on' ? req.body.isNatural = true : req.body.isNatural = false;
        orchids.findOne({ _id: { $ne: req.params.id }, name: req.body.name })
            .then(existingOrchid => {
                if (existingOrchid) {
                    req.flash('error_msg', 'This name already exists');
                    return res.redirect('/orchids');
                } else {
                    orchids.updateOne({ _id: req.params.id }, req.body)
                        .then(() => {
                            req.flash('success_msg', 'Orchid updated successfully');
                            res.redirect('/orchids');
                        })
                        .catch(next);
                }
            })
            .catch(next);
    }


    searchOrchid(req, res, next) {
        orchids.find({ name: { $regex: req.query.name } }).then((orchid) => {
            res.render('orchids', {
                title: 'List of Orchids',
                orchids: orchid,
                baseURL: req.originalUrl
            });
        }).catch(next);
    }
}

module.exports = new orchidController();