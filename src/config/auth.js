module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "Please log in first!");
        res.redirect("login");
    },

    isAdmin: (req, res, next) => {
        console.log(req.user);
        if (req.isAuthenticated() && req.user.isAdmin) {
            return next();
        }
        req.flash("error", "You are not authorized to view this page!");
        res.redirect("/");
    }
}