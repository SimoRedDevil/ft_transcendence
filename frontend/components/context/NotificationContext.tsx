'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { autocompleteClasses } from '@mui/material';
import { axiosInstance } from '@/utils/axiosInstance';
import { useUserContext } from './usercontext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [isFriendRequest, setIsFriendRequest] = useState(false);
    const [notificationsLoading, setNotificationsLoading] = useState(true);
    const [notifSocket, setNotifSocket] = useState(null);
    const { t } = useTranslation();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const {authUser} = useUserContext();

    useEffect(() => {
        if (authUser !== null) {
            const ws = new WebSocket("ws://localhost:8000/ws/notification/");
            ws.onopen = () => {
              console.log("Connected to notification status");
            };
      
            ws.onmessage = (message) => {
                const newNotification = JSON.parse(message.data);
                setIsFriendRequest(false);
                if (newNotification.notif_type === 'invite_game') {
                    toast.info(t(`You have been invited to a game by ${newNotification.sender_info.full_name}`),
                    {
                        autoClose: 8000,
                        position: 'top-right',
                        transition: Bounce,
                        onClick: () => {
                            // Redirect to game page
                        }
                    }
                );
                    return;
                }
                else if (newNotification.notif_type === 'friend_request') {
                    setIsFriendRequest(true);
                    toast.info(t(`${newNotification.description}`),
                    {
                        autoClose: 8000,
                        position: 'top-right',
                        transition: Bounce,
                        onClick: () => {
                            
                        }
                    });
                }
                else if (newNotification.notif_type === 'message') {
                    setIsFriendRequest(true);
                    toast.info(t(`${newNotification.description}`),
                    {
                        autoClose: 8000,
                        position: 'top-right',
                        transition: Bounce,
                        onClick: () => {
                            // Redirect to chat page
                        }
                    });
                }
                setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
            };

            ws.onclose = () => {
              console.log("Disconnected from notification socket");
            };

            ws.onerror = (error) => {
                console.log('Notification socket error: ', error);
            }

            setNotifSocket(ws);
            return () => {
                ws.close();
            }
        }
        else
        {
            if (notifSocket !== null) {
                notifSocket.close();
                setNotifSocket(null);
            }
        }
    }, [authUser]);

    const fetchNotifications = async () => {
        try {
            setNotificationsLoading(true);
            const response = await axiosInstance.get('notifications/');
            if (response.status === 200) {
                setNotifications(response.data);
            }
        }
        catch (error) {
            toast.error(t('Failed to fetch notifications'));
        }
        finally {
            setNotificationsLoading(false);
        }
    }

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, notifSocket, fetchNotifications, isFriendRequest }}>
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