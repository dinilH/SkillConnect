import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar.jsx";
import SkillsOnboardingModal from "../../components/SkillsOnboardingModal.jsx";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import {
  PenTool,
  Star,
  FlaskConical,
  X,
  MessageCircle,
  ThumbsUp,
  Eye,
  Upload,
} from "lucide-react"

export default function ProfileOwnerView() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  
  const getAPI = () => {
    return axios.create({
      baseURL: "http://localhost:5000/api",
      withCredentials: true,  // Send cookies with requests
    });
  };

  const [discussions, setDiscussions] = useState([]);
  const [discussionsLoading, setDiscussionsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);

  const [profileData, setProfileData] = useState({
    coverImage: "",
    profileImage: "/user-profile-illustration.png",
    name: "Loading...",
    pronouns: "",
    position: "",
    university: "",
    course: "",
    specialization: "",
    description: "",
    skills: [],
    gpa: null,
  });

  const [editFormData, setEditFormData] = useState(profileData);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const handleOpenEditModal = () => {
    setEditFormData(profileData);
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      const [firstName, ...rest] = editFormData.name.split(" ");
      const lastName = rest.join(" ");

      await getAPI().put(`/profile/${userId}`, {
        pronouns: editFormData.pronouns,
        headline: editFormData.position,
        university: editFormData.university,
        course: editFormData.course,
        specialization: editFormData.specialization,
        about: editFormData.description,
        skills: editFormData.skills,
        profileImage: editFormData.profileImage,
        coverImage: editFormData.coverImage,
      });

      setProfileData(editFormData);
      setShowEditModal(false);
    } catch (err) {
      console.error("Profile update error", err);
      alert("Failed to save profile changes.");
    }
  };

  const handleDeleteSkill = async (index) => {
    try {
      const newSkills = (profileData.skills || []).filter((_, i) => i !== index);
      await getAPI().put(`/profile/${userId}`, { skills: newSkills });
      setProfileData((prev) => ({ ...prev, skills: newSkills }));
      setEditFormData((prev) => ({ ...prev, skills: newSkills }));
    } catch (err) {
      console.error("Delete skill error", err);
      alert("Failed to delete skill.");
    }
  };

  const fetchUserDiscussions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/discussions?authorId=${userId}`);
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

  // Add useEffect to fetch data on mount
  useEffect(() => {
    if (userId) {
      fetchUserDiscussions();
    }
  }, [userId]);

  // Fetch profile data on mount
  useEffect(() => {
    if (!userId) return;

    getAPI().get(`/profile/${userId}`)
      .then(res => {
        const user = res.data?.user || res.data;
        setProfileData({
          coverImage: user.coverImage || "",
          profileImage: user.profileImage || "/placeholder.svg",
          name: `${user.firstName} ${user.lastName}`,
          pronouns: user.pronouns || "",
          position: user.headline || "student",
          university: user.university || "",
          course: user.course || "",
          specialization: user.specialization || "",
          description: user.about || "",
          skills: user.skills || [],
          gpa: user.gpa || null,
        });

        setEditFormData({
          coverImage: user.coverImage || "",
          profileImage: user.profileImage || "",
          name: `${user.firstName} ${user.lastName}`,
          pronouns: user.pronouns || "",
          position: user.headline || "student",
          university: user.university || "",
          course: user.course || "",
          specialization: user.specialization || "",
          description: user.about || "",
          skills: user.skills || [],
          gpa: user.gpa || null,
        });
      })
      .catch(err => {
        console.error("Profile load error:", err);
      });
  }, [userId]);

  // Redirect to home if not authenticated or when user logs out
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate, loading]);

  const avgRating = profileData.skills?.length > 0
    ? (profileData.skills.reduce((sum, s) => sum + (s.rating || 0), 0) / profileData.skills.length).toFixed(1)
    : "N/A";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E8FF] to-white font-sans text-gray-900">
      <NavBar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pt-28">
        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden mb-6">
          {/* Cover Image */}
          <div
            className="h-40 sm:h-48 relative rounded-b-xl overflow-hidden"
            style={
              profileData.coverImage?.startsWith("blob:")
                ? { backgroundImage: `url(${profileData.coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
                : {}
            }
          >
            {!profileData.coverImage?.startsWith("blob:") && profileData.coverImage && (
              <div className={`absolute inset-0 bg-gradient-to-r ${profileData.coverImage}`} />
            )}
            {!profileData.coverImage && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-700" />
            )}
          </div>

          <div className="px-4 sm:px-8 pb-8 relative">
            {/* Avatar */}
            <div className="-mt-16 mb-4 flex justify-between items-end">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md">
                <div className="w-full h-full bg-gradient-to-br from-[#7D4DF4] to-[#A589FD] flex items-center justify-center text-white text-4xl font-bold">
                  {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
              </div>

              <div className="mb-2 hidden sm:block">
                <button
                  onClick={handleOpenEditModal}
                  className="flex items-center gap-2 border border-[#7D4DF4] text-[#7D4DF4] px-4 py-1.5 rounded-full hover:bg-[#E2D0F8] font-semibold text-sm transition-colors"
                >
                  <PenTool className="w-3 h-3" /> Edit Profile
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left: Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profileData.name} <span className="text-gray-500 text-lg font-normal">{profileData.pronouns}</span>
                    </h1>
                  </div>
                  <p className="text-base text-gray-900 font-medium mb-1">{profileData.position}</p>
                  {profileData.course && (
                    <p className="text-sm text-gray-700 font-medium mb-1">
                      {profileData.course}
                      {profileData.specialization && <span className="text-gray-500"> • {profileData.specialization}</span>}
                    </p>
                  )}
                  {profileData.gpa && (
                    <p className="text-lg text-purple-700 font-bold mb-3 mt-2">
                      GPA: {profileData.gpa}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 font-medium">{profileData.university}</p>
                </div>

                {/* About Section */}
                <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-white border border-purple-200">
                  <h3 className="text-sm font-semibold mb-2 text-gray-900">About</h3>
                  {profileData.description ? (
                    <p className="text-sm text-gray-600 leading-relaxed">{profileData.description}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No about section added yet</p>
                  )}
                </div>

                {/* Mobile Edit Button */}
                <button
                  onClick={handleOpenEditModal}
                  className="w-full sm:hidden mb-4 flex items-center justify-center gap-2 border border-[#A589FD] py-2 rounded-full hover:bg-[#E2D0F8] font-semibold text-gray-700 text-sm"
                >
                  Edit Profile
                </button>
              </div>

              {/* Right: Skills */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-base text-gray-900">Skills</h3>
                    <button
                      onClick={() => setShowSkillsModal(true)}
                      className="text-xs px-3 py-1 rounded-full border border-purple-300 text-[#7D4DF4] hover:bg-purple-100 transition-colors"
                    >
                      {profileData.skills && profileData.skills.length > 0 ? "Manage Skills" : "Add Skills"}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {profileData.skills && profileData.skills.length > 0 ? (
                      profileData.skills.slice(0, 5).map((skill, idx) => (
                        <SkillItem
                          key={idx}
                          icon={<FlaskConical className="w-4 h-4" />}
                          title={skill.title}
                          sub={skill.sub ? `(${skill.sub})` : ""}
                          stars={skill.rating || 0}
                          onDelete={() => handleDeleteSkill(idx)}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">No skills listed</p>
                    )}
                  </div>
                  {profileData.skills && profileData.skills.length > 5 && (
                    <button className="w-full mt-4 py-2 text-xs font-semibold text-[#7D4DF4] border-t border-purple-200 hover:bg-purple-100 transition-colors">
                      Show all {profileData.skills.length} skills
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COMMUNITY DISCUSSIONS ================= */}
        {/* Hidden as per user request */}
        {false && (
        <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">My Community Discussions</h2>
          
          {discussionsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse border border-purple-100 rounded-xl p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : discussions.length > 0 ? (
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <DiscussionCard key={discussion._id} discussion={discussion} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No discussions yet</p>
              <p className="text-sm text-gray-400 mt-2">Start a discussion in the community tab</p>
            </div>
          )}
        </div>
        )}
      </main>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          />

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-purple-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-6">

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7D4DF4] focus:border-transparent"
                    placeholder="e.g., John Doe"
                  />
                </div>

                {/* Headline */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Headline</label>
                  <input
                    type="text"
                    value={editFormData.position}
                    onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7D4DF4] focus:border-transparent"
                    placeholder="e.g., student"
                  />
                </div>

                {/* University */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">University</label>
                  <input
                    type="text"
                    value={editFormData.university}
                    onChange={(e) => setEditFormData({ ...editFormData, university: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7D4DF4] focus:border-transparent"
                  />
                </div>

                {/* Course */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
                  <input
                    type="text"
                    value={editFormData.course}
                    onChange={(e) => setEditFormData({ ...editFormData, course: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7D4DF4] focus:border-transparent"
                    placeholder="e.g., Computer Science, Business Administration"
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                  <input
                    type="text"
                    value={editFormData.specialization}
                    onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7D4DF4] focus:border-transparent"
                    placeholder="e.g., Web Development, Machine Learning"
                  />
                </div>

                {/* About */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">About</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7D4DF4] focus:border-transparent"
                  />
                </div>

                {/* Skills (Manage in modal) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Skills</label>
                    <button
                      type="button"
                      onClick={() => setShowSkillsModal(true)}
                      className="text-xs px-3 py-1 rounded-full border border-purple-300 text-[#7D4DF4] hover:bg-purple-100 transition-colors"
                    >
                      {editFormData.skills && editFormData.skills.length > 0 ? "Edit Skills" : "Add Skills"}
                    </button>
                  </div>
                  {editFormData.skills && editFormData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {editFormData.skills.slice(0, 10).map((s, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-white border border-purple-200 text-gray-700">
                          {s.title}{s.sub ? ` (${s.sub})` : ""}
                        </span>
                      ))}
                      {editFormData.skills.length > 10 && (
                        <span className="text-xs text-gray-500">+{editFormData.skills.length - 10} more</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No skills added yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-200 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2 bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white rounded-full font-medium shadow-md hover:opacity-90 hover:shadow-lg transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showSkillsModal && (
        <SkillsOnboardingModal
          isOpen={showSkillsModal}
          onClose={() => setShowSkillsModal(false)}
          onComplete={() => setShowSkillsModal(false)}
          userId={userId}
          onSkillsUpdate={(updatedUser) => {
            const newSkills = updatedUser?.skills || [];
            setProfileData((prev) => ({ ...prev, skills: newSkills }));
            setEditFormData((prev) => ({ ...prev, skills: newSkills }));
          }}
        />
      )}
    </div>
  );
}

// Helper Components
function SkillItem({ icon, title, sub, stars, onDelete }) {
  return (
    <div className="flex items-center justify-between group cursor-default">
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-purple-100 rounded text-[#7D4DF4] transition-colors">{icon}</div>
        <div>
          <p className="text-sm font-bold leading-tight text-gray-800">{title}</p>
          {sub && <p className="text-xs text-gray-500">{sub}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5 mr-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-0.5 rounded-sm">
              <Star className={`w-3 h-3 ${i <= stars ? "fill-yellow-500 text-yellow-500" : "text-gray-200"}`} />
            </div>
          ))}
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete skill"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Render the Skills Onboarding Modal for adding/updating skills
// Place it outside of the main return to keep code organized
function SkillsModalHost({ open, onClose, userId, onUpdated }) {
  if (!open) return null;
  return (
    <SkillsOnboardingModal
      isOpen={open}
      onClose={onClose}
      onComplete={onClose}
      userId={userId}
      onSkillsUpdate={(updatedUser) => {
        if (onUpdated) onUpdated(updatedUser);
      }}
    />
  );
}

function DiscussionCard({ discussion }) {
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
    <div className="border border-purple-100 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer bg-white">
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
