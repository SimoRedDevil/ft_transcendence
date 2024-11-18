import React from 'react'

type Props = {
    full_name: string,
}

function BlockUserDialog({full_name}: Props) {
    const handleBlockClick = () => {

    }
    const handleCancelClick = () => {

    }
  return (
    <div className='h-[300px] w-[550px] bg-[#293B45] flex flex-col rounded-[5px]'>
        <div className='p-4'>
            <span>Block {full_name}</span>
        </div>
        <hr className='border border-white/30 w-[95%] ml-auto mr-auto'></hr>
        <div className='p-4'>
            <p>By blocking this contact, you will no longer receive messages or any form of communication from them.
            Are you sure you want to block this contact?</p>
        </div>
        <div className='mt-4'>
            <button onClick={handleBlockClick} className='w-[120px] h-[40px] bg-red-700 text-white rounded-[5px] ml-4 hover:bg-red-600'>Block</button>
            <button onClick={handleCancelClick} className='w-[120px] h-[40px] bg-blue-600 text-white rounded-[5px] ml-4 hover:bg-blue-500'>Cancel</button>
        </div>
    </div>
  )
}

export default BlockUserDialog