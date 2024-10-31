"use client"

import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";

const Table = dynamic(() => import('./Table'), { ssr: false });
const Player1 = dynamic(() => import('./Player1'), { ssr: false });
const Player2 = dynamic(() => import('./Player2'), { ssr: false });

export default function Game() {
    return (
        <div className="flex justify-center items-center">
            <div className="w-[85%] h-[80vh] flex justify-center items-center flex-col mt-[5vh]
                            space-y-[20px]
                            md:border md:border-white md:border-opacity-30
                             md:bg-black md:bg-opacity-20
                            md:rounded-[50px]">
                        <Player1 name="Player 1" gameStarted={true} /> 
                        <Table />
                        <Player2 name="Player 2" gameStarted={true} />
            </div>
        </div>
    );
}