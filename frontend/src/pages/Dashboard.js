import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h2 className="text-2xl font-semibold">Loading your dashboard...</h2>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h2 className="text-2xl font-semibold">Please log in first.</h2>
            </div>
        );
    }

    const cards = [
        { title: 'Journal', description: 'Write your thoughts and feelings.', route: '/journaling', image: '/images/JournalDiary.jpg' },
        { title: 'Mood Chart', description: 'Track your mood this week.', route: '/mood-tracker', image: '/images/Moodgraph.jpg' },
        { title: 'Quote of the Day', description: 'Get inspired by a daily quote.', route: '/quote', image: '/images/Sunflower.jpg' },
        { title: 'Feel-Good Recipes', description: 'Explore soothing recipes to boost your mood.', route: '/recipes', image: '/images/Recipe.jpg' },
        { title: 'Gratitude Wall', description: 'Celebrate things you are thankful for.', route: '/gratitude-wall', image: '/images/Grateful.png' },
        { title: 'Songs of the Day', description: 'Listen to mood based songs to brighten your day.', route: '/songques', image: '/images/PinkHalfHeadphone.jpg' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-orange-100">
            {/* Main Content */}
            <main className="flex-1 p-10 pt-40">
                <h1 className="text-3xl font-bold text-gray-600 mb-8">
                    Welcome, {user.username || user.displayName || 'User'}!
                </h1>

                <div className="bg-[radial-gradient(circle,_rgba(88,28,135,1)_0%,_rgba(124,58,237,1)_70%,_rgba(124,58,237,0.8)_100%)] text-white p-10 mt-20 mb-10 flex items-center justify-center text-3xl font-semibold shadow-xl shadow-purple-300/50 transition-all duration-700 rounded-xl font-bold">
                    What's your soul craving today?
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-10 gap-y-10 mt-20">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(card.route)}
                            className="cursor-pointer bg-white rounded-3xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                        >
                            <img src={card.image} alt={card.title} className="w-full h-64 object-cover" />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                                <p className="text-gray-600 mb-3">{card.description}</p>
                                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">Explore</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-purple-900 text-white py-20 w-full">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                    {/* Links */}
                    <div className="mb-4 md:mb-0 text-center md:text-left">
                        <ul className="space-y-1 text-sm flex flex-col md:flex-row md:space-x-6 md:space-y-0">
                            <li><a href="/" className="hover:text-purple-600 transition-all">Home</a></li>
                            <li><a href="/about" className="hover:text-purple-600 transition-all">About</a></li>
                            <li><a href="/contact" className="hover:text-purple-600 transition-all">Contact</a></li>
                        </ul>
                    </div>

                    {/* Personal Info */}
                    <div className="mb-4 md:mb-0 text-center">
                        <p className="font-semibold">© 2025 SoulSpace. All rights reserved.</p>
                        <p className="text-sm">Made by Lavanya Agrawal | Student, MNNIT Allahabad</p>
                        <p className="text-xs mt-1">Image Credits: Unsplash, Pexels</p>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex space-x-6 justify-center md:justify-end">
                        <a href="https://www.instagram.com/zizi._.shai/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors" aria-label="Instagram">
                            <i className="fab fa-instagram text-2xl"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/lavanya-agrawal-6614622b5/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors" aria-label="LinkedIn">
                            <i className="fab fa-linkedin text-2xl"></i>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
