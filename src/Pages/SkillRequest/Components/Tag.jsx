export default function Tag({ text }) {
  return (
    <span className="
         px-3 py-1
        bg-purple-100         /* background color */
        text-purple-700       /* text color */
        rounded-lg
        text-xs font-medium
        border border-purple-200
    ">
      #{text}
    </span>
  );
}
