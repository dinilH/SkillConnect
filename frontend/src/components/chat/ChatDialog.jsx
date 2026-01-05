import React, { useMemo, useState, useEffect } from 'react';
import { useChat } from '../../Pages/Message/ChatContext';

export default function ChatDialog({ onClose }) {
  const { chats, selectedChat, messages, onSelectChat, onSendMessage, deleteConversation, markAllSeen } = useChat();
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  
  const unreadCount = chats?.reduce((sum, c) => sum + (c.unread || 0), 0) || 0;

  // Handle auto-populated message from notifications
  useEffect(() => {
    const handleAutoMessage = () => {
      const pendingMessage = localStorage.getItem('pending_chat_message');
      if (pendingMessage) {
        setInput(pendingMessage);
        localStorage.removeItem('pending_chat_message');
      }
    };

    // Check for pending message on mount
    handleAutoMessage();

    // Listen for custom event from NotificationBell
    window.addEventListener('openChatWithMessage', handleAutoMessage);

    return () => {
      window.removeEventListener('openChatWithMessage', handleAutoMessage);
    };
  }, []);

  // Check for pending message when conversation changes
  useEffect(() => {
    if (selectedChat) {
      const pendingMessage = localStorage.getItem('pending_chat_message');
      if (pendingMessage) {
        setInput(pendingMessage);
        localStorage.removeItem('pending_chat_message');
      }
    }
  }, [selectedChat]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  if (minimized) {
    return (
      <div className="fixed bottom-0 right-6 z-[60]">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white rounded-t-xl shadow-lg hover:shadow-xl transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
          </svg>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-sm">Messages</span>
            {unreadCount > 0 && <span className="text-xs">({unreadCount} unread)</span>}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="ml-2 hover:bg-white/20 rounded-full p-1 transition"
          >
            ✕
          </button>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMinimized(true)} />

      {/* Dialog */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[700px] lg:w-[900px] h-[85vh] sm:h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white shadow-md">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
            </svg>
            <span className="font-semibold text-lg">Messages</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-1.5 rounded-lg hover:bg-white/20 transition text-sm font-medium" 
              onClick={() => { setMinimized(!minimized); if (!minimized) markAllSeen(); }}
            >
              {minimized ? '⬆ Expand' : '⬇ Minimize'}
            </button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-white/20 transition text-sm font-medium" onClick={onClose}>✕ Close</button>
          </div>
        </div>

        {!minimized && (
          <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] h-[calc(100%-52px)]">
            {/* Left: Chat list */}
            <div className="border-r border-gray-200 overflow-y-auto bg-gray-50">
              {chats && chats.length > 0 ? (
                chats.map((c) => (
                  <div
                    key={c._id}
                    className={`flex items-start gap-3 px-3 py-3 cursor-pointer transition-colors ${
                      selectedChat?._id === c._id 
                        ? 'bg-purple-100 border-l-4 border-purple-600' 
                        : 'hover:bg-white border-l-4 border-transparent'
                    }`}
                    onClick={() => onSelectChat(c)}
                    title={c.name}
                  >
                    <div className={`w-10 h-10 rounded-full ${c.color} flex items-center justify-center text-sm font-semibold text-white shadow`}>
                      {(c.name||'?').slice(0,1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-800 truncate text-sm">{c.name}</span>
                        {c.unread > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-medium">{c.unread}</span>}
                      </div>
                      <div className="text-xs text-gray-600 truncate">{c.message}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-gray-400">{c.time}</span>
                        <button 
                          className="text-[10px] text-gray-400 hover:text-red-600 transition" 
                          onClick={(e) => { e.stopPropagation(); deleteConversation(c._id); }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500 text-center">No conversations yet.</div>
              )}
            </div>

            {/* Right: Message window */}
            <div className="flex flex-col h-full">
              {/* Chat header */}
              {selectedChat && (
                <div className="px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${selectedChat.color} flex items-center justify-center text-sm font-semibold text-white`}>
                      {(selectedChat.name||'?').slice(0,1).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{selectedChat.name}</div>
                      <div className="text-xs text-gray-500">Active now</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
                {selectedChat ? (
                  messages && messages.length > 0 ? (
                    messages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-md ${
                          m.sender === 'me' 
                            ? 'bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white rounded-br-sm' 
                            : 'bg-white border border-gray-300 text-gray-800 rounded-bl-sm'
                        }`}>
                          <div className="text-sm break-words leading-relaxed">{m.text}</div>
                          <div className={`text-[10px] mt-1.5 text-right ${
                            m.sender === 'me' ? 'text-purple-200' : 'text-gray-500'
                          }`}>{m.time}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-gray-500 mt-8">
                      <div className="text-4xl mb-2">👋</div>
                      <div>Say hello to start the conversation!</div>
                    </div>
                  )
                ) : (
                  <div className="text-center text-sm text-gray-500 mt-8">
                    <div className="text-4xl mb-2">💬</div>
                    <div>Select a conversation to start messaging</div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-3 bg-white flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={selectedChat ? 'Type a message…' : 'Select a chat to message'}
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  disabled={!selectedChat}
                />
                <button
                  onClick={handleSend}
                  disabled={!selectedChat || !input.trim()}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}