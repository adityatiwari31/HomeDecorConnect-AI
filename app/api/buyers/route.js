import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    "https://nominatim.openstreetmap.org/search?q=home+decor+store+usa&format=json&limit=10",
    {
      headers: {
        "User-Agent": "HomeDecorConnect"
      }
    }
  );

  const data = await response.json();

  const buyers = data.map((item, index) => ({
  id: index + 1,
  company: item.display_name.split(",")[0],
  city: item.display_name,
  category: "Home Decor",
  email: `contact@${item.display_name
    .split(",")[0]
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase()}.com`,
  match: `${95 - index}%`,
}));

  return NextResponse.json(buyers);
}