require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const gratitudeRoutes=require('./routes/gratitudeRoutes');
const songRoutes = require('./routes/songRoutes');
const favouriteRoutes = require('./routes/favourites');
const journalRoutes = require('./routes/journal');

const cors = require('cors');
const User = require('./models/User'); // Import the User model

dotenv.config();
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

app.use('/api/favourites', favouriteRoutes);  // 👈 use American spelling in the route path

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // ✅ should be false to prevent empty sessions
    cookie: { secure: false, sameSite: 'lax' } // use true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport Strategies
require('./config/passportGoogle')(passport);
require('./config/passportFacebook')(passport);

// ✅ Passport Serialize & Deserialize (Missing Part)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null));
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes',recipeRoutes);
app.use('/api/gratitude', gratitudeRoutes);
app.use('/api', songRoutes);
app.use('/api/journal', journalRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.log(err));

// Server
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('Backend is working!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
