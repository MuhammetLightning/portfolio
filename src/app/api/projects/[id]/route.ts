import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET(request: Request) {
  await connectDB();
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      { error: "ID parametresi eksik" },
      { status: 400 }
    );
  }
  const project = await Project.findById(id);
  if (!project) {
    return NextResponse.json({ error: "Proje bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PUT(request: Request) {
  await connectDB();
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      { error: "ID parametresi eksik" },
      { status: 400 }
    );
  }
  const data = await request.json();
  const project = await Project.findByIdAndUpdate(id, data, { new: true });
  if (!project) {
    return NextResponse.json({ message: "Proje bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function DELETE(request: Request) {
  await connectDB();
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      { error: "ID parametresi eksik" },
      { status: 400 }
    );
  }
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    return NextResponse.json({ message: "Proje bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ message: "Proje başarıyla silindi" });
}
