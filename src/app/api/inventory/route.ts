import { NextRequest, NextResponse } from "next/server";
// import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try{
        const items = await prisma.item.findMany({
            include: {
                category:true,
                currentstock:true,
            }
        });
        return NextResponse.json(items);
    }
catch (error){
    console.error('error fetching item:' , error);
    return new NextResponse('internal server error' , {status : 500})
}
}

