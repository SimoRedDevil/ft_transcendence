'use client';
import React, { useEffect, useContext, CSSProperties} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import "./styles/global.css";
import { usePathname, useRouter } from 'next/navigation';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { UserProvider, UserContext } from '../components/context/usercontext';


export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname(); 
    const exclude = ['/login'];
    const router = useRouter();

    const AuthProtectedLayout = () => {
        const { isAuthenticated, loading } = useContext(UserContext);

        useEffect(() => {
            if (!isAuthenticated) {
              router.push('/login');
            }
          }, [isAuthenticated, router]);
          
        // Show a loading screen until the authentication status is determined
        if (loading) {
            return <div className="
                     flex justify-center items-center h-screen w-screen bg-main-bg border
                    border-black bg-cover bg-no-repeat bg-center fixed min-w-[280px] min-h-[800px]">
                <ClipLoader color="#949DA2" loading={loading} size={70}
                 />
                </div>;
        }
        // Once loading is complete, allow rendering only if the user is authenticated
        if (!isAuthenticated && !exclude.includes(pathname)) {
            return null; // Or keep the loading spinner to prevent flashing the protected page
        }

        return (
            <div className='bg-main-bg border border-black w-screen h-full bg-cover bg-no-repeat bg-center fixed min-w-[280px] min-h-[800px]'>
                {!exclude.includes(pathname) && (
                    <div className='h-[100px]'>
                        <Header />
                    </div>
                )}
                <div className='h-[calc(100%_-_100px)] flex flex-col-reverse sm:flex-row'>
                    {!exclude.includes(pathname) && (
                        <div className='flex sm:flex-col w-full sm:w-[100px]'>
                            <Sidebar />
                        </div>
                    )}
                    <div className='h-[calc(100%_-_100px)] w-full'>
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <UserProvider>
            <html lang="en">
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@0,400;1,400&display=swap" rel="stylesheet" />
                </head>
                <body className='h-screen'>
                    <AuthProtectedLayout />
                </body>
            </html>
        </UserProvider>
    );
}
