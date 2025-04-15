import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skill from "@/models/Skill";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, icon } = await request.json();

    await connectDB();
    const skill = await Skill.findByIdAndUpdate(
      params.id,
      { name, icon },
      { new: true }
    );

    if (!skill) {
      return NextResponse.json(
        { error: "Yetenek bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const skill = await Skill.findByIdAndDelete(params.id);

    if (!skill) {
      return NextResponse.json(
        { error: "Yetenek bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Yetenek başarıyla silindi" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
