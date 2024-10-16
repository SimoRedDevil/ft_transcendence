import React from 'react'
import Login from './login/page'
import Link from 'next/link'
export default function Home() {
    return (
        <div className='
            flex
            items-center
            justify-center
            h-screen
            flex-col
            bg-gray-800
            text-white
        '>
            hello world
            <Link href="/login">
                Login
            </Link>
        </div>
    )
}