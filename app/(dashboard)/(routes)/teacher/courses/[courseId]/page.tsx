import IconBadge from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageUpload from "./_components/ImageUpload";
import CategoriesForm from "./_components/CategoriesForm";
import PriceForm from "./_components/PriceForm";
import AttachmentForm from "./_components/AttachmentForm";
import ChapterForm from "./_components/ChapterForm";
import Banner from "@/components/Banner";
import Actions from "./_components/Actions";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  if (params.courseId.length > 24) {
    return redirect("/");
  }
  const courseData = await db.course
    .findUnique({
      where: { id: params.courseId, userId },
      include: {
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })
    .catch((error) => {
      console.log(error);
      return redirect("/");
    });

  const categories = await db.category
    .findMany({
      orderBy: {
        name: "asc",
      },
    })
    .catch((error) => {
      console.log(error);
      return redirect("/");
    });

  if (!courseData) {
    return redirect("/");
  }

  const requiredFields = [
    courseData.title,
    courseData.description,
    courseData.imageUrl,
    courseData.price,
    courseData.categoryId,
    courseData.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!courseData.isPublished && (
        <Banner
          variant="warning"
          labeel="This course is unpublished. It will not be visible to the students!"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={courseData.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={courseData} courseId={courseData.id} />
            <DescriptionForm
              initialData={courseData}
              courseId={courseData.id}
            />
            <ImageUpload initialData={courseData} courseId={courseData.id} />
            <CategoriesForm
              initialData={courseData}
              courseId={courseData.id}
              options={categories.map((category) => {
                return {
                  label: category.name,
                  value: category.id,
                };
              })}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2 ">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <div>
                {" "}
                <ChapterForm
                  initialData={courseData}
                  courseId={courseData.id}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={courseData} courseId={courseData.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm
                initialData={courseData}
                courseId={courseData.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
