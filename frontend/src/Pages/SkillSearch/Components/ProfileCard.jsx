import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button2 from '../../../components/ui/button';
import RequestHelpModal from "./RequestHelpModal";

export default function ProfileCard({ user }) {
  const navigate = useNavigate();
  const [showRequestModal, setShowRequestModal] = useState(false);

  const handleViewProfile = () => {
    navigate(`/profile/${user._id}`);
  };

  const handleRequestHelp = () => {
    setShowRequestModal(true);
  };

  // Extract skill titles from skills array
  const skillTitles = user.skills?.slice(0, 5).map(skill => skill.title) || [];
  
  // Get profile image or show placeholder
  const profileImage = user.profileImage 
    ? `http://localhost:5000/${user.profileImage}` 
    : null;

  return (
    <>
    <div className="
      bg-white rounded-3xl shadow-lg p-6 flex gap-6
      border border-purple-200 hover:shadow-purple-300/40 transition
    ">

      {/* Image Box */}
      <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#6C38FF] via-[#4C2AFF] to-[#EC38F5] flex items-center justify-center text-white font-bold shadow-lg overflow-hidden">
        {profileImage ? (
          <img src={profileImage} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
        ) : (
          <span>{user.firstName?.[0]}{user.lastName?.[0]}</span>
        )}
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-bold text-gray-900 text-left">
          {user.firstName} {user.lastName}
        </h2>

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          ⭐ {user.averageRating || "N/A"}
          <span>•</span>
          <div className="flex items-center gap-1">⏱ {user.responseTime || "Unknown"}</div>
          {user.isOnline && (
            <>
              <span>•</span>
              <span className="text-green-600 font-semibold">● Online</span>
            </>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {skillTitles.length > 0 ? (
            skillTitles.map((skill, idx) => (
              <span
                key={idx}
                className="
                  px-3 py-1 text-xs font-semibold rounded-xl
                  text-purple-700 border border-purple-500
                  shadow-md
                "
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No skills listed</span>
          )}
        </div>

        {user.headline && (
          <p className="text-sm mt-3 text-gray-700 text-left">
            {user.headline}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <Button2 onClick={handleViewProfile}>
          View Profile
        </Button2>

        <button
          onClick={handleRequestHelp}
          className="px-4 py-2 rounded-xl border border-purple-300 transition hover:brightness-90"
          style={{ backgroundColor: '#b4a4e7ff', color: 'white' }}
        >
          Request Help
        </button>
      </div>

    </div>
    
    {showRequestModal && (
      <RequestHelpModal
        targetUser={user}
        onClose={() => setShowRequestModal(false)}
        onRequestCreated={() => {
          // Optionally handle post-creation actions
          console.log("Help request created");
        }}
      />
    )}
    </>
  );
}
