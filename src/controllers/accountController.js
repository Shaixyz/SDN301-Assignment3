const users = require('../models/user');

class accountController {

    getAllAccount(req, res, next) {
        users.find({}).then((user) => {
            res.render('account', {
                title: 'List of Users',
                users: user,
                baseURL: req.originalUrl
            });
        }).catch(next);
    }
}

module.exports = new accountController();