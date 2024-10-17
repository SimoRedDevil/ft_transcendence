'use client';
import React from 'react'
import Login from './login/page'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { UserProvider, useUserContext} from '../components/context/usercontext'
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';

export default function Home() {
    const users = useUserContext();
    const router = useRouter();

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
            return response.data;
        } catch (error) {
            console.error('Error trying to logout:', error);
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
            justify-center
            h-screen
            flex-col
            bg-gray-800
            text-white
        '>
            hello world
            <Link href="/login">
                Login
            </Link>
            <button onClick={
                handleLogout

            }>
                log out <span>{users.username}</span>
            </button>
        </div>
    )
}