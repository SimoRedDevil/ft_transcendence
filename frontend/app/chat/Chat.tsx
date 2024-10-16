import React from 'react'
import Image from "next/image";
import TextBox from '../../components/TextBox';
import { IoGameController } from "react-icons/io5";
import { RiUserForbidFill } from "react-icons/ri";
import { BsFillSendFill } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

type ChatProps = {
  conversationID: any
}

function Chat({conversationID}: ChatProps) {
  const [showEmoji, setShowEmoji] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleEmoji = () => {
    setShowEmoji(!showEmoji)
  }

  const handleEmojiClick = (emojiObject) => {
    setInput((prevInput) => prevInput + emojiObject.emoji)
  }

  const fetchMessages = async (conversationID) => {
    try {
      const response = await axios.get('http://localhost:8000/api/chat/messages/', {
          withCredentials: true,
          headers: {
              'Content-Type': 'application/json',
          },
          params: {
            conversation_id: conversationID
          }
      });
      setMessages(response.data)
      console.log(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMessages(conversationID)
  }, [conversationID])

  if (isLoading) return <div></div>;

  return (
    <div className='lg:w-[calc(100%_-_400px)] 2xl:w-[calc(100%_-_550px)] hidden lg:flex'>
      <div className='flex items-center'>
        <hr className='border border-white h-[90%] border-opacity-30'></hr>
      </div>
      <div className='w-full flex flex-col'>
        <div className='flex p-[20px] justify-between'>
          <div className='flex flex-row gap-3'>
            <div className='rounded-full h-[60px] w-[60px] bg-red-700'>
              {/* <Image className='rounded-full' src={data[0].image} width={60} height={60} alt='avatar'/> */}
            </div>
            <div className='flex flex-col'>
              <span className='text-[1rem]'>{messages[0].receiver_info.full_name}</span>
              <span className='text-[0.9rem] text-white text-opacity-65'>Active now</span>
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
        <div className='p-[20px] h-full w-full flex flex-col justify-between items-center'>
          <div className='w-full h-[calc(100%_-_120px)] relative'>
            <div className='h-full border'>
              {
                messages.map((message) => (
                    <div key={message.id} className='flex flex-col gap-20'>
                        <div className='border'>
                            <span className='text-white text-opacity-60 text-[0.9rem]'>{message.content}</span>
                        </div>
                    </div>
                ))
              }
            </div>
            <div className={(showEmoji) ? 'flex absolute top-[calc(100%_-_430px)] left-[calc(100%_-_400px)] overflow-hidden' : 'hidden'}>
              <EmojiPicker onEmojiClick={handleEmojiClick} width={400} theme='dark' emojiStyle='google' searchDisabled={false} lazyLoadEmojis={true}/>
            </div>
          </div>
          <div className='flex justify-between h-[80px] w-full rounded-[30px] border border-white border-opacity-30 bg-black bg-opacity-50'>
            <TextBox input={input} onChange={(e) => setInput(e.target.value)} placeholder='Type a message...' icon={undefined} className='w-full h-full bg-transparent rounded-[30px] p-[20px]'></TextBox>
            <div className='w-[140px] flex items-center justify-center gap-3'>
              <button onClick={handleEmoji}>
                <MdEmojiEmotions className={!showEmoji ? 'text-white text-opacity-90 w-[40px] h-[40px] hover:text-opacity-100' : 'text-[#4682B4] text-opacity-100 w-[40px] h-[40px]'} />
              </button>
              <button>
                <BsFillSendFill className='text-white text-opacity-90 w-[35px] h-[35px] hover:text-opacity-100' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat