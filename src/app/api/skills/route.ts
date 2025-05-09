import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skill from "@/models/Skill";

export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find().sort({ createdAt: -1 });
    return NextResponse.json(skills);
  } catch {
    return NextResponse.json(
      { message: "Yetenekler alınırken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, icon } = await request.json();

    await connectDB();
    const skill = new Skill({ name, icon });
    await skill.save();

    return NextResponse.json(skill);
  } catch {
    return NextResponse.json(
      { message: "Yetenek eklenirken hata oluştu" },
      { status: 500 }
    );
  }
}
