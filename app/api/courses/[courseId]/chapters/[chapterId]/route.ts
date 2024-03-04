import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { UTApi } from "uploadthing/server";

const { video } = new Mux({
  tokenId: process.env["MUX_TOKEN_ID"],
  tokenSecret: process.env["MUX_TOKEN_SECRET"],
});

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...updatedData } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });
    if (!courseOwner) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (updatedData.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      });

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: { id: existingMuxData.id },
        });
      }

      const existingVideo = await db.chapter.findUnique({
        where: { id: params.chapterId },
        include: {
          muxData: true,
        },
      });

      if (existingVideo?.videoUrl) {
        const newUrl = existingVideo.videoUrl.substring(
          existingVideo.videoUrl.lastIndexOf("/") + 1
        );
        const utapi = new UTApi();
        await utapi.deleteFiles(newUrl);
      }
      const asset = await video.assets.create({
        input: updatedData.videoUrl,
        playback_policy: ["public"],
        test: false,
      });
      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0].id,
        },
      });
    }

    const updateChapter = await db.chapter.update({
      where: { id: params.chapterId },
      data: { ...updatedData },
    });

    return NextResponse.json(updateChapter);
  } catch (error) {
    console.log("[COURSE_CHAPTER_ID", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
