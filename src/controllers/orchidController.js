const orchids = require('../models/orchid')
const category = require('../models/category')

class orchidController {

    getAllOrchid(req, res, next) {
        if (req.query.search != undefined && req.query.search != '' && req.query.search != null ) {
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
                res.redirect('/orchids');
                console.log('Orchid already exists');
            } else {
                orchid.save().then(() => {
                    res.redirect('/orchids');
                }).catch(next);
            }
        }).catch(next);
    }

    deleteOrchid(req, res, next) {
        orchids.findByIdAndDelete(req.params.id).then(() => {
            res.redirect('/orchids');
        }).catch(next);
    }

    getOrchidById(req, res, next) {
        orchids.findById(req.params.id).populate('category', 'categoryName').then((orchid) => {
            res.render('orchidDetail', {
                title: orchid.name,
                orchid: orchid,
                baseURL: req.originalUrl
            });
        }).catch(next);
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
        req.body.isNatural == "on" ? req.body.isNatural = true : req.body.isNatural = false;
        orchids.updateOne({ _id: req.params.id }, req.body).then(() => {
            res.redirect('/orchids');
        }).catch(next);
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