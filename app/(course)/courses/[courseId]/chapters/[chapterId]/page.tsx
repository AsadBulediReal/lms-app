import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/Banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import VideoPlayer from "./_components/VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/Preview";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/CourseProgressButton";

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
    totalAttachments,
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
      <div className="flex flex-col mx-auto pb-20">
        <div>
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
          <div
            className={`pt-4 pl-4 pr-4 ${
              !purchase ? "pb-2" : "pb-4"
            } flex flex-col md:flex-row items-center justify-between`}
          >
            <div className="flex md:block flex-col justify-center items-center w-full md:w-auto">
              <h2 className="text-2xl pl-2 font-semibold mb-2 capitalize">
                {chapter.title}
              </h2>
              {!purchase && (
                <div className="flex items-center justify-center p-3 mb-2 w-full md:w-60 bg-sky-200 border text-sky-700 rounded-md">
                  <File className="h-4 w-4" />
                  <p className="ml-1 line-clamp-1">
                    Total Attachments: {totalAttachments}
                  </p>
                </div>
              )}
            </div>

            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4 flex flex-col gap-y-4">
                {attachments.map((attachment, index) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id + index}
                    className="flex items-center p-3 gap-x-2 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                    download={attachment.name}
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
