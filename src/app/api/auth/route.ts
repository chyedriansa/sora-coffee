import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';


// export async function POST(
//     req: NextRequest
// ) {
//     try {
//         const body = await req.json();
//         // Hash the password from the request body
//         const hashedPassword = await bcrypt.hash(body.Password, 12);
//         const user = await prisma.user.findFirst({
//             where: {
//                 email: body.Email,
//                 password: hashedPassword,
//             }
//         });
//         // You may want to return a response here if user is found or not
//         return NextResponse.json({ message: "Register Succesfull", user });
//     } catch (error) {
//         console.error("Error During Auth", error);
//         return NextResponse.json({ error: "internal server error " }, { status: 500 });
//     }
// }


// export async function GET(
//     req: NextRequest
// ): Promise<NextResponse> {
//     try {
//         // You can use query parameters or headers from req if needed
//         const users = await prisma.user.findFirst({
//             select: {
//                 email: true,
//                 password: true,
//             }
//         });
//         return NextResponse.json({ users });
//     } catch (error) {
//         console.error("Error During Login", error);
//         return NextResponse.json({ error: "internal server error" }, { status: 500 });
//     }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from '@/lib/prisma';
// import bcrypt from 'bcrypt';

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
        data: { name, email, password: hashedPassword},
      });
      return NextResponse.json({ message: "Register successful", user: { id: user.id, email: user.email } });
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
      return NextResponse.json({ message: "Login successful", user: { id: user.id, email: user.email } });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error During Auth", error);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}