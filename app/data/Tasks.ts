export type Task = {
  id: string;
  name: string;
  priority: "low" | "medium" | "high";
  status: "in progress" | "completed";
  userId: string;
};

export const allTasks: Task[] = [
  //
];
