import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { isCompleted } = await req.json();

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId: userId,
          chapterId: params.chapterId,
        },
      },
      create: {
        userId,
        chapterId: params.chapterId,
        isCompleted: isCompleted,
      },
      update: {
        isCompleted: isCompleted,
      },
    });
    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID-PROGRESS]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
