import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Metadata } from "next";

// set dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: {
    courseId: string;
  };
}): Promise<Metadata> {
  const getChapterName = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  });
  return {
    title: getChapterName?.title,
  };
}

const CoursesIdPage = async ({ params }: { params: { courseId: string } }) => {
  if (params.courseId.length > 24) {
    return redirect("/");
  }

  const { userId } = auth();

  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  const getChapterProgress = await db.chapter.findMany({
    where: {
      courseId: params.courseId,
    },
    orderBy: {
      position: "asc",
    },
    include: {
      userProgress: {
        where: {
          userId: userId || "",
        },
      },
    },
  });
  if (!course) {
    return redirect("/");
  }

  const incompleteChapter = getChapterProgress.find((chapter) => {
    return !chapter.userProgress || !chapter.userProgress[0]?.isCompleted;
  });

  if (incompleteChapter) {
    return redirect(
      `/courses/${params.courseId}/chapters/${incompleteChapter.id}`
    );
  } else {
    return redirect(
      `/courses/${params.courseId}/chapters/${course.chapters[0].id}`
    );
  }
};

export default CoursesIdPage;
