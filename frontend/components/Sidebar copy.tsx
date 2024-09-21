'use client';

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
<nav className='w-full   h-16 flex  items-center justify-around  z-30  lg:w-[80px] lg:h-[80%] lg:flex-col  lg:justify-center lg:gap-[5%]   phone-rounded lg:rounded-lap-rad   ' >
  <NavLink href='/dashboard' isActive={home}><TbLayoutDashboardFilled className='text-white w-[35px] h-[30px] sm:w-[40px] sm:h-[40px] lg:w-[35px]  hover:text-opacity-100 transition'/></NavLink>
  <NavLink href='/game' isActive={game}><IoLogoGameControllerB className='text-white w-[35px] h-[30px] sm:w-[40px] sm:h-[40px]  lg:w-[35px]'/></NavLink>
  <NavLink href='/tournament' isActive={tournament}><GiLaurelsTrophy className='text-white w-[35px] h-[30px] sm:w-[40px] sm:h-[40px]  lg:w-[35px]'/></NavLink>
  <NavLink href='/profile' isActive={profile}><FaUser className='text-white  w-[35px] h-[30px] sm:w-[40px] sm:h-[40px]  lg:w-[30px]'/></NavLink>
  <NavLink href='/chat' isActive={chat}><IoChatbubblesSharp className='text-white w-[35px] h-[30px] sm:w-[40px] sm:h-[40px]  lg:w-[35px]'/></NavLink>
  <NavLink href='/settings' isActive={settings}><IoSettings className='text-white w-[35px] h-[30px] sm:w-[40px] sm:h-[40px]  lg:w-[35px]'/></NavLink>
</nav>
)
}

export default Sidebar