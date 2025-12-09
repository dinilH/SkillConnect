import React from 'react'
import { FaComments } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function FloatingChatButton() {
  const navigate = useNavigate()

  return (
    <button
      aria-label="Open chat"
      title="Chat"
      onClick={() => navigate('/chat')}
      className={
        `fixed right-6 bottom-6 z-50 flex items-center justify-center
         w-14 h-14 rounded-full shadow-lg
         bg-linear-to-br from-[#7D4DF4] to-[#A589FD]
         text-white text-xl
         hover:scale-105 transform transition-all duration-150
         focus:outline-none focus:ring-4 focus:ring-[#7D4DF4]/30`
      }
    >
      <FaComments aria-hidden="true" />
    </button>
  )
}
