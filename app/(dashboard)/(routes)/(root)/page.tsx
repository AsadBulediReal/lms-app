import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/CoursesList";
import { UserButton, auth } from "@clerk/nextjs";
import { CheckCircle, Clock } from "lucide-react";
import InfoCard from "./_components/InfoCard";

export default async function Dashboard() {
  const { userId } = auth();

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId!
  );

  return (
    <div className="flex p-6 flex-col md:flex-row gap-x-4 gap-y-4">
      <div className="w-full h-full">
        <div className="w-full grid grid-cols-1 gap-4">
          <InfoCard
            icon={Clock}
            label="In Progress"
            numberOfItems={coursesInProgress.length}
          />
        </div>
        <CoursesList items={[...coursesInProgress]} />
      </div>
      <div className="w-full">
        <div className="w-full grid grid-cols-1 gap-4">
          <InfoCard
            icon={CheckCircle}
            label="Completed"
            numberOfItems={completedCourses.length}
            variant="success"
          />
        </div>
        <CoursesList items={[...completedCourses]} />
      </div>
    </div>
  );
}
