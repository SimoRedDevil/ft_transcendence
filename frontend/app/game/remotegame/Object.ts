import { use } from 'react';
import { getRandomName } from './Collision';
import Game from '../page';

export interface player {
    player_id: string;
    name: string;
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
