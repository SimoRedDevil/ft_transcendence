import React, { createContext, useContext, useState, useEffect, use } from 'react';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';


const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [try2fa, setTry2fa] = useState(false);
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
                    if (users.enabeld_2fa && !users.twofa_verified) {
                        router.push("/twofa");
                      }
                    setIsAuthenticated(true);
                }
                else {
                    setIsAuthenticated(false);
                    router.push('/login');
                }
            } catch (error) {
            setError(error);
            // router.push('/login');
            setIsAuthenticated(false);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 3000);
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
                    setUsers(user);
                    if (user) {
                        console.log(user);
                        if (user.enabeld_2fa && !user.twofa_verified) {
                            router.push("/twofa");
                        }
                        else {
                          setIsAuthenticated(true);
                            toast.success("login success");
                          router.push("/");
                        }
                    }
                }
            }
            } catch (error) {
                setIsAuthenticated(false);
                router.push('/login');
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
        fetchAuthUser()
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
        <UserContext.Provider value={{ users, loading, error, isAuthenticated, fetchAuthUser, setIsAuthenticated, setTry2fa, try2fa}}>
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
