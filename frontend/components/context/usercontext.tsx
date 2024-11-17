import React, { createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [authUser, setauthUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [try2fa, setTry2fa] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [signupData, setSignupData] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

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
                setIsAuthenticated(true);
                if (user.enabeld_2fa && !user.is_already_logged)
                    router.push("/twofa");
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
    , [pathname] );
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
                                        setSearchInput,
                                        searchResults,
                                        searchLoading,
                                        setSignupData,
                                        signupData,
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
// export { UserContext };
