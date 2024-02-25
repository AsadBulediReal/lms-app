import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const data = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const Owner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });
    if (!Owner) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const attachments = await db.attachment.create({
      data: {
        url: data.url,
        name: data.name,
        courseId: params.courseId,
      },
    });

    return NextResponse.json({ attachments }, { status: 201 });
  } catch (error) {
    console.log("[COURSES_ID_ATTACHMENTS]", error);
    return NextResponse.json(
      { message: "Internal Error" },
      {
        status: 500,
      }
    );
  }
}
