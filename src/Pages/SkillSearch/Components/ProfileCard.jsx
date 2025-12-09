import Button2 from '../../../components/ui/button';

export default function ProfileCard({ user }) {
  return (
    <div className="
      bg-white rounded-3xl shadow-lg p-6 flex gap-6
      border border-purple-200 hover:shadow-purple-300/40 transition
    ">

      {/* Image Box */}
      <div className="
        w-20 h-20 rounded-2xl bg-gradient-to-br
        from-[#6C38FF] via-[#4C2AFF] to-[#EC38F5]
        flex items-center justify-center text-white font-bold shadow-lg
      ">
        IMG
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-bold text-gray-900 text-left">
          {user.name}
        </h2>

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          ⭐ {user.rating}
          <span>•</span>
        <div className="flex items-center gap-1">⏱ {user.time}</div>

        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mt-3">
  {user.skills.map((skill) => (
    <span
      key={skill}
      className="
        px-3 py-1 text-xs font-semibold rounded-xl
        text-purple-700 border border-purple-500
        shadow-md
      "
    >
      {skill}
    </span>
  ))}
</div>


        <p className="text-sm mt-3 text-gray-700 text-left">
          Level: <b>{user.level}</b>
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <Button2>
          View Profile

        </Button2>

        <button
  className="px-4 py-2 rounded-xl border border-purple-300 transition hover:brightness-90"
  style={{ backgroundColor: '#b4a4e7ff', color: 'white' }}
>
  Request Help
</button>

      </div>

    </div>
  );
}
