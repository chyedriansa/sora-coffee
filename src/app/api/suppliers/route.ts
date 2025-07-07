import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const suppliers = await prisma.supplier.findMany({
            include: {
                items: true,
            },
        });
        return NextResponse.json(suppliers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch suppliers." }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, address, phone } = body;

        // Validate required fields
        if (!name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate phone format BEFORE creating supplier
        const phoneRegex = /^[0-9+\-() ]+$/;
        if (phone && !phoneRegex.test(phone)) {
            return NextResponse.json({ error: "Invalid phone format" }, { status: 400 });
        }

        // Create new supplier
        const newSupplier = await prisma.supplier.create({
            data: {
                name,
                address,
                phone,
            },
        });

        return NextResponse.json(newSupplier, { status: 201 });
    } catch (error) {
        console.error("Error creating supplier:", error);
        return NextResponse.json({ error: "Failed to create supplier." }, { status: 500 });
    }
}