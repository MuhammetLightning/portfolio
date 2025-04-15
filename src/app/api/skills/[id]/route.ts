import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skill from "@/models/Skill";

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
  const { name, icon } = await request.json();
  const skill = await Skill.findByIdAndUpdate(
    id,
    { name, icon },
    { new: true }
  );
  if (!skill) {
    return NextResponse.json({ error: "Yetenek bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(skill);
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
  const skill = await Skill.findByIdAndDelete(id);
  if (!skill) {
    return NextResponse.json({ error: "Yetenek bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ message: "Yetenek başarıyla silindi" });
}
