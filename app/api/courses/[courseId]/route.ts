import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const updatedData = await req.json();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (params.courseId.length > 24) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const courseData = await db.course.update({
      where: { id: params.courseId, userId },
      data: {
        ...updatedData,
      },
    });
    return NextResponse.json(courseData);
  } catch (error) {
    console.log("[Course_ID]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
