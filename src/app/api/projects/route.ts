import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projeler getirilirken hata:", error);
    return NextResponse.json(
      { message: "Projeler getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectDB();

    const project = await Project.create(data);
    return NextResponse.json(project);
  } catch (error: any) {
    console.error("Proje oluşturulurken hata:", error);
    return NextResponse.json(
      {
        message: "Proje oluşturulurken bir hata oluştu",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
