'use client';
import React from 'react';
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation';
import {UserContext} from "../components/context/usercontext";
import { useContext } from "react";

export default function Home() {
    const router = useRouter();
    const {setIsAuthenticated, fetchAuthUser, setauthUser} = useContext(UserContext);

    const getCookies = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/auth/cookies/', {
                withCredentials: true,
            });
            const csrfToken = response.data.cookies.csrftoken;
            return csrfToken;
        } catch (error) {
            router.push('/login');
        }
    };
    
    const logout = async (csrfToken) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/logout/', {}, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true,  // Ensures cookies are sent
                xsrfCookieName: 'csrftoken',  // This is the default name for the CSRF cookie in Django
                xsrfHeaderName: 'X-CSRFToken',  // This is the header Django looks for
            });
            await fetchAuthUser();
            setIsAuthenticated(false);
            setauthUser(null);
        } catch (error) {
            setIsAuthenticated(false);
            setauthUser(null);
        }
    };
    
    const handleLogout = async () => {
        const csrfToken = await getCookies(); // Fetch CSRF token
        if (csrfToken) {
            await logout(csrfToken); // Use CSRF token to logout
            router.push('/login');

        }
    };
    
    return (
        <div className='
            flex
            w-full
            justify-center
            items-center
            h-screen
            text-white
        '>
            <Link className='
            bg-gradient-to-r from-[#00A88C] to-[#004237]
            text-white
            rounded-md
            p-2
            m-2
            
            ' href="/login">
                Login
            </Link>
            <button className="
            bg-gradient-to-r from-[#00A88C] to-[#004237]
            text-white
            rounded-md
            p-2
            m-2

            "
            onClick={
                handleLogout

            }>
                log out
            </button>
            {/* <Tournament /> */}
        </div>
    )
}