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
import { axiosInstance } from '../../utils/axiosInstance';
import { ToastContainer, toast} from "react-toastify";
import { useTranslation } from "react-i18next";
import { json } from 'stream/consumers';
import Link from 'next/link'
import { getCookies } from '../../components/auth';
import { useNotificationContext } from '../../components/context/NotificationContext';

function Chat({setShowBlockDialog}) {
  const [showEmoji, setShowEmoji] = useState(false)
  const [input, setInput] = useState('')
  const {authUser, loading} = useUserContext()
  const { t } = useTranslation();
  const [checkBlockLoading, setCheckBlockLoading] = useState(true)
  const [otherUserOnline, setOtherUserOnline] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blocker, setBlocker] = useState(null)

  const
  {
    selectedConversation,
    otherUser,
    ws,
    messages,
    messagesLoading,
    isMobile,
    lastMessageRef,
    page,
    setPage,
    pageCount,
    chatWindowRef,
    blockerUsername,
    unblockedUsername,
    setBlockUsername,
    setUnblockUsername,
  } = useChatContext()

  const {notif_socket} = useNotificationContext()

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
      'msg_type': 'message',
      'conversation_id': selectedConversation.id,
      'sent_by_user': authUser?.username,
      'sent_to_user': otherUser.username,
      'content': input
    }))
    setInput('')
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleScroll = (e) => {
    const scroll = e.target
    const scrollTop = scroll.scrollTop
    if (scrollTop === 0) {
      if (page < pageCount)
        setPage((prevPage) => prevPage + 1)
    }
  }

  const handleBlockUser = async () => {
    setShowBlockDialog(true)
  }

  const handleUnblockUser = async () => {
    const body = {
      username: otherUser?.username
    }
    try {
      const cookies = await getCookies();
      const csrfToken = cookies.cookies.csrftoken;
      const response = await axios.post('https://localhost/api/auth/unblock/', body, {
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setIsBlocked(false)
        toast.success("User unblocked successfully")
      }
    } catch (error) {
      toast.error(t(error.response.data.error))
    }
  }

  const checkUserBlocked = () => {
    axiosInstance.get(`auth/check-blocked/`, {
      params: {
        username: otherUser?.username
      }
    }).then((response) => {
      if (response.status === 200) {
        setIsBlocked(response.data.blocked)
        console.log(response.data.blocker)
        if (response.data.blocker !== null) {
          setBlocker(response.data.blocker)
        }
      }
    }).catch((error) => {
      toast.error(t(error.response.data.error))
    }).finally(() => {
      setCheckBlockLoading(false)
    })
  }

  const handleInviteGame = async () => {
    notif_socket.current.send(JSON.stringify({
      'notif_type': 'invite_game',
      'sender': authUser?.username,
      'receiver': otherUser?.username,
      'title': 'Game Invitation',
      'description': 'You have been invited to play a game by ' + authUser?.username,
    }))
  }

  useEffect(() => {
    if (selectedConversation !== null) {
      checkUserBlocked()
    }
  }, [selectedConversation])

  useEffect(() => {
    if (otherUser !== null) {
      setOtherUserOnline(otherUser.online)
    }
  }, [otherUser])

  useEffect(() => {
    if (blockerUsername !== null && (blockerUsername === authUser?.username || blockerUsername === otherUser?.username)) {
      setIsBlocked(true)
      setBlocker(blockerUsername)
      setBlockUsername(null)
    }
  }, [blockerUsername])

  useEffect(() => {
    if (unblockedUsername !== null && (unblockedUsername === authUser?.username || unblockedUsername === otherUser?.username)) {
      setIsBlocked(false)
      setBlocker(null)
      setUnblockUsername(null)
    }
  }, [unblockedUsername])

  if (selectedConversation === null) return;

  if (loading === true || lastMessageRef === null || messages === null || checkBlockLoading === true) return <div>Loading...</div> ;

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
          <div className='flex flex-row gap-4'>
            <div className='rounded-full h-[80px] w-[80px]'>
              <Link href={`/profile/${otherUser?.username}/`}><Image className='rounded-full' src={otherUser?.avatar_url} width={80} height={80} alt='avatar'/></Link>
            </div>
            <div className='flex flex-col justify-center gap-4'>
              <span className='text-[20px]'>{otherUser.full_name}</span>
              <span className='text-[18px] text-white text-opacity-60'>{otherUser?.online ? 'Online' : 'Offline'}</span>
              {/* otherUser.online === true ? 'Active Now' : 'Offline' */}
            </div>
          </div>
          <div className='w-[140px] flex gap-2'>
            <button onClick={handleInviteGame} className='cursor-pointer w-[60px] h-[60px] border border-white border-opacity-30 bg-white bg-opacity-15 hover:bg-opacity-20 rounded-full flex items-center justify-center'>
              <IoGameController className='text-white w-[30px] h-[30px]' />
            </button>
            <button onClick={handleBlockUser} className='cursor-pointer w-[60px] h-[60px] border border-white border-opacity-30 bg-white bg-opacity-15 hover:bg-opacity-20 rounded-full flex items-center justify-center'>
              <RiUserForbidFill className='text-white w-[30px] h-[30px]' />
            </button>
          </div>
        </div>
        <div className='p-[20px] h-[90%] w-full flex flex-col justify-between items-center overflow-hidden'>
          <div className='w-full h-[89%] relative'>
            <div ref={chatWindowRef} onScroll={(e) => handleScroll(e)} className='h-full scrollbar-none overflow-y-auto scroll-smooth whitespace-pre-wrap'>
              {
                messages.map((message, index) => {
                  return (
                    message.conversation_id === selectedConversation.id ?
                    <div ref={index === messages.length - 1 ? lastMessageRef : null} key={message.id} className={`flex flex-col mb-4 ${(message.sent_by_user === authUser?.username || (message.sender !== undefined && message.sender.username === authUser?.username)) ? 'items-end' : 'items-start'}`}>
                      <div className={`flex items-center border border-white border-opacity-20 rounded-[30px] min-h-[50px] max-w-[75%] ${(message.sent_by_user === authUser?.username || (message.sender !== undefined && message.sender.username === authUser?.username)) ? 'bg-[#0D161A]' : 'bg-black'}`}>
                        <span className='text-white text-opacity-90 p-[20px]'>{message.content}</span>
                      </div>
                      <div className=''>
                        <span className='text-white text-opacity-50 text-[0.8rem]'>{message.get_human_readable_time}</span>
                      </div>
                    </div> : null
                  )
                })
              }
            </div>
            <div className={(showEmoji) ? 'flex absolute top-[calc(100%_-_430px)] left-[calc(100%_-_400px)] overflow-hidden' : 'hidden'}>
              <EmojiPicker onEmojiClick={handleEmojiClick} width={400} theme='dark' emojiStyle='google' searchDisabled={false} lazyLoadEmojis={true}/>
            </div>
          </div>
          <div className={`w-[90%] h-[250px] bg-black bg-opacity-50 border border-white border-opacity-30 rounded-[30px] p-5 flex flex-col items-center justify-center text-center gap-3 ${!isBlocked && 'invisible'}`}>
              <div className={`text-red-600 text-opacity-60`}>
                {blocker === authUser?.username ? <p>You have blocked this user. Unblock him to send messages.</p> : <p>You have been blocked by this user. You cannot send messages.</p>}
              </div>
              {
                blocker === authUser?.username &&
                <button onClick={handleUnblockUser} className='hover:bg-[#427baa] w-[220px] h-[55px] bg-[#3b6e98] rounded-[30px] flex items-center justify-center'>
                  <span className='text-white text-opacity-90'>Unblock</span>
                </button>
              }
          </div>
          <div className={`w-full h-[100px] bg-transparent flex items-center justify-center ${isBlocked && 'invisible'}`}>
            <div onKeyDown={handleKeyDown} className={`flex justify-between h-[80px] w-full rounded-[30px] border border-white border-opacity-30 bg-black bg-opacity-50 ${isBlocked ? ' border-red-600 bg-red-600 bg-opacity-20 ' : ''} `}>
              <TextBox focus={false} input={input} onChange={(e) => handleInputChange(e)} placeholder={`${isBlocked ? 'You can\'t talk with this user because you are blocked by him or blocked him!' : 'Type a message...'}`} icon={undefined} className={`w-full h-full bg-transparent rounded-[30px] p-[20px] ${isBlocked && 'invisible'}`} disabled={isBlocked === true ? true : false}></TextBox>
              <div className='w-[140px] flex items-center justify-center gap-3'>
                <button disabled={isBlocked === true ? true : false} onClick={handleEmoji}>
                  <MdEmojiEmotions className={!showEmoji ? 'text-white text-opacity-90 w-[40px] h-[40px] hover:text-opacity-100' : 'text-[#4682B4] text-opacity-100 w-[40px] h-[40px]'} />
                </button>
                <button disabled={isBlocked === true ? true : false} onClick={handleSendMessage}>
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