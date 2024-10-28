import React, { createContext, useContext, useState, useEffect, use } from 'react';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { useParams } from 'react-router-dom';


const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [try2fa, setTry2fa] = useState(false);
    const [code, setCode] = useState(null);
    const pathname = usePathname();
    const router = useRouter();

    const fetchAuthUser = async () => {
        try {
            const response = await axios('http://localhost:8000/api/auth/user/', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const user = response.data;
            // while (user || !user) {
            //     await new Promise((resolve) => setTimeout(resolve, 1000));
            // }
            setUsers(user);
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                // router.push('/login');
            }
        } catch (error) {
            setError(error);
            setIsAuthenticated(false);
            // router.push('/login');
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };

    useEffect(() => {
        console.log("location: ", );
}, []);


    const caallBack42 = async () => {
        setCode(window.location.search.split('code=')[1])
        const param = useParams();

        try {
            const response = await axios('http://localhost:8000/api/auth/42/callback/', {
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
            setError(error);
            setIsAuthenticated(false);
        }
    }


    // const  verifyToken = async () => {
    //     try {
    //         const response = await axios('http://localhost:8000/api/auth/verify/', {
    //             withCredentials: true,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Token': users.access
    //             },
    //         });
    //     } 
    //     catch (error) {
    //         setError(error);
    //         setIsAuthenticated(false);
    //         router.push('/login');
    //     }
    // }
    useEffect(() => {
    //    console.log("", code);
    }
    , [pathname, users && router]);

    useEffect(() => {
        fetchAuthUser();
    }, [pathname, users && router]);
    
    return (
        <UserContext.Provider value={{ users, loading, error, isAuthenticated, fetchAuthUser, setIsAuthenticated, setTry2fa, try2fa }}>
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
