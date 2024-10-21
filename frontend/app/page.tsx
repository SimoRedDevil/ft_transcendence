'use client';
import React from 'react'
import Login from './login/page'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';
import {UserContext} from "../components/context/usercontext";
import { useContext } from "react";

export default function Home() {
    const router = useRouter();
    const {setIsAuthenticated} = useContext(UserContext);

    const getCookies = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/auth/cookies/', {
                withCredentials: true,
            });
            const csrfToken = response.data.cookies.csrftoken;
            return csrfToken;
        } catch (error) {
            console.error('Error trying to get cookies:', error);
            return null;
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
            setIsAuthenticated(false);
            return response.data;
        } catch (error) {
            console.error('Error trying to logout:', error);
            setIsAuthenticated(false);
            return null;
        }
    };
    
    const handleLogout = async () => {
        const csrfToken = await getCookies(); // Fetch CSRF token
        if (csrfToken) {
            await logout(csrfToken); // Use CSRF token to logout
            router.push('/login');

        }
    };
    
    // useEffect(() => {
    // }, [users.username]);

    return (
        <div className='
            flex
            items-center
            w-[20%]
            justify-around
            h-screen
            ml-[1000px]
            text-white
        '>
            <Link href="/login">
                Login
            </Link>
            <button onClick={
                handleLogout

            }>
                log out
            </button>
        </div>
    )
}