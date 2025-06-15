import nodemailer from "nodemailer";

export const sendResetEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.PASSWORD_USER,
        }
    });

    const resetLink = `${process.env.PUBLIC_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
        from: '"APP_SUPPORT" <no-reply@Mail.com',
        to: email,
        subject: "Password Reset Request:",
        html: `<p>Klik link berikut untuk reset password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
    })
}
