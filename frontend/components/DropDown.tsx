import React from 'react'
import Link from 'next/link'

type Props = {
    className?: string,
    items: string[],
    url?: string
}

function DropDown({className, items}: Props) {
  return (
    <div className=''>
        {
            items.map((item, index) => {
                return (
                    <div key={index} className={className}>
                        <Link href='' className='text-white ml-4'>{item}</Link>
                    </div>
                )
            })
        }
    </div>
  )
}

export default DropDown