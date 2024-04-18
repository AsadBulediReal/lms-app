import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CoursesIdPage = async ({ params }: { params: { courseId: string } }) => {
  if (params.courseId.length > 24) {
    return redirect("/");
  }

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
  if (!course) {
    return redirect("/");
  }
  return redirect(
    `/courses/${params.courseId}/chapters/${course.chapters[0].id}`
  );
};

export default CoursesIdPage;
