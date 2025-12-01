import React from 'react';
import { MoreVertical } from 'lucide-react';
import MessageBubble from './MassageBubble';
import MessageInput from './MassageInput';

const MassageWindow = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
            IMG
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Tiranga Liyanage</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-semibold text-gray-600 hover:text-purple-600">View Profile</button>
          <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
        </div>
      </div>

      {/* Request */}
      <div className="bg-purple-50 px-6 py-3 border-b border-purple-100">
        <span className="text-purple-600 font-medium text-sm">Request: React Hooks Help</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-white">
        
        
        <MessageBubble 
          isOwn={false}
          
          text="Hi! "
          time="10:30 AM"
        />

       
        <MessageBubble 
          isOwn={true}
          sender="Me"
          text="Sure! I'd be happy to help. What specifically are you working on?"
          time="10:32 AM"
        />

        
        <MessageBubble 
          isOwn={false}
          
          text="I'm trying to implement useEffect for API calls but getting infinite loops"
          time="10:33 AM"
        />

        
        <MessageBubble 
          isOwn={true}
          sender="Me"
          text="Ah, that's a common issue. You probably need to add dependencies to your useEffect array. Can you share your code?"
          time="10:35 AM"
        />
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
};

export default MassageWindow;