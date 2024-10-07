import React, { useRef, useEffect, useState } from 'react';
import { Player } from './Object';
import { Walls, walls } from './Object';
import { movePaddle } from './PaddleRemote';
import { Ball, ball } from './Object';
import { Score1, Score2 } from './ScoreRemote';
import { Collision } from './Collision';
import { handleCollision } from './Collision';
import { normalizePlayer } from './Object';
import p5 from 'p5';


export default function Table() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const initializeGame = () => {
    if (canvasRef.current) {
      Ball.initialize(canvasRef.current);
      Walls.initialize(canvasRef.current);
      Player.initialize(Walls);
    }
  };


  useEffect(() => {
    initializeGame();
    if (typeof window !== 'undefined') {
      socketRef.current = new WebSocket('ws://10.11.8.12:8000/ws/game/remotegame');

      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
        socketRef.current.send(JSON.stringify({ message: 'connection', player: normalizePlayer(Player, Walls) }));
      };

      socketRef.current.onmessage = (event) => {
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
          sketch.resizeCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight); // Ensure canvas resizes dynamically
          sketch.background("#0B4464");
          Line(sketch, Walls);
          movePaddle(sketch, Player, socketRef.current);
          
          sketch.rect(Player.x, (Walls.wallsHeight / 20) - Player.paddleHeight, Player.paddleWidth, Player.paddleHeight, 50, 50, 0, 0);
        };
      }, canvasRef.current);

      const handleResize = () => {
        if (canvasRef.current) {
          p.resizeCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
          initializeGame();
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

function drawBall(sketch: p5, B: ball, W: walls): void {
  sketch.fill("#009DFF");
  sketch.stroke("#009DFF");
  sketch.circle(B.ballPosX, B.ballPosY, W.wallsHeight / 25);
}

function Line(sketch: p5, Walls: walls): void {
  sketch.stroke(100, 128);
  sketch.line(0, Walls.wallsHeight / 2, Walls.wallsWidth, Walls.wallsHeight / 2);
}
