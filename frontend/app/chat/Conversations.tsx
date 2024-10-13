import React, { useEffect, useState } from 'react'
import Image from "next/image";
import TextBox from '../../components/TextBox';
import { axiosInstance } from '../../utils/axiosInstance';
import { cookies } from 'next/headers';

function Conversations() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    axiosInstance.get('/chat/conversations/').then((response) => {
      setData(response.data)
      console.log(response.data)
      setIsLoading(false)
    }).catch((error) => {
      console.log(error)
    })
  }, [])

  function handleConversationClick(conversationID) {
    console.log(conversationID)
  }

  return (
    <div className='w-full h-full lg:w-[400px] 2xl:w-[550px] flex flex-col'>
            <div className='h-[200px]'>
              <div className='h-[100px] flex gap-[10px] p-[20px]'>
                <div className='h-[60px] w-[60px] rounded-full bg-blue-800'>
                  {/* <Image className='rounded-full' src='' width={60} height={60} alt='avatar'/> */}
                </div>
                <div className='flex flex-col'>
                  <span className='text-[1rem]'>Name</span>
                  <span className='text-[0.9rem] text-white text-opacity-65'>Active Now</span>
                </div>
              </div>
              <div className='h-[100px] flex items-center justify-center'>
                <TextBox placeholder='Search...' icon='/icons/search.png' className='border border-white border-opacity-20 w-[95%] h-[70px] bg-white bg-opacity-10 rounded-[40px] flex items-center'></TextBox>
              </div>
            </div>
        <div className='mt-[20px] h-[calc(100%_-_270px)] no-scrollbar overflow-y-auto scroll-smooth'>
          {!data || data.length === 0 ? (
            <div className='text-white text-opacity-60 text-[1rem] text-center flex flex-col items-center justify-center gap-4 h-full'>
               <div className='h-[100px] w-[100px] rounded-full'>
                <Image className='rounded-full' src='/icons/sleep.png' width={100} height={100} alt='avatar'/>
               </div>
               <span className='text-[22px]'>No conversations</span>
            </div>) : <div>
            {data.map((conversation) => (
              <div key={conversation.id} onClick={() => handleConversationClick(conversation.id)} className='h-[120px] flex items-center gap-4 p-[20px] hover:bg-white hover:bg-opacity-10 cursor-pointer'>
                <div className='h-[80px] w-[80px] rounded-full bg-blue-800'>
                  {/* <Image className='rounded-full' src='' width={50} height={50} alt='avatar'/> */}
                </div>
                <div className='flex flex-col gap-3'>
                  <span className='text-[1rem]'>{conversation.receiver_info.full_name}</span>
                  <span className='text-[0.9rem] text-white text-opacity-65'>{conversation.last_message}</span>
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