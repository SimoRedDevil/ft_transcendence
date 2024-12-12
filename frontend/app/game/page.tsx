"use client"
import WinnerLocal from '@/components/WinnerLocal';
import React, { useState } from 'react';

import dynamic from 'next/dynamic';

const Table = dynamic(() => import('./Table'), { ssr: false });
const Player1 = dynamic(() => import('./Player1'), { ssr: false });
const Player2 = dynamic(() => import('./Player2'), { ssr: false });

interface GameProps {
    player1: string;
    player2: string;
}

export default function LocalGame({ player1, player2}: GameProps) {
    const [gameEnded, setGameEnded] = useState(false);
    const [scoreWinner, setScoreWinner] = useState('');
    const [scoreLoser, setScoreLoser] = useState('');
    const [name, setName] = useState('');
    const handleGameEnd = (winner: string, scoreWinner: string, scoreLoser: string) => {
        if (winner === 'player 1' || winner === 'player 2') {
            setName(winner);
        }
        setGameEnded(true);
        setScoreWinner(scoreWinner);
        setScoreLoser(scoreLoser);

    };

    return (
        <div className="w-[85%] h-[80vh] flex justify-center items-center flex-col mt-[5vh] ml-[32px]
                        space-y-[20px] md:border md:border-white md:border-opacity-30
                        md:bg-black md:bg-opacity-20
                        md:rounded-[50px]">
            {gameEnded ? ( <WinnerLocal winer={name} scoreWinner={scoreWinner} scoreLoser={scoreLoser}/>) : 
            (<>
                <Player1 name={player1 ?? "Player 1"} gameStarted={true} /> 
                <Table onGameEnd={handleGameEnd}/>
                <Player2 name={player2 ?? "Player 2"} gameStarted={true} />
            </>
            )}
        </div>
    );
}