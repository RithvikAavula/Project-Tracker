import type { Task } from "../types/task";

const statuses = ["todo", "in-progress", "in-review", "done"] as const;
const priorities = ["low", "medium", "high", "critical"] as const;

const users = ["RA", "SK", "AM", "JD", "VK", "TS"];

export function generateTasks(count = 500): Task[] {
  return Array.from({ length: count }, (_, i) => {
    const start = new Date();
    start.setDate(start.getDate() - Math.floor(Math.random() * 10));

    const due = new Date();
    due.setDate(due.getDate() + Math.floor(Math.random() * 10));

    return {
      id: `task-${i}`,
      title: `Task ${i + 1}`,
      assignee: users[Math.floor(Math.random() * users.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      startDate: Math.random() > 0.3 ? start.toISOString() : undefined,
      dueDate: due.toISOString(),
    };
  });
}