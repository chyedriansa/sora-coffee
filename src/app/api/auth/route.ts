import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "8c83eae5e44c1fa45054eb285885d4728cfe91b12a4632b318410d3042624fc2"


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, email, password, name } = body;

    if (type === "register") {
      const existing = await prisma.user.findFirst({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "email already exists" }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },

      });
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      return NextResponse.json({ message: "Register successful", token, user: { id: user.id, email: user.email } });
    }

    if (type === "login") {
      const user = await prisma.user.findFirst({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const valid = await bcrypt.compare(password, user.password!);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '0.5h' });
      await prisma.user.update({    
        where: { id: user.id },
        data: { lastLogin: new Date() }
      }); 
      return NextResponse.json({ message: "Login successful", token, user: { id: user.id, email: user.email } });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error in auth route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

