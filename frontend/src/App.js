import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './pages/Navbar';
import Register from './pages/Register';
import ManualLogin from './pages/ManualLogin';
import Welcome from './pages/Welcome';
import Journaling from './pages/Journaling';
import MoodTracker from './pages/MoodTracker';
import QuoteOfTheDay from './pages/QOTD';
import FavouriteQuotes from './pages/FavouriteQuotes';
import FeelGoodRecipes from './pages/FeelGoodRecipes';
import GratitudeWall from './pages/GratitudeWall';
import SongQues from './pages/SongQues';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-white to-blue-200 bg-fixed bg-cover">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/manual-login" element={<ManualLogin />} />
          <Route path="/journaling" element={<Journaling />} />
          <Route path="/mood-tracker" element={<MoodTracker />} />
          <Route path="/quote" element={<QuoteOfTheDay />} />
          <Route path="/favourites" element={<FavouriteQuotes />} />
          <Route path="/recipes" element={<FeelGoodRecipes />} />
          <Route path="/gratitude-wall" element={<GratitudeWall />} />
          <Route path="/songques" element={<SongQues />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
