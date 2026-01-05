import React, { useMemo, useState, useEffect } from 'react'
import { FaComments, FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import ChatDialog from './chat/ChatDialog';
import { useChat } from '../Pages/Message/ChatContext';

export default function FloatingChatButton() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const isOnChatPage = location.pathname === '/chat'

  const { chats, startConversation } = useChat();
  const [open, setOpen] = useState(false);

  const unreadTotal = useMemo(() => {
    if (!chats?.length) return 0;
    return chats.reduce((sum, c) => sum + (c.unread || 0), 0);
  }, [chats]);

  // Listen for custom event to open chat dialog with specific user
  useEffect(() => {
    const handleOpenChat = async (event) => {
      const { userId } = event.detail;
      if (userId) {
        await startConversation(userId);
        setOpen(true);
      }
    };

    window.addEventListener('openChatDialog', handleOpenChat);
    return () => {
      window.removeEventListener('openChatDialog', handleOpenChat);
    };
  }, [startConversation]);

  return (
    <>
      <button
        aria-label={isOnChatPage ? "Go back" : "Open chat"}
        title={isOnChatPage ? "Go back" : "Chat"}
        onClick={() => setOpen(true)}
        className={
          `fixed right-6 bottom-6 z-50 flex items-center justify-center
           w-14 h-14 rounded-full shadow-lg
           bg-linear-to-br from-[#7D4DF4] to-[#A589FD]
           text-white text-xl
           hover:scale-105 transform transition-all duration-150
           focus:outline-none focus:ring-4 focus:ring-[#7D4DF4]/30`
        }
      >
        {unreadTotal > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">
            {unreadTotal > 9 ? '9+' : unreadTotal}
          </span>
        )}
        {isOnChatPage ? <FaArrowLeft aria-hidden="true" /> : <FaComments aria-hidden="true" />}
      </button>
      {open && (
        <ChatDialog onClose={() => setOpen(false)} />
      )}
    </>
  )
}
