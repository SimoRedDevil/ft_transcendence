import React, { useRef, useEffect} from 'react';
import { tableDraw } from './TableDraw';
import {getRandomName} from './TableDraw';
import { movePaddle } from './PaddleRemote';
import p5 from 'p5';
import { player , ball } from './Object';
import { walls } from './Object';




let playerInfo: player = { player_id: '', name: '' };
let game_channel: string = '';
let playeNum: string = '';
let paddles = [];
let Balls: ball = { x: 0, y: 0, radius: 0, color: '', directionX: 0, directionY: 0, speed: 0 };
let socketIsOpen = false;
let gameIsStarted = false;

export default function Table() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      socketRef.current = new WebSocket('ws://10.11.2.2:8000/ws/game/remotegame');
      let Walls : walls = { wallsWidth: canvasRef.current.clientWidth, wallsHeight: canvasRef.current.clientHeight };
      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
        const firtsData = { username: getRandomName() , 
                            x: 4/ Walls.wallsWidth,
                            pw: (Walls.wallsWidth/4) / Walls.wallsWidth ,
                            sp: 8 / Walls.wallsWidth,
                            Walls: Walls};
        socketIsOpen = true;
        socketRef.current.send(JSON.stringify({ type: 'connection', data: firtsData }));
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'connection') {
          playerInfo.player_id = data.player.id;
          playerInfo.name = data.player.name;
        }
        if (data.type === 'start_game') {
          paddles = data.paddles;
          console.log('paddles', paddles);
          Balls = data.ball;
          gameIsStarted = true;
          game_channel = data.game_channel
        }
        if (data.type === 'paddle_update') {
          paddles[data['playernumber']] = data.paddle;
        }
        if (data.type === 'update_ball') {
          Balls = data.ball;
          console.log('update ball', Balls);
        }
        
      };

      socketRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event);
        socketIsOpen = false;
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
          movePaddle(sketch, playerInfo, game_channel, socketRef.current);
          if (paddles['player1'] && paddles['player2'])
            tableDraw(sketch, paddles, Balls ,Walls, playerInfo);
        };
      }, canvasRef.current);

      const handleResize = () => {
        if (canvasRef.current) {
          p.resizeCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
          Walls = { wallsWidth: canvasRef.current.clientWidth, wallsHeight: canvasRef.current.clientHeight };
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
