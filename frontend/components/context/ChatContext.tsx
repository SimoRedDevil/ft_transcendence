'use client'

import { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState(null);
    const [Conversations, setConversations] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMessages = async () => {
        try {
            // Fetch messages
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchConversations = async () => {
        try {
            // Fetch conversations
        }
        catch (error) {
            console.error('Error fetching conversations:', error);
            setError(error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <ChatContext.Provider value={{ messages, Conversations, loading, error, fetchMessages, fetchConversations }}>
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