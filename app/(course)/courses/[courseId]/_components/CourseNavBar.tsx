import NavbarRoutes from "@/components/NavbarRoutes";
import { Chapter, Course, UserProgress } from "@prisma/client";
import React from "react";
import CourseMobileSideBar from "./CourseMobileSideBar";
import { auth } from "@clerk/nextjs";

interface CourseNavBarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progress: number | null;
}

const CourseNavBar = ({ course, progress }: CourseNavBarProps) => {
  const { sessionClaims } = auth();
  return (
    <div className="p-7 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSideBar course={course} progress={progress} />
      <NavbarRoutes role={sessionClaims?.metadata?.role} />
    </div>
  );
};

export default CourseNavBar;
