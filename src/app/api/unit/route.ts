import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const units = await prisma.unit.findMany();
    return NextResponse.json(units);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch units" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { name } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "Unit name required" }, { status: 400 });
  }
  const unit = await prisma.unit.create({ data: { name } });
  return NextResponse.json(unit);
}