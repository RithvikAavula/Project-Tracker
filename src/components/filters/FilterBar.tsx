import { useTaskStore } from "../../store/useTaskStore";
import clsx from "clsx";

const statusLabels: Record<string, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  "in-review": "In Review",
  done: "Done",
};

const priorityDots: Record<string, string> = {
  low: "bg-emerald-400",
  medium: "bg-yellow-400",
  high: "bg-orange-400",
  critical: "bg-red-500",
};

export default function FilterBar() {
  const { filters, setFilters } = useTaskStore();

  const hasFilters = filters.status.length || filters.priority.length || filters.assignee?.length;

  const toggle = (type: keyof typeof filters, value: string) => {
    const current = filters[type];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilters({ ...filters, [type]: updated });
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center gap-4 flex-shrink-0">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Filter</span>

      {/* Status pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {["todo", "in-progress", "in-review", "done"].map((s) => {
          const active = filters.status.includes(s);
          return (
            <button
              key={s}
              onClick={() => toggle("status", s)}
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150",
                active
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {statusLabels[s]}
            </button>
          );
        })}
      </div>

      <div className="w-px h-4 bg-slate-200" />

      {/* Priority pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {["low", "medium", "high", "critical"].map((p) => {
          const active = filters.priority.includes(p);
          return (
            <button
              key={p}
              onClick={() => toggle("priority", p)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150",
                active
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <span className={clsx("w-1.5 h-1.5 rounded-full", active ? "bg-white" : priorityDots[p])} />
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          );
        })}
      </div>

      {hasFilters ? (
        <button
          onClick={() => setFilters({ status: [], priority: [], assignee: [] })}
          className="ml-auto flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors"
        >
          ✕ Clear
        </button>
      ) : null}
    </div>
  );
}
