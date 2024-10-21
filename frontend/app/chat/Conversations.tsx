import React, { useEffect, useState } from 'react'
import Image from "next/image";
import TextBox from '../../components/TextBox';
import { axiosInstance } from '../../utils/axiosInstance';
import { cookies } from 'next/headers';
import { useUserContext } from '../../components/context/usercontext';
import { useRef } from 'react';
import { truncateMessage } from '../../utils/tools';
import axios from 'axios'

function Conversations({setSelectedConversation, setOtherUser, lastMessageRef}) {
  const [conversations, setConversations] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [conversationIsSelected, setConversationIsSelected] = useState(false)
  const [messageOwner, setMessageOwner] = useState(null)
  const user = useUserContext()

  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/chat/conversations/', {
          withCredentials: true,
          headers: {
              'Content-Type': 'application/json',
          },
      });
      setConversations(response.data)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  if (isLoading || user === null || user.users === null) return <div>Loading...</div> ;

  function handleConversationClick(conversationID) {
      let conversation = conversations.find(conversation => conversation.id === conversationID)
      setOtherUser(conversation.user1_info.username === user.users.username ? conversation.user2_info : conversation.user1_info)
      setSelectedConversation(conversationID)
      setConversationIsSelected(true)
  }

  return (
    <div className='w-full h-full lg:w-[400px] 2xl:w-[550px] flex flex-col'>
            <div className='h-[200px]'>
              <div className='h-[120px] flex gap-[10px] p-[20px]'>
                <div className='h-[80px] w-[80px] rounded-full bg-blue-800'>
                  {/* <Image className='rounded-full' src='' width={60} height={60} alt='avatar'/> */}
                </div>
                <div className='flex flex-col justify-center gap-3'>
                  <span className='text-[1rem]'>{user.users.full_name}</span>
                  <span className='text-[0.9rem] text-white text-opacity-65'>Active Now</span>
                </div>
              </div>
              <div className='h-[100px] flex items-center justify-center'>
                <TextBox placeholder='Search...' icon='/icons/search.png' className='border border-white border-opacity-20 w-[95%] h-[70px] bg-white bg-opacity-10 rounded-[40px] flex items-center'></TextBox>
              </div>
            </div>
        <div className='mt-[20px] h-[calc(100%_-_270px)] no-scrollbar overflow-y-auto scroll-smooth'>
          {!conversations || conversations.length === 0 ? (
            <div className='text-white text-opacity-60 text-[1rem] text-center flex flex-col items-center justify-center gap-4 h-full'>
               <div className='h-[100px] w-[100px] rounded-full'>
                <Image className='rounded-full' src='/icons/sleep.png' width={100} height={100} alt='avatar'/>
               </div>
               <span className='text-[22px]'>No conversations</span>
            </div>) : <div>
            {conversations.map((conversation) => (
              <div key={conversation.id} onClick={() => handleConversationClick(conversation.id)} className={`h-[120px] flex items-center gap-4 p-[20px] hover:bg-white hover:bg-opacity-10 cursor-pointer ${conversationIsSelected && 'bg-white bg-opacity-10'}`}>
                <div className='h-[80px] w-[80px] rounded-full bg-blue-800'>
                  {/* <Image className='rounded-full' src='' width={50} height={50} alt='avatar'/> */}
                </div>
                <div className='flex flex-col gap-3'>
                  {
                    conversation.user1_info.username === user.users.username ? <span className='text-[1rem]'>{conversation.user2_info.full_name}</span> : <span className='text-[1rem]'>{conversation.user1_info.full_name}</span>
                  }  
                  <span ref={lastMessageRef} className='text-[0.9rem] text-white text-opacity-65'>{truncateMessage(conversation.last_message, 50)}</span>
                </div>
              </div>
            ))}
            </div>
          }
        </div>
    </div>
  )
}

export default Conversations