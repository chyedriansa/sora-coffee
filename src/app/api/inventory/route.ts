import { NextRequest, NextResponse } from "next/server";
// import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const items = await prisma.item.findMany({
            include: {
                category: true,
                currentstock: true,
            }
        });
        return NextResponse.json(items);
    }
    catch (error) {
        console.error('error fetching item:', error);
        return new NextResponse('internal server error', { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, category, price } = body;
        //for validate the body
        if (!name || !category || !price) {
            return new NextResponse('invalid request item', { status: 400 });
        }
        //for create item
        const item = await prisma.item.create({
            data: {
                name,
                category,
                price,
                currentstock: {
                    create: {
                        stock: 0,
                    }
                },
            }
        });
        return NextResponse.json(item);
    }
    catch (error) {
        console.error('error creating item', error);
        return new NextResponse('intenal server error', { status: 500 })
    }
}

