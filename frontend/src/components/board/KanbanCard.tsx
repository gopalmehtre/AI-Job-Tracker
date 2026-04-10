import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import type { Application } from "../../types";
import { formatDate } from "../../utils/helpers";
import ApplicationDetailModal from "./ApplicationDetailModal";

interface Props {
  application: Application;
  index: number;
}

const KanbanCard = ({ application, index }: Props) => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <Draggable draggableId={application._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setShowDetail(true)}
            className={`
              p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/40
              cursor-pointer transition-all duration-150
              hover:border-slate-600/60 hover:bg-slate-800/80
              ${snapshot.isDragging ? "shadow-xl shadow-black/30 border-indigo-500/40 rotate-1 scale-[1.02]" : ""}
            `}
          >
            {/* Company */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-200 leading-tight">
                {application.company}
              </h4>
              {application.salaryRange && (
                <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                  {application.salaryRange}
                </span>
              )}
            </div>

            {/* Role */}
            <p className="text-xs text-slate-400 mt-1 leading-snug">{application.role}</p>

            {/* Meta row */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-slate-500">
                {formatDate(application.dateApplied)}
              </span>

              {/* Skills preview */}
              {application.requiredSkills.length > 0 && (
                <div className="flex gap-1">
                  {application.requiredSkills.slice(0, 2).map((skill, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 bg-slate-700/50 text-slate-400 rounded"
                    >
                      {skill.length > 12 ? skill.slice(0, 12) + "…" : skill}
                    </span>
                  ))}
                  {application.requiredSkills.length > 2 && (
                    <span className="text-[10px] text-slate-500">
                      +{application.requiredSkills.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Location row */}
            {application.location && (
              <div className="flex items-center gap-1 mt-2">
                <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-[10px] text-slate-500">{application.location}</span>
              </div>
            )}
          </div>
        )}
      </Draggable>

      <ApplicationDetailModal
        application={application}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </>
  );
};

export default KanbanCard;
