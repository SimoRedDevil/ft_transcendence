import React from 'react';
import path from 'path';

const ProfileCard = ({ img, F_name , user, mail , lvl }) => {
  return (
       <div className=' h-[90%] w-[90%] flex xl:flex-row justify-around items-center gap-1 lg:flex-col  '>
          <img className='rounded-full lg:w-28 lg:h-28 xl:w-36  xl:h-36 2xl:w-40 2xl:h-40  xl:p-1 border-2 border-[#00FFF0] ' src={img} alt="" />
          <div className='flex flex-col justify-around xl:items-start  h-full lg:items-center'>
              <p className='2xl:text-[3rem] xl:text-[1.9rem]  lg:text-[1.2rem] text-white'>{F_name}</p>
              <p className='2xl:text-[0.8rem] xl:text-[0.6rem]  lg:text-[0.6rem] text-white'>username: {user}</p>
              <p className='2xl:text-[0.8rem] xl:text-[0.6rem]  lg:text-[0.6rem] text-white'>email: {mail}</p>
              <p className='2xl:text-[2rem]  xl:text-[1.4rem] lg:text-[1rem] text-white'>Level: {lvl}</p>
          </div>

       </div>
  );
};

export default ProfileCard;
{/* <div className='2xl:w-[50%]  border-2   relative  2xl:h-44 '>
    <img className='rounded-full xl:w-full  xl:h-full 2xl:w-44 2xl:h-44  xl:p-1 ' src={img} alt="" />
    <img className='rounded-full xl:w-full  xl:h-full 2xl:w-44 2xl:h-44  xl:p-1 ' src={img} alt="" />
</div>
<div className='xl:w-44 2xl:w-72  relative xl:right-3 xl:h-32 flex ' >
    <div className='xl:w-full flex flex-col items-center justify-around '>
    </div>
</div> */}

