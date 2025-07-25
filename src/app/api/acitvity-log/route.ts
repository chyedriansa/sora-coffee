import { NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "8c83eae5e44c1fa45054eb285885d4728cfe91b12a4632b318410d3042624fc2"


export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({ error: "No Token" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    try {
        const JWT_SECRET = process.env.JWT_SECRET as string;
        if (!JWT_SECRET) {
            return NextResponse.json({ error: "JWT Secret not configured" }, { status: 500 });
        }
        const decoded = verify (token, JWT_SECRET) as {userId: string};
        // const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });


        const activityLogs = await prisma.auditLog.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true, // Include user details
                item: true,  // Include item details
            }
        });
        return NextResponse.json(activityLogs);
    } catch (error) {
        console.error("Error fetching activity logs:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({ error: "No Token" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    try {
        const JWT_SECRET = process.env.JWT_SECRET as string
        if (!JWT_SECRET) {
            return NextResponse.json({ error: "JWT Secret not configured" }, { status: 500 })
        }

        const decoded = verify(token, JWT_SECRET) as { userId: string };

        const body = await req.json();
        const { id, currentStock } = body;

        const existingItem = await prisma.item.findUnique({
            where: { id: id }
        })

        if (!existingItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 })
        }

        const updatedItem = await prisma.item.update({
            where: { id: id },
            data: { currentStock: currentStock }
        })

        await prisma.auditLog.create({
            data: {
                userId: decoded.userId, 
                action: "update stock",
                itemId: id,
                details: `Stock changed from ${existingItem.currentStock} to ${currentStock}`,
            }
        })

        return NextResponse.json(updatedItem);

    }
    catch (error) {
        console.error("Error updating item and logging activity:", error)
        return NextResponse.json({ error: "internal server error" }, { status: 500 })
    }
}