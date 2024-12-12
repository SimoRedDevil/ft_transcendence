'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { autocompleteClasses } from '@mui/material';
import { redirect } from 'next/navigation';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const notif_socket = useRef(null);
    const { t } = useTranslation();

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

    useEffect(() => {
        notif_socket.current = new WebSocket('wss://localhost/ws/notification/');
        notif_socket.current.onopen = () => {
            console.log('Connected to notifications');
        };
        notif_socket.current.onmessage = (message) => {
            const newNotification = JSON.parse(message.data);

        const Msg = ({sender, socket, receiver}) => (
            console.log("hehrerhehrehrehrehre" ,sender, receiver, socket),
            <div className='flex justify-end flex-col'>
                <p className='text-xs'>{t(`You have been invited to a game by ${sender}`)}</p>
                <div className='flex justify-around items-center w-full'>
                    <button onClick={
                        () => {
                            socket.send(JSON.stringify({"notif_type": "reject_game", "sender": receiver, "receiver": sender,
                        "title": "Reject Game", "description": "I reject your game invitation"
                        }));
                        }
                    }>Reject</button>
                    <button onClick={
                        () => {
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

                    }>Accept</button>
                </div>
            </div>
        );
            console.log(newNotification);
            if (newNotification.notif_type === 'invite_game') {
                toast(<Msg sender={newNotification.sender} receiver={newNotification.receiver} socket={notif_socket.current} />, 
                {

                    autoClose: 8000,
                    theme: "dark",
                    position: 'top-right',
                    style: {
                        width: '300px',
                        height: '100px',  
                    }
                });
            }
            if (newNotification.notif_type === 'accept_game') {
                toast.success(t(`${newNotification.sender} has accepted your game invitation`),
                {
                    autoClose: 8000,
                    position: 'top-right',
                }
            );
                const query = new URLSearchParams({
                    type: 'invite',
                    sender: newNotification.receiver,
                    receiver: newNotification.sender,
                }).toString();
        
                redirect(`/game/remotegame?${query}`);
            }
            if (newNotification.notif_type === 'reject_game') {
                toast.error(t(`${newNotification.sender} has rejected your game invitation`),
                {
                    autoClose: 5000,
                    position: 'top-right',
                    hideProgressBar: false,
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