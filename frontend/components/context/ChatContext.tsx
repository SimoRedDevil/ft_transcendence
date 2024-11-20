'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../../utils/axiosInstance';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const ws = useRef(null);
    const chatWindowRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [Conversations, setConversations] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationsLoading, setConversationsLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [otherUser, setOtherUser] = useState(null);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const lastMessageRef = useRef(null);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    
    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth < 1024) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/ws/chat/');
        ws.current.onopen = () => {
            
        };
        ws.current.onmessage = (message) => {
            const newMessage = JSON.parse(message.data);
            if (newMessage.type === 'message') {
                console.log('New message:', newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setConversations((prevConversations) => {
                    const updatedConversations = prevConversations.map((conversation) =>
                        conversation.id === newMessage.conversation_id ? { ...conversation, last_message: newMessage.content } : conversation
                    )
                    const updatedConversation = updatedConversations.find(conv => conv.id === newMessage.conversation_id);
                    const otherConversations = updatedConversations.filter(conv => conv.id !== newMessage.conversation_id);
                    setConversations([updatedConversation, ...otherConversations]);
                }
                );
            }
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
            axiosInstance.get(`/chat/messages/?page=${page}`, 
                { params: { conversation_id: selectedConversation.id } }
            ).then((response) => {
                setPageCount(Math.ceil(response.data.count / 10));
                response.data.results.reverse();
                if (page > 1) {
                    setMessages([...response.data.results, ...messages]);
                }
                else {
                    setMessages(response.data.results);
                }
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

    const scrollToLastMessage = () => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages();
        }
    }, [selectedConversation, page]);

    useEffect(() => {
        if (messages.length > 0 && page === 1) {
            scrollToLastMessage();
        }
        else {
            if (chatWindowRef.current && messagesLoading === false) {
                chatWindowRef.current.scrollTo(0, 100);
            }
        }
    }, [messages]);

    return (
        <ChatContext.Provider value={{ messages, Conversations, conversationsLoading, messagesLoading,
            error, selectedConversation, otherUser, ws, isMobile, lastMessageRef, page, pageCount,
            chatWindowRef, setConversations, fetchMessages, fetchConversations, setSelectedConversation, setOtherUser, setPage }}>
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