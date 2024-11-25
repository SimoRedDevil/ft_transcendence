'use client'
import React from 'react'
import { useState } from 'react'
import TournamentSyst from '../../../../components/TournSystem'
import WinnerTour from '@/components/WinnerTour'


export default function TournamentRemote() {
    const [player, setPlayer] = useState('')
    const [form, setForm] = useState(false)
    const [userExist, setUserExist] = useState(false)
    const [gamEnd, setGameEnd] = useState(false)
    const [playerExit, setPlayerExit] = useState('')

    const handlSubmit = (e) => {
        e.preventDefault()
        console.log(player)
        setForm(true)
    }
    const HandleUserExist = (exist, playerExit) => {
        console.log(exist)
        setUserExist(true)
        console.log(playerExit)
        setPlayerExit(playerExit)
        setForm(false)
    }

    const handleGameEnd = (winer) => {
        setGameEnd(true)
    }

  return (
    <div className='w-[90%] h-[80vh] flex justify-center items-center flex-col  ml-[28px]
                    md:border md:border-white md:border-opacity-30
                    md:bg-black md:bg-opacity-20
                    md:rounded-[50px]'>
        {!form ? (
            <div className='flex justify-center items-center'>
                <div className="3xl:w-[450px] 3xl:h-[550px] border border-white border-opacity-20 bg-[url('/images/tour7.png')] bg-cover bg-centre flex justify-center items-center flex-col space-y-5 rounded-[20px]
                                l:w-[400px] l:h-[500px]">
                    <h1 className='text-white font-bold mt-6'>Join Tournament</h1>
                    <form action="" className='flex flex-col items-center mb-[10px] h-full' onSubmit={handlSubmit}>
                        <input type="text" id="player" placeholder="AliasName" required
                                    value={player}
                                    onChange={(e) => setPlayer(e.target.value)}
                                    className='w-[70%] h-10 bg-transparent border-b ml-[30px] border-white border-opacity-30 text-white text-center mt-6'/>
                        <button type='submit' className='bg-blue-500 text-white rounded-lg w-[30%] mt-16 p-2'>Join</button>
                                    {userExist && <div className=' text-red-500 text-center text-sm mt-11'>{playerExit } already exists in the game!</div>}
                    </form>
                </div>
            </div>
        ) : (
            !gamEnd ? (<TournamentSyst PlayerName={player} HandleUserExist={HandleUserExist} GameEnd={handleGameEnd} />) : (<WinnerTour />)
        )}
    </div>
  )
}
