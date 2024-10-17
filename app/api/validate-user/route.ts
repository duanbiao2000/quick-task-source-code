import { NextResponse } from "next/server";
import { validateRequest } from "@/app/aut";

export async function GET() {
  try {
    const user = await validateRequest();

    if (!user || !user.user) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user.user.id,
        email: user.user.email,
        // Add any other user properties you need, but be careful not to expose sensitive information
      },
    });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { isAuthenticated: false, error: "Validation failed" },
      { status: 500 }
    );
  }
}
