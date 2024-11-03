'use client';
import React, { useEffect, useContext } from 'react';
import ScaleLoader from "react-spinners/ScaleLoader";
import "./styles/global.css";
import { usePathname, useRouter } from 'next/navigation';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { UserProvider, UserContext } from '../components/context/usercontext';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const exclude = ['/login', '/twofa'];
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
    const {users, loading, isAuthenticated, fetchAuthUser } = useContext(UserContext);

    useEffect(() => {
        isAuthenticated && fetchAuthUser()
        if (isAuthenticated && pathname === '/login') {
            router.push('/');
        }
        if (!isAuthenticated && pathname === '/login')  {
            router.push('/login');
        }
    }, [isAuthenticated, pathname, router]);

    useEffect(() => {
        !isAuthenticated && fetchAuthUser();
    }
    , [pathname, router]);

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
            {!exclude.includes(pathname) &&
             (
                <div className="h-[100px]">
                    <Header />
                </div>
            )}

            <div className="h-[calc(100%_-_100px)] flex flex-col-reverse sm:flex-row">
                {!exclude.includes(pathname) && (
                    <div className="flex sm:flex-col w-full sm:w-[100px]">
                        <Sidebar />
                    </div>
                )}

                <div className="h-[calc(100%_-_100px)] w-full">
                <Toaster position="top-center" reverseOrder={false}/>
                    {children}
                </div>
            </div>
        </div>
    );
}
