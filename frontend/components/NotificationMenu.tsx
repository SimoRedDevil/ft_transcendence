import React from 'react'

function NotificationMenu() {
  return (
    <div className='text-white fixed w-[calc(100%_-_100px)] h-[600px] flex flex-row-reverse'>
        <div className='w-full sm:w-[500px] sm:mr-[130px] h-full bg-[#201f1f] rounded-[30px] text-white flex flex-col'>
          <div className='w-full h-[65px] flex items-center border border-white border-t-0 border-r-0 border-l-0 border-opacity-20'>
            <h1 className='text-[22px] ml-4'>Notifications</h1>
          </div>
          <div className='h-[calc(100%_-_65px)] w-full'>

          </div>
        </div>
    </div>
  )
}

export default NotificationMenu