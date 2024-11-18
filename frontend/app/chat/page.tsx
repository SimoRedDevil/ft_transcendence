'use client'

import React, { useEffect, useRef, useState } from 'react'
import Conversations from './Conversations'
import Chat from './Chat'
import axios from 'axios'
import { truncateMessage } from '../../utils/tools';
import { ChatProvider } from '../../components/context/ChatContext';
import BlockUserDialog from '../../components/BlockUserDialog'

function ChatPage() {
  const [other_user, setOtherUser] = useState(null)
  // const socket = useRef(null)

  // useEffect(() => {
  //   socket.current = new WebSocket('ws://localhost:8000/ws/chat/')
  //   socket.current.onopen = () => {
  //     console.log('Connected to the chat server')
  //   }
  //   socket.current.onmessage = (message) => {
  //     const newMessage = JSON.parse(message.data)
  //   }
  //   socket.current.onclose = () => {
  //     console.log('Disconnected from the chat server')
  //   }
  //   socket.current.onerror = (error) => {
  //     console.log('Error: ', error)
  //   }
  //   return () => {
  //     socket.current.readyState === WebSocket.OPEN && socket.current.close()
  //   }
  // }, [])
  return (
    <ChatProvider>
    <div className='w-full h-full flex items-center justify-center'>
      <div className='text-white w-[97%] h-full flex flex-col bg-black bg-opacity-60 rounded-[50px] border border-white border-opacity-30 sm:border sm:border-white sm:border-opacity-30 sm:rounded-[50px] sm:w-[90%] sm:h-[90%] xl:w-[80%] xl:h-[90%] lg:flex-row'>
        <Conversations />
        <Chat />
        <BlockUserDialog full_name='m' />
      </div>
      {/* <div className='border h-[100px] w-[200px] text-white'>
        <button onClick={
          async () => {
            socket.current.send(JSON.stringify({
              'content': 'Faayn akhay abdellah',
              'sent_by_user': 'aben-nei',
              'sent_to_user': 'Mohamed',
              'conversation_id': '-1',
              'type': 'message'
            }))
          }
        }>initial message</button>
      </div> */}
    </div>
    </ChatProvider>
  )
}

export default ChatPage