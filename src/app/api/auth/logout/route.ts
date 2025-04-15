import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Çıkış işlemi için admin_token çerezini sil
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json(
      { message: "Çıkış yapılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
