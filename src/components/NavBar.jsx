import { useState } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Home" },
    { label: "Skill Search" },
    { label: "Skill Request" },
    { label: "Community" },
  ];

  return (
    <nav
      className="
        fixed top-4 left-1/2 -translate-x-1/2
        w-[90%] max-w-5xl
        z-50
        flex items-center justify-between
        px-4 md:px-6 py-3
        bg-[#7D4DF4]/50 
        backdrop-blur-1xl
        rounded-3xl
        border border-white/30
        shadow-lg shadow-[#7D4DF4]/30
      "
    >
      {/* Left: Brand */}
      <div className="text-white font-semibold text-xl tracking-wide">
        SkillLink
      </div>

      {/* Middle: Nav Links (desktop) */}
       <div className="hidden md:flex gap-8 text-white text-md font-medium">
        {links.map((l) => (
          <span
            key={l.label}
            className="text-white/90 hover:text-[#A589FD] transition cursor-default select-none"
          >
            {l.label}
          </span>
        ))}
      </div>

      {/* Right: Profile + Auth Buttons */}
      <div className="flex items-center gap-3">
        <FaUserCircle className="text-white text-2xl cursor-pointer hover:text-[#A589FD] transition" />

        <button className="hidden sm:inline-block px-4 py-1 rounded-xl text-white font-semibold 
          bg-linear-to-r from-[#27229f] to-[#7D4DF4] shadow-md shadow-[#7D4DF4]/40 
          hover:opacity-80 transition">
          Sign In
        </button>

        <button className="hidden sm:inline-block px-4 py-1 rounded-xl text-white font-semibold 
          bg-linear-to-r from-[#7D4DF4] to-[#A589FD] shadow-md shadow-[#7D4DF4]/40 
          hover:opacity-90 transition">
          Sign Up
        </button>

        {/* Mobile menu toggle */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((s) => !s)}
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition"
        >
          {open ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
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
              onClick={() => setOpen(false)}
              className="text-left w-full px-3 py-2 rounded-lg text-white hover:bg-white/5 transition"
            >
              {l.label}
            </button>
          ))}

          <div className="flex flex-col sm:flex-row gap-2 mt-2 px-2">
            <button
              onClick={() => setOpen(false)}
              className="w-full px-4 py-2 rounded-xl text-white border border-white/30 hover:bg-white/10 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full px-4 py-2 rounded-xl text-white font-semibold 
                bg-linear-to-r from-[#7D4DF4] to-[#A589FD] shadow-md shadow-[#7D4DF4]/40 hover:opacity-90 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
// ...existing code...