"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function CreateAccountForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "employee",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";

    if (!formData.username.trim()) newErrors.username = "Username required";

    if (!formData.password) newErrors.password = "Password required";
    else if (formData.password.length < 6)
      newErrors.password = "Min 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setShowSuccess(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#7D4DF4", "#A589FD", "#C4B5FD", "#E0D4FF"],
        });

        setTimeout(() => {
          setFormData({
            firstName: "", lastName: "", email: "", username: "",
            role: "employee", department: "", password: "", confirmPassword: ""
          });
          setShowSuccess(false);
        }, 3000);
      } else {
        setErrors({ general: result.message || "Failed to create account" });
      }
    } catch (error) {
      setErrors({ general: "Server error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
              animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-[#7D4DF4]/20 to-[#A589FD]/10 rounded-full blur-3xl"
          />
          <motion.div
              animate={{ x: [0, -80, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 25, repeat: Infinity, delay: 4 }}
              className="absolute bottom-0 -right-40 w-96 h-96 bg-gradient-to-tl from-[#A589FD]/20 to-purple-300/10 rounded-full blur-3xl"
          />
        </div>

        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-4xl"
        >
          {/* Floating Glass Card */}
          <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="backdrop-blur-2xl bg-white/90 shadow-2xl rounded-3xl border border-white/30 p-8 md:p-12"
              style={{ boxShadow: "0 25px 60px rgba(125, 77, 244, 0.2)" }}
          >
            {/* Back Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/main")}
                className="flex items-center gap-3 text-[#7D4DF4] hover:text-[#A589FD] font-medium mb-8 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </motion.button>

            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-[#7D4DF4] to-[#A589FD] rounded-3xl shadow-xl flex items-center justify-center mb-6"
              >
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </motion.div>

              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] bg-clip-text text-transparent">
                Create New Account
              </h1>
              <p className="text-gray-600 mt-3">Add a new member to SkillConnect</p>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl mb-6 flex items-center gap-3 shadow-lg"
                >
                  <span className="text-2xl">Party Popper</span>
                  <span className="font-bold">Account created successfully!</span>
                </motion.div>
            )}

            {errors.general && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-2xl mb-6"
                >
                  Warning: {errors.general}
                </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                  <label className="block text-gray-700 font-semibold mb-2">First Name</label>
                  <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 rounded-2xl border ${
                          errors.firstName ? "border-red-400 " : "border-blue-200"
                      } focus:border-[#7D4DF4] focus:ring-4 focus:ring-[#7D4DF4]/20 transition-all bg-blue-300`}
                      placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </motion.div>

                {/* Last Name */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                  <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
                  <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 rounded-2xl border ${
                          errors.firstName ? "border-red-400 " : "border-blue-200"
                      } focus:border-[#7D4DF4] focus:ring-4 focus:ring-[#7D4DF4]/20 transition-all bg-blue-300`}
                      placeholder="John"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 rounded-2xl border ${
                          errors.firstName ? "border-red-400 " : "border-blue-200"
                      } focus:border-[#7D4DF4] focus:ring-4 focus:ring-[#7D4DF4]/20 transition-all bg-blue-300`}
                      placeholder="John"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </motion.div>

                {/* Username */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <label className="block text-gray-700 font-semibold mb-2">Username</label>
                  <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 rounded-2xl border ${
                          errors.firstName ? "border-red-400 " : "border-blue-200"
                      } focus:border-[#7D4DF4] focus:ring-4 focus:ring-[#7D4DF4]/20 transition-all bg-blue-300`}
                      placeholder="John"
                  />
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <label className="block text-gray-700 font-semibold mb-2">Password</label>
                  <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 rounded-2xl border ${
                          errors.password ? "border-red-400 bg-red-50" : "border-gray-300"
                      } focus:border-[#7D4DF4] focus:ring-4 focus:ring-[#7D4DF4]/20 transition-all bg-white/70`}
                      placeholder="••••••••"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </motion.div>

                {/* Confirm Password */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
                  <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 rounded-2xl border ${
                          errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-300"
                      } focus:border-[#7D4DF4] focus:ring-4 focus:ring-[#7D4DF4]/20 transition-all bg-white/70`}
                      placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 mt-8 bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] hover:from-[#6d3fe4] hover:to-[#956ffd] text-white font-bold text-lg rounded-2xl shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Creating Account...
                    </>
                ) : (
                    "Create Account"
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-10">
            © 2025 SkillConnect • Admin Portal
          </p>
        </motion.div>
      </div>
  );
}