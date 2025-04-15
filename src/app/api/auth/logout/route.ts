import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("admin_token");

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Çıkış yapılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
