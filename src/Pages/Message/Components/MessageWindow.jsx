import React from 'react';
import { MoreVertical } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useChat } from '../ChatContext';
import Button2 from '../../../components/ui/button';

const MessageWindow = () => {
  const { selectedChat: chat } = useChat();

  if (!chat) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center">
        <div className="text-center text-gray-500">
          <h2 className="text-lg font-semibold">Select a chat to start messaging</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
    
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${chat.color} rounded-full flex items-center justify-center text-xs font-bold text-gray-500`}>
            IMG
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{chat.name}</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button2>
            View Profile
          </Button2>
          <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-purple-600 transition-colors" />
        </div>
      </div>

      {/* Request */}
      <div className="bg-purple-50 px-6 py-3 border-b border-purple-100">
        <span className="text-purple-600 font-medium text-sm">Request: {chat.action}</span>
      </div>

      {/* Messages */}
      


      <div className="custom-scrollbar overflow-y-auto h-screen">
        <div className="flex-1 overflow-y-auto p-6 bg-white "> {/*scroll*/}
        {chat.messages && chat.messages.map((message) => (
          <MessageBubble
            key={message.id}
            isOwn={message.sender === 'me'}
            text={message.text}
            time={message.time}
          />
        ))}
      </div>
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
};

export default MessageWindow;