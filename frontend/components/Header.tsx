import React, { use } from 'react'
import Image from 'next/image'
import TextBox from './TextBox';
import Link from 'next/link';
import {UserContext, useUserContext} from './context/usercontext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import BounceLoader from "react-spinners/ClipLoader";
import { IoIosNotifications, IoIosNotificationsOutline } from 'react-icons/io';

function Header({setNotificationClicked, notificationClicked, setProfileDropDownClicked, profileDropDownClicked}) {
  const { authUser, setSearchInput, searchInput, setIsSearching} = useContext(UserContext);
  const { t } = useTranslation();

  const handleNotificationClick = () => {
    setProfileDropDownClicked(false);
    setNotificationClicked(!notificationClicked);
  }

  const handleProfileClick = () => {
    setNotificationClicked(false);
    setProfileDropDownClicked(!profileDropDownClicked);
  }

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    setIsSearching(true);
  }

  return (
    <header className='text-white flex justify-between items-center p-[10px]'>
      <div>
        <Link href='/'><Image src='/icons/logo.png' priority height={60} width={60} alt='logo'/></Link>
      </div>
      <div className='sm:w-[400px] md:w-[500px] lg:w-[600px] 2xl:w-[700px] w-[50%] h-[60px]'>
        <TextBox id='textsearch-id' onChange={(e) => handleInputChange(e)} placeholder='Search' icon='/icons/search.png' className='border border-white border-opacity-30 w-full h-full bg-black bg-opacity-50 rounded-[30px] flex items-center'/>
      </div>
      <div className='w-[170px] flex justify-between'>
        <div id='notification-id' onClick={handleNotificationClick} className={`h-[70px] w-[70px] bg-white bg-opacity-0 rounded-full flex items-center justify-center hover:bg-opacity-15 hover:cursor-pointer`}>
          {
            notificationClicked === true ? 
            <IoIosNotifications id='notification-id' className='text-white h-[50px] w-[50px]'/> : 
            <IoIosNotificationsOutline id='notification-id' className='text-white h-[50px] w-[50px]'/>
          }
        </div>
          {authUser?.avatar_url ?
          ( <Image id='profile-id' onClick={handleProfileClick} src={authUser?.avatar_url} 
            height={70} width={70} alt='avatar' className='rounded-full cursor-pointer'/> ) : (
        <div className='w-full flex justify-center items-center h-full text-white text-opacity-50 text-xs'>
          <BounceLoader color={'#949DA2'} loading={true} size={50} />
        </div>)}
      </div>
    </header>
  )
}

export default Header