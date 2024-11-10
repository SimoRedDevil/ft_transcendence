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
        <div className="flex justify-center items-center">
            {showLocalGame ? (
                <LocalGame player1={currentPlayers.player1} player2={currentPlayers.player2} onGameEnd={handleGameEnd} />
            ) : (
                !isFormSubmitted ? (
                    <TournamentForm onSubmit={handleFormSubmit} />
                ) : (
                    <div className="w-[85%] h-[80vh] flex justify-start items-center flex-col mt-[5vh] space-y-[20px]
                                md:border md:border-white md:border-opacity-30
                                md:bg-black md:bg-opacity-20
                                md:rounded-[50px]">
                        <div className='w[100px] h-[60px] text-yellow-100 mt-[150px] '>Demi Final</div>
                        {currentGame === 1 && (
                            <div className='w-[350px] h-[100px] bg-sky-400 mt-[200px] rounded-lg flex justify-center items-center space-x-[30px]'>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{players.player1}</div>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{players.player2}</div>
                                <button onClick={() => handleButtonClick(players.player1, players.player2)}>Play Game 1</button>
                            </div>
                        )}
                        {currentGame === 2 && (
                            <div className='w-[350px] h-[100px] bg-sky-400 mt-[200px] rounded-lg flex justify-center items-center space-x-[30px]'>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{players.player3}</div>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{players.player4}</div>
                                <button onClick={() => handleButtonClick(players.player3, players.player4)}>Play Game 2</button>
                            </div>
                        )}
                        {currentGame == 3 && (
                            <div className='w-[350px] h-[100px] bg-sky-400 mt-[200px] rounded-lg flex justify-center items-center space-x-[30px]'>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{winner1}</div>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{winner2}</div>
                                <button onClick={() => handleButtonClick(winner1, winner2)}>Play Game 1</button>
                            </div>
                        )}
                        {currentGame > 3 && (
                            <div className='w-[350px] h-[100px] bg-sky-400 mt-[200px] rounded-lg flex justify-center items-center space-x-[30px]'>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>Winner</div>
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
}