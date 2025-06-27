const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        const { id, displayName, emails } = profile;
        try {
            let user = await User.findOne({ googleId: id });
            if (!user) {
                user = await User.create({
                    username: displayName,
                    email: emails[0].value,
                    googleId: id
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }));

    
};
