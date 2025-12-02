import React, { createContext, useState, useContext } from 'react'
const ChatContext = createContext();

// Initial data 
const initialChats = [
  {
    id: 1,
    name: 'Tiranaga Liyanage',
    action: 'React Hooks Help',
    message: 'Thanks for the help with React',
    time: '2m ago',
    unread: 2,
    color: 'bg-gray-200',
    messages: [
      { id: 1, text: "Hi! I need some help with React Hooks.", time: "10:30 AM", sender: 'Tiranaga Liyanage' },
      { id: 2, text: "Sure! I'd be happy to help. What specifically are you working on?", time: "10:32 AM", sender: 'me' },
      { id: 3, text: "I'm trying to implement useEffect for API calls but getting infinite loops.", time: "10:33 AM", sender: 'Tiranaga Liyanage' },
      { id: 4, text: "Ah, that's a common issue. You probably need to add dependencies to your useEffect array. Can you share your code?", time: "10:35 AM", sender: 'me' }
    ]
  },
  {
    id: 2,
    name: 'Dinil Hansara',
    action: 'UI/UX Design Review',
    message: 'Can we schedule a call tomorrow?',
    time: '1h ago',
    unread: 0,
    color: 'bg-blue-200',
    messages: [
      { id: 1, text: "Hey! Just wanted to follow up on the UI/UX review.", time: "1h ago", sender: 'Dinil Hansara' },
      { id: 2, text: "Hi Dinil, yes! I have some feedback ready. Can we schedule a call tomorrow?", time: "55m ago", sender: 'me' }
    ]
  },
  {
    id: 3,
    name: 'Isira Dilum',
    action: 'Mobile App Design',
    message: "I've attached the design files",
    time: '3h ago',
    unread: 1,
    color: 'bg-green-200',
    messages: [
      { id: 1, text: "Hi, I've attached the design files for the mobile app. Let me know what you think!", time: "3h ago", sender: 'Isira Dilum' },
      { id: 2, text: "Thanks, Isira! Downloading them now. I'll get back to you by EOD.", time: "2h ago", sender: 'me' }
    ]
  }
];



// Provider component
export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState(initialChats);
  const [selectedChat, setSelectedChat] = useState(initialChats[0]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const value = {
    chats,
    selectedChat,
    setChats,
    onSelectChat: handleSelectChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// custom hook
export const useChat = () => {
  return useContext(ChatContext);
};