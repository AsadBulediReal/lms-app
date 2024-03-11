import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import Mux from "@mux/mux-node";

const { video } = new Mux({
  tokenId: process.env["MUX_TOKEN_ID"],
  tokenSecret: process.env["MUX_TOKEN_SECRET"],
});

export async function DELETE(
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
        attachments: true,
      },
    });
    if (!course) {
      return NextResponse.json({ message: "No Course Found" }, { status: 404 });
    }
    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        try {
          await video.assets.delete(chapter.muxData.assetId);
        } catch (error) {
          console.log("video not found");
        }
        if (chapter.videoUrl !== null) {
          const newUrl = chapter.videoUrl.substring(
            chapter.videoUrl.lastIndexOf("/") + 1
          );
          const utapi = new UTApi();
          await utapi.deleteFiles(newUrl);
        }
      }
    }
    for (const attachment of course.attachments) {
      if (attachment?.url) {
        const newUrl = attachment.url.substring(
          attachment.url.lastIndexOf("/") + 1
        );
        const utapi = new UTApi();
        await utapi.deleteFiles(newUrl);
      }
    }

    if (course.imageUrl) {
      const newUrl = course.imageUrl.substring(
        course.imageUrl.lastIndexOf("/") + 1
      );
      const utapi = new UTApi();
      await utapi.deleteFiles(newUrl);
    }

    const deleteCourse = await db.course.delete({
      where: { id: params.courseId, userId },
    });

    return NextResponse.json(deleteCourse);
  } catch (error) {
    console.log("[Course_ID_DELETE]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

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

    if (updatedData.deleteImageUrl) {
      const newUrl = updatedData.deleteImageUrl.substring(
        updatedData.deleteImageUrl.lastIndexOf("/") + 1
      );
      const utapi = new UTApi();
      await utapi.deleteFiles(newUrl);
      const courseData = await db.course.update({
        where: { id: params.courseId, userId },
        data: {
          imageUrl: updatedData.imageUrl,
        },
      });
      return NextResponse.json(courseData);
    } else {
      if (updatedData.deleteImageUrl === null) {
        const courseData = await db.course.update({
          where: { id: params.courseId, userId },
          data: {
            imageUrl: updatedData.imageUrl,
          },
        });
        return NextResponse.json(courseData);
      }

      const courseData = await db.course.update({
        where: { id: params.courseId, userId },
        data: {
          ...updatedData,
        },
      });
      return NextResponse.json(courseData);
    }
  } catch (error) {
    console.log("[Course_ID]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
