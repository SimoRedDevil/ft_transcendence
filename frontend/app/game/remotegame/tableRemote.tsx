import React, { useRef, useEffect, useState } from 'react';
import { Player1, Player2 } from './Object';
import { Walls, walls } from './Object';
import { UpPaddle, DownPaddle } from './PaddleRemote';
import { Ball, ball } from './Object';
import { Score1, Score2 } from './ScoreRemote';
import { Collision } from './Collision';
import { handleCollision } from './Collision';
import { normalizePlayer } from './Object';
import { denormalizePlayer } from './Object';
import p5 from 'p5';


export default function Table() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  let player1 = {
    x: 0,
  };
  let player2 = {
    x: 0,
  };

  const initializeGame = () => {
    if (canvasRef.current) {
      Ball.initialize(canvasRef.current);
      Walls.initialize(canvasRef.current);
      Player1.initialize(Walls);
      Player2.initialize(Walls);
    }
  };

  const sendInitData = () => {
    const normalizePlayer1 = normalizePlayer(Player1, Walls);
    const normalizePlayer2 = normalizePlayer(Player2, Walls);
    const init_object = {
      'type': 'init',
      walls: Walls,
      player1: normalizePlayer1,
      player2: normalizePlayer2,
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(init_object));
    } else {
      socketRef.current?.addEventListener('open', () => {
        socketRef.current.send(JSON.stringify(init_object));
      });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      socketRef.current = new WebSocket('ws://10.11.8.12:8000/ws/game/remotegame');

      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
      };

      socketRef.current.onmessage = (event) => {
        player1 = JSON.parse(event.data);
        player1.x = player1.x * canvasRef.current.clientWidth;
        console.log(player1['Idgame']);
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

        initializeGame();
        sendInitData();

        sketch.draw = () => {
          sketch.resizeCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight); // Ensure canvas resizes dynamically
          sketch.background("#0B4464");

          Score1(sketch, Walls, Player1.score);
          Score2(sketch, Walls, Player2.score);
          Line(sketch, Walls);
          UpPaddle(sketch, Walls, socketRef.current);

          sketch.rect(player1.x, Player1.y, Player1.paddleWidth, Player1.paddleHeight, 50, 50, 0, 0);
          Ball.ballPosX += Ball.velocityX;
          Ball.ballPosY += Ball.velocityY;

          if (Collision(Ball, Player1)) {
            handleCollision(Ball, Player1, Walls);
            Ball.speedBall += 0.5;
          } else if (Collision(Ball, Player2)) {
            handleCollision(Ball, Player2, Walls);
            Ball.speedBall += 0.5;
          }

          if (Ball.ballPosX <= 0 || Ball.ballPosX + Ball.radius >= Walls.wallsWidth) {
            Ball.velocityX *= -1;
          }
          if (Ball.ballPosY < 0 || Ball.ballPosY > Walls.wallsHeight) {
            Ball.velocityY *= -1;
            if (Ball.ballPosY < 0) Player2.score += 1;
            else Player1.score += 1;
            Ball.initialize(canvasRef.current);
          }

          DownPaddle(sketch, Walls);
          drawBall(sketch, Ball, Walls);
        };
      }, canvasRef.current);

      const handleResize = () => {
        if (canvasRef.current) {
          p.resizeCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
          initializeGame(); 
          sendInitData(); 
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
