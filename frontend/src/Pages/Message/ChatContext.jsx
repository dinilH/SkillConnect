import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const ChatContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Provider component
export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [lastSeen, setLastSeen] = useState({}); // { conversationId: isoString }

  // Initialize socket and get current user from localStorage
  useEffect(() => {
    // Get logged in user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      // load last seen map
      const ls = localStorage.getItem(`chat:lastSeen:${user.id}`);
      if (ls) {
        try { setLastSeen(JSON.parse(ls)); } catch {}
      }
    }

    // Initialize socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Register user when socket and currentUser are ready
  useEffect(() => {
    if (socket && currentUser?.id) {
      socket.emit('user_online', currentUser.id);
    }
  }, [socket, currentUser]);

  // Fetch conversations when currentUser is set
  useEffect(() => {
    if (currentUser?.id) {
      fetchConversations();
      fetchUsers();
    }
  }, [currentUser]);

  // Join conversation room when selected
  useEffect(() => {
    if (socket && selectedChat?._id) {
      socket.emit('join_conversation', selectedChat._id);
      fetchMessages(selectedChat._id);

      return () => {
        socket.emit('leave_conversation', selectedChat._id);
      };
    }
  }, [socket, selectedChat?._id]);

  // Listen for new messages
  useEffect(() => {
    if (socket && currentUser?.id) {
      socket.on('new_message', (newMessage) => {
        // Format the message to match our expected structure
        const formattedMessage = {
          id: newMessage._id,
          text: newMessage.text,
          time: formatTime(newMessage.createdAt),
          sender: newMessage.senderId._id === currentUser.id ? 'me' : newMessage.senderId.firstName,
          senderId: newMessage.senderId._id,
        };
        
        setMessages((prev) => [...prev, formattedMessage]);
        
        // Update chat list with last message
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat._id === newMessage.conversationId) {
              const lastTimeIso = new Date(newMessage.createdAt).toISOString();
              const seenTime = lastSeen[newMessage.conversationId];
              const isViewing = selectedChat?._id === newMessage.conversationId;
              const unread = isViewing ? 0 : (lastTimeIso && (!seenTime || new Date(lastTimeIso) > new Date(seenTime)) ? 1 : 0);
              return { ...chat, lastMessage: newMessage.text, lastMessageTime: newMessage.createdAt, unread };
            }
            return chat;
          })
        );
      });

      return () => {
        socket.off('new_message');
      };
    }
  }, [socket, currentUser?.id]);

  // Fetch all users for new chats
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch conversations for the current user
  const fetchConversations = async () => {
    if (!currentUser?.id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/conversations/${currentUser.id}`);
      const data = await response.json();
      if (data.success) {
        // Format conversations for display
        const formattedChats = data.conversations.map((conv) => {
          const otherParticipant = conv.participants.find(
            (p) => p._id !== currentUser.id
          );
          const lastTime = conv.lastMessageTime ? new Date(conv.lastMessageTime).toISOString() : null;
          const seenTime = lastSeen[conv._id];
          const unread = lastTime && (!seenTime || new Date(lastTime) > new Date(seenTime)) ? 1 : 0;
          return {
            ...conv,
            name: otherParticipant 
              ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
              : 'Unknown User',
            otherUser: otherParticipant,
            message: conv.lastMessage || 'No messages yet',
            time: formatTime(conv.lastMessageTime),
            unread,
            color: getRandomColor(),
          };
        });
        setChats(formattedChats);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(`${API_URL}/messages/${conversationId}`);
      const data = await response.json();
      if (data.success) {
        // Format messages for display
        const formattedMessages = data.messages.map((msg) => ({
          id: msg._id,
          text: msg.text,
          time: formatTime(msg.createdAt),
          sender: msg.senderId._id === currentUser?.id ? 'me' : msg.senderId.firstName,
          senderId: msg.senderId._id,
        }));
        setMessages(formattedMessages);
        // mark seen for this conversation
        const nowIso = new Date().toISOString();
        setLastSeen((prev) => {
          const next = { ...prev, [conversationId]: nowIso };
          if (currentUser?.id) localStorage.setItem(`chat:lastSeen:${currentUser.id}`, JSON.stringify(next));
          return next;
        });
        // reset unread locally
        setChats((prev) => prev.map((c) => c._id === conversationId ? { ...c, unread: 0 } : c));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAllSeen = () => {
    const nowIso = new Date().toISOString();
    setLastSeen((prev) => {
      const next = { ...prev };
      chats.forEach((c) => { next[c._id] = nowIso; });
      if (currentUser?.id) localStorage.setItem(`chat:lastSeen:${currentUser.id}`, JSON.stringify(next));
      return next;
    });
    setChats((prev) => prev.map((c) => ({ ...c, unread: 0 })));
  };

  const deleteConversation = async (conversationId) => {
    try {
      const res = await fetch(`${API_URL}/conversations/${conversationId}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setChats((prev) => prev.filter((c) => c._id !== conversationId));
        if (selectedChat?._id === conversationId) setSelectedChat(null);
      }
    } catch (e) {
      console.error('Delete conversation error', e);
    }
  };

  // Create or get conversation with another user
  const startConversation = async (otherUserId) => {
    if (!currentUser?.id) return null;
    
    try {
      const response = await fetch(`${API_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          participant1: currentUser.id,
          participant2: otherUserId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        // Format the conversation for immediate use
        const otherParticipant = data.conversation.participants.find(
          (p) => p._id !== currentUser.id
        );
        const formattedChat = {
          ...data.conversation,
          name: otherParticipant 
            ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
            : 'Unknown User',
          otherUser: otherParticipant,
          message: data.conversation.lastMessage || 'No messages yet',
          time: formatTime(data.conversation.lastMessageTime),
          unread: 0,
          color: getRandomColor(),
        };
        
        // Set selected chat immediately
        setSelectedChat(formattedChat);
        
        // Update chats list
        setChats((prevChats) => {
          const existing = prevChats.find(c => c._id === formattedChat._id);
          if (existing) {
            return prevChats.map(c => c._id === formattedChat._id ? formattedChat : c);
          }
          return [formattedChat, ...prevChats];
        });
        
        return formattedChat;
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
    return null;
  };

  const handleSelectChat = useCallback((chat) => {
    setSelectedChat(chat);
  }, []);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || !selectedChat?._id || !currentUser?.id) return;

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: selectedChat._id,
          senderId: currentUser.id,
          text: messageText,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        console.error('Error sending message:', data.message);
      }
      // Message will be added via socket event
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Helper function to format time
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  // Helper function for random colors
  const getRandomColor = () => {
    const colors = ['bg-gray-200', 'bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-pink-200', 'bg-yellow-200'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const value = {
    chats,
    selectedChat,
    messages,
    users,
    loading,
    currentUser,
    onSelectChat: handleSelectChat,
    onSendMessage: handleSendMessage,
    startConversation,
    refreshConversations: fetchConversations,
    markAllSeen,
    deleteConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// custom hook
export const useChat = () => {
  return useContext(ChatContext);
};