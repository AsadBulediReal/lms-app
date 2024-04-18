import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/Banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import VideoPlayer from "./_components/VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";

const ChapterIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}) => {
  const { userId } = auth();
  const {
    course,
    chapter,
    attachments,
    muxData,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    courseId: params.courseId,
    chapterId: params.chapterId,
    userId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }
  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          label="You already completed this chapter."
          height="h-[57px]"
          variant={"success"}
        />
      )}
      {isLocked && (
        <Banner
          label="You need to purchase this course to watch this chapter."
          height="h-[57px]"
          variant={"warning"}
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <div>//TODO: Course progress button</div>
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
