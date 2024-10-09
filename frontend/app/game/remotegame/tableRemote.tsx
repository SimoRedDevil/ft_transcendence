import React, { useRef, useEffect, useState } from 'react';
import {getRandomName} from './Collision';
import p5 from 'p5';
import { player } from './Object';



let playerInfo: player = { player_id: '', name: '' };
let game_channel: string = '';
let paddles = [];

export default function Table() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);



  useEffect(() => {
    if (typeof window !== 'undefined') {
      socketRef.current = new WebSocket('ws://10.11.2.4:8000/ws/game/remotegame');
      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
        const firtsData = { username: getRandomName() , 
                            x: 4/ canvasRef.current.clientWidth,
                            pw: (canvasRef.current.clientWidth/4) / canvasRef.current.clientWidth ,
                            sp: 8 / canvasRef.current.clientWidth,};
        socketRef.current.send(JSON.stringify({ type: 'connection', data: firtsData }));
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'connection') {
          playerInfo.player_id = data.player.id;
          playerInfo.name = data.player.name;
          console.log('playerInfo after set:', playerInfo);
        }
        if (data.type === 'move') {
          console.log('player move:', data);
        }
        if (data.type === 'start_game') {
          paddles = data.paddles;
          console.log('game start:', paddles);
          game_channel = data.game_channel
        }
        if (data.type === 'paddle_update') {
          paddles[data['playernumber']] = data.paddle;
          console.log('paddle update:', paddles);
        }

      };

      socketRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event);
      };

      socketRef.current.onerror = (event) => {
        console.error('WebSocket error:', event);
      };

      const p = new p5((sketch) => {
        sketch.setup = () => {
          if (canvasRef.current) {
            sketch.createCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
          }
        };


        sketch.draw = () => {
          sketch.resizeCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
          sketch.background("#0B4464");
          if (sketch.keyIsPressed)
            {
              if (sketch.keyIsDown(68) && playerInfo)
              {
                console.log('player click', playerInfo.name, playerInfo.player_id);
                socketRef.current.send(JSON.stringify({ type: 'move', direction: 'right', player_id: playerInfo.player_id, name: playerInfo.name , game_channel: game_channel}));
              }
              else if (sketch.keyIsDown(65) && playerInfo)
                {
                  socketRef.current.send(JSON.stringify({ type: 'move', direction: 'left', player_id: playerInfo.player_id, name: playerInfo.name , game_channel: game_channel}));
              }
            }
          if (paddles['player1'] && paddles['player2'])
          {
            sketch.fill("#00A88C");
            sketch.stroke("#58FFE3");
            sketch.rect(paddles['player1'].x * canvasRef.current.clientWidth, (canvasRef.current.clientHeight / 20) - canvasRef.current.clientHeight/40, canvasRef.current.clientWidth/4, canvasRef.current.clientHeight / 40, 50, 50, 0, 0);
            sketch.rect(paddles['player2'].x * canvasRef.current.clientWidth, canvasRef.current.clientHeight - canvasRef.current.clientHeight / 20, canvasRef.current.clientWidth/4, canvasRef.current.clientHeight / 40, 0, 0, 50, 50);
          }
        };
      }, canvasRef.current);

      const handleResize = () => {
        if (canvasRef.current) {
          p.resizeCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        p.remove();
        window.removeEventListener('resize', handleResize);
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, []);

  return (
    // @ts-ignore
    <div ref={canvasRef} className="aspect-[3/4] w-[250px]
                                      xs:w-[350px]
                                      ls:w-[380px]
                                      sm:w-[330px]
                                      md:w-[350px]
                                      lm:w-[400px]
                                      2xl:w-[430px]
                                      3xl:w-[530px]
                                      4xl:w-[530px]
                                      rounded-lg overflow-hidden 
                                      border-2 border-teal-300
                                      shadow-[0_0_12px_#fff]"/>
  );
}

