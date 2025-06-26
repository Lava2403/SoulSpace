// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favourites');  
const recipesRoute = require('./routes/recipes');
const songRoutes = require('./routes/songRoutes');


// App setup
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Sessions (Required for Passport)
app.use(session({
    secret: 'soulspace_secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport Configs
require('./config/passportGoogle')(passport);
require('./config/passportFacebook')(passport);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes); 
app.use('/api/recipes', recipesRoute);
app.use('/api', songRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
