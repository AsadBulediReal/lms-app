import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export async function POST(
  req: Request,
  { params }: { params: { attachmentId: string; courseId: string } }
) {
  try {
    const data = await req.json();

    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const courseOwner = db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!courseOwner) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const newUrl = data.url.substring(data.url.lastIndexOf("/") + 1);
    const utapi = new UTApi();
    await utapi.deleteFiles(newUrl);

    const deleteAttachment = await db.attachment.delete({
      where: { id: params.attachmentId, courseId: params.courseId },
    });
    return NextResponse.json(deleteAttachment);
  } catch (error) {
    console.log("[COURSES_ID_ATTACHMENTS]", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
