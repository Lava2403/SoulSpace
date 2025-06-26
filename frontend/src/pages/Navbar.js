import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/auth/logout', { withCredentials: true });
        alert(res.data.message);
        window.location.href = '/';  // Redirect to the login page
    } catch (err) {
        console.error(err);
        alert('Logout failed');
    }
};


    return (
        <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-70 backdrop-blur-md shadow-md z-50 flex items-center justify-between px-6 py-4">
            <h1 className="text-3xl font-bold text-purple-800">SoulSpace</h1>
            <div className="space-x-6 flex items-center">
                {!user ? (
                    <>
                        <Link to="/" className="text-gray-600 hover:text-purple-600 font-medium">Login</Link>
                        <Link to="/register" className="text-gray-600 hover:text-purple-600 font-medium">Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" className="text-gray-600 hover:text-purple-600 font-medium">Dashboard</Link>
                        <Link to="/about" className="text-gray-600 hover:text-purple-600 font-medium">About</Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-purple-800 text-white rounded hover:bg-purple-900 transition"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
