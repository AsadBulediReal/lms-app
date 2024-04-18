import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getProgress } from "@/actions/get-progress";

import CourseSideBar from "./_components/CourseSideBar";
import CourseNavBar from "./_components/CourseNavBar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();

  let course;

  if (params.courseId.length > 24) {
    return redirect("/");
  }

  if (userId) {
    course = await db.course.findUnique({
      where: { id: params.courseId },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          include: {
            userProgress: {
              where: {
                userId,
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  } else {
    course = await db.course.findUnique({
      where: { id: params.courseId },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          include: {
            userProgress: {
              where: {
                chapter: {
                  courseId: params.courseId,
                },
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  }
  if (!course) {
    return redirect("/");
  }

  let progressCount;

  if (userId) {
    progressCount = await getProgress(userId, course.id);
  }

  return (
    <div className="h-full">
      <div className="h-[81px] md:pl-80 fixed inset-y-0 w-full z-50">
        {progressCount === undefined ? (
          // Renders this when user is not logged in
          <CourseNavBar course={course} progress={null} />
        ) : (
          // Renders this when user is logged in
          <CourseNavBar course={course} progress={progressCount} />
        )}
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        {progressCount === undefined ? (
          // Renders this when user is not logged in
          <CourseSideBar course={course} progress={null} />
        ) : (
          // Renders this when user is logged in
          <CourseSideBar course={course} progress={progressCount} />
        )}
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default CourseLayout;
