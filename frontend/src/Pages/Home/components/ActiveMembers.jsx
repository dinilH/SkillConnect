import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import ChatDialog from "../../../components/chat/ChatDialog";
import { useChat } from "../../../Pages/Message/ChatContext";

export default function ActiveMembers() {
  const [activeMembers, setActiveMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();
  const { startConversation } = useChat();

  useEffect(() => {
    fetchActiveMembers();
    // Refresh every 30 seconds
    const interval = setInterval(fetchActiveMembers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/active?limit=5&minutes=30');
      const data = await response.json();
      if (data.success) {
        setActiveMembers(data.users);
      }
    } catch (error) {
      console.error('Error fetching active members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return "Just now";
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleMessage = async (userId, e) => {
    e.stopPropagation();
    try {
      const conversation = await startConversation(userId);
      if (conversation) {
        // Wait a moment for messages to load
        setTimeout(() => {
          setChatOpen(true);
        }, 100);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="w-full">
        <p className="text-gray-500 text-center text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {activeMembers.length === 0 ? (
        <p className="text-gray-500 text-center py-4 text-sm">No active members</p>
      ) : (
        <div className="space-y-3">
          {activeMembers.map((m) => (
            <div
              key={m._id}
              className="flex items-start gap-3 p-3 rounded-xl border border-purple-100 hover:border-purple-300 hover:bg-purple-50/30 transition cursor-pointer"
              onClick={() => handleProfileClick(m._id)}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#6C38FF] via-[#4C2AFF] to-[#EC38F5] text-white flex items-center justify-center text-xs font-bold shadow">
                  {m.firstName?.[0]}{m.lastName?.[0]}
                </div>
                <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${m.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {m.firstName} {m.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {getTimeAgo(m.lastActive)}
                </p>
              </div>

              <button
                onClick={(e) => handleMessage(m._id, e)}
                className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                title="Message"
              >
                <MessageCircle size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      {chatOpen && <ChatDialog onClose={() => setChatOpen(false)} />}
    </div>
  );
}
