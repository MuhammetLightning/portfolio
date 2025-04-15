import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error: unknown) {
    console.error("Projeler getirilirken hata:", error);
    let message = "Projeler getirilirken bir hata oluştu";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      {
        message,
        error: error instanceof Error ? error.message : String(error),
      },
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
  } catch (error: unknown) {
    console.error("Proje oluşturulurken hata:", error);
    let message = "Proje oluşturulurken bir hata oluştu";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      {
        message,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
