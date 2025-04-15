import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");

    if (!token?.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // JWT token doğrulaması
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    try {
      jwt.verify(token.value, JWT_SECRET);
      return NextResponse.json({ authenticated: true });
    } catch (error) {
      // Token geçersiz veya süresi dolmuş
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}
