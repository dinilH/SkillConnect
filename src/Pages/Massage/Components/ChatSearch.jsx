import React from 'react';
import { Search } from 'lucide-react';

const ChatSearch = () => {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full bg-gray-100 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
      </div>
    </div>
  );
};

export default ChatSearch;