import { useTaskStore } from "../../store/useTaskStore";

const userColors: Record<string, string> = {
  u1: "bg-rose-400",
  u2: "bg-blue-400",
  u3: "bg-emerald-400",
};

export default function PresenceBar() {
  const users = useTaskStore((s) => s.users);

  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <div className="flex -space-x-1">
        {users.map((u) => (
          <div
            key={u.id}
            title={`User ${u.name}`}
            className={`w-5 h-5 rounded-full text-white text-[10px] font-semibold flex items-center justify-center ring-2 ring-white ${userColors[u.id] ?? "bg-slate-400"}`}
          >
            {u.name}
          </div>
        ))}
      </div>
      <span className="text-xs text-slate-500">{users.length} online</span>
    </div>
  );
}
