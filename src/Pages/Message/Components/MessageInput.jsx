import React, { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import Button2 from '../../../components/ui/button';
import { useChat } from '../ChatContext';


const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { onSendMessage } = useChat();

  const handleSend = () => {
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  }

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
        <span className="font-semibold">• Tip:</span>
        <span>Keep conversations respectful and request-focused</span>
      </div>

      <div className="flex items-center gap-3">
        

        <Button2 className="!px-3 !py-3">
          <Paperclip className="w-5 h-5" />
        </Button2>
        

        
        <div className="flex-1 bg-gray-100 rounded-lg flex items-center px-4 py-2 ">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={handleKeyPress}
            placeholder="Type your message..." 
            className="flex-1 bg-transparent focus:outline-none text-sm text-gray-700 "
          />
        </div>

        <Button2 className="flex items-center gap-2" onClick={handleSend}>
          <Send className="w-4 h-4" />
          <span className="text-sm font-medium">Send</span>
        </Button2>
        
      </div>
    </div>
  );
};

export default MessageInput;