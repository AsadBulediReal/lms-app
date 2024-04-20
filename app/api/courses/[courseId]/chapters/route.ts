import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId, sessionClaims } = auth();

    const { title } = await req.json();

    if (sessionClaims?.metadata.role !== "admin" || !userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const courseOwner = db.course.findUnique({
      where: { id: params.courseId, userId },
    });
    if (!courseOwner) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;
    const newChapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(newChapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
