import { db } from "@/lib/db";
import React from "react";
import Categories from "./_components/Categories";
import SearchInput from "@/components/SearchInput";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs";
import CoursesList from "@/components/CoursesList";

interface SearchParramsProps {
  searchParams: { title: string; categoryId: string };
}

const SearchPage = async ({ searchParams }: SearchParramsProps) => {
  const { userId } = auth();

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  let courses;

  if (userId) {
    courses = await getCourses({ userId, ...searchParams });
  } else {
    courses = await getCourses({ ...searchParams });
  }

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        {courses && <CoursesList items={courses} />}
      </div>
    </>
  );
};

export default SearchPage;
