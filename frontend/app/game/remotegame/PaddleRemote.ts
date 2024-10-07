import { player } from './Object';
import { Walls , walls} from './Object';
import p5 from 'p5';

export function movePaddle(sketch: p5, Player: player, socket: WebSocket):void{

    sketch.fill("#00A88C");
    sketch.stroke("#58FFE3");
    if (sketch.keyIsPressed)
    {
      if (sketch.keyIsDown(68))
        if (socket)
          socket.send(JSON.stringify({type: 'move', direction: 'right', player: Player}));
      if (sketch.keyIsDown(65))
        if (socket)
          socket.send(JSON.stringify({type: 'move', direction: 'left', player: Player}));
    }
}
