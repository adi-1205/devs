const passport = require("passport");
const { ReE } = require("../helper");

module.exports = passport.authenticate("jwt", { session: false }), (req, res, next) => {
    if (req.user) {
        return next();
    } else {
        return ReE(res, 401, "Unauthorized");
    }
}