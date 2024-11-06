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


    const fetchAuthUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/auth/user/', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const user = response.data;
            setauthUser(user);
            if (user) {
                    if (authUser.enabeld_2fa && !authUser.twofa_verified && authUser.islogged)
                        router.push("/twofa");
                    setIsAuthenticated(true);
                }
            } catch (error) {
            setError(error);
            setIsAuthenticated(false);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2500);
        }
    };

    const caallBack42 = async () => {
        try {
            const urls = new URLSearchParams(window.location.search);
            const error = urls.get('error');
            error && router.push('/login')
            const code = urls.get('code');
            if (code) 
            {
                const response = await axios.get(`http://localhost:8000/api/auth/42/callback/?code=${code}`,
                {
                    withCredentials: true
                });
                if (response.status === 200) {
                    const user = response.data;
                    setauthUser(user);
                    if (user) {
                        if (user.enabeld_2fa && !user.twofa_verified) {
                            router.push("/twofa");
                        }
                        else {
                          setIsAuthenticated(true);
                        setTimeout(() => {
                            toast.success("login success");
                        }, 2000);
                          router.push("/");
                        }
                    }
                    else {
                        setIsAuthenticated(false);
                    }
                }
            }
            } catch (error) {
                setIsAuthenticated(false);
            }
        }

        function useUserActivityTracker(callback, inactivityTimeout = 10000) {
            if (typeof window === 'undefined') return; // Ensure this runs only in the browser
          
            let inactivityTimer;
          
            // Reset the timer function, called on each user activity
            const resetTimer = () => {
              clearTimeout(inactivityTimer); 
              inactivityTimer = setTimeout(() => {
                callback('user is inactive');
              }, inactivityTimeout);
            };

            const activityHandler = (event) => {
              callback(event); // Trigger the callback with the event
              resetTimer();    // Reset the inactivity timer
            };
          
            // Set up the event listeners to track user activity
            window.addEventListener('keydown', activityHandler);
            window.addEventListener('mousemove', activityHandler);
            window.addEventListener('mousedown', activityHandler);
            window.addEventListener('click', activityHandler);
          
            resetTimer();
          
            return () => {
              clearTimeout(inactivityTimer); // Clear the inactivity timer on cleanup
              window.removeEventListener('keydown', activityHandler);
              window.removeEventListener('mousemove', activityHandler);
              window.removeEventListener('mousedown', activityHandler);
              window.removeEventListener('click', activityHandler);
            };
          }
          
          // Example usage
        //   const stopTracking = useUserActivityTracker((event) => {
        //     if (event === 'user is inactive') {
        //       console.log("User has been inactive for 10 seconds.");
        //     } else {
        //       console.log("User activity detected:", event.type);
        //     }
        //   }, 10000);
          
          // Call stopTracking() to remove the event listeners and stop the tracking if needed
          
    useEffect(() => {
        caallBack42();
    }
    , [pathname, router] );
    
    useEffect(() => {
        fetchAuthUser();
        // useUserActivityTracker((event) => {
        //     if (event === 'user is inactive') {
        //       console.log("User has been inactive for 10 seconds.");
        //     } else {
        //       console.log("User activity detected:", event.type);
        //     }
        //   }
        // );
    }
    , [pathname, router, isAuthenticated, loading] );
    return (
        <UserContext.Provider value={{ authUser, setauthUser, loading, error, isAuthenticated, fetchAuthUser, setIsAuthenticated, setTry2fa, try2fa}}>
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
