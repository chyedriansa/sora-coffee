import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "8c83eae5e44c1fa45054eb285885d4728cfe91b12a4632b318410d3042624fc2"

// GET: Fetch all items with category and supplier info
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  try {
    const JWT_SECRET = process.env.JWT_SECRET as string;
    if (!JWT_SECRET) {
      return NextResponse.json({ error: "JWT secret not configured" }, { status: 500 });
    }
    const decoded = verify(token, JWT_SECRET);
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

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }
    //delete the item
    const deletedItem = await prisma.item.delete({
      where: { id },
      include: {
        category: true,
        supplier: true,
      },
    });
    return NextResponse.json(deletedItem);
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle update stock (increase or decrease)
    if (body.updateStockQty !== undefined && body.id && body.updateType) {
      const authHeader = request.headers.get("authorization");
      if (!authHeader) {
        return NextResponse.json({ error: "No token" }, { status: 401 });
      }
      const token = authHeader.split(" ")[1];
      try {
        const decoded = verify(token, JWT_SECRET) as { userId: string };

        const item = await prisma.item.findUnique({ where: { id: body.id } });
        if (!item) {
          return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }
        const oldStock = item.currentStock || 0;
        let newStock = oldStock;
        if (body.updateType === "increase") {
          newStock += Number(body.updateStockQty);
        } else if (body.updateType === "decrease") {
          newStock -= Number(body.updateStockQty);
          if (newStock < 0) {
            return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
          }
        }
        const updated = await prisma.item.update({
          where: { id: body.id },
          data: { currentStock: newStock },
          include: { category: true, supplier: true },
        });

        // Audit log here
        await prisma.auditLog.create({
          data: {
            userId: decoded.userId, // Use the userId from the token
            action: "update_stock",
            itemId: item.id, // Use the item's id
            details: `Stock changed from ${oldStock} to ${newStock}`,
          }
        })

        return NextResponse.json(updated);
      } catch (jwtError: any) {
        console.error("JWT Verification Error:", jwtError);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    // ...existing update logic for full item update...
    // (leave your existing code here)
  }
  catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}