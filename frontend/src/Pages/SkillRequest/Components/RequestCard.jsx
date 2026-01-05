import Tag from "./Tag";
import PriorityBadge from "./PriorityBadge";
import Button2 from '../../../components/ui/button';
import { useAuth } from "../../../AuthContext";
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../Message/ChatContext';

export default function RequestCard({ data, isOwner, isAssigned = false, onUpdate, onApplyToHelp, autoOpenResponses = false }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { startConversation } = useChat();
  const [showResponsesDialog, setShowResponsesDialog] = useState(false);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (showResponsesDialog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showResponsesDialog]);

  // Auto-open responses dialog if requested (from notification)
  useEffect(() => {
    if (autoOpenResponses && isOwner) {
      setShowResponsesDialog(true);
    }
  }, [autoOpenResponses, isOwner]);

  const handleAcceptResponse = async (responseId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/skill-requests/${data._id}/accept/${responseId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId: user.id || user.userId })
        }
      );

      const result = await response.json();
      if (result.success) {
        alert('Response accepted! Helper has been assigned.');
        if (onUpdate) onUpdate();
        setShowResponsesDialog(false);
      } else {
        alert(result.message || 'Failed to accept response');
      }
    } catch (error) {
      console.error('Error accepting response:', error);
      alert('Failed to accept response');
    }
  };

  const handleDeclineResponse = async (responseId) => {
    if (!confirm('Are you sure you want to decline this response?')) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/skill-requests/${data._id}/decline/${responseId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId: user.id || user.userId })
        }
      );

      const result = await response.json();
      if (result.success) {
        alert('Response declined');
        if (onUpdate) onUpdate();
      } else {
        alert(result.message || 'Failed to decline response');
      }
    } catch (error) {
      console.error('Error declining response:', error);
      alert('Failed to decline response');
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return "Just now";
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    
    return `${Math.floor(days / 30)}mo ago`;
  };



  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this request?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/skill-requests/${data._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: user.id || user.userId,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Request deleted successfully");
        if (onUpdate) onUpdate();
      } else {
        alert(result.message || "Failed to delete request");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete request");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/skill-requests/${data._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: user.id || user.userId,
            status: newStatus,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert(`Request marked as ${newStatus}`);
        if (onUpdate) onUpdate();
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="w-full bg-white backdrop-blur-xl border border-purple-200 shadow-xl rounded-2xl p-6 mb-6 relative">
      {/* Response Count Badge - Only for owner */}
      {isOwner && data.responses?.length > 0 && (
        <button
          onClick={() => setShowResponsesDialog(true)}
          className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all cursor-pointer"
        >
          {data.responses.length} Response{data.responses.length > 1 ? 's' : ''}
        </button>
      )}
      
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900 text-left pr-24">{data.title}</h2>

      {/* Description */}
      <p className="text-gray-700 mt-1 text-left">{data.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {data.tags?.map((t, i) => (
          <Tag key={i} text={t} />
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-6 mt-4 text-sm text-gray-700">
        {data.estimatedTime && (
          <div className="flex items-center gap-1">⏱ {data.estimatedTime}</div>
        )}
        <div className="flex items-center gap-1">
          📊 Status: <span className="font-semibold capitalize">{data.status}</span>
        </div>
      </div>

      {/* Assigned Helper Section - Show for request owner when someone is assigned */}
      {isOwner && data.assignedTo && (
        <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {data.assignedTo.firstName?.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide">✓ Helper Assigned</p>
                <p className="text-sm font-bold text-gray-800">
                  {data.assignedTo.firstName} {data.assignedTo.lastName}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                // Trigger chat dialog to open with this user
                window.dispatchEvent(new CustomEvent('openChatDialog', { 
                  detail: { userId: data.assignedTo._id }
                }));
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold shadow-md shadow-green-300/40 hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Helper
            </button>
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex justify-between items-center mt-5 flex-wrap gap-3">
        <PriorityBadge level={data.priority} />

        <div className="flex gap-2 flex-wrap">
          {isOwner ? (
            <>
              {data.status === "open" && (
                <button
                  onClick={() => handleStatusChange("completed")}
                  className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition"
                >
                  Mark Complete
                </button>
              )}
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </>
          ) : isAssigned ? (
            <button
              onClick={() => {
                // Trigger chat dialog to open with request owner
                window.dispatchEvent(new CustomEvent('openChatDialog', { 
                  detail: { userId: data.author?._id }
                }));
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md shadow-blue-300/40 hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Owner
            </button>
          ) : (
            <button
              onClick={() => onApplyToHelp && onApplyToHelp(data)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white font-semibold shadow-md shadow-purple-300/40 hover:shadow-lg hover:scale-105 transition-all"
            >
              Apply to Help
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-3 text-left">
        Posted by{" "}
        <b>
          {data.author?.firstName} {data.author?.lastName}
        </b>{" "}
        • {getTimeAgo(data.createdAt)}
      </p>

      {/* View Responses Dialog */}
      {showResponsesDialog && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowResponsesDialog(false)}
          />
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl relative sticky top-0 z-10">
              <button
                onClick={() => setShowResponsesDialog(false)}
                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-1">Help Responses</h2>
              <p className="text-purple-100 text-sm">For: {data.title}</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {data.responses?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No responses yet</p>
                </div>
              ) : (
                data.responses.map((response, index) => (
                  <div key={response._id || index} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
                          {response.user?.firstName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {response.user?.firstName} {response.user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(response.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        response.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        response.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {response.status}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <p className="text-sm text-gray-700">{response.message}</p>
                    </div>
                    {response.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={() => handleAcceptResponse(response._id)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition text-sm font-medium shadow-md"
                        >
                          ✓ Accept
                        </button>
                        <button 
                          onClick={() => handleDeclineResponse(response._id)}
                          className="flex-1 px-3 py-2 border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition text-sm font-medium"
                        >
                          ✕ Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
