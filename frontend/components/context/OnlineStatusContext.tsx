'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from './usercontext';

const OnlineStatusContext = createContext(null);

export const OnlineStatusProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [onlineSocket, setOnlineSocket] = useState(null);
    const { t } = useTranslation();
    const {authUser} = useUserContext();

    useEffect(() => {
        console.log('Auth', authUser);
        if (authUser !== null) {
            const ws = new WebSocket("ws://localhost:8000/ws/online/");
            ws.onopen = () => {
              console.log("Connected to online status");
            };
      
            ws.onmessage = (message) => {
              console.log("Message received:", message.data);
            };
      
            ws.onclose = () => {
              console.log("Disconnected from online status");
            };
            setOnlineSocket(ws);
            return () => {
                ws.close();
            };
        }
        else
        {
            if (onlineSocket !== null) {
                onlineSocket.close();
                setOnlineSocket(null);
            }
        }
    }, [authUser]);

    return (
        <OnlineStatusContext.Provider value={{ onlineUsers }}>
            {children}
        </OnlineStatusContext.Provider>
    );
}

export const useOnlineStatus = () => {
    const context = useContext(OnlineStatusContext);
    if (!context) {
        throw new Error('useOnlineStatus must be used within a OnlineStatusProvider');
    }
    return context;
}