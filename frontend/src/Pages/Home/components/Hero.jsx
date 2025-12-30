import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';
import { useModal } from '../../../ModalContext';

export default function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useModal();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (!isAuthenticated) {
      openAuthModal('signin');
      return;
    }
    if (searchQuery.trim()) {
      navigate(`/skill-search?query=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/skill-search');
    }
  };

  const handleGetStarted = () => {
    openAuthModal('signup');
  };

  return (
    <div className="w-full pt-24">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-[#7D4DF4] to-[#A589FD] text-white py-20">
        <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center leading-tight">
            Find Skilled Students Inside Your University
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-lg md:text-xl text-center max-w-2xl opacity-90">
            Search for designers, developers, tutors, editors, mentors — connect and collaborate instantly.
          </p>

          {/* Search Bar */}
          <div className="mt-10 w-full max-w-xl">
            <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
              <input
                type="text"
                placeholder="Search for a skill (ex: Web Development, UI/UX, Java)"
                className="w-full px-4 py-3 text-gray-700 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                className="bg-[#7D4DF4] text-white px-6 py-3 font-semibold hover:bg-[#6A3DE0] transition"
              >
                Search
              </button>
            </div>
          </div>

          {/* Call-to-action for logged-out users */}
          {!isAuthenticated && (
            <div className="mt-8">
              <button
                onClick={handleGetStarted}
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started Free
              </button>
              <p className="mt-3 text-sm opacity-80">
                Join hundreds of students collaborating on SkillConnect
              </p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
