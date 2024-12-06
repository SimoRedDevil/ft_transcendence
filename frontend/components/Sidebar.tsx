"use client"
import Link from 'next/link'
import React, { use, useContext } from 'react'
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoLogoGameControllerB } from "react-icons/io";
import { GiLaurelsTrophy } from "react-icons/gi";
import { FaUser } from "react-icons/fa6";
import { IoChatbubblesSharp } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { BsList } from "react-icons/bs";
import {useRef} from "react";
import {white} from "next/dist/lib/picocolors";
import NavLink from './NavLink';
import { usePathname, useRouter } from 'next/navigation';
import { FaUserFriends } from "react-icons/fa";
import { getCookies, logout } from './auth';
import { UserContext } from './context/usercontext';

function Sidebar() {
    const pathname = usePathname();
    const chat = pathname.startsWith('/chat');
    const game = pathname.startsWith('/game');
    const profile = pathname.startsWith('/profile');
    const settings = pathname.startsWith('/settings');
    const tournament = pathname.startsWith('/tournament');
    const friendrequests = pathname === '/friend-requests';
    const router = useRouter();
    const {setIsAuthenticated, setauthUser} = useContext(UserContext);

    const handleLogout = async () => {
        const cookies = await getCookies();
        const csrfToken = cookies.cookies.csrftoken
        if (csrfToken)
            await logout(csrfToken, setIsAuthenticated, setauthUser, router);
    };
    return (
        <nav className='w-full sm:w-[100px] sm:h-full h-16 flex sm:flex-col items-center justify-around sm:justify-center sm:gap-[5%]'>
            <div className='
            flex sm:flex-col items-around justify-around sm:justify-center items-center sm:gap-[5%] w-full h-full sm:h-[80%] flex-row
            '>
            <NavLink href='/game' isActive={game}><IoLogoGameControllerB title='Game' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink>
            <NavLink href='/tournament' isActive={tournament}><GiLaurelsTrophy title='Tournament' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink>
            <NavLink href='/profile' isActive={profile}><FaUser title='Profile' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink>
            <NavLink href='/chat' isActive={chat}><IoChatbubblesSharp title='Chat' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink>
            <NavLink href='/friend-requests' isActive={friendrequests}><FaUserFriends title='Friends Requests' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] hover:text-opacity-100 transition'/></NavLink>
            <NavLink href='/settings' isActive={settings}><IoSettings title='Settings' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink>
            <button className='w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] text-white block sm:hidden' onClick={handleLogout}><RiLogoutBoxLine title='Logout' className='w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></button>
            </div>
            <button className='w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] sm:block hidden text-white' onClick={handleLogout}><RiLogoutBoxLine title='Logout' className='w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></button>
        </nav>
  )
}

export default Sidebar