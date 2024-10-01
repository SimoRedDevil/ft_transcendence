import { Player1, Player2, player } from './Object';
import { Walls , walls} from './Object';
import p5 from 'p5';

export function UpPaddle(sketch: p5, Walls: walls, socket: WebSocket):void{

    sketch.fill("#00A88C");
    sketch.stroke("#58FFE3");
    if (sketch.keyIsPressed)
    {
      if (sketch.keyIsDown(68))
        if (socket)
        {
          socket.send(JSON.stringify({type: 'move', direction: 'right'}));
        }
      if (sketch.keyIsDown(65))
        if (socket)
        {
          socket.send(JSON.stringify({type: 'move', direction: 'left'}));
        }
    }
}
    
export function DownPaddle(sketch: p5, Walls: walls):void{
      
      sketch.fill("#00A88C");
      sketch.stroke("#58FFE3");
      if (sketch.keyIsDown(sketch.RIGHT_ARROW))
      {
        if (Player2.x + Player2.paddleWidth + Player2.speedPaddle > Walls.wallsWidth - 4)
          Player2.x = Walls.wallsWidth - Player2.paddleWidth - 4;
        else
          Player2.x += Player2.speedPaddle;
      }
      else if (sketch.keyIsDown(sketch.LEFT_ARROW))
        {
          if (Player2.x - Player2.speedPaddle < 4)
            Player2.x = 4;
          else
          Player2.x -= Player2.speedPaddle;
      }
      sketch.rect(Player2.x,  Player2.y, Player2.paddleWidth, Player2.paddleHeight , 0, 0, 50, 50);
}