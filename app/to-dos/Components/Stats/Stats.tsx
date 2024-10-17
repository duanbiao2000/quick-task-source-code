import { useTasksStore } from "@/app/stores/useTasksStore";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

type SingleStat = { label: string; unit: string; counter: number };

export default function Stats() {
  const [statsArray, setStatsArray] = useState<SingleStat[]>([
    { label: "Completed", unit: "Tasks", counter: 3 },
    { label: "Pending", unit: "Tasks", counter: 4 },
    { label: "Progress", unit: "%", counter: 4 },
  ]);

  const { tasks } = useTasksStore();

  useEffect(() => {
    const getCompletedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const getPendingTasks = tasks.length - getCompletedTasks;
    const getProgressValue = (getCompletedTasks / tasks.length) * 100;

    setStatsArray([
      { label: "Completed", unit: "Tasks", counter: getCompletedTasks },
      { label: "Pending", unit: "Tasks", counter: getPendingTasks },
      {
        label: "Progress",
        unit: "%",
        counter: parseInt(getProgressValue.toFixed(2)) || 0,
      },
    ]);
  }, [tasks]);

  return (
    <div className="flex gap-5 py-5">
      {statsArray.map((stat, index) => (
        <div key={index} className="flex w-full     gap-5  ">
          <SingleStatCard stat={stat} key={index} />
          {index < statsArray.length - 1 && (
            <Separator orientation="vertical" className="h-auto" />
          )}
        </div>
      ))}

      {/* Separator with correct height and vertical orientation */}
    </div>
  );
}

function SingleStatCard({ stat }: { stat: SingleStat }) {
  return (
    <div className="w-full flex flex-col gap-2 items-center ">
      <div className="flex justify-between items-center">
        <p className="text-xl font-medium text-gray-500">{stat.label}</p>
      </div>
      <div className="flex gap-1  items-baseline  ">
        <p className="text-3xl font-bold mt-1 ">{stat.counter}</p>
        <p className="text-gray-400">{stat.unit}</p>
      </div>
    </div>
  );
}
