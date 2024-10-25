'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../../utils/axiosInstance';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const ws = useRef(null);

    const [messages, setMessages] = useState([]);
    const [Conversations, setConversations] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationsLoading, setConversationsLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [otherUser, setOtherUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat/');
        ws.current.onopen = () => {
            console.log('Connected to the chat server');
        };
        ws.current.onmessage = (message) => {
            const newMessage = JSON.parse(message.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };
        ws.current.onclose = () => {
            console.log('Disconnected from the chat server');
        };
        ws.current.onerror = (error) => {
            console.error('Error:', error);
        };
        return () => {
            ws.current.readyState === WebSocket.OPEN && ws.current.close();
        };
    }, []);

    const fetchMessages = async () => {
        try {
            setMessagesLoading(true);
            axiosInstance.get(`/chat/messages/`, 
                { params: { conversation_id: selectedConversation.id } }
            ).then((response) => {
                setMessages(response.data)
            })
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError(error);
        } finally {
            setMessagesLoading(false);
        }
    };

    const fetchConversations = async () => {
        try {
            setConversationsLoading(true);
            axiosInstance.get('/chat/conversations/').then((response) => {
                setConversations(response.data)
            })
        }
        catch (error) {
            console.error('Error fetching conversations:', error);
            setError(error);
        }
        finally {
            setConversationsLoading(false);
        }
    }

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages();
        }
    }, [selectedConversation])

    return (
        <ChatContext.Provider value={{ messages, Conversations, conversationsLoading, messagesLoading,
            error, selectedConversation, otherUser, ws, fetchMessages, fetchConversations, setSelectedConversation, setOtherUser }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (context === null) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
}