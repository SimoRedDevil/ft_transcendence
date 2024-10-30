'use client'

import React from 'react'
import Image from 'next/image'

type Props = {
    placeholder: string,
    icon?: string,
    className: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    input?: string,
}

//border border-white border-opacity-30 w-full h-full bg-black bg-opacity-50 rounded-[30px] flex items-center

function TextBox({placeholder, icon, className, onChange, input}: Props) {
  return (
    <div className={className}>
        <div className='ml-[15px] mr-[15px]'>
          {icon != undefined ? <Image className='opacity-60' src={icon} alt='icon' width={32} height={32}/> : null}
        </div>
        <input value={input} onChange={onChange} type='text' placeholder={placeholder} className='text-white w-full h-full bg-transparent border-none rounded-[inherit] focus:outline-none p-[5px]'/>
    </div>
  )
}

export default TextBox