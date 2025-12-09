export default function PriorityBadge({ level }) {
  const colors = {
    High: "bg-red-100 text-red-600 border-red-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Low: "bg-green-100 text-green-700 border-green-300",
  };

  return (
    <span
      className={`px-3 py-1 rounded-lg text-xs font-semibold border ${colors[level]}`}
    >
      {level} Priority
    </span>
  );
}
