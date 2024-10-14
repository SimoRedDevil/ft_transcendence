"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([null]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await axios('http://localhost:8000/api/auth/user/', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <UserContext.Provider value={{ users, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === null) {
       
    }
    return context;
};
