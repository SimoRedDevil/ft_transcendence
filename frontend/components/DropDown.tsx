import React from 'react'

type Props = {
    className?: string,
    items: string[]
}

function DropDown({className, items}: Props) {
  return (
    <div className={className}>
        {
            items.map((item, index) => {
                return (
                    <div key={index} className='w-[250px] h-[50px] flex items-center border border-white border-opacity-20'>
                        <h1 className='text-white text-opacity-50 ml-4'>{item}</h1>
                    </div>
                )
            })
        }
    </div>
  )
}

export default DropDown