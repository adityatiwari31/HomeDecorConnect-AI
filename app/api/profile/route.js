import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    "https://api.apollo.io/api/v1/users/api_profile",
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.APOLLO_API_KEY,
      },
    }
  );

  const data = await response.json();

  return NextResponse.json(data);
}