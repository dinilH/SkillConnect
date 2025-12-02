import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import {Star} from "lucide-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
{/* Mobile Edit Button
<button
    onClick={handleOpenEditModal}
    className="w-full sm:hidden mb-4 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-full hover:bg-gray-50 font-semibold text-gray-600 text-sm"
>
    Edit Profile
</button>

<div className="flex gap-3">
    <div>

        <button
            className="w-full sm:hidden mb-4 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-full hover:bg-gray-50 font-semibold text-gray-600 text-sm"
        >
            Edit Profile
        </button>


        <div className="flex gap-3">
            <button
                onClick={() => {
                    setShowPokesPopup(true);
                    setNewPokesCount(0); // remove notification when popup opens
                }}
                className="relative flex-1 bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 font-semibold text-sm shadow-sm transition-colors"
            >
                Pokes
                {newPokesCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
              {newPokesCount}
            </span>
                )}
            </button>

            <button className="flex-1 border border-gray-400 py-2 rounded-full hover:bg-gray-100 text-gray-600 font-semibold text-sm transition-colors">
                Share Profile
            </button>
        </div>


        {showPokesPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setShowPokesPopup(false)}
                ></div>


                <div className="bg-white rounded-xl shadow-xl w-full max-w-sm relative z-10 p-6">
                    <h3 className="text-lg font-semibold mb-4">Who poked you</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {pokesData.map((poked) => (
                            <div
                                key={poked.id}
                                className="flex items-center justify-between p-2 border rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={poked.avatar}
                                        alt={poked.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="font-medium">{poked.name}</span>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i <= poked.avgRating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="mt-4 w-full py-2 bg-gray-100 rounded-full hover:bg-gray-200 text-sm"
                        onClick={() => setShowPokesPopup(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        )}
    </div>


    <button className="flex-1 border border-gray-400 py-2 rounded-full hover:bg-gray-100 text-gray-600 font-semibold text-sm transition-colors">
        Share Profile
    </button>
</div>
</div>*/}