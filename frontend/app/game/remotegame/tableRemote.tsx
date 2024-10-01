import React, { useRef, useEffect, useState } from 'react';
import { Player1, Player2 } from './Object';
import { Walls, walls } from './Object';
import { UpPaddle, DownPaddle } from './PaddleRemote';
import { Ball, ball } from './Object';
import { Score1, Score2 } from './ScoreRemote';
import { Collision } from './Collision';
import { handleCollision } from './Collision';
import p5 from 'p5';

export default function Table() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);


  let data1 = {
    x: 0,
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      socketRef.current = new WebSocket('ws://localhost:8000/ws/game/remotegame');
      
      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
      };

      socketRef.current.onmessage = (event) => {
        data1 = JSON.parse(event.data);
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

        Ball.initialize(canvasRef.current);
         Walls.initialize(canvasRef.current);
          Player1.initialize(Walls);
          Player2.initialize(Walls);
          const init_object = {
            'type': 'init',
            walls: Walls,
            player1: Player1,
          }
          if (socketRef.current.readyState === WebSocket.OPEN)
            socketRef.current.send(JSON.stringify(init_object));
          else {
            socketRef.current.addEventListener('open', () => {
                socketRef.current.send(JSON.stringify(init_object));
            });
        }

        sketch.draw = () => {
          sketch.background("#0B4464");
          Score1(sketch, Walls, Player1.score);
          Score2(sketch, Walls, Player2.score);
          Line(sketch, Walls);
          UpPaddle(sketch, Walls, socketRef.current);
          sketch.rect(data1.x, Player1.y, Player1.paddleWidth, Player1.paddleHeight, 50, 50, 0, 0);
          Ball.ballPosX += Ball.velocityX;
          Ball.ballPosY += Ball.velocityY;
          

          if (Collision(Ball, Player1)) {
            handleCollision(Ball, Player1, Walls);
            Ball.speedBall += 0.5;
          } else if (Collision(Ball, Player2)) {
            handleCollision(Ball, Player2, Walls);
            Ball.speedBall += 0.5;
          } else if (Ball.ballPosX <= 0) {
            Ball.ballPosX = 0;
            Ball.velocityX *= -1;
          } else if (Ball.ballPosX + Ball.radius >= Walls.wallsWidth) {
            Ball.ballPosX = Walls.wallsWidth - Ball.radius;
            Ball.velocityX *= -1;
          } else if (Ball.ballPosY < 0) {
            Ball.initialize(canvasRef.current);
            Ball.velocityY *= -1;
            Player2.score += 1;
          } else if (Ball.ballPosY > Walls.wallsHeight) {
            Ball.initialize(canvasRef.current);
            Ball.velocityY *= -1;
            Player1.score += 1;
          }

          DownPaddle(sketch, Walls);
          drawBall(sketch, Ball, Walls);
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

function drawBall(sketch: p5, B: ball, W: walls):void {
  sketch.fill("#009DFF");
  sketch.stroke("#009DFF");
  sketch.circle(B.ballPosX, B.ballPosY, W.wallsHeight / 25);
}

function Line(sketch: p5, Walls: walls):void {
  sketch.stroke(100, 128);
  sketch.line(0, Walls.wallsHeight / 2, Walls.wallsWidth, Walls.wallsHeight / 2);
}


