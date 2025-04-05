const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../database/models/user.model');
const { JWT_SECRET } = require('./config');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                const user = await User.findOne({ email: jwt_payload.email });
                if (user) return done(null, user);
                return done(null, false);
            } catch (err) {
                return done(err, false);
            }
        })
    );
};
