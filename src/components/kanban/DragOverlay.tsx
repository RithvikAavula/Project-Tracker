import { useTaskStore } from "../../store/useTaskStore";
import type { TaskStore } from "../../store/useTaskStore";
import type { Task } from "../../types/task";

const DragOverlay = () => {
  const draggedTaskId = useTaskStore((s: TaskStore) => s.draggedTaskId);
  const dragPosition  = useTaskStore((s: TaskStore) => s.dragPosition);
  const tasks         = useTaskStore((s: TaskStore) => s.tasks);

  if (!draggedTaskId || !dragPosition) return null;

  const task = tasks.find((t: Task) => t.id === draggedTaskId);
  if (!task) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{ top: dragPosition.y + 12, left: dragPosition.x + 12 }}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-3 w-64 rotate-2 opacity-90">
        <p className="text-xs font-semibold text-slate-500 mb-1">{task.priority}</p>
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">{task.title}</h3>
      </div>
    </div>
  );
};

export default DragOverlay;
