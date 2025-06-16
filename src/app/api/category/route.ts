import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const categories = await prisma.category.findMany({
    });
    return NextResponse.json(categories);
}

export async function POST (request: NextRequest){
    try{
        const body = await request.json();
        const {title} =  body;
    }
    catch (error){
        return NextResponse.json({ error: "internal Server Error" }, { status: 500 });
    }
}