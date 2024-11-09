'use client'

import React, { useState } from 'react'

export default function TournamentForm({ onSubmit }) {
    const [player1, setPlayer1] = useState('')
    const [player2, setPlayer2] = useState('')
    const [player3, setPlayer3] = useState('')
    const [player4, setPlayer4] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({ player1, player2, player3, player4 })
        setPlayer1('')
        setPlayer2('')
        setPlayer3('')
        setPlayer4('')
    }

    return (
        <div className='flex justify-center items-center mt-[150px]'>
            <div className='w-[420px] h-[540px] mt-[60px] bg-deepSeaBlue rounded-lg border border-white border-opacity-30'>
                <div className='text-white text-center text-2xl mt-5'>Create Tournament</div>
                <form className='flex flex-col' onSubmit={handleSubmit}>
                    <div className='flex justify-between w-full'>
                        <div className='flex flex-col w-[50%] space-y-2'>
                            <label htmlFor="player1" className='text-sky-400 mt-3 ml-2'>player1</label>
                            <input type="text" id="player1" placeholder="Player 1" required
                                value={player1}
                                onChange={(e) => setPlayer1(e.target.value)}
                                className='w-[70%] h-10 bg-transparent border-b ml-5 border-white border-opacity-30 text-white text-center'/>
                        </div>
                        <div className='flex flex-col w-[50%] mt-[40px] space-y-2'>
                            <label htmlFor="player2" className='text-sky-400 mt-3 mr-2 flex justify-end '>player2</label>
                            <input type="text" id="player2" placeholder="Player 2" required
                                value={player2}
                                onChange={(e) => setPlayer2(e.target.value)}
                                className='w-[70%] h-10 bg-transparent border-b ml-[30px] border-white border-opacity-30 text-white text-center'/>
                        </div>
                    </div>
                    <div className='flex justify-between w-full'>
                        <div className='flex flex-col w-[50%] space-y-2'>
                            <label htmlFor="player3" className='text-sky-400 mt-10 ml-2'>player3</label>
                            <input type="text" id="player3" placeholder="Player 3" required
                                value={player3}
                                onChange={(e) => setPlayer3(e.target.value)}
                                className='w-[70%] h-10 bg-transparent border-b ml-5 border-white border-opacity-30 text-white text-center'/>
                        </div>
                        <div className='flex flex-col w-[50%] mt-[30px] space-y-2'>
                            <label htmlFor="player4" className='text-sky-400 mt-20 mr-2 flex justify-end '>player4</label>
                            <input type="text" id="player4" placeholder="Player 4" required
                                value={player4}
                                onChange={(e) => setPlayer4(e.target.value)}
                                className='w-[70%] h-10 bg-transparent border-b ml-[30px] border-white border-opacity-30 text-white text-center'/>
                        </div>
                    </div>
                    <button type="submit" className='w-[30%] h-10 bg-sky-400 text-white mt-5 ml-[35%] rounded-[30px]'>Go</button>
                </form>
            </div>
        </div>
    )
}
