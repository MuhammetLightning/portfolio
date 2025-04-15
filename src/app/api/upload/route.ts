import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    // File'ı buffer'a dönüştür
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Base64'e dönüştür
    const fileStr = buffer.toString("base64");
    const fileUri = `data:${file.type};base64,${fileStr}`;

    // Cloudinary'ye yükle
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: "profile_images",
      transformation: [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Yükleme hatası:", error);
    return NextResponse.json(
      { error: "Resim yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
