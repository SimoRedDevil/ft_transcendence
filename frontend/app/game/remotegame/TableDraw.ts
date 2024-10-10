import p5 from 'p5';
import { player } from './Object';
import { walls } from './Object';
import { ball } from './Object';




export function getRandomName(): string {
    const adjectives = [
      "Brave", "Calm", "Delightful", "Eager", "Fancy", 
      "Gentle", "Happy", "Jolly", "Kind", "Lively", 
      "Mighty", "Nice", "Proud", "Quick", "Royal"
    ];
  
    const nouns = [
      "Lion", "Tiger", "Eagle", "Hawk", "Falcon", 
      "Shark", "Wolf", "Bear", "Fox", "Whale", 
      "Panda", "Elephant", "Cheetah", "Leopard", "Rhino"
    ];
  

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `${randomAdjective}`;
  }
  

export function tableDraw(sketch: p5, paddles: any[], Balls: ball ,Walls: walls, playerInofo: player): void {
    
    Score1(sketch, Walls, 0);
    Score2(sketch, Walls, 0);
    sketch.fill("#00A88C");
    sketch.stroke("#58FFE3");
    if (paddles['player1'].chan_name === playerInofo.player_id) {
    sketch.rect(paddles['player2'].x * Walls.wallsWidth, (Walls.wallsHeight / 20) - Walls.wallsHeight/40, Walls.wallsWidth/4, Walls.wallsHeight / 40, 50, 50, 0, 0);
    sketch.rect(paddles['player1'].x * Walls.wallsWidth, Walls.wallsHeight - Walls.wallsHeight / 20, Walls.wallsWidth/4, Walls.wallsHeight / 40, 0, 0, 50, 50);
    }
    else {
      sketch.rect(paddles['player1'].x * Walls.wallsWidth, (Walls.wallsHeight / 20) - Walls.wallsHeight/40, Walls.wallsWidth/4, Walls.wallsHeight / 40, 50, 50, 0, 0);
      sketch.rect(paddles['player2'].x * Walls.wallsWidth, Walls.wallsHeight - Walls.wallsHeight / 20, Walls.wallsWidth/4, Walls.wallsHeight / 40, 0, 0, 50, 50);
    }
    Line(sketch, Walls);
    sketch.fill("#009DFF");
    sketch.stroke("#009DFF");
    sketch.circle(Balls.x * Walls.wallsWidth, Balls.y * Walls.wallsHeight, Walls.wallsHeight / 25);

}

function Line(sketch: p5, Walls: walls):void {
  sketch.fill(200, 20);
  sketch.stroke(100, 128);
  sketch.line(0, Walls.wallsHeight / 2, Walls.wallsWidth, Walls.wallsHeight / 2);
}


function drawBall(sketch: p5, B: any, W: walls):void {
  sketch.fill("#009DFF");
  sketch.stroke("#009DFF");
  sketch.circle(B.x, B.y, W.wallsHeight / 25);
}
function Score1(sketch: p5, Walls : walls,  Scor1: number):void {
  sketch.fill(200, 20);
  sketch.stroke(0, 36);
  sketch.textAlign(sketch.CENTER, sketch.CENTER);
  sketch.textSize(Walls.wallsWidth / 3);
  sketch.text(Scor1, Walls.wallsWidth / 2, Walls.wallsHeight / 4);
}

function Score2(sketch: p5, Walls : walls,  Scor1: number):void {
  sketch.fill(200, 20);
  sketch.stroke(0, 36);
  sketch.textAlign(sketch.CENTER, sketch.CENTER);
  sketch.textSize(Walls.wallsWidth / 3);
  sketch.text(Scor1, Walls.wallsWidth / 2, 3 * (Walls.wallsHeight / 4));
}
