
import Link from 'next/link'
import React, { use } from 'react'
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoLogoGameControllerB } from "react-icons/io";
import { GiLaurelsTrophy } from "react-icons/gi";
import { FaUser } from "react-icons/fa6";
import { IoChatbubblesSharp } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { BsList } from "react-icons/bs";
import {useRef} from "react";
import {white} from "next/dist/lib/picocolors";
import NavLink from './NavLink';
import { usePathname } from 'next/navigation';

function Sidebar() {
    const pathname = usePathname();
    const chat = pathname.startsWith('/chat');
    const game = pathname.startsWith('/game');
    const profile = pathname.startsWith('/profile');
    const settings = pathname.startsWith('/settings');
    const tournament = pathname.startsWith('/tournament');
    const home = pathname === '/';
    return (
        <nav className='w-full sm:w-[100px] sm:h-full h-16 flex sm:flex-col items-center justify-around sm:justify-center sm:gap-[5%]'>
            <NavLink href='/' isActive={home}><TbLayoutDashboardFilled title='dashboard' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] hover:text-opacity-100 transition'/></NavLink>
            <NavLink href='/game' isActive={game}><IoLogoGameControllerB title='game' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink>
            <NavLink href='/tournament' isActive={tournament}><GiLaurelsTrophy title='tournament' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink>
            <NavLink href='/profile' isActive={profile}><FaUser title='profile' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink>
            <NavLink href='/chat' isActive={chat}><IoChatbubblesSharp title='chat' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink>
            <NavLink href='/settings' isActive={settings}><IoSettings title='settings' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink>
        </nav>
  )
}

export default Sidebar