"use client"

import Table from "./tableRemote";
import Player1 from "./Player1Remote";
import Player2 from "./Player2Remote";
import { useEffect, useRef, createContext } from "react";


export const socketContext = createContext<WebSocket | null>(null);

export default function Game() {
    return (
        <div className="flex justify-center items-center flex-col">
          
        </div>
    );
}

