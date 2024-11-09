"use client"

import dynamic from 'next/dynamic';

const Table = dynamic(() => import('../app/game/Table'), { ssr: false });
const Player1 = dynamic(() => import('../app/game/Player1'), { ssr: false });
const Player2 = dynamic(() => import('../app/game/Player2'), { ssr: false });
interface GameProps {
    player1: string | undefined;
    player2: string | undefined;
}


export default function LocalGame({ player1, player2 }: GameProps) {
    return (
        <div className="w-[85%] h-[80vh] flex justify-center items-center flex-col mt-[5vh]
                        space-y-[20px] md:border md:border-white md:border-opacity-30
                        md:bg-black md:bg-opacity-20
                        md:rounded-[50px]">
                    <Player1 name={player1 ?? "Player 1"} gameStarted={true} /> 
                    <Table />
                    <Player2 name={player2 ?? "Player 2"} gameStarted={true} />
        </div>
    );
}