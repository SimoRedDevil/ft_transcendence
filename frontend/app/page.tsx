'use client';
import React from 'react';
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation';
import {UserContext} from "../components/context/usercontext";
import { useContext } from "react";
import { getCookies } from '../components/auth';

export default function Home() {
    const router = useRouter();
    const {setIsAuthenticated, fetchAuthUser, setauthUser} = useContext(UserContext);

    const API = process.env.NEXT_PUBLIC_API_URL;
    const logout = async (csrfToken) => {
        try {
            const response = await axios.post(`${API}/logout/`, {}, {
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
        const cookies = await getCookies();
        const csrfToken = cookies.cookies.csrftoken
        if (csrfToken) {
            await logout(csrfToken);
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