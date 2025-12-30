import { useState } from "react"
import ProfileOwnerView from "./ProfileOwnerView"
import ProfileViewerView from "./ProfileViewerView"

export default function Profile() {
  const [viewType, setViewType] = useState(null)

  if (viewType === "owner") {
    return <ProfileOwnerView onBack={() => setViewType(null)} />
  }

  if (viewType === "viewer") {
    return <ProfileViewerView onBack={() => setViewType(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E8FF] to-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile View</h1>
          <p className="text-lg text-gray-600">Select your view type to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Owner View Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-purple-300/40 transition-shadow">
            <div className="h-32 bg-gradient-to-r from-[#7D4DF4] to-[#A589FD]"></div>
            <div className="p-8">
              <div className="mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7D4DF4] to-[#A589FD] mx-auto -mt-16 mb-4 border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  YOU
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center">Profile Owner</h2>
                <p className="text-gray-600 text-center mt-2">View and manage your own profile</p>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-purple-500">✓</span> Edit profile information
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-purple-500">✓</span> Create and manage posts
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-purple-500">✓</span> View all feedback
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-purple-500">✓</span> Add feedback
                </p>
              </div>
              <button
                onClick={() => setViewType("owner")}
                className="w-full bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] hover:shadow-lg text-white font-semibold py-3 rounded-xl transition-all"
              >
                View as Owner
              </button>
            </div>
          </div>

          {/* Viewer View Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-purple-300/40 transition-shadow">
            <div className="h-32 bg-gradient-to-r from-purple-400 to-pink-400"></div>
            <div className="p-8">
              <div className="mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mx-auto -mt-16 mb-4 border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  VIEWER
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center">Profile Viewer</h2>
                <p className="text-gray-600 text-center mt-2">View others' profiles and interact</p>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-purple-500">✓</span> View profile information
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-purple-500">✓</span> Send message
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-purple-500">✓</span> Poke for help
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-purple-500">✓</span> Add feedback only
                </p>
              </div>

              <button
                onClick={() => setViewType("viewer")}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg text-white font-semibold py-3 rounded-xl transition-all"
              >
                View as Visitor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
