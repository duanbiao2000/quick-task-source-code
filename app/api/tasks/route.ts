import { Task } from "@/app/data/Tasks";
import { NextResponse } from "next/server";
import { db } from "@/app/db/drizzle";
import { tasksTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request
): Promise<
  NextResponse<{ tasks?: Task[]; success: boolean; message: string }>
> {
  try {
    //Access to the userID from the URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    //If the userId is undefined, return success as false
    if (!userId) {
      return NextResponse.json({ success: false, message: "user ID required" });
    }

    //Get the tasks with the userId
    const tasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.userId, userId));

    //Return a success response
    return NextResponse.json({
      tasks,
      success: true,
      message: "Successfully fetched tasks",
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch tasks from the server.",
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "user is undefined",
      });
    }

    const body: { option: "delete" | "deleteAll"; task?: Task } =
      await request.json();

    const { option, task } = body;

    if (!option) {
      return NextResponse.json({
        success: false,
        message: "option is not defined",
      });
    }

    if (option === "delete") {
      if (task) {
        // Delete a specific task
        const deletedTask = await db
          .delete(tasksTable)
          .where(eq(tasksTable.id, task.id));

        if (!deletedTask) {
          return NextResponse.json({
            success: false,
            message: "Task not found or deletion failed",
          });
        }

        return NextResponse.json({
          success: true,
          message: "Task deleted successfully!",
        });
      }
    }

    if (option === "deleteAll") {
      const deletedAllTasks = await db
        .delete(tasksTable)
        .where(eq(tasksTable.userId, userId)); // Delete all tasks for the specified user

      if (!deletedAllTasks) {
        return NextResponse.json({
          success: false,
          message: "Failed to delete all tasks",
        });
      }

      return NextResponse.json({
        success: true,
        message: "deleting all task",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Invalid option provided",
    });
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body: Task = await request.json();

    // Destructure and check if all the fields are coming from the client
    const { id, name, priority, status } = body;

    // Update the task in the database
    const updatedTask = await db
      .update(tasksTable)
      .set({ name, priority, status })
      .where(eq(tasksTable.id, id))
      .returning();

    if (!updatedTask) {
      return NextResponse.json({
        success: false,
        message: "Task not found or update failed",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<{ success: boolean; message: string }>> {
  try {
    const body: Task = await request.json();

    // Destructure and check if all the fields are coming from the client
    const { id, name, priority, status, userId } = body;

    if (!id || !name || !priority || !status || !userId) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    // Log the body for debugging
    console.log("Received task data:", body);

    // Insert the task into the database
    const result = await db.insert(tasksTable).values({
      id, // Using the task's id
      name,
      priority, // "low", "medium", or "high"
      status, // "in progress" or "completed"
      userId, // Foreign key reference to the user
    });

    // Check if the insertion was successful and return appropriate response
    if (result) {
      return NextResponse.json({
        success: true,
        message: "Task has been added successfully!",
        // Return the inserted task for verification
      });
    }

    // Handle possible insertion failure
    return NextResponse.json({
      success: false,
      message: "Task insertion failed!",
    });
  } catch (error) {
    console.error("Error inserting task:", error);
    return NextResponse.json({
      success: false,
      message: `Failed to create a task in the server`,
    });
  }
}
