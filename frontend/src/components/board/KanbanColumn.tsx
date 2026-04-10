import { Droppable } from "@hello-pangea/dnd";
import type { Application, ApplicationStatus } from "../../types";
import { getColumnAccentColor, getColumnBgColor } from "../../utils/helpers";
import KanbanCard from "./KanbanCard";

interface Props {
  status: ApplicationStatus;
  applications: Application[];
}

const KanbanColumn = ({ status, applications }: Props) => {
  const accent = getColumnAccentColor(status);
  const bg = getColumnBgColor(status);

  return (
    <div className={`flex flex-col min-w-[280px] w-[280px] rounded-2xl ${bg} border border-slate-800/40`}>
      {/* Column header */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className={`h-2 w-2 rounded-full ${accent}`} />
        <h3 className="text-sm font-semibold text-slate-300">{status}</h3>
        <span className="ml-auto text-xs text-slate-500 font-mono bg-slate-800/40 px-2 py-0.5 rounded-md">
          {applications.length}
        </span>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 px-2.5 pb-2.5 space-y-2 min-h-[120px] rounded-b-2xl transition-colors duration-200
              ${snapshot.isDraggingOver ? "bg-indigo-500/5" : ""}
            `}
          >
            {applications.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-[100px] text-xs text-slate-600">
                Drop applications here
              </div>
            )}
            {applications.map((app, index) => (
              <KanbanCard key={app._id} application={app} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
