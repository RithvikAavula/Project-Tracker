import { useTaskStore } from "../../store/useTaskStore";
import KanbanColumn from "./KanbanColumn";
import DragOverlay from "./DragOverlay";
import type { TaskStatus } from "../../types/task";

const columns: { title: string; status: TaskStatus; color: string }[] = [
  { title: "To Do", status: "todo", color: "bg-slate-400" },
  { title: "In Progress", status: "in-progress", color: "bg-blue-400" },
  { title: "In Review", status: "in-review", color: "bg-amber-400" },
  { title: "Done", status: "done", color: "bg-emerald-400" },
];

const KanbanBoard = () => {
  const { tasks, filters } = useTaskStore();
  const filteredTasks = tasks.filter((task) => {
    if (filters.status.length && !filters.status.includes(task.status)) return false;
    if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
    if (filters.assignee.length && !filters.assignee.includes(task.assignee)) return false;
    return true;
  });

  return (
    <>
      <div className="flex gap-4 overflow-x-auto p-5 h-full items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);
          return (
            <KanbanColumn
              key={col.status}
              title={col.title}
              status={col.status}
              color={col.color}
              tasks={colTasks}
            />
          );
        })}
      </div>
      <DragOverlay />
    </>
  );
};

export default KanbanBoard;
