import { useTaskStore } from "../../store/useTaskStore";
import { useState } from "react";
import VirtualList from "./VirtualList";

type SortKey = "title" | "priority" | "dueDate";

export default function ListView() {
  const { tasks, filters } = useTaskStore();
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [asc, setAsc] = useState(true);

  const filteredTasks = tasks.filter((task) => {
    if (filters.status.length && !filters.status.includes(task.status)) return false;
    if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
    if (filters.assignee.length && !filters.assignee.includes(task.assignee)) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const valA = a[sortKey] ?? "";
    const valB = b[sortKey] ?? "";
    if (sortKey === "dueDate") {
      return asc
        ? new Date(valA).getTime() - new Date(valB).getTime()
        : new Date(valB).getTime() - new Date(valA).getTime();
    }
    return asc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setAsc(!asc);
    else { setSortKey(key); setAsc(true); }
  };

  const arrow = (key: SortKey) => sortKey === key ? (asc ? " ↑" : " ↓") : "";

  if (sortedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
        <span className="text-4xl">📭</span>
        <p className="text-sm font-medium">No tasks match your filters</p>
      </div>
    );
  }

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
        {/* Table header */}
        <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 px-4 py-2.5">
          {(["title", "priority", "dueDate"] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-left hover:text-slate-800 transition-colors"
            >
              {key === "dueDate" ? "Due Date" : key.charAt(0).toUpperCase() + key.slice(1)}
              {arrow(key)}
            </button>
          ))}
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</span>
        </div>

        <VirtualList tasks={sortedTasks} />
      </div>
    </div>
  );
}
