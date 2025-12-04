import React from "react";
import DiscussionCard from "./DiscussionCard";

export default function DiscussionList({ discussions }) {
  return (
    <div className="space-y-4">
      {discussions.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white border rounded">No discussions match your filters.</div>
      ) : (
        discussions.map((d) => <DiscussionCard key={d.id} d={d} />)
      )}
    </div>
  );
}
