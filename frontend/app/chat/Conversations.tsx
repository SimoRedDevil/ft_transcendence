import React from 'react'
import Image from "next/image";
import TextBox from '../../components/TextBox';

type Props = {
    data: any
}

function Conversations({data}: Props) {
  return (
    <div className='w-full h-full lg:w-[400px] 2xl:w-[550px] flex flex-col'>
            <div className='h-[200px]'>
              <div className='h-[100px] flex gap-[10px] p-[20px]'>
                <div className='h-[60px] w-[60px] rounded-full'>
                  <Image className='rounded-full' src={data[0].image} width={60} height={60} alt='avatar'/>
                </div>
                <div className='flex flex-col'>
                  <span className='text-[1rem]'>{data[0].name}</span>
                  <span className='text-[0.9rem] text-white text-opacity-65'>Active Now</span>
                </div>
              </div>
              <div className='h-[100px] flex items-center justify-center'>
                <TextBox placeholder='Search...' icon='/icons/search.png' className='border border-white border-opacity-20 w-[95%] h-[70px] bg-white bg-opacity-10 rounded-[40px] flex items-center'></TextBox>
              </div>
            </div>
        <div className='mt-[20px] h-[calc(100%_-_270px)] no-scrollbar overflow-y-auto scroll-smooth'>
            {
              data.slice(1).map((e) => {
                return (
                  <div key={e.id} className='hover:bg-white hover:bg-opacity-10 hover:cursor-pointer h-[140px] flex items-center gap-3'>
                    <div className='rounded-full ml-3 h-[75px] w-[75px]'>
                      <Image className='rounded-full' src={e.image} width={75} height={75} alt='avatar'/>
                    </div>
                    <div className='w-[60%] flex flex-col'>
                      <span className='w-full text-[1rem] text-white text-opacity-60'>{e.name}</span>
                      <p className='text-[1rem] text-white text-opacity-60'>You: Hello, how are you?</p>
                    </div>
                  </div>
                )
              })
            }
        </div>
    </div>
  )
}

export default Conversations