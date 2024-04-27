import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Chapter, Course, UserProgress } from "@prisma/client";
import React from "react";
import CourseSideBarItem from "./CourseSideBarItem";
import CourseProgress from "@/components/CourseProgress";

interface CourseSideBarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progress: number | null;
}

const CourseSideBar = async ({ course, progress }: CourseSideBarProps) => {
  const { userId } = auth();

  let isPurchased;

  if (userId) {
    isPurchased = await db.purchase.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });
  } else {
    isPurchased = null;
  }

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-7 flex flex-col border-b justify-center items-center">
        <h1 className="font-semibold overflow-hidden text-ellipsis text-nowrap max-w-[18rem]">
          {course.title}
        </h1>
      </div>
      {isPurchased && (
        <div className="p-7 flex flex-col justify-center">
          <CourseProgress variant="success" value={progress || 0} />
        </div>
      )}
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => {
          return (
            <CourseSideBarItem
              key={chapter.id}
              id={chapter.id}
              label={chapter.title}
              courseId={course.id}
              isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
              isLocked={!chapter.isFree && !isPurchased}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CourseSideBar;
