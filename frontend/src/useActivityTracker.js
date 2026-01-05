import { useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

/**
 * Custom hook to track user activity and update backend
 * Updates activity every 5 minutes and on user interactions
 */
export function useActivityTracker() {
  const { user, isAuthenticated } = useAuth();
  const activityTimeoutRef = useRef(null);
  const updateIntervalRef = useRef(null);

  const updateActivity = async (isOnline = true) => {
    if (!isAuthenticated || !user) return;

    try {
      await fetch(`http://localhost:5000/api/users/${user.id || user.userId}/activity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ isOnline })
      });
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const handleUserActivity = () => {
    // Clear existing timeout
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    // Update activity immediately
    updateActivity(true);

    // Set user as inactive after 5 minutes of no activity
    activityTimeoutRef.current = setTimeout(() => {
      updateActivity(false);
    }, 5 * 60 * 1000);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial activity update
    handleUserActivity();

    // Update activity every 5 minutes
    updateIntervalRef.current = setInterval(() => {
      updateActivity(true);
    }, 5 * 60 * 1000);

    // Track user interactions
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // Cleanup
    return () => {
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      
      // Mark user as offline when leaving
      updateActivity(false);
    };
  }, [isAuthenticated, user]);

  return null;
}
