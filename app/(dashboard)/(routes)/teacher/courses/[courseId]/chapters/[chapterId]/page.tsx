import IconBadge from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ChapterTitleForm from "./_components/ChapterTitleForm";
import ChapterDescriptionForm from "./_components/ChapterDescriptionForm";
import ChapterAccessForm from "./_components/ChapterAccessForm";
import ChapterVideoUpload from "./_components/ChapterVideoUpload";
import Banner from "@/components/Banner";
import ChapterActions from "./_components/ChapterActions";

import { Metadata } from "next";

// set dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}): Promise<Metadata> {
  const getChapterName = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
  });
  return {
    title: "Editing - " + getChapterName?.title,
  };
}

const EditChapter = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId, sessionClaims } = auth();

  if (sessionClaims?.metadata.role !== "admin" || !userId) {
    return redirect("/");
  }
  const courseOwner = db.course
    .findUnique({
      where: { id: params.courseId, userId },
    })
    .catch((error) => {
      if (error.message.includes("hex")) {
        console.log("Wrong Id");
      } else console.log(error);
    });
  if (!courseOwner) {
    return redirect("/");
  }
  const chapter = await db.chapter
    .findUnique({
      where: { id: params.chapterId, courseId: params.courseId },
      include: {
        muxData: true,
      },
    })
    .catch((error) => {
      if (error.message.includes("hex")) {
        console.log("Wrong Id");
      } else console.log(error);
    });
  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  if (!isComplete) {
    if (chapter.isPublished) {
      await db.chapter.update({
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
    }
  }

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course!"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields{completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <ChapterDescriptionForm
                chapterId={params.chapterId}
                courseId={params.courseId}
                initialData={chapter}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <ChapterAccessForm
                chapterId={params.chapterId}
                courseId={params.courseId}
                initialData={chapter}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2 ">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a Video</h2>
            </div>
            <ChapterVideoUpload
              chapterId={params.chapterId}
              courseId={params.courseId}
              initialData={chapter}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditChapter;
