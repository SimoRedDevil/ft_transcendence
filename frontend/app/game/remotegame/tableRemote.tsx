import React, { useRef, useEffect} from 'react';
import { tableDraw } from './TableDraw';
import {getRandomName} from './TableDraw';
import { movePaddle } from './PaddleRemote';
import p5 from 'p5';
import { player , ball } from './Object';
import { walls } from './Object';
import { countdown } from './ScoreRemote';




let playerInfo: player = { player_id: '', name: '' };
let game_channel: string = '';
let playeNum: string = '';
let game_state = {};
let Balls: ball = { x: 0, y: 0, radius: 0, color: '', directionX: 0, directionY: 0, speed: 0 };
let socketIsOpen = false;
let gameIsStarted = false;

export default function Table() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  let count = 3; 
  let startTime = 0;
  let Duration = 1000;

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      socketRef.current = new WebSocket('ws://10.11.3.5:8000/ws/game/');
      let Walls : walls = { wallsWidth: canvasRef.current.clientWidth, wallsHeight: canvasRef.current.clientHeight };
      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
        const firtsData = { username: getRandomName() , 
                            x: 4/ Walls.wallsWidth,
                            y1: (Walls.wallsHeight - Walls.wallsHeight / 20) / Walls.wallsHeight,
                            y2: ((Walls.wallsHeight / 20) - (Walls.wallsHeight/40)) / Walls.wallsHeight,
                            pw: (Walls.wallsWidth/4) / Walls.wallsWidth ,
                            ph: (Walls.wallsHeight/40) / Walls.wallsHeight,
                            sp: 8 / Walls.wallsWidth,
                            dirY: 5/ Walls.wallsHeight,
                            Walls: Walls,
                            game_channel: game_channel};
        socketRef.current.send(JSON.stringify({ type: 'connection', data: firtsData }));
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'connection') {
          playerInfo.player_id = data.player.id;
          playerInfo.name = data.player.name;
        }
        if (data.type === 'start_game') {
          game_state = data.game_serialized;
          game_channel = data.game_channel;
          socketIsOpen = true;
        }
        if (data.type === 'paddle_update') {
          if (data.playernumber === 1)
            game_state['player1'] = data.paddle;
          else
            game_state['player2'] = data.paddle;
        }
        if (data.type === 'update_ball') {
          game_state['ball'] = data.ball;
          game_state['player1'] = data.player1;
          game_state['player2'] = data.player2;
        }
        if (data.type === 'game_over') {
          console.log('Game Over');
          console.log('Winner:', data.winner);
          game_state = {};
          game_channel = '';
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
            startTime = sketch.millis();
          }
        };


        sketch.draw = () => {
          sketch.resizeCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
          sketch.background("#0B4464");
          if (socketIsOpen) {
            if (!gameIsStarted) {
                const elapsedTime = sketch.millis() - startTime;

                if (elapsedTime >= Duration) {
                    count -= 1;
                    startTime = sketch.millis();

                    if (count <= 0) {
                        gameIsStarted = true;
                        socketIsOpen = false;
                    }
                }

                countdown(sketch, Walls, count);
                return;
            }
              movePaddle(sketch, playerInfo, game_channel, socketRef.current);
              if (game_state['player1'] && game_state['player2'])
                tableDraw(sketch, game_state ,Walls, playerInfo);
            const elapsedTime = sketch.millis() - startTime;

            if (elapsedTime >= Duration) {
                count -= 1;
                startTime = sketch.millis();

                if (count <= 0) {
                    gameIsStarted = true;
                }
            }

            countdown(sketch, Walls, count);
            return;
        }
          movePaddle(sketch, playerInfo, game_channel, socketRef.current);
          if (game_state['player1'] && game_state['player2'])
            tableDraw(sketch, game_state ,Walls, playerInfo);
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
