import { NextResponse } from "next/server";

export async function GET() {
 const buyers = [
  {
    id: 1,
    company: "Modern Living USA",
    email: "buying@modernliving.com",
    city: "New York",
    category: "Home Furnishings",
    match: "95%"
  },
  {
    id: 2,
    company: "Elegant Interiors",
    email: "contact@elegantinteriors.com",
    city: "Chicago",
    category: "Interior Design",
    match: "91%"
  },
  {
    id: 3,
    company: "Home Decor Imports",
    email: "purchases@homedecorimports.com",
    city: "Los Angeles",
    category: "Decor Imports",
    match: "88%"
  },
];
  return NextResponse.json(buyers);
}