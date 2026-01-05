import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import NavBar from "../../components/NavBar";
import { useAuth } from "../../AuthContext";
import ChatDialog from "../../components/chat/ChatDialog";
import { useChat } from "../Message/ChatContext";

import {
  Star,
  FlaskConical,
  MessageCircle,
  ThumbsUp,
  Eye,
} from "lucide-react"

export default function ProfileViewerView() {
  const { isAuthenticated, loading } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  
  // --- State ---
  const [userData, setUserData] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [discussionsLoading, setDiscussionsLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const { startConversation } = useChat();

  // Redirect to home if not authenticated or when user logs out
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate, loading]);

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchUserDiscussions();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${apiBase}/profile/${userId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setUserData(data.user);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchUserDiscussions = async () => {
    try {
      const response = await fetch(`${apiBase}/discussions?authorId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setDiscussions(data.discussions);
      }
    } catch (error) {
      console.error("Error fetching user discussions:", error);
    } finally {
      setDiscussionsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3E8FF] to-white font-sans text-gray-800">
        <NavBar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600">User not found</p>
        </div>
      </div>
    );
  }

  const profileImage = userData.profileImage ? `http://localhost:5000/${userData.profileImage}` : null;
  const coverImage = userData.coverImage ? `http://localhost:5000/${userData.coverImage}` : null;
  const avgRating = userData.skills?.length > 0
    ? (userData.skills.reduce((sum, s) => sum + (s.rating || 0), 0) / userData.skills.length).toFixed(1)
    : "N/A";

  const handleMessage = async () => {
    if (!startConversation) {
      console.error('Chat context not available');
      return;
    }
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

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3E8FF] to-white font-sans text-gray-800">

        <NavBar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pt-28">

          {/* ================= PROFILE CARD ================= */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden mb-6">
            {/* Cover Image */}
            <div className="h-40 sm:h-48 bg-gradient-to-r from-slate-500 to-slate-700 relative overflow-hidden">
              {coverImage && (
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              )}
            </div>

            <div className="px-4 sm:px-8 pb-8 relative">
              {/* Avatar and Message Button */}
              <div className="-mt-16 mb-4 flex justify-between items-end">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md">
                  <div className="w-full h-full bg-gradient-to-br from-[#7D4DF4] to-[#A589FD] flex items-center justify-center text-white text-4xl font-bold">
                    {userData.firstName?.[0]?.toUpperCase()}{userData.lastName?.[0]?.toUpperCase()}
                  </div>
                </div>

                <div className="mb-2 hidden sm:block">
                  <button
                    onClick={handleMessage}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white font-semibold text-sm hover:shadow-lg transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Send Message
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Info */}
                <div className="flex-1">
                  <div className="mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {userData.firstName} {userData.lastName} {userData.pronouns && <span className="text-gray-500 text-lg font-normal">({userData.pronouns})</span>}
                      </h1>
                    </div>
                    {userData.headline && (
                      <p className="text-base text-gray-900 font-medium mb-1">{userData.headline}</p>
                    )}
                    {userData.course && (
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        {userData.course}
                        {userData.specialization && <span className="text-gray-500"> • {userData.specialization}</span>}
                      </p>
                    )}
                    {userData.gpa && (
                      <p className="text-sm text-purple-700 font-semibold mb-1">
                        GPA: {userData.gpa}
                      </p>
                    )}
                    {userData.university && (
                      <p className="text-sm text-gray-500 font-medium">{userData.university}</p>
                    )}
                  </div>

                  {/* About Section */}
                  {userData.about && (
                    <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-white border border-purple-200">
                      <h3 className="text-sm font-semibold mb-2 text-gray-900">About</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {userData.about}
                      </p>
                    </div>
                  )}

                  {/* Mobile Message Button */}
                  <button
                    onClick={handleMessage}
                    className="w-full sm:hidden mb-4 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Send Message
                  </button>
                </div>

                {/* Right: Skills */}
                <div className="lg:w-80 flex-shrink-0">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-base mb-4 text-gray-900">Skills</h3>
                    <div className="space-y-3">
                      {userData.skills && userData.skills.length > 0 ? (
                        userData.skills.slice(0, 5).map((skill, idx) => (
                          <SkillItem
                            key={idx}
                            icon={<FlaskConical className="w-4 h-4" />}
                            title={skill.title}
                            sub={skill.sub ? `(${skill.sub})` : ""}
                            stars={skill.rating || 0}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">No skills listed</p>
                      )}
                    </div>
                    {userData.skills && userData.skills.length > 5 && (
                      <button className="w-full mt-4 py-2 text-xs font-semibold text-[#7D4DF4] border-t border-purple-200 hover:bg-purple-100 transition-colors">
                        Show all {userData.skills.length} skills
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        {chatOpen && <ChatDialog onClose={() => setChatOpen(false)} />}
      </div>
  )
}

// --- Helper Components ---

function SkillItem({ icon, title, sub, stars }) {
  return (
      <div className="flex items-center justify-between group cursor-default">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-purple-100 rounded text-[#7D4DF4] transition-colors">{icon}</div>
          <div>
            <p className="text-sm font-bold leading-tight text-gray-800">{title}</p>
            {sub && <p className="text-xs text-gray-500">{sub}</p>}
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-0.5 rounded-sm">
                <Star className={`w-3 h-3 ${i <= stars ? "fill-yellow-500 text-yellow-500" : "text-gray-200"}`} />
              </div>
          ))}
        </div>
      </div>
  )
}

function DiscussionCard({ discussion, navigate }) {
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div 
      onClick={() => navigate('/community')}
      className="border border-purple-100 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer bg-white"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-base text-gray-900 flex-1">{discussion.title}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 ml-2">
          {discussion.category}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{discussion.content}</p>
      
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{discussion.views || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>{discussion.replies || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" />
          <span>{discussion.likes || 0}</span>
        </div>
        <span className="ml-auto">{timeAgo(discussion.createdAt)}</span>
      </div>

      {discussion.tags && discussion.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {discussion.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}