import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillMessage } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { BsPersonCheckFill } from "react-icons/bs";
import { getCookies } from '@/components/auth';
import axios from 'axios';
import { toast } from 'react-toastify';

type Props = {
    Url: string,
    Avatar: string,
    Description: string,
    Date: string,
    Key: string,
    NotifType: string,
    IsRead: boolean
}

const handleClick = async (notificationId) => {
  const body = {
    id: notificationId
  }
  try {
    const cookies = await getCookies();
    const csrfToken = cookies.cookies.csrftoken;
    const response = await axios.post('http://localhost:8000/api/notifications/mark-as-read/', body, {
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': csrfToken,
      },
      withCredentials: true,
    });
    if (response.status === 200) {
      
    }
  } catch (error) {
    toast.error(error.response.data)
  }
}

function NotificationElement({Url, Avatar, Description, Date, Key, NotifType, IsRead}: Props) {
  return (
    <div key={Key}>
      <Link href={Url} onClick={() => handleClick(Key)} className={`w-full ${!IsRead ? 'bg-white/5 text-white/1000' : 'text-white/60'}  p-4 flex gap-3 hover:cursor-pointer`}>
        <div className='w-[60px] h-[60px] rounded-full'>
          <Image className='rounded-full' width={60} height={60} src={Avatar} alt='user_image'></Image>
        </div>
        <div className='flex flex-col gap-3'>
          <span className='text-[18px]'>{Description}</span>
          <span className='text-[15px]'>{Date}</span>
            {/* <div className='flex gap-2'>
              <button onClick={() => handleAccept(notification?.friend_request)} className='w-[110px] h-[45px] bg-[#436850] hover:bg-[#538264] rounded-[30px] text-[18px]'>Accept</button>
              <button onClick={() => handleReject(notification?.friend_request)} className='w-[110px] h-[45px] bg-[#c75462] hover:bg-[#d75b69] rounded-[30px] text-[18px]'>Reject</button>
            </div> */}
        </div>
        {/* <div className='w-[45px] h-[45px]'>
          { NotifType === 'message' && <AiFillMessage className='text-white w-[45px] h-[45px]' /> }
          { NotifType === 'friend_request' && <FaUserFriends className='text-white w-[45px] h-[45px]' /> }
          { NotifType === 'accept_friend_request' && <BsPersonCheckFill className='text-white w-[45px] h-[45px]' /> }
        </div> */}
      </Link>
    </div>
  )
}

export default NotificationElement