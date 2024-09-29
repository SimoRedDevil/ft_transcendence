import React, { useRef, useEffect } from 'react';
import { walls } from './Object';
import p5 from 'p5';

export function Score1(sketch: p5, Walls : walls,  Scor1: number):void {
    sketch.fill(200, 20);
    sketch.stroke(0, 36);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.textSize(Walls.wallsWidth / 3);
    sketch.text(Scor1, Walls.wallsWidth / 2, Walls.wallsHeight / 4);
}

export function Score2(sketch: p5, Walls : walls,  Scor1: number):void {
    sketch.fill(200, 20);
    sketch.stroke(0, 36);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.textSize(Walls.wallsWidth / 3);
    sketch.text(Scor1, Walls.wallsWidth / 2, 3 * (Walls.wallsHeight / 4));
}
