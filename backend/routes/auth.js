const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendVerificationEmail = require('../utils/emailService');
require('dotenv').config();


const router = express.Router();

// ✅ Load from .env
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

// ✅ Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: `${CLIENT_URL}/dashboard`,
    failureRedirect: '/login/failed'
}));

// ✅ Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: `${CLIENT_URL}/dashboard`,
    failureRedirect: '/login/failed'
}));

// ✅ Register with Email Verification
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const token = jwt.sign({ username, email, password: hashedPassword }, JWT_SECRET, { expiresIn: '10m' });

        // Send verification email using emailService
        await sendVerificationEmail(email, username, token);

        res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// ✅ Email Verification Route
router.get('/verify/:token', async (req, res) => {
    try {
        const { username, email, password } = jwt.verify(req.params.token, JWT_SECRET);

        let user = await User.findOne({ email });
        if (user) {
            return res.redirect(`${CLIENT_URL}/manual-login?verified=already`);
        }

        user = new User({
            username,
            email,
            password,
            isVerified: true
        });

        await user.save();

        return res.redirect(`${CLIENT_URL}/manual-login?verified=true`);

    } catch (err) {
        console.error('Verification Error:', err);
        return res.redirect(`${CLIENT_URL}/manual-login?verified=false`);
    }
});

// ✅ Manual Login with Verification Check
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.password) {
            return res.status(400).json({ message: 'This email is linked to Google/Facebook login' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Login failed' });
            }
            return res.status(200).json({
                message: 'Login successful',
                user: { id: user._id, username: user.username, email: user.email }
            });
        });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Logout
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Logout failed' });
            }

            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'Logged out successfully' });
        });
    });
});

// ✅ Get Current User
router.get('/current-user', (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({ user: req.user });
    } else {
        return res.status(200).json({ user: null });
    }
});


module.exports = router;
