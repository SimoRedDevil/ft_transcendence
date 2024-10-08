import React from 'react';

const ProfileCard = () => {
  return (
        <div className='h-full flex justify-around items-center'>
            <div className='w-[50%] flex'>
                <div className='rounded-full border-2 border-[#00FFF0] w-32 h-32 relative z-20'>
                    <img className='rounded-full w-full h-full  ' src="/images/minipic.jpeg" alt="" />
                </div>
                <div className='line w-28'>
                    <div className='w-[90%] bg-[#00FFF0] h-[2%] rotate-[145deg] relative right-[30%] top-7'></div>
                    <div className='w-[90%] bg-[#00FFF0] h-[2%] rotate-[35deg] relative right-[30%] top-[76%]'></div>
                    <div className='w-[80%] bg-[#00FFF0] h-[2%] rotate-[36deg] relative left-[42%] top-[16%] z-10'></div>
                    <div className='w-[74%] bg-[#00FFF0] h-[2%] rotate-[150deg] relative left-[45%] top-[78%]'></div>
                    <div className='w-2 h-2 bg-[#00FFF0] rounded-full relative left-[110%] top-[30%]' ></div>
                    <div className='w-2 h-2 bg-[#00FFF0] rounded-full relative left-[110%] top-[52%]' ></div>
                    <div className='w-[46%] bg-[#00FFF0] h-[2%] relative top-6 right-2'></div >
                    <div className='w-[46%] bg-[#00FFF0] h-[2%] relative top-12 right-2'></div >
                    {/* <div className='w-1 h-full bg-white relative left-14 bottom-8'></div>
                    <div className='w-1 h-full bg-white rotate-90 relative left-14 bottom-44'></div>
                    <div className='w-1 h-full bg-white rotate-90 relative left-14 bottom-64'></div> */}
                </div>
            </div>
            <div className='w-44 border' ></div>

        </div>
  );
};

export default ProfileCard;

