import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "../ModalContext.jsx";
import { useAuth } from "../AuthContext.jsx";

export default function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal } = useModal();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "employee",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const apiBase = (import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:5000/api";

  const handleLogin = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token && data.user) {
        login(data.token, data.user);
        closeAuthModal();
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiBase}/create-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Switch to signin with email prefilled
        setEmail(signupData.email);
        openAuthModal("signin");
      } else {
        setError(data.message || "Failed to create account");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-[95%] max-w-md rounded-2xl bg-[#0b0b12] border border-white/10 shadow-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {authModalMode === "signin" ? "Sign In" : "Create Account"}
              </h2>
              <button
                onClick={closeAuthModal}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-3 rounded-lg bg-red-600/20 border border-red-600/40 text-red-200 px-3 py-2">
                {error}
              </div>
            )}

            {authModalMode === "signin" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#A589FD]"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#A589FD]"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-[#7D4DF4] to-[#A589FD] hover:opacity-90 transition"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
                <div className="text-center text-sm text-purple-200">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => openAuthModal("signup")}
                    className="font-semibold text-white underline hover:text-[#A589FD]"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First name"
                    value={signupData.firstName}
                    onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#A589FD]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={signupData.lastName}
                    onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#A589FD]"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#A589FD]"
                  required
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={signupData.username}
                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#A589FD]"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#A589FD]"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#A589FD]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-[#7D4DF4] to-[#A589FD] hover:opacity-90 transition"
                >
                  {isLoading ? "Creating..." : "Create Account"}
                </button>
                <div className="text-center text-sm text-purple-200">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => openAuthModal("signin")}
                    className="font-semibold text-white underline hover:text-[#A589FD]"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
