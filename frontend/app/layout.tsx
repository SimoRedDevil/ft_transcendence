import React from 'react'
import { Head } from 'next/document'
import './styles/global.css'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        
        </head>
        <body className='h-screen'>
          <div className='bg-main-bg border border-black w-screen h-full bg- bg-cover bg-no-repeat bg-center fixed min-w-[280px] min-h-[800px]'>
            <div className='h-[100px]'>
                <Header/>
            </div>
            <div className='h-[calc(100%_-_100px)] flex flex-col-reverse lg:flex-row'>
              <div className='flex lg:flex-col w-full lg:w-[50px]  lg:relative lg:right-1 xl:right-0 xl:w-[100px]'>
                <Sidebar/>
              </div>
              <div className='h-auto w-full xs:h-full xs:overflow-auto'>
                {children}
              </div>
            </div>
          </div>
        </body>
      </html>
    )
  }

