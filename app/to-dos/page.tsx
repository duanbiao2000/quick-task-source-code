"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useUserStore } from "../stores/useUserStore";
import { TaskHeader } from "./Components/TaskHeader/TaskHeader";
import Stats from "./Components/Stats/Stats";
import { TasksArea } from "./Components/TasksArea/TasksArea";
import { TasksFooter } from "./Components/TaskFooter/TaskFooter";
import { TasksDialog } from "./Components/Dialogs/TaskDialog/TaskDialog";
//
//
export default function Dashboard() {
  const router = useRouter(); // Next.js router for redirection
  const { user, validateUser } = useUserStore();

  // Validation logic
  useEffect(() => {
    const checkUser = async () => {
      const isAuthenticated = await validateUser();

      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push("/");
      }
    };

    checkUser(); // Call validation function on component mount
  }, [router]);

  // Render nothing if user is not authenticated and redirection has occurred
  if (!user) {
    return null; // This will prevent further rendering after redirection
  }

  return (
    <div className="min-h-screen border flex items-center w-full justify-center poppins  ">
      <div
        className="w-[55%]   border border-gray-400 flex flex-col gap-6 bg-inherit shadow-md 
      rounded-md p-8"
      >
        <TaskHeader />
        <Stats />
        <AllTasksHeader />
        <TasksArea />
        <TasksFooter />
      </div>
    </div>
  );
}

function AllTasksHeader() {
  return (
    <div className="flex justify-between items-center mt-4 mb-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">{`Today's Task`}</h2>
        <p className="text-sm text-gray-400">{formatDate()}</p>
      </div>

      <TasksDialog />
    </div>
  );
}

function formatDate(date: Date = new Date()): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric", // Should be 'numeric', not 'string'
    month: "long", // Should be 'long' (for full month name)
    year: "numeric", // Should be 'numeric', not 'string'
  };
  return date.toLocaleDateString("en-GB", options);
}
