'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { autocompleteClasses } from '@mui/material';
import { axiosInstance } from '@/utils/axiosInstance';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [isFriendRequest, setIsFriendRequest] = useState(false);
    const [notificationsLoading, setNotificationsLoading] = useState(true);
    const [updateFriendsPage, setUpdateFriendsPage] = useState(false);
    const notif_socket = useRef(null);
    const { t } = useTranslation();
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        notif_socket.current = new WebSocket('ws://localhost:8000/ws/notification/');
        notif_socket.current.onopen = () => {
            console.log('Connected to notifications');
        };
        notif_socket.current.onmessage = (message) => {
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
        <NotificationContext.Provider value={{ notifications, setNotifications, notif_socket, fetchNotifications, isFriendRequest, updateFriendsPage, setUpdateFriendsPage }}>
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