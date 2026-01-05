import ChatSearch from './Components/ChatSearch';
import ChatList from './Components/ChatList';
import MessageWindow from './Components/MessageWindow';
import NavBar from '../../components/NavBar';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatProvider, useChat } from './ChatContext'; 

const MessagePageContent = () => {
  const [searchParams] = useSearchParams();
  const { startConversation, currentUser, loading, chats } = useChat();
  const userIdFromUrl = searchParams.get('userId');
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    // Auto-start conversation if userId is in URL and context is ready
    if (userIdFromUrl && currentUser?.id && !loading && !isStarting) {
      console.log('Starting conversation with:', userIdFromUrl);
      console.log('Current user:', currentUser?.id);
      console.log('Loading:', loading);
      
      setIsStarting(true);
      startConversation(userIdFromUrl).then(() => {
        setIsStarting(false);
      }).catch((err) => {
        console.error('Error starting conversation:', err);
        setIsStarting(false);
      });
    }
  }, [userIdFromUrl, currentUser?.id, loading]);

  // Show loading state while initializing
  if (loading || (userIdFromUrl && isStarting)) {
    return (
      <div className="w-6xl flex flex-col h-screen bg-white font-sans">
        <NavBar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-6xl flex flex-col h-screen bg-white font-sans">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl flex overflow-hidden border border-white">
          <div className="w-1/3 max-w-xs flex flex-col border-r border-gray-200 bg-white h-full">
            <ChatSearch />
            <div className="flex-1 overflow-hidden relative">
              <ChatList />
            </div>
          </div>
          <div className="flex-1 h-full bg-white">
            <MessageWindow />
          </div>
        </div>
      </div>
    </div>
  );
};

const MessagePage = () => {
  return (
    <ChatProvider>
      <MessagePageContent />
    </ChatProvider>
  );
};

export default MessagePage;