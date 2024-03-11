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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });
    if (!course) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }
    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );
    if (
      !course.title ||
      !course.categoryId ||
      !course.description ||
      !course.imageUrl ||
      !hasPublishedChapter ||
      !course.price
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 401 }
      );
    }
    const publishCourse = await db.course.update({
      where: { id: params.courseId, userId },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishCourse, { status: 200 });
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
