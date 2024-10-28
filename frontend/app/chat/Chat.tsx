import React, { useRef } from 'react'
import Image from "next/image";
import TextBox from '../../components/TextBox';
import { IoGameController } from "react-icons/io5";
import { RiUserForbidFill } from "react-icons/ri";
import { BsFillSendFill } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import EmojiPicker from 'emoji-picker-react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import {checkStringEmpty} from '../../utils/tools';
import { useUserContext } from '../../components/context/usercontext';
import { useChatContext } from '../../components/context/ChatContext';
import { get_human_readable_time } from '../../utils/tools';

function Chat() {
  const [showEmoji, setShowEmoji] = useState(false)
  const [input, setInput] = useState('')
  const {users, loading} = useUserContext()
  const
  {
    selectedConversation,
    otherUser,
    ws,
    messages,
    messagesLoading,
    isMobile,
    lastMessageRef
  } = useChatContext()

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleEmoji = () => {
    setShowEmoji(!showEmoji)
  }

  const handleEmojiClick = (emojiObject) => {
    setInput((prevInput) => prevInput + emojiObject.emoji)
  }

  const handleSendMessage = () => {
    if (checkStringEmpty(input)) return;
    ws.current.send(JSON.stringify({
      'conversation_id': selectedConversation.id,
      'sent_by_user': users.username,
      'sent_to_user': otherUser.username,
      'content': input
    }))
    setInput('')
  }

  if (selectedConversation === null) return;

  if (loading === true || lastMessageRef === null || messages === null) return <div>Loading...</div> ;

  return (
    <div className={`h-full lg:w-[calc(100%_-_400px)] 2xl:w-[calc(100%_-_550px)] lg:flex ${(isMobile && selectedConversation) ? 'flex' : 'hidden'}`}>
      {
        (!isMobile) &&
        <div className='flex items-center'>
          <hr className='border border-white h-[90%] border-opacity-30'></hr>
        </div>
      }

      <div className='w-full flex flex-col'>
        <div className='flex p-[20px] justify-between'>
          <div className='flex flex-row gap-3'>
            <div className='rounded-full h-[80px] w-[80px] bg-red-700'>
              {/* <Image className='rounded-full' src={data[0].image} width={60} height={60} alt='avatar'/> */}
            </div>
            <div className='flex flex-col justify-center gap-3'>
              <span className='text-[20px]'>{otherUser.full_name}</span>
              <span className='text-[18px] text-white text-opacity-65'>{otherUser.online === true ? 'Active Now' : 'Offline'}</span>
            </div>
          </div>
          <div className='w-[140px] flex gap-2'>
            <button className='cursor-pointer w-[60px] h-[60px] border border-white border-opacity-30 bg-white bg-opacity-15 hover:bg-opacity-20 rounded-full flex items-center justify-center'>
              <IoGameController className='text-white w-[30px] h-[30px]' />
            </button>
            <button className='cursor-pointer w-[60px] h-[60px] border border-white border-opacity-30 bg-white bg-opacity-15 hover:bg-opacity-20 rounded-full flex items-center justify-center'>
              <RiUserForbidFill className='text-white w-[30px] h-[30px]' />
            </button>
          </div>
        </div>
        <div className='p-[20px] h-[90%] w-full flex flex-col justify-between items-center overflow-hidden'>
          <div className='w-full h-[89%] relative'>
            <div className='h-full no-scrollbar overflow-y-auto scroll-smooth'>
              {
                messages.map((message, index) => {
                  // console.log(message.conversation_id, message.content)
                  return (
                    message.conversation_id === selectedConversation.id ?
                    <div ref={index === messages.length - 1 ? lastMessageRef : null} key={message.id} className={`flex flex-col mb-4 ${(message.sent_by_user === users.username || (message.sender !== undefined && message.sender.username === users.username)) ? 'items-end' : 'items-start'}`}>
                      <div className={`flex items-center border border-white border-opacity-20 rounded-[30px] min-h-[50px] max-w-[75%] ${(message.sent_by_user === users.username || (message.sender !== undefined && message.sender.username === users.username)) ? 'bg-[#0D161A]' : 'bg-black'}`}>
                        <span className='text-white text-opacity-90 p-[20px]'>{message.content}</span>
                      </div>
                      <div className=''>
                        <span className='text-white text-opacity-50 text-[0.8rem]'>{message.get_human_readable_time}</span>
                      </div>
                    </div> : null
                    // <div key={message.id} className={(message.sent_by_user === users.username || (message.sender !== undefined && message.sender.username === users.username)) ? 'flex flex-row-reverse' : 'flex flex-row'}>
                    //   <div className={(message.sent_by_user === users.username || (message.sender !== undefined && message.sender.username === users.username)) ? 'bg-[#0D161A]' : 'bg-black'}>
                    //     <span className='text-white text-opacity-90 p-[20px]'>{message.content}</span>
                    //   </div>
                    // </div>
                  )
                })
              }
            </div>
            <div className={(showEmoji) ? 'flex absolute top-[calc(100%_-_430px)] left-[calc(100%_-_400px)] overflow-hidden' : 'hidden'}>
              <EmojiPicker onEmojiClick={handleEmojiClick} width={400} theme='dark' emojiStyle='google' searchDisabled={false} lazyLoadEmojis={true}/>
            </div>
          </div>
          <div className='w-full h-[100px] bg-transparent flex items-center justify-center'>
            <div onKeyDown={handleKeyDown} className='flex justify-between h-[80px] w-full rounded-[30px] border border-white border-opacity-30 bg-black bg-opacity-50'>
              <TextBox input={input} onChange={(e) => setInput(e.target.value)} placeholder='Type a message...' icon={undefined} className='w-full h-full bg-transparent rounded-[30px] p-[20px]'></TextBox>
              <div className='w-[140px] flex items-center justify-center gap-3'>
                <button onClick={handleEmoji}>
                  <MdEmojiEmotions className={!showEmoji ? 'text-white text-opacity-90 w-[40px] h-[40px] hover:text-opacity-100' : 'text-[#4682B4] text-opacity-100 w-[40px] h-[40px]'} />
                </button>
                <button onClick={handleSendMessage}>
                  <BsFillSendFill className='text-white text-opacity-90 w-[35px] h-[35px] hover:text-opacity-100' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat