import React from 'react'
import { FaComments, FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'

export default function FloatingChatButton() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const isOnChatPage = location.pathname === '/chat'

  const handleClick = () => {
    if (isOnChatPage) {
      navigate(-1) // previous page
    } else {
      navigate('/chat')
    }
  }

  return (
    <button
      aria-label={isOnChatPage ? "Go back" : "Open chat"}
      title={isOnChatPage ? "Go back" : "Chat"}
      onClick={handleClick}
      className={
        `fixed right-6 bottom-6 z-50 flex items-center justify-center
         w-14 h-14 rounded-full shadow-lg
         bg-linear-to-br from-[#7D4DF4] to-[#A589FD]
         text-white text-xl
         hover:scale-105 transform transition-all duration-150
         focus:outline-none focus:ring-4 focus:ring-[#7D4DF4]/30`
      }
    >
      {isOnChatPage ? <FaArrowLeft aria-hidden="true" /> : <FaComments aria-hidden="true" />}
    </button>
  )
}
