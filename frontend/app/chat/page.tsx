'use client'

import React, { useEffect, useState } from 'react'
import Conversations from './Conversations';
import Chat from './Chat';

function ChatPage() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/users', {cache: 'no-cache'})
      const data = await response.json()
      setData(data)
      setLoading(false)
    }
    fetchData()
  }, [])
  if (isLoading) return;

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='text-white w-[97%] h-full flex flex-col bg-black bg-opacity-60 rounded-[50px] border border-white border-opacity-30 sm:border sm:border-white sm:border-opacity-30 sm:rounded-[50px] sm:w-[90%] sm:h-[90%] xl:w-[80%] xl:h-[90%] lg:flex-row'>
        <Conversations data={data} />
        <Chat data={data} />
      </div>
    </div>
  )
}

export default ChatPage