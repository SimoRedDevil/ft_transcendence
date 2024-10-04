'use client'

import React, { useEffect, useState } from 'react'
import Conversations from './Conversations'
import Chat from './Chat'
import axios from 'axios'

function ChatPage() {
  useEffect(() => {
    axios.get('http://localhost:8000/api/auth/users/').then((response) => {
      console.log(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }, [])
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='text-white w-[97%] h-full flex flex-col bg-black bg-opacity-60 rounded-[50px] border border-white border-opacity-30 sm:border sm:border-white sm:border-opacity-30 sm:rounded-[50px] sm:w-[90%] sm:h-[90%] xl:w-[80%] xl:h-[90%] lg:flex-row'>
        <Conversations />
        {/* <Chat /> */}
      </div>
    </div>
  )
}

export default ChatPage