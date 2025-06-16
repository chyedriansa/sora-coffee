import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const categories = await prisma.category.findMany({
        include: {
            items: true,
        },
    });
    return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title } = body;
        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }
        const existingCategory = await prisma.category.findUnique({
            where: { title },
        });
        if (existingCategory) {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }
        const newCategory = await prisma.category.create({
            data: { title },
        });
        return NextResponse.json(newCategory, { status: 201 });

    }
    catch (error) {
        return NextResponse.json({ error: "internal Server Error" }, { status: 500 });
    }
}