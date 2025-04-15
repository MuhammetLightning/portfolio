import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // E-posta gönderme işlemi için transporter oluştur
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Gmail'den alınan uygulama şifresi
      },
    });

    // E-posta içeriğini oluştur
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "muhammet.lightning@gmail.com",
      subject: `Portfolio İletişim Formu - ${name}`,
      html: `
        <h3>Yeni İletişim Formu Mesajı</h3>
        <p><strong>İsim:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message}</p>
      `,
    };

    // E-postayı gönder
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "E-posta başarıyla gönderildi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("E-posta gönderme hatası:", error);
    return NextResponse.json(
      { message: "E-posta gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
