"use client"

import React, { useEffect, useRef , useState} from 'react';
import dynamic from 'next/dynamic';
import { useUserContext } from '../../../components/context/usercontext';
import Platform from '@/components/Platform';
import Versus from '@/components/Versus';
import Table from '../../../components/TableGame';
import Winner from '@/components/Winner';

interface player {
    player_id: string;
    name: string;
}

export default function Game() {
    const {authUser, loading} = useUserContext();
    const [id_channel, setIdChannel] = useState('');
    const [matchready, setMatchReady] = useState(false);
    const [winer, setWinner] = useState('');
    const [scoreWinner, setScoreWinner] = useState('');
    const [scoreLoser, setScoreLoser] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [game_roum, setGameRoom] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    const handleGameEnd = (winner, scoreWinner, scoreLoser) => {
        setWinner(winner);
        setScoreWinner(scoreWinner);
        setScoreLoser(scoreLoser);
        setGameOver(true);
        
    };
    useEffect(() => {
        if (typeof window !== 'undefined') {
            socketRef.current = new WebSocket('ws://localhost:8000/ws/game/');
            socketRef.current.onopen = () => {
                console.log('WebSocket connected');
                socketRef.current.send(JSON.stringify({ type: 'connection', username: authUser.username }));
            }
            socketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'connection') {
                    
                    console.log(data);
                    setIdChannel(data.player.id);
                }
                if (data.type === 'match_ready') {
                    console.log(data);
                    setGameRoom(data.game_channel);
                    setMatchReady(true);
                }
                if (data.type === 'go_to_game') {
                    setGameStarted(true);
                }
            }
            socketRef.current.onclose = () => {
            }
            socketRef.current.onerror = () => {
            }
        } 
    }, []);
    return (
        <div className='w-[90%] h-[80vh] flex justify-center items-center flex-col  ml-[28px]
                        md:border md:border-white md:border-opacity-30
                        md:bg-black md:bg-opacity-20
                        md:rounded-[50px]'>
        {!gameStarted ? ( !matchready ? (<Platform />) : (<Versus socket={socketRef.current} game_roum={game_roum} username={authUser.username} />)) 
        : (!gameOver ? (<Table playerna={authUser.username} socketRef={socketRef.current}  groupname={game_roum} player_id={id_channel} onGameEnd={handleGameEnd}/>) 
        : (<Winner winer={winer} scoreWinner={scoreWinner} scoreLoser={scoreLoser} />))}
        </div>
    );
}