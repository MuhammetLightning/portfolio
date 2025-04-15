import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Profile from "@/models/Profile";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    await connectDB();
    const profile = await Profile.findOne().lean();

    if (!profile) {
      return NextResponse.json({
        fullName: "",
        about: "",
        email: "",
        github: "",
        linkedin: "",
        profileImage: "/images/default-profile.jpg",
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profil verisi alınırken hata:", error);
    return NextResponse.json(
      { error: "Profil verisi alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Gelen profil verisi:", data);

    await connectDB();
    console.log("MongoDB bağlantısı başarılı (POST)");

    // Eğer profil varsa güncelle, yoksa yeni oluştur
    const profile = await Profile.findOneAndUpdate(
      {},
      {
        fullName: data.fullName,
        about: data.about,
        email: data.email,
        github: data.github,
        linkedin: data.linkedin,
        profileImage: data.profileImage,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).lean();

    console.log("Güncellenen profil:", profile);
    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Profil güncelleme hatası:", error);
    return NextResponse.json(
      {
        message: "Profil güncellenirken bir hata oluştu",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
