"use client"

import React from 'react'
import Image from 'next/image'
import { FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import TextBox from './TextBox';
import Link from 'next/link';
import {UserContext, useUserContext} from './context/usercontext';
import { useContext } from 'react';
import { useState, useEffect } from 'react';
import BounceLoader from "react-spinners/ClipLoader";
import {usePathname} from 'next/navigation';

function Header() {
  const {users} = useContext(UserContext);

  return (
    <header className='text-white flex justify-between items-center p-[10px]'>
      <div>
        <Link href='/'><Image src='/icons/logo.png' height={60} width={60} alt='logo'/></Link>
      </div>
    
      <div className='sm:w-[400px] md:w-[500px] lg:w-[600px] 2xl:w-[700px] w-[50%] h-[60px]'>
        <TextBox placeholder='Search' icon='/icons/search.png' className='border border-white border-opacity-30 w-full h-full bg-black bg-opacity-50 rounded-[30px] flex items-center'/>
      </div>

      <div className='w-[60px] h-[60px] rounded-full border border-white border-opacity-60'>
  {users && users.avatar_url?(
      <Image 
        src={users.intra_avatar_url ? users.intra_avatar_url : users.avatar_url} 
        height={60} 
        width={60} 
        alt='avatar' 
        className='rounded-full'
      />
    ) : (
      <div className='
      w-full flex justify-center items-center h-full text-white text-opacity-50 text-xs
      '>
        <BounceLoader color={'#949DA2'} loading={true} size={50} />
      </div> // You can replace this with a placeholder image if desired
    )
  }
</div>
    </header>
  )
}

export default Header