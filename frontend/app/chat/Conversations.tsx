import React, { useEffect, useState } from 'react'
import Image from "next/image";
import TextBox from '../../components/TextBox';
import { axiosInstance } from '../../utils/axiosInstance';
import { cookies } from 'next/headers';
import { useUserContext } from '../../components/context/usercontext';
import { useRef } from 'react';
import { truncateMessage } from '../../utils/tools';
import { useChatContext } from '../../components/context/ChatContext';
import axios from 'axios'

function Conversations() {
  const {users, loading} = useUserContext()
  const
  {
    Conversations,
    fetchConversations,
    conversationsLoading,
    setSelectedConversation,
    selectedConversation,
    setOtherUser
  } = useChatContext()

  if (loading === true || conversationsLoading === true) return <div>Loading...</div> ;

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation)
    users.username === conversation.user1_info.username ? setOtherUser(conversation.user2_info) : setOtherUser(conversation.user1_info)
  }

  return (
    <div className='w-full h-full lg:w-[400px] 2xl:w-[550px] flex flex-col'>
            <div className='h-[200px]'>
              <div className='h-[120px] flex gap-[10px] p-[20px]'>
                <div className='h-[80px] w-[80px] rounded-full bg-blue-800'>
                  {/* <Image className='rounded-full' src='' width={60} height={60} alt='avatar'/> */}
                </div>
                <div className='flex flex-col justify-center gap-3'>
                  <span className='text-[1rem]'>{users.full_name}</span>
                  <span className='text-[0.9rem] text-white text-opacity-65'>Active Now</span>
                </div>
              </div>
              <div className='h-[100px] flex items-center justify-center'>
                <TextBox placeholder='Search...' icon='/icons/search.png' className='border border-white border-opacity-20 w-[95%] h-[70px] bg-white bg-opacity-10 rounded-[40px] flex items-center'></TextBox>
              </div>
            </div>
        <div className='mt-[20px] h-[calc(100%_-_270px)] no-scrollbar overflow-y-auto scroll-smooth'>
          {Conversations.map((conversation) => {
            return (
              <div onClick={() => handleConversationClick(conversation)} key={conversation.id} className='flex items-center gap-[10px] p-[20px] hover:bg-white hover:bg-opacity-10 cursor-pointer'>
                <div className='h-[80px] w-[80px] rounded-full bg-blue-800'>
                  {/* <Image className='rounded-full' src={conversation.image} width={60} height={60} alt='avatar'/> */}
                </div>
                <div className='flex flex-col gap-3'>
                  {
                    users.username === conversation.user1_info.username ?
                    <span className='text-[1rem]'>{conversation.user2_info.full_name}</span> :
                    <span className='text-[1rem]'>{conversation.user1_info.full_name}</span>
                  }
                  <span className='text-[0.9rem] text-white text-opacity-65'>{truncateMessage(conversation.last_message, 20)}</span>
                </div>
              </div>)
            })
          }
        </div>
    </div>
  )
}

export default Conversations