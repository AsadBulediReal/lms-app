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
    const muxData = await db.muxData.findFirst({
      where: { chapterId: params.chapterId },
    });
    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const publishChapter = await db.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishChapter);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
