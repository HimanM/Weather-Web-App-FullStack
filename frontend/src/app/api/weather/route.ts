import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET() {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tokenResult = await auth0.getAccessToken();
    const token = tokenResult.token;

    const response = await fetch(`${BACKEND_URL}/api/weather`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    console.error("Weather API proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
