import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
  userId?: string | null;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    let purchase;
    if (userId) {
      purchase = await db.purchase.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });
    }
    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
      select: {
        price: true,
      },
    });
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });
    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    const allAttacments = await db.attachment.findMany({
      where: {
        courseId: courseId,
      },
    });

    const totalAttachments = allAttacments.length;

    if (purchase) {
      attachments = allAttacments;
    }
    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId,
        },
      });
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    let userProgress;
    if (userId) {
      userProgress = await db.userProgress.findUnique({
        where: {
          userId_chapterId: {
            userId: userId,
            chapterId: chapterId,
          },
        },
      });
    }
    return {
      course,
      chapter,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
      totalAttachments,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
      totalAttachments: 0,
    };
  }
};
