import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { useTaskStore } from "../store/useTaskStore";
import { generateTasks } from "../utils/dataGenerator";
import FilterBar from "../components/filters/FilterBar";
import KanbanBoard from "../components/kanban/KanbanBoard";
import ListView from "../components/list/ListView";
import TimelineView from "../components/timeline/TimelineView";
import PresenceBar from "../components/collaboration/PresenceBar";

const views = ["kanban", "list", "timeline"] as const;

const viewIcons: Record<string, string> = {
  kanban: "⊞",
  list: "☰",
  timeline: "▦",
};

export default function Home() {
  const [view, setView] = useState<"kanban" | "list" | "timeline">("kanban");
  const [params, setParams] = useSearchParams();
  const tasks = useTaskStore((s) => s.tasks);
  const setTasks = useTaskStore((s) => s.setTasks);
  const { filters, setFilters, setUsers } = useTaskStore();

  useEffect(() => {
    const status = params.get("status")?.split(",").filter(Boolean) || [];
    const priority = params.get("priority")?.split(",").filter(Boolean) || [];
    setFilters({ status, priority, assignee: [] });
  }, []);

  useEffect(() => {
    setParams({
      status: filters.status.join(","),
      priority: filters.priority.join(","),
    });
  }, [filters]);

  useEffect(() => {
    if (tasks.length === 0) setTasks(generateTasks(500));
  }, []);

  useEffect(() => {
    if (tasks.length === 0) return;
    const userPool = [
      { id: "u1", name: "A", color: "bg-rose-400" },
      { id: "u2", name: "B", color: "bg-blue-400" },
      { id: "u3", name: "C", color: "bg-emerald-400" },
    ];
    const interval = setInterval(() => {
      setUsers(userPool.map((u) => ({
        ...u,
        taskId: tasks[Math.floor(Math.random() * tasks.length)].id,
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Top navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            PT
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-800 leading-none">Project Tracker</h1>
            <p className="text-xs text-slate-400 mt-0.5">Task management board</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <PresenceBar />

          {/* View switcher */}
          <div className="flex bg-slate-100 p-1 rounded-lg gap-0.5">
            {views.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150",
                  view === v
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <span>{viewIcons[v]}</span>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Filter bar */}
      <FilterBar />

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {view === "kanban" && <KanbanBoard />}
        {view === "list" && <ListView />}
        {view === "timeline" && <TimelineView />}
      </main>
    </div>
  );
}
