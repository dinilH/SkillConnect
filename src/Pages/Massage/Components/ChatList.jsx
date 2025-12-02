import React from 'react';

const ChatList = () => {
  const chats = [
    {
      id: 1,
      name: 'Tiranaga Liyanage',
      action: 'React Hooks Help',
      message: 'Thanks for the help with React',
      time: '2m ago',
      unread: 2,
      isActive: true, // selected
      color: 'bg-gray-200'
    },
    {
      id: 2,
      name: 'Dinil Hansara',
      action: 'UI/UX Design Review',
      message: 'Can we schedule a call tomorrow?',
      time: '1h ago',
      unread: 0,
      isActive: false,
      color: 'bg-gray-200'
    },
    {
      id: 3,
      name: 'Isira Dilum',
      action: 'Mobile App Design',
      message: "I've attached the design files",
      time: '3h ago',
      unread: 1,
      isActive: false,
      color: 'bg-gray-200'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <div 
          key={chat.id} 
          className={`flex items-start gap-3 p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-200 ${chat.isActive ? 'bg-gray-300' : ''}`}
        >
         
          <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500 ${chat.color}`}>
            IMG
            {chat.isActive && <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full translate-x-1 translate-y-1"></span>}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
              <span className="text-xs text-gray-500">{chat.time}</span>
            </div>
            <p className="text-xs text-purple-600 font-medium mb-1">{chat.action}</p>
            <p className="text-sm text-gray-500 truncate">{chat.message}</p>
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