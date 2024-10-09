import { player } from './Object';
import p5 from 'p5';


export function movePaddle(sketch: p5, player1: player, player2: player, socket: WebSocket): void {

  sketch.fill("#00A88C");
  sketch.stroke("#58FFE3");
  if (sketch.keyIsPressed) {
    if (sketch.keyIsDown(65)) { 
      if (socket) {
        socket.send(JSON.stringify({ message: 'move', direction: 'left', player: player1 }));
      }
    }
    if (sketch.keyIsDown(68)) { 
      if (socket) {
        socket.send(JSON.stringify({ message: 'move', direction: 'right', player: player1 }));
      }
    }
    
    if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
      if (socket) {
        socket.send(JSON.stringify({ message: 'move', direction: 'left', player: player2 }));
      }
    }
    if (sketch.keyIsDown(sketch.RIGHT_ARROW)) { 
      if (socket) {
        socket.send(JSON.stringify({ message: 'move', direction: 'right', player: player2 }));
      }
    }
  }
}