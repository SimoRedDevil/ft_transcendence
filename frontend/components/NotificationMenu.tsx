import React, { useEffect } from 'react'
import { useNotificationContext } from './context/NotificationContext'
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { getCookies } from '@/components/auth';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';

function NotificationMenu() {

  const {fetchNotifications, notifications, notificationsLoading, setUpdateFriendsPage} = useNotificationContext()
  const router = useRouter()
  const [isUpdate, setIsUpdate] = useState(false)

  useEffect(() => {
    fetchNotifications()
    setIsUpdate(false)
  }, [isUpdate])

  const handleNotificationClick = (notification) => {
    if (notification.notif_type === 'friend_request') {
      router.push(`/profile/${notification.sender_info.username}`)
    }
  }

  const handleAccept = async (requestId) => {
    const body = {
        id: requestId
    }
    try {
        const cookies = await getCookies();
        const csrfToken = cookies.cookies.csrftoken;
        const response = await axios.post(`http://localhost:8000/api/friends/requests/accept-request/`, body, {
          headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        });
        if (response.status === 200) {
            toast.success(response.data)
        }
      } catch (error) {
        toast.error(error.response.data)
      }
      finally {
        setIsUpdate(true)
        setUpdateFriendsPage(true)
      }
  }

  const handleReject = async (requestId) => {
    const body = {
      id: requestId
    }
    try {
      const cookies = await getCookies();
      const csrfToken = cookies.cookies.csrftoken;
      const response = await axios.post(`http://localhost:8000/api/friends/requests/reject-request/`, body, {
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
          toast.success(response.data)
      }
    } catch (error) {
      toast.error(error.response.data)
    }
    finally {
      setIsUpdate(true)
      setUpdateFriendsPage(true)
    }
  }

  if (notificationsLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='text-white fixed w-[calc(100%_-_100px)] h-[600px] flex flex-row-reverse'>
        <div className='w-full sm:w-[500px] sm:mr-[130px] h-full bg-[#201f1f] rounded-[30px] text-white flex flex-col'>
          <div className='w-full h-[65px] flex items-center border border-white border-t-0 border-r-0 border-l-0 border-opacity-20'>
            <h1 className='text-[22px] ml-4'>Notifications</h1>
          </div>
          <div className='h-[calc(100%_-_65px)] w-full scrollbar-none overflow-y-auto scroll-smooth'>
            {notifications?.map((notification, index) => {
              return (
                <div key={index} className='w-full p-4 flex gap-3 hover:cursor-pointer hover:bg-white/5'>
                  <div className='w-[60px] h-[60px] rounded-full'>
                    <Image className='rounded-full' width={60} height={60} src={notification?.sender_info?.avatar_url} alt='user_image'></Image>
                  </div>
                  <div className='flex flex-col gap-3'>
                    <span className='text-[18px]'>{notification?.description}</span>
                    <span className='text-[15px] text-white/50'>{notification?.get_human_readable_time}</span>
                    <div className='flex gap-2'>
                      <button onClick={() => handleAccept(notification?.friend_request)} className='w-[110px] h-[45px] bg-[#436850] hover:bg-[#538264] rounded-[30px] text-[18px]'>Accept</button>
                      <button onClick={() => handleReject(notification?.friend_request)} className='w-[110px] h-[45px] bg-[#c75462] hover:bg-[#d75b69] rounded-[30px] text-[18px]'>Reject</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
    </div>
  )
}

export default NotificationMenu