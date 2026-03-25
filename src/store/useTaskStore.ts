import { create } from "zustand";
import type { Task, TaskStatus } from "../types/task";



export interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;

  // Filters
  filters: {
    status: string[];
    priority: string[];
    assignee: string[];
  };
  setFilters: (filters: any) => void;

  draggedTaskId: string | null;
  setDraggedTask: (id: string | null) => void;

  dragPosition: { x: number; y: number } | null;
  setDragPosition: (pos: { x: number; y: number } | null) => void;

  dragSourceStatus: TaskStatus | null;
  setDragSourceStatus: (status: TaskStatus | null) => void;

  isDroppedInColumn: boolean;
  setIsDroppedInColumn: (val: boolean) => void;

  users: { id: string; name: string; color: string; taskId: string }[];
  setUsers: (users: any) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks: Task[]) => set({ tasks }),
  updateTaskStatus: (id: string, status: TaskStatus) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      ),
    })),

  // Filters
  filters: {
    status: [],
    priority: [],
    assignee: [],
  },
  setFilters: (filters) => set({ filters }),

  draggedTaskId: null,
  setDraggedTask: (id: string | null) => set({ draggedTaskId: id }),
  dragPosition: null,
  setDragPosition: (pos: { x: number; y: number } | null) => set({ dragPosition: pos }),
  dragSourceStatus: null,
  setDragSourceStatus: (status: TaskStatus | null) => set({ dragSourceStatus: status }),
  isDroppedInColumn: false,
  setIsDroppedInColumn: (val: boolean) => set({ isDroppedInColumn: val }),

  users: [],
  setUsers: (users) => set({ users }),
}));