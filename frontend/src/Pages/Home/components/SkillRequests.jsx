import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

export default function SkillRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchFeaturedRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const fetchFeaturedRequests = async () => {
    try {
      // If logged in, personalize by user skills using /api/skill-requests
      if (isAuthenticated && (user?.id || user?._id || user?.userId)) {
        const uid = user.id || user._id || user.userId;
        const res = await fetch(`http://localhost:5000/api/skill-requests?userId=${uid}`);
        const data = await res.json();
        if (data.success) {
          // Show only top 2 matching requests
          setRequests((data.requests || []).slice(0, 2));
        } else {
          setRequests([]);
        }
      } else {
        // Fallback to featured list when not authenticated
        const response = await fetch("http://localhost:5000/api/skill-requests/featured?limit=2");
        const data = await response.json();
        if (data.success) {
          setRequests(data.requests || []);
        } else {
          setRequests([]);
        }
      }
    } catch (error) {
      console.error("Error fetching featured requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "text-red-700 border-red-300 bg-red-50";
      case "High":
        return "text-red-700 border-red-300 bg-red-50";
      case "Medium":
        return "text-yellow-700 border-yellow-300 bg-yellow-50";
      case "Low":
        return "text-blue-700 border-blue-300 bg-blue-50";
      default:
        return "text-gray-700 border-gray-300 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-3 rounded-xl border border-purple-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-3">
        {requests.length > 0 ? (
          requests.map((r) => (
            <div
              key={r._id}
              className="p-3 rounded-xl border border-purple-100 hover:border-purple-300 hover:bg-purple-50/30 transition cursor-pointer"
              onClick={() => navigate("/skill-request")}
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <p className="font-medium text-gray-900 text-sm flex-1">{r.title}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-lg border whitespace-nowrap ${getPriorityColor(r.priority)}`}
                >
                  {r.priority}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {r.category}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No requests available</p>
        )}
      </div>

      <button 
        onClick={() => navigate("/skill-request")}
        className="w-full mt-4 py-2 text-sm rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition font-medium"
      >
        View All Requests →
      </button>
    </div>
  );
}
