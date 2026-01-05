import React from 'react';

const MessageBubble = ({ isOwn, text, time }) => {
  return (
    <div className={`flex flex-col mb-4 ${isOwn ? 'items-end' : 'items-start'}`}>
      
      <div 
        className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md
        ${
          isOwn 
            ? 'bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white rounded-br-sm' 
            : 'bg-white border border-gray-300 text-gray-800 rounded-bl-sm'
        }`}
      >
        <div className="break-words">{text}</div>
      </div>
      
      <span className={`text-xs mt-1.5 mx-2 ${
        isOwn ? 'text-purple-600' : 'text-gray-500'
      }`}>{time}</span>
    </div>
  );
};

export default MessageBubble;