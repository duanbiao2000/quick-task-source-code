import { NextResponse } from "next/server";
import { logout } from "@/app/logout"; // Adjust the import path as needed

export async function GET() {
  try {
    const result = await logout();
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}
