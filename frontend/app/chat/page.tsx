'use client'

import React, { useEffect, useState } from 'react'
import Conversations from './Conversations'
import Chat from './Chat'
import axios from 'axios'

function ChatPage() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/chat/')
    socket.onopen = () => {
      console.log('Connected to the chat server')
      // socket.send(JSON.stringify({
      //   'message': 'Hi there',
      //   'sent_by_user': 'yoel-bas',
      //   'sent_to_user': 'mel-yous'
      // }))
    }
    socket.onmessage = (message) => {
      console.log('Message: ', message)
      setData(message)
    }
    socket.onclose = () => {
      console.log('Disconnected from the chat server')
    }
    socket.onerror = (error) => {
      console.log('Error: ', error)
    }
    return () => {
      socket.readyState === WebSocket.OPEN && socket.close()
    }
  }, [])
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='text-white w-[97%] h-full flex flex-col bg-black bg-opacity-60 rounded-[50px] border border-white border-opacity-30 sm:border sm:border-white sm:border-opacity-30 sm:rounded-[50px] sm:w-[90%] sm:h-[90%] xl:w-[80%] xl:h-[90%] lg:flex-row'>
        <Conversations />
        <Chat />
      </div>
    </div>
  )
}

export default ChatPage