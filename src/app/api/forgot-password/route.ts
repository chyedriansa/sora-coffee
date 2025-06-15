import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { sendResetEmail } from "@/lib/mailer"

export async function POST(req: NextRequest) {
    let user;
    try {
        const body = await req.json();
        const { email } = body;
        // check if email exist in the database
        user = await prisma.user.findFirst({
            where: {
                email: email,
            }
        })
        if (!user) {
            return NextResponse.json({ error: "Your Email not found:" }, { status: 404 })
        }
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
    try {
        const token = Math.random().toString(36).substring(2, 15);
        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken: token }
        })
        // Send the reset email
        if (!user.email) {
            return NextResponse.json({ error: "User email is missing." }, { status: 500 });
        }
        await sendResetEmail(user.email, token);
        return NextResponse.json({ message: "Reset email sent successfully." }, { status: 200 });
    } catch (error) {
        console.log("error sending reset email", error);
        return NextResponse.json({ error: "Failed to send reset email." }, { status: 500 });
    }
}