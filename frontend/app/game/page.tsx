"use client"

import dynamic from 'next/dynamic';

const Table = dynamic(() => import('./Table'), { ssr: false });
const Player1 = dynamic(() => import('./Player1'), { ssr: false });
const Player2 = dynamic(() => import('./Player2'), { ssr: false });

interface GameProps {
    player1: string | undefined;
    player2: string | undefined;
    onGameEnd: (winner: string) => void;
}

export default function LocalGame({ player1, player2, onGameEnd }: GameProps) {
    const handleGameEnd = (winner: string) => {
        let nameWin: string;
        if (winner == 'player 1')
            nameWin = player1
        else
            nameWin = player2
    };

    return (
        <div className="w-[85%] h-[80vh] flex justify-center items-center flex-col mt-[5vh] ml-[32px]
                        space-y-[20px] md:border md:border-white md:border-opacity-30
                        md:bg-black md:bg-opacity-20
                        md:rounded-[50px]">
            <Player1 name={player1 ?? "Player 1"} gameStarted={true} /> 
            <Table onGameEnd={handleGameEnd}/>
            <Player2 name={player2 ?? "Player 2"} gameStarted={true} />
        </div>
    );
}