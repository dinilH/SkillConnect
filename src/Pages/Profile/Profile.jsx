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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Profile View</h1>
          <p className="text-lg text-slate-600">Select your view type to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Owner View Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-32 bg-linear-to-r from-blue-500 to-blue-600"></div>
            <div className="p-8">
              <div className="mb-6">
                <div className="w-24 h-24 rounded-full bg-blue-500 mx-auto -mt-16 mb-4 border-4 border-white flex items-center justify-center text-white text-2xl font-bold">
                  YOU
                </div>
                <h2 className="text-2xl font-bold text-slate-900 text-center">Profile Owner</h2>
                <p className="text-slate-600 text-center mt-2">View and manage your own profile</p>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="text-green-500">✓</span> Edit profile information
                </p>
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="text-green-500">✓</span> Create and manage posts
                </p>
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="text-green-500">✓</span> View all feedback
                </p>
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="text-green-500">✓</span> Add feedback
                </p>
              </div>

              <button
                onClick={() => setViewType("owner")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                View as Owner
              </button>
            </div>
          </div>

          {/* Viewer View Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-32 bg-linear-to-r from-slate-400 to-slate-500"></div>
            <div className="p-8">
              <div className="mb-6">
                <div className="w-24 h-24 rounded-full bg-slate-500 mx-auto -mt-16 mb-4 border-4 border-white flex items-center justify-center text-white text-2xl font-bold">
                  VIEWER
                </div>
                <h2 className="text-2xl font-bold text-slate-900 text-center">Profile Viewer</h2>
                <p className="text-slate-600 text-center mt-2">View others' profiles and interact</p>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="text-green-500">✓</span> View profile information
                </p>
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="text-green-500">✓</span> Send message
                </p>
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="text-green-500">✓</span> Poke for help
                </p>
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="text-green-500">✓</span> Add feedback only
                </p>
              </div>

              <button
                onClick={() => setViewType("viewer")}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors"
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