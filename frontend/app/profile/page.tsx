import React from 'react'
import ProfileCard from '../../components/ProfileCard'
export default function Profile ()
{
    return(
        <div className=' lg:h-[80vh] lg:w-[85%] flex flex-col items-center justify-center relative left-32  top-10 gap-[5%] container'>
            <div className=' flex justify-between  lg:h-[30%] w-[95%]'>
                <div className='lg:w-[40%] user_info h-full'>
                    <ProfileCard />
                </div>
                <div className='lg:w-[55%] user_info'></div>
            </div>
            <div className='flex justify-between   lg:h-[55%] w-[95%]'>
                <div className=' h-full w-[40%] user_info'></div>
                <div className='h-full w-[20%] user_info'></div>
                <div className='h-full w-[30%] user_info'></div>
            </div>
        </div>
    );
}   