'use client'

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
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

function Conversations() {
  
  const {authUser, loading} = useUserContext()
  const [input, setInput] = useState('')
  const
  {
    Conversations,
    fetchConversations,
    conversationsLoading,
    setSelectedConversation,
    selectedConversation,
    setConversations,
    setOtherUser,
    isMobile,
    refScroll
  } = useChatContext()
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const friendUserName = searchParams.get('username');
  
  useEffect(() => {
    if (friendUserName) {
      axiosInstance.get(`/chat/conversations/`, {
        params: {friend_username: friendUserName}
      })
      .then((response) => {
        setSelectedConversation(response.data[0])
        authUser?.username === response.data[0].user1_info.username ? setOtherUser(response.data[0].user2_info) : setOtherUser(response.data[0].user1_info)
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }, [])

  if (loading === true || conversationsLoading === true) return <div>Loading...</div> ;
  
  const scrollToLastMessage = () => {
    if (refScroll.current) {
      refScroll.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation)
    authUser?.username === conversation.user1_info.username ? setOtherUser(conversation.user2_info) : setOtherUser(conversation.user1_info)
  }

  const handleConversationSearch = (e) => {
    let search = e.target.value
    if (search.length === 0) {
      fetchConversations()
    } else {
      axiosInstance.get(`/chat/search/`, {
        params: {search: search}
      })
      .then((response) => {
        setConversations(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }

  const returnConversationImage = (conversation) => {
    let otherUser = authUser?.username === conversation.user1_info.username ? conversation.user2_info : conversation.user1_info
    return otherUser?.avatar_url
  }

  return (
    <div className={`whitespace-pre-wrap w-full h-full lg:w-[400px] 2xl:w-[550px] ${isMobile && selectedConversation ? 'hidden' : 'flex flex-col'}`}>
            <div className='h-[200px]'>
              <div className='h-[120px] flex gap-4 p-[20px]'>
                <div className='h-[80px] w-[80px] rounded-full'>
                  <Image className='rounded-full' src={authUser?.avatar_url} width={80} height={80} alt='avatar'/>
                </div>
                <div className='flex flex-col justify-center gap-4'>
                  <span className='text-[1rem]'>{authUser?.full_name}</span>
                  <span className='text-[0.9rem] text-white text-opacity-65'>{authUser?.online ? 'Online' : 'Offline'}</span>
                </div>
              </div>
              <div className='h-[100px] flex items-center justify-center'>
                <TextBox focus={false}  onChange={(e) => handleConversationSearch(e)} placeholder='Search...' icon='/icons/search.png' className='border border-white border-opacity-20 w-[95%] h-[70px] bg-white bg-opacity-10 rounded-[40px] flex items-center'></TextBox>
              </div>
            </div>
        <div className='mt-[20px] h-[calc(100%_-_270px)] no-scrollbar overflow-y-auto scroll-smooth'>
          {Conversations !== null && Conversations.map((conversation) => {
            return (
              <div onClick={() => handleConversationClick(conversation)} key={conversation.id} className={`${(selectedConversation && selectedConversation.id === conversation.id) && 'bg-white bg-opacity-10'} flex items-center gap-4 p-[20px]`}>
                <div className='h-[80px] w-[80px] rounded-full bg-blue-800'>
                  <Image className='rounded-full' src={returnConversationImage(conversation)} width={80} height={80} alt='avatar'/>
                </div>
                <div className='flex flex-col gap-4'>
                  {
                    authUser?.username === conversation.user1_info.username ?
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