import { use } from 'react';
import { getRandomName } from './Collision';
import Game from '../page';

export interface walls {
    
    wallsWidth: number;
    wallsHeight: number;
    initialize(canvas: HTMLCanvasElement): void;
}
export const Walls: walls = {
    wallsWidth: 0,
    wallsHeight: 0,

    initialize: function(canvasR: HTMLCanvasElement): void{
        this.wallsWidth = canvasR.clientWidth;
        this.wallsHeight = canvasR.clientHeight;
    }
};


export interface player {
    x: number;
    y: number;
    paddleWidth: number;
    paddleHeight: number;
    speedPaddle: number;
    game_channel: string;
    self_channel: string;
    username: string;
    player_id: string;
    color: string;
    score: number;
    initialize(Walls: walls): void;
}
export const Player: player = {
    x: 4,
    y: 0,
    paddleWidth: 0,
    paddleHeight:  0,
    speedPaddle: 8,
    username: "",
    game_channel: "",
    player_id: "",
    self_channel: "",
    color: "",
    score: 0,
    initialize: function(Walls: walls): void{
        this.paddleWidth = Walls.wallsWidth/4;
        this.paddleHeight = Walls.wallsHeight/40;
    }
};


export interface ball {
    radius: number;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    ballPosX: number;
    ballPosY: number;
    velocityX: number;
    velocityY: number;
    speedBall: number;
    initialize(canvas: HTMLCanvasElement): void;
}

export const Ball: ball = {
    radius: 0,
    minWidth: 0,
    maxWidth: 0,
    minHeight: 0,
    maxHeight: 0,
    ballPosX: 0,
    ballPosY: 0,
    velocityX: 0,
    velocityY: 5,
    speedBall: 9,

    initialize(canvas: HTMLCanvasElement): void{
        this.radius = (canvas.clientHeight / 25) / 2;
        this.maxWidth = canvas.clientWidth;
        this.maxHeight = canvas.clientHeight;
        this.ballPosY = canvas.clientHeight / 2;
        this.ballPosX = canvas.clientWidth / 2;
        this.velocityX = 0;
        if (this.velocityY < 0)
            this.velocityY = -5;
        else
            this.velocityY = 5;

        this.speedBall = 5;
    }
};

export function normalizePlayer(player: player, walls: walls) {
    return {
      x: player.x / walls.wallsWidth,
      paddleWidth: player.paddleWidth / walls.wallsWidth,
      paddleHeight: player.paddleHeight / walls.wallsHeight,
      speedPaddle: player.speedPaddle / walls.wallsWidth,
      username: getRandomName(),
      self_channel: "",
      player_id: "",
      game_channel: "",
      color: player.color,
      score: player.score,
    };
  }

