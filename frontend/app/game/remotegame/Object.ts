

export interface player {
    player_id: string;
    name: string;
}

export interface walls {
    wallsWidth: number;
    wallsHeight: number;
}

export interface ball {
    x: number;
    y: number;
    radius: number;
    color: string;
    directionX: number;
    directionY: number;
    speed: number;
}

// export function normalizePlayer(player: player, walls: walls) {
//     return {
//       x: player.x / walls.wallsWidth,
//       y: player.y / walls.wallsHeight,
//       paddleWidth: player.paddleWidth / walls.wallsWidth,
//       paddleHeight: player.paddleHeight / walls.wallsHeight,
//       speedPaddle: player.speedPaddle / walls.wallsWidth,
//       color: player.color,
//       score: player.score,
//     };
//   }
