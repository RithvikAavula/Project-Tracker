import type { Task, TaskStatus } from "../../types/task";
import TaskCard from "./TaskCard";
import { useTaskStore } from "../../store/useTaskStore";
import clsx from "clsx";

interface Props {
  title: string;
  status: TaskStatus;
  color: string;
  tasks: Task[];
}

export default function KanbanColumn({ title, status, color, tasks }: Props) {
  const draggedTaskId = useTaskStore((s) => s.draggedTaskId);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const setDraggedTask = useTaskStore((s) => s.setDraggedTask);
  const setIsDroppedInColumn = useTaskStore((s) => s.setIsDroppedInColumn);

  const handlePointerUp = () => {
    if (draggedTaskId) {
      updateTaskStatus(draggedTaskId, status);
      setIsDroppedInColumn(true);
      setDraggedTask(null);
    }
  };

  const isDragTarget = draggedTaskId !== null;

  return (
    <div
      onPointerUp={handlePointerUp}
      className={clsx(
        "flex flex-col rounded-2xl w-72 min-w-[288px] flex-shrink-0 transition-all duration-150",
        isDragTarget ? "bg-blue-50 ring-2 ring-blue-200" : "bg-slate-100"
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={clsx("w-2.5 h-2.5 rounded-full", color)} />
          <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
          {tasks.length}
        </span>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 max-h-[calc(100vh-220px)]">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-300">
            <span className="text-3xl mb-2">○</span>
            <span className="text-xs">No tasks</span>
          </div>
        ) : (
          tasks.map((task) => {
            const isDragging = task.id === draggedTaskId;
            return isDragging ? (
              <div
                key={task.id}
                className="h-24 mb-2.5 rounded-xl border-2 border-dashed border-slate-300 bg-white/50"
              />
            ) : (
              <TaskCard key={task.id} task={task} />
            );
          })
        )}
      </div>
    </div>
  );
}
