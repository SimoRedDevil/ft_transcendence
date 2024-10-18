"use client";

import React, { useRef, useEffect, useState } from 'react';
import { getRandomName } from './TableDraw';
import Player1 from './Player1Remote';
import Player2 from './Player2Remote';
import Table from './tableRemote';

export default function Tournament() {
  const socketRef = useRef<WebSocket | null>(null);
  const [allPlayers, setAllPlayers] = useState([]);
  const [game1, setGame1] = useState([]);
  const [game2, setGame2] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      socketRef.current = new WebSocket('ws://10.11.2.2:8000/ws/tournament/');
      
      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
        const firstData = { username: getRandomName() };
        socketRef.current.send(JSON.stringify({ type: 'connection', data: firstData }));
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'connection') {
          console.log('Player connected:', data);
          setName(data.player.name);
        }
        if (data.type === 'tournament_start') {
          setAllPlayers(data.players);
          setGame1(data.players.slice(0, 2));
          setGame2(data.players.slice(2, 4));
        }
      };

      socketRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event);
      };

      socketRef.current.onerror = (event) => {
        console.error('WebSocket error:', event);
      };

      return () => {
        socketRef.current?.close();
      };
    }
  }, []);

  return (
    <section className="flex justify-center items-center flex-col">
       {allPlayers.length !== 4 && <div className="">Tournament</div>}
      {allPlayers.length === 4 && <Table Name={name} socket={socketRef} />}
    </section>
  );
}