import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const updatedData = await req.json();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const courseOwner = db.course.findUnique({
      where: { id: params.courseId, userId },
    });
    if (!courseOwner) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    for (const item of updatedData) {
      await db.chapter.update({
        where: { id: item.id },
        data: {
          position: item.position,
        },
      });
    }
    return NextResponse.json({
      message: "Updated Successfully",
    });
  } catch (error) {
    console.log("[REORDER]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
