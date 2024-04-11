import CourseCard from "@/components/CourseCard";
import { Course, Category } from "@prisma/client";

import React from "react";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-2">
        {items.map(
          ({ id, title, category, chapters, progress, imageUrl, price }) => (
            <CourseCard
              key={id}
              id={id}
              title={title}
              imageUrl={imageUrl!}
              chaptersLength={chapters.length}
              category={category?.name!}
              price={price!}
              progress={progress}
            />
          )
        )}
      </div>
      {items.length === 0 && (
        <div className="text-center text-md text-muted-foreground  mt-10">
          No courses found
        </div>
      )}
    </div>
  );
};

export default CoursesList;
