import type { Task } from "../../types/task";
import clsx from "clsx";
import { useTaskStore } from "../../store/useTaskStore";

const priorityConfig: Record<string, { bg: string; text: string; dot: string }> = {
  low:      { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  medium:   { bg: "bg-yellow-50",  text: "text-yellow-700",  dot: "bg-yellow-400" },
  high:     { bg: "bg-orange-50",  text: "text-orange-700",  dot: "bg-orange-400" },
  critical: { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500" },
};

export default function TaskCard({ task }: { task: Task }) {
  const setDraggedTask      = useTaskStore((s) => s.setDraggedTask);
  const setDragPosition     = useTaskStore((s) => s.setDragPosition);
  const setDragSourceStatus = useTaskStore((s) => s.setDragSourceStatus);
  const draggedTaskId       = useTaskStore((s) => s.draggedTaskId);
  const dragSourceStatus    = useTaskStore((s) => s.dragSourceStatus);
  const updateTaskStatus    = useTaskStore((s) => s.updateTaskStatus);
  const isDroppedInColumn   = useTaskStore((s) => s.isDroppedInColumn);
  const setIsDroppedInColumn = useTaskStore((s) => s.setIsDroppedInColumn);
  const users               = useTaskStore((s) => s.users);

  const isDragging  = draggedTaskId === task.id;
  const activeUsers = users.filter((u) => u.taskId === task.id);
  const priority    = priorityConfig[task.priority];

  const handlePointerDown = (e: React.PointerEvent) => {
    setDraggedTask(task.id);
    setDragSourceStatus(task.status);
    setDragPosition({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    if (draggedTaskId && dragSourceStatus && !isDroppedInColumn) {
      updateTaskStatus(draggedTaskId, dragSourceStatus);
    }
    setDraggedTask(null);
    setDragPosition(null);
    setDragSourceStatus(null);
    setIsDroppedInColumn(false);
  };

  const today    = new Date().toDateString();
  const dueDate  = new Date(task.dueDate);
  const due      = dueDate.toDateString();
  const isToday  = today === due;
  const isOverdue = !isToday && dueDate.getTime() < Date.now();
  const dueLabel = isToday ? "Due Today" : dueDate.toLocaleDateString();

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={clsx(
        "bg-white rounded-xl border border-slate-200 p-3 mb-2.5 cursor-grab active:cursor-grabbing select-none",
        "hover:shadow-md hover:border-slate-300 transition-all duration-150",
        isDragging && "opacity-30"
      )}
    >
      {/* Priority badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={clsx("flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full", priority.bg, priority.text)}>
          <span className={clsx("w-1.5 h-1.5 rounded-full", priority.dot)} />
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-2">{task.title}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        {/* Assignee avatar */}
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-[10px] font-bold text-white">
          {task.assignee?.charAt(0).toUpperCase()}
        </div>

        {/* Due date */}
        {task.dueDate && (
          <span className={clsx(
            "text-[11px] font-medium",
            isToday  && "text-amber-500",
            isOverdue && "text-red-500",
            !isToday && !isOverdue && "text-slate-400"
          )}>
            {isOverdue && "⚠ "}{dueLabel}
          </span>
        )}
      </div>

      {/* Active user avatars */}
      {activeUsers.length > 0 && (
        <div className="flex items-center gap-1 mt-2.5 pt-2.5 border-t border-slate-100">
          <div className="flex -space-x-1">
            {activeUsers.slice(0, 2).map((u) => (
              <div
                key={u.id}
                className={`w-5 h-5 rounded-full text-white text-[10px] font-semibold flex items-center justify-center ring-2 ring-white ${u.color}`}
              >
                {u.name}
              </div>
            ))}
          </div>
          {activeUsers.length > 2 && (
            <span className="text-[10px] text-slate-400">+{activeUsers.length - 2}</span>
          )}
          <span className="text-[10px] text-slate-400 ml-1">viewing</span>
        </div>
      )}
    </div>
  );
}
