'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { autocompleteClasses } from '@mui/material';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const notif_socket = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        notif_socket.current = new WebSocket('wss://localhost/ws/notification/');
        notif_socket.current.onopen = () => {
            console.log('Connected to notifications');
        };
        notif_socket.current.onmessage = (message) => {
            const newNotification = JSON.parse(message.data);
            if (newNotification.notif_type === 'invite_game') {
                toast.info(t(`You have been invited to a game by ${newNotification.sender}`),
                {
                    autoClose: 8000,
                    position: 'top-right',
                    transition: Bounce,
                    onClick: () => {
                        // Redirect to game page
                    }
                }
            );
            }
            else if (newNotification.notif_type === 'friend_request') {
                toast.info(t(`${newNotification.description}`),
                {
                    autoClose: 8000,
                    position: 'top-right',
                    transition: Bounce,
                    onClick: () => {
                        // Redirect to friend request page
                    }
                }
            );
            }
            setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
        };
        notif_socket.current.onclose = () => {
            console.log('Disconnected from notifications');
        };
        notif_socket.current.onerror = (error) => {
            console.log(error);
        };
        return () => notif_socket.current.close();
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, notif_socket }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (context === null) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
}