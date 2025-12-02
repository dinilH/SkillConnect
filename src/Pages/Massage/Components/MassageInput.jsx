import React from 'react';
import { Paperclip, Send } from 'lucide-react';



const MessageInput = () => {
  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
        <span className="font-semibold">• Tip:</span>
        <span>Keep conversations respectful and request-focused</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-gray-400 hover:text-gray-600">
          <Paperclip className="w-5 h-5" />
        </button>
        
        <div className="flex-1 bg-gray-100 rounded-lg flex items-center px-4 py-2">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-1 bg-transparent focus:outline-none text-sm text-gray-700"
          />
        </div>

        <button className="bg-gray-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900 transition-colors">
          <Send className="w-4 h-4" />
          <span className="text-sm font-medium">Send</span>
        </button>
        
      </div>
    </div>
  );
};

export default MessageInput;