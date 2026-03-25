import { useState } from "react";
import type { Task } from "../../types/task";
import { useTaskStore } from "../../store/useTaskStore";
import clsx from "clsx";

const ROW_HEIGHT = 56;
const BUFFER = 5;

const priorityDot: Record<string, string> = {
  low: "bg-emerald-400",
  medium: "bg-yellow-400",
  high: "bg-orange-400",
  critical: "bg-red-500",
};

export default function VirtualList({ tasks }: { tasks: Task[] }) {
  const [scrollTop, setScrollTop] = useState(0);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);

  const containerHeight = 500;
  const totalHeight = tasks.length * ROW_HEIGHT;

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex   = Math.min(tasks.length, Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER);
  const visibleTasks = tasks.slice(startIndex, endIndex);

  return (
    <div
      className="overflow-y-auto flex-1"
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleTasks.map((task, i) => {
          const index = startIndex + i;
          const isOverdue = new Date(task.dueDate).getTime() < Date.now();

          return (
            <div
              key={task.id}
              className="grid grid-cols-4 items-center px-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
              style={{ position: "absolute", top: index * ROW_HEIGHT, height: ROW_HEIGHT, width: "100%" }}
            >
              <p className="text-sm text-slate-800 font-medium truncate pr-4">{task.title}</p>

              <div className="flex items-center gap-1.5">
                <span className={clsx("w-2 h-2 rounded-full", priorityDot[task.priority])} />
                <span className="text-sm text-slate-600 capitalize">{task.priority}</span>
              </div>

              <span className={clsx("text-sm", isOverdue ? "text-red-500 font-medium" : "text-slate-500")}>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>

              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task.id, e.target.value as Task["status"])}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer w-36"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
