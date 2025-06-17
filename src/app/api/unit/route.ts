import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const units = await prisma.item.findMany({
            select: { unit: true }
        });
        return NextResponse.json(units);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch units" }, { status: 500 });
    }
}