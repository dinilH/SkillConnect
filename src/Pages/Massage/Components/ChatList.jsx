import React from 'react';
import { useChat } from '../ChatContext';

const ChatList = () => {
  const { chats, selectedChat, onSelectChat } = useChat();

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <div 
          key={chat.id} 
          onClick={() => onSelectChat(chat)}
          className={`flex items-start gap-3 p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-200 ${selectedChat?.id === chat.id ? 'bg-gray-300' : ''}`}
        >
         
          <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500 ${chat.color}`}>
            IMG
            {selectedChat?.id === chat.id && <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full translate-x-1 translate-y-1"></span>}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
              <span className="text-xs text-gray-500">{chat.time}</span>
            </div>
            <p className="text-xs text-purple-600 font-medium mb-1 text-left">{chat.action}</p>
            <p className="text-sm text-gray-500 truncate text-left ">{chat.message}</p>
          </div>

          {/* Unread  */}
          {chat.unread > 0 && (
            <div className="bg-gray-900 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full mt-1">
              {chat.unread}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;