'use client';
import React, { useEffect, useContext } from 'react';
import ScaleLoader from "react-spinners/ScaleLoader";
import "./styles/global.css";
import { usePathname, useRouter } from 'next/navigation';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { UserProvider, UserContext } from '../components/context/usercontext';

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
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <link href="https://fonts.googleapis.com/css2?family=Chelsea+Market&family=Faculty+Glyphic&family=Nabla&display=swap" rel="stylesheet" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Bona+Nova+SC:ital,wght@0,400;0,700;1,400&family=Doto:wght@100..900&display=swap" rel="stylesheet" />
                    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lilita+One&display=swap" rel="stylesheet" />
                    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Bowlby+One&family=Itim&family=Lilita+One&display=swap" rel="stylesheet" />
                    <link href="https://fonts.googleapis.com/css2?family=Faculty+Glyphic&display=swap" rel="stylesheet"></link>
                    <link href="https://fonts.googleapis.com/css2?family=Faculty+Glyphic&display=swap" rel="stylesheet"></link>

                    <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />
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
                    <Header />
                </div>
            )}

                <div className='h-[calc(100%_-_100px)] flex flex-col-reverse lg:flex-row'>
                    <div className='  xs:h-[70px] flex lg:flex-col w-full lg:w-[100px] lg:h-full lg:relative lg:right-1 xl:right-0 xl:w-[100px] rounded-md justify-center '>
                        <Sidebar/>
                    </div>
                <div className='h-auto w-full xs:h-full xs:overflow-auto lg:flex lg:justify-center lg:items-center'>
                    {children}
                </div>
            </div>

        </div>
    );
}
