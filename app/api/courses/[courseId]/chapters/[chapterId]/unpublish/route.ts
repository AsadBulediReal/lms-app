import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId, sessionClaims } = auth();

    if (sessionClaims?.metadata.role !== "admin" || !userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });
    if (!courseOwner) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: { id: params.chapterId, courseId: params.courseId },
    });

    if (!chapter) {
      return NextResponse.json(
        { message: "Chapter not found" },
        {
          status: 404,
        }
      );
    }

    const unpublishChapter = await db.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: {
        isPublished: false,
      },
    });
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });
    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: { id: params.courseId },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublishChapter);
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
