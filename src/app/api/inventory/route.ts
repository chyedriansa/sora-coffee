import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all items with category and supplier info
export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true,
        supplier: true,

      },
      orderBy: { lastUpdated: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Create a new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      categoryTitle,
      supplierName,
      currentStock,
      minStock,
      maxStock,
      unit,
      price,
    } = body;

    // Validate required fields
    if (
      !name ||
      !categoryTitle ||
      !supplierName ||
      currentStock === undefined ||
      minStock === undefined ||
      maxStock === undefined ||
      !unit ||
      price === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create category
    let category = await prisma.category.findUnique({
      where: { title: categoryTitle },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { title: categoryTitle },
      });
    }

    // Find or create supplier
    let supplier = await prisma.supplier.findUnique({
      where: { name: supplierName },
    });
    if (!supplier) {
      supplier = await prisma.supplier.create({
        data: { name: supplierName },
      });
    }

    // Create the item
    const item = await prisma.item.create({
      data: {
        name,
        categoryId: category.id,
        supplierId: supplier.id,
        currentStock,
        minStock,
        maxStock,
        unit,
        price,
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error creating item:", error);
          return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
          );
        }
    }