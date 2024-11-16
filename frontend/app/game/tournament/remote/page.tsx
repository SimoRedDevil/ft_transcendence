'use client'
import React from 'react'
import { useState } from 'react'
import TournamentSyst from '../../../../components/TournSystem'


export default function TournamentRemote() {
    const [player, setPlayer] = useState('')
    const [form, setForm] = useState(false)

    const handlSubmit = (e) => {
        e.preventDefault()
        console.log(player)
        setForm(true)
    }
  return (
    <div className='w-[90%] h-[80vh] flex justify-center items-center flex-col  ml-[28px]
                    md:border md:border-white md:border-opacity-30
                    md:bg-black md:bg-opacity-20
                    md:rounded-[50px]'>
        {!form ? (
            <div className='flex justify-center items-center'>
                <div className='w-[300px] h-[400px] border border-white border-opacity-30 flex justify-center items-center flex-col space-y-10 rounded-[20px]'>
                    <h1 className='text-white font-bold'>Join Tournament</h1>
                    <form action="" className='flex flex-col items-center' onSubmit={handlSubmit}>
                        <input type="text" id="player" placeholder="AliasName" required
                                    value={player}
                                    onChange={(e) => setPlayer(e.target.value)}
                                    className='w-[70%] h-10 bg-transparent border-b ml-[30px] border-white border-opacity-30 text-white text-center mt-6'/>
                        <button type='submit' className='bg-blue-500 text-white rounded-lg w-[30%] mt-16 p-2'>Join</button>
                    </form>
                </div>
            </div>
        ) : (
            <TournamentSyst PlayerName={player} />
        )}
    </div>
  )
}
