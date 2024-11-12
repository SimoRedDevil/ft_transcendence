'use client';
import React, { useEffect, useContext } from 'react';
import ScaleLoader from "react-spinners/ScaleLoader";
import "./styles/global.css";
import { usePathname, useRouter } from 'next/navigation';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { UserProvider, UserContext } from '../components/context/usercontext';
import NotificationMenu from '../components/NotificationMenu';
import DropDown from '../components/DropDown';
import { useState } from 'react';
import Image from 'next/image';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const exclude = ['/login'];
    const router = useRouter();

    return (
        <UserProvider>
            <html lang="en">
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                </head>
                <body className="h-screen">
                    <AuthProtectedLayout pathname={pathname} exclude={exclude} router={router}>
                        {children}
                    </AuthProtectedLayout>
                </body>
            </html>
        </UserProvider>
    );
}

function AuthProtectedLayout({ children, pathname, exclude, router }: any) {
    const {users, loading, isAuthenticated, fetchAuthUser, searchResults, searchLoading, setIsSearching, isSearching} = useContext(UserContext);
    const [notificationClicked, setNotificationClicked] = useState(false);
    const [profileDropDownClicked, setProfileDropDownClicked] = useState(false);

    // Handle redirection based on authentication
    useEffect(() => {
        isAuthenticated && fetchAuthUser()
        if (isAuthenticated && exclude.includes(pathname)) {
            router.push('/');
        }
        if (!isAuthenticated && exclude.includes(pathname)) {
            router.push('/login');
        }
    }, [isAuthenticated, pathname, router]);

    useEffect(() => {
        !isAuthenticated && fetchAuthUser();
    }
    , [pathname, router]);

    const handleDocumentClick = (e: any) => {
        if (e.target.id !== 'notification-id') {
            setNotificationClicked(false);
        }
        if (e.target.id !== 'profile-id') {
            setProfileDropDownClicked(false);
        }
        if (e.target.id !== 'textsearch-id') {
            console.log(isSearching);
            setIsSearching(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen bg-main-bg border
                border-black bg-cover bg-no-repeat bg-center fixed min-w-[280px] min-h-[800px]">
                <ScaleLoader color="#949DA2" loading={loading} height={40} width={6} />
            </div>
        );
    }

    return (
        <div className="bg-main-bg border border-black w-screen h-full bg-cover bg-no-repeat bg-center fixed min-w-[280px] min-h-[800px]">
            {/* Render Header if pathname is not in exclude list */}
            {!exclude.includes(pathname) && (
                <div className="h-[100px]">
                    <Header setNotificationClicked={setNotificationClicked} notificationClicked={notificationClicked} setProfileDropDownClicked={setProfileDropDownClicked} profileDropDownClicked={profileDropDownClicked} />
                </div>
            )}

            <div className="h-[calc(100%_-_100px)] flex flex-col-reverse sm:flex-row">
                {/* Render Sidebar if pathname is not in exclude list */}
                {!exclude.includes(pathname) && (
                    <div className="flex sm:flex-col w-full sm:w-[100px]">
                        <Sidebar />
                    </div>
                )}
                
                <div className="h-[calc(100%_-_100px)] w-full">
                    {
                        (isAuthenticated && isSearching) && (
                            <div className='fixed left-0 flex items-center justify-center w-full h-[600px] text-white'>
                                <div className='border border-white/40 ml-[-100px] w-[50%] sm:w-[400px] md:w-[500px] lg:w-[600px] 2xl:w-[700px] h-full bg-black bg-opacity-80 rounded-[30px]'>
                                    <div className='border-b border-white/40 p-4'>
                                        <span className='text-white text-[20px]'>Search Results</span>
                                    </div>
                                    {searchLoading && <div/>}
                                    {searchResults.map((user: any) => (
                                        <div key={user.id} className='w-full p-4 flex gap-3 items-center hover:bg-white hover:bg-opacity-10 hover:cursor-pointer'>
                                            <div className='w-[50px] h-[50px] rounded-full bg-green-800'>
                                                <Image src={user.avatar_url} height={50} width={50} alt='avatar' className='rounded-full' />
                                            </div>
                                            <span>{user.full_name}</span>
                                        </div>
                                    ))} 
                                </div>
                            </div>
                        )
                    }
                    {(isAuthenticated && notificationClicked) && <NotificationMenu />}
                    {
                        (isAuthenticated && profileDropDownClicked) &&
                        <div className='w-[calc(100%_-_100px)] fixed h-[170px] flex flex-row-reverse'>
                            <DropDown className='w-[250px] h-[50px] flex items-center border border-white border-opacity-20 cursor-pointer hover:bg-white hover:bg-opacity-10' items={['View Profile', 'Friend Requests', 'Logout']} />
                        </div>
                    }
                    {children}
                </div>
            </div>
        </div>
    );
}
