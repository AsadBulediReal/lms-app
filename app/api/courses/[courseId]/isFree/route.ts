import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { isFree } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });
    if (!courseOwner) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updateCourse = await db.course.update({
      where: { id: params.courseId },
      data: { isFree: isFree, price: null },
    });

    return NextResponse.json(updateCourse);
  } catch (error) {
    console.log("[IS_FREE]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
