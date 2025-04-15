import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // .env'den admin bilgilerini al
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    // Çevre değişkenlerinin varlığını kontrol et
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
      console.error("Eksik çevre değişkenleri");
      return NextResponse.json(
        { message: "Sunucu yapılandırması eksik" },
        { status: 500 }
      );
    }

    // Kullanıcı adı ve şifre kontrolü
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // JWT token oluştur
      const token = jwt.sign(
        { username: ADMIN_USERNAME },
        JWT_SECRET,
        { expiresIn: "24h" } // Token 24 saat geçerli
      );

      // Başarılı giriş
      const response = NextResponse.json({ success: true });

      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 gün
      });

      return response;
    }

    return NextResponse.json(
      { message: "Geçersiz kullanıcı adı veya şifre" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login hatası:", error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}
