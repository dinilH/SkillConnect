import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, MessageCircle, User } from 'lucide-react';
import { useChat } from '../ChatContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChatSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { startConversation, currentUser } = useChat();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      setSelectedIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const excludeId = currentUser?.id || '';
        const response = await fetch(
          `${API_URL}/users/search?query=${encodeURIComponent(searchQuery)}&excludeId=${excludeId}`
        );
        const data = await response.json();
        if (data.success) {
          setSearchResults(data.users);
          setShowDropdown(true);
          setSelectedIndex(-1);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, currentUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleUserSelect(searchResults[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleUserSelect = async (user) => {
    setShowDropdown(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedIndex(-1);
    await startConversation(user._id);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Generate avatar color based on user name
  const getAvatarColor = (name) => {
    const colors = [
      'from-violet-500 to-purple-600',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-amber-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-blue-500',
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="p-4 border-b border-gray-100 relative" ref={dropdownRef}>
      {/* Search Header */}
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="h-5 w-5 text-purple-600" />
        <span className="font-semibold text-gray-800">Messages</span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search users to message..."
          className="w-full bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl pl-10 pr-10 py-2.5 
                     border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent
                     transition-all duration-200 placeholder:text-gray-400"
        />
        {searchQuery && (
          <button 
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 
                       hover:bg-gray-200 rounded-full p-1 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && searchResults.length > 0 && (
        <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 
                        max-h-80 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200"
             style={{
               boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
             }}>
          {/* Results Header */}
          <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-gray-100">
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">
              {searchResults.length} user{searchResults.length > 1 ? 's' : ''} found
            </p>
          </div>

          {/* Results List */}
          {searchResults.map((user, index) => (
            <div
              key={user._id}
              onClick={() => handleUserSelect(user)}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-150
                         ${selectedIndex === index 
                           ? 'bg-gradient-to-r from-purple-50 to-violet-50' 
                           : 'hover:bg-gray-50'
                         }
                         ${index !== searchResults.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getAvatarColor(user.firstName)} 
                              flex items-center justify-center text-white font-bold text-sm shadow-md
                              transform transition-transform duration-200 hover:scale-105`}>
                {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  {user.role && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full capitalize">
                      {user.role}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm text-purple-600 font-medium">@{user.username}</span>
                  {user.department && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500 truncate">{user.department}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Message Icon */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </div>
          ))}

          {/* Footer hint */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600 font-mono">↵</kbd> to select or click a user
            </p>
          </div>
        </div>
      )}

      {/* No results message */}
      {showDropdown && searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-6 z-50 text-center"
             style={{
               boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)'
             }}>
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No users found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
        </div>
      )}

      {/* Loading state in dropdown */}
      {showDropdown && isSearching && searchResults.length === 0 && (
        <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-6 z-50 text-center"
             style={{
               boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)'
             }}>
          <Loader2 className="h-8 w-8 text-purple-500 animate-spin mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Searching users...</p>
        </div>
      )}
    </div>
  );
};

export default ChatSearch;