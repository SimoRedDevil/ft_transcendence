import React, { createContext, useContext, useState, useEffect, use } from 'react';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import path from 'path';


const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [authUser, setauthUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [try2fa, setTry2fa] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const API = process.env.NEXT_PUBLIC_API_URL;
    const fetchAuthUser = async () => {
        try {
            const response = await axios(`${API}/user/`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const user = response.data;
            setauthUser(user);
            if (user) {
                    // if (user.enabeld_2fa && !user.twofa_verified && !user.islogged)
                    //     router.push("/twofa");
                    setIsAuthenticated(true);
                }
            else {
                setIsAuthenticated(false);
                router.push('/login');
            }
            } catch (error) {
            setError(error);
            setIsAuthenticated(false);
            router.push('/login');
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    useEffect(() => {
        fetchAuthUser();
    }
    , [pathname, router, isAuthenticated, loading] );
    return (
        <UserContext.Provider value={{
                                        authUser,
                                        setauthUser,
                                        setLoading,
                                        loading,
                                        error,
                                        isAuthenticated,
                                        fetchAuthUser,
                                        setIsAuthenticated,
                                        setTry2fa,
                                        try2fa,

                                    }}>
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
