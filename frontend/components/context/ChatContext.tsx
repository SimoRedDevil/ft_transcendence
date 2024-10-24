'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../../utils/axiosInstance';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState(null);
    const [Conversations, setConversations] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationsLoading, setConversationsLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [otherUser, setOtherUser] = useState(null);
    const [error, setError] = useState(null);

    const fetchMessages = async () => {
        try {
            setMessagesLoading(true);
            axiosInstance.get(`/chat/messages/${selectedConversation.id}/`).then((response) => {
                setMessages(response.data)
                console.log('Messages:', response.data)
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
            error, selectedConversation, fetchMessages, fetchConversations, setSelectedConversation, setOtherUser }}>
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