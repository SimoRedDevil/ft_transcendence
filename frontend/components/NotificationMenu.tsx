import React, { useEffect } from 'react'
import { useNotificationContext } from './context/NotificationContext'
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { getCookies } from '@/components/auth';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Link from 'next/link'
import { AiFillMessage } from "react-icons/ai";
import NotificationElement from './NotificationElement'

function NotificationMenu() {

  const {fetchNotifications, notifications, notificationsLoading} = useNotificationContext()
  const router = useRouter()
  const [isUpdate, setIsUpdate] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [isUpdate])

  useEffect(() => {
    console.log(notifications)
  }, [notifications])

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
        setIsUpdate(!isUpdate)
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
      setIsUpdate(!isUpdate)
    }
  }

  if (notificationsLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='text-white fixed w-[calc(100%_-_100px)] h-[600px] flex flex-row-reverse z-50'>
        <div className='w-full sm:w-[500px] sm:mr-[130px] h-full bg-[#201f1f] rounded-[30px] text-white flex flex-col'>
          <div className='w-full h-[65px] flex items-center border border-white border-t-0 border-r-0 border-l-0 border-opacity-20'>
            <h1 className='text-[22px] ml-4'>Notifications</h1>
          </div>
          <div className='h-[calc(100%_-_65px)] w-full scrollbar-none overflow-y-auto scroll-smooth'>
            {notifications?.map((notification, index) => {
              console.log("notif id: ", notification?.id);
              if (notification.notif_type === 'friend_request') {
                return (<NotificationElement Url='/friend-requests/' Avatar={notification?.sender_info.avatar_url} Description={notification?.description} Date={notification?.get_human_readable_time} Key={notification?.id} NotifType={notification?.notif_type} />)
              }
              else if (notification.notif_type === 'message') {
                return (<NotificationElement Url={`/chat/?username=${notification?.sender_info.username}`} Avatar={notification?.sender_info.avatar_url} Description={notification?.description} Date={notification?.get_human_readable_time} Key={notification?.id} NotifType={notification?.notif_type} />)
              }
              else if (notification.notif_type === 'accept_friend_request') {
                return (<NotificationElement Url='/friend-requests/' Avatar={notification?.sender_info.avatar_url} Description={notification?.description} Date={notification?.get_human_readable_time} Key={notification?.id} NotifType={notification?.notif_type} />)
              }
            })}
          </div>
        </div>
    </div>
  )
}

export default NotificationMenu