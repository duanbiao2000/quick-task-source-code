"use client";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";
import { FaPlus } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useTasksStore } from "@/app/stores/useTasksStore";
import { nanoid } from "nanoid";
import { Task } from "@/app/data/Tasks";
import { toast } from "@/hooks/use-toast";
import { useUserStore } from "@/app/stores/useUserStore";

const taskFormSchema = z.object({
  taskName: z
    .string()
    .min(3, { message: "Task name must be at least 3 characters" }),
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Please select a priority" }),
  }),
  status: z.enum(["in progress", "completed"], {
    errorMap: () => ({ message: "Please select a status" }),
  }),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export function TasksDialog() {
  const methods = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
  });

  const {
    addNewTask,
    updateTaskFunction,
    isLoading,
    isTaskDialogOpened,
    setIsTaskDialogOpened,
    tasks,
    taskSelected,
    setTaskSelected,
  } = useTasksStore();

  const { user } = useUserStore();

  async function onSubmit(data: TaskFormValues) {
    //Look if the task name already exists in the tasks array
    const findTask = tasks.find(
      (task) => task.name.toLowerCase() === data.taskName.toLowerCase()
    );

    // If the task name already exists and we are not going
    //to edit the task (!taskSelected), set form error and exit the function
    if (findTask && !taskSelected) {
      // Set the form error for the 'taskName' field
      methods.setError("taskName", {
        type: "manual",
        message: `A task with the name "${data.taskName}" already exists.`,
      });

      // Optionally, display a toast for a better user experience
      toast({
        variant: "destructive", // Customize the style for the error
        title: "Task Already Exists",
        description: `A task with the name "${data.taskName}" already exists.`,
      });

      methods.setFocus("taskName");

      return; // Exit the function to prevent the task from being added
    }

    //If taskSelected is not null, meaning we are going to update the task,
    //otherwise we are going to add new task

    if (!taskSelected) {
      const newTask: Task = {
        id: nanoid(),
        name: data.taskName,
        priority: data.priority,
        status: data.status,
        userId: user?.id || "",
      };

      const result = await addNewTask(newTask);

      if (result.success) {
        // Displaying a toast notification with title and description
        toast({
          title: "Task Added",
          description: `The task "${newTask.name}" has been successfully added.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an error adding the task.",
        });
      }
    } else {
      const updatedTask: Task = {
        ...taskSelected,
        name: data.taskName,
        status: data.status,
        priority: data.priority,
      };

      const result = await updateTaskFunction(updatedTask);

      if (result.success) {
        // Displaying a toast notification with title and description
        toast({
          title: "Task Updated",
          description: `The task  has been successfully updated.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an error updating the task.",
        });
      }
    }
    setTaskSelected(null);
    setIsTaskDialogOpened(false);

    // Close modal or dialog after submission
  }

  // Handle when the dialog state changes (open/close)
  function handleDialogStateChange(isOpen: boolean) {
    setIsTaskDialogOpened(isOpen);
    if (!isOpen) {
      methods.reset(); // Reset form fields when the dialog closes
      setTaskSelected(null);
    }
  }

  //If the task dialog is opened and the taskSelected is not null
  //update the values of the form

  useEffect(() => {
    if (isTaskDialogOpened) {
      if (taskSelected) {
        //Set the name of the task
        methods.setValue("taskName", taskSelected.name);
        //Set the priority and manually trigger to track it
        methods.setValue("priority", taskSelected.priority);
        methods.trigger("priority");
        //Set the status and manually trigger to track it
        methods.setValue("status", taskSelected.status);
        methods.trigger("status");
      } else {
        methods.reset();
      }
    }
  }, [isTaskDialogOpened]);

  return (
    <Dialog open={isTaskDialogOpened} onOpenChange={handleDialogStateChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <FaPlus />
          <span>New Task</span>
        </Button>
      </DialogTrigger>
      {/* Form Provider */}
      <FormProvider {...methods}>
        <DialogContent className="p-7 poppins">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {taskSelected ? "Edit Task" : "Add Task"}
            </DialogTitle>
            <DialogDescription>
              {`Add a new task here. Click save when you're done.`}
            </DialogDescription>
          </DialogHeader>

          {/* start of form  */}
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <TaskForm />
            <DialogFooter className="mt-11">
              <Button type="submit" className="flex items-center gap-1">
                {isLoading ? (
                  <div>loading...</div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span>Save task</span>
                  </div>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
