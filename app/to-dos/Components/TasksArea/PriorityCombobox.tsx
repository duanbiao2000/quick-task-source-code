"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Task } from "@/app/data/Tasks";
import { useTasksStore } from "@/app/stores/useTasksStore";
import { toast } from "@/hooks/use-toast";

const priorities = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "high",
    label: "High",
  },
];

export function ComboboxDemo({ singleTask }: { singleTask: Task }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const { updateTaskFunction, isLoading } = useTasksStore();

  React.useEffect(() => {
    // Set initial priority value from task data
    setValue(singleTask.priority);
  }, [singleTask]);

  //type guard function
  function isValidPriority(value: string): value is "low" | "medium" | "high" {
    return value === "low" || value === "medium" || value === "high";
  }

  async function onSelectFunction(currentValue: string) {
    if (!isValidPriority(currentValue)) {
      return;
    }
    //Update the task by creating a new task object
    const updatedTask: Task = { ...singleTask, priority: currentValue };

    // Update the local state and store
    setValue(currentValue);

    const result = await updateTaskFunction(updatedTask); // Call the store function to update the task

    if (result.success) {
      // Displaying a toast notification with title and description
      toast({
        title: "Task Updated",
        description: `The priority has been updated successfully`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error updating the task",
      });
    }
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100px] justify-between"
        >
          {value
            ? priorities.find((framework) => framework.value === value)?.label
            : priorities[0].value}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[130px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {priorities.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={onSelectFunction}
                  disabled={isLoading}
                >
                  {value === framework.value && isLoading
                    ? "Loading..." // Show "Loading..." when the priority is being updated
                    : framework.label}

                  {!isLoading && (
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
