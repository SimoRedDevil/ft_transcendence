
import React, { useRef, useEffect, useState} from 'react';
import { tableDraw } from '../app/game/remotegame/TableDraw';
import {getRandomName} from '../app/game/remotegame/TableDraw';
import { movePaddle } from '../app/game/remotegame/PaddleRemote';
import p5 from 'p5';
import { player , ball } from '../app/game/remotegame/Object';
import { walls } from '../app/game/remotegame/Object';
import { countdown } from '../app/game/Score';
import dynamic from 'next/dynamic';



const Player1 = dynamic(() => import('../app/game/remotegame/Player1Remote'), { ssr: false });
const Player2 = dynamic(() => import('../app/game/remotegame/Player2Remote'), { ssr: false });
let playerInfo: player = { player_id: '', name: '' };
let game_channel: string = '';
let playeNum: string = '';
let game_state = {};
let Balls: ball = { x: 0, y: 0, radius: 0, color: '', directionX: 0, directionY: 0, speed: 0 };
let socketIsOpen = false;
let gameIsStarted = false;

interface GameProps {
    playerna: string ;
    socketRef: WebSocket;
    playernambre: string;
    groupname: string;
    id : string;
    player_id: string;
    aliasname: string;
}


export default function TableGame({ playerna, socketRef, playernambre, groupname , id , player_id, aliasname}: GameProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
//   const {users, loading} = useUserContext();
  const [gameStarted, setGameStarted] = useState(false);
  let count = 3; 
  let startTime = 0;
  let Duration = 1000;

  
  useEffect(() => {
    playerInfo.player_id = player_id;
    playerInfo.name = aliasname;
    if (typeof window !== 'undefined') {

      let Walls : walls = { wallsWidth: canvasRef.current.clientWidth, wallsHeight: canvasRef.current.clientHeight };
        const firtsData = { username: playerna , 
                            x: 4/ Walls.wallsWidth,
                            playerNumber: playernambre,
                            y1: (Walls.wallsHeight - Walls.wallsHeight / 20) / Walls.wallsHeight,
                            y2: ((Walls.wallsHeight / 20) - (Walls.wallsHeight/40)) / Walls.wallsHeight,
                            pw: (Walls.wallsWidth/4) / Walls.wallsWidth ,
                            ph: (Walls.wallsHeight/40) / Walls.wallsHeight,
                            sp: 8 / Walls.wallsWidth,
                            dirY: 5/ Walls.wallsHeight,
                            Walls: Walls,
                            id_channel: id,
                            groupname: groupname};
        socketRef.send(JSON.stringify({ type: 'match_tour', data: firtsData }));
      socketRef.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'start_game') {
          console.log('Game Startedddddd');
          game_state = data.game_serialized;
          console.log(game_state);
          game_channel = data.name_channel;
          socketIsOpen = true;
          setGameStarted(true);

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

      socketRef.onclose = (event) => {
        console.log('WebSocket closed:', event);
        socketIsOpen = false;
      };

      socketRef.onerror = (event: Event) => {
        console.log('WebSocket error:', event);
    };
      const p = new p5((sketch) => {
        sketch.setup = () => {
          if (canvasRef.current) {
            sketch.createCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
            startTime = sketch.millis();
          }
        };


        sketch.draw = () => {
          if (canvasRef.current) {
            p.resizeCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        }
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
            movePaddle(sketch, playerInfo, game_channel, socketRef);
            if (game_state['player1'] && game_state['player2'])
              tableDraw(sketch, game_state ,Walls, playerInfo);
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
          movePaddle(sketch, playerInfo, game_channel, socketRef);
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
        if (socketRef) {
          socketRef.close();
        }
      };
    }
  }, []);

  return (
    <div className="flex justify-center items-center">
        <div className="w-[85%] h-[80vh] flex justify-center items-center xl:flex-row  flex-col mt-[5vh]">
                    { gameStarted && (
                      <Player1 
                          image="/images/adil.png"
                          name={game_state['player1'].username || ''} 
                          />
                        )}
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
                        { gameStarted && (
                      <Player2 
                          image="/images/abdellah.png"
                          name={game_state['player2'].username || ''} 
                      />
                    )}
        </div>
    </div>
  );
}
