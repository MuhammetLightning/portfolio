import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const project = await Project.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { message: "Proje bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Proje getirilirken hata:", error);
    return NextResponse.json(
      { message: "Proje getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    await connectDB();

    const project = await Project.findByIdAndUpdate(params.id, data, {
      new: true,
    });

    if (!project) {
      return NextResponse.json(
        { message: "Proje bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Proje güncellenirken hata:", error);
    return NextResponse.json(
      { message: "Proje güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const project = await Project.findByIdAndDelete(params.id);

    if (!project) {
      return NextResponse.json(
        { message: "Proje bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Proje başarıyla silindi" });
  } catch (error) {
    console.error("Proje silinirken hata:", error);
    return NextResponse.json(
      { message: "Proje silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
