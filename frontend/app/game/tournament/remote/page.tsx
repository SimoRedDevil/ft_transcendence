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
                <div className="3xl:w-[450px] 3xl:h-[550px] 3xl:space-y-[150px] border border-white border-opacity-20 bg-[url('/images/tour7.png')] bg-cover bg-centre flex justify-center items-center flex-col rounded-[20px]
                                l:w-[400px] l:h-[500px] l:space-y-[120px]
                                lm:w-[400px] lm:h-[500px] lm:space-y-[120px]
                                xs:w-[300px] xs:h-[400px] xs:space-y-[100px]
                                w-[200px] h-[300px] space-y-[30px]">
                    <h1 className='text-white font-bold 3xl:mt-[40px] l:mt-[40px] lm:mt-[40px] ls:mt-[30px] mt-[30px]'>Join Tournament</h1>
                    <form action="" className='flex flex-col items-center h-full' onSubmit={handlSubmit}>
                        <input type="text" id="player" placeholder="AliasName" required
                                    value={player}
                                    onChange={(e) => setPlayer(e.target.value)}
                                    className='w-[70%] h-10 bg-transparent border-b ml-[20px] border-white border-opacity-30 text-white text-center'/>
                                    {userExist && <div className=' text-red-500 text-center text-sm'>{playerExit } already exists in the game!</div>}
                        <button type='submit' className='bg-blue-500 text-white rounded-lg w-[30%] p-2 3xl:mt-[150px] l:mt-[130px] lm:mt-[130px] xs:mt-[90px]'>Join</button>
                    </form>
                </div>
            </div>
        ) : (
            !gamEnd ? (<TournamentSyst PlayerName={player} HandleUserExist={HandleUserExist} GameEnd={handleGameEnd} />) : (<WinnerTour />)
        )}
    </div>
  )
}
