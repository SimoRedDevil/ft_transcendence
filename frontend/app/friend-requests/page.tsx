'use client'

import React, { useEffect } from 'react'
import { useState } from 'react'
import { axiosInstance } from '@/utils/axiosInstance'
import { UserContext, useUserContext } from '@/components/context/usercontext'
import Image from 'next/image'
import axios from 'axios'
import { getCookies } from '../../components/auth';

function page() {
    const [friendRequests, setFriendRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { authUser, loading } = useUserContext();

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const res = await axiosInstance.get('friends/requests/')
                setFriendRequests(res.data)
            } catch (error) {
                console.log(error)
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchFriendRequests();
    }, [])

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
                console.log(response.data);
            }
          } catch (error) {
            console.log(error.response);
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
                console.log(response.data);
            }
          } catch (error) {
            console.log(error.response0);
          }
    }

    if (loading || isLoading) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <div className='border border-white/30 rounded-[30px] bg-black bg-opacity-50 w-[90%] h-[95%] flex items-center p-5'>
                    <div className='text-white text-lg'>Loading...</div>
                </div>
            </div>
        )
    }
  return (
    <div className='w-full h-full flex items-center justify-center'>
        <div className='border border-white/30 rounded-[30px] bg-black bg-opacity-50 w-[90%] h-[95%] p-5'>
            <div className='text-white text-lg'>Friend Requests</div>
            <div className='w-full h-[1px] bg-white/30 my-5'></div>
            <div className='w-full text-white gap-3'>
                {friendRequests?.map((request) => (
                    request.receiver_info.username === authUser?.username &&
                    <div key={request.id} className='flex flex-col gap-2 xs:gap-0 xs:flex-row xs:items-center xs:justify-between'>
                        <div className='flex items-center gap-2 w-full'>
                            <Image src={request.sender_info.avatar_url} alt='profile_pic' width={50} height={50} className='rounded-full' />
                            <div className='text-white text-[15px] sm:text-[20px]'>{request.sender_info.full_name}</div>
                        </div>
                        <div className='flex gap-1'>
                            <button onClick={() => handleAccept(request.id)} className='bg-[#2A9D8F] hover:bg-[#32b7a8] text-[15px] sm:text-[20px] w-[80px] sm:w-[100px] rounded-[30px] p-2'>Accept</button>
                            <button onClick={() => handleReject(request.id)} className='bg-[#c75462] hover:bg-[#db5e6c] text-[15px] sm:text-[20px] w-[80px] sm:w-[100px] rounded-[30px] p-2'>Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default page