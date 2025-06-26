import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const loginUser = (userData) => {
        setUser(userData);
    };

    const logoutUser = () => {
        setUser(null);
    };

    // 🚀 Check if user is already logged in (session persistence)
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/current-user', { withCredentials: true });
                if (res.data.user) {
                    setUser(res.data.user);
                }
            } catch (err) {
                console.log('No active session');
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
