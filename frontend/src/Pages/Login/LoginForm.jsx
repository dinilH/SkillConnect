import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logoImage from "../../assets/skilllogo.png";

function LoginPageV2() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const res = await fetch(`${apiBase}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Store user and token in localStorage for ChatContext and auth
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/");
                }, 800);
            } else {
                setIsLoading(false);
                alert("Invalid credentials");
            }
        } catch (err) {
            setIsLoading(false);
            alert("Network error");
        }
    };

    return (
        <>
            {/* Animated Gradient Background */}
            <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7D4DF4]/20 via-black to-[#A589FD]/20" />

                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-[#A589FD] rounded-full opacity-60"
                        animate={{
                            y: [0, -300, 0],
                            x: [0, Math.random() * 200 - 100, 0],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 15 + i * 3,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 2,
                        }}
                        style={{
                            left: `${15 + i * 15}%`,
                            bottom: "-20px",
                        }}
                    />
                ))}

                {/* Main Card - Floating & Glowing */}
                <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, type: "spring", stiffness: 80 }}
                    className="relative z-10 w-full max-w-md"
                >
                    <motion.div
                        animate={{
                            y: [0, -12, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl"
                        style={{
                            boxShadow: "0 0 80px rgba(125, 77, 244, 0.3)",
                        }}
                    >
                        {/* Glow Border Effect */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] opacity-30 blur-xl -z-10 animate-pulse" />

                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#7D4DF4] to-[#A589FD] p-1 shadow-xl"
                            >
                                <img
                                    src={logoImage}
                                    alt="SkillConnect"
                                    className="w-full h-full rounded-2xl object-cover"
                                />
                            </motion.div>

                            <h1 className="text-4xl font-bold text-white mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-purple-200">Log in to continue your journey</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:border-[#A589FD] focus:bg-white/15 transition-all duration-300"
                                    required
                                />
                            </motion.div>

                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:border-[#A589FD] focus:bg-white/15 transition-all duration-300 pr-14"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </motion.div>

                            <div className="flex justify-end">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-[#A589FD] hover:text-white transition"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] shadow-lg hover:shadow-[#7D4DF4]/50 transition-all duration-300 relative overflow-hidden group"
                            >
                <span className={`flex items-center justify-center gap-3 ${isLoading ? "opacity-70" : ""}`}>
                  {isLoading && (
                      <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                  )}
                    {isLoading ? "Signing in..." : "Log In"}
                </span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </motion.button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-purple-300">
                                New here?{" "}
                                <Link
                                    to="/signup"
                                    className="font-bold text-white hover:text-[#A589FD] transition underline"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="text-center text-purple-300/60 text-sm mt-8"
                    >
                        © 2025 SkillConnect • Made with passion
                    </motion.p>
                </motion.div>
            </div>
        </>
    );
}

export default LoginPageV2;