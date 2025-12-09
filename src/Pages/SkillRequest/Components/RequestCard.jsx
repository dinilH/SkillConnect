import Tag from "./Tag";
import PriorityBadge from "./PriorityBadge";
import Button2 from '../../../components/ui/button';


export default function RequestCard({ data }) {
  return (
    <div
      className="
      w-full bg-white backdrop-blur-xl 
      border border-white/40 shadow-xl 
      rounded-2xl p-6 mb-6
      "
    >
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900 text-left">{data.title}</h2>

      {/* Description */}
      <p className="text-gray-700 mt-1 text-left">{data.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
  {data.tags.map((t, i) => (
    <Tag key={i} text={t} />
  ))}
</div>


      {/* Meta */}
      <div className="flex items-center gap-6 mt-4 text-sm text-gray-700">
        <div className="flex items-center gap-1">⏱ {data.time}</div>
        <div className="flex items-center gap-1">💬 {data.responses} responses</div>
      </div>

      {/* Footer actions */}
      <div className="flex justify-between items-center mt-5">
        <PriorityBadge level={data.priority} />

        <div className="flex gap-2">
          <Button2>
            View Details
          </Button2>
            
          

                 <button
  className="px-4 py-2 rounded-xl border border-purple-300 transition hover:brightness-90"
  style={{ backgroundColor: '#b4a4e7ff', color: 'white' }}
>
  Apply to Help
</button>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-3 text-left">
        Posted by  <b>{data.author}</b> • {data.posted}
      </p>
    </div>
  );
}
