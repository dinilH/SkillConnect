import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useModal } from "../ModalContext.jsx";
import { useFeatureDialog } from "../FeatureDialogContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { openAuthModal } = useModal();
  const { openFeatureDialog } = useFeatureDialog();

  const isActiveLink = (link) => {
    if (link.label === "Dashboard" || link.label === "Home") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === link.to;
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY || window.pageYOffset;
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (currentY > lastScrollY.current && currentY > 60) {
            // scrolling down and passed threshold -> hide
            setVisible(false);
          } else {
            // scrolling up -> show
            setVisible(true);
          }
          lastScrollY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: isAuthenticated ? "Dashboard" : "Home", to: "/", dashboardTo: "/dashboard", requiresAuth: false },
    { label: "Skill Request", to: "/skill-request", requiresAuth: true },
    { label: "Skill Search", to: "/skill-search", requiresAuth: true },
  ];

  const handleLinkClick = (link, e) => {
    if (link.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      openFeatureDialog(link.label);
    } else if (link.label === "Dashboard" || link.label === "Home") {
      e.preventDefault();
      navigate(isAuthenticated ? link.dashboardTo : link.to);
    }
  };

  const handleMobileLinkClick = (link) => {
    setOpen(false);
    if (link.requiresAuth && !isAuthenticated) {
      openFeatureDialog(link.label);
    } else if (link.label === "Dashboard" || link.label === "Home") {
      navigate(isAuthenticated ? link.dashboardTo : link.to);
    } else {
      navigate(link.to);
    }
  };

  return (
    <nav
      className={
        `fixed top-4 left-1/2 -translate-x-1/2
        w-[90%] max-w-5xl
        z-50
        flex items-center
        px-4 md:px-6 py-3
        bg-[#7D4DF4]/50 
        backdrop-blur-1xl
        rounded-3xl
        border border-white/30
        shadow-lg shadow-[#7D4DF4]/30
        transform transition-all duration-300
        ${visible ? 'translate-y-0' : '-translate-y-full'}`
      }
    >
      {/* Mobile menu toggle - Left side */}
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((s) => !s)}
        className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition mr-3"
      >
        {open ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </button>

      {/* Left: Brand */}
      <div className="flex items-center gap-8">
        <Link 
          to={isAuthenticated ? "/dashboard" : "/"} 
          className="text-white font-semibold text-xl tracking-wide" 
          style={{ color: '#fff' }}
        >
          SkillConnect
        </Link>

        {/* Middle: Nav Links (desktop) */}
        <div className="hidden md:flex gap-8 text-white text-md font-medium">
        {links.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            onClick={(e) => handleLinkClick(l, e)}
            className={`transition relative ${
              isActiveLink(l)
                ? 'text-white font-bold'
                : 'text-white/80 hover:text-white'
            }`}
            style={{ color: '#fff' }}
          >
            {l.label}
            {isActiveLink(l) && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></span>
            )}
          </Link>
        ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Right: Profile + Auth Buttons - Fixed position */}
      <div className="flex items-center gap-3 shrink-0">
        {isAuthenticated && (
          <>
            <NotificationBell />
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-2 transition relative ${
                location.pathname === '/profile'
                  ? 'text-white font-bold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <FaUserCircle className="text-2xl" />
              <span className="hidden sm:inline">{user?.name || 'Profile'}</span>
              {location.pathname === '/profile' && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></span>
              )}
            </button>
          </>
        )}

        {!isAuthenticated ? (
          <>
            <button
              onClick={() => openAuthModal('signin')}
              className="hidden sm:inline-block px-4 py-1 rounded-xl text-white font-semibold 
              bg-linear-to-r from-[#27229f] to-[#7D4DF4] shadow-md shadow-[#7D4DF4]/40 
              hover:opacity-80 transition"
              style={{ color: '#fff' }}
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="hidden sm:inline-block px-4 py-1 rounded-xl text-white font-semibold 
              bg-linear-to-r from-[#7D4DF4] to-[#A589FD] shadow-md shadow-[#7D4DF4]/40 
              hover:opacity-90 transition"
              style={{ color: '#fff' }}
            >
              Sign Up
            </button>
          </>
        ) : (
          <button
            onClick={logout}
            className="px-4 py-1.5 rounded-xl font-semibold border-2 border-red-400 text-white bg-transparent transition-all duration-300 hover:bg-red-400/10 hover:border-red-500 hover:text-red-500 whitespace-nowrap"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile menu panel */}
      <div
        className={`absolute left-1/2 top-full -translate-x-1/2 mt-3 w-[90%] max-w-5xl md:hidden
          bg-[#7D4DF4]/15 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg
          transform origin-top transition-all overflow-hidden
          ${open ? "opacity-100 scale-100 max-h-[500px] py-4" : "opacity-0 scale-95 max-h-0 py-0"}
        `}
        aria-hidden={!open}
      >
        <div className="flex flex-col gap-2 px-4">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => handleMobileLinkClick(l)}
              className="text-left w-full px-3 py-2 rounded-lg text-white hover:bg-white/5 transition"
              aria-label={`Go to ${l.label}`}
              style={{ color: '#fff' }}
            >
              {l.label}
            </button>
          ))}

          <div className="flex flex-col sm:flex-row gap-2 mt-2 px-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => { setOpen(false); openAuthModal('signin'); }}
                  className="w-full px-4 py-2 rounded-xl text-white border border-white/30 hover:bg-white/10 transition"
                  style={{ color: '#fff' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setOpen(false); openAuthModal('signup'); }}
                  className="w-full px-4 py-2 rounded-xl text-white font-semibold 
                    bg-linear-to-r from-[#7D4DF4] to-[#A589FD] shadow-md shadow-[#7D4DF4]/40 hover:opacity-90 transition"
                  style={{ color: '#fff' }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={() => { 
                  setOpen(false); 
                  logout(); 
                  navigate("/");
                }}
                className="w-full px-4 py-2 rounded-xl font-semibold bg-red-600 text-white shadow-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
