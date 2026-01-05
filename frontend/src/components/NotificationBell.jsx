import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../Pages/Message/ChatContext';
import ApplyToHelpDialog from './ApplyToHelpDialog';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { startConversation, onSendMessage } = useChat();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/skill-requests/notifications/${user.id || user.userId}`,
        {
          credentials: 'include'
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleViewResponse = (notification) => {
    setShowDropdown(false);
    // Navigate to skill request page and trigger opening the response dialog for this request
    navigate('/skill-request', { 
      state: { 
        openResponsesForRequest: notification.requestId 
      } 
    });
  };

  const unreadCount = notifications.length;

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative p-2 text-white hover:bg-white/20 rounded-full transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {showDropdown && createPortal(
          <>
            <div 
              className="fixed inset-0 z-[100] bg-black/20" 
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(false);
              }}
            />
            <div className="fixed top-20 right-6 w-80 bg-white rounded-xl shadow-2xl border border-purple-200 z-[101] max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-purple-100">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className="p-4 hover:bg-purple-50 transition cursor-pointer"
                      onClick={() => notif.type === 'response_received' ? handleViewResponse(notif) : navigate('/skill-request')}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          {notif.type === 'response_received' ? (
                            <>
                              <p className="font-semibold text-sm text-purple-700">
                                {notif.fromUser?.firstName} {notif.fromUser?.lastName}
                              </p>
                              <p className="text-sm text-gray-900 mt-1">
                                Wants to help with:{' '}
                                <span className="font-medium">{notif.requestTitle}</span>
                              </p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notif.message}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-semibold text-sm text-green-700">
                                ✓ Response Accepted
                              </p>
                              <p className="text-sm text-gray-900 mt-1">
                                <span className="font-medium">{notif.fromUser?.firstName}</span> accepted your offer to help
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Request: <span className="font-medium">{notif.requestTitle}</span>
                              </p>
                            </>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {notif.type === 'response_received' && (
                          <div className="flex flex-col gap-1">
                            <button className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition">
                              View
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>,
          document.body
        )}
      </div>
    </>
  );
}
