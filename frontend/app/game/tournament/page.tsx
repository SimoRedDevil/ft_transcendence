"use client";

import React, { useState } from 'react';
import TournamentForm from '../../../components/TournamentForm';
import LocalGame from '../../../components/LocalGame';

export default function Tournament() {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [showLocalGame, setShowLocalGame] = useState(false);
    const [players, setPlayers] = useState({ player1: '', player2: '', player3: '', player4: '' });
    const [currentPlayers, setCurrentPlayers] = useState({ player1: '', player2: '' });
    const [currentGame, setCurrentGame] = useState(1);
    const [winner1, setWinner1] = useState('');
    const [winner2, setWinner2] = useState('');
    const [winner, setWinner] = useState('');

    const handleFormSubmit = (playerData) => {
        setPlayers(playerData);
        setIsFormSubmitted(true);
    };

    const handleButtonClick = (player1, player2) => {
        setCurrentPlayers({ player1, player2 });
        setShowLocalGame(true);
    };

    const handleGameEnd = (winner) => {
        if (currentGame == 1)
            setWinner1(winner);
        else if (currentGame == 2)
            setWinner2(winner);
        else
            setWinner(winner)
            
        setShowLocalGame(false);
        setCurrentGame(currentGame + 1);
    };

    return (
        <div className="w-[90%] h-[80vh] flex justify-center items-center flex-col  ml-[28px]
                        md:border md:border-white md:border-opacity-30
                        md:bg-black md:bg-opacity-20
                        md:rounded-[50px]">
            {showLocalGame ? (
                <LocalGame player1={currentPlayers.player1} player2={currentPlayers.player2} onGameEnd={handleGameEnd} />
            ) : (
                !isFormSubmitted ? (
                    <TournamentForm onSubmit={handleFormSubmit} />
                ) : (
                    <div className="w-[85%] h-[80vh] flex justify-center items-center lg:justify-start lg:items-start flex-col mt-[5vh]">
                        <div className='lg:hidden w[100px] h-[60px] text-white '>{currentGame === 3 ? "Final" : "Demi Final"}</div>
                        {currentGame === 1 && (
                            <div className=' lg:hidden w-[350px] h-[100px] bg-deepSeaBlue/80 rounded-lg flex justify-center items-center space-x-[10px]'>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{players.player1.substring(0, 9)}</div>
                                <div className='text-white'>VS</div>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{players.player2.substring(0, 9)}</div>
                                <button className='w-[20%] h-[100%] rounded-lg rounded-l-[40px] bg-deepSeaBlue text-white' onClick={() => handleButtonClick(players.player1, players.player2)}>Play</button>
                            </div>
                        )}
                        {currentGame === 2 && (
                            <div className='lg:hidden w-[350px] h-[100px] bg-deepSeaBlue/80 rounded-lg flex justify-center items-center space-x-[10px]'>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{players.player3.substring(0, 9)}</div>
                                <div className='text-white'>VS</div>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{players.player4.substring(0, 9)}</div>
                                <button className='w-[20%] h-[100%] rounded-lg rounded-l-[40px] bg-deepSeaBlue text-white' onClick={() => handleButtonClick(players.player3, players.player4)}>Play</button>
                            </div>
                        )}
                        {currentGame == 3 && (
                            <div className=' lg:hidden w-[350px] h-[100px] bg-deepSeaBlue/80 rounded-lg flex justify-center items-center space-x-[10px]'>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{winner1.substring(0, 9)}</div>
                                <div className='text-white'>VS</div>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{winner2.substring(0, 9)}</div>
                                <button className='w-[20%] h-[100%] rounded-lg rounded-l-[40px] bg-deepSeaBlue text-white' onClick={() => handleButtonClick(winner1, winner2)}>Play</button>
                            </div>
                        )}
                        {currentGame > 3 && (
                            <div className=' lg:hidden w-[350px] h-[100px] bg-sky-400 rounded-lg flex justify-center items-center space-x-[30px]'>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>Winner</div>
                            </div>
                        )}
                        {currentGame === 1 && (
                            <div className='hidden lg:block w-full h-full'>
                                <div className='flex items-center justify-between flex-row h-full'>
                                    <div className='flex space-y-64 flex-col mb-12'>
                                        <div className='border border-yellow-300 w-[200px] h-[70px] rounded-r-[50px]'></div>
                                        <div className='border border-yellow-300 w-[200px] h-[70px] rounded-r-[50px]'></div>
                                    </div>
                                    <div className='flex space-y-64 flex-col mb-12'>
                                        <div className='border border-yellow-300 w-[200px] h-[70px] rounded-r-[50px]'></div>
                                    </div>
                                    <div className='flex space-y-64 flex-col mb-12'>
                                        <div className='border border-yellow-300 w-[400px] h-[140px]'></div>
                                    </div>
                                    <div className='flex space-y-64 flex-col mb-12'>
                                        <div className='border border-yellow-300 w-[200px] h-[70px] rounded-l-[50px]'></div>
                                    </div>
                                    <div className='flex space-y-64 flex-col mb-12'>
                                        <div className='border border-yellow-300 w-[200px] h-[70px] rounded-l-[50px]'></div>
                                        <div className='border border-yellow-300 w-[200px] h-[70px] rounded-l-[50px]'></div>
                                    </div>
                                </div>
                        </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
}