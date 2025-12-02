import React from 'react';

const MessageBubble = ({ isOwn, text, time }) => {
  return (
    <div className={`flex flex-col mb-6 ${isOwn ? 'items-end' : 'items-start'}`}>
      
      <div 
        className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed text-left
        ${isOwn 
          ? 'bg-purple-800 text-white rounded-tr-none' 
          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
        }`}
      >
        {text}
      </div>
      
      <span className="text-xs text-gray-400 mt-1 mx-1">{time}</span>
    </div>
  );
};

export default MessageBubble;