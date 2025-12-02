import ChatSearch from './Components/ChatSearch';
import ChatList from './Components/ChatList';
import MassageWindow from './Components/MassageWindow';
import NavBar from '../../components/NavBar';
import React from 'react';
import { ChatProvider } from './ChatContext'; 

const MassagePage = () => {
  return ( 
    <ChatProvider>
      <div className="w-6xl flex flex-col h-screen bg-white font-sans">
        <NavBar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl flex overflow-hidden border border-white">
            <div className="w-1/3 max-w-xs flex flex-col border-r border-gray-200 bg-white h-full">
              <ChatSearch />
              <div className="flex-1 overflow-hidden relative">
                <ChatList />
              </div>
            </div>
            <div className="flex-1 h-full bg-white">
            
              <MassageWindow />
            </div>
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default MassagePage;