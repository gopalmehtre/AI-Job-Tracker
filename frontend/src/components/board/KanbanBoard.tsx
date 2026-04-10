import { useEffect, useState, useCallback } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  fetchApplications,
  updateApplicationStatus,
  moveApplication,
} from "../../store/slices/applicationsSlice";
import { COLUMNS, type ApplicationStatus } from "../../types";
import KanbanColumn from "./KanbanColumn";
import AddApplicationModal from "./AddApplicationModal";
import Spinner from "../common/Spinner";

const KanbanBoard = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((s) => s.applications);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const getColumnApps = useCallback(
    (status: ApplicationStatus) =>
      items
        .filter((app) => app.status === status)
        .sort((a, b) => a.order - b.order),
    [items]
  );

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId as ApplicationStatus;
    const newOrder = destination.index;

    // Optimistic update
    dispatch(moveApplication({ id: draggableId, newStatus, newOrder }));

    // Persist to server
    dispatch(
      updateApplicationStatus({
        id: draggableId,
        status: newStatus,
        order: newOrder,
      })
    );
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto" />
          <p className="text-slate-500 text-sm mt-4">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center card p-8 max-w-md">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => dispatch(fetchApplications())} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {items.length === 0
              ? "Add your first job application to get started"
              : `${items.length} application${items.length === 1 ? "" : "s"} tracked`}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Application
        </button>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto px-6 pb-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 min-w-max">
            {COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                applications={getColumnApps(status)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex-1 flex items-center justify-center -mt-32">
          <div className="text-center max-w-sm">
            <div className="h-16 w-16 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-300">No applications yet</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Click "Add Application" to paste a job description. Our AI will extract the details and generate tailored resume suggestions.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary mt-5"
            >
              Add your first application
            </button>
          </div>
        </div>
      )}

      <AddApplicationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default KanbanBoard;
