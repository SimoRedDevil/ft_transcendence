'use client';
import React from 'react'
import "./styles/global.css";
import { usePathname } from 'next/navigation';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';


export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const pathname = usePathname(); 
    const exclude = ['/login', '/']
    const router = useRouter();
    const [valid, setIsValid] = useState(false);

    const validateToken = async () => {

      try {
        const response = await axios.get('http://localhost:8000/api/auth/token/', {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        setIsValid(response.data.valid);
    } catch (error) {
        console.log('Error validating token:', error.response ? error.response.data : error.message);
        if (error.response) {
        }
    }
    }

    // useEffect(() => {
    //   validateToken();
    //   if (!valid) {
    //     router.push('/login');
    //   }
    // }, []);
    return (
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com"/>
          <link href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:ital,wght@0,400;0,700;1,400;1,700&family=Share+Tech&display=swap" rel="stylesheet"/>
        </head>
        <body className='h-screen'>
          <div className='bg-main-bg border border-black w-screen h-full bg- bg-cover bg-no-repeat bg-center fixed min-w-[280px] min-h-[800px]'>
          {!exclude.includes(pathname) &&(
            <div className='h-[100px]'>
                <Header/>
            </div>)
            }
            <div className='h-[calc(100%_-_100px)] flex flex-col-reverse sm:flex-row'>
            {!exclude.includes(pathname) &&(
              <div className='flex sm:flex-col w-full sm:w-[100px]'>
                <Sidebar/>
              </div>
            )}
              <div className='h-[calc(100%_-_100px)] w-full'>
                {children}
              </div>
            </div>
          </div>
        </body>
      </html>
    )
  }