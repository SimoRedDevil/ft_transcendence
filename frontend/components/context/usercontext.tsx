import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await axios('http://localhost:8000/api/auth/user/', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const user = response.data;
            setUsers(user);
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [users]);

    return (
        <UserContext.Provider value={{ users, loading, error, isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === null) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};



// Export the UserContext directly for access in components
export { UserContext };
