import { create } from "zustand";
import { Task } from "../data/Tasks";

interface useTasksStoreInterface {
  isTaskDialogOpened: boolean;
  setIsTaskDialogOpened: (isTaskDialogOpened: boolean) => void;
  taskSelected: Task | null;
  setTaskSelected: (task: Task | null) => void;
  tasks: Task[];
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (isTaskDialogOpened: boolean) => void;
  setTasks: (tasks: Task[]) => void;
  //fetch function
  fetchTasks: (
    userId: { id: string; email: string } | null
  ) => Promise<{ success: boolean; message: string }>;
  //update task
  updateTaskFunction: (
    task: Task
  ) => Promise<{ success: boolean; message: string }>;
  deleteTaskFunction: (
    option: "delete" | "deleteAll",
    user: { id: string; email: string } | null,
    task?: Task // Make this optional
  ) => Promise<{ success: boolean; message: string }>;
  addNewTask: (
    task: Task
  ) => Promise<{ success: boolean; message: string; task: Task }>;
}

export const useTasksStore = create<useTasksStoreInterface>((set, get) => {
  return {
    isTaskDialogOpened: false,
    setIsTaskDialogOpened: (isDialogOpened: boolean) => {
      set({ isTaskDialogOpened: isDialogOpened });
    },
    tasks: [],
    isLoading: false,
    setIsLoading: (isLoading: boolean) => {
      set({ isLoading });
    },

    openDeleteDialog: false,
    setOpenDeleteDialog: (openDeleteDialog: boolean) => {
      set({ openDeleteDialog: openDeleteDialog });
    },

    taskSelected: null,
    setTaskSelected: (task: Task | null) => {
      set({ taskSelected: task });
    },

    // Sets the tasks
    setTasks: (tasks: Task[]) => {
      set({ tasks });
    },

    // Adds a new task with promise-based simulation
    addNewTask: async (
      task: Task
    ): Promise<{ success: boolean; message: string; task: Task }> => {
      try {
        set({ isLoading: true });
        const currentTasks = get().tasks;

        // Send the POST request to your API route
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task), // Send task data
        });

        const results: { success: boolean; message: string } =
          await response.json();

        if (!results.success) {
          throw new Error(results.message);
        }

        // Add the new task to the current tasks array
        const updatedTasks = [...currentTasks, task];

        // Sort the tasks: "in progress" tasks at the top

        // Update the tasks state
        set({ tasks: sortTasksByCompleted(updatedTasks) });

        // Return a success object
        return { success: true, message: "Task added successfully", task };
      } catch (error) {
        console.log(error);
        return { success: false, message: "Error adding task", task };
      } finally {
        set({ isLoading: false });
      }
    },

    // Fetches all tasks (simulated async fetch)
    fetchTasks: async (user) => {
      try {
        set({ isLoading: true });

        if (!user) {
          return { success: false, message: "User ID undefined" };
        }

        console.log(user);

        // Send the GET request to your API route
        const response = await fetch(`/api/tasks?userId=${user.id}`, {
          method: "GET",
        });

        //Check if the request is successfully
        const results: { tasks?: Task[]; success: boolean; message: string } =
          await response.json();

        //If not return this object
        if (!results.success || !results.tasks) {
          return { success: false, message: "error while fetching data" };
        }

        //otherwise update the tasks
        set({ tasks: sortTasksByCompleted(results.tasks) });

        return { success: true, message: "Tasks fetched successfully" };
      } catch (error) {
        console.error("Error fetching tasks:", error);
        return { success: false, message: "error while fetching data" };
      } finally {
        set({ isLoading: false });
      }
    },

    //Delete a specific Task
    deleteTaskFunction: async (
      option: "delete" | "deleteAll",
      user,
      task?: Task
    ) => {
      try {
        set({ isLoading: true });

        if (!user) {
          return { success: false, message: "User is not defined" };
        }

        // Send the DELETE request to your API route
        const response = await fetch(`/api/tasks?userId=${user.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ option: option, task: task }), // Send task data
        });

        const results: { success: boolean; message: string } =
          await response.json();

        if (!results.success) {
          return { success: false, message: results.message };
        }

        const currentTasks = get().tasks;

        if (option === "delete" && task) {
          // Ensure the task is provided when deleting a single task
          const updatedTasks = currentTasks.filter((t) => t.id !== task.id);
          set({ tasks: sortTasksByCompleted(updatedTasks) });
        }

        if (option === "deleteAll") {
          // Clear all tasks
          set({ tasks: [] });
        }

        return { success: true, message: results.message };
      } catch (error) {
        return { success: false, message: `Task deletion failed: ${error}` };
      } finally {
        set({ isLoading: false });
      }
    },

    // Updates a specific task
    updateTaskFunction: async (task: Task) => {
      try {
        set({ isLoading: true });

        // Send the POST request to your API route
        const response = await fetch("/api/tasks", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task), // Send task data
        });

        //Check if the request is successfully
        const results: { success: boolean; message: string } =
          await response.json();

        //If not return this object
        if (!results.success) {
          return { success: false, message: `task update failed` };
        }

        const currentTasks = get().tasks;

        const updatedTasks = currentTasks.map((t) =>
          t.id === task.id ? { ...t, ...task } : t
        );

        set({ tasks: sortTasksByCompleted(updatedTasks) });

        return { success: true, message: "Task has been updated successfully" };
      } catch (error) {
        return { success: false, message: `task update failed, ${error}` };
      } finally {
        set({ isLoading: false });
      }
    },
  };
});

function sortTasksByCompleted(tasks: Task[]): Task[] {
  // Sort the tasks: "in progress" tasks at the top
  const sortedTasks = tasks.sort((a, b) => {
    if (a.status === "in progress" && b.status !== "in progress") {
      return -1; // Move "in progress" tasks to the top
    }
    if (a.status !== "in progress" && b.status === "in progress") {
      return 1; // Move "in progress" tasks to the top
    }
    return 0; // Keep other tasks in their relative order
  });

  return sortedTasks;
}
