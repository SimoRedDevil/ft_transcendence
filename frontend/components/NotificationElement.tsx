import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillMessage } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { BsPersonCheckFill } from "react-icons/bs";

type Props = {
    Url: string,
    Avatar: string,
    Description: string,
    Date: string,
    Key: string,
    NotifType: string,
}

function NotificationElement({Url, Avatar, Description, Date, Key, NotifType}: Props) {
  return (
    <div key={Key}>
      <Link href={Url} className='w-full p-4 flex gap-3 hover:cursor-pointer hover:bg-white/5'>
        <div className='w-[60px] h-[60px] rounded-full'>
          <Image className='rounded-full' width={60} height={60} src={Avatar} alt='user_image'></Image>
        </div>
        <div className='flex flex-col gap-3'>
          <span className='text-[18px]'>{Description}</span>
          <span className='text-[15px] text-white/50'>{Date}</span>
            {/* <div className='flex gap-2'>
              <button onClick={() => handleAccept(notification?.friend_request)} className='w-[110px] h-[45px] bg-[#436850] hover:bg-[#538264] rounded-[30px] text-[18px]'>Accept</button>
              <button onClick={() => handleReject(notification?.friend_request)} className='w-[110px] h-[45px] bg-[#c75462] hover:bg-[#d75b69] rounded-[30px] text-[18px]'>Reject</button>
            </div> */}
        </div>
        <div className='w-[45px] h-[45px]'>
          { NotifType === 'message' && <AiFillMessage className='text-white w-[45px] h-[45px]' /> }
          { NotifType === 'friend_request' && <FaUserFriends className='text-white w-[45px] h-[45px]' /> }
          { NotifType === 'accept_friend_request' && <BsPersonCheckFill className='text-white w-[45px] h-[45px]' /> }
        </div>
      </Link>
    </div>
  )
}

export default NotificationElement