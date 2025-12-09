import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"

import ProfileOwnerView from "./components/profile-owner-view"
import ProfileViewerView from "./components/profile-viewer-view"

function HomePage() {
  const navigate = useNavigate()

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Profile View</h1>
            <p className="text-lg text-slate-600">Select your view type to continue</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Owner */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <div className="p-8">
                <div className="mb-6">
                  <div className="w-24 h-24 rounded-full bg-blue-500 mx-auto -mt-16 mb-4 border-4 border-white flex items-center justify-center text-white text-2xl font-bold">
                    YOU
                  </div>
                  <h2 className="text-2xl font-bold text-center">Profile Owner</h2>
                  <p className="text-slate-600 text-center mt-2">View and manage your own profile</p>
                </div>

                <button
                    onClick={() => navigate("/owner")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  View as Owner
                </button>
              </div>
            </div>

            {/* Viewer */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-slate-400 to-slate-500"></div>
              <div className="p-8">
                <div className="mb-6">
                  <div className="w-24 h-24 rounded-full bg-slate-500 mx-auto -mt-16 mb-4 border-4 border-white flex items-center justify-center text-white text-2xl font-bold">
                    VIEWER
                  </div>
                  <h2 className="text-2xl font-bold text-center">Profile Viewer</h2>
                  <p className="text-slate-600 text-center mt-2">View others' profiles and interact</p>
                </div>

                <button
                    onClick={() => navigate("/viewer")}
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

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/viewer" element={<ProfileViewerView />} />
          <Route path="/owner" element={<ProfileOwnerView />} />
        </Routes>
      </BrowserRouter>
  )
}
