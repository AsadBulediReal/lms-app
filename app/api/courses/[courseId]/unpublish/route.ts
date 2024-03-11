import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const course = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });
    if (!course) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    const unPublishCourse = await db.course.update({
      where: { id: params.courseId, userId },
      data: {
        isPublished: false,
      },
    });
    return NextResponse.json(unPublishCourse, { status: 200 });
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
