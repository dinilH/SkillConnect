import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, university, course, specialization

  useEffect(() => {
    fetchLeaderboard();
  }, [filter, user]);

  const fetchLeaderboard = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      
      let url = `${apiBase}/leaderboard?filter=${filter}`;
      
      // Add user's specific filters based on selection
      if (filter === "university" && user.university) {
        url += `&university=${encodeURIComponent(user.university)}`;
      } else if (filter === "course" && user.course) {
        url += `&course=${encodeURIComponent(user.course)}`;
      } else if (filter === "specialization" && user.specialization) {
        url += `&specialization=${encodeURIComponent(user.specialization)}`;
      }

      const response = await fetch(url, {
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setLeaderboardData(data.leaderboard);
      } else {
        setError(data.message || "Failed to fetch leaderboard");
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getFilterTitle = () => {
    switch (filter) {
      case "university":
        return `Top Students at ${user?.university || "Your University"}`;
      case "course":
        return `Top ${user?.course || "Your Course"} Students`;
      case "specialization":
        return `Top ${user?.specialization || "Your Specialization"} Students`;
      default:
        return "Global Top Students";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="text-4xl mb-2">⏳</div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === "all"
              ? "bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          🌍 Global
        </button>
        {user?.university && (
          <button
            onClick={() => setFilter("university")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "university"
                ? "bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🏛️ University
          </button>
        )}
        {user?.course && (
          <button
            onClick={() => setFilter("course")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "course"
                ? "bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📚 Course
          </button>
        )}
        {user?.specialization && (
          <button
            onClick={() => setFilter("specialization")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "specialization"
                ? "bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🎯 Specialization
          </button>
        )}
      </div>

      {/* Title */}
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-[#7D4DF4]" />
        <h3 className="text-lg font-bold text-gray-800">{getFilterTitle()}</h3>
      </div>

      {/* Leaderboard List */}
      {leaderboardData.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-3">🏆</div>
          <p className="text-gray-600">No leaderboard data available yet</p>
          <p className="text-sm text-gray-500 mt-2">Be the first to add your GPA!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {leaderboardData.map((student, index) => {
            const rank = index + 1;
            const isCurrentUser = student._id === user?.id || student._id === user?.userId;

            return (
              <div
                key={student._id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  isCurrentUser
                    ? "bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 shadow-md"
                    : rank <= 3
                    ? "bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  {getRankIcon(rank)}
                </div>

                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7D4DF4] to-[#A589FD] flex items-center justify-center text-white text-base font-bold shadow-md">
                    {student.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
                  </div>
                </div>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-800 truncate">
                      {student.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </h4>
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {student.course && <span>{student.course}</span>}
                    {student.specialization && (
                      <span className="text-gray-400"> • {student.specialization}</span>
                    )}
                  </div>
                </div>

                {/* GPA */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-2xl font-bold text-[#7D4DF4]">{student.gpa?.toFixed(2) || "N/A"}</div>
                  <div className="text-xs text-gray-500">GPA</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
