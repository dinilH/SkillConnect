export default function CreateRequestButton() {
  return (
    <button
      className="
        px-5 py-2 rounded-xl text-white font-semibold
        bg-gradient-to-r from-[#6C38FF] to-[#A589FD]
        shadow-lg shadow-purple-300/40
        backdrop-blur-xl border border-white/20
        hover:scale-105 transition
      "
    >
      + Create Request
    </button>
  );
}
