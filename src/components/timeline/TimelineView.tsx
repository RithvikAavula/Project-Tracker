import { useTaskStore } from "../../store/useTaskStore";
import { useState } from "react";

const DAY_WIDTH = 40;

const priorityColors: Record<string, string> = {
  low: "bg-emerald-400",
  medium: "bg-yellow-400",
  high: "bg-orange-400",
  critical: "bg-red-500",
};

export default function TimelineView() {
  const { tasks, filters } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredTasks = tasks.filter((task) => {
    if (filters.status.length && !filters.status.includes(task.status)) return false;
    if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
    if (filters.assignee.length && !filters.assignee.includes(task.assignee)) return false;
    return true;
  });

  const year        = currentDate.getFullYear();
  const month       = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth   = new Date(year, month + 1, 0);

  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  const visibleTasks = filteredTasks.filter((task) => {
    const start = task.startDate ? new Date(task.startDate) : new Date(task.dueDate);
    const end   = new Date(task.dueDate);
    return !(end < startOfMonth || start > endOfMonth);
  });

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">

        {/* Month nav */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 flex-shrink-0">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            ← Prev
          </button>
          <h2 className="text-sm font-semibold text-slate-800">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Scrollable grid */}
        <div className="overflow-auto flex-1">
          <div style={{ width: daysInMonth * DAY_WIDTH, minWidth: "100%" }}>

            {/* Day header */}
            <div className="flex border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = new Date(year, month, i + 1);
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                const isToday   = isCurrentMonth && today.getDate() === i + 1;
                return (
                  <div
                    key={i}
                    style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
                    className={`text-center py-2 text-xs font-medium border-r border-slate-100 flex-shrink-0 ${
                      isToday ? "text-blue-600 font-bold" : isWeekend ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>

            {/* Task rows */}
            <div className="relative">
              {/* Weekend shading */}
              <div className="absolute inset-0 flex pointer-events-none">
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = new Date(year, month, i + 1);
                  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                  return (
                    <div
                      key={i}
                      style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
                      className={`flex-shrink-0 h-full ${isWeekend ? "bg-slate-50" : ""}`}
                    />
                  );
                })}
              </div>

              {/* Today line */}
              {isCurrentMonth && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-blue-400 z-10 opacity-60"
                  style={{ left: (today.getDate() - 0.5) * DAY_WIDTH }}
                />
              )}

              {visibleTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <span className="text-3xl">📅</span>
                  <p className="text-sm">No tasks this month</p>
                </div>
              ) : (
                visibleTasks.map((task) => {
                  const start    = task.startDate ? new Date(task.startDate) : new Date(task.dueDate);
                  const end      = new Date(task.dueDate);
                  const startDay = Math.max(0, start.getMonth() === month && start.getFullYear() === year ? start.getDate() - 1 : 0);
                  const endDay   = end.getMonth() === month && end.getFullYear() === year ? end.getDate() : daysInMonth;
                  const duration = Math.max(1, endDay - startDay);

                  return (
                    <div key={task.id} className="relative h-10 flex items-center border-b border-slate-100">
                      <div
                        className={`absolute h-6 rounded-full text-xs text-white flex items-center px-3 overflow-hidden whitespace-nowrap font-medium shadow-sm ${priorityColors[task.priority]} hover:brightness-95 transition-all cursor-default`}
                        style={{ left: startDay * DAY_WIDTH + 2, width: duration * DAY_WIDTH - 4 }}
                        title={`${task.title} · ${task.priority} · due ${end.toLocaleDateString()}`}
                      >
                        {task.title}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
