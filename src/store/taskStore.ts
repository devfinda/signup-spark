import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task } from '../types/task';

interface TaskState {
  tasks: Record<string, Task[]>; // campaignId -> tasks
  addTask: (campaignId: string, task: Task) => void;
  removeTask: (campaignId: string, taskId: string) => void;
  updateTask: (campaignId: string, taskId: string, updates: Partial<Task>) => void;
  clearTasks: (campaignId: string) => void;
  clearAllTasks: () => void;
  getTasksByCampaign: (campaignId: string) => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: {},
      addTask: (campaignId, task) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [campaignId]: [...(state.tasks[campaignId] || []), task],
          },
        })),
      removeTask: (campaignId, taskId) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [campaignId]: state.tasks[campaignId]?.filter((task) => task.id !== taskId) || [],
          },
        })),
      updateTask: (campaignId, taskId, updates) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [campaignId]: state.tasks[campaignId]?.map((task) =>
              task.id === taskId ? { ...task, ...updates } : task
            ) || [],
          },
        })),
      clearTasks: (campaignId) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [campaignId]: [],
          },
        })),
      clearAllTasks: () => set({ tasks: {} }),
      getTasksByCampaign: (campaignId) => get().tasks[campaignId] || [],
    }),
    {
      name: 'task-storage',
    }
  )
);