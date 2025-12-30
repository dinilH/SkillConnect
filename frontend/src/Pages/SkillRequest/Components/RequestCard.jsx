import { useState } from "react";
import Tag from "./Tag";
import PriorityBadge from "./PriorityBadge";
import { ClockIcon } from "@heroicons/react/24/outline";
import Button2 from "../../../components/ui/button";
import ApplyToHelp from "./ApplyToHelp";
import ViewApplications from "./ViewHelpDetails";

export default function RequestCard({ data }) {
  const [openApply, setOpenApply] = useState(false);
  const [viewApplications, setViewApplications] = useState(false);

  return (
    <>
      <div className="w-full max-w-3xl bg-white border shadow-xl rounded-2xl p-6 mb-6 mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 text-left">
          {data.title}
        </h2>

        <p className="text-gray-700 mt-1 text-left">{data.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {data.skills.map((skill, i) => (
            <Tag key={i} text={skill} />
          ))}
        </div>

        <div className="flex items-center gap-6 mt-4 text-sm text-gray-700 font-bold">
          <div>Category of Skill: {data.category}</div>
        </div>

        <div className="flex justify-between items-center mt-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4 text-gray-500" />
            {new Date(data.createdAt).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
            })}

            <button
              className="ml-3 px-3 py-1 bg-purple-500 text-white rounded-xl hover:brightness-90"
              onClick={() => setViewApplications(true)}
            >
              Responses
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 items-center mt-5">
          <div className="col-span-1 text-left">
            <PriorityBadge level={data.priority} />
          </div>

          <div className="col-span-1 col-start-5 flex justify-end">
            <Button2 onClick={() => setOpenApply(true)}>
              Apply to Help
            </Button2>
          </div>
        </div>
      </div>

      {/* Popups */}
      <ApplyToHelp
        isOpen={openApply}
        onClose={() => setOpenApply(false)}
        request={data}
      />
      <ViewApplications
        isOpen={viewApplications}
        onClose={() => setViewApplications(false)}
        request={data}
      />
    </>
  );
}
