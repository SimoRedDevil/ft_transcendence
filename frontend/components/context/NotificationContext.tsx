'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { autocompleteClasses } from '@mui/material';
import { axiosInstance } from '@/utils/axiosInstance';
import { useUserContext } from './usercontext';
import { redirect } from 'next/navigation';
import { Bounce } from 'react-toastify';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [isFriendRequest, setIsFriendRequest] = useState(false);
    const [notificationsLoading, setNotificationsLoading] = useState(true);
    const [notifSocket, setNotifSocket] = useState(null);
    const { t } = useTranslation();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const {authUser} = useUserContext();

    const AcceptInvite = (socket: WebSocket, sender: string, receiver: string) => {
        socket.send(JSON.stringify({"notif_type": "accept_game", "sender": receiver, "receiver": sender,
                        "title": "Accept Game", "description": "I accept your game invitation"
                }));
                const query = new URLSearchParams({
                    type: 'invite',
                    sender: sender,
                    receiver: receiver,
                }).toString();
            
                redirect(`/game/remotegame?${query}`);
    }

    const removeNotifications = (senderId, receiverId) => {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => (notification.sender_info.id !== senderId || notification.receiver_info.id !== receiverId) && notification.notif_type === 'message')
        );
    };

    useEffect(() => {
        if (authUser !== null) {
            const ws = new WebSocket("wss://localhost/ws/notification/");
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
                removeNotifications(newNotification.sender_info.id, newNotification.receiver_info.id);
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