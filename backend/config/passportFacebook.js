const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'emails'] // Important: Ask Facebook to provide email
    }, async (accessToken, refreshToken, profile, done) => {
        const { id, displayName, emails } = profile;

        try {
            // Step 1: Check if the user with this Facebook ID already exists
            let user = await User.findOne({ facebookId: id });

            // Step 2: If not found, try to find the user by email (email may already exist from other login methods)
            if (!user && emails && emails.length > 0) {
                user = await User.findOne({ email: emails[0].value });
            }

            // Step 3: If still no user, create a new one
            if (!user) {
                let username = displayName;

                // Make sure username is unique
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    username = `${displayName}_${id.substring(0, 5)}`;
                }

                user = await User.create({
                    username,
                    email: emails ? emails[0].value : `${id}@facebook.com`, // Fallback email
                    facebookId: id
                });
            }

            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }));

    
};
