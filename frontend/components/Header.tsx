import React from 'react'
import Image from 'next/image'
import { FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import TextBox from './TextBox';
import Link from 'next/link';

function Header() {
  return (
    <header className='text-white flex justify-between items-center p-[10px]'>
      <div>
        <Link href='/'><Image src='/icons/logo.png' height={60} width={60} alt='logo'/></Link>
      </div>
    
      <div className='sm:w-[400px] md:w-[500px] lg:w-[600px] 2xl:w-[700px] w-[50%] h-[60px]'>
        <TextBox placeholder='Search' icon='/icons/search.png' className='border border-white border-opacity-30 w-full h-full bg-black bg-opacity-50 rounded-[30px] flex items-center'/>
      </div>

      <div className='w-[60px] h-[60px] rounded-full border border-white border-opacity-60'>
        <Image src='/images/Me.png' height={60} width={60} alt='avatar' className='rounded-full'/>
      </div>
    </header>
  )
}

export default Header